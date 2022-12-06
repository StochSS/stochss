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
let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let EditTransformationView = require('./transformation-view');
//templates
let template = require('../templates/transformationsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=translate-transformation]' : 'addTransformation',
    'click [data-hook=rotate-transformation]' : 'addTransformation',
    'click [data-hook=reflect-transformation]' : 'addTransformation',
    'click [data-hook=scale-transformation]' : 'addTransformation'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.domainTransformation;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('transformations-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('transformations-view-tab')).tab('show');
      $(this.queryByHook('edit-transformations')).removeClass('active');
      $(this.queryByHook('view-transformations')).addClass('active');
    }else{
      this.renderEditTransformationsView();
      this.collection.on('update-geometry-options', this.updateGeometryOptions, this);
      this.collection.on('update-lattice-options', this.updateLatticeOptions, this);
      this.collection.on('update-transformation-options', this.updateTransformationOptions, this);
      this.collection.on('update-inuse', this.updateInUse, this);
      this.collection.parent.trigger('update-transformation-deps');
    }
    this.renderViewTransformationsView();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  addTransformation: function (e) {
    let type = e.target.dataset.name;
    let name = this.collection.addTransformation(type);
    this.collection.trigger('update-transformation-options', {currName: name});
  },
  renderEditTransformationsView: function ({key=null, attr=null}={}) {
    if(this.editTransformationsView) {
      this.editTransformationsView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editTransformationsView = this.renderCollection(
      this.collection,
      EditTransformationView,
      this.queryByHook('edit-transformations-list'),
      options
    );
  },
  renderViewTransformationsView: function ({key=null, attr=null}={}) {
    if(this.viewTransformationsView) {
      this.viewTransformationsView.remove();
    }
    let options = {
      viewOptions: {viewMode: true},
      filter: (model) => { return model.contains(attr, key); }
    }
    this.viewTransformationsView = this.renderCollection(
      this.collection,
      EditTransformationView,
      this.queryByHook('view-transformations-list'),
      options
    );
  },
  updateGeometryOptions: function ({currName=null, newName=null}={}) {
    if(currName === null || newName === null) { return; }
    this.editTransformationsView.views.forEach((view) => {
      if(view.model.geometry === currName) {
        view.model.geometry = newName
      }
      view.renderGeometrySelectView();
    });
  },
  updateInUse: function ({deps=null}={}) {
    if(deps === null) { return; }
    this.collection.forEach((transformation) => {
      transformation.inUse = deps.includes(transformation.name);
    });
  },
  updateLatticeOptions: function ({currName=null, newName=null}={}) {
    if(currName === null || newName === null) { return; }
    this.editTransformationsView.views.forEach((view) => {
      if(view.model.lattice === currName) {
        view.model.lattice = newName
      }
      view.renderLatticeSelectView();
    });
  },
  updateTransformationOptions: function ({currName=null, newName=null}={}) {
    if(currName === null && newName === null) { return; }
    this.editTransformationsView.views.forEach((view) => {
      if(view.model.transformation === currName && newName !== null) {
        view.model.transformation = newName
      }
      if((newName === null && view.model.name !== currName) || view.model.name !== newName) {
        view.renderTransformationSelectView();
      }
    });
  }
});