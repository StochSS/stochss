var Model = require('ampersand-model');
var Species = require('./species');
var Parameters = require('./parameters');
var Reactions = require('./reactions');
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
    reactions: Reactions
  },
  children: {
    simSettings: SimulationSettings,
    meshSettings: MeshSettings
  },
  session: {
    selectedReaction: 'object' // Reaction
  }
});
