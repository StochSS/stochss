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
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
    this.on('change-reaction', this.buildAnnotation, this)
  },
  buildAnnotation: function () {
    var annotation = "";

    var numReactants = this.reactants.models.length;
    var numProducts = this.products.models.length;

    if(numReactants === 0){
      annotation = '\\emptyset';
    }else{
      for(var i = 0; i < numReactants; i++){
        var reactant = this.reactants.models[i];
        if(reactant.ratio > 1){
          annotation += reactant.ratio + reactant.specie.name;
        }else{
          annotation += reactant.specie.name;
        }

        if(i < numReactants - 1){
          annotation += '+';
        }
      }
    }

    annotation += ' \\rightarrow ';

    if(numProducts === 0){
      annotation += '\\emptyset';
    }else{
      for(var i = 0; i < numProducts; i++){
        var product = this.products.models[i];
        if(product.ratio > 1){
          annotation += product.ratio + product.specie.name;
        }else{
          annotation += product.specie.name;
        }

        if(i < numProducts - 1){
          annotation += '+';
        }
      }
    }
    
    this.annotation = annotation
  },
});