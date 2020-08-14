var $ = require('jquery');
var xhr = require('xhr');
var path = require('path');
//support files
var app = require('../app');
var modals = require('../modals');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/editModelView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-model-edit]' : 'handleEditModelClick',
    'click [data-hook=project-model-workflow]' : 'handleNewWorkflowClick',
    'click [data-hook=edit-annotation-btn]' : 'handleEditAnnotationClick',
    'click [data-hook=project-model-remove]' : 'handleRemoveModelClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add')
    }
  },
  handleEditModelClick: function (e) {
    let queryString = "?path="+this.model.directory
    window.location.href = path.join(app.getBasePath(), "stochss/models/edit")+queryString
  },
  handleNewWorkflowClick: function (e) {
    if(this.parent.parent.model.workflowGroups.length > 1) {
      let self = this
      if(document.querySelector('#newProjectWorkflowModal')){
        document.querySelector('#newProjectWorkflowModal').remove()
      }
      let options = this.parent.parent.model.workflowGroups.map(function (workflowGroup) {
        return workflowGroup.name
      });
      let modal = $(modals.newProjectWorkflowHtml("Name of the workflow group:", options)).modal()
      let okBtn = document.querySelector('#newProjectWorkflowModal .ok-model-btn')
      let select = document.querySelector('#newProjectWorkflowModal #select')
      okBtn.addEventListener('click', function (e) {
        modal.modal('hide')
        let expFile = select.value.endsWith('.wkgp') ? select.value : select.value + ".wkgp" 
        self.openWorkflowManager(expFile)
      });
    }else if(this.parent.parent.model.workflowGroups.length == 1) {
      let expFile = this.parent.parent.model.workflowGroups.models[0].name + ".wkgp"
      this.openWorkflowManager(expFile)
    }else{
      let title = "No Workflow Groups Found"
      let message = "You need to create an workflow group before you can create a new workflow."
      let modal = $(modals.noWorkflowGroupMessageHtml(title, message)).modal()
    }
  },
  openWorkflowManager: function (expFile) {
    let parentPath = path.join(path.dirname(this.model.directory), expFile)
    let queryString = "?path="+this.model.directory+"&parentPath="+parentPath
    let endpoint = path.join(app.getBasePath(), 'stochss/workflow/selection')+queryString
    window.location.href = endpoint
  },
  handleRemoveModelClick: function (e) {
    let self = this
    if(document.querySelector('#moveToTrashConfirmModal')) {
      document.querySelector('#moveToTrashConfirmModal').remove();
    }
    let modal = $(modals.moveToTrashConfirmHtml("model")).modal();
    let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      let trashPath = path.join(path.dirname(self.model.directory), "trash", self.model.directory.split('/').pop())
      let queryString = "?srcPath="+self.model.directory+"&dstPath="+trashPath
      let endpoint = path.join(app.getApiPath(), 'file/move')+queryString
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          self.parent.parent.update("model-editor")
        }
      });
      modal.modal('hide')
    });
  },
  handleEditAnnotationClick: function (e) {
    let self = this
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#modelAnnotationModal')) {
      document.querySelector('#modelAnnotationModal').remove();
    }
    let modal = $(modals.annotationModalHtml("model", name, annotation)).modal();
    let okBtn = document.querySelector('#modelAnnotationModal .ok-model-btn');
    let input = document.querySelector('#modelAnnotationModal #modelAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      self.model.annotation = input.value;
      self.model.saveModel()
      self.parent.renderEditModelview();
    });
  }
});