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

let path = require('path');
var xhr = require('xhr');
var _ = require('underscore');
//support files
var app = require('../app');
var Plotly = require('../lib/plotly');
//views
var PageView = require('../pages/base');
//models
var Model = require('../models/model');
var Domain = require('../models/domain');
//templates
var template = require('../templates/pages/domainEditor.pug');

import initPage from './page.js';

let DomainEditor = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    let urlParams = new URLSearchParams(window.location.search)
    let modelPath = urlParams.get("path")
    let newDomain = urlParams.has("new") ? true : false;
    var queryStr = "?path=" + modelPath
    if(newDomain) {
      queryStr += "&new=True"
    }else if(urlParams.has("domainPath")) {
      queryStr += "&domain_path=" + urlParams.get("domainPath")
    }
    let endpoint = path.join(app.getApiPath(), "spatial-model/load-domain") + queryStr
    xhr({uri: endpoint, json: true}, function (err, resp, body) {
      self.plot = body.fig;
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
    this.unassignAllParticles(type, false)
    this.plot.data.splice(type, 1);
    this.updatePlot();
  },
  deleteTypeAndParticles: function (type) {
    let self = this;
    this.domain.particles.forEach(function (particle) {
      if(particle.type === type) {
        self.domain.particles.removeParticle(particle);
      }
    });
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
  renameType: function (oldName, newName) {
    let index = this.domain.getTypeIndex(oldName);
    this.domain.type_names[index] = newName;
    this.plot.data[index].name = newName;
    this.updatePlot();
  },
  renderSubviews: function () {
    this.displayDomain();
  },
  selectParticle: function (data) {
    let point = data.points[0];
    this.actPart.part = this.domain.particles.models[point.id - 1];
    this.actPart.tn = point.curveNumber;
    this.actPart.pn = point.pointNumber;
  },
  unassignAllParticles: function (type, update=true) {
    let self = this;
    this.domain.particles.forEach(function (particle) {
      if(particle.type === type) {
        self.actPart.part = particle;
        self.actPart.tn = type;
        self.actPart.pn = self.data[type].ids.indexOf(particle.particle_id)
        self.changeParticleType(0);
      }
    });
    if(update) {
      this.updatePlot();
    }
  },
  updatePlot: function () {
    var el = this.queryByHook("domain-plot");
    el.removeListener('plotly_click', this.selectPoint);
    Plotly.purge(el);
    displayDomain();
  },
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
  }
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