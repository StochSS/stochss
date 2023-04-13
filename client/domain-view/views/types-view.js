/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
      this.collection.on("update-inuse", this.updateInUse, this);
      this.collection.parent.trigger('update-type-deps');
      this.toggleTypesCollectionError("ev");
      this.collection.on('add remove', () => {
        this.toggleTypesCollectionError("ev");
        this.toggleTypesCollectionError("vv");
      }, this);
    }
    this.toggleDomainError();
    this.toggleTypesCollectionError("vv");
    this.renderViewTypeView();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  getParticleCounts: function (particles) {
    let particleCounts = {};
    particles.forEach((particle) => {
      if(particleCounts[particle.type]) {
        particleCounts[particle.type] += 1;
      }else{
        particleCounts[particle.type] = 1;
      }
    });
    this.collection.forEach((type) => {
      type.numParticles = particleCounts[type.typeID] ? particleCounts[type.typeID] : 0;
    });
  },
  handleAddDomainType: function () {
    let name = this.collection.addType();
    this.collection.parent.trigger('update-particle-type-options', {currName: name});
    this.collection.parent.actions.trigger('update-type-options', {currName: name});
  },
  openSection: function () {
    if(!$(this.queryByHook("domain-types-section")).hasClass("show")) {
      let typesCollapseBtn = $(this.queryByHook("collapse-domain-types"));
      typesCollapseBtn.click();
      typesCollapseBtn.html('-');
    }
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
    let errorMsg = $(this.queryByHook('domain-error'));
    if(this.collection.models[0].numParticles > 0) {
      errorMsg.addClass('component-invalid');
      errorMsg.removeClass('component-valid');
    }else{
      errorMsg.addClass('component-valid');
      errorMsg.removeClass('component-invalid');
    }
  },
  toggleTypesCollectionError: function (viewCode) {
    let errorMsg = $(this.queryByHook(`${viewCode}-types-collection-error`));
    if(this.collection.length == 1) {
      errorMsg.addClass('component-invalid');
      errorMsg.removeClass('component-valid');
    }else{
      errorMsg.addClass('component-valid');
      errorMsg.removeClass('component-invalid');
    }
  },
  updateInUse: function ({deps=null}={}) {
    if(deps === null) { return; }
    this.collection.forEach((type) => {
      type.inUse = deps.includes(type.name);
    });
  },
  updateParticleCounts: function (particles) {
    this.getParticleCounts(particles);
    $(this.queryByHook('unassigned-type-count')).text(this.collection.models[0].numParticles);
    this.renderEditTypeView();
    this.renderViewTypeView();
    this.collection.parent.updateValid();
    this.toggleDomainError();
  }
});