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
let _ = require('underscore');
//support files
let app = require('../../app');
let modals = require('../../modals');
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let EventAssignmentsView = require('./event-assignments-view');
//templates
let editTemplate = require('../templates/editEvent.pug');
let viewTemplate = require('../templates/viewEvent.pug');

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
    'change [data-hook=event-trigger-init-value]' : 'setTriggerInitialValue',
    'change [data-hook=event-trigger-persistent]' : 'setTriggerPersistent',
    'change [data-hook=edit-trigger-time]' : 'setUseValuesFromTriggerTime',
    'change [data-hook=edit-assignment-time]' : 'setUseValuesFromTriggerTime',
    'click [data-hook=select]' : 'selectEvent',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeEvent',
    'click [data-hook=advanced-event-button]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    if(this.viewMode) {
      this.delay = !this.model.delay ? "None" : this.model.delay;
    }else{
      this.model.on("change", _.bind(this.updateViewer, this));
      this.model.on("change-event", () => {
        this.renderEventAssignmentsView({override: true});
      });
    }
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    app.documentSetup();
    if(this.viewMode) {
      var uvfView = "view"
      this.renderEventAssignmentsView();
    }else{
      var uvfView = "edit"
      if(this.model.selected) {
        setTimeout(_.bind(this.openEventDetails, this), 1);
      }
      if(!this.model.annotation){
        $(this.queryByHook('edit-annotation-btn')).text('Add');
      }
    }
    if(this.model.useValuesFromTriggerTime){
      $(this.queryByHook(`${uvfView}-trigger-time`)).prop('checked', true);
    }else{
      $(this.queryByHook(`${uvfView}-assignment-time`)).prop('checked', true);
    }
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  editAnnotation: function () {
    if(document.querySelector('#eventAnnotationModal')) {
      document.querySelector('#eventAnnotationModal').remove();
    }
    let name = this.model.name;
    let annotation = this.model.annotation;
    let modal = $(modals.annotationModalHtml("event", name, annotation)).modal();
    let okBtn = document.querySelector('#eventAnnotationModal .ok-model-btn');
    let input = document.querySelector('#eventAnnotationModal #eventAnnotationInput');
    input.addEventListener("keyup", (event) => {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      this.model.annotation = input.value.trim();
      this.parent.renderEditEventView();
    });
  },
  openEventDetails: function () {
    $("#collapse-event-details" + this.model.compID).collapse("show");
    this.renderDetailsSection();
  },
  removeEvent: function () {
    this.collection.removeEvent(this.model);
  },
  renderDetailsSection: function () {
    this.renderEventAssignmentsView();
  },
  renderEventAssignmentsView: function ({override=false}={}) {
    if(override && this.eventAssignmentsView) {
      this.eventAssignmentsView.remove();
    }

    if(!this.eventAssignmentsView || override) {
      this.eventAssignmentsView = new EventAssignmentsView({
        collection: this.model.eventAssignments,
        tooltips: this.parent.tooltips,
        readOnly: this.viewMode
      });
      app.registerRenderSubview(this, this.eventAssignmentsView, "assignments-container");
    }
  },
  selectEvent: function (e) {
    this.model.selected = !this.model.selected;
    this.renderDetailsSection();
  },
  setTriggerInitialValue: function (e) {
    this.model.initialValue = e.target.checked;
  },
  setTriggerPersistent: function (e) {
    this.model.persistent = e.target.checked;
  },
  setUseValuesFromTriggerTime: function (e) {
    this.model.useValuesFromTriggerTime = e.target.dataset.name === "trigger";
  },
  update: function () {},
  updateValid: function () {},
  updateViewer: function (event) {
    if(!event || !("selected" in event._changed)){
      this.parent.renderViewEventView();
    }
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
    inputTriggerExpression: {
      hook: 'event-trigger-expression',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'trigger-expression',
          placeholder: '---No Expression Entered---',
          modelKey: 'triggerExpression',
          valueType: 'string',
          value: this.model.triggerExpression
        });
      }
    },
    inputDelay: {
      hook: 'event-delay',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'delay',
          placeholder: '---No Expression Entered---',
          modelKey: 'delay',
          valueType: 'string',
          value: this.model.delay
        });
      }
    },
    inputPriority: {
      hook: 'event-priority',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'priority',
          modelKey: 'priority',
          valueType: 'string',
          value: this.model.priority
        });
      }
    }
  }
});