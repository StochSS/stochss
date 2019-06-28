var app = require('ampersand-app');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input')

var template = require('../templates/includes/editRateRule.pug');

module.exports = View.extend({
  template: template,
  render: function () {
    this.renderWithTemplate();
    this.model
  },
  subviews: {
    inputRateRule: {
      hook: 'rate-rule',
      prepareView: function (el) {
        return new InputView ({
          parent: this,
          required: false,
          name: 'rate-rule',
          label: this.model.specie.name,
          tests: tests.nameTests,
          modelKey: 'rule',
          valueType: 'string',
          value: this.model.rule
        })
      }
    }
  }
})