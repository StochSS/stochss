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

//support files
let app = require('../app');
//views
var View = require('ampersand-view');
var InputView = require('./input');
//templates
var template = require('../templates/includes/editDomainType.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=unassign-all]' : 'handleUnassignParticles',
    'click [data-hook=delete-type]' : 'handleDeleteType',
    'click [data-hook=delete-all]' : 'handleDeleteTypeAndParticle',
    'click [data-hook=edit-defaults-btn]' : 'handleEditDefaults',
    'change [data-target=type-name]' : 'handleRenameType'
  },
  handleDeleteType: function (e) {
    let type = Number(e.target.dataset.type);
    this.parent.deleteType(type);
    this.parent.renderDomainTypes();
  },
  handleDeleteTypeAndParticle: function (e) {
    let type = Number(e.target.dataset.type);
    this.parent.deleteTypeAndParticles(type);
    this.parent.renderDomainTypes();
  },
  handleEditDefaults: function (e) {
    this.parent.selectedType = this.model.typeID;
    this.parent.renderEditTypeDefaults();
  },
  handleRenameType: function (e) {
    let dataset = e.target.parentElement.parentElement.dataset;
    let type = Number(dataset.hook.split('-').pop());
    let name = e.target.value;
    this.parent.renameType(type, name);
  },
  handleUnassignParticles: function (e) {
    let type = Number(e.target.dataset.type);
    this.parent.unassignAllParticles(type);
    this.parent.renderDomainTypes();
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderNameView();
  },
  renderNameView: function () {
    let nameView = new InputView({parent: this, required: true,
                                  name: 'name', valueType: 'string',
                                  value: this.model.name});
    app.registerRenderSubview(this, nameView, "type-" + this.model.typeID);
  },
  update: function () {},
  updateValid: function () {}
});