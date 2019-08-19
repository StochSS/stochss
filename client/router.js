var path = require('path');
var app = require('ampersand-app');
var Router = require('ampersand-router');
var HomePage = require('./pages/home');
var ModelBrowser = require('./pages/model-browser');
// var ModelEditor = require('./pages/model-editor');
var ModelEditor = require('./pages/model-editor');
var config = require('./config.js')(process.env.NODE_ENV);

const homePath = path.join(config.routePrefix, '()');
const modelBrowserPath = path.join(config.routePrefix, 'models');
const modelEditorPath = path.join(config.routePrefix, 'models/edit/(:id)');

module.exports = Router.extend({
  routes: {
    '()': 'home',
    'models(/)': 'modelBrowser',
    // 'models/edit/(:id)': 'modelEditor',
    'models/edit-model/(:name)' : 'modelEditor',
  },

  home: function () {
    app.trigger('page', new HomePage({}));
  },

  modelBrowser: function (arg) {
    app.trigger('page', new ModelBrowser({
      collection: app.models
    }));
  },

  modelEditor: function (name) {
    app.trigger('page', new ModelEditor({
      name: name,
    }));
  },

});
