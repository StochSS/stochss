var $ = require('jquery');
//views
var View = require('ampersand-view');
var EditNonspatialSpecieView = require('./edit-specie');
var EditSpatialSpecieView = require('./edit-spatial-specie');
//templates
var nonspatialSpecieTemplate = require('../templatesV2/includes/speciesEditor.pug');
var spatialSpecieTemplate = require('../templatesV2/includes/spatialSpeciesEditor.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=add-species]' : 'addSpecies',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.baseModel = this.collection.parent;
  },
  render: function () {
    this.template = this.parent.model.is_spatial ? spatialSpecieTemplate : nonspatialSpecieTemplate;
    View.prototype.render.apply(this, arguments);
    var editSpecieView = !this.collection.parent.is_spatial ? EditNonspatialSpecieView : EditSpatialSpecieView;
    this.renderCollection(this.collection, editSpecieView, this.queryByHook('specie-list'));
  },
  update: function () {
  },
  updateValid: function () {
  },
  addSpecies: function () {
    var subdomains = this.baseModel.meshSettings.uniqueSubdomains.map(function (model) {return model.name; });
    this.collection.addSpecie(subdomains);
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});