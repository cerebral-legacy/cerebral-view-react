var React = require('react');
var mixin = require('./mixin.js');
var render = require('./render.js');

module.exports = function (Component, paths, computedPaths) {
  return React.createClass({
    displayName: Component.name + 'Container',
    mixins: [mixin],
    getStatePaths: function () {
      if (!paths) {
        return {};
      }
      return typeof paths === 'function' ? paths(this.props) : paths;
    },
    getComputedPaths: function () {
      if (!computedPaths) {
        return {};
      }
      return typeof computedPaths === 'function' ? computedPaths(this.props) : computedPaths;
    },
    render: render(Component)
  });
};
