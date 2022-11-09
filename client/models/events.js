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
var Event = require('./event');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Event,
  addEvent: function () {
    var id = this.parent.getDefaultID();
    var name = this.getDefaultName();
    var event = this.add({
      compID: id,
      name: name,
      annotation: "",
      delay: "",
      priority: "0",
      triggerExpression: "",
      initialValue: false,
      persistent: false,
      useValuesFromTriggerTime: false,
      selected: true
    });
    event.eventAssignments.addEventAssignment()
    this.parent.updateValid()
    return event
  },
  getDefaultName: function () {
    var i = this.length + 1;
    name = 'e' + i;
    var names = this.map(function (event) { return event.name; });
    while(_.contains(names, name)){
      i += 1;
      name = 'e' + i;
    }
    return name;
  },
  removeEvent: function (event) {
    this.remove(event);
    this.parent.updateValid()
  },
  validateCollection: function () {
    for(var i = 0; i < this.length; i++) {
      if(!this.models[i].validateComponent()) {
        this.parent.error = {'id':this.models[i].compID,'type':'event'}
        return false
      }
    }
    return true;
  }
});