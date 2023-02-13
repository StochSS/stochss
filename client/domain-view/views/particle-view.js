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
//support files
let app = require('../../app');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/editParticleView.pug');

module.exports = View.extend({
  template: template,
  events: function () {
    let events = {};
    events[`change [data-hook=particle-type-${this.viewIndex}]`] = 'handleSelectType';
    events[`change [data-target=location-${this.viewIndex}]`] = 'handleUpdateLocation';
    events[`change [data-hook=particle-fixed=${this.viewIndex}]`] = 'handleUpdateFixed';
    return events;
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewIndex = attrs.viewIndex;
    this.defaultType = attrs.defaultType;
    this.disable = attrs.disable ? attrs.disable : false;
    this.origType = this.model.type;
    this.origPoint = JSON.parse(JSON.stringify(this.model.point));
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderTypeSelectView();
    this.renderParticleProperties();
    this.renderXCoordView();
    this.renderYCoordView();
    this.renderZCoordView();
  },
  handleSelectType: function (e) {
    this.defaultType = this.parent.model.types.get(this.model.type, "typeID")
    this.model.type = Number(e.target.value);
    let type = this.parent.model.types.get(this.model.type, "typeID")
    if(this.model.mass === this.defaultType.mass) {
      this.model.mass = type.mass;
    }
    if(this.model.volume === this.defaultType.volume) {
      this.model.volume = type.volume;
    }
    if(this.model.rho === this.defaultType.rho) {
      this.model.rho = type.rho;
    }
    if(this.model.nu === this.defaultType.nu) {
      this.model.nu = type.nu;
    }
    if(this.model.c === this.defaultType.c) {
      this.model.c = type.c;
    }
    if(this.model.fixed === this.defaultType.fixed) {
      this.model.fixed = type.fixed;
    }
    this.renderParticleProperties();
  },
  handleUpdateFixed: function (e) {
    this.model.fixed = e.target.checked;
  },
  handleUpdateLocation: function (e) {
    let index = Number(e.target.parentElement.parentElement.dataset.index);
    this.model.point[index] = Number(e.target.value);
  },
  renderCInputView: function () {
    if(this.cInputView) {
      this.cInputView.remove();
    }
    this.cInputView = new InputView({
      parent: this,
      required: true,
      name: 'speed-of-sound',
      disabled: this.disable,
      modelKey: 'c',
      valueType: 'number',
      value: this.model.c
    });
    app.registerRenderSubview(this, this.cInputView, `particle-c-${this.viewIndex}`);
  },
  renderParticleProperties: function () {
    this.renderCInputView();
    this.renderMassInputView();
    this.renderNuInputView();
    this.renderRhoInputView();
    this.renderVolumeInputView();
    $(this.queryByHook(`particle-fixed-${this.viewIndex}`)).prop('checked', this.model.fixed);
    $(this.queryByHook(`particle-fixed-${this.viewIndex}`)).prop('disabled', this.disable);
  },
  renderMassInputView: function () {
    if(this.massInputView) {
      this.massInputView.remove();
    }
    this.massInputView = new InputView({
      parent: this,
      required: true,
      name: 'mass',
      disabled: this.disable,
      modelKey: 'mass',
      valueType: 'number',
      value: this.model.mass
    });
    app.registerRenderSubview(this, this.massInputView, `particle-mass-${this.viewIndex}`);
  },
  renderNuInputView: function () {
    if(this.nuInputView) {
      this.nuInputView.remove();
    }
    this.nuInputView = new InputView({
      parent: this,
      required: true,
      name: 'viscosity',
      disabled: this.disable,
      modelKey: 'nu',
      valueType: 'number',
      value: this.model.nu
    });
    app.registerRenderSubview(this, this.nuInputView, `particle-nu-${this.viewIndex}`);
  },
  renderRhoInputView: function () {
    if(this.rhoInputView) {
      this.rhoInputView.remove();
    }
    this.rhoInputView = new InputView({
      parent: this,
      required: true,
      name: 'density',
      disabled: this.disable,
      modelKey: 'rho',
      valueType: 'number',
      value: this.model.rho
    });
    app.registerRenderSubview(this, this.rhoInputView, `particle-rho-${this.viewIndex}`);
  },
  renderTypeSelectView: function () {
    if(this.typeSelectView) {
      this.typeSelectView.remove();
    }
    this.typeSelectView = new SelectView({
      name: 'type',
      required: true,
      idAttribute: 'typeID',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.parent.model.types,
      value: this.parent.model.types.get(this.model.type, "typeID")
    });
    app.registerRenderSubview(this, this.typeSelectView, `particle-type-${this.viewIndex}`)
    $(this.queryByHook(`particle-type-${this.viewIndex}`)).find('select').prop('disabled', this.disable);
  },
  renderVolumeInputView: function () {
    if(this.volumeInputView) {
      this.volumeInputView.remove();
    }
    this.volumeInputView = new InputView({
      parent: this,
      required: true,
      name: 'volume',
      disabled: this.disable,
      modelKey: 'volume',
      valueType: 'number',
      value: this.model.volume
    });
    app.registerRenderSubview(this, this.volumeInputView, `particle-vol-${this.viewIndex}`);
  },
  renderXCoordView: function () {
    if(this.xCoordView) {
      this.xCoordView.remove();
    }
    this.xCoordView = new InputView({
      parent: this,
      required: true,
      name: 'x-coord',
      disabled: this.disable,
      valueType: 'number',
      value: this.model.point[0]
    });
    app.registerRenderSubview(this, this.xCoordView, `x-coord-${this.viewIndex}`);
  },
  renderYCoordView: function () {
    if(this.yCoordView) {
      this.yCoordView.remove();
    }
    this.yCoordView = new InputView({
      parent: this,
      required: true,
      name: 'y-coord',
      disabled: this.disable,
      valueType: 'number',
      value: this.model.point[1]
    });
    app.registerRenderSubview(this, this.yCoordView, `y-coord-${this.viewIndex}`);
  },
  renderZCoordView: function () {
    if(this.zCoordView) {
      this.zCoordView.remove();
    }
    this.zCoordView = new InputView({
      parent: this,
      required: true,
      name: 'z-coord',
      disabled: this.disable,
      valueType: 'number',
      value: this.model.point[2]
    });
    app.registerRenderSubview(this, this.zCoordView, `z-coord-${this.viewIndex}`);
  },
  update: function (e) {},
  updateValid: function (e) {}
});