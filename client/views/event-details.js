var $ = require('jquery');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var EventAssignment = require('./event-assignments-editor');
//templates
var template = require('../templates/includes/eventDetails.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.initialValue': {
      hook: 'event-trigger-init-value',
      type: 'booleanAttribute',
      name: 'checked',
    },
    'model.persistent': {
      hook: 'event-trigger-persistent',
      type: 'booleanAttribute',
      name: 'checked',
    },
    'model.useValuesFromTriggerTime': {
      hook: 'use-values-from-trigger-time',
      type: 'booleanAttribute',
      name: 'checked',
    },
  },
  events: {
    'change [data-hook=event-trigger-init-value]' : 'setTriggerInitialValue',
    'change [data-hook=event-trigger-persistent]' : 'setTriggerPersistent',
    'change [data-hook=use-values-from-trigger-time]' : 'setUseValuesFromTriggerTime',
    'click [data-hook=advanced-event-button]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var eventAssignment = new EventAssignment({
      collection: this.model.eventAssignments,
    });
    this.registerRenderSubview(eventAssignment, 'event-assignments');
  },
  update: function () {
  },
  updateValid: function () {
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  setTriggerInitialValue: function (e) {
    this.model.initialValue = e.target.checked;
  },
  setTriggerPersistent: function (e) {
    this.model.persistent = e.target.checked;
  },
  setUseValuesFromTriggerTime: function (e) {
    this.model.useValuesFromTriggerTime = e.target.checked;
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('advanced-event-button')).text();
    text === '+' ? $(this.queryByHook('advanced-event-button')).text('-') : $(this.queryByHook('advanced-event-button')).text('+');
  },
  subviews: {
    inputDelay: {
      hook: 'event-delay',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'delay',
          label: 'Delay: ',
          tests: '',
          modelKey: 'delay',
          valueType: 'string',
          value: this.model.delay,
        });
      },
    },
    inputPriority: {
      hook: 'event-priority',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'priority',
          label: 'Priority: ',
          tests: '',
          modelKey: 'priority',
          valueType: 'string',
          value: this.model.priority,
        });
      },
    },
    inputTriggerExpression: {
      hook: 'event-trigger-expression',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'trigger-expression',
          label: 'Trigger Expression: ',
          tests: '',
          modelKey: 'triggerExpression',
          valueType: 'string',
          value: this.model.triggerExpression,
        });
      },
    },
  },
});