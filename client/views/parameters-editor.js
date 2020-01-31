var $ = require('jquery');
//views
var View = require('ampersand-view');
var EditParameterView = require('./edit-parameter');
//templates
var template = require('../templates/includes/parametersEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-parameter]' : 'addParameter',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    var self = this;
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = {"name":"Names for species, parameters, reactions, events, and rules must be unique.",
                     "expression":"A parameter value or a mathematical expression calculating the parameter value.",
                     "annotation":"An optional note about a parameter.",
                    }
    this.collection.on('update-parameters', function (compID, parameter) {
      self.collection.parent.reactions.map(function (reaction) {
        if(reaction.rate && reaction.rate.compID === compID){
          reaction.rate = parameter;
        }
      });
      self.collection.parent.eventsCollection.map(function (event) {
        event.eventAssignments.map(function (assignment) {
          if(assignment.variable.compID === compID) {
            assignment.variable = parameter;
          }
        })
        if(event.selected)
          event.detailsView.renderEventAssignments();
      });
      self.collection.parent.rules.map(function (rule) {
        if(rule.variable.compID === compID) {
          rule.variable = parameter;
        }
      });
      self.parent.renderRulesView();
    });
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderEditParameter();
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderEditParameter: function () {
    if(this.editParameterView){
      this.editParameterView.remove();
    }
    this.editParameterView = this.renderCollection(
      this.collection,
      EditParameterView,
      this.queryByHook('parameter-list')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  addParameter: function () {
    this.collection.addParameter();
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