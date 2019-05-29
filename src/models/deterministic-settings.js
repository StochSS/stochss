var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    relativeTolerance: 'number',
    absoluteTolerance: 'number'
  }
});