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
let ModelView = require('../views/model-view');
var InputView = require('../views/input');
var ParticleViewer = require('../views/view-particle');
var EventsEditorView = require('../views/events-editor');
var RulesEditorView = require('../views/rules-editor');
var SBMLComponentView = require('../views/sbml-component-editor');
var TimespanSettingsView = require('../views/timespan-settings');
var ModelStateButtonsView = require('../views/model-state-buttons');
var QuickviewDomainTypes = require('../views/quickview-domain-types');
let BoundaryConditionsView = require('../views/boundary-conditions-editor');
//models
var Model = require('../models/model');
var Domain = require('../models/domain');
//templates
var template = require('../templates/pages/modelEditor.pug');

import initPage from './page.js';

let ModelEditor = PageView.extend({
  template: template,
  events: {
    'click [data-hook=edit-model-help]' : function () {
      let modal = $(modals.operationInfoModalHtml('model-editor')).modal();
    },
    'change [data-hook=edit-volume]' : 'updateVolumeViewer',
    'click [data-hook=project-breadcrumb-link]' : 'handleProjectBreadcrumbClick',
    'click [data-hook=toggle-preview-plot]' : 'togglePreviewPlot',
    'click [data-hook=toggle-preview-domain]' : 'toggleDomainPlot',
    'click [data-hook=download-png]' : 'clickDownloadPNGButton',
    'click [data-hook=collapse-system-volume]' : 'changeCollapseButtonText'
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
      if(this.projectPath.endsWith(".wkgp")) {
        this.projectPath = path.dirname(this.projectPath)
      }
      this.projectName = this.getFileName(this.projectPath)
    }
    app.getXHR(this.model.url(), {
      success: function (err, response, body) {
        self.model.set(body)
        self.modelLoaded = true
        if(directory.includes('.proj')) {
          self.queryByHook("project-breadcrumb-links").style.display = "block"
          self.queryByHook("model-name-header").style.display = "none"
        }
        self.renderSubviews();
        self.model.updateValid()
      }
    })
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
        this.modelView.domainViewer.model.types,
        QuickviewDomainTypes,
        this.queryByHook("me-types-quick-view")
      );
    }
  },
  renderModelView: function () {
    this.modelView = new ModelView({
      model: this.model
    });
    app.registerRenderSubview(this, this.modelView, "model-view-container")
  },
  renderSubviews: function () {
    this.renderModelView()
    this.modelSettings = new TimespanSettingsView({
      parent: this,
      model: this.model.modelSettings,
    });
    this.modelStateButtons = new ModelStateButtonsView({
      model: this.model
    });
    app.registerRenderSubview(this, this.modelSettings, 'model-settings-container');
    app.registerRenderSubview(this, this.modelStateButtons, 'model-state-buttons-container');
    if(this.model.is_spatial) {
      $(this.queryByHook("system-volume-container")).css("display", "none");
      $(this.queryByHook("spatial-beta-message")).css("display", "block");
      this.renderBoundaryConditionsView();
      $(this.queryByHook("toggle-preview-domain")).css("display", "inline-block");
      this.openDomainPlot();
    }else {
      this.renderEventsView();
      this.renderRulesView();
      if(this.model.functionDefinitions.length) {
        var sbmlComponentView = new SBMLComponentView({
          functionDefinitions: this.model.functionDefinitions
        });
        app.registerRenderSubview(this, sbmlComponentView, 'sbml-component-container');
      }
      this.renderSystemVolumeView();
    }
    this.model.autoSave();
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");
       });
    });
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
    });
  },
  renderBoundaryConditionsView: function() {
    if(this.boundaryConditionsView) {
      this.boundaryConditionsView.remove();
    }
    this.boundaryConditionsView = new BoundaryConditionsView({
      collection: this.model.boundaryConditions
    });
    app.registerRenderSubview(this, this.boundaryConditionsView, "boundary-conditions-container");
  },
  renderEventsView: function () {
    if(this.eventsEditor){
      this.eventsEditor.remove();
    }
    this.eventsEditor = new EventsEditorView({collection: this.model.eventsCollection});
    app.registerRenderSubview(this, this.eventsEditor, 'events-editor-container');
  },
  renderRulesView: function () {
    if(this.rulesEditor){
      this.rulesEditor.remove();
    }
    this.rulesEditor = new RulesEditorView({collection: this.model.rules});
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
