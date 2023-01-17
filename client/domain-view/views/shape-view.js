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
let _ = require('underscore');
//support files
let app = require('../../app');
let tests = require('../../views/tests');
//views
let View = require('ampersand-view');
let InputView = require('../../views/input');
let SelectView = require('ampersand-select-view');
//templates
let editTemplate = require('../templates/editShape.pug');
let viewTemplate = require('../templates/viewShape.pug');

module.exports = View.extend({
  events: {
    'change [data-hook=input-name-container]' : 'updateDepsOptions',
    'change [data-hook=select-geometry-container]' : 'selectGeometryType',
    'change [data-hook=input-formula-container]' : 'updateGeometriesInUse',
    'change [data-hook=select-lattice-container]' : 'selectLatticeType',
    'change [data-target=shape-property]' : 'updateViewer',
    'click [data-hook=select-shape]' : 'selectShape',
    'click [data-hook=fillable-shape]' : 'selectFillable',
    'click [data-hook=remove]' : 'removeShape'
  },
  bindings: {
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select-shape'
    },
    'model.fillable' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'fillable-shape'
    },
    'model.notEditable' : {
      hook: 'select-shape',
      type: function (el, value, previousValue) {
        el.disabled = !value;
      },
      name: 'disabled'
    },
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled'
    }
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.viewMode = attrs.viewMode ? attrs.viewMode : false;
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
      ]
    }
    app.documentSetup();
    if(!this.viewMode){
      if(this.model.selected) {
        setTimeout(_.bind(this.openDetails, this), 1);
      }
      this.renderFormulaInputView();
      this.displayDetails();
    }else if(this.model.fillable) {
      setTimeout(_.bind(this.openDetails, this), 1);
      this.displayDetails();
    }
  },
  displayDetails: function () {
    this.details[this.model.lattice].forEach((element) => {
      element.css('display', 'block');
    });
  },
  hideDetails: function () {
    this.details[this.model.lattice].forEach((element) => {
      element.css('display', 'none');
    });
  },
  openDetails: function () {
    $(this.queryByHook("view-collapse-shape-details" + this.model.cid)).collapse("show");
  },
  removeShape: function () {
    let name = this.model.name;
    let actions = this.model.collection.parent.actions;
    this.collection.removeShape(this.model);
    actions.trigger('update-shape-options', {currName: name});
  },
  renderFormulaInputView: function () {
    if(this.formulaInputView) {
        this.formulaInputView.remove();
    }
    let placeholder = this.model.type === "Standard" ?
        "-- Formula in terms of 'x', 'y', 'z' --" :
        "-- Formula in terms of other shapes --";
    this.formulaInputView = new InputView({
      parent: this, required: true, name: 'formula', modelKey: 'formula',
      valueType: 'string', value: this.model.formula, placeholder: placeholder
    });
    let hook = 'input-formula-container';
    app.registerRenderSubview(this, this.formulaInputView, hook);
  },
  selectGeometryType: function (e) {
    this.model.type = e.target.value;
    this.renderFormulaInputView();
    this.updateViewer();
  },
  selectShape: function () {
    this.model.selected = !this.model.selected;
  },
  selectFillable: function () {
    this.model.fillable = !this.model.fillable;
    if(!this.model.fillable && this.model.selected) {
      this.model.selected = false;
      $(this.queryByHook("edit-collapse-shape-details" + this.model.cid)).collapse("hide");
    }
    this.updateViewer();
  },
  selectLatticeType: function (e) {
    this.hideDetails();
    this.model.lattice = e.target.value;
    this.displayDetails();
    this.updateViewer();
  },
  update: function () {},
  updateDepsOptions: function (e) {
    let name = this.model.name;
    this.model.name = e.target.value;
    this.updateViewer();
    this.model.collection.parent.actions.trigger(
      'update-shape-options', {currName: name, newName: this.model.name}
    );
  },
  updateGeometriesInUse: function () {
    if(this.model.type === "Combinatory") {
      this.model.collection.parent.trigger('update-shape-deps');
    }
    this.updateViewer();
  },
  updateValid: function () {},
  updateViewer: function () {
    this.parent.renderViewShapesView();
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
    selectGeometry: {
      hook: 'select-geometry-container',
      prepareView: function (el) {
        let options = [
          'Standard',
          'Combinatory'
        ];
        return new SelectView({
          name: 'geometry',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.type
        });
      }
    },
    selectLattice: {
      hook: 'select-lattice-container',
      prepareView: function (el) {
        let options = [
          'Cartesian Lattice',
          'Spherical Lattice',
          'Cylindrical Lattice'
        ];
        return new SelectView({
          name: 'lattice',
          required: true,
          idAttributes: 'cid',
          options: options,
          value: this.model.lattice
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
    heightInputView: {
      hook: "height-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'height',
          modelKey: 'height',
          valueType: 'number',
          value: this.model.height,
          tests: tests.valueTests
        });
      }
    },
    depthInputView: {
      hook: "depth-container",
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'depth',
          modelKey: 'depth',
          valueType: 'number',
          value: this.model.depth,
          tests: tests.valueTests
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
    cylinderLengthInputView: {
      hook: "cylinder-length-container",
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

















/////////////////////////////////////////////////////////////////////////////
// LATTICE MODEL VIEW                                                      //
/////////////////////////////////////////////////////////////////////////////
// let path = require('path');

//   events: {
//     'change [data-hook=mesh-file]' : 'setMeshFile',
//     'change [data-hook=type-file]' : 'setTypeFile',
//     'change [data-hook=lattice-mesh-select]' : 'selectMeshFile',
//     'change [data-hook=mesh-location-select]' : 'selectMeshLocation',
//     'change [data-hook=lattice-type-select]' : 'selectTypeFile',
//     'change [data-hook=type-location-select]' : 'selectFileLocation',
//     'click [data-hook=collapseImportFiles]' : 'toggleImportFiles',
//     'click [data-hook=collapseUploadedFiles]' : 'toggleUploadedFiles',
//     'click [data-hook=import-mesh-file]' : 'handleImportMesh'
//   },
//   completeAction: function () {
//     $(this.queryByHook("imf-in-progress")).css("display", "none");
//     $(this.queryByHook("imf-complete")).css("display", "inline-block");
//     setTimeout(() => {
//       $(this.queryByHook("imf-complete")).css("display", "none");
//     }, 5000);
//   },
//   errorAction: function (action) {
//     $(this.queryByHook("imf-in-progress")).css("display", "none");
//     $(this.queryByHook("imf-action-error")).text(action);
//     $(this.queryByHook("imf-error")).css("display", "block");
//   },
//   handleImportMesh: function () {
//     this.startAction();
//     let formData = new FormData();
//     var filePath = this.model.collection.parent.directory;
//     if(filePath === null) {
//       filePath = this.parent.parent.parent.model.directory;
//     }
//     formData.append("path", filePath);
//     formData.append("datafile", this.meshFile);
//     if(this.typeFile) {
//       formData.append("typefile", this.typeFile);
//     }
//     let endpoint = path.join(app.getApiPath(), 'spatial-model/import-mesh');
//     app.postXHR(endpoint, formData, {
//       success: (err, response, body) => {
//         body = JSON.parse(body);
//         this.model.filename = path.join(body.meshPath, body.meshFile);
//         if(Object.keys(body).includes("typesPath")) {
//           this.model.subdomainFile = path.join(body.typesPath, body.typesFile);
//           this.typeFiles = null;
//         }
//         this.completeAction();
//         $(this.queryByHook('collapseUploadedFiles')).click();
//         this.renderLatticeFileSelects();
//       },
//       error: (err, response, body) => {
//         body = JSON.parse(body);
//         this.errorAction(body.Message);
//       }
//     }, false);
//   },
//   renderLatticeFileSelects: function () {
//     var queryStr = `?ext=${this.accept}`;
//     if(this.typeFiles === null) {
//       queryStr += `${queryStr}&includeTypes=True`;
//     }
//     let endpoint = `${path.join(app.getApiPath(), 'spatial-model/lattice-files')}${queryStr}`;
//     app.getXHR(endpoint, {success: (err, response, body) => {
//       this.meshFiles = body.meshFiles;
//       this.renderMeshSelectView();
//       if(Object.keys(body).includes('typeFiles')) {
//         this.typeFiles = body.typeFiles;
//         this.renderTypeSelectView();
//       }
//     }});
//   },
//   renderMeshSelectView: function () {
//     if(this.meshSelectView) {
//       this.meshSelectView.remove();
//     }
//     let files = this.meshFiles.files.filter((file) => {
//       if(file[1] === this.model.filename.split('/').pop()) {
//         return file;
//       }
//     });
//     let value = files.length > 0 ? files[0] : "";
//     this.meshSelectView = new SelectView({
//       name: 'mesh-files',
//       required: false,
//       idAttributes: 'cid',
//       options: this.meshFiles.files,
//       value: value,
//       unselectedText: "-- Select Mesh File --"
//     });
//     let hook = "lattice-mesh-select";
//     app.registerRenderSubview(this, this.meshSelectView, hook);
//     if(value !== "" && this.meshFiles.paths[value[0]].length > 1) {
//       this.renderMeshLocationSelectView(value[0]);
//       $(this.queryByHook("mesh-location-container")).css("display", "inline-block");
//     }
//   },
//   renderMeshLocationSelectView: function (index) {
//     if(this.meshLocationSelectView) {
//       this.meshLocationSelectView.remove();
//     }
//     let value = Boolean(this.model.filename) ? this.model.filename : "";
//     this.meshLocationSelectView = new SelectView({
//       name: 'mesh-locations',
//       required: false,
//       idAttributes: 'cid',
//       options: this.meshFiles.paths[index],
//       value: value,
//       unselectedText: "-- Select Mesh File Location --"
//     });
//     let hook = "mesh-location-select";
//     app.registerRenderSubview(this, this.meshLocationSelectView, hook);
//   },
//   renderTypeSelectView: function () {
//     if(this.typeSelectView) {
//       this.typeSelectView.remove();
//     }
//     var file = this.typeFiles.files.filter((file) => {
//       if(file[1] === this.model.subdomainFile.split('/').pop()) {
//         return file;
//       }
//     });
//     let value = file.length > 0 ? file[0] : "";
//     this.typeSelectView = new SelectView({
//       name: 'type-files',
//       required: false,
//       idAttributes: 'cid',
//       options: this.typeFiles.files,
//       value: value,
//       unselectedText: "-- Select Type File --"
//     });
//     let hook = "lattice-type-select";
//     app.registerRenderSubview(this, this.typeSelectView, hook);
//     if(value !== "" && this.typeFiles.paths[value[0]].length > 1) {
//       this.renderTypeLocationSelectView(value[0]);
//       $(this.queryByHook("types-location-container")).css("display", "inline-block");
//     }
//   },
//   renderTypeLocationSelectView: function (index) {
//     if(this.typeLocationSelectView) {
//       this.typeLocationSelectView.remove();
//     }
//     let value = Boolean(this.model.subdomainFile) ? this.model.subdomainFile : "";
//     this.typeLocationSelectView = new SelectView({
//       name: 'type-locations',
//       required: false,
//       idAttributes: 'cid',
//       options: this.typeFiles.paths[index],
//       value: value,
//       unselectedText: "-- Select Type File Location --"
//     });
//     let hook = "type-location-select";
//     app.registerRenderSubview(this, this.typeLocationSelectView, hook);
//   },
//   selectMeshFile: function (e) {
//     let value = e.target.value;
//     var msgDisplay = "none";
//     var contDisplay = "none";
//     if(value) {
//       if(this.meshFiles.paths[value].length > 1) {
//         msgDisplay = "block";
//         contDisplay = "inline-block";
//         this.renderMeshLocationSelectView(value);
//         this.model.filename = "";
//       }else{
//         this.model.filename = this.meshFiles.paths[value][0];
//       }
//     }else{
//       this.model.filename = "";
//     }
//     $(this.queryByHook("mesh-location-message")).css('display', msgDisplay);
//     $(this.queryByHook("mesh-location-container")).css("display", contDisplay);
//   },
//   selectMeshLocation: function (e) {
//     this.model.filename = e.target.value ? e.target.value : "";
//   },
//   selectTypeFile: function (e) {
//     let value = e.target.value;
//     var msgDisplay = "none";
//     var contDisplay = "none";
//     if(value) {
//       if(this.typeFiles.paths[value].length > 1) {
//         msgDisplay = "block";
//         contDisplay = "inline-block";
//         this.renderMeshLocationSelectView(value);
//         this.model.subdomainFile = "";
//       }else{
//         this.model.subdomainFile = this.typeFiles.paths[value][0];
//       }
//     }else{
//       this.model.subdomainFile = "";
//     }
//     $(this.queryByHook("types-location-message")).css('display', msgDisplay);
//     $(this.queryByHook("types-location-container")).css("display", contDisplay);
//   },
//   selectFileLocation: function (e) {
//     this.model.subdomainFile = e.target.value ? e.target.value : "";
//   },
//   setMeshFile: function (e) {
//     this.meshFile = e.target.files[0];
//     $(this.queryByHook("import-mesh-file")).prop('disabled', !this.meshFile);
//   },
//   setTypeFile: function (e) {
//     this.typeFile = e.target.files[0];
//   },
//   startAction: function () {
//     $(this.queryByHook("imf-complete")).css("display", "none");
//     $(this.queryByHook("imf-error")).css("display", "none");
//     $(this.queryByHook("imf-in-progress")).css("display", "inline-block");
//   },
//   toggleImportFiles: function (e) {
//     let classes = $(this.queryByHook('collapseImportFiles')).attr("class").split(/\s+/);
//     $(this.queryByHook('uploaded-chevron')).html(this.chevrons.hide);
//     if(classes.includes('collapsed')) {
//       $(this.queryByHook('import-chevron')).html(this.chevrons.show);
//     }else{
//       $(this.queryByHook('import-chevron')).html(this.chevrons.hide);
//     }
//   },
//   toggleUploadedFiles: function (e) {
//     let classes = $(this.queryByHook('collapseUploadedFiles')).attr("class").split(/\s+/);
//     $(this.queryByHook('import-chevron')).html(this.chevrons.hide);
//     if(classes.includes('collapsed')) {
//       $(this.queryByHook('uploaded-chevron')).html(this.chevrons.show);
//     }else{
//       $(this.queryByHook('uploaded-chevron')).html(this.chevrons.hide);
//     }
//   },
//   updateFileHeaders: function (e) {
//     this.updateDepsOptions(e);
//     let types = ['XML Mesh Lattice', 'Mesh IO Lattice', 'StochSS Lattice'];
//     if(!types.includes(this.model.type)) { return }

//     let importHeader = `Import Files for ${this.model.name}`;
//     $($("#importFilesHeader" + this.model.cid).children()[0]).text(importHeader);
//     let uploadHeader = `Uploaded Files for ${this.model.name}`;
//     $($("#uploadedFilesHeader" + this.model.cid).children()[0]).text(uploadHeader);
//   },
//   subviews: {
//   }
