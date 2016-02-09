var React = require('react')
var mixin = require('./mixin.js')

module.exports = function (Component, paths) {
  return React.createClass({
    displayName: Component.name + 'Container',
    mixins: [mixin],
    getStatePaths: function () {
      if (!paths) {
        return {}
      }
      return typeof paths === 'function' ? paths(this.getProps()) : paths
    },
    render: function () {
      return React.createElement(Component, this.getProps())
    }
  })
}
