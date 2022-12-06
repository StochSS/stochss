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
    'change [data-hook=geometry-container]' : 'selectGeometry',
    'change [data-hook=fill-lattice-container]' : 'selectLattice',
    'change [data-target=point]' : 'setPoint',
    'change [data-hook=particle-type]' : 'setParticleType',
    'change [data-target=particle-property-containers]' : 'updateViewer',
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
          $(this.queryByHook('fill-lattice')),
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
      this.renderGeometrySelectView();
      this.renderLatticeSelectView();
      this.renderTypeSelectView();
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
  },
  getGeometryOptions: function () {
    let geometries = this.model.collection.parent.geometries.map((geometry) => {
      return geometry.name;
    });
    let transformations = this.getTransformationOptions();
    let options = [{groupName: "Geometries", options: geometries},
                   {groupName: "Transformations", options: transformations}];
    return options
  },
  getLatticeOptions: function () {
    let lattices = this.model.collection.parent.lattices.map((lattice) => {
      return lattice.name;
    });
    let transformations = this.getTransformationOptions();
    let options = [{groupName: "Lattices", options: lattices},
                   {groupName: "Transformations", options: transformations}];
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
    this.collection.removeAction(this.model);
  },
  renderGeometrySelectView: function () {
    if(this.geometrySelectView) {
      this.geometrySelectView.remove();
    }
    let options = this.getGeometryOptions();
    this.geometrySelectView = new SelectView({
      name: 'geometry',
      required: true,
      groupOptions: options,
      value: this.model.geometry,
      unselectedText: "-- Select Geometry --"
    });
    let hook = "geometry-container";
    app.registerRenderSubview(this, this.geometrySelectView, hook);
  },
  renderLatticeSelectView: function () {
    if(this.latticeSelectView) {
      this.latticeSelectView.remove();
    }
    let options = this.getLatticeOptions();
    this.latticeSelectView = new SelectView({
      name: 'lattice',
      required: true,
      groupOptions: options,
      value: this.model.lattice,
      unselectedText: "-- Select Lattice --"
    });
    let hook = "fill-lattice-container";
    app.registerRenderSubview(this, this.latticeSelectView, hook);
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
  selectAction: function () {
    this.model.selected = !this.model.selected;
  },
  selectActionScope: function (e) {
    this.hideDetails();
    this.model.scope = e.target.value;
    this.displayDetails();
  },
  selectActionType: function (e) {
    this.hideDetails();
    this.model.type = e.target.value;
    this.displayDetails();
  },
  selectGeometry: function (e) {
    this.model.geometry = e.target.value;
    this.model.collection.parent.trigger('update-geometry-deps');
    this.model.collection.parent.trigger('update-transformation-deps');
    this.updateViewer();
  },
  selectLattice: function (e) {
    this.model.lattice = e.target.value;
    this.model.collection.parent.trigger('update-lattice-deps');
    this.model.collection.parent.trigger('update-transformation-deps');
    this.updateViewer();
  },
  setParticleFixed: function (e) {
    this.model.fixed = !this.model.fixed;
    this.updateViewer();
  },
  setParticleType: function (e) {
    this.model.typeID = Number(e.target.value);
    this.model.collection.parent.trigger('update-type-deps');
    this.updateViewer();
  },
  setPoint: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    let value = Number(e.target.value);
    this.model.point[key] = value;
    this.updateViewer();
  },
  update: function () {},
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewActionsView();
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
          tests: tests.valueTests,
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
          tests: tests.valueTests,
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
          tests: tests.valueTests,
          valueType: 'number',
          value: this.model.point.z
        });
      }
    },
    inputParticleMass: {
      hook: 'particle-mass',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'mass',
          tests: tests.valueTests,
          valueType: 'number',
          modelKey: 'mass',
          value: this.model.mass
        });
      }
    },
    inputParticleVol: {
      hook: 'particle-vol',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'volume',
          tests: tests.valueTests,
          valueType: 'number',
          modelKey: 'vol',
          value: this.model.vol
        });
      }
    },
    inputParticleRho: {
      hook: 'particle-rho',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'density',
          tests: tests.valueTests,
          valueType: 'number',
          modelKey: 'rho',
          value: this.model.rho
        });
      }
    },
    inputParticleNu: {
      hook: 'particle-nu',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'viscosity',
          tests: tests.valueTests,
          valueType: 'number',
          modelKey: 'nu',
          value: this.model.nu
        });
      }
    },
    inputParticleC: {
      hook: 'particle-c',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'speed-of-sound',
          tests: tests.valueTests,
          valueType: 'number',
          modelKey: 'c',
          value: this.model.c
        });
      }
    }
  }
});