//collections
var Collection = require('ampersand-collection');
//models
var WorkflowGroup = require('./workflow-group');

module.exports = Collection.extend({
  model: WorkflowGroup
});