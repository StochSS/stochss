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
let app = require('../../app');
let Tooltips = require('../../tooltips');
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
//templates
let editTemplate = require('../templates/editType.pug');
let viewTemplate = require('../templates/viewType.pug');

module.exports = View.extend({
  bindings: {
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select'
    }
  },
  events: {
    'change [data-hook=type-name]' : 'handleRenameType',
    'change [data-target=type-defaults]' : 'updateView',
    'change [data-hook=td-fixed]' : 'setTDFixed',
    'change [data-hook=type-geometry]' : 'updateView',
    'click [data-hook=select]' : 'selectType',
    'click [data-hook=unassign-all]' : 'handleUnassignParticles',
    'click [data-hook=delete-type]' : 'handleDeleteType',
    'click [data-hook=delete-all]' : 'handleDeleteTypeAndParticle',
    'click [data-hook=apply-geometry]' : 'handleApplyGeometry'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    this.tooltips = Tooltips.domainType;
  },
  render: function (attrs, options) {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    if(!this.viewMode) {
      if(this.model.selected) {
        setTimeout(_.bind(this.openTypeDetails, this), 1);
      }
    }
    $(this.queryByHook('view-td-fixed')).prop('checked', this.model.fixed)
    app.documentSetup();
  },
  completeAction: function () {
    $(this.queryByHook(`tg-in-progress-${this.model.typeID}`)).css("display", "none");
    $(this.queryByHook(`tg-complete-${this.model.typeID}`)).css("display", "inline-block");
    setTimeout(() => {
      $(this.queryByHook(`tg-complete-${this.model.typeID}`)).css("display", "none");
    }, 5000);
  },
  errorAction: function (action) {
    $(this.queryByHook(`tg-in-progress-${this.model.typeID}`)).css("display", "none");
    $(this.queryByHook(`tg-action-error-${this.model.typeID}`)).html(action);
    $(this.queryByHook(`tg-error-${this.model.typeID}`)).css("display", "block");
  },
  handleApplyGeometry: function (e) {
    this.startAction();
    let domain = this.model.collection.parent;
    let particles = domain.particles.toJSON();
    let center = [
      domain.x_lim[1] - domain.x_lim[0],
      domain.y_lim[1] - domain.y_lim[0],
      domain.z_lim[1] - domain.z_lim[0]
    ];
    let data = {particles: particles, type: this.model.toJSON(), center: center}
    let endpoint = path.join(app.getApiPath(), 'spatial-model/apply-geometry');
    app.postXHR(endpoint, data, {
      success: (err, response, body) => {
        this.parent.parent.applyGeometry(body.particles, this.model);
        this.completeAction();
      },
      error: (err, response, body) => {
        if(body.Traceback.includes("SyntaxError")) {
          var tracePart = body.Traceback.split('\n').slice(6)
          tracePart.splice(2, 2)
          tracePart[1] = tracePart[1].replace(new RegExp('          ', 'g'), '                 ')
          var errorBlock = `<p class='mb-1' style='white-space:pre'>${body.Message}<br>${tracePart.join('<br>')}</p>`
        }else{
          var errorBlock = body.Message
        }
        this.errorAction(errorBlock);
      }
    });
  },
  handleDeleteType: function (e) {
    let type = Number(e.target.dataset.type);
    this.model.collection.removeType(this.model);
    this.parent.parent.deleteType(this.model.typeID);
  },
  handleDeleteTypeAndParticle: function (e) {
    let type = Number(e.target.dataset.type);
    this.model.collection.removeType(this.model);
    this.parent.parent.deleteType(this.model.typeID, {unassign: false});
  },
  handleRenameType: function (e) {
    this.updateView();
    let type = Number(e.target.parentElement.parentElement.dataset.target);
    let name = e.target.value;
    this.parent.parent.renameType(type, name);
  },
  handleUnassignParticles: function () {
    this.model.numParticles = 0;
    this.parent.parent.unassignAllParticles(this.model.typeID);
  },
  openTypeDetails: function () {
    $("#collapse-type-details" + this.model.typeID).collapse("show");
  },
  selectType: function () {
    this.model.selected = !this.model.selected;
  },
  setTDFixed: function (e) {
    this.model.fixed = e.target.checked;
    this.updateView();
  },
  startAction: function () {
    $(this.queryByHook(`tg-complete-${this.model.typeID}`)).css("display", "none");
    $(this.queryByHook(`tg-error-${this.model.typeID}`)).css("display", "none");
    $(this.queryByHook(`tg-in-progress-${this.model.typeID}`)).css("display", "inline-block");
  },
  update: function () {},
  updateValid: function () {},
  updateView: function () {
    this.parent.renderViewTypeView();
    this.parent.parent.updateParticleViews({includeGeometry: true});
  },
  subviews: {
    inputTypeID: {
      hook: "type-name",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name
        });
      }
    },
    inputMass: {
      hook: "td-mass",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'mass',
          modelKey: 'mass',
          valueType: 'number',
          tests: tests.valueTests,
          value: this.model.mass
        });
      }
    },
    inputVolume: {
      hook: 'td-vol',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'volume',
          modelKey: 'volume',
          valueType: 'number',
          tests: tests.valueTests,
          value: this.model.volume
        });
      }
    },
    inputDensity: {
      hook: 'td-rho',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'density',
          modelKey: 'rho',
          valueType: 'number',
          tests: tests.valueTests,
          value: this.model.rho
        });
      }
    },
    inputViscosity: {
      hook: 'td-nu',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'viscosity',
          modelKey: 'nu',
          valueType: 'number',
          tests: tests.valueTests,
          value: this.model.nu
        });
      }
    },
    inputSpeedOfSound: {
      hook: 'td-c',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'speed-of-sound',
          modelKey: 'c',
          valueType: 'number',
          tests: tests.valueTests,
          value: this.model.c
        });
      }
    },
    inputGeometry: {
      hook: 'type-geometry',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'geometry',
          modelKey: 'geometry',
          valueType: 'string',
          value: this.model.geometry,
          placeholder: "--Expression in terms of 'x', 'y', 'z'--"
        });
      }
    }
  }
});