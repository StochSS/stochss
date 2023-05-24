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
let InputView = require('../../views/input');
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
//templates
let editTemplate = require('../templates/editEventAssignment.pug');
let viewTemplate = require('../templates/viewEventAssignment.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=remove-assignment]' : 'removeAssignment',
    'change [data-hook=event-assignment-variable]' : 'selectAssignmentVariable',
    'change [data-hook=event-assignment-expression]' : 'updateViewer'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
  },
  getOptions: function () {
    var species = this.model.collection.parent.collection.parent.species;
    var options = species.map(function (specie) {
      return [specie.compID, specie.name];
    });
    return options;
  },
  removeAssignment: function () {
    this.remove();
    this.collection.removeEventAssignment(this.model);
    this.collection.parent.collection.trigger('change');
  },
  selectAssignmentVariable: function (e) {
    let species = this.model.collection.parent.collection.parent.species;
    this.model.variable = species.get(Number(e.target.value), 'compID');
    this.updateViewer();
    this.model.collection.parent.collection.trigger('change');
  },
  update: function () {},
  updateValid: function () {},
  updateViewer: function () {
    this.model.collection.parent.trigger('change');
  },
  subviews: {
    inputAssignmentExpression: {
      hook: 'event-assignment-expression',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'event-assignment-expression',
          placeholder: "---No Expression Entered---",
          modelKey: 'expression',
          valueType: 'string',
          value: this.model.expression
        });
      }
    },
    variableSelectView: {
      hook: 'event-assignment-variable',
      prepareView: function (el) {
        let options = this.getOptions();
        return new SelectView({
          name: 'variable',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.variable.compID
        });
      }
    }
  },
});