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
//views
let View = require('ampersand-view');
let TypesView = require('./views/types-view');
let LimitsView = require('./views/limits-view');
let ShapesView = require('./views/shapes-view');
let ActionsView = require('./views/actions-view');
let QuickviewType = require('./views/quickview-type');
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
    'click [data-hook=collapse-dv-advanced-section]' : 'changeCollapseButtonText',
    'click [data-hook=update-preview-plot]' : 'updatePlotPreview'
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
      this.model.on('update-shape-deps', this.updateShapeDeps, this);
      this.model.on('update-transformation-deps', this.updateTransformationDeps, this);
      this.model.on('update-particle-type-options', this.updateParticleTypeOptions, this);
      this.renderEditParticleView();
    }
    this.renderPropertiesView();
    this.renderLimitsView();
    this.renderTypesView();
    this.renderShapesView();
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
  changeDomainLimits: function (limits) {
    limitsChanged = false;
    if(this.model.x_lim[0] > limits[0][0]) {
      this.model.x_lim[0] = limits[0][0];
      limitsChanged = true;
    }
    if(this.model.y_lim[0] > limits[1][0]) {
      this.model.y_lim[0] = limits[1][0];
      limitsChanged = true;
    }
    if(this.model.z_lim[0] > limits[2][0]) {
      this.model.z_lim[0] = limits[2][0];
      limitsChanged = true;
    }
    if(this.model.x_lim[1] < limits[0][1]) {
      this.model.x_lim[1] = limits[0][1];
      limitsChanged = true;
    }
    if(this.model.y_lim[1] < limits[1][1]) {
      this.model.y_lim[1] = limits[1][1];
      limitsChanged = true;
    }
    if(this.model.z_lim[1] < limits[2][1]) {
      this.model.z_lim[1] = limits[2][1];
      limitsChanged = true;
    }
    if(limitsChanged) {
      this.renderLimitsView();
    }
  },
  createNewAction: function () {
    let type = this.model.types.get(0, 'typeID');
    return new Action({
      type: "", scope: 'Single Particle', priority: 1, enable: true,
      shape: '', transformation: '', typeID: type.typeID,
      point: {x: 0, y: 0, z: 0}, newPoint: {x: 0, y: 0, z: 0},
      c: type.c, fixed: type.fixed, mass: type.mass,
      nu: type.nu, rho: type.rho, vol: type.volume
    });
  },
  completeAction: function (prefix) {
    $(this.queryByHook(`${prefix}-in-progress`)).css("display", "none");
    $(this.queryByHook(`${prefix}-complete`)).css("display", "inline-block");
    $(this.queryByHook("upp-error")).css("display", "none");
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
  errorAction: function (action) {
    $(this.queryByHook("upp-in-progress")).css("display", "none");
    $(this.queryByHook("upp-action-error")).text(action);
    $(this.queryByHook("upp-error")).css("display", "block");
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
  renderShapesView: function () {
    if(this.shapesView) {
      this.shapesView.remove();
    }
    this.shapesView = new ShapesView({
      collection: this.model.shapes,
      readOnly: this.readOnly
    });
    let hook = "domain-shapes-container";
    app.registerRenderSubview(this, this.shapesView, hook);
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
      parent: this,
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
      shape: '', transformation: '', typeID: particle.type,
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
  updateParticleTypeOptions: function ({currName=null, newName=null}={}) {
    if(currName === null && newName === null) { return; }
    if(this.editParticleView.model.typeID === currName) {
      this.editParticleView.model.typeID = newName;
    }
    this.editParticleView.renderTypeSelectView();
  },
  updatePlotPreview: function ({resetFigure=true}={}) {
    if(resetFigure) {
      this.startAction("upp");
    }
    let endpoint = path.join(app.getApiPath(), "spatial-model/domain-plot");
    app.postXHR(endpoint, this.model, {
      success: (err, response, body) => {
        this.plot = body.fig;
        this.model.particles = new Particles(body.particles);
        this.typesView.updateParticleCounts(this.model.particles);
        if(this.readOnly) {
          this.renderTypesQuickview();
        }
        if(resetFigure) {
          this.resetFigure();
          this.completeAction("upp");
        }else{
          this.displayFigure();
        }
        this.changeDomainLimits(body.limits);
      },
      error: (err, response, body) => {
        this.removeFigure();
        $(this.elements.figureEmpty).css('display', 'none');
        $(this.elements.figure).css('display', 'none');
        this.errorAction(body.Message);
      }
    });
  },
  updateShapeDeps: function () {
    let deps = [];
    let shapeNames = [];
    let combForms = [];
    this.model.shapes.forEach((shape) => {
      shapeNames.push(shape.name);
      if(shape.type === "Combinatory") {
        combForms.push(shape.formula)
      }
    });
    combForms.forEach((formula) => {
      formula = formula.replace(/\(/g, ' ').replace(/\)/g, ' ');
      let formDeps = formula.split(' ');
      shapeNames.forEach((name) => {
        if(formDeps.includes(name) && !deps.includes(name)) {
          deps.push(name);
        }
      });
    });
    this.model.actions.forEach((action) => {
      let shape = action.shape;
      if(shapeNames.includes(shape) && !deps.includes(shape)) {
        deps.push(shape);
      }
    });
    this.model.shapes.trigger('update-inuse', {deps: deps});
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
      let transformation = action.transformation;
      if(transNames.includes(transformation) && !deps.includes(transformation)) {
        deps.push(transformation);
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
