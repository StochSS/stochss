var State = require('ampersand-state');
var StochasticSettings = require('./stochastic-settings');
var DeterministicSettings = require('./deterministic-settings');

module.exports = State.extend({
  props: {
    simType: 'string',
    endSim: 'number',
    timeStep: 'number'
  },
  children: {
    stochasticSettings: StochasticSettings,
    deterministicsSettings: DeterministicSettings
  }
});