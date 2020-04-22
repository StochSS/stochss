var _ = require('underscore');
var $ = require('jquery');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SimSettingsView = require('./simulation-settings');
var ParamSweepSettingsView = require('./parameter-sweep-settings');
var WorkflowStateButtonsView = require('./workflow-state-buttons');
//templates
var template = require('../templates/includes/workflowEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
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
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  renderSimulationSettingView: function () {
    let simulationSettingsView = new SimSettingsView({
      parent: this,
      model: this.model.simulationSettings,
    });
    this.registerRenderSubview(simulationSettingsView, 'sim-settings-container');
  },
  renderParameterSweepSettingsView: function () {
    let parameterSweepSettingsView = new ParamSweepSettingsView({
      parent: this,
      model: this.model.parameterSweepSettings,
    });
    this.registerRenderSubview(parameterSweepSettingsView, 'param-sweep-settings-container');
  },
  renderWorkflowStateButtons: function () {
    let workflowStateButtons = new WorkflowStateButtonsView({
      model: this.model
    });
    this.registerRenderSubview(workflowStateButtons, 'workflow-state-buttons-container');
  },
  validatePsweep: function () {
    let species = this.model.species;
    var valid = this.validatePsweepChild(species, this.model.parameterSweepSettings.speciesOfInterest)
    if(!valid) // if true update species of interest
      this.model.parameterSweepSettings.speciesOfInterest = species.at(0)
    var parameters = this.model.parameters;
    var valid = this.validatePsweepChild(parameters, this.model.parameterSweepSettings.parameterOne)
    if(!valid) { // if true update parameter one
      let param = parameters.at(0)
      this.model.parameterSweepSettings.parameterOne = param
      let val = eval(param.expression)
      this.model.parameterSweepSettings.p1Min = val * 0.5
      this.model.parameterSweepSettings.p1Max = val * 1.5
    }
    if(parameters.at(1)){ // is there more than one parameter
      var valid = this.validatePsweepChild(parameters, this.model.parameterSweepSettings.parameterTwo)
      if(!valid){ // if true update parameter 2
        let param = parameters.at(1)
        this.model.parameterSweepSettings.parameterTwo = param
        let val = eval(param.expression)
        this.model.parameterSweepSettings.p2Min = val * 0.5
        this.model.parameterSweepSettings.p2Max = val * 1.5
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
  collapseContainer: function () {
    $(this.queryByHook("workflow-editor-container")).collapse();
  },
});