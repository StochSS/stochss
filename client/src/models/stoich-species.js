var _ = require('underscore');
var StoichSpecie = require('./stoich-specie');
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: StoichSpecie
});

