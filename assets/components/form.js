/** @jsx React.DOM */

var React = require('react/addons');
var Joi = require('joi');

var Form = React.createClass({

  getInitialState: function() {
    return {};
  },

  handleChange: function(e) {
    var o = {};
    o[e.target.name] = e.target.value;
    this.setState(o);
    return;
  },

  generateFieldset: function(definition) {
    var key = 'fieldset-' + definition.key;
    var className = 'fieldset';

    switch (definition.schema._type) {
    case 'string':
      if (definition.key === 'Content') {
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

  render: function() {
    return (
      <form onSubmit={this.validate}>
        <legend>Auto generated form</legend>
        {this.generateForm()}
        <div className="form__actions">
          <button type="submit">{this.props.submitLabel || 'Submit'}</button>
        </div>
      </form>
    );
  }
});

module.exports = Form;

