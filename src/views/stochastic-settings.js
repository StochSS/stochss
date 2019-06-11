var app = require('ampersand-app');
var tests = require('./tests');
var ViewSwitcher = require('ampersand-view-switcher');
var $ = require('jquery');
//Views
var View = require('ampersand-view');
var InputView = require('./input');
var SSASettingsView = require('./ssa-settings');
var TauSettingsView = require('./tau-leaping-settings');
var HybridSettingsView = require('./hybrid-tau-settings');

var template = require('../templates/includes/stochasticSettings.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.realizations': {
      type: 'value',
      hook: 'realizations-container'
    }
  },
  events: {
    'change [data-hook=algorithm-select]' : 'setStochasticAlgorithm',
    'click [data-hook=advanced-settings-button]' : 'toggleAdvancedSettings'
  },
  initialize: function () {
    this.ssaSettingsView = new SSASettingsView ({
      model: this.model.ssaSettings
    });
    this.tauSettingsView = new TauSettingsView ({
      model: this.model.tauLeapingSettings
    });
    this.hybridSettingsView = new HybridSettingsView ({
      parent: this,
      model: this.model.hybridTauSettings
    });
  },
  update: function (e) {
  },
  render: function () {
    View.prototype.render.apply(this);
    this.algorithmSettingsContainer = this.queryByHook('algorithm-settings-container');
    this.algorithmSettingsViewSwitcher = new ViewSwitcher({
      el: this.algorithmSettingsContainer,
    });
    this.algorithmSettingsViewSwitcher.set(this.ssaSettingsView);
    if(this.model.isAdvancedSettingsOpen)
      $(this.queryByHook('advanced-settings')).collapse();
  },
  subviews: {
    inputRealizations: {
      hook: 'realizations-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'realizations',
          label: 'Number of realizations in this ensemble:  ',
          tests: tests.valueTests,
          modelKey: 'realizations',
          valueType: 'number',
          value: this.model.realizations
        });
      }
    }
  },
  setStochasticAlgorithm: function (e) {
    var algorithm = e.target.dataset.name;
    this.model.algorithm = algorithm;
    if(algorithm === 'Tau-Leaping')
      this.algorithmSettingsViewSwitcher.set(this.tauSettingsView);
    else if(algorithm === 'Hybrid-Tau-Leaping')
      this.algorithmSettingsViewSwitcher.set(this.hybridSettingsView);//throws an error
    else
      this.algorithmSettingsViewSwitcher.set(this.ssaSettingsView);
  },
  toggleAdvancedSettings: function (e) {
    this.model.isAdvancedSettingsOpen ? this.openCloseAdvancedSettings(false) : this.openCloseAdvancedSettings(false);
  },
  openCloseAdvancedSettings: function (value) {
    this.model.isAdvancedSettingsOpen = value;
    this.parent.model.deterministicSettings.isAdvancedSettingsOpen = value;
  }
});