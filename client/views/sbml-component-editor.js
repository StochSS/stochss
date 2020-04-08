var $ = require('jquery');
//views
var View = require('ampersand-view');
var EditFunctionDefinition = require('./edit-function-definition');
//templates
var template = require('../templates/includes/sbmlComponentEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : function () {
      this.changeCollapseButtonText('collapse');
    },
    'click [data-hook=collapse-function-definitions]' : function () {
      this.changeCollapseButtonText('collapse-function-definitions');
    },
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = {"annotation":"An optional note about the Function Definition."}
    this.functionDefinitions = attrs.functionDefinitions;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderEdirFunctionDefinitionView();
  },
  renderEdirFunctionDefinitionView: function () {
    if(this.editFunctionDefinitionView){
      this.editFunctionDefinitionView.remove();
    }
    this.editFunctionDefinitionView = this.renderCollection(
      this.functionDefinitions,
      EditFunctionDefinition,
      this.queryByHook('function-definition-list')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  changeCollapseButtonText: function (hook) {
    var text = $(this.queryByHook(hook)).text();
    text === '+' ? $(this.queryByHook(hook)).text('-') : $(this.queryByHook(hook)).text('+');
  },
});