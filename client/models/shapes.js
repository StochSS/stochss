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

let _ = require('underscore');
//models
let Shape = require('./shape');
//collections
let Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Shape,
  indexes: ['name'],
  addShape: function (type) {
    let name = this.getDefaultName();
    let shape = new Shape({
      deltar: 0,
      deltas: 0,
      deltax: 0,
      deltay: 0,
      deltaz: 0,
      depth: 0,
      fillable: false,
      formula: '',
      height: 0,
      lattice: type,
      length: 0,
      name: name,
      radius: 0,
      type: 'Standard'
    });
    this.add(shape);
    return name;
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = `shape${i}`;
    var names = this.map((shape) => { return shape.name; });
    while(_.contains(names, name)) {
      i += 1;
      name = `shape${i}`;
    }
    return name;
  },
  removeShape: function (shape) {
    this.remove(shape);
  },
  validateCollection: function () {
    return true;
  }
});
