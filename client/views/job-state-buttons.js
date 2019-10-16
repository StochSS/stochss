var app = require('ampersand-app');
var $ = require('jquery');
var xhr = require('xhr');
var path = require('path');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/jobStateButtons.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=start-job]'  : 'clickStartJobHandler',
    'click [data-hook=edit-model]' : 'clickEditModelHandler',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  clickSaveHandler: function (e) {
    var self = this;
    var optType = document.URL.endsWith(".mdl") ? "sn" : "se";
    this.saveModel(function () {
      if(document.URL.endsWith('.mdl')){
        var dirname = path.dirname(document.URL).split('localhost/hub').pop()
        //window.location.href = path.join(dirname, self.parent.parent.jobName + '.job')
      }
    });
  },
  clickStartJobHandler: function (e) {
    this.saveModel(this.runJob.bind(this));
  },
  clickEditModelHandler: function (e) {
    this.saveModel(window.location.href = path.join("/hub/stochss/models/edit", this.model.directory));
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
  runJob: function () {
    var model = this.model;
    var optType = document.URL.endsWith(".mdl") ? "rn" : "re";
    var endpoint = path.join('/stochss/api/jobs/run-job/', optType, model.directory, "<--GillesPy2Job-->", this.parent.parent.jobName);
    var self = this;
    xhr({ uri: endpoint },function (err, response, body) {
      if(document.URL.endsWith('.mdl')){
        var dirname = path.dirname(document.URL).split('localhost/hub').pop()
        window.location.href = path.join(dirname, self.parent.parent.jobName + '.job')
      }
    });
  },
});