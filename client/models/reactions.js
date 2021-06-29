/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
  addReaction: function (reactionType, stoichArgs, types) {
    var id = this.parent.getDefaultID();
    var name = this.getDefaultName();
    var massaction = reactionType === 'custom-massaction';
    var reaction = new Reaction({
      compID: id,
      name: name,
      reactionType: reactionType,
      massaction: massaction,
      propensity: '',
      annotation: '',
      types: types,
      reactants: stoichArgs.reactants,
      products: stoichArgs.products,
    });
    this.setDefaultSpecieForStoichSpecies(reaction.reactants);
    this.setDefaultSpecieForStoichSpecies(reaction.products);
    if(reactionType !== 'custom-propensity')
      reaction.rate = this.getDefaultRate();
    reaction.buildSummary()
    this.add(reaction);
    this.parent.updateValid()
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
    this.parent.updateValid()
  },
  validateCollection: function () {
    for(var i = 0; i < this.length; i++) {
      if(!this.models[i].validateComponent()) {
        this.parent.error = {'id':this.models[i].compID,'type':'reaction'}
        return false
      }
    }
    return true
  }
});

Events.createEmitter(Reactions);

module.exports = Reactions;