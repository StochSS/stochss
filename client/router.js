var path = require('path');
var app = require('ampersand-app');
var Router = require('ampersand-router');
var HomePage = require('./pages/home');
var ModelBrowser = require('./pages/model-browser');
var ModelEditor = require('./pages/model-editor');
var ModelEditorV2 = require('./pagesV2/model-editor');
var config = require('./config.js')(process.env.NODE_ENV);

const homePath = path.join(config.routePrefix, '()');
const modelBrowserPath = path.join(config.routePrefix, 'models');
const modelEditorPath = path.join(config.routePrefix, 'models/edit/(:id)');

module.exports = Router.extend({
  routes: {
    '()': 'home',
    'models(/)': 'modelBrowser',
    'models/edit/(:id)': 'modelEditor',
    'models/edit-model/(:name)' : 'modelEditorV2',
  },

  home: function () {
    app.trigger('page', new HomePage({}));
  },

  modelBrowser: function (arg) {
    app.trigger('page', new ModelBrowser({
      collection: app.models
    }));
  },

  modelEditor: function (id) {
    app.trigger('page', new ModelEditor({
      id: id
    }));
  },

  modelEditorV2: function (name) {
    app.trigger('page', new ModelEditorV2({
      name: name,
    }));
  },

});
