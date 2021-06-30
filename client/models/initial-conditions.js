/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
  addInitialCondition: function (initialConditionType, types) {
    var initialCondition = new InitialCondition({
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
});