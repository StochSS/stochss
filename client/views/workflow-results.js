var $ = require('jquery');
var path = require('path');
var xhr = require('xhr');
//support files
var Plotly = require('../lib/plotly');
var app = require('../app');
var Tooltips = require('../tooltips');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
//templates
var gillespyResultsTemplate = require('../templates/includes/gillespyResults.pug');
var gillespyResultsEnsembleTemplate = require('../templates/includes/gillespyResultsEnsemble.pug');
var parameterSweepResultsTemplate = require('../templates/includes/parameterSweepResults.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=collapse-stddevrange]' : function () {
      this.changeCollapseButtonText("collapse-stddevrange");
    },
    'click [data-hook=collapse-trajectories]' : function () {
      this.changeCollapseButtonText("collapse-trajectories");
    },
    'click [data-hook=collapse-stddev]' : function () {
      this.changeCollapseButtonText("collapse-stddev");
    },
    'click [data-hook=collapse-trajmean]' : function () {
      this.changeCollapseButtonText("collapse-trajmean");
    },
    'click [data-hook=collapse-psweep]' : function () {
       this.changeCollapseButtonText("collapse-psweep");
     },
    'click [data-hook=collapse]' : function () {
      this.changeCollapseButtonText("collapse");
    },
    'change [data-hook=title]' : 'setTitle',
    'change [data-hook=xaxis]' : 'setXAxis',
    'change [data-hook=yaxis]' : 'setYAxis',
    'change [data-hook=specie-of-interest-list]' : 'getPlotForSpecies',
    'change [data-hook=feature-extraction-list]' : 'getPlotForFeatureExtractor',
    'change [data-hook=ensemble-aggragator-list]' : 'getPlotForEnsembleAggragator',
    'click [data-hook=plot]' : function (e) {
      var type = e.target.id
      if(this.plots[type]) {
        $(this.queryByHook("edit-plot-args")).collapse("show");
      }else{
        this.getPlot(type);
        e.target.innerText = "Edit Plot"
      }
    },
    'click [data-hook=download-png-custom]' : function (e) {
      var type = e.target.id;
      this.clickDownloadPNGButton(type)
    },
    'click [data-hook=download-json]' : function (e) {
      var type = e.target.id;
      this.exportToJsonFile(this.plots[type], type)
    },
    'click [data-hook=download-results-csv]' : 'handlerDownloadResultsCsvClick',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.parameterSweepResults
    this.trajectories = attrs.trajectories;
    this.status = attrs.status;
    this.species = attrs.species;
    this.type = attrs.type;
    this.speciesOfInterest = attrs.speciesOfInterest;
    this.featureExtractor = "final";
    this.ensembleAggragator = "avg";
    this.plots = {}
    this.plotArgs = {}
  },
  render: function () {
    if(this.type === "parameterSweep"){
      this.template = parameterSweepResultsTemplate
    }else{
      this.template = this.trajectories > 1 ? gillespyResultsEnsembleTemplate : gillespyResultsTemplate
    }
    View.prototype.render.apply(this, arguments);
    if(this.status === 'complete'){
      this.expandContainer()
    }
    var speciesNames = this.species.map(function (specie) { return specie.name});
    var featureExtractors = ["Minimum of population", "Maximum of population", "Average of population", "Variance of population", "Population at last time point"]
    var ensembleAggragators = ["Minimum of ensemble", "Maximum of ensemble", "Average of ensemble", "Variance of ensemble"]
    var speciesOfInterestView = new SelectView({
      label: '',
      name: 'species-of-interest',
      required: true,
      idAttribute: 'cid',
      options: speciesNames,
      value: this.speciesOfInterest
    });
    var featureExtractorView = new SelectView({
      label: '',
      name: 'feature-extractor',
      requires: true,
      idAttribute: 'cid',
      options: featureExtractors,
      value: "Population at last time point"
    });
    var ensembleAggragatorView = new SelectView({
      label: '',
      name: 'ensemble-aggragator',
      requires: true,
      idAttribute: 'cid',
      options: ensembleAggragators,
      value: "Average of ensemble"
    });
    if(this.type === "parameterSweep"){
      this.registerRenderSubview(speciesOfInterestView, 'specie-of-interest-list');
      this.registerRenderSubview(featureExtractorView, 'feature-extraction-list');
      this.registerRenderSubview(ensembleAggragatorView, 'ensemble-aggragator-list');
      if(this.trajectories <= 1){
        $(this.queryByHook('ensemble-aggragator-container')).collapse()
      }else{
        $(this.queryByHook('ensemble-aggragator-container')).addClass("inline")
      }
    }
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");
       });
    });
  },
  update: function () {
  },
  updateValid: function () {
  },
  changeCollapseButtonText: function (source) {
    var text = $(this.queryByHook(source)).text();
    text === '+' ? $(this.queryByHook(source)).text('-') : $(this.queryByHook(source)).text('+');
  },
  setTitle: function (e) {
    this.plotArgs['title'] = e.target.value
    for (var type in this.plots) {
      var fig = this.plots[type]
      fig.layout.title.text = e.target.value
      this.plotFigure(fig, type)
    }
  },
  setYAxis: function (e) {
    this.plotArgs['yaxis'] = e.target.value
    for (var type in this.plots) {
      var fig = this.plots[type]
      fig.layout.yaxis.title.text = e.target.value
      this.plotFigure(fig, type)
    }
  },
  setXAxis: function (e) {
    this.plotArgs['xaxis'] = e.target.value
    for (var type in this.plots) {
      var fig = this.plots[type]
      fig.layout.xaxis.title.text = e.target.value
      this.plotFigure(fig, type)
    }
  },
  getPlot: function (type) {
    var self = this;
    var el = this.queryByHook(type)
    Plotly.purge(el)
    var data = {}
    if(type === 'psweep'){
      let key = this.getPsweepKey()
      data['plt_key'] = key;
    }else{
      data['plt_key'] = type;
    }
    if(Object.keys(this.plotArgs).length){
      data['plt_data'] = this.plotArgs
    }else{
      data['plt_data'] = "None"
    }
    var endpoint = path.join(app.getApiPath(), "workflow/plot-results")+"?path="+this.parent.wkflPath+"&data="+JSON.stringify(data);
    xhr({url: endpoint, json: true}, function (err, response, body){
      if(response.statusCode >= 400){
        $(self.queryByHook(type)).html(body.Message)
      }else{
        self.plots[type] = body
        self.plotFigure(body, type);
      }
    });
  },
  plotFigure: function (figure, type) {
    var self = this;
    var hook = type;
    var el = this.queryByHook(hook)
    Plotly.newPlot(el, figure)
    this.queryAll("#" + type).forEach(function (el) {
      if(el.disabled){
        el.disabled = false;
      }
    });
  },
  clickDownloadPNGButton: function (type) {
    var pngButton = $('div[data-hook*='+type+'] a[data-title*="Download plot as a png"]')[0]
    pngButton.click()
  },
  exportToJsonFile: function (jsonData, plotType) {
    let dataStr = JSON.stringify(jsonData);
    let dataURI = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = plotType + '-plot.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  handlerDownloadResultsCsvClick: function (e) {
    let path = this.parent.wkflPath
    this.getExportData(path)
  },
  getExportData: function (wkflPath) {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "file/download-zip")+"?path="+wkflPath+"&action=resultscsv"
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        self.exportToZipFile(body.Path)
      }
    });
  },
  exportToZipFile: function (resultsPath) {
    var endpoint = path.join("files", resultsPath);
    window.location.href = endpoint
  },
  expandContainer: function () {
    $(this.queryByHook('workflow-results')).collapse('show');
    $(this.queryByHook('collapse')).prop('disabled', false);
    this.changeCollapseButtonText("collapse")
    if(this.type === "parameterSweep"){
      this.getPlot("psweep")
    }else{
      this.trajectories > 1 ? this.getPlot("stddevran") : this.getPlot("trajectories")
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  getPlotForSpecies: function (e) {
    this.speciesOfInterest = e.target.selectedOptions.item(0).text;
    this.getPlot('psweep')
  },
  getPlotForFeatureExtractor: function (e) {
    var featureExtractors = {"Minimum of population":"min", 
                             "Maximum of population":"max", 
                             "Average of population":"avg", 
                             "Variance of population":"var", 
                             "Population at last time point":"final"}
    var value = e.target.selectedOptions.item(0).text;
    this.featureExtractor = featureExtractors[value]
    this.getPlot('psweep')
  },
  getPlotForEnsembleAggragator: function (e) {
    var ensembleAggragators = {"Minimum of ensemble":"min", 
                               "Maximum of ensemble":"max", 
                               "Average of ensemble":"avg", 
                               "Variance of ensemble":"var"}
    var value = e.target.selectedOptions.item(0).text;
    this.ensembleAggragator = ensembleAggragators[value]
    this.getPlot('psweep')
  },
  getPsweepKey: function () {
    let key = this.speciesOfInterest + "-" + this.featureExtractor
    if(this.trajectories > 1){
      key += ("-" + this.ensembleAggragator)
    }
    return key
  },
  subviews: {
    inputTitle: {
      hook: 'title',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'title',
          label: '',
          tests: '',
          modelKey: null,
          valueType: 'string',
          value: this.plotArgs.title || "",
        });
      },
    },
    inputXAxis: {
      hook: 'xaxis',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'xaxis',
          label: '',
          tests: '',
          modelKey: null,
          valueType: 'string',
          value: this.plotArgs.xaxis || "",
        });
      },
    },
    inputYAxis: {
      hook: 'yaxis',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'yaxis',
          label: '',
          tests: '',
          modelKey: null,
          valueType: 'string',
          value: this.plotArgs.yaxis || "",
        });
      },
    },
  },
});
