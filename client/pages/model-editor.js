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

// var _ = require('underscore');
let $ = require('jquery');
let path = require('path');
//support files
let app = require('../app');
let modals = require('../modals');
// let Tooltips = require("../tooltips");
//views
let PageView = require('../pages/base');
let ModelView = require('../model-view/model-view');
let ModelStateButtonsView = require('../views/model-state-buttons');
let TimespanSettingsView = require('../settings-view/views/timespan-settings-view');
//models
let Model = require('../models/model');
// var Domain = require('../models/domain');
//templates
let template = require('../templates/pages/modelEditor.pug');

import initPage from './page.js';

let ModelEditor = PageView.extend({
  template: template,
  events: {
    'click [data-hook=edit-model-help]': () => {
      let modal = $(modals.operationInfoModalHtml('model-editor')).modal();
    },
    'click [data-hook=project-breadcrumb-link]' : 'handleProjectBreadcrumbClick',
    'click [data-hook=toggle-preview-plot]' : 'togglePreviewPlot',
    'click [data-hook=toggle-preview-domain]' : 'toggleDomainPlot',
    'click [data-hook=download-png]' : 'clickDownloadPNGButton'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search);
    let directory = urlParams.get('path');
    let modelFile = directory.split('/').pop();
    this.model = new Model({
      name: this.getFileName(decodeURI(modelFile)),
      directory: directory,
      is_spatial: modelFile.split('.').pop().startsWith('s'),
      isPreview: true,
      for: "edit"
    });
    if(directory.includes('.proj')) {
      this.projectPath = path.dirname(directory);
      if(this.projectPath.endsWith(".wkgp")) {
        this.projectPath = path.dirname(this.projectPath);
      }
      this.projectName = this.getFileName(this.projectPath);
    }
    app.getXHR(this.model.url(), {
      success: (err, response, body) => {
        this.model.set(body);
        if(directory.includes('.proj')) {
          $(this.queryByHook("project-breadcrumb-links")).css("display", "block");
          $(this.queryByHook("model-name-header")).css("display", "none");
        }
        this.renderSubviews(urlParams.has('validate'));
        this.model.updateValid();
      }
    });
    window.addEventListener("pageshow", (event) => {
      let navType = window.performance.navigation.type;
      if(navType === 2){
        window.location.reload();
      }
    });
  },
  clickDownloadPNGButton: function (e) {
    $('div[data-hook=preview-plot-container] a[data-title*="Download plot as a png"]')[0].click();
  },
  closeDomainPlot: function () {
    $(this.queryByHook("domain-plot-viewer-container")).css("display", "none");
    $(this.queryByHook("toggle-preview-domain")).html("Show Domain");
  },
  closePlot: function () {
    $(this.queryByHook("model-run-container")).css("display", "none");
    $(this.queryByHook("toggle-preview-plot")).html("Show Preview");
  },
  getFileName: function (file) {
    if(file.endsWith('/')) {
      file.slice(0, -1);
    }
    if(file.includes('/')) {
      file = file.split('/').pop();
    }
    if(!file.includes('.')) {
      return file;
    }
    return file.split('.').slice(0, -1).join('.');
  },
  handleProjectBreadcrumbClick: function () {
    this.modelStateButtons.saveModel((e) => {
      let queryStr = `?path=${this.projectPath}`;
      let endpoint = path.join(app.getBasePath(), "stochss/project/manager") + queryStr;
      window.location.href = endpoint;
    });
  },
  openDomainPlot: function () {
    if($(this.queryByHook("model-run-container")).css("display") !== "none") {
      this.closePlot();
    }
    $(this.queryByHook("domain-plot-viewer-container")).css("display", "block");
    $(this.queryByHook("toggle-preview-domain")).html("Hide Domain");
  },
  openPlot: function () {
    if($(this.queryByHook("domain-plot-viewer-container")).css("display") !== "none") {
      this.closeDomainPlot();
    }
    $(this.queryByHook("model-run-container")).css("display", "block");
    $(this.queryByHook("toggle-preview-plot")).html("Hide Preview");
  },
  renderModelView: function () {
    let domainElements = {
      select: $(this.queryByHook("me-select-particle")),
      particle: {view: this, hook: "me-particle-viewer"},
      plot: this.queryByHook("domain-plot-container"),
      type: this.queryByHook("me-types-quick-view")
    }
    this.modelView = new ModelView({
      model: this.model,
      domainElements: domainElements
    });
    app.registerRenderSubview(this, this.modelView, "model-view-container");
  },
  renderSubviews: function (validate) {
    this.renderModelView();
    this.modelSettings = new TimespanSettingsView({
      parent: this,
      model: this.model.modelSettings
    });
    app.registerRenderSubview(this, this.modelSettings, 'model-settings-container');
    this.modelStateButtons = new ModelStateButtonsView({
      model: this.model,
      validate: validate
    });
    app.registerRenderSubview(this, this.modelStateButtons, 'model-state-buttons-container');
    if(this.model.is_spatial) {
      $(this.queryByHook("spatial-beta-message")).css("display", "block");
      $(this.queryByHook("toggle-preview-domain")).css("display", "inline-block");
      this.openDomainPlot();
    }
    this.model.autoSave();
    app.documentSetup();
  },
  toggleDomainPlot: function (e) {
    if(e.target.innerText === "Hide Domain") {
      this.closeDomainPlot();
    }else{
      this.openDomainPlot();
    }
  },
  togglePreviewPlot: function (e) {
    if(e.target.innerText === "Hide Preview") {
      this.closePlot();
    }else{
      this.openPlot();
    }
  }
});

initPage(ModelEditor);
