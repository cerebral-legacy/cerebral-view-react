var React = require('react');

module.exports = React.createClass({
  componentDidMount() {

    if (typeof this.props.signal === 'function') {
      this.signal = this.props.signal;
    } else {
      throw new Error('Cerebral React - You have to pass a signal to the LINK component');
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

    if (typeof this.props.signal.getUrl === 'function') {
      props.href = this.props.signal.getUrl(this.props.params || {});
    } else {
      props.onClick = this.onClick;
    }

    return React.DOM.a(props, this.props.children);
  }
});
