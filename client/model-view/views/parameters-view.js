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
let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let EditParameterView = require('./parameter-view');
//templates
let template = require('../templates/parametersView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-parameter]' : 'addParameter',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'change [data-hook=parameter-filter]' : 'filterParameters'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.parametersEditor;
    this.filterAttr = attrs.attr;
    this.filterKey = attrs.key;
    this.collection.on('update-parameters', (compID, parameter) => {
      this.collection.parent.reactions.map((reaction) => {
        if(reaction.rate && reaction.rate.compID === compID){
          reaction.rate = parameter;
          if(reaction.reactionType !== 'custom-propensity') {
            reaction.trigger('change-reaction');
          }
        }
      });
      this.collection.parent.eventsCollection.map((event) => {
        event.eventAssignments.map((assignment) => {
          if(assignment.variable.compID === compID) {
            assignment.variable = parameter;
          }
        })
        if(event.selected)
          event.detailsView.renderEventAssignments();
      });
      this.collection.parent.rules.map((rule) => {
        if(rule.variable.compID === compID) {
          rule.variable = parameter;
        }
      });
      if(this.parent.rulesView) {
        this.parent.rulesView.renderEditRules();
      }
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
      this.renderEditParameter({'key': this.filterKey, 'attr': this.filterAttr});
    }
    this.renderViewParameter({'key': this.filterKey, 'attr': this.filterAttr});
  },
  addParameter: function () {
    this.collection.addParameter();
    app.tooltipSetup();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  filterParameters: function (e) {
    var key = e.target.value === "" ? null : e.target.value;
    var attr = null;
    if(key && key.includes(':')) {
      let attrKey = key.split(':');
      attr = attrKey[0].toLowerCase().replace(/ /g, '');
      key = attrKey[1];
    }
    if(!this.readOnly) {
      this.renderEditParameter({'key': key, 'attr': attr});
    }
    this.renderViewParameter({'key': key, 'attr': attr});
  },
  openSection: function () {
    if(!$(this.queryByHook("parameters-list-container")).hasClass("show")) {
      let paramCollapseBtn = $(this.queryByHook("collapse"));
      paramCollapseBtn.click();
      paramCollapseBtn.html('-');
    }
    if(!this.readOnly) {
      app.switchToEditTab(this, "parameters");
    }
  },
  renderEditParameter: function ({key=null, attr=null}={}) {
    if(this.editParameterView){
      this.editParameterView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editParameterView = this.renderCollection(
      this.collection,
      EditParameterView,
      this.queryByHook('edit-parameter-list'),
      options
    );
  },
  renderViewParameter: function ({key=null, attr=null}={}) {
    if(this.viewParameterView) {
      this.viewParameterView.remove();
    }
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("parameters-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("parameters-annotation-header")).css("display", "block");
    }
    let options = {
      viewOptions: {viewMode: true, hasAnnotations: this.containsMdlWithAnn},
      filter: (model) => { return model.contains(attr, key); }
    }
    this.viewParameterView = this.renderCollection(
      this.collection,
      EditParameterView,
      this.queryByHook('view-parameter-list'),
      options
    );
  },
  update: function () {},
  updateValid: function () {},
  subviews: {
    filter: {
      hook: 'parameter-filter',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'filter',
          valueType: 'string',
          disabled: this.filterKey !== null,
          placeholder: 'filter'
        });
      }
    }
  }
});