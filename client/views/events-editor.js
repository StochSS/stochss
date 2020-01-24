var ViewSwitcher = require('ampersand-view-switcher');
var $ = require('jquery');
//views
var View = require('ampersand-view');
var EventListings = require('./event-listings');
var EventDetails = require('./event-details');
//templates
var template = require('../templates/includes/eventsEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-event]' : 'addEvent',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = {"name":"Names for species, parameters, reactions, events, and rules must be unique.",
                     "annotation":"An optional note about an event.",
                     "triggerExpression":"The trigger expression can be any mathematical expression "+
                                "which evaluates to a boolean value in a python environment "+
                                "(i.e. t==50).  This expression is evaluable within the model "+
                                "namespace, and any variable (Species, Parameters, etc.) can be "+
                                "referenced in the expression.  Time is represented with the lower "+
                                "case variable 't'. An event will begin execution of assignments "+
                                "(or delay, if any) once this expression changes from 'False' to 'True.'",
                     "delay":"contains math expression evaluable within model namespace. This "+
                                "expression designates a delay between the trigger of an event and "+
                                "the execution of its assignments.",
                     "priority":"Contains a math expression evaluable within model namespace.  This "+
                                "expression designates execution order for events which are executed "+
                                "simultaneously.",
                     "initialValue":"If true, the trigger expression will be evaluated as 'True' at "+
                                "start of simulation.  This can be useful for some models, since an "+
                                "event is only executed when the trigger expression state changes "+
                                "from 'False' to 'True'.",
                     "persistent":"If persistent, an event assignment will always be executed when "+
                                "the event's trigger expression evaluates to true.  If not persistent, "+
                                "the event assignment will not be executed if the trigger expression "+
                                "evaluates to false between the time the event is triggered and the "+
                                "time the assignment is executed.",
                     "useValuesFromTriggerTime":"If set to true, assignment execution will be based "+
                                "off of the model state at trigger time. If false (default), the "+
                                "assignment will be made using values at assignment time.",
                     "assignments":"An Event Assignment describes a change to be performed to the "+
                                "current model simulation.  This assignment can either be fired "+
                                "at the time its associated trigger changes from false to true, or "+
                                "after a specified delay, depending on the Event configuration. An "+
                                "event may contain one or more assignments.",
                     "variable":"The target Species or Parameter to be modified by the event.",
                     "assignmentExpression":"Can be any mathematical statement which resolves to "+
                                "an integer or float value.  This value will be assigned to the "+
                                "assignment's target variable upon event execution."
                    }
    this.collection.on("select", function (event) {
      this.setSelectedEvent(event);
      this.setDetailsView(event);
    }, this);
    this.collection.on("remove", function (event) {
      // Select the last event by default
      // But only if there are other events other than the one we're removing
      if (event.detailsView)
        event.detailsView.remove();
      this.collection.removeEvent(event);
      if (this.collection.length) {
        var selected = this.collection.at(this.collection.length-1);
        this.collection.trigger("select", selected);
      }
    }, this);
    this.collection.parent.species.on('add remove', this.toggleAddEventButton, this);
    this.collection.parent.parameters.on('add remove', this.toggleAddEventButton, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderEventListingsView();
    this.detailsContainer = this.queryByHook('event-details-container');
    this.detailsViewSwitcher = new ViewSwitcher({
      el: this.detailsContainer,
    });
    if (this.collection.length) {
      this.setSelectedEvent(this.collection.at(0));
      this.collection.trigger("select", this.selectedEvent);
    }
    this.toggleAddEventButton()
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderEventListingsView: function () {
    if(this.eventListingsView){
      this.eventListingsView.remove();
    }
    this.eventListingsView = this.renderCollection(
      this.collection,
      EventListings,
      this.queryByHook('event-listing-container')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  toggleAddEventButton: function () {
    this.collection.map(function (event) {
      if(event.detailsView && event.selected){
        event.detailsView.renderEventAssignments();
      }
    })
    var numSpecies = this.collection.parent.species.length;
    var numParameters = this.collection.parent.parameters.length;
    var disabled = numSpecies <= 0 && numParameters <= 0
    $(this.queryByHook('add-event')).prop('disabled', disabled);
  },
  setSelectedEvent: function (event) {
    this.collection.each(function (m) { m.selected = false; });
    event.selected = true;
    this.selectedEvent = event;
  },
  setDetailsView: function (event) {
    event.detailsView = event.detailsView || this.newDetailsView(event);
    this.detailsViewSwitcher.set(event.detailsView);
  },
  addEvent: function () {
    var event = this.collection.addEvent();
    event.detailsView = this.newDetailsView(event);
    this.collection.trigger("select", event);
  },
  newDetailsView: function (event) {
    var detailsView = new EventDetails({ model: event });
    detailsView.parent = this;
    return detailsView
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
})