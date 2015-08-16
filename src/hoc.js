var React = require('react');
var mixin = require('./mixin.js');
var render = require('./render.js');

module.exports = function (Component, paths) {
  return React.createClass({
    displayName: Component.name + 'Container',
    mixins: [Mixin],
    getStatePaths: typeof paths === 'function' ? paths : function () {
      return paths || {};
    },
    render: render(Component)
  });
};
