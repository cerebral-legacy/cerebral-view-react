var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  componentDidUpdate: function(prevProps) {
    if (this.props.overlay.shouldRender) {
      this.showRender();
    }
  },
  componentDidMount: function() {
    if (this.props.shouldRender) {
      this.showRender();
    }
  },
  showRender: function() {
    var component = this;
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    this.renderTimeout = setTimeout(function () {
      component.hideRender();
    }, 1000);
    ReactDOM.findDOMNode(this).style.backgroundColor = 'green';
  },
  hideRender() {
    ReactDOM.findDOMNode(this).style.backgroundColor = '#333';
    this.renderTimeout = null;
  },
  render: function () {
    return React.createElement('div', {
      style: {
        backgroundColor: '#333',
        border: '1px solid black',
        borderRadius: '2px',
        padding: '2px',
        boxSizing: 'border-box',
        color: '#FFF',
        marginRight: '2px',
        fontSize: '10px',
        transition: 'background-color 0.2s ease-out'
      }
    }, this.props.overlay.name);
  }
});
