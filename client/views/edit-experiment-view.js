var $ = require('jquery');
var xhr = require('xhr');
var path = require('path');
//support files
var app = require('../app');
var modals = require('../modals');
//views
var View = require('ampersand-view');
var EditWorkflowsView = require('./edit-workflows-view');
//templates
var template = require('../templates/includes/editExperimentView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-experiment-view]' : 'handleViewWorkflowsClick',
    'click [data-hook=project-experiment-new-workflow]' : 'handleNewWorkflowClick',
    'click [data-hook=project-experiment-add-workflow]' : 'handleAddWorkflowClick',
    'click [data-hook=export-experiment-as-combine]' : 'handleExportCombineClick',
    'click [data-hook=project-experiment-remove]' : 'handleRemoveExperimentClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderEditWorkflowsView();
  },
  renderEditWorkflowsView: function () {
    if(this.editWorkflowsView){
      this.editWorkflowsView.remove()
    }
    this.editWorkflowsView = new EditWorkflowsView({
      collection: this.model.workflows
    });
    this.registerRenderSubview(this.editWorkflowsView, "project-workflows-container")
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  handleViewWorkflowsClick: function (e) {
    let options = {"View":"show", "Hide":"hide"}
    let newText = {"View":"Hide", "Hide":"View"}
    let text = $(this.queryByHook("project-experiment-view")).text()
    $(this.queryByHook("project-workflows-container")).collapse(options[text])
    $(this.queryByHook("project-experiment-view")).text(newText[text])
  },
  handleNewWorkflowClick: function (e) {
    if(this.parent.parent.model.models.length > 0) {
    let self = this
      if(document.querySelector("#newProjectWorkflowModal")) {
        document.querySelector("#newProjectWorkflowModal").remove()
      }
      let modal = $(modals.newProjectWorkflowHtml("Name of the model: ")).modal()
      let okBtn = document.querySelector("#newProjectWorkflowModal .ok-model-btn")
      let input = document.querySelector("#newProjectWorkflowModal #input")
      input.addEventListener("keyup", function (event) {
        if(event.keyCode === 13){
          event.preventDefault();
          okBtn.click();
        }
      });
      okBtn.addEventListener('click', function (e) {
        if(Boolean(input.value)) {
          let mdlFile = input.value.endsWith('.mdl') ? input.value : input.value + ".mdl"
          let mdlPath =  path.join(self.parent.parent.projectPath, mdlFile)
          let parentPath = path.join(self.parent.parent.projectPath, self.model.name)+".exp"
          let queryString = "?path="+mdlPath+"&parentPath="+parentPath
          let endpoint = path.join(app.getBasePath(), 'stochss/workflow/selection')+queryString
          modal.modal('hide')
          window.location.href = endpoint
        }
      });
    }else{
      let title = "No Models Found"
      let message = "You need to add a model before you can create a new workflow."
      let modal = $(modals.noExperimentMessageHtml(title, message)).modal()
    }
  },
  handleAddWorkflowClick: function (e) {
    let self = this
    if(document.querySelector("#newProjectWorkflowModal")) {
      document.querySelector("#newProjectWorkflowModal").remove()
    }
    let modal = $(modals.addExistingWorkflowToProjectHtml()).modal()
    let okBtn = document.querySelector("#newProjectWorkflowModal .ok-model-btn")
    let input = document.querySelector("#newProjectWorkflowModal #workflowPathInput")
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      if(Boolean(input.value)) {
        let expPath = path.join(self.parent.parent.projectPath, self.model.name)+".exp"
        let queryString = "?path="+expPath+"&wkflPath="+input.value
        let endpoint = path.join(app.getApiPath(), "project/add-existing-workflow")+queryString
        xhr({uri: endpoint, json: true}, function (err, response, body) {
          if(response.statusCode < 400) {
            self.parent.parent.update("experiment-editor")
            let successModal = $(modals.addExistingWorkflowToProjectSuccessHtml(body.message)).modal()
          }else{
            let errorModal = $(modals.addExistingWorkflowToProjectErrorHtml(body.Reason, body.Message)).modal()
          }
        });
        modal.modal('hide')
      }
    });
  },
  handleExportCombineClick: function (e) {
    let parentPath = this.parent.parent.projectPath
    let target = path.join(parentPath, this.model.name + ".exp")
    this.exportAsCombine(target)
  },
  handleRemoveExperimentClick: function (e) {
    let self = this
    if(document.querySelector('#moveToTrashConfirmModal')) {
      document.querySelector('#moveToTrashConfirmModal').remove();
    }
    let modal = $(modals.moveToTrashConfirmHtml("experiment")).modal();
    let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      let expPath = path.join(self.parent.parent.projectPath, self.model.name)+".exp"
      let trashPath = path.join(self.parent.parent.projectPath, "trash")
      let queryString = "?srcPath="+expPath+"&dstPath="+trashPath
      let endpoint = path.join(app.getApiPath(), 'file/move')+queryString
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          self.parent.parent.update("experiment-editor")
        }
      });
      modal.modal('hide')
    });
  },
  exportAsCombine: function (target) {
    this.parent.parent.exportAsCombine(target)
  }
});