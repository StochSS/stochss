/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
var _ = require('underscore');
//support files
let app = require('../app');
var tests = require('../views/tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
//templates
var template = require('../templates/includes/editParticle.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-target=location]' : 'handleUpdateLocation',
    'change [data-target=mass]' : 'handleUpdateMass',
    'change [data-target=volume]' : 'handleUpdateVolume',
    'change [data-target=nu]' : 'handleUpdateNu',
    'change [data-target=fixed]' : 'handleUpdateFixed',
    'change [data-target=type]' : 'handleUpdateType',
    'click [data-hook=add-particle]' : 'handleAddParticle',
    'click [data-hook=save-particle]' : 'handleSaveParticle',
    'click [data-hook=remove-particle]' : 'handleRemoveParticle'
  },
  handleAddParticle: function (e) {
    this.startAction("Adding particle ...")
    this.parent.addParticle(this.model, {cb: _.bind(function () {
      this.completeAction("Particle Added")
    }, this)});
  },
  handleSaveParticle: function (e) {
    this.startAction("Saving particle ...")
    this.parent.updateParticle({cb: _.bind(function () {
      this.completeAction("Particle Saved")
    }, this)});
  },
  handleRemoveParticle: function (e) {
    this.parent.deleteParticle();
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
    this.model.pointChanged = true;
  },
  handleUpdateMass: function (e) {
    let value = Number(e.target.value);
    this.model.mass = value;
  },
  handleUpdateNu: function (e) {
    let value = Number(e.target.value);
    this.model.nu = value;
  },
  handleUpdateType: function (e) {
    let id = Number(e.target.selectedOptions.item(0).value);
    let oldType = this.parent.domain.types.get(this.model.type, "typeID");
    let newType = this.parent.domain.types.get(id, "typeID");
    if(this.model.mass === oldType.mass) {
      this.model.mass = newType.mass;
    }
    if(this.model.volume === oldType.volume) {
      this.model.volume = newType.volume;
    }
    if(this.model.nu === oldType.nu) {
      this.model.nu = newType.nu;
    }
    if(this.model.fixed === oldType.fixed) {
      this.model.fixed = newType.fixed;
    }
    this.renderProperties();
    this.model.type = id;
    this.model.typeChanged = true;
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
  completeAction: function (action) {
    $(this.queryByHook("ep-in-progress")).css("display", "none");
    $(this.queryByHook("ep-action-complete")).text(action);
    $(this.queryByHook("ep-complete")).css("display", "inline-block");
    console.log(action)
    let self = this
    setTimeout(function () {
      $(self.queryByHook("ep-complete")).css("display", "none");
    }, 5000);
  },
  disableAll: function () {
    $(this.queryByHook("x-coord-" + this.viewIndex)).find('input').prop('disabled', true);
    $(this.queryByHook("y-coord-" + this.viewIndex)).find('input').prop('disabled', true);
    $(this.queryByHook("z-coord-" + this.viewIndex)).find('input').prop('disabled', true);
    $(this.queryByHook("type-" + this.viewIndex)).find('select').prop('disabled', true);
    $(this.queryByHook("mass-" + this.viewIndex)).find('input').prop('disabled', true);
    $(this.queryByHook("volume-" + this.viewIndex)).find('input').prop('disabled', true);
    $(this.queryByHook("nu-" + this.viewIndex)).find('input').prop('disabled', true);
    $(this.queryByHook("fixed-" + this.viewIndex)).prop('disabled', true);
    $(this.queryByHook("save-particle")).prop('disabled', true);
    $(this.queryByHook("remove-particle")).prop('disabled', true);
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
    this.renderType();
    if(!this.newParticle && !this.parent.actPart.part) {
      $(this.queryByHook("select-message-" + this.viewIndex)).css('display', 'block')
      this.disableAll();
    }
  },
  renderLocation: function () {
    var xCoord = new InputView({parent: this, required: true,
                                name: 'x-coord', valueType: 'number',
                                value: this.model.point[0] || 0});
    app.registerRenderSubview(this, xCoord, "x-coord-" + this.viewIndex);
    var yCoord = new InputView({parent: this, required: true,
                                name: 'y-coord', valueType: 'number',
                                value: this.model.point[1] || 0});
    app.registerRenderSubview(this, yCoord, "y-coord-" + this.viewIndex);
    var zCoord = new InputView({parent: this, required: true,
                                name: 'z-coord', valueType: 'number',
                                value: this.model.point[2] || 0});
    app.registerRenderSubview(this, zCoord, "z-coord-" + this.viewIndex);
  },
  renderProperties: function () {
    if(this.massView) {
      this.massView.remove();
    }
    if(this.volView) {
      this.volView.remove();
    }
    if(this.nuView) {
      this.nuView.remove();
    }
    this.massView = new InputView({parent: this, required: true,
                                  name: 'mass', valueType: 'number',
                                  value: this.model.mass || this.type.mass});
    app.registerRenderSubview(this, this.massView, "mass-" + this.viewIndex);
    this.volView = new InputView({parent: this, required: true,
                                 name: 'volume', valueType: 'number',
                                 value: this.model.volume || this.type.volume});
    app.registerRenderSubview(this, this.volView, "volume-" + this.viewIndex);
    this.nuView = new InputView({parent: this, required: true,
                                name: 'viscosity', valueType: 'number',
                                value: this.model.nu || this.type.nu});
    app.registerRenderSubview(this, this.nuView, "nu-" + this.viewIndex);
    let fixed = this.model.fixed || this.type.fixed;
    $(this.queryByHook("fixed-" + this.viewIndex)).prop("checked", fixed);
  },
  renderType: function () {
    var typeView = new SelectView({
      label: '',
      name: 'type',
      required: true,
      idAttribute: 'typeID',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.parent.domain.types,
      value: this.parent.domain.types.get(this.model.type, "typeID")
    });
    app.registerRenderSubview(this, typeView, "type-" + this.viewIndex)
  },
  startAction: function (action) {
    $(this.queryByHook("ep-complete")).css("display", "none");
    $(this.queryByHook("ep-action-in-progress")).text(action);
    $(this.queryByHook("ep-in-progress")).css("display", "inline-block");
    console.log(action)
  },
  update: function (e) {},
  updateValid: function (e) {}
});