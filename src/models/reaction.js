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
    massaction: 'boolean'
  },
  children: {
    rate: Parameter,
    //propensity: PropensityFunction
  },
  collections: {
    reactants: StoichSpecies,
    products: StoichSpecies,
  },
  session: {
    selected: {
      type: 'boolean',
      default: true
    }
  },
  derived: {
    type: {
      // The reaction type is not persisted to the database,
      // so we infer it based on the structure of reactants and products
      deps: ['massaction', 'reactants', 'products'],
      fn: function () {
        var numReactants = this.reactants.length;
        var numProducts = this.products.length;
        if (!this.massaction) {
          if (!numReactants) {
            return 'creation';
          }
          if (!numProducts) {
            return 'destruction';
          }
          if (numReactants === 1 && numProducts === 1) {
            var reactant = this.reactants.at(0);
            if (reactant.ratio === 1) {
              return 'change';
            } else { // ratio is 2
              return 'dimerization';
            }
          }
          if (numReactants === 2 && numProducts === 1) {
            return 'merge';
          }
          if (numReactants === 1 && numProducts === 2) {
            return 'split';
          }
          if (numReactants === 2 && numProducts === 2) {
            return 'four';
          }
        } else {
          // TODO handle case for custom mass action
          // Use defaults for new reactions (see reaction-types.js)
          // otherwise use what we got back from database
        }
      }
    }
  }
});
