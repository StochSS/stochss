var View = require('ampersand-view');
var SelectView = require('ampersand-select-view');
//models
var StoichSpecie = require('../models/stoich-specie');
var StoichSpecies = require('../models/stoich-species');
//views
var EditStoichSpecieView = require('./edit-stoich-specie');
var EditCustomStoichSpecieView = require('./edit-custom-stoich-specie');

var template = require('../templates/includes/customAddReactantProduct.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=select-specie]' : 'selectSpecie',
    'click [data-hook=add-selected-specie]' : 'addSelectedSpecie'
  },
  initialize: function (args) {
    this.collection = args.collection;
    this.species = args.species;
    this.reactionType = args.reactionType;
    this.fieldTitle = args.fieldTitle
  },
  render: function () {
    var self = this;
    this.renderWithTemplate();
    var args = {
      viewOptions: {
        name: 'stoich-specie',
        label: '',
        required: true,
        textAttribute: 'name',
        eagerValidate: true,
        // Set idAttribute to name. Models may not be saved yet so id is unreliable (so is cid).
        // Use name since it *should be* unique.
        idAttribute: 'name',
        options: self.species,
        unselectedText: 'Pick a species',
      }
    };
    var type = self.reactionType;
    var StoichSpeciesView = (type === 'custom-propensity' || type === 'custom-massaction') ? EditCustomStoichSpecieView : EditStoichSpecieView
    self.renderCollection(
        self.collection,
        StoichSpeciesView,
        self.queryByHook('reactants-editor'),
        args
    );
  },
  subviews: {
    selectSpecies: {
      hook: 'select-specie',
      prepareView: function (el) {
        return new SelectView({
          name: 'stoich-specie',
          label: '',
          required: false,
          textAttribute: 'name',
          eagerValidate: false,
          // Set idAttribute to name. Models may not be saved yet so id is unreliable (so is cid).
          // Use name since it *should be* unique.
          idAttribute: 'name',
          options: this.species,
          unselectedText: 'Pick a species',
        });
      }
    }
  },
  selectSpecie: function (e) {
    this.specieName = e.target.selectedOptions.item(0).text;
  },
  addSelectedSpecie: function () {
    var specieName = this.specieName ? this.specieName : 'Pick a species';
    if(specieName !== 'Pick a species'){
      var specieValue = this.species.filter(function (specie) {
        return specie.name === specieName;
      });
      specieValue = parseInt(specieValue);
      console.log(specieName + ' :: ' + specieValue);
      this.collection.add({
        ratio: 1,
        specie: {
          name: specieName,
          value: specieValue
        },
      });
    }
  }
});