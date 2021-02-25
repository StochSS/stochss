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
var path = require('path');
//support files
var app = require('../app');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
//templates
var template = require('../templates/includes/edit3DDomain.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-target=num-particles]' : 'handleNumParticlesUpdate',
    'change [data-target=limits]' : 'handleLimitsUpdate',
    'change [data-hook=type-select]' : 'updateTypeAndDefaults',
    'click [data-hook=build-domain]' : 'handleBuildDomain'
  },
  handleBuildDomain: function (e) {
    this.data.type = {"type_id":this.type.typeID, "mass":this.type.mass, "nu":this.type.nu, "fixed":this.type.fixed};
    this.data.volume = this.type.volume;
    let xtrans = Number($(this.queryByHook("domain-x-trans")).find('input')[0].value);
    let ytrans = Number($(this.queryByHook("domain-y-trans")).find('input')[0].value);
    let ztrans = Number($(this.queryByHook("domain-z-trans")).find('input')[0].value);
    if(xtrans !== 0 || ytrans !== 0 || ztrans !== 0) {
      this.data.transformation = [xtrans, ytrans, ztrans];
    }
    let self = this;
    let endpoint = path.join(app.getApiPath(), "spatial-model/3d-domain");
    xhr({uri: endpoint, json: true, method: "post", body: this.data}, function (err, resp, body) {
      if(resp.statusCode < 400) {
        self.parent.addParticles(body.particles);
      }
    });
  },
  handleLimitsUpdate: function (e) {
    let data = e.target.parentElement.parentElement.dataset.hook.split("-");
    let index = data[1] === "min" ? 0 : 1;
    let value = Number(e.target.value);
    this.data[data[0]][index] = value;
  },
  handleNumParticlesUpdate: function (e) {
    let hook = e.target.parentElement.parentElement.dataset.hook;
    let value = Number(e.target.value);
    this.data[hook] = value;
    this.updateTotalParticles();
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.type = this.model.types.get(0, "typeID");
    this.data = {"nx":1, "ny":1, "nz":1, "xLim":[0, 0],
                 "yLim":[0, 0], "zLim":[0, 0], "type":0, "volume":1,
                 "transformation": null}
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    return this.renderSubview(view, this.queryByHook(hook));
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderNumberOfParticles();
    this.updateTotalParticles();
    this.renderParticleLimits();
    this.renderType();
    this.renderTypeDefaults();
    this.renderDomainTransformations();
  },
  renderDomainTransformations: function () {
    let xtrans = new InputView({parent: this, required: true,
                                name: 'x-transformation', valueType: 'number',
                                value: 0});
    this.registerRenderSubview(xtrans, "domain-x-trans");
    let ytrans = new InputView({parent: this, required: true,
                                name: 'y-transformation', valueType: 'number',
                                value: 0});
    this.registerRenderSubview(ytrans, "domain-y-trans");
    let ztrans = new InputView({parent: this, required: true,
                                name: 'z-transformation', valueType: 'number',
                                value: 0});
    this.registerRenderSubview(ztrans, "domain-z-trans");
  },
  renderNumberOfParticles: function () {
    let nxView = new InputView({parent: this, required: true,
                                name: 'nx', valueType: 'number',
                                tests: tests.valueTests,
                                value: this.data.nx});
    this.registerRenderSubview(nxView, "nx");
    let nyView = new InputView({parent: this, required: true,
                                name: 'ny', valueType: 'number',
                                tests: tests.valueTests,
                                value: this.data.ny});
    this.registerRenderSubview(nyView, "ny");
    let nzView = new InputView({parent: this, required: true,
                                name: 'nz', valueType: 'number',
                                tests: tests.valueTests,
                                value: this.data.nz});
    this.registerRenderSubview(nzView, "nz");
  },
  renderParticleLimits: function () {
    let xLimMinView = new InputView({parent: this, required: true,
                                name: 'x-lim-min', valueType: 'number',
                                value: this.data.xLim[0]});
    this.registerRenderSubview(xLimMinView, "xLim-min");
    let yLimMinView = new InputView({parent: this, required: true,
                                name: 'y-lim-min', valueType: 'number',
                                value: this.data.yLim[0]});
    this.registerRenderSubview(yLimMinView, "yLim-min");
    let zLimMinView = new InputView({parent: this, required: true,
                                name: 'z-lim-min', valueType: 'number',
                                value: this.data.zLim[0]});
    this.registerRenderSubview(zLimMinView, "zLim-min");
    let xLimMaxView = new InputView({parent: this, required: true,
                                name: 'x-lim-max', valueType: 'number',
                                value: this.data.xLim[1]});
    this.registerRenderSubview(xLimMaxView, "xLim-max");
    let yLimMaxView = new InputView({parent: this, required: true,
                                name: 'y-lim-max', valueType: 'number',
                                value: this.data.yLim[1]});
    this.registerRenderSubview(yLimMaxView, "yLim-max");
    let zLimMaxView = new InputView({parent: this, required: true,
                                name: 'z-lim-max', valueType: 'number',
                                value: this.data.zLim[1]});
    this.registerRenderSubview(zLimMaxView, "zLim-max");
  },
  renderType: function () {
    var typeView = new SelectView({
      label: 'Type:  ',
      name: 'type',
      required: true,
      idAttribute: 'typeID',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.model.types,
      value: this.type
    });
    this.registerRenderSubview(typeView, "type-select")
  },
  renderTypeDefaults: function () {
    $(this.queryByHook("mass")).text(this.type.mass)
    $(this.queryByHook("volume")).text(this.type.volume)
    $(this.queryByHook("nu")).text(this.type.nu)
    $(this.queryByHook("fixed")).prop("checked", this.type.fixed)
  },
  update: function (e) {},
  updateTotalParticles: function (e) {
    let total = this.data.nx * this.data.ny * this.data.nz;
    $(this.queryByHook("total")).text(total)
    $(this.queryByHook("build-domain")).prop("disabled", total <= 0)
  },
  updateTypeAndDefaults: function (e) {
    let id = Number(e.target.selectedOptions.item(0).value);
    this.type = this.model.types.get(id, "typeID");
    this.renderTypeDefaults();
  },
  updateValid: function (e) {}
});