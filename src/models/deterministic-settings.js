var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    relativeTolerance: {
      type: 'number',
      default: 1e-6
    },
    absoluteTolerance: {
      type: 'number',
      default: 1e-9
    }
  }
});