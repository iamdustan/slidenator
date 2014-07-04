// allow jsx to be seamlessly required for view rendering

var port = process.env.PORT || 8000;
require('node-jsx').install({harmony: true});

var Hapi = require('hapi');
var path = require('path');
var server = Hapi.createServer('localhost', port, {
  files: { relativeTo: path.join(__dirname, 'public'), }
});

if (process.env.NODE_ENV === 'development') {
  // TODO: pre-compile this in production
  var webpack = require('webpack');
  var compiler = webpack(require('./webpack.config'));

  compiler.watch(200, function(err, stats) {
    if (err) console.error('watch', err);
    console.info('webpack recompiled');
  });
}

if (!module.parent) {
  server.start(function() {
    console.log('Server started', server.info.uri);
  });
}

var fs = require('fs');
var React = require('react');

var PLACEHOLDER = 'If you see this then something is wrong.';
var TEMPLATE = fs.readFileSync('./assets/index.html', {encoding: 'utf8'});

var App = require('./assets/_index.js');

server.route({
  path: '/',
  method: 'GET',
  config: {
    handler: function(req, reply) {
      if (process.env.NODE_ENV === 'development') TEMPLATE = fs.readFileSync('./assets/index.html', {encoding: 'utf8'});

      var markup = React.renderComponentToString(App());
      reply(TEMPLATE.replace(PLACEHOLDER, markup));
    }
  }
});

// static file server
server.route({
  method: 'GET',
  path: '/public/{path*}',
  handler: {
    // Use './' to test path normalization
    directory: { path: '.' }
  }
});


