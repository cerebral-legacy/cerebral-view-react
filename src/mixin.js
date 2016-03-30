var React = require('react')
var callbacks = []
var listener = false

var currentUpdateLoopId = 0

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

    if (!listener) {
      listener = true
      this.context.controller.on('change', function () {
        var callbacksCount = callbacks.length
        var nextCallbackIndex = -1
        var runningLoopId = ++currentUpdateLoopId
        var runNextCallback = function () {
          if (currentUpdateLoopId !== runningLoopId) {
            return
          }
          nextCallbackIndex++
          if (nextCallbackIndex === callbacksCount) {
            return
          }
          callbacks[nextCallbackIndex](runNextCallback)
        }
        runNextCallback()
      })
    }
    callbacks.push(this._update)
    this._update()
  },
  componentWillUnmount: function () {
    this._isUmounting = true

    var statePaths = this.getStatePaths ? this.getStatePaths(this.props) : {}
    if (Object.keys(statePaths).length) {
      callbacks.splice(callbacks.indexOf(this._update), 1)
    }
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    var propKeys = Object.keys(nextProps || {})
    var stateKeys = Object.keys(nextState || {})

    // props
    for (var i = 0; i < propKeys.length; i++) {
      if (this.props[propKeys[i]] !== nextProps[propKeys[i]]) {
        return true
      }
    }

    // State
    for (var j = 0; j < stateKeys.length; j++) {
      if (this.state[stateKeys[j]] !== nextState[stateKeys[j]]) {
        return true
      }
    }
    return false
  },
  getProps: function () {
    var state = this.state || {}
    var props = this.props || {}

    var propsToPass = Object.keys(state).reduce(function (props, key) {
      props[key] = state[key]
      return props
    }, {})

    propsToPass = Object.keys(props).reduce(function (propsToPass, key) {
      propsToPass[key] = props[key]
      return propsToPass
    }, propsToPass)

    propsToPass.signals = this.signals
    propsToPass.modules = this.modules
    propsToPass.get = this.get // Uhm?

    return propsToPass
  },
  _update: function (nextUpdate, props) {
    if (this._isUmounting || this._lastUpdateLoopId === currentUpdateLoopId) {
      return
    }
    this._lastUpdateLoopId = currentUpdateLoopId

    var statePaths = this.getStatePaths ? this.getStatePaths(props || this.props) : {}
    var controller = this.context.controller
    var newState = {}

    newState = Object.keys(statePaths).reduce(function (newState, key) {
      var value = controller.get(typeof statePaths[key] === 'string' ? statePaths[key].split('.') : statePaths[key])
      newState[key] = value
      return newState
    }, newState)

    if (nextUpdate) {
      this.setState(newState, nextUpdate)
    } else {
      this.setState(newState)
    }
  }
}
