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
let _ = require('underscore');
//support files
let app = require('../../app');
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
//templates
let editTemplate = require('../templates/editTransformation.pug');
let viewTemplate = require('../templates/viewTransformation.pug');

module.exports = View.extend({
  bindings: {
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select-transformation'
    },
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    }
  },
  events: {
    'change [data-hook=input-name-container]' : 'updateTransformations',
    'change [data-hook=select-type-container]' : 'selectTransformationType',
    'change [data-hook=geometry-select-container]' : 'selectNestedGeometry',
    'change [data-hook=lattice-select-container]' : 'selectNestedLattice',
    'change [data-hook=transformation-select-container]' : 'selectNestedTransformation',
    'click [data-hook=select-transformation]' : 'selectTransformation',
    'click [data-hook=remove]' : 'removeTransformation'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    this.details = {
      'Translate Transformation': [],
      'Rotate Transformation': [],
      'Reflect Transformation': [],
      'Scale Transformation': []
    }
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    app.documentSetup();
    if(!this.viewMode){
      if(this.model.selected) {
        setTimeout(_.bind(this.openDetails, this), 1);
      }
      this.model.on('change', _.bind(this.updateViewer, this));
      this.renderGeometrySelectView();
      this.renderLatticeSelectView();
      this.renderTransformationSelectView();
    }
    this.displayDetails();
  },
  displayDetails: function () {
    this.details[this.model.type].forEach((element) => {
      element.css('display', 'block');
    });
  },
  hideDetails: function () {
    this.details[this.model.type].forEach((element) => {
      element.css('display', 'none');
    });
  },
  openDetails: function () {
    $("#collapse-transformation-details" + this.model.cid).collapse("show");
  },
  removeTransformation: function () {
    let name = this.model.name;
    let collection = this.model.collection;
    collection.removeTransformation(this.model);
    collection.trigger('update-transformation-options', {currName: name});
  },
  renderGeometrySelectView: function () {
    if(this.geometrySelectView) {
      this.geometrySelectView.remove();
    }
    let options = this.model.collection.parent.geometries;
    this.geometrySelectView = new SelectView({
      name: 'geometry',
      required: false,
      idAttribute: 'name',
      textAttribute: 'name',
      eagerValidate: false,
      options: options,
      value: this.model.geometry,
      unselectedText: '-- Select a Geometry --'
    });
    let hook = "geometry-select-container";
    app.registerRenderSubview(this, this.geometrySelectView, hook);
  },
  renderLatticeSelectView: function () {
    if(this.latticeSelectView) {
      this.latticeSelectView.remove();
    }
    let options = this.model.collection.parent.lattices;
    this.latticeSelectView = new SelectView({
      name: 'lattice',
      required: false,
      idAttribute: 'name',
      textAttribute: 'name',
      eagerValidate: false,
      options: options,
      value: this.model.lattice,
      unselectedText: '-- Select a Lattice --'
    });
    let hook = "lattice-select-container";
    app.registerRenderSubview(this, this.latticeSelectView, hook);
  },
  renderTransformationSelectView: function () {
    if(this.transformationSelectView) {
      this.transformationSelectView.remove();
    }
    let options = [];
    this.model.collection.parent.transformations.forEach((transformation) => {
      if(transformation.name !== this.model.name) {
        options.push(transformation.name);
      }
    });
    this.transformationSelectView = new SelectView({
      name: 'transformation',
      required: false,
      eagerValidate: false,
      options: options,
      value: this.model.transformation,
      unselectedText: '-- Select a Transformation --'
    });
    let hook = "transformation-select-container";
    app.registerRenderSubview(this, this.transformationSelectView, hook);
  },
  selectNestedGeometry: function (e) {
    this.model.geometry = e.target.value;
    this.model.collection.parent.trigger('update-geometry-deps');
  },
  selectNestedLattice: function (e) {
    this.model.lattice = e.target.value;
    this.model.collection.parent.trigger('update-lattice-deps');
  },
  selectNestedTransformation: function (e) {
    this.model.transformation = e.target.value;
    this.model.collection.parent.trigger('update-transformation-deps');
  },
  selectTransformation: function () {
    this.model.selected = !this.model.selected;
  },
  selectTransformationType: function (e) {
    this.hideDetails();
    this.model.type = e.target.value;
    this.displayDetails();
  },
  update: function () {},
  updateTransformations: function (e) {
    let name = this.model.name;
    this.model.name = e.target.value;
    this.model.collection.parent.transformations.trigger(
      'update-transformation-options', {currName: name, newName: this.model.name}
    );
  },
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewTransformationsView();
  },
  subviews: {
    inputNameView: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          tests: tests.nameTests,
          valueType: 'string',
          value: this.model.name
        });
      }
    },
    selectTypeView: {
      hook: 'select-type-container',
      prepareView: function (el) {
        let options = [
          'Translate Transformation',
          'Rotate Transformation',
          'Reflect Transformation',
          'Scale Transformation'
        ];
        return new SelectView({
          name: 'type',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.type
        });
      }
    }
  }
});