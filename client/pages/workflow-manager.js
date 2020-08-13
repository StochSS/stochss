var _ = require('underscore');
var $ = require('jquery');
var path = require('path');
var xhr = require('xhr');
//support files
var app = require('../app');
var tests = require('../views/tests');
var modals = require('../modals')
//views
var PageView = require('./base');
var WorkflowEditorView = require('../views/workflow-editor');
var WorkflowStatusView = require('../views/workflow-status');
var WorkflowResultsView = require('../views/workflow-results');
var ModelViewer = require('../views/model-viewer');
var InfoView = require('../views/workflow-info');
var InputView = require('../views/input');
var SelectView = require('ampersand-select-view');
//models
var Model = require('../models/model')
//templates
var template = require('../templates/pages/workflowManager.pug');

import initPage from './page.js';

let WorkflowManager = PageView.extend({
  template: template,
  events: {
    'change [data-hook=workflow-name]' : 'setWorkflowName',
    'change [data-hook=model-path]' : 'updateWkflModel',
    'click [data-hook=edit-workflow-help]' : function () {
      let modal = $(modals.operationInfoModalHtml('wkfl-manager')).modal();
    },
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    $(document).on('hidden.bs.modal', function (e) {
      if(e.target.id === "modelNotFoundModal")
        $(self.queryByHook("model-path")).find('input').focus();
    });
    this.url = decodeURI(document.URL)
    let urlParams = new URLSearchParams(window.location.search)
    let type = urlParams.get('type');
    this.urlPathParam = urlParams.get('path');
    var stamp = this.getCurrentDate();
    var queryStr = "?stamp="+stamp+"&type="+type+"&path="+this.urlPathParam
    if(urlParams.has('parentPath')) {
      queryStr += ("&parentPath=" + urlParams.get('parentPath'))
    }
    var endpoint = path.join(app.getApiPath(), "workflow/load-workflow")+queryStr
    xhr({uri: endpoint, json: true}, function (err, resp, body) {
      if(resp.statusCode < 400) {
        self.settings = body.settings
        self.type = body.type
        self.titleType = body.titleType
        self.modelDirectory = body.mdlPath
        self.wkflDirectory = body.wkflDir
        self.workflowDate = body.timeStamp
        self.workflowName = body.wkflName
        self.status = body.status
        self.startTime = body.startTime
        self.wkflParPath = body.wkflParPath
        self.wkflPath = path.join(self.wkflParPath, self.wkflDirectory)
        self.buildWkflModel(body)
        self.renderSubviews();
        if(self.wkflPath.includes('.proj')) {
          self.projectPath = path.dirname(self.wkflParPath)
          $(self.queryByHook('project-breadcrumb')).attr("href", "/stochss/project/manager?path="+self.projectPath)
          $(self.queryByHook('project-breadcrumb')).text(self.projectPath.split('/').pop().split('.')[0])
          $(self.queryByHook('workflow-group-breadcrumb')).text(self.wkflParPath.split('/').pop().split('.')[0])
          $(self.queryByHook('workflow-breadcrumb')).text(self.workflowName)
          self.queryByHook("project-breadcrumb-links").style.display = "block"
        }
      }
    });
  },
  buildWkflModel: function (data) {
    let model = data.model
    this.model = new Model(model)
    this.model.name = this.modelDirectory.split('/').pop().split('.')[0]
    this.model.directory = this.modelDirectory
    this.model.is_spatial = this.modelDirectory.endsWith(".smdl")
    this.model.isPreview = false
    this.model.for = "wkfl"
    if(!model)
      this.wkflModelNotFound(data.error)
  },
  wkflModelNotFound: function (error) {
    let modal = $(modals.modelNotFoundHtml(error.Reason, error.Message)).modal()
  },
  update: function () {
  },
  updateValid: function () {
  },
  getCurrentDate: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month < 10){
      month = "0" + month
    }
    var day = date.getDate();
    if(day < 10){
      day = "0" + day
    }
    var hours = date.getHours();
    if(hours < 10){
      hours = "0" + hours
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
      minutes = "0" + minutes
    }
    var seconds = date.getSeconds();
    if(seconds < 10){
      seconds = "0" + seconds
    }
    return "_" + month + day + year + "_" + hours + minutes + seconds;
  },
  renderSubviews: function () {
    $(this.queryByHook("page-title")).text('Workflow: '+this.titleType)
    this.renderWkflNameInputView();
    this.renderMdlPathInputView();
    this.renderWorkflowEditor();
    this.renderWorkflowStatusView();
    this.renderResultsView();
    this.renderInfoView();
    this.renderModelViewer();
    if(this.status === 'running'){
      this.getWorkflowStatus();
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    return this.renderSubview(view, this.queryByHook(hook));
  },
  renderWkflNameInputView: function () {
    let inputName = new InputView({
      parent: this,
      required: true,
      name: 'name',
      label: 'Workflow Name: ',
      tests: '',
      modelKey: null,
      valueType: 'string',
      value: this.workflowName,
    });
    this.registerRenderSubview(inputName, 'workflow-name');
    if(this.status !== "new") {
      $(this.queryByHook('workflow-name')).find('input').prop('disabled', true);
    }
  },
  renderMdlPathInputView: function () {
    let modelPathInput = new InputView({
      parent: this,
      required: true,
      name: 'name',
      label: 'Model Path: ',
      tests: "",
      modelKey: 'directory',
      valueType: 'string',
      value: this.model.directory,
    });
    this.registerRenderSubview(modelPathInput, "model-path");
    if(this.status !== "new" && this.status !== "ready") {
      $(this.queryByHook('model-path')).find('input').prop('disabled', true);
    }
  },
  renderWorkflowEditor: function () {
    if(this.workflowEditorView){
      this.workflowEditorView.remove()
    }
    this.workflowEditor = new WorkflowEditorView({
      model: this.model,
      settings: this.settings,
      type: this.type,
      status: this.status,
    });
    this.workflowEditorView = this.registerRenderSubview(this.workflowEditor, 'workflow-editor-container');
  },
  renderWorkflowStatusView: function () {
    if(this.workflowStatusView){
      this.workflowStatusView.remove();
    }
    var statusView = new WorkflowStatusView({
      startTime: this.startTime,
      status: this.status,
    });
    this.workflowStatusView = this.registerRenderSubview(statusView, 'workflow-status-container');
  },
  renderResultsView: function () {
    if(this.workflowResultsView){
      this.workflowResultsView.remove();
    }
    var resultsView = new WorkflowResultsView({
      trajectories: this.settings.simulationSettings.realizations,
      status: this.status,
      species: this.model.species,
      type: this.type,
      speciesOfInterest: this.settings.parameterSweepSettings.speciesOfInterest.name
    });
    this.workflowResultsView = this.registerRenderSubview(resultsView, 'workflow-results-container');
  },
  renderInfoView: function () {
    if(this.infoView){
      this.infoView.remove();
    }
    this.infoView = new InfoView({
      status: this.status,
      logsPath: path.join(this.wkflPath, "logs.txt")
    });
    this.registerRenderSubview(this.infoView, 'workflow-info-container')
  },
  renderModelViewer: function (){
    if(this.modelViewer){
      this.modelViewer.remove();
    }
    this.modelViewer = new ModelViewer({
      model: this.model,
      status: this.status,
      type: this.type
    });
    this.registerRenderSubview(this.modelViewer, 'model-viewer-container')
  },
  getWorkflowStatus: function () {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "workflow/workflow-status")+"?path="+this.wkflPath;
    xhr({uri: endpoint}, function (err, response, body) {
      if(self.status !== body )
        self.status = body;
      if(self.status === 'running')
        setTimeout(_.bind(self.getWorkflowStatus, self), 1000);
      else{
        self.renderWorkflowStatusView()
        self.renderInfoView();
      }
      if(self.status === 'complete') {
        self.renderWorkflowEditor();
        self.renderResultsView();
        self.renderModelViewer();
      }
    });
  },
  setWorkflowName: function(e) {
    var newWorkflowName = e.target.value.trim();
    if(newWorkflowName.endsWith(this.workflowDate)){
      this.workflowName = newWorkflowName
    }else{
      this.workflowName = newWorkflowName + this.workflowDate
      e.target.value = this.workflowName
    }
    $(this.queryByHook('workflow-breadcrumb')).text(this.workflowName)
    this.wkflDirectory = this.workflowName + ".wkfl"
    this.wkflPath = path.join(this.wkflParPath, this.wkflDirectory)
  },
  updateWkflModel: function (e) {
    let self = this;
    let parPath = path.dirname(self.modelDirectory)
    if(parPath.endsWith(".proj") && parPath !== path.dirname(e.target.value)) {
      self.model.directory = self.modelDirectory
      $(self.queryByHook("model-path")).find('input').val(self.modelDirectory)
      let mdlPathErr = $(modals.wkflModelPathErrorHtml()).modal()
    }else{
      self.modelDirectory = e.target.value
      this.model.fetch({
        json: true,
        success: function (model, response, options) {
          self.renderWorkflowEditor()
        },
        error: function (model, response, options) {
          self.wkflModelNotFound(response.body)
        }
      });
    }
  },
  reloadWkfl: function () {
    let self = this;
    if(self.status === 'new') {
      // Need to refactor this
      let mdlParPath = path.dirname(this.modelDirectory)
      if(mdlParPath !== "."){
        let replaceText = this.wkflPath.split(mdlParPath+'/').slice(1).join(mdlParPath)
        this.url = this.url.replace(this.modelDirectory.split('/').pop(), replaceText)
      }else{
        this.url = this.url.replace(this.modelDirectory, this.wkflPath)
      }
      window.location.href = this.url
    }
    else
      window.location.reload()
  },
});

initPage(WorkflowManager);
