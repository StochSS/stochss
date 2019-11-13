var $ = require('jquery');
var path = require('path');
var xhr = require('xhr');
var Plotly = require('../lib/plotly');
//views
var View = require('ampersand-view');
var InputView = require('./input');
//templates
var resultsTemplate = require('../templates/includes/jobResults.pug');
var resultsEnsembleTemplate = require('../templates/includes/jobResultsEnsemble.pug');

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
    'click [data-hook=collapse]' : function () {
      this.changeCollapseButtonText("collapse");
    },
    'change [data-hook=title]' : 'setTitle',
    'change [data-hook=xaxis]' : 'setXAxis',
    'change [data-hook=yaxis]' : 'setYAxis',
    'click [data-hook=plot-stddevrange]' : function () {
      this.getPlot("stddevran");
    },
    'click [data-hook=plot-trajectories]' : function () {
      this.getPlot("trajectories");
    },
    'click [data-hook=plot-stddev]' : function () {
      this.getPlot("stddev");
    },
    'click [data-hook=plot-trajmean]' : function () {
      this.getPlot("avg");
    },
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.trajectories = attrs.trajectories;
    this.status = attrs.status;
  },
  render: function () {
    if(this.trajectories > 1){
      this.template = resultsEnsembleTemplate
    }else{
      this.template = resultsTemplate
    }
    View.prototype.render.apply(this, arguments);
    if(this.status !== 'ready' && this.status !== 'new'){
      this.expandContainer()
    }
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
    this.title = e.target.value;
  },
  setYAxis: function (e) {
    this.yaxis = e.target.value;
  },
  setXAxis: function (e) {
    this.xaxis = e.target.value;
  },
  getPlot: function (type) {
    var self = this;
    var data = {"plt_type": type}
    if(!this.title && !this.xaxis && !this.yaxis){
      data['plt_data'] = "None";
    }else{
      data['plt_data'] = {};
    }
    if(this.title){
      data['plt_data']['title'] = this.title;
    }
    if(this.xaxis){
      data['plt_data']['xaxis'] = this.xaxis;
    }
    if(this.yaxis){
      data['plt_data']['yaxis'] = this.yaxis;
    }
    var endpoint = path.join("/stochss/api/jobs/plot-results", this.parent.directory, '?data=' + JSON.stringify(data));
    console.log(endpoint)
    xhr({url: endpoint}, function (err, response, body){
      self.plotFigure(JSON.parse(body), type);
    });
  },
  plotFigure: function (figure, hook) {
    console.log(figure)
    var el = this.queryByHook(hook)
    Plotly.newPlot(el, figure)
  },
  expandContainer: function () {
    $(this.queryByHook('job-results')).collapse('show');
    $(this.queryByHook('collapse')).prop('disabled', false);
    this.changeCollapseButtonText("collapse")
    this.trajectories > 1 ? this.getPlot("stddevran") : this.getPlot("trajectories")
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
          value: this.title,
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
          value: this.xaxis,
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
          value: this.yaxis,
        });
      },
    },
  },
});