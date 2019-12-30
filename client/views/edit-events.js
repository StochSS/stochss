var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
//templates
var template = require('../templates/includes/editEvent.pug');

module.exports = View.extend({
  template: template,
  bindings: {
  },
  events: {
    'click [data-hook=remove]' : 'removeEvent',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  update: function () {
  },
  updateValid: function () {
  },
  removeEvent: function () {
    this.remove();
    this.collection.removeEvent(this.model);
  },
  subviews: {
    inputName: {
      hook: 'event-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: '',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name,
        });
      },
    },
    inputDelay: {
      hook: 'event-delay-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'delay',
          label: '',
          tests: '',
          modelKey: 'delay',
          valueType: 'string',
          value: this.model.delay,
        });
      },
    },
    inputPriority: {
      hook: 'event-priority-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'priority',
          label: '',
          tests: '',
          modelKey: 'priority',
          valueType: 'string',
          value: this.model.priority,
        });
      },
    },
    inputTrigger: {
      hook: 'event-trigger-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'trigger',
          label: '',
          tests: '',
          modelKey: 'triggerExpression',
          valueType: 'string',
          value: this.model.triggerExpression,
        });
      },
    },
    inputAssignment: {
      hook: 'event-assignment-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'assignment',
          label: '',
          tests: '',
          modelKey: '',
          valueType: 'string',
          value: 'Assignment Container',
        });
      },
    },
  },
});