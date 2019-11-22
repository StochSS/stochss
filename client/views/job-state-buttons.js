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
    var model = this.model
    var optType = document.URL.endsWith(".mdl") ? "sn" : "se";
    var job = document.URL.endsWith(".mdl") ? this.parent.parent.jobName : this.parent.parent.directory
    this.saveModel(function () {
      var endpoint = path.join('/stochss/api/jobs/save-job/', optType, model.directory, "<--GillesPy2Job-->", job);
      xhr({uri: endpoint}, function (err, response, body) {
        if(document.URL.endsWith('.mdl')){
          setTimeout(function () {
            var dirname = path.dirname(document.URL).split('hub')
            dirname.shift()
            dirname = dirname.join('hub')
            window.location.href = path.join(dirname, self.parent.parent.jobName + '.job')
          }, 3000); 
        }
      });
    });
  },
  clickStartJobHandler: function (e) {
    this.saveModel(this.runJob.bind(this));
  },
  clickEditModelHandler: function (e) {
    var self = this
    this.saveModel(function () {
      window.location.href = path.join("/hub/stochss/models/edit", self.model.directory);
    });
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
    var job = document.URL.endsWith(".mdl") ? this.parent.parent.jobName : this.parent.parent.directory
    var endpoint = path.join('/stochss/api/jobs/run-job/', optType, model.directory, "<--GillesPy2Job-->", job);
    var self = this;
    xhr({ uri: endpoint },function (err, response, body) {
      self.parent.collapseContainer();
      self.parent.parent.updateJobStatus();
      if(document.URL.endsWith('.mdl')){
        setTimeout(function () {
          var dirname = path.dirname(document.URL).split('hub')
          dirname.shift()
          dirname = dirname.join('hub')
          window.location.href = path.join(dirname, self.parent.parent.jobName + '.job')
        }, 3000);        
      }
    });
  },
});