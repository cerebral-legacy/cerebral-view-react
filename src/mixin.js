var React = require('react');
var callbacks = [];
var listener = false;

module.exports = {
  contextTypes: {
    controller: React.PropTypes.object
  },
  componentWillMount: function () {
    this.signals = this.context.controller.getSignals();
    this.modules = this.context.controller.getModules();

    var statePaths = this.getStatePaths ? this.getStatePaths() : {};
    if(!Object.keys(statePaths).length) {
      return;
    }

    if (this.context.controller.isServer) {
      return this._update();
    }

    if (!listener) {
      listener = true;
      this.context.controller.on('change', function () {
        callbacks.forEach(function (cb) {
          cb();
        });
      });
    }
    callbacks.push(this._update);
    this._update();
  },
  componentWillUnmount: function () {
    this._isUmounting = true;

    var statePaths = this.getStatePaths ? this.getStatePaths() : {};
    if(Object.keys(statePaths).length) {
      callbacks.splice(callbacks.indexOf(this._update), 1);
    }
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    var propKeys = Object.keys(nextProps);
    var stateKeys = Object.keys(nextState);

    // props
    for (var x = 0; x < propKeys.length; x++) {
      var key = propKeys[x];
      if (this.props[key] !== nextProps[key]) {
        return true;
      }
    }

    // State
    for (var x = 0; x < stateKeys.length; x++) {
      var key = stateKeys[x];
      if (this.state[key] !== nextState[key]) {
        return true;
      }
    }

    return false;
  },
  _update: function () {
    if (this._isUmounting) {
      return;
    }
    var statePaths = this.getStatePaths ? this.getStatePaths() : {};
    var controller = this.context.controller;
    var newState = {};

    newState = Object.keys(statePaths).reduce(function (newState, key) {
      var value = controller.get(statePaths[key]);
      newState[key] = value;
      return newState;
    }, newState);

    this.setState(newState);
  }
};
