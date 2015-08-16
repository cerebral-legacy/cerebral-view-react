var React = require('react');

var getValue = function (path, obj) {
  path = path.slice();
  while (path.length) {
    obj = obj[path.shift()];
  }
  return obj;
};

module.exports = {
  contextTypes: {
    controller: React.PropTypes.object
  },
  componentWillMount: function () {
    this.signals = this.context.controller.signals;
    this.recorder = this.context.controller.recorder;
    this.get = this.context.controller.get;
    this.context.controller.on('change', this._update);
    this.context.controller.on('remember', this._update);
    this._update(this.context.controller.get([]));
  },
  componentWillUnmount: function () {
    this._isUmounting = true;
    this.context.controller.removeListener('change', this._update);
    this.context.controller.removeListener('remember', this._update);
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
    if (this._isUmounting || !this.getStatePaths) {
      return;
    }
    var statePaths = this.getStatePaths();
    var state = this.context.controller.get();
    var newState = Object.keys(statePaths).reduce(function (newState, key) {
      newState[key] = getValue(statePaths[key], state);
      return newState;
    }, {});
    this.setState(newState);
  }
};
