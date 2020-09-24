//collections
var Collection = require('ampersand-collection');
//models
var Workflow = require('./workflow');

module.exports = Collection.extend({
  model: Workflow
});