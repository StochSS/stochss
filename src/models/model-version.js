var Model = require('ampersand-model');
var Species = require('./species');
var Parameters = require('./parameters');
var Reactions = require('./reactions');

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
  session: {
    selectedReaction: 'object' // Reaction
  }
});
