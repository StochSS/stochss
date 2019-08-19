var _ = require('underscore');
//models
var StoichSpecie = require('./stoich-specie');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: StoichSpecie,
  initialize: function (attrs, options) {
    Collection.prototype.initialize.apply(this, arguments);
    this.on('add remove', _.bind(this.triggerChange, this));
  },
  triggerChange: function () {
    this.baseModel = this.parent.collection.parent;
    this.baseModel.species.trigger('stoich-species-change');
  },
  addStoichSpecie: function (specieName) {
    var specie = this.parent.collection.parent.species.filter(function (specie) {
        return specie.name === specieName;
    })[0];
    var stoichSpecie = new StoichSpecie({
        ratio: 1
    });
    stoichSpecie.specie = specie;
    this.add(stoichSpecie);
  },
  removeStoichSpecie: function (stoichSpecie) {
    stoichSpecie.stopListening();
    this.remove(stoichSpecie);
  },
});