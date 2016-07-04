var HOC = require('./hoc')

module.exports = function connect (paths, component) {
  if (!component) {
    return function (component) {
      return HOC(paths, component)
    }
  } else {
    return HOC(paths, component)
  }
}
