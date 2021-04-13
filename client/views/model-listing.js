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
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/modelListing.pug');

module.exports = View.extend({
  template: template,
  events: function () {
  	let events = {};
  	events['change [data-hook=' + this.model.elementID + '-annotation]'] = 'updateAnnotation';
    events['click #' + this.model.elementID + "-ensemble-simulation"] = 'handleEnsembleSimulationClick';
    events['click #' + this.model.elementID + "-parameter-sweep"] = 'handleParameterSweepClick';
  	events['click [data-hook=' + this.model.elementID + '-notes-btn]'] = 'handleEditNotesClick';
  	events['click [data-hook=' + this.model.elementID + '-remove]'] = 'handleTrashModelClick';
  	events['click [data-hook=' + this.model.elementID + '-annotation-btn'] = 'changeCollapseButtonText';
  	return events;
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    let parentPath = path.join(path.dirname(this.model.directory), "WorkflowGroup1.wkgp");
    let queryString = "?path=" + this.model.directory + "&parentPath=" + parentPath;
    let endpoint = path.join(app.getBasePath(), 'stochss/workflow/selection') + queryString;
    $(this.queryByHook(this.model.elementID + "-jupyter-notebook")).prop("href", endpoint);
    if(!this.model.annotation){
      $(this.queryByHook(this.model.elementID + '-notes-btn')).text('Add Notes')
    }else{
      $(this.queryByHook(this.model.elementID + '-notes-container')).collapse('show')
    }
  },
  changeCollapseButtonText: function (e) {
  	app.changeCollapseButtonText(this, e);
  },
  handleEditNotesClick: function (e) {
  	let buttonTxt = e.target.innerText;
    if(buttonTxt.startsWith("Add")){
      $(this.queryByHook(this.model.elementID + "-notes-container")).collapse('show');
      $(this.queryByHook(this.model.elementID + "-notes-btn")).text('Edit Notes');
      $("#" + this.model.elementID + "-annotation-container").collapse('show');
      $(this.queryByHook(this.model.elementID + "-annotation-btn")).text('-');
    }else if(!$("#" + this.model.elementID + "-annotation-container").attr('class').includes('show')){
      $("#" + this.model.elementID + "-annotation-container").collapse('show');
      $(this.queryByHook(this.model.elementID + "-annotation-btn")).text('-');
    }
    document.querySelector("#" + this.model.elementID + "-annotation").focus();
  },
  handleEnsembleSimulationClick: function (e) {
    app.newWorkflow(this, this.model.directory, this.model.is_spatial, "Ensemble Simulation")
  },
  handleParameterSweepClick: function (e) {
    app.newWorkflow(this, this.model.directory, this.model.is_spatial, "Parameter Sweep")
  },
  handleTrashModelClick: function (e) {
    if(document.querySelector('#moveToTrashConfirmModal')) {
      document.querySelector('#moveToTrashConfirmModal').remove();
    }
    let self = this;
    let modal = $(modals.moveToTrashConfirmHtml("model")).modal();
    let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      let projectPath = self.parent.model.directory;
      let trashPath = path.join(projectPath, "trash", self.model.directory.split("/").pop());
      let queryString = "?srcPath="+self.model.directory+"&dstPath="+trashPath;
      let endpoint = path.join(app.getApiPath(), 'file/move')+queryString;
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          self.parent.update("Model");
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
    this.model.saveModel();
  }
});
