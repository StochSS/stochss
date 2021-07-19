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
//models
let Workflow = require('../models/workflow');
//views
let PageView = require('./base');
let SettingsView = require('../views/settings');
let LogsView = require('../views/workflow-info');
let SelectView = require('ampersand-select-view');
let ModelView = require('../model-view/model-view');
let StatusView = require('../views/workflow-status');
let JobListingView = require('../views/job-listing');
let ResultsView = require('../views/workflow-results');
let SettingsViewerView = require('../views/settings-viewer');
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
    'click [data-hook=collapse-jobs]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-model]' : 'changeCollapseButtonText',
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
            self.renderSettingsView();
          }
        }
      }
    });
  },
  removeActiveJob: function () {
    $(this.queryByHook("active-job-header-container")).css("display", "none");
    if(this.resultsView) {
      this.resultsView.remove();
    }
    if(this.logsView) {
      this.logsView.remove();
      this.modelView.remove();
      this.settingsViewerView.remove();
    }
  },
  renderActiveJob: function () {
    if(this.model.newFormat) {
      $(this.queryByHook("active-job-header")).text("Job: " + this.model.activeJob.name);
      $(this.queryByHook("active-job-header-container")).css("display", "block");
    }
    if(this.model.activeJob.status !== "error") {
      this.renderResultsView();
    }
    this.renderLogsView();
    this.renderSettingsViewerView();
    this.renderModelView();
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
  renderLogsView: function () {
    if(this.logsView) {
      this.logsView.remove();
    }
    this.logsView = new LogsView({
      logs: this.model.activeJob.logs
    });
    app.registerRenderSubview(this, this.logsView, "workflow-info-container");
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
  renderModelView: function () {
    if(this.modelView) {
      this.modelView.remove();
    }
    let header = "Review Model: " + this.model.activeJob.model.name;
    $("#model-viewer-header").html(header);
    this.modelView = new ModelView({
      model: this.model.activeJob.model,
      readOnly: true
    });
    app.registerRenderSubview(this, this.modelView, "model-viewer-container");
  },
  renderResultsView: function () {
    if(this.resultsView) {
      this.resultsView.remove();
    }
    this.resultsView = new ResultsView({
      model: this.model.activeJob
    });
    app.registerRenderSubview(this, this.resultsView, "workflow-results-container");
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
  renderSettingsView: function () {
    if(this.settingsView) {
      this.settingsView.remove();
    }
    this.settingsView = new SettingsView({
      model: this.model.settings
    });
    app.registerRenderSubview(this, this.settingsView, "settings-container");
  },
  renderSettingsViewerView: function () {
    if(this.settingsViewerView) {
      this.settingsViewerView.remove();
    }
    this.settingsViewerView = new SettingsViewerView({
      model: this.model.activeJob.settings
    });
    app.registerRenderSubview(this, this.settingsViewerView, "settings-viewer-container");
  },
  renderSubviews: function () {
    let oldFormRdyState = !this.model.newFormat && this.model.activeJob.status === "ready";
    let newFormNotArchive = this.model.newFormat && this.model.model;
    if(!this.models && (oldFormRdyState || newFormNotArchive)) {
      this.renderSettingsView();
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
  setActiveJob: function (job) {
    this.model.activeJob = job;
    this.removeActiveJob();
    this.renderActiveJob();
  },
  updateWorkflow: function (newJob) {
    let self = this;
    if(this.model.newFormat) {
      let hadActiveJob = Boolean(this.model.activeJob.status)
      app.getXHR(this.model.url(), {
        success: function (err, response, body) {
          self.model.set(body);
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