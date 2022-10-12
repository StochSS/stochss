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
let Geometry = require('./geometry');
//collections
let Collection = require('ampersand-collection');

let defaults = {
  'All': 'true',
  'Interior': 'not on_boundary',
  'Exterior': 'on_boundary'
}

module.exports = Collection.extend({
  model: Geometry,
  indexes: ['name'],
  addGeometry: function (name, {formula=null}={}) {
    if(formula === null && Object.keys(defaults).includes(name)) {
      formula = defaults[name]
    }
    let geometry = new Geometry({
      name: name,
      formula: formula,
      namespace: null
    });
    this.add(geometry);
    return name;
  },
  removeGeometry: function (geometry) {
    this.remove(geometry);
  },
  validateCollection: function () {
    return true;
  }
});