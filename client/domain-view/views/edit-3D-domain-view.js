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
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/edit3DDomainView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-target=edit-3d-domain-n]' : 'handleNumParticlesUpdate',
    'change [data-target=edit-3d-domain-limitation]' : 'handleLimitsUpdate',
    'change [data-hook=edit-3d-domain-type-select]' : 'handleTypeUpdate',
    'change [data-target=edit-3d-domain-trans]' : 'handleTransformationupdate',
    'click [data-hook=collapse-3D-domain-advanced]' : 'changeCollapseButtonText',
    'click [data-hook=build-3d-domain]' : 'handleBuildDomain'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.data = {
      "nx":1, "ny":1, "nz":1,
      "xLim":[0, 0], "yLim":[0, 0], "zLim":[0, 0],
      "type": null, "transformation": null
    }
    this.transformation = [0, 0, 0];
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.type = this.parent.model.types.get(0, "typeID");
    this.updateTotalParticles();
    this.updateTypeDefaults();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  completeAction: function () {
    $(this.queryByHook("c3dd-in-progress")).css("display", "none");
    $(this.queryByHook("c3dd-complete")).css("display", "inline-block");
    setTimeout(() => {
      $(this.queryByHook("c3dd-complete")).css("display", "none");
    }, 5000);
  },
  errorAction: function (action) {
    $(this.queryByHook("c3dd-in-progress")).css("display", "none");
    $(this.queryByHook("c3dd-action-error")).text(action);
    $(this.queryByHook("c3dd-error")).css("display", "block");
  },
  handleBuildDomain: function () {
    this.startAction();
    this.transformation.every((value) => {
      if(value !== 0) {
        this.data.transformation = this.transformation;
        return false;
      }
      return true;
    });
    this.data.domainExists = this.parent.model.particles.length > 0;
    let endpoint = path.join(app.getApiPath(), "spatial-model/3d-domain");
    app.postXHR(endpoint, this.data, {
      success: (err, response, body) => {
        this.parent.add3DDomain(body.limits, body.particles);
        this.completeAction();
        $('html, body').animate({
            scrollTop: $("#domain-figure").offset().top
        }, 20);
      },
      error: (err, response, body) => {
        this.errorAction(body.Message);
      }
    });
  },
  handleLimitsUpdate: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    let index = Number(e.target.parentElement.parentElement.dataset.index);
    this.data[key][index] = Number(e.target.value);
  },
  handleNumParticlesUpdate: function (e) {
    let key = e.target.parentElement.parentElement.dataset.key;
    this.data[key] = Number(e.target.value);
    this.updateTotalParticles();
  },
  handleTransformationupdate: function (e) {
    let index = e.target.parentElement.parentElement.dataset.index;
    this.transformation[index] = Number(e.target.value);
  },
  handleTypeUpdate: function (e) {
    let typeID = Number(e.target.value);
    this.type = this.parent.model.types.get(typeID, "typeID");
    this.updateTypeDefaults();
  },
  startAction: function () {
    $(this.queryByHook("c3dd-complete")).css("display", "none");
    $(this.queryByHook("c3dd-error")).css("display", "none");
    $(this.queryByHook("c3dd-in-progress")).css("display", "inline-block");
  },
  update: function () {},
  updateValid: function () {},
  updateTotalParticles: function () {
    let n = this.data.nx * this.data.ny * this.data.nz;
    $(this.queryByHook("3d-domain-n")).text(n);
    $(this.queryByHook("build-3d-domain")).prop("disabled", n <= 0);
  },
  updateTypeDefaults: function () {
    this.data.typeID = this.type.typeID;
    this.data.type = {
      "type_id": this.type.name, "mass": this.type.mass, "rho": this.type.rho, 
      "nu": this.type.nu, "c": this.type.c, "fixed": this.type.fixed
    }
    $(this.queryByHook("edit-3d-domain-td-mass")).text(this.type.mass);
    $(this.queryByHook("edit-3d-domain-td-vol")).text(this.type.volume);
    $(this.queryByHook("edit-3d-domain-td-rho")).text(this.type.rho);
    $(this.queryByHook("edit-3d-domain-td-nu")).text(this.type.nu);
    $(this.queryByHook("edit-3d-domain-td-c")).text(this.type.c);
    $(this.queryByHook("edit-3d-domain-td-fixed")).prop('checked', this.type.fixed);
  },
  subviews: {
    nXInputView: {
      hook: "edit-3d-domain-nx",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'nx',
          valueType: 'number',
          tests: tests.valueTests,
          value: this.data.nx
        });
      }
    },
    nYInputView: {
      hook: "edit-3d-domain-ny",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'ny',
          valueType: 'number',
          tests: tests.valueTests,
          value: this.data.ny
        });
      }
    },
    nZInputView: {
      hook: "edit-3d-domain-nz",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'nz',
          valueType: 'number',
          tests: tests.valueTests,
          value: this.data.nz
        });
      }
    },
    xMinLimInputView: {
      hook: "edit-3d-domain-x-lim-min",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'x-lim-min',
          valueType: 'number',
          value: this.data.xLim[0]
        });
      }
    },
    yMinLimInputView: {
      hook: "edit-3d-domain-y-lim-min",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'y-lim-min',
          valueType: 'number',
          value: this.data.yLim[0]
        });
      }
    },
    zMinLimInputView: {
      hook: "edit-3d-domain-z-lim-min",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'z-lim-min',
          valueType: 'number',
          value: this.data.zLim[0]
        });
      }
    },
    xMaxLimInputView: {
      hook: "edit-3d-domain-x-lim-max",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'x-lim-max',
          valueType: 'number',
          value: this.data.xLim[1]
        });
      }
    },
    yMaxLimInputView: {
      hook: "edit-3d-domain-y-lim-max",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'y-lim-max',
          valueType: 'number',
          value: this.data.yLim[1]
        });
      }
    },
    zMaxLimInputView: {
      hook: "edit-3d-domain-z-lim-max",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'z-lim-max',
          valueType: 'number',
          value: this.data.zLim[1]
        });
      }
    },
    typeSelectView: {
      hook: "edit-3d-domain-type-select",
      prepareView: function (el) {
        return new SelectView({
          name: 'type',
          required: true,
          idAttribute: 'typeID',
          textAttribute: 'name',
          eagerValidate: true,
          options: this.parent.model.types,
          value: this.type
        });
      }
    },
    xTransInputView: {
      hook: "edit-3d-domain-x-trans",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'x-transformation',
          valueType: 'number',
          value: this.transformation[0]
        });
      }
    },
    yTransInputView: {
      hook: "edit-3d-domain-y-trans",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'y-transformation',
          valueType: 'number',
          value: this.transformation[1]
        });
      }
    },
    zTransInputView: {
      hook: "edit-3d-domain-z-trans",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'z-transformation',
          valueType: 'number',
          value: this.transformation[2]
        });
      }
    }
  }
});