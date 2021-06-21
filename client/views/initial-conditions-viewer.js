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

var $ = require('jquery');
//support files
let app = require('../app');
//views
var View = require('ampersand-view');
var ViewInitialCondition = require('./view-initial-condition');
//templates
var template = require('../templates/includes/initialConditionsViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=initial-condition-button]' : 'changeCollapseButtonText',
    'click [data-hook=edit-species]' : 'switchToEditMode'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ViewInitialCondition, this.queryByHook('initial-conditions-collection'))
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  switchToEditMode: function (e) {
    this.parent.renderInitialConditions("edit", true);
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
});