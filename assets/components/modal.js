/** @jsx React.DOM */

var React = require('react/addons');

var Modal = React.createClass({
  componentDidMount: function() {},

  componentWillReceiveProps: function(props) {
    console.log('componentWillReceiveProps');
  },

  render: function() {
    var modalClass = (this.props.title || this.props.childen) ? 'modal--is-open' : '';

    return (
      <div>
        <div className={"modal " + modalClass} role="dialog">
          <div className="modal__header">
            {this.props.title}
            <button className="modal__close" onClick={this.props.cancelHandler}>&times;</button>
          </div>
          <div className="modal__content">
            {this.props.children}
          </div>
        </div>
        <div className="backdrop" />
      </div>
    );
  }
});

module.exports = Modal;

