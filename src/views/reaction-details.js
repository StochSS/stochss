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
var EditCustomStoichSpecieView = require('./edit-custom-stoich-specie')

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
  render: function () {
    var self = this;
    this.renderWithTemplate();
    this.form = new FormView({
      autoRender: true,
      model: this.model,
      el: this.queryByHook('reaction-details-container'),
      fields: function () {
        return [
          new SelectView({
            el: self.queryByHook('select-reaction-type'),
            label: 'Reaction type',
            name: 'reaction-type',
            required: true,
            idAttribute: 'cid',
            options: self.getReactionTypeLabels(),
            value: ReactionTypes[self.model.type].label,
          }),
          (this.model.type === 'custom-propensity') ?
          new InputView({
            el: self.queryByHook('select-rate-parameter'),
            parent: this,
            required: true,
            name: 'rate',
            label: 'Rate Parameter:',
            tests:'',
            modelKey:'propensity',
            valueType: 'string',
            value: this.model.propensity
          }) : new SelectView({
            el: self.queryByHook('select-rate-parameter'),
            label: 'Rate parameter:',
            name: 'rate',
            required: true,
            idAttribute: 'cid',
            textAttribute: 'name',
            eagerValidate: true,
            unselectedText: 'Pick a parameter',
            options: self.model.collection.parent.parameters,
            // For new reactions (with no rate.name) just use the first parameter in the Parameters collection
            // Else fetch the right Parameter from Parameters based on existing rate
            value: self.model.rate.name ? self.getRateFromParameters(self.model.rate.name) : self.model.collection.parent.parameters.at(0),
          })
        ];
      }
    });
    this.registerSubview(this.form);
    this.renderStoichSpeciesEditor();
  },
  renderStoichSpeciesEditor: function () {
    var args = {
      viewOptions: {
        name: 'stoich-specie',
        label: '',
        required: 'true',
        textAttribute: 'name',
        eagerValidate: true,
        // Set idAttribute to name. Models may not be saved yet so id is unreliable (so is cid).
        // Use name since it *should be* unique.
        idAttribute: 'name',
        options: this.model.collection.parent.species,
        unselectedText: 'Pick a species',
      }
    }
    var type = this.model.type;
    var StoichSpeciesView = (type === 'custom-propensity' || type === 'custom-massaction') ? EditCustomStoichSpecieView : EditStoichSpecieView
    this.form.renderCollection(
      this.model.reactants,
      StoichSpeciesView,
      this.queryByHook('reactants-editor'),
      args
    );
    this.form.renderCollection(
      this.model.products,
      StoichSpeciesView,
      this.queryByHook('products-editor'),
      args
    );
    //setup dom toggle binding
  },
  getReactionTypeLabels: function () {
    return _.map(ReactionTypes, function (val, key) { return val.label; })
  }

});
