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
    if(model.rules.length || model.eventsCollection.length || model.functionDefinitions.length){
      this.algorithm = "Hybrid-Tau-Leaping"
      return
    }

    var mode = model.defaultMode

    if(mode === "dynamic"){
      let isDiscrete = Boolean(model.species.filter(specie => specie.mode !== "discrete"))
      let isContinuous = Boolean(model.species.filter(specie => specie.mode !== "continuous"))

      if(isDiscrete){
        mode = "discrete"
      }else if(isContinuous){
        mode = "continuous"
      }
    }

    if(mode === "dynamic"){
      this.algorithm = "Hybrid-Tau-Leaping"
    }else if(mode === "discrete"){
      this.algorithm = "SSA"
    }else{
      this.algorithm = "ODE"
    }
  },
});