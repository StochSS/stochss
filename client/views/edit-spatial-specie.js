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

var tests = require('./tests');
var _ = require('underscore');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var TypesView = require('./component-types');
//templates
var template = require('../templates/includes/editSpatialSpecie.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    },
  },
  events: {
    'click [data-hook=remove]' : 'removeSpecie',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.baseModel = this.model.collection.parent;
    this.modelType = "species";
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderTypes();
  },
  update: function () {
  },
  updateValid: function () {
  },
  removeSpecie: function () {
    this.remove();
    this.collection.removeSpecie(this.model);
  },
  renderTypes: function () {
    if(this.typesView) {
      this.typesView.remove();
    }
    this.typesView = this.renderCollection(
      this.baseModel.domain.types,
      TypesView,
      this.queryByHook("species-types"),
      {"filter": function (model) {
        return model.typeID != 0;
      }}
    );
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: '',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name,
        });
      },
    },
    inputValue: {
      hook: 'input-diffusion-coeff-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'diffusion coeff',
          label: '',
          tests: tests.valueTests,
          modelKey: 'diffusionConst',
          valueType: 'number',
          value: this.model.diffusionConst,
        });
      },
    },
  },
});