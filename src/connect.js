var HOC = require('./hoc')

module.exports = function connect (paths, component) {
  if (!component) {
    return function (component) {
      return process.env.NODE_ENV === 'test' ? component : HOC(paths, component)
    }
  } else {
    return process.env.NODE_ENV === 'test' ? component : HOC(paths, component)
  }
}
