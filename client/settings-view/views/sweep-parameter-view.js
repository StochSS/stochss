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
let InputView = require('../../views/input');
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
//templates
let editTemplate = require('../templates/editSweepParameter.pug');
let viewTemplate = require('../templates/viewSweepParameter.pug');

module.exports = View.extend({
  events: function () {
    let events = {};
    events['change [data-hook=' + this.model.elementID + '-sweep-target]'] = 'setSelectedTarget';
    events['change [data-hook=' + this.model.elementID + '-target-min]'] = 'setHasChangedRange';
    events['change [data-hook=' + this.model.elementID + '-target-max]'] = 'setHasChangedRange';
    events['change [data-hook=' + this.model.elementID + '-target-steps]'] = 'updateViewer';
    events['click [data-hook=' + this.model.elementID + '-remove'] = 'removeSweepParameter';
    return events;
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    let self = this;
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    this.parameters = attrs.stochssParams;
    this.parameter = this.parameters.filter(function (param) {
      return param.compID === self.model.paramID;
    })[0];
    if(!this.viewMode) {
      this.model.updateVariable(this.parameter);
      this.model.collection.on('add update-target remove', this.renderTargetSelectView, this);
    }
  },
  render: function (attrs, options) {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    if(!this.viewMode){
      this.renderTargetSelectView();
      this.renderMinValInputView();
      this.renderMaxValInputView();
      this.renderStepsInputView();
    }
  },
  getAvailableParameters: function () {
    let variableTargets = this.model.collection.map(function (variable) { return variable.paramID});
    let availableParameters = this.parameters.filter(function (param) {
      return !variableTargets.includes(param.compID);
    }).map(function (param) { return param.name });
    if(!availableParameters.includes(this.parameter.name)) {
      availableParameters.push(this.parameter.name);
    }
    return availableParameters;
  },
  removeSweepParameter: function () {
    this.model.collection.off('add update-target remove', this.renderTargetSelectView, this);
    this.model.collection.removeSweepParameter(this.model);
    this.remove();
  },
  renderMaxValInputView: function () {
    if(this.maxValInputView) {
      this.maxValInputView.remove();
    }
    this.maxValInputView = new InputView({
      parent: this,
      required: true,
      name: 'max-value',
      tests: tests.valueTests,
      modelKey: 'max',
      valueType: 'number',
      value: this.model.max
    });
    app.registerRenderSubview(this, this.maxValInputView, this.model.elementID + "-target-max");
  },
  renderMinValInputView: function () {
    if(this.minValInputView) {
      this.minValInputView.remove();
    }
    this.minValInputView = new InputView({
      parent: this,
      required: true,
      name: 'min-value',
      tests: tests.valueTests,
      modelKey: 'min',
      valueType: 'number',
      value: this.model.min
    });
    app.registerRenderSubview(this, this.minValInputView, this.model.elementID + "-target-min");
  },
  renderStepsInputView: function () {
    if(this.stepsInputView) {
      this.stepsInputView.remove();
    }
    this.stepsInputView = new InputView({
      parent: this,
      required: true,
      name: 'steps',
      tests: tests.valueTests,
      modelKey: 'steps',
      valueType: 'number',
      value: this.model.steps
    });
    app.registerRenderSubview(this, this.stepsInputView, this.model.elementID + "-target-steps");
  },
  renderTargetSelectView: function (e) {
    if(this.vieWMode) { return }
    if(this.targetSelectView) {
      this.targetSelectView.remove();
    }
    let options = this.getAvailableParameters();
    this.targetSelectView = new SelectView({
      name: 'variable-target',
      required: true,
      idAttribute: 'cid',
      options: options,
      value: this.parameter.name
    });
    app.registerRenderSubview(this, this.targetSelectView, this.model.elementID + "-sweep-target");
  },
  setHasChangedRange: function () {
    this.model.hasChangedRange = true;
    this.updateViewer();
  },
  setSelectedTarget: function (e) {
    let targetName = e.target.value;
    this.parameter = this.parameters.filter(function (param) {
      return param.name === targetName;
    })[0];
    this.model.paramID = this.parameter.compID;
    this.model.name = this.parameter.name;
    this.model.hasChangedRange = false;
    this.model.updateVariable(this.parameter);
    this.parent.renderEditSweepParameters();
    this.updateViewer();
  },
  update: function () {},
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewSweepParameters();
  }
});
