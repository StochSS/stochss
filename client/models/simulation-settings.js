var State = require('ampersand-state');
var StochasticSettings = require('./stochastic-settings');
var DeterministicSettings = require('./deterministic-settings');

module.exports = State.extend({
  props: {
    is_stochastic: {
      type: 'boolean',
      default: true
    },
    endSim: {
      type: 'number',
      default: 20
    },
    timeStep: {
      type: 'number',
      default: 0.05
    },
  },
  children: {
    stochasticSettings: StochasticSettings,
    deterministicSettings: DeterministicSettings
  }
});