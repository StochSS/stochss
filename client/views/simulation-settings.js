var ViewSwitcher = require('ampersand-view-switcher');
var $ = require('jquery');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var DeterministicSettingsView = require('./deterministic-settings');
var StochasticSettingsView = require('./stochastic-settings');
//templates
var template = require('../templates/includes/simulationSettings.pug');

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
    'click [data-hook=collapse]' :  'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.model = attrs.model;
    this.species = attrs.species;
    this.deterministicSettingsView = new DeterministicSettingsView({
      parent: this,
      model: this.model.deterministicSettings
    });
    this.stochasitcSettingsView = new StochasticSettingsView({
      parent: this,
      model: this.model.stochasticSettings
    });
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
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
  update: function (e) {
  },
  updateValid: function () {
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
          valueType: 'number',
          value: this.model.timeStep
        });
      },
    },
  },
});