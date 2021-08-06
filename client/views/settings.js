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
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = Boolean(attrs.readOnly) ? attrs.readOnly : false
    this.newFormat = attrs.newFormat;
    this.stochssModel = attrs.stochssModel;
    this.type = attrs.type;
  },
  render: function() {
    View.prototype.render.apply(this, arguments);
    if(this.newFormat) {
      this.renderTimespanSettingsView();
    }
    if(this.type === "Parameter Sweep") {
      this.renderParameterSettingsView();
    }
    this.renderSimulationSettingsView();
  },
  renderParameterSettingsView: function () {
    if(this.parameterSettingsView) {
      this.parameterSettingsView.remove();
    }
    this.parameterSettingsView = new ParameterSettingsView({
      model: this.model.parameterSweepSettings,
      stochssModel: this.stochssModel,
      readOnly: this.readOnly
    });
    app.registerRenderSubview(this, this.parameterSettingsView, "param-sweep-settings-container");
  },
  renderSimulationSettingsView: function () {
    if(this.simulationSettingsView) {
      this.simulationSettingsView.remove();
    }
    this.simulationSettingsView = new SimulationSettingsView({
      model: this.model.simulationSettings,
      readOnly: this.readOnly
    });
    app.registerRenderSubview(this, this.simulationSettingsView, "sim-settings-container");
  },
  renderTimespanSettingsView: function () {
    if(this.timespanSettingsView) {
      this.timespanSettingsView.remove();
    }
    this.timespanSettingsView = new TimespanSettingsView({
      model: this.model.timespanSettings,
      readOnly: this.readOnly
    });
    app.registerRenderSubview(this, this.timespanSettingsView, "timespan-settings-container");
  }
});