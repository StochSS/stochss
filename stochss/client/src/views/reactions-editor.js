var app = require('ampersand-app');
var ViewSwitcher = require('ampersand-view-switcher');
var katex = require('katex');
var _ = require('underscore');
var $ = require('jquery');
// Config
var ReactionTypes = require('../reaction-types');
// Models
var Reaction = require('../models/reaction.js')
var StoichSpeciesCollection = require('../models/stoich-species.js');
// Views
var View = require('ampersand-view');
var ReactionListingView = require('./reaction-listing');
var ReactionDetailsView = require('./reaction-details');

var template = require('../templates/includes/reactionsEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=creation]'               : 'handleAddReactionClick',
    'click [data-hook=destruction]'            : 'handleAddReactionClick',
    'click [data-hook=change]'                 : 'handleAddReactionClick',
    'click [data-hook=dimerization]'           : 'handleAddReactionClick',
    'click [data-hook=merge]'                  : 'handleAddReactionClick',
    'click [data-hook=split]'                  : 'handleAddReactionClick',
    'click [data-hook=four]'                   : 'handleAddReactionClick',
    'click [data-hook=custom-massaction]'      : 'handleAddReactionClick',
    'click [data-hook=custom-propensity]'      : 'handleAddReactionClick',
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  initialize: function () {
    this.collection.on("select", function (reaction) {
      this.setSelectedReaction(reaction);
      this.setDetailsView(reaction);
    }, this);
    this.collection.on("remove", function (reaction) {
      // Select the last reaction by default
      // But only if there are other reactions other than the one we're removing
      if (reaction.detailsView) reaction.detailsView.remove();
      this.collection.remove(reaction);
      if (this.collection.length) {
        var selected = this.collection.at(this.collection.length-1);
        this.collection.trigger("select", selected);
      }
    }, this);
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(
      this.collection,
      ReactionListingView,
      this.queryByHook('reaction-list')
    );
    this.detailsContainer = this.queryByHook('reaction-details-container');
    this.detailsViewSwitcher = new ViewSwitcher({
      el: this.detailsContainer,
    });
    if (this.collection.length) {
      this.setSelectedReaction(this.collection.at(0));
      this.collection.trigger("select", this.selectedReaction);
    }
    // Trigger a change event to update species, params inUse value
    this.collection.trigger("change");
  },
  setSelectedReaction: function (reaction) {
    this.collection.each(function (m) { m.selected = false; });
    reaction.selected = true;
    this.selectedReaction = reaction;
  },
  handleAddReactionClick: function (e) {
    var reactionType = e.target.dataset.hook
    var stoichArgs = this.getStoichArgsForReactionType(reactionType);
    var modelArgs = {
      reaction_type: reactionType,
      annotation: '',
      massaction: false,
      reactants: stoichArgs.reactants,
      products: stoichArgs.products,
      propensity: '',
      subdomains: this.parent.model.meshSettings.uniqueSubdomains.map(function (model) {return model.name})

    };
    var reaction = this.newReaction(modelArgs);
    this.collection.trigger("select", reaction);
  },
  addReactionListing: function (reaction) {
    var reactionListingView = new ReactionListingView({ model: reaction });
    this.collection.add(reaction);
  },
  newReaction: function (args) {
    args.name = args.name || this.getDefaultReactionName();
    var reaction = new Reaction(args);
    reaction.detailsView = this.newDetailsView(reaction);
    reaction.species = this.collection.parent.species;
    reaction.rate = this.getDefaultReactionRate() || reaction.rate;
    this.setDefaultSpeciesOnStoichSpecies(reaction.products);
    this.setDefaultSpeciesOnStoichSpecies(reaction.reactants);
    this.collection.add(reaction);
    return reaction;
  },
  getDefaultReactionRate: function () {
    return this.collection.parent.parameters.at(0);
  },
  newDetailsView: function (reaction) {
    var detailsView = new ReactionDetailsView({ model: reaction });
    detailsView.parent = this;
    return detailsView
  },
  setDetailsView: function (reaction) {
    reaction.detailsView = reaction.detailsView || this.newDetailsView(reaction);
    this.detailsViewSwitcher.set(reaction.detailsView);
  },
  getDefaultReactionName: function () {
    return 'R' + this.collection.length;
  },
  getStoichArgsForReactionType: function(type) {
    var args = ReactionTypes[type];
    return args;
  },
  setDefaultSpeciesOnStoichSpecies: function (stoichSpecies) {
    stoichSpecies.forEach(function (stoichSpecie) {
      stoichSpecie.specie = this.getDefaultSpecie(); 
    }, this);
  },
  getDefaultSpecie: function () {
    var value = this.collection.parent.species.models[0];
    return value;
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  }
});
