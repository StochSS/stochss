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
    angle: 'number',
    factor: 'number',
    geometry: 'string',
    lattice: 'string',
    name: 'string',
    transformation: 'string',
    type: 'string',
    vector: 'object'
  },
  children: {
    center: Point,
    normal: Point,
    point1: Point,
    point2: Point,
    point3: Point
  },
  session: {
    selected: {
      type: 'boolean',
      default: false
    }
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  contains: function (attr, key) {
    if(key === null) { return true; }

    let checks = {
      'angle': this.angle === Number(key),
      'factor': this.factor === Number(key),
      'geometry': this.geometry.includes(key),
      'lattice': this.lattice.includes(key),
      'name': this.name.includes(key),
      'transformation': this.transformation.includes(key),
      'type': this.type === key
    }

    if(attr !== null) {
      let otherAttrs = {
        'centerx': 'x', 'centery': 'y', 'centerz': 'z',
        'normalx': 'x', 'normaly': 'y', 'normalz': 'z',
        'point1x': 'x', 'point1y': 'y', 'point1z': 'z',
        'point2x': 'x', 'point2y': 'y', 'point2z': 'z',
        'point3x': 'x', 'point3y': 'y', 'point3z': 'z'
      }
      let pointCheck = this.setPointCheck(attr)
      if(Object.keys(otherAttrs).includes(attr)) {
        attr = otherAttrs[attr];
      }
      checks['center'] = this.center.contains(attr, key);
      checks['normal'] = this.normal.contains(attr, key);
      checks['point1'] = this.point1.contains(attr, key);
      checks['point2'] = this.point2.contains(attr, key);
      checks['point3'] = this.point3.contains(attr, key);
      if(['x', 'y', 'z'].includes(attr)) {
        if(pointCheck !== null) {
          return checks[pointCheck]
        }
        let points = ['center', 'normal', 'point1', 'point2', 'point3'];
        for(let attribute in points) {
          if(checks[attribute]) { return true; }
        }
        return false;
      }
      return checks[attr];
    }
    for(let attribute in checks) {
      if(checks[attribute]) { return true; }
    }
    return false;
  },
  setPointCheck: function (attr) {
    if(attr.includes('center')) { return "center"; }
    if(attr.includes('normal')) { return "normal"; }
    if(attr.includes('point1')) { return "point1"; }
    if(attr.includes('point2')) { return "point2"; }
    if(attr.includes('point3')) { return "point3"; }
    return null;
  },
  validate: function () {
    if((!/^[a-zA-Z0-9_]+$/.test(this.name))) return false;
    return true;
  }
});