var React = require('react')
var callbacks = []
var currentController = null

var currentUpdateLoopId = 0

function hasChanged(path, changes) {
  path = Array.isArray(path) ? path : path.split('.');
  return path.reduce(function (changes, key) {
    return changes ? changes[key] : false;
  }, changes);
}

module.exports = {
  contextTypes: {
    controller: React.PropTypes.object
  },
  componentWillMount: function () {
    this.signals = this.context.controller.isServer ? {} : this.context.controller.getSignals()
    this.modules = this.context.controller.isServer ? {} : this.context.controller.getModules()

    var statePaths = this.getStatePaths ? this.getStatePaths(this.props) : {}
    if (!Object.keys(statePaths).length) {
      return
    }

    if (this.context.controller.isServer) {
      return this._update()
    }

    if (currentController !== this.context.controller) {
      if (currentController) {
        currentController.removeListener('flush', this.listener)
      }
      currentController = this.context.controller
      this.context.controller.on('flush', this.listener)
    }
    callbacks.push(this._update)
  },
  listener: function (changes) {
    var runningLoopId = ++currentUpdateLoopId
    var scopedRun = function (runningLoopId) {
      var nextCallbackIndex = -1
      var runNextCallback = function () {
        if (currentUpdateLoopId !== runningLoopId) {
          return
        }
        nextCallbackIndex++
        if (!callbacks[nextCallbackIndex]) {
          return
        }
        callbacks[nextCallbackIndex]({
          next: runNextCallback,
          changes: changes
        })
      }
      runNextCallback()
    }
    scopedRun(runningLoopId)
  },
  componentWillUnmount: function () {
    this._isUmounting = true

    var statePaths = this.getStatePaths ? this.getStatePaths(this.props) : {}
    if (Object.keys(statePaths).length) {
      callbacks.splice(callbacks.indexOf(this._update), 1)
    }
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    // We control rendering ourselves
    return false;
  },
  getProps: function () {
    var controller = this.context.controller;
    var props = this.props || {}
    var paths = this.getStatePaths ? this.getStatePaths(this.props) : {}

    var propsToPass = Object.keys(paths || {}).reduce(function (props, key) {
      props[key] = paths[key].hasChanged ? paths[key].get(controller.get()) : controller.get(paths[key]);
      return props
    }, {})

    propsToPass = Object.keys(props).reduce(function (propsToPass, key) {
      propsToPass[key] = props[key]
      return propsToPass
    }, propsToPass)



    propsToPass.signals = this.signals
    propsToPass.modules = this.modules

    return propsToPass
  },
  _update: function (stateUpdate, propsUpdate) {
    if (this._isUmounting || this._lastUpdateLoopId === currentUpdateLoopId) {
      return
    }

    var hasChange = false;
    if (stateUpdate) {
      var paths = this.getStatePaths ? this.getStatePaths(propsUpdate || this.props) : {}
      for (var key in paths) {
        if (
          (paths[key].hasChanged && paths[key].hasChanged(stateUpdate.changes)) ||
          (!paths[key].hasChanged && hasChanged(paths[key], stateUpdate.changes))
        ) {
          hasChange = true; // Have to check all due to updating computed
        }
      }
    } else {
      var oldPropKeys = Object.keys(this.props);
      var newPropKeys = Object.keys(propsUpdate);
      if (oldPropKeys.length !== newPropKeys.length) {
        hasChange = true;
      } else {
        for (var i = 0; i < newPropKeys.length; i++) {
          if (this.props[newPropKeys[i]] !== propsUpdate[newPropKeys[i]]) {
            hasChange = true
            break
          }
        }
      }
    }


    if (stateUpdate) {
      this._lastUpdateLoopId = currentUpdateLoopId
      hasChange && this.forceUpdate()
      stateUpdate.next()
    } else {
      hasChange && this.forceUpdate()
    }
  }
}
