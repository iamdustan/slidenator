var React = require('react/addons');
var App = require('./_index');

React.renderComponent(App(), document.body);

var first = function(a) { return a[0]; }
var last = function(a) { return a[a.length - 1]; }

function quote(str) {
  var parts = str.split('”');
  var name = last(parts);
  var quote = first(parts) + '”';

  return {
    type: 'quote',
    quote: quote,
    verse: name,
    width: 900,
  }
}

function verse(str) {
  var parts = str.split(' - ');
  var content = last(parts);
  parts = first(parts).split(' ');
  var translation = last(parts);
  parts.pop();
  var verse = parts.join(' ');

  return {
    verse: verse,
    translation: translation,
    content: content,
    width: 900,
  }
}

// intentionally make global
transformToJSON = function transformToJSON(str) {
  function truthy(a) { return a; }

  return str
    .split('\n')
    .filter(truthy)
    .map(function(str) {
      if (str[0] === '“')
        return quote(str);

      return verse(str);
    });
};

