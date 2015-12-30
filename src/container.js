var React = require('react');

module.exports = React.createClass({
  displayName: 'CerebralContainer',
  childContextTypes: {
    controller: React.PropTypes.object.isRequired
  },
  componentDidMount: function () {
    this.props.controller.devtools.start();
    if (this.props.controller.services.router) {
      this.props.controller.services.router.trigger();
    }
  },
  getChildContext: function () {
    return {
      controller: this.props.controller
    }
  },
  render: function () {
    return this.props.app ? React.createElement(this.props.app) : React.DOM.div(this.props);
  }
});
