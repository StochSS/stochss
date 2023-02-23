/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
let app = require('../../app');
let modals = require('../../modals');
let Plotly = require('plotly.js-dist');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
let SummaryStatsView = require('./summary-stats-view');
let InferenceParametersView = require('./inference-parameters-view');
//templates
let template = require('../templates/inferenceSettingsView.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.obsData' : {
      type: function (el, value, previousValue) {
        el.disabled = value == "";
      },
      hook: 'preview-obs-data'
    }
  },
  events: {
    'change [data-hook=prior-method]' : 'setPriorMethod',
    'change [data-hook=summary-statistics]' : 'updateSummaryStatsView',
    'change [data-hook=obs-data-file]' : 'setObsDataFile',
    'change [data-hook=obs-data-file-select]' : 'selectObsDataFile',
    'change [data-hook=obs-data-location-select]' : 'selectObsDataLocation',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=collapseImportObsData]' : 'toggleImportFiles',
    'click [data-hook=collapseUploadObsData]' : 'toggleUploadFiles',
    'click [data-hook=import-obs-data-file]' : 'handleImportObsData',
    'click [data-hook=preview-obs-data]' : 'handlePreviewObsData'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.stochssModel = attrs.stochssModel;
    this.obsDataFiles = null;
    this.obsDataFile = null;
    this.obsFig = null;
    this.chevrons = {
      hide: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512">
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
        </svg>
      `,
      show: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512">
          <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>
        </svg>
      `
    }
    this.summaryStatCollections = {
      identity: null, minimal: null, custom: null
    }
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook(this.model.elementID + '-inference-settings-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook(this.model.elementID + '-inference-settings-view-tab')).tab('show');
      $(this.queryByHook(this.model.elementID + '-edit-inference-settings')).removeClass('active');
      $(this.queryByHook(this.model.elementID + '-view-inference-settings')).addClass('active');
    }else{
      this.renderEditSummaryStats();
      this.renderEditParameterSpace();
      this.renderObsDataSelects();
    }
    this.renderViewSummaryStats();
    this.renderViewParameterSpace();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  completeAction: function () {
    $(this.queryByHook("iodf-in-progress")).css("display", "none");
    $(this.queryByHook("iodf-complete")).css("display", "inline-block");
    setTimeout(() => {
      $(this.queryByHook("iodf-complete")).css("display", "none");
    }, 5000);
  },
  errorAction: function (action) {
    $(this.queryByHook("iodf-in-progress")).css("display", "none");
    $(this.queryByHook("iodf-action-error")).text(action);
    $(this.queryByHook("iodf-error")).css("display", "block");
  },
  handleImportObsData: function () {
    this.startAction();
    let formData = new FormData();
    var filePath = this.model.parent.parent.directory;
    formData.append("path", filePath);
    formData.append("datafile", this.obsDataFile);
    let endpoint = path.join(app.getApiPath(), 'workflow/import-obs-data');
    app.postXHR(endpoint, formData, {
      success: (err, response, body) => {
        body = JSON.parse(body);
        this.obsFig = null;
        this.model.obsData = path.join(body.obsDataPath, body.obsDataFile);
        this.completeAction();
        $(this.queryByHook('collapseUploadObsData')).click();
        this.renderObsDataSelects();
      },
      error: (err, response, body) => {
        body = JSON.parse(body);
        this.errorAction(body.Message);
      }
    }, false);
  },
  handlePreviewObsData: function () {
    if(this.obsFig !== null) {
      this.previewObsData();
    }else{
      let queryStr = `?path=${this.model.obsData}`
      let endpoint = `${path.join(app.getApiPath(), 'workflow/preview-obs-data')}${queryStr}`;
      app.getXHR(endpoint, {success: (err, response, body) => {
        this.obsFig = body.figure;
        this.previewObsData();
      }});
    }
  },
  previewObsData: function () {
    if(document.querySelector('#modal-preview-plot')) {
      document.querySelector('#modal-preview-plot').remove();
    }
    let modal = $(modals.obsPreviewHtml(this.model.obsData.split('/').pop())).modal();
    let plotEl = document.querySelector('#modal-preview-plot #modal-plot-container');
    Plotly.newPlot(plotEl, this.obsFig);
  },
  renderEditParameterSpace: function () {
    if(this.editParameterSpace) {
      this.editParameterSpace.remove();
    }
    this.editParameterSpace = new InferenceParametersView({
      collection: this.model.parameters,
      stochssModel: this.stochssModel,
      priorMethod: this.model.priorMethod
    });
    let hook = "edit-parameter-space-container";
    app.registerRenderSubview(this, this.editParameterSpace, hook);
  },
  renderEditSummaryStats: function () {
    if(this.editSummaryStats) {
      this.editSummaryStats.remove();
    }
    // This block is for testing only
    this.summaryStatCollections[this.model.summaryStatsType] = this.model.resetSummaryStats();
    this.model.summaryStatsType = "custom";
    // End testing block
    this.editSummaryStats = new SummaryStatsView({
      collection: this.model.summaryStats,
      summariesType: this.model.summaryStatsType
    });
    let hook = "edit-summary-stats-container";
    app.registerRenderSubview(this, this.editSummaryStats, hook);
  },
  renderObsDataSelects: function () {
    let queryStr = "?ext=.obsd,.csv"
    let endpoint = `${path.join(app.getApiPath(), 'workflow/obs-data-files')}${queryStr}`;
    app.getXHR(endpoint, {success: (err, response, body) => {
      this.obsDataFiles = body.obsDataFiles;
      this.renderObsDataSelectView();
    }});
  },
  renderObsDataSelectView: function () {
    if(this.obsDataSelectView) {
      this.obsDataSelectView.remove();
    }
    let files = this.obsDataFiles.files.filter((file) => {
      if(file[1] === this.model.obsData.split('/').pop()) {
        return file;
      }
    });
    let value = files.length > 0 ? files[0] : "";
    this.obsDataSelectView = new SelectView({
      name: 'obs-data-files',
      required: true,
      idAttributes: 'cid',
      options: this.obsDataFiles.files,
      value: value,
      unselectedText: "-- Select Data File --"
    });
    let hook = "obs-data-file-select";
    app.registerRenderSubview(this, this.obsDataSelectView, hook);
    if(value !== "" && this.obsDataFiles.paths[value[0]].length > 1) {
      this.renderObsDataLocationSelectView(value[0]);
      $(this.queryByHook("obs-data-location-container")).css("display", "inline-block");
    }
  },
  renderObsDataLocationSelectView: function (index) {
    if(this.obsDataLocationSelectView) {
      this.obsDataLocationSelectView.remove();
    }
    let value = this.model.obsData !== "" ? this.model.obsData : "";
    this.obsDataLocationSelectView = new SelectView({
      name: 'obs-data-locations',
      required: true,
      idAttributes: 'cid',
      options: this.obsDataFiles.paths[index],
      value: value,
      unselectedText: "-- Select Data File Location --"
    });
    let hook = "obs-data-location-select";
    app.registerRenderSubview(this, this.obsDataLocationSelectView, hook);
  },
  renderViewParameterSpace: function () {
    if(this.viewParameterSpace) {
      this.viewParameterSpace.remove();
    }
    this.viewParameterSpace = new InferenceParametersView({
      collection: this.model.parameters,
      readOnly: true,
      stochssModel: this.stochssModel,
      priorMethod: this.model.priorMethod
    });
    let hook = "view-parameter-space-container";
    app.registerRenderSubview(this, this.viewParameterSpace, hook);
  },
  renderViewSummaryStats: function () {
    if(this.viewSummaryStats) {
      this.viewSummaryStats.remove();
    }
    this.viewSummaryStats = new SummaryStatsView({
      collection: this.model.summaryStats,
      summariesType: this.model.summaryStatsType,
      readOnly: true
    });
    let hook = "view-summary-stats-container";
    app.registerRenderSubview(this, this.viewSummaryStats, hook);
  },
  setObsDataFile: function (e) {
    this.obsDataFile = e.target.files[0];
    $(this.queryByHook("import-obs-data-file")).prop('disabled', !this.obsDataFile);
  },
  setPriorMethod: function (e) {
    this.model.priorMethod = e.target.value;
    $(this.queryByHook("view-prior-method")).text(this.model.priorMethod);
    this.renderEditParameterSpace();
    this.renderViewParameterSpace();
  },
  selectObsDataFile: function (e) {
    this.obsFig = null;
    let value = e.target.value;
    var msgDisplay = "none";
    var contDisplay = "none";
    if(value) {
      if(this.obsDataFiles.paths[value].length > 1) {
        msgDisplay = "block";
        contDisplay = "inline-block";
        this.model.obsData = "";
        this.renderObsDataLocationSelectView(value);
      }else{
        this.model.obsData = this.obsDataFiles.paths[value][0];
      }
    }else{
      this.model.obsData = "";
    }
    $(this.queryByHook("obs-data-location-message")).css('display', msgDisplay);
    $(this.queryByHook("obs-data-location-container")).css("display", contDisplay);
  },
  selectObsDataLocation: function (e) {
    this.obsFig = null;
    this.model.obsData = e.target.value ? e.target.value : "";
  },
  startAction: function () {
    $(this.queryByHook("iodf-complete")).css("display", "none");
    $(this.queryByHook("iodf-error")).css("display", "none");
    $(this.queryByHook("iodf-in-progress")).css("display", "inline-block");
  },
  toggleImportFiles: function (e) {
    let classes = $(this.queryByHook('collapseImportObsData')).attr("class").split(/\s+/);
    $(this.queryByHook('upload-chevron')).html(this.chevrons.hide);
    if(classes.includes('collapsed')) {
      $(this.queryByHook('import-chevron')).html(this.chevrons.show);
    }else{
      $(this.queryByHook('import-chevron')).html(this.chevrons.hide);
    }
  },
  toggleUploadFiles: function (e) {
    let classes = $(this.queryByHook('collapseUploadObsData')).attr("class").split(/\s+/);
    $(this.queryByHook('import-chevron')).html(this.chevrons.hide);
    if(classes.includes('collapsed')) {
      $(this.queryByHook('upload-chevron')).html(this.chevrons.show);
    }else{
      $(this.queryByHook('upload-chevron')).html(this.chevrons.hide);
    }
  },
  update: function (e) {},
  updateSummaryStatsView: function (e) {
    $(this.queryByHook("view-summary-stats")).text(this.model.summaryStats ? this.model.summaryStats : 'None')
  },
  updateValid: function (e) {},
  subviews: {
    priorMethodView: {
      hook: "prior-method",
      prepareView: function (el) {
        let options = [
          "Uniform Prior"//, "Gaussian Prior"
        ]
        return new SelectView({
          name: 'prior-method',
          required: true,
          eagerValidate: true,
          options: options,
          value: this.model.priorMethod
        });
      }
    },
    summaryStatsView: {
      hook: "summary-statistics",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'summary-statistics',
          modelKey: 'summaryStats',
          valueType: 'string',
          value: this.model.summaryStats
        });
      }
    }
  }
});
