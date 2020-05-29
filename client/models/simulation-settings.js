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
    tauTol: 'number'
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  letUsChooseForYou: function (model) {
    var defaultMode = model.defaultMode;
    if(defaultMode === "dynamic"){
      var species = model.species
      var discreteSpecies = species.filter(function (specie) {
        if(specie.mode === "discrete")
          return specie
      });
      if(discreteSpecies.length === species.length)
        defaultMode = "discrete"
    }
    var numEvents = model.eventsCollection.length;
    var numRules = model.rules.length;
    var numFuncDef = model.functionDefinitions.length;
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