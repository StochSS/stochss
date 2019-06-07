var State = require('ampersand-state');
var SSASettings = require('./ssa-settings');
var TauLeapingSettings = require('./tau-leaping-settings');
//var HybridTauSettings = require('./hybrid-tau-settings');

module.exports = State.extend({
  props:{
    realizations: {
      type: 'number',
      default: 1
    },
    algorithm: {
      type: 'string',
      default: 'SSA'
    }
  },
  children: {
    ssaSettings: SSASettings,
    tauLeapingSettings: TauLeapingSettings,
    //hybridTauSettings: HybridTauSettings
  }
});