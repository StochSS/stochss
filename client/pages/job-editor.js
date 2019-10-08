var app = require('../app');
var _ = require('underscore');
var $ = require('jquery');
//views
var PageView = require('../pages/base');
var SimSettingsView = require('../views/simulation-settings');
//models
var Model = require('../models/model');
//templates
var template = require('../templates/pages/jobEditor.pug');

import initPage from './page.js';

let JobEditor = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    var directory = document.URL.split('/jobs/edit').pop();
    var modelFile = directory.split('/').pop();
    var name = modelFile.split('.')[0];
    var isSpatial = modelFile.split('.').pop().startsWith('s');
    this.model = new Model({
      name: name,
      directory: directory,
      is_spatial: isSpatial
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews();
        if(self.model.is_spatial)
          $(self.queryByHook('mesh-editor-container')).collapse();
      }
    });
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderSubviews: function () {
    var simSettings = new SimSettingsView({
      parent: this,
      model: this.model.simulationSettings,
      species: this.model.species
    });
    this.registerRenderSubview(simSettings, 'sim-settings-container');
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
});

initPage(JobEditor);