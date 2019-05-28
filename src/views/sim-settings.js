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
  events: {
    'change [data-hook=select]' : 'setSimTypeSettings'
  },
  render: function () {
    this.renderWithTemplate();
    this.advancedSettingsContainer = this.queryByHook('advanced-settings-container');
    this.simTypeSettingsViewSwitcher = new ViewSwitcher({
    	el: this.advancedSettingsContainer,
    });
    this.deterministicSettingsView = new DeterministicSettingsView();
    this.stochasitcSettingsView = new StochasitcSettingsView();
    this.simTypeSettingsViewSwitcher.set(this.deterministicSettingsView);
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
          modelKey: 'end-sim',
          valueType: 'number',
          value: '100'
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
          modelKey: 'time-units',
          valueTypes: 'number',
          value: '1.0'
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