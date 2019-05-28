var app = require('ampersand-app');
var tests = require('./tests');
//Views
var View = require('ampersand-view');
var InputView = require('./input');

var template = require('../templates/includes/stochasticSettings.pug');

module.exports = View.extend({
  template: template,
  render: function () {
  	this.renderWithTemplate();
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
          value: '1'
        });
      },
    },
    inputSeed: {
      hook: 'seed-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'seed',
          label: 'Seed the random number generator (set to -1 for a random seed): ',
          tests: tests.valueTests,
          modelKey: 'seed',
          valueType: 'number',
          value: '-1'
        });
      }
    }
  }
});