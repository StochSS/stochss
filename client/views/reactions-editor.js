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

var ViewSwitcher = require('ampersand-view-switcher');
var katex = require('katex');
var _ = require('underscore');
var $ = require('jquery');
//support files
let app = require('../app');
var ReactionTypes = require('../reaction-types');
var Tooltips = require('../tooltips');
//models
var StoichSpeciesCollection = require('../models/stoich-species');
//views
var View = require('ampersand-view');
var ReactionListingView = require('./reaction-listing');
var ReactionDetailsView = require('./reaction-details');
//templates
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
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.reactionsEditor
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    if(!this.readOnly) {
      this.collection.on("select", function (reaction) {
        this.setSelectedReaction(reaction);
        this.setDetailsView(reaction);
      }, this);
      this.collection.on("remove", function (reaction) {
        // Select the last reaction by default
        // But only if there are other reactions other than the one we're removing
        if (reaction.detailsView)
          reaction.detailsView.remove();
        this.collection.removeReaction(reaction);
        if (this.collection.length) {
          var selected = this.collection.at(this.collection.length-1);
          this.collection.trigger("select", selected);
        }
      }, this);
      this.collection.parent.species.on('add remove', this.toggleAddReactionButton, this);
      this.collection.parent.parameters.on('add remove', this.toggleReactionTypes, this);
      this.collection.parent.on('change', this.toggleProcessError, this)
    }
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      this.renderViewReactionView()
      $(this.queryByHook('reactions-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('reactions-view-tab')).tab('show');
      $(this.queryByHook('edit-reactions')).removeClass('active');
      $(this.queryByHook('view-reactions')).addClass('active');
    }else{
      this.renderReactionListingViews();
      this.detailsContainer = this.queryByHook('reaction-details-container');
      this.detailsViewSwitcher = new ViewSwitcher({
        el: this.detailsContainer,
      });
      if (this.collection.length) {
        this.setSelectedReaction(this.collection.at(0));
        this.collection.trigger("select", this.selectedReaction);
      }
      this.collection.trigger("change");
      this.toggleAddReactionButton();
      if(this.collection.parent.parameters.length > 0){
         $(this.queryByHook('add-reaction-partial')).prop('hidden', true);
      }
      else{
        $(this.queryByHook('add-reaction-full')).prop('hidden', true);
      }
      this.renderReactionTypes();
      katex.render("\\emptyset", this.queryByHook('emptyset'), {
        displayMode: false,
        output: 'html',
      });
      this.toggleProcessError()
      $(this.queryByHook('massaction-message')).prop('hidden', this.collection.parent.parameters.length > 0);
    }
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderReactionListingViews: function () {
    this.renderEditReactionListingView();
    this.renderViewReactionView();
  },
  renderEditReactionListingView: function () {
    if(this.editReactionListingView){
      this.editReactionListingView.remove();
    }
    if(this.collection.parent.parameters.length <= 0) {
      for(var i = 0; i < this.collection.length; i++) {
        if(this.collection.models[i].reactionType !== "custom-propensity"){
          this.collection.models[i].reactionType = "custom-propensity"
        }
      }
    }
    this.editReactionListingView = this.renderCollection(
      this.collection,
      ReactionListingView,
      this.queryByHook('edit-reaction-list')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  renderViewReactionView: function () {
    if(this.viewReactionListingView){
      this.viewReactionListingView.remove();
    }
    if(!this.collection.parent.is_spatial){
      $(this.queryByHook("reaction-types-header")).css("display", "none");
    }
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("reaction-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("reaction-annotation-header")).css("display", "block");
    }
    let options = {viewOptions: {viewMode: true, hasAnnotations: this.containsMdlWithAnn}}
    this.viewReactionListingView = this.renderCollection(
      this.collection,
      ReactionListingView,
      this.queryByHook('view-reaction-list'),
      options
    );
  },
  toggleAddReactionButton: function () {
    $(this.queryByHook('add-reaction-full')).prop('disabled', (this.collection.parent.species.length <= 0));
    $(this.queryByHook('add-reaction-partial')).prop('disabled', (this.collection.parent.species.length <= 0));
  },
  toggleReactionTypes: function (e, prev, curr) {
    if(curr && curr.add && this.collection.parent.parameters.length === 1){
      $(this.queryByHook('massaction-message')).prop('hidden', true);
      $(this.queryByHook('add-reaction-full')).prop('hidden', false);
      $(this.queryByHook('add-reaction-partial')).prop('hidden', true);
    }else if(curr && !curr.add && this.collection.parent.parameters.length === 0){
      $(this.queryByHook('massaction-message')).prop('hidden', false);
      $(this.queryByHook('add-reaction-full')).prop('hidden', true);
      $(this.queryByHook('add-reaction-partial')).prop('hidden', false);
    }
    if(this.selectedReaction){
      this.selectedReaction.detailsView.renderReactionTypesSelectView()
    }
  },
  setSelectedReaction: function (reaction) {
    this.collection.each(function (m) { m.selected = false; });
    reaction.selected = true;
    this.selectedReaction = reaction;
  },
  setDetailsView: function (reaction) {
    reaction.detailsView = this.newDetailsView(reaction);
    this.detailsViewSwitcher.set(reaction.detailsView);
  },
  handleAddReactionClick: function (e) {
    var reactionType = e.delegateTarget.dataset.hook;
    var stoichArgs = this.getStoichArgsForReactionType(reactionType);
    if(this.parent.model.domain.types) {
      var types = this.parent.model.domain.types.map(function (type) {
        return type.typeID;
      });
      types.shift()
    }else{
      var types = []
    }
    var reaction = this.collection.addReaction(reactionType, stoichArgs, types);
    reaction.detailsView = this.newDetailsView(reaction);
    this.collection.trigger("select", reaction);
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  getStoichArgsForReactionType: function(type) {
    var args = ReactionTypes[type];
    return args;
  },
  newDetailsView: function (reaction) {
    var detailsView = new ReactionDetailsView({ model: reaction });
    detailsView.parent = this;
    return detailsView
  },
  openReactionsContainer: function () {
    $(this.queryByHook('reactions-list-container')).collapse('show');
    let collapseBtn = $(this.queryByHook('collapse'))
    collapseBtn.trigger('click')
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  getDefaultSpecie: function () {
    var value = this.collection.parent.species.models[0];
    return value;
  },
  getAnnotation: function (type) {
    return ReactionTypes[type].label
  },
  toggleProcessError: function () {
    let errorMsg = $(this.queryByHook('process-component-error'))
    if(this.collection.parent.is_spatial){
      errorMsg.html("<p class='text-danger'>A model must have at least one reaction</p>")
    }
    let model = this.collection.parent
    if(this.collection.length <= 0 && model.eventsCollection.length <= 0 && model.rules.length <= 0) {
      errorMsg.addClass('component-invalid')
      errorMsg.removeClass('component-valid')
    }else{
      errorMsg.addClass('component-valid')
      errorMsg.removeClass('component-invalid')
    }
  },
  renderReactionTypes: function () {
    var options = {
      displayMode: false,
      output: 'html',
    }
    katex.render(ReactionTypes['creation'].label, this.queryByHook('creation-lb1'), options);
    katex.render(ReactionTypes['destruction'].label, this.queryByHook('destruction-lb1'), options);
    katex.render(ReactionTypes['change'].label, this.queryByHook('change-lb1'), options);
    katex.render(ReactionTypes['dimerization'].label, this.queryByHook('dimerization-lb1'), options);
    katex.render(ReactionTypes['merge'].label, this.queryByHook('merge-lb1'), options);
    katex.render(ReactionTypes['split'].label, this.queryByHook('split-lb1'), options);
    katex.render(ReactionTypes['four'].label, this.queryByHook('four-lb1'), options);
  }
});