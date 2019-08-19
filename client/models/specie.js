var _ = require('underscore');
//models
var State = require('ampersand-state');
//var InitialCondition = require('./initial-condition');

module.exports = State.extend({
  props: {
    name: 'string',
    value: 'number',
    mode: 'string',
    diffusionCoeff: 'number',
    subdomains: {
      type: 'object',
      default: function() {return []; }
    },
  },
  children: {
    //initialCondition: InitialCondition
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