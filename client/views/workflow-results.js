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
//support files
let app = require('../app');
let modals = require('../modals');
let Tooltips = require('../tooltips');
let Plotly = require('../lib/plotly');
//views
let InputView = require('./input');
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
let SweepParametersView = require('./sweep-parameter-range');
//templates
let gillespyResultsTemplate = require('../templates/includes/gillespyResults.pug');
let gillespyResultsEnsembleTemplate = require('../templates/includes/gillespyResultsEnsemble.pug');
let parameterSweepResultsTemplate = require('../templates/includes/parameterSweepResults.pug');
let parameterScanTemplate = require('../templates/includes/parameterScanResults.pug');

module.exports = View.extend({
  events: {
    'change [data-hook=title]' : 'setTitle',
    'change [data-hook=xaxis]' : 'setXAxis',
    'change [data-hook=yaxis]' : 'setYAxis',
    'change [data-hook=specie-of-interest-list]' : 'getPlotForSpecies',
    'change [data-hook=feature-extraction-list]' : 'getPlotForFeatureExtractor',
    'change [data-hook=ensemble-aggragator-list]' : 'getPlotForEnsembleAggragator',
    'change [data-hook=plot-type-select]' : 'getTSPlotForType',
    'click [data-hook=collapse-results-btn]' : 'changeCollapseButtonText',
    'click [data-trigger=collapse-plot-container]' : 'handleCollapsePlotContainerClick',
    'click [data-target=edit-plot]' : 'openPlotArgsSection',
    'click [data-hook=multiple-plots]' : 'plotMultiplePlots',
    'click [data-target=download-png-custom]' : 'handleDownloadPNGClick',
    'click [data-target=download-json]' : 'handleDownloadJSONClick',
    'click [data-hook=convert-to-notebook]' : 'handleConvertToNotebookClick',
    'click [data-hook=download-results-csv]' : 'handleDownloadResultsCsvClick',
    'click [data-hook=job-presentation]' : 'handlePresentationClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.parameterSweepResults;
    this.plots = {};
    this.plotArgs = {};
    this.mode = Boolean(attrs.mode) ? attrs.mode : "edit";
  },
  render: function (attrs, options) {
    let isEnsemble = this.model.settings.simulationSettings.realizations > 1 && 
                     this.model.settings.simulationSettings.algorithm !== "ODE";
    let isParameterScan = this.model.settings.parameterSweepSettings.parameters.length > 2
    if(this.parent.model.type === "Parameter Sweep"){
      this.template = isParameterScan ? parameterScanTemplate : parameterSweepResultsTemplate;
    }else{
      this.template = isEnsemble ? gillespyResultsEnsembleTemplate : gillespyResultsTemplate;
    }
    View.prototype.render.apply(this, arguments);
    if(this.mode === "presentation") {
      $(this.queryByHook("job-presentation")).css("display", "none");
      if(!isParameterScan){
        $(this.queryByHook("convert-to-notebook")).css("display", "none");
      }
    }//else if(app.getBasePath() === "/") {
    //   $(this.queryByHook("job-presentation")).css("display", "none");
    // }//else{
    //   $(this.queryByHook("job-presentation")).prop("disabled", true);
    // }
    if(this.parent.model.type === "Ensemble Simulation") {
      var type = isEnsemble ? "stddevran" : "trajectories";
    }else{
      this.tsPlotData = {"parameters":{}};
      var type = "ts-psweep";
      if(!isParameterScan) {
        this.renderSpeciesOfInterestView();
        this.renderFeatureExtractionView();
        if(isEnsemble) {
          this.renderEnsembleAggragatorView();
        }else{
          $(this.queryByHook('ensemble-aggragator-container')).css("display", "none");
        }
        this.getPlot("psweep");
      }
      if(isEnsemble) {
        this.renderPlotTypeSelectView();
        this.tsPlotData["type"] = "stddevran"
      }else{
        $(this.queryByHook('plot-type-header')).css("display", "none");
        this.tsPlotData["type"] = "trajectories"
      }
      this.renderSweepParameterView();
    }
    this.getPlot(type);
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  endAction: function () {
    $(this.queryByHook("job-action-start")).css("display", "none");
    let saved = $(this.queryByHook("job-action-end"));
    saved.css("display", "inline-block");
    setTimeout(function () {
      saved.css("display", "none");
    }, 5000);
  },
  errorAction: function () {
    $(this.queryByHook("job-action-start")).css("display", "none");
    let error = $(this.queryByHook("job-action-err"));
    error.css("display", "inline-block");
    setTimeout(function () {
      error.css("display", "none");
    }, 5000);
  },
  cleanupPlotContainer: function (type) {
    let el = this.queryByHook(type + "-plot");
    Plotly.purge(el);
    $(this.queryByHook(type + "-plot")).empty();
    if(type === "ts-psweep" || type === "psweep"){
      $(this.queryByHook(type + "-edit-plot")).prop("disabled", true);
      $(this.queryByHook(type + "-download-png-custom")).prop("disabled", true);
      $(this.queryByHook(type + "-download-json")).prop("disabled", true);
      $(this.queryByHook("multiple-plots")).prop("disabled", true);
    }
    $(this.queryByHook(type + "-plot-spinner")).css("display", "block");
  },
  getPlot: function (type) {
    let self = this;
    this.cleanupPlotContainer(type);
    let data = this.getPlotData(type);
    if(type === "psweep" && Boolean(this.plots[data.plt_key])) {
      this.plotFigure(this.plots[data.plt_key], type);
    }else if(type === "ts-psweep" && Boolean(this.plots[data.plt_type + data.plt_key])) {
      this.plotFigure(this.plots[data.plt_type + data.plt_key], type);
    }else{
      let queryStr = "?path=" + this.model.directory + "&data=" + JSON.stringify(data);
      let endpoint = path.join(app.getApiPath(), "workflow/plot-results") + queryStr;
      app.getXHR(endpoint, {
        success: function (err, response, body) {
          if(type === "psweep") {
            self.plots[data.plt_key] = body;
          }else if(type === "ts-psweep"){
            self.plots[data.plt_type + data.plt_key] = body;
          }else{
            self.plots[type] = body;
          }
          self.plotFigure(body, type);
        },
        error: function (err, response, body) {
          $(self.queryByHook(type + "-plot-spinner")).css("display", "none");
          let message = "<p>" + body.Message + "</p><p><b>Please re-run this job to get this plot</b></p>";
          $(self.queryByHook(type + "-plot")).html(message);
        }
      });
    }
  },
  getPlotData: function (type) {
    let data = {};
    if(type === 'psweep'){
      let key = this.getPsweepKey();
      data['plt_key'] = key;
    }else if(type === "ts-psweep" || type === "ts-psweep-mp") {
      if(type === "ts-psweep-mp"){
        data['plt_type'] = "mltplplt";
      }else{
        data['plt_type'] = this.tsPlotData['type'];
      }
      let key = this.getTSPsweepKey()
      data['plt_key'] = key;
    }else if(type === "mltplplt"){
      data['plt_type'] = type;
      data['plt_key'] = null;
    }else{
      data['plt_key'] = type;
    }
    if(Object.keys(this.plotArgs).length){
      data['plt_data'] = this.plotArgs;
    }else{
      data['plt_data'] = null;
    }
    return data
  },
  getPlotForEnsembleAggragator: function (e) {
    this.model.settings.resultsSettings.reducer = e.target.value;
    this.getPlot('psweep')
  },
  getPlotForFeatureExtractor: function (e) {
    this.model.settings.resultsSettings.mapper = e.target.value;
    this.getPlot('psweep')
  },
  getPlotForSpecies: function (e) {
    let species = this.model.model.species.filter(function (spec) {
      return spec.name === e.target.value;
    })[0];
    this.model.settings.parameterSweepSettings.speciesOfInterest = species;
    this.getPlot('psweep')
  },
  getPsweepKey: function () {
    let speciesOfInterest = this.model.settings.parameterSweepSettings.speciesOfInterest.name;
    let featureExtractor = this.model.settings.resultsSettings.mapper;
    let key = speciesOfInterest + "-" + featureExtractor
    let realizations = this.model.settings.simulationSettings.realizations;
    let algorithm = this.model.settings.simulationSettings.algorithm;
    if(algorithm !== "ODE" && realizations > 1){
      let ensembleAggragator = this.model.settings.resultsSettings.reducer;
      key += ("-" + ensembleAggragator);
    }
    return key;
  },
  getTSPlotForType: function (e) {
    this.tsPlotData['type'] = e.target.value;
    let display = this.tsPlotData['type'] === "trajectories" ? "inline-block" : "none";
    $(this.queryByHook("multiple-plots")).css("display", display);
    this.getPlot("ts-psweep");
  },
  getTSPsweepKey: function () {
    let self = this;
    let strs = Object.keys(this.tsPlotData.parameters).map(function (key) {
      return key + ":" + self.tsPlotData.parameters[key]
    });
    let key = strs.join(",");
    return key;
  },
  handleCollapsePlotContainerClick: function (e) {
    app.changeCollapseButtonText(this, e);
    let type = e.target.dataset.type;
    if(!this.plots[type]){
      this.getPlot(type);
    }
  },
  handleConvertToNotebookClick: function (e) {
    let self = this;
    if(this.parent.model.type === "Ensemble Simulation") {
      var type = "gillespy";
    }else if(this.parent.model.type === "Parameter Sweep" && this.model.settings.parameterSweepSettings.parameters.length > 1) {
      var type = "2d_parameter_sweep";
    }else{
      var type = "1d_parameter-sweep";
    }
    let queryStr = "?path=" + this.model.directory + "&type=" + type;
    let endpoint = path.join(app.getApiPath(), "workflow/notebook") + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        window.open(path.join(app.getBasePath(), "notebooks", body.FilePath));
      }
    });
  },
  handleDownloadJSONClick: function (e) {
    let type = e.target.dataset.type;
    let jsonData = this.plots[type];
    let dataStr = JSON.stringify(jsonData);
    let dataURI = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = type + '-plot.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  handleDownloadPNGClick: function (e) {
    let type = e.target.dataset.type;
    let pngButton = $('div[data-hook=' + type + '-plot] a[data-title*="Download plot as a png"]')[0];
    pngButton.click();
  },
  handleDownloadResultsCsvClick: function (e) {
    let self = this;
    let queryStr = "?path=" + this.model.directory + "&action=resultscsv";
    let endpoint = path.join(app.getApiPath(), "file/download-zip") + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        window.open(path.join("files", body.Path));
      }
    });
  },
  handlePresentationClick: function (e) {
    let self = this;
    this.startAction();
    let name = this.parent.model.name + "_" + this.model.name;
    let queryStr = "?path=" + this.model.directory + "&name=" + name;
    let endpoint = path.join(app.getApiPath(), "job/presentation") + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.endAction("publish");
        let title = body.message;
        let linkHeaders = "Shareable Presentation Link";
        let links = body.links;
        let name = self.model.name
        $(modals.presentationLinks(title, name, linkHeaders, links)).modal();
        let copyBtn = document.querySelector('#presentationLinksModal #copy-to-clipboard');
        copyBtn.addEventListener('click', function (e) {
          app.copyToClipboard(links.presentation)
        });
      },
      error: function (err, response, body) {
        self.errorAction();
        $(modals.newProjectModelErrorHtml(body.Reason, body.Message)).modal();
      }
    });
  },
  openPlotArgsSection: function (e) {
    $(this.queryByHook("edit-plot-args")).collapse("show");
    $(document).ready(function () {
      $("html, body").animate({ 
          scrollTop: $("#edit-plot-args").offset().top - 50
      }, false);
    });
  },
  plotFigure: function (figure, type) {
    let self = this;
    let hook = type + "-plot";
    let el = this.queryByHook(hook);
    Plotly.newPlot(el, figure);
    $(this.queryByHook(type + "-plot-spinner")).css("display", "none");
    $(this.queryByHook(type + "-edit-plot")).prop("disabled", false);
    $(this.queryByHook(type + "-download-png-custom")).prop("disabled", false);
    $(this.queryByHook(type + "-download-json")).prop("disabled", false);
    if(type === "trajectories" || (this.tsPlotData && this.tsPlotData.type === "trajectories")) {
      $(this.queryByHook("multiple-plots")).prop("disabled", false);
    }
  },
  plotMultiplePlots: function (e) {
    let type = e.target.dataset.type;
    let data = this.getPlotData(type);
    var queryStr = "?path=" + this.model.directory + "&wkfl=" + this.parent.model.name;
    queryStr += "&job=" + this.model.name + "&data=" + JSON.stringify(data);
    let endpoint = path.join(app.getBasePath(), "stochss/multiple-plots") + queryStr;
    window.open(endpoint);
  },
  renderEnsembleAggragatorView: function () {
    let ensembleAggragators = [
      ["min", "Minimum of ensemble"],
      ["max", "Maximum of ensemble"],
      ["avg", "Average of ensemble"],
      ["var", "Variance of ensemble"]
    ];
    let ensembleAggragatorView = new SelectView({
      name: 'ensemble-aggragator',
      requires: true,
      idAttribute: 'cid',
      options: ensembleAggragators,
      value: this.model.settings.resultsSettings.reducer
    });
    app.registerRenderSubview(this, ensembleAggragatorView, 'ensemble-aggragator-list');
  },
  renderFeatureExtractionView: function () {
    let featureExtractors = [
      ["min", "Minimum of population"],
      ["max", "Maximum of population"], 
      ["avg", "Average of population"], 
      ["var", "Variance of population"], 
      ["final", "Population at last time point"]
    ];
    let featureExtractionView = new SelectView({
      name: 'feature-extractor',
      requires: true,
      idAttribute: 'cid',
      options: featureExtractors,
      value: this.model.settings.resultsSettings.mapper
    });
    app.registerRenderSubview(this, featureExtractionView, 'feature-extraction-list');
  },
  renderPlotTypeSelectView: function () {
    let options = [
      ["stddevran", "Mean and Standard Deviation"],
      ["trajectories", "Trajectories"],
      ["stddev", "Standard Deviation"],
      ["avg", "Trajectory Mean"]
    ];
    let plotTypeSelectView = new SelectView({
      name: 'plot-type',
      required: true,
      idAttribute: 'cid',
      options: options,
      value: "stddevran"
    });
    app.registerRenderSubview(this, plotTypeSelectView, "plot-type-select");
  },
  renderSpeciesOfInterestView: function () {
    let speciesNames = this.model.model.species.map(function (specie) { return specie.name});
    let speciesOfInterestView = new SelectView({
      name: 'species-of-interest',
      required: true,
      idAttribute: 'cid',
      options: speciesNames,
      value: this.model.settings.parameterSweepSettings.speciesOfInterest.name
    });
    app.registerRenderSubview(this, speciesOfInterestView, "specie-of-interest-list");
  },
  renderSweepParameterView: function () {
    let sweepParameterView = this.renderCollection(
      this.model.settings.parameterSweepSettings.parameters,
      SweepParametersView,
      this.queryByHook("parameter-ranges")
    );
  },
  setTitle: function (e) {
    this.plotArgs['title'] = e.target.value
    for (var type in this.plots) {
      let fig = this.plots[type]
      fig.layout.title.text = e.target.value
      this.plotFigure(fig, type)
    }
  },
  setXAxis: function (e) {
    this.plotArgs['xaxis'] = e.target.value
    for (var type in this.plots) {
      let fig = this.plots[type]
      fig.layout.xaxis.title.text = e.target.value
      this.plotFigure(fig, type)
    }
  },
  setYAxis: function (e) {
    this.plotArgs['yaxis'] = e.target.value
    for (var type in this.plots) {
      let fig = this.plots[type]
      fig.layout.yaxis.title.text = e.target.value
      this.plotFigure(fig, type)
    }
  },
  startAction: function () {
    $(this.queryByHook("job-action-start")).css("display", "inline-block");
    $(this.queryByHook("job-action-end")).css("display", "none");
    $(this.queryByHook("job-action-err")).css("display", "none");
  },
  update: function () {},
  updateValid: function () {},
  subviews: {
    inputTitle: {
      hook: 'title',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'title',
          valueType: 'string',
          value: this.plotArgs.title || ""
        });
      }
    },
    inputXAxis: {
      hook: 'xaxis',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'xaxis',
          valueType: 'string',
          value: this.plotArgs.xaxis || ""
        });
      }
    },
    inputYAxis: {
      hook: 'yaxis',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'yaxis',
          valueType: 'string',
          value: this.plotArgs.yaxis || ""
        });
      }
    }
  }
});
