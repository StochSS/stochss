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
    'click [data-hook=collapse-stddevrange]' : 'handleCollapseStddevrangeClick',
    'click [data-hook=collapse-trajectories]' : 'handleCollapseTrajectoriesClick',
    'click [data-hook=collapse-stddev]' : 'handleCollapseStddevClick',
    'click [data-hook=collapse-trajmean]' : 'handleCollapseTrajmeanClick',
    'click [data-hook=collapse-psweep]' : 'handleCollapsePsweepClick',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'change [data-hook=title]' : 'setTitle',
    'change [data-hook=xaxis]' : 'setXAxis',
    'change [data-hook=yaxis]' : 'setYAxis',
    'change [data-hook=specie-of-interest-list]' : 'getPlotForSpecies',
    'change [data-hook=feature-extraction-list]' : 'getPlotForFeatureExtractor',
    'change [data-hook=ensemble-aggragator-list]' : 'getPlotForEnsembleAggragator',
    'click [data-hook=plot]' : function (e) {
      $(this.queryByHook("edit-plot-args")).collapse("show");
      $(document).ready(function () {
      $("html, body").animate({ 
          scrollTop: $("#edit-plot-args").offset().top - 50
      }, false);
    });
    },
    'click [data-hook=download-png-custom]' : function (e) {
      var type = e.target.id;
      this.clickDownloadPNGButton(type)
    },
    'click [data-hook=download-json]' : function (e) {
      var type = e.target.id;
      this.exportToJsonFile(this.plots[type], type)
    },
    'click [data-hook=save-plot]' : function (e) {
      var type = e.target.id;
      e.target.disabled = true
      $("button[data-hook=save-plot]").filter("#"+type).text('Saved Plot to Project Viewer')
      this.savePlot(type)
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
    this.savedPlots = this.parent.settings.resultsSettings.outputs
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
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
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
    this.queryAll("#"+type).filter(function (el) {if(el.dataset.hook === "plot-spinner") return true})[0].style.display = "block"
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
        let plotSaved = Boolean(self.savedPlots.filter(function (plot) {
          if(plot.key === data.plt_key)
            return true
        }).length > 0)
        let saveBtn = $("button[data-hook=save-plot]").filter("#"+type)
        if(!self.parent.wkflPath.includes('.proj')) {
          saveBtn.hide()
        }else if(plotSaved) {
          saveBtn.prop('disabled', true)
          saveBtn.text('Plot Saved to Project Viewer')
        } 
      }
    });
  },
  plotFigure: function (figure, type) {
    var self = this;
    var hook = type;
    var el = this.queryByHook(hook)
    Plotly.newPlot(el, figure)
    this.queryAll("#" + type).forEach(function (el) {
      if(el.dataset.hook === "plot-spinner"){
        el.style.display = "none"
      }else if(el.disabled){
        el.disabled = false;
      }
    });
  },
  clickDownloadPNGButton: function (type) {
    var pngButton = $('div[data-hook='+type+'] a[data-title*="Download plot as a png"]')[0]
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
    window.open(endpoint)
  },
  expandContainer: function () {
    $(this.queryByHook('workflow-results')).collapse('show');
    let collapseBtn = $(this.queryByHook('collapse'));
    collapseBtn.prop('disabled', false)
    collapseBtn.click()
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
  savePlot: function (type) {
    var species = []
    if(type === "psweep"){
      type = this.getPsweepKey()
      species = [this.speciesOfInterest]
    }else{
      species = this.species.map(function (specie) { return specie.name; });
    }
    let stamp = this.getTimeStamp()
    var plotInfo = {"key":type, "stamp":stamp, "species":species};
    plotInfo = Object.assign({}, plotInfo, this.plotArgs)
    this.savedPlots.push(plotInfo)
    let queryString = "?path="+path.join(this.parent.wkflPath, "settings.json")
    let endpoint = path.join(app.getApiPath(), "workflow/save-plot")+queryString
    xhr({uri: endpoint, method: "post", json: true, body: plotInfo}, function (err, response, body) {
      if(response.statusCode > 400) {
        console.log(body.message)
      }
    })
  },
  getTimeStamp: function () {
    var date = new Date()
    let year = date.getFullYear().toString().slice(-2)
    let month = date.getMonth() >= 10 ? date.getMonth().toString() : "0" + date.getMonth()
    let day = date.getDate() >= 10 ? date.getDate().toString() : "0" + date.getDate()
    let hour = date.getHours() >= 10 ? date.getHours().toString() : "0" + date.getHours()
    let minutes = date.getMinutes() >= 10 ? date.getMinutes().toString() : "0" + date.getMinutes()
    let seconds = date.getSeconds() >= 10 ? date.getSeconds().toString() : "0" + date.getSeconds()
    return parseInt(year+month+day+hour+minutes+seconds)
  },
  handleCollapseStddevrangeClick: function (e) {
    this.changeCollapseButtonText(e)
    let type = "stddevran"
    if(!this.plots[type]){
      this.getPlot(type);
    }
  },
  handleCollapseTrajectoriesClick: function (e) {
    this.changeCollapseButtonText(e)
    let type = "trajectories"
    if(!this.plots[type]){
      this.getPlot(type);
    }
  },
  handleCollapseStddevClick: function (e) {
    this.changeCollapseButtonText(e)
    let type = "stddev"
    if(!this.plots[type]){
      this.getPlot(type);
    }
  },
  handleCollapseTrajmeanClick: function (e) {
    this.changeCollapseButtonText(e)
    let type = "avg"
    if(!this.plots[type]){
      this.getPlot(type);
    }
  },
  handleCollapsePsweepClick: function (e) {
    this.changeCollapseButtonText(e)
    let type = "psweep"
    if(!this.plots[type]){
      this.getPlot(type);
    }
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
