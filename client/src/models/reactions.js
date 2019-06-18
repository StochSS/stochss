var Collection = require('ampersand-collection');
var Events = require('ampersand-events');
var Reaction = require('./reaction');

var Reactions = Collection.extend({
  model: Reaction,
});

Events.createEmitter(Reactions);

module.exports = Reactions;
