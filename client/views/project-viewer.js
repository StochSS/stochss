var path = require('path');
var $ = require('jquery');
//Views
var View = require('ampersand-view');
var ModelsCollectionView = require('./models-viewer');
var WorkflowGroupsCollectionView = require('./workflow-groups-viewer');
//templates
var template = require('../templates/includes/projectViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-project]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
    this.name = attrs.name
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.renderModelsCollection()
    this.renderWorkflowGroupsCollection()
  },
  renderModelsCollection: function () {
    if(this.modelsCollectionView) {
      this.modelsCollectionView.remove()
    }
    this.modelsCollectionView = new ModelsCollectionView({
      collection: this.model.models
    });
    this.registerRenderSubview(this.modelsCollectionView, "models-collection-container")
  },
  renderWorkflowGroupsCollection: function () {
    if(this.workflowGroupsCollectionView) {
      this.workflowGroupsCollectionView.remove()
    }
    this.workflowGroupsCollectionView = new WorkflowGroupsCollectionView({
      collection: this.model.workflowGroups
    });
    this.registerRenderSubview(this.workflowGroupsCollectionView, "workflow-groups-collection-container")
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
});