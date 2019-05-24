var app = require('ampersand-app');
var Router = require('ampersand-router');
var HomePage = require('./pages/home');
var ModelBrowser = require('./pages/model-browser');
var ModelEditor = require('./pages/model-editor');

module.exports = Router.extend({
  routes: {
    '()': 'home',
    'models': 'modelBrowser',
    'models/edit/(:id)': 'modelEditor'
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
