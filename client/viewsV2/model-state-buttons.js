var app = require('ampersand-app');
var xhr = require('xhr');
var path = require('path');
var Plotly = require('../lib/plotly');
//views
var View = require('ampersand-view');
//templates
var template = require('../templatesV2/includes/modelStateButtons.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=run]'  : 'clickRunHandler'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  clickSaveHandler: function (e) {
    this.saveModel()
  },
  clickRunHandler: function (e) {
    this.saveModel(this.runModel.bind(this));
    //this.runModel();
  },
  saveModel: function (cb) {
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
  runModel: function () {
    var model = this.model
    var endpoint = path.join(app.config.routePrefix, 'api/models/run/', model.name);
    var self = this;
    xhr(
      { uri: endpoint },
      function (err, response, body) {
        self.plotResults(JSON.parse(body));
      },
    );
  },
  plotResults: function (data) {
    // TODO abstract this into an event probably
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
    })
    Plotly.newPlot(el, traces, { margin: { t: 0 } });
  },
});