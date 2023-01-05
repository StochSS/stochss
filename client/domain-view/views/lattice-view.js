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
let _ = require('underscore');
//support files
let app = require('../../app');
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
//templates
let editTemplate = require('../templates/editLattice.pug');
let viewTemplate = require('../templates/viewLattice.pug');

module.exports = View.extend({
  bindings: {
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select-lattice'
    },
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    }
  },
  events: {
    'change [data-hook=input-name-container]' : 'updateFileHeaders',
    'change [data-hook=select-type-container]' : 'selectLatticeType',
    'change [data-target=lattice-center]' : 'handleSetCenter',
    'change [data-hook=mesh-file]' : 'setMeshFile',
    'change [data-hook=type-file]' : 'setTypeFile',
    'change [data-hook=lattice-mesh-select]' : 'selectMeshFile',
    'change [data-hook=mesh-location-select]' : 'selectMeshLocation',
    'change [data-hook=lattice-type-select]' : 'selectTypeFile',
    'change [data-hook=type-location-select]' : 'selectFileLocation',
    'click [data-hook=select-lattice]' : 'selectLattice',
    'click [data-hook=remove]' : 'removeLattice',
    'click [data-hook=collapseImportFiles]' : 'toggleImportFiles',
    'click [data-hook=collapseUploadedFiles]' : 'toggleUploadedFiles',
    'click [data-hook=import-mesh-file]' : 'handleImportMesh'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
    this.chevrons = {
      hide: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512">
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
        </svg>
      `,
      show: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512">
          <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>
        </svg>
      `
    }
    this.accepts = {"XML Mesh Lattice": ".xml", "Mesh IO Lattice": ".msh", "StochSS Lattice": ".domn"};
    this.accept = Object.keys(this.accepts).includes(this.model.type) ? this.accepts[this.model.type] : null;
    this.filetype = this.model.type === "StochSS Lattice" ? 'domain' : 'mesh';
    this.meshFile = null;
    this.typeFile = null;
  },
  render: function () {
    this.template = this.viewMode ? viewTemplate : editTemplate;
    View.prototype.render.apply(this, arguments);
    this.details = {
      'Cartesian Lattice': [
        $(this.queryByHook('cartesian-lattice-props'))
      ],
      'Spherical Lattice': [
        $(this.queryByHook('circular-lattice-props'))
      ],
      'Cylindrical Lattice': [
        $(this.queryByHook('circular-lattice-props')),
        $(this.queryByHook('cylinder-length-header')),
        $(this.queryByHook('cylinder-length-feild'))
      ],
      'XML Mesh Lattice': [
        $(this.queryByHook('file-lattice-props')),
        $(this.queryByHook('type-descriptions-prop'))
      ],
      'Mesh IO Lattice': [
        $(this.queryByHook('file-lattice-props')),
        $(this.queryByHook('type-descriptions-prop'))
      ],
      'StochSS Lattice': [
        $(this.queryByHook('file-lattice-props'))
      ]
    }
    app.documentSetup();
    if(!this.viewMode){
      if(this.model.selected) {
        setTimeout(_.bind(this.openDetails, this), 1);
      }
      this.model.on('change', _.bind(this.updateViewer, this));
      if(Object.keys(this.accepts).includes(this.model.type)) {
        this.meshFiles = null;
        this.typeFiles = null;
        this.renderLatticeFileSelects();
      }
    }
    this.displayDetails();
  },
  completeAction: function () {
    $(this.queryByHook("imf-in-progress")).css("display", "none");
    $(this.queryByHook("imf-complete")).css("display", "inline-block");
    setTimeout(() => {
      $(this.queryByHook("imf-complete")).css("display", "none");
    }, 5000);
  },
  displayDetails: function () {
    this.details[this.model.type].forEach((element) => {
      element.css('display', 'block');
    });
  },
  errorAction: function (action) {
    $(this.queryByHook("imf-in-progress")).css("display", "none");
    $(this.queryByHook("imf-action-error")).text(action);
    $(this.queryByHook("imf-error")).css("display", "block");
  },
  handleImportMesh: function () {
    this.startAction();
    let formData = new FormData();
    var filePath = this.model.collection.parent.directory;
    if(filePath === null) {
      filePath = this.parent.parent.parent.model.directory;
    }
    formData.append("path", filePath);
    formData.append("datafile", this.meshFile);
    if(this.typeFile) {
      formData.append("typefile", this.typeFile);
    }
    let endpoint = path.join(app.getApiPath(), 'spatial-model/import-mesh');
    app.postXHR(endpoint, formData, {
      success: (err, response, body) => {
        body = JSON.parse(body);
        this.model.filename = path.join(body.meshPath, body.meshFile);
        if(Object.keys(body).includes("typesPath")) {
          this.model.subdomainFile = path.join(body.typesPath, body.typesFile);
          this.typeFiles = null;
        }
        this.completeAction();
        $(this.queryByHook('collapseUploadedFiles')).click();
        this.renderLatticeFileSelects();
      },
      error: (err, response, body) => {
        body = JSON.parse(body);
        this.errorAction(body.Message);
      }
    }, false);
  },
  handleSetCenter: function (e) {
    let key = e.target.parentElement.parentElement.dataset.name;
    this.model.center[key] = Number(e.target.value);
    this.model.trigger('change');
  },
  hideDetails: function () {
    this.details[this.model.type].forEach((element) => {
      element.css('display', 'none');
    });
  },
  openDetails: function () {
    $("#collapse-lattice-details" + this.model.cid).collapse("show");
  },
  removeLattice: function () {
    let name = this.model.name;
    let actions = this.model.collection.parent.actions;
    this.collection.removeLattice(this.model);
    actions.trigger('update-lattice-options', {currName: name});
  },
  renderLatticeFileSelects: function () {
    var queryStr = `?ext=${this.accept}`;
    if(this.typeFiles === null) {
      queryStr += `${queryStr}&includeTypes=True`;
    }
    let endpoint = `${path.join(app.getApiPath(), 'spatial-model/lattice-files')}${queryStr}`;
    app.getXHR(endpoint, {success: (err, response, body) => {
      this.meshFiles = body.meshFiles;
      this.renderMeshSelectView();
      if(Object.keys(body).includes('typeFiles')) {
        this.typeFiles = body.typeFiles;
        this.renderTypeSelectView();
      }
    }});
  },
  renderMeshSelectView: function () {
    if(this.meshSelectView) {
      this.meshSelectView.remove();
    }
    let files = this.meshFiles.files.filter((file) => {
      if(file[1] === this.model.filename.split('/').pop()) {
        return file;
      }
    });
    let value = files.length > 0 ? files[0] : "";
    this.meshSelectView = new SelectView({
      name: 'mesh-files',
      required: false,
      idAttributes: 'cid',
      options: this.meshFiles.files,
      value: value,
      unselectedText: "-- Select Mesh File --"
    });
    let hook = "lattice-mesh-select";
    app.registerRenderSubview(this, this.meshSelectView, hook);
    if(value !== "" && this.meshFiles.paths[value[0]].length > 1) {
      this.renderMeshLocationSelectView(value[0]);
      $(this.queryByHook("mesh-location-container")).css("display", "inline-block");
    }
  },
  renderMeshLocationSelectView: function (index) {
    if(this.meshLocationSelectView) {
      this.meshLocationSelectView.remove();
    }
    let value = Boolean(this.model.filename) ? this.model.filename : "";
    this.meshLocationSelectView = new SelectView({
      name: 'mesh-locations',
      required: false,
      idAttributes: 'cid',
      options: this.meshFiles.paths[index],
      value: value,
      unselectedText: "-- Select Mesh File Location --"
    });
    let hook = "mesh-location-select";
    app.registerRenderSubview(this, this.meshLocationSelectView, hook);
  },
  renderTypeSelectView: function () {
    if(this.typeSelectView) {
      this.typeSelectView.remove();
    }
    var file = this.typeFiles.files.filter((file) => {
      if(file[1] === this.model.subdomainFile.split('/').pop()) {
        return file;
      }
    });
    let value = file.length > 0 ? file[0] : "";
    this.typeSelectView = new SelectView({
      name: 'type-files',
      required: false,
      idAttributes: 'cid',
      options: this.typeFiles.files,
      value: value,
      unselectedText: "-- Select Type File --"
    });
    let hook = "lattice-type-select";
    app.registerRenderSubview(this, this.typeSelectView, hook);
    if(value !== "" && this.typeFiles.paths[value[0]].length > 1) {
      this.renderTypeLocationSelectView(value[0]);
      $(this.queryByHook("types-location-container")).css("display", "inline-block");
    }
  },
  renderTypeLocationSelectView: function (index) {
    if(this.typeLocationSelectView) {
      this.typeLocationSelectView.remove();
    }
    let value = Boolean(this.model.subdomainFile) ? this.model.subdomainFile : "";
    this.typeLocationSelectView = new SelectView({
      name: 'type-locations',
      required: false,
      idAttributes: 'cid',
      options: this.typeFiles.paths[index],
      value: value,
      unselectedText: "-- Select Type File Location --"
    });
    let hook = "type-location-select";
    app.registerRenderSubview(this, this.typeLocationSelectView, hook);
  },
  selectLattice: function () {
    this.model.selected = !this.model.selected;
  },
  selectLatticeType: function (e) {
    this.hideDetails();
    this.model.type = e.target.value;
    this.displayDetails();

    let types = {
      'XML Mesh Lattice': '.xml', 'Mesh IO Lattice': '.msh', 'StochSS Lattice': '.domn'
    };
    if(Object.keys(types).includes(this.model.type)) {
      this.accept = types[this.model.type]
      $(this.queryByHook('mesh-file')).prop('accept', this.accept);
      this.filetype = this.model.type === "StochSS Lattice" ? 'domain' : 'mesh';
      $(this.queryByHook('meshfile-label')).text(`Please specify a ${this.filetype} to import: `);
      $(this.queryByHook('lattice-filename-label')).text(`Please specify a ${this.filetype} to import: `);
      $(this.queryByHook('mesh-location-message')).text(
        `There are multiple ${this.filetype} files with that name, please select a location`
      );
      this.renderLatticeFileSelects();
    }
  },
  selectMeshFile: function (e) {
    let value = e.target.value;
    var msgDisplay = "none";
    var contDisplay = "none";
    if(value) {
      if(this.meshFiles.paths[value].length > 1) {
        msgDisplay = "block";
        contDisplay = "inline-block";
        this.renderMeshLocationSelectView(value);
        this.model.filename = "";
      }else{
        this.model.filename = this.meshFiles.paths[value][0];
      }
    }else{
      this.model.filename = "";
    }
    $(this.queryByHook("mesh-location-message")).css('display', msgDisplay);
    $(this.queryByHook("mesh-location-container")).css("display", contDisplay);
  },
  selectMeshLocation: function (e) {
    this.model.filename = e.target.value ? e.target.value : "";
  },
  selectTypeFile: function (e) {
    let value = e.target.value;
    var msgDisplay = "none";
    var contDisplay = "none";
    if(value) {
      if(this.typeFiles.paths[value].length > 1) {
        msgDisplay = "block";
        contDisplay = "inline-block";
        this.renderMeshLocationSelectView(value);
        this.model.subdomainFile = "";
      }else{
        this.model.subdomainFile = this.typeFiles.paths[value][0];
      }
    }else{
      this.model.subdomainFile = "";
    }
    $(this.queryByHook("types-location-message")).css('display', msgDisplay);
    $(this.queryByHook("types-location-container")).css("display", contDisplay);
  },
  selectFileLocation: function (e) {
    this.model.subdomainFile = e.target.value ? e.target.value : "";
  },
  setMeshFile: function (e) {
    this.meshFile = e.target.files[0];
    $(this.queryByHook("import-mesh-file")).prop('disabled', !this.meshFile);
  },
  setTypeFile: function (e) {
    this.typeFile = e.target.files[0];
  },
  startAction: function () {
    $(this.queryByHook("imf-complete")).css("display", "none");
    $(this.queryByHook("imf-error")).css("display", "none");
    $(this.queryByHook("imf-in-progress")).css("display", "inline-block");
  },
  toggleImportFiles: function (e) {
    let classes = $(this.queryByHook('collapseImportFiles')).attr("class").split(/\s+/);
    $(this.queryByHook('uploaded-chevron')).html(this.chevrons.hide);
    if(classes.includes('collapsed')) {
      $(this.queryByHook('import-chevron')).html(this.chevrons.show);
    }else{
      $(this.queryByHook('import-chevron')).html(this.chevrons.hide);
    }
  },
  toggleUploadedFiles: function (e) {
    let classes = $(this.queryByHook('collapseUploadedFiles')).attr("class").split(/\s+/);
    $(this.queryByHook('import-chevron')).html(this.chevrons.hide);
    if(classes.includes('collapsed')) {
      $(this.queryByHook('uploaded-chevron')).html(this.chevrons.show);
    }else{
      $(this.queryByHook('uploaded-chevron')).html(this.chevrons.hide);
    }
  },
  update: function () {},
  updateFileHeaders: function (e) {
    this.updateDepsOptions(e);
    let types = ['XML Mesh Lattice', 'Mesh IO Lattice', 'StochSS Lattice'];
    if(!types.includes(this.model.type)) { return }

    let importHeader = `Import Files for ${this.model.name}`;
    $($("#importFilesHeader" + this.model.cid).children()[0]).text(importHeader);
    let uploadHeader = `Uploaded Files for ${this.model.name}`;
    $($("#uploadedFilesHeader" + this.model.cid).children()[0]).text(uploadHeader);
  },
  updateDepsOptions: function (e) {
    let name = this.model.name;
    this.model.name = e.target.value;
    this.model.collection.parent.transformations.trigger(
      'update-lattice-options', {currName: name, newName: this.model.name}
    );
    this.model.collection.parent.actions.trigger(
      'update-lattice-options', {currName: name, newName: this.model.name}
    );
  },
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewLatticesView();
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          tests: tests.nameTests,
          valueType: 'string',
          value: this.model.name
        });
      }
    },
    selectType: {
      hook: 'select-type-container',
      prepareView: function (el) {
        let options = [
          'Cartesian Lattice',
          'Spherical Lattice',
          'Cylindrical Lattice',
          'XML Mesh Lattice',
          'Mesh IO Lattice',
          'StochSS Lattice'
        ];
        return new SelectView({
          name: 'type',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.type
        });
      }
    },
    inputCenterX: {
      hook: 'center-x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'center-x',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.center.x
        });
      }
    },
    inputCenterY: {
      hook: 'center-y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'center-y',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.center.y
        });
      }
    },
    inputCenterZ: {
      hook: 'center-z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          name: 'center-z',
          tests: [tests.nanValue],
          valueType: 'number',
          value: this.model.center.z
        });
      }
    },
    xMinLimInputView: {
      hook: "x-min-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'x-lim-min',
          modelKey: 'xmin',
          valueType: 'number',
          value: this.model.xmin,
          tests: [(value) => {
            if(value > this.model.xmax) {
              return "X-Min cannot be greater than X-Max";
            }
          }]
        });
      }
    },
    yMinLimInputView: {
      hook: "y-min-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'y-lim-min',
          modelKey: 'ymin',
          valueType: 'number',
          value: this.model.ymin,
          tests: [(value) => {
            if(value > this.model.ymax) {
              return "Y-Min cannot be greater than Y-Max";
            }
          }]
        });
      }
    },
    zMinLimInputView: {
      hook: "z-min-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'z-lim-min',
          modelKey: 'zmin',
          valueType: 'number',
          value: this.model.zmin,
          tests: [(value) => {
            if(value > this.model.zmax) {
              return "Z-Min cannot be greater than Z-Max";
            }
          }]
        });
      }
    },
    xMaxLimInputView: {
      hook: "x-max-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'x-lim-max',
          modelKey: 'xmax',
          valueType: 'number',
          value: this.model.xmax,
          tests: [(value) => {
            if(value < this.model.xmin) {
              return "X-Max cannot be less than X-Min";
            }
          }]
        });
      }
    },
    yMaxLimInputView: {
      hook: "y-max-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'y-lim-max',
          modelKey: 'ymax',
          valueType: 'number',
          value: this.model.ymax,
          tests: [(value) => {
            if(value < this.model.ymin) {
              return "Y-Max cannot be less than Y-Min";
            }
          }]
        });
      }
    },
    zMaxLimInputView: {
      hook: "z-max-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'z-lim-max',
          modelKey: 'zmax',
          valueType: 'number',
          value: this.model.zmax,
          tests: [(value) => {
            if(value < this.model.zmin) {
              return "Z-Max cannot be less than Z-Min";
            }
          }]
        });
      }
    },
    deltaxInputView: {
      hook: "delta-x-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'deltax',
          modelKey: 'deltax',
          valueType: 'number',
          value: this.model.deltax,
          tests: tests.valueTests
        });
      }
    },
    deltayInputView: {
      hook: "delta-y-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'deltay',
          modelKey: 'deltay',
          valueType: 'number',
          value: this.model.deltay,
          tests: tests.valueTests
        });
      }
    },
    deltazInputView: {
      hook: "delta-z-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'deltaz',
          modelKey: 'deltaz',
          valueType: 'number',
          value: this.model.deltaz,
          tests: tests.valueTests
        });
      }
    },
    radiusInputView: {
      hook: "radius-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'radius',
          modelKey: 'radius',
          valueType: 'number',
          value: this.model.radius,
          tests: tests.valueTests
        });
      }
    },
    lengthInputView: {
      hook: "length-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'length',
          modelKey: 'length',
          valueType: 'number',
          value: this.model.length,
          tests: tests.valueTests
        });
      }
    },
    deltasInputView: {
      hook: "delta-s-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'deltas',
          modelKey: 'deltas',
          valueType: 'number',
          value: this.model.deltas,
          tests: tests.valueTests
        });
      }
    },
    deltarInputView: {
      hook: "delta-r-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'deltar',
          modelKey: 'deltar',
          valueType: 'number',
          value: this.model.deltar,
          tests: tests.valueTests
        });
      }
    }
  }
});