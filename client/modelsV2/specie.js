var _ = require('underscore');
//models
var State = require('ampersand-state');
//var InitialCondition = require('./initial-condition');

module.exports = State.extend({
  props: {
    name: 'string',
    value: 'number',
    mode: 'string',
    diffusionCoeff: 'number',
    subdomains: {
      type: 'object',
      default: function() {return []; }
    },
  },
  children: {
    //initialCondition: InitialCondition
  },
  session: {
    inUse: {
      type: 'boolean',
      default: false,
    },
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  setInUseListener: function () {
    this.listenTo(this.collection, 'stoich-specie-change', _.bind(this.updateInUse, this));
  },
  updateInUse: function () {
    var model = this;
    var baseModel = this.collection.parent;
    var isSpecieNotInUse = function (stoichSpecie) { return stoichSpecie.specie != model; }

    this.inUse = !baseModel.reactions.every(
      function (reaction) {
        return reaction.reactants.every(isSpecieNotInUse) && reaction.products.every(isSpecieNotInUse);
      });
  },
});