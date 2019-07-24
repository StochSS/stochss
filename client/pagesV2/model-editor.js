var app = require('ampersand-app');
var _ = require('underscore');
var $ = require('jquery');
//views
var PageView = require('../pages/base');
// var MeshEditorView = require('../viewsV2/mesh-editor');
var SpeciesEditorView = require('../viewsV2/species-editor');
var ParametersEditorView = require('../viewsV2/parameters-editor');
var ReactionsEditorView = require('../viewsV2/reactions-editor');
// var SimSettingsView = require('../viewsV2/simulation-settings');
// var ModelStateButtonsView = require('../veiwsV2/model-state-buttons');
//models
var Model = require('../modelsV2/model');
//templates
var template = require('../templatesV2/pages/modelEditor.pug');

module.exports = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var name = document.URL.split('/').pop();
    this.model = new Model({
      name: name,
    });
    this.model.fetch();
    //this.model.is_spatial = true;
    this.model.reactions.on("change", function (reactions) {
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
  },
  render: function () {
    PageView.prototype.render.apply(this, arguments);
    if(this.model.is_spatial)
      $(this.queryByHook('mesh-editor-container')).collapse();
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
  subviews: {
    // meshEditor: {
    //   selector: '[data-hook=mesh-editor-container]',
    //   waitFor: 'model',
    //   prepareView: function (el) {
    //     return new MeshEditorView({
    //       model: this.model.meshSettings
    //     });
    //   },
    // },
    speciesEditor: {
      selector: '[data-hook=species-editor-container]',
      waitFor: 'model.species',
      prepareView: function (el) {
        return new SpeciesEditorView({
          collection: this.model.species
        });
      },
    },
    parametersEditor: {
      selector: '[data-hook=parameters-editor-container]',
      waitFor: 'model.parameters',
      prepareView: function (el) {
        return new ParametersEditorView({
          collection: this.model.parameters
        });
      }, 
    },
    reactionsEditor: {
      selector: '[data-hook=reactions-editor-container]',
      waitFor: 'model.reactions',
      prepareView: function (el) {
        return new ReactionsEditorView({
          collection: this.model.reactions
        });
      },
    },
    // simSettings: {
    //   selector: '[data-hook=sim-settings-container]',
    //   waitFor: 'model',
    //   prepareView: function (el) {
    //     return new SimSettingsView({
    //       parent: this,
    //       model: this.model.simulationSettings,
    //       species: this.model.species
    //     });
    //   },
    // },
    // modelStateButtons: {
    //   selector: '[data-hook=model-state-buttons-container]',
    //   waitFor: 'model',
    //   prepareView: function (el) {
    //     return new ModelStateButtonsView({
    //       model: this.model
    //     });
    //   },
    // },
  },
});