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

let $ = require('jquery');
let path = require('path');
//support files
let app = require('../app');
let modals = require('../modals');
//views
let View = require('ampersand-view');
let WorkflowListing = require("./workflow-listing");
//templates
let template = require('../templates/includes/workflowGroupListing.pug');

module.exports = View.extend({
  template: template,
  events: function () {
    let events = {};
    events['change [data-hook=' + this.model.elementID + '-annotation'] = 'updateAnnotation';
    events['click #' + this.model.elementID + "-ensemble-simulation"] = 'handleEnsembleSimulationClick';
    events['click #' + this.model.elementID + "-parameter-sweep"] = 'handleParameterSweepClick';
    events['click [data-hook=' + this.model.elementID + '-remove'] = 'handleTrashModelClick';
    events['click [data-hook=' + this.model.elementID + '-tab-btn'] = 'changeCollapseButtonText';
    return events;
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    let parentPath = path.dirname(this.model.model.directory);
    let queryString = "?path=" + this.model.model.directory + "&parentPath=" + parentPath;
    let endpoint = path.join(app.getBasePath(), 'stochss/workflow/selection') + queryString;
    $(this.queryByHook(this.model.elementID + "-jupyter-notebook")).prop("href", endpoint);
    this.renderWorkflowCollection();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  handleEnsembleSimulationClick: function (e) {
    app.newWorkflow(this, this.model.model.directory, this.model.model.is_spatial, "Ensemble Simulation")
  },
  handleParameterSweepClick: function (e) {
    app.newWorkflow(this, this.model.model.directory, this.model.model.is_spatial, "Parameter Sweep")
  },
  handleTrashModelClick: function () {
    if(document.querySelector('#moveToTrashConfirmModal')) {
      document.querySelector('#moveToTrashConfirmModal').remove();
    }
    let self = this;
    let modal = $(modals.moveToTrashConfirmHtml("model", true)).modal();
    let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      let file = self.model.model.directory.split('/').pop();
      let projectPath = self.parent.model.directory;
      let trashPath = path.join(projectPath, "trash", file);
      let queryString = "?srcPath=" + self.model.model.directory + "&dstPath=" + trashPath;
      let endpoint = path.join(app.getApiPath(), 'file/move') + queryString;
      app.getXHR(endpoint, {
        success: function (err, response, body) {
          self.parent.update("WorkflowGroup");
        }
      });
    });
  },
  renderWorkflowCollection: function () {
    if(this.workflowCollectionView){
      this.workflowCollectionView.remove();
    }
    this.workflowCollectionView = this.renderCollection(
      this.model.workflows,
      WorkflowListing,
      this.queryByHook(this.model.elementID + "-workflow-listing")
    );
  },
  update: function (target) {
    this.parent.update(target);
  },
  updateAnnotation: function (e) {
    this.model.model.annotation = e.target.value.trim();
    this.model.model.saveModel();
  }
});