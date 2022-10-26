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
let Tooltips = require("../../tooltips");
//views
let View = require('ampersand-view');
let EventView = require('./event-view');
let InputView = require('../../views/input');
//templates
let template = require('../templates/eventsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-event]' : 'handleAddEvent',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'change [data-hook=event-filter]' : 'filterEvents'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.eventsEditor;
    this.filterAttr = attrs.attr;
    this.filterKey = attrs.key;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('events-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('events-view-tab')).tab('show');
      $(this.queryByHook('edit-events')).removeClass('active');
      $(this.queryByHook('view-events')).addClass('active');
    }else {
      this.renderEditEventView({'key': this.filterKey, 'attr': this.filterAttr});
      this.toggleAddEventButton();
    }
    this.renderViewEventView({'key': this.filterKey, 'attr': this.filterAttr});
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  filterEvents: function (e) {
    var key = e.target.value === "" ? null : e.target.value;
    var attr = null;
    if(key && key.includes(':')) {
      let attrKey = key.split(':');
      attr = attrKey[0].toLowerCase().replace(/ /g, '');
      key = attrKey[1];
    }
    if(!this.readOnly) {
      this.renderEditEventView({'key': key, 'attr': attr});
    }
    this.renderViewEventView({'key': key, 'attr': attr});
  },
  handleAddEvent: function () {
    let event = this.collection.addEvent();
    app.tooltipSetup();
  },
  openAdvancedSection: function () {
    if(this.model.advanced_error && !$(this.queryByHook("advanced-event-section")).hasClass('show')) {
      let advCollapseBtn = $(this.queryByHook("advanced-event-button"));
      advCollapseBtn.click();
      advCollapseBtn.html('-');
    }
  },
  openSection: function (error) {
    if(!$(this.queryByHook("events")).hasClass("show")) {
      let evtCollapseBtn = $(this.queryByHook("collapse"));
      evtCollapseBtn.click();
      evtCollapseBtn.html('-');
    }
    if(!this.readOnly) {
      app.switchToEditTab(this, "events");
    }
    if(error) {
      let eventView = this.editEventView.views.filter((eventView) => {
        return eventView.model.compID === error.id;
      })[0];
      eventView.model.selected = true;
      eventView.openEventDetails();
      eventView.openAdvancedSection();
    }
  },
  renderEditEventView: function ({key=null, attr=null}={}) {
    if(this.editEventsView){
      this.editEventsView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editEventsView = this.renderCollection(
      this.collection,
      EventView,
      this.queryByHook('edit-event-container'),
      options
    );
    app.tooltipSetup();
  },
  renderViewEventView: function ({key=null, attr=null}={}) {
    if(this.viewEventsView) {
      this.viewEventsView.remove();
    }
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("events-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("events-annotation-header")).css("display", "block");
    }
    let options = {
      viewOptions: {parent: this, viewMode: true},
      filter: (model) => { return model.contains(attr, key); }
    };
    this.viewEventsView = this.renderCollection(
      this.collection,
      EventView,
      this.queryByHook('view-event-container'),
      options
    );
    app.tooltipSetup();
  },
  toggleAddEventButton: function () {
    let numSpecies = this.collection.parent.species.length;
    let numParameters = this.collection.parent.parameters.length;
    let disabled = numSpecies <= 0 && numParameters <= 0;
    $(this.queryByHook('add-event')).prop('disabled', disabled);
  },
  update: function () {},
  updateValid: function () {},
  subviews: {
    filter: {
      hook: 'event-filter',
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