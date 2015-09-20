var React = require('react');
var callbacks = [];
var listener = false;

module.exports = {
  contextTypes: {
    controller: React.PropTypes.object
  },
  componentWillMount: function () {
    this.signals = this.context.controller.signals;

    if (!this.getStatePaths) {
      return;
    }

    this.get = this.context.controller.get;
    if (!listener) {
      listener = true;
      this.context.controller.on('change', function () {
        callbacks.forEach(function (cb) {
          cb();
        });
      });
    }
    callbacks.push(this._update);
    this._update(this.context.controller.get([]));
  },
  componentWillUnmount: function () {
    this._isUmounting = true;
    if (this.getStatePaths) {
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
    var statePaths = this.getStatePaths();
    var controller = this.context.controller;
    var newState = Object.keys(statePaths).reduce(function (newState, key) {
      if (!Array.isArray(statePaths[key])) {
        throw new Error('Cerebral-React - You have to pass an array as state path ' + statePaths[key] + ' is now valid');
      }
      newState[key] = controller.get(statePaths[key]);
      return newState;
    }, {});
    this.setState(newState);
  }
};
