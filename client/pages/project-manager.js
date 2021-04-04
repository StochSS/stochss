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

let xhr = require('xhr');
let $ = require('jquery');
let path = require('path');
//support files
let app = require('../app');
let modals = require('../modals');
//models
let Project = require('../models/project');
//views
let PageView = require('./base');
let MetaDataView = require('../views/meta-data');
let FileBrowser = require('../views/file-browser-view');
let WorkflowListing = require('../views/workflow-listing');
//templates
let template = require('../templates/pages/projectManager.pug');

import initPage from './page.js'

let ProjectManager = PageView.extend({
  template: template,
  events: {
    'change [data-hook=annotation-text-container]' : 'updateAnnotation',
    'click [data-hook=edit-annotation-btn]' : 'handleEditAnnotationClick',
    'click [data-hook=collapse-annotation-container]' : 'changeCollapseButtonText',
    'click [data-hook=new-workflow]' : 'handleNewWorkflowClick',
    'click [data-hook=project-manager-advanced-btn]' : 'changeCollapseButtonText',
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
    this.model.fetch({
      success: function (model, response, options) {
        $("#page-title").text("Project: " + model.name);
        if(model.annotation){
          $(self.queryByHook('edit-annotation-btn')).text('Edit Notes');
          $(self.queryByHook('annotation-text-container')).text(model.annotation);
          $(self.queryByHook("collapse-annotation-container")).collapse('show');
        }
        $(self.queryByHook('empty-project-trash')).prop('disabled', response.trash_empty)
        if(!self.model.newFormat) {
          self.model.workflowGroups.models[0].model = null;
        }
        self.renderSubviews()
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
      let endpoint = path.join(app.getApiPath(), "project/empty-trash")+"?path="+path.join(self.model.directory, "trash");
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          $(self.queryByHook('empty-project-trash')).prop('disabled', true);
          self.update("trash");
        }
      });
    });
  },
  handleExportCombineClick: function () {
    this.exportAsCombine();
  },
  handleExportZipClick: function () {
    let self = this;
    let queryStr = "?path="+this.model.directory+"&action=generate";
    let endpoint = path.join(app.getApiPath(), "file/download-zip")+queryStr;
    xhr({uri:endpoint, json:true}, function (err, response, body) {
      if(response.statusCode < 400) {
        var downloadEP = path.join(app.getBasePath(), "/files", body.Path);
        window.open(downloadEP);
      }
    });
  },
  handleNewWorkflowClick: function (e) {
    let models = this.models;
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
        let mdlPath = models.filter(function (model) {
          return model.name === select.value;
        })[0].directory;
        let projectPath = self.model.directory;
        var parentPath = mdlPath.includes(".wkgp") ? path.dirname(mdlPath) : path.join(projectPath, "WorkflowGroup1.wkgp");
        let queryString = "?path="+mdlPath+"&parentPath="+parentPath;
        console.log(queryString)
        // window.location.href = path.join(app.getBasePath(), 'stochss/workflow/selection') + queryString;
      });
    }else{
      let title = "No Models Found";
      let message = "You need to add a model before you can create a new workflow.";
      let modal = $(modals.noModelsMessageHtml(title, message)).modal();
    }
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
  renderSubviews: function () {
    PageView.prototype.render.apply(this, arguments);
    if(this.model.newFormat) {
      console.log("TODO: Render Workflow Groups Collection")
      console.log("TODO: Render Archives Collection")
    }else{
      $("#"+this.model.elementID+"-workflows-section").css("display", "block");
      this.renderWorkflowsCollection();
      console.log("TODO: Render Models collection")
    }
    // console.log(this.model.workflowGroups.models[0].workflows)
    this.renderMetaDataView();
    this.renderProjectFileBrowser();
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
    if(this.workflowsCollectionView) {
      this.workflowsCollectionView.remove();
    }
    this.workflowsCollectionView = this.renderCollection(
      this.model.workflowGroups.models[0].workflows,
      WorkflowListing,
      this.queryByHook("workflow-listing")
    );
  },
  update: function (target) {
    this.projectFileBrowser.refreshJSTree();
    let fetchTypes = ["Model", "Workflow", "WorkflowGroup"];
    if(fetchTypes.includes(target)) {
      let self = this;
      this.model.fetch({
        success: function (model, response, options) {
          if(model.newFormat) {
            console.log("TODO")
          }else{
            if(target === "Workflow"){
              self.renderWorkflowsCollection();
            }
          }
          $(self.queryByHook('empty-project-trash')).prop('disabled', response.trash_empty)
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
    xhr({uri: endpoint, json: true, method: "post", data: {'annotation': this.model.annotation}});
  }
});

initPage(ProjectManager)