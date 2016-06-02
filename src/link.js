var React = require('react')

module.exports = React.createClass({
  contextTypes: {
    cerebral: React.PropTypes.object
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
  },

  onClick: function (e) {
    e.preventDefault()
    this.signal(this.props.params)
  },

  render: function () {
    var controller = this.context.cerebral.controller
    var router
    var signal
    var signalName

    if (typeof this.props.signal === 'function') {
      signal = this.signal = this.props.signal
      signalName = signal.signalName
    } else {
      signalName = this.props.signal
      signal = this.signal = controller.getSignals(signalName)
    }

    var routerMeta = controller.getModules()['cerebral-module-router']
    if (routerMeta) {
      router = controller.getServices(routerMeta.path)
    }

    if (typeof signal !== 'function') {
      throw new Error('Cerebral React - You have to pass a signal or signal name to the Link component')
    }

    var passedProps = this.props
    var props = Object.keys(passedProps).reduce(function (props, key) {
      props[key] = passedProps[key]
      return props
    }, {})

    if (router && typeof router.getSignalUrl === 'function') {
      props.href = router.getSignalUrl(signalName, this.props.params) || undefined
    } else if (typeof signal.getUrl === 'function') {
      props.href = signal.getUrl(this.props.params || {})
    }
    if (!props.href) {
      props.onClick = this.onClick
    }

    return React.DOM.a(props, this.props.children)
  }
})
