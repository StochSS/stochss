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

let $ = require('jquery');
//support files
let app = require('../../app');
//views
let View = require('ampersand-view');
let TypeView = require('./type-view');
//templates
let template = require('../templates/typesView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-domain-types]' : 'changeCollapseButtonText',
    'click [data-hook=add-domain-type]' : 'handleAddDomainType',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('domain-types-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('domain-types-view-tab')).tab('show');
      $(this.queryByHook('edit-domain-types')).removeClass('active');
      $(this.queryByHook('view-domain-types')).addClass('active');
    }else{
      this.renderEditTypeView();
    }
    this.toggleDomainError();
    this.renderViewTypeView();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  handleAddDomainType: function () {
    let name = this.collection.addType();
    this.parent.addType(name);
  },
  renderEditTypeView: function () {
    if(this.editTypeView) {
      this.editTypeView.remove();
    }
    let options = {
      filter: function (model) {
          return model.typeID != 0;
      }
    }
    this.editTypeView = this.renderCollection(
      this.collection,
      TypeView,
      this.queryByHook("edit-domain-types-list"),
      options
    );
  },
  renderViewTypeView: function () {
    if(this.viewTypeView) {
      this.viewTypeView.remove();
    }
    let options = {
      viewOptions: {viewMode: true},
      filter: function (model) {
          return model.typeID != 0;
      }
    }
    this.viewTypeView = this.renderCollection(
      this.collection,
      TypeView,
      this.queryByHook("view-domain-types-list"),
      options
    );
  },
  toggleDomainError: function () {
    let errorMsg = $(this.queryByHook('domain-error'))
    if(!this.collection.parent.valid) {
      errorMsg.addClass('component-invalid');
      errorMsg.removeClass('component-valid');
    }else{
      errorMsg.addClass('component-valid');
      errorMsg.removeClass('component-invalid');
    }
  }
});