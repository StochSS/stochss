/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
let Plotly = require('../lib/plotly');
//models
let Particle = require('../models/particle');
//views
let View = require('ampersand-view');
let TypesView = require('./views/types-view');
let LimitsView = require('./views/limits-view');
let QuickviewType = require('./views/quickview-type');
let PropertiesView = require('./views/properties-view');
let EditParticleView = require('./views/particle-view');
let ViewParticleView = require('./views/view-particle');
let FillGeometryView = require('./views/fill-geometry-view');
let ImportMeshView = require('./views/import-mesh-view');
let Edit3DDomainView = require('./views/edit-3D-domain-view');
let TypesDescriptionView = require('./views/types-description-view');
//templates
let template = require('./domainView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-domain-particles]' : 'changeCollapseButtonText',
    'click [data-hook=add-new-particle]' : 'handleAddParticle',
    'click [data-hook=save-selected-particle]' : 'handleSaveParticle',
    'click [data-hook=remove-selected-particle]' : 'handleRemoveParticle',
    'click [data-hook=collapse-domain-figure]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.plot = attrs.plot ? attrs.plot : null;
    this.elements = attrs.elements ? attrs.elements : null;
    this.queryStr = attrs.queryStr;
    this.newPart = this.createNewParticle();
    this.actPart = {"part":null, "tn":0, "pn":0};
    this.model.updateValid();
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderPropertiesView();
    this.renderLimitsView();
    this.renderTypesView();
    if(this.readOnly) {
      $(this.queryByHook('domain-particles-editor')).css('display', 'none');
      $(this.queryByHook('domain-figure-preview')).css('display', 'none');
      this.renderTypesQuickview();
    }else{
      this.updateParticleViews({includeGeometry: true});
      this.renderTypesDescriptionView();
    }
    if(!this.elements) {
      this.elements = {
        figure: this.queryByHook('domain-figure'),
        figureEmpty: this.queryByHook('domain-figure-empty')
      }
    }
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-plot") + this.queryStr;
    if(this.plot) {
      this.displayFigure();
    }else{
      app.getXHR(endpoint, {success: (err, response, body) => {
        this.plot = body.fig;
        this.traceTemp = body.trace_temp;
        this.displayFigure();
      }});
    }
  },
  add3DDomain: function (limits, particles) {
    let limitsChanged = this.changeDomainLimits(limits, Boolean(plot));
    particles.forEach((particle) => {
      particle = new Particle(particle);
      this.model.particles.addParticle({particle: particle});
      this.addParticle({particle: particle});
    });
    if(limitsChanged) {
      this.renderLimitsView();
    }
    this.renderTypesView();
    this.resetFigure();
  },
  addMeshDomain: function (limits, particles, types, reset) {
    let limitsChanged = this.changeDomainLimits(limits, reset);
    if(types) {
      this.addMissingTypes(types);
    }
    particles.forEach((particle) => {
      particle = new Particle(particle);
      this.model.particles.addParticle({particle: particle});
      this.addParticle({particle: particle});
    });
    if(limitsChanged) {
      this.renderLimitsView();
    }
    this.renderTypesView();
    if(types) {
      this.updateParticleViews();
    }
    this.resetFigure();
  },
  addMissingTypes: function (typeIDs) {
    typeIDs.forEach((typeID) => {
      if(!this.model.types.get(typeID, 'typeID')) {
        let name = this.model.types.addType();
        this.addType(name, {update: false});
      }
    });
  },
  addParticle: function ({particle=this.newPart}={}) {
    this.plot.data[particle.type].ids.push(particle.particle_id);
    this.plot.data[particle.type].x.push(particle.point[0]);
    this.plot.data[particle.type].y.push(particle.point[1]);
    this.plot.data[particle.type].z.push(particle.point[2]);
  },
  addType: function (name, {update=true}={}) {
    let newTrace = JSON.parse(JSON.stringify(this.traceTemp));
    newTrace.name = name;
    this.plot.data.push(newTrace);
    if(update) {
      this.updateParticleViews();
    }
  },
  applyGeometry: function (ids, type) {
    let actPart = JSON.parse(JSON.stringify(this.actPart));
    ids.forEach((id) => {
      let particle = this.model.particles.get(id, 'particle_id');
      // Set active particle for updating particle in the plot
      this.actPart = {
        part: particle,
        tn: particle.type,
        pn: this.plot.data[particle.type].ids.indexOf(particle.particle_id)
      }
      // Update the particle attributes
      particle.type = type.typeID;
      particle.mass = type.mass;
      particle.volume = type.volume;
      particle.rho = type.rho;
      particle.nu = type.nu;
      particle.c = type.c;
      particle.fixed = type.fixed;
      // Update the particle in the figure
      this.changeParticleType(type.typeID, {update: false});
    });
    if(actPart.part) {
      this.actPart = {
        part: this.model.particles.get(actPart.part.particle_id, "particle_id"),
        tn: type.typeID,
        pn: this.plot.data[type.typeID].ids.indexOf(actPart.part.particle_id)
      }
      if(ids.includes(actPart.part.particle_id)) {
        this.renderEditParticleView();
      }
    }else{
      this.actPart = actPart
    }
    this.renderTypesView();
    this.resetFigure();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e)
  },
  changeDomainLimits: function (limits, reset) {
    var limitsChanged = false;
    if(reset) {
      this.model.x_lim = limits.x_lim;
      this.model.y_lim = limits.y_lim;
      this.model.y_lim = limits.y_lim;
      limitsChanged = true;
    }else{
      if(this.model.x_lim[0] > limits.x_lim[0]) {
        this.model.x_lim[0] = limits.x_lim[0];
        limitsChanged = true;
      }
      if(this.model.y_lim[0] > limits.y_lim[0]) {
        this.model.y_lim[0] = limits.y_lim[0];
        limitsChanged = true;
      }
      if(this.model.z_lim[0] > limits.z_lim[0]) {
        this.model.z_lim[0] = limits.z_lim[0];
        limitsChanged = true;
      }
      if(this.model.x_lim[1] < limits.x_lim[1]) {
        this.model.x_lim[1] = limits.x_lim[1];
        limitsChanged = true;
      }
      if(this.model.y_lim[1] < limits.y_lim[1]) {
        this.model.y_lim[1] = limits.y_lim[1];
        limitsChanged = true;
      }
      if(this.model.z_lim[1] < limits.z_lim[1]) {
        this.model.z_lim[1] = limits.z_lim[1];
        limitsChanged = true;
      }
    }
    return limitsChanged;
  },
  changeParticleLocation: function () {
    this.plot.data[this.actPart.tn].x[this.actPart.pn] = this.actPart.part.point[0];
    this.plot.data[this.actPart.tn].y[this.actPart.pn] = this.actPart.part.point[1];
    this.plot.data[this.actPart.tn].z[this.actPart.pn] = this.actPart.part.point[2];
  },
  changeParticleType: function (type, {update=true}={}) {
    let id = this.plot.data[this.actPart.tn].ids.splice(this.actPart.pn, 1)[0];
    let x = this.plot.data[this.actPart.tn].x.splice(this.actPart.pn, 1)[0];
    let y = this.plot.data[this.actPart.tn].y.splice(this.actPart.pn, 1)[0];
    let z = this.plot.data[this.actPart.tn].z.splice(this.actPart.pn, 1)[0];
    this.plot.data[type].ids.push(id);
    this.plot.data[type].x.push(x);
    this.plot.data[type].y.push(y);
    this.plot.data[type].z.push(z);
    if(update) {
      this.resetFigure();
    }
  },
  createNewParticle: function () {
    let type = this.model.types.get(0, 'typeID');
    return new Particle({
      c: type.c,
      fixed: type.fixed,
      mass: type.mass,
      nu: type.nu,
      point: [0, 0, 0],
      rho: type.rho,
      type: type.typeID,
      volume: type.volume
    });
  },
  completeAction: function (prefix) {
    $(this.queryByHook(`${prefix}-in-progress`)).css("display", "none");
    $(this.queryByHook(`${prefix}-complete`)).css("display", "inline-block");
    setTimeout(() => {
      $(this.queryByHook(`${prefix}-complete`)).css('display', 'none');
    }, 5000);
  },
  deleteParticle: function () {
    this.plot.data[this.actPart.tn].ids.splice(this.actPart.pn, 1);
    this.plot.data[this.actPart.tn].x.splice(this.actPart.pn, 1);
    this.plot.data[this.actPart.tn].y.splice(this.actPart.pn, 1);
    this.plot.data[this.actPart.tn].z.splice(this.actPart.pn, 1);
    this.resetFigure();
  },
  deleteType: function (type, {unassign=true}={}) {
    if(unassign) {
      this.unassignAllParticles(type, {update: false});
    }else{
      if(this.actPart.part && this.actPart.part.type === type) {
        this.actPart = {"part":null, "tn":0, "pn":0};
      }
      if(this.newPart && this.newPart.type === type) {
        this.newPart.type = 0
      }
      let particles = this.model.particles.filter((particle) => {
        return particle.type === type;
      });
      this.model.particles.removeParticles(particles);
    }
    this.model.realignTypes(type);
    this.plot.data.splice(type, 1);
    this.renderTypesView();
    this.updateParticleViews({includeGeometry: true});
    this.resetFigure();
  },
  displayFigure: function () {
    if(this.model.particles.length > 0) {
      $(this.elements.figureEmpty).css('display', 'none');
      $(this.elements.figure).css('display', 'block');
      Plotly.newPlot(this.elements.figure, this.plot);
      this.elements.figure.on('plotly_click', _.bind(this.selectParticle, this));
    }else{
      $(this.elements.figureEmpty).css('display', 'block');
      $(this.elements.figure).css('display', 'none');
    }
  },
  handleAddParticle: function () {
    this.startAction("anp")
    this.model.particles.addParticle({particle: this.newPart});
    this.addParticle();
    this.resetFigure();
    this.renderTypesView();
    this.newPart = this.createNewParticle();
    this.renderNewParticleView();
    this.completeAction("anp");
  },
  handleRemoveParticle: function () {
    this.startAction("rsp")
    this.model.particles.removeParticle(this.actPart.part);
    this.deleteParticle();
    this.actPart = {"part":null, "tn":0, "pn":0};
    this.renderTypesView();
    this.renderEditParticleView();
    this.completeAction("rsp")
  },
  handleSaveParticle: function () {
    this.startAction("esp");
    if(this.editParticleView.origType !== this.actPart.part.type) {
      this.changeParticleType(this.actPart.part.type, {update: false});
      this.renderTypesView();
    }
    if(!this.actPart.part.comparePoint(this.editParticleView.origPoint)) {
      this.changeParticleLocation();
    }
    this.resetFigure();
    this.completeAction("esp");
  },
  removeFigure: function () {
    try {
      this.elements.figure.removeListener('plotly_click', this.selectParticle);
      Plotly.purge(this.elements.figure);
    }catch (err) {
      return
    }
  },
  renameType: function (index, name) {
    this.plot.data[index].name = name;
    this.resetFigure();
  },
  renderEdit3DDomainView: function () {
    if(this.edit3DDomainView) {
      this.edit3DDomainView.remove();
    }
    this.edit3DDomainView = new Edit3DDomainView();
    app.registerRenderSubview(this, this.edit3DDomainView, "3d-domain-container");
  },
  renderEditParticleView: function () {
    if(this.editParticleView) {
      this.editParticleView.remove();
    }
    let disable = this.actPart.part == null
    this.editParticleView = new EditParticleView({
      model: this.actPart.part ? this.actPart.part : this.createNewParticle(),
      defaultType: this.model.types.get(this.actPart.part ? this.actPart.part.type : 0, "typeID"),
      viewIndex: 1,
      disable: disable
    });
    app.registerRenderSubview(this, this.editParticleView, "edit-particle-container");
    $(this.queryByHook("edit-select-message")).css('display', disable ? 'block' : 'none');
    $(this.queryByHook("save-selected-particle")).prop('disabled', disable);
    $(this.queryByHook("remove-selected-particle")).prop('disabled', disable);
  },
  renderFillGeometryView: function () {
    if(this.fillGeometryView) {
      this.fillGeometryView.remove();
    }
    this.fillGeometryView = new FillGeometryView();
    app.registerRenderSubview(this, this.fillGeometryView, 'fill-geometry-container');
  },
  renderImportMeshView: function () {
    if(this.importMeshView) {
      this.importMeshView.remove();
    }
    this.importMeshView = new ImportMeshView();
    app.registerRenderSubview(this, this.importMeshView, "import-particles-section");
  },
  renderLimitsView: function () {
    if(this.limitsView) {
      this.limitsView.remove();
    }
    this.limitsView = new LimitsView({
      model: this.model,
      readOnly: this.readOnly
    });
    app.registerRenderSubview(this, this.limitsView, "domain-limits-container");
  },
  renderNewParticleView: function () {
    if(this.newParticleView) {
      this.newParticleView.remove();
    }
    this.newParticleView = new EditParticleView({
      model: this.newPart,
      defaultType: this.model.types.get(0, "typeID"),
      viewIndex: 0
    });
    app.registerRenderSubview(this, this.newParticleView, "new-particle-container");
  },
  renderPropertiesView: function () {
    if(this.propertiesView) {
      this.propertiesView.remove();
    }
    this.propertiesView = new PropertiesView({
      model: this.model,
      readOnly: this.readOnly
    });
    app.registerRenderSubview(this, this.propertiesView, "domain-properties-container");
  },
  renderTypesDescriptionView: function () {
    if(this.typesDescriptionView) {
      this.typesDescriptionView.remove();
    }
    this.typesDescriptionView = new TypesDescriptionView();
    app.registerRenderSubview(this, this.typesDescriptionView, "particle-types-container");
  },
  renderTypesQuickview: function () {
    if(this.typesQuickviewView) {
      this.typesQuickviewView.remove();
    } 
    this.elements.select.css('display', 'block');
    this.typesQuickviewView = this.renderCollection(
      this.model.types,
      QuickviewType,
      this.elements.type
    );
  },
  renderTypesView: function () {
    if(this.typesView) {
      this.typesView.remove();
    }
    let particleCounts = {};
    this.model.particles.forEach((particle) => {
      if(particleCounts[particle.type]) {
        particleCounts[particle.type] += 1;
      }else{
        particleCounts[particle.type] = 1;
      }
    });
    this.model.types.forEach((dType) => {
      if(particleCounts[dType.typeID]) {
        dType.numParticles = particleCounts[dType.typeID];
      }else{
        dType.numParticles = 0;
      }
    });
    this.typesView = new TypesView({
      collection: this.model.types,
      readOnly: this.readOnly
    });
    app.registerRenderSubview(this, this.typesView, "domain-types-container");
  },
  renderViewParticleView: function () {
    if(this.viewParticleView) {
      this.viewParticleView.remove();
    }
    this.elements.select.css('display', 'none');
    this.viewParticleView = new ViewParticleView({
      model: this.actPart.part
    });
    app.registerRenderSubview(this.elements.particle.view, this.viewParticleView, this.elements.particle.hook);
  },
  resetFigure: function () {
    this.removeFigure();
    this.displayFigure();
  },
  selectParticle: function (data) {
    let point = data.points[0];
    this.actPart.part = this.model.particles.get(point.id, 'particle_id');
    this.actPart.tn = point.curveNumber;
    this.actPart.pn = point.pointNumber;
    if(this.readOnly) {
      this.renderViewParticleView();
    }else{
      this.renderEditParticleView();
    }
  },
  setParticleTypes: function (typeIDs, types) {
    this.addMissingTypes(typeIDs);
    let actPart = JSON.parse(JSON.stringify(this.actPart));
    types.forEach((type) => {
      let particle = this.model.particles.get(type.particle_id, 'particle_id');
      this.actPart = {
        part: particle,
        tn: particle.type,
        pn: this.plot.data[particle.type].ids.indexOf(particle.particle_id)
      }
      this.changeParticleType(type.typeID, {update: false});
      particle.type = type.typeID;
    });
    if(actPart.part && actPart.part.type === type) {
      this.actPart = {
        part: this.model.particles.get(actPart.part.particle_id, "particle_id"),
        tn: 0,
        pn: this.plot.data[0].ids.indexOf(actPart.part.particle_id)
      }
      this.renderEditParticleView();
    }else{
      this.actPart = actPart
    }
    this.resetFigure();
    this.updateParticleViews();
  },
  startAction: function (prefix) {
    $(this.queryByHook(`${prefix}-complete`)).css('display', 'none');
    $(this.queryByHook(`${prefix}-in-progress`)).css("display", "inline-block");
  },
  unassignAllParticles: function (type, {update=true}={}) {
    let actPart = JSON.parse(JSON.stringify(this.actPart));
    this.model.particles.forEach((particle) => {
      if(particle.type === type) {
        this.actPart = {
          part: particle,
          tn: type,
          pn: this.plot.data[type].ids.indexOf(particle.particle_id)
        }
        this.changeParticleType(0, {update: false});
        particle.type = 0;
      }
    });
    if(actPart.part) {
      this.actPart = {
        part: this.model.particles.get(actPart.part.particle_id, "particle_id"),
        tn: 0,
        pn: this.plot.data[0].ids.indexOf(actPart.part.particle_id)
      }
      if(actPart.part.type === type) {
        this.renderEditParticleView();
      }
    }else{
      this.actPart = actPart
    }
    if(update) {
      this.renderTypesView();
      this.resetFigure();
    }
  },
  updateParticleViews: function ({includeGeometry=false}={}) {
    this.renderNewParticleView();
    this.renderEditParticleView();
    this.renderEdit3DDomainView();
    this.renderImportMeshView();
    if(includeGeometry) {
      this.renderFillGeometryView();
    }
  }
});
