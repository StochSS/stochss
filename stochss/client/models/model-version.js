var Model = require('ampersand-model');
var Species = require('./species');
var Parameters = require('./parameters');
var Reactions = require('./reactions');
var RateRules = require('./rate-rules');
var SimulationSettings = require('./simulation-settings');
var MeshSettings = require('./mesh-settings');

module.exports = Model.extend({
  props: {
    id: 'number',
    version: {
      type: 'number',
      default: 1
    },
  },
  collections: {
    species: Species,
    parameters: Parameters,
    reactions: Reactions,
    rateRules: RateRules
  },
  children: {
    simSettings: SimulationSettings,
    meshSettings: MeshSettings
  },
  session: {
    selectedReaction: 'object' // Reaction
  }
});
