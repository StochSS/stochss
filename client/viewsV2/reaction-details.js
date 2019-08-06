var _ = require('underscore');
var $ = require('jquery');
//config
var ReactionTypes = require('../reaction-types');
//models
var StoichSpecie = require('../modelsV2/stoich-specie');
//views
var View = require('ampersand-view');
var SelectView = require('ampersand-select-view');
var InputView = require('./input');
var ReactionSubdomainsView = require('./reaction-subdomains');
var ReactantProductView = require('./reactant-product');
//templates
var template = require('../templatesV2/includes/reactionDetails.pug');

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
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    var self = this; 
    this.model.on("change:reaction_type", function (model) {
      self.updateStoichSpeciesForReactionType(model.reactionType);
    });
    this.model.collection.parent.parameters.on('add remove', this.updateReactionTypeOptions, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var options = [];
    if(this.model.collection.parent.parameters.length <= 0){
      options = ["Custom propensity"];
    }
    else{
      options = this.getReactionTypeLabels();
    }
    var self = this;
    var reactionTypeSelectView = new SelectView({
      label: 'Reaction type',
      name: 'reaction-type',
      required: true,
      idAttribute: 'cid',
      options: options,
      value: ReactionTypes[self.model.reactionType].label,
    });
    var rateParameterView = new SelectView({
      label: 'Rate parameter:',
      name: 'rate',
      required: true,
      idAttribute: 'cid',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.model.collection.parent.parameters,
      // For new reactions (with no rate.name) just use the first parameter in the Parameters collection
      // Else fetch the right Parameter from Parameters based on existing rate
      value: this.model.rate.name ? this.getRateFromParameters(this.model.rate.name) : this.model.collection.parent.parameters.at(0),
    });
    var propensityView = new InputView({
      parent: this,
      required: true,
      name: 'rate',
      label: 'Propensity:',
      tests:'',
      modelKey:'propensity',
      valueType: 'string',
      value: this.model.propensity
    });
    var subdomainsView = new ReactionSubdomainsView({
      parent: this,
      isReaction: true,
    })
    var reactantsView = new ReactantProductView({
      collection: this.model.reactants,
      species: this.model.collection.parent.species,
      reactionType: this.model.reactionType,
      fieldTitle: 'Reactants',
      isReactants: true
    });
    var productsView = new ReactantProductView({
      collection: this.model.products,
      species: this.model.collection.parent.species,
      reactionType: this.model.reactionType,
      fieldTitle: 'Products',
      isReactants: false
    });
    this.registerRenderSubview(reactionTypeSelectView, 'select-reaction-type');
    (this.model.reactionType === 'custom-propensity') ? this.registerRenderSubview(propensityView, 'select-rate-parameter') :
     this.registerRenderSubview(rateParameterView, 'select-rate-parameter');
    this.registerRenderSubview(subdomainsView, 'subdomains-editor');
    this.registerRenderSubview(reactantsView, 'reactants-editor');
    this.registerRenderSubview(productsView, 'products-editor');
    this.totalRatio = this.getTotalReactantRatio();
    if(this.parent.collection.parent.is_spatial)
      $(this.queryByHook('subdomains-editor')).collapse();
  },
  update: function () {
  },
  updateValid: function () {
  },
  updateReactionTypeOptions: function () {
    this.render();
  },
  selectRateParam: function (e) {
    var val = e.target.selectedOptions.item(0).text;
    var param = this.getRateFromParameters(val);
    this.model.rate = param || this.model.rate;
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
    this.model.reactionType = type;
    this.updateStoichSpeciesForReactionType(type);
    this.model.collection.trigger("change");
    this.render();
  },
  updateStoichSpeciesForReactionType: function (type) {
    var args = this.parent.getStoichArgsForReactionType(type);
    var newReactants = this.getArrayOfDefaultStoichSpecies(args.reactants);
    var newProducts = this.getArrayOfDefaultStoichSpecies(args.products);
    this.model.reactants.reset(newReactants);
    this.model.products.reset(newProducts);
    if(type === 'custom-propensity')
      this.model.rate = {};
    else
      this.model.rate = this.model.collection.getDefaultRate();
  },
  getArrayOfDefaultStoichSpecies: function (arr) {
    return arr.map(function (params) {
      var stoichSpecie = new StoichSpecie(params);
      stoichSpecie.specie = this.parent.getDefaultSpecie();
      return stoichSpecie;
    }, this);
  },
  getReactionTypeLabels: function () {
    return _.map(ReactionTypes, function (val, key) { return val.label; })
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  getTotalReactantRatio: function () {
    return this.model.reactants.length;
  },
  updateSubdomains: function (element) {
    var subdomain = element.value.model;
    var checked = element.value.checked;

    if(checked)
      this.model.subdomains = _.union(this.model.subdomains, [subdomain.name]);
    else
      this.model.subdomains = _.difference(this.model.subdomains, [subdomain.name]);
  },
});