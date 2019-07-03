var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    seed: {
      type: 'number',
      default: -1
    },
    tauTolerance: {
      type: 'number',
      default: 0.3
    },
    switchingTolerance: {
      type: 'number',
      default: 0.3
    }
  }
});