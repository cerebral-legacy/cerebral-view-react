var React = require('react')
var mixin = require('./mixin.js')
var Hoc = require('./hoc.js')

module.exports = function (paths) {
  return function (Component) {
    return Hoc(Component, paths)
  }
}
