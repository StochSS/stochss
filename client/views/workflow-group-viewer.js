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
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
  }
})