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
    'click [data-hook=edit-workflow-annotation-btn]' : 'handleEditAnnotationClick',
    'click [data-hook=project-workflow-remove]' : 'handleDeleteWorkflowClick',
    'click [data-hook=collapse-annotation-text]' : 'changeCollapseButtonText',
    'change [data-hook=annotation]' : 'updateAnnotation'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.model.status === "running"){
      this.getStatus()
    }
    if(this.model.path.endsWith('.ipynb')) {
      this.queryByHook('annotation-container').style.display = "none"
    }
    if(!this.model.annotation || !this.model.annotation.trim()){
      $(this.queryByHook('edit-workflow-annotation-btn')).text('Add Notes')
    }else{
      $(this.queryByHook('collapse-annotation-container'+this.model.name.replace(/ /g,""))).collapse('show')
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
    let buttonTxt = e.target.innerText;
    if(buttonTxt.startsWith("Add")){
      $(this.queryByHook('collapse-annotation-container'+this.model.name.replace(/ /g,""))).collapse('show')
      $("#annotation-text"+this.model.name.replace(/ /g,"")).collapse('show')
      $(this.queryByHook('edit-workflow-annotation-btn')).text('Edit Notes')
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
      $(this.queryByHook('edit-workflow-annotation-btn')).text('Add Notes')
    }
    let queryString = "?path="+path.join(this.model.path)
    let endpoint = path.join(app.getApiPath(), "workflow/save-annotation")+queryString
    let body = {'annotation':this.model.annotation}
    xhr({uri:endpoint, json:true, method:'post', body:body}, function (err, response, body) {console.log("Saved Notes")})
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