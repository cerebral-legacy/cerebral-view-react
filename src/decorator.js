var Hoc = require('./hoc.js')

module.exports = function (paths) {
  return function (Component) {
    return Hoc(Component, paths)
  }
}
