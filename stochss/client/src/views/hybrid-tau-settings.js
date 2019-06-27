var app = require('ampersand-app');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
var EditSpecieModeView = require('./edit-specie-mode');

var template = require('../templates/includes/hybridTauSettings.pug');

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
    },
    'model.switchingTolerance': {
      type: 'value',
      hook: 'switching-tolerance-container'
    }
  },
  render: function () {
    var self = this;
    View.prototype.render.apply(this);
    var args = {
      viewOptions: {
        name: 'specie-mode',
        label: '',
        require: true,
        textAttribute: 'mode',
        eagerValidate: true,
        idAttribute: 'mode',
        options: ['continuous', 'discrete', 'dynamic'],
        unselectedText: 'Select a mode',
        value: ''
      }
    };
    this.renderCollection(
      this.parent.parent.species,
      EditSpecieModeView,
      this.queryByHook('specie-mode-container'),
      args
    );
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
          name: 'Tau-Tolerance',
          label: 'Set the tau-tolerance (valid value must be between 0.0 and 1.0): ',
          tests: tests.valueTests,
          modelKey: 'tauTolerance',
          valueType: 'number',
          value: this.model.tauTolerance
        });
      }
    },
    inputSwitchingTolerance: {
      hook: 'switching-tolerance-container',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'Switching Tolerance',
          label: 'Set the switching tolerance (valid values must be between 0.0 and 1.0): ',
          tests: tests.valueTests,
          modelKey: 'switchingTolerance',
          valueType: 'number',
          value: this.model.switchingTolerance
        });
      }
    }
  }
});