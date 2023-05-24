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

var _ = require('underscore');
//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    annotation: 'string',
    compID: 'number',
    diffusionConst: 'number',
    isSwitchTol: 'boolean',
    mode: 'string',
    name: 'string',
    observable: 'boolean',
    switchTol: 'any',
    switchMin: 'any',
    types: 'object',
    value: 'any'
  },
  session: {
    inUse: {
      type: 'boolean',
      default: false,
    },
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  contains: function (attr, key) {
    if(key === null) { return true; }

    let types = []
    if(this.types) {
      this.types.forEach((typeID) => {
        types.push(this.collection.parent.domain.types.get(typeID, "typeID").name);
      });
    }

    let checks = {
      'name': this.name.includes(key),
      'value': this.value === Number(key),
      'mode': this.mode === key,
      'switchTol': this.isSwitchTol && this.switchTol === Number(key),
      'switchMin': !this.isSwitchTol && this.switchMin === Number(key),
      'diffusionConst': this.diffusionConst === Number(key),
      'types': types.includes(key)
    }

    if(attr !== null) {
      let otherAttrs = {
        'initialcondition': 'value', 'initialvalue': 'value',
        'switchingtolerance': 'switchTol', 'restrictto': 'types',
        'minimumvalueforswitching': 'switchMin'
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
  validateComponent: function (isSpatial) {
    if(!this.name.trim() || this.name.match(/^\d/)) { return false; }
    if((!/^[a-zA-Z0-9_]+$/.test(this.name))) { return false; }
    if(this.value === "" || isNaN(this.value)) { return false; }
    if(this.mode === "dynamic") {
      if(this.isSwitchTol && (this.switchTol === "" || isNaN(this.switchTol))) { return false; }
      if(!this.isSwitchTol && (this.switchMin === "" || isNaN(this.switchMin))) { return false; }
    }
    if(isSpatial && this.types.length <= 0) { return false; }
    return true;
  }
});