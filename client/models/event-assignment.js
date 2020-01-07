//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    expression: 'string',
    variable: 'object',
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
});