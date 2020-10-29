let $ = require('jquery');
//views
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
let VariablesCollectionView = require('./model-exploration-variables');
//templates
let template = require('../templates/includes/modelExplorationSettings.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=distribution-type]' : 'selectDistributionType',
    'click [data-hook=add-me-variable]' : 'handleAddVariableClick',
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
    this.stochssModel = attrs.stochssModel
    this.model.variables.on("add remove", function () {
      let disable = this.model.variables.length >= 2 || this.model.variables.length >= this.stochssModel.parameters.length
      $(this.queryByHook("add-me-variable")).prop("disabled", disable)
    }, this)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.renderDistributionTypeSelect();
    this.renderExplorationTypeSelect();
    this.renderFeatureExtractionSelect();
    this.model.updateVariables(this.stochssModel.parameters)
    this.renderVariablesCollection()
  },
  renderDistributionTypeSelect: function () {
    let options = ["Uniform", "Factorial", "Latin Hypercube"]
    var distributionTypeView = new SelectView({
      label: '',
      name: 'distribution-type',
      required: true,
      idAttribute: 'cid',
      options: options,
      value: this.model.distributionType
    });
    this.registerRenderSubview(distributionTypeView, "distribution-type")
  },
  renderExplorationTypeSelect: function () {
    let options = ["Basic Exploration"]
    var explorationTypeView = new SelectView({
      label: '',
      name: 'distribution-type',
      required: true,
      idAttribute: 'cid',
      options: options,
      value: "Basic Exploration"
    });
    this.registerRenderSubview(explorationTypeView, "exploration-type")
  },
  renderFeatureExtractionSelect: function () {
    let options = ["Minimum of population", "Maximum of population", "Average of population",
                   "Variance of population", "Population at last time point"]
    var featureExtractionView = new SelectView({
      label: '',
      name: 'distribution-type',
      required: true,
      idAttribute: 'cid',
      options: options,
      value: "Population at last time point"
    });
    this.registerRenderSubview(featureExtractionView, "feature-extraction")
  },
  renderVariablesCollection: function () {
    if(this.variablesView) {
      this.variablesView.remove()
    }
    this.variablesView = new VariablesCollectionView({
      parent: this,
      collection: this.model.variables,
      distributionType: this.model.distributionType,
      stochssModel: this.stochssModel
    });
    this.registerRenderSubview(this.variablesView, "me-variables-collection")
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  selectDistributionType: function (e) {
    let type = e.target.selectedOptions.item(0).text;
    this.model.distributionType = type;
    this.renderVariablesCollection()
  },
  getParameterID: function () {
    let variableTargets = this.model.variables.map(function (variable) { return variable.paramID });
    let target = this.stochssModel.parameters.filter(function (param) {
      return !variableTargets.includes(param.compID)
    })[0].compID
    return target
  },
  handleAddVariableClick: function () {
    let target = this.getParameterID()
    this.model.variables.addVariable(target)
  },
  changeCollapseButtonText: function (e) {
    if(e.target.dataset && e.target.dataset.toggle === "collapse") {
      let source = e.target.dataset.hook
      let collapseContainer = $(this.queryByHook(source).dataset.target)
      if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
        let collapseBtn = $(this.queryByHook(source))
        let text = collapseBtn.text();
        text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
      }
    }
  }
});