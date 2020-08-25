var $ = require('jquery');
//views
var View = require('ampersand-view');
var WorkflowGroupView = require('./workflow-group-viewer');
//templates
var template = require('../templates/includes/workflowGroupsViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-workflow-groups]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.renderCollection(this.collection, WorkflowGroupView, this.queryByHook('workflow-group-container'))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-workflow-groups')).text();
    text === '+' ? $(this.queryByHook('collapse-workflow-groups')).text('-') : $(this.queryByHook('collapse-workflow-groups')).text('+');
  }
})