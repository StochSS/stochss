/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

let $ = require('jquery');
//views
var View = require('ampersand-view');
var EditEventAssignment = require('./edit-event-assignment');
//templates
var template = require('../templates/includes/eventAssignmentsEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-event-assignment]' : 'addAssignment',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : true;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('edit-event-assignments')).removeClass('active');
      $(this.queryByHook('view-event-assignments')).addClass('active');
      this.renderViewEventAssignment();
    }else{
      this.renderEditEventAssignment();
    }
  },
  renderEditEventAssignment: function () {
    if(this.editEventAssignments) {
      this.editEventAssignments.remove();
    }
    this.editEventAssignments = this.renderCollection(
      this.collection,
      EditEventAssignment,
      this.queryByHook('edit-event-assignments-container')
    );
  },
  renderViewEventAssignment: function () {
    if(this.viewEventAssignments) {
      this.viewEventAssignments.remove();
    }
    let options = {viewOptions: {viewMode: true}}
    this.viewEventAssignments = this.renderCollection(
      this.collection,
      EditEventAssignment,
      this.queryByHook('view-event-assignments-container'),
      options
    );
  },
  update: function () {
  },
  updateValid: function () {
  },
  addAssignment: function () {
    this.collection.addEventAssignment();
    this.collection.parent.collection.trigger('change')
  },
})