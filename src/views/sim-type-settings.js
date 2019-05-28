var app = require('ampersand-app');
var ViewSwitcher = require('ampersand-view-switcher');
//Views
var View = require('ampersand-view');
var DeterministicSettingsView = require('./deterministic-settings');
var StochasitcSettingsView = require('./stochastic-settings');

var template = require('../templates/includes/simTypeSettings.pug');

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
    this.deterministicSettingsView = new DeterministicSettingsView()
    this.stochasitcSettingsView = new StochasitcSettingsView()
    this.simTypeSettingsViewSwitcher.set(this.deterministicSettingsView)
  },
  setSimTypeSettings: function (e) {
	  var simulationType = e.target.dataset.name
	  if(simulationType === 'deterministic'){
      this.simTypeSettingsViewSwitcher.set(this.deterministicSettingsView);
	  }else{
	  	this.simTypeSettingsViewSwitcher.set(this.stochasitcSettingsView);
	  }
  },
});