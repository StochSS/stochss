var $ = require('jquery');
//views
var View = require('ampersand-view');
var WorkflowCollectionsViewer = require('./workflows-viewer');
//templates
var template = require('../templates/includes/workflowGroupViewer.pug')

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-workflow-group]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.renderWorkflowsCollectionViewer()
  },
  renderWorkflowsCollectionViewer: function () {
    if(this.workflowsCollectionViewer) {
      this.workflowsCollectionViewer.remove()
    }
    this.workflowsCollectionViewer = new WorkflowCollectionsViewer({
      collection: this.model.workflows
    });
    this.registerRenderSubview(this.workflowsCollectionViewer, "workflows-viewer-container")
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-workflow-group')).text();
    text === '+' ? $(this.queryByHook('collapse-workflow-group')).text('-') : $(this.queryByHook('collapse-workflow-group')).text('+');
  }
})