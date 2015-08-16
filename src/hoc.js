var React = require('react');
var mixin = require('./mixin.js');
var render = require('./render.js');

module.exports = function (Component, paths) {
  return React.createClass({
    displayName: Component.name + 'Container',
    mixins: [Mixin],
    getStatePaths: function () {
      if (!paths) {
        return {};
      }
      return typeof paths === 'function' ? paths(this.props) : paths;
    },
    render: render(Component)
  });
};
