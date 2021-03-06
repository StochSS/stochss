const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    home: './client/pages/users-home.js',
    quickstart: './client/pages/quickstart.js',
    browser: './client/pages/file-browser.js',
    editor: './client/pages/model-editor.js',
    workflowSelection: './client/pages/workflow-selection.js',
    workflowEditor: './client/pages/workflow-manager.js',
    projectBrowser: './client/pages/project-browser.js',
    projectManager: './client/pages/project-manager.js'
  },
  output: {
    filename: 'stochss-[name].bundle.js',
    path: path.resolve(__dirname, "stochss/dist")
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'StochSS | Home',
      filename: 'stochss-user-home.html',
      template: 'page_template.pug',
      name: 'home',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Quickstart',
      filename: 'stochss-quickstart.html',
      template: 'page_template.pug',
      name: 'quickstart',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Model Browser',
      filename: 'stochss-file-browser.html',
      template: 'page_template.pug',
      name: 'browser',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Model Editor',
      filename: 'stochss-model-editor.html',
      template: 'page_template.pug',
      name: 'editor',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Workflow Selection',
      filename: 'stochss-workflow-selection.html',
      template: 'page_template.pug',
      name: 'workflowSelection',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Workflow Editor',
      filename: 'stochss-workflow-manager.html',
      template: 'page_template.pug',
      name: 'workflowEditor',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Project Browser',
      filename: 'stochss-project-browser.html',
      template: 'page_template.pug',
      name: 'projectBrowser',
      inject: false
    }),
    new HtmlWebpackPlugin({
      title: 'StochSS | Project Manager',
      filename: 'stochss-project-manager.html',
      template: 'page_template.pug',
      name: 'projectManager',
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
