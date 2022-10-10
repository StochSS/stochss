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
let InitialConditionView = require('./initial-condition-view');
//templates
let template = require('../templates/initialConditionsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=scatter]' : 'addInitialCondition',
    'click [data-hook=place]' : 'addInitialCondition',
    'click [data-hook=distribute-uniformly]' : 'addInitialCondition',
    'click [data-hook=initial-condition-button]' : 'changeCollapseButtonText',
    'click [data-hook=save-initial-conditions]' : 'switchToViewMode',
    'change [data-hook=initial-condition-filter]' : 'filterInitialConditions'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.initialConditionsEditor;
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.filterAttr = attrs.attr;
    this.filterKey = attrs.key;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('initial-conditions-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('initial-conditions-view-tab')).tab('show');
      $(this.queryByHook('edit-initial-conditions')).removeClass('active');
      $(this.queryByHook('view-initial-conditions')).addClass('active');
    }else{
      this.renderEditInitialConditionsView({'key': this.filterKey, 'attr': this.filterAttr});
    }
    this.renderViewInitialConditionsView({'key': this.filterKey, 'attr': this.filterAttr});
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
  filterInitialConditions: function (e) {
    var key = e.target.value === "" ? null : e.target.value;
    var attr = null;
    if(key && key.includes(':')) {
      let attrKey = key.split(':');
      attr = attrKey[0].toLowerCase().replace(/ /g, '');
      key = attrKey[1];
    }
    if(!this.readOnly) {
      this.renderEditInitialConditionsView({'key': key, 'attr': attr});
    }
    this.renderViewInitialConditionsView({'key': key, 'attr': attr});
  },
  openSection: function ({editMode=true}={}) {
    if(!$(this.queryByHook("initial-conditions")).hasClass("show")) {
      let initCondCollapseBtn = $(this.queryByHook("initial-condition-button"));
      initCondCollapseBtn.click();
      initCondCollapseBtn.html('-');
    }
  },
  renderEditInitialConditionsView: function ({key=null, attr=null}={}) {
    if(this.editInitialConditionView) {
      this.editInitialConditionView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editInitialConditionView = this.renderCollection(
      this.collection,
      InitialConditionView,
      this.queryByHook('edit-initial-conditions-collection'),
      options
    );
    app.tooltipSetup();
  },
  renderViewInitialConditionsView: function ({key=null, attr=null}={}) {
    if(this.viewInitialConditionView) {
      this.viewInitialConditionView.remove();
    }
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("initial-conditions-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("initial-conditions-annotation-header")).css("display", "block");
    }
    let options = {
      viewOptions: {viewMode: true, hasAnnotations: this.containsMdlWithAnn},
      filter: (model) => { return model.contains(attr, key); }
    }
    this.viewInitialConditionView = this.renderCollection(
      this.collection,
      InitialConditionView,
      this.queryByHook('view-initial-conditions-collection'),
      options
    );
    app.tooltipSetup();
  },
  update: function () {},
  updateValid: function () {},
  subviews: {
    filter: {
      hook: 'initial-condition-filter',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'filter',
          valueType: 'string',
          placeholder: 'filter'
        });
      }
    }
  }
});