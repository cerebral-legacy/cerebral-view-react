var React = require('react')
var cleanPath = require('./cleanPath')

function extractDeps (deps, allDeps) {
  return Object.keys(deps).reduce(function (depsMap, key) {
    if (deps[key].getDepsMap) {
      return extractDeps(deps[key].getDepsMap(), allDeps)
    } else {
      var depsKey = Array.isArray(deps[key]) ? deps[key].join('.') : deps[key]
      depsMap[depsKey] = true
    }
    return depsMap
  }, allDeps)
}

function propsDiffer (previousProps, nextProps) {
  var oldPropKeys = Object.keys(previousProps)
  var newPropKeys = Object.keys(nextProps)
  var hasChange = false

  if (oldPropKeys.length !== newPropKeys.length) {
    hasChange = true
  } else {
    for (var i = 0; i < newPropKeys.length; i++) {
      if (previousProps[newPropKeys[i]] !== nextProps[newPropKeys[i]]) {
        hasChange = true
        break
      }
    }
  }

  return hasChange
}

function getSignalStub (signalName) {
  function stubSignal () {
    // TODO: improve wording, provide at least component and signal names in warning
    console.warn('Cerebral - it is not supposed to run signals with ServerController.')
  }

  stubSignal.signalName = signalName

  return stubSignal
}

module.exports = function (paths, signals, Component) {
  return React.createClass({
    displayName: 'CerebralWrapping_' + (Component.displayName || Component.name),

    contextTypes: {
      cerebral: React.PropTypes.object
    },

    componentWillMount: function () {
      if (!this.context.cerebral || !this.context.cerebral.controller) {
        throw new Error('Can not find Cerebral controller, did you remember to use the Container component? Read more at: http://www.cerebraljs.com/documentation/cerebral-view-react')
      }

      this.signals = this.context.cerebral.controller.isServer ? {} : this.context.cerebral.controller.getSignals()
      this.modules = this.context.cerebral.controller.isServer ? {} : this.context.cerebral.controller.getModules()

      var statePaths = this.getStatePaths ? this.getStatePaths(this.props) : {}
      if (!Object.keys(statePaths).length) {
        return
      }
      this.context.cerebral.registerComponent(this, this.getDepsMap(this.props))
    },

    componentWillReceiveProps: function (nextProps) {
      var hasChange = propsDiffer(this.props, nextProps)

      // If dynamic paths, we need to update them
      if (
        typeof paths === 'function' &&
        propsDiffer(this.getDepsMap(this.props), this.getDepsMap(nextProps))
      ) {
        this.context.cerebral.updateComponent(this, this.getDepsMap(nextProps))
      } else {
        hasChange && this._update()
      }
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      // We only allow forced render by change of props passed
      // or Container tells it to render
      return false
    },

    componentWillUnmount: function () {
      this._isUmounting = true
      this.context.cerebral.unregisterComponent(this)
    },

    getDepsMap: function (props) {
      if (!paths) {
        return {}
      }
      var propsWithModules = this.getPropsWithModules(props)
      var deps = typeof paths === 'function' ? paths(propsWithModules) : paths

      return extractDeps(deps, {})
    },

    getProps: function () {
      var controller = this.context.cerebral.controller
      var props = this.props || {}
      var paths = this.getStatePaths ? this.getStatePaths(this.props) : {}

      var propsToPass = Object.keys(paths || {}).reduce(function (props, key) {
        props[key] = paths[key].getDepsMap ? paths[key].get(controller.get()) : controller.get(cleanPath(paths[key]))
        return props
      }, {})

      propsToPass = Object.keys(props).reduce(function (propsToPass, key) {
        propsToPass[key] = props[key]
        return propsToPass
      }, propsToPass)

      if (signals) {
        propsToPass = Object.keys(signals).reduce(function (props, key) {
          props[key] = controller.isServer
            ? getSignalStub(signals[key])
            : controller.getSignals(signals[key])

          return props
        }, propsToPass)
      } else {
        // expose all signals
        propsToPass.signals = this.signals
      }
      propsToPass.modules = this.modules

      return propsToPass
    },

    getPropsWithModules: function (props) {
      return Object.keys(props).reduce(function (propsWithModules, key) {
        propsWithModules[key] = props[key]
        return propsWithModules
      }, {modules: this.modules})
    },

    getStatePaths: function (props) {
      if (!paths) {
        return {}
      }
      var propsWithModules = Object.keys(props).reduce(function (propsWithModules, key) {
        propsWithModules[key] = props[key]
        return propsWithModules
      }, {modules: this.modules})
      return typeof paths === 'function' ? paths(propsWithModules) : paths
    },

    _update: function () {
      this._isUmounting || this.forceUpdate()
    },

    render: function () {
      return React.createElement(Component, this.getProps())
    }
  })
}
