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

//models
var State = require('ampersand-state');
//collections
var EventAssignments = require('./event-assignments');

module.exports = State.extend({
  props: {
    compID: 'number',
    name: 'string',
    annotation: 'string',
    delay: 'string',
    priority: 'string',
    triggerExpression: 'string',
    initialValue: 'boolean',
    persistent: 'boolean',
    useValuesFromTriggerTime: 'boolean'
  },
  collections: {
    eventAssignments: EventAssignments
  },
  session: {
    selected: {
      type: 'boolean',
      default: false,
    },
    advanced_error: 'boolean'
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
    this.eventAssignments.on('add change remove', this.updateValid, this)
    this.validateComponent()
  },
  contains: function (attr, key) {
    if(key === null) { return true; }

    let assignmentVars = this.eventAssignments.map((assignment) => { return assignment.variable.name; });
    let assignmentExps = this.eventAssignments.map((assignment) => { return assignment.expression.includes(key); });

    let checks = {
      'name': this.name.includes(key),
      'delay': this.delay === key,
      'priority': this.priority === key,
      'triggerexpression': this.triggerExpression.includes(key),
      'initialvalue': key === 'Initial Value' && this.initialValue,
      'persistent': key === 'Persistent' && this.persistent,
      'usevaluesfromtriggertime': key === 'Use Values From Trigger Time' && this.useValuesFromTriggerTime,
      'usevaluesfromassignmenttime': key === 'Use Values From Assignment Time' && !this.useValuesFromTriggerTime,
      'eventassignments': assignmentVars.includes(key) || assignmentExps.includes(true)
    }

    if(attr !== null) {
      checks['assignmentvariable'] = assignmentVars.includes(key);
      checks['assignmentexpression'] = assignmentExps.includes(true);
      checks['initialvalue'] = this.initialValue === Boolean(key);
      checks['persistent'] = this.persistent === Boolean(key);
      checks['usevaluesfromtriggertime'] = this.useValuesFromTriggerTime === Boolean(key);
      checks['usevaluesfromassignmenttime'] = this.useValuesFromTriggerTime === Boolean(key);
      let otherAttrs = {
        'trigger': 'triggerexpression', 'assignmenttarget': 'assignmentvariable'
      }
      if(Object.keys(otherAttrs).includes(attr)) {
        attr = otherAttrs[attr];
      }
      return checks[attr];
    }
    for(let attribute in checks) {
      if(checks[attribute]) { return true; }
    }
    return false;
  },
  validateComponent: function () {
    advanced_error = false;
    if(!this.name.trim() || this.name.match(/^\d/)) return false;
    if((!/^[a-zA-Z0-9_]+$/.test(this.name))) return false;
    if(!this.triggerExpression.trim()) return false;
    if(!this.priority.trim()) {
      this.advanced_error = true;
      return false;
    };
    if(!this.eventAssignments.validateCollection()) return false;
    return true;
  },
  updateValid: function () {
    this.collection.parent.updateValid();
  }
});