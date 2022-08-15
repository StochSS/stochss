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
let template = require('../templates/importMeshView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change #meshfile' : 'setMeshFile',
    'change #typefile' : 'setTypeFile',
    'change [data-hook=import-mesh-type-select]' : 'handleTypeUpdate',
    'change [data-target=import-mesh-trans]' : 'handleTransformationUpdate',
    'click [data-hook=collapse-import-mesh-advanced]' : 'changeCollapseButtonText',
    'click [data-hook=import-mesh-particles]' : 'handleImportMesh'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.meshFile = null;
    this.typeFile = null;
    this.data = {"type": null, "transformation": null};
    this.transformation = [0, 0, 0];
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.type = this.parent.model.types.get(0, "typeID");
    this.updateTypeDefaults();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  completeAction: function () {
    $(this.queryByHook("imp-in-progress")).css("display", "none");
    $(this.queryByHook("imp-complete")).css("display", "inline-block");
    setTimeout(() => {
      $(this.queryByHook("imp-complete")).css("display", "none");
    }, 5000);
  },
  errorAction: function (action) {
    $(this.queryByHook("imp-in-progress")).css("display", "none");
    $(this.queryByHook("imp-action-error")).text(action);
    $(this.queryByHook("imp-error")).css("display", "block");
  },
  handleImportMesh: function () {
    this.startAction();
    this.transformation.every((value) => {
      if(value !== 0) {
        this.data.transformation = this.transformation;
        return false;
      }
      return true;
    });
    let formData = new FormData();
    formData.append("datafile", this.meshFile);
    formData.append("particleData", JSON.stringify(this.data));
    if(this.typeFile) {
      formData.append("typefile", this.typeFile);
    }
    let endpoint = path.join(app.getApiPath(), 'spatial-model/import-mesh');
    app.postXHR(endpoint, formData, {
      success: (err, response, body) => {
        body = JSON.parse(body);
        this.parent.addMeshDomain(body.limits, body.particles, body.types, this.parent.model.particles.length > 0);
        this.completeAction();
        $('html, body').animate({
            scrollTop: $("#domain-figure").offset().top
        }, 20);
      },
      error: (err, response, body) => {
        body = JSON.parse(body);
        this.errorAction(body.Message);
      }
    }, false);
  },
  handleTransformationUpdate: function (e) {
    let index = e.target.parentElement.parentElement.dataset.index;
    this.transformation[index] = Number(e.target.value);
  },
  handleTypeUpdate: function (e) {
    let typeID = Number(e.target.value);
    this.type = this.parent.model.types.get(typeID, "typeID");
    this.updateTypeDefaults();
  },
  setMeshFile: function (e) {
    this.meshFile = e.target.files[0];
    $(this.queryByHook("import-mesh-particles")).prop('disabled', !this.meshFile);
  },
  setTypeFile: function (e) {
    this.typeFile = e.target.files[0];
  },
  startAction: function () {
    $(this.queryByHook("imp-complete")).css("display", "none");
    $(this.queryByHook("imp-error")).css("display", "none");
    $(this.queryByHook("imp-in-progress")).css("display", "inline-block");
  },
  update: function () {},
  updateValid: function () {},
  updateTypeDefaults: function () {
    this.data.typeID = this.type.typeID;
    this.data.type = {
      "type_id": this.type.name, "mass": this.type.mass, "rho": this.type.rho, 
      "nu": this.type.nu, "c": this.type.c, "fixed": this.type.fixed
    }
    $(this.queryByHook("import-mesh-td-mass")).text(this.type.mass);
    $(this.queryByHook("import-mesh-td-vol")).text(this.type.volume);
    $(this.queryByHook("import-mesh-td-rho")).text(this.type.rho);
    $(this.queryByHook("import-mesh-td-nu")).text(this.type.nu);
    $(this.queryByHook("import-mesh-td-c")).text(this.type.c);
    $(this.queryByHook("import-mesh-td-fixed")).prop('checked', this.type.fixed);
  },
  subviews: {
    typeSelectView: {
      hook: "import-mesh-type-select",
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
      hook: "import-mesh-x-trans",
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
      hook: "import-mesh-y-trans",
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
      hook: "import-mesh-z-trans",
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