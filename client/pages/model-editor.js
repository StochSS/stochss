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
let app = require('../app');
let modals = require('../modals');
let Plotly = require('plotly.js-dist');
//views
let PageView = require('../pages/base');
let ModelView = require('../model-view/model-view');
let TimespanSettingsView = require('../settings-view/views/timespan-settings-view');
//models
let Model = require('../models/model');
//templates
let template = require('../templates/pages/modelEditor.pug');

import initPage from './page.js';

let ModelEditor = PageView.extend({
  template: template,
  events: {
    'click [data-hook=edit-model-help]': () => {
      let modal = $(modals.operationInfoModalHtml('model-editor')).modal();
    },
    'click [data-hook=project-breadcrumb-link]' : 'clickReturnToProjectHandler',
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=run]'  : 'handleSimulateClick',
    "click [data-hook=stochss-es]" : "handleSimulateClick",
    "click [data-hook=stochss-ps]" : "handleSimulateClick",
    'click [data-hook=new-workflow]' : 'handleSimulateClick',
    'click [data-hook=return-to-project-btn]' : 'clickReturnToProjectHandler',
    'click [data-hook=presentation]' : 'handlePresentationClick',
    'click [data-hook=toggle-preview-plot]' : 'togglePreviewPlot',
    'click [data-hook=toggle-preview-domain]' : 'toggleDomainPlot',
    'click [data-hook=download-png]' : 'clickDownloadPNGButton'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search);
    let directory = urlParams.get('path');
    let modelFile = directory.split('/').pop();
    this.model = new Model({
      name: this.getFileName(decodeURI(modelFile)),
      directory: directory,
      is_spatial: modelFile.split('.').pop().startsWith('s'),
      isPreview: true,
      for: "edit"
    });
    if(directory.includes('.proj')) {
      this.projectPath = path.dirname(directory);
      if(this.projectPath.endsWith(".wkgp")) {
        this.projectPath = path.dirname(this.projectPath);
      }
      this.projectName = this.getFileName(this.projectPath);
    }
    app.getXHR(this.model.url(), {
      success: (err, response, body) => {
        this.model.set(body);
        this.model.updateValid();
        this.model.autoSave();
        this.renderSubviews(urlParams.has('validate'));
      }
    });
    window.addEventListener("pageshow", (event) => {
      let navType = window.performance.navigation.type;
      if(navType === 2){
        window.location.reload();
      }
    });
  },
  clickDownloadPNGButton: function (e) {
    $('div[data-hook=preview-plot-container] a[data-title*="Download plot as a png"]')[0].click();
  },
  clickReturnToProjectHandler: function () {
    this.saveModel((e) => {
      let queryStr = `?path=${this.projectPath}`;
      let endpoint = path.join(app.getBasePath(), "stochss/project/manager") + queryStr;
      window.location.href = endpoint;
    });
  },
  clickSaveHandler: function (e) {
    this.saveModel(() => { this.endAction("save"); });
  },
  closeDomainPlot: function () {
    $(this.queryByHook("domain-plot-viewer-container")).css("display", "none");
    $(this.queryByHook("toggle-preview-domain")).html("Show Domain");
  },
  closePlot: function () {
    $(this.queryByHook("model-run-container")).css("display", "none");
    $(this.queryByHook("toggle-preview-plot")).html("Show Preview");
  },
  displayError: function (errorMsg, e) {
    $(this.queryByHook('toggle-preview-plot')).click();
    errorMsg.css('display', 'block');
    this.focusOnError(e);
  },
  endAction: function (action) {
    if(action === "save") {
      $(this.queryByHook("saving")).css("display", "none");
      var msg = $(this.queryByHook("saved"));
    }else{
      $(this.queryByHook("publishing")).css("display", "none");
      var msg = $(this.queryByHook("published"));
    }
    msg.css("display", "inline-block");
    $(this.queryByHook('mdl-action-start')).css("display", "none");
    let saved = $(this.queryByHook('mdl-action-end'));
    saved.css("display", "inline-block");
    setTimeout(() => {
      saved.css("display", "none");
      msg.css("display", "none");
    }, 5000);
  },
  errorAction: function () {
    $(this.queryByHook("publishing")).css("display", "none");
    $(this.queryByHook('mdl-action-start')).css("display", "none");
    let error = $(this.queryByHook('mdl-action-err'));
    error.css("display", "inline-block");
    setTimeout(() => {
      error.css("display", "none");
    }, 5000);
  },
  focusOnError: function (e) {
    let mdlSections = ["species", "parameter", "reaction", "process", "event", "rule", "volume", "domain"];
    if(this.model.error) {
      if(this.model.error.type === "timespan") {
        this.openTimespanSection();
      }else if(mdlSections.includes(this.model.error.type)) {
        this.modelView.openSection();
      }
      setTimeout(() => {
        let inputErrors = this.queryAll(".input-invalid");
        let componentErrors = this.queryAll(".component-invalid");
        if(componentErrors.length > 0) {
          componentErrors[0].scrollIntoView({'block':"center"});
        }else if(inputErrors.length > 0) {
          inputErrors[0].focus();
        }
      }, 300);
    }
  },
  getFileName: function (file) {
    if(file.endsWith('/')) {
      file.slice(0, -1);
    }
    if(file.includes('/')) {
      file = file.split('/').pop();
    }
    if(!file.includes('.')) {
      return file;
    }
    return file.split('.').slice(0, -1).join('.');
  },
  getPreviewTarget: function () {
    this.endAction("save");
    let species = this.model.species.map((species) => { return species.name; });
    let modal = $(modals.selectPreviewTargetHTML(species)).modal();
    let okBtn = document.querySelector("#previewTargetSelectModal .ok-model-btn");
    let select = document.querySelector("#previewTargetSelectModal #previewTargetSelectList");
    okBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      this.runModel({target: select.value});
    });
  },
  getResults: function () {
    setTimeout(() => {
      let queryStr = `?cmd=read&outfile=${this.outfile}&path=${this.model.directory}`;
      let endpoint = path.join(app.getApiPath(), 'model/run') + queryStr;
      let errorCB = (err, response, body) => {
        this.ran(false);
        $(this.queryByHook('model-run-error-message')).text(body.Results.errors);
      }
      app.getXHR(endpoint, {
        always: (err, response, body) => {
          if(typeof body === "string") {
            body = body.replace(/NaN/g, null);
            body = JSON.parse(body);
          }
          if(response.statusCode >= 400 || body.Results.errors){
            errorCB(err, response, body);
          }
          else if(!body.Running){
            Plotly.purge(this.queryByHook('preview-plot-container'));
            if(body.Results.timeout){
              $(this.queryByHook('model-timeout-message')).collapse('show');
            }
            this.plotResults(body.Results.results);
          }else{
            if(body.Results) {
              Plotly.purge(this.queryByHook('preview-plot-container'));
              this.plotResults(body.Results.results);
            }
            this.getResults();
          }
        },
        error: errorCB
      });
    }, 1000);
  },
  handlePresentationClick: function (e) {
    let errorMsg = $(this.queryByHook("error-detected-msg"));
    if(!this.model.valid) {
      this.displayError(errorMsg, e);
    }else{
      this.startAction("publish");
      let queryStr = `?path=${this.model.directory}`;
      let endpoint = path.join(app.getApiPath(), "model/presentation") + queryStr;
      app.getXHR(endpoint, {
        success: (err, response, body) => {
          this.endAction("publish");
          $(modals.presentationLinks(body.message, "Shareable Presentation", body.links)).modal();
          let copyBtn = document.querySelector('#presentationLinksModal #copy-to-clipboard');
          copyBtn.addEventListener('click', (e) => {
            let onFulfilled = (value) => {
              $("#copy-link-success").css("display", "inline-block");
            } 
            let onReject = (reason) => {
              let msg = $("#copy-link-failed");
              msg.html(reason);
              msg.css("display", "inline-block");
            }
            app.copyToClipboard(body.links.presentation, onFulfilled, onReject);
          });
        },
        error: (err, response, body) => {
          if(document.querySelector("#errorModal")) {
            document.querySelector("#errorModal").remove();
          }
          this.errorAction();
          $(modals.errorHtml(body.Reason, body.Message)).modal();
        }
      });
    }
  },
  handleSimulateClick: function (e) {
    let errorMsg = $(this.queryByHook("error-detected-msg"));
    if(!this.model.valid) {
      this.displayError(errorMsg, e);
    }else{
      errorMsg.css('display', 'none');
      if(e.target.dataset.type === "preview") {
        this.runPreview();
      }else if(e.target.dataset.type === "notebook"){
        this.notebookWorkflow(e);
      }else if (e.target.dataset.type === "ensemble") {
        let type = this.model.is_spatial ? "Spatial Ensemble Simulation" : "Ensemble Simulation"
        this.saveModel(() => {
          app.newWorkflow(this, this.model.directory, this.model.is_spatial, type);
        });
      }else if(!this.model.is_spatial && e.target.dataset.type === "psweep") {
        this.saveModel(() => {
          app.newWorkflow(this, this.model.directory, this.model.is_spatial, "Parameter Sweep");
        });
      }
    }
  },
  notebookWorkflow: function () {
    this.saveModel(() => {
      this.endAction("save");
      var queryString = `?path=${this.model.directory}`;
      if(this.model.directory.includes('.proj')) {
        let wkgp = this.model.directory.includes('.wkgp') ? `${this.model.name}.wkgp` : "WorkflowGroup1.wkgp";
        let parentPath = path.join(path.dirname(this.model.directory), wkgp);
        queryString += `&parentPath=${parentPath}`;
      }
      window.location.href = path.join(app.getBasePath(), "stochss/workflow/selection") + queryString;
    });
  },
  openDomainPlot: function () {
    if($(this.queryByHook("model-run-container")).css("display") !== "none") {
      this.closePlot();
    }
    $(this.queryByHook("domain-plot-viewer-container")).css("display", "block");
    $(this.queryByHook("toggle-preview-domain")).html("Hide Domain");
  },
  openPlot: function () {
    if($(this.queryByHook("domain-plot-viewer-container")).css("display") !== "none") {
      this.closeDomainPlot();
    }
    $(this.queryByHook("model-run-container")).css("display", "block");
    $(this.queryByHook("toggle-preview-plot")).html("Hide Preview");
  },
  openTimespanSection: function () {
    if(!$(this.modelSettings.queryByHook("timespan-container")).hasClass("show")) {
      let tspnCollapseBtn = $(this.modelSettings.queryByHook("collapse"));
      tspnCollapseBtn.click();
      tspnCollapseBtn.html('-');
    }
    this.switchToEditTab(this.modelSettings, "timespan");
  },
  plotResults: function (data) {
    this.ran(true);
    Plotly.newPlot(this.queryByHook('preview-plot-container'), data);
    window.scrollTo(0, document.body.scrollHeight);
  },
  ran: function (noErrors) {
    let runContainer = $(this.queryByHook("model-run-container"));
    if(runContainer.css("display") === "none") {
      runContainer.css("display", 'block');
    }
    $(this.queryByHook('preview-plot-buttons')).css('display', 'inline-block');
    let plotBtn = $(this.queryByHook('toggle-preview-plot'));
    if(plotBtn.text() === "Show Preview") {
      plotBtn.text("Hide Preview");
    }
    if(noErrors){
      $(this.queryByHook('preview-plot-container')).css("display", "block");
    }else{
      $(this.queryByHook('model-run-error-container')).css("display", "block");
    }
    $(this.queryByHook('plot-loader')).css("display", "none");
  },
  renderModelView: function () {
    let domainElements = {
      select: $(this.queryByHook("me-select-particle")),
      particle: {view: this, hook: "me-particle-viewer"},
      figure: this.queryByHook("domain-plot-container"),
      figureEmpty: this.queryByHook("domain-plot-container-empty"),
      type: this.queryByHook("me-types-quick-view")
    }
    this.modelView = new ModelView({
      model: this.model,
      domainElements: domainElements
    });
    app.registerRenderSubview(this, this.modelView, "model-view-container");
  },
  renderSubviews: function (validate) {
    if(this.model.directory.includes('.proj')) {
      $(this.queryByHook("project-breadcrumb-links")).css("display", "block");
      $(this.queryByHook("model-name-header")).css("display", "none");
      $(this.queryByHook("return-to-project-btn")).css("display", "inline-block");
    }
    if(this.model.is_spatial) {
      $(this.queryByHook("toggle-preview-domain")).css("display", "inline-block");
      this.openDomainPlot();
      $(this.queryByHook("stochss-ps")).addClass("disabled");
    }
    if(app.getBasePath() === "/") {
      $(this.queryByHook("presentation")).css("display", "none");
    }
    this.renderModelView();
    this.modelSettings = new TimespanSettingsView({
      parent: this,
      model: this.model.modelSettings,
      isSpatial: this.model.is_spatial
    });
    app.registerRenderSubview(this, this.modelSettings, 'model-settings-container');
    if(validate && !this.model.valid) {
      let errorMsg = $(this.queryByHook("error-detected-msg"));
      this.displayError(errorMsg);
    }
    app.documentSetup();
  },
  runModel: function ({target=null}={}) {
    this.running();
    let queryStr = `?cmd=start&outfile=none&path=${this.model.directory}`;
    if(target !== null) {
      queryStr += `&target=${target}`;
    }else {
      this.endAction("save");
    }
    $(this.queryByHook('model-run-container')).css("display", "block");
    let endpoint = path.join(app.getApiPath(), 'model/run') + queryStr;
    app.getXHR(endpoint, {
      always: (err, response, body) => {
        this.outfile = body.Outfile;
        this.getResults();
      }
    });
  },
  running: function () {
    $(this.queryByHook('preview-plot-container')).css("display", "none");
    $(this.queryByHook('plot-loader')).css("display", "block");
    $(this.queryByHook('model-run-error-container')).css("display", "none");
  },
  runPreview: function () {
    if(this.model.is_spatial && $(this.queryByHook("domain-plot-viewer-container")).css("display") !== "none") {
      this.closeDomainPlot();
    }
    $(this.queryByHook('model-run-error-container')).collapse('hide');
    $(this.queryByHook('model-timeout-message')).collapse('hide');
    Plotly.purge(this.queryByHook('preview-plot-container'));
    $(this.queryByHook('preview-plot-buttons')).css("display", "none");
    if(this.model.is_spatial) {
      this.saveModel(() => { this.getPreviewTarget(); });
    }else{
      this.saveModel(() => { this.runModel(); });
    }
  },
  saveModel: function (cb) {
    this.startAction("save");
    if(cb) {
      this.model.saveModel(cb);
    }else {
      this.model.saveModel();
    }
  },
  startAction: function (action) {
    if(action === "save") {
      $(this.queryByHook("saving")).css("display", "inline-block");
    }else{
      $(this.queryByHook("publishing")).css("display", "inline-block");
    }
    $(this.queryByHook('mdl-action-start')).css("display", "inline-block");
    $(this.queryByHook('mdl-action-end')).css("display", "none");
  },
  toggleDomainPlot: function (e) {
    if(e.target.innerText === "Hide Domain") {
      this.closeDomainPlot();
    }else{
      this.openDomainPlot();
    }
  },
  togglePreviewPlot: function (e) {
    if(e.target.innerText === "Hide Preview") {
      this.closePlot();
    }else{
      this.openPlot();
    }
  }
});

initPage(ModelEditor);
