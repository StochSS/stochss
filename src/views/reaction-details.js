var _ = require('underscore');
var domify = require('domify');
var View = require('ampersand-view');
var FormView = require('ampersand-form-view');
var SelectView = require('ampersand-select-view');
var InputView = require('./input');
// Config
var ReactionTypes = require('../reaction-types');
var tests = require('./tests');
// Models
var StoichSpecie = require('../models/stoich-specie');
var StoichSpecies = require('../models/stoich-species');
// Views
var EditStoichSpecieView = require('./edit-stoich-specie');
var EditCustomStoichSpecieView = require('./edit-custom-stoich-specie');
var CustomAddReactantProductView = require('./custom-add-reactant-product');

var template = require('../templates/includes/reactionDetails.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.propensity': {
      type: 'value',
      hook: 'select-rate-parameter'
    }
  },
  events: {
    'change [data-hook=select-rate-parameter]' : 'selectRateParam',
    'change [data-hook=select-reaction-type]'  : 'selectReactionType',
  },
  subviews: {
    reactionTypeSelectView: {
      hook: 'select-reaction-type',
      prepareView: function (el) {
        return new SelectView({
          label: 'Reaction type',
          name: 'reaction-type',
          required: true,
          idAttribute: 'cid',
          options: this.getReactionTypeLabels(),
          value: ReactionTypes[this.model.type].label,
        });
      }
    },
    rateParameterView: {
      hook: 'select-rate-parameter',
      prepareView: function (el) {
        if (this.model.type === 'custom-propensity') 
          return new InputView({
            parent: this,
            required: true,
            name: 'rate',
            label: 'Propensity:',
            tests:'',
            modelKey:'propensity',
            valueType: 'string',
            value: this.model.propensity
          });
        else
          return new SelectView({
            label: 'Rate parameter:',
            name: 'rate',
            required: true,
            idAttribute: 'cid',
            textAttribute: 'name',
            eagerValidate: true,
            unselectedText: 'Pick a parameter',
            options: this.model.collection.parent.parameters,
            // For new reactions (with no rate.name) just use the first parameter in the Parameters collection
            // Else fetch the right Parameter from Parameters based on existing rate
            value: this.model.rate.name ? this.getRateFromParameters(this.model.rate.name) : this.model.collection.parent.parameters.at(0),
          });
      }
    },
    reactantsView:{
      hook: 'reactants-editor',
      prepareView: function (el) {
        return new CustomAddReactantProductView({
          collection: this.model.reactants,
          species: this.model.collection.parent.species,
          reactionType: this.model.type,
          fieldTitle: 'Reactants'
        });
      },
    },
    productsView: {
      hook: 'products-editor',
      prepareView: function (el) {
        return new CustomAddReactantProductView({
          collection: this.model.products,
          species: this.model.collection.parent.species,
          reactionType: this.model.type,
          fieldTitle: 'Products'
        });
      },
    }
  },
  initialize: function () {
    var self = this; 
    this.model.on("change:type", function (model) {
      self.updateStoichSpeciesForReactionType(model.type);
    });
  },
  updateStoichSpeciesForReactionType: function (type) {
    var args = this.parent.getStoichArgsForReactionType(type);
    var newReactants = this.getArrayOfDefaultStoichSpecies(args.reactants);
    var newProducts = this.getArrayOfDefaultStoichSpecies(args.products);
    this.model.reactants.reset(newReactants);
    this.model.products.reset(newProducts);
  },
  getArrayOfDefaultStoichSpecies: function (arr) {
    return arr.map(function (params) {
      var stoichSpecie = new StoichSpecie(params);
      stoichSpecie.specie = this.parent.getDefaultSpecie();
      return stoichSpecie;
    }, this);
  },
  selectRateParam: function (e) {
    var val = e.target.selectedOptions.item(0).text;
    var param = this.getRateFromParameters(val);
    this.model.rate = param || this.model.rate;
    // Trigger change event to update species, params in use
    this.model.collection.trigger("change");
  },
  getRateFromParameters: function (name) {
    // Seems like model.rate is not actually part of the Parameters collection
    // Get the Parameter from Parameters that matches model.rate
    // TODO this is some garbagio, get model.rate into Parameters collection...?
    if (!name)  { name = this.model.rate.name } 
    var rate = this.model.collection.parent.parameters.filter(function (param) {
      return param.name === name;
    })[0];
    return rate 
  },
  selectReactionType: function (e) {
    var label = e.target.selectedOptions.item(0).value;
    var type = _.findKey(ReactionTypes, function (o) { return o.label === label; });
    this.model.type = type;
    this.updateStoichSpeciesForReactionType(type);
    this.render();
  },
  getReactionTypeLabels: function () {
    return _.map(ReactionTypes, function (val, key) { return val.label; })
  }

});
