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

// Models
var State = require('ampersand-state');
var Specie = require('./specie');

module.exports = State.extend({
  props: {
    compID: 'number',
    icType: 'string',
    annotation: 'string',
    count: 'any',
    types: 'object',
    x: 'any',
    y: 'any',
    z: 'any',
  },
  children: {
    specie: Specie,
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments)
  },
  contains: function (attr, key) {
    if(key === null) { return true; }

    let location = `[${this.x}, ${this.y}, ${this.z}]`
    let types = []
    if(this.types) {
      this.types.forEach((typeID) => {
        types.push(this.collection.parent.domain.types.get(typeID, "typeID").name);
      });
    }

    let checks = {
      'ictype': this.icType === key,
      'count': this.count === Boolean(key),
      'types': this.icType !=='Place' && types.includes(key),
      'x': this.icType ==='Place' && this.x === Number(key),
      'y': this.icType ==='Place' && this.y === Number(key),
      'z': this.icType ==='Place' && this.z === Number(key),
      'location': this.icType ==='Place' && location === key,
      'specie': this.specie.name === key
    }
    if(attr !== null) {
      let otherAttrs = {
        'type': 'ictype', 'variable': 'specie', 'species': 'specie',
        'activeintypes': 'types', 'restrictto': 'types'
      }
      if(Object.keys(otherAttrs).includes(attr)) {
        attr = otherAttrs[attr];
      }
      return checks[attr];
    }
    for(let attribute in checks) {
      if(checks[attribute]) { return true; }
    }
    return false;
  },
  validateComponent: function () {
    if(this.icType !== "Place" && this.types.length <= 0) { return false; }
    return true;
  }
});