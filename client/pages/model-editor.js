var app = require('../app');
var _ = require('underscore');
var $ = require('jquery');
//views
var PageView = require('../pages/base');
var MeshEditorView = require('../views/mesh-editor');
var SpeciesEditorView = require('../views/species-editor');
var InitialConditionsEditorView = require('../views/initial-conditions-editor');
var ParametersEditorView = require('../views/parameters-editor');
var ReactionsEditorView = require('../views/reactions-editor');
var EventsEditorView = require('../views/events-editor');
var RulesEditorView = require('../views/rules-editor');
var PreviewSettingsView = require('../views/preview-settings');
var ModelStateButtonsView = require('../views/model-state-buttons');
//models
var Model = require('../models/model');
//templates
var template = require('../templates/pages/modelEditor.pug');

import initPage from './page.js';

let operationInfoModalHtml = () => {
  let editModelMessage = `
    <b>Add a Species or Parameter</b>: From the Model Editor page click on the Add Species or Add Parameter buttons.<br>
    <b>Add a Reaction</b>: From the Model Editor page click on the Add Reaction button then select the type of reaction.  
    To add a reaction you must have at least one Species.<br>
    <b>Edit a Reaction</b>: Select the reaction you wish to edit, and make changes to the right or the reaction list.<br>
    <b>Species Mode</b>: Select the Hybrid Tua-Leaping algorithm in the advanced settings.<br>
    <b>Set Rate Rules</b>: Set the mode of the species to continuous, then add the rate rule to the right of the species mode.<br>
    <b>Results</b>: The plot shown are a preview of the full results.  To get the full results, create and run a job.
  `;

  return `
    <div id="operationInfoModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Model Editor Help </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${editModelMessage} </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  ` 
}

let ModelEditor = PageView.extend({
  template: template,
  events: {
    'click [data-hook=edit-model-help]' : function () {
      let modal = $(operationInfoModalHtml()).modal();
    },
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    var directory = document.URL.split('/models/edit').pop();
    var modelFile = directory.split('/').pop();
    var name = decodeURI(modelFile.split('.')[0]);
    var isSpatial = modelFile.split('.').pop().startsWith('s');
    this.model = new Model({
      name: name,
      directory: directory,
      is_spatial: isSpatial,
      isPreview: true,
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews();
        if(!self.model.is_spatial){
          self.queryByHook('mesh-editor-container').style.display = "none";
          self.queryByHook('initial-conditions-editor-container').style.display = "none";
        }
      }
    });
    this.model.reactions.on("change", function (reactions) {
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
  },
  update: function () {
  },
  updateValid: function () {
  },
  updateSpeciesInUse: function () {
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
    var initialConditionsEditor = new InitialConditionsEditorView({
      collection: this.model.initialConditions
    });
    var parametersEditor = new ParametersEditorView({
      collection: this.model.parameters
    });
    var reactionsEditor = new ReactionsEditorView({
      collection: this.model.reactions
    });
    this.renderEventsView();
    this.renderRulesView();
    var previewSettings = new PreviewSettingsView({
      parent: this,
      model: this.model.simulationSettings,
    });
    var modelStateButtons = new ModelStateButtonsView({
      model: this.model
    });
    this.registerRenderSubview(meshEditor, 'mesh-editor-container');
    this.registerRenderSubview(speciesEditor, 'species-editor-container');
    this.registerRenderSubview(initialConditionsEditor, 'initial-conditions-editor-container');
    this.registerRenderSubview(parametersEditor, 'parameters-editor-container');
    this.registerRenderSubview(reactionsEditor, 'reactions-editor-container');
    this.registerRenderSubview(previewSettings, 'preview-settings-container');
    this.registerRenderSubview(modelStateButtons, 'model-state-buttons-container');
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  renderEventsView: function () {
    if(this.eventsEditor){
      this.eventsEditor.remove();
    }
    this.eventsEditor = new EventsEditorView({
      collection: this.model.eventsCollection
    });
    this.registerRenderSubview(this.eventsEditor, 'events-editor-container');
  },
  renderRulesView: function () {
    if(this.rulesEditor){
      this.rulesEditor.remove();
    }
    this.rulesEditor = new RulesEditorView({
      collection: this.model.rules
    });
    this.registerRenderSubview(this.rulesEditor, 'rules-editor-container');
  },
  subviews: {
  },
});

initPage(ModelEditor);
