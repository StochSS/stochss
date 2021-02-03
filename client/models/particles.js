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
let Particle = require('./particle');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Particle,
  addParticle: function (point, vol, mass, type, nu, fixed) {
    let id = this.parent.getDefaultID();
    let type_index = this.parent.getTypeIndex(type);
    var particle = new Praticle({
        fixed: fixed,
        mass: mass,
        nu: nu,
        particle_id: id,
        point: point,
        type: type_index,
        volume: vol
    });
    this.add(particle);
  },
  removeParticle: function (particle) {
    this.remove(particle);
  },
  validateCollection: function () {
    return true;
  }
});