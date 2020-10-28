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

var _ = require('underscore');
//models
var Rule = require('./rule');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Rule,
  addRule: function (type) {
    var id = this.parent.getDefaultID();
    var name = this.getDefaultName();
    var variable = this.getDefaultVariable();
    var rule = new Rule({
      compID: id,
      name: name,
      type: type,
      expression: '',
      annotation: '',
    });
    rule.variable = variable;
    this.add(rule);
    this.parent.updateValid()
  },
  removeRule: function (rule) {
    this.remove(rule);
    this.parent.updateValid()
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'rr' + i;
    var names = this.map(function (rule) {return rule.name; });
    while(_.contains(names, name)){
      i += 1;
      name = 'rr' + i;
    }
    return name;
  },
  getDefaultVariable: function () {
    var species = this.parent.species
    if(species.length > 0){
      return species.at(0);
    }else{
      return this.parent.parameters.at(0)
    }
  },
  validateCollection: function () {
    for(var i = 0; i < this.length; i++) {
      if(!this.models[i].validateComponent()) {
        this.parent.error = {'id':this.models[i].compID,'type':'rule'}
        return false
      }
    }
    return true;
  }
});