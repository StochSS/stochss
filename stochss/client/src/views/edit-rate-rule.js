var app = require('ampersand-app');
var tests = require('./tests');
var $ = require('jquery');
//views
var View = require('ampersand-view');
var InputView = require('./input')

var template = require('../templates/includes/editRateRule.pug');

module.exports = View.extend({
  template: template,
  render: function () {
    this.renderWithTemplate();
    var inputField = this.queryByHook('rate-rule').children[0].children[1];
    $(inputField).attr("placeholder", "---No Rate Rule Entered---");
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
    },
    inputName: {
      hook: 'rate-rule-name',
      prepareView: function (el) {
        return new InputView ({
          parent: this,
          required: true,
          name: 'rate-rule-name',
          label: '',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name
        });
      }
    }
  }
});