const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    home: './client/pages/home.js',
    jobPresentation: './client/pages.job-presentation.js'
  },
  output: {
    filename: 'stochss-[name].bundle.js',
    path: path.resolve(__dirname, 'jupyterhub/static')
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'StochSS | Home',
      filename: '../templates/stochss-home.html',
      template: 'jupyterhub/home_template.pug',
      name: 'home',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Job Presentation',
      filename: '../templates/stochss-job-presentation.html',
      template: 'jupyterhub/home_template.pug',
      name: 'jobPresentation',
      inject: false
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
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader' 
        ]
      }
    ]
  }
}
