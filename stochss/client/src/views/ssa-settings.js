var app = require('ampersand-app');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');

var template = require('../templates/includes/ssaSettings.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.seed': {
      type: 'value',
      hook: 'seed-container'
    }
  },
  update: function (e) {
  },
  subviews: {
    inputSeed: {
      hook: 'seed-container',
      prepareView: function () {
        return new InputView({
          parent: this,
          required: true,
          name: 'seed',
          label: 'Seed the random number generator (set to -1 for a random seed): ',
          tests: '',
          modelKey: 'seed',
          valueType: 'number',
          value: this.model.seed
        })
      }
    }
  }
});