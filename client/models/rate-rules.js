var Collection = require('ampersand-collection');
var RateRule = require('./rate-rule');

module.exports = Collection.extend({
  model: RateRule,
});