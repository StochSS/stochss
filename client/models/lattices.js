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
let Point = require('./point');
let Lattice = require('./lattice');
//collections
let Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Lattice,
  indexes: ['name'],
  addLattice: function (type) {
    let name = this.getDefaultName();
    let lattice = new Lattice({
      name: name,
      deltar: 0,
      deltas: 0,
      deltax: 0,
      deltay: 0,
      deltaz: 0,
      filename: '',
      length: 0,
      radius: 0,
      subdomainFile: '',
      type: type,
      xmin: 0,
      xmax: 0,
      ymin: 0,
      ymax: 0,
      zmin: 0,
      zmax: 0
    });
    lattice.selected = true;
    lattice.center = this.getNewPoint();
    this.add(lattice);
    return name;
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'lattice' + i;
    var names = this.map(function (lattice) {return lattice.name; });
    while(_.contains(names, name)) {
      i += 1;
      name = 'lattice' + i;
    }
    return name;
  },
  getNewPoint: function () {
    return new Point({x: 0, y: 0, z: 0});
  },
  removeLattice: function (lattice) {
    this.remove(lattice);
  },
  validateCollection: function () {
    return true;
  }
});
