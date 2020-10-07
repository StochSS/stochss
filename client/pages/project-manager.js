/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
var EditWorkflowGroupsView = require('../views/edit-workflow-groups-view');
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
    'click [data-hook=new-workflow-group]' : 'handleNewWorkflowGroupClick',
    'click [data-hook=existing-model]' : 'handleExistingModelClick',
    'click [data-hook=export-project-as-zip]' : 'handleExportZipClick',
    'click [data-hook=export-project-as-combine]' : 'handleExportCombineClick',
    'click [data-hook=empty-project-trash]' : 'handleEmptyTrashClick',
    'click [data-hook=collapse-most-recent-plot-btn]' : 'changeCollapseButtonText',
    'click [data-hook=project-manager-advanced-btn]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-annotation-container]' : 'changeCollapseButtonText',
    'change [data-hook=annotation-text-container]' : 'updateAnnotation',
    'click [data-hook=upload-file-btn]' : 'handleUploadModelClick',
    'click [data-hook=edit-annotation-btn]' : 'handleEditAnnotationClick'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    let self = this
    this.url = decodeURI(document.URL)
    let urlParams = new URLSearchParams(window.location.search)
    this.projectPath = urlParams.get('path')
    this.projectName = this.getFileName(this.projectPath)
    this.model = new Project({
      directory: self.projectPath
    });
    this.model.fetch({
      success: function (model, response, options) {
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
        if(target === "model-editor" || target === "workflows-editor" || target === "trash") {
          self.projectFileBrowser.refreshJSTree()
        }else if(target === "workflow-group-editor"){
          self.projectFileBrowser.refreshJSTree()
          self.renderEditModelsView()
        }else if(target === "file-browser") {
          self.renderEditModelsView()
          self.renderEditWorkflowGroupsView()
        }else{
          self.renderEditModelsView()
          self.renderEditWorkflowGroupsView()
          self.projectFileBrowser.refreshJSTree()
        }
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
  renderSubviews: function () {
    this.renderProjectViewer();
    this.renderProjectFileBrowser();
    this.renderRecentPlotView();
    this.renderEditModelsView();
    this.renderEditWorkflowGroupsView();
    if(this.model.annotation){
      $(this.queryByHook('annotation-text-container')).text(this.model.annotation)
      $(this.queryByHook("collapse-annotation-container")).collapse('show')
    }else{
      $(this.queryByHook('edit-annotation-btn')).text('Add Notes')
    }
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
    });
  },
  renderRecentPlotView: function () {
    if(this.recentPlotView) {
      this.recentPlotView.remove()
    }
    if(this.model.plot) {
      var plot = new Plot(this.model.plot.output)
      var expName = path.dirname(this.model.plot.path).split('/').pop().split('.')[0]
      var wkflName = this.model.plot.path.split('/').pop().split('.')[0]
      this.recentPlotView = new PlotsView({
        model: plot,
        path: this.model.plot.path,
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
  renderEditWorkflowGroupsView: function () {
    if(this.editWorkflowGroupsView) {
      this.editWorkflowGroupsView.remove()
    }
    this.editWorkflowGroupsView = new EditWorkflowGroupsView({
      collection: this.model.workflowGroups
    });
    this.registerRenderSubview(this.editWorkflowGroupsView, "edit-workflow-groups-container")
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
  handleEditAnnotationClick: function (e) {
    let buttonTxt = e.target.innerText;
    if(buttonTxt.startsWith("Add")){
      $(this.queryByHook('collapse-annotation-container')).collapse('show')
      $(this.queryByHook('edit-annotation-btn')).text('Edit Notes')
    }else if(!$("#annotation-text").attr('class').includes('show')){
      $("#annotation-text").collapse('show')
      $(this.queryByHook("collapse-annotation-text")).text('-')
    }
    document.querySelector("#annotation").focus()
  },
  updateAnnotation: function (e) {
    this.model.annotation = e.target.value.trim();
    if(this.model.annotation === ""){
      $(this.queryByHook('edit-annotation-btn')).text('Add Notes')
      $(this.queryByHook("collapse-annotation-container")).collapse('hide')
    }
    let endpoint = path.join(app.getApiPath(), "project/save-annotation")+"?path="+this.model.directory
    xhr({uri: endpoint, json: true, method: "post", data: {'annotation': this.model.annotation}}, function (err, response, body) {
      console.log("Saved project notes")
    })
  },
  handleNewModelClick: function () {
    this.addNewModel(false)
  },
  handleNewWorkflowGroupClick: function () {
    this.addNewWorkflowGroup()
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
        window.open(downloadEP)
      }
    })
  },
  handleExportCombineClick: function () {
    this.exportAsCombine(this.projectPath, true)
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
  handleUploadModelClick: function (e) {
    let type = e.target.dataset.type
    this.projectFileBrowser.uploadFile(undefined, type)
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
        let endpoint = path.join(app.getBasePath(), app.routePrefix, 'models/edit')+"?path="+modelPath+"&message="+message
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
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newModalModel #modelNameInputEndCharError')
      var charErrMsg = document.querySelector('#newModalModel #modelNameInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== ""
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
    });
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
  },
  validateName(input) {
    var error = ""
    if(input.endsWith('/')) {
      error = 'forward'
    }
    let invalidChars = "`~!@#$%^&*=+[{]}\"|:;'<,>?\\"
    for(var i = 0; i < input.length; i++) {
      if(invalidChars.includes(input.charAt(i))) {
        error = error === "" || error === "special" ? "special" : "both"
      }
    }
    return error
  },
  addNewWorkflowGroup: function (cb) {
    let self = this
    if(document.querySelector("#newWorkflowGroupModal")) {
      document.querySelector("#newWorkflowGroupModal").remove()
    }
    let modal = $(modals.newWorkflowGroupModalHtml()).modal();
    let okBtn = document.querySelector('#newWorkflowGroupModal .ok-model-btn');
    let input = document.querySelector('#newWorkflowGroupModal #workflowGroupNameInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newWorkflowGroupModal #workflowGroupNameInputEndCharError')
      var charErrMsg = document.querySelector('#newWorkflowGroupModal #workflowGroupNameInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== ""
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        let workflowGroupName = input.value + ".wkgp"
        let workflowGroupPath = path.join(self.projectPath, workflowGroupName)
        let endpoint = path.join(app.getApiPath(), "project/new-workflow-group")+"?path="+workflowGroupPath
        xhr({uri: endpoint,json: true}, function (err, response, body) {
          if(response.statusCode < 400) {
            if(cb) {
              cb(workflowGroupName)
            }else{
              self.update("workflow-group")
            }
          }else{
            let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(body.Reason, body.Message)).modal()
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
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newProjectModelModal #modelPathInputEndCharError')
      var charErrMsg = document.querySelector('#newProjectModelModal #modelPathInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== ""
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
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
        files = self.model.workflowGroups.map(function (workflowGroup) {return workflowGroup.name+".wkgp"})
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
            window.open(downloadEP)
          }else{
            let modal = $(modals.projectExportSuccessHtml(body.file_type, body.message)).modal()
          }
        }else{
          let modal = $(modals.projectExportErrorHtml(body.Reason, body.Message))
        }
      });
    });
  },
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let isBtn = $(this.queryByHook(source)).attr("class").includes("btn")
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(isBtn && !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
  }
});

initPage(ProjectManager)