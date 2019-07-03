var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    value: 'number',
    mode: {
      type: 'string',
      default: 'dynamic'
    }
  }
});