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

//views
let View = require('ampersand-view');
let TypesView = require('./component-types');
//templates
let template = require('../templates/reactionTypes.pug');

module.exports = View.extend({
  template: template,
  initialize: function (args) {
    View.prototype.initialize.apply(this, arguments);
    this.modelType = "reaction";
    this.baseModel = this.parent.parent.collection.parent;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderTypes();
  },
  renderTypes: function () {
    if(this.typesView) {
      this.typesView.remove();
    }
    this.typesView = this.renderCollection(
      this.baseModel.domain.types,
      TypesView,
      this.queryByHook("reaction-types-container"),
      {"filter": function (model) {
        return model.typeID != 0;
      }}
    );
  }
});