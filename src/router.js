var path = require('path');
var app = require('ampersand-app');
var Router = require('ampersand-router');
var HomePage = require('./pages/home');
var ModelBrowser = require('./pages/model-browser');
var ModelEditor = require('./pages/model-editor');
var config = require('./config.js')(process.env.NODE_ENV);

const homePath = path.join(config.routePrefix, '()');
const modelBrowserPath = path.join(config.routePrefix, 'models');
const modelEditorPath = path.join(config.routePrefix, 'models/edit/(:id)');

console.log(homePath);
console.log(modelBrowserPath);
console.log(modelEditorPath);

module.exports = Router.extend({
  routes: {
    homePath: 'home',
    modelBrowserPath: 'modelBrowser',
    modelEditorPath: 'modelEditor'
  },

  home: function () {
    app.trigger('page', new HomePage({}));
  },

  modelBrowser: function () {
    app.trigger('page', new ModelBrowser({
      collection: app.models
    }));
  },

  modelEditor: function (id) {
    app.trigger('page', new ModelEditor({
      id: id
    }));
  }

});
