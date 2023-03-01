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

//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    paramID: 'number',
    min: 'any',
    max: 'any',
    name: 'string',
    range: 'object',
    steps: 'any',
    hasChangedRange: 'boolean' 
  },
  session: {
    fixed: 'boolean'
  },
  derived: {
    elementID: {
      deps: ["collection"],
      fn: function () {
        if(this.collection) {
          return "ST" + (this.collection.indexOf(this) + 1);
        }
        return "ST-"
      }
    }
  },
  initialize: function(attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  updateVariable: function (parameter) {
    let value = parameter.expression;
    if(this.min <= 0 || !this.hasChangedRange) {
      this.min = value * 0.5;
    }
    if(this.max <= 0 || !this.hasChangedRange) {
      this.max = value * 1.5;
    }
  }
});
