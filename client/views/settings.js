/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
let path = require('path');
let _ = require('underscore');
//support file
let app = require('../app');
//views
let View = require('ampersand-view');
let TimespanSettingsView = require('./timespan-settings');
let ParameterSettingsView = require('./parameter-settings-view');
let SimulationSettingsView = require('./simulation-settings-view');
//templates
let template = require('../templates/includes/settings.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-settings]' : 'changeCollapseButtonText',
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=start-job]'  : 'clickStartJobHandler',
    'click [data-hook=edit-model]' : 'clickEditModelHandler'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function() {
    View.prototype.render.apply(this, arguments);
    if(this.parent.model.newFormat) {
      $(this.queryByHook("start-job")).text("Start New Job");
      this.renderTimespanSettingsView();
    }
    if(this.parent.model.type === "Parameter Sweep") {
      this.renderParameterSettingsView();
      if(this.model.parameterSweepSettings.parameters.length < 1) {
        $(this.queryByHook("start-job")).prop("disabled", true);
      }
      this.model.parameterSweepSettings.parameters.on("add remove", _.bind(function (e) {
        let numParams = this.model.parameterSweepSettings.parameters.length;
        $(this.queryByHook("start-job")).prop("disabled", numParams < 1);
      }, this))
    }
    this.renderSimulationSettingsView();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  clickEditModelHandler: function (e) {
    this.parent.handleSaveWorkflow(e, _.bind(function () {
      let queryStr = "?path=" + this.parent.model.model;
      let endpoint = path.join(app.getBasePath(), "stochss/models/edit") + queryStr;
      window.location.href = endpoint;
    }, this));
  },
  clickSaveHandler: function (e) {
    this.saving();
    this.parent.handleSaveWorkflow(e, _.bind(this.saved, this));
  },
  clickStartJobHandler: function (e) {
    this.saving();
    let self = this;
    let type = this.parent.model.type === "Ensemble Simulation" ? "gillespy" : "parameterSweep";
    let data = {"settings": this.parent.model.settings.toJSON(),
                "mdl_path": this.parent.model.model,
                "type": type, "time_stamp": this.getTimeStamp()};
    let queryStr = "?path=" + this.parent.model.directory + "&data=" + JSON.stringify(data);
    let initEndpoint = path.join(app.getApiPath(), "workflow/init-job") + queryStr;
    app.getXHR(initEndpoint, {
      success: function (err, response, body) {
        self.saved();
        let runQuery = "?path=" + body + "&type=" + type;
        let runEndpoint = path.join(app.getApiPath(), "workflow/run-job") + runQuery;
        app.getXHR(runEndpoint, {
          success: function (err, response, body) {
            self.parent.updateWorkflow(true);
          }
        });
      }
    });
  },
  getTimeStamp: function () {
    if(!this.parent.model.newFormat) {
      return null;
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month < 10){
      month = "0" + month
    }
    var day = date.getDate();
    if(day < 10){
      day = "0" + day
    }
    var hours = date.getHours();
    if(hours < 10){
      hours = "0" + hours
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
      minutes = "0" + minutes
    }
    var seconds = date.getSeconds();
    if(seconds < 10){
      seconds = "0" + seconds
    }
    return "_" + month + day + year + "_" + hours + minutes + seconds;
  },
  renderParameterSettingsView: function () {
    if(this.parameterSettingsView) {
      this.parameterSettingsView.remove();
    }
    this.parameterSettingsView = new ParameterSettingsView({
      model: this.model.parameterSweepSettings,
      modelDirectory: this.parent.model.model
    });
    app.registerRenderSubview(this, this.parameterSettingsView, "param-sweep-settings-container");
  },
  renderSimulationSettingsView: function () {
    if(this.simulationSettingsView) {
      this.simulationSettingsView.remove();
    }
    this.simulationSettingsView = new SimulationSettingsView({
      model: this.model.simulationSettings
    });
    app.registerRenderSubview(this, this.simulationSettingsView, "sim-settings-container");
  },
  renderTimespanSettingsView: function () {
    if(this.timespanSettingsView) {
      this.timespanSettingsView.remove();
    }
    this.timespanSettingsView = new TimespanSettingsView({
      model: this.model.timespanSettings
    });
    app.registerRenderSubview(this, this.timespanSettingsView, "timespan-settings-container");
  },
  saved: function () {
    $(this.queryByHook('saving-workflow')).css("display", "none");
    $(this.queryByHook('saved-workflow')).css("display", "inline-block");
  },
  saving: function () {
    $(this.queryByHook('saving-workflow')).css("display", "inline-block");
    $(this.queryByHook('saved-workflow')).css("display", "none");
  }
});