let $ = require('jquery');
//views
let View = require('ampersand-view');
var SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/includes/modelExplorationSettings.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=distribution-type]' : 'selectDistributionType',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.renderDistributionTypeSelect();
    this.renderExplorationTypeSelect();
    this.renderFeatureExtractionSelect();
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
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  selectDistributionType: function (e) {
    let typeDict = {"Uniform":"uniform-prior", "Factorial":"factorial", "Latin Hypercube":"latin-hypercube"}
    let type = e.target.selectedOptions.item(0).text;
    this.model.distributionType = type;
    $(this.queryByHook(typeDict[type])).css("display", "block")
    if(type === "Uniform") {
      $(this.queryByHook("factorial")).css("display", "none")
      $(this.queryByHook("latin-hypercube")).css("display", "none")
    }else if(type === "Factorial") {
      $(this.queryByHook("uniform-prior")).css("display", "none")
      $(this.queryByHook("latin-hypercube")).css("display", "none")
    }else{
      $(this.queryByHook("uniform-prior")).css("display", "none")
      $(this.queryByHook("factorial")).css("display", "none")
    }
  }
});