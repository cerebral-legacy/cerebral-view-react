var React = require('react');
var mixin = require('./mixin.js');
var render = require('./render.js');

module.exports = function () {

  var paths;
  var componentDefinition;
  var Component = null;

  if (arguments.length === 2) {
    paths = arguments[0];
    componentDefinition = arguments[1];
  } else {
    paths = {};
    componentDefinition = arguments[0];
  }

  if (typeof componentDefinition === 'function') {
    Component = componentDefinition;
  } else {
    Component = React.createClass(componentDefinition);
  }
  
  return React.createClass({
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
