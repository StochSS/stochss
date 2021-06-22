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
var modals = require('../modals');
var tests = require('../views/tests');
let Tooltips = require("../tooltips");
//views
var PageView = require('../pages/base');
var InputView = require('../views/input');
var DomainViewer = require('../views/domain-viewer');
var SpeciesEditorView = require('../views/species-editor');
var InitialConditionsEditorView = require('../views/initial-conditions-editor');
var InitialConditionsViewer = require('../views/initial-conditions-viewer');
var ParametersEditorView = require('../views/parameters-editor');
var ParticleViewer = require('../views/view-particle');
var ReactionsEditorView = require('../views/reactions-editor');
var EventsEditorView = require('../views/events-editor');
var RulesEditorView = require('../views/rules-editor');
var RulesViewer = require('../views/rules-viewer');
var SBMLComponentView = require('../views/sbml-component-editor');
var TimespanSettingsView = require('../views/timespan-settings');
var ModelStateButtonsView = require('../views/model-state-buttons');
var QuickviewDomainTypes = require('../views/quickview-domain-types');
//models
var Model = require('../models/model');
var Domain = require('../models/domain');
//templates
var template = require('../templates/pages/modelEditor.pug');

import initPage from './page.js';

let ModelEditor = PageView.extend({
  template: template,
  events: {
    'change [data-hook=all-continuous]' : 'setDefaultMode',
    'change [data-hook=all-discrete]' : 'setDefaultMode',
    'change [data-hook=advanced]' : 'setDefaultMode',
    'click [data-hook=edit-model-help]' : function () {
      let modal = $(modals.operationInfoModalHtml('model-editor')).modal();
    },
    'change [data-hook=edit-volume]' : 'updateVolumeViewer',
    'click [data-hook=collapse-me-advanced-section]' : 'changeCollapseButtonText',
    'click [data-hook=project-breadcrumb-link]' : 'handleProjectBreadcrumbClick',
    'click [data-hook=toggle-preview-plot]' : 'togglePreviewPlot',
    'click [data-hook=toggle-preview-domain]' : 'toggleDomainPlot',
    'click [data-hook=download-png]' : 'clickDownloadPNGButton',
    'click [data-hook=collapse-system-volume]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.modelEditor
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
      if(this.projectPath.endsWith(".wkgp")) {
        this.projectPath = path.dirname(this.projectPath)
      }
      this.projectName = this.getFileName(this.projectPath)
    }
    app.getXHR(this.model.url(), {
      success: function (err, response, body) {
        self.model.set(body)
        if(directory.includes('.proj')) {
          self.queryByHook("project-breadcrumb-links").style.display = "block"
          self.queryByHook("model-name-header").style.display = "none"
        }
        self.renderSubviews();
        self.model.updateValid()
      }
    })
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
    window.addEventListener("pageshow", function (event) {
      var navType = window.performance.navigation.type
      if(navType === 2){
        window.location.reload()
      }
    });
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
  renderParticleViewer: function (particle=null) {
    if(this.particleViewer) {
      this.particleViewer.remove();
    }
    if(this.typeQuickViewer) {
      this.typeQuickViewer.remove();
    }
    if(particle){
      $(this.queryByHook("me-select-particle")).css("display", "none")
      this.particleViewer = new ParticleViewer({
        model: particle
      });
      app.registerRenderSubview(this, this.particleViewer, "me-particle-viewer")
    }else{
      $(this.queryByHook("me-select-particle")).css("display", "block")
      this.typeQuickViewer = this.renderCollection(
        this.domainViewer.model.types,
        QuickviewDomainTypes,
        this.queryByHook("me-types-quick-view")
      );
    }
  },
  renderSubviews: function () {
    if(this.model.defaultMode === "" && !this.model.is_spatial){
      this.getInitialDefaultMode();
    }else{
      let dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced'}
      $(this.queryByHook(dataHooks[this.model.defaultMode])).prop('checked', true)
    }
    this.modelSettings = new TimespanSettingsView({
      parent: this,
      model: this.model.modelSettings,
    });
    this.modelStateButtons = new ModelStateButtonsView({
      model: this.model
    });
    this.renderSpeciesView();
    this.renderParametersView();
    this.renderReactionsView();
    app.registerRenderSubview(this, this.modelSettings, 'model-settings-container');
    app.registerRenderSubview(this, this.modelStateButtons, 'model-state-buttons-container');
    if(this.model.is_spatial) {
      $(this.queryByHook("advaced-model-mode")).css("display", "none");
      $(this.queryByHook("model-editor-advanced-container")).css("display", "none");
      $(this.queryByHook("spatial-beta-message")).css("display", "block");
      this.renderDomainViewer();
      this.renderInitialConditions();
      $(this.queryByHook("toggle-preview-domain")).css("display", "inline-block");
      this.openDomainPlot();
    }else {
      this.renderEventsView();
      this.renderRulesView();
      if(this.model.functionDefinitions.length) {
        var sbmlComponentView = new SBMLComponentView({
          functionDefinitions: this.model.functionDefinitions,
          viewModel: false
        });
        app.registerRenderSubview(this, sbmlComponentView, 'sbml-component-container');
      }
      this.renderSystemVolumeView();
    }
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
  renderDomainViewer: function(domainPath=null) {
    if(this.domainViewer) {
      this.domainViewer.remove()
    }
    if(domainPath && domainPath !== "viewing") {
      let self = this;
      let queryStr = "?path=" + this.model.directory + "&domain_path=" + domainPath
      let endpoint = path.join(app.getApiPath(), "spatial-model/load-domain") + queryStr
      app.getXHR(endpoint, {
        always: function (err, response, body) {
          let domain = new Domain(body.domain);
          self.domainViewer = new DomainViewer({
            parent: self,
            model: domain,
            domainPath: domainPath
          });
          app.registerRenderSubview(self, self.domainViewer, 'domain-viewer-container');
        }
      });
    }else{
      this.domainViewer = new DomainViewer({
        parent: this,
        model: this.model.domain,
        domainPath: domainPath
      });
      app.registerRenderSubview(this, this.domainViewer, 'domain-viewer-container');
    }
  },
  renderSpeciesView: function () {
    if(this.speciesEditor) {
      this.speciesEditor.remove()
    }
    this.speciesEditor = new SpeciesEditorView({
      collection: this.model.species,
      spatial: this.model.is_spatial,
      defaultMode: this.model.defaultMode
    });
    app.registerRenderSubview(this, this.speciesEditor, 'species-editor-container');
  },
  renderInitialConditions: function (mode="edit", opened=false) {
    if(this.initialConditionsEditor) {
      this.initialConditionsEditor.remove();
    }
    if(mode === "edit") {
      this.initialConditionsEditor = new InitialConditionsEditorView({
        collection: this.model.initialConditions,
        opened: opened
      });
    }else{
      this.initialConditionsEditor = new InitialConditionsViewer({
        collection: this.model.initialConditions
      });
    }
    app.registerRenderSubview(this, this.initialConditionsEditor, 'initial-conditions-editor-container');
    },
  renderParametersView: function () {
    if(this.parametersEditor) {
      this.parametersEditor.remove()
    }
    this.parametersEditor = new ParametersEditorView({collection: this.model.parameters});
    app.registerRenderSubview(this, this.parametersEditor, 'parameters-editor-container');
  },
  renderReactionsView: function () {
    if(this.reactionsEditor) {
      this.reactionsEditor.remove()
    }
    this.reactionsEditor = new ReactionsEditorView({collection: this.model.reactions});
    app.registerRenderSubview(this, this.reactionsEditor, 'reactions-editor-container');
  },
  renderEventsView: function () {
    if(this.eventsEditor){
      this.eventsEditor.remove();
    }
    this.eventsEditor = new EventsEditorView({collection: this.model.eventsCollection});
    app.registerRenderSubview(this, this.eventsEditor, 'events-editor-container');
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
    app.registerRenderSubview(this, this.rulesEditor, 'rules-editor-container');
  },
  renderSystemVolumeView: function () {
    if(this.systemVolumeView) {
      this.systemVolumeView.remove()
    }
    this.systemVolumeView = new InputView ({
      parent: this,
      required: true,
      name: 'system-volume',
      label: 'Volume: ',
      tests: tests.valueTests,
      modelKey: 'volume',
      valueType: 'number',
      value: this.model.volume,
    });
    app.registerRenderSubview(this, this.systemVolumeView, 'edit-volume')
    if(this.model.defaultMode === "continuous") {
      $(this.queryByHook("system-volume-container")).collapse("hide")
    }
    $(this.queryByHook("view-volume")).html("Volume:  " + this.model.volume)
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
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
    let runContainer = this.queryByHook("model-run-container")
    let button = this.queryByHook("toggle-preview-plot")
    runContainer.style.display = "none"
    button.innerText = "Show Preview"
  },
  openPlot: function () {
    if($(this.queryByHook("domain-plot-viewer-container")).css("display") !== "none") {
      this.closeDomainPlot()
    }
    let runContainer = this.queryByHook("model-run-container")
    let button = this.queryByHook("toggle-preview-plot")
    runContainer.style.display = "block"
    button.innerText = "Hide Preview"
  },
  toggleDomainPlot: function (e) {
    let action = e.target.innerText
    if(action === "Hide Domain") {
      this.closeDomainPlot();
    }else{
      this.openDomainPlot();
    }
  },
  openDomainPlot: function () {
    if($(this.queryByHook("model-run-container")).css("display") !== "none") {
      this.closePlot();
    }
    let domainView = this.queryByHook("domain-plot-viewer-container")
    let button = this.queryByHook("toggle-preview-domain")
    domainView.style.display = "block"
    button.innerText = "Hide Domain"
  },
  closeDomainPlot: function () {
    let domainView = this.queryByHook("domain-plot-viewer-container")
    let button = this.queryByHook("toggle-preview-domain")
    domainView.style.display = "none"
    button.innerText = "Show Domain"
  },
  clickDownloadPNGButton: function (e) {
    let pngButton = $('div[data-hook=preview-plot-container] a[data-title*="Download plot as a png"]')[0]
    pngButton.click()
  },
  getInitialDefaultMode: function () {
    var self = this;
    if(document.querySelector('#defaultModeModal')) {
      document.querySelector('#defaultModeModal').remove();
    }
    let modal = $(modals.renderDefaultModeModalHtml()).modal();
    let continuous = document.querySelector('#defaultModeModal .concentration-btn');
    let discrete = document.querySelector('#defaultModeModal .population-btn');
    let dynamic = document.querySelector('#defaultModeModal .hybrid-btn');
    continuous.addEventListener('click', function (e) {
      self.setInitialDefaultMode(modal, "continuous");
    });
    discrete.addEventListener('click', function (e) {
      self.setInitialDefaultMode(modal, "discrete");
    });
    dynamic.addEventListener('click', function (e) {
      self.setInitialDefaultMode(modal, "dynamic");
    });
  },
  setAllSpeciesModes: function (prevMode) {
    let self = this;
    this.model.species.forEach(function (specie) { 
      specie.mode = self.model.defaultMode;
      self.model.species.trigger('update-species', specie.compID, specie, false, true);
    });
    let switchToDynamic = (!Boolean(prevMode) || prevMode !== "dynamic") && this.model.defaultMode === "dynamic";
    let switchFromDynamic = Boolean(prevMode) && prevMode === "dynamic" && this.model.defaultMode !== "dynamic";
    if(switchToDynamic || switchFromDynamic) {
      this.speciesEditor.renderEditSpeciesView();
      this.speciesEditor.renderViewSpeciesView();
    }
  },
  setDefaultMode: function (e) {
    let prevMode = this.model.defaultMode;
    this.model.defaultMode = e.target.dataset.name;
    this.speciesEditor.defaultMode = e.target.dataset.name;
    this.setAllSpeciesModes(prevMode);
    this.toggleVolumeContainer();
  },
  setInitialDefaultMode: function (modal, mode) {
    var dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced'};
    modal.modal('hide');
    $(this.queryByHook(dataHooks[mode])).prop('checked', true);
    this.model.defaultMode = mode;
    this.speciesEditor.defaultMode = mode;
    this.setAllSpeciesModes();
    this.toggleVolumeContainer();
  },
  toggleVolumeContainer: function () {
    if(!this.model.is_spatial) {
      if(this.model.defaultMode === "continuous") {
        $(this.queryByHook("system-volume-container")).collapse("hide");
      }else{
        $(this.queryByHook("system-volume-container")).collapse("show");
      }
    }
  },
  updateVolumeViewer: function (e) {
    $(this.queryByHook("view-volume")).html("Volume:  " + this.model.volume)
  }
});

initPage(ModelEditor);
