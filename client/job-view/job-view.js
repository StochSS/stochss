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

let $ = require('jquery')
//support files
let app = require('../app');
//views
let View = require('ampersand-view');
let LogsView = require('./views/job-logs-view');
let ResultsView = require('./views/job-results-view');
let SettingsView = require('../settings-view/settings-view');
//templates
let template = require('./jobView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-review-settings]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
  	View.prototype.initialize.apply(this, arguments);
  	this.readOnly = Boolean(attrs.readOnly) ? attrs.readOnly : false;
  	this.wkflName = attrs.wkflName;
  	this.titleType = attrs.titleType;
    this.newFormat = attrs.newFormat;
    this.settingsHeader = this.readOnly ? "Settings" : "Review Settings";
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
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  removeSubviews: function () {
    this.resultsView.remove();
    this.logsView.remove();
    this.settingsView.remove();
  },
  renderLogsView: function () {
    if(this.logsView) {
      this.logsView.remove();
    }
    this.logsView = new LogsView({
      logs: this.model.logs
    });
    app.registerRenderSubview(this, this.logsView, "job-info-container");
  },
  renderResultsView: function () {
    if(this.resultsView) {
      this.resultsView.remove();
    }
    this.resultsView = new ResultsView({
      model: this.model,
      readOnly: this.readOnly,
      wkflName: this.wkflName,
      titleType: this.titleType
    });
    app.registerRenderSubview(this, this.resultsView, "job-results-container");
  },
  renderSettingsView: function () {
    if(this.settingsView) {
      this.settingsView.remove();
    }
    this.settingsView = new SettingsView({
      model: this.model.settings,
      newFormat: this.newFormat,
      readOnly: true,
      stochssModel: this.model.model,
      type: this.titleType
    });
    app.registerRenderSubview(this, this.settingsView, "settings-viewer-container");
  }
});