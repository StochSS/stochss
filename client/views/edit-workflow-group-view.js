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
var View = require('ampersand-view');
var EditWorkflowsView = require('./edit-workflows-view');
//templates
var template = require('../templates/includes/editWorkflowGroupView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-workflow-group-view]' : 'handleViewWorkflowsClick',
    'click [data-hook=project-workflow-group-remove]' : 'handleRemoveWorkflowGroupClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderEditWorkflowsView();
    if(this.model.collection.length === 1) {
      this.handleViewWorkflowsClick(undefined)
      $(this.queryByHook("project-workflow-group-remove")).prop('disabled', true)
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
    let text = $(this.queryByHook("project-workflow-group-view")).text()
    $(this.queryByHook("project-workflows-container")).collapse(options[text])
    $(this.queryByHook("project-workflow-group-view")).text(newText[text])
  },
  handleRemoveWorkflowGroupClick: function (e) {
    if(this.model.collection.length > 1) {
      let self = this
      if(document.querySelector('#moveToTrashConfirmModal')) {
        document.querySelector('#moveToTrashConfirmModal').remove();
      }
      let title = "workflow group and it workflows"
      let modal = $(modals.moveToTrashConfirmHtml(title)).modal();
      let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
      yesBtn.addEventListener('click', function (e) {
        let expPath = path.join(self.parent.parent.projectPath, self.model.name)+".wkgp"
        let trashPath = path.join(self.parent.parent.projectPath, "trash", self.model.name + ".wkgp")
        let queryString = "?srcPath="+expPath+"&dstPath="+trashPath
        let endpoint = path.join(app.getApiPath(), 'file/move')+queryString
        xhr({uri: endpoint, json: true}, function (err, response, body) {
          if(response.statusCode < 400) {
            self.parent.parent.update("workflow-group-editor")
          }
        });
        modal.modal('hide')
      });
    }
  },
});