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
let app = require('../app');
let Tooltips = require("../tooltips");
//views
let View = require('ampersand-view');
let EventDetails = require('./event-details');
let EventListings = require('./event-listings');
let ViewSwitcher = require('ampersand-view-switcher');
//templates
let template = require('../templates/includes/eventsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-event]' : 'addEvent',
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.eventsEditor;
    if(!this.readOnly) {
      this.collection.on("select", function (event) {
        this.setSelectedEvent(event);
        this.setDetailsView(event);
      }, this);
      this.collection.on("remove", function (event) {
        // Select the last event by default
        // But only if there are other events other than the one we're removing
        if (event.detailsView){
          event.detailsView.remove();
        }
        this.collection.removeEvent(event);
        if (this.collection.length) {
          let selected = this.collection.at(this.collection.length-1);
          this.collection.trigger("select", selected);
        }
      }, this);
      this.collection.parent.species.on('add remove', this.toggleAddEventButton, this);
      this.collection.parent.parameters.on('add remove', this.toggleAddEventButton, this);
    }
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
      this.renderEditEventListingsView();
      this.detailsContainer = this.queryByHook('event-details-container');
      this.detailsViewSwitcher = new ViewSwitcher({
        el: this.detailsContainer
      });
      if(this.collection.length) {
        this.setSelectedEvent(this.collection.at(0));
        this.collection.trigger("select", this.selectedEvent);
      }
      this.toggleAddEventButton();
    }
    this.renderViewEventListingView();
  },
  addEvent: function () {
    let event = this.collection.addEvent();
    event.detailsView = this.newDetailsView(event);
    this.collection.trigger("select", event);
    app.tooltipSetup();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  newDetailsView: function (event) {
    let detailsView = new EventDetails({ model: event });
    detailsView.parent = this;
    return detailsView;
  },
  renderEditEventListingsView: function () {
    if(this.editEventListingsView){
      this.editEventListingsView.remove();
    }
    this.editEventListingsView = this.renderCollection(
      this.collection,
      EventListings,
      this.queryByHook('edit-event-listing-container')
    );
    app.tooltipSetup();
  },
  renderViewEventListingView: function () {
    if(this.viewEventListingsView) {
      this.viewEventListingsView.remove();
    }
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("events-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("events-annotation-header")).css("display", "block");
    }
    let options = {viewOptions: {parent: this, viewMode: true}};
    this.viewEventListingsView = this.renderCollection(
      this.collection,
      EventListings,
      this.queryByHook('view-event-listing-container'),
      options
    );
    app.tooltipSetup();
  },
  setDetailsView: function (event) {
    event.detailsView = event.detailsView || this.newDetailsView(event);
    this.detailsViewSwitcher.set(event.detailsView);
  },
  setSelectedEvent: function (event) {
    this.collection.each(function (m) { m.selected = false; });
    event.selected = true;
    this.selectedEvent = event;
  },
  toggleAddEventButton: function () {
    this.collection.map(function (event) {
      if(event.detailsView && event.selected){
        event.detailsView.renderEventAssignments();
      }
    });
    let numSpecies = this.collection.parent.species.length;
    let numParameters = this.collection.parent.parameters.length;
    let disabled = numSpecies <= 0 && numParameters <= 0;
    $(this.queryByHook('add-event')).prop('disabled', disabled);
  },
  update: function () {},
  updateValid: function () {}
});