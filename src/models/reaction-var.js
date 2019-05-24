var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    id: 'number',
    name: 'string',
    value: 'number'
  },
  session: {
    inUse: {
      type: 'boolean',
      default: false
    }
  }
});
