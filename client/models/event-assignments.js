/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
var EventAssignment = require('./event-assignment');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: EventAssignment,
  addEventAssignment: function () {
    var variable = this.getDefaultVariable();
    var eventAssignment = this.add({
      variable: variable,
      expression: "",
    });
  },
  getDefaultVariable: function () {
    var species = this.parent.collection.parent.species
    if(species.length > 0){
      return species.at(0);
    }else{
      return this.parent.collection.parent.parameters.at(0)
    }
  },
  removeEventAssignment: function (eventAssignment) {
    this.remove(eventAssignment);
  },
  validateCollection: function () {
    if(this.length <= 0) return false;
    for(var i = 0; i < this.length; i++) {
      if(!this.models[i].validateComponent()) return false;
    }
    return true;
  }
});