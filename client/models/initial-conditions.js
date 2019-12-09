// Collections
var Collection = require('ampersand-collection');
//Models
var InitialCondition = require('./initial-condition');

module.exports = Collection.extend({
  model: InitialCondition,
  addInitialCondition: function (initialConditionType) {
    var subdomain = this.getDefaultSubdomain();
    var initialCondition = this.add({
      type: initialConditionType,
      subdomain: subdomain,
      count: 0,
      x: 0,
      y: 0,
      z: 0,
    });
    initialCondition.specie = this.getDefaultSpecies();
  },
  getDefaultSpecies: function () {
    var specie = this.parent.species.at(0);
    return specie;
  },
  getDefaultSubdomain: function () {
    var subdomain = this.parent.meshSettings.uniqueSubdomains.at(0);
    return subdomain.name;
  },
  removeInitialCondition: function (initialCondition) {
    this.remove(initialCondition);
  },
});