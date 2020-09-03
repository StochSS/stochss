var _ = require('underscore');
//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    compID: 'number',
    name: 'string',
    expression: 'number',
    annotation: 'string'
  },
  session: {
    inUse: {
      type: 'boolean',
      default: false,
    },
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
});