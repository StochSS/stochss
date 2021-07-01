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
let tests = require('./tests');
let modals = require('../modals');
//views
let InputView = require('./input');
let View = require('ampersand-view');
let TypesView = require('./component-types');
let SelectView = require('ampersand-select-view');
//templates
let editTemplate = require('../templates/includes/editSpecies.pug');
let editSpatialTemplate = require('../templates/includes/editSpatialSpecies.pug');
let viewTemplate = require('../templates/includes/viewSpecies.pug');
let viewSpatialTemplate = require('../templates/includes/viewSpatialSpecies.pug');

module.exports = View.extend({
  bindings: {
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    },
  },
  events: {
    'change [data-hook=input-name-container]' : 'setSpeciesName',
    'change [data-hook=specie-mode]' : 'setSpeciesMode',
    'change [data-hook=switching-tol]' : 'setSwitchingType',
    'change [data-hook=switching-min]' : 'setSwitchingType',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeSpecie',
    'click [data-hook=collapse-advanced]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.modelType = "species";
    this.previousName = this.model.name;
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    if(this.viewMode && this.parent.spatial) {
      let self = this;
      this.types = [];
      if(this.model.types) {
        this.model.types.forEach(function (index) {
          let type = self.model.collection.parent.domain.types.get(index, "typeID");
          self.types.push(type.name);
        });
      }
    }
    if(this.model.mode === null && this.parent.defaultMode !== "") {
      this.model.mode = this.parent.defaultMode;
    }
    this.switchingValWithLabel = this.model.isSwitchTol ? 
      "Switching Tolerance: " + this.model.switchTol :
      "Minimum Value For Switching: " + this.model.switchMin;
  },
  render: function () {
    if(this.parent.spatial){
      this.template = this.viewMode ? viewSpatialTemplate : editSpatialTemplate;
    }else{
      this.template = this.viewMode ? viewTemplate : editTemplate;
    }
    View.prototype.render.apply(this, arguments);
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove();
    });
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add');
    }
    if(this.parent.defaultMode !== "dynamic") {
      $(this.queryByHook("advanced-species")).css("display", "none");
    }else{
      $(this.queryByHook("advanced-species")).css("display", "block");
    }
    if(this.model.isSwitchTol){
      $(this.queryByHook('switching-tol')).prop('checked', true);
    }else{
      $(this.queryByHook('switching-min')).prop('checked', true);
    }
    this.toggleSwitchingSettings();
    this.updateInputValidation();
    if(!this.viewMode){
      this.model.on('change', _.bind(this.updateViewer, this));
      if(this.parent.spatial) {
        this.renderTypes();
      }
    }
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  editAnnotation: function () {
    let self = this;
    let name = this.model.name;
    let annotation = this.model.annotation;
    if(document.querySelector('#speciesAnnotationModal')) {
      document.querySelector('#speciesAnnotationModal').remove();
    }
    let modal = $(modals.annotationModalHtml("species", name, annotation)).modal();
    let okBtn = document.querySelector('#speciesAnnotationModal .ok-model-btn');
    let input = document.querySelector('#speciesAnnotationModal #speciesAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value.trim();
      self.parent.renderEditSpeciesView();
      modal.modal('hide');
    });
  },
  removeSpecie: function () {
    this.remove();
    this.collection.removeSpecie(this.model);
    this.parent.toggleSpeciesCollectionError();
  },
  renderTypes: function () {
    if(this.typesView) {
      this.typesView.remove();
    }
    this.typesView = this.renderCollection(
      this.model.collection.parent.domain.types,
      TypesView,
      this.queryByHook("species-types"),
      {"filter": function (model) {
        return model.typeID != 0;
      }}
    );
  },
  setSpeciesMode: function (e) {
    this.model.mode = e.target.value;
    this.model.collection.trigger('update-species', this.model.compID, this.model, false, false);
    this.updateInputValidation();
    this.toggleSwitchingSettings();
  },
  setSpeciesName: function (e) {
    if(!e.target.value.trim()) {
      this.model.name = this.previousName;
      this.parent.renderEditSpeciesView();
    }else{
      this.previousName = this.model.name;
      this.model.collection.trigger('update-species', this.model.compID, this.model, true, false);
    }
  },
  setSwitchingType: function (e) {
    this.model.isSwitchTol = $(this.queryByHook('switching-tol')).is(":checked");
    this.updateInputValidation();
    this.toggleSwitchingSettingsInput();
  },
  toggleSwitchingSettings: function () {
    if(this.model.mode === "dynamic"){
      $(this.queryByHook('switching-tol')).prop('disabled', false);
      $(this.queryByHook('switching-min')).prop('disabled', false);
      this.toggleSwitchingSettingsInput();
    }else{
      $(this.queryByHook('switching-tol')).prop('disabled', true);
      $(this.queryByHook('switching-min')).prop('disabled', true);
      $(this.queryByHook('switching-threshold')).find('input').prop('disabled', true);
      $(this.queryByHook('switching-tolerance')).find('input').prop('disabled', true);
    }
  },
  toggleSwitchingSettingsInput: function () {
    if(this.model.isSwitchTol){
      $(this.queryByHook('switching-threshold')).find('input').prop('disabled', true);
      $(this.queryByHook('switching-tolerance')).find('input').prop('disabled', false);
    }else{
      $(this.queryByHook('switching-tolerance')).find('input').prop('disabled', true);
      $(this.queryByHook('switching-threshold')).find('input').prop('disabled', false);
    }
  },
  update: function () {},
  updateInputValidation: function () {
    if(this.viewMode || this.parent.spatial) {return}
    // Update validation requirements and re-run tests for inputSwitchTol.
    // This removes error reporting not using switching tolerance
    let shouldValidateTol = this.model.mode === "dynamic" && this.model.isSwitchTol;
    this.inputSwitchTol.required = shouldValidateTol;
    this.inputSwitchTol.tests = shouldValidateTol ? tests.valueTests : [];
    this.inputSwitchTol.runTests();
    // Update validation requirements and re-run tests for inputSwitchMin.
    // This removes error reporting when not using minimum value for switching.
    let shouldValidateMin = this.model.mode === "dynamic" && !this.model.isSwitchTol;
    this.inputSwitchMin.required = shouldValidateMin;
    this.inputSwitchMin.tests = shouldValidateMin ? tests.valueTests : [];
    this.inputSwitchMin.runTests();
    // Add/Remove 'input-invalid' class from inputSwitchTol and inputSwitchMin based on whether
    // the user is using switching tolerance or minimum value for switching
    let tolInput = $(this.queryByHook('switching-tolerance')).find('input')[0];
    let minInput = $(this.queryByHook('switching-threshold')).find('input')[0];
    if(this.model.mode !== "dynamic") {
      $(tolInput).removeClass('input-invalid');
      $(minInput).removeClass('input-invalid');
    }else if(this.model.isSwitchTol){
      $(minInput).removeClass('input-invalid');
      if(this.model.switchTol === "" || isNaN(this.model.switchTol)){
        $(tolInput).addClass('input-invalid');
      }
    }else{
      $(tolInput).removeClass('input-invalid');
      if(this.model.switchMin === "" || isNaN(this.model.switchMin)){
        $(minInput).addClass('input-invalid');
      }
    }
  },
  updateValid: function (e) {},
  updateViewer: function () {
    this.parent.renderViewSpeciesView();
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
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name,
        });
      }
    },
    inputValue: {
      hook: 'input-value-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: this.parent.spatial ? 'diffusion constant' : 'value',
          tests: tests.valueTests,
          modelKey: this.parent.spatial ? 'diffusionConst' : 'value',
          valueType: 'number',
          value: this.parent.spatial ? this.model.diffusionConst : this.model.value,
        });
      }
    },
    selectMode: {
      hook: 'specie-mode',
      prepareView: function (el) {
        options = [['continuous', 'Concentration'], ['discrete', 'Population'],
                   ['dynamic', 'Hybrid Concentration/Population']]
        return new SelectView({
          name: 'mode',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.mode,
        });
      }
    },
    inputSwitchTol: {
      hook: 'switching-tolerance',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'switching-tolerance',
          tests: tests.valueTests,
          modelKey: 'switchTol',
          valueType: 'number',
          value: this.model.switchTol,
        });
      }
    },
    inputSwitchMin: {
      hook: 'switching-threshold',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'switching-threshold',
          tests: tests.valueTests,
          modelKey: 'switchMin',
          valueType: 'number',
          value: this.model.switchMin,
        });
      }
    }
  }
});
