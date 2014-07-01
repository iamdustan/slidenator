
var path = require('path');
var STATIC_ROOT = 'public/'; // Public URL where statics live

module.exports = {
  cache: true,
  entry: './assets/index',
  output: {
    path: path.join(__dirname, STATIC_ROOT),
    filename: 'app.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader?harmony'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.css', 'styl', '.png', '.jpg', '.gif'],
    modulesDirectories: ['./node_modules']
  },
  devtool: 'source-map'
};

