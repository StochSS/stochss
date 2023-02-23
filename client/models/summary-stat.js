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
let State = require('ampersand-state');

module.exports = State.extend({
  props: {
    args: 'object',
    formula: 'string',
    name: 'string'
  },
  derived: {
    elementID: {
      deps: ["collection"],
      fn: function () {
        if(this.collection) {
          return "ISS" + (this.collection.indexOf(this) + 1);
        }
        return "ISS-"
      }
    },
    argsDisplay: {
      deps: ["args"],
      fn: function () {
        if([undefined, null].includes(this.args)) { return "None"; }
        let argStrs = [];
        this.args.forEach((arg) => {
          argStrs.push(JSON.stringify(arg));
        });
        return argStrs.join();
      }
    }
  },
  initialize: function(attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
  setArgs: function (argStr) {
    if(argStr === "") {
      this.args = null;
    }else{
      let argStrs = argStr.replace(/ /g, '').split(',');
      let args = [];
      argStrs.forEach((arg) => {
        args.push(JSON.parse(arg));
      });
      this.args = args;
    }
  }
});
