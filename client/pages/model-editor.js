var app = require('ampersand-app');
var _ = require('underscore');
var $ = require('jquery');
//views
var PageView = require('../pages/base');
var MeshEditorView = require('../views/mesh-editor');
var SpeciesEditorView = require('../views/species-editor');
var ParametersEditorView = require('../views/parameters-editor');
var ReactionsEditorView = require('../views/reactions-editor');
var SimSettingsView = require('../views/simulation-settings');
var ModelStateButtonsView = require('../views/model-state-buttons');
//models
var Model = require('../models/model');
//templates
var template = require('../templates/pages/modelEditor.pug');

module.exports = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    var name = document.URL.split('/').pop();
    this.model = new Model({
      name: name,
    });
    this.model.fetch({
      success: function (model, response, options) {
        //model.is_spatial = true;
        self.renderSubviews();
        if(self.model.is_spatial)
          $(self.queryByHook('mesh-editor-container')).collapse();
      }
    });
    this.model.reactions.on("change", function (reactions) {
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
  },
  render: function () {
    PageView.prototype.render.apply(this, arguments);
  },
  update: function () {
  },
  updateValid: function () {
  },
  updateSpeciesInUse: function () {
    // TODO is there a more efficient/elegant way to update inUse?
    var species = this.model.species;
    var reactions = this.model.reactions;
    species.forEach(function (specie) { specie.inUse = false; });
    var updateInUse = function (stoichSpecie) {
      _.where(species.models, { name: stoichSpecie.specie.name })
       .forEach(function (specie) {
          specie.inUse = true;
        });
    }
    reactions.forEach(function (reaction) {
      reaction.products.forEach(updateInUse);
      reaction.reactants.forEach(updateInUse);
    });
  },
  updateParametersInUse: function () {
    var parameters = this.model.parameters;
    var reactions = this.model.reactions;
    parameters.forEach(function (param) { param.inUse = false; });
    var updateInUse = function (param) {
      _.where(parameters.models, { name: param.name })
       .forEach(function (param) {
         param.inUse = true;
       });
    }
    reactions.forEach(function (reaction) {
      updateInUse(reaction.rate);
    });
  },
  renderSubviews: function () {
    var meshEditor = new MeshEditorView({
      model: this.model.meshSettings
    });
    var speciesEditor = new SpeciesEditorView({
      collection: this.model.species
    });
    var parametersEditor = new ParametersEditorView({
      collection: this.model.parameters
    });
    var reactionsEditor = new ReactionsEditorView({
      collection: this.model.reactions
    });
    var simSettings = new SimSettingsView({
      parent: this,
      model: this.model.simulationSettings,
      species: this.model.species
    });
    var modelStateButtons = new ModelStateButtonsView({
      model: this.model
    });
    this.registerRenderSubview(meshEditor, 'mesh-editor-container');
    this.registerRenderSubview(speciesEditor, 'species-editor-container');
    this.registerRenderSubview(parametersEditor, 'parameters-editor-container');
    this.registerRenderSubview(reactionsEditor, 'reactions-editor-container');
    this.registerRenderSubview(simSettings, 'sim-settings-container');
    this.registerRenderSubview(modelStateButtons, 'model-state-buttons-container');
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  subviews: {
  },
});