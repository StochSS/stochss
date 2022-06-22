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
//views
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
let StoichSpeciesView = require('./stoich-species-view');
//templates
let template = require('../templates/reactantProduct.pug');

module.exports = View.extend({
  template: template,
  events: function () {
    let events = {};
    events[`change [data-hook=${this.hookAnchor}-select-specie]`] = 'selectSpecie';
    events[`click [data-hook=${this.hookAnchor}-add-selected-specie]`] = 'addSelectedSpecie';
    return events;
  },
  initialize: function (args) {
    View.prototype.initialize.apply(this, arguments);
    this.collection = args.collection;
    this.species = args.species;
    this.reactionType = args.reactionType;
    this.custom = args.reactionType.startsWith('custom');
    this.isReactants = args.isReactants;
    this.unselectedText = 'Pick a species';
    if(this.isReactants) {
      this.fieldTitle = 'Reactants';
      this.hookAnchor = 'reactants';
    }else{
      this.fieldTitle = 'Products';
      this.hookAnchor = 'products';
    }
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.isReactants) {
      var tooltip = this.parent.parent.tooltips.reactant;
    }else{
      var tooltip = this.parent.parent.tooltips.product;
    }
    $(this.queryByHook('field-title-tooltip')).prop('title', tooltip);
    this.renderStoichSpecies();
    if(this.custom) {
      $(this.queryByHook(`custom-${this.hookAnchor}`)).css('display', 'block');
      this.renderSelectSpeciesView();
      this.toggleAddSpecieButton();
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
  renderSelectSpeciesView: function () {
    if(this.selectSpeciesView) {
      this.selectSpeciesView.remove();
    }

    this.selectSpeciesView = new SelectView({
      name: 'stoich-specie',
      required: false,
      textAttribute: 'name',
      eagerValidate: false,
      idAttribute: 'compID',
      options: this.species,
      unselectedText: this.unselectedText
    });
    app.registerRenderSubview(this, this.selectSpeciesView, `${this.hookAnchor}-select-specie`);
  },
  renderStoichSpecies: function () {
    let args = {
      viewOptions: {
        name: 'stoich-specie',
        required: true,
        textAttribute: 'name',
        eagerValidate: true,
        idAttribute: 'compID',
        yieldModel: false,
        options: this.species
      }
    };
    this.renderCollection(
        this.collection,
        StoichSpeciesView,
        this.queryByHook(`${this.hookAnchor}-editor`),
        args
    );
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
    $(this.queryByHook(`${this.hookAnchor}-add-selected-specie`)).prop('disabled', !this.validateAddSpecie());
    this.parent.toggleCustomReactionError();
  },
  validateAddSpecie: function () {
    if(this.hasSelectedSpecie){
      if(!this.collection.length) { return true; }
      if(this.collection.length < 2 && this.collection.at(0).ratio < 2) { return true; }
      if(this.reactionType === 'custom-propensity') { return true; }
      if(!this.isReactants) { return true; }
      return false;
    }
    return false;
  },
});