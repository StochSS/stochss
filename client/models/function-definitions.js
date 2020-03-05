//collections
var Collection = require('ampersand-collection');
//models
var FunctionDefinition = require('./function-definition');

module.exports = Collection.extend({
  model: FunctionDefinition,
});