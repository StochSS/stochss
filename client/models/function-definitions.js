//collections
var Collection = require('ampersand-collection');
//models
var FunctionDefinitions = require('./function-definition');

module.exports = Collection.extend({
  model: FunctionDefinition,
});