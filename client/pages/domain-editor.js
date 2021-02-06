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
var tests = require('../views/tests');
var Plotly = require('../lib/plotly');
var Tooltips = require('../tooltips');
//views
var PageView = require('../pages/base');
var InputView = require('../views/input');
//models
var Model = require('../models/model');
var Domain = require('../models/domain');
//templates
var template = require('../templates/pages/domainEditor.pug');

import initPage from './page.js';

let DomainEditor = PageView.extend({
  template: template,
  events: {
    'click [data-toggle=collapse]' : 'changeCollapseButtonText',
    'click [data-hook=unassign-all]' : 'handleUnassignParticles',
    'click [data-hook=delete-type]' : 'handleDeleteType',
    'click [data-hook=delete-all]' : 'handleDeleteTypeAndParticle',
    'click [data-hook=add-domain-type]' : 'handleAddDomainType',
    'change [data-name=limitation]' : 'setLimitation',
    'change [data-target=reflect]' : 'setBoundaryCondition',
    'change [data-target=type-name]' : 'handleRenameType'
  },
  handleDeleteType: function (e) {
    let type = Number(e.target.dataset.type);
    this.deleteType(type);
    this.renderDomainTypes();
  },
  handleDeleteTypeAndParticle: function (e) {
    let type = Number(e.target.dataset.type);
    this.deleteTypeAndParticles(type);
    this.renderDomainTypes();
  },
  handleRenameType: function (e) {
    let dataset = e.target.parentElement.parentElement.dataset;
    let type = Number(dataset.hook.split('-').pop());
    let name = e.target.value;
    this.renameType(type, name);
  },
  handleUnassignParticles: function (e) {
    let type = Number(e.target.dataset.type);
    this.unassignAllParticles(type);
    this.renderDomainTypes();
  },
  handleAddDomainType: function () {
    let name = String(this.domain.type_names.length)
    this.addType(name);
    this.renderDomainTypes();
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.domainEditor;
    var self = this;
    let urlParams = new URLSearchParams(window.location.search)
    let modelPath = urlParams.get("path")
    let newDomain = urlParams.has("new") ? true : false;
    this.queryStr = "?path=" + modelPath
    if(newDomain) {
      this.queryStr += "&new=True"
    }else if(urlParams.has("domainPath")) {
      this.queryStr += "&domain_path=" + urlParams.get("domainPath")
    }
    let endpoint = path.join(app.getApiPath(), "spatial-model/load-domain") + this.queryStr
    xhr({uri: endpoint, json: true}, function (err, resp, body) {
      self.domain = new Domain(body.domain);
      self.model = self.buildModel(body.model, modelPath);
      self.actPart = {"part":null, "tn":0, "pn":0};
      self.renderSubviews();
    });
  },
  addPraticle: function (newPart) {
    this.domain.particles.addParticle(newPart.point, newPart.vol,
                                      newPart.mass, newPart.type,
                                      newPart.nu, newPart.fixed);
    let numPart = this.domain.particles.models.length
    let particle = this.domain.particles.models[numPart-1]
    this.plot.data[particle.type].ids.push(particle.particle_id);
    this.plot.data[particle.type].x.push(particle.point[0]);
    this.plot.data[particle.type].y.push(particle.point[1]);
    this.plot.data[particle.type].z.push(particle.point[2]);
    this.updatePlot()
  },
  addType: function (name) {
    this.domain.type_names.push(name);
    var trace = {"ids":[], "x":[], "y":[], "z":[], "name":name};
    trace['marker'] = this.plot.data[0].marker;
    trace['mode'] = this.plot.data[0].mode;
    trace['type'] = this.plot.data[0].type;
    this.plot.data.push(trace)
    this.updatePlot()
  },
  buildModel: function (modelData, modelPath) {
    var model = new Model(modelData);
    model.for = "domain";
    model.isPreview = false;
    model.directory = modelPath;
    return model;
  },
  buildTypeElement: function (counts, index) {
    let rowStart = "<tr>";
    let rowEnd = "</tr>";
    let name = "<td><div data-target='type-name' data-hook='type-" + index + "'></div></td>";
    let count = "<td>" + counts[index] + "</td>";
    let btnStart = "<td><button class='btn btn-outline-secondary box-shadow' data-type=" + index + " data-hook='";
    let unAssgn = btnStart + "unassign-all'>Un-Assign Particles</button></td>";
    let del = btnStart + "delete-type'>Type</button></td>";
    let delAll = btnStart + "delete-all'>Type and Particles</button></td>";
    var type = [rowStart, name, count, unAssgn, del, delAll, rowEnd];
    return type.join("\n");
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
  changeParticleLocation: function (x, y, z) {
    this.domain.particles.models[this.actPart.part.particle_id - 1].point = [x, y, z];
    this.plot.data[this.actPart.tn].x[this.actPart.pn] = x;
    this.plot.data[this.actPart.tn].y[this.actPart.pn] = y;
    this.plot.data[this.actPart.tn].z[this.actPart.pn] = z;
    this.actPart.part.pointChanged = false;
  },
  changeParticleType: function (type) {
    this.domain.particles.models[this.actPart.part.particle_id - 1].type = type
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
  decrementParticleType: function (type) {
    this.domain.particles.forEach(function (particle) {
      if(particle.type > type) {
        particle.type -= 1;
      }
    });
  },
  deleteParticle: function () {
    this.domain.particles.removeParticle(this.actPart.part);
    this.plot.data[this.actPart.tn].ids.splice(this.actPart.pn, 1);
    this.plot.data[this.actPart.tn].x.splice(this.actPart.pn, 1);
    this.plot.data[this.actPart.tn].y.splice(this.actPart.pn, 1);
    this.plot.data[this.actPart.tn].z.splice(this.actPart.pn, 1);
    this.actPart.part = null;
    this.updatePlot();
  },
  deleteType: function (type) {
    this.unassignAllParticles(type, false);
    this.decrementParticleType(type);
    this.domain.type_names.splice(type, 1);
    this.plot.data.splice(type, 1);
    this.updatePlot();
  },
  deleteTypeAndParticles: function (type) {
    let self = this;
    let particles = this.domain.particles.filter(function (particle) {
      return particle.type === type;
    });
    this.domain.particles.removeParticles(particles);
    this.decrementParticleType(type);
    this.domain.type_names.splice(type, 1);
    this.plot.data.splice(type, 1);
    this.updatePlot();
  },
  displayDomain: function () {
    let self = this;
    var el = this.queryByHook("domain-plot");
    Plotly.newPlot(el, this.plot);
    el.on('plotly_click', _.bind(this.selectParticle, this));
  },
  renameType: function (index, newName) {
    this.domain.type_names[index] = newName;
    this.plot.data[index].name = newName;
    this.updatePlot();
  },
  renderDomainLimitations: function () {
    let xLimMinView = new InputView({parent: this, required: true,
                                     name: 'x-lim-min', valueType: 'number',
                                     value: this.domain.x_lim[0] || 0});
    this.registerRenderSubview(xLimMinView, "x_lim-min");
    let yLimMinView = new InputView({parent: this, required: true,
                                     name: 'y-lim-min', valueType: 'number',
                                     value: this.domain.y_lim[0] || 0});
    this.registerRenderSubview(yLimMinView, "y_lim-min");
    let zLimMinView = new InputView({parent: this, required: true,
                                     name: 'z-lim-min', valueType: 'number',
                                     value: this.domain.z_lim[0] || 0});
    this.registerRenderSubview(zLimMinView, "z_lim-min");
    let xLimMaxView = new InputView({parent: this, required: true,
                                     name: 'x-lim-max', valueType: 'number',
                                     value: this.domain.x_lim[1] || 0});
    this.registerRenderSubview(xLimMaxView, "x_lim-max");
    let yLimMaxView = new InputView({parent: this, required: true,
                                     name: 'y-lim-max', valueType: 'number',
                                     value: this.domain.y_lim[1] || 0});
    this.registerRenderSubview(yLimMaxView, "y_lim-max");
    let zLimMaxView = new InputView({parent: this, required: true,
                                     name: 'z-lim-max', valueType: 'number',
                                     value: this.domain.z_lim[1] || 0});
    this.registerRenderSubview(zLimMaxView, "z_lim-max");
  },
  renderDoaminProperties: function () {
    let densityView = new InputView({parent: this, required: true,
                                     name: 'density', modelKey: 'rho_0',
                                     valueType: 'number', value: this.domain.rho_0 || 0});
    this.registerRenderSubview(densityView, "density");
    let gravityView = new InputView({parent: this, required: true,
                                     name: 'gravity', modelKey: 'gravity',
                                     valueType: 'number', value: this.domain.gravity || 0});
    this.registerRenderSubview(gravityView, "gravity");
    let pressureView = new InputView({parent: this, required: true,
                                      name: 'pressure', modelKey: 'p_0',
                                      valueType: 'number', value: this.domain.p_0 || 0});
    this.registerRenderSubview(pressureView, "pressure");
    let sizeView = new InputView({parent: this, required: true,
                                  name: 'size', modelKey: 'size',
                                  valueType: 'number', value: this.domain.size || 0});
    this.registerRenderSubview(sizeView, "size");
    let speedView = new InputView({parent: this, required: true,
                                   name: 'speed', modelKey: 'c_0',
                                   valueType: 'number', value: this.domain.c_0 || 0});
    this.registerRenderSubview(speedView, "speed");
  },
  renderDomainTypes: function () {
    let typeCounts = Array(this.domain.type_names.length).fill(0);
    this.domain.particles.forEach(function (particle) {
      typeCounts[particle.type] += 1;
    });
    let unaPart = "Number of Un-Assigned Particles: " + typeCounts[0];
    $(this.queryByHook("unassigned-particles")).text(unaPart);
    let types = $(this.queryByHook("domain-types-list"));;
    types.empty()
    for(var i = 1; i < typeCounts.length; i++) {
      types.append(this.buildTypeElement(typeCounts, i));
      let typeView = new InputView({parent: this, required: true,
                                    name: 'type-' + i, valueType: 'string',
                                    value: this.domain.type_names[i]});
      this.registerRenderSubview(typeView, "type-" + i);
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    return this.renderSubview(view, this.queryByHook(hook));
  },
  renderSubviews: function () {
    this.renderDoaminProperties();
    this.renderDomainLimitations();
    $(this.queryByHook("reflect_x")).prop("checked", this.domain.boundary_condition.reflect_x);
    $(this.queryByHook("reflect_y")).prop("checked", this.domain.boundary_condition.reflect_y);
    $(this.queryByHook("reflect_z")).prop("checked", this.domain.boundary_condition.reflect_z);
    this.renderDomainTypes();
    let self = this;
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-plot") + this.queryStr;
    xhr({uri: endpoint, json: true}, function (err, resp, body) {
      self.plot = body.fig;
      self.displayDomain();
    });
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  selectParticle: function (data) {
    let point = data.points[0];
    this.actPart.part = this.domain.particles.models[point.id - 1];
    this.actPart.tn = point.curveNumber;
    this.actPart.pn = point.pointNumber;
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
  updateParticle: function () {
    if(this.actPart.part.pointChanged) {
      let x = this.actPart.part.point[0];
      let y = this.actPart.part.point[1];
      let z = this.actPart.part.point[2];
      this.changeParticleLocation(x, y, z)
    }
    if(this.actPart.part.typeChanged) {
      let type = this.actPart.part.type
      this.changeParticleType(type);
    }
    this.updatePlot();
  },
  updateValid: function () {}
});

initPage(DomainEditor);

/*
Navigating to the domain editor page
------------------------------
- load the models domain
    queryStr = "?path=<<model path>>"
      ex. ?path=cylinder_demo3d.smdl
- load a domain from a file ie. .domn or .xml files
    queryStr = "?path=<<model path>>&domainPath=<<domain file path>>"
      ex. ?path=cylinder_demo3d.smdl&domainPath=3D_cylinder.domn    or
          ?path=cylinder_demo3d.smdl&domainPath=cylinder.xml
- load a new domain (domainPath will be ignored if passed)
    queryStr = "?path=<<model path>>&new"
      ex. ?path=cylinder_demo3d.smdl&domainPath=3D_cylinder.domn&new    or
          ?path=cylinder_demo3d.smdl&new

Loading the domain editor page
------------------------------
- load the models domain
    queryStr = "?path=<<model path>>"
- load a domain from a file ie. .domn or .xml files
    queryStr = "?path=<<model path>>&domain_path=<<domain file path>>"
- load a new domain (domainPath will be ignored if passed)
    queryStr = "?path=<<model path>>&new=True"
*/