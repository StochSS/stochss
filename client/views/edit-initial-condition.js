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
let _ = require('underscore');
//support files
let app = require('../app');
var tests = require('./tests');
let modals = require('../modals');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
var TypesView = require('./component-types');
//templates
let editTemplate = require('../templates/includes/editInitialCondition.pug');
let viewTemplate = require('../templates/includes/viewInitialCondition.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeInitialCondition',
    'change [data-hook=initial-condition-type]' : 'selectInitialConditionType',
    'change [data-hook=initial-condition-species]' : 'selectInitialConditionSpecies'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.modelType = "initial-condition";
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    if(this.viewMode) {
      let self = this;
      this.types = [];
      this.model.types.forEach(function (index) {
        let type = self.model.collection.parent.domain.types.get(index, "typeID");
        self.types.push(type.name)
      });
    }
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    if(!this.viewMode) {
      this.model.on('change', _.bind(this.updateViewer, this));
    }
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
    });
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add')
    }
    this.toggleDetailsView();
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#initialConditionAnnotationModal')) {
      document.querySelector('#initialConditionAnnotationModal').remove();
    }
    let modal = $(modals.annotationModalHtml("initialCondition", name, annotation)).modal();
    let okBtn = document.querySelector('#initialConditionAnnotationModal .ok-model-btn');
    let input = document.querySelector('#initialConditionAnnotationModal #initialConditionAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value.trim();
      self.parent.renderEditInitialConditionsView();
      modal.modal('hide');
    });
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
  selectInitialConditionSpecies: function (e) {
    var name = e.target.selectedOptions.item(0).text;
    var specie = this.getSpecieFromSpecies(name);
    this.model.specie = specie || this.model.specie;
    this.model.trigger('change');
  },
  selectInitialConditionType: function (e) {
    var currentType = this.model.icType;
    var newType = e.target.selectedOptions.item(0).text;
    this.model.icType = newType;
    if(currentType === "Place" || newType === "Place"){
      this.toggleDetailsView();
    }
  },
  toggleDetailsView: function () {
    if(this.model.icType === "Place") {
      $(this.queryByHook("scatter-details")).css("display", "none")
      $(this.queryByHook("place-details")).css("display", "block")
    }else {
      $(this.queryByHook("place-details")).css("display", "none")
      $(this.queryByHook("scatter-details")).css("display", "block")
    }
  },
  update: function () {},
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewInitialConditionsView();
  },
  subviews: {
    selectICType: {
      hook: 'initial-condition-type',
      prepareView: function (el) {
        let options = ['Scatter', 'Place', 'Distribute Uniformly per Voxel'];
        return new SelectView({
          name: 'type',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.icType,
        });
      }
    },
    selectSpecies: {
      hook: 'initial-condition-species',
      prepareView: function (el) {
        return new SelectView({
          name: 'specie',
          required: true,
          idAttribute: 'cid',
          textAttribute: 'name',
          eagerValidate: true,
          options: this.model.collection.parent.species,
          value: this.model.specie.name ? this.getSpecieFromSpecies(this.model.specie.name) : this.model.collection.parent.species.at(0),
        });
      }
    },
    inputCount: {
      hook: 'count-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'count',
          tests: tests.valueTests,
          modelKey: 'count',
          valueType: 'number',
          value: this.model.count,
        });
      }
    },
    typesView: {
      hook: 'initial-condition-types',
      prepareView: function (el) {
        return this.renderCollection(
          this.model.collection.parent.domain.types,
          TypesView,
          this.queryByHook("initial-condition-types"),
          {"filter": function (model) {
            return model.typeID != 0;
          }}
        );
      }
    },
    inputXCoord: {
      hook: 'x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'X',
          valueType: 'number',
          modelKey: "x",
          label: 'x: ',
          tests: tests.valueTests,
          value: this.model.x
        });
      }
    },
    inputYCoord: {
      hook: 'y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'Y',
          valueType: 'number',
          modelKey: "y",
          label: 'y: ',
          tests: tests.valueTests,
          value: this.model.y
        });
      }
    },
    inputZCoord: {
      hook: 'z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'Z',
          valueType: 'number',
          modelKey: "z",
          label: 'z: ',
          tests: tests.valueTests,
          value: this.model.z
        });
      }
    }
  }
});