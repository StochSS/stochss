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
//support files
let Tooltips = require('../tooltips');
//views
let View = require('ampersand-view');
let BoundaryConditionView = require('./boundary-condition-view');
//templates
let template = require('../templates/includes/boundaryConditionsEditor.pug');

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.boundaryConditionsEditor;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('bc-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('bc-view-tab')).tab('show');
      $(this.queryByHook('edit-boundary-conditions')).removeClass('active');
      $(this.queryByHook('view-boundary-conditions')).addClass('active');
    }
    this.renderEditBoundaryConditionView();
    this.renderViewBoundaryConditionView();
  },
  renderEditBoundaryConditionView: function () {
    if(this.editBoundaryConditionView) {
      this.editBoundaryConditionView.remove();
    }
    this.editBoundaryConditionView = this.renderCollection(
      this.collection,
      BoundaryConditionView,
      this.queryByHook("edit-boundary-conditions")
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  renderViewBoundaryConditionView: function () {
    if(this.viewBoundaryConditionView) {
      this.viewBoundaryConditionView.remove();
    }
    let options = {viewOptions: {viewMode: true}};
    this.viewBoundaryConditionView = this.renderCollection(
      this.collection,
      BoundaryConditionView,
      this.queryByHook("view-boundary-conditions"),
      options
    );
  }
});