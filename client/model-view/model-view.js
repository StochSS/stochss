/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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

let $ = require('jquery');
let path = require('path');
let _ = require('underscore');
//support files
let app = require('../app');
let modals = require('../modals');
let tests = require('../views/tests');
//models
let Domain = require('../models/domain');
//views
let View = require('ampersand-view');
let InputView = require('../views/input');
let RulesView = require('./views/rules-view');
let EventsView = require('./views/events-view');
let SpeciesView = require('./views/species-view');
let DomainViewer = require('./views/domain-viewer');
let ReactionsView = require('./views/reactions-view');
let ParametersView = require('./views/parameters-view');
let SBMLComponentsView = require('./views/sbml-components-view');
let InitialConditionsView = require('./views/initial-conditions-view');
let BoundaryConditionsView = require('./views/boundary-conditions-view');
//templates
let template = require('./modelView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=all-continuous]' : 'setDefaultMode',
    'change [data-hook=all-discrete]' : 'setDefaultMode',
    'change [data-hook=advanced]' : 'setDefaultMode',
    'change [data-hook=edit-volume]' : 'updateVolumeViewer',
    'click [data-hook=collapse-mv-advanced-section]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-system-volume]' : 'changeCollapseButtonText'
  },
  initialize: function(attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    let modeMap = {continuous: "Concentration", discrete: "Population", dynamic: "Hybrid Concentration/Population"};
    this.modelMode = modeMap[this.model.defaultMode];
    this.domainElements = Boolean(attrs.domainElements) ? attrs.domainElements : null;
    this.domainPlot = Boolean(attrs.domainPlot) ? attrs.domainPlot : null;
  },
  render: function(attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.updateSpeciesInUse();
    this.updateParametersInUse();
    this.renderDomainViewer();
    this.renderSpeciesView();
    this.renderInitialConditionsView();
    this.renderParametersView();
    this.renderReactionsView();
    this.renderEventsView();
    this.renderRulesView();
    this.renderBoundaryConditionsView();
    this.renderSbmlComponentView();
    this.renderSystemVolumeView();
    if(this.readOnly) {
      this.setReadOnlyMode("model-mode");
      this.setReadOnlyMode("system-volume");
    }else {
      if(this.model.defaultMode === "" && !this.model.is_spatial){
        this.getInitialDefaultMode();
      }else {
        let dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced'};
        $(this.queryByHook(dataHooks[this.model.defaultMode])).prop('checked', true);
        if(this.model.is_spatial) {
          $(this.queryByHook("advanced-model-mode")).css("display", "none");
          $(this.queryByHook("system-volume-container")).css("display", "none");
        }
      }
      this.model.reactions.on("change", (reactions) => {
        this.updateSpeciesInUse();
        this.updateParametersInUse();
      });
      this.model.eventsCollection.on("add change remove", () => {
        this.updateSpeciesInUse();
        this.updateParametersInUse();
      });
      this.model.rules.on("add change remove", () => {
        this.updateSpeciesInUse();
        this.updateParametersInUse();
      });
    }
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  getInitialDefaultMode: function () {
    if(document.querySelector('#defaultModeModal')) {
      document.querySelector('#defaultModeModal').remove();
    }
    let modal = $(modals.renderDefaultModeModalHtml()).modal();
    let continuous = document.querySelector('#defaultModeModal .concentration-btn');
    let discrete = document.querySelector('#defaultModeModal .population-btn');
    let dynamic = document.querySelector('#defaultModeModal .hybrid-btn');
    continuous.addEventListener('click', (e) => {
      this.setInitialDefaultMode(modal, "continuous");
    });
    discrete.addEventListener('click', (e) => {
      this.setInitialDefaultMode(modal, "discrete");
    });
    dynamic.addEventListener('click', (e) => {
      this.setInitialDefaultMode(modal, "dynamic");
    });
  },
  renderBoundaryConditionsView: function () {
    if(!this.model.is_spatial) { return };
    if(this.boundaryConditionsView) {
      this.boundaryConditionsView.remove();
    }
    this.boundaryConditionsView = new BoundaryConditionsView({
      collection: this.model.boundaryConditions,
      readOnly: this.readOnly
    });
    let hook = "boundary-conditions-view-container";
    app.registerRenderSubview(this, this.boundaryConditionsView, hook);
  },
  renderDomainViewer: function (domainPath=null) {
    if(!this.model.is_spatial) { return };
    if(this.domainViewer) {
      this.domainViewer.remove();
    }
    if(domainPath && domainPath !== "viewing") {
      let queryStr = `?path=${this.model.directory}&domain_path=${domainPath}`;
      let endpoint = path.join(app.getApiPath(), "spatial-model/load-domain") + queryStr;
      app.getXHR(endpoint, {
        always: (err, response, body) => {
          let domain = new Domain(body.domain);
          this.domainViewer = new DomainViewer({
            parent: this,
            model: domain,
            domainPath: domainPath,
            readOnly: this.readOnly,
            domainElements: this.domainElements,
            domainPlot: this.domainPlot
          });
          app.registerRenderSubview(this, this.domainViewer, 'domain-viewer-container');
        }
      });
    }else{
      this.domainViewer = new DomainViewer({
        parent: this,
        model: this.model.domain,
        domainPath: domainPath,
        readOnly: this.readOnly,
        domainElements: this.domainElements,
        domainPlot: this.domainPlot
      });
      app.registerRenderSubview(this, this.domainViewer, 'domain-viewer-container');
    }
  },
  renderEventsView: function () {
    if(this.model.is_spatial) { return };
    if(this.eventsView) {
      this.eventsView.remove();
    }
    this.eventsView = new EventsView({
      collection: this.model.eventsCollection,
      readOnly: this.readOnly
    });
    let hook = "events-view-container";
    app.registerRenderSubview(this, this.eventsView, hook);
  },
  renderInitialConditionsView: function () {
    if(!this.model.is_spatial) { return };
    if(this.initialConditionsView) {
      this.initialConditionsView.remove();
    }
    this.initialConditionsView = new InitialConditionsView({
      collection: this.model.initialConditions,
      readOnly: this.readOnly
    });
    let hook = "initial-conditions-view-container";
    app.registerRenderSubview(this, this.initialConditionsView, hook);
  },
  renderParametersView: function () {
    if(this.parametersView) {
      this.parametersView.remove();
    }
    this.parametersView = new ParametersView({
      collection: this.model.parameters,
      readOnly: this.readOnly
    });
    let hook = "parameters-view-container";
    app.registerRenderSubview(this, this.parametersView, hook);
  },
  renderReactionsView: function () {
    if(this.reactionsView) {
      this.reactionsView.remove();
    }
    this.reactionsView = new ReactionsView({
      collection: this.model.reactions,
      readOnly: this.readOnly
    });
    let hook = "reactions-view-container";
    app.registerRenderSubview(this, this.reactionsView, hook);
  },
  renderRulesView: function () {
    if(this.model.is_spatial) { return };
    if(this.rulesView) {
      this.rulesView.remove();
    }
    this.rulesView = new RulesView({
      collection: this.model.rules,
      readOnly: this.readOnly
    });
    let hook = "rules-view-container";
    app.registerRenderSubview(this, this.rulesView, hook);
  },
  renderSbmlComponentView: function () {
    if(this.model.is_spatial || !this.model.functionDefinitions.length) { return };
    if(this.sbmlComponentView) {
      this.sbmlComponentView.remove();
    }
    this.sbmlComponentView = new SBMLComponentsView({
      functionDefinitions: this.model.functionDefinitions,
      readOnly: this.readOnly
    });
    let hook = "sbml-components-view-container";
    app.registerRenderSubview(this, this.sbmlComponentView, hook);
  },
  renderSpeciesView: function () {
    if(this.speciesView) {
      this.speciesView.remove();
    }
    this.speciesView = new SpeciesView({
      collection: this.model.species,
      spatial: this.model.is_spatial,
      defaultMode: this.model.defaultMode,
      readOnly: this.readOnly
    });
    let hook = "species-view-container";
    app.registerRenderSubview(this, this.speciesView, hook);
  },
  renderSystemVolumeView: function () {
    if(this.systemVolumeView) {
      this.systemVolumeView.remove();
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
    app.registerRenderSubview(this, this.systemVolumeView, 'edit-volume');
    if(this.model.defaultMode === "continuous") {
      $(this.queryByHook("system-volume-container")).collapse("hide")
    }
    $(this.queryByHook("view-volume")).html("Volume:  " + this.model.volume)
  },
  setAllSpeciesModes: function (prevMode) {
    let self = this;
    this.model.species.forEach((specie) => {
      specie.mode = this.model.defaultMode;
      this.model.species.trigger('update-species', specie.compID, specie, false, true);
    });
    let switchToDynamic = (!Boolean(prevMode) || prevMode !== "dynamic") && this.model.defaultMode === "dynamic";
    let switchFromDynamic = Boolean(prevMode) && prevMode === "dynamic" && this.model.defaultMode !== "dynamic";
    if(switchToDynamic || switchFromDynamic) {
      this.speciesView.renderEditSpeciesView();
      this.speciesView.renderViewSpeciesView();
    }
  },
  setDefaultMode: function (e) {
    let prevMode = this.model.defaultMode;
    this.model.defaultMode = e.target.dataset.name;
    this.speciesView.defaultMode = e.target.dataset.name;
    this.setAllSpeciesModes(prevMode);
    this.toggleVolumeContainer();
  },
  setInitialDefaultMode: function (modal, mode) {
    var dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced'};
    modal.modal('hide');
    $(this.queryByHook(dataHooks[mode])).prop('checked', true);
    this.model.defaultMode = mode;
    this.speciesView.defaultMode = mode;
    this.setAllSpeciesModes();
    this.toggleVolumeContainer();
  },
  setReadOnlyMode: function (component) {
    $(this.queryByHook(component + '-edit-tab')).addClass("disabled");
    $(".nav .disabled>a").on("click", (e) => {
      e.preventDefault();
      return false;
    });
    $(this.queryByHook(component + '-view-tab')).tab('show');
    $(this.queryByHook('edit-' + component)).removeClass('active');
    $(this.queryByHook('view-' + component)).addClass('active');
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
  update: function () {},
  updateParametersInUse: function () {
    let parameters = this.model.parameters;
    let reactions = this.model.reactions;
    let events = this.model.eventsCollection;
    let rules = this.model.rules;
    parameters.forEach((param) => { param.inUse = false; });
    let updateInUse = (param) => {
      _.where(parameters.models, { compID: param.compID })
       .forEach((param) => {
         param.inUse = true;
       });
    }
    reactions.forEach((reaction) => {
      if(reaction.reactionType !== "custom-propensity"){
        updateInUse(reaction.rate);
      }
    });
    events.forEach((event) => {
      event.eventAssignments.forEach((assignment) => {
        updateInUse(assignment.variable);
      });
    });
    rules.forEach((rule) => {
      updateInUse(rule.variable);
    });
  },
  updateSpeciesInUse: function () {
    let species = this.model.species;
    let reactions = this.model.reactions;
    let events = this.model.eventsCollection;
    let rules = this.model.rules;
    species.forEach((specie) => { specie.inUse = false; });
    let updateInUseForReaction = (stoichSpecie) => {
      _.where(species.models, { compID: stoichSpecie.specie.compID })
       .forEach((specie) => {
          specie.inUse = true;
        });
    }
    let updateInUseForOther = (specie) => {
      _.where(species.models, { compID: specie.compID })
       .forEach((specie) => {
         specie.inUse = true;
       });
    }
    reactions.forEach((reaction) => {
      reaction.products.forEach(updateInUseForReaction);
      reaction.reactants.forEach(updateInUseForReaction);
    });
    events.forEach((event) => {
      event.eventAssignments.forEach((assignment) => {
        updateInUseForOther(assignment.variable);
      });
    });
    rules.forEach((rule) => {
      updateInUseForOther(rule.variable);
    });
  },
  updateValid: function () {},
  updateVolumeViewer: function (e) {
    $(this.queryByHook("view-volume")).html("Volume:  " + this.model.volume);
  }
});