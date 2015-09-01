var React = require('react');

module.exports = function (Component) {
  return function () {
    var state = this.state || {};
    var props = this.props || {};

    var propsToPass = Object.keys(state).reduce(function (props, key) {
      props[key] = state[key];
      return props;
    }, {});

    propsToPass = Object.keys(props).reduce(function (propsToPass, key) {
      propsToPass[key] = props[key];
      return propsToPass;
    }, propsToPass);

    propsToPass.signals = this.signals;
    propsToPass.recorder = this.recorder;
    propsToPass.get = this.get;

    return React.cloneElement(React.createElement(Component, propsToPass), { 'ref': 'Component' });
  };
};
