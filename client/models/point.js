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
let State = require('ampersand-state');

module.exports = State.extend({
  props: {
    x: 'number',
    y: 'number',
    z: 'number',
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  contains: function (attr, key) {
    if(key === null) { return true; }

    let centers = [`[${this.x}, ${this.y}, ${this.z}]`, `[${this.x},${this.y},${this.z}]`];

    let checks = {
      'center': centers.includes(key),
      'x': this.x === key,
      'y': this.y === key,
      'z': this.z === key,
    }

    if(attr !== null) {
      let otherAttrs = {
        'point': 'center', 'normal': 'center',
        'point1': 'center','point2': 'center','point3': 'center'
      }
      if(Object.keys(otherAttrs).includes(attr)) {
        attr = otherAttrs[attr];
      }
      return checks[attr];
    }
    for(let attribute in checks) {
      if(checks[attribute]) { return true; }
    }
    return false
  },
  validate: function () {
    return true;
  }
});