//models
var State = require('ampersand-state');
//collections
var EventAssignments = require('./event-assignments');

module.exports = State.extend({
  props: {
    name: 'string',
    delay: 'string',
    priority: 'string',
    triggerExpression: 'string',
    initialValue: 'boolean',
    persistent: 'boolean',
  },
  collections: {
    eventAssignments: EventAssignments,
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
});