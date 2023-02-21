/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
//support files
let app = require('../../app');
//views
var View = require('ampersand-view');
var EditEventAssignment = require('./event-assignment-view');
//templates
var template = require('../templates/eventAssignmentsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-assignments]' : 'changeCollapseButtonText',
    'click [data-hook=add-event-assignment]' : 'addAssignment'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = attrs.tooltips;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('edit-event-assignments')).removeClass('active');
      $(this.queryByHook('view-event-assignments')).addClass('active');
      $(this.queryByHook('event-assignments-header')).css("display", "none");
      this.renderViewEventAssignment();
    }else{
      this.renderEditEventAssignment();
    }
  },
  addAssignment: function () {
    this.collection.addEventAssignment();
    this.collection.parent.collection.trigger('change')
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
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
  }
})