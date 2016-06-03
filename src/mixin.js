var React = require('react')

module.exports = {
  contextTypes: {
    cerebral: React.PropTypes.object
  },
  componentWillMount: function () {
    this.signals = this.context.cerebral.controller.isServer ? {} : this.context.cerebral.controller.getSignals()
    this.modules = this.context.cerebral.controller.isServer ? {} : this.context.cerebral.controller.getModules()

    var statePaths = this.getStatePaths ? this.getStatePaths(this.props) : {}
    if (!Object.keys(statePaths).length) {
      return
    }
    this.context.cerebral.registerComponent(this, this.getDepsMap(this.props));
  },
  componentWillUnmount: function () {
    this._isUmounting = true
    this.context.cerebral.unregisterComponent(this);
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    // We only allow forced render by change of props passed
    // or Container tells it to render
    return false;
  },
  getProps: function () {
    var controller = this.context.cerebral.controller;
    var props = this.props || {}
    var paths = this.getStatePaths ? this.getStatePaths(this.props) : {}

    var propsToPass = Object.keys(paths || {}).reduce(function (props, key) {
      props[key] = paths[key].getDepsMap ? paths[key].get(controller.get()) : controller.get(paths[key]);
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
  _update: function (showOverlay) {
    if (this._isUmounting) {
      return;
    }
    if (showOverlay && !this.showingOverlay) {
      this.showOverlay = true;
    }

    this.forceUpdate();
  }
}
