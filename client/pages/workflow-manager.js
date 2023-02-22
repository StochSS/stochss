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
let _ = require('underscore');
//support files
let app = require('../app');
let modals = require('../modals');
//models
let Model = require('../models/model');
let Workflow = require('../models/workflow');
//views
let PageView = require('./base');
let SelectView = require('ampersand-select-view');
let ActiveJobView = require('../job-view/job-view');
let StatusView = require('../views/workflow-status');
let JobListingView = require('../views/job-listing');
let SettingsView = require('../settings-view/settings-view');
//templates
let template = require('../templates/pages/workflowManager.pug');

import initPage from './page.js';

let WorkflowManager = PageView.extend({
  template: template,
  events: {
    'change [data-hook=model-file]' : 'handleModelSelect',
    'change [data-hook=model-location]' : 'handleLocationSelect',
    'click [data-hook=project-breadcrumb]' : 'handleReturnToProject',
    'click [data-hook=save-model]' : 'handleSaveWorkflow',
    'click [data-hook=collapse-settings]' : 'changeCollapseButtonText',
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=start-job]'  : 'clickStartJobHandler',
    'click [data-hook=edit-model]' : 'clickEditModelHandler',
    'click [data-hook=collapse-jobs]' : 'changeCollapseButtonText',
    'click [data-hook=return-to-project-btn]' : 'handleReturnToProject'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search);
    this.model = new Workflow({
      directory: urlParams.get('path')
    });
    let self = this;
    app.getXHR(this.model.url(), {
      success: function (err, response, body) {
        self.model.set(body)
        $("#page-title").text("Workflow: " + self.model.name);
        if(self.model.directory.includes('.proj')) {
          let index = self.model.directory.indexOf('.proj') + 5;
          self.projectPath = self.model.directory.slice(0, index);
          $(self.queryByHook('project-breadcrumb')).text(self.projectPath.split('/').pop().split('.proj')[0]);
          $(self.queryByHook('workflow-breadcrumb')).text(self.model.name);
          self.queryByHook("project-breadcrumb-links").style.display = "block";
          self.queryByHook("return-to-project-btn").style.display = "inline-block";
        }
        if(body.models){
          self.renderModelSelectView(body.models);
        }
        self.renderSubviews();
        if(!self.model.newFormat) {
          let modal = $(modals.updateFormatHtml("Workflow")).modal();
          let yesBtn = document.querySelector("#updateWorkflowFormatModal .yes-modal-btn");
          yesBtn.addEventListener("click", function (e) {
            modal.modal("hide");
            let queryStr = "?path=" + self.model.directory + "&action=update-workflow";
            let endpoint = path.join(app.getBasePath(), "stochss/loading-page") + queryStr;
            window.location.href = endpoint;
          });
        }
      }
    });
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  clickEditModelHandler: function (e) {
    this.handleSaveWorkflow(e, _.bind(function () {
      let queryStr = "?path=" + this.model.model;
      let endpoint = path.join(app.getBasePath(), "stochss/models/edit") + queryStr;
      window.location.href = endpoint;
    }, this));
  },
  clickSaveHandler: function (e) {
    this.saving();
    this.handleSaveWorkflow(e, _.bind(this.saved, this));
  },
  clickStartJobHandler: function (e) {
    this.saving();
    let types = {
      "Ensemble Simulation": "gillespy",
      "Parameter Sweep": "parameterSweep",
      "Spatial Ensemble Simulation": "spatial"
    };
    let data = {
      "settings": this.model.settings.toJSON(), "mdl_path": this.model.model,
      "type": types[this.model.type], "time_stamp": this.getTimeStamp()
    };
    let queryStr = `?path=${this.model.directory}&data=${JSON.stringify(data)}`;
    let initEndpoint = `${path.join(app.getApiPath(), "workflow/init-job")}${queryStr}`;
    app.getXHR(initEndpoint, {
      success: (err, response, body) => {
        this.saved();
        let runQuery = `?path=${body}&type=${data.type}`;
        let runEndpoint = `${path.join(app.getApiPath(), "workflow/run-job")}${runQuery}`;
        app.getXHR(runEndpoint, {
          success: (err, response, body) => {
            this.updateWorkflow(true);
          }
        });
      }
    });
  },
  getTimeStamp: function () {
    if(!this.model.newFormat) {
      return null;
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month < 10){
      month = "0" + month
    }
    var day = date.getDate();
    if(day < 10){
      day = "0" + day
    }
    var hours = date.getHours();
    if(hours < 10){
      hours = "0" + hours
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
      minutes = "0" + minutes
    }
    var seconds = date.getSeconds();
    if(seconds < 10){
      seconds = "0" + seconds
    }
    return "_" + month + day + year + "_" + hours + minutes + seconds;
  },
  handleLocationSelect: function (e) {
    let value = e.srcElement.value;
    if(value) {
      this.model.model = value;
    }
  },
  handleModelSelect: function (e) {
    let value = e.srcElement.value;
    if(value) {
      if(this.models.paths[value].length == 1) {
        $("#model-location-info").css("display", "none");
        if(this.modelLocationSelectView) {
          this.modelLocationSelectView.remove();
        }
        this.model.model = this.models.paths[value][0];
      }else{
        $("#model-location-info").css("display", "block");
        this.renderModelLocationSelectView(value);
      }
    }
  },
  handleReturnToProject: function (e) {
    if(this.model.activeJob.model.directory){
      this.handleSaveWorkflow(e, _.bind(function () {
        let queryStr = "?path=" + this.projectPath;
        let endpoint = path.join(app.getBasePath(), "stochss/project/manager") + queryStr;
        window.location.href = endpoint;
      }, this));
    }else{
      let queryStr = "?path=" + this.projectPath;
      let endpoint = path.join(app.getBasePath(), "stochss/project/manager") + queryStr;
      window.location.href = endpoint;
    }
  },
  handleSaveWorkflow: function (e, cb) {
    let self = this;
    let endpoint = this.model.url();
    app.postXHR(endpoint, this.model.toJSON(), {
      success: function (err, response, body) {
        if(cb) {
          cb();
        }else{
          $(self.queryByHook("src-model")).css("display", "none");
          let oldFormRdyState = !self.model.newFormat && self.model.activeJob.status === "ready";
          if(oldFormRdyState || self.model.newFormat) {
            self.setupSettingsView();
          }
        }
      }
    });
  },
  removeActiveJob: function () {
    $(this.queryByHook("active-job-header-container")).css("display", "none");
    $("#review-model-section").css("display", "none");
    if(this.activeJobView) {
      this.activeJobView.remove();
    }
  },
  renderActiveJob: function () {
    this.removeActiveJob();
    if(this.model.newFormat) {
      $(this.queryByHook("active-job-header")).text("Job: " + this.model.activeJob.name);
      $(this.queryByHook("active-job-header-container")).css("display", "block");
    }
    this.activeJobView = new ActiveJobView({
      model: this.model.activeJob,
      wkflName: this.model.name,
      titleType: this.model.type,
      newFormat: this.model.newFormat
    });
    app.registerRenderSubview(this, this.activeJobView, "active-job-container");
  },
  renderJobListingView: function () {
    if(this.jobListingView) {
      this.jobListingView.remove();
    }
    this.jobListingView = this.renderCollection(
      this.model.jobs,
      JobListingView,
      this.queryByHook("job-listing")
    );
  },
  renderModelLocationSelectView: function (model) {
    if(this.modelLocationSelectView) {
      this.modelLocationSelectView.remove();
    }
    this.modelLocationSelectView = new SelectView({
      label: 'Location: ',
      name: 'source-model-location',
      required: true,
      idAttributes: 'cid',
      options: this.models.paths[model],
      unselectedText: "-- Select Location --"
    });
    app.registerRenderSubview(this, this.modelLocationSelectView, "model-location");
  },
  renderModelSelectView: function (models) {
    this.models = models;
    $(this.queryByHook("src-model")).css("display", "block");
    let modelSelectView = new SelectView({
      label: 'Model: ',
      name: 'source-model',
      required: true,
      idAttributes: 'cid',
      options: models.files,
      unselectedText: "-- Select Model --"
    });
    app.registerRenderSubview(this, modelSelectView, "model-file");
  },
  renderStatusView: function () {
    if(this.statusView) {
      this.statusView.remove();
    }
    this.statusView = new StatusView({
      model: this.model.activeJob
    });
    app.registerRenderSubview(this, this.statusView, "status-container");
  },
  renderSettingsView: function (options) {
    if(this.settingsView) {
      this.settingsView.remove();
    }
    this.settingsView = new SettingsView(options);
    app.registerRenderSubview(this, this.settingsView, "settings-container");
  },
  renderSubviews: function () {
    let oldFormRdyState = !this.model.newFormat && this.model.activeJob.status === "ready";
    let newFormNotArchive = this.model.newFormat && this.model.model;
    if(!this.models && (oldFormRdyState || newFormNotArchive)) {
      this.setupSettingsView();
    }else if(this.settingsView) {
      this.settingsView.remove();
    }
    if(this.model.newFormat) {
      $(this.queryByHook("jobs-container")).css("display", "block");
      this.renderJobListingView();
    }else if(this.model.activeJob.status !== "ready") {
      this.renderStatusView();
    }
    let detailsStatus = ["error", "complete"]
    if(this.model.activeJob && detailsStatus.includes(this.model.activeJob.status)) {
      this.renderActiveJob();
    }
  },
  saved: function () {
    $(this.queryByHook('saving-workflow')).css("display", "none");
    $(this.queryByHook('saved-workflow')).css("display", "inline-block");
  },
  saving: function () {
    $(this.queryByHook('saving-workflow')).css("display", "inline-block");
    $(this.queryByHook('saved-workflow')).css("display", "none");
  },
  setActiveJob: function (job) {
    this.removeActiveJob();
    this.model.activeJob = job;
    this.renderActiveJob();
  },
  setupSettingsView: function () {
    if(this.model.newFormat) {
      $(this.queryByHook("start-job")).text("Start New Job");
    }
    if(this.model.type === "Parameter Sweep"){
      if(this.model.settings.parameterSweepSettings.parameters.length < 1) {
        $(this.queryByHook("start-job")).prop("disabled", true);
      }
      this.model.settings.parameterSweepSettings.parameters.on("add remove", _.bind((e) => {
        let numParams = this.model.settings.parameterSweepSettings.parameters.length;
        $(this.queryByHook("start-job")).prop("disabled", numParams < 1);
      }, this))
    }else if(this.model.type === "Model Inference") {
      if(this.model.settings.inferenceSettings.parameters.length < 1) {
        $(this.queryByHook("start-job")).prop("disabled", true);
      }
      this.model.settings.inferenceSettings.parameters.on("add remove", _.bind((e) => {
        let numParams = this.model.settings.inferenceSettings.parameters.length;
        $(this.queryByHook("start-job")).prop("disabled", numParams < 1);
      }, this))
    }
    let options = {
      model: this.model.settings,
      newFormat: this.model.newFormat,
      type: this.model.type
    }
    if(["Parameter Sweep", "Model Inference"].includes(this.model.type)) {
      options['stochssModel'] = new Model({
        directory: this.model.model
      });
      app.getXHR(options.stochssModel.url(), {
        success: (err, response, body) => {
          options.stochssModel.set(body);
          this.renderSettingsView(options);
        }
      });
    }else {
      this.renderSettingsView(options);
    }
  },
  updateWorkflow: function (newJob) {
    let self = this;
    if(this.model.newFormat) {
      let hadActiveJob = Boolean(this.model.activeJob.status)
      app.getXHR(this.model.url(), {
        success: function (err, response, body) {
          self.model.set({jobs: body.jobs, activeJob: body.activeJob});
          if(!Boolean(self.model.activeJob.status)){
            self.removeActiveJob();
          }else if(!hadActiveJob && Boolean(self.model.activeJob.status)) {
            self.renderActiveJob();
          }
        }
      });
    }else if(!this.model.newFormat){
      app.getXHR(this.model.url(), {
        success: function (err, response, body) {
          self.model.set(body)
          self.renderSubviews();
        }
      });
    }
  }
});

initPage(WorkflowManager);