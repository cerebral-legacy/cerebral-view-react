var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');

var config = {
  entry: path.resolve(__dirname, 'app/main.js'),
  devtool: 'eval-source-map',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'controller': path.resolve(__dirname, 'index.js')
    }
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.js$/,
      loader: 'babel?optional=es7.decorators',
      exclude: node_modules
    }]
  }
};

module.exports = config;
