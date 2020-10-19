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

var xhr = require('xhr');
var path = require('path');
var Plotly = require('../lib/plotly');
var $ = require('jquery');
//support file
var app = require('../app');
var modals = require('../modals');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/modelStateButtons.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=run]'  : 'clickRunHandler',
    'click [data-hook=new-workflow]' : 'clickNewWorkflowHandler',
    'click [data-hook=return-to-project-btn]' : 'clickReturnToProjectHandler',
    "click [data-hook=stochss-es]" : "handleEnsembleSimulationClick",
    "click [data-hook=stochss-ps]" : "handleParameterSweepClick"
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.model.species.on('add remove', this.togglePreviewWorkflowBtn, this);
    this.model.reactions.on('add remove', this.togglePreviewWorkflowBtn, this);
    this.model.eventsCollection.on('add remove', this.togglePreviewWorkflowBtn, this);
    this.model.rules.on('add remove', this.togglePreviewWorkflowBtn, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.togglePreviewWorkflowBtn();
    if(this.model.directory.includes('.proj')) {
      this.queryByHook("return-to-project-btn").style.display = "inline-block"
    }
  },
  clickSaveHandler: function (e) {
    this.saveModel(this.saved.bind(this));
  },
  clickRunHandler: function (e) {
    $(this.parent.queryByHook('model-run-error-container')).collapse('hide');
    $(this.parent.queryByHook('model-timeout-message')).collapse('hide');
    $(this.parent.queryByHook('explore-model-msg')).css('display', 'none');
    var el = this.parent.queryByHook('model-run-container');
    Plotly.purge(el)
    this.saveModel(this.runModel.bind(this));
  },
  clickReturnToProjectHandler: function (e) {
    let self = this
    this.saveModel(function () {
      self.saved()
      var queryString = "?path="+path.dirname(self.model.directory)
      window.location.href = path.join(app.getBasePath(), "/stochss/project/manager")+queryString;
    })
  },
  clickNewWorkflowHandler: function (e) {
    let self = this
    this.saveModel(function () {
      self.saved()
      var queryString = "?path="+self.model.directory
      if(self.model.directory.includes('.proj')) {
        let parentPath = path.join(path.dirname(self.model.directory), "WorkflowGroup1.wkgp")
        queryString += "&parentPath="+parentPath
      }
      let endpoint = path.join(app.getBasePath(), "stochss/workflow/selection")+queryString
      window.location.href = endpoint
    })
  },
  togglePreviewWorkflowBtn: function () {
    var numSpecies = this.model.species.length;
    var numReactions = this.model.reactions.length
    var numEvents = this.model.eventsCollection.length
    var numRules = this.model.rules.length
    $(this.queryByHook('run')).prop('disabled', (!numSpecies || (!numReactions && !numEvents && !numRules)))
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
    setTimeout(function () {
      saved.style.display = "none";
    }, 5000);
  },
  runModel: function () {
    this.saved();
    this.running();
    var el = this.parent.queryByHook('model-run-container')
    var model = this.model
    let queryStr = "?cmd=start&outfile=none&path="+model.directory
    var endpoint = path.join(app.getApiPath(), 'model/run')+queryStr;
    var self = this;
    xhr({ uri: endpoint, json: true}, function (err, response, body) {
      self.outfile = body.Outfile
      self.getResults()
    });
  },
  running: function () {
    var plot = this.parent.queryByHook('model-run-container');
    var spinner = this.parent.queryByHook('plot-loader');
    var errors = this.parent.queryByHook('model-run-error-container');
    plot.style.display = "none";
    spinner.style.display = "block";
    errors.style.display = "none";
  },
  ran: function (noErrors) {
    var plot = this.parent.queryByHook('model-run-container');
    var spinner = this.parent.queryByHook('plot-loader');
    var errors = this.parent.queryByHook('model-run-error-container');
    if(noErrors){
      plot.style.display = "block";
    }else{
      errors.style.display = "block"
    }
    spinner.style.display = "none";
  },
  getResults: function () {
    var self = this;
    var model = this.model;
    setTimeout(function () {
      let queryStr = "?cmd=read&outfile="+self.outfile+"&path="+model.directory
      endpoint = path.join(app.getApiPath(), 'model/run')+queryStr;
      xhr({ uri: endpoint, json: true}, function (err, response, body) {
        if(typeof body === "string") {
          body = body.replace(/NaN/g, null)
          body = JSON.parse(body)
        }
        var data = body.Results;
        if(response.statusCode >= 400){
          self.ran(false);
          $(self.parent.queryByHook('model-run-error-message')).text(data.errors);
        }
        else if(!body.Running){
          if(data.timeout){
            $(self.parent.queryByHook('model-timeout-message')).collapse('show');
          }
          self.plotResults(data.results);
        }else{
          self.getResults();
        }
      });
    }, 2000);
  },
  plotResults: function (data) {
    // TODO abstract this into an event probably
    var title = this.model.name + " Model Preview"
    this.ran(true)
    el = this.parent.queryByHook('model-run-container');
    Plotly.newPlot(el, data);
    $(this.parent.queryByHook('preview-plot-buttons')).css('display', 'inline-block')
    $(this.parent.queryByHook('explore-model-msg')).css('display', 'block');
    window.scrollTo(0, document.body.scrollHeight)
  },
  handleEnsembleSimulationClick: function (e) {
    this.launchStochssWorkflow("gillespy")
  },
  handleParameterSweepClick: function (e) {
    this.launchStochssWorkflow("parameterSweep")
  },
  launchStochssWorkflow: function (type) {
    let parentPath = path.join(path.dirname(this.model.directory), "WorkflowGroup1.wkgp")
    let queryString = "?type=" + type + "&path=" + this.model.directory + "&parentPath=" + parentPath
    let endpoint = path.join(app.getBasePath(), "stochss/workflow/edit")+queryString
    window.location.href = endpoint
  }
});
