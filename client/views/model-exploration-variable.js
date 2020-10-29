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
  },
  update: function (e) {},
  updateValid: function (e) {},
  registerTargetSelectView: function () {
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
  updateVariableProps: function () {
    $(this.queryByHook("target-value")).text(this.parameter.expression)
    this.model.hasChangedRange = false
    this.model.updateVariable(this.parameter)
    this.renderMinValInputView()
  }
});