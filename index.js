
var port = +(process.env.PORT || 8000);

// allow jsx to be seamlessly required for view rendering
require('node-jsx').install({harmony: true});

var Hapi = require('hapi');
var path = require('path');
var server = Hapi.createServer(port, '0.0.0.0', {
  files: { relativeTo: path.join(__dirname, 'public'), }
});

var webpack = require('webpack');
var compiler = webpack(require('./webpack.config'));

switch (process.env.NODE_ENV) {
case 'development':
  compiler.watch(200, function(err, stats) {
    if (err) console.error('watch', err);
    console.info('webpack recompiled');
  });
  break;

default:
  console.info('Webpack: compilation: started.');
  compiler.run(function(err, stats) {
    if (err) {
      console.error('Failed to compile assets');
      throw err;
    }
    console.info('Webpack compilation: complete.');
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

// React app.
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

server.route({
  path: '/favicon.ico',
  method: 'GET',
  config: {
    handler: function(req, reply) {
      reply().code(204);
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


