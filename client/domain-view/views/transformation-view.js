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
    'change [data-hook=input-name-container]' : 'updateDepsOptions',
    'change [data-hook=select-type-container]' : 'selectTransformationType',
    'change [data-hook=geometry-select-container]' : 'selectNestedGeometry',
    'change [data-hook=lattice-select-container]' : 'selectNestedLattice',
    'change [data-hook=transformation-select-container]' : 'selectNestedTransformation',
    'change [data-target=vector-point1]' : 'setVectorPoint1',
    'change [data-target=vector-point2]' : 'setVectorPoint2',
    'change [data-target=reflect-normal]' : 'setReflectNormal',
    'change [data-target=reflect-point1]' : 'setReflectPoint1',
    'change [data-target=reflect-point2]' : 'setReflectPoint2',
    'change [data-target=reflect-point3]' : 'setReflectPoint3',
    'change [data-target=scale-center]' : 'setCenter',
    'click [data-hook=select-transformation]' : 'selectTransformation',
    'click [data-hook=remove]' : 'removeTransformation',
    'click [data-hook=collapsePointNormal]' : 'togglePointNormal',
    'click [data-hook=collapseThreePoint]' : 'toggleThreePoint'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    this.chevrons = {
      hide: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512">
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
        </svg>
      `,
      show: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512">
          <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>
        </svg>
      `
    }
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    this.details = {
      'Translate Transformation': [
        $(this.queryByHook('vector-transformation-props'))
      ],
      'Rotate Transformation': [
        $(this.queryByHook('vector-transformation-props')),
        $(this.queryByHook('rotation-angle-header')),
        $(this.queryByHook('rotation-angle-prop'))
      ],
      'Reflect Transformation': [
        $(this.queryByHook('reflect-transformation-props'))
      ],
      'Scale Transformation': [
        $(this.queryByHook('scale-transformation-props'))
      ]
    }
    app.documentSetup();
    if(this.viewMode){
      if(this.model.point2.inUse || this.model.point3.inUse) {
        $(this.queryByHook('view-point2-header')).css('display', 'inline-block');
        $(this.queryByHook('view-point3-header')).css('display', 'inline-block');
        $(this.queryByHook('view-reflect-point2')).css('display', 'inline-block');
        $(this.queryByHook('view-reflect-point3')).css('display', 'inline-block');
      }else{
        $(this.queryByHook('view-normal-header')).css('display', 'inline-block');
        $(this.queryByHook('view-reflect-normal')).css('display', 'inline-block');
      }
    }else{
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
    let actions = this.model.collection.parent.actions;
    collection.removeTransformation(this.model);
    collection.trigger('update-transformation-options', {currName: name});
    actions.trigger('update-transformation-options', {currName: name});
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
  setCenter: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    this.model.center[key] = Number(e.target.value);
    this.model.trigger('change');
  },
  setReflectNormal: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    this.model.normal[key] = Number(e.target.value);
    this.model.trigger('change');
  },
  setReflectPoint1: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    this.model.point1[key] = Number(e.target.value);
    this.model.trigger('change');
  },
  setReflectPoint2: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    this.model.point2[key] = Number(e.target.value);
    this.model.trigger('change');
  },
  setReflectPoint3: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    this.model.point3[key] = Number(e.target.value);
    this.model.trigger('change');
  },
  setVectorPoint1: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    this.model.vector[0][key] = Number(e.target.value);
    this.model.trigger('change');
  },
  setVectorPoint2: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    this.model.vector[1][key] = Number(e.target.value);
    this.model.trigger('change');
  },
  togglePointNormal: function () {
    let classes = $(this.queryByHook('collapsePointNormal')).attr("class").split(/\s+/);
    $(this.queryByHook('three-point-chevron')).html(this.chevrons.hide);
    if(classes.includes('collapsed')) {
      $(this.queryByHook('point-normal-chevron')).html(this.chevrons.show);
    }else{
      $(this.queryByHook('point-normal-chevron')).html(this.chevrons.hide);
    }
  },
  toggleThreePoint: function () {
    let classes = $(this.queryByHook('collapseThreePoint')).attr("class").split(/\s+/);
    $(this.queryByHook('point-normal-chevron')).html(this.chevrons.hide);
    if(classes.includes('collapsed')) {
      $(this.queryByHook('three-point-chevron')).html(this.chevrons.show);
    }else{
      $(this.queryByHook('three-point-chevron')).html(this.chevrons.hide);
    }
  },
  update: function () {},
  updateDepsOptions: function (e) {
    let name = this.model.name;
    this.model.name = e.target.value;
    this.model.collection.parent.transformations.trigger(
      'update-transformation-options', {currName: name, newName: this.model.name}
    );
    this.model.collection.parent.actions.trigger(
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
    },
    vectorPoint1XInputView: {
      hook: 'vector-point1-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'vector-point1-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.vector[0].x
        });
      }
    },
    vectorPoint1YInputView: {
      hook: 'vector-point1-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'vector-point1-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.vector[0].y
        });
      }
    },
    vectorPoint1ZInputView: {
      hook: 'vector-point1-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'vector-point1-z',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.vector[0].z
        });
      }
    },
    vectorPoint2XInputView: {
      hook: 'vector-point2-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'vector-point2-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.vector[1].x
        });
      }
    },
    vectorPoint2YInputView: {
      hook: 'vector-point2-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'vector-point2-y',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.vector[1].y
        });
      }
    },
    vectorPoint2ZInputView: {
      hook: 'vector-point2-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'vector-point2-z',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.vector[1].z
        });
      }
    },
    rotationAngleInputView: {
      hook: 'rotation-angle-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'angle',
          modelKey: 'angle',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.angle
        });
      }
    },
    scalingFactorInputView: {
      hook: 'scale-factor-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'factor',
          modelKey: 'factor',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.factor
        });
      }
    },
    centerXInputView: {
      hook: 'center-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'center-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.center.x
        });
      }
    },
    centerYInputView: {
      hook: 'center-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'center-y',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.center.y
        });
      }
    },
    centerZInputView: {
      hook: 'center-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'center-z',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.center.z
        });
      }
    },
    normalXInputView: {
      hook: 'normal-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'normal-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.normal.x
        });
      }
    },
    normalYInputView: {
      hook: 'normal-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'normal-y',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.normal.y
        });
      }
    },
    normalZInputView: {
      hook: 'normal-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'normal-z',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.normal.z
        });
      }
    },
    point1XInputView: {
      hook: 'point1-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'point1-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point1.x
        });
      }
    },
    point1YInputView: {
      hook: 'point1-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'point1-y',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point1.y
        });
      }
    },
    point1ZInputView: {
      hook: 'point1-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'point1-z',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point1.z
        });
      }
    },
    point2XInputView: {
      hook: 'point2-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'point2-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point2.x
        });
      }
    },
    point2YInputView: {
      hook: 'point2-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'point2-y',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point2.y
        });
      }
    },
    point2ZInputView: {
      hook: 'point2-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'point2-z',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point2.z
        });
      }
    },
    point3XInputView: {
      hook: 'point3-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'point3-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point3.x
        });
      }
    },
    point3YInputView: {
      hook: 'point3-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'point3-y',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point3.y
        });
      }
    },
    point3ZInputView: {
      hook: 'point3-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'point3-z',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point3.z
        });
      }
    }
  }
});