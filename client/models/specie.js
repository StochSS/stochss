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

var _ = require('underscore');
//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    compID: 'number',
    name: 'string',
    value: 'any',
    mode: 'string',
    switchTol: 'any',
    switchMin: 'any',
    isSwitchTol: 'boolean',
    annotation: 'string',
    diffusionConst: 'number',
    types: 'object'
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
  validateComponent: function () {
    if(!this.name.trim() || this.name.match(/^\d/)) return false;
    if((!/^[a-zA-Z0-9_]+$/.test(this.name))) return false;
    if(this.value === "" || isNaN(this.value)) return false;
    if(this.mode === "dynamic") {
      if(this.isSwitchTol && (this.switchTol === "" || isNaN(this.switchTol))) return false;
      if(!this.isSwitchTol && (this.switchMin === "" || isNaN(this.switchMin))) return false;
    }
    return true;
  }
});