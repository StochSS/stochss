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
var tests = require('../views/tests');
var Plotly = require('../lib/plotly');
var Tooltips = require('../tooltips');
let modals = require('../modals');
//views
var PageView = require('../pages/base');
var InputView = require('../views/input');
var SelectView = require('ampersand-select-view');
var ParticleView = require('../views/edit-particle');
var EditDomainTypeView = require('../views/edit-domain-type');
var Create3DDomainView = require('../views/edit-3D-domain');
//collections
var Collection = require('ampersand-collection');
//models
var Model = require('../models/model');
var Domain = require('../models/domain');
var Particle = require('../models/particle');
var TypeModel = require('../models/domain-type');
//templates
var template = require('../templates/pages/domainEditor.pug');

import initPage from './page.js';

let DomainEditor = PageView.extend({
  template: template,
  events: {
    'click [data-toggle=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=add-domain-type]' : 'handleAddDomainType',
    'click [data-hook=set-type-defaults]' : 'handleSetDefaults',
    'click [data-hook=save-to-model]' : 'handleSaveToModel',
    'click [data-hook=save-to-file]' : 'handleSaveToFile',
    'click [data-hook=import-particles-btn]' : 'handleImportMesh',
    'click [data-hook=set-particle-types-btn]' : 'getTypesFromFile',
    'change [data-hook=static-domain]' : 'setStaticDomain',
    'change [data-hook=density]' : 'setDensity',
    'change [data-target=gravity]' : 'setGravity',
    'change [data-hook=pressure]' : 'setPressure',
    'change [data-hook=speed]' : 'setSpeed',
    'change [data-name=limitation]' : 'setLimitation',
    'change [data-target=reflect]' : 'setBoundaryCondition',
    'change #meshfile' : 'updateImportBtn',
    'change [data-hook=mesh-type-select]' : 'updateMeshTypeAndDefaults',
    'change [data-hook=types-file-select]' : 'handleSelectTypeFile',
    'change [data-hook=types-file-location-select]' : 'handleSelectTypeLocation'
  },
  handleAddDomainType: function () {
    this.selectedType = "new";
    this.renderEditTypeDefaults();
  },
  handleImportMesh: function (e) {
    this.startAction("Importing mesh ...", "im")
    let data = {"type":null, "transformation":null}
    let id = Number($(this.queryByHook("mesh-type-select")).find('select')[0].value)
    if(id > 0) {
      data.type = this.domain.types.get(id, "typeID").toJSON();
    }
    let xTrans = Number($(this.queryByHook("mesh-x-trans")).find('input')[0].value)
    let yTrans = Number($(this.queryByHook("mesh-y-trans")).find('input')[0].value)
    let zTrans = Number($(this.queryByHook("mesh-z-trans")).find('input')[0].value)
    if(xTrans !== 0 || yTrans !== 0 || zTrans !== 0) {
      data.transformation = [xTrans, yTrans, zTrans];
    }
    this.importMesh(data)
  },
  importMesh: function (data) {
    let self = this;
    let file = $("#meshfile").prop("files")[0];
    let typeFiles = $("#typefile").prop("files")
    let formData = new FormData();
    formData.append("datafile", file);
    formData.append("particleData", JSON.stringify(data));
    if(typeFiles.length) {
      formData.append("typefile", typeFiles[0]);
    }
    let endpoint = path.join(app.getApiPath(), 'spatial-model/import-mesh');
    app.postXHR(endpoint, formData, {
      success: function (err, response, body) {
        body = JSON.parse(body);
        if(body.types) {
          self.addMissingTypes(body.types)
        }
        self.addParticles(body.particles);
        if(self.domain.x_lim[0] > body.limits.x_lim[0]) {
          self.domain.x_lim[0] = body.limits.x_lim[0]
        }
        if(self.domain.y_lim[0] > body.limits.y_lim[0]) {
          self.domain.y_lim[0] = body.limits.y_lim[0]
        }
        if(self.domain.z_lim[0] > body.limits.z_lim[0]) {
          self.domain.z_lim[0] = body.limits.z_lim[0]
        }
        if(self.domain.x_lim[1] < body.limits.x_lim[1]) {
          self.domain.x_lim[1] = body.limits.x_lim[1]
        }
        if(self.domain.y_lim[1] < body.limits.y_lim[1]) {
          self.domain.y_lim[1] = body.limits.y_lim[1]
        }
        if(self.domain.z_lim[1] < body.limits.z_lim[1]) {
          self.domain.z_lim[1] = body.limits.z_lim[1]
        }
        self.renderDomainLimitations();
        self.completeAction("Mesh successfully imported", "im")
        $('html, body').animate({
            scrollTop: $("#domain-plot").offset().top
        }, 20);
      },
      error: function (err, response, body) {
        body = JSON.parse(body);
        self.errorAction(body.Message, "im")
      }
    }, false)
  },
  handleSetDefaults: function (e) {
    let mass = Number($(this.queryByHook("td-mass")).find('input')[0].value);
    let vol = Number($(this.queryByHook("td-vol")).find('input')[0].value);
    let nu = Number($(this.queryByHook("td-nu")).find('input')[0].value);
    let fixed = $(this.queryByHook("td-fixed")).prop("checked");
    if(this.selectedType === "new") {
      let name = this.domain.types.addType(vol, mass, nu, fixed)
      this.addType(name);
    }else{
      let type = this.domain.types.get(this.selectedType, "typeID")
      type.mass = mass;
      type.volume = vol;
      type.nu = nu;
      type.fixed = fixed;
    }
    this.renderDomainTypes();
    $(this.queryByHook("edit-defaults")).css("display", "none");
  },
  handleSaveToModel: function () {
    if(this.model) {
      this.startAction("Saving domain to model ...", "sd");
      this.model.domain = this.domain;
      this.model.saveModel(_.bind(function () {
        this.completeAction("Domain saved to model", "sd");
      }, this));
      window.location.replace(this.getBreadcrumbData().model.href);
    }
  },
  handleSaveToFile: function () {
    this.startAction("Saving the domain to file (.domn) ...", "sd")
    if(this.domain.directory && !this.domain.dirname) {
      this.saveDomain()
    }else{
      var self = this
      if(document.querySelector('#newDomainModal')) {
        document.querySelector('#newDomainModal').remove()
      }
      let modal = $(modals.createDomainHtml()).modal();
      let okBtn = document.querySelector('#newDomainModal .ok-model-btn');
      let input = document.querySelector('#newDomainModal #domainNameInput');
      input.addEventListener("keyup", function (event) {
        if(event.keyCode === 13){
          event.preventDefault();
          okBtn.click();
        }
      });
      input.addEventListener("input", function (e) {
        var endErrMsg = document.querySelector('#newDomainModal #domainNameInputEndCharError')
        var charErrMsg = document.querySelector('#newDomainModal #domainNameInputSpecCharError')
        let error = app.validateName(input.value)
        okBtn.disabled = error !== "" || input.value.trim() === ""
        charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
        endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
      });
      okBtn.addEventListener('click', function (e) {
        if (Boolean(input.value)) {
          modal.modal('hide')
          let name = input.value.trim()
          self.saveDomain(name);
        }
      });
    }
  },
  handleSelectTypeFile: function (e) {
    let value = e.srcElement.value;
    if(value) {
      if(this.typeDescriptions[value].length <= 1) {
        $(this.queryByHook("type-location-message")).css('display', "none");
        $(this.queryByHook("type-location-container")).css("display", "none");
        this.typeDescriptionsFile = this.typeDescriptions[value][0];
        var disabled = false;
      }else{
        $(this.queryByHook("type-location-message")).css('display', "block");
        $(this.queryByHook("type-location-container")).css("display", "inline-block");
        this.renderTypesLocationSelect(this.typeDescriptions[value]);
        var disabled = true;
      }
    }else{
      $(this.queryByHook("type-location-message")).css('display', "none");
      $(this.queryByHook("type-location-container")).css("display", "none");
      var disabled = true;
    }
    $(this.queryByHook("set-particle-types-btn")).prop("disabled", disabled);
  },
  handleSelectTypeLocation: function (e) {
    this.typeDescriptionsFile = e.srcElement.value;
    $(this.queryByHook("set-particle-types-btn")).prop("disabled", false);
  },
  updateImportBtn: function (e) {
    $(this.queryByHook("import-particles-btn")).prop("disabled", !Boolean(e.target.files.length))
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.domainEditor;
    var self = this;
    let urlParams = new URLSearchParams(window.location.search)
    let modelPath = urlParams.has("path") ? urlParams.get("path") : null;
    let domainPath = urlParams.has("domainPath") ? urlParams.get("domainPath") : null;
    let newDomain = urlParams.has("new") ? true : false;
    this.queryStr = modelPath ? "?path=" + modelPath : "?"
    if(newDomain) {
      if(modelPath) {
        this.queryStr += "&"
      }
      this.queryStr += "new=True"
    }else if(domainPath && domainPath !== "viewing") {
      if(modelPath) {
        this.queryStr += "&"
      }
      this.queryStr += "domain_path=" + domainPath
    }
    let endpoint = path.join(app.getApiPath(), "spatial-model/load-domain") + this.queryStr
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.domain = new Domain(body.domain);
        self.domain.directory = domainPath
        self.domain.dirname = newDomain && !modelPath ? domainPath : null
        self.model = self.buildModel(body.model, modelPath);
        self.actPart = {"part":null, "tn":0, "pn":0};
        self.renderSubviews();
      }
    });
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
  },
  addParticle: function (newPart, {fromImport=false, cb=null}={}) {
    this.domain.particles.addParticle(newPart.point, newPart.volume,
                                      newPart.mass, newPart.type,
                                      newPart.nu, newPart.fixed);
    let numPart = this.domain.particles.models.length
    let particle = this.domain.particles.models[numPart-1]
    this.plot.data[particle.type].ids.push(particle.particle_id);
    this.plot.data[particle.type].x.push(particle.point[0]);
    this.plot.data[particle.type].y.push(particle.point[1]);
    this.plot.data[particle.type].z.push(particle.point[2]);
    if(!fromImport) {
      this.renderDomainTypes();
      this.updatePlot();
    }
    if(cb) {
      cb();
    }
  },
  addParticles: function (particles) {
    let self = this;
    particles.forEach(function (particle) {
      self.addParticle(particle, {fromImport: true});
    });
    this.renderDomainTypes();
    this.updatePlot();
  },
  addMissingTypes: function (types) {
    let self = this;
    let defaultType = self.domain.types.get(0, "typeID");
    types.forEach(function (type) {
      let domainType = self.domain.types.get(type, "typeID");
      if(!domainType) {
        self.domain.types.addType(defaultType.volume, defaultType.mass,
                                  defaultType.nu, defaultType.fixed, type);
        self.addType(String(type));
      }
    });
  },
  addType: function (name) {
    this.renderEditParticle();
    this.renderNewParticle();
    var trace = {"ids":[], "x":[], "y":[], "z":[], "name":name};
    trace['marker'] = this.plot.data[0].marker;
    trace['mode'] = this.plot.data[0].mode;
    trace['type'] = this.plot.data[0].type;
    this.plot.data.push(trace)
    this.updatePlot()
  },
  buildModel: function (modelData, modelPath) {
    if(!modelPath) {
      return null;
    }
    var model = new Model(modelData);
    model.for = "domain";
    model.isPreview = false;
    model.directory = modelPath;
    return model;
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  changeParticleLocation: function (x, y, z) {
    this.domain.particles.get(this.actPart.part.particle_id, "particle_id").point = [x, y, z];
    this.plot.data[this.actPart.tn].x[this.actPart.pn] = x;
    this.plot.data[this.actPart.tn].y[this.actPart.pn] = y;
    this.plot.data[this.actPart.tn].z[this.actPart.pn] = z;
    this.actPart.part.pointChanged = false;
  },
  changeParticleTypes: function (types) {
    let self = this;
    types.forEach(function (type) {
      let particle = self.domain.particles.get(type.particle_id, "particle_id");
      self.actPart.part = particle;
      for(var i = 0; i < self.plot.data.length; i++) {
        let trace = self.plot.data[i];
        if(trace.ids.includes(String(type.particle_id))){
          self.actPart.tn = self.plot.data.indexOf(trace);
          self.actPart.pn = trace.ids.indexOf(String(type.particle_id));
          break;
        }
      };
      self.changeParticleType(type.typeID)
    });
    this.renderDomainTypes();
    this.updatePlot();
  },
  changeParticleType: function (type) {
    this.domain.particles.get(this.actPart.part.particle_id, "particle_id").type = type
    let id = this.plot.data[this.actPart.tn].ids.splice(this.actPart.pn, 1)[0];
    let x = this.plot.data[this.actPart.tn].x.splice(this.actPart.pn, 1)[0];
    let y = this.plot.data[this.actPart.tn].y.splice(this.actPart.pn, 1)[0];
    let z = this.plot.data[this.actPart.tn].z.splice(this.actPart.pn, 1)[0];
    this.plot.data[type].ids.push(id);
    this.plot.data[type].x.push(x);
    this.plot.data[type].y.push(y);
    this.plot.data[type].z.push(z);
    this.actPart.part.typeChanged = false;
  },
  completeAction: function (action, src) {
    $(this.queryByHook(src + "-in-progress")).css("display", "none");
    $(this.queryByHook(src + "-action-complete")).text(action);
    $(this.queryByHook(src + "-complete")).css("display", "inline-block");
    console.log(action)
    let self = this
    setTimeout(function () {
      $(self.queryByHook(src + "-complete")).css("display", "none");
    }, 5000);
  },
  deleteParticle: function () {
    this.domain.particles.removeParticle(this.actPart.part);
    this.plot.data[this.actPart.tn].ids.splice(this.actPart.pn, 1);
    this.plot.data[this.actPart.tn].x.splice(this.actPart.pn, 1);
    this.plot.data[this.actPart.tn].y.splice(this.actPart.pn, 1);
    this.plot.data[this.actPart.tn].z.splice(this.actPart.pn, 1);
    this.actPart.part = null;
    this.updatePlot();
    this.renderEditParticle();
    this.renderDomainTypes();
    $('html, body').animate({
        scrollTop: $("#domain-plot").offset().top
    }, 20);
  },
  deleteType: function (typeID) {
    if(this.actPart.part && this.actPart.part.type >= typeID) {
      this.actPart.part = null;
    }
    this.unassignAllParticles(typeID, false);
    let type = this.domain.types.get(typeID, "typeID");
    this.domain.types.removeType(type);
    this.renderEditParticle();
    this.renderNewParticle();
    this.plot.data.splice(typeID, 1);
    this.updatePlot();
  },
  deleteTypeAndParticles: function (typeID) {
    if(this.actPart.part && this.actPart.part.type >= typeID) {
      this.actPart.part = null;
    }
    let self = this;
    let particles = this.domain.particles.filter(function (particle) {
      return particle.type === typeID;
    });
    this.domain.particles.removeParticles(particles);
    let type = this.domain.types.get(typeID, "typeID");
    this.domain.types.removeType(type);
    this.renderEditParticle();
    this.renderNewParticle();
    this.plot.data.splice(typeID, 1);
    this.updatePlot();
  },
  displayDomain: function () {
    let self = this;
    var el = this.queryByHook("domain-plot");
    Plotly.newPlot(el, this.plot);
    el.on('plotly_click', _.bind(this.selectParticle, this));
  },
  errorAction: function (action, src) {
    $(this.queryByHook(src + "-in-progress")).css("display", "none");
    $(this.queryByHook(src + "-action-error")).text(action);
    $(this.queryByHook(src + "-error")).css("display", "block");
    console.log(action)
  },
  getBreadcrumbData: function () {
    var data = {"project":null, "model":null};
    var projEP = "stochss/project/manager?path="
    var mdlEP = "stochss/models/edit?path="
    if(this.model) {
      data.model = {"name":this.model.name, "href":mdlEP + this.model.directory};
      let dirname = path.dirname(this.model.directory);
      if(dirname.includes(".wkgp")) {
        dirname = path.dirname(dirname);
      }
      if(dirname.endsWith(".proj")) {
        let name = dirname.split("/").pop().split(".proj")[0];
        data.project = {"name":name, "href":projEP + dirname};
      }
      return data;
    }
    if(this.domain.directory.includes(".proj")) {
      let pathEls = this.domain.directory.split("/");
      let proj = pathEls.filter(function (val) {
        return val.endsWith(".proj");
      }).pop();
      let index = pathEls.indexOf(proj) + 1;
      let count = pathEls.length - index;
      pathEls.splice(index, count);
      let projPath = pathEls.join("/");
      data.project = {"name":proj.split(".proj")[0], "href":projEP + projPath};
    }
    return data
  },
  getNewParticle: function () {
    var particle = new Particle({
      point: [0, 0, 0],
      mass: 1.0,
      volume: 1.0,
      nu: 0.0,
      fixed: false,
      type: 0
    });
    return particle;
  },
  getTypesFromFile: function (typePath) {
    this.startAction("Setting types ...", "st")
    let self = this;
    let queryStr = "?path=" + this.typeDescriptionsFile;
    let endpoint = path.join(app.getApiPath(), "spatial-model/particle-types") + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.addMissingTypes(body.names);
        self.changeParticleTypes(body.types);
        self.completeAction("Types set", "st");
      },
      error: function (err, response, body) {
        self.errorAction(body.Message, "st");
        console.log(err);
      }
    });
  },
  renameType: function (index, newName) {
    this.domain.types.get(index, "typeID").name = newName;
    this.renderEditParticle();
    this.renderNewParticle();
    this.renderTypeSelectView();
    this.renderCreate3DDomain();
    this.plot.data[index].name = newName;
    this.updatePlot();
  },
  renderCreate3DDomain: function () {
    if(this.create3DDomainView) {
      this.create3DDomainView.remove()
    }
    this.create3DDomainView = new Create3DDomainView({
      parent: this,
      model: this.domain
    });
    app.registerRenderSubview(this, this.create3DDomainView, "add-3d-domain");
  },
  renderDomainLimitations: function () {
    if(this.xLimMinView) {
      this.xLimMinView.remove();
      this.yLimMinView.remove();
      this.zLimMinView.remove();
      this.xLimMaxView.remove();
      this.yLimMaxView.remove();
      this.zLimMaxView.remove();
    }
    this.xLimMinView = new InputView({parent: this, required: true,
                                     name: 'x-lim-min', valueType: 'number',
                                     value: this.domain.x_lim[0] || 0});
    app.registerRenderSubview(this, this.xLimMinView, "x_lim-min");
    this.yLimMinView = new InputView({parent: this, required: true,
                                     name: 'y-lim-min', valueType: 'number',
                                     value: this.domain.y_lim[0] || 0});
    app.registerRenderSubview(this, this.yLimMinView, "y_lim-min");
    this.zLimMinView = new InputView({parent: this, required: true,
                                     name: 'z-lim-min', valueType: 'number',
                                     value: this.domain.z_lim[0] || 0});
    app.registerRenderSubview(this, this.zLimMinView, "z_lim-min");
    this.xLimMaxView = new InputView({parent: this, required: true,
                                     name: 'x-lim-max', valueType: 'number',
                                     value: this.domain.x_lim[1] || 0});
    app.registerRenderSubview(this, this.xLimMaxView, "x_lim-max");
    this.yLimMaxView = new InputView({parent: this, required: true,
                                     name: 'y-lim-max', valueType: 'number',
                                     value: this.domain.y_lim[1] || 0});
    app.registerRenderSubview(this, this.yLimMaxView, "y_lim-max");
    this.zLimMaxView = new InputView({parent: this, required: true,
                                     name: 'z-lim-max', valueType: 'number',
                                     value: this.domain.z_lim[1] || 0});
    app.registerRenderSubview(this, this.zLimMaxView, "z_lim-max");
  },
  renderDomainProperties: function () {
    $(this.queryByHook("static-domain")).prop("checked", this.domain.static);
    let densityView = new InputView({parent: this, required: true,
                                     name: 'density', valueType: 'number',
                                     value: this.domain.rho_0 || 1});
    app.registerRenderSubview(this, densityView, "density");
    let gravityXView = new InputView({parent: this, required: true,
                                     name: 'gravity-x', valueType: 'number',
                                     value: this.domain.gravity[0], label: "X:  "});
    app.registerRenderSubview(this, gravityXView, "gravity-x");
    let gravityYView = new InputView({parent: this, required: true,
                                     name: 'gravity-y', valueType: 'number',
                                     value: this.domain.gravity[1], label: "Y:  "});
    app.registerRenderSubview(this, gravityYView, "gravity-y");
    let gravityZView = new InputView({parent: this, required: true,
                                     name: 'gravity-z', valueType: 'number',
                                     value: this.domain.gravity[2], label: "Z:  "});
    app.registerRenderSubview(this, gravityZView, "gravity-z");
    let pressureView = new InputView({parent: this, required: true,
                                      name: 'pressure', valueType: 'number',
                                      value: this.domain.p_0 || 0});
    app.registerRenderSubview(this, pressureView, "pressure");
    let speedView = new InputView({parent: this, required: true,
                                   name: 'speed', valueType: 'number', 
                                   value: this.domain.c_0 || 0});
    app.registerRenderSubview(this, speedView, "speed");
  },
  renderDomainTypes: function () {
    if(this.domainTypesView) {
      this.domainTypesView.remove();
      this.domain.types.forEach(function (type) {
        type.numParticles = 0;
      });
    }
    let self = this;
    this.domain.particles.forEach(function (particle) {
      self.domain.types.get(particle.type, "typeID").numParticles += 1;
    });
    let unaPart = "Number of Un-Assigned Particles: " + this.domain.types.get(0, "typeID").numParticles;
    $(this.queryByHook("unassigned-particles")).text(unaPart);
    this.domainTypesView = this.renderCollection(
      this.domain.types,
      EditDomainTypeView,
      this.queryByHook("domain-types-list"),
      {"filter": function (model) {
        return model.typeID != 0;
      }}
    );
    this.toggleDomainError()
  },
  renderEditTypeDefaults: function () {
    if(this.massView) {
      this.massView.remove();
    }
    if(this.volView) {
      this.volView.remove();
    }
    if(this.nuView) {
      this.nuView.remove();
    }
    var title = "Defaults for ";
    if(this.selectedType === "new"){
      var type = this.domain.types.get(0, "typeID")
      title += "New Type";
    }else{
      var type = this.domain.types.get(this.selectedType, "typeID")
      title += type.name
    }
    $(this.queryByHook("set-type-defaults-header")).text(title)
    this.massView = new InputView({parent: this, required: true,
                                  name: 'mass', valueType: 'number',
                                  value: type.mass});
    app.registerRenderSubview(this, this.massView, "td-mass");
    this.volView = new InputView({parent: this, required: true,
                                 name: 'volume', valueType: 'number',
                                 value: type.volume});
    app.registerRenderSubview(this, this.volView, "td-vol");
    this.nuView = new InputView({parent: this, required: true,
                                name: 'viscosity', valueType: 'number',
                                value: type.nu});
    app.registerRenderSubview(this, this.nuView, "td-nu");
    $(this.queryByHook("td-fixed")).prop("checked", type.fixed);
    $(this.queryByHook("edit-defaults")).css("display", "block");
  },
  renderEditParticle: function () {
    if(this.editParticleView) {
      this.editParticleView.remove();
    }
    if(this.actPart.part) {
      var particle = this.actPart.part;
    }else{
      var particle = this.getNewParticle();
    }
    this.editParticleView = new ParticleView({
      model: particle,
      newParticle: false,
    });
    app.registerRenderSubview(this, this.editParticleView, "edit-particle");
  },
  renderMeshTransformations: function () {
    let xtrans = new InputView({parent: this, required: true,
                                name: 'x-transformation', valueType: 'number',
                                value: 0});
    app.registerRenderSubview(this, xtrans, "mesh-x-trans");
    let ytrans = new InputView({parent: this, required: true,
                                name: 'y-transformation', valueType: 'number',
                                value: 0});
    app.registerRenderSubview(this, ytrans, "mesh-y-trans");
    let ztrans = new InputView({parent: this, required: true,
                                name: 'z-transformation', valueType: 'number',
                                value: 0});
    app.registerRenderSubview(this, ztrans, "mesh-z-trans");
  },
  renderMeshTypeDefaults: function (id) {
    let type = this.domain.types.get(id, "typeID")
    $(this.queryByHook("mesh-mass")).text(type.mass);
    $(this.queryByHook("mesh-volume")).text(type.volume);
    $(this.queryByHook("mesh-nu")).text(type.nu);
    $(this.queryByHook("mesh-fixed")).prop("checked", type.fixed);
  },
  renderNewParticle: function () {
    if(this.newParticleView) {
      this.newParticleView.remove();
    }
    var particle = this.getNewParticle();
    this.newParticleView = new ParticleView({
      model: particle,
      newParticle: true,
    });
    app.registerRenderSubview(this, this.newParticleView, "new-particle");
  },
  renderSubviews: function () {
    let breadData = this.getBreadcrumbData();
    if(breadData.model && breadData.project) {
      $(this.queryByHook("two-parent-breadcrumb-links")).css("display", "block");
      let projBC = $(this.queryByHook("grandparent-breadcrumb"));
      projBC.text(breadData.project.name);
      projBC.prop("href", breadData.project.href);
      $(this.queryByHook("return-to-project")).prop("href", breadData.project.href);
      let mdlBC = $(this.queryByHook("parent-two-breadcrumb"));
      mdlBC.text(breadData.model.name);
      mdlBC.prop("href", breadData.model.href);
      $(this.queryByHook("return-to-model")).prop("href", breadData.model.href);
    }else if(breadData.model || breadData.project) {
      $(this.queryByHook("one-parent-breadcrumb-links")).css("display", "block");
      let breadcrumb = $(this.queryByHook("parent-one-breadcrumb"));
      if(breadData.project) {
        breadcrumb.text(breadData.project.name)
        breadcrumb.prop("href", breadData.project.href);
        $(this.queryByHook("return-to-project")).prop("href", breadData.project.href);
        $(this.queryByHook("return-to-model")).css("display", "none");
      }else {
        breadcrumb.text(breadData.model.name)
        breadcrumb.prop("href", breadData.model.href);
        $(this.queryByHook("return-to-project")).css("display", "none");
        $(this.queryByHook("return-to-model")).prop("href", breadData.model.href);
      }
    }else{
      $(this.queryByHook("return-to-model")).css("display", "none");
      $(this.queryByHook("return-to-project")).css("display", "none");
    }
    this.renderDomainProperties();
    this.renderDomainLimitations();
    $(this.queryByHook("reflect_x")).prop("checked", this.domain.boundary_condition.reflect_x);
    $(this.queryByHook("reflect_y")).prop("checked", this.domain.boundary_condition.reflect_y);
    $(this.queryByHook("reflect_z")).prop("checked", this.domain.boundary_condition.reflect_z);
    this.renderDomainTypes();
    this.renderNewParticle();
    this.renderEditParticle();
    this.renderTypeSelectView();
    this.renderMeshTypeDefaults(0);
    this.renderMeshTransformations();
    this.renderTypesFileSelect();
    this.renderCreate3DDomain();
    let self = this;
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-plot") + this.queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.plot = body.fig;
        self.displayDomain();
      }
    });
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
    this.domain.updateValid();
    this.toggleDomainError();
    if(!this.model) {
      $(this.queryByHook("save-to-model")).addClass("disabled")
    }
  },
  renderTypesFileSelect: function () {
    let self = this;
    let endpoint = path.join(app.getApiPath(), "spatial-model/types-list");
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.typeDescriptions = body.paths;
        var typesSelectView = new SelectView({
          label: '',
          name: 'type-files',
          required: false,
          idAttributes: 'cid',
          options: body.files,
          unselectedText: "-- Select Type File --",
        });
        app.registerRenderSubview(self, typesSelectView, "types-file-select");
      }
    });
  },
  renderTypesLocationSelect: function (options) {
    if(this.typesLocationSelectView) {
      this.typesLocationSelectView.remove();
    }
    this.typesLocationSelectView = new SelectView({
      label: '',
      name: 'type-locations',
      required: false,
      idAttributes: 'cid',
      options: options,
      unselectedText: "-- Select Location --"
    });
    app.registerRenderSubview(this, this.typesLocationSelectView, "types-file-location-select")
  },
  renderTypeSelectView: function () {
    if(this.typeView) {
      this.typeView.remove()
    }
    this.typeView = new SelectView({
      label: 'Type:  ',
      name: 'type',
      required: true,
      idAttribute: 'typeID',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.domain.types,
      value: this.domain.types.get(0, "typeID")
    });
    app.registerRenderSubview(this, this.typeView, "mesh-type-select")
  },
  saveDomain: function (name=null) {
    let domain = this.domain.toJSON();
    if(name) {
      let file = name + ".domn";
      var dirname = this.model ? path.dirname(this.model.directory) : this.domain.dirname;
      var domainPath = dirname === "/" ? file : path.join(dirname, file);
    }else{
      var domainPath = this.domain.directory;
    }
    let self = this;
    let endpoint = path.join(app.getApiPath(), "file/json-data") + "?path=" + domainPath;
    app.postXHR(endpoint, domain, {
      success: function (err, response, body) {
        self.completeAction("Domain save to file (.domn)", "sd");
      },
      error: function (err, response, body) {
        self.errorAction(body.Message, "sd");
        console.log(body.message);
      }
    });
  },
  selectParticle: function (data) {
    let point = data.points[0];
    this.actPart.part = this.domain.particles.get(point.id, "particle_id");
    this.actPart.tn = point.curveNumber;
    this.actPart.pn = point.pointNumber;
    this.renderEditParticle();
  },
  setBoundaryCondition: function (e) {
    let key = e.target.dataset.hook;
    let value = e.target.checked;
    this.domain.boundary_condition[key] = value;
  },
  setLimitation: function (e) {
    let data = e.target.parentElement.parentElement.dataset.hook.split('-');
    let index = data[1] === "min" ? 0 : 1;
    let value = Number(e.target.value.trim())
    this.domain[data[0]][index] = value;
  },
  setDensity: function (e) {
    let value = Number(e.target.value)
    this.domain.rho_0 = value;
  },
  setGravity: function (e) {
    let value = Number(e.target.value)
    let hook = e.target.parentElement.parentElement.dataset.hook;
    if(hook.endsWith("x")){
      this.domain.gravity[0] = value;
    }else if(hook.endsWith("y")) {
      this.domain.gravity[1] = value;
    }else {
      this.domain.gravity[2] = value;
    }
  },
  setPressure: function (e) {
    let value = Number(e.target.value)
    this.domain.p_0 = value;
  },
  setSpeed: function (e) {
    let value = Number(e.target.value)
    this.domain.c_0 = value;
  },
  setStaticDomain: function (e) {
    let value = e.target.checked;
    this.domain.statis = value;
  },
  startAction: function (action, src) {
    $(this.queryByHook(src + "-complete")).css("display", "none");
    $(this.queryByHook(src + "-action-in-progress")).text(action);
    $(this.queryByHook(src + "-in-progress")).css("display", "inline-block");
    console.log(action)
  },
  unassignAllParticles: function (type, update=true) {
    let self = this;
    this.domain.particles.forEach(function (particle) {
      if(particle.type === type) {
        self.actPart.part = particle;
        self.actPart.tn = type;
        self.actPart.pn = self.plot.data[type].ids.indexOf(particle.particle_id)
        self.changeParticleType(0);
      }
    });
    if(this.actPart.part && this.actPart.part.type == type) {
      this.actPart.part = null;
      this.renderEditParticle();
    }
    if(update) {
      this.updatePlot();
    }
  },
  updatePlot: function () {
    var el = this.queryByHook("domain-plot");
    el.removeListener('plotly_click', this.selectParticle);
    Plotly.purge(el);
    this.displayDomain();
  },
  update: function () {},
  updateMeshTypeAndDefaults: function (e) {
    let id = Number(e.target.selectedOptions.item(0).value);
    this.renderMeshTypeDefaults(id);
  },
  updateParticle: function ({cb=null}={}) {
    if(this.actPart.part.pointChanged) {
      let x = this.actPart.part.point[0];
      let y = this.actPart.part.point[1];
      let z = this.actPart.part.point[2];
      this.changeParticleLocation(x, y, z)
    }
    if(this.actPart.part.typeChanged) {
      let type = this.actPart.part.type
      this.changeParticleType(type);
      this.renderDomainTypes();
    }
    this.updatePlot();
    if(cb) {
      cb()
    }
  },
  updateValid: function () {},
  toggleDomainError: function () {
    let errorMsg = $(this.queryByHook('domain-error'))
    if(!this.domain.valid) {
      errorMsg.addClass('component-invalid')
      errorMsg.removeClass('component-valid')
    }else{
      errorMsg.addClass('component-valid')
      errorMsg.removeClass('component-invalid')
    }
  },
});

initPage(DomainEditor);
