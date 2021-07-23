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
//models
let StoichSpecie = require('../../models/stoich-specie');
//views
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
let EditStoichSpecieView = require('./edit-stoich-specie');
let EditCustomStoichSpecieView = require('./edit-custom-stoich-specie');
//templates
let template = require('../templates/reactantProduct.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=select-specie]' : 'selectSpecie',
    'click [data-hook=add-selected-specie]' : 'addSelectedSpecie'
  },
  initialize: function (args) {
    View.prototype.initialize.apply(this, arguments);
    this.collection = args.collection;
    this.species = args.species;
    this.reactionType = args.reactionType;
    this.isReactants = args.isReactants
    this.unselectedText = 'Pick a species';
    this.fieldTitle = args.fieldTitle;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    let args = {
      viewOptions: {
        name: 'stoich-specie',
        required: true,
        textAttribute: 'name',
        eagerValidate: true,
        idAttribute: 'name',
        options: this.species
      }
    };
    let type = this.reactionType;
    let StoichSpeciesView = (type.startsWith('custom')) ? EditCustomStoichSpecieView : EditStoichSpecieView;
    this.renderCollection(
        this.collection,
        StoichSpeciesView,
        this.queryByHook('reactants-editor'),
        args
    );
    if(this.reactionType.startsWith('custom')) {
      $(this.queryByHook('collapse')).collapse();
    }
    this.toggleAddSpecieButton();
    if(this.fieldTitle === "Reactants"){
      $(this.queryByHook('field-title-tooltip')).prop('title', this.parent.parent.tooltips.reactant);
    }else{
      $(this.queryByHook('field-title-tooltip')).prop('title', this.parent.parent.tooltips.product);
    }
  },
  addSelectedSpecie: function () {
    var specieName = this.specieName ? this.specieName : 'Pick a variable';
    if(this.validateAddSpecie()) {
      this.collection.addStoichSpecie(specieName);
      this.toggleAddSpecieButton();
      this.collection.parent.trigger('change-reaction');
    }
  },
  selectSpecie: function (e) {
    if(this.unselectedText === e.target.selectedOptions.item(0).text){
      this.hasSelectedSpecie = false;
    }else{
      this.hasSelectedSpecie = true;
      this.specieName = e.target.selectedOptions.item(0).text;
    }
    this.toggleAddSpecieButton();
  },
  toggleAddSpecieButton: function () {
    if(!this.validateAddSpecie()){
      $(this.queryByHook('add-selected-specie')).prop('disabled', true);
    }else{
      $(this.queryByHook('add-selected-specie')).prop('disabled', false);
    }
    this.parent.toggleCustomReactionError();
  },
  validateAddSpecie: function () {
    if(this.hasSelectedSpecie){
      if(!this.collection.length) { return true; }
      if(this.collection.length < 2 && this.collection.at(0).ratio < 2) { return true; }
      if(this.reactionType !== 'custom-massaction') { return true; }
      if(!this.isReactants) { return true; }
      return false;
    }
    return false;
  },
  subviews: {
    selectSpecies: {
      hook: 'select-specie',
      prepareView: function (el) {
        return new SelectView({
          name: 'stoich-specie',
          required: false,
          textAttribute: 'name',
          eagerValidate: false,
          idAttribute: 'name',
          options: this.species,
          unselectedText: this.unselectedText
        });
      }
    }
  }
});