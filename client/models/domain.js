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
var State = require('ampersand-state');
//collections
let Types = require('./domain-types');
let Particles = require('./particles');

module.exports = State.extend({
  props: {
    boundary_condition: 'object',
    c_0: 'number',
    gravity: 'object',
    p_0: 'number',
    rho_0: 'number',
    size: 'number',
    x_lim: 'object',
    y_lim: 'object',
    z_lim: 'object',
    static: 'boolean'
  },
  collections: {
    types: Types,
    particles: Particles
  },
  session: {
    def_particle_id: 'number',
    def_type_id: 'number',
    directory: 'string',
    dirname: 'string'
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments)
    this.particles.on('add change remove', this.updateValid, this);
    this.def_particle_id = this.particles.length;
    this.def_type_id = this.types.length;
    let self = this;
    this.particles.forEach(function (particle) {
      if(particle.particle_id >= self.def_particle_id) {
        self.def_particle_id = particle.particle_id + 1;
      }
    });
    this.types.forEach(function (type) {
      if(type.typeID >= self.def_type_id) {
        self.def_type_id = type.typeID + 1;
      }
    });
  },
  getDefaultID: function () {
    let id = this.def_particle_id;
    this.def_particle_id += 1;
    return id;
  },
  getDefaultTypeID: function () {
    let id = this.def_type_id;
    this.def_type_id += 1;
    return id;
  },
  realignTypes: function (oldType) {
    this.def_type_id -= 1;
    this.types.forEach((type) => {
      if(type.typeID > oldType) {
        let id = type.typeID - 1;
        if(type.name === type.typeID.toString()) {
          type.name = id.toString();
        }
        type.typeID = id;
      }
    });
    this.particles.forEach((particle) => {
      if(particle.type > oldType) {
        particle.type -= 1;
      }
    });
  },
  validateModel: function () {
    if(!this.particles.validateCollection()) return false;
    return true;
  },
  updateValid: function () {
    this.valid = this.validateModel()
  },
});