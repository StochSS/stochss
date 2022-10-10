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
let SpecieView = require('./specie-view');
let InputView = require('../../views/input');
//templates
let speciesTemplate = require('../templates/speciesView.pug');
let spatialSpeciesTemplate = require('../templates/spatialSpeciesView.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=add-species]' : 'handleAddSpeciesClick',
    'change [data-hook=species-filter]' : 'filterSpecies'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.spatial = attrs.spatial;
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.template = this.spatial ? spatialSpeciesTemplate : speciesTemplate;
    this.tooltips = Tooltips.speciesEditor;
    this.defaultMode = attrs.defaultMode;
    this.filterAttr = attrs.attr;
    this.filterKey = attrs.key;
    this.collection.on('update-species', (compID, specie, isNameUpdate, isDefaultMode) => {
      this.collection.parent.reactions.forEach((reaction) => {
        var changedReaction = false;
        reaction.reactants.forEach((reactant) => {
          if(reactant.specie.compID === compID) {
            reactant.specie = specie;
            changedReaction = true;
          }
        });
        reaction.products.forEach((product) => {
          if(product.specie.compID === compID) {
            product.specie = specie;
            changedReaction = true;
          }
        });
        if(changedReaction) {
          reaction.trigger('change-reaction');
        }
      });
      this.collection.parent.eventsCollection.forEach((event) => {
        event.eventAssignments.forEach((assignment) => {
          if(assignment.variable.compID === compID) {
            assignment.variable = specie;
          }
        })
        if(isNameUpdate && event.selected) {
          event.detailsView.renderEventAssignments();
        }
      });
      this.collection.parent.rules.forEach((rule) => {
        if(rule.variable.compID === compID) {
          rule.variable = specie;
        }
      });
      if(isNameUpdate) {
        this.parent.rulesView.renderEditRules();
      }
    });
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('species-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('species-view-tab')).tab('show');
      $(this.queryByHook('edit-species')).removeClass('active');
      $(this.queryByHook('view-species')).addClass('active');
    }else{
      this.toggleSpeciesCollectionError();
      this.renderEditSpeciesView({'key': this.filterKey, 'attr': this.filterAttr});
    }
    this.renderViewSpeciesView({'key': this.filterKey, 'attr': this.filterAttr});
  },
  addSpecies: function () {
    if(this.parent.model.domain.types) {
      var types = this.parent.model.domain.types.map(function (type) {
        return type.typeID;
      });
      types.shift();
    }else{
      var types = [];
    }
    this.collection.addSpecie(types);
    this.toggleSpeciesCollectionError();
    app.tooltipSetup();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  filterSpecies: function (e) {
    var key = e.target.value === "" ? null : e.target.value;
    var attr = null;
    if(key && key.includes(':')) {
      let attrKey = key.split(':');
      attr = attrKey[0].toLowerCase().replace(/ /g, '');
      key = attrKey[1];
    }
    if(!this.readOnly) {
      this.renderEditSpeciesView({'key': key, 'attr': attr});
    }
    this.renderViewSpeciesView({'key': key, 'attr': attr});
  },
  handleAddSpeciesClick: function (e) {
    let self = this;
    let defaultMode = this.collection.parent.defaultMode;
    if(defaultMode === "" && !this.collection.parent.is_spatial){
      this.parent.getInitialDefaultMode();
    }else{
      this.addSpecies();
    }
  },
  openSection: function ({editMode=true}={}) {
    if(!$(this.queryByHook("species-list-container")).hasClass("show")) {
      let specCollapseBtn = $(this.queryByHook("collapse"));
      specCollapseBtn.click();
      specCollapseBtn.html('-');
    }
    app.switchToEditTab(this, "species");
  },
  renderEditSpeciesView: function ({key=null, attr=null}={}) {
    if(this.editSpeciesView){
      this.editSpeciesView.remove();
    }
    let options = {filter: (model) => { return model.contains(attr, key); }}
    this.editSpeciesView = this.renderCollection(
      this.collection,
      SpecieView,
      this.queryByHook('edit-specie-list'),
      options
    );
    app.tooltipSetup();
  },
  renderViewSpeciesView: function ({key=null, attr=null}={}) {
    if(this.viewSpeciesView){
      this.viewSpeciesView.remove();
    }
    if(this.defaultMode !== "dynamic") {
      $(this.queryByHook("species-switching-header")).css("display", "none");
    }else{
      $(this.queryByHook("species-switching-header")).css("display", "block");
    }
    this.containsMdlWithAnn = this.collection.filter(function (model) {return model.annotation}).length > 0;
    if(!this.containsMdlWithAnn) {
      $(this.queryByHook("species-annotation-header")).css("display", "none");
    }else{
      $(this.queryByHook("species-annotation-header")).css("display", "block");
    }
    let options = {
      viewOptions: {parent: this, viewMode: true},
      filter: (model) => { return model.contains(attr, key); }
    };
    this.viewSpeciesView = this.renderCollection(
      this.collection,
      SpecieView,
      this.queryByHook('view-specie-list'),
      options
    );
    app.tooltipSetup();
  },
  toggleSpeciesCollectionError: function () {
    if(this.spatial) {return};
    let errorMsg = $(this.queryByHook('species-collection-error'));
    if(this.collection.length <= 0) {
      errorMsg.addClass('component-invalid');
      errorMsg.removeClass('component-valid');
    }else{
      errorMsg.addClass('component-valid');
      errorMsg.removeClass('component-invalid');
    }
  },
  update: function () {},
  updateValid: function () {},
  subviews: {
    filter: {
      hook: 'species-filter',
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
