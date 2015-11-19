var React = require('react');
var mixin = require('./mixin.js');
var render = require('./render.js');

module.exports = function (paths, computedPaths) {
  return function (Component) {
    return React.createClass({
      displayName: Component.name + 'Container',
      mixins: [mixin],
      getStatePaths: function () {
        if (!paths) {
          return {};
        }
        return typeof paths === 'function' ? paths(this.props) : paths;
      },
      render: render(Component)
    });
  };
};
