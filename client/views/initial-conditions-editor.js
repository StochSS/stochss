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
let Tooltips = require('../tooltips');
//views
var View = require('ampersand-view');
var EditInitialCondition = require('./edit-initial-condition');
//templates
var template = require('../templates/includes/initialConditionsEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=scatter]' : 'addInitialCondition',
    'click [data-hook=place]' : 'addInitialCondition',
    'click [data-hook=distribute-uniformly]' : 'addInitialCondition',
    'click [data-hook=initial-condition-button]' : 'changeCollapseButtonText',
    'click [data-hook=save-initial-conditions]' : 'switchToViewMode',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.initialConditionEditor;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderEditInitialConditionsView();
    this.renderViewInitialConditionsView();
  },
  addInitialCondition: function (e) {
    var initialConditionType = e.target.textContent;
    if(this.collection.parent.domain.types.length > 1) {
      var types = this.collection.parent.domain.types.map(function (type) {
        return type.typeID;
      });
      types.shift();
    }else {
      var types = [];
    }
    this.collection.addInitialCondition(initialConditionType, types);
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderEditInitialConditionsView: function () {
    if(this.editInitialConditionView) {
      this.editInitialConditionView.remove()
    }
    this.editInitialConditionView = this.renderCollection(
      this.collection,
      EditInitialCondition,
      this.queryByHook('edit-initial-conditions-collection')
    );
  },
  renderViewInitialConditionsView: function () {
    if(this.viewInitialConditionView) {
      this.viewInitialConditionView.remove()
    }
    let options = {viewOptions: {viewMode: true}};
    this.viewInitialConditionView = this.renderCollection(
      this.collection,
      EditInitialCondition,
      this.queryByHook('view-initial-conditions-collection'),
      options
    );
  },
  update: function () {},
  updateValid: function () {}
});