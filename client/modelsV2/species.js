var _ = require('underscore');
//models
var Specie = require('./specie');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Specie,
  addSpecie: function (subdomains) {
    var name = this.getDefaultName();
    var specie = this.add({
      name: name,
      value: 0,
      mode: 'dynamic',
      diffusionCoeff: 0.0,
      subdomains: subdomains
    });
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 's' + i;
    var names = this.map(function (specie) { return specie.name; });
    while(_.contains(names, name)) {
      i += 1;
      name = 's' + i;
    }
    return name;
  },
  removeSpecie: function (specie) {
    specie.stopListening();
    this.remove(specie);
  },
})