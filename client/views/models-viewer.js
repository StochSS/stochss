var $ = require('jquery');
//views
var View = require('ampersand-view');
var ModelViewer = require('./model-viewer');
//templates
var template = require('../templates/includes/modelsViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-models]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ModelViewer, this.queryByHook('model-container'))
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