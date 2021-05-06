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

var $ = require('jquery');
//support files
let app = require('../app');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var SelectView = require('ampersand-select-view');
var InputView = require('./input');
//templates
var template = require('../templates/includes/editAdvancedSpecie.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=switching-tol]' : 'setSwitchingType',
    'change [data-hook=switching-min]' : 'setSwitchingType',
    'change [data-hook=specie-mode]' : 'setSpeciesMode',
  },
  initialize: function () {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var optionDict = {"continuous":"Concentration", "discrete":"Population", "dynamic":"Hybrid Concentration/Population"}
    var modeSelectView = new SelectView({
      label: '',
      name: 'mode',
      required: true,
      idAttributes: 'cid',
      options: ['Concentration','Population','Hybrid Concentration/Population'],
      value: optionDict[this.model.mode],
    });
    app.registerRenderSubview(this, modeSelectView, "specie-mode")
    if(this.model.isSwitchTol){
      $(this.queryByHook('switching-tol')).prop('checked', true);
    }else{
      $(this.queryByHook('switching-min')).prop('checked', true);
    }
    this.toggleSwitchingSettings();
    this.updateInputValidation();
  },
  update: function () {
  },
  updateValid: function () {
  },
  setSpeciesMode: function (e) {
    var value = e.target.selectedOptions.item(0).text
    var modeDict = {"Concentration":"continuous","Population":"discrete","Hybrid Concentration/Population":"dynamic"}
    this.model.mode = modeDict[value]
    this.model.collection.trigger('update-species', this.model.compID, this.model, false, false);
    this.updateInputValidation();
    this.toggleSwitchingSettings();
  },
  setSwitchingType: function (e) {
    this.model.isSwitchTol = $(this.queryByHook('switching-tol')).is(":checked");
    this.updateInputValidation();
    this.toggleSwitchingSettingsInput();
  },
  updateInputValidation: function () {
    // Update validation requirements and re-run tests for inputSwitchTol.
    // This removes error reporting not using switching tolerance
    let shouldValidateTol = this.model.mode === "dynamic" && this.model.isSwitchTol
    this.inputSwitchTol.required = shouldValidateTol;
    this.inputSwitchTol.tests = shouldValidateTol ? tests.valueTests : []
    this.inputSwitchTol.runTests()
    // Update validation requirements and re-run tests for inputSwitchMin.
    // This removes error reporting when not using minimum value for switching.
    let shouldValidateMin = this.model.mode === "dynamic" && !this.model.isSwitchTol
    this.inputSwitchMin.required = shouldValidateMin;
    this.inputSwitchMin.tests = shouldValidateMin ? tests.valueTests : []
    this.inputSwitchMin.runTests()
    // Add/Remove 'input-invalid' class from inputSwitchTol and inputSwitchMin based on whether
    // the user is using switching tolerance or minimum value for switching
    let tolInput = $(this.queryByHook('switching-tolerance')).find('input')[0]
    let minInput = $(this.queryByHook('switching-threshold')).find('input')[0]
    if(this.model.mode !== "dynamic") {
      $(tolInput).removeClass('input-invalid')
      $(minInput).removeClass('input-invalid')
    }else if(this.model.isSwitchTol){
      $(minInput).removeClass('input-invalid')
      if(this.model.switchTol === "" || isNaN(this.model.switchTol)){
        $(tolInput).addClass('input-invalid')
      }
    }else{
      $(tolInput).removeClass('input-invalid')
      if(this.model.switchMin === "" || isNaN(this.model.switchMin)){
        $(minInput).addClass('input-invalid')
      }
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
  subviews: {
    inputSwitchTol: {
      hook: 'switching-tolerance',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'switching-tolerance',
          label: '',
          tests: tests.valueTests,
          modelKey: 'switchTol',
          valueType: 'number',
          value: this.model.switchTol,
        });
      },
    },
    inputSwitchMin: {
      hook: 'switching-threshold',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'switching-threshold',
          label: '',
          tests: tests.valueTests,
          modelKey: 'switchMin',
          valueType: 'number',
          value: this.model.switchMin,
        });
      },
    },
  },
});