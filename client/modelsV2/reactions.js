var _ = require('underscore');
//models
var Reaction = require('./reaction');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Reaction,
  initialize: function (attrs, options) {
    Collection.prototype.initialize.apply(this, arguments);
    this.on('add remove', _.bind(this.triggerChange, this));
  },
  triggerChange: function () {
    this.baseModel = this.parent;

    this.baseModel.species.trigger('stoich-specie-change');
    this.baseModel.parameters.trigger('reaction-rate-change');
    this.trigger('change');
  },
  addReaction: function (reactionType, annotation, stoichArgs, subdomains) {
    var name = getDefaultName();
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
    reaction.rate = getDefaultRate();
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'r' + 1;
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