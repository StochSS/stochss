/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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

// Collections
var Collection = require('ampersand-collection');
//Models
var InitialCondition = require('./initial-condition');

module.exports = Collection.extend({
  model: InitialCondition,
  indexes: ['compID'],
  addInitialCondition: function (initialConditionType, types) {
    var id = this.parent.getDefaultID();
    var initialCondition = new InitialCondition({
      compID: id,
      icType: initialConditionType,
      annotation: "",
      types: types,
      count: 0,
      x: 0,
      y: 0,
      z: 0,
    });
    initialCondition.specie = this.getDefaultSpecies();
    this.add(initialCondition);
  },
  getDefaultSpecies: function () {
    var specie = this.parent.species.at(0);
    return specie;
  },
  removeInitialCondition: function (initialCondition) {
    this.remove(initialCondition);
  },
  validateCollection: function () {
    for(var i = 0; i < this.length; i++) {
      if(!this.models[i].validateComponent()) {
        this.parent.error = {'id':this.models[i].compID,'type':'initialCondition'};
        return false;
      }
    }
    return true;
  }
});