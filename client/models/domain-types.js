/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
let Type = require('./domain-type');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Type,
  indexes: ['typeID'],
  addType: function () {
    let id = this.parent.getDefaultTypeID();
    let name = String(id);
    let type = new Type({
        c: 10,
        fixed: false,
        geometry: "",
        mass: 1.0,
        name: name,
        nu: 0.0,
        rho: 1.0,
        typeID: id,
        volume: 1.0
    });
    type.selected = true;
    this.add(type);
    return name;
  },
  removeType: function (type) {
    this.remove(type);
  },
  validateCollection: function () {
    return true;
  }
});