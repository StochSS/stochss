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

let $ = require('jquery');
let path = require('path');
//support files
let app = require('../app');
let modals = require('../modals');
//collection
let Collection = require('ampersand-collection');
//models
let Model = require('../models/model');
let Project = require('../models/project');
//views
let PageView = require('./base');
let MetaDataView = require('../views/meta-data');
let ModelListing = require('../views/model-listing');
let FileBrowser = require('../views/file-browser-view');
let ArchiveListing = require('../views/archive-listing');
let WorkflowListing = require('../views/workflow-listing');
let WorkflowGroupListing = require('../views/workflow-group-listing');
//templates
let template = require('../templates/pages/projectManager.pug');

import initPage from './page.js'

let ProjectManager = PageView.extend({
  template: template,
  events: {
    'change [data-hook=annotation-text-container]' : 'updateAnnotation',
    'click [data-hook=edit-annotation-btn]' : 'handleEditAnnotationClick',
    'click [data-hook=collapse-annotation-text]' : 'changeCollapseButtonText',
    'click [data-hook=new-model]' : 'handleNewModelClick',
    'click [data-hook=existing-model]' : 'handleExistingModelClick',
    'click [data-hook=upload-file-btn]' : 'handleUploadModelClick',
    'click [data-hook=new-ensemble-simulation]' : 'handleNewWorkflowClick',
    'click [data-hook=new-parameter-sweep]' : 'handleNewWorkflowClick',
    'click [data-hook=new-jupyter-notebook]' : 'handleNewWorkflowClick',
    'click [data-hook=project-manager-advanced-btn]' : 'changeCollapseButtonText',
    'click [data-hook=archive-btn]' : 'changeCollapseButtonText',
    'click [data-hook=export-project-as-zip]' : 'handleExportZipClick',
    'click [data-hook=export-project-as-combine]' : 'handleExportCombineClick',
    'click [data-hook=empty-project-trash]' : 'handleEmptyTrashClick'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    let self = this;
    let urlParams = new URLSearchParams(window.location.search);
    this.model = new Project({
      directory: urlParams.get('path')
    });
    app.getXHR(this.model.url(), {
      success: function (err, response, body) {
        self.model.set(body)
        self.models = new Collection(body.models, {model: Model});
        if(!self.model.newFormat) {
          self.model.workflowGroups.models[0].model = null;
        }
        self.renderSubviews(body.trash_empty);
      }
    });
    window.addEventListener("pageshow", function (event) {
      var navType = window.performance.navigation.type
      if(navType === 2){
        window.location.reload()
      }
    });
  },
  addExistingModel: function () {
    if(document.querySelector('#newProjectModelModal')){
      document.querySelector('#newProjectModelModal').remove();
    }
    let self = this
    let mdlListEP = path.join(app.getApiPath(), 'project/add-existing-model') + "?path=" + self.model.directory;
    app.getXHR(mdlListEP, {
      always: function (err, response, body) {
        let modal = $(modals.newProjectModelHtml(body.files)).modal();
        let okBtn = document.querySelector('#newProjectModelModal .ok-model-btn');
        let select = document.querySelector('#newProjectModelModal #modelFileInput');
        let location = document.querySelector('#newProjectModelModal #modelPathInput');
        select.addEventListener("change", function (e) {
          okBtn.disabled = e.target.value && body.paths[e.target.value].length >= 2;
          if(body.paths[e.target.value].length >= 2) {
            var locations = body.paths[e.target.value].map(function (path) {
              return `<option>${path}</option>`;
            });
            locations.unshift(`<option value="">Select a location</option>`);
            locations = locations.join(" ");
            $("#modelPathInput").find('option').remove().end().append(locations);
            $("#location-container").css("display", "block");
          }else{
            $("#location-container").css("display", "none");
            $("#modelPathInput").find('option').remove().end();
          }
        });
        location.addEventListener("change", function (e) {
          okBtn.disabled = !Boolean(e.target.value);
        });
        okBtn.addEventListener("click", function (e) {
          modal.modal('hide');
          let mdlPath = body.paths[select.value].length < 2 ? body.paths[select.value][0] : location.value;
          let queryString = "?path=" + self.model.directory + "&mdlPath=" + mdlPath;
          let endpoint = path.join(app.getApiPath(), 'project/add-existing-model') + queryString
          app.postXHR(endpoint, null, {
            success: function (err, response, body) {
              let successModal = $(modals.newProjectModelSuccessHtml(body.message)).modal();
            },
            error: function (err, response, body) {
              let errorModal = $(modals.newProjectModelErrorHtml(body.Reason, body.Message)).modal();
            }
          });
          self.update("Model");
        });
      }
    });
  },
  addModel: function (parentPath, modelName, message) {
    var endpoint = path.join(app.getBasePath(), "stochss/models/edit");
    if(parentPath.endsWith(".proj")) {
      let queryString = "?path=" + parentPath + "&mdlFile=" + modelName;
      let newMdlEP = path.join(app.getApiPath(), "project/new-model") + queryString;
      app.getXHR(newMdlEP, {
        success: function (err, response, body) {
          endpoint += "?path="+body.path;
          window.location.href = endpoint;
        },
        error: function (err, response, body) {
          let title = "Model Already Exists";
          let message = "A model already exists with that name";
          let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(title, message)).modal();
        }
      });
    }else{
      let modelPath = path.join(parentPath, modelName);
      let queryString = "?path="+modelPath+"&message="+message;
      endpoint += queryString;
      let existEP = path.join(app.getApiPath(), "model/exists")+queryString;
      app.getXHR(existEP, {
        always: function (err, response, body) {
          if(body.exists) {
            let title = "Model Already Exists";
            let message = "A model already exists with that name";
            let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(title, message)).modal();
          }else{
            window.location.href = endpoint;
          }
        }
      });
    }
  },
  addNewModel: function (isSpatial) {
    if(document.querySelector('#newModalModel')) {
      document.querySelector('#newModalModel').remove();
    }
    let self = this;
    let modal = $(modals.renderCreateModalHtml(true, isSpatial)).modal();
    let okBtn = document.querySelector('#newModalModel .ok-model-btn');
    let input = document.querySelector('#newModalModel #modelNameInput');
    okBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      if (Boolean(input.value)) {
        let ext = isSpatial ? ".smdl" : ".mdl";
        let modelName = input.value.split("/").pop() + ext;
        let message = modelName.split(".")[0] !== input.value ? 
              "Warning: The save as feature is not available for models in projects." : "";
        if(message){
          let warningModal = $(modals.newProjectModelWarningHtml(message)).modal();
          let yesBtn = document.querySelector('#newProjectModelWarningModal .yes-modal-btn');
          yesBtn.addEventListener('click', function (e) {
            warningModal.modal('hide');
            self.addModel(self.model.directory, modelName, message);
          });
        }else{
          self.addModel(self.model.directory, modelName, message);
        }
      }
    });
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newModalModel #modelNameInputEndCharError')
      var charErrMsg = document.querySelector('#newModalModel #modelNameInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== "" || input.value.trim() === ""
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
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  exportAsCombine: function () {},
  handleEditAnnotationClick: function (e) {
    let buttonTxt = e.target.innerText;
    if(buttonTxt.startsWith("Add")){
      $(this.queryByHook('collapse-annotation-container')).collapse('show');
      $(this.queryByHook('edit-annotation-btn')).text('Edit Notes');
    }else if(!$("#annotation-text").attr('class').includes('show')){
      $("#annotation-text").collapse('show');
      $(this.queryByHook("collapse-annotation-text")).text('-');
    }
    document.querySelector("#annotation").focus();
  },
  handleEmptyTrashClick: function () {
    if(document.querySelector("#emptyTrashConfirmModal")) {
      document.querySelector("#emptyTrashConfirmModal").remove()
    }
    let self = this;
    let modal = $(modals.emptyTrashConfirmHtml()).modal();
    let yesBtn = document.querySelector('#emptyTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      let endpoint = path.join(app.getApiPath(), "file/empty-trash")+"?path="+path.join(self.model.directory, "trash");
      app.getXHR(endpoint, {
        success: function (err, response, body) {
          $(self.queryByHook('empty-project-trash')).prop('disabled', true);
          self.update("trash");
        }
      });
    });
  },
  handleExistingModelClick: function () {
    this.addExistingModel()
  },
  handleExportCombineClick: function () {
    this.exportAsCombine();
  },
  handleExportZipClick: function () {
    let self = this;
    let queryStr = "?path="+this.model.directory+"&action=generate";
    let endpoint = path.join(app.getApiPath(), "file/download-zip")+queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        var downloadEP = path.join(app.getBasePath(), "/files", body.Path);
        window.open(downloadEP);
      }
    });
  },
  handleNewModelClick: function (e) {
    let isSpatial = e.target.dataset.type === "spatial";
    this.addNewModel(isSpatial);
  },
  handleNewWorkflowClick: function (e) {
    let type = e.target.dataset.type;
    let models = type === "Jupyter Notebook" ? this.models : this.models.filter(function (model) {
      return !model.is_spatial
    });
    if(models && models.length > 0) {
      let self = this;
      if(document.querySelector("#newProjectWorkflowModal")) {
        document.querySelector("#newProjectWorkflowModal").remove();
      }
      let options = models.map(function (model) { return model.name });
      let modal = $(modals.newProjectWorkflowHtml("Name of the model: ", options)).modal();
      let okBtn = document.querySelector("#newProjectWorkflowModal .ok-model-btn");
      let select = document.querySelector("#newProjectWorkflowModal #select");
      okBtn.addEventListener('click', function (e) {
        modal.modal('hide');
        let mdl = models.filter(function (model) {
          return model.name === select.value;
        })[0];
        if(type === "Jupyter Notebook") {
          let parentPath = path.join(path.dirname(mdl.directory), "WorkflowGroup1.wkgp");
          let queryString = "?path=" + mdl.directory + "&parentPath=" + parentPath;
          let endpoint = path.join(app.getBasePath(), 'stochss/workflow/selection') + queryString;
          window.location.href = endpoint;
        }else {
          app.newWorkflow(self, mdl.directory, mdl.is_spatial, type);
        }
      });
    }else{
      let title = "No Models Found for " + type + " Workflows";
      if(this.models.length > 0) {
        var message = "Jupyter Notebook workflows are the only workflows available for spatial models.";
      }else{
        var message = "You need to add a model before you can create a new workflow.";
      }
      let modal = $(modals.noModelsMessageHtml(title, message)).modal();
    }
  },
  handleUploadModelClick: function (e) {
    let type = e.target.dataset.type
    this.projectFileBrowser.uploadFile(undefined, type)
  },
  renderArchiveCollection: function () {
    if(this.archiveCollectionView) {
      this.archiveCollectionView.remove();
    }
    this.archiveCollectionView = this.renderCollection(
      this.model.archive,
      ArchiveListing,
      this.queryByHook("archive-listing")
    );
  },
  renderMetaDataView: function () {
    if(this.metaDataView) {
      this.metaDataView.remove();
    }
    this.metaDataView = new MetaDataView({
      model: this.model
    });
    app.registerRenderSubview(this, this.metaDataView, "project-meta-data-container");
  },
  renderModelsCollection: function () {
    if(this.modelCollectionView){
      this.modelCollectionView.remove();
    }
    this.modelCollectionView = this.renderCollection(
      this.models,
      ModelListing,
      this.queryByHook("model-listing")
    );
  },
  renderProjectFileBrowser: function () {
    if(this.projectFileBrowser) {
      this.projectFileBrowser.remove();
    }
    let self = this;
    this.projectFileBrowser = new FileBrowser({
      root: self.model.directory
    });
    app.registerRenderSubview(this, this.projectFileBrowser, "file-browser");
  },
  renderSubviews: function (emptyTrash) {
    PageView.prototype.render.apply(this, arguments);
    if(!this.model.newFormat) {
      let self = this;
      let modal = $(modals.updateFormatHtml("Project")).modal();
      let yesBtn = document.querySelector("#updateProjectFormatModal .yes-modal-btn");
      yesBtn.addEventListener("click", function (e) {
        modal.modal("hide");
        let queryStr = "?path=" + self.model.directory + "&action=update-project";
        let endpoint = path.join(app.getBasePath(), "stochss/loading-page") + queryStr;
        window.location.href = endpoint;
      });
    }
    $("#page-title").text("Project: " + this.model.name);
    if(this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Edit Notes');
      $(this.queryByHook('annotation-text-container')).text(this.model.annotation);
      $(this.queryByHook("collapse-annotation-container")).collapse('show');
    }
    if(this.model.newFormat) {
      $("#" + this.model.elementID + "-archive-section").css("display", "block");
      this.renderWorkflowGroupCollection();
      this.renderArchiveCollection();
    }else{
      $("#" + this.model.elementID + "-workflows-section").css("display", "block");
      this.renderModelsCollection();
      this.renderWorkflowsCollection();
    }
    this.renderMetaDataView();
    this.renderProjectFileBrowser();
    $(this.queryByHook('empty-project-trash')).prop('disabled', emptyTrash);
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
    });
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  renderWorkflowsCollection: function () {
    if(this.workflowCollectionView) {
      this.workflowCollectionView.remove();
    }
    this.workflowCollectionView = this.renderCollection(
      this.model.workflowGroups.models[0].workflows,
      WorkflowListing,
      this.queryByHook("workflow-listing")
    );
  },
  renderWorkflowGroupCollection: function () {
    if(this.workflowGroupCollection) {
      this.workflowGroupCollection.remove();
    }
    this.workflowGroupCollection = this.renderCollection(
      this.model.workflowGroups,
      WorkflowGroupListing,
      this.queryByHook("model-listing")
    );
  },
  update: function (target) {
    this.projectFileBrowser.refreshJSTree();
    let fetchTypes = ["Model", "Workflow", "WorkflowGroup", "Archive"];
    if(fetchTypes.includes(target)) {
      let self = this;
      app.getXHR(this.model.url(), {
        success: function (err, response, body) {
          self.model.set(body)
          if(self.model.newFormat) {
            self.renderWorkflowGroupCollection();
          }else{
            if(target === "Workflow"){
              self.renderWorkflowsCollection();
            }
            if(target === "Model"){
              self.models = new Collection(body.models, {model: Model});
              self.renderModelsCollection();
            }
          }
          $(self.queryByHook('empty-project-trash')).prop('disabled', body.trash_empty)
        }
      });
    }
  },
  updateAnnotation: function (e) {
    this.model.annotation = e.target.value.trim();
    if(this.model.annotation === ""){
      $(this.queryByHook('edit-annotation-btn')).text('Add Notes');
      $(this.queryByHook("collapse-annotation-container")).collapse('hide');
    }
    let endpoint = path.join(app.getApiPath(), "project/save-annotation")+"?path="+this.model.directory;
    let data = {'annotation': this.model.annotation};
    app.postXHR(endpoint, data, {
      always: function (err, response, body) {
        console.log(body);
      }
    });
  },
  validateName(input) {
    var error = "";
    if(input.endsWith('/')) {
      error = 'forward';
    }
    let invalidChars = "`~!@#$%^&*=+[{]}\"|:;'<,>?\\";
    for(var i = 0; i < input.length; i++) {
      if(invalidChars.includes(input.charAt(i))) {
        error = error === "" || error === "special" ? "special" : "both";
      }
    }
    return error;
  }
});

initPage(ProjectManager)