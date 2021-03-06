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

var xhr = require('xhr');
var $ = require('jquery');
let path = require('path');
var _ = require('underscore');
//support files
var app = require('../app');
var Plotly = require('../lib/plotly');
var Tooltips = require('../tooltips');
//views
var View = require('ampersand-view');
var TypesViewer = require('./view-domain-types');
var SelectView = require('ampersand-select-view');
var ParticleViewer = require('./view-particle');
//templates
var template = require('../templates/includes/domainViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=edit-domain]' : 'editDomain',
    'click [data-hook=create-domain]' : 'editDomain',
    'click [data-hook=save-to-model]' : 'saveDomainToModel',
    'click [data-hook=select-external-domain]' : 'handleLoadExternalDomain',
    'change [data-hook=select-domain]' : 'handleSelectDomain',
    'change [data-hook=select-location]' : 'handleSelectDomainLocation'
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
      var el = this.parent.queryByHook("domain-plot-container");
      el.removeListener('plotly_click', this.selectParticle);
      Plotly.purge(el);
      this.plot = null;
      this.model.types.forEach(function (type) {
        type.numParticles = 0;
      });
      this.parent.renderDomainViewer(domainPath);
    }
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.domainEditor;
    this.domainPath = attrs.domainPath;
    let self = this;
    this.model.particles.forEach(function (particle) {
      self.model.types.get(particle.type, "typeID").numParticles += 1;
    });
    this.gravity = this.getGravityString()
  },
  getGravityString: function () {
    var gravity = "(X: " + this.model.gravity[0];
    gravity += ", Y: " + this.model.gravity[1];
    gravity += ", Z: " + this.model.gravity[2] + ")";
    return gravity;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderDomainSelectView();
    this.renderTypesViewer();
    let self = this;
    var queryStr = "?path=" + this.parent.model.directory
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
    this.parent.renderParticleViewer(null);
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-plot") + queryStr;
    xhr({uri: endpoint, json: true}, function (err, resp, body) {
      self.plot = body.fig;
      self.displayDomain();
    });
    this.toggleDomainError();
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  renderDomainSelectView: function () {
    let self = this;
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-list");
    xhr({uri: endpoint, json:true}, function (err, resp, body) {
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
      self.registerRenderSubview(domainSelectView, "select-domain")
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
    this.registerRenderSubview(this.domainLocationSelectView, "select-location")
  },
  renderTypesViewer: function () {
    if(this.typesViewer) {
      this.typesViewer.remove()
    }
    this.typesViewer = this.renderCollection(
      this.model.types,
      TypesViewer,
      this.queryByHook("domain-types-list"),
      {"filter": function (model) {
        return model.typeID != 0;
      }}
    );
  },
  displayDomain: function () {
    let self = this;
    var domainPreview = this.parent.queryByHook("domain-plot-container");
    Plotly.newPlot(domainPreview, this.plot);
    domainPreview.on('plotly_click', _.bind(this.selectParticle, this));
  },
  selectParticle: function (data) {
    let point = data.points[0];
    let particle = this.model.particles.get(point.id, "particle_id");
    this.parent.renderParticleViewer(particle);
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
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
  }
});