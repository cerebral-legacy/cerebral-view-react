var React = require('react');

module.exports = React.createClass({
  render: function () {

    if (typeof this.props.signal !== 'function') {
      throw new Error('Cerebral React - You have to pass a signal to the LINK component');
    }

    if (typeof this.props.signal.getUrl !== 'function') {
      throw new Error('Cerebral React - The signal passed is not bound to a route');
    }

    var passedProps = this.props;
    var props = Object.keys(passedProps).reduce(function (props, key) {
      props[key] = passedProps[key];
      return props;
    }, {});

    props.href = this.props.signal.getUrl(this.props.params || {});

    return React.DOM.a(props, this.props.children)
  }
});
