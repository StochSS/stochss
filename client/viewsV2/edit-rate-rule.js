var $ = require('jquery');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
//templates
var template = require('../templatesV2/includes/editRateRule.pug');

module.exports = View.extend({
  template: template,
  initiailize: function (attrs, options) {
    View.prototype.initiailize.apply(this, arguments);
  },
  render: function () {
    this.renderWithTemplate();
    var inputField = this.queryByHook('rate-rule').children[0].children[1];
    $(inputField).attr("placeholder", "---No Rate Rule Entered---");
  },
  update: function (e) {
  },
  updateValid: function () {
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
          tests: '',
          modelKey: 'rule',
          valueType: 'string',
          value: this.model.rule
        });
      },
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
      },
    },
  },
});