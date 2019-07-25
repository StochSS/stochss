var $ = require('jquery');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
//templates
var template = require('../templatesV2/includes/deterministicSettings.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.relativeTol': {
      type: 'value',
      hook: 'relative-tolerance-container'
    },
    'model.absoluteTol': {
      type: 'value',
      hook: 'absolute-tolerance-container'
    }
  },
  events: {
    'click [data-hook=advanced-settings-button]' : 'toggleAdvancedSettings'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.model.isAdvancedSettingsOpen) {
      $(this.queryByHook('advanced-settings')).collapse();
      $(this.queryByHook('advanced-settings-button')).text('-');
    }
  },
  update: function (e) {
  },
  updateValid: function () {
  },
  toggleAdvancedSettings: function (e) {
    if(this.model.isAdvancedSettingsOpen) {
      this.setIsAdvancedSettingsOpen(false)
      $(this.queryByHook('advanced-settings-button')).text('+');
    } else {
      this.setIsAdvancedSettingsOpen(true);
      $(this.queryByHook('advanced-settings-button')).text('-');
    }
  },
  setIsAdvancedSettingsOpen: function (value) {
    this.model.isAdvancedSettingsOpen = value;
    this.parent.model.stochasticSettings.isAdvancedSettingsOpen = value;
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
          modelKey: 'relativeTol',
          valueType: 'number',
          value: this.model.relativeTol
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
          modelKey: 'absoluteTol',
          valueType: 'number',
          value: this.model.absoluteTol
        });
      }
    }
  },
});