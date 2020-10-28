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

var _ = require('underscore');
var $ = require('jquery');
//models
var Model = require('../models/settings');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SimSettingsView = require('./simulation-settings');
var SimulationSettingsViewer = require('./simulation-settings-viewer');
var ParamSweepSettingsView = require('./parameter-sweep-settings');
var ParameterSweepSettingsViewer = require('./parameter-sweep-settings-viewer');
var ModelExploreSettingsView = require('./model-exploration-settings');
var WorkflowStateButtonsView = require('./workflow-state-buttons');
//templates
var template = require('../templates/includes/workflowEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-settings]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.settings = new Model(attrs.settings);
    this.type = attrs.type;
    this.status = attrs.status;
  },
  update: function (e) {
  },
  updateValid: function (e) {
  },
  render: function() {
    View.prototype.render.apply(this, arguments);
    if(this.status === "new" || this.status === "ready"){
      this.renderSimulationSettingView()
      if(this.type === "parameterSweep"){
        this.validatePsweep()
        this.renderParameterSweepSettingsView()
      }else if(this.type === "modelExploration") {
        this.renderModelExplorationSettings()
      }
      this.renderWorkflowStateButtons()
    }else{
      this.collapseContainer()
      this.renderSimulationSettingViewer()
      if(this.type === "parameterSweep"){
        this.renderParameterSweepSettingsViewer()
      }
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  renderSimulationSettingView: function () {
    let simulationSettingsView = new SimSettingsView({
      parent: this,
      model: this.settings.simulationSettings,
      stochssModel: this.model
    });
    this.registerRenderSubview(simulationSettingsView, 'sim-settings-container');
  },
  renderSimulationSettingViewer: function () {
    let simulationSettingsViewer = new SimulationSettingsViewer({
      parent: this,
      model: this.settings.simulationSettings,
    })
    this.registerRenderSubview(simulationSettingsViewer, 'sim-settings-container');
  },
  renderParameterSweepSettingsViewer: function () {
    let parameterSweepSettingsViewer = new ParameterSweepSettingsViewer({
      parent: this,
      model: this.settings.parameterSweepSettings,
    });
    this.registerRenderSubview(parameterSweepSettingsViewer, 'param-sweep-settings-container');
  },
  renderParameterSweepSettingsView: function () {
    let parameterSweepSettingsView = new ParamSweepSettingsView({
      parent: this,
      model: this.settings.parameterSweepSettings,
      stochssModel: this.model
    });
    this.registerRenderSubview(parameterSweepSettingsView, 'param-sweep-settings-container');
  },
  renderModelExplorationSettings: function () {
    if(this.modelExplorationSettings) {
      this.modelExplorationSettings.remove()
    }
    this.modelExplorationSettings = new ModelExploreSettingsView({
      parent: this,
      model: this.settings.modelExplorationSettings,
      stochssModel: this.model
    });
    this.registerRenderSubview(this.modelExplorationSettings, 'model-exploration-settings-container')
  },
  renderWorkflowStateButtons: function () {
    if(this.workflowStateButtons) {
      this.workflowStateButtons.remove()
    }
    this.workflowStateButtons = new WorkflowStateButtonsView({
      model: this.model,
      type: this.type,
    });
    this.registerRenderSubview(this.workflowStateButtons, 'workflow-state-buttons-container');
  },
  validatePsweep: function () {
    let species = this.model.species;
    var valid = this.validatePsweepChild(species, this.settings.parameterSweepSettings.speciesOfInterest)
    if(!valid) // if true update species of interest
      this.settings.parameterSweepSettings.speciesOfInterest = species.at(0)
    var parameters = this.model.parameters;
    var valid = this.validatePsweepChild(parameters, this.settings.parameterSweepSettings.parameterOne)
    if(!valid) { // if true update parameter one
      let param = parameters.at(0)
      this.settings.parameterSweepSettings.parameterOne = param
      let val = eval(param.expression)
      this.settings.parameterSweepSettings.p1Min = val * 0.5
      this.settings.parameterSweepSettings.p1Max = val * 1.5
    }
    if(parameters.at(1)){ // is there more than one parameter
      var valid = this.validatePsweepChild(parameters, this.settings.parameterSweepSettings.parameterTwo)
      if(!valid){ // if true update parameter 2
        let param = parameters.at(1)
        this.settings.parameterSweepSettings.parameterTwo = param
        let val = eval(param.expression)
        this.settings.parameterSweepSettings.p2Min = val * 0.5
        this.settings.parameterSweepSettings.p2Max = val * 1.5
      }
    }
  },
  validatePsweepChild: function (collection, child) {
    if(!child.compID) // if true child is not set
      return false
    let exists = Boolean(collection.filter(function (model) {
      if(child.compID === model.compID)
        return model
    }).length) // if true child exits within the model
    return exists
  },
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
  },
  collapseContainer: function () {
    $(this.queryByHook("workflow-editor-container")).collapse()
    $(this.queryByHook("collapse-settings")).click()
  },
});