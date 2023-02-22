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
//models
let State = require('ampersand-state');
let ResultsSettings = require('./results-settings');
let TimespanSettings = require('./timespan-settings');
let InferenceSettings = require('./inference-settings');
let SimulationSettings = require('./simulation-settings');
let ParameterSweepSettings = require('./parameter-sweep-settings');

module.exports = State.extend({
  props: {
    template_version: 'number'
  },
  children: {
  	timespanSettings: TimespanSettings,
    simulationSettings: SimulationSettings,
    parameterSweepSettings: ParameterSweepSettings,
    inferenceSettings: InferenceSettings,
    resultsSettings: ResultsSettings
  },
  initialize: function(attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  derived: {
    elementID: {
      deps: ["parent"],
      fn: function () {
        if(this.parent) {
          return this.parent.elementID + "Set-";
        }
        return "Set-"
      }
    }
  }
});
