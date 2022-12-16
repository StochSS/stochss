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
let Plotly = require('plotly.js-dist');
//collections
let Particles = require('../models/particles');
//models
let Action = require('../models/action');
// let Particle = require('../models/particle');
//views
let View = require('ampersand-view');
let TypesView = require('./views/types-view');
let LimitsView = require('./views/limits-view');
let ActionsView = require('./views/actions-view');
let LatticesView = require('./views/lattices-view');
let QuickviewType = require('./views/quickview-type');
let GeometriesView = require('./views/geometries-view');
let PropertiesView = require('./views/properties-view');
let EditParticleView = require('./views/particle-view');
let ViewParticleView = require('./views/view-particle');
let TransformationsView = require('./views/transformations-view');
//templates
let template = require('./domainView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-domain-particles]' : 'changeCollapseButtonText',
    'click [data-hook=save-selected-particle]' : 'handleSaveParticle',
    'click [data-hook=remove-selected-particle]' : 'handleRemoveParticle',
    'click [data-hook=collapse-domain-figure]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-dv-advanced-section]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.plot = attrs.plot ? attrs.plot : null;
    this.elements = attrs.elements ? attrs.elements : null;
    this.queryStr = attrs.queryStr;
    this.actPart = {"action": null, "part": null, "tn": 0, "pn": 0};
    this.model.updateValid();
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('domain-particles-editor')).css('display', 'none');
      $(this.queryByHook('domain-figure-preview')).css('display', 'none');
      this.renderTypesQuickview();
    }else{
      this.model.on('update-type-deps', this.updateTypeDeps, this);
      this.model.on('update-geometry-deps', this.updateGeometryDeps, this);
      this.model.on('update-lattice-deps', this.updateLatticeDeps, this);
      this.model.on('update-transformation-deps', this.updateTransformationDeps, this);
      this.model.on('update-particle-type-options', this.updateParticleTypeOptions, this);
      this.renderEditParticleView();
    }
    this.renderPropertiesView();
    this.renderLimitsView();
    this.renderTypesView();
    this.renderGeometriesView();
    this.renderLatticesView();
    this.renderTransformationsView();
    this.renderActionsView();
    if(!this.elements) {
      this.elements = {
        figure: this.queryByHook('domain-figure'),
        figureEmpty: this.queryByHook('domain-figure-empty')
      }
    }
    this.model.on('update-plot-preview', this.updatePlotPreview, this);
    if(this.plot) {
      this.displayFigure();
    }else{
      this.model.trigger('update-plot-preview', {resetFigure: false});
    }
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e)
  },
  // changeDomainLimits: function (limits, reset) {
  //   var limitsChanged = false;
  //   if(reset) {
  //     this.model.x_lim = limits.x_lim;
  //     this.model.y_lim = limits.y_lim;
  //     this.model.y_lim = limits.y_lim;
  //     limitsChanged = true;
  //   }else{
  //     if(this.model.x_lim[0] > limits.x_lim[0]) {
  //       this.model.x_lim[0] = limits.x_lim[0];
  //       limitsChanged = true;
  //     }
  //     if(this.model.y_lim[0] > limits.y_lim[0]) {
  //       this.model.y_lim[0] = limits.y_lim[0];
  //       limitsChanged = true;
  //     }
  //     if(this.model.z_lim[0] > limits.z_lim[0]) {
  //       this.model.z_lim[0] = limits.z_lim[0];
  //       limitsChanged = true;
  //     }
  //     if(this.model.x_lim[1] < limits.x_lim[1]) {
  //       this.model.x_lim[1] = limits.x_lim[1];
  //       limitsChanged = true;
  //     }
  //     if(this.model.y_lim[1] < limits.y_lim[1]) {
  //       this.model.y_lim[1] = limits.y_lim[1];
  //       limitsChanged = true;
  //     }
  //     if(this.model.z_lim[1] < limits.z_lim[1]) {
  //       this.model.z_lim[1] = limits.z_lim[1];
  //       limitsChanged = true;
  //     }
  //   }
  //   return limitsChanged;
  // },
  createNewAction: function () {
    let type = this.model.types.get(0, 'typeID');
    return new Action({
      type: "", scope: 'Single Particle', priority: 1, enable: true,
      geometry: '', lattice: '', typeID: type.typeID,
      point: {x: 0, y: 0, z: 0}, newPoint: {x: 0, y: 0, z: 0},
      c: type.c, fixed: type.fixed, mass: type.mass,
      nu: type.nu, rho: type.rho, vol: type.volume
    });
  },
  completeAction: function (prefix) {
    $(this.queryByHook(`${prefix}-in-progress`)).css("display", "none");
    $(this.queryByHook(`${prefix}-complete`)).css("display", "inline-block");
    setTimeout(() => {
      $(this.queryByHook(`${prefix}-complete`)).css('display', 'none');
    }, 5000);
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
  handleRemoveParticle: function () {
    this.startAction("rsp")
    let action = this.actPart.action;
    this.model.actions.addAction("Remove Action", {action: action});
    this.model.trigger('update-plot-preview');
    this.actPart.action = this.createNewAction();
    this.completeAction("rsp")
    this.renderEditParticleView();
  },
  handleSaveParticle: function () {
    this.startAction("esp");
    let action = this.actPart.action;
    this.model.actions.addAction("Set Action", {action: action});
    this.model.trigger('update-plot-preview');
    this.actPart.action = this.createNewAction();
    this.completeAction("esp");
    this.renderEditParticleView();
  },
  removeFigure: function () {
    try {
      this.elements.figure.removeListener('plotly_click', this.selectParticle);
      Plotly.purge(this.elements.figure);
    }catch (err) {
      return
    }
  },
  renderActionsView: function () {
    if(this.actionsView) {
      this.actionsView.remove();
    }
    this.actionsView = new ActionsView({
      collection: this.model.actions,
      readOnly: this.readOnly
    });
    let hook = "domain-actions-container";
    app.registerRenderSubview(this, this.actionsView, hook);
  },
  renderEditParticleView: function () {
    if(this.editParticleView) {
      this.editParticleView.remove();
    }
    let disable = this.actPart.action == null
    this.editParticleView = new EditParticleView({
      model: this.actPart.action ? this.actPart.action : this.createNewAction(),
      defaultType: this.model.types.get(this.actPart.action ? this.actPart.action.typeID : 0, "typeID"),
      viewIndex: 1,
      disable: disable
    });
    app.registerRenderSubview(this, this.editParticleView, "edit-particle-container");
    $(this.queryByHook("edit-select-message")).css('display', disable ? 'block' : 'none');
    $(this.queryByHook("save-selected-particle")).prop('disabled', disable);
    $(this.queryByHook("remove-selected-particle")).prop('disabled', disable);
  },
  renderGeometriesView: function () {
    if(this.geometriesView) {
      this.geometriesView.reomve();
    }
    this.geometriesView = new GeometriesView({
      collection: this.model.geometries,
      readOnly: this.readOnly
    });
    let hook = "domain-geometries-container";
    app.registerRenderSubview(this, this.geometriesView, hook);
  },
  renderLatticesView: function () {
    if(this.latticesView) {
      this.latticesView.reomve();
    }
    this.latticesView = new LatticesView({
      collection: this.model.lattices,
      readOnly: this.readOnly
    });
    let hook = "domain-lattices-container";
    app.registerRenderSubview(this, this.latticesView, hook);
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
  renderTransformationsView: function () {
    if(this.transformationsView) {
      this.transformationsView.reomve();
    }
    this.transformationsView = new TransformationsView({
      collection: this.model.transformations,
      readOnly: this.readOnly
    });
    let hook = "domain-transformations-container";
    app.registerRenderSubview(this, this.transformationsView, hook);
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
    let particle = this.model.particles.get(point.id, 'particle_id')
    this.actPart.part = particle;
    this.actPart.action = new Action({
      type: "", scope: 'Single Particle', priority: 1, enable: true,
      geometry: '', lattice: '', typeID: particle.type,
      point: {x: particle.point[0], y: particle.point[1], z: particle.point[2]},
      newPoint: {x: particle.point[0], y: particle.point[1], z: particle.point[2]},
      c: particle.c, fixed: particle.fixed, mass: particle.mass,
      nu: particle.nu, rho: particle.rho, vol: particle.volume
    });
    this.actPart.tn = point.curveNumber;
    this.actPart.pn = point.pointNumber;
    if(this.readOnly) {
      this.renderViewParticleView();
    }else{
      this.renderEditParticleView();
    }
  },
  startAction: function (prefix) {
    $(this.queryByHook(`${prefix}-complete`)).css('display', 'none');
    $(this.queryByHook(`${prefix}-in-progress`)).css("display", "inline-block");
  },
  updateGeometryDeps: function () {
    let deps = [];
    let geomNames = [];
    let combForms = [];
    this.model.geometries.forEach((geometry) => {
      geomNames.push(geometry.name);
      if(geometry.type === "Combinatory Geometry") {
        combForms.push(geometry.formula)
      }
    });
    combForms.forEach((formula) => {
      formula = formula.replace(/\(/g, ' ').replace(/\)/g, ' ');
      let formDeps = formula.split(' ');
      geomNames.forEach((name) => {
        if(formDeps.includes(name) && !deps.includes(name)) {
          deps.push(name);
        }
      });
    });
    this.model.transformations.forEach((transformation) => {
      let geometry = transformation.geometry;
      if(geomNames.includes(geometry) && !deps.includes(geometry)) {
        deps.push(geometry);
      }
    });
    this.model.actions.forEach((action) => {
      let geometry = action.geometry;
      if(geomNames.includes(geometry) && !deps.includes(geometry)) {
        deps.push(geometry);
      }
    });
    this.model.geometries.trigger('update-inuse', {deps: deps});
  },
  updateLatticeDeps: function () {
    let deps = [];
    let lattNames = this.model.lattices.map((lattice) => {
      return lattice.name;
    });
    this.model.transformations.forEach((transformation) => {
      let lattice = transformation.lattice;
      if(lattNames.includes(lattice) && !deps.includes(lattice)) {
        deps.push(lattice);
      }
    });
    this.model.actions.forEach((action) => {
      let lattice = action.lattice
      if(lattNames.includes(lattice) && !deps.includes(lattice)) {
        deps.push(lattice);
      }
    });
    this.model.lattices.trigger('update-inuse', {deps: deps});
  },
  updateParticleTypeOptions: function ({currName=null, newName=null}={}) {
    if(currName === null && newName === null) { return; }
    if(this.editParticleView.model.typeID === currName) {
      this.editParticleView.model.typeID = newName;
    }
    this.editParticleView.renderTypeSelectView();
  },
  updatePlotPreview: function ({resetFigure=true}={}) {
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-plot");
    app.postXHR(endpoint, this.model, {success: (err, response, body) => {
      this.plot = body.fig;
      this.model.particles = new Particles(body.particles);
      let particleCounts = {};
      this.model.particles.forEach((particle) => {
        if(particleCounts[particle.type]) {
          particleCounts[particle.type] += 1;
        }else{
          particleCounts[particle.type] = 1;
        }
      });
      this.typesView.editTypeView.views.forEach((view) => {
        view.model.numParticles = particleCounts[view.model.typeID] ? particleCounts[view.model.typeID] : 0;
      });
      this.typesView.renderEditTypeView();
      this.typesView.renderViewTypeView();
      if(resetFigure) {
        this.resetFigure();
      }else{
        this.displayFigure();
      }
    }});
  },
  updateTransformationDeps: function () {
    let deps = [];
    let transNames = this.model.transformations.map((transformation) => {
      return transformation.name;
    });
    this.model.transformations.forEach((transformation) => {
      let nestedTrans = transformation.transformation;
      if(transNames.includes(nestedTrans) && !deps.includes(nestedTrans)) {
        deps.push(nestedTrans);
      }
    });
    this.model.actions.forEach((action) => {
      let geometry = action.geometry;
      let lattice = action.lattice;
      if(transNames.includes(geometry) && !deps.includes(geometry)) {
        deps.push(geometry);
      }
      if(transNames.includes(lattice) && !deps.includes(lattice)) {
        deps.push(lattice);
      }
    });
    this.model.transformations.trigger('update-inuse', {deps: deps});
  },
  updateTypeDeps: function () {
    let deps = [];
    let revDeps = {};
    this.model.types.forEach((type) => {
      if(type.name !== "Un-Assigned") {
        revDeps[type.name] = [];
      }
    });
    this.model.actions.forEach((action) => {
      let type = this.model.types.get(action.typeID, 'typeID').name;
      if(Object.keys(revDeps).includes(type)) {
        revDeps[type].push(action.cid);
        if(!deps.includes(type)) {
          deps.push(type);
        }
      }
    });
    console.log(revDeps);
    this.model.types.trigger('update-inuse', {deps: deps});
  }
});
