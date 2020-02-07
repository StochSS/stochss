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
    this.collection.parent.species.on('add remove', this.toggleAddRuleButton, this);
    this.collection.parent.parameters.on('add remove', this.toggleAddRuleButton, this);
    this.tooltips = {"name":"Names for species, parameters, reactions, events, and rules must be unique.",
                     "type":"Assignment Rules: An assignment rule describes a change to a Species or "+
                            "Parameter as a function whose left-hand side is a scalar (i.e. x = f(V), "+
                            "where V is a vector of symbols, not including x).<br>  Rate Rules: A rate "+
                            "rule describes a change to a Species or Parameter as a function whose "+
                            "left-hand side is a rate of change (i.e. dx/dt = f(W), where W is a vector "+
                            "of symbols which may include x).",
                     "variable":"Target variable to be modified by the Rule's formula.",
                     "expression":"A Python evaluable mathematical expression representing the "+
                            "right hand side of a rule function.<br>  For Assignment Rules, this "+
                            "represents the right hand side of a scalar equation.<br>  For Rate Rules, "+
                            "this represents the right hand side of a rate-of-change equation.",
                     "annotation":"An optional note about a rule."
                    }
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderRules();
    this.toggleAddRuleButton()
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderRules: function () {
    if(this.rulesView) {
      this.rulesView.remove();
    }
    this.rulesView = this.renderCollection(
      this.collection,
      RuleView,
      this.queryByHook('rule-list-container')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  toggleAddRuleButton: function () {
    this.renderRules();
    var numSpecies = this.collection.parent.species.length;
    var numParameters = this.collection.parent.parameters.length;
    var disabled = numSpecies <= 0 && numParameters <= 0
    $(this.queryByHook('add-rule')).prop('disabled', disabled);
  },
  addRule: function (e) {
    var type = e.target.dataset.name
    this.collection.addRule(type);
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});