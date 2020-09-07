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
var template = require('../templates/includes/editModelView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-model-edit]' : 'handleEditModelClick',
    'click [data-hook=project-model-workflow-option]' : 'handleNewWorkflowClick',
    'click [data-hook=edit-model-annotation-btn]' : 'handleEditAnnotationClick',
    'click [data-hook=project-model-remove]' : 'handleRemoveModelClick',
    'click [data-hook=collapse-annotation-text]' : 'changeCollapseButtonText',
    'change [data-hook=annotation]' : 'updateAnnotation'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.workflowGroupOptions = this.model.collection.parent.workflowGroups.map(function (wg) {
      return wg.name
    })
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(!this.model.annotation){
      $(this.queryByHook('edit-model-annotation-btn')).text('Add Notes')
    }else{
      $(this.queryByHook('collapse-annotation-container'+this.model.name.replace(/ /g,""))).collapse('show')
    }
  },
  handleEditModelClick: function (e) {
    let queryString = "?path="+this.model.directory
    window.location.href = path.join(app.getBasePath(), "stochss/models/edit")+queryString
  },
  handleNewWorkflowClick: function (e) {
    let name = e.target.dataset.name
    if(name === "invalid") {
      this.parent.parent.addNewWorkflowGroup(_.bind(this.openWorkflowManager, this))
    }else{
      let expFile = name + ".wkgp"
      this.openWorkflowManager(expFile)
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
    let buttonTxt = e.target.innerText;
    if(buttonTxt.startsWith("Add")){
      $(this.queryByHook('collapse-annotation-container'+this.model.name.replace(/ /g,""))).collapse('show')
      $(this.queryByHook('edit-model-annotation-btn')).text('Edit Notes')
    }else if(!$("#annotation-text"+this.model.name.replace(/ /g,"")).attr('class').includes('show')){
      $("#annotation-text"+this.model.name.replace(/ /g,"")).collapse('show')
      $(this.queryByHook("collapse-annotation-text")).text('-')
    }
    document.querySelector("#annotation"+this.model.name.replace(/ /g,"")).focus()
  },
  updateAnnotation: function (e) {
    this.model.annotation = e.target.value.trim();
    if(this.model.annotation === "") {
      $(this.queryByHook('collapse-annotation-container'+this.model.name.replace(/ /g,""))).collapse('hide')
      $(this.queryByHook('edit-model-annotation-btn')).text('Add Notes')
    }
    this.model.saveModel()
  },
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
  }
});