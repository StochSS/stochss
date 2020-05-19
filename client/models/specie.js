var _ = require('underscore');
//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    compID: 'number',
    name: 'string',
    value: 'number',
    mode: 'string',
    switchTol: 'number',
    switchMin: 'number',
    isSwitchTol: 'boolean',
    annotation: 'string',
    diffusionCoeff: 'number',
    subdomains: 'object'
  },
  session: {
    inUse: {
      type: 'boolean',
      default: false,
    },
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
});