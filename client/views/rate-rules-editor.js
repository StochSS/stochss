//views
var View = require('ampersand-view');
var RateRuleView = require('./edit-rate-rule');
//templates
var template = require('../templates/includes/rateRuleEditor.pug');

module.exports = View.extend({
  template: template,
  initialize: function (args) {
    View.prototype.initialize.apply(this, arguments);
    this.collection = args.collection;
    this.species = args.species;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderRateRules();
  },
  renderRateRules: function () {
    this.renderCollection(
      this.collection,
      RateRuleView,
      this.queryByHook('rate-rules-list')
    );
  },
  addRateRule: function (specieName) {
    this.collection.addRateRule(specieName);
  },
  removeRateRule: function (specieName) {
    this.collection.removeRateRule(specieName);
  },
});