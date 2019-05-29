var State = require('ampersand-state');

module.exports = State.extend({
  props:{
    realizations: {
      type: 'number',
      default: 1
    },
    algorithm: {
      type: 'string',
      default: 'SSA'
    },
    seed: {
      type: 'number',
      default: -1
    }
  }
});