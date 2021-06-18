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

var $ = require('jquery');
//support files
let app = require('../app');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
//templates
var editTemplate = require('../templates/includes/editEventAssignment.pug');
var viewTemplate = require('../templates/includes/viewEventAssignment.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=remove]' : 'removeAssignment',
    'change [data-hook=event-assignment-variable]' : 'selectAssignmentVariable',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
  },
  update: function () {
  },
  updateValid: function () {
  },
  removeAssignment: function () {
    this.remove();
    this.collection.removeEventAssignment(this.model)
    this.collection.parent.collection.trigger('change')
  },
  getOptions: function () {
    var species = this.model.collection.parent.collection.parent.species;
    var parameters = this.model.collection.parent.collection.parent.parameters;
    var specs = species.map(function (specie) {
      return [specie.compID, specie.name]
    });
    var params = parameters.map(function (parameter) {
      return [parameter.compID, parameter.name]
    });
    let options = [{groupName: "Variables", options: specs},
                   {groupName: "Parameters", options: params}]
    return options;
  },
  selectAssignmentVariable: function (e) {
    var species = this.model.collection.parent.collection.parent.species;
    var parameters = this.model.collection.parent.collection.parent.parameters;
    var val = e.target.selectedOptions.item(0).text;
    var eventVar = species.filter(function (specie) {
      if(specie.compID === val) {
        return specie;
      }
    });
    if(!eventVar.length) {
      eventVar = parameters.filter(function (parameter) {
        if(parameter.compID === val) {
          return parameter;
        }
      });
    }
    this.model.variable = eventVar[0];
    this.model.collection.parent.collection.trigger('change');
  },
  subviews: {
    inputAssignmentExpression: {
      hook: 'event-assignment-expression',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'event-assignment-expression',
          placehonder: "---No Expression Entered---",
          modelKey: 'expression',
          valueType: 'string',
          value: this.model.expression,
        });
      },
    },
    variableSelectView: {
      hook: 'event-assignment-variable',
      prepareView: function (el) {
        let options = this.getOptions();
        return new SelectView({
          name: 'variable',
          required: true,
          idAttributes: 'cid',
          groupOptions: options,
          value: this.model.variable.compID,
        });
      }
    }
  },
});