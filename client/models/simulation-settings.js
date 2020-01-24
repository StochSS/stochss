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
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  letUsChooseForYou: function () {
    var defaultMode = this.parent.defaultMode;
    var numEvents = this.parent.eventsCollection.length;
    var numRules = this.parent.rules.length;
    var tTol = this.tauTol
    var aTol = this.absoluteTol
    var rTol = this.relativeTol

    if(numEvents || numRules || defaultMode !== 'discrete' || rTol !== 0.03 || aTol !== 0.03){
      this.model.algorithm = "Hybrid-Tau-Leaping";
    }else if(tTol !== 0.03){
      this.model.algorithm = "Tau-Leaping";
    }else{
      this.model.algorithm = "SSA"
    }
  },
});