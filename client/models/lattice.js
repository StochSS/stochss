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
    name: 'string',
    deltar: 'number',
    deltas: 'number',
    deltax: 'number',
    deltay: 'number',
    deltaz: 'number',
    filename: 'string',
    length: 'number',
    radius: 'number',
    subdomainFile: 'string',
    type: 'string',
    xmin: 'number',
    xmax: 'number',
    ymin: 'number',
    ymax: 'number',
    zmin: 'number',
    zmax: 'number'
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
      default: false,
    }
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  contains: function (attr, key) {
    if(key === null) { return true; }

    let center = `[${this.x}, ${this.y}, ${this.z}]`

    let checks = {
      'name': this.name.includes(key),
      'deltar': ["Spherical Lattice", "Cylindrical Lattice"].includes(this.type) &&
                  this.deltar === key,
      'deltas': ["Spherical Lattice", "Cylindrical Lattice"].includes(this.type) &&
                  this.deltas === key,
      'deltax': this.type === "Cartesian Lattice" && this.deltax === key,
      'deltay': this.type === "Cartesian Lattice" && this.deltay === key,
      'deltaz': this.type === "Cartesian Lattice" && this.deltaz === key,
      'filename': ["XML Mesh Lattice", "Mesh IO Lattice", "StochSS Lattice"].includes(this.type) &&
                    this.filename === key,
      'length': this.type === "Cylindrical Lattice" && this.length === key,
      'radius': ["Spherical Lattice", "Cylindrical Lattice"].includes(this.type) &&
                  this.radius === key,
      'subdomainFile': ["XML Mesh Lattice", "Mesh IO Lattice"].includes(this.type) &&
                          this.subdomainFile === key,
      'type': this.type === key,
      'xmin': this.type === "Cartesian Lattice" && this.xmin === key,
      'xmax': this.type === "Cartesian Lattice" && this.xmax === key,
      'ymin': this.type === "Cartesian Lattice" && this.ymin === key,
      'ymax': this.type === "Cartesian Lattice" && this.ymax === key,
      'zmin': this.type === "Cartesian Lattice" && this.zmin === key,
      'zmax': this.type === "Cartesian Lattice" && this.zmax === key
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