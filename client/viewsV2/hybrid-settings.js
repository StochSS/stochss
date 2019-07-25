var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
var EditSpecieModeView = require('./edit-specie-mode');
var RateRulesView = require('./rate-rules-editor');
//templates
var template = require('../templatesV2/includes/hybridSettings.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.seed': {
      type: 'value',
      hook: 'seed-container'
    },
    'model.tauTol': {
      type: 'value',
      hook: 'tau-tolerance-container'
    },
    'model.switchTol': {
      type: 'value',
      hook: 'switching-tolerance-container'
    },
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    var self = this;
    View.prototype.render.apply(this);
    var args = {
      viewOptions: {
        name: 'specie-mode',
        label: '',
        require: true,
        textAttribute: 'mode',
        eagerValidate: true,
        idAttribute: 'mode',
        options: ['continuous', 'discrete', 'dynamic'],
        value: ''
      },
    };
    this.renderCollection(
      this.parent.parent.species,
      EditSpecieModeView,
      this.queryByHook('specie-mode-container'),
      args
    );
  },
  update: function () {
  },
  updateValid: function () {
  },
  subviews: {
    inputSeed: {
      hook: 'seed-container',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'seed',
          label: 'Seed the random number generator (set to -1 for a random seed): ',
          tests: '',
          modelKey: 'seed',
          valueType: 'number',
          value: this.model.seed
        });
      },
    },
    inputTauTolerance: {
      hook: 'tau-tolerance-container',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'Tau-Tolerance',
          label: 'Set the tau-tolerance (valid value must be between 0.0 and 1.0): ',
          tests: tests.valueTests,
          modelKey: 'tauTol',
          valueType: 'number',
          value: this.model.tauTol
        });
      },
    },
    inputSwitchingTolerance: {
      hook: 'switching-tolerance-container',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'Switching Tolerance',
          label: 'Set the switching tolerance (valid values must be between 0.0 and 1.0): ',
          tests: tests.valueTests,
          modelKey: 'switchTol',
          valueType: 'number',
          value: this.model.switchTol
        });
      },
    },
    rateRules: {
      selector: '[data-hook=rate-rules-container]',
      waitFor: 'model',
      prepareView: function (el) {
        return new RateRulesView({
          parent: this,
          collection: this.model.parent.parent.parent.rateRules,
          species: this.model.parent.parent.parent.species
        });
      },
    },
  },
});