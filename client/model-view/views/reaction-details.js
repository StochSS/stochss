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

let $ = require('jquery');
let katex = require('katex');
let _ = require('underscore');
//support files
let app = require('../../app');
let ReactionTypes = require('../../reaction-types');
//models
let StoichSpecie = require('../../models/stoich-specie');
//views
let InputView = require('../../views/input');
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
let ReactionTypesView = require('./reaction-types');
let ReactantProductView = require('./reactant-product');
//templates
let template = require('../templates/reactionDetails.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.propensity': {
      type: 'value',
      hook: 'select-rate-parameter'
    },
    'model.summary' : {
      type: function (el, value, previousValue) {
        katex.render(this.model.summary, this.queryByHook('summary-container'), {
          displayMode: true,
          output: 'html'
        });
      },
      hook: 'summary-container',
    },
    'model.hasConflict': {
      type: function (el, value, previousValue) {
        if(value) {
          $(this.queryByHook('conflicting-modes-message')).collapse('show');
        }else{
          $(this.queryByHook('conflicting-modes-message')).collapse('hide');
        }
      },
      hook: 'conflicting-modes-message'
    }
  },
  events: {
    'change [data-hook=select-rate-parameter]' : 'selectRateParam',
    'change [data-hook=select-reaction-type]'  : 'selectReactionType'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    let self = this; 
    this.model.on("change:reaction_type", function (model) {
      self.updateStoichSpeciesForReactionType(model.reactionType);
    });
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    let self = this;
    this.renderReactionTypesSelectView();
    if(this.model.reactionType === 'custom-propensity'){
      let propensityView = new InputView({
        parent: this,
        required: true,
        name: 'rate',
        modelKey:'propensity',
        valueType: 'string',
        value: this.model.propensity,
        placeholder: "--No Expression Entered--"
      });
      app.registerRenderSubview(this, propensityView, 'select-rate-parameter');
      $(this.queryByHook('rate-parameter-label')).text('Propensity:');
      $(this.queryByHook('rate-parameter-tooltip')).prop('title', this.parent.tooltips.propensity);
    }else{
      // make sure the reaction has a rate and that rate exists in the parameters collection
      let paramIDs = this.model.collection.parent.parameters.map(function (param) {
        return param.compID;
      });
      if(!this.model.rate.compID || !paramIDs.includes(this.model.rate.compID)) {
        this.model.rate = this.model.collection.getDefaultRate();
      }
      let rateParameterView = new SelectView({
        name: 'rate',
        required: true,
        idAttribute: 'cid',
        textAttribute: 'name',
        eagerValidate: true,
        options: this.model.collection.parent.parameters,
        // For new reactions (with no rate.name) just use the first parameter in the Parameters collection
        // Else fetch the right Parameter from Parameters based on existing rate
        value: this.model.rate.name ? this.getRateFromParameters(this.model.rate.name) : this.model.collection.parent.parameters.at(0)
      });
      app.registerRenderSubview(this, rateParameterView, 'select-rate-parameter');
      $(this.queryByHook('rate-parameter-label')).text('Rate Parameter:');
      $(this.queryByHook('rate-parameter-tooltip')).prop('title', this.parent.tooltips.rate);
    }
    let reactantsView = new ReactantProductView({
      collection: this.model.reactants,
      species: this.model.collection.parent.species,
      reactionType: this.model.reactionType,
      fieldTitle: 'Reactants',
      isReactants: true
    });
    app.registerRenderSubview(this, reactantsView, 'reactants-editor');
    let productsView = new ReactantProductView({
      collection: this.model.products,
      species: this.model.collection.parent.species,
      reactionType: this.model.reactionType,
      fieldTitle: 'Products',
      isReactants: false
    });
    app.registerRenderSubview(this, productsView, 'products-editor');
    if(this.model.collection.parent.is_spatial) {
      let typesView = new ReactionTypesView({
        model: this.model,
        parent: this
      });
      app.registerRenderSubview(this, typesView, 'domain-types-editor');
    }
    this.totalRatio = this.getTotalReactantRatio();
    app.tooltipSetup();
    this.toggleCustomReactionError();
  },
  getArrayOfDefaultStoichSpecies: function (arr) {
    return arr.map(function (params) {
      let stoichSpecie = new StoichSpecie(params);
      stoichSpecie.specie = this.parent.getDefaultSpecie();
      return stoichSpecie;
    }, this);
  },
  getRateFromParameters: function (name) {
    // Seems like model.rate is not actually part of the Parameters collection
    // Get the Parameter from Parameters that matches model.rate
    // TODO this is some garbagio, get model.rate into Parameters collection...?
    if (!name)  { name = this.model.rate.name };
    let rate = this.model.collection.parent.parameters.filter(function (param) {
      return param.name === name;
    })[0];
    return rate;
  },
  getReactionTypeLabels: function () {
    return _.map(ReactionTypes, function (val, key) { return val.label; });
  },
  getTotalReactantRatio: function () {
    return this.model.reactants.length;
  },
  renderReactionTypes: function () {
    if(this.model.collection.parent.parameters.length < 1){ return };
    let options = {
      displayMode: true,
      output: 'html'
    }
    katex.render(ReactionTypes['creation'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['0'], options);
    katex.render(ReactionTypes['destruction'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['1'], options);
    katex.render(ReactionTypes['change'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['2'], options);
    katex.render(ReactionTypes['dimerization'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['3'], options);
    katex.render(ReactionTypes['merge'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['4'], options);
    katex.render(ReactionTypes['split'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['5'], options);
    katex.render(ReactionTypes['four'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['6'], options);
  },
  renderReactionTypesSelectView: function () {
    if(this.reactionTypesSelectView) {
      this.reactionTypesSelectView.remove();
    }
    if(this.model.collection.parent.parameters.length <= 0){
      var options = ["Custom propensity"];
    }
    else{
      var options = this.getReactionTypeLabels();
    }
    this.reactionTypesSelectView = new SelectView({
      label: 'Reaction Type:',
      name: 'reaction-type',
      required: true,
      idAttribute: 'cid',
      options: options,
      value: ReactionTypes[this.model.reactionType].label
    });
    app.registerRenderSubview(this, this.reactionTypesSelectView, 'select-reaction-type');
    this.renderReactionTypes();
  },
  selectRateParam: function (e) {
    if(this.model.reactionType !== 'custom-propensity') {
      let val = e.target.selectedOptions.item(0).text;
      let param = this.getRateFromParameters(val);
      this.model.rate = param || this.model.rate;
      this.model.trigger("change");
      this.model.collection.trigger("change");
    }
  },
  selectReactionType: function (e) {
    let label = e.target.selectedOptions.item(0).value;
    let type = _.findKey(ReactionTypes, function (o) { return o.label === label; });
    this.model.reactionType = type;
    this.model.summary = label;
    this.updateStoichSpeciesForReactionType(type);
    this.model.collection.trigger("change");
    this.model.trigger('change-reaction');
    this.render();
  },
  toggleCustomReactionError: function () {
    let errorMsg = $(this.queryByHook("custom-reaction-error"));
    if(this.model.reactants.length <= 0 && this.model.products.length <= 0) {
      errorMsg.addClass('component-invalid');
      errorMsg.removeClass('component-valid');
    }else{
      errorMsg.addClass('component-valid');
      errorMsg.removeClass('component-invalid');
    }
  },
  update: function () {},
  updateStoichSpeciesForReactionType: function (type) {
    let args = this.parent.getStoichArgsForReactionType(type);
    let newReactants = this.getArrayOfDefaultStoichSpecies(args.reactants);
    let newProducts = this.getArrayOfDefaultStoichSpecies(args.products);
    this.model.reactants.reset(newReactants);
    this.model.products.reset(newProducts);
    if(type !== 'custom-propensity')
      this.model.rate = this.model.collection.getDefaultRate();
  },
  updateValid: function () {}
});