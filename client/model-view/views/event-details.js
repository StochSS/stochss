/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
let tests = require('../../views/tests');
//views
let InputView = require('../../views/input');
let View = require('ampersand-view');
let EventAssignment = require('./event-assignments-view');
//templates
let template = require('../templates/eventDetails.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.initialValue': {
      hook: 'event-trigger-init-value',
      type: 'booleanAttribute',
      name: 'checked'
    },
    'model.persistent': {
      hook: 'event-trigger-persistent',
      type: 'booleanAttribute',
      name: 'checked'
    },
  },
  events: {
    'change [data-hook=event-trigger-init-value]' : 'setTriggerInitialValue',
    'change [data-hook=event-trigger-persistent]' : 'setTriggerPersistent',
    'change [data-hook=edit-trigger-time]' : 'setUseValuesFromTriggerTime',
    'change [data-hook=edit-assignment-time]' : 'setUseValuesFromTriggerTime',
    'click [data-hook=advanced-event-button]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderEventAssignments();
    if(this.model.useValuesFromTriggerTime){
      $(this.queryByHook('edit-trigger-time')).prop('checked', true);
    }else{
      $(this.queryByHook('edit-assignment-time')).prop('checked', true);
    }
    app.tooltipSetup();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  openAdvancedSection: function () {
    if(this.model.advanced_error && !$(this.queryByHook("advanced-event-section")).hasClass('show')) {
      let advCollapseBtn = $(this.queryByHook("advanced-event-button"));
      advCollapseBtn.click();
      advCollapseBtn.html('-');
    }
  },
  renderEventAssignments: function () {
    if(this.eventAssignmentsView){
      this.eventAssignmentsView.remove();
    }
    this.eventAssignmentsView = new EventAssignment({
      collection: this.model.eventAssignments,
      tooltips: this.parent.tooltips
    });
    app.registerRenderSubview(this, this.eventAssignmentsView, 'event-assignments');
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
  subviews: {
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
    }
  }
});