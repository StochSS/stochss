//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    mapper: 'string',
    reducer: 'string',
    outputs: 'object'
  },
  initialize: function(attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  }
});