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
    'click [data-hook=project-experiment-remove]' : 'handleRemoveExperimentClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderEditWorkflowsView();
    if(this.model.collection.length === 1) {
      this.handleViewWorkflowsClick(undefined)
      $(this.queryByHook("project-experiment-remove")).prop('disabled', true)
    }
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
    let options = {"+":"show", "-":"hide"}
    let newText = {"+":"-", "-":"+"}
    let text = $(this.queryByHook("project-experiment-view")).text()
    $(this.queryByHook("project-workflows-container")).collapse(options[text])
    $(this.queryByHook("project-experiment-view")).text(newText[text])
  },
  handleRemoveExperimentClick: function (e) {
    if(this.model.collection.length > 1) {
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
    }
  },
});