var app = require('ampersand-app');
var tests = require('./tests');
var $ = require('jquery');
//Views
var View = require('ampersand-view');
var InputView = require('./input');

var template = require('../templates/includes/deterministicSettings.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.relativeTolerance': {
      type: 'value',
      hook: 'relative-tolerance-container'
    },
    'model.absoluteTolerance': {
      type: 'value',
      hook: 'absolute-tolerance-container'
    }
  },
  events: {
    'click [data-hook=advanced-settings-button]' : 'toggleAdvancedSettings'
  },
  render: function () {
    View.prototype.render.apply(this);
    if(this.model.isAdvancedSettingsOpen)
      $(this.queryByHook('advanced-settings')).collapse();
  },
  update: function (e) {
  },
  subviews: {
    inputRelativeTolerance: {
      hook: 'relative-tolerance-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'relative-tolerance',
          label: 'Relative tolerance of the ODE solver (CVODES).  Valid valeus must be greater than 0.0:  ',
          tests: tests.valueTests,
          modelKey: 'relativeTolerance',
          valueType: 'number',
          value: this.model.relativeTolerance
        });
      },
    },
    inputAbsoluteTolerance: {
      hook: 'absolute-tolerance-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'absolute-tolerance',
          label: 'Absolute Tolerance of the ODE solver (CVODES).  Valid values must be greater than 0.0:  ',
          tests: tests.valueTests,
          modelKey: 'absoluteTolerance',
          valueType: 'number',
          value: this.model.absoluteTolerance
        });
      }
    }
  },
  toggleAdvancedSettings: function (e) {
    this.model.isAdvancedSettingsOpen ? this.setIsAdvancedSettingsOpen(false) : this.setIsAdvancedSettingsOpen(true);
  },
  setIsAdvancedSettingsOpen: function (value) {
    this.model.isAdvancedSettingsOpen = value;
    this.parent.model.stochasticSettings.isAdvancedSettingsOpen = value;
  }
});