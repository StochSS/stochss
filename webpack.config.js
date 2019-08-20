const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    home: './client/pages/home.js',
    browser: './client/pages/model-browser.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, "dist")
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'StochSS | Home',
      filename: 'stochss-home.html',
      template: 'handlers/page_template.pug',
      name: 'home',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Model Browser',
      filename: 'stochss-model-browser.html',
      template: 'handlers/page_template.pug',
      name: 'browser',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Model Editor',
      filename: 'stochss-model-editor.html',
      template: 'handlers/page_template.pug',
      name: 'editor',
      inject: false
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'common',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },
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
