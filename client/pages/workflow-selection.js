/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
var app = require('../app');
//models
let Model = require('../models/model');
//views
let PageView = require('./base');
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/pages/workflowSelection.pug');

import initPage from './page.js';

let workflowSelection = PageView.extend({
  template: template,
  events: {
    "change [data-hook=compute-env-select]" : "handleSelectComputeEnv",
    "click [data-hook=ensemble-simulation]" : "notebookWorkflow",
    "click [data-hook=spatial-simulation]" : "notebookWorkflow",
    "click [data-hook=oned-parameter-sweep]" : "notebookWorkflow",
    "click [data-hook=twod-parameter-sweep]" : "notebookWorkflow",
    "click [data-hook=sciope-model-exploration]" : "notebookWorkflow",
    "click [data-hook=model-inference]" : "notebookWorkflow"
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search);
    this.modelDir = urlParams.get('path');
    if(urlParams.has('parentPath')){
      this.parentPath = urlParams.get('parentPath');
    }else{
      this.parentPath = path.dirname(this.modelDir);
    }
    if(this.modelDir.includes(".proj")) {
      this.projectPath = path.dirname(this.modelDir);
      if(this.modelDir.includes(".wkgp")) {
        this.projectPath = path.dirname(this.projectPath);
      }
      this.projectName = this.projectPath.split('/').pop().split('.proj')[0];
      this.workflowGroupName = this.parentPath.split('/').pop().split('.wkgp')[0];
    }
    this.computeEnv = "StochSS";
    this.model = new Model({
      directory: this.modelDir,
      isPreview: false,
      for: "wkfl",
    });
    app.getXHR(this.model.url(), {
      success: (err, response, body) => {
        this.model.set(body)
        $(this.queryByHook("wkfl-selection-header")).text(`Workflow Selection for ${this.model.name}`);
        if(this.modelDir.includes(".proj")) {
          this.queryByHook("workflow-selection-breadcrumb-links").style.display = "block";
        }
        this.validateWorkflows()
      }
    });
  },
  handleSelectComputeEnv: function (e) {
    this.computeEnv = e.target.value;
  },
  notebookWorkflow: function (e) {
    let type = e.target.dataset.type;
    let queryString = `?type=${type}&path=${this.modelDir}&parentPath=${this.parentPath}&compute=${this.computeEnv}`;
    let endpoint = `${path.join(app.getApiPath(), "workflow/notebook")}${queryString}`;
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        let notebookPath = path.join(app.getBasePath(), "notebooks", body.FilePath)
        window.open(notebookPath, "_blank")
        window.history.back();
      }
    });
  },
  validateWorkflows: function () {
    this.model.updateValid();
    let invalid = !this.model.valid;
    if(invalid) {
      let endpoint = path.join(app.getBasePath(), "stochss/model-editor") + '?path=' + this.model.directory + '&validate';
      let message = 'Errors were detected in you model <a href="' + endpoint + '">click here to fix your model<a/>';
      $(this.queryByHook('invalid-model-message')).html(message);
      $(this.queryByHook('invalid-model-message')).css('display', 'block');
    }
    let dimensions = this.model.parameters.length;
    if(dimensions < 2) {
      $(this.queryByHook('psweep-workflow-message')).css('display', 'block');
      if(dimensions === 1) {
        $(this.queryByHook('psweep-workflow-message')).html('<b>2D Parameter Sweep</b> workflows require at least two parameters');
      }
    }
    $(this.queryByHook('ensemble-simulation')).prop('disabled', invalid || this.model.is_spatial);
    $(this.queryByHook('spatial-simulation')).prop('disabled', invalid || !this.model.is_spatial);
    $(this.queryByHook('model-inference')).prop('disabled', invalid || this.model.is_spatial);
    $(this.queryByHook('oned-parameter-sweep')).prop('disabled', invalid || this.model.is_spatial || dimensions < 1);
    $(this.queryByHook('twod-parameter-sweep')).prop('disabled', invalid || this.model.is_spatial || dimensions < 2);
    $(this.queryByHook('sciope-model-exploration')).prop('disabled', invalid || this.model.is_spatial);
    $(this.queryByHook('compute-env-select').firstChild.children[1]).prop('disabled', this.model.is_spatial);
  },
  subviews: {
    computeEnvSelect: {
      hook: "compute-env-select",
      prepareView: function (el) {
        let options = ["StochSS", "AWS Cloud"];
        return new SelectView({
          name: 'compute-environment',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.computeEnv
        });
      }
    }
  }
});

initPage(workflowSelection);
