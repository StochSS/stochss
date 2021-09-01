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

let $ = require('jquery');
let path = require('path');
//support files
let app = require('./app');
let modals = require('./modals');

let contextZipTypes = ["workflow", "folder", "other", "root", "workflowGroup"];

let doubleClick = (view, e) => {
  let node = $('#files-jstree').jstree().get_node(e.target);
  if(!node.original._path.includes(".proj/trash/")){
    if((node.type === "folder" || node.type === "workflowGroup") && $('#files-jstree').jstree().is_open(node) && $('#files-jstree').jstree().is_loaded(node)){
      view.refreshJSTree(node);
    }else if(node.type === "nonspatial" || node.type === "spatial"){
      view.openModel(node.original._path);
    }else if(node.type === "notebook"){
      view.openNotebook(node.original._path);
    }else if(node.type === "sbml-model"){
      window.open(path.join(app.getBasePath(), "edit", node.original._path), '_blank');
    }else if(node.type === "workflow"){
      view.openWorkflow(node.original._path);
    }else if(node.type === "domain") {
      view.openDomain(node.original._path);
    }else if(node.type === "other"){
      let openPath = path.join(app.getBasePath(), "view", node.original._path);
      window.open(openPath, "_blank");
    }
  }
}

let extract = (view, node, type) => {
  let projectPar = path.dirname(view.root) === '.' ? "" : path.dirname(view.root);
  let dstPath = path.join(projectPar, node.original._path.split('/').pop());
  let queryStr = `?srcPath=${node.original._path}&dstPath=${dstPath}`;
  let endpoint = path.join(app.getApiPath(), `project/extract-${type}`) + queryStr;
  app.getXHR(endpoint, {
    success: (err, response, body) => {
      let title = `Successfully Exported the ${type.replace(type.charAt(0), type.charAt(0).toUpperCase())}`;
      let successModel = $(modals.successHtml(body, {title: title})).modal();
    },
    error: (err, response, body) => {
      view.reportError(JSON.parse(body));
    }
  });
}

let getDomainContext = (view, node) => {
  let downloadOptions = {dataType: "json", identifier: "spatial-model/load-domain"};
  return {
    open: view.buildContextBaseWithClass({
      label: "Open",
      action: (data) => {
        view.openDomain(node.original._path);
      }
    }),
    download: view.getDownloadContext(node, downloadOptions),
    rename: view.getRenameContext(node),
    duplicate: view.getDuplicateContext(node, "file/duplicate"),
    moveToTrash: view.getMoveToTrashContext(node, "domain")
  }
}
  
let getExtractContext = (view, node, type) => {
  return view.buildContextBase({
    label: "Extract",
    action: (data) => {
      extract(view, node, type);
    }
  });
}

let getFolderContext = (view, node) => {
  if(node.text === "trash"){ // Trash node
    return {refresh: view.getRefreshContext(node)};
  }
  if(node.original._path.includes(".proj/trash/")) { //item in trash
    return {delete: view.getDeleteContext(node, "directory")};
  }
  let downloadOptions = {dataType: "zip", identifier: "file/download-zip"};
  let options = {asZip: true};
  return {
    refresh: view.getRefreshContext(node),
    newDirectory: view.getNewDirectoryContext(node),
    newDomain: view.getNewDomainContext(node),
    upload: view.getFileUploadContext(node, true, {label: "Uplaod File"}),
    download: view.getDownloadContext(node, downloadOptions, options),
    rename: view.getRenameContext(node),
    duplicate: view.getDuplicateContext(node, "directory/duplicate"),
    moveToTrash: view.getMoveToTrashContext(node, "directory")
  }
}

