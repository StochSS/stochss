var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    seed: {
      type: 'number',
      defaulf: -1
    },
    tauTolerance: {
      type: 'number',
      default: 0.1
    },
    switchingTolerance: {
      type: 'number',
      default: 0.1
    }
  }
});