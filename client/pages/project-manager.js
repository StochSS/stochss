var $ = require('jquery');
var xhr = require('xhr');
var path = require('path');
//support files
var app = require('../app');
var modals = require('../modals');
//views
var PageView = require('./base');
var PlotsView = require('../views/plots-view');
var EditModelsView = require('../views/edit-models-view');
var EditExperimentsView = require('../views/edit-experiments-view');
var ProjectViewer = require('../views/project-viewer');
var FileBrowser = require('../views/file-browser-view');
var MetaDataView = require('../views/meta-data');
//models
var Project = require('../models/project');
var Plot = require('../models/plots');
//templates
var template = require('../templates/pages/projectManager.pug');

import initPage from './page.js'

let ProjectManager = PageView.extend({
  template: template,
  events: {
    'click [data-hook=new-model]' : 'handleNewModelClick',
    'click [data-hook=new-experiment]' : 'handleNewExperimentClick',
    'click [data-hook=existing-model]' : 'handleExistingModelClick',
    'click [data-hook=export-project-as-zip]' : 'handleExportZipClick',
    'click [data-hook=export-project-as-combine]' : 'handleExportCombineClick',
    'click [data-hook=convert-project-to-combine]' : 'handleToCombineClick',
    'click [data-hook=empty-project-trash]' : 'handleEmptyTrashClick',
    'click [data-hook=project-manager-advanced-btn]' : 'changeCollapseButtonText',
    // 'click [data-hook=upload-file-btn]' : 'handleUploadModelClick' TODO: need to add functionality for this
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
        self.plot = response.plot
        if(response.trash_empty) {
          $(self.queryByHook('empty-project-trash')).prop('disabled', true)
        }
        self.renderSubviews()
      }
    });
  },
  update: function (target) {
    let self = this
    this.model.fetch({
      success: function (model, response, options) {
        self.renderProjectViewer()
        $(self.queryByHook('empty-project-trash')).prop('disabled', response.trash_empty)
        if(target === "model-editor" || target === "experiment-editor" || 
                          target === "workflows-editor" || target === "trash") {
          self.projectFileBrowser.refreshJSTree()
        }else if(target === "file-browser") {
          self.renderEditModelsView()
          self.renderEditExperimentsView()
        }else{
          self.renderEditModelsView()
          self.renderEditExperimentsView()
          self.projectFileBrowser.refreshJSTree()
        }
      }
    });
  },
  renderSubviews: function () {
    this.renderProjectViewer();
    this.renderProjectFileBrowser();
    this.renderRecentPlotView();
    this.renderEditModelsView();
    this.renderEditExperimentsView();
  },
  renderRecentPlotView: function () {
    if(this.recentPlotView) {
      this.recentPlotView.remove()
    }
    if(this.plot) {
      var plot = new Plot(this.plot.output)
      var expName = path.dirname(this.plot.path).split('/').pop().split('.')[0]
      var wkflName = this.plot.path.split('/').pop().split('.')[0]
      this.recentPlotView = new PlotsView({
        model: plot,
        path: this.plot.path,
        heading: expName + " - " + wkflName
      });
      this.registerRenderSubview(this.recentPlotView, "project-most-recent-plot");
    }else{
      let message = "Their are no saved plots in the workflows of this project"
      $(this.queryByHook("project-most-recent-plot")).text(message)
    }
  },
  renderEditModelsView: function () {
    if(this.editModelsView) {
      this.editModelsView.remove()
    }
    this.editModelsView = new EditModelsView({
      collection: this.model.models
    });
    this.registerRenderSubview(this.editModelsView, "edit-models-container")
  },
  renderEditExperimentsView: function () {
    if(this.editExperimentsView) {
      this.editExperimentsView.remove()
    }
    this.editExperimentsView = new EditExperimentsView({
      collection: this.model.experiments
    });
    this.registerRenderSubview(this.editExperimentsView, "edit-experiments-container")
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
  renderMetaDataView: function (target, files, download) {
    if(this.metaDataView) {
      this.metaDataView.remove()
    }
    this.metaDataView = new MetaDataView({
      parent: this,
      projectName: this.model.directory,
      files: files,
      path: target,
      download: download
    });
    this.registerRenderSubview(this.metaDataView, "project-meta-data-container")
    $(this.queryByHook("project-meta-data-container")).collapse("show")
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
  handleExportZipClick: function () {
    let self = this
    let queryStr = "?path="+this.projectPath+"&action=generate"
    let endpoint = path.join(app.getApiPath(), "file/download-zip")+queryStr
    xhr({uri:endpoint, json:true}, function (err, response, body) {
      if(response.statusCode < 400) {
        var downloadEP = path.join(app.getBasePath(), "/files", body.Path);
        window.location.href = downloadEP
      }
    })
  },
  handleExportCombineClick: function () {
    this.exportAsCombine(this.projectPath, true)
  },
  handleToCombineClick: function () {
    this.exportAsCombine(this.projectPath, false)
  },
  handleEmptyTrashClick: function () {
    let self = this;
    if(document.querySelector("#emptyTrashConfirmModal")) {
      document.querySelector("#emptyTrashConfirmModal").remove()
    }
    let modal = $(modals.emptyTrashConfirmHtml()).modal();
    let yesBtn = document.querySelector('#emptyTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      modal.modal('hide')
      let endpoint = path.join(app.getApiPath(), "project/empty-trash")+"?path="+path.join(self.projectPath, "trash")
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          $(self.queryByHook('empty-project-trash')).prop('disabled', true)
          self.update("trash")
          console.log(body)
        }else{
          console.log(body)
        }
      });
    });
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
  },
  exportAsCombine: function(target, download) {
    let self = this
    if(document.querySelector("#addMetaDataModal")) {
      document.querySelector("#addMetaDataModal").remove()
    }
    let modal = $(modals.addMetaDataHtml("Do you wish to add/update the meta-data for this archive?")).modal()
    let yesBtn = document.querySelector("#addMetaDataModal .yes-modal-btn")
    let noBtn = document.querySelector("#addMetaDataModal .no-modal-btn")
    yesBtn.addEventListener('click', function (e) {
      modal.modal('hide')
      var files = []
      if(target === self.projectPath){
        files = self.model.experiments.map(function (experiment) {return experiment.name+".exp"})
        files.unshift(self.model.directory)
      }else{
        files = [self.model.directory, target.split('/').pop()]
      }
      self.renderMetaDataView(target, files, download)
    });
    noBtn.addEventListener('click', function (e) {
      let queryString = "?path="+target+"&projectPath="+self.projectPath
      let endpoint = path.join(app.getApiPath(), "project/export-combine")+queryString
      xhr({uri:endpoint, json:true}, function (err, response, body) {
        if(response.statusCode < 400) {
          if(download) {
            let downloadEP = path.join(app.getBasePath(), "/files", body.file_path);
            window.location.href = downloadEP
          }else{
            let modal = $(modals.projectExportSuccessHtml(body.file_type, body.message)).modal()
          }
        }else{
          let modal = $(modals.projectExportErrorHtml(body.Reason, body.Message))
        }
      });
    });
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('project-manager-advanced-btn')).text();
    text === '+' ? $(this.queryByHook('project-manager-advanced-btn')).text('-') : $(this.queryByHook('project-manager-advanced-btn')).text('+');
  }
});

initPage(ProjectManager)