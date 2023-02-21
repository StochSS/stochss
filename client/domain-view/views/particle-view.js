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
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
//templates
let template = require('../templates/editParticleView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-target=new-point]' : 'setNewPoint',
    'change [data-hook=particle-type]' : 'setParticleType',
    'change [data-hook=particle-fixed]' : 'setParticleFixed'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewIndex = attrs.viewIndex;
    this.defaultType = attrs.defaultType;
    this.disable = attrs.disable ? attrs.disable : false;
    this.origType = this.model.typeID;
    this.origPoint = JSON.parse(JSON.stringify(this.model.point));
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderTypeSelectView();
    this.renderParticleProperties();
    $(this.queryByHook('particle-fixed')).prop('disabled', this.disable);
  },
  renderDensityPropertyView: function () {
    if(this.densityPropertyView) {
      this.densityPropertyView.remove();
    }
    this.densityPropertyView = new InputView({
      parent: this,
      required: true,
      name: 'density',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'rho',
      value: this.model.rho
    });
    let hook = "particle-rho";
    app.registerRenderSubview(this, this.densityPropertyView, hook);
  },
  renderMassPropertyView: function () {
    if(this.massPropertyView) {
      this.massPropertyView.remove();
    }
    this.massPropertyView = new InputView({
      parent: this,
      required: true,
      name: 'mass',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'mass',
      value: this.model.mass
    });
    let hook = "particle-mass";
    app.registerRenderSubview(this, this.massPropertyView, hook);
  },
  renderParticleProperties: function () {
    this.renderMassPropertyView();
    this.renderVolumePropertyView();
    this.renderDensityPropertyView();
    this.renderViscosityPropertyView();
    this.renderSOSPropertyView();
  },
  renderSOSPropertyView: function () {
    if(this.sOSPropertyView) {
      this.sOSPropertyView.remove();
    }
    this.sOSPropertyView = new InputView({
      parent: this,
      required: true,
      name: 'speed-of-sound',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'c',
      value: this.model.c
    });
    let hook = "particle-c";
    app.registerRenderSubview(this, this.sOSPropertyView, hook);
  },
  renderTypeSelectView: function () {
    if(this.typeSelectView) {
      this.typeSelectView.remove();
    }
    let options = this.parent.model.types.map((type) => {
      return [type.typeID, type.name];
    });
    this.typeSelectView = new SelectView({
      name: 'type',
      required: true,
      options: options,
      value: this.model.typeID,
    });
    let hook = "particle-type";
    app.registerRenderSubview(this, this.typeSelectView, hook);
    $(this.queryByHook(hook)).find('select').prop('disabled', this.disable);
  },
  renderViscosityPropertyView: function () {
    if(this.viscosityPropertyView) {
      this.viscosityPropertyView.remove();
    }
    this.viscosityPropertyView = new InputView({
      parent: this,
      required: true,
      name: 'viscosity',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'nu',
      value: this.model.nu
    });
    let hook = "particle-nu";
    app.registerRenderSubview(this, this.viscosityPropertyView, hook);
  },
  renderVolumePropertyView: function () {
    if(this.volumePropertyView) {
      this.volumePropertyView.remove();
    }
    this.volumePropertyView = new InputView({
      parent: this,
      required: true,
      name: 'volume',
      tests: tests.valueTests,
      valueType: 'number',
      modelKey: 'vol',
      value: this.model.vol
    });
    let hook = "particle-vol";
    app.registerRenderSubview(this, this.volumePropertyView, hook);
  },
  setNewPoint: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    let value = Number(e.target.value);
    this.model.newPoint[key] = value;
  },
  setParticleFixed: function (e) {
    this.model.fixed = !this.model.fixed;
  },
  setParticleType: function (e) {
    let value = Number(e.target.value);
    console.log(value);
    let currType = this.parent.model.types.get(this.model.typeID, "typeID");
    let newType = this.parent.model.types.get(value, "typeID");
    this.updatePropertyDefaults(currType, newType);
    this.model.typeID = value;
  },
  update: function (e) {},
  updatePropertyDefaults: function (currType, newType) {
    if(this.model.mass === currType.mass) {
      this.model.mass = newType.mass;
    }
    if(this.model.vol === currType.volume) {
      this.model.vol = newType.volume;
    }
    if(this.model.rho === currType.rho) {
      this.model.rho = newType.rho;
    }
    if(this.model.nu === currType.nu) {
      this.model.nu = newType.nu;
    }
    if(this.model.c === currType.c) {
      this.model.c = newType.c;
    }
    if(this.model.fixed === currType.fixed) {
      this.model.fixed = newType.fixed;
    }
    this.renderParticleProperties();
    $(this.queryByHook('particle-fixed')).prop('checked', this.model.fixed);
  },
  updateValid: function (e) {},
  subviews: {
    inputNewPointX: {
      hook: 'new-point-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'new-point-x',
          disabled: this.disable,
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.newPoint.x
        });
      }
    },
    inputNewPointY: {
      hook: 'new-point-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'new-point-y',
          disabled: this.disable,
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.newPoint.y
        });
      }
    },
    inputNewPointZ: {
      hook: 'new-point-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'new-point-z',
          disabled: this.disable,
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.newPoint.z
        });
      }
    }
  }
});