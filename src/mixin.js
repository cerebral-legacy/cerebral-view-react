var React = require('react');

module.exports = {
  contextTypes: {
    controller: React.PropTypes.object
  },
  componentWillMount: function () {
    console.log(this.context);
    this.signals = this.context.controller.signals;
    this.recorder = this.context.controller.recorder;
    this.get = this.context.controller.get;
    this.context.controller.eventEmitter.on('change', this._update);
    this.context.controller.eventEmitter.on('remember', this._update);
    this._update(this.context.controller.get([]));
  },
  componentWillUnmount: function () {
    this._isUmounting = true;
    this.context.controller.eventEmitter.removeListener('change', this._update);
    this.context.controller.eventEmitter.removeListener('remember', this._update);
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
  _update: function (state) {
    if (this._isUmounting || !this.getStatePaths) {
      return;
    }
    var statePaths = this.getStatePaths();
    var newState = Object.keys(statePaths).reduce(function (newState, key) {
      newState[key] = Value(statePaths[key], state);
      return newState;
    }, {});
    this.setState(newState);
  }
};
