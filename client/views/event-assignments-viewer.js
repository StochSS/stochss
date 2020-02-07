//views
var View = require('ampersand-view');
var ViewAssignments = require('./view-event-assignments');
//templates
var template = require('../templates/includes/eventAssignmentsViewer.pug');

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ViewAssignments, 'view-event-assignments-list');
  },
});