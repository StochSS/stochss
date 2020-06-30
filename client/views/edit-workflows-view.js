//views
var View = require('ampersand-view');
var EditWorkflowView = require('./edit-workflow-view');
//templates
var template = require('../templates/includes/editWorkflowsView.pug');

module.exports = View.extend({
  template: template,
  events: {},
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.renderCollection(this.collection, EditWorkflowView, this.queryByHook("project-workflows-list"))
  }
});