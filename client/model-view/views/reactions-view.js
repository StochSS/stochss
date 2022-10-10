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
let katex = require('katex');
//support files
let app = require('../../app');
let Tooltips = require('../../tooltips');
let ReactionTypes = require('../../reaction-types');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let ReactionView = require('./reaction-view');
//templates
let template = require('../templates/reactionsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=creation]' : 'handleAddReactionClick',
    'click [data-hook=destruction]' : 'handleAddReactionClick',
    'click [data-hook=change]' : 'handleAddReactionClick',
    'click [data-hook=dimerization]' : 'handleAddReactionClick',
    'click [data-hook=merge]' : 'handleAddReactionClick',
    'click [data-hook=split]' : 'handleAddReactionClick',
    'click [data-hook=four]' : 'handleAddReactionClick',
    'click [data-hook=custom-massaction]' : 'handleAddReactionClick',
    'click [data-hook=custom-propensity]' : 'handleAddReactionClick',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'change [data-hook=reaction-filter]' : 'filterReactions'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.reactionsEditor;
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.filterAttr = attrs.attr;
    this.filterKey = attrs.key;
    if(!this.readOnly) {
      this.collection.parent.species.on('add remove', this.toggleAddReactionButton, this);
      this.collection.parent.parameters.on('add remove', this.updateMAState, this);
      this.collection.parent.on('change', this.toggleProcessError, this);
    }
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('reactions-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('reactions-view-tab')).tab('show');
      $(this.queryByHook('edit-reactions')).removeClass('active');
      $(this.queryByHook('view-reactions')).addClass('active');
    }else{
      this.renderEditReactionView({'key': this.filterKey, 'attr': this.filterAttr});
      this.toggleAddReactionButton();
      this.updateMAState();
      this.renderReactionTypes();
      this.toggleProcessError();
    }
    katex.render("\\emptyset", this.queryByHook('emptyset'), {
      displayMode: false,
      output: 'html',
    });
    this.renderViewReactionView({'key': this.filterKey, 'attr': this.filterAttr});
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  filterReactions: function (e) {
    var key = e.target.value === "" ? null : e.target.value;
    var attr = null;
    if(key && key.includes(':')) {
      let attrKey = key.split(':');
      attr = attrKey[0].toLowerCase().replace(/ /g, '');
      key = attrKey[1];
    }
    if(!this.readOnly) {
      this.renderEditReactionView({'key': key, 'attr': attr});
    }
    this.renderViewReactionView({'key': key, 'attr': attr});
  },
  getStoichArgsForReactionType: function(type) {
    return ReactionTypes[type];
  },
  handleAddReactionClick: function (e) {
    let disableTypes = this.collection.parent.parameters.length == 0;
    let maTypes = [
      "creation", "destruction", "change", "dimerization",
      "merge", "split", "four", "custom-massaction"
    ]
    let reactionType = e.delegateTarget.dataset.hook;
    if(disableTypes && maTypes.includes(reactionType)) {
      return
    }
    if(this.parent.model.domain.types) {
      var types = this.parent.model.domain.types.map(function (type) {
        return type.typeID;
      });
      types.shift();
    }else{
      var types = [];
    }
    let stoichArgs = this.getStoichArgsForReactionType(reactionType);
    let reaction = this.collection.addReaction(reactionType, stoichArgs, types);
    app.tooltipSetup();
    this.collection.trigger('change');
  },
  openSection: function (error, {isCollection=false}={}) {
    if(!$(this.queryByHook("reactions-list-container")).hasClass("show")) {
      let reacCollapseBtn = $(this.queryByHook("collapse"));
      reacCollapseBtn.click();
      reacCollapseBtn.html('-');
    }
    if(!this.readOnly) {
      app.switchToEditTab(this, "reactions");
    }
    if(error && error.type !== "process") {
      let reactionView = this.editReactionView.views.filter((reactView) => {
        return reactView.model.compID === error.id;
      })[0];
      reactionView.model.selected = true;
      reactionView.openReactionDetails();
    }
  },
  renderEditReactionView: function ({key=null, attr=null}={}) {
    if(this.editReactionView){
      this.editReactionView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editReactionView = this.renderCollection(
      this.collection,
      ReactionView,
      this.queryByHook('edit-reaction-list'),
      options
    );
    app.tooltipSetup();
  },
  renderReactionTypes: function () {
    let options = {
      displayMode: false,
      output: 'html'
    }
    katex.render(ReactionTypes['creation'].label, this.queryByHook('creation-lb1'), options);
    katex.render(ReactionTypes['destruction'].label, this.queryByHook('destruction-lb1'), options);
    katex.render(ReactionTypes['change'].label, this.queryByHook('change-lb1'), options);
    katex.render(ReactionTypes['dimerization'].label, this.queryByHook('dimerization-lb1'), options);
    katex.render(ReactionTypes['merge'].label, this.queryByHook('merge-lb1'), options);
    katex.render(ReactionTypes['split'].label, this.queryByHook('split-lb1'), options);
    katex.render(ReactionTypes['four'].label, this.queryByHook('four-lb1'), options);
  },
  renderViewReactionView: function ({key=null, attr=null}={}) {
    if(this.viewReactionView){
      this.viewReactionView.remove();
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
    let options = {
      viewOptions: {viewMode: true, hasAnnotations: this.containsMdlWithAnn},
      filter: (model) => { return model.contains(attr, key); }
    }
    this.viewReactionView = this.renderCollection(
      this.collection,
      ReactionView,
      this.queryByHook('view-reaction-list'),
      options
    );
  },
  toggleAddReactionButton: function () {
    $(this.queryByHook('add-reaction')).prop('disabled', (this.collection.parent.species.length <= 0));
  },
  toggleProcessError: function () {
    let model = this.collection.parent;
    if(model.is_spatial) {return};
    let errorMsg = $(this.queryByHook('process-component-error'));
    if(this.collection.length <= 0 && model.eventsCollection.length <= 0 && model.rules.length <= 0) {
      errorMsg.addClass('component-invalid');
      errorMsg.removeClass('component-valid');
    }else{
      errorMsg.addClass('component-valid');
      errorMsg.removeClass('component-invalid');
    }
  },
  update: function () {},
  updateMAState: function () {
    let disableTypes = this.collection.parent.parameters.length == 0;
    let maTypes = [
      "creation", "destruction", "change", "dimerization",
      "merge", "split", "four", "custom-massaction"
    ]
    for(var i = 0; i < maTypes.length; i++) {
      if(disableTypes) {
        $(this.queryByHook(maTypes[i])).addClass("disabled")
      }else{
        $(this.queryByHook(maTypes[i])).removeClass("disabled")
      }
    }
    $(this.queryByHook('massaction-message')).prop('hidden', !disableTypes);
  },
  updateValid: function () {},
  subviews: {
    filter: {
      hook: 'reaction-filter',
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