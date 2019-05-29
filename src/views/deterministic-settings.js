var app = require('ampersand-app');
var tests = require('./tests');
//Views
var View = require('ampersand-view');
var InputView = require('./input');

var template = require('../templates/includes/deterministicSettings.pug');

module.exports = View.extend({
  template: template,
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
          modelKey: 'relative-tolerance',
          valueType: 'number',
          value: '1e-6'
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
          modelKey: 'absolute-tolerance',
          valueType: 'number',
          value: '1e-9'
        });
      }
    }
  }
});