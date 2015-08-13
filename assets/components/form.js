/** @jsx React.DOM */

var React = require('react/addons');
var Joi = require('joi');
var RippleButton = require('./ripple-button');

var Form = React.createClass({

  getInitialState: function() {
    return {};
  },

  handleChange: function(e) {
    var o = {}, self = this;
    o[e.target.name] = e.target.value;

    if (e.target.type === 'number')
      o[e.target.name] = Number(e.target.value);

    if (typeof this.props.onChange === 'function') {
      setTimeout(function() {
        self.props.onChange(o);
      });
    }
    else this.setState(o);
    // this.setState(o);

    return;
  },

  generateFieldset: function(definition) {
    var key = 'fieldset-' + definition.key;
    var className = 'fieldset';

    switch (definition.schema._type) {
    case 'string':
      if (definition.key === 'content') {
        return (
          <div key={key} className={className}>
            <label>{definition.key}</label>
            <textarea name={definition.key} value={this.state[definition.key] || ''} onChange={this.handleChange} />
          </div>
        );
      }

      return (
        <div key={key} className={className}>
          <label>{definition.key}</label>
          <input name={definition.key} type="string" value={this.state[definition.key]} onChange={this.handleChange} />
        </div>
      );
    case 'number':
      return (
        <div key={key} className={className}>
          <label>{definition.key}</label>
          <input name={definition.key} type="number" max={definition.max} min={definition.min} step={definition.step} value={this.state[definition.key]} onChange={this.handleChange} />
        </div>
      );
    default:
      console.log('Unhandled field type: %s', definition.schema._type);
      return (
        <div key={key} className={className}>
          <label>{definition.key}</label>
          <input name={definition.key} type="string" value={this.state[definition.key]} onChange={this.handleChange}/>
        </div>
      );
    }
  },

  generateForm: function() {
    var fields = this.props.schema._inner.children;
    var html = fields.map(this.generateFieldset);
    return html;
  },

  validate: function(e) {
    e.preventDefault();

    var result = Joi.validate(this.state, this.props.schema);
    if (result.error) {
      console.log('TODO: handle validation errors', result);
    }
    else {
      this.props.onSuccess(this.state);
    }
  },

  componentWillReceiveProps: function(props) {
    if (props.data) {
      this.setState(props.data);
    }
  },

  render: function() {
    var legend = this.props.title ? <legend>{this.props.title}</legend> : <noscript />;
    return (
      <form onSubmit={this.validate}>
        {legend}
        {this.generateForm()}
        <div className="form__actions">
          <RippleButton onClick={this.removeSlide}>{this.props.submitLabel || 'Submit'}</RippleButton>
        </div>
      </form>
    );
  }
});

module.exports = Form;

