// webpack.config.js
const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, 'public'),
  entry: __dirname + '/public/javascripts/script.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
    //libraryTarget: "umd"

  },
  /*node:{
    net: "empty",
    child_process: "empty",
    tls: "empty",
    fs: "empty"
  },*/
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'public'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { loose: true, modules: false }]
          ]
        }
      }]
    }]
  }
}

module.exports = config;
