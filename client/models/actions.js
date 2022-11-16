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

let _ = require('underscore');
//models
let Point = require('./point');
let Action = require('./action');
//collections
let Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Action,
  indexes: ['name'],
  addAction: function (type) {
    let name = this.getDefaultName();
    let action = new Action({
      c: 10,
      enable: true,
      fixed: false,
      geometry: '',
      lattice: '',
      mass: 1.0,
      name: name,
      nu: 0.0,
      rho: 1.0,
      type: type,
      typeID: 0,
      vol: 1.0
    });
    action.selected = true;
    this.add(action);
    return name;
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'action' + i;
    var names = this.map((action) => {return action.name; });
    while(_.contains(names, name)) {
      i += 1;
      name = 'action' + i;
    }
    return name;
  },
  removeAction: function (action) {
    this.remove(action);
  },
  validateCollection: function () {
    return true;
  }
});
