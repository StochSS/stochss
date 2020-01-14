var $ = require('jquery');
//views
var View = require('ampersand-view');
var RuleView = require('./edit-rule');
//templates
var template = require('../templates/includes/ruleEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=rate-rule]' : 'addRule',
    'click [data-hook=assignment-rule]' : 'addRule',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (args) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderRules();
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderRules: function () {
    this.renderCollection(
      this.collection,
      RuleView,
      this.queryByHook('rule-list-container')
    );
  },
  addRule: function (e) {
    var type = e.target.dataset.name
    this.collection.addRule(type);
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});