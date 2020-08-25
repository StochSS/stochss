//collections
//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    path: 'string',
    annotation: 'string',
    outputs: 'object',
    type: 'string'
  },
  session: {
    name: 'string',
    status: 'string'
  }
});