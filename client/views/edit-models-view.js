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

let $ = require('jquery');
//views
var View = require('ampersand-view');
var EditModelView = require('./edit-model-view');
//templates
var template = require('../templates/includes/editModelsView.pug');

module.exports = View.extend({
  template: template,
  events: {},
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, arguments) {
    View.prototype.render.apply(this, arguments)
    this.renderEditModelview()
  },
  renderEditModelview: function () {
    if(this.editModelView) {
      this.editModelView.remove()
    }
    this.editModelView = this.renderCollection(this.collection, EditModelView, this.queryByHook("project-models-list"))
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  }
});