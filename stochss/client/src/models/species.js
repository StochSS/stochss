var Collection = require('ampersand-collection');
var Specie = require('./specie');

module.exports = Collection.extend({
  model: Specie,
});
