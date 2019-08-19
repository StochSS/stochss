//models
var State = require('ampersand-state');
var SSASettings = require('./ssa-settings');
var TauSettings = require('./tau-settings');
var HybridSettings = require('./hybrid-settings');

module.exports = State.extend({
  props: {
    realizations: {
      type: 'number',
      default: 1,
    },
    algorithm: {
      type: 'string',
      default: 'SSA',
    },
  },
  children: {
    ssaSettings: SSASettings,
    tauSettings: TauSettings,
    hybridSettings: HybridSettings,
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