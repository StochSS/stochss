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
  renderWorkflowStateButtons: function () {
    let workflowStateButtons = new WorkflowStateButtonsView({
      model: this.model,
      type: this.type,
    });
    this.registerRenderSubview(workflowStateButtons, 'workflow-state-buttons-container');
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
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-settings')).text();
    text === '+' ? $(this.queryByHook('collapse-settings')).text('-') : $(this.queryByHook('collapse-settings')).text('+');
  },
  collapseContainer: function () {
    $(this.queryByHook("workflow-editor-container")).collapse()
    this.changeCollapseButtonText()
  },
});