var app = require('../app');
var _ = require('underscore');
var $ = require('jquery');
var tests = require('../views/tests');
//views
var PageView = require('../pages/base');
var SimSettingsView = require('../views/simulation-settings');
var JobStateButtonsView = require('../views/job-state-buttons');
var InputView = require('../views/input');
//models
var Model = require('../models/model');
//templates
var template = require('../templates/pages/jobEditor.pug');

import initPage from './page.js';

let JobEditor = PageView.extend({
  template: template,
  events: {
    'change [data-hook=job-name]' : 'setJobName'
  },
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
    this.jobName = name + "-job";
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
    var jobStateButtons = new JobStateButtonsView({
      model: this.model
    });
    this.registerRenderSubview(simSettings, 'sim-settings-container');
    this.registerRenderSubview(jobStateButtons, 'job-state-buttons-container');
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  setJobName: function(e) {
    this.jobName = e.target.value
  },
  subviews: {
    inputName: {
      hook: 'job-name',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: 'Job Name',
          tests: '',
          modelKey: '',
          valueType: 'string',
          value: this.jobName,
        });
      },
    },
  }
});

initPage(JobEditor);