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

let contextZipTypes = ["workflow", "folder", "other", "root", "workflow-group"];

let doubleClick = (view, e) => {
  let node = $('#files-jstree').jstree().get_node(e.target);
  if(!node.original._path.includes(".proj/trash/")){
    if((node.type === "folder" || node.type === "workflow-group") && $('#files-jstree').jstree().is_open(node) && $('#files-jstree').jstree().is_loaded(node)){
      view.refreshJSTree(node);
    }else if(node.type === "nonspatial" || node.type === "spatial"){
      let queryStr = "?path=" + node.original._path;
      window.location.href = path.join(app.getBasePath(), "stochss/models/edit") + queryStr;
    }else if(node.type === "notebook"){
      window.open(path.join(app.getBasePath(), "notebooks", node.original._path), '_blank');
    }else if(node.type === "sbml-model"){
      window.open(path.join(app.getBasePath(), "edit", node.original._path), '_blank');
    }else if(node.type === "workflow"){
      let queryStr = "?path=" + node.original._path + "&type=none";
      window.location.href = path.join(app.getBasePath(), "stochss/workflow/edit") + queryStr;
    }else if(node.type === "domain") {
      let queryStr = "?domainPath=" + node.original._path;
      window.location.href = path.join(app.getBasePath(), "stochss/domain/edit") + queryStr
    }else if(node.type === "other"){
      var openPath = path.join(app.getBasePath(), "view", node.original._path);
      window.open(openPath, "_blank");
    }
  }
}

let move = (view, par, node) => {
  let newDir = par.original._path !== "/" ? par.original._path : "";
  let file = node.original._path.split('/').pop();
  let oldPath = node.original._path;
  let queryStr = "?srcPath=" + oldPath + "&dstPath=" + path.join(newDir, file);
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

let types = {
  'root' : {"icon": "jstree-icon jstree-folder"},
  'folder' : {"icon": "jstree-icon jstree-folder"},
  'spatial' : {"icon": "jstree-icon jstree-file"},
  'nonspatial' : {"icon": "jstree-icon jstree-file"},
  'workflow-group' : {"icon": "jstree-icon jstree-folder"},
  'workflow' : {"icon": "jstree-icon jstree-file"},
  'notebook' : {"icon": "jstree-icon jstree-file"},
  'domain' : {"icon": "jstree-icon jstree-file"},
  'sbml-model' : {"icon": "jstree-icon jstree-file"},
  'other' : {"icon": "jstree-icon jstree-file"},
}

let updateParent = (view, type) => {
  let models = ["nonspatial", "spatial", "sbml", "model"];
  let workflows = ["workflow", "notebook"];
  if(models.includes(type)) {
    view.parent.update("Model", "file-browser");
  }else if(workflows.includes(type)) {
    view.parent.update("Workflow", "file-browser");
  }else if(type === "workflow-group") {
    view.parent.update("WorkflowGroup", "file-browser");
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
  let isWkgp = Boolean(validSrc && node.type === "workflow-group");
  let trashAction = Boolean((validSrc && node.original._path.includes("trash")) || (validDst && more.ref.original.text === "trash"));
  if(isWkgp && !(view.parent.model.newFormat && trashAction)) { return false };
  let isModel = Boolean(validSrc && (node.type === "nonspatial" || node.type === "spatial"));
  if((isModel || isWorkflow) && !trashAction) { return false };

  // Check if model, workflow, or workflow group is moving from trash to the correct location
  if(validSrc && node.original._path.includes("trash")) {
    if(isWkgp && (!view.parent.model.newFormat || (validDst && more.ref.type !== "root"))) { return false };
    if(isWorkflow && validDst && more.ref.type !== "workflow-group") { return false };
    if(isModel && validDst) {
      if(!view.parent.model.newFormat && more.ref.type !== "root") { return false };
      let length = node.original.text.split(".").length;
      let modelName = node.original.text.split(".").slice(0, length - 1).join(".");
      if(view.parent.model.newFormat && (more.ref.type !== "workflow-group" || !more.ref.original.text.startsWith(modelName))) { return false };
    }
  }

  // Check if notebook or other file is moving to a valid location.
  let validDsts = ["root", "folder"];
  let isNotebook = Boolean(validSrc && node.type === "notebook");
  let isOther = Boolean(validSrc && !isModel && !isWorkflow && !isWkgp && !isNotebook);
  if(isOther && validDst && !validDsts.includes(more.ref.type)) { return false };
  validDsts.push("workflow-group");
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
  move: move,
  setup: setup,
  types: types,
  updateParent: updateParent,
  validateMove: validateMove
}
