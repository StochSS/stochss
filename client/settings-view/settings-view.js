/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
let SpatialSettingsView = require('./views/spatial-settings-view');
let TimespanSettingsView = require('./views/timespan-settings-view');
let ParameterSettingsView = require('./views/parameter-settings-view');
let InferenceSettingsView = require('./views/inference-settings-view');
let WellMixedSettingsView = require('./views/well-mixed-settings-view');
//templates
let template = require('./settingsView.pug');

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
    }else if(this.type === "Model Inference") {
      this.renderInferenceSettingsView();
    }
    this.renderSimulationSettingsView();
  },
  renderInferenceSettingsView: function () {
    if(this.inferenceSettingsView) {
      this.inferenceSettingsView.remove();
    }
    this.inferenceSettingsView = new InferenceSettingsView({
      model: this.model.inferenceSettings,
      stochssModel: this.stochssModel,
      readOnly: this.readOnly
    });
    let hook = "inference-settings-container";
    app.registerRenderSubview(this, this.inferenceSettingsView, hook);
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
    let settingsView = this.type.includes("Spatial") ? SpatialSettingsView : WellMixedSettingsView;
    this.simulationSettingsView = new settingsView({
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
      readOnly: this.readOnly,
      isSpatial: this.type === "Spatial Ensemble Simulation"
    });
    app.registerRenderSubview(this, this.timespanSettingsView, "timespan-settings-container");
  }
});