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

let contextZipTypes = ["workflow", "folder", "other", "project", "root"];

let doubleClick = (view, e) => {
  let node = $('#files-jstree').jstree().get_node(e.target);
  if(!(node.original._path.split("/")[0] === "trash")) {
    if(node.type === "folder" && $('#files-jstree').jstree().is_open(node) && $('#files-jstree').jstree().is_loaded(node)){
      view.refreshJSTree(node);
    }else if(node.type === "nonspatial" || node.type === "spatial"){
      let queryStr = "?path=" + node.original._path;
      window.location.href = path.join(app.getBasePath(), "stochss/models/edit") + queryStr;
    }else if(node.type === "notebook"){
      window.open(path.join(app.getBasePath(), "notebooks", node.original._path), '_blank');
    }else if(node.type === "sbml-model"){
      window.open(path.join(app.getBasePath(), "edit", node.original._path), '_blank');
    }else if(node.type === "project"){
      let queryStr = "?path=" + node.original._path
      window.location.href = path.join(app.getBasePath(), "stochss/project/manager") + queryStr;
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
      if(node.type === "folder") {
        view.refreshJSTree(node);
      }else if(newDir.endsWith("trash")) {
        $(view.queryByHook('empty-trash')).prop('disabled', false);
        view.refreshJSTree(par);
      }else if(oldPath.split("/").includes("trash")) {
        view.refreshJSTree(par);
      }
    },
    error: (err, response, body) => {
      body = JSON.parse(body);
      view.refreshJSTree(par);
    }
  });
}

types = {
  'root' : {"icon": "jstree-icon jstree-folder"},
  'folder' : {"icon": "jstree-icon jstree-folder"},
  'spatial' : {"icon": "jstree-icon jstree-file"},
  'nonspatial' : {"icon": "jstree-icon jstree-file"},
  'project' : {"icon": "jstree-icon jstree-file"},
  'workflow' : {"icon": "jstree-icon jstree-file"},
  'notebook' : {"icon": "jstree-icon jstree-file"},
  'domain' : {"icon": "jstree-icon jstree-file"},
  'sbml-model' : {"icon": "jstree-icon jstree-file"},
  'other' : {"icon": "jstree-icon jstree-file"},
}

validateMove = (view, node, more) => {
  // Check if workflow is running
  let validSrc = Boolean(node && node.type && node.original && node.original.text !== "trash");
  let isWorkflow = Boolean(validSrc && node.type === "workflow");
  if(isWorkflow && node.original._status && node.original._status === "running") { return false };

  // Check if file is moving to a valid location
  let validDsts = ["root", "folder"];
  let validDst = Boolean(more && more.ref && more.ref.type && more.ref.original);
  if(validDst && !validDsts.includes(more.ref.type)) { return false };
  if(validDst && path.dirname(more.ref.original._path).split("/").includes("trash")) { return false };
  
  // Check if file already exists with that name in folder
  if(validDst && more.ref.type === 'folder' && more.ref.text !== "trash"){
    if(!more.ref.state.loaded) { return false };
    try{
      let BreakException = {};
      more.ref.children.forEach(function (child) {
        let child_node = $('#files-jstree').jstree().get_node(child);
        let exists = child_node.text === node.text;
        if(exists) { throw BreakException; };
      });
    }catch{ return false; };
  }
  
  // Check if curser is over the correct location
  if(more && (pos != 0 || more.pos !== "i") && !more.core) { return false };
  return true;
}

module.exports = {
  contextZipTypes: contextZipTypes,
  doubleClick: doubleClick,
  move: move,
  types: types,
  validateMove: validateMove
}
