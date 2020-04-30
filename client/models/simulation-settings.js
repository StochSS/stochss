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
    if(defaultMode === "dynamic"){
      var species = this.parent.species
      var discreteSpecies = species.filter(function (specie) {
        console.log(specie.mode)
        if(specie.mode === "discrete")
          return specie
      });
      if(discreteSpecies.length === species.length)
        defaultMode = "discrete"
    }
    var numEvents = this.parent.eventsCollection.length;
    var numRules = this.parent.rules.length;
    var numFuncDef = this.parent.functionDefinitions.length;
    var tTol = this.tauTol
    var aTol = this.absoluteTol
    var rTol = this.relativeTol

    if(numEvents || numRules || numFuncDef || rTol !== 1e-3 || aTol !== 1e-6 || defaultMode !== 'discrete'){
      this.algorithm = "Hybrid-Tau-Leaping";
    }else if(tTol !== 0.03){
      this.algorithm = "Tau-Leaping";
    }else{
      this.algorithm = "SSA"
    }
  },
});