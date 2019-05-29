var State = require('ampersand-state');

module.exports = State.extend({
  props:{
    realizations: 'number',
    algorithm: 'string',
    seed: 'number'
  }
});