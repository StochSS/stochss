var app = require('ampersand-app');
var tests = require('./tests');
var ViewSwitcher = require('ampersand-view-switcher');
var $ = require('jquery');
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
    'change [data-hook=select-deterministic]' : 'setSimTypeSettings',
    'change [data-hook=select-stochastic]' : 'setSimTypeSettings',
    'click [data-hook=collapse]' :  'changeCollapseButtonText'
  },
  initialize: function (args) {
    this.model = args.model;
    this.species = args.species;
    this.deterministicSettingsView = new DeterministicSettingsView({
      parent: this,
      model: this.model.deterministicSettings
    });
    this.stochasitcSettingsView = new StochasitcSettingsView({
      parent: this,
      model: this.model.stochasticSettings
    });
  },
  update: function (e) {
  },
  render: function () {
    this.renderWithTemplate();
    this.advancedSettingsContainer = this.queryByHook('advanced-settings-container');
    this.simTypeSettingsViewSwitcher = new ViewSwitcher({
      el: this.advancedSettingsContainer,
    });
    this.model.is_stochastic ?
      this.simTypeSettingsViewSwitcher.set(this.stochasitcSettingsView) :
      this.simTypeSettingsViewSwitcher.set(this.deterministicSettingsView);
    this.model.is_stochastic ?
      $(this.queryByHook('select-stochastic')).prop('checked', true) : 
      $(this.queryByHook('select-deterministic')).prop('checked', true);
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
    this.model.is_stochastic = (simulationType === 'stochastic');
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  }
});