var $ = require('jquery');
var _ = require('underscore');
var xhr = require('xhr');
var path = require('path');
//support files
var app = require('../app');
var modals = require('../modals');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/editWorkflowView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-workflow-open]' : 'handleOpenWorkflowClick',
    'click [data-hook=project-workflow-export]' : 'handleExportWorkflowClick',
    'click [data-hook=edit-annotation-btn]' : 'handleEditAnnotationClick',
    'click [data-hook=project-workflow-remove]' : 'handleDeleteWorkflowClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.model.status === "running"){
      this.getStatus()
      console.log("updating status")
    }
    if(this.model.path.endsWith('.ipynb')) {
      this.queryByHook('annotation-container').style.display = "none"
    }
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add')
    }
  },
  getStatus: function () {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "workflow/workflow-status")+"?path="+this.model.path;
    xhr({uri: endpoint}, function (err, response, body) {
      if(self.model.status !== body )
        self.model.status = body;
      if(self.model.status === 'running')
        setTimeout(_.bind(self.getStatus, self), 1000);
      else{
        $(self.queryByHook("project-workflow-status")).text(self.model.status)
        console.log(self.model.status)
      }
    });
  },
  handleOpenWorkflowClick: function (e) {
    if(this.model.path.endsWith('.ipynb')) {
      window.open(path.join(app.getBasePath(), "notebooks", this.model.path))
    }else{
      let endpoint = path.join(app.getBasePath(), "stochss/workflow/edit")+"?path="+this.model.path+"&type=none";
      window.location.href = endpoint
    }
  },
  handleExportCombineClick: function (e) {
    this.exportAsCombine(this.model.path)
  },
  handleDeleteWorkflowClick: function (e) {
    let self = this
    if(document.querySelector('#moveToTrashConfirmModal')) {
      document.querySelector('#moveToTrashConfirmModal').remove();
    }
    let modal = $(modals.moveToTrashConfirmHtml("workflow")).modal();
    let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      let file = self.model.path.split('/').pop()
      let trashPath = path.join(path.dirname(path.dirname(self.model.path)), "trash", file)
      let queryString = "?srcPath="+self.model.path+"&dstPath="+trashPath
      let endpoint = path.join(app.getApiPath(), 'file/move')+queryString
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          self.parent.parent.parent.parent.update("workflows-editor")
        }
      });
      modal.modal('hide')
    });
  },
  handleEditAnnotationClick: function (e) {
    let self = this
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#workflowAnnotationModal')) {
      document.querySelector('#workflowAnnotationModal').remove();
    }
    let modal = $(modals.annotationModalHtml("workflow", name, annotation)).modal();
    let okBtn = document.querySelector('#workflowAnnotationModal .ok-model-btn');
    let input = document.querySelector('#workflowAnnotationModal #workflowAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      self.model.annotation = input.value;
      let queryString = "?path="+path.join(self.model.path, "info.json")
      let endpoint = path.join(app.getApiPath(), "workflow/save-annotation")+queryString
      let body = {'annotation':self.model.annotation}
      xhr({uri:endpoint, json:true, method:'post', body:body}, function (err, response, body) {
        if(response.statusCode < 400) {
          self.parent.renderEditWorkflowView();
        }
      })
    });
  },
  exportAsCombine: function (target) {
    this.parent.parent.exportAsCombine(target)
  }
});