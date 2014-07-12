/** @jsx React.DOM */

var React = require('react/addons');
var Ripple = require('./react-ripple');

var RippleButton = React.createClass({

  render: function() {
    return (
      <button onClick={this.props.onClick}>
        {this.props.children}
        <Ripple />
      </button>
    );
  }
});

module.exports = RippleButton;

