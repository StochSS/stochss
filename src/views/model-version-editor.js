var app = require('ampersand-app');
var _ = require('underscore');
// Views
var View = require('ampersand-view');
var SpeciesEditorView = require('./species-editor');
var ParametersEditorView = require('./parameters-editor');
var ReactionsEditorView = require('./reactions-editor');
var RunModelView = require('./run-model');
var ModelStateButtonsView = require('./model-state-buttons');

var template = require('../templates/includes/modelVersionEditor.pug');

module.exports = View.extend({
  template: template,
  initialize: function () {
    this.model.reactions.on("change", function (reactions) {
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
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
    speciesEditor: {
      selector: '[data-hook=species-editor-container]',
      waitFor: 'model.species',
      prepareView: function (el) {
        return new SpeciesEditorView({
          collection: this.model.species
        });
      }
    },
    parametersEditor: {
      selector: '[data-hook=parameters-editor-container]',
      waitFor: 'model.parameters',
      prepareView: function (el) {
        return new ParametersEditorView({
          collection: this.model.parameters
        });
      } 
    },
    reactionsEditor: {
      selector: '[data-hook=reactions-editor-container]',
      waitFor: 'model.reactions',
      prepareView: function (el) {
        return new ReactionsEditorView({
          collection: this.model.reactions
        });
      }
    },
    runModel: {
      selector: '[data-hook=run-model-container]',
      waitFor: 'model',
      prepareView: function (el) {
        return new RunModelView({
          model: this.model
        });
      }
    },
    modelStateButtons: {
      selector: '[data-hook=model-state-buttons-container]',
      waitFor: 'model',
      prepareView: function (el) {
        return new ModelStateButtonsView({
          model: this.model
        });
      }
    }
  }
});
