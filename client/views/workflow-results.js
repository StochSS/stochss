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
let xhr = require('xhr');
let path = require('path');
//support files
let app = require('../app');
let Tooltips = require('../tooltips');
let Plotly = require('../lib/plotly');
//views
let InputView = require('./input');
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
//templates
let gillespyResultsTemplate = require('../templates/includes/gillespyResults.pug');
let gillespyResultsEnsembleTemplate = require('../templates/includes/gillespyResultsEnsemble.pug');
let parameterSweepResultsTemplate = require('../templates/includes/parameterSweepResults.pug');

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
    'click [data-target=download-png-custom]' : 'handleDownloadPNGClick',
    'click [data-target=download-json]' : 'handleDownloadJSONClick',
    'click [data-hook=convert-to-notebook]' : 'handleConvertToNotebookClick',
    'click [data-hook=download-results-csv]' : 'handleDownloadResultsCsvClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.parameterSweepResults;
    this.plots = {};
    this.plotArgs = {};
  },
  render: function (attrs, options) {
    let isEnsemble = this.model.settings.simulationSettings.realizations > 1 && 
                     this.model.settings.simulationSettings.algorithm !== "ODE";
    if(this.parent.model.type === "Parameter Sweep"){
      this.template = parameterSweepResultsTemplate;
    }else{
      this.template = isEnsemble ? gillespyResultsEnsembleTemplate : gillespyResultsTemplate;
    }
    View.prototype.render.apply(this, arguments);
    if(this.parent.model.type === "Ensemble Simulation") {
      var type = isEnsemble ? "stddevran" : "trajectories";
    }else{
      this.tsPlotData = {"parameters":{}};
      var type = "psweep";
      this.renderSpeciesOfInterestView();
      this.renderFeatureExtractionView();
      if(isEnsemble) {
        this.renderEnsembleAggragatorView();
        this.renderPlotTypeSelectView();
        this.tsPlotData["type"] = "stddevran"
      }else{
        $(this.queryByHook('ensemble-aggragator-container')).css("display", "none");
        $(this.queryByHook('plot-type-header')).css("display", "none");
        this.tsPlotData["type"] = "trajectories"
      }
      let data = this.getPlot("ts-psweep");
      console.log(data)
    }
    this.getPlot(type);
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  getPlot: function (type) {
    let self = this;
    let el = this.queryByHook(type + "-plot");
    Plotly.purge(el);
    $(this.queryByHook(type + "-plot-spinner")).css("display", "block");
    let data = {};
    if(type === 'psweep'){
      let key = this.getPsweepKey()
      data['plt_key'] = key;
    }else if(type === "ts-psweep") {
      data['plt_type'] = this.tsPlotData['type'];
      data['plt_key'] = "";
    }else{
      data['plt_key'] = type;
    }
    if(Object.keys(this.plotArgs).length){
      data['plt_data'] = this.plotArgs;
    }else{
      data['plt_data'] = null;
    }
    if(type === 'ts-psweep') {
      return data;
    }
    let queryStr = "?path=" + this.model.directory + "&data=" + JSON.stringify(data);
    let endpoint = path.join(app.getApiPath(), "workflow/plot-results") + queryStr;
    xhr({url: endpoint, json: true}, function (err, response, body){
      if(response.statusCode >= 400){
        $(self.queryByHook(type + "-plot")).html(body.Message);
      }else{
        self.plots[type] = body;
        self.plotFigure(body, type);
      }
    });
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
    if(this.model.settings.simulationSettings.realizations > 1){
      let ensembleAggragator = this.model.settings.resultsSettings.reducer;
      key += ("-" + ensembleAggragator);
    }
    return key;
  },
  getTSPlotForType: function (e) {
    this.tsPlotData['type'] = e.target.value;
    let data = this.getPlot("ts-psweep");
    console.log(data)
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
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
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
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        window.open(path.join("files", body.Path));
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
      ["stddevran", "Standard Deviation Range"],
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
