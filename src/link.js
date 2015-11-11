var React = require('react');

module.exports = React.createClass({
  contextTypes: {
    controller: React.PropTypes.object
  },

  componentWillMount() {

    if (typeof this.props.signal === 'string') {
      var signalPath = this.props.signal.split('.');
      var signalParent = this.context.controller.signals;

      while(signalPath.length - 1) {
        signalParent = signalParent[signalPath.shift()] || {};
      }
      this.signal = signalParent[signalPath];
    } else {
      this.signal = this.props.signal;
    }

    if (typeof this.signal !== 'function') {
      throw new Error('Cerebral React - You have to pass a signal to the Link component');
    }

  },

  onClick: function (e) {

    e.preventDefault();
    this.signal(this.props.params);

  },

  render: function () {

    var passedProps = this.props;
    var props = Object.keys(passedProps).reduce(function (props, key) {
      props[key] = passedProps[key];
      return props;
    }, {});

    if (typeof this.signal.getUrl === 'function') {
      props.href = this.signal.getUrl(this.props.params || {});
    } else {
      props.onClick = this.onClick;
    }

    return React.DOM.a(props, this.props.children);
  }
});
