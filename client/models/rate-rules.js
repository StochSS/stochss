var _ = require('underscore');
//models
var RateRule = require('./rate-rule');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: RateRule,
  addRateRule: function (specieName) {
    var name = this.getDefaultName();
    var specie = this.getSpecie(specieName);
    var rateRule = new RateRule({
      name: name,
      rule: '',
    });
    rateRule.specie = specie;
    this.add(rateRule);
  },
  removeRateRule: function (specieName) {
    var rateRule = this.getRateRule(specieName);
    this.remove(rateRule);
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'rr' + i;
    var names = this.map(function (rateRule) {return rateRule.name; });
    while(_.contains(names, name)){
      i += 1;
      name = 'rr' + i;
    }
    return name;
  },
  getSpecie: function (specieName) {
    return this.parent.species.filter(function (specie) {
      return specie.name === specieName;
    })[0];
  },
  getRateRule: function (specieName) {
    return this.filter(function (rateRule) {
      return rateRule.specie.name === specieName;
    })[0];
  },
});