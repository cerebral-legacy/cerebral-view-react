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
    if (this.getStatePaths || this.getComputedPaths) {
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
    var computedPaths = this.getComputedPaths ? this.getComputedPaths() : {};
    var controller = this.context.controller;
    var newState = {};

    newState = Object.keys(statePaths).reduce(function (newState, key) {
      if (!Array.isArray(statePaths[key])) {
        throw new Error('Cerebral-React - You have to pass an array as state path ' + statePaths[key] + ' is not valid');
      }
      newState[key] = controller.get(statePaths[key]);;
      return newState;
    }, newState);

    newState = Object.keys(computedPaths).reduce(function (newState, key) {
      if (!Array.isArray(computedPaths[key])) {
        throw new Error('Cerebral-React - You have to pass an array as a computed path ' + computedPaths[key] + ' is not valid');
      }
      newState[key] = controller.getComputedValue(computedPaths[key]);;
      return newState;
    }, newState);

    this.setState(newState);
  }
};
