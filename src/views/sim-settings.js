var app = require('ampersand-app');
var tests = require('./tests');
var ViewSwitcher = require('ampersand-view-switcher');
//Views
var View = require('ampersand-view');
var InputView = require('./input');
var DeterministicSettingsView = require('./deterministic-settings');
var StochasitcSettingsView = require('./stochastic-settings');

var template = require('../templates/includes/simSettings.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.endSim': {
      type: 'value',
      hook: 'end-sim-container'
    },
    'model.timeStep': {
      type: 'value',
      hook: 'time-units-container'
    }
  },
  events: {
    'change [data-hook=select]' : 'setSimTypeSettings'
  },
  initialize: function (args) {
    this.model = args.model;
    this.species = args.species;
  },
  update: function (e) {
  },
  render: function () {
    this.renderWithTemplate();
    this.advancedSettingsContainer = this.queryByHook('advanced-settings-container');
    this.simTypeSettingsViewSwitcher = new ViewSwitcher({
      el: this.advancedSettingsContainer,
    });
    this.deterministicSettingsView = new DeterministicSettingsView({
      model: this.model.deterministicSettings
    });
    this.stochasitcSettingsView = new StochasitcSettingsView({
      parent: this,
      model: this.model.stochasticSettings
    });
    this.simTypeSettingsViewSwitcher.set(this.stochasitcSettingsView);
  },
  subviews: {
    inputSimEnd: {
      hook: 'end-sim-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'end-sim',
          label: '0 to ',
          tests: tests.valueTests,
          modelKey: 'endSim',
          valueType: 'number',
          value: this.model.endSim
        });
      },
    },
    inputTimeUnit: {
      hook: 'time-units-container',
      prepareView: function (el) {
        return new InputView ({
          parent: this,
          required: true,
          name: 'time-units',
          label: 'store state every ',
          tests: tests.valueTests,
          modelKey: 'timeStep',
          valueTypes: 'number',
          value: this.model.timeStep
        });
      },
    },
  },
  setSimTypeSettings: function (e) {
    var simulationType = e.target.dataset.name;
    if(simulationType === 'deterministic'){
      this.simTypeSettingsViewSwitcher.set(this.deterministicSettingsView);
    }else{
      this.simTypeSettingsViewSwitcher.set(this.stochasitcSettingsView);
    }
  },
});