var HOC = require('./hoc')

module.exports = function connect (paths, signals, component) {
  if (arguments.length === 2) {
    component = signals
    signals = null
  }

  if (!component) {
    return function (component) {
      return process.env.NODE_ENV === 'test' ? component : HOC(paths, signals, component)
    }
  } else {
    return process.env.NODE_ENV === 'test' ? component : HOC(paths, signals, component)
  }
}
