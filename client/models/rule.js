//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    name: 'string',
    type: 'string',
    variable: 'object',
    expression: 'string',
    annotation: 'string',
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
});