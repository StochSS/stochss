//collections
var WorkflowCollection = require('./workflows');
//models
var State = require('ampersand-state');

module.exports = State.extend({
  collections: {
    workflows: WorkflowCollection
  },
  session: {
    name: 'string'
  }
});