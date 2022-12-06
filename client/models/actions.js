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
  addAction: function (type) {
    let action = new Action({
      c: 10,
      enable: true,
      fixed: false,
      geometry: '',
      lattice: '',
      mass: 1.0,
      nu: 0.0,
      priority: 1,
      rho: 1.0,
      scope: 'Multi Particle',
      type: type,
      typeID: 0,
      vol: 1.0
    });
    action.selected = true;
    action.point = this.getNewPoint();
    this.add(action);
  },
  getNewPoint: function (action) {
    return new Point({x: 0, y: 0, z: 0});
  },
  removeAction: function (action) {
    this.remove(action);
  },
  validateCollection: function () {
    return true;
  }
});
