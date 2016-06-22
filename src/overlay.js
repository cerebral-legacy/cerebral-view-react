var React = require('react')

module.exports = React.createClass({
  propTypes: {
    overlay: React.PropTypes.shape({
      bounds: React.PropTypes.shape({
        left: React.PropTypes.number,
        top: React.PropTypes.number,
        bottom: React.PropTypes.number,
        right: React.PropTypes.number,
        width: React.PropTypes.number,
        height: React.PropTypes.number
      }),
      offset: React.PropTypes.number
    })
  },
  render: function () {
    var overlay = this.props.overlay

    return React.createElement('div', {
      style: {
        position: 'absolute',
        backgroundColor: 'green',
        left: overlay.bounds.left + 'px',
        top: (overlay.bounds.top + overlay.offset) + 'px',
        width: overlay.bounds.width + 'px',
        height: overlay.bounds.height + 'px'
      }
    })
  }
})
