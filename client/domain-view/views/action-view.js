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
let path = require('path');
let _ = require('underscore');
//support files
let app = require('../../app');
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
//templates
let editTemplate = require('../templates/editAction.pug');
let viewTemplate = require('../templates/viewAction.pug');

module.exports = View.extend({
  bindings: {
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select-action'
    },
    'model.enable' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'enable-action'
    }
  },
  events: {
    'change [data-hook=select-type-container]' : 'selectActionType',
    'change [data-hook=select-scope-container]' : 'selectActionScope',
    'change [data-target=update-preview-plot]' : 'updatePreviewPlot',
    'change [data-hook=shape-container]' : 'selectShape',
    'change [data-hook=transformation-container]' : 'selectTransformation',
    'change [data-target=point]' : 'setPoint',
    'change [data-target=new-point]' : 'setNewPoint',
    'change [data-hook=particle-type]' : 'setParticleType',
    'change [data-target=particle-property-containers]' : 'updateViewers',
    'change [data-hook=particle-fixed]' : 'setParticleFixed',
    'click [data-hook=select-action]' : 'selectAction',
    'click [data-hook=enable-action]' : 'enableAction',
    'click [data-hook=remove]' : 'removeAction'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    this.details = {
      'Multi Particle': {
        'Fill Action': [
          $(this.queryByHook('multi-particle-scope')),
          $(this.queryByHook('particle-properties'))
        ],
        'Set Action': [
          $(this.queryByHook('multi-particle-scope')),
          $(this.queryByHook('particle-properties'))
        ],
        'Remove Action': [
          $(this.queryByHook('multi-particle-scope'))
        ]
      },
      'Single Particle': {
        'Fill Action': [
          $(this.queryByHook('single-particle-scope')),
          $(this.queryByHook('particle-properties'))
        ],
        'Set Action': [
          $(this.queryByHook('single-particle-scope')),
          $(this.queryByHook('new-location')),
          $(this.queryByHook('particle-properties'))
        ],
        'Remove Action': [
          $(this.queryByHook('single-particle-scope'))
        ]
      }
    }
    app.documentSetup();
    if(!this.viewMode){
      if(this.model.selected) {
        setTimeout(_.bind(this.openDetails, this), 1);
      }
      this.model.on('change', _.bind(this.updateViewer, this));
      this.renderShapeSelectView();
      this.renderTransformationSelectView();
      this.renderNewLocationViews();
      this.renderTypeSelectView();
      this.renderParticleProperties();
    }
    this.displayDetails();
  },
  displayDetails: function () {
    this.details[this.model.scope][this.model.type].forEach((element) => {
      element.css('display', 'block');
    });
  },
  enableAction: function () {
    this.model.enable = !this.model.enable;
    this.collection.parent.trigger('update-plot-preview');
  },
  getShapeOptions: function () {
    let options = [];
    this.model.collection.parent.shapes.forEach((shape) => {
      if(shape.fillable) { options.push(shape.name); }
    });
    return options;
  },
  getTransformationOptions: function () {
    return this.model.collection.parent.transformations.map((transformation) => {
      return transformation.name;
    });
  },
  hideDetails: function () {
    this.details[this.model.scope][this.model.type].forEach((element) => {
      element.css('display', 'none');
    });
  },
  openDetails: function () {
    $("#collapse-action-details" + this.model.cid).collapse("show");
  },
  removeAction: function () {
    let actions = this.collection;
    let enabled = this.model.enable;
    actions.removeAction(this.model);
    if(enabled) {
      actions.parent.trigger('update-plot-preview');
    }
  },
  renderDensityPropertyView: function () {
    if(this.densityPropertyView) {
      this.densityPropertyView.remove();
    }
    this.densityPropertyView = new InputView({
      parent: this,
      required: true,
      name: 'density',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'rho',
      value: this.model.rho
    });
    let hook = "particle-rho";
    app.registerRenderSubview(this, this.densityPropertyView, hook);
  },
  renderShapeSelectView: function () {
    if(this.shapeSelectView) {
      this.shapeSelectView.remove();
    }
    let options = this.getShapeOptions();
    this.shapeSelectView = new SelectView({
      name: 'shape',
      required: true,
      options: options,
      value: this.model.shape,
      unselectedText: "-- Select Shape --"
    });
    let hook = "shape-container";
    app.registerRenderSubview(this, this.shapeSelectView, hook);
  },
  renderTransformationSelectView: function () {
    if(this.transformationSelectView) {
      this.transformationSelectView.remove();
    }
    let options = this.getTransformationOptions();
    this.transformationSelectView = new SelectView({
      name: 'transformation',
      required: true,
      options: options,
      value: this.model.transformation,
      unselectedText: "-- Select Transformation --"
    });
    let hook = "transformation-container";
    app.registerRenderSubview(this, this.transformationSelectView, hook);
  },
  renderMassPropertyView: function () {
    if(this.massPropertyView) {
      this.massPropertyView.remove();
    }
    this.massPropertyView = new InputView({
      parent: this,
      required: true,
      name: 'mass',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'mass',
      value: this.model.mass
    });
    let hook = "particle-mass";
    app.registerRenderSubview(this, this.massPropertyView, hook);
  },
  renderNewLocationViews: function () {
    if(this.newLocationViews) {
      this.newLocationViews['x'].remove();
      this.newLocationViews['y'].remove();
      this.newLocationViews['z'].remove();
    }else{
      this.newLocationViews = {};
    }
    this.newLocationViews['x'] = new InputView({
      parent: this,
      required: true,
      name: 'new-point-x',
      tests: [tests.nanValue],
      valueType: 'number',
      value: this.model.newPoint.x
    });
    let hookX = "new-point-x-container";
    app.registerRenderSubview(this, this.newLocationViews['x'], hookX);
    this.newLocationViews['y'] = new InputView({
      parent: this,
      required: true,
      name: 'new-point-y',
      tests: [tests.nanValue],
      valueType: 'number',
      value: this.model.newPoint.y
    });
    let hookY = "new-point-y-container";
    app.registerRenderSubview(this, this.newLocationViews['y'], hookY);
    this.newLocationViews['z'] = new InputView({
      parent: this,
      required: true,
      name: 'new-point-z',
      tests: [tests.nanValue],
      valueType: 'number',
      value: this.model.newPoint.z
    });
    let hookZ = "new-point-z-container";
    app.registerRenderSubview(this, this.newLocationViews['z'], hookZ);
  },
  renderParticleProperties: function () {
    this.renderMassPropertyView();
    this.renderVolumePropertyView();
    this.renderDensityPropertyView();
    this.renderViscosityPropertyView();
    this.renderSOSPropertyView();
  },
  renderSOSPropertyView: function () {
    if(this.sOSPropertyView) {
      this.sOSPropertyView.remove();
    }
    this.sOSPropertyView = new InputView({
      parent: this,
      required: true,
      name: 'speed-of-sound',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'c',
      value: this.model.c
    });
    let hook = "particle-c";
    app.registerRenderSubview(this, this.sOSPropertyView, hook);
  },
  renderTypeSelectView: function () {
    if(this.typeSelectView) {
      this.typeSelectView.remove();
    }
    let options = this.model.collection.parent.types.map((type) => {
      return [type.typeID, type.name];
    });
    this.typeSelectView = new SelectView({
      name: 'type',
      required: true,
      options: options,
      value: this.model.typeID,
    });
    let hook = "particle-type";
    app.registerRenderSubview(this, this.typeSelectView, hook);
  },
  renderViscosityPropertyView: function () {
    if(this.viscosityPropertyView) {
      this.viscosityPropertyView.remove();
    }
    this.viscosityPropertyView = new InputView({
      parent: this,
      required: true,
      name: 'viscosity',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'nu',
      value: this.model.nu
    });
    let hook = "particle-nu";
    app.registerRenderSubview(this, this.viscosityPropertyView, hook);
  },
  renderVolumePropertyView: function () {
    if(this.volumePropertyView) {
      this.volumePropertyView.remove();
    }
    this.volumePropertyView = new InputView({
      parent: this,
      required: true,
      name: 'volume',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'vol',
      value: this.model.vol
    });
    let hook = "particle-vol";
    app.registerRenderSubview(this, this.volumePropertyView, hook);
  },
  selectAction: function () {
    this.model.selected = !this.model.selected;
  },
  selectActionScope: function (e) {
    this.hideDetails();
    this.model.scope = e.target.value;
    this.displayDetails();
    this.updatePreviewPlot();
  },
  selectActionType: function (e) {
    this.hideDetails();
    this.model.type = e.target.value;
    this.displayDetails();
    this.updatePreviewPlot();
  },
  selectShape: function (e) {
    this.model.shape = e.target.value;
    this.model.collection.parent.trigger('update-shape-deps');
    this.updateViewer();
    this.updatePreviewPlot();
  },
  selectTransformation: function (e) {
    this.model.transformation = e.target.value;
    this.model.collection.parent.trigger('update-transformation-deps');
    this.updateViewer();
    this.updatePreviewPlot();
  },
  setNewPoint: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    let value = Number(e.target.value);
    this.model.newPoint[key] = value;
    this.updateViewer();
    this.updatePreviewPlot();
  },
  setParticleFixed: function (e) {
    this.model.fixed = !this.model.fixed;
    this.updateViewer();
    this.updatePreviewPlot();
  },
  setParticleType: function (e) {
    let value = Number(e.target.value);
    let currType = this.model.collection.parent.types.get(this.model.typeID, "typeID");
    let newType = this.model.collection.parent.types.get(value, "typeID");
    this.updatePropertyDefaults(currType, newType);
    this.model.typeID = value;
    this.model.collection.parent.trigger('update-type-deps');
    this.updateViewer();
    this.updatePreviewPlot();
  },
  setPoint: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    let value = Number(e.target.value);
    if(this.model.newPoint[key] === this.model.point[key]) {
      this.model.newPoint[key] = value;
      this.renderNewLocationViews();
    }
    this.model.point[key] = value;
    this.updateViewer();
    this.updatePreviewPlot();
  },
  update: function () {},
  updatePreviewPlot: function () {
    if(!this.model.enable) { return }
    if(this.model.type === "Fill Action" && this.model.scope === "Multi Particle" && this.model.shape === "") {
      return
    }
    this.collection.parent.trigger('update-plot-preview');
  },
  updatePropertyDefaults: function (currType, newType) {
    if(this.model.mass === currType.mass) {
      this.model.mass = newType.mass;
    }
    if(this.model.vol === currType.volume) {
      this.model.vol = newType.volume;
    }
    if(this.model.rho === currType.rho) {
      this.model.rho = newType.rho;
    }
    if(this.model.nu === currType.nu) {
      this.model.nu = newType.nu;
    }
    if(this.model.c === currType.c) {
      this.model.c = newType.c;
    }
    if(this.model.fixed === currType.fixed) {
      this.model.fixed = newType.fixed;
    }
    this.renderParticleProperties();
    $(this.queryByHook('particle-fixed')).prop('checked', this.model.fixed);
  },
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewActionsView();
  },
  updateViewers: function () {
    this.updatePreviewPlot();
    this.updateViewer();
  },
  subviews: {
    inputPriority: {
      hook: 'input-priority-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'priority',
          tests: tests.valueTests,
          modelKey: 'priority',
          valueType: 'number',
          value: this.model.priority
        });
      }
    },
    selectType: {
      hook: 'select-type-container',
      prepareView: function (el) {
        let options = [
          'Fill Action',
          'Set Action',
          'Remove Action',
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
    selectScope: {
      hook: 'select-scope-container',
      prepareView: function (el) {
        let options = [
          'Multi Particle',
          'Single Particle'
        ];
        return new SelectView({
          name: 'scope',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.scope
        });
      }
    },
    inputPointX: {
      hook: 'point-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'point-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point.x
        });
      }
    },
    inputPointY: {
      hook: 'point-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'point-y',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point.y
        });
      }
    },
    inputPointZ: {
      hook: 'point-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'point-z',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.point.z
        });
      }
    }
  }
});