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

//models
var State = require('ampersand-state');
var SimulationSettings = require('./simulation-settings');
var ParameterSweepSettings = require('./parameter-sweep-settings');
var ResultsSettings = require('./results-settings');

module.exports = State.extend({
  children: {
    simulationSettings: SimulationSettings,
    parameterSweepSettings: ParameterSweepSettings,
    resultsSettings: ResultsSettings
  },
  initialize: function(attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  }
});