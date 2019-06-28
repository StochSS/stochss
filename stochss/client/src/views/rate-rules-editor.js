var app = require('ampersand-app');
var tests = require('./tests');
//models
var RateRule = require('../models/rate-rule');
//views
var View = require('ampersand-view');
var RateRuleView = require('./edit-rate-rule');

var template = require('../templates/includes/rateRulesEditor.pug')

module.exports = View.extend({
  template: template,
  initialize: function (args) {
    this.collection = args.collection;
    this.species = args.species;
  },
  render: function () {
    this.renderWithTemplate();
    this.renderRateRules();
  },
  renderRateRules: function () {
    this.renderCollection(
      this.collection,
      RateRuleView,
      this.queryByHook('rate-rules-list')
    );
  },
  getSpecie: function (specieName) {
    return this.species.filter(function (specie) {
      return specie.name === specieName
    })[0];
  },
  getRateRule: function (specieName) {
    return this.collection.filter(function (rateRule) {
      return rateRule.specie.name === specieName
    })[0];
  },
  addRateRule: function (specieName) {
    var specie = this.getSpecie(specieName);
    var rateRule = new RateRule({
      rule: ''
    });
    rateRule.specie = specie
    this.collection.add(rateRule)
  },
  removeRateRule: function (specieName) {
    var rateRule = this.getRateRule(specieName);
    this.collection.remove(rateRule);
  }
});