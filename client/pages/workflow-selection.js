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
    "click [data-hook=stochss-es]" : "handleEnsembleSimulationClick",
    "click [data-hook=stochss-ps]" : "handleParameterSweepClick"
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this
    let urlParams = new URLSearchParams(window.location.search)
    this.modelDir = urlParams.get('path');
    if(urlParams.has('parentPath')){
      this.parentPath = urlParams.get('parentPath')
    }else{
      this.parentPath = path.dirname(this.modelDir)
    }
    if(this.modelDir.includes(".proj")) {
      this.projectPath = path.dirname(this.modelDir)
      this.projectName = this.projectPath.split('/').pop().split('.')[0]
      this.workflowGroupName = this.parentPath.split('/').pop().split('.')[0]
    }
    this.tooltips = Tooltips.workflowSelection
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
    this.modelFile = this.getFileName(this.modelDir)
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
        if(self.modelDir.includes(".proj")) {
          self.queryByHook("workflow-selection-breadcrumb-links").style.display = "block"
        }
        self.validateWorkflows()
      }
    });
  },
  getFileName: function (file) {
    if(file.endsWith('/')) {
      file.slice(0, -1)
    }
    if(file.includes('/')) {
      file = file.split('/').pop()
    }
    if(!file.includes('.')) {
      return file
    }
    return file.split('.').slice(0, -1).join('.')
  },
  validateWorkflows: function () {
    if(this.model.species.length < 1 || (this.model.reactions.length < 1 && this.model.eventsCollection.length < 1 && this.model.rules.length < 1)){
      $(this.queryByHook('stochss-es')).prop('disabled', true)
      $(this.queryByHook('stochss-ps')).prop('disabled', true)
      $(this.queryByHook('ensemble-simulation')).prop('disabled', true)
      $(this.queryByHook('model-inference')).prop('disabled', true)
      $(this.queryByHook('oned-parameter-sweep')).prop('disabled', true)
      $(this.queryByHook('twod-parameter-sweep')).prop('disabled', true)
      $(this.queryByHook('sciope-model-exploration')).prop('disabled', true)
      $(this.queryByHook('invalid-model-message')).css('display', 'block')
    }else if(this.model.parameters.length < 1){
      $(this.queryByHook('oned-parameter-sweep')).prop('disabled', true)
      $(this.queryByHook('twod-parameter-sweep')).prop('disabled', true)
      $(this.queryByHook('stochss-ps')).prop('disabled', true)
      $(this.queryByHook('psweep-workflow-message')).css('display', 'block')
    }else if(this.model.parameters.length < 2){
      $(this.queryByHook('twod-parameter-sweep')).prop('disabled', true)
      $(this.queryByHook('psweep-workflow-message')).text('2D Parameter Sweep workflows require at least two parameters')
      $(this.queryByHook('psweep-workflow-message')).css('display', 'block')
    }
  },
  notebookWorkflow: function (e) {
    var type = e.target.dataset.type;
    this.toNotebook(type);
  },
  toNotebook: function (type) {
    let queryString = "?type="+type+"&path="+this.modelDir+"&parentPath="+this.parentPath
    var endpoint = path.join(app.getApiPath(), "/workflow/notebook")+queryString
    xhr({uri:endpoint, json:true}, function (err, response, body) {
      if(response.statusCode < 400){
        var notebookPath = path.join(app.getBasePath(), "notebooks", body.FilePath)
        window.open(notebookPath, "_blank")
      }
    });
  },
  handleEnsembleSimulationClick: function (e) {
    this.launchStochssWorkflow("gillespy")
  },
  handleParameterSweepClick: function (e) {
    this.launchStochssWorkflow("parameterSweep")
  },
  launchStochssWorkflow: function (type) {
    let queryString = "?type=" + type + "&path=" + this.modelDir + "&parentPath=" + this.parentPath
    let endpoint = path.join(app.getBasePath(), "stochss/workflow/edit")+queryString
    window.location.href = endpoint
  }
});

initPage(workflowSelection);
