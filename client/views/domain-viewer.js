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

var $ = require('jquery');
let path = require('path');
var _ = require('underscore');
//support files
var app = require('../app');
var Plotly = require('../lib/plotly');
var Tooltips = require('../tooltips');
//views
var View = require('ampersand-view');
var TypesViewer = require('./edit-domain-type');
var SelectView = require('ampersand-select-view');
var ParticleViewer = require('./view-particle');
//templates
var template = require('../templates/includes/domainViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=domain-edit-tab]' : 'toggleViewExternalDomainBtn',
    'click [data-hook=domain-view-tab]' : 'toggleViewExternalDomainBtn',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=edit-domain-btn]' : 'editDomain',
    'click [data-hook=create-domain]' : 'editDomain',
    'click [data-hook=save-to-model]' : 'saveDomainToModel',
    'click [data-hook=select-external-domain]' : 'handleLoadExternalDomain',
    'change [data-hook=select-domain]' : 'handleSelectDomain',
    'change [data-hook=select-location]' : 'handleSelectDomainLocation'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.domainEditor;
    this.domainPath = attrs.domainPath;
    let self = this;
    this.model.particles.forEach(function (particle) {
      self.model.types.get(particle.type, "typeID").numParticles += 1;
    });
    this.gravity = this.getGravityString()
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    let self = this;
    var queryStr = "?path=" + this.parent.model.directory
    if(this.readOnly) {
      $(this.queryByHook('domain-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('domain-view-tab')).tab('show');
      $(this.queryByHook('edit-domain')).removeClass('active');
      $(this.queryByHook('view-domain')).addClass('active');
      this.toggleViewExternalDomainBtn();
    }else {
      this.renderDomainSelectView();
      if(this.domainPath) {
        $(this.queryByHook("domain-container")).collapse("show")
        $(this.queryByHook("collapse")).text("-")
        if(this.domainPath !== "viewing") {
          $(this.queryByHook("save-to-model")).prop("disabled", false)
          $(this.queryByHook("external-domain-select")).css("display", "block")
          $(this.queryByHook("select-external-domain")).text("View Model's Domain")
          queryStr += "&domain_path=" + this.domainPath
        }
      }
      this.toggleDomainError();
    }
    this.renderTypesViewer();
    this.parent.parent.renderParticleViewer(null);
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-plot") + queryStr;
    app.getXHR(endpoint, {
      always: function (err, response, body) {
        self.plot = body.fig;
        self.displayDomain();
      }
    });
  },
  handleLoadExternalDomain: function (e) {
    let text = e.target.textContent
    if(text === "View External Domain") {
      $(this.queryByHook("external-domain-select")).css("display", "block")
      $(this.queryByHook("select-external-domain")).text("View Model's Domain")
    }else{
      this.reloadDomain("viewing");
    }
  },
  handleSelectDomain: function (e) {
    let value = e.srcElement.value;
    if(value) {
      if(this.externalDomains[value].length <= 1) {
        this.reloadDomain(this.externalDomains[value][0]);
      }else{
        $(this.queryByHook("select-location-message")).css('display', "block");
        $(this.queryByHook("select-domain-location")).css("display", "inline-block");
        this.renderDomainLocationSelectView(this.externalDomains[value]);
      }
    }
  },
  handleSelectDomainLocation: function (e) {
    this.reloadDomain(e.srcElement.value);
  },
  reloadDomain: function (domainPath) {
    if(this.domainPath !== domainPath || domainPath === "viewing") {
      var el = this.parent.parent.queryByHook("domain-plot-container");
      el.removeListener('plotly_click', this.selectParticle);
      Plotly.purge(el);
      this.plot = null;
      this.model.types.forEach(function (type) {
        type.numParticles = 0;
      });
      this.parent.renderDomainViewer(domainPath);
    }
  },
  getGravityString: function () {
    var gravity = "(X: " + this.model.gravity[0];
    gravity += ", Y: " + this.model.gravity[1];
    gravity += ", Z: " + this.model.gravity[2] + ")";
    return gravity;
  },
  renderDomainSelectView: function () {
    let self = this;
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-list");
    app.getXHR(endpoint, {
      always: function (err, response, body) {
        self.externalDomains = body.paths;
        var domainSelectView = new SelectView({
          label: '',
          name: 'domains',
          required: false,
          idAttributes: 'cid',
          options: body.files,
          unselectedText: "-- Select Domain --",
          value: self.getDomainSelectValue(body.files)
        });
        app.registerRenderSubview(self, domainSelectView, "select-domain")
      }
    });
  },
  getDomainSelectValue: function (files) {
    if(!this.domainPath || this.domainPath === "viewing") {
      return null;
    }
    let domainFile = this.domainPath.split('/').pop();
    let value = files.filter(function (file) {
      return file[1] === domainFile;
    })[0][0];
    return value
  },
  renderDomainLocationSelectView: function (options) {
    if(this.domainLocationSelectView) {
      this.domainLocationSelectView.remove();
    }
    this.domainLocationSelectView = new SelectView({
      label: '',
      name: 'locations',
      required: false,
      idAttributes: 'cid',
      options: options,
      unselectedText: "-- Select Location --"
    });
    app.registerRenderSubview(this, this.domainLocationSelectView, "select-location")
  },
  renderTypesViewer: function () {
    if(this.typesViewer) {
      this.typesViewer.remove()
    }
    this.typesViewer = this.renderCollection(
      this.model.types,
      TypesViewer,
      this.queryByHook("domain-types-list"),
      {filter: function (model) {
        return model.typeID != 0;
      }, viewOptions: {viewMode: true}}
    );
  },
  displayDomain: function () {
    let self = this;
    var domainPreview = this.parent.parent.queryByHook("domain-plot-container");
    Plotly.newPlot(domainPreview, this.plot);
    domainPreview.on('plotly_click', _.bind(this.selectParticle, this));
  },
  selectParticle: function (data) {
    let point = data.points[0];
    let particle = this.model.particles.get(point.id, "particle_id");
    this.parent.parent.renderParticleViewer(particle);
  },
  editDomain: function (e) {
    var queryStr = "?path=" + this.parent.model.directory;
    if(e.target.dataset.hook === "create-domain") {
      queryStr += "&new"
    }else if(this.domainPath) {
      queryStr += "&domainPath=" + this.domainPath
    }
    let endpoint = path.join(app.getBasePath(), "stochss/domain/edit") + queryStr;
    window.location.href = endpoint;
  },
  saveDomainToModel: function (e) {
    this.parent.model.domain = this.model;
    this.parent.modelStateButtons.clickSaveHandler(e);
    this.reloadDomain()
  },
  toggleDomainError: function () {
    let errorMsg = $(this.queryByHook('domain-error'))
    this.model.updateValid();
    if(!this.model.valid) {
      errorMsg.addClass('component-invalid')
      errorMsg.removeClass('component-valid')
    }else{
      errorMsg.addClass('component-valid')
      errorMsg.removeClass('component-invalid')
    }
  },
  toggleViewExternalDomainBtn: function (e) {
    if(e) {
      if(!e.target.classList.contains("active")) {
        let display = e.target.text === "View" ? "none" : "block";
        $(this.queryByHook("external-domains-container")).css("display", display);
      }
    }else{
      let display = this.readOnly ? "none" : "block";
      $(this.queryByHook("external-domains-container")).css("display", display);
    }
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  }
});