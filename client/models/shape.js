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
let Point = require('./point');
let State = require('ampersand-state');

module.exports = State.extend({
  props: {
    deltar: 'number',
    deltas: 'number',
    deltax: 'number',
    deltay: 'number',
    deltaz: 'number',
    depth: 'number',
    fillable: 'boolean',
    formula: 'string',
    height: 'number',
    lattice: 'string',
    length: 'number',
    name: 'string',
    radius: 'number',
    type: 'string'
  },
  children: {
    center: Point
  },
  session: {
    selected: {
      type: 'boolean',
      default: false
    },
    inUse: {
      type: 'boolean',
      default: false
    }
  },
  derived: {
    notEditable: {
      deps: ['fillable'],
      fn: function () {
        return this.fillable;
      }
    }
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  contains: function (attr, key) {
    if(key === null) { return true; }

    let center = `[${this.x}, ${this.y}, ${this.z}]`

    let checks = {
      'deltar': ["Spherical Lattice", "Cylindrical Lattice"].includes(this.lattice) &&
                  this.deltar === key,
      'deltas': ["Spherical Lattice", "Cylindrical Lattice"].includes(this.lattice) &&
                  this.deltas === key,
      'deltax': this.lattice === "Cartesian Lattice" && this.deltax === key,
      'deltay': this.lattice === "Cartesian Lattice" && this.deltay === key,
      'deltaz': this.lattice === "Cartesian Lattice" && this.deltaz === key,
      'depth': this.lattice === "Cartesian Lattice" && this.depth === key,
      'formula': this.formula.includes(key),
      'height': this.lattice === "Cartesian Lattice" && this.height === key,
      'lattice': this.lattice === key,
      'length': ["Cartesian Lattice", "Cylindrical Lattice"].includes(this.lattice) &&
                  this.length === key,
      'name': this.name.includes(key),
      'radius': ["Spherical Lattice", "Cylindrical Lattice"].includes(this.lattice) &&
                  this.radius === key,
      'type': this.type === key,
    }

    if(attr !== null) {
      let otherAttrs = {'centerx': 'x','centery': 'y','centerz': 'z'}
      if(Object.keys(otherAttrs).includes(attr)) {
        attr = otherAttrs[attr];
      }
      checks['center'] = this.center.contains(attr, key)
      if(['x', 'y', 'z'].includes(attr)) {
        return checks.center;
      }
      return checks[attr];
    }
    for(let attribute in checks) {
      if(checks[attribute]) { return true; }
    }
    return false
  },
  validate: function () {
    if((!/^[a-zA-Z0-9_]+$/.test(this.name))) return false;
    return true;
  }
});
