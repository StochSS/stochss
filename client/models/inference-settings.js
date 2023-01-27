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
//collections
let InferenceParameters = require('./inference-parameters');
//models
let State = require('ampersand-state');

module.exports = State.extend({
  Props: {
    obsData: 'string',
    priorMethod: 'string',
    summaryStats: 'string'
  },
  collections: {
    parameters: InferenceParameters
  },
  derived: {
    elementID: {
      deps: ["parent"],
      fn: function () {
        if(this.parent) {
          return this.parent.elementID + "IS-";
        }
        return "IS-"
      }
    }
  },
  initialize: function(attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  }
});
