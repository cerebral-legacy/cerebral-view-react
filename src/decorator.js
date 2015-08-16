var React = require('react');
var mixin = require('./mixin.js');
var render = require('./render.js');

module.exports = function (paths) {
  return function (Component) {
    return React.createClass({
      displayName: Component.name + 'Container',
      mixins: [mixin],
      getStatePaths: typeof paths === 'function' ? paths : function () {
        return paths || {};
      },
      render: render(Component)
    });
  };
};
