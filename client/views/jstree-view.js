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
let path = require('path');
let _ = require('underscore');
let jstree = require('jstree');
//support files
let app = require('../app');
let modals = require('../modals');
//models
let Model = require('../models/model');
//config
let FileConfig = require('../file-config')
let ProjectConfig = require('../project-config');
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/jstreeView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=fb-new-directory]' : 'handleCreateDirectoryClick',
    'click [data-hook=fb-new-project]' : 'handleCreateProjectClick',
    'click [data-hook=fb-new-model]' : 'handleCreateModelClick',
    'click [data-hook=fb-new-domain]' : 'handleCreateDomain',
    'click [data-hook=fb-import-model]' : 'handleImportModelClick',
    'click [data-hook=upload-file-btn]' : 'handleUploadFileClick',
    'click [data-hook=options-for-node]' : 'showContextMenuForNode',
    'click [data-hook=refresh-jstree]' : 'handleRefreshJSTreeClick',
    'click [data-hook=fb-empty-trash]' : 'emptyTrash',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.config = attrs.configKey === "file" ? FileConfig : ProjectConfig;
    this.root = Boolean(attrs.root) ? attrs.root : "none";
    this.nodeForContextMenu = null;
    this.jstreeIsLoaded = false;
    this.ajaxData = {
      "url" : (node) => {
        if(node.parent === null){
          var queryStr = `?path=${this.root}`;
          if(this.root !== "none") {
            queryStr += "&isRoot=True";
          }
          return path.join(app.getLoadPath(), "jstree") + queryStr;
        }
        var queryStr = `?path=${node.original._path}`;
        return path.join(app.getLoadPath(), "jstree") + queryStr;
      },
      "dataType" : "json",
      "data" : (node) => {
        return { 'id' : node.id};
      }
    }
    this.treeSettings = {
      'plugins': ['types', 'wholerow', 'changed', 'contextmenu', 'dnd'],
      'core': {
        'multiple': false,
        'animation': 0,
        'check_callback': (op, node, par, pos, more) => {
          if(op === "rename_node" && app.validateName(pos, {rename: true}) !== ""){
            let err = $("#renameSpecialCharError");
            err.css("display", "block");
            setTimeout(() => {
              err.css("display", "none");
            }, 5000)
            return false
          }
          if(op === 'move_node' && more && more.core) {
            this.config.move(this, par, node);
          }else if(op === "move_node") {
            return this.config.validateMove(this, node, more, pos);
          }
        },
        'themes': {'stripes': true, 'variant': 'large'},
        'data': this.ajaxData
      },
      'types': this.config.types
    }
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.config.setup(this);
    this.setupJstree(() => {
      setTimeout(() => {
        this.refreshInitialJSTree();
      }, 3000);
    });
  },
  addInputKeyupEvent: function (input, okBtn) {
    input.addEventListener("keyup", (event) => {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
  },
  addInputValidateEvent: function (input, okBtn, modalID, inputID, {inProject = false}={}) {
    input.addEventListener("input", (e) => {
      let endErrMsg = document.querySelector(`${modalID} ${inputID}EndCharError`);
      let charErrMsg = document.querySelector(`${modalID} ${inputID}SpecCharError`);
      let error = app.validateName(input.value, {saveAs: !inProject});
      okBtn.disabled = error !== "" || input.value.trim() === "";
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none";
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none";
    });
  },
  addModel: function (dirname, file) {
    let queryStr = `?path=${path.join(dirname, file)}`;
    let existEP = path.join(app.getApiPath(), "model/exists") + queryStr;
    app.getXHR(existEP, {
      always: (err, response, body) => {
        if(body.exists) {
          let title = "Model Already Exists";
          let message = "A model already exists with that name";
          this.reportError({Reason: title, Measage: message});
        }else{
          this.openModel(path.join(dirname, file));
        }
      }
    });
  },
  addProjectModel: function (dirname, file) {
    let queryStr = `?path=${dirname}&mdlFile=${file}`;
    let newMdlEP = path.join(app.getApiPath(), "project/new-model") + queryStr;
    app.getXHR(newMdlEP, {
      success: (err, response, body) => {
        this.openModel(body.path);
      },
      error: (err, response, body) => {
        let title = "Model Already Exists";
        let message = "A model already exists with that name";
        this.reportError({Reason: title, Measage: message});
      }
    });
  },
  buildContextBase: function ({label="", disabled=false, bSep=false, aSep=false, action=(data)=>{}}={}) {
    return {
      label: label,
      _disabled: disabled,
      separator_before: bSep,
      separator_after: aSep,
      action: action
    }
  },
  buildContextBaseWithClass: function ({label="", disabled=false, bSep=false, aSep=true, action=(data)=>{}}={}) {
    return {
      label: label,
      _disabled: disabled,
      _class: "font-weight-bolder",
      separator_before: bSep,
      separator_after: aSep,
      action: action
    }
  },
  buildContextWithSubmenus: function ({label="", disabled=false, bSep=false, aSep=false, submenu={}}={}) {
    return {
      label: label,
      _disabled: disabled,
      separator_before: bSep,
      separator_after: aSep,
      submenu: submenu
    }
  },
  createDirectory: function (node, dirname) {
    if(document.querySelector('#newDirectoryModal')) {
      document.querySelector('#newDirectoryModal').remove();
    }
    let modal = $(modals.createDirectoryHtml()).modal('show');
    let okBtn = document.querySelector('#newDirectoryModal .ok-model-btn');
    let input = document.querySelector('#newDirectoryModal #directoryNameInput');
    this.addInputKeyupEvent(input, okBtn);
    this.addInputValidateEvent(input, okBtn, "#newDirectoryModal", "#directoryNameInput");
    okBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      let queryStr = `?path=${path.join(dirname, input.value.trim())}`;
      let endpoint = path.join(app.getApiPath(), "directory/create") + queryStr;
      app.getXHR(endpoint, {
        success: (err, response, body) => {
          this.refreshJSTree(node);
        },
        error: (err, response, body) => {
          this.reportError(JSON.parse(body));
        }
      });
    });
  },
  createDomain: function (dirname) {
    let queryStr = `?domainPath=${dirname}&new`;
    window.location.href = path.join(app.getBasePath(), "stochss/domain-editor") + queryStr;
  },
  createModel: function (node, dirname, isSpatial, inProject) {
    if(document.querySelector('#newModelModal')) {
      document.querySelector('#newModelModal').remove();
    }
    let modal = $(modals.createModelHtml(isSpatial)).modal();
    let okBtn = document.querySelector('#newModelModal .ok-model-btn');
    let input = document.querySelector('#newModelModal #modelNameInput');
    this.addInputKeyupEvent(input, okBtn);
    this.addInputValidateEvent(input, okBtn, "#newModelModal", "#modelNameInput", {inProject: inProject});
    okBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      let file = `${input.value.trim()}.${isSpatial ? "smdl" : "mdl"}`;
      if(inProject) {
        this.addProjectModel(dirname, file);
      }else{
        this.addModel(dirname, file);
      }
    });
  },
  createProject: function (node, dirname) {
    if(document.querySelector("#newProjectModal")) {
      document.querySelector("#newProjectModal").remove();
    }
    let modal = $(modals.createProjectHtml()).modal();
    let okBtn = document.querySelector('#newProjectModal .ok-model-btn');
    let input = document.querySelector('#newProjectModal #projectNameInput');
    this.addInputKeyupEvent(input, okBtn);
    this.addInputValidateEvent(input, okBtn, "#newProjectModal", "#projectNameInput");
    okBtn.addEventListener("click", (e) => {
      modal.modal('hide');
      let queryStr = `?path=${path.join(dirname, `${input.value.trim()}.proj`)}`;
      let endpoint = path.join(app.getApiPath(), "project/new-project") + queryStr;
      app.getXHR(endpoint, {
        success: (err, response, body) => {
          this.config.updateParent(this, "project");
          this.openProject(body.path);
        },
        error: (err, response, body) => {
          this.reportError(body);
        }
      });
    });
  },
  delete: function (node, type) {
    if(document.querySelector('#deleteFileModal')) {
      document.querySelector('#deleteFileModal').remove();
    }
    let modal = $(modals.deleteFileHtml(type)).modal();
    let yesBtn = document.querySelector('#deleteFileModal .yes-modal-btn');
    yesBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      let queryStr = `?path=${node.original._path}`;
      let endpoint = path.join(app.getApiPath(), "file/delete") + queryStr;
      app.getXHR(endpoint, {
        success: (err, response, body) => {
          let par = $('#files-jstree').jstree().get_node(node.parent);
          this.refreshJSTree(par);
          this.config.updateParent(node.type);
          let actionsBtn = $(this.queryByHook("options-for-node"));
          if(actionsBtn.text().endsWith(node.text)) {
            actionsBtn.text("Actions");
            actionsBtn.prop("disabled", true);
            this.nodeForContextMenu = "";
          }
        },
        error: (err, response, body) => {
          this.reportError(JSON.parse(body));
        }
      });
    });
  },
  duplicate: function (node, identifier, {cb=null, target=null, timeStamp=null}={}) {
    var queryStr = `?path=${node.original._path}`;
    if(target) {
      queryStr += `&target=${target}`;
    }
    if(timeStamp) {
      queryStr += `&stamp=${timeStamp}`;
    }
    let endpoint = path.join(app.getApiPath(), identifier) + queryStr;
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        var par = $('#files-jstree').jstree().get_node(node.parent);
        if(this.root !== "none" && (["nonspatial", "spatial"].includes(node.type) || target === "wkfl_model")){
          par = $('#files-jstree').jstree().get_node(par.parent);
          var file = body.File.replace(node.type === "spatial" ? ".smdl" : ".mdl", ".wkgp");
        }else{
          var file = body.File;
        }
        this.refreshJSTree(par);
        if(cb) {
          cb(body);
        }
        this.selectNode(par, file);
        this.config.updateParent(this, node.type);
      }
    });
  },
  emptyTrash: function (e) {
    if(document.querySelector("#emptyTrashConfirmModal")) {
      document.querySelector("#emptyTrashConfirmModal").remove();
    }
    let modal = $(modals.emptyTrashConfirmHtml()).modal();
    let yesBtn = document.querySelector('#emptyTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      let endpoint = path.join(app.getApiPath(), "file/empty-trash") + "?path=trash";
      app.getXHR(endpoint, {
        success: (err, response, body) => {
          this.refreshJSTree(null);
          $(this.queryByHook('empty-trash')).prop('disabled', true);
        }
      });
    });
  },
  exportToFile: function (fileData, fileName) {
    let dataURI = `data:text/plain;charset=utf-8,${encodeURIComponent(fileData)}`;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  },
  exportToJsonFile: function (fileData, fileName) {
    let dataStr = JSON.stringify(fileData);
    let dataURI = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    let exportFileDefaultName = fileName;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  exportToZipFile: function (targetPath) {
    let endpoint = path.join(app.getBasePath(), "/files", targetPath);
    window.open(endpoint, "_blank");
  },
  extractAll: function (node) {
    let queryStr = `?path=${node.original._path}`;
    let endpoint = path.join(app.getApiPath(), "file/unzip") + queryStr;
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        let par = $('#files-jstree').jstree().get_node(node.parent);
        this.refreshJSTree(par);
      },
      error: (err, response, body) => {
        this.reportError(body);
      }
    });
  },
  getAddModelContext: function (node) {
    let newModel = this.getNewModelContext(node, true);
    return this.buildContextWithSubmenus({
      label: "Add Model",
      submenu: {
        newModel: newModel,
        existingModel: this.buildContextBase({
          label: "Existing Model",
          action: (data) => {
            this.importModel(node, node.original._path);
          }
        })
      }
    });
  },
  getDeleteContext: function (node, type) {
    return this.buildContextBase({
      label: "Delete",
      action: (data) => {
        this.delete(node, type);
      }
    });
  },
  getDownloadContext: function (node, options, {asZip=false, withCombine=false}={}) {
    if(withCombine) {
      var label = "as .zip";
    }else if(asZip) {
      var label = "Download as .zip";
    }else {
      var label = "Download";
    }
    return this.buildContextBase({
      label: label,
      bSep: !withCombine,
      action: (data) => {
        this.getExportData(node, options);
      }
    });
  },
  getDownloadWCombineContext: function (node) {
    let options = {dataType: "zip", identifier: "file/download-zip"};
    let download = this.getDownloadContext(node, options, {withCombine: true});
    return this.buildContextWithSubmenus({
      label: "Download",
      bSep: true,
      submenu: {
        downloadAsZip: download,
        downloadAsCombine: this.buildContextBase({
          label: "as COMBINE",
          disabled: true,
        })
      }
    });
  },
  getDuplicateContext: function (node, identifier, options) {
    if(!options) {
      options = {};
    }
    let label = Boolean(options.cb) ? "Duplicate as new" : "Duplicate";
    return this.buildContextBase({
      label: label,
      action: (data) => {
        this.duplicate(node, identifier, options);
      }
    });
  },
  getEditModelContext: function (node) {
    return this.buildContextBaseWithClass({
      label: "Edit",
      action: (data) => {
        this.openModel(node.original._path);
      }
    });
  },
  getExportData: function (node, {dataType="", identifier=""}={}) {
    if(node.original.text.endsWith('.zip')) {
      return this.exportToZipFile(node.original._path);
    }
    if(node.original.type === "domain") {
      var queryStr = `?domain_path=${node.original._path}`;
    }else{
      var queryStr = `?path=${node.original._path}`;
      if(dataType === "json"){
        queryStr += "&for=None";
      }else if(dataType === "zip"){
        queryStr += "&action=generate";
      }
    }
    let endpoint = path.join(app.getApiPath(), identifier) + queryStr;
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        if(dataType === "json") {
          let data = node.original.type === "domain" ? body.domain : body;
          this.exportToJsonFile(data, node.original.text);
        }else if(dataType === "zip") {
          let par = $('#files-jstree').jstree().get_node(node.parent);
          this.refreshJSTree(par);
          this.exportToZipFile(body.Path);
        }else{
          this.exportToFile(body, node.original.text);
        }
      },
      error: (err, response, body) => {
        if(dataType === "plain-text") {
          body = JSON.parse(body);
        }
        this.reportError(body);
      }
    });
  },
  getExtractAllContext: function (node) {
    return this.buildContextBaseWithClass({
      label: "Extract All",
      action: (data) => {
        this.extractAll(node);
      }
    });
  },
  getFileUploadContext: function (node, inProject, {label="File"}={}) {
    let dirname = node.original._path === "/" ? "" : node.original._path;
    return this.buildContextBase({
      label: label,
      bSep: label !== "File",
      action: (data) => {
        this.uploadFile(node, dirname, "file", inProject);
      }
    });
  },
  getFullNewWorkflowContext: function (node) {
    return this.buildContextWithSubmenus({
      label: "New Workflow",
      submenu: {
        ensembleSimulation: this.getEnsembleNewWorkflowContext(node),
        parameterSweep: this.buildContextBase({
          label: "Parameter Sweep",
          action: (data) => {
            this.newWorkflow(node, "Parameter Sweep");
          }
        }),
        modelInference: this.buildContextBase({
          label: "Model Inference",
          action: (data) => {
            this.newWorkflow(node, "Model Inference");
          }
        }),
        jupyterNotebook: this.getNotebookNewWorkflowContext(node)
      }
    });
  },
  getFullUploadContext: function (node, inProject) {
    let dirname = node.original._path === "/" ? "" : node.original._path;
    let file = this.getFileUploadContext(node, inProject);
    return this.buildContextWithSubmenus({
      label: "Upload",
      bSep: true,
      submenu: {
        model: this.buildContextBase({
          label: "StochSS Model",
          action: (data) => {
            this.uploadFile(node, dirname, "model", inProject);
          }
        }),
        sbml: this.buildContextBase({
          label: "SBML Model",
          action: (data) => {
            this.uploadFile(node, dirname, "sbml", inProject);
          }
        }),
        file: file
      }
    });
  },
  getMdlConvertContext: function (node) {
    return this.buildContextWithSubmenus({
      label: "Convert",
      submenu: {
        toSpatial: this.buildContextBase({
          label: "To Spatial Model",
          action: (data) => {
            this.config.toSpatial(this, node);
          }
        }),
        toSBML: this.buildContextBase({
          label: "To SBML Model",
          action: (data) => {
            this.config.toSBML(this, node);
          }
        })
      }
    });
  },
  getMoveToTrashContext: function (node, type) {
    return this.buildContextBase({
      label: "Move To Trash",
      action: (data) => {
        this.moveToTrash(node, type);
      }
    });
  },
  getOpenFileContext: function (node) {
    return this.buildContextBaseWithClass({
      label: "Open",
      action: (data) => {
        this.openFile(node.original._path);
      }
    });
  },
  getOpenNotebookContext: function (node) {
    return this.buildContextBaseWithClass({
      label: "Open",
      action: (data) => {
        this.openNotebook(node.original._path);
      }
    });
  },
  getOpenSBMLContext: function (node) {
    return this.buildContextBaseWithClass({
      label: "Open",
      action: (data) => {
        this.openSBML(node.original._path);
      }
    });
  },
  getOpenWorkflowContext: function (node) {
    return this.buildContextBaseWithClass({
      label: "Open",
      action : (data) => {
        this.openWorkflow(node.original._path);
      }
    });
  },
  getNewDirectoryContext: function (node) {
    let dirname = node.original._path === "/" ? "" : node.original._path;
    return this.buildContextBase({
      label: "New Directory",
      action: (data) => {
        this.createDirectory(node, dirname);
      }
    });
  },
  getNewDomainContext: function (node) {
    return this.buildContextBase({
      label: "New Domain",
      action: (data) => {
        this.createDomain(node.original._path);
      }
    });
  },
  getNewModelContext: function (node, inProject) {
    let dirname = node.original._path === "/" ? "" : node.original._path;
    return this.buildContextWithSubmenus({
      label: "New Model",
      submenu: {
        spatial: this.buildContextBase({
          label: "Spatial",
          action: (data) => {
            this.createModel(node, dirname, true, inProject);
          }
        }),
        nonspatial: this.buildContextBase({
          label: "Non-Spatial",
          action: (data) => {
            this.createModel(node, dirname, false, inProject);
          }
        }) 
      }
    });
  },
  getEnsembleNewWorkflowContext: function (node) {
    return this.buildContextBase({
      label: "Ensemble Simulation",
      action: (data) => {
        let type = node.original.type === "spatial" ? "Spatial Ensemble Simulation" : "Ensemble Simulation";
        this.newWorkflow(node, type);
      }
    });
  },
  getNotebookNewWorkflowContext: function (node) {
    return this.buildContextBase({
      label: "Jupyter Notebook",
      action: (data) => {
        let queryStr = `?path=${node.original._path}`;
        window.location.href = path.join(app.getBasePath(), "stochss/workflow-selection") + queryStr;
      }
    });
  },
  getPublishNotebookContext: function (node) {
    return this.buildContextBase({
      label: "Publish",
      action: (data) => {
        this.publishNotebookPresentation(node);
      }
    });
  },
  getRefreshContext: function (node) {
    return this.buildContextBaseWithClass({
      label: "Refresh",
      action: (data) => {
        this.refreshJSTree(node);
      }
    });
  },
  getRenameContext: function (node) {
    let disabled = node.type === "workflow" && node.original._status === "running";
    return this.buildContextBase({
      label: "Rename",
      disabled: disabled,
      action: (data) => {
        this.renameNode(node);
      }
    });
  },
  getSBMLConvertContext: function (node, identifier) {
    return this.buildContextWithSubmenus({
      label: "Convert",
      submenu: {
        convertToModel: this.buildContextBase({
          label: "To Model",
          action: (data) => {
            this.config.toModel(this, node, identifier);
          }
        })
      }
    });
  },
  getSmdlConvertContext: function (node, identifier) {
    return this.buildContextWithSubmenus({
      label: "Convert",
      aSep: true,
      submenu: {
        convertToModel: this.buildContextBase({
          label: "To Model",
          action: (data) => {
            this.config.toModel(this, node, identifier);
          }
        })
      }
    });
  },
  getSpatialNewWorkflowContext: function (node) {
    return this.buildContextWithSubmenus({
      label: "New Workflow",
      submenu: {
        ensembleSimulation: this.getEnsembleNewWorkflowContext(node),
        jupyterNotebook: this.getNotebookNewWorkflowContext(node)
      }
    });
  },
  getTimeStamp: function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");
    return `_${month}${day}${year}_${hours}${minutes}${seconds}`;
  },
  getWorkflowMdlContext: function (node) {
    return this.buildContextWithSubmenus({
      label: "Model",
      submenu: {
        edit: this.buildContextBase({
          label: "Edit",
          disabled: (!node.original._newFormat && node.original._status !== "ready"),
          action: (data) => {
            this.openWorkflowModel(node);
          }
        }),
        extract: this.buildContextBase({
          label: "Extract",
          disabled: (node.original._newFormat && !node.original._hasJobs),
          action: (data) => {
            this.duplicate(node, "workflow/duplicate", {target: "wkfl_model"});
          }
        })
      }
    });
  },
  handleCreateDirectoryClick: function (e) {
    let dirname = this.root === "none" ? "" : this.root;
    this.createDirectory(null, dirname);
  },
  handleCreateModelClick: function (e) {
    let dirname = this.root === "none" ? "" : this.root;
    let inProject = this.root !== "none";
    let isSpatial = e.target.dataset.type === "spatial";
    this.createModel(null, dirname, isSpatial, inProject);
  },
  handleCreateProjectClick: function (e) {
    let dirname = this.root === "none" ? "" : this.root;
    this.createProject(null, dirname);
  },
  handleCreateDomain: function (e) {
    let dirname = this.root === "none" ? "/" : this.root;
    this.createDomain(dirname);
  },
  handleImportModelClick: function () {
    this.importModel(null, this.root);
  },
  handleRefreshJSTreeClick: function (e) {
    this.refreshJSTree(null);
  },
  handleUploadFileClick: function (e) {
    let dirname = this.root === "none" ? "/" : this.root;
    let inProject = this.root !== "none";
    let type = e.target.dataset.type;
    this.uploadFile(null, dirname, type, inProject);
  },
  hideNameWarning: function () {
    $(this.queryByHook('rename-warning')).collapse('hide');
  },
  importModel: function (node, projectPath) {
    if(document.querySelector('#importModelModal')){
      document.querySelector('#importModelModal').remove();
    }
    let mdlListEP = path.join(app.getApiPath(), 'project/add-existing-model') + `?path=${projectPath}`;
    app.getXHR(mdlListEP, {
      always: (err, response, body) => {
        let modal = $(modals.importModelHtml(body.files)).modal();
        let okBtn = document.querySelector('#importModelModal .ok-model-btn');
        let select = document.querySelector('#importModelModal #modelFileSelect');
        let location = document.querySelector('#importModelModal #modelPathSelect');
        select.addEventListener("change", (e) => {
          okBtn.disabled = e.target.value && body.paths[e.target.value].length >= 2;
          if(body.paths[e.target.value].length >= 2) {
            var locations = body.paths[e.target.value].map((path) => {
              return `<option>${path}</option>`;
            });
            locations.unshift(`<option value="">Select a location</option>`);
            locations = locations.join(" ");
            $("#modelPathSelect").find('option').remove().end().append(locations);
            $("#location-container").css("display", "block");
          }else{
            $("#location-container").css("display", "none");
            $("#modelPathSelect").find('option').remove().end();
          }
        });
        location.addEventListener("change", (e) => {
          okBtn.disabled = !Boolean(e.target.value);
        });
        okBtn.addEventListener("click", (e) => {
          modal.modal('hide');
          let mdlPath = body.paths[select.value].length < 2 ? body.paths[select.value][0] : location.value;
          let queryStr = `?path=${projectPath}&mdlPath=${mdlPath}`;
          let endpoint = path.join(app.getApiPath(), 'project/add-existing-model') + queryStr;
          app.postXHR(endpoint, null, {
            success: (err, response, body) => {
              if(document.querySelector("#successModal")) {
                document.querySelector("#successModal").remove();
              }
              let successModal = $(modals.successHtml(body.message)).modal();
              this.config.updateParent(this, "model");
              if(this.root !== "none") {
                this.refreshJSTree(null);
              }
            },
            error: (err, response, body) => {
              this.reportError(body);
            }
          });
        });
      }
    });
  },
  moveToTrash: function (node, type) {
    if(document.querySelector('#moveToTrashConfirmModal')) {
      document.querySelector('#moveToTrashConfirmModal').remove();
    }
    let modal = $(modals.moveToTrashConfirmHtml(type)).modal();
    let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      let dirname = this.root === "none" ? "" : this.root;
      let queryStr = `?srcPath=${node.original._path}&dstPath=${path.join(dirname, "trash", node.text)}`;
      let endpoint = path.join(app.getApiPath(), "file/move") + queryStr;
      app.getXHR(endpoint, {
        always: (err, response, body) => {
          $(this.queryByHook('empty-trash')).prop('disabled', false);
          this.refreshJSTree(null);
          this.config.updateParent(this, node.type);
        }
      });
    });
  },
  newWorkflow: function (node, type) {
    let model = new Model({
      directory: node.original._path
    });
    app.getXHR(model.url(), {
      success: (err, response, body) => {
        model.set(body);
        model.updateValid();
        if(model.valid){
          app.newWorkflow(self, node.original._path, node.type === "spatial", type);
        }else{
          if(document.querySelector("#errorModal")) {
            document.querySelector("#errorModal").remove();
          }
          let title = "Model Errors Detected";
          let endpoint = path.join(app.getBasePath(), "stochss/model-editor") + '?path=' + model.directory + '&validate';
          let message = `Errors were detected in you model <a href="${endpoint}">click here to fix your model<a/>`;
          $(modals.errorHtml(title, message)).modal();
        }
      }
    });
  },
  openDomain: function (domainPath) {
    let queryStr = `?domainPath=${domainPath}`;
    window.location.href = path.join(app.getBasePath(), "stochss/domain-editor") + queryStr
  },
  openFile: function (filePath) {
    window.open(path.join(app.getBasePath(), "view", filePath), "_blank");
  },
  openModel: function (modelPath) {
    let queryStr = `?path=${modelPath}`;
    window.location.href = path.join(app.getBasePath(), "stochss/model-editor") + queryStr;
  },
  openNotebook: function (notebookPath) {
    window.open(path.join(app.getBasePath(), "notebooks", notebookPath), '_blank');
  },
  openSBML: function (sbmlPath) {
    window.open(path.join(app.getBasePath(), "edit", sbmlPath), '_blank');
  },
  openProject: function (projectPath) {
    let queryStr = `?path=${projectPath}`;
    window.location.href = path.join(app.getBasePath(), "stochss/project-manager") + queryStr;
  },
  openWorkflow: function (workflowPath) {
    let queryStr = `?path=${workflowPath}&type=none`;
    window.location.href = path.join(app.getBasePath(), "stochss/workflow-manager") + queryStr;
  },
  openWorkflowModel: function (node) {
    let queryStr = `?path=${node.original._path}`;
    let endpoint = path.join(app.getApiPath(), "workflow/edit-model") + queryStr;
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        if(body.error){
          let title = `Model for ${node.text} Not Found`;
          this.reportError({Reason: title, Message: body.error});
        }else{
          this.openModel(body.file);
        }
      }
    });
  },
  publishNotebookPresentation: function (node) {
    let queryStr = `?path=${node.original._path}`;
    let endpoint = path.join(app.getApiPath(), "notebook/presentation") + queryStr;
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        $(modals.presentationLinks(body.message, "Shareable Presentation", body.links)).modal();
        let copyBtn = document.querySelector('#presentationLinksModal #copy-to-clipboard');
        this.config.updateParent(this, "Presentations");
        copyBtn.addEventListener('click', (e) => {
          let onFulfilled = (value) => {
            $("#copy-link-success").css("display", "inline-block");
          } 
          let onReject = (reason) => {
            let msg = $("#copy-link-failed");
            msg.html(reason);
            msg.css("display", "inline-block");
          }
          app.copyToClipboard(body.links.presentation, onFulfilled, onReject);
        });
      },
      error: (err, response, body) => {
        this.reportError(body);
      }
    });
  },
  refreshInitialJSTree: function () {
    let count = $('#files-jstree').jstree()._model.data['#'].children.length;
    if(count == 0) {
      this.refreshJSTree(null);
      setTimeout(() => {
        this.refreshInitialJSTree();
      }, 3000);
    }
  },
  refreshJSTree: function (node) {
    if(node === null || node.type === 'root'){
      this.jstreeIsLoaded = false;
      $('#files-jstree').jstree().deselect_all(true);
      $('#files-jstree').jstree().refresh();
    }else{
      $('#files-jstree').jstree().refresh_node(node);
    }
  },
  renameNode: function (node) {
    let currentName = node.text;
    let par = $('#files-jstree').jstree().get_node(node.parent);
    let extensionWarning = $(this.queryByHook('extension-warning'));
    let nameWarning = $(this.queryByHook('rename-warning'));
    extensionWarning.collapse('show');
    $('#files-jstree').jstree().edit(node, null, (node, status) => {
      if(currentName != node.text){
        let name = node.type === "root" ? `${node.text}.proj` : node.text;
        let queryStr = `?path=${node.original._path}&name=${name}`;
        let endpoint = path.join(app.getApiPath(), "file/rename") + queryStr;
        app.getXHR(endpoint, {
          always: (err, response, body) => {
            if(this.root !== "none" && ["nonspatial", "spatial"].includes(node.type)){
              this.refreshJSTree(null);
            }else{
              this.refreshJSTree(par);
            }
          },
          success: (err, response, body) => {
            if(this.root !== "none" && node.type === "root") {
              this.openProject(body._path);
            }else if(body.changed) {
              nameWarning.text(body.message);
              nameWarning.collapse('show');
              window.scrollTo(0,0);
              setTimeout(_.bind(this.hideNameWarning, this), 10000);
            }
            node.original._path = body._path;
            this.config.updateParent(this, node.type);
          }
        });
      }
      extensionWarning.collapse('hide');
      nameWarning.collapse('hide');
    });
  },
  reportError: function (body) {
    if(document.querySelector("#errorModal")) {
      document.querySelector("#errorModal").remove();
    }
    let errorModal = $(modals.errorHtml(body.Reason, body.Message)).modal();
  },
  selectNode: function (node, fileName) {
    if(!this.jstreeIsLoaded || !$('#files-jstree').jstree().is_loaded(node) && $('#files-jstree').jstree().is_loading(node)) {
      setTimeout(_.bind(this.selectNode, this, node, fileName), 1000);
    }else{
      node = $('#files-jstree').jstree().get_node(node);
      var child = "";
      for(var i = 0; i < node.children.length; i++) {
        var child = $('#files-jstree').jstree().get_node(node.children[i]);
        if(child.original.text === fileName) {
          $('#files-jstree').jstree().select_node(child);
          let optionsButton = $(this.queryByHook("options-for-node"));
          if(!this.nodeForContextMenu){
            optionsButton.prop('disabled', false);
          }
          optionsButton.text(`Actions for ${child.original.text}`);
          this.nodeForContextMenu = child;
          break;
        }
      }
    }
  },
  setupJstree: function (cb) {
    $.jstree.defaults.contextmenu.items = (node, cb) => {
      let zipTypes = this.config.contextZipTypes;
      let asZip = zipTypes.includes(node.original.type);
      let optionsButton = $(this.queryByHook("options-for-node"));
      if(!this.nodeForContextMenu) {
        optionsButton.prop('disabled', false);
      }
      optionsButton.text(`Actions for ${node.original.text}`);
      this.nodeForContextMenu = node;
      let contextMenus = {
        root: this.config.getRootContext,
        project: this.config.getProjectContext,
        workflowGroup: this.config.getWorkflowGroupContext,
        folder: this.config.getFolderContext,
        nonspatial: this.config.getModelContext,
        spatial: this.config.getSpatialModelContext,
        domain: this.config.getDomainContext,
        workflow: this.config.getWorkflowContext,
        notebook: this.config.getNotebookContext,
        sbmlModel: this.config.getSBMLContext,
      }
      if(Object.keys(contextMenus).includes(node.type)){
        return contextMenus[node.type](this, node);
      }
      return this.config.getOtherContext(this, node);
    }
    $(() => {
      $(document).on('shown.bs.modal', (e) => {
        $('[autofocus]', e.target).focus();
      });
      $(document).on('dnd_start.vakata', (data, element, helper, event) => {
        $('#files-jstree').jstree().load_all();
      });
      $('#files-jstree').jstree(this.treeSettings).bind("loaded.jstree", (event, data) => {
        this.jstreeIsLoaded = true;
      }).bind("refresh.jstree", (event, data) => {
        this.jstreeIsLoaded = true;
      });
      $('#files-jstree').on('click.jstree', (e) => {
        let parent = e.target.parentElement;
        let _node = parent.children[parent.children.length - 1];
        let node = $('#files-jstree').jstree().get_node(_node);
        if(_node.nodeName === "A" && $('#files-jstree').jstree().is_loaded(node) && node.type === "folder"){
          this.refreshJSTree(node);
        }
        let optionsButton = $(this.queryByHook("options-for-node"));
        if(this.nodeForContextMenu === null){
          optionsButton.prop('disabled', false);
        }
        optionsButton.text(`Actions for ${node.original.text}`);
        this.nodeForContextMenu = node;
      });
      $('#files-jstree').on('dblclick.jstree', (e) => {
        this.config.doubleClick(this, e);
      });
    });
  },
  showContextMenuForNode: function (e) {
    $('#files-jstree').jstree().show_contextmenu(this.nodeForContextMenu);
  },
  uploadFile: function (node, dirname, type, inProject) {
    if(document.querySelector('#uploadFileModal')) {
      document.querySelector('#uploadFileModal').remove();
    }
    if(this.isSafariV14Plus == undefined){
      let browser = app.getBrowser();
      this.isSafariV14Plus = (browser.name === "Safari" && browser.version >= 14);
    }
    let modal = $(modals.uploadFileHtml(type, this.isSafariV14Plus)).modal();
    let uploadBtn = document.querySelector('#uploadFileModal .upload-modal-btn');
    let fileInput = document.querySelector('#uploadFileModal #fileForUpload');
    let input = document.querySelector('#uploadFileModal #fileNameInput');
    let fileCharErrMsg = document.querySelector('#uploadFileModal #fileSpecCharError');
    let nameEndErrMsg = document.querySelector('#uploadFileModal #fileNameInputEndCharError');
    let nameCharErrMsg = document.querySelector('#uploadFileModal #fileNameInputSpecCharError');
    let nameUsageMsg = document.querySelector('#uploadFileModal #fileNameUsageMessage');
    let getOptions = (file) => {
      if(!inProject) { return {saveAs: true}; };
      if(file) {
        if(file.name.endsWith(".mdl")) { return {saveAs: false}; }
        if(file.name.endsWith(".sbml")) { return {saveAs: false}; }
      }
      if(type === "model" || type === "sbml") {
        if(!file) { return {saveAs: false}; }
        if(type === "model" && file.name.endsWith(".json")) { return {saveAs: false}; }
        if(type === "sbml" && file.name.endsWith(".xml")) { return {saveAs: false}; }
      }
      return {saveAs: true};
    }
    let validateFile = () => {
      let options = getOptions(fileInput.files[0]);
      let fileErr = !fileInput.files.length ? "" : app.validateName(fileInput.files[0].name, options);
      let nameErr = app.validateName(input.value, options);
      if(!fileInput.files.length) {
        uploadBtn.disabled = true;
        fileCharErrMsg.style.display = 'none';
      }else if(fileErr === "" || (Boolean(input.value) && nameErr === "")){
        uploadBtn.disabled = false;
        fileCharErrMsg.style.display = 'none';
      }else{
        uploadBtn.disabled = true;
        fileCharErrMsg.style.display = 'block';
      }
      return nameErr;
    }
    fileInput.addEventListener('change', (e) => {
      validateFile();
    });
    input.addEventListener("input", (e) => {
      let nameErr = validateFile();
      nameCharErrMsg.style.display = nameErr === "both" || nameErr === "special" ? "block" : "none";
      nameEndErrMsg.style.display = nameErr === "both" || nameErr === "forward" ? "block" : "none";
      nameUsageMsg.style.display = nameErr !== "" ? "block" : "none";
    });
    uploadBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      let file = fileInput.files[0];
      let options = getOptions(file);
      let fileinfo = {type: type, name: "", path: dirname};
      if(Boolean(input.value) && app.validateName(input.value.trim(), options) === ""){
        fileinfo.name = input.value.trim();
      }
      let formData = new FormData();
      formData.append("datafile", file);
      formData.append("fileinfo", JSON.stringify(fileinfo));
      let endpoint = path.join(app.getApiPath(), 'file/upload');
      app.postXHR(endpoint, formData, {
        success: (err, response, body) => {
          body = JSON.parse(body);
          this.refreshJSTree(node);
          this.config.updateParent(this, "model");
          if(body.errors.length > 0){
            if(document.querySelector("#uploadFileErrorsModal")) {
              document.querySelector("#uploadFileErrorsModal").remove();
            }
            let errorModal = $(modals.uploadFileErrorsHtml(file.name, type, body.message, body.errors)).modal();
          }
        },
        error: (err, response, body) => {
          body = JSON.parse(body);
          this.reportError(body);
        }
      }, false);
    });
  }
});