var app = require('ampersand-app');
var xhr = require('xhr');
var path = require('path');
var Plotly = require('../lib/plotly');
var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/modelStateButtons.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=run]'  : 'clickRunHandler',
    'click [data-hook=start-job]' : 'clickStartJobHandler',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  clickSaveHandler: function (e) {
    this.saveModel(this.saved.bind(this));
  },
  clickRunHandler: function (e) {
    var el = this.parent.queryByHook('model-run-container');
    Plotly.purge(el)
    this.saveModel(this.runModel.bind(this));
  },
  clickStartJobHandler: function (e) {
    window.location.href = path.join("/hub/stochss/jobs/edit", this.model.directory);
  },
  saveModel: function (cb) {
    this.saving();
    // this.model is a ModelVersion, the parent of the collection is Model
    var model = this.model;
    if (cb) {
      model.save(model.attributes, {
        success: cb,
        error: function (model, response, options) {
          console.error("Error saving model:", model);
          console.error("Response:", response);
        },
      });
    } else {
      model.saveModel();
    }
  },
  saving: function () {
    var saving = this.queryByHook('saving-mdl');
    var saved = this.queryByHook('saved-mdl');
    saved.style.display = "none";
    saving.style.display = "inline-block";
  },
  saved: function () {
    var saving = this.queryByHook('saving-mdl');
    var saved = this.queryByHook('saved-mdl');
    saving.style.display = "none";
    saved.style.display = "inline-block";
  },
  runModel: function () {
    this.saved();
    this.running();
    var el = this.parent.queryByHook('model-run-container')
    var model = this.model
    var endpoint = path.join('/stochss/api/models/run/', 'start', 'none', model.directory);
    var self = this;
    xhr({ uri: endpoint }, function (err, response, body) {
      self.getResults(body)
    });
  },
  running: function () {
    var el = this.parent.queryByHook('model-run-container');
    var loader = this.parent.queryByHook('plot-loader');
    el.style.display = "none"
    loader.style.display = "block"
  },
  ran: function () {
    var el = this.parent.queryByHook('model-run-container');
    var loader = this.parent.queryByHook('plot-loader');
    loader.style.display = "none";
    el.style.display = "block";
  },
  getResults: function (body) {
    var self = this;
    var model = this.model;
    setTimeout(function () {
      var outfile = body.split("->").pop()
      endpoint = path.join('/stochss/api/models/run/', 'read', outfile, model.directory);
      xhr({ uri: endpoint }, function (err, response, body) {
        if(!body.startsWith('running')){
          var data = JSON.parse(body);
          if(data.timeout){
            $(self.parent.queryByHook('model-timeout-message')).collapse('show');
          }
          self.plotResults(data.results);
        }else{
          self.getResults(body);
        }
      });
    }, 2000);
  },
  plotResults: function (data) {
    // TODO abstract this into an event probably
    var title = this.model.name + " Model Preview"
    this.ran()
    el = this.parent.queryByHook('model-run-container');
    time = data.time
    y_labels = Object.keys(data).filter(function (key) {
      return key !== 'data' && key !== 'time'
    });
    traces = y_labels.map(function (specie) {
      return {
        x: time,
        y: data[specie],
        mode: 'lines',
        name: specie
      }
    });
    layout = { 
      showlegend: true,
      legend: {
        x: 1,
        y: 0.9
      },
      margin: { 
        t: 0 
      } 
    }
    config = {
      responsive: true,
    }
    Plotly.newPlot(el, traces, layout, config);
    window.scrollTo(0, document.body.scrollHeight)
  },
});
