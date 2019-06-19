var State = require('ampersand-state');
var Species = require('./species');
var StoichSpecies = require('./stoich-species');
var Parameter = require('./parameter');
var Parameters = require('./parameters');

module.exports = State.extend({
  props: {
    id: 'number',
    name:  'string',
    annotation: 'string',
    // True indicates a custom mass action equation
    massaction: 'boolean',
    type: 'string',
    propensity: 'string',
    subdomains: {
      type: 'object',
      default: function () { return []; }
    }
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
      default: true
    },
  },

});
