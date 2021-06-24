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

let $ = require('jquery');
//support files
let app = require('../app');
let Tooltips = require('../tooltips');
//views
let View = require('ampersand-view');
let SpecieView = require('./edit-species');
//templates
let speciesTemplate = require('../templates/includes/speciesEditor.pug');
let spatialSpeciesTemplate = require('../templates/includes/spatialSpeciesEditor.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=add-species]' : 'handleAddSpeciesClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.spatial = attrs.spatial
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.template = this.spatial ? spatialSpeciesTemplate : speciesTemplate;
    this.tooltips = Tooltips.speciesEditor;
    this.defaultMode = attrs.defaultMode;
    let self = this
    this.collection.on('update-species', function (compID, specie, isNameUpdate, isDefaultMode) {
      self.collection.parent.reactions.forEach(function (reaction) {
        reaction.reactants.forEach(function (reactant) {
          if(reactant.specie.compID === compID) {
            reactant.specie = specie;
          }
        });
        reaction.products.forEach(function (product) {
          if(product.specie.compID === compID) {
            product.specie = specie;
          }
        });
        if(isNameUpdate) {
          reaction.buildSummary();
          if(reaction.selected) {
            self.parent.reactionsEditor.setDetailsView(reaction);
          }
        }else if(!isDefaultMode || specie.compID === self.collection.models[self.collection.length-1].compID){
          reaction.checkModes();
        }
      });
      self.collection.parent.eventsCollection.forEach(function (event) {
        event.eventAssignments.forEach(function (assignment) {
          if(assignment.variable.compID === compID) {
            assignment.variable = specie;
          }
        })
        if(isNameUpdate && event.selected) {
          event.detailsView.renderEventAssignments();
        }
      });
      self.collection.parent.rules.forEach(function (rule) {
        if(rule.variable.compID === compID) {
          rule.variable = specie;
        }
      });
      if(isNameUpdate) {
        self.parent.renderRulesView();
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
      this.renderEditSpeciesView();
    }
    this.renderViewSpeciesView();
  },
  addSpecies: function () {
    if(this.parent.model.domain.types) {
      var types = this.parent.model.domain.types.map(function (type) {
        return type.typeID;
      });
      types.shift()
    }else{
      var types = []
    }
    this.collection.addSpecie(types);
    this.toggleSpeciesCollectionError()
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
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
  renderEditSpeciesView: function () {
    if(this.editSpeciesView){
      this.editSpeciesView.remove();
    }
    let options = {viewOptions: {parent: this}};
    this.editSpeciesView = this.renderCollection(
      this.collection,
      SpecieView,
      this.queryByHook('edit-specie-list')
    );
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  renderViewSpeciesView: function () {
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
    let options = {viewOptions: {parent: this, viewMode: true}};
    this.viewSpeciesView = this.renderCollection(
      this.collection,
      SpecieView,
      this.queryByHook('view-specie-list'),
      options
    );
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  toggleSpeciesCollectionError: function () {
    if(this.spatial) {return};
    let errorMsg = $(this.queryByHook('species-collection-error'))
    if(this.collection.length <= 0) {
      errorMsg.addClass('component-invalid')
      errorMsg.removeClass('component-valid')
    }else{
      errorMsg.addClass('component-valid')
      errorMsg.removeClass('component-invalid')
    }
  }
});
