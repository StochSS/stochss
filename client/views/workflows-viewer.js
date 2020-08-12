var $ = require('jquery');
//views
var View = require('ampersand-view');
var WorkflowViewer = require('./workflow-viewer');
//templates
var template = require('../templates/includes/workflowsViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-workflows]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.renderCollection(this.collection, WorkflowViewer, this.queryByHook('workflow-container'))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-workflows')).text();
    text === '+' ? $(this.queryByHook('collapse-workflows')).text('-') : $(this.queryByHook('collapse-workflows')).text('+');
  }
})