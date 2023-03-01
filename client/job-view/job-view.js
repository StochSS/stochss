/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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

let $ = require('jquery')
//support files
let app = require('../app');
//views
let View = require('ampersand-view');
let LogsView = require('./views/job-logs-view');
let ModelView = require('../model-view/model-view');
let ResultsView = require('./views/job-results-view');
let SettingsView = require('../settings-view/settings-view');
//templates
let template = require('./jobView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-review-settings]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-model]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
  	View.prototype.initialize.apply(this, arguments);
  	this.readOnly = Boolean(attrs.readOnly) ? attrs.readOnly : false;
  	this.wkflName = attrs.wkflName;
  	this.titleType = attrs.titleType;
    this.newFormat = attrs.newFormat;
    this.settingsHeader = this.readOnly ? "Settings" : "Review Settings";
    this.modelHeader = (this.readOnly ? "Model: " : "Review Model: ") + this.model.model.name;
    this.domainPlot = attrs.domainPlot;
  },
  render: function (attrs, options) {
  	View.prototype.render.apply(this, arguments);
  	if(this.model.status !== "error") {
      this.renderResultsView();
    }
    if(!this.readOnly) {
      this.renderLogsView();
    }
    this.renderSettingsView();
    this.renderModelView();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderLogsView: function () {
    let logsView = new LogsView({
      logs: this.model.logs
    });
    app.registerRenderSubview(this, logsView, "job-info-container");
  },
  renderModelView: function () {
    let modelView = new ModelView({
      model: this.model.model,
      domainPlot: this.domainPlot,
      readOnly: true
    });
    app.registerRenderSubview(this, modelView, "model-viewer-container");
  },
  renderResultsView: function () {
    let resultsView = new ResultsView({
      model: this.model,
      readOnly: this.readOnly,
      wkflName: this.wkflName,
      titleType: this.titleType
    });
    app.registerRenderSubview(this, resultsView, "job-results-container");
  },
  renderSettingsView: function () {
    let settingsView = new SettingsView({
      model: this.model.settings,
      newFormat: this.newFormat,
      readOnly: true,
      stochssModel: this.model.model,
      type: this.titleType
    });
    app.registerRenderSubview(this, settingsView, "settings-viewer-container");
  }
});