let getModelContext = (view, node) => {
  if(node.original._path.includes(".proj/trash/")) { //item in trash
    return {delete: view.getDeleteContext(node, "model")};
  }
  let downloadOptions = {dataType: "json", identifier: "file/json-data"};
  return {
    edit: view.getEditModelContext(node),
    extract: getExtractContext(view, node, "model"),
    newWorkflow: view.getFullNewWorkflowContext(node),
    convert: view.getMdlConvertContext(node),
    download: view.getDownloadContext(node, downloadOptions),
    rename: view.getRenameContext(node),
    duplicate: view.getDuplicateContext(node, "file/duplicate"),
    moveToTrash: view.getMoveToTrashContext(node, "model")
  }
}

let getNotebookContext = (view, node) => {
  let open = view.getOpenNotebookContext(node);
  let downloadOptions = {dataType: "json", identifier: "file/json-data"};
  let download = view.getDownloadContext(node, downloadOptions);
  let rename = view.getRenameContext(node);
  let duplicate = view.getDuplicateContext(node, "file/duplicate");
  let moveToTrash = view.getMoveToTrashContext(node, "notebook");
  if(app.getBasePath() === "/") {
    return {
      open: open, download: download, rename: rename,
      duplicate: duplicate, moveToTrash: moveToTrash
    }
  }
  return {
    open: open,
    publish: view.getPublishNotebookContext(node),
    download: download, rename: rename,
    duplicate: duplicate, delete: deleteFile
  }
}

let getRootContext = (view, node) => {
  return {
    refresh: view.getRefreshContext(node),
    addModel: view.getAddModelContext(node),
    newDirectory: view.getNewDirectoryContext(node),
    newDomain: view.getNewDomainContext(node),
    upload: view.getFullUploadContext(node, true),
    download: view.getDownloadWCombineContext(node),
    rename: view.getRenameContext(node)
  }
}

let getSpatialModelContext = (view, node) => {
  if(node.original._path.includes(".proj/trash/")) { //item in trash
    return {delete: view.getDeleteContext(node, "spatial model")};
  }
  let downloadOptions = {dataType: "json", identifier: "file/json-data"};
  return {
    edit: view.getEditModelContext(node),
    extract: getExtractContext(view, node),
    newWorkflow: view.getFullNewWorkflowContext(node),
    convert: view.getSmdlConvertContext(node, "spatial/to-model"),
    download: view.getDownloadContext(node, downloadOptions),
    rename: view.getRenameContext(node),
    duplicate: view.getDuplicateContext(node, "file/duplicate"),
    moveToTrash: view.getMoveToTrashContext(node, "model")
  }
}

let getWorkflowContext = (view, node) => {
  if(node.original._path.includes(".proj/trash/")) { //item in trash
    return {delete: view.getDeleteContext(node, "workflow")};
  }
  let options = {target: "workflow", cb: (body) => {
    let title = `Model for ${body.File}`;
    if(body.error){
      view.reportError({Reason: title, Message: body.error});
    }else{
      if(document.querySelector("#successModal")) {
        document.querySelector("#successModal").remove();
      }
      let message = `The model for <b>${body.File}</b> is located here: <b>${body.mdlPath}</b>`;
      let modal = $(modals.successHtml(title, message)).modal();
    }
  }}
  if(!node.original._newFormat) {
    options['timeStamp'] = view.getTimeStamp();
  }
  return {
    open: view.getOpenWorkflowContext(node),
    model: view.getWorkflowMdlContext(node),
    extract: getExtractContext(view, node, "workflow"),
    download: view.getDownloadWCombineContext(node),
    rename: view.getRenameContext(node),
    duplicate: view.getDuplicateContext(node, "workflow/duplicate", options),
    moveToTrash: view.getMoveToTrashContext(node, "workflow")
  }
}

let getWorkflowGroupContext = (view, node) => {
  if(node.original._path.includes(".proj/trash/")) { //item in trash
    return {delete: view.getDeleteContext(node, "workflow group")};
  }
  return {
    refresh: view.getRefreshContext(node),
    download: view.getDownloadWCombineContext(node)
  }
}

