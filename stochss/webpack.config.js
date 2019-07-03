const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './client/app.js',
  output: {
    filename: 'app.bundle.js',
    // Beware! EVERYTHING in the following directory will be 
    // DESTROYED to make way for the bundle's awesome power!
    path: path.resolve(__dirname, " ./dist")
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'StochSS [DEV]'
    })
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [ 'pug-loader' ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
