var Collection = require('ampersand-rest-collection');
var ModelVersion = require('./model-version');

module.exports = Collection.extend({
  model: ModelVersion
});
