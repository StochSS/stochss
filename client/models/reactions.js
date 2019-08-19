var _ = require('underscore');
var Events = require('ampersand-events');
//models
var Reaction = require('./reaction');
//collections
var Collection = require('ampersand-collection');

Reactions = Collection.extend({
  model: Reaction,
  initialize: function (attrs, options) {
    Collection.prototype.initialize.apply(this, arguments);
  },
  addReaction: function (reactionType, annotation, stoichArgs, subdomains) {
    var name = this.getDefaultName();
    var massaction = reactionType === 'custom-massaction';
    var reaction = new Reaction({
      name: name,
      reactionType: reactionType,
      annotation: annotation,
      massaction: massaction,
      propensity: '',
      subdomains: subdomains,
      reactants: stoichArgs.reactants,
      products: stoichArgs.products,
    });
    this.setDefaultSpecieForStoichSpecies(reaction.reactants);
    this.setDefaultSpecieForStoichSpecies(reaction.products);
    if(reactionType !== 'custom-propensity')
      reaction.rate = this.getDefaultRate();
    this.add(reaction);
    console.log(this.parent.parameters.length);
    return reaction;
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'r' + i;
    var names = this.map(function (reaction) {return reaction.name; });
    while(_.contains(names, name)){
      i += 1;
      name = 'r' + i;
    }
    return name;
  },
  setDefaultSpecieForStoichSpecies: function (stoichSpecies) {
    stoichSpecies.forEach(function (stoichSpecie) {
      stoichSpecie.specie = this.getDefaultSpecie();
    }, this);
  },
  getDefaultSpecie: function () {
    var specie = this.parent.species.at(0);
    return specie;
  },
  getDefaultRate: function () {
    var parameter = this.parent.parameters.at(0);
    return parameter;
  },
  removeReaction: function (reaction) {
    this.remove(reaction);
  },
});

Events.createEmitter(Reactions);

module.exports = Reactions;