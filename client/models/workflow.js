//collections
//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    path: 'string',
    outputs: 'object'
  },
  session: {
    name: 'string',
    status: 'string'
  }
});