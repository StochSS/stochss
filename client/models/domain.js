/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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
//collections
let Particles = require('./particles');

module.exports = State.extend({
  props: {
    boundary_condition: 'object',
    c_0: 'number',
    def_particle_id: 'number',
    gravity: 'number',
    p_0: 'number',
    rho_0: 'number',
    size: 'number',
    type_names: 'object',
    x_lim: 'object',
    y_lim: 'object',
    z_lim: 'object'
  },
  collections: {
    particles: Particles
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments)
  },
  getDefaultID: function () {
    let id = this.def_particle_id;
    this.def_particle_id += 1;
    return id;
  },
  getTypeIndex: function (type) {
    let index = this.type_names.indexOf(type)
    return index;
  },
  getTypeIndicies: function (types) {
    let indicies = types.map(this.getTypeIndex)
  },
  validate: function () {
    return true;
  }
});