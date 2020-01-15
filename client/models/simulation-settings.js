//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    isAutomatic: 'boolean',
    relativeTol: 'number',
    absoluteTol: 'number',
    realizations: 'number',
    algorithm: 'string',
    seed: 'number',
    tauTol: 'number',
    switchTol: 'number'
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
});