var SelectView = require('ampersand-select-view');

var template = require('../templates/includes/editCustomStoichSpecie.pug');

module.exports = SelectView.extend({
  // SelectView expects a string template, so pre-render it
  template: template(),
  bindings: {
    'model.ratio' : {
      hook: 'ratio'
    }
  },
  events: {
    'change select' : 'selectChangeHandler',
    'click [data-hook=increment]' : 'handleIncrement',
    'click [data-hook=decrement]' : 'handleDecrement',
    'click [data-hook=remove]' : 'deleteSpecie'
  },
  initialize: function () {
    SelectView.prototype.initialize.apply(this, arguments);
    this.value = this.model.specie || null;
  },
  selectChangeHandler: function (e) {
    var species = this.getSpeciesCollection();
    var reactions = this.getReactionsCollection();
    var specie = species.filter(function (m) {
      return m.name === e.target.selectedOptions.item(0).text;
    })[0];
    this.model.specie = specie;
    this.value = specie;
    // Trigger change on reactions to update inUse
    reactions.trigger("change");
  },
  getReactionsCollection: function () {
    return this.model.collection.parent.collection;
  },
  getSpeciesCollection: function () {
    // TODO there are a growing number of gnarly upward refs like this one;
    // there's probably a better way get this this via events, functions on parents, etc
    // Originally we had set reaction.species as a convenience reference,
    // perhaps that is the solution to return to.
    //
    //     this.(StoichSpecie).(StoichSpecies).(Reaction).(Reactions).(Version).species
    return this.model.collection.parent.collection.parent.species;
  },
  handleIncrement: function () {
    this.model.ratio++;
  },
  handleDecrement: function () {
    this.model.ratio > 1 ? this.model.ratio-- : this.model.ratio = 1;
  },
  deleteSpecie: function () {
    this.model.collection.remove(this.model);
    //TODO:  Remove the specie from the collection of reactants or products
  }
});

