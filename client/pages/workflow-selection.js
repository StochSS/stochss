var $ = require('jquery');
var xhr = require('xhr');
var path = require('path');
//support files
var app = require('../app');
var Tooltips = require('../tooltips');
//models
var Model = require('../models/model');
//views
var PageView = require('./base');
//templates
var template = require('../templates/pages/workflowSelection.pug');

import initPage from './page.js';

let workflowSelection = PageView.extend({
  template: template,
  events: {
    "click [data-hook=ensemble-simulation]" : "notebookWorkflow",
    "click [data-hook=oned-parameter-sweep]" : "notebookWorkflow",
    "click [data-hook=twod-parameter-sweep]" : "notebookWorkflow",
    "click [data-hook=sciope-model-exploration]" : "notebookWorkflow",
    "click [data-hook=model-inference]" : "notebookWorkflow",
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this
    this.modelDir = (new URLSearchParams(window.location.search)).get('path');
    this.tooltips = Tooltips.workflowSelection
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
    this.modelFile = this.modelDir.split('/').pop().split('.').shift();
    var isSpatial = this.modelDir.endsWith('.smdl');
    this.model = new Model({
      name: this.modelFile,
      directory: this.modelDir,
      is_spatial: isSpatial,
      isPreview: false,
      for: "wkfl",
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.validateWorkflows()
      }
    });
  },
  validateWorkflows: function () {
    if(this.model.parameters.length < 1 || this.model.species.length < 1){
      $(this.queryByHook('oned-parameter-sweep')).addClass('disabled')
      $(this.queryByHook('twod-parameter-sweep')).addClass('disabled')
      $(this.queryByHook('sciope-model-exploration')).addClass('disabled')
    }else if(this.model.parameters.length < 2){
      $(this.queryByHook('twod-parameter-sweep')).addClass('disabled')
    }
  },
  notebookWorkflow: function (e) {
    var type = e.target.dataset.type;
    console.log(type)
    this.toNotebook(type);
  },
  toNotebook: function (type) {
    var endpoint = path.join(app.getApiPath(), "/workflow/notebook")+"?type="+type+"&path="+this.modelDir
    xhr({uri:endpoint, json:true}, function (err, response, body) {
      if(response.statusCode < 400){
        var notebookPath = path.join(app.getBasePath(), "notebooks", body.FilePath)
        window.open(notebookPath, "_blank")
      }
    });
  },
});

initPage(workflowSelection);
