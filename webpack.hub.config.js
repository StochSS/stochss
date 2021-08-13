const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    home: './client/pages/home.js',
    jobPresentation: './client/pages/job-presentation.js',
    modelPresentation: './client/pages/model-presentation.js',
    notebookPresentation: './client/pages/notebook-presentation.js'
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
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Model Presentation',
      filename: '../templates/stochss-model-presentation.html',
      template: 'jupyterhub/home_template.pug',
      name: 'modelPresentation',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Notebook Presentation',
      filename: '../templates/stochss-notebook-presentation.html',
      template: 'jupyterhub/home_template.pug',
      name: 'notebookPresentation',
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
