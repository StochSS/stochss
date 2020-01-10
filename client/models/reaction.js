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
    summary: 'string',
    massaction: 'boolean',
    propensity: 'string',
    annotation: 'string',
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
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
    this.on('change-reaction', this.buildSummary, this)
  },
  buildSummary: function () {
    var summary = "";

    var numReactants = this.reactants.models.length;
    var numProducts = this.products.models.length;

    if(numReactants === 0){
      summary = '\\emptyset';
    }else{
      for(var i = 0; i < numReactants; i++){
        var reactant = this.reactants.models[i];
        if(reactant.ratio > 1){
          summary += reactant.ratio + reactant.specie.name;
        }else{
          summary += reactant.specie.name;
        }

        if(i < numReactants - 1){
          summary += '+';
        }
      }
    }

    summary += ' \\rightarrow ';

    if(numProducts === 0){
      summary += '\\emptyset';
    }else{
      for(var i = 0; i < numProducts; i++){
        var product = this.products.models[i];
        if(product.ratio > 1){
          summary += product.ratio + product.specie.name;
        }else{
          summary += product.specie.name;
        }

        if(i < numProducts - 1){
          summary += '+';
        }
      }
    }
    
    summary = summary.replace(/_/g, '\\_');

    this.summary = summary
  },
});