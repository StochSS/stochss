/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"browser": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./client/pages/file-browser.js","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/pages/file-browser.js":
/*!**************************************!*\
  !*** ./client/pages/file-browser.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page.js */ "./client/pages/page.js");
let jstree = __webpack_require__(/*! jstree */ "./node_modules/jstree/dist/jstree.js");
let path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
let xhr = __webpack_require__(/*! xhr */ "./node_modules/xhr/index.js");
let PageView = __webpack_require__(/*! ./base */ "./client/pages/base.js");
let template = __webpack_require__(/*! ../templates/pages/fileBrowser.pug */ "./client/templates/pages/fileBrowser.pug");
let $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//let bootstrap = require('bootstrap');



let ajaxData = {
  "url" : function (node) {
    if(node.parent === null){
      return "/stochss/models/browser-list/"
    }
    return "/stochss/models/browser-list" + node.original._path
  },
  "dataType" : "json",
  "data" : function (node) {
    return { 'id' : node.id}
  },
}

let treeSettings = {
  'plugins': [
    'types',
    'wholerow',
    'changed',
    'contextmenu',
    'dnd',
  ],
  'core': {
    'multiple' : false,
    'animation': 0,
    'check_callback': function (op, node, par, pos, more) {
      if(op === 'move_node' && more && more.ref && more.ref.type && !(more.ref.type == 'folder' || more.ref.type == 'root')){
        return false
      }
      if(op === 'move_node' && more && more.ref && more.ref.type && more.ref.type === 'folder'){
        if(!more.ref.state.loaded){
          return false
        }
        var exists = false
        var BreakException = {}
        try{
          more.ref.children.forEach(function (child) {
            var child_node = $('#models-jstree').jstree().get_node(child)
            exists = child_node.text === node.text
            if(exists){
              throw BreakException;
            }
          })
        }catch{
          return false;
        }
      }
      if(op === 'move_node' && more && (pos != 0 || more.pos !== "i") && !more.core){
        return false
      }
      if(op === 'move_node' && more && more.core) {
        var newDir = par.original._path
        var file = node.original._path.split('/').pop()
        var oldPath = node.original._path
        var endpoint = path.join("/stochss/api/file/move", oldPath, '<--MoveTo-->', newDir, file)
        xhr({uri: endpoint}, function(err, response, body) {
          if(body.startsWith("Success!")) {
            node.original._path = path.join(newDir, file)
            if(par.type === 'root'){
              $('#models-jstree').jstree().refresh()
            }else{
              $('#models-jstree').jstree().refresh_node(par);
            }
          }
        });
      }
      return true
    },
    'themes': {
      'stripes': true,
      'variant': 'large'
    },
    'data': ajaxData,
  },
  'types' : {
    'root' : {
      "icon": "jstree-icon jstree-folder"
    },
    'folder' : {
      "icon": "jstree-icon jstree-folder"
    },
    'spatial' : {
      "icon": "jstree-icon jstree-file"
    },
    'nonspatial' : {
      "icon": "jstree-icon jstree-file"
    },
    'workflow' : {
      "icon": "jstree-icon jstree-file"
    },
    'notebook' : {
      "icon": "jstree-icon jstree-file"
    },
    'mesh' : {
      "icon": "jstree-icon jstree-file"
    },
    'sbml-model' : {
      "icon": "jstree-icon jstree-file"
    },
    'other' : {
      "icon": "jstree-icon jstree-file"
    },
  },  
}

let operationInfoModalHtml = () => {
  let fileBrowserHelpMessage = `
    <p><b>Open/Edit a File</b>: Double-click on a file or right-click on a file and click Open/Edit.  
    <b>Note</b>: Some files will open in a new tab so you may want to turn off the pop-up blocker.</p>
    <p><b>Open Directory</b>: Click on the arrow next to the directory or double-click on the directory.</p>
    <p><b>Create a Directory/Model</b>: Right-click on a directory, click New Directory/New Model, and enter the name of directory/model or path.  
    For models you will need to click on the type of model you wish to create before entering the name or path.</p>
    <p><b>Create a Workflow</b>: Right-click on a model and click New Workflow, this takes you to the workflow selection page.  
    From the workflow selection page, click on one of the listed workflows.</p>
    <p><b>Convert a File</b>: Right-click on a Model/SBML, click Convert, and click on the desired Convert to option.  
    Model files can be converted to Spatial Models, Notebooks, or SBML files.  
    Spatial Models and SBML file can be converted to Models.  
    <b>Note</b>: Notebooks will open in a new tab so you may want to turn off the pop-up blocker.</p>
    <p><b>Move File or Directory</b>: Click and drag the file or directory to the new location.  
    You can only move an item to a directory if there isn't a file or directory with the same name in that location.</p>
    <p><b>Download a Model/Notebook/SBML File</b>: Right-click on the file and click download.</p>
    <p><b>Rename File/Directory</b>: Right-click on a file/directory, click rename, and enter the new name.</p>
    <p><b>Duplicate/Delete A File/Directory</b>: Right-click on the file/directory and click Duplicate/Delete.</p>
  `;
  
  return `
    <div id="operationInfoModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> File Browser Help </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${fileBrowserHelpMessage} </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  ` 
}

// Using a bootstrap modal to input model names for now
let renderCreateModalHtml = (isModel, isSpatial) => {
  var titleText = 'Directory';
  if(isModel){
    titleText = isSpatial ? 'Spatial Model' : 'Non-Spatial Model';
  }
  return `
    <div id="newModalModel" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New ${titleText}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label for="modelNameInput">Name:</label>
            <input type="text" id="modelNameInput" name="modelNameInput" size="30" autofocus>
	        </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary ok-model-btn">OK</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
}

let sbmlToModelHtml = (title, errors) => {
  for(var i = 0; i < errors.length; i++) {
    if(errors[i].startsWith("SBML Error") || errors[i].startsWith("Error")){
      errors[i] = "<b>Error</b>: " + errors[i]
    }else{
      errors[i] = "<b>Warning</b>: " + errors[i]
    }
  }

  return `
    <div id="sbmlToModelModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> ${title} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${errors.join("<br>")} </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
}

let deleteFileHtml = (fileType) => {
  return `
    <div id="deleteFileModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Permanently delete this ${fileType}? </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary yes-modal-btn">Yes</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
          </div>
        </div>
      </div>
    </div>
  `
}

let FileBrowser = PageView.extend({
  pageTitle: 'StochSS | File Browser',
  template: template,
  events: {
    'click [data-hook=refresh-jstree]' : 'refreshJSTree',
    'click [data-hook=file-browser-help]' : function () {
      let modal = $(operationInfoModalHtml()).modal();
    },
  },
  render: function () {
    var self = this;
    this.renderWithTemplate();
    this.setupJstree();
    setTimeout(function () {
      self.refreshInitialJSTree();
    }, 3000);
  },
  refreshJSTree: function () {
    $('#models-jstree').jstree().refresh()
  },
  refreshInitialJSTree: function () {
    var self = this;
    var count = $('#models-jstree').jstree()._model.data['#'].children.length;
    if(count == 0) {
      self.refreshJSTree();
      setTimeout(function () {
        self.refreshInitialJSTree();
      }, 3000);
    }
  },
  deleteFile: function (o) {
    var fileType = o.type
    if(fileType === "nonspatial")
      fileType = "model";
    else if(fileType === "spatial")
      fileType = "spatial model"
    else if(fileType === "sbml-model")
      fileType = "sbml model"
    var self = this
    if(document.querySelector('#deleteFileModal')) {
      document.querySelector('#deleteFileModal').remove()
    }
    let modal = $(deleteFileHtml(fileType)).modal();
    let yesBtn = document.querySelector('#deleteFileModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      var endpoint = path.join("/stochss/api/file/delete", o.original._path)
      xhr({uri: endpoint}, function(err, response, body) {
        var node = $('#models-jstree').jstree().get_node(o.parent);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh();
        }else{
          $('#models-jstree').jstree().refresh_node(node);
        }
      })
      modal.modal('hide')
    });
  },
  duplicateFileOrDirectory: function(o, isDirectory) {
    var self = this;
    var parentID = o.parent;
    if(isDirectory){
      var endpoint = path.join("/stochss/api/directory/duplicate", o.original._path);
    }else{
      var endpoint = path.join("/stochss/api/model/duplicate", o.original._path);
    }
    xhr({uri: endpoint}, 
      function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh()
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
      }
    );
  },
  toSpatial: function (o) {
    var self = this;
    var parentID = o.parent;
    var endpoint = path.join("/stochss/api/model/to-spatial", o.original._path);
    xhr({uri: endpoint}, 
      function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh()
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
      }
    );
  },
  toModel: function (o, from) {
    var self = this;
    var parentID = o.parent;
    if(from === "Spatial"){
      var endpoint = path.join("/stochss/api/spatial/to-model", o.original._path);
    }else{
      var endpoint = path.join("/stochss/api/sbml/to-model", o.original._path);
    }
    xhr({uri: endpoint}, 
      function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh()
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
        if(from === "SBML"){
          var title = ""
          var resp = JSON.parse(body)
          var msg = resp.message
          var errors = resp.errors
          let modal = $(sbmlToModelHtml(msg, errors)).modal();
        }
      }
    );
  },
  toSBML: function (o) {
    var self = this;
    var parentID = o.parent;
    var endpoint = path.join("/stochss/api/model/to-sbml", o.original._path);
    xhr({uri: endpoint},
      function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh()
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
      }
    );
  },
  renameNode: function (o) {
    var self = this
    var text = o.text;
    var parent = $('#models-jstree').jstree().get_node(o.parent)
    var extensionWarning = $(this.queryByHook('extension-warning'));
    var nameWarning = $(this.queryByHook('rename-warning'));
    extensionWarning.collapse('show')
    $('#models-jstree').jstree().edit(o, null, function(node, status) {
      if(text != node.text){
        var endpoint = path.join("/stochss/api/file/rename", o.original._path, "<--change-->", node.text)
        xhr({uri: endpoint}, function (err, response, body){
          var resp = JSON.parse(body)
          if(!resp.message.startsWith('Success!')) {
            nameWarning.html(resp.message)
            nameWarning.collapse('show');
          }
          node.original._path = resp._path
          if(parent.type === "root"){
            $('#models-jstree').jstree().refresh()
          }else{          
            $('#models-jstree').jstree().refresh_node(parent);
          }
        })
      }
      extensionWarning.collapse('hide');
      nameWarning.collapse('hide');
    });
  },
  getJsonFileForExport: function (o) {
    var self = this;
    var endpoint = path.join("/stochss/api/json-data", o.original._path);
    xhr({uri: endpoint}, function (err, response, body) {
      var resp = JSON.parse(body);
      self.exportToJsonFile(resp, o.original.text);
    });
  },
  getFileForExport: function (o) {
    var self = this;
    var endpoint = path.join("/stochss/api/file/download", o.original._path);
    xhr({uri: endpoint}, function (err, response, body) {
      self.exportToFile(body, o.original.text);
    });
  },
  getZipFileForExport: function (o) {
    var self = this;
    var endpoint = path.join("/stochss/api/file/download-zip/generate", o.original._path);
    xhr({uri: endpoint}, function (err, response, body) {
      var filePath = body.split('/home/jovyan').pop()
      var node = $('#models-jstree').jstree().get_node(o.parent);
      if(node.type === "root"){
        $('#models-jstree').jstree().refresh();
      }else{
        $('#models-jstree').jstree().refresh_node(node);
      }
      self.exportToZipFile(filePath)
    });
  },
  exportToJsonFile: function (fileData, fileName) {
    let dataStr = JSON.stringify(fileData);
    let dataURI = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = fileName

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  exportToFile: function (fileData, fileName) {
    let dataURI = 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData);

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  },
  exportToZipFile: function (o) {
    var targetPath = o
    if(o.original){
      targetPath = o.original._path
    }
    var endpoint = path.join("/files", targetPath);
    window.location.href = endpoint
  },
  newModelOrDirectory: function (o, isModel, isSpatial) {
    var self = this
    if(document.querySelector('#newModalModel')) {
      document.querySelector('#newModalModel').remove()
    }
    let modal = $(renderCreateModalHtml(isModel, isSpatial)).modal();
    let okBtn = document.querySelector('#newModalModel .ok-model-btn');
    let input = document.querySelector('#newModalModel #modelNameInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    let modelName;
    okBtn.addEventListener('click', function (e) {
      if (Boolean(input.value)) {
        if(isModel) {
          let modelName = input.value + '.mdl';
          var parentPath = o.original._path
          var modelPath = path.join("/stochss/models/edit", parentPath, modelName);
          window.location.href = modelPath;
        }else{
          let dirName = input.value;
          var parentPath = o.original._path;
          let endpoint = path.join("/stochss/api/directory/create", parentPath, dirName);
          xhr({uri:endpoint}, function (err, response, body) {
            var node = $('#models-jstree').jstree().get_node(o);
            if(node.type === "root"){
              $('#models-jstree').jstree().refresh()
            }else{          
              $('#models-jstree').jstree().refresh_node(node);
            }
          });
          modal.modal('hide')
        }
      }
    });
  },
  setupJstree: function () {
    var self = this;
    $.jstree.defaults.contextmenu.items = (o, cb) => {
      if (o.type === 'root'){
        return {
          "Refresh" : {
            "label" : "Refresh",
            "_disabled" : false,
            "_class" : "font-weight-bold",
            "separator_before" : false,
            "separator_after" : true,
            "action" : function (data) {
              $('#models-jstree').jstree().refresh();
            }
          },
          "New_Directory" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "New Directory",
            "action" : function (data) {
              self.newModelOrDirectory(o, false, false);
            }
          },
          "New_model" : {
            "label" : "New Model",
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "submenu" : {
              "spatial" : {
                "label" : "Spatial",
                "_disabled" : true,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {

                }
              },
              "nonspatial" : { 
                "label" : "Non-Spatial",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  self.newModelOrDirectory(o, true, false);
                }
              } 
            }
          },
        }
      }
      else if (o.type ===  'folder') {
        return {
          "Refresh" : {
            "label" : "Refresh",
            "_disabled" : false,
            "_class" : "font-weight-bold",
            "separator_before" : false,
            "separator_after" : true,
            "action" : function (data) {
              $('#models-jstree').jstree().refresh_node(o);
            }
          },
          "New_Directory" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "New Directory",
            "action" : function (data) {
              self.newModelOrDirectory(o, false, false);
            }
          },
          "New_model" : {
            "label" : "New Model",
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "submenu" : {
              "spatial" : {
                "label" : "Spatial",
                "_disabled" : true,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {

                }
              },
              "nonspatial" : { 
                "label" : "Non-Spatial",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  self.newModelOrDirectory(o, true, false);
                }
              } 
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download as .zip",
            "action" : function (data) {
              self.getZipFileForExport(o);
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, true)
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
      else if (o.type === 'spatial') {
        return {
          "Edit" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : true,
            "_class" : "font-weight-bolder",
            "label" : "Edit",
            "action" : function (data) {
              window.location.href = path.join("/stochss/models/edit", o.original._path);
            }
          },
          "Convert" : {
            "label" : "Convert",
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "submenu" : {
              "Convert to Model" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : false,
                "label" : "Convert to Non Spatial",
                "action" : function (data) {
                  self.toModel(o, "Spatial");
                }
              },
              "Convert to Notebook" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : true,
                "label" : "Convert to Notebook",
                "action" : function (data) {
                }
              },
            }
          },
          "New Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "New Workflow",
            "action" : function (data) {
              window.location.href = path.join("/stochss/workflow/selection", o.original._path);
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
      else if (o.type === 'nonspatial') {
         return {
          "Edit" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Edit",
            "action" : function (data) {
              window.location.href = path.join("/stochss/models/edit", o.original._path);
            }
          },
          "Convert" : {
            "label" : "Convert",
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "submenu" : {
              "Convert to Spatial" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : false,
                "label" : "To Spatial Model",
                "action" : function (data) {
                  self.toSpatial(o)
                }
              },
              "Convert to Notebook" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : false,
                "label" : "To Notebook",
                "action" : function (data) {
                  var endpoint = path.join("/stochss/api/models/to-notebook", o.original._path)
                  xhr({ uri: endpoint },
                        function (err, response, body) {
                    var node = $('#models-jstree').jstree().get_node(o.parent)
                    if(node.type === 'root'){
                      $('#models-jstree').jstree().refresh();
                    }else{
                      $('#models-jstree').jstree().refresh_node(node);
                    }
                    var _path = body.split(' ')[0].split('/home/jovyan/').pop()
                    var notebookPath = path.join("/lab/tree", _path)
                    window.open(notebookPath, '_blank')
                  });
                }
              },
              "Convert to SBML" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : false,
                "label" : "To SBML Model",
                "action" : function (data) {
                  self.toSBML(o)
                }
              },
            }
          },
          "New Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "New Workflow",
            "action" : function (data) {
              window.location.href = path.join("/stochss/workflow/selection", o.original._path);
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download",
            "action" : function (data) {
              self.getJsonFileForExport(o);
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
	      }
      }
      else if (o.type === 'workflow') {
        return {
          "Open" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Open",
            "action" : function (data) {
              window.location.href = path.join("/stochss/workflow/edit/none", o.original._path);
            }
          },
          "Start/Restart Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Start/Restart Workflow",
            "action" : function (data) {

            }
          },
          "Stop Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Stop Workflow",
            "action" : function (data) {

            }
          },
          "Model" : {
            "separator_before" : false,
            "separator_after" : false,
            "label" : "Model",
            "_disabled" : false,
            "submenu" : {
              "Edit" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : true,
                "label" : " Edit",
                "action" : function (data) {

                }
              },
              "Duplicate" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : true,
                "label" : "Duplicate",
                "action" : function (data) {

                }
              }
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download as .zip",
            "action" : function (data) {
              self.getZipFileForExport(o);
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
      else if (o.type === 'notebook') {
        return {
          "Open" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Open",
            "action" : function (data) {
              window.open(path.join("/lab/tree", o.original._path));
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download",
            "action" : function (data) {
              self.getJsonFileForExport(o);
      	    }
      	  },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
      else if (o.type === 'sbml-model') {
        return {
          "Open" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Open File",
            "action" : function (data) {
              var filePath = o.original._path
              window.open(path.join("/lab/tree", filePath), '_blank')
            }
          },
          "Convert" : {
            "label" : "Convert",
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "submenu" : {
              "Convert to Model" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : false,
                "label" : "To Model",
                "action" : function (data) {
                  self.toModel(o, "SBML");
                }
              },
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download",
            "action" : function (data) {
              self.getFileForExport(o);
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
      else {
        return {
          "Open" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : true,
            "_class" : "font-weight-bolder",
            "label" : "Open",
            "action" : function (data) {
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download as .zip",
            "action" : function (data) {
              if(o.original.text.endsWith('.zip')){
                self.exportToZipFile(o);
              }else{
                self.getZipFileForExport(o)
              }
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
    }
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    $(document).on('dnd_start.vakata', function (data, element, helper, event) {
      $('#models-jstree').jstree().load_all()
    });
    $('#models-jstree').jstree(treeSettings)
    $('#models-jstree').on('click.jstree', function(e) {
      var parent = e.target.parentElement
      var _node = parent.children[parent.children.length - 1]
      var node = $('#models-jstree').jstree().get_node(_node)
      if(_node.nodeName === "A" && $('#models-jstree').jstree().is_loaded(node) && node.type === "folder"){
        $('#models-jstree').jstree().refresh_node(node)
      }
    });
    $('#models-jstree').on('dblclick.jstree', function(e) {
      var file = e.target.text
      var node = $('#models-jstree').jstree().get_node(e.target)
      var _path = node.original._path;
      if(file.endsWith('.mdl') || file.endsWith('.smdl')){
        window.location.href = path.join("/stochss/models/edit", _path);
      }else if(file.endsWith('.ipynb')){
        var notebookPath = path.join("/lab/tree/", _path)
        window.open(notebookPath, '_blank')
      }else if(file.endsWith('.sbml')){
        var openPath = path.join("/lab/tree/", _path)
        window.open(openPath, '_blank')
      }else if(file.endsWith('.wkfl')){
        window.location.href = path.join("/stochss/workflow/edit/none", _path);
      }else if(node.type === "folder" && $('#models-jstree').jstree().is_open(node) && $('#models-jstree').jstree().is_loaded(node)){
        $('#models-jstree').jstree().refresh_node(node)
      }
    });
  }
});

Object(_page_js__WEBPACK_IMPORTED_MODULE_0__["default"])(FileBrowser);


/***/ }),

/***/ "./client/templates/pages/fileBrowser.pug":
/*!************************************************!*\
  !*** ./client/templates/pages/fileBrowser.pug ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Csection class=\"page col-md-10\"\u003E\u003Cdiv class=\"row\"\u003E\u003Ch2\u003EFile Browser\u003C\u002Fh2\u003E\u003Cbutton class=\"btn information-btn help\" data-hook=\"file-browser-help\"\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"far\" data-icon=\"question-circle\" class=\"svg-inline--fa fa-question-circle fa-w-16\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 512 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"alert-warning collapse\" data-hook=\"extension-warning\"\u003EYou should avoid changing the file extension unless you know what you are doing!\u003C\u002Fdiv\u003E\u003Cdiv class=\"alert-warning collapse\" data-hook=\"rename-warning\"\u003EMESSAGE\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-lg-10\" id=\"models-jstree\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" data-hook=\"refresh-jstree\"\u003ERefresh\u003C\u002Fbutton\u003E\u003C\u002Fsection\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./node_modules/jstree/dist/jstree.js":
/*!********************************************!*\
  !*** ./node_modules/jstree/dist/jstree.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*globals jQuery, define, module, exports, require, window, document, postMessage */
(function (factory) {
	"use strict";
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	else {}
}(function ($, undefined) {
	"use strict";
/*!
 * jsTree 3.3.8
 * http://jstree.com/
 *
 * Copyright (c) 2014 Ivan Bozhanov (http://vakata.com)
 *
 * Licensed same as jquery - under the terms of the MIT License
 *   http://www.opensource.org/licenses/mit-license.php
 */
/*!
 * if using jslint please allow for the jQuery global and use following options:
 * jslint: loopfunc: true, browser: true, ass: true, bitwise: true, continue: true, nomen: true, plusplus: true, regexp: true, unparam: true, todo: true, white: true
 */
/*jshint -W083 */

	// prevent another load? maybe there is a better way?
	if($.jstree) {
		return;
	}

	/**
	 * ### jsTree core functionality
	 */

	// internal variables
	var instance_counter = 0,
		ccp_node = false,
		ccp_mode = false,
		ccp_inst = false,
		themes_loaded = [],
		src = $('script:last').attr('src'),
		document = window.document; // local variable is always faster to access then a global

	/**
	 * holds all jstree related functions and variables, including the actual class and methods to create, access and manipulate instances.
	 * @name $.jstree
	 */
	$.jstree = {
		/**
		 * specifies the jstree version in use
		 * @name $.jstree.version
		 */
		version : '3.3.8',
		/**
		 * holds all the default options used when creating new instances
		 * @name $.jstree.defaults
		 */
		defaults : {
			/**
			 * configure which plugins will be active on an instance. Should be an array of strings, where each element is a plugin name. The default is `[]`
			 * @name $.jstree.defaults.plugins
			 */
			plugins : []
		},
		/**
		 * stores all loaded jstree plugins (used internally)
		 * @name $.jstree.plugins
		 */
		plugins : {},
		path : src && src.indexOf('/') !== -1 ? src.replace(/\/[^\/]+$/,'') : '',
		idregex : /[\\:&!^|()\[\]<>@*'+~#";.,=\- \/${}%?`]/g,
		root : '#'
	};
	
	/**
	 * creates a jstree instance
	 * @name $.jstree.create(el [, options])
	 * @param {DOMElement|jQuery|String} el the element to create the instance on, can be jQuery extended or a selector
	 * @param {Object} options options for this instance (extends `$.jstree.defaults`)
	 * @return {jsTree} the new instance
	 */
	$.jstree.create = function (el, options) {
		var tmp = new $.jstree.core(++instance_counter),
			opt = options;
		options = $.extend(true, {}, $.jstree.defaults, options);
		if(opt && opt.plugins) {
			options.plugins = opt.plugins;
		}
		$.each(options.plugins, function (i, k) {
			if(i !== 'core') {
				tmp = tmp.plugin(k, options[k]);
			}
		});
		$(el).data('jstree', tmp);
		tmp.init(el, options);
		return tmp;
	};
	/**
	 * remove all traces of jstree from the DOM and destroy all instances
	 * @name $.jstree.destroy()
	 */
	$.jstree.destroy = function () {
		$('.jstree:jstree').jstree('destroy');
		$(document).off('.jstree');
	};
	/**
	 * the jstree class constructor, used only internally
	 * @private
	 * @name $.jstree.core(id)
	 * @param {Number} id this instance's index
	 */
	$.jstree.core = function (id) {
		this._id = id;
		this._cnt = 0;
		this._wrk = null;
		this._data = {
			core : {
				themes : {
					name : false,
					dots : false,
					icons : false,
					ellipsis : false
				},
				selected : [],
				last_error : {},
				working : false,
				worker_queue : [],
				focused : null
			}
		};
	};
	/**
	 * get a reference to an existing instance
	 *
	 * __Examples__
	 *
	 *	// provided a container with an ID of "tree", and a nested node with an ID of "branch"
	 *	// all of there will return the same instance
	 *	$.jstree.reference('tree');
	 *	$.jstree.reference('#tree');
	 *	$.jstree.reference($('#tree'));
	 *	$.jstree.reference(document.getElementByID('tree'));
	 *	$.jstree.reference('branch');
	 *	$.jstree.reference('#branch');
	 *	$.jstree.reference($('#branch'));
	 *	$.jstree.reference(document.getElementByID('branch'));
	 *
	 * @name $.jstree.reference(needle)
	 * @param {DOMElement|jQuery|String} needle
	 * @return {jsTree|null} the instance or `null` if not found
	 */
	$.jstree.reference = function (needle) {
		var tmp = null,
			obj = null;
		if(needle && needle.id && (!needle.tagName || !needle.nodeType)) { needle = needle.id; }

		if(!obj || !obj.length) {
			try { obj = $(needle); } catch (ignore) { }
		}
		if(!obj || !obj.length) {
			try { obj = $('#' + needle.replace($.jstree.idregex,'\\$&')); } catch (ignore) { }
		}
		if(obj && obj.length && (obj = obj.closest('.jstree')).length && (obj = obj.data('jstree'))) {
			tmp = obj;
		}
		else {
			$('.jstree').each(function () {
				var inst = $(this).data('jstree');
				if(inst && inst._model.data[needle]) {
					tmp = inst;
					return false;
				}
			});
		}
		return tmp;
	};
	/**
	 * Create an instance, get an instance or invoke a command on a instance.
	 *
	 * If there is no instance associated with the current node a new one is created and `arg` is used to extend `$.jstree.defaults` for this new instance. There would be no return value (chaining is not broken).
	 *
	 * If there is an existing instance and `arg` is a string the command specified by `arg` is executed on the instance, with any additional arguments passed to the function. If the function returns a value it will be returned (chaining could break depending on function).
	 *
	 * If there is an existing instance and `arg` is not a string the instance itself is returned (similar to `$.jstree.reference`).
	 *
	 * In any other case - nothing is returned and chaining is not broken.
	 *
	 * __Examples__
	 *
	 *	$('#tree1').jstree(); // creates an instance
	 *	$('#tree2').jstree({ plugins : [] }); // create an instance with some options
	 *	$('#tree1').jstree('open_node', '#branch_1'); // call a method on an existing instance, passing additional arguments
	 *	$('#tree2').jstree(); // get an existing instance (or create an instance)
	 *	$('#tree2').jstree(true); // get an existing instance (will not create new instance)
	 *	$('#branch_1').jstree().select_node('#branch_1'); // get an instance (using a nested element and call a method)
	 *
	 * @name $().jstree([arg])
	 * @param {String|Object} arg
	 * @return {Mixed}
	 */
	$.fn.jstree = function (arg) {
		// check for string argument
		var is_method	= (typeof arg === 'string'),
			args		= Array.prototype.slice.call(arguments, 1),
			result		= null;
		if(arg === true && !this.length) { return false; }
		this.each(function () {
			// get the instance (if there is one) and method (if it exists)
			var instance = $.jstree.reference(this),
				method = is_method && instance ? instance[arg] : null;
			// if calling a method, and method is available - execute on the instance
			result = is_method && method ?
				method.apply(instance, args) :
				null;
			// if there is no instance and no method is being called - create one
			if(!instance && !is_method && (arg === undefined || $.isPlainObject(arg))) {
				$.jstree.create(this, arg);
			}
			// if there is an instance and no method is called - return the instance
			if( (instance && !is_method) || arg === true ) {
				result = instance || false;
			}
			// if there was a method call which returned a result - break and return the value
			if(result !== null && result !== undefined) {
				return false;
			}
		});
		// if there was a method call with a valid return value - return that, otherwise continue the chain
		return result !== null && result !== undefined ?
			result : this;
	};
	/**
	 * used to find elements containing an instance
	 *
	 * __Examples__
	 *
	 *	$('div:jstree').each(function () {
	 *		$(this).jstree('destroy');
	 *	});
	 *
	 * @name $(':jstree')
	 * @return {jQuery}
	 */
	$.expr.pseudos.jstree = $.expr.createPseudo(function(search) {
		return function(a) {
			return $(a).hasClass('jstree') &&
				$(a).data('jstree') !== undefined;
		};
	});

	/**
	 * stores all defaults for the core
	 * @name $.jstree.defaults.core
	 */
	$.jstree.defaults.core = {
		/**
		 * data configuration
		 *
		 * If left as `false` the HTML inside the jstree container element is used to populate the tree (that should be an unordered list with list items).
		 *
		 * You can also pass in a HTML string or a JSON array here.
		 *
		 * It is possible to pass in a standard jQuery-like AJAX config and jstree will automatically determine if the response is JSON or HTML and use that to populate the tree.
		 * In addition to the standard jQuery ajax options here you can suppy functions for `data` and `url`, the functions will be run in the current instance's scope and a param will be passed indicating which node is being loaded, the return value of those functions will be used.
		 *
		 * The last option is to specify a function, that function will receive the node being loaded as argument and a second param which is a function which should be called with the result.
		 *
		 * __Examples__
		 *
		 *	// AJAX
		 *	$('#tree').jstree({
		 *		'core' : {
		 *			'data' : {
		 *				'url' : '/get/children/',
		 *				'data' : function (node) {
		 *					return { 'id' : node.id };
		 *				}
		 *			}
		 *		});
		 *
		 *	// direct data
		 *	$('#tree').jstree({
		 *		'core' : {
		 *			'data' : [
		 *				'Simple root node',
		 *				{
		 *					'id' : 'node_2',
		 *					'text' : 'Root node with options',
		 *					'state' : { 'opened' : true, 'selected' : true },
		 *					'children' : [ { 'text' : 'Child 1' }, 'Child 2']
		 *				}
		 *			]
		 *		}
		 *	});
		 *
		 *	// function
		 *	$('#tree').jstree({
		 *		'core' : {
		 *			'data' : function (obj, callback) {
		 *				callback.call(this, ['Root 1', 'Root 2']);
		 *			}
		 *		});
		 *
		 * @name $.jstree.defaults.core.data
		 */
		data			: false,
		/**
		 * configure the various strings used throughout the tree
		 *
		 * You can use an object where the key is the string you need to replace and the value is your replacement.
		 * Another option is to specify a function which will be called with an argument of the needed string and should return the replacement.
		 * If left as `false` no replacement is made.
		 *
		 * __Examples__
		 *
		 *	$('#tree').jstree({
		 *		'core' : {
		 *			'strings' : {
		 *				'Loading ...' : 'Please wait ...'
		 *			}
		 *		}
		 *	});
		 *
		 * @name $.jstree.defaults.core.strings
		 */
		strings			: false,
		/**
		 * determines what happens when a user tries to modify the structure of the tree
		 * If left as `false` all operations like create, rename, delete, move or copy are prevented.
		 * You can set this to `true` to allow all interactions or use a function to have better control.
		 *
		 * __Examples__
		 *
		 *	$('#tree').jstree({
		 *		'core' : {
		 *			'check_callback' : function (operation, node, node_parent, node_position, more) {
		 *				// operation can be 'create_node', 'rename_node', 'delete_node', 'move_node', 'copy_node' or 'edit'
		 *				// in case of 'rename_node' node_position is filled with the new node name
		 *				return operation === 'rename_node' ? true : false;
		 *			}
		 *		}
		 *	});
		 *
		 * @name $.jstree.defaults.core.check_callback
		 */
		check_callback	: false,
		/**
		 * a callback called with a single object parameter in the instance's scope when something goes wrong (operation prevented, ajax failed, etc)
		 * @name $.jstree.defaults.core.error
		 */
		error			: $.noop,
		/**
		 * the open / close animation duration in milliseconds - set this to `false` to disable the animation (default is `200`)
		 * @name $.jstree.defaults.core.animation
		 */
		animation		: 200,
		/**
		 * a boolean indicating if multiple nodes can be selected
		 * @name $.jstree.defaults.core.multiple
		 */
		multiple		: true,
		/**
		 * theme configuration object
		 * @name $.jstree.defaults.core.themes
		 */
		themes			: {
			/**
			 * the name of the theme to use (if left as `false` the default theme is used)
			 * @name $.jstree.defaults.core.themes.name
			 */
			name			: false,
			/**
			 * the URL of the theme's CSS file, leave this as `false` if you have manually included the theme CSS (recommended). You can set this to `true` too which will try to autoload the theme.
			 * @name $.jstree.defaults.core.themes.url
			 */
			url				: false,
			/**
			 * the location of all jstree themes - only used if `url` is set to `true`
			 * @name $.jstree.defaults.core.themes.dir
			 */
			dir				: false,
			/**
			 * a boolean indicating if connecting dots are shown
			 * @name $.jstree.defaults.core.themes.dots
			 */
			dots			: true,
			/**
			 * a boolean indicating if node icons are shown
			 * @name $.jstree.defaults.core.themes.icons
			 */
			icons			: true,
			/**
			 * a boolean indicating if node ellipsis should be shown - this only works with a fixed with on the container
			 * @name $.jstree.defaults.core.themes.ellipsis
			 */
			ellipsis		: false,
			/**
			 * a boolean indicating if the tree background is striped
			 * @name $.jstree.defaults.core.themes.stripes
			 */
			stripes			: false,
			/**
			 * a string (or boolean `false`) specifying the theme variant to use (if the theme supports variants)
			 * @name $.jstree.defaults.core.themes.variant
			 */
			variant			: false,
			/**
			 * a boolean specifying if a reponsive version of the theme should kick in on smaller screens (if the theme supports it). Defaults to `false`.
			 * @name $.jstree.defaults.core.themes.responsive
			 */
			responsive		: false
		},
		/**
		 * if left as `true` all parents of all selected nodes will be opened once the tree loads (so that all selected nodes are visible to the user)
		 * @name $.jstree.defaults.core.expand_selected_onload
		 */
		expand_selected_onload : true,
		/**
		 * if left as `true` web workers will be used to parse incoming JSON data where possible, so that the UI will not be blocked by large requests. Workers are however about 30% slower. Defaults to `true`
		 * @name $.jstree.defaults.core.worker
		 */
		worker : true,
		/**
		 * Force node text to plain text (and escape HTML). Defaults to `false`
		 * @name $.jstree.defaults.core.force_text
		 */
		force_text : false,
		/**
		 * Should the node be toggled if the text is double clicked. Defaults to `true`
		 * @name $.jstree.defaults.core.dblclick_toggle
		 */
		dblclick_toggle : true,
		/**
		 * Should the loaded nodes be part of the state. Defaults to `false`
		 * @name $.jstree.defaults.core.loaded_state
		 */
		loaded_state : false,
		/**
		 * Should the last active node be focused when the tree container is blurred and the focused again. This helps working with screen readers. Defaults to `true`
		 * @name $.jstree.defaults.core.restore_focus
		 */
		restore_focus : true,
		/**
		 * Default keyboard shortcuts (an object where each key is the button name or combo - like 'enter', 'ctrl-space', 'p', etc and the value is the function to execute in the instance's scope)
		 * @name $.jstree.defaults.core.keyboard
		 */
		keyboard : {
			'ctrl-space': function (e) {
				// aria defines space only with Ctrl
				e.type = "click";
				$(e.currentTarget).trigger(e);
			},
			'enter': function (e) {
				// enter
				e.type = "click";
				$(e.currentTarget).trigger(e);
			},
			'left': function (e) {
				// left
				e.preventDefault();
				if(this.is_open(e.currentTarget)) {
					this.close_node(e.currentTarget);
				}
				else {
					var o = this.get_parent(e.currentTarget);
					if(o && o.id !== $.jstree.root) { this.get_node(o, true).children('.jstree-anchor').focus(); }
				}
			},
			'up': function (e) {
				// up
				e.preventDefault();
				var o = this.get_prev_dom(e.currentTarget);
				if(o && o.length) { o.children('.jstree-anchor').focus(); }
			},
			'right': function (e) {
				// right
				e.preventDefault();
				if(this.is_closed(e.currentTarget)) {
					this.open_node(e.currentTarget, function (o) { this.get_node(o, true).children('.jstree-anchor').focus(); });
				}
				else if (this.is_open(e.currentTarget)) {
					var o = this.get_node(e.currentTarget, true).children('.jstree-children')[0];
					if(o) { $(this._firstChild(o)).children('.jstree-anchor').focus(); }
				}
			},
			'down': function (e) {
				// down
				e.preventDefault();
				var o = this.get_next_dom(e.currentTarget);
				if(o && o.length) { o.children('.jstree-anchor').focus(); }
			},
			'*': function (e) {
				// aria defines * on numpad as open_all - not very common
				this.open_all();
			},
			'home': function (e) {
				// home
				e.preventDefault();
				var o = this._firstChild(this.get_container_ul()[0]);
				if(o) { $(o).children('.jstree-anchor').filter(':visible').focus(); }
			},
			'end': function (e) {
				// end
				e.preventDefault();
				this.element.find('.jstree-anchor').filter(':visible').last().focus();
			},
			'f2': function (e) {
				// f2 - safe to include - if check_callback is false it will fail
				e.preventDefault();
				this.edit(e.currentTarget);
			}
		}
	};
	$.jstree.core.prototype = {
		/**
		 * used to decorate an instance with a plugin. Used internally.
		 * @private
		 * @name plugin(deco [, opts])
		 * @param  {String} deco the plugin to decorate with
		 * @param  {Object} opts options for the plugin
		 * @return {jsTree}
		 */
		plugin : function (deco, opts) {
			var Child = $.jstree.plugins[deco];
			if(Child) {
				this._data[deco] = {};
				Child.prototype = this;
				return new Child(opts, this);
			}
			return this;
		},
		/**
		 * initialize the instance. Used internally.
		 * @private
		 * @name init(el, optons)
		 * @param {DOMElement|jQuery|String} el the element we are transforming
		 * @param {Object} options options for this instance
		 * @trigger init.jstree, loading.jstree, loaded.jstree, ready.jstree, changed.jstree
		 */
		init : function (el, options) {
			this._model = {
				data : {},
				changed : [],
				force_full_redraw : false,
				redraw_timeout : false,
				default_state : {
					loaded : true,
					opened : false,
					selected : false,
					disabled : false
				}
			};
			this._model.data[$.jstree.root] = {
				id : $.jstree.root,
				parent : null,
				parents : [],
				children : [],
				children_d : [],
				state : { loaded : false }
			};

			this.element = $(el).addClass('jstree jstree-' + this._id);
			this.settings = options;

			this._data.core.ready = false;
			this._data.core.loaded = false;
			this._data.core.rtl = (this.element.css("direction") === "rtl");
			this.element[this._data.core.rtl ? 'addClass' : 'removeClass']("jstree-rtl");
			this.element.attr('role','tree');
			if(this.settings.core.multiple) {
				this.element.attr('aria-multiselectable', true);
			}
			if(!this.element.attr('tabindex')) {
				this.element.attr('tabindex','0');
			}

			this.bind();
			/**
			 * triggered after all events are bound
			 * @event
			 * @name init.jstree
			 */
			this.trigger("init");

			this._data.core.original_container_html = this.element.find(" > ul > li").clone(true);
			this._data.core.original_container_html
				.find("li").addBack()
				.contents().filter(function() {
					return this.nodeType === 3 && (!this.nodeValue || /^\s+$/.test(this.nodeValue));
				})
				.remove();
			this.element.html("<"+"ul class='jstree-container-ul jstree-children' role='group'><"+"li id='j"+this._id+"_loading' class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='tree-item'><i class='jstree-icon jstree-ocl'></i><"+"a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>");
			this.element.attr('aria-activedescendant','j' + this._id + '_loading');
			this._data.core.li_height = this.get_container_ul().children("li").first().outerHeight() || 24;
			this._data.core.node = this._create_prototype_node();
			/**
			 * triggered after the loading text is shown and before loading starts
			 * @event
			 * @name loading.jstree
			 */
			this.trigger("loading");
			this.load_node($.jstree.root);
		},
		/**
		 * destroy an instance
		 * @name destroy()
		 * @param  {Boolean} keep_html if not set to `true` the container will be emptied, otherwise the current DOM elements will be kept intact
		 */
		destroy : function (keep_html) {
			/**
			 * triggered before the tree is destroyed
			 * @event
			 * @name destroy.jstree
			 */
			this.trigger("destroy");
			if(this._wrk) {
				try {
					window.URL.revokeObjectURL(this._wrk);
					this._wrk = null;
				}
				catch (ignore) { }
			}
			if(!keep_html) { this.element.empty(); }
			this.teardown();
		},
		/**
		 * Create a prototype node
		 * @name _create_prototype_node()
		 * @return {DOMElement}
		 */
		_create_prototype_node : function () {
			var _node = document.createElement('LI'), _temp1, _temp2;
			_node.setAttribute('role', 'treeitem');
			_temp1 = document.createElement('I');
			_temp1.className = 'jstree-icon jstree-ocl';
			_temp1.setAttribute('role', 'presentation');
			_node.appendChild(_temp1);
			_temp1 = document.createElement('A');
			_temp1.className = 'jstree-anchor';
			_temp1.setAttribute('href','#');
			_temp1.setAttribute('tabindex','-1');
			_temp2 = document.createElement('I');
			_temp2.className = 'jstree-icon jstree-themeicon';
			_temp2.setAttribute('role', 'presentation');
			_temp1.appendChild(_temp2);
			_node.appendChild(_temp1);
			_temp1 = _temp2 = null;

			return _node;
		},
		_kbevent_to_func : function (e) {
			var keys = {
				8: "Backspace", 9: "Tab", 13: "Enter", 19: "Pause", 27: "Esc",
				32: "Space", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home",
				37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "Print", 45: "Insert",
				46: "Delete", 96: "Numpad0", 97: "Numpad1", 98: "Numpad2", 99 : "Numpad3",
				100: "Numpad4", 101: "Numpad5", 102: "Numpad6", 103: "Numpad7",
				104: "Numpad8", 105: "Numpad9", '-13': "NumpadEnter", 112: "F1",
				113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7",
				119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "Numlock",
				145: "Scrolllock", 16: 'Shift', 17: 'Ctrl', 18: 'Alt',
				48: '0',  49: '1',  50: '2',  51: '3',  52: '4', 53:  '5',
				54: '6',  55: '7',  56: '8',  57: '9',  59: ';',  61: '=', 65:  'a',
				66: 'b',  67: 'c',  68: 'd',  69: 'e',  70: 'f',  71: 'g', 72:  'h',
				73: 'i',  74: 'j',  75: 'k',  76: 'l',  77: 'm',  78: 'n', 79:  'o',
				80: 'p',  81: 'q',  82: 'r',  83: 's',  84: 't',  85: 'u', 86:  'v',
				87: 'w',  88: 'x',  89: 'y',  90: 'z', 107: '+', 109: '-', 110: '.',
				186: ';', 187: '=', 188: ',', 189: '-', 190: '.', 191: '/', 192: '`',
				219: '[', 220: '\\',221: ']', 222: "'", 111: '/', 106: '*', 173: '-'
			};
			var parts = [];
			if (e.ctrlKey) { parts.push('ctrl'); }
			if (e.altKey) { parts.push('alt'); }
			if (e.shiftKey) { parts.push('shift'); }
			parts.push(keys[e.which] || e.which);
			parts = parts.sort().join('-').toLowerCase();

			var kb = this.settings.core.keyboard, i, tmp;
			for (i in kb) {
				if (kb.hasOwnProperty(i)) {
					tmp = i;
					if (tmp !== '-' && tmp !== '+') {
						tmp = tmp.replace('--', '-MINUS').replace('+-', '-MINUS').replace('++', '-PLUS').replace('-+', '-PLUS');
						tmp = tmp.split(/-|\+/).sort().join('-').replace('MINUS', '-').replace('PLUS', '+').toLowerCase();
					}
					if (tmp === parts) {
						return kb[i];
					}
				}
			}
			return null;
		},
		/**
		 * part of the destroying of an instance. Used internally.
		 * @private
		 * @name teardown()
		 */
		teardown : function () {
			this.unbind();
			this.element
				.removeClass('jstree')
				.removeData('jstree')
				.find("[class^='jstree']")
					.addBack()
					.attr("class", function () { return this.className.replace(/jstree[^ ]*|$/ig,''); });
			this.element = null;
		},
		/**
		 * bind all events. Used internally.
		 * @private
		 * @name bind()
		 */
		bind : function () {
			var word = '',
				tout = null,
				was_click = 0;
			this.element
				.on("dblclick.jstree", function (e) {
						if(e.target.tagName && e.target.tagName.toLowerCase() === "input") { return true; }
						if(document.selection && document.selection.empty) {
							document.selection.empty();
						}
						else {
							if(window.getSelection) {
								var sel = window.getSelection();
								try {
									sel.removeAllRanges();
									sel.collapse();
								} catch (ignore) { }
							}
						}
					})
				.on("mousedown.jstree", $.proxy(function (e) {
						if(e.target === this.element[0]) {
							e.preventDefault(); // prevent losing focus when clicking scroll arrows (FF, Chrome)
							was_click = +(new Date()); // ie does not allow to prevent losing focus
						}
					}, this))
				.on("mousedown.jstree", ".jstree-ocl", function (e) {
						e.preventDefault(); // prevent any node inside from losing focus when clicking the open/close icon
					})
				.on("click.jstree", ".jstree-ocl", $.proxy(function (e) {
						this.toggle_node(e.target);
					}, this))
				.on("dblclick.jstree", ".jstree-anchor", $.proxy(function (e) {
						if(e.target.tagName && e.target.tagName.toLowerCase() === "input") { return true; }
						if(this.settings.core.dblclick_toggle) {
							this.toggle_node(e.target);
						}
					}, this))
				.on("click.jstree", ".jstree-anchor", $.proxy(function (e) {
						e.preventDefault();
						if(e.currentTarget !== document.activeElement) { $(e.currentTarget).focus(); }
						this.activate_node(e.currentTarget, e);
					}, this))
				.on('keydown.jstree', '.jstree-anchor', $.proxy(function (e) {
						if(e.target.tagName && e.target.tagName.toLowerCase() === "input") { return true; }
						if(this._data.core.rtl) {
							if(e.which === 37) { e.which = 39; }
							else if(e.which === 39) { e.which = 37; }
						}
						var f = this._kbevent_to_func(e);
						if (f) {
							var r = f.call(this, e);
							if (r === false || r === true) {
								return r;
							}
						}
					}, this))
				.on("load_node.jstree", $.proxy(function (e, data) {
						if(data.status) {
							if(data.node.id === $.jstree.root && !this._data.core.loaded) {
								this._data.core.loaded = true;
								if(this._firstChild(this.get_container_ul()[0])) {
									this.element.attr('aria-activedescendant',this._firstChild(this.get_container_ul()[0]).id);
								}
								/**
								 * triggered after the root node is loaded for the first time
								 * @event
								 * @name loaded.jstree
								 */
								this.trigger("loaded");
							}
							if(!this._data.core.ready) {
								setTimeout($.proxy(function() {
									if(this.element && !this.get_container_ul().find('.jstree-loading').length) {
										this._data.core.ready = true;
										if(this._data.core.selected.length) {
											if(this.settings.core.expand_selected_onload) {
												var tmp = [], i, j;
												for(i = 0, j = this._data.core.selected.length; i < j; i++) {
													tmp = tmp.concat(this._model.data[this._data.core.selected[i]].parents);
												}
												tmp = $.vakata.array_unique(tmp);
												for(i = 0, j = tmp.length; i < j; i++) {
													this.open_node(tmp[i], false, 0);
												}
											}
											this.trigger('changed', { 'action' : 'ready', 'selected' : this._data.core.selected });
										}
										/**
										 * triggered after all nodes are finished loading
										 * @event
										 * @name ready.jstree
										 */
										this.trigger("ready");
									}
								}, this), 0);
							}
						}
					}, this))
				// quick searching when the tree is focused
				.on('keypress.jstree', $.proxy(function (e) {
						if(e.target.tagName && e.target.tagName.toLowerCase() === "input") { return true; }
						if(tout) { clearTimeout(tout); }
						tout = setTimeout(function () {
							word = '';
						}, 500);

						var chr = String.fromCharCode(e.which).toLowerCase(),
							col = this.element.find('.jstree-anchor').filter(':visible'),
							ind = col.index(document.activeElement) || 0,
							end = false;
						word += chr;

						// match for whole word from current node down (including the current node)
						if(word.length > 1) {
							col.slice(ind).each($.proxy(function (i, v) {
								if($(v).text().toLowerCase().indexOf(word) === 0) {
									$(v).focus();
									end = true;
									return false;
								}
							}, this));
							if(end) { return; }

							// match for whole word from the beginning of the tree
							col.slice(0, ind).each($.proxy(function (i, v) {
								if($(v).text().toLowerCase().indexOf(word) === 0) {
									$(v).focus();
									end = true;
									return false;
								}
							}, this));
							if(end) { return; }
						}
						// list nodes that start with that letter (only if word consists of a single char)
						if(new RegExp('^' + chr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '+$').test(word)) {
							// search for the next node starting with that letter
							col.slice(ind + 1).each($.proxy(function (i, v) {
								if($(v).text().toLowerCase().charAt(0) === chr) {
									$(v).focus();
									end = true;
									return false;
								}
							}, this));
							if(end) { return; }

							// search from the beginning
							col.slice(0, ind + 1).each($.proxy(function (i, v) {
								if($(v).text().toLowerCase().charAt(0) === chr) {
									$(v).focus();
									end = true;
									return false;
								}
							}, this));
							if(end) { return; }
						}
					}, this))
				// THEME RELATED
				.on("init.jstree", $.proxy(function () {
						var s = this.settings.core.themes;
						this._data.core.themes.dots			= s.dots;
						this._data.core.themes.stripes		= s.stripes;
						this._data.core.themes.icons		= s.icons;
						this._data.core.themes.ellipsis		= s.ellipsis;
						this.set_theme(s.name || "default", s.url);
						this.set_theme_variant(s.variant);
					}, this))
				.on("loading.jstree", $.proxy(function () {
						this[ this._data.core.themes.dots ? "show_dots" : "hide_dots" ]();
						this[ this._data.core.themes.icons ? "show_icons" : "hide_icons" ]();
						this[ this._data.core.themes.stripes ? "show_stripes" : "hide_stripes" ]();
						this[ this._data.core.themes.ellipsis ? "show_ellipsis" : "hide_ellipsis" ]();
					}, this))
				.on('blur.jstree', '.jstree-anchor', $.proxy(function (e) {
						this._data.core.focused = null;
						$(e.currentTarget).filter('.jstree-hovered').trigger('mouseleave');
						this.element.attr('tabindex', '0');
					}, this))
				.on('focus.jstree', '.jstree-anchor', $.proxy(function (e) {
						var tmp = this.get_node(e.currentTarget);
						if(tmp && tmp.id) {
							this._data.core.focused = tmp.id;
						}
						this.element.find('.jstree-hovered').not(e.currentTarget).trigger('mouseleave');
						$(e.currentTarget).trigger('mouseenter');
						this.element.attr('tabindex', '-1');
					}, this))
				.on('focus.jstree', $.proxy(function () {
						if(+(new Date()) - was_click > 500 && !this._data.core.focused && this.settings.core.restore_focus) {
							was_click = 0;
							var act = this.get_node(this.element.attr('aria-activedescendant'), true);
							if(act) {
								act.find('> .jstree-anchor').focus();
							}
						}
					}, this))
				.on('mouseenter.jstree', '.jstree-anchor', $.proxy(function (e) {
						this.hover_node(e.currentTarget);
					}, this))
				.on('mouseleave.jstree', '.jstree-anchor', $.proxy(function (e) {
						this.dehover_node(e.currentTarget);
					}, this));
		},
		/**
		 * part of the destroying of an instance. Used internally.
		 * @private
		 * @name unbind()
		 */
		unbind : function () {
			this.element.off('.jstree');
			$(document).off('.jstree-' + this._id);
		},
		/**
		 * trigger an event. Used internally.
		 * @private
		 * @name trigger(ev [, data])
		 * @param  {String} ev the name of the event to trigger
		 * @param  {Object} data additional data to pass with the event
		 */
		trigger : function (ev, data) {
			if(!data) {
				data = {};
			}
			data.instance = this;
			this.element.triggerHandler(ev.replace('.jstree','') + '.jstree', data);
		},
		/**
		 * returns the jQuery extended instance container
		 * @name get_container()
		 * @return {jQuery}
		 */
		get_container : function () {
			return this.element;
		},
		/**
		 * returns the jQuery extended main UL node inside the instance container. Used internally.
		 * @private
		 * @name get_container_ul()
		 * @return {jQuery}
		 */
		get_container_ul : function () {
			return this.element.children(".jstree-children").first();
		},
		/**
		 * gets string replacements (localization). Used internally.
		 * @private
		 * @name get_string(key)
		 * @param  {String} key
		 * @return {String}
		 */
		get_string : function (key) {
			var a = this.settings.core.strings;
			if($.isFunction(a)) { return a.call(this, key); }
			if(a && a[key]) { return a[key]; }
			return key;
		},
		/**
		 * gets the first child of a DOM node. Used internally.
		 * @private
		 * @name _firstChild(dom)
		 * @param  {DOMElement} dom
		 * @return {DOMElement}
		 */
		_firstChild : function (dom) {
			dom = dom ? dom.firstChild : null;
			while(dom !== null && dom.nodeType !== 1) {
				dom = dom.nextSibling;
			}
			return dom;
		},
		/**
		 * gets the next sibling of a DOM node. Used internally.
		 * @private
		 * @name _nextSibling(dom)
		 * @param  {DOMElement} dom
		 * @return {DOMElement}
		 */
		_nextSibling : function (dom) {
			dom = dom ? dom.nextSibling : null;
			while(dom !== null && dom.nodeType !== 1) {
				dom = dom.nextSibling;
			}
			return dom;
		},
		/**
		 * gets the previous sibling of a DOM node. Used internally.
		 * @private
		 * @name _previousSibling(dom)
		 * @param  {DOMElement} dom
		 * @return {DOMElement}
		 */
		_previousSibling : function (dom) {
			dom = dom ? dom.previousSibling : null;
			while(dom !== null && dom.nodeType !== 1) {
				dom = dom.previousSibling;
			}
			return dom;
		},
		/**
		 * get the JSON representation of a node (or the actual jQuery extended DOM node) by using any input (child DOM element, ID string, selector, etc)
		 * @name get_node(obj [, as_dom])
		 * @param  {mixed} obj
		 * @param  {Boolean} as_dom
		 * @return {Object|jQuery}
		 */
		get_node : function (obj, as_dom) {
			if(obj && obj.id) {
				obj = obj.id;
			}
			if (obj instanceof $ && obj.length && obj[0].id) {
				obj = obj[0].id;
			}
			var dom;
			try {
				if(this._model.data[obj]) {
					obj = this._model.data[obj];
				}
				else if(typeof obj === "string" && this._model.data[obj.replace(/^#/, '')]) {
					obj = this._model.data[obj.replace(/^#/, '')];
				}
				else if(typeof obj === "string" && (dom = $('#' + obj.replace($.jstree.idregex,'\\$&'), this.element)).length && this._model.data[dom.closest('.jstree-node').attr('id')]) {
					obj = this._model.data[dom.closest('.jstree-node').attr('id')];
				}
				else if((dom = this.element.find(obj)).length && this._model.data[dom.closest('.jstree-node').attr('id')]) {
					obj = this._model.data[dom.closest('.jstree-node').attr('id')];
				}
				else if((dom = this.element.find(obj)).length && dom.hasClass('jstree')) {
					obj = this._model.data[$.jstree.root];
				}
				else {
					return false;
				}

				if(as_dom) {
					obj = obj.id === $.jstree.root ? this.element : $('#' + obj.id.replace($.jstree.idregex,'\\$&'), this.element);
				}
				return obj;
			} catch (ex) { return false; }
		},
		/**
		 * get the path to a node, either consisting of node texts, or of node IDs, optionally glued together (otherwise an array)
		 * @name get_path(obj [, glue, ids])
		 * @param  {mixed} obj the node
		 * @param  {String} glue if you want the path as a string - pass the glue here (for example '/'), if a falsy value is supplied here, an array is returned
		 * @param  {Boolean} ids if set to true build the path using ID, otherwise node text is used
		 * @return {mixed}
		 */
		get_path : function (obj, glue, ids) {
			obj = obj.parents ? obj : this.get_node(obj);
			if(!obj || obj.id === $.jstree.root || !obj.parents) {
				return false;
			}
			var i, j, p = [];
			p.push(ids ? obj.id : obj.text);
			for(i = 0, j = obj.parents.length; i < j; i++) {
				p.push(ids ? obj.parents[i] : this.get_text(obj.parents[i]));
			}
			p = p.reverse().slice(1);
			return glue ? p.join(glue) : p;
		},
		/**
		 * get the next visible node that is below the `obj` node. If `strict` is set to `true` only sibling nodes are returned.
		 * @name get_next_dom(obj [, strict])
		 * @param  {mixed} obj
		 * @param  {Boolean} strict
		 * @return {jQuery}
		 */
		get_next_dom : function (obj, strict) {
			var tmp;
			obj = this.get_node(obj, true);
			if(obj[0] === this.element[0]) {
				tmp = this._firstChild(this.get_container_ul()[0]);
				while (tmp && tmp.offsetHeight === 0) {
					tmp = this._nextSibling(tmp);
				}
				return tmp ? $(tmp) : false;
			}
			if(!obj || !obj.length) {
				return false;
			}
			if(strict) {
				tmp = obj[0];
				do {
					tmp = this._nextSibling(tmp);
				} while (tmp && tmp.offsetHeight === 0);
				return tmp ? $(tmp) : false;
			}
			if(obj.hasClass("jstree-open")) {
				tmp = this._firstChild(obj.children('.jstree-children')[0]);
				while (tmp && tmp.offsetHeight === 0) {
					tmp = this._nextSibling(tmp);
				}
				if(tmp !== null) {
					return $(tmp);
				}
			}
			tmp = obj[0];
			do {
				tmp = this._nextSibling(tmp);
			} while (tmp && tmp.offsetHeight === 0);
			if(tmp !== null) {
				return $(tmp);
			}
			return obj.parentsUntil(".jstree",".jstree-node").nextAll(".jstree-node:visible").first();
		},
		/**
		 * get the previous visible node that is above the `obj` node. If `strict` is set to `true` only sibling nodes are returned.
		 * @name get_prev_dom(obj [, strict])
		 * @param  {mixed} obj
		 * @param  {Boolean} strict
		 * @return {jQuery}
		 */
		get_prev_dom : function (obj, strict) {
			var tmp;
			obj = this.get_node(obj, true);
			if(obj[0] === this.element[0]) {
				tmp = this.get_container_ul()[0].lastChild;
				while (tmp && tmp.offsetHeight === 0) {
					tmp = this._previousSibling(tmp);
				}
				return tmp ? $(tmp) : false;
			}
			if(!obj || !obj.length) {
				return false;
			}
			if(strict) {
				tmp = obj[0];
				do {
					tmp = this._previousSibling(tmp);
				} while (tmp && tmp.offsetHeight === 0);
				return tmp ? $(tmp) : false;
			}
			tmp = obj[0];
			do {
				tmp = this._previousSibling(tmp);
			} while (tmp && tmp.offsetHeight === 0);
			if(tmp !== null) {
				obj = $(tmp);
				while(obj.hasClass("jstree-open")) {
					obj = obj.children(".jstree-children").first().children(".jstree-node:visible:last");
				}
				return obj;
			}
			tmp = obj[0].parentNode.parentNode;
			return tmp && tmp.className && tmp.className.indexOf('jstree-node') !== -1 ? $(tmp) : false;
		},
		/**
		 * get the parent ID of a node
		 * @name get_parent(obj)
		 * @param  {mixed} obj
		 * @return {String}
		 */
		get_parent : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			return obj.parent;
		},
		/**
		 * get a jQuery collection of all the children of a node (node must be rendered), returns false on error
		 * @name get_children_dom(obj)
		 * @param  {mixed} obj
		 * @return {jQuery}
		 */
		get_children_dom : function (obj) {
			obj = this.get_node(obj, true);
			if(obj[0] === this.element[0]) {
				return this.get_container_ul().children(".jstree-node");
			}
			if(!obj || !obj.length) {
				return false;
			}
			return obj.children(".jstree-children").children(".jstree-node");
		},
		/**
		 * checks if a node has children
		 * @name is_parent(obj)
		 * @param  {mixed} obj
		 * @return {Boolean}
		 */
		is_parent : function (obj) {
			obj = this.get_node(obj);
			return obj && (obj.state.loaded === false || obj.children.length > 0);
		},
		/**
		 * checks if a node is loaded (its children are available)
		 * @name is_loaded(obj)
		 * @param  {mixed} obj
		 * @return {Boolean}
		 */
		is_loaded : function (obj) {
			obj = this.get_node(obj);
			return obj && obj.state.loaded;
		},
		/**
		 * check if a node is currently loading (fetching children)
		 * @name is_loading(obj)
		 * @param  {mixed} obj
		 * @return {Boolean}
		 */
		is_loading : function (obj) {
			obj = this.get_node(obj);
			return obj && obj.state && obj.state.loading;
		},
		/**
		 * check if a node is opened
		 * @name is_open(obj)
		 * @param  {mixed} obj
		 * @return {Boolean}
		 */
		is_open : function (obj) {
			obj = this.get_node(obj);
			return obj && obj.state.opened;
		},
		/**
		 * check if a node is in a closed state
		 * @name is_closed(obj)
		 * @param  {mixed} obj
		 * @return {Boolean}
		 */
		is_closed : function (obj) {
			obj = this.get_node(obj);
			return obj && this.is_parent(obj) && !obj.state.opened;
		},
		/**
		 * check if a node has no children
		 * @name is_leaf(obj)
		 * @param  {mixed} obj
		 * @return {Boolean}
		 */
		is_leaf : function (obj) {
			return !this.is_parent(obj);
		},
		/**
		 * loads a node (fetches its children using the `core.data` setting). Multiple nodes can be passed to by using an array.
		 * @name load_node(obj [, callback])
		 * @param  {mixed} obj
		 * @param  {function} callback a function to be executed once loading is complete, the function is executed in the instance's scope and receives two arguments - the node and a boolean status
		 * @return {Boolean}
		 * @trigger load_node.jstree
		 */
		load_node : function (obj, callback) {
			var k, l, i, j, c;
			if($.isArray(obj)) {
				this._load_nodes(obj.slice(), callback);
				return true;
			}
			obj = this.get_node(obj);
			if(!obj) {
				if(callback) { callback.call(this, obj, false); }
				return false;
			}
			// if(obj.state.loading) { } // the node is already loading - just wait for it to load and invoke callback? but if called implicitly it should be loaded again?
			if(obj.state.loaded) {
				obj.state.loaded = false;
				for(i = 0, j = obj.parents.length; i < j; i++) {
					this._model.data[obj.parents[i]].children_d = $.vakata.array_filter(this._model.data[obj.parents[i]].children_d, function (v) {
						return $.inArray(v, obj.children_d) === -1;
					});
				}
				for(k = 0, l = obj.children_d.length; k < l; k++) {
					if(this._model.data[obj.children_d[k]].state.selected) {
						c = true;
					}
					delete this._model.data[obj.children_d[k]];
				}
				if (c) {
					this._data.core.selected = $.vakata.array_filter(this._data.core.selected, function (v) {
						return $.inArray(v, obj.children_d) === -1;
					});
				}
				obj.children = [];
				obj.children_d = [];
				if(c) {
					this.trigger('changed', { 'action' : 'load_node', 'node' : obj, 'selected' : this._data.core.selected });
				}
			}
			obj.state.failed = false;
			obj.state.loading = true;
			this.get_node(obj, true).addClass("jstree-loading").attr('aria-busy',true);
			this._load_node(obj, $.proxy(function (status) {
				obj = this._model.data[obj.id];
				obj.state.loading = false;
				obj.state.loaded = status;
				obj.state.failed = !obj.state.loaded;
				var dom = this.get_node(obj, true), i = 0, j = 0, m = this._model.data, has_children = false;
				for(i = 0, j = obj.children.length; i < j; i++) {
					if(m[obj.children[i]] && !m[obj.children[i]].state.hidden) {
						has_children = true;
						break;
					}
				}
				if(obj.state.loaded && dom && dom.length) {
					dom.removeClass('jstree-closed jstree-open jstree-leaf');
					if (!has_children) {
						dom.addClass('jstree-leaf');
					}
					else {
						if (obj.id !== '#') {
							dom.addClass(obj.state.opened ? 'jstree-open' : 'jstree-closed');
						}
					}
				}
				dom.removeClass("jstree-loading").attr('aria-busy',false);
				/**
				 * triggered after a node is loaded
				 * @event
				 * @name load_node.jstree
				 * @param {Object} node the node that was loading
				 * @param {Boolean} status was the node loaded successfully
				 */
				this.trigger('load_node', { "node" : obj, "status" : status });
				if(callback) {
					callback.call(this, obj, status);
				}
			}, this));
			return true;
		},
		/**
		 * load an array of nodes (will also load unavailable nodes as soon as they appear in the structure). Used internally.
		 * @private
		 * @name _load_nodes(nodes [, callback])
		 * @param  {array} nodes
		 * @param  {function} callback a function to be executed once loading is complete, the function is executed in the instance's scope and receives one argument - the array passed to _load_nodes
		 */
		_load_nodes : function (nodes, callback, is_callback, force_reload) {
			var r = true,
				c = function () { this._load_nodes(nodes, callback, true); },
				m = this._model.data, i, j, tmp = [];
			for(i = 0, j = nodes.length; i < j; i++) {
				if(m[nodes[i]] && ( (!m[nodes[i]].state.loaded && !m[nodes[i]].state.failed) || (!is_callback && force_reload) )) {
					if(!this.is_loading(nodes[i])) {
						this.load_node(nodes[i], c);
					}
					r = false;
				}
			}
			if(r) {
				for(i = 0, j = nodes.length; i < j; i++) {
					if(m[nodes[i]] && m[nodes[i]].state.loaded) {
						tmp.push(nodes[i]);
					}
				}
				if(callback && !callback.done) {
					callback.call(this, tmp);
					callback.done = true;
				}
			}
		},
		/**
		 * loads all unloaded nodes
		 * @name load_all([obj, callback])
		 * @param {mixed} obj the node to load recursively, omit to load all nodes in the tree
		 * @param {function} callback a function to be executed once loading all the nodes is complete,
		 * @trigger load_all.jstree
		 */
		load_all : function (obj, callback) {
			if(!obj) { obj = $.jstree.root; }
			obj = this.get_node(obj);
			if(!obj) { return false; }
			var to_load = [],
				m = this._model.data,
				c = m[obj.id].children_d,
				i, j;
			if(obj.state && !obj.state.loaded) {
				to_load.push(obj.id);
			}
			for(i = 0, j = c.length; i < j; i++) {
				if(m[c[i]] && m[c[i]].state && !m[c[i]].state.loaded) {
					to_load.push(c[i]);
				}
			}
			if(to_load.length) {
				this._load_nodes(to_load, function () {
					this.load_all(obj, callback);
				});
			}
			else {
				/**
				 * triggered after a load_all call completes
				 * @event
				 * @name load_all.jstree
				 * @param {Object} node the recursively loaded node
				 */
				if(callback) { callback.call(this, obj); }
				this.trigger('load_all', { "node" : obj });
			}
		},
		/**
		 * handles the actual loading of a node. Used only internally.
		 * @private
		 * @name _load_node(obj [, callback])
		 * @param  {mixed} obj
		 * @param  {function} callback a function to be executed once loading is complete, the function is executed in the instance's scope and receives one argument - a boolean status
		 * @return {Boolean}
		 */
		_load_node : function (obj, callback) {
			var s = this.settings.core.data, t;
			var notTextOrCommentNode = function notTextOrCommentNode () {
				return this.nodeType !== 3 && this.nodeType !== 8;
			};
			// use original HTML
			if(!s) {
				if(obj.id === $.jstree.root) {
					return this._append_html_data(obj, this._data.core.original_container_html.clone(true), function (status) {
						callback.call(this, status);
					});
				}
				else {
					return callback.call(this, false);
				}
				// return callback.call(this, obj.id === $.jstree.root ? this._append_html_data(obj, this._data.core.original_container_html.clone(true)) : false);
			}
			if($.isFunction(s)) {
				return s.call(this, obj, $.proxy(function (d) {
					if(d === false) {
						callback.call(this, false);
					}
					else {
						this[typeof d === 'string' ? '_append_html_data' : '_append_json_data'](obj, typeof d === 'string' ? $($.parseHTML(d)).filter(notTextOrCommentNode) : d, function (status) {
							callback.call(this, status);
						});
					}
					// return d === false ? callback.call(this, false) : callback.call(this, this[typeof d === 'string' ? '_append_html_data' : '_append_json_data'](obj, typeof d === 'string' ? $(d) : d));
				}, this));
			}
			if(typeof s === 'object') {
				if(s.url) {
					s = $.extend(true, {}, s);
					if($.isFunction(s.url)) {
						s.url = s.url.call(this, obj);
					}
					if($.isFunction(s.data)) {
						s.data = s.data.call(this, obj);
					}
					return $.ajax(s)
						.done($.proxy(function (d,t,x) {
								var type = x.getResponseHeader('Content-Type');
								if((type && type.indexOf('json') !== -1) || typeof d === "object") {
									return this._append_json_data(obj, d, function (status) { callback.call(this, status); });
									//return callback.call(this, this._append_json_data(obj, d));
								}
								if((type && type.indexOf('html') !== -1) || typeof d === "string") {
									return this._append_html_data(obj, $($.parseHTML(d)).filter(notTextOrCommentNode), function (status) { callback.call(this, status); });
									// return callback.call(this, this._append_html_data(obj, $(d)));
								}
								this._data.core.last_error = { 'error' : 'ajax', 'plugin' : 'core', 'id' : 'core_04', 'reason' : 'Could not load node', 'data' : JSON.stringify({ 'id' : obj.id, 'xhr' : x }) };
								this.settings.core.error.call(this, this._data.core.last_error);
								return callback.call(this, false);
							}, this))
						.fail($.proxy(function (f) {
								this._data.core.last_error = { 'error' : 'ajax', 'plugin' : 'core', 'id' : 'core_04', 'reason' : 'Could not load node', 'data' : JSON.stringify({ 'id' : obj.id, 'xhr' : f }) };
								callback.call(this, false);
								this.settings.core.error.call(this, this._data.core.last_error);
							}, this));
				}
				if ($.isArray(s)) {
					t = $.extend(true, [], s);
				} else if ($.isPlainObject(s)) {
					t = $.extend(true, {}, s);
				} else {
					t = s;
				}
				if(obj.id === $.jstree.root) {
					return this._append_json_data(obj, t, function (status) {
						callback.call(this, status);
					});
				}
				else {
					this._data.core.last_error = { 'error' : 'nodata', 'plugin' : 'core', 'id' : 'core_05', 'reason' : 'Could not load node', 'data' : JSON.stringify({ 'id' : obj.id }) };
					this.settings.core.error.call(this, this._data.core.last_error);
					return callback.call(this, false);
				}
				//return callback.call(this, (obj.id === $.jstree.root ? this._append_json_data(obj, t) : false) );
			}
			if(typeof s === 'string') {
				if(obj.id === $.jstree.root) {
					return this._append_html_data(obj, $($.parseHTML(s)).filter(notTextOrCommentNode), function (status) {
						callback.call(this, status);
					});
				}
				else {
					this._data.core.last_error = { 'error' : 'nodata', 'plugin' : 'core', 'id' : 'core_06', 'reason' : 'Could not load node', 'data' : JSON.stringify({ 'id' : obj.id }) };
					this.settings.core.error.call(this, this._data.core.last_error);
					return callback.call(this, false);
				}
				//return callback.call(this, (obj.id === $.jstree.root ? this._append_html_data(obj, $(s)) : false) );
			}
			return callback.call(this, false);
		},
		/**
		 * adds a node to the list of nodes to redraw. Used only internally.
		 * @private
		 * @name _node_changed(obj [, callback])
		 * @param  {mixed} obj
		 */
		_node_changed : function (obj) {
			obj = this.get_node(obj);
      if (obj && $.inArray(obj.id, this._model.changed) === -1) {
				this._model.changed.push(obj.id);
			}
		},
		/**
		 * appends HTML content to the tree. Used internally.
		 * @private
		 * @name _append_html_data(obj, data)
		 * @param  {mixed} obj the node to append to
		 * @param  {String} data the HTML string to parse and append
		 * @trigger model.jstree, changed.jstree
		 */
		_append_html_data : function (dom, data, cb) {
			dom = this.get_node(dom);
			dom.children = [];
			dom.children_d = [];
			var dat = data.is('ul') ? data.children() : data,
				par = dom.id,
				chd = [],
				dpc = [],
				m = this._model.data,
				p = m[par],
				s = this._data.core.selected.length,
				tmp, i, j;
			dat.each($.proxy(function (i, v) {
				tmp = this._parse_model_from_html($(v), par, p.parents.concat());
				if(tmp) {
					chd.push(tmp);
					dpc.push(tmp);
					if(m[tmp].children_d.length) {
						dpc = dpc.concat(m[tmp].children_d);
					}
				}
			}, this));
			p.children = chd;
			p.children_d = dpc;
			for(i = 0, j = p.parents.length; i < j; i++) {
				m[p.parents[i]].children_d = m[p.parents[i]].children_d.concat(dpc);
			}
			/**
			 * triggered when new data is inserted to the tree model
			 * @event
			 * @name model.jstree
			 * @param {Array} nodes an array of node IDs
			 * @param {String} parent the parent ID of the nodes
			 */
			this.trigger('model', { "nodes" : dpc, 'parent' : par });
			if(par !== $.jstree.root) {
				this._node_changed(par);
				this.redraw();
			}
			else {
				this.get_container_ul().children('.jstree-initial-node').remove();
				this.redraw(true);
			}
			if(this._data.core.selected.length !== s) {
				this.trigger('changed', { 'action' : 'model', 'selected' : this._data.core.selected });
			}
			cb.call(this, true);
		},
		/**
		 * appends JSON content to the tree. Used internally.
		 * @private
		 * @name _append_json_data(obj, data)
		 * @param  {mixed} obj the node to append to
		 * @param  {String} data the JSON object to parse and append
		 * @param  {Boolean} force_processing internal param - do not set
		 * @trigger model.jstree, changed.jstree
		 */
		_append_json_data : function (dom, data, cb, force_processing) {
			if(this.element === null) { return; }
			dom = this.get_node(dom);
			dom.children = [];
			dom.children_d = [];
			// *%$@!!!
			if(data.d) {
				data = data.d;
				if(typeof data === "string") {
					data = JSON.parse(data);
				}
			}
			if(!$.isArray(data)) { data = [data]; }
			var w = null,
				args = {
					'df'	: this._model.default_state,
					'dat'	: data,
					'par'	: dom.id,
					'm'		: this._model.data,
					't_id'	: this._id,
					't_cnt'	: this._cnt,
					'sel'	: this._data.core.selected
				},
				inst = this,
				func = function (data, undefined) {
					if(data.data) { data = data.data; }
					var dat = data.dat,
						par = data.par,
						chd = [],
						dpc = [],
						add = [],
						df = data.df,
						t_id = data.t_id,
						t_cnt = data.t_cnt,
						m = data.m,
						p = m[par],
						sel = data.sel,
						tmp, i, j, rslt,
						parse_flat = function (d, p, ps) {
							if(!ps) { ps = []; }
							else { ps = ps.concat(); }
							if(p) { ps.unshift(p); }
							var tid = d.id.toString(),
								i, j, c, e,
								tmp = {
									id			: tid,
									text		: d.text || '',
									icon		: d.icon !== undefined ? d.icon : true,
									parent		: p,
									parents		: ps,
									children	: d.children || [],
									children_d	: d.children_d || [],
									data		: d.data,
									state		: { },
									li_attr		: { id : false },
									a_attr		: { href : '#' },
									original	: false
								};
							for(i in df) {
								if(df.hasOwnProperty(i)) {
									tmp.state[i] = df[i];
								}
							}
							if(d && d.data && d.data.jstree && d.data.jstree.icon) {
								tmp.icon = d.data.jstree.icon;
							}
							if(tmp.icon === undefined || tmp.icon === null || tmp.icon === "") {
								tmp.icon = true;
							}
							if(d && d.data) {
								tmp.data = d.data;
								if(d.data.jstree) {
									for(i in d.data.jstree) {
										if(d.data.jstree.hasOwnProperty(i)) {
											tmp.state[i] = d.data.jstree[i];
										}
									}
								}
							}
							if(d && typeof d.state === 'object') {
								for (i in d.state) {
									if(d.state.hasOwnProperty(i)) {
										tmp.state[i] = d.state[i];
									}
								}
							}
							if(d && typeof d.li_attr === 'object') {
								for (i in d.li_attr) {
									if(d.li_attr.hasOwnProperty(i)) {
										tmp.li_attr[i] = d.li_attr[i];
									}
								}
							}
							if(!tmp.li_attr.id) {
								tmp.li_attr.id = tid;
							}
							if(d && typeof d.a_attr === 'object') {
								for (i in d.a_attr) {
									if(d.a_attr.hasOwnProperty(i)) {
										tmp.a_attr[i] = d.a_attr[i];
									}
								}
							}
							if(d && d.children && d.children === true) {
								tmp.state.loaded = false;
								tmp.children = [];
								tmp.children_d = [];
							}
							m[tmp.id] = tmp;
							for(i = 0, j = tmp.children.length; i < j; i++) {
								c = parse_flat(m[tmp.children[i]], tmp.id, ps);
								e = m[c];
								tmp.children_d.push(c);
								if(e.children_d.length) {
									tmp.children_d = tmp.children_d.concat(e.children_d);
								}
							}
							delete d.data;
							delete d.children;
							m[tmp.id].original = d;
							if(tmp.state.selected) {
								add.push(tmp.id);
							}
							return tmp.id;
						},
						parse_nest = function (d, p, ps) {
							if(!ps) { ps = []; }
							else { ps = ps.concat(); }
							if(p) { ps.unshift(p); }
							var tid = false, i, j, c, e, tmp;
							do {
								tid = 'j' + t_id + '_' + (++t_cnt);
							} while(m[tid]);

							tmp = {
								id			: false,
								text		: typeof d === 'string' ? d : '',
								icon		: typeof d === 'object' && d.icon !== undefined ? d.icon : true,
								parent		: p,
								parents		: ps,
								children	: [],
								children_d	: [],
								data		: null,
								state		: { },
								li_attr		: { id : false },
								a_attr		: { href : '#' },
								original	: false
							};
							for(i in df) {
								if(df.hasOwnProperty(i)) {
									tmp.state[i] = df[i];
								}
							}
							if(d && d.id) { tmp.id = d.id.toString(); }
							if(d && d.text) { tmp.text = d.text; }
							if(d && d.data && d.data.jstree && d.data.jstree.icon) {
								tmp.icon = d.data.jstree.icon;
							}
							if(tmp.icon === undefined || tmp.icon === null || tmp.icon === "") {
								tmp.icon = true;
							}
							if(d && d.data) {
								tmp.data = d.data;
								if(d.data.jstree) {
									for(i in d.data.jstree) {
										if(d.data.jstree.hasOwnProperty(i)) {
											tmp.state[i] = d.data.jstree[i];
										}
									}
								}
							}
							if(d && typeof d.state === 'object') {
								for (i in d.state) {
									if(d.state.hasOwnProperty(i)) {
										tmp.state[i] = d.state[i];
									}
								}
							}
							if(d && typeof d.li_attr === 'object') {
								for (i in d.li_attr) {
									if(d.li_attr.hasOwnProperty(i)) {
										tmp.li_attr[i] = d.li_attr[i];
									}
								}
							}
							if(tmp.li_attr.id && !tmp.id) {
								tmp.id = tmp.li_attr.id.toString();
							}
							if(!tmp.id) {
								tmp.id = tid;
							}
							if(!tmp.li_attr.id) {
								tmp.li_attr.id = tmp.id;
							}
							if(d && typeof d.a_attr === 'object') {
								for (i in d.a_attr) {
									if(d.a_attr.hasOwnProperty(i)) {
										tmp.a_attr[i] = d.a_attr[i];
									}
								}
							}
							if(d && d.children && d.children.length) {
								for(i = 0, j = d.children.length; i < j; i++) {
									c = parse_nest(d.children[i], tmp.id, ps);
									e = m[c];
									tmp.children.push(c);
									if(e.children_d.length) {
										tmp.children_d = tmp.children_d.concat(e.children_d);
									}
								}
								tmp.children_d = tmp.children_d.concat(tmp.children);
							}
							if(d && d.children && d.children === true) {
								tmp.state.loaded = false;
								tmp.children = [];
								tmp.children_d = [];
							}
							delete d.data;
							delete d.children;
							tmp.original = d;
							m[tmp.id] = tmp;
							if(tmp.state.selected) {
								add.push(tmp.id);
							}
							return tmp.id;
						};

					if(dat.length && dat[0].id !== undefined && dat[0].parent !== undefined) {
						// Flat JSON support (for easy import from DB):
						// 1) convert to object (foreach)
						for(i = 0, j = dat.length; i < j; i++) {
							if(!dat[i].children) {
								dat[i].children = [];
							}
							if(!dat[i].state) {
								dat[i].state = {};
							}
							m[dat[i].id.toString()] = dat[i];
						}
						// 2) populate children (foreach)
						for(i = 0, j = dat.length; i < j; i++) {
							if (!m[dat[i].parent.toString()]) {
								if (typeof inst !== "undefined") {
									inst._data.core.last_error = { 'error' : 'parse', 'plugin' : 'core', 'id' : 'core_07', 'reason' : 'Node with invalid parent', 'data' : JSON.stringify({ 'id' : dat[i].id.toString(), 'parent' : dat[i].parent.toString() }) };
									inst.settings.core.error.call(inst, inst._data.core.last_error);
								}
								continue;
							}

							m[dat[i].parent.toString()].children.push(dat[i].id.toString());
							// populate parent.children_d
							p.children_d.push(dat[i].id.toString());
						}
						// 3) normalize && populate parents and children_d with recursion
						for(i = 0, j = p.children.length; i < j; i++) {
							tmp = parse_flat(m[p.children[i]], par, p.parents.concat());
							dpc.push(tmp);
							if(m[tmp].children_d.length) {
								dpc = dpc.concat(m[tmp].children_d);
							}
						}
						for(i = 0, j = p.parents.length; i < j; i++) {
							m[p.parents[i]].children_d = m[p.parents[i]].children_d.concat(dpc);
						}
						// ?) three_state selection - p.state.selected && t - (if three_state foreach(dat => ch) -> foreach(parents) if(parent.selected) child.selected = true;
						rslt = {
							'cnt' : t_cnt,
							'mod' : m,
							'sel' : sel,
							'par' : par,
							'dpc' : dpc,
							'add' : add
						};
					}
					else {
						for(i = 0, j = dat.length; i < j; i++) {
							tmp = parse_nest(dat[i], par, p.parents.concat());
							if(tmp) {
								chd.push(tmp);
								dpc.push(tmp);
								if(m[tmp].children_d.length) {
									dpc = dpc.concat(m[tmp].children_d);
								}
							}
						}
						p.children = chd;
						p.children_d = dpc;
						for(i = 0, j = p.parents.length; i < j; i++) {
							m[p.parents[i]].children_d = m[p.parents[i]].children_d.concat(dpc);
						}
						rslt = {
							'cnt' : t_cnt,
							'mod' : m,
							'sel' : sel,
							'par' : par,
							'dpc' : dpc,
							'add' : add
						};
					}
					if(typeof window === 'undefined' || typeof window.document === 'undefined') {
						postMessage(rslt);
					}
					else {
						return rslt;
					}
				},
				rslt = function (rslt, worker) {
					if(this.element === null) { return; }
					this._cnt = rslt.cnt;
					var i, m = this._model.data;
					for (i in m) {
						if (m.hasOwnProperty(i) && m[i].state && m[i].state.loading && rslt.mod[i]) {
							rslt.mod[i].state.loading = true;
						}
					}
					this._model.data = rslt.mod; // breaks the reference in load_node - careful

					if(worker) {
						var j, a = rslt.add, r = rslt.sel, s = this._data.core.selected.slice();
						m = this._model.data;
						// if selection was changed while calculating in worker
						if(r.length !== s.length || $.vakata.array_unique(r.concat(s)).length !== r.length) {
							// deselect nodes that are no longer selected
							for(i = 0, j = r.length; i < j; i++) {
								if($.inArray(r[i], a) === -1 && $.inArray(r[i], s) === -1) {
									m[r[i]].state.selected = false;
								}
							}
							// select nodes that were selected in the mean time
							for(i = 0, j = s.length; i < j; i++) {
								if($.inArray(s[i], r) === -1) {
									m[s[i]].state.selected = true;
								}
							}
						}
					}
					if(rslt.add.length) {
						this._data.core.selected = this._data.core.selected.concat(rslt.add);
					}

					this.trigger('model', { "nodes" : rslt.dpc, 'parent' : rslt.par });

					if(rslt.par !== $.jstree.root) {
						this._node_changed(rslt.par);
						this.redraw();
					}
					else {
						// this.get_container_ul().children('.jstree-initial-node').remove();
						this.redraw(true);
					}
					if(rslt.add.length) {
						this.trigger('changed', { 'action' : 'model', 'selected' : this._data.core.selected });
					}
					cb.call(this, true);
				};
			if(this.settings.core.worker && window.Blob && window.URL && window.Worker) {
				try {
					if(this._wrk === null) {
						this._wrk = window.URL.createObjectURL(
							new window.Blob(
								['self.onmessage = ' + func.toString()],
								{type:"text/javascript"}
							)
						);
					}
					if(!this._data.core.working || force_processing) {
						this._data.core.working = true;
						w = new window.Worker(this._wrk);
						w.onmessage = $.proxy(function (e) {
							rslt.call(this, e.data, true);
							try { w.terminate(); w = null; } catch(ignore) { }
							if(this._data.core.worker_queue.length) {
								this._append_json_data.apply(this, this._data.core.worker_queue.shift());
							}
							else {
								this._data.core.working = false;
							}
						}, this);
						if(!args.par) {
							if(this._data.core.worker_queue.length) {
								this._append_json_data.apply(this, this._data.core.worker_queue.shift());
							}
							else {
								this._data.core.working = false;
							}
						}
						else {
							w.postMessage(args);
						}
					}
					else {
						this._data.core.worker_queue.push([dom, data, cb, true]);
					}
				}
				catch(e) {
					rslt.call(this, func(args), false);
					if(this._data.core.worker_queue.length) {
						this._append_json_data.apply(this, this._data.core.worker_queue.shift());
					}
					else {
						this._data.core.working = false;
					}
				}
			}
			else {
				rslt.call(this, func(args), false);
			}
		},
		/**
		 * parses a node from a jQuery object and appends them to the in memory tree model. Used internally.
		 * @private
		 * @name _parse_model_from_html(d [, p, ps])
		 * @param  {jQuery} d the jQuery object to parse
		 * @param  {String} p the parent ID
		 * @param  {Array} ps list of all parents
		 * @return {String} the ID of the object added to the model
		 */
		_parse_model_from_html : function (d, p, ps) {
			if(!ps) { ps = []; }
			else { ps = [].concat(ps); }
			if(p) { ps.unshift(p); }
			var c, e, m = this._model.data,
				data = {
					id			: false,
					text		: false,
					icon		: true,
					parent		: p,
					parents		: ps,
					children	: [],
					children_d	: [],
					data		: null,
					state		: { },
					li_attr		: { id : false },
					a_attr		: { href : '#' },
					original	: false
				}, i, tmp, tid;
			for(i in this._model.default_state) {
				if(this._model.default_state.hasOwnProperty(i)) {
					data.state[i] = this._model.default_state[i];
				}
			}
			tmp = $.vakata.attributes(d, true);
			$.each(tmp, function (i, v) {
				v = $.trim(v);
				if(!v.length) { return true; }
				data.li_attr[i] = v;
				if(i === 'id') {
					data.id = v.toString();
				}
			});
			tmp = d.children('a').first();
			if(tmp.length) {
				tmp = $.vakata.attributes(tmp, true);
				$.each(tmp, function (i, v) {
					v = $.trim(v);
					if(v.length) {
						data.a_attr[i] = v;
					}
				});
			}
			tmp = d.children("a").first().length ? d.children("a").first().clone() : d.clone();
			tmp.children("ins, i, ul").remove();
			tmp = tmp.html();
			tmp = $('<div />').html(tmp);
			data.text = this.settings.core.force_text ? tmp.text() : tmp.html();
			tmp = d.data();
			data.data = tmp ? $.extend(true, {}, tmp) : null;
			data.state.opened = d.hasClass('jstree-open');
			data.state.selected = d.children('a').hasClass('jstree-clicked');
			data.state.disabled = d.children('a').hasClass('jstree-disabled');
			if(data.data && data.data.jstree) {
				for(i in data.data.jstree) {
					if(data.data.jstree.hasOwnProperty(i)) {
						data.state[i] = data.data.jstree[i];
					}
				}
			}
			tmp = d.children("a").children(".jstree-themeicon");
			if(tmp.length) {
				data.icon = tmp.hasClass('jstree-themeicon-hidden') ? false : tmp.attr('rel');
			}
			if(data.state.icon !== undefined) {
				data.icon = data.state.icon;
			}
			if(data.icon === undefined || data.icon === null || data.icon === "") {
				data.icon = true;
			}
			tmp = d.children("ul").children("li");
			do {
				tid = 'j' + this._id + '_' + (++this._cnt);
			} while(m[tid]);
			data.id = data.li_attr.id ? data.li_attr.id.toString() : tid;
			if(tmp.length) {
				tmp.each($.proxy(function (i, v) {
					c = this._parse_model_from_html($(v), data.id, ps);
					e = this._model.data[c];
					data.children.push(c);
					if(e.children_d.length) {
						data.children_d = data.children_d.concat(e.children_d);
					}
				}, this));
				data.children_d = data.children_d.concat(data.children);
			}
			else {
				if(d.hasClass('jstree-closed')) {
					data.state.loaded = false;
				}
			}
			if(data.li_attr['class']) {
				data.li_attr['class'] = data.li_attr['class'].replace('jstree-closed','').replace('jstree-open','');
			}
			if(data.a_attr['class']) {
				data.a_attr['class'] = data.a_attr['class'].replace('jstree-clicked','').replace('jstree-disabled','');
			}
			m[data.id] = data;
			if(data.state.selected) {
				this._data.core.selected.push(data.id);
			}
			return data.id;
		},
		/**
		 * parses a node from a JSON object (used when dealing with flat data, which has no nesting of children, but has id and parent properties) and appends it to the in memory tree model. Used internally.
		 * @private
		 * @name _parse_model_from_flat_json(d [, p, ps])
		 * @param  {Object} d the JSON object to parse
		 * @param  {String} p the parent ID
		 * @param  {Array} ps list of all parents
		 * @return {String} the ID of the object added to the model
		 */
		_parse_model_from_flat_json : function (d, p, ps) {
			if(!ps) { ps = []; }
			else { ps = ps.concat(); }
			if(p) { ps.unshift(p); }
			var tid = d.id.toString(),
				m = this._model.data,
				df = this._model.default_state,
				i, j, c, e,
				tmp = {
					id			: tid,
					text		: d.text || '',
					icon		: d.icon !== undefined ? d.icon : true,
					parent		: p,
					parents		: ps,
					children	: d.children || [],
					children_d	: d.children_d || [],
					data		: d.data,
					state		: { },
					li_attr		: { id : false },
					a_attr		: { href : '#' },
					original	: false
				};
			for(i in df) {
				if(df.hasOwnProperty(i)) {
					tmp.state[i] = df[i];
				}
			}
			if(d && d.data && d.data.jstree && d.data.jstree.icon) {
				tmp.icon = d.data.jstree.icon;
			}
			if(tmp.icon === undefined || tmp.icon === null || tmp.icon === "") {
				tmp.icon = true;
			}
			if(d && d.data) {
				tmp.data = d.data;
				if(d.data.jstree) {
					for(i in d.data.jstree) {
						if(d.data.jstree.hasOwnProperty(i)) {
							tmp.state[i] = d.data.jstree[i];
						}
					}
				}
			}
			if(d && typeof d.state === 'object') {
				for (i in d.state) {
					if(d.state.hasOwnProperty(i)) {
						tmp.state[i] = d.state[i];
					}
				}
			}
			if(d && typeof d.li_attr === 'object') {
				for (i in d.li_attr) {
					if(d.li_attr.hasOwnProperty(i)) {
						tmp.li_attr[i] = d.li_attr[i];
					}
				}
			}
			if(!tmp.li_attr.id) {
				tmp.li_attr.id = tid;
			}
			if(d && typeof d.a_attr === 'object') {
				for (i in d.a_attr) {
					if(d.a_attr.hasOwnProperty(i)) {
						tmp.a_attr[i] = d.a_attr[i];
					}
				}
			}
			if(d && d.children && d.children === true) {
				tmp.state.loaded = false;
				tmp.children = [];
				tmp.children_d = [];
			}
			m[tmp.id] = tmp;
			for(i = 0, j = tmp.children.length; i < j; i++) {
				c = this._parse_model_from_flat_json(m[tmp.children[i]], tmp.id, ps);
				e = m[c];
				tmp.children_d.push(c);
				if(e.children_d.length) {
					tmp.children_d = tmp.children_d.concat(e.children_d);
				}
			}
			delete d.data;
			delete d.children;
			m[tmp.id].original = d;
			if(tmp.state.selected) {
				this._data.core.selected.push(tmp.id);
			}
			return tmp.id;
		},
		/**
		 * parses a node from a JSON object and appends it to the in memory tree model. Used internally.
		 * @private
		 * @name _parse_model_from_json(d [, p, ps])
		 * @param  {Object} d the JSON object to parse
		 * @param  {String} p the parent ID
		 * @param  {Array} ps list of all parents
		 * @return {String} the ID of the object added to the model
		 */
		_parse_model_from_json : function (d, p, ps) {
			if(!ps) { ps = []; }
			else { ps = ps.concat(); }
			if(p) { ps.unshift(p); }
			var tid = false, i, j, c, e, m = this._model.data, df = this._model.default_state, tmp;
			do {
				tid = 'j' + this._id + '_' + (++this._cnt);
			} while(m[tid]);

			tmp = {
				id			: false,
				text		: typeof d === 'string' ? d : '',
				icon		: typeof d === 'object' && d.icon !== undefined ? d.icon : true,
				parent		: p,
				parents		: ps,
				children	: [],
				children_d	: [],
				data		: null,
				state		: { },
				li_attr		: { id : false },
				a_attr		: { href : '#' },
				original	: false
			};
			for(i in df) {
				if(df.hasOwnProperty(i)) {
					tmp.state[i] = df[i];
				}
			}
			if(d && d.id) { tmp.id = d.id.toString(); }
			if(d && d.text) { tmp.text = d.text; }
			if(d && d.data && d.data.jstree && d.data.jstree.icon) {
				tmp.icon = d.data.jstree.icon;
			}
			if(tmp.icon === undefined || tmp.icon === null || tmp.icon === "") {
				tmp.icon = true;
			}
			if(d && d.data) {
				tmp.data = d.data;
				if(d.data.jstree) {
					for(i in d.data.jstree) {
						if(d.data.jstree.hasOwnProperty(i)) {
							tmp.state[i] = d.data.jstree[i];
						}
					}
				}
			}
			if(d && typeof d.state === 'object') {
				for (i in d.state) {
					if(d.state.hasOwnProperty(i)) {
						tmp.state[i] = d.state[i];
					}
				}
			}
			if(d && typeof d.li_attr === 'object') {
				for (i in d.li_attr) {
					if(d.li_attr.hasOwnProperty(i)) {
						tmp.li_attr[i] = d.li_attr[i];
					}
				}
			}
			if(tmp.li_attr.id && !tmp.id) {
				tmp.id = tmp.li_attr.id.toString();
			}
			if(!tmp.id) {
				tmp.id = tid;
			}
			if(!tmp.li_attr.id) {
				tmp.li_attr.id = tmp.id;
			}
			if(d && typeof d.a_attr === 'object') {
				for (i in d.a_attr) {
					if(d.a_attr.hasOwnProperty(i)) {
						tmp.a_attr[i] = d.a_attr[i];
					}
				}
			}
			if(d && d.children && d.children.length) {
				for(i = 0, j = d.children.length; i < j; i++) {
					c = this._parse_model_from_json(d.children[i], tmp.id, ps);
					e = m[c];
					tmp.children.push(c);
					if(e.children_d.length) {
						tmp.children_d = tmp.children_d.concat(e.children_d);
					}
				}
				tmp.children_d = tmp.children.concat(tmp.children_d);
			}
			if(d && d.children && d.children === true) {
				tmp.state.loaded = false;
				tmp.children = [];
				tmp.children_d = [];
			}
			delete d.data;
			delete d.children;
			tmp.original = d;
			m[tmp.id] = tmp;
			if(tmp.state.selected) {
				this._data.core.selected.push(tmp.id);
			}
			return tmp.id;
		},
		/**
		 * redraws all nodes that need to be redrawn. Used internally.
		 * @private
		 * @name _redraw()
		 * @trigger redraw.jstree
		 */
		_redraw : function () {
			var nodes = this._model.force_full_redraw ? this._model.data[$.jstree.root].children.concat([]) : this._model.changed.concat([]),
				f = document.createElement('UL'), tmp, i, j, fe = this._data.core.focused;
			for(i = 0, j = nodes.length; i < j; i++) {
				tmp = this.redraw_node(nodes[i], true, this._model.force_full_redraw);
				if(tmp && this._model.force_full_redraw) {
					f.appendChild(tmp);
				}
			}
			if(this._model.force_full_redraw) {
				f.className = this.get_container_ul()[0].className;
				f.setAttribute('role','group');
				this.element.empty().append(f);
				//this.get_container_ul()[0].appendChild(f);
			}
			if(fe !== null && this.settings.core.restore_focus) {
				tmp = this.get_node(fe, true);
				if(tmp && tmp.length && tmp.children('.jstree-anchor')[0] !== document.activeElement) {
					tmp.children('.jstree-anchor').focus();
				}
				else {
					this._data.core.focused = null;
				}
			}
			this._model.force_full_redraw = false;
			this._model.changed = [];
			/**
			 * triggered after nodes are redrawn
			 * @event
			 * @name redraw.jstree
			 * @param {array} nodes the redrawn nodes
			 */
			this.trigger('redraw', { "nodes" : nodes });
		},
		/**
		 * redraws all nodes that need to be redrawn or optionally - the whole tree
		 * @name redraw([full])
		 * @param {Boolean} full if set to `true` all nodes are redrawn.
		 */
		redraw : function (full) {
			if(full) {
				this._model.force_full_redraw = true;
			}
			//if(this._model.redraw_timeout) {
			//	clearTimeout(this._model.redraw_timeout);
			//}
			//this._model.redraw_timeout = setTimeout($.proxy(this._redraw, this),0);
			this._redraw();
		},
		/**
		 * redraws a single node's children. Used internally.
		 * @private
		 * @name draw_children(node)
		 * @param {mixed} node the node whose children will be redrawn
		 */
		draw_children : function (node) {
			var obj = this.get_node(node),
				i = false,
				j = false,
				k = false,
				d = document;
			if(!obj) { return false; }
			if(obj.id === $.jstree.root) { return this.redraw(true); }
			node = this.get_node(node, true);
			if(!node || !node.length) { return false; } // TODO: quick toggle

			node.children('.jstree-children').remove();
			node = node[0];
			if(obj.children.length && obj.state.loaded) {
				k = d.createElement('UL');
				k.setAttribute('role', 'group');
				k.className = 'jstree-children';
				for(i = 0, j = obj.children.length; i < j; i++) {
					k.appendChild(this.redraw_node(obj.children[i], true, true));
				}
				node.appendChild(k);
			}
		},
		/**
		 * redraws a single node. Used internally.
		 * @private
		 * @name redraw_node(node, deep, is_callback, force_render)
		 * @param {mixed} node the node to redraw
		 * @param {Boolean} deep should child nodes be redrawn too
		 * @param {Boolean} is_callback is this a recursion call
		 * @param {Boolean} force_render should children of closed parents be drawn anyway
		 */
		redraw_node : function (node, deep, is_callback, force_render) {
			var obj = this.get_node(node),
				par = false,
				ind = false,
				old = false,
				i = false,
				j = false,
				k = false,
				c = '',
				d = document,
				m = this._model.data,
				f = false,
				s = false,
				tmp = null,
				t = 0,
				l = 0,
				has_children = false,
				last_sibling = false;
			if(!obj) { return false; }
			if(obj.id === $.jstree.root) {  return this.redraw(true); }
			deep = deep || obj.children.length === 0;
			node = !document.querySelector ? document.getElementById(obj.id) : this.element[0].querySelector('#' + ("0123456789".indexOf(obj.id[0]) !== -1 ? '\\3' + obj.id[0] + ' ' + obj.id.substr(1).replace($.jstree.idregex,'\\$&') : obj.id.replace($.jstree.idregex,'\\$&')) ); //, this.element);
			if(!node) {
				deep = true;
				//node = d.createElement('LI');
				if(!is_callback) {
					par = obj.parent !== $.jstree.root ? $('#' + obj.parent.replace($.jstree.idregex,'\\$&'), this.element)[0] : null;
					if(par !== null && (!par || !m[obj.parent].state.opened)) {
						return false;
					}
					ind = $.inArray(obj.id, par === null ? m[$.jstree.root].children : m[obj.parent].children);
				}
			}
			else {
				node = $(node);
				if(!is_callback) {
					par = node.parent().parent()[0];
					if(par === this.element[0]) {
						par = null;
					}
					ind = node.index();
				}
				// m[obj.id].data = node.data(); // use only node's data, no need to touch jquery storage
				if(!deep && obj.children.length && !node.children('.jstree-children').length) {
					deep = true;
				}
				if(!deep) {
					old = node.children('.jstree-children')[0];
				}
				f = node.children('.jstree-anchor')[0] === document.activeElement;
				node.remove();
				//node = d.createElement('LI');
				//node = node[0];
			}
			node = this._data.core.node.cloneNode(true);
			// node is DOM, deep is boolean

			c = 'jstree-node ';
			for(i in obj.li_attr) {
				if(obj.li_attr.hasOwnProperty(i)) {
					if(i === 'id') { continue; }
					if(i !== 'class') {
						node.setAttribute(i, obj.li_attr[i]);
					}
					else {
						c += obj.li_attr[i];
					}
				}
			}
			if(!obj.a_attr.id) {
				obj.a_attr.id = obj.id + '_anchor';
			}
			node.setAttribute('aria-selected', !!obj.state.selected);
			node.setAttribute('aria-level', obj.parents.length);
			node.setAttribute('aria-labelledby', obj.a_attr.id);
			if(obj.state.disabled) {
				node.setAttribute('aria-disabled', true);
			}

			for(i = 0, j = obj.children.length; i < j; i++) {
				if(!m[obj.children[i]].state.hidden) {
					has_children = true;
					break;
				}
			}
			if(obj.parent !== null && m[obj.parent] && !obj.state.hidden) {
				i = $.inArray(obj.id, m[obj.parent].children);
				last_sibling = obj.id;
				if(i !== -1) {
					i++;
					for(j = m[obj.parent].children.length; i < j; i++) {
						if(!m[m[obj.parent].children[i]].state.hidden) {
							last_sibling = m[obj.parent].children[i];
						}
						if(last_sibling !== obj.id) {
							break;
						}
					}
				}
			}

			if(obj.state.hidden) {
				c += ' jstree-hidden';
			}
			if (obj.state.loading) {
				c += ' jstree-loading';
			}
			if(obj.state.loaded && !has_children) {
				c += ' jstree-leaf';
			}
			else {
				c += obj.state.opened && obj.state.loaded ? ' jstree-open' : ' jstree-closed';
				node.setAttribute('aria-expanded', (obj.state.opened && obj.state.loaded) );
			}
			if(last_sibling === obj.id) {
				c += ' jstree-last';
			}
			node.id = obj.id;
			node.className = c;
			c = ( obj.state.selected ? ' jstree-clicked' : '') + ( obj.state.disabled ? ' jstree-disabled' : '');
			for(j in obj.a_attr) {
				if(obj.a_attr.hasOwnProperty(j)) {
					if(j === 'href' && obj.a_attr[j] === '#') { continue; }
					if(j !== 'class') {
						node.childNodes[1].setAttribute(j, obj.a_attr[j]);
					}
					else {
						c += ' ' + obj.a_attr[j];
					}
				}
			}
			if(c.length) {
				node.childNodes[1].className = 'jstree-anchor ' + c;
			}
			if((obj.icon && obj.icon !== true) || obj.icon === false) {
				if(obj.icon === false) {
					node.childNodes[1].childNodes[0].className += ' jstree-themeicon-hidden';
				}
				else if(obj.icon.indexOf('/') === -1 && obj.icon.indexOf('.') === -1) {
					node.childNodes[1].childNodes[0].className += ' ' + obj.icon + ' jstree-themeicon-custom';
				}
				else {
					node.childNodes[1].childNodes[0].style.backgroundImage = 'url("'+obj.icon+'")';
					node.childNodes[1].childNodes[0].style.backgroundPosition = 'center center';
					node.childNodes[1].childNodes[0].style.backgroundSize = 'auto';
					node.childNodes[1].childNodes[0].className += ' jstree-themeicon-custom';
				}
			}

			if(this.settings.core.force_text) {
				node.childNodes[1].appendChild(d.createTextNode(obj.text));
			}
			else {
				node.childNodes[1].innerHTML += obj.text;
			}


			if(deep && obj.children.length && (obj.state.opened || force_render) && obj.state.loaded) {
				k = d.createElement('UL');
				k.setAttribute('role', 'group');
				k.className = 'jstree-children';
				for(i = 0, j = obj.children.length; i < j; i++) {
					k.appendChild(this.redraw_node(obj.children[i], deep, true));
				}
				node.appendChild(k);
			}
			if(old) {
				node.appendChild(old);
			}
			if(!is_callback) {
				// append back using par / ind
				if(!par) {
					par = this.element[0];
				}
				for(i = 0, j = par.childNodes.length; i < j; i++) {
					if(par.childNodes[i] && par.childNodes[i].className && par.childNodes[i].className.indexOf('jstree-children') !== -1) {
						tmp = par.childNodes[i];
						break;
					}
				}
				if(!tmp) {
					tmp = d.createElement('UL');
					tmp.setAttribute('role', 'group');
					tmp.className = 'jstree-children';
					par.appendChild(tmp);
				}
				par = tmp;

				if(ind < par.childNodes.length) {
					par.insertBefore(node, par.childNodes[ind]);
				}
				else {
					par.appendChild(node);
				}
				if(f) {
					t = this.element[0].scrollTop;
					l = this.element[0].scrollLeft;
					node.childNodes[1].focus();
					this.element[0].scrollTop = t;
					this.element[0].scrollLeft = l;
				}
			}
			if(obj.state.opened && !obj.state.loaded) {
				obj.state.opened = false;
				setTimeout($.proxy(function () {
					this.open_node(obj.id, false, 0);
				}, this), 0);
			}
			return node;
		},
		/**
		 * opens a node, revealing its children. If the node is not loaded it will be loaded and opened once ready.
		 * @name open_node(obj [, callback, animation])
		 * @param {mixed} obj the node to open
		 * @param {Function} callback a function to execute once the node is opened
		 * @param {Number} animation the animation duration in milliseconds when opening the node (overrides the `core.animation` setting). Use `false` for no animation.
		 * @trigger open_node.jstree, after_open.jstree, before_open.jstree
		 */
		open_node : function (obj, callback, animation) {
			var t1, t2, d, t;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.open_node(obj[t1], callback, animation);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			animation = animation === undefined ? this.settings.core.animation : animation;
			if(!this.is_closed(obj)) {
				if(callback) {
					callback.call(this, obj, false);
				}
				return false;
			}
			if(!this.is_loaded(obj)) {
				if(this.is_loading(obj)) {
					return setTimeout($.proxy(function () {
						this.open_node(obj, callback, animation);
					}, this), 500);
				}
				this.load_node(obj, function (o, ok) {
					return ok ? this.open_node(o, callback, animation) : (callback ? callback.call(this, o, false) : false);
				});
			}
			else {
				d = this.get_node(obj, true);
				t = this;
				if(d.length) {
					if(animation && d.children(".jstree-children").length) {
						d.children(".jstree-children").stop(true, true);
					}
					if(obj.children.length && !this._firstChild(d.children('.jstree-children')[0])) {
						this.draw_children(obj);
						//d = this.get_node(obj, true);
					}
					if(!animation) {
						this.trigger('before_open', { "node" : obj });
						d[0].className = d[0].className.replace('jstree-closed', 'jstree-open');
						d[0].setAttribute("aria-expanded", true);
					}
					else {
						this.trigger('before_open', { "node" : obj });
						d
							.children(".jstree-children").css("display","none").end()
							.removeClass("jstree-closed").addClass("jstree-open").attr("aria-expanded", true)
							.children(".jstree-children").stop(true, true)
								.slideDown(animation, function () {
									this.style.display = "";
									if (t.element) {
										t.trigger("after_open", { "node" : obj });
									}
								});
					}
				}
				obj.state.opened = true;
				if(callback) {
					callback.call(this, obj, true);
				}
				if(!d.length) {
					/**
					 * triggered when a node is about to be opened (if the node is supposed to be in the DOM, it will be, but it won't be visible yet)
					 * @event
					 * @name before_open.jstree
					 * @param {Object} node the opened node
					 */
					this.trigger('before_open', { "node" : obj });
				}
				/**
				 * triggered when a node is opened (if there is an animation it will not be completed yet)
				 * @event
				 * @name open_node.jstree
				 * @param {Object} node the opened node
				 */
				this.trigger('open_node', { "node" : obj });
				if(!animation || !d.length) {
					/**
					 * triggered when a node is opened and the animation is complete
					 * @event
					 * @name after_open.jstree
					 * @param {Object} node the opened node
					 */
					this.trigger("after_open", { "node" : obj });
				}
				return true;
			}
		},
		/**
		 * opens every parent of a node (node should be loaded)
		 * @name _open_to(obj)
		 * @param {mixed} obj the node to reveal
		 * @private
		 */
		_open_to : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			var i, j, p = obj.parents;
			for(i = 0, j = p.length; i < j; i+=1) {
				if(i !== $.jstree.root) {
					this.open_node(p[i], false, 0);
				}
			}
			return $('#' + obj.id.replace($.jstree.idregex,'\\$&'), this.element);
		},
		/**
		 * closes a node, hiding its children
		 * @name close_node(obj [, animation])
		 * @param {mixed} obj the node to close
		 * @param {Number} animation the animation duration in milliseconds when closing the node (overrides the `core.animation` setting). Use `false` for no animation.
		 * @trigger close_node.jstree, after_close.jstree
		 */
		close_node : function (obj, animation) {
			var t1, t2, t, d;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.close_node(obj[t1], animation);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			if(this.is_closed(obj)) {
				return false;
			}
			animation = animation === undefined ? this.settings.core.animation : animation;
			t = this;
			d = this.get_node(obj, true);

			obj.state.opened = false;
			/**
			 * triggered when a node is closed (if there is an animation it will not be complete yet)
			 * @event
			 * @name close_node.jstree
			 * @param {Object} node the closed node
			 */
			this.trigger('close_node',{ "node" : obj });
			if(!d.length) {
				/**
				 * triggered when a node is closed and the animation is complete
				 * @event
				 * @name after_close.jstree
				 * @param {Object} node the closed node
				 */
				this.trigger("after_close", { "node" : obj });
			}
			else {
				if(!animation) {
					d[0].className = d[0].className.replace('jstree-open', 'jstree-closed');
					d.attr("aria-expanded", false).children('.jstree-children').remove();
					this.trigger("after_close", { "node" : obj });
				}
				else {
					d
						.children(".jstree-children").attr("style","display:block !important").end()
						.removeClass("jstree-open").addClass("jstree-closed").attr("aria-expanded", false)
						.children(".jstree-children").stop(true, true).slideUp(animation, function () {
							this.style.display = "";
							d.children('.jstree-children').remove();
							if (t.element) {
								t.trigger("after_close", { "node" : obj });
							}
						});
				}
			}
		},
		/**
		 * toggles a node - closing it if it is open, opening it if it is closed
		 * @name toggle_node(obj)
		 * @param {mixed} obj the node to toggle
		 */
		toggle_node : function (obj) {
			var t1, t2;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.toggle_node(obj[t1]);
				}
				return true;
			}
			if(this.is_closed(obj)) {
				return this.open_node(obj);
			}
			if(this.is_open(obj)) {
				return this.close_node(obj);
			}
		},
		/**
		 * opens all nodes within a node (or the tree), revealing their children. If the node is not loaded it will be loaded and opened once ready.
		 * @name open_all([obj, animation, original_obj])
		 * @param {mixed} obj the node to open recursively, omit to open all nodes in the tree
		 * @param {Number} animation the animation duration in milliseconds when opening the nodes, the default is no animation
		 * @param {jQuery} reference to the node that started the process (internal use)
		 * @trigger open_all.jstree
		 */
		open_all : function (obj, animation, original_obj) {
			if(!obj) { obj = $.jstree.root; }
			obj = this.get_node(obj);
			if(!obj) { return false; }
			var dom = obj.id === $.jstree.root ? this.get_container_ul() : this.get_node(obj, true), i, j, _this;
			if(!dom.length) {
				for(i = 0, j = obj.children_d.length; i < j; i++) {
					if(this.is_closed(this._model.data[obj.children_d[i]])) {
						this._model.data[obj.children_d[i]].state.opened = true;
					}
				}
				return this.trigger('open_all', { "node" : obj });
			}
			original_obj = original_obj || dom;
			_this = this;
			dom = this.is_closed(obj) ? dom.find('.jstree-closed').addBack() : dom.find('.jstree-closed');
			dom.each(function () {
				_this.open_node(
					this,
					function(node, status) { if(status && this.is_parent(node)) { this.open_all(node, animation, original_obj); } },
					animation || 0
				);
			});
			if(original_obj.find('.jstree-closed').length === 0) {
				/**
				 * triggered when an `open_all` call completes
				 * @event
				 * @name open_all.jstree
				 * @param {Object} node the opened node
				 */
				this.trigger('open_all', { "node" : this.get_node(original_obj) });
			}
		},
		/**
		 * closes all nodes within a node (or the tree), revealing their children
		 * @name close_all([obj, animation])
		 * @param {mixed} obj the node to close recursively, omit to close all nodes in the tree
		 * @param {Number} animation the animation duration in milliseconds when closing the nodes, the default is no animation
		 * @trigger close_all.jstree
		 */
		close_all : function (obj, animation) {
			if(!obj) { obj = $.jstree.root; }
			obj = this.get_node(obj);
			if(!obj) { return false; }
			var dom = obj.id === $.jstree.root ? this.get_container_ul() : this.get_node(obj, true),
				_this = this, i, j;
			if(dom.length) {
				dom = this.is_open(obj) ? dom.find('.jstree-open').addBack() : dom.find('.jstree-open');
				$(dom.get().reverse()).each(function () { _this.close_node(this, animation || 0); });
			}
			for(i = 0, j = obj.children_d.length; i < j; i++) {
				this._model.data[obj.children_d[i]].state.opened = false;
			}
			/**
			 * triggered when an `close_all` call completes
			 * @event
			 * @name close_all.jstree
			 * @param {Object} node the closed node
			 */
			this.trigger('close_all', { "node" : obj });
		},
		/**
		 * checks if a node is disabled (not selectable)
		 * @name is_disabled(obj)
		 * @param  {mixed} obj
		 * @return {Boolean}
		 */
		is_disabled : function (obj) {
			obj = this.get_node(obj);
			return obj && obj.state && obj.state.disabled;
		},
		/**
		 * enables a node - so that it can be selected
		 * @name enable_node(obj)
		 * @param {mixed} obj the node to enable
		 * @trigger enable_node.jstree
		 */
		enable_node : function (obj) {
			var t1, t2;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.enable_node(obj[t1]);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			obj.state.disabled = false;
			this.get_node(obj,true).children('.jstree-anchor').removeClass('jstree-disabled').attr('aria-disabled', false);
			/**
			 * triggered when an node is enabled
			 * @event
			 * @name enable_node.jstree
			 * @param {Object} node the enabled node
			 */
			this.trigger('enable_node', { 'node' : obj });
		},
		/**
		 * disables a node - so that it can not be selected
		 * @name disable_node(obj)
		 * @param {mixed} obj the node to disable
		 * @trigger disable_node.jstree
		 */
		disable_node : function (obj) {
			var t1, t2;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.disable_node(obj[t1]);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			obj.state.disabled = true;
			this.get_node(obj,true).children('.jstree-anchor').addClass('jstree-disabled').attr('aria-disabled', true);
			/**
			 * triggered when an node is disabled
			 * @event
			 * @name disable_node.jstree
			 * @param {Object} node the disabled node
			 */
			this.trigger('disable_node', { 'node' : obj });
		},
		/**
		 * determines if a node is hidden
		 * @name is_hidden(obj)
		 * @param {mixed} obj the node
		 */
		is_hidden : function (obj) {
			obj = this.get_node(obj);
			return obj.state.hidden === true;
		},
		/**
		 * hides a node - it is still in the structure but will not be visible
		 * @name hide_node(obj)
		 * @param {mixed} obj the node to hide
		 * @param {Boolean} skip_redraw internal parameter controlling if redraw is called
		 * @trigger hide_node.jstree
		 */
		hide_node : function (obj, skip_redraw) {
			var t1, t2;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.hide_node(obj[t1], true);
				}
				if (!skip_redraw) {
					this.redraw();
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			if(!obj.state.hidden) {
				obj.state.hidden = true;
				this._node_changed(obj.parent);
				if(!skip_redraw) {
					this.redraw();
				}
				/**
				 * triggered when an node is hidden
				 * @event
				 * @name hide_node.jstree
				 * @param {Object} node the hidden node
				 */
				this.trigger('hide_node', { 'node' : obj });
			}
		},
		/**
		 * shows a node
		 * @name show_node(obj)
		 * @param {mixed} obj the node to show
		 * @param {Boolean} skip_redraw internal parameter controlling if redraw is called
		 * @trigger show_node.jstree
		 */
		show_node : function (obj, skip_redraw) {
			var t1, t2;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.show_node(obj[t1], true);
				}
				if (!skip_redraw) {
					this.redraw();
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			if(obj.state.hidden) {
				obj.state.hidden = false;
				this._node_changed(obj.parent);
				if(!skip_redraw) {
					this.redraw();
				}
				/**
				 * triggered when an node is shown
				 * @event
				 * @name show_node.jstree
				 * @param {Object} node the shown node
				 */
				this.trigger('show_node', { 'node' : obj });
			}
		},
		/**
		 * hides all nodes
		 * @name hide_all()
		 * @trigger hide_all.jstree
		 */
		hide_all : function (skip_redraw) {
			var i, m = this._model.data, ids = [];
			for(i in m) {
				if(m.hasOwnProperty(i) && i !== $.jstree.root && !m[i].state.hidden) {
					m[i].state.hidden = true;
					ids.push(i);
				}
			}
			this._model.force_full_redraw = true;
			if(!skip_redraw) {
				this.redraw();
			}
			/**
			 * triggered when all nodes are hidden
			 * @event
			 * @name hide_all.jstree
			 * @param {Array} nodes the IDs of all hidden nodes
			 */
			this.trigger('hide_all', { 'nodes' : ids });
			return ids;
		},
		/**
		 * shows all nodes
		 * @name show_all()
		 * @trigger show_all.jstree
		 */
		show_all : function (skip_redraw) {
			var i, m = this._model.data, ids = [];
			for(i in m) {
				if(m.hasOwnProperty(i) && i !== $.jstree.root && m[i].state.hidden) {
					m[i].state.hidden = false;
					ids.push(i);
				}
			}
			this._model.force_full_redraw = true;
			if(!skip_redraw) {
				this.redraw();
			}
			/**
			 * triggered when all nodes are shown
			 * @event
			 * @name show_all.jstree
			 * @param {Array} nodes the IDs of all shown nodes
			 */
			this.trigger('show_all', { 'nodes' : ids });
			return ids;
		},
		/**
		 * called when a node is selected by the user. Used internally.
		 * @private
		 * @name activate_node(obj, e)
		 * @param {mixed} obj the node
		 * @param {Object} e the related event
		 * @trigger activate_node.jstree, changed.jstree
		 */
		activate_node : function (obj, e) {
			if(this.is_disabled(obj)) {
				return false;
			}
			if(!e || typeof e !== 'object') {
				e = {};
			}

			// ensure last_clicked is still in the DOM, make it fresh (maybe it was moved?) and make sure it is still selected, if not - make last_clicked the last selected node
			this._data.core.last_clicked = this._data.core.last_clicked && this._data.core.last_clicked.id !== undefined ? this.get_node(this._data.core.last_clicked.id) : null;
			if(this._data.core.last_clicked && !this._data.core.last_clicked.state.selected) { this._data.core.last_clicked = null; }
			if(!this._data.core.last_clicked && this._data.core.selected.length) { this._data.core.last_clicked = this.get_node(this._data.core.selected[this._data.core.selected.length - 1]); }

			if(!this.settings.core.multiple || (!e.metaKey && !e.ctrlKey && !e.shiftKey) || (e.shiftKey && (!this._data.core.last_clicked || !this.get_parent(obj) || this.get_parent(obj) !== this._data.core.last_clicked.parent ) )) {
				if(!this.settings.core.multiple && (e.metaKey || e.ctrlKey || e.shiftKey) && this.is_selected(obj)) {
					this.deselect_node(obj, false, e);
				}
				else {
					this.deselect_all(true);
					this.select_node(obj, false, false, e);
					this._data.core.last_clicked = this.get_node(obj);
				}
			}
			else {
				if(e.shiftKey) {
					var o = this.get_node(obj).id,
						l = this._data.core.last_clicked.id,
						p = this.get_node(this._data.core.last_clicked.parent).children,
						c = false,
						i, j;
					for(i = 0, j = p.length; i < j; i += 1) {
						// separate IFs work whem o and l are the same
						if(p[i] === o) {
							c = !c;
						}
						if(p[i] === l) {
							c = !c;
						}
						if(!this.is_disabled(p[i]) && (c || p[i] === o || p[i] === l)) {
							if (!this.is_hidden(p[i])) {
								this.select_node(p[i], true, false, e);
							}
						}
						else {
							this.deselect_node(p[i], true, e);
						}
					}
					this.trigger('changed', { 'action' : 'select_node', 'node' : this.get_node(obj), 'selected' : this._data.core.selected, 'event' : e });
				}
				else {
					if(!this.is_selected(obj)) {
						this.select_node(obj, false, false, e);
					}
					else {
						this.deselect_node(obj, false, e);
					}
				}
			}
			/**
			 * triggered when an node is clicked or intercated with by the user
			 * @event
			 * @name activate_node.jstree
			 * @param {Object} node
			 * @param {Object} event the ooriginal event (if any) which triggered the call (may be an empty object)
			 */
			this.trigger('activate_node', { 'node' : this.get_node(obj), 'event' : e });
		},
		/**
		 * applies the hover state on a node, called when a node is hovered by the user. Used internally.
		 * @private
		 * @name hover_node(obj)
		 * @param {mixed} obj
		 * @trigger hover_node.jstree
		 */
		hover_node : function (obj) {
			obj = this.get_node(obj, true);
			if(!obj || !obj.length || obj.children('.jstree-hovered').length) {
				return false;
			}
			var o = this.element.find('.jstree-hovered'), t = this.element;
			if(o && o.length) { this.dehover_node(o); }

			obj.children('.jstree-anchor').addClass('jstree-hovered');
			/**
			 * triggered when an node is hovered
			 * @event
			 * @name hover_node.jstree
			 * @param {Object} node
			 */
			this.trigger('hover_node', { 'node' : this.get_node(obj) });
			setTimeout(function () { t.attr('aria-activedescendant', obj[0].id); }, 0);
		},
		/**
		 * removes the hover state from a nodecalled when a node is no longer hovered by the user. Used internally.
		 * @private
		 * @name dehover_node(obj)
		 * @param {mixed} obj
		 * @trigger dehover_node.jstree
		 */
		dehover_node : function (obj) {
			obj = this.get_node(obj, true);
			if(!obj || !obj.length || !obj.children('.jstree-hovered').length) {
				return false;
			}
			obj.children('.jstree-anchor').removeClass('jstree-hovered');
			/**
			 * triggered when an node is no longer hovered
			 * @event
			 * @name dehover_node.jstree
			 * @param {Object} node
			 */
			this.trigger('dehover_node', { 'node' : this.get_node(obj) });
		},
		/**
		 * select a node
		 * @name select_node(obj [, supress_event, prevent_open])
		 * @param {mixed} obj an array can be used to select multiple nodes
		 * @param {Boolean} supress_event if set to `true` the `changed.jstree` event won't be triggered
		 * @param {Boolean} prevent_open if set to `true` parents of the selected node won't be opened
		 * @trigger select_node.jstree, changed.jstree
		 */
		select_node : function (obj, supress_event, prevent_open, e) {
			var dom, t1, t2, th;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.select_node(obj[t1], supress_event, prevent_open, e);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			dom = this.get_node(obj, true);
			if(!obj.state.selected) {
				obj.state.selected = true;
				this._data.core.selected.push(obj.id);
				if(!prevent_open) {
					dom = this._open_to(obj);
				}
				if(dom && dom.length) {
					dom.attr('aria-selected', true).children('.jstree-anchor').addClass('jstree-clicked');
				}
				/**
				 * triggered when an node is selected
				 * @event
				 * @name select_node.jstree
				 * @param {Object} node
				 * @param {Array} selected the current selection
				 * @param {Object} event the event (if any) that triggered this select_node
				 */
				this.trigger('select_node', { 'node' : obj, 'selected' : this._data.core.selected, 'event' : e });
				if(!supress_event) {
					/**
					 * triggered when selection changes
					 * @event
					 * @name changed.jstree
					 * @param {Object} node
					 * @param {Object} action the action that caused the selection to change
					 * @param {Array} selected the current selection
					 * @param {Object} event the event (if any) that triggered this changed event
					 */
					this.trigger('changed', { 'action' : 'select_node', 'node' : obj, 'selected' : this._data.core.selected, 'event' : e });
				}
			}
		},
		/**
		 * deselect a node
		 * @name deselect_node(obj [, supress_event])
		 * @param {mixed} obj an array can be used to deselect multiple nodes
		 * @param {Boolean} supress_event if set to `true` the `changed.jstree` event won't be triggered
		 * @trigger deselect_node.jstree, changed.jstree
		 */
		deselect_node : function (obj, supress_event, e) {
			var t1, t2, dom;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.deselect_node(obj[t1], supress_event, e);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			dom = this.get_node(obj, true);
			if(obj.state.selected) {
				obj.state.selected = false;
				this._data.core.selected = $.vakata.array_remove_item(this._data.core.selected, obj.id);
				if(dom.length) {
					dom.attr('aria-selected', false).children('.jstree-anchor').removeClass('jstree-clicked');
				}
				/**
				 * triggered when an node is deselected
				 * @event
				 * @name deselect_node.jstree
				 * @param {Object} node
				 * @param {Array} selected the current selection
				 * @param {Object} event the event (if any) that triggered this deselect_node
				 */
				this.trigger('deselect_node', { 'node' : obj, 'selected' : this._data.core.selected, 'event' : e });
				if(!supress_event) {
					this.trigger('changed', { 'action' : 'deselect_node', 'node' : obj, 'selected' : this._data.core.selected, 'event' : e });
				}
			}
		},
		/**
		 * select all nodes in the tree
		 * @name select_all([supress_event])
		 * @param {Boolean} supress_event if set to `true` the `changed.jstree` event won't be triggered
		 * @trigger select_all.jstree, changed.jstree
		 */
		select_all : function (supress_event) {
			var tmp = this._data.core.selected.concat([]), i, j;
			this._data.core.selected = this._model.data[$.jstree.root].children_d.concat();
			for(i = 0, j = this._data.core.selected.length; i < j; i++) {
				if(this._model.data[this._data.core.selected[i]]) {
					this._model.data[this._data.core.selected[i]].state.selected = true;
				}
			}
			this.redraw(true);
			/**
			 * triggered when all nodes are selected
			 * @event
			 * @name select_all.jstree
			 * @param {Array} selected the current selection
			 */
			this.trigger('select_all', { 'selected' : this._data.core.selected });
			if(!supress_event) {
				this.trigger('changed', { 'action' : 'select_all', 'selected' : this._data.core.selected, 'old_selection' : tmp });
			}
		},
		/**
		 * deselect all selected nodes
		 * @name deselect_all([supress_event])
		 * @param {Boolean} supress_event if set to `true` the `changed.jstree` event won't be triggered
		 * @trigger deselect_all.jstree, changed.jstree
		 */
		deselect_all : function (supress_event) {
			var tmp = this._data.core.selected.concat([]), i, j;
			for(i = 0, j = this._data.core.selected.length; i < j; i++) {
				if(this._model.data[this._data.core.selected[i]]) {
					this._model.data[this._data.core.selected[i]].state.selected = false;
				}
			}
			this._data.core.selected = [];
			this.element.find('.jstree-clicked').removeClass('jstree-clicked').parent().attr('aria-selected', false);
			/**
			 * triggered when all nodes are deselected
			 * @event
			 * @name deselect_all.jstree
			 * @param {Object} node the previous selection
			 * @param {Array} selected the current selection
			 */
			this.trigger('deselect_all', { 'selected' : this._data.core.selected, 'node' : tmp });
			if(!supress_event) {
				this.trigger('changed', { 'action' : 'deselect_all', 'selected' : this._data.core.selected, 'old_selection' : tmp });
			}
		},
		/**
		 * checks if a node is selected
		 * @name is_selected(obj)
		 * @param  {mixed}  obj
		 * @return {Boolean}
		 */
		is_selected : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			return obj.state.selected;
		},
		/**
		 * get an array of all selected nodes
		 * @name get_selected([full])
		 * @param  {mixed}  full if set to `true` the returned array will consist of the full node objects, otherwise - only IDs will be returned
		 * @return {Array}
		 */
		get_selected : function (full) {
			return full ? $.map(this._data.core.selected, $.proxy(function (i) { return this.get_node(i); }, this)) : this._data.core.selected.slice();
		},
		/**
		 * get an array of all top level selected nodes (ignoring children of selected nodes)
		 * @name get_top_selected([full])
		 * @param  {mixed}  full if set to `true` the returned array will consist of the full node objects, otherwise - only IDs will be returned
		 * @return {Array}
		 */
		get_top_selected : function (full) {
			var tmp = this.get_selected(true),
				obj = {}, i, j, k, l;
			for(i = 0, j = tmp.length; i < j; i++) {
				obj[tmp[i].id] = tmp[i];
			}
			for(i = 0, j = tmp.length; i < j; i++) {
				for(k = 0, l = tmp[i].children_d.length; k < l; k++) {
					if(obj[tmp[i].children_d[k]]) {
						delete obj[tmp[i].children_d[k]];
					}
				}
			}
			tmp = [];
			for(i in obj) {
				if(obj.hasOwnProperty(i)) {
					tmp.push(i);
				}
			}
			return full ? $.map(tmp, $.proxy(function (i) { return this.get_node(i); }, this)) : tmp;
		},
		/**
		 * get an array of all bottom level selected nodes (ignoring selected parents)
		 * @name get_bottom_selected([full])
		 * @param  {mixed}  full if set to `true` the returned array will consist of the full node objects, otherwise - only IDs will be returned
		 * @return {Array}
		 */
		get_bottom_selected : function (full) {
			var tmp = this.get_selected(true),
				obj = [], i, j;
			for(i = 0, j = tmp.length; i < j; i++) {
				if(!tmp[i].children.length) {
					obj.push(tmp[i].id);
				}
			}
			return full ? $.map(obj, $.proxy(function (i) { return this.get_node(i); }, this)) : obj;
		},
		/**
		 * gets the current state of the tree so that it can be restored later with `set_state(state)`. Used internally.
		 * @name get_state()
		 * @private
		 * @return {Object}
		 */
		get_state : function () {
			var state	= {
				'core' : {
					'open' : [],
					'loaded' : [],
					'scroll' : {
						'left' : this.element.scrollLeft(),
						'top' : this.element.scrollTop()
					},
					/*!
					'themes' : {
						'name' : this.get_theme(),
						'icons' : this._data.core.themes.icons,
						'dots' : this._data.core.themes.dots
					},
					*/
					'selected' : []
				}
			}, i;
			for(i in this._model.data) {
				if(this._model.data.hasOwnProperty(i)) {
					if(i !== $.jstree.root) {
						if(this._model.data[i].state.loaded && this.settings.core.loaded_state) {
							state.core.loaded.push(i);
						}
						if(this._model.data[i].state.opened) {
							state.core.open.push(i);
						}
						if(this._model.data[i].state.selected) {
							state.core.selected.push(i);
						}
					}
				}
			}
			return state;
		},
		/**
		 * sets the state of the tree. Used internally.
		 * @name set_state(state [, callback])
		 * @private
		 * @param {Object} state the state to restore. Keep in mind this object is passed by reference and jstree will modify it.
		 * @param {Function} callback an optional function to execute once the state is restored.
		 * @trigger set_state.jstree
		 */
		set_state : function (state, callback) {
			if(state) {
				if(state.core && state.core.selected && state.core.initial_selection === undefined) {
					state.core.initial_selection = this._data.core.selected.concat([]).sort().join(',');
				}
				if(state.core) {
					var res, n, t, _this, i;
					if(state.core.loaded) {
						if(!this.settings.core.loaded_state || !$.isArray(state.core.loaded) || !state.core.loaded.length) {
							delete state.core.loaded;
							this.set_state(state, callback);
						}
						else {
							this._load_nodes(state.core.loaded, function (nodes) {
								delete state.core.loaded;
								this.set_state(state, callback);
							});
						}
						return false;
					}
					if(state.core.open) {
						if(!$.isArray(state.core.open) || !state.core.open.length) {
							delete state.core.open;
							this.set_state(state, callback);
						}
						else {
							this._load_nodes(state.core.open, function (nodes) {
								this.open_node(nodes, false, 0);
								delete state.core.open;
								this.set_state(state, callback);
							});
						}
						return false;
					}
					if(state.core.scroll) {
						if(state.core.scroll && state.core.scroll.left !== undefined) {
							this.element.scrollLeft(state.core.scroll.left);
						}
						if(state.core.scroll && state.core.scroll.top !== undefined) {
							this.element.scrollTop(state.core.scroll.top);
						}
						delete state.core.scroll;
						this.set_state(state, callback);
						return false;
					}
					if(state.core.selected) {
						_this = this;
						if (state.core.initial_selection === undefined ||
							state.core.initial_selection === this._data.core.selected.concat([]).sort().join(',')
						) {
							this.deselect_all();
							$.each(state.core.selected, function (i, v) {
								_this.select_node(v, false, true);
							});
						}
						delete state.core.initial_selection;
						delete state.core.selected;
						this.set_state(state, callback);
						return false;
					}
					for(i in state) {
						if(state.hasOwnProperty(i) && i !== "core" && $.inArray(i, this.settings.plugins) === -1) {
							delete state[i];
						}
					}
					if($.isEmptyObject(state.core)) {
						delete state.core;
						this.set_state(state, callback);
						return false;
					}
				}
				if($.isEmptyObject(state)) {
					state = null;
					if(callback) { callback.call(this); }
					/**
					 * triggered when a `set_state` call completes
					 * @event
					 * @name set_state.jstree
					 */
					this.trigger('set_state');
					return false;
				}
				return true;
			}
			return false;
		},
		/**
		 * refreshes the tree - all nodes are reloaded with calls to `load_node`.
		 * @name refresh()
		 * @param {Boolean} skip_loading an option to skip showing the loading indicator
		 * @param {Mixed} forget_state if set to `true` state will not be reapplied, if set to a function (receiving the current state as argument) the result of that function will be used as state
		 * @trigger refresh.jstree
		 */
		refresh : function (skip_loading, forget_state) {
			this._data.core.state = forget_state === true ? {} : this.get_state();
			if(forget_state && $.isFunction(forget_state)) { this._data.core.state = forget_state.call(this, this._data.core.state); }
			this._cnt = 0;
			this._model.data = {};
			this._model.data[$.jstree.root] = {
				id : $.jstree.root,
				parent : null,
				parents : [],
				children : [],
				children_d : [],
				state : { loaded : false }
			};
			this._data.core.selected = [];
			this._data.core.last_clicked = null;
			this._data.core.focused = null;

			var c = this.get_container_ul()[0].className;
			if(!skip_loading) {
				this.element.html("<"+"ul class='"+c+"' role='group'><"+"li class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='treeitem' id='j"+this._id+"_loading'><i class='jstree-icon jstree-ocl'></i><"+"a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>");
				this.element.attr('aria-activedescendant','j'+this._id+'_loading');
			}
			this.load_node($.jstree.root, function (o, s) {
				if(s) {
					this.get_container_ul()[0].className = c;
					if(this._firstChild(this.get_container_ul()[0])) {
						this.element.attr('aria-activedescendant',this._firstChild(this.get_container_ul()[0]).id);
					}
					this.set_state($.extend(true, {}, this._data.core.state), function () {
						/**
						 * triggered when a `refresh` call completes
						 * @event
						 * @name refresh.jstree
						 */
						this.trigger('refresh');
					});
				}
				this._data.core.state = null;
			});
		},
		/**
		 * refreshes a node in the tree (reload its children) all opened nodes inside that node are reloaded with calls to `load_node`.
		 * @name refresh_node(obj)
		 * @param  {mixed} obj the node
		 * @trigger refresh_node.jstree
		 */
		refresh_node : function (obj) {
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) { return false; }
			var opened = [], to_load = [], s = this._data.core.selected.concat([]);
			to_load.push(obj.id);
			if(obj.state.opened === true) { opened.push(obj.id); }
			this.get_node(obj, true).find('.jstree-open').each(function() { to_load.push(this.id); opened.push(this.id); });
			this._load_nodes(to_load, $.proxy(function (nodes) {
				this.open_node(opened, false, 0);
				this.select_node(s);
				/**
				 * triggered when a node is refreshed
				 * @event
				 * @name refresh_node.jstree
				 * @param {Object} node - the refreshed node
				 * @param {Array} nodes - an array of the IDs of the nodes that were reloaded
				 */
				this.trigger('refresh_node', { 'node' : obj, 'nodes' : nodes });
			}, this), false, true);
		},
		/**
		 * set (change) the ID of a node
		 * @name set_id(obj, id)
		 * @param  {mixed} obj the node
		 * @param  {String} id the new ID
		 * @return {Boolean}
		 * @trigger set_id.jstree
		 */
		set_id : function (obj, id) {
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) { return false; }
			var i, j, m = this._model.data, old = obj.id;
			id = id.toString();
			// update parents (replace current ID with new one in children and children_d)
			m[obj.parent].children[$.inArray(obj.id, m[obj.parent].children)] = id;
			for(i = 0, j = obj.parents.length; i < j; i++) {
				m[obj.parents[i]].children_d[$.inArray(obj.id, m[obj.parents[i]].children_d)] = id;
			}
			// update children (replace current ID with new one in parent and parents)
			for(i = 0, j = obj.children.length; i < j; i++) {
				m[obj.children[i]].parent = id;
			}
			for(i = 0, j = obj.children_d.length; i < j; i++) {
				m[obj.children_d[i]].parents[$.inArray(obj.id, m[obj.children_d[i]].parents)] = id;
			}
			i = $.inArray(obj.id, this._data.core.selected);
			if(i !== -1) { this._data.core.selected[i] = id; }
			// update model and obj itself (obj.id, this._model.data[KEY])
			i = this.get_node(obj.id, true);
			if(i) {
				i.attr('id', id); //.children('.jstree-anchor').attr('id', id + '_anchor').end().attr('aria-labelledby', id + '_anchor');
				if(this.element.attr('aria-activedescendant') === obj.id) {
					this.element.attr('aria-activedescendant', id);
				}
			}
			delete m[obj.id];
			obj.id = id;
			obj.li_attr.id = id;
			m[id] = obj;
			/**
			 * triggered when a node id value is changed
			 * @event
			 * @name set_id.jstree
			 * @param {Object} node
			 * @param {String} old the old id
			 */
			this.trigger('set_id',{ "node" : obj, "new" : obj.id, "old" : old });
			return true;
		},
		/**
		 * get the text value of a node
		 * @name get_text(obj)
		 * @param  {mixed} obj the node
		 * @return {String}
		 */
		get_text : function (obj) {
			obj = this.get_node(obj);
			return (!obj || obj.id === $.jstree.root) ? false : obj.text;
		},
		/**
		 * set the text value of a node. Used internally, please use `rename_node(obj, val)`.
		 * @private
		 * @name set_text(obj, val)
		 * @param  {mixed} obj the node, you can pass an array to set the text on multiple nodes
		 * @param  {String} val the new text value
		 * @return {Boolean}
		 * @trigger set_text.jstree
		 */
		set_text : function (obj, val) {
			var t1, t2;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.set_text(obj[t1], val);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) { return false; }
			obj.text = val;
			if(this.get_node(obj, true).length) {
				this.redraw_node(obj.id);
			}
			/**
			 * triggered when a node text value is changed
			 * @event
			 * @name set_text.jstree
			 * @param {Object} obj
			 * @param {String} text the new value
			 */
			this.trigger('set_text',{ "obj" : obj, "text" : val });
			return true;
		},
		/**
		 * gets a JSON representation of a node (or the whole tree)
		 * @name get_json([obj, options])
		 * @param  {mixed} obj
		 * @param  {Object} options
		 * @param  {Boolean} options.no_state do not return state information
		 * @param  {Boolean} options.no_id do not return ID
		 * @param  {Boolean} options.no_children do not include children
		 * @param  {Boolean} options.no_data do not include node data
		 * @param  {Boolean} options.no_li_attr do not include LI attributes
		 * @param  {Boolean} options.no_a_attr do not include A attributes
		 * @param  {Boolean} options.flat return flat JSON instead of nested
		 * @return {Object}
		 */
		get_json : function (obj, options, flat) {
			obj = this.get_node(obj || $.jstree.root);
			if(!obj) { return false; }
			if(options && options.flat && !flat) { flat = []; }
			var tmp = {
				'id' : obj.id,
				'text' : obj.text,
				'icon' : this.get_icon(obj),
				'li_attr' : $.extend(true, {}, obj.li_attr),
				'a_attr' : $.extend(true, {}, obj.a_attr),
				'state' : {},
				'data' : options && options.no_data ? false : $.extend(true, $.isArray(obj.data)?[]:{}, obj.data)
				//( this.get_node(obj, true).length ? this.get_node(obj, true).data() : obj.data ),
			}, i, j;
			if(options && options.flat) {
				tmp.parent = obj.parent;
			}
			else {
				tmp.children = [];
			}
			if(!options || !options.no_state) {
				for(i in obj.state) {
					if(obj.state.hasOwnProperty(i)) {
						tmp.state[i] = obj.state[i];
					}
				}
			} else {
				delete tmp.state;
			}
			if(options && options.no_li_attr) {
				delete tmp.li_attr;
			}
			if(options && options.no_a_attr) {
				delete tmp.a_attr;
			}
			if(options && options.no_id) {
				delete tmp.id;
				if(tmp.li_attr && tmp.li_attr.id) {
					delete tmp.li_attr.id;
				}
				if(tmp.a_attr && tmp.a_attr.id) {
					delete tmp.a_attr.id;
				}
			}
			if(options && options.flat && obj.id !== $.jstree.root) {
				flat.push(tmp);
			}
			if(!options || !options.no_children) {
				for(i = 0, j = obj.children.length; i < j; i++) {
					if(options && options.flat) {
						this.get_json(obj.children[i], options, flat);
					}
					else {
						tmp.children.push(this.get_json(obj.children[i], options));
					}
				}
			}
			return options && options.flat ? flat : (obj.id === $.jstree.root ? tmp.children : tmp);
		},
		/**
		 * create a new node (do not confuse with load_node)
		 * @name create_node([par, node, pos, callback, is_loaded])
		 * @param  {mixed}   par       the parent node (to create a root node use either "#" (string) or `null`)
		 * @param  {mixed}   node      the data for the new node (a valid JSON object, or a simple string with the name)
		 * @param  {mixed}   pos       the index at which to insert the node, "first" and "last" are also supported, default is "last"
		 * @param  {Function} callback a function to be called once the node is created
		 * @param  {Boolean} is_loaded internal argument indicating if the parent node was succesfully loaded
		 * @return {String}            the ID of the newly create node
		 * @trigger model.jstree, create_node.jstree
		 */
		create_node : function (par, node, pos, callback, is_loaded) {
			if(par === null) { par = $.jstree.root; }
			par = this.get_node(par);
			if(!par) { return false; }
			pos = pos === undefined ? "last" : pos;
			if(!pos.toString().match(/^(before|after)$/) && !is_loaded && !this.is_loaded(par)) {
				return this.load_node(par, function () { this.create_node(par, node, pos, callback, true); });
			}
			if(!node) { node = { "text" : this.get_string('New node') }; }
			if(typeof node === "string") {
				node = { "text" : node };
			} else {
				node = $.extend(true, {}, node);
			}
			if(node.text === undefined) { node.text = this.get_string('New node'); }
			var tmp, dpc, i, j;

			if(par.id === $.jstree.root) {
				if(pos === "before") { pos = "first"; }
				if(pos === "after") { pos = "last"; }
			}
			switch(pos) {
				case "before":
					tmp = this.get_node(par.parent);
					pos = $.inArray(par.id, tmp.children);
					par = tmp;
					break;
				case "after" :
					tmp = this.get_node(par.parent);
					pos = $.inArray(par.id, tmp.children) + 1;
					par = tmp;
					break;
				case "inside":
				case "first":
					pos = 0;
					break;
				case "last":
					pos = par.children.length;
					break;
				default:
					if(!pos) { pos = 0; }
					break;
			}
			if(pos > par.children.length) { pos = par.children.length; }
			if(!node.id) { node.id = true; }
			if(!this.check("create_node", node, par, pos)) {
				this.settings.core.error.call(this, this._data.core.last_error);
				return false;
			}
			if(node.id === true) { delete node.id; }
			node = this._parse_model_from_json(node, par.id, par.parents.concat());
			if(!node) { return false; }
			tmp = this.get_node(node);
			dpc = [];
			dpc.push(node);
			dpc = dpc.concat(tmp.children_d);
			this.trigger('model', { "nodes" : dpc, "parent" : par.id });

			par.children_d = par.children_d.concat(dpc);
			for(i = 0, j = par.parents.length; i < j; i++) {
				this._model.data[par.parents[i]].children_d = this._model.data[par.parents[i]].children_d.concat(dpc);
			}
			node = tmp;
			tmp = [];
			for(i = 0, j = par.children.length; i < j; i++) {
				tmp[i >= pos ? i+1 : i] = par.children[i];
			}
			tmp[pos] = node.id;
			par.children = tmp;

			this.redraw_node(par, true);
			/**
			 * triggered when a node is created
			 * @event
			 * @name create_node.jstree
			 * @param {Object} node
			 * @param {String} parent the parent's ID
			 * @param {Number} position the position of the new node among the parent's children
			 */
			this.trigger('create_node', { "node" : this.get_node(node), "parent" : par.id, "position" : pos });
			if(callback) { callback.call(this, this.get_node(node)); }
			return node.id;
		},
		/**
		 * set the text value of a node
		 * @name rename_node(obj, val)
		 * @param  {mixed} obj the node, you can pass an array to rename multiple nodes to the same name
		 * @param  {String} val the new text value
		 * @return {Boolean}
		 * @trigger rename_node.jstree
		 */
		rename_node : function (obj, val) {
			var t1, t2, old;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.rename_node(obj[t1], val);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) { return false; }
			old = obj.text;
			if(!this.check("rename_node", obj, this.get_parent(obj), val)) {
				this.settings.core.error.call(this, this._data.core.last_error);
				return false;
			}
			this.set_text(obj, val); // .apply(this, Array.prototype.slice.call(arguments))
			/**
			 * triggered when a node is renamed
			 * @event
			 * @name rename_node.jstree
			 * @param {Object} node
			 * @param {String} text the new value
			 * @param {String} old the old value
			 */
			this.trigger('rename_node', { "node" : obj, "text" : val, "old" : old });
			return true;
		},
		/**
		 * remove a node
		 * @name delete_node(obj)
		 * @param  {mixed} obj the node, you can pass an array to delete multiple nodes
		 * @return {Boolean}
		 * @trigger delete_node.jstree, changed.jstree
		 */
		delete_node : function (obj) {
			var t1, t2, par, pos, tmp, i, j, k, l, c, top, lft;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.delete_node(obj[t1]);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) { return false; }
			par = this.get_node(obj.parent);
			pos = $.inArray(obj.id, par.children);
			c = false;
			if(!this.check("delete_node", obj, par, pos)) {
				this.settings.core.error.call(this, this._data.core.last_error);
				return false;
			}
			if(pos !== -1) {
				par.children = $.vakata.array_remove(par.children, pos);
			}
			tmp = obj.children_d.concat([]);
			tmp.push(obj.id);
			for(i = 0, j = obj.parents.length; i < j; i++) {
				this._model.data[obj.parents[i]].children_d = $.vakata.array_filter(this._model.data[obj.parents[i]].children_d, function (v) {
					return $.inArray(v, tmp) === -1;
				});
			}
			for(k = 0, l = tmp.length; k < l; k++) {
				if(this._model.data[tmp[k]].state.selected) {
					c = true;
					break;
				}
			}
			if (c) {
				this._data.core.selected = $.vakata.array_filter(this._data.core.selected, function (v) {
					return $.inArray(v, tmp) === -1;
				});
			}
			/**
			 * triggered when a node is deleted
			 * @event
			 * @name delete_node.jstree
			 * @param {Object} node
			 * @param {String} parent the parent's ID
			 */
			this.trigger('delete_node', { "node" : obj, "parent" : par.id });
			if(c) {
				this.trigger('changed', { 'action' : 'delete_node', 'node' : obj, 'selected' : this._data.core.selected, 'parent' : par.id });
			}
			for(k = 0, l = tmp.length; k < l; k++) {
				delete this._model.data[tmp[k]];
			}
			if($.inArray(this._data.core.focused, tmp) !== -1) {
				this._data.core.focused = null;
				top = this.element[0].scrollTop;
				lft = this.element[0].scrollLeft;
				if(par.id === $.jstree.root) {
					if (this._model.data[$.jstree.root].children[0]) {
						this.get_node(this._model.data[$.jstree.root].children[0], true).children('.jstree-anchor').focus();
					}
				}
				else {
					this.get_node(par, true).children('.jstree-anchor').focus();
				}
				this.element[0].scrollTop  = top;
				this.element[0].scrollLeft = lft;
			}
			this.redraw_node(par, true);
			return true;
		},
		/**
		 * check if an operation is premitted on the tree. Used internally.
		 * @private
		 * @name check(chk, obj, par, pos)
		 * @param  {String} chk the operation to check, can be "create_node", "rename_node", "delete_node", "copy_node" or "move_node"
		 * @param  {mixed} obj the node
		 * @param  {mixed} par the parent
		 * @param  {mixed} pos the position to insert at, or if "rename_node" - the new name
		 * @param  {mixed} more some various additional information, for example if a "move_node" operations is triggered by DND this will be the hovered node
		 * @return {Boolean}
		 */
		check : function (chk, obj, par, pos, more) {
			obj = obj && obj.id ? obj : this.get_node(obj);
			par = par && par.id ? par : this.get_node(par);
			var tmp = chk.match(/^move_node|copy_node|create_node$/i) ? par : obj,
				chc = this.settings.core.check_callback;
			if(chk === "move_node" || chk === "copy_node") {
				if((!more || !more.is_multi) && (chk === "move_node" && $.inArray(obj.id, par.children) === pos)) {
					this._data.core.last_error = { 'error' : 'check', 'plugin' : 'core', 'id' : 'core_08', 'reason' : 'Moving node to its current position', 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
					return false;
				}
				if((!more || !more.is_multi) && (obj.id === par.id || (chk === "move_node" && $.inArray(obj.id, par.children) === pos) || $.inArray(par.id, obj.children_d) !== -1)) {
					this._data.core.last_error = { 'error' : 'check', 'plugin' : 'core', 'id' : 'core_01', 'reason' : 'Moving parent inside child', 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
					return false;
				}
			}
			if(tmp && tmp.data) { tmp = tmp.data; }
			if(tmp && tmp.functions && (tmp.functions[chk] === false || tmp.functions[chk] === true)) {
				if(tmp.functions[chk] === false) {
					this._data.core.last_error = { 'error' : 'check', 'plugin' : 'core', 'id' : 'core_02', 'reason' : 'Node data prevents function: ' + chk, 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
				}
				return tmp.functions[chk];
			}
			if(chc === false || ($.isFunction(chc) && chc.call(this, chk, obj, par, pos, more) === false) || (chc && chc[chk] === false)) {
				this._data.core.last_error = { 'error' : 'check', 'plugin' : 'core', 'id' : 'core_03', 'reason' : 'User config for core.check_callback prevents function: ' + chk, 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
				return false;
			}
			return true;
		},
		/**
		 * get the last error
		 * @name last_error()
		 * @return {Object}
		 */
		last_error : function () {
			return this._data.core.last_error;
		},
		/**
		 * move a node to a new parent
		 * @name move_node(obj, par [, pos, callback, is_loaded])
		 * @param  {mixed} obj the node to move, pass an array to move multiple nodes
		 * @param  {mixed} par the new parent
		 * @param  {mixed} pos the position to insert at (besides integer values, "first" and "last" are supported, as well as "before" and "after"), defaults to integer `0`
		 * @param  {function} callback a function to call once the move is completed, receives 3 arguments - the node, the new parent and the position
		 * @param  {Boolean} is_loaded internal parameter indicating if the parent node has been loaded
		 * @param  {Boolean} skip_redraw internal parameter indicating if the tree should be redrawn
		 * @param  {Boolean} instance internal parameter indicating if the node comes from another instance
		 * @trigger move_node.jstree
		 */
		move_node : function (obj, par, pos, callback, is_loaded, skip_redraw, origin) {
			var t1, t2, old_par, old_pos, new_par, old_ins, is_multi, dpc, tmp, i, j, k, l, p;

			par = this.get_node(par);
			pos = pos === undefined ? 0 : pos;
			if(!par) { return false; }
			if(!pos.toString().match(/^(before|after)$/) && !is_loaded && !this.is_loaded(par)) {
				return this.load_node(par, function () { this.move_node(obj, par, pos, callback, true, false, origin); });
			}

			if($.isArray(obj)) {
				if(obj.length === 1) {
					obj = obj[0];
				}
				else {
					//obj = obj.slice();
					for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
						if((tmp = this.move_node(obj[t1], par, pos, callback, is_loaded, false, origin))) {
							par = tmp;
							pos = "after";
						}
					}
					this.redraw();
					return true;
				}
			}
			obj = obj && obj.id ? obj : this.get_node(obj);

			if(!obj || obj.id === $.jstree.root) { return false; }

			old_par = (obj.parent || $.jstree.root).toString();
			new_par = (!pos.toString().match(/^(before|after)$/) || par.id === $.jstree.root) ? par : this.get_node(par.parent);
			old_ins = origin ? origin : (this._model.data[obj.id] ? this : $.jstree.reference(obj.id));
			is_multi = !old_ins || !old_ins._id || (this._id !== old_ins._id);
			old_pos = old_ins && old_ins._id && old_par && old_ins._model.data[old_par] && old_ins._model.data[old_par].children ? $.inArray(obj.id, old_ins._model.data[old_par].children) : -1;
			if(old_ins && old_ins._id) {
				obj = old_ins._model.data[obj.id];
			}

			if(is_multi) {
				if((tmp = this.copy_node(obj, par, pos, callback, is_loaded, false, origin))) {
					if(old_ins) { old_ins.delete_node(obj); }
					return tmp;
				}
				return false;
			}
			//var m = this._model.data;
			if(par.id === $.jstree.root) {
				if(pos === "before") { pos = "first"; }
				if(pos === "after") { pos = "last"; }
			}
			switch(pos) {
				case "before":
					pos = $.inArray(par.id, new_par.children);
					break;
				case "after" :
					pos = $.inArray(par.id, new_par.children) + 1;
					break;
				case "inside":
				case "first":
					pos = 0;
					break;
				case "last":
					pos = new_par.children.length;
					break;
				default:
					if(!pos) { pos = 0; }
					break;
			}
			if(pos > new_par.children.length) { pos = new_par.children.length; }
			if(!this.check("move_node", obj, new_par, pos, { 'core' : true, 'origin' : origin, 'is_multi' : (old_ins && old_ins._id && old_ins._id !== this._id), 'is_foreign' : (!old_ins || !old_ins._id) })) {
				this.settings.core.error.call(this, this._data.core.last_error);
				return false;
			}
			if(obj.parent === new_par.id) {
				dpc = new_par.children.concat();
				tmp = $.inArray(obj.id, dpc);
				if(tmp !== -1) {
					dpc = $.vakata.array_remove(dpc, tmp);
					if(pos > tmp) { pos--; }
				}
				tmp = [];
				for(i = 0, j = dpc.length; i < j; i++) {
					tmp[i >= pos ? i+1 : i] = dpc[i];
				}
				tmp[pos] = obj.id;
				new_par.children = tmp;
				this._node_changed(new_par.id);
				this.redraw(new_par.id === $.jstree.root);
			}
			else {
				// clean old parent and up
				tmp = obj.children_d.concat();
				tmp.push(obj.id);
				for(i = 0, j = obj.parents.length; i < j; i++) {
					dpc = [];
					p = old_ins._model.data[obj.parents[i]].children_d;
					for(k = 0, l = p.length; k < l; k++) {
						if($.inArray(p[k], tmp) === -1) {
							dpc.push(p[k]);
						}
					}
					old_ins._model.data[obj.parents[i]].children_d = dpc;
				}
				old_ins._model.data[old_par].children = $.vakata.array_remove_item(old_ins._model.data[old_par].children, obj.id);

				// insert into new parent and up
				for(i = 0, j = new_par.parents.length; i < j; i++) {
					this._model.data[new_par.parents[i]].children_d = this._model.data[new_par.parents[i]].children_d.concat(tmp);
				}
				dpc = [];
				for(i = 0, j = new_par.children.length; i < j; i++) {
					dpc[i >= pos ? i+1 : i] = new_par.children[i];
				}
				dpc[pos] = obj.id;
				new_par.children = dpc;
				new_par.children_d.push(obj.id);
				new_par.children_d = new_par.children_d.concat(obj.children_d);

				// update object
				obj.parent = new_par.id;
				tmp = new_par.parents.concat();
				tmp.unshift(new_par.id);
				p = obj.parents.length;
				obj.parents = tmp;

				// update object children
				tmp = tmp.concat();
				for(i = 0, j = obj.children_d.length; i < j; i++) {
					this._model.data[obj.children_d[i]].parents = this._model.data[obj.children_d[i]].parents.slice(0,p*-1);
					Array.prototype.push.apply(this._model.data[obj.children_d[i]].parents, tmp);
				}

				if(old_par === $.jstree.root || new_par.id === $.jstree.root) {
					this._model.force_full_redraw = true;
				}
				if(!this._model.force_full_redraw) {
					this._node_changed(old_par);
					this._node_changed(new_par.id);
				}
				if(!skip_redraw) {
					this.redraw();
				}
			}
			if(callback) { callback.call(this, obj, new_par, pos); }
			/**
			 * triggered when a node is moved
			 * @event
			 * @name move_node.jstree
			 * @param {Object} node
			 * @param {String} parent the parent's ID
			 * @param {Number} position the position of the node among the parent's children
			 * @param {String} old_parent the old parent of the node
			 * @param {Number} old_position the old position of the node
			 * @param {Boolean} is_multi do the node and new parent belong to different instances
			 * @param {jsTree} old_instance the instance the node came from
			 * @param {jsTree} new_instance the instance of the new parent
			 */
			this.trigger('move_node', { "node" : obj, "parent" : new_par.id, "position" : pos, "old_parent" : old_par, "old_position" : old_pos, 'is_multi' : (old_ins && old_ins._id && old_ins._id !== this._id), 'is_foreign' : (!old_ins || !old_ins._id), 'old_instance' : old_ins, 'new_instance' : this });
			return obj.id;
		},
		/**
		 * copy a node to a new parent
		 * @name copy_node(obj, par [, pos, callback, is_loaded])
		 * @param  {mixed} obj the node to copy, pass an array to copy multiple nodes
		 * @param  {mixed} par the new parent
		 * @param  {mixed} pos the position to insert at (besides integer values, "first" and "last" are supported, as well as "before" and "after"), defaults to integer `0`
		 * @param  {function} callback a function to call once the move is completed, receives 3 arguments - the node, the new parent and the position
		 * @param  {Boolean} is_loaded internal parameter indicating if the parent node has been loaded
		 * @param  {Boolean} skip_redraw internal parameter indicating if the tree should be redrawn
		 * @param  {Boolean} instance internal parameter indicating if the node comes from another instance
		 * @trigger model.jstree copy_node.jstree
		 */
		copy_node : function (obj, par, pos, callback, is_loaded, skip_redraw, origin) {
			var t1, t2, dpc, tmp, i, j, node, old_par, new_par, old_ins, is_multi;

			par = this.get_node(par);
			pos = pos === undefined ? 0 : pos;
			if(!par) { return false; }
			if(!pos.toString().match(/^(before|after)$/) && !is_loaded && !this.is_loaded(par)) {
				return this.load_node(par, function () { this.copy_node(obj, par, pos, callback, true, false, origin); });
			}

			if($.isArray(obj)) {
				if(obj.length === 1) {
					obj = obj[0];
				}
				else {
					//obj = obj.slice();
					for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
						if((tmp = this.copy_node(obj[t1], par, pos, callback, is_loaded, true, origin))) {
							par = tmp;
							pos = "after";
						}
					}
					this.redraw();
					return true;
				}
			}
			obj = obj && obj.id ? obj : this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) { return false; }

			old_par = (obj.parent || $.jstree.root).toString();
			new_par = (!pos.toString().match(/^(before|after)$/) || par.id === $.jstree.root) ? par : this.get_node(par.parent);
			old_ins = origin ? origin : (this._model.data[obj.id] ? this : $.jstree.reference(obj.id));
			is_multi = !old_ins || !old_ins._id || (this._id !== old_ins._id);

			if(old_ins && old_ins._id) {
				obj = old_ins._model.data[obj.id];
			}

			if(par.id === $.jstree.root) {
				if(pos === "before") { pos = "first"; }
				if(pos === "after") { pos = "last"; }
			}
			switch(pos) {
				case "before":
					pos = $.inArray(par.id, new_par.children);
					break;
				case "after" :
					pos = $.inArray(par.id, new_par.children) + 1;
					break;
				case "inside":
				case "first":
					pos = 0;
					break;
				case "last":
					pos = new_par.children.length;
					break;
				default:
					if(!pos) { pos = 0; }
					break;
			}
			if(pos > new_par.children.length) { pos = new_par.children.length; }
			if(!this.check("copy_node", obj, new_par, pos, { 'core' : true, 'origin' : origin, 'is_multi' : (old_ins && old_ins._id && old_ins._id !== this._id), 'is_foreign' : (!old_ins || !old_ins._id) })) {
				this.settings.core.error.call(this, this._data.core.last_error);
				return false;
			}
			node = old_ins ? old_ins.get_json(obj, { no_id : true, no_data : true, no_state : true }) : obj;
			if(!node) { return false; }
			if(node.id === true) { delete node.id; }
			node = this._parse_model_from_json(node, new_par.id, new_par.parents.concat());
			if(!node) { return false; }
			tmp = this.get_node(node);
			if(obj && obj.state && obj.state.loaded === false) { tmp.state.loaded = false; }
			dpc = [];
			dpc.push(node);
			dpc = dpc.concat(tmp.children_d);
			this.trigger('model', { "nodes" : dpc, "parent" : new_par.id });

			// insert into new parent and up
			for(i = 0, j = new_par.parents.length; i < j; i++) {
				this._model.data[new_par.parents[i]].children_d = this._model.data[new_par.parents[i]].children_d.concat(dpc);
			}
			dpc = [];
			for(i = 0, j = new_par.children.length; i < j; i++) {
				dpc[i >= pos ? i+1 : i] = new_par.children[i];
			}
			dpc[pos] = tmp.id;
			new_par.children = dpc;
			new_par.children_d.push(tmp.id);
			new_par.children_d = new_par.children_d.concat(tmp.children_d);

			if(new_par.id === $.jstree.root) {
				this._model.force_full_redraw = true;
			}
			if(!this._model.force_full_redraw) {
				this._node_changed(new_par.id);
			}
			if(!skip_redraw) {
				this.redraw(new_par.id === $.jstree.root);
			}
			if(callback) { callback.call(this, tmp, new_par, pos); }
			/**
			 * triggered when a node is copied
			 * @event
			 * @name copy_node.jstree
			 * @param {Object} node the copied node
			 * @param {Object} original the original node
			 * @param {String} parent the parent's ID
			 * @param {Number} position the position of the node among the parent's children
			 * @param {String} old_parent the old parent of the node
			 * @param {Number} old_position the position of the original node
			 * @param {Boolean} is_multi do the node and new parent belong to different instances
			 * @param {jsTree} old_instance the instance the node came from
			 * @param {jsTree} new_instance the instance of the new parent
			 */
			this.trigger('copy_node', { "node" : tmp, "original" : obj, "parent" : new_par.id, "position" : pos, "old_parent" : old_par, "old_position" : old_ins && old_ins._id && old_par && old_ins._model.data[old_par] && old_ins._model.data[old_par].children ? $.inArray(obj.id, old_ins._model.data[old_par].children) : -1,'is_multi' : (old_ins && old_ins._id && old_ins._id !== this._id), 'is_foreign' : (!old_ins || !old_ins._id), 'old_instance' : old_ins, 'new_instance' : this });
			return tmp.id;
		},
		/**
		 * cut a node (a later call to `paste(obj)` would move the node)
		 * @name cut(obj)
		 * @param  {mixed} obj multiple objects can be passed using an array
		 * @trigger cut.jstree
		 */
		cut : function (obj) {
			if(!obj) { obj = this._data.core.selected.concat(); }
			if(!$.isArray(obj)) { obj = [obj]; }
			if(!obj.length) { return false; }
			var tmp = [], o, t1, t2;
			for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
				o = this.get_node(obj[t1]);
				if(o && o.id && o.id !== $.jstree.root) { tmp.push(o); }
			}
			if(!tmp.length) { return false; }
			ccp_node = tmp;
			ccp_inst = this;
			ccp_mode = 'move_node';
			/**
			 * triggered when nodes are added to the buffer for moving
			 * @event
			 * @name cut.jstree
			 * @param {Array} node
			 */
			this.trigger('cut', { "node" : obj });
		},
		/**
		 * copy a node (a later call to `paste(obj)` would copy the node)
		 * @name copy(obj)
		 * @param  {mixed} obj multiple objects can be passed using an array
		 * @trigger copy.jstree
		 */
		copy : function (obj) {
			if(!obj) { obj = this._data.core.selected.concat(); }
			if(!$.isArray(obj)) { obj = [obj]; }
			if(!obj.length) { return false; }
			var tmp = [], o, t1, t2;
			for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
				o = this.get_node(obj[t1]);
				if(o && o.id && o.id !== $.jstree.root) { tmp.push(o); }
			}
			if(!tmp.length) { return false; }
			ccp_node = tmp;
			ccp_inst = this;
			ccp_mode = 'copy_node';
			/**
			 * triggered when nodes are added to the buffer for copying
			 * @event
			 * @name copy.jstree
			 * @param {Array} node
			 */
			this.trigger('copy', { "node" : obj });
		},
		/**
		 * get the current buffer (any nodes that are waiting for a paste operation)
		 * @name get_buffer()
		 * @return {Object} an object consisting of `mode` ("copy_node" or "move_node"), `node` (an array of objects) and `inst` (the instance)
		 */
		get_buffer : function () {
			return { 'mode' : ccp_mode, 'node' : ccp_node, 'inst' : ccp_inst };
		},
		/**
		 * check if there is something in the buffer to paste
		 * @name can_paste()
		 * @return {Boolean}
		 */
		can_paste : function () {
			return ccp_mode !== false && ccp_node !== false; // && ccp_inst._model.data[ccp_node];
		},
		/**
		 * copy or move the previously cut or copied nodes to a new parent
		 * @name paste(obj [, pos])
		 * @param  {mixed} obj the new parent
		 * @param  {mixed} pos the position to insert at (besides integer, "first" and "last" are supported), defaults to integer `0`
		 * @trigger paste.jstree
		 */
		paste : function (obj, pos) {
			obj = this.get_node(obj);
			if(!obj || !ccp_mode || !ccp_mode.match(/^(copy_node|move_node)$/) || !ccp_node) { return false; }
			if(this[ccp_mode](ccp_node, obj, pos, false, false, false, ccp_inst)) {
				/**
				 * triggered when paste is invoked
				 * @event
				 * @name paste.jstree
				 * @param {String} parent the ID of the receiving node
				 * @param {Array} node the nodes in the buffer
				 * @param {String} mode the performed operation - "copy_node" or "move_node"
				 */
				this.trigger('paste', { "parent" : obj.id, "node" : ccp_node, "mode" : ccp_mode });
			}
			ccp_node = false;
			ccp_mode = false;
			ccp_inst = false;
		},
		/**
		 * clear the buffer of previously copied or cut nodes
		 * @name clear_buffer()
		 * @trigger clear_buffer.jstree
		 */
		clear_buffer : function () {
			ccp_node = false;
			ccp_mode = false;
			ccp_inst = false;
			/**
			 * triggered when the copy / cut buffer is cleared
			 * @event
			 * @name clear_buffer.jstree
			 */
			this.trigger('clear_buffer');
		},
		/**
		 * put a node in edit mode (input field to rename the node)
		 * @name edit(obj [, default_text, callback])
		 * @param  {mixed} obj
		 * @param  {String} default_text the text to populate the input with (if omitted or set to a non-string value the node's text value is used)
		 * @param  {Function} callback a function to be called once the text box is blurred, it is called in the instance's scope and receives the node, a status parameter (true if the rename is successful, false otherwise) and a boolean indicating if the user cancelled the edit. You can access the node's title using .text
		 */
		edit : function (obj, default_text, callback) {
			var rtl, w, a, s, t, h1, h2, fn, tmp, cancel = false;
			obj = this.get_node(obj);
			if(!obj) { return false; }
			if(!this.check("edit", obj, this.get_parent(obj))) {
				this.settings.core.error.call(this, this._data.core.last_error);
				return false;
			}
			tmp = obj;
			default_text = typeof default_text === 'string' ? default_text : obj.text;
			this.set_text(obj, "");
			obj = this._open_to(obj);
			tmp.text = default_text;

			rtl = this._data.core.rtl;
			w  = this.element.width();
			this._data.core.focused = tmp.id;
			a  = obj.children('.jstree-anchor').focus();
			s  = $('<span>');
			/*!
			oi = obj.children("i:visible"),
			ai = a.children("i:visible"),
			w1 = oi.width() * oi.length,
			w2 = ai.width() * ai.length,
			*/
			t  = default_text;
			h1 = $("<"+"div />", { css : { "position" : "absolute", "top" : "-200px", "left" : (rtl ? "0px" : "-1000px"), "visibility" : "hidden" } }).appendTo(document.body);
			h2 = $("<"+"input />", {
						"value" : t,
						"class" : "jstree-rename-input",
						// "size" : t.length,
						"css" : {
							"padding" : "0",
							"border" : "1px solid silver",
							"box-sizing" : "border-box",
							"display" : "inline-block",
							"height" : (this._data.core.li_height) + "px",
							"lineHeight" : (this._data.core.li_height) + "px",
							"width" : "150px" // will be set a bit further down
						},
						"blur" : $.proxy(function (e) {
							e.stopImmediatePropagation();
							e.preventDefault();
							var i = s.children(".jstree-rename-input"),
								v = i.val(),
								f = this.settings.core.force_text,
								nv;
							if(v === "") { v = t; }
							h1.remove();
							s.replaceWith(a);
							s.remove();
							t = f ? t : $('<div></div>').append($.parseHTML(t)).html();
							obj = this.get_node(obj);
							this.set_text(obj, t);
							nv = !!this.rename_node(obj, f ? $('<div></div>').text(v).text() : $('<div></div>').append($.parseHTML(v)).html());
							if(!nv) {
								this.set_text(obj, t); // move this up? and fix #483
							}
							this._data.core.focused = tmp.id;
							setTimeout($.proxy(function () {
								var node = this.get_node(tmp.id, true);
								if(node.length) {
									this._data.core.focused = tmp.id;
									node.children('.jstree-anchor').focus();
								}
							}, this), 0);
							if(callback) {
								callback.call(this, tmp, nv, cancel);
							}
							h2 = null;
						}, this),
						"keydown" : function (e) {
							var key = e.which;
							if(key === 27) {
								cancel = true;
								this.value = t;
							}
							if(key === 27 || key === 13 || key === 37 || key === 38 || key === 39 || key === 40 || key === 32) {
								e.stopImmediatePropagation();
							}
							if(key === 27 || key === 13) {
								e.preventDefault();
								this.blur();
							}
						},
						"click" : function (e) { e.stopImmediatePropagation(); },
						"mousedown" : function (e) { e.stopImmediatePropagation(); },
						"keyup" : function (e) {
							h2.width(Math.min(h1.text("pW" + this.value).width(),w));
						},
						"keypress" : function(e) {
							if(e.which === 13) { return false; }
						}
					});
				fn = {
						fontFamily		: a.css('fontFamily')		|| '',
						fontSize		: a.css('fontSize')			|| '',
						fontWeight		: a.css('fontWeight')		|| '',
						fontStyle		: a.css('fontStyle')		|| '',
						fontStretch		: a.css('fontStretch')		|| '',
						fontVariant		: a.css('fontVariant')		|| '',
						letterSpacing	: a.css('letterSpacing')	|| '',
						wordSpacing		: a.css('wordSpacing')		|| ''
				};
			s.attr('class', a.attr('class')).append(a.contents().clone()).append(h2);
			a.replaceWith(s);
			h1.css(fn);
			h2.css(fn).width(Math.min(h1.text("pW" + h2[0].value).width(),w))[0].select();
			$(document).one('mousedown.jstree touchstart.jstree dnd_start.vakata', function (e) {
				if (h2 && e.target !== h2) {
					$(h2).blur();
				}
			});
		},


		/**
		 * changes the theme
		 * @name set_theme(theme_name [, theme_url])
		 * @param {String} theme_name the name of the new theme to apply
		 * @param {mixed} theme_url  the location of the CSS file for this theme. Omit or set to `false` if you manually included the file. Set to `true` to autoload from the `core.themes.dir` directory.
		 * @trigger set_theme.jstree
		 */
		set_theme : function (theme_name, theme_url) {
			if(!theme_name) { return false; }
			if(theme_url === true) {
				var dir = this.settings.core.themes.dir;
				if(!dir) { dir = $.jstree.path + '/themes'; }
				theme_url = dir + '/' + theme_name + '/style.css';
			}
			if(theme_url && $.inArray(theme_url, themes_loaded) === -1) {
				$('head').append('<'+'link rel="stylesheet" href="' + theme_url + '" type="text/css" />');
				themes_loaded.push(theme_url);
			}
			if(this._data.core.themes.name) {
				this.element.removeClass('jstree-' + this._data.core.themes.name);
			}
			this._data.core.themes.name = theme_name;
			this.element.addClass('jstree-' + theme_name);
			this.element[this.settings.core.themes.responsive ? 'addClass' : 'removeClass' ]('jstree-' + theme_name + '-responsive');
			/**
			 * triggered when a theme is set
			 * @event
			 * @name set_theme.jstree
			 * @param {String} theme the new theme
			 */
			this.trigger('set_theme', { 'theme' : theme_name });
		},
		/**
		 * gets the name of the currently applied theme name
		 * @name get_theme()
		 * @return {String}
		 */
		get_theme : function () { return this._data.core.themes.name; },
		/**
		 * changes the theme variant (if the theme has variants)
		 * @name set_theme_variant(variant_name)
		 * @param {String|Boolean} variant_name the variant to apply (if `false` is used the current variant is removed)
		 */
		set_theme_variant : function (variant_name) {
			if(this._data.core.themes.variant) {
				this.element.removeClass('jstree-' + this._data.core.themes.name + '-' + this._data.core.themes.variant);
			}
			this._data.core.themes.variant = variant_name;
			if(variant_name) {
				this.element.addClass('jstree-' + this._data.core.themes.name + '-' + this._data.core.themes.variant);
			}
		},
		/**
		 * gets the name of the currently applied theme variant
		 * @name get_theme()
		 * @return {String}
		 */
		get_theme_variant : function () { return this._data.core.themes.variant; },
		/**
		 * shows a striped background on the container (if the theme supports it)
		 * @name show_stripes()
		 */
		show_stripes : function () {
			this._data.core.themes.stripes = true;
			this.get_container_ul().addClass("jstree-striped");
			/**
			 * triggered when stripes are shown
			 * @event
			 * @name show_stripes.jstree
			 */
			this.trigger('show_stripes');
		},
		/**
		 * hides the striped background on the container
		 * @name hide_stripes()
		 */
		hide_stripes : function () {
			this._data.core.themes.stripes = false;
			this.get_container_ul().removeClass("jstree-striped");
			/**
			 * triggered when stripes are hidden
			 * @event
			 * @name hide_stripes.jstree
			 */
			this.trigger('hide_stripes');
		},
		/**
		 * toggles the striped background on the container
		 * @name toggle_stripes()
		 */
		toggle_stripes : function () { if(this._data.core.themes.stripes) { this.hide_stripes(); } else { this.show_stripes(); } },
		/**
		 * shows the connecting dots (if the theme supports it)
		 * @name show_dots()
		 */
		show_dots : function () {
			this._data.core.themes.dots = true;
			this.get_container_ul().removeClass("jstree-no-dots");
			/**
			 * triggered when dots are shown
			 * @event
			 * @name show_dots.jstree
			 */
			this.trigger('show_dots');
		},
		/**
		 * hides the connecting dots
		 * @name hide_dots()
		 */
		hide_dots : function () {
			this._data.core.themes.dots = false;
			this.get_container_ul().addClass("jstree-no-dots");
			/**
			 * triggered when dots are hidden
			 * @event
			 * @name hide_dots.jstree
			 */
			this.trigger('hide_dots');
		},
		/**
		 * toggles the connecting dots
		 * @name toggle_dots()
		 */
		toggle_dots : function () { if(this._data.core.themes.dots) { this.hide_dots(); } else { this.show_dots(); } },
		/**
		 * show the node icons
		 * @name show_icons()
		 */
		show_icons : function () {
			this._data.core.themes.icons = true;
			this.get_container_ul().removeClass("jstree-no-icons");
			/**
			 * triggered when icons are shown
			 * @event
			 * @name show_icons.jstree
			 */
			this.trigger('show_icons');
		},
		/**
		 * hide the node icons
		 * @name hide_icons()
		 */
		hide_icons : function () {
			this._data.core.themes.icons = false;
			this.get_container_ul().addClass("jstree-no-icons");
			/**
			 * triggered when icons are hidden
			 * @event
			 * @name hide_icons.jstree
			 */
			this.trigger('hide_icons');
		},
		/**
		 * toggle the node icons
		 * @name toggle_icons()
		 */
		toggle_icons : function () { if(this._data.core.themes.icons) { this.hide_icons(); } else { this.show_icons(); } },
		/**
		 * show the node ellipsis
		 * @name show_icons()
		 */
		show_ellipsis : function () {
			this._data.core.themes.ellipsis = true;
			this.get_container_ul().addClass("jstree-ellipsis");
			/**
			 * triggered when ellisis is shown
			 * @event
			 * @name show_ellipsis.jstree
			 */
			this.trigger('show_ellipsis');
		},
		/**
		 * hide the node ellipsis
		 * @name hide_ellipsis()
		 */
		hide_ellipsis : function () {
			this._data.core.themes.ellipsis = false;
			this.get_container_ul().removeClass("jstree-ellipsis");
			/**
			 * triggered when ellisis is hidden
			 * @event
			 * @name hide_ellipsis.jstree
			 */
			this.trigger('hide_ellipsis');
		},
		/**
		 * toggle the node ellipsis
		 * @name toggle_icons()
		 */
		toggle_ellipsis : function () { if(this._data.core.themes.ellipsis) { this.hide_ellipsis(); } else { this.show_ellipsis(); } },
		/**
		 * set the node icon for a node
		 * @name set_icon(obj, icon)
		 * @param {mixed} obj
		 * @param {String} icon the new icon - can be a path to an icon or a className, if using an image that is in the current directory use a `./` prefix, otherwise it will be detected as a class
		 */
		set_icon : function (obj, icon) {
			var t1, t2, dom, old;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.set_icon(obj[t1], icon);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) { return false; }
			old = obj.icon;
			obj.icon = icon === true || icon === null || icon === undefined || icon === '' ? true : icon;
			dom = this.get_node(obj, true).children(".jstree-anchor").children(".jstree-themeicon");
			if(icon === false) {
				dom.removeClass('jstree-themeicon-custom ' + old).css("background","").removeAttr("rel");
				this.hide_icon(obj);
			}
			else if(icon === true || icon === null || icon === undefined || icon === '') {
				dom.removeClass('jstree-themeicon-custom ' + old).css("background","").removeAttr("rel");
				if(old === false) { this.show_icon(obj); }
			}
			else if(icon.indexOf("/") === -1 && icon.indexOf(".") === -1) {
				dom.removeClass(old).css("background","");
				dom.addClass(icon + ' jstree-themeicon-custom').attr("rel",icon);
				if(old === false) { this.show_icon(obj); }
			}
			else {
				dom.removeClass(old).css("background","");
				dom.addClass('jstree-themeicon-custom').css("background", "url('" + icon + "') center center no-repeat").attr("rel",icon);
				if(old === false) { this.show_icon(obj); }
			}
			return true;
		},
		/**
		 * get the node icon for a node
		 * @name get_icon(obj)
		 * @param {mixed} obj
		 * @return {String}
		 */
		get_icon : function (obj) {
			obj = this.get_node(obj);
			return (!obj || obj.id === $.jstree.root) ? false : obj.icon;
		},
		/**
		 * hide the icon on an individual node
		 * @name hide_icon(obj)
		 * @param {mixed} obj
		 */
		hide_icon : function (obj) {
			var t1, t2;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.hide_icon(obj[t1]);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj === $.jstree.root) { return false; }
			obj.icon = false;
			this.get_node(obj, true).children(".jstree-anchor").children(".jstree-themeicon").addClass('jstree-themeicon-hidden');
			return true;
		},
		/**
		 * show the icon on an individual node
		 * @name show_icon(obj)
		 * @param {mixed} obj
		 */
		show_icon : function (obj) {
			var t1, t2, dom;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.show_icon(obj[t1]);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj === $.jstree.root) { return false; }
			dom = this.get_node(obj, true);
			obj.icon = dom.length ? dom.children(".jstree-anchor").children(".jstree-themeicon").attr('rel') : true;
			if(!obj.icon) { obj.icon = true; }
			dom.children(".jstree-anchor").children(".jstree-themeicon").removeClass('jstree-themeicon-hidden');
			return true;
		}
	};

	// helpers
	$.vakata = {};
	// collect attributes
	$.vakata.attributes = function(node, with_values) {
		node = $(node)[0];
		var attr = with_values ? {} : [];
		if(node && node.attributes) {
			$.each(node.attributes, function (i, v) {
				if($.inArray(v.name.toLowerCase(),['style','contenteditable','hasfocus','tabindex']) !== -1) { return; }
				if(v.value !== null && $.trim(v.value) !== '') {
					if(with_values) { attr[v.name] = v.value; }
					else { attr.push(v.name); }
				}
			});
		}
		return attr;
	};
	$.vakata.array_unique = function(array) {
		var a = [], i, j, l, o = {};
		for(i = 0, l = array.length; i < l; i++) {
			if(o[array[i]] === undefined) {
				a.push(array[i]);
				o[array[i]] = true;
			}
		}
		return a;
	};
	// remove item from array
	$.vakata.array_remove = function(array, from) {
		array.splice(from, 1);
		return array;
		//var rest = array.slice((to || from) + 1 || array.length);
		//array.length = from < 0 ? array.length + from : from;
		//array.push.apply(array, rest);
		//return array;
	};
	// remove item from array
	$.vakata.array_remove_item = function(array, item) {
		var tmp = $.inArray(item, array);
		return tmp !== -1 ? $.vakata.array_remove(array, tmp) : array;
	};
	$.vakata.array_filter = function(c,a,b,d,e) {
		if (c.filter) {
			return c.filter(a, b);
		}
		d=[];
		for (e in c) {
			if (~~e+''===e+'' && e>=0 && a.call(b,c[e],+e,c)) {
				d.push(c[e]);
			}
		}
		return d;
	};


/**
 * ### Changed plugin
 *
 * This plugin adds more information to the `changed.jstree` event. The new data is contained in the `changed` event data property, and contains a lists of `selected` and `deselected` nodes.
 */

	$.jstree.plugins.changed = function (options, parent) {
		var last = [];
		this.trigger = function (ev, data) {
			var i, j;
			if(!data) {
				data = {};
			}
			if(ev.replace('.jstree','') === 'changed') {
				data.changed = { selected : [], deselected : [] };
				var tmp = {};
				for(i = 0, j = last.length; i < j; i++) {
					tmp[last[i]] = 1;
				}
				for(i = 0, j = data.selected.length; i < j; i++) {
					if(!tmp[data.selected[i]]) {
						data.changed.selected.push(data.selected[i]);
					}
					else {
						tmp[data.selected[i]] = 2;
					}
				}
				for(i = 0, j = last.length; i < j; i++) {
					if(tmp[last[i]] === 1) {
						data.changed.deselected.push(last[i]);
					}
				}
				last = data.selected.slice();
			}
			/**
			 * triggered when selection changes (the "changed" plugin enhances the original event with more data)
			 * @event
			 * @name changed.jstree
			 * @param {Object} node
			 * @param {Object} action the action that caused the selection to change
			 * @param {Array} selected the current selection
			 * @param {Object} changed an object containing two properties `selected` and `deselected` - both arrays of node IDs, which were selected or deselected since the last changed event
			 * @param {Object} event the event (if any) that triggered this changed event
			 * @plugin changed
			 */
			parent.trigger.call(this, ev, data);
		};
		this.refresh = function (skip_loading, forget_state) {
			last = [];
			return parent.refresh.apply(this, arguments);
		};
	};

/**
 * ### Checkbox plugin
 *
 * This plugin renders checkbox icons in front of each node, making multiple selection much easier.
 * It also supports tri-state behavior, meaning that if a node has a few of its children checked it will be rendered as undetermined, and state will be propagated up.
 */

	var _i = document.createElement('I');
	_i.className = 'jstree-icon jstree-checkbox';
	_i.setAttribute('role', 'presentation');
	/**
	 * stores all defaults for the checkbox plugin
	 * @name $.jstree.defaults.checkbox
	 * @plugin checkbox
	 */
	$.jstree.defaults.checkbox = {
		/**
		 * a boolean indicating if checkboxes should be visible (can be changed at a later time using `show_checkboxes()` and `hide_checkboxes`). Defaults to `true`.
		 * @name $.jstree.defaults.checkbox.visible
		 * @plugin checkbox
		 */
		visible				: true,
		/**
		 * a boolean indicating if checkboxes should cascade down and have an undetermined state. Defaults to `true`.
		 * @name $.jstree.defaults.checkbox.three_state
		 * @plugin checkbox
		 */
		three_state			: true,
		/**
		 * a boolean indicating if clicking anywhere on the node should act as clicking on the checkbox. Defaults to `true`.
		 * @name $.jstree.defaults.checkbox.whole_node
		 * @plugin checkbox
		 */
		whole_node			: true,
		/**
		 * a boolean indicating if the selected style of a node should be kept, or removed. Defaults to `true`.
		 * @name $.jstree.defaults.checkbox.keep_selected_style
		 * @plugin checkbox
		 */
		keep_selected_style	: true,
		/**
		 * This setting controls how cascading and undetermined nodes are applied.
		 * If 'up' is in the string - cascading up is enabled, if 'down' is in the string - cascading down is enabled, if 'undetermined' is in the string - undetermined nodes will be used.
		 * If `three_state` is set to `true` this setting is automatically set to 'up+down+undetermined'. Defaults to ''.
		 * @name $.jstree.defaults.checkbox.cascade
		 * @plugin checkbox
		 */
		cascade				: '',
		/**
		 * This setting controls if checkbox are bound to the general tree selection or to an internal array maintained by the checkbox plugin. Defaults to `true`, only set to `false` if you know exactly what you are doing.
		 * @name $.jstree.defaults.checkbox.tie_selection
		 * @plugin checkbox
		 */
		tie_selection		: true,

		/**
		 * This setting controls if cascading down affects disabled checkboxes
		 * @name $.jstree.defaults.checkbox.cascade_to_disabled
		 * @plugin checkbox
		 */
		cascade_to_disabled : true,

		/**
		 * This setting controls if cascading down affects hidden checkboxes
		 * @name $.jstree.defaults.checkbox.cascade_to_hidden
		 * @plugin checkbox
		 */
		cascade_to_hidden : true
	};
	$.jstree.plugins.checkbox = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);
			this._data.checkbox.uto = false;
			this._data.checkbox.selected = [];
			if(this.settings.checkbox.three_state) {
				this.settings.checkbox.cascade = 'up+down+undetermined';
			}
			this.element
				.on("init.jstree", $.proxy(function () {
						this._data.checkbox.visible = this.settings.checkbox.visible;
						if(!this.settings.checkbox.keep_selected_style) {
							this.element.addClass('jstree-checkbox-no-clicked');
						}
						if(this.settings.checkbox.tie_selection) {
							this.element.addClass('jstree-checkbox-selection');
						}
					}, this))
				.on("loading.jstree", $.proxy(function () {
						this[ this._data.checkbox.visible ? 'show_checkboxes' : 'hide_checkboxes' ]();
					}, this));
			if(this.settings.checkbox.cascade.indexOf('undetermined') !== -1) {
				this.element
					.on('changed.jstree uncheck_node.jstree check_node.jstree uncheck_all.jstree check_all.jstree move_node.jstree copy_node.jstree redraw.jstree open_node.jstree', $.proxy(function () {
							// only if undetermined is in setting
							if(this._data.checkbox.uto) { clearTimeout(this._data.checkbox.uto); }
							this._data.checkbox.uto = setTimeout($.proxy(this._undetermined, this), 50);
						}, this));
			}
			if(!this.settings.checkbox.tie_selection) {
				this.element
					.on('model.jstree', $.proxy(function (e, data) {
						var m = this._model.data,
							p = m[data.parent],
							dpc = data.nodes,
							i, j;
						for(i = 0, j = dpc.length; i < j; i++) {
							m[dpc[i]].state.checked = m[dpc[i]].state.checked || (m[dpc[i]].original && m[dpc[i]].original.state && m[dpc[i]].original.state.checked);
							if(m[dpc[i]].state.checked) {
								this._data.checkbox.selected.push(dpc[i]);
							}
						}
					}, this));
			}
			if(this.settings.checkbox.cascade.indexOf('up') !== -1 || this.settings.checkbox.cascade.indexOf('down') !== -1) {
				this.element
					.on('model.jstree', $.proxy(function (e, data) {
							var m = this._model.data,
								p = m[data.parent],
								dpc = data.nodes,
								chd = [],
								c, i, j, k, l, tmp, s = this.settings.checkbox.cascade, t = this.settings.checkbox.tie_selection;

							if(s.indexOf('down') !== -1) {
								// apply down
								if(p.state[ t ? 'selected' : 'checked' ]) {
									for(i = 0, j = dpc.length; i < j; i++) {
										m[dpc[i]].state[ t ? 'selected' : 'checked' ] = true;
									}

									this._data[ t ? 'core' : 'checkbox' ].selected = this._data[ t ? 'core' : 'checkbox' ].selected.concat(dpc);
								}
								else {
									for(i = 0, j = dpc.length; i < j; i++) {
										if(m[dpc[i]].state[ t ? 'selected' : 'checked' ]) {
											for(k = 0, l = m[dpc[i]].children_d.length; k < l; k++) {
												m[m[dpc[i]].children_d[k]].state[ t ? 'selected' : 'checked' ] = true;
											}
											this._data[ t ? 'core' : 'checkbox' ].selected = this._data[ t ? 'core' : 'checkbox' ].selected.concat(m[dpc[i]].children_d);
										}
									}
								}
							}

							if(s.indexOf('up') !== -1) {
								// apply up
								for(i = 0, j = p.children_d.length; i < j; i++) {
									if(!m[p.children_d[i]].children.length) {
										chd.push(m[p.children_d[i]].parent);
									}
								}
								chd = $.vakata.array_unique(chd);
								for(k = 0, l = chd.length; k < l; k++) {
									p = m[chd[k]];
									while(p && p.id !== $.jstree.root) {
										c = 0;
										for(i = 0, j = p.children.length; i < j; i++) {
											c += m[p.children[i]].state[ t ? 'selected' : 'checked' ];
										}
										if(c === j) {
											p.state[ t ? 'selected' : 'checked' ] = true;
											this._data[ t ? 'core' : 'checkbox' ].selected.push(p.id);
											tmp = this.get_node(p, true);
											if(tmp && tmp.length) {
												tmp.attr('aria-selected', true).children('.jstree-anchor').addClass( t ? 'jstree-clicked' : 'jstree-checked');
											}
										}
										else {
											break;
										}
										p = this.get_node(p.parent);
									}
								}
							}

							this._data[ t ? 'core' : 'checkbox' ].selected = $.vakata.array_unique(this._data[ t ? 'core' : 'checkbox' ].selected);
						}, this))
					.on(this.settings.checkbox.tie_selection ? 'select_node.jstree' : 'check_node.jstree', $.proxy(function (e, data) {
							var self = this,
								obj = data.node,
								m = this._model.data,
								par = this.get_node(obj.parent),
								i, j, c, tmp, s = this.settings.checkbox.cascade, t = this.settings.checkbox.tie_selection,
								sel = {}, cur = this._data[ t ? 'core' : 'checkbox' ].selected;

							for (i = 0, j = cur.length; i < j; i++) {
								sel[cur[i]] = true;
							}

							// apply down
							if(s.indexOf('down') !== -1) {
								//this._data[ t ? 'core' : 'checkbox' ].selected = $.vakata.array_unique(this._data[ t ? 'core' : 'checkbox' ].selected.concat(obj.children_d));
								var selectedIds = this._cascade_new_checked_state(obj.id, true);
								var temp = obj.children_d.concat(obj.id);
								for (i = 0, j = temp.length; i < j; i++) {
									if (selectedIds.indexOf(temp[i]) > -1) {
										sel[temp[i]] = true;
									}
									else {
										delete sel[temp[i]];
									}
								}
							}

							// apply up
							if(s.indexOf('up') !== -1) {
								while(par && par.id !== $.jstree.root) {
									c = 0;
									for(i = 0, j = par.children.length; i < j; i++) {
										c += m[par.children[i]].state[ t ? 'selected' : 'checked' ];
									}
									if(c === j) {
										par.state[ t ? 'selected' : 'checked' ] = true;
										sel[par.id] = true;
										//this._data[ t ? 'core' : 'checkbox' ].selected.push(par.id);
										tmp = this.get_node(par, true);
										if(tmp && tmp.length) {
											tmp.attr('aria-selected', true).children('.jstree-anchor').addClass(t ? 'jstree-clicked' : 'jstree-checked');
										}
									}
									else {
										break;
									}
									par = this.get_node(par.parent);
								}
							}

							cur = [];
							for (i in sel) {
								if (sel.hasOwnProperty(i)) {
									cur.push(i);
								}
							}
							this._data[ t ? 'core' : 'checkbox' ].selected = cur;
						}, this))
					.on(this.settings.checkbox.tie_selection ? 'deselect_all.jstree' : 'uncheck_all.jstree', $.proxy(function (e, data) {
							var obj = this.get_node($.jstree.root),
								m = this._model.data,
								i, j, tmp;
							for(i = 0, j = obj.children_d.length; i < j; i++) {
								tmp = m[obj.children_d[i]];
								if(tmp && tmp.original && tmp.original.state && tmp.original.state.undetermined) {
									tmp.original.state.undetermined = false;
								}
							}
						}, this))
					.on(this.settings.checkbox.tie_selection ? 'deselect_node.jstree' : 'uncheck_node.jstree', $.proxy(function (e, data) {
							var self = this,
								obj = data.node,
								dom = this.get_node(obj, true),
								i, j, tmp, s = this.settings.checkbox.cascade, t = this.settings.checkbox.tie_selection,
								cur = this._data[ t ? 'core' : 'checkbox' ].selected, sel = {},
								stillSelectedIds = [],
								allIds = obj.children_d.concat(obj.id);

							// apply down
							if(s.indexOf('down') !== -1) {
								var selectedIds = this._cascade_new_checked_state(obj.id, false);

								cur = $.vakata.array_filter(cur, function(id) {
									return allIds.indexOf(id) === -1 || selectedIds.indexOf(id) > -1;
								});
							}

							// only apply up if cascade up is enabled and if this node is not selected
							// (if all child nodes are disabled and cascade_to_disabled === false then this node will till be selected).
							if(s.indexOf('up') !== -1 && cur.indexOf(obj.id) === -1) {
								for(i = 0, j = obj.parents.length; i < j; i++) {
									tmp = this._model.data[obj.parents[i]];
									tmp.state[ t ? 'selected' : 'checked' ] = false;
									if(tmp && tmp.original && tmp.original.state && tmp.original.state.undetermined) {
										tmp.original.state.undetermined = false;
									}
									tmp = this.get_node(obj.parents[i], true);
									if(tmp && tmp.length) {
										tmp.attr('aria-selected', false).children('.jstree-anchor').removeClass(t ? 'jstree-clicked' : 'jstree-checked');
									}
								}

								cur = $.vakata.array_filter(cur, function(id) {
									return obj.parents.indexOf(id) === -1;
								});
							}

							this._data[ t ? 'core' : 'checkbox' ].selected = cur;
						}, this));
			}
			if(this.settings.checkbox.cascade.indexOf('up') !== -1) {
				this.element
					.on('delete_node.jstree', $.proxy(function (e, data) {
							// apply up (whole handler)
							var p = this.get_node(data.parent),
								m = this._model.data,
								i, j, c, tmp, t = this.settings.checkbox.tie_selection;
							while(p && p.id !== $.jstree.root && !p.state[ t ? 'selected' : 'checked' ]) {
								c = 0;
								for(i = 0, j = p.children.length; i < j; i++) {
									c += m[p.children[i]].state[ t ? 'selected' : 'checked' ];
								}
								if(j > 0 && c === j) {
									p.state[ t ? 'selected' : 'checked' ] = true;
									this._data[ t ? 'core' : 'checkbox' ].selected.push(p.id);
									tmp = this.get_node(p, true);
									if(tmp && tmp.length) {
										tmp.attr('aria-selected', true).children('.jstree-anchor').addClass(t ? 'jstree-clicked' : 'jstree-checked');
									}
								}
								else {
									break;
								}
								p = this.get_node(p.parent);
							}
						}, this))
					.on('move_node.jstree', $.proxy(function (e, data) {
							// apply up (whole handler)
							var is_multi = data.is_multi,
								old_par = data.old_parent,
								new_par = this.get_node(data.parent),
								m = this._model.data,
								p, c, i, j, tmp, t = this.settings.checkbox.tie_selection;
							if(!is_multi) {
								p = this.get_node(old_par);
								while(p && p.id !== $.jstree.root && !p.state[ t ? 'selected' : 'checked' ]) {
									c = 0;
									for(i = 0, j = p.children.length; i < j; i++) {
										c += m[p.children[i]].state[ t ? 'selected' : 'checked' ];
									}
									if(j > 0 && c === j) {
										p.state[ t ? 'selected' : 'checked' ] = true;
										this._data[ t ? 'core' : 'checkbox' ].selected.push(p.id);
										tmp = this.get_node(p, true);
										if(tmp && tmp.length) {
											tmp.attr('aria-selected', true).children('.jstree-anchor').addClass(t ? 'jstree-clicked' : 'jstree-checked');
										}
									}
									else {
										break;
									}
									p = this.get_node(p.parent);
								}
							}
							p = new_par;
							while(p && p.id !== $.jstree.root) {
								c = 0;
								for(i = 0, j = p.children.length; i < j; i++) {
									c += m[p.children[i]].state[ t ? 'selected' : 'checked' ];
								}
								if(c === j) {
									if(!p.state[ t ? 'selected' : 'checked' ]) {
										p.state[ t ? 'selected' : 'checked' ] = true;
										this._data[ t ? 'core' : 'checkbox' ].selected.push(p.id);
										tmp = this.get_node(p, true);
										if(tmp && tmp.length) {
											tmp.attr('aria-selected', true).children('.jstree-anchor').addClass(t ? 'jstree-clicked' : 'jstree-checked');
										}
									}
								}
								else {
									if(p.state[ t ? 'selected' : 'checked' ]) {
										p.state[ t ? 'selected' : 'checked' ] = false;
										this._data[ t ? 'core' : 'checkbox' ].selected = $.vakata.array_remove_item(this._data[ t ? 'core' : 'checkbox' ].selected, p.id);
										tmp = this.get_node(p, true);
										if(tmp && tmp.length) {
											tmp.attr('aria-selected', false).children('.jstree-anchor').removeClass(t ? 'jstree-clicked' : 'jstree-checked');
										}
									}
									else {
										break;
									}
								}
								p = this.get_node(p.parent);
							}
						}, this));
			}
		};
		/**
		 * get an array of all nodes whose state is "undetermined"
		 * @name get_undetermined([full])
		 * @param  {boolean} full: if set to `true` the returned array will consist of the full node objects, otherwise - only IDs will be returned
		 * @return {Array}
		 * @plugin checkbox
		 */
		this.get_undetermined = function (full) {
			if (this.settings.checkbox.cascade.indexOf('undetermined') === -1) {
				return [];
			}
			var i, j, k, l, o = {}, m = this._model.data, t = this.settings.checkbox.tie_selection, s = this._data[ t ? 'core' : 'checkbox' ].selected, p = [], tt = this, r = [];
			for(i = 0, j = s.length; i < j; i++) {
				if(m[s[i]] && m[s[i]].parents) {
					for(k = 0, l = m[s[i]].parents.length; k < l; k++) {
						if(o[m[s[i]].parents[k]] !== undefined) {
							break;
						}
						if(m[s[i]].parents[k] !== $.jstree.root) {
							o[m[s[i]].parents[k]] = true;
							p.push(m[s[i]].parents[k]);
						}
					}
				}
			}
			// attempt for server side undetermined state
			this.element.find('.jstree-closed').not(':has(.jstree-children)')
				.each(function () {
					var tmp = tt.get_node(this), tmp2;
					
					if(!tmp) { return; }
					
					if(!tmp.state.loaded) {
						if(tmp.original && tmp.original.state && tmp.original.state.undetermined && tmp.original.state.undetermined === true) {
							if(o[tmp.id] === undefined && tmp.id !== $.jstree.root) {
								o[tmp.id] = true;
								p.push(tmp.id);
							}
							for(k = 0, l = tmp.parents.length; k < l; k++) {
								if(o[tmp.parents[k]] === undefined && tmp.parents[k] !== $.jstree.root) {
									o[tmp.parents[k]] = true;
									p.push(tmp.parents[k]);
								}
							}
						}
					}
					else {
						for(i = 0, j = tmp.children_d.length; i < j; i++) {
							tmp2 = m[tmp.children_d[i]];
							if(!tmp2.state.loaded && tmp2.original && tmp2.original.state && tmp2.original.state.undetermined && tmp2.original.state.undetermined === true) {
								if(o[tmp2.id] === undefined && tmp2.id !== $.jstree.root) {
									o[tmp2.id] = true;
									p.push(tmp2.id);
								}
								for(k = 0, l = tmp2.parents.length; k < l; k++) {
									if(o[tmp2.parents[k]] === undefined && tmp2.parents[k] !== $.jstree.root) {
										o[tmp2.parents[k]] = true;
										p.push(tmp2.parents[k]);
									}
								}
							}
						}
					}
				});
			for (i = 0, j = p.length; i < j; i++) {
				if(!m[p[i]].state[ t ? 'selected' : 'checked' ]) {
					r.push(full ? m[p[i]] : p[i]);
				}
			}
			return r;
		};
		/**
		 * set the undetermined state where and if necessary. Used internally.
		 * @private
		 * @name _undetermined()
		 * @plugin checkbox
		 */
		this._undetermined = function () {
			if(this.element === null) { return; }
			var p = this.get_undetermined(false), i, j, s;

			this.element.find('.jstree-undetermined').removeClass('jstree-undetermined');
			for (i = 0, j = p.length; i < j; i++) {
				s = this.get_node(p[i], true);
				if(s && s.length) {
					s.children('.jstree-anchor').children('.jstree-checkbox').addClass('jstree-undetermined');
				}
			}
		};
		this.redraw_node = function(obj, deep, is_callback, force_render) {
			obj = parent.redraw_node.apply(this, arguments);
			if(obj) {
				var i, j, tmp = null, icon = null;
				for(i = 0, j = obj.childNodes.length; i < j; i++) {
					if(obj.childNodes[i] && obj.childNodes[i].className && obj.childNodes[i].className.indexOf("jstree-anchor") !== -1) {
						tmp = obj.childNodes[i];
						break;
					}
				}
				if(tmp) {
					if(!this.settings.checkbox.tie_selection && this._model.data[obj.id].state.checked) { tmp.className += ' jstree-checked'; }
					icon = _i.cloneNode(false);
					if(this._model.data[obj.id].state.checkbox_disabled) { icon.className += ' jstree-checkbox-disabled'; }
					tmp.insertBefore(icon, tmp.childNodes[0]);
				}
			}
			if(!is_callback && this.settings.checkbox.cascade.indexOf('undetermined') !== -1) {
				if(this._data.checkbox.uto) { clearTimeout(this._data.checkbox.uto); }
				this._data.checkbox.uto = setTimeout($.proxy(this._undetermined, this), 50);
			}
			return obj;
		};
		/**
		 * show the node checkbox icons
		 * @name show_checkboxes()
		 * @plugin checkbox
		 */
		this.show_checkboxes = function () { this._data.core.themes.checkboxes = true; this.get_container_ul().removeClass("jstree-no-checkboxes"); };
		/**
		 * hide the node checkbox icons
		 * @name hide_checkboxes()
		 * @plugin checkbox
		 */
		this.hide_checkboxes = function () { this._data.core.themes.checkboxes = false; this.get_container_ul().addClass("jstree-no-checkboxes"); };
		/**
		 * toggle the node icons
		 * @name toggle_checkboxes()
		 * @plugin checkbox
		 */
		this.toggle_checkboxes = function () { if(this._data.core.themes.checkboxes) { this.hide_checkboxes(); } else { this.show_checkboxes(); } };
		/**
		 * checks if a node is in an undetermined state
		 * @name is_undetermined(obj)
		 * @param  {mixed} obj
		 * @return {Boolean}
		 */
		this.is_undetermined = function (obj) {
			obj = this.get_node(obj);
			var s = this.settings.checkbox.cascade, i, j, t = this.settings.checkbox.tie_selection, d = this._data[ t ? 'core' : 'checkbox' ].selected, m = this._model.data;
			if(!obj || obj.state[ t ? 'selected' : 'checked' ] === true || s.indexOf('undetermined') === -1 || (s.indexOf('down') === -1 && s.indexOf('up') === -1)) {
				return false;
			}
			if(!obj.state.loaded && obj.original.state.undetermined === true) {
				return true;
			}
			for(i = 0, j = obj.children_d.length; i < j; i++) {
				if($.inArray(obj.children_d[i], d) !== -1 || (!m[obj.children_d[i]].state.loaded && m[obj.children_d[i]].original.state.undetermined)) {
					return true;
				}
			}
			return false;
		};
		/**
		 * disable a node's checkbox
		 * @name disable_checkbox(obj)
		 * @param {mixed} obj an array can be used too
		 * @trigger disable_checkbox.jstree
		 * @plugin checkbox
		 */
		this.disable_checkbox = function (obj) {
			var t1, t2, dom;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.disable_checkbox(obj[t1]);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			dom = this.get_node(obj, true);
			if(!obj.state.checkbox_disabled) {
				obj.state.checkbox_disabled = true;
				if(dom && dom.length) {
					dom.children('.jstree-anchor').children('.jstree-checkbox').addClass('jstree-checkbox-disabled');
				}
				/**
				 * triggered when an node's checkbox is disabled
				 * @event
				 * @name disable_checkbox.jstree
				 * @param {Object} node
				 * @plugin checkbox
				 */
				this.trigger('disable_checkbox', { 'node' : obj });
			}
		};
		/**
		 * enable a node's checkbox
		 * @name enable_checkbox(obj)
		 * @param {mixed} obj an array can be used too
		 * @trigger enable_checkbox.jstree
		 * @plugin checkbox
		 */
		this.enable_checkbox = function (obj) {
			var t1, t2, dom;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.enable_checkbox(obj[t1]);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			dom = this.get_node(obj, true);
			if(obj.state.checkbox_disabled) {
				obj.state.checkbox_disabled = false;
				if(dom && dom.length) {
					dom.children('.jstree-anchor').children('.jstree-checkbox').removeClass('jstree-checkbox-disabled');
				}
				/**
				 * triggered when an node's checkbox is enabled
				 * @event
				 * @name enable_checkbox.jstree
				 * @param {Object} node
				 * @plugin checkbox
				 */
				this.trigger('enable_checkbox', { 'node' : obj });
			}
		};

		this.activate_node = function (obj, e) {
			if($(e.target).hasClass('jstree-checkbox-disabled')) {
				return false;
			}
			if(this.settings.checkbox.tie_selection && (this.settings.checkbox.whole_node || $(e.target).hasClass('jstree-checkbox'))) {
				e.ctrlKey = true;
			}
			if(this.settings.checkbox.tie_selection || (!this.settings.checkbox.whole_node && !$(e.target).hasClass('jstree-checkbox'))) {
				return parent.activate_node.call(this, obj, e);
			}
			if(this.is_disabled(obj)) {
				return false;
			}
			if(this.is_checked(obj)) {
				this.uncheck_node(obj, e);
			}
			else {
				this.check_node(obj, e);
			}
			this.trigger('activate_node', { 'node' : this.get_node(obj) });
		};

		/**
		 * Cascades checked state to a node and all its descendants. This function does NOT affect hidden and disabled nodes (or their descendants).
		 * However if these unaffected nodes are already selected their ids will be included in the returned array.
		 * @private
		 * @param {string} id the node ID
		 * @param {bool} checkedState should the nodes be checked or not
		 * @returns {Array} Array of all node id's (in this tree branch) that are checked.
		 */
		this._cascade_new_checked_state = function (id, checkedState) {
			var self = this;
			var t = this.settings.checkbox.tie_selection;
			var node = this._model.data[id];
			var selectedNodeIds = [];
			var selectedChildrenIds = [], i, j, selectedChildIds;

			if (
				(this.settings.checkbox.cascade_to_disabled || !node.state.disabled) &&
				(this.settings.checkbox.cascade_to_hidden || !node.state.hidden)
			) {
				//First try and check/uncheck the children
				if (node.children) {
					for (i = 0, j = node.children.length; i < j; i++) {
						var childId = node.children[i];
						selectedChildIds = self._cascade_new_checked_state(childId, checkedState);
						selectedNodeIds = selectedNodeIds.concat(selectedChildIds);
						if (selectedChildIds.indexOf(childId) > -1) {
							selectedChildrenIds.push(childId);
						}
					}
				}

				var dom = self.get_node(node, true);

				//A node's state is undetermined if some but not all of it's children are checked/selected .
				var undetermined = selectedChildrenIds.length > 0 && selectedChildrenIds.length < node.children.length;

				if(node.original && node.original.state && node.original.state.undetermined) {
					node.original.state.undetermined = undetermined;
				}

				//If a node is undetermined then remove selected class
				if (undetermined) {
					node.state[ t ? 'selected' : 'checked' ] = false;
					dom.attr('aria-selected', false).children('.jstree-anchor').removeClass(t ? 'jstree-clicked' : 'jstree-checked');
				}
				//Otherwise, if the checkedState === true (i.e. the node is being checked now) and all of the node's children are checked (if it has any children),
				//check the node and style it correctly.
				else if (checkedState && selectedChildrenIds.length === node.children.length) {
					node.state[ t ? 'selected' : 'checked' ] = checkedState;
					selectedNodeIds.push(node.id);

					dom.attr('aria-selected', true).children('.jstree-anchor').addClass(t ? 'jstree-clicked' : 'jstree-checked');
				}
				else {
					node.state[ t ? 'selected' : 'checked' ] = false;
					dom.attr('aria-selected', false).children('.jstree-anchor').removeClass(t ? 'jstree-clicked' : 'jstree-checked');
				}
			}
			else {
				selectedChildIds = this.get_checked_descendants(id);

				if (node.state[ t ? 'selected' : 'checked' ]) {
					selectedChildIds.push(node.id);
				}

				selectedNodeIds = selectedNodeIds.concat(selectedChildIds);
			}

			return selectedNodeIds;
		};

		/**
		 * Gets ids of nodes selected in branch (of tree) specified by id (does not include the node specified by id)
		 * @name get_checked_descendants(obj)
		 * @param {string} id the node ID
		 * @return {Array} array of IDs
		 * @plugin checkbox
		 */
		this.get_checked_descendants = function (id) {
			var self = this;
			var t = self.settings.checkbox.tie_selection;
			var node = self._model.data[id];

			return $.vakata.array_filter(node.children_d, function(_id) {
				return self._model.data[_id].state[ t ? 'selected' : 'checked' ];
			});
		};

		/**
		 * check a node (only if tie_selection in checkbox settings is false, otherwise select_node will be called internally)
		 * @name check_node(obj)
		 * @param {mixed} obj an array can be used to check multiple nodes
		 * @trigger check_node.jstree
		 * @plugin checkbox
		 */
		this.check_node = function (obj, e) {
			if(this.settings.checkbox.tie_selection) { return this.select_node(obj, false, true, e); }
			var dom, t1, t2, th;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.check_node(obj[t1], e);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			dom = this.get_node(obj, true);
			if(!obj.state.checked) {
				obj.state.checked = true;
				this._data.checkbox.selected.push(obj.id);
				if(dom && dom.length) {
					dom.children('.jstree-anchor').addClass('jstree-checked');
				}
				/**
				 * triggered when an node is checked (only if tie_selection in checkbox settings is false)
				 * @event
				 * @name check_node.jstree
				 * @param {Object} node
				 * @param {Array} selected the current selection
				 * @param {Object} event the event (if any) that triggered this check_node
				 * @plugin checkbox
				 */
				this.trigger('check_node', { 'node' : obj, 'selected' : this._data.checkbox.selected, 'event' : e });
			}
		};
		/**
		 * uncheck a node (only if tie_selection in checkbox settings is false, otherwise deselect_node will be called internally)
		 * @name uncheck_node(obj)
		 * @param {mixed} obj an array can be used to uncheck multiple nodes
		 * @trigger uncheck_node.jstree
		 * @plugin checkbox
		 */
		this.uncheck_node = function (obj, e) {
			if(this.settings.checkbox.tie_selection) { return this.deselect_node(obj, false, e); }
			var t1, t2, dom;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.uncheck_node(obj[t1], e);
				}
				return true;
			}
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) {
				return false;
			}
			dom = this.get_node(obj, true);
			if(obj.state.checked) {
				obj.state.checked = false;
				this._data.checkbox.selected = $.vakata.array_remove_item(this._data.checkbox.selected, obj.id);
				if(dom.length) {
					dom.children('.jstree-anchor').removeClass('jstree-checked');
				}
				/**
				 * triggered when an node is unchecked (only if tie_selection in checkbox settings is false)
				 * @event
				 * @name uncheck_node.jstree
				 * @param {Object} node
				 * @param {Array} selected the current selection
				 * @param {Object} event the event (if any) that triggered this uncheck_node
				 * @plugin checkbox
				 */
				this.trigger('uncheck_node', { 'node' : obj, 'selected' : this._data.checkbox.selected, 'event' : e });
			}
		};
		
		/**
		 * checks all nodes in the tree (only if tie_selection in checkbox settings is false, otherwise select_all will be called internally)
		 * @name check_all()
		 * @trigger check_all.jstree, changed.jstree
		 * @plugin checkbox
		 */
		this.check_all = function () {
			if(this.settings.checkbox.tie_selection) { return this.select_all(); }
			var tmp = this._data.checkbox.selected.concat([]), i, j;
			this._data.checkbox.selected = this._model.data[$.jstree.root].children_d.concat();
			for(i = 0, j = this._data.checkbox.selected.length; i < j; i++) {
				if(this._model.data[this._data.checkbox.selected[i]]) {
					this._model.data[this._data.checkbox.selected[i]].state.checked = true;
				}
			}
			this.redraw(true);
			/**
			 * triggered when all nodes are checked (only if tie_selection in checkbox settings is false)
			 * @event
			 * @name check_all.jstree
			 * @param {Array} selected the current selection
			 * @plugin checkbox
			 */
			this.trigger('check_all', { 'selected' : this._data.checkbox.selected });
		};
		/**
		 * uncheck all checked nodes (only if tie_selection in checkbox settings is false, otherwise deselect_all will be called internally)
		 * @name uncheck_all()
		 * @trigger uncheck_all.jstree
		 * @plugin checkbox
		 */
		this.uncheck_all = function () {
			if(this.settings.checkbox.tie_selection) { return this.deselect_all(); }
			var tmp = this._data.checkbox.selected.concat([]), i, j;
			for(i = 0, j = this._data.checkbox.selected.length; i < j; i++) {
				if(this._model.data[this._data.checkbox.selected[i]]) {
					this._model.data[this._data.checkbox.selected[i]].state.checked = false;
				}
			}
			this._data.checkbox.selected = [];
			this.element.find('.jstree-checked').removeClass('jstree-checked');
			/**
			 * triggered when all nodes are unchecked (only if tie_selection in checkbox settings is false)
			 * @event
			 * @name uncheck_all.jstree
			 * @param {Object} node the previous selection
			 * @param {Array} selected the current selection
			 * @plugin checkbox
			 */
			this.trigger('uncheck_all', { 'selected' : this._data.checkbox.selected, 'node' : tmp });
		};
		/**
		 * checks if a node is checked (if tie_selection is on in the settings this function will return the same as is_selected)
		 * @name is_checked(obj)
		 * @param  {mixed}  obj
		 * @return {Boolean}
		 * @plugin checkbox
		 */
		this.is_checked = function (obj) {
			if(this.settings.checkbox.tie_selection) { return this.is_selected(obj); }
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) { return false; }
			return obj.state.checked;
		};
		/**
		 * get an array of all checked nodes (if tie_selection is on in the settings this function will return the same as get_selected)
		 * @name get_checked([full])
		 * @param  {mixed}  full if set to `true` the returned array will consist of the full node objects, otherwise - only IDs will be returned
		 * @return {Array}
		 * @plugin checkbox
		 */
		this.get_checked = function (full) {
			if(this.settings.checkbox.tie_selection) { return this.get_selected(full); }
			return full ? $.map(this._data.checkbox.selected, $.proxy(function (i) { return this.get_node(i); }, this)) : this._data.checkbox.selected.slice();
		};
		/**
		 * get an array of all top level checked nodes (ignoring children of checked nodes) (if tie_selection is on in the settings this function will return the same as get_top_selected)
		 * @name get_top_checked([full])
		 * @param  {mixed}  full if set to `true` the returned array will consist of the full node objects, otherwise - only IDs will be returned
		 * @return {Array}
		 * @plugin checkbox
		 */
		this.get_top_checked = function (full) {
			if(this.settings.checkbox.tie_selection) { return this.get_top_selected(full); }
			var tmp = this.get_checked(true),
				obj = {}, i, j, k, l;
			for(i = 0, j = tmp.length; i < j; i++) {
				obj[tmp[i].id] = tmp[i];
			}
			for(i = 0, j = tmp.length; i < j; i++) {
				for(k = 0, l = tmp[i].children_d.length; k < l; k++) {
					if(obj[tmp[i].children_d[k]]) {
						delete obj[tmp[i].children_d[k]];
					}
				}
			}
			tmp = [];
			for(i in obj) {
				if(obj.hasOwnProperty(i)) {
					tmp.push(i);
				}
			}
			return full ? $.map(tmp, $.proxy(function (i) { return this.get_node(i); }, this)) : tmp;
		};
		/**
		 * get an array of all bottom level checked nodes (ignoring selected parents) (if tie_selection is on in the settings this function will return the same as get_bottom_selected)
		 * @name get_bottom_checked([full])
		 * @param  {mixed}  full if set to `true` the returned array will consist of the full node objects, otherwise - only IDs will be returned
		 * @return {Array}
		 * @plugin checkbox
		 */
		this.get_bottom_checked = function (full) {
			if(this.settings.checkbox.tie_selection) { return this.get_bottom_selected(full); }
			var tmp = this.get_checked(true),
				obj = [], i, j;
			for(i = 0, j = tmp.length; i < j; i++) {
				if(!tmp[i].children.length) {
					obj.push(tmp[i].id);
				}
			}
			return full ? $.map(obj, $.proxy(function (i) { return this.get_node(i); }, this)) : obj;
		};
		this.load_node = function (obj, callback) {
			var k, l, i, j, c, tmp;
			if(!$.isArray(obj) && !this.settings.checkbox.tie_selection) {
				tmp = this.get_node(obj);
				if(tmp && tmp.state.loaded) {
					for(k = 0, l = tmp.children_d.length; k < l; k++) {
						if(this._model.data[tmp.children_d[k]].state.checked) {
							c = true;
							this._data.checkbox.selected = $.vakata.array_remove_item(this._data.checkbox.selected, tmp.children_d[k]);
						}
					}
				}
			}
			return parent.load_node.apply(this, arguments);
		};
		this.get_state = function () {
			var state = parent.get_state.apply(this, arguments);
			if(this.settings.checkbox.tie_selection) { return state; }
			state.checkbox = this._data.checkbox.selected.slice();
			return state;
		};
		this.set_state = function (state, callback) {
			var res = parent.set_state.apply(this, arguments);
			if(res && state.checkbox) {
				if(!this.settings.checkbox.tie_selection) {
					this.uncheck_all();
					var _this = this;
					$.each(state.checkbox, function (i, v) {
						_this.check_node(v);
					});
				}
				delete state.checkbox;
				this.set_state(state, callback);
				return false;
			}
			return res;
		};
		this.refresh = function (skip_loading, forget_state) {
			if(this.settings.checkbox.tie_selection) {
				this._data.checkbox.selected = [];
			}
			return parent.refresh.apply(this, arguments);
		};
	};

	// include the checkbox plugin by default
	// $.jstree.defaults.plugins.push("checkbox");


/**
 * ### Conditionalselect plugin
 *
 * This plugin allows defining a callback to allow or deny node selection by user input (activate node method).
 */

	/**
	 * a callback (function) which is invoked in the instance's scope and receives two arguments - the node and the event that triggered the `activate_node` call. Returning false prevents working with the node, returning true allows invoking activate_node. Defaults to returning `true`.
	 * @name $.jstree.defaults.checkbox.visible
	 * @plugin checkbox
	 */
	$.jstree.defaults.conditionalselect = function () { return true; };
	$.jstree.plugins.conditionalselect = function (options, parent) {
		// own function
		this.activate_node = function (obj, e) {
			if(this.settings.conditionalselect.call(this, this.get_node(obj), e)) {
				return parent.activate_node.call(this, obj, e);
			}
		};
	};


/**
 * ### Contextmenu plugin
 *
 * Shows a context menu when a node is right-clicked.
 */

	/**
	 * stores all defaults for the contextmenu plugin
	 * @name $.jstree.defaults.contextmenu
	 * @plugin contextmenu
	 */
	$.jstree.defaults.contextmenu = {
		/**
		 * a boolean indicating if the node should be selected when the context menu is invoked on it. Defaults to `true`.
		 * @name $.jstree.defaults.contextmenu.select_node
		 * @plugin contextmenu
		 */
		select_node : true,
		/**
		 * a boolean indicating if the menu should be shown aligned with the node. Defaults to `true`, otherwise the mouse coordinates are used.
		 * @name $.jstree.defaults.contextmenu.show_at_node
		 * @plugin contextmenu
		 */
		show_at_node : true,
		/**
		 * an object of actions, or a function that accepts a node and a callback function and calls the callback function with an object of actions available for that node (you can also return the items too).
		 *
		 * Each action consists of a key (a unique name) and a value which is an object with the following properties (only label and action are required). Once a menu item is activated the `action` function will be invoked with an object containing the following keys: item - the contextmenu item definition as seen below, reference - the DOM node that was used (the tree node), element - the contextmenu DOM element, position - an object with x/y properties indicating the position of the menu.
		 *
		 * * `separator_before` - a boolean indicating if there should be a separator before this item
		 * * `separator_after` - a boolean indicating if there should be a separator after this item
		 * * `_disabled` - a boolean indicating if this action should be disabled
		 * * `label` - a string - the name of the action (could be a function returning a string)
		 * * `title` - a string - an optional tooltip for the item
		 * * `action` - a function to be executed if this item is chosen, the function will receive 
		 * * `icon` - a string, can be a path to an icon or a className, if using an image that is in the current directory use a `./` prefix, otherwise it will be detected as a class
		 * * `shortcut` - keyCode which will trigger the action if the menu is open (for example `113` for rename, which equals F2)
		 * * `shortcut_label` - shortcut label (like for example `F2` for rename)
		 * * `submenu` - an object with the same structure as $.jstree.defaults.contextmenu.items which can be used to create a submenu - each key will be rendered as a separate option in a submenu that will appear once the current item is hovered
		 *
		 * @name $.jstree.defaults.contextmenu.items
		 * @plugin contextmenu
		 */
		items : function (o, cb) { // Could be an object directly
			return {
				"create" : {
					"separator_before"	: false,
					"separator_after"	: true,
					"_disabled"			: false, //(this.check("create_node", data.reference, {}, "last")),
					"label"				: "Create",
					"action"			: function (data) {
						var inst = $.jstree.reference(data.reference),
							obj = inst.get_node(data.reference);
						inst.create_node(obj, {}, "last", function (new_node) {
							try {
								inst.edit(new_node);
							} catch (ex) {
								setTimeout(function () { inst.edit(new_node); },0);
							}
						});
					}
				},
				"rename" : {
					"separator_before"	: false,
					"separator_after"	: false,
					"_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
					"label"				: "Rename",
					/*!
					"shortcut"			: 113,
					"shortcut_label"	: 'F2',
					"icon"				: "glyphicon glyphicon-leaf",
					*/
					"action"			: function (data) {
						var inst = $.jstree.reference(data.reference),
							obj = inst.get_node(data.reference);
						inst.edit(obj);
					}
				},
				"remove" : {
					"separator_before"	: false,
					"icon"				: false,
					"separator_after"	: false,
					"_disabled"			: false, //(this.check("delete_node", data.reference, this.get_parent(data.reference), "")),
					"label"				: "Delete",
					"action"			: function (data) {
						var inst = $.jstree.reference(data.reference),
							obj = inst.get_node(data.reference);
						if(inst.is_selected(obj)) {
							inst.delete_node(inst.get_selected());
						}
						else {
							inst.delete_node(obj);
						}
					}
				},
				"ccp" : {
					"separator_before"	: true,
					"icon"				: false,
					"separator_after"	: false,
					"label"				: "Edit",
					"action"			: false,
					"submenu" : {
						"cut" : {
							"separator_before"	: false,
							"separator_after"	: false,
							"label"				: "Cut",
							"action"			: function (data) {
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								if(inst.is_selected(obj)) {
									inst.cut(inst.get_top_selected());
								}
								else {
									inst.cut(obj);
								}
							}
						},
						"copy" : {
							"separator_before"	: false,
							"icon"				: false,
							"separator_after"	: false,
							"label"				: "Copy",
							"action"			: function (data) {
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								if(inst.is_selected(obj)) {
									inst.copy(inst.get_top_selected());
								}
								else {
									inst.copy(obj);
								}
							}
						},
						"paste" : {
							"separator_before"	: false,
							"icon"				: false,
							"_disabled"			: function (data) {
								return !$.jstree.reference(data.reference).can_paste();
							},
							"separator_after"	: false,
							"label"				: "Paste",
							"action"			: function (data) {
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								inst.paste(obj);
							}
						}
					}
				}
			};
		}
	};

	$.jstree.plugins.contextmenu = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			var last_ts = 0, cto = null, ex, ey;
			this.element
				.on("init.jstree loading.jstree ready.jstree", $.proxy(function () {
						this.get_container_ul().addClass('jstree-contextmenu');
					}, this))
				.on("contextmenu.jstree", ".jstree-anchor", $.proxy(function (e, data) {
						if (e.target.tagName.toLowerCase() === 'input') {
							return;
						}
						e.preventDefault();
						last_ts = e.ctrlKey ? +new Date() : 0;
						if(data || cto) {
							last_ts = (+new Date()) + 10000;
						}
						if(cto) {
							clearTimeout(cto);
						}
						if(!this.is_loading(e.currentTarget)) {
							this.show_contextmenu(e.currentTarget, e.pageX, e.pageY, e);
						}
					}, this))
				.on("click.jstree", ".jstree-anchor", $.proxy(function (e) {
						if(this._data.contextmenu.visible && (!last_ts || (+new Date()) - last_ts > 250)) { // work around safari & macOS ctrl+click
							$.vakata.context.hide();
						}
						last_ts = 0;
					}, this))
				.on("touchstart.jstree", ".jstree-anchor", function (e) {
						if(!e.originalEvent || !e.originalEvent.changedTouches || !e.originalEvent.changedTouches[0]) {
							return;
						}
						ex = e.originalEvent.changedTouches[0].clientX;
						ey = e.originalEvent.changedTouches[0].clientY;
						cto = setTimeout(function () {
							$(e.currentTarget).trigger('contextmenu', true);
						}, 750);
					})
				.on('touchmove.vakata.jstree', function (e) {
						if(cto && e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0] && (Math.abs(ex - e.originalEvent.changedTouches[0].clientX) > 10 || Math.abs(ey - e.originalEvent.changedTouches[0].clientY) > 10)) {
							clearTimeout(cto);
							$.vakata.context.hide();
						}
					})
				.on('touchend.vakata.jstree', function (e) {
						if(cto) {
							clearTimeout(cto);
						}
					});

			/*!
			if(!('oncontextmenu' in document.body) && ('ontouchstart' in document.body)) {
				var el = null, tm = null;
				this.element
					.on("touchstart", ".jstree-anchor", function (e) {
						el = e.currentTarget;
						tm = +new Date();
						$(document).one("touchend", function (e) {
							e.target = document.elementFromPoint(e.originalEvent.targetTouches[0].pageX - window.pageXOffset, e.originalEvent.targetTouches[0].pageY - window.pageYOffset);
							e.currentTarget = e.target;
							tm = ((+(new Date())) - tm);
							if(e.target === el && tm > 600 && tm < 1000) {
								e.preventDefault();
								$(el).trigger('contextmenu', e);
							}
							el = null;
							tm = null;
						});
					});
			}
			*/
			$(document).on("context_hide.vakata.jstree", $.proxy(function (e, data) {
				this._data.contextmenu.visible = false;
				$(data.reference).removeClass('jstree-context');
			}, this));
		};
		this.teardown = function () {
			if(this._data.contextmenu.visible) {
				$.vakata.context.hide();
			}
			parent.teardown.call(this);
		};

		/**
		 * prepare and show the context menu for a node
		 * @name show_contextmenu(obj [, x, y])
		 * @param {mixed} obj the node
		 * @param {Number} x the x-coordinate relative to the document to show the menu at
		 * @param {Number} y the y-coordinate relative to the document to show the menu at
		 * @param {Object} e the event if available that triggered the contextmenu
		 * @plugin contextmenu
		 * @trigger show_contextmenu.jstree
		 */
		this.show_contextmenu = function (obj, x, y, e) {
			obj = this.get_node(obj);
			if(!obj || obj.id === $.jstree.root) { return false; }
			var s = this.settings.contextmenu,
				d = this.get_node(obj, true),
				a = d.children(".jstree-anchor"),
				o = false,
				i = false;
			if(s.show_at_node || x === undefined || y === undefined) {
				o = a.offset();
				x = o.left;
				y = o.top + this._data.core.li_height;
			}
			if(this.settings.contextmenu.select_node && !this.is_selected(obj)) {
				this.activate_node(obj, e);
			}

			i = s.items;
			if($.isFunction(i)) {
				i = i.call(this, obj, $.proxy(function (i) {
					this._show_contextmenu(obj, x, y, i);
				}, this));
			}
			if($.isPlainObject(i)) {
				this._show_contextmenu(obj, x, y, i);
			}
		};
		/**
		 * show the prepared context menu for a node
		 * @name _show_contextmenu(obj, x, y, i)
		 * @param {mixed} obj the node
		 * @param {Number} x the x-coordinate relative to the document to show the menu at
		 * @param {Number} y the y-coordinate relative to the document to show the menu at
		 * @param {Number} i the object of items to show
		 * @plugin contextmenu
		 * @trigger show_contextmenu.jstree
		 * @private
		 */
		this._show_contextmenu = function (obj, x, y, i) {
			var d = this.get_node(obj, true),
				a = d.children(".jstree-anchor");
			$(document).one("context_show.vakata.jstree", $.proxy(function (e, data) {
				var cls = 'jstree-contextmenu jstree-' + this.get_theme() + '-contextmenu';
				$(data.element).addClass(cls);
				a.addClass('jstree-context');
			}, this));
			this._data.contextmenu.visible = true;
			$.vakata.context.show(a, { 'x' : x, 'y' : y }, i);
			/**
			 * triggered when the contextmenu is shown for a node
			 * @event
			 * @name show_contextmenu.jstree
			 * @param {Object} node the node
			 * @param {Number} x the x-coordinate of the menu relative to the document
			 * @param {Number} y the y-coordinate of the menu relative to the document
			 * @plugin contextmenu
			 */
			this.trigger('show_contextmenu', { "node" : obj, "x" : x, "y" : y });
		};
	};

	// contextmenu helper
	(function ($) {
		var right_to_left = false,
			vakata_context = {
				element		: false,
				reference	: false,
				position_x	: 0,
				position_y	: 0,
				items		: [],
				html		: "",
				is_visible	: false
			};

		$.vakata.context = {
			settings : {
				hide_onmouseleave	: 0,
				icons				: true
			},
			_trigger : function (event_name) {
				$(document).triggerHandler("context_" + event_name + ".vakata", {
					"reference"	: vakata_context.reference,
					"element"	: vakata_context.element,
					"position"	: {
						"x" : vakata_context.position_x,
						"y" : vakata_context.position_y
					}
				});
			},
			_execute : function (i) {
				i = vakata_context.items[i];
				return i && (!i._disabled || ($.isFunction(i._disabled) && !i._disabled({ "item" : i, "reference" : vakata_context.reference, "element" : vakata_context.element }))) && i.action ? i.action.call(null, {
							"item"		: i,
							"reference"	: vakata_context.reference,
							"element"	: vakata_context.element,
							"position"	: {
								"x" : vakata_context.position_x,
								"y" : vakata_context.position_y
							}
						}) : false;
			},
			_parse : function (o, is_callback) {
				if(!o) { return false; }
				if(!is_callback) {
					vakata_context.html		= "";
					vakata_context.items	= [];
				}
				var str = "",
					sep = false,
					tmp;

				if(is_callback) { str += "<"+"ul>"; }
				$.each(o, function (i, val) {
					if(!val) { return true; }
					vakata_context.items.push(val);
					if(!sep && val.separator_before) {
						str += "<"+"li class='vakata-context-separator'><"+"a href='#' " + ($.vakata.context.settings.icons ? '' : 'style="margin-left:0px;"') + ">&#160;<"+"/a><"+"/li>";
					}
					sep = false;
					str += "<"+"li class='" + (val._class || "") + (val._disabled === true || ($.isFunction(val._disabled) && val._disabled({ "item" : val, "reference" : vakata_context.reference, "element" : vakata_context.element })) ? " vakata-contextmenu-disabled " : "") + "' "+(val.shortcut?" data-shortcut='"+val.shortcut+"' ":'')+">";
					str += "<"+"a href='#' rel='" + (vakata_context.items.length - 1) + "' " + (val.title ? "title='" + val.title + "'" : "") + ">";
					if($.vakata.context.settings.icons) {
						str += "<"+"i ";
						if(val.icon) {
							if(val.icon.indexOf("/") !== -1 || val.icon.indexOf(".") !== -1) { str += " style='background:url(\"" + val.icon + "\") center center no-repeat' "; }
							else { str += " class='" + val.icon + "' "; }
						}
						str += "><"+"/i><"+"span class='vakata-contextmenu-sep'>&#160;<"+"/span>";
					}
					str += ($.isFunction(val.label) ? val.label({ "item" : i, "reference" : vakata_context.reference, "element" : vakata_context.element }) : val.label) + (val.shortcut?' <span class="vakata-contextmenu-shortcut vakata-contextmenu-shortcut-'+val.shortcut+'">'+ (val.shortcut_label || '') +'</span>':'') + "<"+"/a>";
					if(val.submenu) {
						tmp = $.vakata.context._parse(val.submenu, true);
						if(tmp) { str += tmp; }
					}
					str += "<"+"/li>";
					if(val.separator_after) {
						str += "<"+"li class='vakata-context-separator'><"+"a href='#' " + ($.vakata.context.settings.icons ? '' : 'style="margin-left:0px;"') + ">&#160;<"+"/a><"+"/li>";
						sep = true;
					}
				});
				str  = str.replace(/<li class\='vakata-context-separator'\><\/li\>$/,"");
				if(is_callback) { str += "</ul>"; }
				/**
				 * triggered on the document when the contextmenu is parsed (HTML is built)
				 * @event
				 * @plugin contextmenu
				 * @name context_parse.vakata
				 * @param {jQuery} reference the element that was right clicked
				 * @param {jQuery} element the DOM element of the menu itself
				 * @param {Object} position the x & y coordinates of the menu
				 */
				if(!is_callback) { vakata_context.html = str; $.vakata.context._trigger("parse"); }
				return str.length > 10 ? str : false;
			},
			_show_submenu : function (o) {
				o = $(o);
				if(!o.length || !o.children("ul").length) { return; }
				var e = o.children("ul"),
					xl = o.offset().left,
					x = xl + o.outerWidth(),
					y = o.offset().top,
					w = e.width(),
					h = e.height(),
					dw = $(window).width() + $(window).scrollLeft(),
					dh = $(window).height() + $(window).scrollTop();
				// може да се спести е една проверка - дали няма някой от класовете вече нагоре
				if(right_to_left) {
					o[x - (w + 10 + o.outerWidth()) < 0 ? "addClass" : "removeClass"]("vakata-context-left");
				}
				else {
					o[x + w > dw  && xl > dw - x ? "addClass" : "removeClass"]("vakata-context-right");
				}
				if(y + h + 10 > dh) {
					e.css("bottom","-1px");
				}

				//if does not fit - stick it to the side
				if (o.hasClass('vakata-context-right')) {
					if (xl < w) {
						e.css("margin-right", xl - w);
					}
				} else {
					if (dw - x < w) {
						e.css("margin-left", dw - x - w);
					}
				}

				e.show();
			},
			show : function (reference, position, data) {
				var o, e, x, y, w, h, dw, dh, cond = true;
				if(vakata_context.element && vakata_context.element.length) {
					vakata_context.element.width('');
				}
				switch(cond) {
					case (!position && !reference):
						return false;
					case (!!position && !!reference):
						vakata_context.reference	= reference;
						vakata_context.position_x	= position.x;
						vakata_context.position_y	= position.y;
						break;
					case (!position && !!reference):
						vakata_context.reference	= reference;
						o = reference.offset();
						vakata_context.position_x	= o.left + reference.outerHeight();
						vakata_context.position_y	= o.top;
						break;
					case (!!position && !reference):
						vakata_context.position_x	= position.x;
						vakata_context.position_y	= position.y;
						break;
				}
				if(!!reference && !data && $(reference).data('vakata_contextmenu')) {
					data = $(reference).data('vakata_contextmenu');
				}
				if($.vakata.context._parse(data)) {
					vakata_context.element.html(vakata_context.html);
				}
				if(vakata_context.items.length) {
					vakata_context.element.appendTo(document.body);
					e = vakata_context.element;
					x = vakata_context.position_x;
					y = vakata_context.position_y;
					w = e.width();
					h = e.height();
					dw = $(window).width() + $(window).scrollLeft();
					dh = $(window).height() + $(window).scrollTop();
					if(right_to_left) {
						x -= (e.outerWidth() - $(reference).outerWidth());
						if(x < $(window).scrollLeft() + 20) {
							x = $(window).scrollLeft() + 20;
						}
					}
					if(x + w + 20 > dw) {
						x = dw - (w + 20);
					}
					if(y + h + 20 > dh) {
						y = dh - (h + 20);
					}

					vakata_context.element
						.css({ "left" : x, "top" : y })
						.show()
						.find('a').first().focus().parent().addClass("vakata-context-hover");
					vakata_context.is_visible = true;
					/**
					 * triggered on the document when the contextmenu is shown
					 * @event
					 * @plugin contextmenu
					 * @name context_show.vakata
					 * @param {jQuery} reference the element that was right clicked
					 * @param {jQuery} element the DOM element of the menu itself
					 * @param {Object} position the x & y coordinates of the menu
					 */
					$.vakata.context._trigger("show");
				}
			},
			hide : function () {
				if(vakata_context.is_visible) {
					vakata_context.element.hide().find("ul").hide().end().find(':focus').blur().end().detach();
					vakata_context.is_visible = false;
					/**
					 * triggered on the document when the contextmenu is hidden
					 * @event
					 * @plugin contextmenu
					 * @name context_hide.vakata
					 * @param {jQuery} reference the element that was right clicked
					 * @param {jQuery} element the DOM element of the menu itself
					 * @param {Object} position the x & y coordinates of the menu
					 */
					$.vakata.context._trigger("hide");
				}
			}
		};
		$(function () {
			right_to_left = $(document.body).css("direction") === "rtl";
			var to = false;

			vakata_context.element = $("<ul class='vakata-context'></ul>");
			vakata_context.element
				.on("mouseenter", "li", function (e) {
					e.stopImmediatePropagation();

					if($.contains(this, e.relatedTarget)) {
						// премахнато заради delegate mouseleave по-долу
						// $(this).find(".vakata-context-hover").removeClass("vakata-context-hover");
						return;
					}

					if(to) { clearTimeout(to); }
					vakata_context.element.find(".vakata-context-hover").removeClass("vakata-context-hover").end();

					$(this)
						.siblings().find("ul").hide().end().end()
						.parentsUntil(".vakata-context", "li").addBack().addClass("vakata-context-hover");
					$.vakata.context._show_submenu(this);
				})
				// тестово - дали не натоварва?
				.on("mouseleave", "li", function (e) {
					if($.contains(this, e.relatedTarget)) { return; }
					$(this).find(".vakata-context-hover").addBack().removeClass("vakata-context-hover");
				})
				.on("mouseleave", function (e) {
					$(this).find(".vakata-context-hover").removeClass("vakata-context-hover");
					if($.vakata.context.settings.hide_onmouseleave) {
						to = setTimeout(
							(function (t) {
								return function () { $.vakata.context.hide(); };
							}(this)), $.vakata.context.settings.hide_onmouseleave);
					}
				})
				.on("click", "a", function (e) {
					e.preventDefault();
				//})
				//.on("mouseup", "a", function (e) {
					if(!$(this).blur().parent().hasClass("vakata-context-disabled") && $.vakata.context._execute($(this).attr("rel")) !== false) {
						$.vakata.context.hide();
					}
				})
				.on('keydown', 'a', function (e) {
						var o = null;
						switch(e.which) {
							case 13:
							case 32:
								e.type = "click";
								e.preventDefault();
								$(e.currentTarget).trigger(e);
								break;
							case 37:
								if(vakata_context.is_visible) {
									vakata_context.element.find(".vakata-context-hover").last().closest("li").first().find("ul").hide().find(".vakata-context-hover").removeClass("vakata-context-hover").end().end().children('a').focus();
									e.stopImmediatePropagation();
									e.preventDefault();
								}
								break;
							case 38:
								if(vakata_context.is_visible) {
									o = vakata_context.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").prevAll("li:not(.vakata-context-separator)").first();
									if(!o.length) { o = vakata_context.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").last(); }
									o.addClass("vakata-context-hover").children('a').focus();
									e.stopImmediatePropagation();
									e.preventDefault();
								}
								break;
							case 39:
								if(vakata_context.is_visible) {
									vakata_context.element.find(".vakata-context-hover").last().children("ul").show().children("li:not(.vakata-context-separator)").removeClass("vakata-context-hover").first().addClass("vakata-context-hover").children('a').focus();
									e.stopImmediatePropagation();
									e.preventDefault();
								}
								break;
							case 40:
								if(vakata_context.is_visible) {
									o = vakata_context.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").nextAll("li:not(.vakata-context-separator)").first();
									if(!o.length) { o = vakata_context.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").first(); }
									o.addClass("vakata-context-hover").children('a').focus();
									e.stopImmediatePropagation();
									e.preventDefault();
								}
								break;
							case 27:
								$.vakata.context.hide();
								e.preventDefault();
								break;
							default:
								//console.log(e.which);
								break;
						}
					})
				.on('keydown', function (e) {
					e.preventDefault();
					var a = vakata_context.element.find('.vakata-contextmenu-shortcut-' + e.which).parent();
					if(a.parent().not('.vakata-context-disabled')) {
						a.click();
					}
				});

			$(document)
				.on("mousedown.vakata.jstree", function (e) {
					if(vakata_context.is_visible && vakata_context.element[0] !== e.target  && !$.contains(vakata_context.element[0], e.target)) {
						$.vakata.context.hide();
					}
				})
				.on("context_show.vakata.jstree", function (e, data) {
					vakata_context.element.find("li:has(ul)").children("a").addClass("vakata-context-parent");
					if(right_to_left) {
						vakata_context.element.addClass("vakata-context-rtl").css("direction", "rtl");
					}
					// also apply a RTL class?
					vakata_context.element.find("ul").hide().end();
				});
		});
	}($));
	// $.jstree.defaults.plugins.push("contextmenu");


/**
 * ### Drag'n'drop plugin
 *
 * Enables dragging and dropping of nodes in the tree, resulting in a move or copy operations.
 */

	/**
	 * stores all defaults for the drag'n'drop plugin
	 * @name $.jstree.defaults.dnd
	 * @plugin dnd
	 */
	$.jstree.defaults.dnd = {
		/**
		 * a boolean indicating if a copy should be possible while dragging (by pressint the meta key or Ctrl). Defaults to `true`.
		 * @name $.jstree.defaults.dnd.copy
		 * @plugin dnd
		 */
		copy : true,
		/**
		 * a number indicating how long a node should remain hovered while dragging to be opened. Defaults to `500`.
		 * @name $.jstree.defaults.dnd.open_timeout
		 * @plugin dnd
		 */
		open_timeout : 500,
		/**
		 * a function invoked each time a node is about to be dragged, invoked in the tree's scope and receives the nodes about to be dragged as an argument (array) and the event that started the drag - return `false` to prevent dragging
		 * @name $.jstree.defaults.dnd.is_draggable
		 * @plugin dnd
		 */
		is_draggable : true,
		/**
		 * a boolean indicating if checks should constantly be made while the user is dragging the node (as opposed to checking only on drop), default is `true`
		 * @name $.jstree.defaults.dnd.check_while_dragging
		 * @plugin dnd
		 */
		check_while_dragging : true,
		/**
		 * a boolean indicating if nodes from this tree should only be copied with dnd (as opposed to moved), default is `false`
		 * @name $.jstree.defaults.dnd.always_copy
		 * @plugin dnd
		 */
		always_copy : false,
		/**
		 * when dropping a node "inside", this setting indicates the position the node should go to - it can be an integer or a string: "first" (same as 0) or "last", default is `0`
		 * @name $.jstree.defaults.dnd.inside_pos
		 * @plugin dnd
		 */
		inside_pos : 0,
		/**
		 * when starting the drag on a node that is selected this setting controls if all selected nodes are dragged or only the single node, default is `true`, which means all selected nodes are dragged when the drag is started on a selected node
		 * @name $.jstree.defaults.dnd.drag_selection
		 * @plugin dnd
		 */
		drag_selection : true,
		/**
		 * controls whether dnd works on touch devices. If left as boolean true dnd will work the same as in desktop browsers, which in some cases may impair scrolling. If set to boolean false dnd will not work on touch devices. There is a special third option - string "selected" which means only selected nodes can be dragged on touch devices.
		 * @name $.jstree.defaults.dnd.touch
		 * @plugin dnd
		 */
		touch : true,
		/**
		 * controls whether items can be dropped anywhere on the node, not just on the anchor, by default only the node anchor is a valid drop target. Works best with the wholerow plugin. If enabled on mobile depending on the interface it might be hard for the user to cancel the drop, since the whole tree container will be a valid drop target.
		 * @name $.jstree.defaults.dnd.large_drop_target
		 * @plugin dnd
		 */
		large_drop_target : false,
		/**
		 * controls whether a drag can be initiated from any part of the node and not just the text/icon part, works best with the wholerow plugin. Keep in mind it can cause problems with tree scrolling on mobile depending on the interface - in that case set the touch option to "selected".
		 * @name $.jstree.defaults.dnd.large_drag_target
		 * @plugin dnd
		 */
		large_drag_target : false,
		/**
		 * controls whether use HTML5 dnd api instead of classical. That will allow better integration of dnd events with other HTML5 controls.
		 * @reference http://caniuse.com/#feat=dragndrop
		 * @name $.jstree.defaults.dnd.use_html5
		 * @plugin dnd
		 */
		use_html5: false
	};
	var drg, elm;
	// TODO: now check works by checking for each node individually, how about max_children, unique, etc?
	$.jstree.plugins.dnd = function (options, parent) {
		this.init = function (el, options) {
			parent.init.call(this, el, options);
			this.settings.dnd.use_html5 = this.settings.dnd.use_html5 && ('draggable' in document.createElement('span'));
		};
		this.bind = function () {
			parent.bind.call(this);

			this.element
				.on(this.settings.dnd.use_html5 ? 'dragstart.jstree' : 'mousedown.jstree touchstart.jstree', this.settings.dnd.large_drag_target ? '.jstree-node' : '.jstree-anchor', $.proxy(function (e) {
						if(this.settings.dnd.large_drag_target && $(e.target).closest('.jstree-node')[0] !== e.currentTarget) {
							return true;
						}
						if(e.type === "touchstart" && (!this.settings.dnd.touch || (this.settings.dnd.touch === 'selected' && !$(e.currentTarget).closest('.jstree-node').children('.jstree-anchor').hasClass('jstree-clicked')))) {
							return true;
						}
						var obj = this.get_node(e.target),
							mlt = this.is_selected(obj) && this.settings.dnd.drag_selection ? this.get_top_selected().length : 1,
							txt = (mlt > 1 ? mlt + ' ' + this.get_string('nodes') : this.get_text(e.currentTarget));
						if(this.settings.core.force_text) {
							txt = $.vakata.html.escape(txt);
						}
						if(obj && obj.id && obj.id !== $.jstree.root && (e.which === 1 || e.type === "touchstart" || e.type === "dragstart") &&
							(this.settings.dnd.is_draggable === true || ($.isFunction(this.settings.dnd.is_draggable) && this.settings.dnd.is_draggable.call(this, (mlt > 1 ? this.get_top_selected(true) : [obj]), e)))
						) {
							drg = { 'jstree' : true, 'origin' : this, 'obj' : this.get_node(obj,true), 'nodes' : mlt > 1 ? this.get_top_selected() : [obj.id] };
							elm = e.currentTarget;
							if (this.settings.dnd.use_html5) {
								$.vakata.dnd._trigger('start', e, { 'helper': $(), 'element': elm, 'data': drg });
							} else {
								this.element.trigger('mousedown.jstree');
								return $.vakata.dnd.start(e, drg, '<div id="jstree-dnd" class="jstree-' + this.get_theme() + ' jstree-' + this.get_theme() + '-' + this.get_theme_variant() + ' ' + ( this.settings.core.themes.responsive ? ' jstree-dnd-responsive' : '' ) + '"><i class="jstree-icon jstree-er"></i>' + txt + '<ins class="jstree-copy" style="display:none;">+</ins></div>');
							}
						}
					}, this));
			if (this.settings.dnd.use_html5) {
				this.element
					.on('dragover.jstree', function (e) {
							e.preventDefault();
							$.vakata.dnd._trigger('move', e, { 'helper': $(), 'element': elm, 'data': drg });
							return false;
						})
					//.on('dragenter.jstree', this.settings.dnd.large_drop_target ? '.jstree-node' : '.jstree-anchor', $.proxy(function (e) {
					//		e.preventDefault();
					//		$.vakata.dnd._trigger('move', e, { 'helper': $(), 'element': elm, 'data': drg });
					//		return false;
					//	}, this))
					.on('drop.jstree', $.proxy(function (e) {
							e.preventDefault();
							$.vakata.dnd._trigger('stop', e, { 'helper': $(), 'element': elm, 'data': drg });
							return false;
						}, this));
			}
		};
		this.redraw_node = function(obj, deep, callback, force_render) {
			obj = parent.redraw_node.apply(this, arguments);
			if (obj && this.settings.dnd.use_html5) {
				if (this.settings.dnd.large_drag_target) {
					obj.setAttribute('draggable', true);
				} else {
					var i, j, tmp = null;
					for(i = 0, j = obj.childNodes.length; i < j; i++) {
						if(obj.childNodes[i] && obj.childNodes[i].className && obj.childNodes[i].className.indexOf("jstree-anchor") !== -1) {
							tmp = obj.childNodes[i];
							break;
						}
					}
					if(tmp) {
						tmp.setAttribute('draggable', true);
					}
				}
			}
			return obj;
		};
	};

	$(function() {
		// bind only once for all instances
		var lastmv = false,
			laster = false,
			lastev = false,
			opento = false,
			marker = $('<div id="jstree-marker">&#160;</div>').hide(); //.appendTo('body');

		$(document)
			.on('dragover.vakata.jstree', function (e) {
				if (elm) {
					$.vakata.dnd._trigger('move', e, { 'helper': $(), 'element': elm, 'data': drg });
				}
			})
			.on('drop.vakata.jstree', function (e) {
				if (elm) {
					$.vakata.dnd._trigger('stop', e, { 'helper': $(), 'element': elm, 'data': drg });
					elm = null;
					drg = null;
				}
			})
			.on('dnd_start.vakata.jstree', function (e, data) {
				lastmv = false;
				lastev = false;
				if(!data || !data.data || !data.data.jstree) { return; }
				marker.appendTo(document.body); //.show();
			})
			.on('dnd_move.vakata.jstree', function (e, data) {
				var isDifferentNode = data.event.target !== lastev.target;
				if(opento) {
					if (!data.event || data.event.type !== 'dragover' || isDifferentNode) {
						clearTimeout(opento);
					}
				}
				if(!data || !data.data || !data.data.jstree) { return; }

				// if we are hovering the marker image do nothing (can happen on "inside" drags)
				if(data.event.target.id && data.event.target.id === 'jstree-marker') {
					return;
				}
				lastev = data.event;

				var ins = $.jstree.reference(data.event.target),
					ref = false,
					off = false,
					rel = false,
					tmp, l, t, h, p, i, o, ok, t1, t2, op, ps, pr, ip, tm, is_copy, pn;
				// if we are over an instance
				if(ins && ins._data && ins._data.dnd) {
					marker.attr('class', 'jstree-' + ins.get_theme() + ( ins.settings.core.themes.responsive ? ' jstree-dnd-responsive' : '' ));
					is_copy = data.data.origin && (data.data.origin.settings.dnd.always_copy || (data.data.origin.settings.dnd.copy && (data.event.metaKey || data.event.ctrlKey)));
					data.helper
						.children().attr('class', 'jstree-' + ins.get_theme() + ' jstree-' + ins.get_theme() + '-' + ins.get_theme_variant() + ' ' + ( ins.settings.core.themes.responsive ? ' jstree-dnd-responsive' : '' ))
						.find('.jstree-copy').first()[ is_copy ? 'show' : 'hide' ]();

					// if are hovering the container itself add a new root node
					//console.log(data.event);
					if( (data.event.target === ins.element[0] || data.event.target === ins.get_container_ul()[0]) && ins.get_container_ul().children().length === 0) {
						ok = true;
						for(t1 = 0, t2 = data.data.nodes.length; t1 < t2; t1++) {
							ok = ok && ins.check( (data.data.origin && (data.data.origin.settings.dnd.always_copy || (data.data.origin.settings.dnd.copy && (data.event.metaKey || data.event.ctrlKey)) ) ? "copy_node" : "move_node"), (data.data.origin && data.data.origin !== ins ? data.data.origin.get_node(data.data.nodes[t1]) : data.data.nodes[t1]), $.jstree.root, 'last', { 'dnd' : true, 'ref' : ins.get_node($.jstree.root), 'pos' : 'i', 'origin' : data.data.origin, 'is_multi' : (data.data.origin && data.data.origin !== ins), 'is_foreign' : (!data.data.origin) });
							if(!ok) { break; }
						}
						if(ok) {
							lastmv = { 'ins' : ins, 'par' : $.jstree.root, 'pos' : 'last' };
							marker.hide();
							data.helper.find('.jstree-icon').first().removeClass('jstree-er').addClass('jstree-ok');
							if (data.event.originalEvent && data.event.originalEvent.dataTransfer) {
								data.event.originalEvent.dataTransfer.dropEffect = is_copy ? 'copy' : 'move';
							}
							return;
						}
					}
					else {
						// if we are hovering a tree node
						ref = ins.settings.dnd.large_drop_target ? $(data.event.target).closest('.jstree-node').children('.jstree-anchor') : $(data.event.target).closest('.jstree-anchor');
						if(ref && ref.length && ref.parent().is('.jstree-closed, .jstree-open, .jstree-leaf')) {
							off = ref.offset();
							rel = (data.event.pageY !== undefined ? data.event.pageY : data.event.originalEvent.pageY) - off.top;
							h = ref.outerHeight();
							if(rel < h / 3) {
								o = ['b', 'i', 'a'];
							}
							else if(rel > h - h / 3) {
								o = ['a', 'i', 'b'];
							}
							else {
								o = rel > h / 2 ? ['i', 'a', 'b'] : ['i', 'b', 'a'];
							}
							$.each(o, function (j, v) {
								switch(v) {
									case 'b':
										l = off.left - 6;
										t = off.top;
										p = ins.get_parent(ref);
										i = ref.parent().index();
										break;
									case 'i':
										ip = ins.settings.dnd.inside_pos;
										tm = ins.get_node(ref.parent());
										l = off.left - 2;
										t = off.top + h / 2 + 1;
										p = tm.id;
										i = ip === 'first' ? 0 : (ip === 'last' ? tm.children.length : Math.min(ip, tm.children.length));
										break;
									case 'a':
										l = off.left - 6;
										t = off.top + h;
										p = ins.get_parent(ref);
										i = ref.parent().index() + 1;
										break;
								}
								ok = true;
								for(t1 = 0, t2 = data.data.nodes.length; t1 < t2; t1++) {
									op = data.data.origin && (data.data.origin.settings.dnd.always_copy || (data.data.origin.settings.dnd.copy && (data.event.metaKey || data.event.ctrlKey))) ? "copy_node" : "move_node";
									ps = i;
									if(op === "move_node" && v === 'a' && (data.data.origin && data.data.origin === ins) && p === ins.get_parent(data.data.nodes[t1])) {
										pr = ins.get_node(p);
										if(ps > $.inArray(data.data.nodes[t1], pr.children)) {
											ps -= 1;
										}
									}
									ok = ok && ( (ins && ins.settings && ins.settings.dnd && ins.settings.dnd.check_while_dragging === false) || ins.check(op, (data.data.origin && data.data.origin !== ins ? data.data.origin.get_node(data.data.nodes[t1]) : data.data.nodes[t1]), p, ps, { 'dnd' : true, 'ref' : ins.get_node(ref.parent()), 'pos' : v, 'origin' : data.data.origin, 'is_multi' : (data.data.origin && data.data.origin !== ins), 'is_foreign' : (!data.data.origin) }) );
									if(!ok) {
										if(ins && ins.last_error) { laster = ins.last_error(); }
										break;
									}
								}
								if(v === 'i' && ref.parent().is('.jstree-closed') && ins.settings.dnd.open_timeout) {
									if (!data.event || data.event.type !== 'dragover' || isDifferentNode) {
										if (opento) { clearTimeout(opento); }
										opento = setTimeout((function (x, z) { return function () { x.open_node(z); }; }(ins, ref)), ins.settings.dnd.open_timeout);
									}
								}
								if(ok) {
									pn = ins.get_node(p, true);
									if (!pn.hasClass('.jstree-dnd-parent')) {
										$('.jstree-dnd-parent').removeClass('jstree-dnd-parent');
										pn.addClass('jstree-dnd-parent');
									}
									lastmv = { 'ins' : ins, 'par' : p, 'pos' : v === 'i' && ip === 'last' && i === 0 && !ins.is_loaded(tm) ? 'last' : i };
									marker.css({ 'left' : l + 'px', 'top' : t + 'px' }).show();
									data.helper.find('.jstree-icon').first().removeClass('jstree-er').addClass('jstree-ok');
									if (data.event.originalEvent && data.event.originalEvent.dataTransfer) {
										data.event.originalEvent.dataTransfer.dropEffect = is_copy ? 'copy' : 'move';
									}
									laster = {};
									o = true;
									return false;
								}
							});
							if(o === true) { return; }
						}
					}
				}
				$('.jstree-dnd-parent').removeClass('jstree-dnd-parent');
				lastmv = false;
				data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
				if (data.event.originalEvent && data.event.originalEvent.dataTransfer) {
					//data.event.originalEvent.dataTransfer.dropEffect = 'none';
				}
				marker.hide();
			})
			.on('dnd_scroll.vakata.jstree', function (e, data) {
				if(!data || !data.data || !data.data.jstree) { return; }
				marker.hide();
				lastmv = false;
				lastev = false;
				data.helper.find('.jstree-icon').first().removeClass('jstree-ok').addClass('jstree-er');
			})
			.on('dnd_stop.vakata.jstree', function (e, data) {
				$('.jstree-dnd-parent').removeClass('jstree-dnd-parent');
				if(opento) { clearTimeout(opento); }
				if(!data || !data.data || !data.data.jstree) { return; }
				marker.hide().detach();
				var i, j, nodes = [];
				if(lastmv) {
					for(i = 0, j = data.data.nodes.length; i < j; i++) {
						nodes[i] = data.data.origin ? data.data.origin.get_node(data.data.nodes[i]) : data.data.nodes[i];
					}
					lastmv.ins[ data.data.origin && (data.data.origin.settings.dnd.always_copy || (data.data.origin.settings.dnd.copy && (data.event.metaKey || data.event.ctrlKey))) ? 'copy_node' : 'move_node' ](nodes, lastmv.par, lastmv.pos, false, false, false, data.data.origin);
				}
				else {
					i = $(data.event.target).closest('.jstree');
					if(i.length && laster && laster.error && laster.error === 'check') {
						i = i.jstree(true);
						if(i) {
							i.settings.core.error.call(this, laster);
						}
					}
				}
				lastev = false;
				lastmv = false;
			})
			.on('keyup.jstree keydown.jstree', function (e, data) {
				data = $.vakata.dnd._get();
				if(data && data.data && data.data.jstree) {
					if (e.type === "keyup" && e.which === 27) {
						if (opento) { clearTimeout(opento); }
						lastmv = false;
						laster = false;
						lastev = false;
						opento = false;
						marker.hide().detach();
						$.vakata.dnd._clean();
					} else {
						data.helper.find('.jstree-copy').first()[ data.data.origin && (data.data.origin.settings.dnd.always_copy || (data.data.origin.settings.dnd.copy && (e.metaKey || e.ctrlKey))) ? 'show' : 'hide' ]();
						if(lastev) {
							lastev.metaKey = e.metaKey;
							lastev.ctrlKey = e.ctrlKey;
							$.vakata.dnd._trigger('move', lastev);
						}
					}
				}
			});
	});

	// helpers
	(function ($) {
		$.vakata.html = {
			div : $('<div />'),
			escape : function (str) {
				return $.vakata.html.div.text(str).html();
			},
			strip : function (str) {
				return $.vakata.html.div.empty().append($.parseHTML(str)).text();
			}
		};
		// private variable
		var vakata_dnd = {
			element	: false,
			target	: false,
			is_down	: false,
			is_drag	: false,
			helper	: false,
			helper_w: 0,
			data	: false,
			init_x	: 0,
			init_y	: 0,
			scroll_l: 0,
			scroll_t: 0,
			scroll_e: false,
			scroll_i: false,
			is_touch: false
		};
		$.vakata.dnd = {
			settings : {
				scroll_speed		: 10,
				scroll_proximity	: 20,
				helper_left			: 5,
				helper_top			: 10,
				threshold			: 5,
				threshold_touch		: 10
			},
			_trigger : function (event_name, e, data) {
				if (data === undefined) {
					data = $.vakata.dnd._get();
				}
				data.event = e;
				$(document).triggerHandler("dnd_" + event_name + ".vakata", data);
			},
			_get : function () {
				return {
					"data"		: vakata_dnd.data,
					"element"	: vakata_dnd.element,
					"helper"	: vakata_dnd.helper
				};
			},
			_clean : function () {
				if(vakata_dnd.helper) { vakata_dnd.helper.remove(); }
				if(vakata_dnd.scroll_i) { clearInterval(vakata_dnd.scroll_i); vakata_dnd.scroll_i = false; }
				vakata_dnd = {
					element	: false,
					target	: false,
					is_down	: false,
					is_drag	: false,
					helper	: false,
					helper_w: 0,
					data	: false,
					init_x	: 0,
					init_y	: 0,
					scroll_l: 0,
					scroll_t: 0,
					scroll_e: false,
					scroll_i: false,
					is_touch: false
				};
				$(document).off("mousemove.vakata.jstree touchmove.vakata.jstree", $.vakata.dnd.drag);
				$(document).off("mouseup.vakata.jstree touchend.vakata.jstree", $.vakata.dnd.stop);
			},
			_scroll : function (init_only) {
				if(!vakata_dnd.scroll_e || (!vakata_dnd.scroll_l && !vakata_dnd.scroll_t)) {
					if(vakata_dnd.scroll_i) { clearInterval(vakata_dnd.scroll_i); vakata_dnd.scroll_i = false; }
					return false;
				}
				if(!vakata_dnd.scroll_i) {
					vakata_dnd.scroll_i = setInterval($.vakata.dnd._scroll, 100);
					return false;
				}
				if(init_only === true) { return false; }

				var i = vakata_dnd.scroll_e.scrollTop(),
					j = vakata_dnd.scroll_e.scrollLeft();
				vakata_dnd.scroll_e.scrollTop(i + vakata_dnd.scroll_t * $.vakata.dnd.settings.scroll_speed);
				vakata_dnd.scroll_e.scrollLeft(j + vakata_dnd.scroll_l * $.vakata.dnd.settings.scroll_speed);
				if(i !== vakata_dnd.scroll_e.scrollTop() || j !== vakata_dnd.scroll_e.scrollLeft()) {
					/**
					 * triggered on the document when a drag causes an element to scroll
					 * @event
					 * @plugin dnd
					 * @name dnd_scroll.vakata
					 * @param {Mixed} data any data supplied with the call to $.vakata.dnd.start
					 * @param {DOM} element the DOM element being dragged
					 * @param {jQuery} helper the helper shown next to the mouse
					 * @param {jQuery} event the element that is scrolling
					 */
					$.vakata.dnd._trigger("scroll", vakata_dnd.scroll_e);
				}
			},
			start : function (e, data, html) {
				if(e.type === "touchstart" && e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0]) {
					e.pageX = e.originalEvent.changedTouches[0].pageX;
					e.pageY = e.originalEvent.changedTouches[0].pageY;
					e.target = document.elementFromPoint(e.originalEvent.changedTouches[0].pageX - window.pageXOffset, e.originalEvent.changedTouches[0].pageY - window.pageYOffset);
				}
				if(vakata_dnd.is_drag) { $.vakata.dnd.stop({}); }
				try {
					e.currentTarget.unselectable = "on";
					e.currentTarget.onselectstart = function() { return false; };
					if(e.currentTarget.style) {
						e.currentTarget.style.touchAction = "none";
						e.currentTarget.style.msTouchAction = "none";
						e.currentTarget.style.MozUserSelect = "none";
					}
				} catch(ignore) { }
				vakata_dnd.init_x	= e.pageX;
				vakata_dnd.init_y	= e.pageY;
				vakata_dnd.data		= data;
				vakata_dnd.is_down	= true;
				vakata_dnd.element	= e.currentTarget;
				vakata_dnd.target	= e.target;
				vakata_dnd.is_touch	= e.type === "touchstart";
				if(html !== false) {
					vakata_dnd.helper = $("<div id='vakata-dnd'></div>").html(html).css({
						"display"		: "block",
						"margin"		: "0",
						"padding"		: "0",
						"position"		: "absolute",
						"top"			: "-2000px",
						"lineHeight"	: "16px",
						"zIndex"		: "10000"
					});
				}
				$(document).on("mousemove.vakata.jstree touchmove.vakata.jstree", $.vakata.dnd.drag);
				$(document).on("mouseup.vakata.jstree touchend.vakata.jstree", $.vakata.dnd.stop);
				return false;
			},
			drag : function (e) {
				if(e.type === "touchmove" && e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0]) {
					e.pageX = e.originalEvent.changedTouches[0].pageX;
					e.pageY = e.originalEvent.changedTouches[0].pageY;
					e.target = document.elementFromPoint(e.originalEvent.changedTouches[0].pageX - window.pageXOffset, e.originalEvent.changedTouches[0].pageY - window.pageYOffset);
				}
				if(!vakata_dnd.is_down) { return; }
				if(!vakata_dnd.is_drag) {
					if(
						Math.abs(e.pageX - vakata_dnd.init_x) > (vakata_dnd.is_touch ? $.vakata.dnd.settings.threshold_touch : $.vakata.dnd.settings.threshold) ||
						Math.abs(e.pageY - vakata_dnd.init_y) > (vakata_dnd.is_touch ? $.vakata.dnd.settings.threshold_touch : $.vakata.dnd.settings.threshold)
					) {
						if(vakata_dnd.helper) {
							vakata_dnd.helper.appendTo(document.body);
							vakata_dnd.helper_w = vakata_dnd.helper.outerWidth();
						}
						vakata_dnd.is_drag = true;
						$(vakata_dnd.target).one('click.vakata', false);
						/**
						 * triggered on the document when a drag starts
						 * @event
						 * @plugin dnd
						 * @name dnd_start.vakata
						 * @param {Mixed} data any data supplied with the call to $.vakata.dnd.start
						 * @param {DOM} element the DOM element being dragged
						 * @param {jQuery} helper the helper shown next to the mouse
						 * @param {Object} event the event that caused the start (probably mousemove)
						 */
						$.vakata.dnd._trigger("start", e);
					}
					else { return; }
				}

				var d  = false, w  = false,
					dh = false, wh = false,
					dw = false, ww = false,
					dt = false, dl = false,
					ht = false, hl = false;

				vakata_dnd.scroll_t = 0;
				vakata_dnd.scroll_l = 0;
				vakata_dnd.scroll_e = false;
				$($(e.target).parentsUntil("body").addBack().get().reverse())
					.filter(function () {
						return	(/^auto|scroll$/).test($(this).css("overflow")) &&
								(this.scrollHeight > this.offsetHeight || this.scrollWidth > this.offsetWidth);
					})
					.each(function () {
						var t = $(this), o = t.offset();
						if(this.scrollHeight > this.offsetHeight) {
							if(o.top + t.height() - e.pageY < $.vakata.dnd.settings.scroll_proximity)	{ vakata_dnd.scroll_t = 1; }
							if(e.pageY - o.top < $.vakata.dnd.settings.scroll_proximity)				{ vakata_dnd.scroll_t = -1; }
						}
						if(this.scrollWidth > this.offsetWidth) {
							if(o.left + t.width() - e.pageX < $.vakata.dnd.settings.scroll_proximity)	{ vakata_dnd.scroll_l = 1; }
							if(e.pageX - o.left < $.vakata.dnd.settings.scroll_proximity)				{ vakata_dnd.scroll_l = -1; }
						}
						if(vakata_dnd.scroll_t || vakata_dnd.scroll_l) {
							vakata_dnd.scroll_e = $(this);
							return false;
						}
					});

				if(!vakata_dnd.scroll_e) {
					d  = $(document); w = $(window);
					dh = d.height(); wh = w.height();
					dw = d.width(); ww = w.width();
					dt = d.scrollTop(); dl = d.scrollLeft();
					if(dh > wh && e.pageY - dt < $.vakata.dnd.settings.scroll_proximity)		{ vakata_dnd.scroll_t = -1;  }
					if(dh > wh && wh - (e.pageY - dt) < $.vakata.dnd.settings.scroll_proximity)	{ vakata_dnd.scroll_t = 1; }
					if(dw > ww && e.pageX - dl < $.vakata.dnd.settings.scroll_proximity)		{ vakata_dnd.scroll_l = -1; }
					if(dw > ww && ww - (e.pageX - dl) < $.vakata.dnd.settings.scroll_proximity)	{ vakata_dnd.scroll_l = 1; }
					if(vakata_dnd.scroll_t || vakata_dnd.scroll_l) {
						vakata_dnd.scroll_e = d;
					}
				}
				if(vakata_dnd.scroll_e) { $.vakata.dnd._scroll(true); }

				if(vakata_dnd.helper) {
					ht = parseInt(e.pageY + $.vakata.dnd.settings.helper_top, 10);
					hl = parseInt(e.pageX + $.vakata.dnd.settings.helper_left, 10);
					if(dh && ht + 25 > dh) { ht = dh - 50; }
					if(dw && hl + vakata_dnd.helper_w > dw) { hl = dw - (vakata_dnd.helper_w + 2); }
					vakata_dnd.helper.css({
						left	: hl + "px",
						top		: ht + "px"
					});
				}
				/**
				 * triggered on the document when a drag is in progress
				 * @event
				 * @plugin dnd
				 * @name dnd_move.vakata
				 * @param {Mixed} data any data supplied with the call to $.vakata.dnd.start
				 * @param {DOM} element the DOM element being dragged
				 * @param {jQuery} helper the helper shown next to the mouse
				 * @param {Object} event the event that caused this to trigger (most likely mousemove)
				 */
				$.vakata.dnd._trigger("move", e);
				return false;
			},
			stop : function (e) {
				if(e.type === "touchend" && e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0]) {
					e.pageX = e.originalEvent.changedTouches[0].pageX;
					e.pageY = e.originalEvent.changedTouches[0].pageY;
					e.target = document.elementFromPoint(e.originalEvent.changedTouches[0].pageX - window.pageXOffset, e.originalEvent.changedTouches[0].pageY - window.pageYOffset);
				}
				if(vakata_dnd.is_drag) {
					/**
					 * triggered on the document when a drag stops (the dragged element is dropped)
					 * @event
					 * @plugin dnd
					 * @name dnd_stop.vakata
					 * @param {Mixed} data any data supplied with the call to $.vakata.dnd.start
					 * @param {DOM} element the DOM element being dragged
					 * @param {jQuery} helper the helper shown next to the mouse
					 * @param {Object} event the event that caused the stop
					 */
					if (e.target !== vakata_dnd.target) {
						$(vakata_dnd.target).off('click.vakata');
					}
					$.vakata.dnd._trigger("stop", e);
				}
				else {
					if(e.type === "touchend" && e.target === vakata_dnd.target) {
						var to = setTimeout(function () { $(e.target).click(); }, 100);
						$(e.target).one('click', function() { if(to) { clearTimeout(to); } });
					}
				}
				$.vakata.dnd._clean();
				return false;
			}
		};
	}($));

	// include the dnd plugin by default
	// $.jstree.defaults.plugins.push("dnd");


/**
 * ### Massload plugin
 *
 * Adds massload functionality to jsTree, so that multiple nodes can be loaded in a single request (only useful with lazy loading).
 */

	/**
	 * massload configuration
	 *
	 * It is possible to set this to a standard jQuery-like AJAX config.
	 * In addition to the standard jQuery ajax options here you can supply functions for `data` and `url`, the functions will be run in the current instance's scope and a param will be passed indicating which node IDs need to be loaded, the return value of those functions will be used.
	 *
	 * You can also set this to a function, that function will receive the node IDs being loaded as argument and a second param which is a function (callback) which should be called with the result.
	 *
	 * Both the AJAX and the function approach rely on the same return value - an object where the keys are the node IDs, and the value is the children of that node as an array.
	 *
	 *	{
	 *		"id1" : [{ "text" : "Child of ID1", "id" : "c1" }, { "text" : "Another child of ID1", "id" : "c2" }],
	 *		"id2" : [{ "text" : "Child of ID2", "id" : "c3" }]
	 *	}
	 * 
	 * @name $.jstree.defaults.massload
	 * @plugin massload
	 */
	$.jstree.defaults.massload = null;
	$.jstree.plugins.massload = function (options, parent) {
		this.init = function (el, options) {
			this._data.massload = {};
			parent.init.call(this, el, options);
		};
		this._load_nodes = function (nodes, callback, is_callback, force_reload) {
			var s = this.settings.massload,
				nodesString = JSON.stringify(nodes),
				toLoad = [],
				m = this._model.data,
				i, j, dom;
			if (!is_callback) {
				for(i = 0, j = nodes.length; i < j; i++) {
					if(!m[nodes[i]] || ( (!m[nodes[i]].state.loaded && !m[nodes[i]].state.failed) || force_reload) ) {
						toLoad.push(nodes[i]);
						dom = this.get_node(nodes[i], true);
						if (dom && dom.length) {
							dom.addClass("jstree-loading").attr('aria-busy',true);
						}
					}
				}
				this._data.massload = {};
				if (toLoad.length) {
					if($.isFunction(s)) {
						return s.call(this, toLoad, $.proxy(function (data) {
							var i, j;
							if(data) {
								for(i in data) {
									if(data.hasOwnProperty(i)) {
										this._data.massload[i] = data[i];
									}
								}
							}
							for(i = 0, j = nodes.length; i < j; i++) {
								dom = this.get_node(nodes[i], true);
								if (dom && dom.length) {
									dom.removeClass("jstree-loading").attr('aria-busy',false);
								}
							}
							parent._load_nodes.call(this, nodes, callback, is_callback, force_reload);
						}, this));
					}
					if(typeof s === 'object' && s && s.url) {
						s = $.extend(true, {}, s);
						if($.isFunction(s.url)) {
							s.url = s.url.call(this, toLoad);
						}
						if($.isFunction(s.data)) {
							s.data = s.data.call(this, toLoad);
						}
						return $.ajax(s)
							.done($.proxy(function (data,t,x) {
									var i, j;
									if(data) {
										for(i in data) {
											if(data.hasOwnProperty(i)) {
												this._data.massload[i] = data[i];
											}
										}
									}
									for(i = 0, j = nodes.length; i < j; i++) {
										dom = this.get_node(nodes[i], true);
										if (dom && dom.length) {
											dom.removeClass("jstree-loading").attr('aria-busy',false);
										}
									}
									parent._load_nodes.call(this, nodes, callback, is_callback, force_reload);
								}, this))
							.fail($.proxy(function (f) {
									parent._load_nodes.call(this, nodes, callback, is_callback, force_reload);
								}, this));
					}
				}
			}
			return parent._load_nodes.call(this, nodes, callback, is_callback, force_reload);
		};
		this._load_node = function (obj, callback) {
			var data = this._data.massload[obj.id],
				rslt = null, dom;
			if(data) {
				rslt = this[typeof data === 'string' ? '_append_html_data' : '_append_json_data'](
					obj,
					typeof data === 'string' ? $($.parseHTML(data)).filter(function () { return this.nodeType !== 3; }) : data,
					function (status) { callback.call(this, status); }
				);
				dom = this.get_node(obj.id, true);
				if (dom && dom.length) {
					dom.removeClass("jstree-loading").attr('aria-busy',false);
				}
				delete this._data.massload[obj.id];
				return rslt;
			}
			return parent._load_node.call(this, obj, callback);
		};
	};

/**
 * ### Search plugin
 *
 * Adds search functionality to jsTree.
 */

	/**
	 * stores all defaults for the search plugin
	 * @name $.jstree.defaults.search
	 * @plugin search
	 */
	$.jstree.defaults.search = {
		/**
		 * a jQuery-like AJAX config, which jstree uses if a server should be queried for results.
		 *
		 * A `str` (which is the search string) parameter will be added with the request, an optional `inside` parameter will be added if the search is limited to a node id. The expected result is a JSON array with nodes that need to be opened so that matching nodes will be revealed.
		 * Leave this setting as `false` to not query the server. You can also set this to a function, which will be invoked in the instance's scope and receive 3 parameters - the search string, the callback to call with the array of nodes to load, and the optional node ID to limit the search to
		 * @name $.jstree.defaults.search.ajax
		 * @plugin search
		 */
		ajax : false,
		/**
		 * Indicates if the search should be fuzzy or not (should `chnd3` match `child node 3`). Default is `false`.
		 * @name $.jstree.defaults.search.fuzzy
		 * @plugin search
		 */
		fuzzy : false,
		/**
		 * Indicates if the search should be case sensitive. Default is `false`.
		 * @name $.jstree.defaults.search.case_sensitive
		 * @plugin search
		 */
		case_sensitive : false,
		/**
		 * Indicates if the tree should be filtered (by default) to show only matching nodes (keep in mind this can be a heavy on large trees in old browsers).
		 * This setting can be changed at runtime when calling the search method. Default is `false`.
		 * @name $.jstree.defaults.search.show_only_matches
		 * @plugin search
		 */
		show_only_matches : false,
		/**
		 * Indicates if the children of matched element are shown (when show_only_matches is true)
		 * This setting can be changed at runtime when calling the search method. Default is `false`.
		 * @name $.jstree.defaults.search.show_only_matches_children
		 * @plugin search
		 */
		show_only_matches_children : false,
		/**
		 * Indicates if all nodes opened to reveal the search result, should be closed when the search is cleared or a new search is performed. Default is `true`.
		 * @name $.jstree.defaults.search.close_opened_onclear
		 * @plugin search
		 */
		close_opened_onclear : true,
		/**
		 * Indicates if only leaf nodes should be included in search results. Default is `false`.
		 * @name $.jstree.defaults.search.search_leaves_only
		 * @plugin search
		 */
		search_leaves_only : false,
		/**
		 * If set to a function it wil be called in the instance's scope with two arguments - search string and node (where node will be every node in the structure, so use with caution).
		 * If the function returns a truthy value the node will be considered a match (it might not be displayed if search_only_leaves is set to true and the node is not a leaf). Default is `false`.
		 * @name $.jstree.defaults.search.search_callback
		 * @plugin search
		 */
		search_callback : false
	};

	$.jstree.plugins.search = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			this._data.search.str = "";
			this._data.search.dom = $();
			this._data.search.res = [];
			this._data.search.opn = [];
			this._data.search.som = false;
			this._data.search.smc = false;
			this._data.search.hdn = [];

			this.element
				.on("search.jstree", $.proxy(function (e, data) {
						if(this._data.search.som && data.res.length) {
							var m = this._model.data, i, j, p = [], k, l;
							for(i = 0, j = data.res.length; i < j; i++) {
								if(m[data.res[i]] && !m[data.res[i]].state.hidden) {
									p.push(data.res[i]);
									p = p.concat(m[data.res[i]].parents);
									if(this._data.search.smc) {
										for (k = 0, l = m[data.res[i]].children_d.length; k < l; k++) {
											if (m[m[data.res[i]].children_d[k]] && !m[m[data.res[i]].children_d[k]].state.hidden) {
												p.push(m[data.res[i]].children_d[k]);
											}
										}
									}
								}
							}
							p = $.vakata.array_remove_item($.vakata.array_unique(p), $.jstree.root);
							this._data.search.hdn = this.hide_all(true);
							this.show_node(p, true);
							this.redraw(true);
						}
					}, this))
				.on("clear_search.jstree", $.proxy(function (e, data) {
						if(this._data.search.som && data.res.length) {
							this.show_node(this._data.search.hdn, true);
							this.redraw(true);
						}
					}, this));
		};
		/**
		 * used to search the tree nodes for a given string
		 * @name search(str [, skip_async])
		 * @param {String} str the search string
		 * @param {Boolean} skip_async if set to true server will not be queried even if configured
		 * @param {Boolean} show_only_matches if set to true only matching nodes will be shown (keep in mind this can be very slow on large trees or old browsers)
		 * @param {mixed} inside an optional node to whose children to limit the search
		 * @param {Boolean} append if set to true the results of this search are appended to the previous search
		 * @plugin search
		 * @trigger search.jstree
		 */
		this.search = function (str, skip_async, show_only_matches, inside, append, show_only_matches_children) {
			if(str === false || $.trim(str.toString()) === "") {
				return this.clear_search();
			}
			inside = this.get_node(inside);
			inside = inside && inside.id ? inside.id : null;
			str = str.toString();
			var s = this.settings.search,
				a = s.ajax ? s.ajax : false,
				m = this._model.data,
				f = null,
				r = [],
				p = [], i, j;
			if(this._data.search.res.length && !append) {
				this.clear_search();
			}
			if(show_only_matches === undefined) {
				show_only_matches = s.show_only_matches;
			}
			if(show_only_matches_children === undefined) {
				show_only_matches_children = s.show_only_matches_children;
			}
			if(!skip_async && a !== false) {
				if($.isFunction(a)) {
					return a.call(this, str, $.proxy(function (d) {
							if(d && d.d) { d = d.d; }
							this._load_nodes(!$.isArray(d) ? [] : $.vakata.array_unique(d), function () {
								this.search(str, true, show_only_matches, inside, append, show_only_matches_children);
							});
						}, this), inside);
				}
				else {
					a = $.extend({}, a);
					if(!a.data) { a.data = {}; }
					a.data.str = str;
					if(inside) {
						a.data.inside = inside;
					}
					if (this._data.search.lastRequest) {
						this._data.search.lastRequest.abort();
					}
					this._data.search.lastRequest = $.ajax(a)
						.fail($.proxy(function () {
							this._data.core.last_error = { 'error' : 'ajax', 'plugin' : 'search', 'id' : 'search_01', 'reason' : 'Could not load search parents', 'data' : JSON.stringify(a) };
							this.settings.core.error.call(this, this._data.core.last_error);
						}, this))
						.done($.proxy(function (d) {
							if(d && d.d) { d = d.d; }
							this._load_nodes(!$.isArray(d) ? [] : $.vakata.array_unique(d), function () {
								this.search(str, true, show_only_matches, inside, append, show_only_matches_children);
							});
						}, this));
					return this._data.search.lastRequest;
				}
			}
			if(!append) {
				this._data.search.str = str;
				this._data.search.dom = $();
				this._data.search.res = [];
				this._data.search.opn = [];
				this._data.search.som = show_only_matches;
				this._data.search.smc = show_only_matches_children;
			}

			f = new $.vakata.search(str, true, { caseSensitive : s.case_sensitive, fuzzy : s.fuzzy });
			$.each(m[inside ? inside : $.jstree.root].children_d, function (ii, i) {
				var v = m[i];
				if(v.text && !v.state.hidden && (!s.search_leaves_only || (v.state.loaded && v.children.length === 0)) && ( (s.search_callback && s.search_callback.call(this, str, v)) || (!s.search_callback && f.search(v.text).isMatch) ) ) {
					r.push(i);
					p = p.concat(v.parents);
				}
			});
			if(r.length) {
				p = $.vakata.array_unique(p);
				for(i = 0, j = p.length; i < j; i++) {
					if(p[i] !== $.jstree.root && m[p[i]] && this.open_node(p[i], null, 0) === true) {
						this._data.search.opn.push(p[i]);
					}
				}
				if(!append) {
					this._data.search.dom = $(this.element[0].querySelectorAll('#' + $.map(r, function (v) { return "0123456789".indexOf(v[0]) !== -1 ? '\\3' + v[0] + ' ' + v.substr(1).replace($.jstree.idregex,'\\$&') : v.replace($.jstree.idregex,'\\$&'); }).join(', #')));
					this._data.search.res = r;
				}
				else {
					this._data.search.dom = this._data.search.dom.add($(this.element[0].querySelectorAll('#' + $.map(r, function (v) { return "0123456789".indexOf(v[0]) !== -1 ? '\\3' + v[0] + ' ' + v.substr(1).replace($.jstree.idregex,'\\$&') : v.replace($.jstree.idregex,'\\$&'); }).join(', #'))));
					this._data.search.res = $.vakata.array_unique(this._data.search.res.concat(r));
				}
				this._data.search.dom.children(".jstree-anchor").addClass('jstree-search');
			}
			/**
			 * triggered after search is complete
			 * @event
			 * @name search.jstree
			 * @param {jQuery} nodes a jQuery collection of matching nodes
			 * @param {String} str the search string
			 * @param {Array} res a collection of objects represeing the matching nodes
			 * @plugin search
			 */
			this.trigger('search', { nodes : this._data.search.dom, str : str, res : this._data.search.res, show_only_matches : show_only_matches });
		};
		/**
		 * used to clear the last search (removes classes and shows all nodes if filtering is on)
		 * @name clear_search()
		 * @plugin search
		 * @trigger clear_search.jstree
		 */
		this.clear_search = function () {
			if(this.settings.search.close_opened_onclear) {
				this.close_node(this._data.search.opn, 0);
			}
			/**
			 * triggered after search is complete
			 * @event
			 * @name clear_search.jstree
			 * @param {jQuery} nodes a jQuery collection of matching nodes (the result from the last search)
			 * @param {String} str the search string (the last search string)
			 * @param {Array} res a collection of objects represeing the matching nodes (the result from the last search)
			 * @plugin search
			 */
			this.trigger('clear_search', { 'nodes' : this._data.search.dom, str : this._data.search.str, res : this._data.search.res });
			if(this._data.search.res.length) {
				this._data.search.dom = $(this.element[0].querySelectorAll('#' + $.map(this._data.search.res, function (v) {
					return "0123456789".indexOf(v[0]) !== -1 ? '\\3' + v[0] + ' ' + v.substr(1).replace($.jstree.idregex,'\\$&') : v.replace($.jstree.idregex,'\\$&');
				}).join(', #')));
				this._data.search.dom.children(".jstree-anchor").removeClass("jstree-search");
			}
			this._data.search.str = "";
			this._data.search.res = [];
			this._data.search.opn = [];
			this._data.search.dom = $();
		};

		this.redraw_node = function(obj, deep, callback, force_render) {
			obj = parent.redraw_node.apply(this, arguments);
			if(obj) {
				if($.inArray(obj.id, this._data.search.res) !== -1) {
					var i, j, tmp = null;
					for(i = 0, j = obj.childNodes.length; i < j; i++) {
						if(obj.childNodes[i] && obj.childNodes[i].className && obj.childNodes[i].className.indexOf("jstree-anchor") !== -1) {
							tmp = obj.childNodes[i];
							break;
						}
					}
					if(tmp) {
						tmp.className += ' jstree-search';
					}
				}
			}
			return obj;
		};
	};

	// helpers
	(function ($) {
		// from http://kiro.me/projects/fuse.html
		$.vakata.search = function(pattern, txt, options) {
			options = options || {};
			options = $.extend({}, $.vakata.search.defaults, options);
			if(options.fuzzy !== false) {
				options.fuzzy = true;
			}
			pattern = options.caseSensitive ? pattern : pattern.toLowerCase();
			var MATCH_LOCATION	= options.location,
				MATCH_DISTANCE	= options.distance,
				MATCH_THRESHOLD	= options.threshold,
				patternLen = pattern.length,
				matchmask, pattern_alphabet, match_bitapScore, search;
			if(patternLen > 32) {
				options.fuzzy = false;
			}
			if(options.fuzzy) {
				matchmask = 1 << (patternLen - 1);
				pattern_alphabet = (function () {
					var mask = {},
						i = 0;
					for (i = 0; i < patternLen; i++) {
						mask[pattern.charAt(i)] = 0;
					}
					for (i = 0; i < patternLen; i++) {
						mask[pattern.charAt(i)] |= 1 << (patternLen - i - 1);
					}
					return mask;
				}());
				match_bitapScore = function (e, x) {
					var accuracy = e / patternLen,
						proximity = Math.abs(MATCH_LOCATION - x);
					if(!MATCH_DISTANCE) {
						return proximity ? 1.0 : accuracy;
					}
					return accuracy + (proximity / MATCH_DISTANCE);
				};
			}
			search = function (text) {
				text = options.caseSensitive ? text : text.toLowerCase();
				if(pattern === text || text.indexOf(pattern) !== -1) {
					return {
						isMatch: true,
						score: 0
					};
				}
				if(!options.fuzzy) {
					return {
						isMatch: false,
						score: 1
					};
				}
				var i, j,
					textLen = text.length,
					scoreThreshold = MATCH_THRESHOLD,
					bestLoc = text.indexOf(pattern, MATCH_LOCATION),
					binMin, binMid,
					binMax = patternLen + textLen,
					lastRd, start, finish, rd, charMatch,
					score = 1,
					locations = [];
				if (bestLoc !== -1) {
					scoreThreshold = Math.min(match_bitapScore(0, bestLoc), scoreThreshold);
					bestLoc = text.lastIndexOf(pattern, MATCH_LOCATION + patternLen);
					if (bestLoc !== -1) {
						scoreThreshold = Math.min(match_bitapScore(0, bestLoc), scoreThreshold);
					}
				}
				bestLoc = -1;
				for (i = 0; i < patternLen; i++) {
					binMin = 0;
					binMid = binMax;
					while (binMin < binMid) {
						if (match_bitapScore(i, MATCH_LOCATION + binMid) <= scoreThreshold) {
							binMin = binMid;
						} else {
							binMax = binMid;
						}
						binMid = Math.floor((binMax - binMin) / 2 + binMin);
					}
					binMax = binMid;
					start = Math.max(1, MATCH_LOCATION - binMid + 1);
					finish = Math.min(MATCH_LOCATION + binMid, textLen) + patternLen;
					rd = new Array(finish + 2);
					rd[finish + 1] = (1 << i) - 1;
					for (j = finish; j >= start; j--) {
						charMatch = pattern_alphabet[text.charAt(j - 1)];
						if (i === 0) {
							rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
						} else {
							rd[j] = ((rd[j + 1] << 1) | 1) & charMatch | (((lastRd[j + 1] | lastRd[j]) << 1) | 1) | lastRd[j + 1];
						}
						if (rd[j] & matchmask) {
							score = match_bitapScore(i, j - 1);
							if (score <= scoreThreshold) {
								scoreThreshold = score;
								bestLoc = j - 1;
								locations.push(bestLoc);
								if (bestLoc > MATCH_LOCATION) {
									start = Math.max(1, 2 * MATCH_LOCATION - bestLoc);
								} else {
									break;
								}
							}
						}
					}
					if (match_bitapScore(i + 1, MATCH_LOCATION) > scoreThreshold) {
						break;
					}
					lastRd = rd;
				}
				return {
					isMatch: bestLoc >= 0,
					score: score
				};
			};
			return txt === true ? { 'search' : search } : search(txt);
		};
		$.vakata.search.defaults = {
			location : 0,
			distance : 100,
			threshold : 0.6,
			fuzzy : false,
			caseSensitive : false
		};
	}($));

	// include the search plugin by default
	// $.jstree.defaults.plugins.push("search");


/**
 * ### Sort plugin
 *
 * Automatically sorts all siblings in the tree according to a sorting function.
 */

	/**
	 * the settings function used to sort the nodes.
	 * It is executed in the tree's context, accepts two nodes as arguments and should return `1` or `-1`.
	 * @name $.jstree.defaults.sort
	 * @plugin sort
	 */
	$.jstree.defaults.sort = function (a, b) {
		//return this.get_type(a) === this.get_type(b) ? (this.get_text(a) > this.get_text(b) ? 1 : -1) : this.get_type(a) >= this.get_type(b);
		return this.get_text(a) > this.get_text(b) ? 1 : -1;
	};
	$.jstree.plugins.sort = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);
			this.element
				.on("model.jstree", $.proxy(function (e, data) {
						this.sort(data.parent, true);
					}, this))
				.on("rename_node.jstree create_node.jstree", $.proxy(function (e, data) {
						this.sort(data.parent || data.node.parent, false);
						this.redraw_node(data.parent || data.node.parent, true);
					}, this))
				.on("move_node.jstree copy_node.jstree", $.proxy(function (e, data) {
						this.sort(data.parent, false);
						this.redraw_node(data.parent, true);
					}, this));
		};
		/**
		 * used to sort a node's children
		 * @private
		 * @name sort(obj [, deep])
		 * @param  {mixed} obj the node
		 * @param {Boolean} deep if set to `true` nodes are sorted recursively.
		 * @plugin sort
		 * @trigger search.jstree
		 */
		this.sort = function (obj, deep) {
			var i, j;
			obj = this.get_node(obj);
			if(obj && obj.children && obj.children.length) {
				obj.children.sort($.proxy(this.settings.sort, this));
				if(deep) {
					for(i = 0, j = obj.children_d.length; i < j; i++) {
						this.sort(obj.children_d[i], false);
					}
				}
			}
		};
	};

	// include the sort plugin by default
	// $.jstree.defaults.plugins.push("sort");

/**
 * ### State plugin
 *
 * Saves the state of the tree (selected nodes, opened nodes) on the user's computer using available options (localStorage, cookies, etc)
 */

	var to = false;
	/**
	 * stores all defaults for the state plugin
	 * @name $.jstree.defaults.state
	 * @plugin state
	 */
	$.jstree.defaults.state = {
		/**
		 * A string for the key to use when saving the current tree (change if using multiple trees in your project). Defaults to `jstree`.
		 * @name $.jstree.defaults.state.key
		 * @plugin state
		 */
		key		: 'jstree',
		/**
		 * A space separated list of events that trigger a state save. Defaults to `changed.jstree open_node.jstree close_node.jstree`.
		 * @name $.jstree.defaults.state.events
		 * @plugin state
		 */
		events	: 'changed.jstree open_node.jstree close_node.jstree check_node.jstree uncheck_node.jstree',
		/**
		 * Time in milliseconds after which the state will expire. Defaults to 'false' meaning - no expire.
		 * @name $.jstree.defaults.state.ttl
		 * @plugin state
		 */
		ttl		: false,
		/**
		 * A function that will be executed prior to restoring state with one argument - the state object. Can be used to clear unwanted parts of the state.
		 * @name $.jstree.defaults.state.filter
		 * @plugin state
		 */
		filter	: false,
		/**
		 * Should loaded nodes be restored (setting this to true means that it is possible that the whole tree will be loaded for some users - use with caution). Defaults to `false`
		 * @name $.jstree.defaults.state.preserve_loaded
		 * @plugin state
		 */
		preserve_loaded : false
	};
	$.jstree.plugins.state = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);
			var bind = $.proxy(function () {
				this.element.on(this.settings.state.events, $.proxy(function () {
					if(to) { clearTimeout(to); }
					to = setTimeout($.proxy(function () { this.save_state(); }, this), 100);
				}, this));
				/**
				 * triggered when the state plugin is finished restoring the state (and immediately after ready if there is no state to restore).
				 * @event
				 * @name state_ready.jstree
				 * @plugin state
				 */
				this.trigger('state_ready');
			}, this);
			this.element
				.on("ready.jstree", $.proxy(function (e, data) {
						this.element.one("restore_state.jstree", bind);
						if(!this.restore_state()) { bind(); }
					}, this));
		};
		/**
		 * save the state
		 * @name save_state()
		 * @plugin state
		 */
		this.save_state = function () {
			var tm = this.get_state();
			if (!this.settings.state.preserve_loaded) {
				delete tm.core.loaded;
			}
			var st = { 'state' : tm, 'ttl' : this.settings.state.ttl, 'sec' : +(new Date()) };
			$.vakata.storage.set(this.settings.state.key, JSON.stringify(st));
		};
		/**
		 * restore the state from the user's computer
		 * @name restore_state()
		 * @plugin state
		 */
		this.restore_state = function () {
			var k = $.vakata.storage.get(this.settings.state.key);
			if(!!k) { try { k = JSON.parse(k); } catch(ex) { return false; } }
			if(!!k && k.ttl && k.sec && +(new Date()) - k.sec > k.ttl) { return false; }
			if(!!k && k.state) { k = k.state; }
			if(!!k && $.isFunction(this.settings.state.filter)) { k = this.settings.state.filter.call(this, k); }
			if(!!k) {
				if (!this.settings.state.preserve_loaded) {
					delete k.core.loaded;
				}
				this.element.one("set_state.jstree", function (e, data) { data.instance.trigger('restore_state', { 'state' : $.extend(true, {}, k) }); });
				this.set_state(k);
				return true;
			}
			return false;
		};
		/**
		 * clear the state on the user's computer
		 * @name clear_state()
		 * @plugin state
		 */
		this.clear_state = function () {
			return $.vakata.storage.del(this.settings.state.key);
		};
	};

	(function ($, undefined) {
		$.vakata.storage = {
			// simply specifying the functions in FF throws an error
			set : function (key, val) { return window.localStorage.setItem(key, val); },
			get : function (key) { return window.localStorage.getItem(key); },
			del : function (key) { return window.localStorage.removeItem(key); }
		};
	}($));

	// include the state plugin by default
	// $.jstree.defaults.plugins.push("state");

/**
 * ### Types plugin
 *
 * Makes it possible to add predefined types for groups of nodes, which make it possible to easily control nesting rules and icon for each group.
 */

	/**
	 * An object storing all types as key value pairs, where the key is the type name and the value is an object that could contain following keys (all optional).
	 *
	 * * `max_children` the maximum number of immediate children this node type can have. Do not specify or set to `-1` for unlimited.
	 * * `max_depth` the maximum number of nesting this node type can have. A value of `1` would mean that the node can have children, but no grandchildren. Do not specify or set to `-1` for unlimited.
	 * * `valid_children` an array of node type strings, that nodes of this type can have as children. Do not specify or set to `-1` for no limits.
	 * * `icon` a string - can be a path to an icon or a className, if using an image that is in the current directory use a `./` prefix, otherwise it will be detected as a class. Omit to use the default icon from your theme.
	 * * `li_attr` an object of values which will be used to add HTML attributes on the resulting LI DOM node (merged with the node's own data)
	 * * `a_attr` an object of values which will be used to add HTML attributes on the resulting A DOM node (merged with the node's own data)
	 *
	 * There are two predefined types:
	 *
	 * * `#` represents the root of the tree, for example `max_children` would control the maximum number of root nodes.
	 * * `default` represents the default node - any settings here will be applied to all nodes that do not have a type specified.
	 *
	 * @name $.jstree.defaults.types
	 * @plugin types
	 */
	$.jstree.defaults.types = {
		'default' : {}
	};
	$.jstree.defaults.types[$.jstree.root] = {};

	$.jstree.plugins.types = function (options, parent) {
		this.init = function (el, options) {
			var i, j;
			if(options && options.types && options.types['default']) {
				for(i in options.types) {
					if(i !== "default" && i !== $.jstree.root && options.types.hasOwnProperty(i)) {
						for(j in options.types['default']) {
							if(options.types['default'].hasOwnProperty(j) && options.types[i][j] === undefined) {
								options.types[i][j] = options.types['default'][j];
							}
						}
					}
				}
			}
			parent.init.call(this, el, options);
			this._model.data[$.jstree.root].type = $.jstree.root;
		};
		this.refresh = function (skip_loading, forget_state) {
			parent.refresh.call(this, skip_loading, forget_state);
			this._model.data[$.jstree.root].type = $.jstree.root;
		};
		this.bind = function () {
			this.element
				.on('model.jstree', $.proxy(function (e, data) {
						var m = this._model.data,
							dpc = data.nodes,
							t = this.settings.types,
							i, j, c = 'default', k;
						for(i = 0, j = dpc.length; i < j; i++) {
							c = 'default';
							if(m[dpc[i]].original && m[dpc[i]].original.type && t[m[dpc[i]].original.type]) {
								c = m[dpc[i]].original.type;
							}
							if(m[dpc[i]].data && m[dpc[i]].data.jstree && m[dpc[i]].data.jstree.type && t[m[dpc[i]].data.jstree.type]) {
								c = m[dpc[i]].data.jstree.type;
							}
							m[dpc[i]].type = c;
							if(m[dpc[i]].icon === true && t[c].icon !== undefined) {
								m[dpc[i]].icon = t[c].icon;
							}
							if(t[c].li_attr !== undefined && typeof t[c].li_attr === 'object') {
								for (k in t[c].li_attr) {
									if (t[c].li_attr.hasOwnProperty(k)) {
										if (k === 'id') {
											continue;
										}
										else if (m[dpc[i]].li_attr[k] === undefined) {
											m[dpc[i]].li_attr[k] = t[c].li_attr[k];
										}
										else if (k === 'class') {
											m[dpc[i]].li_attr['class'] = t[c].li_attr['class'] + ' ' + m[dpc[i]].li_attr['class'];
										}
									}
								}
							}
							if(t[c].a_attr !== undefined && typeof t[c].a_attr === 'object') {
								for (k in t[c].a_attr) {
									if (t[c].a_attr.hasOwnProperty(k)) {
										if (k === 'id') {
											continue;
										}
										else if (m[dpc[i]].a_attr[k] === undefined) {
											m[dpc[i]].a_attr[k] = t[c].a_attr[k];
										}
										else if (k === 'href' && m[dpc[i]].a_attr[k] === '#') {
											m[dpc[i]].a_attr['href'] = t[c].a_attr['href'];
										}
										else if (k === 'class') {
											m[dpc[i]].a_attr['class'] = t[c].a_attr['class'] + ' ' + m[dpc[i]].a_attr['class'];
										}
									}
								}
							}
						}
						m[$.jstree.root].type = $.jstree.root;
					}, this));
			parent.bind.call(this);
		};
		this.get_json = function (obj, options, flat) {
			var i, j,
				m = this._model.data,
				opt = options ? $.extend(true, {}, options, {no_id:false}) : {},
				tmp = parent.get_json.call(this, obj, opt, flat);
			if(tmp === false) { return false; }
			if($.isArray(tmp)) {
				for(i = 0, j = tmp.length; i < j; i++) {
					tmp[i].type = tmp[i].id && m[tmp[i].id] && m[tmp[i].id].type ? m[tmp[i].id].type : "default";
					if(options && options.no_id) {
						delete tmp[i].id;
						if(tmp[i].li_attr && tmp[i].li_attr.id) {
							delete tmp[i].li_attr.id;
						}
						if(tmp[i].a_attr && tmp[i].a_attr.id) {
							delete tmp[i].a_attr.id;
						}
					}
				}
			}
			else {
				tmp.type = tmp.id && m[tmp.id] && m[tmp.id].type ? m[tmp.id].type : "default";
				if(options && options.no_id) {
					tmp = this._delete_ids(tmp);
				}
			}
			return tmp;
		};
		this._delete_ids = function (tmp) {
			if($.isArray(tmp)) {
				for(var i = 0, j = tmp.length; i < j; i++) {
					tmp[i] = this._delete_ids(tmp[i]);
				}
				return tmp;
			}
			delete tmp.id;
			if(tmp.li_attr && tmp.li_attr.id) {
				delete tmp.li_attr.id;
			}
			if(tmp.a_attr && tmp.a_attr.id) {
				delete tmp.a_attr.id;
			}
			if(tmp.children && $.isArray(tmp.children)) {
				tmp.children = this._delete_ids(tmp.children);
			}
			return tmp;
		};
		this.check = function (chk, obj, par, pos, more) {
			if(parent.check.call(this, chk, obj, par, pos, more) === false) { return false; }
			obj = obj && obj.id ? obj : this.get_node(obj);
			par = par && par.id ? par : this.get_node(par);
			var m = obj && obj.id ? (more && more.origin ? more.origin : $.jstree.reference(obj.id)) : null, tmp, d, i, j;
			m = m && m._model && m._model.data ? m._model.data : null;
			switch(chk) {
				case "create_node":
				case "move_node":
				case "copy_node":
					if(chk !== 'move_node' || $.inArray(obj.id, par.children) === -1) {
						tmp = this.get_rules(par);
						if(tmp.max_children !== undefined && tmp.max_children !== -1 && tmp.max_children === par.children.length) {
							this._data.core.last_error = { 'error' : 'check', 'plugin' : 'types', 'id' : 'types_01', 'reason' : 'max_children prevents function: ' + chk, 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
							return false;
						}
						if(tmp.valid_children !== undefined && tmp.valid_children !== -1 && $.inArray((obj.type || 'default'), tmp.valid_children) === -1) {
							this._data.core.last_error = { 'error' : 'check', 'plugin' : 'types', 'id' : 'types_02', 'reason' : 'valid_children prevents function: ' + chk, 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
							return false;
						}
						if(m && obj.children_d && obj.parents) {
							d = 0;
							for(i = 0, j = obj.children_d.length; i < j; i++) {
								d = Math.max(d, m[obj.children_d[i]].parents.length);
							}
							d = d - obj.parents.length + 1;
						}
						if(d <= 0 || d === undefined) { d = 1; }
						do {
							if(tmp.max_depth !== undefined && tmp.max_depth !== -1 && tmp.max_depth < d) {
								this._data.core.last_error = { 'error' : 'check', 'plugin' : 'types', 'id' : 'types_03', 'reason' : 'max_depth prevents function: ' + chk, 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
								return false;
							}
							par = this.get_node(par.parent);
							tmp = this.get_rules(par);
							d++;
						} while(par);
					}
					break;
			}
			return true;
		};
		/**
		 * used to retrieve the type settings object for a node
		 * @name get_rules(obj)
		 * @param {mixed} obj the node to find the rules for
		 * @return {Object}
		 * @plugin types
		 */
		this.get_rules = function (obj) {
			obj = this.get_node(obj);
			if(!obj) { return false; }
			var tmp = this.get_type(obj, true);
			if(tmp.max_depth === undefined) { tmp.max_depth = -1; }
			if(tmp.max_children === undefined) { tmp.max_children = -1; }
			if(tmp.valid_children === undefined) { tmp.valid_children = -1; }
			return tmp;
		};
		/**
		 * used to retrieve the type string or settings object for a node
		 * @name get_type(obj [, rules])
		 * @param {mixed} obj the node to find the rules for
		 * @param {Boolean} rules if set to `true` instead of a string the settings object will be returned
		 * @return {String|Object}
		 * @plugin types
		 */
		this.get_type = function (obj, rules) {
			obj = this.get_node(obj);
			return (!obj) ? false : ( rules ? $.extend({ 'type' : obj.type }, this.settings.types[obj.type]) : obj.type);
		};
		/**
		 * used to change a node's type
		 * @name set_type(obj, type)
		 * @param {mixed} obj the node to change
		 * @param {String} type the new type
		 * @plugin types
		 */
		this.set_type = function (obj, type) {
			var m = this._model.data, t, t1, t2, old_type, old_icon, k, d, a;
			if($.isArray(obj)) {
				obj = obj.slice();
				for(t1 = 0, t2 = obj.length; t1 < t2; t1++) {
					this.set_type(obj[t1], type);
				}
				return true;
			}
			t = this.settings.types;
			obj = this.get_node(obj);
			if(!t[type] || !obj) { return false; }
			d = this.get_node(obj, true);
			if (d && d.length) {
				a = d.children('.jstree-anchor');
			}
			old_type = obj.type;
			old_icon = this.get_icon(obj);
			obj.type = type;
			if(old_icon === true || !t[old_type] || (t[old_type].icon !== undefined && old_icon === t[old_type].icon)) {
				this.set_icon(obj, t[type].icon !== undefined ? t[type].icon : true);
			}

			// remove old type props
			if(t[old_type] && t[old_type].li_attr !== undefined && typeof t[old_type].li_attr === 'object') {
				for (k in t[old_type].li_attr) {
					if (t[old_type].li_attr.hasOwnProperty(k)) {
						if (k === 'id') {
							continue;
						}
						else if (k === 'class') {
							m[obj.id].li_attr['class'] = (m[obj.id].li_attr['class'] || '').replace(t[old_type].li_attr[k], '');
							if (d) { d.removeClass(t[old_type].li_attr[k]); }
						}
						else if (m[obj.id].li_attr[k] === t[old_type].li_attr[k]) {
							m[obj.id].li_attr[k] = null;
							if (d) { d.removeAttr(k); }
						}
					}
				}
			}
			if(t[old_type] && t[old_type].a_attr !== undefined && typeof t[old_type].a_attr === 'object') {
				for (k in t[old_type].a_attr) {
					if (t[old_type].a_attr.hasOwnProperty(k)) {
						if (k === 'id') {
							continue;
						}
						else if (k === 'class') {
							m[obj.id].a_attr['class'] = (m[obj.id].a_attr['class'] || '').replace(t[old_type].a_attr[k], '');
							if (a) { a.removeClass(t[old_type].a_attr[k]); }
						}
						else if (m[obj.id].a_attr[k] === t[old_type].a_attr[k]) {
							if (k === 'href') {
								m[obj.id].a_attr[k] = '#';
								if (a) { a.attr('href', '#'); }
							}
							else {
								delete m[obj.id].a_attr[k];
								if (a) { a.removeAttr(k); }
							}
						}
					}
				}
			}

			// add new props
			if(t[type].li_attr !== undefined && typeof t[type].li_attr === 'object') {
				for (k in t[type].li_attr) {
					if (t[type].li_attr.hasOwnProperty(k)) {
						if (k === 'id') {
							continue;
						}
						else if (m[obj.id].li_attr[k] === undefined) {
							m[obj.id].li_attr[k] = t[type].li_attr[k];
							if (d) {
								if (k === 'class') {
									d.addClass(t[type].li_attr[k]);
								}
								else {
									d.attr(k, t[type].li_attr[k]);
								}
							}
						}
						else if (k === 'class') {
							m[obj.id].li_attr['class'] = t[type].li_attr[k] + ' ' + m[obj.id].li_attr['class'];
							if (d) { d.addClass(t[type].li_attr[k]); }
						}
					}
				}
			}
			if(t[type].a_attr !== undefined && typeof t[type].a_attr === 'object') {
				for (k in t[type].a_attr) {
					if (t[type].a_attr.hasOwnProperty(k)) {
						if (k === 'id') {
							continue;
						}
						else if (m[obj.id].a_attr[k] === undefined) {
							m[obj.id].a_attr[k] = t[type].a_attr[k];
							if (a) {
								if (k === 'class') {
									a.addClass(t[type].a_attr[k]);
								}
								else {
									a.attr(k, t[type].a_attr[k]);
								}
							}
						}
						else if (k === 'href' && m[obj.id].a_attr[k] === '#') {
							m[obj.id].a_attr['href'] = t[type].a_attr['href'];
							if (a) { a.attr('href', t[type].a_attr['href']); }
						}
						else if (k === 'class') {
							m[obj.id].a_attr['class'] = t[type].a_attr['class'] + ' ' + m[obj.id].a_attr['class'];
							if (a) { a.addClass(t[type].a_attr[k]); }
						}
					}
				}
			}

			return true;
		};
	};
	// include the types plugin by default
	// $.jstree.defaults.plugins.push("types");


/**
 * ### Unique plugin
 *
 * Enforces that no nodes with the same name can coexist as siblings.
 */

	/**
	 * stores all defaults for the unique plugin
	 * @name $.jstree.defaults.unique
	 * @plugin unique
	 */
	$.jstree.defaults.unique = {
		/**
		 * Indicates if the comparison should be case sensitive. Default is `false`.
		 * @name $.jstree.defaults.unique.case_sensitive
		 * @plugin unique
		 */
		case_sensitive : false,
		/**
		 * Indicates if white space should be trimmed before the comparison. Default is `false`.
		 * @name $.jstree.defaults.unique.trim_whitespace
		 * @plugin unique
		 */
		trim_whitespace : false,
		/**
		 * A callback executed in the instance's scope when a new node is created and the name is already taken, the two arguments are the conflicting name and the counter. The default will produce results like `New node (2)`.
		 * @name $.jstree.defaults.unique.duplicate
		 * @plugin unique
		 */
		duplicate : function (name, counter) {
			return name + ' (' + counter + ')';
		}
	};

	$.jstree.plugins.unique = function (options, parent) {
		this.check = function (chk, obj, par, pos, more) {
			if(parent.check.call(this, chk, obj, par, pos, more) === false) { return false; }
			obj = obj && obj.id ? obj : this.get_node(obj);
			par = par && par.id ? par : this.get_node(par);
			if(!par || !par.children) { return true; }
			var n = chk === "rename_node" ? pos : obj.text,
				c = [],
				s = this.settings.unique.case_sensitive,
				w = this.settings.unique.trim_whitespace,
				m = this._model.data, i, j, t;
			for(i = 0, j = par.children.length; i < j; i++) {
				t = m[par.children[i]].text;
				if (!s) {
					t = t.toLowerCase();
				}
				if (w) {
					t = t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
				}
				c.push(t);
			}
			if(!s) { n = n.toLowerCase(); }
			if (w) { n = n.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); }
			switch(chk) {
				case "delete_node":
					return true;
				case "rename_node":
					t = obj.text || '';
					if (!s) {
						t = t.toLowerCase();
					}
					if (w) {
						t = t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
					}
					i = ($.inArray(n, c) === -1 || (obj.text && t === n));
					if(!i) {
						this._data.core.last_error = { 'error' : 'check', 'plugin' : 'unique', 'id' : 'unique_01', 'reason' : 'Child with name ' + n + ' already exists. Preventing: ' + chk, 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
					}
					return i;
				case "create_node":
					i = ($.inArray(n, c) === -1);
					if(!i) {
						this._data.core.last_error = { 'error' : 'check', 'plugin' : 'unique', 'id' : 'unique_04', 'reason' : 'Child with name ' + n + ' already exists. Preventing: ' + chk, 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
					}
					return i;
				case "copy_node":
					i = ($.inArray(n, c) === -1);
					if(!i) {
						this._data.core.last_error = { 'error' : 'check', 'plugin' : 'unique', 'id' : 'unique_02', 'reason' : 'Child with name ' + n + ' already exists. Preventing: ' + chk, 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
					}
					return i;
				case "move_node":
					i = ( (obj.parent === par.id && (!more || !more.is_multi)) || $.inArray(n, c) === -1);
					if(!i) {
						this._data.core.last_error = { 'error' : 'check', 'plugin' : 'unique', 'id' : 'unique_03', 'reason' : 'Child with name ' + n + ' already exists. Preventing: ' + chk, 'data' : JSON.stringify({ 'chk' : chk, 'pos' : pos, 'obj' : obj && obj.id ? obj.id : false, 'par' : par && par.id ? par.id : false }) };
					}
					return i;
			}
			return true;
		};
		this.create_node = function (par, node, pos, callback, is_loaded) {
			if(!node || node.text === undefined) {
				if(par === null) {
					par = $.jstree.root;
				}
				par = this.get_node(par);
				if(!par) {
					return parent.create_node.call(this, par, node, pos, callback, is_loaded);
				}
				pos = pos === undefined ? "last" : pos;
				if(!pos.toString().match(/^(before|after)$/) && !is_loaded && !this.is_loaded(par)) {
					return parent.create_node.call(this, par, node, pos, callback, is_loaded);
				}
				if(!node) { node = {}; }
				var tmp, n, dpc, i, j, m = this._model.data, s = this.settings.unique.case_sensitive, w = this.settings.unique.trim_whitespace, cb = this.settings.unique.duplicate, t;
				n = tmp = this.get_string('New node');
				dpc = [];
				for(i = 0, j = par.children.length; i < j; i++) {
					t = m[par.children[i]].text;
					if (!s) {
						t = t.toLowerCase();
					}
					if (w) {
						t = t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
					}
					dpc.push(t);
				}
				i = 1;
				t = n;
				if (!s) {
					t = t.toLowerCase();
				}
				if (w) {
					t = t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
				}
				while($.inArray(t, dpc) !== -1) {
					n = cb.call(this, tmp, (++i)).toString();
					t = n;
					if (!s) {
						t = t.toLowerCase();
					}
					if (w) {
						t = t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
					}
				}
				node.text = n;
			}
			return parent.create_node.call(this, par, node, pos, callback, is_loaded);
		};
	};

	// include the unique plugin by default
	// $.jstree.defaults.plugins.push("unique");


/**
 * ### Wholerow plugin
 *
 * Makes each node appear block level. Making selection easier. May cause slow down for large trees in old browsers.
 */

	var div = document.createElement('DIV');
	div.setAttribute('unselectable','on');
	div.setAttribute('role','presentation');
	div.className = 'jstree-wholerow';
	div.innerHTML = '&#160;';
	$.jstree.plugins.wholerow = function (options, parent) {
		this.bind = function () {
			parent.bind.call(this);

			this.element
				.on('ready.jstree set_state.jstree', $.proxy(function () {
						this.hide_dots();
					}, this))
				.on("init.jstree loading.jstree ready.jstree", $.proxy(function () {
						//div.style.height = this._data.core.li_height + 'px';
						this.get_container_ul().addClass('jstree-wholerow-ul');
					}, this))
				.on("deselect_all.jstree", $.proxy(function (e, data) {
						this.element.find('.jstree-wholerow-clicked').removeClass('jstree-wholerow-clicked');
					}, this))
				.on("changed.jstree", $.proxy(function (e, data) {
						this.element.find('.jstree-wholerow-clicked').removeClass('jstree-wholerow-clicked');
						var tmp = false, i, j;
						for(i = 0, j = data.selected.length; i < j; i++) {
							tmp = this.get_node(data.selected[i], true);
							if(tmp && tmp.length) {
								tmp.children('.jstree-wholerow').addClass('jstree-wholerow-clicked');
							}
						}
					}, this))
				.on("open_node.jstree", $.proxy(function (e, data) {
						this.get_node(data.node, true).find('.jstree-clicked').parent().children('.jstree-wholerow').addClass('jstree-wholerow-clicked');
					}, this))
				.on("hover_node.jstree dehover_node.jstree", $.proxy(function (e, data) {
						if(e.type === "hover_node" && this.is_disabled(data.node)) { return; }
						this.get_node(data.node, true).children('.jstree-wholerow')[e.type === "hover_node"?"addClass":"removeClass"]('jstree-wholerow-hovered');
					}, this))
				.on("contextmenu.jstree", ".jstree-wholerow", $.proxy(function (e) {
						if (this._data.contextmenu) {
							e.preventDefault();
							var tmp = $.Event('contextmenu', { metaKey : e.metaKey, ctrlKey : e.ctrlKey, altKey : e.altKey, shiftKey : e.shiftKey, pageX : e.pageX, pageY : e.pageY });
							$(e.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(tmp);
						}
					}, this))
				/*!
				.on("mousedown.jstree touchstart.jstree", ".jstree-wholerow", function (e) {
						if(e.target === e.currentTarget) {
							var a = $(e.currentTarget).closest(".jstree-node").children(".jstree-anchor");
							e.target = a[0];
							a.trigger(e);
						}
					})
				*/
				.on("click.jstree", ".jstree-wholerow", function (e) {
						e.stopImmediatePropagation();
						var tmp = $.Event('click', { metaKey : e.metaKey, ctrlKey : e.ctrlKey, altKey : e.altKey, shiftKey : e.shiftKey });
						$(e.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(tmp).focus();
					})
				.on("dblclick.jstree", ".jstree-wholerow", function (e) {
						e.stopImmediatePropagation();
						var tmp = $.Event('dblclick', { metaKey : e.metaKey, ctrlKey : e.ctrlKey, altKey : e.altKey, shiftKey : e.shiftKey });
						$(e.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(tmp).focus();
					})
				.on("click.jstree", ".jstree-leaf > .jstree-ocl", $.proxy(function (e) {
						e.stopImmediatePropagation();
						var tmp = $.Event('click', { metaKey : e.metaKey, ctrlKey : e.ctrlKey, altKey : e.altKey, shiftKey : e.shiftKey });
						$(e.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(tmp).focus();
					}, this))
				.on("mouseover.jstree", ".jstree-wholerow, .jstree-icon", $.proxy(function (e) {
						e.stopImmediatePropagation();
						if(!this.is_disabled(e.currentTarget)) {
							this.hover_node(e.currentTarget);
						}
						return false;
					}, this))
				.on("mouseleave.jstree", ".jstree-node", $.proxy(function (e) {
						this.dehover_node(e.currentTarget);
					}, this));
		};
		this.teardown = function () {
			if(this.settings.wholerow) {
				this.element.find(".jstree-wholerow").remove();
			}
			parent.teardown.call(this);
		};
		this.redraw_node = function(obj, deep, callback, force_render) {
			obj = parent.redraw_node.apply(this, arguments);
			if(obj) {
				var tmp = div.cloneNode(true);
				//tmp.style.height = this._data.core.li_height + 'px';
				if($.inArray(obj.id, this._data.core.selected) !== -1) { tmp.className += ' jstree-wholerow-clicked'; }
				if(this._data.core.focused && this._data.core.focused === obj.id) { tmp.className += ' jstree-wholerow-hovered'; }
				obj.insertBefore(tmp, obj.childNodes[0]);
			}
			return obj;
		};
	};
	// include the wholerow plugin by default
	// $.jstree.defaults.plugins.push("wholerow");
	if(window.customElements && Object && Object.create) {
		var proto = Object.create(HTMLElement.prototype);
		proto.createdCallback = function () {
			var c = { core : {}, plugins : [] }, i;
			for(i in $.jstree.plugins) {
				if($.jstree.plugins.hasOwnProperty(i) && this.attributes[i]) {
					c.plugins.push(i);
					if(this.getAttribute(i) && JSON.parse(this.getAttribute(i))) {
						c[i] = JSON.parse(this.getAttribute(i));
					}
				}
			}
			for(i in $.jstree.defaults.core) {
				if($.jstree.defaults.core.hasOwnProperty(i) && this.attributes[i]) {
					c.core[i] = JSON.parse(this.getAttribute(i)) || this.getAttribute(i);
				}
			}
			$(this).jstree(c);
		};
		// proto.attributeChangedCallback = function (name, previous, value) { };
		try {
			window.customElements.define("vakata-jstree", function() {}, { prototype: proto });
		} catch (ignore) { }
	}

}));

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL2ZpbGUtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL3BhZ2VzL2ZpbGVCcm93c2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanN0cmVlL2Rpc3QvanN0cmVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRLG9CQUFvQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBLDBCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7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QUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxTQUFTLGNBQWM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEs7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsY0FBYztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsSztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFNBQVMsY0FBYztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsSztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEs7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsY0FBYztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxLO0FBQ1g7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLFNBQVMsY0FBYztBQUN2QjtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWM7QUFDdkI7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLFNBQVMsY0FBYztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsZUFBZSxhQUFhO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLGFBQWEsSztBQUNiO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZTtBQUNmLDhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlO0FBQ2YsOEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGU7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0EsUUFBUTtBQUNSLGdDQUFnQyxxQkFBcUIsRUFBRTtBQUN2RDtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFIQUFxSDtBQUM3STtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isc0hBQXNIO0FBQzlJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRTtBQUNGOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsT0FBTztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRCxPQUFPO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxNQUFNO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsT0FBTztB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QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLHFDQUFxQyxxRkFBcUY7QUFDMUg7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLGtDQUFrQyxxRkFBcUY7QUFDdkg7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELDZDQUE2QztBQUN6Ryx1RUFBdUUsNkNBQTZDO0FBQ3BIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxVQUFVLGdCQUFnQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0U7QUFDeEU7QUFDQSw4REFBOEQsR0FBRyxtQkFBbUI7QUFDcEYsR0FBRyxpQkFBaUI7QUFDcEI7O0FBRUEsQ0FBQyxHIiwiZmlsZSI6InN0b2Noc3MtYnJvd3Nlci5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbiBcdGZ1bmN0aW9uIHdlYnBhY2tKc29ucENhbGxiYWNrKGRhdGEpIHtcbiBcdFx0dmFyIGNodW5rSWRzID0gZGF0YVswXTtcbiBcdFx0dmFyIG1vcmVNb2R1bGVzID0gZGF0YVsxXTtcbiBcdFx0dmFyIGV4ZWN1dGVNb2R1bGVzID0gZGF0YVsyXTtcblxuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIHJlc29sdmVzID0gW107XG4gXHRcdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuIFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuIFx0XHRcdFx0cmVzb2x2ZXMucHVzaChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0pO1xuIFx0XHRcdH1cbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuIFx0XHR9XG4gXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYocGFyZW50SnNvbnBGdW5jdGlvbikgcGFyZW50SnNvbnBGdW5jdGlvbihkYXRhKTtcblxuIFx0XHR3aGlsZShyZXNvbHZlcy5sZW5ndGgpIHtcbiBcdFx0XHRyZXNvbHZlcy5zaGlmdCgpKCk7XG4gXHRcdH1cblxuIFx0XHQvLyBhZGQgZW50cnkgbW9kdWxlcyBmcm9tIGxvYWRlZCBjaHVuayB0byBkZWZlcnJlZCBsaXN0XG4gXHRcdGRlZmVycmVkTW9kdWxlcy5wdXNoLmFwcGx5KGRlZmVycmVkTW9kdWxlcywgZXhlY3V0ZU1vZHVsZXMgfHwgW10pO1xuXG4gXHRcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gYWxsIGNodW5rcyByZWFkeVxuIFx0XHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiBcdH07XG4gXHRmdW5jdGlvbiBjaGVja0RlZmVycmVkTW9kdWxlcygpIHtcbiBcdFx0dmFyIHJlc3VsdDtcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlZmVycmVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBkZWZlcnJlZE1vZHVsZSA9IGRlZmVycmVkTW9kdWxlc1tpXTtcbiBcdFx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcbiBcdFx0XHRmb3IodmFyIGogPSAxOyBqIDwgZGVmZXJyZWRNb2R1bGUubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBkZXBJZCA9IGRlZmVycmVkTW9kdWxlW2pdO1xuIFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2RlcElkXSAhPT0gMCkgZnVsZmlsbGVkID0gZmFsc2U7XG4gXHRcdFx0fVxuIFx0XHRcdGlmKGZ1bGZpbGxlZCkge1xuIFx0XHRcdFx0ZGVmZXJyZWRNb2R1bGVzLnNwbGljZShpLS0sIDEpO1xuIFx0XHRcdFx0cmVzdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBkZWZlcnJlZE1vZHVsZVswXSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0cmV0dXJuIHJlc3VsdDtcbiBcdH1cblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuIFx0Ly8gUHJvbWlzZSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdFwiYnJvd3NlclwiOiAwXG4gXHR9O1xuXG4gXHR2YXIgZGVmZXJyZWRNb2R1bGVzID0gW107XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdHZhciBqc29ucEFycmF5ID0gd2luZG93W1wid2VicGFja0pzb25wXCJdID0gd2luZG93W1wid2VicGFja0pzb25wXCJdIHx8IFtdO1xuIFx0dmFyIG9sZEpzb25wRnVuY3Rpb24gPSBqc29ucEFycmF5LnB1c2guYmluZChqc29ucEFycmF5KTtcbiBcdGpzb25wQXJyYXkucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrO1xuIFx0anNvbnBBcnJheSA9IGpzb25wQXJyYXkuc2xpY2UoKTtcbiBcdGZvcih2YXIgaSA9IDA7IGkgPCBqc29ucEFycmF5Lmxlbmd0aDsgaSsrKSB3ZWJwYWNrSnNvbnBDYWxsYmFjayhqc29ucEFycmF5W2ldKTtcbiBcdHZhciBwYXJlbnRKc29ucEZ1bmN0aW9uID0gb2xkSnNvbnBGdW5jdGlvbjtcblxuXG4gXHQvLyBhZGQgZW50cnkgbW9kdWxlIHRvIGRlZmVycmVkIGxpc3RcbiBcdGRlZmVycmVkTW9kdWxlcy5wdXNoKFtcIi4vY2xpZW50L3BhZ2VzL2ZpbGUtYnJvd3Nlci5qc1wiLFwiY29tbW9uXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwibGV0IGpzdHJlZSA9IHJlcXVpcmUoJ2pzdHJlZScpO1xubGV0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5sZXQgeGhyID0gcmVxdWlyZSgneGhyJyk7XG5sZXQgUGFnZVZpZXcgPSByZXF1aXJlKCcuL2Jhc2UnKTtcbmxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9wYWdlcy9maWxlQnJvd3Nlci5wdWcnKTtcbmxldCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL2xldCBib290c3RyYXAgPSByZXF1aXJlKCdib290c3RyYXAnKTtcblxuaW1wb3J0IGluaXRQYWdlIGZyb20gJy4vcGFnZS5qcyc7XG5cbmxldCBhamF4RGF0YSA9IHtcbiAgXCJ1cmxcIiA6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYobm9kZS5wYXJlbnQgPT09IG51bGwpe1xuICAgICAgcmV0dXJuIFwiL3N0b2Noc3MvbW9kZWxzL2Jyb3dzZXItbGlzdC9cIlxuICAgIH1cbiAgICByZXR1cm4gXCIvc3RvY2hzcy9tb2RlbHMvYnJvd3Nlci1saXN0XCIgKyBub2RlLm9yaWdpbmFsLl9wYXRoXG4gIH0sXG4gIFwiZGF0YVR5cGVcIiA6IFwianNvblwiLFxuICBcImRhdGFcIiA6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIHsgJ2lkJyA6IG5vZGUuaWR9XG4gIH0sXG59XG5cbmxldCB0cmVlU2V0dGluZ3MgPSB7XG4gICdwbHVnaW5zJzogW1xuICAgICd0eXBlcycsXG4gICAgJ3dob2xlcm93JyxcbiAgICAnY2hhbmdlZCcsXG4gICAgJ2NvbnRleHRtZW51JyxcbiAgICAnZG5kJyxcbiAgXSxcbiAgJ2NvcmUnOiB7XG4gICAgJ211bHRpcGxlJyA6IGZhbHNlLFxuICAgICdhbmltYXRpb24nOiAwLFxuICAgICdjaGVja19jYWxsYmFjayc6IGZ1bmN0aW9uIChvcCwgbm9kZSwgcGFyLCBwb3MsIG1vcmUpIHtcbiAgICAgIGlmKG9wID09PSAnbW92ZV9ub2RlJyAmJiBtb3JlICYmIG1vcmUucmVmICYmIG1vcmUucmVmLnR5cGUgJiYgIShtb3JlLnJlZi50eXBlID09ICdmb2xkZXInIHx8IG1vcmUucmVmLnR5cGUgPT0gJ3Jvb3QnKSl7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgaWYob3AgPT09ICdtb3ZlX25vZGUnICYmIG1vcmUgJiYgbW9yZS5yZWYgJiYgbW9yZS5yZWYudHlwZSAmJiBtb3JlLnJlZi50eXBlID09PSAnZm9sZGVyJyl7XG4gICAgICAgIGlmKCFtb3JlLnJlZi5zdGF0ZS5sb2FkZWQpe1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHZhciBleGlzdHMgPSBmYWxzZVxuICAgICAgICB2YXIgQnJlYWtFeGNlcHRpb24gPSB7fVxuICAgICAgICB0cnl7XG4gICAgICAgICAgbW9yZS5yZWYuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZF9ub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShjaGlsZClcbiAgICAgICAgICAgIGV4aXN0cyA9IGNoaWxkX25vZGUudGV4dCA9PT0gbm9kZS50ZXh0XG4gICAgICAgICAgICBpZihleGlzdHMpe1xuICAgICAgICAgICAgICB0aHJvdyBCcmVha0V4Y2VwdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9Y2F0Y2h7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZihvcCA9PT0gJ21vdmVfbm9kZScgJiYgbW9yZSAmJiAocG9zICE9IDAgfHwgbW9yZS5wb3MgIT09IFwiaVwiKSAmJiAhbW9yZS5jb3JlKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBpZihvcCA9PT0gJ21vdmVfbm9kZScgJiYgbW9yZSAmJiBtb3JlLmNvcmUpIHtcbiAgICAgICAgdmFyIG5ld0RpciA9IHBhci5vcmlnaW5hbC5fcGF0aFxuICAgICAgICB2YXIgZmlsZSA9IG5vZGUub3JpZ2luYWwuX3BhdGguc3BsaXQoJy8nKS5wb3AoKVxuICAgICAgICB2YXIgb2xkUGF0aCA9IG5vZGUub3JpZ2luYWwuX3BhdGhcbiAgICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwiL3N0b2Noc3MvYXBpL2ZpbGUvbW92ZVwiLCBvbGRQYXRoLCAnPC0tTW92ZVRvLS0+JywgbmV3RGlyLCBmaWxlKVxuICAgICAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbihlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgICAgaWYoYm9keS5zdGFydHNXaXRoKFwiU3VjY2VzcyFcIikpIHtcbiAgICAgICAgICAgIG5vZGUub3JpZ2luYWwuX3BhdGggPSBwYXRoLmpvaW4obmV3RGlyLCBmaWxlKVxuICAgICAgICAgICAgaWYocGFyLnR5cGUgPT09ICdyb290Jyl7XG4gICAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUocGFyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuICAgICd0aGVtZXMnOiB7XG4gICAgICAnc3RyaXBlcyc6IHRydWUsXG4gICAgICAndmFyaWFudCc6ICdsYXJnZSdcbiAgICB9LFxuICAgICdkYXRhJzogYWpheERhdGEsXG4gIH0sXG4gICd0eXBlcycgOiB7XG4gICAgJ3Jvb3QnIDoge1xuICAgICAgXCJpY29uXCI6IFwianN0cmVlLWljb24ganN0cmVlLWZvbGRlclwiXG4gICAgfSxcbiAgICAnZm9sZGVyJyA6IHtcbiAgICAgIFwiaWNvblwiOiBcImpzdHJlZS1pY29uIGpzdHJlZS1mb2xkZXJcIlxuICAgIH0sXG4gICAgJ3NwYXRpYWwnIDoge1xuICAgICAgXCJpY29uXCI6IFwianN0cmVlLWljb24ganN0cmVlLWZpbGVcIlxuICAgIH0sXG4gICAgJ25vbnNwYXRpYWwnIDoge1xuICAgICAgXCJpY29uXCI6IFwianN0cmVlLWljb24ganN0cmVlLWZpbGVcIlxuICAgIH0sXG4gICAgJ3dvcmtmbG93JyA6IHtcbiAgICAgIFwiaWNvblwiOiBcImpzdHJlZS1pY29uIGpzdHJlZS1maWxlXCJcbiAgICB9LFxuICAgICdub3RlYm9vaycgOiB7XG4gICAgICBcImljb25cIjogXCJqc3RyZWUtaWNvbiBqc3RyZWUtZmlsZVwiXG4gICAgfSxcbiAgICAnbWVzaCcgOiB7XG4gICAgICBcImljb25cIjogXCJqc3RyZWUtaWNvbiBqc3RyZWUtZmlsZVwiXG4gICAgfSxcbiAgICAnc2JtbC1tb2RlbCcgOiB7XG4gICAgICBcImljb25cIjogXCJqc3RyZWUtaWNvbiBqc3RyZWUtZmlsZVwiXG4gICAgfSxcbiAgICAnb3RoZXInIDoge1xuICAgICAgXCJpY29uXCI6IFwianN0cmVlLWljb24ganN0cmVlLWZpbGVcIlxuICAgIH0sXG4gIH0sICBcbn1cblxubGV0IG9wZXJhdGlvbkluZm9Nb2RhbEh0bWwgPSAoKSA9PiB7XG4gIGxldCBmaWxlQnJvd3NlckhlbHBNZXNzYWdlID0gYFxuICAgIDxwPjxiPk9wZW4vRWRpdCBhIEZpbGU8L2I+OiBEb3VibGUtY2xpY2sgb24gYSBmaWxlIG9yIHJpZ2h0LWNsaWNrIG9uIGEgZmlsZSBhbmQgY2xpY2sgT3Blbi9FZGl0LiAgXG4gICAgPGI+Tm90ZTwvYj46IFNvbWUgZmlsZXMgd2lsbCBvcGVuIGluIGEgbmV3IHRhYiBzbyB5b3UgbWF5IHdhbnQgdG8gdHVybiBvZmYgdGhlIHBvcC11cCBibG9ja2VyLjwvcD5cbiAgICA8cD48Yj5PcGVuIERpcmVjdG9yeTwvYj46IENsaWNrIG9uIHRoZSBhcnJvdyBuZXh0IHRvIHRoZSBkaXJlY3Rvcnkgb3IgZG91YmxlLWNsaWNrIG9uIHRoZSBkaXJlY3RvcnkuPC9wPlxuICAgIDxwPjxiPkNyZWF0ZSBhIERpcmVjdG9yeS9Nb2RlbDwvYj46IFJpZ2h0LWNsaWNrIG9uIGEgZGlyZWN0b3J5LCBjbGljayBOZXcgRGlyZWN0b3J5L05ldyBNb2RlbCwgYW5kIGVudGVyIHRoZSBuYW1lIG9mIGRpcmVjdG9yeS9tb2RlbCBvciBwYXRoLiAgXG4gICAgRm9yIG1vZGVscyB5b3Ugd2lsbCBuZWVkIHRvIGNsaWNrIG9uIHRoZSB0eXBlIG9mIG1vZGVsIHlvdSB3aXNoIHRvIGNyZWF0ZSBiZWZvcmUgZW50ZXJpbmcgdGhlIG5hbWUgb3IgcGF0aC48L3A+XG4gICAgPHA+PGI+Q3JlYXRlIGEgV29ya2Zsb3c8L2I+OiBSaWdodC1jbGljayBvbiBhIG1vZGVsIGFuZCBjbGljayBOZXcgV29ya2Zsb3csIHRoaXMgdGFrZXMgeW91IHRvIHRoZSB3b3JrZmxvdyBzZWxlY3Rpb24gcGFnZS4gIFxuICAgIEZyb20gdGhlIHdvcmtmbG93IHNlbGVjdGlvbiBwYWdlLCBjbGljayBvbiBvbmUgb2YgdGhlIGxpc3RlZCB3b3JrZmxvd3MuPC9wPlxuICAgIDxwPjxiPkNvbnZlcnQgYSBGaWxlPC9iPjogUmlnaHQtY2xpY2sgb24gYSBNb2RlbC9TQk1MLCBjbGljayBDb252ZXJ0LCBhbmQgY2xpY2sgb24gdGhlIGRlc2lyZWQgQ29udmVydCB0byBvcHRpb24uICBcbiAgICBNb2RlbCBmaWxlcyBjYW4gYmUgY29udmVydGVkIHRvIFNwYXRpYWwgTW9kZWxzLCBOb3RlYm9va3MsIG9yIFNCTUwgZmlsZXMuICBcbiAgICBTcGF0aWFsIE1vZGVscyBhbmQgU0JNTCBmaWxlIGNhbiBiZSBjb252ZXJ0ZWQgdG8gTW9kZWxzLiAgXG4gICAgPGI+Tm90ZTwvYj46IE5vdGVib29rcyB3aWxsIG9wZW4gaW4gYSBuZXcgdGFiIHNvIHlvdSBtYXkgd2FudCB0byB0dXJuIG9mZiB0aGUgcG9wLXVwIGJsb2NrZXIuPC9wPlxuICAgIDxwPjxiPk1vdmUgRmlsZSBvciBEaXJlY3Rvcnk8L2I+OiBDbGljayBhbmQgZHJhZyB0aGUgZmlsZSBvciBkaXJlY3RvcnkgdG8gdGhlIG5ldyBsb2NhdGlvbi4gIFxuICAgIFlvdSBjYW4gb25seSBtb3ZlIGFuIGl0ZW0gdG8gYSBkaXJlY3RvcnkgaWYgdGhlcmUgaXNuJ3QgYSBmaWxlIG9yIGRpcmVjdG9yeSB3aXRoIHRoZSBzYW1lIG5hbWUgaW4gdGhhdCBsb2NhdGlvbi48L3A+XG4gICAgPHA+PGI+RG93bmxvYWQgYSBNb2RlbC9Ob3RlYm9vay9TQk1MIEZpbGU8L2I+OiBSaWdodC1jbGljayBvbiB0aGUgZmlsZSBhbmQgY2xpY2sgZG93bmxvYWQuPC9wPlxuICAgIDxwPjxiPlJlbmFtZSBGaWxlL0RpcmVjdG9yeTwvYj46IFJpZ2h0LWNsaWNrIG9uIGEgZmlsZS9kaXJlY3RvcnksIGNsaWNrIHJlbmFtZSwgYW5kIGVudGVyIHRoZSBuZXcgbmFtZS48L3A+XG4gICAgPHA+PGI+RHVwbGljYXRlL0RlbGV0ZSBBIEZpbGUvRGlyZWN0b3J5PC9iPjogUmlnaHQtY2xpY2sgb24gdGhlIGZpbGUvZGlyZWN0b3J5IGFuZCBjbGljayBEdXBsaWNhdGUvRGVsZXRlLjwvcD5cbiAgYDtcbiAgXG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cIm9wZXJhdGlvbkluZm9Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj4gRmlsZSBCcm93c2VyIEhlbHAgPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxwPiAke2ZpbGVCcm93c2VySGVscE1lc3NhZ2V9IDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgIFxufVxuXG4vLyBVc2luZyBhIGJvb3RzdHJhcCBtb2RhbCB0byBpbnB1dCBtb2RlbCBuYW1lcyBmb3Igbm93XG5sZXQgcmVuZGVyQ3JlYXRlTW9kYWxIdG1sID0gKGlzTW9kZWwsIGlzU3BhdGlhbCkgPT4ge1xuICB2YXIgdGl0bGVUZXh0ID0gJ0RpcmVjdG9yeSc7XG4gIGlmKGlzTW9kZWwpe1xuICAgIHRpdGxlVGV4dCA9IGlzU3BhdGlhbCA/ICdTcGF0aWFsIE1vZGVsJyA6ICdOb24tU3BhdGlhbCBNb2RlbCc7XG4gIH1cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwibmV3TW9kYWxNb2RlbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+TmV3ICR7dGl0bGVUZXh0fTwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibW9kZWxOYW1lSW5wdXRcIj5OYW1lOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cIm1vZGVsTmFtZUlucHV0XCIgbmFtZT1cIm1vZGVsTmFtZUlucHV0XCIgc2l6ZT1cIjMwXCIgYXV0b2ZvY3VzPlxuXHQgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IG9rLW1vZGVsLWJ0blwiPk9LPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbmxldCBzYm1sVG9Nb2RlbEh0bWwgPSAodGl0bGUsIGVycm9ycykgPT4ge1xuICBmb3IodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYoZXJyb3JzW2ldLnN0YXJ0c1dpdGgoXCJTQk1MIEVycm9yXCIpIHx8IGVycm9yc1tpXS5zdGFydHNXaXRoKFwiRXJyb3JcIikpe1xuICAgICAgZXJyb3JzW2ldID0gXCI8Yj5FcnJvcjwvYj46IFwiICsgZXJyb3JzW2ldXG4gICAgfWVsc2V7XG4gICAgICBlcnJvcnNbaV0gPSBcIjxiPldhcm5pbmc8L2I+OiBcIiArIGVycm9yc1tpXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cInNibWxUb01vZGVsTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQgaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+ICR7dGl0bGV9IDwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8cD4gJHtlcnJvcnMuam9pbihcIjxicj5cIil9IDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbmxldCBkZWxldGVGaWxlSHRtbCA9IChmaWxlVHlwZSkgPT4ge1xuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJkZWxldGVGaWxlTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQgaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+IFBlcm1hbmVudGx5IGRlbGV0ZSB0aGlzICR7ZmlsZVR5cGV9PyA8L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSB5ZXMtbW9kYWwtYnRuXCI+WWVzPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5ObzwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbmxldCBGaWxlQnJvd3NlciA9IFBhZ2VWaWV3LmV4dGVuZCh7XG4gIHBhZ2VUaXRsZTogJ1N0b2NoU1MgfCBGaWxlIEJyb3dzZXInLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXJlZnJlc2gtanN0cmVlXScgOiAncmVmcmVzaEpTVHJlZScsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZmlsZS1icm93c2VyLWhlbHBdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBtb2RhbCA9ICQob3BlcmF0aW9uSW5mb01vZGFsSHRtbCgpKS5tb2RhbCgpO1xuICAgIH0sXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIHRoaXMuc2V0dXBKc3RyZWUoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYucmVmcmVzaEluaXRpYWxKU1RyZWUoKTtcbiAgICB9LCAzMDAwKTtcbiAgfSxcbiAgcmVmcmVzaEpTVHJlZTogZnVuY3Rpb24gKCkge1xuICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpXG4gIH0sXG4gIHJlZnJlc2hJbml0aWFsSlNUcmVlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjb3VudCA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuX21vZGVsLmRhdGFbJyMnXS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgaWYoY291bnQgPT0gMCkge1xuICAgICAgc2VsZi5yZWZyZXNoSlNUcmVlKCk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5yZWZyZXNoSW5pdGlhbEpTVHJlZSgpO1xuICAgICAgfSwgMzAwMCk7XG4gICAgfVxuICB9LFxuICBkZWxldGVGaWxlOiBmdW5jdGlvbiAobykge1xuICAgIHZhciBmaWxlVHlwZSA9IG8udHlwZVxuICAgIGlmKGZpbGVUeXBlID09PSBcIm5vbnNwYXRpYWxcIilcbiAgICAgIGZpbGVUeXBlID0gXCJtb2RlbFwiO1xuICAgIGVsc2UgaWYoZmlsZVR5cGUgPT09IFwic3BhdGlhbFwiKVxuICAgICAgZmlsZVR5cGUgPSBcInNwYXRpYWwgbW9kZWxcIlxuICAgIGVsc2UgaWYoZmlsZVR5cGUgPT09IFwic2JtbC1tb2RlbFwiKVxuICAgICAgZmlsZVR5cGUgPSBcInNibWwgbW9kZWxcIlxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWxldGVGaWxlTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbGV0ZUZpbGVNb2RhbCcpLnJlbW92ZSgpXG4gICAgfVxuICAgIGxldCBtb2RhbCA9ICQoZGVsZXRlRmlsZUh0bWwoZmlsZVR5cGUpKS5tb2RhbCgpO1xuICAgIGxldCB5ZXNCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVsZXRlRmlsZU1vZGFsIC55ZXMtbW9kYWwtYnRuJyk7XG4gICAgeWVzQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihcIi9zdG9jaHNzL2FwaS9maWxlL2RlbGV0ZVwiLCBvLm9yaWdpbmFsLl9wYXRoKVxuICAgICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24oZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICB2YXIgbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUoby5wYXJlbnQpO1xuICAgICAgICBpZihub2RlLnR5cGUgPT09IFwicm9vdFwiKXtcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBtb2RhbC5tb2RhbCgnaGlkZScpXG4gICAgfSk7XG4gIH0sXG4gIGR1cGxpY2F0ZUZpbGVPckRpcmVjdG9yeTogZnVuY3Rpb24obywgaXNEaXJlY3RvcnkpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHBhcmVudElEID0gby5wYXJlbnQ7XG4gICAgaWYoaXNEaXJlY3Rvcnkpe1xuICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwiL3N0b2Noc3MvYXBpL2RpcmVjdG9yeS9kdXBsaWNhdGVcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgfWVsc2V7XG4gICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9hcGkvbW9kZWwvZHVwbGljYXRlXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIH1cbiAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBcbiAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShwYXJlbnRJRCk7XG4gICAgICAgIGlmKG5vZGUudHlwZSA9PT0gXCJyb290XCIpe1xuICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpXG4gICAgICAgIH1lbHNleyAgICAgICAgICBcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH0sXG4gIHRvU3BhdGlhbDogZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHBhcmVudElEID0gby5wYXJlbnQ7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwiL3N0b2Noc3MvYXBpL21vZGVsL3RvLXNwYXRpYWxcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgXG4gICAgICBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICB2YXIgbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUocGFyZW50SUQpO1xuICAgICAgICBpZihub2RlLnR5cGUgPT09IFwicm9vdFwiKXtcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICB9ZWxzZXsgICAgICAgICAgXG4gICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9LFxuICB0b01vZGVsOiBmdW5jdGlvbiAobywgZnJvbSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcGFyZW50SUQgPSBvLnBhcmVudDtcbiAgICBpZihmcm9tID09PSBcIlNwYXRpYWxcIil7XG4gICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9hcGkvc3BhdGlhbC90by1tb2RlbFwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICB9ZWxzZXtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihcIi9zdG9jaHNzL2FwaS9zYm1sL3RvLW1vZGVsXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIH1cbiAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBcbiAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShwYXJlbnRJRCk7XG4gICAgICAgIGlmKG5vZGUudHlwZSA9PT0gXCJyb290XCIpe1xuICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpXG4gICAgICAgIH1lbHNleyAgICAgICAgICBcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZihmcm9tID09PSBcIlNCTUxcIil7XG4gICAgICAgICAgdmFyIHRpdGxlID0gXCJcIlxuICAgICAgICAgIHZhciByZXNwID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICAgIHZhciBtc2cgPSByZXNwLm1lc3NhZ2VcbiAgICAgICAgICB2YXIgZXJyb3JzID0gcmVzcC5lcnJvcnNcbiAgICAgICAgICBsZXQgbW9kYWwgPSAkKHNibWxUb01vZGVsSHRtbChtc2csIGVycm9ycykpLm1vZGFsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9LFxuICB0b1NCTUw6IGZ1bmN0aW9uIChvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBwYXJlbnRJRCA9IG8ucGFyZW50O1xuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihcIi9zdG9jaHNzL2FwaS9tb2RlbC90by1zYm1sXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIHhocih7dXJpOiBlbmRwb2ludH0sXG4gICAgICBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICB2YXIgbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUocGFyZW50SUQpO1xuICAgICAgICBpZihub2RlLnR5cGUgPT09IFwicm9vdFwiKXtcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICB9ZWxzZXsgICAgICAgICAgXG4gICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9LFxuICByZW5hbWVOb2RlOiBmdW5jdGlvbiAobykge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciB0ZXh0ID0gby50ZXh0O1xuICAgIHZhciBwYXJlbnQgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKG8ucGFyZW50KVxuICAgIHZhciBleHRlbnNpb25XYXJuaW5nID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdleHRlbnNpb24td2FybmluZycpKTtcbiAgICB2YXIgbmFtZVdhcm5pbmcgPSAkKHRoaXMucXVlcnlCeUhvb2soJ3JlbmFtZS13YXJuaW5nJykpO1xuICAgIGV4dGVuc2lvbldhcm5pbmcuY29sbGFwc2UoJ3Nob3cnKVxuICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZWRpdChvLCBudWxsLCBmdW5jdGlvbihub2RlLCBzdGF0dXMpIHtcbiAgICAgIGlmKHRleHQgIT0gbm9kZS50ZXh0KXtcbiAgICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwiL3N0b2Noc3MvYXBpL2ZpbGUvcmVuYW1lXCIsIG8ub3JpZ2luYWwuX3BhdGgsIFwiPC0tY2hhbmdlLS0+XCIsIG5vZGUudGV4dClcbiAgICAgICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpe1xuICAgICAgICAgIHZhciByZXNwID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICAgIGlmKCFyZXNwLm1lc3NhZ2Uuc3RhcnRzV2l0aCgnU3VjY2VzcyEnKSkge1xuICAgICAgICAgICAgbmFtZVdhcm5pbmcuaHRtbChyZXNwLm1lc3NhZ2UpXG4gICAgICAgICAgICBuYW1lV2FybmluZy5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub2RlLm9yaWdpbmFsLl9wYXRoID0gcmVzcC5fcGF0aFxuICAgICAgICAgIGlmKHBhcmVudC50eXBlID09PSBcInJvb3RcIil7XG4gICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICAgIH1lbHNleyAgICAgICAgICBcbiAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKHBhcmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZXh0ZW5zaW9uV2FybmluZy5jb2xsYXBzZSgnaGlkZScpO1xuICAgICAgbmFtZVdhcm5pbmcuY29sbGFwc2UoJ2hpZGUnKTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0SnNvbkZpbGVGb3JFeHBvcnQ6IGZ1bmN0aW9uIChvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihcIi9zdG9jaHNzL2FwaS9qc29uLWRhdGFcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgIHZhciByZXNwID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgIHNlbGYuZXhwb3J0VG9Kc29uRmlsZShyZXNwLCBvLm9yaWdpbmFsLnRleHQpO1xuICAgIH0pO1xuICB9LFxuICBnZXRGaWxlRm9yRXhwb3J0OiBmdW5jdGlvbiAobykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9hcGkvZmlsZS9kb3dubG9hZFwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgc2VsZi5leHBvcnRUb0ZpbGUoYm9keSwgby5vcmlnaW5hbC50ZXh0KTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0WmlwRmlsZUZvckV4cG9ydDogZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwiL3N0b2Noc3MvYXBpL2ZpbGUvZG93bmxvYWQtemlwL2dlbmVyYXRlXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICB2YXIgZmlsZVBhdGggPSBib2R5LnNwbGl0KCcvaG9tZS9qb3Z5YW4nKS5wb3AoKVxuICAgICAgdmFyIG5vZGUgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKG8ucGFyZW50KTtcbiAgICAgIGlmKG5vZGUudHlwZSA9PT0gXCJyb290XCIpe1xuICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuZXhwb3J0VG9aaXBGaWxlKGZpbGVQYXRoKVxuICAgIH0pO1xuICB9LFxuICBleHBvcnRUb0pzb25GaWxlOiBmdW5jdGlvbiAoZmlsZURhdGEsIGZpbGVOYW1lKSB7XG4gICAgbGV0IGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShmaWxlRGF0YSk7XG4gICAgbGV0IGRhdGFVUkkgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhU3RyKTtcbiAgICBsZXQgZXhwb3J0RmlsZURlZmF1bHROYW1lID0gZmlsZU5hbWVcblxuICAgIGxldCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVVJJKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZXhwb3J0RmlsZURlZmF1bHROYW1lKTtcbiAgICBsaW5rRWxlbWVudC5jbGljaygpO1xuICB9LFxuICBleHBvcnRUb0ZpbGU6IGZ1bmN0aW9uIChmaWxlRGF0YSwgZmlsZU5hbWUpIHtcbiAgICBsZXQgZGF0YVVSSSA9ICdkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KGZpbGVEYXRhKTtcblxuICAgIGxldCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVVJJKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZU5hbWUpO1xuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XG4gIH0sXG4gIGV4cG9ydFRvWmlwRmlsZTogZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgdGFyZ2V0UGF0aCA9IG9cbiAgICBpZihvLm9yaWdpbmFsKXtcbiAgICAgIHRhcmdldFBhdGggPSBvLm9yaWdpbmFsLl9wYXRoXG4gICAgfVxuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihcIi9maWxlc1wiLCB0YXJnZXRQYXRoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGVuZHBvaW50XG4gIH0sXG4gIG5ld01vZGVsT3JEaXJlY3Rvcnk6IGZ1bmN0aW9uIChvLCBpc01vZGVsLCBpc1NwYXRpYWwpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3TW9kYWxNb2RlbCcpKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3TW9kYWxNb2RlbCcpLnJlbW92ZSgpXG4gICAgfVxuICAgIGxldCBtb2RhbCA9ICQocmVuZGVyQ3JlYXRlTW9kYWxIdG1sKGlzTW9kZWwsIGlzU3BhdGlhbCkpLm1vZGFsKCk7XG4gICAgbGV0IG9rQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ld01vZGFsTW9kZWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXdNb2RhbE1vZGVsICNtb2RlbE5hbWVJbnB1dCcpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT09IDEzKXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb2tCdG4uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsZXQgbW9kZWxOYW1lO1xuICAgIG9rQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChCb29sZWFuKGlucHV0LnZhbHVlKSkge1xuICAgICAgICBpZihpc01vZGVsKSB7XG4gICAgICAgICAgbGV0IG1vZGVsTmFtZSA9IGlucHV0LnZhbHVlICsgJy5tZGwnO1xuICAgICAgICAgIHZhciBwYXJlbnRQYXRoID0gby5vcmlnaW5hbC5fcGF0aFxuICAgICAgICAgIHZhciBtb2RlbFBhdGggPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9tb2RlbHMvZWRpdFwiLCBwYXJlbnRQYXRoLCBtb2RlbE5hbWUpO1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbW9kZWxQYXRoO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBsZXQgZGlyTmFtZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIHZhciBwYXJlbnRQYXRoID0gby5vcmlnaW5hbC5fcGF0aDtcbiAgICAgICAgICBsZXQgZW5kcG9pbnQgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9hcGkvZGlyZWN0b3J5L2NyZWF0ZVwiLCBwYXJlbnRQYXRoLCBkaXJOYW1lKTtcbiAgICAgICAgICB4aHIoe3VyaTplbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUobyk7XG4gICAgICAgICAgICBpZihub2RlLnR5cGUgPT09IFwicm9vdFwiKXtcbiAgICAgICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoKClcbiAgICAgICAgICAgIH1lbHNleyAgICAgICAgICBcbiAgICAgICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHNldHVwSnN0cmVlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICQuanN0cmVlLmRlZmF1bHRzLmNvbnRleHRtZW51Lml0ZW1zID0gKG8sIGNiKSA9PiB7XG4gICAgICBpZiAoby50eXBlID09PSAncm9vdCcpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiUmVmcmVzaFwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJSZWZyZXNoXCIsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9jbGFzc1wiIDogXCJmb250LXdlaWdodC1ib2xkXCIsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IHRydWUsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIk5ld19EaXJlY3RvcnlcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk5ldyBEaXJlY3RvcnlcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLm5ld01vZGVsT3JEaXJlY3RvcnkobywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiTmV3X21vZGVsXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk5ldyBNb2RlbFwiLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic3VibWVudVwiIDoge1xuICAgICAgICAgICAgICBcInNwYXRpYWxcIiA6IHtcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIlNwYXRpYWxcIixcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJub25zcGF0aWFsXCIgOiB7IFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiTm9uLVNwYXRpYWxcIixcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLm5ld01vZGVsT3JEaXJlY3RvcnkobywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChvLnR5cGUgPT09ICAnZm9sZGVyJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiUmVmcmVzaFwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJSZWZyZXNoXCIsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9jbGFzc1wiIDogXCJmb250LXdlaWdodC1ib2xkXCIsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IHRydWUsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIk5ld19EaXJlY3RvcnlcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk5ldyBEaXJlY3RvcnlcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLm5ld01vZGVsT3JEaXJlY3RvcnkobywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiTmV3X21vZGVsXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk5ldyBNb2RlbFwiLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic3VibWVudVwiIDoge1xuICAgICAgICAgICAgICBcInNwYXRpYWxcIiA6IHtcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIlNwYXRpYWxcIixcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJub25zcGF0aWFsXCIgOiB7IFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiTm9uLVNwYXRpYWxcIixcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLm5ld01vZGVsT3JEaXJlY3RvcnkobywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRG93bmxvYWRcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRvd25sb2FkIGFzIC56aXBcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmdldFppcEZpbGVGb3JFeHBvcnQobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIlJlbmFtZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiUmVuYW1lXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5yZW5hbWVOb2RlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEdXBsaWNhdGVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkR1cGxpY2F0ZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZHVwbGljYXRlRmlsZU9yRGlyZWN0b3J5KG8sIHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRlbGV0ZVwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEZWxldGVcIixcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kZWxldGVGaWxlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG8udHlwZSA9PT0gJ3NwYXRpYWwnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgXCJFZGl0XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IHRydWUsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogdHJ1ZSxcbiAgICAgICAgICAgIFwiX2NsYXNzXCIgOiBcImZvbnQtd2VpZ2h0LWJvbGRlclwiLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJFZGl0XCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9tb2RlbHMvZWRpdFwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiQ29udmVydFwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJDb252ZXJ0XCIsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzdWJtZW51XCIgOiB7XG4gICAgICAgICAgICAgIFwiQ29udmVydCB0byBNb2RlbFwiIDoge1xuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIkNvbnZlcnQgdG8gTm9uIFNwYXRpYWxcIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYudG9Nb2RlbChvLCBcIlNwYXRpYWxcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIkNvbnZlcnQgdG8gTm90ZWJvb2tcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIkNvbnZlcnQgdG8gTm90ZWJvb2tcIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIk5ldyBXb3JrZmxvd1wiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiTmV3IFdvcmtmbG93XCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy93b3JrZmxvdy9zZWxlY3Rpb25cIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIlJlbmFtZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiUmVuYW1lXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5yZW5hbWVOb2RlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEdXBsaWNhdGVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkR1cGxpY2F0ZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZHVwbGljYXRlRmlsZU9yRGlyZWN0b3J5KG8sIGZhbHNlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEZWxldGVcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRGVsZXRlXCIsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZGVsZXRlRmlsZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChvLnR5cGUgPT09ICdub25zcGF0aWFsJykge1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBcIkVkaXRcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogdHJ1ZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2NsYXNzXCIgOiBcImZvbnQtd2VpZ2h0LWJvbGRlclwiLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJFZGl0XCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9tb2RlbHMvZWRpdFwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiQ29udmVydFwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJDb252ZXJ0XCIsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzdWJtZW51XCIgOiB7XG4gICAgICAgICAgICAgIFwiQ29udmVydCB0byBTcGF0aWFsXCIgOiB7XG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiVG8gU3BhdGlhbCBNb2RlbFwiLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgc2VsZi50b1NwYXRpYWwobylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiQ29udmVydCB0byBOb3RlYm9va1wiIDoge1xuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIlRvIE5vdGVib29rXCIsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9hcGkvbW9kZWxzL3RvLW5vdGVib29rXCIsIG8ub3JpZ2luYWwuX3BhdGgpXG4gICAgICAgICAgICAgICAgICB4aHIoeyB1cmk6IGVuZHBvaW50IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUoby5wYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIGlmKG5vZGUudHlwZSA9PT0gJ3Jvb3QnKXtcbiAgICAgICAgICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIF9wYXRoID0gYm9keS5zcGxpdCgnICcpWzBdLnNwbGl0KCcvaG9tZS9qb3Z5YW4vJykucG9wKClcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vdGVib29rUGF0aCA9IHBhdGguam9pbihcIi9sYWIvdHJlZVwiLCBfcGF0aClcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4obm90ZWJvb2tQYXRoLCAnX2JsYW5rJylcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJDb252ZXJ0IHRvIFNCTUxcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJUbyBTQk1MIE1vZGVsXCIsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLnRvU0JNTChvKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiTmV3IFdvcmtmbG93XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJOZXcgV29ya2Zsb3dcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihcIi9zdG9jaHNzL3dvcmtmbG93L3NlbGVjdGlvblwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRG93bmxvYWRcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRvd25sb2FkXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5nZXRKc29uRmlsZUZvckV4cG9ydChvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiUmVuYW1lXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJSZW5hbWVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLnJlbmFtZU5vZGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkR1cGxpY2F0ZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kdXBsaWNhdGVGaWxlT3JEaXJlY3RvcnkobywgZmFsc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRlbGV0ZVwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEZWxldGVcIixcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kZWxldGVGaWxlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cdCAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG8udHlwZSA9PT0gJ3dvcmtmbG93Jykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiT3BlblwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIiA6IFwiZm9udC13ZWlnaHQtYm9sZGVyXCIsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk9wZW5cIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihcIi9zdG9jaHNzL3dvcmtmbG93L2VkaXQvbm9uZVwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiU3RhcnQvUmVzdGFydCBXb3JrZmxvd1wiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJTdGFydC9SZXN0YXJ0IFdvcmtmbG93XCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJTdG9wIFdvcmtmbG93XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlN0b3AgV29ya2Zsb3dcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIk1vZGVsXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJNb2RlbFwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzdWJtZW51XCIgOiB7XG4gICAgICAgICAgICAgIFwiRWRpdFwiIDoge1xuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiIEVkaXRcIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJEdXBsaWNhdGVcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIkR1cGxpY2F0ZVwiLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRvd25sb2FkXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEb3dubG9hZCBhcyAuemlwXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5nZXRaaXBGaWxlRm9yRXhwb3J0KG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJSZW5hbWVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlbmFtZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYucmVuYW1lTm9kZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRGVsZXRlXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRlbGV0ZVwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnbm90ZWJvb2snKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgXCJPcGVuXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IHRydWUsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9jbGFzc1wiIDogXCJmb250LXdlaWdodC1ib2xkZXJcIixcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiT3BlblwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHBhdGguam9pbihcIi9sYWIvdHJlZVwiLCBvLm9yaWdpbmFsLl9wYXRoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRvd25sb2FkXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEb3dubG9hZFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZ2V0SnNvbkZpbGVGb3JFeHBvcnQobyk7XG4gICAgICBcdCAgICB9XG4gICAgICBcdCAgfSxcbiAgICAgICAgICBcIlJlbmFtZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiUmVuYW1lXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5yZW5hbWVOb2RlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEdXBsaWNhdGVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkR1cGxpY2F0ZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZHVwbGljYXRlRmlsZU9yRGlyZWN0b3J5KG8sIGZhbHNlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEZWxldGVcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRGVsZXRlXCIsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZGVsZXRlRmlsZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChvLnR5cGUgPT09ICdzYm1sLW1vZGVsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiT3BlblwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIiA6IFwiZm9udC13ZWlnaHQtYm9sZGVyXCIsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk9wZW4gRmlsZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHZhciBmaWxlUGF0aCA9IG8ub3JpZ2luYWwuX3BhdGhcbiAgICAgICAgICAgICAgd2luZG93Lm9wZW4ocGF0aC5qb2luKFwiL2xhYi90cmVlXCIsIGZpbGVQYXRoKSwgJ19ibGFuaycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkNvbnZlcnRcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiQ29udmVydFwiLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic3VibWVudVwiIDoge1xuICAgICAgICAgICAgICBcIkNvbnZlcnQgdG8gTW9kZWxcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJUbyBNb2RlbFwiLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgc2VsZi50b01vZGVsKG8sIFwiU0JNTFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRvd25sb2FkXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEb3dubG9hZFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZ2V0RmlsZUZvckV4cG9ydChvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiUmVuYW1lXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJSZW5hbWVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLnJlbmFtZU5vZGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkR1cGxpY2F0ZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kdXBsaWNhdGVGaWxlT3JEaXJlY3RvcnkobywgZmFsc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRlbGV0ZVwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEZWxldGVcIixcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kZWxldGVGaWxlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiT3BlblwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICBcIl9jbGFzc1wiIDogXCJmb250LXdlaWdodC1ib2xkZXJcIixcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiT3BlblwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRvd25sb2FkXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEb3dubG9hZCBhcyAuemlwXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgaWYoby5vcmlnaW5hbC50ZXh0LmVuZHNXaXRoKCcuemlwJykpe1xuICAgICAgICAgICAgICAgIHNlbGYuZXhwb3J0VG9aaXBGaWxlKG8pO1xuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzZWxmLmdldFppcEZpbGVGb3JFeHBvcnQobylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJSZW5hbWVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlbmFtZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYucmVuYW1lTm9kZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRHVwbGljYXRlXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEdXBsaWNhdGVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmR1cGxpY2F0ZUZpbGVPckRpcmVjdG9yeShvLCBmYWxzZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRGVsZXRlXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRlbGV0ZVwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAkKGRvY3VtZW50KS5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJCgnW2F1dG9mb2N1c10nLCBlLnRhcmdldCkuZm9jdXMoKTtcbiAgICB9KTtcbiAgICAkKGRvY3VtZW50KS5vbignZG5kX3N0YXJ0LnZha2F0YScsIGZ1bmN0aW9uIChkYXRhLCBlbGVtZW50LCBoZWxwZXIsIGV2ZW50KSB7XG4gICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmxvYWRfYWxsKClcbiAgICB9KTtcbiAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSh0cmVlU2V0dGluZ3MpXG4gICAgJCgnI21vZGVscy1qc3RyZWUnKS5vbignY2xpY2suanN0cmVlJywgZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIHBhcmVudCA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnRcbiAgICAgIHZhciBfbm9kZSA9IHBhcmVudC5jaGlsZHJlbltwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMV1cbiAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShfbm9kZSlcbiAgICAgIGlmKF9ub2RlLm5vZGVOYW1lID09PSBcIkFcIiAmJiAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmlzX2xvYWRlZChub2RlKSAmJiBub2RlLnR5cGUgPT09IFwiZm9sZGVyXCIpe1xuICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKVxuICAgICAgfVxuICAgIH0pO1xuICAgICQoJyNtb2RlbHMtanN0cmVlJykub24oJ2RibGNsaWNrLmpzdHJlZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBmaWxlID0gZS50YXJnZXQudGV4dFxuICAgICAgdmFyIG5vZGUgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKGUudGFyZ2V0KVxuICAgICAgdmFyIF9wYXRoID0gbm9kZS5vcmlnaW5hbC5fcGF0aDtcbiAgICAgIGlmKGZpbGUuZW5kc1dpdGgoJy5tZGwnKSB8fCBmaWxlLmVuZHNXaXRoKCcuc21kbCcpKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9tb2RlbHMvZWRpdFwiLCBfcGF0aCk7XG4gICAgICB9ZWxzZSBpZihmaWxlLmVuZHNXaXRoKCcuaXB5bmInKSl7XG4gICAgICAgIHZhciBub3RlYm9va1BhdGggPSBwYXRoLmpvaW4oXCIvbGFiL3RyZWUvXCIsIF9wYXRoKVxuICAgICAgICB3aW5kb3cub3Blbihub3RlYm9va1BhdGgsICdfYmxhbmsnKVxuICAgICAgfWVsc2UgaWYoZmlsZS5lbmRzV2l0aCgnLnNibWwnKSl7XG4gICAgICAgIHZhciBvcGVuUGF0aCA9IHBhdGguam9pbihcIi9sYWIvdHJlZS9cIiwgX3BhdGgpXG4gICAgICAgIHdpbmRvdy5vcGVuKG9wZW5QYXRoLCAnX2JsYW5rJylcbiAgICAgIH1lbHNlIGlmKGZpbGUuZW5kc1dpdGgoJy53a2ZsJykpe1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihcIi9zdG9jaHNzL3dvcmtmbG93L2VkaXQvbm9uZVwiLCBfcGF0aCk7XG4gICAgICB9ZWxzZSBpZihub2RlLnR5cGUgPT09IFwiZm9sZGVyXCIgJiYgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5pc19vcGVuKG5vZGUpICYmICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuaXNfbG9hZGVkKG5vZGUpKXtcbiAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSlcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmluaXRQYWdlKEZpbGVCcm93c2VyKTtcbiIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzZWN0aW9uIGNsYXNzPVxcXCJwYWdlIGNvbC1tZC0xMFxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIlxcdTAwM0VcXHUwMDNDaDJcXHUwMDNFRmlsZSBCcm93c2VyXFx1MDAzQ1xcdTAwMkZoMlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gaW5mb3JtYXRpb24tYnRuIGhlbHBcXFwiIGRhdGEtaG9vaz1cXFwiZmlsZS1icm93c2VyLWhlbHBcXFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhclxcXCIgZGF0YS1pY29uPVxcXCJxdWVzdGlvbi1jaXJjbGVcXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1xdWVzdGlvbi1jaXJjbGUgZmEtdy0xNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCA1MTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yNTYgOEMxMTkuMDQzIDggOCAxMTkuMDgzIDggMjU2YzAgMTM2Ljk5NyAxMTEuMDQzIDI0OCAyNDggMjQ4czI0OC0xMTEuMDAzIDI0OC0yNDhDNTA0IDExOS4wODMgMzkyLjk1NyA4IDI1NiA4em0wIDQ0OGMtMTEwLjUzMiAwLTIwMC04OS40MzEtMjAwLTIwMCAwLTExMC40OTUgODkuNDcyLTIwMCAyMDAtMjAwIDExMC40OTEgMCAyMDAgODkuNDcxIDIwMCAyMDAgMCAxMTAuNTMtODkuNDMxIDIwMC0yMDAgMjAwem0xMDcuMjQ0LTI1NS4yYzAgNjcuMDUyLTcyLjQyMSA2OC4wODQtNzIuNDIxIDkyLjg2M1YzMDBjMCA2LjYyNy01LjM3MyAxMi0xMiAxMmgtNDUuNjQ3Yy02LjYyNyAwLTEyLTUuMzczLTEyLTEydi04LjY1OWMwLTM1Ljc0NSAyNy4xLTUwLjAzNCA0Ny41NzktNjEuNTE2IDE3LjU2MS05Ljg0NSAyOC4zMjQtMTYuNTQxIDI4LjMyNC0yOS41NzkgMC0xNy4yNDYtMjEuOTk5LTI4LjY5My0zOS43ODQtMjguNjkzLTIzLjE4OSAwLTMzLjg5NCAxMC45NzctNDguOTQyIDI5Ljk2OS00LjA1NyA1LjEyLTExLjQ2IDYuMDcxLTE2LjY2NiAyLjEyNGwtMjcuODI0LTIxLjA5OGMtNS4xMDctMy44NzItNi4yNTEtMTEuMDY2LTIuNjQ0LTE2LjM2M0MxODQuODQ2IDEzMS40OTEgMjE0Ljk0IDExMiAyNjEuNzk0IDExMmM0OS4wNzEgMCAxMDEuNDUgMzguMzA0IDEwMS40NSA4OC44ek0yOTggMzY4YzAgMjMuMTU5LTE4Ljg0MSA0Mi00MiA0MnMtNDItMTguODQxLTQyLTQyIDE4Ljg0MS00MiA0Mi00MiA0MiAxOC44NDEgNDIgNDJ6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiYWxlcnQtd2FybmluZyBjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJleHRlbnNpb24td2FybmluZ1xcXCJcXHUwMDNFWW91IHNob3VsZCBhdm9pZCBjaGFuZ2luZyB0aGUgZmlsZSBleHRlbnNpb24gdW5sZXNzIHlvdSBrbm93IHdoYXQgeW91IGFyZSBkb2luZyFcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJhbGVydC13YXJuaW5nIGNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcInJlbmFtZS13YXJuaW5nXFxcIlxcdTAwM0VNRVNTQUdFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLWxnLTEwXFxcIiBpZD1cXFwibW9kZWxzLWpzdHJlZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJlZnJlc2gtanN0cmVlXFxcIlxcdTAwM0VSZWZyZXNoXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWN0aW9uXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwiLypnbG9iYWxzIGpRdWVyeSwgZGVmaW5lLCBtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIHdpbmRvdywgZG9jdW1lbnQsIHBvc3RNZXNzYWdlICovXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG5cdH1cblx0ZWxzZSBpZih0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0ZmFjdG9yeShqUXVlcnkpO1xuXHR9XG59KGZ1bmN0aW9uICgkLCB1bmRlZmluZWQpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG4vKiFcbiAqIGpzVHJlZSAzLjMuOFxuICogaHR0cDovL2pzdHJlZS5jb20vXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEl2YW4gQm96aGFub3YgKGh0dHA6Ly92YWthdGEuY29tKVxuICpcbiAqIExpY2Vuc2VkIHNhbWUgYXMganF1ZXJ5IC0gdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgTGljZW5zZVxuICogICBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4vKiFcbiAqIGlmIHVzaW5nIGpzbGludCBwbGVhc2UgYWxsb3cgZm9yIHRoZSBqUXVlcnkgZ2xvYmFsIGFuZCB1c2UgZm9sbG93aW5nIG9wdGlvbnM6XG4gKiBqc2xpbnQ6IGxvb3BmdW5jOiB0cnVlLCBicm93c2VyOiB0cnVlLCBhc3M6IHRydWUsIGJpdHdpc2U6IHRydWUsIGNvbnRpbnVlOiB0cnVlLCBub21lbjogdHJ1ZSwgcGx1c3BsdXM6IHRydWUsIHJlZ2V4cDogdHJ1ZSwgdW5wYXJhbTogdHJ1ZSwgdG9kbzogdHJ1ZSwgd2hpdGU6IHRydWVcbiAqL1xuLypqc2hpbnQgLVcwODMgKi9cblxuXHQvLyBwcmV2ZW50IGFub3RoZXIgbG9hZD8gbWF5YmUgdGhlcmUgaXMgYSBiZXR0ZXIgd2F5P1xuXHRpZigkLmpzdHJlZSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8qKlxuXHQgKiAjIyMganNUcmVlIGNvcmUgZnVuY3Rpb25hbGl0eVxuXHQgKi9cblxuXHQvLyBpbnRlcm5hbCB2YXJpYWJsZXNcblx0dmFyIGluc3RhbmNlX2NvdW50ZXIgPSAwLFxuXHRcdGNjcF9ub2RlID0gZmFsc2UsXG5cdFx0Y2NwX21vZGUgPSBmYWxzZSxcblx0XHRjY3BfaW5zdCA9IGZhbHNlLFxuXHRcdHRoZW1lc19sb2FkZWQgPSBbXSxcblx0XHRzcmMgPSAkKCdzY3JpcHQ6bGFzdCcpLmF0dHIoJ3NyYycpLFxuXHRcdGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50OyAvLyBsb2NhbCB2YXJpYWJsZSBpcyBhbHdheXMgZmFzdGVyIHRvIGFjY2VzcyB0aGVuIGEgZ2xvYmFsXG5cblx0LyoqXG5cdCAqIGhvbGRzIGFsbCBqc3RyZWUgcmVsYXRlZCBmdW5jdGlvbnMgYW5kIHZhcmlhYmxlcywgaW5jbHVkaW5nIHRoZSBhY3R1YWwgY2xhc3MgYW5kIG1ldGhvZHMgdG8gY3JlYXRlLCBhY2Nlc3MgYW5kIG1hbmlwdWxhdGUgaW5zdGFuY2VzLlxuXHQgKiBAbmFtZSAkLmpzdHJlZVxuXHQgKi9cblx0JC5qc3RyZWUgPSB7XG5cdFx0LyoqXG5cdFx0ICogc3BlY2lmaWVzIHRoZSBqc3RyZWUgdmVyc2lvbiBpbiB1c2Vcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS52ZXJzaW9uXG5cdFx0ICovXG5cdFx0dmVyc2lvbiA6ICczLjMuOCcsXG5cdFx0LyoqXG5cdFx0ICogaG9sZHMgYWxsIHRoZSBkZWZhdWx0IG9wdGlvbnMgdXNlZCB3aGVuIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0c1xuXHRcdCAqL1xuXHRcdGRlZmF1bHRzIDoge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBjb25maWd1cmUgd2hpY2ggcGx1Z2lucyB3aWxsIGJlIGFjdGl2ZSBvbiBhbiBpbnN0YW5jZS4gU2hvdWxkIGJlIGFuIGFycmF5IG9mIHN0cmluZ3MsIHdoZXJlIGVhY2ggZWxlbWVudCBpcyBhIHBsdWdpbiBuYW1lLiBUaGUgZGVmYXVsdCBpcyBgW11gXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zXG5cdFx0XHQgKi9cblx0XHRcdHBsdWdpbnMgOiBbXVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc3RvcmVzIGFsbCBsb2FkZWQganN0cmVlIHBsdWdpbnMgKHVzZWQgaW50ZXJuYWxseSlcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5wbHVnaW5zXG5cdFx0ICovXG5cdFx0cGx1Z2lucyA6IHt9LFxuXHRcdHBhdGggOiBzcmMgJiYgc3JjLmluZGV4T2YoJy8nKSAhPT0gLTEgPyBzcmMucmVwbGFjZSgvXFwvW15cXC9dKyQvLCcnKSA6ICcnLFxuXHRcdGlkcmVnZXggOiAvW1xcXFw6JiFefCgpXFxbXFxdPD5AKicrfiNcIjsuLD1cXC0gXFwvJHt9JT9gXS9nLFxuXHRcdHJvb3QgOiAnIydcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBjcmVhdGVzIGEganN0cmVlIGluc3RhbmNlXG5cdCAqIEBuYW1lICQuanN0cmVlLmNyZWF0ZShlbCBbLCBvcHRpb25zXSlcblx0ICogQHBhcmFtIHtET01FbGVtZW50fGpRdWVyeXxTdHJpbmd9IGVsIHRoZSBlbGVtZW50IHRvIGNyZWF0ZSB0aGUgaW5zdGFuY2Ugb24sIGNhbiBiZSBqUXVlcnkgZXh0ZW5kZWQgb3IgYSBzZWxlY3RvclxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBvcHRpb25zIGZvciB0aGlzIGluc3RhbmNlIChleHRlbmRzIGAkLmpzdHJlZS5kZWZhdWx0c2ApXG5cdCAqIEByZXR1cm4ge2pzVHJlZX0gdGhlIG5ldyBpbnN0YW5jZVxuXHQgKi9cblx0JC5qc3RyZWUuY3JlYXRlID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG5cdFx0dmFyIHRtcCA9IG5ldyAkLmpzdHJlZS5jb3JlKCsraW5zdGFuY2VfY291bnRlciksXG5cdFx0XHRvcHQgPSBvcHRpb25zO1xuXHRcdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgJC5qc3RyZWUuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRcdGlmKG9wdCAmJiBvcHQucGx1Z2lucykge1xuXHRcdFx0b3B0aW9ucy5wbHVnaW5zID0gb3B0LnBsdWdpbnM7XG5cdFx0fVxuXHRcdCQuZWFjaChvcHRpb25zLnBsdWdpbnMsIGZ1bmN0aW9uIChpLCBrKSB7XG5cdFx0XHRpZihpICE9PSAnY29yZScpIHtcblx0XHRcdFx0dG1wID0gdG1wLnBsdWdpbihrLCBvcHRpb25zW2tdKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKGVsKS5kYXRhKCdqc3RyZWUnLCB0bXApO1xuXHRcdHRtcC5pbml0KGVsLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gdG1wO1xuXHR9O1xuXHQvKipcblx0ICogcmVtb3ZlIGFsbCB0cmFjZXMgb2YganN0cmVlIGZyb20gdGhlIERPTSBhbmQgZGVzdHJveSBhbGwgaW5zdGFuY2VzXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlc3Ryb3koKVxuXHQgKi9cblx0JC5qc3RyZWUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcblx0XHQkKCcuanN0cmVlOmpzdHJlZScpLmpzdHJlZSgnZGVzdHJveScpO1xuXHRcdCQoZG9jdW1lbnQpLm9mZignLmpzdHJlZScpO1xuXHR9O1xuXHQvKipcblx0ICogdGhlIGpzdHJlZSBjbGFzcyBjb25zdHJ1Y3RvciwgdXNlZCBvbmx5IGludGVybmFsbHlcblx0ICogQHByaXZhdGVcblx0ICogQG5hbWUgJC5qc3RyZWUuY29yZShpZClcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGlkIHRoaXMgaW5zdGFuY2UncyBpbmRleFxuXHQgKi9cblx0JC5qc3RyZWUuY29yZSA9IGZ1bmN0aW9uIChpZCkge1xuXHRcdHRoaXMuX2lkID0gaWQ7XG5cdFx0dGhpcy5fY250ID0gMDtcblx0XHR0aGlzLl93cmsgPSBudWxsO1xuXHRcdHRoaXMuX2RhdGEgPSB7XG5cdFx0XHRjb3JlIDoge1xuXHRcdFx0XHR0aGVtZXMgOiB7XG5cdFx0XHRcdFx0bmFtZSA6IGZhbHNlLFxuXHRcdFx0XHRcdGRvdHMgOiBmYWxzZSxcblx0XHRcdFx0XHRpY29ucyA6IGZhbHNlLFxuXHRcdFx0XHRcdGVsbGlwc2lzIDogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0c2VsZWN0ZWQgOiBbXSxcblx0XHRcdFx0bGFzdF9lcnJvciA6IHt9LFxuXHRcdFx0XHR3b3JraW5nIDogZmFsc2UsXG5cdFx0XHRcdHdvcmtlcl9xdWV1ZSA6IFtdLFxuXHRcdFx0XHRmb2N1c2VkIDogbnVsbFxuXHRcdFx0fVxuXHRcdH07XG5cdH07XG5cdC8qKlxuXHQgKiBnZXQgYSByZWZlcmVuY2UgdG8gYW4gZXhpc3RpbmcgaW5zdGFuY2Vcblx0ICpcblx0ICogX19FeGFtcGxlc19fXG5cdCAqXG5cdCAqXHQvLyBwcm92aWRlZCBhIGNvbnRhaW5lciB3aXRoIGFuIElEIG9mIFwidHJlZVwiLCBhbmQgYSBuZXN0ZWQgbm9kZSB3aXRoIGFuIElEIG9mIFwiYnJhbmNoXCJcblx0ICpcdC8vIGFsbCBvZiB0aGVyZSB3aWxsIHJldHVybiB0aGUgc2FtZSBpbnN0YW5jZVxuXHQgKlx0JC5qc3RyZWUucmVmZXJlbmNlKCd0cmVlJyk7XG5cdCAqXHQkLmpzdHJlZS5yZWZlcmVuY2UoJyN0cmVlJyk7XG5cdCAqXHQkLmpzdHJlZS5yZWZlcmVuY2UoJCgnI3RyZWUnKSk7XG5cdCAqXHQkLmpzdHJlZS5yZWZlcmVuY2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SUQoJ3RyZWUnKSk7XG5cdCAqXHQkLmpzdHJlZS5yZWZlcmVuY2UoJ2JyYW5jaCcpO1xuXHQgKlx0JC5qc3RyZWUucmVmZXJlbmNlKCcjYnJhbmNoJyk7XG5cdCAqXHQkLmpzdHJlZS5yZWZlcmVuY2UoJCgnI2JyYW5jaCcpKTtcblx0ICpcdCQuanN0cmVlLnJlZmVyZW5jZShkb2N1bWVudC5nZXRFbGVtZW50QnlJRCgnYnJhbmNoJykpO1xuXHQgKlxuXHQgKiBAbmFtZSAkLmpzdHJlZS5yZWZlcmVuY2UobmVlZGxlKVxuXHQgKiBAcGFyYW0ge0RPTUVsZW1lbnR8alF1ZXJ5fFN0cmluZ30gbmVlZGxlXG5cdCAqIEByZXR1cm4ge2pzVHJlZXxudWxsfSB0aGUgaW5zdGFuY2Ugb3IgYG51bGxgIGlmIG5vdCBmb3VuZFxuXHQgKi9cblx0JC5qc3RyZWUucmVmZXJlbmNlID0gZnVuY3Rpb24gKG5lZWRsZSkge1xuXHRcdHZhciB0bXAgPSBudWxsLFxuXHRcdFx0b2JqID0gbnVsbDtcblx0XHRpZihuZWVkbGUgJiYgbmVlZGxlLmlkICYmICghbmVlZGxlLnRhZ05hbWUgfHwgIW5lZWRsZS5ub2RlVHlwZSkpIHsgbmVlZGxlID0gbmVlZGxlLmlkOyB9XG5cblx0XHRpZighb2JqIHx8ICFvYmoubGVuZ3RoKSB7XG5cdFx0XHR0cnkgeyBvYmogPSAkKG5lZWRsZSk7IH0gY2F0Y2ggKGlnbm9yZSkgeyB9XG5cdFx0fVxuXHRcdGlmKCFvYmogfHwgIW9iai5sZW5ndGgpIHtcblx0XHRcdHRyeSB7IG9iaiA9ICQoJyMnICsgbmVlZGxlLnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJykpOyB9IGNhdGNoIChpZ25vcmUpIHsgfVxuXHRcdH1cblx0XHRpZihvYmogJiYgb2JqLmxlbmd0aCAmJiAob2JqID0gb2JqLmNsb3Nlc3QoJy5qc3RyZWUnKSkubGVuZ3RoICYmIChvYmogPSBvYmouZGF0YSgnanN0cmVlJykpKSB7XG5cdFx0XHR0bXAgPSBvYmo7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0JCgnLmpzdHJlZScpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgaW5zdCA9ICQodGhpcykuZGF0YSgnanN0cmVlJyk7XG5cdFx0XHRcdGlmKGluc3QgJiYgaW5zdC5fbW9kZWwuZGF0YVtuZWVkbGVdKSB7XG5cdFx0XHRcdFx0dG1wID0gaW5zdDtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gdG1wO1xuXHR9O1xuXHQvKipcblx0ICogQ3JlYXRlIGFuIGluc3RhbmNlLCBnZXQgYW4gaW5zdGFuY2Ugb3IgaW52b2tlIGEgY29tbWFuZCBvbiBhIGluc3RhbmNlLlxuXHQgKlxuXHQgKiBJZiB0aGVyZSBpcyBubyBpbnN0YW5jZSBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgbm9kZSBhIG5ldyBvbmUgaXMgY3JlYXRlZCBhbmQgYGFyZ2AgaXMgdXNlZCB0byBleHRlbmQgYCQuanN0cmVlLmRlZmF1bHRzYCBmb3IgdGhpcyBuZXcgaW5zdGFuY2UuIFRoZXJlIHdvdWxkIGJlIG5vIHJldHVybiB2YWx1ZSAoY2hhaW5pbmcgaXMgbm90IGJyb2tlbikuXG5cdCAqXG5cdCAqIElmIHRoZXJlIGlzIGFuIGV4aXN0aW5nIGluc3RhbmNlIGFuZCBgYXJnYCBpcyBhIHN0cmluZyB0aGUgY29tbWFuZCBzcGVjaWZpZWQgYnkgYGFyZ2AgaXMgZXhlY3V0ZWQgb24gdGhlIGluc3RhbmNlLCB3aXRoIGFueSBhZGRpdGlvbmFsIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9uLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyBhIHZhbHVlIGl0IHdpbGwgYmUgcmV0dXJuZWQgKGNoYWluaW5nIGNvdWxkIGJyZWFrIGRlcGVuZGluZyBvbiBmdW5jdGlvbikuXG5cdCAqXG5cdCAqIElmIHRoZXJlIGlzIGFuIGV4aXN0aW5nIGluc3RhbmNlIGFuZCBgYXJnYCBpcyBub3QgYSBzdHJpbmcgdGhlIGluc3RhbmNlIGl0c2VsZiBpcyByZXR1cm5lZCAoc2ltaWxhciB0byBgJC5qc3RyZWUucmVmZXJlbmNlYCkuXG5cdCAqXG5cdCAqIEluIGFueSBvdGhlciBjYXNlIC0gbm90aGluZyBpcyByZXR1cm5lZCBhbmQgY2hhaW5pbmcgaXMgbm90IGJyb2tlbi5cblx0ICpcblx0ICogX19FeGFtcGxlc19fXG5cdCAqXG5cdCAqXHQkKCcjdHJlZTEnKS5qc3RyZWUoKTsgLy8gY3JlYXRlcyBhbiBpbnN0YW5jZVxuXHQgKlx0JCgnI3RyZWUyJykuanN0cmVlKHsgcGx1Z2lucyA6IFtdIH0pOyAvLyBjcmVhdGUgYW4gaW5zdGFuY2Ugd2l0aCBzb21lIG9wdGlvbnNcblx0ICpcdCQoJyN0cmVlMScpLmpzdHJlZSgnb3Blbl9ub2RlJywgJyNicmFuY2hfMScpOyAvLyBjYWxsIGEgbWV0aG9kIG9uIGFuIGV4aXN0aW5nIGluc3RhbmNlLCBwYXNzaW5nIGFkZGl0aW9uYWwgYXJndW1lbnRzXG5cdCAqXHQkKCcjdHJlZTInKS5qc3RyZWUoKTsgLy8gZ2V0IGFuIGV4aXN0aW5nIGluc3RhbmNlIChvciBjcmVhdGUgYW4gaW5zdGFuY2UpXG5cdCAqXHQkKCcjdHJlZTInKS5qc3RyZWUodHJ1ZSk7IC8vIGdldCBhbiBleGlzdGluZyBpbnN0YW5jZSAod2lsbCBub3QgY3JlYXRlIG5ldyBpbnN0YW5jZSlcblx0ICpcdCQoJyNicmFuY2hfMScpLmpzdHJlZSgpLnNlbGVjdF9ub2RlKCcjYnJhbmNoXzEnKTsgLy8gZ2V0IGFuIGluc3RhbmNlICh1c2luZyBhIG5lc3RlZCBlbGVtZW50IGFuZCBjYWxsIGEgbWV0aG9kKVxuXHQgKlxuXHQgKiBAbmFtZSAkKCkuanN0cmVlKFthcmddKVxuXHQgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGFyZ1xuXHQgKiBAcmV0dXJuIHtNaXhlZH1cblx0ICovXG5cdCQuZm4uanN0cmVlID0gZnVuY3Rpb24gKGFyZykge1xuXHRcdC8vIGNoZWNrIGZvciBzdHJpbmcgYXJndW1lbnRcblx0XHR2YXIgaXNfbWV0aG9kXHQ9ICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJyksXG5cdFx0XHRhcmdzXHRcdD0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcblx0XHRcdHJlc3VsdFx0XHQ9IG51bGw7XG5cdFx0aWYoYXJnID09PSB0cnVlICYmICF0aGlzLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0Ly8gZ2V0IHRoZSBpbnN0YW5jZSAoaWYgdGhlcmUgaXMgb25lKSBhbmQgbWV0aG9kIChpZiBpdCBleGlzdHMpXG5cdFx0XHR2YXIgaW5zdGFuY2UgPSAkLmpzdHJlZS5yZWZlcmVuY2UodGhpcyksXG5cdFx0XHRcdG1ldGhvZCA9IGlzX21ldGhvZCAmJiBpbnN0YW5jZSA/IGluc3RhbmNlW2FyZ10gOiBudWxsO1xuXHRcdFx0Ly8gaWYgY2FsbGluZyBhIG1ldGhvZCwgYW5kIG1ldGhvZCBpcyBhdmFpbGFibGUgLSBleGVjdXRlIG9uIHRoZSBpbnN0YW5jZVxuXHRcdFx0cmVzdWx0ID0gaXNfbWV0aG9kICYmIG1ldGhvZCA/XG5cdFx0XHRcdG1ldGhvZC5hcHBseShpbnN0YW5jZSwgYXJncykgOlxuXHRcdFx0XHRudWxsO1xuXHRcdFx0Ly8gaWYgdGhlcmUgaXMgbm8gaW5zdGFuY2UgYW5kIG5vIG1ldGhvZCBpcyBiZWluZyBjYWxsZWQgLSBjcmVhdGUgb25lXG5cdFx0XHRpZighaW5zdGFuY2UgJiYgIWlzX21ldGhvZCAmJiAoYXJnID09PSB1bmRlZmluZWQgfHwgJC5pc1BsYWluT2JqZWN0KGFyZykpKSB7XG5cdFx0XHRcdCQuanN0cmVlLmNyZWF0ZSh0aGlzLCBhcmcpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gaWYgdGhlcmUgaXMgYW4gaW5zdGFuY2UgYW5kIG5vIG1ldGhvZCBpcyBjYWxsZWQgLSByZXR1cm4gdGhlIGluc3RhbmNlXG5cdFx0XHRpZiggKGluc3RhbmNlICYmICFpc19tZXRob2QpIHx8IGFyZyA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0cmVzdWx0ID0gaW5zdGFuY2UgfHwgZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZiB0aGVyZSB3YXMgYSBtZXRob2QgY2FsbCB3aGljaCByZXR1cm5lZCBhIHJlc3VsdCAtIGJyZWFrIGFuZCByZXR1cm4gdGhlIHZhbHVlXG5cdFx0XHRpZihyZXN1bHQgIT09IG51bGwgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdC8vIGlmIHRoZXJlIHdhcyBhIG1ldGhvZCBjYWxsIHdpdGggYSB2YWxpZCByZXR1cm4gdmFsdWUgLSByZXR1cm4gdGhhdCwgb3RoZXJ3aXNlIGNvbnRpbnVlIHRoZSBjaGFpblxuXHRcdHJldHVybiByZXN1bHQgIT09IG51bGwgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQgP1xuXHRcdFx0cmVzdWx0IDogdGhpcztcblx0fTtcblx0LyoqXG5cdCAqIHVzZWQgdG8gZmluZCBlbGVtZW50cyBjb250YWluaW5nIGFuIGluc3RhbmNlXG5cdCAqXG5cdCAqIF9fRXhhbXBsZXNfX1xuXHQgKlxuXHQgKlx0JCgnZGl2OmpzdHJlZScpLmVhY2goZnVuY3Rpb24gKCkge1xuXHQgKlx0XHQkKHRoaXMpLmpzdHJlZSgnZGVzdHJveScpO1xuXHQgKlx0fSk7XG5cdCAqXG5cdCAqIEBuYW1lICQoJzpqc3RyZWUnKVxuXHQgKiBAcmV0dXJuIHtqUXVlcnl9XG5cdCAqL1xuXHQkLmV4cHIucHNldWRvcy5qc3RyZWUgPSAkLmV4cHIuY3JlYXRlUHNldWRvKGZ1bmN0aW9uKHNlYXJjaCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihhKSB7XG5cdFx0XHRyZXR1cm4gJChhKS5oYXNDbGFzcygnanN0cmVlJykgJiZcblx0XHRcdFx0JChhKS5kYXRhKCdqc3RyZWUnKSAhPT0gdW5kZWZpbmVkO1xuXHRcdH07XG5cdH0pO1xuXG5cdC8qKlxuXHQgKiBzdG9yZXMgYWxsIGRlZmF1bHRzIGZvciB0aGUgY29yZVxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlXG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy5jb3JlID0ge1xuXHRcdC8qKlxuXHRcdCAqIGRhdGEgY29uZmlndXJhdGlvblxuXHRcdCAqXG5cdFx0ICogSWYgbGVmdCBhcyBgZmFsc2VgIHRoZSBIVE1MIGluc2lkZSB0aGUganN0cmVlIGNvbnRhaW5lciBlbGVtZW50IGlzIHVzZWQgdG8gcG9wdWxhdGUgdGhlIHRyZWUgKHRoYXQgc2hvdWxkIGJlIGFuIHVub3JkZXJlZCBsaXN0IHdpdGggbGlzdCBpdGVtcykuXG5cdFx0ICpcblx0XHQgKiBZb3UgY2FuIGFsc28gcGFzcyBpbiBhIEhUTUwgc3RyaW5nIG9yIGEgSlNPTiBhcnJheSBoZXJlLlxuXHRcdCAqXG5cdFx0ICogSXQgaXMgcG9zc2libGUgdG8gcGFzcyBpbiBhIHN0YW5kYXJkIGpRdWVyeS1saWtlIEFKQVggY29uZmlnIGFuZCBqc3RyZWUgd2lsbCBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBpZiB0aGUgcmVzcG9uc2UgaXMgSlNPTiBvciBIVE1MIGFuZCB1c2UgdGhhdCB0byBwb3B1bGF0ZSB0aGUgdHJlZS5cblx0XHQgKiBJbiBhZGRpdGlvbiB0byB0aGUgc3RhbmRhcmQgalF1ZXJ5IGFqYXggb3B0aW9ucyBoZXJlIHlvdSBjYW4gc3VwcHkgZnVuY3Rpb25zIGZvciBgZGF0YWAgYW5kIGB1cmxgLCB0aGUgZnVuY3Rpb25zIHdpbGwgYmUgcnVuIGluIHRoZSBjdXJyZW50IGluc3RhbmNlJ3Mgc2NvcGUgYW5kIGEgcGFyYW0gd2lsbCBiZSBwYXNzZWQgaW5kaWNhdGluZyB3aGljaCBub2RlIGlzIGJlaW5nIGxvYWRlZCwgdGhlIHJldHVybiB2YWx1ZSBvZiB0aG9zZSBmdW5jdGlvbnMgd2lsbCBiZSB1c2VkLlxuXHRcdCAqXG5cdFx0ICogVGhlIGxhc3Qgb3B0aW9uIGlzIHRvIHNwZWNpZnkgYSBmdW5jdGlvbiwgdGhhdCBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgdGhlIG5vZGUgYmVpbmcgbG9hZGVkIGFzIGFyZ3VtZW50IGFuZCBhIHNlY29uZCBwYXJhbSB3aGljaCBpcyBhIGZ1bmN0aW9uIHdoaWNoIHNob3VsZCBiZSBjYWxsZWQgd2l0aCB0aGUgcmVzdWx0LlxuXHRcdCAqXG5cdFx0ICogX19FeGFtcGxlc19fXG5cdFx0ICpcblx0XHQgKlx0Ly8gQUpBWFxuXHRcdCAqXHQkKCcjdHJlZScpLmpzdHJlZSh7XG5cdFx0ICpcdFx0J2NvcmUnIDoge1xuXHRcdCAqXHRcdFx0J2RhdGEnIDoge1xuXHRcdCAqXHRcdFx0XHQndXJsJyA6ICcvZ2V0L2NoaWxkcmVuLycsXG5cdFx0ICpcdFx0XHRcdCdkYXRhJyA6IGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0ICpcdFx0XHRcdFx0cmV0dXJuIHsgJ2lkJyA6IG5vZGUuaWQgfTtcblx0XHQgKlx0XHRcdFx0fVxuXHRcdCAqXHRcdFx0fVxuXHRcdCAqXHRcdH0pO1xuXHRcdCAqXG5cdFx0ICpcdC8vIGRpcmVjdCBkYXRhXG5cdFx0ICpcdCQoJyN0cmVlJykuanN0cmVlKHtcblx0XHQgKlx0XHQnY29yZScgOiB7XG5cdFx0ICpcdFx0XHQnZGF0YScgOiBbXG5cdFx0ICpcdFx0XHRcdCdTaW1wbGUgcm9vdCBub2RlJyxcblx0XHQgKlx0XHRcdFx0e1xuXHRcdCAqXHRcdFx0XHRcdCdpZCcgOiAnbm9kZV8yJyxcblx0XHQgKlx0XHRcdFx0XHQndGV4dCcgOiAnUm9vdCBub2RlIHdpdGggb3B0aW9ucycsXG5cdFx0ICpcdFx0XHRcdFx0J3N0YXRlJyA6IHsgJ29wZW5lZCcgOiB0cnVlLCAnc2VsZWN0ZWQnIDogdHJ1ZSB9LFxuXHRcdCAqXHRcdFx0XHRcdCdjaGlsZHJlbicgOiBbIHsgJ3RleHQnIDogJ0NoaWxkIDEnIH0sICdDaGlsZCAyJ11cblx0XHQgKlx0XHRcdFx0fVxuXHRcdCAqXHRcdFx0XVxuXHRcdCAqXHRcdH1cblx0XHQgKlx0fSk7XG5cdFx0ICpcblx0XHQgKlx0Ly8gZnVuY3Rpb25cblx0XHQgKlx0JCgnI3RyZWUnKS5qc3RyZWUoe1xuXHRcdCAqXHRcdCdjb3JlJyA6IHtcblx0XHQgKlx0XHRcdCdkYXRhJyA6IGZ1bmN0aW9uIChvYmosIGNhbGxiYWNrKSB7XG5cdFx0ICpcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgWydSb290IDEnLCAnUm9vdCAyJ10pO1xuXHRcdCAqXHRcdFx0fVxuXHRcdCAqXHRcdH0pO1xuXHRcdCAqXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5kYXRhXG5cdFx0ICovXG5cdFx0ZGF0YVx0XHRcdDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogY29uZmlndXJlIHRoZSB2YXJpb3VzIHN0cmluZ3MgdXNlZCB0aHJvdWdob3V0IHRoZSB0cmVlXG5cdFx0ICpcblx0XHQgKiBZb3UgY2FuIHVzZSBhbiBvYmplY3Qgd2hlcmUgdGhlIGtleSBpcyB0aGUgc3RyaW5nIHlvdSBuZWVkIHRvIHJlcGxhY2UgYW5kIHRoZSB2YWx1ZSBpcyB5b3VyIHJlcGxhY2VtZW50LlxuXHRcdCAqIEFub3RoZXIgb3B0aW9uIGlzIHRvIHNwZWNpZnkgYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNhbGxlZCB3aXRoIGFuIGFyZ3VtZW50IG9mIHRoZSBuZWVkZWQgc3RyaW5nIGFuZCBzaG91bGQgcmV0dXJuIHRoZSByZXBsYWNlbWVudC5cblx0XHQgKiBJZiBsZWZ0IGFzIGBmYWxzZWAgbm8gcmVwbGFjZW1lbnQgaXMgbWFkZS5cblx0XHQgKlxuXHRcdCAqIF9fRXhhbXBsZXNfX1xuXHRcdCAqXG5cdFx0ICpcdCQoJyN0cmVlJykuanN0cmVlKHtcblx0XHQgKlx0XHQnY29yZScgOiB7XG5cdFx0ICpcdFx0XHQnc3RyaW5ncycgOiB7XG5cdFx0ICpcdFx0XHRcdCdMb2FkaW5nIC4uLicgOiAnUGxlYXNlIHdhaXQgLi4uJ1xuXHRcdCAqXHRcdFx0fVxuXHRcdCAqXHRcdH1cblx0XHQgKlx0fSk7XG5cdFx0ICpcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnN0cmluZ3Ncblx0XHQgKi9cblx0XHRzdHJpbmdzXHRcdFx0OiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBkZXRlcm1pbmVzIHdoYXQgaGFwcGVucyB3aGVuIGEgdXNlciB0cmllcyB0byBtb2RpZnkgdGhlIHN0cnVjdHVyZSBvZiB0aGUgdHJlZVxuXHRcdCAqIElmIGxlZnQgYXMgYGZhbHNlYCBhbGwgb3BlcmF0aW9ucyBsaWtlIGNyZWF0ZSwgcmVuYW1lLCBkZWxldGUsIG1vdmUgb3IgY29weSBhcmUgcHJldmVudGVkLlxuXHRcdCAqIFlvdSBjYW4gc2V0IHRoaXMgdG8gYHRydWVgIHRvIGFsbG93IGFsbCBpbnRlcmFjdGlvbnMgb3IgdXNlIGEgZnVuY3Rpb24gdG8gaGF2ZSBiZXR0ZXIgY29udHJvbC5cblx0XHQgKlxuXHRcdCAqIF9fRXhhbXBsZXNfX1xuXHRcdCAqXG5cdFx0ICpcdCQoJyN0cmVlJykuanN0cmVlKHtcblx0XHQgKlx0XHQnY29yZScgOiB7XG5cdFx0ICpcdFx0XHQnY2hlY2tfY2FsbGJhY2snIDogZnVuY3Rpb24gKG9wZXJhdGlvbiwgbm9kZSwgbm9kZV9wYXJlbnQsIG5vZGVfcG9zaXRpb24sIG1vcmUpIHtcblx0XHQgKlx0XHRcdFx0Ly8gb3BlcmF0aW9uIGNhbiBiZSAnY3JlYXRlX25vZGUnLCAncmVuYW1lX25vZGUnLCAnZGVsZXRlX25vZGUnLCAnbW92ZV9ub2RlJywgJ2NvcHlfbm9kZScgb3IgJ2VkaXQnXG5cdFx0ICpcdFx0XHRcdC8vIGluIGNhc2Ugb2YgJ3JlbmFtZV9ub2RlJyBub2RlX3Bvc2l0aW9uIGlzIGZpbGxlZCB3aXRoIHRoZSBuZXcgbm9kZSBuYW1lXG5cdFx0ICpcdFx0XHRcdHJldHVybiBvcGVyYXRpb24gPT09ICdyZW5hbWVfbm9kZScgPyB0cnVlIDogZmFsc2U7XG5cdFx0ICpcdFx0XHR9XG5cdFx0ICpcdFx0fVxuXHRcdCAqXHR9KTtcblx0XHQgKlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUuY2hlY2tfY2FsbGJhY2tcblx0XHQgKi9cblx0XHRjaGVja19jYWxsYmFja1x0OiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBhIGNhbGxiYWNrIGNhbGxlZCB3aXRoIGEgc2luZ2xlIG9iamVjdCBwYXJhbWV0ZXIgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUgd2hlbiBzb21ldGhpbmcgZ29lcyB3cm9uZyAob3BlcmF0aW9uIHByZXZlbnRlZCwgYWpheCBmYWlsZWQsIGV0Yylcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmVycm9yXG5cdFx0ICovXG5cdFx0ZXJyb3JcdFx0XHQ6ICQubm9vcCxcblx0XHQvKipcblx0XHQgKiB0aGUgb3BlbiAvIGNsb3NlIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgLSBzZXQgdGhpcyB0byBgZmFsc2VgIHRvIGRpc2FibGUgdGhlIGFuaW1hdGlvbiAoZGVmYXVsdCBpcyBgMjAwYClcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmFuaW1hdGlvblxuXHRcdCAqL1xuXHRcdGFuaW1hdGlvblx0XHQ6IDIwMCxcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBtdWx0aXBsZSBub2RlcyBjYW4gYmUgc2VsZWN0ZWRcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLm11bHRpcGxlXG5cdFx0ICovXG5cdFx0bXVsdGlwbGVcdFx0OiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIHRoZW1lIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXNcblx0XHQgKi9cblx0XHR0aGVtZXNcdFx0XHQ6IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogdGhlIG5hbWUgb2YgdGhlIHRoZW1lIHRvIHVzZSAoaWYgbGVmdCBhcyBgZmFsc2VgIHRoZSBkZWZhdWx0IHRoZW1lIGlzIHVzZWQpXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lcy5uYW1lXG5cdFx0XHQgKi9cblx0XHRcdG5hbWVcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0aGUgVVJMIG9mIHRoZSB0aGVtZSdzIENTUyBmaWxlLCBsZWF2ZSB0aGlzIGFzIGBmYWxzZWAgaWYgeW91IGhhdmUgbWFudWFsbHkgaW5jbHVkZWQgdGhlIHRoZW1lIENTUyAocmVjb21tZW5kZWQpLiBZb3UgY2FuIHNldCB0aGlzIHRvIGB0cnVlYCB0b28gd2hpY2ggd2lsbCB0cnkgdG8gYXV0b2xvYWQgdGhlIHRoZW1lLlxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXMudXJsXG5cdFx0XHQgKi9cblx0XHRcdHVybFx0XHRcdFx0OiBmYWxzZSxcblx0XHRcdC8qKlxuXHRcdFx0ICogdGhlIGxvY2F0aW9uIG9mIGFsbCBqc3RyZWUgdGhlbWVzIC0gb25seSB1c2VkIGlmIGB1cmxgIGlzIHNldCB0byBgdHJ1ZWBcblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzLmRpclxuXHRcdFx0ICovXG5cdFx0XHRkaXJcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHQvKipcblx0XHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGNvbm5lY3RpbmcgZG90cyBhcmUgc2hvd25cblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzLmRvdHNcblx0XHRcdCAqL1xuXHRcdFx0ZG90c1x0XHRcdDogdHJ1ZSxcblx0XHRcdC8qKlxuXHRcdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgbm9kZSBpY29ucyBhcmUgc2hvd25cblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzLmljb25zXG5cdFx0XHQgKi9cblx0XHRcdGljb25zXHRcdFx0OiB0cnVlLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBub2RlIGVsbGlwc2lzIHNob3VsZCBiZSBzaG93biAtIHRoaXMgb25seSB3b3JrcyB3aXRoIGEgZml4ZWQgd2l0aCBvbiB0aGUgY29udGFpbmVyXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lcy5lbGxpcHNpc1xuXHRcdFx0ICovXG5cdFx0XHRlbGxpcHNpc1x0XHQ6IGZhbHNlLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgdHJlZSBiYWNrZ3JvdW5kIGlzIHN0cmlwZWRcblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzLnN0cmlwZXNcblx0XHRcdCAqL1xuXHRcdFx0c3RyaXBlc1x0XHRcdDogZmFsc2UsXG5cdFx0XHQvKipcblx0XHRcdCAqIGEgc3RyaW5nIChvciBib29sZWFuIGBmYWxzZWApIHNwZWNpZnlpbmcgdGhlIHRoZW1lIHZhcmlhbnQgdG8gdXNlIChpZiB0aGUgdGhlbWUgc3VwcG9ydHMgdmFyaWFudHMpXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lcy52YXJpYW50XG5cdFx0XHQgKi9cblx0XHRcdHZhcmlhbnRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBhIGJvb2xlYW4gc3BlY2lmeWluZyBpZiBhIHJlcG9uc2l2ZSB2ZXJzaW9uIG9mIHRoZSB0aGVtZSBzaG91bGQga2ljayBpbiBvbiBzbWFsbGVyIHNjcmVlbnMgKGlmIHRoZSB0aGVtZSBzdXBwb3J0cyBpdCkuIERlZmF1bHRzIHRvIGBmYWxzZWAuXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lcy5yZXNwb25zaXZlXG5cdFx0XHQgKi9cblx0XHRcdHJlc3BvbnNpdmVcdFx0OiBmYWxzZVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaWYgbGVmdCBhcyBgdHJ1ZWAgYWxsIHBhcmVudHMgb2YgYWxsIHNlbGVjdGVkIG5vZGVzIHdpbGwgYmUgb3BlbmVkIG9uY2UgdGhlIHRyZWUgbG9hZHMgKHNvIHRoYXQgYWxsIHNlbGVjdGVkIG5vZGVzIGFyZSB2aXNpYmxlIHRvIHRoZSB1c2VyKVxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUuZXhwYW5kX3NlbGVjdGVkX29ubG9hZFxuXHRcdCAqL1xuXHRcdGV4cGFuZF9zZWxlY3RlZF9vbmxvYWQgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGlmIGxlZnQgYXMgYHRydWVgIHdlYiB3b3JrZXJzIHdpbGwgYmUgdXNlZCB0byBwYXJzZSBpbmNvbWluZyBKU09OIGRhdGEgd2hlcmUgcG9zc2libGUsIHNvIHRoYXQgdGhlIFVJIHdpbGwgbm90IGJlIGJsb2NrZWQgYnkgbGFyZ2UgcmVxdWVzdHMuIFdvcmtlcnMgYXJlIGhvd2V2ZXIgYWJvdXQgMzAlIHNsb3dlci4gRGVmYXVsdHMgdG8gYHRydWVgXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS53b3JrZXJcblx0XHQgKi9cblx0XHR3b3JrZXIgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIEZvcmNlIG5vZGUgdGV4dCB0byBwbGFpbiB0ZXh0IChhbmQgZXNjYXBlIEhUTUwpLiBEZWZhdWx0cyB0byBgZmFsc2VgXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5mb3JjZV90ZXh0XG5cdFx0ICovXG5cdFx0Zm9yY2VfdGV4dCA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIFNob3VsZCB0aGUgbm9kZSBiZSB0b2dnbGVkIGlmIHRoZSB0ZXh0IGlzIGRvdWJsZSBjbGlja2VkLiBEZWZhdWx0cyB0byBgdHJ1ZWBcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmRibGNsaWNrX3RvZ2dsZVxuXHRcdCAqL1xuXHRcdGRibGNsaWNrX3RvZ2dsZSA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogU2hvdWxkIHRoZSBsb2FkZWQgbm9kZXMgYmUgcGFydCBvZiB0aGUgc3RhdGUuIERlZmF1bHRzIHRvIGBmYWxzZWBcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmxvYWRlZF9zdGF0ZVxuXHRcdCAqL1xuXHRcdGxvYWRlZF9zdGF0ZSA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIFNob3VsZCB0aGUgbGFzdCBhY3RpdmUgbm9kZSBiZSBmb2N1c2VkIHdoZW4gdGhlIHRyZWUgY29udGFpbmVyIGlzIGJsdXJyZWQgYW5kIHRoZSBmb2N1c2VkIGFnYWluLiBUaGlzIGhlbHBzIHdvcmtpbmcgd2l0aCBzY3JlZW4gcmVhZGVycy4gRGVmYXVsdHMgdG8gYHRydWVgXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5yZXN0b3JlX2ZvY3VzXG5cdFx0ICovXG5cdFx0cmVzdG9yZV9mb2N1cyA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogRGVmYXVsdCBrZXlib2FyZCBzaG9ydGN1dHMgKGFuIG9iamVjdCB3aGVyZSBlYWNoIGtleSBpcyB0aGUgYnV0dG9uIG5hbWUgb3IgY29tYm8gLSBsaWtlICdlbnRlcicsICdjdHJsLXNwYWNlJywgJ3AnLCBldGMgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSlcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmtleWJvYXJkXG5cdFx0ICovXG5cdFx0a2V5Ym9hcmQgOiB7XG5cdFx0XHQnY3RybC1zcGFjZSc6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIGFyaWEgZGVmaW5lcyBzcGFjZSBvbmx5IHdpdGggQ3RybFxuXHRcdFx0XHRlLnR5cGUgPSBcImNsaWNrXCI7XG5cdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS50cmlnZ2VyKGUpO1xuXHRcdFx0fSxcblx0XHRcdCdlbnRlcic6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIGVudGVyXG5cdFx0XHRcdGUudHlwZSA9IFwiY2xpY2tcIjtcblx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLnRyaWdnZXIoZSk7XG5cdFx0XHR9LFxuXHRcdFx0J2xlZnQnOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyBsZWZ0XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0aWYodGhpcy5pc19vcGVuKGUuY3VycmVudFRhcmdldCkpIHtcblx0XHRcdFx0XHR0aGlzLmNsb3NlX25vZGUoZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR2YXIgbyA9IHRoaXMuZ2V0X3BhcmVudChlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHRcdGlmKG8gJiYgby5pZCAhPT0gJC5qc3RyZWUucm9vdCkgeyB0aGlzLmdldF9ub2RlKG8sIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7IH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCd1cCc6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIHVwXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIG8gPSB0aGlzLmdldF9wcmV2X2RvbShlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHRpZihvICYmIG8ubGVuZ3RoKSB7IG8uY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTsgfVxuXHRcdFx0fSxcblx0XHRcdCdyaWdodCc6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIHJpZ2h0XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0aWYodGhpcy5pc19jbG9zZWQoZS5jdXJyZW50VGFyZ2V0KSkge1xuXHRcdFx0XHRcdHRoaXMub3Blbl9ub2RlKGUuY3VycmVudFRhcmdldCwgZnVuY3Rpb24gKG8pIHsgdGhpcy5nZXRfbm9kZShvLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpOyB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh0aGlzLmlzX29wZW4oZS5jdXJyZW50VGFyZ2V0KSkge1xuXHRcdFx0XHRcdHZhciBvID0gdGhpcy5nZXRfbm9kZShlLmN1cnJlbnRUYXJnZXQsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWNoaWxkcmVuJylbMF07XG5cdFx0XHRcdFx0aWYobykgeyAkKHRoaXMuX2ZpcnN0Q2hpbGQobykpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7IH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCdkb3duJzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gZG93blxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBvID0gdGhpcy5nZXRfbmV4dF9kb20oZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0aWYobyAmJiBvLmxlbmd0aCkgeyBvLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7IH1cblx0XHRcdH0sXG5cdFx0XHQnKic6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIGFyaWEgZGVmaW5lcyAqIG9uIG51bXBhZCBhcyBvcGVuX2FsbCAtIG5vdCB2ZXJ5IGNvbW1vblxuXHRcdFx0XHR0aGlzLm9wZW5fYWxsKCk7XG5cdFx0XHR9LFxuXHRcdFx0J2hvbWUnOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyBob21lXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIG8gPSB0aGlzLl9maXJzdENoaWxkKHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdKTtcblx0XHRcdFx0aWYobykgeyAkKG8pLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZpbHRlcignOnZpc2libGUnKS5mb2N1cygpOyB9XG5cdFx0XHR9LFxuXHRcdFx0J2VuZCc6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIGVuZFxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLWFuY2hvcicpLmZpbHRlcignOnZpc2libGUnKS5sYXN0KCkuZm9jdXMoKTtcblx0XHRcdH0sXG5cdFx0XHQnZjInOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyBmMiAtIHNhZmUgdG8gaW5jbHVkZSAtIGlmIGNoZWNrX2NhbGxiYWNrIGlzIGZhbHNlIGl0IHdpbGwgZmFpbFxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuZWRpdChlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0JC5qc3RyZWUuY29yZS5wcm90b3R5cGUgPSB7XG5cdFx0LyoqXG5cdFx0ICogdXNlZCB0byBkZWNvcmF0ZSBhbiBpbnN0YW5jZSB3aXRoIGEgcGx1Z2luLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBwbHVnaW4oZGVjbyBbLCBvcHRzXSlcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGRlY28gdGhlIHBsdWdpbiB0byBkZWNvcmF0ZSB3aXRoXG5cdFx0ICogQHBhcmFtICB7T2JqZWN0fSBvcHRzIG9wdGlvbnMgZm9yIHRoZSBwbHVnaW5cblx0XHQgKiBAcmV0dXJuIHtqc1RyZWV9XG5cdFx0ICovXG5cdFx0cGx1Z2luIDogZnVuY3Rpb24gKGRlY28sIG9wdHMpIHtcblx0XHRcdHZhciBDaGlsZCA9ICQuanN0cmVlLnBsdWdpbnNbZGVjb107XG5cdFx0XHRpZihDaGlsZCkge1xuXHRcdFx0XHR0aGlzLl9kYXRhW2RlY29dID0ge307XG5cdFx0XHRcdENoaWxkLnByb3RvdHlwZSA9IHRoaXM7XG5cdFx0XHRcdHJldHVybiBuZXcgQ2hpbGQob3B0cywgdGhpcyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGluaXRpYWxpemUgdGhlIGluc3RhbmNlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBpbml0KGVsLCBvcHRvbnMpXG5cdFx0ICogQHBhcmFtIHtET01FbGVtZW50fGpRdWVyeXxTdHJpbmd9IGVsIHRoZSBlbGVtZW50IHdlIGFyZSB0cmFuc2Zvcm1pbmdcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBvcHRpb25zIGZvciB0aGlzIGluc3RhbmNlXG5cdFx0ICogQHRyaWdnZXIgaW5pdC5qc3RyZWUsIGxvYWRpbmcuanN0cmVlLCBsb2FkZWQuanN0cmVlLCByZWFkeS5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICovXG5cdFx0aW5pdCA6IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuXHRcdFx0dGhpcy5fbW9kZWwgPSB7XG5cdFx0XHRcdGRhdGEgOiB7fSxcblx0XHRcdFx0Y2hhbmdlZCA6IFtdLFxuXHRcdFx0XHRmb3JjZV9mdWxsX3JlZHJhdyA6IGZhbHNlLFxuXHRcdFx0XHRyZWRyYXdfdGltZW91dCA6IGZhbHNlLFxuXHRcdFx0XHRkZWZhdWx0X3N0YXRlIDoge1xuXHRcdFx0XHRcdGxvYWRlZCA6IHRydWUsXG5cdFx0XHRcdFx0b3BlbmVkIDogZmFsc2UsXG5cdFx0XHRcdFx0c2VsZWN0ZWQgOiBmYWxzZSxcblx0XHRcdFx0XHRkaXNhYmxlZCA6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHR0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdID0ge1xuXHRcdFx0XHRpZCA6ICQuanN0cmVlLnJvb3QsXG5cdFx0XHRcdHBhcmVudCA6IG51bGwsXG5cdFx0XHRcdHBhcmVudHMgOiBbXSxcblx0XHRcdFx0Y2hpbGRyZW4gOiBbXSxcblx0XHRcdFx0Y2hpbGRyZW5fZCA6IFtdLFxuXHRcdFx0XHRzdGF0ZSA6IHsgbG9hZGVkIDogZmFsc2UgfVxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5lbGVtZW50ID0gJChlbCkuYWRkQ2xhc3MoJ2pzdHJlZSBqc3RyZWUtJyArIHRoaXMuX2lkKTtcblx0XHRcdHRoaXMuc2V0dGluZ3MgPSBvcHRpb25zO1xuXG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUucmVhZHkgPSBmYWxzZTtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5sb2FkZWQgPSBmYWxzZTtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5ydGwgPSAodGhpcy5lbGVtZW50LmNzcyhcImRpcmVjdGlvblwiKSA9PT0gXCJydGxcIik7XG5cdFx0XHR0aGlzLmVsZW1lbnRbdGhpcy5fZGF0YS5jb3JlLnJ0bCA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXShcImpzdHJlZS1ydGxcIik7XG5cdFx0XHR0aGlzLmVsZW1lbnQuYXR0cigncm9sZScsJ3RyZWUnKTtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY29yZS5tdWx0aXBsZSkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1tdWx0aXNlbGVjdGFibGUnLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdGlmKCF0aGlzLmVsZW1lbnQuYXR0cigndGFiaW5kZXgnKSkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuYXR0cigndGFiaW5kZXgnLCcwJyk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYmluZCgpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgYWZ0ZXIgYWxsIGV2ZW50cyBhcmUgYm91bmRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgaW5pdC5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKFwiaW5pdFwiKTtcblxuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLm9yaWdpbmFsX2NvbnRhaW5lcl9odG1sID0gdGhpcy5lbGVtZW50LmZpbmQoXCIgPiB1bCA+IGxpXCIpLmNsb25lKHRydWUpO1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLm9yaWdpbmFsX2NvbnRhaW5lcl9odG1sXG5cdFx0XHRcdC5maW5kKFwibGlcIikuYWRkQmFjaygpXG5cdFx0XHRcdC5jb250ZW50cygpLmZpbHRlcihmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlVHlwZSA9PT0gMyAmJiAoIXRoaXMubm9kZVZhbHVlIHx8IC9eXFxzKyQvLnRlc3QodGhpcy5ub2RlVmFsdWUpKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnJlbW92ZSgpO1xuXHRcdFx0dGhpcy5lbGVtZW50Lmh0bWwoXCI8XCIrXCJ1bCBjbGFzcz0nanN0cmVlLWNvbnRhaW5lci11bCBqc3RyZWUtY2hpbGRyZW4nIHJvbGU9J2dyb3VwJz48XCIrXCJsaSBpZD0nalwiK3RoaXMuX2lkK1wiX2xvYWRpbmcnIGNsYXNzPSdqc3RyZWUtaW5pdGlhbC1ub2RlIGpzdHJlZS1sb2FkaW5nIGpzdHJlZS1sZWFmIGpzdHJlZS1sYXN0JyByb2xlPSd0cmVlLWl0ZW0nPjxpIGNsYXNzPSdqc3RyZWUtaWNvbiBqc3RyZWUtb2NsJz48L2k+PFwiK1wiYSBjbGFzcz0nanN0cmVlLWFuY2hvcicgaHJlZj0nIyc+PGkgY2xhc3M9J2pzdHJlZS1pY29uIGpzdHJlZS10aGVtZWljb24taGlkZGVuJz48L2k+XCIgKyB0aGlzLmdldF9zdHJpbmcoXCJMb2FkaW5nIC4uLlwiKSArIFwiPC9hPjwvbGk+PC91bD5cIik7XG5cdFx0XHR0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50JywnaicgKyB0aGlzLl9pZCArICdfbG9hZGluZycpO1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxpX2hlaWdodCA9IHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmNoaWxkcmVuKFwibGlcIikuZmlyc3QoKS5vdXRlckhlaWdodCgpIHx8IDI0O1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLm5vZGUgPSB0aGlzLl9jcmVhdGVfcHJvdG90eXBlX25vZGUoKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIGFmdGVyIHRoZSBsb2FkaW5nIHRleHQgaXMgc2hvd24gYW5kIGJlZm9yZSBsb2FkaW5nIHN0YXJ0c1xuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBsb2FkaW5nLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoXCJsb2FkaW5nXCIpO1xuXHRcdFx0dGhpcy5sb2FkX25vZGUoJC5qc3RyZWUucm9vdCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBkZXN0cm95IGFuIGluc3RhbmNlXG5cdFx0ICogQG5hbWUgZGVzdHJveSgpXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0ga2VlcF9odG1sIGlmIG5vdCBzZXQgdG8gYHRydWVgIHRoZSBjb250YWluZXIgd2lsbCBiZSBlbXB0aWVkLCBvdGhlcndpc2UgdGhlIGN1cnJlbnQgRE9NIGVsZW1lbnRzIHdpbGwgYmUga2VwdCBpbnRhY3Rcblx0XHQgKi9cblx0XHRkZXN0cm95IDogZnVuY3Rpb24gKGtlZXBfaHRtbCkge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgYmVmb3JlIHRoZSB0cmVlIGlzIGRlc3Ryb3llZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBkZXN0cm95LmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoXCJkZXN0cm95XCIpO1xuXHRcdFx0aWYodGhpcy5fd3JrKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0d2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwodGhpcy5fd3JrKTtcblx0XHRcdFx0XHR0aGlzLl93cmsgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChpZ25vcmUpIHsgfVxuXHRcdFx0fVxuXHRcdFx0aWYoIWtlZXBfaHRtbCkgeyB0aGlzLmVsZW1lbnQuZW1wdHkoKTsgfVxuXHRcdFx0dGhpcy50ZWFyZG93bigpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlIGEgcHJvdG90eXBlIG5vZGVcblx0XHQgKiBAbmFtZSBfY3JlYXRlX3Byb3RvdHlwZV9ub2RlKClcblx0XHQgKiBAcmV0dXJuIHtET01FbGVtZW50fVxuXHRcdCAqL1xuXHRcdF9jcmVhdGVfcHJvdG90eXBlX25vZGUgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgX25vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdMSScpLCBfdGVtcDEsIF90ZW1wMjtcblx0XHRcdF9ub2RlLnNldEF0dHJpYnV0ZSgncm9sZScsICd0cmVlaXRlbScpO1xuXHRcdFx0X3RlbXAxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnSScpO1xuXHRcdFx0X3RlbXAxLmNsYXNzTmFtZSA9ICdqc3RyZWUtaWNvbiBqc3RyZWUtb2NsJztcblx0XHRcdF90ZW1wMS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7XG5cdFx0XHRfbm9kZS5hcHBlbmRDaGlsZChfdGVtcDEpO1xuXHRcdFx0X3RlbXAxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnQScpO1xuXHRcdFx0X3RlbXAxLmNsYXNzTmFtZSA9ICdqc3RyZWUtYW5jaG9yJztcblx0XHRcdF90ZW1wMS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCcjJyk7XG5cdFx0XHRfdGVtcDEuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsJy0xJyk7XG5cdFx0XHRfdGVtcDIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdJJyk7XG5cdFx0XHRfdGVtcDIuY2xhc3NOYW1lID0gJ2pzdHJlZS1pY29uIGpzdHJlZS10aGVtZWljb24nO1xuXHRcdFx0X3RlbXAyLnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKTtcblx0XHRcdF90ZW1wMS5hcHBlbmRDaGlsZChfdGVtcDIpO1xuXHRcdFx0X25vZGUuYXBwZW5kQ2hpbGQoX3RlbXAxKTtcblx0XHRcdF90ZW1wMSA9IF90ZW1wMiA9IG51bGw7XG5cblx0XHRcdHJldHVybiBfbm9kZTtcblx0XHR9LFxuXHRcdF9rYmV2ZW50X3RvX2Z1bmMgOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0dmFyIGtleXMgPSB7XG5cdFx0XHRcdDg6IFwiQmFja3NwYWNlXCIsIDk6IFwiVGFiXCIsIDEzOiBcIkVudGVyXCIsIDE5OiBcIlBhdXNlXCIsIDI3OiBcIkVzY1wiLFxuXHRcdFx0XHQzMjogXCJTcGFjZVwiLCAzMzogXCJQYWdlVXBcIiwgMzQ6IFwiUGFnZURvd25cIiwgMzU6IFwiRW5kXCIsIDM2OiBcIkhvbWVcIixcblx0XHRcdFx0Mzc6IFwiTGVmdFwiLCAzODogXCJVcFwiLCAzOTogXCJSaWdodFwiLCA0MDogXCJEb3duXCIsIDQ0OiBcIlByaW50XCIsIDQ1OiBcIkluc2VydFwiLFxuXHRcdFx0XHQ0NjogXCJEZWxldGVcIiwgOTY6IFwiTnVtcGFkMFwiLCA5NzogXCJOdW1wYWQxXCIsIDk4OiBcIk51bXBhZDJcIiwgOTkgOiBcIk51bXBhZDNcIixcblx0XHRcdFx0MTAwOiBcIk51bXBhZDRcIiwgMTAxOiBcIk51bXBhZDVcIiwgMTAyOiBcIk51bXBhZDZcIiwgMTAzOiBcIk51bXBhZDdcIixcblx0XHRcdFx0MTA0OiBcIk51bXBhZDhcIiwgMTA1OiBcIk51bXBhZDlcIiwgJy0xMyc6IFwiTnVtcGFkRW50ZXJcIiwgMTEyOiBcIkYxXCIsXG5cdFx0XHRcdDExMzogXCJGMlwiLCAxMTQ6IFwiRjNcIiwgMTE1OiBcIkY0XCIsIDExNjogXCJGNVwiLCAxMTc6IFwiRjZcIiwgMTE4OiBcIkY3XCIsXG5cdFx0XHRcdDExOTogXCJGOFwiLCAxMjA6IFwiRjlcIiwgMTIxOiBcIkYxMFwiLCAxMjI6IFwiRjExXCIsIDEyMzogXCJGMTJcIiwgMTQ0OiBcIk51bWxvY2tcIixcblx0XHRcdFx0MTQ1OiBcIlNjcm9sbGxvY2tcIiwgMTY6ICdTaGlmdCcsIDE3OiAnQ3RybCcsIDE4OiAnQWx0Jyxcblx0XHRcdFx0NDg6ICcwJywgIDQ5OiAnMScsICA1MDogJzInLCAgNTE6ICczJywgIDUyOiAnNCcsIDUzOiAgJzUnLFxuXHRcdFx0XHQ1NDogJzYnLCAgNTU6ICc3JywgIDU2OiAnOCcsICA1NzogJzknLCAgNTk6ICc7JywgIDYxOiAnPScsIDY1OiAgJ2EnLFxuXHRcdFx0XHQ2NjogJ2InLCAgNjc6ICdjJywgIDY4OiAnZCcsICA2OTogJ2UnLCAgNzA6ICdmJywgIDcxOiAnZycsIDcyOiAgJ2gnLFxuXHRcdFx0XHQ3MzogJ2knLCAgNzQ6ICdqJywgIDc1OiAnaycsICA3NjogJ2wnLCAgNzc6ICdtJywgIDc4OiAnbicsIDc5OiAgJ28nLFxuXHRcdFx0XHQ4MDogJ3AnLCAgODE6ICdxJywgIDgyOiAncicsICA4MzogJ3MnLCAgODQ6ICd0JywgIDg1OiAndScsIDg2OiAgJ3YnLFxuXHRcdFx0XHQ4NzogJ3cnLCAgODg6ICd4JywgIDg5OiAneScsICA5MDogJ3onLCAxMDc6ICcrJywgMTA5OiAnLScsIDExMDogJy4nLFxuXHRcdFx0XHQxODY6ICc7JywgMTg3OiAnPScsIDE4ODogJywnLCAxODk6ICctJywgMTkwOiAnLicsIDE5MTogJy8nLCAxOTI6ICdgJyxcblx0XHRcdFx0MjE5OiAnWycsIDIyMDogJ1xcXFwnLDIyMTogJ10nLCAyMjI6IFwiJ1wiLCAxMTE6ICcvJywgMTA2OiAnKicsIDE3MzogJy0nXG5cdFx0XHR9O1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cdFx0XHRpZiAoZS5jdHJsS2V5KSB7IHBhcnRzLnB1c2goJ2N0cmwnKTsgfVxuXHRcdFx0aWYgKGUuYWx0S2V5KSB7IHBhcnRzLnB1c2goJ2FsdCcpOyB9XG5cdFx0XHRpZiAoZS5zaGlmdEtleSkgeyBwYXJ0cy5wdXNoKCdzaGlmdCcpOyB9XG5cdFx0XHRwYXJ0cy5wdXNoKGtleXNbZS53aGljaF0gfHwgZS53aGljaCk7XG5cdFx0XHRwYXJ0cyA9IHBhcnRzLnNvcnQoKS5qb2luKCctJykudG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0dmFyIGtiID0gdGhpcy5zZXR0aW5ncy5jb3JlLmtleWJvYXJkLCBpLCB0bXA7XG5cdFx0XHRmb3IgKGkgaW4ga2IpIHtcblx0XHRcdFx0aWYgKGtiLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0dG1wID0gaTtcblx0XHRcdFx0XHRpZiAodG1wICE9PSAnLScgJiYgdG1wICE9PSAnKycpIHtcblx0XHRcdFx0XHRcdHRtcCA9IHRtcC5yZXBsYWNlKCctLScsICctTUlOVVMnKS5yZXBsYWNlKCcrLScsICctTUlOVVMnKS5yZXBsYWNlKCcrKycsICctUExVUycpLnJlcGxhY2UoJy0rJywgJy1QTFVTJyk7XG5cdFx0XHRcdFx0XHR0bXAgPSB0bXAuc3BsaXQoLy18XFwrLykuc29ydCgpLmpvaW4oJy0nKS5yZXBsYWNlKCdNSU5VUycsICctJykucmVwbGFjZSgnUExVUycsICcrJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRtcCA9PT0gcGFydHMpIHtcblx0XHRcdFx0XHRcdHJldHVybiBrYltpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcGFydCBvZiB0aGUgZGVzdHJveWluZyBvZiBhbiBpbnN0YW5jZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgdGVhcmRvd24oKVxuXHRcdCAqL1xuXHRcdHRlYXJkb3duIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy51bmJpbmQoKTtcblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2pzdHJlZScpXG5cdFx0XHRcdC5yZW1vdmVEYXRhKCdqc3RyZWUnKVxuXHRcdFx0XHQuZmluZChcIltjbGFzc149J2pzdHJlZSddXCIpXG5cdFx0XHRcdFx0LmFkZEJhY2soKVxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5jbGFzc05hbWUucmVwbGFjZSgvanN0cmVlW14gXSp8JC9pZywnJyk7IH0pO1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gbnVsbDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGJpbmQgYWxsIGV2ZW50cy4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgYmluZCgpXG5cdFx0ICovXG5cdFx0YmluZCA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciB3b3JkID0gJycsXG5cdFx0XHRcdHRvdXQgPSBudWxsLFxuXHRcdFx0XHR3YXNfY2xpY2sgPSAwO1xuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5vbihcImRibGNsaWNrLmpzdHJlZVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYoZS50YXJnZXQudGFnTmFtZSAmJiBlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIikgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0XHRcdFx0aWYoZG9jdW1lbnQuc2VsZWN0aW9uICYmIGRvY3VtZW50LnNlbGVjdGlvbi5lbXB0eSkge1xuXHRcdFx0XHRcdFx0XHRkb2N1bWVudC5zZWxlY3Rpb24uZW1wdHkoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpZih3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcblx0XHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VsLmNvbGxhcHNlKCk7XG5cdFx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoaWdub3JlKSB7IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdC5vbihcIm1vdXNlZG93bi5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYoZS50YXJnZXQgPT09IHRoaXMuZWxlbWVudFswXSkge1xuXHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgbG9zaW5nIGZvY3VzIHdoZW4gY2xpY2tpbmcgc2Nyb2xsIGFycm93cyAoRkYsIENocm9tZSlcblx0XHRcdFx0XHRcdFx0d2FzX2NsaWNrID0gKyhuZXcgRGF0ZSgpKTsgLy8gaWUgZG9lcyBub3QgYWxsb3cgdG8gcHJldmVudCBsb3NpbmcgZm9jdXNcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwibW91c2Vkb3duLmpzdHJlZVwiLCBcIi5qc3RyZWUtb2NsXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgYW55IG5vZGUgaW5zaWRlIGZyb20gbG9zaW5nIGZvY3VzIHdoZW4gY2xpY2tpbmcgdGhlIG9wZW4vY2xvc2UgaWNvblxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdC5vbihcImNsaWNrLmpzdHJlZVwiLCBcIi5qc3RyZWUtb2NsXCIsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdHRoaXMudG9nZ2xlX25vZGUoZS50YXJnZXQpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJkYmxjbGljay5qc3RyZWVcIiwgXCIuanN0cmVlLWFuY2hvclwiLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZihlLnRhcmdldC50YWdOYW1lICYmIGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiKSB7IHJldHVybiB0cnVlOyB9XG5cdFx0XHRcdFx0XHRpZih0aGlzLnNldHRpbmdzLmNvcmUuZGJsY2xpY2tfdG9nZ2xlKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudG9nZ2xlX25vZGUoZS50YXJnZXQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJjbGljay5qc3RyZWVcIiwgXCIuanN0cmVlLWFuY2hvclwiLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRpZihlLmN1cnJlbnRUYXJnZXQgIT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHsgJChlLmN1cnJlbnRUYXJnZXQpLmZvY3VzKCk7IH1cblx0XHRcdFx0XHRcdHRoaXMuYWN0aXZhdGVfbm9kZShlLmN1cnJlbnRUYXJnZXQsIGUpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oJ2tleWRvd24uanN0cmVlJywgJy5qc3RyZWUtYW5jaG9yJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYoZS50YXJnZXQudGFnTmFtZSAmJiBlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIikgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLnJ0bCkge1xuXHRcdFx0XHRcdFx0XHRpZihlLndoaWNoID09PSAzNykgeyBlLndoaWNoID0gMzk7IH1cblx0XHRcdFx0XHRcdFx0ZWxzZSBpZihlLndoaWNoID09PSAzOSkgeyBlLndoaWNoID0gMzc7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhciBmID0gdGhpcy5fa2JldmVudF90b19mdW5jKGUpO1xuXHRcdFx0XHRcdFx0aWYgKGYpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHIgPSBmLmNhbGwodGhpcywgZSk7XG5cdFx0XHRcdFx0XHRcdGlmIChyID09PSBmYWxzZSB8fCByID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwibG9hZF9ub2RlLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRpZihkYXRhLnN0YXR1cykge1xuXHRcdFx0XHRcdFx0XHRpZihkYXRhLm5vZGUuaWQgPT09ICQuanN0cmVlLnJvb3QgJiYgIXRoaXMuX2RhdGEuY29yZS5sb2FkZWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubG9hZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLl9maXJzdENoaWxkKHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsdGhpcy5fZmlyc3RDaGlsZCh0aGlzLmdldF9jb250YWluZXJfdWwoKVswXSkuaWQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgYWZ0ZXIgdGhlIHJvb3Qgbm9kZSBpcyBsb2FkZWQgZm9yIHRoZSBmaXJzdCB0aW1lXG5cdFx0XHRcdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0XHRcdFx0ICogQG5hbWUgbG9hZGVkLmpzdHJlZVxuXHRcdFx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMudHJpZ2dlcihcImxvYWRlZFwiKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZighdGhpcy5fZGF0YS5jb3JlLnJlYWR5KSB7XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5lbGVtZW50ICYmICF0aGlzLmdldF9jb250YWluZXJfdWwoKS5maW5kKCcuanN0cmVlLWxvYWRpbmcnKS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnJlYWR5ID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY29yZS5leHBhbmRfc2VsZWN0ZWRfb25sb2FkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgdG1wID0gW10sIGksIGo7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9IHRtcC5jb25jYXQodGhpcy5fbW9kZWwuZGF0YVt0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWRbaV1dLnBhcmVudHMpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gJC52YWthdGEuYXJyYXlfdW5pcXVlKHRtcCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMub3Blbl9ub2RlKHRtcFtpXSwgZmFsc2UsIDApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ3JlYWR5JywgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICogdHJpZ2dlcmVkIGFmdGVyIGFsbCBub2RlcyBhcmUgZmluaXNoZWQgbG9hZGluZ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICogQG5hbWUgcmVhZHkuanN0cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoXCJyZWFkeVwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9LCB0aGlzKSwgMCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Ly8gcXVpY2sgc2VhcmNoaW5nIHdoZW4gdGhlIHRyZWUgaXMgZm9jdXNlZFxuXHRcdFx0XHQub24oJ2tleXByZXNzLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKGUudGFyZ2V0LnRhZ05hbWUgJiYgZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdFx0XHRcdGlmKHRvdXQpIHsgY2xlYXJUaW1lb3V0KHRvdXQpOyB9XG5cdFx0XHRcdFx0XHR0b3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHdvcmQgPSAnJztcblx0XHRcdFx0XHRcdH0sIDUwMCk7XG5cblx0XHRcdFx0XHRcdHZhciBjaHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0XHRcdGNvbCA9IHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLWFuY2hvcicpLmZpbHRlcignOnZpc2libGUnKSxcblx0XHRcdFx0XHRcdFx0aW5kID0gY29sLmluZGV4KGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHx8IDAsXG5cdFx0XHRcdFx0XHRcdGVuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0d29yZCArPSBjaHI7XG5cblx0XHRcdFx0XHRcdC8vIG1hdGNoIGZvciB3aG9sZSB3b3JkIGZyb20gY3VycmVudCBub2RlIGRvd24gKGluY2x1ZGluZyB0aGUgY3VycmVudCBub2RlKVxuXHRcdFx0XHRcdFx0aWYod29yZC5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdGNvbC5zbGljZShpbmQpLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0XHRcdGlmKCQodikudGV4dCgpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih3b3JkKSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0JCh2KS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0XHRcdFx0aWYoZW5kKSB7IHJldHVybjsgfVxuXG5cdFx0XHRcdFx0XHRcdC8vIG1hdGNoIGZvciB3aG9sZSB3b3JkIGZyb20gdGhlIGJlZ2lubmluZyBvZiB0aGUgdHJlZVxuXHRcdFx0XHRcdFx0XHRjb2wuc2xpY2UoMCwgaW5kKS5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdFx0XHRpZigkKHYpLnRleHQoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yod29yZCkgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdCQodikuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGVuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdFx0XHRcdGlmKGVuZCkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vIGxpc3Qgbm9kZXMgdGhhdCBzdGFydCB3aXRoIHRoYXQgbGV0dGVyIChvbmx5IGlmIHdvcmQgY29uc2lzdHMgb2YgYSBzaW5nbGUgY2hhcilcblx0XHRcdFx0XHRcdGlmKG5ldyBSZWdFeHAoJ14nICsgY2hyLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpICsgJyskJykudGVzdCh3b3JkKSkge1xuXHRcdFx0XHRcdFx0XHQvLyBzZWFyY2ggZm9yIHRoZSBuZXh0IG5vZGUgc3RhcnRpbmcgd2l0aCB0aGF0IGxldHRlclxuXHRcdFx0XHRcdFx0XHRjb2wuc2xpY2UoaW5kICsgMSkuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYoJCh2KS50ZXh0KCkudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09IGNocikge1xuXHRcdFx0XHRcdFx0XHRcdFx0JCh2KS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0XHRcdFx0aWYoZW5kKSB7IHJldHVybjsgfVxuXG5cdFx0XHRcdFx0XHRcdC8vIHNlYXJjaCBmcm9tIHRoZSBiZWdpbm5pbmdcblx0XHRcdFx0XHRcdFx0Y29sLnNsaWNlKDAsIGluZCArIDEpLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0XHRcdGlmKCQodikudGV4dCgpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSBjaHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdCQodikuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGVuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdFx0XHRcdGlmKGVuZCkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Ly8gVEhFTUUgUkVMQVRFRFxuXHRcdFx0XHQub24oXCJpbml0LmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciBzID0gdGhpcy5zZXR0aW5ncy5jb3JlLnRoZW1lcztcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZG90c1x0XHRcdD0gcy5kb3RzO1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5zdHJpcGVzXHRcdD0gcy5zdHJpcGVzO1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5pY29uc1x0XHQ9IHMuaWNvbnM7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmVsbGlwc2lzXHRcdD0gcy5lbGxpcHNpcztcblx0XHRcdFx0XHRcdHRoaXMuc2V0X3RoZW1lKHMubmFtZSB8fCBcImRlZmF1bHRcIiwgcy51cmwpO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRfdGhlbWVfdmFyaWFudChzLnZhcmlhbnQpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJsb2FkaW5nLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHRoaXNbIHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZG90cyA/IFwic2hvd19kb3RzXCIgOiBcImhpZGVfZG90c1wiIF0oKTtcblx0XHRcdFx0XHRcdHRoaXNbIHRoaXMuX2RhdGEuY29yZS50aGVtZXMuaWNvbnMgPyBcInNob3dfaWNvbnNcIiA6IFwiaGlkZV9pY29uc1wiIF0oKTtcblx0XHRcdFx0XHRcdHRoaXNbIHRoaXMuX2RhdGEuY29yZS50aGVtZXMuc3RyaXBlcyA/IFwic2hvd19zdHJpcGVzXCIgOiBcImhpZGVfc3RyaXBlc1wiIF0oKTtcblx0XHRcdFx0XHRcdHRoaXNbIHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZWxsaXBzaXMgPyBcInNob3dfZWxsaXBzaXNcIiA6IFwiaGlkZV9lbGxpcHNpc1wiIF0oKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKCdibHVyLmpzdHJlZScsICcuanN0cmVlLWFuY2hvcicsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkID0gbnVsbDtcblx0XHRcdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS5maWx0ZXIoJy5qc3RyZWUtaG92ZXJlZCcpLnRyaWdnZXIoJ21vdXNlbGVhdmUnKTtcblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCd0YWJpbmRleCcsICcwJyk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbignZm9jdXMuanN0cmVlJywgJy5qc3RyZWUtYW5jaG9yJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0dmFyIHRtcCA9IHRoaXMuZ2V0X25vZGUoZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAuaWQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgPSB0bXAuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS1ob3ZlcmVkJykubm90KGUuY3VycmVudFRhcmdldCkudHJpZ2dlcignbW91c2VsZWF2ZScpO1xuXHRcdFx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLnRyaWdnZXIoJ21vdXNlZW50ZXInKTtcblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCd0YWJpbmRleCcsICctMScpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oJ2ZvY3VzLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0aWYoKyhuZXcgRGF0ZSgpKSAtIHdhc19jbGljayA+IDUwMCAmJiAhdGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgJiYgdGhpcy5zZXR0aW5ncy5jb3JlLnJlc3RvcmVfZm9jdXMpIHtcblx0XHRcdFx0XHRcdFx0d2FzX2NsaWNrID0gMDtcblx0XHRcdFx0XHRcdFx0dmFyIGFjdCA9IHRoaXMuZ2V0X25vZGUodGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcpLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0aWYoYWN0KSB7XG5cdFx0XHRcdFx0XHRcdFx0YWN0LmZpbmQoJz4gLmpzdHJlZS1hbmNob3InKS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbignbW91c2VlbnRlci5qc3RyZWUnLCAnLmpzdHJlZS1hbmNob3InLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmhvdmVyX25vZGUoZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKCdtb3VzZWxlYXZlLmpzdHJlZScsICcuanN0cmVlLWFuY2hvcicsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuZGVob3Zlcl9ub2RlKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcGFydCBvZiB0aGUgZGVzdHJveWluZyBvZiBhbiBpbnN0YW5jZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgdW5iaW5kKClcblx0XHQgKi9cblx0XHR1bmJpbmQgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQub2ZmKCcuanN0cmVlJyk7XG5cdFx0XHQkKGRvY3VtZW50KS5vZmYoJy5qc3RyZWUtJyArIHRoaXMuX2lkKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHRyaWdnZXIgYW4gZXZlbnQuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIHRyaWdnZXIoZXYgWywgZGF0YV0pXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBldiB0aGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gdHJpZ2dlclxuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBhZGRpdGlvbmFsIGRhdGEgdG8gcGFzcyB3aXRoIHRoZSBldmVudFxuXHRcdCAqL1xuXHRcdHRyaWdnZXIgOiBmdW5jdGlvbiAoZXYsIGRhdGEpIHtcblx0XHRcdGlmKCFkYXRhKSB7XG5cdFx0XHRcdGRhdGEgPSB7fTtcblx0XHRcdH1cblx0XHRcdGRhdGEuaW5zdGFuY2UgPSB0aGlzO1xuXHRcdFx0dGhpcy5lbGVtZW50LnRyaWdnZXJIYW5kbGVyKGV2LnJlcGxhY2UoJy5qc3RyZWUnLCcnKSArICcuanN0cmVlJywgZGF0YSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZXR1cm5zIHRoZSBqUXVlcnkgZXh0ZW5kZWQgaW5zdGFuY2UgY29udGFpbmVyXG5cdFx0ICogQG5hbWUgZ2V0X2NvbnRhaW5lcigpXG5cdFx0ICogQHJldHVybiB7alF1ZXJ5fVxuXHRcdCAqL1xuXHRcdGdldF9jb250YWluZXIgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbGVtZW50O1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmV0dXJucyB0aGUgalF1ZXJ5IGV4dGVuZGVkIG1haW4gVUwgbm9kZSBpbnNpZGUgdGhlIGluc3RhbmNlIGNvbnRhaW5lci4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgZ2V0X2NvbnRhaW5lcl91bCgpXG5cdFx0ICogQHJldHVybiB7alF1ZXJ5fVxuXHRcdCAqL1xuXHRcdGdldF9jb250YWluZXJfdWwgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbGVtZW50LmNoaWxkcmVuKFwiLmpzdHJlZS1jaGlsZHJlblwiKS5maXJzdCgpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0cyBzdHJpbmcgcmVwbGFjZW1lbnRzIChsb2NhbGl6YXRpb24pLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBnZXRfc3RyaW5nKGtleSlcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGtleVxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cblx0XHQgKi9cblx0XHRnZXRfc3RyaW5nIDogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0dmFyIGEgPSB0aGlzLnNldHRpbmdzLmNvcmUuc3RyaW5ncztcblx0XHRcdGlmKCQuaXNGdW5jdGlvbihhKSkgeyByZXR1cm4gYS5jYWxsKHRoaXMsIGtleSk7IH1cblx0XHRcdGlmKGEgJiYgYVtrZXldKSB7IHJldHVybiBhW2tleV07IH1cblx0XHRcdHJldHVybiBrZXk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXRzIHRoZSBmaXJzdCBjaGlsZCBvZiBhIERPTSBub2RlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfZmlyc3RDaGlsZChkb20pXG5cdFx0ICogQHBhcmFtICB7RE9NRWxlbWVudH0gZG9tXG5cdFx0ICogQHJldHVybiB7RE9NRWxlbWVudH1cblx0XHQgKi9cblx0XHRfZmlyc3RDaGlsZCA6IGZ1bmN0aW9uIChkb20pIHtcblx0XHRcdGRvbSA9IGRvbSA/IGRvbS5maXJzdENoaWxkIDogbnVsbDtcblx0XHRcdHdoaWxlKGRvbSAhPT0gbnVsbCAmJiBkb20ubm9kZVR5cGUgIT09IDEpIHtcblx0XHRcdFx0ZG9tID0gZG9tLm5leHRTaWJsaW5nO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRvbTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldHMgdGhlIG5leHQgc2libGluZyBvZiBhIERPTSBub2RlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfbmV4dFNpYmxpbmcoZG9tKVxuXHRcdCAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IGRvbVxuXHRcdCAqIEByZXR1cm4ge0RPTUVsZW1lbnR9XG5cdFx0ICovXG5cdFx0X25leHRTaWJsaW5nIDogZnVuY3Rpb24gKGRvbSkge1xuXHRcdFx0ZG9tID0gZG9tID8gZG9tLm5leHRTaWJsaW5nIDogbnVsbDtcblx0XHRcdHdoaWxlKGRvbSAhPT0gbnVsbCAmJiBkb20ubm9kZVR5cGUgIT09IDEpIHtcblx0XHRcdFx0ZG9tID0gZG9tLm5leHRTaWJsaW5nO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRvbTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldHMgdGhlIHByZXZpb3VzIHNpYmxpbmcgb2YgYSBET00gbm9kZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX3ByZXZpb3VzU2libGluZyhkb20pXG5cdFx0ICogQHBhcmFtICB7RE9NRWxlbWVudH0gZG9tXG5cdFx0ICogQHJldHVybiB7RE9NRWxlbWVudH1cblx0XHQgKi9cblx0XHRfcHJldmlvdXNTaWJsaW5nIDogZnVuY3Rpb24gKGRvbSkge1xuXHRcdFx0ZG9tID0gZG9tID8gZG9tLnByZXZpb3VzU2libGluZyA6IG51bGw7XG5cdFx0XHR3aGlsZShkb20gIT09IG51bGwgJiYgZG9tLm5vZGVUeXBlICE9PSAxKSB7XG5cdFx0XHRcdGRvbSA9IGRvbS5wcmV2aW91c1NpYmxpbmc7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZG9tO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IHRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIGEgbm9kZSAob3IgdGhlIGFjdHVhbCBqUXVlcnkgZXh0ZW5kZWQgRE9NIG5vZGUpIGJ5IHVzaW5nIGFueSBpbnB1dCAoY2hpbGQgRE9NIGVsZW1lbnQsIElEIHN0cmluZywgc2VsZWN0b3IsIGV0Yylcblx0XHQgKiBAbmFtZSBnZXRfbm9kZShvYmogWywgYXNfZG9tXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gYXNfZG9tXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fGpRdWVyeX1cblx0XHQgKi9cblx0XHRnZXRfbm9kZSA6IGZ1bmN0aW9uIChvYmosIGFzX2RvbSkge1xuXHRcdFx0aWYob2JqICYmIG9iai5pZCkge1xuXHRcdFx0XHRvYmogPSBvYmouaWQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAob2JqIGluc3RhbmNlb2YgJCAmJiBvYmoubGVuZ3RoICYmIG9ialswXS5pZCkge1xuXHRcdFx0XHRvYmogPSBvYmpbMF0uaWQ7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZG9tO1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVtvYmpdKSB7XG5cdFx0XHRcdFx0b2JqID0gdGhpcy5fbW9kZWwuZGF0YVtvYmpdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLl9tb2RlbC5kYXRhW29iai5yZXBsYWNlKC9eIy8sICcnKV0pIHtcblx0XHRcdFx0XHRvYmogPSB0aGlzLl9tb2RlbC5kYXRhW29iai5yZXBsYWNlKC9eIy8sICcnKV07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZih0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiICYmIChkb20gPSAkKCcjJyArIG9iai5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpLCB0aGlzLmVsZW1lbnQpKS5sZW5ndGggJiYgdGhpcy5fbW9kZWwuZGF0YVtkb20uY2xvc2VzdCgnLmpzdHJlZS1ub2RlJykuYXR0cignaWQnKV0pIHtcblx0XHRcdFx0XHRvYmogPSB0aGlzLl9tb2RlbC5kYXRhW2RvbS5jbG9zZXN0KCcuanN0cmVlLW5vZGUnKS5hdHRyKCdpZCcpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKChkb20gPSB0aGlzLmVsZW1lbnQuZmluZChvYmopKS5sZW5ndGggJiYgdGhpcy5fbW9kZWwuZGF0YVtkb20uY2xvc2VzdCgnLmpzdHJlZS1ub2RlJykuYXR0cignaWQnKV0pIHtcblx0XHRcdFx0XHRvYmogPSB0aGlzLl9tb2RlbC5kYXRhW2RvbS5jbG9zZXN0KCcuanN0cmVlLW5vZGUnKS5hdHRyKCdpZCcpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKChkb20gPSB0aGlzLmVsZW1lbnQuZmluZChvYmopKS5sZW5ndGggJiYgZG9tLmhhc0NsYXNzKCdqc3RyZWUnKSkge1xuXHRcdFx0XHRcdG9iaiA9IHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoYXNfZG9tKSB7XG5cdFx0XHRcdFx0b2JqID0gb2JqLmlkID09PSAkLmpzdHJlZS5yb290ID8gdGhpcy5lbGVtZW50IDogJCgnIycgKyBvYmouaWQucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSwgdGhpcy5lbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0fSBjYXRjaCAoZXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgdGhlIHBhdGggdG8gYSBub2RlLCBlaXRoZXIgY29uc2lzdGluZyBvZiBub2RlIHRleHRzLCBvciBvZiBub2RlIElEcywgb3B0aW9uYWxseSBnbHVlZCB0b2dldGhlciAob3RoZXJ3aXNlIGFuIGFycmF5KVxuXHRcdCAqIEBuYW1lIGdldF9wYXRoKG9iaiBbLCBnbHVlLCBpZHNdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGdsdWUgaWYgeW91IHdhbnQgdGhlIHBhdGggYXMgYSBzdHJpbmcgLSBwYXNzIHRoZSBnbHVlIGhlcmUgKGZvciBleGFtcGxlICcvJyksIGlmIGEgZmFsc3kgdmFsdWUgaXMgc3VwcGxpZWQgaGVyZSwgYW4gYXJyYXkgaXMgcmV0dXJuZWRcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBpZHMgaWYgc2V0IHRvIHRydWUgYnVpbGQgdGhlIHBhdGggdXNpbmcgSUQsIG90aGVyd2lzZSBub2RlIHRleHQgaXMgdXNlZFxuXHRcdCAqIEByZXR1cm4ge21peGVkfVxuXHRcdCAqL1xuXHRcdGdldF9wYXRoIDogZnVuY3Rpb24gKG9iaiwgZ2x1ZSwgaWRzKSB7XG5cdFx0XHRvYmogPSBvYmoucGFyZW50cyA/IG9iaiA6IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290IHx8ICFvYmoucGFyZW50cykge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgaSwgaiwgcCA9IFtdO1xuXHRcdFx0cC5wdXNoKGlkcyA/IG9iai5pZCA6IG9iai50ZXh0KTtcblx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRwLnB1c2goaWRzID8gb2JqLnBhcmVudHNbaV0gOiB0aGlzLmdldF90ZXh0KG9iai5wYXJlbnRzW2ldKSk7XG5cdFx0XHR9XG5cdFx0XHRwID0gcC5yZXZlcnNlKCkuc2xpY2UoMSk7XG5cdFx0XHRyZXR1cm4gZ2x1ZSA/IHAuam9pbihnbHVlKSA6IHA7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgdGhlIG5leHQgdmlzaWJsZSBub2RlIHRoYXQgaXMgYmVsb3cgdGhlIGBvYmpgIG5vZGUuIElmIGBzdHJpY3RgIGlzIHNldCB0byBgdHJ1ZWAgb25seSBzaWJsaW5nIG5vZGVzIGFyZSByZXR1cm5lZC5cblx0XHQgKiBAbmFtZSBnZXRfbmV4dF9kb20ob2JqIFssIHN0cmljdF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IHN0cmljdFxuXHRcdCAqIEByZXR1cm4ge2pRdWVyeX1cblx0XHQgKi9cblx0XHRnZXRfbmV4dF9kb20gOiBmdW5jdGlvbiAob2JqLCBzdHJpY3QpIHtcblx0XHRcdHZhciB0bXA7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZihvYmpbMF0gPT09IHRoaXMuZWxlbWVudFswXSkge1xuXHRcdFx0XHR0bXAgPSB0aGlzLl9maXJzdENoaWxkKHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdKTtcblx0XHRcdFx0d2hpbGUgKHRtcCAmJiB0bXAub2Zmc2V0SGVpZ2h0ID09PSAwKSB7XG5cdFx0XHRcdFx0dG1wID0gdGhpcy5fbmV4dFNpYmxpbmcodG1wKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdG1wID8gJCh0bXApIDogZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZighb2JqIHx8ICFvYmoubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKHN0cmljdCkge1xuXHRcdFx0XHR0bXAgPSBvYmpbMF07XG5cdFx0XHRcdGRvIHtcblx0XHRcdFx0XHR0bXAgPSB0aGlzLl9uZXh0U2libGluZyh0bXApO1xuXHRcdFx0XHR9IHdoaWxlICh0bXAgJiYgdG1wLm9mZnNldEhlaWdodCA9PT0gMCk7XG5cdFx0XHRcdHJldHVybiB0bXAgPyAkKHRtcCkgOiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKG9iai5oYXNDbGFzcyhcImpzdHJlZS1vcGVuXCIpKSB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuX2ZpcnN0Q2hpbGQob2JqLmNoaWxkcmVuKCcuanN0cmVlLWNoaWxkcmVuJylbMF0pO1xuXHRcdFx0XHR3aGlsZSAodG1wICYmIHRtcC5vZmZzZXRIZWlnaHQgPT09IDApIHtcblx0XHRcdFx0XHR0bXAgPSB0aGlzLl9uZXh0U2libGluZyh0bXApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHRtcCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiAkKHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRtcCA9IG9ialswXTtcblx0XHRcdGRvIHtcblx0XHRcdFx0dG1wID0gdGhpcy5fbmV4dFNpYmxpbmcodG1wKTtcblx0XHRcdH0gd2hpbGUgKHRtcCAmJiB0bXAub2Zmc2V0SGVpZ2h0ID09PSAwKTtcblx0XHRcdGlmKHRtcCAhPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gJCh0bXApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9iai5wYXJlbnRzVW50aWwoXCIuanN0cmVlXCIsXCIuanN0cmVlLW5vZGVcIikubmV4dEFsbChcIi5qc3RyZWUtbm9kZTp2aXNpYmxlXCIpLmZpcnN0KCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgdGhlIHByZXZpb3VzIHZpc2libGUgbm9kZSB0aGF0IGlzIGFib3ZlIHRoZSBgb2JqYCBub2RlLiBJZiBgc3RyaWN0YCBpcyBzZXQgdG8gYHRydWVgIG9ubHkgc2libGluZyBub2RlcyBhcmUgcmV0dXJuZWQuXG5cdFx0ICogQG5hbWUgZ2V0X3ByZXZfZG9tKG9iaiBbLCBzdHJpY3RdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBzdHJpY3Rcblx0XHQgKiBAcmV0dXJuIHtqUXVlcnl9XG5cdFx0ICovXG5cdFx0Z2V0X3ByZXZfZG9tIDogZnVuY3Rpb24gKG9iaiwgc3RyaWN0KSB7XG5cdFx0XHR2YXIgdG1wO1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYob2JqWzBdID09PSB0aGlzLmVsZW1lbnRbMF0pIHtcblx0XHRcdFx0dG1wID0gdGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0ubGFzdENoaWxkO1xuXHRcdFx0XHR3aGlsZSAodG1wICYmIHRtcC5vZmZzZXRIZWlnaHQgPT09IDApIHtcblx0XHRcdFx0XHR0bXAgPSB0aGlzLl9wcmV2aW91c1NpYmxpbmcodG1wKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdG1wID8gJCh0bXApIDogZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZighb2JqIHx8ICFvYmoubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKHN0cmljdCkge1xuXHRcdFx0XHR0bXAgPSBvYmpbMF07XG5cdFx0XHRcdGRvIHtcblx0XHRcdFx0XHR0bXAgPSB0aGlzLl9wcmV2aW91c1NpYmxpbmcodG1wKTtcblx0XHRcdFx0fSB3aGlsZSAodG1wICYmIHRtcC5vZmZzZXRIZWlnaHQgPT09IDApO1xuXHRcdFx0XHRyZXR1cm4gdG1wID8gJCh0bXApIDogZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBvYmpbMF07XG5cdFx0XHRkbyB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuX3ByZXZpb3VzU2libGluZyh0bXApO1xuXHRcdFx0fSB3aGlsZSAodG1wICYmIHRtcC5vZmZzZXRIZWlnaHQgPT09IDApO1xuXHRcdFx0aWYodG1wICE9PSBudWxsKSB7XG5cdFx0XHRcdG9iaiA9ICQodG1wKTtcblx0XHRcdFx0d2hpbGUob2JqLmhhc0NsYXNzKFwianN0cmVlLW9wZW5cIikpIHtcblx0XHRcdFx0XHRvYmogPSBvYmouY2hpbGRyZW4oXCIuanN0cmVlLWNoaWxkcmVuXCIpLmZpcnN0KCkuY2hpbGRyZW4oXCIuanN0cmVlLW5vZGU6dmlzaWJsZTpsYXN0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBvYmo7XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBvYmpbMF0ucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuXHRcdFx0cmV0dXJuIHRtcCAmJiB0bXAuY2xhc3NOYW1lICYmIHRtcC5jbGFzc05hbWUuaW5kZXhPZignanN0cmVlLW5vZGUnKSAhPT0gLTEgPyAkKHRtcCkgOiBmYWxzZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCB0aGUgcGFyZW50IElEIG9mIGEgbm9kZVxuXHRcdCAqIEBuYW1lIGdldF9wYXJlbnQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0Z2V0X3BhcmVudCA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvYmoucGFyZW50O1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IGEgalF1ZXJ5IGNvbGxlY3Rpb24gb2YgYWxsIHRoZSBjaGlsZHJlbiBvZiBhIG5vZGUgKG5vZGUgbXVzdCBiZSByZW5kZXJlZCksIHJldHVybnMgZmFsc2Ugb24gZXJyb3Jcblx0XHQgKiBAbmFtZSBnZXRfY2hpbGRyZW5fZG9tKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7alF1ZXJ5fVxuXHRcdCAqL1xuXHRcdGdldF9jaGlsZHJlbl9kb20gOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZihvYmpbMF0gPT09IHRoaXMuZWxlbWVudFswXSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRfY29udGFpbmVyX3VsKCkuY2hpbGRyZW4oXCIuanN0cmVlLW5vZGVcIik7XG5cdFx0XHR9XG5cdFx0XHRpZighb2JqIHx8ICFvYmoubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvYmouY2hpbGRyZW4oXCIuanN0cmVlLWNoaWxkcmVuXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS1ub2RlXCIpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2tzIGlmIGEgbm9kZSBoYXMgY2hpbGRyZW5cblx0XHQgKiBAbmFtZSBpc19wYXJlbnQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGlzX3BhcmVudCA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiBvYmogJiYgKG9iai5zdGF0ZS5sb2FkZWQgPT09IGZhbHNlIHx8IG9iai5jaGlsZHJlbi5sZW5ndGggPiAwKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrcyBpZiBhIG5vZGUgaXMgbG9hZGVkIChpdHMgY2hpbGRyZW4gYXJlIGF2YWlsYWJsZSlcblx0XHQgKiBAbmFtZSBpc19sb2FkZWQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGlzX2xvYWRlZCA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiBvYmogJiYgb2JqLnN0YXRlLmxvYWRlZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrIGlmIGEgbm9kZSBpcyBjdXJyZW50bHkgbG9hZGluZyAoZmV0Y2hpbmcgY2hpbGRyZW4pXG5cdFx0ICogQG5hbWUgaXNfbG9hZGluZyhvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXNfbG9hZGluZyA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiBvYmogJiYgb2JqLnN0YXRlICYmIG9iai5zdGF0ZS5sb2FkaW5nO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2sgaWYgYSBub2RlIGlzIG9wZW5lZFxuXHRcdCAqIEBuYW1lIGlzX29wZW4ob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGlzX29wZW4gOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqICYmIG9iai5zdGF0ZS5vcGVuZWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVjayBpZiBhIG5vZGUgaXMgaW4gYSBjbG9zZWQgc3RhdGVcblx0XHQgKiBAbmFtZSBpc19jbG9zZWQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGlzX2Nsb3NlZCA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiBvYmogJiYgdGhpcy5pc19wYXJlbnQob2JqKSAmJiAhb2JqLnN0YXRlLm9wZW5lZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrIGlmIGEgbm9kZSBoYXMgbm8gY2hpbGRyZW5cblx0XHQgKiBAbmFtZSBpc19sZWFmKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRpc19sZWFmIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0cmV0dXJuICF0aGlzLmlzX3BhcmVudChvYmopO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogbG9hZHMgYSBub2RlIChmZXRjaGVzIGl0cyBjaGlsZHJlbiB1c2luZyB0aGUgYGNvcmUuZGF0YWAgc2V0dGluZykuIE11bHRpcGxlIG5vZGVzIGNhbiBiZSBwYXNzZWQgdG8gYnkgdXNpbmcgYW4gYXJyYXkuXG5cdFx0ICogQG5hbWUgbG9hZF9ub2RlKG9iaiBbLCBjYWxsYmFja10pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEBwYXJhbSAge2Z1bmN0aW9ufSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIG9uY2UgbG9hZGluZyBpcyBjb21wbGV0ZSwgdGhlIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlIGFuZCByZWNlaXZlcyB0d28gYXJndW1lbnRzIC0gdGhlIG5vZGUgYW5kIGEgYm9vbGVhbiBzdGF0dXNcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqIEB0cmlnZ2VyIGxvYWRfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRsb2FkX25vZGUgOiBmdW5jdGlvbiAob2JqLCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIGssIGwsIGksIGosIGM7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHR0aGlzLl9sb2FkX25vZGVzKG9iai5zbGljZSgpLCBjYWxsYmFjayk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaikge1xuXHRcdFx0XHRpZihjYWxsYmFjaykgeyBjYWxsYmFjay5jYWxsKHRoaXMsIG9iaiwgZmFsc2UpOyB9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdC8vIGlmKG9iai5zdGF0ZS5sb2FkaW5nKSB7IH0gLy8gdGhlIG5vZGUgaXMgYWxyZWFkeSBsb2FkaW5nIC0ganVzdCB3YWl0IGZvciBpdCB0byBsb2FkIGFuZCBpbnZva2UgY2FsbGJhY2s/IGJ1dCBpZiBjYWxsZWQgaW1wbGljaXRseSBpdCBzaG91bGQgYmUgbG9hZGVkIGFnYWluP1xuXHRcdFx0aWYob2JqLnN0YXRlLmxvYWRlZCkge1xuXHRcdFx0XHRvYmouc3RhdGUubG9hZGVkID0gZmFsc2U7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbb2JqLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QgPSAkLnZha2F0YS5hcnJheV9maWx0ZXIodGhpcy5fbW9kZWwuZGF0YVtvYmoucGFyZW50c1tpXV0uY2hpbGRyZW5fZCwgZnVuY3Rpb24gKHYpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkLmluQXJyYXkodiwgb2JqLmNoaWxkcmVuX2QpID09PSAtMTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IoayA9IDAsIGwgPSBvYmouY2hpbGRyZW5fZC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW29iai5jaGlsZHJlbl9kW2tdXS5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHRcdFx0YyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRlbGV0ZSB0aGlzLl9tb2RlbC5kYXRhW29iai5jaGlsZHJlbl9kW2tdXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoYykge1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCA9ICQudmFrYXRhLmFycmF5X2ZpbHRlcih0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsIGZ1bmN0aW9uICh2KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJC5pbkFycmF5KHYsIG9iai5jaGlsZHJlbl9kKSA9PT0gLTE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0b2JqLmNoaWxkcmVuID0gW107XG5cdFx0XHRcdG9iai5jaGlsZHJlbl9kID0gW107XG5cdFx0XHRcdGlmKGMpIHtcblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ2xvYWRfbm9kZScsICdub2RlJyA6IG9iaiwgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0b2JqLnN0YXRlLmZhaWxlZCA9IGZhbHNlO1xuXHRcdFx0b2JqLnN0YXRlLmxvYWRpbmcgPSB0cnVlO1xuXHRcdFx0dGhpcy5nZXRfbm9kZShvYmosIHRydWUpLmFkZENsYXNzKFwianN0cmVlLWxvYWRpbmdcIikuYXR0cignYXJpYS1idXN5Jyx0cnVlKTtcblx0XHRcdHRoaXMuX2xvYWRfbm9kZShvYmosICQucHJveHkoZnVuY3Rpb24gKHN0YXR1cykge1xuXHRcdFx0XHRvYmogPSB0aGlzLl9tb2RlbC5kYXRhW29iai5pZF07XG5cdFx0XHRcdG9iai5zdGF0ZS5sb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdG9iai5zdGF0ZS5sb2FkZWQgPSBzdGF0dXM7XG5cdFx0XHRcdG9iai5zdGF0ZS5mYWlsZWQgPSAhb2JqLnN0YXRlLmxvYWRlZDtcblx0XHRcdFx0dmFyIGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKSwgaSA9IDAsIGogPSAwLCBtID0gdGhpcy5fbW9kZWwuZGF0YSwgaGFzX2NoaWxkcmVuID0gZmFsc2U7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZihtW29iai5jaGlsZHJlbltpXV0gJiYgIW1bb2JqLmNoaWxkcmVuW2ldXS5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0XHRcdGhhc19jaGlsZHJlbiA9IHRydWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYob2JqLnN0YXRlLmxvYWRlZCAmJiBkb20gJiYgZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdGRvbS5yZW1vdmVDbGFzcygnanN0cmVlLWNsb3NlZCBqc3RyZWUtb3BlbiBqc3RyZWUtbGVhZicpO1xuXHRcdFx0XHRcdGlmICghaGFzX2NoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHRkb20uYWRkQ2xhc3MoJ2pzdHJlZS1sZWFmJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKG9iai5pZCAhPT0gJyMnKSB7XG5cdFx0XHRcdFx0XHRcdGRvbS5hZGRDbGFzcyhvYmouc3RhdGUub3BlbmVkID8gJ2pzdHJlZS1vcGVuJyA6ICdqc3RyZWUtY2xvc2VkJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGRvbS5yZW1vdmVDbGFzcyhcImpzdHJlZS1sb2FkaW5nXCIpLmF0dHIoJ2FyaWEtYnVzeScsZmFsc2UpO1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIGFmdGVyIGEgbm9kZSBpcyBsb2FkZWRcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIGxvYWRfbm9kZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIG5vZGUgdGhhdCB3YXMgbG9hZGluZ1xuXHRcdFx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHN0YXR1cyB3YXMgdGhlIG5vZGUgbG9hZGVkIHN1Y2Nlc3NmdWxseVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdsb2FkX25vZGUnLCB7IFwibm9kZVwiIDogb2JqLCBcInN0YXR1c1wiIDogc3RhdHVzIH0pO1xuXHRcdFx0XHRpZihjYWxsYmFjaykge1xuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgb2JqLCBzdGF0dXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGxvYWQgYW4gYXJyYXkgb2Ygbm9kZXMgKHdpbGwgYWxzbyBsb2FkIHVuYXZhaWxhYmxlIG5vZGVzIGFzIHNvb24gYXMgdGhleSBhcHBlYXIgaW4gdGhlIHN0cnVjdHVyZSkuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9sb2FkX25vZGVzKG5vZGVzIFssIGNhbGxiYWNrXSlcblx0XHQgKiBAcGFyYW0gIHthcnJheX0gbm9kZXNcblx0XHQgKiBAcGFyYW0gIHtmdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbmNlIGxvYWRpbmcgaXMgY29tcGxldGUsIHRoZSBmdW5jdGlvbiBpcyBleGVjdXRlZCBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSBhbmQgcmVjZWl2ZXMgb25lIGFyZ3VtZW50IC0gdGhlIGFycmF5IHBhc3NlZCB0byBfbG9hZF9ub2Rlc1xuXHRcdCAqL1xuXHRcdF9sb2FkX25vZGVzIDogZnVuY3Rpb24gKG5vZGVzLCBjYWxsYmFjaywgaXNfY2FsbGJhY2ssIGZvcmNlX3JlbG9hZCkge1xuXHRcdFx0dmFyIHIgPSB0cnVlLFxuXHRcdFx0XHRjID0gZnVuY3Rpb24gKCkgeyB0aGlzLl9sb2FkX25vZGVzKG5vZGVzLCBjYWxsYmFjaywgdHJ1ZSk7IH0sXG5cdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLCBpLCBqLCB0bXAgPSBbXTtcblx0XHRcdGZvcihpID0gMCwgaiA9IG5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZihtW25vZGVzW2ldXSAmJiAoICghbVtub2Rlc1tpXV0uc3RhdGUubG9hZGVkICYmICFtW25vZGVzW2ldXS5zdGF0ZS5mYWlsZWQpIHx8ICghaXNfY2FsbGJhY2sgJiYgZm9yY2VfcmVsb2FkKSApKSB7XG5cdFx0XHRcdFx0aWYoIXRoaXMuaXNfbG9hZGluZyhub2Rlc1tpXSkpIHtcblx0XHRcdFx0XHRcdHRoaXMubG9hZF9ub2RlKG5vZGVzW2ldLCBjKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ciA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihyKSB7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKG1bbm9kZXNbaV1dICYmIG1bbm9kZXNbaV1dLnN0YXRlLmxvYWRlZCkge1xuXHRcdFx0XHRcdFx0dG1wLnB1c2gobm9kZXNbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZihjYWxsYmFjayAmJiAhY2FsbGJhY2suZG9uZSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgdG1wKTtcblx0XHRcdFx0XHRjYWxsYmFjay5kb25lID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogbG9hZHMgYWxsIHVubG9hZGVkIG5vZGVzXG5cdFx0ICogQG5hbWUgbG9hZF9hbGwoW29iaiwgY2FsbGJhY2tdKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBsb2FkIHJlY3Vyc2l2ZWx5LCBvbWl0IHRvIGxvYWQgYWxsIG5vZGVzIGluIHRoZSB0cmVlXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbmNlIGxvYWRpbmcgYWxsIHRoZSBub2RlcyBpcyBjb21wbGV0ZSxcblx0XHQgKiBAdHJpZ2dlciBsb2FkX2FsbC5qc3RyZWVcblx0XHQgKi9cblx0XHRsb2FkX2FsbCA6IGZ1bmN0aW9uIChvYmosIGNhbGxiYWNrKSB7XG5cdFx0XHRpZighb2JqKSB7IG9iaiA9ICQuanN0cmVlLnJvb3Q7IH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR2YXIgdG9fbG9hZCA9IFtdLFxuXHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0YyA9IG1bb2JqLmlkXS5jaGlsZHJlbl9kLFxuXHRcdFx0XHRpLCBqO1xuXHRcdFx0aWYob2JqLnN0YXRlICYmICFvYmouc3RhdGUubG9hZGVkKSB7XG5cdFx0XHRcdHRvX2xvYWQucHVzaChvYmouaWQpO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGkgPSAwLCBqID0gYy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYobVtjW2ldXSAmJiBtW2NbaV1dLnN0YXRlICYmICFtW2NbaV1dLnN0YXRlLmxvYWRlZCkge1xuXHRcdFx0XHRcdHRvX2xvYWQucHVzaChjW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYodG9fbG9hZC5sZW5ndGgpIHtcblx0XHRcdFx0dGhpcy5fbG9hZF9ub2Rlcyh0b19sb2FkLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGhpcy5sb2FkX2FsbChvYmosIGNhbGxiYWNrKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCBhZnRlciBhIGxvYWRfYWxsIGNhbGwgY29tcGxldGVzXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBsb2FkX2FsbC5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIHJlY3Vyc2l2ZWx5IGxvYWRlZCBub2RlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRpZihjYWxsYmFjaykgeyBjYWxsYmFjay5jYWxsKHRoaXMsIG9iaik7IH1cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdsb2FkX2FsbCcsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBoYW5kbGVzIHRoZSBhY3R1YWwgbG9hZGluZyBvZiBhIG5vZGUuIFVzZWQgb25seSBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX2xvYWRfbm9kZShvYmogWywgY2FsbGJhY2tdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcGFyYW0gIHtmdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbmNlIGxvYWRpbmcgaXMgY29tcGxldGUsIHRoZSBmdW5jdGlvbiBpcyBleGVjdXRlZCBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSBhbmQgcmVjZWl2ZXMgb25lIGFyZ3VtZW50IC0gYSBib29sZWFuIHN0YXR1c1xuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0X2xvYWRfbm9kZSA6IGZ1bmN0aW9uIChvYmosIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgcyA9IHRoaXMuc2V0dGluZ3MuY29yZS5kYXRhLCB0O1xuXHRcdFx0dmFyIG5vdFRleHRPckNvbW1lbnROb2RlID0gZnVuY3Rpb24gbm90VGV4dE9yQ29tbWVudE5vZGUgKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlVHlwZSAhPT0gMyAmJiB0aGlzLm5vZGVUeXBlICE9PSA4O1xuXHRcdFx0fTtcblx0XHRcdC8vIHVzZSBvcmlnaW5hbCBIVE1MXG5cdFx0XHRpZighcykge1xuXHRcdFx0XHRpZihvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fYXBwZW5kX2h0bWxfZGF0YShvYmosIHRoaXMuX2RhdGEuY29yZS5vcmlnaW5hbF9jb250YWluZXJfaHRtbC5jbG9uZSh0cnVlKSwgZnVuY3Rpb24gKHN0YXR1cykge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBzdGF0dXMpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QgPyB0aGlzLl9hcHBlbmRfaHRtbF9kYXRhKG9iaiwgdGhpcy5fZGF0YS5jb3JlLm9yaWdpbmFsX2NvbnRhaW5lcl9odG1sLmNsb25lKHRydWUpKSA6IGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdGlmKCQuaXNGdW5jdGlvbihzKSkge1xuXHRcdFx0XHRyZXR1cm4gcy5jYWxsKHRoaXMsIG9iaiwgJC5wcm94eShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdGlmKGQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzW3R5cGVvZiBkID09PSAnc3RyaW5nJyA/ICdfYXBwZW5kX2h0bWxfZGF0YScgOiAnX2FwcGVuZF9qc29uX2RhdGEnXShvYmosIHR5cGVvZiBkID09PSAnc3RyaW5nJyA/ICQoJC5wYXJzZUhUTUwoZCkpLmZpbHRlcihub3RUZXh0T3JDb21tZW50Tm9kZSkgOiBkLCBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgc3RhdHVzKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyByZXR1cm4gZCA9PT0gZmFsc2UgPyBjYWxsYmFjay5jYWxsKHRoaXMsIGZhbHNlKSA6IGNhbGxiYWNrLmNhbGwodGhpcywgdGhpc1t0eXBlb2YgZCA9PT0gJ3N0cmluZycgPyAnX2FwcGVuZF9odG1sX2RhdGEnIDogJ19hcHBlbmRfanNvbl9kYXRhJ10ob2JqLCB0eXBlb2YgZCA9PT0gJ3N0cmluZycgPyAkKGQpIDogZCkpO1xuXHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHR9XG5cdFx0XHRpZih0eXBlb2YgcyA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0aWYocy51cmwpIHtcblx0XHRcdFx0XHRzID0gJC5leHRlbmQodHJ1ZSwge30sIHMpO1xuXHRcdFx0XHRcdGlmKCQuaXNGdW5jdGlvbihzLnVybCkpIHtcblx0XHRcdFx0XHRcdHMudXJsID0gcy51cmwuY2FsbCh0aGlzLCBvYmopO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZigkLmlzRnVuY3Rpb24ocy5kYXRhKSkge1xuXHRcdFx0XHRcdFx0cy5kYXRhID0gcy5kYXRhLmNhbGwodGhpcywgb2JqKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuICQuYWpheChzKVxuXHRcdFx0XHRcdFx0LmRvbmUoJC5wcm94eShmdW5jdGlvbiAoZCx0LHgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdHlwZSA9IHguZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKCh0eXBlICYmIHR5cGUuaW5kZXhPZignanNvbicpICE9PSAtMSkgfHwgdHlwZW9mIGQgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl9hcHBlbmRfanNvbl9kYXRhKG9iaiwgZCwgZnVuY3Rpb24gKHN0YXR1cykgeyBjYWxsYmFjay5jYWxsKHRoaXMsIHN0YXR1cyk7IH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly9yZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCB0aGlzLl9hcHBlbmRfanNvbl9kYXRhKG9iaiwgZCkpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZigodHlwZSAmJiB0eXBlLmluZGV4T2YoJ2h0bWwnKSAhPT0gLTEpIHx8IHR5cGVvZiBkID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fYXBwZW5kX2h0bWxfZGF0YShvYmosICQoJC5wYXJzZUhUTUwoZCkpLmZpbHRlcihub3RUZXh0T3JDb21tZW50Tm9kZSksIGZ1bmN0aW9uIChzdGF0dXMpIHsgY2FsbGJhY2suY2FsbCh0aGlzLCBzdGF0dXMpOyB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdC8vIHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuX2FwcGVuZF9odG1sX2RhdGEob2JqLCAkKGQpKSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2FqYXgnLCAncGx1Z2luJyA6ICdjb3JlJywgJ2lkJyA6ICdjb3JlXzA0JywgJ3JlYXNvbicgOiAnQ291bGQgbm90IGxvYWQgbm9kZScsICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2lkJyA6IG9iai5pZCwgJ3hocicgOiB4IH0pIH07XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdFx0XHQuZmFpbCgkLnByb3h5KGZ1bmN0aW9uIChmKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnYWpheCcsICdwbHVnaW4nIDogJ2NvcmUnLCAnaWQnIDogJ2NvcmVfMDQnLCAncmVhc29uJyA6ICdDb3VsZCBub3QgbG9hZCBub2RlJywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnaWQnIDogb2JqLmlkLCAneGhyJyA6IGYgfSkgfTtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoJC5pc0FycmF5KHMpKSB7XG5cdFx0XHRcdFx0dCA9ICQuZXh0ZW5kKHRydWUsIFtdLCBzKTtcblx0XHRcdFx0fSBlbHNlIGlmICgkLmlzUGxhaW5PYmplY3QocykpIHtcblx0XHRcdFx0XHR0ID0gJC5leHRlbmQodHJ1ZSwge30sIHMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHQgPSBzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLl9hcHBlbmRfanNvbl9kYXRhKG9iaiwgdCwgZnVuY3Rpb24gKHN0YXR1cykge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBzdGF0dXMpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ25vZGF0YScsICdwbHVnaW4nIDogJ2NvcmUnLCAnaWQnIDogJ2NvcmVfMDUnLCAncmVhc29uJyA6ICdDb3VsZCBub3QgbG9hZCBub2RlJywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnaWQnIDogb2JqLmlkIH0pIH07XG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL3JldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIChvYmouaWQgPT09ICQuanN0cmVlLnJvb3QgPyB0aGlzLl9hcHBlbmRfanNvbl9kYXRhKG9iaiwgdCkgOiBmYWxzZSkgKTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiBzID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRpZihvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fYXBwZW5kX2h0bWxfZGF0YShvYmosICQoJC5wYXJzZUhUTUwocykpLmZpbHRlcihub3RUZXh0T3JDb21tZW50Tm9kZSksIGZ1bmN0aW9uIChzdGF0dXMpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgc3RhdHVzKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdub2RhdGEnLCAncGx1Z2luJyA6ICdjb3JlJywgJ2lkJyA6ICdjb3JlXzA2JywgJ3JlYXNvbicgOiAnQ291bGQgbm90IGxvYWQgbm9kZScsICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2lkJyA6IG9iai5pZCB9KSB9O1xuXHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9yZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCAob2JqLmlkID09PSAkLmpzdHJlZS5yb290ID8gdGhpcy5fYXBwZW5kX2h0bWxfZGF0YShvYmosICQocykpIDogZmFsc2UpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCBmYWxzZSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBhZGRzIGEgbm9kZSB0byB0aGUgbGlzdCBvZiBub2RlcyB0byByZWRyYXcuIFVzZWQgb25seSBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX25vZGVfY2hhbmdlZChvYmogWywgY2FsbGJhY2tdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKi9cblx0XHRfbm9kZV9jaGFuZ2VkIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuICAgICAgaWYgKG9iaiAmJiAkLmluQXJyYXkob2JqLmlkLCB0aGlzLl9tb2RlbC5jaGFuZ2VkKSA9PT0gLTEpIHtcblx0XHRcdFx0dGhpcy5fbW9kZWwuY2hhbmdlZC5wdXNoKG9iai5pZCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBhcHBlbmRzIEhUTUwgY29udGVudCB0byB0aGUgdHJlZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX2FwcGVuZF9odG1sX2RhdGEob2JqLCBkYXRhKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGUgdG8gYXBwZW5kIHRvXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBkYXRhIHRoZSBIVE1MIHN0cmluZyB0byBwYXJzZSBhbmQgYXBwZW5kXG5cdFx0ICogQHRyaWdnZXIgbW9kZWwuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdF9hcHBlbmRfaHRtbF9kYXRhIDogZnVuY3Rpb24gKGRvbSwgZGF0YSwgY2IpIHtcblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUoZG9tKTtcblx0XHRcdGRvbS5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0ZG9tLmNoaWxkcmVuX2QgPSBbXTtcblx0XHRcdHZhciBkYXQgPSBkYXRhLmlzKCd1bCcpID8gZGF0YS5jaGlsZHJlbigpIDogZGF0YSxcblx0XHRcdFx0cGFyID0gZG9tLmlkLFxuXHRcdFx0XHRjaGQgPSBbXSxcblx0XHRcdFx0ZHBjID0gW10sXG5cdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRwID0gbVtwYXJdLFxuXHRcdFx0XHRzID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmxlbmd0aCxcblx0XHRcdFx0dG1wLCBpLCBqO1xuXHRcdFx0ZGF0LmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHR0bXAgPSB0aGlzLl9wYXJzZV9tb2RlbF9mcm9tX2h0bWwoJCh2KSwgcGFyLCBwLnBhcmVudHMuY29uY2F0KCkpO1xuXHRcdFx0XHRpZih0bXApIHtcblx0XHRcdFx0XHRjaGQucHVzaCh0bXApO1xuXHRcdFx0XHRcdGRwYy5wdXNoKHRtcCk7XG5cdFx0XHRcdFx0aWYobVt0bXBdLmNoaWxkcmVuX2QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRkcGMgPSBkcGMuY29uY2F0KG1bdG1wXS5jaGlsZHJlbl9kKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdHAuY2hpbGRyZW4gPSBjaGQ7XG5cdFx0XHRwLmNoaWxkcmVuX2QgPSBkcGM7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBwLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdG1bcC5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kID0gbVtwLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QuY29uY2F0KGRwYyk7XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIG5ldyBkYXRhIGlzIGluc2VydGVkIHRvIHRoZSB0cmVlIG1vZGVsXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIG1vZGVsLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgYW4gYXJyYXkgb2Ygbm9kZSBJRHNcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnQgdGhlIHBhcmVudCBJRCBvZiB0aGUgbm9kZXNcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdtb2RlbCcsIHsgXCJub2Rlc1wiIDogZHBjLCAncGFyZW50JyA6IHBhciB9KTtcblx0XHRcdGlmKHBhciAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHR0aGlzLl9ub2RlX2NoYW5nZWQocGFyKTtcblx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5jaGlsZHJlbignLmpzdHJlZS1pbml0aWFsLW5vZGUnKS5yZW1vdmUoKTtcblx0XHRcdFx0dGhpcy5yZWRyYXcodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQubGVuZ3RoICE9PSBzKSB7XG5cdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAnbW9kZWwnLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkIH0pO1xuXHRcdFx0fVxuXHRcdFx0Y2IuY2FsbCh0aGlzLCB0cnVlKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGFwcGVuZHMgSlNPTiBjb250ZW50IHRvIHRoZSB0cmVlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfYXBwZW5kX2pzb25fZGF0YShvYmosIGRhdGEpXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBhcHBlbmQgdG9cblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGRhdGEgdGhlIEpTT04gb2JqZWN0IHRvIHBhcnNlIGFuZCBhcHBlbmRcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBmb3JjZV9wcm9jZXNzaW5nIGludGVybmFsIHBhcmFtIC0gZG8gbm90IHNldFxuXHRcdCAqIEB0cmlnZ2VyIG1vZGVsLmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKi9cblx0XHRfYXBwZW5kX2pzb25fZGF0YSA6IGZ1bmN0aW9uIChkb20sIGRhdGEsIGNiLCBmb3JjZV9wcm9jZXNzaW5nKSB7XG5cdFx0XHRpZih0aGlzLmVsZW1lbnQgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKGRvbSk7XG5cdFx0XHRkb20uY2hpbGRyZW4gPSBbXTtcblx0XHRcdGRvbS5jaGlsZHJlbl9kID0gW107XG5cdFx0XHQvLyAqJSRAISEhXG5cdFx0XHRpZihkYXRhLmQpIHtcblx0XHRcdFx0ZGF0YSA9IGRhdGEuZDtcblx0XHRcdFx0aWYodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoISQuaXNBcnJheShkYXRhKSkgeyBkYXRhID0gW2RhdGFdOyB9XG5cdFx0XHR2YXIgdyA9IG51bGwsXG5cdFx0XHRcdGFyZ3MgPSB7XG5cdFx0XHRcdFx0J2RmJ1x0OiB0aGlzLl9tb2RlbC5kZWZhdWx0X3N0YXRlLFxuXHRcdFx0XHRcdCdkYXQnXHQ6IGRhdGEsXG5cdFx0XHRcdFx0J3BhcidcdDogZG9tLmlkLFxuXHRcdFx0XHRcdCdtJ1x0XHQ6IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdFx0J3RfaWQnXHQ6IHRoaXMuX2lkLFxuXHRcdFx0XHRcdCd0X2NudCdcdDogdGhpcy5fY250LFxuXHRcdFx0XHRcdCdzZWwnXHQ6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpbnN0ID0gdGhpcyxcblx0XHRcdFx0ZnVuYyA9IGZ1bmN0aW9uIChkYXRhLCB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRpZihkYXRhLmRhdGEpIHsgZGF0YSA9IGRhdGEuZGF0YTsgfVxuXHRcdFx0XHRcdHZhciBkYXQgPSBkYXRhLmRhdCxcblx0XHRcdFx0XHRcdHBhciA9IGRhdGEucGFyLFxuXHRcdFx0XHRcdFx0Y2hkID0gW10sXG5cdFx0XHRcdFx0XHRkcGMgPSBbXSxcblx0XHRcdFx0XHRcdGFkZCA9IFtdLFxuXHRcdFx0XHRcdFx0ZGYgPSBkYXRhLmRmLFxuXHRcdFx0XHRcdFx0dF9pZCA9IGRhdGEudF9pZCxcblx0XHRcdFx0XHRcdHRfY250ID0gZGF0YS50X2NudCxcblx0XHRcdFx0XHRcdG0gPSBkYXRhLm0sXG5cdFx0XHRcdFx0XHRwID0gbVtwYXJdLFxuXHRcdFx0XHRcdFx0c2VsID0gZGF0YS5zZWwsXG5cdFx0XHRcdFx0XHR0bXAsIGksIGosIHJzbHQsXG5cdFx0XHRcdFx0XHRwYXJzZV9mbGF0ID0gZnVuY3Rpb24gKGQsIHAsIHBzKSB7XG5cdFx0XHRcdFx0XHRcdGlmKCFwcykgeyBwcyA9IFtdOyB9XG5cdFx0XHRcdFx0XHRcdGVsc2UgeyBwcyA9IHBzLmNvbmNhdCgpOyB9XG5cdFx0XHRcdFx0XHRcdGlmKHApIHsgcHMudW5zaGlmdChwKTsgfVxuXHRcdFx0XHRcdFx0XHR2YXIgdGlkID0gZC5pZC50b1N0cmluZygpLFxuXHRcdFx0XHRcdFx0XHRcdGksIGosIGMsIGUsXG5cdFx0XHRcdFx0XHRcdFx0dG1wID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWRcdFx0XHQ6IHRpZCxcblx0XHRcdFx0XHRcdFx0XHRcdHRleHRcdFx0OiBkLnRleHQgfHwgJycsXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uXHRcdDogZC5pY29uICE9PSB1bmRlZmluZWQgPyBkLmljb24gOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyZW50XHRcdDogcCxcblx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudHNcdFx0OiBwcyxcblx0XHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuXHQ6IGQuY2hpbGRyZW4gfHwgW10sXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9kXHQ6IGQuY2hpbGRyZW5fZCB8fCBbXSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFcdFx0OiBkLmRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZVx0XHQ6IHsgfSxcblx0XHRcdFx0XHRcdFx0XHRcdGxpX2F0dHJcdFx0OiB7IGlkIDogZmFsc2UgfSxcblx0XHRcdFx0XHRcdFx0XHRcdGFfYXR0clx0XHQ6IHsgaHJlZiA6ICcjJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxcdDogZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRmb3IoaSBpbiBkZikge1xuXHRcdFx0XHRcdFx0XHRcdGlmKGRmLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkZltpXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmRhdGEgJiYgZC5kYXRhLmpzdHJlZSAmJiBkLmRhdGEuanN0cmVlLmljb24pIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuaWNvbiA9IGQuZGF0YS5qc3RyZWUuaWNvbjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZih0bXAuaWNvbiA9PT0gdW5kZWZpbmVkIHx8IHRtcC5pY29uID09PSBudWxsIHx8IHRtcC5pY29uID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmljb24gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5kYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmRhdGEgPSBkLmRhdGE7XG5cdFx0XHRcdFx0XHRcdFx0aWYoZC5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgaW4gZC5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihkLmRhdGEuanN0cmVlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZC5kYXRhLmpzdHJlZVtpXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIHR5cGVvZiBkLnN0YXRlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAoaSBpbiBkLnN0YXRlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkLnN0YXRlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGQuc3RhdGVbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgdHlwZW9mIGQubGlfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgaW4gZC5saV9hdHRyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkLmxpX2F0dHIuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmxpX2F0dHJbaV0gPSBkLmxpX2F0dHJbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKCF0bXAubGlfYXR0ci5pZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5saV9hdHRyLmlkID0gdGlkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgdHlwZW9mIGQuYV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAoaSBpbiBkLmFfYXR0cikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoZC5hX2F0dHIuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmFfYXR0cltpXSA9IGQuYV9hdHRyW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuY2hpbGRyZW4gJiYgZC5jaGlsZHJlbiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZS5sb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IFtdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdG1bdG1wLmlkXSA9IHRtcDtcblx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGMgPSBwYXJzZV9mbGF0KG1bdG1wLmNoaWxkcmVuW2ldXSwgdG1wLmlkLCBwcyk7XG5cdFx0XHRcdFx0XHRcdFx0ZSA9IG1bY107XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuX2QucHVzaChjKTtcblx0XHRcdFx0XHRcdFx0XHRpZihlLmNoaWxkcmVuX2QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IHRtcC5jaGlsZHJlbl9kLmNvbmNhdChlLmNoaWxkcmVuX2QpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkZWxldGUgZC5kYXRhO1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgZC5jaGlsZHJlbjtcblx0XHRcdFx0XHRcdFx0bVt0bXAuaWRdLm9yaWdpbmFsID0gZDtcblx0XHRcdFx0XHRcdFx0aWYodG1wLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0YWRkLnB1c2godG1wLmlkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdG1wLmlkO1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHBhcnNlX25lc3QgPSBmdW5jdGlvbiAoZCwgcCwgcHMpIHtcblx0XHRcdFx0XHRcdFx0aWYoIXBzKSB7IHBzID0gW107IH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7IHBzID0gcHMuY29uY2F0KCk7IH1cblx0XHRcdFx0XHRcdFx0aWYocCkgeyBwcy51bnNoaWZ0KHApOyB9XG5cdFx0XHRcdFx0XHRcdHZhciB0aWQgPSBmYWxzZSwgaSwgaiwgYywgZSwgdG1wO1xuXHRcdFx0XHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0XHRcdFx0dGlkID0gJ2onICsgdF9pZCArICdfJyArICgrK3RfY250KTtcblx0XHRcdFx0XHRcdFx0fSB3aGlsZShtW3RpZF0pO1xuXG5cdFx0XHRcdFx0XHRcdHRtcCA9IHtcblx0XHRcdFx0XHRcdFx0XHRpZFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0dGV4dFx0XHQ6IHR5cGVvZiBkID09PSAnc3RyaW5nJyA/IGQgOiAnJyxcblx0XHRcdFx0XHRcdFx0XHRpY29uXHRcdDogdHlwZW9mIGQgPT09ICdvYmplY3QnICYmIGQuaWNvbiAhPT0gdW5kZWZpbmVkID8gZC5pY29uIDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnRcdFx0OiBwLFxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudHNcdFx0OiBwcyxcblx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlblx0OiBbXSxcblx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlbl9kXHQ6IFtdLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGFcdFx0OiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdHN0YXRlXHRcdDogeyB9LFxuXHRcdFx0XHRcdFx0XHRcdGxpX2F0dHJcdFx0OiB7IGlkIDogZmFsc2UgfSxcblx0XHRcdFx0XHRcdFx0XHRhX2F0dHJcdFx0OiB7IGhyZWYgOiAnIycgfSxcblx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbFx0OiBmYWxzZVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRmb3IoaSBpbiBkZikge1xuXHRcdFx0XHRcdFx0XHRcdGlmKGRmLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkZltpXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmlkKSB7IHRtcC5pZCA9IGQuaWQudG9TdHJpbmcoKTsgfVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQudGV4dCkgeyB0bXAudGV4dCA9IGQudGV4dDsgfVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuZGF0YSAmJiBkLmRhdGEuanN0cmVlICYmIGQuZGF0YS5qc3RyZWUuaWNvbikge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5pY29uID0gZC5kYXRhLmpzdHJlZS5pY29uO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKHRtcC5pY29uID09PSB1bmRlZmluZWQgfHwgdG1wLmljb24gPT09IG51bGwgfHwgdG1wLmljb24gPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuaWNvbiA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuZGF0YSA9IGQuZGF0YTtcblx0XHRcdFx0XHRcdFx0XHRpZihkLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSBpbiBkLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGQuZGF0YS5qc3RyZWUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkLmRhdGEuanN0cmVlW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgdHlwZW9mIGQuc3RhdGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChpIGluIGQuc3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGQuc3RhdGUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZC5zdGF0ZVtpXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5saV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAoaSBpbiBkLmxpX2F0dHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGQubGlfYXR0ci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAubGlfYXR0cltpXSA9IGQubGlfYXR0cltpXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYodG1wLmxpX2F0dHIuaWQgJiYgIXRtcC5pZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5pZCA9IHRtcC5saV9hdHRyLmlkLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoIXRtcC5pZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5pZCA9IHRpZDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZighdG1wLmxpX2F0dHIuaWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAubGlfYXR0ci5pZCA9IHRtcC5pZDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIHR5cGVvZiBkLmFfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgaW4gZC5hX2F0dHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGQuYV9hdHRyLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5hX2F0dHJbaV0gPSBkLmFfYXR0cltpXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmNoaWxkcmVuICYmIGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGMgPSBwYXJzZV9uZXN0KGQuY2hpbGRyZW5baV0sIHRtcC5pZCwgcHMpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZSA9IG1bY107XG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW4ucHVzaChjKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGUuY2hpbGRyZW5fZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSB0bXAuY2hpbGRyZW5fZC5jb25jYXQoZS5jaGlsZHJlbl9kKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSB0bXAuY2hpbGRyZW5fZC5jb25jYXQodG1wLmNoaWxkcmVuKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuY2hpbGRyZW4gJiYgZC5jaGlsZHJlbiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZS5sb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IFtdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBkLmRhdGE7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBkLmNoaWxkcmVuO1xuXHRcdFx0XHRcdFx0XHR0bXAub3JpZ2luYWwgPSBkO1xuXHRcdFx0XHRcdFx0XHRtW3RtcC5pZF0gPSB0bXA7XG5cdFx0XHRcdFx0XHRcdGlmKHRtcC5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHRcdFx0XHRcdGFkZC5wdXNoKHRtcC5pZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRtcC5pZDtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRpZihkYXQubGVuZ3RoICYmIGRhdFswXS5pZCAhPT0gdW5kZWZpbmVkICYmIGRhdFswXS5wYXJlbnQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0Ly8gRmxhdCBKU09OIHN1cHBvcnQgKGZvciBlYXN5IGltcG9ydCBmcm9tIERCKTpcblx0XHRcdFx0XHRcdC8vIDEpIGNvbnZlcnQgdG8gb2JqZWN0IChmb3JlYWNoKVxuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZGF0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRpZighZGF0W2ldLmNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0W2ldLmNoaWxkcmVuID0gW107XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoIWRhdFtpXS5zdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdGRhdFtpXS5zdGF0ZSA9IHt9O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdG1bZGF0W2ldLmlkLnRvU3RyaW5nKCldID0gZGF0W2ldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly8gMikgcG9wdWxhdGUgY2hpbGRyZW4gKGZvcmVhY2gpXG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkYXQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghbVtkYXRbaV0ucGFyZW50LnRvU3RyaW5nKCldKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBpbnN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpbnN0Ll9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdwYXJzZScsICdwbHVnaW4nIDogJ2NvcmUnLCAnaWQnIDogJ2NvcmVfMDcnLCAncmVhc29uJyA6ICdOb2RlIHdpdGggaW52YWxpZCBwYXJlbnQnLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdpZCcgOiBkYXRbaV0uaWQudG9TdHJpbmcoKSwgJ3BhcmVudCcgOiBkYXRbaV0ucGFyZW50LnRvU3RyaW5nKCkgfSkgfTtcblx0XHRcdFx0XHRcdFx0XHRcdGluc3Quc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKGluc3QsIGluc3QuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRtW2RhdFtpXS5wYXJlbnQudG9TdHJpbmcoKV0uY2hpbGRyZW4ucHVzaChkYXRbaV0uaWQudG9TdHJpbmcoKSk7XG5cdFx0XHRcdFx0XHRcdC8vIHBvcHVsYXRlIHBhcmVudC5jaGlsZHJlbl9kXG5cdFx0XHRcdFx0XHRcdHAuY2hpbGRyZW5fZC5wdXNoKGRhdFtpXS5pZC50b1N0cmluZygpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vIDMpIG5vcm1hbGl6ZSAmJiBwb3B1bGF0ZSBwYXJlbnRzIGFuZCBjaGlsZHJlbl9kIHdpdGggcmVjdXJzaW9uXG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHR0bXAgPSBwYXJzZV9mbGF0KG1bcC5jaGlsZHJlbltpXV0sIHBhciwgcC5wYXJlbnRzLmNvbmNhdCgpKTtcblx0XHRcdFx0XHRcdFx0ZHBjLnB1c2godG1wKTtcblx0XHRcdFx0XHRcdFx0aWYobVt0bXBdLmNoaWxkcmVuX2QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZHBjID0gZHBjLmNvbmNhdChtW3RtcF0uY2hpbGRyZW5fZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHAucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0bVtwLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QgPSBtW3AucGFyZW50c1tpXV0uY2hpbGRyZW5fZC5jb25jYXQoZHBjKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vID8pIHRocmVlX3N0YXRlIHNlbGVjdGlvbiAtIHAuc3RhdGUuc2VsZWN0ZWQgJiYgdCAtIChpZiB0aHJlZV9zdGF0ZSBmb3JlYWNoKGRhdCA9PiBjaCkgLT4gZm9yZWFjaChwYXJlbnRzKSBpZihwYXJlbnQuc2VsZWN0ZWQpIGNoaWxkLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHJzbHQgPSB7XG5cdFx0XHRcdFx0XHRcdCdjbnQnIDogdF9jbnQsXG5cdFx0XHRcdFx0XHRcdCdtb2QnIDogbSxcblx0XHRcdFx0XHRcdFx0J3NlbCcgOiBzZWwsXG5cdFx0XHRcdFx0XHRcdCdwYXInIDogcGFyLFxuXHRcdFx0XHRcdFx0XHQnZHBjJyA6IGRwYyxcblx0XHRcdFx0XHRcdFx0J2FkZCcgOiBhZGRcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZGF0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHR0bXAgPSBwYXJzZV9uZXN0KGRhdFtpXSwgcGFyLCBwLnBhcmVudHMuY29uY2F0KCkpO1xuXHRcdFx0XHRcdFx0XHRpZih0bXApIHtcblx0XHRcdFx0XHRcdFx0XHRjaGQucHVzaCh0bXApO1xuXHRcdFx0XHRcdFx0XHRcdGRwYy5wdXNoKHRtcCk7XG5cdFx0XHRcdFx0XHRcdFx0aWYobVt0bXBdLmNoaWxkcmVuX2QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkcGMgPSBkcGMuY29uY2F0KG1bdG1wXS5jaGlsZHJlbl9kKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHAuY2hpbGRyZW4gPSBjaGQ7XG5cdFx0XHRcdFx0XHRwLmNoaWxkcmVuX2QgPSBkcGM7XG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdG1bcC5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kID0gbVtwLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QuY29uY2F0KGRwYyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyc2x0ID0ge1xuXHRcdFx0XHRcdFx0XHQnY250JyA6IHRfY250LFxuXHRcdFx0XHRcdFx0XHQnbW9kJyA6IG0sXG5cdFx0XHRcdFx0XHRcdCdzZWwnIDogc2VsLFxuXHRcdFx0XHRcdFx0XHQncGFyJyA6IHBhcixcblx0XHRcdFx0XHRcdFx0J2RwYycgOiBkcGMsXG5cdFx0XHRcdFx0XHRcdCdhZGQnIDogYWRkXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93LmRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0cG9zdE1lc3NhZ2UocnNsdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJzbHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRyc2x0ID0gZnVuY3Rpb24gKHJzbHQsIHdvcmtlcikge1xuXHRcdFx0XHRcdGlmKHRoaXMuZWxlbWVudCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblx0XHRcdFx0XHR0aGlzLl9jbnQgPSByc2x0LmNudDtcblx0XHRcdFx0XHR2YXIgaSwgbSA9IHRoaXMuX21vZGVsLmRhdGE7XG5cdFx0XHRcdFx0Zm9yIChpIGluIG0pIHtcblx0XHRcdFx0XHRcdGlmIChtLmhhc093blByb3BlcnR5KGkpICYmIG1baV0uc3RhdGUgJiYgbVtpXS5zdGF0ZS5sb2FkaW5nICYmIHJzbHQubW9kW2ldKSB7XG5cdFx0XHRcdFx0XHRcdHJzbHQubW9kW2ldLnN0YXRlLmxvYWRpbmcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhID0gcnNsdC5tb2Q7IC8vIGJyZWFrcyB0aGUgcmVmZXJlbmNlIGluIGxvYWRfbm9kZSAtIGNhcmVmdWxcblxuXHRcdFx0XHRcdGlmKHdvcmtlcikge1xuXHRcdFx0XHRcdFx0dmFyIGosIGEgPSByc2x0LmFkZCwgciA9IHJzbHQuc2VsLCBzID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLnNsaWNlKCk7XG5cdFx0XHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YTtcblx0XHRcdFx0XHRcdC8vIGlmIHNlbGVjdGlvbiB3YXMgY2hhbmdlZCB3aGlsZSBjYWxjdWxhdGluZyBpbiB3b3JrZXJcblx0XHRcdFx0XHRcdGlmKHIubGVuZ3RoICE9PSBzLmxlbmd0aCB8fCAkLnZha2F0YS5hcnJheV91bmlxdWUoci5jb25jYXQocykpLmxlbmd0aCAhPT0gci5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0Ly8gZGVzZWxlY3Qgbm9kZXMgdGhhdCBhcmUgbm8gbG9uZ2VyIHNlbGVjdGVkXG5cdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHIubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYoJC5pbkFycmF5KHJbaV0sIGEpID09PSAtMSAmJiAkLmluQXJyYXkocltpXSwgcykgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRtW3JbaV1dLnN0YXRlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC8vIHNlbGVjdCBub2RlcyB0aGF0IHdlcmUgc2VsZWN0ZWQgaW4gdGhlIG1lYW4gdGltZVxuXHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGlmKCQuaW5BcnJheShzW2ldLCByKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG1bc1tpXV0uc3RhdGUuc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihyc2x0LmFkZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5jb25jYXQocnNsdC5hZGQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcignbW9kZWwnLCB7IFwibm9kZXNcIiA6IHJzbHQuZHBjLCAncGFyZW50JyA6IHJzbHQucGFyIH0pO1xuXG5cdFx0XHRcdFx0aWYocnNsdC5wYXIgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdHRoaXMuX25vZGVfY2hhbmdlZChyc2x0LnBhcik7XG5cdFx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdC8vIHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmNoaWxkcmVuKCcuanN0cmVlLWluaXRpYWwtbm9kZScpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0dGhpcy5yZWRyYXcodHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHJzbHQuYWRkLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdtb2RlbCcsICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNiLmNhbGwodGhpcywgdHJ1ZSk7XG5cdFx0XHRcdH07XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNvcmUud29ya2VyICYmIHdpbmRvdy5CbG9iICYmIHdpbmRvdy5VUkwgJiYgd2luZG93Lldvcmtlcikge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGlmKHRoaXMuX3dyayA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fd3JrID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoXG5cdFx0XHRcdFx0XHRcdG5ldyB3aW5kb3cuQmxvYihcblx0XHRcdFx0XHRcdFx0XHRbJ3NlbGYub25tZXNzYWdlID0gJyArIGZ1bmMudG9TdHJpbmcoKV0sXG5cdFx0XHRcdFx0XHRcdFx0e3R5cGU6XCJ0ZXh0L2phdmFzY3JpcHRcIn1cblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoIXRoaXMuX2RhdGEuY29yZS53b3JraW5nIHx8IGZvcmNlX3Byb2Nlc3NpbmcpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS53b3JraW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHcgPSBuZXcgd2luZG93Lldvcmtlcih0aGlzLl93cmspO1xuXHRcdFx0XHRcdFx0dy5vbm1lc3NhZ2UgPSAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHJzbHQuY2FsbCh0aGlzLCBlLmRhdGEsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHR0cnkgeyB3LnRlcm1pbmF0ZSgpOyB3ID0gbnVsbDsgfSBjYXRjaChpZ25vcmUpIHsgfVxuXHRcdFx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUud29ya2VyX3F1ZXVlLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2FwcGVuZF9qc29uX2RhdGEuYXBwbHkodGhpcywgdGhpcy5fZGF0YS5jb3JlLndvcmtlcl9xdWV1ZS5zaGlmdCgpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUud29ya2luZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCB0aGlzKTtcblx0XHRcdFx0XHRcdGlmKCFhcmdzLnBhcikge1xuXHRcdFx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUud29ya2VyX3F1ZXVlLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2FwcGVuZF9qc29uX2RhdGEuYXBwbHkodGhpcywgdGhpcy5fZGF0YS5jb3JlLndvcmtlcl9xdWV1ZS5zaGlmdCgpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUud29ya2luZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dy5wb3N0TWVzc2FnZShhcmdzKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUud29ya2VyX3F1ZXVlLnB1c2goW2RvbSwgZGF0YSwgY2IsIHRydWVdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2goZSkge1xuXHRcdFx0XHRcdHJzbHQuY2FsbCh0aGlzLCBmdW5jKGFyZ3MpLCBmYWxzZSk7XG5cdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLndvcmtlcl9xdWV1ZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2FwcGVuZF9qc29uX2RhdGEuYXBwbHkodGhpcywgdGhpcy5fZGF0YS5jb3JlLndvcmtlcl9xdWV1ZS5zaGlmdCgpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUud29ya2luZyA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJzbHQuY2FsbCh0aGlzLCBmdW5jKGFyZ3MpLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBwYXJzZXMgYSBub2RlIGZyb20gYSBqUXVlcnkgb2JqZWN0IGFuZCBhcHBlbmRzIHRoZW0gdG8gdGhlIGluIG1lbW9yeSB0cmVlIG1vZGVsLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfcGFyc2VfbW9kZWxfZnJvbV9odG1sKGQgWywgcCwgcHNdKVxuXHRcdCAqIEBwYXJhbSAge2pRdWVyeX0gZCB0aGUgalF1ZXJ5IG9iamVjdCB0byBwYXJzZVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gcCB0aGUgcGFyZW50IElEXG5cdFx0ICogQHBhcmFtICB7QXJyYXl9IHBzIGxpc3Qgb2YgYWxsIHBhcmVudHNcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBJRCBvZiB0aGUgb2JqZWN0IGFkZGVkIHRvIHRoZSBtb2RlbFxuXHRcdCAqL1xuXHRcdF9wYXJzZV9tb2RlbF9mcm9tX2h0bWwgOiBmdW5jdGlvbiAoZCwgcCwgcHMpIHtcblx0XHRcdGlmKCFwcykgeyBwcyA9IFtdOyB9XG5cdFx0XHRlbHNlIHsgcHMgPSBbXS5jb25jYXQocHMpOyB9XG5cdFx0XHRpZihwKSB7IHBzLnVuc2hpZnQocCk7IH1cblx0XHRcdHZhciBjLCBlLCBtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0ZGF0YSA9IHtcblx0XHRcdFx0XHRpZFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdFx0dGV4dFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdGljb25cdFx0OiB0cnVlLFxuXHRcdFx0XHRcdHBhcmVudFx0XHQ6IHAsXG5cdFx0XHRcdFx0cGFyZW50c1x0XHQ6IHBzLFxuXHRcdFx0XHRcdGNoaWxkcmVuXHQ6IFtdLFxuXHRcdFx0XHRcdGNoaWxkcmVuX2RcdDogW10sXG5cdFx0XHRcdFx0ZGF0YVx0XHQ6IG51bGwsXG5cdFx0XHRcdFx0c3RhdGVcdFx0OiB7IH0sXG5cdFx0XHRcdFx0bGlfYXR0clx0XHQ6IHsgaWQgOiBmYWxzZSB9LFxuXHRcdFx0XHRcdGFfYXR0clx0XHQ6IHsgaHJlZiA6ICcjJyB9LFxuXHRcdFx0XHRcdG9yaWdpbmFsXHQ6IGZhbHNlXG5cdFx0XHRcdH0sIGksIHRtcCwgdGlkO1xuXHRcdFx0Zm9yKGkgaW4gdGhpcy5fbW9kZWwuZGVmYXVsdF9zdGF0ZSkge1xuXHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kZWZhdWx0X3N0YXRlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0ZGF0YS5zdGF0ZVtpXSA9IHRoaXMuX21vZGVsLmRlZmF1bHRfc3RhdGVbaV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRtcCA9ICQudmFrYXRhLmF0dHJpYnV0ZXMoZCwgdHJ1ZSk7XG5cdFx0XHQkLmVhY2godG1wLCBmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHR2ID0gJC50cmltKHYpO1xuXHRcdFx0XHRpZighdi5sZW5ndGgpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdFx0ZGF0YS5saV9hdHRyW2ldID0gdjtcblx0XHRcdFx0aWYoaSA9PT0gJ2lkJykge1xuXHRcdFx0XHRcdGRhdGEuaWQgPSB2LnRvU3RyaW5nKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0dG1wID0gZC5jaGlsZHJlbignYScpLmZpcnN0KCk7XG5cdFx0XHRpZih0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdHRtcCA9ICQudmFrYXRhLmF0dHJpYnV0ZXModG1wLCB0cnVlKTtcblx0XHRcdFx0JC5lYWNoKHRtcCwgZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHR2ID0gJC50cmltKHYpO1xuXHRcdFx0XHRcdGlmKHYubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRkYXRhLmFfYXR0cltpXSA9IHY7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHRtcCA9IGQuY2hpbGRyZW4oXCJhXCIpLmZpcnN0KCkubGVuZ3RoID8gZC5jaGlsZHJlbihcImFcIikuZmlyc3QoKS5jbG9uZSgpIDogZC5jbG9uZSgpO1xuXHRcdFx0dG1wLmNoaWxkcmVuKFwiaW5zLCBpLCB1bFwiKS5yZW1vdmUoKTtcblx0XHRcdHRtcCA9IHRtcC5odG1sKCk7XG5cdFx0XHR0bXAgPSAkKCc8ZGl2IC8+JykuaHRtbCh0bXApO1xuXHRcdFx0ZGF0YS50ZXh0ID0gdGhpcy5zZXR0aW5ncy5jb3JlLmZvcmNlX3RleHQgPyB0bXAudGV4dCgpIDogdG1wLmh0bWwoKTtcblx0XHRcdHRtcCA9IGQuZGF0YSgpO1xuXHRcdFx0ZGF0YS5kYXRhID0gdG1wID8gJC5leHRlbmQodHJ1ZSwge30sIHRtcCkgOiBudWxsO1xuXHRcdFx0ZGF0YS5zdGF0ZS5vcGVuZWQgPSBkLmhhc0NsYXNzKCdqc3RyZWUtb3BlbicpO1xuXHRcdFx0ZGF0YS5zdGF0ZS5zZWxlY3RlZCA9IGQuY2hpbGRyZW4oJ2EnKS5oYXNDbGFzcygnanN0cmVlLWNsaWNrZWQnKTtcblx0XHRcdGRhdGEuc3RhdGUuZGlzYWJsZWQgPSBkLmNoaWxkcmVuKCdhJykuaGFzQ2xhc3MoJ2pzdHJlZS1kaXNhYmxlZCcpO1xuXHRcdFx0aWYoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0Zm9yKGkgaW4gZGF0YS5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdGlmKGRhdGEuZGF0YS5qc3RyZWUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdGRhdGEuc3RhdGVbaV0gPSBkYXRhLmRhdGEuanN0cmVlW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dG1wID0gZC5jaGlsZHJlbihcImFcIikuY2hpbGRyZW4oXCIuanN0cmVlLXRoZW1laWNvblwiKTtcblx0XHRcdGlmKHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0ZGF0YS5pY29uID0gdG1wLmhhc0NsYXNzKCdqc3RyZWUtdGhlbWVpY29uLWhpZGRlbicpID8gZmFsc2UgOiB0bXAuYXR0cigncmVsJyk7XG5cdFx0XHR9XG5cdFx0XHRpZihkYXRhLnN0YXRlLmljb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRkYXRhLmljb24gPSBkYXRhLnN0YXRlLmljb247XG5cdFx0XHR9XG5cdFx0XHRpZihkYXRhLmljb24gPT09IHVuZGVmaW5lZCB8fCBkYXRhLmljb24gPT09IG51bGwgfHwgZGF0YS5pY29uID09PSBcIlwiKSB7XG5cdFx0XHRcdGRhdGEuaWNvbiA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBkLmNoaWxkcmVuKFwidWxcIikuY2hpbGRyZW4oXCJsaVwiKTtcblx0XHRcdGRvIHtcblx0XHRcdFx0dGlkID0gJ2onICsgdGhpcy5faWQgKyAnXycgKyAoKyt0aGlzLl9jbnQpO1xuXHRcdFx0fSB3aGlsZShtW3RpZF0pO1xuXHRcdFx0ZGF0YS5pZCA9IGRhdGEubGlfYXR0ci5pZCA/IGRhdGEubGlfYXR0ci5pZC50b1N0cmluZygpIDogdGlkO1xuXHRcdFx0aWYodG1wLmxlbmd0aCkge1xuXHRcdFx0XHR0bXAuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0YyA9IHRoaXMuX3BhcnNlX21vZGVsX2Zyb21faHRtbCgkKHYpLCBkYXRhLmlkLCBwcyk7XG5cdFx0XHRcdFx0ZSA9IHRoaXMuX21vZGVsLmRhdGFbY107XG5cdFx0XHRcdFx0ZGF0YS5jaGlsZHJlbi5wdXNoKGMpO1xuXHRcdFx0XHRcdGlmKGUuY2hpbGRyZW5fZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGRhdGEuY2hpbGRyZW5fZCA9IGRhdGEuY2hpbGRyZW5fZC5jb25jYXQoZS5jaGlsZHJlbl9kKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0ZGF0YS5jaGlsZHJlbl9kID0gZGF0YS5jaGlsZHJlbl9kLmNvbmNhdChkYXRhLmNoaWxkcmVuKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZihkLmhhc0NsYXNzKCdqc3RyZWUtY2xvc2VkJykpIHtcblx0XHRcdFx0XHRkYXRhLnN0YXRlLmxvYWRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihkYXRhLmxpX2F0dHJbJ2NsYXNzJ10pIHtcblx0XHRcdFx0ZGF0YS5saV9hdHRyWydjbGFzcyddID0gZGF0YS5saV9hdHRyWydjbGFzcyddLnJlcGxhY2UoJ2pzdHJlZS1jbG9zZWQnLCcnKS5yZXBsYWNlKCdqc3RyZWUtb3BlbicsJycpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZGF0YS5hX2F0dHJbJ2NsYXNzJ10pIHtcblx0XHRcdFx0ZGF0YS5hX2F0dHJbJ2NsYXNzJ10gPSBkYXRhLmFfYXR0clsnY2xhc3MnXS5yZXBsYWNlKCdqc3RyZWUtY2xpY2tlZCcsJycpLnJlcGxhY2UoJ2pzdHJlZS1kaXNhYmxlZCcsJycpO1xuXHRcdFx0fVxuXHRcdFx0bVtkYXRhLmlkXSA9IGRhdGE7XG5cdFx0XHRpZihkYXRhLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5wdXNoKGRhdGEuaWQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRhdGEuaWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBwYXJzZXMgYSBub2RlIGZyb20gYSBKU09OIG9iamVjdCAodXNlZCB3aGVuIGRlYWxpbmcgd2l0aCBmbGF0IGRhdGEsIHdoaWNoIGhhcyBubyBuZXN0aW5nIG9mIGNoaWxkcmVuLCBidXQgaGFzIGlkIGFuZCBwYXJlbnQgcHJvcGVydGllcykgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGluIG1lbW9yeSB0cmVlIG1vZGVsLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfcGFyc2VfbW9kZWxfZnJvbV9mbGF0X2pzb24oZCBbLCBwLCBwc10pXG5cdFx0ICogQHBhcmFtICB7T2JqZWN0fSBkIHRoZSBKU09OIG9iamVjdCB0byBwYXJzZVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gcCB0aGUgcGFyZW50IElEXG5cdFx0ICogQHBhcmFtICB7QXJyYXl9IHBzIGxpc3Qgb2YgYWxsIHBhcmVudHNcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBJRCBvZiB0aGUgb2JqZWN0IGFkZGVkIHRvIHRoZSBtb2RlbFxuXHRcdCAqL1xuXHRcdF9wYXJzZV9tb2RlbF9mcm9tX2ZsYXRfanNvbiA6IGZ1bmN0aW9uIChkLCBwLCBwcykge1xuXHRcdFx0aWYoIXBzKSB7IHBzID0gW107IH1cblx0XHRcdGVsc2UgeyBwcyA9IHBzLmNvbmNhdCgpOyB9XG5cdFx0XHRpZihwKSB7IHBzLnVuc2hpZnQocCk7IH1cblx0XHRcdHZhciB0aWQgPSBkLmlkLnRvU3RyaW5nKCksXG5cdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRkZiA9IHRoaXMuX21vZGVsLmRlZmF1bHRfc3RhdGUsXG5cdFx0XHRcdGksIGosIGMsIGUsXG5cdFx0XHRcdHRtcCA9IHtcblx0XHRcdFx0XHRpZFx0XHRcdDogdGlkLFxuXHRcdFx0XHRcdHRleHRcdFx0OiBkLnRleHQgfHwgJycsXG5cdFx0XHRcdFx0aWNvblx0XHQ6IGQuaWNvbiAhPT0gdW5kZWZpbmVkID8gZC5pY29uIDogdHJ1ZSxcblx0XHRcdFx0XHRwYXJlbnRcdFx0OiBwLFxuXHRcdFx0XHRcdHBhcmVudHNcdFx0OiBwcyxcblx0XHRcdFx0XHRjaGlsZHJlblx0OiBkLmNoaWxkcmVuIHx8IFtdLFxuXHRcdFx0XHRcdGNoaWxkcmVuX2RcdDogZC5jaGlsZHJlbl9kIHx8IFtdLFxuXHRcdFx0XHRcdGRhdGFcdFx0OiBkLmRhdGEsXG5cdFx0XHRcdFx0c3RhdGVcdFx0OiB7IH0sXG5cdFx0XHRcdFx0bGlfYXR0clx0XHQ6IHsgaWQgOiBmYWxzZSB9LFxuXHRcdFx0XHRcdGFfYXR0clx0XHQ6IHsgaHJlZiA6ICcjJyB9LFxuXHRcdFx0XHRcdG9yaWdpbmFsXHQ6IGZhbHNlXG5cdFx0XHRcdH07XG5cdFx0XHRmb3IoaSBpbiBkZikge1xuXHRcdFx0XHRpZihkZi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGRmW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIGQuZGF0YSAmJiBkLmRhdGEuanN0cmVlICYmIGQuZGF0YS5qc3RyZWUuaWNvbikge1xuXHRcdFx0XHR0bXAuaWNvbiA9IGQuZGF0YS5qc3RyZWUuaWNvbjtcblx0XHRcdH1cblx0XHRcdGlmKHRtcC5pY29uID09PSB1bmRlZmluZWQgfHwgdG1wLmljb24gPT09IG51bGwgfHwgdG1wLmljb24gPT09IFwiXCIpIHtcblx0XHRcdFx0dG1wLmljb24gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiBkLmRhdGEpIHtcblx0XHRcdFx0dG1wLmRhdGEgPSBkLmRhdGE7XG5cdFx0XHRcdGlmKGQuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRmb3IoaSBpbiBkLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0XHRpZihkLmRhdGEuanN0cmVlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGQuZGF0YS5qc3RyZWVbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIHR5cGVvZiBkLnN0YXRlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGkgaW4gZC5zdGF0ZSkge1xuXHRcdFx0XHRcdGlmKGQuc3RhdGUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGQuc3RhdGVbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIHR5cGVvZiBkLmxpX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoaSBpbiBkLmxpX2F0dHIpIHtcblx0XHRcdFx0XHRpZihkLmxpX2F0dHIuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdHRtcC5saV9hdHRyW2ldID0gZC5saV9hdHRyW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoIXRtcC5saV9hdHRyLmlkKSB7XG5cdFx0XHRcdHRtcC5saV9hdHRyLmlkID0gdGlkO1xuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5hX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoaSBpbiBkLmFfYXR0cikge1xuXHRcdFx0XHRcdGlmKGQuYV9hdHRyLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHR0bXAuYV9hdHRyW2ldID0gZC5hX2F0dHJbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIGQuY2hpbGRyZW4gJiYgZC5jaGlsZHJlbiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHR0bXAuc3RhdGUubG9hZGVkID0gZmFsc2U7XG5cdFx0XHRcdHRtcC5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0bVt0bXAuaWRdID0gdG1wO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRjID0gdGhpcy5fcGFyc2VfbW9kZWxfZnJvbV9mbGF0X2pzb24obVt0bXAuY2hpbGRyZW5baV1dLCB0bXAuaWQsIHBzKTtcblx0XHRcdFx0ZSA9IG1bY107XG5cdFx0XHRcdHRtcC5jaGlsZHJlbl9kLnB1c2goYyk7XG5cdFx0XHRcdGlmKGUuY2hpbGRyZW5fZC5sZW5ndGgpIHtcblx0XHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IHRtcC5jaGlsZHJlbl9kLmNvbmNhdChlLmNoaWxkcmVuX2QpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgZC5kYXRhO1xuXHRcdFx0ZGVsZXRlIGQuY2hpbGRyZW47XG5cdFx0XHRtW3RtcC5pZF0ub3JpZ2luYWwgPSBkO1xuXHRcdFx0aWYodG1wLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5wdXNoKHRtcC5pZCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdG1wLmlkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcGFyc2VzIGEgbm9kZSBmcm9tIGEgSlNPTiBvYmplY3QgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGluIG1lbW9yeSB0cmVlIG1vZGVsLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfcGFyc2VfbW9kZWxfZnJvbV9qc29uKGQgWywgcCwgcHNdKVxuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gZCB0aGUgSlNPTiBvYmplY3QgdG8gcGFyc2Vcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IHAgdGhlIHBhcmVudCBJRFxuXHRcdCAqIEBwYXJhbSAge0FycmF5fSBwcyBsaXN0IG9mIGFsbCBwYXJlbnRzXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSB0aGUgSUQgb2YgdGhlIG9iamVjdCBhZGRlZCB0byB0aGUgbW9kZWxcblx0XHQgKi9cblx0XHRfcGFyc2VfbW9kZWxfZnJvbV9qc29uIDogZnVuY3Rpb24gKGQsIHAsIHBzKSB7XG5cdFx0XHRpZighcHMpIHsgcHMgPSBbXTsgfVxuXHRcdFx0ZWxzZSB7IHBzID0gcHMuY29uY2F0KCk7IH1cblx0XHRcdGlmKHApIHsgcHMudW5zaGlmdChwKTsgfVxuXHRcdFx0dmFyIHRpZCA9IGZhbHNlLCBpLCBqLCBjLCBlLCBtID0gdGhpcy5fbW9kZWwuZGF0YSwgZGYgPSB0aGlzLl9tb2RlbC5kZWZhdWx0X3N0YXRlLCB0bXA7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdHRpZCA9ICdqJyArIHRoaXMuX2lkICsgJ18nICsgKCsrdGhpcy5fY250KTtcblx0XHRcdH0gd2hpbGUobVt0aWRdKTtcblxuXHRcdFx0dG1wID0ge1xuXHRcdFx0XHRpZFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdHRleHRcdFx0OiB0eXBlb2YgZCA9PT0gJ3N0cmluZycgPyBkIDogJycsXG5cdFx0XHRcdGljb25cdFx0OiB0eXBlb2YgZCA9PT0gJ29iamVjdCcgJiYgZC5pY29uICE9PSB1bmRlZmluZWQgPyBkLmljb24gOiB0cnVlLFxuXHRcdFx0XHRwYXJlbnRcdFx0OiBwLFxuXHRcdFx0XHRwYXJlbnRzXHRcdDogcHMsXG5cdFx0XHRcdGNoaWxkcmVuXHQ6IFtdLFxuXHRcdFx0XHRjaGlsZHJlbl9kXHQ6IFtdLFxuXHRcdFx0XHRkYXRhXHRcdDogbnVsbCxcblx0XHRcdFx0c3RhdGVcdFx0OiB7IH0sXG5cdFx0XHRcdGxpX2F0dHJcdFx0OiB7IGlkIDogZmFsc2UgfSxcblx0XHRcdFx0YV9hdHRyXHRcdDogeyBocmVmIDogJyMnIH0sXG5cdFx0XHRcdG9yaWdpbmFsXHQ6IGZhbHNlXG5cdFx0XHR9O1xuXHRcdFx0Zm9yKGkgaW4gZGYpIHtcblx0XHRcdFx0aWYoZGYuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkZltpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiBkLmlkKSB7IHRtcC5pZCA9IGQuaWQudG9TdHJpbmcoKTsgfVxuXHRcdFx0aWYoZCAmJiBkLnRleHQpIHsgdG1wLnRleHQgPSBkLnRleHQ7IH1cblx0XHRcdGlmKGQgJiYgZC5kYXRhICYmIGQuZGF0YS5qc3RyZWUgJiYgZC5kYXRhLmpzdHJlZS5pY29uKSB7XG5cdFx0XHRcdHRtcC5pY29uID0gZC5kYXRhLmpzdHJlZS5pY29uO1xuXHRcdFx0fVxuXHRcdFx0aWYodG1wLmljb24gPT09IHVuZGVmaW5lZCB8fCB0bXAuaWNvbiA9PT0gbnVsbCB8fCB0bXAuaWNvbiA9PT0gXCJcIikge1xuXHRcdFx0XHR0bXAuaWNvbiA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIGQuZGF0YSkge1xuXHRcdFx0XHR0bXAuZGF0YSA9IGQuZGF0YTtcblx0XHRcdFx0aWYoZC5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdGZvcihpIGluIGQuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRcdGlmKGQuZGF0YS5qc3RyZWUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZC5kYXRhLmpzdHJlZVtpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgdHlwZW9mIGQuc3RhdGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoaSBpbiBkLnN0YXRlKSB7XG5cdFx0XHRcdFx0aWYoZC5zdGF0ZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZC5zdGF0ZVtpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgdHlwZW9mIGQubGlfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChpIGluIGQubGlfYXR0cikge1xuXHRcdFx0XHRcdGlmKGQubGlfYXR0ci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0dG1wLmxpX2F0dHJbaV0gPSBkLmxpX2F0dHJbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZih0bXAubGlfYXR0ci5pZCAmJiAhdG1wLmlkKSB7XG5cdFx0XHRcdHRtcC5pZCA9IHRtcC5saV9hdHRyLmlkLnRvU3RyaW5nKCk7XG5cdFx0XHR9XG5cdFx0XHRpZighdG1wLmlkKSB7XG5cdFx0XHRcdHRtcC5pZCA9IHRpZDtcblx0XHRcdH1cblx0XHRcdGlmKCF0bXAubGlfYXR0ci5pZCkge1xuXHRcdFx0XHR0bXAubGlfYXR0ci5pZCA9IHRtcC5pZDtcblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgdHlwZW9mIGQuYV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGkgaW4gZC5hX2F0dHIpIHtcblx0XHRcdFx0XHRpZihkLmFfYXR0ci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0dG1wLmFfYXR0cltpXSA9IGQuYV9hdHRyW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiBkLmNoaWxkcmVuICYmIGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IGQuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0YyA9IHRoaXMuX3BhcnNlX21vZGVsX2Zyb21fanNvbihkLmNoaWxkcmVuW2ldLCB0bXAuaWQsIHBzKTtcblx0XHRcdFx0XHRlID0gbVtjXTtcblx0XHRcdFx0XHR0bXAuY2hpbGRyZW4ucHVzaChjKTtcblx0XHRcdFx0XHRpZihlLmNoaWxkcmVuX2QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IHRtcC5jaGlsZHJlbl9kLmNvbmNhdChlLmNoaWxkcmVuX2QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IHRtcC5jaGlsZHJlbi5jb25jYXQodG1wLmNoaWxkcmVuX2QpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiBkLmNoaWxkcmVuICYmIGQuY2hpbGRyZW4gPT09IHRydWUpIHtcblx0XHRcdFx0dG1wLnN0YXRlLmxvYWRlZCA9IGZhbHNlO1xuXHRcdFx0XHR0bXAuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSBbXTtcblx0XHRcdH1cblx0XHRcdGRlbGV0ZSBkLmRhdGE7XG5cdFx0XHRkZWxldGUgZC5jaGlsZHJlbjtcblx0XHRcdHRtcC5vcmlnaW5hbCA9IGQ7XG5cdFx0XHRtW3RtcC5pZF0gPSB0bXA7XG5cdFx0XHRpZih0bXAuc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLnB1c2godG1wLmlkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0bXAuaWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZWRyYXdzIGFsbCBub2RlcyB0aGF0IG5lZWQgdG8gYmUgcmVkcmF3bi4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX3JlZHJhdygpXG5cdFx0ICogQHRyaWdnZXIgcmVkcmF3LmpzdHJlZVxuXHRcdCAqL1xuXHRcdF9yZWRyYXcgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgbm9kZXMgPSB0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdyA/IHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF0uY2hpbGRyZW4uY29uY2F0KFtdKSA6IHRoaXMuX21vZGVsLmNoYW5nZWQuY29uY2F0KFtdKSxcblx0XHRcdFx0ZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ1VMJyksIHRtcCwgaSwgaiwgZmUgPSB0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZDtcblx0XHRcdGZvcihpID0gMCwgaiA9IG5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHR0bXAgPSB0aGlzLnJlZHJhd19ub2RlKG5vZGVzW2ldLCB0cnVlLCB0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdyk7XG5cdFx0XHRcdGlmKHRtcCAmJiB0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdykge1xuXHRcdFx0XHRcdGYuYXBwZW5kQ2hpbGQodG1wKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcpIHtcblx0XHRcdFx0Zi5jbGFzc05hbWUgPSB0aGlzLmdldF9jb250YWluZXJfdWwoKVswXS5jbGFzc05hbWU7XG5cdFx0XHRcdGYuc2V0QXR0cmlidXRlKCdyb2xlJywnZ3JvdXAnKTtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmVtcHR5KCkuYXBwZW5kKGYpO1xuXHRcdFx0XHQvL3RoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdLmFwcGVuZENoaWxkKGYpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZmUgIT09IG51bGwgJiYgdGhpcy5zZXR0aW5ncy5jb3JlLnJlc3RvcmVfZm9jdXMpIHtcblx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShmZSwgdHJ1ZSk7XG5cdFx0XHRcdGlmKHRtcCAmJiB0bXAubGVuZ3RoICYmIHRtcC5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKVswXSAhPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuXHRcdFx0XHRcdHRtcC5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcgPSBmYWxzZTtcblx0XHRcdHRoaXMuX21vZGVsLmNoYW5nZWQgPSBbXTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIGFmdGVyIG5vZGVzIGFyZSByZWRyYXduXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHJlZHJhdy5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7YXJyYXl9IG5vZGVzIHRoZSByZWRyYXduIG5vZGVzXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcigncmVkcmF3JywgeyBcIm5vZGVzXCIgOiBub2RlcyB9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJlZHJhd3MgYWxsIG5vZGVzIHRoYXQgbmVlZCB0byBiZSByZWRyYXduIG9yIG9wdGlvbmFsbHkgLSB0aGUgd2hvbGUgdHJlZVxuXHRcdCAqIEBuYW1lIHJlZHJhdyhbZnVsbF0pXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBmdWxsIGlmIHNldCB0byBgdHJ1ZWAgYWxsIG5vZGVzIGFyZSByZWRyYXduLlxuXHRcdCAqL1xuXHRcdHJlZHJhdyA6IGZ1bmN0aW9uIChmdWxsKSB7XG5cdFx0XHRpZihmdWxsKSB7XG5cdFx0XHRcdHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdC8vaWYodGhpcy5fbW9kZWwucmVkcmF3X3RpbWVvdXQpIHtcblx0XHRcdC8vXHRjbGVhclRpbWVvdXQodGhpcy5fbW9kZWwucmVkcmF3X3RpbWVvdXQpO1xuXHRcdFx0Ly99XG5cdFx0XHQvL3RoaXMuX21vZGVsLnJlZHJhd190aW1lb3V0ID0gc2V0VGltZW91dCgkLnByb3h5KHRoaXMuX3JlZHJhdywgdGhpcyksMCk7XG5cdFx0XHR0aGlzLl9yZWRyYXcoKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJlZHJhd3MgYSBzaW5nbGUgbm9kZSdzIGNoaWxkcmVuLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBkcmF3X2NoaWxkcmVuKG5vZGUpXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gbm9kZSB0aGUgbm9kZSB3aG9zZSBjaGlsZHJlbiB3aWxsIGJlIHJlZHJhd25cblx0XHQgKi9cblx0XHRkcmF3X2NoaWxkcmVuIDogZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRcdHZhciBvYmogPSB0aGlzLmdldF9ub2RlKG5vZGUpLFxuXHRcdFx0XHRpID0gZmFsc2UsXG5cdFx0XHRcdGogPSBmYWxzZSxcblx0XHRcdFx0ayA9IGZhbHNlLFxuXHRcdFx0XHRkID0gZG9jdW1lbnQ7XG5cdFx0XHRpZighb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYob2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiB0aGlzLnJlZHJhdyh0cnVlKTsgfVxuXHRcdFx0bm9kZSA9IHRoaXMuZ2V0X25vZGUobm9kZSwgdHJ1ZSk7XG5cdFx0XHRpZighbm9kZSB8fCAhbm9kZS5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9IC8vIFRPRE86IHF1aWNrIHRvZ2dsZVxuXG5cdFx0XHRub2RlLmNoaWxkcmVuKCcuanN0cmVlLWNoaWxkcmVuJykucmVtb3ZlKCk7XG5cdFx0XHRub2RlID0gbm9kZVswXTtcblx0XHRcdGlmKG9iai5jaGlsZHJlbi5sZW5ndGggJiYgb2JqLnN0YXRlLmxvYWRlZCkge1xuXHRcdFx0XHRrID0gZC5jcmVhdGVFbGVtZW50KCdVTCcpO1xuXHRcdFx0XHRrLnNldEF0dHJpYnV0ZSgncm9sZScsICdncm91cCcpO1xuXHRcdFx0XHRrLmNsYXNzTmFtZSA9ICdqc3RyZWUtY2hpbGRyZW4nO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0ay5hcHBlbmRDaGlsZCh0aGlzLnJlZHJhd19ub2RlKG9iai5jaGlsZHJlbltpXSwgdHJ1ZSwgdHJ1ZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoayk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZWRyYXdzIGEgc2luZ2xlIG5vZGUuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIHJlZHJhd19ub2RlKG5vZGUsIGRlZXAsIGlzX2NhbGxiYWNrLCBmb3JjZV9yZW5kZXIpXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gbm9kZSB0aGUgbm9kZSB0byByZWRyYXdcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IGRlZXAgc2hvdWxkIGNoaWxkIG5vZGVzIGJlIHJlZHJhd24gdG9vXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBpc19jYWxsYmFjayBpcyB0aGlzIGEgcmVjdXJzaW9uIGNhbGxcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IGZvcmNlX3JlbmRlciBzaG91bGQgY2hpbGRyZW4gb2YgY2xvc2VkIHBhcmVudHMgYmUgZHJhd24gYW55d2F5XG5cdFx0ICovXG5cdFx0cmVkcmF3X25vZGUgOiBmdW5jdGlvbiAobm9kZSwgZGVlcCwgaXNfY2FsbGJhY2ssIGZvcmNlX3JlbmRlcikge1xuXHRcdFx0dmFyIG9iaiA9IHRoaXMuZ2V0X25vZGUobm9kZSksXG5cdFx0XHRcdHBhciA9IGZhbHNlLFxuXHRcdFx0XHRpbmQgPSBmYWxzZSxcblx0XHRcdFx0b2xkID0gZmFsc2UsXG5cdFx0XHRcdGkgPSBmYWxzZSxcblx0XHRcdFx0aiA9IGZhbHNlLFxuXHRcdFx0XHRrID0gZmFsc2UsXG5cdFx0XHRcdGMgPSAnJyxcblx0XHRcdFx0ZCA9IGRvY3VtZW50LFxuXHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0ZiA9IGZhbHNlLFxuXHRcdFx0XHRzID0gZmFsc2UsXG5cdFx0XHRcdHRtcCA9IG51bGwsXG5cdFx0XHRcdHQgPSAwLFxuXHRcdFx0XHRsID0gMCxcblx0XHRcdFx0aGFzX2NoaWxkcmVuID0gZmFsc2UsXG5cdFx0XHRcdGxhc3Rfc2libGluZyA9IGZhbHNlO1xuXHRcdFx0aWYoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyAgcmV0dXJuIHRoaXMucmVkcmF3KHRydWUpOyB9XG5cdFx0XHRkZWVwID0gZGVlcCB8fCBvYmouY2hpbGRyZW4ubGVuZ3RoID09PSAwO1xuXHRcdFx0bm9kZSA9ICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2JqLmlkKSA6IHRoaXMuZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcjJyArIChcIjAxMjM0NTY3ODlcIi5pbmRleE9mKG9iai5pZFswXSkgIT09IC0xID8gJ1xcXFwzJyArIG9iai5pZFswXSArICcgJyArIG9iai5pZC5zdWJzdHIoMSkucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSA6IG9iai5pZC5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpKSApOyAvLywgdGhpcy5lbGVtZW50KTtcblx0XHRcdGlmKCFub2RlKSB7XG5cdFx0XHRcdGRlZXAgPSB0cnVlO1xuXHRcdFx0XHQvL25vZGUgPSBkLmNyZWF0ZUVsZW1lbnQoJ0xJJyk7XG5cdFx0XHRcdGlmKCFpc19jYWxsYmFjaykge1xuXHRcdFx0XHRcdHBhciA9IG9iai5wYXJlbnQgIT09ICQuanN0cmVlLnJvb3QgPyAkKCcjJyArIG9iai5wYXJlbnQucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSwgdGhpcy5lbGVtZW50KVswXSA6IG51bGw7XG5cdFx0XHRcdFx0aWYocGFyICE9PSBudWxsICYmICghcGFyIHx8ICFtW29iai5wYXJlbnRdLnN0YXRlLm9wZW5lZCkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aW5kID0gJC5pbkFycmF5KG9iai5pZCwgcGFyID09PSBudWxsID8gbVskLmpzdHJlZS5yb290XS5jaGlsZHJlbiA6IG1bb2JqLnBhcmVudF0uY2hpbGRyZW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bm9kZSA9ICQobm9kZSk7XG5cdFx0XHRcdGlmKCFpc19jYWxsYmFjaykge1xuXHRcdFx0XHRcdHBhciA9IG5vZGUucGFyZW50KCkucGFyZW50KClbMF07XG5cdFx0XHRcdFx0aWYocGFyID09PSB0aGlzLmVsZW1lbnRbMF0pIHtcblx0XHRcdFx0XHRcdHBhciA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGluZCA9IG5vZGUuaW5kZXgoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBtW29iai5pZF0uZGF0YSA9IG5vZGUuZGF0YSgpOyAvLyB1c2Ugb25seSBub2RlJ3MgZGF0YSwgbm8gbmVlZCB0byB0b3VjaCBqcXVlcnkgc3RvcmFnZVxuXHRcdFx0XHRpZighZGVlcCAmJiBvYmouY2hpbGRyZW4ubGVuZ3RoICYmICFub2RlLmNoaWxkcmVuKCcuanN0cmVlLWNoaWxkcmVuJykubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZGVlcCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIWRlZXApIHtcblx0XHRcdFx0XHRvbGQgPSBub2RlLmNoaWxkcmVuKCcuanN0cmVlLWNoaWxkcmVuJylbMF07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZiA9IG5vZGUuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJylbMF0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cdFx0XHRcdG5vZGUucmVtb3ZlKCk7XG5cdFx0XHRcdC8vbm9kZSA9IGQuY3JlYXRlRWxlbWVudCgnTEknKTtcblx0XHRcdFx0Ly9ub2RlID0gbm9kZVswXTtcblx0XHRcdH1cblx0XHRcdG5vZGUgPSB0aGlzLl9kYXRhLmNvcmUubm9kZS5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHQvLyBub2RlIGlzIERPTSwgZGVlcCBpcyBib29sZWFuXG5cblx0XHRcdGMgPSAnanN0cmVlLW5vZGUgJztcblx0XHRcdGZvcihpIGluIG9iai5saV9hdHRyKSB7XG5cdFx0XHRcdGlmKG9iai5saV9hdHRyLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0aWYoaSA9PT0gJ2lkJykgeyBjb250aW51ZTsgfVxuXHRcdFx0XHRcdGlmKGkgIT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKGksIG9iai5saV9hdHRyW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRjICs9IG9iai5saV9hdHRyW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoIW9iai5hX2F0dHIuaWQpIHtcblx0XHRcdFx0b2JqLmFfYXR0ci5pZCA9IG9iai5pZCArICdfYW5jaG9yJztcblx0XHRcdH1cblx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgISFvYmouc3RhdGUuc2VsZWN0ZWQpO1xuXHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGV2ZWwnLCBvYmoucGFyZW50cy5sZW5ndGgpO1xuXHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsIG9iai5hX2F0dHIuaWQpO1xuXHRcdFx0aWYob2JqLnN0YXRlLmRpc2FibGVkKSB7XG5cdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYoIW1bb2JqLmNoaWxkcmVuW2ldXS5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0XHRoYXNfY2hpbGRyZW4gPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihvYmoucGFyZW50ICE9PSBudWxsICYmIG1bb2JqLnBhcmVudF0gJiYgIW9iai5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0aSA9ICQuaW5BcnJheShvYmouaWQsIG1bb2JqLnBhcmVudF0uY2hpbGRyZW4pO1xuXHRcdFx0XHRsYXN0X3NpYmxpbmcgPSBvYmouaWQ7XG5cdFx0XHRcdGlmKGkgIT09IC0xKSB7XG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHRcdGZvcihqID0gbVtvYmoucGFyZW50XS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmKCFtW21bb2JqLnBhcmVudF0uY2hpbGRyZW5baV1dLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRcdFx0XHRsYXN0X3NpYmxpbmcgPSBtW29iai5wYXJlbnRdLmNoaWxkcmVuW2ldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYobGFzdF9zaWJsaW5nICE9PSBvYmouaWQpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmKG9iai5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0YyArPSAnIGpzdHJlZS1oaWRkZW4nO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG9iai5zdGF0ZS5sb2FkaW5nKSB7XG5cdFx0XHRcdGMgKz0gJyBqc3RyZWUtbG9hZGluZyc7XG5cdFx0XHR9XG5cdFx0XHRpZihvYmouc3RhdGUubG9hZGVkICYmICFoYXNfY2hpbGRyZW4pIHtcblx0XHRcdFx0YyArPSAnIGpzdHJlZS1sZWFmJztcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjICs9IG9iai5zdGF0ZS5vcGVuZWQgJiYgb2JqLnN0YXRlLmxvYWRlZCA/ICcganN0cmVlLW9wZW4nIDogJyBqc3RyZWUtY2xvc2VkJztcblx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAob2JqLnN0YXRlLm9wZW5lZCAmJiBvYmouc3RhdGUubG9hZGVkKSApO1xuXHRcdFx0fVxuXHRcdFx0aWYobGFzdF9zaWJsaW5nID09PSBvYmouaWQpIHtcblx0XHRcdFx0YyArPSAnIGpzdHJlZS1sYXN0Jztcblx0XHRcdH1cblx0XHRcdG5vZGUuaWQgPSBvYmouaWQ7XG5cdFx0XHRub2RlLmNsYXNzTmFtZSA9IGM7XG5cdFx0XHRjID0gKCBvYmouc3RhdGUuc2VsZWN0ZWQgPyAnIGpzdHJlZS1jbGlja2VkJyA6ICcnKSArICggb2JqLnN0YXRlLmRpc2FibGVkID8gJyBqc3RyZWUtZGlzYWJsZWQnIDogJycpO1xuXHRcdFx0Zm9yKGogaW4gb2JqLmFfYXR0cikge1xuXHRcdFx0XHRpZihvYmouYV9hdHRyLmhhc093blByb3BlcnR5KGopKSB7XG5cdFx0XHRcdFx0aWYoaiA9PT0gJ2hyZWYnICYmIG9iai5hX2F0dHJbal0gPT09ICcjJykgeyBjb250aW51ZTsgfVxuXHRcdFx0XHRcdGlmKGogIT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5zZXRBdHRyaWJ1dGUoaiwgb2JqLmFfYXR0cltqXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0YyArPSAnICcgKyBvYmouYV9hdHRyW2pdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoYy5sZW5ndGgpIHtcblx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmNsYXNzTmFtZSA9ICdqc3RyZWUtYW5jaG9yICcgKyBjO1xuXHRcdFx0fVxuXHRcdFx0aWYoKG9iai5pY29uICYmIG9iai5pY29uICE9PSB0cnVlKSB8fCBvYmouaWNvbiA9PT0gZmFsc2UpIHtcblx0XHRcdFx0aWYob2JqLmljb24gPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uY2xhc3NOYW1lICs9ICcganN0cmVlLXRoZW1laWNvbi1oaWRkZW4nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYob2JqLmljb24uaW5kZXhPZignLycpID09PSAtMSAmJiBvYmouaWNvbi5pbmRleE9mKCcuJykgPT09IC0xKSB7XG5cdFx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uY2xhc3NOYW1lICs9ICcgJyArIG9iai5pY29uICsgJyBqc3RyZWUtdGhlbWVpY29uLWN1c3RvbSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcIicrb2JqLmljb24rJ1wiKSc7XG5cdFx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJ2NlbnRlciBjZW50ZXInO1xuXHRcdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2F1dG8nO1xuXHRcdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLmNsYXNzTmFtZSArPSAnIGpzdHJlZS10aGVtZWljb24tY3VzdG9tJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNvcmUuZm9yY2VfdGV4dCkge1xuXHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uYXBwZW5kQ2hpbGQoZC5jcmVhdGVUZXh0Tm9kZShvYmoudGV4dCkpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5pbm5lckhUTUwgKz0gb2JqLnRleHQ7XG5cdFx0XHR9XG5cblxuXHRcdFx0aWYoZGVlcCAmJiBvYmouY2hpbGRyZW4ubGVuZ3RoICYmIChvYmouc3RhdGUub3BlbmVkIHx8IGZvcmNlX3JlbmRlcikgJiYgb2JqLnN0YXRlLmxvYWRlZCkge1xuXHRcdFx0XHRrID0gZC5jcmVhdGVFbGVtZW50KCdVTCcpO1xuXHRcdFx0XHRrLnNldEF0dHJpYnV0ZSgncm9sZScsICdncm91cCcpO1xuXHRcdFx0XHRrLmNsYXNzTmFtZSA9ICdqc3RyZWUtY2hpbGRyZW4nO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0ay5hcHBlbmRDaGlsZCh0aGlzLnJlZHJhd19ub2RlKG9iai5jaGlsZHJlbltpXSwgZGVlcCwgdHJ1ZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoayk7XG5cdFx0XHR9XG5cdFx0XHRpZihvbGQpIHtcblx0XHRcdFx0bm9kZS5hcHBlbmRDaGlsZChvbGQpO1xuXHRcdFx0fVxuXHRcdFx0aWYoIWlzX2NhbGxiYWNrKSB7XG5cdFx0XHRcdC8vIGFwcGVuZCBiYWNrIHVzaW5nIHBhciAvIGluZFxuXHRcdFx0XHRpZighcGFyKSB7XG5cdFx0XHRcdFx0cGFyID0gdGhpcy5lbGVtZW50WzBdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IHBhci5jaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKHBhci5jaGlsZE5vZGVzW2ldICYmIHBhci5jaGlsZE5vZGVzW2ldLmNsYXNzTmFtZSAmJiBwYXIuY2hpbGROb2Rlc1tpXS5jbGFzc05hbWUuaW5kZXhPZignanN0cmVlLWNoaWxkcmVuJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHR0bXAgPSBwYXIuY2hpbGROb2Rlc1tpXTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZighdG1wKSB7XG5cdFx0XHRcdFx0dG1wID0gZC5jcmVhdGVFbGVtZW50KCdVTCcpO1xuXHRcdFx0XHRcdHRtcC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZ3JvdXAnKTtcblx0XHRcdFx0XHR0bXAuY2xhc3NOYW1lID0gJ2pzdHJlZS1jaGlsZHJlbic7XG5cdFx0XHRcdFx0cGFyLmFwcGVuZENoaWxkKHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cGFyID0gdG1wO1xuXG5cdFx0XHRcdGlmKGluZCA8IHBhci5jaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHBhci5pbnNlcnRCZWZvcmUobm9kZSwgcGFyLmNoaWxkTm9kZXNbaW5kXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cGFyLmFwcGVuZENoaWxkKG5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGYpIHtcblx0XHRcdFx0XHR0ID0gdGhpcy5lbGVtZW50WzBdLnNjcm9sbFRvcDtcblx0XHRcdFx0XHRsID0gdGhpcy5lbGVtZW50WzBdLnNjcm9sbExlZnQ7XG5cdFx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmZvY3VzKCk7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50WzBdLnNjcm9sbFRvcCA9IHQ7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50WzBdLnNjcm9sbExlZnQgPSBsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihvYmouc3RhdGUub3BlbmVkICYmICFvYmouc3RhdGUubG9hZGVkKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5vcGVuZWQgPSBmYWxzZTtcblx0XHRcdFx0c2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0aGlzLm9wZW5fbm9kZShvYmouaWQsIGZhbHNlLCAwKTtcblx0XHRcdFx0fSwgdGhpcyksIDApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBvcGVucyBhIG5vZGUsIHJldmVhbGluZyBpdHMgY2hpbGRyZW4uIElmIHRoZSBub2RlIGlzIG5vdCBsb2FkZWQgaXQgd2lsbCBiZSBsb2FkZWQgYW5kIG9wZW5lZCBvbmNlIHJlYWR5LlxuXHRcdCAqIEBuYW1lIG9wZW5fbm9kZShvYmogWywgY2FsbGJhY2ssIGFuaW1hdGlvbl0pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIG9wZW5cblx0XHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb25jZSB0aGUgbm9kZSBpcyBvcGVuZWRcblx0XHQgKiBAcGFyYW0ge051bWJlcn0gYW5pbWF0aW9uIHRoZSBhbmltYXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIHdoZW4gb3BlbmluZyB0aGUgbm9kZSAob3ZlcnJpZGVzIHRoZSBgY29yZS5hbmltYXRpb25gIHNldHRpbmcpLiBVc2UgYGZhbHNlYCBmb3Igbm8gYW5pbWF0aW9uLlxuXHRcdCAqIEB0cmlnZ2VyIG9wZW5fbm9kZS5qc3RyZWUsIGFmdGVyX29wZW4uanN0cmVlLCBiZWZvcmVfb3Blbi5qc3RyZWVcblx0XHQgKi9cblx0XHRvcGVuX25vZGUgOiBmdW5jdGlvbiAob2JqLCBjYWxsYmFjaywgYW5pbWF0aW9uKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBkLCB0O1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMub3Blbl9ub2RlKG9ialt0MV0sIGNhbGxiYWNrLCBhbmltYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0YW5pbWF0aW9uID0gYW5pbWF0aW9uID09PSB1bmRlZmluZWQgPyB0aGlzLnNldHRpbmdzLmNvcmUuYW5pbWF0aW9uIDogYW5pbWF0aW9uO1xuXHRcdFx0aWYoIXRoaXMuaXNfY2xvc2VkKG9iaikpIHtcblx0XHRcdFx0aWYoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIG9iaiwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKCF0aGlzLmlzX2xvYWRlZChvYmopKSB7XG5cdFx0XHRcdGlmKHRoaXMuaXNfbG9hZGluZyhvYmopKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLm9wZW5fbm9kZShvYmosIGNhbGxiYWNrLCBhbmltYXRpb24pO1xuXHRcdFx0XHRcdH0sIHRoaXMpLCA1MDApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMubG9hZF9ub2RlKG9iaiwgZnVuY3Rpb24gKG8sIG9rKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9rID8gdGhpcy5vcGVuX25vZGUobywgY2FsbGJhY2ssIGFuaW1hdGlvbikgOiAoY2FsbGJhY2sgPyBjYWxsYmFjay5jYWxsKHRoaXMsIG8sIGZhbHNlKSA6IGZhbHNlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZCA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdFx0dCA9IHRoaXM7XG5cdFx0XHRcdGlmKGQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYoYW5pbWF0aW9uICYmIGQuY2hpbGRyZW4oXCIuanN0cmVlLWNoaWxkcmVuXCIpLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0ZC5jaGlsZHJlbihcIi5qc3RyZWUtY2hpbGRyZW5cIikuc3RvcCh0cnVlLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYob2JqLmNoaWxkcmVuLmxlbmd0aCAmJiAhdGhpcy5fZmlyc3RDaGlsZChkLmNoaWxkcmVuKCcuanN0cmVlLWNoaWxkcmVuJylbMF0pKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmRyYXdfY2hpbGRyZW4ob2JqKTtcblx0XHRcdFx0XHRcdC8vZCA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoIWFuaW1hdGlvbikge1xuXHRcdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdiZWZvcmVfb3BlbicsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHRcdFx0XHRkWzBdLmNsYXNzTmFtZSA9IGRbMF0uY2xhc3NOYW1lLnJlcGxhY2UoJ2pzdHJlZS1jbG9zZWQnLCAnanN0cmVlLW9wZW4nKTtcblx0XHRcdFx0XHRcdGRbMF0uc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2JlZm9yZV9vcGVuJywgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdFx0XHRcdGRcblx0XHRcdFx0XHRcdFx0LmNoaWxkcmVuKFwiLmpzdHJlZS1jaGlsZHJlblwiKS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpLmVuZCgpXG5cdFx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcImpzdHJlZS1jbG9zZWRcIikuYWRkQ2xhc3MoXCJqc3RyZWUtb3BlblwiKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHQuY2hpbGRyZW4oXCIuanN0cmVlLWNoaWxkcmVuXCIpLnN0b3AodHJ1ZSwgdHJ1ZSlcblx0XHRcdFx0XHRcdFx0XHQuc2xpZGVEb3duKGFuaW1hdGlvbiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh0LmVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dC50cmlnZ2VyKFwiYWZ0ZXJfb3BlblwiLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRvYmouc3RhdGUub3BlbmVkID0gdHJ1ZTtcblx0XHRcdFx0aWYoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIG9iaiwgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIWQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIGFib3V0IHRvIGJlIG9wZW5lZCAoaWYgdGhlIG5vZGUgaXMgc3VwcG9zZWQgdG8gYmUgaW4gdGhlIERPTSwgaXQgd2lsbCBiZSwgYnV0IGl0IHdvbid0IGJlIHZpc2libGUgeWV0KVxuXHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdCAqIEBuYW1lIGJlZm9yZV9vcGVuLmpzdHJlZVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBvcGVuZWQgbm9kZVxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcignYmVmb3JlX29wZW4nLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgb3BlbmVkIChpZiB0aGVyZSBpcyBhbiBhbmltYXRpb24gaXQgd2lsbCBub3QgYmUgY29tcGxldGVkIHlldClcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIG9wZW5fbm9kZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIG9wZW5lZCBub2RlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ29wZW5fbm9kZScsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHRcdGlmKCFhbmltYXRpb24gfHwgIWQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIG9wZW5lZCBhbmQgdGhlIGFuaW1hdGlvbiBpcyBjb21wbGV0ZVxuXHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdCAqIEBuYW1lIGFmdGVyX29wZW4uanN0cmVlXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIG9wZW5lZCBub2RlXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKFwiYWZ0ZXJfb3BlblwiLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogb3BlbnMgZXZlcnkgcGFyZW50IG9mIGEgbm9kZSAobm9kZSBzaG91bGQgYmUgbG9hZGVkKVxuXHRcdCAqIEBuYW1lIF9vcGVuX3RvKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gcmV2ZWFsXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRfb3Blbl90byA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZhciBpLCBqLCBwID0gb2JqLnBhcmVudHM7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBwLmxlbmd0aDsgaSA8IGo7IGkrPTEpIHtcblx0XHRcdFx0aWYoaSAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdHRoaXMub3Blbl9ub2RlKHBbaV0sIGZhbHNlLCAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICQoJyMnICsgb2JqLmlkLnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJyksIHRoaXMuZWxlbWVudCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjbG9zZXMgYSBub2RlLCBoaWRpbmcgaXRzIGNoaWxkcmVuXG5cdFx0ICogQG5hbWUgY2xvc2Vfbm9kZShvYmogWywgYW5pbWF0aW9uXSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gY2xvc2Vcblx0XHQgKiBAcGFyYW0ge051bWJlcn0gYW5pbWF0aW9uIHRoZSBhbmltYXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIHdoZW4gY2xvc2luZyB0aGUgbm9kZSAob3ZlcnJpZGVzIHRoZSBgY29yZS5hbmltYXRpb25gIHNldHRpbmcpLiBVc2UgYGZhbHNlYCBmb3Igbm8gYW5pbWF0aW9uLlxuXHRcdCAqIEB0cmlnZ2VyIGNsb3NlX25vZGUuanN0cmVlLCBhZnRlcl9jbG9zZS5qc3RyZWVcblx0XHQgKi9cblx0XHRjbG9zZV9ub2RlIDogZnVuY3Rpb24gKG9iaiwgYW5pbWF0aW9uKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCB0LCBkO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuY2xvc2Vfbm9kZShvYmpbdDFdLCBhbmltYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5pc19jbG9zZWQob2JqKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRhbmltYXRpb24gPSBhbmltYXRpb24gPT09IHVuZGVmaW5lZCA/IHRoaXMuc2V0dGluZ3MuY29yZS5hbmltYXRpb24gOiBhbmltYXRpb247XG5cdFx0XHR0ID0gdGhpcztcblx0XHRcdGQgPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cblx0XHRcdG9iai5zdGF0ZS5vcGVuZWQgPSBmYWxzZTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIGNsb3NlZCAoaWYgdGhlcmUgaXMgYW4gYW5pbWF0aW9uIGl0IHdpbGwgbm90IGJlIGNvbXBsZXRlIHlldClcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY2xvc2Vfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBjbG9zZWQgbm9kZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2Nsb3NlX25vZGUnLHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHRpZighZC5sZW5ndGgpIHtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyBjbG9zZWQgYW5kIHRoZSBhbmltYXRpb24gaXMgY29tcGxldGVcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIGFmdGVyX2Nsb3NlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgY2xvc2VkIG5vZGVcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcihcImFmdGVyX2Nsb3NlXCIsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYoIWFuaW1hdGlvbikge1xuXHRcdFx0XHRcdGRbMF0uY2xhc3NOYW1lID0gZFswXS5jbGFzc05hbWUucmVwbGFjZSgnanN0cmVlLW9wZW4nLCAnanN0cmVlLWNsb3NlZCcpO1xuXHRcdFx0XHRcdGQuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpLmNoaWxkcmVuKCcuanN0cmVlLWNoaWxkcmVuJykucmVtb3ZlKCk7XG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKFwiYWZ0ZXJfY2xvc2VcIiwgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRkXG5cdFx0XHRcdFx0XHQuY2hpbGRyZW4oXCIuanN0cmVlLWNoaWxkcmVuXCIpLmF0dHIoXCJzdHlsZVwiLFwiZGlzcGxheTpibG9jayAhaW1wb3J0YW50XCIpLmVuZCgpXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtb3BlblwiKS5hZGRDbGFzcyhcImpzdHJlZS1jbG9zZWRcIikuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpXG5cdFx0XHRcdFx0XHQuY2hpbGRyZW4oXCIuanN0cmVlLWNoaWxkcmVuXCIpLnN0b3AodHJ1ZSwgdHJ1ZSkuc2xpZGVVcChhbmltYXRpb24sIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0ZC5jaGlsZHJlbignLmpzdHJlZS1jaGlsZHJlbicpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRpZiAodC5lbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdFx0dC50cmlnZ2VyKFwiYWZ0ZXJfY2xvc2VcIiwgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHRvZ2dsZXMgYSBub2RlIC0gY2xvc2luZyBpdCBpZiBpdCBpcyBvcGVuLCBvcGVuaW5nIGl0IGlmIGl0IGlzIGNsb3NlZFxuXHRcdCAqIEBuYW1lIHRvZ2dsZV9ub2RlKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gdG9nZ2xlXG5cdFx0ICovXG5cdFx0dG9nZ2xlX25vZGUgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgdDEsIHQyO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMudG9nZ2xlX25vZGUob2JqW3QxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLmlzX2Nsb3NlZChvYmopKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm9wZW5fbm9kZShvYmopO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5pc19vcGVuKG9iaikpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY2xvc2Vfbm9kZShvYmopO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogb3BlbnMgYWxsIG5vZGVzIHdpdGhpbiBhIG5vZGUgKG9yIHRoZSB0cmVlKSwgcmV2ZWFsaW5nIHRoZWlyIGNoaWxkcmVuLiBJZiB0aGUgbm9kZSBpcyBub3QgbG9hZGVkIGl0IHdpbGwgYmUgbG9hZGVkIGFuZCBvcGVuZWQgb25jZSByZWFkeS5cblx0XHQgKiBAbmFtZSBvcGVuX2FsbChbb2JqLCBhbmltYXRpb24sIG9yaWdpbmFsX29ial0pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIG9wZW4gcmVjdXJzaXZlbHksIG9taXQgdG8gb3BlbiBhbGwgbm9kZXMgaW4gdGhlIHRyZWVcblx0XHQgKiBAcGFyYW0ge051bWJlcn0gYW5pbWF0aW9uIHRoZSBhbmltYXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIHdoZW4gb3BlbmluZyB0aGUgbm9kZXMsIHRoZSBkZWZhdWx0IGlzIG5vIGFuaW1hdGlvblxuXHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSByZWZlcmVuY2UgdG8gdGhlIG5vZGUgdGhhdCBzdGFydGVkIHRoZSBwcm9jZXNzIChpbnRlcm5hbCB1c2UpXG5cdFx0ICogQHRyaWdnZXIgb3Blbl9hbGwuanN0cmVlXG5cdFx0ICovXG5cdFx0b3Blbl9hbGwgOiBmdW5jdGlvbiAob2JqLCBhbmltYXRpb24sIG9yaWdpbmFsX29iaikge1xuXHRcdFx0aWYoIW9iaikgeyBvYmogPSAkLmpzdHJlZS5yb290OyB9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIGRvbSA9IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCA/IHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpIDogdGhpcy5nZXRfbm9kZShvYmosIHRydWUpLCBpLCBqLCBfdGhpcztcblx0XHRcdGlmKCFkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKHRoaXMuaXNfY2xvc2VkKHRoaXMuX21vZGVsLmRhdGFbb2JqLmNoaWxkcmVuX2RbaV1dKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVtvYmouY2hpbGRyZW5fZFtpXV0uc3RhdGUub3BlbmVkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMudHJpZ2dlcignb3Blbl9hbGwnLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0fVxuXHRcdFx0b3JpZ2luYWxfb2JqID0gb3JpZ2luYWxfb2JqIHx8IGRvbTtcblx0XHRcdF90aGlzID0gdGhpcztcblx0XHRcdGRvbSA9IHRoaXMuaXNfY2xvc2VkKG9iaikgPyBkb20uZmluZCgnLmpzdHJlZS1jbG9zZWQnKS5hZGRCYWNrKCkgOiBkb20uZmluZCgnLmpzdHJlZS1jbG9zZWQnKTtcblx0XHRcdGRvbS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0X3RoaXMub3Blbl9ub2RlKFxuXHRcdFx0XHRcdHRoaXMsXG5cdFx0XHRcdFx0ZnVuY3Rpb24obm9kZSwgc3RhdHVzKSB7IGlmKHN0YXR1cyAmJiB0aGlzLmlzX3BhcmVudChub2RlKSkgeyB0aGlzLm9wZW5fYWxsKG5vZGUsIGFuaW1hdGlvbiwgb3JpZ2luYWxfb2JqKTsgfSB9LFxuXHRcdFx0XHRcdGFuaW1hdGlvbiB8fCAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHRcdGlmKG9yaWdpbmFsX29iai5maW5kKCcuanN0cmVlLWNsb3NlZCcpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gYG9wZW5fYWxsYCBjYWxsIGNvbXBsZXRlc1xuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgb3Blbl9hbGwuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBvcGVuZWQgbm9kZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdvcGVuX2FsbCcsIHsgXCJub2RlXCIgOiB0aGlzLmdldF9ub2RlKG9yaWdpbmFsX29iaikgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjbG9zZXMgYWxsIG5vZGVzIHdpdGhpbiBhIG5vZGUgKG9yIHRoZSB0cmVlKSwgcmV2ZWFsaW5nIHRoZWlyIGNoaWxkcmVuXG5cdFx0ICogQG5hbWUgY2xvc2VfYWxsKFtvYmosIGFuaW1hdGlvbl0pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGNsb3NlIHJlY3Vyc2l2ZWx5LCBvbWl0IHRvIGNsb3NlIGFsbCBub2RlcyBpbiB0aGUgdHJlZVxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBhbmltYXRpb24gdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgd2hlbiBjbG9zaW5nIHRoZSBub2RlcywgdGhlIGRlZmF1bHQgaXMgbm8gYW5pbWF0aW9uXG5cdFx0ICogQHRyaWdnZXIgY2xvc2VfYWxsLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGNsb3NlX2FsbCA6IGZ1bmN0aW9uIChvYmosIGFuaW1hdGlvbikge1xuXHRcdFx0aWYoIW9iaikgeyBvYmogPSAkLmpzdHJlZS5yb290OyB9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIGRvbSA9IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCA/IHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpIDogdGhpcy5nZXRfbm9kZShvYmosIHRydWUpLFxuXHRcdFx0XHRfdGhpcyA9IHRoaXMsIGksIGo7XG5cdFx0XHRpZihkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdGRvbSA9IHRoaXMuaXNfb3BlbihvYmopID8gZG9tLmZpbmQoJy5qc3RyZWUtb3BlbicpLmFkZEJhY2soKSA6IGRvbS5maW5kKCcuanN0cmVlLW9wZW4nKTtcblx0XHRcdFx0JChkb20uZ2V0KCkucmV2ZXJzZSgpKS5lYWNoKGZ1bmN0aW9uICgpIHsgX3RoaXMuY2xvc2Vfbm9kZSh0aGlzLCBhbmltYXRpb24gfHwgMCk7IH0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbb2JqLmNoaWxkcmVuX2RbaV1dLnN0YXRlLm9wZW5lZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBgY2xvc2VfYWxsYCBjYWxsIGNvbXBsZXRlc1xuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjbG9zZV9hbGwuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgY2xvc2VkIG5vZGVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjbG9zZV9hbGwnLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2tzIGlmIGEgbm9kZSBpcyBkaXNhYmxlZCAobm90IHNlbGVjdGFibGUpXG5cdFx0ICogQG5hbWUgaXNfZGlzYWJsZWQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGlzX2Rpc2FibGVkIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuIG9iaiAmJiBvYmouc3RhdGUgJiYgb2JqLnN0YXRlLmRpc2FibGVkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZW5hYmxlcyBhIG5vZGUgLSBzbyB0aGF0IGl0IGNhbiBiZSBzZWxlY3RlZFxuXHRcdCAqIEBuYW1lIGVuYWJsZV9ub2RlKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gZW5hYmxlXG5cdFx0ICogQHRyaWdnZXIgZW5hYmxlX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0ZW5hYmxlX25vZGUgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgdDEsIHQyO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuZW5hYmxlX25vZGUob2JqW3QxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRvYmouc3RhdGUuZGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdHRoaXMuZ2V0X25vZGUob2JqLHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLnJlbW92ZUNsYXNzKCdqc3RyZWUtZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIGVuYWJsZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgZW5hYmxlX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgZW5hYmxlZCBub2RlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignZW5hYmxlX25vZGUnLCB7ICdub2RlJyA6IG9iaiB9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGRpc2FibGVzIGEgbm9kZSAtIHNvIHRoYXQgaXQgY2FuIG5vdCBiZSBzZWxlY3RlZFxuXHRcdCAqIEBuYW1lIGRpc2FibGVfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGRpc2FibGVcblx0XHQgKiBAdHJpZ2dlciBkaXNhYmxlX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0ZGlzYWJsZV9ub2RlIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0dmFyIHQxLCB0Mjtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmRpc2FibGVfbm9kZShvYmpbdDFdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdG9iai5zdGF0ZS5kaXNhYmxlZCA9IHRydWU7XG5cdFx0XHR0aGlzLmdldF9ub2RlKG9iaix0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcygnanN0cmVlLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIGRpc2FibGVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGRpc2FibGVfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBkaXNhYmxlZCBub2RlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignZGlzYWJsZV9ub2RlJywgeyAnbm9kZScgOiBvYmogfSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBkZXRlcm1pbmVzIGlmIGEgbm9kZSBpcyBoaWRkZW5cblx0XHQgKiBAbmFtZSBpc19oaWRkZW4ob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqL1xuXHRcdGlzX2hpZGRlbiA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiBvYmouc3RhdGUuaGlkZGVuID09PSB0cnVlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaGlkZXMgYSBub2RlIC0gaXQgaXMgc3RpbGwgaW4gdGhlIHN0cnVjdHVyZSBidXQgd2lsbCBub3QgYmUgdmlzaWJsZVxuXHRcdCAqIEBuYW1lIGhpZGVfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGhpZGVcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHNraXBfcmVkcmF3IGludGVybmFsIHBhcmFtZXRlciBjb250cm9sbGluZyBpZiByZWRyYXcgaXMgY2FsbGVkXG5cdFx0ICogQHRyaWdnZXIgaGlkZV9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGhpZGVfbm9kZSA6IGZ1bmN0aW9uIChvYmosIHNraXBfcmVkcmF3KSB7XG5cdFx0XHR2YXIgdDEsIHQyO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuaGlkZV9ub2RlKG9ialt0MV0sIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghc2tpcF9yZWRyYXcpIHtcblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoIW9iai5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0b2JqLnN0YXRlLmhpZGRlbiA9IHRydWU7XG5cdFx0XHRcdHRoaXMuX25vZGVfY2hhbmdlZChvYmoucGFyZW50KTtcblx0XHRcdFx0aWYoIXNraXBfcmVkcmF3KSB7XG5cdFx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBoaWRkZW5cblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIGhpZGVfbm9kZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIGhpZGRlbiBub2RlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2hpZGVfbm9kZScsIHsgJ25vZGUnIDogb2JqIH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc2hvd3MgYSBub2RlXG5cdFx0ICogQG5hbWUgc2hvd19ub2RlKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gc2hvd1xuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc2tpcF9yZWRyYXcgaW50ZXJuYWwgcGFyYW1ldGVyIGNvbnRyb2xsaW5nIGlmIHJlZHJhdyBpcyBjYWxsZWRcblx0XHQgKiBAdHJpZ2dlciBzaG93X25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0c2hvd19ub2RlIDogZnVuY3Rpb24gKG9iaiwgc2tpcF9yZWRyYXcpIHtcblx0XHRcdHZhciB0MSwgdDI7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5zaG93X25vZGUob2JqW3QxXSwgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFza2lwX3JlZHJhdykge1xuXHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZihvYmouc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5oaWRkZW4gPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5fbm9kZV9jaGFuZ2VkKG9iai5wYXJlbnQpO1xuXHRcdFx0XHRpZighc2tpcF9yZWRyYXcpIHtcblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIHNob3duXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBzaG93X25vZGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBzaG93biBub2RlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3Nob3dfbm9kZScsIHsgJ25vZGUnIDogb2JqIH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaGlkZXMgYWxsIG5vZGVzXG5cdFx0ICogQG5hbWUgaGlkZV9hbGwoKVxuXHRcdCAqIEB0cmlnZ2VyIGhpZGVfYWxsLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGhpZGVfYWxsIDogZnVuY3Rpb24gKHNraXBfcmVkcmF3KSB7XG5cdFx0XHR2YXIgaSwgbSA9IHRoaXMuX21vZGVsLmRhdGEsIGlkcyA9IFtdO1xuXHRcdFx0Zm9yKGkgaW4gbSkge1xuXHRcdFx0XHRpZihtLmhhc093blByb3BlcnR5KGkpICYmIGkgIT09ICQuanN0cmVlLnJvb3QgJiYgIW1baV0uc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdFx0bVtpXS5zdGF0ZS5oaWRkZW4gPSB0cnVlO1xuXHRcdFx0XHRcdGlkcy5wdXNoKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdyA9IHRydWU7XG5cdFx0XHRpZighc2tpcF9yZWRyYXcpIHtcblx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYWxsIG5vZGVzIGFyZSBoaWRkZW5cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgaGlkZV9hbGwuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyB0aGUgSURzIG9mIGFsbCBoaWRkZW4gbm9kZXNcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdoaWRlX2FsbCcsIHsgJ25vZGVzJyA6IGlkcyB9KTtcblx0XHRcdHJldHVybiBpZHM7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzaG93cyBhbGwgbm9kZXNcblx0XHQgKiBAbmFtZSBzaG93X2FsbCgpXG5cdFx0ICogQHRyaWdnZXIgc2hvd19hbGwuanN0cmVlXG5cdFx0ICovXG5cdFx0c2hvd19hbGwgOiBmdW5jdGlvbiAoc2tpcF9yZWRyYXcpIHtcblx0XHRcdHZhciBpLCBtID0gdGhpcy5fbW9kZWwuZGF0YSwgaWRzID0gW107XG5cdFx0XHRmb3IoaSBpbiBtKSB7XG5cdFx0XHRcdGlmKG0uaGFzT3duUHJvcGVydHkoaSkgJiYgaSAhPT0gJC5qc3RyZWUucm9vdCAmJiBtW2ldLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRcdG1baV0uc3RhdGUuaGlkZGVuID0gZmFsc2U7XG5cdFx0XHRcdFx0aWRzLnB1c2goaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3ID0gdHJ1ZTtcblx0XHRcdGlmKCFza2lwX3JlZHJhdykge1xuXHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbGwgbm9kZXMgYXJlIHNob3duXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNob3dfYWxsLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgdGhlIElEcyBvZiBhbGwgc2hvd24gbm9kZXNcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzaG93X2FsbCcsIHsgJ25vZGVzJyA6IGlkcyB9KTtcblx0XHRcdHJldHVybiBpZHM7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjYWxsZWQgd2hlbiBhIG5vZGUgaXMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIGFjdGl2YXRlX25vZGUob2JqLCBlKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBlIHRoZSByZWxhdGVkIGV2ZW50XG5cdFx0ICogQHRyaWdnZXIgYWN0aXZhdGVfbm9kZS5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICovXG5cdFx0YWN0aXZhdGVfbm9kZSA6IGZ1bmN0aW9uIChvYmosIGUpIHtcblx0XHRcdGlmKHRoaXMuaXNfZGlzYWJsZWQob2JqKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZighZSB8fCB0eXBlb2YgZSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdFx0ZSA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBlbnN1cmUgbGFzdF9jbGlja2VkIGlzIHN0aWxsIGluIHRoZSBET00sIG1ha2UgaXQgZnJlc2ggKG1heWJlIGl0IHdhcyBtb3ZlZD8pIGFuZCBtYWtlIHN1cmUgaXQgaXMgc3RpbGwgc2VsZWN0ZWQsIGlmIG5vdCAtIG1ha2UgbGFzdF9jbGlja2VkIHRoZSBsYXN0IHNlbGVjdGVkIG5vZGVcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQgPSB0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkICYmIHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQuaWQgIT09IHVuZGVmaW5lZCA/IHRoaXMuZ2V0X25vZGUodGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZC5pZCkgOiBudWxsO1xuXHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZCAmJiAhdGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZC5zdGF0ZS5zZWxlY3RlZCkgeyB0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkID0gbnVsbDsgfVxuXHRcdFx0aWYoIXRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQgJiYgdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmxlbmd0aCkgeyB0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkID0gdGhpcy5nZXRfbm9kZSh0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWRbdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmxlbmd0aCAtIDFdKTsgfVxuXG5cdFx0XHRpZighdGhpcy5zZXR0aW5ncy5jb3JlLm11bHRpcGxlIHx8ICghZS5tZXRhS2V5ICYmICFlLmN0cmxLZXkgJiYgIWUuc2hpZnRLZXkpIHx8IChlLnNoaWZ0S2V5ICYmICghdGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZCB8fCAhdGhpcy5nZXRfcGFyZW50KG9iaikgfHwgdGhpcy5nZXRfcGFyZW50KG9iaikgIT09IHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQucGFyZW50ICkgKSkge1xuXHRcdFx0XHRpZighdGhpcy5zZXR0aW5ncy5jb3JlLm11bHRpcGxlICYmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkpICYmIHRoaXMuaXNfc2VsZWN0ZWQob2JqKSkge1xuXHRcdFx0XHRcdHRoaXMuZGVzZWxlY3Rfbm9kZShvYmosIGZhbHNlLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmRlc2VsZWN0X2FsbCh0cnVlKTtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdF9ub2RlKG9iaiwgZmFsc2UsIGZhbHNlLCBlKTtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYoZS5zaGlmdEtleSkge1xuXHRcdFx0XHRcdHZhciBvID0gdGhpcy5nZXRfbm9kZShvYmopLmlkLFxuXHRcdFx0XHRcdFx0bCA9IHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQuaWQsXG5cdFx0XHRcdFx0XHRwID0gdGhpcy5nZXRfbm9kZSh0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkLnBhcmVudCkuY2hpbGRyZW4sXG5cdFx0XHRcdFx0XHRjID0gZmFsc2UsXG5cdFx0XHRcdFx0XHRpLCBqO1xuXHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHAubGVuZ3RoOyBpIDwgajsgaSArPSAxKSB7XG5cdFx0XHRcdFx0XHQvLyBzZXBhcmF0ZSBJRnMgd29yayB3aGVtIG8gYW5kIGwgYXJlIHRoZSBzYW1lXG5cdFx0XHRcdFx0XHRpZihwW2ldID09PSBvKSB7XG5cdFx0XHRcdFx0XHRcdGMgPSAhYztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHBbaV0gPT09IGwpIHtcblx0XHRcdFx0XHRcdFx0YyA9ICFjO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoIXRoaXMuaXNfZGlzYWJsZWQocFtpXSkgJiYgKGMgfHwgcFtpXSA9PT0gbyB8fCBwW2ldID09PSBsKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXRoaXMuaXNfaGlkZGVuKHBbaV0pKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zZWxlY3Rfbm9kZShwW2ldLCB0cnVlLCBmYWxzZSwgZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmRlc2VsZWN0X25vZGUocFtpXSwgdHJ1ZSwgZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAnc2VsZWN0X25vZGUnLCAnbm9kZScgOiB0aGlzLmdldF9ub2RlKG9iaiksICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICdldmVudCcgOiBlIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGlmKCF0aGlzLmlzX3NlbGVjdGVkKG9iaikpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2VsZWN0X25vZGUob2JqLCBmYWxzZSwgZmFsc2UsIGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuZGVzZWxlY3Rfbm9kZShvYmosIGZhbHNlLCBlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBjbGlja2VkIG9yIGludGVyY2F0ZWQgd2l0aCBieSB0aGUgdXNlclxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBhY3RpdmF0ZV9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgb29yaWdpbmFsIGV2ZW50IChpZiBhbnkpIHdoaWNoIHRyaWdnZXJlZCB0aGUgY2FsbCAobWF5IGJlIGFuIGVtcHR5IG9iamVjdClcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdhY3RpdmF0ZV9ub2RlJywgeyAnbm9kZScgOiB0aGlzLmdldF9ub2RlKG9iaiksICdldmVudCcgOiBlIH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogYXBwbGllcyB0aGUgaG92ZXIgc3RhdGUgb24gYSBub2RlLCBjYWxsZWQgd2hlbiBhIG5vZGUgaXMgaG92ZXJlZCBieSB0aGUgdXNlci4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgaG92ZXJfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqXG5cdFx0ICogQHRyaWdnZXIgaG92ZXJfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRob3Zlcl9ub2RlIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYoIW9iaiB8fCAhb2JqLmxlbmd0aCB8fCBvYmouY2hpbGRyZW4oJy5qc3RyZWUtaG92ZXJlZCcpLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgbyA9IHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLWhvdmVyZWQnKSwgdCA9IHRoaXMuZWxlbWVudDtcblx0XHRcdGlmKG8gJiYgby5sZW5ndGgpIHsgdGhpcy5kZWhvdmVyX25vZGUobyk7IH1cblxuXHRcdFx0b2JqLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKCdqc3RyZWUtaG92ZXJlZCcpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIGhvdmVyZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgaG92ZXJfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignaG92ZXJfbm9kZScsIHsgJ25vZGUnIDogdGhpcy5nZXRfbm9kZShvYmopIH0pO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHQuYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jywgb2JqWzBdLmlkKTsgfSwgMCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZW1vdmVzIHRoZSBob3ZlciBzdGF0ZSBmcm9tIGEgbm9kZWNhbGxlZCB3aGVuIGEgbm9kZSBpcyBubyBsb25nZXIgaG92ZXJlZCBieSB0aGUgdXNlci4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgZGVob3Zlcl9ub2RlKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmpcblx0XHQgKiBAdHJpZ2dlciBkZWhvdmVyX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0ZGVob3Zlcl9ub2RlIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYoIW9iaiB8fCAhb2JqLmxlbmd0aCB8fCAhb2JqLmNoaWxkcmVuKCcuanN0cmVlLWhvdmVyZWQnKS5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0b2JqLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLnJlbW92ZUNsYXNzKCdqc3RyZWUtaG92ZXJlZCcpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIG5vIGxvbmdlciBob3ZlcmVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGRlaG92ZXJfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignZGVob3Zlcl9ub2RlJywgeyAnbm9kZScgOiB0aGlzLmdldF9ub2RlKG9iaikgfSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzZWxlY3QgYSBub2RlXG5cdFx0ICogQG5hbWUgc2VsZWN0X25vZGUob2JqIFssIHN1cHJlc3NfZXZlbnQsIHByZXZlbnRfb3Blbl0pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIGFuIGFycmF5IGNhbiBiZSB1c2VkIHRvIHNlbGVjdCBtdWx0aXBsZSBub2Rlc1xuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc3VwcmVzc19ldmVudCBpZiBzZXQgdG8gYHRydWVgIHRoZSBgY2hhbmdlZC5qc3RyZWVgIGV2ZW50IHdvbid0IGJlIHRyaWdnZXJlZFxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gcHJldmVudF9vcGVuIGlmIHNldCB0byBgdHJ1ZWAgcGFyZW50cyBvZiB0aGUgc2VsZWN0ZWQgbm9kZSB3b24ndCBiZSBvcGVuZWRcblx0XHQgKiBAdHJpZ2dlciBzZWxlY3Rfbm9kZS5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICovXG5cdFx0c2VsZWN0X25vZGUgOiBmdW5jdGlvbiAob2JqLCBzdXByZXNzX2V2ZW50LCBwcmV2ZW50X29wZW4sIGUpIHtcblx0XHRcdHZhciBkb20sIHQxLCB0MiwgdGg7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5zZWxlY3Rfbm9kZShvYmpbdDFdLCBzdXByZXNzX2V2ZW50LCBwcmV2ZW50X29wZW4sIGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYoIW9iai5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHRvYmouc3RhdGUuc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQucHVzaChvYmouaWQpO1xuXHRcdFx0XHRpZighcHJldmVudF9vcGVuKSB7XG5cdFx0XHRcdFx0ZG9tID0gdGhpcy5fb3Blbl90byhvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGRvbSAmJiBkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZG9tLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcygnanN0cmVlLWNsaWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBzZWxlY3RlZFxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgc2VsZWN0X25vZGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIGV2ZW50IChpZiBhbnkpIHRoYXQgdHJpZ2dlcmVkIHRoaXMgc2VsZWN0X25vZGVcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignc2VsZWN0X25vZGUnLCB7ICdub2RlJyA6IG9iaiwgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJ2V2ZW50JyA6IGUgfSk7XG5cdFx0XHRcdGlmKCFzdXByZXNzX2V2ZW50KSB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gc2VsZWN0aW9uIGNoYW5nZXNcblx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHQgKiBAbmFtZSBjaGFuZ2VkLmpzdHJlZVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiB0aGUgYWN0aW9uIHRoYXQgY2F1c2VkIHRoZSBzZWxlY3Rpb24gdG8gY2hhbmdlXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBldmVudCAoaWYgYW55KSB0aGF0IHRyaWdnZXJlZCB0aGlzIGNoYW5nZWQgZXZlbnRcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ3NlbGVjdF9ub2RlJywgJ25vZGUnIDogb2JqLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAnZXZlbnQnIDogZSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZGVzZWxlY3QgYSBub2RlXG5cdFx0ICogQG5hbWUgZGVzZWxlY3Rfbm9kZShvYmogWywgc3VwcmVzc19ldmVudF0pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIGFuIGFycmF5IGNhbiBiZSB1c2VkIHRvIGRlc2VsZWN0IG11bHRpcGxlIG5vZGVzXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBzdXByZXNzX2V2ZW50IGlmIHNldCB0byBgdHJ1ZWAgdGhlIGBjaGFuZ2VkLmpzdHJlZWAgZXZlbnQgd29uJ3QgYmUgdHJpZ2dlcmVkXG5cdFx0ICogQHRyaWdnZXIgZGVzZWxlY3Rfbm9kZS5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICovXG5cdFx0ZGVzZWxlY3Rfbm9kZSA6IGZ1bmN0aW9uIChvYmosIHN1cHJlc3NfZXZlbnQsIGUpIHtcblx0XHRcdHZhciB0MSwgdDIsIGRvbTtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmRlc2VsZWN0X25vZGUob2JqW3QxXSwgc3VwcmVzc19ldmVudCwgZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZihvYmouc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0b2JqLnN0YXRlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCA9ICQudmFrYXRhLmFycmF5X3JlbW92ZV9pdGVtKHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgb2JqLmlkKTtcblx0XHRcdFx0aWYoZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdGRvbS5hdHRyKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLnJlbW92ZUNsYXNzKCdqc3RyZWUtY2xpY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIGRlc2VsZWN0ZWRcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIGRlc2VsZWN0X25vZGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIGV2ZW50IChpZiBhbnkpIHRoYXQgdHJpZ2dlcmVkIHRoaXMgZGVzZWxlY3Rfbm9kZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdkZXNlbGVjdF9ub2RlJywgeyAnbm9kZScgOiBvYmosICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICdldmVudCcgOiBlIH0pO1xuXHRcdFx0XHRpZighc3VwcmVzc19ldmVudCkge1xuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAnZGVzZWxlY3Rfbm9kZScsICdub2RlJyA6IG9iaiwgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJ2V2ZW50JyA6IGUgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHNlbGVjdCBhbGwgbm9kZXMgaW4gdGhlIHRyZWVcblx0XHQgKiBAbmFtZSBzZWxlY3RfYWxsKFtzdXByZXNzX2V2ZW50XSlcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHN1cHJlc3NfZXZlbnQgaWYgc2V0IHRvIGB0cnVlYCB0aGUgYGNoYW5nZWQuanN0cmVlYCBldmVudCB3b24ndCBiZSB0cmlnZ2VyZWRcblx0XHQgKiBAdHJpZ2dlciBzZWxlY3RfYWxsLmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKi9cblx0XHRzZWxlY3RfYWxsIDogZnVuY3Rpb24gKHN1cHJlc3NfZXZlbnQpIHtcblx0XHRcdHZhciB0bXAgPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuY29uY2F0KFtdKSwgaSwgajtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCA9IHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF0uY2hpbGRyZW5fZC5jb25jYXQoKTtcblx0XHRcdGZvcihpID0gMCwgaiA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVt0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWRbaV1dKSB7XG5cdFx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVt0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWRbaV1dLnN0YXRlLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5yZWRyYXcodHJ1ZSk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFsbCBub2RlcyBhcmUgc2VsZWN0ZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2VsZWN0X2FsbC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3NlbGVjdF9hbGwnLCB7ICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgfSk7XG5cdFx0XHRpZighc3VwcmVzc19ldmVudCkge1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ3NlbGVjdF9hbGwnLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAnb2xkX3NlbGVjdGlvbicgOiB0bXAgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBkZXNlbGVjdCBhbGwgc2VsZWN0ZWQgbm9kZXNcblx0XHQgKiBAbmFtZSBkZXNlbGVjdF9hbGwoW3N1cHJlc3NfZXZlbnRdKVxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc3VwcmVzc19ldmVudCBpZiBzZXQgdG8gYHRydWVgIHRoZSBgY2hhbmdlZC5qc3RyZWVgIGV2ZW50IHdvbid0IGJlIHRyaWdnZXJlZFxuXHRcdCAqIEB0cmlnZ2VyIGRlc2VsZWN0X2FsbC5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICovXG5cdFx0ZGVzZWxlY3RfYWxsIDogZnVuY3Rpb24gKHN1cHJlc3NfZXZlbnQpIHtcblx0XHRcdHZhciB0bXAgPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuY29uY2F0KFtdKSwgaSwgajtcblx0XHRcdGZvcihpID0gMCwgaiA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVt0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWRbaV1dKSB7XG5cdFx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVt0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWRbaV1dLnN0YXRlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtY2xpY2tlZCcpLnJlbW92ZUNsYXNzKCdqc3RyZWUtY2xpY2tlZCcpLnBhcmVudCgpLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFsbCBub2RlcyBhcmUgZGVzZWxlY3RlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBkZXNlbGVjdF9hbGwuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgcHJldmlvdXMgc2VsZWN0aW9uXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdkZXNlbGVjdF9hbGwnLCB7ICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICdub2RlJyA6IHRtcCB9KTtcblx0XHRcdGlmKCFzdXByZXNzX2V2ZW50KSB7XG5cdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAnZGVzZWxlY3RfYWxsJywgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJ29sZF9zZWxlY3Rpb24nIDogdG1wIH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2tzIGlmIGEgbm9kZSBpcyBzZWxlY3RlZFxuXHRcdCAqIEBuYW1lIGlzX3NlbGVjdGVkKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gIG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXNfc2VsZWN0ZWQgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqLnN0YXRlLnNlbGVjdGVkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IGFuIGFycmF5IG9mIGFsbCBzZWxlY3RlZCBub2Rlc1xuXHRcdCAqIEBuYW1lIGdldF9zZWxlY3RlZChbZnVsbF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICBmdWxsIGlmIHNldCB0byBgdHJ1ZWAgdGhlIHJldHVybmVkIGFycmF5IHdpbGwgY29uc2lzdCBvZiB0aGUgZnVsbCBub2RlIG9iamVjdHMsIG90aGVyd2lzZSAtIG9ubHkgSURzIHdpbGwgYmUgcmV0dXJuZWRcblx0XHQgKiBAcmV0dXJuIHtBcnJheX1cblx0XHQgKi9cblx0XHRnZXRfc2VsZWN0ZWQgOiBmdW5jdGlvbiAoZnVsbCkge1xuXHRcdFx0cmV0dXJuIGZ1bGwgPyAkLm1hcCh0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICQucHJveHkoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIHRoaXMuZ2V0X25vZGUoaSk7IH0sIHRoaXMpKSA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5zbGljZSgpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IGFuIGFycmF5IG9mIGFsbCB0b3AgbGV2ZWwgc2VsZWN0ZWQgbm9kZXMgKGlnbm9yaW5nIGNoaWxkcmVuIG9mIHNlbGVjdGVkIG5vZGVzKVxuXHRcdCAqIEBuYW1lIGdldF90b3Bfc2VsZWN0ZWQoW2Z1bGxdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgZnVsbCBpZiBzZXQgdG8gYHRydWVgIHRoZSByZXR1cm5lZCBhcnJheSB3aWxsIGNvbnNpc3Qgb2YgdGhlIGZ1bGwgbm9kZSBvYmplY3RzLCBvdGhlcndpc2UgLSBvbmx5IElEcyB3aWxsIGJlIHJldHVybmVkXG5cdFx0ICogQHJldHVybiB7QXJyYXl9XG5cdFx0ICovXG5cdFx0Z2V0X3RvcF9zZWxlY3RlZCA6IGZ1bmN0aW9uIChmdWxsKSB7XG5cdFx0XHR2YXIgdG1wID0gdGhpcy5nZXRfc2VsZWN0ZWQodHJ1ZSksXG5cdFx0XHRcdG9iaiA9IHt9LCBpLCBqLCBrLCBsO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRvYmpbdG1wW2ldLmlkXSA9IHRtcFtpXTtcblx0XHRcdH1cblx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gdG1wW2ldLmNoaWxkcmVuX2QubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0aWYob2JqW3RtcFtpXS5jaGlsZHJlbl9kW2tdXSkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIG9ialt0bXBbaV0uY2hpbGRyZW5fZFtrXV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBbXTtcblx0XHRcdGZvcihpIGluIG9iaikge1xuXHRcdFx0XHRpZihvYmouaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHR0bXAucHVzaChpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZ1bGwgPyAkLm1hcCh0bXAsICQucHJveHkoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIHRoaXMuZ2V0X25vZGUoaSk7IH0sIHRoaXMpKSA6IHRtcDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCBhbiBhcnJheSBvZiBhbGwgYm90dG9tIGxldmVsIHNlbGVjdGVkIG5vZGVzIChpZ25vcmluZyBzZWxlY3RlZCBwYXJlbnRzKVxuXHRcdCAqIEBuYW1lIGdldF9ib3R0b21fc2VsZWN0ZWQoW2Z1bGxdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgZnVsbCBpZiBzZXQgdG8gYHRydWVgIHRoZSByZXR1cm5lZCBhcnJheSB3aWxsIGNvbnNpc3Qgb2YgdGhlIGZ1bGwgbm9kZSBvYmplY3RzLCBvdGhlcndpc2UgLSBvbmx5IElEcyB3aWxsIGJlIHJldHVybmVkXG5cdFx0ICogQHJldHVybiB7QXJyYXl9XG5cdFx0ICovXG5cdFx0Z2V0X2JvdHRvbV9zZWxlY3RlZCA6IGZ1bmN0aW9uIChmdWxsKSB7XG5cdFx0XHR2YXIgdG1wID0gdGhpcy5nZXRfc2VsZWN0ZWQodHJ1ZSksXG5cdFx0XHRcdG9iaiA9IFtdLCBpLCBqO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZighdG1wW2ldLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRcdG9iai5wdXNoKHRtcFtpXS5pZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmdWxsID8gJC5tYXAob2JqLCAkLnByb3h5KGZ1bmN0aW9uIChpKSB7IHJldHVybiB0aGlzLmdldF9ub2RlKGkpOyB9LCB0aGlzKSkgOiBvYmo7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXRzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSB0cmVlIHNvIHRoYXQgaXQgY2FuIGJlIHJlc3RvcmVkIGxhdGVyIHdpdGggYHNldF9zdGF0ZShzdGF0ZSlgLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQG5hbWUgZ2V0X3N0YXRlKClcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEByZXR1cm4ge09iamVjdH1cblx0XHQgKi9cblx0XHRnZXRfc3RhdGUgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgc3RhdGVcdD0ge1xuXHRcdFx0XHQnY29yZScgOiB7XG5cdFx0XHRcdFx0J29wZW4nIDogW10sXG5cdFx0XHRcdFx0J2xvYWRlZCcgOiBbXSxcblx0XHRcdFx0XHQnc2Nyb2xsJyA6IHtcblx0XHRcdFx0XHRcdCdsZWZ0JyA6IHRoaXMuZWxlbWVudC5zY3JvbGxMZWZ0KCksXG5cdFx0XHRcdFx0XHQndG9wJyA6IHRoaXMuZWxlbWVudC5zY3JvbGxUb3AoKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0LyohXG5cdFx0XHRcdFx0J3RoZW1lcycgOiB7XG5cdFx0XHRcdFx0XHQnbmFtZScgOiB0aGlzLmdldF90aGVtZSgpLFxuXHRcdFx0XHRcdFx0J2ljb25zJyA6IHRoaXMuX2RhdGEuY29yZS50aGVtZXMuaWNvbnMsXG5cdFx0XHRcdFx0XHQnZG90cycgOiB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmRvdHNcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdCovXG5cdFx0XHRcdFx0J3NlbGVjdGVkJyA6IFtdXG5cdFx0XHRcdH1cblx0XHRcdH0sIGk7XG5cdFx0XHRmb3IoaSBpbiB0aGlzLl9tb2RlbC5kYXRhKSB7XG5cdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGEuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRpZihpICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW2ldLnN0YXRlLmxvYWRlZCAmJiB0aGlzLnNldHRpbmdzLmNvcmUubG9hZGVkX3N0YXRlKSB7XG5cdFx0XHRcdFx0XHRcdHN0YXRlLmNvcmUubG9hZGVkLnB1c2goaSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW2ldLnN0YXRlLm9wZW5lZCkge1xuXHRcdFx0XHRcdFx0XHRzdGF0ZS5jb3JlLm9wZW4ucHVzaChpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbaV0uc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdFx0c3RhdGUuY29yZS5zZWxlY3RlZC5wdXNoKGkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHN0YXRlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc2V0cyB0aGUgc3RhdGUgb2YgdGhlIHRyZWUuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAbmFtZSBzZXRfc3RhdGUoc3RhdGUgWywgY2FsbGJhY2tdKVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIHRoZSBzdGF0ZSB0byByZXN0b3JlLiBLZWVwIGluIG1pbmQgdGhpcyBvYmplY3QgaXMgcGFzc2VkIGJ5IHJlZmVyZW5jZSBhbmQganN0cmVlIHdpbGwgbW9kaWZ5IGl0LlxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb25jZSB0aGUgc3RhdGUgaXMgcmVzdG9yZWQuXG5cdFx0ICogQHRyaWdnZXIgc2V0X3N0YXRlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHNldF9zdGF0ZSA6IGZ1bmN0aW9uIChzdGF0ZSwgY2FsbGJhY2spIHtcblx0XHRcdGlmKHN0YXRlKSB7XG5cdFx0XHRcdGlmKHN0YXRlLmNvcmUgJiYgc3RhdGUuY29yZS5zZWxlY3RlZCAmJiBzdGF0ZS5jb3JlLmluaXRpYWxfc2VsZWN0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRzdGF0ZS5jb3JlLmluaXRpYWxfc2VsZWN0aW9uID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmNvbmNhdChbXSkuc29ydCgpLmpvaW4oJywnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihzdGF0ZS5jb3JlKSB7XG5cdFx0XHRcdFx0dmFyIHJlcywgbiwgdCwgX3RoaXMsIGk7XG5cdFx0XHRcdFx0aWYoc3RhdGUuY29yZS5sb2FkZWQpIHtcblx0XHRcdFx0XHRcdGlmKCF0aGlzLnNldHRpbmdzLmNvcmUubG9hZGVkX3N0YXRlIHx8ICEkLmlzQXJyYXkoc3RhdGUuY29yZS5sb2FkZWQpIHx8ICFzdGF0ZS5jb3JlLmxvYWRlZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIHN0YXRlLmNvcmUubG9hZGVkO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNldF9zdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2xvYWRfbm9kZXMoc3RhdGUuY29yZS5sb2FkZWQsIGZ1bmN0aW9uIChub2Rlcykge1xuXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBzdGF0ZS5jb3JlLmxvYWRlZDtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNldF9zdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoc3RhdGUuY29yZS5vcGVuKSB7XG5cdFx0XHRcdFx0XHRpZighJC5pc0FycmF5KHN0YXRlLmNvcmUub3BlbikgfHwgIXN0YXRlLmNvcmUub3Blbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIHN0YXRlLmNvcmUub3Blbjtcblx0XHRcdFx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9sb2FkX25vZGVzKHN0YXRlLmNvcmUub3BlbiwgZnVuY3Rpb24gKG5vZGVzKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5vcGVuX25vZGUobm9kZXMsIGZhbHNlLCAwKTtcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgc3RhdGUuY29yZS5vcGVuO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2V0X3N0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihzdGF0ZS5jb3JlLnNjcm9sbCkge1xuXHRcdFx0XHRcdFx0aWYoc3RhdGUuY29yZS5zY3JvbGwgJiYgc3RhdGUuY29yZS5zY3JvbGwubGVmdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5zY3JvbGxMZWZ0KHN0YXRlLmNvcmUuc2Nyb2xsLmxlZnQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoc3RhdGUuY29yZS5zY3JvbGwgJiYgc3RhdGUuY29yZS5zY3JvbGwudG9wICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LnNjcm9sbFRvcChzdGF0ZS5jb3JlLnNjcm9sbC50b3ApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGVsZXRlIHN0YXRlLmNvcmUuc2Nyb2xsO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoc3RhdGUuY29yZS5zZWxlY3RlZCkge1xuXHRcdFx0XHRcdFx0X3RoaXMgPSB0aGlzO1xuXHRcdFx0XHRcdFx0aWYgKHN0YXRlLmNvcmUuaW5pdGlhbF9zZWxlY3Rpb24gPT09IHVuZGVmaW5lZCB8fFxuXHRcdFx0XHRcdFx0XHRzdGF0ZS5jb3JlLmluaXRpYWxfc2VsZWN0aW9uID09PSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuY29uY2F0KFtdKS5zb3J0KCkuam9pbignLCcpXG5cdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5kZXNlbGVjdF9hbGwoKTtcblx0XHRcdFx0XHRcdFx0JC5lYWNoKHN0YXRlLmNvcmUuc2VsZWN0ZWQsIGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMuc2VsZWN0X25vZGUodiwgZmFsc2UsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGRlbGV0ZSBzdGF0ZS5jb3JlLmluaXRpYWxfc2VsZWN0aW9uO1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHN0YXRlLmNvcmUuc2VsZWN0ZWQ7XG5cdFx0XHRcdFx0XHR0aGlzLnNldF9zdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmb3IoaSBpbiBzdGF0ZSkge1xuXHRcdFx0XHRcdFx0aWYoc3RhdGUuaGFzT3duUHJvcGVydHkoaSkgJiYgaSAhPT0gXCJjb3JlXCIgJiYgJC5pbkFycmF5KGksIHRoaXMuc2V0dGluZ3MucGx1Z2lucykgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBzdGF0ZVtpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoJC5pc0VtcHR5T2JqZWN0KHN0YXRlLmNvcmUpKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgc3RhdGUuY29yZTtcblx0XHRcdFx0XHRcdHRoaXMuc2V0X3N0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCQuaXNFbXB0eU9iamVjdChzdGF0ZSkpIHtcblx0XHRcdFx0XHRzdGF0ZSA9IG51bGw7XG5cdFx0XHRcdFx0aWYoY2FsbGJhY2spIHsgY2FsbGJhY2suY2FsbCh0aGlzKTsgfVxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgYHNldF9zdGF0ZWAgY2FsbCBjb21wbGV0ZXNcblx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHQgKiBAbmFtZSBzZXRfc3RhdGUuanN0cmVlXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdzZXRfc3RhdGUnKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZWZyZXNoZXMgdGhlIHRyZWUgLSBhbGwgbm9kZXMgYXJlIHJlbG9hZGVkIHdpdGggY2FsbHMgdG8gYGxvYWRfbm9kZWAuXG5cdFx0ICogQG5hbWUgcmVmcmVzaCgpXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBza2lwX2xvYWRpbmcgYW4gb3B0aW9uIHRvIHNraXAgc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3Jcblx0XHQgKiBAcGFyYW0ge01peGVkfSBmb3JnZXRfc3RhdGUgaWYgc2V0IHRvIGB0cnVlYCBzdGF0ZSB3aWxsIG5vdCBiZSByZWFwcGxpZWQsIGlmIHNldCB0byBhIGZ1bmN0aW9uIChyZWNlaXZpbmcgdGhlIGN1cnJlbnQgc3RhdGUgYXMgYXJndW1lbnQpIHRoZSByZXN1bHQgb2YgdGhhdCBmdW5jdGlvbiB3aWxsIGJlIHVzZWQgYXMgc3RhdGVcblx0XHQgKiBAdHJpZ2dlciByZWZyZXNoLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHJlZnJlc2ggOiBmdW5jdGlvbiAoc2tpcF9sb2FkaW5nLCBmb3JnZXRfc3RhdGUpIHtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5zdGF0ZSA9IGZvcmdldF9zdGF0ZSA9PT0gdHJ1ZSA/IHt9IDogdGhpcy5nZXRfc3RhdGUoKTtcblx0XHRcdGlmKGZvcmdldF9zdGF0ZSAmJiAkLmlzRnVuY3Rpb24oZm9yZ2V0X3N0YXRlKSkgeyB0aGlzLl9kYXRhLmNvcmUuc3RhdGUgPSBmb3JnZXRfc3RhdGUuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUuc3RhdGUpOyB9XG5cdFx0XHR0aGlzLl9jbnQgPSAwO1xuXHRcdFx0dGhpcy5fbW9kZWwuZGF0YSA9IHt9O1xuXHRcdFx0dGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XSA9IHtcblx0XHRcdFx0aWQgOiAkLmpzdHJlZS5yb290LFxuXHRcdFx0XHRwYXJlbnQgOiBudWxsLFxuXHRcdFx0XHRwYXJlbnRzIDogW10sXG5cdFx0XHRcdGNoaWxkcmVuIDogW10sXG5cdFx0XHRcdGNoaWxkcmVuX2QgOiBbXSxcblx0XHRcdFx0c3RhdGUgOiB7IGxvYWRlZCA6IGZhbHNlIH1cblx0XHRcdH07XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgPSBbXTtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQgPSBudWxsO1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgPSBudWxsO1xuXG5cdFx0XHR2YXIgYyA9IHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdLmNsYXNzTmFtZTtcblx0XHRcdGlmKCFza2lwX2xvYWRpbmcpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50Lmh0bWwoXCI8XCIrXCJ1bCBjbGFzcz0nXCIrYytcIicgcm9sZT0nZ3JvdXAnPjxcIitcImxpIGNsYXNzPSdqc3RyZWUtaW5pdGlhbC1ub2RlIGpzdHJlZS1sb2FkaW5nIGpzdHJlZS1sZWFmIGpzdHJlZS1sYXN0JyByb2xlPSd0cmVlaXRlbScgaWQ9J2pcIit0aGlzLl9pZCtcIl9sb2FkaW5nJz48aSBjbGFzcz0nanN0cmVlLWljb24ganN0cmVlLW9jbCc+PC9pPjxcIitcImEgY2xhc3M9J2pzdHJlZS1hbmNob3InIGhyZWY9JyMnPjxpIGNsYXNzPSdqc3RyZWUtaWNvbiBqc3RyZWUtdGhlbWVpY29uLWhpZGRlbic+PC9pPlwiICsgdGhpcy5nZXRfc3RyaW5nKFwiTG9hZGluZyAuLi5cIikgKyBcIjwvYT48L2xpPjwvdWw+XCIpO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50JywnaicrdGhpcy5faWQrJ19sb2FkaW5nJyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmxvYWRfbm9kZSgkLmpzdHJlZS5yb290LCBmdW5jdGlvbiAobywgcykge1xuXHRcdFx0XHRpZihzKSB7XG5cdFx0XHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0uY2xhc3NOYW1lID0gYztcblx0XHRcdFx0XHRpZih0aGlzLl9maXJzdENoaWxkKHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsdGhpcy5fZmlyc3RDaGlsZCh0aGlzLmdldF9jb250YWluZXJfdWwoKVswXSkuaWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnNldF9zdGF0ZSgkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fZGF0YS5jb3JlLnN0YXRlKSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIGByZWZyZXNoYCBjYWxsIGNvbXBsZXRlc1xuXHRcdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0XHQgKiBAbmFtZSByZWZyZXNoLmpzdHJlZVxuXHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3JlZnJlc2gnKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuc3RhdGUgPSBudWxsO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZWZyZXNoZXMgYSBub2RlIGluIHRoZSB0cmVlIChyZWxvYWQgaXRzIGNoaWxkcmVuKSBhbGwgb3BlbmVkIG5vZGVzIGluc2lkZSB0aGF0IG5vZGUgYXJlIHJlbG9hZGVkIHdpdGggY2FsbHMgdG8gYGxvYWRfbm9kZWAuXG5cdFx0ICogQG5hbWUgcmVmcmVzaF9ub2RlKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICogQHRyaWdnZXIgcmVmcmVzaF9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHJlZnJlc2hfbm9kZSA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIG9wZW5lZCA9IFtdLCB0b19sb2FkID0gW10sIHMgPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuY29uY2F0KFtdKTtcblx0XHRcdHRvX2xvYWQucHVzaChvYmouaWQpO1xuXHRcdFx0aWYob2JqLnN0YXRlLm9wZW5lZCA9PT0gdHJ1ZSkgeyBvcGVuZWQucHVzaChvYmouaWQpOyB9XG5cdFx0XHR0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSkuZmluZCgnLmpzdHJlZS1vcGVuJykuZWFjaChmdW5jdGlvbigpIHsgdG9fbG9hZC5wdXNoKHRoaXMuaWQpOyBvcGVuZWQucHVzaCh0aGlzLmlkKTsgfSk7XG5cdFx0XHR0aGlzLl9sb2FkX25vZGVzKHRvX2xvYWQsICQucHJveHkoZnVuY3Rpb24gKG5vZGVzKSB7XG5cdFx0XHRcdHRoaXMub3Blbl9ub2RlKG9wZW5lZCwgZmFsc2UsIDApO1xuXHRcdFx0XHR0aGlzLnNlbGVjdF9ub2RlKHMpO1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIHJlZnJlc2hlZFxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgcmVmcmVzaF9ub2RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSAtIHRoZSByZWZyZXNoZWQgbm9kZVxuXHRcdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyAtIGFuIGFycmF5IG9mIHRoZSBJRHMgb2YgdGhlIG5vZGVzIHRoYXQgd2VyZSByZWxvYWRlZFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdyZWZyZXNoX25vZGUnLCB7ICdub2RlJyA6IG9iaiwgJ25vZGVzJyA6IG5vZGVzIH0pO1xuXHRcdFx0fSwgdGhpcyksIGZhbHNlLCB0cnVlKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHNldCAoY2hhbmdlKSB0aGUgSUQgb2YgYSBub2RlXG5cdFx0ICogQG5hbWUgc2V0X2lkKG9iaiwgaWQpXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gaWQgdGhlIG5ldyBJRFxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICogQHRyaWdnZXIgc2V0X2lkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHNldF9pZCA6IGZ1bmN0aW9uIChvYmosIGlkKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciBpLCBqLCBtID0gdGhpcy5fbW9kZWwuZGF0YSwgb2xkID0gb2JqLmlkO1xuXHRcdFx0aWQgPSBpZC50b1N0cmluZygpO1xuXHRcdFx0Ly8gdXBkYXRlIHBhcmVudHMgKHJlcGxhY2UgY3VycmVudCBJRCB3aXRoIG5ldyBvbmUgaW4gY2hpbGRyZW4gYW5kIGNoaWxkcmVuX2QpXG5cdFx0XHRtW29iai5wYXJlbnRdLmNoaWxkcmVuWyQuaW5BcnJheShvYmouaWQsIG1bb2JqLnBhcmVudF0uY2hpbGRyZW4pXSA9IGlkO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdG1bb2JqLnBhcmVudHNbaV1dLmNoaWxkcmVuX2RbJC5pbkFycmF5KG9iai5pZCwgbVtvYmoucGFyZW50c1tpXV0uY2hpbGRyZW5fZCldID0gaWQ7XG5cdFx0XHR9XG5cdFx0XHQvLyB1cGRhdGUgY2hpbGRyZW4gKHJlcGxhY2UgY3VycmVudCBJRCB3aXRoIG5ldyBvbmUgaW4gcGFyZW50IGFuZCBwYXJlbnRzKVxuXHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRtW29iai5jaGlsZHJlbltpXV0ucGFyZW50ID0gaWQ7XG5cdFx0XHR9XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0bVtvYmouY2hpbGRyZW5fZFtpXV0ucGFyZW50c1skLmluQXJyYXkob2JqLmlkLCBtW29iai5jaGlsZHJlbl9kW2ldXS5wYXJlbnRzKV0gPSBpZDtcblx0XHRcdH1cblx0XHRcdGkgPSAkLmluQXJyYXkob2JqLmlkLCB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQpO1xuXHRcdFx0aWYoaSAhPT0gLTEpIHsgdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkW2ldID0gaWQ7IH1cblx0XHRcdC8vIHVwZGF0ZSBtb2RlbCBhbmQgb2JqIGl0c2VsZiAob2JqLmlkLCB0aGlzLl9tb2RlbC5kYXRhW0tFWV0pXG5cdFx0XHRpID0gdGhpcy5nZXRfbm9kZShvYmouaWQsIHRydWUpO1xuXHRcdFx0aWYoaSkge1xuXHRcdFx0XHRpLmF0dHIoJ2lkJywgaWQpOyAvLy5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hdHRyKCdpZCcsIGlkICsgJ19hbmNob3InKS5lbmQoKS5hdHRyKCdhcmlhLWxhYmVsbGVkYnknLCBpZCArICdfYW5jaG9yJyk7XG5cdFx0XHRcdGlmKHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKSA9PT0gb2JqLmlkKSB7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsIGlkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZGVsZXRlIG1bb2JqLmlkXTtcblx0XHRcdG9iai5pZCA9IGlkO1xuXHRcdFx0b2JqLmxpX2F0dHIuaWQgPSBpZDtcblx0XHRcdG1baWRdID0gb2JqO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaWQgdmFsdWUgaXMgY2hhbmdlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzZXRfaWQuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IG9sZCB0aGUgb2xkIGlkXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2V0X2lkJyx7IFwibm9kZVwiIDogb2JqLCBcIm5ld1wiIDogb2JqLmlkLCBcIm9sZFwiIDogb2xkIH0pO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgdGhlIHRleHQgdmFsdWUgb2YgYSBub2RlXG5cdFx0ICogQG5hbWUgZ2V0X3RleHQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0Z2V0X3RleHQgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSA/IGZhbHNlIDogb2JqLnRleHQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzZXQgdGhlIHRleHQgdmFsdWUgb2YgYSBub2RlLiBVc2VkIGludGVybmFsbHksIHBsZWFzZSB1c2UgYHJlbmFtZV9ub2RlKG9iaiwgdmFsKWAuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBzZXRfdGV4dChvYmosIHZhbClcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlLCB5b3UgY2FuIHBhc3MgYW4gYXJyYXkgdG8gc2V0IHRoZSB0ZXh0IG9uIG11bHRpcGxlIG5vZGVzXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSB2YWwgdGhlIG5ldyB0ZXh0IHZhbHVlXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKiBAdHJpZ2dlciBzZXRfdGV4dC5qc3RyZWVcblx0XHQgKi9cblx0XHRzZXRfdGV4dCA6IGZ1bmN0aW9uIChvYmosIHZhbCkge1xuXHRcdFx0dmFyIHQxLCB0Mjtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLnNldF90ZXh0KG9ialt0MV0sIHZhbCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdG9iai50ZXh0ID0gdmFsO1xuXHRcdFx0aWYodGhpcy5nZXRfbm9kZShvYmosIHRydWUpLmxlbmd0aCkge1xuXHRcdFx0XHR0aGlzLnJlZHJhd19ub2RlKG9iai5pZCk7XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSB0ZXh0IHZhbHVlIGlzIGNoYW5nZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2V0X3RleHQuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gb2JqXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dCB0aGUgbmV3IHZhbHVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2V0X3RleHQnLHsgXCJvYmpcIiA6IG9iaiwgXCJ0ZXh0XCIgOiB2YWwgfSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldHMgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIGEgbm9kZSAob3IgdGhlIHdob2xlIHRyZWUpXG5cdFx0ICogQG5hbWUgZ2V0X2pzb24oW29iaiwgb3B0aW9uc10pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IG9wdGlvbnMubm9fc3RhdGUgZG8gbm90IHJldHVybiBzdGF0ZSBpbmZvcm1hdGlvblxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IG9wdGlvbnMubm9faWQgZG8gbm90IHJldHVybiBJRFxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IG9wdGlvbnMubm9fY2hpbGRyZW4gZG8gbm90IGluY2x1ZGUgY2hpbGRyZW5cblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBvcHRpb25zLm5vX2RhdGEgZG8gbm90IGluY2x1ZGUgbm9kZSBkYXRhXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gb3B0aW9ucy5ub19saV9hdHRyIGRvIG5vdCBpbmNsdWRlIExJIGF0dHJpYnV0ZXNcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBvcHRpb25zLm5vX2FfYXR0ciBkbyBub3QgaW5jbHVkZSBBIGF0dHJpYnV0ZXNcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBvcHRpb25zLmZsYXQgcmV0dXJuIGZsYXQgSlNPTiBpbnN0ZWFkIG9mIG5lc3RlZFxuXHRcdCAqIEByZXR1cm4ge09iamVjdH1cblx0XHQgKi9cblx0XHRnZXRfanNvbiA6IGZ1bmN0aW9uIChvYmosIG9wdGlvbnMsIGZsYXQpIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqIHx8ICQuanN0cmVlLnJvb3QpO1xuXHRcdFx0aWYoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5mbGF0ICYmICFmbGF0KSB7IGZsYXQgPSBbXTsgfVxuXHRcdFx0dmFyIHRtcCA9IHtcblx0XHRcdFx0J2lkJyA6IG9iai5pZCxcblx0XHRcdFx0J3RleHQnIDogb2JqLnRleHQsXG5cdFx0XHRcdCdpY29uJyA6IHRoaXMuZ2V0X2ljb24ob2JqKSxcblx0XHRcdFx0J2xpX2F0dHInIDogJC5leHRlbmQodHJ1ZSwge30sIG9iai5saV9hdHRyKSxcblx0XHRcdFx0J2FfYXR0cicgOiAkLmV4dGVuZCh0cnVlLCB7fSwgb2JqLmFfYXR0ciksXG5cdFx0XHRcdCdzdGF0ZScgOiB7fSxcblx0XHRcdFx0J2RhdGEnIDogb3B0aW9ucyAmJiBvcHRpb25zLm5vX2RhdGEgPyBmYWxzZSA6ICQuZXh0ZW5kKHRydWUsICQuaXNBcnJheShvYmouZGF0YSk/W106e30sIG9iai5kYXRhKVxuXHRcdFx0XHQvLyggdGhpcy5nZXRfbm9kZShvYmosIHRydWUpLmxlbmd0aCA/IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKS5kYXRhKCkgOiBvYmouZGF0YSApLFxuXHRcdFx0fSwgaSwgajtcblx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5mbGF0KSB7XG5cdFx0XHRcdHRtcC5wYXJlbnQgPSBvYmoucGFyZW50O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRtcC5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0aWYoIW9wdGlvbnMgfHwgIW9wdGlvbnMubm9fc3RhdGUpIHtcblx0XHRcdFx0Zm9yKGkgaW4gb2JqLnN0YXRlKSB7XG5cdFx0XHRcdFx0aWYob2JqLnN0YXRlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBvYmouc3RhdGVbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZWxldGUgdG1wLnN0YXRlO1xuXHRcdFx0fVxuXHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLm5vX2xpX2F0dHIpIHtcblx0XHRcdFx0ZGVsZXRlIHRtcC5saV9hdHRyO1xuXHRcdFx0fVxuXHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLm5vX2FfYXR0cikge1xuXHRcdFx0XHRkZWxldGUgdG1wLmFfYXR0cjtcblx0XHRcdH1cblx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5ub19pZCkge1xuXHRcdFx0XHRkZWxldGUgdG1wLmlkO1xuXHRcdFx0XHRpZih0bXAubGlfYXR0ciAmJiB0bXAubGlfYXR0ci5pZCkge1xuXHRcdFx0XHRcdGRlbGV0ZSB0bXAubGlfYXR0ci5pZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZih0bXAuYV9hdHRyICYmIHRtcC5hX2F0dHIuaWQpIHtcblx0XHRcdFx0XHRkZWxldGUgdG1wLmFfYXR0ci5pZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLmZsYXQgJiYgb2JqLmlkICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdGZsYXQucHVzaCh0bXApO1xuXHRcdFx0fVxuXHRcdFx0aWYoIW9wdGlvbnMgfHwgIW9wdGlvbnMubm9fY2hpbGRyZW4pIHtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5mbGF0KSB7XG5cdFx0XHRcdFx0XHR0aGlzLmdldF9qc29uKG9iai5jaGlsZHJlbltpXSwgb3B0aW9ucywgZmxhdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuLnB1c2godGhpcy5nZXRfanNvbihvYmouY2hpbGRyZW5baV0sIG9wdGlvbnMpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBvcHRpb25zICYmIG9wdGlvbnMuZmxhdCA/IGZsYXQgOiAob2JqLmlkID09PSAkLmpzdHJlZS5yb290ID8gdG1wLmNoaWxkcmVuIDogdG1wKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNyZWF0ZSBhIG5ldyBub2RlIChkbyBub3QgY29uZnVzZSB3aXRoIGxvYWRfbm9kZSlcblx0XHQgKiBAbmFtZSBjcmVhdGVfbm9kZShbcGFyLCBub2RlLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWRdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgIHBhciAgICAgICB0aGUgcGFyZW50IG5vZGUgKHRvIGNyZWF0ZSBhIHJvb3Qgbm9kZSB1c2UgZWl0aGVyIFwiI1wiIChzdHJpbmcpIG9yIGBudWxsYClcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gICBub2RlICAgICAgdGhlIGRhdGEgZm9yIHRoZSBuZXcgbm9kZSAoYSB2YWxpZCBKU09OIG9iamVjdCwgb3IgYSBzaW1wbGUgc3RyaW5nIHdpdGggdGhlIG5hbWUpXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICAgcG9zICAgICAgIHRoZSBpbmRleCBhdCB3aGljaCB0byBpbnNlcnQgdGhlIG5vZGUsIFwiZmlyc3RcIiBhbmQgXCJsYXN0XCIgYXJlIGFsc28gc3VwcG9ydGVkLCBkZWZhdWx0IGlzIFwibGFzdFwiXG5cdFx0ICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uY2UgdGhlIG5vZGUgaXMgY3JlYXRlZFxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGlzX2xvYWRlZCBpbnRlcm5hbCBhcmd1bWVudCBpbmRpY2F0aW5nIGlmIHRoZSBwYXJlbnQgbm9kZSB3YXMgc3VjY2VzZnVsbHkgbG9hZGVkXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgIHRoZSBJRCBvZiB0aGUgbmV3bHkgY3JlYXRlIG5vZGVcblx0XHQgKiBAdHJpZ2dlciBtb2RlbC5qc3RyZWUsIGNyZWF0ZV9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGNyZWF0ZV9ub2RlIDogZnVuY3Rpb24gKHBhciwgbm9kZSwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkKSB7XG5cdFx0XHRpZihwYXIgPT09IG51bGwpIHsgcGFyID0gJC5qc3RyZWUucm9vdDsgfVxuXHRcdFx0cGFyID0gdGhpcy5nZXRfbm9kZShwYXIpO1xuXHRcdFx0aWYoIXBhcikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHBvcyA9IHBvcyA9PT0gdW5kZWZpbmVkID8gXCJsYXN0XCIgOiBwb3M7XG5cdFx0XHRpZighcG9zLnRvU3RyaW5nKCkubWF0Y2goL14oYmVmb3JlfGFmdGVyKSQvKSAmJiAhaXNfbG9hZGVkICYmICF0aGlzLmlzX2xvYWRlZChwYXIpKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmxvYWRfbm9kZShwYXIsIGZ1bmN0aW9uICgpIHsgdGhpcy5jcmVhdGVfbm9kZShwYXIsIG5vZGUsIHBvcywgY2FsbGJhY2ssIHRydWUpOyB9KTtcblx0XHRcdH1cblx0XHRcdGlmKCFub2RlKSB7IG5vZGUgPSB7IFwidGV4dFwiIDogdGhpcy5nZXRfc3RyaW5nKCdOZXcgbm9kZScpIH07IH1cblx0XHRcdGlmKHR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdG5vZGUgPSB7IFwidGV4dFwiIDogbm9kZSB9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bm9kZSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBub2RlKTtcblx0XHRcdH1cblx0XHRcdGlmKG5vZGUudGV4dCA9PT0gdW5kZWZpbmVkKSB7IG5vZGUudGV4dCA9IHRoaXMuZ2V0X3N0cmluZygnTmV3IG5vZGUnKTsgfVxuXHRcdFx0dmFyIHRtcCwgZHBjLCBpLCBqO1xuXG5cdFx0XHRpZihwYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0aWYocG9zID09PSBcImJlZm9yZVwiKSB7IHBvcyA9IFwiZmlyc3RcIjsgfVxuXHRcdFx0XHRpZihwb3MgPT09IFwiYWZ0ZXJcIikgeyBwb3MgPSBcImxhc3RcIjsgfVxuXHRcdFx0fVxuXHRcdFx0c3dpdGNoKHBvcykge1xuXHRcdFx0XHRjYXNlIFwiYmVmb3JlXCI6XG5cdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShwYXIucGFyZW50KTtcblx0XHRcdFx0XHRwb3MgPSAkLmluQXJyYXkocGFyLmlkLCB0bXAuY2hpbGRyZW4pO1xuXHRcdFx0XHRcdHBhciA9IHRtcDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImFmdGVyXCIgOlxuXHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUocGFyLnBhcmVudCk7XG5cdFx0XHRcdFx0cG9zID0gJC5pbkFycmF5KHBhci5pZCwgdG1wLmNoaWxkcmVuKSArIDE7XG5cdFx0XHRcdFx0cGFyID0gdG1wO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiaW5zaWRlXCI6XG5cdFx0XHRcdGNhc2UgXCJmaXJzdFwiOlxuXHRcdFx0XHRcdHBvcyA9IDA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJsYXN0XCI6XG5cdFx0XHRcdFx0cG9zID0gcGFyLmNoaWxkcmVuLmxlbmd0aDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRpZighcG9zKSB7IHBvcyA9IDA7IH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmKHBvcyA+IHBhci5jaGlsZHJlbi5sZW5ndGgpIHsgcG9zID0gcGFyLmNoaWxkcmVuLmxlbmd0aDsgfVxuXHRcdFx0aWYoIW5vZGUuaWQpIHsgbm9kZS5pZCA9IHRydWU7IH1cblx0XHRcdGlmKCF0aGlzLmNoZWNrKFwiY3JlYXRlX25vZGVcIiwgbm9kZSwgcGFyLCBwb3MpKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYobm9kZS5pZCA9PT0gdHJ1ZSkgeyBkZWxldGUgbm9kZS5pZDsgfVxuXHRcdFx0bm9kZSA9IHRoaXMuX3BhcnNlX21vZGVsX2Zyb21fanNvbihub2RlLCBwYXIuaWQsIHBhci5wYXJlbnRzLmNvbmNhdCgpKTtcblx0XHRcdGlmKCFub2RlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShub2RlKTtcblx0XHRcdGRwYyA9IFtdO1xuXHRcdFx0ZHBjLnB1c2gobm9kZSk7XG5cdFx0XHRkcGMgPSBkcGMuY29uY2F0KHRtcC5jaGlsZHJlbl9kKTtcblx0XHRcdHRoaXMudHJpZ2dlcignbW9kZWwnLCB7IFwibm9kZXNcIiA6IGRwYywgXCJwYXJlbnRcIiA6IHBhci5pZCB9KTtcblxuXHRcdFx0cGFyLmNoaWxkcmVuX2QgPSBwYXIuY2hpbGRyZW5fZC5jb25jYXQoZHBjKTtcblx0XHRcdGZvcihpID0gMCwgaiA9IHBhci5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW3Bhci5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kID0gdGhpcy5fbW9kZWwuZGF0YVtwYXIucGFyZW50c1tpXV0uY2hpbGRyZW5fZC5jb25jYXQoZHBjKTtcblx0XHRcdH1cblx0XHRcdG5vZGUgPSB0bXA7XG5cdFx0XHR0bXAgPSBbXTtcblx0XHRcdGZvcihpID0gMCwgaiA9IHBhci5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0dG1wW2kgPj0gcG9zID8gaSsxIDogaV0gPSBwYXIuY2hpbGRyZW5baV07XG5cdFx0XHR9XG5cdFx0XHR0bXBbcG9zXSA9IG5vZGUuaWQ7XG5cdFx0XHRwYXIuY2hpbGRyZW4gPSB0bXA7XG5cblx0XHRcdHRoaXMucmVkcmF3X25vZGUocGFyLCB0cnVlKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIGNyZWF0ZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY3JlYXRlX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmVudCB0aGUgcGFyZW50J3MgSURcblx0XHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiB0aGUgcG9zaXRpb24gb2YgdGhlIG5ldyBub2RlIGFtb25nIHRoZSBwYXJlbnQncyBjaGlsZHJlblxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NyZWF0ZV9ub2RlJywgeyBcIm5vZGVcIiA6IHRoaXMuZ2V0X25vZGUobm9kZSksIFwicGFyZW50XCIgOiBwYXIuaWQsIFwicG9zaXRpb25cIiA6IHBvcyB9KTtcblx0XHRcdGlmKGNhbGxiYWNrKSB7IGNhbGxiYWNrLmNhbGwodGhpcywgdGhpcy5nZXRfbm9kZShub2RlKSk7IH1cblx0XHRcdHJldHVybiBub2RlLmlkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc2V0IHRoZSB0ZXh0IHZhbHVlIG9mIGEgbm9kZVxuXHRcdCAqIEBuYW1lIHJlbmFtZV9ub2RlKG9iaiwgdmFsKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGUsIHlvdSBjYW4gcGFzcyBhbiBhcnJheSB0byByZW5hbWUgbXVsdGlwbGUgbm9kZXMgdG8gdGhlIHNhbWUgbmFtZVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gdmFsIHRoZSBuZXcgdGV4dCB2YWx1ZVxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICogQHRyaWdnZXIgcmVuYW1lX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0cmVuYW1lX25vZGUgOiBmdW5jdGlvbiAob2JqLCB2YWwpIHtcblx0XHRcdHZhciB0MSwgdDIsIG9sZDtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLnJlbmFtZV9ub2RlKG9ialt0MV0sIHZhbCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdG9sZCA9IG9iai50ZXh0O1xuXHRcdFx0aWYoIXRoaXMuY2hlY2soXCJyZW5hbWVfbm9kZVwiLCBvYmosIHRoaXMuZ2V0X3BhcmVudChvYmopLCB2YWwpKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zZXRfdGV4dChvYmosIHZhbCk7IC8vIC5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgcmVuYW1lZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSByZW5hbWVfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dCB0aGUgbmV3IHZhbHVlXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gb2xkIHRoZSBvbGQgdmFsdWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdyZW5hbWVfbm9kZScsIHsgXCJub2RlXCIgOiBvYmosIFwidGV4dFwiIDogdmFsLCBcIm9sZFwiIDogb2xkIH0pO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZW1vdmUgYSBub2RlXG5cdFx0ICogQG5hbWUgZGVsZXRlX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGUsIHlvdSBjYW4gcGFzcyBhbiBhcnJheSB0byBkZWxldGUgbXVsdGlwbGUgbm9kZXNcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqIEB0cmlnZ2VyIGRlbGV0ZV9ub2RlLmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKi9cblx0XHRkZWxldGVfbm9kZSA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdHZhciB0MSwgdDIsIHBhciwgcG9zLCB0bXAsIGksIGosIGssIGwsIGMsIHRvcCwgbGZ0O1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuZGVsZXRlX25vZGUob2JqW3QxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHBhciA9IHRoaXMuZ2V0X25vZGUob2JqLnBhcmVudCk7XG5cdFx0XHRwb3MgPSAkLmluQXJyYXkob2JqLmlkLCBwYXIuY2hpbGRyZW4pO1xuXHRcdFx0YyA9IGZhbHNlO1xuXHRcdFx0aWYoIXRoaXMuY2hlY2soXCJkZWxldGVfbm9kZVwiLCBvYmosIHBhciwgcG9zKSkge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKHBvcyAhPT0gLTEpIHtcblx0XHRcdFx0cGFyLmNoaWxkcmVuID0gJC52YWthdGEuYXJyYXlfcmVtb3ZlKHBhci5jaGlsZHJlbiwgcG9zKTtcblx0XHRcdH1cblx0XHRcdHRtcCA9IG9iai5jaGlsZHJlbl9kLmNvbmNhdChbXSk7XG5cdFx0XHR0bXAucHVzaChvYmouaWQpO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbb2JqLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QgPSAkLnZha2F0YS5hcnJheV9maWx0ZXIodGhpcy5fbW9kZWwuZGF0YVtvYmoucGFyZW50c1tpXV0uY2hpbGRyZW5fZCwgZnVuY3Rpb24gKHYpIHtcblx0XHRcdFx0XHRyZXR1cm4gJC5pbkFycmF5KHYsIHRtcCkgPT09IC0xO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGZvcihrID0gMCwgbCA9IHRtcC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVt0bXBba11dLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdFx0YyA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChjKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCA9ICQudmFrYXRhLmFycmF5X2ZpbHRlcih0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsIGZ1bmN0aW9uICh2KSB7XG5cdFx0XHRcdFx0cmV0dXJuICQuaW5BcnJheSh2LCB0bXApID09PSAtMTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyBkZWxldGVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGRlbGV0ZV9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnQgdGhlIHBhcmVudCdzIElEXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignZGVsZXRlX25vZGUnLCB7IFwibm9kZVwiIDogb2JqLCBcInBhcmVudFwiIDogcGFyLmlkIH0pO1xuXHRcdFx0aWYoYykge1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ2RlbGV0ZV9ub2RlJywgJ25vZGUnIDogb2JqLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAncGFyZW50JyA6IHBhci5pZCB9KTtcblx0XHRcdH1cblx0XHRcdGZvcihrID0gMCwgbCA9IHRtcC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0ZGVsZXRlIHRoaXMuX21vZGVsLmRhdGFbdG1wW2tdXTtcblx0XHRcdH1cblx0XHRcdGlmKCQuaW5BcnJheSh0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCwgdG1wKSAhPT0gLTEpIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgPSBudWxsO1xuXHRcdFx0XHR0b3AgPSB0aGlzLmVsZW1lbnRbMF0uc2Nyb2xsVG9wO1xuXHRcdFx0XHRsZnQgPSB0aGlzLmVsZW1lbnRbMF0uc2Nyb2xsTGVmdDtcblx0XHRcdFx0aWYocGFyLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF0uY2hpbGRyZW5bMF0pIHtcblx0XHRcdFx0XHRcdHRoaXMuZ2V0X25vZGUodGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XS5jaGlsZHJlblswXSwgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5nZXRfbm9kZShwYXIsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5lbGVtZW50WzBdLnNjcm9sbFRvcCAgPSB0b3A7XG5cdFx0XHRcdHRoaXMuZWxlbWVudFswXS5zY3JvbGxMZWZ0ID0gbGZ0O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5yZWRyYXdfbm9kZShwYXIsIHRydWUpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVjayBpZiBhbiBvcGVyYXRpb24gaXMgcHJlbWl0dGVkIG9uIHRoZSB0cmVlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBjaGVjayhjaGssIG9iaiwgcGFyLCBwb3MpXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBjaGsgdGhlIG9wZXJhdGlvbiB0byBjaGVjaywgY2FuIGJlIFwiY3JlYXRlX25vZGVcIiwgXCJyZW5hbWVfbm9kZVwiLCBcImRlbGV0ZV9ub2RlXCIsIFwiY29weV9ub2RlXCIgb3IgXCJtb3ZlX25vZGVcIlxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gcGFyIHRoZSBwYXJlbnRcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gcG9zIHRoZSBwb3NpdGlvbiB0byBpbnNlcnQgYXQsIG9yIGlmIFwicmVuYW1lX25vZGVcIiAtIHRoZSBuZXcgbmFtZVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBtb3JlIHNvbWUgdmFyaW91cyBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLCBmb3IgZXhhbXBsZSBpZiBhIFwibW92ZV9ub2RlXCIgb3BlcmF0aW9ucyBpcyB0cmlnZ2VyZWQgYnkgRE5EIHRoaXMgd2lsbCBiZSB0aGUgaG92ZXJlZCBub2RlXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRjaGVjayA6IGZ1bmN0aW9uIChjaGssIG9iaiwgcGFyLCBwb3MsIG1vcmUpIHtcblx0XHRcdG9iaiA9IG9iaiAmJiBvYmouaWQgPyBvYmogOiB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRwYXIgPSBwYXIgJiYgcGFyLmlkID8gcGFyIDogdGhpcy5nZXRfbm9kZShwYXIpO1xuXHRcdFx0dmFyIHRtcCA9IGNoay5tYXRjaCgvXm1vdmVfbm9kZXxjb3B5X25vZGV8Y3JlYXRlX25vZGUkL2kpID8gcGFyIDogb2JqLFxuXHRcdFx0XHRjaGMgPSB0aGlzLnNldHRpbmdzLmNvcmUuY2hlY2tfY2FsbGJhY2s7XG5cdFx0XHRpZihjaGsgPT09IFwibW92ZV9ub2RlXCIgfHwgY2hrID09PSBcImNvcHlfbm9kZVwiKSB7XG5cdFx0XHRcdGlmKCghbW9yZSB8fCAhbW9yZS5pc19tdWx0aSkgJiYgKGNoayA9PT0gXCJtb3ZlX25vZGVcIiAmJiAkLmluQXJyYXkob2JqLmlkLCBwYXIuY2hpbGRyZW4pID09PSBwb3MpKSB7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICdjb3JlJywgJ2lkJyA6ICdjb3JlXzA4JywgJ3JlYXNvbicgOiAnTW92aW5nIG5vZGUgdG8gaXRzIGN1cnJlbnQgcG9zaXRpb24nLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCghbW9yZSB8fCAhbW9yZS5pc19tdWx0aSkgJiYgKG9iai5pZCA9PT0gcGFyLmlkIHx8IChjaGsgPT09IFwibW92ZV9ub2RlXCIgJiYgJC5pbkFycmF5KG9iai5pZCwgcGFyLmNoaWxkcmVuKSA9PT0gcG9zKSB8fCAkLmluQXJyYXkocGFyLmlkLCBvYmouY2hpbGRyZW5fZCkgIT09IC0xKSkge1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAnY29yZScsICdpZCcgOiAnY29yZV8wMScsICdyZWFzb24nIDogJ01vdmluZyBwYXJlbnQgaW5zaWRlIGNoaWxkJywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYodG1wICYmIHRtcC5kYXRhKSB7IHRtcCA9IHRtcC5kYXRhOyB9XG5cdFx0XHRpZih0bXAgJiYgdG1wLmZ1bmN0aW9ucyAmJiAodG1wLmZ1bmN0aW9uc1tjaGtdID09PSBmYWxzZSB8fCB0bXAuZnVuY3Rpb25zW2Noa10gPT09IHRydWUpKSB7XG5cdFx0XHRcdGlmKHRtcC5mdW5jdGlvbnNbY2hrXSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ2NvcmUnLCAnaWQnIDogJ2NvcmVfMDInLCAncmVhc29uJyA6ICdOb2RlIGRhdGEgcHJldmVudHMgZnVuY3Rpb246ICcgKyBjaGssICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdG1wLmZ1bmN0aW9uc1tjaGtdO1xuXHRcdFx0fVxuXHRcdFx0aWYoY2hjID09PSBmYWxzZSB8fCAoJC5pc0Z1bmN0aW9uKGNoYykgJiYgY2hjLmNhbGwodGhpcywgY2hrLCBvYmosIHBhciwgcG9zLCBtb3JlKSA9PT0gZmFsc2UpIHx8IChjaGMgJiYgY2hjW2Noa10gPT09IGZhbHNlKSkge1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ2NvcmUnLCAnaWQnIDogJ2NvcmVfMDMnLCAncmVhc29uJyA6ICdVc2VyIGNvbmZpZyBmb3IgY29yZS5jaGVja19jYWxsYmFjayBwcmV2ZW50cyBmdW5jdGlvbjogJyArIGNoaywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCB0aGUgbGFzdCBlcnJvclxuXHRcdCAqIEBuYW1lIGxhc3RfZXJyb3IoKVxuXHRcdCAqIEByZXR1cm4ge09iamVjdH1cblx0XHQgKi9cblx0XHRsYXN0X2Vycm9yIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogbW92ZSBhIG5vZGUgdG8gYSBuZXcgcGFyZW50XG5cdFx0ICogQG5hbWUgbW92ZV9ub2RlKG9iaiwgcGFyIFssIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBtb3ZlLCBwYXNzIGFuIGFycmF5IHRvIG1vdmUgbXVsdGlwbGUgbm9kZXNcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gcGFyIHRoZSBuZXcgcGFyZW50XG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IHBvcyB0aGUgcG9zaXRpb24gdG8gaW5zZXJ0IGF0IChiZXNpZGVzIGludGVnZXIgdmFsdWVzLCBcImZpcnN0XCIgYW5kIFwibGFzdFwiIGFyZSBzdXBwb3J0ZWQsIGFzIHdlbGwgYXMgXCJiZWZvcmVcIiBhbmQgXCJhZnRlclwiKSwgZGVmYXVsdHMgdG8gaW50ZWdlciBgMGBcblx0XHQgKiBAcGFyYW0gIHtmdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIG9uY2UgdGhlIG1vdmUgaXMgY29tcGxldGVkLCByZWNlaXZlcyAzIGFyZ3VtZW50cyAtIHRoZSBub2RlLCB0aGUgbmV3IHBhcmVudCBhbmQgdGhlIHBvc2l0aW9uXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gaXNfbG9hZGVkIGludGVybmFsIHBhcmFtZXRlciBpbmRpY2F0aW5nIGlmIHRoZSBwYXJlbnQgbm9kZSBoYXMgYmVlbiBsb2FkZWRcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBza2lwX3JlZHJhdyBpbnRlcm5hbCBwYXJhbWV0ZXIgaW5kaWNhdGluZyBpZiB0aGUgdHJlZSBzaG91bGQgYmUgcmVkcmF3blxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGluc3RhbmNlIGludGVybmFsIHBhcmFtZXRlciBpbmRpY2F0aW5nIGlmIHRoZSBub2RlIGNvbWVzIGZyb20gYW5vdGhlciBpbnN0YW5jZVxuXHRcdCAqIEB0cmlnZ2VyIG1vdmVfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRtb3ZlX25vZGUgOiBmdW5jdGlvbiAob2JqLCBwYXIsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCwgc2tpcF9yZWRyYXcsIG9yaWdpbikge1xuXHRcdFx0dmFyIHQxLCB0Miwgb2xkX3Bhciwgb2xkX3BvcywgbmV3X3Bhciwgb2xkX2lucywgaXNfbXVsdGksIGRwYywgdG1wLCBpLCBqLCBrLCBsLCBwO1xuXG5cdFx0XHRwYXIgPSB0aGlzLmdldF9ub2RlKHBhcik7XG5cdFx0XHRwb3MgPSBwb3MgPT09IHVuZGVmaW5lZCA/IDAgOiBwb3M7XG5cdFx0XHRpZighcGFyKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYoIXBvcy50b1N0cmluZygpLm1hdGNoKC9eKGJlZm9yZXxhZnRlcikkLykgJiYgIWlzX2xvYWRlZCAmJiAhdGhpcy5pc19sb2FkZWQocGFyKSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX25vZGUocGFyLCBmdW5jdGlvbiAoKSB7IHRoaXMubW92ZV9ub2RlKG9iaiwgcGFyLCBwb3MsIGNhbGxiYWNrLCB0cnVlLCBmYWxzZSwgb3JpZ2luKTsgfSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdGlmKG9iai5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRvYmogPSBvYmpbMF07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Ly9vYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHRcdGlmKCh0bXAgPSB0aGlzLm1vdmVfbm9kZShvYmpbdDFdLCBwYXIsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCwgZmFsc2UsIG9yaWdpbikpKSB7XG5cdFx0XHRcdFx0XHRcdHBhciA9IHRtcDtcblx0XHRcdFx0XHRcdFx0cG9zID0gXCJhZnRlclwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRvYmogPSBvYmogJiYgb2JqLmlkID8gb2JqIDogdGhpcy5nZXRfbm9kZShvYmopO1xuXG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdFx0b2xkX3BhciA9IChvYmoucGFyZW50IHx8ICQuanN0cmVlLnJvb3QpLnRvU3RyaW5nKCk7XG5cdFx0XHRuZXdfcGFyID0gKCFwb3MudG9TdHJpbmcoKS5tYXRjaCgvXihiZWZvcmV8YWZ0ZXIpJC8pIHx8IHBhci5pZCA9PT0gJC5qc3RyZWUucm9vdCkgPyBwYXIgOiB0aGlzLmdldF9ub2RlKHBhci5wYXJlbnQpO1xuXHRcdFx0b2xkX2lucyA9IG9yaWdpbiA/IG9yaWdpbiA6ICh0aGlzLl9tb2RlbC5kYXRhW29iai5pZF0gPyB0aGlzIDogJC5qc3RyZWUucmVmZXJlbmNlKG9iai5pZCkpO1xuXHRcdFx0aXNfbXVsdGkgPSAhb2xkX2lucyB8fCAhb2xkX2lucy5faWQgfHwgKHRoaXMuX2lkICE9PSBvbGRfaW5zLl9pZCk7XG5cdFx0XHRvbGRfcG9zID0gb2xkX2lucyAmJiBvbGRfaW5zLl9pZCAmJiBvbGRfcGFyICYmIG9sZF9pbnMuX21vZGVsLmRhdGFbb2xkX3Bhcl0gJiYgb2xkX2lucy5fbW9kZWwuZGF0YVtvbGRfcGFyXS5jaGlsZHJlbiA/ICQuaW5BcnJheShvYmouaWQsIG9sZF9pbnMuX21vZGVsLmRhdGFbb2xkX3Bhcl0uY2hpbGRyZW4pIDogLTE7XG5cdFx0XHRpZihvbGRfaW5zICYmIG9sZF9pbnMuX2lkKSB7XG5cdFx0XHRcdG9iaiA9IG9sZF9pbnMuX21vZGVsLmRhdGFbb2JqLmlkXTtcblx0XHRcdH1cblxuXHRcdFx0aWYoaXNfbXVsdGkpIHtcblx0XHRcdFx0aWYoKHRtcCA9IHRoaXMuY29weV9ub2RlKG9iaiwgcGFyLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQsIGZhbHNlLCBvcmlnaW4pKSkge1xuXHRcdFx0XHRcdGlmKG9sZF9pbnMpIHsgb2xkX2lucy5kZWxldGVfbm9kZShvYmopOyB9XG5cdFx0XHRcdFx0cmV0dXJuIHRtcDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQvL3ZhciBtID0gdGhpcy5fbW9kZWwuZGF0YTtcblx0XHRcdGlmKHBhci5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRpZihwb3MgPT09IFwiYmVmb3JlXCIpIHsgcG9zID0gXCJmaXJzdFwiOyB9XG5cdFx0XHRcdGlmKHBvcyA9PT0gXCJhZnRlclwiKSB7IHBvcyA9IFwibGFzdFwiOyB9XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2gocG9zKSB7XG5cdFx0XHRcdGNhc2UgXCJiZWZvcmVcIjpcblx0XHRcdFx0XHRwb3MgPSAkLmluQXJyYXkocGFyLmlkLCBuZXdfcGFyLmNoaWxkcmVuKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImFmdGVyXCIgOlxuXHRcdFx0XHRcdHBvcyA9ICQuaW5BcnJheShwYXIuaWQsIG5ld19wYXIuY2hpbGRyZW4pICsgMTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImluc2lkZVwiOlxuXHRcdFx0XHRjYXNlIFwiZmlyc3RcIjpcblx0XHRcdFx0XHRwb3MgPSAwO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwibGFzdFwiOlxuXHRcdFx0XHRcdHBvcyA9IG5ld19wYXIuY2hpbGRyZW4ubGVuZ3RoO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGlmKCFwb3MpIHsgcG9zID0gMDsgfVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYocG9zID4gbmV3X3Bhci5jaGlsZHJlbi5sZW5ndGgpIHsgcG9zID0gbmV3X3Bhci5jaGlsZHJlbi5sZW5ndGg7IH1cblx0XHRcdGlmKCF0aGlzLmNoZWNrKFwibW92ZV9ub2RlXCIsIG9iaiwgbmV3X3BhciwgcG9zLCB7ICdjb3JlJyA6IHRydWUsICdvcmlnaW4nIDogb3JpZ2luLCAnaXNfbXVsdGknIDogKG9sZF9pbnMgJiYgb2xkX2lucy5faWQgJiYgb2xkX2lucy5faWQgIT09IHRoaXMuX2lkKSwgJ2lzX2ZvcmVpZ24nIDogKCFvbGRfaW5zIHx8ICFvbGRfaW5zLl9pZCkgfSkpIHtcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZihvYmoucGFyZW50ID09PSBuZXdfcGFyLmlkKSB7XG5cdFx0XHRcdGRwYyA9IG5ld19wYXIuY2hpbGRyZW4uY29uY2F0KCk7XG5cdFx0XHRcdHRtcCA9ICQuaW5BcnJheShvYmouaWQsIGRwYyk7XG5cdFx0XHRcdGlmKHRtcCAhPT0gLTEpIHtcblx0XHRcdFx0XHRkcGMgPSAkLnZha2F0YS5hcnJheV9yZW1vdmUoZHBjLCB0bXApO1xuXHRcdFx0XHRcdGlmKHBvcyA+IHRtcCkgeyBwb3MtLTsgfVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRtcCA9IFtdO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkcGMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0dG1wW2kgPj0gcG9zID8gaSsxIDogaV0gPSBkcGNbaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0dG1wW3Bvc10gPSBvYmouaWQ7XG5cdFx0XHRcdG5ld19wYXIuY2hpbGRyZW4gPSB0bXA7XG5cdFx0XHRcdHRoaXMuX25vZGVfY2hhbmdlZChuZXdfcGFyLmlkKTtcblx0XHRcdFx0dGhpcy5yZWRyYXcobmV3X3Bhci5pZCA9PT0gJC5qc3RyZWUucm9vdCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gY2xlYW4gb2xkIHBhcmVudCBhbmQgdXBcblx0XHRcdFx0dG1wID0gb2JqLmNoaWxkcmVuX2QuY29uY2F0KCk7XG5cdFx0XHRcdHRtcC5wdXNoKG9iai5pZCk7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGRwYyA9IFtdO1xuXHRcdFx0XHRcdHAgPSBvbGRfaW5zLl9tb2RlbC5kYXRhW29iai5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kO1xuXHRcdFx0XHRcdGZvcihrID0gMCwgbCA9IHAubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0XHRpZigkLmluQXJyYXkocFtrXSwgdG1wKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0ZHBjLnB1c2gocFtrXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9sZF9pbnMuX21vZGVsLmRhdGFbb2JqLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QgPSBkcGM7XG5cdFx0XHRcdH1cblx0XHRcdFx0b2xkX2lucy5fbW9kZWwuZGF0YVtvbGRfcGFyXS5jaGlsZHJlbiA9ICQudmFrYXRhLmFycmF5X3JlbW92ZV9pdGVtKG9sZF9pbnMuX21vZGVsLmRhdGFbb2xkX3Bhcl0uY2hpbGRyZW4sIG9iai5pZCk7XG5cblx0XHRcdFx0Ly8gaW5zZXJ0IGludG8gbmV3IHBhcmVudCBhbmQgdXBcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gbmV3X3Bhci5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbbmV3X3Bhci5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kID0gdGhpcy5fbW9kZWwuZGF0YVtuZXdfcGFyLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QuY29uY2F0KHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZHBjID0gW107XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG5ld19wYXIuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0ZHBjW2kgPj0gcG9zID8gaSsxIDogaV0gPSBuZXdfcGFyLmNoaWxkcmVuW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRwY1twb3NdID0gb2JqLmlkO1xuXHRcdFx0XHRuZXdfcGFyLmNoaWxkcmVuID0gZHBjO1xuXHRcdFx0XHRuZXdfcGFyLmNoaWxkcmVuX2QucHVzaChvYmouaWQpO1xuXHRcdFx0XHRuZXdfcGFyLmNoaWxkcmVuX2QgPSBuZXdfcGFyLmNoaWxkcmVuX2QuY29uY2F0KG9iai5jaGlsZHJlbl9kKTtcblxuXHRcdFx0XHQvLyB1cGRhdGUgb2JqZWN0XG5cdFx0XHRcdG9iai5wYXJlbnQgPSBuZXdfcGFyLmlkO1xuXHRcdFx0XHR0bXAgPSBuZXdfcGFyLnBhcmVudHMuY29uY2F0KCk7XG5cdFx0XHRcdHRtcC51bnNoaWZ0KG5ld19wYXIuaWQpO1xuXHRcdFx0XHRwID0gb2JqLnBhcmVudHMubGVuZ3RoO1xuXHRcdFx0XHRvYmoucGFyZW50cyA9IHRtcDtcblxuXHRcdFx0XHQvLyB1cGRhdGUgb2JqZWN0IGNoaWxkcmVuXG5cdFx0XHRcdHRtcCA9IHRtcC5jb25jYXQoKTtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVtvYmouY2hpbGRyZW5fZFtpXV0ucGFyZW50cyA9IHRoaXMuX21vZGVsLmRhdGFbb2JqLmNoaWxkcmVuX2RbaV1dLnBhcmVudHMuc2xpY2UoMCxwKi0xKTtcblx0XHRcdFx0XHRBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLl9tb2RlbC5kYXRhW29iai5jaGlsZHJlbl9kW2ldXS5wYXJlbnRzLCB0bXApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYob2xkX3BhciA9PT0gJC5qc3RyZWUucm9vdCB8fCBuZXdfcGFyLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0dGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCF0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdykge1xuXHRcdFx0XHRcdHRoaXMuX25vZGVfY2hhbmdlZChvbGRfcGFyKTtcblx0XHRcdFx0XHR0aGlzLl9ub2RlX2NoYW5nZWQobmV3X3Bhci5pZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIXNraXBfcmVkcmF3KSB7XG5cdFx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoY2FsbGJhY2spIHsgY2FsbGJhY2suY2FsbCh0aGlzLCBvYmosIG5ld19wYXIsIHBvcyk7IH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIG1vdmVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIG1vdmVfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyZW50IHRoZSBwYXJlbnQncyBJRFxuXHRcdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIHRoZSBwb3NpdGlvbiBvZiB0aGUgbm9kZSBhbW9uZyB0aGUgcGFyZW50J3MgY2hpbGRyZW5cblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBvbGRfcGFyZW50IHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge051bWJlcn0gb2xkX3Bvc2l0aW9uIHRoZSBvbGQgcG9zaXRpb24gb2YgdGhlIG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNfbXVsdGkgZG8gdGhlIG5vZGUgYW5kIG5ldyBwYXJlbnQgYmVsb25nIHRvIGRpZmZlcmVudCBpbnN0YW5jZXNcblx0XHRcdCAqIEBwYXJhbSB7anNUcmVlfSBvbGRfaW5zdGFuY2UgdGhlIGluc3RhbmNlIHRoZSBub2RlIGNhbWUgZnJvbVxuXHRcdFx0ICogQHBhcmFtIHtqc1RyZWV9IG5ld19pbnN0YW5jZSB0aGUgaW5zdGFuY2Ugb2YgdGhlIG5ldyBwYXJlbnRcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdtb3ZlX25vZGUnLCB7IFwibm9kZVwiIDogb2JqLCBcInBhcmVudFwiIDogbmV3X3Bhci5pZCwgXCJwb3NpdGlvblwiIDogcG9zLCBcIm9sZF9wYXJlbnRcIiA6IG9sZF9wYXIsIFwib2xkX3Bvc2l0aW9uXCIgOiBvbGRfcG9zLCAnaXNfbXVsdGknIDogKG9sZF9pbnMgJiYgb2xkX2lucy5faWQgJiYgb2xkX2lucy5faWQgIT09IHRoaXMuX2lkKSwgJ2lzX2ZvcmVpZ24nIDogKCFvbGRfaW5zIHx8ICFvbGRfaW5zLl9pZCksICdvbGRfaW5zdGFuY2UnIDogb2xkX2lucywgJ25ld19pbnN0YW5jZScgOiB0aGlzIH0pO1xuXHRcdFx0cmV0dXJuIG9iai5pZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNvcHkgYSBub2RlIHRvIGEgbmV3IHBhcmVudFxuXHRcdCAqIEBuYW1lIGNvcHlfbm9kZShvYmosIHBhciBbLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWRdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGUgdG8gY29weSwgcGFzcyBhbiBhcnJheSB0byBjb3B5IG11bHRpcGxlIG5vZGVzXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IHBhciB0aGUgbmV3IHBhcmVudFxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBwb3MgdGhlIHBvc2l0aW9uIHRvIGluc2VydCBhdCAoYmVzaWRlcyBpbnRlZ2VyIHZhbHVlcywgXCJmaXJzdFwiIGFuZCBcImxhc3RcIiBhcmUgc3VwcG9ydGVkLCBhcyB3ZWxsIGFzIFwiYmVmb3JlXCIgYW5kIFwiYWZ0ZXJcIiksIGRlZmF1bHRzIHRvIGludGVnZXIgYDBgXG5cdFx0ICogQHBhcmFtICB7ZnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCBvbmNlIHRoZSBtb3ZlIGlzIGNvbXBsZXRlZCwgcmVjZWl2ZXMgMyBhcmd1bWVudHMgLSB0aGUgbm9kZSwgdGhlIG5ldyBwYXJlbnQgYW5kIHRoZSBwb3NpdGlvblxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGlzX2xvYWRlZCBpbnRlcm5hbCBwYXJhbWV0ZXIgaW5kaWNhdGluZyBpZiB0aGUgcGFyZW50IG5vZGUgaGFzIGJlZW4gbG9hZGVkXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gc2tpcF9yZWRyYXcgaW50ZXJuYWwgcGFyYW1ldGVyIGluZGljYXRpbmcgaWYgdGhlIHRyZWUgc2hvdWxkIGJlIHJlZHJhd25cblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBpbnN0YW5jZSBpbnRlcm5hbCBwYXJhbWV0ZXIgaW5kaWNhdGluZyBpZiB0aGUgbm9kZSBjb21lcyBmcm9tIGFub3RoZXIgaW5zdGFuY2Vcblx0XHQgKiBAdHJpZ2dlciBtb2RlbC5qc3RyZWUgY29weV9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGNvcHlfbm9kZSA6IGZ1bmN0aW9uIChvYmosIHBhciwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkLCBza2lwX3JlZHJhdywgb3JpZ2luKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBkcGMsIHRtcCwgaSwgaiwgbm9kZSwgb2xkX3BhciwgbmV3X3Bhciwgb2xkX2lucywgaXNfbXVsdGk7XG5cblx0XHRcdHBhciA9IHRoaXMuZ2V0X25vZGUocGFyKTtcblx0XHRcdHBvcyA9IHBvcyA9PT0gdW5kZWZpbmVkID8gMCA6IHBvcztcblx0XHRcdGlmKCFwYXIpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZighcG9zLnRvU3RyaW5nKCkubWF0Y2goL14oYmVmb3JlfGFmdGVyKSQvKSAmJiAhaXNfbG9hZGVkICYmICF0aGlzLmlzX2xvYWRlZChwYXIpKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmxvYWRfbm9kZShwYXIsIGZ1bmN0aW9uICgpIHsgdGhpcy5jb3B5X25vZGUob2JqLCBwYXIsIHBvcywgY2FsbGJhY2ssIHRydWUsIGZhbHNlLCBvcmlnaW4pOyB9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0aWYob2JqLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdG9iaiA9IG9ialswXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvL29iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdFx0aWYoKHRtcCA9IHRoaXMuY29weV9ub2RlKG9ialt0MV0sIHBhciwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkLCB0cnVlLCBvcmlnaW4pKSkge1xuXHRcdFx0XHRcdFx0XHRwYXIgPSB0bXA7XG5cdFx0XHRcdFx0XHRcdHBvcyA9IFwiYWZ0ZXJcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0b2JqID0gb2JqICYmIG9iai5pZCA/IG9iaiA6IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0XHRvbGRfcGFyID0gKG9iai5wYXJlbnQgfHwgJC5qc3RyZWUucm9vdCkudG9TdHJpbmcoKTtcblx0XHRcdG5ld19wYXIgPSAoIXBvcy50b1N0cmluZygpLm1hdGNoKC9eKGJlZm9yZXxhZnRlcikkLykgfHwgcGFyLmlkID09PSAkLmpzdHJlZS5yb290KSA/IHBhciA6IHRoaXMuZ2V0X25vZGUocGFyLnBhcmVudCk7XG5cdFx0XHRvbGRfaW5zID0gb3JpZ2luID8gb3JpZ2luIDogKHRoaXMuX21vZGVsLmRhdGFbb2JqLmlkXSA/IHRoaXMgOiAkLmpzdHJlZS5yZWZlcmVuY2Uob2JqLmlkKSk7XG5cdFx0XHRpc19tdWx0aSA9ICFvbGRfaW5zIHx8ICFvbGRfaW5zLl9pZCB8fCAodGhpcy5faWQgIT09IG9sZF9pbnMuX2lkKTtcblxuXHRcdFx0aWYob2xkX2lucyAmJiBvbGRfaW5zLl9pZCkge1xuXHRcdFx0XHRvYmogPSBvbGRfaW5zLl9tb2RlbC5kYXRhW29iai5pZF07XG5cdFx0XHR9XG5cblx0XHRcdGlmKHBhci5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRpZihwb3MgPT09IFwiYmVmb3JlXCIpIHsgcG9zID0gXCJmaXJzdFwiOyB9XG5cdFx0XHRcdGlmKHBvcyA9PT0gXCJhZnRlclwiKSB7IHBvcyA9IFwibGFzdFwiOyB9XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2gocG9zKSB7XG5cdFx0XHRcdGNhc2UgXCJiZWZvcmVcIjpcblx0XHRcdFx0XHRwb3MgPSAkLmluQXJyYXkocGFyLmlkLCBuZXdfcGFyLmNoaWxkcmVuKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImFmdGVyXCIgOlxuXHRcdFx0XHRcdHBvcyA9ICQuaW5BcnJheShwYXIuaWQsIG5ld19wYXIuY2hpbGRyZW4pICsgMTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImluc2lkZVwiOlxuXHRcdFx0XHRjYXNlIFwiZmlyc3RcIjpcblx0XHRcdFx0XHRwb3MgPSAwO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwibGFzdFwiOlxuXHRcdFx0XHRcdHBvcyA9IG5ld19wYXIuY2hpbGRyZW4ubGVuZ3RoO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGlmKCFwb3MpIHsgcG9zID0gMDsgfVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYocG9zID4gbmV3X3Bhci5jaGlsZHJlbi5sZW5ndGgpIHsgcG9zID0gbmV3X3Bhci5jaGlsZHJlbi5sZW5ndGg7IH1cblx0XHRcdGlmKCF0aGlzLmNoZWNrKFwiY29weV9ub2RlXCIsIG9iaiwgbmV3X3BhciwgcG9zLCB7ICdjb3JlJyA6IHRydWUsICdvcmlnaW4nIDogb3JpZ2luLCAnaXNfbXVsdGknIDogKG9sZF9pbnMgJiYgb2xkX2lucy5faWQgJiYgb2xkX2lucy5faWQgIT09IHRoaXMuX2lkKSwgJ2lzX2ZvcmVpZ24nIDogKCFvbGRfaW5zIHx8ICFvbGRfaW5zLl9pZCkgfSkpIHtcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRub2RlID0gb2xkX2lucyA/IG9sZF9pbnMuZ2V0X2pzb24ob2JqLCB7IG5vX2lkIDogdHJ1ZSwgbm9fZGF0YSA6IHRydWUsIG5vX3N0YXRlIDogdHJ1ZSB9KSA6IG9iajtcblx0XHRcdGlmKCFub2RlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYobm9kZS5pZCA9PT0gdHJ1ZSkgeyBkZWxldGUgbm9kZS5pZDsgfVxuXHRcdFx0bm9kZSA9IHRoaXMuX3BhcnNlX21vZGVsX2Zyb21fanNvbihub2RlLCBuZXdfcGFyLmlkLCBuZXdfcGFyLnBhcmVudHMuY29uY2F0KCkpO1xuXHRcdFx0aWYoIW5vZGUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKG5vZGUpO1xuXHRcdFx0aWYob2JqICYmIG9iai5zdGF0ZSAmJiBvYmouc3RhdGUubG9hZGVkID09PSBmYWxzZSkgeyB0bXAuc3RhdGUubG9hZGVkID0gZmFsc2U7IH1cblx0XHRcdGRwYyA9IFtdO1xuXHRcdFx0ZHBjLnB1c2gobm9kZSk7XG5cdFx0XHRkcGMgPSBkcGMuY29uY2F0KHRtcC5jaGlsZHJlbl9kKTtcblx0XHRcdHRoaXMudHJpZ2dlcignbW9kZWwnLCB7IFwibm9kZXNcIiA6IGRwYywgXCJwYXJlbnRcIiA6IG5ld19wYXIuaWQgfSk7XG5cblx0XHRcdC8vIGluc2VydCBpbnRvIG5ldyBwYXJlbnQgYW5kIHVwXG5cdFx0XHRmb3IoaSA9IDAsIGogPSBuZXdfcGFyLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbbmV3X3Bhci5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kID0gdGhpcy5fbW9kZWwuZGF0YVtuZXdfcGFyLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QuY29uY2F0KGRwYyk7XG5cdFx0XHR9XG5cdFx0XHRkcGMgPSBbXTtcblx0XHRcdGZvcihpID0gMCwgaiA9IG5ld19wYXIuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGRwY1tpID49IHBvcyA/IGkrMSA6IGldID0gbmV3X3Bhci5jaGlsZHJlbltpXTtcblx0XHRcdH1cblx0XHRcdGRwY1twb3NdID0gdG1wLmlkO1xuXHRcdFx0bmV3X3Bhci5jaGlsZHJlbiA9IGRwYztcblx0XHRcdG5ld19wYXIuY2hpbGRyZW5fZC5wdXNoKHRtcC5pZCk7XG5cdFx0XHRuZXdfcGFyLmNoaWxkcmVuX2QgPSBuZXdfcGFyLmNoaWxkcmVuX2QuY29uY2F0KHRtcC5jaGlsZHJlbl9kKTtcblxuXHRcdFx0aWYobmV3X3Bhci5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHR0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZighdGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcpIHtcblx0XHRcdFx0dGhpcy5fbm9kZV9jaGFuZ2VkKG5ld19wYXIuaWQpO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXNraXBfcmVkcmF3KSB7XG5cdFx0XHRcdHRoaXMucmVkcmF3KG5ld19wYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpO1xuXHRcdFx0fVxuXHRcdFx0aWYoY2FsbGJhY2spIHsgY2FsbGJhY2suY2FsbCh0aGlzLCB0bXAsIG5ld19wYXIsIHBvcyk7IH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIGNvcGllZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjb3B5X25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgY29waWVkIG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbCB0aGUgb3JpZ2luYWwgbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmVudCB0aGUgcGFyZW50J3MgSURcblx0XHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiB0aGUgcG9zaXRpb24gb2YgdGhlIG5vZGUgYW1vbmcgdGhlIHBhcmVudCdzIGNoaWxkcmVuXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gb2xkX3BhcmVudCB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtOdW1iZXJ9IG9sZF9wb3NpdGlvbiB0aGUgcG9zaXRpb24gb2YgdGhlIG9yaWdpbmFsIG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNfbXVsdGkgZG8gdGhlIG5vZGUgYW5kIG5ldyBwYXJlbnQgYmVsb25nIHRvIGRpZmZlcmVudCBpbnN0YW5jZXNcblx0XHRcdCAqIEBwYXJhbSB7anNUcmVlfSBvbGRfaW5zdGFuY2UgdGhlIGluc3RhbmNlIHRoZSBub2RlIGNhbWUgZnJvbVxuXHRcdFx0ICogQHBhcmFtIHtqc1RyZWV9IG5ld19pbnN0YW5jZSB0aGUgaW5zdGFuY2Ugb2YgdGhlIG5ldyBwYXJlbnRcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjb3B5X25vZGUnLCB7IFwibm9kZVwiIDogdG1wLCBcIm9yaWdpbmFsXCIgOiBvYmosIFwicGFyZW50XCIgOiBuZXdfcGFyLmlkLCBcInBvc2l0aW9uXCIgOiBwb3MsIFwib2xkX3BhcmVudFwiIDogb2xkX3BhciwgXCJvbGRfcG9zaXRpb25cIiA6IG9sZF9pbnMgJiYgb2xkX2lucy5faWQgJiYgb2xkX3BhciAmJiBvbGRfaW5zLl9tb2RlbC5kYXRhW29sZF9wYXJdICYmIG9sZF9pbnMuX21vZGVsLmRhdGFbb2xkX3Bhcl0uY2hpbGRyZW4gPyAkLmluQXJyYXkob2JqLmlkLCBvbGRfaW5zLl9tb2RlbC5kYXRhW29sZF9wYXJdLmNoaWxkcmVuKSA6IC0xLCdpc19tdWx0aScgOiAob2xkX2lucyAmJiBvbGRfaW5zLl9pZCAmJiBvbGRfaW5zLl9pZCAhPT0gdGhpcy5faWQpLCAnaXNfZm9yZWlnbicgOiAoIW9sZF9pbnMgfHwgIW9sZF9pbnMuX2lkKSwgJ29sZF9pbnN0YW5jZScgOiBvbGRfaW5zLCAnbmV3X2luc3RhbmNlJyA6IHRoaXMgfSk7XG5cdFx0XHRyZXR1cm4gdG1wLmlkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY3V0IGEgbm9kZSAoYSBsYXRlciBjYWxsIHRvIGBwYXN0ZShvYmopYCB3b3VsZCBtb3ZlIHRoZSBub2RlKVxuXHRcdCAqIEBuYW1lIGN1dChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiBtdWx0aXBsZSBvYmplY3RzIGNhbiBiZSBwYXNzZWQgdXNpbmcgYW4gYXJyYXlcblx0XHQgKiBAdHJpZ2dlciBjdXQuanN0cmVlXG5cdFx0ICovXG5cdFx0Y3V0IDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0aWYoIW9iaikgeyBvYmogPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuY29uY2F0KCk7IH1cblx0XHRcdGlmKCEkLmlzQXJyYXkob2JqKSkgeyBvYmogPSBbb2JqXTsgfVxuXHRcdFx0aWYoIW9iai5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR2YXIgdG1wID0gW10sIG8sIHQxLCB0Mjtcblx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRvID0gdGhpcy5nZXRfbm9kZShvYmpbdDFdKTtcblx0XHRcdFx0aWYobyAmJiBvLmlkICYmIG8uaWQgIT09ICQuanN0cmVlLnJvb3QpIHsgdG1wLnB1c2gobyk7IH1cblx0XHRcdH1cblx0XHRcdGlmKCF0bXAubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0Y2NwX25vZGUgPSB0bXA7XG5cdFx0XHRjY3BfaW5zdCA9IHRoaXM7XG5cdFx0XHRjY3BfbW9kZSA9ICdtb3ZlX25vZGUnO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBub2RlcyBhcmUgYWRkZWQgdG8gdGhlIGJ1ZmZlciBmb3IgbW92aW5nXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGN1dC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjdXQnLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY29weSBhIG5vZGUgKGEgbGF0ZXIgY2FsbCB0byBgcGFzdGUob2JqKWAgd291bGQgY29weSB0aGUgbm9kZSlcblx0XHQgKiBAbmFtZSBjb3B5KG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIG11bHRpcGxlIG9iamVjdHMgY2FuIGJlIHBhc3NlZCB1c2luZyBhbiBhcnJheVxuXHRcdCAqIEB0cmlnZ2VyIGNvcHkuanN0cmVlXG5cdFx0ICovXG5cdFx0Y29weSA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdGlmKCFvYmopIHsgb2JqID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmNvbmNhdCgpOyB9XG5cdFx0XHRpZighJC5pc0FycmF5KG9iaikpIHsgb2JqID0gW29ial07IH1cblx0XHRcdGlmKCFvYmoubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIHRtcCA9IFtdLCBvLCB0MSwgdDI7XG5cdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0byA9IHRoaXMuZ2V0X25vZGUob2JqW3QxXSk7XG5cdFx0XHRcdGlmKG8gJiYgby5pZCAmJiBvLmlkICE9PSAkLmpzdHJlZS5yb290KSB7IHRtcC5wdXNoKG8pOyB9XG5cdFx0XHR9XG5cdFx0XHRpZighdG1wLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGNjcF9ub2RlID0gdG1wO1xuXHRcdFx0Y2NwX2luc3QgPSB0aGlzO1xuXHRcdFx0Y2NwX21vZGUgPSAnY29weV9ub2RlJztcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gbm9kZXMgYXJlIGFkZGVkIHRvIHRoZSBidWZmZXIgZm9yIGNvcHlpbmdcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY29weS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjb3B5JywgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCB0aGUgY3VycmVudCBidWZmZXIgKGFueSBub2RlcyB0aGF0IGFyZSB3YWl0aW5nIGZvciBhIHBhc3RlIG9wZXJhdGlvbilcblx0XHQgKiBAbmFtZSBnZXRfYnVmZmVyKClcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9IGFuIG9iamVjdCBjb25zaXN0aW5nIG9mIGBtb2RlYCAoXCJjb3B5X25vZGVcIiBvciBcIm1vdmVfbm9kZVwiKSwgYG5vZGVgIChhbiBhcnJheSBvZiBvYmplY3RzKSBhbmQgYGluc3RgICh0aGUgaW5zdGFuY2UpXG5cdFx0ICovXG5cdFx0Z2V0X2J1ZmZlciA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB7ICdtb2RlJyA6IGNjcF9tb2RlLCAnbm9kZScgOiBjY3Bfbm9kZSwgJ2luc3QnIDogY2NwX2luc3QgfTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrIGlmIHRoZXJlIGlzIHNvbWV0aGluZyBpbiB0aGUgYnVmZmVyIHRvIHBhc3RlXG5cdFx0ICogQG5hbWUgY2FuX3Bhc3RlKClcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhbl9wYXN0ZSA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjY3BfbW9kZSAhPT0gZmFsc2UgJiYgY2NwX25vZGUgIT09IGZhbHNlOyAvLyAmJiBjY3BfaW5zdC5fbW9kZWwuZGF0YVtjY3Bfbm9kZV07XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjb3B5IG9yIG1vdmUgdGhlIHByZXZpb3VzbHkgY3V0IG9yIGNvcGllZCBub2RlcyB0byBhIG5ldyBwYXJlbnRcblx0XHQgKiBAbmFtZSBwYXN0ZShvYmogWywgcG9zXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBuZXcgcGFyZW50XG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IHBvcyB0aGUgcG9zaXRpb24gdG8gaW5zZXJ0IGF0IChiZXNpZGVzIGludGVnZXIsIFwiZmlyc3RcIiBhbmQgXCJsYXN0XCIgYXJlIHN1cHBvcnRlZCksIGRlZmF1bHRzIHRvIGludGVnZXIgYDBgXG5cdFx0ICogQHRyaWdnZXIgcGFzdGUuanN0cmVlXG5cdFx0ICovXG5cdFx0cGFzdGUgOiBmdW5jdGlvbiAob2JqLCBwb3MpIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgIWNjcF9tb2RlIHx8ICFjY3BfbW9kZS5tYXRjaCgvXihjb3B5X25vZGV8bW92ZV9ub2RlKSQvKSB8fCAhY2NwX25vZGUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZih0aGlzW2NjcF9tb2RlXShjY3Bfbm9kZSwgb2JqLCBwb3MsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGNjcF9pbnN0KSkge1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gcGFzdGUgaXMgaW52b2tlZFxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgcGFzdGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnQgdGhlIElEIG9mIHRoZSByZWNlaXZpbmcgbm9kZVxuXHRcdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlIHRoZSBub2RlcyBpbiB0aGUgYnVmZmVyXG5cdFx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBtb2RlIHRoZSBwZXJmb3JtZWQgb3BlcmF0aW9uIC0gXCJjb3B5X25vZGVcIiBvciBcIm1vdmVfbm9kZVwiXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3Bhc3RlJywgeyBcInBhcmVudFwiIDogb2JqLmlkLCBcIm5vZGVcIiA6IGNjcF9ub2RlLCBcIm1vZGVcIiA6IGNjcF9tb2RlIH0pO1xuXHRcdFx0fVxuXHRcdFx0Y2NwX25vZGUgPSBmYWxzZTtcblx0XHRcdGNjcF9tb2RlID0gZmFsc2U7XG5cdFx0XHRjY3BfaW5zdCA9IGZhbHNlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2xlYXIgdGhlIGJ1ZmZlciBvZiBwcmV2aW91c2x5IGNvcGllZCBvciBjdXQgbm9kZXNcblx0XHQgKiBAbmFtZSBjbGVhcl9idWZmZXIoKVxuXHRcdCAqIEB0cmlnZ2VyIGNsZWFyX2J1ZmZlci5qc3RyZWVcblx0XHQgKi9cblx0XHRjbGVhcl9idWZmZXIgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjY3Bfbm9kZSA9IGZhbHNlO1xuXHRcdFx0Y2NwX21vZGUgPSBmYWxzZTtcblx0XHRcdGNjcF9pbnN0ID0gZmFsc2U7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIHRoZSBjb3B5IC8gY3V0IGJ1ZmZlciBpcyBjbGVhcmVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGNsZWFyX2J1ZmZlci5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjbGVhcl9idWZmZXInKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHB1dCBhIG5vZGUgaW4gZWRpdCBtb2RlIChpbnB1dCBmaWVsZCB0byByZW5hbWUgdGhlIG5vZGUpXG5cdFx0ICogQG5hbWUgZWRpdChvYmogWywgZGVmYXVsdF90ZXh0LCBjYWxsYmFja10pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gZGVmYXVsdF90ZXh0IHRoZSB0ZXh0IHRvIHBvcHVsYXRlIHRoZSBpbnB1dCB3aXRoIChpZiBvbWl0dGVkIG9yIHNldCB0byBhIG5vbi1zdHJpbmcgdmFsdWUgdGhlIG5vZGUncyB0ZXh0IHZhbHVlIGlzIHVzZWQpXG5cdFx0ICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uY2UgdGhlIHRleHQgYm94IGlzIGJsdXJyZWQsIGl0IGlzIGNhbGxlZCBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSBhbmQgcmVjZWl2ZXMgdGhlIG5vZGUsIGEgc3RhdHVzIHBhcmFtZXRlciAodHJ1ZSBpZiB0aGUgcmVuYW1lIGlzIHN1Y2Nlc3NmdWwsIGZhbHNlIG90aGVyd2lzZSkgYW5kIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSB1c2VyIGNhbmNlbGxlZCB0aGUgZWRpdC4gWW91IGNhbiBhY2Nlc3MgdGhlIG5vZGUncyB0aXRsZSB1c2luZyAudGV4dFxuXHRcdCAqL1xuXHRcdGVkaXQgOiBmdW5jdGlvbiAob2JqLCBkZWZhdWx0X3RleHQsIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgcnRsLCB3LCBhLCBzLCB0LCBoMSwgaDIsIGZuLCB0bXAsIGNhbmNlbCA9IGZhbHNlO1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKCF0aGlzLmNoZWNrKFwiZWRpdFwiLCBvYmosIHRoaXMuZ2V0X3BhcmVudChvYmopKSkge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHRtcCA9IG9iajtcblx0XHRcdGRlZmF1bHRfdGV4dCA9IHR5cGVvZiBkZWZhdWx0X3RleHQgPT09ICdzdHJpbmcnID8gZGVmYXVsdF90ZXh0IDogb2JqLnRleHQ7XG5cdFx0XHR0aGlzLnNldF90ZXh0KG9iaiwgXCJcIik7XG5cdFx0XHRvYmogPSB0aGlzLl9vcGVuX3RvKG9iaik7XG5cdFx0XHR0bXAudGV4dCA9IGRlZmF1bHRfdGV4dDtcblxuXHRcdFx0cnRsID0gdGhpcy5fZGF0YS5jb3JlLnJ0bDtcblx0XHRcdHcgID0gdGhpcy5lbGVtZW50LndpZHRoKCk7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCA9IHRtcC5pZDtcblx0XHRcdGEgID0gb2JqLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7XG5cdFx0XHRzICA9ICQoJzxzcGFuPicpO1xuXHRcdFx0LyohXG5cdFx0XHRvaSA9IG9iai5jaGlsZHJlbihcImk6dmlzaWJsZVwiKSxcblx0XHRcdGFpID0gYS5jaGlsZHJlbihcImk6dmlzaWJsZVwiKSxcblx0XHRcdHcxID0gb2kud2lkdGgoKSAqIG9pLmxlbmd0aCxcblx0XHRcdHcyID0gYWkud2lkdGgoKSAqIGFpLmxlbmd0aCxcblx0XHRcdCovXG5cdFx0XHR0ICA9IGRlZmF1bHRfdGV4dDtcblx0XHRcdGgxID0gJChcIjxcIitcImRpdiAvPlwiLCB7IGNzcyA6IHsgXCJwb3NpdGlvblwiIDogXCJhYnNvbHV0ZVwiLCBcInRvcFwiIDogXCItMjAwcHhcIiwgXCJsZWZ0XCIgOiAocnRsID8gXCIwcHhcIiA6IFwiLTEwMDBweFwiKSwgXCJ2aXNpYmlsaXR5XCIgOiBcImhpZGRlblwiIH0gfSkuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5cdFx0XHRoMiA9ICQoXCI8XCIrXCJpbnB1dCAvPlwiLCB7XG5cdFx0XHRcdFx0XHRcInZhbHVlXCIgOiB0LFxuXHRcdFx0XHRcdFx0XCJjbGFzc1wiIDogXCJqc3RyZWUtcmVuYW1lLWlucHV0XCIsXG5cdFx0XHRcdFx0XHQvLyBcInNpemVcIiA6IHQubGVuZ3RoLFxuXHRcdFx0XHRcdFx0XCJjc3NcIiA6IHtcblx0XHRcdFx0XHRcdFx0XCJwYWRkaW5nXCIgOiBcIjBcIixcblx0XHRcdFx0XHRcdFx0XCJib3JkZXJcIiA6IFwiMXB4IHNvbGlkIHNpbHZlclwiLFxuXHRcdFx0XHRcdFx0XHRcImJveC1zaXppbmdcIiA6IFwiYm9yZGVyLWJveFwiLFxuXHRcdFx0XHRcdFx0XHRcImRpc3BsYXlcIiA6IFwiaW5saW5lLWJsb2NrXCIsXG5cdFx0XHRcdFx0XHRcdFwiaGVpZ2h0XCIgOiAodGhpcy5fZGF0YS5jb3JlLmxpX2hlaWdodCkgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRcdFwibGluZUhlaWdodFwiIDogKHRoaXMuX2RhdGEuY29yZS5saV9oZWlnaHQpICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0XHRcIndpZHRoXCIgOiBcIjE1MHB4XCIgLy8gd2lsbCBiZSBzZXQgYSBiaXQgZnVydGhlciBkb3duXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJibHVyXCIgOiAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0dmFyIGkgPSBzLmNoaWxkcmVuKFwiLmpzdHJlZS1yZW5hbWUtaW5wdXRcIiksXG5cdFx0XHRcdFx0XHRcdFx0diA9IGkudmFsKCksXG5cdFx0XHRcdFx0XHRcdFx0ZiA9IHRoaXMuc2V0dGluZ3MuY29yZS5mb3JjZV90ZXh0LFxuXHRcdFx0XHRcdFx0XHRcdG52O1xuXHRcdFx0XHRcdFx0XHRpZih2ID09PSBcIlwiKSB7IHYgPSB0OyB9XG5cdFx0XHRcdFx0XHRcdGgxLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHRzLnJlcGxhY2VXaXRoKGEpO1xuXHRcdFx0XHRcdFx0XHRzLnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0XHR0ID0gZiA/IHQgOiAkKCc8ZGl2PjwvZGl2PicpLmFwcGVuZCgkLnBhcnNlSFRNTCh0KSkuaHRtbCgpO1xuXHRcdFx0XHRcdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0X3RleHQob2JqLCB0KTtcblx0XHRcdFx0XHRcdFx0bnYgPSAhIXRoaXMucmVuYW1lX25vZGUob2JqLCBmID8gJCgnPGRpdj48L2Rpdj4nKS50ZXh0KHYpLnRleHQoKSA6ICQoJzxkaXY+PC9kaXY+JykuYXBwZW5kKCQucGFyc2VIVE1MKHYpKS5odG1sKCkpO1xuXHRcdFx0XHRcdFx0XHRpZighbnYpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNldF90ZXh0KG9iaiwgdCk7IC8vIG1vdmUgdGhpcyB1cD8gYW5kIGZpeCAjNDgzXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgPSB0bXAuaWQ7XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB0aGlzLmdldF9ub2RlKHRtcC5pZCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYobm9kZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkID0gdG1wLmlkO1xuXHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSwgdGhpcyksIDApO1xuXHRcdFx0XHRcdFx0XHRpZihjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgdG1wLCBudiwgY2FuY2VsKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRoMiA9IG51bGw7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSxcblx0XHRcdFx0XHRcdFwia2V5ZG93blwiIDogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGtleSA9IGUud2hpY2g7XG5cdFx0XHRcdFx0XHRcdGlmKGtleSA9PT0gMjcpIHtcblx0XHRcdFx0XHRcdFx0XHRjYW5jZWwgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMudmFsdWUgPSB0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGtleSA9PT0gMjcgfHwga2V5ID09PSAxMyB8fCBrZXkgPT09IDM3IHx8IGtleSA9PT0gMzggfHwga2V5ID09PSAzOSB8fCBrZXkgPT09IDQwIHx8IGtleSA9PT0gMzIpIHtcblx0XHRcdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGtleSA9PT0gMjcgfHwga2V5ID09PSAxMykge1xuXHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmJsdXIoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwiY2xpY2tcIiA6IGZ1bmN0aW9uIChlKSB7IGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7IH0sXG5cdFx0XHRcdFx0XHRcIm1vdXNlZG93blwiIDogZnVuY3Rpb24gKGUpIHsgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTsgfSxcblx0XHRcdFx0XHRcdFwia2V5dXBcIiA6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdGgyLndpZHRoKE1hdGgubWluKGgxLnRleHQoXCJwV1wiICsgdGhpcy52YWx1ZSkud2lkdGgoKSx3KSk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJrZXlwcmVzc1wiIDogZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdFx0XHRpZihlLndoaWNoID09PSAxMykgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0Zm4gPSB7XG5cdFx0XHRcdFx0XHRmb250RmFtaWx5XHRcdDogYS5jc3MoJ2ZvbnRGYW1pbHknKVx0XHR8fCAnJyxcblx0XHRcdFx0XHRcdGZvbnRTaXplXHRcdDogYS5jc3MoJ2ZvbnRTaXplJylcdFx0XHR8fCAnJyxcblx0XHRcdFx0XHRcdGZvbnRXZWlnaHRcdFx0OiBhLmNzcygnZm9udFdlaWdodCcpXHRcdHx8ICcnLFxuXHRcdFx0XHRcdFx0Zm9udFN0eWxlXHRcdDogYS5jc3MoJ2ZvbnRTdHlsZScpXHRcdHx8ICcnLFxuXHRcdFx0XHRcdFx0Zm9udFN0cmV0Y2hcdFx0OiBhLmNzcygnZm9udFN0cmV0Y2gnKVx0XHR8fCAnJyxcblx0XHRcdFx0XHRcdGZvbnRWYXJpYW50XHRcdDogYS5jc3MoJ2ZvbnRWYXJpYW50JylcdFx0fHwgJycsXG5cdFx0XHRcdFx0XHRsZXR0ZXJTcGFjaW5nXHQ6IGEuY3NzKCdsZXR0ZXJTcGFjaW5nJylcdHx8ICcnLFxuXHRcdFx0XHRcdFx0d29yZFNwYWNpbmdcdFx0OiBhLmNzcygnd29yZFNwYWNpbmcnKVx0XHR8fCAnJ1xuXHRcdFx0XHR9O1xuXHRcdFx0cy5hdHRyKCdjbGFzcycsIGEuYXR0cignY2xhc3MnKSkuYXBwZW5kKGEuY29udGVudHMoKS5jbG9uZSgpKS5hcHBlbmQoaDIpO1xuXHRcdFx0YS5yZXBsYWNlV2l0aChzKTtcblx0XHRcdGgxLmNzcyhmbik7XG5cdFx0XHRoMi5jc3MoZm4pLndpZHRoKE1hdGgubWluKGgxLnRleHQoXCJwV1wiICsgaDJbMF0udmFsdWUpLndpZHRoKCksdykpWzBdLnNlbGVjdCgpO1xuXHRcdFx0JChkb2N1bWVudCkub25lKCdtb3VzZWRvd24uanN0cmVlIHRvdWNoc3RhcnQuanN0cmVlIGRuZF9zdGFydC52YWthdGEnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRpZiAoaDIgJiYgZS50YXJnZXQgIT09IGgyKSB7XG5cdFx0XHRcdFx0JChoMikuYmx1cigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiBjaGFuZ2VzIHRoZSB0aGVtZVxuXHRcdCAqIEBuYW1lIHNldF90aGVtZSh0aGVtZV9uYW1lIFssIHRoZW1lX3VybF0pXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRoZW1lX25hbWUgdGhlIG5hbWUgb2YgdGhlIG5ldyB0aGVtZSB0byBhcHBseVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IHRoZW1lX3VybCAgdGhlIGxvY2F0aW9uIG9mIHRoZSBDU1MgZmlsZSBmb3IgdGhpcyB0aGVtZS4gT21pdCBvciBzZXQgdG8gYGZhbHNlYCBpZiB5b3UgbWFudWFsbHkgaW5jbHVkZWQgdGhlIGZpbGUuIFNldCB0byBgdHJ1ZWAgdG8gYXV0b2xvYWQgZnJvbSB0aGUgYGNvcmUudGhlbWVzLmRpcmAgZGlyZWN0b3J5LlxuXHRcdCAqIEB0cmlnZ2VyIHNldF90aGVtZS5qc3RyZWVcblx0XHQgKi9cblx0XHRzZXRfdGhlbWUgOiBmdW5jdGlvbiAodGhlbWVfbmFtZSwgdGhlbWVfdXJsKSB7XG5cdFx0XHRpZighdGhlbWVfbmFtZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKHRoZW1lX3VybCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHR2YXIgZGlyID0gdGhpcy5zZXR0aW5ncy5jb3JlLnRoZW1lcy5kaXI7XG5cdFx0XHRcdGlmKCFkaXIpIHsgZGlyID0gJC5qc3RyZWUucGF0aCArICcvdGhlbWVzJzsgfVxuXHRcdFx0XHR0aGVtZV91cmwgPSBkaXIgKyAnLycgKyB0aGVtZV9uYW1lICsgJy9zdHlsZS5jc3MnO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhlbWVfdXJsICYmICQuaW5BcnJheSh0aGVtZV91cmwsIHRoZW1lc19sb2FkZWQpID09PSAtMSkge1xuXHRcdFx0XHQkKCdoZWFkJykuYXBwZW5kKCc8JysnbGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIicgKyB0aGVtZV91cmwgKyAnXCIgdHlwZT1cInRleHQvY3NzXCIgLz4nKTtcblx0XHRcdFx0dGhlbWVzX2xvYWRlZC5wdXNoKHRoZW1lX3VybCk7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUudGhlbWVzLm5hbWUpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdqc3RyZWUtJyArIHRoaXMuX2RhdGEuY29yZS50aGVtZXMubmFtZSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLm5hbWUgPSB0aGVtZV9uYW1lO1xuXHRcdFx0dGhpcy5lbGVtZW50LmFkZENsYXNzKCdqc3RyZWUtJyArIHRoZW1lX25hbWUpO1xuXHRcdFx0dGhpcy5lbGVtZW50W3RoaXMuc2V0dGluZ3MuY29yZS50aGVtZXMucmVzcG9uc2l2ZSA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnIF0oJ2pzdHJlZS0nICsgdGhlbWVfbmFtZSArICctcmVzcG9uc2l2ZScpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIHRoZW1lIGlzIHNldFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzZXRfdGhlbWUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdGhlbWUgdGhlIG5ldyB0aGVtZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3NldF90aGVtZScsIHsgJ3RoZW1lJyA6IHRoZW1lX25hbWUgfSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXRzIHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50bHkgYXBwbGllZCB0aGVtZSBuYW1lXG5cdFx0ICogQG5hbWUgZ2V0X3RoZW1lKClcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0Z2V0X3RoZW1lIDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5uYW1lOyB9LFxuXHRcdC8qKlxuXHRcdCAqIGNoYW5nZXMgdGhlIHRoZW1lIHZhcmlhbnQgKGlmIHRoZSB0aGVtZSBoYXMgdmFyaWFudHMpXG5cdFx0ICogQG5hbWUgc2V0X3RoZW1lX3ZhcmlhbnQodmFyaWFudF9uYW1lKVxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfEJvb2xlYW59IHZhcmlhbnRfbmFtZSB0aGUgdmFyaWFudCB0byBhcHBseSAoaWYgYGZhbHNlYCBpcyB1c2VkIHRoZSBjdXJyZW50IHZhcmlhbnQgaXMgcmVtb3ZlZClcblx0XHQgKi9cblx0XHRzZXRfdGhlbWVfdmFyaWFudCA6IGZ1bmN0aW9uICh2YXJpYW50X25hbWUpIHtcblx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS50aGVtZXMudmFyaWFudCkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2pzdHJlZS0nICsgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5uYW1lICsgJy0nICsgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy52YXJpYW50KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMudmFyaWFudCA9IHZhcmlhbnRfbmFtZTtcblx0XHRcdGlmKHZhcmlhbnRfbmFtZSkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ2pzdHJlZS0nICsgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5uYW1lICsgJy0nICsgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy52YXJpYW50KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldHMgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnRseSBhcHBsaWVkIHRoZW1lIHZhcmlhbnRcblx0XHQgKiBAbmFtZSBnZXRfdGhlbWUoKVxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cblx0XHQgKi9cblx0XHRnZXRfdGhlbWVfdmFyaWFudCA6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2RhdGEuY29yZS50aGVtZXMudmFyaWFudDsgfSxcblx0XHQvKipcblx0XHQgKiBzaG93cyBhIHN0cmlwZWQgYmFja2dyb3VuZCBvbiB0aGUgY29udGFpbmVyIChpZiB0aGUgdGhlbWUgc3VwcG9ydHMgaXQpXG5cdFx0ICogQG5hbWUgc2hvd19zdHJpcGVzKClcblx0XHQgKi9cblx0XHRzaG93X3N0cmlwZXMgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnN0cmlwZXMgPSB0cnVlO1xuXHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkuYWRkQ2xhc3MoXCJqc3RyZWUtc3RyaXBlZFwiKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gc3RyaXBlcyBhcmUgc2hvd25cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2hvd19zdHJpcGVzLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3Nob3dfc3RyaXBlcycpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaGlkZXMgdGhlIHN0cmlwZWQgYmFja2dyb3VuZCBvbiB0aGUgY29udGFpbmVyXG5cdFx0ICogQG5hbWUgaGlkZV9zdHJpcGVzKClcblx0XHQgKi9cblx0XHRoaWRlX3N0cmlwZXMgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnN0cmlwZXMgPSBmYWxzZTtcblx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLnJlbW92ZUNsYXNzKFwianN0cmVlLXN0cmlwZWRcIik7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIHN0cmlwZXMgYXJlIGhpZGRlblxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBoaWRlX3N0cmlwZXMuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignaGlkZV9zdHJpcGVzJyk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiB0b2dnbGVzIHRoZSBzdHJpcGVkIGJhY2tncm91bmQgb24gdGhlIGNvbnRhaW5lclxuXHRcdCAqIEBuYW1lIHRvZ2dsZV9zdHJpcGVzKClcblx0XHQgKi9cblx0XHR0b2dnbGVfc3RyaXBlcyA6IGZ1bmN0aW9uICgpIHsgaWYodGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5zdHJpcGVzKSB7IHRoaXMuaGlkZV9zdHJpcGVzKCk7IH0gZWxzZSB7IHRoaXMuc2hvd19zdHJpcGVzKCk7IH0gfSxcblx0XHQvKipcblx0XHQgKiBzaG93cyB0aGUgY29ubmVjdGluZyBkb3RzIChpZiB0aGUgdGhlbWUgc3VwcG9ydHMgaXQpXG5cdFx0ICogQG5hbWUgc2hvd19kb3RzKClcblx0XHQgKi9cblx0XHRzaG93X2RvdHMgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmRvdHMgPSB0cnVlO1xuXHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtbm8tZG90c1wiKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gZG90cyBhcmUgc2hvd25cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2hvd19kb3RzLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3Nob3dfZG90cycpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaGlkZXMgdGhlIGNvbm5lY3RpbmcgZG90c1xuXHRcdCAqIEBuYW1lIGhpZGVfZG90cygpXG5cdFx0ICovXG5cdFx0aGlkZV9kb3RzIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5kb3RzID0gZmFsc2U7XG5cdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5hZGRDbGFzcyhcImpzdHJlZS1uby1kb3RzXCIpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBkb3RzIGFyZSBoaWRkZW5cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgaGlkZV9kb3RzLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2hpZGVfZG90cycpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogdG9nZ2xlcyB0aGUgY29ubmVjdGluZyBkb3RzXG5cdFx0ICogQG5hbWUgdG9nZ2xlX2RvdHMoKVxuXHRcdCAqL1xuXHRcdHRvZ2dsZV9kb3RzIDogZnVuY3Rpb24gKCkgeyBpZih0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmRvdHMpIHsgdGhpcy5oaWRlX2RvdHMoKTsgfSBlbHNlIHsgdGhpcy5zaG93X2RvdHMoKTsgfSB9LFxuXHRcdC8qKlxuXHRcdCAqIHNob3cgdGhlIG5vZGUgaWNvbnNcblx0XHQgKiBAbmFtZSBzaG93X2ljb25zKClcblx0XHQgKi9cblx0XHRzaG93X2ljb25zIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5pY29ucyA9IHRydWU7XG5cdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5yZW1vdmVDbGFzcyhcImpzdHJlZS1uby1pY29uc1wiKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gaWNvbnMgYXJlIHNob3duXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNob3dfaWNvbnMuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2hvd19pY29ucycpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaGlkZSB0aGUgbm9kZSBpY29uc1xuXHRcdCAqIEBuYW1lIGhpZGVfaWNvbnMoKVxuXHRcdCAqL1xuXHRcdGhpZGVfaWNvbnMgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmljb25zID0gZmFsc2U7XG5cdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5hZGRDbGFzcyhcImpzdHJlZS1uby1pY29uc1wiKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gaWNvbnMgYXJlIGhpZGRlblxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBoaWRlX2ljb25zLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2hpZGVfaWNvbnMnKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHRvZ2dsZSB0aGUgbm9kZSBpY29uc1xuXHRcdCAqIEBuYW1lIHRvZ2dsZV9pY29ucygpXG5cdFx0ICovXG5cdFx0dG9nZ2xlX2ljb25zIDogZnVuY3Rpb24gKCkgeyBpZih0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmljb25zKSB7IHRoaXMuaGlkZV9pY29ucygpOyB9IGVsc2UgeyB0aGlzLnNob3dfaWNvbnMoKTsgfSB9LFxuXHRcdC8qKlxuXHRcdCAqIHNob3cgdGhlIG5vZGUgZWxsaXBzaXNcblx0XHQgKiBAbmFtZSBzaG93X2ljb25zKClcblx0XHQgKi9cblx0XHRzaG93X2VsbGlwc2lzIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5lbGxpcHNpcyA9IHRydWU7XG5cdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5hZGRDbGFzcyhcImpzdHJlZS1lbGxpcHNpc1wiKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gZWxsaXNpcyBpcyBzaG93blxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzaG93X2VsbGlwc2lzLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3Nob3dfZWxsaXBzaXMnKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGhpZGUgdGhlIG5vZGUgZWxsaXBzaXNcblx0XHQgKiBAbmFtZSBoaWRlX2VsbGlwc2lzKClcblx0XHQgKi9cblx0XHRoaWRlX2VsbGlwc2lzIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5lbGxpcHNpcyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtZWxsaXBzaXNcIik7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGVsbGlzaXMgaXMgaGlkZGVuXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGhpZGVfZWxsaXBzaXMuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignaGlkZV9lbGxpcHNpcycpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogdG9nZ2xlIHRoZSBub2RlIGVsbGlwc2lzXG5cdFx0ICogQG5hbWUgdG9nZ2xlX2ljb25zKClcblx0XHQgKi9cblx0XHR0b2dnbGVfZWxsaXBzaXMgOiBmdW5jdGlvbiAoKSB7IGlmKHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZWxsaXBzaXMpIHsgdGhpcy5oaWRlX2VsbGlwc2lzKCk7IH0gZWxzZSB7IHRoaXMuc2hvd19lbGxpcHNpcygpOyB9IH0sXG5cdFx0LyoqXG5cdFx0ICogc2V0IHRoZSBub2RlIGljb24gZm9yIGEgbm9kZVxuXHRcdCAqIEBuYW1lIHNldF9pY29uKG9iaiwgaWNvbilcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmpcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gaWNvbiB0aGUgbmV3IGljb24gLSBjYW4gYmUgYSBwYXRoIHRvIGFuIGljb24gb3IgYSBjbGFzc05hbWUsIGlmIHVzaW5nIGFuIGltYWdlIHRoYXQgaXMgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5IHVzZSBhIGAuL2AgcHJlZml4LCBvdGhlcndpc2UgaXQgd2lsbCBiZSBkZXRlY3RlZCBhcyBhIGNsYXNzXG5cdFx0ICovXG5cdFx0c2V0X2ljb24gOiBmdW5jdGlvbiAob2JqLCBpY29uKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBkb20sIG9sZDtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLnNldF9pY29uKG9ialt0MV0sIGljb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRvbGQgPSBvYmouaWNvbjtcblx0XHRcdG9iai5pY29uID0gaWNvbiA9PT0gdHJ1ZSB8fCBpY29uID09PSBudWxsIHx8IGljb24gPT09IHVuZGVmaW5lZCB8fCBpY29uID09PSAnJyA/IHRydWUgOiBpY29uO1xuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikuY2hpbGRyZW4oXCIuanN0cmVlLXRoZW1laWNvblwiKTtcblx0XHRcdGlmKGljb24gPT09IGZhbHNlKSB7XG5cdFx0XHRcdGRvbS5yZW1vdmVDbGFzcygnanN0cmVlLXRoZW1laWNvbi1jdXN0b20gJyArIG9sZCkuY3NzKFwiYmFja2dyb3VuZFwiLFwiXCIpLnJlbW92ZUF0dHIoXCJyZWxcIik7XG5cdFx0XHRcdHRoaXMuaGlkZV9pY29uKG9iaik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKGljb24gPT09IHRydWUgfHwgaWNvbiA9PT0gbnVsbCB8fCBpY29uID09PSB1bmRlZmluZWQgfHwgaWNvbiA9PT0gJycpIHtcblx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKCdqc3RyZWUtdGhlbWVpY29uLWN1c3RvbSAnICsgb2xkKS5jc3MoXCJiYWNrZ3JvdW5kXCIsXCJcIikucmVtb3ZlQXR0cihcInJlbFwiKTtcblx0XHRcdFx0aWYob2xkID09PSBmYWxzZSkgeyB0aGlzLnNob3dfaWNvbihvYmopOyB9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKGljb24uaW5kZXhPZihcIi9cIikgPT09IC0xICYmIGljb24uaW5kZXhPZihcIi5cIikgPT09IC0xKSB7XG5cdFx0XHRcdGRvbS5yZW1vdmVDbGFzcyhvbGQpLmNzcyhcImJhY2tncm91bmRcIixcIlwiKTtcblx0XHRcdFx0ZG9tLmFkZENsYXNzKGljb24gKyAnIGpzdHJlZS10aGVtZWljb24tY3VzdG9tJykuYXR0cihcInJlbFwiLGljb24pO1xuXHRcdFx0XHRpZihvbGQgPT09IGZhbHNlKSB7IHRoaXMuc2hvd19pY29uKG9iaik7IH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3Mob2xkKS5jc3MoXCJiYWNrZ3JvdW5kXCIsXCJcIik7XG5cdFx0XHRcdGRvbS5hZGRDbGFzcygnanN0cmVlLXRoZW1laWNvbi1jdXN0b20nKS5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwidXJsKCdcIiArIGljb24gKyBcIicpIGNlbnRlciBjZW50ZXIgbm8tcmVwZWF0XCIpLmF0dHIoXCJyZWxcIixpY29uKTtcblx0XHRcdFx0aWYob2xkID09PSBmYWxzZSkgeyB0aGlzLnNob3dfaWNvbihvYmopOyB9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCB0aGUgbm9kZSBpY29uIGZvciBhIG5vZGVcblx0XHQgKiBAbmFtZSBnZXRfaWNvbihvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdGdldF9pY29uIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuICghb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgPyBmYWxzZSA6IG9iai5pY29uO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaGlkZSB0aGUgaWNvbiBvbiBhbiBpbmRpdmlkdWFsIG5vZGVcblx0XHQgKiBAbmFtZSBoaWRlX2ljb24ob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9ialxuXHRcdCAqL1xuXHRcdGhpZGVfaWNvbiA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdHZhciB0MSwgdDI7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5oaWRlX2ljb24ob2JqW3QxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iaiA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdG9iai5pY29uID0gZmFsc2U7XG5cdFx0XHR0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSkuY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5jaGlsZHJlbihcIi5qc3RyZWUtdGhlbWVpY29uXCIpLmFkZENsYXNzKCdqc3RyZWUtdGhlbWVpY29uLWhpZGRlbicpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzaG93IHRoZSBpY29uIG9uIGFuIGluZGl2aWR1YWwgbm9kZVxuXHRcdCAqIEBuYW1lIHNob3dfaWNvbihvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqXG5cdFx0ICovXG5cdFx0c2hvd19pY29uIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0dmFyIHQxLCB0MiwgZG9tO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuc2hvd19pY29uKG9ialt0MV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmogPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRvYmouaWNvbiA9IGRvbS5sZW5ndGggPyBkb20uY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5jaGlsZHJlbihcIi5qc3RyZWUtdGhlbWVpY29uXCIpLmF0dHIoJ3JlbCcpIDogdHJ1ZTtcblx0XHRcdGlmKCFvYmouaWNvbikgeyBvYmouaWNvbiA9IHRydWU7IH1cblx0XHRcdGRvbS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS10aGVtZWljb25cIikucmVtb3ZlQ2xhc3MoJ2pzdHJlZS10aGVtZWljb24taGlkZGVuJyk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH07XG5cblx0Ly8gaGVscGVyc1xuXHQkLnZha2F0YSA9IHt9O1xuXHQvLyBjb2xsZWN0IGF0dHJpYnV0ZXNcblx0JC52YWthdGEuYXR0cmlidXRlcyA9IGZ1bmN0aW9uKG5vZGUsIHdpdGhfdmFsdWVzKSB7XG5cdFx0bm9kZSA9ICQobm9kZSlbMF07XG5cdFx0dmFyIGF0dHIgPSB3aXRoX3ZhbHVlcyA/IHt9IDogW107XG5cdFx0aWYobm9kZSAmJiBub2RlLmF0dHJpYnV0ZXMpIHtcblx0XHRcdCQuZWFjaChub2RlLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdGlmKCQuaW5BcnJheSh2Lm5hbWUudG9Mb3dlckNhc2UoKSxbJ3N0eWxlJywnY29udGVudGVkaXRhYmxlJywnaGFzZm9jdXMnLCd0YWJpbmRleCddKSAhPT0gLTEpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdGlmKHYudmFsdWUgIT09IG51bGwgJiYgJC50cmltKHYudmFsdWUpICE9PSAnJykge1xuXHRcdFx0XHRcdGlmKHdpdGhfdmFsdWVzKSB7IGF0dHJbdi5uYW1lXSA9IHYudmFsdWU7IH1cblx0XHRcdFx0XHRlbHNlIHsgYXR0ci5wdXNoKHYubmFtZSk7IH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBhdHRyO1xuXHR9O1xuXHQkLnZha2F0YS5hcnJheV91bmlxdWUgPSBmdW5jdGlvbihhcnJheSkge1xuXHRcdHZhciBhID0gW10sIGksIGosIGwsIG8gPSB7fTtcblx0XHRmb3IoaSA9IDAsIGwgPSBhcnJheS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRcdGlmKG9bYXJyYXlbaV1dID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0YS5wdXNoKGFycmF5W2ldKTtcblx0XHRcdFx0b1thcnJheVtpXV0gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYTtcblx0fTtcblx0Ly8gcmVtb3ZlIGl0ZW0gZnJvbSBhcnJheVxuXHQkLnZha2F0YS5hcnJheV9yZW1vdmUgPSBmdW5jdGlvbihhcnJheSwgZnJvbSkge1xuXHRcdGFycmF5LnNwbGljZShmcm9tLCAxKTtcblx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0Ly92YXIgcmVzdCA9IGFycmF5LnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgYXJyYXkubGVuZ3RoKTtcblx0XHQvL2FycmF5Lmxlbmd0aCA9IGZyb20gPCAwID8gYXJyYXkubGVuZ3RoICsgZnJvbSA6IGZyb207XG5cdFx0Ly9hcnJheS5wdXNoLmFwcGx5KGFycmF5LCByZXN0KTtcblx0XHQvL3JldHVybiBhcnJheTtcblx0fTtcblx0Ly8gcmVtb3ZlIGl0ZW0gZnJvbSBhcnJheVxuXHQkLnZha2F0YS5hcnJheV9yZW1vdmVfaXRlbSA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtKSB7XG5cdFx0dmFyIHRtcCA9ICQuaW5BcnJheShpdGVtLCBhcnJheSk7XG5cdFx0cmV0dXJuIHRtcCAhPT0gLTEgPyAkLnZha2F0YS5hcnJheV9yZW1vdmUoYXJyYXksIHRtcCkgOiBhcnJheTtcblx0fTtcblx0JC52YWthdGEuYXJyYXlfZmlsdGVyID0gZnVuY3Rpb24oYyxhLGIsZCxlKSB7XG5cdFx0aWYgKGMuZmlsdGVyKSB7XG5cdFx0XHRyZXR1cm4gYy5maWx0ZXIoYSwgYik7XG5cdFx0fVxuXHRcdGQ9W107XG5cdFx0Zm9yIChlIGluIGMpIHtcblx0XHRcdGlmICh+fmUrJyc9PT1lKycnICYmIGU+PTAgJiYgYS5jYWxsKGIsY1tlXSwrZSxjKSkge1xuXHRcdFx0XHRkLnB1c2goY1tlXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBkO1xuXHR9O1xuXG5cbi8qKlxuICogIyMjIENoYW5nZWQgcGx1Z2luXG4gKlxuICogVGhpcyBwbHVnaW4gYWRkcyBtb3JlIGluZm9ybWF0aW9uIHRvIHRoZSBgY2hhbmdlZC5qc3RyZWVgIGV2ZW50LiBUaGUgbmV3IGRhdGEgaXMgY29udGFpbmVkIGluIHRoZSBgY2hhbmdlZGAgZXZlbnQgZGF0YSBwcm9wZXJ0eSwgYW5kIGNvbnRhaW5zIGEgbGlzdHMgb2YgYHNlbGVjdGVkYCBhbmQgYGRlc2VsZWN0ZWRgIG5vZGVzLlxuICovXG5cblx0JC5qc3RyZWUucGx1Z2lucy5jaGFuZ2VkID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHZhciBsYXN0ID0gW107XG5cdFx0dGhpcy50cmlnZ2VyID0gZnVuY3Rpb24gKGV2LCBkYXRhKSB7XG5cdFx0XHR2YXIgaSwgajtcblx0XHRcdGlmKCFkYXRhKSB7XG5cdFx0XHRcdGRhdGEgPSB7fTtcblx0XHRcdH1cblx0XHRcdGlmKGV2LnJlcGxhY2UoJy5qc3RyZWUnLCcnKSA9PT0gJ2NoYW5nZWQnKSB7XG5cdFx0XHRcdGRhdGEuY2hhbmdlZCA9IHsgc2VsZWN0ZWQgOiBbXSwgZGVzZWxlY3RlZCA6IFtdIH07XG5cdFx0XHRcdHZhciB0bXAgPSB7fTtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gbGFzdC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHR0bXBbbGFzdFtpXV0gPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IGRhdGEuc2VsZWN0ZWQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYoIXRtcFtkYXRhLnNlbGVjdGVkW2ldXSkge1xuXHRcdFx0XHRcdFx0ZGF0YS5jaGFuZ2VkLnNlbGVjdGVkLnB1c2goZGF0YS5zZWxlY3RlZFtpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dG1wW2RhdGEuc2VsZWN0ZWRbaV1dID0gMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gbGFzdC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZih0bXBbbGFzdFtpXV0gPT09IDEpIHtcblx0XHRcdFx0XHRcdGRhdGEuY2hhbmdlZC5kZXNlbGVjdGVkLnB1c2gobGFzdFtpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGxhc3QgPSBkYXRhLnNlbGVjdGVkLnNsaWNlKCk7XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIHNlbGVjdGlvbiBjaGFuZ2VzICh0aGUgXCJjaGFuZ2VkXCIgcGx1Z2luIGVuaGFuY2VzIHRoZSBvcmlnaW5hbCBldmVudCB3aXRoIG1vcmUgZGF0YSlcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY2hhbmdlZC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uIHRoZSBhY3Rpb24gdGhhdCBjYXVzZWQgdGhlIHNlbGVjdGlvbiB0byBjaGFuZ2Vcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGNoYW5nZWQgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdHdvIHByb3BlcnRpZXMgYHNlbGVjdGVkYCBhbmQgYGRlc2VsZWN0ZWRgIC0gYm90aCBhcnJheXMgb2Ygbm9kZSBJRHMsIHdoaWNoIHdlcmUgc2VsZWN0ZWQgb3IgZGVzZWxlY3RlZCBzaW5jZSB0aGUgbGFzdCBjaGFuZ2VkIGV2ZW50XG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIGV2ZW50IChpZiBhbnkpIHRoYXQgdHJpZ2dlcmVkIHRoaXMgY2hhbmdlZCBldmVudFxuXHRcdFx0ICogQHBsdWdpbiBjaGFuZ2VkXG5cdFx0XHQgKi9cblx0XHRcdHBhcmVudC50cmlnZ2VyLmNhbGwodGhpcywgZXYsIGRhdGEpO1xuXHRcdH07XG5cdFx0dGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKHNraXBfbG9hZGluZywgZm9yZ2V0X3N0YXRlKSB7XG5cdFx0XHRsYXN0ID0gW107XG5cdFx0XHRyZXR1cm4gcGFyZW50LnJlZnJlc2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9O1xuXHR9O1xuXG4vKipcbiAqICMjIyBDaGVja2JveCBwbHVnaW5cbiAqXG4gKiBUaGlzIHBsdWdpbiByZW5kZXJzIGNoZWNrYm94IGljb25zIGluIGZyb250IG9mIGVhY2ggbm9kZSwgbWFraW5nIG11bHRpcGxlIHNlbGVjdGlvbiBtdWNoIGVhc2llci5cbiAqIEl0IGFsc28gc3VwcG9ydHMgdHJpLXN0YXRlIGJlaGF2aW9yLCBtZWFuaW5nIHRoYXQgaWYgYSBub2RlIGhhcyBhIGZldyBvZiBpdHMgY2hpbGRyZW4gY2hlY2tlZCBpdCB3aWxsIGJlIHJlbmRlcmVkIGFzIHVuZGV0ZXJtaW5lZCwgYW5kIHN0YXRlIHdpbGwgYmUgcHJvcGFnYXRlZCB1cC5cbiAqL1xuXG5cdHZhciBfaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0knKTtcblx0X2kuY2xhc3NOYW1lID0gJ2pzdHJlZS1pY29uIGpzdHJlZS1jaGVja2JveCc7XG5cdF9pLnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKTtcblx0LyoqXG5cdCAqIHN0b3JlcyBhbGwgZGVmYXVsdHMgZm9yIHRoZSBjaGVja2JveCBwbHVnaW5cblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3hcblx0ICogQHBsdWdpbiBjaGVja2JveFxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3ggPSB7XG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgY2hlY2tib3hlcyBzaG91bGQgYmUgdmlzaWJsZSAoY2FuIGJlIGNoYW5nZWQgYXQgYSBsYXRlciB0aW1lIHVzaW5nIGBzaG93X2NoZWNrYm94ZXMoKWAgYW5kIGBoaWRlX2NoZWNrYm94ZXNgKS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94LnZpc2libGVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dmlzaWJsZVx0XHRcdFx0OiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGNoZWNrYm94ZXMgc2hvdWxkIGNhc2NhZGUgZG93biBhbmQgaGF2ZSBhbiB1bmRldGVybWluZWQgc3RhdGUuIERlZmF1bHRzIHRvIGB0cnVlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveC50aHJlZV9zdGF0ZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aHJlZV9zdGF0ZVx0XHRcdDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBjbGlja2luZyBhbnl3aGVyZSBvbiB0aGUgbm9kZSBzaG91bGQgYWN0IGFzIGNsaWNraW5nIG9uIHRoZSBjaGVja2JveC4gRGVmYXVsdHMgdG8gYHRydWVgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94Lndob2xlX25vZGVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0d2hvbGVfbm9kZVx0XHRcdDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgc2VsZWN0ZWQgc3R5bGUgb2YgYSBub2RlIHNob3VsZCBiZSBrZXB0LCBvciByZW1vdmVkLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3gua2VlcF9zZWxlY3RlZF9zdHlsZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHRrZWVwX3NlbGVjdGVkX3N0eWxlXHQ6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogVGhpcyBzZXR0aW5nIGNvbnRyb2xzIGhvdyBjYXNjYWRpbmcgYW5kIHVuZGV0ZXJtaW5lZCBub2RlcyBhcmUgYXBwbGllZC5cblx0XHQgKiBJZiAndXAnIGlzIGluIHRoZSBzdHJpbmcgLSBjYXNjYWRpbmcgdXAgaXMgZW5hYmxlZCwgaWYgJ2Rvd24nIGlzIGluIHRoZSBzdHJpbmcgLSBjYXNjYWRpbmcgZG93biBpcyBlbmFibGVkLCBpZiAndW5kZXRlcm1pbmVkJyBpcyBpbiB0aGUgc3RyaW5nIC0gdW5kZXRlcm1pbmVkIG5vZGVzIHdpbGwgYmUgdXNlZC5cblx0XHQgKiBJZiBgdGhyZWVfc3RhdGVgIGlzIHNldCB0byBgdHJ1ZWAgdGhpcyBzZXR0aW5nIGlzIGF1dG9tYXRpY2FsbHkgc2V0IHRvICd1cCtkb3duK3VuZGV0ZXJtaW5lZCcuIERlZmF1bHRzIHRvICcnLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94LmNhc2NhZGVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0Y2FzY2FkZVx0XHRcdFx0OiAnJyxcblx0XHQvKipcblx0XHQgKiBUaGlzIHNldHRpbmcgY29udHJvbHMgaWYgY2hlY2tib3ggYXJlIGJvdW5kIHRvIHRoZSBnZW5lcmFsIHRyZWUgc2VsZWN0aW9uIG9yIHRvIGFuIGludGVybmFsIGFycmF5IG1haW50YWluZWQgYnkgdGhlIGNoZWNrYm94IHBsdWdpbi4gRGVmYXVsdHMgdG8gYHRydWVgLCBvbmx5IHNldCB0byBgZmFsc2VgIGlmIHlvdSBrbm93IGV4YWN0bHkgd2hhdCB5b3UgYXJlIGRvaW5nLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb25cblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGllX3NlbGVjdGlvblx0XHQ6IHRydWUsXG5cblx0XHQvKipcblx0XHQgKiBUaGlzIHNldHRpbmcgY29udHJvbHMgaWYgY2FzY2FkaW5nIGRvd24gYWZmZWN0cyBkaXNhYmxlZCBjaGVja2JveGVzXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3guY2FzY2FkZV90b19kaXNhYmxlZFxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHRjYXNjYWRlX3RvX2Rpc2FibGVkIDogdHJ1ZSxcblxuXHRcdC8qKlxuXHRcdCAqIFRoaXMgc2V0dGluZyBjb250cm9scyBpZiBjYXNjYWRpbmcgZG93biBhZmZlY3RzIGhpZGRlbiBjaGVja2JveGVzXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3guY2FzY2FkZV90b19oaWRkZW5cblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0Y2FzY2FkZV90b19oaWRkZW4gOiB0cnVlXG5cdH07XG5cdCQuanN0cmVlLnBsdWdpbnMuY2hlY2tib3ggPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5iaW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFyZW50LmJpbmQuY2FsbCh0aGlzKTtcblx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3gudXRvID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkID0gW107XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRocmVlX3N0YXRlKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZSA9ICd1cCtkb3duK3VuZGV0ZXJtaW5lZCc7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0Lm9uKFwiaW5pdC5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnZpc2libGUgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LnZpc2libGU7XG5cdFx0XHRcdFx0XHRpZighdGhpcy5zZXR0aW5ncy5jaGVja2JveC5rZWVwX3NlbGVjdGVkX3N0eWxlKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hZGRDbGFzcygnanN0cmVlLWNoZWNrYm94LW5vLWNsaWNrZWQnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ2pzdHJlZS1jaGVja2JveC1zZWxlY3Rpb24nKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwibG9hZGluZy5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR0aGlzWyB0aGlzLl9kYXRhLmNoZWNrYm94LnZpc2libGUgPyAnc2hvd19jaGVja2JveGVzJyA6ICdoaWRlX2NoZWNrYm94ZXMnIF0oKTtcblx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUuaW5kZXhPZigndW5kZXRlcm1pbmVkJykgIT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHRcdC5vbignY2hhbmdlZC5qc3RyZWUgdW5jaGVja19ub2RlLmpzdHJlZSBjaGVja19ub2RlLmpzdHJlZSB1bmNoZWNrX2FsbC5qc3RyZWUgY2hlY2tfYWxsLmpzdHJlZSBtb3ZlX25vZGUuanN0cmVlIGNvcHlfbm9kZS5qc3RyZWUgcmVkcmF3LmpzdHJlZSBvcGVuX25vZGUuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdC8vIG9ubHkgaWYgdW5kZXRlcm1pbmVkIGlzIGluIHNldHRpbmdcblx0XHRcdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5jaGVja2JveC51dG8pIHsgY2xlYXJUaW1lb3V0KHRoaXMuX2RhdGEuY2hlY2tib3gudXRvKTsgfVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnV0byA9IHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLl91bmRldGVybWluZWQsIHRoaXMpLCA1MCk7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHR9XG5cdFx0XHRpZighdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHRcdC5vbignbW9kZWwuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0dmFyIG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRcdFx0XHRwID0gbVtkYXRhLnBhcmVudF0sXG5cdFx0XHRcdFx0XHRcdGRwYyA9IGRhdGEubm9kZXMsXG5cdFx0XHRcdFx0XHRcdGksIGo7XG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkcGMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdG1bZHBjW2ldXS5zdGF0ZS5jaGVja2VkID0gbVtkcGNbaV1dLnN0YXRlLmNoZWNrZWQgfHwgKG1bZHBjW2ldXS5vcmlnaW5hbCAmJiBtW2RwY1tpXV0ub3JpZ2luYWwuc3RhdGUgJiYgbVtkcGNbaV1dLm9yaWdpbmFsLnN0YXRlLmNoZWNrZWQpO1xuXHRcdFx0XHRcdFx0XHRpZihtW2RwY1tpXV0uc3RhdGUuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQucHVzaChkcGNbaV0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLmluZGV4T2YoJ3VwJykgIT09IC0xIHx8IHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZS5pbmRleE9mKCdkb3duJykgIT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHRcdC5vbignbW9kZWwuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0cCA9IG1bZGF0YS5wYXJlbnRdLFxuXHRcdFx0XHRcdFx0XHRcdGRwYyA9IGRhdGEubm9kZXMsXG5cdFx0XHRcdFx0XHRcdFx0Y2hkID0gW10sXG5cdFx0XHRcdFx0XHRcdFx0YywgaSwgaiwgaywgbCwgdG1wLCBzID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLCB0ID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uO1xuXG5cdFx0XHRcdFx0XHRcdGlmKHMuaW5kZXhPZignZG93bicpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIGFwcGx5IGRvd25cblx0XHRcdFx0XHRcdFx0XHRpZihwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkcGMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1bZHBjW2ldXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQgPSB0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLmNvbmNhdChkcGMpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRwYy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYobVtkcGNbaV1dLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gbVtkcGNbaV1dLmNoaWxkcmVuX2QubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtW21bZHBjW2ldXS5jaGlsZHJlbl9kW2tdXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQgPSB0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLmNvbmNhdChtW2RwY1tpXV0uY2hpbGRyZW5fZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZihzLmluZGV4T2YoJ3VwJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gYXBwbHkgdXBcblx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZighbVtwLmNoaWxkcmVuX2RbaV1dLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGQucHVzaChtW3AuY2hpbGRyZW5fZFtpXV0ucGFyZW50KTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Y2hkID0gJC52YWthdGEuYXJyYXlfdW5pcXVlKGNoZCk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gY2hkLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0cCA9IG1bY2hkW2tdXTtcblx0XHRcdFx0XHRcdFx0XHRcdHdoaWxlKHAgJiYgcC5pZCAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjICs9IG1bcC5jaGlsZHJlbltpXV0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoYyA9PT0gaikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQucHVzaChwLmlkKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKHAsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuYXR0cignYXJpYS1zZWxlY3RlZCcsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKCB0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwID0gdGhpcy5nZXRfbm9kZShwLnBhcmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCA9ICQudmFrYXRhLmFycmF5X3VuaXF1ZSh0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkKTtcblx0XHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHRcdC5vbih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24gPyAnc2VsZWN0X25vZGUuanN0cmVlJyA6ICdjaGVja19ub2RlLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRcdFx0XHRcdG9iaiA9IGRhdGEubm9kZSxcblx0XHRcdFx0XHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0XHRcdFx0XHRwYXIgPSB0aGlzLmdldF9ub2RlKG9iai5wYXJlbnQpLFxuXHRcdFx0XHRcdFx0XHRcdGksIGosIGMsIHRtcCwgcyA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZSwgdCA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbixcblx0XHRcdFx0XHRcdFx0XHRzZWwgPSB7fSwgY3VyID0gdGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZDtcblxuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwLCBqID0gY3VyLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdHNlbFtjdXJbaV1dID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIGFwcGx5IGRvd25cblx0XHRcdFx0XHRcdFx0aWYocy5pbmRleE9mKCdkb3duJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly90aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkID0gJC52YWthdGEuYXJyYXlfdW5pcXVlKHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQuY29uY2F0KG9iai5jaGlsZHJlbl9kKSk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHNlbGVjdGVkSWRzID0gdGhpcy5fY2FzY2FkZV9uZXdfY2hlY2tlZF9zdGF0ZShvYmouaWQsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdHZhciB0ZW1wID0gb2JqLmNoaWxkcmVuX2QuY29uY2F0KG9iai5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMCwgaiA9IHRlbXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoc2VsZWN0ZWRJZHMuaW5kZXhPZih0ZW1wW2ldKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlbFt0ZW1wW2ldXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHNlbFt0ZW1wW2ldXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBhcHBseSB1cFxuXHRcdFx0XHRcdFx0XHRpZihzLmluZGV4T2YoJ3VwJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUocGFyICYmIHBhci5pZCAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0YyA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwYXIuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGMgKz0gbVtwYXIuY2hpbGRyZW5baV1dLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYoYyA9PT0gaikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwYXIuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxbcGFyLmlkXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vdGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZC5wdXNoKHBhci5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUocGFyLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuYXR0cignYXJpYS1zZWxlY3RlZCcsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdHBhciA9IHRoaXMuZ2V0X25vZGUocGFyLnBhcmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Y3VyID0gW107XG5cdFx0XHRcdFx0XHRcdGZvciAoaSBpbiBzZWwpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2VsLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjdXIucHVzaChpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCA9IGN1cjtcblx0XHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHRcdC5vbih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24gPyAnZGVzZWxlY3RfYWxsLmpzdHJlZScgOiAndW5jaGVja19hbGwuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgb2JqID0gdGhpcy5nZXRfbm9kZSgkLmpzdHJlZS5yb290KSxcblx0XHRcdFx0XHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0XHRcdFx0XHRpLCBqLCB0bXA7XG5cdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdHRtcCA9IG1bb2JqLmNoaWxkcmVuX2RbaV1dO1xuXHRcdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAub3JpZ2luYWwgJiYgdG1wLm9yaWdpbmFsLnN0YXRlICYmIHRtcC5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRtcC5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHRcdC5vbih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24gPyAnZGVzZWxlY3Rfbm9kZS5qc3RyZWUnIDogJ3VuY2hlY2tfbm9kZS5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdFx0XHRcdFx0XHRvYmogPSBkYXRhLm5vZGUsXG5cdFx0XHRcdFx0XHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpLFxuXHRcdFx0XHRcdFx0XHRcdGksIGosIHRtcCwgcyA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZSwgdCA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbixcblx0XHRcdFx0XHRcdFx0XHRjdXIgPSB0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLCBzZWwgPSB7fSxcblx0XHRcdFx0XHRcdFx0XHRzdGlsbFNlbGVjdGVkSWRzID0gW10sXG5cdFx0XHRcdFx0XHRcdFx0YWxsSWRzID0gb2JqLmNoaWxkcmVuX2QuY29uY2F0KG9iai5pZCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gYXBwbHkgZG93blxuXHRcdFx0XHRcdFx0XHRpZihzLmluZGV4T2YoJ2Rvd24nKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0ZWRJZHMgPSB0aGlzLl9jYXNjYWRlX25ld19jaGVja2VkX3N0YXRlKG9iai5pZCwgZmFsc2UpO1xuXG5cdFx0XHRcdFx0XHRcdFx0Y3VyID0gJC52YWthdGEuYXJyYXlfZmlsdGVyKGN1ciwgZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhbGxJZHMuaW5kZXhPZihpZCkgPT09IC0xIHx8IHNlbGVjdGVkSWRzLmluZGV4T2YoaWQpID4gLTE7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBvbmx5IGFwcGx5IHVwIGlmIGNhc2NhZGUgdXAgaXMgZW5hYmxlZCBhbmQgaWYgdGhpcyBub2RlIGlzIG5vdCBzZWxlY3RlZFxuXHRcdFx0XHRcdFx0XHQvLyAoaWYgYWxsIGNoaWxkIG5vZGVzIGFyZSBkaXNhYmxlZCBhbmQgY2FzY2FkZV90b19kaXNhYmxlZCA9PT0gZmFsc2UgdGhlbiB0aGlzIG5vZGUgd2lsbCB0aWxsIGJlIHNlbGVjdGVkKS5cblx0XHRcdFx0XHRcdFx0aWYocy5pbmRleE9mKCd1cCcpICE9PSAtMSAmJiBjdXIuaW5kZXhPZihvYmouaWQpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5fbW9kZWwuZGF0YVtvYmoucGFyZW50c1tpXV07XG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAub3JpZ2luYWwgJiYgdG1wLm9yaWdpbmFsLnN0YXRlICYmIHRtcC5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShvYmoucGFyZW50c1tpXSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuYXR0cignYXJpYS1zZWxlY3RlZCcsIGZhbHNlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5yZW1vdmVDbGFzcyh0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdGN1ciA9ICQudmFrYXRhLmFycmF5X2ZpbHRlcihjdXIsIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gb2JqLnBhcmVudHMuaW5kZXhPZihpZCkgPT09IC0xO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCA9IGN1cjtcblx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZS5pbmRleE9mKCd1cCcpICE9PSAtMSkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0XHQub24oJ2RlbGV0ZV9ub2RlLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0Ly8gYXBwbHkgdXAgKHdob2xlIGhhbmRsZXIpXG5cdFx0XHRcdFx0XHRcdHZhciBwID0gdGhpcy5nZXRfbm9kZShkYXRhLnBhcmVudCksXG5cdFx0XHRcdFx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0aSwgaiwgYywgdG1wLCB0ID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uO1xuXHRcdFx0XHRcdFx0XHR3aGlsZShwICYmIHAuaWQgIT09ICQuanN0cmVlLnJvb3QgJiYgIXAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0pIHtcblx0XHRcdFx0XHRcdFx0XHRjID0gMDtcblx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0YyArPSBtW3AuY2hpbGRyZW5baV1dLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZihqID4gMCAmJiBjID09PSBqKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQucHVzaChwLmlkKTtcblx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUocCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuYXR0cignYXJpYS1zZWxlY3RlZCcsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHAgPSB0aGlzLmdldF9ub2RlKHAucGFyZW50KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdFx0Lm9uKCdtb3ZlX25vZGUuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0XHQvLyBhcHBseSB1cCAod2hvbGUgaGFuZGxlcilcblx0XHRcdFx0XHRcdFx0dmFyIGlzX211bHRpID0gZGF0YS5pc19tdWx0aSxcblx0XHRcdFx0XHRcdFx0XHRvbGRfcGFyID0gZGF0YS5vbGRfcGFyZW50LFxuXHRcdFx0XHRcdFx0XHRcdG5ld19wYXIgPSB0aGlzLmdldF9ub2RlKGRhdGEucGFyZW50KSxcblx0XHRcdFx0XHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0XHRcdFx0XHRwLCBjLCBpLCBqLCB0bXAsIHQgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb247XG5cdFx0XHRcdFx0XHRcdGlmKCFpc19tdWx0aSkge1xuXHRcdFx0XHRcdFx0XHRcdHAgPSB0aGlzLmdldF9ub2RlKG9sZF9wYXIpO1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlKHAgJiYgcC5pZCAhPT0gJC5qc3RyZWUucm9vdCAmJiAhcC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0YyA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjICs9IG1bcC5jaGlsZHJlbltpXV0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihqID4gMCAmJiBjID09PSBqKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLnB1c2gocC5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUocCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcyh0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRwID0gdGhpcy5nZXRfbm9kZShwLnBhcmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHAgPSBuZXdfcGFyO1xuXHRcdFx0XHRcdFx0XHR3aGlsZShwICYmIHAuaWQgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdFx0XHRjID0gMDtcblx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0YyArPSBtW3AuY2hpbGRyZW5baV1dLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZihjID09PSBqKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZighcC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZC5wdXNoKHAuaWQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKHAsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3ModCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkID0gJC52YWthdGEuYXJyYXlfcmVtb3ZlX2l0ZW0odGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCwgcC5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUocCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykucmVtb3ZlQ2xhc3ModCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRwID0gdGhpcy5nZXRfbm9kZShwLnBhcmVudCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIGdldCBhbiBhcnJheSBvZiBhbGwgbm9kZXMgd2hvc2Ugc3RhdGUgaXMgXCJ1bmRldGVybWluZWRcIlxuXHRcdCAqIEBuYW1lIGdldF91bmRldGVybWluZWQoW2Z1bGxdKVxuXHRcdCAqIEBwYXJhbSAge2Jvb2xlYW59IGZ1bGw6IGlmIHNldCB0byBgdHJ1ZWAgdGhlIHJldHVybmVkIGFycmF5IHdpbGwgY29uc2lzdCBvZiB0aGUgZnVsbCBub2RlIG9iamVjdHMsIG90aGVyd2lzZSAtIG9ubHkgSURzIHdpbGwgYmUgcmV0dXJuZWRcblx0XHQgKiBAcmV0dXJuIHtBcnJheX1cblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5nZXRfdW5kZXRlcm1pbmVkID0gZnVuY3Rpb24gKGZ1bGwpIHtcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUuaW5kZXhPZigndW5kZXRlcm1pbmVkJykgPT09IC0xKSB7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHRcdHZhciBpLCBqLCBrLCBsLCBvID0ge30sIG0gPSB0aGlzLl9tb2RlbC5kYXRhLCB0ID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uLCBzID0gdGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCwgcCA9IFtdLCB0dCA9IHRoaXMsIHIgPSBbXTtcblx0XHRcdGZvcihpID0gMCwgaiA9IHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKG1bc1tpXV0gJiYgbVtzW2ldXS5wYXJlbnRzKSB7XG5cdFx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gbVtzW2ldXS5wYXJlbnRzLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdFx0aWYob1ttW3NbaV1dLnBhcmVudHNba11dICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihtW3NbaV1dLnBhcmVudHNba10gIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdFx0b1ttW3NbaV1dLnBhcmVudHNba11dID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0cC5wdXNoKG1bc1tpXV0ucGFyZW50c1trXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBhdHRlbXB0IGZvciBzZXJ2ZXIgc2lkZSB1bmRldGVybWluZWQgc3RhdGVcblx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLWNsb3NlZCcpLm5vdCgnOmhhcyguanN0cmVlLWNoaWxkcmVuKScpXG5cdFx0XHRcdC5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgdG1wID0gdHQuZ2V0X25vZGUodGhpcyksIHRtcDI7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYoIXRtcCkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZighdG1wLnN0YXRlLmxvYWRlZCkge1xuXHRcdFx0XHRcdFx0aWYodG1wLm9yaWdpbmFsICYmIHRtcC5vcmlnaW5hbC5zdGF0ZSAmJiB0bXAub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkICYmIHRtcC5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0aWYob1t0bXAuaWRdID09PSB1bmRlZmluZWQgJiYgdG1wLmlkICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHRcdFx0b1t0bXAuaWRdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRwLnB1c2godG1wLmlkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRmb3IoayA9IDAsIGwgPSB0bXAucGFyZW50cy5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZihvW3RtcC5wYXJlbnRzW2tdXSA9PT0gdW5kZWZpbmVkICYmIHRtcC5wYXJlbnRzW2tdICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvW3RtcC5wYXJlbnRzW2tdXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRwLnB1c2godG1wLnBhcmVudHNba10pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHR0bXAyID0gbVt0bXAuY2hpbGRyZW5fZFtpXV07XG5cdFx0XHRcdFx0XHRcdGlmKCF0bXAyLnN0YXRlLmxvYWRlZCAmJiB0bXAyLm9yaWdpbmFsICYmIHRtcDIub3JpZ2luYWwuc3RhdGUgJiYgdG1wMi5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQgJiYgdG1wMi5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0XHRpZihvW3RtcDIuaWRdID09PSB1bmRlZmluZWQgJiYgdG1wMi5pZCAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0b1t0bXAyLmlkXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRwLnB1c2godG1wMi5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGZvcihrID0gMCwgbCA9IHRtcDIucGFyZW50cy5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKG9bdG1wMi5wYXJlbnRzW2tdXSA9PT0gdW5kZWZpbmVkICYmIHRtcDIucGFyZW50c1trXSAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvW3RtcDIucGFyZW50c1trXV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwLnB1c2godG1wMi5wYXJlbnRzW2tdKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0Zm9yIChpID0gMCwgaiA9IHAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKCFtW3BbaV1dLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdKSB7XG5cdFx0XHRcdFx0ci5wdXNoKGZ1bGwgPyBtW3BbaV1dIDogcFtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiByO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogc2V0IHRoZSB1bmRldGVybWluZWQgc3RhdGUgd2hlcmUgYW5kIGlmIG5lY2Vzc2FyeS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX3VuZGV0ZXJtaW5lZCgpXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuX3VuZGV0ZXJtaW5lZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmKHRoaXMuZWxlbWVudCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblx0XHRcdHZhciBwID0gdGhpcy5nZXRfdW5kZXRlcm1pbmVkKGZhbHNlKSwgaSwgaiwgcztcblxuXHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtdW5kZXRlcm1pbmVkJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS11bmRldGVybWluZWQnKTtcblx0XHRcdGZvciAoaSA9IDAsIGogPSBwLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRzID0gdGhpcy5nZXRfbm9kZShwW2ldLCB0cnVlKTtcblx0XHRcdFx0aWYocyAmJiBzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHMuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuY2hpbGRyZW4oJy5qc3RyZWUtY2hlY2tib3gnKS5hZGRDbGFzcygnanN0cmVlLXVuZGV0ZXJtaW5lZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR0aGlzLnJlZHJhd19ub2RlID0gZnVuY3Rpb24ob2JqLCBkZWVwLCBpc19jYWxsYmFjaywgZm9yY2VfcmVuZGVyKSB7XG5cdFx0XHRvYmogPSBwYXJlbnQucmVkcmF3X25vZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdGlmKG9iaikge1xuXHRcdFx0XHR2YXIgaSwgaiwgdG1wID0gbnVsbCwgaWNvbiA9IG51bGw7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKG9iai5jaGlsZE5vZGVzW2ldICYmIG9iai5jaGlsZE5vZGVzW2ldLmNsYXNzTmFtZSAmJiBvYmouY2hpbGROb2Rlc1tpXS5jbGFzc05hbWUuaW5kZXhPZihcImpzdHJlZS1hbmNob3JcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHR0bXAgPSBvYmouY2hpbGROb2Rlc1tpXTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZih0bXApIHtcblx0XHRcdFx0XHRpZighdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uICYmIHRoaXMuX21vZGVsLmRhdGFbb2JqLmlkXS5zdGF0ZS5jaGVja2VkKSB7IHRtcC5jbGFzc05hbWUgKz0gJyBqc3RyZWUtY2hlY2tlZCc7IH1cblx0XHRcdFx0XHRpY29uID0gX2kuY2xvbmVOb2RlKGZhbHNlKTtcblx0XHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW29iai5pZF0uc3RhdGUuY2hlY2tib3hfZGlzYWJsZWQpIHsgaWNvbi5jbGFzc05hbWUgKz0gJyBqc3RyZWUtY2hlY2tib3gtZGlzYWJsZWQnOyB9XG5cdFx0XHRcdFx0dG1wLmluc2VydEJlZm9yZShpY29uLCB0bXAuY2hpbGROb2Rlc1swXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKCFpc19jYWxsYmFjayAmJiB0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUuaW5kZXhPZigndW5kZXRlcm1pbmVkJykgIT09IC0xKSB7XG5cdFx0XHRcdGlmKHRoaXMuX2RhdGEuY2hlY2tib3gudXRvKSB7IGNsZWFyVGltZW91dCh0aGlzLl9kYXRhLmNoZWNrYm94LnV0byk7IH1cblx0XHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC51dG8gPSBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5fdW5kZXRlcm1pbmVkLCB0aGlzKSwgNTApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHNob3cgdGhlIG5vZGUgY2hlY2tib3ggaWNvbnNcblx0XHQgKiBAbmFtZSBzaG93X2NoZWNrYm94ZXMoKVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLnNob3dfY2hlY2tib3hlcyA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5jaGVja2JveGVzID0gdHJ1ZTsgdGhpcy5nZXRfY29udGFpbmVyX3VsKCkucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtbm8tY2hlY2tib3hlc1wiKTsgfTtcblx0XHQvKipcblx0XHQgKiBoaWRlIHRoZSBub2RlIGNoZWNrYm94IGljb25zXG5cdFx0ICogQG5hbWUgaGlkZV9jaGVja2JveGVzKClcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5oaWRlX2NoZWNrYm94ZXMgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX2RhdGEuY29yZS50aGVtZXMuY2hlY2tib3hlcyA9IGZhbHNlOyB0aGlzLmdldF9jb250YWluZXJfdWwoKS5hZGRDbGFzcyhcImpzdHJlZS1uby1jaGVja2JveGVzXCIpOyB9O1xuXHRcdC8qKlxuXHRcdCAqIHRvZ2dsZSB0aGUgbm9kZSBpY29uc1xuXHRcdCAqIEBuYW1lIHRvZ2dsZV9jaGVja2JveGVzKClcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy50b2dnbGVfY2hlY2tib3hlcyA9IGZ1bmN0aW9uICgpIHsgaWYodGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5jaGVja2JveGVzKSB7IHRoaXMuaGlkZV9jaGVja2JveGVzKCk7IH0gZWxzZSB7IHRoaXMuc2hvd19jaGVja2JveGVzKCk7IH0gfTtcblx0XHQvKipcblx0XHQgKiBjaGVja3MgaWYgYSBub2RlIGlzIGluIGFuIHVuZGV0ZXJtaW5lZCBzdGF0ZVxuXHRcdCAqIEBuYW1lIGlzX3VuZGV0ZXJtaW5lZChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0dGhpcy5pc191bmRldGVybWluZWQgPSBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHR2YXIgcyA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZSwgaSwgaiwgdCA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbiwgZCA9IHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQsIG0gPSB0aGlzLl9tb2RlbC5kYXRhO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPT09IHRydWUgfHwgcy5pbmRleE9mKCd1bmRldGVybWluZWQnKSA9PT0gLTEgfHwgKHMuaW5kZXhPZignZG93bicpID09PSAtMSAmJiBzLmluZGV4T2YoJ3VwJykgPT09IC0xKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZighb2JqLnN0YXRlLmxvYWRlZCAmJiBvYmoub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkID09PSB0cnVlKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKCQuaW5BcnJheShvYmouY2hpbGRyZW5fZFtpXSwgZCkgIT09IC0xIHx8ICghbVtvYmouY2hpbGRyZW5fZFtpXV0uc3RhdGUubG9hZGVkICYmIG1bb2JqLmNoaWxkcmVuX2RbaV1dLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogZGlzYWJsZSBhIG5vZGUncyBjaGVja2JveFxuXHRcdCAqIEBuYW1lIGRpc2FibGVfY2hlY2tib3gob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiBhbiBhcnJheSBjYW4gYmUgdXNlZCB0b29cblx0XHQgKiBAdHJpZ2dlciBkaXNhYmxlX2NoZWNrYm94LmpzdHJlZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmRpc2FibGVfY2hlY2tib3ggPSBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBkb207XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5kaXNhYmxlX2NoZWNrYm94KG9ialt0MV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYoIW9iai5zdGF0ZS5jaGVja2JveF9kaXNhYmxlZCkge1xuXHRcdFx0XHRvYmouc3RhdGUuY2hlY2tib3hfZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHRpZihkb20gJiYgZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdGRvbS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5jaGlsZHJlbignLmpzdHJlZS1jaGVja2JveCcpLmFkZENsYXNzKCdqc3RyZWUtY2hlY2tib3gtZGlzYWJsZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSdzIGNoZWNrYm94IGlzIGRpc2FibGVkXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBkaXNhYmxlX2NoZWNrYm94LmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2Rpc2FibGVfY2hlY2tib3gnLCB7ICdub2RlJyA6IG9iaiB9KTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIGVuYWJsZSBhIG5vZGUncyBjaGVja2JveFxuXHRcdCAqIEBuYW1lIGVuYWJsZV9jaGVja2JveChvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIGFuIGFycmF5IGNhbiBiZSB1c2VkIHRvb1xuXHRcdCAqIEB0cmlnZ2VyIGVuYWJsZV9jaGVja2JveC5qc3RyZWVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5lbmFibGVfY2hlY2tib3ggPSBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBkb207XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5lbmFibGVfY2hlY2tib3gob2JqW3QxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZihvYmouc3RhdGUuY2hlY2tib3hfZGlzYWJsZWQpIHtcblx0XHRcdFx0b2JqLnN0YXRlLmNoZWNrYm94X2Rpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKGRvbSAmJiBkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZG9tLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmNoaWxkcmVuKCcuanN0cmVlLWNoZWNrYm94JykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1jaGVja2JveC1kaXNhYmxlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlJ3MgY2hlY2tib3ggaXMgZW5hYmxlZFxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgZW5hYmxlX2NoZWNrYm94LmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2VuYWJsZV9jaGVja2JveCcsIHsgJ25vZGUnIDogb2JqIH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR0aGlzLmFjdGl2YXRlX25vZGUgPSBmdW5jdGlvbiAob2JqLCBlKSB7XG5cdFx0XHRpZigkKGUudGFyZ2V0KS5oYXNDbGFzcygnanN0cmVlLWNoZWNrYm94LWRpc2FibGVkJykpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uICYmICh0aGlzLnNldHRpbmdzLmNoZWNrYm94Lndob2xlX25vZGUgfHwgJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2pzdHJlZS1jaGVja2JveCcpKSkge1xuXHRcdFx0XHRlLmN0cmxLZXkgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uIHx8ICghdGhpcy5zZXR0aW5ncy5jaGVja2JveC53aG9sZV9ub2RlICYmICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnanN0cmVlLWNoZWNrYm94JykpKSB7XG5cdFx0XHRcdHJldHVybiBwYXJlbnQuYWN0aXZhdGVfbm9kZS5jYWxsKHRoaXMsIG9iaiwgZSk7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLmlzX2Rpc2FibGVkKG9iaikpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5pc19jaGVja2VkKG9iaikpIHtcblx0XHRcdFx0dGhpcy51bmNoZWNrX25vZGUob2JqLCBlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLmNoZWNrX25vZGUob2JqLCBlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMudHJpZ2dlcignYWN0aXZhdGVfbm9kZScsIHsgJ25vZGUnIDogdGhpcy5nZXRfbm9kZShvYmopIH0pO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBDYXNjYWRlcyBjaGVja2VkIHN0YXRlIHRvIGEgbm9kZSBhbmQgYWxsIGl0cyBkZXNjZW5kYW50cy4gVGhpcyBmdW5jdGlvbiBkb2VzIE5PVCBhZmZlY3QgaGlkZGVuIGFuZCBkaXNhYmxlZCBub2RlcyAob3IgdGhlaXIgZGVzY2VuZGFudHMpLlxuXHRcdCAqIEhvd2V2ZXIgaWYgdGhlc2UgdW5hZmZlY3RlZCBub2RlcyBhcmUgYWxyZWFkeSBzZWxlY3RlZCB0aGVpciBpZHMgd2lsbCBiZSBpbmNsdWRlZCBpbiB0aGUgcmV0dXJuZWQgYXJyYXkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaWQgdGhlIG5vZGUgSURcblx0XHQgKiBAcGFyYW0ge2Jvb2x9IGNoZWNrZWRTdGF0ZSBzaG91bGQgdGhlIG5vZGVzIGJlIGNoZWNrZWQgb3Igbm90XG5cdFx0ICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiBhbGwgbm9kZSBpZCdzIChpbiB0aGlzIHRyZWUgYnJhbmNoKSB0aGF0IGFyZSBjaGVja2VkLlxuXHRcdCAqL1xuXHRcdHRoaXMuX2Nhc2NhZGVfbmV3X2NoZWNrZWRfc3RhdGUgPSBmdW5jdGlvbiAoaWQsIGNoZWNrZWRTdGF0ZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIHQgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb247XG5cdFx0XHR2YXIgbm9kZSA9IHRoaXMuX21vZGVsLmRhdGFbaWRdO1xuXHRcdFx0dmFyIHNlbGVjdGVkTm9kZUlkcyA9IFtdO1xuXHRcdFx0dmFyIHNlbGVjdGVkQ2hpbGRyZW5JZHMgPSBbXSwgaSwgaiwgc2VsZWN0ZWRDaGlsZElkcztcblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQodGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlX3RvX2Rpc2FibGVkIHx8ICFub2RlLnN0YXRlLmRpc2FibGVkKSAmJlxuXHRcdFx0XHQodGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlX3RvX2hpZGRlbiB8fCAhbm9kZS5zdGF0ZS5oaWRkZW4pXG5cdFx0XHQpIHtcblx0XHRcdFx0Ly9GaXJzdCB0cnkgYW5kIGNoZWNrL3VuY2hlY2sgdGhlIGNoaWxkcmVuXG5cdFx0XHRcdGlmIChub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0Zm9yIChpID0gMCwgaiA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXIgY2hpbGRJZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cdFx0XHRcdFx0XHRzZWxlY3RlZENoaWxkSWRzID0gc2VsZi5fY2FzY2FkZV9uZXdfY2hlY2tlZF9zdGF0ZShjaGlsZElkLCBjaGVja2VkU3RhdGUpO1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWROb2RlSWRzID0gc2VsZWN0ZWROb2RlSWRzLmNvbmNhdChzZWxlY3RlZENoaWxkSWRzKTtcblx0XHRcdFx0XHRcdGlmIChzZWxlY3RlZENoaWxkSWRzLmluZGV4T2YoY2hpbGRJZCkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRzZWxlY3RlZENoaWxkcmVuSWRzLnB1c2goY2hpbGRJZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGRvbSA9IHNlbGYuZ2V0X25vZGUobm9kZSwgdHJ1ZSk7XG5cblx0XHRcdFx0Ly9BIG5vZGUncyBzdGF0ZSBpcyB1bmRldGVybWluZWQgaWYgc29tZSBidXQgbm90IGFsbCBvZiBpdCdzIGNoaWxkcmVuIGFyZSBjaGVja2VkL3NlbGVjdGVkIC5cblx0XHRcdFx0dmFyIHVuZGV0ZXJtaW5lZCA9IHNlbGVjdGVkQ2hpbGRyZW5JZHMubGVuZ3RoID4gMCAmJiBzZWxlY3RlZENoaWxkcmVuSWRzLmxlbmd0aCA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoO1xuXG5cdFx0XHRcdGlmKG5vZGUub3JpZ2luYWwgJiYgbm9kZS5vcmlnaW5hbC5zdGF0ZSAmJiBub2RlLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCkge1xuXHRcdFx0XHRcdG5vZGUub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkID0gdW5kZXRlcm1pbmVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9JZiBhIG5vZGUgaXMgdW5kZXRlcm1pbmVkIHRoZW4gcmVtb3ZlIHNlbGVjdGVkIGNsYXNzXG5cdFx0XHRcdGlmICh1bmRldGVybWluZWQpIHtcblx0XHRcdFx0XHRub2RlLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gZmFsc2U7XG5cdFx0XHRcdFx0ZG9tLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykucmVtb3ZlQ2xhc3ModCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL090aGVyd2lzZSwgaWYgdGhlIGNoZWNrZWRTdGF0ZSA9PT0gdHJ1ZSAoaS5lLiB0aGUgbm9kZSBpcyBiZWluZyBjaGVja2VkIG5vdykgYW5kIGFsbCBvZiB0aGUgbm9kZSdzIGNoaWxkcmVuIGFyZSBjaGVja2VkIChpZiBpdCBoYXMgYW55IGNoaWxkcmVuKSxcblx0XHRcdFx0Ly9jaGVjayB0aGUgbm9kZSBhbmQgc3R5bGUgaXQgY29ycmVjdGx5LlxuXHRcdFx0XHRlbHNlIGlmIChjaGVja2VkU3RhdGUgJiYgc2VsZWN0ZWRDaGlsZHJlbklkcy5sZW5ndGggPT09IG5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0bm9kZS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IGNoZWNrZWRTdGF0ZTtcblx0XHRcdFx0XHRzZWxlY3RlZE5vZGVJZHMucHVzaChub2RlLmlkKTtcblxuXHRcdFx0XHRcdGRvbS5hdHRyKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3ModCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRub2RlLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gZmFsc2U7XG5cdFx0XHRcdFx0ZG9tLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykucmVtb3ZlQ2xhc3ModCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNlbGVjdGVkQ2hpbGRJZHMgPSB0aGlzLmdldF9jaGVja2VkX2Rlc2NlbmRhbnRzKGlkKTtcblxuXHRcdFx0XHRpZiAobm9kZS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSkge1xuXHRcdFx0XHRcdHNlbGVjdGVkQ2hpbGRJZHMucHVzaChub2RlLmlkKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNlbGVjdGVkTm9kZUlkcyA9IHNlbGVjdGVkTm9kZUlkcy5jb25jYXQoc2VsZWN0ZWRDaGlsZElkcyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzZWxlY3RlZE5vZGVJZHM7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEdldHMgaWRzIG9mIG5vZGVzIHNlbGVjdGVkIGluIGJyYW5jaCAob2YgdHJlZSkgc3BlY2lmaWVkIGJ5IGlkIChkb2VzIG5vdCBpbmNsdWRlIHRoZSBub2RlIHNwZWNpZmllZCBieSBpZClcblx0XHQgKiBAbmFtZSBnZXRfY2hlY2tlZF9kZXNjZW5kYW50cyhvYmopXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGlkIHRoZSBub2RlIElEXG5cdFx0ICogQHJldHVybiB7QXJyYXl9IGFycmF5IG9mIElEc1xuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmdldF9jaGVja2VkX2Rlc2NlbmRhbnRzID0gZnVuY3Rpb24gKGlkKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgdCA9IHNlbGYuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbjtcblx0XHRcdHZhciBub2RlID0gc2VsZi5fbW9kZWwuZGF0YVtpZF07XG5cblx0XHRcdHJldHVybiAkLnZha2F0YS5hcnJheV9maWx0ZXIobm9kZS5jaGlsZHJlbl9kLCBmdW5jdGlvbihfaWQpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGYuX21vZGVsLmRhdGFbX2lkXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBjaGVjayBhIG5vZGUgKG9ubHkgaWYgdGllX3NlbGVjdGlvbiBpbiBjaGVja2JveCBzZXR0aW5ncyBpcyBmYWxzZSwgb3RoZXJ3aXNlIHNlbGVjdF9ub2RlIHdpbGwgYmUgY2FsbGVkIGludGVybmFsbHkpXG5cdFx0ICogQG5hbWUgY2hlY2tfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIGFuIGFycmF5IGNhbiBiZSB1c2VkIHRvIGNoZWNrIG11bHRpcGxlIG5vZGVzXG5cdFx0ICogQHRyaWdnZXIgY2hlY2tfbm9kZS5qc3RyZWVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5jaGVja19ub2RlID0gZnVuY3Rpb24gKG9iaiwgZSkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7IHJldHVybiB0aGlzLnNlbGVjdF9ub2RlKG9iaiwgZmFsc2UsIHRydWUsIGUpOyB9XG5cdFx0XHR2YXIgZG9tLCB0MSwgdDIsIHRoO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuY2hlY2tfbm9kZShvYmpbdDFdLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKCFvYmouc3RhdGUuY2hlY2tlZCkge1xuXHRcdFx0XHRvYmouc3RhdGUuY2hlY2tlZCA9IHRydWU7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQucHVzaChvYmouaWQpO1xuXHRcdFx0XHRpZihkb20gJiYgZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdGRvbS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcygnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBjaGVja2VkIChvbmx5IGlmIHRpZV9zZWxlY3Rpb24gaW4gY2hlY2tib3ggc2V0dGluZ3MgaXMgZmFsc2UpXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBjaGVja19ub2RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBldmVudCAoaWYgYW55KSB0aGF0IHRyaWdnZXJlZCB0aGlzIGNoZWNrX25vZGVcblx0XHRcdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGVja19ub2RlJywgeyAnbm9kZScgOiBvYmosICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLCAnZXZlbnQnIDogZSB9KTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHVuY2hlY2sgYSBub2RlIChvbmx5IGlmIHRpZV9zZWxlY3Rpb24gaW4gY2hlY2tib3ggc2V0dGluZ3MgaXMgZmFsc2UsIG90aGVyd2lzZSBkZXNlbGVjdF9ub2RlIHdpbGwgYmUgY2FsbGVkIGludGVybmFsbHkpXG5cdFx0ICogQG5hbWUgdW5jaGVja19ub2RlKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogYW4gYXJyYXkgY2FuIGJlIHVzZWQgdG8gdW5jaGVjayBtdWx0aXBsZSBub2Rlc1xuXHRcdCAqIEB0cmlnZ2VyIHVuY2hlY2tfbm9kZS5qc3RyZWVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy51bmNoZWNrX25vZGUgPSBmdW5jdGlvbiAob2JqLCBlKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHsgcmV0dXJuIHRoaXMuZGVzZWxlY3Rfbm9kZShvYmosIGZhbHNlLCBlKTsgfVxuXHRcdFx0dmFyIHQxLCB0MiwgZG9tO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMudW5jaGVja19ub2RlKG9ialt0MV0sIGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYob2JqLnN0YXRlLmNoZWNrZWQpIHtcblx0XHRcdFx0b2JqLnN0YXRlLmNoZWNrZWQgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCA9ICQudmFrYXRhLmFycmF5X3JlbW92ZV9pdGVtKHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQsIG9iai5pZCk7XG5cdFx0XHRcdGlmKGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRkb20uY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgdW5jaGVja2VkIChvbmx5IGlmIHRpZV9zZWxlY3Rpb24gaW4gY2hlY2tib3ggc2V0dGluZ3MgaXMgZmFsc2UpXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSB1bmNoZWNrX25vZGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIGV2ZW50IChpZiBhbnkpIHRoYXQgdHJpZ2dlcmVkIHRoaXMgdW5jaGVja19ub2RlXG5cdFx0XHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcigndW5jaGVja19ub2RlJywgeyAnbm9kZScgOiBvYmosICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLCAnZXZlbnQnIDogZSB9KTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrcyBhbGwgbm9kZXMgaW4gdGhlIHRyZWUgKG9ubHkgaWYgdGllX3NlbGVjdGlvbiBpbiBjaGVja2JveCBzZXR0aW5ncyBpcyBmYWxzZSwgb3RoZXJ3aXNlIHNlbGVjdF9hbGwgd2lsbCBiZSBjYWxsZWQgaW50ZXJuYWxseSlcblx0XHQgKiBAbmFtZSBjaGVja19hbGwoKVxuXHRcdCAqIEB0cmlnZ2VyIGNoZWNrX2FsbC5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuY2hlY2tfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7IHJldHVybiB0aGlzLnNlbGVjdF9hbGwoKTsgfVxuXHRcdFx0dmFyIHRtcCA9IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQuY29uY2F0KFtdKSwgaSwgajtcblx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQgPSB0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdLmNoaWxkcmVuX2QuY29uY2F0KCk7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW3RoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWRbaV1dKSB7XG5cdFx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVt0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkW2ldXS5zdGF0ZS5jaGVja2VkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5yZWRyYXcodHJ1ZSk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFsbCBub2RlcyBhcmUgY2hlY2tlZCAob25seSBpZiB0aWVfc2VsZWN0aW9uIGluIGNoZWNrYm94IHNldHRpbmdzIGlzIGZhbHNlKVxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjaGVja19hbGwuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjaGVja19hbGwnLCB7ICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkIH0pO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogdW5jaGVjayBhbGwgY2hlY2tlZCBub2RlcyAob25seSBpZiB0aWVfc2VsZWN0aW9uIGluIGNoZWNrYm94IHNldHRpbmdzIGlzIGZhbHNlLCBvdGhlcndpc2UgZGVzZWxlY3RfYWxsIHdpbGwgYmUgY2FsbGVkIGludGVybmFsbHkpXG5cdFx0ICogQG5hbWUgdW5jaGVja19hbGwoKVxuXHRcdCAqIEB0cmlnZ2VyIHVuY2hlY2tfYWxsLmpzdHJlZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLnVuY2hlY2tfYWxsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7IHJldHVybiB0aGlzLmRlc2VsZWN0X2FsbCgpOyB9XG5cdFx0XHR2YXIgdG1wID0gdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZC5jb25jYXQoW10pLCBpLCBqO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVt0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkW2ldXSkge1xuXHRcdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZFtpXV0uc3RhdGUuY2hlY2tlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkID0gW107XG5cdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS1jaGVja2VkJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFsbCBub2RlcyBhcmUgdW5jaGVja2VkIChvbmx5IGlmIHRpZV9zZWxlY3Rpb24gaW4gY2hlY2tib3ggc2V0dGluZ3MgaXMgZmFsc2UpXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHVuY2hlY2tfYWxsLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIHByZXZpb3VzIHNlbGVjdGlvblxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcigndW5jaGVja19hbGwnLCB7ICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLCAnbm9kZScgOiB0bXAgfSk7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBjaGVja3MgaWYgYSBub2RlIGlzIGNoZWNrZWQgKGlmIHRpZV9zZWxlY3Rpb24gaXMgb24gaW4gdGhlIHNldHRpbmdzIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHNhbWUgYXMgaXNfc2VsZWN0ZWQpXG5cdFx0ICogQG5hbWUgaXNfY2hlY2tlZChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmlzX2NoZWNrZWQgPSBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHsgcmV0dXJuIHRoaXMuaXNfc2VsZWN0ZWQob2JqKTsgfVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRyZXR1cm4gb2JqLnN0YXRlLmNoZWNrZWQ7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBnZXQgYW4gYXJyYXkgb2YgYWxsIGNoZWNrZWQgbm9kZXMgKGlmIHRpZV9zZWxlY3Rpb24gaXMgb24gaW4gdGhlIHNldHRpbmdzIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHNhbWUgYXMgZ2V0X3NlbGVjdGVkKVxuXHRcdCAqIEBuYW1lIGdldF9jaGVja2VkKFtmdWxsXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gIGZ1bGwgaWYgc2V0IHRvIGB0cnVlYCB0aGUgcmV0dXJuZWQgYXJyYXkgd2lsbCBjb25zaXN0IG9mIHRoZSBmdWxsIG5vZGUgb2JqZWN0cywgb3RoZXJ3aXNlIC0gb25seSBJRHMgd2lsbCBiZSByZXR1cm5lZFxuXHRcdCAqIEByZXR1cm4ge0FycmF5fVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmdldF9jaGVja2VkID0gZnVuY3Rpb24gKGZ1bGwpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikgeyByZXR1cm4gdGhpcy5nZXRfc2VsZWN0ZWQoZnVsbCk7IH1cblx0XHRcdHJldHVybiBmdWxsID8gJC5tYXAodGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCwgJC5wcm94eShmdW5jdGlvbiAoaSkgeyByZXR1cm4gdGhpcy5nZXRfbm9kZShpKTsgfSwgdGhpcykpIDogdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZC5zbGljZSgpO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogZ2V0IGFuIGFycmF5IG9mIGFsbCB0b3AgbGV2ZWwgY2hlY2tlZCBub2RlcyAoaWdub3JpbmcgY2hpbGRyZW4gb2YgY2hlY2tlZCBub2RlcykgKGlmIHRpZV9zZWxlY3Rpb24gaXMgb24gaW4gdGhlIHNldHRpbmdzIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHNhbWUgYXMgZ2V0X3RvcF9zZWxlY3RlZClcblx0XHQgKiBAbmFtZSBnZXRfdG9wX2NoZWNrZWQoW2Z1bGxdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgZnVsbCBpZiBzZXQgdG8gYHRydWVgIHRoZSByZXR1cm5lZCBhcnJheSB3aWxsIGNvbnNpc3Qgb2YgdGhlIGZ1bGwgbm9kZSBvYmplY3RzLCBvdGhlcndpc2UgLSBvbmx5IElEcyB3aWxsIGJlIHJldHVybmVkXG5cdFx0ICogQHJldHVybiB7QXJyYXl9XG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuZ2V0X3RvcF9jaGVja2VkID0gZnVuY3Rpb24gKGZ1bGwpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikgeyByZXR1cm4gdGhpcy5nZXRfdG9wX3NlbGVjdGVkKGZ1bGwpOyB9XG5cdFx0XHR2YXIgdG1wID0gdGhpcy5nZXRfY2hlY2tlZCh0cnVlKSxcblx0XHRcdFx0b2JqID0ge30sIGksIGosIGssIGw7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdG9ialt0bXBbaV0uaWRdID0gdG1wW2ldO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRmb3IoayA9IDAsIGwgPSB0bXBbaV0uY2hpbGRyZW5fZC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRpZihvYmpbdG1wW2ldLmNoaWxkcmVuX2Rba11dKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgb2JqW3RtcFtpXS5jaGlsZHJlbl9kW2tdXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRtcCA9IFtdO1xuXHRcdFx0Zm9yKGkgaW4gb2JqKSB7XG5cdFx0XHRcdGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdHRtcC5wdXNoKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnVsbCA/ICQubWFwKHRtcCwgJC5wcm94eShmdW5jdGlvbiAoaSkgeyByZXR1cm4gdGhpcy5nZXRfbm9kZShpKTsgfSwgdGhpcykpIDogdG1wO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogZ2V0IGFuIGFycmF5IG9mIGFsbCBib3R0b20gbGV2ZWwgY2hlY2tlZCBub2RlcyAoaWdub3Jpbmcgc2VsZWN0ZWQgcGFyZW50cykgKGlmIHRpZV9zZWxlY3Rpb24gaXMgb24gaW4gdGhlIHNldHRpbmdzIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHNhbWUgYXMgZ2V0X2JvdHRvbV9zZWxlY3RlZClcblx0XHQgKiBAbmFtZSBnZXRfYm90dG9tX2NoZWNrZWQoW2Z1bGxdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgZnVsbCBpZiBzZXQgdG8gYHRydWVgIHRoZSByZXR1cm5lZCBhcnJheSB3aWxsIGNvbnNpc3Qgb2YgdGhlIGZ1bGwgbm9kZSBvYmplY3RzLCBvdGhlcndpc2UgLSBvbmx5IElEcyB3aWxsIGJlIHJldHVybmVkXG5cdFx0ICogQHJldHVybiB7QXJyYXl9XG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuZ2V0X2JvdHRvbV9jaGVja2VkID0gZnVuY3Rpb24gKGZ1bGwpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikgeyByZXR1cm4gdGhpcy5nZXRfYm90dG9tX3NlbGVjdGVkKGZ1bGwpOyB9XG5cdFx0XHR2YXIgdG1wID0gdGhpcy5nZXRfY2hlY2tlZCh0cnVlKSxcblx0XHRcdFx0b2JqID0gW10sIGksIGo7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKCF0bXBbaV0uY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0b2JqLnB1c2godG1wW2ldLmlkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZ1bGwgPyAkLm1hcChvYmosICQucHJveHkoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIHRoaXMuZ2V0X25vZGUoaSk7IH0sIHRoaXMpKSA6IG9iajtcblx0XHR9O1xuXHRcdHRoaXMubG9hZF9ub2RlID0gZnVuY3Rpb24gKG9iaiwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBrLCBsLCBpLCBqLCBjLCB0bXA7XG5cdFx0XHRpZighJC5pc0FycmF5KG9iaikgJiYgIXRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikge1xuXHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRcdGlmKHRtcCAmJiB0bXAuc3RhdGUubG9hZGVkKSB7XG5cdFx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gdG1wLmNoaWxkcmVuX2QubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW3RtcC5jaGlsZHJlbl9kW2tdXS5zdGF0ZS5jaGVja2VkKSB7XG5cdFx0XHRcdFx0XHRcdGMgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkID0gJC52YWthdGEuYXJyYXlfcmVtb3ZlX2l0ZW0odGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCwgdG1wLmNoaWxkcmVuX2Rba10pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhcmVudC5sb2FkX25vZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9O1xuXHRcdHRoaXMuZ2V0X3N0YXRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHN0YXRlID0gcGFyZW50LmdldF9zdGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7IHJldHVybiBzdGF0ZTsgfVxuXHRcdFx0c3RhdGUuY2hlY2tib3ggPSB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLnNsaWNlKCk7XG5cdFx0XHRyZXR1cm4gc3RhdGU7XG5cdFx0fTtcblx0XHR0aGlzLnNldF9zdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgY2FsbGJhY2spIHtcblx0XHRcdHZhciByZXMgPSBwYXJlbnQuc2V0X3N0YXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRpZihyZXMgJiYgc3RhdGUuY2hlY2tib3gpIHtcblx0XHRcdFx0aWYoIXRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikge1xuXHRcdFx0XHRcdHRoaXMudW5jaGVja19hbGwoKTtcblx0XHRcdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0XHRcdCQuZWFjaChzdGF0ZS5jaGVja2JveCwgZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdF90aGlzLmNoZWNrX25vZGUodik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGVsZXRlIHN0YXRlLmNoZWNrYm94O1xuXHRcdFx0XHR0aGlzLnNldF9zdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzO1xuXHRcdH07XG5cdFx0dGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKHNraXBfbG9hZGluZywgZm9yZ2V0X3N0YXRlKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhcmVudC5yZWZyZXNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fTtcblx0fTtcblxuXHQvLyBpbmNsdWRlIHRoZSBjaGVja2JveCBwbHVnaW4gYnkgZGVmYXVsdFxuXHQvLyAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zLnB1c2goXCJjaGVja2JveFwiKTtcblxuXG4vKipcbiAqICMjIyBDb25kaXRpb25hbHNlbGVjdCBwbHVnaW5cbiAqXG4gKiBUaGlzIHBsdWdpbiBhbGxvd3MgZGVmaW5pbmcgYSBjYWxsYmFjayB0byBhbGxvdyBvciBkZW55IG5vZGUgc2VsZWN0aW9uIGJ5IHVzZXIgaW5wdXQgKGFjdGl2YXRlIG5vZGUgbWV0aG9kKS5cbiAqL1xuXG5cdC8qKlxuXHQgKiBhIGNhbGxiYWNrIChmdW5jdGlvbikgd2hpY2ggaXMgaW52b2tlZCBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSBhbmQgcmVjZWl2ZXMgdHdvIGFyZ3VtZW50cyAtIHRoZSBub2RlIGFuZCB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGBhY3RpdmF0ZV9ub2RlYCBjYWxsLiBSZXR1cm5pbmcgZmFsc2UgcHJldmVudHMgd29ya2luZyB3aXRoIHRoZSBub2RlLCByZXR1cm5pbmcgdHJ1ZSBhbGxvd3MgaW52b2tpbmcgYWN0aXZhdGVfbm9kZS4gRGVmYXVsdHMgdG8gcmV0dXJuaW5nIGB0cnVlYC5cblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3gudmlzaWJsZVxuXHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy5jb25kaXRpb25hbHNlbGVjdCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH07XG5cdCQuanN0cmVlLnBsdWdpbnMuY29uZGl0aW9uYWxzZWxlY3QgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0Ly8gb3duIGZ1bmN0aW9uXG5cdFx0dGhpcy5hY3RpdmF0ZV9ub2RlID0gZnVuY3Rpb24gKG9iaiwgZSkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jb25kaXRpb25hbHNlbGVjdC5jYWxsKHRoaXMsIHRoaXMuZ2V0X25vZGUob2JqKSwgZSkpIHtcblx0XHRcdFx0cmV0dXJuIHBhcmVudC5hY3RpdmF0ZV9ub2RlLmNhbGwodGhpcywgb2JqLCBlKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXG5cbi8qKlxuICogIyMjIENvbnRleHRtZW51IHBsdWdpblxuICpcbiAqIFNob3dzIGEgY29udGV4dCBtZW51IHdoZW4gYSBub2RlIGlzIHJpZ2h0LWNsaWNrZWQuXG4gKi9cblxuXHQvKipcblx0ICogc3RvcmVzIGFsbCBkZWZhdWx0cyBmb3IgdGhlIGNvbnRleHRtZW51IHBsdWdpblxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb250ZXh0bWVudVxuXHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy5jb250ZXh0bWVudSA9IHtcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgbm9kZSBzaG91bGQgYmUgc2VsZWN0ZWQgd2hlbiB0aGUgY29udGV4dCBtZW51IGlzIGludm9rZWQgb24gaXQuIERlZmF1bHRzIHRvIGB0cnVlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb250ZXh0bWVudS5zZWxlY3Rfbm9kZVxuXHRcdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0XHQgKi9cblx0XHRzZWxlY3Rfbm9kZSA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIG1lbnUgc2hvdWxkIGJlIHNob3duIGFsaWduZWQgd2l0aCB0aGUgbm9kZS4gRGVmYXVsdHMgdG8gYHRydWVgLCBvdGhlcndpc2UgdGhlIG1vdXNlIGNvb3JkaW5hdGVzIGFyZSB1c2VkLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvbnRleHRtZW51LnNob3dfYXRfbm9kZVxuXHRcdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0XHQgKi9cblx0XHRzaG93X2F0X25vZGUgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGFuIG9iamVjdCBvZiBhY3Rpb25zLCBvciBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBhIG5vZGUgYW5kIGEgY2FsbGJhY2sgZnVuY3Rpb24gYW5kIGNhbGxzIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB3aXRoIGFuIG9iamVjdCBvZiBhY3Rpb25zIGF2YWlsYWJsZSBmb3IgdGhhdCBub2RlICh5b3UgY2FuIGFsc28gcmV0dXJuIHRoZSBpdGVtcyB0b28pLlxuXHRcdCAqXG5cdFx0ICogRWFjaCBhY3Rpb24gY29uc2lzdHMgb2YgYSBrZXkgKGEgdW5pcXVlIG5hbWUpIGFuZCBhIHZhbHVlIHdoaWNoIGlzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyAob25seSBsYWJlbCBhbmQgYWN0aW9uIGFyZSByZXF1aXJlZCkuIE9uY2UgYSBtZW51IGl0ZW0gaXMgYWN0aXZhdGVkIHRoZSBgYWN0aW9uYCBmdW5jdGlvbiB3aWxsIGJlIGludm9rZWQgd2l0aCBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIGtleXM6IGl0ZW0gLSB0aGUgY29udGV4dG1lbnUgaXRlbSBkZWZpbml0aW9uIGFzIHNlZW4gYmVsb3csIHJlZmVyZW5jZSAtIHRoZSBET00gbm9kZSB0aGF0IHdhcyB1c2VkICh0aGUgdHJlZSBub2RlKSwgZWxlbWVudCAtIHRoZSBjb250ZXh0bWVudSBET00gZWxlbWVudCwgcG9zaXRpb24gLSBhbiBvYmplY3Qgd2l0aCB4L3kgcHJvcGVydGllcyBpbmRpY2F0aW5nIHRoZSBwb3NpdGlvbiBvZiB0aGUgbWVudS5cblx0XHQgKlxuXHRcdCAqICogYHNlcGFyYXRvcl9iZWZvcmVgIC0gYSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlcmUgc2hvdWxkIGJlIGEgc2VwYXJhdG9yIGJlZm9yZSB0aGlzIGl0ZW1cblx0XHQgKiAqIGBzZXBhcmF0b3JfYWZ0ZXJgIC0gYSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlcmUgc2hvdWxkIGJlIGEgc2VwYXJhdG9yIGFmdGVyIHRoaXMgaXRlbVxuXHRcdCAqICogYF9kaXNhYmxlZGAgLSBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGlzIGFjdGlvbiBzaG91bGQgYmUgZGlzYWJsZWRcblx0XHQgKiAqIGBsYWJlbGAgLSBhIHN0cmluZyAtIHRoZSBuYW1lIG9mIHRoZSBhY3Rpb24gKGNvdWxkIGJlIGEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgc3RyaW5nKVxuXHRcdCAqICogYHRpdGxlYCAtIGEgc3RyaW5nIC0gYW4gb3B0aW9uYWwgdG9vbHRpcCBmb3IgdGhlIGl0ZW1cblx0XHQgKiAqIGBhY3Rpb25gIC0gYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBpZiB0aGlzIGl0ZW0gaXMgY2hvc2VuLCB0aGUgZnVuY3Rpb24gd2lsbCByZWNlaXZlIFxuXHRcdCAqICogYGljb25gIC0gYSBzdHJpbmcsIGNhbiBiZSBhIHBhdGggdG8gYW4gaWNvbiBvciBhIGNsYXNzTmFtZSwgaWYgdXNpbmcgYW4gaW1hZ2UgdGhhdCBpcyBpbiB0aGUgY3VycmVudCBkaXJlY3RvcnkgdXNlIGEgYC4vYCBwcmVmaXgsIG90aGVyd2lzZSBpdCB3aWxsIGJlIGRldGVjdGVkIGFzIGEgY2xhc3Ncblx0XHQgKiAqIGBzaG9ydGN1dGAgLSBrZXlDb2RlIHdoaWNoIHdpbGwgdHJpZ2dlciB0aGUgYWN0aW9uIGlmIHRoZSBtZW51IGlzIG9wZW4gKGZvciBleGFtcGxlIGAxMTNgIGZvciByZW5hbWUsIHdoaWNoIGVxdWFscyBGMilcblx0XHQgKiAqIGBzaG9ydGN1dF9sYWJlbGAgLSBzaG9ydGN1dCBsYWJlbCAobGlrZSBmb3IgZXhhbXBsZSBgRjJgIGZvciByZW5hbWUpXG5cdFx0ICogKiBgc3VibWVudWAgLSBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzdHJ1Y3R1cmUgYXMgJC5qc3RyZWUuZGVmYXVsdHMuY29udGV4dG1lbnUuaXRlbXMgd2hpY2ggY2FuIGJlIHVzZWQgdG8gY3JlYXRlIGEgc3VibWVudSAtIGVhY2gga2V5IHdpbGwgYmUgcmVuZGVyZWQgYXMgYSBzZXBhcmF0ZSBvcHRpb24gaW4gYSBzdWJtZW51IHRoYXQgd2lsbCBhcHBlYXIgb25jZSB0aGUgY3VycmVudCBpdGVtIGlzIGhvdmVyZWRcblx0XHQgKlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvbnRleHRtZW51Lml0ZW1zXG5cdFx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHRcdCAqL1xuXHRcdGl0ZW1zIDogZnVuY3Rpb24gKG8sIGNiKSB7IC8vIENvdWxkIGJlIGFuIG9iamVjdCBkaXJlY3RseVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XCJjcmVhdGVcIiA6IHtcblx0XHRcdFx0XHRcInNlcGFyYXRvcl9iZWZvcmVcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcInNlcGFyYXRvcl9hZnRlclwiXHQ6IHRydWUsXG5cdFx0XHRcdFx0XCJfZGlzYWJsZWRcIlx0XHRcdDogZmFsc2UsIC8vKHRoaXMuY2hlY2soXCJjcmVhdGVfbm9kZVwiLCBkYXRhLnJlZmVyZW5jZSwge30sIFwibGFzdFwiKSksXG5cdFx0XHRcdFx0XCJsYWJlbFwiXHRcdFx0XHQ6IFwiQ3JlYXRlXCIsXG5cdFx0XHRcdFx0XCJhY3Rpb25cIlx0XHRcdDogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZhciBpbnN0ID0gJC5qc3RyZWUucmVmZXJlbmNlKGRhdGEucmVmZXJlbmNlKSxcblx0XHRcdFx0XHRcdFx0b2JqID0gaW5zdC5nZXRfbm9kZShkYXRhLnJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0XHRpbnN0LmNyZWF0ZV9ub2RlKG9iaiwge30sIFwibGFzdFwiLCBmdW5jdGlvbiAobmV3X25vZGUpIHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRpbnN0LmVkaXQobmV3X25vZGUpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIChleCkge1xuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBpbnN0LmVkaXQobmV3X25vZGUpOyB9LDApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwicmVuYW1lXCIgOiB7XG5cdFx0XHRcdFx0XCJzZXBhcmF0b3JfYmVmb3JlXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XCJzZXBhcmF0b3JfYWZ0ZXJcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcIl9kaXNhYmxlZFwiXHRcdFx0OiBmYWxzZSwgLy8odGhpcy5jaGVjayhcInJlbmFtZV9ub2RlXCIsIGRhdGEucmVmZXJlbmNlLCB0aGlzLmdldF9wYXJlbnQoZGF0YS5yZWZlcmVuY2UpLCBcIlwiKSksXG5cdFx0XHRcdFx0XCJsYWJlbFwiXHRcdFx0XHQ6IFwiUmVuYW1lXCIsXG5cdFx0XHRcdFx0LyohXG5cdFx0XHRcdFx0XCJzaG9ydGN1dFwiXHRcdFx0OiAxMTMsXG5cdFx0XHRcdFx0XCJzaG9ydGN1dF9sYWJlbFwiXHQ6ICdGMicsXG5cdFx0XHRcdFx0XCJpY29uXCJcdFx0XHRcdDogXCJnbHlwaGljb24gZ2x5cGhpY29uLWxlYWZcIixcblx0XHRcdFx0XHQqL1xuXHRcdFx0XHRcdFwiYWN0aW9uXCJcdFx0XHQ6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2YXIgaW5zdCA9ICQuanN0cmVlLnJlZmVyZW5jZShkYXRhLnJlZmVyZW5jZSksXG5cdFx0XHRcdFx0XHRcdG9iaiA9IGluc3QuZ2V0X25vZGUoZGF0YS5yZWZlcmVuY2UpO1xuXHRcdFx0XHRcdFx0aW5zdC5lZGl0KG9iaik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcInJlbW92ZVwiIDoge1xuXHRcdFx0XHRcdFwic2VwYXJhdG9yX2JlZm9yZVwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFwiaWNvblwiXHRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFwic2VwYXJhdG9yX2FmdGVyXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XCJfZGlzYWJsZWRcIlx0XHRcdDogZmFsc2UsIC8vKHRoaXMuY2hlY2soXCJkZWxldGVfbm9kZVwiLCBkYXRhLnJlZmVyZW5jZSwgdGhpcy5nZXRfcGFyZW50KGRhdGEucmVmZXJlbmNlKSwgXCJcIikpLFxuXHRcdFx0XHRcdFwibGFiZWxcIlx0XHRcdFx0OiBcIkRlbGV0ZVwiLFxuXHRcdFx0XHRcdFwiYWN0aW9uXCJcdFx0XHQ6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2YXIgaW5zdCA9ICQuanN0cmVlLnJlZmVyZW5jZShkYXRhLnJlZmVyZW5jZSksXG5cdFx0XHRcdFx0XHRcdG9iaiA9IGluc3QuZ2V0X25vZGUoZGF0YS5yZWZlcmVuY2UpO1xuXHRcdFx0XHRcdFx0aWYoaW5zdC5pc19zZWxlY3RlZChvYmopKSB7XG5cdFx0XHRcdFx0XHRcdGluc3QuZGVsZXRlX25vZGUoaW5zdC5nZXRfc2VsZWN0ZWQoKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0aW5zdC5kZWxldGVfbm9kZShvYmopO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0XCJjY3BcIiA6IHtcblx0XHRcdFx0XHRcInNlcGFyYXRvcl9iZWZvcmVcIlx0OiB0cnVlLFxuXHRcdFx0XHRcdFwiaWNvblwiXHRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFwic2VwYXJhdG9yX2FmdGVyXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XCJsYWJlbFwiXHRcdFx0XHQ6IFwiRWRpdFwiLFxuXHRcdFx0XHRcdFwiYWN0aW9uXCJcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFwic3VibWVudVwiIDoge1xuXHRcdFx0XHRcdFx0XCJjdXRcIiA6IHtcblx0XHRcdFx0XHRcdFx0XCJzZXBhcmF0b3JfYmVmb3JlXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFwic2VwYXJhdG9yX2FmdGVyXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFwibGFiZWxcIlx0XHRcdFx0OiBcIkN1dFwiLFxuXHRcdFx0XHRcdFx0XHRcImFjdGlvblwiXHRcdFx0OiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbnN0ID0gJC5qc3RyZWUucmVmZXJlbmNlKGRhdGEucmVmZXJlbmNlKSxcblx0XHRcdFx0XHRcdFx0XHRcdG9iaiA9IGluc3QuZ2V0X25vZGUoZGF0YS5yZWZlcmVuY2UpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluc3QuaXNfc2VsZWN0ZWQob2JqKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aW5zdC5jdXQoaW5zdC5nZXRfdG9wX3NlbGVjdGVkKCkpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGluc3QuY3V0KG9iaik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJjb3B5XCIgOiB7XG5cdFx0XHRcdFx0XHRcdFwic2VwYXJhdG9yX2JlZm9yZVwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcImljb25cIlx0XHRcdFx0OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XCJzZXBhcmF0b3JfYWZ0ZXJcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XCJsYWJlbFwiXHRcdFx0XHQ6IFwiQ29weVwiLFxuXHRcdFx0XHRcdFx0XHRcImFjdGlvblwiXHRcdFx0OiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbnN0ID0gJC5qc3RyZWUucmVmZXJlbmNlKGRhdGEucmVmZXJlbmNlKSxcblx0XHRcdFx0XHRcdFx0XHRcdG9iaiA9IGluc3QuZ2V0X25vZGUoZGF0YS5yZWZlcmVuY2UpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGluc3QuaXNfc2VsZWN0ZWQob2JqKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aW5zdC5jb3B5KGluc3QuZ2V0X3RvcF9zZWxlY3RlZCgpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpbnN0LmNvcHkob2JqKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcInBhc3RlXCIgOiB7XG5cdFx0XHRcdFx0XHRcdFwic2VwYXJhdG9yX2JlZm9yZVwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcImljb25cIlx0XHRcdFx0OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XCJfZGlzYWJsZWRcIlx0XHRcdDogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gISQuanN0cmVlLnJlZmVyZW5jZShkYXRhLnJlZmVyZW5jZSkuY2FuX3Bhc3RlKCk7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFwic2VwYXJhdG9yX2FmdGVyXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFwibGFiZWxcIlx0XHRcdFx0OiBcIlBhc3RlXCIsXG5cdFx0XHRcdFx0XHRcdFwiYWN0aW9uXCJcdFx0XHQ6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluc3QgPSAkLmpzdHJlZS5yZWZlcmVuY2UoZGF0YS5yZWZlcmVuY2UpLFxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqID0gaW5zdC5nZXRfbm9kZShkYXRhLnJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0XHRcdFx0aW5zdC5wYXN0ZShvYmopO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcblxuXHQkLmpzdHJlZS5wbHVnaW5zLmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuYmluZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHBhcmVudC5iaW5kLmNhbGwodGhpcyk7XG5cblx0XHRcdHZhciBsYXN0X3RzID0gMCwgY3RvID0gbnVsbCwgZXgsIGV5O1xuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5vbihcImluaXQuanN0cmVlIGxvYWRpbmcuanN0cmVlIHJlYWR5LmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmFkZENsYXNzKCdqc3RyZWUtY29udGV4dG1lbnUnKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiY29udGV4dG1lbnUuanN0cmVlXCIsIFwiLmpzdHJlZS1hbmNob3JcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0aWYgKGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0Jykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRsYXN0X3RzID0gZS5jdHJsS2V5ID8gK25ldyBEYXRlKCkgOiAwO1xuXHRcdFx0XHRcdFx0aWYoZGF0YSB8fCBjdG8pIHtcblx0XHRcdFx0XHRcdFx0bGFzdF90cyA9ICgrbmV3IERhdGUoKSkgKyAxMDAwMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKGN0bykge1xuXHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoY3RvKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKCF0aGlzLmlzX2xvYWRpbmcoZS5jdXJyZW50VGFyZ2V0KSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNob3dfY29udGV4dG1lbnUoZS5jdXJyZW50VGFyZ2V0LCBlLnBhZ2VYLCBlLnBhZ2VZLCBlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiY2xpY2suanN0cmVlXCIsIFwiLmpzdHJlZS1hbmNob3JcIiwgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5jb250ZXh0bWVudS52aXNpYmxlICYmICghbGFzdF90cyB8fCAoK25ldyBEYXRlKCkpIC0gbGFzdF90cyA+IDI1MCkpIHsgLy8gd29yayBhcm91bmQgc2FmYXJpICYgbWFjT1MgY3RybCtjbGlja1xuXHRcdFx0XHRcdFx0XHQkLnZha2F0YS5jb250ZXh0LmhpZGUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGxhc3RfdHMgPSAwO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJ0b3VjaHN0YXJ0LmpzdHJlZVwiLCBcIi5qc3RyZWUtYW5jaG9yXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZighZS5vcmlnaW5hbEV2ZW50IHx8ICFlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMgfHwgIWUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRleCA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xuXHRcdFx0XHRcdFx0ZXkgPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcblx0XHRcdFx0XHRcdGN0byA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkudHJpZ2dlcignY29udGV4dG1lbnUnLCB0cnVlKTtcblx0XHRcdFx0XHRcdH0sIDc1MCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCd0b3VjaG1vdmUudmFrYXRhLmpzdHJlZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZihjdG8gJiYgZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcyAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0gJiYgKE1hdGguYWJzKGV4IC0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgpID4gMTAgfHwgTWF0aC5hYnMoZXkgLSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSkgPiAxMCkpIHtcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KGN0byk7XG5cdFx0XHRcdFx0XHRcdCQudmFrYXRhLmNvbnRleHQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdC5vbigndG91Y2hlbmQudmFrYXRhLmpzdHJlZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZihjdG8pIHtcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KGN0byk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdC8qIVxuXHRcdFx0aWYoISgnb25jb250ZXh0bWVudScgaW4gZG9jdW1lbnQuYm9keSkgJiYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmJvZHkpKSB7XG5cdFx0XHRcdHZhciBlbCA9IG51bGwsIHRtID0gbnVsbDtcblx0XHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdFx0Lm9uKFwidG91Y2hzdGFydFwiLCBcIi5qc3RyZWUtYW5jaG9yXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlbCA9IGUuY3VycmVudFRhcmdldDtcblx0XHRcdFx0XHRcdHRtID0gK25ldyBEYXRlKCk7XG5cdFx0XHRcdFx0XHQkKGRvY3VtZW50KS5vbmUoXCJ0b3VjaGVuZFwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRlLnRhcmdldCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5vcmlnaW5hbEV2ZW50LnRhcmdldFRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3cucGFnZVhPZmZzZXQsIGUub3JpZ2luYWxFdmVudC50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93LnBhZ2VZT2Zmc2V0KTtcblx0XHRcdFx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG5cdFx0XHRcdFx0XHRcdHRtID0gKCgrKG5ldyBEYXRlKCkpKSAtIHRtKTtcblx0XHRcdFx0XHRcdFx0aWYoZS50YXJnZXQgPT09IGVsICYmIHRtID4gNjAwICYmIHRtIDwgMTAwMCkge1xuXHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHQkKGVsKS50cmlnZ2VyKCdjb250ZXh0bWVudScsIGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0dG0gPSBudWxsO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHQqL1xuXHRcdFx0JChkb2N1bWVudCkub24oXCJjb250ZXh0X2hpZGUudmFrYXRhLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29udGV4dG1lbnUudmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHQkKGRhdGEucmVmZXJlbmNlKS5yZW1vdmVDbGFzcygnanN0cmVlLWNvbnRleHQnKTtcblx0XHRcdH0sIHRoaXMpKTtcblx0XHR9O1xuXHRcdHRoaXMudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZih0aGlzLl9kYXRhLmNvbnRleHRtZW51LnZpc2libGUpIHtcblx0XHRcdFx0JC52YWthdGEuY29udGV4dC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRwYXJlbnQudGVhcmRvd24uY2FsbCh0aGlzKTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogcHJlcGFyZSBhbmQgc2hvdyB0aGUgY29udGV4dCBtZW51IGZvciBhIG5vZGVcblx0XHQgKiBAbmFtZSBzaG93X2NvbnRleHRtZW51KG9iaiBbLCB4LCB5XSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKiBAcGFyYW0ge051bWJlcn0geCB0aGUgeC1jb29yZGluYXRlIHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudCB0byBzaG93IHRoZSBtZW51IGF0XG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHkgdGhlIHktY29vcmRpbmF0ZSByZWxhdGl2ZSB0byB0aGUgZG9jdW1lbnQgdG8gc2hvdyB0aGUgbWVudSBhdFxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBlIHRoZSBldmVudCBpZiBhdmFpbGFibGUgdGhhdCB0cmlnZ2VyZWQgdGhlIGNvbnRleHRtZW51XG5cdFx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHRcdCAqIEB0cmlnZ2VyIHNob3dfY29udGV4dG1lbnUuanN0cmVlXG5cdFx0ICovXG5cdFx0dGhpcy5zaG93X2NvbnRleHRtZW51ID0gZnVuY3Rpb24gKG9iaiwgeCwgeSwgZSkge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR2YXIgcyA9IHRoaXMuc2V0dGluZ3MuY29udGV4dG1lbnUsXG5cdFx0XHRcdGQgPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSksXG5cdFx0XHRcdGEgPSBkLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIiksXG5cdFx0XHRcdG8gPSBmYWxzZSxcblx0XHRcdFx0aSA9IGZhbHNlO1xuXHRcdFx0aWYocy5zaG93X2F0X25vZGUgfHwgeCA9PT0gdW5kZWZpbmVkIHx8IHkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRvID0gYS5vZmZzZXQoKTtcblx0XHRcdFx0eCA9IG8ubGVmdDtcblx0XHRcdFx0eSA9IG8udG9wICsgdGhpcy5fZGF0YS5jb3JlLmxpX2hlaWdodDtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY29udGV4dG1lbnUuc2VsZWN0X25vZGUgJiYgIXRoaXMuaXNfc2VsZWN0ZWQob2JqKSkge1xuXHRcdFx0XHR0aGlzLmFjdGl2YXRlX25vZGUob2JqLCBlKTtcblx0XHRcdH1cblxuXHRcdFx0aSA9IHMuaXRlbXM7XG5cdFx0XHRpZigkLmlzRnVuY3Rpb24oaSkpIHtcblx0XHRcdFx0aSA9IGkuY2FsbCh0aGlzLCBvYmosICQucHJveHkoZnVuY3Rpb24gKGkpIHtcblx0XHRcdFx0XHR0aGlzLl9zaG93X2NvbnRleHRtZW51KG9iaiwgeCwgeSwgaSk7XG5cdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdH1cblx0XHRcdGlmKCQuaXNQbGFpbk9iamVjdChpKSkge1xuXHRcdFx0XHR0aGlzLl9zaG93X2NvbnRleHRtZW51KG9iaiwgeCwgeSwgaSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBzaG93IHRoZSBwcmVwYXJlZCBjb250ZXh0IG1lbnUgZm9yIGEgbm9kZVxuXHRcdCAqIEBuYW1lIF9zaG93X2NvbnRleHRtZW51KG9iaiwgeCwgeSwgaSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKiBAcGFyYW0ge051bWJlcn0geCB0aGUgeC1jb29yZGluYXRlIHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudCB0byBzaG93IHRoZSBtZW51IGF0XG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHkgdGhlIHktY29vcmRpbmF0ZSByZWxhdGl2ZSB0byB0aGUgZG9jdW1lbnQgdG8gc2hvdyB0aGUgbWVudSBhdFxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBpIHRoZSBvYmplY3Qgb2YgaXRlbXMgdG8gc2hvd1xuXHRcdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0XHQgKiBAdHJpZ2dlciBzaG93X2NvbnRleHRtZW51LmpzdHJlZVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5fc2hvd19jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChvYmosIHgsIHksIGkpIHtcblx0XHRcdHZhciBkID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpLFxuXHRcdFx0XHRhID0gZC5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpO1xuXHRcdFx0JChkb2N1bWVudCkub25lKFwiY29udGV4dF9zaG93LnZha2F0YS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHR2YXIgY2xzID0gJ2pzdHJlZS1jb250ZXh0bWVudSBqc3RyZWUtJyArIHRoaXMuZ2V0X3RoZW1lKCkgKyAnLWNvbnRleHRtZW51Jztcblx0XHRcdFx0JChkYXRhLmVsZW1lbnQpLmFkZENsYXNzKGNscyk7XG5cdFx0XHRcdGEuYWRkQ2xhc3MoJ2pzdHJlZS1jb250ZXh0Jyk7XG5cdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHR0aGlzLl9kYXRhLmNvbnRleHRtZW51LnZpc2libGUgPSB0cnVlO1xuXHRcdFx0JC52YWthdGEuY29udGV4dC5zaG93KGEsIHsgJ3gnIDogeCwgJ3knIDogeSB9LCBpKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbnRleHRtZW51IGlzIHNob3duIGZvciBhIG5vZGVcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2hvd19jb250ZXh0bWVudS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge051bWJlcn0geCB0aGUgeC1jb29yZGluYXRlIG9mIHRoZSBtZW51IHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudFxuXHRcdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHkgdGhlIHktY29vcmRpbmF0ZSBvZiB0aGUgbWVudSByZWxhdGl2ZSB0byB0aGUgZG9jdW1lbnRcblx0XHRcdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzaG93X2NvbnRleHRtZW51JywgeyBcIm5vZGVcIiA6IG9iaiwgXCJ4XCIgOiB4LCBcInlcIiA6IHkgfSk7XG5cdFx0fTtcblx0fTtcblxuXHQvLyBjb250ZXh0bWVudSBoZWxwZXJcblx0KGZ1bmN0aW9uICgkKSB7XG5cdFx0dmFyIHJpZ2h0X3RvX2xlZnQgPSBmYWxzZSxcblx0XHRcdHZha2F0YV9jb250ZXh0ID0ge1xuXHRcdFx0XHRlbGVtZW50XHRcdDogZmFsc2UsXG5cdFx0XHRcdHJlZmVyZW5jZVx0OiBmYWxzZSxcblx0XHRcdFx0cG9zaXRpb25feFx0OiAwLFxuXHRcdFx0XHRwb3NpdGlvbl95XHQ6IDAsXG5cdFx0XHRcdGl0ZW1zXHRcdDogW10sXG5cdFx0XHRcdGh0bWxcdFx0OiBcIlwiLFxuXHRcdFx0XHRpc192aXNpYmxlXHQ6IGZhbHNlXG5cdFx0XHR9O1xuXG5cdFx0JC52YWthdGEuY29udGV4dCA9IHtcblx0XHRcdHNldHRpbmdzIDoge1xuXHRcdFx0XHRoaWRlX29ubW91c2VsZWF2ZVx0OiAwLFxuXHRcdFx0XHRpY29uc1x0XHRcdFx0OiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0X3RyaWdnZXIgOiBmdW5jdGlvbiAoZXZlbnRfbmFtZSkge1xuXHRcdFx0XHQkKGRvY3VtZW50KS50cmlnZ2VySGFuZGxlcihcImNvbnRleHRfXCIgKyBldmVudF9uYW1lICsgXCIudmFrYXRhXCIsIHtcblx0XHRcdFx0XHRcInJlZmVyZW5jZVwiXHQ6IHZha2F0YV9jb250ZXh0LnJlZmVyZW5jZSxcblx0XHRcdFx0XHRcImVsZW1lbnRcIlx0OiB2YWthdGFfY29udGV4dC5lbGVtZW50LFxuXHRcdFx0XHRcdFwicG9zaXRpb25cIlx0OiB7XG5cdFx0XHRcdFx0XHRcInhcIiA6IHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3gsXG5cdFx0XHRcdFx0XHRcInlcIiA6IHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3lcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdF9leGVjdXRlIDogZnVuY3Rpb24gKGkpIHtcblx0XHRcdFx0aSA9IHZha2F0YV9jb250ZXh0Lml0ZW1zW2ldO1xuXHRcdFx0XHRyZXR1cm4gaSAmJiAoIWkuX2Rpc2FibGVkIHx8ICgkLmlzRnVuY3Rpb24oaS5fZGlzYWJsZWQpICYmICFpLl9kaXNhYmxlZCh7IFwiaXRlbVwiIDogaSwgXCJyZWZlcmVuY2VcIiA6IHZha2F0YV9jb250ZXh0LnJlZmVyZW5jZSwgXCJlbGVtZW50XCIgOiB2YWthdGFfY29udGV4dC5lbGVtZW50IH0pKSkgJiYgaS5hY3Rpb24gPyBpLmFjdGlvbi5jYWxsKG51bGwsIHtcblx0XHRcdFx0XHRcdFx0XCJpdGVtXCJcdFx0OiBpLFxuXHRcdFx0XHRcdFx0XHRcInJlZmVyZW5jZVwiXHQ6IHZha2F0YV9jb250ZXh0LnJlZmVyZW5jZSxcblx0XHRcdFx0XHRcdFx0XCJlbGVtZW50XCJcdDogdmFrYXRhX2NvbnRleHQuZWxlbWVudCxcblx0XHRcdFx0XHRcdFx0XCJwb3NpdGlvblwiXHQ6IHtcblx0XHRcdFx0XHRcdFx0XHRcInhcIiA6IHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3gsXG5cdFx0XHRcdFx0XHRcdFx0XCJ5XCIgOiB2YWthdGFfY29udGV4dC5wb3NpdGlvbl95XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pIDogZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0X3BhcnNlIDogZnVuY3Rpb24gKG8sIGlzX2NhbGxiYWNrKSB7XG5cdFx0XHRcdGlmKCFvKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0XHRpZighaXNfY2FsbGJhY2spIHtcblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5odG1sXHRcdD0gXCJcIjtcblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5pdGVtc1x0PSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc3RyID0gXCJcIixcblx0XHRcdFx0XHRzZXAgPSBmYWxzZSxcblx0XHRcdFx0XHR0bXA7XG5cblx0XHRcdFx0aWYoaXNfY2FsbGJhY2spIHsgc3RyICs9IFwiPFwiK1widWw+XCI7IH1cblx0XHRcdFx0JC5lYWNoKG8sIGZ1bmN0aW9uIChpLCB2YWwpIHtcblx0XHRcdFx0XHRpZighdmFsKSB7IHJldHVybiB0cnVlOyB9XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuaXRlbXMucHVzaCh2YWwpO1xuXHRcdFx0XHRcdGlmKCFzZXAgJiYgdmFsLnNlcGFyYXRvcl9iZWZvcmUpIHtcblx0XHRcdFx0XHRcdHN0ciArPSBcIjxcIitcImxpIGNsYXNzPSd2YWthdGEtY29udGV4dC1zZXBhcmF0b3InPjxcIitcImEgaHJlZj0nIycgXCIgKyAoJC52YWthdGEuY29udGV4dC5zZXR0aW5ncy5pY29ucyA/ICcnIDogJ3N0eWxlPVwibWFyZ2luLWxlZnQ6MHB4O1wiJykgKyBcIj4mIzE2MDs8XCIrXCIvYT48XCIrXCIvbGk+XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNlcCA9IGZhbHNlO1xuXHRcdFx0XHRcdHN0ciArPSBcIjxcIitcImxpIGNsYXNzPSdcIiArICh2YWwuX2NsYXNzIHx8IFwiXCIpICsgKHZhbC5fZGlzYWJsZWQgPT09IHRydWUgfHwgKCQuaXNGdW5jdGlvbih2YWwuX2Rpc2FibGVkKSAmJiB2YWwuX2Rpc2FibGVkKHsgXCJpdGVtXCIgOiB2YWwsIFwicmVmZXJlbmNlXCIgOiB2YWthdGFfY29udGV4dC5yZWZlcmVuY2UsIFwiZWxlbWVudFwiIDogdmFrYXRhX2NvbnRleHQuZWxlbWVudCB9KSkgPyBcIiB2YWthdGEtY29udGV4dG1lbnUtZGlzYWJsZWQgXCIgOiBcIlwiKSArIFwiJyBcIisodmFsLnNob3J0Y3V0P1wiIGRhdGEtc2hvcnRjdXQ9J1wiK3ZhbC5zaG9ydGN1dCtcIicgXCI6JycpK1wiPlwiO1xuXHRcdFx0XHRcdHN0ciArPSBcIjxcIitcImEgaHJlZj0nIycgcmVsPSdcIiArICh2YWthdGFfY29udGV4dC5pdGVtcy5sZW5ndGggLSAxKSArIFwiJyBcIiArICh2YWwudGl0bGUgPyBcInRpdGxlPSdcIiArIHZhbC50aXRsZSArIFwiJ1wiIDogXCJcIikgKyBcIj5cIjtcblx0XHRcdFx0XHRpZigkLnZha2F0YS5jb250ZXh0LnNldHRpbmdzLmljb25zKSB7XG5cdFx0XHRcdFx0XHRzdHIgKz0gXCI8XCIrXCJpIFwiO1xuXHRcdFx0XHRcdFx0aWYodmFsLmljb24pIHtcblx0XHRcdFx0XHRcdFx0aWYodmFsLmljb24uaW5kZXhPZihcIi9cIikgIT09IC0xIHx8IHZhbC5pY29uLmluZGV4T2YoXCIuXCIpICE9PSAtMSkgeyBzdHIgKz0gXCIgc3R5bGU9J2JhY2tncm91bmQ6dXJsKFxcXCJcIiArIHZhbC5pY29uICsgXCJcXFwiKSBjZW50ZXIgY2VudGVyIG5vLXJlcGVhdCcgXCI7IH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7IHN0ciArPSBcIiBjbGFzcz0nXCIgKyB2YWwuaWNvbiArIFwiJyBcIjsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0c3RyICs9IFwiPjxcIitcIi9pPjxcIitcInNwYW4gY2xhc3M9J3Zha2F0YS1jb250ZXh0bWVudS1zZXAnPiYjMTYwOzxcIitcIi9zcGFuPlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHIgKz0gKCQuaXNGdW5jdGlvbih2YWwubGFiZWwpID8gdmFsLmxhYmVsKHsgXCJpdGVtXCIgOiBpLCBcInJlZmVyZW5jZVwiIDogdmFrYXRhX2NvbnRleHQucmVmZXJlbmNlLCBcImVsZW1lbnRcIiA6IHZha2F0YV9jb250ZXh0LmVsZW1lbnQgfSkgOiB2YWwubGFiZWwpICsgKHZhbC5zaG9ydGN1dD8nIDxzcGFuIGNsYXNzPVwidmFrYXRhLWNvbnRleHRtZW51LXNob3J0Y3V0IHZha2F0YS1jb250ZXh0bWVudS1zaG9ydGN1dC0nK3ZhbC5zaG9ydGN1dCsnXCI+JysgKHZhbC5zaG9ydGN1dF9sYWJlbCB8fCAnJykgKyc8L3NwYW4+JzonJykgKyBcIjxcIitcIi9hPlwiO1xuXHRcdFx0XHRcdGlmKHZhbC5zdWJtZW51KSB7XG5cdFx0XHRcdFx0XHR0bXAgPSAkLnZha2F0YS5jb250ZXh0Ll9wYXJzZSh2YWwuc3VibWVudSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRpZih0bXApIHsgc3RyICs9IHRtcDsgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHIgKz0gXCI8XCIrXCIvbGk+XCI7XG5cdFx0XHRcdFx0aWYodmFsLnNlcGFyYXRvcl9hZnRlcikge1xuXHRcdFx0XHRcdFx0c3RyICs9IFwiPFwiK1wibGkgY2xhc3M9J3Zha2F0YS1jb250ZXh0LXNlcGFyYXRvcic+PFwiK1wiYSBocmVmPScjJyBcIiArICgkLnZha2F0YS5jb250ZXh0LnNldHRpbmdzLmljb25zID8gJycgOiAnc3R5bGU9XCJtYXJnaW4tbGVmdDowcHg7XCInKSArIFwiPiYjMTYwOzxcIitcIi9hPjxcIitcIi9saT5cIjtcblx0XHRcdFx0XHRcdHNlcCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c3RyICA9IHN0ci5yZXBsYWNlKC88bGkgY2xhc3NcXD0ndmFrYXRhLWNvbnRleHQtc2VwYXJhdG9yJ1xcPjxcXC9saVxcPiQvLFwiXCIpO1xuXHRcdFx0XHRpZihpc19jYWxsYmFjaykgeyBzdHIgKz0gXCI8L3VsPlwiOyB9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgb24gdGhlIGRvY3VtZW50IHdoZW4gdGhlIGNvbnRleHRtZW51IGlzIHBhcnNlZCAoSFRNTCBpcyBidWlsdClcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0XHRcdFx0ICogQG5hbWUgY29udGV4dF9wYXJzZS52YWthdGFcblx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IHJlZmVyZW5jZSB0aGUgZWxlbWVudCB0aGF0IHdhcyByaWdodCBjbGlja2VkXG5cdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBlbGVtZW50IHRoZSBET00gZWxlbWVudCBvZiB0aGUgbWVudSBpdHNlbGZcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IHBvc2l0aW9uIHRoZSB4ICYgeSBjb29yZGluYXRlcyBvZiB0aGUgbWVudVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0aWYoIWlzX2NhbGxiYWNrKSB7IHZha2F0YV9jb250ZXh0Lmh0bWwgPSBzdHI7ICQudmFrYXRhLmNvbnRleHQuX3RyaWdnZXIoXCJwYXJzZVwiKTsgfVxuXHRcdFx0XHRyZXR1cm4gc3RyLmxlbmd0aCA+IDEwID8gc3RyIDogZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0X3Nob3dfc3VibWVudSA6IGZ1bmN0aW9uIChvKSB7XG5cdFx0XHRcdG8gPSAkKG8pO1xuXHRcdFx0XHRpZighby5sZW5ndGggfHwgIW8uY2hpbGRyZW4oXCJ1bFwiKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdHZhciBlID0gby5jaGlsZHJlbihcInVsXCIpLFxuXHRcdFx0XHRcdHhsID0gby5vZmZzZXQoKS5sZWZ0LFxuXHRcdFx0XHRcdHggPSB4bCArIG8ub3V0ZXJXaWR0aCgpLFxuXHRcdFx0XHRcdHkgPSBvLm9mZnNldCgpLnRvcCxcblx0XHRcdFx0XHR3ID0gZS53aWR0aCgpLFxuXHRcdFx0XHRcdGggPSBlLmhlaWdodCgpLFxuXHRcdFx0XHRcdGR3ID0gJCh3aW5kb3cpLndpZHRoKCkgKyAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpLFxuXHRcdFx0XHRcdGRoID0gJCh3aW5kb3cpLmhlaWdodCgpICsgJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXHRcdFx0XHQvLyDQvNC+0LbQtSDQtNCwINGB0LUg0YHQv9C10YHRgtC4INC1INC10LTQvdCwINC/0YDQvtCy0LXRgNC60LAgLSDQtNCw0LvQuCDQvdGP0LzQsCDQvdGP0LrQvtC5INC+0YIg0LrQu9Cw0YHQvtCy0LXRgtC1INCy0LXRh9C1INC90LDQs9C+0YDQtVxuXHRcdFx0XHRpZihyaWdodF90b19sZWZ0KSB7XG5cdFx0XHRcdFx0b1t4IC0gKHcgKyAxMCArIG8ub3V0ZXJXaWR0aCgpKSA8IDAgPyBcImFkZENsYXNzXCIgOiBcInJlbW92ZUNsYXNzXCJdKFwidmFrYXRhLWNvbnRleHQtbGVmdFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRvW3ggKyB3ID4gZHcgICYmIHhsID4gZHcgLSB4ID8gXCJhZGRDbGFzc1wiIDogXCJyZW1vdmVDbGFzc1wiXShcInZha2F0YS1jb250ZXh0LXJpZ2h0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHkgKyBoICsgMTAgPiBkaCkge1xuXHRcdFx0XHRcdGUuY3NzKFwiYm90dG9tXCIsXCItMXB4XCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9pZiBkb2VzIG5vdCBmaXQgLSBzdGljayBpdCB0byB0aGUgc2lkZVxuXHRcdFx0XHRpZiAoby5oYXNDbGFzcygndmFrYXRhLWNvbnRleHQtcmlnaHQnKSkge1xuXHRcdFx0XHRcdGlmICh4bCA8IHcpIHtcblx0XHRcdFx0XHRcdGUuY3NzKFwibWFyZ2luLXJpZ2h0XCIsIHhsIC0gdyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChkdyAtIHggPCB3KSB7XG5cdFx0XHRcdFx0XHRlLmNzcyhcIm1hcmdpbi1sZWZ0XCIsIGR3IC0geCAtIHcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGUuc2hvdygpO1xuXHRcdFx0fSxcblx0XHRcdHNob3cgOiBmdW5jdGlvbiAocmVmZXJlbmNlLCBwb3NpdGlvbiwgZGF0YSkge1xuXHRcdFx0XHR2YXIgbywgZSwgeCwgeSwgdywgaCwgZHcsIGRoLCBjb25kID0gdHJ1ZTtcblx0XHRcdFx0aWYodmFrYXRhX2NvbnRleHQuZWxlbWVudCAmJiB2YWthdGFfY29udGV4dC5lbGVtZW50Lmxlbmd0aCkge1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQud2lkdGgoJycpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN3aXRjaChjb25kKSB7XG5cdFx0XHRcdFx0Y2FzZSAoIXBvc2l0aW9uICYmICFyZWZlcmVuY2UpOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdGNhc2UgKCEhcG9zaXRpb24gJiYgISFyZWZlcmVuY2UpOlxuXHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQucmVmZXJlbmNlXHQ9IHJlZmVyZW5jZTtcblx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3hcdD0gcG9zaXRpb24ueDtcblx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3lcdD0gcG9zaXRpb24ueTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgKCFwb3NpdGlvbiAmJiAhIXJlZmVyZW5jZSk6XG5cdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5yZWZlcmVuY2VcdD0gcmVmZXJlbmNlO1xuXHRcdFx0XHRcdFx0byA9IHJlZmVyZW5jZS5vZmZzZXQoKTtcblx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3hcdD0gby5sZWZ0ICsgcmVmZXJlbmNlLm91dGVySGVpZ2h0KCk7XG5cdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5wb3NpdGlvbl95XHQ9IG8udG9wO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAoISFwb3NpdGlvbiAmJiAhcmVmZXJlbmNlKTpcblx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3hcdD0gcG9zaXRpb24ueDtcblx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3lcdD0gcG9zaXRpb24ueTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCEhcmVmZXJlbmNlICYmICFkYXRhICYmICQocmVmZXJlbmNlKS5kYXRhKCd2YWthdGFfY29udGV4dG1lbnUnKSkge1xuXHRcdFx0XHRcdGRhdGEgPSAkKHJlZmVyZW5jZSkuZGF0YSgndmFrYXRhX2NvbnRleHRtZW51Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoJC52YWthdGEuY29udGV4dC5fcGFyc2UoZGF0YSkpIHtcblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50Lmh0bWwodmFrYXRhX2NvbnRleHQuaHRtbCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYodmFrYXRhX2NvbnRleHQuaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblx0XHRcdFx0XHRlID0gdmFrYXRhX2NvbnRleHQuZWxlbWVudDtcblx0XHRcdFx0XHR4ID0gdmFrYXRhX2NvbnRleHQucG9zaXRpb25feDtcblx0XHRcdFx0XHR5ID0gdmFrYXRhX2NvbnRleHQucG9zaXRpb25feTtcblx0XHRcdFx0XHR3ID0gZS53aWR0aCgpO1xuXHRcdFx0XHRcdGggPSBlLmhlaWdodCgpO1xuXHRcdFx0XHRcdGR3ID0gJCh3aW5kb3cpLndpZHRoKCkgKyAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpO1xuXHRcdFx0XHRcdGRoID0gJCh3aW5kb3cpLmhlaWdodCgpICsgJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXHRcdFx0XHRcdGlmKHJpZ2h0X3RvX2xlZnQpIHtcblx0XHRcdFx0XHRcdHggLT0gKGUub3V0ZXJXaWR0aCgpIC0gJChyZWZlcmVuY2UpLm91dGVyV2lkdGgoKSk7XG5cdFx0XHRcdFx0XHRpZih4IDwgJCh3aW5kb3cpLnNjcm9sbExlZnQoKSArIDIwKSB7XG5cdFx0XHRcdFx0XHRcdHggPSAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpICsgMjA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHggKyB3ICsgMjAgPiBkdykge1xuXHRcdFx0XHRcdFx0eCA9IGR3IC0gKHcgKyAyMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHkgKyBoICsgMjAgPiBkaCkge1xuXHRcdFx0XHRcdFx0eSA9IGRoIC0gKGggKyAyMCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudFxuXHRcdFx0XHRcdFx0LmNzcyh7IFwibGVmdFwiIDogeCwgXCJ0b3BcIiA6IHkgfSlcblx0XHRcdFx0XHRcdC5zaG93KClcblx0XHRcdFx0XHRcdC5maW5kKCdhJykuZmlyc3QoKS5mb2N1cygpLnBhcmVudCgpLmFkZENsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIik7XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuaXNfdmlzaWJsZSA9IHRydWU7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogdHJpZ2dlcmVkIG9uIHRoZSBkb2N1bWVudCB3aGVuIHRoZSBjb250ZXh0bWVudSBpcyBzaG93blxuXHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0XHRcdFx0XHQgKiBAbmFtZSBjb250ZXh0X3Nob3cudmFrYXRhXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IHJlZmVyZW5jZSB0aGUgZWxlbWVudCB0aGF0IHdhcyByaWdodCBjbGlja2VkXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnQgdGhlIERPTSBlbGVtZW50IG9mIHRoZSBtZW51IGl0c2VsZlxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiB0aGUgeCAmIHkgY29vcmRpbmF0ZXMgb2YgdGhlIG1lbnVcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHQkLnZha2F0YS5jb250ZXh0Ll90cmlnZ2VyKFwic2hvd1wiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGhpZGUgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmKHZha2F0YV9jb250ZXh0LmlzX3Zpc2libGUpIHtcblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50LmhpZGUoKS5maW5kKFwidWxcIikuaGlkZSgpLmVuZCgpLmZpbmQoJzpmb2N1cycpLmJsdXIoKS5lbmQoKS5kZXRhY2goKTtcblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5pc192aXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogdHJpZ2dlcmVkIG9uIHRoZSBkb2N1bWVudCB3aGVuIHRoZSBjb250ZXh0bWVudSBpcyBoaWRkZW5cblx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdFx0XHRcdFx0ICogQG5hbWUgY29udGV4dF9oaWRlLnZha2F0YVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSByZWZlcmVuY2UgdGhlIGVsZW1lbnQgdGhhdCB3YXMgcmlnaHQgY2xpY2tlZFxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBlbGVtZW50IHRoZSBET00gZWxlbWVudCBvZiB0aGUgbWVudSBpdHNlbGZcblx0XHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gdGhlIHggJiB5IGNvb3JkaW5hdGVzIG9mIHRoZSBtZW51XG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0JC52YWthdGEuY29udGV4dC5fdHJpZ2dlcihcImhpZGVcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdCQoZnVuY3Rpb24gKCkge1xuXHRcdFx0cmlnaHRfdG9fbGVmdCA9ICQoZG9jdW1lbnQuYm9keSkuY3NzKFwiZGlyZWN0aW9uXCIpID09PSBcInJ0bFwiO1xuXHRcdFx0dmFyIHRvID0gZmFsc2U7XG5cblx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQgPSAkKFwiPHVsIGNsYXNzPSd2YWthdGEtY29udGV4dCc+PC91bD5cIik7XG5cdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50XG5cdFx0XHRcdC5vbihcIm1vdXNlZW50ZXJcIiwgXCJsaVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0XHRpZigkLmNvbnRhaW5zKHRoaXMsIGUucmVsYXRlZFRhcmdldCkpIHtcblx0XHRcdFx0XHRcdC8vINC/0YDQtdC80LDRhdC90LDRgtC+INC30LDRgNCw0LTQuCBkZWxlZ2F0ZSBtb3VzZWxlYXZlINC/0L4t0LTQvtC70YNcblx0XHRcdFx0XHRcdC8vICQodGhpcykuZmluZChcIi52YWthdGEtY29udGV4dC1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKHRvKSB7IGNsZWFyVGltZW91dCh0byk7IH1cblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoXCIudmFrYXRhLWNvbnRleHQtaG92ZXJcIikucmVtb3ZlQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKS5lbmQoKTtcblxuXHRcdFx0XHRcdCQodGhpcylcblx0XHRcdFx0XHRcdC5zaWJsaW5ncygpLmZpbmQoXCJ1bFwiKS5oaWRlKCkuZW5kKCkuZW5kKClcblx0XHRcdFx0XHRcdC5wYXJlbnRzVW50aWwoXCIudmFrYXRhLWNvbnRleHRcIiwgXCJsaVwiKS5hZGRCYWNrKCkuYWRkQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKTtcblx0XHRcdFx0XHQkLnZha2F0YS5jb250ZXh0Ll9zaG93X3N1Ym1lbnUodGhpcyk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC8vINGC0LXRgdGC0L7QstC+IC0g0LTQsNC70Lgg0L3QtSDQvdCw0YLQvtCy0LDRgNCy0LA/XG5cdFx0XHRcdC5vbihcIm1vdXNlbGVhdmVcIiwgXCJsaVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlmKCQuY29udGFpbnModGhpcywgZS5yZWxhdGVkVGFyZ2V0KSkgeyByZXR1cm47IH1cblx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoXCIudmFrYXRhLWNvbnRleHQtaG92ZXJcIikuYWRkQmFjaygpLnJlbW92ZUNsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIik7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoXCIudmFrYXRhLWNvbnRleHQtaG92ZXJcIikucmVtb3ZlQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKTtcblx0XHRcdFx0XHRpZigkLnZha2F0YS5jb250ZXh0LnNldHRpbmdzLmhpZGVfb25tb3VzZWxlYXZlKSB7XG5cdFx0XHRcdFx0XHR0byA9IHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0XHRcdChmdW5jdGlvbiAodCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7ICQudmFrYXRhLmNvbnRleHQuaGlkZSgpOyB9O1xuXHRcdFx0XHRcdFx0XHR9KHRoaXMpKSwgJC52YWthdGEuY29udGV4dC5zZXR0aW5ncy5oaWRlX29ubW91c2VsZWF2ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oXCJjbGlja1wiLCBcImFcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdC8vfSlcblx0XHRcdFx0Ly8ub24oXCJtb3VzZXVwXCIsIFwiYVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlmKCEkKHRoaXMpLmJsdXIoKS5wYXJlbnQoKS5oYXNDbGFzcyhcInZha2F0YS1jb250ZXh0LWRpc2FibGVkXCIpICYmICQudmFrYXRhLmNvbnRleHQuX2V4ZWN1dGUoJCh0aGlzKS5hdHRyKFwicmVsXCIpKSAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdCQudmFrYXRhLmNvbnRleHQuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdrZXlkb3duJywgJ2EnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0dmFyIG8gPSBudWxsO1xuXHRcdFx0XHRcdFx0c3dpdGNoKGUud2hpY2gpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAxMzpcblx0XHRcdFx0XHRcdFx0Y2FzZSAzMjpcblx0XHRcdFx0XHRcdFx0XHRlLnR5cGUgPSBcImNsaWNrXCI7XG5cdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS50cmlnZ2VyKGUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDM3OlxuXHRcdFx0XHRcdFx0XHRcdGlmKHZha2F0YV9jb250ZXh0LmlzX3Zpc2libGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZChcIi52YWthdGEtY29udGV4dC1ob3ZlclwiKS5sYXN0KCkuY2xvc2VzdChcImxpXCIpLmZpcnN0KCkuZmluZChcInVsXCIpLmhpZGUoKS5maW5kKFwiLnZha2F0YS1jb250ZXh0LWhvdmVyXCIpLnJlbW92ZUNsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIikuZW5kKCkuZW5kKCkuY2hpbGRyZW4oJ2EnKS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgMzg6XG5cdFx0XHRcdFx0XHRcdFx0aWYodmFrYXRhX2NvbnRleHQuaXNfdmlzaWJsZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0byA9IHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZChcInVsOnZpc2libGVcIikuYWRkQmFjaygpLmxhc3QoKS5jaGlsZHJlbihcIi52YWthdGEtY29udGV4dC1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpLnByZXZBbGwoXCJsaTpub3QoLnZha2F0YS1jb250ZXh0LXNlcGFyYXRvcilcIikuZmlyc3QoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKCFvLmxlbmd0aCkgeyBvID0gdmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKFwidWw6dmlzaWJsZVwiKS5hZGRCYWNrKCkubGFzdCgpLmNoaWxkcmVuKFwibGk6bm90KC52YWthdGEtY29udGV4dC1zZXBhcmF0b3IpXCIpLmxhc3QoKTsgfVxuXHRcdFx0XHRcdFx0XHRcdFx0by5hZGRDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpLmNoaWxkcmVuKCdhJykuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDM5OlxuXHRcdFx0XHRcdFx0XHRcdGlmKHZha2F0YV9jb250ZXh0LmlzX3Zpc2libGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZChcIi52YWthdGEtY29udGV4dC1ob3ZlclwiKS5sYXN0KCkuY2hpbGRyZW4oXCJ1bFwiKS5zaG93KCkuY2hpbGRyZW4oXCJsaTpub3QoLnZha2F0YS1jb250ZXh0LXNlcGFyYXRvcilcIikucmVtb3ZlQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKS5maXJzdCgpLmFkZENsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIikuY2hpbGRyZW4oJ2EnKS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0XHRcdFx0aWYodmFrYXRhX2NvbnRleHQuaXNfdmlzaWJsZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0byA9IHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZChcInVsOnZpc2libGVcIikuYWRkQmFjaygpLmxhc3QoKS5jaGlsZHJlbihcIi52YWthdGEtY29udGV4dC1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpLm5leHRBbGwoXCJsaTpub3QoLnZha2F0YS1jb250ZXh0LXNlcGFyYXRvcilcIikuZmlyc3QoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKCFvLmxlbmd0aCkgeyBvID0gdmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKFwidWw6dmlzaWJsZVwiKS5hZGRCYWNrKCkubGFzdCgpLmNoaWxkcmVuKFwibGk6bm90KC52YWthdGEtY29udGV4dC1zZXBhcmF0b3IpXCIpLmZpcnN0KCk7IH1cblx0XHRcdFx0XHRcdFx0XHRcdG8uYWRkQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKS5jaGlsZHJlbignYScpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAyNzpcblx0XHRcdFx0XHRcdFx0XHQkLnZha2F0YS5jb250ZXh0LmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhlLndoaWNoKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR2YXIgYSA9IHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZCgnLnZha2F0YS1jb250ZXh0bWVudS1zaG9ydGN1dC0nICsgZS53aGljaCkucGFyZW50KCk7XG5cdFx0XHRcdFx0aWYoYS5wYXJlbnQoKS5ub3QoJy52YWthdGEtY29udGV4dC1kaXNhYmxlZCcpKSB7XG5cdFx0XHRcdFx0XHRhLmNsaWNrKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0JChkb2N1bWVudClcblx0XHRcdFx0Lm9uKFwibW91c2Vkb3duLnZha2F0YS5qc3RyZWVcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpZih2YWthdGFfY29udGV4dC5pc192aXNpYmxlICYmIHZha2F0YV9jb250ZXh0LmVsZW1lbnRbMF0gIT09IGUudGFyZ2V0ICAmJiAhJC5jb250YWlucyh2YWthdGFfY29udGV4dC5lbGVtZW50WzBdLCBlLnRhcmdldCkpIHtcblx0XHRcdFx0XHRcdCQudmFrYXRhLmNvbnRleHQuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKFwiY29udGV4dF9zaG93LnZha2F0YS5qc3RyZWVcIiwgZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoXCJsaTpoYXModWwpXCIpLmNoaWxkcmVuKFwiYVwiKS5hZGRDbGFzcyhcInZha2F0YS1jb250ZXh0LXBhcmVudFwiKTtcblx0XHRcdFx0XHRpZihyaWdodF90b19sZWZ0KSB7XG5cdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50LmFkZENsYXNzKFwidmFrYXRhLWNvbnRleHQtcnRsXCIpLmNzcyhcImRpcmVjdGlvblwiLCBcInJ0bFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gYWxzbyBhcHBseSBhIFJUTCBjbGFzcz9cblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoXCJ1bFwiKS5oaWRlKCkuZW5kKCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KCQpKTtcblx0Ly8gJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2lucy5wdXNoKFwiY29udGV4dG1lbnVcIik7XG5cblxuLyoqXG4gKiAjIyMgRHJhZyduJ2Ryb3AgcGx1Z2luXG4gKlxuICogRW5hYmxlcyBkcmFnZ2luZyBhbmQgZHJvcHBpbmcgb2Ygbm9kZXMgaW4gdGhlIHRyZWUsIHJlc3VsdGluZyBpbiBhIG1vdmUgb3IgY29weSBvcGVyYXRpb25zLlxuICovXG5cblx0LyoqXG5cdCAqIHN0b3JlcyBhbGwgZGVmYXVsdHMgZm9yIHRoZSBkcmFnJ24nZHJvcCBwbHVnaW5cblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kXG5cdCAqIEBwbHVnaW4gZG5kXG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy5kbmQgPSB7XG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgYSBjb3B5IHNob3VsZCBiZSBwb3NzaWJsZSB3aGlsZSBkcmFnZ2luZyAoYnkgcHJlc3NpbnQgdGhlIG1ldGEga2V5IG9yIEN0cmwpLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLmNvcHlcblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdGNvcHkgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGEgbnVtYmVyIGluZGljYXRpbmcgaG93IGxvbmcgYSBub2RlIHNob3VsZCByZW1haW4gaG92ZXJlZCB3aGlsZSBkcmFnZ2luZyB0byBiZSBvcGVuZWQuIERlZmF1bHRzIHRvIGA1MDBgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC5vcGVuX3RpbWVvdXRcblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdG9wZW5fdGltZW91dCA6IDUwMCxcblx0XHQvKipcblx0XHQgKiBhIGZ1bmN0aW9uIGludm9rZWQgZWFjaCB0aW1lIGEgbm9kZSBpcyBhYm91dCB0byBiZSBkcmFnZ2VkLCBpbnZva2VkIGluIHRoZSB0cmVlJ3Mgc2NvcGUgYW5kIHJlY2VpdmVzIHRoZSBub2RlcyBhYm91dCB0byBiZSBkcmFnZ2VkIGFzIGFuIGFyZ3VtZW50IChhcnJheSkgYW5kIHRoZSBldmVudCB0aGF0IHN0YXJ0ZWQgdGhlIGRyYWcgLSByZXR1cm4gYGZhbHNlYCB0byBwcmV2ZW50IGRyYWdnaW5nXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLmlzX2RyYWdnYWJsZVxuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0aXNfZHJhZ2dhYmxlIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBjaGVja3Mgc2hvdWxkIGNvbnN0YW50bHkgYmUgbWFkZSB3aGlsZSB0aGUgdXNlciBpcyBkcmFnZ2luZyB0aGUgbm9kZSAoYXMgb3Bwb3NlZCB0byBjaGVja2luZyBvbmx5IG9uIGRyb3ApLCBkZWZhdWx0IGlzIGB0cnVlYFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC5jaGVja193aGlsZV9kcmFnZ2luZ1xuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0Y2hlY2tfd2hpbGVfZHJhZ2dpbmcgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIG5vZGVzIGZyb20gdGhpcyB0cmVlIHNob3VsZCBvbmx5IGJlIGNvcGllZCB3aXRoIGRuZCAoYXMgb3Bwb3NlZCB0byBtb3ZlZCksIGRlZmF1bHQgaXMgYGZhbHNlYFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC5hbHdheXNfY29weVxuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0YWx3YXlzX2NvcHkgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiB3aGVuIGRyb3BwaW5nIGEgbm9kZSBcImluc2lkZVwiLCB0aGlzIHNldHRpbmcgaW5kaWNhdGVzIHRoZSBwb3NpdGlvbiB0aGUgbm9kZSBzaG91bGQgZ28gdG8gLSBpdCBjYW4gYmUgYW4gaW50ZWdlciBvciBhIHN0cmluZzogXCJmaXJzdFwiIChzYW1lIGFzIDApIG9yIFwibGFzdFwiLCBkZWZhdWx0IGlzIGAwYFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC5pbnNpZGVfcG9zXG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHRpbnNpZGVfcG9zIDogMCxcblx0XHQvKipcblx0XHQgKiB3aGVuIHN0YXJ0aW5nIHRoZSBkcmFnIG9uIGEgbm9kZSB0aGF0IGlzIHNlbGVjdGVkIHRoaXMgc2V0dGluZyBjb250cm9scyBpZiBhbGwgc2VsZWN0ZWQgbm9kZXMgYXJlIGRyYWdnZWQgb3Igb25seSB0aGUgc2luZ2xlIG5vZGUsIGRlZmF1bHQgaXMgYHRydWVgLCB3aGljaCBtZWFucyBhbGwgc2VsZWN0ZWQgbm9kZXMgYXJlIGRyYWdnZWQgd2hlbiB0aGUgZHJhZyBpcyBzdGFydGVkIG9uIGEgc2VsZWN0ZWQgbm9kZVxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC5kcmFnX3NlbGVjdGlvblxuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0ZHJhZ19zZWxlY3Rpb24gOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGNvbnRyb2xzIHdoZXRoZXIgZG5kIHdvcmtzIG9uIHRvdWNoIGRldmljZXMuIElmIGxlZnQgYXMgYm9vbGVhbiB0cnVlIGRuZCB3aWxsIHdvcmsgdGhlIHNhbWUgYXMgaW4gZGVza3RvcCBicm93c2Vycywgd2hpY2ggaW4gc29tZSBjYXNlcyBtYXkgaW1wYWlyIHNjcm9sbGluZy4gSWYgc2V0IHRvIGJvb2xlYW4gZmFsc2UgZG5kIHdpbGwgbm90IHdvcmsgb24gdG91Y2ggZGV2aWNlcy4gVGhlcmUgaXMgYSBzcGVjaWFsIHRoaXJkIG9wdGlvbiAtIHN0cmluZyBcInNlbGVjdGVkXCIgd2hpY2ggbWVhbnMgb25seSBzZWxlY3RlZCBub2RlcyBjYW4gYmUgZHJhZ2dlZCBvbiB0b3VjaCBkZXZpY2VzLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC50b3VjaFxuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0dG91Y2ggOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGNvbnRyb2xzIHdoZXRoZXIgaXRlbXMgY2FuIGJlIGRyb3BwZWQgYW55d2hlcmUgb24gdGhlIG5vZGUsIG5vdCBqdXN0IG9uIHRoZSBhbmNob3IsIGJ5IGRlZmF1bHQgb25seSB0aGUgbm9kZSBhbmNob3IgaXMgYSB2YWxpZCBkcm9wIHRhcmdldC4gV29ya3MgYmVzdCB3aXRoIHRoZSB3aG9sZXJvdyBwbHVnaW4uIElmIGVuYWJsZWQgb24gbW9iaWxlIGRlcGVuZGluZyBvbiB0aGUgaW50ZXJmYWNlIGl0IG1pZ2h0IGJlIGhhcmQgZm9yIHRoZSB1c2VyIHRvIGNhbmNlbCB0aGUgZHJvcCwgc2luY2UgdGhlIHdob2xlIHRyZWUgY29udGFpbmVyIHdpbGwgYmUgYSB2YWxpZCBkcm9wIHRhcmdldC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQubGFyZ2VfZHJvcF90YXJnZXRcblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdGxhcmdlX2Ryb3BfdGFyZ2V0IDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogY29udHJvbHMgd2hldGhlciBhIGRyYWcgY2FuIGJlIGluaXRpYXRlZCBmcm9tIGFueSBwYXJ0IG9mIHRoZSBub2RlIGFuZCBub3QganVzdCB0aGUgdGV4dC9pY29uIHBhcnQsIHdvcmtzIGJlc3Qgd2l0aCB0aGUgd2hvbGVyb3cgcGx1Z2luLiBLZWVwIGluIG1pbmQgaXQgY2FuIGNhdXNlIHByb2JsZW1zIHdpdGggdHJlZSBzY3JvbGxpbmcgb24gbW9iaWxlIGRlcGVuZGluZyBvbiB0aGUgaW50ZXJmYWNlIC0gaW4gdGhhdCBjYXNlIHNldCB0aGUgdG91Y2ggb3B0aW9uIHRvIFwic2VsZWN0ZWRcIi5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQubGFyZ2VfZHJhZ190YXJnZXRcblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdGxhcmdlX2RyYWdfdGFyZ2V0IDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogY29udHJvbHMgd2hldGhlciB1c2UgSFRNTDUgZG5kIGFwaSBpbnN0ZWFkIG9mIGNsYXNzaWNhbC4gVGhhdCB3aWxsIGFsbG93IGJldHRlciBpbnRlZ3JhdGlvbiBvZiBkbmQgZXZlbnRzIHdpdGggb3RoZXIgSFRNTDUgY29udHJvbHMuXG5cdFx0ICogQHJlZmVyZW5jZSBodHRwOi8vY2FuaXVzZS5jb20vI2ZlYXQ9ZHJhZ25kcm9wXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLnVzZV9odG1sNVxuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0dXNlX2h0bWw1OiBmYWxzZVxuXHR9O1xuXHR2YXIgZHJnLCBlbG07XG5cdC8vIFRPRE86IG5vdyBjaGVjayB3b3JrcyBieSBjaGVja2luZyBmb3IgZWFjaCBub2RlIGluZGl2aWR1YWxseSwgaG93IGFib3V0IG1heF9jaGlsZHJlbiwgdW5pcXVlLCBldGM/XG5cdCQuanN0cmVlLnBsdWdpbnMuZG5kID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuXHRcdFx0cGFyZW50LmluaXQuY2FsbCh0aGlzLCBlbCwgb3B0aW9ucyk7XG5cdFx0XHR0aGlzLnNldHRpbmdzLmRuZC51c2VfaHRtbDUgPSB0aGlzLnNldHRpbmdzLmRuZC51c2VfaHRtbDUgJiYgKCdkcmFnZ2FibGUnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSk7XG5cdFx0fTtcblx0XHR0aGlzLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYXJlbnQuYmluZC5jYWxsKHRoaXMpO1xuXG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0Lm9uKHRoaXMuc2V0dGluZ3MuZG5kLnVzZV9odG1sNSA/ICdkcmFnc3RhcnQuanN0cmVlJyA6ICdtb3VzZWRvd24uanN0cmVlIHRvdWNoc3RhcnQuanN0cmVlJywgdGhpcy5zZXR0aW5ncy5kbmQubGFyZ2VfZHJhZ190YXJnZXQgPyAnLmpzdHJlZS1ub2RlJyA6ICcuanN0cmVlLWFuY2hvcicsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuZG5kLmxhcmdlX2RyYWdfdGFyZ2V0ICYmICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qc3RyZWUtbm9kZScpWzBdICE9PSBlLmN1cnJlbnRUYXJnZXQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihlLnR5cGUgPT09IFwidG91Y2hzdGFydFwiICYmICghdGhpcy5zZXR0aW5ncy5kbmQudG91Y2ggfHwgKHRoaXMuc2V0dGluZ3MuZG5kLnRvdWNoID09PSAnc2VsZWN0ZWQnICYmICEkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnLmpzdHJlZS1ub2RlJykuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuaGFzQ2xhc3MoJ2pzdHJlZS1jbGlja2VkJykpKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhciBvYmogPSB0aGlzLmdldF9ub2RlKGUudGFyZ2V0KSxcblx0XHRcdFx0XHRcdFx0bWx0ID0gdGhpcy5pc19zZWxlY3RlZChvYmopICYmIHRoaXMuc2V0dGluZ3MuZG5kLmRyYWdfc2VsZWN0aW9uID8gdGhpcy5nZXRfdG9wX3NlbGVjdGVkKCkubGVuZ3RoIDogMSxcblx0XHRcdFx0XHRcdFx0dHh0ID0gKG1sdCA+IDEgPyBtbHQgKyAnICcgKyB0aGlzLmdldF9zdHJpbmcoJ25vZGVzJykgOiB0aGlzLmdldF90ZXh0KGUuY3VycmVudFRhcmdldCkpO1xuXHRcdFx0XHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jb3JlLmZvcmNlX3RleHQpIHtcblx0XHRcdFx0XHRcdFx0dHh0ID0gJC52YWthdGEuaHRtbC5lc2NhcGUodHh0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKG9iaiAmJiBvYmouaWQgJiYgb2JqLmlkICE9PSAkLmpzdHJlZS5yb290ICYmIChlLndoaWNoID09PSAxIHx8IGUudHlwZSA9PT0gXCJ0b3VjaHN0YXJ0XCIgfHwgZS50eXBlID09PSBcImRyYWdzdGFydFwiKSAmJlxuXHRcdFx0XHRcdFx0XHQodGhpcy5zZXR0aW5ncy5kbmQuaXNfZHJhZ2dhYmxlID09PSB0cnVlIHx8ICgkLmlzRnVuY3Rpb24odGhpcy5zZXR0aW5ncy5kbmQuaXNfZHJhZ2dhYmxlKSAmJiB0aGlzLnNldHRpbmdzLmRuZC5pc19kcmFnZ2FibGUuY2FsbCh0aGlzLCAobWx0ID4gMSA/IHRoaXMuZ2V0X3RvcF9zZWxlY3RlZCh0cnVlKSA6IFtvYmpdKSwgZSkpKVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdGRyZyA9IHsgJ2pzdHJlZScgOiB0cnVlLCAnb3JpZ2luJyA6IHRoaXMsICdvYmonIDogdGhpcy5nZXRfbm9kZShvYmosdHJ1ZSksICdub2RlcycgOiBtbHQgPiAxID8gdGhpcy5nZXRfdG9wX3NlbGVjdGVkKCkgOiBbb2JqLmlkXSB9O1xuXHRcdFx0XHRcdFx0XHRlbG0gPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLnNldHRpbmdzLmRuZC51c2VfaHRtbDUpIHtcblx0XHRcdFx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoJ3N0YXJ0JywgZSwgeyAnaGVscGVyJzogJCgpLCAnZWxlbWVudCc6IGVsbSwgJ2RhdGEnOiBkcmcgfSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LnRyaWdnZXIoJ21vdXNlZG93bi5qc3RyZWUnKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJC52YWthdGEuZG5kLnN0YXJ0KGUsIGRyZywgJzxkaXYgaWQ9XCJqc3RyZWUtZG5kXCIgY2xhc3M9XCJqc3RyZWUtJyArIHRoaXMuZ2V0X3RoZW1lKCkgKyAnIGpzdHJlZS0nICsgdGhpcy5nZXRfdGhlbWUoKSArICctJyArIHRoaXMuZ2V0X3RoZW1lX3ZhcmlhbnQoKSArICcgJyArICggdGhpcy5zZXR0aW5ncy5jb3JlLnRoZW1lcy5yZXNwb25zaXZlID8gJyBqc3RyZWUtZG5kLXJlc3BvbnNpdmUnIDogJycgKSArICdcIj48aSBjbGFzcz1cImpzdHJlZS1pY29uIGpzdHJlZS1lclwiPjwvaT4nICsgdHh0ICsgJzxpbnMgY2xhc3M9XCJqc3RyZWUtY29weVwiIHN0eWxlPVwiZGlzcGxheTpub25lO1wiPis8L2lucz48L2Rpdj4nKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLmRuZC51c2VfaHRtbDUpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdFx0Lm9uKCdkcmFnb3Zlci5qc3RyZWUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcignbW92ZScsIGUsIHsgJ2hlbHBlcic6ICQoKSwgJ2VsZW1lbnQnOiBlbG0sICdkYXRhJzogZHJnIH0pO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC8vLm9uKCdkcmFnZW50ZXIuanN0cmVlJywgdGhpcy5zZXR0aW5ncy5kbmQubGFyZ2VfZHJvcF90YXJnZXQgPyAnLmpzdHJlZS1ub2RlJyA6ICcuanN0cmVlLWFuY2hvcicsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHQvL1x0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Ly9cdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKCdtb3ZlJywgZSwgeyAnaGVscGVyJzogJCgpLCAnZWxlbWVudCc6IGVsbSwgJ2RhdGEnOiBkcmcgfSk7XG5cdFx0XHRcdFx0Ly9cdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdC8vXHR9LCB0aGlzKSlcblx0XHRcdFx0XHQub24oJ2Ryb3AuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcignc3RvcCcsIGUsIHsgJ2hlbHBlcic6ICQoKSwgJ2VsZW1lbnQnOiBlbG0sICdkYXRhJzogZHJnIH0pO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR0aGlzLnJlZHJhd19ub2RlID0gZnVuY3Rpb24ob2JqLCBkZWVwLCBjYWxsYmFjaywgZm9yY2VfcmVuZGVyKSB7XG5cdFx0XHRvYmogPSBwYXJlbnQucmVkcmF3X25vZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdGlmIChvYmogJiYgdGhpcy5zZXR0aW5ncy5kbmQudXNlX2h0bWw1KSB7XG5cdFx0XHRcdGlmICh0aGlzLnNldHRpbmdzLmRuZC5sYXJnZV9kcmFnX3RhcmdldCkge1xuXHRcdFx0XHRcdG9iai5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIHRydWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBpLCBqLCB0bXAgPSBudWxsO1xuXHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYob2JqLmNoaWxkTm9kZXNbaV0gJiYgb2JqLmNoaWxkTm9kZXNbaV0uY2xhc3NOYW1lICYmIG9iai5jaGlsZE5vZGVzW2ldLmNsYXNzTmFtZS5pbmRleE9mKFwianN0cmVlLWFuY2hvclwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0dG1wID0gb2JqLmNoaWxkTm9kZXNbaV07XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih0bXApIHtcblx0XHRcdFx0XHRcdHRtcC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9O1xuXHR9O1xuXG5cdCQoZnVuY3Rpb24oKSB7XG5cdFx0Ly8gYmluZCBvbmx5IG9uY2UgZm9yIGFsbCBpbnN0YW5jZXNcblx0XHR2YXIgbGFzdG12ID0gZmFsc2UsXG5cdFx0XHRsYXN0ZXIgPSBmYWxzZSxcblx0XHRcdGxhc3RldiA9IGZhbHNlLFxuXHRcdFx0b3BlbnRvID0gZmFsc2UsXG5cdFx0XHRtYXJrZXIgPSAkKCc8ZGl2IGlkPVwianN0cmVlLW1hcmtlclwiPiYjMTYwOzwvZGl2PicpLmhpZGUoKTsgLy8uYXBwZW5kVG8oJ2JvZHknKTtcblxuXHRcdCQoZG9jdW1lbnQpXG5cdFx0XHQub24oJ2RyYWdvdmVyLnZha2F0YS5qc3RyZWUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRpZiAoZWxtKSB7XG5cdFx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKCdtb3ZlJywgZSwgeyAnaGVscGVyJzogJCgpLCAnZWxlbWVudCc6IGVsbSwgJ2RhdGEnOiBkcmcgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQub24oJ2Ryb3AudmFrYXRhLmpzdHJlZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGlmIChlbG0pIHtcblx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoJ3N0b3AnLCBlLCB7ICdoZWxwZXInOiAkKCksICdlbGVtZW50JzogZWxtLCAnZGF0YSc6IGRyZyB9KTtcblx0XHRcdFx0XHRlbG0gPSBudWxsO1xuXHRcdFx0XHRcdGRyZyA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQub24oJ2RuZF9zdGFydC52YWthdGEuanN0cmVlJywgZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0bGFzdG12ID0gZmFsc2U7XG5cdFx0XHRcdGxhc3RldiA9IGZhbHNlO1xuXHRcdFx0XHRpZighZGF0YSB8fCAhZGF0YS5kYXRhIHx8ICFkYXRhLmRhdGEuanN0cmVlKSB7IHJldHVybjsgfVxuXHRcdFx0XHRtYXJrZXIuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7IC8vLnNob3coKTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ2RuZF9tb3ZlLnZha2F0YS5qc3RyZWUnLCBmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHR2YXIgaXNEaWZmZXJlbnROb2RlID0gZGF0YS5ldmVudC50YXJnZXQgIT09IGxhc3Rldi50YXJnZXQ7XG5cdFx0XHRcdGlmKG9wZW50bykge1xuXHRcdFx0XHRcdGlmICghZGF0YS5ldmVudCB8fCBkYXRhLmV2ZW50LnR5cGUgIT09ICdkcmFnb3ZlcicgfHwgaXNEaWZmZXJlbnROb2RlKSB7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQob3BlbnRvKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIWRhdGEgfHwgIWRhdGEuZGF0YSB8fCAhZGF0YS5kYXRhLmpzdHJlZSkgeyByZXR1cm47IH1cblxuXHRcdFx0XHQvLyBpZiB3ZSBhcmUgaG92ZXJpbmcgdGhlIG1hcmtlciBpbWFnZSBkbyBub3RoaW5nIChjYW4gaGFwcGVuIG9uIFwiaW5zaWRlXCIgZHJhZ3MpXG5cdFx0XHRcdGlmKGRhdGEuZXZlbnQudGFyZ2V0LmlkICYmIGRhdGEuZXZlbnQudGFyZ2V0LmlkID09PSAnanN0cmVlLW1hcmtlcicpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0bGFzdGV2ID0gZGF0YS5ldmVudDtcblxuXHRcdFx0XHR2YXIgaW5zID0gJC5qc3RyZWUucmVmZXJlbmNlKGRhdGEuZXZlbnQudGFyZ2V0KSxcblx0XHRcdFx0XHRyZWYgPSBmYWxzZSxcblx0XHRcdFx0XHRvZmYgPSBmYWxzZSxcblx0XHRcdFx0XHRyZWwgPSBmYWxzZSxcblx0XHRcdFx0XHR0bXAsIGwsIHQsIGgsIHAsIGksIG8sIG9rLCB0MSwgdDIsIG9wLCBwcywgcHIsIGlwLCB0bSwgaXNfY29weSwgcG47XG5cdFx0XHRcdC8vIGlmIHdlIGFyZSBvdmVyIGFuIGluc3RhbmNlXG5cdFx0XHRcdGlmKGlucyAmJiBpbnMuX2RhdGEgJiYgaW5zLl9kYXRhLmRuZCkge1xuXHRcdFx0XHRcdG1hcmtlci5hdHRyKCdjbGFzcycsICdqc3RyZWUtJyArIGlucy5nZXRfdGhlbWUoKSArICggaW5zLnNldHRpbmdzLmNvcmUudGhlbWVzLnJlc3BvbnNpdmUgPyAnIGpzdHJlZS1kbmQtcmVzcG9uc2l2ZScgOiAnJyApKTtcblx0XHRcdFx0XHRpc19jb3B5ID0gZGF0YS5kYXRhLm9yaWdpbiAmJiAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuYWx3YXlzX2NvcHkgfHwgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmNvcHkgJiYgKGRhdGEuZXZlbnQubWV0YUtleSB8fCBkYXRhLmV2ZW50LmN0cmxLZXkpKSk7XG5cdFx0XHRcdFx0ZGF0YS5oZWxwZXJcblx0XHRcdFx0XHRcdC5jaGlsZHJlbigpLmF0dHIoJ2NsYXNzJywgJ2pzdHJlZS0nICsgaW5zLmdldF90aGVtZSgpICsgJyBqc3RyZWUtJyArIGlucy5nZXRfdGhlbWUoKSArICctJyArIGlucy5nZXRfdGhlbWVfdmFyaWFudCgpICsgJyAnICsgKCBpbnMuc2V0dGluZ3MuY29yZS50aGVtZXMucmVzcG9uc2l2ZSA/ICcganN0cmVlLWRuZC1yZXNwb25zaXZlJyA6ICcnICkpXG5cdFx0XHRcdFx0XHQuZmluZCgnLmpzdHJlZS1jb3B5JykuZmlyc3QoKVsgaXNfY29weSA/ICdzaG93JyA6ICdoaWRlJyBdKCk7XG5cblx0XHRcdFx0XHQvLyBpZiBhcmUgaG92ZXJpbmcgdGhlIGNvbnRhaW5lciBpdHNlbGYgYWRkIGEgbmV3IHJvb3Qgbm9kZVxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coZGF0YS5ldmVudCk7XG5cdFx0XHRcdFx0aWYoIChkYXRhLmV2ZW50LnRhcmdldCA9PT0gaW5zLmVsZW1lbnRbMF0gfHwgZGF0YS5ldmVudC50YXJnZXQgPT09IGlucy5nZXRfY29udGFpbmVyX3VsKClbMF0pICYmIGlucy5nZXRfY29udGFpbmVyX3VsKCkuY2hpbGRyZW4oKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdG9rID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gZGF0YS5kYXRhLm5vZGVzLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdFx0XHRvayA9IG9rICYmIGlucy5jaGVjayggKGRhdGEuZGF0YS5vcmlnaW4gJiYgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmFsd2F5c19jb3B5IHx8IChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5jb3B5ICYmIChkYXRhLmV2ZW50Lm1ldGFLZXkgfHwgZGF0YS5ldmVudC5jdHJsS2V5KSkgKSA/IFwiY29weV9ub2RlXCIgOiBcIm1vdmVfbm9kZVwiKSwgKGRhdGEuZGF0YS5vcmlnaW4gJiYgZGF0YS5kYXRhLm9yaWdpbiAhPT0gaW5zID8gZGF0YS5kYXRhLm9yaWdpbi5nZXRfbm9kZShkYXRhLmRhdGEubm9kZXNbdDFdKSA6IGRhdGEuZGF0YS5ub2Rlc1t0MV0pLCAkLmpzdHJlZS5yb290LCAnbGFzdCcsIHsgJ2RuZCcgOiB0cnVlLCAncmVmJyA6IGlucy5nZXRfbm9kZSgkLmpzdHJlZS5yb290KSwgJ3BvcycgOiAnaScsICdvcmlnaW4nIDogZGF0YS5kYXRhLm9yaWdpbiwgJ2lzX211bHRpJyA6IChkYXRhLmRhdGEub3JpZ2luICYmIGRhdGEuZGF0YS5vcmlnaW4gIT09IGlucyksICdpc19mb3JlaWduJyA6ICghZGF0YS5kYXRhLm9yaWdpbikgfSk7XG5cdFx0XHRcdFx0XHRcdGlmKCFvaykgeyBicmVhazsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYob2spIHtcblx0XHRcdFx0XHRcdFx0bGFzdG12ID0geyAnaW5zJyA6IGlucywgJ3BhcicgOiAkLmpzdHJlZS5yb290LCAncG9zJyA6ICdsYXN0JyB9O1xuXHRcdFx0XHRcdFx0XHRtYXJrZXIuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRkYXRhLmhlbHBlci5maW5kKCcuanN0cmVlLWljb24nKS5maXJzdCgpLnJlbW92ZUNsYXNzKCdqc3RyZWUtZXInKS5hZGRDbGFzcygnanN0cmVlLW9rJyk7XG5cdFx0XHRcdFx0XHRcdGlmIChkYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQgJiYgZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlcikge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGEuZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IGlzX2NvcHkgPyAnY29weScgOiAnbW92ZSc7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdC8vIGlmIHdlIGFyZSBob3ZlcmluZyBhIHRyZWUgbm9kZVxuXHRcdFx0XHRcdFx0cmVmID0gaW5zLnNldHRpbmdzLmRuZC5sYXJnZV9kcm9wX3RhcmdldCA/ICQoZGF0YS5ldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5qc3RyZWUtbm9kZScpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpIDogJChkYXRhLmV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLmpzdHJlZS1hbmNob3InKTtcblx0XHRcdFx0XHRcdGlmKHJlZiAmJiByZWYubGVuZ3RoICYmIHJlZi5wYXJlbnQoKS5pcygnLmpzdHJlZS1jbG9zZWQsIC5qc3RyZWUtb3BlbiwgLmpzdHJlZS1sZWFmJykpIHtcblx0XHRcdFx0XHRcdFx0b2ZmID0gcmVmLm9mZnNldCgpO1xuXHRcdFx0XHRcdFx0XHRyZWwgPSAoZGF0YS5ldmVudC5wYWdlWSAhPT0gdW5kZWZpbmVkID8gZGF0YS5ldmVudC5wYWdlWSA6IGRhdGEuZXZlbnQub3JpZ2luYWxFdmVudC5wYWdlWSkgLSBvZmYudG9wO1xuXHRcdFx0XHRcdFx0XHRoID0gcmVmLm91dGVySGVpZ2h0KCk7XG5cdFx0XHRcdFx0XHRcdGlmKHJlbCA8IGggLyAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0byA9IFsnYicsICdpJywgJ2EnXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmKHJlbCA+IGggLSBoIC8gMykge1xuXHRcdFx0XHRcdFx0XHRcdG8gPSBbJ2EnLCAnaScsICdiJ107XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0byA9IHJlbCA+IGggLyAyID8gWydpJywgJ2EnLCAnYiddIDogWydpJywgJ2InLCAnYSddO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChvLCBmdW5jdGlvbiAoaiwgdikge1xuXHRcdFx0XHRcdFx0XHRcdHN3aXRjaCh2KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdiJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bCA9IG9mZi5sZWZ0IC0gNjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dCA9IG9mZi50b3A7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHAgPSBpbnMuZ2V0X3BhcmVudChyZWYpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpID0gcmVmLnBhcmVudCgpLmluZGV4KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnaSc6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlwID0gaW5zLnNldHRpbmdzLmRuZC5pbnNpZGVfcG9zO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bSA9IGlucy5nZXRfbm9kZShyZWYucGFyZW50KCkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRsID0gb2ZmLmxlZnQgLSAyO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0ID0gb2ZmLnRvcCArIGggLyAyICsgMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cCA9IHRtLmlkO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpID0gaXAgPT09ICdmaXJzdCcgPyAwIDogKGlwID09PSAnbGFzdCcgPyB0bS5jaGlsZHJlbi5sZW5ndGggOiBNYXRoLm1pbihpcCwgdG0uY2hpbGRyZW4ubGVuZ3RoKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnYSc6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGwgPSBvZmYubGVmdCAtIDY7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHQgPSBvZmYudG9wICsgaDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cCA9IGlucy5nZXRfcGFyZW50KHJlZik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGkgPSByZWYucGFyZW50KCkuaW5kZXgoKSArIDE7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRvayA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBkYXRhLmRhdGEubm9kZXMubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvcCA9IGRhdGEuZGF0YS5vcmlnaW4gJiYgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmFsd2F5c19jb3B5IHx8IChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5jb3B5ICYmIChkYXRhLmV2ZW50Lm1ldGFLZXkgfHwgZGF0YS5ldmVudC5jdHJsS2V5KSkpID8gXCJjb3B5X25vZGVcIiA6IFwibW92ZV9ub2RlXCI7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcyA9IGk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihvcCA9PT0gXCJtb3ZlX25vZGVcIiAmJiB2ID09PSAnYScgJiYgKGRhdGEuZGF0YS5vcmlnaW4gJiYgZGF0YS5kYXRhLm9yaWdpbiA9PT0gaW5zKSAmJiBwID09PSBpbnMuZ2V0X3BhcmVudChkYXRhLmRhdGEubm9kZXNbdDFdKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwciA9IGlucy5nZXRfbm9kZShwKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYocHMgPiAkLmluQXJyYXkoZGF0YS5kYXRhLm5vZGVzW3QxXSwgcHIuY2hpbGRyZW4pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHMgLT0gMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0b2sgPSBvayAmJiAoIChpbnMgJiYgaW5zLnNldHRpbmdzICYmIGlucy5zZXR0aW5ncy5kbmQgJiYgaW5zLnNldHRpbmdzLmRuZC5jaGVja193aGlsZV9kcmFnZ2luZyA9PT0gZmFsc2UpIHx8IGlucy5jaGVjayhvcCwgKGRhdGEuZGF0YS5vcmlnaW4gJiYgZGF0YS5kYXRhLm9yaWdpbiAhPT0gaW5zID8gZGF0YS5kYXRhLm9yaWdpbi5nZXRfbm9kZShkYXRhLmRhdGEubm9kZXNbdDFdKSA6IGRhdGEuZGF0YS5ub2Rlc1t0MV0pLCBwLCBwcywgeyAnZG5kJyA6IHRydWUsICdyZWYnIDogaW5zLmdldF9ub2RlKHJlZi5wYXJlbnQoKSksICdwb3MnIDogdiwgJ29yaWdpbicgOiBkYXRhLmRhdGEub3JpZ2luLCAnaXNfbXVsdGknIDogKGRhdGEuZGF0YS5vcmlnaW4gJiYgZGF0YS5kYXRhLm9yaWdpbiAhPT0gaW5zKSwgJ2lzX2ZvcmVpZ24nIDogKCFkYXRhLmRhdGEub3JpZ2luKSB9KSApO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoIW9rKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGlucyAmJiBpbnMubGFzdF9lcnJvcikgeyBsYXN0ZXIgPSBpbnMubGFzdF9lcnJvcigpOyB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZih2ID09PSAnaScgJiYgcmVmLnBhcmVudCgpLmlzKCcuanN0cmVlLWNsb3NlZCcpICYmIGlucy5zZXR0aW5ncy5kbmQub3Blbl90aW1lb3V0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWRhdGEuZXZlbnQgfHwgZGF0YS5ldmVudC50eXBlICE9PSAnZHJhZ292ZXInIHx8IGlzRGlmZmVyZW50Tm9kZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAob3BlbnRvKSB7IGNsZWFyVGltZW91dChvcGVudG8pOyB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9wZW50byA9IHNldFRpbWVvdXQoKGZ1bmN0aW9uICh4LCB6KSB7IHJldHVybiBmdW5jdGlvbiAoKSB7IHgub3Blbl9ub2RlKHopOyB9OyB9KGlucywgcmVmKSksIGlucy5zZXR0aW5ncy5kbmQub3Blbl90aW1lb3V0KTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYob2spIHtcblx0XHRcdFx0XHRcdFx0XHRcdHBuID0gaW5zLmdldF9ub2RlKHAsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFwbi5oYXNDbGFzcygnLmpzdHJlZS1kbmQtcGFyZW50JykpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JCgnLmpzdHJlZS1kbmQtcGFyZW50JykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1kbmQtcGFyZW50Jyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBuLmFkZENsYXNzKCdqc3RyZWUtZG5kLXBhcmVudCcpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0bGFzdG12ID0geyAnaW5zJyA6IGlucywgJ3BhcicgOiBwLCAncG9zJyA6IHYgPT09ICdpJyAmJiBpcCA9PT0gJ2xhc3QnICYmIGkgPT09IDAgJiYgIWlucy5pc19sb2FkZWQodG0pID8gJ2xhc3QnIDogaSB9O1xuXHRcdFx0XHRcdFx0XHRcdFx0bWFya2VyLmNzcyh7ICdsZWZ0JyA6IGwgKyAncHgnLCAndG9wJyA6IHQgKyAncHgnIH0pLnNob3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuaGVscGVyLmZpbmQoJy5qc3RyZWUtaWNvbicpLmZpcnN0KCkucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1lcicpLmFkZENsYXNzKCdqc3RyZWUtb2snKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQgJiYgZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlcikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBpc19jb3B5ID8gJ2NvcHknIDogJ21vdmUnO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0bGFzdGVyID0ge307XG5cdFx0XHRcdFx0XHRcdFx0XHRvID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRpZihvID09PSB0cnVlKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQkKCcuanN0cmVlLWRuZC1wYXJlbnQnKS5yZW1vdmVDbGFzcygnanN0cmVlLWRuZC1wYXJlbnQnKTtcblx0XHRcdFx0bGFzdG12ID0gZmFsc2U7XG5cdFx0XHRcdGRhdGEuaGVscGVyLmZpbmQoJy5qc3RyZWUtaWNvbicpLnJlbW92ZUNsYXNzKCdqc3RyZWUtb2snKS5hZGRDbGFzcygnanN0cmVlLWVyJyk7XG5cdFx0XHRcdGlmIChkYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQgJiYgZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlcikge1xuXHRcdFx0XHRcdC8vZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ25vbmUnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG1hcmtlci5oaWRlKCk7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdkbmRfc2Nyb2xsLnZha2F0YS5qc3RyZWUnLCBmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRpZighZGF0YSB8fCAhZGF0YS5kYXRhIHx8ICFkYXRhLmRhdGEuanN0cmVlKSB7IHJldHVybjsgfVxuXHRcdFx0XHRtYXJrZXIuaGlkZSgpO1xuXHRcdFx0XHRsYXN0bXYgPSBmYWxzZTtcblx0XHRcdFx0bGFzdGV2ID0gZmFsc2U7XG5cdFx0XHRcdGRhdGEuaGVscGVyLmZpbmQoJy5qc3RyZWUtaWNvbicpLmZpcnN0KCkucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1vaycpLmFkZENsYXNzKCdqc3RyZWUtZXInKTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ2RuZF9zdG9wLnZha2F0YS5qc3RyZWUnLCBmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHQkKCcuanN0cmVlLWRuZC1wYXJlbnQnKS5yZW1vdmVDbGFzcygnanN0cmVlLWRuZC1wYXJlbnQnKTtcblx0XHRcdFx0aWYob3BlbnRvKSB7IGNsZWFyVGltZW91dChvcGVudG8pOyB9XG5cdFx0XHRcdGlmKCFkYXRhIHx8ICFkYXRhLmRhdGEgfHwgIWRhdGEuZGF0YS5qc3RyZWUpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdG1hcmtlci5oaWRlKCkuZGV0YWNoKCk7XG5cdFx0XHRcdHZhciBpLCBqLCBub2RlcyA9IFtdO1xuXHRcdFx0XHRpZihsYXN0bXYpIHtcblx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkYXRhLmRhdGEubm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRub2Rlc1tpXSA9IGRhdGEuZGF0YS5vcmlnaW4gPyBkYXRhLmRhdGEub3JpZ2luLmdldF9ub2RlKGRhdGEuZGF0YS5ub2Rlc1tpXSkgOiBkYXRhLmRhdGEubm9kZXNbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGxhc3Rtdi5pbnNbIGRhdGEuZGF0YS5vcmlnaW4gJiYgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmFsd2F5c19jb3B5IHx8IChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5jb3B5ICYmIChkYXRhLmV2ZW50Lm1ldGFLZXkgfHwgZGF0YS5ldmVudC5jdHJsS2V5KSkpID8gJ2NvcHlfbm9kZScgOiAnbW92ZV9ub2RlJyBdKG5vZGVzLCBsYXN0bXYucGFyLCBsYXN0bXYucG9zLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBkYXRhLmRhdGEub3JpZ2luKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpID0gJChkYXRhLmV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLmpzdHJlZScpO1xuXHRcdFx0XHRcdGlmKGkubGVuZ3RoICYmIGxhc3RlciAmJiBsYXN0ZXIuZXJyb3IgJiYgbGFzdGVyLmVycm9yID09PSAnY2hlY2snKSB7XG5cdFx0XHRcdFx0XHRpID0gaS5qc3RyZWUodHJ1ZSk7XG5cdFx0XHRcdFx0XHRpZihpKSB7XG5cdFx0XHRcdFx0XHRcdGkuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIGxhc3Rlcik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGxhc3RldiA9IGZhbHNlO1xuXHRcdFx0XHRsYXN0bXYgPSBmYWxzZTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ2tleXVwLmpzdHJlZSBrZXlkb3duLmpzdHJlZScsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdGRhdGEgPSAkLnZha2F0YS5kbmQuX2dldCgpO1xuXHRcdFx0XHRpZihkYXRhICYmIGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0aWYgKGUudHlwZSA9PT0gXCJrZXl1cFwiICYmIGUud2hpY2ggPT09IDI3KSB7XG5cdFx0XHRcdFx0XHRpZiAob3BlbnRvKSB7IGNsZWFyVGltZW91dChvcGVudG8pOyB9XG5cdFx0XHRcdFx0XHRsYXN0bXYgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGxhc3RlciA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0bGFzdGV2ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRvcGVudG8gPSBmYWxzZTtcblx0XHRcdFx0XHRcdG1hcmtlci5oaWRlKCkuZGV0YWNoKCk7XG5cdFx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX2NsZWFuKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGRhdGEuaGVscGVyLmZpbmQoJy5qc3RyZWUtY29weScpLmZpcnN0KClbIGRhdGEuZGF0YS5vcmlnaW4gJiYgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmFsd2F5c19jb3B5IHx8IChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5jb3B5ICYmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSkpID8gJ3Nob3cnIDogJ2hpZGUnIF0oKTtcblx0XHRcdFx0XHRcdGlmKGxhc3Rldikge1xuXHRcdFx0XHRcdFx0XHRsYXN0ZXYubWV0YUtleSA9IGUubWV0YUtleTtcblx0XHRcdFx0XHRcdFx0bGFzdGV2LmN0cmxLZXkgPSBlLmN0cmxLZXk7XG5cdFx0XHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcignbW92ZScsIGxhc3Rldik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fSk7XG5cblx0Ly8gaGVscGVyc1xuXHQoZnVuY3Rpb24gKCQpIHtcblx0XHQkLnZha2F0YS5odG1sID0ge1xuXHRcdFx0ZGl2IDogJCgnPGRpdiAvPicpLFxuXHRcdFx0ZXNjYXBlIDogZnVuY3Rpb24gKHN0cikge1xuXHRcdFx0XHRyZXR1cm4gJC52YWthdGEuaHRtbC5kaXYudGV4dChzdHIpLmh0bWwoKTtcblx0XHRcdH0sXG5cdFx0XHRzdHJpcCA6IGZ1bmN0aW9uIChzdHIpIHtcblx0XHRcdFx0cmV0dXJuICQudmFrYXRhLmh0bWwuZGl2LmVtcHR5KCkuYXBwZW5kKCQucGFyc2VIVE1MKHN0cikpLnRleHQoKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdC8vIHByaXZhdGUgdmFyaWFibGVcblx0XHR2YXIgdmFrYXRhX2RuZCA9IHtcblx0XHRcdGVsZW1lbnRcdDogZmFsc2UsXG5cdFx0XHR0YXJnZXRcdDogZmFsc2UsXG5cdFx0XHRpc19kb3duXHQ6IGZhbHNlLFxuXHRcdFx0aXNfZHJhZ1x0OiBmYWxzZSxcblx0XHRcdGhlbHBlclx0OiBmYWxzZSxcblx0XHRcdGhlbHBlcl93OiAwLFxuXHRcdFx0ZGF0YVx0OiBmYWxzZSxcblx0XHRcdGluaXRfeFx0OiAwLFxuXHRcdFx0aW5pdF95XHQ6IDAsXG5cdFx0XHRzY3JvbGxfbDogMCxcblx0XHRcdHNjcm9sbF90OiAwLFxuXHRcdFx0c2Nyb2xsX2U6IGZhbHNlLFxuXHRcdFx0c2Nyb2xsX2k6IGZhbHNlLFxuXHRcdFx0aXNfdG91Y2g6IGZhbHNlXG5cdFx0fTtcblx0XHQkLnZha2F0YS5kbmQgPSB7XG5cdFx0XHRzZXR0aW5ncyA6IHtcblx0XHRcdFx0c2Nyb2xsX3NwZWVkXHRcdDogMTAsXG5cdFx0XHRcdHNjcm9sbF9wcm94aW1pdHlcdDogMjAsXG5cdFx0XHRcdGhlbHBlcl9sZWZ0XHRcdFx0OiA1LFxuXHRcdFx0XHRoZWxwZXJfdG9wXHRcdFx0OiAxMCxcblx0XHRcdFx0dGhyZXNob2xkXHRcdFx0OiA1LFxuXHRcdFx0XHR0aHJlc2hvbGRfdG91Y2hcdFx0OiAxMFxuXHRcdFx0fSxcblx0XHRcdF90cmlnZ2VyIDogZnVuY3Rpb24gKGV2ZW50X25hbWUsIGUsIGRhdGEpIHtcblx0XHRcdFx0aWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGRhdGEgPSAkLnZha2F0YS5kbmQuX2dldCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRhdGEuZXZlbnQgPSBlO1xuXHRcdFx0XHQkKGRvY3VtZW50KS50cmlnZ2VySGFuZGxlcihcImRuZF9cIiArIGV2ZW50X25hbWUgKyBcIi52YWthdGFcIiwgZGF0YSk7XG5cdFx0XHR9LFxuXHRcdFx0X2dldCA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcImRhdGFcIlx0XHQ6IHZha2F0YV9kbmQuZGF0YSxcblx0XHRcdFx0XHRcImVsZW1lbnRcIlx0OiB2YWthdGFfZG5kLmVsZW1lbnQsXG5cdFx0XHRcdFx0XCJoZWxwZXJcIlx0OiB2YWthdGFfZG5kLmhlbHBlclxuXHRcdFx0XHR9O1xuXHRcdFx0fSxcblx0XHRcdF9jbGVhbiA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYodmFrYXRhX2RuZC5oZWxwZXIpIHsgdmFrYXRhX2RuZC5oZWxwZXIucmVtb3ZlKCk7IH1cblx0XHRcdFx0aWYodmFrYXRhX2RuZC5zY3JvbGxfaSkgeyBjbGVhckludGVydmFsKHZha2F0YV9kbmQuc2Nyb2xsX2kpOyB2YWthdGFfZG5kLnNjcm9sbF9pID0gZmFsc2U7IH1cblx0XHRcdFx0dmFrYXRhX2RuZCA9IHtcblx0XHRcdFx0XHRlbGVtZW50XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdHRhcmdldFx0OiBmYWxzZSxcblx0XHRcdFx0XHRpc19kb3duXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdGlzX2RyYWdcdDogZmFsc2UsXG5cdFx0XHRcdFx0aGVscGVyXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdGhlbHBlcl93OiAwLFxuXHRcdFx0XHRcdGRhdGFcdDogZmFsc2UsXG5cdFx0XHRcdFx0aW5pdF94XHQ6IDAsXG5cdFx0XHRcdFx0aW5pdF95XHQ6IDAsXG5cdFx0XHRcdFx0c2Nyb2xsX2w6IDAsXG5cdFx0XHRcdFx0c2Nyb2xsX3Q6IDAsXG5cdFx0XHRcdFx0c2Nyb2xsX2U6IGZhbHNlLFxuXHRcdFx0XHRcdHNjcm9sbF9pOiBmYWxzZSxcblx0XHRcdFx0XHRpc190b3VjaDogZmFsc2Vcblx0XHRcdFx0fTtcblx0XHRcdFx0JChkb2N1bWVudCkub2ZmKFwibW91c2Vtb3ZlLnZha2F0YS5qc3RyZWUgdG91Y2htb3ZlLnZha2F0YS5qc3RyZWVcIiwgJC52YWthdGEuZG5kLmRyYWcpO1xuXHRcdFx0XHQkKGRvY3VtZW50KS5vZmYoXCJtb3VzZXVwLnZha2F0YS5qc3RyZWUgdG91Y2hlbmQudmFrYXRhLmpzdHJlZVwiLCAkLnZha2F0YS5kbmQuc3RvcCk7XG5cdFx0XHR9LFxuXHRcdFx0X3Njcm9sbCA6IGZ1bmN0aW9uIChpbml0X29ubHkpIHtcblx0XHRcdFx0aWYoIXZha2F0YV9kbmQuc2Nyb2xsX2UgfHwgKCF2YWthdGFfZG5kLnNjcm9sbF9sICYmICF2YWthdGFfZG5kLnNjcm9sbF90KSkge1xuXHRcdFx0XHRcdGlmKHZha2F0YV9kbmQuc2Nyb2xsX2kpIHsgY2xlYXJJbnRlcnZhbCh2YWthdGFfZG5kLnNjcm9sbF9pKTsgdmFrYXRhX2RuZC5zY3JvbGxfaSA9IGZhbHNlOyB9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCF2YWthdGFfZG5kLnNjcm9sbF9pKSB7XG5cdFx0XHRcdFx0dmFrYXRhX2RuZC5zY3JvbGxfaSA9IHNldEludGVydmFsKCQudmFrYXRhLmRuZC5fc2Nyb2xsLCAxMDApO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihpbml0X29ubHkgPT09IHRydWUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHRcdFx0dmFyIGkgPSB2YWthdGFfZG5kLnNjcm9sbF9lLnNjcm9sbFRvcCgpLFxuXHRcdFx0XHRcdGogPSB2YWthdGFfZG5kLnNjcm9sbF9lLnNjcm9sbExlZnQoKTtcblx0XHRcdFx0dmFrYXRhX2RuZC5zY3JvbGxfZS5zY3JvbGxUb3AoaSArIHZha2F0YV9kbmQuc2Nyb2xsX3QgKiAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3NwZWVkKTtcblx0XHRcdFx0dmFrYXRhX2RuZC5zY3JvbGxfZS5zY3JvbGxMZWZ0KGogKyB2YWthdGFfZG5kLnNjcm9sbF9sICogJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9zcGVlZCk7XG5cdFx0XHRcdGlmKGkgIT09IHZha2F0YV9kbmQuc2Nyb2xsX2Uuc2Nyb2xsVG9wKCkgfHwgaiAhPT0gdmFrYXRhX2RuZC5zY3JvbGxfZS5zY3JvbGxMZWZ0KCkpIHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgb24gdGhlIGRvY3VtZW50IHdoZW4gYSBkcmFnIGNhdXNlcyBhbiBlbGVtZW50IHRvIHNjcm9sbFxuXHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0XHRcdFx0ICogQG5hbWUgZG5kX3Njcm9sbC52YWthdGFcblx0XHRcdFx0XHQgKiBAcGFyYW0ge01peGVkfSBkYXRhIGFueSBkYXRhIHN1cHBsaWVkIHdpdGggdGhlIGNhbGwgdG8gJC52YWthdGEuZG5kLnN0YXJ0XG5cdFx0XHRcdFx0ICogQHBhcmFtIHtET019IGVsZW1lbnQgdGhlIERPTSBlbGVtZW50IGJlaW5nIGRyYWdnZWRcblx0XHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gaGVscGVyIHRoZSBoZWxwZXIgc2hvd24gbmV4dCB0byB0aGUgbW91c2Vcblx0XHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gZXZlbnQgdGhlIGVsZW1lbnQgdGhhdCBpcyBzY3JvbGxpbmdcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoXCJzY3JvbGxcIiwgdmFrYXRhX2RuZC5zY3JvbGxfZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzdGFydCA6IGZ1bmN0aW9uIChlLCBkYXRhLCBodG1sKSB7XG5cdFx0XHRcdGlmKGUudHlwZSA9PT0gXCJ0b3VjaHN0YXJ0XCIgJiYgZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcyAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0pIHtcblx0XHRcdFx0XHRlLnBhZ2VYID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuXHRcdFx0XHRcdGUucGFnZVkgPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVk7XG5cdFx0XHRcdFx0ZS50YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93LnBhZ2VZT2Zmc2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZih2YWthdGFfZG5kLmlzX2RyYWcpIHsgJC52YWthdGEuZG5kLnN0b3Aoe30pOyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0LnVuc2VsZWN0YWJsZSA9IFwib25cIjtcblx0XHRcdFx0XHRlLmN1cnJlbnRUYXJnZXQub25zZWxlY3RzdGFydCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH07XG5cdFx0XHRcdFx0aWYoZS5jdXJyZW50VGFyZ2V0LnN0eWxlKSB7XG5cdFx0XHRcdFx0XHRlLmN1cnJlbnRUYXJnZXQuc3R5bGUudG91Y2hBY3Rpb24gPSBcIm5vbmVcIjtcblx0XHRcdFx0XHRcdGUuY3VycmVudFRhcmdldC5zdHlsZS5tc1RvdWNoQWN0aW9uID0gXCJub25lXCI7XG5cdFx0XHRcdFx0XHRlLmN1cnJlbnRUYXJnZXQuc3R5bGUuTW96VXNlclNlbGVjdCA9IFwibm9uZVwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaChpZ25vcmUpIHsgfVxuXHRcdFx0XHR2YWthdGFfZG5kLmluaXRfeFx0PSBlLnBhZ2VYO1xuXHRcdFx0XHR2YWthdGFfZG5kLmluaXRfeVx0PSBlLnBhZ2VZO1xuXHRcdFx0XHR2YWthdGFfZG5kLmRhdGFcdFx0PSBkYXRhO1xuXHRcdFx0XHR2YWthdGFfZG5kLmlzX2Rvd25cdD0gdHJ1ZTtcblx0XHRcdFx0dmFrYXRhX2RuZC5lbGVtZW50XHQ9IGUuY3VycmVudFRhcmdldDtcblx0XHRcdFx0dmFrYXRhX2RuZC50YXJnZXRcdD0gZS50YXJnZXQ7XG5cdFx0XHRcdHZha2F0YV9kbmQuaXNfdG91Y2hcdD0gZS50eXBlID09PSBcInRvdWNoc3RhcnRcIjtcblx0XHRcdFx0aWYoaHRtbCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHR2YWthdGFfZG5kLmhlbHBlciA9ICQoXCI8ZGl2IGlkPSd2YWthdGEtZG5kJz48L2Rpdj5cIikuaHRtbChodG1sKS5jc3Moe1xuXHRcdFx0XHRcdFx0XCJkaXNwbGF5XCJcdFx0OiBcImJsb2NrXCIsXG5cdFx0XHRcdFx0XHRcIm1hcmdpblwiXHRcdDogXCIwXCIsXG5cdFx0XHRcdFx0XHRcInBhZGRpbmdcIlx0XHQ6IFwiMFwiLFxuXHRcdFx0XHRcdFx0XCJwb3NpdGlvblwiXHRcdDogXCJhYnNvbHV0ZVwiLFxuXHRcdFx0XHRcdFx0XCJ0b3BcIlx0XHRcdDogXCItMjAwMHB4XCIsXG5cdFx0XHRcdFx0XHRcImxpbmVIZWlnaHRcIlx0OiBcIjE2cHhcIixcblx0XHRcdFx0XHRcdFwiekluZGV4XCJcdFx0OiBcIjEwMDAwXCJcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKGRvY3VtZW50KS5vbihcIm1vdXNlbW92ZS52YWthdGEuanN0cmVlIHRvdWNobW92ZS52YWthdGEuanN0cmVlXCIsICQudmFrYXRhLmRuZC5kcmFnKTtcblx0XHRcdFx0JChkb2N1bWVudCkub24oXCJtb3VzZXVwLnZha2F0YS5qc3RyZWUgdG91Y2hlbmQudmFrYXRhLmpzdHJlZVwiLCAkLnZha2F0YS5kbmQuc3RvcCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRkcmFnIDogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYoZS50eXBlID09PSBcInRvdWNobW92ZVwiICYmIGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMgJiYgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKSB7XG5cdFx0XHRcdFx0ZS5wYWdlWCA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcblx0XHRcdFx0XHRlLnBhZ2VZID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xuXHRcdFx0XHRcdGUudGFyZ2V0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3cucGFnZVhPZmZzZXQsIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvdy5wYWdlWU9mZnNldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIXZha2F0YV9kbmQuaXNfZG93bikgeyByZXR1cm47IH1cblx0XHRcdFx0aWYoIXZha2F0YV9kbmQuaXNfZHJhZykge1xuXHRcdFx0XHRcdGlmKFxuXHRcdFx0XHRcdFx0TWF0aC5hYnMoZS5wYWdlWCAtIHZha2F0YV9kbmQuaW5pdF94KSA+ICh2YWthdGFfZG5kLmlzX3RvdWNoID8gJC52YWthdGEuZG5kLnNldHRpbmdzLnRocmVzaG9sZF90b3VjaCA6ICQudmFrYXRhLmRuZC5zZXR0aW5ncy50aHJlc2hvbGQpIHx8XG5cdFx0XHRcdFx0XHRNYXRoLmFicyhlLnBhZ2VZIC0gdmFrYXRhX2RuZC5pbml0X3kpID4gKHZha2F0YV9kbmQuaXNfdG91Y2ggPyAkLnZha2F0YS5kbmQuc2V0dGluZ3MudGhyZXNob2xkX3RvdWNoIDogJC52YWthdGEuZG5kLnNldHRpbmdzLnRocmVzaG9sZClcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdGlmKHZha2F0YV9kbmQuaGVscGVyKSB7XG5cdFx0XHRcdFx0XHRcdHZha2F0YV9kbmQuaGVscGVyLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuXHRcdFx0XHRcdFx0XHR2YWthdGFfZG5kLmhlbHBlcl93ID0gdmFrYXRhX2RuZC5oZWxwZXIub3V0ZXJXaWR0aCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmFrYXRhX2RuZC5pc19kcmFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdCQodmFrYXRhX2RuZC50YXJnZXQpLm9uZSgnY2xpY2sudmFrYXRhJywgZmFsc2UpO1xuXHRcdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgb24gdGhlIGRvY3VtZW50IHdoZW4gYSBkcmFnIHN0YXJ0c1xuXHRcdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdFx0XHRcdFx0ICogQG5hbWUgZG5kX3N0YXJ0LnZha2F0YVxuXHRcdFx0XHRcdFx0ICogQHBhcmFtIHtNaXhlZH0gZGF0YSBhbnkgZGF0YSBzdXBwbGllZCB3aXRoIHRoZSBjYWxsIHRvICQudmFrYXRhLmRuZC5zdGFydFxuXHRcdFx0XHRcdFx0ICogQHBhcmFtIHtET019IGVsZW1lbnQgdGhlIERPTSBlbGVtZW50IGJlaW5nIGRyYWdnZWRcblx0XHRcdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBoZWxwZXIgdGhlIGhlbHBlciBzaG93biBuZXh0IHRvIHRoZSBtb3VzZVxuXHRcdFx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBldmVudCB0aGF0IGNhdXNlZCB0aGUgc3RhcnQgKHByb2JhYmx5IG1vdXNlbW92ZSlcblx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKFwic3RhcnRcIiwgZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgeyByZXR1cm47IH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBkICA9IGZhbHNlLCB3ICA9IGZhbHNlLFxuXHRcdFx0XHRcdGRoID0gZmFsc2UsIHdoID0gZmFsc2UsXG5cdFx0XHRcdFx0ZHcgPSBmYWxzZSwgd3cgPSBmYWxzZSxcblx0XHRcdFx0XHRkdCA9IGZhbHNlLCBkbCA9IGZhbHNlLFxuXHRcdFx0XHRcdGh0ID0gZmFsc2UsIGhsID0gZmFsc2U7XG5cblx0XHRcdFx0dmFrYXRhX2RuZC5zY3JvbGxfdCA9IDA7XG5cdFx0XHRcdHZha2F0YV9kbmQuc2Nyb2xsX2wgPSAwO1xuXHRcdFx0XHR2YWthdGFfZG5kLnNjcm9sbF9lID0gZmFsc2U7XG5cdFx0XHRcdCQoJChlLnRhcmdldCkucGFyZW50c1VudGlsKFwiYm9keVwiKS5hZGRCYWNrKCkuZ2V0KCkucmV2ZXJzZSgpKVxuXHRcdFx0XHRcdC5maWx0ZXIoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuXHQoL15hdXRvfHNjcm9sbCQvKS50ZXN0KCQodGhpcykuY3NzKFwib3ZlcmZsb3dcIikpICYmXG5cdFx0XHRcdFx0XHRcdFx0KHRoaXMuc2Nyb2xsSGVpZ2h0ID4gdGhpcy5vZmZzZXRIZWlnaHQgfHwgdGhpcy5zY3JvbGxXaWR0aCA+IHRoaXMub2Zmc2V0V2lkdGgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dmFyIHQgPSAkKHRoaXMpLCBvID0gdC5vZmZzZXQoKTtcblx0XHRcdFx0XHRcdGlmKHRoaXMuc2Nyb2xsSGVpZ2h0ID4gdGhpcy5vZmZzZXRIZWlnaHQpIHtcblx0XHRcdFx0XHRcdFx0aWYoby50b3AgKyB0LmhlaWdodCgpIC0gZS5wYWdlWSA8ICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfcHJveGltaXR5KVx0eyB2YWthdGFfZG5kLnNjcm9sbF90ID0gMTsgfVxuXHRcdFx0XHRcdFx0XHRpZihlLnBhZ2VZIC0gby50b3AgPCAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3Byb3hpbWl0eSlcdFx0XHRcdHsgdmFrYXRhX2RuZC5zY3JvbGxfdCA9IC0xOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih0aGlzLnNjcm9sbFdpZHRoID4gdGhpcy5vZmZzZXRXaWR0aCkge1xuXHRcdFx0XHRcdFx0XHRpZihvLmxlZnQgKyB0LndpZHRoKCkgLSBlLnBhZ2VYIDwgJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9wcm94aW1pdHkpXHR7IHZha2F0YV9kbmQuc2Nyb2xsX2wgPSAxOyB9XG5cdFx0XHRcdFx0XHRcdGlmKGUucGFnZVggLSBvLmxlZnQgPCAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3Byb3hpbWl0eSlcdFx0XHRcdHsgdmFrYXRhX2RuZC5zY3JvbGxfbCA9IC0xOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih2YWthdGFfZG5kLnNjcm9sbF90IHx8IHZha2F0YV9kbmQuc2Nyb2xsX2wpIHtcblx0XHRcdFx0XHRcdFx0dmFrYXRhX2RuZC5zY3JvbGxfZSA9ICQodGhpcyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZighdmFrYXRhX2RuZC5zY3JvbGxfZSkge1xuXHRcdFx0XHRcdGQgID0gJChkb2N1bWVudCk7IHcgPSAkKHdpbmRvdyk7XG5cdFx0XHRcdFx0ZGggPSBkLmhlaWdodCgpOyB3aCA9IHcuaGVpZ2h0KCk7XG5cdFx0XHRcdFx0ZHcgPSBkLndpZHRoKCk7IHd3ID0gdy53aWR0aCgpO1xuXHRcdFx0XHRcdGR0ID0gZC5zY3JvbGxUb3AoKTsgZGwgPSBkLnNjcm9sbExlZnQoKTtcblx0XHRcdFx0XHRpZihkaCA+IHdoICYmIGUucGFnZVkgLSBkdCA8ICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfcHJveGltaXR5KVx0XHR7IHZha2F0YV9kbmQuc2Nyb2xsX3QgPSAtMTsgIH1cblx0XHRcdFx0XHRpZihkaCA+IHdoICYmIHdoIC0gKGUucGFnZVkgLSBkdCkgPCAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3Byb3hpbWl0eSlcdHsgdmFrYXRhX2RuZC5zY3JvbGxfdCA9IDE7IH1cblx0XHRcdFx0XHRpZihkdyA+IHd3ICYmIGUucGFnZVggLSBkbCA8ICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfcHJveGltaXR5KVx0XHR7IHZha2F0YV9kbmQuc2Nyb2xsX2wgPSAtMTsgfVxuXHRcdFx0XHRcdGlmKGR3ID4gd3cgJiYgd3cgLSAoZS5wYWdlWCAtIGRsKSA8ICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfcHJveGltaXR5KVx0eyB2YWthdGFfZG5kLnNjcm9sbF9sID0gMTsgfVxuXHRcdFx0XHRcdGlmKHZha2F0YV9kbmQuc2Nyb2xsX3QgfHwgdmFrYXRhX2RuZC5zY3JvbGxfbCkge1xuXHRcdFx0XHRcdFx0dmFrYXRhX2RuZC5zY3JvbGxfZSA9IGQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHZha2F0YV9kbmQuc2Nyb2xsX2UpIHsgJC52YWthdGEuZG5kLl9zY3JvbGwodHJ1ZSk7IH1cblxuXHRcdFx0XHRpZih2YWthdGFfZG5kLmhlbHBlcikge1xuXHRcdFx0XHRcdGh0ID0gcGFyc2VJbnQoZS5wYWdlWSArICQudmFrYXRhLmRuZC5zZXR0aW5ncy5oZWxwZXJfdG9wLCAxMCk7XG5cdFx0XHRcdFx0aGwgPSBwYXJzZUludChlLnBhZ2VYICsgJC52YWthdGEuZG5kLnNldHRpbmdzLmhlbHBlcl9sZWZ0LCAxMCk7XG5cdFx0XHRcdFx0aWYoZGggJiYgaHQgKyAyNSA+IGRoKSB7IGh0ID0gZGggLSA1MDsgfVxuXHRcdFx0XHRcdGlmKGR3ICYmIGhsICsgdmFrYXRhX2RuZC5oZWxwZXJfdyA+IGR3KSB7IGhsID0gZHcgLSAodmFrYXRhX2RuZC5oZWxwZXJfdyArIDIpOyB9XG5cdFx0XHRcdFx0dmFrYXRhX2RuZC5oZWxwZXIuY3NzKHtcblx0XHRcdFx0XHRcdGxlZnRcdDogaGwgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHR0b3BcdFx0OiBodCArIFwicHhcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgb24gdGhlIGRvY3VtZW50IHdoZW4gYSBkcmFnIGlzIGluIHByb2dyZXNzXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdFx0XHQgKiBAbmFtZSBkbmRfbW92ZS52YWthdGFcblx0XHRcdFx0ICogQHBhcmFtIHtNaXhlZH0gZGF0YSBhbnkgZGF0YSBzdXBwbGllZCB3aXRoIHRoZSBjYWxsIHRvICQudmFrYXRhLmRuZC5zdGFydFxuXHRcdFx0XHQgKiBAcGFyYW0ge0RPTX0gZWxlbWVudCB0aGUgRE9NIGVsZW1lbnQgYmVpbmcgZHJhZ2dlZFxuXHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gaGVscGVyIHRoZSBoZWxwZXIgc2hvd24gbmV4dCB0byB0aGUgbW91c2Vcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBldmVudCB0aGF0IGNhdXNlZCB0aGlzIHRvIHRyaWdnZXIgKG1vc3QgbGlrZWx5IG1vdXNlbW92ZSlcblx0XHRcdFx0ICovXG5cdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcihcIm1vdmVcIiwgZSk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRzdG9wIDogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYoZS50eXBlID09PSBcInRvdWNoZW5kXCIgJiYgZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcyAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0pIHtcblx0XHRcdFx0XHRlLnBhZ2VYID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuXHRcdFx0XHRcdGUucGFnZVkgPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVk7XG5cdFx0XHRcdFx0ZS50YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93LnBhZ2VZT2Zmc2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZih2YWthdGFfZG5kLmlzX2RyYWcpIHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgb24gdGhlIGRvY3VtZW50IHdoZW4gYSBkcmFnIHN0b3BzICh0aGUgZHJhZ2dlZCBlbGVtZW50IGlzIGRyb3BwZWQpXG5cdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0ICogQHBsdWdpbiBkbmRcblx0XHRcdFx0XHQgKiBAbmFtZSBkbmRfc3RvcC52YWthdGFcblx0XHRcdFx0XHQgKiBAcGFyYW0ge01peGVkfSBkYXRhIGFueSBkYXRhIHN1cHBsaWVkIHdpdGggdGhlIGNhbGwgdG8gJC52YWthdGEuZG5kLnN0YXJ0XG5cdFx0XHRcdFx0ICogQHBhcmFtIHtET019IGVsZW1lbnQgdGhlIERPTSBlbGVtZW50IGJlaW5nIGRyYWdnZWRcblx0XHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gaGVscGVyIHRoZSBoZWxwZXIgc2hvd24gbmV4dCB0byB0aGUgbW91c2Vcblx0XHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIGV2ZW50IHRoYXQgY2F1c2VkIHRoZSBzdG9wXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aWYgKGUudGFyZ2V0ICE9PSB2YWthdGFfZG5kLnRhcmdldCkge1xuXHRcdFx0XHRcdFx0JCh2YWthdGFfZG5kLnRhcmdldCkub2ZmKCdjbGljay52YWthdGEnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKFwic3RvcFwiLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpZihlLnR5cGUgPT09IFwidG91Y2hlbmRcIiAmJiBlLnRhcmdldCA9PT0gdmFrYXRhX2RuZC50YXJnZXQpIHtcblx0XHRcdFx0XHRcdHZhciB0byA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyAkKGUudGFyZ2V0KS5jbGljaygpOyB9LCAxMDApO1xuXHRcdFx0XHRcdFx0JChlLnRhcmdldCkub25lKCdjbGljaycsIGZ1bmN0aW9uKCkgeyBpZih0bykgeyBjbGVhclRpbWVvdXQodG8pOyB9IH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQkLnZha2F0YS5kbmQuX2NsZWFuKCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KCQpKTtcblxuXHQvLyBpbmNsdWRlIHRoZSBkbmQgcGx1Z2luIGJ5IGRlZmF1bHRcblx0Ly8gJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2lucy5wdXNoKFwiZG5kXCIpO1xuXG5cbi8qKlxuICogIyMjIE1hc3Nsb2FkIHBsdWdpblxuICpcbiAqIEFkZHMgbWFzc2xvYWQgZnVuY3Rpb25hbGl0eSB0byBqc1RyZWUsIHNvIHRoYXQgbXVsdGlwbGUgbm9kZXMgY2FuIGJlIGxvYWRlZCBpbiBhIHNpbmdsZSByZXF1ZXN0IChvbmx5IHVzZWZ1bCB3aXRoIGxhenkgbG9hZGluZykuXG4gKi9cblxuXHQvKipcblx0ICogbWFzc2xvYWQgY29uZmlndXJhdGlvblxuXHQgKlxuXHQgKiBJdCBpcyBwb3NzaWJsZSB0byBzZXQgdGhpcyB0byBhIHN0YW5kYXJkIGpRdWVyeS1saWtlIEFKQVggY29uZmlnLlxuXHQgKiBJbiBhZGRpdGlvbiB0byB0aGUgc3RhbmRhcmQgalF1ZXJ5IGFqYXggb3B0aW9ucyBoZXJlIHlvdSBjYW4gc3VwcGx5IGZ1bmN0aW9ucyBmb3IgYGRhdGFgIGFuZCBgdXJsYCwgdGhlIGZ1bmN0aW9ucyB3aWxsIGJlIHJ1biBpbiB0aGUgY3VycmVudCBpbnN0YW5jZSdzIHNjb3BlIGFuZCBhIHBhcmFtIHdpbGwgYmUgcGFzc2VkIGluZGljYXRpbmcgd2hpY2ggbm9kZSBJRHMgbmVlZCB0byBiZSBsb2FkZWQsIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhvc2UgZnVuY3Rpb25zIHdpbGwgYmUgdXNlZC5cblx0ICpcblx0ICogWW91IGNhbiBhbHNvIHNldCB0aGlzIHRvIGEgZnVuY3Rpb24sIHRoYXQgZnVuY3Rpb24gd2lsbCByZWNlaXZlIHRoZSBub2RlIElEcyBiZWluZyBsb2FkZWQgYXMgYXJndW1lbnQgYW5kIGEgc2Vjb25kIHBhcmFtIHdoaWNoIGlzIGEgZnVuY3Rpb24gKGNhbGxiYWNrKSB3aGljaCBzaG91bGQgYmUgY2FsbGVkIHdpdGggdGhlIHJlc3VsdC5cblx0ICpcblx0ICogQm90aCB0aGUgQUpBWCBhbmQgdGhlIGZ1bmN0aW9uIGFwcHJvYWNoIHJlbHkgb24gdGhlIHNhbWUgcmV0dXJuIHZhbHVlIC0gYW4gb2JqZWN0IHdoZXJlIHRoZSBrZXlzIGFyZSB0aGUgbm9kZSBJRHMsIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGNoaWxkcmVuIG9mIHRoYXQgbm9kZSBhcyBhbiBhcnJheS5cblx0ICpcblx0ICpcdHtcblx0ICpcdFx0XCJpZDFcIiA6IFt7IFwidGV4dFwiIDogXCJDaGlsZCBvZiBJRDFcIiwgXCJpZFwiIDogXCJjMVwiIH0sIHsgXCJ0ZXh0XCIgOiBcIkFub3RoZXIgY2hpbGQgb2YgSUQxXCIsIFwiaWRcIiA6IFwiYzJcIiB9XSxcblx0ICpcdFx0XCJpZDJcIiA6IFt7IFwidGV4dFwiIDogXCJDaGlsZCBvZiBJRDJcIiwgXCJpZFwiIDogXCJjM1wiIH1dXG5cdCAqXHR9XG5cdCAqIFxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5tYXNzbG9hZFxuXHQgKiBAcGx1Z2luIG1hc3Nsb2FkXG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy5tYXNzbG9hZCA9IG51bGw7XG5cdCQuanN0cmVlLnBsdWdpbnMubWFzc2xvYWQgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5pbml0ID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG5cdFx0XHR0aGlzLl9kYXRhLm1hc3Nsb2FkID0ge307XG5cdFx0XHRwYXJlbnQuaW5pdC5jYWxsKHRoaXMsIGVsLCBvcHRpb25zKTtcblx0XHR9O1xuXHRcdHRoaXMuX2xvYWRfbm9kZXMgPSBmdW5jdGlvbiAobm9kZXMsIGNhbGxiYWNrLCBpc19jYWxsYmFjaywgZm9yY2VfcmVsb2FkKSB7XG5cdFx0XHR2YXIgcyA9IHRoaXMuc2V0dGluZ3MubWFzc2xvYWQsXG5cdFx0XHRcdG5vZGVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobm9kZXMpLFxuXHRcdFx0XHR0b0xvYWQgPSBbXSxcblx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdGksIGosIGRvbTtcblx0XHRcdGlmICghaXNfY2FsbGJhY2spIHtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gbm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYoIW1bbm9kZXNbaV1dIHx8ICggKCFtW25vZGVzW2ldXS5zdGF0ZS5sb2FkZWQgJiYgIW1bbm9kZXNbaV1dLnN0YXRlLmZhaWxlZCkgfHwgZm9yY2VfcmVsb2FkKSApIHtcblx0XHRcdFx0XHRcdHRvTG9hZC5wdXNoKG5vZGVzW2ldKTtcblx0XHRcdFx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUobm9kZXNbaV0sIHRydWUpO1xuXHRcdFx0XHRcdFx0aWYgKGRvbSAmJiBkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdGRvbS5hZGRDbGFzcyhcImpzdHJlZS1sb2FkaW5nXCIpLmF0dHIoJ2FyaWEtYnVzeScsdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2RhdGEubWFzc2xvYWQgPSB7fTtcblx0XHRcdFx0aWYgKHRvTG9hZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRpZigkLmlzRnVuY3Rpb24ocykpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzLmNhbGwodGhpcywgdG9Mb2FkLCAkLnByb3h5KGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBpLCBqO1xuXHRcdFx0XHRcdFx0XHRpZihkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGkgaW4gZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoZGF0YS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLm1hc3Nsb2FkW2ldID0gZGF0YVtpXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gbm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShub2Rlc1tpXSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRvbSAmJiBkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtbG9hZGluZ1wiKS5hdHRyKCdhcmlhLWJ1c3knLGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cGFyZW50Ll9sb2FkX25vZGVzLmNhbGwodGhpcywgbm9kZXMsIGNhbGxiYWNrLCBpc19jYWxsYmFjaywgZm9yY2VfcmVsb2FkKTtcblx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodHlwZW9mIHMgPT09ICdvYmplY3QnICYmIHMgJiYgcy51cmwpIHtcblx0XHRcdFx0XHRcdHMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgcyk7XG5cdFx0XHRcdFx0XHRpZigkLmlzRnVuY3Rpb24ocy51cmwpKSB7XG5cdFx0XHRcdFx0XHRcdHMudXJsID0gcy51cmwuY2FsbCh0aGlzLCB0b0xvYWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoJC5pc0Z1bmN0aW9uKHMuZGF0YSkpIHtcblx0XHRcdFx0XHRcdFx0cy5kYXRhID0gcy5kYXRhLmNhbGwodGhpcywgdG9Mb2FkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiAkLmFqYXgocylcblx0XHRcdFx0XHRcdFx0LmRvbmUoJC5wcm94eShmdW5jdGlvbiAoZGF0YSx0LHgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBpLCBqO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSBpbiBkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoZGF0YS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5tYXNzbG9hZFtpXSA9IGRhdGFbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBub2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShub2Rlc1tpXSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChkb20gJiYgZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRvbS5yZW1vdmVDbGFzcyhcImpzdHJlZS1sb2FkaW5nXCIpLmF0dHIoJ2FyaWEtYnVzeScsZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRwYXJlbnQuX2xvYWRfbm9kZXMuY2FsbCh0aGlzLCBub2RlcywgY2FsbGJhY2ssIGlzX2NhbGxiYWNrLCBmb3JjZV9yZWxvYWQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHRcdFx0XHQuZmFpbCgkLnByb3h5KGZ1bmN0aW9uIChmKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwYXJlbnQuX2xvYWRfbm9kZXMuY2FsbCh0aGlzLCBub2RlcywgY2FsbGJhY2ssIGlzX2NhbGxiYWNrLCBmb3JjZV9yZWxvYWQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBwYXJlbnQuX2xvYWRfbm9kZXMuY2FsbCh0aGlzLCBub2RlcywgY2FsbGJhY2ssIGlzX2NhbGxiYWNrLCBmb3JjZV9yZWxvYWQpO1xuXHRcdH07XG5cdFx0dGhpcy5fbG9hZF9ub2RlID0gZnVuY3Rpb24gKG9iaiwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBkYXRhID0gdGhpcy5fZGF0YS5tYXNzbG9hZFtvYmouaWRdLFxuXHRcdFx0XHRyc2x0ID0gbnVsbCwgZG9tO1xuXHRcdFx0aWYoZGF0YSkge1xuXHRcdFx0XHRyc2x0ID0gdGhpc1t0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgPyAnX2FwcGVuZF9odG1sX2RhdGEnIDogJ19hcHBlbmRfanNvbl9kYXRhJ10oXG5cdFx0XHRcdFx0b2JqLFxuXHRcdFx0XHRcdHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyA/ICQoJC5wYXJzZUhUTUwoZGF0YSkpLmZpbHRlcihmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLm5vZGVUeXBlICE9PSAzOyB9KSA6IGRhdGEsXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKHN0YXR1cykgeyBjYWxsYmFjay5jYWxsKHRoaXMsIHN0YXR1cyk7IH1cblx0XHRcdFx0KTtcblx0XHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmouaWQsIHRydWUpO1xuXHRcdFx0XHRpZiAoZG9tICYmIGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtbG9hZGluZ1wiKS5hdHRyKCdhcmlhLWJ1c3knLGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWxldGUgdGhpcy5fZGF0YS5tYXNzbG9hZFtvYmouaWRdO1xuXHRcdFx0XHRyZXR1cm4gcnNsdDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwYXJlbnQuX2xvYWRfbm9kZS5jYWxsKHRoaXMsIG9iaiwgY2FsbGJhY2spO1xuXHRcdH07XG5cdH07XG5cbi8qKlxuICogIyMjIFNlYXJjaCBwbHVnaW5cbiAqXG4gKiBBZGRzIHNlYXJjaCBmdW5jdGlvbmFsaXR5IHRvIGpzVHJlZS5cbiAqL1xuXG5cdC8qKlxuXHQgKiBzdG9yZXMgYWxsIGRlZmF1bHRzIGZvciB0aGUgc2VhcmNoIHBsdWdpblxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2hcblx0ICogQHBsdWdpbiBzZWFyY2hcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaCA9IHtcblx0XHQvKipcblx0XHQgKiBhIGpRdWVyeS1saWtlIEFKQVggY29uZmlnLCB3aGljaCBqc3RyZWUgdXNlcyBpZiBhIHNlcnZlciBzaG91bGQgYmUgcXVlcmllZCBmb3IgcmVzdWx0cy5cblx0XHQgKlxuXHRcdCAqIEEgYHN0cmAgKHdoaWNoIGlzIHRoZSBzZWFyY2ggc3RyaW5nKSBwYXJhbWV0ZXIgd2lsbCBiZSBhZGRlZCB3aXRoIHRoZSByZXF1ZXN0LCBhbiBvcHRpb25hbCBgaW5zaWRlYCBwYXJhbWV0ZXIgd2lsbCBiZSBhZGRlZCBpZiB0aGUgc2VhcmNoIGlzIGxpbWl0ZWQgdG8gYSBub2RlIGlkLiBUaGUgZXhwZWN0ZWQgcmVzdWx0IGlzIGEgSlNPTiBhcnJheSB3aXRoIG5vZGVzIHRoYXQgbmVlZCB0byBiZSBvcGVuZWQgc28gdGhhdCBtYXRjaGluZyBub2RlcyB3aWxsIGJlIHJldmVhbGVkLlxuXHRcdCAqIExlYXZlIHRoaXMgc2V0dGluZyBhcyBgZmFsc2VgIHRvIG5vdCBxdWVyeSB0aGUgc2VydmVyLiBZb3UgY2FuIGFsc28gc2V0IHRoaXMgdG8gYSBmdW5jdGlvbiwgd2hpY2ggd2lsbCBiZSBpbnZva2VkIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlIGFuZCByZWNlaXZlIDMgcGFyYW1ldGVycyAtIHRoZSBzZWFyY2ggc3RyaW5nLCB0aGUgY2FsbGJhY2sgdG8gY2FsbCB3aXRoIHRoZSBhcnJheSBvZiBub2RlcyB0byBsb2FkLCBhbmQgdGhlIG9wdGlvbmFsIG5vZGUgSUQgdG8gbGltaXQgdGhlIHNlYXJjaCB0b1xuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaC5hamF4XG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKi9cblx0XHRhamF4IDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIHRoZSBzZWFyY2ggc2hvdWxkIGJlIGZ1enp5IG9yIG5vdCAoc2hvdWxkIGBjaG5kM2AgbWF0Y2ggYGNoaWxkIG5vZGUgM2ApLiBEZWZhdWx0IGlzIGBmYWxzZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoLmZ1enp5XG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKi9cblx0XHRmdXp6eSA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIEluZGljYXRlcyBpZiB0aGUgc2VhcmNoIHNob3VsZCBiZSBjYXNlIHNlbnNpdGl2ZS4gRGVmYXVsdCBpcyBgZmFsc2VgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaC5jYXNlX3NlbnNpdGl2ZVxuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICovXG5cdFx0Y2FzZV9zZW5zaXRpdmUgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgdGhlIHRyZWUgc2hvdWxkIGJlIGZpbHRlcmVkIChieSBkZWZhdWx0KSB0byBzaG93IG9ubHkgbWF0Y2hpbmcgbm9kZXMgKGtlZXAgaW4gbWluZCB0aGlzIGNhbiBiZSBhIGhlYXZ5IG9uIGxhcmdlIHRyZWVzIGluIG9sZCBicm93c2VycykuXG5cdFx0ICogVGhpcyBzZXR0aW5nIGNhbiBiZSBjaGFuZ2VkIGF0IHJ1bnRpbWUgd2hlbiBjYWxsaW5nIHRoZSBzZWFyY2ggbWV0aG9kLiBEZWZhdWx0IGlzIGBmYWxzZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoLnNob3dfb25seV9tYXRjaGVzXG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKi9cblx0XHRzaG93X29ubHlfbWF0Y2hlcyA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIEluZGljYXRlcyBpZiB0aGUgY2hpbGRyZW4gb2YgbWF0Y2hlZCBlbGVtZW50IGFyZSBzaG93biAod2hlbiBzaG93X29ubHlfbWF0Y2hlcyBpcyB0cnVlKVxuXHRcdCAqIFRoaXMgc2V0dGluZyBjYW4gYmUgY2hhbmdlZCBhdCBydW50aW1lIHdoZW4gY2FsbGluZyB0aGUgc2VhcmNoIG1ldGhvZC4gRGVmYXVsdCBpcyBgZmFsc2VgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaC5zaG93X29ubHlfbWF0Y2hlc19jaGlsZHJlblxuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICovXG5cdFx0c2hvd19vbmx5X21hdGNoZXNfY2hpbGRyZW4gOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgYWxsIG5vZGVzIG9wZW5lZCB0byByZXZlYWwgdGhlIHNlYXJjaCByZXN1bHQsIHNob3VsZCBiZSBjbG9zZWQgd2hlbiB0aGUgc2VhcmNoIGlzIGNsZWFyZWQgb3IgYSBuZXcgc2VhcmNoIGlzIHBlcmZvcm1lZC4gRGVmYXVsdCBpcyBgdHJ1ZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoLmNsb3NlX29wZW5lZF9vbmNsZWFyXG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKi9cblx0XHRjbG9zZV9vcGVuZWRfb25jbGVhciA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIG9ubHkgbGVhZiBub2RlcyBzaG91bGQgYmUgaW5jbHVkZWQgaW4gc2VhcmNoIHJlc3VsdHMuIERlZmF1bHQgaXMgYGZhbHNlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2guc2VhcmNoX2xlYXZlc19vbmx5XG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKi9cblx0XHRzZWFyY2hfbGVhdmVzX29ubHkgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBJZiBzZXQgdG8gYSBmdW5jdGlvbiBpdCB3aWwgYmUgY2FsbGVkIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlIHdpdGggdHdvIGFyZ3VtZW50cyAtIHNlYXJjaCBzdHJpbmcgYW5kIG5vZGUgKHdoZXJlIG5vZGUgd2lsbCBiZSBldmVyeSBub2RlIGluIHRoZSBzdHJ1Y3R1cmUsIHNvIHVzZSB3aXRoIGNhdXRpb24pLlxuXHRcdCAqIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlIHRoZSBub2RlIHdpbGwgYmUgY29uc2lkZXJlZCBhIG1hdGNoIChpdCBtaWdodCBub3QgYmUgZGlzcGxheWVkIGlmIHNlYXJjaF9vbmx5X2xlYXZlcyBpcyBzZXQgdG8gdHJ1ZSBhbmQgdGhlIG5vZGUgaXMgbm90IGEgbGVhZikuIERlZmF1bHQgaXMgYGZhbHNlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2guc2VhcmNoX2NhbGxiYWNrXG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKi9cblx0XHRzZWFyY2hfY2FsbGJhY2sgOiBmYWxzZVxuXHR9O1xuXG5cdCQuanN0cmVlLnBsdWdpbnMuc2VhcmNoID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuYmluZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHBhcmVudC5iaW5kLmNhbGwodGhpcyk7XG5cblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnN0ciA9IFwiXCI7XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5kb20gPSAkKCk7XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5yZXMgPSBbXTtcblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLm9wbiA9IFtdO1xuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guc29tID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5zbWMgPSBmYWxzZTtcblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmhkbiA9IFtdO1xuXG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0Lm9uKFwic2VhcmNoLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLnNlYXJjaC5zb20gJiYgZGF0YS5yZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtID0gdGhpcy5fbW9kZWwuZGF0YSwgaSwgaiwgcCA9IFtdLCBrLCBsO1xuXHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkYXRhLnJlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZihtW2RhdGEucmVzW2ldXSAmJiAhbVtkYXRhLnJlc1tpXV0uc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwLnB1c2goZGF0YS5yZXNbaV0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0cCA9IHAuY29uY2F0KG1bZGF0YS5yZXNbaV1dLnBhcmVudHMpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5zZWFyY2guc21jKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAoayA9IDAsIGwgPSBtW2RhdGEucmVzW2ldXS5jaGlsZHJlbl9kLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChtW21bZGF0YS5yZXNbaV1dLmNoaWxkcmVuX2Rba11dICYmICFtW21bZGF0YS5yZXNbaV1dLmNoaWxkcmVuX2Rba11dLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cC5wdXNoKG1bZGF0YS5yZXNbaV1dLmNoaWxkcmVuX2Rba10pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwID0gJC52YWthdGEuYXJyYXlfcmVtb3ZlX2l0ZW0oJC52YWthdGEuYXJyYXlfdW5pcXVlKHApLCAkLmpzdHJlZS5yb290KTtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guaGRuID0gdGhpcy5oaWRlX2FsbCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5zaG93X25vZGUocCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMucmVkcmF3KHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJjbGVhcl9zZWFyY2guanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuc2VhcmNoLnNvbSAmJiBkYXRhLnJlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5zaG93X25vZGUodGhpcy5fZGF0YS5zZWFyY2guaGRuLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5yZWRyYXcodHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogdXNlZCB0byBzZWFyY2ggdGhlIHRyZWUgbm9kZXMgZm9yIGEgZ2l2ZW4gc3RyaW5nXG5cdFx0ICogQG5hbWUgc2VhcmNoKHN0ciBbLCBza2lwX2FzeW5jXSlcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyIHRoZSBzZWFyY2ggc3RyaW5nXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBza2lwX2FzeW5jIGlmIHNldCB0byB0cnVlIHNlcnZlciB3aWxsIG5vdCBiZSBxdWVyaWVkIGV2ZW4gaWYgY29uZmlndXJlZFxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc2hvd19vbmx5X21hdGNoZXMgaWYgc2V0IHRvIHRydWUgb25seSBtYXRjaGluZyBub2RlcyB3aWxsIGJlIHNob3duIChrZWVwIGluIG1pbmQgdGhpcyBjYW4gYmUgdmVyeSBzbG93IG9uIGxhcmdlIHRyZWVzIG9yIG9sZCBicm93c2Vycylcblx0XHQgKiBAcGFyYW0ge21peGVkfSBpbnNpZGUgYW4gb3B0aW9uYWwgbm9kZSB0byB3aG9zZSBjaGlsZHJlbiB0byBsaW1pdCB0aGUgc2VhcmNoXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBhcHBlbmQgaWYgc2V0IHRvIHRydWUgdGhlIHJlc3VsdHMgb2YgdGhpcyBzZWFyY2ggYXJlIGFwcGVuZGVkIHRvIHRoZSBwcmV2aW91cyBzZWFyY2hcblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqIEB0cmlnZ2VyIHNlYXJjaC5qc3RyZWVcblx0XHQgKi9cblx0XHR0aGlzLnNlYXJjaCA9IGZ1bmN0aW9uIChzdHIsIHNraXBfYXN5bmMsIHNob3dfb25seV9tYXRjaGVzLCBpbnNpZGUsIGFwcGVuZCwgc2hvd19vbmx5X21hdGNoZXNfY2hpbGRyZW4pIHtcblx0XHRcdGlmKHN0ciA9PT0gZmFsc2UgfHwgJC50cmltKHN0ci50b1N0cmluZygpKSA9PT0gXCJcIikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jbGVhcl9zZWFyY2goKTtcblx0XHRcdH1cblx0XHRcdGluc2lkZSA9IHRoaXMuZ2V0X25vZGUoaW5zaWRlKTtcblx0XHRcdGluc2lkZSA9IGluc2lkZSAmJiBpbnNpZGUuaWQgPyBpbnNpZGUuaWQgOiBudWxsO1xuXHRcdFx0c3RyID0gc3RyLnRvU3RyaW5nKCk7XG5cdFx0XHR2YXIgcyA9IHRoaXMuc2V0dGluZ3Muc2VhcmNoLFxuXHRcdFx0XHRhID0gcy5hamF4ID8gcy5hamF4IDogZmFsc2UsXG5cdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRmID0gbnVsbCxcblx0XHRcdFx0ciA9IFtdLFxuXHRcdFx0XHRwID0gW10sIGksIGo7XG5cdFx0XHRpZih0aGlzLl9kYXRhLnNlYXJjaC5yZXMubGVuZ3RoICYmICFhcHBlbmQpIHtcblx0XHRcdFx0dGhpcy5jbGVhcl9zZWFyY2goKTtcblx0XHRcdH1cblx0XHRcdGlmKHNob3dfb25seV9tYXRjaGVzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0c2hvd19vbmx5X21hdGNoZXMgPSBzLnNob3dfb25seV9tYXRjaGVzO1xuXHRcdFx0fVxuXHRcdFx0aWYoc2hvd19vbmx5X21hdGNoZXNfY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRzaG93X29ubHlfbWF0Y2hlc19jaGlsZHJlbiA9IHMuc2hvd19vbmx5X21hdGNoZXNfY2hpbGRyZW47XG5cdFx0XHR9XG5cdFx0XHRpZighc2tpcF9hc3luYyAmJiBhICE9PSBmYWxzZSkge1xuXHRcdFx0XHRpZigkLmlzRnVuY3Rpb24oYSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gYS5jYWxsKHRoaXMsIHN0ciwgJC5wcm94eShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuZCkgeyBkID0gZC5kOyB9XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2xvYWRfbm9kZXMoISQuaXNBcnJheShkKSA/IFtdIDogJC52YWthdGEuYXJyYXlfdW5pcXVlKGQpLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zZWFyY2goc3RyLCB0cnVlLCBzaG93X29ubHlfbWF0Y2hlcywgaW5zaWRlLCBhcHBlbmQsIHNob3dfb25seV9tYXRjaGVzX2NoaWxkcmVuKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSwgaW5zaWRlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRhID0gJC5leHRlbmQoe30sIGEpO1xuXHRcdFx0XHRcdGlmKCFhLmRhdGEpIHsgYS5kYXRhID0ge307IH1cblx0XHRcdFx0XHRhLmRhdGEuc3RyID0gc3RyO1xuXHRcdFx0XHRcdGlmKGluc2lkZSkge1xuXHRcdFx0XHRcdFx0YS5kYXRhLmluc2lkZSA9IGluc2lkZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2RhdGEuc2VhcmNoLmxhc3RSZXF1ZXN0KSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5sYXN0UmVxdWVzdC5hYm9ydCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5sYXN0UmVxdWVzdCA9ICQuYWpheChhKVxuXHRcdFx0XHRcdFx0LmZhaWwoJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2FqYXgnLCAncGx1Z2luJyA6ICdzZWFyY2gnLCAnaWQnIDogJ3NlYXJjaF8wMScsICdyZWFzb24nIDogJ0NvdWxkIG5vdCBsb2FkIHNlYXJjaCBwYXJlbnRzJywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoYSkgfTtcblx0XHRcdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdFx0XHQuZG9uZSgkLnByb3h5KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5kKSB7IGQgPSBkLmQ7IH1cblx0XHRcdFx0XHRcdFx0dGhpcy5fbG9hZF9ub2RlcyghJC5pc0FycmF5KGQpID8gW10gOiAkLnZha2F0YS5hcnJheV91bmlxdWUoZCksIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNlYXJjaChzdHIsIHRydWUsIHNob3dfb25seV9tYXRjaGVzLCBpbnNpZGUsIGFwcGVuZCwgc2hvd19vbmx5X21hdGNoZXNfY2hpbGRyZW4pO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fZGF0YS5zZWFyY2gubGFzdFJlcXVlc3Q7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKCFhcHBlbmQpIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guc3RyID0gc3RyO1xuXHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5kb20gPSAkKCk7XG5cdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnJlcyA9IFtdO1xuXHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5vcG4gPSBbXTtcblx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guc29tID0gc2hvd19vbmx5X21hdGNoZXM7XG5cdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnNtYyA9IHNob3dfb25seV9tYXRjaGVzX2NoaWxkcmVuO1xuXHRcdFx0fVxuXG5cdFx0XHRmID0gbmV3ICQudmFrYXRhLnNlYXJjaChzdHIsIHRydWUsIHsgY2FzZVNlbnNpdGl2ZSA6IHMuY2FzZV9zZW5zaXRpdmUsIGZ1enp5IDogcy5mdXp6eSB9KTtcblx0XHRcdCQuZWFjaChtW2luc2lkZSA/IGluc2lkZSA6ICQuanN0cmVlLnJvb3RdLmNoaWxkcmVuX2QsIGZ1bmN0aW9uIChpaSwgaSkge1xuXHRcdFx0XHR2YXIgdiA9IG1baV07XG5cdFx0XHRcdGlmKHYudGV4dCAmJiAhdi5zdGF0ZS5oaWRkZW4gJiYgKCFzLnNlYXJjaF9sZWF2ZXNfb25seSB8fCAodi5zdGF0ZS5sb2FkZWQgJiYgdi5jaGlsZHJlbi5sZW5ndGggPT09IDApKSAmJiAoIChzLnNlYXJjaF9jYWxsYmFjayAmJiBzLnNlYXJjaF9jYWxsYmFjay5jYWxsKHRoaXMsIHN0ciwgdikpIHx8ICghcy5zZWFyY2hfY2FsbGJhY2sgJiYgZi5zZWFyY2godi50ZXh0KS5pc01hdGNoKSApICkge1xuXHRcdFx0XHRcdHIucHVzaChpKTtcblx0XHRcdFx0XHRwID0gcC5jb25jYXQodi5wYXJlbnRzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZihyLmxlbmd0aCkge1xuXHRcdFx0XHRwID0gJC52YWthdGEuYXJyYXlfdW5pcXVlKHApO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKHBbaV0gIT09ICQuanN0cmVlLnJvb3QgJiYgbVtwW2ldXSAmJiB0aGlzLm9wZW5fbm9kZShwW2ldLCBudWxsLCAwKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gub3BuLnB1c2gocFtpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCFhcHBlbmQpIHtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5kb20gPSAkKHRoaXMuZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yQWxsKCcjJyArICQubWFwKHIsIGZ1bmN0aW9uICh2KSB7IHJldHVybiBcIjAxMjM0NTY3ODlcIi5pbmRleE9mKHZbMF0pICE9PSAtMSA/ICdcXFxcMycgKyB2WzBdICsgJyAnICsgdi5zdWJzdHIoMSkucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSA6IHYucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKTsgfSkuam9pbignLCAjJykpKTtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5yZXMgPSByO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmRvbSA9IHRoaXMuX2RhdGEuc2VhcmNoLmRvbS5hZGQoJCh0aGlzLmVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnIycgKyAkLm1hcChyLCBmdW5jdGlvbiAodikgeyByZXR1cm4gXCIwMTIzNDU2Nzg5XCIuaW5kZXhPZih2WzBdKSAhPT0gLTEgPyAnXFxcXDMnICsgdlswXSArICcgJyArIHYuc3Vic3RyKDEpLnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJykgOiB2LnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJyk7IH0pLmpvaW4oJywgIycpKSkpO1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnJlcyA9ICQudmFrYXRhLmFycmF5X3VuaXF1ZSh0aGlzLl9kYXRhLnNlYXJjaC5yZXMuY29uY2F0KHIpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5kb20uY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5hZGRDbGFzcygnanN0cmVlLXNlYXJjaCcpO1xuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgYWZ0ZXIgc2VhcmNoIGlzIGNvbXBsZXRlXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNlYXJjaC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBub2RlcyBhIGpRdWVyeSBjb2xsZWN0aW9uIG9mIG1hdGNoaW5nIG5vZGVzXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyIHRoZSBzZWFyY2ggc3RyaW5nXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSByZXMgYSBjb2xsZWN0aW9uIG9mIG9iamVjdHMgcmVwcmVzZWluZyB0aGUgbWF0Y2hpbmcgbm9kZXNcblx0XHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2VhcmNoJywgeyBub2RlcyA6IHRoaXMuX2RhdGEuc2VhcmNoLmRvbSwgc3RyIDogc3RyLCByZXMgOiB0aGlzLl9kYXRhLnNlYXJjaC5yZXMsIHNob3dfb25seV9tYXRjaGVzIDogc2hvd19vbmx5X21hdGNoZXMgfSk7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiB1c2VkIHRvIGNsZWFyIHRoZSBsYXN0IHNlYXJjaCAocmVtb3ZlcyBjbGFzc2VzIGFuZCBzaG93cyBhbGwgbm9kZXMgaWYgZmlsdGVyaW5nIGlzIG9uKVxuXHRcdCAqIEBuYW1lIGNsZWFyX3NlYXJjaCgpXG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKiBAdHJpZ2dlciBjbGVhcl9zZWFyY2guanN0cmVlXG5cdFx0ICovXG5cdFx0dGhpcy5jbGVhcl9zZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLnNlYXJjaC5jbG9zZV9vcGVuZWRfb25jbGVhcikge1xuXHRcdFx0XHR0aGlzLmNsb3NlX25vZGUodGhpcy5fZGF0YS5zZWFyY2gub3BuLCAwKTtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIGFmdGVyIHNlYXJjaCBpcyBjb21wbGV0ZVxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjbGVhcl9zZWFyY2guanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gbm9kZXMgYSBqUXVlcnkgY29sbGVjdGlvbiBvZiBtYXRjaGluZyBub2RlcyAodGhlIHJlc3VsdCBmcm9tIHRoZSBsYXN0IHNlYXJjaClcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgdGhlIHNlYXJjaCBzdHJpbmcgKHRoZSBsYXN0IHNlYXJjaCBzdHJpbmcpXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSByZXMgYSBjb2xsZWN0aW9uIG9mIG9iamVjdHMgcmVwcmVzZWluZyB0aGUgbWF0Y2hpbmcgbm9kZXMgKHRoZSByZXN1bHQgZnJvbSB0aGUgbGFzdCBzZWFyY2gpXG5cdFx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NsZWFyX3NlYXJjaCcsIHsgJ25vZGVzJyA6IHRoaXMuX2RhdGEuc2VhcmNoLmRvbSwgc3RyIDogdGhpcy5fZGF0YS5zZWFyY2guc3RyLCByZXMgOiB0aGlzLl9kYXRhLnNlYXJjaC5yZXMgfSk7XG5cdFx0XHRpZih0aGlzLl9kYXRhLnNlYXJjaC5yZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmRvbSA9ICQodGhpcy5lbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICsgJC5tYXAodGhpcy5fZGF0YS5zZWFyY2gucmVzLCBmdW5jdGlvbiAodikge1xuXHRcdFx0XHRcdHJldHVybiBcIjAxMjM0NTY3ODlcIi5pbmRleE9mKHZbMF0pICE9PSAtMSA/ICdcXFxcMycgKyB2WzBdICsgJyAnICsgdi5zdWJzdHIoMSkucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSA6IHYucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKTtcblx0XHRcdFx0fSkuam9pbignLCAjJykpKTtcblx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guZG9tLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtc2VhcmNoXCIpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guc3RyID0gXCJcIjtcblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnJlcyA9IFtdO1xuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gub3BuID0gW107XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5kb20gPSAkKCk7XG5cdFx0fTtcblxuXHRcdHRoaXMucmVkcmF3X25vZGUgPSBmdW5jdGlvbihvYmosIGRlZXAsIGNhbGxiYWNrLCBmb3JjZV9yZW5kZXIpIHtcblx0XHRcdG9iaiA9IHBhcmVudC5yZWRyYXdfbm9kZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0aWYob2JqKSB7XG5cdFx0XHRcdGlmKCQuaW5BcnJheShvYmouaWQsIHRoaXMuX2RhdGEuc2VhcmNoLnJlcykgIT09IC0xKSB7XG5cdFx0XHRcdFx0dmFyIGksIGosIHRtcCA9IG51bGw7XG5cdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZihvYmouY2hpbGROb2Rlc1tpXSAmJiBvYmouY2hpbGROb2Rlc1tpXS5jbGFzc05hbWUgJiYgb2JqLmNoaWxkTm9kZXNbaV0uY2xhc3NOYW1lLmluZGV4T2YoXCJqc3RyZWUtYW5jaG9yXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHR0bXAgPSBvYmouY2hpbGROb2Rlc1tpXTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHRtcCkge1xuXHRcdFx0XHRcdFx0dG1wLmNsYXNzTmFtZSArPSAnIGpzdHJlZS1zZWFyY2gnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9O1xuXHR9O1xuXG5cdC8vIGhlbHBlcnNcblx0KGZ1bmN0aW9uICgkKSB7XG5cdFx0Ly8gZnJvbSBodHRwOi8va2lyby5tZS9wcm9qZWN0cy9mdXNlLmh0bWxcblx0XHQkLnZha2F0YS5zZWFyY2ggPSBmdW5jdGlvbihwYXR0ZXJuLCB0eHQsIG9wdGlvbnMpIHtcblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdFx0b3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLnZha2F0YS5zZWFyY2guZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRcdFx0aWYob3B0aW9ucy5mdXp6eSAhPT0gZmFsc2UpIHtcblx0XHRcdFx0b3B0aW9ucy5mdXp6eSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRwYXR0ZXJuID0gb3B0aW9ucy5jYXNlU2Vuc2l0aXZlID8gcGF0dGVybiA6IHBhdHRlcm4udG9Mb3dlckNhc2UoKTtcblx0XHRcdHZhciBNQVRDSF9MT0NBVElPTlx0PSBvcHRpb25zLmxvY2F0aW9uLFxuXHRcdFx0XHRNQVRDSF9ESVNUQU5DRVx0PSBvcHRpb25zLmRpc3RhbmNlLFxuXHRcdFx0XHRNQVRDSF9USFJFU0hPTERcdD0gb3B0aW9ucy50aHJlc2hvbGQsXG5cdFx0XHRcdHBhdHRlcm5MZW4gPSBwYXR0ZXJuLmxlbmd0aCxcblx0XHRcdFx0bWF0Y2htYXNrLCBwYXR0ZXJuX2FscGhhYmV0LCBtYXRjaF9iaXRhcFNjb3JlLCBzZWFyY2g7XG5cdFx0XHRpZihwYXR0ZXJuTGVuID4gMzIpIHtcblx0XHRcdFx0b3B0aW9ucy5mdXp6eSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYob3B0aW9ucy5mdXp6eSkge1xuXHRcdFx0XHRtYXRjaG1hc2sgPSAxIDw8IChwYXR0ZXJuTGVuIC0gMSk7XG5cdFx0XHRcdHBhdHRlcm5fYWxwaGFiZXQgPSAoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBtYXNrID0ge30sXG5cdFx0XHRcdFx0XHRpID0gMDtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgcGF0dGVybkxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0XHRtYXNrW3BhdHRlcm4uY2hhckF0KGkpXSA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBwYXR0ZXJuTGVuOyBpKyspIHtcblx0XHRcdFx0XHRcdG1hc2tbcGF0dGVybi5jaGFyQXQoaSldIHw9IDEgPDwgKHBhdHRlcm5MZW4gLSBpIC0gMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBtYXNrO1xuXHRcdFx0XHR9KCkpO1xuXHRcdFx0XHRtYXRjaF9iaXRhcFNjb3JlID0gZnVuY3Rpb24gKGUsIHgpIHtcblx0XHRcdFx0XHR2YXIgYWNjdXJhY3kgPSBlIC8gcGF0dGVybkxlbixcblx0XHRcdFx0XHRcdHByb3hpbWl0eSA9IE1hdGguYWJzKE1BVENIX0xPQ0FUSU9OIC0geCk7XG5cdFx0XHRcdFx0aWYoIU1BVENIX0RJU1RBTkNFKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHJveGltaXR5ID8gMS4wIDogYWNjdXJhY3k7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBhY2N1cmFjeSArIChwcm94aW1pdHkgLyBNQVRDSF9ESVNUQU5DRSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRzZWFyY2ggPSBmdW5jdGlvbiAodGV4dCkge1xuXHRcdFx0XHR0ZXh0ID0gb3B0aW9ucy5jYXNlU2Vuc2l0aXZlID8gdGV4dCA6IHRleHQudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0aWYocGF0dGVybiA9PT0gdGV4dCB8fCB0ZXh0LmluZGV4T2YocGF0dGVybikgIT09IC0xKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdGlzTWF0Y2g6IHRydWUsXG5cdFx0XHRcdFx0XHRzY29yZTogMFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIW9wdGlvbnMuZnV6enkpIHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0aXNNYXRjaDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzY29yZTogMVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGksIGosXG5cdFx0XHRcdFx0dGV4dExlbiA9IHRleHQubGVuZ3RoLFxuXHRcdFx0XHRcdHNjb3JlVGhyZXNob2xkID0gTUFUQ0hfVEhSRVNIT0xELFxuXHRcdFx0XHRcdGJlc3RMb2MgPSB0ZXh0LmluZGV4T2YocGF0dGVybiwgTUFUQ0hfTE9DQVRJT04pLFxuXHRcdFx0XHRcdGJpbk1pbiwgYmluTWlkLFxuXHRcdFx0XHRcdGJpbk1heCA9IHBhdHRlcm5MZW4gKyB0ZXh0TGVuLFxuXHRcdFx0XHRcdGxhc3RSZCwgc3RhcnQsIGZpbmlzaCwgcmQsIGNoYXJNYXRjaCxcblx0XHRcdFx0XHRzY29yZSA9IDEsXG5cdFx0XHRcdFx0bG9jYXRpb25zID0gW107XG5cdFx0XHRcdGlmIChiZXN0TG9jICE9PSAtMSkge1xuXHRcdFx0XHRcdHNjb3JlVGhyZXNob2xkID0gTWF0aC5taW4obWF0Y2hfYml0YXBTY29yZSgwLCBiZXN0TG9jKSwgc2NvcmVUaHJlc2hvbGQpO1xuXHRcdFx0XHRcdGJlc3RMb2MgPSB0ZXh0Lmxhc3RJbmRleE9mKHBhdHRlcm4sIE1BVENIX0xPQ0FUSU9OICsgcGF0dGVybkxlbik7XG5cdFx0XHRcdFx0aWYgKGJlc3RMb2MgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRzY29yZVRocmVzaG9sZCA9IE1hdGgubWluKG1hdGNoX2JpdGFwU2NvcmUoMCwgYmVzdExvYyksIHNjb3JlVGhyZXNob2xkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0YmVzdExvYyA9IC0xO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgcGF0dGVybkxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0YmluTWluID0gMDtcblx0XHRcdFx0XHRiaW5NaWQgPSBiaW5NYXg7XG5cdFx0XHRcdFx0d2hpbGUgKGJpbk1pbiA8IGJpbk1pZCkge1xuXHRcdFx0XHRcdFx0aWYgKG1hdGNoX2JpdGFwU2NvcmUoaSwgTUFUQ0hfTE9DQVRJT04gKyBiaW5NaWQpIDw9IHNjb3JlVGhyZXNob2xkKSB7XG5cdFx0XHRcdFx0XHRcdGJpbk1pbiA9IGJpbk1pZDtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGJpbk1heCA9IGJpbk1pZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJpbk1pZCA9IE1hdGguZmxvb3IoKGJpbk1heCAtIGJpbk1pbikgLyAyICsgYmluTWluKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YmluTWF4ID0gYmluTWlkO1xuXHRcdFx0XHRcdHN0YXJ0ID0gTWF0aC5tYXgoMSwgTUFUQ0hfTE9DQVRJT04gLSBiaW5NaWQgKyAxKTtcblx0XHRcdFx0XHRmaW5pc2ggPSBNYXRoLm1pbihNQVRDSF9MT0NBVElPTiArIGJpbk1pZCwgdGV4dExlbikgKyBwYXR0ZXJuTGVuO1xuXHRcdFx0XHRcdHJkID0gbmV3IEFycmF5KGZpbmlzaCArIDIpO1xuXHRcdFx0XHRcdHJkW2ZpbmlzaCArIDFdID0gKDEgPDwgaSkgLSAxO1xuXHRcdFx0XHRcdGZvciAoaiA9IGZpbmlzaDsgaiA+PSBzdGFydDsgai0tKSB7XG5cdFx0XHRcdFx0XHRjaGFyTWF0Y2ggPSBwYXR0ZXJuX2FscGhhYmV0W3RleHQuY2hhckF0KGogLSAxKV07XG5cdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZFtqXSA9ICgocmRbaiArIDFdIDw8IDEpIHwgMSkgJiBjaGFyTWF0Y2g7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZFtqXSA9ICgocmRbaiArIDFdIDw8IDEpIHwgMSkgJiBjaGFyTWF0Y2ggfCAoKChsYXN0UmRbaiArIDFdIHwgbGFzdFJkW2pdKSA8PCAxKSB8IDEpIHwgbGFzdFJkW2ogKyAxXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChyZFtqXSAmIG1hdGNobWFzaykge1xuXHRcdFx0XHRcdFx0XHRzY29yZSA9IG1hdGNoX2JpdGFwU2NvcmUoaSwgaiAtIDEpO1xuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcmUgPD0gc2NvcmVUaHJlc2hvbGQpIHtcblx0XHRcdFx0XHRcdFx0XHRzY29yZVRocmVzaG9sZCA9IHNjb3JlO1xuXHRcdFx0XHRcdFx0XHRcdGJlc3RMb2MgPSBqIC0gMTtcblx0XHRcdFx0XHRcdFx0XHRsb2NhdGlvbnMucHVzaChiZXN0TG9jKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYmVzdExvYyA+IE1BVENIX0xPQ0FUSU9OKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydCA9IE1hdGgubWF4KDEsIDIgKiBNQVRDSF9MT0NBVElPTiAtIGJlc3RMb2MpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG1hdGNoX2JpdGFwU2NvcmUoaSArIDEsIE1BVENIX0xPQ0FUSU9OKSA+IHNjb3JlVGhyZXNob2xkKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGFzdFJkID0gcmQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRpc01hdGNoOiBiZXN0TG9jID49IDAsXG5cdFx0XHRcdFx0c2NvcmU6IHNjb3JlXG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHR4dCA9PT0gdHJ1ZSA/IHsgJ3NlYXJjaCcgOiBzZWFyY2ggfSA6IHNlYXJjaCh0eHQpO1xuXHRcdH07XG5cdFx0JC52YWthdGEuc2VhcmNoLmRlZmF1bHRzID0ge1xuXHRcdFx0bG9jYXRpb24gOiAwLFxuXHRcdFx0ZGlzdGFuY2UgOiAxMDAsXG5cdFx0XHR0aHJlc2hvbGQgOiAwLjYsXG5cdFx0XHRmdXp6eSA6IGZhbHNlLFxuXHRcdFx0Y2FzZVNlbnNpdGl2ZSA6IGZhbHNlXG5cdFx0fTtcblx0fSgkKSk7XG5cblx0Ly8gaW5jbHVkZSB0aGUgc2VhcmNoIHBsdWdpbiBieSBkZWZhdWx0XG5cdC8vICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnMucHVzaChcInNlYXJjaFwiKTtcblxuXG4vKipcbiAqICMjIyBTb3J0IHBsdWdpblxuICpcbiAqIEF1dG9tYXRpY2FsbHkgc29ydHMgYWxsIHNpYmxpbmdzIGluIHRoZSB0cmVlIGFjY29yZGluZyB0byBhIHNvcnRpbmcgZnVuY3Rpb24uXG4gKi9cblxuXHQvKipcblx0ICogdGhlIHNldHRpbmdzIGZ1bmN0aW9uIHVzZWQgdG8gc29ydCB0aGUgbm9kZXMuXG5cdCAqIEl0IGlzIGV4ZWN1dGVkIGluIHRoZSB0cmVlJ3MgY29udGV4dCwgYWNjZXB0cyB0d28gbm9kZXMgYXMgYXJndW1lbnRzIGFuZCBzaG91bGQgcmV0dXJuIGAxYCBvciBgLTFgLlxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zb3J0XG5cdCAqIEBwbHVnaW4gc29ydFxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMuc29ydCA9IGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0Ly9yZXR1cm4gdGhpcy5nZXRfdHlwZShhKSA9PT0gdGhpcy5nZXRfdHlwZShiKSA/ICh0aGlzLmdldF90ZXh0KGEpID4gdGhpcy5nZXRfdGV4dChiKSA/IDEgOiAtMSkgOiB0aGlzLmdldF90eXBlKGEpID49IHRoaXMuZ2V0X3R5cGUoYik7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0X3RleHQoYSkgPiB0aGlzLmdldF90ZXh0KGIpID8gMSA6IC0xO1xuXHR9O1xuXHQkLmpzdHJlZS5wbHVnaW5zLnNvcnQgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5iaW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFyZW50LmJpbmQuY2FsbCh0aGlzKTtcblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQub24oXCJtb2RlbC5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zb3J0KGRhdGEucGFyZW50LCB0cnVlKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwicmVuYW1lX25vZGUuanN0cmVlIGNyZWF0ZV9ub2RlLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNvcnQoZGF0YS5wYXJlbnQgfHwgZGF0YS5ub2RlLnBhcmVudCwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0dGhpcy5yZWRyYXdfbm9kZShkYXRhLnBhcmVudCB8fCBkYXRhLm5vZGUucGFyZW50LCB0cnVlKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwibW92ZV9ub2RlLmpzdHJlZSBjb3B5X25vZGUuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdHRoaXMuc29ydChkYXRhLnBhcmVudCwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0dGhpcy5yZWRyYXdfbm9kZShkYXRhLnBhcmVudCwgdHJ1ZSk7XG5cdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogdXNlZCB0byBzb3J0IGEgbm9kZSdzIGNoaWxkcmVuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBzb3J0KG9iaiBbLCBkZWVwXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBkZWVwIGlmIHNldCB0byBgdHJ1ZWAgbm9kZXMgYXJlIHNvcnRlZCByZWN1cnNpdmVseS5cblx0XHQgKiBAcGx1Z2luIHNvcnRcblx0XHQgKiBAdHJpZ2dlciBzZWFyY2guanN0cmVlXG5cdFx0ICovXG5cdFx0dGhpcy5zb3J0ID0gZnVuY3Rpb24gKG9iaiwgZGVlcCkge1xuXHRcdFx0dmFyIGksIGo7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZihvYmogJiYgb2JqLmNoaWxkcmVuICYmIG9iai5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0b2JqLmNoaWxkcmVuLnNvcnQoJC5wcm94eSh0aGlzLnNldHRpbmdzLnNvcnQsIHRoaXMpKTtcblx0XHRcdFx0aWYoZGVlcCkge1xuXHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0dGhpcy5zb3J0KG9iai5jaGlsZHJlbl9kW2ldLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0fTtcblxuXHQvLyBpbmNsdWRlIHRoZSBzb3J0IHBsdWdpbiBieSBkZWZhdWx0XG5cdC8vICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnMucHVzaChcInNvcnRcIik7XG5cbi8qKlxuICogIyMjIFN0YXRlIHBsdWdpblxuICpcbiAqIFNhdmVzIHRoZSBzdGF0ZSBvZiB0aGUgdHJlZSAoc2VsZWN0ZWQgbm9kZXMsIG9wZW5lZCBub2Rlcykgb24gdGhlIHVzZXIncyBjb21wdXRlciB1c2luZyBhdmFpbGFibGUgb3B0aW9ucyAobG9jYWxTdG9yYWdlLCBjb29raWVzLCBldGMpXG4gKi9cblxuXHR2YXIgdG8gPSBmYWxzZTtcblx0LyoqXG5cdCAqIHN0b3JlcyBhbGwgZGVmYXVsdHMgZm9yIHRoZSBzdGF0ZSBwbHVnaW5cblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc3RhdGVcblx0ICogQHBsdWdpbiBzdGF0ZVxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMuc3RhdGUgPSB7XG5cdFx0LyoqXG5cdFx0ICogQSBzdHJpbmcgZm9yIHRoZSBrZXkgdG8gdXNlIHdoZW4gc2F2aW5nIHRoZSBjdXJyZW50IHRyZWUgKGNoYW5nZSBpZiB1c2luZyBtdWx0aXBsZSB0cmVlcyBpbiB5b3VyIHByb2plY3QpLiBEZWZhdWx0cyB0byBganN0cmVlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zdGF0ZS5rZXlcblx0XHQgKiBAcGx1Z2luIHN0YXRlXG5cdFx0ICovXG5cdFx0a2V5XHRcdDogJ2pzdHJlZScsXG5cdFx0LyoqXG5cdFx0ICogQSBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBldmVudHMgdGhhdCB0cmlnZ2VyIGEgc3RhdGUgc2F2ZS4gRGVmYXVsdHMgdG8gYGNoYW5nZWQuanN0cmVlIG9wZW5fbm9kZS5qc3RyZWUgY2xvc2Vfbm9kZS5qc3RyZWVgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnN0YXRlLmV2ZW50c1xuXHRcdCAqIEBwbHVnaW4gc3RhdGVcblx0XHQgKi9cblx0XHRldmVudHNcdDogJ2NoYW5nZWQuanN0cmVlIG9wZW5fbm9kZS5qc3RyZWUgY2xvc2Vfbm9kZS5qc3RyZWUgY2hlY2tfbm9kZS5qc3RyZWUgdW5jaGVja19ub2RlLmpzdHJlZScsXG5cdFx0LyoqXG5cdFx0ICogVGltZSBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgd2hpY2ggdGhlIHN0YXRlIHdpbGwgZXhwaXJlLiBEZWZhdWx0cyB0byAnZmFsc2UnIG1lYW5pbmcgLSBubyBleHBpcmUuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc3RhdGUudHRsXG5cdFx0ICogQHBsdWdpbiBzdGF0ZVxuXHRcdCAqL1xuXHRcdHR0bFx0XHQ6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHByaW9yIHRvIHJlc3RvcmluZyBzdGF0ZSB3aXRoIG9uZSBhcmd1bWVudCAtIHRoZSBzdGF0ZSBvYmplY3QuIENhbiBiZSB1c2VkIHRvIGNsZWFyIHVud2FudGVkIHBhcnRzIG9mIHRoZSBzdGF0ZS5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zdGF0ZS5maWx0ZXJcblx0XHQgKiBAcGx1Z2luIHN0YXRlXG5cdFx0ICovXG5cdFx0ZmlsdGVyXHQ6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIFNob3VsZCBsb2FkZWQgbm9kZXMgYmUgcmVzdG9yZWQgKHNldHRpbmcgdGhpcyB0byB0cnVlIG1lYW5zIHRoYXQgaXQgaXMgcG9zc2libGUgdGhhdCB0aGUgd2hvbGUgdHJlZSB3aWxsIGJlIGxvYWRlZCBmb3Igc29tZSB1c2VycyAtIHVzZSB3aXRoIGNhdXRpb24pLiBEZWZhdWx0cyB0byBgZmFsc2VgXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc3RhdGUucHJlc2VydmVfbG9hZGVkXG5cdFx0ICogQHBsdWdpbiBzdGF0ZVxuXHRcdCAqL1xuXHRcdHByZXNlcnZlX2xvYWRlZCA6IGZhbHNlXG5cdH07XG5cdCQuanN0cmVlLnBsdWdpbnMuc3RhdGUgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5iaW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFyZW50LmJpbmQuY2FsbCh0aGlzKTtcblx0XHRcdHZhciBiaW5kID0gJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5vbih0aGlzLnNldHRpbmdzLnN0YXRlLmV2ZW50cywgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYodG8pIHsgY2xlYXJUaW1lb3V0KHRvKTsgfVxuXHRcdFx0XHRcdHRvID0gc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHsgdGhpcy5zYXZlX3N0YXRlKCk7IH0sIHRoaXMpLCAxMDApO1xuXHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiB0aGUgc3RhdGUgcGx1Z2luIGlzIGZpbmlzaGVkIHJlc3RvcmluZyB0aGUgc3RhdGUgKGFuZCBpbW1lZGlhdGVseSBhZnRlciByZWFkeSBpZiB0aGVyZSBpcyBubyBzdGF0ZSB0byByZXN0b3JlKS5cblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIHN0YXRlX3JlYWR5LmpzdHJlZVxuXHRcdFx0XHQgKiBAcGx1Z2luIHN0YXRlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3N0YXRlX3JlYWR5Jyk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQub24oXCJyZWFkeS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50Lm9uZShcInJlc3RvcmVfc3RhdGUuanN0cmVlXCIsIGJpbmQpO1xuXHRcdFx0XHRcdFx0aWYoIXRoaXMucmVzdG9yZV9zdGF0ZSgpKSB7IGJpbmQoKTsgfVxuXHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHNhdmUgdGhlIHN0YXRlXG5cdFx0ICogQG5hbWUgc2F2ZV9zdGF0ZSgpXG5cdFx0ICogQHBsdWdpbiBzdGF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuc2F2ZV9zdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciB0bSA9IHRoaXMuZ2V0X3N0YXRlKCk7XG5cdFx0XHRpZiAoIXRoaXMuc2V0dGluZ3Muc3RhdGUucHJlc2VydmVfbG9hZGVkKSB7XG5cdFx0XHRcdGRlbGV0ZSB0bS5jb3JlLmxvYWRlZDtcblx0XHRcdH1cblx0XHRcdHZhciBzdCA9IHsgJ3N0YXRlJyA6IHRtLCAndHRsJyA6IHRoaXMuc2V0dGluZ3Muc3RhdGUudHRsLCAnc2VjJyA6ICsobmV3IERhdGUoKSkgfTtcblx0XHRcdCQudmFrYXRhLnN0b3JhZ2Uuc2V0KHRoaXMuc2V0dGluZ3Muc3RhdGUua2V5LCBKU09OLnN0cmluZ2lmeShzdCkpO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogcmVzdG9yZSB0aGUgc3RhdGUgZnJvbSB0aGUgdXNlcidzIGNvbXB1dGVyXG5cdFx0ICogQG5hbWUgcmVzdG9yZV9zdGF0ZSgpXG5cdFx0ICogQHBsdWdpbiBzdGF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMucmVzdG9yZV9zdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBrID0gJC52YWthdGEuc3RvcmFnZS5nZXQodGhpcy5zZXR0aW5ncy5zdGF0ZS5rZXkpO1xuXHRcdFx0aWYoISFrKSB7IHRyeSB7IGsgPSBKU09OLnBhcnNlKGspOyB9IGNhdGNoKGV4KSB7IHJldHVybiBmYWxzZTsgfSB9XG5cdFx0XHRpZighIWsgJiYgay50dGwgJiYgay5zZWMgJiYgKyhuZXcgRGF0ZSgpKSAtIGsuc2VjID4gay50dGwpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZighIWsgJiYgay5zdGF0ZSkgeyBrID0gay5zdGF0ZTsgfVxuXHRcdFx0aWYoISFrICYmICQuaXNGdW5jdGlvbih0aGlzLnNldHRpbmdzLnN0YXRlLmZpbHRlcikpIHsgayA9IHRoaXMuc2V0dGluZ3Muc3RhdGUuZmlsdGVyLmNhbGwodGhpcywgayk7IH1cblx0XHRcdGlmKCEhaykge1xuXHRcdFx0XHRpZiAoIXRoaXMuc2V0dGluZ3Muc3RhdGUucHJlc2VydmVfbG9hZGVkKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIGsuY29yZS5sb2FkZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5lbGVtZW50Lm9uZShcInNldF9zdGF0ZS5qc3RyZWVcIiwgZnVuY3Rpb24gKGUsIGRhdGEpIHsgZGF0YS5pbnN0YW5jZS50cmlnZ2VyKCdyZXN0b3JlX3N0YXRlJywgeyAnc3RhdGUnIDogJC5leHRlbmQodHJ1ZSwge30sIGspIH0pOyB9KTtcblx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoayk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogY2xlYXIgdGhlIHN0YXRlIG9uIHRoZSB1c2VyJ3MgY29tcHV0ZXJcblx0XHQgKiBAbmFtZSBjbGVhcl9zdGF0ZSgpXG5cdFx0ICogQHBsdWdpbiBzdGF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuY2xlYXJfc3RhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gJC52YWthdGEuc3RvcmFnZS5kZWwodGhpcy5zZXR0aW5ncy5zdGF0ZS5rZXkpO1xuXHRcdH07XG5cdH07XG5cblx0KGZ1bmN0aW9uICgkLCB1bmRlZmluZWQpIHtcblx0XHQkLnZha2F0YS5zdG9yYWdlID0ge1xuXHRcdFx0Ly8gc2ltcGx5IHNwZWNpZnlpbmcgdGhlIGZ1bmN0aW9ucyBpbiBGRiB0aHJvd3MgYW4gZXJyb3Jcblx0XHRcdHNldCA6IGZ1bmN0aW9uIChrZXksIHZhbCkgeyByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsKTsgfSxcblx0XHRcdGdldCA6IGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpOyB9LFxuXHRcdFx0ZGVsIDogZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7IH1cblx0XHR9O1xuXHR9KCQpKTtcblxuXHQvLyBpbmNsdWRlIHRoZSBzdGF0ZSBwbHVnaW4gYnkgZGVmYXVsdFxuXHQvLyAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zLnB1c2goXCJzdGF0ZVwiKTtcblxuLyoqXG4gKiAjIyMgVHlwZXMgcGx1Z2luXG4gKlxuICogTWFrZXMgaXQgcG9zc2libGUgdG8gYWRkIHByZWRlZmluZWQgdHlwZXMgZm9yIGdyb3VwcyBvZiBub2Rlcywgd2hpY2ggbWFrZSBpdCBwb3NzaWJsZSB0byBlYXNpbHkgY29udHJvbCBuZXN0aW5nIHJ1bGVzIGFuZCBpY29uIGZvciBlYWNoIGdyb3VwLlxuICovXG5cblx0LyoqXG5cdCAqIEFuIG9iamVjdCBzdG9yaW5nIGFsbCB0eXBlcyBhcyBrZXkgdmFsdWUgcGFpcnMsIHdoZXJlIHRoZSBrZXkgaXMgdGhlIHR5cGUgbmFtZSBhbmQgdGhlIHZhbHVlIGlzIGFuIG9iamVjdCB0aGF0IGNvdWxkIGNvbnRhaW4gZm9sbG93aW5nIGtleXMgKGFsbCBvcHRpb25hbCkuXG5cdCAqXG5cdCAqICogYG1heF9jaGlsZHJlbmAgdGhlIG1heGltdW0gbnVtYmVyIG9mIGltbWVkaWF0ZSBjaGlsZHJlbiB0aGlzIG5vZGUgdHlwZSBjYW4gaGF2ZS4gRG8gbm90IHNwZWNpZnkgb3Igc2V0IHRvIGAtMWAgZm9yIHVubGltaXRlZC5cblx0ICogKiBgbWF4X2RlcHRoYCB0aGUgbWF4aW11bSBudW1iZXIgb2YgbmVzdGluZyB0aGlzIG5vZGUgdHlwZSBjYW4gaGF2ZS4gQSB2YWx1ZSBvZiBgMWAgd291bGQgbWVhbiB0aGF0IHRoZSBub2RlIGNhbiBoYXZlIGNoaWxkcmVuLCBidXQgbm8gZ3JhbmRjaGlsZHJlbi4gRG8gbm90IHNwZWNpZnkgb3Igc2V0IHRvIGAtMWAgZm9yIHVubGltaXRlZC5cblx0ICogKiBgdmFsaWRfY2hpbGRyZW5gIGFuIGFycmF5IG9mIG5vZGUgdHlwZSBzdHJpbmdzLCB0aGF0IG5vZGVzIG9mIHRoaXMgdHlwZSBjYW4gaGF2ZSBhcyBjaGlsZHJlbi4gRG8gbm90IHNwZWNpZnkgb3Igc2V0IHRvIGAtMWAgZm9yIG5vIGxpbWl0cy5cblx0ICogKiBgaWNvbmAgYSBzdHJpbmcgLSBjYW4gYmUgYSBwYXRoIHRvIGFuIGljb24gb3IgYSBjbGFzc05hbWUsIGlmIHVzaW5nIGFuIGltYWdlIHRoYXQgaXMgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5IHVzZSBhIGAuL2AgcHJlZml4LCBvdGhlcndpc2UgaXQgd2lsbCBiZSBkZXRlY3RlZCBhcyBhIGNsYXNzLiBPbWl0IHRvIHVzZSB0aGUgZGVmYXVsdCBpY29uIGZyb20geW91ciB0aGVtZS5cblx0ICogKiBgbGlfYXR0cmAgYW4gb2JqZWN0IG9mIHZhbHVlcyB3aGljaCB3aWxsIGJlIHVzZWQgdG8gYWRkIEhUTUwgYXR0cmlidXRlcyBvbiB0aGUgcmVzdWx0aW5nIExJIERPTSBub2RlIChtZXJnZWQgd2l0aCB0aGUgbm9kZSdzIG93biBkYXRhKVxuXHQgKiAqIGBhX2F0dHJgIGFuIG9iamVjdCBvZiB2YWx1ZXMgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGFkZCBIVE1MIGF0dHJpYnV0ZXMgb24gdGhlIHJlc3VsdGluZyBBIERPTSBub2RlIChtZXJnZWQgd2l0aCB0aGUgbm9kZSdzIG93biBkYXRhKVxuXHQgKlxuXHQgKiBUaGVyZSBhcmUgdHdvIHByZWRlZmluZWQgdHlwZXM6XG5cdCAqXG5cdCAqICogYCNgIHJlcHJlc2VudHMgdGhlIHJvb3Qgb2YgdGhlIHRyZWUsIGZvciBleGFtcGxlIGBtYXhfY2hpbGRyZW5gIHdvdWxkIGNvbnRyb2wgdGhlIG1heGltdW0gbnVtYmVyIG9mIHJvb3Qgbm9kZXMuXG5cdCAqICogYGRlZmF1bHRgIHJlcHJlc2VudHMgdGhlIGRlZmF1bHQgbm9kZSAtIGFueSBzZXR0aW5ncyBoZXJlIHdpbGwgYmUgYXBwbGllZCB0byBhbGwgbm9kZXMgdGhhdCBkbyBub3QgaGF2ZSBhIHR5cGUgc3BlY2lmaWVkLlxuXHQgKlxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy50eXBlc1xuXHQgKiBAcGx1Z2luIHR5cGVzXG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy50eXBlcyA9IHtcblx0XHQnZGVmYXVsdCcgOiB7fVxuXHR9O1xuXHQkLmpzdHJlZS5kZWZhdWx0cy50eXBlc1skLmpzdHJlZS5yb290XSA9IHt9O1xuXG5cdCQuanN0cmVlLnBsdWdpbnMudHlwZXMgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5pbml0ID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG5cdFx0XHR2YXIgaSwgajtcblx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy50eXBlcyAmJiBvcHRpb25zLnR5cGVzWydkZWZhdWx0J10pIHtcblx0XHRcdFx0Zm9yKGkgaW4gb3B0aW9ucy50eXBlcykge1xuXHRcdFx0XHRcdGlmKGkgIT09IFwiZGVmYXVsdFwiICYmIGkgIT09ICQuanN0cmVlLnJvb3QgJiYgb3B0aW9ucy50eXBlcy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0Zm9yKGogaW4gb3B0aW9ucy50eXBlc1snZGVmYXVsdCddKSB7XG5cdFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMudHlwZXNbJ2RlZmF1bHQnXS5oYXNPd25Qcm9wZXJ0eShqKSAmJiBvcHRpb25zLnR5cGVzW2ldW2pdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLnR5cGVzW2ldW2pdID0gb3B0aW9ucy50eXBlc1snZGVmYXVsdCddW2pdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRwYXJlbnQuaW5pdC5jYWxsKHRoaXMsIGVsLCBvcHRpb25zKTtcblx0XHRcdHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF0udHlwZSA9ICQuanN0cmVlLnJvb3Q7XG5cdFx0fTtcblx0XHR0aGlzLnJlZnJlc2ggPSBmdW5jdGlvbiAoc2tpcF9sb2FkaW5nLCBmb3JnZXRfc3RhdGUpIHtcblx0XHRcdHBhcmVudC5yZWZyZXNoLmNhbGwodGhpcywgc2tpcF9sb2FkaW5nLCBmb3JnZXRfc3RhdGUpO1xuXHRcdFx0dGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XS50eXBlID0gJC5qc3RyZWUucm9vdDtcblx0XHR9O1xuXHRcdHRoaXMuYmluZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQub24oJ21vZGVsLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdHZhciBtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0XHRcdFx0ZHBjID0gZGF0YS5ub2Rlcyxcblx0XHRcdFx0XHRcdFx0dCA9IHRoaXMuc2V0dGluZ3MudHlwZXMsXG5cdFx0XHRcdFx0XHRcdGksIGosIGMgPSAnZGVmYXVsdCcsIGs7XG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkcGMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGMgPSAnZGVmYXVsdCc7XG5cdFx0XHRcdFx0XHRcdGlmKG1bZHBjW2ldXS5vcmlnaW5hbCAmJiBtW2RwY1tpXV0ub3JpZ2luYWwudHlwZSAmJiB0W21bZHBjW2ldXS5vcmlnaW5hbC50eXBlXSkge1xuXHRcdFx0XHRcdFx0XHRcdGMgPSBtW2RwY1tpXV0ub3JpZ2luYWwudHlwZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihtW2RwY1tpXV0uZGF0YSAmJiBtW2RwY1tpXV0uZGF0YS5qc3RyZWUgJiYgbVtkcGNbaV1dLmRhdGEuanN0cmVlLnR5cGUgJiYgdFttW2RwY1tpXV0uZGF0YS5qc3RyZWUudHlwZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRjID0gbVtkcGNbaV1dLmRhdGEuanN0cmVlLnR5cGU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bVtkcGNbaV1dLnR5cGUgPSBjO1xuXHRcdFx0XHRcdFx0XHRpZihtW2RwY1tpXV0uaWNvbiA9PT0gdHJ1ZSAmJiB0W2NdLmljb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRcdG1bZHBjW2ldXS5pY29uID0gdFtjXS5pY29uO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKHRbY10ubGlfYXR0ciAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0W2NdLmxpX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChrIGluIHRbY10ubGlfYXR0cikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHRbY10ubGlfYXR0ci5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoayA9PT0gJ2lkJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKG1bZHBjW2ldXS5saV9hdHRyW2tdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtW2RwY1tpXV0ubGlfYXR0cltrXSA9IHRbY10ubGlfYXR0cltrXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChrID09PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bVtkcGNbaV1dLmxpX2F0dHJbJ2NsYXNzJ10gPSB0W2NdLmxpX2F0dHJbJ2NsYXNzJ10gKyAnICcgKyBtW2RwY1tpXV0ubGlfYXR0clsnY2xhc3MnXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZih0W2NdLmFfYXR0ciAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0W2NdLmFfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGsgaW4gdFtjXS5hX2F0dHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh0W2NdLmFfYXR0ci5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoayA9PT0gJ2lkJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKG1bZHBjW2ldXS5hX2F0dHJba10gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1bZHBjW2ldXS5hX2F0dHJba10gPSB0W2NdLmFfYXR0cltrXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChrID09PSAnaHJlZicgJiYgbVtkcGNbaV1dLmFfYXR0cltrXSA9PT0gJyMnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bVtkcGNbaV1dLmFfYXR0clsnaHJlZiddID0gdFtjXS5hX2F0dHJbJ2hyZWYnXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChrID09PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bVtkcGNbaV1dLmFfYXR0clsnY2xhc3MnXSA9IHRbY10uYV9hdHRyWydjbGFzcyddICsgJyAnICsgbVtkcGNbaV1dLmFfYXR0clsnY2xhc3MnXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bVskLmpzdHJlZS5yb290XS50eXBlID0gJC5qc3RyZWUucm9vdDtcblx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRwYXJlbnQuYmluZC5jYWxsKHRoaXMpO1xuXHRcdH07XG5cdFx0dGhpcy5nZXRfanNvbiA9IGZ1bmN0aW9uIChvYmosIG9wdGlvbnMsIGZsYXQpIHtcblx0XHRcdHZhciBpLCBqLFxuXHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0b3B0ID0gb3B0aW9ucyA/ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zLCB7bm9faWQ6ZmFsc2V9KSA6IHt9LFxuXHRcdFx0XHR0bXAgPSBwYXJlbnQuZ2V0X2pzb24uY2FsbCh0aGlzLCBvYmosIG9wdCwgZmxhdCk7XG5cdFx0XHRpZih0bXAgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYoJC5pc0FycmF5KHRtcCkpIHtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdHRtcFtpXS50eXBlID0gdG1wW2ldLmlkICYmIG1bdG1wW2ldLmlkXSAmJiBtW3RtcFtpXS5pZF0udHlwZSA/IG1bdG1wW2ldLmlkXS50eXBlIDogXCJkZWZhdWx0XCI7XG5cdFx0XHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLm5vX2lkKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgdG1wW2ldLmlkO1xuXHRcdFx0XHRcdFx0aWYodG1wW2ldLmxpX2F0dHIgJiYgdG1wW2ldLmxpX2F0dHIuaWQpIHtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIHRtcFtpXS5saV9hdHRyLmlkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodG1wW2ldLmFfYXR0ciAmJiB0bXBbaV0uYV9hdHRyLmlkKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSB0bXBbaV0uYV9hdHRyLmlkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRtcC50eXBlID0gdG1wLmlkICYmIG1bdG1wLmlkXSAmJiBtW3RtcC5pZF0udHlwZSA/IG1bdG1wLmlkXS50eXBlIDogXCJkZWZhdWx0XCI7XG5cdFx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5ub19pZCkge1xuXHRcdFx0XHRcdHRtcCA9IHRoaXMuX2RlbGV0ZV9pZHModG1wKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRtcDtcblx0XHR9O1xuXHRcdHRoaXMuX2RlbGV0ZV9pZHMgPSBmdW5jdGlvbiAodG1wKSB7XG5cdFx0XHRpZigkLmlzQXJyYXkodG1wKSkge1xuXHRcdFx0XHRmb3IodmFyIGkgPSAwLCBqID0gdG1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdHRtcFtpXSA9IHRoaXMuX2RlbGV0ZV9pZHModG1wW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdG1wO1xuXHRcdFx0fVxuXHRcdFx0ZGVsZXRlIHRtcC5pZDtcblx0XHRcdGlmKHRtcC5saV9hdHRyICYmIHRtcC5saV9hdHRyLmlkKSB7XG5cdFx0XHRcdGRlbGV0ZSB0bXAubGlfYXR0ci5pZDtcblx0XHRcdH1cblx0XHRcdGlmKHRtcC5hX2F0dHIgJiYgdG1wLmFfYXR0ci5pZCkge1xuXHRcdFx0XHRkZWxldGUgdG1wLmFfYXR0ci5pZDtcblx0XHRcdH1cblx0XHRcdGlmKHRtcC5jaGlsZHJlbiAmJiAkLmlzQXJyYXkodG1wLmNoaWxkcmVuKSkge1xuXHRcdFx0XHR0bXAuY2hpbGRyZW4gPSB0aGlzLl9kZWxldGVfaWRzKHRtcC5jaGlsZHJlbik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdG1wO1xuXHRcdH07XG5cdFx0dGhpcy5jaGVjayA9IGZ1bmN0aW9uIChjaGssIG9iaiwgcGFyLCBwb3MsIG1vcmUpIHtcblx0XHRcdGlmKHBhcmVudC5jaGVjay5jYWxsKHRoaXMsIGNoaywgb2JqLCBwYXIsIHBvcywgbW9yZSkgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0b2JqID0gb2JqICYmIG9iai5pZCA/IG9iaiA6IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHBhciA9IHBhciAmJiBwYXIuaWQgPyBwYXIgOiB0aGlzLmdldF9ub2RlKHBhcik7XG5cdFx0XHR2YXIgbSA9IG9iaiAmJiBvYmouaWQgPyAobW9yZSAmJiBtb3JlLm9yaWdpbiA/IG1vcmUub3JpZ2luIDogJC5qc3RyZWUucmVmZXJlbmNlKG9iai5pZCkpIDogbnVsbCwgdG1wLCBkLCBpLCBqO1xuXHRcdFx0bSA9IG0gJiYgbS5fbW9kZWwgJiYgbS5fbW9kZWwuZGF0YSA/IG0uX21vZGVsLmRhdGEgOiBudWxsO1xuXHRcdFx0c3dpdGNoKGNoaykge1xuXHRcdFx0XHRjYXNlIFwiY3JlYXRlX25vZGVcIjpcblx0XHRcdFx0Y2FzZSBcIm1vdmVfbm9kZVwiOlxuXHRcdFx0XHRjYXNlIFwiY29weV9ub2RlXCI6XG5cdFx0XHRcdFx0aWYoY2hrICE9PSAnbW92ZV9ub2RlJyB8fCAkLmluQXJyYXkob2JqLmlkLCBwYXIuY2hpbGRyZW4pID09PSAtMSkge1xuXHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfcnVsZXMocGFyKTtcblx0XHRcdFx0XHRcdGlmKHRtcC5tYXhfY2hpbGRyZW4gIT09IHVuZGVmaW5lZCAmJiB0bXAubWF4X2NoaWxkcmVuICE9PSAtMSAmJiB0bXAubWF4X2NoaWxkcmVuID09PSBwYXIuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAndHlwZXMnLCAnaWQnIDogJ3R5cGVzXzAxJywgJ3JlYXNvbicgOiAnbWF4X2NoaWxkcmVuIHByZXZlbnRzIGZ1bmN0aW9uOiAnICsgY2hrLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHRtcC52YWxpZF9jaGlsZHJlbiAhPT0gdW5kZWZpbmVkICYmIHRtcC52YWxpZF9jaGlsZHJlbiAhPT0gLTEgJiYgJC5pbkFycmF5KChvYmoudHlwZSB8fCAnZGVmYXVsdCcpLCB0bXAudmFsaWRfY2hpbGRyZW4pID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ3R5cGVzJywgJ2lkJyA6ICd0eXBlc18wMicsICdyZWFzb24nIDogJ3ZhbGlkX2NoaWxkcmVuIHByZXZlbnRzIGZ1bmN0aW9uOiAnICsgY2hrLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKG0gJiYgb2JqLmNoaWxkcmVuX2QgJiYgb2JqLnBhcmVudHMpIHtcblx0XHRcdFx0XHRcdFx0ZCA9IDA7XG5cdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGQgPSBNYXRoLm1heChkLCBtW29iai5jaGlsZHJlbl9kW2ldXS5wYXJlbnRzLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZCA9IGQgLSBvYmoucGFyZW50cy5sZW5ndGggKyAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoZCA8PSAwIHx8IGQgPT09IHVuZGVmaW5lZCkgeyBkID0gMTsgfVxuXHRcdFx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdFx0XHRpZih0bXAubWF4X2RlcHRoICE9PSB1bmRlZmluZWQgJiYgdG1wLm1heF9kZXB0aCAhPT0gLTEgJiYgdG1wLm1heF9kZXB0aCA8IGQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ3R5cGVzJywgJ2lkJyA6ICd0eXBlc18wMycsICdyZWFzb24nIDogJ21heF9kZXB0aCBwcmV2ZW50cyBmdW5jdGlvbjogJyArIGNoaywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwYXIgPSB0aGlzLmdldF9ub2RlKHBhci5wYXJlbnQpO1xuXHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ydWxlcyhwYXIpO1xuXHRcdFx0XHRcdFx0XHRkKys7XG5cdFx0XHRcdFx0XHR9IHdoaWxlKHBhcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiB1c2VkIHRvIHJldHJpZXZlIHRoZSB0eXBlIHNldHRpbmdzIG9iamVjdCBmb3IgYSBub2RlXG5cdFx0ICogQG5hbWUgZ2V0X3J1bGVzKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gZmluZCB0aGUgcnVsZXMgZm9yXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fVxuXHRcdCAqIEBwbHVnaW4gdHlwZXNcblx0XHQgKi9cblx0XHR0aGlzLmdldF9ydWxlcyA9IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR2YXIgdG1wID0gdGhpcy5nZXRfdHlwZShvYmosIHRydWUpO1xuXHRcdFx0aWYodG1wLm1heF9kZXB0aCA9PT0gdW5kZWZpbmVkKSB7IHRtcC5tYXhfZGVwdGggPSAtMTsgfVxuXHRcdFx0aWYodG1wLm1heF9jaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7IHRtcC5tYXhfY2hpbGRyZW4gPSAtMTsgfVxuXHRcdFx0aWYodG1wLnZhbGlkX2NoaWxkcmVuID09PSB1bmRlZmluZWQpIHsgdG1wLnZhbGlkX2NoaWxkcmVuID0gLTE7IH1cblx0XHRcdHJldHVybiB0bXA7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiB1c2VkIHRvIHJldHJpZXZlIHRoZSB0eXBlIHN0cmluZyBvciBzZXR0aW5ncyBvYmplY3QgZm9yIGEgbm9kZVxuXHRcdCAqIEBuYW1lIGdldF90eXBlKG9iaiBbLCBydWxlc10pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGZpbmQgdGhlIHJ1bGVzIGZvclxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gcnVsZXMgaWYgc2V0IHRvIGB0cnVlYCBpbnN0ZWFkIG9mIGEgc3RyaW5nIHRoZSBzZXR0aW5ncyBvYmplY3Qgd2lsbCBiZSByZXR1cm5lZFxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ3xPYmplY3R9XG5cdFx0ICogQHBsdWdpbiB0eXBlc1xuXHRcdCAqL1xuXHRcdHRoaXMuZ2V0X3R5cGUgPSBmdW5jdGlvbiAob2JqLCBydWxlcykge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuICghb2JqKSA/IGZhbHNlIDogKCBydWxlcyA/ICQuZXh0ZW5kKHsgJ3R5cGUnIDogb2JqLnR5cGUgfSwgdGhpcy5zZXR0aW5ncy50eXBlc1tvYmoudHlwZV0pIDogb2JqLnR5cGUpO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogdXNlZCB0byBjaGFuZ2UgYSBub2RlJ3MgdHlwZVxuXHRcdCAqIEBuYW1lIHNldF90eXBlKG9iaiwgdHlwZSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gY2hhbmdlXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdGhlIG5ldyB0eXBlXG5cdFx0ICogQHBsdWdpbiB0eXBlc1xuXHRcdCAqL1xuXHRcdHRoaXMuc2V0X3R5cGUgPSBmdW5jdGlvbiAob2JqLCB0eXBlKSB7XG5cdFx0XHR2YXIgbSA9IHRoaXMuX21vZGVsLmRhdGEsIHQsIHQxLCB0Miwgb2xkX3R5cGUsIG9sZF9pY29uLCBrLCBkLCBhO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuc2V0X3R5cGUob2JqW3QxXSwgdHlwZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHR0ID0gdGhpcy5zZXR0aW5ncy50eXBlcztcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCF0W3R5cGVdIHx8ICFvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRkID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYgKGQgJiYgZC5sZW5ndGgpIHtcblx0XHRcdFx0YSA9IGQuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJyk7XG5cdFx0XHR9XG5cdFx0XHRvbGRfdHlwZSA9IG9iai50eXBlO1xuXHRcdFx0b2xkX2ljb24gPSB0aGlzLmdldF9pY29uKG9iaik7XG5cdFx0XHRvYmoudHlwZSA9IHR5cGU7XG5cdFx0XHRpZihvbGRfaWNvbiA9PT0gdHJ1ZSB8fCAhdFtvbGRfdHlwZV0gfHwgKHRbb2xkX3R5cGVdLmljb24gIT09IHVuZGVmaW5lZCAmJiBvbGRfaWNvbiA9PT0gdFtvbGRfdHlwZV0uaWNvbikpIHtcblx0XHRcdFx0dGhpcy5zZXRfaWNvbihvYmosIHRbdHlwZV0uaWNvbiAhPT0gdW5kZWZpbmVkID8gdFt0eXBlXS5pY29uIDogdHJ1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHJlbW92ZSBvbGQgdHlwZSBwcm9wc1xuXHRcdFx0aWYodFtvbGRfdHlwZV0gJiYgdFtvbGRfdHlwZV0ubGlfYXR0ciAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0W29sZF90eXBlXS5saV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGsgaW4gdFtvbGRfdHlwZV0ubGlfYXR0cikge1xuXHRcdFx0XHRcdGlmICh0W29sZF90eXBlXS5saV9hdHRyLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHRcdFx0XHRpZiAoayA9PT0gJ2lkJykge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKGsgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdFx0bVtvYmouaWRdLmxpX2F0dHJbJ2NsYXNzJ10gPSAobVtvYmouaWRdLmxpX2F0dHJbJ2NsYXNzJ10gfHwgJycpLnJlcGxhY2UodFtvbGRfdHlwZV0ubGlfYXR0cltrXSwgJycpO1xuXHRcdFx0XHRcdFx0XHRpZiAoZCkgeyBkLnJlbW92ZUNsYXNzKHRbb2xkX3R5cGVdLmxpX2F0dHJba10pOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChtW29iai5pZF0ubGlfYXR0cltrXSA9PT0gdFtvbGRfdHlwZV0ubGlfYXR0cltrXSkge1xuXHRcdFx0XHRcdFx0XHRtW29iai5pZF0ubGlfYXR0cltrXSA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdGlmIChkKSB7IGQucmVtb3ZlQXR0cihrKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYodFtvbGRfdHlwZV0gJiYgdFtvbGRfdHlwZV0uYV9hdHRyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRbb2xkX3R5cGVdLmFfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChrIGluIHRbb2xkX3R5cGVdLmFfYXR0cikge1xuXHRcdFx0XHRcdGlmICh0W29sZF90eXBlXS5hX2F0dHIuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0XHRcdGlmIChrID09PSAnaWQnKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoayA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0XHRtW29iai5pZF0uYV9hdHRyWydjbGFzcyddID0gKG1bb2JqLmlkXS5hX2F0dHJbJ2NsYXNzJ10gfHwgJycpLnJlcGxhY2UodFtvbGRfdHlwZV0uYV9hdHRyW2tdLCAnJyk7XG5cdFx0XHRcdFx0XHRcdGlmIChhKSB7IGEucmVtb3ZlQ2xhc3ModFtvbGRfdHlwZV0uYV9hdHRyW2tdKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAobVtvYmouaWRdLmFfYXR0cltrXSA9PT0gdFtvbGRfdHlwZV0uYV9hdHRyW2tdKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChrID09PSAnaHJlZicpIHtcblx0XHRcdFx0XHRcdFx0XHRtW29iai5pZF0uYV9hdHRyW2tdID0gJyMnO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChhKSB7IGEuYXR0cignaHJlZicsICcjJyk7IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgbVtvYmouaWRdLmFfYXR0cltrXTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoYSkgeyBhLnJlbW92ZUF0dHIoayk7IH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBhZGQgbmV3IHByb3BzXG5cdFx0XHRpZih0W3R5cGVdLmxpX2F0dHIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdFt0eXBlXS5saV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGsgaW4gdFt0eXBlXS5saV9hdHRyKSB7XG5cdFx0XHRcdFx0aWYgKHRbdHlwZV0ubGlfYXR0ci5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRcdFx0aWYgKGsgPT09ICdpZCcpIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChtW29iai5pZF0ubGlfYXR0cltrXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdG1bb2JqLmlkXS5saV9hdHRyW2tdID0gdFt0eXBlXS5saV9hdHRyW2tdO1xuXHRcdFx0XHRcdFx0XHRpZiAoZCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChrID09PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkLmFkZENsYXNzKHRbdHlwZV0ubGlfYXR0cltrXSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZC5hdHRyKGssIHRbdHlwZV0ubGlfYXR0cltrXSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChrID09PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRcdG1bb2JqLmlkXS5saV9hdHRyWydjbGFzcyddID0gdFt0eXBlXS5saV9hdHRyW2tdICsgJyAnICsgbVtvYmouaWRdLmxpX2F0dHJbJ2NsYXNzJ107XG5cdFx0XHRcdFx0XHRcdGlmIChkKSB7IGQuYWRkQ2xhc3ModFt0eXBlXS5saV9hdHRyW2tdKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYodFt0eXBlXS5hX2F0dHIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdFt0eXBlXS5hX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoayBpbiB0W3R5cGVdLmFfYXR0cikge1xuXHRcdFx0XHRcdGlmICh0W3R5cGVdLmFfYXR0ci5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRcdFx0aWYgKGsgPT09ICdpZCcpIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChtW29iai5pZF0uYV9hdHRyW2tdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0bVtvYmouaWRdLmFfYXR0cltrXSA9IHRbdHlwZV0uYV9hdHRyW2tdO1xuXHRcdFx0XHRcdFx0XHRpZiAoYSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChrID09PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhLmFkZENsYXNzKHRbdHlwZV0uYV9hdHRyW2tdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhLmF0dHIoaywgdFt0eXBlXS5hX2F0dHJba10pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoayA9PT0gJ2hyZWYnICYmIG1bb2JqLmlkXS5hX2F0dHJba10gPT09ICcjJykge1xuXHRcdFx0XHRcdFx0XHRtW29iai5pZF0uYV9hdHRyWydocmVmJ10gPSB0W3R5cGVdLmFfYXR0clsnaHJlZiddO1xuXHRcdFx0XHRcdFx0XHRpZiAoYSkgeyBhLmF0dHIoJ2hyZWYnLCB0W3R5cGVdLmFfYXR0clsnaHJlZiddKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoayA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0XHRtW29iai5pZF0uYV9hdHRyWydjbGFzcyddID0gdFt0eXBlXS5hX2F0dHJbJ2NsYXNzJ10gKyAnICcgKyBtW29iai5pZF0uYV9hdHRyWydjbGFzcyddO1xuXHRcdFx0XHRcdFx0XHRpZiAoYSkgeyBhLmFkZENsYXNzKHRbdHlwZV0uYV9hdHRyW2tdKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXHR9O1xuXHQvLyBpbmNsdWRlIHRoZSB0eXBlcyBwbHVnaW4gYnkgZGVmYXVsdFxuXHQvLyAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zLnB1c2goXCJ0eXBlc1wiKTtcblxuXG4vKipcbiAqICMjIyBVbmlxdWUgcGx1Z2luXG4gKlxuICogRW5mb3JjZXMgdGhhdCBubyBub2RlcyB3aXRoIHRoZSBzYW1lIG5hbWUgY2FuIGNvZXhpc3QgYXMgc2libGluZ3MuXG4gKi9cblxuXHQvKipcblx0ICogc3RvcmVzIGFsbCBkZWZhdWx0cyBmb3IgdGhlIHVuaXF1ZSBwbHVnaW5cblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMudW5pcXVlXG5cdCAqIEBwbHVnaW4gdW5pcXVlXG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy51bmlxdWUgPSB7XG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIHRoZSBjb21wYXJpc29uIHNob3VsZCBiZSBjYXNlIHNlbnNpdGl2ZS4gRGVmYXVsdCBpcyBgZmFsc2VgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnVuaXF1ZS5jYXNlX3NlbnNpdGl2ZVxuXHRcdCAqIEBwbHVnaW4gdW5pcXVlXG5cdFx0ICovXG5cdFx0Y2FzZV9zZW5zaXRpdmUgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgd2hpdGUgc3BhY2Ugc2hvdWxkIGJlIHRyaW1tZWQgYmVmb3JlIHRoZSBjb21wYXJpc29uLiBEZWZhdWx0IGlzIGBmYWxzZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMudW5pcXVlLnRyaW1fd2hpdGVzcGFjZVxuXHRcdCAqIEBwbHVnaW4gdW5pcXVlXG5cdFx0ICovXG5cdFx0dHJpbV93aGl0ZXNwYWNlIDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogQSBjYWxsYmFjayBleGVjdXRlZCBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSB3aGVuIGEgbmV3IG5vZGUgaXMgY3JlYXRlZCBhbmQgdGhlIG5hbWUgaXMgYWxyZWFkeSB0YWtlbiwgdGhlIHR3byBhcmd1bWVudHMgYXJlIHRoZSBjb25mbGljdGluZyBuYW1lIGFuZCB0aGUgY291bnRlci4gVGhlIGRlZmF1bHQgd2lsbCBwcm9kdWNlIHJlc3VsdHMgbGlrZSBgTmV3IG5vZGUgKDIpYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy51bmlxdWUuZHVwbGljYXRlXG5cdFx0ICogQHBsdWdpbiB1bmlxdWVcblx0XHQgKi9cblx0XHRkdXBsaWNhdGUgOiBmdW5jdGlvbiAobmFtZSwgY291bnRlcikge1xuXHRcdFx0cmV0dXJuIG5hbWUgKyAnICgnICsgY291bnRlciArICcpJztcblx0XHR9XG5cdH07XG5cblx0JC5qc3RyZWUucGx1Z2lucy51bmlxdWUgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5jaGVjayA9IGZ1bmN0aW9uIChjaGssIG9iaiwgcGFyLCBwb3MsIG1vcmUpIHtcblx0XHRcdGlmKHBhcmVudC5jaGVjay5jYWxsKHRoaXMsIGNoaywgb2JqLCBwYXIsIHBvcywgbW9yZSkgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0b2JqID0gb2JqICYmIG9iai5pZCA/IG9iaiA6IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHBhciA9IHBhciAmJiBwYXIuaWQgPyBwYXIgOiB0aGlzLmdldF9ub2RlKHBhcik7XG5cdFx0XHRpZighcGFyIHx8ICFwYXIuY2hpbGRyZW4pIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdHZhciBuID0gY2hrID09PSBcInJlbmFtZV9ub2RlXCIgPyBwb3MgOiBvYmoudGV4dCxcblx0XHRcdFx0YyA9IFtdLFxuXHRcdFx0XHRzID0gdGhpcy5zZXR0aW5ncy51bmlxdWUuY2FzZV9zZW5zaXRpdmUsXG5cdFx0XHRcdHcgPSB0aGlzLnNldHRpbmdzLnVuaXF1ZS50cmltX3doaXRlc3BhY2UsXG5cdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLCBpLCBqLCB0O1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gcGFyLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHR0ID0gbVtwYXIuY2hpbGRyZW5baV1dLnRleHQ7XG5cdFx0XHRcdGlmICghcykge1xuXHRcdFx0XHRcdHQgPSB0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHcpIHtcblx0XHRcdFx0XHR0ID0gdC5yZXBsYWNlKC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZywgJycpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGMucHVzaCh0KTtcblx0XHRcdH1cblx0XHRcdGlmKCFzKSB7IG4gPSBuLnRvTG93ZXJDYXNlKCk7IH1cblx0XHRcdGlmICh3KSB7IG4gPSBuLnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7IH1cblx0XHRcdHN3aXRjaChjaGspIHtcblx0XHRcdFx0Y2FzZSBcImRlbGV0ZV9ub2RlXCI6XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdGNhc2UgXCJyZW5hbWVfbm9kZVwiOlxuXHRcdFx0XHRcdHQgPSBvYmoudGV4dCB8fCAnJztcblx0XHRcdFx0XHRpZiAoIXMpIHtcblx0XHRcdFx0XHRcdHQgPSB0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh3KSB7XG5cdFx0XHRcdFx0XHR0ID0gdC5yZXBsYWNlKC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZywgJycpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpID0gKCQuaW5BcnJheShuLCBjKSA9PT0gLTEgfHwgKG9iai50ZXh0ICYmIHQgPT09IG4pKTtcblx0XHRcdFx0XHRpZighaSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICd1bmlxdWUnLCAnaWQnIDogJ3VuaXF1ZV8wMScsICdyZWFzb24nIDogJ0NoaWxkIHdpdGggbmFtZSAnICsgbiArICcgYWxyZWFkeSBleGlzdHMuIFByZXZlbnRpbmc6ICcgKyBjaGssICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdGNhc2UgXCJjcmVhdGVfbm9kZVwiOlxuXHRcdFx0XHRcdGkgPSAoJC5pbkFycmF5KG4sIGMpID09PSAtMSk7XG5cdFx0XHRcdFx0aWYoIWkpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAndW5pcXVlJywgJ2lkJyA6ICd1bmlxdWVfMDQnLCAncmVhc29uJyA6ICdDaGlsZCB3aXRoIG5hbWUgJyArIG4gKyAnIGFscmVhZHkgZXhpc3RzLiBQcmV2ZW50aW5nOiAnICsgY2hrLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHRjYXNlIFwiY29weV9ub2RlXCI6XG5cdFx0XHRcdFx0aSA9ICgkLmluQXJyYXkobiwgYykgPT09IC0xKTtcblx0XHRcdFx0XHRpZighaSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICd1bmlxdWUnLCAnaWQnIDogJ3VuaXF1ZV8wMicsICdyZWFzb24nIDogJ0NoaWxkIHdpdGggbmFtZSAnICsgbiArICcgYWxyZWFkeSBleGlzdHMuIFByZXZlbnRpbmc6ICcgKyBjaGssICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdGNhc2UgXCJtb3ZlX25vZGVcIjpcblx0XHRcdFx0XHRpID0gKCAob2JqLnBhcmVudCA9PT0gcGFyLmlkICYmICghbW9yZSB8fCAhbW9yZS5pc19tdWx0aSkpIHx8ICQuaW5BcnJheShuLCBjKSA9PT0gLTEpO1xuXHRcdFx0XHRcdGlmKCFpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ3VuaXF1ZScsICdpZCcgOiAndW5pcXVlXzAzJywgJ3JlYXNvbicgOiAnQ2hpbGQgd2l0aCBuYW1lICcgKyBuICsgJyBhbHJlYWR5IGV4aXN0cy4gUHJldmVudGluZzogJyArIGNoaywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cdFx0dGhpcy5jcmVhdGVfbm9kZSA9IGZ1bmN0aW9uIChwYXIsIG5vZGUsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCkge1xuXHRcdFx0aWYoIW5vZGUgfHwgbm9kZS50ZXh0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0aWYocGFyID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cGFyID0gJC5qc3RyZWUucm9vdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwYXIgPSB0aGlzLmdldF9ub2RlKHBhcik7XG5cdFx0XHRcdGlmKCFwYXIpIHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyZW50LmNyZWF0ZV9ub2RlLmNhbGwodGhpcywgcGFyLCBub2RlLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBvcyA9IHBvcyA9PT0gdW5kZWZpbmVkID8gXCJsYXN0XCIgOiBwb3M7XG5cdFx0XHRcdGlmKCFwb3MudG9TdHJpbmcoKS5tYXRjaCgvXihiZWZvcmV8YWZ0ZXIpJC8pICYmICFpc19sb2FkZWQgJiYgIXRoaXMuaXNfbG9hZGVkKHBhcikpIHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyZW50LmNyZWF0ZV9ub2RlLmNhbGwodGhpcywgcGFyLCBub2RlLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCFub2RlKSB7IG5vZGUgPSB7fTsgfVxuXHRcdFx0XHR2YXIgdG1wLCBuLCBkcGMsIGksIGosIG0gPSB0aGlzLl9tb2RlbC5kYXRhLCBzID0gdGhpcy5zZXR0aW5ncy51bmlxdWUuY2FzZV9zZW5zaXRpdmUsIHcgPSB0aGlzLnNldHRpbmdzLnVuaXF1ZS50cmltX3doaXRlc3BhY2UsIGNiID0gdGhpcy5zZXR0aW5ncy51bmlxdWUuZHVwbGljYXRlLCB0O1xuXHRcdFx0XHRuID0gdG1wID0gdGhpcy5nZXRfc3RyaW5nKCdOZXcgbm9kZScpO1xuXHRcdFx0XHRkcGMgPSBbXTtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcGFyLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdHQgPSBtW3Bhci5jaGlsZHJlbltpXV0udGV4dDtcblx0XHRcdFx0XHRpZiAoIXMpIHtcblx0XHRcdFx0XHRcdHQgPSB0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh3KSB7XG5cdFx0XHRcdFx0XHR0ID0gdC5yZXBsYWNlKC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZywgJycpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkcGMucHVzaCh0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpID0gMTtcblx0XHRcdFx0dCA9IG47XG5cdFx0XHRcdGlmICghcykge1xuXHRcdFx0XHRcdHQgPSB0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHcpIHtcblx0XHRcdFx0XHR0ID0gdC5yZXBsYWNlKC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZywgJycpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHdoaWxlKCQuaW5BcnJheSh0LCBkcGMpICE9PSAtMSkge1xuXHRcdFx0XHRcdG4gPSBjYi5jYWxsKHRoaXMsIHRtcCwgKCsraSkpLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0dCA9IG47XG5cdFx0XHRcdFx0aWYgKCFzKSB7XG5cdFx0XHRcdFx0XHR0ID0gdC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodykge1xuXHRcdFx0XHRcdFx0dCA9IHQucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0bm9kZS50ZXh0ID0gbjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwYXJlbnQuY3JlYXRlX25vZGUuY2FsbCh0aGlzLCBwYXIsIG5vZGUsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCk7XG5cdFx0fTtcblx0fTtcblxuXHQvLyBpbmNsdWRlIHRoZSB1bmlxdWUgcGx1Z2luIGJ5IGRlZmF1bHRcblx0Ly8gJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2lucy5wdXNoKFwidW5pcXVlXCIpO1xuXG5cbi8qKlxuICogIyMjIFdob2xlcm93IHBsdWdpblxuICpcbiAqIE1ha2VzIGVhY2ggbm9kZSBhcHBlYXIgYmxvY2sgbGV2ZWwuIE1ha2luZyBzZWxlY3Rpb24gZWFzaWVyLiBNYXkgY2F1c2Ugc2xvdyBkb3duIGZvciBsYXJnZSB0cmVlcyBpbiBvbGQgYnJvd3NlcnMuXG4gKi9cblxuXHR2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG5cdGRpdi5zZXRBdHRyaWJ1dGUoJ3Vuc2VsZWN0YWJsZScsJ29uJyk7XG5cdGRpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCdwcmVzZW50YXRpb24nKTtcblx0ZGl2LmNsYXNzTmFtZSA9ICdqc3RyZWUtd2hvbGVyb3cnO1xuXHRkaXYuaW5uZXJIVE1MID0gJyYjMTYwOyc7XG5cdCQuanN0cmVlLnBsdWdpbnMud2hvbGVyb3cgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5iaW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFyZW50LmJpbmQuY2FsbCh0aGlzKTtcblxuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5vbigncmVhZHkuanN0cmVlIHNldF9zdGF0ZS5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHRoaXMuaGlkZV9kb3RzKCk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImluaXQuanN0cmVlIGxvYWRpbmcuanN0cmVlIHJlYWR5LmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdC8vZGl2LnN0eWxlLmhlaWdodCA9IHRoaXMuX2RhdGEuY29yZS5saV9oZWlnaHQgKyAncHgnO1xuXHRcdFx0XHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkuYWRkQ2xhc3MoJ2pzdHJlZS13aG9sZXJvdy11bCcpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJkZXNlbGVjdF9hbGwuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLXdob2xlcm93LWNsaWNrZWQnKS5yZW1vdmVDbGFzcygnanN0cmVlLXdob2xlcm93LWNsaWNrZWQnKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiY2hhbmdlZC5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtd2hvbGVyb3ctY2xpY2tlZCcpLnJlbW92ZUNsYXNzKCdqc3RyZWUtd2hvbGVyb3ctY2xpY2tlZCcpO1xuXHRcdFx0XHRcdFx0dmFyIHRtcCA9IGZhbHNlLCBpLCBqO1xuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZGF0YS5zZWxlY3RlZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShkYXRhLnNlbGVjdGVkW2ldLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW4oJy5qc3RyZWUtd2hvbGVyb3cnKS5hZGRDbGFzcygnanN0cmVlLXdob2xlcm93LWNsaWNrZWQnKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJvcGVuX25vZGUuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdHRoaXMuZ2V0X25vZGUoZGF0YS5ub2RlLCB0cnVlKS5maW5kKCcuanN0cmVlLWNsaWNrZWQnKS5wYXJlbnQoKS5jaGlsZHJlbignLmpzdHJlZS13aG9sZXJvdycpLmFkZENsYXNzKCdqc3RyZWUtd2hvbGVyb3ctY2xpY2tlZCcpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJob3Zlcl9ub2RlLmpzdHJlZSBkZWhvdmVyX25vZGUuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdGlmKGUudHlwZSA9PT0gXCJob3Zlcl9ub2RlXCIgJiYgdGhpcy5pc19kaXNhYmxlZChkYXRhLm5vZGUpKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0dGhpcy5nZXRfbm9kZShkYXRhLm5vZGUsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLXdob2xlcm93JylbZS50eXBlID09PSBcImhvdmVyX25vZGVcIj9cImFkZENsYXNzXCI6XCJyZW1vdmVDbGFzc1wiXSgnanN0cmVlLXdob2xlcm93LWhvdmVyZWQnKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiY29udGV4dG1lbnUuanN0cmVlXCIsIFwiLmpzdHJlZS13aG9sZXJvd1wiLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fZGF0YS5jb250ZXh0bWVudSkge1xuXHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdHZhciB0bXAgPSAkLkV2ZW50KCdjb250ZXh0bWVudScsIHsgbWV0YUtleSA6IGUubWV0YUtleSwgY3RybEtleSA6IGUuY3RybEtleSwgYWx0S2V5IDogZS5hbHRLZXksIHNoaWZ0S2V5IDogZS5zaGlmdEtleSwgcGFnZVggOiBlLnBhZ2VYLCBwYWdlWSA6IGUucGFnZVkgfSk7XG5cdFx0XHRcdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KFwiLmpzdHJlZS1ub2RlXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikuZmlyc3QoKS50cmlnZ2VyKHRtcCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC8qIVxuXHRcdFx0XHQub24oXCJtb3VzZWRvd24uanN0cmVlIHRvdWNoc3RhcnQuanN0cmVlXCIsIFwiLmpzdHJlZS13aG9sZXJvd1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYoZS50YXJnZXQgPT09IGUuY3VycmVudFRhcmdldCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgYSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KFwiLmpzdHJlZS1ub2RlXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIik7XG5cdFx0XHRcdFx0XHRcdGUudGFyZ2V0ID0gYVswXTtcblx0XHRcdFx0XHRcdFx0YS50cmlnZ2VyKGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdCovXG5cdFx0XHRcdC5vbihcImNsaWNrLmpzdHJlZVwiLCBcIi5qc3RyZWUtd2hvbGVyb3dcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHR2YXIgdG1wID0gJC5FdmVudCgnY2xpY2snLCB7IG1ldGFLZXkgOiBlLm1ldGFLZXksIGN0cmxLZXkgOiBlLmN0cmxLZXksIGFsdEtleSA6IGUuYWx0S2V5LCBzaGlmdEtleSA6IGUuc2hpZnRLZXkgfSk7XG5cdFx0XHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdChcIi5qc3RyZWUtbm9kZVwiKS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLmZpcnN0KCkudHJpZ2dlcih0bXApLmZvY3VzKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKFwiZGJsY2xpY2suanN0cmVlXCIsIFwiLmpzdHJlZS13aG9sZXJvd1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSAkLkV2ZW50KCdkYmxjbGljaycsIHsgbWV0YUtleSA6IGUubWV0YUtleSwgY3RybEtleSA6IGUuY3RybEtleSwgYWx0S2V5IDogZS5hbHRLZXksIHNoaWZ0S2V5IDogZS5zaGlmdEtleSB9KTtcblx0XHRcdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KFwiLmpzdHJlZS1ub2RlXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikuZmlyc3QoKS50cmlnZ2VyKHRtcCkuZm9jdXMoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQub24oXCJjbGljay5qc3RyZWVcIiwgXCIuanN0cmVlLWxlYWYgPiAuanN0cmVlLW9jbFwiLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0dmFyIHRtcCA9ICQuRXZlbnQoJ2NsaWNrJywgeyBtZXRhS2V5IDogZS5tZXRhS2V5LCBjdHJsS2V5IDogZS5jdHJsS2V5LCBhbHRLZXkgOiBlLmFsdEtleSwgc2hpZnRLZXkgOiBlLnNoaWZ0S2V5IH0pO1xuXHRcdFx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoXCIuanN0cmVlLW5vZGVcIikuY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5maXJzdCgpLnRyaWdnZXIodG1wKS5mb2N1cygpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJtb3VzZW92ZXIuanN0cmVlXCIsIFwiLmpzdHJlZS13aG9sZXJvdywgLmpzdHJlZS1pY29uXCIsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRpZighdGhpcy5pc19kaXNhYmxlZChlLmN1cnJlbnRUYXJnZXQpKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuaG92ZXJfbm9kZShlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJtb3VzZWxlYXZlLmpzdHJlZVwiLCBcIi5qc3RyZWUtbm9kZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmRlaG92ZXJfbm9kZShlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHR9O1xuXHRcdHRoaXMudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLndob2xlcm93KSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKFwiLmpzdHJlZS13aG9sZXJvd1wiKS5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHRcdHBhcmVudC50ZWFyZG93bi5jYWxsKHRoaXMpO1xuXHRcdH07XG5cdFx0dGhpcy5yZWRyYXdfbm9kZSA9IGZ1bmN0aW9uKG9iaiwgZGVlcCwgY2FsbGJhY2ssIGZvcmNlX3JlbmRlcikge1xuXHRcdFx0b2JqID0gcGFyZW50LnJlZHJhd19ub2RlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRpZihvYmopIHtcblx0XHRcdFx0dmFyIHRtcCA9IGRpdi5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdC8vdG1wLnN0eWxlLmhlaWdodCA9IHRoaXMuX2RhdGEuY29yZS5saV9oZWlnaHQgKyAncHgnO1xuXHRcdFx0XHRpZigkLmluQXJyYXkob2JqLmlkLCB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQpICE9PSAtMSkgeyB0bXAuY2xhc3NOYW1lICs9ICcganN0cmVlLXdob2xlcm93LWNsaWNrZWQnOyB9XG5cdFx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkICYmIHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkID09PSBvYmouaWQpIHsgdG1wLmNsYXNzTmFtZSArPSAnIGpzdHJlZS13aG9sZXJvdy1ob3ZlcmVkJzsgfVxuXHRcdFx0XHRvYmouaW5zZXJ0QmVmb3JlKHRtcCwgb2JqLmNoaWxkTm9kZXNbMF0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9O1xuXHR9O1xuXHQvLyBpbmNsdWRlIHRoZSB3aG9sZXJvdyBwbHVnaW4gYnkgZGVmYXVsdFxuXHQvLyAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zLnB1c2goXCJ3aG9sZXJvd1wiKTtcblx0aWYod2luZG93LmN1c3RvbUVsZW1lbnRzICYmIE9iamVjdCAmJiBPYmplY3QuY3JlYXRlKSB7XG5cdFx0dmFyIHByb3RvID0gT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUpO1xuXHRcdHByb3RvLmNyZWF0ZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjID0geyBjb3JlIDoge30sIHBsdWdpbnMgOiBbXSB9LCBpO1xuXHRcdFx0Zm9yKGkgaW4gJC5qc3RyZWUucGx1Z2lucykge1xuXHRcdFx0XHRpZigkLmpzdHJlZS5wbHVnaW5zLmhhc093blByb3BlcnR5KGkpICYmIHRoaXMuYXR0cmlidXRlc1tpXSkge1xuXHRcdFx0XHRcdGMucGx1Z2lucy5wdXNoKGkpO1xuXHRcdFx0XHRcdGlmKHRoaXMuZ2V0QXR0cmlidXRlKGkpICYmIEpTT04ucGFyc2UodGhpcy5nZXRBdHRyaWJ1dGUoaSkpKSB7XG5cdFx0XHRcdFx0XHRjW2ldID0gSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZShpKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRmb3IoaSBpbiAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlKSB7XG5cdFx0XHRcdGlmKCQuanN0cmVlLmRlZmF1bHRzLmNvcmUuaGFzT3duUHJvcGVydHkoaSkgJiYgdGhpcy5hdHRyaWJ1dGVzW2ldKSB7XG5cdFx0XHRcdFx0Yy5jb3JlW2ldID0gSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZShpKSkgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdCQodGhpcykuanN0cmVlKGMpO1xuXHRcdH07XG5cdFx0Ly8gcHJvdG8uYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKG5hbWUsIHByZXZpb3VzLCB2YWx1ZSkgeyB9O1xuXHRcdHRyeSB7XG5cdFx0XHR3aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidmFrYXRhLWpzdHJlZVwiLCBmdW5jdGlvbigpIHt9LCB7IHByb3RvdHlwZTogcHJvdG8gfSk7XG5cdFx0fSBjYXRjaCAoaWdub3JlKSB7IH1cblx0fVxuXG59KSk7Il0sInNvdXJjZVJvb3QiOiIifQ==