// Collections
var Collection = require('ampersand-collection');
//Models
var InitialCondition = require('./initial-condition');

module.exports = Collection.extend({
  model: InitialCondition,
  addInitialCondition: function (initialConditionType) {
    var subdomain = getDefaultSubdomain();
    var initialCondition = this.add({
      type: initialConditionType,
      subdomain: subdomain,
      count: 0,
      x: 0,
      y: 0,
      z: 0,
    });
    initialCondition.species = getDefaultSpecies();
  },
  getDefaultSpecies: function () {
    var specie = this.parent.parent.at(0);
    return specie;
  },
  getDefaultSubdomain: function () {
    var subdomain = this.parent.parent.parent.subdomains.at(0);
    return subdomain.name;
  },
  removeInitialCondition: function (initialCondition) {
    this.remove(initialCondition);
  },
});