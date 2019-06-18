var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    id: 'number',
    name: 'string',
    value: 'number',
    mode: {
      type: 'string',
      default: 'dynamic'
    }
  },
  session: {
    inUse: {
      type: 'boolean',
      default: false
    }
  }
});