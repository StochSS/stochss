/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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