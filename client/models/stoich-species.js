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
var StoichSpecie = require('./stoich-specie');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: StoichSpecie,
  initialize: function (attrs, options) {
    Collection.prototype.initialize.apply(this, arguments);
    this.on('add remove', _.bind(this.triggerChange, this));
  },
  triggerChange: function () {
    this.baseModel = this.parent.collection.parent;
    this.baseModel.species.trigger('stoich-species-change');
  },
  addStoichSpecie: function (specieName, {ratio=1}={}) {
    var specie = this.parent.collection.parent.species.filter(function (specie) {
        return specie.name === specieName;
    })[0];
    var stoichSpecie = new StoichSpecie({
        ratio: ratio
    });
    stoichSpecie.specie = specie;
    this.add(stoichSpecie);
  },
  removeStoichSpecie: function (stoichSpecie) {
    stoichSpecie.stopListening();
    this.remove(stoichSpecie);
  },
});