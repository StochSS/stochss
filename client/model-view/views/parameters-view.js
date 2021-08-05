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
//support files
let app = require('../../app');
let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let EditParameterView = require('./parameter-view');
//templates
let template = require('../templates/parametersView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-parameter]' : 'addParameter',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.parametersEditor;
    let self = this;
    this.collection.on('update-parameters', function (compID, parameter) {
      self.collection.parent.reactions.map(function (reaction) {
        if(reaction.rate && reaction.rate.compID === compID){
          reaction.rate = parameter;
        }
      });
      self.collection.parent.eventsCollection.map(function (event) {
        event.eventAssignments.map(function (assignment) {
          if(assignment.variable.compID === compID) {
            assignment.variable = parameter;
          }
        })
        if(event.selected)
          event.detailsView.renderEventAssignments();
      });
      self.collection.parent.rules.map(function (rule) {
        if(rule.variable.compID === compID) {
          rule.variable = parameter;
        }
      });
      self.parent.rulesView.renderEditRules();
    });
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('parameters-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('parameters-view-tab')).tab('show');
      $(this.queryByHook('edit-parameters')).removeClass('active');
      $(this.queryByHook('view-parameters')).addClass('active');
    }else{
      this.renderEditParameter();
    }
    this.renderViewParameter();
  },
  addParameter: function () {
    this.collection.addParameter();
    app.tooltipSetup();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderEditParameter: function () {
    if(this.editParameterView){
      this.editParameterView.remove();
    }
    this.editParameterView = this.renderCollection(
      this.collection,
      EditParameterView,
      this.queryByHook('edit-parameter-list')
    );
  },
  renderViewParameter: function () {
    if(this.viewParameterView) {
      this.viewParameterView.remove();
    }
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("parameters-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("parameters-annotation-header")).css("display", "block");
    }
    let options = {viewOptions: {viewMode: true}};
    this.viewParameterView = this.renderCollection(
      this.collection,
      EditParameterView,
      this.queryByHook('view-parameter-list'),
      options
    );
  },
  update: function () {},
  updateValid: function () {}
});