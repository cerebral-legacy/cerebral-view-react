var React = require('react')
var get = require('lodash.get')

module.exports = React.createClass({
  contextTypes: {
    controller: React.PropTypes.object
  },

  propTypes: {
    children: React.PropTypes.node,
    params: React.PropTypes.object,
    signal: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string
    ]).isRequired
  },

  componentWillMount: function () {
    var controller = this.context.controller

    if (typeof this.props.signal === 'function') {
      this.signal = this.props.signal
      this.signalName = this.signal.name
    } else {
      this.signalName = this.props.signal
      this.signal = get(controller.getSignals(), this.signalName)
    }

    var routerMeta = controller.getModules()['cerebral-module-router']
    if (routerMeta) {
      this.router = get(controller.getServices(), routerMeta.name)
    }

    if (typeof this.signal !== 'function') {
      throw new Error('Cerebral React - You have to pass a signal or signal name to the Link component')
    }
  },

  onClick: function (e) {
    e.preventDefault()
    this.signal(this.props.params)
  },

  render: function () {
    var passedProps = this.props
    var props = Object.keys(passedProps).reduce(function (props, key) {
      props[key] = passedProps[key]
      return props
    }, {})

    if (this.router && typeof this.router.getSignalUrl === 'function') {
      props.href = this.router.getSignalUrl(this.signalName, this.props.params)
    } else if (typeof this.signal.getUrl === 'function') {
      props.href = this.signal.getUrl(this.props.params || {})
    } else {
      props.onClick = this.onClick
    }

    return React.DOM.a(props, this.props.children)
  }
})
