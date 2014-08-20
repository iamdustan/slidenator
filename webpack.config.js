
var path = require('path');
var STATIC_ROOT = 'public/'; // Public URL where statics live

module.exports = {
  cache: true,
  entry: {
    app: './assets/index',
    marketing: './assets/_marketing'
  },
  output: {
    path: path.join(__dirname, STATIC_ROOT),
    filename: '[name].js'
  },
  stats: {
    colors: true,
    reasons: true
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.js$/, loader: 'jsx-loader?harmony'},
    ]
  },
  resolve: {
    extensions: ['', '.js', '.css', 'styl', '.png', '.jpg', '.gif'],
    modulesDirectories: ['./node_modules']
  },
  devtool: 'source-map'
};

