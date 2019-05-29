var State = require('ampersand-state');
var StochasticSettings = require('./stochastic-settings');
var DeterministicSettings = require('./deterministic-settings');

module.exports = State.extend({
  props: {
    simType: {
      type: 'string',
      default: 'stochastic'
    },
    endSim: {
      type: 'number',
      default: 100
    },
    timeStep: {
      type: 'number',
      default: 1.0
    },
  },
  children: {
    stochasticSettings: StochasticSettings,
    deterministicSettings: DeterministicSettings
  }
});