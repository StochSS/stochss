//views
var View = require('ampersand-view');
// var EditEventAssignment = require('./edit-event-assignment');
//templates
var template = require('../templates/includes/eventAssignmentsEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-event-assignment]' : 'addAssignment',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    // this.renderCollection(
    //   this.collection,
    //   EditEventAssignment,
    //   this.queryByHook('event-assignments-container')
    // );
  },
  update: function () {
  },
  updateValid: function () {
  },
  addAssignment: function () {
    this.collection.addEventAssignment();
  },
})