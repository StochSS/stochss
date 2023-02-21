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
//support files
let app = require('../../app');
let Tooltips = require('../../tooltips');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
//templates
let template = require('../templates/propertiesView.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=collapse-domain-properties]' : 'changeCollapseButtonText',
    'change [data-hook=static-domain]' : 'setStaticDomain',
    'change [data-hook=density]' : 'setDensity',
    'change [data-target=gravity]' : 'setGravity',
    'change [data-hook=pressure]' : 'setPressure',
    'change [data-hook=speed]' : 'setSpeed'
  },
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.domainEditor;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('domain-properties-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('domain-properties-view-tab')).tab('show');
      $(this.queryByHook('edit-domain-properties')).removeClass('active');
      $(this.queryByHook('view-domain-properties')).addClass('active');
    }else{
      $(this.queryByHook("static-domain")).prop("checked", this.model.static);
      this.renderDensityInputView();
      this.renderXGravityInputView();
      this.renderYGravityInputView();
      this.renderZGravityInputView();
      this.renderPressureInputView();
      this.renderSpeedInputView();
    }
    $(this.queryByHook("view-static-domain")).prop("checked", this.model.static);
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderDensityInputView: function () {
    if(this.densityInputView) {
      this.densityInputView.remove();
    }
    this.densityInputView = new InputView({
      parent: this,
      required: true,
      name: 'density',
      valueType: 'number',
      value: this.model.rho_0 || 1
    });
    app.registerRenderSubview(this, this.densityInputView, "density");
  },
  renderPressureInputView: function () {
    if(this.pressureInputView) {
      this.pressureInputView.remove();
    }
    this.pressureInputView = new InputView({
      parent: this,
      required: true,
      name: 'pressure',
      valueType: 'number',
      value: this.model.p_0 || 0
    });
    app.registerRenderSubview(this, this.pressureInputView, "pressure");
  },
  renderSpeedInputView: function () {
    if(this.speedInputView) {
      this.speedInputView.remove();
    }
    this.speedInputView = new InputView({
      parent: this,
      required: true,
      name: 'speed',
      valueType: 'number', 
      value: this.model.c_0 || 0
    });
    app.registerRenderSubview(this, this.speedInputView, "speed");
  },
  renderXGravityInputView: function () {
    if(this.xGravityInputView) {
      this.xGravityInputView.remove();
    }
    this.xGravityInputView = new InputView({
      parent: this,
      required: true,
      name: 'gravity-x',
      valueType: 'number',
      value: this.model.gravity[0]
    });
    app.registerRenderSubview(this, this.xGravityInputView, "gravity-x");
  },
  renderYGravityInputView: function () {
    if(this.yGravityInputView) {
      this.yGravityInputView.remove();
    }
    this.yGravityInputView = new InputView({
      parent: this,
      required: true,
      name: 'gravity-y',
      valueType: 'number',
      value: this.model.gravity[1]
    });
    app.registerRenderSubview(this, this.yGravityInputView, "gravity-y");
  },
  renderZGravityInputView: function () {
    if(this.zGravityInputView) {
      this.zGravityInputView.remove();
    }
    this.zGravityInputView = new InputView({
      parent: this,
      required: true,
      name: 'gravity-z',
      valueType: 'number',
      value: this.model.gravity[2]
    });
    app.registerRenderSubview(this, this.zGravityInputView, "gravity-z");
  },
  setDensity: function (e) {
    this.model.rho_0 = Number(e.target.value);
    this.updateView();
  },
  setGravity: function (e) {
    let index = Number(e.target.parentElement.parentElement.dataset.index);
    this.model.gravity[index] = Number(e.target.value);
    this.updateView();
  },
  setPressure: function (e) {
    this.model.p_0 = Number(e.target.value);
    this.updateView();
  },
  setSpeed: function (e) {
    this.model.c_0 = Number(e.target.value);
    this.updateView();
  },
  setStaticDomain: function (e) {
    this.model.static = e.target.checked;
    this.updateView();
  },
  update: function (e) {},
  updateValid: function (e) {},
  updateView: function (e) {
    this.parent.renderPropertiesView();
  }
});