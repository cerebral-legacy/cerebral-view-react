var React = require('react');

module.exports = React.createClass({
  displayName: 'CerebralContainer',
  childContextTypes: {
    controller: React.PropTypes.object.isRequired
  },
  componentWillMount: function () {
    this.props.controller.devtools.start();
  },
  getChildContext: function () {
    return {
      controller: this.props.controller
    }
  },
  render: function () {
    return React.cloneElement(React.createElement(this.props.app), { 'ref': 'App' });
  }
});
