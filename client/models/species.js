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
var Specie = require('./specie');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Specie,
  addSpecie: function (types) {
    var id = this.parent.getDefaultID();
    var name = this.getDefaultName();
    var specie = this.add({
      compID: id,
      name: name,
      value: 0,
      mode: this.parent.defaultMode,
      switchTol: 0.03,
      switchMin: 100,
      isSwitchTol: true,
      annotation: "",
      diffusionConst: 0.0,
      types: types
    });
    this.parent.updateValid()
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 's' + i;
    var names = this.map(function (specie) { return specie.name; });
    while(_.contains(names, name)) {
      i += 1;
      name = 's' + i;
    }
    return name;
  },
  removeSpecie: function (specie) {
    this.remove(specie);
    this.parent.updateValid()
  },
  validateCollection: function (isSpatial) {
    if(this.length <= 0 && !isSpatial) {
      this.parent.error = {'type':'species'}
      return false;
    }
    for(var i = 0; i < this.length; i++) {
      if(!this.models[i].validateComponent()) {
        this.parent.error = {'id':this.models[i].compID,'type':'species'}
        return false
      }
    }
    return true;
  }
});