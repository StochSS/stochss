var app = require('ampersand-app');
var $ = require('jquery');
// Views
var View = require('ampersand-view');
var EditNonspatialSpeciesView = require('./edit-specie');
var EditSpatialSpeciesView = require('./edit-spatial-specie');

var template = require('../templates/includes/speciesEditor.pug');
var spatialTemplate = require('../templates/includes/spatialSpeciesEditor.pug');

module.exports = View.extend({
  template: template,
  bindings: {
  },
  events: {
    'click [data-hook=add-species]' : 'addSpecies',
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  render: function () {
    if(this.parent.parent.model.is_spatial)
      this.template = spatialTemplate;
    this.renderWithTemplate();
    var EditSpeciesView = !this.parent.parent.model.is_spatial ? EditNonspatialSpeciesView : EditSpatialSpeciesView;
    this.renderCollection(this.collection, EditSpeciesView, this.queryByHook('specie-list'));
  },
  addSpecies: function () {
    var defaultName = 'S' + (this.collection.length + 1);
    this.parent.parent.model.is_spatial ? this.addSpatialSpecies(defaultName) : this.addNonspatialSpecies(defaultName);
  },
  addNonspatialSpecies: function (name) {
    this.collection.add({
      name: name,
      nonspatialSpecies: {
        value: 0
      }
    });
  },
  addSpatialSpecies: function (name) {
    this.collection.add({
      name: name,
      spatialSpecies: {
        diffusionCoeff: 0,
        subdomains: this.parent.model.meshSettings.uniqueSubdomains.map(function (model) {return model.name})
      }
    });
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  }
});
