var _ = require('underscore');
var $ = require('jquery');
let path = require('path');
//support files
var app = require('../app');
var modals = require('../modals')
//views
var PageView = require('../pages/base');
var MeshEditorView = require('../views/mesh-editor');
var SpeciesEditorView = require('../views/species-editor');
var InitialConditionsEditorView = require('../views/initial-conditions-editor');
var ParametersEditorView = require('../views/parameters-editor');
var ReactionsEditorView = require('../views/reactions-editor');
var EventsEditorView = require('../views/events-editor');
var RulesEditorView = require('../views/rules-editor');
var SBMLComponentView = require('../views/sbml-component-editor');
var ModelSettingsView = require('../views/model-settings');
var ModelStateButtonsView = require('../views/model-state-buttons');
//models
var Model = require('../models/model');
//templates
var template = require('../templates/pages/modelEditor.pug');

import initPage from './page.js';

let ModelEditor = PageView.extend({
  template: template,
  events: {
    'click [data-hook=edit-model-help]' : function () {
      let modal = $(modals.operationInfoModalHtml('model-editor')).modal();
    },
    'click [data-hook=collapse-me-advanced-section]' : 'changeCollapseButtonText',
    'click [data-hook=project-breadcrumb-link]' : 'handleProjectBreadcrumbClick'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    let urlParams = new URLSearchParams(window.location.search)
    var directory = urlParams.get('path');
    var modelFile = directory.split('/').pop();
    var name = this.getFileName(decodeURI(modelFile));
    var isSpatial = modelFile.split('.').pop().startsWith('s');
    this.model = new Model({
      name: name,
      directory: directory,
      is_spatial: isSpatial,
      isPreview: true,
      for: "edit",
    });
    if(directory.includes('.proj')) {
      this.projectPath = path.dirname(directory)
      this.projectName = this.projectPath.split('/').pop().split('.')[0]
    }
    this.model.fetch({
      success: function (model, response, options) {
        if(directory.includes('.proj')) {
          self.queryByHook("project-breadcrumb-links").style.display = "block"
          self.queryByHook("model-name-header").style.display = "none"
        }
        self.renderSubviews();
        if(!self.model.is_spatial){
          self.queryByHook('mesh-editor-container').style.display = "none";
          self.queryByHook('initial-conditions-editor-container').style.display = "none";
        }
        if(!self.model.functionDefinitions.length) {
          self.queryByHook('sbml-component-container').style.display = "none";
        }
      }
    });
    this.model.reactions.on("change", function (reactions) {
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
    this.model.eventsCollection.on("add change remove", function (){
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
    this.model.rules.on("add change remove", function() {
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
  },
  update: function () {
  },
  updateValid: function () {
  },
  getFileName: function (file) {
    if(file.endsWith('/')) {
      file.slice(0, -1)
    }
    if(file.includes('/')) {
      file = file.split('/').pop()
    }
    if(!file.includes('.')) {
      return file
    }
    return file.split('.').slice(0, -1).join('.')
  },
  handleProjectBreadcrumbClick: function () {
    this.modelStateButtons.saveModel(_.bind(function (e) {
      let endpoint = path.join(app.getBasePath(), "stochss/project/manager")+"?path="+this.projectPath
      window.location.href = endpoint
    }, this))
  },
  updateSpeciesInUse: function () {
    var species = this.model.species;
    var reactions = this.model.reactions;
    var events = this.model.eventsCollection;
    var rules = this.model.rules;
    species.forEach(function (specie) { specie.inUse = false; });
    var updateInUseForReaction = function (stoichSpecie) {
      _.where(species.models, { compID: stoichSpecie.specie.compID })
       .forEach(function (specie) {
          specie.inUse = true;
        });
    }
    var updateInUseForOther = function (specie) {
      _.where(species.models, { compID: specie.compID })
       .forEach(function (specie) {
         specie.inUse = true;
       });
    }
    reactions.forEach(function (reaction) {
      reaction.products.forEach(updateInUseForReaction);
      reaction.reactants.forEach(updateInUseForReaction);
    });
    events.forEach(function (event) {
      event.eventAssignments.forEach(function (assignment) {
        updateInUseForOther(assignment.variable)
      });
    });
    rules.forEach(function (rule) {
      updateInUseForOther(rule.variable);
    });
  },
  updateParametersInUse: function () {
    var parameters = this.model.parameters;
    var reactions = this.model.reactions;
    var events = this.model.eventsCollection;
    var rules = this.model.rules;
    parameters.forEach(function (param) { param.inUse = false; });
    var updateInUse = function (param) {
      _.where(parameters.models, { compID: param.compID })
       .forEach(function (param) {
         param.inUse = true;
       });
    }
    reactions.forEach(function (reaction) {
      if(reaction.reactionType !== "custom-propensity"){
        updateInUse(reaction.rate);
      }
    });
    events.forEach(function (event) {
      event.eventAssignments.forEach(function (assignment) {
        updateInUse(assignment.variable)
      });
    });
    rules.forEach(function (rule) {
      updateInUse(rule.variable);
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
    var sbmlComponentView = new SBMLComponentView({
      functionDefinitions: this.model.functionDefinitions,
    });
    var modelSettings = new ModelSettingsView({
      parent: this,
      model: this.model.modelSettings,
    });
    this.modelStateButtons = new ModelStateButtonsView({
      model: this.model
    });
    this.registerRenderSubview(meshEditor, 'mesh-editor-container');
    this.registerRenderSubview(speciesEditor, 'species-editor-container');
    this.registerRenderSubview(initialConditionsEditor, 'initial-conditions-editor-container');
    this.registerRenderSubview(parametersEditor, 'parameters-editor-container');
    this.registerRenderSubview(reactionsEditor, 'reactions-editor-container');
    this.registerRenderSubview(sbmlComponentView, 'sbml-component-container');
    this.registerRenderSubview(modelSettings, 'model-settings-container');
    this.registerRenderSubview(this.modelStateButtons, 'model-state-buttons-container');
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
    });
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
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
  },
});

initPage(ModelEditor);
