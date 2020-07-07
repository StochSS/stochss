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
    'click [data-hook=project-model-extract]' : 'handleExtractModelClick',
    'click [data-hook=project-model-remove]' : 'handleRemoveModelClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
  },
  handleEditModelClick: function (e) {
    window.location.href = path.join(app.getBasePath(), "stochss/models/edit")+"?path="+this.model.directory
  },
  handleNewWorkflowClick: function (e) {
    let self = this
    if(document.querySelector('#newProjectWorkflowModal')){
      document.querySelector('#newProjectWorkflowModal').remove()
    }
    let modal = $(modals.newProjectWorkflowHtml("Name of the experiment:")).modal()
    let okBtn = document.querySelector('#newProjectWorkflowModal .ok-model-btn')
    let input = document.querySelector('#newProjectWorkflowModal #input')
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      if(Boolean(input.value)) {
        let expFile = input.value.endsWith('.exp') ? input.value : input.value + ".exp" 
        let parentPath = path.join(path.dirname(self.model.directory), expFile)
        let queryString = "?path="+self.model.directory+"&parentPath="+parentPath
        let endpoint = path.join(app.getBasePath(), 'stochss/workflow/selection')+queryString
        modal.modal('hide')
        window.location.href = endpoint
      }
    });
  },
  handleExtractModelClick: function (e) {
    let self = this
    let projectParent = path.dirname(path.dirname(this.model.directory)) === '.' ? "" : path.dirname(path.dirname(this.model.directory))
    let queryString = "?srcPath="+this.model.directory+"&dstPath="+path.join(projectParent, this.model.directory.split('/').pop())
    let endpoint = path.join(app.getApiPath(), "project/extract-model")+queryString
    xhr({uri: endpoint}, function (err, response, body) {
      if(response.statusCode < 400){
        let successModel = $(modals.projectExportSuccessHtml("Model", body)).modal()
      }else{
        body = JSON.parse(body)
        let successModel = $(modals.projectExportErrorHtml("Model", body.Reason, body.message)).modal()
      }
    });
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
  }
});