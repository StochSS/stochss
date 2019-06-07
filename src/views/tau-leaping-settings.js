var app = require('ampersand-view');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');

var template = require('../templates/includes/tauLeapingSettings.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.seed': {
      type: 'value',
      hook: 'seed-container'
    },
    'model.tauTolerance': {
      type: 'value',
      hook: 'tau-tolerance-container'
    }
  },
  update: function (e) {
  },
  subviews: {
    inputSeed: {
      hook: 'seed-container',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'seed',
          label: 'Seed the random number generator (set to -1 for a random seed): ',
          tests: '',
          modelKey: 'seed',
          valueType: 'number',
          value: this.model.seed
        });
      }
    },
    inputTauTolerance: {
      hook: 'tau-tolerance-container',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'tau-tolerance',
          label: 'Set the tolerance (valid value must be between 0.0 and 0.1): ',
          tests: tests.valueTests,
          modelKey: 'tauTolerance',
          valueType: 'number',
          value: this.model.tauTolerance
        });
      }
    }
  }
});