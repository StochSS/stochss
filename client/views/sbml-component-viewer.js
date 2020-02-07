var $ = require('jquery');
//views
var View = require('ampersand-view');
var ViewFunctionDefinition = require('./view-function-definition');
//templates
var template = require('../templates/includes/sbmlComponentViewer.pug');

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
    this.functionDefinitions = attrs.functionDefinitions;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.functionDefinitions, ViewFunctionDefinition, this.queryByHook('function-definition-list'))
  },
  changeCollapseButtonText: function (hook) {
    var text = $(this.queryByHook(hook)).text();
    text === '+' ? $(this.queryByHook(hook)).text('-') : $(this.queryByHook(hook)).text('+');
  },
});