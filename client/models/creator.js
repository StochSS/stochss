//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    fname: 'string',
    lname: 'string',
    email: 'string',
    organization: 'string'
  },
  initialize: function(attrs, options) {
    State.prototype.initialize.apply(this, arguments)
  }
});