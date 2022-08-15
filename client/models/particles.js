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
let Particle = require('./particle');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Particle,
  indexes: ['particle_id'],
  addParticle: function ({particle=null, point=[0,0,0], vol=1, mass=1, type=0, nu=0, fixed=false, c=10, rho=1}={}) {
    let id = this.parent.getDefaultID();
    if(particle) {
      particle.particle_id = id;
    }else{
      particle = new Particle({
          c: c,
          fixed: fixed,
          mass: mass,
          nu: nu,
          particle_id: id,
          point: point,
          rho: rho,
          type: type,
          volume: vol
      });
    }
    this.add(particle);
  },
  removeParticle: function (particle) {
    this.remove(particle);
  },
  removeParticles: function (particles) {
    let self = this;
    particles.forEach(function (particle) {
      self.removeParticle(particle)
    });
  },
  validateCollection: function () {
    for(var i = 0; i < this.length; i++) {
      if(this.models[i].type < 1) {
        return false;
      }
    }
    return true;
  }
});