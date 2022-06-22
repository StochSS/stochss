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
//views
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/stoichSpecieView.pug');

module.exports = SelectView.extend({
  template: template(),
  bindings: {
    'model.ratio' : {
      hook: 'ratio'
    }
  },
  events: {
    'change select' : 'selectChangeHandler',
    'click [data-hook=decrement]' : 'handleDecrement',
    'click [data-hook=increment]' : 'handleIncrement',
    'click [data-hook=custom-remove]' : 'deleteSpecie'
  },
  initialize: function () {
    SelectView.prototype.initialize.apply(this, arguments);
    this.value = this.model.specie.compID;
    if(this.parent.parent.custom) {
      this.isReactants = this.parent.parent.isReactants;
      this.reactionType = this.parent.parent.reactionType;
      this.stoichSpecies = this.parent.parent.collection;
      this.stoichSpecies.on('add', () => {
        this.toggleIncrementButton();
      });
      this.stoichSpecies.on('remove', () => {
        this.toggleIncrementButton();
      });
    }
  },
  render: function() {
    SelectView.prototype.render.apply(this, arguments);
    if(this.parent.parent.custom) {
      this.toggleDecrementButton();
      this.toggleIncrementButton();
    }else{
      $(this.queryByHook('custom-decrement')).css('display', 'none');
      $(this.queryByHook('custom-increment')).css('display', 'none');
      $(this.queryByHook('custom-remove')).css('display', 'none');
    }
    this.model.collection.parent.on('change-reaction', () => {
      var setValueFirstModel = () => {
        if(!this.options.length) {
          return;
        }
        if(this.yieldModel) {
          this.setValue(this.options.models[0]);
        }
        else {
          this.setValue(this.options.models[0][this.idAttribute]);
        }
      };

      this.renderOptions();
      if (this.hasOptionByValue(this.value)) {
        this.updateSelectedOption();
      }
      else {
        setValueFirstModel();
      }
    });
  },
  deleteSpecie: function () {
    if(!this.model.collection.parent.reactionType.startsWith('custom')) { return }
    let reaction = this.model.collection.parent;
    this.collection.removeStoichSpecie(this.model);
    reaction.trigger('change-reaction');
    this.parent.parent.toggleAddSpecieButton();
  },
  getReactionsCollection: function () {
    return this.model.collection.parent.collection;
  },
  getSpeciesCollection: function () {
    return this.model.collection.parent.collection.parent.species;
  },
  handleDecrement: function () {
    if(!this.model.collection.parent.reactionType.startsWith('custom')) { return }
    this.model.ratio--;
    this.model.collection.parent.trigger('change-reaction')
    this.toggleDecrementButton();
    if(this.validateRatioIncrement()){
      this.toggleIncrementButton();
      this.parent.parent.toggleAddSpecieButton();
    }
  },
  handleIncrement: function () {
    if(!this.model.collection.parent.reactionType.startsWith('custom')) { return }
    if(this.validateRatioIncrement()){
      this.model.ratio++;
      this.toggleIncrementButton();
      this.parent.parent.toggleAddSpecieButton();
      this.model.collection.parent.trigger('change-reaction')
    }
    this.toggleDecrementButton();
  },
  selectChangeHandler: function (e) {
    let species = this.getSpeciesCollection();
    let reactions = this.getReactionsCollection();
    let specie = species.get(e.target.selectedOptions.item(0).value, 'compID');
    this.model.specie = specie;
    this.value = specie.compID;
    reactions.trigger("change");
    this.model.collection.parent.trigger('change-reaction')
  },
  toggleDecrementButton: function () {
    $(this.queryByHook('decrement')).prop('disabled', this.model.ratio <= 1);
  },
  toggleIncrementButton: function () {
    $(this.queryByHook('increment')).prop('disabled', !this.validateRatioIncrement());
  },
  update: function () {},
  validateRatioIncrement: function () {
    if(this.stoichSpecies.length < 2 && this.model.ratio < 2)
      return true;
    if(this.reactionType === 'custom-propensity')
      return true;
    if(!this.isReactants)
      return true;
    return false;
  }
});