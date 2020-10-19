/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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
var SpeciesViewer = require('../views/species-viewer');
var InitialConditionsEditorView = require('../views/initial-conditions-editor');
var ParametersEditorView = require('../views/parameters-editor');
var ParameterViewer = require('../views/parameters-viewer');
var ReactionsEditorView = require('../views/reactions-editor');
var ReactionsViewer = require('../views/reactions-viewer');
var EventsEditorView = require('../views/events-editor');
var EventsViewer = require('../views/events-viewer');
var RulesEditorView = require('../views/rules-editor');
var RulesViewer = require('../views/rules-viewer');
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
    'click [data-hook=project-breadcrumb-link]' : 'handleProjectBreadcrumbClick',
    'click [data-hook=toggle-preview-plot]' : 'togglePreviewPlot',
    'click [data-hook=download-png]' : 'clickDownloadPNGButton'
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
      this.projectName = this.getFileName(this.projectPath)
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
    var initialConditionsEditor = new InitialConditionsEditorView({
      collection: this.model.initialConditions
    });
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
    this.renderSpeciesView();
    this.registerRenderSubview(initialConditionsEditor, 'initial-conditions-editor-container');
    this.renderParametersView();
    this.renderReactionsView();
    this.renderEventsView();
    this.renderRulesView();
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
  renderSpeciesView: function (mode="edit") {
    if(this.speciesEditor) {
      this.speciesEditor.remove()
    }
    if(mode === "edit") {
      this.speciesEditor = new SpeciesEditorView({collection: this.model.species});
    }else{
      this.speciesEditor = new SpeciesViewer({collection: this.model.species});
    }
    this.registerRenderSubview(this.speciesEditor, 'species-editor-container');
  },
  renderParametersView: function (mode="edit", opened=false) {
    if(this.parametersEditor) {
      this.parametersEditor.remove()
    }
    if(mode === "edit") {
      this.parametersEditor = new ParametersEditorView({collection: this.model.parameters, opened: opened});
    }else{
      this.parametersEditor = new ParameterViewer({collection: this.model.parameters});
    }
    this.registerRenderSubview(this.parametersEditor, 'parameters-editor-container');
  },
  renderReactionsView: function (mode="edit", opened=false) {
    if(this.reactionsEditor) {
      this.reactionsEditor.remove()
    }
    if(mode === "edit") {
      this.reactionsEditor = new ReactionsEditorView({collection: this.model.reactions, opened: opened});
    }else{
      this.reactionsEditor = new ReactionsViewer({collection: this.model.reactions});
    }
    this.registerRenderSubview(this.reactionsEditor, 'reactions-editor-container');
  },
  renderEventsView: function (mode="edit", opened=false) {
    if(this.eventsEditor){
      this.eventsEditor.remove();
    }
    if(mode === "edit") {
      this.eventsEditor = new EventsEditorView({collection: this.model.eventsCollection, opened: opened});
    }else{
      this.eventsEditor = new EventsViewer({collection: this.model.eventsCollection});
    }
    this.registerRenderSubview(this.eventsEditor, 'events-editor-container');
  },
  renderRulesView: function (mode="edit", opened=false) {
    if(this.rulesEditor){
      this.rulesEditor.remove();
    }
    if(mode === "edit") {
      this.rulesEditor = new RulesEditorView({collection: this.model.rules, opened: opened});
    }else{
      this.rulesEditor = new RulesViewer({collection: this.model.rules})
    }
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
  togglePreviewPlot: function (e) {
    let action = e.target.innerText
    if(action === "Hide Preview") {
      this.closePlot()
    }else{
      this.openPlot()
    }
  },
  closePlot: function () {
    let plot = this.queryByHook("model-run-container")
    let button = this.queryByHook("toggle-preview-plot")
    plot.style.display = "none"
    button.innerText = "Show Preview"
    $(this.queryByHook('explore-model-msg')).css('display', 'none');
  },
  openPlot: function () {
    let plot = this.queryByHook("model-run-container")
    let button = this.queryByHook("toggle-preview-plot")
    plot.style.display = "block"
    button.innerText = "Hide Preview"
    $(this.queryByHook('explore-model-msg')).css('display', 'block');
  },
  clickDownloadPNGButton: function (e) {
    let pngButton = $('div[data-hook=model-run-container] a[data-title*="Download plot as a png"]')[0]
    console.log(pngButton)
    pngButton.click()
  }
});

initPage(ModelEditor);
