var _ = require('underscore');
//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    name: 'string',
    value: 'number',
  },
  session: {
    inUse: {
      type: 'boolean',
      default: false,
    },
  },
  initialize: function () {
    State.prototype.initialize.apply(this, arguments);
  },
});