var _ = require('underscore');
//models
var State = require('ampersand-state');
var Parameter = require('./parameter');
//collections
var StoichSpecies = require('./stoich-species');

module.exports = State.extend({
  props: {
    name: 'string',
    reactionType: 'string',
    annotation: 'string',
    massaction: 'boolean',
    propensity: 'string',
    subdomains: {
      type: 'object',
      default: function () {return []; },
    },
  },
  children: {
    rate: Parameter,
  },
  collections: {
    reactants: StoichSpecies,
    products: StoichSpecies,
  },
  session: {
    selected: {
      type: 'boolean',
      default: true,
    },
  },
  triggerReaction: function () {
    this.collection.parent.parameters.trigger('reaction-rate-change');
  },
  triggerChange: function () {
    this.trigger('change:reactants');
    this.trigger('change:products');
    this.collection.parent.species.trigger('stoich-specie-change');
    this.trigger('change');
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
    this.on('change:rate', _.bind(this.triggerReaction, this))

    this.listenTo(this.reactants, 'add change remove', this.triggerChange);
    this.listenTo(this.products, 'add change remove', this.triggerChange);
  },
});