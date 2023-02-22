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
let Transformation = require('./transformation');
//collections
let Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Transformation,
  indexes: ['name'],
  addTransformation: function (type) {
    let name = this.getDefaultName();
    let transformation = new Transformation({
      angle: 0,
      factor: 1,
      name: name,
      transformation: "",
      type: type,
    });
    transformation.selected = true;
    transformation.vector = this.getNewVector();
    transformation.center = this.getNewPoint();
    transformation.normal = this.getNewPoint();
    transformation.point1 = this.getNewPoint();
    transformation.point2 = this.getNewPoint();
    transformation.point3 = this.getNewPoint();
    this.add(transformation);
    return name;
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'transformation' + i;
    var names = this.map(function (transformation) {return transformation.name; });
    while(_.contains(names, name)) {
      i += 1;
      name = 'transformation' + i;
    }
    return name;
  },
  getNewPoint: function () {
    return new Point({x: 0, y: 0, z: 0});
  },
  getNewVector: function () {
    return [this.getNewPoint(), this.getNewPoint()];
  },
  removeTransformation: function (transformation) {
    this.remove(transformation);
  },
  validateCollection: function () {
    return true;
  }
});
