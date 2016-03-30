var React = require('react')
var mixin = require('./mixin.js')

module.exports = function (Component, paths) {
  return React.createClass({
    displayName: Component.name + 'Container',
    mixins: [mixin],
    componentWillReceiveProps: function (nextProps) {
      this._update(null, nextProps)
    },
    getStatePaths: function (props) {
      if (!paths) {
        return {}
      }
      return typeof paths === 'function' ? paths(props) : paths
    },
    render: function () {
      return React.createElement(Component, this.getProps())
    }
  })
}