let move = (view, par, node) => {
  let newDir = par.original._path !== "/" ? par.original._path : "";
  let file = node.original._path.split('/').pop();
  let oldPath = node.original._path;
  let queryStr = `?srcPath=${oldPath}&dstPath=${path.join(newDir, file)}`;
  let endpoint = path.join(app.getApiPath(), "file/move") + queryStr;
  app.getXHR(endpoint, {
    success: (err, response, body) => {
      node.original._path = path.join(newDir, file);
      if((node.type === "nonspatial" || node.type === "spatial") && (oldPath.includes("trash") || newDir.includes("trash"))) {
        updateParent(view, "Archive");
      }else if(node.type !== "notebook" || node.original._path.includes(".wkgp") || newDir.includes(".wkgp")) {
        updateParent(view, node.type);
      }
    },
    error: (err, response, body) => {
      body = JSON.parse(body);
      view.refreshJSTree(par);
    }
  });
}

let setup = (view) => {
  $(view.queryByHook("fb-new-project")).css("display", "none");
  $(view.queryByHook("fb-empty-trash")).css("display", "none");
}

let toModel = (view, node, identifier) => {
  let queryStr = `?path=${node.original._path}`;
  let endpoint = path.join(app.getApiPath(), identifier) + queryStr;
  app.getXHR(endpoint, {
    success: (err, response, body) => {
      var root = $('#files-jstree').jstree().get_node(node.parent);
      while(root.type !== "root") {
        root = $('#files-jstree').jstree().get_node(root.parent);
      }
      view.refreshJSTree(root);
      view.selectNode(root, body.File.replace(".mdl", ".wkgp"));
      if(identifier.startsWith("sbml") && body.errors.length > 0){
        if(document.querySelector('#sbmlToModelModal')) {
          document.querySelector('#sbmlToModelModal').remove();
        }
        let modal = $(modals.sbmlToModelHtml(body.message, body.errors)).modal();
      }else{
        view.updateParent("model");
      }
    }
  });
}

let toSBML = (view, node) => {
  let queryStr = `?path=${node.original._path}`;
  let endpoint = path.join(app.getApiPath(), "model/to-sbml") + queryStr;
  app.getXHR(endpoint, {
    success: (err, response, body) => {
      let par = $('#files-jstree').jstree().get_node(node.parent);
      let grandPar = $('#files-jstree').jstree().get_node(par.parent);
      view.refreshJSTree(grandPar);
      view.selectNode(grandPar, body.File);
    }
  });
}

let toSpatial = (view, node) => {
  let queryStr = `?path=${node.original._path}`;
  let endpoint = path.join(app.getApiPath(), "model/to-spatial") + queryStr;
  app.getXHR(endpoint, {
    success: (err, response, body) => {
      let par = $('#files-jstree').jstree().get_node(node.parent);
      let grandPar = $('#files-jstree').jstree().get_node(par.parent);
      view.refreshJSTree(grandPar);
      updateParent("spatial");
      view.selectNode(grandPar, body.File.replace(".smdl", ".wkgp"));
    }
  });
}

let types = {
  'root' : {"icon": "jstree-icon jstree-folder"},
  'folder' : {"icon": "jstree-icon jstree-folder"},
  'spatial' : {"icon": "jstree-icon jstree-file"},
  'nonspatial' : {"icon": "jstree-icon jstree-file"},
  'workflowGroup' : {"icon": "jstree-icon jstree-folder"},
  'workflow' : {"icon": "jstree-icon jstree-file"},
  'notebook' : {"icon": "jstree-icon jstree-file"},
  'domain' : {"icon": "jstree-icon jstree-file"},
  'sbml-model' : {"icon": "jstree-icon jstree-file"},
  'other' : {"icon": "jstree-icon jstree-file"}
}

let updateParent = (view, type) => {
  let models = ["nonspatial", "spatial", "sbml", "model"];
  let workflows = ["workflow", "notebook"];
  if(models.includes(type)) {
    view.parent.update("Model", "file-browser");
  }else if(workflows.includes(type)) {
    view.parent.update("Workflow", "file-browser");
  }else if(type === "workflowGroup") {
    view.parent.update("Workflow-group", "file-browser");
  }else if(type === "Archive") {
    view.parent.update(type, "file-browser");
  }
}

