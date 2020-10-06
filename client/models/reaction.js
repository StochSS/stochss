/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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
//models
var State = require('ampersand-state');
var Parameter = require('./parameter');
//collections
var StoichSpecies = require('./stoich-species');

module.exports = State.extend({
  props: {
    compID: 'number',
    name: 'string',
    reactionType: 'string',
    summary: 'string',
    massaction: 'boolean',
    propensity: 'string',
    annotation: 'string',
    subdomains: 'object'
  },
  children: {
    rate: Parameter
  },
  collections: {
    reactants: StoichSpecies,
    products: StoichSpecies
  },
  session: {
    selected: {
      type: 'boolean',
      default: true,
    },
    hasConflict: {
      type: 'boolean',
      default: false,
    },
  },
  initialize: function (attrs, options) {
    var self = this;
    State.prototype.initialize.apply(this, arguments);
    this.on('change-reaction', function () {
      self.buildSummary();
      self.checkModes();
    });
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
  checkModes: function () {
    var hasContinuous = false;
    var hasDynamic = false;
    var hasDiscrete = false;
    this.reactants.map(function (reactant) { 
      if(reactant.specie.mode === 'continuous' && !hasContinuous)
        hasContinuous = true;
      else if(reactant.specie.mode === 'dynamic' && !hasDynamic)
        hasDynamic = true;
      else if(reactant.specie.mode === 'discrete' && !hasDiscrete)
        hasDiscrete = true;
    });
    if(!hasContinuous || !hasDynamic) {
      this.products.map(function (product) { 
        if(product.specie.mode === 'continuous' && !hasContinuous)
          hasContinuous = true;
        else if(product.specie.mode === 'dynamic' && !hasDynamic)
          hasDynamic = true;
        else if(product.specie.mode === 'discrete' && !hasDiscrete)
        hasDiscrete = true;
      });
    }
    this.hasConflict = Boolean(hasContinuous && (hasDynamic || hasDiscrete))
  },
});