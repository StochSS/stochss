var path = require('path');
var $ = require('jquery');
//Views
var View = require('ampersand-view');
var ModelsCollectionView = require('./models-viewer');
var ExperimentsCollectionView = require('./experiments-viewer');
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
    this.renderExperimentsCollection()
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
  renderExperimentsCollection: function () {
    if(this.experimentsCollectionView) {
      this.experimentsCollectionView.remove()
    }
    this.experimentsCollectionView = new ExperimentsCollectionView({
      collection: this.model.experiments
    });
    this.registerRenderSubview(this.experimentsCollectionView, "experiments-collection-container")
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-project')).text();
    text === '+' ? $(this.queryByHook('collapse-project')).text('-') : $(this.queryByHook('collapse-project')).text('+');
  }
});