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

var $ = require('jquery');
//support files
var tests = require('../views/tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
//templates
var template = require('../templates/includes/editParticle.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-target=location]' : 'handleUpdateLocation',
    'change [data-target=mass]' : 'handleUpdateMass',
    'change [data-target=volume]' : 'handleUpdateVolume',
    'change [data-target=nu]' : 'handleUpdateNu',
    'change [data-target=fixed]' : 'handleUpdateFixed'
  },
  handleUpdateFixed: function (e) {
    let value = e.target.checked;
    this.model.fixed = value;
  },
  handleUpdateLocation: function (e) {
    let hook = e.target.parentElement.parentElement.dataset.hook;
    let value = Number(e.target.value);
    if(hook.startsWith('x')) {
      this.model.point[0] = value;
    }else if(hook.startsWith('y')) {
      this.model.point[1] = value;
    }else{
      this.model.point[2] = value;
    }
  },
  handleUpdateMass: function (e) {
    let value = Number(e.target.value);
    this.model.mass = value;
  },
  handleUpdateNu: function (e) {
    let value = Number(e.target.value);
    this.model.nu = value;
  },
  handleUpdateVolume: function (e) {
    let value = Number(e.target.value);
    this.model.volume = value;
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.newParticle = attrs.newParticle;
    this.viewIndex = this.newParticle ? 0 : 1;
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    return this.renderSubview(view, this.queryByHook(hook));
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.type = this.parent.domain.types.get(this.model.type, "typeID");
    if(this.newParticle) {
      $(this.queryByHook("edit-particle-btns-"+this.viewIndex)).css("display", "none");
    }else{
      $(this.queryByHook("new-particle-btns-"+this.viewIndex)).css("display", "none");
    }
    this.renderLocation();
    this.renderProperties();
  },
  renderLocation: function () {
    var xCoord = new InputView({parent: this, required: true,
                                name: 'x-coord', valueType: 'number',
                                value: this.model.point[0] || 0});
    this.registerRenderSubview(xCoord, "x-coord-" + this.viewIndex);
    var yCoord = new InputView({parent: this, required: true,
                                name: 'y-coord', valueType: 'number',
                                value: this.model.point[1] || 0});
    this.registerRenderSubview(yCoord, "y-coord-" + this.viewIndex);
    var zCoord = new InputView({parent: this, required: true,
                                name: 'z-coord', valueType: 'number',
                                value: this.model.point[2] || 0});
    this.registerRenderSubview(zCoord, "z-coord-" + this.viewIndex);
  },
  renderProperties: function () {
    var massView = new InputView({parent: this, required: true,
                                  name: 'mass', valueType: 'number',
                                  value: this.model.mass || this.type.mass});
    this.registerRenderSubview(massView, "mass-" + this.viewIndex);
    var volView = new InputView({parent: this, required: true,
                                 name: 'volume', valueType: 'number',
                                 value: this.model.volume || this.type.volume});
    this.registerRenderSubview(volView, "volume-" + this.viewIndex);
    var nuView = new InputView({parent: this, required: true,
                                name: 'viscosity', valueType: 'number',
                                value: this.model.nu || this.type.nu});
    this.registerRenderSubview(nuView, "nu-" + this.viewIndex);
    let fixed = this.model.fixed || this.type.fixed;
    $(this.queryByHook("fixed-" + this.viewIndex)).prop("checked", fixed);
  },
  update: function (e) {},
  updateValid: function (e) {}
});