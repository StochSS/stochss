//views
var View = require('ampersand-view');
var EditWorkflowGroupView = require('./edit-workflow-group-view');
//templates
var template = require('../templates/includes/editWorkflowGroupsView.pug');

module.exports = View.extend({
  template: template,
  events: {},
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, EditWorkflowGroupView, this.queryByHook("project-workflow-groups-list"))
  }
});