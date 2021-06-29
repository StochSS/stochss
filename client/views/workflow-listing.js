/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
let _ = require('underscore');
//support files
let app = require('../app');
let modals = require('../modals');
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/workflowListing.pug');

module.exports = View.extend({
  template: template,
  events: function () {
  	let events = {};
  	events['change [data-hook=' + this.model.elementID + '-annotation]'] = 'updateAnnotation';
  	events['click [data-hook=' + this.model.elementID + '-notes-btn]'] = 'handleEditAnnotationClick';
  	events['click [data-hook=' + this.model.elementID + '-remove]'] = 'handleTrashWorkflowClick';
  	events['click [data-hook=' + this.model.elementID + '-annotation-btn'] = 'changeCollapseButtonText';
  	return events;
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.model.collection.parent.collection.parent.newFormat) {
      $(this.queryByHook(this.model.elementID + "-status")).css("display", "none");
      if(this.model.collection.indexOf(this.model) === this.model.collection.length - 1) {
        $(this.queryByHook(this.model.elementID + "-divider")).css("display", "none");
      }
    }else if(this.model.status === "running"){
      this.getStatus();
    }
    if(this.model.directory.endsWith('.ipynb')) {
      $(this.queryByHook(this.model.elementID + "-notes-btn")).css("display", "none");
    }
    if(!this.model.annotation || !this.model.annotation.trim()){
      $(this.queryByHook(this.model.elementID + "-notes-btn")).text('Add Notes');
    }else{
      $(this.queryByHook(this.model.elementID + "-notes-container")).collapse('show')
    }
  },
  changeCollapseButtonText: function (e) {
  	app.changeCollapseButtonText(this, e);
  },
  getProjectPath: function () {
    return this.model.directory.split(".proj")[0] + ".proj";
  },
  getStatus: function () {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "workflow/workflow-status") + "?path=" + this.model.directory;
    app.getXHR(endpoint, {
      always: function (err, response, body) {
        if(body === 'running')
          setTimeout(_.bind(self.getStatus, self), 1000);
        else{
          self.model.status = body;
          $(self.queryByHook(this.model.elementID + "-status")).text(self.model.status);
        }
      }
    });
  },
  handleEditAnnotationClick: function (e) {
    let buttonTxt = e.target.innerText;
    if(buttonTxt.startsWith("Add")){
      $(this.queryByHook(this.model.elementID + '-notes-container')).collapse('show');
      $(this.queryByHook(this.model.elementID + '-notes-btn')).text('Edit Notes');
      $("#" + this.model.elementID + "-annotation-container").collapse('show');
      $(this.queryByHook(this.model.elementID + "-annotation-btn")).text('-');
    }else if(!$("#" + this.model.elementID + "-annotation-container").attr('class').includes('show')){
      $("#" + this.model.elementID + "-annotation-container").collapse('show');
      $(this.queryByHook(this.model.elementID + "-annotation-btn")).text('-');
    }
    document.querySelector("#" + this.model.elementID + "-annotation").focus();
  },
  handleTrashWorkflowClick: function () {
  	if(document.querySelector('#moveToTrashConfirmModal')) {
      document.querySelector('#moveToTrashConfirmModal').remove();
    }
    let self = this;
    let modal = $(modals.moveToTrashConfirmHtml("workflow")).modal();
    let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      let file = self.model.directory.split('/').pop()
      let projectPath = self.getProjectPath();
      let trashPath = path.join(projectPath, "trash", file);
      let queryString = "?srcPath=" + self.model.directory + "&dstPath=" + trashPath;
      let endpoint = path.join(app.getApiPath(), 'file/move') + queryString;
      app.getXHR(endpoint, {
        success: function (err, response, body) {
          self.parent.update("Workflow");
        }
      });
    });
  },
  updateAnnotation: function (e) {
    this.model.annotation = e.target.value.trim();
    if(this.model.annotation === "") {
      $(this.queryByHook(this.model.elementID + "-notes-container")).collapse('hide');
      $(this.queryByHook(this.model.elementID + "-notes-btn")).text('Add Notes');
    }
    let queryString = "?path=" + this.model.directory;
    let endpoint = path.join(app.getApiPath(), "workflow/save-annotation") + queryString;
    let body = {'annotation':this.model.annotation};
    app.postXHR(endpoint, body);
  }
});