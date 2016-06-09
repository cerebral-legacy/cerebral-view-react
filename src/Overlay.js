var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function () {
    var overlay = this.props.overlay;

    return React.createElement('div', {
      style: {
        position: 'absolute',
        backgroundColor: 'green',
        left: overlay.bounds.left + 'px',
        top: (overlay.bounds.top + overlay.offset) + 'px',
        width: overlay.bounds.width + 'px',
        height: overlay.bounds.height + 'px'
      }
    });
  }
});