let validateMove = (view, node, more, pos) => {
  // Check if files are being move directly into the trash and remain static with respect to the trash
  let validDst = Boolean(more && more.ref && more.ref.type && more.ref.original);
  if(validDst && path.dirname(more.ref.original._path).includes("trash")) { return false };
  let validSrc = Boolean(node && node.type && node.original && node.original.text !== "trash");
  if(validSrc && validDst && node.original._path.includes("trash") && more.ref.original.text === 'trash') { return false };

  // Check if workflow is running
  let isWorkflow = Boolean(validSrc && node.type === "workflow");
  if(isWorkflow && node.original._status && node.original._status === "running") { return false };

  // Check if model, workflow, or workflow group is moving to or from trash
  let isWkgp = Boolean(validSrc && node.type === "workflowGroup");
  let trashAction = Boolean((validSrc && node.original._path.includes("trash")) || (validDst && more.ref.original.text === "trash"));
  if(isWkgp && !(view.parent.model.newFormat && trashAction)) { return false };
  let isModel = Boolean(validSrc && (node.type === "nonspatial" || node.type === "spatial"));
  if((isModel || isWorkflow) && !trashAction) { return false };

  // Check if model, workflow, or workflow group is moving from trash to the correct location
  if(validSrc && node.original._path.includes("trash")) {
    if(isWkgp && (!view.parent.model.newFormat || (validDst && more.ref.type !== "root"))) { return false };
    if(isWorkflow && validDst && more.ref.type !== "workflowGroup") { return false };
    if(isModel && validDst) {
      if(!view.parent.model.newFormat && more.ref.type !== "root") { return false };
      let length = node.original.text.split(".").length;
      let modelName = node.original.text.split(".").slice(0, length - 1).join(".");
      if(view.parent.model.newFormat && (more.ref.type !== "workflowGroup" || !more.ref.original.text.startsWith(modelName))) { return false };
    }
  }

  // Check if notebook or other file is moving to a valid location.
  let validDsts = ["root", "folder"];
  let isNotebook = Boolean(validSrc && node.type === "notebook");
  let isOther = Boolean(validSrc && !isModel && !isWorkflow && !isWkgp && !isNotebook);
  if(isOther && validDst && !validDsts.includes(more.ref.type)) { return false };
  validDsts.push("workflowGroup");
  if(isNotebook && validDst && !validDsts.includes(more.ref.type)) { return false };
  
  // Check if file already exists with that name in folder
  if(validDst && validDsts.includes(more.ref.type)){
    if(!more.ref.state.loaded) { return false };
    var text = node.text;
    if(!isNaN(text.split(' ').pop().split('.').join(""))){
      text = text.replace(text.split(' ').pop(), '').trim();
    }
    if(more.ref.text !== "trash"){
      try{
        let BreakException = {};
        more.ref.children.forEach((child) => {
          let child_node = $('#files-jstree').jstree().get_node(child);
          let exists = child_node.text === text;
          if(exists) { throw BreakException; };
        })
      }catch { return false; };
    }
  }

  // Check if curser is over the correct location
  if(more && (pos != 0 || more.pos !== "i") && !more.core) { return false };
  return true;
}

module.exports = {
  contextZipTypes: contextZipTypes,
  doubleClick: doubleClick,
  getDomainContext: getDomainContext,
  getFolderContext: getFolderContext,
  getModelContext: getModelContext,
  getNotebookContext: getNotebookContext,
  // getProjectContext: getOtherContext,
  getRootContext: getRootContext,
  getSpatialModelContext: getSpatialModelContext,
  getWorkflowContext: getWorkflowContext,
  getWorkflowGroupContext: getWorkflowGroupContext,
  move: move,
  setup: setup,
  types: types,
  updateParent: updateParent,
  validateMove: validateMove
}
