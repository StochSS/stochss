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
    'change [data-hook=ssa-select]' : 'getStochasticAlgorithm',
    'change [data-hook=tau-leaping-select]' : 'getStochasticAlgorithm',
    'change [data-hook=hybrid-tau-leaping-select]' : 'getStochasticAlgorithm',
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
    this.setStochasticAlgorithm(this.model.algorithm);
    if(this.model.isAdvancedSettingsOpen){
      $(this.queryByHook('advanced-settings')).collapse();
      $(this.queryByHook('advanced-settings-button')).text('-');
    }
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
  getStochasticAlgorithm: function (e) {
    var algorithm = e.target.dataset.name;
    this.setStochasticAlgorithm(algorithm);
  },
  setStochasticAlgorithm: function (algorithm) {
    this.model.algorithm = algorithm;
    if(algorithm === 'Tau-Leaping'){
      this.algorithmSettingsViewSwitcher.set(this.tauSettingsView);
      $(this.queryByHook('tau-leaping-select')).prop('checked', true);
    }
    else if(algorithm === 'Hybrid-Tau-Leaping'){
      this.algorithmSettingsViewSwitcher.set(this.hybridSettingsView);
      $(this.queryByHook('hybrid-tau-leaping-select')).prop('checked', true);
    }
    else{
      this.algorithmSettingsViewSwitcher.set(this.ssaSettingsView);
      $(this.queryByHook('ssa-select')).prop('checked', true);
    }
  },
  toggleAdvancedSettings: function (e) {
    if(this.model.isAdvancedSettingsOpen) {
      this.openCloseAdvancedSettings(false)
      $(this.queryByHook('advanced-settings-button')).text('+');
    } else {
      this.openCloseAdvancedSettings(true);
      $(this.queryByHook('advanced-settings-button')).text('-');
    }
  },
  openCloseAdvancedSettings: function (value) {
    this.model.isAdvancedSettingsOpen = value;
    this.parent.model.deterministicSettings.isAdvancedSettingsOpen = value;
  }
});