/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
//support files
let app = require('../../app');
//models
let Domain = require('../../models/domain');
//views
let View = require('ampersand-view');
let SelectView = require('ampersand-select-view');
let DomainView = require('../../domain-view/domain-view');
//templates
let template = require('../templates/domainViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=select-domain]' : 'handleSelectDomain',
    'change [data-hook=select-location]' : 'handleSelectLocation',
    'click [data-hook=domain-edit-tab]' : 'handleModeSwitch',
    'click [data-hook=domain-view-tab]' : 'handleModeSwitch',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-domain-preview-btn]' : 'changeCollapseButtonText',
    'click [data-hook=select-external-domain]' : 'handleViewExternalDomains',
    'click [data-hook=edit-domain-btn]' : 'editDomain',
    'click [data-hook=create-domain]' : 'editDomain',
    'click [data-hook=save-to-model]' : 'saveDomainToModel'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.elements = attrs.domainElements ? attrs.domainElements : null;
    this.plot = attrs.domainPlot ? attrs.domainPlot : null;
    this.domainPath = null;
    this.domain = null;
    this.files = null;
    this.locations = null;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('domain-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", (e) => {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('domain-view-tab')).tab('show');
      $(this.queryByHook('edit-domain')).removeClass('active');
      $(this.queryByHook('view-domain')).addClass('active');
      this.toggleViewExternalDomains(this.readOnly);
    }
    if(!this.elements) {
      $(this.queryByHook("view-domain-plot-container")).css('display', 'block');
      this.elements = {
        select: $(this.queryByHook("domain-select-particle")),
        particle: {view: this, hook: "domain-particle-viewer"},
        figure: this.queryByHook("view-domain-plot"),
        // figureEmpty: this.queryByHook("domain-plot-container-empty"),
        type: this.queryByHook("domain-types-quick-view")
      }
    }
    this.renderDomainView();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  editDomain: function (e) {
    var queryStr = `?path=${this.model.directory}`;
    if(e.target.dataset.hook === "create-domain") {
      queryStr += "&new"
    }else if(this.domainPath) {
      queryStr += `&domainPath=${this.domainPath}`;
    }
    let endpoint = path.join(app.getBasePath(), "stochss/domain-editor") + queryStr;
    window.location.href = endpoint;
  },
  handleModeSwitch: function (e) {
    if(!e.target.classList.contains('active')) {
      this.toggleViewExternalDomains(e.target.text === "View");
    }
  },
  handleSelectDomain: function (e) {
    let value = e.srcElement.value;
    if(value) {
      if(this.locations[value].length <= 1) {
        $(this.queryByHook('select-location-message')).css('display', 'none');
        $(this.queryByHook('select-domain-location')).css('display', 'none');
        this.domainPath = this.locations[value][0];
        this.loadExternalDomainModel();
      }else{
        this.renderDomainLocationSelectView(this.locations[value]);
      }
    }
  },
  handleSelectLocation: function (e) {
    this.domainPath = e.srcElement.value;
    this.loadExternalDomainModel();
  },
  handleViewExternalDomains: function (e) {
    let display = e.target.textContent === "View External Domain";
    if(display) {
      $(this.queryByHook('select-external-domain')).text("View Model's Domain");
      if(!this.files) {
        this.loadExternalDomainFiles();
      }else{
        this.renderDomainFileSelectView();
      }
    }else{
      $(this.queryByHook('select-external-domain')).text("View External Domain");
      this.domain = null;
      this.domainPath = null;
      $(this.queryByHook('select-location-message')).css('display', 'none');
      $(this.queryByHook('select-domain-location')).css('display', 'none');
      $(this.queryByHook('domain-interact-section')).css('display', 'none');
      $(this.queryByHook('save-to-model')).prop('disabled', true);
      this.renderDomainView();
    }
  },
  loadExternalDomainFiles: function () {
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-list");
    app.getXHR(endpoint, {
      always: (err, response, body) => {
        this.files = body.files;
        this.locations = body.paths;
        this.renderDomainFileSelectView();
      }
    });
  },
  loadExternalDomainModel: function () {
    let queryStr = `?path=${this.model.directory}&domain_path=${this.domainPath}`;
    let endpoint = path.join(app.getApiPath(), "spatial-model/load-domain") + queryStr;
    app.getXHR(endpoint, {
      always: (err, response, body) => {
        console.log(body)
        this.domain = new Domain(body.domain);
        this.renderDomainView({modelsDomain: false});
        $(this.queryByHook('save-to-model')).prop('disabled', false);
      }
    });
  },
  openSection: function () {
    if(!$(this.queryByHook("domain-container")).hasClass("show")) {
      let domainCollapseBtn = $(this.queryByHook("collapse"));
      domainCollapseBtn.click();
      domainCollapseBtn.html('-');
    }
    app.switchToEditTab(this, "domain");
    this.domainView.displayError();
  },
  renderDomainFileSelectView: function () {
    if(this.domainFileSelectView) {
      this.domainFileSelectView.remove();
    }
    this.domainFileSelectView = new SelectView({
      name: 'domain-files',
      required: false,
      idAttributes: 'cid',
      options: this.files,
      unselectedText: '-- Select Domain --'
    });
    app.registerRenderSubview(this, this.domainFileSelectView, 'select-domain');
    $(this.queryByHook('domain-interact-section')).css('display', 'block');
  },
  renderDomainLocationSelectView: function (options) {
    if(this.domainLocationSelectView) {
      this.domainLocationSelectView.remove();
    }
    this.domainLocationSelectView = new SelectView({
      name: 'file-locations',
      required: false,
      idAttributes: 'cid',
      options: options,
      unselectedText: "-- Select Location --"
    });
    app.registerRenderSubview(this, this.domainLocationSelectView, "select-location");
    $(this.queryByHook('select-location-message')).css('display', 'block');
    $(this.queryByHook('select-domain-location')).css('display', 'inline-block');
  },
  renderDomainView: function ({modelsDomain=true}={}) {
    if(this.domainView) {
      this.domainView.remove();
    }
    let domain = modelsDomain ? this.model.domain : this.domain;
    var queryStr = `?path=${this.model.directory}`;
    if(!modelsDomain) {
      queryStr += `&domain_path=${this.domainPath}`;
    }
    this.domainView = new DomainView({
      model: domain,
      readOnly: true,
      elements: this.elements,
      plot: this.plot,
      queryStr: queryStr
    });
    app.registerRenderSubview(this, this.domainView, "domain-view-container");
  },
  saveDomainToModel: function (e) {
    this.model.domain = this.domain;
    this.parent.parent.clickSaveHandler(e);
    this.renderDomainView();
  },
  toggleViewExternalDomains: function (hide) {
    let display = hide ? "none" : "block";
    $(this.queryByHook('external-domains-container')).css('display', display);
  },
});