let $ = require('jquery');
let tests = require('./tests');
//views
let View = require('ampersand-view');
let InputView = require('./input');
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/includes/modelExplorationVariable.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=variable-target]' : 'setSelectedTarget',
    'change [data-hook=variable-min]' : 'setHasChangedRange',
    'change [data-hook=variable-max]' : 'setHasChangedRange',
    'click [data-hook=remove]' : 'removeVariable'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    let self = this
    this.distributionType = this.parent.distributionType
    this.parameters = this.parent.stochssModel.parameters
    this.parameter = this.parameters.filter(function (param) {
      return param.compID === self.model.paramID
    })[0]
    this.model.updateVariable(this.parameter)
    this.model.collection.on('add update-target remove', this.registerTargetSelectView, this)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.registerTargetSelectView()
    this.renderMinValInputView()
    this.renderMaxValInputView()
    if(this.parent.parent.model.distributionType === "Uniform"){
      this.renderStepsInputView()
    }else if(this.parent.parent.model.distributionType === "Factorial") {
      this.renderLevelInputView()
      this.renderOutliersInputView()
    }else if(this.parent.parent.model.distributionType === "Latin Hypercube") {
      this.renderSeedSizeInputView()
    }
  },
  update: function (e) {},
  updateValid: function (e) {},
  registerTargetSelectView: function (e) {
    if(this.model.collection) {
      if(this.targetSelectView) {
        this.targetSelectView.remove()
      }
      let options = this.getAvailableParameters();
      this.targetSelectView = new SelectView({
        label: '',
        name: 'variable-target',
        required: true,
        idAttribute: 'cid',
        options: options,
        value: this.parameter.name
      });
      this.registerRenderSubview(this.targetSelectView, "variable-target")
    }
  },
  renderMinValInputView: function () {
    if(this.minValInputView) {
      this.minValInputView.remove()
    }
    this.minValInputView = new InputView({
      parent: this,
      required: true,
      name: 'min-value',
      label: '',
      tests: tests.valueTests,
      modelKey: 'min',
      valueType: 'number',
      value: this.model.min,
    });
    this.registerRenderSubview(this.minValInputView, "variable-min")
  },
  renderMaxValInputView: function () {
    if(this.maxValInputView) {
      this.maxValInputView.remove()
    }
    this.maxValInputView = new InputView({
      parent: this,
      required: true,
      name: 'max-value',
      label: '',
      tests: tests.valueTests,
      modelKey: 'max',
      valueType: 'number',
      value: this.model.max,
    });
    this.registerRenderSubview(this.maxValInputView, "variable-max")
  },
  renderStepsInputView: function () {
    if(this.stepsInputView) {
      this.stepsInputView.remove()
    }
    this.stepsInputView = new InputView({
      parent: this,
      required: true,
      name: 'steps',
      label: '',
      tests: tests.valueTests,
      modelKey: 'steps',
      valueType: 'number',
      value: this.model.steps,
    });
    this.registerRenderSubview(this.stepsInputView, "variable-steps")
  },
  renderLevelInputView: function () {
    if(this.levelInputView) {
      this.levelInputView.remove()
    }
    this.levelInputView = new InputView({
      parent: this,
      required: true,
      name: 'level',
      label: '',
      tests: tests.valueTests,
      modelKey: 'level',
      valueType: 'number',
      value: this.model.level,
    });
    this.registerRenderSubview(this.levelInputView, "variable-level")
  },
  renderOutliersInputView: function () {
    if(this.outliersInputView) {
      this.outliersInputView.remove()
    }
    this.outliersInputView = new InputView({
      parent: this,
      required: false,
      name: 'outliers',
      label: '',
      tests: [],
      modelKey: 'outliers',
      valueType: 'string',
      value: this.model.outliers,
      placeholder: "--Enter Outliers--"
    });
    this.registerRenderSubview(this.outliersInputView, "variable-outliers")
  },
  renderSeedSizeInputView: function () {
    if(this.seedSizeInputView) {
      this.seedSizeInputView.remove()
    }
    this.seedSizeInputView = new InputView({
      parent: this,
      required: true,
      name: 'seed-size',
      label: '',
      tests: tests.valueTests,
      modelKey: 'seedSize',
      valueType: 'number',
      value: this.model.seedSize,
    });
    this.registerRenderSubview(this.seedSizeInputView, "variable-seed-size")
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  getAvailableParameters: function () {
    let variableTargets = this.model.collection.map(function (variable) { return variable.paramID})
    let availableParameters = this.parameters.filter(function (param) {
      return !variableTargets.includes(param.compID)
    }).map(function (param) { return param.name });
    if(!availableParameters.includes(this.parameter.name)) {
      availableParameters.push(this.parameter.name)
    }
    return availableParameters
  },
  setSelectedTarget: function (e) {
    let targetName = e.target.selectedOptions.item(0).text;
    this.parameter = this.parameters.filter(function (param) {
      return param.name === targetName
    })[0]
    let targetID = this.parameter.compID
    this.model.paramID = targetID
    this.updateVariableProps()
    this.model.collection.trigger('update-target')
  },
  setHasChangedRange: function () {
    this.model.hasChangedRange = true
  },
  updateVariableProps: function () {
    $(this.queryByHook("target-value")).text(this.parameter.expression)
    this.model.hasChangedRange = false
    this.model.updateVariable(this.parameter)
    this.renderMinValInputView()
    this.renderMaxValInputView()
    if(this.parent.parent.model.distributionType === "Uniform"){
      this.renderStepsInputView()
    }else if(this.parent.parent.model.distributionType === "Factorial") {
      this.renderLevelInputView()
      this.renderOutliersInputView()
    }else if(this.parent.parent.model.distributionType === "Latin Hypercube") {
      this.renderSeedSizeInputView()
    }
  },
  removeVariable: function () {
    // console.log("Removing variable targeting " + this.parameter.name)
    this.remove()
    this.model.collection.removeVariable(this.model)
    this.remove()
  }
});