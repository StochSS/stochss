let $ = require('jquery');
//views
let View = require('ampersand-view');
let VariableView = require('./model-exploration-variable');
//templates
let template = require('../templates/includes/modelExplorationVariables.pug');

module.exports = View.extend({
  template: template,
  events: {},
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.distributionType = attrs.distributionType
    this.stochssModel = attrs.stochssModel
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderVariablesCollection()
  },
  update: function (e) {},
  updateValid: function (e) {},
  renderVariablesCollection: function () {
    if(this.variablesCollection) {
      this.variablesCollection.remove()
    }
    this.variablesCollection = this.renderCollection(
      this.collection,
      VariableView,
      this.queryByHook("me-variables")
    )
  }
});