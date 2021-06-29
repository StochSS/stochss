/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
let app = require('../app');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
var TypesView = require('./component-types');
//templates
var template = require('../templates/includes/editInitialCondition.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=remove]' : 'removeInitialCondition',
    'change [data-hook=initial-condition-type]' : 'selectInitialConditionType',
    'change [data-hook=initial-condition-species]' : 'selectInitialConditionSpecies',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.modelType = "initial-condition";
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var self = this;
    var options = ['Scatter', 'Place', 'Distribute Uniformly per Voxel'];
    var typeSelectView = new SelectView({
      label: '',
      name: 'type',
      required: true,
      idAttributes: 'cid',
      options: options,
      value: self.model.icType,
    });
    var speciesSelectView = new SelectView({
      label: '',
      name: 'specie',
      required: true,
      idAttribute: 'cid',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.model.collection.parent.species,
      // For new reactions (with no rate.name) just use the first parameter in the Parameters collection
      // Else fetch the right Parameter from Parameters based on existing rate
      value: this.model.specie.name ? this.getSpecieFromSpecies(this.model.specie.name) : this.model.collection.parent.species.at(0),
    });
    app.registerRenderSubview(this, typeSelectView, 'initial-condition-type');
    app.registerRenderSubview(this, speciesSelectView, 'initial-condition-species');
    this.renderDetailsView();
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderDetailsView: function () {
    if(this.model.icType === "Place") {
      $(this.queryByHook("scatter-details")).css("display", "none")
      $(this.queryByHook("place-details")).css("display", "block")
      this.renderLocation();
    }else {
      $(this.queryByHook("place-details")).css("display", "none")
      $(this.queryByHook("scatter-details")).css("display", "block")
      this.renderTypes();
    }
  },
  renderLocation: function () {
    if(this.xCoord) {
      this.xCoord.remove();
      this.yCoord.remove();
      this.zCoord.remove();
    }
    this.xCoord = new InputView({parent: this, required: true,
                                name: 'X', valueType: 'number',
                                modelKey: "x", label: 'x: ',
                                tests: tests.valueTests,
                                value: this.model.x});
    app.registerRenderSubview(this, this.xCoord, "x-container");
    this.yCoord = new InputView({parent: this, required: true,
                                name: 'Y', valueType: 'number',
                                modelKey: "y", label: 'y: ',
                                tests: tests.valueTests,
                                value: this.model.y});
    app.registerRenderSubview(this, this.yCoord, "y-container");
    this.zCoord = new InputView({parent: this, required: true,
                                name: 'Z', valueType: 'number',
                                modelKey: "z", label: 'z: ',
                                tests: tests.valueTests,
                                value: this.model.z});
    app.registerRenderSubview(this, this.zCoord, "z-container");
  },
  renderTypes: function () {
    if(this.typesView) {
      this.typesView.remove();
    }
    this.typesView = this.renderCollection(
      this.model.collection.parent.domain.types,
      TypesView,
      this.queryByHook("initial-condition-types"),
      {"filter": function (model) {
        return model.typeID != 0;
      }}
    );
  },
  getSpecieFromSpecies: function (name) {
    var species = this.model.collection.parent.species.filter(function (specie) {
      return specie.name === name;
    })[0];
    return species;
  },
  removeInitialCondition: function () {
    this.collection.removeInitialCondition(this.model);
  },
  selectInitialConditionType: function (e) {
    var currentType = this.model.icType;
    var newType = e.target.selectedOptions.item(0).text;
    this.model.icType = newType;
    if(currentType === "Place" || newType === "Place"){
      this.renderDetailsView();
    }
  },
  selectInitialConditionSpecies: function (e) {
    var name = e.target.selectedOptions.item(0).text;
    var specie = this.getSpecieFromSpecies(name);
    this.model.specie = specie || this.model.specie;
  },
  subviews: {
    inputCount: {
      hook: 'count-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'count',
          label: '',
          tests: tests.valueTests,
          modelKey: 'count',
          valueType: 'number',
          value: this.model.count,
        });
      },
    }
  }
});