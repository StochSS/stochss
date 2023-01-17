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
let editTemplate = require('../templates/editShape.pug');
let viewTemplate = require('../templates/viewShape.pug');

module.exports = View.extend({
  events: {
    'change [data-hook=input-name-container]' : 'updateDepsOptions',
    'change [data-hook=select-geometry-container]' : 'selectGeometryType',
    'change [data-hook=input-formula-container]' : 'updateGeometriesInUse',
    'change [data-hook=select-lattice-container]' : 'selectLatticeType',
    'change [data-target=shape-property]' : 'updateViewer',
    'click [data-hook=select-shape]' : 'selectShape',
    'click [data-hook=fillable-shape]' : 'selectFillable',
    'click [data-hook=remove]' : 'removeShape'
  },
  bindings: {
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select-shape'
    },
    'model.fillable' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'fillable-shape'
    },
    'model.notEditable' : {
      hook: 'select-shape',
      type: function (el, value, previousValue) {
        el.disabled = !value;
      },
      name: 'disabled'
    },
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled'
    }
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    this.details = {
      'Cartesian Lattice': [
        $(this.queryByHook('cartesian-lattice-props'))
      ],
      'Spherical Lattice': [
        $(this.queryByHook('circular-lattice-props'))
      ],
      'Cylindrical Lattice': [
        $(this.queryByHook('circular-lattice-props')),
        $(this.queryByHook('cylinder-length-header')),
        $(this.queryByHook('cylinder-length-feild'))
      ]
    }
    app.documentSetup();
    if(!this.viewMode){
      if(this.model.selected) {
        setTimeout(_.bind(this.openDetails, this), 1);
      }
      this.renderFormulaInputView();
      this.displayDetails();
    }else if(this.model.fillable) {
      setTimeout(_.bind(this.openDetails, this), 1);
      this.displayDetails();
    }
  },
  displayDetails: function () {
    this.details[this.model.lattice].forEach((element) => {
      element.css('display', 'block');
    });
  },
  hideDetails: function () {
    this.details[this.model.lattice].forEach((element) => {
      element.css('display', 'none');
    });
  },
  openDetails: function () {
    $(this.queryByHook("view-collapse-shape-details" + this.model.cid)).collapse("show");
  },
  removeShape: function () {
    let name = this.model.name;
    let actions = this.model.collection.parent.actions;
    this.collection.removeShape(this.model);
    actions.trigger('update-shape-options', {currName: name});
  },
  renderFormulaInputView: function () {
    if(this.formulaInputView) {
        this.formulaInputView.remove();
    }
    let placeholder = this.model.type === "Standard" ?
        "-- Formula in terms of 'x', 'y', 'z' --" :
        "-- Formula in terms of other shapes --";
    this.formulaInputView = new InputView({
      parent: this, required: true, name: 'formula', modelKey: 'formula',
      valueType: 'string', value: this.model.formula, placeholder: placeholder
    });
    let hook = 'input-formula-container';
    app.registerRenderSubview(this, this.formulaInputView, hook);
  },
  selectGeometryType: function (e) {
    this.model.type = e.target.value;
    this.renderFormulaInputView();
    this.updateViewer();
  },
  selectShape: function () {
    this.model.selected = !this.model.selected;
  },
  selectFillable: function () {
    this.model.fillable = !this.model.fillable;
    if(!this.model.fillable && this.model.selected) {
      this.model.selected = false;
      $(this.queryByHook("edit-collapse-shape-details" + this.model.cid)).collapse("hide");
    }
    this.updateViewer();
  },
  selectLatticeType: function (e) {
    this.hideDetails();
    this.model.lattice = e.target.value;
    this.displayDetails();
    this.updateViewer();
  },
  update: function () {},
  updateDepsOptions: function (e) {
    let name = this.model.name;
    this.model.name = e.target.value;
    this.updateViewer();
    this.model.collection.parent.actions.trigger(
      'update-shape-options', {currName: name, newName: this.model.name}
    );
  },
  updateGeometriesInUse: function () {
    if(this.model.type === "Combinatory") {
      this.model.collection.parent.trigger('update-shape-deps');
    }
    this.updateViewer();
  },
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewShapesView();
  },
  subviews: {
    inputName: {
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
    selectGeometry: {
      hook: 'select-geometry-container',
      prepareView: function (el) {
        let options = [
          'Standard',
          'Combinatory'
        ];
        return new SelectView({
          name: 'geometry',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.type
        });
      }
    },
    selectLattice: {
      hook: 'select-lattice-container',
      prepareView: function (el) {
        let options = [
          'Cartesian Lattice',
          'Spherical Lattice',
          'Cylindrical Lattice'
        ];
        return new SelectView({
          name: 'lattice',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.lattice
        });
      }
    },
    lengthInputView: {
      hook: "length-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'length',
          modelKey: 'length',
          valueType: 'number',
          value: this.model.length,
          tests: tests.valueTests
        });
      }
    },
    heightInputView: {
      hook: "height-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'height',
          modelKey: 'height',
          valueType: 'number',
          value: this.model.height,
          tests: tests.valueTests
        });
      }
    },
    depthInputView: {
      hook: "depth-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'depth',
          modelKey: 'depth',
          valueType: 'number',
          value: this.model.depth,
          tests: tests.valueTests
        });
      }
    },
    deltaxInputView: {
      hook: "delta-x-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'deltax',
          modelKey: 'deltax',
          valueType: 'number',
          value: this.model.deltax,
          tests: tests.valueTests
        });
      }
    },
    deltayInputView: {
      hook: "delta-y-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'deltay',
          modelKey: 'deltay',
          valueType: 'number',
          value: this.model.deltay,
          tests: tests.valueTests
        });
      }
    },
    deltazInputView: {
      hook: "delta-z-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'deltaz',
          modelKey: 'deltaz',
          valueType: 'number',
          value: this.model.deltaz,
          tests: tests.valueTests
        });
      }
    },
    radiusInputView: {
      hook: "radius-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'radius',
          modelKey: 'radius',
          valueType: 'number',
          value: this.model.radius,
          tests: tests.valueTests
        });
      }
    },
    cylinderLengthInputView: {
      hook: "cylinder-length-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'length',
          modelKey: 'length',
          valueType: 'number',
          value: this.model.length,
          tests: tests.valueTests
        });
      }
    },
    deltasInputView: {
      hook: "delta-s-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'deltas',
          modelKey: 'deltas',
          valueType: 'number',
          value: this.model.deltas,
          tests: tests.valueTests
        });
      }
    },
    deltarInputView: {
      hook: "delta-r-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'deltar',
          modelKey: 'deltar',
          valueType: 'number',
          value: this.model.deltar,
          tests: tests.valueTests
        });
      }
    }
  }
});
