/** @jsx React.DOM */

var React = require('react/addons');
var Ripple = require('./react-ripple');

var RippleButton = React.createClass({

  render: function() {
    var node = this.props.node || React.DOM.button;
    return (
      <node name={this.props.name} value={this.props.value} href={this.props.href} onClick={this.props.onClick} className="button">
        {this.props.children}
        <Ripple />
      </node>
    );
  }
});

module.exports = RippleButton;

