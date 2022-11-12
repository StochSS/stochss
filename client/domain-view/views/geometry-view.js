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

let _ = require('underscore');
//support files
let app = require('../../app');
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
//templates
let editTemplate = require('../templates/editGeometry.pug');
let viewTemplate = require('../templates/viewGeometry.pug');

module.exports = View.extend({
  bindings: {
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    }
  },
  events: {
    'change [data-hook=select-type-container]' : 'selectGeometryType',
    'change [data-hook=input-name-container]' : 'updateTransformations',
    'change [data-hook=input-formula-container]' : 'updateGeometriesInUse',
    'click [data-hook=remove]' : 'removeGeometry'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    app.documentSetup();
    if(!this.viewMode){
      this.renderFormulaInputView();
      this.model.on('change', _.bind(this.updateViewer, this));
    }
  },
  removeGeometry: function () {
    this.collection.removeGeometry(this.model);
  },
  renderFormulaInputView: function () {
    if(this.formulaInputView) {
        this.formulaInputView.remove();
    }
    let placeholder = this.model.type === "Standard Geometry" ?
        "-- Formula in terms of 'x', 'y', 'z' --" :
        "-- Formula in terms of other geometries --";
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
  },
  update: function () {},
  updateGeometriesInUse: function () {
    if(this.model.type === "Combinatory Geometry") {
      this.model.collection.parent.trigger('update-geometry-deps');
    }
  },
  updateTransformations: function (e) {
    let name = this.model.name;
    this.model.name = e.target.value;
    this.model.collection.parent.transformations.trigger(
      'update-geometry-options', {currName: name, newName: this.model.name}
    );
  },
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewGeometriesView();
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
    selectType: {
      hook: 'select-type-container',
      prepareView: function (el) {
        let options = [
          'Standard Geometry',
          'Combinatory Geometry'
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