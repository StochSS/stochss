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
//support files
let app = require('../../app');
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/fillGeometryView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=fill-geometry-type-select]' : 'handleTypeUpdate',
    'change [data-target=fill-geometry-limitation]' : 'handleDataUpdate',
    'change [data-target=fill-geometry-delta]' : 'handleDataUpdate',
    'click [data-hook=fill-geometry]' : 'handleFillGeometry'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.data = {
      "xmin":0, "ymin":0, "zmin":0, "xmax":0, "ymax":0,
      "zmax":0, "deltax": 0, "deltay": 0, "deltaz": 0
    }
    this.type = null;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.getTypes();
    this.renderTypeSelectView();
  },
  completeAction: function () {
    $(this.queryByHook("fg-in-progress")).css("display", "none");
    $(this.queryByHook("fg-complete")).css("display", "inline-block");
    setTimeout(() => {
      $(this.queryByHook("fg-complete")).css("display", "none");
    }, 5000);
  },
  disable: function () {
    if(this.data.xmin === this.data.xmax) { return true; }
    if(this.data.ymin === this.data.ymax) { return true; }
    if(this.data.zmin === this.data.zmax) { return true; }
    if(this.data.deltax === 0) { return true; }
    if(this.data.deltay === 0) { return true; }
    if(this.data.deltaz === 0) { return true; }
    if(!this.type) { return true; }
    return false;
  },
  errorAction: function (action) {
    $(this.queryByHook("fg-in-progress")).css("display", "none");
    $(this.queryByHook("fg-action-error")).html(action);
    $(this.queryByHook("fg-error")).css("display", "block");
  },
  getTypes: function () {
    this.types = this.parent.model.types.filter((type) => {
      return Boolean(type.geometry);
    });
  },
  handleDataUpdate: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    this.data[key] = Number(e.target.value);
    this.toggleFillGeometry();
  },
  handleFillGeometry: function () {
    this.startAction();
    let data = {kwargs: this.data, type: this.type}
    let endpoint = path.join(app.getApiPath(), 'spatial-model/fill-geometry');
    app.postXHR(endpoint, data, {
      success: (err, response, body) => {
        this.parent.parent.add3DDomain(body.limits, body.particles);
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
  handleTypeUpdate: function (e) {
    if(e.target.value) {
      let typeID = Number(e.target.value);
      this.type = this.parent.model.types.get(typeID, "typeID");
    }else{
      this.type = null;
    }
    this.updateTypeDefaults();
    this.toggleFillGeometry();
  },
  renderTypeSelectView: function () {
    if(this.typeSelectView) {
      this.typeSelectView.remove();
    }
    if(this.types) {
      var options = this.types.map((type) => {
        return [type.typeID, type.name];
      });
    }else{
      var options = [];
    }
    this.typeSelectView = new SelectView({
      name: 'type',
      required: false,
      idAttribute: 'typeID',
      textAttribute: 'name',
      eagerValidate: true,
      options: options,
      unselectedText: "Select a Type"
    });
    app.registerRenderSubview(this, this.typeSelectView, "fill-geometry-type-select");
  },
  startAction: function () {
    $(this.queryByHook("fg-complete")).css("display", "none");
    $(this.queryByHook("fg-error")).css("display", "none");
    $(this.queryByHook("fg-in-progress")).css("display", "inline-block");
  },
  toggleFillGeometry: function () {
    $(this.queryByHook('fill-geometry')).prop('disabled', this.disable());
  },
  update: function() {},
  updateTypeDefaults: function () {
    $(this.queryByHook("fill-geometry-type-geometry")).text(this.type.geometry || "");
    $(this.queryByHook("fill-geometry-td-mass")).text(this.type.mass || "");
    $(this.queryByHook("fill-geometry-td-vol")).text(this.type.volume || "");
    $(this.queryByHook("fill-geometry-td-rho")).text(this.type.rho || "");
    $(this.queryByHook("fill-geometry-td-nu")).text(this.type.nu || "0");
    $(this.queryByHook("fill-geometry-td-c")).text(this.type.c || "");
    $(this.queryByHook("fill-geometry-td-fixed")).prop('checked', this.type.fixed || false);
  },
  updateValid: function () {},
  subviews: {
    xMinLimInputView: {
      hook: "fill-geometry-x-lim-min",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'x-lim-min',
          valueType: 'number',
          value: this.data.xmin
        });
      }
    },
    yMinLimInputView: {
      hook: "fill-geometry-y-lim-min",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'y-lim-min',
          valueType: 'number',
          value: this.data.ymin
        });
      }
    },
    zMinLimInputView: {
      hook: "fill-geometry-z-lim-min",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'z-lim-min',
          valueType: 'number',
          value: this.data.zmin
        });
      }
    },
    xMaxLimInputView: {
      hook: "fill-geometry-x-lim-max",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'x-lim-max',
          valueType: 'number',
          value: this.data.xmax
        });
      }
    },
    yMaxLimInputView: {
      hook: "fill-geometry-y-lim-max",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'y-lim-max',
          valueType: 'number',
          value: this.data.ymax
        });
      }
    },
    zMaxLimInputView: {
      hook: "fill-geometry-z-lim-max",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'z-lim-max',
          valueType: 'number',
          value: this.data.zmax
        });
      }
    },
    deltaxInputView: {
      hook: "fill-geometry-deltax",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'deltax',
          valueType: 'number',
          value: this.data.deltax
        });
      }
    },
    deltayInputView: {
      hook: "fill-geometry-deltay",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'deltay',
          valueType: 'number',
          value: this.data.deltay
        });
      }
    },
    deltazInputView: {
      hook: "fill-geometry-deltaz",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'deltaz',
          valueType: 'number',
          value: this.data.deltaz
        });
      }
    },
  }
});