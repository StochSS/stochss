/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
let _ = require('underscore');
//support files
let app = require('../app');
let tests = require('./tests');
let modals = require('../modals');
//views
let InputView = require('./input');
let View = require('ampersand-view');
let EventAssignment = require('./event-assignments-view');
//templates
let viewTemplate = require('../templates/includes/viewEvents.pug');
let editTemplate = require('../templates/includes/eventListings.pug');

module.exports = View.extend({
  bindings: {
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select'
    },
    'model.initialValue': {
      hook: 'event-trigger-init-value',
      type: 'booleanAttribute',
      name: 'checked'
    },
    'model.persistent': {
      hook: 'event-trigger-persistent',
      type: 'booleanAttribute',
      name: 'checked'
    }
  },
  events: {
    'click [data-hook=select]'  : 'selectEvent',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeEvent'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    if(this.viewMode) {
      this.delay = this.model.delay === "" ? "None" : this.model.delay;
    }else{
      this.model.on("change", _.bind(this.updateViewer, this));
    }
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    app.documentSetup();
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add');
    }
    if(this.viewMode) {
      if(this.model.useValuesFromTriggerTime) {
        $(this.queryByHook("view-trigger-time")).prop('checked', true);
      }else{
        $(this.queryByHook("view-assignment-time")).prop('checked', true);
      }
    }
  },
  editAnnotation: function () {
    if(document.querySelector('#eventAnnotationModal')) {
      document.querySelector('#eventAnnotationModal').remove();
    }
    let self = this;
    let name = this.model.name;
    let annotation = this.model.annotation;
    let modal = $(modals.annotationModalHtml("event", name, annotation)).modal();
    let okBtn = document.querySelector('#eventAnnotationModal .ok-model-btn');
    let input = document.querySelector('#eventAnnotationModal #eventAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value.trim();
      self.parent.renderEditEventListingsView();
      modal.modal('hide');
    });
  },
  removeEvent: function () {
    this.remove();
    this.collection.removeEvent(this.model);
  },
  selectEvent: function (e) {
    this.model.collection.trigger("select", this.model);
  },
  update: function () {},
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewEventListingView();
  },
  subviews: {
    inputName: {
      hook: 'event-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name
        });
      }
    },
    viewEventAssignmentsView: {
      hook: "assignment-viewer",
      prepareView: function (el) {
        return new EventAssignment({
          collection: this.model.eventAssignments,
          tooltips: this.parent.tooltips,
          readOnly: true
        });
      }
    }
  }
});