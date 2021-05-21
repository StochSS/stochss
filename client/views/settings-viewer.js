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

let $ = require('jquery');
//support files
let app = require('../app');
//views
let View = require('ampersand-view');
let ParameterViewerView = require('./view-sweep-parameter');
//templates
let template = require('../templates/includes/settingsViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-settings-viewer]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-ts-settings]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-sim-settings]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.algorithm = this.model.simulationSettings.isAutomatic ? 
               "The algorithm was chosen based on your model." : 
               this.model.simulationSettings.algorithm
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(!this.parent.model.newFormat) {
      $(this.queryByHook("timespan-settings-viewer-container")).css("display", "none");
    }
    let simSettings = this.model.simulationSettings;
    let hideDeterministic = simSettings.isAutomatic || simSettings.algorithm === "SSA" || simSettings.algorithm === "Tau-Leaping";
    let hideStochastic = simSettings.isAutomatic || simSettings.algorithm === "ODE" 
    if(hideDeterministic) {
      $(this.queryByHook("view-deterministic-settings")).css("display", "none");
    }
    if(hideStochastic) {
      $(this.queryByHook("view-stochastic-settings")).css("display", "none");
    }else if(simSettings.algorithm === "SSA") {
      $(this.queryByHook("view-tau-tolerance")).css("display", "none");
    }
    if(this.parent.model.type === "Parameter Sweep") {
      this.renderParametersCollection();
    }else{
      $(this.queryByHook("param-sweep-settings-viewer-container")).css("display", "none");
    }
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderParametersCollection: function () {
    let options = {"viewOptions": {
      parameters: this.model.parent.model.parameters
    }}
    this.renderCollection(
      this.model.parameterSweepSettings.parameters,
      ParameterViewerView,
      this.queryByHook("view-sweep-parameters"),
      options
    );
  },
});
