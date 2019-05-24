var xhr = require('xhr');
var View = require('ampersand-view');
var Plotly = require('../lib/plotly');

var template = require('../templates/includes/modelStateButtons.pug');

// this.model is an instance of ModelVersion
module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=run]'  : 'clickRunHandler'
  },
  clickSaveHandler: function (e) {
    this.saveModel()
  },
  clickRunHandler: function (e) {
    el = this.parent.parent.queryByHook('model-run-container');
    //this.saveModel(this.runModel);
    this.runModel(this.model);
  },
  runModel: function (model) {
    var endpoint = '/api/models/run/' + model.id + '/' + this.model.version;
    var self = this;
    xhr(
      { uri: endpoint },
      function (err, response, body) {
        self.plotResults(JSON.parse(body));
      }
    )
  },
  plotResults: function (data) {
    // TODO abstract this into an event probably
    el = this.parent.parent.queryByHook('model-run-container');
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
  saveModel: function (cb) {
    // this.model is a ModelVersion, the parent of the collection is Model
    var model = this.model.collection.parent;
    if (cb) {
      model.save(model.attributes, {
        success: cb,
        error: function (model, response, options) {
          console.error("Error saving model:", model);
          console.error("Response:", response);
        }
      });
    } else {
      model.save();
    }
  }
});
