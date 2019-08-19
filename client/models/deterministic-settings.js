//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    relativeTol: {
      type: 'number',
      default: 0.03,
    },
    absoluteTol: {
      type: 'number',
      default: 0.03,
    },
  },
  session: {
    isAdvancedOpen: {
      type: 'boolean',
      default: false,
    },
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
});