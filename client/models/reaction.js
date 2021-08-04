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
    types: 'object'
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
    if(!this.reactionType.startsWith('custom')) {
      let reactionType = this.updateReactionType();
      if(this.reactionType !== reactionType){
        this.reactionType = reactionType
        this.buildSummary()
      }
    }
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
  updateReactionType: function () {
    let numReactants = this.reactants.length
    let numProducts = this.products.length
    let prodRatio1 = numProducts > 0 ? this.products.models[0].ratio : 0
    if(numReactants == 0 && numProducts == 1 && prodRatio1 == 1) return "creation";

    let reactRatio1 = numReactants > 0 ? this.reactants.models[0].ratio : 0
    let prodRatio2 = numProducts > 1 ? this.products.models[1].ratio : 0
    if(numReactants == 1){
      if(reactRatio1 == 1) {
        if(numProducts == 0) return "destruction";
        if(numProducts == 2 && prodRatio1 == 1 && prodRatio2 == 1) return "split";
      }
      
      if(numProducts == 1 && prodRatio1 == 1){
        if(reactRatio1 == 1) return "change";
        if(reactRatio1 == 2) return "dimerization";
      }
    }

    let reactRatio2 = numReactants > 1 ? this.reactants.models[1].ratio : 0
    if(numReactants == 2 && reactRatio1 == 1 && reactRatio2 == 1){
      if(numProducts == 1 && prodRatio1 == 1) return "merge";
      if(numProducts == 2 && prodRatio1 == 1 && prodRatio2 == 1) return "four";
    }
    return "custom-massaction"
  },
  validateComponent: function () {
    if(!this.name.trim() || this.name.match(/^\d/)) return false;
    if((!/^[a-zA-Z0-9_]+$/.test(this.name))) return false;
    if(!this.propensity.trim() && this.reactionType === "custom-propensity") return false;
    if(this.reactionType.startsWith('custom')) {
      if(this.reactants.length <= 0 && this.products.length <= 0) return false;
    }
    return true;
  }
});