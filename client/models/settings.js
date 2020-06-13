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