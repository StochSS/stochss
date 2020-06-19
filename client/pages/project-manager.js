var $ = require('jquery');
var xhr = require('xhr');
var path = require('path');
//support files
var app = require('../app');
var modals = require('../modals');
//views
var PageView = require('./base');
var ProjectViewer = require('../views/project-viewer');
var FileBrowser = require('../views/file-browser-view');
//models
var Project = require('../models/project');
//templates
var template = require('../templates/pages/projectManager.pug');

import initPage from './page.js'

let ProjectManager = PageView.extend({
  template: template,
  events: {
    'click [data-hook=new-model]' : 'handleNewModelClick',
    'click [data-hook=new-experiment]' : 'handleNewExperimentClick',
    'click [data-hook=existing-model]' : 'handleExistingModelClick'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    let self = this
    this.url = decodeURI(document.URL)
    let urlParams = new URLSearchParams(window.location.search)
    this.projectPath = urlParams.get('path')
    this.projectName = this.projectPath.split('/').pop().split('.')[0]
    this.model = new Project({
      directory: self.projectPath
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews()
      }
    });
  },
  update: function (target) {
    let self = this
    this.model.fetch({
      success: function (model, response, options) {
        self.renderProjectViewer()
        if(target === "experiment" || target === "existing-model") {
          self.projectFileBrowser.refreshJSTree()
        }
      }
    });
  },
  renderSubviews: function () {
    this.renderProjectViewer();
    this.renderProjectFileBrowser();
  },
  renderProjectViewer: function () {
    if(this.projectViewer) {
      this.projectViewer.remove()
    }
    this.projectViewer = new ProjectViewer({
      model: this.model,
      name: this.projectName
    });
    this.registerRenderSubview(this.projectViewer, "project-viewer")
  },
  renderProjectFileBrowser: function () {
    let self = this
    if(this.projectFileBrowser) {
      this.projectFileBrowser.remove()
    }
    this.projectFileBrowser = new FileBrowser({
      root: self.projectPath
    })
    this.registerRenderSubview(this.projectFileBrowser, "file-browser")
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  handleNewModelClick: function () {
    this.addNewModel(false)
  },
  handleNewExperimentClick: function () {
    this.addNewExperiment()
  },
  handleExistingModelClick: function () {
    this.addExistingModel()
  },
  addNewModel: function (isSpatial) {
    let self = this
    let isModel = true
    if(document.querySelector('#newModalModel')) {
      document.querySelector('#newModalModel').remove()
    }
    let modal = $(modals.renderCreateModalHtml(isModel, isSpatial)).modal();
    let okBtn = document.querySelector('#newModalModel .ok-model-btn');
    let input = document.querySelector('#newModalModel #modelNameInput');
    okBtn.addEventListener('click', function (e) {
      if (Boolean(input.value)) {
        let modelName = input.value.split("/").pop() + '.mdl';
        let message = modelName.split(".")[0] !== input.value ? 
              "Warning: Models are saved directly in StochSS Projects and cannot be saved to the "+input.value.split("/")[0]+" directory in the project.<br><p>Your model will be saved directly in your project.</p>" : ""
        let modelPath = path.join(self.projectPath, modelName)
        let endpoint = path.join(app.getBasePath(), app.routePrefix, 'models/edit')+"?path="+modelPath+"&message="+message;
        if(message){
          modal.modal('hide')
          let warningModal = $(modals.newProjectModelWarningHtml(message)).modal()
          let yesBtn = document.querySelector('#newProjectModelWarningModal .yes-modal-btn');
          yesBtn.addEventListener('click', function (e) {window.location.href = endpoint;})
        }else{
          window.location.href = endpoint;
        }
      }
    });
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
  },
  addNewExperiment: function () {
    let self = this
    if(document.querySelector("#newExperimentModal")) {
      document.querySelector("#newExperimentModal").remove()
    }
    let modal = $(modals.newExperimentModalHtml()).modal();
    let okBtn = document.querySelector('#newExperimentModal .ok-model-btn');
    let input = document.querySelector('#newExperimentModal #experimentNameInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        let experimentName = input.value + ".exp"
        let experimentPath = path.join(self.projectPath, experimentName)
        let endpoint = path.join(app.getApiPath(), "project/new-experiment")+"?path="+experimentPath
        console.log(endpoint)
        xhr({uri: endpoint,json: true}, function (err, response, body) {
          if(response.statusCode < 400) {
            self.update("experiment")
          }else{
            let errorModel = $(modals.newProjectOrExperimentErrorHtml(body.Reason, body.Message)).modal()
          }
          modal.modal('hide')
        });
      }
    });
  },
  addExistingModel: function () {
    let self = this
    if(document.querySelector('#newProjectModelModal')){
      document.querySelector('#newProjectModelModal').remove()
    }
    let modal = $(modals.newProjectModelHtml()).modal()
    let okBtn = document.querySelector('#newProjectModelModal .ok-model-btn')
    let input = document.querySelector('#newProjectModelModal #modelPathInput')
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        let queryString = "?path="+self.projectPath+"&mdlPath="+input.value
        let endpoint = path.join(app.getApiPath(), 'project/add-existing-model') + queryString
        xhr({uri:endpoint, json:true}, function (err, response, body) {
          if(response.statusCode < 400) {
            let successModal = $(modals.newProjectModelSuccessHtml(body.message)).modal()
          }else{
            let errorModal = $(modals.newProjectModelErrorHtml(body.Reason, body.Message)).modal()
          }
        });
        modal.modal('hide')
        self.update("existing-model")
      }
    });
  }
});

initPage(ProjectManager)