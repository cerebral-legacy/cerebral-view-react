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
      var propsWithModules = Object.keys(props).reduce(function (propsWithModules, key) {
        propsWithModules[key] = props[key]
        return propsWithModules
      }, {modules: this.modules})
      return typeof paths === 'function' ? paths(propsWithModules) : paths
    },
    render: function () {
      return React.createElement(Component, this.getProps())
    }
  })
}
