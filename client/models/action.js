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
    c: 'number',
    enable: 'boolean',
    fixed: 'boolean',
    geometry: 'string',
    lattice: 'string',
    mass: 'number',
    nu: 'number',
    priority: 'number',
    rho: 'number',
    scope: 'string',
    type: 'string',
    typeID: 'number',
    vol: 'number'
  },
  session: {
    selected: {
      type: 'boolean',
      default: false
    },
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  contains: function (attr, key) {
    if(key === null) { return true; }

    let checks = {
      'c': this.c === key,
      'disabled': !this.enable,
      'enable': this.enable,
      'fixed': this.fixed,
      'geometry': this.geometry.includes(key),
      'lattice': this.lattice.includes(key),
      'mass': this.mass === key,
      'nu': this.nu === key,
      'priority': this.priority === key,
      'rho': this.rho === key,
      'scope': this.scope === key,
      'type': this.type === key,
      'typeid': this.collection.parent.types.get(this.typeID, 'typeID').name === key,
      'vol': this.vol === key
    }

    if(attr !== null) {
      let otherAttrs = {
        'speedofsound': 'c', 'static': 'fixed', 'viscosity': 'nu',
        'density': 'rho', 'type_id': 'typeid', 'volume': 'vol'
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
  validate: function () {
    return true;
  }
});