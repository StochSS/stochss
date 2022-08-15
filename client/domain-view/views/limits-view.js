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
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
//templates
let template = require('../templates/limitsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-domain-limits]' : 'changeCollapseButtonText',
    'change [data-target=limitation]' : 'setLimitation',
    'change [data-target=reflect]' : 'setBoundaryCondition'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook('domain-limits-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook('domain-limits-view-tab')).tab('show');
      $(this.queryByHook('edit-domain-limits')).removeClass('active');
      $(this.queryByHook('view-domain-limits')).addClass('active');
    }else{
      this.renderXMinLimitInputView();
      this.renderYMinLimitInputView();
      this.renderZMinLimitInputView();
      this.renderXMaxLimitInputView();
      this.renderYMaxLimitInputView();
      this.renderZMaxLimitInputView();
      $(this.queryByHook("reflect_x")).prop("checked", this.model.boundary_condition.reflect_x);
      $(this.queryByHook("reflect_y")).prop("checked", this.model.boundary_condition.reflect_y);
      $(this.queryByHook("reflect_z")).prop("checked", this.model.boundary_condition.reflect_z);
    }
    $(this.queryByHook("view-reflect_x")).prop("checked", this.model.boundary_condition.reflect_x);
    $(this.queryByHook("view-reflect_y")).prop("checked", this.model.boundary_condition.reflect_y);
    $(this.queryByHook("view-reflect_z")).prop("checked", this.model.boundary_condition.reflect_z);
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  renderXMinLimitInputView: function () {
    if(this.xMinLimitInputView) {
      this.xMinLimitInputView.remove();
    }
    this.xMinLimitInputView = new InputView({
      parent: this,
      required: true,
      name: 'x-lim-min',
      valueType: 'number',
      value: this.model.x_lim[0] || 0
    });
    app.registerRenderSubview(this, this.xMinLimitInputView, "x-lim-min");
  },
  renderYMinLimitInputView: function () {
    if(this.yMinLimitInputView) {
      this.yMinLimitInputView.remove();
    }
    this.yMinLimitInputView = new InputView({
      parent: this,
      required: true,
      name: 'y-lim-min',
      valueType: 'number',
      value: this.model.y_lim[0] || 0
    });
    app.registerRenderSubview(this, this.yMinLimitInputView, "y-lim-min");
  },
  renderZMinLimitInputView: function () {
    if(this.zMinLimitInputView) {
      this.zMinLimitInputView.remove();
    }
    this.zMinLimitInputView = new InputView({
      parent: this,
      required: true,
      name: 'z-lim-min',
      valueType: 'number',
      value: this.model.z_lim[0] || 0
    });
    app.registerRenderSubview(this, this.zMinLimitInputView, "z-lim-min");
  },
  renderXMaxLimitInputView: function () {
    if(this.xMaxLimitInputView) {
      this.xMaxLimitInputView.remove();
    }
    this.xMaxLimitInputView = new InputView({
      parent: this,
      required: true,
      name: 'x-lim-max',
      valueType: 'number',
      value: this.model.x_lim[1] || 0
    });
    app.registerRenderSubview(this, this.xMaxLimitInputView, "x-lim-max");
  },
  renderYMaxLimitInputView: function () {
    if(this.yMaxLimitInputView) {
      this.yMaxLimitInputView.remove();
    }
    this.yMaxLimitInputView = new InputView({
      parent: this,
      required: true,
      name: 'y-lim-max',
      valueType: 'number',
      value: this.model.y_lim[1] || 0
    });
    app.registerRenderSubview(this, this.yMaxLimitInputView, "y-lim-max");
  },
  renderZMaxLimitInputView: function () {
    if(this.zMaxLimitInputView) {
      this.zMaxLimitInputView.remove();
    }
    this.zMaxLimitInputView = new InputView({
      parent: this,
      required: true,
      name: 'z-lim-max',
      valueType: 'number',
      value: this.model.z_lim[1] || 0
    });
    app.registerRenderSubview(this, this.zMaxLimitInputView, "z-lim-max");
  },
  setBoundaryCondition: function (e) {
    let key = e.target.dataset.hook;
    this.model.boundary_condition[key] = e.target.checked;
    this.updateView();
  },
  setLimitation: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    let index = Number(e.target.parentElement.parentElement.dataset.index);
    this.model[key][index] = Number(e.target.value.trim());
    this.updateView();
  },
  update: function () {},
  updateValid: function () {},
  updateView: function () {
    this.parent.renderLimitsView();
  }
});
