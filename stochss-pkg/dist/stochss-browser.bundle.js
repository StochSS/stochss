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
let app = __webpack_require__(/*! ../app */ "./client/app.js");
//let bootstrap = require('bootstrap');



let ajaxData = {
  "url" : function (node) {
    if(node.parent === null){
      return "stochss/models/browser-list/"
    }
    return "stochss/models/browser-list" + node.original._path
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
        var endpoint = path.join(app.getApiPath(), "/file/move", oldPath, '<--MoveTo-->', newDir, file)
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
            <h5 class="modal-title"> Help </h5>
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
      var endpoint = path.join(app.getApiPath(), "/file/delete", o.original._path)
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
      var endpoint = path.join(app.getApiPath(), "directory/duplicate", o.original._path);
    }else{
      var endpoint = path.join(app.getApiPath(), "model/duplicate", o.original._path);
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
    var endpoint = path.join(app.getApiPath(), "/model/to-spatial", o.original._path);
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
      var endpoint = path.join(app.getApiPath(), "/spatial/to-model", o.original._path);
    }else{
      var endpoint = path.join(app.getApiPath(), "sbml/to-model", o.original._path);
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
    var endpoint = path.join(app.getApiPath(), "model/to-sbml", o.original._path);
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
        var endpoint = path.join(app.getApiPath(), "/file/rename", o.original._path, "<--change-->", node.text)
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
    var endpoint = path.join(app.getApiPath(), "json-data", o.original._path);
    xhr({uri: endpoint}, function (err, response, body) {
      var resp = JSON.parse(body);
      self.exportToJsonFile(resp, o.original.text);
    });
  },
  getFileForExport: function (o) {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "file/download", o.original._path);
    xhr({uri: endpoint}, function (err, response, body) {
      self.exportToFile(body, o.original.text);
    });
  },
  getZipFileForExport: function (o) {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "file/download-zip/generate", o.original._path);
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
    var endpoint = path.join(app.getBasePath(), "/files", targetPath);
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
          var modelPath = path.join(app.getBasePath(), app.routePrefix, 'models/edit', parentPath, modelName);
          window.location.href = modelPath;
        }else{
          let dirName = input.value;
          var parentPath = o.original._path;
          let endpoint = path.join(app.getApiPath(), "/directory/create", parentPath, dirName);
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
              window.location.href = path.join(app.getBasePath(), "stochss/models/edit", o.original._path);
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
              window.location.href = path.join(app.getBasePath(), "stochss/workflow/selection", o.original._path);
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
              window.location.href = path.join(app.getBasePath(), "stochss/models/edit", o.original._path);
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
                  var endpoint = path.join(app.getApiPath(), "/models/to-notebook", o.original._path)
                  xhr({ uri: endpoint },
                        function (err, response, body) {
                    var node = $('#models-jstree').jstree().get_node(o.parent)
                    if(node.type === 'root'){
                      $('#models-jstree').jstree().refresh();
                    }else{
                      $('#models-jstree').jstree().refresh_node(node);
                    }
                    var _path = body.split(' ')[0].split('/home/jovyan/').pop()
                    var notebookPath = path.join(app.getBasePath(), "notebooks", _path)
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
              window.location.href = path.join(app.getBasePath(), "stochss/workflow/selection", o.original._path);
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
              window.location.href = path.join(app.getBasePath(), "stochss/workflow/edit/none", o.original._path);
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
              window.open(path.join(app.getBasePath(), "notebooks", o.original._path));
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
              window.open(path.join(app.getBasePath(), "lab/tree", filePath), '_blank')
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
        window.location.href = path.join(app.getBasePath(), "stochss/models/edit", _path);
      }else if(file.endsWith('.ipynb')){
        var notebookPath = path.join(app.getBasePath(), "notebooks", _path)
        window.open(notebookPath, '_blank')
      }else if(file.endsWith('.sbml')){
        var openPath = path.join(app.getBasePath(), "lab/tree", _path)
        window.open(openPath, '_blank')
      }else if(file.endsWith('.wkfl')){
        window.location.href = path.join(app.getBasePath(), "stochss/workflow/edit/none", _path);
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Csection class=\"page\"\u003E\u003Cdiv\u003E\u003Ch2 class=\"inline\"\u003EFile Browser\u003C\u002Fh2\u003E\u003Cbutton class=\"big-tip btn information-btn help\" data-hook=\"file-browser-help\"\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"far\" data-icon=\"question-circle\" class=\"svg-inline--fa fa-question-circle fa-w-16\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 512 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"alert-warning collapse\" data-hook=\"extension-warning\"\u003EYou should avoid changing the file extension unless you know what you are doing!\u003C\u002Fdiv\u003E\u003Cdiv class=\"alert-warning collapse\" data-hook=\"rename-warning\"\u003EMESSAGE\u003C\u002Fdiv\u003E\u003Cdiv id=\"models-jstree\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" data-hook=\"refresh-jstree\"\u003ERefresh\u003C\u002Fbutton\u003E\u003C\u002Fsection\u003E";;return pug_html;};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL2ZpbGUtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL3BhZ2VzL2ZpbGVCcm93c2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanN0cmVlL2Rpc3QvanN0cmVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRLG9CQUFvQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBLDBCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7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RztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6QjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsU0FBUyxjQUFjO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxLO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEs7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxTQUFTLGNBQWM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEs7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxjQUFjO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxLO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLGNBQWM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsSztBQUNYO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWM7QUFDdkI7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsU0FBUyxjQUFjO0FBQ3ZCO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsbUNBQW1DOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGVBQWUsYUFBYTtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLEs7QUFDYjtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWU7QUFDZiw4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZTtBQUNmLDhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixnQkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsT0FBTztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxjQUFjLE1BQU07QUFDcEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxjQUFjLE1BQU07QUFDcEIsY0FBYyxRQUFRO0FBQ3RCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsY0FBYyxNQUFNO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxjQUFjLE1BQU07QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLGNBQWMsTUFBTTtBQUNwQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsY0FBYyxNQUFNO0FBQ3BCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkU7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBLFFBQVE7QUFDUixnQ0FBZ0MscUJBQXFCLEVBQUU7QUFDdkQ7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFN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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxSEFBcUg7QUFDN0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNIQUFzSDtBQUM5STtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUU7QUFDRjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0E7QUFDQSxrQ0FBa0MscUZBQXFGO0FBQ3ZIO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxxQ0FBcUMscUZBQXFGO0FBQzFIO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxrQ0FBa0MscUZBQXFGO0FBQ3ZIO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCw2Q0FBNkM7QUFDekcsdUVBQXVFLDZDQUE2QztBQUNwSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksVUFBVSxnQkFBZ0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0VBQXdFO0FBQ3hFO0FBQ0EsOERBQThELEdBQUcsbUJBQW1CO0FBQ3BGLEdBQUcsaUJBQWlCO0FBQ3BCOztBQUVBLENBQUMsRyIsImZpbGUiOiJzdG9jaHNzLWJyb3dzZXIuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbiBcdC8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcImJyb3dzZXJcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL2NsaWVudC9wYWdlcy9maWxlLWJyb3dzZXIuanNcIixcImNvbW1vblwiXSk7XG4gXHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIHJlYWR5XG4gXHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiIsImxldCBqc3RyZWUgPSByZXF1aXJlKCdqc3RyZWUnKTtcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xubGV0IHhociA9IHJlcXVpcmUoJ3hocicpO1xubGV0IFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcGFnZXMvZmlsZUJyb3dzZXIucHVnJyk7XG5sZXQgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xubGV0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuLy9sZXQgYm9vdHN0cmFwID0gcmVxdWlyZSgnYm9vdHN0cmFwJyk7XG5cbmltcG9ydCBpbml0UGFnZSBmcm9tICcuL3BhZ2UuanMnO1xuXG5sZXQgYWpheERhdGEgPSB7XG4gIFwidXJsXCIgOiBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmKG5vZGUucGFyZW50ID09PSBudWxsKXtcbiAgICAgIHJldHVybiBcInN0b2Noc3MvbW9kZWxzL2Jyb3dzZXItbGlzdC9cIlxuICAgIH1cbiAgICByZXR1cm4gXCJzdG9jaHNzL21vZGVscy9icm93c2VyLWxpc3RcIiArIG5vZGUub3JpZ2luYWwuX3BhdGhcbiAgfSxcbiAgXCJkYXRhVHlwZVwiIDogXCJqc29uXCIsXG4gIFwiZGF0YVwiIDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4geyAnaWQnIDogbm9kZS5pZH1cbiAgfSxcbn1cblxubGV0IHRyZWVTZXR0aW5ncyA9IHtcbiAgJ3BsdWdpbnMnOiBbXG4gICAgJ3R5cGVzJyxcbiAgICAnd2hvbGVyb3cnLFxuICAgICdjaGFuZ2VkJyxcbiAgICAnY29udGV4dG1lbnUnLFxuICAgICdkbmQnLFxuICBdLFxuICAnY29yZSc6IHtcbiAgICAnbXVsdGlwbGUnIDogZmFsc2UsXG4gICAgJ2FuaW1hdGlvbic6IDAsXG4gICAgJ2NoZWNrX2NhbGxiYWNrJzogZnVuY3Rpb24gKG9wLCBub2RlLCBwYXIsIHBvcywgbW9yZSkge1xuICAgICAgaWYob3AgPT09ICdtb3ZlX25vZGUnICYmIG1vcmUgJiYgbW9yZS5yZWYgJiYgbW9yZS5yZWYudHlwZSAmJiAhKG1vcmUucmVmLnR5cGUgPT0gJ2ZvbGRlcicgfHwgbW9yZS5yZWYudHlwZSA9PSAncm9vdCcpKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBpZihvcCA9PT0gJ21vdmVfbm9kZScgJiYgbW9yZSAmJiBtb3JlLnJlZiAmJiBtb3JlLnJlZi50eXBlICYmIG1vcmUucmVmLnR5cGUgPT09ICdmb2xkZXInKXtcbiAgICAgICAgaWYoIW1vcmUucmVmLnN0YXRlLmxvYWRlZCl7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGV4aXN0cyA9IGZhbHNlXG4gICAgICAgIHZhciBCcmVha0V4Y2VwdGlvbiA9IHt9XG4gICAgICAgIHRyeXtcbiAgICAgICAgICBtb3JlLnJlZi5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgdmFyIGNoaWxkX25vZGUgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKGNoaWxkKVxuICAgICAgICAgICAgZXhpc3RzID0gY2hpbGRfbm9kZS50ZXh0ID09PSBub2RlLnRleHRcbiAgICAgICAgICAgIGlmKGV4aXN0cyl7XG4gICAgICAgICAgICAgIHRocm93IEJyZWFrRXhjZXB0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1jYXRjaHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmKG9wID09PSAnbW92ZV9ub2RlJyAmJiBtb3JlICYmIChwb3MgIT0gMCB8fCBtb3JlLnBvcyAhPT0gXCJpXCIpICYmICFtb3JlLmNvcmUpe1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmKG9wID09PSAnbW92ZV9ub2RlJyAmJiBtb3JlICYmIG1vcmUuY29yZSkge1xuICAgICAgICB2YXIgbmV3RGlyID0gcGFyLm9yaWdpbmFsLl9wYXRoXG4gICAgICAgIHZhciBmaWxlID0gbm9kZS5vcmlnaW5hbC5fcGF0aC5zcGxpdCgnLycpLnBvcCgpXG4gICAgICAgIHZhciBvbGRQYXRoID0gbm9kZS5vcmlnaW5hbC5fcGF0aFxuICAgICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvZmlsZS9tb3ZlXCIsIG9sZFBhdGgsICc8LS1Nb3ZlVG8tLT4nLCBuZXdEaXIsIGZpbGUpXG4gICAgICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgICBpZihib2R5LnN0YXJ0c1dpdGgoXCJTdWNjZXNzIVwiKSkge1xuICAgICAgICAgICAgbm9kZS5vcmlnaW5hbC5fcGF0aCA9IHBhdGguam9pbihuZXdEaXIsIGZpbGUpXG4gICAgICAgICAgICBpZihwYXIudHlwZSA9PT0gJ3Jvb3QnKXtcbiAgICAgICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoKClcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShwYXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG4gICAgJ3RoZW1lcyc6IHtcbiAgICAgICdzdHJpcGVzJzogdHJ1ZSxcbiAgICAgICd2YXJpYW50JzogJ2xhcmdlJ1xuICAgIH0sXG4gICAgJ2RhdGEnOiBhamF4RGF0YSxcbiAgfSxcbiAgJ3R5cGVzJyA6IHtcbiAgICAncm9vdCcgOiB7XG4gICAgICBcImljb25cIjogXCJqc3RyZWUtaWNvbiBqc3RyZWUtZm9sZGVyXCJcbiAgICB9LFxuICAgICdmb2xkZXInIDoge1xuICAgICAgXCJpY29uXCI6IFwianN0cmVlLWljb24ganN0cmVlLWZvbGRlclwiXG4gICAgfSxcbiAgICAnc3BhdGlhbCcgOiB7XG4gICAgICBcImljb25cIjogXCJqc3RyZWUtaWNvbiBqc3RyZWUtZmlsZVwiXG4gICAgfSxcbiAgICAnbm9uc3BhdGlhbCcgOiB7XG4gICAgICBcImljb25cIjogXCJqc3RyZWUtaWNvbiBqc3RyZWUtZmlsZVwiXG4gICAgfSxcbiAgICAnd29ya2Zsb3cnIDoge1xuICAgICAgXCJpY29uXCI6IFwianN0cmVlLWljb24ganN0cmVlLWZpbGVcIlxuICAgIH0sXG4gICAgJ25vdGVib29rJyA6IHtcbiAgICAgIFwiaWNvblwiOiBcImpzdHJlZS1pY29uIGpzdHJlZS1maWxlXCJcbiAgICB9LFxuICAgICdtZXNoJyA6IHtcbiAgICAgIFwiaWNvblwiOiBcImpzdHJlZS1pY29uIGpzdHJlZS1maWxlXCJcbiAgICB9LFxuICAgICdzYm1sLW1vZGVsJyA6IHtcbiAgICAgIFwiaWNvblwiOiBcImpzdHJlZS1pY29uIGpzdHJlZS1maWxlXCJcbiAgICB9LFxuICAgICdvdGhlcicgOiB7XG4gICAgICBcImljb25cIjogXCJqc3RyZWUtaWNvbiBqc3RyZWUtZmlsZVwiXG4gICAgfSxcbiAgfSwgIFxufVxuXG5sZXQgb3BlcmF0aW9uSW5mb01vZGFsSHRtbCA9ICgpID0+IHtcbiAgbGV0IGZpbGVCcm93c2VySGVscE1lc3NhZ2UgPSBgXG4gICAgPHA+PGI+T3Blbi9FZGl0IGEgRmlsZTwvYj46IERvdWJsZS1jbGljayBvbiBhIGZpbGUgb3IgcmlnaHQtY2xpY2sgb24gYSBmaWxlIGFuZCBjbGljayBPcGVuL0VkaXQuICBcbiAgICA8Yj5Ob3RlPC9iPjogU29tZSBmaWxlcyB3aWxsIG9wZW4gaW4gYSBuZXcgdGFiIHNvIHlvdSBtYXkgd2FudCB0byB0dXJuIG9mZiB0aGUgcG9wLXVwIGJsb2NrZXIuPC9wPlxuICAgIDxwPjxiPk9wZW4gRGlyZWN0b3J5PC9iPjogQ2xpY2sgb24gdGhlIGFycm93IG5leHQgdG8gdGhlIGRpcmVjdG9yeSBvciBkb3VibGUtY2xpY2sgb24gdGhlIGRpcmVjdG9yeS48L3A+XG4gICAgPHA+PGI+Q3JlYXRlIGEgRGlyZWN0b3J5L01vZGVsPC9iPjogUmlnaHQtY2xpY2sgb24gYSBkaXJlY3RvcnksIGNsaWNrIE5ldyBEaXJlY3RvcnkvTmV3IE1vZGVsLCBhbmQgZW50ZXIgdGhlIG5hbWUgb2YgZGlyZWN0b3J5L21vZGVsIG9yIHBhdGguICBcbiAgICBGb3IgbW9kZWxzIHlvdSB3aWxsIG5lZWQgdG8gY2xpY2sgb24gdGhlIHR5cGUgb2YgbW9kZWwgeW91IHdpc2ggdG8gY3JlYXRlIGJlZm9yZSBlbnRlcmluZyB0aGUgbmFtZSBvciBwYXRoLjwvcD5cbiAgICA8cD48Yj5DcmVhdGUgYSBXb3JrZmxvdzwvYj46IFJpZ2h0LWNsaWNrIG9uIGEgbW9kZWwgYW5kIGNsaWNrIE5ldyBXb3JrZmxvdywgdGhpcyB0YWtlcyB5b3UgdG8gdGhlIHdvcmtmbG93IHNlbGVjdGlvbiBwYWdlLiAgXG4gICAgRnJvbSB0aGUgd29ya2Zsb3cgc2VsZWN0aW9uIHBhZ2UsIGNsaWNrIG9uIG9uZSBvZiB0aGUgbGlzdGVkIHdvcmtmbG93cy48L3A+XG4gICAgPHA+PGI+Q29udmVydCBhIEZpbGU8L2I+OiBSaWdodC1jbGljayBvbiBhIE1vZGVsL1NCTUwsIGNsaWNrIENvbnZlcnQsIGFuZCBjbGljayBvbiB0aGUgZGVzaXJlZCBDb252ZXJ0IHRvIG9wdGlvbi4gIFxuICAgIE1vZGVsIGZpbGVzIGNhbiBiZSBjb252ZXJ0ZWQgdG8gU3BhdGlhbCBNb2RlbHMsIE5vdGVib29rcywgb3IgU0JNTCBmaWxlcy4gIFxuICAgIFNwYXRpYWwgTW9kZWxzIGFuZCBTQk1MIGZpbGUgY2FuIGJlIGNvbnZlcnRlZCB0byBNb2RlbHMuICBcbiAgICA8Yj5Ob3RlPC9iPjogTm90ZWJvb2tzIHdpbGwgb3BlbiBpbiBhIG5ldyB0YWIgc28geW91IG1heSB3YW50IHRvIHR1cm4gb2ZmIHRoZSBwb3AtdXAgYmxvY2tlci48L3A+XG4gICAgPHA+PGI+TW92ZSBGaWxlIG9yIERpcmVjdG9yeTwvYj46IENsaWNrIGFuZCBkcmFnIHRoZSBmaWxlIG9yIGRpcmVjdG9yeSB0byB0aGUgbmV3IGxvY2F0aW9uLiAgXG4gICAgWW91IGNhbiBvbmx5IG1vdmUgYW4gaXRlbSB0byBhIGRpcmVjdG9yeSBpZiB0aGVyZSBpc24ndCBhIGZpbGUgb3IgZGlyZWN0b3J5IHdpdGggdGhlIHNhbWUgbmFtZSBpbiB0aGF0IGxvY2F0aW9uLjwvcD5cbiAgICA8cD48Yj5Eb3dubG9hZCBhIE1vZGVsL05vdGVib29rL1NCTUwgRmlsZTwvYj46IFJpZ2h0LWNsaWNrIG9uIHRoZSBmaWxlIGFuZCBjbGljayBkb3dubG9hZC48L3A+XG4gICAgPHA+PGI+UmVuYW1lIEZpbGUvRGlyZWN0b3J5PC9iPjogUmlnaHQtY2xpY2sgb24gYSBmaWxlL2RpcmVjdG9yeSwgY2xpY2sgcmVuYW1lLCBhbmQgZW50ZXIgdGhlIG5ldyBuYW1lLjwvcD5cbiAgICA8cD48Yj5EdXBsaWNhdGUvRGVsZXRlIEEgRmlsZS9EaXJlY3Rvcnk8L2I+OiBSaWdodC1jbGljayBvbiB0aGUgZmlsZS9kaXJlY3RvcnkgYW5kIGNsaWNrIER1cGxpY2F0ZS9EZWxldGUuPC9wPlxuICBgO1xuICBcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwib3BlcmF0aW9uSW5mb01vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50IGluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPiBIZWxwIDwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8cD4gJHtmaWxlQnJvd3NlckhlbHBNZXNzYWdlfSA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCBcbn1cblxuLy8gVXNpbmcgYSBib290c3RyYXAgbW9kYWwgdG8gaW5wdXQgbW9kZWwgbmFtZXMgZm9yIG5vd1xubGV0IHJlbmRlckNyZWF0ZU1vZGFsSHRtbCA9IChpc01vZGVsLCBpc1NwYXRpYWwpID0+IHtcbiAgdmFyIHRpdGxlVGV4dCA9ICdEaXJlY3RvcnknO1xuICBpZihpc01vZGVsKXtcbiAgICB0aXRsZVRleHQgPSBpc1NwYXRpYWwgPyAnU3BhdGlhbCBNb2RlbCcgOiAnTm9uLVNwYXRpYWwgTW9kZWwnO1xuICB9XG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cIm5ld01vZGFsTW9kZWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPk5ldyAke3RpdGxlVGV4dH08L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm1vZGVsTmFtZUlucHV0XCI+TmFtZTo8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJtb2RlbE5hbWVJbnB1dFwiIG5hbWU9XCJtb2RlbE5hbWVJbnB1dFwiIHNpemU9XCIzMFwiIGF1dG9mb2N1cz5cblx0ICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBvay1tb2RlbC1idG5cIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5sZXQgc2JtbFRvTW9kZWxIdG1sID0gKHRpdGxlLCBlcnJvcnMpID0+IHtcbiAgZm9yKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xuICAgIGlmKGVycm9yc1tpXS5zdGFydHNXaXRoKFwiU0JNTCBFcnJvclwiKSB8fCBlcnJvcnNbaV0uc3RhcnRzV2l0aChcIkVycm9yXCIpKXtcbiAgICAgIGVycm9yc1tpXSA9IFwiPGI+RXJyb3I8L2I+OiBcIiArIGVycm9yc1tpXVxuICAgIH1lbHNle1xuICAgICAgZXJyb3JzW2ldID0gXCI8Yj5XYXJuaW5nPC9iPjogXCIgKyBlcnJvcnNbaV1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJzYm1sVG9Nb2RlbE1vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50IGluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPiAke3RpdGxlfSA8L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgPHA+ICR7ZXJyb3JzLmpvaW4oXCI8YnI+XCIpfSA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5sZXQgZGVsZXRlRmlsZUh0bWwgPSAoZmlsZVR5cGUpID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwiZGVsZXRlRmlsZU1vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50IGluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPiBQZXJtYW5lbnRseSBkZWxldGUgdGhpcyAke2ZpbGVUeXBlfT8gPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgeWVzLW1vZGFsLWJ0blwiPlllczwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Tm88L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5sZXQgRmlsZUJyb3dzZXIgPSBQYWdlVmlldy5leHRlbmQoe1xuICBwYWdlVGl0bGU6ICdTdG9jaFNTIHwgRmlsZSBCcm93c2VyJyxcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZWZyZXNoLWpzdHJlZV0nIDogJ3JlZnJlc2hKU1RyZWUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWZpbGUtYnJvd3Nlci1oZWxwXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgbW9kYWwgPSAkKG9wZXJhdGlvbkluZm9Nb2RhbEh0bWwoKSkubW9kYWwoKTtcbiAgICB9LFxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLnNldHVwSnN0cmVlKCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnJlZnJlc2hJbml0aWFsSlNUcmVlKCk7XG4gICAgfSwgMzAwMCk7XG4gIH0sXG4gIHJlZnJlc2hKU1RyZWU6IGZ1bmN0aW9uICgpIHtcbiAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICB9LFxuICByZWZyZXNoSW5pdGlhbEpTVHJlZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY291bnQgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLl9tb2RlbC5kYXRhWycjJ10uY2hpbGRyZW4ubGVuZ3RoO1xuICAgIGlmKGNvdW50ID09IDApIHtcbiAgICAgIHNlbGYucmVmcmVzaEpTVHJlZSgpO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYucmVmcmVzaEluaXRpYWxKU1RyZWUoKTtcbiAgICAgIH0sIDMwMDApO1xuICAgIH1cbiAgfSxcbiAgZGVsZXRlRmlsZTogZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgZmlsZVR5cGUgPSBvLnR5cGVcbiAgICBpZihmaWxlVHlwZSA9PT0gXCJub25zcGF0aWFsXCIpXG4gICAgICBmaWxlVHlwZSA9IFwibW9kZWxcIjtcbiAgICBlbHNlIGlmKGZpbGVUeXBlID09PSBcInNwYXRpYWxcIilcbiAgICAgIGZpbGVUeXBlID0gXCJzcGF0aWFsIG1vZGVsXCJcbiAgICBlbHNlIGlmKGZpbGVUeXBlID09PSBcInNibWwtbW9kZWxcIilcbiAgICAgIGZpbGVUeXBlID0gXCJzYm1sIG1vZGVsXCJcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVsZXRlRmlsZU1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWxldGVGaWxlTW9kYWwnKS5yZW1vdmUoKVxuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKGRlbGV0ZUZpbGVIdG1sKGZpbGVUeXBlKSkubW9kYWwoKTtcbiAgICBsZXQgeWVzQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbGV0ZUZpbGVNb2RhbCAueWVzLW1vZGFsLWJ0bicpO1xuICAgIHllc0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvZmlsZS9kZWxldGVcIiwgby5vcmlnaW5hbC5fcGF0aClcbiAgICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgdmFyIG5vZGUgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKG8ucGFyZW50KTtcbiAgICAgICAgaWYobm9kZS50eXBlID09PSBcInJvb3RcIil7XG4gICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKVxuICAgIH0pO1xuICB9LFxuICBkdXBsaWNhdGVGaWxlT3JEaXJlY3Rvcnk6IGZ1bmN0aW9uKG8sIGlzRGlyZWN0b3J5KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBwYXJlbnRJRCA9IG8ucGFyZW50O1xuICAgIGlmKGlzRGlyZWN0b3J5KXtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcImRpcmVjdG9yeS9kdXBsaWNhdGVcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgfWVsc2V7XG4gICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCJtb2RlbC9kdXBsaWNhdGVcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgfVxuICAgIHhocih7dXJpOiBlbmRwb2ludH0sIFxuICAgICAgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgdmFyIG5vZGUgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKHBhcmVudElEKTtcbiAgICAgICAgaWYobm9kZS50eXBlID09PSBcInJvb3RcIil7XG4gICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoKClcbiAgICAgICAgfWVsc2V7ICAgICAgICAgIFxuICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfSxcbiAgdG9TcGF0aWFsOiBmdW5jdGlvbiAobykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcGFyZW50SUQgPSBvLnBhcmVudDtcbiAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvbW9kZWwvdG8tc3BhdGlhbFwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBcbiAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShwYXJlbnRJRCk7XG4gICAgICAgIGlmKG5vZGUudHlwZSA9PT0gXCJyb290XCIpe1xuICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpXG4gICAgICAgIH1lbHNleyAgICAgICAgICBcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH0sXG4gIHRvTW9kZWw6IGZ1bmN0aW9uIChvLCBmcm9tKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBwYXJlbnRJRCA9IG8ucGFyZW50O1xuICAgIGlmKGZyb20gPT09IFwiU3BhdGlhbFwiKXtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi9zcGF0aWFsL3RvLW1vZGVsXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIH1lbHNle1xuICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwic2JtbC90by1tb2RlbFwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICB9XG4gICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgXG4gICAgICBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICB2YXIgbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUocGFyZW50SUQpO1xuICAgICAgICBpZihub2RlLnR5cGUgPT09IFwicm9vdFwiKXtcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICB9ZWxzZXsgICAgICAgICAgXG4gICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoZnJvbSA9PT0gXCJTQk1MXCIpe1xuICAgICAgICAgIHZhciB0aXRsZSA9IFwiXCJcbiAgICAgICAgICB2YXIgcmVzcCA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgICB2YXIgbXNnID0gcmVzcC5tZXNzYWdlXG4gICAgICAgICAgdmFyIGVycm9ycyA9IHJlc3AuZXJyb3JzXG4gICAgICAgICAgbGV0IG1vZGFsID0gJChzYm1sVG9Nb2RlbEh0bWwobXNnLCBlcnJvcnMpKS5tb2RhbCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfSxcbiAgdG9TQk1MOiBmdW5jdGlvbiAobykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcGFyZW50SUQgPSBvLnBhcmVudDtcbiAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCJtb2RlbC90by1zYm1sXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIHhocih7dXJpOiBlbmRwb2ludH0sXG4gICAgICBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICB2YXIgbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUocGFyZW50SUQpO1xuICAgICAgICBpZihub2RlLnR5cGUgPT09IFwicm9vdFwiKXtcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICB9ZWxzZXsgICAgICAgICAgXG4gICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9LFxuICByZW5hbWVOb2RlOiBmdW5jdGlvbiAobykge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciB0ZXh0ID0gby50ZXh0O1xuICAgIHZhciBwYXJlbnQgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKG8ucGFyZW50KVxuICAgIHZhciBleHRlbnNpb25XYXJuaW5nID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdleHRlbnNpb24td2FybmluZycpKTtcbiAgICB2YXIgbmFtZVdhcm5pbmcgPSAkKHRoaXMucXVlcnlCeUhvb2soJ3JlbmFtZS13YXJuaW5nJykpO1xuICAgIGV4dGVuc2lvbldhcm5pbmcuY29sbGFwc2UoJ3Nob3cnKVxuICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZWRpdChvLCBudWxsLCBmdW5jdGlvbihub2RlLCBzdGF0dXMpIHtcbiAgICAgIGlmKHRleHQgIT0gbm9kZS50ZXh0KXtcbiAgICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiL2ZpbGUvcmVuYW1lXCIsIG8ub3JpZ2luYWwuX3BhdGgsIFwiPC0tY2hhbmdlLS0+XCIsIG5vZGUudGV4dClcbiAgICAgICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpe1xuICAgICAgICAgIHZhciByZXNwID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICAgIGlmKCFyZXNwLm1lc3NhZ2Uuc3RhcnRzV2l0aCgnU3VjY2VzcyEnKSkge1xuICAgICAgICAgICAgbmFtZVdhcm5pbmcuaHRtbChyZXNwLm1lc3NhZ2UpXG4gICAgICAgICAgICBuYW1lV2FybmluZy5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub2RlLm9yaWdpbmFsLl9wYXRoID0gcmVzcC5fcGF0aFxuICAgICAgICAgIGlmKHBhcmVudC50eXBlID09PSBcInJvb3RcIil7XG4gICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICAgIH1lbHNleyAgICAgICAgICBcbiAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKHBhcmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZXh0ZW5zaW9uV2FybmluZy5jb2xsYXBzZSgnaGlkZScpO1xuICAgICAgbmFtZVdhcm5pbmcuY29sbGFwc2UoJ2hpZGUnKTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0SnNvbkZpbGVGb3JFeHBvcnQ6IGZ1bmN0aW9uIChvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcImpzb24tZGF0YVwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgdmFyIHJlc3AgPSBKU09OLnBhcnNlKGJvZHkpO1xuICAgICAgc2VsZi5leHBvcnRUb0pzb25GaWxlKHJlc3AsIG8ub3JpZ2luYWwudGV4dCk7XG4gICAgfSk7XG4gIH0sXG4gIGdldEZpbGVGb3JFeHBvcnQ6IGZ1bmN0aW9uIChvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcImZpbGUvZG93bmxvYWRcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgIHNlbGYuZXhwb3J0VG9GaWxlKGJvZHksIG8ub3JpZ2luYWwudGV4dCk7XG4gICAgfSk7XG4gIH0sXG4gIGdldFppcEZpbGVGb3JFeHBvcnQ6IGZ1bmN0aW9uIChvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcImZpbGUvZG93bmxvYWQtemlwL2dlbmVyYXRlXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICB2YXIgZmlsZVBhdGggPSBib2R5LnNwbGl0KCcvaG9tZS9qb3Z5YW4nKS5wb3AoKVxuICAgICAgdmFyIG5vZGUgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKG8ucGFyZW50KTtcbiAgICAgIGlmKG5vZGUudHlwZSA9PT0gXCJyb290XCIpe1xuICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuZXhwb3J0VG9aaXBGaWxlKGZpbGVQYXRoKVxuICAgIH0pO1xuICB9LFxuICBleHBvcnRUb0pzb25GaWxlOiBmdW5jdGlvbiAoZmlsZURhdGEsIGZpbGVOYW1lKSB7XG4gICAgbGV0IGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShmaWxlRGF0YSk7XG4gICAgbGV0IGRhdGFVUkkgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhU3RyKTtcbiAgICBsZXQgZXhwb3J0RmlsZURlZmF1bHROYW1lID0gZmlsZU5hbWVcblxuICAgIGxldCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVVJJKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZXhwb3J0RmlsZURlZmF1bHROYW1lKTtcbiAgICBsaW5rRWxlbWVudC5jbGljaygpO1xuICB9LFxuICBleHBvcnRUb0ZpbGU6IGZ1bmN0aW9uIChmaWxlRGF0YSwgZmlsZU5hbWUpIHtcbiAgICBsZXQgZGF0YVVSSSA9ICdkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KGZpbGVEYXRhKTtcblxuICAgIGxldCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVVJJKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZU5hbWUpO1xuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XG4gIH0sXG4gIGV4cG9ydFRvWmlwRmlsZTogZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgdGFyZ2V0UGF0aCA9IG9cbiAgICBpZihvLm9yaWdpbmFsKXtcbiAgICAgIHRhcmdldFBhdGggPSBvLm9yaWdpbmFsLl9wYXRoXG4gICAgfVxuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCIvZmlsZXNcIiwgdGFyZ2V0UGF0aCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBlbmRwb2ludFxuICB9LFxuICBuZXdNb2RlbE9yRGlyZWN0b3J5OiBmdW5jdGlvbiAobywgaXNNb2RlbCwgaXNTcGF0aWFsKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ld01vZGFsTW9kZWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ld01vZGFsTW9kZWwnKS5yZW1vdmUoKVxuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKHJlbmRlckNyZWF0ZU1vZGFsSHRtbChpc01vZGVsLCBpc1NwYXRpYWwpKS5tb2RhbCgpO1xuICAgIGxldCBva0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXdNb2RhbE1vZGVsIC5vay1tb2RlbC1idG4nKTtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3TW9kYWxNb2RlbCAjbW9kZWxOYW1lSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGV0IG1vZGVsTmFtZTtcbiAgICBva0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoQm9vbGVhbihpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgaWYoaXNNb2RlbCkge1xuICAgICAgICAgIGxldCBtb2RlbE5hbWUgPSBpbnB1dC52YWx1ZSArICcubWRsJztcbiAgICAgICAgICB2YXIgcGFyZW50UGF0aCA9IG8ub3JpZ2luYWwuX3BhdGhcbiAgICAgICAgICB2YXIgbW9kZWxQYXRoID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBhcHAucm91dGVQcmVmaXgsICdtb2RlbHMvZWRpdCcsIHBhcmVudFBhdGgsIG1vZGVsTmFtZSk7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBtb2RlbFBhdGg7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGxldCBkaXJOYW1lID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgdmFyIHBhcmVudFBhdGggPSBvLm9yaWdpbmFsLl9wYXRoO1xuICAgICAgICAgIGxldCBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi9kaXJlY3RvcnkvY3JlYXRlXCIsIHBhcmVudFBhdGgsIGRpck5hbWUpO1xuICAgICAgICAgIHhocih7dXJpOmVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShvKTtcbiAgICAgICAgICAgIGlmKG5vZGUudHlwZSA9PT0gXCJyb290XCIpe1xuICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICAgICAgfWVsc2V7ICAgICAgICAgIFxuICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBtb2RhbC5tb2RhbCgnaGlkZScpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgc2V0dXBKc3RyZWU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgJC5qc3RyZWUuZGVmYXVsdHMuY29udGV4dG1lbnUuaXRlbXMgPSAobywgY2IpID0+IHtcbiAgICAgIGlmIChvLnR5cGUgPT09ICdyb290Jyl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgXCJSZWZyZXNoXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlZnJlc2hcIixcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2NsYXNzXCIgOiBcImZvbnQtd2VpZ2h0LWJvbGRcIixcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogdHJ1ZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiTmV3X0RpcmVjdG9yeVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiTmV3IERpcmVjdG9yeVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYubmV3TW9kZWxPckRpcmVjdG9yeShvLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJOZXdfbW9kZWxcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiTmV3IE1vZGVsXCIsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzdWJtZW51XCIgOiB7XG4gICAgICAgICAgICAgIFwic3BhdGlhbFwiIDoge1xuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiU3BhdGlhbFwiLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIm5vbnNwYXRpYWxcIiA6IHsgXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJOb24tU3BhdGlhbFwiLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYubmV3TW9kZWxPckRpcmVjdG9yeShvLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG8udHlwZSA9PT0gICdmb2xkZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgXCJSZWZyZXNoXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlZnJlc2hcIixcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2NsYXNzXCIgOiBcImZvbnQtd2VpZ2h0LWJvbGRcIixcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogdHJ1ZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiTmV3X0RpcmVjdG9yeVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiTmV3IERpcmVjdG9yeVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYubmV3TW9kZWxPckRpcmVjdG9yeShvLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJOZXdfbW9kZWxcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiTmV3IE1vZGVsXCIsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzdWJtZW51XCIgOiB7XG4gICAgICAgICAgICAgIFwic3BhdGlhbFwiIDoge1xuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiU3BhdGlhbFwiLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIm5vbnNwYXRpYWxcIiA6IHsgXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJOb24tU3BhdGlhbFwiLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYubmV3TW9kZWxPckRpcmVjdG9yeShvLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEb3dubG9hZFwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRG93bmxvYWQgYXMgLnppcFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZ2V0WmlwRmlsZUZvckV4cG9ydChvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiUmVuYW1lXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJSZW5hbWVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLnJlbmFtZU5vZGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkR1cGxpY2F0ZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kdXBsaWNhdGVGaWxlT3JEaXJlY3RvcnkobywgdHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRGVsZXRlXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRlbGV0ZVwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnc3BhdGlhbCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBcIkVkaXRcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogdHJ1ZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIiA6IFwiZm9udC13ZWlnaHQtYm9sZGVyXCIsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkVkaXRcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJzdG9jaHNzL21vZGVscy9lZGl0XCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJDb252ZXJ0XCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkNvbnZlcnRcIixcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInN1Ym1lbnVcIiA6IHtcbiAgICAgICAgICAgICAgXCJDb252ZXJ0IHRvIE1vZGVsXCIgOiB7XG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiQ29udmVydCB0byBOb24gU3BhdGlhbFwiLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgc2VsZi50b01vZGVsKG8sIFwiU3BhdGlhbFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiQ29udmVydCB0byBOb3RlYm9va1wiIDoge1xuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiQ29udmVydCB0byBOb3RlYm9va1wiLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiTmV3IFdvcmtmbG93XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJOZXcgV29ya2Zsb3dcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJzdG9jaHNzL3dvcmtmbG93L3NlbGVjdGlvblwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiUmVuYW1lXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJSZW5hbWVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLnJlbmFtZU5vZGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkR1cGxpY2F0ZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kdXBsaWNhdGVGaWxlT3JEaXJlY3RvcnkobywgZmFsc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRlbGV0ZVwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEZWxldGVcIixcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kZWxldGVGaWxlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG8udHlwZSA9PT0gJ25vbnNwYXRpYWwnKSB7XG4gICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiRWRpdFwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIiA6IFwiZm9udC13ZWlnaHQtYm9sZGVyXCIsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkVkaXRcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJzdG9jaHNzL21vZGVscy9lZGl0XCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJDb252ZXJ0XCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkNvbnZlcnRcIixcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInN1Ym1lbnVcIiA6IHtcbiAgICAgICAgICAgICAgXCJDb252ZXJ0IHRvIFNwYXRpYWxcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJUbyBTcGF0aWFsIE1vZGVsXCIsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLnRvU3BhdGlhbChvKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJDb252ZXJ0IHRvIE5vdGVib29rXCIgOiB7XG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiVG8gTm90ZWJvb2tcIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi9tb2RlbHMvdG8tbm90ZWJvb2tcIiwgby5vcmlnaW5hbC5fcGF0aClcbiAgICAgICAgICAgICAgICAgIHhocih7IHVyaTogZW5kcG9pbnQgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShvLnBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgaWYobm9kZS50eXBlID09PSAncm9vdCcpe1xuICAgICAgICAgICAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgX3BhdGggPSBib2R5LnNwbGl0KCcgJylbMF0uc3BsaXQoJy9ob21lL2pvdnlhbi8nKS5wb3AoKVxuICAgICAgICAgICAgICAgICAgICB2YXIgbm90ZWJvb2tQYXRoID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcIm5vdGVib29rc1wiLCBfcGF0aClcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4obm90ZWJvb2tQYXRoLCAnX2JsYW5rJylcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJDb252ZXJ0IHRvIFNCTUxcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJUbyBTQk1MIE1vZGVsXCIsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLnRvU0JNTChvKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiTmV3IFdvcmtmbG93XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJOZXcgV29ya2Zsb3dcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJzdG9jaHNzL3dvcmtmbG93L3NlbGVjdGlvblwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRG93bmxvYWRcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRvd25sb2FkXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5nZXRKc29uRmlsZUZvckV4cG9ydChvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiUmVuYW1lXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJSZW5hbWVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLnJlbmFtZU5vZGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkR1cGxpY2F0ZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kdXBsaWNhdGVGaWxlT3JEaXJlY3RvcnkobywgZmFsc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRlbGV0ZVwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEZWxldGVcIixcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kZWxldGVGaWxlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG5cdCAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG8udHlwZSA9PT0gJ3dvcmtmbG93Jykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiT3BlblwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIiA6IFwiZm9udC13ZWlnaHQtYm9sZGVyXCIsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk9wZW5cIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJzdG9jaHNzL3dvcmtmbG93L2VkaXQvbm9uZVwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiU3RhcnQvUmVzdGFydCBXb3JrZmxvd1wiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJTdGFydC9SZXN0YXJ0IFdvcmtmbG93XCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJTdG9wIFdvcmtmbG93XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlN0b3AgV29ya2Zsb3dcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIk1vZGVsXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJNb2RlbFwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzdWJtZW51XCIgOiB7XG4gICAgICAgICAgICAgIFwiRWRpdFwiIDoge1xuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiIEVkaXRcIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJEdXBsaWNhdGVcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIkR1cGxpY2F0ZVwiLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRvd25sb2FkXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEb3dubG9hZCBhcyAuemlwXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5nZXRaaXBGaWxlRm9yRXhwb3J0KG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJSZW5hbWVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlbmFtZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYucmVuYW1lTm9kZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRGVsZXRlXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRlbGV0ZVwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnbm90ZWJvb2snKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgXCJPcGVuXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IHRydWUsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9jbGFzc1wiIDogXCJmb250LXdlaWdodC1ib2xkZXJcIixcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiT3BlblwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJub3RlYm9va3NcIiwgby5vcmlnaW5hbC5fcGF0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEb3dubG9hZFwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRG93bmxvYWRcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmdldEpzb25GaWxlRm9yRXhwb3J0KG8pO1xuICAgICAgXHQgICAgfVxuICAgICAgXHQgIH0sXG4gICAgICAgICAgXCJSZW5hbWVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlbmFtZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYucmVuYW1lTm9kZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRHVwbGljYXRlXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEdXBsaWNhdGVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmR1cGxpY2F0ZUZpbGVPckRpcmVjdG9yeShvLCBmYWxzZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRGVsZXRlXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRlbGV0ZVwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnc2JtbC1tb2RlbCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBcIk9wZW5cIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogdHJ1ZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2NsYXNzXCIgOiBcImZvbnQtd2VpZ2h0LWJvbGRlclwiLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJPcGVuIEZpbGVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICB2YXIgZmlsZVBhdGggPSBvLm9yaWdpbmFsLl9wYXRoXG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJsYWIvdHJlZVwiLCBmaWxlUGF0aCksICdfYmxhbmsnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJDb252ZXJ0XCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkNvbnZlcnRcIixcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInN1Ym1lbnVcIiA6IHtcbiAgICAgICAgICAgICAgXCJDb252ZXJ0IHRvIE1vZGVsXCIgOiB7XG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiVG8gTW9kZWxcIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYudG9Nb2RlbChvLCBcIlNCTUxcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEb3dubG9hZFwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRG93bmxvYWRcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmdldEZpbGVGb3JFeHBvcnQobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIlJlbmFtZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiUmVuYW1lXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5yZW5hbWVOb2RlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEdXBsaWNhdGVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkR1cGxpY2F0ZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZHVwbGljYXRlRmlsZU9yRGlyZWN0b3J5KG8sIGZhbHNlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEZWxldGVcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRGVsZXRlXCIsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZGVsZXRlRmlsZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBcIk9wZW5cIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogdHJ1ZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIiA6IFwiZm9udC13ZWlnaHQtYm9sZGVyXCIsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk9wZW5cIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEb3dubG9hZFwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRG93bmxvYWQgYXMgLnppcFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIGlmKG8ub3JpZ2luYWwudGV4dC5lbmRzV2l0aCgnLnppcCcpKXtcbiAgICAgICAgICAgICAgICBzZWxmLmV4cG9ydFRvWmlwRmlsZShvKTtcbiAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc2VsZi5nZXRaaXBGaWxlRm9yRXhwb3J0KG8pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiUmVuYW1lXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJSZW5hbWVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLnJlbmFtZU5vZGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkR1cGxpY2F0ZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kdXBsaWNhdGVGaWxlT3JEaXJlY3RvcnkobywgZmFsc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRlbGV0ZVwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEZWxldGVcIixcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kZWxldGVGaWxlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgJChkb2N1bWVudCkub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJ1thdXRvZm9jdXNdJywgZS50YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2RuZF9zdGFydC52YWthdGEnLCBmdW5jdGlvbiAoZGF0YSwgZWxlbWVudCwgaGVscGVyLCBldmVudCkge1xuICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5sb2FkX2FsbCgpXG4gICAgfSk7XG4gICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUodHJlZVNldHRpbmdzKVxuICAgICQoJyNtb2RlbHMtanN0cmVlJykub24oJ2NsaWNrLmpzdHJlZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50XG4gICAgICB2YXIgX25vZGUgPSBwYXJlbnQuY2hpbGRyZW5bcGFyZW50LmNoaWxkcmVuLmxlbmd0aCAtIDFdXG4gICAgICB2YXIgbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUoX25vZGUpXG4gICAgICBpZihfbm9kZS5ub2RlTmFtZSA9PT0gXCJBXCIgJiYgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5pc19sb2FkZWQobm9kZSkgJiYgbm9kZS50eXBlID09PSBcImZvbGRlclwiKXtcbiAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkKCcjbW9kZWxzLWpzdHJlZScpLm9uKCdkYmxjbGljay5qc3RyZWUnLCBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgZmlsZSA9IGUudGFyZ2V0LnRleHRcbiAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShlLnRhcmdldClcbiAgICAgIHZhciBfcGF0aCA9IG5vZGUub3JpZ2luYWwuX3BhdGg7XG4gICAgICBpZihmaWxlLmVuZHNXaXRoKCcubWRsJykgfHwgZmlsZS5lbmRzV2l0aCgnLnNtZGwnKSl7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3MvbW9kZWxzL2VkaXRcIiwgX3BhdGgpO1xuICAgICAgfWVsc2UgaWYoZmlsZS5lbmRzV2l0aCgnLmlweW5iJykpe1xuICAgICAgICB2YXIgbm90ZWJvb2tQYXRoID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcIm5vdGVib29rc1wiLCBfcGF0aClcbiAgICAgICAgd2luZG93Lm9wZW4obm90ZWJvb2tQYXRoLCAnX2JsYW5rJylcbiAgICAgIH1lbHNlIGlmKGZpbGUuZW5kc1dpdGgoJy5zYm1sJykpe1xuICAgICAgICB2YXIgb3BlblBhdGggPSBwYXRoLmpvaW4oYXBwLmdldEJhc2VQYXRoKCksIFwibGFiL3RyZWVcIiwgX3BhdGgpXG4gICAgICAgIHdpbmRvdy5vcGVuKG9wZW5QYXRoLCAnX2JsYW5rJylcbiAgICAgIH1lbHNlIGlmKGZpbGUuZW5kc1dpdGgoJy53a2ZsJykpe1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJzdG9jaHNzL3dvcmtmbG93L2VkaXQvbm9uZVwiLCBfcGF0aCk7XG4gICAgICB9ZWxzZSBpZihub2RlLnR5cGUgPT09IFwiZm9sZGVyXCIgJiYgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5pc19vcGVuKG5vZGUpICYmICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuaXNfbG9hZGVkKG5vZGUpKXtcbiAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSlcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmluaXRQYWdlKEZpbGVCcm93c2VyKTtcbiIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzZWN0aW9uIGNsYXNzPVxcXCJwYWdlXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VGaWxlIEJyb3dzZXJcXHUwMDNDXFx1MDAyRmgyXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJpZy10aXAgYnRuIGluZm9ybWF0aW9uLWJ0biBoZWxwXFxcIiBkYXRhLWhvb2s9XFxcImZpbGUtYnJvd3Nlci1oZWxwXFxcIlxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFyXFxcIiBkYXRhLWljb249XFxcInF1ZXN0aW9uLWNpcmNsZVxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLXF1ZXN0aW9uLWNpcmNsZSBmYS13LTE2XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDUxMiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTI1NiA4QzExOS4wNDMgOCA4IDExOS4wODMgOCAyNTZjMCAxMzYuOTk3IDExMS4wNDMgMjQ4IDI0OCAyNDhzMjQ4LTExMS4wMDMgMjQ4LTI0OEM1MDQgMTE5LjA4MyAzOTIuOTU3IDggMjU2IDh6bTAgNDQ4Yy0xMTAuNTMyIDAtMjAwLTg5LjQzMS0yMDAtMjAwIDAtMTEwLjQ5NSA4OS40NzItMjAwIDIwMC0yMDAgMTEwLjQ5MSAwIDIwMCA4OS40NzEgMjAwIDIwMCAwIDExMC41My04OS40MzEgMjAwLTIwMCAyMDB6bTEwNy4yNDQtMjU1LjJjMCA2Ny4wNTItNzIuNDIxIDY4LjA4NC03Mi40MjEgOTIuODYzVjMwMGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyaC00NS42NDdjLTYuNjI3IDAtMTItNS4zNzMtMTItMTJ2LTguNjU5YzAtMzUuNzQ1IDI3LjEtNTAuMDM0IDQ3LjU3OS02MS41MTYgMTcuNTYxLTkuODQ1IDI4LjMyNC0xNi41NDEgMjguMzI0LTI5LjU3OSAwLTE3LjI0Ni0yMS45OTktMjguNjkzLTM5Ljc4NC0yOC42OTMtMjMuMTg5IDAtMzMuODk0IDEwLjk3Ny00OC45NDIgMjkuOTY5LTQuMDU3IDUuMTItMTEuNDYgNi4wNzEtMTYuNjY2IDIuMTI0bC0yNy44MjQtMjEuMDk4Yy01LjEwNy0zLjg3Mi02LjI1MS0xMS4wNjYtMi42NDQtMTYuMzYzQzE4NC44NDYgMTMxLjQ5MSAyMTQuOTQgMTEyIDI2MS43OTQgMTEyYzQ5LjA3MSAwIDEwMS40NSAzOC4zMDQgMTAxLjQ1IDg4Ljh6TTI5OCAzNjhjMCAyMy4xNTktMTguODQxIDQyLTQyIDQycy00Mi0xOC44NDEtNDItNDIgMTguODQxLTQyIDQyLTQyIDQyIDE4Ljg0MSA0MiA0MnpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJhbGVydC13YXJuaW5nIGNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImV4dGVuc2lvbi13YXJuaW5nXFxcIlxcdTAwM0VZb3Ugc2hvdWxkIGF2b2lkIGNoYW5naW5nIHRoZSBmaWxlIGV4dGVuc2lvbiB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nIVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImFsZXJ0LXdhcm5pbmcgY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwicmVuYW1lLXdhcm5pbmdcXFwiXFx1MDAzRU1FU1NBR0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGlkPVxcXCJtb2RlbHMtanN0cmVlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGRhdGEtaG9vaz1cXFwicmVmcmVzaC1qc3RyZWVcXFwiXFx1MDAzRVJlZnJlc2hcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnNlY3Rpb25cXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCIvKmdsb2JhbHMgalF1ZXJ5LCBkZWZpbmUsIG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSwgd2luZG93LCBkb2N1bWVudCwgcG9zdE1lc3NhZ2UgKi9cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuXHRcInVzZSBzdHJpY3RcIjtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcblx0fVxuXHRlbHNlIGlmKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcblx0fVxuXHRlbHNlIHtcblx0XHRmYWN0b3J5KGpRdWVyeSk7XG5cdH1cbn0oZnVuY3Rpb24gKCQsIHVuZGVmaW5lZCkge1xuXHRcInVzZSBzdHJpY3RcIjtcbi8qIVxuICoganNUcmVlIDMuMy44XG4gKiBodHRwOi8vanN0cmVlLmNvbS9cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgSXZhbiBCb3poYW5vdiAoaHR0cDovL3Zha2F0YS5jb20pXG4gKlxuICogTGljZW5zZWQgc2FtZSBhcyBqcXVlcnkgLSB1bmRlciB0aGUgdGVybXMgb2YgdGhlIE1JVCBMaWNlbnNlXG4gKiAgIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbi8qIVxuICogaWYgdXNpbmcganNsaW50IHBsZWFzZSBhbGxvdyBmb3IgdGhlIGpRdWVyeSBnbG9iYWwgYW5kIHVzZSBmb2xsb3dpbmcgb3B0aW9uczpcbiAqIGpzbGludDogbG9vcGZ1bmM6IHRydWUsIGJyb3dzZXI6IHRydWUsIGFzczogdHJ1ZSwgYml0d2lzZTogdHJ1ZSwgY29udGludWU6IHRydWUsIG5vbWVuOiB0cnVlLCBwbHVzcGx1czogdHJ1ZSwgcmVnZXhwOiB0cnVlLCB1bnBhcmFtOiB0cnVlLCB0b2RvOiB0cnVlLCB3aGl0ZTogdHJ1ZVxuICovXG4vKmpzaGludCAtVzA4MyAqL1xuXG5cdC8vIHByZXZlbnQgYW5vdGhlciBsb2FkPyBtYXliZSB0aGVyZSBpcyBhIGJldHRlciB3YXk/XG5cdGlmKCQuanN0cmVlKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0LyoqXG5cdCAqICMjIyBqc1RyZWUgY29yZSBmdW5jdGlvbmFsaXR5XG5cdCAqL1xuXG5cdC8vIGludGVybmFsIHZhcmlhYmxlc1xuXHR2YXIgaW5zdGFuY2VfY291bnRlciA9IDAsXG5cdFx0Y2NwX25vZGUgPSBmYWxzZSxcblx0XHRjY3BfbW9kZSA9IGZhbHNlLFxuXHRcdGNjcF9pbnN0ID0gZmFsc2UsXG5cdFx0dGhlbWVzX2xvYWRlZCA9IFtdLFxuXHRcdHNyYyA9ICQoJ3NjcmlwdDpsYXN0JykuYXR0cignc3JjJyksXG5cdFx0ZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7IC8vIGxvY2FsIHZhcmlhYmxlIGlzIGFsd2F5cyBmYXN0ZXIgdG8gYWNjZXNzIHRoZW4gYSBnbG9iYWxcblxuXHQvKipcblx0ICogaG9sZHMgYWxsIGpzdHJlZSByZWxhdGVkIGZ1bmN0aW9ucyBhbmQgdmFyaWFibGVzLCBpbmNsdWRpbmcgdGhlIGFjdHVhbCBjbGFzcyBhbmQgbWV0aG9kcyB0byBjcmVhdGUsIGFjY2VzcyBhbmQgbWFuaXB1bGF0ZSBpbnN0YW5jZXMuXG5cdCAqIEBuYW1lICQuanN0cmVlXG5cdCAqL1xuXHQkLmpzdHJlZSA9IHtcblx0XHQvKipcblx0XHQgKiBzcGVjaWZpZXMgdGhlIGpzdHJlZSB2ZXJzaW9uIGluIHVzZVxuXHRcdCAqIEBuYW1lICQuanN0cmVlLnZlcnNpb25cblx0XHQgKi9cblx0XHR2ZXJzaW9uIDogJzMuMy44Jyxcblx0XHQvKipcblx0XHQgKiBob2xkcyBhbGwgdGhlIGRlZmF1bHQgb3B0aW9ucyB1c2VkIHdoZW4gY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzXG5cdFx0ICovXG5cdFx0ZGVmYXVsdHMgOiB7XG5cdFx0XHQvKipcblx0XHRcdCAqIGNvbmZpZ3VyZSB3aGljaCBwbHVnaW5zIHdpbGwgYmUgYWN0aXZlIG9uIGFuIGluc3RhbmNlLiBTaG91bGQgYmUgYW4gYXJyYXkgb2Ygc3RyaW5ncywgd2hlcmUgZWFjaCBlbGVtZW50IGlzIGEgcGx1Z2luIG5hbWUuIFRoZSBkZWZhdWx0IGlzIGBbXWBcblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnNcblx0XHRcdCAqL1xuXHRcdFx0cGx1Z2lucyA6IFtdXG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzdG9yZXMgYWxsIGxvYWRlZCBqc3RyZWUgcGx1Z2lucyAodXNlZCBpbnRlcm5hbGx5KVxuXHRcdCAqIEBuYW1lICQuanN0cmVlLnBsdWdpbnNcblx0XHQgKi9cblx0XHRwbHVnaW5zIDoge30sXG5cdFx0cGF0aCA6IHNyYyAmJiBzcmMuaW5kZXhPZignLycpICE9PSAtMSA/IHNyYy5yZXBsYWNlKC9cXC9bXlxcL10rJC8sJycpIDogJycsXG5cdFx0aWRyZWdleCA6IC9bXFxcXDomIV58KClcXFtcXF08PkAqJyt+I1wiOy4sPVxcLSBcXC8ke30lP2BdL2csXG5cdFx0cm9vdCA6ICcjJ1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIGNyZWF0ZXMgYSBqc3RyZWUgaW5zdGFuY2Vcblx0ICogQG5hbWUgJC5qc3RyZWUuY3JlYXRlKGVsIFssIG9wdGlvbnNdKVxuXHQgKiBAcGFyYW0ge0RPTUVsZW1lbnR8alF1ZXJ5fFN0cmluZ30gZWwgdGhlIGVsZW1lbnQgdG8gY3JlYXRlIHRoZSBpbnN0YW5jZSBvbiwgY2FuIGJlIGpRdWVyeSBleHRlbmRlZCBvciBhIHNlbGVjdG9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIG9wdGlvbnMgZm9yIHRoaXMgaW5zdGFuY2UgKGV4dGVuZHMgYCQuanN0cmVlLmRlZmF1bHRzYClcblx0ICogQHJldHVybiB7anNUcmVlfSB0aGUgbmV3IGluc3RhbmNlXG5cdCAqL1xuXHQkLmpzdHJlZS5jcmVhdGUgPSBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcblx0XHR2YXIgdG1wID0gbmV3ICQuanN0cmVlLmNvcmUoKytpbnN0YW5jZV9jb3VudGVyKSxcblx0XHRcdG9wdCA9IG9wdGlvbnM7XG5cdFx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCAkLmpzdHJlZS5kZWZhdWx0cywgb3B0aW9ucyk7XG5cdFx0aWYob3B0ICYmIG9wdC5wbHVnaW5zKSB7XG5cdFx0XHRvcHRpb25zLnBsdWdpbnMgPSBvcHQucGx1Z2lucztcblx0XHR9XG5cdFx0JC5lYWNoKG9wdGlvbnMucGx1Z2lucywgZnVuY3Rpb24gKGksIGspIHtcblx0XHRcdGlmKGkgIT09ICdjb3JlJykge1xuXHRcdFx0XHR0bXAgPSB0bXAucGx1Z2luKGssIG9wdGlvbnNba10pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCQoZWwpLmRhdGEoJ2pzdHJlZScsIHRtcCk7XG5cdFx0dG1wLmluaXQoZWwsIG9wdGlvbnMpO1xuXHRcdHJldHVybiB0bXA7XG5cdH07XG5cdC8qKlxuXHQgKiByZW1vdmUgYWxsIHRyYWNlcyBvZiBqc3RyZWUgZnJvbSB0aGUgRE9NIGFuZCBkZXN0cm95IGFsbCBpbnN0YW5jZXNcblx0ICogQG5hbWUgJC5qc3RyZWUuZGVzdHJveSgpXG5cdCAqL1xuXHQkLmpzdHJlZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuXHRcdCQoJy5qc3RyZWU6anN0cmVlJykuanN0cmVlKCdkZXN0cm95Jyk7XG5cdFx0JChkb2N1bWVudCkub2ZmKCcuanN0cmVlJyk7XG5cdH07XG5cdC8qKlxuXHQgKiB0aGUganN0cmVlIGNsYXNzIGNvbnN0cnVjdG9yLCB1c2VkIG9ubHkgaW50ZXJuYWxseVxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAbmFtZSAkLmpzdHJlZS5jb3JlKGlkKVxuXHQgKiBAcGFyYW0ge051bWJlcn0gaWQgdGhpcyBpbnN0YW5jZSdzIGluZGV4XG5cdCAqL1xuXHQkLmpzdHJlZS5jb3JlID0gZnVuY3Rpb24gKGlkKSB7XG5cdFx0dGhpcy5faWQgPSBpZDtcblx0XHR0aGlzLl9jbnQgPSAwO1xuXHRcdHRoaXMuX3dyayA9IG51bGw7XG5cdFx0dGhpcy5fZGF0YSA9IHtcblx0XHRcdGNvcmUgOiB7XG5cdFx0XHRcdHRoZW1lcyA6IHtcblx0XHRcdFx0XHRuYW1lIDogZmFsc2UsXG5cdFx0XHRcdFx0ZG90cyA6IGZhbHNlLFxuXHRcdFx0XHRcdGljb25zIDogZmFsc2UsXG5cdFx0XHRcdFx0ZWxsaXBzaXMgOiBmYWxzZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZWxlY3RlZCA6IFtdLFxuXHRcdFx0XHRsYXN0X2Vycm9yIDoge30sXG5cdFx0XHRcdHdvcmtpbmcgOiBmYWxzZSxcblx0XHRcdFx0d29ya2VyX3F1ZXVlIDogW10sXG5cdFx0XHRcdGZvY3VzZWQgOiBudWxsXG5cdFx0XHR9XG5cdFx0fTtcblx0fTtcblx0LyoqXG5cdCAqIGdldCBhIHJlZmVyZW5jZSB0byBhbiBleGlzdGluZyBpbnN0YW5jZVxuXHQgKlxuXHQgKiBfX0V4YW1wbGVzX19cblx0ICpcblx0ICpcdC8vIHByb3ZpZGVkIGEgY29udGFpbmVyIHdpdGggYW4gSUQgb2YgXCJ0cmVlXCIsIGFuZCBhIG5lc3RlZCBub2RlIHdpdGggYW4gSUQgb2YgXCJicmFuY2hcIlxuXHQgKlx0Ly8gYWxsIG9mIHRoZXJlIHdpbGwgcmV0dXJuIHRoZSBzYW1lIGluc3RhbmNlXG5cdCAqXHQkLmpzdHJlZS5yZWZlcmVuY2UoJ3RyZWUnKTtcblx0ICpcdCQuanN0cmVlLnJlZmVyZW5jZSgnI3RyZWUnKTtcblx0ICpcdCQuanN0cmVlLnJlZmVyZW5jZSgkKCcjdHJlZScpKTtcblx0ICpcdCQuanN0cmVlLnJlZmVyZW5jZShkb2N1bWVudC5nZXRFbGVtZW50QnlJRCgndHJlZScpKTtcblx0ICpcdCQuanN0cmVlLnJlZmVyZW5jZSgnYnJhbmNoJyk7XG5cdCAqXHQkLmpzdHJlZS5yZWZlcmVuY2UoJyNicmFuY2gnKTtcblx0ICpcdCQuanN0cmVlLnJlZmVyZW5jZSgkKCcjYnJhbmNoJykpO1xuXHQgKlx0JC5qc3RyZWUucmVmZXJlbmNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlEKCdicmFuY2gnKSk7XG5cdCAqXG5cdCAqIEBuYW1lICQuanN0cmVlLnJlZmVyZW5jZShuZWVkbGUpXG5cdCAqIEBwYXJhbSB7RE9NRWxlbWVudHxqUXVlcnl8U3RyaW5nfSBuZWVkbGVcblx0ICogQHJldHVybiB7anNUcmVlfG51bGx9IHRoZSBpbnN0YW5jZSBvciBgbnVsbGAgaWYgbm90IGZvdW5kXG5cdCAqL1xuXHQkLmpzdHJlZS5yZWZlcmVuY2UgPSBmdW5jdGlvbiAobmVlZGxlKSB7XG5cdFx0dmFyIHRtcCA9IG51bGwsXG5cdFx0XHRvYmogPSBudWxsO1xuXHRcdGlmKG5lZWRsZSAmJiBuZWVkbGUuaWQgJiYgKCFuZWVkbGUudGFnTmFtZSB8fCAhbmVlZGxlLm5vZGVUeXBlKSkgeyBuZWVkbGUgPSBuZWVkbGUuaWQ7IH1cblxuXHRcdGlmKCFvYmogfHwgIW9iai5sZW5ndGgpIHtcblx0XHRcdHRyeSB7IG9iaiA9ICQobmVlZGxlKTsgfSBjYXRjaCAoaWdub3JlKSB7IH1cblx0XHR9XG5cdFx0aWYoIW9iaiB8fCAhb2JqLmxlbmd0aCkge1xuXHRcdFx0dHJ5IHsgb2JqID0gJCgnIycgKyBuZWVkbGUucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSk7IH0gY2F0Y2ggKGlnbm9yZSkgeyB9XG5cdFx0fVxuXHRcdGlmKG9iaiAmJiBvYmoubGVuZ3RoICYmIChvYmogPSBvYmouY2xvc2VzdCgnLmpzdHJlZScpKS5sZW5ndGggJiYgKG9iaiA9IG9iai5kYXRhKCdqc3RyZWUnKSkpIHtcblx0XHRcdHRtcCA9IG9iajtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQkKCcuanN0cmVlJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBpbnN0ID0gJCh0aGlzKS5kYXRhKCdqc3RyZWUnKTtcblx0XHRcdFx0aWYoaW5zdCAmJiBpbnN0Ll9tb2RlbC5kYXRhW25lZWRsZV0pIHtcblx0XHRcdFx0XHR0bXAgPSBpbnN0O1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiB0bXA7XG5cdH07XG5cdC8qKlxuXHQgKiBDcmVhdGUgYW4gaW5zdGFuY2UsIGdldCBhbiBpbnN0YW5jZSBvciBpbnZva2UgYSBjb21tYW5kIG9uIGEgaW5zdGFuY2UuXG5cdCAqXG5cdCAqIElmIHRoZXJlIGlzIG5vIGluc3RhbmNlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBub2RlIGEgbmV3IG9uZSBpcyBjcmVhdGVkIGFuZCBgYXJnYCBpcyB1c2VkIHRvIGV4dGVuZCBgJC5qc3RyZWUuZGVmYXVsdHNgIGZvciB0aGlzIG5ldyBpbnN0YW5jZS4gVGhlcmUgd291bGQgYmUgbm8gcmV0dXJuIHZhbHVlIChjaGFpbmluZyBpcyBub3QgYnJva2VuKS5cblx0ICpcblx0ICogSWYgdGhlcmUgaXMgYW4gZXhpc3RpbmcgaW5zdGFuY2UgYW5kIGBhcmdgIGlzIGEgc3RyaW5nIHRoZSBjb21tYW5kIHNwZWNpZmllZCBieSBgYXJnYCBpcyBleGVjdXRlZCBvbiB0aGUgaW5zdGFuY2UsIHdpdGggYW55IGFkZGl0aW9uYWwgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgZnVuY3Rpb24uIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGEgdmFsdWUgaXQgd2lsbCBiZSByZXR1cm5lZCAoY2hhaW5pbmcgY291bGQgYnJlYWsgZGVwZW5kaW5nIG9uIGZ1bmN0aW9uKS5cblx0ICpcblx0ICogSWYgdGhlcmUgaXMgYW4gZXhpc3RpbmcgaW5zdGFuY2UgYW5kIGBhcmdgIGlzIG5vdCBhIHN0cmluZyB0aGUgaW5zdGFuY2UgaXRzZWxmIGlzIHJldHVybmVkIChzaW1pbGFyIHRvIGAkLmpzdHJlZS5yZWZlcmVuY2VgKS5cblx0ICpcblx0ICogSW4gYW55IG90aGVyIGNhc2UgLSBub3RoaW5nIGlzIHJldHVybmVkIGFuZCBjaGFpbmluZyBpcyBub3QgYnJva2VuLlxuXHQgKlxuXHQgKiBfX0V4YW1wbGVzX19cblx0ICpcblx0ICpcdCQoJyN0cmVlMScpLmpzdHJlZSgpOyAvLyBjcmVhdGVzIGFuIGluc3RhbmNlXG5cdCAqXHQkKCcjdHJlZTInKS5qc3RyZWUoeyBwbHVnaW5zIDogW10gfSk7IC8vIGNyZWF0ZSBhbiBpbnN0YW5jZSB3aXRoIHNvbWUgb3B0aW9uc1xuXHQgKlx0JCgnI3RyZWUxJykuanN0cmVlKCdvcGVuX25vZGUnLCAnI2JyYW5jaF8xJyk7IC8vIGNhbGwgYSBtZXRob2Qgb24gYW4gZXhpc3RpbmcgaW5zdGFuY2UsIHBhc3NpbmcgYWRkaXRpb25hbCBhcmd1bWVudHNcblx0ICpcdCQoJyN0cmVlMicpLmpzdHJlZSgpOyAvLyBnZXQgYW4gZXhpc3RpbmcgaW5zdGFuY2UgKG9yIGNyZWF0ZSBhbiBpbnN0YW5jZSlcblx0ICpcdCQoJyN0cmVlMicpLmpzdHJlZSh0cnVlKTsgLy8gZ2V0IGFuIGV4aXN0aW5nIGluc3RhbmNlICh3aWxsIG5vdCBjcmVhdGUgbmV3IGluc3RhbmNlKVxuXHQgKlx0JCgnI2JyYW5jaF8xJykuanN0cmVlKCkuc2VsZWN0X25vZGUoJyNicmFuY2hfMScpOyAvLyBnZXQgYW4gaW5zdGFuY2UgKHVzaW5nIGEgbmVzdGVkIGVsZW1lbnQgYW5kIGNhbGwgYSBtZXRob2QpXG5cdCAqXG5cdCAqIEBuYW1lICQoKS5qc3RyZWUoW2FyZ10pXG5cdCAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gYXJnXG5cdCAqIEByZXR1cm4ge01peGVkfVxuXHQgKi9cblx0JC5mbi5qc3RyZWUgPSBmdW5jdGlvbiAoYXJnKSB7XG5cdFx0Ly8gY2hlY2sgZm9yIHN0cmluZyBhcmd1bWVudFxuXHRcdHZhciBpc19tZXRob2RcdD0gKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSxcblx0XHRcdGFyZ3NcdFx0PSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxuXHRcdFx0cmVzdWx0XHRcdD0gbnVsbDtcblx0XHRpZihhcmcgPT09IHRydWUgJiYgIXRoaXMubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQvLyBnZXQgdGhlIGluc3RhbmNlIChpZiB0aGVyZSBpcyBvbmUpIGFuZCBtZXRob2QgKGlmIGl0IGV4aXN0cylcblx0XHRcdHZhciBpbnN0YW5jZSA9ICQuanN0cmVlLnJlZmVyZW5jZSh0aGlzKSxcblx0XHRcdFx0bWV0aG9kID0gaXNfbWV0aG9kICYmIGluc3RhbmNlID8gaW5zdGFuY2VbYXJnXSA6IG51bGw7XG5cdFx0XHQvLyBpZiBjYWxsaW5nIGEgbWV0aG9kLCBhbmQgbWV0aG9kIGlzIGF2YWlsYWJsZSAtIGV4ZWN1dGUgb24gdGhlIGluc3RhbmNlXG5cdFx0XHRyZXN1bHQgPSBpc19tZXRob2QgJiYgbWV0aG9kID9cblx0XHRcdFx0bWV0aG9kLmFwcGx5KGluc3RhbmNlLCBhcmdzKSA6XG5cdFx0XHRcdG51bGw7XG5cdFx0XHQvLyBpZiB0aGVyZSBpcyBubyBpbnN0YW5jZSBhbmQgbm8gbWV0aG9kIGlzIGJlaW5nIGNhbGxlZCAtIGNyZWF0ZSBvbmVcblx0XHRcdGlmKCFpbnN0YW5jZSAmJiAhaXNfbWV0aG9kICYmIChhcmcgPT09IHVuZGVmaW5lZCB8fCAkLmlzUGxhaW5PYmplY3QoYXJnKSkpIHtcblx0XHRcdFx0JC5qc3RyZWUuY3JlYXRlKHRoaXMsIGFyZyk7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZiB0aGVyZSBpcyBhbiBpbnN0YW5jZSBhbmQgbm8gbWV0aG9kIGlzIGNhbGxlZCAtIHJldHVybiB0aGUgaW5zdGFuY2Vcblx0XHRcdGlmKCAoaW5zdGFuY2UgJiYgIWlzX21ldGhvZCkgfHwgYXJnID09PSB0cnVlICkge1xuXHRcdFx0XHRyZXN1bHQgPSBpbnN0YW5jZSB8fCBmYWxzZTtcblx0XHRcdH1cblx0XHRcdC8vIGlmIHRoZXJlIHdhcyBhIG1ldGhvZCBjYWxsIHdoaWNoIHJldHVybmVkIGEgcmVzdWx0IC0gYnJlYWsgYW5kIHJldHVybiB0aGUgdmFsdWVcblx0XHRcdGlmKHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Ly8gaWYgdGhlcmUgd2FzIGEgbWV0aG9kIGNhbGwgd2l0aCBhIHZhbGlkIHJldHVybiB2YWx1ZSAtIHJldHVybiB0aGF0LCBvdGhlcndpc2UgY29udGludWUgdGhlIGNoYWluXG5cdFx0cmV0dXJuIHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHVuZGVmaW5lZCA/XG5cdFx0XHRyZXN1bHQgOiB0aGlzO1xuXHR9O1xuXHQvKipcblx0ICogdXNlZCB0byBmaW5kIGVsZW1lbnRzIGNvbnRhaW5pbmcgYW4gaW5zdGFuY2Vcblx0ICpcblx0ICogX19FeGFtcGxlc19fXG5cdCAqXG5cdCAqXHQkKCdkaXY6anN0cmVlJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdCAqXHRcdCQodGhpcykuanN0cmVlKCdkZXN0cm95Jyk7XG5cdCAqXHR9KTtcblx0ICpcblx0ICogQG5hbWUgJCgnOmpzdHJlZScpXG5cdCAqIEByZXR1cm4ge2pRdWVyeX1cblx0ICovXG5cdCQuZXhwci5wc2V1ZG9zLmpzdHJlZSA9ICQuZXhwci5jcmVhdGVQc2V1ZG8oZnVuY3Rpb24oc2VhcmNoKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGEpIHtcblx0XHRcdHJldHVybiAkKGEpLmhhc0NsYXNzKCdqc3RyZWUnKSAmJlxuXHRcdFx0XHQkKGEpLmRhdGEoJ2pzdHJlZScpICE9PSB1bmRlZmluZWQ7XG5cdFx0fTtcblx0fSk7XG5cblx0LyoqXG5cdCAqIHN0b3JlcyBhbGwgZGVmYXVsdHMgZm9yIHRoZSBjb3JlXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmVcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLmNvcmUgPSB7XG5cdFx0LyoqXG5cdFx0ICogZGF0YSBjb25maWd1cmF0aW9uXG5cdFx0ICpcblx0XHQgKiBJZiBsZWZ0IGFzIGBmYWxzZWAgdGhlIEhUTUwgaW5zaWRlIHRoZSBqc3RyZWUgY29udGFpbmVyIGVsZW1lbnQgaXMgdXNlZCB0byBwb3B1bGF0ZSB0aGUgdHJlZSAodGhhdCBzaG91bGQgYmUgYW4gdW5vcmRlcmVkIGxpc3Qgd2l0aCBsaXN0IGl0ZW1zKS5cblx0XHQgKlxuXHRcdCAqIFlvdSBjYW4gYWxzbyBwYXNzIGluIGEgSFRNTCBzdHJpbmcgb3IgYSBKU09OIGFycmF5IGhlcmUuXG5cdFx0ICpcblx0XHQgKiBJdCBpcyBwb3NzaWJsZSB0byBwYXNzIGluIGEgc3RhbmRhcmQgalF1ZXJ5LWxpa2UgQUpBWCBjb25maWcgYW5kIGpzdHJlZSB3aWxsIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lIGlmIHRoZSByZXNwb25zZSBpcyBKU09OIG9yIEhUTUwgYW5kIHVzZSB0aGF0IHRvIHBvcHVsYXRlIHRoZSB0cmVlLlxuXHRcdCAqIEluIGFkZGl0aW9uIHRvIHRoZSBzdGFuZGFyZCBqUXVlcnkgYWpheCBvcHRpb25zIGhlcmUgeW91IGNhbiBzdXBweSBmdW5jdGlvbnMgZm9yIGBkYXRhYCBhbmQgYHVybGAsIHRoZSBmdW5jdGlvbnMgd2lsbCBiZSBydW4gaW4gdGhlIGN1cnJlbnQgaW5zdGFuY2UncyBzY29wZSBhbmQgYSBwYXJhbSB3aWxsIGJlIHBhc3NlZCBpbmRpY2F0aW5nIHdoaWNoIG5vZGUgaXMgYmVpbmcgbG9hZGVkLCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRob3NlIGZ1bmN0aW9ucyB3aWxsIGJlIHVzZWQuXG5cdFx0ICpcblx0XHQgKiBUaGUgbGFzdCBvcHRpb24gaXMgdG8gc3BlY2lmeSBhIGZ1bmN0aW9uLCB0aGF0IGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aGUgbm9kZSBiZWluZyBsb2FkZWQgYXMgYXJndW1lbnQgYW5kIGEgc2Vjb25kIHBhcmFtIHdoaWNoIGlzIGEgZnVuY3Rpb24gd2hpY2ggc2hvdWxkIGJlIGNhbGxlZCB3aXRoIHRoZSByZXN1bHQuXG5cdFx0ICpcblx0XHQgKiBfX0V4YW1wbGVzX19cblx0XHQgKlxuXHRcdCAqXHQvLyBBSkFYXG5cdFx0ICpcdCQoJyN0cmVlJykuanN0cmVlKHtcblx0XHQgKlx0XHQnY29yZScgOiB7XG5cdFx0ICpcdFx0XHQnZGF0YScgOiB7XG5cdFx0ICpcdFx0XHRcdCd1cmwnIDogJy9nZXQvY2hpbGRyZW4vJyxcblx0XHQgKlx0XHRcdFx0J2RhdGEnIDogZnVuY3Rpb24gKG5vZGUpIHtcblx0XHQgKlx0XHRcdFx0XHRyZXR1cm4geyAnaWQnIDogbm9kZS5pZCB9O1xuXHRcdCAqXHRcdFx0XHR9XG5cdFx0ICpcdFx0XHR9XG5cdFx0ICpcdFx0fSk7XG5cdFx0ICpcblx0XHQgKlx0Ly8gZGlyZWN0IGRhdGFcblx0XHQgKlx0JCgnI3RyZWUnKS5qc3RyZWUoe1xuXHRcdCAqXHRcdCdjb3JlJyA6IHtcblx0XHQgKlx0XHRcdCdkYXRhJyA6IFtcblx0XHQgKlx0XHRcdFx0J1NpbXBsZSByb290IG5vZGUnLFxuXHRcdCAqXHRcdFx0XHR7XG5cdFx0ICpcdFx0XHRcdFx0J2lkJyA6ICdub2RlXzInLFxuXHRcdCAqXHRcdFx0XHRcdCd0ZXh0JyA6ICdSb290IG5vZGUgd2l0aCBvcHRpb25zJyxcblx0XHQgKlx0XHRcdFx0XHQnc3RhdGUnIDogeyAnb3BlbmVkJyA6IHRydWUsICdzZWxlY3RlZCcgOiB0cnVlIH0sXG5cdFx0ICpcdFx0XHRcdFx0J2NoaWxkcmVuJyA6IFsgeyAndGV4dCcgOiAnQ2hpbGQgMScgfSwgJ0NoaWxkIDInXVxuXHRcdCAqXHRcdFx0XHR9XG5cdFx0ICpcdFx0XHRdXG5cdFx0ICpcdFx0fVxuXHRcdCAqXHR9KTtcblx0XHQgKlxuXHRcdCAqXHQvLyBmdW5jdGlvblxuXHRcdCAqXHQkKCcjdHJlZScpLmpzdHJlZSh7XG5cdFx0ICpcdFx0J2NvcmUnIDoge1xuXHRcdCAqXHRcdFx0J2RhdGEnIDogZnVuY3Rpb24gKG9iaiwgY2FsbGJhY2spIHtcblx0XHQgKlx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBbJ1Jvb3QgMScsICdSb290IDInXSk7XG5cdFx0ICpcdFx0XHR9XG5cdFx0ICpcdFx0fSk7XG5cdFx0ICpcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmRhdGFcblx0XHQgKi9cblx0XHRkYXRhXHRcdFx0OiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBjb25maWd1cmUgdGhlIHZhcmlvdXMgc3RyaW5ncyB1c2VkIHRocm91Z2hvdXQgdGhlIHRyZWVcblx0XHQgKlxuXHRcdCAqIFlvdSBjYW4gdXNlIGFuIG9iamVjdCB3aGVyZSB0aGUga2V5IGlzIHRoZSBzdHJpbmcgeW91IG5lZWQgdG8gcmVwbGFjZSBhbmQgdGhlIHZhbHVlIGlzIHlvdXIgcmVwbGFjZW1lbnQuXG5cdFx0ICogQW5vdGhlciBvcHRpb24gaXMgdG8gc3BlY2lmeSBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHdpdGggYW4gYXJndW1lbnQgb2YgdGhlIG5lZWRlZCBzdHJpbmcgYW5kIHNob3VsZCByZXR1cm4gdGhlIHJlcGxhY2VtZW50LlxuXHRcdCAqIElmIGxlZnQgYXMgYGZhbHNlYCBubyByZXBsYWNlbWVudCBpcyBtYWRlLlxuXHRcdCAqXG5cdFx0ICogX19FeGFtcGxlc19fXG5cdFx0ICpcblx0XHQgKlx0JCgnI3RyZWUnKS5qc3RyZWUoe1xuXHRcdCAqXHRcdCdjb3JlJyA6IHtcblx0XHQgKlx0XHRcdCdzdHJpbmdzJyA6IHtcblx0XHQgKlx0XHRcdFx0J0xvYWRpbmcgLi4uJyA6ICdQbGVhc2Ugd2FpdCAuLi4nXG5cdFx0ICpcdFx0XHR9XG5cdFx0ICpcdFx0fVxuXHRcdCAqXHR9KTtcblx0XHQgKlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUuc3RyaW5nc1xuXHRcdCAqL1xuXHRcdHN0cmluZ3NcdFx0XHQ6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIGRldGVybWluZXMgd2hhdCBoYXBwZW5zIHdoZW4gYSB1c2VyIHRyaWVzIHRvIG1vZGlmeSB0aGUgc3RydWN0dXJlIG9mIHRoZSB0cmVlXG5cdFx0ICogSWYgbGVmdCBhcyBgZmFsc2VgIGFsbCBvcGVyYXRpb25zIGxpa2UgY3JlYXRlLCByZW5hbWUsIGRlbGV0ZSwgbW92ZSBvciBjb3B5IGFyZSBwcmV2ZW50ZWQuXG5cdFx0ICogWW91IGNhbiBzZXQgdGhpcyB0byBgdHJ1ZWAgdG8gYWxsb3cgYWxsIGludGVyYWN0aW9ucyBvciB1c2UgYSBmdW5jdGlvbiB0byBoYXZlIGJldHRlciBjb250cm9sLlxuXHRcdCAqXG5cdFx0ICogX19FeGFtcGxlc19fXG5cdFx0ICpcblx0XHQgKlx0JCgnI3RyZWUnKS5qc3RyZWUoe1xuXHRcdCAqXHRcdCdjb3JlJyA6IHtcblx0XHQgKlx0XHRcdCdjaGVja19jYWxsYmFjaycgOiBmdW5jdGlvbiAob3BlcmF0aW9uLCBub2RlLCBub2RlX3BhcmVudCwgbm9kZV9wb3NpdGlvbiwgbW9yZSkge1xuXHRcdCAqXHRcdFx0XHQvLyBvcGVyYXRpb24gY2FuIGJlICdjcmVhdGVfbm9kZScsICdyZW5hbWVfbm9kZScsICdkZWxldGVfbm9kZScsICdtb3ZlX25vZGUnLCAnY29weV9ub2RlJyBvciAnZWRpdCdcblx0XHQgKlx0XHRcdFx0Ly8gaW4gY2FzZSBvZiAncmVuYW1lX25vZGUnIG5vZGVfcG9zaXRpb24gaXMgZmlsbGVkIHdpdGggdGhlIG5ldyBub2RlIG5hbWVcblx0XHQgKlx0XHRcdFx0cmV0dXJuIG9wZXJhdGlvbiA9PT0gJ3JlbmFtZV9ub2RlJyA/IHRydWUgOiBmYWxzZTtcblx0XHQgKlx0XHRcdH1cblx0XHQgKlx0XHR9XG5cdFx0ICpcdH0pO1xuXHRcdCAqXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5jaGVja19jYWxsYmFja1xuXHRcdCAqL1xuXHRcdGNoZWNrX2NhbGxiYWNrXHQ6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIGEgY2FsbGJhY2sgY2FsbGVkIHdpdGggYSBzaW5nbGUgb2JqZWN0IHBhcmFtZXRlciBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSB3aGVuIHNvbWV0aGluZyBnb2VzIHdyb25nIChvcGVyYXRpb24gcHJldmVudGVkLCBhamF4IGZhaWxlZCwgZXRjKVxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUuZXJyb3Jcblx0XHQgKi9cblx0XHRlcnJvclx0XHRcdDogJC5ub29wLFxuXHRcdC8qKlxuXHRcdCAqIHRoZSBvcGVuIC8gY2xvc2UgYW5pbWF0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyAtIHNldCB0aGlzIHRvIGBmYWxzZWAgdG8gZGlzYWJsZSB0aGUgYW5pbWF0aW9uIChkZWZhdWx0IGlzIGAyMDBgKVxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUuYW5pbWF0aW9uXG5cdFx0ICovXG5cdFx0YW5pbWF0aW9uXHRcdDogMjAwLFxuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIG11bHRpcGxlIG5vZGVzIGNhbiBiZSBzZWxlY3RlZFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUubXVsdGlwbGVcblx0XHQgKi9cblx0XHRtdWx0aXBsZVx0XHQ6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogdGhlbWUgY29uZmlndXJhdGlvbiBvYmplY3Rcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lc1xuXHRcdCAqL1xuXHRcdHRoZW1lc1x0XHRcdDoge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0aGUgbmFtZSBvZiB0aGUgdGhlbWUgdG8gdXNlIChpZiBsZWZ0IGFzIGBmYWxzZWAgdGhlIGRlZmF1bHQgdGhlbWUgaXMgdXNlZClcblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzLm5hbWVcblx0XHRcdCAqL1xuXHRcdFx0bmFtZVx0XHRcdDogZmFsc2UsXG5cdFx0XHQvKipcblx0XHRcdCAqIHRoZSBVUkwgb2YgdGhlIHRoZW1lJ3MgQ1NTIGZpbGUsIGxlYXZlIHRoaXMgYXMgYGZhbHNlYCBpZiB5b3UgaGF2ZSBtYW51YWxseSBpbmNsdWRlZCB0aGUgdGhlbWUgQ1NTIChyZWNvbW1lbmRlZCkuIFlvdSBjYW4gc2V0IHRoaXMgdG8gYHRydWVgIHRvbyB3aGljaCB3aWxsIHRyeSB0byBhdXRvbG9hZCB0aGUgdGhlbWUuXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lcy51cmxcblx0XHRcdCAqL1xuXHRcdFx0dXJsXHRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0aGUgbG9jYXRpb24gb2YgYWxsIGpzdHJlZSB0aGVtZXMgLSBvbmx5IHVzZWQgaWYgYHVybGAgaXMgc2V0IHRvIGB0cnVlYFxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXMuZGlyXG5cdFx0XHQgKi9cblx0XHRcdGRpclx0XHRcdFx0OiBmYWxzZSxcblx0XHRcdC8qKlxuXHRcdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgY29ubmVjdGluZyBkb3RzIGFyZSBzaG93blxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXMuZG90c1xuXHRcdFx0ICovXG5cdFx0XHRkb3RzXHRcdFx0OiB0cnVlLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBub2RlIGljb25zIGFyZSBzaG93blxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXMuaWNvbnNcblx0XHRcdCAqL1xuXHRcdFx0aWNvbnNcdFx0XHQ6IHRydWUsXG5cdFx0XHQvKipcblx0XHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIG5vZGUgZWxsaXBzaXMgc2hvdWxkIGJlIHNob3duIC0gdGhpcyBvbmx5IHdvcmtzIHdpdGggYSBmaXhlZCB3aXRoIG9uIHRoZSBjb250YWluZXJcblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzLmVsbGlwc2lzXG5cdFx0XHQgKi9cblx0XHRcdGVsbGlwc2lzXHRcdDogZmFsc2UsXG5cdFx0XHQvKipcblx0XHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSB0cmVlIGJhY2tncm91bmQgaXMgc3RyaXBlZFxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXMuc3RyaXBlc1xuXHRcdFx0ICovXG5cdFx0XHRzdHJpcGVzXHRcdFx0OiBmYWxzZSxcblx0XHRcdC8qKlxuXHRcdFx0ICogYSBzdHJpbmcgKG9yIGJvb2xlYW4gYGZhbHNlYCkgc3BlY2lmeWluZyB0aGUgdGhlbWUgdmFyaWFudCB0byB1c2UgKGlmIHRoZSB0aGVtZSBzdXBwb3J0cyB2YXJpYW50cylcblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzLnZhcmlhbnRcblx0XHRcdCAqL1xuXHRcdFx0dmFyaWFudFx0XHRcdDogZmFsc2UsXG5cdFx0XHQvKipcblx0XHRcdCAqIGEgYm9vbGVhbiBzcGVjaWZ5aW5nIGlmIGEgcmVwb25zaXZlIHZlcnNpb24gb2YgdGhlIHRoZW1lIHNob3VsZCBraWNrIGluIG9uIHNtYWxsZXIgc2NyZWVucyAoaWYgdGhlIHRoZW1lIHN1cHBvcnRzIGl0KS4gRGVmYXVsdHMgdG8gYGZhbHNlYC5cblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzLnJlc3BvbnNpdmVcblx0XHRcdCAqL1xuXHRcdFx0cmVzcG9uc2l2ZVx0XHQ6IGZhbHNlXG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBpZiBsZWZ0IGFzIGB0cnVlYCBhbGwgcGFyZW50cyBvZiBhbGwgc2VsZWN0ZWQgbm9kZXMgd2lsbCBiZSBvcGVuZWQgb25jZSB0aGUgdHJlZSBsb2FkcyAoc28gdGhhdCBhbGwgc2VsZWN0ZWQgbm9kZXMgYXJlIHZpc2libGUgdG8gdGhlIHVzZXIpXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5leHBhbmRfc2VsZWN0ZWRfb25sb2FkXG5cdFx0ICovXG5cdFx0ZXhwYW5kX3NlbGVjdGVkX29ubG9hZCA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogaWYgbGVmdCBhcyBgdHJ1ZWAgd2ViIHdvcmtlcnMgd2lsbCBiZSB1c2VkIHRvIHBhcnNlIGluY29taW5nIEpTT04gZGF0YSB3aGVyZSBwb3NzaWJsZSwgc28gdGhhdCB0aGUgVUkgd2lsbCBub3QgYmUgYmxvY2tlZCBieSBsYXJnZSByZXF1ZXN0cy4gV29ya2VycyBhcmUgaG93ZXZlciBhYm91dCAzMCUgc2xvd2VyLiBEZWZhdWx0cyB0byBgdHJ1ZWBcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLndvcmtlclxuXHRcdCAqL1xuXHRcdHdvcmtlciA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogRm9yY2Ugbm9kZSB0ZXh0IHRvIHBsYWluIHRleHQgKGFuZCBlc2NhcGUgSFRNTCkuIERlZmF1bHRzIHRvIGBmYWxzZWBcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmZvcmNlX3RleHRcblx0XHQgKi9cblx0XHRmb3JjZV90ZXh0IDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogU2hvdWxkIHRoZSBub2RlIGJlIHRvZ2dsZWQgaWYgdGhlIHRleHQgaXMgZG91YmxlIGNsaWNrZWQuIERlZmF1bHRzIHRvIGB0cnVlYFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUuZGJsY2xpY2tfdG9nZ2xlXG5cdFx0ICovXG5cdFx0ZGJsY2xpY2tfdG9nZ2xlIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBTaG91bGQgdGhlIGxvYWRlZCBub2RlcyBiZSBwYXJ0IG9mIHRoZSBzdGF0ZS4gRGVmYXVsdHMgdG8gYGZhbHNlYFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUubG9hZGVkX3N0YXRlXG5cdFx0ICovXG5cdFx0bG9hZGVkX3N0YXRlIDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogU2hvdWxkIHRoZSBsYXN0IGFjdGl2ZSBub2RlIGJlIGZvY3VzZWQgd2hlbiB0aGUgdHJlZSBjb250YWluZXIgaXMgYmx1cnJlZCBhbmQgdGhlIGZvY3VzZWQgYWdhaW4uIFRoaXMgaGVscHMgd29ya2luZyB3aXRoIHNjcmVlbiByZWFkZXJzLiBEZWZhdWx0cyB0byBgdHJ1ZWBcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnJlc3RvcmVfZm9jdXNcblx0XHQgKi9cblx0XHRyZXN0b3JlX2ZvY3VzIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBEZWZhdWx0IGtleWJvYXJkIHNob3J0Y3V0cyAoYW4gb2JqZWN0IHdoZXJlIGVhY2gga2V5IGlzIHRoZSBidXR0b24gbmFtZSBvciBjb21ibyAtIGxpa2UgJ2VudGVyJywgJ2N0cmwtc3BhY2UnLCAncCcsIGV0YyBhbmQgdGhlIHZhbHVlIGlzIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlKVxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUua2V5Ym9hcmRcblx0XHQgKi9cblx0XHRrZXlib2FyZCA6IHtcblx0XHRcdCdjdHJsLXNwYWNlJzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gYXJpYSBkZWZpbmVzIHNwYWNlIG9ubHkgd2l0aCBDdHJsXG5cdFx0XHRcdGUudHlwZSA9IFwiY2xpY2tcIjtcblx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLnRyaWdnZXIoZSk7XG5cdFx0XHR9LFxuXHRcdFx0J2VudGVyJzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gZW50ZXJcblx0XHRcdFx0ZS50eXBlID0gXCJjbGlja1wiO1xuXHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkudHJpZ2dlcihlKTtcblx0XHRcdH0sXG5cdFx0XHQnbGVmdCc6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIGxlZnRcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRpZih0aGlzLmlzX29wZW4oZS5jdXJyZW50VGFyZ2V0KSkge1xuXHRcdFx0XHRcdHRoaXMuY2xvc2Vfbm9kZShlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBvID0gdGhpcy5nZXRfcGFyZW50KGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRcdFx0aWYobyAmJiBvLmlkICE9PSAkLmpzdHJlZS5yb290KSB7IHRoaXMuZ2V0X25vZGUobywgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTsgfVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J3VwJzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gdXBcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgbyA9IHRoaXMuZ2V0X3ByZXZfZG9tKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRcdGlmKG8gJiYgby5sZW5ndGgpIHsgby5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpOyB9XG5cdFx0XHR9LFxuXHRcdFx0J3JpZ2h0JzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gcmlnaHRcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRpZih0aGlzLmlzX2Nsb3NlZChlLmN1cnJlbnRUYXJnZXQpKSB7XG5cdFx0XHRcdFx0dGhpcy5vcGVuX25vZGUoZS5jdXJyZW50VGFyZ2V0LCBmdW5jdGlvbiAobykgeyB0aGlzLmdldF9ub2RlKG8sIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7IH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMuaXNfb3BlbihlLmN1cnJlbnRUYXJnZXQpKSB7XG5cdFx0XHRcdFx0dmFyIG8gPSB0aGlzLmdldF9ub2RlKGUuY3VycmVudFRhcmdldCwgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtY2hpbGRyZW4nKVswXTtcblx0XHRcdFx0XHRpZihvKSB7ICQodGhpcy5fZmlyc3RDaGlsZChvKSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTsgfVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J2Rvd24nOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyBkb3duXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIG8gPSB0aGlzLmdldF9uZXh0X2RvbShlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHRpZihvICYmIG8ubGVuZ3RoKSB7IG8uY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTsgfVxuXHRcdFx0fSxcblx0XHRcdCcqJzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gYXJpYSBkZWZpbmVzICogb24gbnVtcGFkIGFzIG9wZW5fYWxsIC0gbm90IHZlcnkgY29tbW9uXG5cdFx0XHRcdHRoaXMub3Blbl9hbGwoKTtcblx0XHRcdH0sXG5cdFx0XHQnaG9tZSc6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIGhvbWVcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgbyA9IHRoaXMuX2ZpcnN0Q2hpbGQodGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0pO1xuXHRcdFx0XHRpZihvKSB7ICQobykuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZmlsdGVyKCc6dmlzaWJsZScpLmZvY3VzKCk7IH1cblx0XHRcdH0sXG5cdFx0XHQnZW5kJzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gZW5kXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtYW5jaG9yJykuZmlsdGVyKCc6dmlzaWJsZScpLmxhc3QoKS5mb2N1cygpO1xuXHRcdFx0fSxcblx0XHRcdCdmMic6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIGYyIC0gc2FmZSB0byBpbmNsdWRlIC0gaWYgY2hlY2tfY2FsbGJhY2sgaXMgZmFsc2UgaXQgd2lsbCBmYWlsXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5lZGl0KGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHQkLmpzdHJlZS5jb3JlLnByb3RvdHlwZSA9IHtcblx0XHQvKipcblx0XHQgKiB1c2VkIHRvIGRlY29yYXRlIGFuIGluc3RhbmNlIHdpdGggYSBwbHVnaW4uIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIHBsdWdpbihkZWNvIFssIG9wdHNdKVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gZGVjbyB0aGUgcGx1Z2luIHRvIGRlY29yYXRlIHdpdGhcblx0XHQgKiBAcGFyYW0gIHtPYmplY3R9IG9wdHMgb3B0aW9ucyBmb3IgdGhlIHBsdWdpblxuXHRcdCAqIEByZXR1cm4ge2pzVHJlZX1cblx0XHQgKi9cblx0XHRwbHVnaW4gOiBmdW5jdGlvbiAoZGVjbywgb3B0cykge1xuXHRcdFx0dmFyIENoaWxkID0gJC5qc3RyZWUucGx1Z2luc1tkZWNvXTtcblx0XHRcdGlmKENoaWxkKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGFbZGVjb10gPSB7fTtcblx0XHRcdFx0Q2hpbGQucHJvdG90eXBlID0gdGhpcztcblx0XHRcdFx0cmV0dXJuIG5ldyBDaGlsZChvcHRzLCB0aGlzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaW5pdGlhbGl6ZSB0aGUgaW5zdGFuY2UuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIGluaXQoZWwsIG9wdG9ucylcblx0XHQgKiBAcGFyYW0ge0RPTUVsZW1lbnR8alF1ZXJ5fFN0cmluZ30gZWwgdGhlIGVsZW1lbnQgd2UgYXJlIHRyYW5zZm9ybWluZ1xuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIG9wdGlvbnMgZm9yIHRoaXMgaW5zdGFuY2Vcblx0XHQgKiBAdHJpZ2dlciBpbml0LmpzdHJlZSwgbG9hZGluZy5qc3RyZWUsIGxvYWRlZC5qc3RyZWUsIHJlYWR5LmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKi9cblx0XHRpbml0IDogZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG5cdFx0XHR0aGlzLl9tb2RlbCA9IHtcblx0XHRcdFx0ZGF0YSA6IHt9LFxuXHRcdFx0XHRjaGFuZ2VkIDogW10sXG5cdFx0XHRcdGZvcmNlX2Z1bGxfcmVkcmF3IDogZmFsc2UsXG5cdFx0XHRcdHJlZHJhd190aW1lb3V0IDogZmFsc2UsXG5cdFx0XHRcdGRlZmF1bHRfc3RhdGUgOiB7XG5cdFx0XHRcdFx0bG9hZGVkIDogdHJ1ZSxcblx0XHRcdFx0XHRvcGVuZWQgOiBmYWxzZSxcblx0XHRcdFx0XHRzZWxlY3RlZCA6IGZhbHNlLFxuXHRcdFx0XHRcdGRpc2FibGVkIDogZmFsc2Vcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF0gPSB7XG5cdFx0XHRcdGlkIDogJC5qc3RyZWUucm9vdCxcblx0XHRcdFx0cGFyZW50IDogbnVsbCxcblx0XHRcdFx0cGFyZW50cyA6IFtdLFxuXHRcdFx0XHRjaGlsZHJlbiA6IFtdLFxuXHRcdFx0XHRjaGlsZHJlbl9kIDogW10sXG5cdFx0XHRcdHN0YXRlIDogeyBsb2FkZWQgOiBmYWxzZSB9XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmVsZW1lbnQgPSAkKGVsKS5hZGRDbGFzcygnanN0cmVlIGpzdHJlZS0nICsgdGhpcy5faWQpO1xuXHRcdFx0dGhpcy5zZXR0aW5ncyA9IG9wdGlvbnM7XG5cblx0XHRcdHRoaXMuX2RhdGEuY29yZS5yZWFkeSA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxvYWRlZCA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnJ0bCA9ICh0aGlzLmVsZW1lbnQuY3NzKFwiZGlyZWN0aW9uXCIpID09PSBcInJ0bFwiKTtcblx0XHRcdHRoaXMuZWxlbWVudFt0aGlzLl9kYXRhLmNvcmUucnRsID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKFwianN0cmVlLXJ0bFwiKTtcblx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCdyb2xlJywndHJlZScpO1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jb3JlLm11bHRpcGxlKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLW11bHRpc2VsZWN0YWJsZScsIHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXRoaXMuZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCd0YWJpbmRleCcsJzAnKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5iaW5kKCk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCBhZnRlciBhbGwgZXZlbnRzIGFyZSBib3VuZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBpbml0LmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoXCJpbml0XCIpO1xuXG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUub3JpZ2luYWxfY29udGFpbmVyX2h0bWwgPSB0aGlzLmVsZW1lbnQuZmluZChcIiA+IHVsID4gbGlcIikuY2xvbmUodHJ1ZSk7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUub3JpZ2luYWxfY29udGFpbmVyX2h0bWxcblx0XHRcdFx0LmZpbmQoXCJsaVwiKS5hZGRCYWNrKClcblx0XHRcdFx0LmNvbnRlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLm5vZGVUeXBlID09PSAzICYmICghdGhpcy5ub2RlVmFsdWUgfHwgL15cXHMrJC8udGVzdCh0aGlzLm5vZGVWYWx1ZSkpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQucmVtb3ZlKCk7XG5cdFx0XHR0aGlzLmVsZW1lbnQuaHRtbChcIjxcIitcInVsIGNsYXNzPSdqc3RyZWUtY29udGFpbmVyLXVsIGpzdHJlZS1jaGlsZHJlbicgcm9sZT0nZ3JvdXAnPjxcIitcImxpIGlkPSdqXCIrdGhpcy5faWQrXCJfbG9hZGluZycgY2xhc3M9J2pzdHJlZS1pbml0aWFsLW5vZGUganN0cmVlLWxvYWRpbmcganN0cmVlLWxlYWYganN0cmVlLWxhc3QnIHJvbGU9J3RyZWUtaXRlbSc+PGkgY2xhc3M9J2pzdHJlZS1pY29uIGpzdHJlZS1vY2wnPjwvaT48XCIrXCJhIGNsYXNzPSdqc3RyZWUtYW5jaG9yJyBocmVmPScjJz48aSBjbGFzcz0nanN0cmVlLWljb24ganN0cmVlLXRoZW1laWNvbi1oaWRkZW4nPjwvaT5cIiArIHRoaXMuZ2V0X3N0cmluZyhcIkxvYWRpbmcgLi4uXCIpICsgXCI8L2E+PC9saT48L3VsPlwiKTtcblx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCdqJyArIHRoaXMuX2lkICsgJ19sb2FkaW5nJyk7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUubGlfaGVpZ2h0ID0gdGhpcy5nZXRfY29udGFpbmVyX3VsKCkuY2hpbGRyZW4oXCJsaVwiKS5maXJzdCgpLm91dGVySGVpZ2h0KCkgfHwgMjQ7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUubm9kZSA9IHRoaXMuX2NyZWF0ZV9wcm90b3R5cGVfbm9kZSgpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgYWZ0ZXIgdGhlIGxvYWRpbmcgdGV4dCBpcyBzaG93biBhbmQgYmVmb3JlIGxvYWRpbmcgc3RhcnRzXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGxvYWRpbmcuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcihcImxvYWRpbmdcIik7XG5cdFx0XHR0aGlzLmxvYWRfbm9kZSgkLmpzdHJlZS5yb290KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGRlc3Ryb3kgYW4gaW5zdGFuY2Vcblx0XHQgKiBAbmFtZSBkZXN0cm95KClcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBrZWVwX2h0bWwgaWYgbm90IHNldCB0byBgdHJ1ZWAgdGhlIGNvbnRhaW5lciB3aWxsIGJlIGVtcHRpZWQsIG90aGVyd2lzZSB0aGUgY3VycmVudCBET00gZWxlbWVudHMgd2lsbCBiZSBrZXB0IGludGFjdFxuXHRcdCAqL1xuXHRcdGRlc3Ryb3kgOiBmdW5jdGlvbiAoa2VlcF9odG1sKSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCBiZWZvcmUgdGhlIHRyZWUgaXMgZGVzdHJveWVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGRlc3Ryb3kuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcihcImRlc3Ryb3lcIik7XG5cdFx0XHRpZih0aGlzLl93cmspIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh0aGlzLl93cmspO1xuXHRcdFx0XHRcdHRoaXMuX3dyayA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2ggKGlnbm9yZSkgeyB9XG5cdFx0XHR9XG5cdFx0XHRpZigha2VlcF9odG1sKSB7IHRoaXMuZWxlbWVudC5lbXB0eSgpOyB9XG5cdFx0XHR0aGlzLnRlYXJkb3duKCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBDcmVhdGUgYSBwcm90b3R5cGUgbm9kZVxuXHRcdCAqIEBuYW1lIF9jcmVhdGVfcHJvdG90eXBlX25vZGUoKVxuXHRcdCAqIEByZXR1cm4ge0RPTUVsZW1lbnR9XG5cdFx0ICovXG5cdFx0X2NyZWF0ZV9wcm90b3R5cGVfbm9kZSA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0xJJyksIF90ZW1wMSwgX3RlbXAyO1xuXHRcdFx0X25vZGUuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RyZWVpdGVtJyk7XG5cdFx0XHRfdGVtcDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdJJyk7XG5cdFx0XHRfdGVtcDEuY2xhc3NOYW1lID0gJ2pzdHJlZS1pY29uIGpzdHJlZS1vY2wnO1xuXHRcdFx0X3RlbXAxLnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKTtcblx0XHRcdF9ub2RlLmFwcGVuZENoaWxkKF90ZW1wMSk7XG5cdFx0XHRfdGVtcDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdBJyk7XG5cdFx0XHRfdGVtcDEuY2xhc3NOYW1lID0gJ2pzdHJlZS1hbmNob3InO1xuXHRcdFx0X3RlbXAxLnNldEF0dHJpYnV0ZSgnaHJlZicsJyMnKTtcblx0XHRcdF90ZW1wMS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywnLTEnKTtcblx0XHRcdF90ZW1wMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0knKTtcblx0XHRcdF90ZW1wMi5jbGFzc05hbWUgPSAnanN0cmVlLWljb24ganN0cmVlLXRoZW1laWNvbic7XG5cdFx0XHRfdGVtcDIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuXHRcdFx0X3RlbXAxLmFwcGVuZENoaWxkKF90ZW1wMik7XG5cdFx0XHRfbm9kZS5hcHBlbmRDaGlsZChfdGVtcDEpO1xuXHRcdFx0X3RlbXAxID0gX3RlbXAyID0gbnVsbDtcblxuXHRcdFx0cmV0dXJuIF9ub2RlO1xuXHRcdH0sXG5cdFx0X2tiZXZlbnRfdG9fZnVuYyA6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR2YXIga2V5cyA9IHtcblx0XHRcdFx0ODogXCJCYWNrc3BhY2VcIiwgOTogXCJUYWJcIiwgMTM6IFwiRW50ZXJcIiwgMTk6IFwiUGF1c2VcIiwgMjc6IFwiRXNjXCIsXG5cdFx0XHRcdDMyOiBcIlNwYWNlXCIsIDMzOiBcIlBhZ2VVcFwiLCAzNDogXCJQYWdlRG93blwiLCAzNTogXCJFbmRcIiwgMzY6IFwiSG9tZVwiLFxuXHRcdFx0XHQzNzogXCJMZWZ0XCIsIDM4OiBcIlVwXCIsIDM5OiBcIlJpZ2h0XCIsIDQwOiBcIkRvd25cIiwgNDQ6IFwiUHJpbnRcIiwgNDU6IFwiSW5zZXJ0XCIsXG5cdFx0XHRcdDQ2OiBcIkRlbGV0ZVwiLCA5NjogXCJOdW1wYWQwXCIsIDk3OiBcIk51bXBhZDFcIiwgOTg6IFwiTnVtcGFkMlwiLCA5OSA6IFwiTnVtcGFkM1wiLFxuXHRcdFx0XHQxMDA6IFwiTnVtcGFkNFwiLCAxMDE6IFwiTnVtcGFkNVwiLCAxMDI6IFwiTnVtcGFkNlwiLCAxMDM6IFwiTnVtcGFkN1wiLFxuXHRcdFx0XHQxMDQ6IFwiTnVtcGFkOFwiLCAxMDU6IFwiTnVtcGFkOVwiLCAnLTEzJzogXCJOdW1wYWRFbnRlclwiLCAxMTI6IFwiRjFcIixcblx0XHRcdFx0MTEzOiBcIkYyXCIsIDExNDogXCJGM1wiLCAxMTU6IFwiRjRcIiwgMTE2OiBcIkY1XCIsIDExNzogXCJGNlwiLCAxMTg6IFwiRjdcIixcblx0XHRcdFx0MTE5OiBcIkY4XCIsIDEyMDogXCJGOVwiLCAxMjE6IFwiRjEwXCIsIDEyMjogXCJGMTFcIiwgMTIzOiBcIkYxMlwiLCAxNDQ6IFwiTnVtbG9ja1wiLFxuXHRcdFx0XHQxNDU6IFwiU2Nyb2xsbG9ja1wiLCAxNjogJ1NoaWZ0JywgMTc6ICdDdHJsJywgMTg6ICdBbHQnLFxuXHRcdFx0XHQ0ODogJzAnLCAgNDk6ICcxJywgIDUwOiAnMicsICA1MTogJzMnLCAgNTI6ICc0JywgNTM6ICAnNScsXG5cdFx0XHRcdDU0OiAnNicsICA1NTogJzcnLCAgNTY6ICc4JywgIDU3OiAnOScsICA1OTogJzsnLCAgNjE6ICc9JywgNjU6ICAnYScsXG5cdFx0XHRcdDY2OiAnYicsICA2NzogJ2MnLCAgNjg6ICdkJywgIDY5OiAnZScsICA3MDogJ2YnLCAgNzE6ICdnJywgNzI6ICAnaCcsXG5cdFx0XHRcdDczOiAnaScsICA3NDogJ2onLCAgNzU6ICdrJywgIDc2OiAnbCcsICA3NzogJ20nLCAgNzg6ICduJywgNzk6ICAnbycsXG5cdFx0XHRcdDgwOiAncCcsICA4MTogJ3EnLCAgODI6ICdyJywgIDgzOiAncycsICA4NDogJ3QnLCAgODU6ICd1JywgODY6ICAndicsXG5cdFx0XHRcdDg3OiAndycsICA4ODogJ3gnLCAgODk6ICd5JywgIDkwOiAneicsIDEwNzogJysnLCAxMDk6ICctJywgMTEwOiAnLicsXG5cdFx0XHRcdDE4NjogJzsnLCAxODc6ICc9JywgMTg4OiAnLCcsIDE4OTogJy0nLCAxOTA6ICcuJywgMTkxOiAnLycsIDE5MjogJ2AnLFxuXHRcdFx0XHQyMTk6ICdbJywgMjIwOiAnXFxcXCcsMjIxOiAnXScsIDIyMjogXCInXCIsIDExMTogJy8nLCAxMDY6ICcqJywgMTczOiAnLSdcblx0XHRcdH07XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblx0XHRcdGlmIChlLmN0cmxLZXkpIHsgcGFydHMucHVzaCgnY3RybCcpOyB9XG5cdFx0XHRpZiAoZS5hbHRLZXkpIHsgcGFydHMucHVzaCgnYWx0Jyk7IH1cblx0XHRcdGlmIChlLnNoaWZ0S2V5KSB7IHBhcnRzLnB1c2goJ3NoaWZ0Jyk7IH1cblx0XHRcdHBhcnRzLnB1c2goa2V5c1tlLndoaWNoXSB8fCBlLndoaWNoKTtcblx0XHRcdHBhcnRzID0gcGFydHMuc29ydCgpLmpvaW4oJy0nKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHR2YXIga2IgPSB0aGlzLnNldHRpbmdzLmNvcmUua2V5Ym9hcmQsIGksIHRtcDtcblx0XHRcdGZvciAoaSBpbiBrYikge1xuXHRcdFx0XHRpZiAoa2IuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHR0bXAgPSBpO1xuXHRcdFx0XHRcdGlmICh0bXAgIT09ICctJyAmJiB0bXAgIT09ICcrJykge1xuXHRcdFx0XHRcdFx0dG1wID0gdG1wLnJlcGxhY2UoJy0tJywgJy1NSU5VUycpLnJlcGxhY2UoJystJywgJy1NSU5VUycpLnJlcGxhY2UoJysrJywgJy1QTFVTJykucmVwbGFjZSgnLSsnLCAnLVBMVVMnKTtcblx0XHRcdFx0XHRcdHRtcCA9IHRtcC5zcGxpdCgvLXxcXCsvKS5zb3J0KCkuam9pbignLScpLnJlcGxhY2UoJ01JTlVTJywgJy0nKS5yZXBsYWNlKCdQTFVTJywgJysnKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodG1wID09PSBwYXJ0cykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGtiW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBwYXJ0IG9mIHRoZSBkZXN0cm95aW5nIG9mIGFuIGluc3RhbmNlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSB0ZWFyZG93bigpXG5cdFx0ICovXG5cdFx0dGVhcmRvd24gOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLnVuYmluZCgpO1xuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnanN0cmVlJylcblx0XHRcdFx0LnJlbW92ZURhdGEoJ2pzdHJlZScpXG5cdFx0XHRcdC5maW5kKFwiW2NsYXNzXj0nanN0cmVlJ11cIilcblx0XHRcdFx0XHQuYWRkQmFjaygpXG5cdFx0XHRcdFx0LmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmNsYXNzTmFtZS5yZXBsYWNlKC9qc3RyZWVbXiBdKnwkL2lnLCcnKTsgfSk7XG5cdFx0XHR0aGlzLmVsZW1lbnQgPSBudWxsO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogYmluZCBhbGwgZXZlbnRzLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBiaW5kKClcblx0XHQgKi9cblx0XHRiaW5kIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHdvcmQgPSAnJyxcblx0XHRcdFx0dG91dCA9IG51bGwsXG5cdFx0XHRcdHdhc19jbGljayA9IDA7XG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0Lm9uKFwiZGJsY2xpY2suanN0cmVlXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZihlLnRhcmdldC50YWdOYW1lICYmIGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiKSB7IHJldHVybiB0cnVlOyB9XG5cdFx0XHRcdFx0XHRpZihkb2N1bWVudC5zZWxlY3Rpb24gJiYgZG9jdW1lbnQuc2VsZWN0aW9uLmVtcHR5KSB7XG5cdFx0XHRcdFx0XHRcdGRvY3VtZW50LnNlbGVjdGlvbi5lbXB0eSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWwuY29sbGFwc2UoKTtcblx0XHRcdFx0XHRcdFx0XHR9IGNhdGNoIChpZ25vcmUpIHsgfVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKFwibW91c2Vkb3duLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZihlLnRhcmdldCA9PT0gdGhpcy5lbGVtZW50WzBdKSB7XG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCBsb3NpbmcgZm9jdXMgd2hlbiBjbGlja2luZyBzY3JvbGwgYXJyb3dzIChGRiwgQ2hyb21lKVxuXHRcdFx0XHRcdFx0XHR3YXNfY2xpY2sgPSArKG5ldyBEYXRlKCkpOyAvLyBpZSBkb2VzIG5vdCBhbGxvdyB0byBwcmV2ZW50IGxvc2luZyBmb2N1c1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJtb3VzZWRvd24uanN0cmVlXCIsIFwiLmpzdHJlZS1vY2xcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCBhbnkgbm9kZSBpbnNpZGUgZnJvbSBsb3NpbmcgZm9jdXMgd2hlbiBjbGlja2luZyB0aGUgb3Blbi9jbG9zZSBpY29uXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKFwiY2xpY2suanN0cmVlXCIsIFwiLmpzdHJlZS1vY2xcIiwgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0dGhpcy50b2dnbGVfbm9kZShlLnRhcmdldCk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImRibGNsaWNrLmpzdHJlZVwiLCBcIi5qc3RyZWUtYW5jaG9yXCIsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKGUudGFyZ2V0LnRhZ05hbWUgJiYgZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdFx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY29yZS5kYmxjbGlja190b2dnbGUpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50b2dnbGVfbm9kZShlLnRhcmdldCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImNsaWNrLmpzdHJlZVwiLCBcIi5qc3RyZWUtYW5jaG9yXCIsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGlmKGUuY3VycmVudFRhcmdldCAhPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgeyAkKGUuY3VycmVudFRhcmdldCkuZm9jdXMoKTsgfVxuXHRcdFx0XHRcdFx0dGhpcy5hY3RpdmF0ZV9ub2RlKGUuY3VycmVudFRhcmdldCwgZSk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbigna2V5ZG93bi5qc3RyZWUnLCAnLmpzdHJlZS1hbmNob3InLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZihlLnRhcmdldC50YWdOYW1lICYmIGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiKSB7IHJldHVybiB0cnVlOyB9XG5cdFx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUucnRsKSB7XG5cdFx0XHRcdFx0XHRcdGlmKGUud2hpY2ggPT09IDM3KSB7IGUud2hpY2ggPSAzOTsgfVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmKGUud2hpY2ggPT09IDM5KSB7IGUud2hpY2ggPSAzNzsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmFyIGYgPSB0aGlzLl9rYmV2ZW50X3RvX2Z1bmMoZSk7XG5cdFx0XHRcdFx0XHRpZiAoZikge1xuXHRcdFx0XHRcdFx0XHR2YXIgciA9IGYuY2FsbCh0aGlzLCBlKTtcblx0XHRcdFx0XHRcdFx0aWYgKHIgPT09IGZhbHNlIHx8IHIgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJsb2FkX25vZGUuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdGlmKGRhdGEuc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHRcdGlmKGRhdGEubm9kZS5pZCA9PT0gJC5qc3RyZWUucm9vdCAmJiAhdGhpcy5fZGF0YS5jb3JlLmxvYWRlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sb2FkZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMuX2ZpcnN0Q2hpbGQodGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyx0aGlzLl9maXJzdENoaWxkKHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdKS5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0XHRcdCAqIHRyaWdnZXJlZCBhZnRlciB0aGUgcm9vdCBub2RlIGlzIGxvYWRlZCBmb3IgdGhlIGZpcnN0IHRpbWVcblx0XHRcdFx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHRcdFx0XHQgKiBAbmFtZSBsb2FkZWQuanN0cmVlXG5cdFx0XHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy50cmlnZ2VyKFwibG9hZGVkXCIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKCF0aGlzLl9kYXRhLmNvcmUucmVhZHkpIHtcblx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLmVsZW1lbnQgJiYgIXRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmZpbmQoJy5qc3RyZWUtbG9hZGluZycpLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUucmVhZHkgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jb3JlLmV4cGFuZF9zZWxlY3RlZF9vbmxvYWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciB0bXAgPSBbXSwgaSwgajtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gdG1wLmNvbmNhdCh0aGlzLl9tb2RlbC5kYXRhW3RoaXMuX2RhdGEuY29yZS5zZWxlY3RlZFtpXV0ucGFyZW50cyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSAkLnZha2F0YS5hcnJheV91bmlxdWUodG1wKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5vcGVuX25vZGUodG1wW2ldLCBmYWxzZSwgMCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAncmVhZHknLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgYWZ0ZXIgYWxsIG5vZGVzIGFyZSBmaW5pc2hlZCBsb2FkaW5nXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgKiBAbmFtZSByZWFkeS5qc3RyZWVcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudHJpZ2dlcihcInJlYWR5XCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0sIHRoaXMpLCAwKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQvLyBxdWljayBzZWFyY2hpbmcgd2hlbiB0aGUgdHJlZSBpcyBmb2N1c2VkXG5cdFx0XHRcdC5vbigna2V5cHJlc3MuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYoZS50YXJnZXQudGFnTmFtZSAmJiBlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIikgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0XHRcdFx0aWYodG91dCkgeyBjbGVhclRpbWVvdXQodG91dCk7IH1cblx0XHRcdFx0XHRcdHRvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0d29yZCA9ICcnO1xuXHRcdFx0XHRcdFx0fSwgNTAwKTtcblxuXHRcdFx0XHRcdFx0dmFyIGNociA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCkudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRcdFx0Y29sID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtYW5jaG9yJykuZmlsdGVyKCc6dmlzaWJsZScpLFxuXHRcdFx0XHRcdFx0XHRpbmQgPSBjb2wuaW5kZXgoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgfHwgMCxcblx0XHRcdFx0XHRcdFx0ZW5kID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR3b3JkICs9IGNocjtcblxuXHRcdFx0XHRcdFx0Ly8gbWF0Y2ggZm9yIHdob2xlIHdvcmQgZnJvbSBjdXJyZW50IG5vZGUgZG93biAoaW5jbHVkaW5nIHRoZSBjdXJyZW50IG5vZGUpXG5cdFx0XHRcdFx0XHRpZih3b3JkLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0Y29sLnNsaWNlKGluZCkuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYoJCh2KS50ZXh0KCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHdvcmQpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKHYpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHRcdFx0XHRpZihlbmQpIHsgcmV0dXJuOyB9XG5cblx0XHRcdFx0XHRcdFx0Ly8gbWF0Y2ggZm9yIHdob2xlIHdvcmQgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0cmVlXG5cdFx0XHRcdFx0XHRcdGNvbC5zbGljZSgwLCBpbmQpLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0XHRcdGlmKCQodikudGV4dCgpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih3b3JkKSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0JCh2KS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0XHRcdFx0aWYoZW5kKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly8gbGlzdCBub2RlcyB0aGF0IHN0YXJ0IHdpdGggdGhhdCBsZXR0ZXIgKG9ubHkgaWYgd29yZCBjb25zaXN0cyBvZiBhIHNpbmdsZSBjaGFyKVxuXHRcdFx0XHRcdFx0aWYobmV3IFJlZ0V4cCgnXicgKyBjaHIucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJykgKyAnKyQnKS50ZXN0KHdvcmQpKSB7XG5cdFx0XHRcdFx0XHRcdC8vIHNlYXJjaCBmb3IgdGhlIG5leHQgbm9kZSBzdGFydGluZyB3aXRoIHRoYXQgbGV0dGVyXG5cdFx0XHRcdFx0XHRcdGNvbC5zbGljZShpbmQgKyAxKS5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdFx0XHRpZigkKHYpLnRleHQoKS50b0xvd2VyQ2FzZSgpLmNoYXJBdCgwKSA9PT0gY2hyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKHYpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHRcdFx0XHRpZihlbmQpIHsgcmV0dXJuOyB9XG5cblx0XHRcdFx0XHRcdFx0Ly8gc2VhcmNoIGZyb20gdGhlIGJlZ2lubmluZ1xuXHRcdFx0XHRcdFx0XHRjb2wuc2xpY2UoMCwgaW5kICsgMSkuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYoJCh2KS50ZXh0KCkudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09IGNocikge1xuXHRcdFx0XHRcdFx0XHRcdFx0JCh2KS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0XHRcdFx0aWYoZW5kKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQvLyBUSEVNRSBSRUxBVEVEXG5cdFx0XHRcdC5vbihcImluaXQuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dmFyIHMgPSB0aGlzLnNldHRpbmdzLmNvcmUudGhlbWVzO1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5kb3RzXHRcdFx0PSBzLmRvdHM7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnN0cmlwZXNcdFx0PSBzLnN0cmlwZXM7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmljb25zXHRcdD0gcy5pY29ucztcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZWxsaXBzaXNcdFx0PSBzLmVsbGlwc2lzO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRfdGhlbWUocy5uYW1lIHx8IFwiZGVmYXVsdFwiLCBzLnVybCk7XG5cdFx0XHRcdFx0XHR0aGlzLnNldF90aGVtZV92YXJpYW50KHMudmFyaWFudCk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImxvYWRpbmcuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dGhpc1sgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5kb3RzID8gXCJzaG93X2RvdHNcIiA6IFwiaGlkZV9kb3RzXCIgXSgpO1xuXHRcdFx0XHRcdFx0dGhpc1sgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5pY29ucyA/IFwic2hvd19pY29uc1wiIDogXCJoaWRlX2ljb25zXCIgXSgpO1xuXHRcdFx0XHRcdFx0dGhpc1sgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5zdHJpcGVzID8gXCJzaG93X3N0cmlwZXNcIiA6IFwiaGlkZV9zdHJpcGVzXCIgXSgpO1xuXHRcdFx0XHRcdFx0dGhpc1sgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5lbGxpcHNpcyA/IFwic2hvd19lbGxpcHNpc1wiIDogXCJoaWRlX2VsbGlwc2lzXCIgXSgpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oJ2JsdXIuanN0cmVlJywgJy5qc3RyZWUtYW5jaG9yJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgPSBudWxsO1xuXHRcdFx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLmZpbHRlcignLmpzdHJlZS1ob3ZlcmVkJykudHJpZ2dlcignbW91c2VsZWF2ZScpO1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ3RhYmluZGV4JywgJzAnKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKCdmb2N1cy5qc3RyZWUnLCAnLmpzdHJlZS1hbmNob3InLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHR2YXIgdG1wID0gdGhpcy5nZXRfbm9kZShlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5pZCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCA9IHRtcC5pZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLWhvdmVyZWQnKS5ub3QoZS5jdXJyZW50VGFyZ2V0KS50cmlnZ2VyKCdtb3VzZWxlYXZlJyk7XG5cdFx0XHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkudHJpZ2dlcignbW91c2VlbnRlcicpO1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbignZm9jdXMuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRpZigrKG5ldyBEYXRlKCkpIC0gd2FzX2NsaWNrID4gNTAwICYmICF0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCAmJiB0aGlzLnNldHRpbmdzLmNvcmUucmVzdG9yZV9mb2N1cykge1xuXHRcdFx0XHRcdFx0XHR3YXNfY2xpY2sgPSAwO1xuXHRcdFx0XHRcdFx0XHR2YXIgYWN0ID0gdGhpcy5nZXRfbm9kZSh0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50JyksIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRpZihhY3QpIHtcblx0XHRcdFx0XHRcdFx0XHRhY3QuZmluZCgnPiAuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKCdtb3VzZWVudGVyLmpzdHJlZScsICcuanN0cmVlLWFuY2hvcicsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuaG92ZXJfbm9kZShlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oJ21vdXNlbGVhdmUuanN0cmVlJywgJy5qc3RyZWUtYW5jaG9yJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5kZWhvdmVyX25vZGUoZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBwYXJ0IG9mIHRoZSBkZXN0cm95aW5nIG9mIGFuIGluc3RhbmNlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSB1bmJpbmQoKVxuXHRcdCAqL1xuXHRcdHVuYmluZCA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuZWxlbWVudC5vZmYoJy5qc3RyZWUnKTtcblx0XHRcdCQoZG9jdW1lbnQpLm9mZignLmpzdHJlZS0nICsgdGhpcy5faWQpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogdHJpZ2dlciBhbiBldmVudC4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgdHJpZ2dlcihldiBbLCBkYXRhXSlcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGV2IHRoZSBuYW1lIG9mIHRoZSBldmVudCB0byB0cmlnZ2VyXG5cdFx0ICogQHBhcmFtICB7T2JqZWN0fSBkYXRhIGFkZGl0aW9uYWwgZGF0YSB0byBwYXNzIHdpdGggdGhlIGV2ZW50XG5cdFx0ICovXG5cdFx0dHJpZ2dlciA6IGZ1bmN0aW9uIChldiwgZGF0YSkge1xuXHRcdFx0aWYoIWRhdGEpIHtcblx0XHRcdFx0ZGF0YSA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0ZGF0YS5pbnN0YW5jZSA9IHRoaXM7XG5cdFx0XHR0aGlzLmVsZW1lbnQudHJpZ2dlckhhbmRsZXIoZXYucmVwbGFjZSgnLmpzdHJlZScsJycpICsgJy5qc3RyZWUnLCBkYXRhKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJldHVybnMgdGhlIGpRdWVyeSBleHRlbmRlZCBpbnN0YW5jZSBjb250YWluZXJcblx0XHQgKiBAbmFtZSBnZXRfY29udGFpbmVyKClcblx0XHQgKiBAcmV0dXJuIHtqUXVlcnl9XG5cdFx0ICovXG5cdFx0Z2V0X2NvbnRhaW5lciA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLmVsZW1lbnQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZXR1cm5zIHRoZSBqUXVlcnkgZXh0ZW5kZWQgbWFpbiBVTCBub2RlIGluc2lkZSB0aGUgaW5zdGFuY2UgY29udGFpbmVyLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBnZXRfY29udGFpbmVyX3VsKClcblx0XHQgKiBAcmV0dXJuIHtqUXVlcnl9XG5cdFx0ICovXG5cdFx0Z2V0X2NvbnRhaW5lcl91bCA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLmVsZW1lbnQuY2hpbGRyZW4oXCIuanN0cmVlLWNoaWxkcmVuXCIpLmZpcnN0KCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXRzIHN0cmluZyByZXBsYWNlbWVudHMgKGxvY2FsaXphdGlvbikuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIGdldF9zdHJpbmcoa2V5KVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30ga2V5XG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdGdldF9zdHJpbmcgOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHR2YXIgYSA9IHRoaXMuc2V0dGluZ3MuY29yZS5zdHJpbmdzO1xuXHRcdFx0aWYoJC5pc0Z1bmN0aW9uKGEpKSB7IHJldHVybiBhLmNhbGwodGhpcywga2V5KTsgfVxuXHRcdFx0aWYoYSAmJiBhW2tleV0pIHsgcmV0dXJuIGFba2V5XTsgfVxuXHRcdFx0cmV0dXJuIGtleTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldHMgdGhlIGZpcnN0IGNoaWxkIG9mIGEgRE9NIG5vZGUuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9maXJzdENoaWxkKGRvbSlcblx0XHQgKiBAcGFyYW0gIHtET01FbGVtZW50fSBkb21cblx0XHQgKiBAcmV0dXJuIHtET01FbGVtZW50fVxuXHRcdCAqL1xuXHRcdF9maXJzdENoaWxkIDogZnVuY3Rpb24gKGRvbSkge1xuXHRcdFx0ZG9tID0gZG9tID8gZG9tLmZpcnN0Q2hpbGQgOiBudWxsO1xuXHRcdFx0d2hpbGUoZG9tICE9PSBudWxsICYmIGRvbS5ub2RlVHlwZSAhPT0gMSkge1xuXHRcdFx0XHRkb20gPSBkb20ubmV4dFNpYmxpbmc7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZG9tO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0cyB0aGUgbmV4dCBzaWJsaW5nIG9mIGEgRE9NIG5vZGUuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9uZXh0U2libGluZyhkb20pXG5cdFx0ICogQHBhcmFtICB7RE9NRWxlbWVudH0gZG9tXG5cdFx0ICogQHJldHVybiB7RE9NRWxlbWVudH1cblx0XHQgKi9cblx0XHRfbmV4dFNpYmxpbmcgOiBmdW5jdGlvbiAoZG9tKSB7XG5cdFx0XHRkb20gPSBkb20gPyBkb20ubmV4dFNpYmxpbmcgOiBudWxsO1xuXHRcdFx0d2hpbGUoZG9tICE9PSBudWxsICYmIGRvbS5ub2RlVHlwZSAhPT0gMSkge1xuXHRcdFx0XHRkb20gPSBkb20ubmV4dFNpYmxpbmc7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZG9tO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0cyB0aGUgcHJldmlvdXMgc2libGluZyBvZiBhIERPTSBub2RlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfcHJldmlvdXNTaWJsaW5nKGRvbSlcblx0XHQgKiBAcGFyYW0gIHtET01FbGVtZW50fSBkb21cblx0XHQgKiBAcmV0dXJuIHtET01FbGVtZW50fVxuXHRcdCAqL1xuXHRcdF9wcmV2aW91c1NpYmxpbmcgOiBmdW5jdGlvbiAoZG9tKSB7XG5cdFx0XHRkb20gPSBkb20gPyBkb20ucHJldmlvdXNTaWJsaW5nIDogbnVsbDtcblx0XHRcdHdoaWxlKGRvbSAhPT0gbnVsbCAmJiBkb20ubm9kZVR5cGUgIT09IDEpIHtcblx0XHRcdFx0ZG9tID0gZG9tLnByZXZpb3VzU2libGluZztcblx0XHRcdH1cblx0XHRcdHJldHVybiBkb207XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgYSBub2RlIChvciB0aGUgYWN0dWFsIGpRdWVyeSBleHRlbmRlZCBET00gbm9kZSkgYnkgdXNpbmcgYW55IGlucHV0IChjaGlsZCBET00gZWxlbWVudCwgSUQgc3RyaW5nLCBzZWxlY3RvciwgZXRjKVxuXHRcdCAqIEBuYW1lIGdldF9ub2RlKG9iaiBbLCBhc19kb21dKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBhc19kb21cblx0XHQgKiBAcmV0dXJuIHtPYmplY3R8alF1ZXJ5fVxuXHRcdCAqL1xuXHRcdGdldF9ub2RlIDogZnVuY3Rpb24gKG9iaiwgYXNfZG9tKSB7XG5cdFx0XHRpZihvYmogJiYgb2JqLmlkKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5pZDtcblx0XHRcdH1cblx0XHRcdGlmIChvYmogaW5zdGFuY2VvZiAkICYmIG9iai5sZW5ndGggJiYgb2JqWzBdLmlkKSB7XG5cdFx0XHRcdG9iaiA9IG9ialswXS5pZDtcblx0XHRcdH1cblx0XHRcdHZhciBkb207XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW29ial0pIHtcblx0XHRcdFx0XHRvYmogPSB0aGlzLl9tb2RlbC5kYXRhW29ial07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZih0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiICYmIHRoaXMuX21vZGVsLmRhdGFbb2JqLnJlcGxhY2UoL14jLywgJycpXSkge1xuXHRcdFx0XHRcdG9iaiA9IHRoaXMuX21vZGVsLmRhdGFbb2JqLnJlcGxhY2UoL14jLywgJycpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIgJiYgKGRvbSA9ICQoJyMnICsgb2JqLnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJyksIHRoaXMuZWxlbWVudCkpLmxlbmd0aCAmJiB0aGlzLl9tb2RlbC5kYXRhW2RvbS5jbG9zZXN0KCcuanN0cmVlLW5vZGUnKS5hdHRyKCdpZCcpXSkge1xuXHRcdFx0XHRcdG9iaiA9IHRoaXMuX21vZGVsLmRhdGFbZG9tLmNsb3Nlc3QoJy5qc3RyZWUtbm9kZScpLmF0dHIoJ2lkJyldO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoKGRvbSA9IHRoaXMuZWxlbWVudC5maW5kKG9iaikpLmxlbmd0aCAmJiB0aGlzLl9tb2RlbC5kYXRhW2RvbS5jbG9zZXN0KCcuanN0cmVlLW5vZGUnKS5hdHRyKCdpZCcpXSkge1xuXHRcdFx0XHRcdG9iaiA9IHRoaXMuX21vZGVsLmRhdGFbZG9tLmNsb3Nlc3QoJy5qc3RyZWUtbm9kZScpLmF0dHIoJ2lkJyldO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoKGRvbSA9IHRoaXMuZWxlbWVudC5maW5kKG9iaikpLmxlbmd0aCAmJiBkb20uaGFzQ2xhc3MoJ2pzdHJlZScpKSB7XG5cdFx0XHRcdFx0b2JqID0gdGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZihhc19kb20pIHtcblx0XHRcdFx0XHRvYmogPSBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QgPyB0aGlzLmVsZW1lbnQgOiAkKCcjJyArIG9iai5pZC5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpLCB0aGlzLmVsZW1lbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBvYmo7XG5cdFx0XHR9IGNhdGNoIChleCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCB0aGUgcGF0aCB0byBhIG5vZGUsIGVpdGhlciBjb25zaXN0aW5nIG9mIG5vZGUgdGV4dHMsIG9yIG9mIG5vZGUgSURzLCBvcHRpb25hbGx5IGdsdWVkIHRvZ2V0aGVyIChvdGhlcndpc2UgYW4gYXJyYXkpXG5cdFx0ICogQG5hbWUgZ2V0X3BhdGgob2JqIFssIGdsdWUsIGlkc10pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gZ2x1ZSBpZiB5b3Ugd2FudCB0aGUgcGF0aCBhcyBhIHN0cmluZyAtIHBhc3MgdGhlIGdsdWUgaGVyZSAoZm9yIGV4YW1wbGUgJy8nKSwgaWYgYSBmYWxzeSB2YWx1ZSBpcyBzdXBwbGllZCBoZXJlLCBhbiBhcnJheSBpcyByZXR1cm5lZFxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGlkcyBpZiBzZXQgdG8gdHJ1ZSBidWlsZCB0aGUgcGF0aCB1c2luZyBJRCwgb3RoZXJ3aXNlIG5vZGUgdGV4dCBpcyB1c2VkXG5cdFx0ICogQHJldHVybiB7bWl4ZWR9XG5cdFx0ICovXG5cdFx0Z2V0X3BhdGggOiBmdW5jdGlvbiAob2JqLCBnbHVlLCBpZHMpIHtcblx0XHRcdG9iaiA9IG9iai5wYXJlbnRzID8gb2JqIDogdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QgfHwgIW9iai5wYXJlbnRzKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZhciBpLCBqLCBwID0gW107XG5cdFx0XHRwLnB1c2goaWRzID8gb2JqLmlkIDogb2JqLnRleHQpO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdHAucHVzaChpZHMgPyBvYmoucGFyZW50c1tpXSA6IHRoaXMuZ2V0X3RleHQob2JqLnBhcmVudHNbaV0pKTtcblx0XHRcdH1cblx0XHRcdHAgPSBwLnJldmVyc2UoKS5zbGljZSgxKTtcblx0XHRcdHJldHVybiBnbHVlID8gcC5qb2luKGdsdWUpIDogcDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCB0aGUgbmV4dCB2aXNpYmxlIG5vZGUgdGhhdCBpcyBiZWxvdyB0aGUgYG9iamAgbm9kZS4gSWYgYHN0cmljdGAgaXMgc2V0IHRvIGB0cnVlYCBvbmx5IHNpYmxpbmcgbm9kZXMgYXJlIHJldHVybmVkLlxuXHRcdCAqIEBuYW1lIGdldF9uZXh0X2RvbShvYmogWywgc3RyaWN0XSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gc3RyaWN0XG5cdFx0ICogQHJldHVybiB7alF1ZXJ5fVxuXHRcdCAqL1xuXHRcdGdldF9uZXh0X2RvbSA6IGZ1bmN0aW9uIChvYmosIHN0cmljdCkge1xuXHRcdFx0dmFyIHRtcDtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKG9ialswXSA9PT0gdGhpcy5lbGVtZW50WzBdKSB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuX2ZpcnN0Q2hpbGQodGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0pO1xuXHRcdFx0XHR3aGlsZSAodG1wICYmIHRtcC5vZmZzZXRIZWlnaHQgPT09IDApIHtcblx0XHRcdFx0XHR0bXAgPSB0aGlzLl9uZXh0U2libGluZyh0bXApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0bXAgPyAkKHRtcCkgOiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKCFvYmogfHwgIW9iai5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoc3RyaWN0KSB7XG5cdFx0XHRcdHRtcCA9IG9ialswXTtcblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdHRtcCA9IHRoaXMuX25leHRTaWJsaW5nKHRtcCk7XG5cdFx0XHRcdH0gd2hpbGUgKHRtcCAmJiB0bXAub2Zmc2V0SGVpZ2h0ID09PSAwKTtcblx0XHRcdFx0cmV0dXJuIHRtcCA/ICQodG1wKSA6IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYob2JqLmhhc0NsYXNzKFwianN0cmVlLW9wZW5cIikpIHtcblx0XHRcdFx0dG1wID0gdGhpcy5fZmlyc3RDaGlsZChvYmouY2hpbGRyZW4oJy5qc3RyZWUtY2hpbGRyZW4nKVswXSk7XG5cdFx0XHRcdHdoaWxlICh0bXAgJiYgdG1wLm9mZnNldEhlaWdodCA9PT0gMCkge1xuXHRcdFx0XHRcdHRtcCA9IHRoaXMuX25leHRTaWJsaW5nKHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYodG1wICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQodG1wKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dG1wID0gb2JqWzBdO1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHR0bXAgPSB0aGlzLl9uZXh0U2libGluZyh0bXApO1xuXHRcdFx0fSB3aGlsZSAodG1wICYmIHRtcC5vZmZzZXRIZWlnaHQgPT09IDApO1xuXHRcdFx0aWYodG1wICE9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiAkKHRtcCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqLnBhcmVudHNVbnRpbChcIi5qc3RyZWVcIixcIi5qc3RyZWUtbm9kZVwiKS5uZXh0QWxsKFwiLmpzdHJlZS1ub2RlOnZpc2libGVcIikuZmlyc3QoKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCB0aGUgcHJldmlvdXMgdmlzaWJsZSBub2RlIHRoYXQgaXMgYWJvdmUgdGhlIGBvYmpgIG5vZGUuIElmIGBzdHJpY3RgIGlzIHNldCB0byBgdHJ1ZWAgb25seSBzaWJsaW5nIG5vZGVzIGFyZSByZXR1cm5lZC5cblx0XHQgKiBAbmFtZSBnZXRfcHJldl9kb20ob2JqIFssIHN0cmljdF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IHN0cmljdFxuXHRcdCAqIEByZXR1cm4ge2pRdWVyeX1cblx0XHQgKi9cblx0XHRnZXRfcHJldl9kb20gOiBmdW5jdGlvbiAob2JqLCBzdHJpY3QpIHtcblx0XHRcdHZhciB0bXA7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZihvYmpbMF0gPT09IHRoaXMuZWxlbWVudFswXSkge1xuXHRcdFx0XHR0bXAgPSB0aGlzLmdldF9jb250YWluZXJfdWwoKVswXS5sYXN0Q2hpbGQ7XG5cdFx0XHRcdHdoaWxlICh0bXAgJiYgdG1wLm9mZnNldEhlaWdodCA9PT0gMCkge1xuXHRcdFx0XHRcdHRtcCA9IHRoaXMuX3ByZXZpb3VzU2libGluZyh0bXApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0bXAgPyAkKHRtcCkgOiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKCFvYmogfHwgIW9iai5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoc3RyaWN0KSB7XG5cdFx0XHRcdHRtcCA9IG9ialswXTtcblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdHRtcCA9IHRoaXMuX3ByZXZpb3VzU2libGluZyh0bXApO1xuXHRcdFx0XHR9IHdoaWxlICh0bXAgJiYgdG1wLm9mZnNldEhlaWdodCA9PT0gMCk7XG5cdFx0XHRcdHJldHVybiB0bXAgPyAkKHRtcCkgOiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHRtcCA9IG9ialswXTtcblx0XHRcdGRvIHtcblx0XHRcdFx0dG1wID0gdGhpcy5fcHJldmlvdXNTaWJsaW5nKHRtcCk7XG5cdFx0XHR9IHdoaWxlICh0bXAgJiYgdG1wLm9mZnNldEhlaWdodCA9PT0gMCk7XG5cdFx0XHRpZih0bXAgIT09IG51bGwpIHtcblx0XHRcdFx0b2JqID0gJCh0bXApO1xuXHRcdFx0XHR3aGlsZShvYmouaGFzQ2xhc3MoXCJqc3RyZWUtb3BlblwiKSkge1xuXHRcdFx0XHRcdG9iaiA9IG9iai5jaGlsZHJlbihcIi5qc3RyZWUtY2hpbGRyZW5cIikuZmlyc3QoKS5jaGlsZHJlbihcIi5qc3RyZWUtbm9kZTp2aXNpYmxlOmxhc3RcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG9iajtcblx0XHRcdH1cblx0XHRcdHRtcCA9IG9ialswXS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG5cdFx0XHRyZXR1cm4gdG1wICYmIHRtcC5jbGFzc05hbWUgJiYgdG1wLmNsYXNzTmFtZS5pbmRleE9mKCdqc3RyZWUtbm9kZScpICE9PSAtMSA/ICQodG1wKSA6IGZhbHNlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IHRoZSBwYXJlbnQgSUQgb2YgYSBub2RlXG5cdFx0ICogQG5hbWUgZ2V0X3BhcmVudChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cblx0XHQgKi9cblx0XHRnZXRfcGFyZW50IDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9iai5wYXJlbnQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgYSBqUXVlcnkgY29sbGVjdGlvbiBvZiBhbGwgdGhlIGNoaWxkcmVuIG9mIGEgbm9kZSAobm9kZSBtdXN0IGJlIHJlbmRlcmVkKSwgcmV0dXJucyBmYWxzZSBvbiBlcnJvclxuXHRcdCAqIEBuYW1lIGdldF9jaGlsZHJlbl9kb20ob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtqUXVlcnl9XG5cdFx0ICovXG5cdFx0Z2V0X2NoaWxkcmVuX2RvbSA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKG9ialswXSA9PT0gdGhpcy5lbGVtZW50WzBdKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldF9jb250YWluZXJfdWwoKS5jaGlsZHJlbihcIi5qc3RyZWUtbm9kZVwiKTtcblx0XHRcdH1cblx0XHRcdGlmKCFvYmogfHwgIW9iai5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9iai5jaGlsZHJlbihcIi5qc3RyZWUtY2hpbGRyZW5cIikuY2hpbGRyZW4oXCIuanN0cmVlLW5vZGVcIik7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVja3MgaWYgYSBub2RlIGhhcyBjaGlsZHJlblxuXHRcdCAqIEBuYW1lIGlzX3BhcmVudChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXNfcGFyZW50IDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuIG9iaiAmJiAob2JqLnN0YXRlLmxvYWRlZCA9PT0gZmFsc2UgfHwgb2JqLmNoaWxkcmVuLmxlbmd0aCA+IDApO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2tzIGlmIGEgbm9kZSBpcyBsb2FkZWQgKGl0cyBjaGlsZHJlbiBhcmUgYXZhaWxhYmxlKVxuXHRcdCAqIEBuYW1lIGlzX2xvYWRlZChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXNfbG9hZGVkIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuIG9iaiAmJiBvYmouc3RhdGUubG9hZGVkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2sgaWYgYSBub2RlIGlzIGN1cnJlbnRseSBsb2FkaW5nIChmZXRjaGluZyBjaGlsZHJlbilcblx0XHQgKiBAbmFtZSBpc19sb2FkaW5nKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRpc19sb2FkaW5nIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuIG9iaiAmJiBvYmouc3RhdGUgJiYgb2JqLnN0YXRlLmxvYWRpbmc7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVjayBpZiBhIG5vZGUgaXMgb3BlbmVkXG5cdFx0ICogQG5hbWUgaXNfb3BlbihvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXNfb3BlbiA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiBvYmogJiYgb2JqLnN0YXRlLm9wZW5lZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrIGlmIGEgbm9kZSBpcyBpbiBhIGNsb3NlZCBzdGF0ZVxuXHRcdCAqIEBuYW1lIGlzX2Nsb3NlZChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXNfY2xvc2VkIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuIG9iaiAmJiB0aGlzLmlzX3BhcmVudChvYmopICYmICFvYmouc3RhdGUub3BlbmVkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2sgaWYgYSBub2RlIGhhcyBubyBjaGlsZHJlblxuXHRcdCAqIEBuYW1lIGlzX2xlYWYob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGlzX2xlYWYgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRyZXR1cm4gIXRoaXMuaXNfcGFyZW50KG9iaik7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBsb2FkcyBhIG5vZGUgKGZldGNoZXMgaXRzIGNoaWxkcmVuIHVzaW5nIHRoZSBgY29yZS5kYXRhYCBzZXR0aW5nKS4gTXVsdGlwbGUgbm9kZXMgY2FuIGJlIHBhc3NlZCB0byBieSB1c2luZyBhbiBhcnJheS5cblx0XHQgKiBAbmFtZSBsb2FkX25vZGUob2JqIFssIGNhbGxiYWNrXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHBhcmFtICB7ZnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb25jZSBsb2FkaW5nIGlzIGNvbXBsZXRlLCB0aGUgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUgYW5kIHJlY2VpdmVzIHR3byBhcmd1bWVudHMgLSB0aGUgbm9kZSBhbmQgYSBib29sZWFuIHN0YXR1c1xuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICogQHRyaWdnZXIgbG9hZF9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGxvYWRfbm9kZSA6IGZ1bmN0aW9uIChvYmosIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgaywgbCwgaSwgaiwgYztcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdHRoaXMuX2xvYWRfbm9kZXMob2JqLnNsaWNlKCksIGNhbGxiYWNrKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqKSB7XG5cdFx0XHRcdGlmKGNhbGxiYWNrKSB7IGNhbGxiYWNrLmNhbGwodGhpcywgb2JqLCBmYWxzZSk7IH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0Ly8gaWYob2JqLnN0YXRlLmxvYWRpbmcpIHsgfSAvLyB0aGUgbm9kZSBpcyBhbHJlYWR5IGxvYWRpbmcgLSBqdXN0IHdhaXQgZm9yIGl0IHRvIGxvYWQgYW5kIGludm9rZSBjYWxsYmFjaz8gYnV0IGlmIGNhbGxlZCBpbXBsaWNpdGx5IGl0IHNob3VsZCBiZSBsb2FkZWQgYWdhaW4/XG5cdFx0XHRpZihvYmouc3RhdGUubG9hZGVkKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5sb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVtvYmoucGFyZW50c1tpXV0uY2hpbGRyZW5fZCA9ICQudmFrYXRhLmFycmF5X2ZpbHRlcih0aGlzLl9tb2RlbC5kYXRhW29iai5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kLCBmdW5jdGlvbiAodikge1xuXHRcdFx0XHRcdFx0cmV0dXJuICQuaW5BcnJheSh2LCBvYmouY2hpbGRyZW5fZCkgPT09IC0xO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvcihrID0gMCwgbCA9IG9iai5jaGlsZHJlbl9kLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbb2JqLmNoaWxkcmVuX2Rba11dLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdFx0XHRjID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuX21vZGVsLmRhdGFbb2JqLmNoaWxkcmVuX2Rba11dO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjKSB7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkID0gJC52YWthdGEuYXJyYXlfZmlsdGVyKHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgZnVuY3Rpb24gKHYpIHtcblx0XHRcdFx0XHRcdHJldHVybiAkLmluQXJyYXkodiwgb2JqLmNoaWxkcmVuX2QpID09PSAtMTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRvYmouY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0b2JqLmNoaWxkcmVuX2QgPSBbXTtcblx0XHRcdFx0aWYoYykge1xuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAnbG9hZF9ub2RlJywgJ25vZGUnIDogb2JqLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRvYmouc3RhdGUuZmFpbGVkID0gZmFsc2U7XG5cdFx0XHRvYmouc3RhdGUubG9hZGluZyA9IHRydWU7XG5cdFx0XHR0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSkuYWRkQ2xhc3MoXCJqc3RyZWUtbG9hZGluZ1wiKS5hdHRyKCdhcmlhLWJ1c3knLHRydWUpO1xuXHRcdFx0dGhpcy5fbG9hZF9ub2RlKG9iaiwgJC5wcm94eShmdW5jdGlvbiAoc3RhdHVzKSB7XG5cdFx0XHRcdG9iaiA9IHRoaXMuX21vZGVsLmRhdGFbb2JqLmlkXTtcblx0XHRcdFx0b2JqLnN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0b2JqLnN0YXRlLmxvYWRlZCA9IHN0YXR1cztcblx0XHRcdFx0b2JqLnN0YXRlLmZhaWxlZCA9ICFvYmouc3RhdGUubG9hZGVkO1xuXHRcdFx0XHR2YXIgZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpLCBpID0gMCwgaiA9IDAsIG0gPSB0aGlzLl9tb2RlbC5kYXRhLCBoYXNfY2hpbGRyZW4gPSBmYWxzZTtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKG1bb2JqLmNoaWxkcmVuW2ldXSAmJiAhbVtvYmouY2hpbGRyZW5baV1dLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRcdFx0aGFzX2NoaWxkcmVuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZihvYmouc3RhdGUubG9hZGVkICYmIGRvbSAmJiBkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKCdqc3RyZWUtY2xvc2VkIGpzdHJlZS1vcGVuIGpzdHJlZS1sZWFmJyk7XG5cdFx0XHRcdFx0aWYgKCFoYXNfY2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdGRvbS5hZGRDbGFzcygnanN0cmVlLWxlYWYnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAob2JqLmlkICE9PSAnIycpIHtcblx0XHRcdFx0XHRcdFx0ZG9tLmFkZENsYXNzKG9iai5zdGF0ZS5vcGVuZWQgPyAnanN0cmVlLW9wZW4nIDogJ2pzdHJlZS1jbG9zZWQnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKFwianN0cmVlLWxvYWRpbmdcIikuYXR0cignYXJpYS1idXN5JyxmYWxzZSk7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgYWZ0ZXIgYSBub2RlIGlzIGxvYWRlZFxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgbG9hZF9ub2RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgbm9kZSB0aGF0IHdhcyBsb2FkaW5nXG5cdFx0XHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RhdHVzIHdhcyB0aGUgbm9kZSBsb2FkZWQgc3VjY2Vzc2Z1bGx5XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2xvYWRfbm9kZScsIHsgXCJub2RlXCIgOiBvYmosIFwic3RhdHVzXCIgOiBzdGF0dXMgfSk7XG5cdFx0XHRcdGlmKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBvYmosIHN0YXR1cyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogbG9hZCBhbiBhcnJheSBvZiBub2RlcyAod2lsbCBhbHNvIGxvYWQgdW5hdmFpbGFibGUgbm9kZXMgYXMgc29vbiBhcyB0aGV5IGFwcGVhciBpbiB0aGUgc3RydWN0dXJlKS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX2xvYWRfbm9kZXMobm9kZXMgWywgY2FsbGJhY2tdKVxuXHRcdCAqIEBwYXJhbSAge2FycmF5fSBub2Rlc1xuXHRcdCAqIEBwYXJhbSAge2Z1bmN0aW9ufSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIG9uY2UgbG9hZGluZyBpcyBjb21wbGV0ZSwgdGhlIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlIGFuZCByZWNlaXZlcyBvbmUgYXJndW1lbnQgLSB0aGUgYXJyYXkgcGFzc2VkIHRvIF9sb2FkX25vZGVzXG5cdFx0ICovXG5cdFx0X2xvYWRfbm9kZXMgOiBmdW5jdGlvbiAobm9kZXMsIGNhbGxiYWNrLCBpc19jYWxsYmFjaywgZm9yY2VfcmVsb2FkKSB7XG5cdFx0XHR2YXIgciA9IHRydWUsXG5cdFx0XHRcdGMgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX2xvYWRfbm9kZXMobm9kZXMsIGNhbGxiYWNrLCB0cnVlKTsgfSxcblx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsIGksIGosIHRtcCA9IFtdO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gbm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKG1bbm9kZXNbaV1dICYmICggKCFtW25vZGVzW2ldXS5zdGF0ZS5sb2FkZWQgJiYgIW1bbm9kZXNbaV1dLnN0YXRlLmZhaWxlZCkgfHwgKCFpc19jYWxsYmFjayAmJiBmb3JjZV9yZWxvYWQpICkpIHtcblx0XHRcdFx0XHRpZighdGhpcy5pc19sb2FkaW5nKG5vZGVzW2ldKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5sb2FkX25vZGUobm9kZXNbaV0sIGMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKHIpIHtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gbm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYobVtub2Rlc1tpXV0gJiYgbVtub2Rlc1tpXV0uc3RhdGUubG9hZGVkKSB7XG5cdFx0XHRcdFx0XHR0bXAucHVzaChub2Rlc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGNhbGxiYWNrICYmICFjYWxsYmFjay5kb25lKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCB0bXApO1xuXHRcdFx0XHRcdGNhbGxiYWNrLmRvbmUgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBsb2FkcyBhbGwgdW5sb2FkZWQgbm9kZXNcblx0XHQgKiBAbmFtZSBsb2FkX2FsbChbb2JqLCBjYWxsYmFja10pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGxvYWQgcmVjdXJzaXZlbHksIG9taXQgdG8gbG9hZCBhbGwgbm9kZXMgaW4gdGhlIHRyZWVcblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIG9uY2UgbG9hZGluZyBhbGwgdGhlIG5vZGVzIGlzIGNvbXBsZXRlLFxuXHRcdCAqIEB0cmlnZ2VyIGxvYWRfYWxsLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGxvYWRfYWxsIDogZnVuY3Rpb24gKG9iaiwgY2FsbGJhY2spIHtcblx0XHRcdGlmKCFvYmopIHsgb2JqID0gJC5qc3RyZWUucm9vdDsgfVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciB0b19sb2FkID0gW10sXG5cdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRjID0gbVtvYmouaWRdLmNoaWxkcmVuX2QsXG5cdFx0XHRcdGksIGo7XG5cdFx0XHRpZihvYmouc3RhdGUgJiYgIW9iai5zdGF0ZS5sb2FkZWQpIHtcblx0XHRcdFx0dG9fbG9hZC5wdXNoKG9iai5pZCk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBjLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZihtW2NbaV1dICYmIG1bY1tpXV0uc3RhdGUgJiYgIW1bY1tpXV0uc3RhdGUubG9hZGVkKSB7XG5cdFx0XHRcdFx0dG9fbG9hZC5wdXNoKGNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZih0b19sb2FkLmxlbmd0aCkge1xuXHRcdFx0XHR0aGlzLl9sb2FkX25vZGVzKHRvX2xvYWQsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0aGlzLmxvYWRfYWxsKG9iaiwgY2FsbGJhY2spO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIGFmdGVyIGEgbG9hZF9hbGwgY2FsbCBjb21wbGV0ZXNcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIGxvYWRfYWxsLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgcmVjdXJzaXZlbHkgbG9hZGVkIG5vZGVcblx0XHRcdFx0ICovXG5cdFx0XHRcdGlmKGNhbGxiYWNrKSB7IGNhbGxiYWNrLmNhbGwodGhpcywgb2JqKTsgfVxuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2xvYWRfYWxsJywgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGhhbmRsZXMgdGhlIGFjdHVhbCBsb2FkaW5nIG9mIGEgbm9kZS4gVXNlZCBvbmx5IGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfbG9hZF9ub2RlKG9iaiBbLCBjYWxsYmFja10pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEBwYXJhbSAge2Z1bmN0aW9ufSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIG9uY2UgbG9hZGluZyBpcyBjb21wbGV0ZSwgdGhlIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlIGFuZCByZWNlaXZlcyBvbmUgYXJndW1lbnQgLSBhIGJvb2xlYW4gc3RhdHVzXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRfbG9hZF9ub2RlIDogZnVuY3Rpb24gKG9iaiwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBzID0gdGhpcy5zZXR0aW5ncy5jb3JlLmRhdGEsIHQ7XG5cdFx0XHR2YXIgbm90VGV4dE9yQ29tbWVudE5vZGUgPSBmdW5jdGlvbiBub3RUZXh0T3JDb21tZW50Tm9kZSAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVUeXBlICE9PSAzICYmIHRoaXMubm9kZVR5cGUgIT09IDg7XG5cdFx0XHR9O1xuXHRcdFx0Ly8gdXNlIG9yaWdpbmFsIEhUTUxcblx0XHRcdGlmKCFzKSB7XG5cdFx0XHRcdGlmKG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLl9hcHBlbmRfaHRtbF9kYXRhKG9iaiwgdGhpcy5fZGF0YS5jb3JlLm9yaWdpbmFsX2NvbnRhaW5lcl9odG1sLmNsb25lKHRydWUpLCBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIHN0YXR1cyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCA/IHRoaXMuX2FwcGVuZF9odG1sX2RhdGEob2JqLCB0aGlzLl9kYXRhLmNvcmUub3JpZ2luYWxfY29udGFpbmVyX2h0bWwuY2xvbmUodHJ1ZSkpIDogZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0aWYoJC5pc0Z1bmN0aW9uKHMpKSB7XG5cdFx0XHRcdHJldHVybiBzLmNhbGwodGhpcywgb2JqLCAkLnByb3h5KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0aWYoZCA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXNbdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gJ19hcHBlbmRfaHRtbF9kYXRhJyA6ICdfYXBwZW5kX2pzb25fZGF0YSddKG9iaiwgdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gJCgkLnBhcnNlSFRNTChkKSkuZmlsdGVyKG5vdFRleHRPckNvbW1lbnROb2RlKSA6IGQsIGZ1bmN0aW9uIChzdGF0dXMpIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBzdGF0dXMpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIHJldHVybiBkID09PSBmYWxzZSA/IGNhbGxiYWNrLmNhbGwodGhpcywgZmFsc2UpIDogY2FsbGJhY2suY2FsbCh0aGlzLCB0aGlzW3R5cGVvZiBkID09PSAnc3RyaW5nJyA/ICdfYXBwZW5kX2h0bWxfZGF0YScgOiAnX2FwcGVuZF9qc29uX2RhdGEnXShvYmosIHR5cGVvZiBkID09PSAnc3RyaW5nJyA/ICQoZCkgOiBkKSk7XG5cdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiBzID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRpZihzLnVybCkge1xuXHRcdFx0XHRcdHMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgcyk7XG5cdFx0XHRcdFx0aWYoJC5pc0Z1bmN0aW9uKHMudXJsKSkge1xuXHRcdFx0XHRcdFx0cy51cmwgPSBzLnVybC5jYWxsKHRoaXMsIG9iaik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKCQuaXNGdW5jdGlvbihzLmRhdGEpKSB7XG5cdFx0XHRcdFx0XHRzLmRhdGEgPSBzLmRhdGEuY2FsbCh0aGlzLCBvYmopO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gJC5hamF4KHMpXG5cdFx0XHRcdFx0XHQuZG9uZSgkLnByb3h5KGZ1bmN0aW9uIChkLHQseCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciB0eXBlID0geC5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoKHR5cGUgJiYgdHlwZS5pbmRleE9mKCdqc29uJykgIT09IC0xKSB8fCB0eXBlb2YgZCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2FwcGVuZF9qc29uX2RhdGEob2JqLCBkLCBmdW5jdGlvbiAoc3RhdHVzKSB7IGNhbGxiYWNrLmNhbGwodGhpcywgc3RhdHVzKTsgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHQvL3JldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuX2FwcGVuZF9qc29uX2RhdGEob2JqLCBkKSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmKCh0eXBlICYmIHR5cGUuaW5kZXhPZignaHRtbCcpICE9PSAtMSkgfHwgdHlwZW9mIGQgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl9hcHBlbmRfaHRtbF9kYXRhKG9iaiwgJCgkLnBhcnNlSFRNTChkKSkuZmlsdGVyKG5vdFRleHRPckNvbW1lbnROb2RlKSwgZnVuY3Rpb24gKHN0YXR1cykgeyBjYWxsYmFjay5jYWxsKHRoaXMsIHN0YXR1cyk7IH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgdGhpcy5fYXBwZW5kX2h0bWxfZGF0YShvYmosICQoZCkpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnYWpheCcsICdwbHVnaW4nIDogJ2NvcmUnLCAnaWQnIDogJ2NvcmVfMDQnLCAncmVhc29uJyA6ICdDb3VsZCBub3QgbG9hZCBub2RlJywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnaWQnIDogb2JqLmlkLCAneGhyJyA6IHggfSkgfTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0XHRcdC5mYWlsKCQucHJveHkoZnVuY3Rpb24gKGYpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdhamF4JywgJ3BsdWdpbicgOiAnY29yZScsICdpZCcgOiAnY29yZV8wNCcsICdyZWFzb24nIDogJ0NvdWxkIG5vdCBsb2FkIG5vZGUnLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdpZCcgOiBvYmouaWQsICd4aHInIDogZiB9KSB9O1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICgkLmlzQXJyYXkocykpIHtcblx0XHRcdFx0XHR0ID0gJC5leHRlbmQodHJ1ZSwgW10sIHMpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCQuaXNQbGFpbk9iamVjdChzKSkge1xuXHRcdFx0XHRcdHQgPSAkLmV4dGVuZCh0cnVlLCB7fSwgcyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dCA9IHM7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYob2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2FwcGVuZF9qc29uX2RhdGEob2JqLCB0LCBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIHN0YXR1cyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnbm9kYXRhJywgJ3BsdWdpbicgOiAnY29yZScsICdpZCcgOiAnY29yZV8wNScsICdyZWFzb24nIDogJ0NvdWxkIG5vdCBsb2FkIG5vZGUnLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdpZCcgOiBvYmouaWQgfSkgfTtcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgKG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCA/IHRoaXMuX2FwcGVuZF9qc29uX2RhdGEob2JqLCB0KSA6IGZhbHNlKSApO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIHMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGlmKG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLl9hcHBlbmRfaHRtbF9kYXRhKG9iaiwgJCgkLnBhcnNlSFRNTChzKSkuZmlsdGVyKG5vdFRleHRPckNvbW1lbnROb2RlKSwgZnVuY3Rpb24gKHN0YXR1cykge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBzdGF0dXMpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ25vZGF0YScsICdwbHVnaW4nIDogJ2NvcmUnLCAnaWQnIDogJ2NvcmVfMDYnLCAncmVhc29uJyA6ICdDb3VsZCBub3QgbG9hZCBub2RlJywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnaWQnIDogb2JqLmlkIH0pIH07XG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL3JldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIChvYmouaWQgPT09ICQuanN0cmVlLnJvb3QgPyB0aGlzLl9hcHBlbmRfaHRtbF9kYXRhKG9iaiwgJChzKSkgOiBmYWxzZSkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMsIGZhbHNlKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGFkZHMgYSBub2RlIHRvIHRoZSBsaXN0IG9mIG5vZGVzIHRvIHJlZHJhdy4gVXNlZCBvbmx5IGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfbm9kZV9jaGFuZ2VkKG9iaiBbLCBjYWxsYmFja10pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqL1xuXHRcdF9ub2RlX2NoYW5nZWQgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG4gICAgICBpZiAob2JqICYmICQuaW5BcnJheShvYmouaWQsIHRoaXMuX21vZGVsLmNoYW5nZWQpID09PSAtMSkge1xuXHRcdFx0XHR0aGlzLl9tb2RlbC5jaGFuZ2VkLnB1c2gob2JqLmlkKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGFwcGVuZHMgSFRNTCBjb250ZW50IHRvIHRoZSB0cmVlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfYXBwZW5kX2h0bWxfZGF0YShvYmosIGRhdGEpXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBhcHBlbmQgdG9cblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGRhdGEgdGhlIEhUTUwgc3RyaW5nIHRvIHBhcnNlIGFuZCBhcHBlbmRcblx0XHQgKiBAdHJpZ2dlciBtb2RlbC5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICovXG5cdFx0X2FwcGVuZF9odG1sX2RhdGEgOiBmdW5jdGlvbiAoZG9tLCBkYXRhLCBjYikge1xuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShkb20pO1xuXHRcdFx0ZG9tLmNoaWxkcmVuID0gW107XG5cdFx0XHRkb20uY2hpbGRyZW5fZCA9IFtdO1xuXHRcdFx0dmFyIGRhdCA9IGRhdGEuaXMoJ3VsJykgPyBkYXRhLmNoaWxkcmVuKCkgOiBkYXRhLFxuXHRcdFx0XHRwYXIgPSBkb20uaWQsXG5cdFx0XHRcdGNoZCA9IFtdLFxuXHRcdFx0XHRkcGMgPSBbXSxcblx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdHAgPSBtW3Bhcl0sXG5cdFx0XHRcdHMgPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQubGVuZ3RoLFxuXHRcdFx0XHR0bXAsIGksIGo7XG5cdFx0XHRkYXQuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuX3BhcnNlX21vZGVsX2Zyb21faHRtbCgkKHYpLCBwYXIsIHAucGFyZW50cy5jb25jYXQoKSk7XG5cdFx0XHRcdGlmKHRtcCkge1xuXHRcdFx0XHRcdGNoZC5wdXNoKHRtcCk7XG5cdFx0XHRcdFx0ZHBjLnB1c2godG1wKTtcblx0XHRcdFx0XHRpZihtW3RtcF0uY2hpbGRyZW5fZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGRwYyA9IGRwYy5jb25jYXQobVt0bXBdLmNoaWxkcmVuX2QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0cC5jaGlsZHJlbiA9IGNoZDtcblx0XHRcdHAuY2hpbGRyZW5fZCA9IGRwYztcblx0XHRcdGZvcihpID0gMCwgaiA9IHAucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0bVtwLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QgPSBtW3AucGFyZW50c1tpXV0uY2hpbGRyZW5fZC5jb25jYXQoZHBjKTtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gbmV3IGRhdGEgaXMgaW5zZXJ0ZWQgdG8gdGhlIHRyZWUgbW9kZWxcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgbW9kZWwuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBhbiBhcnJheSBvZiBub2RlIElEc1xuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmVudCB0aGUgcGFyZW50IElEIG9mIHRoZSBub2Rlc1xuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ21vZGVsJywgeyBcIm5vZGVzXCIgOiBkcGMsICdwYXJlbnQnIDogcGFyIH0pO1xuXHRcdFx0aWYocGFyICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHRoaXMuX25vZGVfY2hhbmdlZChwYXIpO1xuXHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmNoaWxkcmVuKCcuanN0cmVlLWluaXRpYWwtbm9kZScpLnJlbW92ZSgpO1xuXHRcdFx0XHR0aGlzLnJlZHJhdyh0cnVlKTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5sZW5ndGggIT09IHMpIHtcblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdtb2RlbCcsICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgfSk7XG5cdFx0XHR9XG5cdFx0XHRjYi5jYWxsKHRoaXMsIHRydWUpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogYXBwZW5kcyBKU09OIGNvbnRlbnQgdG8gdGhlIHRyZWUuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9hcHBlbmRfanNvbl9kYXRhKG9iaiwgZGF0YSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGFwcGVuZCB0b1xuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gZGF0YSB0aGUgSlNPTiBvYmplY3QgdG8gcGFyc2UgYW5kIGFwcGVuZFxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGZvcmNlX3Byb2Nlc3NpbmcgaW50ZXJuYWwgcGFyYW0gLSBkbyBub3Qgc2V0XG5cdFx0ICogQHRyaWdnZXIgbW9kZWwuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdF9hcHBlbmRfanNvbl9kYXRhIDogZnVuY3Rpb24gKGRvbSwgZGF0YSwgY2IsIGZvcmNlX3Byb2Nlc3NpbmcpIHtcblx0XHRcdGlmKHRoaXMuZWxlbWVudCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUoZG9tKTtcblx0XHRcdGRvbS5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0ZG9tLmNoaWxkcmVuX2QgPSBbXTtcblx0XHRcdC8vIColJEAhISFcblx0XHRcdGlmKGRhdGEuZCkge1xuXHRcdFx0XHRkYXRhID0gZGF0YS5kO1xuXHRcdFx0XHRpZih0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZighJC5pc0FycmF5KGRhdGEpKSB7IGRhdGEgPSBbZGF0YV07IH1cblx0XHRcdHZhciB3ID0gbnVsbCxcblx0XHRcdFx0YXJncyA9IHtcblx0XHRcdFx0XHQnZGYnXHQ6IHRoaXMuX21vZGVsLmRlZmF1bHRfc3RhdGUsXG5cdFx0XHRcdFx0J2RhdCdcdDogZGF0YSxcblx0XHRcdFx0XHQncGFyJ1x0OiBkb20uaWQsXG5cdFx0XHRcdFx0J20nXHRcdDogdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0XHQndF9pZCdcdDogdGhpcy5faWQsXG5cdFx0XHRcdFx0J3RfY250J1x0OiB0aGlzLl9jbnQsXG5cdFx0XHRcdFx0J3NlbCdcdDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGluc3QgPSB0aGlzLFxuXHRcdFx0XHRmdW5jID0gZnVuY3Rpb24gKGRhdGEsIHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGlmKGRhdGEuZGF0YSkgeyBkYXRhID0gZGF0YS5kYXRhOyB9XG5cdFx0XHRcdFx0dmFyIGRhdCA9IGRhdGEuZGF0LFxuXHRcdFx0XHRcdFx0cGFyID0gZGF0YS5wYXIsXG5cdFx0XHRcdFx0XHRjaGQgPSBbXSxcblx0XHRcdFx0XHRcdGRwYyA9IFtdLFxuXHRcdFx0XHRcdFx0YWRkID0gW10sXG5cdFx0XHRcdFx0XHRkZiA9IGRhdGEuZGYsXG5cdFx0XHRcdFx0XHR0X2lkID0gZGF0YS50X2lkLFxuXHRcdFx0XHRcdFx0dF9jbnQgPSBkYXRhLnRfY250LFxuXHRcdFx0XHRcdFx0bSA9IGRhdGEubSxcblx0XHRcdFx0XHRcdHAgPSBtW3Bhcl0sXG5cdFx0XHRcdFx0XHRzZWwgPSBkYXRhLnNlbCxcblx0XHRcdFx0XHRcdHRtcCwgaSwgaiwgcnNsdCxcblx0XHRcdFx0XHRcdHBhcnNlX2ZsYXQgPSBmdW5jdGlvbiAoZCwgcCwgcHMpIHtcblx0XHRcdFx0XHRcdFx0aWYoIXBzKSB7IHBzID0gW107IH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7IHBzID0gcHMuY29uY2F0KCk7IH1cblx0XHRcdFx0XHRcdFx0aWYocCkgeyBwcy51bnNoaWZ0KHApOyB9XG5cdFx0XHRcdFx0XHRcdHZhciB0aWQgPSBkLmlkLnRvU3RyaW5nKCksXG5cdFx0XHRcdFx0XHRcdFx0aSwgaiwgYywgZSxcblx0XHRcdFx0XHRcdFx0XHR0bXAgPSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZFx0XHRcdDogdGlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dFx0XHQ6IGQudGV4dCB8fCAnJyxcblx0XHRcdFx0XHRcdFx0XHRcdGljb25cdFx0OiBkLmljb24gIT09IHVuZGVmaW5lZCA/IGQuaWNvbiA6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXJlbnRcdFx0OiBwLFxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyZW50c1x0XHQ6IHBzLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5cdDogZC5jaGlsZHJlbiB8fCBbXSxcblx0XHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2RcdDogZC5jaGlsZHJlbl9kIHx8IFtdLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YVx0XHQ6IGQuZGF0YSxcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlXHRcdDogeyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0bGlfYXR0clx0XHQ6IHsgaWQgOiBmYWxzZSB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0YV9hdHRyXHRcdDogeyBocmVmIDogJyMnIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbFx0OiBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGZvcihpIGluIGRmKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYoZGYuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGRmW2ldO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuZGF0YSAmJiBkLmRhdGEuanN0cmVlICYmIGQuZGF0YS5qc3RyZWUuaWNvbikge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5pY29uID0gZC5kYXRhLmpzdHJlZS5pY29uO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKHRtcC5pY29uID09PSB1bmRlZmluZWQgfHwgdG1wLmljb24gPT09IG51bGwgfHwgdG1wLmljb24gPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuaWNvbiA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuZGF0YSA9IGQuZGF0YTtcblx0XHRcdFx0XHRcdFx0XHRpZihkLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSBpbiBkLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGQuZGF0YS5qc3RyZWUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkLmRhdGEuanN0cmVlW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgdHlwZW9mIGQuc3RhdGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChpIGluIGQuc3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGQuc3RhdGUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZC5zdGF0ZVtpXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5saV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAoaSBpbiBkLmxpX2F0dHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGQubGlfYXR0ci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAubGlfYXR0cltpXSA9IGQubGlfYXR0cltpXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoIXRtcC5saV9hdHRyLmlkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmxpX2F0dHIuaWQgPSB0aWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5hX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChpIGluIGQuYV9hdHRyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkLmFfYXR0ci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuYV9hdHRyW2ldID0gZC5hX2F0dHJbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5jaGlsZHJlbiAmJiBkLmNoaWxkcmVuID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlLmxvYWRlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gW107XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bVt0bXAuaWRdID0gdG1wO1xuXHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0YyA9IHBhcnNlX2ZsYXQobVt0bXAuY2hpbGRyZW5baV1dLCB0bXAuaWQsIHBzKTtcblx0XHRcdFx0XHRcdFx0XHRlID0gbVtjXTtcblx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW5fZC5wdXNoKGMpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGUuY2hpbGRyZW5fZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gdG1wLmNoaWxkcmVuX2QuY29uY2F0KGUuY2hpbGRyZW5fZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBkLmRhdGE7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBkLmNoaWxkcmVuO1xuXHRcdFx0XHRcdFx0XHRtW3RtcC5pZF0ub3JpZ2luYWwgPSBkO1xuXHRcdFx0XHRcdFx0XHRpZih0bXAuc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRhZGQucHVzaCh0bXAuaWQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0bXAuaWQ7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0cGFyc2VfbmVzdCA9IGZ1bmN0aW9uIChkLCBwLCBwcykge1xuXHRcdFx0XHRcdFx0XHRpZighcHMpIHsgcHMgPSBbXTsgfVxuXHRcdFx0XHRcdFx0XHRlbHNlIHsgcHMgPSBwcy5jb25jYXQoKTsgfVxuXHRcdFx0XHRcdFx0XHRpZihwKSB7IHBzLnVuc2hpZnQocCk7IH1cblx0XHRcdFx0XHRcdFx0dmFyIHRpZCA9IGZhbHNlLCBpLCBqLCBjLCBlLCB0bXA7XG5cdFx0XHRcdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRcdFx0XHR0aWQgPSAnaicgKyB0X2lkICsgJ18nICsgKCsrdF9jbnQpO1xuXHRcdFx0XHRcdFx0XHR9IHdoaWxlKG1bdGlkXSk7XG5cblx0XHRcdFx0XHRcdFx0dG1wID0ge1xuXHRcdFx0XHRcdFx0XHRcdGlkXHRcdFx0OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHR0ZXh0XHRcdDogdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gZCA6ICcnLFxuXHRcdFx0XHRcdFx0XHRcdGljb25cdFx0OiB0eXBlb2YgZCA9PT0gJ29iamVjdCcgJiYgZC5pY29uICE9PSB1bmRlZmluZWQgPyBkLmljb24gOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudFx0XHQ6IHAsXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50c1x0XHQ6IHBzLFxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuXHQ6IFtdLFxuXHRcdFx0XHRcdFx0XHRcdGNoaWxkcmVuX2RcdDogW10sXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YVx0XHQ6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0c3RhdGVcdFx0OiB7IH0sXG5cdFx0XHRcdFx0XHRcdFx0bGlfYXR0clx0XHQ6IHsgaWQgOiBmYWxzZSB9LFxuXHRcdFx0XHRcdFx0XHRcdGFfYXR0clx0XHQ6IHsgaHJlZiA6ICcjJyB9LFxuXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsXHQ6IGZhbHNlXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGZvcihpIGluIGRmKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYoZGYuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGRmW2ldO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuaWQpIHsgdG1wLmlkID0gZC5pZC50b1N0cmluZygpOyB9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC50ZXh0KSB7IHRtcC50ZXh0ID0gZC50ZXh0OyB9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5kYXRhICYmIGQuZGF0YS5qc3RyZWUgJiYgZC5kYXRhLmpzdHJlZS5pY29uKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmljb24gPSBkLmRhdGEuanN0cmVlLmljb247XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYodG1wLmljb24gPT09IHVuZGVmaW5lZCB8fCB0bXAuaWNvbiA9PT0gbnVsbCB8fCB0bXAuaWNvbiA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5pY29uID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5kYXRhID0gZC5kYXRhO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGQuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvcihpIGluIGQuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoZC5kYXRhLmpzdHJlZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGQuZGF0YS5qc3RyZWVbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5zdGF0ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgaW4gZC5zdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoZC5zdGF0ZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkLnN0YXRlW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIHR5cGVvZiBkLmxpX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChpIGluIGQubGlfYXR0cikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoZC5saV9hdHRyLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5saV9hdHRyW2ldID0gZC5saV9hdHRyW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZih0bXAubGlfYXR0ci5pZCAmJiAhdG1wLmlkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmlkID0gdG1wLmxpX2F0dHIuaWQudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZighdG1wLmlkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmlkID0gdGlkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKCF0bXAubGlfYXR0ci5pZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5saV9hdHRyLmlkID0gdG1wLmlkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgdHlwZW9mIGQuYV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAoaSBpbiBkLmFfYXR0cikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoZC5hX2F0dHIuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmFfYXR0cltpXSA9IGQuYV9hdHRyW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuY2hpbGRyZW4gJiYgZC5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0YyA9IHBhcnNlX25lc3QoZC5jaGlsZHJlbltpXSwgdG1wLmlkLCBwcyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlID0gbVtjXTtcblx0XHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbi5wdXNoKGMpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoZS5jaGlsZHJlbl9kLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IHRtcC5jaGlsZHJlbl9kLmNvbmNhdChlLmNoaWxkcmVuX2QpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IHRtcC5jaGlsZHJlbl9kLmNvbmNhdCh0bXAuY2hpbGRyZW4pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5jaGlsZHJlbiAmJiBkLmNoaWxkcmVuID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlLmxvYWRlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gW107XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGQuZGF0YTtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGQuY2hpbGRyZW47XG5cdFx0XHRcdFx0XHRcdHRtcC5vcmlnaW5hbCA9IGQ7XG5cdFx0XHRcdFx0XHRcdG1bdG1wLmlkXSA9IHRtcDtcblx0XHRcdFx0XHRcdFx0aWYodG1wLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0YWRkLnB1c2godG1wLmlkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdG1wLmlkO1xuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGlmKGRhdC5sZW5ndGggJiYgZGF0WzBdLmlkICE9PSB1bmRlZmluZWQgJiYgZGF0WzBdLnBhcmVudCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHQvLyBGbGF0IEpTT04gc3VwcG9ydCAoZm9yIGVhc3kgaW1wb3J0IGZyb20gREIpOlxuXHRcdFx0XHRcdFx0Ly8gMSkgY29udmVydCB0byBvYmplY3QgKGZvcmVhY2gpXG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkYXQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmKCFkYXRbaV0uY2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRbaV0uY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZighZGF0W2ldLnN0YXRlKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0W2ldLnN0YXRlID0ge307XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bVtkYXRbaV0uaWQudG9TdHJpbmcoKV0gPSBkYXRbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvLyAyKSBwb3B1bGF0ZSBjaGlsZHJlbiAoZm9yZWFjaClcblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRhdC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aWYgKCFtW2RhdFtpXS5wYXJlbnQudG9TdHJpbmcoKV0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGluc3QgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGluc3QuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ3BhcnNlJywgJ3BsdWdpbicgOiAnY29yZScsICdpZCcgOiAnY29yZV8wNycsICdyZWFzb24nIDogJ05vZGUgd2l0aCBpbnZhbGlkIHBhcmVudCcsICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2lkJyA6IGRhdFtpXS5pZC50b1N0cmluZygpLCAncGFyZW50JyA6IGRhdFtpXS5wYXJlbnQudG9TdHJpbmcoKSB9KSB9O1xuXHRcdFx0XHRcdFx0XHRcdFx0aW5zdC5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwoaW5zdCwgaW5zdC5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdG1bZGF0W2ldLnBhcmVudC50b1N0cmluZygpXS5jaGlsZHJlbi5wdXNoKGRhdFtpXS5pZC50b1N0cmluZygpKTtcblx0XHRcdFx0XHRcdFx0Ly8gcG9wdWxhdGUgcGFyZW50LmNoaWxkcmVuX2Rcblx0XHRcdFx0XHRcdFx0cC5jaGlsZHJlbl9kLnB1c2goZGF0W2ldLmlkLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly8gMykgbm9ybWFsaXplICYmIHBvcHVsYXRlIHBhcmVudHMgYW5kIGNoaWxkcmVuX2Qgd2l0aCByZWN1cnNpb25cblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHAuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHRtcCA9IHBhcnNlX2ZsYXQobVtwLmNoaWxkcmVuW2ldXSwgcGFyLCBwLnBhcmVudHMuY29uY2F0KCkpO1xuXHRcdFx0XHRcdFx0XHRkcGMucHVzaCh0bXApO1xuXHRcdFx0XHRcdFx0XHRpZihtW3RtcF0uY2hpbGRyZW5fZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRkcGMgPSBkcGMuY29uY2F0KG1bdG1wXS5jaGlsZHJlbl9kKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRtW3AucGFyZW50c1tpXV0uY2hpbGRyZW5fZCA9IG1bcC5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kLmNvbmNhdChkcGMpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly8gPykgdGhyZWVfc3RhdGUgc2VsZWN0aW9uIC0gcC5zdGF0ZS5zZWxlY3RlZCAmJiB0IC0gKGlmIHRocmVlX3N0YXRlIGZvcmVhY2goZGF0ID0+IGNoKSAtPiBmb3JlYWNoKHBhcmVudHMpIGlmKHBhcmVudC5zZWxlY3RlZCkgY2hpbGQuc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0cnNsdCA9IHtcblx0XHRcdFx0XHRcdFx0J2NudCcgOiB0X2NudCxcblx0XHRcdFx0XHRcdFx0J21vZCcgOiBtLFxuXHRcdFx0XHRcdFx0XHQnc2VsJyA6IHNlbCxcblx0XHRcdFx0XHRcdFx0J3BhcicgOiBwYXIsXG5cdFx0XHRcdFx0XHRcdCdkcGMnIDogZHBjLFxuXHRcdFx0XHRcdFx0XHQnYWRkJyA6IGFkZFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkYXQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHRtcCA9IHBhcnNlX25lc3QoZGF0W2ldLCBwYXIsIHAucGFyZW50cy5jb25jYXQoKSk7XG5cdFx0XHRcdFx0XHRcdGlmKHRtcCkge1xuXHRcdFx0XHRcdFx0XHRcdGNoZC5wdXNoKHRtcCk7XG5cdFx0XHRcdFx0XHRcdFx0ZHBjLnB1c2godG1wKTtcblx0XHRcdFx0XHRcdFx0XHRpZihtW3RtcF0uY2hpbGRyZW5fZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGRwYyA9IGRwYy5jb25jYXQobVt0bXBdLmNoaWxkcmVuX2QpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cC5jaGlsZHJlbiA9IGNoZDtcblx0XHRcdFx0XHRcdHAuY2hpbGRyZW5fZCA9IGRwYztcblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHAucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0bVtwLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QgPSBtW3AucGFyZW50c1tpXV0uY2hpbGRyZW5fZC5jb25jYXQoZHBjKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJzbHQgPSB7XG5cdFx0XHRcdFx0XHRcdCdjbnQnIDogdF9jbnQsXG5cdFx0XHRcdFx0XHRcdCdtb2QnIDogbSxcblx0XHRcdFx0XHRcdFx0J3NlbCcgOiBzZWwsXG5cdFx0XHRcdFx0XHRcdCdwYXInIDogcGFyLFxuXHRcdFx0XHRcdFx0XHQnZHBjJyA6IGRwYyxcblx0XHRcdFx0XHRcdFx0J2FkZCcgOiBhZGRcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRwb3N0TWVzc2FnZShyc2x0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcnNsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJzbHQgPSBmdW5jdGlvbiAocnNsdCwgd29ya2VyKSB7XG5cdFx0XHRcdFx0aWYodGhpcy5lbGVtZW50ID09PSBudWxsKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdHRoaXMuX2NudCA9IHJzbHQuY250O1xuXHRcdFx0XHRcdHZhciBpLCBtID0gdGhpcy5fbW9kZWwuZGF0YTtcblx0XHRcdFx0XHRmb3IgKGkgaW4gbSkge1xuXHRcdFx0XHRcdFx0aWYgKG0uaGFzT3duUHJvcGVydHkoaSkgJiYgbVtpXS5zdGF0ZSAmJiBtW2ldLnN0YXRlLmxvYWRpbmcgJiYgcnNsdC5tb2RbaV0pIHtcblx0XHRcdFx0XHRcdFx0cnNsdC5tb2RbaV0uc3RhdGUubG9hZGluZyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX21vZGVsLmRhdGEgPSByc2x0Lm1vZDsgLy8gYnJlYWtzIHRoZSByZWZlcmVuY2UgaW4gbG9hZF9ub2RlIC0gY2FyZWZ1bFxuXG5cdFx0XHRcdFx0aWYod29ya2VyKSB7XG5cdFx0XHRcdFx0XHR2YXIgaiwgYSA9IHJzbHQuYWRkLCByID0gcnNsdC5zZWwsIHMgPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuc2xpY2UoKTtcblx0XHRcdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhO1xuXHRcdFx0XHRcdFx0Ly8gaWYgc2VsZWN0aW9uIHdhcyBjaGFuZ2VkIHdoaWxlIGNhbGN1bGF0aW5nIGluIHdvcmtlclxuXHRcdFx0XHRcdFx0aWYoci5sZW5ndGggIT09IHMubGVuZ3RoIHx8ICQudmFrYXRhLmFycmF5X3VuaXF1ZShyLmNvbmNhdChzKSkubGVuZ3RoICE9PSByLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHQvLyBkZXNlbGVjdCBub2RlcyB0aGF0IGFyZSBubyBsb25nZXIgc2VsZWN0ZWRcblx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gci5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZigkLmluQXJyYXkocltpXSwgYSkgPT09IC0xICYmICQuaW5BcnJheShyW2ldLCBzKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG1bcltpXV0uc3RhdGUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Ly8gc2VsZWN0IG5vZGVzIHRoYXQgd2VyZSBzZWxlY3RlZCBpbiB0aGUgbWVhbiB0aW1lXG5cdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYoJC5pbkFycmF5KHNbaV0sIHIpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bVtzW2ldXS5zdGF0ZS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHJzbHQuYWRkLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmNvbmNhdChyc2x0LmFkZCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdtb2RlbCcsIHsgXCJub2Rlc1wiIDogcnNsdC5kcGMsICdwYXJlbnQnIDogcnNsdC5wYXIgfSk7XG5cblx0XHRcdFx0XHRpZihyc2x0LnBhciAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fbm9kZV9jaGFuZ2VkKHJzbHQucGFyKTtcblx0XHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gdGhpcy5nZXRfY29udGFpbmVyX3VsKCkuY2hpbGRyZW4oJy5qc3RyZWUtaW5pdGlhbC1ub2RlJykucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR0aGlzLnJlZHJhdyh0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYocnNsdC5hZGQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ21vZGVsJywgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2IuY2FsbCh0aGlzLCB0cnVlKTtcblx0XHRcdFx0fTtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY29yZS53b3JrZXIgJiYgd2luZG93LkJsb2IgJiYgd2luZG93LlVSTCAmJiB3aW5kb3cuV29ya2VyKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0aWYodGhpcy5fd3JrID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl93cmsgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChcblx0XHRcdFx0XHRcdFx0bmV3IHdpbmRvdy5CbG9iKFxuXHRcdFx0XHRcdFx0XHRcdFsnc2VsZi5vbm1lc3NhZ2UgPSAnICsgZnVuYy50b1N0cmluZygpXSxcblx0XHRcdFx0XHRcdFx0XHR7dHlwZTpcInRleHQvamF2YXNjcmlwdFwifVxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZighdGhpcy5fZGF0YS5jb3JlLndvcmtpbmcgfHwgZm9yY2VfcHJvY2Vzc2luZykge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLndvcmtpbmcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dyA9IG5ldyB3aW5kb3cuV29ya2VyKHRoaXMuX3dyayk7XG5cdFx0XHRcdFx0XHR3Lm9ubWVzc2FnZSA9ICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0cnNsdC5jYWxsKHRoaXMsIGUuZGF0YSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdHRyeSB7IHcudGVybWluYXRlKCk7IHcgPSBudWxsOyB9IGNhdGNoKGlnbm9yZSkgeyB9XG5cdFx0XHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS53b3JrZXJfcXVldWUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYXBwZW5kX2pzb25fZGF0YS5hcHBseSh0aGlzLCB0aGlzLl9kYXRhLmNvcmUud29ya2VyX3F1ZXVlLnNoaWZ0KCkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS53b3JraW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sIHRoaXMpO1xuXHRcdFx0XHRcdFx0aWYoIWFyZ3MucGFyKSB7XG5cdFx0XHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS53b3JrZXJfcXVldWUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYXBwZW5kX2pzb25fZGF0YS5hcHBseSh0aGlzLCB0aGlzLl9kYXRhLmNvcmUud29ya2VyX3F1ZXVlLnNoaWZ0KCkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS53b3JraW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR3LnBvc3RNZXNzYWdlKGFyZ3MpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS53b3JrZXJfcXVldWUucHVzaChbZG9tLCBkYXRhLCBjYiwgdHJ1ZV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaChlKSB7XG5cdFx0XHRcdFx0cnNsdC5jYWxsKHRoaXMsIGZ1bmMoYXJncyksIGZhbHNlKTtcblx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUud29ya2VyX3F1ZXVlLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fYXBwZW5kX2pzb25fZGF0YS5hcHBseSh0aGlzLCB0aGlzLl9kYXRhLmNvcmUud29ya2VyX3F1ZXVlLnNoaWZ0KCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS53b3JraW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cnNsdC5jYWxsKHRoaXMsIGZ1bmMoYXJncyksIGZhbHNlKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHBhcnNlcyBhIG5vZGUgZnJvbSBhIGpRdWVyeSBvYmplY3QgYW5kIGFwcGVuZHMgdGhlbSB0byB0aGUgaW4gbWVtb3J5IHRyZWUgbW9kZWwuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9wYXJzZV9tb2RlbF9mcm9tX2h0bWwoZCBbLCBwLCBwc10pXG5cdFx0ICogQHBhcmFtICB7alF1ZXJ5fSBkIHRoZSBqUXVlcnkgb2JqZWN0IHRvIHBhcnNlXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBwIHRoZSBwYXJlbnQgSURcblx0XHQgKiBAcGFyYW0gIHtBcnJheX0gcHMgbGlzdCBvZiBhbGwgcGFyZW50c1xuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gdGhlIElEIG9mIHRoZSBvYmplY3QgYWRkZWQgdG8gdGhlIG1vZGVsXG5cdFx0ICovXG5cdFx0X3BhcnNlX21vZGVsX2Zyb21faHRtbCA6IGZ1bmN0aW9uIChkLCBwLCBwcykge1xuXHRcdFx0aWYoIXBzKSB7IHBzID0gW107IH1cblx0XHRcdGVsc2UgeyBwcyA9IFtdLmNvbmNhdChwcyk7IH1cblx0XHRcdGlmKHApIHsgcHMudW5zaGlmdChwKTsgfVxuXHRcdFx0dmFyIGMsIGUsIG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRkYXRhID0ge1xuXHRcdFx0XHRcdGlkXHRcdFx0OiBmYWxzZSxcblx0XHRcdFx0XHR0ZXh0XHRcdDogZmFsc2UsXG5cdFx0XHRcdFx0aWNvblx0XHQ6IHRydWUsXG5cdFx0XHRcdFx0cGFyZW50XHRcdDogcCxcblx0XHRcdFx0XHRwYXJlbnRzXHRcdDogcHMsXG5cdFx0XHRcdFx0Y2hpbGRyZW5cdDogW10sXG5cdFx0XHRcdFx0Y2hpbGRyZW5fZFx0OiBbXSxcblx0XHRcdFx0XHRkYXRhXHRcdDogbnVsbCxcblx0XHRcdFx0XHRzdGF0ZVx0XHQ6IHsgfSxcblx0XHRcdFx0XHRsaV9hdHRyXHRcdDogeyBpZCA6IGZhbHNlIH0sXG5cdFx0XHRcdFx0YV9hdHRyXHRcdDogeyBocmVmIDogJyMnIH0sXG5cdFx0XHRcdFx0b3JpZ2luYWxcdDogZmFsc2Vcblx0XHRcdFx0fSwgaSwgdG1wLCB0aWQ7XG5cdFx0XHRmb3IoaSBpbiB0aGlzLl9tb2RlbC5kZWZhdWx0X3N0YXRlKSB7XG5cdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRlZmF1bHRfc3RhdGUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRkYXRhLnN0YXRlW2ldID0gdGhpcy5fbW9kZWwuZGVmYXVsdF9zdGF0ZVtpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dG1wID0gJC52YWthdGEuYXR0cmlidXRlcyhkLCB0cnVlKTtcblx0XHRcdCQuZWFjaCh0bXAsIGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdHYgPSAkLnRyaW0odik7XG5cdFx0XHRcdGlmKCF2Lmxlbmd0aCkgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0XHRkYXRhLmxpX2F0dHJbaV0gPSB2O1xuXHRcdFx0XHRpZihpID09PSAnaWQnKSB7XG5cdFx0XHRcdFx0ZGF0YS5pZCA9IHYudG9TdHJpbmcoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHR0bXAgPSBkLmNoaWxkcmVuKCdhJykuZmlyc3QoKTtcblx0XHRcdGlmKHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0dG1wID0gJC52YWthdGEuYXR0cmlidXRlcyh0bXAsIHRydWUpO1xuXHRcdFx0XHQkLmVhY2godG1wLCBmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdHYgPSAkLnRyaW0odik7XG5cdFx0XHRcdFx0aWYodi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGRhdGEuYV9hdHRyW2ldID0gdjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dG1wID0gZC5jaGlsZHJlbihcImFcIikuZmlyc3QoKS5sZW5ndGggPyBkLmNoaWxkcmVuKFwiYVwiKS5maXJzdCgpLmNsb25lKCkgOiBkLmNsb25lKCk7XG5cdFx0XHR0bXAuY2hpbGRyZW4oXCJpbnMsIGksIHVsXCIpLnJlbW92ZSgpO1xuXHRcdFx0dG1wID0gdG1wLmh0bWwoKTtcblx0XHRcdHRtcCA9ICQoJzxkaXYgLz4nKS5odG1sKHRtcCk7XG5cdFx0XHRkYXRhLnRleHQgPSB0aGlzLnNldHRpbmdzLmNvcmUuZm9yY2VfdGV4dCA/IHRtcC50ZXh0KCkgOiB0bXAuaHRtbCgpO1xuXHRcdFx0dG1wID0gZC5kYXRhKCk7XG5cdFx0XHRkYXRhLmRhdGEgPSB0bXAgPyAkLmV4dGVuZCh0cnVlLCB7fSwgdG1wKSA6IG51bGw7XG5cdFx0XHRkYXRhLnN0YXRlLm9wZW5lZCA9IGQuaGFzQ2xhc3MoJ2pzdHJlZS1vcGVuJyk7XG5cdFx0XHRkYXRhLnN0YXRlLnNlbGVjdGVkID0gZC5jaGlsZHJlbignYScpLmhhc0NsYXNzKCdqc3RyZWUtY2xpY2tlZCcpO1xuXHRcdFx0ZGF0YS5zdGF0ZS5kaXNhYmxlZCA9IGQuY2hpbGRyZW4oJ2EnKS5oYXNDbGFzcygnanN0cmVlLWRpc2FibGVkJyk7XG5cdFx0XHRpZihkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRmb3IoaSBpbiBkYXRhLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0aWYoZGF0YS5kYXRhLmpzdHJlZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0ZGF0YS5zdGF0ZVtpXSA9IGRhdGEuZGF0YS5qc3RyZWVbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBkLmNoaWxkcmVuKFwiYVwiKS5jaGlsZHJlbihcIi5qc3RyZWUtdGhlbWVpY29uXCIpO1xuXHRcdFx0aWYodG1wLmxlbmd0aCkge1xuXHRcdFx0XHRkYXRhLmljb24gPSB0bXAuaGFzQ2xhc3MoJ2pzdHJlZS10aGVtZWljb24taGlkZGVuJykgPyBmYWxzZSA6IHRtcC5hdHRyKCdyZWwnKTtcblx0XHRcdH1cblx0XHRcdGlmKGRhdGEuc3RhdGUuaWNvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGRhdGEuaWNvbiA9IGRhdGEuc3RhdGUuaWNvbjtcblx0XHRcdH1cblx0XHRcdGlmKGRhdGEuaWNvbiA9PT0gdW5kZWZpbmVkIHx8IGRhdGEuaWNvbiA9PT0gbnVsbCB8fCBkYXRhLmljb24gPT09IFwiXCIpIHtcblx0XHRcdFx0ZGF0YS5pY29uID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHRtcCA9IGQuY2hpbGRyZW4oXCJ1bFwiKS5jaGlsZHJlbihcImxpXCIpO1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHR0aWQgPSAnaicgKyB0aGlzLl9pZCArICdfJyArICgrK3RoaXMuX2NudCk7XG5cdFx0XHR9IHdoaWxlKG1bdGlkXSk7XG5cdFx0XHRkYXRhLmlkID0gZGF0YS5saV9hdHRyLmlkID8gZGF0YS5saV9hdHRyLmlkLnRvU3RyaW5nKCkgOiB0aWQ7XG5cdFx0XHRpZih0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdHRtcC5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRjID0gdGhpcy5fcGFyc2VfbW9kZWxfZnJvbV9odG1sKCQodiksIGRhdGEuaWQsIHBzKTtcblx0XHRcdFx0XHRlID0gdGhpcy5fbW9kZWwuZGF0YVtjXTtcblx0XHRcdFx0XHRkYXRhLmNoaWxkcmVuLnB1c2goYyk7XG5cdFx0XHRcdFx0aWYoZS5jaGlsZHJlbl9kLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0ZGF0YS5jaGlsZHJlbl9kID0gZGF0YS5jaGlsZHJlbl9kLmNvbmNhdChlLmNoaWxkcmVuX2QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHRkYXRhLmNoaWxkcmVuX2QgPSBkYXRhLmNoaWxkcmVuX2QuY29uY2F0KGRhdGEuY2hpbGRyZW4pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmKGQuaGFzQ2xhc3MoJ2pzdHJlZS1jbG9zZWQnKSkge1xuXHRcdFx0XHRcdGRhdGEuc3RhdGUubG9hZGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGRhdGEubGlfYXR0clsnY2xhc3MnXSkge1xuXHRcdFx0XHRkYXRhLmxpX2F0dHJbJ2NsYXNzJ10gPSBkYXRhLmxpX2F0dHJbJ2NsYXNzJ10ucmVwbGFjZSgnanN0cmVlLWNsb3NlZCcsJycpLnJlcGxhY2UoJ2pzdHJlZS1vcGVuJywnJyk7XG5cdFx0XHR9XG5cdFx0XHRpZihkYXRhLmFfYXR0clsnY2xhc3MnXSkge1xuXHRcdFx0XHRkYXRhLmFfYXR0clsnY2xhc3MnXSA9IGRhdGEuYV9hdHRyWydjbGFzcyddLnJlcGxhY2UoJ2pzdHJlZS1jbGlja2VkJywnJykucmVwbGFjZSgnanN0cmVlLWRpc2FibGVkJywnJyk7XG5cdFx0XHR9XG5cdFx0XHRtW2RhdGEuaWRdID0gZGF0YTtcblx0XHRcdGlmKGRhdGEuc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLnB1c2goZGF0YS5pZCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZGF0YS5pZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHBhcnNlcyBhIG5vZGUgZnJvbSBhIEpTT04gb2JqZWN0ICh1c2VkIHdoZW4gZGVhbGluZyB3aXRoIGZsYXQgZGF0YSwgd2hpY2ggaGFzIG5vIG5lc3Rpbmcgb2YgY2hpbGRyZW4sIGJ1dCBoYXMgaWQgYW5kIHBhcmVudCBwcm9wZXJ0aWVzKSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgaW4gbWVtb3J5IHRyZWUgbW9kZWwuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9wYXJzZV9tb2RlbF9mcm9tX2ZsYXRfanNvbihkIFssIHAsIHBzXSlcblx0XHQgKiBAcGFyYW0gIHtPYmplY3R9IGQgdGhlIEpTT04gb2JqZWN0IHRvIHBhcnNlXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBwIHRoZSBwYXJlbnQgSURcblx0XHQgKiBAcGFyYW0gIHtBcnJheX0gcHMgbGlzdCBvZiBhbGwgcGFyZW50c1xuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gdGhlIElEIG9mIHRoZSBvYmplY3QgYWRkZWQgdG8gdGhlIG1vZGVsXG5cdFx0ICovXG5cdFx0X3BhcnNlX21vZGVsX2Zyb21fZmxhdF9qc29uIDogZnVuY3Rpb24gKGQsIHAsIHBzKSB7XG5cdFx0XHRpZighcHMpIHsgcHMgPSBbXTsgfVxuXHRcdFx0ZWxzZSB7IHBzID0gcHMuY29uY2F0KCk7IH1cblx0XHRcdGlmKHApIHsgcHMudW5zaGlmdChwKTsgfVxuXHRcdFx0dmFyIHRpZCA9IGQuaWQudG9TdHJpbmcoKSxcblx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdGRmID0gdGhpcy5fbW9kZWwuZGVmYXVsdF9zdGF0ZSxcblx0XHRcdFx0aSwgaiwgYywgZSxcblx0XHRcdFx0dG1wID0ge1xuXHRcdFx0XHRcdGlkXHRcdFx0OiB0aWQsXG5cdFx0XHRcdFx0dGV4dFx0XHQ6IGQudGV4dCB8fCAnJyxcblx0XHRcdFx0XHRpY29uXHRcdDogZC5pY29uICE9PSB1bmRlZmluZWQgPyBkLmljb24gOiB0cnVlLFxuXHRcdFx0XHRcdHBhcmVudFx0XHQ6IHAsXG5cdFx0XHRcdFx0cGFyZW50c1x0XHQ6IHBzLFxuXHRcdFx0XHRcdGNoaWxkcmVuXHQ6IGQuY2hpbGRyZW4gfHwgW10sXG5cdFx0XHRcdFx0Y2hpbGRyZW5fZFx0OiBkLmNoaWxkcmVuX2QgfHwgW10sXG5cdFx0XHRcdFx0ZGF0YVx0XHQ6IGQuZGF0YSxcblx0XHRcdFx0XHRzdGF0ZVx0XHQ6IHsgfSxcblx0XHRcdFx0XHRsaV9hdHRyXHRcdDogeyBpZCA6IGZhbHNlIH0sXG5cdFx0XHRcdFx0YV9hdHRyXHRcdDogeyBocmVmIDogJyMnIH0sXG5cdFx0XHRcdFx0b3JpZ2luYWxcdDogZmFsc2Vcblx0XHRcdFx0fTtcblx0XHRcdGZvcihpIGluIGRmKSB7XG5cdFx0XHRcdGlmKGRmLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZGZbaV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgZC5kYXRhICYmIGQuZGF0YS5qc3RyZWUgJiYgZC5kYXRhLmpzdHJlZS5pY29uKSB7XG5cdFx0XHRcdHRtcC5pY29uID0gZC5kYXRhLmpzdHJlZS5pY29uO1xuXHRcdFx0fVxuXHRcdFx0aWYodG1wLmljb24gPT09IHVuZGVmaW5lZCB8fCB0bXAuaWNvbiA9PT0gbnVsbCB8fCB0bXAuaWNvbiA9PT0gXCJcIikge1xuXHRcdFx0XHR0bXAuaWNvbiA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIGQuZGF0YSkge1xuXHRcdFx0XHR0bXAuZGF0YSA9IGQuZGF0YTtcblx0XHRcdFx0aWYoZC5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdGZvcihpIGluIGQuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRcdGlmKGQuZGF0YS5qc3RyZWUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZC5kYXRhLmpzdHJlZVtpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgdHlwZW9mIGQuc3RhdGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoaSBpbiBkLnN0YXRlKSB7XG5cdFx0XHRcdFx0aWYoZC5zdGF0ZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZC5zdGF0ZVtpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgdHlwZW9mIGQubGlfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChpIGluIGQubGlfYXR0cikge1xuXHRcdFx0XHRcdGlmKGQubGlfYXR0ci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0dG1wLmxpX2F0dHJbaV0gPSBkLmxpX2F0dHJbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZighdG1wLmxpX2F0dHIuaWQpIHtcblx0XHRcdFx0dG1wLmxpX2F0dHIuaWQgPSB0aWQ7XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIHR5cGVvZiBkLmFfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChpIGluIGQuYV9hdHRyKSB7XG5cdFx0XHRcdFx0aWYoZC5hX2F0dHIuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdHRtcC5hX2F0dHJbaV0gPSBkLmFfYXR0cltpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgZC5jaGlsZHJlbiAmJiBkLmNoaWxkcmVuID09PSB0cnVlKSB7XG5cdFx0XHRcdHRtcC5zdGF0ZS5sb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0dG1wLmNoaWxkcmVuID0gW107XG5cdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gW107XG5cdFx0XHR9XG5cdFx0XHRtW3RtcC5pZF0gPSB0bXA7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGMgPSB0aGlzLl9wYXJzZV9tb2RlbF9mcm9tX2ZsYXRfanNvbihtW3RtcC5jaGlsZHJlbltpXV0sIHRtcC5pZCwgcHMpO1xuXHRcdFx0XHRlID0gbVtjXTtcblx0XHRcdFx0dG1wLmNoaWxkcmVuX2QucHVzaChjKTtcblx0XHRcdFx0aWYoZS5jaGlsZHJlbl9kLmxlbmd0aCkge1xuXHRcdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gdG1wLmNoaWxkcmVuX2QuY29uY2F0KGUuY2hpbGRyZW5fZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGRlbGV0ZSBkLmRhdGE7XG5cdFx0XHRkZWxldGUgZC5jaGlsZHJlbjtcblx0XHRcdG1bdG1wLmlkXS5vcmlnaW5hbCA9IGQ7XG5cdFx0XHRpZih0bXAuc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLnB1c2godG1wLmlkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0bXAuaWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBwYXJzZXMgYSBub2RlIGZyb20gYSBKU09OIG9iamVjdCBhbmQgYXBwZW5kcyBpdCB0byB0aGUgaW4gbWVtb3J5IHRyZWUgbW9kZWwuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9wYXJzZV9tb2RlbF9mcm9tX2pzb24oZCBbLCBwLCBwc10pXG5cdFx0ICogQHBhcmFtICB7T2JqZWN0fSBkIHRoZSBKU09OIG9iamVjdCB0byBwYXJzZVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gcCB0aGUgcGFyZW50IElEXG5cdFx0ICogQHBhcmFtICB7QXJyYXl9IHBzIGxpc3Qgb2YgYWxsIHBhcmVudHNcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBJRCBvZiB0aGUgb2JqZWN0IGFkZGVkIHRvIHRoZSBtb2RlbFxuXHRcdCAqL1xuXHRcdF9wYXJzZV9tb2RlbF9mcm9tX2pzb24gOiBmdW5jdGlvbiAoZCwgcCwgcHMpIHtcblx0XHRcdGlmKCFwcykgeyBwcyA9IFtdOyB9XG5cdFx0XHRlbHNlIHsgcHMgPSBwcy5jb25jYXQoKTsgfVxuXHRcdFx0aWYocCkgeyBwcy51bnNoaWZ0KHApOyB9XG5cdFx0XHR2YXIgdGlkID0gZmFsc2UsIGksIGosIGMsIGUsIG0gPSB0aGlzLl9tb2RlbC5kYXRhLCBkZiA9IHRoaXMuX21vZGVsLmRlZmF1bHRfc3RhdGUsIHRtcDtcblx0XHRcdGRvIHtcblx0XHRcdFx0dGlkID0gJ2onICsgdGhpcy5faWQgKyAnXycgKyAoKyt0aGlzLl9jbnQpO1xuXHRcdFx0fSB3aGlsZShtW3RpZF0pO1xuXG5cdFx0XHR0bXAgPSB7XG5cdFx0XHRcdGlkXHRcdFx0OiBmYWxzZSxcblx0XHRcdFx0dGV4dFx0XHQ6IHR5cGVvZiBkID09PSAnc3RyaW5nJyA/IGQgOiAnJyxcblx0XHRcdFx0aWNvblx0XHQ6IHR5cGVvZiBkID09PSAnb2JqZWN0JyAmJiBkLmljb24gIT09IHVuZGVmaW5lZCA/IGQuaWNvbiA6IHRydWUsXG5cdFx0XHRcdHBhcmVudFx0XHQ6IHAsXG5cdFx0XHRcdHBhcmVudHNcdFx0OiBwcyxcblx0XHRcdFx0Y2hpbGRyZW5cdDogW10sXG5cdFx0XHRcdGNoaWxkcmVuX2RcdDogW10sXG5cdFx0XHRcdGRhdGFcdFx0OiBudWxsLFxuXHRcdFx0XHRzdGF0ZVx0XHQ6IHsgfSxcblx0XHRcdFx0bGlfYXR0clx0XHQ6IHsgaWQgOiBmYWxzZSB9LFxuXHRcdFx0XHRhX2F0dHJcdFx0OiB7IGhyZWYgOiAnIycgfSxcblx0XHRcdFx0b3JpZ2luYWxcdDogZmFsc2Vcblx0XHRcdH07XG5cdFx0XHRmb3IoaSBpbiBkZikge1xuXHRcdFx0XHRpZihkZi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGRmW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIGQuaWQpIHsgdG1wLmlkID0gZC5pZC50b1N0cmluZygpOyB9XG5cdFx0XHRpZihkICYmIGQudGV4dCkgeyB0bXAudGV4dCA9IGQudGV4dDsgfVxuXHRcdFx0aWYoZCAmJiBkLmRhdGEgJiYgZC5kYXRhLmpzdHJlZSAmJiBkLmRhdGEuanN0cmVlLmljb24pIHtcblx0XHRcdFx0dG1wLmljb24gPSBkLmRhdGEuanN0cmVlLmljb247XG5cdFx0XHR9XG5cdFx0XHRpZih0bXAuaWNvbiA9PT0gdW5kZWZpbmVkIHx8IHRtcC5pY29uID09PSBudWxsIHx8IHRtcC5pY29uID09PSBcIlwiKSB7XG5cdFx0XHRcdHRtcC5pY29uID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgZC5kYXRhKSB7XG5cdFx0XHRcdHRtcC5kYXRhID0gZC5kYXRhO1xuXHRcdFx0XHRpZihkLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0Zm9yKGkgaW4gZC5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdFx0aWYoZC5kYXRhLmpzdHJlZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkLmRhdGEuanN0cmVlW2ldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5zdGF0ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChpIGluIGQuc3RhdGUpIHtcblx0XHRcdFx0XHRpZihkLnN0YXRlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkLnN0YXRlW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5saV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGkgaW4gZC5saV9hdHRyKSB7XG5cdFx0XHRcdFx0aWYoZC5saV9hdHRyLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHR0bXAubGlfYXR0cltpXSA9IGQubGlfYXR0cltpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKHRtcC5saV9hdHRyLmlkICYmICF0bXAuaWQpIHtcblx0XHRcdFx0dG1wLmlkID0gdG1wLmxpX2F0dHIuaWQudG9TdHJpbmcoKTtcblx0XHRcdH1cblx0XHRcdGlmKCF0bXAuaWQpIHtcblx0XHRcdFx0dG1wLmlkID0gdGlkO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXRtcC5saV9hdHRyLmlkKSB7XG5cdFx0XHRcdHRtcC5saV9hdHRyLmlkID0gdG1wLmlkO1xuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5hX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoaSBpbiBkLmFfYXR0cikge1xuXHRcdFx0XHRcdGlmKGQuYV9hdHRyLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHR0bXAuYV9hdHRyW2ldID0gZC5hX2F0dHJbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIGQuY2hpbGRyZW4gJiYgZC5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRjID0gdGhpcy5fcGFyc2VfbW9kZWxfZnJvbV9qc29uKGQuY2hpbGRyZW5baV0sIHRtcC5pZCwgcHMpO1xuXHRcdFx0XHRcdGUgPSBtW2NdO1xuXHRcdFx0XHRcdHRtcC5jaGlsZHJlbi5wdXNoKGMpO1xuXHRcdFx0XHRcdGlmKGUuY2hpbGRyZW5fZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gdG1wLmNoaWxkcmVuX2QuY29uY2F0KGUuY2hpbGRyZW5fZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gdG1wLmNoaWxkcmVuLmNvbmNhdCh0bXAuY2hpbGRyZW5fZCk7XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIGQuY2hpbGRyZW4gJiYgZC5jaGlsZHJlbiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHR0bXAuc3RhdGUubG9hZGVkID0gZmFsc2U7XG5cdFx0XHRcdHRtcC5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0XHR0bXAuY2hpbGRyZW5fZCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0ZGVsZXRlIGQuZGF0YTtcblx0XHRcdGRlbGV0ZSBkLmNoaWxkcmVuO1xuXHRcdFx0dG1wLm9yaWdpbmFsID0gZDtcblx0XHRcdG1bdG1wLmlkXSA9IHRtcDtcblx0XHRcdGlmKHRtcC5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQucHVzaCh0bXAuaWQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRtcC5pZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJlZHJhd3MgYWxsIG5vZGVzIHRoYXQgbmVlZCB0byBiZSByZWRyYXduLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfcmVkcmF3KClcblx0XHQgKiBAdHJpZ2dlciByZWRyYXcuanN0cmVlXG5cdFx0ICovXG5cdFx0X3JlZHJhdyA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBub2RlcyA9IHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3ID8gdGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XS5jaGlsZHJlbi5jb25jYXQoW10pIDogdGhpcy5fbW9kZWwuY2hhbmdlZC5jb25jYXQoW10pLFxuXHRcdFx0XHRmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnVUwnKSwgdG1wLCBpLCBqLCBmZSA9IHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gbm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdHRtcCA9IHRoaXMucmVkcmF3X25vZGUobm9kZXNbaV0sIHRydWUsIHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3KTtcblx0XHRcdFx0aWYodG1wICYmIHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3KSB7XG5cdFx0XHRcdFx0Zi5hcHBlbmRDaGlsZCh0bXApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdykge1xuXHRcdFx0XHRmLmNsYXNzTmFtZSA9IHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdLmNsYXNzTmFtZTtcblx0XHRcdFx0Zi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCdncm91cCcpO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZW1wdHkoKS5hcHBlbmQoZik7XG5cdFx0XHRcdC8vdGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0uYXBwZW5kQ2hpbGQoZik7XG5cdFx0XHR9XG5cdFx0XHRpZihmZSAhPT0gbnVsbCAmJiB0aGlzLnNldHRpbmdzLmNvcmUucmVzdG9yZV9mb2N1cykge1xuXHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKGZlLCB0cnVlKTtcblx0XHRcdFx0aWYodG1wICYmIHRtcC5sZW5ndGggJiYgdG1wLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpWzBdICE9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG5cdFx0XHRcdFx0dG1wLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fbW9kZWwuY2hhbmdlZCA9IFtdO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgYWZ0ZXIgbm9kZXMgYXJlIHJlZHJhd25cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgcmVkcmF3LmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHthcnJheX0gbm9kZXMgdGhlIHJlZHJhd24gbm9kZXNcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdyZWRyYXcnLCB7IFwibm9kZXNcIiA6IG5vZGVzIH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmVkcmF3cyBhbGwgbm9kZXMgdGhhdCBuZWVkIHRvIGJlIHJlZHJhd24gb3Igb3B0aW9uYWxseSAtIHRoZSB3aG9sZSB0cmVlXG5cdFx0ICogQG5hbWUgcmVkcmF3KFtmdWxsXSlcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IGZ1bGwgaWYgc2V0IHRvIGB0cnVlYCBhbGwgbm9kZXMgYXJlIHJlZHJhd24uXG5cdFx0ICovXG5cdFx0cmVkcmF3IDogZnVuY3Rpb24gKGZ1bGwpIHtcblx0XHRcdGlmKGZ1bGwpIHtcblx0XHRcdFx0dGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Ly9pZih0aGlzLl9tb2RlbC5yZWRyYXdfdGltZW91dCkge1xuXHRcdFx0Ly9cdGNsZWFyVGltZW91dCh0aGlzLl9tb2RlbC5yZWRyYXdfdGltZW91dCk7XG5cdFx0XHQvL31cblx0XHRcdC8vdGhpcy5fbW9kZWwucmVkcmF3X3RpbWVvdXQgPSBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5fcmVkcmF3LCB0aGlzKSwwKTtcblx0XHRcdHRoaXMuX3JlZHJhdygpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmVkcmF3cyBhIHNpbmdsZSBub2RlJ3MgY2hpbGRyZW4uIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIGRyYXdfY2hpbGRyZW4obm9kZSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBub2RlIHRoZSBub2RlIHdob3NlIGNoaWxkcmVuIHdpbGwgYmUgcmVkcmF3blxuXHRcdCAqL1xuXHRcdGRyYXdfY2hpbGRyZW4gOiBmdW5jdGlvbiAobm9kZSkge1xuXHRcdFx0dmFyIG9iaiA9IHRoaXMuZ2V0X25vZGUobm9kZSksXG5cdFx0XHRcdGkgPSBmYWxzZSxcblx0XHRcdFx0aiA9IGZhbHNlLFxuXHRcdFx0XHRrID0gZmFsc2UsXG5cdFx0XHRcdGQgPSBkb2N1bWVudDtcblx0XHRcdGlmKCFvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZihvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIHRoaXMucmVkcmF3KHRydWUpOyB9XG5cdFx0XHRub2RlID0gdGhpcy5nZXRfbm9kZShub2RlLCB0cnVlKTtcblx0XHRcdGlmKCFub2RlIHx8ICFub2RlLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH0gLy8gVE9ETzogcXVpY2sgdG9nZ2xlXG5cblx0XHRcdG5vZGUuY2hpbGRyZW4oJy5qc3RyZWUtY2hpbGRyZW4nKS5yZW1vdmUoKTtcblx0XHRcdG5vZGUgPSBub2RlWzBdO1xuXHRcdFx0aWYob2JqLmNoaWxkcmVuLmxlbmd0aCAmJiBvYmouc3RhdGUubG9hZGVkKSB7XG5cdFx0XHRcdGsgPSBkLmNyZWF0ZUVsZW1lbnQoJ1VMJyk7XG5cdFx0XHRcdGsuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2dyb3VwJyk7XG5cdFx0XHRcdGsuY2xhc3NOYW1lID0gJ2pzdHJlZS1jaGlsZHJlbic7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRrLmFwcGVuZENoaWxkKHRoaXMucmVkcmF3X25vZGUob2JqLmNoaWxkcmVuW2ldLCB0cnVlLCB0cnVlKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bm9kZS5hcHBlbmRDaGlsZChrKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJlZHJhd3MgYSBzaW5nbGUgbm9kZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgcmVkcmF3X25vZGUobm9kZSwgZGVlcCwgaXNfY2FsbGJhY2ssIGZvcmNlX3JlbmRlcilcblx0XHQgKiBAcGFyYW0ge21peGVkfSBub2RlIHRoZSBub2RlIHRvIHJlZHJhd1xuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVlcCBzaG91bGQgY2hpbGQgbm9kZXMgYmUgcmVkcmF3biB0b29cblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IGlzX2NhbGxiYWNrIGlzIHRoaXMgYSByZWN1cnNpb24gY2FsbFxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gZm9yY2VfcmVuZGVyIHNob3VsZCBjaGlsZHJlbiBvZiBjbG9zZWQgcGFyZW50cyBiZSBkcmF3biBhbnl3YXlcblx0XHQgKi9cblx0XHRyZWRyYXdfbm9kZSA6IGZ1bmN0aW9uIChub2RlLCBkZWVwLCBpc19jYWxsYmFjaywgZm9yY2VfcmVuZGVyKSB7XG5cdFx0XHR2YXIgb2JqID0gdGhpcy5nZXRfbm9kZShub2RlKSxcblx0XHRcdFx0cGFyID0gZmFsc2UsXG5cdFx0XHRcdGluZCA9IGZhbHNlLFxuXHRcdFx0XHRvbGQgPSBmYWxzZSxcblx0XHRcdFx0aSA9IGZhbHNlLFxuXHRcdFx0XHRqID0gZmFsc2UsXG5cdFx0XHRcdGsgPSBmYWxzZSxcblx0XHRcdFx0YyA9ICcnLFxuXHRcdFx0XHRkID0gZG9jdW1lbnQsXG5cdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRmID0gZmFsc2UsXG5cdFx0XHRcdHMgPSBmYWxzZSxcblx0XHRcdFx0dG1wID0gbnVsbCxcblx0XHRcdFx0dCA9IDAsXG5cdFx0XHRcdGwgPSAwLFxuXHRcdFx0XHRoYXNfY2hpbGRyZW4gPSBmYWxzZSxcblx0XHRcdFx0bGFzdF9zaWJsaW5nID0gZmFsc2U7XG5cdFx0XHRpZighb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYob2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7ICByZXR1cm4gdGhpcy5yZWRyYXcodHJ1ZSk7IH1cblx0XHRcdGRlZXAgPSBkZWVwIHx8IG9iai5jaGlsZHJlbi5sZW5ndGggPT09IDA7XG5cdFx0XHRub2RlID0gIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvYmouaWQpIDogdGhpcy5lbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJyMnICsgKFwiMDEyMzQ1Njc4OVwiLmluZGV4T2Yob2JqLmlkWzBdKSAhPT0gLTEgPyAnXFxcXDMnICsgb2JqLmlkWzBdICsgJyAnICsgb2JqLmlkLnN1YnN0cigxKS5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpIDogb2JqLmlkLnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJykpICk7IC8vLCB0aGlzLmVsZW1lbnQpO1xuXHRcdFx0aWYoIW5vZGUpIHtcblx0XHRcdFx0ZGVlcCA9IHRydWU7XG5cdFx0XHRcdC8vbm9kZSA9IGQuY3JlYXRlRWxlbWVudCgnTEknKTtcblx0XHRcdFx0aWYoIWlzX2NhbGxiYWNrKSB7XG5cdFx0XHRcdFx0cGFyID0gb2JqLnBhcmVudCAhPT0gJC5qc3RyZWUucm9vdCA/ICQoJyMnICsgb2JqLnBhcmVudC5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpLCB0aGlzLmVsZW1lbnQpWzBdIDogbnVsbDtcblx0XHRcdFx0XHRpZihwYXIgIT09IG51bGwgJiYgKCFwYXIgfHwgIW1bb2JqLnBhcmVudF0uc3RhdGUub3BlbmVkKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpbmQgPSAkLmluQXJyYXkob2JqLmlkLCBwYXIgPT09IG51bGwgPyBtWyQuanN0cmVlLnJvb3RdLmNoaWxkcmVuIDogbVtvYmoucGFyZW50XS5jaGlsZHJlbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRub2RlID0gJChub2RlKTtcblx0XHRcdFx0aWYoIWlzX2NhbGxiYWNrKSB7XG5cdFx0XHRcdFx0cGFyID0gbm9kZS5wYXJlbnQoKS5wYXJlbnQoKVswXTtcblx0XHRcdFx0XHRpZihwYXIgPT09IHRoaXMuZWxlbWVudFswXSkge1xuXHRcdFx0XHRcdFx0cGFyID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aW5kID0gbm9kZS5pbmRleCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIG1bb2JqLmlkXS5kYXRhID0gbm9kZS5kYXRhKCk7IC8vIHVzZSBvbmx5IG5vZGUncyBkYXRhLCBubyBuZWVkIHRvIHRvdWNoIGpxdWVyeSBzdG9yYWdlXG5cdFx0XHRcdGlmKCFkZWVwICYmIG9iai5jaGlsZHJlbi5sZW5ndGggJiYgIW5vZGUuY2hpbGRyZW4oJy5qc3RyZWUtY2hpbGRyZW4nKS5sZW5ndGgpIHtcblx0XHRcdFx0XHRkZWVwID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighZGVlcCkge1xuXHRcdFx0XHRcdG9sZCA9IG5vZGUuY2hpbGRyZW4oJy5qc3RyZWUtY2hpbGRyZW4nKVswXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmID0gbm9kZS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKVswXSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0XHRcdFx0bm9kZS5yZW1vdmUoKTtcblx0XHRcdFx0Ly9ub2RlID0gZC5jcmVhdGVFbGVtZW50KCdMSScpO1xuXHRcdFx0XHQvL25vZGUgPSBub2RlWzBdO1xuXHRcdFx0fVxuXHRcdFx0bm9kZSA9IHRoaXMuX2RhdGEuY29yZS5ub2RlLmNsb25lTm9kZSh0cnVlKTtcblx0XHRcdC8vIG5vZGUgaXMgRE9NLCBkZWVwIGlzIGJvb2xlYW5cblxuXHRcdFx0YyA9ICdqc3RyZWUtbm9kZSAnO1xuXHRcdFx0Zm9yKGkgaW4gb2JqLmxpX2F0dHIpIHtcblx0XHRcdFx0aWYob2JqLmxpX2F0dHIuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRpZihpID09PSAnaWQnKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRcdFx0aWYoaSAhPT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoaSwgb2JqLmxpX2F0dHJbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGMgKz0gb2JqLmxpX2F0dHJbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZighb2JqLmFfYXR0ci5pZCkge1xuXHRcdFx0XHRvYmouYV9hdHRyLmlkID0gb2JqLmlkICsgJ19hbmNob3InO1xuXHRcdFx0fVxuXHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAhIW9iai5zdGF0ZS5zZWxlY3RlZCk7XG5cdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnYXJpYS1sZXZlbCcsIG9iai5wYXJlbnRzLmxlbmd0aCk7XG5cdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5Jywgb2JqLmFfYXR0ci5pZCk7XG5cdFx0XHRpZihvYmouc3RhdGUuZGlzYWJsZWQpIHtcblx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZighbVtvYmouY2hpbGRyZW5baV1dLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRcdGhhc19jaGlsZHJlbiA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKG9iai5wYXJlbnQgIT09IG51bGwgJiYgbVtvYmoucGFyZW50XSAmJiAhb2JqLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRpID0gJC5pbkFycmF5KG9iai5pZCwgbVtvYmoucGFyZW50XS5jaGlsZHJlbik7XG5cdFx0XHRcdGxhc3Rfc2libGluZyA9IG9iai5pZDtcblx0XHRcdFx0aWYoaSAhPT0gLTEpIHtcblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0Zm9yKGogPSBtW29iai5wYXJlbnRdLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYoIW1bbVtvYmoucGFyZW50XS5jaGlsZHJlbltpXV0uc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdFx0XHRcdGxhc3Rfc2libGluZyA9IG1bb2JqLnBhcmVudF0uY2hpbGRyZW5baV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihsYXN0X3NpYmxpbmcgIT09IG9iai5pZCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYob2JqLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRjICs9ICcganN0cmVlLWhpZGRlbic7XG5cdFx0XHR9XG5cdFx0XHRpZiAob2JqLnN0YXRlLmxvYWRpbmcpIHtcblx0XHRcdFx0YyArPSAnIGpzdHJlZS1sb2FkaW5nJztcblx0XHRcdH1cblx0XHRcdGlmKG9iai5zdGF0ZS5sb2FkZWQgJiYgIWhhc19jaGlsZHJlbikge1xuXHRcdFx0XHRjICs9ICcganN0cmVlLWxlYWYnO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGMgKz0gb2JqLnN0YXRlLm9wZW5lZCAmJiBvYmouc3RhdGUubG9hZGVkID8gJyBqc3RyZWUtb3BlbicgOiAnIGpzdHJlZS1jbG9zZWQnO1xuXHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIChvYmouc3RhdGUub3BlbmVkICYmIG9iai5zdGF0ZS5sb2FkZWQpICk7XG5cdFx0XHR9XG5cdFx0XHRpZihsYXN0X3NpYmxpbmcgPT09IG9iai5pZCkge1xuXHRcdFx0XHRjICs9ICcganN0cmVlLWxhc3QnO1xuXHRcdFx0fVxuXHRcdFx0bm9kZS5pZCA9IG9iai5pZDtcblx0XHRcdG5vZGUuY2xhc3NOYW1lID0gYztcblx0XHRcdGMgPSAoIG9iai5zdGF0ZS5zZWxlY3RlZCA/ICcganN0cmVlLWNsaWNrZWQnIDogJycpICsgKCBvYmouc3RhdGUuZGlzYWJsZWQgPyAnIGpzdHJlZS1kaXNhYmxlZCcgOiAnJyk7XG5cdFx0XHRmb3IoaiBpbiBvYmouYV9hdHRyKSB7XG5cdFx0XHRcdGlmKG9iai5hX2F0dHIuaGFzT3duUHJvcGVydHkoaikpIHtcblx0XHRcdFx0XHRpZihqID09PSAnaHJlZicgJiYgb2JqLmFfYXR0cltqXSA9PT0gJyMnKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRcdFx0aWYoaiAhPT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLnNldEF0dHJpYnV0ZShqLCBvYmouYV9hdHRyW2pdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRjICs9ICcgJyArIG9iai5hX2F0dHJbal07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihjLmxlbmd0aCkge1xuXHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uY2xhc3NOYW1lID0gJ2pzdHJlZS1hbmNob3IgJyArIGM7XG5cdFx0XHR9XG5cdFx0XHRpZigob2JqLmljb24gJiYgb2JqLmljb24gIT09IHRydWUpIHx8IG9iai5pY29uID09PSBmYWxzZSkge1xuXHRcdFx0XHRpZihvYmouaWNvbiA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jbGFzc05hbWUgKz0gJyBqc3RyZWUtdGhlbWVpY29uLWhpZGRlbic7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZihvYmouaWNvbi5pbmRleE9mKCcvJykgPT09IC0xICYmIG9iai5pY29uLmluZGV4T2YoJy4nKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jbGFzc05hbWUgKz0gJyAnICsgb2JqLmljb24gKyAnIGpzdHJlZS10aGVtZWljb24tY3VzdG9tJztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiJytvYmouaWNvbisnXCIpJztcblx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnY2VudGVyIGNlbnRlcic7XG5cdFx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnYXV0byc7XG5cdFx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uY2xhc3NOYW1lICs9ICcganN0cmVlLXRoZW1laWNvbi1jdXN0b20nO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY29yZS5mb3JjZV90ZXh0KSB7XG5cdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5hcHBlbmRDaGlsZChkLmNyZWF0ZVRleHROb2RlKG9iai50ZXh0KSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmlubmVySFRNTCArPSBvYmoudGV4dDtcblx0XHRcdH1cblxuXG5cdFx0XHRpZihkZWVwICYmIG9iai5jaGlsZHJlbi5sZW5ndGggJiYgKG9iai5zdGF0ZS5vcGVuZWQgfHwgZm9yY2VfcmVuZGVyKSAmJiBvYmouc3RhdGUubG9hZGVkKSB7XG5cdFx0XHRcdGsgPSBkLmNyZWF0ZUVsZW1lbnQoJ1VMJyk7XG5cdFx0XHRcdGsuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2dyb3VwJyk7XG5cdFx0XHRcdGsuY2xhc3NOYW1lID0gJ2pzdHJlZS1jaGlsZHJlbic7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRrLmFwcGVuZENoaWxkKHRoaXMucmVkcmF3X25vZGUob2JqLmNoaWxkcmVuW2ldLCBkZWVwLCB0cnVlKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bm9kZS5hcHBlbmRDaGlsZChrKTtcblx0XHRcdH1cblx0XHRcdGlmKG9sZCkge1xuXHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKG9sZCk7XG5cdFx0XHR9XG5cdFx0XHRpZighaXNfY2FsbGJhY2spIHtcblx0XHRcdFx0Ly8gYXBwZW5kIGJhY2sgdXNpbmcgcGFyIC8gaW5kXG5cdFx0XHRcdGlmKCFwYXIpIHtcblx0XHRcdFx0XHRwYXIgPSB0aGlzLmVsZW1lbnRbMF07XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcGFyLmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYocGFyLmNoaWxkTm9kZXNbaV0gJiYgcGFyLmNoaWxkTm9kZXNbaV0uY2xhc3NOYW1lICYmIHBhci5jaGlsZE5vZGVzW2ldLmNsYXNzTmFtZS5pbmRleE9mKCdqc3RyZWUtY2hpbGRyZW4nKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdHRtcCA9IHBhci5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCF0bXApIHtcblx0XHRcdFx0XHR0bXAgPSBkLmNyZWF0ZUVsZW1lbnQoJ1VMJyk7XG5cdFx0XHRcdFx0dG1wLnNldEF0dHJpYnV0ZSgncm9sZScsICdncm91cCcpO1xuXHRcdFx0XHRcdHRtcC5jbGFzc05hbWUgPSAnanN0cmVlLWNoaWxkcmVuJztcblx0XHRcdFx0XHRwYXIuYXBwZW5kQ2hpbGQodG1wKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwYXIgPSB0bXA7XG5cblx0XHRcdFx0aWYoaW5kIDwgcGFyLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cGFyLmluc2VydEJlZm9yZShub2RlLCBwYXIuY2hpbGROb2Rlc1tpbmRdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRwYXIuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoZikge1xuXHRcdFx0XHRcdHQgPSB0aGlzLmVsZW1lbnRbMF0uc2Nyb2xsVG9wO1xuXHRcdFx0XHRcdGwgPSB0aGlzLmVsZW1lbnRbMF0uc2Nyb2xsTGVmdDtcblx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uZm9jdXMoKTtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnRbMF0uc2Nyb2xsVG9wID0gdDtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnRbMF0uc2Nyb2xsTGVmdCA9IGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKG9iai5zdGF0ZS5vcGVuZWQgJiYgIW9iai5zdGF0ZS5sb2FkZWQpIHtcblx0XHRcdFx0b2JqLnN0YXRlLm9wZW5lZCA9IGZhbHNlO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHRoaXMub3Blbl9ub2RlKG9iai5pZCwgZmFsc2UsIDApO1xuXHRcdFx0XHR9LCB0aGlzKSwgMCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIG9wZW5zIGEgbm9kZSwgcmV2ZWFsaW5nIGl0cyBjaGlsZHJlbi4gSWYgdGhlIG5vZGUgaXMgbm90IGxvYWRlZCBpdCB3aWxsIGJlIGxvYWRlZCBhbmQgb3BlbmVkIG9uY2UgcmVhZHkuXG5cdFx0ICogQG5hbWUgb3Blbl9ub2RlKG9iaiBbLCBjYWxsYmFjaywgYW5pbWF0aW9uXSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gb3BlblxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbmNlIHRoZSBub2RlIGlzIG9wZW5lZFxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBhbmltYXRpb24gdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgd2hlbiBvcGVuaW5nIHRoZSBub2RlIChvdmVycmlkZXMgdGhlIGBjb3JlLmFuaW1hdGlvbmAgc2V0dGluZykuIFVzZSBgZmFsc2VgIGZvciBubyBhbmltYXRpb24uXG5cdFx0ICogQHRyaWdnZXIgb3Blbl9ub2RlLmpzdHJlZSwgYWZ0ZXJfb3Blbi5qc3RyZWUsIGJlZm9yZV9vcGVuLmpzdHJlZVxuXHRcdCAqL1xuXHRcdG9wZW5fbm9kZSA6IGZ1bmN0aW9uIChvYmosIGNhbGxiYWNrLCBhbmltYXRpb24pIHtcblx0XHRcdHZhciB0MSwgdDIsIGQsIHQ7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5vcGVuX25vZGUob2JqW3QxXSwgY2FsbGJhY2ssIGFuaW1hdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRhbmltYXRpb24gPSBhbmltYXRpb24gPT09IHVuZGVmaW5lZCA/IHRoaXMuc2V0dGluZ3MuY29yZS5hbmltYXRpb24gOiBhbmltYXRpb247XG5cdFx0XHRpZighdGhpcy5pc19jbG9zZWQob2JqKSkge1xuXHRcdFx0XHRpZihjYWxsYmFjaykge1xuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgb2JqLCBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXRoaXMuaXNfbG9hZGVkKG9iaikpIHtcblx0XHRcdFx0aWYodGhpcy5pc19sb2FkaW5nKG9iaikpIHtcblx0XHRcdFx0XHRyZXR1cm4gc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHRoaXMub3Blbl9ub2RlKG9iaiwgY2FsbGJhY2ssIGFuaW1hdGlvbik7XG5cdFx0XHRcdFx0fSwgdGhpcyksIDUwMCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5sb2FkX25vZGUob2JqLCBmdW5jdGlvbiAobywgb2spIHtcblx0XHRcdFx0XHRyZXR1cm4gb2sgPyB0aGlzLm9wZW5fbm9kZShvLCBjYWxsYmFjaywgYW5pbWF0aW9uKSA6IChjYWxsYmFjayA/IGNhbGxiYWNrLmNhbGwodGhpcywgbywgZmFsc2UpIDogZmFsc2UpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0XHR0ID0gdGhpcztcblx0XHRcdFx0aWYoZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRpZihhbmltYXRpb24gJiYgZC5jaGlsZHJlbihcIi5qc3RyZWUtY2hpbGRyZW5cIikubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRkLmNoaWxkcmVuKFwiLmpzdHJlZS1jaGlsZHJlblwiKS5zdG9wKHRydWUsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihvYmouY2hpbGRyZW4ubGVuZ3RoICYmICF0aGlzLl9maXJzdENoaWxkKGQuY2hpbGRyZW4oJy5qc3RyZWUtY2hpbGRyZW4nKVswXSkpIHtcblx0XHRcdFx0XHRcdHRoaXMuZHJhd19jaGlsZHJlbihvYmopO1xuXHRcdFx0XHRcdFx0Ly9kID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZighYW5pbWF0aW9uKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2JlZm9yZV9vcGVuJywgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdFx0XHRcdGRbMF0uY2xhc3NOYW1lID0gZFswXS5jbGFzc05hbWUucmVwbGFjZSgnanN0cmVlLWNsb3NlZCcsICdqc3RyZWUtb3BlbicpO1xuXHRcdFx0XHRcdFx0ZFswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMudHJpZ2dlcignYmVmb3JlX29wZW4nLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0XHRcdFx0ZFxuXHRcdFx0XHRcdFx0XHQuY2hpbGRyZW4oXCIuanN0cmVlLWNoaWxkcmVuXCIpLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIikuZW5kKClcblx0XHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFwianN0cmVlLWNsb3NlZFwiKS5hZGRDbGFzcyhcImpzdHJlZS1vcGVuXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsIHRydWUpXG5cdFx0XHRcdFx0XHRcdC5jaGlsZHJlbihcIi5qc3RyZWUtY2hpbGRyZW5cIikuc3RvcCh0cnVlLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdC5zbGlkZURvd24oYW5pbWF0aW9uLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHQuZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0LnRyaWdnZXIoXCJhZnRlcl9vcGVuXCIsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdG9iai5zdGF0ZS5vcGVuZWQgPSB0cnVlO1xuXHRcdFx0XHRpZihjYWxsYmFjaykge1xuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgb2JqLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighZC5sZW5ndGgpIHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgYWJvdXQgdG8gYmUgb3BlbmVkIChpZiB0aGUgbm9kZSBpcyBzdXBwb3NlZCB0byBiZSBpbiB0aGUgRE9NLCBpdCB3aWxsIGJlLCBidXQgaXQgd29uJ3QgYmUgdmlzaWJsZSB5ZXQpXG5cdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0ICogQG5hbWUgYmVmb3JlX29wZW4uanN0cmVlXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIG9wZW5lZCBub2RlXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdiZWZvcmVfb3BlbicsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyBvcGVuZWQgKGlmIHRoZXJlIGlzIGFuIGFuaW1hdGlvbiBpdCB3aWxsIG5vdCBiZSBjb21wbGV0ZWQgeWV0KVxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgb3Blbl9ub2RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgb3BlbmVkIG5vZGVcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignb3Blbl9ub2RlJywgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdFx0aWYoIWFuaW1hdGlvbiB8fCAhZC5sZW5ndGgpIHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgb3BlbmVkIGFuZCB0aGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlXG5cdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0ICogQG5hbWUgYWZ0ZXJfb3Blbi5qc3RyZWVcblx0XHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgb3BlbmVkIG5vZGVcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoXCJhZnRlcl9vcGVuXCIsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBvcGVucyBldmVyeSBwYXJlbnQgb2YgYSBub2RlIChub2RlIHNob3VsZCBiZSBsb2FkZWQpXG5cdFx0ICogQG5hbWUgX29wZW5fdG8ob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byByZXZlYWxcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdF9vcGVuX3RvIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGksIGosIHAgPSBvYmoucGFyZW50cztcblx0XHRcdGZvcihpID0gMCwgaiA9IHAubGVuZ3RoOyBpIDwgajsgaSs9MSkge1xuXHRcdFx0XHRpZihpICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0dGhpcy5vcGVuX25vZGUocFtpXSwgZmFsc2UsIDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gJCgnIycgKyBvYmouaWQucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSwgdGhpcy5lbGVtZW50KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNsb3NlcyBhIG5vZGUsIGhpZGluZyBpdHMgY2hpbGRyZW5cblx0XHQgKiBAbmFtZSBjbG9zZV9ub2RlKG9iaiBbLCBhbmltYXRpb25dKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBjbG9zZVxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBhbmltYXRpb24gdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgd2hlbiBjbG9zaW5nIHRoZSBub2RlIChvdmVycmlkZXMgdGhlIGBjb3JlLmFuaW1hdGlvbmAgc2V0dGluZykuIFVzZSBgZmFsc2VgIGZvciBubyBhbmltYXRpb24uXG5cdFx0ICogQHRyaWdnZXIgY2xvc2Vfbm9kZS5qc3RyZWUsIGFmdGVyX2Nsb3NlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGNsb3NlX25vZGUgOiBmdW5jdGlvbiAob2JqLCBhbmltYXRpb24pIHtcblx0XHRcdHZhciB0MSwgdDIsIHQsIGQ7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5jbG9zZV9ub2RlKG9ialt0MV0sIGFuaW1hdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLmlzX2Nsb3NlZChvYmopKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGFuaW1hdGlvbiA9IGFuaW1hdGlvbiA9PT0gdW5kZWZpbmVkID8gdGhpcy5zZXR0aW5ncy5jb3JlLmFuaW1hdGlvbiA6IGFuaW1hdGlvbjtcblx0XHRcdHQgPSB0aGlzO1xuXHRcdFx0ZCA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblxuXHRcdFx0b2JqLnN0YXRlLm9wZW5lZCA9IGZhbHNlO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgY2xvc2VkIChpZiB0aGVyZSBpcyBhbiBhbmltYXRpb24gaXQgd2lsbCBub3QgYmUgY29tcGxldGUgeWV0KVxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjbG9zZV9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIGNsb3NlZCBub2RlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignY2xvc2Vfbm9kZScseyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdGlmKCFkLmxlbmd0aCkge1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIGNsb3NlZCBhbmQgdGhlIGFuaW1hdGlvbiBpcyBjb21wbGV0ZVxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgYWZ0ZXJfY2xvc2UuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBjbG9zZWQgbm9kZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKFwiYWZ0ZXJfY2xvc2VcIiwgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZighYW5pbWF0aW9uKSB7XG5cdFx0XHRcdFx0ZFswXS5jbGFzc05hbWUgPSBkWzBdLmNsYXNzTmFtZS5yZXBsYWNlKCdqc3RyZWUtb3BlbicsICdqc3RyZWUtY2xvc2VkJyk7XG5cdFx0XHRcdFx0ZC5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCBmYWxzZSkuY2hpbGRyZW4oJy5qc3RyZWUtY2hpbGRyZW4nKS5yZW1vdmUoKTtcblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoXCJhZnRlcl9jbG9zZVwiLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGRcblx0XHRcdFx0XHRcdC5jaGlsZHJlbihcIi5qc3RyZWUtY2hpbGRyZW5cIikuYXR0cihcInN0eWxlXCIsXCJkaXNwbGF5OmJsb2NrICFpbXBvcnRhbnRcIikuZW5kKClcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcImpzdHJlZS1vcGVuXCIpLmFkZENsYXNzKFwianN0cmVlLWNsb3NlZFwiKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCBmYWxzZSlcblx0XHRcdFx0XHRcdC5jaGlsZHJlbihcIi5qc3RyZWUtY2hpbGRyZW5cIikuc3RvcCh0cnVlLCB0cnVlKS5zbGlkZVVwKGFuaW1hdGlvbiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHRkLmNoaWxkcmVuKCcuanN0cmVlLWNoaWxkcmVuJykucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdGlmICh0LmVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0XHR0LnRyaWdnZXIoXCJhZnRlcl9jbG9zZVwiLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogdG9nZ2xlcyBhIG5vZGUgLSBjbG9zaW5nIGl0IGlmIGl0IGlzIG9wZW4sIG9wZW5pbmcgaXQgaWYgaXQgaXMgY2xvc2VkXG5cdFx0ICogQG5hbWUgdG9nZ2xlX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byB0b2dnbGVcblx0XHQgKi9cblx0XHR0b2dnbGVfbm9kZSA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdHZhciB0MSwgdDI7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy50b2dnbGVfbm9kZShvYmpbdDFdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuaXNfY2xvc2VkKG9iaikpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMub3Blbl9ub2RlKG9iaik7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLmlzX29wZW4ob2JqKSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jbG9zZV9ub2RlKG9iaik7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBvcGVucyBhbGwgbm9kZXMgd2l0aGluIGEgbm9kZSAob3IgdGhlIHRyZWUpLCByZXZlYWxpbmcgdGhlaXIgY2hpbGRyZW4uIElmIHRoZSBub2RlIGlzIG5vdCBsb2FkZWQgaXQgd2lsbCBiZSBsb2FkZWQgYW5kIG9wZW5lZCBvbmNlIHJlYWR5LlxuXHRcdCAqIEBuYW1lIG9wZW5fYWxsKFtvYmosIGFuaW1hdGlvbiwgb3JpZ2luYWxfb2JqXSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gb3BlbiByZWN1cnNpdmVseSwgb21pdCB0byBvcGVuIGFsbCBub2RlcyBpbiB0aGUgdHJlZVxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBhbmltYXRpb24gdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgd2hlbiBvcGVuaW5nIHRoZSBub2RlcywgdGhlIGRlZmF1bHQgaXMgbm8gYW5pbWF0aW9uXG5cdFx0ICogQHBhcmFtIHtqUXVlcnl9IHJlZmVyZW5jZSB0byB0aGUgbm9kZSB0aGF0IHN0YXJ0ZWQgdGhlIHByb2Nlc3MgKGludGVybmFsIHVzZSlcblx0XHQgKiBAdHJpZ2dlciBvcGVuX2FsbC5qc3RyZWVcblx0XHQgKi9cblx0XHRvcGVuX2FsbCA6IGZ1bmN0aW9uIChvYmosIGFuaW1hdGlvbiwgb3JpZ2luYWxfb2JqKSB7XG5cdFx0XHRpZighb2JqKSB7IG9iaiA9ICQuanN0cmVlLnJvb3Q7IH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR2YXIgZG9tID0gb2JqLmlkID09PSAkLmpzdHJlZS5yb290ID8gdGhpcy5nZXRfY29udGFpbmVyX3VsKCkgOiB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSksIGksIGosIF90aGlzO1xuXHRcdFx0aWYoIWRvbS5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYodGhpcy5pc19jbG9zZWQodGhpcy5fbW9kZWwuZGF0YVtvYmouY2hpbGRyZW5fZFtpXV0pKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW29iai5jaGlsZHJlbl9kW2ldXS5zdGF0ZS5vcGVuZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy50cmlnZ2VyKCdvcGVuX2FsbCcsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHR9XG5cdFx0XHRvcmlnaW5hbF9vYmogPSBvcmlnaW5hbF9vYmogfHwgZG9tO1xuXHRcdFx0X3RoaXMgPSB0aGlzO1xuXHRcdFx0ZG9tID0gdGhpcy5pc19jbG9zZWQob2JqKSA/IGRvbS5maW5kKCcuanN0cmVlLWNsb3NlZCcpLmFkZEJhY2soKSA6IGRvbS5maW5kKCcuanN0cmVlLWNsb3NlZCcpO1xuXHRcdFx0ZG9tLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRfdGhpcy5vcGVuX25vZGUoXG5cdFx0XHRcdFx0dGhpcyxcblx0XHRcdFx0XHRmdW5jdGlvbihub2RlLCBzdGF0dXMpIHsgaWYoc3RhdHVzICYmIHRoaXMuaXNfcGFyZW50KG5vZGUpKSB7IHRoaXMub3Blbl9hbGwobm9kZSwgYW5pbWF0aW9uLCBvcmlnaW5hbF9vYmopOyB9IH0sXG5cdFx0XHRcdFx0YW5pbWF0aW9uIHx8IDBcblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdFx0aWYob3JpZ2luYWxfb2JqLmZpbmQoJy5qc3RyZWUtY2xvc2VkJykubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBgb3Blbl9hbGxgIGNhbGwgY29tcGxldGVzXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBvcGVuX2FsbC5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIG9wZW5lZCBub2RlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ29wZW5fYWxsJywgeyBcIm5vZGVcIiA6IHRoaXMuZ2V0X25vZGUob3JpZ2luYWxfb2JqKSB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNsb3NlcyBhbGwgbm9kZXMgd2l0aGluIGEgbm9kZSAob3IgdGhlIHRyZWUpLCByZXZlYWxpbmcgdGhlaXIgY2hpbGRyZW5cblx0XHQgKiBAbmFtZSBjbG9zZV9hbGwoW29iaiwgYW5pbWF0aW9uXSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gY2xvc2UgcmVjdXJzaXZlbHksIG9taXQgdG8gY2xvc2UgYWxsIG5vZGVzIGluIHRoZSB0cmVlXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IGFuaW1hdGlvbiB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyB3aGVuIGNsb3NpbmcgdGhlIG5vZGVzLCB0aGUgZGVmYXVsdCBpcyBubyBhbmltYXRpb25cblx0XHQgKiBAdHJpZ2dlciBjbG9zZV9hbGwuanN0cmVlXG5cdFx0ICovXG5cdFx0Y2xvc2VfYWxsIDogZnVuY3Rpb24gKG9iaiwgYW5pbWF0aW9uKSB7XG5cdFx0XHRpZighb2JqKSB7IG9iaiA9ICQuanN0cmVlLnJvb3Q7IH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR2YXIgZG9tID0gb2JqLmlkID09PSAkLmpzdHJlZS5yb290ID8gdGhpcy5nZXRfY29udGFpbmVyX3VsKCkgOiB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSksXG5cdFx0XHRcdF90aGlzID0gdGhpcywgaSwgajtcblx0XHRcdGlmKGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0ZG9tID0gdGhpcy5pc19vcGVuKG9iaikgPyBkb20uZmluZCgnLmpzdHJlZS1vcGVuJykuYWRkQmFjaygpIDogZG9tLmZpbmQoJy5qc3RyZWUtb3BlbicpO1xuXHRcdFx0XHQkKGRvbS5nZXQoKS5yZXZlcnNlKCkpLmVhY2goZnVuY3Rpb24gKCkgeyBfdGhpcy5jbG9zZV9ub2RlKHRoaXMsIGFuaW1hdGlvbiB8fCAwKTsgfSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVtvYmouY2hpbGRyZW5fZFtpXV0uc3RhdGUub3BlbmVkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIGBjbG9zZV9hbGxgIGNhbGwgY29tcGxldGVzXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGNsb3NlX2FsbC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBjbG9zZWQgbm9kZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2Nsb3NlX2FsbCcsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVja3MgaWYgYSBub2RlIGlzIGRpc2FibGVkIChub3Qgc2VsZWN0YWJsZSlcblx0XHQgKiBAbmFtZSBpc19kaXNhYmxlZChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXNfZGlzYWJsZWQgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqICYmIG9iai5zdGF0ZSAmJiBvYmouc3RhdGUuZGlzYWJsZWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBlbmFibGVzIGEgbm9kZSAtIHNvIHRoYXQgaXQgY2FuIGJlIHNlbGVjdGVkXG5cdFx0ICogQG5hbWUgZW5hYmxlX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBlbmFibGVcblx0XHQgKiBAdHJpZ2dlciBlbmFibGVfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRlbmFibGVfbm9kZSA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdHZhciB0MSwgdDI7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5lbmFibGVfbm9kZShvYmpbdDFdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdG9iai5zdGF0ZS5kaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0dGhpcy5nZXRfbm9kZShvYmosdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgZW5hYmxlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBlbmFibGVfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBlbmFibGVkIG5vZGVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdlbmFibGVfbm9kZScsIHsgJ25vZGUnIDogb2JqIH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZGlzYWJsZXMgYSBub2RlIC0gc28gdGhhdCBpdCBjYW4gbm90IGJlIHNlbGVjdGVkXG5cdFx0ICogQG5hbWUgZGlzYWJsZV9ub2RlKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gZGlzYWJsZVxuXHRcdCAqIEB0cmlnZ2VyIGRpc2FibGVfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRkaXNhYmxlX25vZGUgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgdDEsIHQyO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZV9ub2RlKG9ialt0MV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0b2JqLnN0YXRlLmRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdHRoaXMuZ2V0X25vZGUob2JqLHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKCdqc3RyZWUtZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgZGlzYWJsZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgZGlzYWJsZV9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIGRpc2FibGVkIG5vZGVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdkaXNhYmxlX25vZGUnLCB7ICdub2RlJyA6IG9iaiB9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGRldGVybWluZXMgaWYgYSBub2RlIGlzIGhpZGRlblxuXHRcdCAqIEBuYW1lIGlzX2hpZGRlbihvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICovXG5cdFx0aXNfaGlkZGVuIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuIG9iai5zdGF0ZS5oaWRkZW4gPT09IHRydWU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBoaWRlcyBhIG5vZGUgLSBpdCBpcyBzdGlsbCBpbiB0aGUgc3RydWN0dXJlIGJ1dCB3aWxsIG5vdCBiZSB2aXNpYmxlXG5cdFx0ICogQG5hbWUgaGlkZV9ub2RlKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gaGlkZVxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc2tpcF9yZWRyYXcgaW50ZXJuYWwgcGFyYW1ldGVyIGNvbnRyb2xsaW5nIGlmIHJlZHJhdyBpcyBjYWxsZWRcblx0XHQgKiBAdHJpZ2dlciBoaWRlX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0aGlkZV9ub2RlIDogZnVuY3Rpb24gKG9iaiwgc2tpcF9yZWRyYXcpIHtcblx0XHRcdHZhciB0MSwgdDI7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5oaWRlX25vZGUob2JqW3QxXSwgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFza2lwX3JlZHJhdykge1xuXHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZighb2JqLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRvYmouc3RhdGUuaGlkZGVuID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fbm9kZV9jaGFuZ2VkKG9iai5wYXJlbnQpO1xuXHRcdFx0XHRpZighc2tpcF9yZWRyYXcpIHtcblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIGhpZGRlblxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgaGlkZV9ub2RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgaGlkZGVuIG5vZGVcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignaGlkZV9ub2RlJywgeyAnbm9kZScgOiBvYmogfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzaG93cyBhIG5vZGVcblx0XHQgKiBAbmFtZSBzaG93X25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBzaG93XG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBza2lwX3JlZHJhdyBpbnRlcm5hbCBwYXJhbWV0ZXIgY29udHJvbGxpbmcgaWYgcmVkcmF3IGlzIGNhbGxlZFxuXHRcdCAqIEB0cmlnZ2VyIHNob3dfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRzaG93X25vZGUgOiBmdW5jdGlvbiAob2JqLCBza2lwX3JlZHJhdykge1xuXHRcdFx0dmFyIHQxLCB0Mjtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLnNob3dfbm9kZShvYmpbdDFdLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXNraXBfcmVkcmF3KSB7XG5cdFx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKG9iai5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0b2JqLnN0YXRlLmhpZGRlbiA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLl9ub2RlX2NoYW5nZWQob2JqLnBhcmVudCk7XG5cdFx0XHRcdGlmKCFza2lwX3JlZHJhdykge1xuXHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgc2hvd25cblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIHNob3dfbm9kZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIHNob3duIG5vZGVcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignc2hvd19ub2RlJywgeyAnbm9kZScgOiBvYmogfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBoaWRlcyBhbGwgbm9kZXNcblx0XHQgKiBAbmFtZSBoaWRlX2FsbCgpXG5cdFx0ICogQHRyaWdnZXIgaGlkZV9hbGwuanN0cmVlXG5cdFx0ICovXG5cdFx0aGlkZV9hbGwgOiBmdW5jdGlvbiAoc2tpcF9yZWRyYXcpIHtcblx0XHRcdHZhciBpLCBtID0gdGhpcy5fbW9kZWwuZGF0YSwgaWRzID0gW107XG5cdFx0XHRmb3IoaSBpbiBtKSB7XG5cdFx0XHRcdGlmKG0uaGFzT3duUHJvcGVydHkoaSkgJiYgaSAhPT0gJC5qc3RyZWUucm9vdCAmJiAhbVtpXS5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0XHRtW2ldLnN0YXRlLmhpZGRlbiA9IHRydWU7XG5cdFx0XHRcdFx0aWRzLnB1c2goaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3ID0gdHJ1ZTtcblx0XHRcdGlmKCFza2lwX3JlZHJhdykge1xuXHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbGwgbm9kZXMgYXJlIGhpZGRlblxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBoaWRlX2FsbC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIHRoZSBJRHMgb2YgYWxsIGhpZGRlbiBub2Rlc1xuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2hpZGVfYWxsJywgeyAnbm9kZXMnIDogaWRzIH0pO1xuXHRcdFx0cmV0dXJuIGlkcztcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHNob3dzIGFsbCBub2Rlc1xuXHRcdCAqIEBuYW1lIHNob3dfYWxsKClcblx0XHQgKiBAdHJpZ2dlciBzaG93X2FsbC5qc3RyZWVcblx0XHQgKi9cblx0XHRzaG93X2FsbCA6IGZ1bmN0aW9uIChza2lwX3JlZHJhdykge1xuXHRcdFx0dmFyIGksIG0gPSB0aGlzLl9tb2RlbC5kYXRhLCBpZHMgPSBbXTtcblx0XHRcdGZvcihpIGluIG0pIHtcblx0XHRcdFx0aWYobS5oYXNPd25Qcm9wZXJ0eShpKSAmJiBpICE9PSAkLmpzdHJlZS5yb290ICYmIG1baV0uc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdFx0bVtpXS5zdGF0ZS5oaWRkZW4gPSBmYWxzZTtcblx0XHRcdFx0XHRpZHMucHVzaChpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcgPSB0cnVlO1xuXHRcdFx0aWYoIXNraXBfcmVkcmF3KSB7XG5cdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFsbCBub2RlcyBhcmUgc2hvd25cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2hvd19hbGwuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyB0aGUgSURzIG9mIGFsbCBzaG93biBub2Rlc1xuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3Nob3dfYWxsJywgeyAnbm9kZXMnIDogaWRzIH0pO1xuXHRcdFx0cmV0dXJuIGlkcztcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNhbGxlZCB3aGVuIGEgbm9kZSBpcyBzZWxlY3RlZCBieSB0aGUgdXNlci4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgYWN0aXZhdGVfbm9kZShvYmosIGUpXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGUgdGhlIHJlbGF0ZWQgZXZlbnRcblx0XHQgKiBAdHJpZ2dlciBhY3RpdmF0ZV9ub2RlLmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKi9cblx0XHRhY3RpdmF0ZV9ub2RlIDogZnVuY3Rpb24gKG9iaiwgZSkge1xuXHRcdFx0aWYodGhpcy5pc19kaXNhYmxlZChvYmopKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKCFlIHx8IHR5cGVvZiBlICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRlID0ge307XG5cdFx0XHR9XG5cblx0XHRcdC8vIGVuc3VyZSBsYXN0X2NsaWNrZWQgaXMgc3RpbGwgaW4gdGhlIERPTSwgbWFrZSBpdCBmcmVzaCAobWF5YmUgaXQgd2FzIG1vdmVkPykgYW5kIG1ha2Ugc3VyZSBpdCBpcyBzdGlsbCBzZWxlY3RlZCwgaWYgbm90IC0gbWFrZSBsYXN0X2NsaWNrZWQgdGhlIGxhc3Qgc2VsZWN0ZWQgbm9kZVxuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZCA9IHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQgJiYgdGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZC5pZCAhPT0gdW5kZWZpbmVkID8gdGhpcy5nZXRfbm9kZSh0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkLmlkKSA6IG51bGw7XG5cdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkICYmICF0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkLnN0YXRlLnNlbGVjdGVkKSB7IHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQgPSBudWxsOyB9XG5cdFx0XHRpZighdGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZCAmJiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQubGVuZ3RoKSB7IHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQgPSB0aGlzLmdldF9ub2RlKHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZFt0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQubGVuZ3RoIC0gMV0pOyB9XG5cblx0XHRcdGlmKCF0aGlzLnNldHRpbmdzLmNvcmUubXVsdGlwbGUgfHwgKCFlLm1ldGFLZXkgJiYgIWUuY3RybEtleSAmJiAhZS5zaGlmdEtleSkgfHwgKGUuc2hpZnRLZXkgJiYgKCF0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkIHx8ICF0aGlzLmdldF9wYXJlbnQob2JqKSB8fCB0aGlzLmdldF9wYXJlbnQob2JqKSAhPT0gdGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZC5wYXJlbnQgKSApKSB7XG5cdFx0XHRcdGlmKCF0aGlzLnNldHRpbmdzLmNvcmUubXVsdGlwbGUgJiYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSkgJiYgdGhpcy5pc19zZWxlY3RlZChvYmopKSB7XG5cdFx0XHRcdFx0dGhpcy5kZXNlbGVjdF9ub2RlKG9iaiwgZmFsc2UsIGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuZGVzZWxlY3RfYWxsKHRydWUpO1xuXHRcdFx0XHRcdHRoaXMuc2VsZWN0X25vZGUob2JqLCBmYWxzZSwgZmFsc2UsIGUpO1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQgPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZihlLnNoaWZ0S2V5KSB7XG5cdFx0XHRcdFx0dmFyIG8gPSB0aGlzLmdldF9ub2RlKG9iaikuaWQsXG5cdFx0XHRcdFx0XHRsID0gdGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZC5pZCxcblx0XHRcdFx0XHRcdHAgPSB0aGlzLmdldF9ub2RlKHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQucGFyZW50KS5jaGlsZHJlbixcblx0XHRcdFx0XHRcdGMgPSBmYWxzZSxcblx0XHRcdFx0XHRcdGksIGo7XG5cdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5sZW5ndGg7IGkgPCBqOyBpICs9IDEpIHtcblx0XHRcdFx0XHRcdC8vIHNlcGFyYXRlIElGcyB3b3JrIHdoZW0gbyBhbmQgbCBhcmUgdGhlIHNhbWVcblx0XHRcdFx0XHRcdGlmKHBbaV0gPT09IG8pIHtcblx0XHRcdFx0XHRcdFx0YyA9ICFjO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYocFtpXSA9PT0gbCkge1xuXHRcdFx0XHRcdFx0XHRjID0gIWM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZighdGhpcy5pc19kaXNhYmxlZChwW2ldKSAmJiAoYyB8fCBwW2ldID09PSBvIHx8IHBbaV0gPT09IGwpKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdGhpcy5pc19oaWRkZW4ocFtpXSkpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNlbGVjdF9ub2RlKHBbaV0sIHRydWUsIGZhbHNlLCBlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuZGVzZWxlY3Rfbm9kZShwW2ldLCB0cnVlLCBlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdzZWxlY3Rfbm9kZScsICdub2RlJyA6IHRoaXMuZ2V0X25vZGUob2JqKSwgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJ2V2ZW50JyA6IGUgfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYoIXRoaXMuaXNfc2VsZWN0ZWQob2JqKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZWxlY3Rfbm9kZShvYmosIGZhbHNlLCBmYWxzZSwgZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5kZXNlbGVjdF9ub2RlKG9iaiwgZmFsc2UsIGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIGNsaWNrZWQgb3IgaW50ZXJjYXRlZCB3aXRoIGJ5IHRoZSB1c2VyXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGFjdGl2YXRlX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBvb3JpZ2luYWwgZXZlbnQgKGlmIGFueSkgd2hpY2ggdHJpZ2dlcmVkIHRoZSBjYWxsIChtYXkgYmUgYW4gZW1wdHkgb2JqZWN0KVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2FjdGl2YXRlX25vZGUnLCB7ICdub2RlJyA6IHRoaXMuZ2V0X25vZGUob2JqKSwgJ2V2ZW50JyA6IGUgfSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBhcHBsaWVzIHRoZSBob3ZlciBzdGF0ZSBvbiBhIG5vZGUsIGNhbGxlZCB3aGVuIGEgbm9kZSBpcyBob3ZlcmVkIGJ5IHRoZSB1c2VyLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBob3Zlcl9ub2RlKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmpcblx0XHQgKiBAdHJpZ2dlciBob3Zlcl9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGhvdmVyX25vZGUgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZighb2JqIHx8ICFvYmoubGVuZ3RoIHx8IG9iai5jaGlsZHJlbignLmpzdHJlZS1ob3ZlcmVkJykubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZhciBvID0gdGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtaG92ZXJlZCcpLCB0ID0gdGhpcy5lbGVtZW50O1xuXHRcdFx0aWYobyAmJiBvLmxlbmd0aCkgeyB0aGlzLmRlaG92ZXJfbm9kZShvKTsgfVxuXG5cdFx0XHRvYmouY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3MoJ2pzdHJlZS1ob3ZlcmVkJyk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgaG92ZXJlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBob3Zlcl9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdob3Zlcl9ub2RlJywgeyAnbm9kZScgOiB0aGlzLmdldF9ub2RlKG9iaikgfSk7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBvYmpbMF0uaWQpOyB9LCAwKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJlbW92ZXMgdGhlIGhvdmVyIHN0YXRlIGZyb20gYSBub2RlY2FsbGVkIHdoZW4gYSBub2RlIGlzIG5vIGxvbmdlciBob3ZlcmVkIGJ5IHRoZSB1c2VyLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBkZWhvdmVyX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9ialxuXHRcdCAqIEB0cmlnZ2VyIGRlaG92ZXJfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRkZWhvdmVyX25vZGUgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZighb2JqIHx8ICFvYmoubGVuZ3RoIHx8ICFvYmouY2hpbGRyZW4oJy5qc3RyZWUtaG92ZXJlZCcpLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRvYmouY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1ob3ZlcmVkJyk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgbm8gbG9uZ2VyIGhvdmVyZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgZGVob3Zlcl9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdkZWhvdmVyX25vZGUnLCB7ICdub2RlJyA6IHRoaXMuZ2V0X25vZGUob2JqKSB9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHNlbGVjdCBhIG5vZGVcblx0XHQgKiBAbmFtZSBzZWxlY3Rfbm9kZShvYmogWywgc3VwcmVzc19ldmVudCwgcHJldmVudF9vcGVuXSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogYW4gYXJyYXkgY2FuIGJlIHVzZWQgdG8gc2VsZWN0IG11bHRpcGxlIG5vZGVzXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBzdXByZXNzX2V2ZW50IGlmIHNldCB0byBgdHJ1ZWAgdGhlIGBjaGFuZ2VkLmpzdHJlZWAgZXZlbnQgd29uJ3QgYmUgdHJpZ2dlcmVkXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBwcmV2ZW50X29wZW4gaWYgc2V0IHRvIGB0cnVlYCBwYXJlbnRzIG9mIHRoZSBzZWxlY3RlZCBub2RlIHdvbid0IGJlIG9wZW5lZFxuXHRcdCAqIEB0cmlnZ2VyIHNlbGVjdF9ub2RlLmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKi9cblx0XHRzZWxlY3Rfbm9kZSA6IGZ1bmN0aW9uIChvYmosIHN1cHJlc3NfZXZlbnQsIHByZXZlbnRfb3BlbiwgZSkge1xuXHRcdFx0dmFyIGRvbSwgdDEsIHQyLCB0aDtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdF9ub2RlKG9ialt0MV0sIHN1cHJlc3NfZXZlbnQsIHByZXZlbnRfb3BlbiwgZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZighb2JqLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5wdXNoKG9iai5pZCk7XG5cdFx0XHRcdGlmKCFwcmV2ZW50X29wZW4pIHtcblx0XHRcdFx0XHRkb20gPSB0aGlzLl9vcGVuX3RvKG9iaik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoZG9tICYmIGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRkb20uYXR0cignYXJpYS1zZWxlY3RlZCcsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKCdqc3RyZWUtY2xpY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIHNlbGVjdGVkXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBzZWxlY3Rfbm9kZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgZXZlbnQgKGlmIGFueSkgdGhhdCB0cmlnZ2VyZWQgdGhpcyBzZWxlY3Rfbm9kZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdzZWxlY3Rfbm9kZScsIHsgJ25vZGUnIDogb2JqLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAnZXZlbnQnIDogZSB9KTtcblx0XHRcdFx0aWYoIXN1cHJlc3NfZXZlbnQpIHtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBzZWxlY3Rpb24gY2hhbmdlc1xuXHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdCAqIEBuYW1lIGNoYW5nZWQuanN0cmVlXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uIHRoZSBhY3Rpb24gdGhhdCBjYXVzZWQgdGhlIHNlbGVjdGlvbiB0byBjaGFuZ2Vcblx0XHRcdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIGV2ZW50IChpZiBhbnkpIHRoYXQgdHJpZ2dlcmVkIHRoaXMgY2hhbmdlZCBldmVudFxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAnc2VsZWN0X25vZGUnLCAnbm9kZScgOiBvYmosICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICdldmVudCcgOiBlIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBkZXNlbGVjdCBhIG5vZGVcblx0XHQgKiBAbmFtZSBkZXNlbGVjdF9ub2RlKG9iaiBbLCBzdXByZXNzX2V2ZW50XSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogYW4gYXJyYXkgY2FuIGJlIHVzZWQgdG8gZGVzZWxlY3QgbXVsdGlwbGUgbm9kZXNcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHN1cHJlc3NfZXZlbnQgaWYgc2V0IHRvIGB0cnVlYCB0aGUgYGNoYW5nZWQuanN0cmVlYCBldmVudCB3b24ndCBiZSB0cmlnZ2VyZWRcblx0XHQgKiBAdHJpZ2dlciBkZXNlbGVjdF9ub2RlLmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKi9cblx0XHRkZXNlbGVjdF9ub2RlIDogZnVuY3Rpb24gKG9iaiwgc3VwcmVzc19ldmVudCwgZSkge1xuXHRcdFx0dmFyIHQxLCB0MiwgZG9tO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuZGVzZWxlY3Rfbm9kZShvYmpbdDFdLCBzdXByZXNzX2V2ZW50LCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKG9iai5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHRvYmouc3RhdGUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkID0gJC52YWthdGEuYXJyYXlfcmVtb3ZlX2l0ZW0odGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCBvYmouaWQpO1xuXHRcdFx0XHRpZihkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZG9tLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1jbGlja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgZGVzZWxlY3RlZFxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgZGVzZWxlY3Rfbm9kZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgZXZlbnQgKGlmIGFueSkgdGhhdCB0cmlnZ2VyZWQgdGhpcyBkZXNlbGVjdF9ub2RlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2Rlc2VsZWN0X25vZGUnLCB7ICdub2RlJyA6IG9iaiwgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJ2V2ZW50JyA6IGUgfSk7XG5cdFx0XHRcdGlmKCFzdXByZXNzX2V2ZW50KSB7XG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdkZXNlbGVjdF9ub2RlJywgJ25vZGUnIDogb2JqLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAnZXZlbnQnIDogZSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc2VsZWN0IGFsbCBub2RlcyBpbiB0aGUgdHJlZVxuXHRcdCAqIEBuYW1lIHNlbGVjdF9hbGwoW3N1cHJlc3NfZXZlbnRdKVxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc3VwcmVzc19ldmVudCBpZiBzZXQgdG8gYHRydWVgIHRoZSBgY2hhbmdlZC5qc3RyZWVgIGV2ZW50IHdvbid0IGJlIHRyaWdnZXJlZFxuXHRcdCAqIEB0cmlnZ2VyIHNlbGVjdF9hbGwuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHNlbGVjdF9hbGwgOiBmdW5jdGlvbiAoc3VwcmVzc19ldmVudCkge1xuXHRcdFx0dmFyIHRtcCA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5jb25jYXQoW10pLCBpLCBqO1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkID0gdGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XS5jaGlsZHJlbl9kLmNvbmNhdCgpO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW3RoaXMuX2RhdGEuY29yZS5zZWxlY3RlZFtpXV0pIHtcblx0XHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW3RoaXMuX2RhdGEuY29yZS5zZWxlY3RlZFtpXV0uc3RhdGUuc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnJlZHJhdyh0cnVlKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYWxsIG5vZGVzIGFyZSBzZWxlY3RlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzZWxlY3RfYWxsLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2VsZWN0X2FsbCcsIHsgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCB9KTtcblx0XHRcdGlmKCFzdXByZXNzX2V2ZW50KSB7XG5cdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAnc2VsZWN0X2FsbCcsICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICdvbGRfc2VsZWN0aW9uJyA6IHRtcCB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGRlc2VsZWN0IGFsbCBzZWxlY3RlZCBub2Rlc1xuXHRcdCAqIEBuYW1lIGRlc2VsZWN0X2FsbChbc3VwcmVzc19ldmVudF0pXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBzdXByZXNzX2V2ZW50IGlmIHNldCB0byBgdHJ1ZWAgdGhlIGBjaGFuZ2VkLmpzdHJlZWAgZXZlbnQgd29uJ3QgYmUgdHJpZ2dlcmVkXG5cdFx0ICogQHRyaWdnZXIgZGVzZWxlY3RfYWxsLmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKi9cblx0XHRkZXNlbGVjdF9hbGwgOiBmdW5jdGlvbiAoc3VwcmVzc19ldmVudCkge1xuXHRcdFx0dmFyIHRtcCA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5jb25jYXQoW10pLCBpLCBqO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW3RoaXMuX2RhdGEuY29yZS5zZWxlY3RlZFtpXV0pIHtcblx0XHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW3RoaXMuX2RhdGEuY29yZS5zZWxlY3RlZFtpXV0uc3RhdGUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkID0gW107XG5cdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS1jbGlja2VkJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1jbGlja2VkJykucGFyZW50KCkuYXR0cignYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYWxsIG5vZGVzIGFyZSBkZXNlbGVjdGVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGRlc2VsZWN0X2FsbC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBwcmV2aW91cyBzZWxlY3Rpb25cblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2Rlc2VsZWN0X2FsbCcsIHsgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJ25vZGUnIDogdG1wIH0pO1xuXHRcdFx0aWYoIXN1cHJlc3NfZXZlbnQpIHtcblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdkZXNlbGVjdF9hbGwnLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAnb2xkX3NlbGVjdGlvbicgOiB0bXAgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVja3MgaWYgYSBub2RlIGlzIHNlbGVjdGVkXG5cdFx0ICogQG5hbWUgaXNfc2VsZWN0ZWQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRpc19zZWxlY3RlZCA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvYmouc3RhdGUuc2VsZWN0ZWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgYW4gYXJyYXkgb2YgYWxsIHNlbGVjdGVkIG5vZGVzXG5cdFx0ICogQG5hbWUgZ2V0X3NlbGVjdGVkKFtmdWxsXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gIGZ1bGwgaWYgc2V0IHRvIGB0cnVlYCB0aGUgcmV0dXJuZWQgYXJyYXkgd2lsbCBjb25zaXN0IG9mIHRoZSBmdWxsIG5vZGUgb2JqZWN0cywgb3RoZXJ3aXNlIC0gb25seSBJRHMgd2lsbCBiZSByZXR1cm5lZFxuXHRcdCAqIEByZXR1cm4ge0FycmF5fVxuXHRcdCAqL1xuXHRcdGdldF9zZWxlY3RlZCA6IGZ1bmN0aW9uIChmdWxsKSB7XG5cdFx0XHRyZXR1cm4gZnVsbCA/ICQubWFwKHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJC5wcm94eShmdW5jdGlvbiAoaSkgeyByZXR1cm4gdGhpcy5nZXRfbm9kZShpKTsgfSwgdGhpcykpIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLnNsaWNlKCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgYW4gYXJyYXkgb2YgYWxsIHRvcCBsZXZlbCBzZWxlY3RlZCBub2RlcyAoaWdub3JpbmcgY2hpbGRyZW4gb2Ygc2VsZWN0ZWQgbm9kZXMpXG5cdFx0ICogQG5hbWUgZ2V0X3RvcF9zZWxlY3RlZChbZnVsbF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICBmdWxsIGlmIHNldCB0byBgdHJ1ZWAgdGhlIHJldHVybmVkIGFycmF5IHdpbGwgY29uc2lzdCBvZiB0aGUgZnVsbCBub2RlIG9iamVjdHMsIG90aGVyd2lzZSAtIG9ubHkgSURzIHdpbGwgYmUgcmV0dXJuZWRcblx0XHQgKiBAcmV0dXJuIHtBcnJheX1cblx0XHQgKi9cblx0XHRnZXRfdG9wX3NlbGVjdGVkIDogZnVuY3Rpb24gKGZ1bGwpIHtcblx0XHRcdHZhciB0bXAgPSB0aGlzLmdldF9zZWxlY3RlZCh0cnVlKSxcblx0XHRcdFx0b2JqID0ge30sIGksIGosIGssIGw7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdG9ialt0bXBbaV0uaWRdID0gdG1wW2ldO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRmb3IoayA9IDAsIGwgPSB0bXBbaV0uY2hpbGRyZW5fZC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRpZihvYmpbdG1wW2ldLmNoaWxkcmVuX2Rba11dKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgb2JqW3RtcFtpXS5jaGlsZHJlbl9kW2tdXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRtcCA9IFtdO1xuXHRcdFx0Zm9yKGkgaW4gb2JqKSB7XG5cdFx0XHRcdGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdHRtcC5wdXNoKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnVsbCA/ICQubWFwKHRtcCwgJC5wcm94eShmdW5jdGlvbiAoaSkgeyByZXR1cm4gdGhpcy5nZXRfbm9kZShpKTsgfSwgdGhpcykpIDogdG1wO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IGFuIGFycmF5IG9mIGFsbCBib3R0b20gbGV2ZWwgc2VsZWN0ZWQgbm9kZXMgKGlnbm9yaW5nIHNlbGVjdGVkIHBhcmVudHMpXG5cdFx0ICogQG5hbWUgZ2V0X2JvdHRvbV9zZWxlY3RlZChbZnVsbF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICBmdWxsIGlmIHNldCB0byBgdHJ1ZWAgdGhlIHJldHVybmVkIGFycmF5IHdpbGwgY29uc2lzdCBvZiB0aGUgZnVsbCBub2RlIG9iamVjdHMsIG90aGVyd2lzZSAtIG9ubHkgSURzIHdpbGwgYmUgcmV0dXJuZWRcblx0XHQgKiBAcmV0dXJuIHtBcnJheX1cblx0XHQgKi9cblx0XHRnZXRfYm90dG9tX3NlbGVjdGVkIDogZnVuY3Rpb24gKGZ1bGwpIHtcblx0XHRcdHZhciB0bXAgPSB0aGlzLmdldF9zZWxlY3RlZCh0cnVlKSxcblx0XHRcdFx0b2JqID0gW10sIGksIGo7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKCF0bXBbaV0uY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0b2JqLnB1c2godG1wW2ldLmlkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZ1bGwgPyAkLm1hcChvYmosICQucHJveHkoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIHRoaXMuZ2V0X25vZGUoaSk7IH0sIHRoaXMpKSA6IG9iajtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHRyZWUgc28gdGhhdCBpdCBjYW4gYmUgcmVzdG9yZWQgbGF0ZXIgd2l0aCBgc2V0X3N0YXRlKHN0YXRlKWAuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAbmFtZSBnZXRfc3RhdGUoKVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGdldF9zdGF0ZSA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBzdGF0ZVx0PSB7XG5cdFx0XHRcdCdjb3JlJyA6IHtcblx0XHRcdFx0XHQnb3BlbicgOiBbXSxcblx0XHRcdFx0XHQnbG9hZGVkJyA6IFtdLFxuXHRcdFx0XHRcdCdzY3JvbGwnIDoge1xuXHRcdFx0XHRcdFx0J2xlZnQnIDogdGhpcy5lbGVtZW50LnNjcm9sbExlZnQoKSxcblx0XHRcdFx0XHRcdCd0b3AnIDogdGhpcy5lbGVtZW50LnNjcm9sbFRvcCgpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQvKiFcblx0XHRcdFx0XHQndGhlbWVzJyA6IHtcblx0XHRcdFx0XHRcdCduYW1lJyA6IHRoaXMuZ2V0X3RoZW1lKCksXG5cdFx0XHRcdFx0XHQnaWNvbnMnIDogdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5pY29ucyxcblx0XHRcdFx0XHRcdCdkb3RzJyA6IHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZG90c1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Ki9cblx0XHRcdFx0XHQnc2VsZWN0ZWQnIDogW11cblx0XHRcdFx0fVxuXHRcdFx0fSwgaTtcblx0XHRcdGZvcihpIGluIHRoaXMuX21vZGVsLmRhdGEpIHtcblx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdGlmKGkgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbaV0uc3RhdGUubG9hZGVkICYmIHRoaXMuc2V0dGluZ3MuY29yZS5sb2FkZWRfc3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0c3RhdGUuY29yZS5sb2FkZWQucHVzaChpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbaV0uc3RhdGUub3BlbmVkKSB7XG5cdFx0XHRcdFx0XHRcdHN0YXRlLmNvcmUub3Blbi5wdXNoKGkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVtpXS5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHRcdFx0XHRzdGF0ZS5jb3JlLnNlbGVjdGVkLnB1c2goaSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3RhdGU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzZXRzIHRoZSBzdGF0ZSBvZiB0aGUgdHJlZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBuYW1lIHNldF9zdGF0ZShzdGF0ZSBbLCBjYWxsYmFja10pXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgdGhlIHN0YXRlIHRvIHJlc3RvcmUuIEtlZXAgaW4gbWluZCB0aGlzIG9iamVjdCBpcyBwYXNzZWQgYnkgcmVmZXJlbmNlIGFuZCBqc3RyZWUgd2lsbCBtb2RpZnkgaXQuXG5cdFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYW4gb3B0aW9uYWwgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbmNlIHRoZSBzdGF0ZSBpcyByZXN0b3JlZC5cblx0XHQgKiBAdHJpZ2dlciBzZXRfc3RhdGUuanN0cmVlXG5cdFx0ICovXG5cdFx0c2V0X3N0YXRlIDogZnVuY3Rpb24gKHN0YXRlLCBjYWxsYmFjaykge1xuXHRcdFx0aWYoc3RhdGUpIHtcblx0XHRcdFx0aWYoc3RhdGUuY29yZSAmJiBzdGF0ZS5jb3JlLnNlbGVjdGVkICYmIHN0YXRlLmNvcmUuaW5pdGlhbF9zZWxlY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHN0YXRlLmNvcmUuaW5pdGlhbF9zZWxlY3Rpb24gPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuY29uY2F0KFtdKS5zb3J0KCkuam9pbignLCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHN0YXRlLmNvcmUpIHtcblx0XHRcdFx0XHR2YXIgcmVzLCBuLCB0LCBfdGhpcywgaTtcblx0XHRcdFx0XHRpZihzdGF0ZS5jb3JlLmxvYWRlZCkge1xuXHRcdFx0XHRcdFx0aWYoIXRoaXMuc2V0dGluZ3MuY29yZS5sb2FkZWRfc3RhdGUgfHwgISQuaXNBcnJheShzdGF0ZS5jb3JlLmxvYWRlZCkgfHwgIXN0YXRlLmNvcmUubG9hZGVkLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgc3RhdGUuY29yZS5sb2FkZWQ7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0X3N0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fbG9hZF9ub2RlcyhzdGF0ZS5jb3JlLmxvYWRlZCwgZnVuY3Rpb24gKG5vZGVzKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHN0YXRlLmNvcmUubG9hZGVkO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2V0X3N0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihzdGF0ZS5jb3JlLm9wZW4pIHtcblx0XHRcdFx0XHRcdGlmKCEkLmlzQXJyYXkoc3RhdGUuY29yZS5vcGVuKSB8fCAhc3RhdGUuY29yZS5vcGVuLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgc3RhdGUuY29yZS5vcGVuO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNldF9zdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2xvYWRfbm9kZXMoc3RhdGUuY29yZS5vcGVuLCBmdW5jdGlvbiAobm9kZXMpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLm9wZW5fbm9kZShub2RlcywgZmFsc2UsIDApO1xuXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBzdGF0ZS5jb3JlLm9wZW47XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHN0YXRlLmNvcmUuc2Nyb2xsKSB7XG5cdFx0XHRcdFx0XHRpZihzdGF0ZS5jb3JlLnNjcm9sbCAmJiBzdGF0ZS5jb3JlLnNjcm9sbC5sZWZ0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LnNjcm9sbExlZnQoc3RhdGUuY29yZS5zY3JvbGwubGVmdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihzdGF0ZS5jb3JlLnNjcm9sbCAmJiBzdGF0ZS5jb3JlLnNjcm9sbC50b3AgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wKHN0YXRlLmNvcmUuc2Nyb2xsLnRvcCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRkZWxldGUgc3RhdGUuY29yZS5zY3JvbGw7XG5cdFx0XHRcdFx0XHR0aGlzLnNldF9zdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihzdGF0ZS5jb3JlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdFx0XHRfdGhpcyA9IHRoaXM7XG5cdFx0XHRcdFx0XHRpZiAoc3RhdGUuY29yZS5pbml0aWFsX3NlbGVjdGlvbiA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0XHRcdHN0YXRlLmNvcmUuaW5pdGlhbF9zZWxlY3Rpb24gPT09IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5jb25jYXQoW10pLnNvcnQoKS5qb2luKCcsJylcblx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmRlc2VsZWN0X2FsbCgpO1xuXHRcdFx0XHRcdFx0XHQkLmVhY2goc3RhdGUuY29yZS5zZWxlY3RlZCwgZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5zZWxlY3Rfbm9kZSh2LCBmYWxzZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGVsZXRlIHN0YXRlLmNvcmUuaW5pdGlhbF9zZWxlY3Rpb247XG5cdFx0XHRcdFx0XHRkZWxldGUgc3RhdGUuY29yZS5zZWxlY3RlZDtcblx0XHRcdFx0XHRcdHRoaXMuc2V0X3N0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvcihpIGluIHN0YXRlKSB7XG5cdFx0XHRcdFx0XHRpZihzdGF0ZS5oYXNPd25Qcm9wZXJ0eShpKSAmJiBpICE9PSBcImNvcmVcIiAmJiAkLmluQXJyYXkoaSwgdGhpcy5zZXR0aW5ncy5wbHVnaW5zKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIHN0YXRlW2ldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZigkLmlzRW1wdHlPYmplY3Qoc3RhdGUuY29yZSkpIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSBzdGF0ZS5jb3JlO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoJC5pc0VtcHR5T2JqZWN0KHN0YXRlKSkge1xuXHRcdFx0XHRcdHN0YXRlID0gbnVsbDtcblx0XHRcdFx0XHRpZihjYWxsYmFjaykgeyBjYWxsYmFjay5jYWxsKHRoaXMpOyB9XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBgc2V0X3N0YXRlYCBjYWxsIGNvbXBsZXRlc1xuXHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdCAqIEBuYW1lIHNldF9zdGF0ZS5qc3RyZWVcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3NldF9zdGF0ZScpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJlZnJlc2hlcyB0aGUgdHJlZSAtIGFsbCBub2RlcyBhcmUgcmVsb2FkZWQgd2l0aCBjYWxscyB0byBgbG9hZF9ub2RlYC5cblx0XHQgKiBAbmFtZSByZWZyZXNoKClcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHNraXBfbG9hZGluZyBhbiBvcHRpb24gdG8gc2tpcCBzaG93aW5nIHRoZSBsb2FkaW5nIGluZGljYXRvclxuXHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGZvcmdldF9zdGF0ZSBpZiBzZXQgdG8gYHRydWVgIHN0YXRlIHdpbGwgbm90IGJlIHJlYXBwbGllZCwgaWYgc2V0IHRvIGEgZnVuY3Rpb24gKHJlY2VpdmluZyB0aGUgY3VycmVudCBzdGF0ZSBhcyBhcmd1bWVudCkgdGhlIHJlc3VsdCBvZiB0aGF0IGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBhcyBzdGF0ZVxuXHRcdCAqIEB0cmlnZ2VyIHJlZnJlc2guanN0cmVlXG5cdFx0ICovXG5cdFx0cmVmcmVzaCA6IGZ1bmN0aW9uIChza2lwX2xvYWRpbmcsIGZvcmdldF9zdGF0ZSkge1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnN0YXRlID0gZm9yZ2V0X3N0YXRlID09PSB0cnVlID8ge30gOiB0aGlzLmdldF9zdGF0ZSgpO1xuXHRcdFx0aWYoZm9yZ2V0X3N0YXRlICYmICQuaXNGdW5jdGlvbihmb3JnZXRfc3RhdGUpKSB7IHRoaXMuX2RhdGEuY29yZS5zdGF0ZSA9IGZvcmdldF9zdGF0ZS5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5zdGF0ZSk7IH1cblx0XHRcdHRoaXMuX2NudCA9IDA7XG5cdFx0XHR0aGlzLl9tb2RlbC5kYXRhID0ge307XG5cdFx0XHR0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdID0ge1xuXHRcdFx0XHRpZCA6ICQuanN0cmVlLnJvb3QsXG5cdFx0XHRcdHBhcmVudCA6IG51bGwsXG5cdFx0XHRcdHBhcmVudHMgOiBbXSxcblx0XHRcdFx0Y2hpbGRyZW4gOiBbXSxcblx0XHRcdFx0Y2hpbGRyZW5fZCA6IFtdLFxuXHRcdFx0XHRzdGF0ZSA6IHsgbG9hZGVkIDogZmFsc2UgfVxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZCA9IG51bGw7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCA9IG51bGw7XG5cblx0XHRcdHZhciBjID0gdGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0uY2xhc3NOYW1lO1xuXHRcdFx0aWYoIXNraXBfbG9hZGluZykge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuaHRtbChcIjxcIitcInVsIGNsYXNzPSdcIitjK1wiJyByb2xlPSdncm91cCc+PFwiK1wibGkgY2xhc3M9J2pzdHJlZS1pbml0aWFsLW5vZGUganN0cmVlLWxvYWRpbmcganN0cmVlLWxlYWYganN0cmVlLWxhc3QnIHJvbGU9J3RyZWVpdGVtJyBpZD0nalwiK3RoaXMuX2lkK1wiX2xvYWRpbmcnPjxpIGNsYXNzPSdqc3RyZWUtaWNvbiBqc3RyZWUtb2NsJz48L2k+PFwiK1wiYSBjbGFzcz0nanN0cmVlLWFuY2hvcicgaHJlZj0nIyc+PGkgY2xhc3M9J2pzdHJlZS1pY29uIGpzdHJlZS10aGVtZWljb24taGlkZGVuJz48L2k+XCIgKyB0aGlzLmdldF9zdHJpbmcoXCJMb2FkaW5nIC4uLlwiKSArIFwiPC9hPjwvbGk+PC91bD5cIik7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCdqJyt0aGlzLl9pZCsnX2xvYWRpbmcnKTtcblx0XHRcdH1cblx0XHRcdHRoaXMubG9hZF9ub2RlKCQuanN0cmVlLnJvb3QsIGZ1bmN0aW9uIChvLCBzKSB7XG5cdFx0XHRcdGlmKHMpIHtcblx0XHRcdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKVswXS5jbGFzc05hbWUgPSBjO1xuXHRcdFx0XHRcdGlmKHRoaXMuX2ZpcnN0Q2hpbGQodGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0pKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyx0aGlzLl9maXJzdENoaWxkKHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdKS5pZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuc2V0X3N0YXRlKCQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9kYXRhLmNvcmUuc3RhdGUpLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgYHJlZnJlc2hgIGNhbGwgY29tcGxldGVzXG5cdFx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHRcdCAqIEBuYW1lIHJlZnJlc2guanN0cmVlXG5cdFx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRcdHRoaXMudHJpZ2dlcigncmVmcmVzaCcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5zdGF0ZSA9IG51bGw7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJlZnJlc2hlcyBhIG5vZGUgaW4gdGhlIHRyZWUgKHJlbG9hZCBpdHMgY2hpbGRyZW4pIGFsbCBvcGVuZWQgbm9kZXMgaW5zaWRlIHRoYXQgbm9kZSBhcmUgcmVsb2FkZWQgd2l0aCBjYWxscyB0byBgbG9hZF9ub2RlYC5cblx0XHQgKiBAbmFtZSByZWZyZXNoX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKiBAdHJpZ2dlciByZWZyZXNoX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0cmVmcmVzaF9ub2RlIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR2YXIgb3BlbmVkID0gW10sIHRvX2xvYWQgPSBbXSwgcyA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5jb25jYXQoW10pO1xuXHRcdFx0dG9fbG9hZC5wdXNoKG9iai5pZCk7XG5cdFx0XHRpZihvYmouc3RhdGUub3BlbmVkID09PSB0cnVlKSB7IG9wZW5lZC5wdXNoKG9iai5pZCk7IH1cblx0XHRcdHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKS5maW5kKCcuanN0cmVlLW9wZW4nKS5lYWNoKGZ1bmN0aW9uKCkgeyB0b19sb2FkLnB1c2godGhpcy5pZCk7IG9wZW5lZC5wdXNoKHRoaXMuaWQpOyB9KTtcblx0XHRcdHRoaXMuX2xvYWRfbm9kZXModG9fbG9hZCwgJC5wcm94eShmdW5jdGlvbiAobm9kZXMpIHtcblx0XHRcdFx0dGhpcy5vcGVuX25vZGUob3BlbmVkLCBmYWxzZSwgMCk7XG5cdFx0XHRcdHRoaXMuc2VsZWN0X25vZGUocyk7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgcmVmcmVzaGVkXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSByZWZyZXNoX25vZGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIC0gdGhlIHJlZnJlc2hlZCBub2RlXG5cdFx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIC0gYW4gYXJyYXkgb2YgdGhlIElEcyBvZiB0aGUgbm9kZXMgdGhhdCB3ZXJlIHJlbG9hZGVkXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3JlZnJlc2hfbm9kZScsIHsgJ25vZGUnIDogb2JqLCAnbm9kZXMnIDogbm9kZXMgfSk7XG5cdFx0XHR9LCB0aGlzKSwgZmFsc2UsIHRydWUpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc2V0IChjaGFuZ2UpIHRoZSBJRCBvZiBhIG5vZGVcblx0XHQgKiBAbmFtZSBzZXRfaWQob2JqLCBpZClcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBpZCB0aGUgbmV3IElEXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKiBAdHJpZ2dlciBzZXRfaWQuanN0cmVlXG5cdFx0ICovXG5cdFx0c2V0X2lkIDogZnVuY3Rpb24gKG9iaiwgaWQpIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIGksIGosIG0gPSB0aGlzLl9tb2RlbC5kYXRhLCBvbGQgPSBvYmouaWQ7XG5cdFx0XHRpZCA9IGlkLnRvU3RyaW5nKCk7XG5cdFx0XHQvLyB1cGRhdGUgcGFyZW50cyAocmVwbGFjZSBjdXJyZW50IElEIHdpdGggbmV3IG9uZSBpbiBjaGlsZHJlbiBhbmQgY2hpbGRyZW5fZClcblx0XHRcdG1bb2JqLnBhcmVudF0uY2hpbGRyZW5bJC5pbkFycmF5KG9iai5pZCwgbVtvYmoucGFyZW50XS5jaGlsZHJlbildID0gaWQ7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBvYmoucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0bVtvYmoucGFyZW50c1tpXV0uY2hpbGRyZW5fZFskLmluQXJyYXkob2JqLmlkLCBtW29iai5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kKV0gPSBpZDtcblx0XHRcdH1cblx0XHRcdC8vIHVwZGF0ZSBjaGlsZHJlbiAocmVwbGFjZSBjdXJyZW50IElEIHdpdGggbmV3IG9uZSBpbiBwYXJlbnQgYW5kIHBhcmVudHMpXG5cdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdG1bb2JqLmNoaWxkcmVuW2ldXS5wYXJlbnQgPSBpZDtcblx0XHRcdH1cblx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRtW29iai5jaGlsZHJlbl9kW2ldXS5wYXJlbnRzWyQuaW5BcnJheShvYmouaWQsIG1bb2JqLmNoaWxkcmVuX2RbaV1dLnBhcmVudHMpXSA9IGlkO1xuXHRcdFx0fVxuXHRcdFx0aSA9ICQuaW5BcnJheShvYmouaWQsIHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCk7XG5cdFx0XHRpZihpICE9PSAtMSkgeyB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWRbaV0gPSBpZDsgfVxuXHRcdFx0Ly8gdXBkYXRlIG1vZGVsIGFuZCBvYmogaXRzZWxmIChvYmouaWQsIHRoaXMuX21vZGVsLmRhdGFbS0VZXSlcblx0XHRcdGkgPSB0aGlzLmdldF9ub2RlKG9iai5pZCwgdHJ1ZSk7XG5cdFx0XHRpZihpKSB7XG5cdFx0XHRcdGkuYXR0cignaWQnLCBpZCk7IC8vLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmF0dHIoJ2lkJywgaWQgKyAnX2FuY2hvcicpLmVuZCgpLmF0dHIoJ2FyaWEtbGFiZWxsZWRieScsIGlkICsgJ19hbmNob3InKTtcblx0XHRcdFx0aWYodGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcpID09PSBvYmouaWQpIHtcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50JywgaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgbVtvYmouaWRdO1xuXHRcdFx0b2JqLmlkID0gaWQ7XG5cdFx0XHRvYmoubGlfYXR0ci5pZCA9IGlkO1xuXHRcdFx0bVtpZF0gPSBvYmo7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpZCB2YWx1ZSBpcyBjaGFuZ2VkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNldF9pZC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gb2xkIHRoZSBvbGQgaWRcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzZXRfaWQnLHsgXCJub2RlXCIgOiBvYmosIFwibmV3XCIgOiBvYmouaWQsIFwib2xkXCIgOiBvbGQgfSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCB0aGUgdGV4dCB2YWx1ZSBvZiBhIG5vZGVcblx0XHQgKiBAbmFtZSBnZXRfdGV4dChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cblx0XHQgKi9cblx0XHRnZXRfdGV4dCA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiAoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpID8gZmFsc2UgOiBvYmoudGV4dDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHNldCB0aGUgdGV4dCB2YWx1ZSBvZiBhIG5vZGUuIFVzZWQgaW50ZXJuYWxseSwgcGxlYXNlIHVzZSBgcmVuYW1lX25vZGUob2JqLCB2YWwpYC5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIHNldF90ZXh0KG9iaiwgdmFsKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGUsIHlvdSBjYW4gcGFzcyBhbiBhcnJheSB0byBzZXQgdGhlIHRleHQgb24gbXVsdGlwbGUgbm9kZXNcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IHZhbCB0aGUgbmV3IHRleHQgdmFsdWVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqIEB0cmlnZ2VyIHNldF90ZXh0LmpzdHJlZVxuXHRcdCAqL1xuXHRcdHNldF90ZXh0IDogZnVuY3Rpb24gKG9iaiwgdmFsKSB7XG5cdFx0XHR2YXIgdDEsIHQyO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuc2V0X3RleHQob2JqW3QxXSwgdmFsKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0b2JqLnRleHQgPSB2YWw7XG5cdFx0XHRpZih0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSkubGVuZ3RoKSB7XG5cdFx0XHRcdHRoaXMucmVkcmF3X25vZGUob2JqLmlkKTtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIHRleHQgdmFsdWUgaXMgY2hhbmdlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzZXRfdGV4dC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IHRoZSBuZXcgdmFsdWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzZXRfdGV4dCcseyBcIm9ialwiIDogb2JqLCBcInRleHRcIiA6IHZhbCB9KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0cyBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgYSBub2RlIChvciB0aGUgd2hvbGUgdHJlZSlcblx0XHQgKiBAbmFtZSBnZXRfanNvbihbb2JqLCBvcHRpb25zXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gb3B0aW9ucy5ub19zdGF0ZSBkbyBub3QgcmV0dXJuIHN0YXRlIGluZm9ybWF0aW9uXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gb3B0aW9ucy5ub19pZCBkbyBub3QgcmV0dXJuIElEXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gb3B0aW9ucy5ub19jaGlsZHJlbiBkbyBub3QgaW5jbHVkZSBjaGlsZHJlblxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IG9wdGlvbnMubm9fZGF0YSBkbyBub3QgaW5jbHVkZSBub2RlIGRhdGFcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBvcHRpb25zLm5vX2xpX2F0dHIgZG8gbm90IGluY2x1ZGUgTEkgYXR0cmlidXRlc1xuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IG9wdGlvbnMubm9fYV9hdHRyIGRvIG5vdCBpbmNsdWRlIEEgYXR0cmlidXRlc1xuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IG9wdGlvbnMuZmxhdCByZXR1cm4gZmxhdCBKU09OIGluc3RlYWQgb2YgbmVzdGVkXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGdldF9qc29uIDogZnVuY3Rpb24gKG9iaiwgb3B0aW9ucywgZmxhdCkge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmogfHwgJC5qc3RyZWUucm9vdCk7XG5cdFx0XHRpZighb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLmZsYXQgJiYgIWZsYXQpIHsgZmxhdCA9IFtdOyB9XG5cdFx0XHR2YXIgdG1wID0ge1xuXHRcdFx0XHQnaWQnIDogb2JqLmlkLFxuXHRcdFx0XHQndGV4dCcgOiBvYmoudGV4dCxcblx0XHRcdFx0J2ljb24nIDogdGhpcy5nZXRfaWNvbihvYmopLFxuXHRcdFx0XHQnbGlfYXR0cicgOiAkLmV4dGVuZCh0cnVlLCB7fSwgb2JqLmxpX2F0dHIpLFxuXHRcdFx0XHQnYV9hdHRyJyA6ICQuZXh0ZW5kKHRydWUsIHt9LCBvYmouYV9hdHRyKSxcblx0XHRcdFx0J3N0YXRlJyA6IHt9LFxuXHRcdFx0XHQnZGF0YScgOiBvcHRpb25zICYmIG9wdGlvbnMubm9fZGF0YSA/IGZhbHNlIDogJC5leHRlbmQodHJ1ZSwgJC5pc0FycmF5KG9iai5kYXRhKT9bXTp7fSwgb2JqLmRhdGEpXG5cdFx0XHRcdC8vKCB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSkubGVuZ3RoID8gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpLmRhdGEoKSA6IG9iai5kYXRhICksXG5cdFx0XHR9LCBpLCBqO1xuXHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLmZsYXQpIHtcblx0XHRcdFx0dG1wLnBhcmVudCA9IG9iai5wYXJlbnQ7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dG1wLmNoaWxkcmVuID0gW107XG5cdFx0XHR9XG5cdFx0XHRpZighb3B0aW9ucyB8fCAhb3B0aW9ucy5ub19zdGF0ZSkge1xuXHRcdFx0XHRmb3IoaSBpbiBvYmouc3RhdGUpIHtcblx0XHRcdFx0XHRpZihvYmouc3RhdGUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IG9iai5zdGF0ZVtpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlbGV0ZSB0bXAuc3RhdGU7XG5cdFx0XHR9XG5cdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMubm9fbGlfYXR0cikge1xuXHRcdFx0XHRkZWxldGUgdG1wLmxpX2F0dHI7XG5cdFx0XHR9XG5cdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMubm9fYV9hdHRyKSB7XG5cdFx0XHRcdGRlbGV0ZSB0bXAuYV9hdHRyO1xuXHRcdFx0fVxuXHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLm5vX2lkKSB7XG5cdFx0XHRcdGRlbGV0ZSB0bXAuaWQ7XG5cdFx0XHRcdGlmKHRtcC5saV9hdHRyICYmIHRtcC5saV9hdHRyLmlkKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHRtcC5saV9hdHRyLmlkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHRtcC5hX2F0dHIgJiYgdG1wLmFfYXR0ci5pZCkge1xuXHRcdFx0XHRcdGRlbGV0ZSB0bXAuYV9hdHRyLmlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMuZmxhdCAmJiBvYmouaWQgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0ZmxhdC5wdXNoKHRtcCk7XG5cdFx0XHR9XG5cdFx0XHRpZighb3B0aW9ucyB8fCAhb3B0aW9ucy5ub19jaGlsZHJlbikge1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLmZsYXQpIHtcblx0XHRcdFx0XHRcdHRoaXMuZ2V0X2pzb24ob2JqLmNoaWxkcmVuW2ldLCBvcHRpb25zLCBmbGF0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0bXAuY2hpbGRyZW4ucHVzaCh0aGlzLmdldF9qc29uKG9iai5jaGlsZHJlbltpXSwgb3B0aW9ucykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9wdGlvbnMgJiYgb3B0aW9ucy5mbGF0ID8gZmxhdCA6IChvYmouaWQgPT09ICQuanN0cmVlLnJvb3QgPyB0bXAuY2hpbGRyZW4gOiB0bXApO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY3JlYXRlIGEgbmV3IG5vZGUgKGRvIG5vdCBjb25mdXNlIHdpdGggbG9hZF9ub2RlKVxuXHRcdCAqIEBuYW1lIGNyZWF0ZV9ub2RlKFtwYXIsIG5vZGUsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICAgcGFyICAgICAgIHRoZSBwYXJlbnQgbm9kZSAodG8gY3JlYXRlIGEgcm9vdCBub2RlIHVzZSBlaXRoZXIgXCIjXCIgKHN0cmluZykgb3IgYG51bGxgKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgIG5vZGUgICAgICB0aGUgZGF0YSBmb3IgdGhlIG5ldyBub2RlIChhIHZhbGlkIEpTT04gb2JqZWN0LCBvciBhIHNpbXBsZSBzdHJpbmcgd2l0aCB0aGUgbmFtZSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gICBwb3MgICAgICAgdGhlIGluZGV4IGF0IHdoaWNoIHRvIGluc2VydCB0aGUgbm9kZSwgXCJmaXJzdFwiIGFuZCBcImxhc3RcIiBhcmUgYWxzbyBzdXBwb3J0ZWQsIGRlZmF1bHQgaXMgXCJsYXN0XCJcblx0XHQgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb25jZSB0aGUgbm9kZSBpcyBjcmVhdGVkXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gaXNfbG9hZGVkIGludGVybmFsIGFyZ3VtZW50IGluZGljYXRpbmcgaWYgdGhlIHBhcmVudCBub2RlIHdhcyBzdWNjZXNmdWxseSBsb2FkZWRcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgdGhlIElEIG9mIHRoZSBuZXdseSBjcmVhdGUgbm9kZVxuXHRcdCAqIEB0cmlnZ2VyIG1vZGVsLmpzdHJlZSwgY3JlYXRlX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0Y3JlYXRlX25vZGUgOiBmdW5jdGlvbiAocGFyLCBub2RlLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQpIHtcblx0XHRcdGlmKHBhciA9PT0gbnVsbCkgeyBwYXIgPSAkLmpzdHJlZS5yb290OyB9XG5cdFx0XHRwYXIgPSB0aGlzLmdldF9ub2RlKHBhcik7XG5cdFx0XHRpZighcGFyKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0cG9zID0gcG9zID09PSB1bmRlZmluZWQgPyBcImxhc3RcIiA6IHBvcztcblx0XHRcdGlmKCFwb3MudG9TdHJpbmcoKS5tYXRjaCgvXihiZWZvcmV8YWZ0ZXIpJC8pICYmICFpc19sb2FkZWQgJiYgIXRoaXMuaXNfbG9hZGVkKHBhcikpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubG9hZF9ub2RlKHBhciwgZnVuY3Rpb24gKCkgeyB0aGlzLmNyZWF0ZV9ub2RlKHBhciwgbm9kZSwgcG9zLCBjYWxsYmFjaywgdHJ1ZSk7IH0pO1xuXHRcdFx0fVxuXHRcdFx0aWYoIW5vZGUpIHsgbm9kZSA9IHsgXCJ0ZXh0XCIgOiB0aGlzLmdldF9zdHJpbmcoJ05ldyBub2RlJykgfTsgfVxuXHRcdFx0aWYodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0bm9kZSA9IHsgXCJ0ZXh0XCIgOiBub2RlIH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlID0gJC5leHRlbmQodHJ1ZSwge30sIG5vZGUpO1xuXHRcdFx0fVxuXHRcdFx0aWYobm9kZS50ZXh0ID09PSB1bmRlZmluZWQpIHsgbm9kZS50ZXh0ID0gdGhpcy5nZXRfc3RyaW5nKCdOZXcgbm9kZScpOyB9XG5cdFx0XHR2YXIgdG1wLCBkcGMsIGksIGo7XG5cblx0XHRcdGlmKHBhci5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRpZihwb3MgPT09IFwiYmVmb3JlXCIpIHsgcG9zID0gXCJmaXJzdFwiOyB9XG5cdFx0XHRcdGlmKHBvcyA9PT0gXCJhZnRlclwiKSB7IHBvcyA9IFwibGFzdFwiOyB9XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2gocG9zKSB7XG5cdFx0XHRcdGNhc2UgXCJiZWZvcmVcIjpcblx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKHBhci5wYXJlbnQpO1xuXHRcdFx0XHRcdHBvcyA9ICQuaW5BcnJheShwYXIuaWQsIHRtcC5jaGlsZHJlbik7XG5cdFx0XHRcdFx0cGFyID0gdG1wO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiYWZ0ZXJcIiA6XG5cdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShwYXIucGFyZW50KTtcblx0XHRcdFx0XHRwb3MgPSAkLmluQXJyYXkocGFyLmlkLCB0bXAuY2hpbGRyZW4pICsgMTtcblx0XHRcdFx0XHRwYXIgPSB0bXA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJpbnNpZGVcIjpcblx0XHRcdFx0Y2FzZSBcImZpcnN0XCI6XG5cdFx0XHRcdFx0cG9zID0gMDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImxhc3RcIjpcblx0XHRcdFx0XHRwb3MgPSBwYXIuY2hpbGRyZW4ubGVuZ3RoO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGlmKCFwb3MpIHsgcG9zID0gMDsgfVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYocG9zID4gcGFyLmNoaWxkcmVuLmxlbmd0aCkgeyBwb3MgPSBwYXIuY2hpbGRyZW4ubGVuZ3RoOyB9XG5cdFx0XHRpZighbm9kZS5pZCkgeyBub2RlLmlkID0gdHJ1ZTsgfVxuXHRcdFx0aWYoIXRoaXMuY2hlY2soXCJjcmVhdGVfbm9kZVwiLCBub2RlLCBwYXIsIHBvcykpIHtcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZihub2RlLmlkID09PSB0cnVlKSB7IGRlbGV0ZSBub2RlLmlkOyB9XG5cdFx0XHRub2RlID0gdGhpcy5fcGFyc2VfbW9kZWxfZnJvbV9qc29uKG5vZGUsIHBhci5pZCwgcGFyLnBhcmVudHMuY29uY2F0KCkpO1xuXHRcdFx0aWYoIW5vZGUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKG5vZGUpO1xuXHRcdFx0ZHBjID0gW107XG5cdFx0XHRkcGMucHVzaChub2RlKTtcblx0XHRcdGRwYyA9IGRwYy5jb25jYXQodG1wLmNoaWxkcmVuX2QpO1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdtb2RlbCcsIHsgXCJub2Rlc1wiIDogZHBjLCBcInBhcmVudFwiIDogcGFyLmlkIH0pO1xuXG5cdFx0XHRwYXIuY2hpbGRyZW5fZCA9IHBhci5jaGlsZHJlbl9kLmNvbmNhdChkcGMpO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gcGFyLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbcGFyLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QgPSB0aGlzLl9tb2RlbC5kYXRhW3Bhci5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kLmNvbmNhdChkcGMpO1xuXHRcdFx0fVxuXHRcdFx0bm9kZSA9IHRtcDtcblx0XHRcdHRtcCA9IFtdO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gcGFyLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHR0bXBbaSA+PSBwb3MgPyBpKzEgOiBpXSA9IHBhci5jaGlsZHJlbltpXTtcblx0XHRcdH1cblx0XHRcdHRtcFtwb3NdID0gbm9kZS5pZDtcblx0XHRcdHBhci5jaGlsZHJlbiA9IHRtcDtcblxuXHRcdFx0dGhpcy5yZWRyYXdfbm9kZShwYXIsIHRydWUpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgY3JlYXRlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjcmVhdGVfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyZW50IHRoZSBwYXJlbnQncyBJRFxuXHRcdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIHRoZSBwb3NpdGlvbiBvZiB0aGUgbmV3IG5vZGUgYW1vbmcgdGhlIHBhcmVudCdzIGNoaWxkcmVuXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignY3JlYXRlX25vZGUnLCB7IFwibm9kZVwiIDogdGhpcy5nZXRfbm9kZShub2RlKSwgXCJwYXJlbnRcIiA6IHBhci5pZCwgXCJwb3NpdGlvblwiIDogcG9zIH0pO1xuXHRcdFx0aWYoY2FsbGJhY2spIHsgY2FsbGJhY2suY2FsbCh0aGlzLCB0aGlzLmdldF9ub2RlKG5vZGUpKTsgfVxuXHRcdFx0cmV0dXJuIG5vZGUuaWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzZXQgdGhlIHRleHQgdmFsdWUgb2YgYSBub2RlXG5cdFx0ICogQG5hbWUgcmVuYW1lX25vZGUob2JqLCB2YWwpXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZSwgeW91IGNhbiBwYXNzIGFuIGFycmF5IHRvIHJlbmFtZSBtdWx0aXBsZSBub2RlcyB0byB0aGUgc2FtZSBuYW1lXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSB2YWwgdGhlIG5ldyB0ZXh0IHZhbHVlXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKiBAdHJpZ2dlciByZW5hbWVfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRyZW5hbWVfbm9kZSA6IGZ1bmN0aW9uIChvYmosIHZhbCkge1xuXHRcdFx0dmFyIHQxLCB0Miwgb2xkO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMucmVuYW1lX25vZGUob2JqW3QxXSwgdmFsKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0b2xkID0gb2JqLnRleHQ7XG5cdFx0XHRpZighdGhpcy5jaGVjayhcInJlbmFtZV9ub2RlXCIsIG9iaiwgdGhpcy5nZXRfcGFyZW50KG9iaiksIHZhbCkpIHtcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNldF90ZXh0KG9iaiwgdmFsKTsgLy8gLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpXG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyByZW5hbWVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHJlbmFtZV9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IHRoZSBuZXcgdmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBvbGQgdGhlIG9sZCB2YWx1ZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3JlbmFtZV9ub2RlJywgeyBcIm5vZGVcIiA6IG9iaiwgXCJ0ZXh0XCIgOiB2YWwsIFwib2xkXCIgOiBvbGQgfSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJlbW92ZSBhIG5vZGVcblx0XHQgKiBAbmFtZSBkZWxldGVfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZSwgeW91IGNhbiBwYXNzIGFuIGFycmF5IHRvIGRlbGV0ZSBtdWx0aXBsZSBub2Rlc1xuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICogQHRyaWdnZXIgZGVsZXRlX25vZGUuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGRlbGV0ZV9ub2RlIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0dmFyIHQxLCB0MiwgcGFyLCBwb3MsIHRtcCwgaSwgaiwgaywgbCwgYywgdG9wLCBsZnQ7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5kZWxldGVfbm9kZShvYmpbdDFdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0cGFyID0gdGhpcy5nZXRfbm9kZShvYmoucGFyZW50KTtcblx0XHRcdHBvcyA9ICQuaW5BcnJheShvYmouaWQsIHBhci5jaGlsZHJlbik7XG5cdFx0XHRjID0gZmFsc2U7XG5cdFx0XHRpZighdGhpcy5jaGVjayhcImRlbGV0ZV9ub2RlXCIsIG9iaiwgcGFyLCBwb3MpKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYocG9zICE9PSAtMSkge1xuXHRcdFx0XHRwYXIuY2hpbGRyZW4gPSAkLnZha2F0YS5hcnJheV9yZW1vdmUocGFyLmNoaWxkcmVuLCBwb3MpO1xuXHRcdFx0fVxuXHRcdFx0dG1wID0gb2JqLmNoaWxkcmVuX2QuY29uY2F0KFtdKTtcblx0XHRcdHRtcC5wdXNoKG9iai5pZCk7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBvYmoucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVtvYmoucGFyZW50c1tpXV0uY2hpbGRyZW5fZCA9ICQudmFrYXRhLmFycmF5X2ZpbHRlcih0aGlzLl9tb2RlbC5kYXRhW29iai5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kLCBmdW5jdGlvbiAodikge1xuXHRcdFx0XHRcdHJldHVybiAkLmluQXJyYXkodiwgdG1wKSA9PT0gLTE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGsgPSAwLCBsID0gdG1wLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW3RtcFtrXV0uc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRjID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGMpIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkID0gJC52YWthdGEuYXJyYXlfZmlsdGVyKHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgZnVuY3Rpb24gKHYpIHtcblx0XHRcdFx0XHRyZXR1cm4gJC5pbkFycmF5KHYsIHRtcCkgPT09IC0xO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIGRlbGV0ZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgZGVsZXRlX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmVudCB0aGUgcGFyZW50J3MgSURcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdkZWxldGVfbm9kZScsIHsgXCJub2RlXCIgOiBvYmosIFwicGFyZW50XCIgOiBwYXIuaWQgfSk7XG5cdFx0XHRpZihjKSB7XG5cdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAnZGVsZXRlX25vZGUnLCAnbm9kZScgOiBvYmosICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICdwYXJlbnQnIDogcGFyLmlkIH0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGsgPSAwLCBsID0gdG1wLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRkZWxldGUgdGhpcy5fbW9kZWwuZGF0YVt0bXBba11dO1xuXHRcdFx0fVxuXHRcdFx0aWYoJC5pbkFycmF5KHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkLCB0bXApICE9PSAtMSkge1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCA9IG51bGw7XG5cdFx0XHRcdHRvcCA9IHRoaXMuZWxlbWVudFswXS5zY3JvbGxUb3A7XG5cdFx0XHRcdGxmdCA9IHRoaXMuZWxlbWVudFswXS5zY3JvbGxMZWZ0O1xuXHRcdFx0XHRpZihwYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XS5jaGlsZHJlblswXSkge1xuXHRcdFx0XHRcdFx0dGhpcy5nZXRfbm9kZSh0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdLmNoaWxkcmVuWzBdLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmdldF9ub2RlKHBhciwgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmVsZW1lbnRbMF0uc2Nyb2xsVG9wICA9IHRvcDtcblx0XHRcdFx0dGhpcy5lbGVtZW50WzBdLnNjcm9sbExlZnQgPSBsZnQ7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnJlZHJhd19ub2RlKHBhciwgdHJ1ZSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrIGlmIGFuIG9wZXJhdGlvbiBpcyBwcmVtaXR0ZWQgb24gdGhlIHRyZWUuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIGNoZWNrKGNoaywgb2JqLCBwYXIsIHBvcylcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGNoayB0aGUgb3BlcmF0aW9uIHRvIGNoZWNrLCBjYW4gYmUgXCJjcmVhdGVfbm9kZVwiLCBcInJlbmFtZV9ub2RlXCIsIFwiZGVsZXRlX25vZGVcIiwgXCJjb3B5X25vZGVcIiBvciBcIm1vdmVfbm9kZVwiXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBwYXIgdGhlIHBhcmVudFxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBwb3MgdGhlIHBvc2l0aW9uIHRvIGluc2VydCBhdCwgb3IgaWYgXCJyZW5hbWVfbm9kZVwiIC0gdGhlIG5ldyBuYW1lXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG1vcmUgc29tZSB2YXJpb3VzIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24sIGZvciBleGFtcGxlIGlmIGEgXCJtb3ZlX25vZGVcIiBvcGVyYXRpb25zIGlzIHRyaWdnZXJlZCBieSBETkQgdGhpcyB3aWxsIGJlIHRoZSBob3ZlcmVkIG5vZGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNoZWNrIDogZnVuY3Rpb24gKGNoaywgb2JqLCBwYXIsIHBvcywgbW9yZSkge1xuXHRcdFx0b2JqID0gb2JqICYmIG9iai5pZCA/IG9iaiA6IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHBhciA9IHBhciAmJiBwYXIuaWQgPyBwYXIgOiB0aGlzLmdldF9ub2RlKHBhcik7XG5cdFx0XHR2YXIgdG1wID0gY2hrLm1hdGNoKC9ebW92ZV9ub2RlfGNvcHlfbm9kZXxjcmVhdGVfbm9kZSQvaSkgPyBwYXIgOiBvYmosXG5cdFx0XHRcdGNoYyA9IHRoaXMuc2V0dGluZ3MuY29yZS5jaGVja19jYWxsYmFjaztcblx0XHRcdGlmKGNoayA9PT0gXCJtb3ZlX25vZGVcIiB8fCBjaGsgPT09IFwiY29weV9ub2RlXCIpIHtcblx0XHRcdFx0aWYoKCFtb3JlIHx8ICFtb3JlLmlzX211bHRpKSAmJiAoY2hrID09PSBcIm1vdmVfbm9kZVwiICYmICQuaW5BcnJheShvYmouaWQsIHBhci5jaGlsZHJlbikgPT09IHBvcykpIHtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ2NvcmUnLCAnaWQnIDogJ2NvcmVfMDgnLCAncmVhc29uJyA6ICdNb3Zpbmcgbm9kZSB0byBpdHMgY3VycmVudCBwb3NpdGlvbicsICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoKCFtb3JlIHx8ICFtb3JlLmlzX211bHRpKSAmJiAob2JqLmlkID09PSBwYXIuaWQgfHwgKGNoayA9PT0gXCJtb3ZlX25vZGVcIiAmJiAkLmluQXJyYXkob2JqLmlkLCBwYXIuY2hpbGRyZW4pID09PSBwb3MpIHx8ICQuaW5BcnJheShwYXIuaWQsIG9iai5jaGlsZHJlbl9kKSAhPT0gLTEpKSB7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICdjb3JlJywgJ2lkJyA6ICdjb3JlXzAxJywgJ3JlYXNvbicgOiAnTW92aW5nIHBhcmVudCBpbnNpZGUgY2hpbGQnLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZih0bXAgJiYgdG1wLmRhdGEpIHsgdG1wID0gdG1wLmRhdGE7IH1cblx0XHRcdGlmKHRtcCAmJiB0bXAuZnVuY3Rpb25zICYmICh0bXAuZnVuY3Rpb25zW2Noa10gPT09IGZhbHNlIHx8IHRtcC5mdW5jdGlvbnNbY2hrXSA9PT0gdHJ1ZSkpIHtcblx0XHRcdFx0aWYodG1wLmZ1bmN0aW9uc1tjaGtdID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAnY29yZScsICdpZCcgOiAnY29yZV8wMicsICdyZWFzb24nIDogJ05vZGUgZGF0YSBwcmV2ZW50cyBmdW5jdGlvbjogJyArIGNoaywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0bXAuZnVuY3Rpb25zW2Noa107XG5cdFx0XHR9XG5cdFx0XHRpZihjaGMgPT09IGZhbHNlIHx8ICgkLmlzRnVuY3Rpb24oY2hjKSAmJiBjaGMuY2FsbCh0aGlzLCBjaGssIG9iaiwgcGFyLCBwb3MsIG1vcmUpID09PSBmYWxzZSkgfHwgKGNoYyAmJiBjaGNbY2hrXSA9PT0gZmFsc2UpKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAnY29yZScsICdpZCcgOiAnY29yZV8wMycsICdyZWFzb24nIDogJ1VzZXIgY29uZmlnIGZvciBjb3JlLmNoZWNrX2NhbGxiYWNrIHByZXZlbnRzIGZ1bmN0aW9uOiAnICsgY2hrLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IHRoZSBsYXN0IGVycm9yXG5cdFx0ICogQG5hbWUgbGFzdF9lcnJvcigpXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGxhc3RfZXJyb3IgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3I7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBtb3ZlIGEgbm9kZSB0byBhIG5ldyBwYXJlbnRcblx0XHQgKiBAbmFtZSBtb3ZlX25vZGUob2JqLCBwYXIgWywgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIG1vdmUsIHBhc3MgYW4gYXJyYXkgdG8gbW92ZSBtdWx0aXBsZSBub2Rlc1xuXHRcdCAqIEBwYXJhbSAge21peGVkfSBwYXIgdGhlIG5ldyBwYXJlbnRcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gcG9zIHRoZSBwb3NpdGlvbiB0byBpbnNlcnQgYXQgKGJlc2lkZXMgaW50ZWdlciB2YWx1ZXMsIFwiZmlyc3RcIiBhbmQgXCJsYXN0XCIgYXJlIHN1cHBvcnRlZCwgYXMgd2VsbCBhcyBcImJlZm9yZVwiIGFuZCBcImFmdGVyXCIpLCBkZWZhdWx0cyB0byBpbnRlZ2VyIGAwYFxuXHRcdCAqIEBwYXJhbSAge2Z1bmN0aW9ufSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgb25jZSB0aGUgbW92ZSBpcyBjb21wbGV0ZWQsIHJlY2VpdmVzIDMgYXJndW1lbnRzIC0gdGhlIG5vZGUsIHRoZSBuZXcgcGFyZW50IGFuZCB0aGUgcG9zaXRpb25cblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBpc19sb2FkZWQgaW50ZXJuYWwgcGFyYW1ldGVyIGluZGljYXRpbmcgaWYgdGhlIHBhcmVudCBub2RlIGhhcyBiZWVuIGxvYWRlZFxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IHNraXBfcmVkcmF3IGludGVybmFsIHBhcmFtZXRlciBpbmRpY2F0aW5nIGlmIHRoZSB0cmVlIHNob3VsZCBiZSByZWRyYXduXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gaW5zdGFuY2UgaW50ZXJuYWwgcGFyYW1ldGVyIGluZGljYXRpbmcgaWYgdGhlIG5vZGUgY29tZXMgZnJvbSBhbm90aGVyIGluc3RhbmNlXG5cdFx0ICogQHRyaWdnZXIgbW92ZV9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdG1vdmVfbm9kZSA6IGZ1bmN0aW9uIChvYmosIHBhciwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkLCBza2lwX3JlZHJhdywgb3JpZ2luKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBvbGRfcGFyLCBvbGRfcG9zLCBuZXdfcGFyLCBvbGRfaW5zLCBpc19tdWx0aSwgZHBjLCB0bXAsIGksIGosIGssIGwsIHA7XG5cblx0XHRcdHBhciA9IHRoaXMuZ2V0X25vZGUocGFyKTtcblx0XHRcdHBvcyA9IHBvcyA9PT0gdW5kZWZpbmVkID8gMCA6IHBvcztcblx0XHRcdGlmKCFwYXIpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZighcG9zLnRvU3RyaW5nKCkubWF0Y2goL14oYmVmb3JlfGFmdGVyKSQvKSAmJiAhaXNfbG9hZGVkICYmICF0aGlzLmlzX2xvYWRlZChwYXIpKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmxvYWRfbm9kZShwYXIsIGZ1bmN0aW9uICgpIHsgdGhpcy5tb3ZlX25vZGUob2JqLCBwYXIsIHBvcywgY2FsbGJhY2ssIHRydWUsIGZhbHNlLCBvcmlnaW4pOyB9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0aWYob2JqLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdG9iaiA9IG9ialswXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvL29iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdFx0aWYoKHRtcCA9IHRoaXMubW92ZV9ub2RlKG9ialt0MV0sIHBhciwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkLCBmYWxzZSwgb3JpZ2luKSkpIHtcblx0XHRcdFx0XHRcdFx0cGFyID0gdG1wO1xuXHRcdFx0XHRcdFx0XHRwb3MgPSBcImFmdGVyXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG9iaiA9IG9iaiAmJiBvYmouaWQgPyBvYmogOiB0aGlzLmdldF9ub2RlKG9iaik7XG5cblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0XHRvbGRfcGFyID0gKG9iai5wYXJlbnQgfHwgJC5qc3RyZWUucm9vdCkudG9TdHJpbmcoKTtcblx0XHRcdG5ld19wYXIgPSAoIXBvcy50b1N0cmluZygpLm1hdGNoKC9eKGJlZm9yZXxhZnRlcikkLykgfHwgcGFyLmlkID09PSAkLmpzdHJlZS5yb290KSA/IHBhciA6IHRoaXMuZ2V0X25vZGUocGFyLnBhcmVudCk7XG5cdFx0XHRvbGRfaW5zID0gb3JpZ2luID8gb3JpZ2luIDogKHRoaXMuX21vZGVsLmRhdGFbb2JqLmlkXSA/IHRoaXMgOiAkLmpzdHJlZS5yZWZlcmVuY2Uob2JqLmlkKSk7XG5cdFx0XHRpc19tdWx0aSA9ICFvbGRfaW5zIHx8ICFvbGRfaW5zLl9pZCB8fCAodGhpcy5faWQgIT09IG9sZF9pbnMuX2lkKTtcblx0XHRcdG9sZF9wb3MgPSBvbGRfaW5zICYmIG9sZF9pbnMuX2lkICYmIG9sZF9wYXIgJiYgb2xkX2lucy5fbW9kZWwuZGF0YVtvbGRfcGFyXSAmJiBvbGRfaW5zLl9tb2RlbC5kYXRhW29sZF9wYXJdLmNoaWxkcmVuID8gJC5pbkFycmF5KG9iai5pZCwgb2xkX2lucy5fbW9kZWwuZGF0YVtvbGRfcGFyXS5jaGlsZHJlbikgOiAtMTtcblx0XHRcdGlmKG9sZF9pbnMgJiYgb2xkX2lucy5faWQpIHtcblx0XHRcdFx0b2JqID0gb2xkX2lucy5fbW9kZWwuZGF0YVtvYmouaWRdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZihpc19tdWx0aSkge1xuXHRcdFx0XHRpZigodG1wID0gdGhpcy5jb3B5X25vZGUob2JqLCBwYXIsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCwgZmFsc2UsIG9yaWdpbikpKSB7XG5cdFx0XHRcdFx0aWYob2xkX2lucykgeyBvbGRfaW5zLmRlbGV0ZV9ub2RlKG9iaik7IH1cblx0XHRcdFx0XHRyZXR1cm4gdG1wO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdC8vdmFyIG0gPSB0aGlzLl9tb2RlbC5kYXRhO1xuXHRcdFx0aWYocGFyLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdGlmKHBvcyA9PT0gXCJiZWZvcmVcIikgeyBwb3MgPSBcImZpcnN0XCI7IH1cblx0XHRcdFx0aWYocG9zID09PSBcImFmdGVyXCIpIHsgcG9zID0gXCJsYXN0XCI7IH1cblx0XHRcdH1cblx0XHRcdHN3aXRjaChwb3MpIHtcblx0XHRcdFx0Y2FzZSBcImJlZm9yZVwiOlxuXHRcdFx0XHRcdHBvcyA9ICQuaW5BcnJheShwYXIuaWQsIG5ld19wYXIuY2hpbGRyZW4pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiYWZ0ZXJcIiA6XG5cdFx0XHRcdFx0cG9zID0gJC5pbkFycmF5KHBhci5pZCwgbmV3X3Bhci5jaGlsZHJlbikgKyAxO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiaW5zaWRlXCI6XG5cdFx0XHRcdGNhc2UgXCJmaXJzdFwiOlxuXHRcdFx0XHRcdHBvcyA9IDA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJsYXN0XCI6XG5cdFx0XHRcdFx0cG9zID0gbmV3X3Bhci5jaGlsZHJlbi5sZW5ndGg7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0aWYoIXBvcykgeyBwb3MgPSAwOyB9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZihwb3MgPiBuZXdfcGFyLmNoaWxkcmVuLmxlbmd0aCkgeyBwb3MgPSBuZXdfcGFyLmNoaWxkcmVuLmxlbmd0aDsgfVxuXHRcdFx0aWYoIXRoaXMuY2hlY2soXCJtb3ZlX25vZGVcIiwgb2JqLCBuZXdfcGFyLCBwb3MsIHsgJ2NvcmUnIDogdHJ1ZSwgJ29yaWdpbicgOiBvcmlnaW4sICdpc19tdWx0aScgOiAob2xkX2lucyAmJiBvbGRfaW5zLl9pZCAmJiBvbGRfaW5zLl9pZCAhPT0gdGhpcy5faWQpLCAnaXNfZm9yZWlnbicgOiAoIW9sZF9pbnMgfHwgIW9sZF9pbnMuX2lkKSB9KSkge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKG9iai5wYXJlbnQgPT09IG5ld19wYXIuaWQpIHtcblx0XHRcdFx0ZHBjID0gbmV3X3Bhci5jaGlsZHJlbi5jb25jYXQoKTtcblx0XHRcdFx0dG1wID0gJC5pbkFycmF5KG9iai5pZCwgZHBjKTtcblx0XHRcdFx0aWYodG1wICE9PSAtMSkge1xuXHRcdFx0XHRcdGRwYyA9ICQudmFrYXRhLmFycmF5X3JlbW92ZShkcGMsIHRtcCk7XG5cdFx0XHRcdFx0aWYocG9zID4gdG1wKSB7IHBvcy0tOyB9XG5cdFx0XHRcdH1cblx0XHRcdFx0dG1wID0gW107XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IGRwYy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHR0bXBbaSA+PSBwb3MgPyBpKzEgOiBpXSA9IGRwY1tpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0bXBbcG9zXSA9IG9iai5pZDtcblx0XHRcdFx0bmV3X3Bhci5jaGlsZHJlbiA9IHRtcDtcblx0XHRcdFx0dGhpcy5fbm9kZV9jaGFuZ2VkKG5ld19wYXIuaWQpO1xuXHRcdFx0XHR0aGlzLnJlZHJhdyhuZXdfcGFyLmlkID09PSAkLmpzdHJlZS5yb290KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBjbGVhbiBvbGQgcGFyZW50IGFuZCB1cFxuXHRcdFx0XHR0bXAgPSBvYmouY2hpbGRyZW5fZC5jb25jYXQoKTtcblx0XHRcdFx0dG1wLnB1c2gob2JqLmlkKTtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0ZHBjID0gW107XG5cdFx0XHRcdFx0cCA9IG9sZF9pbnMuX21vZGVsLmRhdGFbb2JqLnBhcmVudHNbaV1dLmNoaWxkcmVuX2Q7XG5cdFx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gcC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRcdGlmKCQuaW5BcnJheShwW2tdLCB0bXApID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRkcGMucHVzaChwW2tdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0b2xkX2lucy5fbW9kZWwuZGF0YVtvYmoucGFyZW50c1tpXV0uY2hpbGRyZW5fZCA9IGRwYztcblx0XHRcdFx0fVxuXHRcdFx0XHRvbGRfaW5zLl9tb2RlbC5kYXRhW29sZF9wYXJdLmNoaWxkcmVuID0gJC52YWthdGEuYXJyYXlfcmVtb3ZlX2l0ZW0ob2xkX2lucy5fbW9kZWwuZGF0YVtvbGRfcGFyXS5jaGlsZHJlbiwgb2JqLmlkKTtcblxuXHRcdFx0XHQvLyBpbnNlcnQgaW50byBuZXcgcGFyZW50IGFuZCB1cFxuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBuZXdfcGFyLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVtuZXdfcGFyLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QgPSB0aGlzLl9tb2RlbC5kYXRhW25ld19wYXIucGFyZW50c1tpXV0uY2hpbGRyZW5fZC5jb25jYXQodG1wKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkcGMgPSBbXTtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gbmV3X3Bhci5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRkcGNbaSA+PSBwb3MgPyBpKzEgOiBpXSA9IG5ld19wYXIuY2hpbGRyZW5baV07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZHBjW3Bvc10gPSBvYmouaWQ7XG5cdFx0XHRcdG5ld19wYXIuY2hpbGRyZW4gPSBkcGM7XG5cdFx0XHRcdG5ld19wYXIuY2hpbGRyZW5fZC5wdXNoKG9iai5pZCk7XG5cdFx0XHRcdG5ld19wYXIuY2hpbGRyZW5fZCA9IG5ld19wYXIuY2hpbGRyZW5fZC5jb25jYXQob2JqLmNoaWxkcmVuX2QpO1xuXG5cdFx0XHRcdC8vIHVwZGF0ZSBvYmplY3Rcblx0XHRcdFx0b2JqLnBhcmVudCA9IG5ld19wYXIuaWQ7XG5cdFx0XHRcdHRtcCA9IG5ld19wYXIucGFyZW50cy5jb25jYXQoKTtcblx0XHRcdFx0dG1wLnVuc2hpZnQobmV3X3Bhci5pZCk7XG5cdFx0XHRcdHAgPSBvYmoucGFyZW50cy5sZW5ndGg7XG5cdFx0XHRcdG9iai5wYXJlbnRzID0gdG1wO1xuXG5cdFx0XHRcdC8vIHVwZGF0ZSBvYmplY3QgY2hpbGRyZW5cblx0XHRcdFx0dG1wID0gdG1wLmNvbmNhdCgpO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW29iai5jaGlsZHJlbl9kW2ldXS5wYXJlbnRzID0gdGhpcy5fbW9kZWwuZGF0YVtvYmouY2hpbGRyZW5fZFtpXV0ucGFyZW50cy5zbGljZSgwLHAqLTEpO1xuXHRcdFx0XHRcdEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuX21vZGVsLmRhdGFbb2JqLmNoaWxkcmVuX2RbaV1dLnBhcmVudHMsIHRtcCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZihvbGRfcGFyID09PSAkLmpzdHJlZS5yb290IHx8IG5ld19wYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHR0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdyA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIXRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3KSB7XG5cdFx0XHRcdFx0dGhpcy5fbm9kZV9jaGFuZ2VkKG9sZF9wYXIpO1xuXHRcdFx0XHRcdHRoaXMuX25vZGVfY2hhbmdlZChuZXdfcGFyLmlkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighc2tpcF9yZWRyYXcpIHtcblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihjYWxsYmFjaykgeyBjYWxsYmFjay5jYWxsKHRoaXMsIG9iaiwgbmV3X3BhciwgcG9zKTsgfVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgbW92ZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgbW92ZV9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnQgdGhlIHBhcmVudCdzIElEXG5cdFx0XHQgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gdGhlIHBvc2l0aW9uIG9mIHRoZSBub2RlIGFtb25nIHRoZSBwYXJlbnQncyBjaGlsZHJlblxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IG9sZF9wYXJlbnQgdGhlIG9sZCBwYXJlbnQgb2YgdGhlIG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBvbGRfcG9zaXRpb24gdGhlIG9sZCBwb3NpdGlvbiBvZiB0aGUgbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtCb29sZWFufSBpc19tdWx0aSBkbyB0aGUgbm9kZSBhbmQgbmV3IHBhcmVudCBiZWxvbmcgdG8gZGlmZmVyZW50IGluc3RhbmNlc1xuXHRcdFx0ICogQHBhcmFtIHtqc1RyZWV9IG9sZF9pbnN0YW5jZSB0aGUgaW5zdGFuY2UgdGhlIG5vZGUgY2FtZSBmcm9tXG5cdFx0XHQgKiBAcGFyYW0ge2pzVHJlZX0gbmV3X2luc3RhbmNlIHRoZSBpbnN0YW5jZSBvZiB0aGUgbmV3IHBhcmVudFxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ21vdmVfbm9kZScsIHsgXCJub2RlXCIgOiBvYmosIFwicGFyZW50XCIgOiBuZXdfcGFyLmlkLCBcInBvc2l0aW9uXCIgOiBwb3MsIFwib2xkX3BhcmVudFwiIDogb2xkX3BhciwgXCJvbGRfcG9zaXRpb25cIiA6IG9sZF9wb3MsICdpc19tdWx0aScgOiAob2xkX2lucyAmJiBvbGRfaW5zLl9pZCAmJiBvbGRfaW5zLl9pZCAhPT0gdGhpcy5faWQpLCAnaXNfZm9yZWlnbicgOiAoIW9sZF9pbnMgfHwgIW9sZF9pbnMuX2lkKSwgJ29sZF9pbnN0YW5jZScgOiBvbGRfaW5zLCAnbmV3X2luc3RhbmNlJyA6IHRoaXMgfSk7XG5cdFx0XHRyZXR1cm4gb2JqLmlkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY29weSBhIG5vZGUgdG8gYSBuZXcgcGFyZW50XG5cdFx0ICogQG5hbWUgY29weV9ub2RlKG9iaiwgcGFyIFssIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBjb3B5LCBwYXNzIGFuIGFycmF5IHRvIGNvcHkgbXVsdGlwbGUgbm9kZXNcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gcGFyIHRoZSBuZXcgcGFyZW50XG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IHBvcyB0aGUgcG9zaXRpb24gdG8gaW5zZXJ0IGF0IChiZXNpZGVzIGludGVnZXIgdmFsdWVzLCBcImZpcnN0XCIgYW5kIFwibGFzdFwiIGFyZSBzdXBwb3J0ZWQsIGFzIHdlbGwgYXMgXCJiZWZvcmVcIiBhbmQgXCJhZnRlclwiKSwgZGVmYXVsdHMgdG8gaW50ZWdlciBgMGBcblx0XHQgKiBAcGFyYW0gIHtmdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIG9uY2UgdGhlIG1vdmUgaXMgY29tcGxldGVkLCByZWNlaXZlcyAzIGFyZ3VtZW50cyAtIHRoZSBub2RlLCB0aGUgbmV3IHBhcmVudCBhbmQgdGhlIHBvc2l0aW9uXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gaXNfbG9hZGVkIGludGVybmFsIHBhcmFtZXRlciBpbmRpY2F0aW5nIGlmIHRoZSBwYXJlbnQgbm9kZSBoYXMgYmVlbiBsb2FkZWRcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBza2lwX3JlZHJhdyBpbnRlcm5hbCBwYXJhbWV0ZXIgaW5kaWNhdGluZyBpZiB0aGUgdHJlZSBzaG91bGQgYmUgcmVkcmF3blxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGluc3RhbmNlIGludGVybmFsIHBhcmFtZXRlciBpbmRpY2F0aW5nIGlmIHRoZSBub2RlIGNvbWVzIGZyb20gYW5vdGhlciBpbnN0YW5jZVxuXHRcdCAqIEB0cmlnZ2VyIG1vZGVsLmpzdHJlZSBjb3B5X25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0Y29weV9ub2RlIDogZnVuY3Rpb24gKG9iaiwgcGFyLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQsIHNraXBfcmVkcmF3LCBvcmlnaW4pIHtcblx0XHRcdHZhciB0MSwgdDIsIGRwYywgdG1wLCBpLCBqLCBub2RlLCBvbGRfcGFyLCBuZXdfcGFyLCBvbGRfaW5zLCBpc19tdWx0aTtcblxuXHRcdFx0cGFyID0gdGhpcy5nZXRfbm9kZShwYXIpO1xuXHRcdFx0cG9zID0gcG9zID09PSB1bmRlZmluZWQgPyAwIDogcG9zO1xuXHRcdFx0aWYoIXBhcikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKCFwb3MudG9TdHJpbmcoKS5tYXRjaCgvXihiZWZvcmV8YWZ0ZXIpJC8pICYmICFpc19sb2FkZWQgJiYgIXRoaXMuaXNfbG9hZGVkKHBhcikpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubG9hZF9ub2RlKHBhciwgZnVuY3Rpb24gKCkgeyB0aGlzLmNvcHlfbm9kZShvYmosIHBhciwgcG9zLCBjYWxsYmFjaywgdHJ1ZSwgZmFsc2UsIG9yaWdpbik7IH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRpZihvYmoubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0b2JqID0gb2JqWzBdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8vb2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0XHRpZigodG1wID0gdGhpcy5jb3B5X25vZGUob2JqW3QxXSwgcGFyLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQsIHRydWUsIG9yaWdpbikpKSB7XG5cdFx0XHRcdFx0XHRcdHBhciA9IHRtcDtcblx0XHRcdFx0XHRcdFx0cG9zID0gXCJhZnRlclwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRvYmogPSBvYmogJiYgb2JqLmlkID8gb2JqIDogdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHRcdG9sZF9wYXIgPSAob2JqLnBhcmVudCB8fCAkLmpzdHJlZS5yb290KS50b1N0cmluZygpO1xuXHRcdFx0bmV3X3BhciA9ICghcG9zLnRvU3RyaW5nKCkubWF0Y2goL14oYmVmb3JlfGFmdGVyKSQvKSB8fCBwYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpID8gcGFyIDogdGhpcy5nZXRfbm9kZShwYXIucGFyZW50KTtcblx0XHRcdG9sZF9pbnMgPSBvcmlnaW4gPyBvcmlnaW4gOiAodGhpcy5fbW9kZWwuZGF0YVtvYmouaWRdID8gdGhpcyA6ICQuanN0cmVlLnJlZmVyZW5jZShvYmouaWQpKTtcblx0XHRcdGlzX211bHRpID0gIW9sZF9pbnMgfHwgIW9sZF9pbnMuX2lkIHx8ICh0aGlzLl9pZCAhPT0gb2xkX2lucy5faWQpO1xuXG5cdFx0XHRpZihvbGRfaW5zICYmIG9sZF9pbnMuX2lkKSB7XG5cdFx0XHRcdG9iaiA9IG9sZF9pbnMuX21vZGVsLmRhdGFbb2JqLmlkXTtcblx0XHRcdH1cblxuXHRcdFx0aWYocGFyLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdGlmKHBvcyA9PT0gXCJiZWZvcmVcIikgeyBwb3MgPSBcImZpcnN0XCI7IH1cblx0XHRcdFx0aWYocG9zID09PSBcImFmdGVyXCIpIHsgcG9zID0gXCJsYXN0XCI7IH1cblx0XHRcdH1cblx0XHRcdHN3aXRjaChwb3MpIHtcblx0XHRcdFx0Y2FzZSBcImJlZm9yZVwiOlxuXHRcdFx0XHRcdHBvcyA9ICQuaW5BcnJheShwYXIuaWQsIG5ld19wYXIuY2hpbGRyZW4pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiYWZ0ZXJcIiA6XG5cdFx0XHRcdFx0cG9zID0gJC5pbkFycmF5KHBhci5pZCwgbmV3X3Bhci5jaGlsZHJlbikgKyAxO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiaW5zaWRlXCI6XG5cdFx0XHRcdGNhc2UgXCJmaXJzdFwiOlxuXHRcdFx0XHRcdHBvcyA9IDA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJsYXN0XCI6XG5cdFx0XHRcdFx0cG9zID0gbmV3X3Bhci5jaGlsZHJlbi5sZW5ndGg7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0aWYoIXBvcykgeyBwb3MgPSAwOyB9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZihwb3MgPiBuZXdfcGFyLmNoaWxkcmVuLmxlbmd0aCkgeyBwb3MgPSBuZXdfcGFyLmNoaWxkcmVuLmxlbmd0aDsgfVxuXHRcdFx0aWYoIXRoaXMuY2hlY2soXCJjb3B5X25vZGVcIiwgb2JqLCBuZXdfcGFyLCBwb3MsIHsgJ2NvcmUnIDogdHJ1ZSwgJ29yaWdpbicgOiBvcmlnaW4sICdpc19tdWx0aScgOiAob2xkX2lucyAmJiBvbGRfaW5zLl9pZCAmJiBvbGRfaW5zLl9pZCAhPT0gdGhpcy5faWQpLCAnaXNfZm9yZWlnbicgOiAoIW9sZF9pbnMgfHwgIW9sZF9pbnMuX2lkKSB9KSkge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdG5vZGUgPSBvbGRfaW5zID8gb2xkX2lucy5nZXRfanNvbihvYmosIHsgbm9faWQgOiB0cnVlLCBub19kYXRhIDogdHJ1ZSwgbm9fc3RhdGUgOiB0cnVlIH0pIDogb2JqO1xuXHRcdFx0aWYoIW5vZGUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZihub2RlLmlkID09PSB0cnVlKSB7IGRlbGV0ZSBub2RlLmlkOyB9XG5cdFx0XHRub2RlID0gdGhpcy5fcGFyc2VfbW9kZWxfZnJvbV9qc29uKG5vZGUsIG5ld19wYXIuaWQsIG5ld19wYXIucGFyZW50cy5jb25jYXQoKSk7XG5cdFx0XHRpZighbm9kZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUobm9kZSk7XG5cdFx0XHRpZihvYmogJiYgb2JqLnN0YXRlICYmIG9iai5zdGF0ZS5sb2FkZWQgPT09IGZhbHNlKSB7IHRtcC5zdGF0ZS5sb2FkZWQgPSBmYWxzZTsgfVxuXHRcdFx0ZHBjID0gW107XG5cdFx0XHRkcGMucHVzaChub2RlKTtcblx0XHRcdGRwYyA9IGRwYy5jb25jYXQodG1wLmNoaWxkcmVuX2QpO1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdtb2RlbCcsIHsgXCJub2Rlc1wiIDogZHBjLCBcInBhcmVudFwiIDogbmV3X3Bhci5pZCB9KTtcblxuXHRcdFx0Ly8gaW5zZXJ0IGludG8gbmV3IHBhcmVudCBhbmQgdXBcblx0XHRcdGZvcihpID0gMCwgaiA9IG5ld19wYXIucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVtuZXdfcGFyLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QgPSB0aGlzLl9tb2RlbC5kYXRhW25ld19wYXIucGFyZW50c1tpXV0uY2hpbGRyZW5fZC5jb25jYXQoZHBjKTtcblx0XHRcdH1cblx0XHRcdGRwYyA9IFtdO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gbmV3X3Bhci5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0ZHBjW2kgPj0gcG9zID8gaSsxIDogaV0gPSBuZXdfcGFyLmNoaWxkcmVuW2ldO1xuXHRcdFx0fVxuXHRcdFx0ZHBjW3Bvc10gPSB0bXAuaWQ7XG5cdFx0XHRuZXdfcGFyLmNoaWxkcmVuID0gZHBjO1xuXHRcdFx0bmV3X3Bhci5jaGlsZHJlbl9kLnB1c2godG1wLmlkKTtcblx0XHRcdG5ld19wYXIuY2hpbGRyZW5fZCA9IG5ld19wYXIuY2hpbGRyZW5fZC5jb25jYXQodG1wLmNoaWxkcmVuX2QpO1xuXG5cdFx0XHRpZihuZXdfcGFyLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmKCF0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdykge1xuXHRcdFx0XHR0aGlzLl9ub2RlX2NoYW5nZWQobmV3X3Bhci5pZCk7XG5cdFx0XHR9XG5cdFx0XHRpZighc2tpcF9yZWRyYXcpIHtcblx0XHRcdFx0dGhpcy5yZWRyYXcobmV3X3Bhci5pZCA9PT0gJC5qc3RyZWUucm9vdCk7XG5cdFx0XHR9XG5cdFx0XHRpZihjYWxsYmFjaykgeyBjYWxsYmFjay5jYWxsKHRoaXMsIHRtcCwgbmV3X3BhciwgcG9zKTsgfVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgY29waWVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGNvcHlfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBjb3BpZWQgbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG9yaWdpbmFsIHRoZSBvcmlnaW5hbCBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyZW50IHRoZSBwYXJlbnQncyBJRFxuXHRcdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIHRoZSBwb3NpdGlvbiBvZiB0aGUgbm9kZSBhbW9uZyB0aGUgcGFyZW50J3MgY2hpbGRyZW5cblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBvbGRfcGFyZW50IHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge051bWJlcn0gb2xkX3Bvc2l0aW9uIHRoZSBwb3NpdGlvbiBvZiB0aGUgb3JpZ2luYWwgbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtCb29sZWFufSBpc19tdWx0aSBkbyB0aGUgbm9kZSBhbmQgbmV3IHBhcmVudCBiZWxvbmcgdG8gZGlmZmVyZW50IGluc3RhbmNlc1xuXHRcdFx0ICogQHBhcmFtIHtqc1RyZWV9IG9sZF9pbnN0YW5jZSB0aGUgaW5zdGFuY2UgdGhlIG5vZGUgY2FtZSBmcm9tXG5cdFx0XHQgKiBAcGFyYW0ge2pzVHJlZX0gbmV3X2luc3RhbmNlIHRoZSBpbnN0YW5jZSBvZiB0aGUgbmV3IHBhcmVudFxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NvcHlfbm9kZScsIHsgXCJub2RlXCIgOiB0bXAsIFwib3JpZ2luYWxcIiA6IG9iaiwgXCJwYXJlbnRcIiA6IG5ld19wYXIuaWQsIFwicG9zaXRpb25cIiA6IHBvcywgXCJvbGRfcGFyZW50XCIgOiBvbGRfcGFyLCBcIm9sZF9wb3NpdGlvblwiIDogb2xkX2lucyAmJiBvbGRfaW5zLl9pZCAmJiBvbGRfcGFyICYmIG9sZF9pbnMuX21vZGVsLmRhdGFbb2xkX3Bhcl0gJiYgb2xkX2lucy5fbW9kZWwuZGF0YVtvbGRfcGFyXS5jaGlsZHJlbiA/ICQuaW5BcnJheShvYmouaWQsIG9sZF9pbnMuX21vZGVsLmRhdGFbb2xkX3Bhcl0uY2hpbGRyZW4pIDogLTEsJ2lzX211bHRpJyA6IChvbGRfaW5zICYmIG9sZF9pbnMuX2lkICYmIG9sZF9pbnMuX2lkICE9PSB0aGlzLl9pZCksICdpc19mb3JlaWduJyA6ICghb2xkX2lucyB8fCAhb2xkX2lucy5faWQpLCAnb2xkX2luc3RhbmNlJyA6IG9sZF9pbnMsICduZXdfaW5zdGFuY2UnIDogdGhpcyB9KTtcblx0XHRcdHJldHVybiB0bXAuaWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjdXQgYSBub2RlIChhIGxhdGVyIGNhbGwgdG8gYHBhc3RlKG9iailgIHdvdWxkIG1vdmUgdGhlIG5vZGUpXG5cdFx0ICogQG5hbWUgY3V0KG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIG11bHRpcGxlIG9iamVjdHMgY2FuIGJlIHBhc3NlZCB1c2luZyBhbiBhcnJheVxuXHRcdCAqIEB0cmlnZ2VyIGN1dC5qc3RyZWVcblx0XHQgKi9cblx0XHRjdXQgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRpZighb2JqKSB7IG9iaiA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5jb25jYXQoKTsgfVxuXHRcdFx0aWYoISQuaXNBcnJheShvYmopKSB7IG9iaiA9IFtvYmpdOyB9XG5cdFx0XHRpZighb2JqLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciB0bXAgPSBbXSwgbywgdDEsIHQyO1xuXHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdG8gPSB0aGlzLmdldF9ub2RlKG9ialt0MV0pO1xuXHRcdFx0XHRpZihvICYmIG8uaWQgJiYgby5pZCAhPT0gJC5qc3RyZWUucm9vdCkgeyB0bXAucHVzaChvKTsgfVxuXHRcdFx0fVxuXHRcdFx0aWYoIXRtcC5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRjY3Bfbm9kZSA9IHRtcDtcblx0XHRcdGNjcF9pbnN0ID0gdGhpcztcblx0XHRcdGNjcF9tb2RlID0gJ21vdmVfbm9kZSc7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIG5vZGVzIGFyZSBhZGRlZCB0byB0aGUgYnVmZmVyIGZvciBtb3Zpbmdcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY3V0LmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2N1dCcsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjb3B5IGEgbm9kZSAoYSBsYXRlciBjYWxsIHRvIGBwYXN0ZShvYmopYCB3b3VsZCBjb3B5IHRoZSBub2RlKVxuXHRcdCAqIEBuYW1lIGNvcHkob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogbXVsdGlwbGUgb2JqZWN0cyBjYW4gYmUgcGFzc2VkIHVzaW5nIGFuIGFycmF5XG5cdFx0ICogQHRyaWdnZXIgY29weS5qc3RyZWVcblx0XHQgKi9cblx0XHRjb3B5IDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0aWYoIW9iaikgeyBvYmogPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuY29uY2F0KCk7IH1cblx0XHRcdGlmKCEkLmlzQXJyYXkob2JqKSkgeyBvYmogPSBbb2JqXTsgfVxuXHRcdFx0aWYoIW9iai5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR2YXIgdG1wID0gW10sIG8sIHQxLCB0Mjtcblx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRvID0gdGhpcy5nZXRfbm9kZShvYmpbdDFdKTtcblx0XHRcdFx0aWYobyAmJiBvLmlkICYmIG8uaWQgIT09ICQuanN0cmVlLnJvb3QpIHsgdG1wLnB1c2gobyk7IH1cblx0XHRcdH1cblx0XHRcdGlmKCF0bXAubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0Y2NwX25vZGUgPSB0bXA7XG5cdFx0XHRjY3BfaW5zdCA9IHRoaXM7XG5cdFx0XHRjY3BfbW9kZSA9ICdjb3B5X25vZGUnO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBub2RlcyBhcmUgYWRkZWQgdG8gdGhlIGJ1ZmZlciBmb3IgY29weWluZ1xuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjb3B5LmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NvcHknLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IHRoZSBjdXJyZW50IGJ1ZmZlciAoYW55IG5vZGVzIHRoYXQgYXJlIHdhaXRpbmcgZm9yIGEgcGFzdGUgb3BlcmF0aW9uKVxuXHRcdCAqIEBuYW1lIGdldF9idWZmZXIoKVxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gYW4gb2JqZWN0IGNvbnNpc3Rpbmcgb2YgYG1vZGVgIChcImNvcHlfbm9kZVwiIG9yIFwibW92ZV9ub2RlXCIpLCBgbm9kZWAgKGFuIGFycmF5IG9mIG9iamVjdHMpIGFuZCBgaW5zdGAgKHRoZSBpbnN0YW5jZSlcblx0XHQgKi9cblx0XHRnZXRfYnVmZmVyIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHsgJ21vZGUnIDogY2NwX21vZGUsICdub2RlJyA6IGNjcF9ub2RlLCAnaW5zdCcgOiBjY3BfaW5zdCB9O1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2sgaWYgdGhlcmUgaXMgc29tZXRoaW5nIGluIHRoZSBidWZmZXIgdG8gcGFzdGVcblx0XHQgKiBAbmFtZSBjYW5fcGFzdGUoKVxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Y2FuX3Bhc3RlIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNjcF9tb2RlICE9PSBmYWxzZSAmJiBjY3Bfbm9kZSAhPT0gZmFsc2U7IC8vICYmIGNjcF9pbnN0Ll9tb2RlbC5kYXRhW2NjcF9ub2RlXTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNvcHkgb3IgbW92ZSB0aGUgcHJldmlvdXNseSBjdXQgb3IgY29waWVkIG5vZGVzIHRvIGEgbmV3IHBhcmVudFxuXHRcdCAqIEBuYW1lIHBhc3RlKG9iaiBbLCBwb3NdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5ldyBwYXJlbnRcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gcG9zIHRoZSBwb3NpdGlvbiB0byBpbnNlcnQgYXQgKGJlc2lkZXMgaW50ZWdlciwgXCJmaXJzdFwiIGFuZCBcImxhc3RcIiBhcmUgc3VwcG9ydGVkKSwgZGVmYXVsdHMgdG8gaW50ZWdlciBgMGBcblx0XHQgKiBAdHJpZ2dlciBwYXN0ZS5qc3RyZWVcblx0XHQgKi9cblx0XHRwYXN0ZSA6IGZ1bmN0aW9uIChvYmosIHBvcykge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCAhY2NwX21vZGUgfHwgIWNjcF9tb2RlLm1hdGNoKC9eKGNvcHlfbm9kZXxtb3ZlX25vZGUpJC8pIHx8ICFjY3Bfbm9kZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKHRoaXNbY2NwX21vZGVdKGNjcF9ub2RlLCBvYmosIHBvcywgZmFsc2UsIGZhbHNlLCBmYWxzZSwgY2NwX2luc3QpKSB7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBwYXN0ZSBpcyBpbnZva2VkXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBwYXN0ZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmVudCB0aGUgSUQgb2YgdGhlIHJlY2VpdmluZyBub2RlXG5cdFx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGUgdGhlIG5vZGVzIGluIHRoZSBidWZmZXJcblx0XHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IG1vZGUgdGhlIHBlcmZvcm1lZCBvcGVyYXRpb24gLSBcImNvcHlfbm9kZVwiIG9yIFwibW92ZV9ub2RlXCJcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcigncGFzdGUnLCB7IFwicGFyZW50XCIgOiBvYmouaWQsIFwibm9kZVwiIDogY2NwX25vZGUsIFwibW9kZVwiIDogY2NwX21vZGUgfSk7XG5cdFx0XHR9XG5cdFx0XHRjY3Bfbm9kZSA9IGZhbHNlO1xuXHRcdFx0Y2NwX21vZGUgPSBmYWxzZTtcblx0XHRcdGNjcF9pbnN0ID0gZmFsc2U7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjbGVhciB0aGUgYnVmZmVyIG9mIHByZXZpb3VzbHkgY29waWVkIG9yIGN1dCBub2Rlc1xuXHRcdCAqIEBuYW1lIGNsZWFyX2J1ZmZlcigpXG5cdFx0ICogQHRyaWdnZXIgY2xlYXJfYnVmZmVyLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGNsZWFyX2J1ZmZlciA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGNjcF9ub2RlID0gZmFsc2U7XG5cdFx0XHRjY3BfbW9kZSA9IGZhbHNlO1xuXHRcdFx0Y2NwX2luc3QgPSBmYWxzZTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gdGhlIGNvcHkgLyBjdXQgYnVmZmVyIGlzIGNsZWFyZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY2xlYXJfYnVmZmVyLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NsZWFyX2J1ZmZlcicpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcHV0IGEgbm9kZSBpbiBlZGl0IG1vZGUgKGlucHV0IGZpZWxkIHRvIHJlbmFtZSB0aGUgbm9kZSlcblx0XHQgKiBAbmFtZSBlZGl0KG9iaiBbLCBkZWZhdWx0X3RleHQsIGNhbGxiYWNrXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBkZWZhdWx0X3RleHQgdGhlIHRleHQgdG8gcG9wdWxhdGUgdGhlIGlucHV0IHdpdGggKGlmIG9taXR0ZWQgb3Igc2V0IHRvIGEgbm9uLXN0cmluZyB2YWx1ZSB0aGUgbm9kZSdzIHRleHQgdmFsdWUgaXMgdXNlZClcblx0XHQgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb25jZSB0aGUgdGV4dCBib3ggaXMgYmx1cnJlZCwgaXQgaXMgY2FsbGVkIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlIGFuZCByZWNlaXZlcyB0aGUgbm9kZSwgYSBzdGF0dXMgcGFyYW1ldGVyICh0cnVlIGlmIHRoZSByZW5hbWUgaXMgc3VjY2Vzc2Z1bCwgZmFsc2Ugb3RoZXJ3aXNlKSBhbmQgYSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIHVzZXIgY2FuY2VsbGVkIHRoZSBlZGl0LiBZb3UgY2FuIGFjY2VzcyB0aGUgbm9kZSdzIHRpdGxlIHVzaW5nIC50ZXh0XG5cdFx0ICovXG5cdFx0ZWRpdCA6IGZ1bmN0aW9uIChvYmosIGRlZmF1bHRfdGV4dCwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBydGwsIHcsIGEsIHMsIHQsIGgxLCBoMiwgZm4sIHRtcCwgY2FuY2VsID0gZmFsc2U7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYoIXRoaXMuY2hlY2soXCJlZGl0XCIsIG9iaiwgdGhpcy5nZXRfcGFyZW50KG9iaikpKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dG1wID0gb2JqO1xuXHRcdFx0ZGVmYXVsdF90ZXh0ID0gdHlwZW9mIGRlZmF1bHRfdGV4dCA9PT0gJ3N0cmluZycgPyBkZWZhdWx0X3RleHQgOiBvYmoudGV4dDtcblx0XHRcdHRoaXMuc2V0X3RleHQob2JqLCBcIlwiKTtcblx0XHRcdG9iaiA9IHRoaXMuX29wZW5fdG8ob2JqKTtcblx0XHRcdHRtcC50ZXh0ID0gZGVmYXVsdF90ZXh0O1xuXG5cdFx0XHRydGwgPSB0aGlzLl9kYXRhLmNvcmUucnRsO1xuXHRcdFx0dyAgPSB0aGlzLmVsZW1lbnQud2lkdGgoKTtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkID0gdG1wLmlkO1xuXHRcdFx0YSAgPSBvYmouY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTtcblx0XHRcdHMgID0gJCgnPHNwYW4+Jyk7XG5cdFx0XHQvKiFcblx0XHRcdG9pID0gb2JqLmNoaWxkcmVuKFwiaTp2aXNpYmxlXCIpLFxuXHRcdFx0YWkgPSBhLmNoaWxkcmVuKFwiaTp2aXNpYmxlXCIpLFxuXHRcdFx0dzEgPSBvaS53aWR0aCgpICogb2kubGVuZ3RoLFxuXHRcdFx0dzIgPSBhaS53aWR0aCgpICogYWkubGVuZ3RoLFxuXHRcdFx0Ki9cblx0XHRcdHQgID0gZGVmYXVsdF90ZXh0O1xuXHRcdFx0aDEgPSAkKFwiPFwiK1wiZGl2IC8+XCIsIHsgY3NzIDogeyBcInBvc2l0aW9uXCIgOiBcImFic29sdXRlXCIsIFwidG9wXCIgOiBcIi0yMDBweFwiLCBcImxlZnRcIiA6IChydGwgPyBcIjBweFwiIDogXCItMTAwMHB4XCIpLCBcInZpc2liaWxpdHlcIiA6IFwiaGlkZGVuXCIgfSB9KS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblx0XHRcdGgyID0gJChcIjxcIitcImlucHV0IC8+XCIsIHtcblx0XHRcdFx0XHRcdFwidmFsdWVcIiA6IHQsXG5cdFx0XHRcdFx0XHRcImNsYXNzXCIgOiBcImpzdHJlZS1yZW5hbWUtaW5wdXRcIixcblx0XHRcdFx0XHRcdC8vIFwic2l6ZVwiIDogdC5sZW5ndGgsXG5cdFx0XHRcdFx0XHRcImNzc1wiIDoge1xuXHRcdFx0XHRcdFx0XHRcInBhZGRpbmdcIiA6IFwiMFwiLFxuXHRcdFx0XHRcdFx0XHRcImJvcmRlclwiIDogXCIxcHggc29saWQgc2lsdmVyXCIsXG5cdFx0XHRcdFx0XHRcdFwiYm94LXNpemluZ1wiIDogXCJib3JkZXItYm94XCIsXG5cdFx0XHRcdFx0XHRcdFwiZGlzcGxheVwiIDogXCJpbmxpbmUtYmxvY2tcIixcblx0XHRcdFx0XHRcdFx0XCJoZWlnaHRcIiA6ICh0aGlzLl9kYXRhLmNvcmUubGlfaGVpZ2h0KSArIFwicHhcIixcblx0XHRcdFx0XHRcdFx0XCJsaW5lSGVpZ2h0XCIgOiAodGhpcy5fZGF0YS5jb3JlLmxpX2hlaWdodCkgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRcdFwid2lkdGhcIiA6IFwiMTUwcHhcIiAvLyB3aWxsIGJlIHNldCBhIGJpdCBmdXJ0aGVyIGRvd25cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcImJsdXJcIiA6ICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHR2YXIgaSA9IHMuY2hpbGRyZW4oXCIuanN0cmVlLXJlbmFtZS1pbnB1dFwiKSxcblx0XHRcdFx0XHRcdFx0XHR2ID0gaS52YWwoKSxcblx0XHRcdFx0XHRcdFx0XHRmID0gdGhpcy5zZXR0aW5ncy5jb3JlLmZvcmNlX3RleHQsXG5cdFx0XHRcdFx0XHRcdFx0bnY7XG5cdFx0XHRcdFx0XHRcdGlmKHYgPT09IFwiXCIpIHsgdiA9IHQ7IH1cblx0XHRcdFx0XHRcdFx0aDEucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdHMucmVwbGFjZVdpdGgoYSk7XG5cdFx0XHRcdFx0XHRcdHMucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHRcdHQgPSBmID8gdCA6ICQoJzxkaXY+PC9kaXY+JykuYXBwZW5kKCQucGFyc2VIVE1MKHQpKS5odG1sKCk7XG5cdFx0XHRcdFx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5zZXRfdGV4dChvYmosIHQpO1xuXHRcdFx0XHRcdFx0XHRudiA9ICEhdGhpcy5yZW5hbWVfbm9kZShvYmosIGYgPyAkKCc8ZGl2PjwvZGl2PicpLnRleHQodikudGV4dCgpIDogJCgnPGRpdj48L2Rpdj4nKS5hcHBlbmQoJC5wYXJzZUhUTUwodikpLmh0bWwoKSk7XG5cdFx0XHRcdFx0XHRcdGlmKCFudikge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2V0X3RleHQob2JqLCB0KTsgLy8gbW92ZSB0aGlzIHVwPyBhbmQgZml4ICM0ODNcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCA9IHRtcC5pZDtcblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHRoaXMuZ2V0X25vZGUodG1wLmlkLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRpZihub2RlLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgPSB0bXAuaWQ7XG5cdFx0XHRcdFx0XHRcdFx0XHRub2RlLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LCB0aGlzKSwgMCk7XG5cdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCB0bXAsIG52LCBjYW5jZWwpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGgyID0gbnVsbDtcblx0XHRcdFx0XHRcdH0sIHRoaXMpLFxuXHRcdFx0XHRcdFx0XCJrZXlkb3duXCIgOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIga2V5ID0gZS53aGljaDtcblx0XHRcdFx0XHRcdFx0aWYoa2V5ID09PSAyNykge1xuXHRcdFx0XHRcdFx0XHRcdGNhbmNlbCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy52YWx1ZSA9IHQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoa2V5ID09PSAyNyB8fCBrZXkgPT09IDEzIHx8IGtleSA9PT0gMzcgfHwga2V5ID09PSAzOCB8fCBrZXkgPT09IDM5IHx8IGtleSA9PT0gNDAgfHwga2V5ID09PSAzMikge1xuXHRcdFx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoa2V5ID09PSAyNyB8fCBrZXkgPT09IDEzKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuYmx1cigpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJjbGlja1wiIDogZnVuY3Rpb24gKGUpIHsgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTsgfSxcblx0XHRcdFx0XHRcdFwibW91c2Vkb3duXCIgOiBmdW5jdGlvbiAoZSkgeyBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpOyB9LFxuXHRcdFx0XHRcdFx0XCJrZXl1cFwiIDogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0aDIud2lkdGgoTWF0aC5taW4oaDEudGV4dChcInBXXCIgKyB0aGlzLnZhbHVlKS53aWR0aCgpLHcpKTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcImtleXByZXNzXCIgOiBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0XHRcdGlmKGUud2hpY2ggPT09IDEzKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRmbiA9IHtcblx0XHRcdFx0XHRcdGZvbnRGYW1pbHlcdFx0OiBhLmNzcygnZm9udEZhbWlseScpXHRcdHx8ICcnLFxuXHRcdFx0XHRcdFx0Zm9udFNpemVcdFx0OiBhLmNzcygnZm9udFNpemUnKVx0XHRcdHx8ICcnLFxuXHRcdFx0XHRcdFx0Zm9udFdlaWdodFx0XHQ6IGEuY3NzKCdmb250V2VpZ2h0JylcdFx0fHwgJycsXG5cdFx0XHRcdFx0XHRmb250U3R5bGVcdFx0OiBhLmNzcygnZm9udFN0eWxlJylcdFx0fHwgJycsXG5cdFx0XHRcdFx0XHRmb250U3RyZXRjaFx0XHQ6IGEuY3NzKCdmb250U3RyZXRjaCcpXHRcdHx8ICcnLFxuXHRcdFx0XHRcdFx0Zm9udFZhcmlhbnRcdFx0OiBhLmNzcygnZm9udFZhcmlhbnQnKVx0XHR8fCAnJyxcblx0XHRcdFx0XHRcdGxldHRlclNwYWNpbmdcdDogYS5jc3MoJ2xldHRlclNwYWNpbmcnKVx0fHwgJycsXG5cdFx0XHRcdFx0XHR3b3JkU3BhY2luZ1x0XHQ6IGEuY3NzKCd3b3JkU3BhY2luZycpXHRcdHx8ICcnXG5cdFx0XHRcdH07XG5cdFx0XHRzLmF0dHIoJ2NsYXNzJywgYS5hdHRyKCdjbGFzcycpKS5hcHBlbmQoYS5jb250ZW50cygpLmNsb25lKCkpLmFwcGVuZChoMik7XG5cdFx0XHRhLnJlcGxhY2VXaXRoKHMpO1xuXHRcdFx0aDEuY3NzKGZuKTtcblx0XHRcdGgyLmNzcyhmbikud2lkdGgoTWF0aC5taW4oaDEudGV4dChcInBXXCIgKyBoMlswXS52YWx1ZSkud2lkdGgoKSx3KSlbMF0uc2VsZWN0KCk7XG5cdFx0XHQkKGRvY3VtZW50KS5vbmUoJ21vdXNlZG93bi5qc3RyZWUgdG91Y2hzdGFydC5qc3RyZWUgZG5kX3N0YXJ0LnZha2F0YScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGlmIChoMiAmJiBlLnRhcmdldCAhPT0gaDIpIHtcblx0XHRcdFx0XHQkKGgyKS5ibHVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqIGNoYW5nZXMgdGhlIHRoZW1lXG5cdFx0ICogQG5hbWUgc2V0X3RoZW1lKHRoZW1lX25hbWUgWywgdGhlbWVfdXJsXSlcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdGhlbWVfbmFtZSB0aGUgbmFtZSBvZiB0aGUgbmV3IHRoZW1lIHRvIGFwcGx5XG5cdFx0ICogQHBhcmFtIHttaXhlZH0gdGhlbWVfdXJsICB0aGUgbG9jYXRpb24gb2YgdGhlIENTUyBmaWxlIGZvciB0aGlzIHRoZW1lLiBPbWl0IG9yIHNldCB0byBgZmFsc2VgIGlmIHlvdSBtYW51YWxseSBpbmNsdWRlZCB0aGUgZmlsZS4gU2V0IHRvIGB0cnVlYCB0byBhdXRvbG9hZCBmcm9tIHRoZSBgY29yZS50aGVtZXMuZGlyYCBkaXJlY3RvcnkuXG5cdFx0ICogQHRyaWdnZXIgc2V0X3RoZW1lLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHNldF90aGVtZSA6IGZ1bmN0aW9uICh0aGVtZV9uYW1lLCB0aGVtZV91cmwpIHtcblx0XHRcdGlmKCF0aGVtZV9uYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYodGhlbWVfdXJsID09PSB0cnVlKSB7XG5cdFx0XHRcdHZhciBkaXIgPSB0aGlzLnNldHRpbmdzLmNvcmUudGhlbWVzLmRpcjtcblx0XHRcdFx0aWYoIWRpcikgeyBkaXIgPSAkLmpzdHJlZS5wYXRoICsgJy90aGVtZXMnOyB9XG5cdFx0XHRcdHRoZW1lX3VybCA9IGRpciArICcvJyArIHRoZW1lX25hbWUgKyAnL3N0eWxlLmNzcyc7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGVtZV91cmwgJiYgJC5pbkFycmF5KHRoZW1lX3VybCwgdGhlbWVzX2xvYWRlZCkgPT09IC0xKSB7XG5cdFx0XHRcdCQoJ2hlYWQnKS5hcHBlbmQoJzwnKydsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJyArIHRoZW1lX3VybCArICdcIiB0eXBlPVwidGV4dC9jc3NcIiAvPicpO1xuXHRcdFx0XHR0aGVtZXNfbG9hZGVkLnB1c2godGhlbWVfdXJsKTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS50aGVtZXMubmFtZSkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2pzdHJlZS0nICsgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5uYW1lKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMubmFtZSA9IHRoZW1lX25hbWU7XG5cdFx0XHR0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ2pzdHJlZS0nICsgdGhlbWVfbmFtZSk7XG5cdFx0XHR0aGlzLmVsZW1lbnRbdGhpcy5zZXR0aW5ncy5jb3JlLnRoZW1lcy5yZXNwb25zaXZlID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcycgXSgnanN0cmVlLScgKyB0aGVtZV9uYW1lICsgJy1yZXNwb25zaXZlJyk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgdGhlbWUgaXMgc2V0XG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNldF90aGVtZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0aGVtZSB0aGUgbmV3IHRoZW1lXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2V0X3RoZW1lJywgeyAndGhlbWUnIDogdGhlbWVfbmFtZSB9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldHMgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnRseSBhcHBsaWVkIHRoZW1lIG5hbWVcblx0XHQgKiBAbmFtZSBnZXRfdGhlbWUoKVxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cblx0XHQgKi9cblx0XHRnZXRfdGhlbWUgOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLm5hbWU7IH0sXG5cdFx0LyoqXG5cdFx0ICogY2hhbmdlcyB0aGUgdGhlbWUgdmFyaWFudCAoaWYgdGhlIHRoZW1lIGhhcyB2YXJpYW50cylcblx0XHQgKiBAbmFtZSBzZXRfdGhlbWVfdmFyaWFudCh2YXJpYW50X25hbWUpXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd8Qm9vbGVhbn0gdmFyaWFudF9uYW1lIHRoZSB2YXJpYW50IHRvIGFwcGx5IChpZiBgZmFsc2VgIGlzIHVzZWQgdGhlIGN1cnJlbnQgdmFyaWFudCBpcyByZW1vdmVkKVxuXHRcdCAqL1xuXHRcdHNldF90aGVtZV92YXJpYW50IDogZnVuY3Rpb24gKHZhcmlhbnRfbmFtZSkge1xuXHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLnRoZW1lcy52YXJpYW50KSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnanN0cmVlLScgKyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLm5hbWUgKyAnLScgKyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnZhcmlhbnQpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy52YXJpYW50ID0gdmFyaWFudF9uYW1lO1xuXHRcdFx0aWYodmFyaWFudF9uYW1lKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5hZGRDbGFzcygnanN0cmVlLScgKyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLm5hbWUgKyAnLScgKyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnZhcmlhbnQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0cyB0aGUgbmFtZSBvZiB0aGUgY3VycmVudGx5IGFwcGxpZWQgdGhlbWUgdmFyaWFudFxuXHRcdCAqIEBuYW1lIGdldF90aGVtZSgpXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdGdldF90aGVtZV92YXJpYW50IDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy52YXJpYW50OyB9LFxuXHRcdC8qKlxuXHRcdCAqIHNob3dzIGEgc3RyaXBlZCBiYWNrZ3JvdW5kIG9uIHRoZSBjb250YWluZXIgKGlmIHRoZSB0aGVtZSBzdXBwb3J0cyBpdClcblx0XHQgKiBAbmFtZSBzaG93X3N0cmlwZXMoKVxuXHRcdCAqL1xuXHRcdHNob3dfc3RyaXBlcyA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuc3RyaXBlcyA9IHRydWU7XG5cdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5hZGRDbGFzcyhcImpzdHJlZS1zdHJpcGVkXCIpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBzdHJpcGVzIGFyZSBzaG93blxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzaG93X3N0cmlwZXMuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2hvd19zdHJpcGVzJyk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBoaWRlcyB0aGUgc3RyaXBlZCBiYWNrZ3JvdW5kIG9uIHRoZSBjb250YWluZXJcblx0XHQgKiBAbmFtZSBoaWRlX3N0cmlwZXMoKVxuXHRcdCAqL1xuXHRcdGhpZGVfc3RyaXBlcyA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuc3RyaXBlcyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtc3RyaXBlZFwiKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gc3RyaXBlcyBhcmUgaGlkZGVuXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGhpZGVfc3RyaXBlcy5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdoaWRlX3N0cmlwZXMnKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHRvZ2dsZXMgdGhlIHN0cmlwZWQgYmFja2dyb3VuZCBvbiB0aGUgY29udGFpbmVyXG5cdFx0ICogQG5hbWUgdG9nZ2xlX3N0cmlwZXMoKVxuXHRcdCAqL1xuXHRcdHRvZ2dsZV9zdHJpcGVzIDogZnVuY3Rpb24gKCkgeyBpZih0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnN0cmlwZXMpIHsgdGhpcy5oaWRlX3N0cmlwZXMoKTsgfSBlbHNlIHsgdGhpcy5zaG93X3N0cmlwZXMoKTsgfSB9LFxuXHRcdC8qKlxuXHRcdCAqIHNob3dzIHRoZSBjb25uZWN0aW5nIGRvdHMgKGlmIHRoZSB0aGVtZSBzdXBwb3J0cyBpdClcblx0XHQgKiBAbmFtZSBzaG93X2RvdHMoKVxuXHRcdCAqL1xuXHRcdHNob3dfZG90cyA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZG90cyA9IHRydWU7XG5cdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5yZW1vdmVDbGFzcyhcImpzdHJlZS1uby1kb3RzXCIpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBkb3RzIGFyZSBzaG93blxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzaG93X2RvdHMuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2hvd19kb3RzJyk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBoaWRlcyB0aGUgY29ubmVjdGluZyBkb3RzXG5cdFx0ICogQG5hbWUgaGlkZV9kb3RzKClcblx0XHQgKi9cblx0XHRoaWRlX2RvdHMgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmRvdHMgPSBmYWxzZTtcblx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmFkZENsYXNzKFwianN0cmVlLW5vLWRvdHNcIik7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGRvdHMgYXJlIGhpZGRlblxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBoaWRlX2RvdHMuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignaGlkZV9kb3RzJyk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiB0b2dnbGVzIHRoZSBjb25uZWN0aW5nIGRvdHNcblx0XHQgKiBAbmFtZSB0b2dnbGVfZG90cygpXG5cdFx0ICovXG5cdFx0dG9nZ2xlX2RvdHMgOiBmdW5jdGlvbiAoKSB7IGlmKHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZG90cykgeyB0aGlzLmhpZGVfZG90cygpOyB9IGVsc2UgeyB0aGlzLnNob3dfZG90cygpOyB9IH0sXG5cdFx0LyoqXG5cdFx0ICogc2hvdyB0aGUgbm9kZSBpY29uc1xuXHRcdCAqIEBuYW1lIHNob3dfaWNvbnMoKVxuXHRcdCAqL1xuXHRcdHNob3dfaWNvbnMgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmljb25zID0gdHJ1ZTtcblx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLnJlbW92ZUNsYXNzKFwianN0cmVlLW5vLWljb25zXCIpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBpY29ucyBhcmUgc2hvd25cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2hvd19pY29ucy5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzaG93X2ljb25zJyk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBoaWRlIHRoZSBub2RlIGljb25zXG5cdFx0ICogQG5hbWUgaGlkZV9pY29ucygpXG5cdFx0ICovXG5cdFx0aGlkZV9pY29ucyA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuaWNvbnMgPSBmYWxzZTtcblx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmFkZENsYXNzKFwianN0cmVlLW5vLWljb25zXCIpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBpY29ucyBhcmUgaGlkZGVuXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGhpZGVfaWNvbnMuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignaGlkZV9pY29ucycpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogdG9nZ2xlIHRoZSBub2RlIGljb25zXG5cdFx0ICogQG5hbWUgdG9nZ2xlX2ljb25zKClcblx0XHQgKi9cblx0XHR0b2dnbGVfaWNvbnMgOiBmdW5jdGlvbiAoKSB7IGlmKHRoaXMuX2RhdGEuY29yZS50aGVtZXMuaWNvbnMpIHsgdGhpcy5oaWRlX2ljb25zKCk7IH0gZWxzZSB7IHRoaXMuc2hvd19pY29ucygpOyB9IH0sXG5cdFx0LyoqXG5cdFx0ICogc2hvdyB0aGUgbm9kZSBlbGxpcHNpc1xuXHRcdCAqIEBuYW1lIHNob3dfaWNvbnMoKVxuXHRcdCAqL1xuXHRcdHNob3dfZWxsaXBzaXMgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmVsbGlwc2lzID0gdHJ1ZTtcblx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmFkZENsYXNzKFwianN0cmVlLWVsbGlwc2lzXCIpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBlbGxpc2lzIGlzIHNob3duXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNob3dfZWxsaXBzaXMuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2hvd19lbGxpcHNpcycpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaGlkZSB0aGUgbm9kZSBlbGxpcHNpc1xuXHRcdCAqIEBuYW1lIGhpZGVfZWxsaXBzaXMoKVxuXHRcdCAqL1xuXHRcdGhpZGVfZWxsaXBzaXMgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmVsbGlwc2lzID0gZmFsc2U7XG5cdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5yZW1vdmVDbGFzcyhcImpzdHJlZS1lbGxpcHNpc1wiKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gZWxsaXNpcyBpcyBoaWRkZW5cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgaGlkZV9lbGxpcHNpcy5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdoaWRlX2VsbGlwc2lzJyk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiB0b2dnbGUgdGhlIG5vZGUgZWxsaXBzaXNcblx0XHQgKiBAbmFtZSB0b2dnbGVfaWNvbnMoKVxuXHRcdCAqL1xuXHRcdHRvZ2dsZV9lbGxpcHNpcyA6IGZ1bmN0aW9uICgpIHsgaWYodGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5lbGxpcHNpcykgeyB0aGlzLmhpZGVfZWxsaXBzaXMoKTsgfSBlbHNlIHsgdGhpcy5zaG93X2VsbGlwc2lzKCk7IH0gfSxcblx0XHQvKipcblx0XHQgKiBzZXQgdGhlIG5vZGUgaWNvbiBmb3IgYSBub2RlXG5cdFx0ICogQG5hbWUgc2V0X2ljb24ob2JqLCBpY29uKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9ialxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBpY29uIHRoZSBuZXcgaWNvbiAtIGNhbiBiZSBhIHBhdGggdG8gYW4gaWNvbiBvciBhIGNsYXNzTmFtZSwgaWYgdXNpbmcgYW4gaW1hZ2UgdGhhdCBpcyBpbiB0aGUgY3VycmVudCBkaXJlY3RvcnkgdXNlIGEgYC4vYCBwcmVmaXgsIG90aGVyd2lzZSBpdCB3aWxsIGJlIGRldGVjdGVkIGFzIGEgY2xhc3Ncblx0XHQgKi9cblx0XHRzZXRfaWNvbiA6IGZ1bmN0aW9uIChvYmosIGljb24pIHtcblx0XHRcdHZhciB0MSwgdDIsIGRvbSwgb2xkO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuc2V0X2ljb24ob2JqW3QxXSwgaWNvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdG9sZCA9IG9iai5pY29uO1xuXHRcdFx0b2JqLmljb24gPSBpY29uID09PSB0cnVlIHx8IGljb24gPT09IG51bGwgfHwgaWNvbiA9PT0gdW5kZWZpbmVkIHx8IGljb24gPT09ICcnID8gdHJ1ZSA6IGljb247XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSkuY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5jaGlsZHJlbihcIi5qc3RyZWUtdGhlbWVpY29uXCIpO1xuXHRcdFx0aWYoaWNvbiA9PT0gZmFsc2UpIHtcblx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKCdqc3RyZWUtdGhlbWVpY29uLWN1c3RvbSAnICsgb2xkKS5jc3MoXCJiYWNrZ3JvdW5kXCIsXCJcIikucmVtb3ZlQXR0cihcInJlbFwiKTtcblx0XHRcdFx0dGhpcy5oaWRlX2ljb24ob2JqKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoaWNvbiA9PT0gdHJ1ZSB8fCBpY29uID09PSBudWxsIHx8IGljb24gPT09IHVuZGVmaW5lZCB8fCBpY29uID09PSAnJykge1xuXHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3MoJ2pzdHJlZS10aGVtZWljb24tY3VzdG9tICcgKyBvbGQpLmNzcyhcImJhY2tncm91bmRcIixcIlwiKS5yZW1vdmVBdHRyKFwicmVsXCIpO1xuXHRcdFx0XHRpZihvbGQgPT09IGZhbHNlKSB7IHRoaXMuc2hvd19pY29uKG9iaik7IH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoaWNvbi5pbmRleE9mKFwiL1wiKSA9PT0gLTEgJiYgaWNvbi5pbmRleE9mKFwiLlwiKSA9PT0gLTEpIHtcblx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKG9sZCkuY3NzKFwiYmFja2dyb3VuZFwiLFwiXCIpO1xuXHRcdFx0XHRkb20uYWRkQ2xhc3MoaWNvbiArICcganN0cmVlLXRoZW1laWNvbi1jdXN0b20nKS5hdHRyKFwicmVsXCIsaWNvbik7XG5cdFx0XHRcdGlmKG9sZCA9PT0gZmFsc2UpIHsgdGhpcy5zaG93X2ljb24ob2JqKTsgfVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRvbS5yZW1vdmVDbGFzcyhvbGQpLmNzcyhcImJhY2tncm91bmRcIixcIlwiKTtcblx0XHRcdFx0ZG9tLmFkZENsYXNzKCdqc3RyZWUtdGhlbWVpY29uLWN1c3RvbScpLmNzcyhcImJhY2tncm91bmRcIiwgXCJ1cmwoJ1wiICsgaWNvbiArIFwiJykgY2VudGVyIGNlbnRlciBuby1yZXBlYXRcIikuYXR0cihcInJlbFwiLGljb24pO1xuXHRcdFx0XHRpZihvbGQgPT09IGZhbHNlKSB7IHRoaXMuc2hvd19pY29uKG9iaik7IH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IHRoZSBub2RlIGljb24gZm9yIGEgbm9kZVxuXHRcdCAqIEBuYW1lIGdldF9pY29uKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0Z2V0X2ljb24gOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSA/IGZhbHNlIDogb2JqLmljb247XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBoaWRlIHRoZSBpY29uIG9uIGFuIGluZGl2aWR1YWwgbm9kZVxuXHRcdCAqIEBuYW1lIGhpZGVfaWNvbihvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqXG5cdFx0ICovXG5cdFx0aGlkZV9pY29uIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0dmFyIHQxLCB0Mjtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmhpZGVfaWNvbihvYmpbdDFdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0b2JqLmljb24gPSBmYWxzZTtcblx0XHRcdHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS10aGVtZWljb25cIikuYWRkQ2xhc3MoJ2pzdHJlZS10aGVtZWljb24taGlkZGVuJyk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHNob3cgdGhlIGljb24gb24gYW4gaW5kaXZpZHVhbCBub2RlXG5cdFx0ICogQG5hbWUgc2hvd19pY29uKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmpcblx0XHQgKi9cblx0XHRzaG93X2ljb24gOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBkb207XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5zaG93X2ljb24ob2JqW3QxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iaiA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdG9iai5pY29uID0gZG9tLmxlbmd0aCA/IGRvbS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS10aGVtZWljb25cIikuYXR0cigncmVsJykgOiB0cnVlO1xuXHRcdFx0aWYoIW9iai5pY29uKSB7IG9iai5pY29uID0gdHJ1ZTsgfVxuXHRcdFx0ZG9tLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikuY2hpbGRyZW4oXCIuanN0cmVlLXRoZW1laWNvblwiKS5yZW1vdmVDbGFzcygnanN0cmVlLXRoZW1laWNvbi1oaWRkZW4nKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fTtcblxuXHQvLyBoZWxwZXJzXG5cdCQudmFrYXRhID0ge307XG5cdC8vIGNvbGxlY3QgYXR0cmlidXRlc1xuXHQkLnZha2F0YS5hdHRyaWJ1dGVzID0gZnVuY3Rpb24obm9kZSwgd2l0aF92YWx1ZXMpIHtcblx0XHRub2RlID0gJChub2RlKVswXTtcblx0XHR2YXIgYXR0ciA9IHdpdGhfdmFsdWVzID8ge30gOiBbXTtcblx0XHRpZihub2RlICYmIG5vZGUuYXR0cmlidXRlcykge1xuXHRcdFx0JC5lYWNoKG5vZGUuYXR0cmlidXRlcywgZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0aWYoJC5pbkFycmF5KHYubmFtZS50b0xvd2VyQ2FzZSgpLFsnc3R5bGUnLCdjb250ZW50ZWRpdGFibGUnLCdoYXNmb2N1cycsJ3RhYmluZGV4J10pICE9PSAtMSkgeyByZXR1cm47IH1cblx0XHRcdFx0aWYodi52YWx1ZSAhPT0gbnVsbCAmJiAkLnRyaW0odi52YWx1ZSkgIT09ICcnKSB7XG5cdFx0XHRcdFx0aWYod2l0aF92YWx1ZXMpIHsgYXR0clt2Lm5hbWVdID0gdi52YWx1ZTsgfVxuXHRcdFx0XHRcdGVsc2UgeyBhdHRyLnB1c2godi5uYW1lKTsgfVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIGF0dHI7XG5cdH07XG5cdCQudmFrYXRhLmFycmF5X3VuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG5cdFx0dmFyIGEgPSBbXSwgaSwgaiwgbCwgbyA9IHt9O1xuXHRcdGZvcihpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0aWYob1thcnJheVtpXV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRhLnB1c2goYXJyYXlbaV0pO1xuXHRcdFx0XHRvW2FycmF5W2ldXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBhO1xuXHR9O1xuXHQvLyByZW1vdmUgaXRlbSBmcm9tIGFycmF5XG5cdCQudmFrYXRhLmFycmF5X3JlbW92ZSA9IGZ1bmN0aW9uKGFycmF5LCBmcm9tKSB7XG5cdFx0YXJyYXkuc3BsaWNlKGZyb20sIDEpO1xuXHRcdHJldHVybiBhcnJheTtcblx0XHQvL3ZhciByZXN0ID0gYXJyYXkuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCBhcnJheS5sZW5ndGgpO1xuXHRcdC8vYXJyYXkubGVuZ3RoID0gZnJvbSA8IDAgPyBhcnJheS5sZW5ndGggKyBmcm9tIDogZnJvbTtcblx0XHQvL2FycmF5LnB1c2guYXBwbHkoYXJyYXksIHJlc3QpO1xuXHRcdC8vcmV0dXJuIGFycmF5O1xuXHR9O1xuXHQvLyByZW1vdmUgaXRlbSBmcm9tIGFycmF5XG5cdCQudmFrYXRhLmFycmF5X3JlbW92ZV9pdGVtID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0pIHtcblx0XHR2YXIgdG1wID0gJC5pbkFycmF5KGl0ZW0sIGFycmF5KTtcblx0XHRyZXR1cm4gdG1wICE9PSAtMSA/ICQudmFrYXRhLmFycmF5X3JlbW92ZShhcnJheSwgdG1wKSA6IGFycmF5O1xuXHR9O1xuXHQkLnZha2F0YS5hcnJheV9maWx0ZXIgPSBmdW5jdGlvbihjLGEsYixkLGUpIHtcblx0XHRpZiAoYy5maWx0ZXIpIHtcblx0XHRcdHJldHVybiBjLmZpbHRlcihhLCBiKTtcblx0XHR9XG5cdFx0ZD1bXTtcblx0XHRmb3IgKGUgaW4gYykge1xuXHRcdFx0aWYgKH5+ZSsnJz09PWUrJycgJiYgZT49MCAmJiBhLmNhbGwoYixjW2VdLCtlLGMpKSB7XG5cdFx0XHRcdGQucHVzaChjW2VdKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGQ7XG5cdH07XG5cblxuLyoqXG4gKiAjIyMgQ2hhbmdlZCBwbHVnaW5cbiAqXG4gKiBUaGlzIHBsdWdpbiBhZGRzIG1vcmUgaW5mb3JtYXRpb24gdG8gdGhlIGBjaGFuZ2VkLmpzdHJlZWAgZXZlbnQuIFRoZSBuZXcgZGF0YSBpcyBjb250YWluZWQgaW4gdGhlIGBjaGFuZ2VkYCBldmVudCBkYXRhIHByb3BlcnR5LCBhbmQgY29udGFpbnMgYSBsaXN0cyBvZiBgc2VsZWN0ZWRgIGFuZCBgZGVzZWxlY3RlZGAgbm9kZXMuXG4gKi9cblxuXHQkLmpzdHJlZS5wbHVnaW5zLmNoYW5nZWQgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dmFyIGxhc3QgPSBbXTtcblx0XHR0aGlzLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXYsIGRhdGEpIHtcblx0XHRcdHZhciBpLCBqO1xuXHRcdFx0aWYoIWRhdGEpIHtcblx0XHRcdFx0ZGF0YSA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0aWYoZXYucmVwbGFjZSgnLmpzdHJlZScsJycpID09PSAnY2hhbmdlZCcpIHtcblx0XHRcdFx0ZGF0YS5jaGFuZ2VkID0geyBzZWxlY3RlZCA6IFtdLCBkZXNlbGVjdGVkIDogW10gfTtcblx0XHRcdFx0dmFyIHRtcCA9IHt9O1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBsYXN0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdHRtcFtsYXN0W2ldXSA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZGF0YS5zZWxlY3RlZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZighdG1wW2RhdGEuc2VsZWN0ZWRbaV1dKSB7XG5cdFx0XHRcdFx0XHRkYXRhLmNoYW5nZWQuc2VsZWN0ZWQucHVzaChkYXRhLnNlbGVjdGVkW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0bXBbZGF0YS5zZWxlY3RlZFtpXV0gPSAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBsYXN0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKHRtcFtsYXN0W2ldXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0ZGF0YS5jaGFuZ2VkLmRlc2VsZWN0ZWQucHVzaChsYXN0W2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0bGFzdCA9IGRhdGEuc2VsZWN0ZWQuc2xpY2UoKTtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gc2VsZWN0aW9uIGNoYW5nZXMgKHRoZSBcImNoYW5nZWRcIiBwbHVnaW4gZW5oYW5jZXMgdGhlIG9yaWdpbmFsIGV2ZW50IHdpdGggbW9yZSBkYXRhKVxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjaGFuZ2VkLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gdGhlIGFjdGlvbiB0aGF0IGNhdXNlZCB0aGUgc2VsZWN0aW9uIHRvIGNoYW5nZVxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gY2hhbmdlZCBhbiBvYmplY3QgY29udGFpbmluZyB0d28gcHJvcGVydGllcyBgc2VsZWN0ZWRgIGFuZCBgZGVzZWxlY3RlZGAgLSBib3RoIGFycmF5cyBvZiBub2RlIElEcywgd2hpY2ggd2VyZSBzZWxlY3RlZCBvciBkZXNlbGVjdGVkIHNpbmNlIHRoZSBsYXN0IGNoYW5nZWQgZXZlbnRcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgZXZlbnQgKGlmIGFueSkgdGhhdCB0cmlnZ2VyZWQgdGhpcyBjaGFuZ2VkIGV2ZW50XG5cdFx0XHQgKiBAcGx1Z2luIGNoYW5nZWRcblx0XHRcdCAqL1xuXHRcdFx0cGFyZW50LnRyaWdnZXIuY2FsbCh0aGlzLCBldiwgZGF0YSk7XG5cdFx0fTtcblx0XHR0aGlzLnJlZnJlc2ggPSBmdW5jdGlvbiAoc2tpcF9sb2FkaW5nLCBmb3JnZXRfc3RhdGUpIHtcblx0XHRcdGxhc3QgPSBbXTtcblx0XHRcdHJldHVybiBwYXJlbnQucmVmcmVzaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH07XG5cdH07XG5cbi8qKlxuICogIyMjIENoZWNrYm94IHBsdWdpblxuICpcbiAqIFRoaXMgcGx1Z2luIHJlbmRlcnMgY2hlY2tib3ggaWNvbnMgaW4gZnJvbnQgb2YgZWFjaCBub2RlLCBtYWtpbmcgbXVsdGlwbGUgc2VsZWN0aW9uIG11Y2ggZWFzaWVyLlxuICogSXQgYWxzbyBzdXBwb3J0cyB0cmktc3RhdGUgYmVoYXZpb3IsIG1lYW5pbmcgdGhhdCBpZiBhIG5vZGUgaGFzIGEgZmV3IG9mIGl0cyBjaGlsZHJlbiBjaGVja2VkIGl0IHdpbGwgYmUgcmVuZGVyZWQgYXMgdW5kZXRlcm1pbmVkLCBhbmQgc3RhdGUgd2lsbCBiZSBwcm9wYWdhdGVkIHVwLlxuICovXG5cblx0dmFyIF9pID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnSScpO1xuXHRfaS5jbGFzc05hbWUgPSAnanN0cmVlLWljb24ganN0cmVlLWNoZWNrYm94Jztcblx0X2kuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuXHQvKipcblx0ICogc3RvcmVzIGFsbCBkZWZhdWx0cyBmb3IgdGhlIGNoZWNrYm94IHBsdWdpblxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveFxuXHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveCA9IHtcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBjaGVja2JveGVzIHNob3VsZCBiZSB2aXNpYmxlIChjYW4gYmUgY2hhbmdlZCBhdCBhIGxhdGVyIHRpbWUgdXNpbmcgYHNob3dfY2hlY2tib3hlcygpYCBhbmQgYGhpZGVfY2hlY2tib3hlc2ApLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3gudmlzaWJsZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR2aXNpYmxlXHRcdFx0XHQ6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgY2hlY2tib3hlcyBzaG91bGQgY2FzY2FkZSBkb3duIGFuZCBoYXZlIGFuIHVuZGV0ZXJtaW5lZCBzdGF0ZS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94LnRocmVlX3N0YXRlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRocmVlX3N0YXRlXHRcdFx0OiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGNsaWNraW5nIGFueXdoZXJlIG9uIHRoZSBub2RlIHNob3VsZCBhY3QgYXMgY2xpY2tpbmcgb24gdGhlIGNoZWNrYm94LiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3gud2hvbGVfbm9kZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR3aG9sZV9ub2RlXHRcdFx0OiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBzZWxlY3RlZCBzdHlsZSBvZiBhIG5vZGUgc2hvdWxkIGJlIGtlcHQsIG9yIHJlbW92ZWQuIERlZmF1bHRzIHRvIGB0cnVlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveC5rZWVwX3NlbGVjdGVkX3N0eWxlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdGtlZXBfc2VsZWN0ZWRfc3R5bGVcdDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBUaGlzIHNldHRpbmcgY29udHJvbHMgaG93IGNhc2NhZGluZyBhbmQgdW5kZXRlcm1pbmVkIG5vZGVzIGFyZSBhcHBsaWVkLlxuXHRcdCAqIElmICd1cCcgaXMgaW4gdGhlIHN0cmluZyAtIGNhc2NhZGluZyB1cCBpcyBlbmFibGVkLCBpZiAnZG93bicgaXMgaW4gdGhlIHN0cmluZyAtIGNhc2NhZGluZyBkb3duIGlzIGVuYWJsZWQsIGlmICd1bmRldGVybWluZWQnIGlzIGluIHRoZSBzdHJpbmcgLSB1bmRldGVybWluZWQgbm9kZXMgd2lsbCBiZSB1c2VkLlxuXHRcdCAqIElmIGB0aHJlZV9zdGF0ZWAgaXMgc2V0IHRvIGB0cnVlYCB0aGlzIHNldHRpbmcgaXMgYXV0b21hdGljYWxseSBzZXQgdG8gJ3VwK2Rvd24rdW5kZXRlcm1pbmVkJy4gRGVmYXVsdHMgdG8gJycuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3guY2FzY2FkZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHRjYXNjYWRlXHRcdFx0XHQ6ICcnLFxuXHRcdC8qKlxuXHRcdCAqIFRoaXMgc2V0dGluZyBjb250cm9scyBpZiBjaGVja2JveCBhcmUgYm91bmQgdG8gdGhlIGdlbmVyYWwgdHJlZSBzZWxlY3Rpb24gb3IgdG8gYW4gaW50ZXJuYWwgYXJyYXkgbWFpbnRhaW5lZCBieSB0aGUgY2hlY2tib3ggcGx1Z2luLiBEZWZhdWx0cyB0byBgdHJ1ZWAsIG9ubHkgc2V0IHRvIGBmYWxzZWAgaWYgeW91IGtub3cgZXhhY3RseSB3aGF0IHlvdSBhcmUgZG9pbmcuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3gudGllX3NlbGVjdGlvblxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aWVfc2VsZWN0aW9uXHRcdDogdHJ1ZSxcblxuXHRcdC8qKlxuXHRcdCAqIFRoaXMgc2V0dGluZyBjb250cm9scyBpZiBjYXNjYWRpbmcgZG93biBhZmZlY3RzIGRpc2FibGVkIGNoZWNrYm94ZXNcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveC5jYXNjYWRlX3RvX2Rpc2FibGVkXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdGNhc2NhZGVfdG9fZGlzYWJsZWQgOiB0cnVlLFxuXG5cdFx0LyoqXG5cdFx0ICogVGhpcyBzZXR0aW5nIGNvbnRyb2xzIGlmIGNhc2NhZGluZyBkb3duIGFmZmVjdHMgaGlkZGVuIGNoZWNrYm94ZXNcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveC5jYXNjYWRlX3RvX2hpZGRlblxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHRjYXNjYWRlX3RvX2hpZGRlbiA6IHRydWVcblx0fTtcblx0JC5qc3RyZWUucGx1Z2lucy5jaGVja2JveCA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYXJlbnQuYmluZC5jYWxsKHRoaXMpO1xuXHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC51dG8gPSBmYWxzZTtcblx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQgPSBbXTtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGhyZWVfc3RhdGUpIHtcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlID0gJ3VwK2Rvd24rdW5kZXRlcm1pbmVkJztcblx0XHRcdH1cblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQub24oXCJpbml0LmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3gudmlzaWJsZSA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudmlzaWJsZTtcblx0XHRcdFx0XHRcdGlmKCF0aGlzLnNldHRpbmdzLmNoZWNrYm94LmtlZXBfc2VsZWN0ZWRfc3R5bGUpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmFkZENsYXNzKCdqc3RyZWUtY2hlY2tib3gtbm8tY2xpY2tlZCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hZGRDbGFzcygnanN0cmVlLWNoZWNrYm94LXNlbGVjdGlvbicpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJsb2FkaW5nLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHRoaXNbIHRoaXMuX2RhdGEuY2hlY2tib3gudmlzaWJsZSA/ICdzaG93X2NoZWNrYm94ZXMnIDogJ2hpZGVfY2hlY2tib3hlcycgXSgpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZS5pbmRleE9mKCd1bmRldGVybWluZWQnKSAhPT0gLTEpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdFx0Lm9uKCdjaGFuZ2VkLmpzdHJlZSB1bmNoZWNrX25vZGUuanN0cmVlIGNoZWNrX25vZGUuanN0cmVlIHVuY2hlY2tfYWxsLmpzdHJlZSBjaGVja19hbGwuanN0cmVlIG1vdmVfbm9kZS5qc3RyZWUgY29weV9ub2RlLmpzdHJlZSByZWRyYXcuanN0cmVlIG9wZW5fbm9kZS5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0Ly8gb25seSBpZiB1bmRldGVybWluZWQgaXMgaW4gc2V0dGluZ1xuXHRcdFx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLmNoZWNrYm94LnV0bykgeyBjbGVhclRpbWVvdXQodGhpcy5fZGF0YS5jaGVja2JveC51dG8pOyB9XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3gudXRvID0gc2V0VGltZW91dCgkLnByb3h5KHRoaXMuX3VuZGV0ZXJtaW5lZCwgdGhpcyksIDUwKTtcblx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdH1cblx0XHRcdGlmKCF0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdFx0Lm9uKCdtb2RlbC5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHR2YXIgbSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdFx0XHRcdHAgPSBtW2RhdGEucGFyZW50XSxcblx0XHRcdFx0XHRcdFx0ZHBjID0gZGF0YS5ub2Rlcyxcblx0XHRcdFx0XHRcdFx0aSwgajtcblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRwYy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0bVtkcGNbaV1dLnN0YXRlLmNoZWNrZWQgPSBtW2RwY1tpXV0uc3RhdGUuY2hlY2tlZCB8fCAobVtkcGNbaV1dLm9yaWdpbmFsICYmIG1bZHBjW2ldXS5vcmlnaW5hbC5zdGF0ZSAmJiBtW2RwY1tpXV0ub3JpZ2luYWwuc3RhdGUuY2hlY2tlZCk7XG5cdFx0XHRcdFx0XHRcdGlmKG1bZHBjW2ldXS5zdGF0ZS5jaGVja2VkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZC5wdXNoKGRwY1tpXSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUuaW5kZXhPZigndXAnKSAhPT0gLTEgfHwgdGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLmluZGV4T2YoJ2Rvd24nKSAhPT0gLTEpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdFx0Lm9uKCdtb2RlbC5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0XHRcdFx0XHRwID0gbVtkYXRhLnBhcmVudF0sXG5cdFx0XHRcdFx0XHRcdFx0ZHBjID0gZGF0YS5ub2Rlcyxcblx0XHRcdFx0XHRcdFx0XHRjaGQgPSBbXSxcblx0XHRcdFx0XHRcdFx0XHRjLCBpLCBqLCBrLCBsLCB0bXAsIHMgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUsIHQgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb247XG5cblx0XHRcdFx0XHRcdFx0aWYocy5pbmRleE9mKCdkb3duJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gYXBwbHkgZG93blxuXHRcdFx0XHRcdFx0XHRcdGlmKHAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRwYy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bVtkcGNbaV1dLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCA9IHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQuY29uY2F0KGRwYyk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZHBjLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihtW2RwY1tpXV0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IoayA9IDAsIGwgPSBtW2RwY1tpXV0uY2hpbGRyZW5fZC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1bbVtkcGNbaV1dLmNoaWxkcmVuX2Rba11dLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCA9IHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQuY29uY2F0KG1bZHBjW2ldXS5jaGlsZHJlbl9kKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmKHMuaW5kZXhPZigndXAnKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBhcHBseSB1cFxuXHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHAuY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKCFtW3AuY2hpbGRyZW5fZFtpXV0uY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoZC5wdXNoKG1bcC5jaGlsZHJlbl9kW2ldXS5wYXJlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRjaGQgPSAkLnZha2F0YS5hcnJheV91bmlxdWUoY2hkKTtcblx0XHRcdFx0XHRcdFx0XHRmb3IoayA9IDAsIGwgPSBjaGQubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwID0gbVtjaGRba11dO1xuXHRcdFx0XHRcdFx0XHRcdFx0d2hpbGUocCAmJiBwLmlkICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGMgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGMgKz0gbVtwLmNoaWxkcmVuW2ldXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihjID09PSBqKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZC5wdXNoKHAuaWQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUocCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3MoIHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHAgPSB0aGlzLmdldF9ub2RlKHAucGFyZW50KTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkID0gJC52YWthdGEuYXJyYXlfdW5pcXVlKHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQpO1xuXHRcdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdFx0Lm9uKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbiA/ICdzZWxlY3Rfbm9kZS5qc3RyZWUnIDogJ2NoZWNrX25vZGUuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0b2JqID0gZGF0YS5ub2RlLFxuXHRcdFx0XHRcdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRcdFx0XHRcdHBhciA9IHRoaXMuZ2V0X25vZGUob2JqLnBhcmVudCksXG5cdFx0XHRcdFx0XHRcdFx0aSwgaiwgYywgdG1wLCBzID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLCB0ID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdHNlbCA9IHt9LCBjdXIgPSB0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkO1xuXG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDAsIGogPSBjdXIubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2VsW2N1cltpXV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8gYXBwbHkgZG93blxuXHRcdFx0XHRcdFx0XHRpZihzLmluZGV4T2YoJ2Rvd24nKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHQvL3RoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQgPSAkLnZha2F0YS5hcnJheV91bmlxdWUodGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZC5jb25jYXQob2JqLmNoaWxkcmVuX2QpKTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgc2VsZWN0ZWRJZHMgPSB0aGlzLl9jYXNjYWRlX25ld19jaGVja2VkX3N0YXRlKG9iai5pZCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHRlbXAgPSBvYmouY2hpbGRyZW5fZC5jb25jYXQob2JqLmlkKTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwLCBqID0gdGVtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChzZWxlY3RlZElkcy5pbmRleE9mKHRlbXBbaV0pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsW3RlbXBbaV1dID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgc2VsW3RlbXBbaV1dO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIGFwcGx5IHVwXG5cdFx0XHRcdFx0XHRcdGlmKHMuaW5kZXhPZigndXAnKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZShwYXIgJiYgcGFyLmlkICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHBhci5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YyArPSBtW3Bhci5jaGlsZHJlbltpXV0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihjID09PSBqKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBhci5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlbFtwYXIuaWRdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly90aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLnB1c2gocGFyLmlkKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShwYXIsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3ModCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyID0gdGhpcy5nZXRfbm9kZShwYXIucGFyZW50KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRjdXIgPSBbXTtcblx0XHRcdFx0XHRcdFx0Zm9yIChpIGluIHNlbCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChzZWwuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGN1ci5wdXNoKGkpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkID0gY3VyO1xuXHRcdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdFx0Lm9uKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbiA/ICdkZXNlbGVjdF9hbGwuanN0cmVlJyA6ICd1bmNoZWNrX2FsbC5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBvYmogPSB0aGlzLmdldF9ub2RlKCQuanN0cmVlLnJvb3QpLFxuXHRcdFx0XHRcdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRcdFx0XHRcdGksIGosIHRtcDtcblx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wID0gbVtvYmouY2hpbGRyZW5fZFtpXV07XG5cdFx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5vcmlnaW5hbCAmJiB0bXAub3JpZ2luYWwuc3RhdGUgJiYgdG1wLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dG1wLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdFx0Lm9uKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbiA/ICdkZXNlbGVjdF9ub2RlLmpzdHJlZScgOiAndW5jaGVja19ub2RlLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRcdFx0XHRcdG9iaiA9IGRhdGEubm9kZSxcblx0XHRcdFx0XHRcdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSksXG5cdFx0XHRcdFx0XHRcdFx0aSwgaiwgdG1wLCBzID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLCB0ID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdGN1ciA9IHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQsIHNlbCA9IHt9LFxuXHRcdFx0XHRcdFx0XHRcdHN0aWxsU2VsZWN0ZWRJZHMgPSBbXSxcblx0XHRcdFx0XHRcdFx0XHRhbGxJZHMgPSBvYmouY2hpbGRyZW5fZC5jb25jYXQob2JqLmlkKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBhcHBseSBkb3duXG5cdFx0XHRcdFx0XHRcdGlmKHMuaW5kZXhPZignZG93bicpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBzZWxlY3RlZElkcyA9IHRoaXMuX2Nhc2NhZGVfbmV3X2NoZWNrZWRfc3RhdGUob2JqLmlkLCBmYWxzZSk7XG5cblx0XHRcdFx0XHRcdFx0XHRjdXIgPSAkLnZha2F0YS5hcnJheV9maWx0ZXIoY3VyLCBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFsbElkcy5pbmRleE9mKGlkKSA9PT0gLTEgfHwgc2VsZWN0ZWRJZHMuaW5kZXhPZihpZCkgPiAtMTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIG9ubHkgYXBwbHkgdXAgaWYgY2FzY2FkZSB1cCBpcyBlbmFibGVkIGFuZCBpZiB0aGlzIG5vZGUgaXMgbm90IHNlbGVjdGVkXG5cdFx0XHRcdFx0XHRcdC8vIChpZiBhbGwgY2hpbGQgbm9kZXMgYXJlIGRpc2FibGVkIGFuZCBjYXNjYWRlX3RvX2Rpc2FibGVkID09PSBmYWxzZSB0aGVuIHRoaXMgbm9kZSB3aWxsIHRpbGwgYmUgc2VsZWN0ZWQpLlxuXHRcdFx0XHRcdFx0XHRpZihzLmluZGV4T2YoJ3VwJykgIT09IC0xICYmIGN1ci5pbmRleE9mKG9iai5pZCkgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLl9tb2RlbC5kYXRhW29iai5wYXJlbnRzW2ldXTtcblx0XHRcdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5vcmlnaW5hbCAmJiB0bXAub3JpZ2luYWwuc3RhdGUgJiYgdG1wLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKG9iai5wYXJlbnRzW2ldLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLnJlbW92ZUNsYXNzKHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0Y3VyID0gJC52YWthdGEuYXJyYXlfZmlsdGVyKGN1ciwgZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBvYmoucGFyZW50cy5pbmRleE9mKGlkKSA9PT0gLTE7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkID0gY3VyO1xuXHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLmluZGV4T2YoJ3VwJykgIT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHRcdC5vbignZGVsZXRlX25vZGUuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0XHQvLyBhcHBseSB1cCAod2hvbGUgaGFuZGxlcilcblx0XHRcdFx0XHRcdFx0dmFyIHAgPSB0aGlzLmdldF9ub2RlKGRhdGEucGFyZW50KSxcblx0XHRcdFx0XHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0XHRcdFx0XHRpLCBqLCBjLCB0bXAsIHQgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb247XG5cdFx0XHRcdFx0XHRcdHdoaWxlKHAgJiYgcC5pZCAhPT0gJC5qc3RyZWUucm9vdCAmJiAhcC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSkge1xuXHRcdFx0XHRcdFx0XHRcdGMgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHAuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjICs9IG1bcC5jaGlsZHJlbltpXV0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF07XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmKGogPiAwICYmIGMgPT09IGopIHtcblx0XHRcdFx0XHRcdFx0XHRcdHAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZC5wdXNoKHAuaWQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShwLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3ModCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cCA9IHRoaXMuZ2V0X25vZGUocC5wYXJlbnQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0XHQub24oJ21vdmVfbm9kZS5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGFwcGx5IHVwICh3aG9sZSBoYW5kbGVyKVxuXHRcdFx0XHRcdFx0XHR2YXIgaXNfbXVsdGkgPSBkYXRhLmlzX211bHRpLFxuXHRcdFx0XHRcdFx0XHRcdG9sZF9wYXIgPSBkYXRhLm9sZF9wYXJlbnQsXG5cdFx0XHRcdFx0XHRcdFx0bmV3X3BhciA9IHRoaXMuZ2V0X25vZGUoZGF0YS5wYXJlbnQpLFxuXHRcdFx0XHRcdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRcdFx0XHRcdHAsIGMsIGksIGosIHRtcCwgdCA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbjtcblx0XHRcdFx0XHRcdFx0aWYoIWlzX211bHRpKSB7XG5cdFx0XHRcdFx0XHRcdFx0cCA9IHRoaXMuZ2V0X25vZGUob2xkX3Bhcik7XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUocCAmJiBwLmlkICE9PSAkLmpzdHJlZS5yb290ICYmICFwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHAuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGMgKz0gbVtwLmNoaWxkcmVuW2ldXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGlmKGogPiAwICYmIGMgPT09IGopIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQucHVzaChwLmlkKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShwLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuYXR0cignYXJpYS1zZWxlY3RlZCcsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdHAgPSB0aGlzLmdldF9ub2RlKHAucGFyZW50KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cCA9IG5ld19wYXI7XG5cdFx0XHRcdFx0XHRcdHdoaWxlKHAgJiYgcC5pZCAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0XHRcdGMgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHAuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjICs9IG1bcC5jaGlsZHJlbltpXV0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF07XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmKGMgPT09IGopIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKCFwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLnB1c2gocC5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUocCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcyh0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYocC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQgPSAkLnZha2F0YS5hcnJheV9yZW1vdmVfaXRlbSh0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLCBwLmlkKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShwLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuYXR0cignYXJpYS1zZWxlY3RlZCcsIGZhbHNlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5yZW1vdmVDbGFzcyh0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHAgPSB0aGlzLmdldF9ub2RlKHAucGFyZW50KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogZ2V0IGFuIGFycmF5IG9mIGFsbCBub2RlcyB3aG9zZSBzdGF0ZSBpcyBcInVuZGV0ZXJtaW5lZFwiXG5cdFx0ICogQG5hbWUgZ2V0X3VuZGV0ZXJtaW5lZChbZnVsbF0pXG5cdFx0ICogQHBhcmFtICB7Ym9vbGVhbn0gZnVsbDogaWYgc2V0IHRvIGB0cnVlYCB0aGUgcmV0dXJuZWQgYXJyYXkgd2lsbCBjb25zaXN0IG9mIHRoZSBmdWxsIG5vZGUgb2JqZWN0cywgb3RoZXJ3aXNlIC0gb25seSBJRHMgd2lsbCBiZSByZXR1cm5lZFxuXHRcdCAqIEByZXR1cm4ge0FycmF5fVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmdldF91bmRldGVybWluZWQgPSBmdW5jdGlvbiAoZnVsbCkge1xuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZS5pbmRleE9mKCd1bmRldGVybWluZWQnKSA9PT0gLTEpIHtcblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGksIGosIGssIGwsIG8gPSB7fSwgbSA9IHRoaXMuX21vZGVsLmRhdGEsIHQgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24sIHMgPSB0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLCBwID0gW10sIHR0ID0gdGhpcywgciA9IFtdO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYobVtzW2ldXSAmJiBtW3NbaV1dLnBhcmVudHMpIHtcblx0XHRcdFx0XHRmb3IoayA9IDAsIGwgPSBtW3NbaV1dLnBhcmVudHMubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0XHRpZihvW21bc1tpXV0ucGFyZW50c1trXV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKG1bc1tpXV0ucGFyZW50c1trXSAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0XHRvW21bc1tpXV0ucGFyZW50c1trXV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRwLnB1c2gobVtzW2ldXS5wYXJlbnRzW2tdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIGF0dGVtcHQgZm9yIHNlcnZlciBzaWRlIHVuZGV0ZXJtaW5lZCBzdGF0ZVxuXHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtY2xvc2VkJykubm90KCc6aGFzKC5qc3RyZWUtY2hpbGRyZW4pJylcblx0XHRcdFx0LmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciB0bXAgPSB0dC5nZXRfbm9kZSh0aGlzKSwgdG1wMjtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZighdG1wKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKCF0bXAuc3RhdGUubG9hZGVkKSB7XG5cdFx0XHRcdFx0XHRpZih0bXAub3JpZ2luYWwgJiYgdG1wLm9yaWdpbmFsLnN0YXRlICYmIHRtcC5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQgJiYgdG1wLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHRpZihvW3RtcC5pZF0gPT09IHVuZGVmaW5lZCAmJiB0bXAuaWQgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdFx0XHRvW3RtcC5pZF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdHAucHVzaCh0bXAuaWQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGZvcihrID0gMCwgbCA9IHRtcC5wYXJlbnRzLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdFx0XHRcdGlmKG9bdG1wLnBhcmVudHNba11dID09PSB1bmRlZmluZWQgJiYgdG1wLnBhcmVudHNba10gIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG9bdG1wLnBhcmVudHNba11dID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHAucHVzaCh0bXAucGFyZW50c1trXSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHRtcDIgPSBtW3RtcC5jaGlsZHJlbl9kW2ldXTtcblx0XHRcdFx0XHRcdFx0aWYoIXRtcDIuc3RhdGUubG9hZGVkICYmIHRtcDIub3JpZ2luYWwgJiYgdG1wMi5vcmlnaW5hbC5zdGF0ZSAmJiB0bXAyLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCAmJiB0bXAyLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmKG9bdG1wMi5pZF0gPT09IHVuZGVmaW5lZCAmJiB0bXAyLmlkICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvW3RtcDIuaWRdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdHAucHVzaCh0bXAyLmlkKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gdG1wMi5wYXJlbnRzLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYob1t0bXAyLnBhcmVudHNba11dID09PSB1bmRlZmluZWQgJiYgdG1wMi5wYXJlbnRzW2tdICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9bdG1wMi5wYXJlbnRzW2tdXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHAucHVzaCh0bXAyLnBhcmVudHNba10pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRmb3IgKGkgPSAwLCBqID0gcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYoIW1bcFtpXV0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0pIHtcblx0XHRcdFx0XHRyLnB1c2goZnVsbCA/IG1bcFtpXV0gOiBwW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBzZXQgdGhlIHVuZGV0ZXJtaW5lZCBzdGF0ZSB3aGVyZSBhbmQgaWYgbmVjZXNzYXJ5LiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfdW5kZXRlcm1pbmVkKClcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5fdW5kZXRlcm1pbmVkID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYodGhpcy5lbGVtZW50ID09PSBudWxsKSB7IHJldHVybjsgfVxuXHRcdFx0dmFyIHAgPSB0aGlzLmdldF91bmRldGVybWluZWQoZmFsc2UpLCBpLCBqLCBzO1xuXG5cdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS11bmRldGVybWluZWQnKS5yZW1vdmVDbGFzcygnanN0cmVlLXVuZGV0ZXJtaW5lZCcpO1xuXHRcdFx0Zm9yIChpID0gMCwgaiA9IHAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdHMgPSB0aGlzLmdldF9ub2RlKHBbaV0sIHRydWUpO1xuXHRcdFx0XHRpZihzICYmIHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cy5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5jaGlsZHJlbignLmpzdHJlZS1jaGVja2JveCcpLmFkZENsYXNzKCdqc3RyZWUtdW5kZXRlcm1pbmVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHRoaXMucmVkcmF3X25vZGUgPSBmdW5jdGlvbihvYmosIGRlZXAsIGlzX2NhbGxiYWNrLCBmb3JjZV9yZW5kZXIpIHtcblx0XHRcdG9iaiA9IHBhcmVudC5yZWRyYXdfbm9kZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0aWYob2JqKSB7XG5cdFx0XHRcdHZhciBpLCBqLCB0bXAgPSBudWxsLCBpY29uID0gbnVsbDtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYob2JqLmNoaWxkTm9kZXNbaV0gJiYgb2JqLmNoaWxkTm9kZXNbaV0uY2xhc3NOYW1lICYmIG9iai5jaGlsZE5vZGVzW2ldLmNsYXNzTmFtZS5pbmRleE9mKFwianN0cmVlLWFuY2hvclwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdHRtcCA9IG9iai5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHRtcCkge1xuXHRcdFx0XHRcdGlmKCF0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24gJiYgdGhpcy5fbW9kZWwuZGF0YVtvYmouaWRdLnN0YXRlLmNoZWNrZWQpIHsgdG1wLmNsYXNzTmFtZSArPSAnIGpzdHJlZS1jaGVja2VkJzsgfVxuXHRcdFx0XHRcdGljb24gPSBfaS5jbG9uZU5vZGUoZmFsc2UpO1xuXHRcdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbb2JqLmlkXS5zdGF0ZS5jaGVja2JveF9kaXNhYmxlZCkgeyBpY29uLmNsYXNzTmFtZSArPSAnIGpzdHJlZS1jaGVja2JveC1kaXNhYmxlZCc7IH1cblx0XHRcdFx0XHR0bXAuaW5zZXJ0QmVmb3JlKGljb24sIHRtcC5jaGlsZE5vZGVzWzBdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoIWlzX2NhbGxiYWNrICYmIHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZS5pbmRleE9mKCd1bmRldGVybWluZWQnKSAhPT0gLTEpIHtcblx0XHRcdFx0aWYodGhpcy5fZGF0YS5jaGVja2JveC51dG8pIHsgY2xlYXJUaW1lb3V0KHRoaXMuX2RhdGEuY2hlY2tib3gudXRvKTsgfVxuXHRcdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnV0byA9IHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLl91bmRldGVybWluZWQsIHRoaXMpLCA1MCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogc2hvdyB0aGUgbm9kZSBjaGVja2JveCBpY29uc1xuXHRcdCAqIEBuYW1lIHNob3dfY2hlY2tib3hlcygpXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuc2hvd19jaGVja2JveGVzID0gZnVuY3Rpb24gKCkgeyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmNoZWNrYm94ZXMgPSB0cnVlOyB0aGlzLmdldF9jb250YWluZXJfdWwoKS5yZW1vdmVDbGFzcyhcImpzdHJlZS1uby1jaGVja2JveGVzXCIpOyB9O1xuXHRcdC8qKlxuXHRcdCAqIGhpZGUgdGhlIG5vZGUgY2hlY2tib3ggaWNvbnNcblx0XHQgKiBAbmFtZSBoaWRlX2NoZWNrYm94ZXMoKVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmhpZGVfY2hlY2tib3hlcyA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5jaGVja2JveGVzID0gZmFsc2U7IHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmFkZENsYXNzKFwianN0cmVlLW5vLWNoZWNrYm94ZXNcIik7IH07XG5cdFx0LyoqXG5cdFx0ICogdG9nZ2xlIHRoZSBub2RlIGljb25zXG5cdFx0ICogQG5hbWUgdG9nZ2xlX2NoZWNrYm94ZXMoKVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLnRvZ2dsZV9jaGVja2JveGVzID0gZnVuY3Rpb24gKCkgeyBpZih0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmNoZWNrYm94ZXMpIHsgdGhpcy5oaWRlX2NoZWNrYm94ZXMoKTsgfSBlbHNlIHsgdGhpcy5zaG93X2NoZWNrYm94ZXMoKTsgfSB9O1xuXHRcdC8qKlxuXHRcdCAqIGNoZWNrcyBpZiBhIG5vZGUgaXMgaW4gYW4gdW5kZXRlcm1pbmVkIHN0YXRlXG5cdFx0ICogQG5hbWUgaXNfdW5kZXRlcm1pbmVkKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHR0aGlzLmlzX3VuZGV0ZXJtaW5lZCA9IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHZhciBzID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLCBpLCBqLCB0ID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uLCBkID0gdGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCwgbSA9IHRoaXMuX21vZGVsLmRhdGE7XG5cdFx0XHRpZighb2JqIHx8IG9iai5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9PT0gdHJ1ZSB8fCBzLmluZGV4T2YoJ3VuZGV0ZXJtaW5lZCcpID09PSAtMSB8fCAocy5pbmRleE9mKCdkb3duJykgPT09IC0xICYmIHMuaW5kZXhPZigndXAnKSA9PT0gLTEpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKCFvYmouc3RhdGUubG9hZGVkICYmIG9iai5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQgPT09IHRydWUpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYoJC5pbkFycmF5KG9iai5jaGlsZHJlbl9kW2ldLCBkKSAhPT0gLTEgfHwgKCFtW29iai5jaGlsZHJlbl9kW2ldXS5zdGF0ZS5sb2FkZWQgJiYgbVtvYmouY2hpbGRyZW5fZFtpXV0ub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkKSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBkaXNhYmxlIGEgbm9kZSdzIGNoZWNrYm94XG5cdFx0ICogQG5hbWUgZGlzYWJsZV9jaGVja2JveChvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIGFuIGFycmF5IGNhbiBiZSB1c2VkIHRvb1xuXHRcdCAqIEB0cmlnZ2VyIGRpc2FibGVfY2hlY2tib3guanN0cmVlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuZGlzYWJsZV9jaGVja2JveCA9IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdHZhciB0MSwgdDIsIGRvbTtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmRpc2FibGVfY2hlY2tib3gob2JqW3QxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZighb2JqLnN0YXRlLmNoZWNrYm94X2Rpc2FibGVkKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5jaGVja2JveF9kaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRcdGlmKGRvbSAmJiBkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZG9tLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmNoaWxkcmVuKCcuanN0cmVlLWNoZWNrYm94JykuYWRkQ2xhc3MoJ2pzdHJlZS1jaGVja2JveC1kaXNhYmxlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlJ3MgY2hlY2tib3ggaXMgZGlzYWJsZWRcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIGRpc2FibGVfY2hlY2tib3guanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignZGlzYWJsZV9jaGVja2JveCcsIHsgJ25vZGUnIDogb2JqIH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogZW5hYmxlIGEgbm9kZSdzIGNoZWNrYm94XG5cdFx0ICogQG5hbWUgZW5hYmxlX2NoZWNrYm94KG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogYW4gYXJyYXkgY2FuIGJlIHVzZWQgdG9vXG5cdFx0ICogQHRyaWdnZXIgZW5hYmxlX2NoZWNrYm94LmpzdHJlZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmVuYWJsZV9jaGVja2JveCA9IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdHZhciB0MSwgdDIsIGRvbTtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmVuYWJsZV9jaGVja2JveChvYmpbdDFdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKG9iai5zdGF0ZS5jaGVja2JveF9kaXNhYmxlZCkge1xuXHRcdFx0XHRvYmouc3RhdGUuY2hlY2tib3hfZGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYoZG9tICYmIGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRkb20uY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuY2hpbGRyZW4oJy5qc3RyZWUtY2hlY2tib3gnKS5yZW1vdmVDbGFzcygnanN0cmVlLWNoZWNrYm94LWRpc2FibGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUncyBjaGVja2JveCBpcyBlbmFibGVkXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBlbmFibGVfY2hlY2tib3guanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignZW5hYmxlX2NoZWNrYm94JywgeyAnbm9kZScgOiBvYmogfSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHRoaXMuYWN0aXZhdGVfbm9kZSA9IGZ1bmN0aW9uIChvYmosIGUpIHtcblx0XHRcdGlmKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdqc3RyZWUtY2hlY2tib3gtZGlzYWJsZWQnKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24gJiYgKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gud2hvbGVfbm9kZSB8fCAkKGUudGFyZ2V0KS5oYXNDbGFzcygnanN0cmVlLWNoZWNrYm94JykpKSB7XG5cdFx0XHRcdGUuY3RybEtleSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24gfHwgKCF0aGlzLnNldHRpbmdzLmNoZWNrYm94Lndob2xlX25vZGUgJiYgISQoZS50YXJnZXQpLmhhc0NsYXNzKCdqc3RyZWUtY2hlY2tib3gnKSkpIHtcblx0XHRcdFx0cmV0dXJuIHBhcmVudC5hY3RpdmF0ZV9ub2RlLmNhbGwodGhpcywgb2JqLCBlKTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuaXNfZGlzYWJsZWQob2JqKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLmlzX2NoZWNrZWQob2JqKSkge1xuXHRcdFx0XHR0aGlzLnVuY2hlY2tfbm9kZShvYmosIGUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuY2hlY2tfbm9kZShvYmosIGUpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy50cmlnZ2VyKCdhY3RpdmF0ZV9ub2RlJywgeyAnbm9kZScgOiB0aGlzLmdldF9ub2RlKG9iaikgfSk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIENhc2NhZGVzIGNoZWNrZWQgc3RhdGUgdG8gYSBub2RlIGFuZCBhbGwgaXRzIGRlc2NlbmRhbnRzLiBUaGlzIGZ1bmN0aW9uIGRvZXMgTk9UIGFmZmVjdCBoaWRkZW4gYW5kIGRpc2FibGVkIG5vZGVzIChvciB0aGVpciBkZXNjZW5kYW50cykuXG5cdFx0ICogSG93ZXZlciBpZiB0aGVzZSB1bmFmZmVjdGVkIG5vZGVzIGFyZSBhbHJlYWR5IHNlbGVjdGVkIHRoZWlyIGlkcyB3aWxsIGJlIGluY2x1ZGVkIGluIHRoZSByZXR1cm5lZCBhcnJheS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBpZCB0aGUgbm9kZSBJRFxuXHRcdCAqIEBwYXJhbSB7Ym9vbH0gY2hlY2tlZFN0YXRlIHNob3VsZCB0aGUgbm9kZXMgYmUgY2hlY2tlZCBvciBub3Rcblx0XHQgKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IG9mIGFsbCBub2RlIGlkJ3MgKGluIHRoaXMgdHJlZSBicmFuY2gpIHRoYXQgYXJlIGNoZWNrZWQuXG5cdFx0ICovXG5cdFx0dGhpcy5fY2FzY2FkZV9uZXdfY2hlY2tlZF9zdGF0ZSA9IGZ1bmN0aW9uIChpZCwgY2hlY2tlZFN0YXRlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgdCA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbjtcblx0XHRcdHZhciBub2RlID0gdGhpcy5fbW9kZWwuZGF0YVtpZF07XG5cdFx0XHR2YXIgc2VsZWN0ZWROb2RlSWRzID0gW107XG5cdFx0XHR2YXIgc2VsZWN0ZWRDaGlsZHJlbklkcyA9IFtdLCBpLCBqLCBzZWxlY3RlZENoaWxkSWRzO1xuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCh0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGVfdG9fZGlzYWJsZWQgfHwgIW5vZGUuc3RhdGUuZGlzYWJsZWQpICYmXG5cdFx0XHRcdCh0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGVfdG9faGlkZGVuIHx8ICFub2RlLnN0YXRlLmhpZGRlbilcblx0XHRcdCkge1xuXHRcdFx0XHQvL0ZpcnN0IHRyeSBhbmQgY2hlY2svdW5jaGVjayB0aGUgY2hpbGRyZW5cblx0XHRcdFx0aWYgKG5vZGUuY2hpbGRyZW4pIHtcblx0XHRcdFx0XHRmb3IgKGkgPSAwLCBqID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdHZhciBjaGlsZElkID0gbm9kZS5jaGlsZHJlbltpXTtcblx0XHRcdFx0XHRcdHNlbGVjdGVkQ2hpbGRJZHMgPSBzZWxmLl9jYXNjYWRlX25ld19jaGVja2VkX3N0YXRlKGNoaWxkSWQsIGNoZWNrZWRTdGF0ZSk7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZE5vZGVJZHMgPSBzZWxlY3RlZE5vZGVJZHMuY29uY2F0KHNlbGVjdGVkQ2hpbGRJZHMpO1xuXHRcdFx0XHRcdFx0aWYgKHNlbGVjdGVkQ2hpbGRJZHMuaW5kZXhPZihjaGlsZElkKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGVjdGVkQ2hpbGRyZW5JZHMucHVzaChjaGlsZElkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgZG9tID0gc2VsZi5nZXRfbm9kZShub2RlLCB0cnVlKTtcblxuXHRcdFx0XHQvL0Egbm9kZSdzIHN0YXRlIGlzIHVuZGV0ZXJtaW5lZCBpZiBzb21lIGJ1dCBub3QgYWxsIG9mIGl0J3MgY2hpbGRyZW4gYXJlIGNoZWNrZWQvc2VsZWN0ZWQgLlxuXHRcdFx0XHR2YXIgdW5kZXRlcm1pbmVkID0gc2VsZWN0ZWRDaGlsZHJlbklkcy5sZW5ndGggPiAwICYmIHNlbGVjdGVkQ2hpbGRyZW5JZHMubGVuZ3RoIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7XG5cblx0XHRcdFx0aWYobm9kZS5vcmlnaW5hbCAmJiBub2RlLm9yaWdpbmFsLnN0YXRlICYmIG5vZGUub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkKSB7XG5cdFx0XHRcdFx0bm9kZS5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQgPSB1bmRldGVybWluZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL0lmIGEgbm9kZSBpcyB1bmRldGVybWluZWQgdGhlbiByZW1vdmUgc2VsZWN0ZWQgY2xhc3Ncblx0XHRcdFx0aWYgKHVuZGV0ZXJtaW5lZCkge1xuXHRcdFx0XHRcdG5vZGUuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSBmYWxzZTtcblx0XHRcdFx0XHRkb20uYXR0cignYXJpYS1zZWxlY3RlZCcsIGZhbHNlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5yZW1vdmVDbGFzcyh0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vT3RoZXJ3aXNlLCBpZiB0aGUgY2hlY2tlZFN0YXRlID09PSB0cnVlIChpLmUuIHRoZSBub2RlIGlzIGJlaW5nIGNoZWNrZWQgbm93KSBhbmQgYWxsIG9mIHRoZSBub2RlJ3MgY2hpbGRyZW4gYXJlIGNoZWNrZWQgKGlmIGl0IGhhcyBhbnkgY2hpbGRyZW4pLFxuXHRcdFx0XHQvL2NoZWNrIHRoZSBub2RlIGFuZCBzdHlsZSBpdCBjb3JyZWN0bHkuXG5cdFx0XHRcdGVsc2UgaWYgKGNoZWNrZWRTdGF0ZSAmJiBzZWxlY3RlZENoaWxkcmVuSWRzLmxlbmd0aCA9PT0gbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRub2RlLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gY2hlY2tlZFN0YXRlO1xuXHRcdFx0XHRcdHNlbGVjdGVkTm9kZUlkcy5wdXNoKG5vZGUuaWQpO1xuXG5cdFx0XHRcdFx0ZG9tLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcyh0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdG5vZGUuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSBmYWxzZTtcblx0XHRcdFx0XHRkb20uYXR0cignYXJpYS1zZWxlY3RlZCcsIGZhbHNlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5yZW1vdmVDbGFzcyh0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2VsZWN0ZWRDaGlsZElkcyA9IHRoaXMuZ2V0X2NoZWNrZWRfZGVzY2VuZGFudHMoaWQpO1xuXG5cdFx0XHRcdGlmIChub2RlLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdKSB7XG5cdFx0XHRcdFx0c2VsZWN0ZWRDaGlsZElkcy5wdXNoKG5vZGUuaWQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2VsZWN0ZWROb2RlSWRzID0gc2VsZWN0ZWROb2RlSWRzLmNvbmNhdChzZWxlY3RlZENoaWxkSWRzKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZUlkcztcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogR2V0cyBpZHMgb2Ygbm9kZXMgc2VsZWN0ZWQgaW4gYnJhbmNoIChvZiB0cmVlKSBzcGVjaWZpZWQgYnkgaWQgKGRvZXMgbm90IGluY2x1ZGUgdGhlIG5vZGUgc3BlY2lmaWVkIGJ5IGlkKVxuXHRcdCAqIEBuYW1lIGdldF9jaGVja2VkX2Rlc2NlbmRhbnRzKG9iailcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaWQgdGhlIG5vZGUgSURcblx0XHQgKiBAcmV0dXJuIHtBcnJheX0gYXJyYXkgb2YgSURzXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuZ2V0X2NoZWNrZWRfZGVzY2VuZGFudHMgPSBmdW5jdGlvbiAoaWQpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciB0ID0gc2VsZi5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uO1xuXHRcdFx0dmFyIG5vZGUgPSBzZWxmLl9tb2RlbC5kYXRhW2lkXTtcblxuXHRcdFx0cmV0dXJuICQudmFrYXRhLmFycmF5X2ZpbHRlcihub2RlLmNoaWxkcmVuX2QsIGZ1bmN0aW9uKF9pZCkge1xuXHRcdFx0XHRyZXR1cm4gc2VsZi5fbW9kZWwuZGF0YVtfaWRdLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdO1xuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrIGEgbm9kZSAob25seSBpZiB0aWVfc2VsZWN0aW9uIGluIGNoZWNrYm94IHNldHRpbmdzIGlzIGZhbHNlLCBvdGhlcndpc2Ugc2VsZWN0X25vZGUgd2lsbCBiZSBjYWxsZWQgaW50ZXJuYWxseSlcblx0XHQgKiBAbmFtZSBjaGVja19ub2RlKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogYW4gYXJyYXkgY2FuIGJlIHVzZWQgdG8gY2hlY2sgbXVsdGlwbGUgbm9kZXNcblx0XHQgKiBAdHJpZ2dlciBjaGVja19ub2RlLmpzdHJlZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmNoZWNrX25vZGUgPSBmdW5jdGlvbiAob2JqLCBlKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHsgcmV0dXJuIHRoaXMuc2VsZWN0X25vZGUob2JqLCBmYWxzZSwgdHJ1ZSwgZSk7IH1cblx0XHRcdHZhciBkb20sIHQxLCB0MiwgdGg7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5jaGVja19ub2RlKG9ialt0MV0sIGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYoIW9iai5zdGF0ZS5jaGVja2VkKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5jaGVja2VkID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZC5wdXNoKG9iai5pZCk7XG5cdFx0XHRcdGlmKGRvbSAmJiBkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZG9tLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKCdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIGNoZWNrZWQgKG9ubHkgaWYgdGllX3NlbGVjdGlvbiBpbiBjaGVja2JveCBzZXR0aW5ncyBpcyBmYWxzZSlcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIGNoZWNrX25vZGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIGV2ZW50IChpZiBhbnkpIHRoYXQgdHJpZ2dlcmVkIHRoaXMgY2hlY2tfbm9kZVxuXHRcdFx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoZWNrX25vZGUnLCB7ICdub2RlJyA6IG9iaiwgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQsICdldmVudCcgOiBlIH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogdW5jaGVjayBhIG5vZGUgKG9ubHkgaWYgdGllX3NlbGVjdGlvbiBpbiBjaGVja2JveCBzZXR0aW5ncyBpcyBmYWxzZSwgb3RoZXJ3aXNlIGRlc2VsZWN0X25vZGUgd2lsbCBiZSBjYWxsZWQgaW50ZXJuYWxseSlcblx0XHQgKiBAbmFtZSB1bmNoZWNrX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiBhbiBhcnJheSBjYW4gYmUgdXNlZCB0byB1bmNoZWNrIG11bHRpcGxlIG5vZGVzXG5cdFx0ICogQHRyaWdnZXIgdW5jaGVja19ub2RlLmpzdHJlZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLnVuY2hlY2tfbm9kZSA9IGZ1bmN0aW9uIChvYmosIGUpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikgeyByZXR1cm4gdGhpcy5kZXNlbGVjdF9ub2RlKG9iaiwgZmFsc2UsIGUpOyB9XG5cdFx0XHR2YXIgdDEsIHQyLCBkb207XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy51bmNoZWNrX25vZGUob2JqW3QxXSwgZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZihvYmouc3RhdGUuY2hlY2tlZCkge1xuXHRcdFx0XHRvYmouc3RhdGUuY2hlY2tlZCA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkID0gJC52YWthdGEuYXJyYXlfcmVtb3ZlX2l0ZW0odGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCwgb2JqLmlkKTtcblx0XHRcdFx0aWYoZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdGRvbS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5yZW1vdmVDbGFzcygnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyB1bmNoZWNrZWQgKG9ubHkgaWYgdGllX3NlbGVjdGlvbiBpbiBjaGVja2JveCBzZXR0aW5ncyBpcyBmYWxzZSlcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIHVuY2hlY2tfbm9kZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgZXZlbnQgKGlmIGFueSkgdGhhdCB0cmlnZ2VyZWQgdGhpcyB1bmNoZWNrX25vZGVcblx0XHRcdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCd1bmNoZWNrX25vZGUnLCB7ICdub2RlJyA6IG9iaiwgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQsICdldmVudCcgOiBlIH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogY2hlY2tzIGFsbCBub2RlcyBpbiB0aGUgdHJlZSAob25seSBpZiB0aWVfc2VsZWN0aW9uIGluIGNoZWNrYm94IHNldHRpbmdzIGlzIGZhbHNlLCBvdGhlcndpc2Ugc2VsZWN0X2FsbCB3aWxsIGJlIGNhbGxlZCBpbnRlcm5hbGx5KVxuXHRcdCAqIEBuYW1lIGNoZWNrX2FsbCgpXG5cdFx0ICogQHRyaWdnZXIgY2hlY2tfYWxsLmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5jaGVja19hbGwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHsgcmV0dXJuIHRoaXMuc2VsZWN0X2FsbCgpOyB9XG5cdFx0XHR2YXIgdG1wID0gdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZC5jb25jYXQoW10pLCBpLCBqO1xuXHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCA9IHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF0uY2hpbGRyZW5fZC5jb25jYXQoKTtcblx0XHRcdGZvcihpID0gMCwgaiA9IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZFtpXV0pIHtcblx0XHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW3RoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWRbaV1dLnN0YXRlLmNoZWNrZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnJlZHJhdyh0cnVlKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYWxsIG5vZGVzIGFyZSBjaGVja2VkIChvbmx5IGlmIHRpZV9zZWxlY3Rpb24gaW4gY2hlY2tib3ggc2V0dGluZ3MgaXMgZmFsc2UpXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGNoZWNrX2FsbC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NoZWNrX2FsbCcsIHsgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQgfSk7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiB1bmNoZWNrIGFsbCBjaGVja2VkIG5vZGVzIChvbmx5IGlmIHRpZV9zZWxlY3Rpb24gaW4gY2hlY2tib3ggc2V0dGluZ3MgaXMgZmFsc2UsIG90aGVyd2lzZSBkZXNlbGVjdF9hbGwgd2lsbCBiZSBjYWxsZWQgaW50ZXJuYWxseSlcblx0XHQgKiBAbmFtZSB1bmNoZWNrX2FsbCgpXG5cdFx0ICogQHRyaWdnZXIgdW5jaGVja19hbGwuanN0cmVlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMudW5jaGVja19hbGwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHsgcmV0dXJuIHRoaXMuZGVzZWxlY3RfYWxsKCk7IH1cblx0XHRcdHZhciB0bXAgPSB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLmNvbmNhdChbXSksIGksIGo7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW3RoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWRbaV1dKSB7XG5cdFx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVt0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkW2ldXS5zdGF0ZS5jaGVja2VkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQgPSBbXTtcblx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLWNoZWNrZWQnKS5yZW1vdmVDbGFzcygnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYWxsIG5vZGVzIGFyZSB1bmNoZWNrZWQgKG9ubHkgaWYgdGllX3NlbGVjdGlvbiBpbiBjaGVja2JveCBzZXR0aW5ncyBpcyBmYWxzZSlcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgdW5jaGVja19hbGwuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgcHJldmlvdXMgc2VsZWN0aW9uXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCd1bmNoZWNrX2FsbCcsIHsgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQsICdub2RlJyA6IHRtcCB9KTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIGNoZWNrcyBpZiBhIG5vZGUgaXMgY2hlY2tlZCAoaWYgdGllX3NlbGVjdGlvbiBpcyBvbiBpbiB0aGUgc2V0dGluZ3MgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgc2FtZSBhcyBpc19zZWxlY3RlZClcblx0XHQgKiBAbmFtZSBpc19jaGVja2VkKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gIG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuaXNfY2hlY2tlZCA9IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikgeyByZXR1cm4gdGhpcy5pc19zZWxlY3RlZChvYmopOyB9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHJldHVybiBvYmouc3RhdGUuY2hlY2tlZDtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIGdldCBhbiBhcnJheSBvZiBhbGwgY2hlY2tlZCBub2RlcyAoaWYgdGllX3NlbGVjdGlvbiBpcyBvbiBpbiB0aGUgc2V0dGluZ3MgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgc2FtZSBhcyBnZXRfc2VsZWN0ZWQpXG5cdFx0ICogQG5hbWUgZ2V0X2NoZWNrZWQoW2Z1bGxdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgZnVsbCBpZiBzZXQgdG8gYHRydWVgIHRoZSByZXR1cm5lZCBhcnJheSB3aWxsIGNvbnNpc3Qgb2YgdGhlIGZ1bGwgbm9kZSBvYmplY3RzLCBvdGhlcndpc2UgLSBvbmx5IElEcyB3aWxsIGJlIHJldHVybmVkXG5cdFx0ICogQHJldHVybiB7QXJyYXl9XG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuZ2V0X2NoZWNrZWQgPSBmdW5jdGlvbiAoZnVsbCkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7IHJldHVybiB0aGlzLmdldF9zZWxlY3RlZChmdWxsKTsgfVxuXHRcdFx0cmV0dXJuIGZ1bGwgPyAkLm1hcCh0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLCAkLnByb3h5KGZ1bmN0aW9uIChpKSB7IHJldHVybiB0aGlzLmdldF9ub2RlKGkpOyB9LCB0aGlzKSkgOiB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLnNsaWNlKCk7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBnZXQgYW4gYXJyYXkgb2YgYWxsIHRvcCBsZXZlbCBjaGVja2VkIG5vZGVzIChpZ25vcmluZyBjaGlsZHJlbiBvZiBjaGVja2VkIG5vZGVzKSAoaWYgdGllX3NlbGVjdGlvbiBpcyBvbiBpbiB0aGUgc2V0dGluZ3MgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgc2FtZSBhcyBnZXRfdG9wX3NlbGVjdGVkKVxuXHRcdCAqIEBuYW1lIGdldF90b3BfY2hlY2tlZChbZnVsbF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICBmdWxsIGlmIHNldCB0byBgdHJ1ZWAgdGhlIHJldHVybmVkIGFycmF5IHdpbGwgY29uc2lzdCBvZiB0aGUgZnVsbCBub2RlIG9iamVjdHMsIG90aGVyd2lzZSAtIG9ubHkgSURzIHdpbGwgYmUgcmV0dXJuZWRcblx0XHQgKiBAcmV0dXJuIHtBcnJheX1cblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5nZXRfdG9wX2NoZWNrZWQgPSBmdW5jdGlvbiAoZnVsbCkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7IHJldHVybiB0aGlzLmdldF90b3Bfc2VsZWN0ZWQoZnVsbCk7IH1cblx0XHRcdHZhciB0bXAgPSB0aGlzLmdldF9jaGVja2VkKHRydWUpLFxuXHRcdFx0XHRvYmogPSB7fSwgaSwgaiwgaywgbDtcblx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0b2JqW3RtcFtpXS5pZF0gPSB0bXBbaV07XG5cdFx0XHR9XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGZvcihrID0gMCwgbCA9IHRtcFtpXS5jaGlsZHJlbl9kLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdGlmKG9ialt0bXBbaV0uY2hpbGRyZW5fZFtrXV0pIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSBvYmpbdG1wW2ldLmNoaWxkcmVuX2Rba11dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dG1wID0gW107XG5cdFx0XHRmb3IoaSBpbiBvYmopIHtcblx0XHRcdFx0aWYob2JqLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0dG1wLnB1c2goaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmdWxsID8gJC5tYXAodG1wLCAkLnByb3h5KGZ1bmN0aW9uIChpKSB7IHJldHVybiB0aGlzLmdldF9ub2RlKGkpOyB9LCB0aGlzKSkgOiB0bXA7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBnZXQgYW4gYXJyYXkgb2YgYWxsIGJvdHRvbSBsZXZlbCBjaGVja2VkIG5vZGVzIChpZ25vcmluZyBzZWxlY3RlZCBwYXJlbnRzKSAoaWYgdGllX3NlbGVjdGlvbiBpcyBvbiBpbiB0aGUgc2V0dGluZ3MgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgc2FtZSBhcyBnZXRfYm90dG9tX3NlbGVjdGVkKVxuXHRcdCAqIEBuYW1lIGdldF9ib3R0b21fY2hlY2tlZChbZnVsbF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICBmdWxsIGlmIHNldCB0byBgdHJ1ZWAgdGhlIHJldHVybmVkIGFycmF5IHdpbGwgY29uc2lzdCBvZiB0aGUgZnVsbCBub2RlIG9iamVjdHMsIG90aGVyd2lzZSAtIG9ubHkgSURzIHdpbGwgYmUgcmV0dXJuZWRcblx0XHQgKiBAcmV0dXJuIHtBcnJheX1cblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5nZXRfYm90dG9tX2NoZWNrZWQgPSBmdW5jdGlvbiAoZnVsbCkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7IHJldHVybiB0aGlzLmdldF9ib3R0b21fc2VsZWN0ZWQoZnVsbCk7IH1cblx0XHRcdHZhciB0bXAgPSB0aGlzLmdldF9jaGVja2VkKHRydWUpLFxuXHRcdFx0XHRvYmogPSBbXSwgaSwgajtcblx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYoIXRtcFtpXS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRvYmoucHVzaCh0bXBbaV0uaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnVsbCA/ICQubWFwKG9iaiwgJC5wcm94eShmdW5jdGlvbiAoaSkgeyByZXR1cm4gdGhpcy5nZXRfbm9kZShpKTsgfSwgdGhpcykpIDogb2JqO1xuXHRcdH07XG5cdFx0dGhpcy5sb2FkX25vZGUgPSBmdW5jdGlvbiAob2JqLCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIGssIGwsIGksIGosIGMsIHRtcDtcblx0XHRcdGlmKCEkLmlzQXJyYXkob2JqKSAmJiAhdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdFx0aWYodG1wICYmIHRtcC5zdGF0ZS5sb2FkZWQpIHtcblx0XHRcdFx0XHRmb3IoayA9IDAsIGwgPSB0bXAuY2hpbGRyZW5fZC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbdG1wLmNoaWxkcmVuX2Rba11dLnN0YXRlLmNoZWNrZWQpIHtcblx0XHRcdFx0XHRcdFx0YyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQgPSAkLnZha2F0YS5hcnJheV9yZW1vdmVfaXRlbSh0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLCB0bXAuY2hpbGRyZW5fZFtrXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcGFyZW50LmxvYWRfbm9kZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH07XG5cdFx0dGhpcy5nZXRfc3RhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgc3RhdGUgPSBwYXJlbnQuZ2V0X3N0YXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHsgcmV0dXJuIHN0YXRlOyB9XG5cdFx0XHRzdGF0ZS5jaGVja2JveCA9IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQuc2xpY2UoKTtcblx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHR9O1xuXHRcdHRoaXMuc2V0X3N0YXRlID0gZnVuY3Rpb24gKHN0YXRlLCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIHJlcyA9IHBhcmVudC5zZXRfc3RhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdGlmKHJlcyAmJiBzdGF0ZS5jaGVja2JveCkge1xuXHRcdFx0XHRpZighdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7XG5cdFx0XHRcdFx0dGhpcy51bmNoZWNrX2FsbCgpO1xuXHRcdFx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRcdFx0JC5lYWNoKHN0YXRlLmNoZWNrYm94LCBmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0X3RoaXMuY2hlY2tfbm9kZSh2KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWxldGUgc3RhdGUuY2hlY2tib3g7XG5cdFx0XHRcdHRoaXMuc2V0X3N0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXM7XG5cdFx0fTtcblx0XHR0aGlzLnJlZnJlc2ggPSBmdW5jdGlvbiAoc2tpcF9sb2FkaW5nLCBmb3JnZXRfc3RhdGUpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikge1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkID0gW107XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcGFyZW50LnJlZnJlc2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9O1xuXHR9O1xuXG5cdC8vIGluY2x1ZGUgdGhlIGNoZWNrYm94IHBsdWdpbiBieSBkZWZhdWx0XG5cdC8vICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnMucHVzaChcImNoZWNrYm94XCIpO1xuXG5cbi8qKlxuICogIyMjIENvbmRpdGlvbmFsc2VsZWN0IHBsdWdpblxuICpcbiAqIFRoaXMgcGx1Z2luIGFsbG93cyBkZWZpbmluZyBhIGNhbGxiYWNrIHRvIGFsbG93IG9yIGRlbnkgbm9kZSBzZWxlY3Rpb24gYnkgdXNlciBpbnB1dCAoYWN0aXZhdGUgbm9kZSBtZXRob2QpLlxuICovXG5cblx0LyoqXG5cdCAqIGEgY2FsbGJhY2sgKGZ1bmN0aW9uKSB3aGljaCBpcyBpbnZva2VkIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlIGFuZCByZWNlaXZlcyB0d28gYXJndW1lbnRzIC0gdGhlIG5vZGUgYW5kIHRoZSBldmVudCB0aGF0IHRyaWdnZXJlZCB0aGUgYGFjdGl2YXRlX25vZGVgIGNhbGwuIFJldHVybmluZyBmYWxzZSBwcmV2ZW50cyB3b3JraW5nIHdpdGggdGhlIG5vZGUsIHJldHVybmluZyB0cnVlIGFsbG93cyBpbnZva2luZyBhY3RpdmF0ZV9ub2RlLiBEZWZhdWx0cyB0byByZXR1cm5pbmcgYHRydWVgLlxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveC52aXNpYmxlXG5cdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLmNvbmRpdGlvbmFsc2VsZWN0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfTtcblx0JC5qc3RyZWUucGx1Z2lucy5jb25kaXRpb25hbHNlbGVjdCA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHQvLyBvd24gZnVuY3Rpb25cblx0XHR0aGlzLmFjdGl2YXRlX25vZGUgPSBmdW5jdGlvbiAob2JqLCBlKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNvbmRpdGlvbmFsc2VsZWN0LmNhbGwodGhpcywgdGhpcy5nZXRfbm9kZShvYmopLCBlKSkge1xuXHRcdFx0XHRyZXR1cm4gcGFyZW50LmFjdGl2YXRlX25vZGUuY2FsbCh0aGlzLCBvYmosIGUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH07XG5cblxuLyoqXG4gKiAjIyMgQ29udGV4dG1lbnUgcGx1Z2luXG4gKlxuICogU2hvd3MgYSBjb250ZXh0IG1lbnUgd2hlbiBhIG5vZGUgaXMgcmlnaHQtY2xpY2tlZC5cbiAqL1xuXG5cdC8qKlxuXHQgKiBzdG9yZXMgYWxsIGRlZmF1bHRzIGZvciB0aGUgY29udGV4dG1lbnUgcGx1Z2luXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvbnRleHRtZW51XG5cdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLmNvbnRleHRtZW51ID0ge1xuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBub2RlIHNob3VsZCBiZSBzZWxlY3RlZCB3aGVuIHRoZSBjb250ZXh0IG1lbnUgaXMgaW52b2tlZCBvbiBpdC4gRGVmYXVsdHMgdG8gYHRydWVgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvbnRleHRtZW51LnNlbGVjdF9ub2RlXG5cdFx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHRcdCAqL1xuXHRcdHNlbGVjdF9ub2RlIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgbWVudSBzaG91bGQgYmUgc2hvd24gYWxpZ25lZCB3aXRoIHRoZSBub2RlLiBEZWZhdWx0cyB0byBgdHJ1ZWAsIG90aGVyd2lzZSB0aGUgbW91c2UgY29vcmRpbmF0ZXMgYXJlIHVzZWQuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29udGV4dG1lbnUuc2hvd19hdF9ub2RlXG5cdFx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHRcdCAqL1xuXHRcdHNob3dfYXRfbm9kZSA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogYW4gb2JqZWN0IG9mIGFjdGlvbnMsIG9yIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGEgbm9kZSBhbmQgYSBjYWxsYmFjayBmdW5jdGlvbiBhbmQgY2FsbHMgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpdGggYW4gb2JqZWN0IG9mIGFjdGlvbnMgYXZhaWxhYmxlIGZvciB0aGF0IG5vZGUgKHlvdSBjYW4gYWxzbyByZXR1cm4gdGhlIGl0ZW1zIHRvbykuXG5cdFx0ICpcblx0XHQgKiBFYWNoIGFjdGlvbiBjb25zaXN0cyBvZiBhIGtleSAoYSB1bmlxdWUgbmFtZSkgYW5kIGEgdmFsdWUgd2hpY2ggaXMgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIChvbmx5IGxhYmVsIGFuZCBhY3Rpb24gYXJlIHJlcXVpcmVkKS4gT25jZSBhIG1lbnUgaXRlbSBpcyBhY3RpdmF0ZWQgdGhlIGBhY3Rpb25gIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCB3aXRoIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcga2V5czogaXRlbSAtIHRoZSBjb250ZXh0bWVudSBpdGVtIGRlZmluaXRpb24gYXMgc2VlbiBiZWxvdywgcmVmZXJlbmNlIC0gdGhlIERPTSBub2RlIHRoYXQgd2FzIHVzZWQgKHRoZSB0cmVlIG5vZGUpLCBlbGVtZW50IC0gdGhlIGNvbnRleHRtZW51IERPTSBlbGVtZW50LCBwb3NpdGlvbiAtIGFuIG9iamVjdCB3aXRoIHgveSBwcm9wZXJ0aWVzIGluZGljYXRpbmcgdGhlIHBvc2l0aW9uIG9mIHRoZSBtZW51LlxuXHRcdCAqXG5cdFx0ICogKiBgc2VwYXJhdG9yX2JlZm9yZWAgLSBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGVyZSBzaG91bGQgYmUgYSBzZXBhcmF0b3IgYmVmb3JlIHRoaXMgaXRlbVxuXHRcdCAqICogYHNlcGFyYXRvcl9hZnRlcmAgLSBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGVyZSBzaG91bGQgYmUgYSBzZXBhcmF0b3IgYWZ0ZXIgdGhpcyBpdGVtXG5cdFx0ICogKiBgX2Rpc2FibGVkYCAtIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoaXMgYWN0aW9uIHNob3VsZCBiZSBkaXNhYmxlZFxuXHRcdCAqICogYGxhYmVsYCAtIGEgc3RyaW5nIC0gdGhlIG5hbWUgb2YgdGhlIGFjdGlvbiAoY291bGQgYmUgYSBmdW5jdGlvbiByZXR1cm5pbmcgYSBzdHJpbmcpXG5cdFx0ICogKiBgdGl0bGVgIC0gYSBzdHJpbmcgLSBhbiBvcHRpb25hbCB0b29sdGlwIGZvciB0aGUgaXRlbVxuXHRcdCAqICogYGFjdGlvbmAgLSBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGlmIHRoaXMgaXRlbSBpcyBjaG9zZW4sIHRoZSBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgXG5cdFx0ICogKiBgaWNvbmAgLSBhIHN0cmluZywgY2FuIGJlIGEgcGF0aCB0byBhbiBpY29uIG9yIGEgY2xhc3NOYW1lLCBpZiB1c2luZyBhbiBpbWFnZSB0aGF0IGlzIGluIHRoZSBjdXJyZW50IGRpcmVjdG9yeSB1c2UgYSBgLi9gIHByZWZpeCwgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgZGV0ZWN0ZWQgYXMgYSBjbGFzc1xuXHRcdCAqICogYHNob3J0Y3V0YCAtIGtleUNvZGUgd2hpY2ggd2lsbCB0cmlnZ2VyIHRoZSBhY3Rpb24gaWYgdGhlIG1lbnUgaXMgb3BlbiAoZm9yIGV4YW1wbGUgYDExM2AgZm9yIHJlbmFtZSwgd2hpY2ggZXF1YWxzIEYyKVxuXHRcdCAqICogYHNob3J0Y3V0X2xhYmVsYCAtIHNob3J0Y3V0IGxhYmVsIChsaWtlIGZvciBleGFtcGxlIGBGMmAgZm9yIHJlbmFtZSlcblx0XHQgKiAqIGBzdWJtZW51YCAtIGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIHN0cnVjdHVyZSBhcyAkLmpzdHJlZS5kZWZhdWx0cy5jb250ZXh0bWVudS5pdGVtcyB3aGljaCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYSBzdWJtZW51IC0gZWFjaCBrZXkgd2lsbCBiZSByZW5kZXJlZCBhcyBhIHNlcGFyYXRlIG9wdGlvbiBpbiBhIHN1Ym1lbnUgdGhhdCB3aWxsIGFwcGVhciBvbmNlIHRoZSBjdXJyZW50IGl0ZW0gaXMgaG92ZXJlZFxuXHRcdCAqXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29udGV4dG1lbnUuaXRlbXNcblx0XHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdFx0ICovXG5cdFx0aXRlbXMgOiBmdW5jdGlvbiAobywgY2IpIHsgLy8gQ291bGQgYmUgYW4gb2JqZWN0IGRpcmVjdGx5XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcImNyZWF0ZVwiIDoge1xuXHRcdFx0XHRcdFwic2VwYXJhdG9yX2JlZm9yZVwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFwic2VwYXJhdG9yX2FmdGVyXCJcdDogdHJ1ZSxcblx0XHRcdFx0XHRcIl9kaXNhYmxlZFwiXHRcdFx0OiBmYWxzZSwgLy8odGhpcy5jaGVjayhcImNyZWF0ZV9ub2RlXCIsIGRhdGEucmVmZXJlbmNlLCB7fSwgXCJsYXN0XCIpKSxcblx0XHRcdFx0XHRcImxhYmVsXCJcdFx0XHRcdDogXCJDcmVhdGVcIixcblx0XHRcdFx0XHRcImFjdGlvblwiXHRcdFx0OiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dmFyIGluc3QgPSAkLmpzdHJlZS5yZWZlcmVuY2UoZGF0YS5yZWZlcmVuY2UpLFxuXHRcdFx0XHRcdFx0XHRvYmogPSBpbnN0LmdldF9ub2RlKGRhdGEucmVmZXJlbmNlKTtcblx0XHRcdFx0XHRcdGluc3QuY3JlYXRlX25vZGUob2JqLCB7fSwgXCJsYXN0XCIsIGZ1bmN0aW9uIChuZXdfbm9kZSkge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdGluc3QuZWRpdChuZXdfbm9kZSk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGluc3QuZWRpdChuZXdfbm9kZSk7IH0sMCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0XCJyZW5hbWVcIiA6IHtcblx0XHRcdFx0XHRcInNlcGFyYXRvcl9iZWZvcmVcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcInNlcGFyYXRvcl9hZnRlclwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFwiX2Rpc2FibGVkXCJcdFx0XHQ6IGZhbHNlLCAvLyh0aGlzLmNoZWNrKFwicmVuYW1lX25vZGVcIiwgZGF0YS5yZWZlcmVuY2UsIHRoaXMuZ2V0X3BhcmVudChkYXRhLnJlZmVyZW5jZSksIFwiXCIpKSxcblx0XHRcdFx0XHRcImxhYmVsXCJcdFx0XHRcdDogXCJSZW5hbWVcIixcblx0XHRcdFx0XHQvKiFcblx0XHRcdFx0XHRcInNob3J0Y3V0XCJcdFx0XHQ6IDExMyxcblx0XHRcdFx0XHRcInNob3J0Y3V0X2xhYmVsXCJcdDogJ0YyJyxcblx0XHRcdFx0XHRcImljb25cIlx0XHRcdFx0OiBcImdseXBoaWNvbiBnbHlwaGljb24tbGVhZlwiLFxuXHRcdFx0XHRcdCovXG5cdFx0XHRcdFx0XCJhY3Rpb25cIlx0XHRcdDogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZhciBpbnN0ID0gJC5qc3RyZWUucmVmZXJlbmNlKGRhdGEucmVmZXJlbmNlKSxcblx0XHRcdFx0XHRcdFx0b2JqID0gaW5zdC5nZXRfbm9kZShkYXRhLnJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0XHRpbnN0LmVkaXQob2JqKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwicmVtb3ZlXCIgOiB7XG5cdFx0XHRcdFx0XCJzZXBhcmF0b3JfYmVmb3JlXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XCJpY29uXCJcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdFx0XCJzZXBhcmF0b3JfYWZ0ZXJcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcIl9kaXNhYmxlZFwiXHRcdFx0OiBmYWxzZSwgLy8odGhpcy5jaGVjayhcImRlbGV0ZV9ub2RlXCIsIGRhdGEucmVmZXJlbmNlLCB0aGlzLmdldF9wYXJlbnQoZGF0YS5yZWZlcmVuY2UpLCBcIlwiKSksXG5cdFx0XHRcdFx0XCJsYWJlbFwiXHRcdFx0XHQ6IFwiRGVsZXRlXCIsXG5cdFx0XHRcdFx0XCJhY3Rpb25cIlx0XHRcdDogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdHZhciBpbnN0ID0gJC5qc3RyZWUucmVmZXJlbmNlKGRhdGEucmVmZXJlbmNlKSxcblx0XHRcdFx0XHRcdFx0b2JqID0gaW5zdC5nZXRfbm9kZShkYXRhLnJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0XHRpZihpbnN0LmlzX3NlbGVjdGVkKG9iaikpIHtcblx0XHRcdFx0XHRcdFx0aW5zdC5kZWxldGVfbm9kZShpbnN0LmdldF9zZWxlY3RlZCgpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpbnN0LmRlbGV0ZV9ub2RlKG9iaik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImNjcFwiIDoge1xuXHRcdFx0XHRcdFwic2VwYXJhdG9yX2JlZm9yZVwiXHQ6IHRydWUsXG5cdFx0XHRcdFx0XCJpY29uXCJcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdFx0XCJzZXBhcmF0b3JfYWZ0ZXJcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcImxhYmVsXCJcdFx0XHRcdDogXCJFZGl0XCIsXG5cdFx0XHRcdFx0XCJhY3Rpb25cIlx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdFx0XCJzdWJtZW51XCIgOiB7XG5cdFx0XHRcdFx0XHRcImN1dFwiIDoge1xuXHRcdFx0XHRcdFx0XHRcInNlcGFyYXRvcl9iZWZvcmVcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XCJzZXBhcmF0b3JfYWZ0ZXJcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XCJsYWJlbFwiXHRcdFx0XHQ6IFwiQ3V0XCIsXG5cdFx0XHRcdFx0XHRcdFwiYWN0aW9uXCJcdFx0XHQ6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluc3QgPSAkLmpzdHJlZS5yZWZlcmVuY2UoZGF0YS5yZWZlcmVuY2UpLFxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqID0gaW5zdC5nZXRfbm9kZShkYXRhLnJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaW5zdC5pc19zZWxlY3RlZChvYmopKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpbnN0LmN1dChpbnN0LmdldF90b3Bfc2VsZWN0ZWQoKSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0aW5zdC5jdXQob2JqKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcImNvcHlcIiA6IHtcblx0XHRcdFx0XHRcdFx0XCJzZXBhcmF0b3JfYmVmb3JlXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFwiaWNvblwiXHRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcInNlcGFyYXRvcl9hZnRlclwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcImxhYmVsXCJcdFx0XHRcdDogXCJDb3B5XCIsXG5cdFx0XHRcdFx0XHRcdFwiYWN0aW9uXCJcdFx0XHQ6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGluc3QgPSAkLmpzdHJlZS5yZWZlcmVuY2UoZGF0YS5yZWZlcmVuY2UpLFxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqID0gaW5zdC5nZXRfbm9kZShkYXRhLnJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoaW5zdC5pc19zZWxlY3RlZChvYmopKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpbnN0LmNvcHkoaW5zdC5nZXRfdG9wX3NlbGVjdGVkKCkpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGluc3QuY29weShvYmopO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwicGFzdGVcIiA6IHtcblx0XHRcdFx0XHRcdFx0XCJzZXBhcmF0b3JfYmVmb3JlXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFwiaWNvblwiXHRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcIl9kaXNhYmxlZFwiXHRcdFx0OiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAhJC5qc3RyZWUucmVmZXJlbmNlKGRhdGEucmVmZXJlbmNlKS5jYW5fcGFzdGUoKTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XCJzZXBhcmF0b3JfYWZ0ZXJcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XCJsYWJlbFwiXHRcdFx0XHQ6IFwiUGFzdGVcIixcblx0XHRcdFx0XHRcdFx0XCJhY3Rpb25cIlx0XHRcdDogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5zdCA9ICQuanN0cmVlLnJlZmVyZW5jZShkYXRhLnJlZmVyZW5jZSksXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmogPSBpbnN0LmdldF9ub2RlKGRhdGEucmVmZXJlbmNlKTtcblx0XHRcdFx0XHRcdFx0XHRpbnN0LnBhc3RlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXHR9O1xuXG5cdCQuanN0cmVlLnBsdWdpbnMuY29udGV4dG1lbnUgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5iaW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFyZW50LmJpbmQuY2FsbCh0aGlzKTtcblxuXHRcdFx0dmFyIGxhc3RfdHMgPSAwLCBjdG8gPSBudWxsLCBleCwgZXk7XG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0Lm9uKFwiaW5pdC5qc3RyZWUgbG9hZGluZy5qc3RyZWUgcmVhZHkuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkuYWRkQ2xhc3MoJ2pzdHJlZS1jb250ZXh0bWVudScpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJjb250ZXh0bWVudS5qc3RyZWVcIiwgXCIuanN0cmVlLWFuY2hvclwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRpZiAoZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaW5wdXQnKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGxhc3RfdHMgPSBlLmN0cmxLZXkgPyArbmV3IERhdGUoKSA6IDA7XG5cdFx0XHRcdFx0XHRpZihkYXRhIHx8IGN0bykge1xuXHRcdFx0XHRcdFx0XHRsYXN0X3RzID0gKCtuZXcgRGF0ZSgpKSArIDEwMDAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoY3RvKSB7XG5cdFx0XHRcdFx0XHRcdGNsZWFyVGltZW91dChjdG8pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoIXRoaXMuaXNfbG9hZGluZyhlLmN1cnJlbnRUYXJnZXQpKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2hvd19jb250ZXh0bWVudShlLmN1cnJlbnRUYXJnZXQsIGUucGFnZVgsIGUucGFnZVksIGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJjbGljay5qc3RyZWVcIiwgXCIuanN0cmVlLWFuY2hvclwiLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLmNvbnRleHRtZW51LnZpc2libGUgJiYgKCFsYXN0X3RzIHx8ICgrbmV3IERhdGUoKSkgLSBsYXN0X3RzID4gMjUwKSkgeyAvLyB3b3JrIGFyb3VuZCBzYWZhcmkgJiBtYWNPUyBjdHJsK2NsaWNrXG5cdFx0XHRcdFx0XHRcdCQudmFrYXRhLmNvbnRleHQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bGFzdF90cyA9IDA7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcInRvdWNoc3RhcnQuanN0cmVlXCIsIFwiLmpzdHJlZS1hbmNob3JcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKCFlLm9yaWdpbmFsRXZlbnQgfHwgIWUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcyB8fCAhZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGV4ID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG5cdFx0XHRcdFx0XHRleSA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xuXHRcdFx0XHRcdFx0Y3RvID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS50cmlnZ2VyKCdjb250ZXh0bWVudScsIHRydWUpO1xuXHRcdFx0XHRcdFx0fSwgNzUwKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ3RvdWNobW92ZS52YWthdGEuanN0cmVlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKGN0byAmJiBlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSAmJiAoTWF0aC5hYnMoZXggLSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCkgPiAxMCB8fCBNYXRoLmFicyhleSAtIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZKSA+IDEwKSkge1xuXHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoY3RvKTtcblx0XHRcdFx0XHRcdFx0JC52YWthdGEuY29udGV4dC5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCd0b3VjaGVuZC52YWthdGEuanN0cmVlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKGN0bykge1xuXHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoY3RvKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0LyohXG5cdFx0XHRpZighKCdvbmNvbnRleHRtZW51JyBpbiBkb2N1bWVudC5ib2R5KSAmJiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuYm9keSkpIHtcblx0XHRcdFx0dmFyIGVsID0gbnVsbCwgdG0gPSBudWxsO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0XHQub24oXCJ0b3VjaHN0YXJ0XCIsIFwiLmpzdHJlZS1hbmNob3JcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGVsID0gZS5jdXJyZW50VGFyZ2V0O1xuXHRcdFx0XHRcdFx0dG0gPSArbmV3IERhdGUoKTtcblx0XHRcdFx0XHRcdCQoZG9jdW1lbnQpLm9uZShcInRvdWNoZW5kXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdGUudGFyZ2V0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgZS5vcmlnaW5hbEV2ZW50LnRhcmdldFRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpO1xuXHRcdFx0XHRcdFx0XHRlLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcblx0XHRcdFx0XHRcdFx0dG0gPSAoKCsobmV3IERhdGUoKSkpIC0gdG0pO1xuXHRcdFx0XHRcdFx0XHRpZihlLnRhcmdldCA9PT0gZWwgJiYgdG0gPiA2MDAgJiYgdG0gPCAxMDAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdCQoZWwpLnRyaWdnZXIoJ2NvbnRleHRtZW51JywgZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWwgPSBudWxsO1xuXHRcdFx0XHRcdFx0XHR0bSA9IG51bGw7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdCovXG5cdFx0XHQkKGRvY3VtZW50KS5vbihcImNvbnRleHRfaGlkZS52YWthdGEuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5jb250ZXh0bWVudS52aXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdCQoZGF0YS5yZWZlcmVuY2UpLnJlbW92ZUNsYXNzKCdqc3RyZWUtY29udGV4dCcpO1xuXHRcdFx0fSwgdGhpcykpO1xuXHRcdH07XG5cdFx0dGhpcy50ZWFyZG93biA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmKHRoaXMuX2RhdGEuY29udGV4dG1lbnUudmlzaWJsZSkge1xuXHRcdFx0XHQkLnZha2F0YS5jb250ZXh0LmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdHBhcmVudC50ZWFyZG93bi5jYWxsKHRoaXMpO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBwcmVwYXJlIGFuZCBzaG93IHRoZSBjb250ZXh0IG1lbnUgZm9yIGEgbm9kZVxuXHRcdCAqIEBuYW1lIHNob3dfY29udGV4dG1lbnUob2JqIFssIHgsIHldKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSB4IHRoZSB4LWNvb3JkaW5hdGUgcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50IHRvIHNob3cgdGhlIG1lbnUgYXRcblx0XHQgKiBAcGFyYW0ge051bWJlcn0geSB0aGUgeS1jb29yZGluYXRlIHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudCB0byBzaG93IHRoZSBtZW51IGF0XG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGUgdGhlIGV2ZW50IGlmIGF2YWlsYWJsZSB0aGF0IHRyaWdnZXJlZCB0aGUgY29udGV4dG1lbnVcblx0XHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdFx0ICogQHRyaWdnZXIgc2hvd19jb250ZXh0bWVudS5qc3RyZWVcblx0XHQgKi9cblx0XHR0aGlzLnNob3dfY29udGV4dG1lbnUgPSBmdW5jdGlvbiAob2JqLCB4LCB5LCBlKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciBzID0gdGhpcy5zZXR0aW5ncy5jb250ZXh0bWVudSxcblx0XHRcdFx0ZCA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKSxcblx0XHRcdFx0YSA9IGQuY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKSxcblx0XHRcdFx0byA9IGZhbHNlLFxuXHRcdFx0XHRpID0gZmFsc2U7XG5cdFx0XHRpZihzLnNob3dfYXRfbm9kZSB8fCB4ID09PSB1bmRlZmluZWQgfHwgeSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdG8gPSBhLm9mZnNldCgpO1xuXHRcdFx0XHR4ID0gby5sZWZ0O1xuXHRcdFx0XHR5ID0gby50b3AgKyB0aGlzLl9kYXRhLmNvcmUubGlfaGVpZ2h0O1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jb250ZXh0bWVudS5zZWxlY3Rfbm9kZSAmJiAhdGhpcy5pc19zZWxlY3RlZChvYmopKSB7XG5cdFx0XHRcdHRoaXMuYWN0aXZhdGVfbm9kZShvYmosIGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpID0gcy5pdGVtcztcblx0XHRcdGlmKCQuaXNGdW5jdGlvbihpKSkge1xuXHRcdFx0XHRpID0gaS5jYWxsKHRoaXMsIG9iaiwgJC5wcm94eShmdW5jdGlvbiAoaSkge1xuXHRcdFx0XHRcdHRoaXMuX3Nob3dfY29udGV4dG1lbnUob2JqLCB4LCB5LCBpKTtcblx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0fVxuXHRcdFx0aWYoJC5pc1BsYWluT2JqZWN0KGkpKSB7XG5cdFx0XHRcdHRoaXMuX3Nob3dfY29udGV4dG1lbnUob2JqLCB4LCB5LCBpKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHNob3cgdGhlIHByZXBhcmVkIGNvbnRleHQgbWVudSBmb3IgYSBub2RlXG5cdFx0ICogQG5hbWUgX3Nob3dfY29udGV4dG1lbnUob2JqLCB4LCB5LCBpKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSB4IHRoZSB4LWNvb3JkaW5hdGUgcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50IHRvIHNob3cgdGhlIG1lbnUgYXRcblx0XHQgKiBAcGFyYW0ge051bWJlcn0geSB0aGUgeS1jb29yZGluYXRlIHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudCB0byBzaG93IHRoZSBtZW51IGF0XG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IGkgdGhlIG9iamVjdCBvZiBpdGVtcyB0byBzaG93XG5cdFx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHRcdCAqIEB0cmlnZ2VyIHNob3dfY29udGV4dG1lbnUuanN0cmVlXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR0aGlzLl9zaG93X2NvbnRleHRtZW51ID0gZnVuY3Rpb24gKG9iaiwgeCwgeSwgaSkge1xuXHRcdFx0dmFyIGQgPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSksXG5cdFx0XHRcdGEgPSBkLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIik7XG5cdFx0XHQkKGRvY3VtZW50KS5vbmUoXCJjb250ZXh0X3Nob3cudmFrYXRhLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdHZhciBjbHMgPSAnanN0cmVlLWNvbnRleHRtZW51IGpzdHJlZS0nICsgdGhpcy5nZXRfdGhlbWUoKSArICctY29udGV4dG1lbnUnO1xuXHRcdFx0XHQkKGRhdGEuZWxlbWVudCkuYWRkQ2xhc3MoY2xzKTtcblx0XHRcdFx0YS5hZGRDbGFzcygnanN0cmVlLWNvbnRleHQnKTtcblx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdHRoaXMuX2RhdGEuY29udGV4dG1lbnUudmlzaWJsZSA9IHRydWU7XG5cdFx0XHQkLnZha2F0YS5jb250ZXh0LnNob3coYSwgeyAneCcgOiB4LCAneScgOiB5IH0sIGkpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiB0aGUgY29udGV4dG1lbnUgaXMgc2hvd24gZm9yIGEgbm9kZVxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzaG93X2NvbnRleHRtZW51LmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7TnVtYmVyfSB4IHRoZSB4LWNvb3JkaW5hdGUgb2YgdGhlIG1lbnUgcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50XG5cdFx0XHQgKiBAcGFyYW0ge051bWJlcn0geSB0aGUgeS1jb29yZGluYXRlIG9mIHRoZSBtZW51IHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudFxuXHRcdFx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3Nob3dfY29udGV4dG1lbnUnLCB7IFwibm9kZVwiIDogb2JqLCBcInhcIiA6IHgsIFwieVwiIDogeSB9KTtcblx0XHR9O1xuXHR9O1xuXG5cdC8vIGNvbnRleHRtZW51IGhlbHBlclxuXHQoZnVuY3Rpb24gKCQpIHtcblx0XHR2YXIgcmlnaHRfdG9fbGVmdCA9IGZhbHNlLFxuXHRcdFx0dmFrYXRhX2NvbnRleHQgPSB7XG5cdFx0XHRcdGVsZW1lbnRcdFx0OiBmYWxzZSxcblx0XHRcdFx0cmVmZXJlbmNlXHQ6IGZhbHNlLFxuXHRcdFx0XHRwb3NpdGlvbl94XHQ6IDAsXG5cdFx0XHRcdHBvc2l0aW9uX3lcdDogMCxcblx0XHRcdFx0aXRlbXNcdFx0OiBbXSxcblx0XHRcdFx0aHRtbFx0XHQ6IFwiXCIsXG5cdFx0XHRcdGlzX3Zpc2libGVcdDogZmFsc2Vcblx0XHRcdH07XG5cblx0XHQkLnZha2F0YS5jb250ZXh0ID0ge1xuXHRcdFx0c2V0dGluZ3MgOiB7XG5cdFx0XHRcdGhpZGVfb25tb3VzZWxlYXZlXHQ6IDAsXG5cdFx0XHRcdGljb25zXHRcdFx0XHQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRfdHJpZ2dlciA6IGZ1bmN0aW9uIChldmVudF9uYW1lKSB7XG5cdFx0XHRcdCQoZG9jdW1lbnQpLnRyaWdnZXJIYW5kbGVyKFwiY29udGV4dF9cIiArIGV2ZW50X25hbWUgKyBcIi52YWthdGFcIiwge1xuXHRcdFx0XHRcdFwicmVmZXJlbmNlXCJcdDogdmFrYXRhX2NvbnRleHQucmVmZXJlbmNlLFxuXHRcdFx0XHRcdFwiZWxlbWVudFwiXHQ6IHZha2F0YV9jb250ZXh0LmVsZW1lbnQsXG5cdFx0XHRcdFx0XCJwb3NpdGlvblwiXHQ6IHtcblx0XHRcdFx0XHRcdFwieFwiIDogdmFrYXRhX2NvbnRleHQucG9zaXRpb25feCxcblx0XHRcdFx0XHRcdFwieVwiIDogdmFrYXRhX2NvbnRleHQucG9zaXRpb25feVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0X2V4ZWN1dGUgOiBmdW5jdGlvbiAoaSkge1xuXHRcdFx0XHRpID0gdmFrYXRhX2NvbnRleHQuaXRlbXNbaV07XG5cdFx0XHRcdHJldHVybiBpICYmICghaS5fZGlzYWJsZWQgfHwgKCQuaXNGdW5jdGlvbihpLl9kaXNhYmxlZCkgJiYgIWkuX2Rpc2FibGVkKHsgXCJpdGVtXCIgOiBpLCBcInJlZmVyZW5jZVwiIDogdmFrYXRhX2NvbnRleHQucmVmZXJlbmNlLCBcImVsZW1lbnRcIiA6IHZha2F0YV9jb250ZXh0LmVsZW1lbnQgfSkpKSAmJiBpLmFjdGlvbiA/IGkuYWN0aW9uLmNhbGwobnVsbCwge1xuXHRcdFx0XHRcdFx0XHRcIml0ZW1cIlx0XHQ6IGksXG5cdFx0XHRcdFx0XHRcdFwicmVmZXJlbmNlXCJcdDogdmFrYXRhX2NvbnRleHQucmVmZXJlbmNlLFxuXHRcdFx0XHRcdFx0XHRcImVsZW1lbnRcIlx0OiB2YWthdGFfY29udGV4dC5lbGVtZW50LFxuXHRcdFx0XHRcdFx0XHRcInBvc2l0aW9uXCJcdDoge1xuXHRcdFx0XHRcdFx0XHRcdFwieFwiIDogdmFrYXRhX2NvbnRleHQucG9zaXRpb25feCxcblx0XHRcdFx0XHRcdFx0XHRcInlcIiA6IHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3lcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSkgOiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRfcGFyc2UgOiBmdW5jdGlvbiAobywgaXNfY2FsbGJhY2spIHtcblx0XHRcdFx0aWYoIW8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRcdGlmKCFpc19jYWxsYmFjaykge1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0Lmh0bWxcdFx0PSBcIlwiO1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0Lml0ZW1zXHQ9IFtdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBzdHIgPSBcIlwiLFxuXHRcdFx0XHRcdHNlcCA9IGZhbHNlLFxuXHRcdFx0XHRcdHRtcDtcblxuXHRcdFx0XHRpZihpc19jYWxsYmFjaykgeyBzdHIgKz0gXCI8XCIrXCJ1bD5cIjsgfVxuXHRcdFx0XHQkLmVhY2gobywgZnVuY3Rpb24gKGksIHZhbCkge1xuXHRcdFx0XHRcdGlmKCF2YWwpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5pdGVtcy5wdXNoKHZhbCk7XG5cdFx0XHRcdFx0aWYoIXNlcCAmJiB2YWwuc2VwYXJhdG9yX2JlZm9yZSkge1xuXHRcdFx0XHRcdFx0c3RyICs9IFwiPFwiK1wibGkgY2xhc3M9J3Zha2F0YS1jb250ZXh0LXNlcGFyYXRvcic+PFwiK1wiYSBocmVmPScjJyBcIiArICgkLnZha2F0YS5jb250ZXh0LnNldHRpbmdzLmljb25zID8gJycgOiAnc3R5bGU9XCJtYXJnaW4tbGVmdDowcHg7XCInKSArIFwiPiYjMTYwOzxcIitcIi9hPjxcIitcIi9saT5cIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c2VwID0gZmFsc2U7XG5cdFx0XHRcdFx0c3RyICs9IFwiPFwiK1wibGkgY2xhc3M9J1wiICsgKHZhbC5fY2xhc3MgfHwgXCJcIikgKyAodmFsLl9kaXNhYmxlZCA9PT0gdHJ1ZSB8fCAoJC5pc0Z1bmN0aW9uKHZhbC5fZGlzYWJsZWQpICYmIHZhbC5fZGlzYWJsZWQoeyBcIml0ZW1cIiA6IHZhbCwgXCJyZWZlcmVuY2VcIiA6IHZha2F0YV9jb250ZXh0LnJlZmVyZW5jZSwgXCJlbGVtZW50XCIgOiB2YWthdGFfY29udGV4dC5lbGVtZW50IH0pKSA/IFwiIHZha2F0YS1jb250ZXh0bWVudS1kaXNhYmxlZCBcIiA6IFwiXCIpICsgXCInIFwiKyh2YWwuc2hvcnRjdXQ/XCIgZGF0YS1zaG9ydGN1dD0nXCIrdmFsLnNob3J0Y3V0K1wiJyBcIjonJykrXCI+XCI7XG5cdFx0XHRcdFx0c3RyICs9IFwiPFwiK1wiYSBocmVmPScjJyByZWw9J1wiICsgKHZha2F0YV9jb250ZXh0Lml0ZW1zLmxlbmd0aCAtIDEpICsgXCInIFwiICsgKHZhbC50aXRsZSA/IFwidGl0bGU9J1wiICsgdmFsLnRpdGxlICsgXCInXCIgOiBcIlwiKSArIFwiPlwiO1xuXHRcdFx0XHRcdGlmKCQudmFrYXRhLmNvbnRleHQuc2V0dGluZ3MuaWNvbnMpIHtcblx0XHRcdFx0XHRcdHN0ciArPSBcIjxcIitcImkgXCI7XG5cdFx0XHRcdFx0XHRpZih2YWwuaWNvbikge1xuXHRcdFx0XHRcdFx0XHRpZih2YWwuaWNvbi5pbmRleE9mKFwiL1wiKSAhPT0gLTEgfHwgdmFsLmljb24uaW5kZXhPZihcIi5cIikgIT09IC0xKSB7IHN0ciArPSBcIiBzdHlsZT0nYmFja2dyb3VuZDp1cmwoXFxcIlwiICsgdmFsLmljb24gKyBcIlxcXCIpIGNlbnRlciBjZW50ZXIgbm8tcmVwZWF0JyBcIjsgfVxuXHRcdFx0XHRcdFx0XHRlbHNlIHsgc3RyICs9IFwiIGNsYXNzPSdcIiArIHZhbC5pY29uICsgXCInIFwiOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzdHIgKz0gXCI+PFwiK1wiL2k+PFwiK1wic3BhbiBjbGFzcz0ndmFrYXRhLWNvbnRleHRtZW51LXNlcCc+JiMxNjA7PFwiK1wiL3NwYW4+XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0ciArPSAoJC5pc0Z1bmN0aW9uKHZhbC5sYWJlbCkgPyB2YWwubGFiZWwoeyBcIml0ZW1cIiA6IGksIFwicmVmZXJlbmNlXCIgOiB2YWthdGFfY29udGV4dC5yZWZlcmVuY2UsIFwiZWxlbWVudFwiIDogdmFrYXRhX2NvbnRleHQuZWxlbWVudCB9KSA6IHZhbC5sYWJlbCkgKyAodmFsLnNob3J0Y3V0PycgPHNwYW4gY2xhc3M9XCJ2YWthdGEtY29udGV4dG1lbnUtc2hvcnRjdXQgdmFrYXRhLWNvbnRleHRtZW51LXNob3J0Y3V0LScrdmFsLnNob3J0Y3V0KydcIj4nKyAodmFsLnNob3J0Y3V0X2xhYmVsIHx8ICcnKSArJzwvc3Bhbj4nOicnKSArIFwiPFwiK1wiL2E+XCI7XG5cdFx0XHRcdFx0aWYodmFsLnN1Ym1lbnUpIHtcblx0XHRcdFx0XHRcdHRtcCA9ICQudmFrYXRhLmNvbnRleHQuX3BhcnNlKHZhbC5zdWJtZW51LCB0cnVlKTtcblx0XHRcdFx0XHRcdGlmKHRtcCkgeyBzdHIgKz0gdG1wOyB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0ciArPSBcIjxcIitcIi9saT5cIjtcblx0XHRcdFx0XHRpZih2YWwuc2VwYXJhdG9yX2FmdGVyKSB7XG5cdFx0XHRcdFx0XHRzdHIgKz0gXCI8XCIrXCJsaSBjbGFzcz0ndmFrYXRhLWNvbnRleHQtc2VwYXJhdG9yJz48XCIrXCJhIGhyZWY9JyMnIFwiICsgKCQudmFrYXRhLmNvbnRleHQuc2V0dGluZ3MuaWNvbnMgPyAnJyA6ICdzdHlsZT1cIm1hcmdpbi1sZWZ0OjBweDtcIicpICsgXCI+JiMxNjA7PFwiK1wiL2E+PFwiK1wiL2xpPlwiO1xuXHRcdFx0XHRcdFx0c2VwID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzdHIgID0gc3RyLnJlcGxhY2UoLzxsaSBjbGFzc1xcPSd2YWthdGEtY29udGV4dC1zZXBhcmF0b3InXFw+PFxcL2xpXFw+JC8sXCJcIik7XG5cdFx0XHRcdGlmKGlzX2NhbGxiYWNrKSB7IHN0ciArPSBcIjwvdWw+XCI7IH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCBvbiB0aGUgZG9jdW1lbnQgd2hlbiB0aGUgY29udGV4dG1lbnUgaXMgcGFyc2VkIChIVE1MIGlzIGJ1aWx0KVxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHRcdFx0XHQgKiBAbmFtZSBjb250ZXh0X3BhcnNlLnZha2F0YVxuXHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gcmVmZXJlbmNlIHRoZSBlbGVtZW50IHRoYXQgd2FzIHJpZ2h0IGNsaWNrZWRcblx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnQgdGhlIERPTSBlbGVtZW50IG9mIHRoZSBtZW51IGl0c2VsZlxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gdGhlIHggJiB5IGNvb3JkaW5hdGVzIG9mIHRoZSBtZW51XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRpZighaXNfY2FsbGJhY2spIHsgdmFrYXRhX2NvbnRleHQuaHRtbCA9IHN0cjsgJC52YWthdGEuY29udGV4dC5fdHJpZ2dlcihcInBhcnNlXCIpOyB9XG5cdFx0XHRcdHJldHVybiBzdHIubGVuZ3RoID4gMTAgPyBzdHIgOiBmYWxzZTtcblx0XHRcdH0sXG5cdFx0XHRfc2hvd19zdWJtZW51IDogZnVuY3Rpb24gKG8pIHtcblx0XHRcdFx0byA9ICQobyk7XG5cdFx0XHRcdGlmKCFvLmxlbmd0aCB8fCAhby5jaGlsZHJlbihcInVsXCIpLmxlbmd0aCkgeyByZXR1cm47IH1cblx0XHRcdFx0dmFyIGUgPSBvLmNoaWxkcmVuKFwidWxcIiksXG5cdFx0XHRcdFx0eGwgPSBvLm9mZnNldCgpLmxlZnQsXG5cdFx0XHRcdFx0eCA9IHhsICsgby5vdXRlcldpZHRoKCksXG5cdFx0XHRcdFx0eSA9IG8ub2Zmc2V0KCkudG9wLFxuXHRcdFx0XHRcdHcgPSBlLndpZHRoKCksXG5cdFx0XHRcdFx0aCA9IGUuaGVpZ2h0KCksXG5cdFx0XHRcdFx0ZHcgPSAkKHdpbmRvdykud2lkdGgoKSArICQod2luZG93KS5zY3JvbGxMZWZ0KCksXG5cdFx0XHRcdFx0ZGggPSAkKHdpbmRvdykuaGVpZ2h0KCkgKyAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cdFx0XHRcdC8vINC80L7QttC1INC00LAg0YHQtSDRgdC/0LXRgdGC0Lgg0LUg0LXQtNC90LAg0L/RgNC+0LLQtdGA0LrQsCAtINC00LDQu9C4INC90Y/QvNCwINC90Y/QutC+0Lkg0L7RgiDQutC70LDRgdC+0LLQtdGC0LUg0LLQtdGH0LUg0L3QsNCz0L7RgNC1XG5cdFx0XHRcdGlmKHJpZ2h0X3RvX2xlZnQpIHtcblx0XHRcdFx0XHRvW3ggLSAodyArIDEwICsgby5vdXRlcldpZHRoKCkpIDwgMCA/IFwiYWRkQ2xhc3NcIiA6IFwicmVtb3ZlQ2xhc3NcIl0oXCJ2YWthdGEtY29udGV4dC1sZWZ0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdG9beCArIHcgPiBkdyAgJiYgeGwgPiBkdyAtIHggPyBcImFkZENsYXNzXCIgOiBcInJlbW92ZUNsYXNzXCJdKFwidmFrYXRhLWNvbnRleHQtcmlnaHRcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoeSArIGggKyAxMCA+IGRoKSB7XG5cdFx0XHRcdFx0ZS5jc3MoXCJib3R0b21cIixcIi0xcHhcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL2lmIGRvZXMgbm90IGZpdCAtIHN0aWNrIGl0IHRvIHRoZSBzaWRlXG5cdFx0XHRcdGlmIChvLmhhc0NsYXNzKCd2YWthdGEtY29udGV4dC1yaWdodCcpKSB7XG5cdFx0XHRcdFx0aWYgKHhsIDwgdykge1xuXHRcdFx0XHRcdFx0ZS5jc3MoXCJtYXJnaW4tcmlnaHRcIiwgeGwgLSB3KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKGR3IC0geCA8IHcpIHtcblx0XHRcdFx0XHRcdGUuY3NzKFwibWFyZ2luLWxlZnRcIiwgZHcgLSB4IC0gdyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZS5zaG93KCk7XG5cdFx0XHR9LFxuXHRcdFx0c2hvdyA6IGZ1bmN0aW9uIChyZWZlcmVuY2UsIHBvc2l0aW9uLCBkYXRhKSB7XG5cdFx0XHRcdHZhciBvLCBlLCB4LCB5LCB3LCBoLCBkdywgZGgsIGNvbmQgPSB0cnVlO1xuXHRcdFx0XHRpZih2YWthdGFfY29udGV4dC5lbGVtZW50ICYmIHZha2F0YV9jb250ZXh0LmVsZW1lbnQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC53aWR0aCgnJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoKGNvbmQpIHtcblx0XHRcdFx0XHRjYXNlICghcG9zaXRpb24gJiYgIXJlZmVyZW5jZSk6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0Y2FzZSAoISFwb3NpdGlvbiAmJiAhIXJlZmVyZW5jZSk6XG5cdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5yZWZlcmVuY2VcdD0gcmVmZXJlbmNlO1xuXHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQucG9zaXRpb25feFx0PSBwb3NpdGlvbi54O1xuXHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQucG9zaXRpb25feVx0PSBwb3NpdGlvbi55O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAoIXBvc2l0aW9uICYmICEhcmVmZXJlbmNlKTpcblx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LnJlZmVyZW5jZVx0PSByZWZlcmVuY2U7XG5cdFx0XHRcdFx0XHRvID0gcmVmZXJlbmNlLm9mZnNldCgpO1xuXHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQucG9zaXRpb25feFx0PSBvLmxlZnQgKyByZWZlcmVuY2Uub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3lcdD0gby50b3A7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICghIXBvc2l0aW9uICYmICFyZWZlcmVuY2UpOlxuXHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQucG9zaXRpb25feFx0PSBwb3NpdGlvbi54O1xuXHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQucG9zaXRpb25feVx0PSBwb3NpdGlvbi55O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoISFyZWZlcmVuY2UgJiYgIWRhdGEgJiYgJChyZWZlcmVuY2UpLmRhdGEoJ3Zha2F0YV9jb250ZXh0bWVudScpKSB7XG5cdFx0XHRcdFx0ZGF0YSA9ICQocmVmZXJlbmNlKS5kYXRhKCd2YWthdGFfY29udGV4dG1lbnUnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZigkLnZha2F0YS5jb250ZXh0Ll9wYXJzZShkYXRhKSkge1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQuaHRtbCh2YWthdGFfY29udGV4dC5odG1sKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZih2YWthdGFfY29udGV4dC5pdGVtcy5sZW5ndGgpIHtcblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50LmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuXHRcdFx0XHRcdGUgPSB2YWthdGFfY29udGV4dC5lbGVtZW50O1xuXHRcdFx0XHRcdHggPSB2YWthdGFfY29udGV4dC5wb3NpdGlvbl94O1xuXHRcdFx0XHRcdHkgPSB2YWthdGFfY29udGV4dC5wb3NpdGlvbl95O1xuXHRcdFx0XHRcdHcgPSBlLndpZHRoKCk7XG5cdFx0XHRcdFx0aCA9IGUuaGVpZ2h0KCk7XG5cdFx0XHRcdFx0ZHcgPSAkKHdpbmRvdykud2lkdGgoKSArICQod2luZG93KS5zY3JvbGxMZWZ0KCk7XG5cdFx0XHRcdFx0ZGggPSAkKHdpbmRvdykuaGVpZ2h0KCkgKyAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cdFx0XHRcdFx0aWYocmlnaHRfdG9fbGVmdCkge1xuXHRcdFx0XHRcdFx0eCAtPSAoZS5vdXRlcldpZHRoKCkgLSAkKHJlZmVyZW5jZSkub3V0ZXJXaWR0aCgpKTtcblx0XHRcdFx0XHRcdGlmKHggPCAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpICsgMjApIHtcblx0XHRcdFx0XHRcdFx0eCA9ICQod2luZG93KS5zY3JvbGxMZWZ0KCkgKyAyMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoeCArIHcgKyAyMCA+IGR3KSB7XG5cdFx0XHRcdFx0XHR4ID0gZHcgLSAodyArIDIwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoeSArIGggKyAyMCA+IGRoKSB7XG5cdFx0XHRcdFx0XHR5ID0gZGggLSAoaCArIDIwKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50XG5cdFx0XHRcdFx0XHQuY3NzKHsgXCJsZWZ0XCIgOiB4LCBcInRvcFwiIDogeSB9KVxuXHRcdFx0XHRcdFx0LnNob3coKVxuXHRcdFx0XHRcdFx0LmZpbmQoJ2EnKS5maXJzdCgpLmZvY3VzKCkucGFyZW50KCkuYWRkQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKTtcblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5pc192aXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgb24gdGhlIGRvY3VtZW50IHdoZW4gdGhlIGNvbnRleHRtZW51IGlzIHNob3duXG5cdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHRcdFx0XHRcdCAqIEBuYW1lIGNvbnRleHRfc2hvdy52YWthdGFcblx0XHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gcmVmZXJlbmNlIHRoZSBlbGVtZW50IHRoYXQgd2FzIHJpZ2h0IGNsaWNrZWRcblx0XHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gZWxlbWVudCB0aGUgRE9NIGVsZW1lbnQgb2YgdGhlIG1lbnUgaXRzZWxmXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IHBvc2l0aW9uIHRoZSB4ICYgeSBjb29yZGluYXRlcyBvZiB0aGUgbWVudVxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdCQudmFrYXRhLmNvbnRleHQuX3RyaWdnZXIoXCJzaG93XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aGlkZSA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYodmFrYXRhX2NvbnRleHQuaXNfdmlzaWJsZSkge1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQuaGlkZSgpLmZpbmQoXCJ1bFwiKS5oaWRlKCkuZW5kKCkuZmluZCgnOmZvY3VzJykuYmx1cigpLmVuZCgpLmRldGFjaCgpO1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmlzX3Zpc2libGUgPSBmYWxzZTtcblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgb24gdGhlIGRvY3VtZW50IHdoZW4gdGhlIGNvbnRleHRtZW51IGlzIGhpZGRlblxuXHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0XHRcdFx0XHQgKiBAbmFtZSBjb250ZXh0X2hpZGUudmFrYXRhXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IHJlZmVyZW5jZSB0aGUgZWxlbWVudCB0aGF0IHdhcyByaWdodCBjbGlja2VkXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnQgdGhlIERPTSBlbGVtZW50IG9mIHRoZSBtZW51IGl0c2VsZlxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiB0aGUgeCAmIHkgY29vcmRpbmF0ZXMgb2YgdGhlIG1lbnVcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHQkLnZha2F0YS5jb250ZXh0Ll90cmlnZ2VyKFwiaGlkZVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0JChmdW5jdGlvbiAoKSB7XG5cdFx0XHRyaWdodF90b19sZWZ0ID0gJChkb2N1bWVudC5ib2R5KS5jc3MoXCJkaXJlY3Rpb25cIikgPT09IFwicnRsXCI7XG5cdFx0XHR2YXIgdG8gPSBmYWxzZTtcblxuXHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudCA9ICQoXCI8dWwgY2xhc3M9J3Zha2F0YS1jb250ZXh0Jz48L3VsPlwiKTtcblx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnRcblx0XHRcdFx0Lm9uKFwibW91c2VlbnRlclwiLCBcImxpXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRcdGlmKCQuY29udGFpbnModGhpcywgZS5yZWxhdGVkVGFyZ2V0KSkge1xuXHRcdFx0XHRcdFx0Ly8g0L/RgNC10LzQsNGF0L3QsNGC0L4g0LfQsNGA0LDQtNC4IGRlbGVnYXRlIG1vdXNlbGVhdmUg0L/Qvi3QtNC+0LvRg1xuXHRcdFx0XHRcdFx0Ly8gJCh0aGlzKS5maW5kKFwiLnZha2F0YS1jb250ZXh0LWhvdmVyXCIpLnJlbW92ZUNsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIik7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYodG8pIHsgY2xlYXJUaW1lb3V0KHRvKTsgfVxuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZChcIi52YWthdGEtY29udGV4dC1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpLmVuZCgpO1xuXG5cdFx0XHRcdFx0JCh0aGlzKVxuXHRcdFx0XHRcdFx0LnNpYmxpbmdzKCkuZmluZChcInVsXCIpLmhpZGUoKS5lbmQoKS5lbmQoKVxuXHRcdFx0XHRcdFx0LnBhcmVudHNVbnRpbChcIi52YWthdGEtY29udGV4dFwiLCBcImxpXCIpLmFkZEJhY2soKS5hZGRDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpO1xuXHRcdFx0XHRcdCQudmFrYXRhLmNvbnRleHQuX3Nob3dfc3VibWVudSh0aGlzKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Ly8g0YLQtdGB0YLQvtCy0L4gLSDQtNCw0LvQuCDQvdC1INC90LDRgtC+0LLQsNGA0LLQsD9cblx0XHRcdFx0Lm9uKFwibW91c2VsZWF2ZVwiLCBcImxpXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aWYoJC5jb250YWlucyh0aGlzLCBlLnJlbGF0ZWRUYXJnZXQpKSB7IHJldHVybjsgfVxuXHRcdFx0XHRcdCQodGhpcykuZmluZChcIi52YWthdGEtY29udGV4dC1ob3ZlclwiKS5hZGRCYWNrKCkucmVtb3ZlQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdCQodGhpcykuZmluZChcIi52YWthdGEtY29udGV4dC1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpO1xuXHRcdFx0XHRcdGlmKCQudmFrYXRhLmNvbnRleHQuc2V0dGluZ3MuaGlkZV9vbm1vdXNlbGVhdmUpIHtcblx0XHRcdFx0XHRcdHRvID0gc2V0VGltZW91dChcblx0XHRcdFx0XHRcdFx0KGZ1bmN0aW9uICh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHsgJC52YWthdGEuY29udGV4dC5oaWRlKCk7IH07XG5cdFx0XHRcdFx0XHRcdH0odGhpcykpLCAkLnZha2F0YS5jb250ZXh0LnNldHRpbmdzLmhpZGVfb25tb3VzZWxlYXZlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbihcImNsaWNrXCIsIFwiYVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0Ly99KVxuXHRcdFx0XHQvLy5vbihcIm1vdXNldXBcIiwgXCJhXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aWYoISQodGhpcykuYmx1cigpLnBhcmVudCgpLmhhc0NsYXNzKFwidmFrYXRhLWNvbnRleHQtZGlzYWJsZWRcIikgJiYgJC52YWthdGEuY29udGV4dC5fZXhlY3V0ZSgkKHRoaXMpLmF0dHIoXCJyZWxcIikpICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0JC52YWthdGEuY29udGV4dC5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ2tleWRvd24nLCAnYScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHR2YXIgbyA9IG51bGw7XG5cdFx0XHRcdFx0XHRzd2l0Y2goZS53aGljaCkge1xuXHRcdFx0XHRcdFx0XHRjYXNlIDEzOlxuXHRcdFx0XHRcdFx0XHRjYXNlIDMyOlxuXHRcdFx0XHRcdFx0XHRcdGUudHlwZSA9IFwiY2xpY2tcIjtcblx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLnRyaWdnZXIoZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgMzc6XG5cdFx0XHRcdFx0XHRcdFx0aWYodmFrYXRhX2NvbnRleHQuaXNfdmlzaWJsZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKFwiLnZha2F0YS1jb250ZXh0LWhvdmVyXCIpLmxhc3QoKS5jbG9zZXN0KFwibGlcIikuZmlyc3QoKS5maW5kKFwidWxcIikuaGlkZSgpLmZpbmQoXCIudmFrYXRhLWNvbnRleHQtaG92ZXJcIikucmVtb3ZlQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKS5lbmQoKS5lbmQoKS5jaGlsZHJlbignYScpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAzODpcblx0XHRcdFx0XHRcdFx0XHRpZih2YWthdGFfY29udGV4dC5pc192aXNpYmxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvID0gdmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKFwidWw6dmlzaWJsZVwiKS5hZGRCYWNrKCkubGFzdCgpLmNoaWxkcmVuKFwiLnZha2F0YS1jb250ZXh0LWhvdmVyXCIpLnJlbW92ZUNsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIikucHJldkFsbChcImxpOm5vdCgudmFrYXRhLWNvbnRleHQtc2VwYXJhdG9yKVwiKS5maXJzdCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoIW8ubGVuZ3RoKSB7IG8gPSB2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoXCJ1bDp2aXNpYmxlXCIpLmFkZEJhY2soKS5sYXN0KCkuY2hpbGRyZW4oXCJsaTpub3QoLnZha2F0YS1jb250ZXh0LXNlcGFyYXRvcilcIikubGFzdCgpOyB9XG5cdFx0XHRcdFx0XHRcdFx0XHRvLmFkZENsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIikuY2hpbGRyZW4oJ2EnKS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgMzk6XG5cdFx0XHRcdFx0XHRcdFx0aWYodmFrYXRhX2NvbnRleHQuaXNfdmlzaWJsZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKFwiLnZha2F0YS1jb250ZXh0LWhvdmVyXCIpLmxhc3QoKS5jaGlsZHJlbihcInVsXCIpLnNob3coKS5jaGlsZHJlbihcImxpOm5vdCgudmFrYXRhLWNvbnRleHQtc2VwYXJhdG9yKVwiKS5yZW1vdmVDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpLmZpcnN0KCkuYWRkQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKS5jaGlsZHJlbignYScpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHRcdFx0XHRpZih2YWthdGFfY29udGV4dC5pc192aXNpYmxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvID0gdmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKFwidWw6dmlzaWJsZVwiKS5hZGRCYWNrKCkubGFzdCgpLmNoaWxkcmVuKFwiLnZha2F0YS1jb250ZXh0LWhvdmVyXCIpLnJlbW92ZUNsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIikubmV4dEFsbChcImxpOm5vdCgudmFrYXRhLWNvbnRleHQtc2VwYXJhdG9yKVwiKS5maXJzdCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoIW8ubGVuZ3RoKSB7IG8gPSB2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoXCJ1bDp2aXNpYmxlXCIpLmFkZEJhY2soKS5sYXN0KCkuY2hpbGRyZW4oXCJsaTpub3QoLnZha2F0YS1jb250ZXh0LXNlcGFyYXRvcilcIikuZmlyc3QoKTsgfVxuXHRcdFx0XHRcdFx0XHRcdFx0by5hZGRDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpLmNoaWxkcmVuKCdhJykuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDI3OlxuXHRcdFx0XHRcdFx0XHRcdCQudmFrYXRhLmNvbnRleHQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGUud2hpY2gpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdC5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHZhciBhID0gdmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKCcudmFrYXRhLWNvbnRleHRtZW51LXNob3J0Y3V0LScgKyBlLndoaWNoKS5wYXJlbnQoKTtcblx0XHRcdFx0XHRpZihhLnBhcmVudCgpLm5vdCgnLnZha2F0YS1jb250ZXh0LWRpc2FibGVkJykpIHtcblx0XHRcdFx0XHRcdGEuY2xpY2soKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHQkKGRvY3VtZW50KVxuXHRcdFx0XHQub24oXCJtb3VzZWRvd24udmFrYXRhLmpzdHJlZVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdGlmKHZha2F0YV9jb250ZXh0LmlzX3Zpc2libGUgJiYgdmFrYXRhX2NvbnRleHQuZWxlbWVudFswXSAhPT0gZS50YXJnZXQgICYmICEkLmNvbnRhaW5zKHZha2F0YV9jb250ZXh0LmVsZW1lbnRbMF0sIGUudGFyZ2V0KSkge1xuXHRcdFx0XHRcdFx0JC52YWthdGEuY29udGV4dC5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oXCJjb250ZXh0X3Nob3cudmFrYXRhLmpzdHJlZVwiLCBmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZChcImxpOmhhcyh1bClcIikuY2hpbGRyZW4oXCJhXCIpLmFkZENsYXNzKFwidmFrYXRhLWNvbnRleHQtcGFyZW50XCIpO1xuXHRcdFx0XHRcdGlmKHJpZ2h0X3RvX2xlZnQpIHtcblx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQuYWRkQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ydGxcIikuY3NzKFwiZGlyZWN0aW9uXCIsIFwicnRsXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBhbHNvIGFwcGx5IGEgUlRMIGNsYXNzP1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZChcInVsXCIpLmhpZGUoKS5lbmQoKTtcblx0XHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0oJCkpO1xuXHQvLyAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zLnB1c2goXCJjb250ZXh0bWVudVwiKTtcblxuXG4vKipcbiAqICMjIyBEcmFnJ24nZHJvcCBwbHVnaW5cbiAqXG4gKiBFbmFibGVzIGRyYWdnaW5nIGFuZCBkcm9wcGluZyBvZiBub2RlcyBpbiB0aGUgdHJlZSwgcmVzdWx0aW5nIGluIGEgbW92ZSBvciBjb3B5IG9wZXJhdGlvbnMuXG4gKi9cblxuXHQvKipcblx0ICogc3RvcmVzIGFsbCBkZWZhdWx0cyBmb3IgdGhlIGRyYWcnbidkcm9wIHBsdWdpblxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmRcblx0ICogQHBsdWdpbiBkbmRcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLmRuZCA9IHtcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBhIGNvcHkgc2hvdWxkIGJlIHBvc3NpYmxlIHdoaWxlIGRyYWdnaW5nIChieSBwcmVzc2ludCB0aGUgbWV0YSBrZXkgb3IgQ3RybCkuIERlZmF1bHRzIHRvIGB0cnVlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQuY29weVxuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0Y29weSA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogYSBudW1iZXIgaW5kaWNhdGluZyBob3cgbG9uZyBhIG5vZGUgc2hvdWxkIHJlbWFpbiBob3ZlcmVkIHdoaWxlIGRyYWdnaW5nIHRvIGJlIG9wZW5lZC4gRGVmYXVsdHMgdG8gYDUwMGAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLm9wZW5fdGltZW91dFxuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0b3Blbl90aW1lb3V0IDogNTAwLFxuXHRcdC8qKlxuXHRcdCAqIGEgZnVuY3Rpb24gaW52b2tlZCBlYWNoIHRpbWUgYSBub2RlIGlzIGFib3V0IHRvIGJlIGRyYWdnZWQsIGludm9rZWQgaW4gdGhlIHRyZWUncyBzY29wZSBhbmQgcmVjZWl2ZXMgdGhlIG5vZGVzIGFib3V0IHRvIGJlIGRyYWdnZWQgYXMgYW4gYXJndW1lbnQgKGFycmF5KSBhbmQgdGhlIGV2ZW50IHRoYXQgc3RhcnRlZCB0aGUgZHJhZyAtIHJldHVybiBgZmFsc2VgIHRvIHByZXZlbnQgZHJhZ2dpbmdcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQuaXNfZHJhZ2dhYmxlXG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHRpc19kcmFnZ2FibGUgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGNoZWNrcyBzaG91bGQgY29uc3RhbnRseSBiZSBtYWRlIHdoaWxlIHRoZSB1c2VyIGlzIGRyYWdnaW5nIHRoZSBub2RlIChhcyBvcHBvc2VkIHRvIGNoZWNraW5nIG9ubHkgb24gZHJvcCksIGRlZmF1bHQgaXMgYHRydWVgXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLmNoZWNrX3doaWxlX2RyYWdnaW5nXG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHRjaGVja193aGlsZV9kcmFnZ2luZyA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgbm9kZXMgZnJvbSB0aGlzIHRyZWUgc2hvdWxkIG9ubHkgYmUgY29waWVkIHdpdGggZG5kIChhcyBvcHBvc2VkIHRvIG1vdmVkKSwgZGVmYXVsdCBpcyBgZmFsc2VgXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLmFsd2F5c19jb3B5XG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHRhbHdheXNfY29weSA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIHdoZW4gZHJvcHBpbmcgYSBub2RlIFwiaW5zaWRlXCIsIHRoaXMgc2V0dGluZyBpbmRpY2F0ZXMgdGhlIHBvc2l0aW9uIHRoZSBub2RlIHNob3VsZCBnbyB0byAtIGl0IGNhbiBiZSBhbiBpbnRlZ2VyIG9yIGEgc3RyaW5nOiBcImZpcnN0XCIgKHNhbWUgYXMgMCkgb3IgXCJsYXN0XCIsIGRlZmF1bHQgaXMgYDBgXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLmluc2lkZV9wb3Ncblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdGluc2lkZV9wb3MgOiAwLFxuXHRcdC8qKlxuXHRcdCAqIHdoZW4gc3RhcnRpbmcgdGhlIGRyYWcgb24gYSBub2RlIHRoYXQgaXMgc2VsZWN0ZWQgdGhpcyBzZXR0aW5nIGNvbnRyb2xzIGlmIGFsbCBzZWxlY3RlZCBub2RlcyBhcmUgZHJhZ2dlZCBvciBvbmx5IHRoZSBzaW5nbGUgbm9kZSwgZGVmYXVsdCBpcyBgdHJ1ZWAsIHdoaWNoIG1lYW5zIGFsbCBzZWxlY3RlZCBub2RlcyBhcmUgZHJhZ2dlZCB3aGVuIHRoZSBkcmFnIGlzIHN0YXJ0ZWQgb24gYSBzZWxlY3RlZCBub2RlXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLmRyYWdfc2VsZWN0aW9uXG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHRkcmFnX3NlbGVjdGlvbiA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogY29udHJvbHMgd2hldGhlciBkbmQgd29ya3Mgb24gdG91Y2ggZGV2aWNlcy4gSWYgbGVmdCBhcyBib29sZWFuIHRydWUgZG5kIHdpbGwgd29yayB0aGUgc2FtZSBhcyBpbiBkZXNrdG9wIGJyb3dzZXJzLCB3aGljaCBpbiBzb21lIGNhc2VzIG1heSBpbXBhaXIgc2Nyb2xsaW5nLiBJZiBzZXQgdG8gYm9vbGVhbiBmYWxzZSBkbmQgd2lsbCBub3Qgd29yayBvbiB0b3VjaCBkZXZpY2VzLiBUaGVyZSBpcyBhIHNwZWNpYWwgdGhpcmQgb3B0aW9uIC0gc3RyaW5nIFwic2VsZWN0ZWRcIiB3aGljaCBtZWFucyBvbmx5IHNlbGVjdGVkIG5vZGVzIGNhbiBiZSBkcmFnZ2VkIG9uIHRvdWNoIGRldmljZXMuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLnRvdWNoXG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHR0b3VjaCA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogY29udHJvbHMgd2hldGhlciBpdGVtcyBjYW4gYmUgZHJvcHBlZCBhbnl3aGVyZSBvbiB0aGUgbm9kZSwgbm90IGp1c3Qgb24gdGhlIGFuY2hvciwgYnkgZGVmYXVsdCBvbmx5IHRoZSBub2RlIGFuY2hvciBpcyBhIHZhbGlkIGRyb3AgdGFyZ2V0LiBXb3JrcyBiZXN0IHdpdGggdGhlIHdob2xlcm93IHBsdWdpbi4gSWYgZW5hYmxlZCBvbiBtb2JpbGUgZGVwZW5kaW5nIG9uIHRoZSBpbnRlcmZhY2UgaXQgbWlnaHQgYmUgaGFyZCBmb3IgdGhlIHVzZXIgdG8gY2FuY2VsIHRoZSBkcm9wLCBzaW5jZSB0aGUgd2hvbGUgdHJlZSBjb250YWluZXIgd2lsbCBiZSBhIHZhbGlkIGRyb3AgdGFyZ2V0LlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC5sYXJnZV9kcm9wX3RhcmdldFxuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0bGFyZ2VfZHJvcF90YXJnZXQgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBjb250cm9scyB3aGV0aGVyIGEgZHJhZyBjYW4gYmUgaW5pdGlhdGVkIGZyb20gYW55IHBhcnQgb2YgdGhlIG5vZGUgYW5kIG5vdCBqdXN0IHRoZSB0ZXh0L2ljb24gcGFydCwgd29ya3MgYmVzdCB3aXRoIHRoZSB3aG9sZXJvdyBwbHVnaW4uIEtlZXAgaW4gbWluZCBpdCBjYW4gY2F1c2UgcHJvYmxlbXMgd2l0aCB0cmVlIHNjcm9sbGluZyBvbiBtb2JpbGUgZGVwZW5kaW5nIG9uIHRoZSBpbnRlcmZhY2UgLSBpbiB0aGF0IGNhc2Ugc2V0IHRoZSB0b3VjaCBvcHRpb24gdG8gXCJzZWxlY3RlZFwiLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC5sYXJnZV9kcmFnX3RhcmdldFxuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0bGFyZ2VfZHJhZ190YXJnZXQgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBjb250cm9scyB3aGV0aGVyIHVzZSBIVE1MNSBkbmQgYXBpIGluc3RlYWQgb2YgY2xhc3NpY2FsLiBUaGF0IHdpbGwgYWxsb3cgYmV0dGVyIGludGVncmF0aW9uIG9mIGRuZCBldmVudHMgd2l0aCBvdGhlciBIVE1MNSBjb250cm9scy5cblx0XHQgKiBAcmVmZXJlbmNlIGh0dHA6Ly9jYW5pdXNlLmNvbS8jZmVhdD1kcmFnbmRyb3Bcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQudXNlX2h0bWw1XG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHR1c2VfaHRtbDU6IGZhbHNlXG5cdH07XG5cdHZhciBkcmcsIGVsbTtcblx0Ly8gVE9ETzogbm93IGNoZWNrIHdvcmtzIGJ5IGNoZWNraW5nIGZvciBlYWNoIG5vZGUgaW5kaXZpZHVhbGx5LCBob3cgYWJvdXQgbWF4X2NoaWxkcmVuLCB1bmlxdWUsIGV0Yz9cblx0JC5qc3RyZWUucGx1Z2lucy5kbmQgPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5pbml0ID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG5cdFx0XHRwYXJlbnQuaW5pdC5jYWxsKHRoaXMsIGVsLCBvcHRpb25zKTtcblx0XHRcdHRoaXMuc2V0dGluZ3MuZG5kLnVzZV9odG1sNSA9IHRoaXMuc2V0dGluZ3MuZG5kLnVzZV9odG1sNSAmJiAoJ2RyYWdnYWJsZScgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpKTtcblx0XHR9O1xuXHRcdHRoaXMuYmluZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHBhcmVudC5iaW5kLmNhbGwodGhpcyk7XG5cblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQub24odGhpcy5zZXR0aW5ncy5kbmQudXNlX2h0bWw1ID8gJ2RyYWdzdGFydC5qc3RyZWUnIDogJ21vdXNlZG93bi5qc3RyZWUgdG91Y2hzdGFydC5qc3RyZWUnLCB0aGlzLnNldHRpbmdzLmRuZC5sYXJnZV9kcmFnX3RhcmdldCA/ICcuanN0cmVlLW5vZGUnIDogJy5qc3RyZWUtYW5jaG9yJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYodGhpcy5zZXR0aW5ncy5kbmQubGFyZ2VfZHJhZ190YXJnZXQgJiYgJChlLnRhcmdldCkuY2xvc2VzdCgnLmpzdHJlZS1ub2RlJylbMF0gIT09IGUuY3VycmVudFRhcmdldCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKGUudHlwZSA9PT0gXCJ0b3VjaHN0YXJ0XCIgJiYgKCF0aGlzLnNldHRpbmdzLmRuZC50b3VjaCB8fCAodGhpcy5zZXR0aW5ncy5kbmQudG91Y2ggPT09ICdzZWxlY3RlZCcgJiYgISQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCcuanN0cmVlLW5vZGUnKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5oYXNDbGFzcygnanN0cmVlLWNsaWNrZWQnKSkpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmFyIG9iaiA9IHRoaXMuZ2V0X25vZGUoZS50YXJnZXQpLFxuXHRcdFx0XHRcdFx0XHRtbHQgPSB0aGlzLmlzX3NlbGVjdGVkKG9iaikgJiYgdGhpcy5zZXR0aW5ncy5kbmQuZHJhZ19zZWxlY3Rpb24gPyB0aGlzLmdldF90b3Bfc2VsZWN0ZWQoKS5sZW5ndGggOiAxLFxuXHRcdFx0XHRcdFx0XHR0eHQgPSAobWx0ID4gMSA/IG1sdCArICcgJyArIHRoaXMuZ2V0X3N0cmluZygnbm9kZXMnKSA6IHRoaXMuZ2V0X3RleHQoZS5jdXJyZW50VGFyZ2V0KSk7XG5cdFx0XHRcdFx0XHRpZih0aGlzLnNldHRpbmdzLmNvcmUuZm9yY2VfdGV4dCkge1xuXHRcdFx0XHRcdFx0XHR0eHQgPSAkLnZha2F0YS5odG1sLmVzY2FwZSh0eHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYob2JqICYmIG9iai5pZCAmJiBvYmouaWQgIT09ICQuanN0cmVlLnJvb3QgJiYgKGUud2hpY2ggPT09IDEgfHwgZS50eXBlID09PSBcInRvdWNoc3RhcnRcIiB8fCBlLnR5cGUgPT09IFwiZHJhZ3N0YXJ0XCIpICYmXG5cdFx0XHRcdFx0XHRcdCh0aGlzLnNldHRpbmdzLmRuZC5pc19kcmFnZ2FibGUgPT09IHRydWUgfHwgKCQuaXNGdW5jdGlvbih0aGlzLnNldHRpbmdzLmRuZC5pc19kcmFnZ2FibGUpICYmIHRoaXMuc2V0dGluZ3MuZG5kLmlzX2RyYWdnYWJsZS5jYWxsKHRoaXMsIChtbHQgPiAxID8gdGhpcy5nZXRfdG9wX3NlbGVjdGVkKHRydWUpIDogW29ial0pLCBlKSkpXG5cdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0ZHJnID0geyAnanN0cmVlJyA6IHRydWUsICdvcmlnaW4nIDogdGhpcywgJ29iaicgOiB0aGlzLmdldF9ub2RlKG9iaix0cnVlKSwgJ25vZGVzJyA6IG1sdCA+IDEgPyB0aGlzLmdldF90b3Bfc2VsZWN0ZWQoKSA6IFtvYmouaWRdIH07XG5cdFx0XHRcdFx0XHRcdGVsbSA9IGUuY3VycmVudFRhcmdldDtcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MuZG5kLnVzZV9odG1sNSkge1xuXHRcdFx0XHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcignc3RhcnQnLCBlLCB7ICdoZWxwZXInOiAkKCksICdlbGVtZW50JzogZWxtLCAnZGF0YSc6IGRyZyB9KTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQudHJpZ2dlcignbW91c2Vkb3duLmpzdHJlZScpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAkLnZha2F0YS5kbmQuc3RhcnQoZSwgZHJnLCAnPGRpdiBpZD1cImpzdHJlZS1kbmRcIiBjbGFzcz1cImpzdHJlZS0nICsgdGhpcy5nZXRfdGhlbWUoKSArICcganN0cmVlLScgKyB0aGlzLmdldF90aGVtZSgpICsgJy0nICsgdGhpcy5nZXRfdGhlbWVfdmFyaWFudCgpICsgJyAnICsgKCB0aGlzLnNldHRpbmdzLmNvcmUudGhlbWVzLnJlc3BvbnNpdmUgPyAnIGpzdHJlZS1kbmQtcmVzcG9uc2l2ZScgOiAnJyApICsgJ1wiPjxpIGNsYXNzPVwianN0cmVlLWljb24ganN0cmVlLWVyXCI+PC9pPicgKyB0eHQgKyAnPGlucyBjbGFzcz1cImpzdHJlZS1jb3B5XCIgc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCI+KzwvaW5zPjwvZGl2PicpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MuZG5kLnVzZV9odG1sNSkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0XHQub24oJ2RyYWdvdmVyLmpzdHJlZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKCdtb3ZlJywgZSwgeyAnaGVscGVyJzogJCgpLCAnZWxlbWVudCc6IGVsbSwgJ2RhdGEnOiBkcmcgfSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Ly8ub24oJ2RyYWdlbnRlci5qc3RyZWUnLCB0aGlzLnNldHRpbmdzLmRuZC5sYXJnZV9kcm9wX3RhcmdldCA/ICcuanN0cmVlLW5vZGUnIDogJy5qc3RyZWUtYW5jaG9yJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdC8vXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQvL1x0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoJ21vdmUnLCBlLCB7ICdoZWxwZXInOiAkKCksICdlbGVtZW50JzogZWxtLCAnZGF0YSc6IGRyZyB9KTtcblx0XHRcdFx0XHQvL1x0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0Ly9cdH0sIHRoaXMpKVxuXHRcdFx0XHRcdC5vbignZHJvcC5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKCdzdG9wJywgZSwgeyAnaGVscGVyJzogJCgpLCAnZWxlbWVudCc6IGVsbSwgJ2RhdGEnOiBkcmcgfSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHRoaXMucmVkcmF3X25vZGUgPSBmdW5jdGlvbihvYmosIGRlZXAsIGNhbGxiYWNrLCBmb3JjZV9yZW5kZXIpIHtcblx0XHRcdG9iaiA9IHBhcmVudC5yZWRyYXdfbm9kZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0aWYgKG9iaiAmJiB0aGlzLnNldHRpbmdzLmRuZC51c2VfaHRtbDUpIHtcblx0XHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MuZG5kLmxhcmdlX2RyYWdfdGFyZ2V0KSB7XG5cdFx0XHRcdFx0b2JqLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGksIGosIHRtcCA9IG51bGw7XG5cdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZihvYmouY2hpbGROb2Rlc1tpXSAmJiBvYmouY2hpbGROb2Rlc1tpXS5jbGFzc05hbWUgJiYgb2JqLmNoaWxkTm9kZXNbaV0uY2xhc3NOYW1lLmluZGV4T2YoXCJqc3RyZWUtYW5jaG9yXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHR0bXAgPSBvYmouY2hpbGROb2Rlc1tpXTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHRtcCkge1xuXHRcdFx0XHRcdFx0dG1wLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH07XG5cdH07XG5cblx0JChmdW5jdGlvbigpIHtcblx0XHQvLyBiaW5kIG9ubHkgb25jZSBmb3IgYWxsIGluc3RhbmNlc1xuXHRcdHZhciBsYXN0bXYgPSBmYWxzZSxcblx0XHRcdGxhc3RlciA9IGZhbHNlLFxuXHRcdFx0bGFzdGV2ID0gZmFsc2UsXG5cdFx0XHRvcGVudG8gPSBmYWxzZSxcblx0XHRcdG1hcmtlciA9ICQoJzxkaXYgaWQ9XCJqc3RyZWUtbWFya2VyXCI+JiMxNjA7PC9kaXY+JykuaGlkZSgpOyAvLy5hcHBlbmRUbygnYm9keScpO1xuXG5cdFx0JChkb2N1bWVudClcblx0XHRcdC5vbignZHJhZ292ZXIudmFrYXRhLmpzdHJlZScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGlmIChlbG0pIHtcblx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoJ21vdmUnLCBlLCB7ICdoZWxwZXInOiAkKCksICdlbGVtZW50JzogZWxtLCAnZGF0YSc6IGRyZyB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5vbignZHJvcC52YWthdGEuanN0cmVlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKGVsbSkge1xuXHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcignc3RvcCcsIGUsIHsgJ2hlbHBlcic6ICQoKSwgJ2VsZW1lbnQnOiBlbG0sICdkYXRhJzogZHJnIH0pO1xuXHRcdFx0XHRcdGVsbSA9IG51bGw7XG5cdFx0XHRcdFx0ZHJnID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5vbignZG5kX3N0YXJ0LnZha2F0YS5qc3RyZWUnLCBmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRsYXN0bXYgPSBmYWxzZTtcblx0XHRcdFx0bGFzdGV2ID0gZmFsc2U7XG5cdFx0XHRcdGlmKCFkYXRhIHx8ICFkYXRhLmRhdGEgfHwgIWRhdGEuZGF0YS5qc3RyZWUpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdG1hcmtlci5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTsgLy8uc2hvdygpO1xuXHRcdFx0fSlcblx0XHRcdC5vbignZG5kX21vdmUudmFrYXRhLmpzdHJlZScsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdHZhciBpc0RpZmZlcmVudE5vZGUgPSBkYXRhLmV2ZW50LnRhcmdldCAhPT0gbGFzdGV2LnRhcmdldDtcblx0XHRcdFx0aWYob3BlbnRvKSB7XG5cdFx0XHRcdFx0aWYgKCFkYXRhLmV2ZW50IHx8IGRhdGEuZXZlbnQudHlwZSAhPT0gJ2RyYWdvdmVyJyB8fCBpc0RpZmZlcmVudE5vZGUpIHtcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dChvcGVudG8pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZighZGF0YSB8fCAhZGF0YS5kYXRhIHx8ICFkYXRhLmRhdGEuanN0cmVlKSB7IHJldHVybjsgfVxuXG5cdFx0XHRcdC8vIGlmIHdlIGFyZSBob3ZlcmluZyB0aGUgbWFya2VyIGltYWdlIGRvIG5vdGhpbmcgKGNhbiBoYXBwZW4gb24gXCJpbnNpZGVcIiBkcmFncylcblx0XHRcdFx0aWYoZGF0YS5ldmVudC50YXJnZXQuaWQgJiYgZGF0YS5ldmVudC50YXJnZXQuaWQgPT09ICdqc3RyZWUtbWFya2VyJykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsYXN0ZXYgPSBkYXRhLmV2ZW50O1xuXG5cdFx0XHRcdHZhciBpbnMgPSAkLmpzdHJlZS5yZWZlcmVuY2UoZGF0YS5ldmVudC50YXJnZXQpLFxuXHRcdFx0XHRcdHJlZiA9IGZhbHNlLFxuXHRcdFx0XHRcdG9mZiA9IGZhbHNlLFxuXHRcdFx0XHRcdHJlbCA9IGZhbHNlLFxuXHRcdFx0XHRcdHRtcCwgbCwgdCwgaCwgcCwgaSwgbywgb2ssIHQxLCB0Miwgb3AsIHBzLCBwciwgaXAsIHRtLCBpc19jb3B5LCBwbjtcblx0XHRcdFx0Ly8gaWYgd2UgYXJlIG92ZXIgYW4gaW5zdGFuY2Vcblx0XHRcdFx0aWYoaW5zICYmIGlucy5fZGF0YSAmJiBpbnMuX2RhdGEuZG5kKSB7XG5cdFx0XHRcdFx0bWFya2VyLmF0dHIoJ2NsYXNzJywgJ2pzdHJlZS0nICsgaW5zLmdldF90aGVtZSgpICsgKCBpbnMuc2V0dGluZ3MuY29yZS50aGVtZXMucmVzcG9uc2l2ZSA/ICcganN0cmVlLWRuZC1yZXNwb25zaXZlJyA6ICcnICkpO1xuXHRcdFx0XHRcdGlzX2NvcHkgPSBkYXRhLmRhdGEub3JpZ2luICYmIChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5hbHdheXNfY29weSB8fCAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuY29weSAmJiAoZGF0YS5ldmVudC5tZXRhS2V5IHx8IGRhdGEuZXZlbnQuY3RybEtleSkpKTtcblx0XHRcdFx0XHRkYXRhLmhlbHBlclxuXHRcdFx0XHRcdFx0LmNoaWxkcmVuKCkuYXR0cignY2xhc3MnLCAnanN0cmVlLScgKyBpbnMuZ2V0X3RoZW1lKCkgKyAnIGpzdHJlZS0nICsgaW5zLmdldF90aGVtZSgpICsgJy0nICsgaW5zLmdldF90aGVtZV92YXJpYW50KCkgKyAnICcgKyAoIGlucy5zZXR0aW5ncy5jb3JlLnRoZW1lcy5yZXNwb25zaXZlID8gJyBqc3RyZWUtZG5kLXJlc3BvbnNpdmUnIDogJycgKSlcblx0XHRcdFx0XHRcdC5maW5kKCcuanN0cmVlLWNvcHknKS5maXJzdCgpWyBpc19jb3B5ID8gJ3Nob3cnIDogJ2hpZGUnIF0oKTtcblxuXHRcdFx0XHRcdC8vIGlmIGFyZSBob3ZlcmluZyB0aGUgY29udGFpbmVyIGl0c2VsZiBhZGQgYSBuZXcgcm9vdCBub2RlXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhkYXRhLmV2ZW50KTtcblx0XHRcdFx0XHRpZiggKGRhdGEuZXZlbnQudGFyZ2V0ID09PSBpbnMuZWxlbWVudFswXSB8fCBkYXRhLmV2ZW50LnRhcmdldCA9PT0gaW5zLmdldF9jb250YWluZXJfdWwoKVswXSkgJiYgaW5zLmdldF9jb250YWluZXJfdWwoKS5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0b2sgPSB0cnVlO1xuXHRcdFx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBkYXRhLmRhdGEubm9kZXMubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0XHRcdG9rID0gb2sgJiYgaW5zLmNoZWNrKCAoZGF0YS5kYXRhLm9yaWdpbiAmJiAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuYWx3YXlzX2NvcHkgfHwgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmNvcHkgJiYgKGRhdGEuZXZlbnQubWV0YUtleSB8fCBkYXRhLmV2ZW50LmN0cmxLZXkpKSApID8gXCJjb3B5X25vZGVcIiA6IFwibW92ZV9ub2RlXCIpLCAoZGF0YS5kYXRhLm9yaWdpbiAmJiBkYXRhLmRhdGEub3JpZ2luICE9PSBpbnMgPyBkYXRhLmRhdGEub3JpZ2luLmdldF9ub2RlKGRhdGEuZGF0YS5ub2Rlc1t0MV0pIDogZGF0YS5kYXRhLm5vZGVzW3QxXSksICQuanN0cmVlLnJvb3QsICdsYXN0JywgeyAnZG5kJyA6IHRydWUsICdyZWYnIDogaW5zLmdldF9ub2RlKCQuanN0cmVlLnJvb3QpLCAncG9zJyA6ICdpJywgJ29yaWdpbicgOiBkYXRhLmRhdGEub3JpZ2luLCAnaXNfbXVsdGknIDogKGRhdGEuZGF0YS5vcmlnaW4gJiYgZGF0YS5kYXRhLm9yaWdpbiAhPT0gaW5zKSwgJ2lzX2ZvcmVpZ24nIDogKCFkYXRhLmRhdGEub3JpZ2luKSB9KTtcblx0XHRcdFx0XHRcdFx0aWYoIW9rKSB7IGJyZWFrOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihvaykge1xuXHRcdFx0XHRcdFx0XHRsYXN0bXYgPSB7ICdpbnMnIDogaW5zLCAncGFyJyA6ICQuanN0cmVlLnJvb3QsICdwb3MnIDogJ2xhc3QnIH07XG5cdFx0XHRcdFx0XHRcdG1hcmtlci5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdGRhdGEuaGVscGVyLmZpbmQoJy5qc3RyZWUtaWNvbicpLmZpcnN0KCkucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1lcicpLmFkZENsYXNzKCdqc3RyZWUtb2snKTtcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGEuZXZlbnQub3JpZ2luYWxFdmVudCAmJiBkYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gaXNfY29weSA/ICdjb3B5JyA6ICdtb3ZlJztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gaWYgd2UgYXJlIGhvdmVyaW5nIGEgdHJlZSBub2RlXG5cdFx0XHRcdFx0XHRyZWYgPSBpbnMuc2V0dGluZ3MuZG5kLmxhcmdlX2Ryb3BfdGFyZ2V0ID8gJChkYXRhLmV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLmpzdHJlZS1ub2RlJykuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykgOiAkKGRhdGEuZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcuanN0cmVlLWFuY2hvcicpO1xuXHRcdFx0XHRcdFx0aWYocmVmICYmIHJlZi5sZW5ndGggJiYgcmVmLnBhcmVudCgpLmlzKCcuanN0cmVlLWNsb3NlZCwgLmpzdHJlZS1vcGVuLCAuanN0cmVlLWxlYWYnKSkge1xuXHRcdFx0XHRcdFx0XHRvZmYgPSByZWYub2Zmc2V0KCk7XG5cdFx0XHRcdFx0XHRcdHJlbCA9IChkYXRhLmV2ZW50LnBhZ2VZICE9PSB1bmRlZmluZWQgPyBkYXRhLmV2ZW50LnBhZ2VZIDogZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50LnBhZ2VZKSAtIG9mZi50b3A7XG5cdFx0XHRcdFx0XHRcdGggPSByZWYub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0XHRcdFx0aWYocmVsIDwgaCAvIDMpIHtcblx0XHRcdFx0XHRcdFx0XHRvID0gWydiJywgJ2knLCAnYSddO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYocmVsID4gaCAtIGggLyAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0byA9IFsnYScsICdpJywgJ2InXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRvID0gcmVsID4gaCAvIDIgPyBbJ2knLCAnYScsICdiJ10gOiBbJ2knLCAnYicsICdhJ107XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0JC5lYWNoKG8sIGZ1bmN0aW9uIChqLCB2KSB7XG5cdFx0XHRcdFx0XHRcdFx0c3dpdGNoKHYpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2InOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsID0gb2ZmLmxlZnQgLSA2O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0ID0gb2ZmLnRvcDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cCA9IGlucy5nZXRfcGFyZW50KHJlZik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGkgPSByZWYucGFyZW50KCkuaW5kZXgoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdpJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXAgPSBpbnMuc2V0dGluZ3MuZG5kLmluc2lkZV9wb3M7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtID0gaW5zLmdldF9ub2RlKHJlZi5wYXJlbnQoKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGwgPSBvZmYubGVmdCAtIDI7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHQgPSBvZmYudG9wICsgaCAvIDIgKyAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwID0gdG0uaWQ7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGkgPSBpcCA9PT0gJ2ZpcnN0JyA/IDAgOiAoaXAgPT09ICdsYXN0JyA/IHRtLmNoaWxkcmVuLmxlbmd0aCA6IE1hdGgubWluKGlwLCB0bS5jaGlsZHJlbi5sZW5ndGgpKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXNlICdhJzpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bCA9IG9mZi5sZWZ0IC0gNjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dCA9IG9mZi50b3AgKyBoO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwID0gaW5zLmdldF9wYXJlbnQocmVmKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aSA9IHJlZi5wYXJlbnQoKS5pbmRleCgpICsgMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdG9rID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IGRhdGEuZGF0YS5ub2Rlcy5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdG9wID0gZGF0YS5kYXRhLm9yaWdpbiAmJiAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuYWx3YXlzX2NvcHkgfHwgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmNvcHkgJiYgKGRhdGEuZXZlbnQubWV0YUtleSB8fCBkYXRhLmV2ZW50LmN0cmxLZXkpKSkgPyBcImNvcHlfbm9kZVwiIDogXCJtb3ZlX25vZGVcIjtcblx0XHRcdFx0XHRcdFx0XHRcdHBzID0gaTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKG9wID09PSBcIm1vdmVfbm9kZVwiICYmIHYgPT09ICdhJyAmJiAoZGF0YS5kYXRhLm9yaWdpbiAmJiBkYXRhLmRhdGEub3JpZ2luID09PSBpbnMpICYmIHAgPT09IGlucy5nZXRfcGFyZW50KGRhdGEuZGF0YS5ub2Rlc1t0MV0pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHByID0gaW5zLmdldF9ub2RlKHApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihwcyA+ICQuaW5BcnJheShkYXRhLmRhdGEubm9kZXNbdDFdLCBwci5jaGlsZHJlbikpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcyAtPSAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRvayA9IG9rICYmICggKGlucyAmJiBpbnMuc2V0dGluZ3MgJiYgaW5zLnNldHRpbmdzLmRuZCAmJiBpbnMuc2V0dGluZ3MuZG5kLmNoZWNrX3doaWxlX2RyYWdnaW5nID09PSBmYWxzZSkgfHwgaW5zLmNoZWNrKG9wLCAoZGF0YS5kYXRhLm9yaWdpbiAmJiBkYXRhLmRhdGEub3JpZ2luICE9PSBpbnMgPyBkYXRhLmRhdGEub3JpZ2luLmdldF9ub2RlKGRhdGEuZGF0YS5ub2Rlc1t0MV0pIDogZGF0YS5kYXRhLm5vZGVzW3QxXSksIHAsIHBzLCB7ICdkbmQnIDogdHJ1ZSwgJ3JlZicgOiBpbnMuZ2V0X25vZGUocmVmLnBhcmVudCgpKSwgJ3BvcycgOiB2LCAnb3JpZ2luJyA6IGRhdGEuZGF0YS5vcmlnaW4sICdpc19tdWx0aScgOiAoZGF0YS5kYXRhLm9yaWdpbiAmJiBkYXRhLmRhdGEub3JpZ2luICE9PSBpbnMpLCAnaXNfZm9yZWlnbicgOiAoIWRhdGEuZGF0YS5vcmlnaW4pIH0pICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZighb2spIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaW5zICYmIGlucy5sYXN0X2Vycm9yKSB7IGxhc3RlciA9IGlucy5sYXN0X2Vycm9yKCk7IH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmKHYgPT09ICdpJyAmJiByZWYucGFyZW50KCkuaXMoJy5qc3RyZWUtY2xvc2VkJykgJiYgaW5zLnNldHRpbmdzLmRuZC5vcGVuX3RpbWVvdXQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghZGF0YS5ldmVudCB8fCBkYXRhLmV2ZW50LnR5cGUgIT09ICdkcmFnb3ZlcicgfHwgaXNEaWZmZXJlbnROb2RlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChvcGVudG8pIHsgY2xlYXJUaW1lb3V0KG9wZW50byk7IH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0b3BlbnRvID0gc2V0VGltZW91dCgoZnVuY3Rpb24gKHgsIHopIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgeC5vcGVuX25vZGUoeik7IH07IH0oaW5zLCByZWYpKSwgaW5zLnNldHRpbmdzLmRuZC5vcGVuX3RpbWVvdXQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZihvaykge1xuXHRcdFx0XHRcdFx0XHRcdFx0cG4gPSBpbnMuZ2V0X25vZGUocCwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIXBuLmhhc0NsYXNzKCcuanN0cmVlLWRuZC1wYXJlbnQnKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQkKCcuanN0cmVlLWRuZC1wYXJlbnQnKS5yZW1vdmVDbGFzcygnanN0cmVlLWRuZC1wYXJlbnQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG4uYWRkQ2xhc3MoJ2pzdHJlZS1kbmQtcGFyZW50Jyk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRsYXN0bXYgPSB7ICdpbnMnIDogaW5zLCAncGFyJyA6IHAsICdwb3MnIDogdiA9PT0gJ2knICYmIGlwID09PSAnbGFzdCcgJiYgaSA9PT0gMCAmJiAhaW5zLmlzX2xvYWRlZCh0bSkgPyAnbGFzdCcgOiBpIH07XG5cdFx0XHRcdFx0XHRcdFx0XHRtYXJrZXIuY3NzKHsgJ2xlZnQnIDogbCArICdweCcsICd0b3AnIDogdCArICdweCcgfSkuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5oZWxwZXIuZmluZCgnLmpzdHJlZS1pY29uJykuZmlyc3QoKS5yZW1vdmVDbGFzcygnanN0cmVlLWVyJykuYWRkQ2xhc3MoJ2pzdHJlZS1vaycpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGEuZXZlbnQub3JpZ2luYWxFdmVudCAmJiBkYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IGlzX2NvcHkgPyAnY29weScgOiAnbW92ZSc7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRsYXN0ZXIgPSB7fTtcblx0XHRcdFx0XHRcdFx0XHRcdG8gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdGlmKG8gPT09IHRydWUpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCQoJy5qc3RyZWUtZG5kLXBhcmVudCcpLnJlbW92ZUNsYXNzKCdqc3RyZWUtZG5kLXBhcmVudCcpO1xuXHRcdFx0XHRsYXN0bXYgPSBmYWxzZTtcblx0XHRcdFx0ZGF0YS5oZWxwZXIuZmluZCgnLmpzdHJlZS1pY29uJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1vaycpLmFkZENsYXNzKCdqc3RyZWUtZXInKTtcblx0XHRcdFx0aWYgKGRhdGEuZXZlbnQub3JpZ2luYWxFdmVudCAmJiBkYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyKSB7XG5cdFx0XHRcdFx0Ly9kYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbm9uZSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0bWFya2VyLmhpZGUoKTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ2RuZF9zY3JvbGwudmFrYXRhLmpzdHJlZScsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdGlmKCFkYXRhIHx8ICFkYXRhLmRhdGEgfHwgIWRhdGEuZGF0YS5qc3RyZWUpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdG1hcmtlci5oaWRlKCk7XG5cdFx0XHRcdGxhc3RtdiA9IGZhbHNlO1xuXHRcdFx0XHRsYXN0ZXYgPSBmYWxzZTtcblx0XHRcdFx0ZGF0YS5oZWxwZXIuZmluZCgnLmpzdHJlZS1pY29uJykuZmlyc3QoKS5yZW1vdmVDbGFzcygnanN0cmVlLW9rJykuYWRkQ2xhc3MoJ2pzdHJlZS1lcicpO1xuXHRcdFx0fSlcblx0XHRcdC5vbignZG5kX3N0b3AudmFrYXRhLmpzdHJlZScsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdCQoJy5qc3RyZWUtZG5kLXBhcmVudCcpLnJlbW92ZUNsYXNzKCdqc3RyZWUtZG5kLXBhcmVudCcpO1xuXHRcdFx0XHRpZihvcGVudG8pIHsgY2xlYXJUaW1lb3V0KG9wZW50byk7IH1cblx0XHRcdFx0aWYoIWRhdGEgfHwgIWRhdGEuZGF0YSB8fCAhZGF0YS5kYXRhLmpzdHJlZSkgeyByZXR1cm47IH1cblx0XHRcdFx0bWFya2VyLmhpZGUoKS5kZXRhY2goKTtcblx0XHRcdFx0dmFyIGksIGosIG5vZGVzID0gW107XG5cdFx0XHRcdGlmKGxhc3Rtdikge1xuXHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRhdGEuZGF0YS5ub2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdG5vZGVzW2ldID0gZGF0YS5kYXRhLm9yaWdpbiA/IGRhdGEuZGF0YS5vcmlnaW4uZ2V0X25vZGUoZGF0YS5kYXRhLm5vZGVzW2ldKSA6IGRhdGEuZGF0YS5ub2Rlc1tpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGFzdG12Lmluc1sgZGF0YS5kYXRhLm9yaWdpbiAmJiAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuYWx3YXlzX2NvcHkgfHwgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmNvcHkgJiYgKGRhdGEuZXZlbnQubWV0YUtleSB8fCBkYXRhLmV2ZW50LmN0cmxLZXkpKSkgPyAnY29weV9ub2RlJyA6ICdtb3ZlX25vZGUnIF0obm9kZXMsIGxhc3Rtdi5wYXIsIGxhc3Rtdi5wb3MsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGRhdGEuZGF0YS5vcmlnaW4pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGkgPSAkKGRhdGEuZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcuanN0cmVlJyk7XG5cdFx0XHRcdFx0aWYoaS5sZW5ndGggJiYgbGFzdGVyICYmIGxhc3Rlci5lcnJvciAmJiBsYXN0ZXIuZXJyb3IgPT09ICdjaGVjaycpIHtcblx0XHRcdFx0XHRcdGkgPSBpLmpzdHJlZSh0cnVlKTtcblx0XHRcdFx0XHRcdGlmKGkpIHtcblx0XHRcdFx0XHRcdFx0aS5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgbGFzdGVyKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0bGFzdGV2ID0gZmFsc2U7XG5cdFx0XHRcdGxhc3RtdiA9IGZhbHNlO1xuXHRcdFx0fSlcblx0XHRcdC5vbigna2V5dXAuanN0cmVlIGtleWRvd24uanN0cmVlJywgZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0ZGF0YSA9ICQudmFrYXRhLmRuZC5fZ2V0KCk7XG5cdFx0XHRcdGlmKGRhdGEgJiYgZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRpZiAoZS50eXBlID09PSBcImtleXVwXCIgJiYgZS53aGljaCA9PT0gMjcpIHtcblx0XHRcdFx0XHRcdGlmIChvcGVudG8pIHsgY2xlYXJUaW1lb3V0KG9wZW50byk7IH1cblx0XHRcdFx0XHRcdGxhc3RtdiA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0bGFzdGVyID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRsYXN0ZXYgPSBmYWxzZTtcblx0XHRcdFx0XHRcdG9wZW50byA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0bWFya2VyLmhpZGUoKS5kZXRhY2goKTtcblx0XHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fY2xlYW4oKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGF0YS5oZWxwZXIuZmluZCgnLmpzdHJlZS1jb3B5JykuZmlyc3QoKVsgZGF0YS5kYXRhLm9yaWdpbiAmJiAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuYWx3YXlzX2NvcHkgfHwgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmNvcHkgJiYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkpKSkgPyAnc2hvdycgOiAnaGlkZScgXSgpO1xuXHRcdFx0XHRcdFx0aWYobGFzdGV2KSB7XG5cdFx0XHRcdFx0XHRcdGxhc3Rldi5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuXHRcdFx0XHRcdFx0XHRsYXN0ZXYuY3RybEtleSA9IGUuY3RybEtleTtcblx0XHRcdFx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKCdtb3ZlJywgbGFzdGV2KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9KTtcblxuXHQvLyBoZWxwZXJzXG5cdChmdW5jdGlvbiAoJCkge1xuXHRcdCQudmFrYXRhLmh0bWwgPSB7XG5cdFx0XHRkaXYgOiAkKCc8ZGl2IC8+JyksXG5cdFx0XHRlc2NhcGUgOiBmdW5jdGlvbiAoc3RyKSB7XG5cdFx0XHRcdHJldHVybiAkLnZha2F0YS5odG1sLmRpdi50ZXh0KHN0cikuaHRtbCgpO1xuXHRcdFx0fSxcblx0XHRcdHN0cmlwIDogZnVuY3Rpb24gKHN0cikge1xuXHRcdFx0XHRyZXR1cm4gJC52YWthdGEuaHRtbC5kaXYuZW1wdHkoKS5hcHBlbmQoJC5wYXJzZUhUTUwoc3RyKSkudGV4dCgpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0Ly8gcHJpdmF0ZSB2YXJpYWJsZVxuXHRcdHZhciB2YWthdGFfZG5kID0ge1xuXHRcdFx0ZWxlbWVudFx0OiBmYWxzZSxcblx0XHRcdHRhcmdldFx0OiBmYWxzZSxcblx0XHRcdGlzX2Rvd25cdDogZmFsc2UsXG5cdFx0XHRpc19kcmFnXHQ6IGZhbHNlLFxuXHRcdFx0aGVscGVyXHQ6IGZhbHNlLFxuXHRcdFx0aGVscGVyX3c6IDAsXG5cdFx0XHRkYXRhXHQ6IGZhbHNlLFxuXHRcdFx0aW5pdF94XHQ6IDAsXG5cdFx0XHRpbml0X3lcdDogMCxcblx0XHRcdHNjcm9sbF9sOiAwLFxuXHRcdFx0c2Nyb2xsX3Q6IDAsXG5cdFx0XHRzY3JvbGxfZTogZmFsc2UsXG5cdFx0XHRzY3JvbGxfaTogZmFsc2UsXG5cdFx0XHRpc190b3VjaDogZmFsc2Vcblx0XHR9O1xuXHRcdCQudmFrYXRhLmRuZCA9IHtcblx0XHRcdHNldHRpbmdzIDoge1xuXHRcdFx0XHRzY3JvbGxfc3BlZWRcdFx0OiAxMCxcblx0XHRcdFx0c2Nyb2xsX3Byb3hpbWl0eVx0OiAyMCxcblx0XHRcdFx0aGVscGVyX2xlZnRcdFx0XHQ6IDUsXG5cdFx0XHRcdGhlbHBlcl90b3BcdFx0XHQ6IDEwLFxuXHRcdFx0XHR0aHJlc2hvbGRcdFx0XHQ6IDUsXG5cdFx0XHRcdHRocmVzaG9sZF90b3VjaFx0XHQ6IDEwXG5cdFx0XHR9LFxuXHRcdFx0X3RyaWdnZXIgOiBmdW5jdGlvbiAoZXZlbnRfbmFtZSwgZSwgZGF0YSkge1xuXHRcdFx0XHRpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0ZGF0YSA9ICQudmFrYXRhLmRuZC5fZ2V0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGF0YS5ldmVudCA9IGU7XG5cdFx0XHRcdCQoZG9jdW1lbnQpLnRyaWdnZXJIYW5kbGVyKFwiZG5kX1wiICsgZXZlbnRfbmFtZSArIFwiLnZha2F0YVwiLCBkYXRhKTtcblx0XHRcdH0sXG5cdFx0XHRfZ2V0IDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFwiZGF0YVwiXHRcdDogdmFrYXRhX2RuZC5kYXRhLFxuXHRcdFx0XHRcdFwiZWxlbWVudFwiXHQ6IHZha2F0YV9kbmQuZWxlbWVudCxcblx0XHRcdFx0XHRcImhlbHBlclwiXHQ6IHZha2F0YV9kbmQuaGVscGVyXG5cdFx0XHRcdH07XG5cdFx0XHR9LFxuXHRcdFx0X2NsZWFuIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZih2YWthdGFfZG5kLmhlbHBlcikgeyB2YWthdGFfZG5kLmhlbHBlci5yZW1vdmUoKTsgfVxuXHRcdFx0XHRpZih2YWthdGFfZG5kLnNjcm9sbF9pKSB7IGNsZWFySW50ZXJ2YWwodmFrYXRhX2RuZC5zY3JvbGxfaSk7IHZha2F0YV9kbmQuc2Nyb2xsX2kgPSBmYWxzZTsgfVxuXHRcdFx0XHR2YWthdGFfZG5kID0ge1xuXHRcdFx0XHRcdGVsZW1lbnRcdDogZmFsc2UsXG5cdFx0XHRcdFx0dGFyZ2V0XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdGlzX2Rvd25cdDogZmFsc2UsXG5cdFx0XHRcdFx0aXNfZHJhZ1x0OiBmYWxzZSxcblx0XHRcdFx0XHRoZWxwZXJcdDogZmFsc2UsXG5cdFx0XHRcdFx0aGVscGVyX3c6IDAsXG5cdFx0XHRcdFx0ZGF0YVx0OiBmYWxzZSxcblx0XHRcdFx0XHRpbml0X3hcdDogMCxcblx0XHRcdFx0XHRpbml0X3lcdDogMCxcblx0XHRcdFx0XHRzY3JvbGxfbDogMCxcblx0XHRcdFx0XHRzY3JvbGxfdDogMCxcblx0XHRcdFx0XHRzY3JvbGxfZTogZmFsc2UsXG5cdFx0XHRcdFx0c2Nyb2xsX2k6IGZhbHNlLFxuXHRcdFx0XHRcdGlzX3RvdWNoOiBmYWxzZVxuXHRcdFx0XHR9O1xuXHRcdFx0XHQkKGRvY3VtZW50KS5vZmYoXCJtb3VzZW1vdmUudmFrYXRhLmpzdHJlZSB0b3VjaG1vdmUudmFrYXRhLmpzdHJlZVwiLCAkLnZha2F0YS5kbmQuZHJhZyk7XG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9mZihcIm1vdXNldXAudmFrYXRhLmpzdHJlZSB0b3VjaGVuZC52YWthdGEuanN0cmVlXCIsICQudmFrYXRhLmRuZC5zdG9wKTtcblx0XHRcdH0sXG5cdFx0XHRfc2Nyb2xsIDogZnVuY3Rpb24gKGluaXRfb25seSkge1xuXHRcdFx0XHRpZighdmFrYXRhX2RuZC5zY3JvbGxfZSB8fCAoIXZha2F0YV9kbmQuc2Nyb2xsX2wgJiYgIXZha2F0YV9kbmQuc2Nyb2xsX3QpKSB7XG5cdFx0XHRcdFx0aWYodmFrYXRhX2RuZC5zY3JvbGxfaSkgeyBjbGVhckludGVydmFsKHZha2F0YV9kbmQuc2Nyb2xsX2kpOyB2YWthdGFfZG5kLnNjcm9sbF9pID0gZmFsc2U7IH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIXZha2F0YV9kbmQuc2Nyb2xsX2kpIHtcblx0XHRcdFx0XHR2YWthdGFfZG5kLnNjcm9sbF9pID0gc2V0SW50ZXJ2YWwoJC52YWthdGEuZG5kLl9zY3JvbGwsIDEwMCk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKGluaXRfb25seSA9PT0gdHJ1ZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdFx0XHR2YXIgaSA9IHZha2F0YV9kbmQuc2Nyb2xsX2Uuc2Nyb2xsVG9wKCksXG5cdFx0XHRcdFx0aiA9IHZha2F0YV9kbmQuc2Nyb2xsX2Uuc2Nyb2xsTGVmdCgpO1xuXHRcdFx0XHR2YWthdGFfZG5kLnNjcm9sbF9lLnNjcm9sbFRvcChpICsgdmFrYXRhX2RuZC5zY3JvbGxfdCAqICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfc3BlZWQpO1xuXHRcdFx0XHR2YWthdGFfZG5kLnNjcm9sbF9lLnNjcm9sbExlZnQoaiArIHZha2F0YV9kbmQuc2Nyb2xsX2wgKiAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3NwZWVkKTtcblx0XHRcdFx0aWYoaSAhPT0gdmFrYXRhX2RuZC5zY3JvbGxfZS5zY3JvbGxUb3AoKSB8fCBqICE9PSB2YWthdGFfZG5kLnNjcm9sbF9lLnNjcm9sbExlZnQoKSkge1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIHRyaWdnZXJlZCBvbiB0aGUgZG9jdW1lbnQgd2hlbiBhIGRyYWcgY2F1c2VzIGFuIGVsZW1lbnQgdG8gc2Nyb2xsXG5cdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0ICogQHBsdWdpbiBkbmRcblx0XHRcdFx0XHQgKiBAbmFtZSBkbmRfc2Nyb2xsLnZha2F0YVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGRhdGEgYW55IGRhdGEgc3VwcGxpZWQgd2l0aCB0aGUgY2FsbCB0byAkLnZha2F0YS5kbmQuc3RhcnRcblx0XHRcdFx0XHQgKiBAcGFyYW0ge0RPTX0gZWxlbWVudCB0aGUgRE9NIGVsZW1lbnQgYmVpbmcgZHJhZ2dlZFxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBoZWxwZXIgdGhlIGhlbHBlciBzaG93biBuZXh0IHRvIHRoZSBtb3VzZVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBldmVudCB0aGUgZWxlbWVudCB0aGF0IGlzIHNjcm9sbGluZ1xuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcihcInNjcm9sbFwiLCB2YWthdGFfZG5kLnNjcm9sbF9lKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHN0YXJ0IDogZnVuY3Rpb24gKGUsIGRhdGEsIGh0bWwpIHtcblx0XHRcdFx0aWYoZS50eXBlID09PSBcInRvdWNoc3RhcnRcIiAmJiBlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSkge1xuXHRcdFx0XHRcdGUucGFnZVggPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG5cdFx0XHRcdFx0ZS5wYWdlWSA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcblx0XHRcdFx0XHRlLnRhcmdldCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93LnBhZ2VYT2Zmc2V0LCBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHZha2F0YV9kbmQuaXNfZHJhZykgeyAkLnZha2F0YS5kbmQuc3RvcCh7fSk7IH1cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRlLmN1cnJlbnRUYXJnZXQudW5zZWxlY3RhYmxlID0gXCJvblwiO1xuXHRcdFx0XHRcdGUuY3VycmVudFRhcmdldC5vbnNlbGVjdHN0YXJ0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZTsgfTtcblx0XHRcdFx0XHRpZihlLmN1cnJlbnRUYXJnZXQuc3R5bGUpIHtcblx0XHRcdFx0XHRcdGUuY3VycmVudFRhcmdldC5zdHlsZS50b3VjaEFjdGlvbiA9IFwibm9uZVwiO1xuXHRcdFx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm1zVG91Y2hBY3Rpb24gPSBcIm5vbmVcIjtcblx0XHRcdFx0XHRcdGUuY3VycmVudFRhcmdldC5zdHlsZS5Nb3pVc2VyU2VsZWN0ID0gXCJub25lXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoKGlnbm9yZSkgeyB9XG5cdFx0XHRcdHZha2F0YV9kbmQuaW5pdF94XHQ9IGUucGFnZVg7XG5cdFx0XHRcdHZha2F0YV9kbmQuaW5pdF95XHQ9IGUucGFnZVk7XG5cdFx0XHRcdHZha2F0YV9kbmQuZGF0YVx0XHQ9IGRhdGE7XG5cdFx0XHRcdHZha2F0YV9kbmQuaXNfZG93blx0PSB0cnVlO1xuXHRcdFx0XHR2YWthdGFfZG5kLmVsZW1lbnRcdD0gZS5jdXJyZW50VGFyZ2V0O1xuXHRcdFx0XHR2YWthdGFfZG5kLnRhcmdldFx0PSBlLnRhcmdldDtcblx0XHRcdFx0dmFrYXRhX2RuZC5pc190b3VjaFx0PSBlLnR5cGUgPT09IFwidG91Y2hzdGFydFwiO1xuXHRcdFx0XHRpZihodG1sICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdHZha2F0YV9kbmQuaGVscGVyID0gJChcIjxkaXYgaWQ9J3Zha2F0YS1kbmQnPjwvZGl2PlwiKS5odG1sKGh0bWwpLmNzcyh7XG5cdFx0XHRcdFx0XHRcImRpc3BsYXlcIlx0XHQ6IFwiYmxvY2tcIixcblx0XHRcdFx0XHRcdFwibWFyZ2luXCJcdFx0OiBcIjBcIixcblx0XHRcdFx0XHRcdFwicGFkZGluZ1wiXHRcdDogXCIwXCIsXG5cdFx0XHRcdFx0XHRcInBvc2l0aW9uXCJcdFx0OiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0XHRcInRvcFwiXHRcdFx0OiBcIi0yMDAwcHhcIixcblx0XHRcdFx0XHRcdFwibGluZUhlaWdodFwiXHQ6IFwiMTZweFwiLFxuXHRcdFx0XHRcdFx0XCJ6SW5kZXhcIlx0XHQ6IFwiMTAwMDBcIlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9uKFwibW91c2Vtb3ZlLnZha2F0YS5qc3RyZWUgdG91Y2htb3ZlLnZha2F0YS5qc3RyZWVcIiwgJC52YWthdGEuZG5kLmRyYWcpO1xuXHRcdFx0XHQkKGRvY3VtZW50KS5vbihcIm1vdXNldXAudmFrYXRhLmpzdHJlZSB0b3VjaGVuZC52YWthdGEuanN0cmVlXCIsICQudmFrYXRhLmRuZC5zdG9wKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdGRyYWcgOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRpZihlLnR5cGUgPT09IFwidG91Y2htb3ZlXCIgJiYgZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcyAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0pIHtcblx0XHRcdFx0XHRlLnBhZ2VYID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuXHRcdFx0XHRcdGUucGFnZVkgPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVk7XG5cdFx0XHRcdFx0ZS50YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZIC0gd2luZG93LnBhZ2VZT2Zmc2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighdmFrYXRhX2RuZC5pc19kb3duKSB7IHJldHVybjsgfVxuXHRcdFx0XHRpZighdmFrYXRhX2RuZC5pc19kcmFnKSB7XG5cdFx0XHRcdFx0aWYoXG5cdFx0XHRcdFx0XHRNYXRoLmFicyhlLnBhZ2VYIC0gdmFrYXRhX2RuZC5pbml0X3gpID4gKHZha2F0YV9kbmQuaXNfdG91Y2ggPyAkLnZha2F0YS5kbmQuc2V0dGluZ3MudGhyZXNob2xkX3RvdWNoIDogJC52YWthdGEuZG5kLnNldHRpbmdzLnRocmVzaG9sZCkgfHxcblx0XHRcdFx0XHRcdE1hdGguYWJzKGUucGFnZVkgLSB2YWthdGFfZG5kLmluaXRfeSkgPiAodmFrYXRhX2RuZC5pc190b3VjaCA/ICQudmFrYXRhLmRuZC5zZXR0aW5ncy50aHJlc2hvbGRfdG91Y2ggOiAkLnZha2F0YS5kbmQuc2V0dGluZ3MudGhyZXNob2xkKVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0aWYodmFrYXRhX2RuZC5oZWxwZXIpIHtcblx0XHRcdFx0XHRcdFx0dmFrYXRhX2RuZC5oZWxwZXIuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5cdFx0XHRcdFx0XHRcdHZha2F0YV9kbmQuaGVscGVyX3cgPSB2YWthdGFfZG5kLmhlbHBlci5vdXRlcldpZHRoKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2YWthdGFfZG5kLmlzX2RyYWcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0JCh2YWthdGFfZG5kLnRhcmdldCkub25lKCdjbGljay52YWthdGEnLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHRcdCAqIHRyaWdnZXJlZCBvbiB0aGUgZG9jdW1lbnQgd2hlbiBhIGRyYWcgc3RhcnRzXG5cdFx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0XHRcdFx0XHQgKiBAbmFtZSBkbmRfc3RhcnQudmFrYXRhXG5cdFx0XHRcdFx0XHQgKiBAcGFyYW0ge01peGVkfSBkYXRhIGFueSBkYXRhIHN1cHBsaWVkIHdpdGggdGhlIGNhbGwgdG8gJC52YWthdGEuZG5kLnN0YXJ0XG5cdFx0XHRcdFx0XHQgKiBAcGFyYW0ge0RPTX0gZWxlbWVudCB0aGUgRE9NIGVsZW1lbnQgYmVpbmcgZHJhZ2dlZFxuXHRcdFx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IGhlbHBlciB0aGUgaGVscGVyIHNob3duIG5leHQgdG8gdGhlIG1vdXNlXG5cdFx0XHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIGV2ZW50IHRoYXQgY2F1c2VkIHRoZSBzdGFydCAocHJvYmFibHkgbW91c2Vtb3ZlKVxuXHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoXCJzdGFydFwiLCBlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7IHJldHVybjsgfVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGQgID0gZmFsc2UsIHcgID0gZmFsc2UsXG5cdFx0XHRcdFx0ZGggPSBmYWxzZSwgd2ggPSBmYWxzZSxcblx0XHRcdFx0XHRkdyA9IGZhbHNlLCB3dyA9IGZhbHNlLFxuXHRcdFx0XHRcdGR0ID0gZmFsc2UsIGRsID0gZmFsc2UsXG5cdFx0XHRcdFx0aHQgPSBmYWxzZSwgaGwgPSBmYWxzZTtcblxuXHRcdFx0XHR2YWthdGFfZG5kLnNjcm9sbF90ID0gMDtcblx0XHRcdFx0dmFrYXRhX2RuZC5zY3JvbGxfbCA9IDA7XG5cdFx0XHRcdHZha2F0YV9kbmQuc2Nyb2xsX2UgPSBmYWxzZTtcblx0XHRcdFx0JCgkKGUudGFyZ2V0KS5wYXJlbnRzVW50aWwoXCJib2R5XCIpLmFkZEJhY2soKS5nZXQoKS5yZXZlcnNlKCkpXG5cdFx0XHRcdFx0LmZpbHRlcihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm5cdCgvXmF1dG98c2Nyb2xsJC8pLnRlc3QoJCh0aGlzKS5jc3MoXCJvdmVyZmxvd1wiKSkgJiZcblx0XHRcdFx0XHRcdFx0XHQodGhpcy5zY3JvbGxIZWlnaHQgPiB0aGlzLm9mZnNldEhlaWdodCB8fCB0aGlzLnNjcm9sbFdpZHRoID4gdGhpcy5vZmZzZXRXaWR0aCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2YXIgdCA9ICQodGhpcyksIG8gPSB0Lm9mZnNldCgpO1xuXHRcdFx0XHRcdFx0aWYodGhpcy5zY3JvbGxIZWlnaHQgPiB0aGlzLm9mZnNldEhlaWdodCkge1xuXHRcdFx0XHRcdFx0XHRpZihvLnRvcCArIHQuaGVpZ2h0KCkgLSBlLnBhZ2VZIDwgJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9wcm94aW1pdHkpXHR7IHZha2F0YV9kbmQuc2Nyb2xsX3QgPSAxOyB9XG5cdFx0XHRcdFx0XHRcdGlmKGUucGFnZVkgLSBvLnRvcCA8ICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfcHJveGltaXR5KVx0XHRcdFx0eyB2YWthdGFfZG5kLnNjcm9sbF90ID0gLTE7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHRoaXMuc2Nyb2xsV2lkdGggPiB0aGlzLm9mZnNldFdpZHRoKSB7XG5cdFx0XHRcdFx0XHRcdGlmKG8ubGVmdCArIHQud2lkdGgoKSAtIGUucGFnZVggPCAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3Byb3hpbWl0eSlcdHsgdmFrYXRhX2RuZC5zY3JvbGxfbCA9IDE7IH1cblx0XHRcdFx0XHRcdFx0aWYoZS5wYWdlWCAtIG8ubGVmdCA8ICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfcHJveGltaXR5KVx0XHRcdFx0eyB2YWthdGFfZG5kLnNjcm9sbF9sID0gLTE7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHZha2F0YV9kbmQuc2Nyb2xsX3QgfHwgdmFrYXRhX2RuZC5zY3JvbGxfbCkge1xuXHRcdFx0XHRcdFx0XHR2YWthdGFfZG5kLnNjcm9sbF9lID0gJCh0aGlzKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmKCF2YWthdGFfZG5kLnNjcm9sbF9lKSB7XG5cdFx0XHRcdFx0ZCAgPSAkKGRvY3VtZW50KTsgdyA9ICQod2luZG93KTtcblx0XHRcdFx0XHRkaCA9IGQuaGVpZ2h0KCk7IHdoID0gdy5oZWlnaHQoKTtcblx0XHRcdFx0XHRkdyA9IGQud2lkdGgoKTsgd3cgPSB3LndpZHRoKCk7XG5cdFx0XHRcdFx0ZHQgPSBkLnNjcm9sbFRvcCgpOyBkbCA9IGQuc2Nyb2xsTGVmdCgpO1xuXHRcdFx0XHRcdGlmKGRoID4gd2ggJiYgZS5wYWdlWSAtIGR0IDwgJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9wcm94aW1pdHkpXHRcdHsgdmFrYXRhX2RuZC5zY3JvbGxfdCA9IC0xOyAgfVxuXHRcdFx0XHRcdGlmKGRoID4gd2ggJiYgd2ggLSAoZS5wYWdlWSAtIGR0KSA8ICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfcHJveGltaXR5KVx0eyB2YWthdGFfZG5kLnNjcm9sbF90ID0gMTsgfVxuXHRcdFx0XHRcdGlmKGR3ID4gd3cgJiYgZS5wYWdlWCAtIGRsIDwgJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9wcm94aW1pdHkpXHRcdHsgdmFrYXRhX2RuZC5zY3JvbGxfbCA9IC0xOyB9XG5cdFx0XHRcdFx0aWYoZHcgPiB3dyAmJiB3dyAtIChlLnBhZ2VYIC0gZGwpIDwgJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9wcm94aW1pdHkpXHR7IHZha2F0YV9kbmQuc2Nyb2xsX2wgPSAxOyB9XG5cdFx0XHRcdFx0aWYodmFrYXRhX2RuZC5zY3JvbGxfdCB8fCB2YWthdGFfZG5kLnNjcm9sbF9sKSB7XG5cdFx0XHRcdFx0XHR2YWthdGFfZG5kLnNjcm9sbF9lID0gZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYodmFrYXRhX2RuZC5zY3JvbGxfZSkgeyAkLnZha2F0YS5kbmQuX3Njcm9sbCh0cnVlKTsgfVxuXG5cdFx0XHRcdGlmKHZha2F0YV9kbmQuaGVscGVyKSB7XG5cdFx0XHRcdFx0aHQgPSBwYXJzZUludChlLnBhZ2VZICsgJC52YWthdGEuZG5kLnNldHRpbmdzLmhlbHBlcl90b3AsIDEwKTtcblx0XHRcdFx0XHRobCA9IHBhcnNlSW50KGUucGFnZVggKyAkLnZha2F0YS5kbmQuc2V0dGluZ3MuaGVscGVyX2xlZnQsIDEwKTtcblx0XHRcdFx0XHRpZihkaCAmJiBodCArIDI1ID4gZGgpIHsgaHQgPSBkaCAtIDUwOyB9XG5cdFx0XHRcdFx0aWYoZHcgJiYgaGwgKyB2YWthdGFfZG5kLmhlbHBlcl93ID4gZHcpIHsgaGwgPSBkdyAtICh2YWthdGFfZG5kLmhlbHBlcl93ICsgMik7IH1cblx0XHRcdFx0XHR2YWthdGFfZG5kLmhlbHBlci5jc3Moe1xuXHRcdFx0XHRcdFx0bGVmdFx0OiBobCArIFwicHhcIixcblx0XHRcdFx0XHRcdHRvcFx0XHQ6IGh0ICsgXCJweFwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCBvbiB0aGUgZG9jdW1lbnQgd2hlbiBhIGRyYWcgaXMgaW4gcHJvZ3Jlc3Ncblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0XHRcdCAqIEBuYW1lIGRuZF9tb3ZlLnZha2F0YVxuXHRcdFx0XHQgKiBAcGFyYW0ge01peGVkfSBkYXRhIGFueSBkYXRhIHN1cHBsaWVkIHdpdGggdGhlIGNhbGwgdG8gJC52YWthdGEuZG5kLnN0YXJ0XG5cdFx0XHRcdCAqIEBwYXJhbSB7RE9NfSBlbGVtZW50IHRoZSBET00gZWxlbWVudCBiZWluZyBkcmFnZ2VkXG5cdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBoZWxwZXIgdGhlIGhlbHBlciBzaG93biBuZXh0IHRvIHRoZSBtb3VzZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIGV2ZW50IHRoYXQgY2F1c2VkIHRoaXMgdG8gdHJpZ2dlciAobW9zdCBsaWtlbHkgbW91c2Vtb3ZlKVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKFwibW92ZVwiLCBlKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdHN0b3AgOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRpZihlLnR5cGUgPT09IFwidG91Y2hlbmRcIiAmJiBlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSkge1xuXHRcdFx0XHRcdGUucGFnZVggPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG5cdFx0XHRcdFx0ZS5wYWdlWSA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcblx0XHRcdFx0XHRlLnRhcmdldCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93LnBhZ2VYT2Zmc2V0LCBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHZha2F0YV9kbmQuaXNfZHJhZykge1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIHRyaWdnZXJlZCBvbiB0aGUgZG9jdW1lbnQgd2hlbiBhIGRyYWcgc3RvcHMgKHRoZSBkcmFnZ2VkIGVsZW1lbnQgaXMgZHJvcHBlZClcblx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdFx0XHRcdCAqIEBuYW1lIGRuZF9zdG9wLnZha2F0YVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGRhdGEgYW55IGRhdGEgc3VwcGxpZWQgd2l0aCB0aGUgY2FsbCB0byAkLnZha2F0YS5kbmQuc3RhcnRcblx0XHRcdFx0XHQgKiBAcGFyYW0ge0RPTX0gZWxlbWVudCB0aGUgRE9NIGVsZW1lbnQgYmVpbmcgZHJhZ2dlZFxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBoZWxwZXIgdGhlIGhlbHBlciBzaG93biBuZXh0IHRvIHRoZSBtb3VzZVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgZXZlbnQgdGhhdCBjYXVzZWQgdGhlIHN0b3Bcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRpZiAoZS50YXJnZXQgIT09IHZha2F0YV9kbmQudGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHQkKHZha2F0YV9kbmQudGFyZ2V0KS5vZmYoJ2NsaWNrLnZha2F0YScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoXCJzdG9wXCIsIGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGlmKGUudHlwZSA9PT0gXCJ0b3VjaGVuZFwiICYmIGUudGFyZ2V0ID09PSB2YWthdGFfZG5kLnRhcmdldCkge1xuXHRcdFx0XHRcdFx0dmFyIHRvID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7ICQoZS50YXJnZXQpLmNsaWNrKCk7IH0sIDEwMCk7XG5cdFx0XHRcdFx0XHQkKGUudGFyZ2V0KS5vbmUoJ2NsaWNrJywgZnVuY3Rpb24oKSB7IGlmKHRvKSB7IGNsZWFyVGltZW91dCh0byk7IH0gfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCQudmFrYXRhLmRuZC5fY2xlYW4oKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0oJCkpO1xuXG5cdC8vIGluY2x1ZGUgdGhlIGRuZCBwbHVnaW4gYnkgZGVmYXVsdFxuXHQvLyAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zLnB1c2goXCJkbmRcIik7XG5cblxuLyoqXG4gKiAjIyMgTWFzc2xvYWQgcGx1Z2luXG4gKlxuICogQWRkcyBtYXNzbG9hZCBmdW5jdGlvbmFsaXR5IHRvIGpzVHJlZSwgc28gdGhhdCBtdWx0aXBsZSBub2RlcyBjYW4gYmUgbG9hZGVkIGluIGEgc2luZ2xlIHJlcXVlc3QgKG9ubHkgdXNlZnVsIHdpdGggbGF6eSBsb2FkaW5nKS5cbiAqL1xuXG5cdC8qKlxuXHQgKiBtYXNzbG9hZCBjb25maWd1cmF0aW9uXG5cdCAqXG5cdCAqIEl0IGlzIHBvc3NpYmxlIHRvIHNldCB0aGlzIHRvIGEgc3RhbmRhcmQgalF1ZXJ5LWxpa2UgQUpBWCBjb25maWcuXG5cdCAqIEluIGFkZGl0aW9uIHRvIHRoZSBzdGFuZGFyZCBqUXVlcnkgYWpheCBvcHRpb25zIGhlcmUgeW91IGNhbiBzdXBwbHkgZnVuY3Rpb25zIGZvciBgZGF0YWAgYW5kIGB1cmxgLCB0aGUgZnVuY3Rpb25zIHdpbGwgYmUgcnVuIGluIHRoZSBjdXJyZW50IGluc3RhbmNlJ3Mgc2NvcGUgYW5kIGEgcGFyYW0gd2lsbCBiZSBwYXNzZWQgaW5kaWNhdGluZyB3aGljaCBub2RlIElEcyBuZWVkIHRvIGJlIGxvYWRlZCwgdGhlIHJldHVybiB2YWx1ZSBvZiB0aG9zZSBmdW5jdGlvbnMgd2lsbCBiZSB1c2VkLlxuXHQgKlxuXHQgKiBZb3UgY2FuIGFsc28gc2V0IHRoaXMgdG8gYSBmdW5jdGlvbiwgdGhhdCBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgdGhlIG5vZGUgSURzIGJlaW5nIGxvYWRlZCBhcyBhcmd1bWVudCBhbmQgYSBzZWNvbmQgcGFyYW0gd2hpY2ggaXMgYSBmdW5jdGlvbiAoY2FsbGJhY2spIHdoaWNoIHNob3VsZCBiZSBjYWxsZWQgd2l0aCB0aGUgcmVzdWx0LlxuXHQgKlxuXHQgKiBCb3RoIHRoZSBBSkFYIGFuZCB0aGUgZnVuY3Rpb24gYXBwcm9hY2ggcmVseSBvbiB0aGUgc2FtZSByZXR1cm4gdmFsdWUgLSBhbiBvYmplY3Qgd2hlcmUgdGhlIGtleXMgYXJlIHRoZSBub2RlIElEcywgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgY2hpbGRyZW4gb2YgdGhhdCBub2RlIGFzIGFuIGFycmF5LlxuXHQgKlxuXHQgKlx0e1xuXHQgKlx0XHRcImlkMVwiIDogW3sgXCJ0ZXh0XCIgOiBcIkNoaWxkIG9mIElEMVwiLCBcImlkXCIgOiBcImMxXCIgfSwgeyBcInRleHRcIiA6IFwiQW5vdGhlciBjaGlsZCBvZiBJRDFcIiwgXCJpZFwiIDogXCJjMlwiIH1dLFxuXHQgKlx0XHRcImlkMlwiIDogW3sgXCJ0ZXh0XCIgOiBcIkNoaWxkIG9mIElEMlwiLCBcImlkXCIgOiBcImMzXCIgfV1cblx0ICpcdH1cblx0ICogXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLm1hc3Nsb2FkXG5cdCAqIEBwbHVnaW4gbWFzc2xvYWRcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLm1hc3Nsb2FkID0gbnVsbDtcblx0JC5qc3RyZWUucGx1Z2lucy5tYXNzbG9hZCA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcblx0XHRcdHRoaXMuX2RhdGEubWFzc2xvYWQgPSB7fTtcblx0XHRcdHBhcmVudC5pbml0LmNhbGwodGhpcywgZWwsIG9wdGlvbnMpO1xuXHRcdH07XG5cdFx0dGhpcy5fbG9hZF9ub2RlcyA9IGZ1bmN0aW9uIChub2RlcywgY2FsbGJhY2ssIGlzX2NhbGxiYWNrLCBmb3JjZV9yZWxvYWQpIHtcblx0XHRcdHZhciBzID0gdGhpcy5zZXR0aW5ncy5tYXNzbG9hZCxcblx0XHRcdFx0bm9kZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShub2RlcyksXG5cdFx0XHRcdHRvTG9hZCA9IFtdLFxuXHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0aSwgaiwgZG9tO1xuXHRcdFx0aWYgKCFpc19jYWxsYmFjaykge1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBub2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZighbVtub2Rlc1tpXV0gfHwgKCAoIW1bbm9kZXNbaV1dLnN0YXRlLmxvYWRlZCAmJiAhbVtub2Rlc1tpXV0uc3RhdGUuZmFpbGVkKSB8fCBmb3JjZV9yZWxvYWQpICkge1xuXHRcdFx0XHRcdFx0dG9Mb2FkLnB1c2gobm9kZXNbaV0pO1xuXHRcdFx0XHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShub2Rlc1tpXSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRpZiAoZG9tICYmIGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0ZG9tLmFkZENsYXNzKFwianN0cmVlLWxvYWRpbmdcIikuYXR0cignYXJpYS1idXN5Jyx0cnVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fZGF0YS5tYXNzbG9hZCA9IHt9O1xuXHRcdFx0XHRpZiAodG9Mb2FkLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlmKCQuaXNGdW5jdGlvbihzKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHMuY2FsbCh0aGlzLCB0b0xvYWQsICQucHJveHkoZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGksIGo7XG5cdFx0XHRcdFx0XHRcdGlmKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IoaSBpbiBkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkYXRhLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEubWFzc2xvYWRbaV0gPSBkYXRhW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBub2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG5vZGVzW2ldLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZG9tICYmIGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGRvbS5yZW1vdmVDbGFzcyhcImpzdHJlZS1sb2FkaW5nXCIpLmF0dHIoJ2FyaWEtYnVzeScsZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwYXJlbnQuX2xvYWRfbm9kZXMuY2FsbCh0aGlzLCBub2RlcywgY2FsbGJhY2ssIGlzX2NhbGxiYWNrLCBmb3JjZV9yZWxvYWQpO1xuXHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih0eXBlb2YgcyA9PT0gJ29iamVjdCcgJiYgcyAmJiBzLnVybCkge1xuXHRcdFx0XHRcdFx0cyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzKTtcblx0XHRcdFx0XHRcdGlmKCQuaXNGdW5jdGlvbihzLnVybCkpIHtcblx0XHRcdFx0XHRcdFx0cy51cmwgPSBzLnVybC5jYWxsKHRoaXMsIHRvTG9hZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZigkLmlzRnVuY3Rpb24ocy5kYXRhKSkge1xuXHRcdFx0XHRcdFx0XHRzLmRhdGEgPSBzLmRhdGEuY2FsbCh0aGlzLCB0b0xvYWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuICQuYWpheChzKVxuXHRcdFx0XHRcdFx0XHQuZG9uZSgkLnByb3h5KGZ1bmN0aW9uIChkYXRhLHQseCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGksIGo7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvcihpIGluIGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihkYXRhLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLm1hc3Nsb2FkW2ldID0gZGF0YVtpXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IG5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG5vZGVzW2ldLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRvbSAmJiBkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKFwianN0cmVlLWxvYWRpbmdcIikuYXR0cignYXJpYS1idXN5JyxmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudC5fbG9hZF9ub2Rlcy5jYWxsKHRoaXMsIG5vZGVzLCBjYWxsYmFjaywgaXNfY2FsbGJhY2ssIGZvcmNlX3JlbG9hZCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdFx0XHRcdC5mYWlsKCQucHJveHkoZnVuY3Rpb24gKGYpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudC5fbG9hZF9ub2Rlcy5jYWxsKHRoaXMsIG5vZGVzLCBjYWxsYmFjaywgaXNfY2FsbGJhY2ssIGZvcmNlX3JlbG9hZCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhcmVudC5fbG9hZF9ub2Rlcy5jYWxsKHRoaXMsIG5vZGVzLCBjYWxsYmFjaywgaXNfY2FsbGJhY2ssIGZvcmNlX3JlbG9hZCk7XG5cdFx0fTtcblx0XHR0aGlzLl9sb2FkX25vZGUgPSBmdW5jdGlvbiAob2JqLCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhLm1hc3Nsb2FkW29iai5pZF0sXG5cdFx0XHRcdHJzbHQgPSBudWxsLCBkb207XG5cdFx0XHRpZihkYXRhKSB7XG5cdFx0XHRcdHJzbHQgPSB0aGlzW3R5cGVvZiBkYXRhID09PSAnc3RyaW5nJyA/ICdfYXBwZW5kX2h0bWxfZGF0YScgOiAnX2FwcGVuZF9qc29uX2RhdGEnXShcblx0XHRcdFx0XHRvYmosXG5cdFx0XHRcdFx0dHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gJCgkLnBhcnNlSFRNTChkYXRhKSkuZmlsdGVyKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMubm9kZVR5cGUgIT09IDM7IH0pIDogZGF0YSxcblx0XHRcdFx0XHRmdW5jdGlvbiAoc3RhdHVzKSB7IGNhbGxiYWNrLmNhbGwodGhpcywgc3RhdHVzKTsgfVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iai5pZCwgdHJ1ZSk7XG5cdFx0XHRcdGlmIChkb20gJiYgZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdGRvbS5yZW1vdmVDbGFzcyhcImpzdHJlZS1sb2FkaW5nXCIpLmF0dHIoJ2FyaWEtYnVzeScsZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLl9kYXRhLm1hc3Nsb2FkW29iai5pZF07XG5cdFx0XHRcdHJldHVybiByc2x0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhcmVudC5fbG9hZF9ub2RlLmNhbGwodGhpcywgb2JqLCBjYWxsYmFjayk7XG5cdFx0fTtcblx0fTtcblxuLyoqXG4gKiAjIyMgU2VhcmNoIHBsdWdpblxuICpcbiAqIEFkZHMgc2VhcmNoIGZ1bmN0aW9uYWxpdHkgdG8ganNUcmVlLlxuICovXG5cblx0LyoqXG5cdCAqIHN0b3JlcyBhbGwgZGVmYXVsdHMgZm9yIHRoZSBzZWFyY2ggcGx1Z2luXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaFxuXHQgKiBAcGx1Z2luIHNlYXJjaFxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoID0ge1xuXHRcdC8qKlxuXHRcdCAqIGEgalF1ZXJ5LWxpa2UgQUpBWCBjb25maWcsIHdoaWNoIGpzdHJlZSB1c2VzIGlmIGEgc2VydmVyIHNob3VsZCBiZSBxdWVyaWVkIGZvciByZXN1bHRzLlxuXHRcdCAqXG5cdFx0ICogQSBgc3RyYCAod2hpY2ggaXMgdGhlIHNlYXJjaCBzdHJpbmcpIHBhcmFtZXRlciB3aWxsIGJlIGFkZGVkIHdpdGggdGhlIHJlcXVlc3QsIGFuIG9wdGlvbmFsIGBpbnNpZGVgIHBhcmFtZXRlciB3aWxsIGJlIGFkZGVkIGlmIHRoZSBzZWFyY2ggaXMgbGltaXRlZCB0byBhIG5vZGUgaWQuIFRoZSBleHBlY3RlZCByZXN1bHQgaXMgYSBKU09OIGFycmF5IHdpdGggbm9kZXMgdGhhdCBuZWVkIHRvIGJlIG9wZW5lZCBzbyB0aGF0IG1hdGNoaW5nIG5vZGVzIHdpbGwgYmUgcmV2ZWFsZWQuXG5cdFx0ICogTGVhdmUgdGhpcyBzZXR0aW5nIGFzIGBmYWxzZWAgdG8gbm90IHF1ZXJ5IHRoZSBzZXJ2ZXIuIFlvdSBjYW4gYWxzbyBzZXQgdGhpcyB0byBhIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGJlIGludm9rZWQgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUgYW5kIHJlY2VpdmUgMyBwYXJhbWV0ZXJzIC0gdGhlIHNlYXJjaCBzdHJpbmcsIHRoZSBjYWxsYmFjayB0byBjYWxsIHdpdGggdGhlIGFycmF5IG9mIG5vZGVzIHRvIGxvYWQsIGFuZCB0aGUgb3B0aW9uYWwgbm9kZSBJRCB0byBsaW1pdCB0aGUgc2VhcmNoIHRvXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoLmFqYXhcblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqL1xuXHRcdGFqYXggOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgdGhlIHNlYXJjaCBzaG91bGQgYmUgZnV6enkgb3Igbm90IChzaG91bGQgYGNobmQzYCBtYXRjaCBgY2hpbGQgbm9kZSAzYCkuIERlZmF1bHQgaXMgYGZhbHNlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2guZnV6enlcblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqL1xuXHRcdGZ1enp5IDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIHRoZSBzZWFyY2ggc2hvdWxkIGJlIGNhc2Ugc2Vuc2l0aXZlLiBEZWZhdWx0IGlzIGBmYWxzZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoLmNhc2Vfc2Vuc2l0aXZlXG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKi9cblx0XHRjYXNlX3NlbnNpdGl2ZSA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIEluZGljYXRlcyBpZiB0aGUgdHJlZSBzaG91bGQgYmUgZmlsdGVyZWQgKGJ5IGRlZmF1bHQpIHRvIHNob3cgb25seSBtYXRjaGluZyBub2RlcyAoa2VlcCBpbiBtaW5kIHRoaXMgY2FuIGJlIGEgaGVhdnkgb24gbGFyZ2UgdHJlZXMgaW4gb2xkIGJyb3dzZXJzKS5cblx0XHQgKiBUaGlzIHNldHRpbmcgY2FuIGJlIGNoYW5nZWQgYXQgcnVudGltZSB3aGVuIGNhbGxpbmcgdGhlIHNlYXJjaCBtZXRob2QuIERlZmF1bHQgaXMgYGZhbHNlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2guc2hvd19vbmx5X21hdGNoZXNcblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqL1xuXHRcdHNob3dfb25seV9tYXRjaGVzIDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIHRoZSBjaGlsZHJlbiBvZiBtYXRjaGVkIGVsZW1lbnQgYXJlIHNob3duICh3aGVuIHNob3dfb25seV9tYXRjaGVzIGlzIHRydWUpXG5cdFx0ICogVGhpcyBzZXR0aW5nIGNhbiBiZSBjaGFuZ2VkIGF0IHJ1bnRpbWUgd2hlbiBjYWxsaW5nIHRoZSBzZWFyY2ggbWV0aG9kLiBEZWZhdWx0IGlzIGBmYWxzZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoLnNob3dfb25seV9tYXRjaGVzX2NoaWxkcmVuXG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKi9cblx0XHRzaG93X29ubHlfbWF0Y2hlc19jaGlsZHJlbiA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIEluZGljYXRlcyBpZiBhbGwgbm9kZXMgb3BlbmVkIHRvIHJldmVhbCB0aGUgc2VhcmNoIHJlc3VsdCwgc2hvdWxkIGJlIGNsb3NlZCB3aGVuIHRoZSBzZWFyY2ggaXMgY2xlYXJlZCBvciBhIG5ldyBzZWFyY2ggaXMgcGVyZm9ybWVkLiBEZWZhdWx0IGlzIGB0cnVlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2guY2xvc2Vfb3BlbmVkX29uY2xlYXJcblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqL1xuXHRcdGNsb3NlX29wZW5lZF9vbmNsZWFyIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgb25seSBsZWFmIG5vZGVzIHNob3VsZCBiZSBpbmNsdWRlZCBpbiBzZWFyY2ggcmVzdWx0cy4gRGVmYXVsdCBpcyBgZmFsc2VgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaC5zZWFyY2hfbGVhdmVzX29ubHlcblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqL1xuXHRcdHNlYXJjaF9sZWF2ZXNfb25seSA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIElmIHNldCB0byBhIGZ1bmN0aW9uIGl0IHdpbCBiZSBjYWxsZWQgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUgd2l0aCB0d28gYXJndW1lbnRzIC0gc2VhcmNoIHN0cmluZyBhbmQgbm9kZSAod2hlcmUgbm9kZSB3aWxsIGJlIGV2ZXJ5IG5vZGUgaW4gdGhlIHN0cnVjdHVyZSwgc28gdXNlIHdpdGggY2F1dGlvbikuXG5cdFx0ICogSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUgdGhlIG5vZGUgd2lsbCBiZSBjb25zaWRlcmVkIGEgbWF0Y2ggKGl0IG1pZ2h0IG5vdCBiZSBkaXNwbGF5ZWQgaWYgc2VhcmNoX29ubHlfbGVhdmVzIGlzIHNldCB0byB0cnVlIGFuZCB0aGUgbm9kZSBpcyBub3QgYSBsZWFmKS4gRGVmYXVsdCBpcyBgZmFsc2VgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaC5zZWFyY2hfY2FsbGJhY2tcblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqL1xuXHRcdHNlYXJjaF9jYWxsYmFjayA6IGZhbHNlXG5cdH07XG5cblx0JC5qc3RyZWUucGx1Z2lucy5zZWFyY2ggPSBmdW5jdGlvbiAob3B0aW9ucywgcGFyZW50KSB7XG5cdFx0dGhpcy5iaW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFyZW50LmJpbmQuY2FsbCh0aGlzKTtcblxuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guc3RyID0gXCJcIjtcblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmRvbSA9ICQoKTtcblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnJlcyA9IFtdO1xuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gub3BuID0gW107XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5zb20gPSBmYWxzZTtcblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnNtYyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guaGRuID0gW107XG5cblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQub24oXCJzZWFyY2guanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuc2VhcmNoLnNvbSAmJiBkYXRhLnJlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG0gPSB0aGlzLl9tb2RlbC5kYXRhLCBpLCBqLCBwID0gW10sIGssIGw7XG5cdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRhdGEucmVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGlmKG1bZGF0YS5yZXNbaV1dICYmICFtW2RhdGEucmVzW2ldXS5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHAucHVzaChkYXRhLnJlc1tpXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRwID0gcC5jb25jYXQobVtkYXRhLnJlc1tpXV0ucGFyZW50cyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLnNlYXJjaC5zbWMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChrID0gMCwgbCA9IG1bZGF0YS5yZXNbaV1dLmNoaWxkcmVuX2QubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKG1bbVtkYXRhLnJlc1tpXV0uY2hpbGRyZW5fZFtrXV0gJiYgIW1bbVtkYXRhLnJlc1tpXV0uY2hpbGRyZW5fZFtrXV0uc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwLnB1c2gobVtkYXRhLnJlc1tpXV0uY2hpbGRyZW5fZFtrXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHAgPSAkLnZha2F0YS5hcnJheV9yZW1vdmVfaXRlbSgkLnZha2F0YS5hcnJheV91bmlxdWUocCksICQuanN0cmVlLnJvb3QpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5oZG4gPSB0aGlzLmhpZGVfYWxsKHRydWUpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNob3dfbm9kZShwLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5yZWRyYXcodHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImNsZWFyX3NlYXJjaC5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5zZWFyY2guc29tICYmIGRhdGEucmVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNob3dfbm9kZSh0aGlzLl9kYXRhLnNlYXJjaC5oZG4sIHRydWUpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnJlZHJhdyh0cnVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiB1c2VkIHRvIHNlYXJjaCB0aGUgdHJlZSBub2RlcyBmb3IgYSBnaXZlbiBzdHJpbmdcblx0XHQgKiBAbmFtZSBzZWFyY2goc3RyIFssIHNraXBfYXN5bmNdKVxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgdGhlIHNlYXJjaCBzdHJpbmdcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHNraXBfYXN5bmMgaWYgc2V0IHRvIHRydWUgc2VydmVyIHdpbGwgbm90IGJlIHF1ZXJpZWQgZXZlbiBpZiBjb25maWd1cmVkXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBzaG93X29ubHlfbWF0Y2hlcyBpZiBzZXQgdG8gdHJ1ZSBvbmx5IG1hdGNoaW5nIG5vZGVzIHdpbGwgYmUgc2hvd24gKGtlZXAgaW4gbWluZCB0aGlzIGNhbiBiZSB2ZXJ5IHNsb3cgb24gbGFyZ2UgdHJlZXMgb3Igb2xkIGJyb3dzZXJzKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IGluc2lkZSBhbiBvcHRpb25hbCBub2RlIHRvIHdob3NlIGNoaWxkcmVuIHRvIGxpbWl0IHRoZSBzZWFyY2hcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IGFwcGVuZCBpZiBzZXQgdG8gdHJ1ZSB0aGUgcmVzdWx0cyBvZiB0aGlzIHNlYXJjaCBhcmUgYXBwZW5kZWQgdG8gdGhlIHByZXZpb3VzIHNlYXJjaFxuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICogQHRyaWdnZXIgc2VhcmNoLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHRoaXMuc2VhcmNoID0gZnVuY3Rpb24gKHN0ciwgc2tpcF9hc3luYywgc2hvd19vbmx5X21hdGNoZXMsIGluc2lkZSwgYXBwZW5kLCBzaG93X29ubHlfbWF0Y2hlc19jaGlsZHJlbikge1xuXHRcdFx0aWYoc3RyID09PSBmYWxzZSB8fCAkLnRyaW0oc3RyLnRvU3RyaW5nKCkpID09PSBcIlwiKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNsZWFyX3NlYXJjaCgpO1xuXHRcdFx0fVxuXHRcdFx0aW5zaWRlID0gdGhpcy5nZXRfbm9kZShpbnNpZGUpO1xuXHRcdFx0aW5zaWRlID0gaW5zaWRlICYmIGluc2lkZS5pZCA/IGluc2lkZS5pZCA6IG51bGw7XG5cdFx0XHRzdHIgPSBzdHIudG9TdHJpbmcoKTtcblx0XHRcdHZhciBzID0gdGhpcy5zZXR0aW5ncy5zZWFyY2gsXG5cdFx0XHRcdGEgPSBzLmFqYXggPyBzLmFqYXggOiBmYWxzZSxcblx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdGYgPSBudWxsLFxuXHRcdFx0XHRyID0gW10sXG5cdFx0XHRcdHAgPSBbXSwgaSwgajtcblx0XHRcdGlmKHRoaXMuX2RhdGEuc2VhcmNoLnJlcy5sZW5ndGggJiYgIWFwcGVuZCkge1xuXHRcdFx0XHR0aGlzLmNsZWFyX3NlYXJjaCgpO1xuXHRcdFx0fVxuXHRcdFx0aWYoc2hvd19vbmx5X21hdGNoZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRzaG93X29ubHlfbWF0Y2hlcyA9IHMuc2hvd19vbmx5X21hdGNoZXM7XG5cdFx0XHR9XG5cdFx0XHRpZihzaG93X29ubHlfbWF0Y2hlc19jaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHNob3dfb25seV9tYXRjaGVzX2NoaWxkcmVuID0gcy5zaG93X29ubHlfbWF0Y2hlc19jaGlsZHJlbjtcblx0XHRcdH1cblx0XHRcdGlmKCFza2lwX2FzeW5jICYmIGEgIT09IGZhbHNlKSB7XG5cdFx0XHRcdGlmKCQuaXNGdW5jdGlvbihhKSkge1xuXHRcdFx0XHRcdHJldHVybiBhLmNhbGwodGhpcywgc3RyLCAkLnByb3h5KGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5kKSB7IGQgPSBkLmQ7IH1cblx0XHRcdFx0XHRcdFx0dGhpcy5fbG9hZF9ub2RlcyghJC5pc0FycmF5KGQpID8gW10gOiAkLnZha2F0YS5hcnJheV91bmlxdWUoZCksIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNlYXJjaChzdHIsIHRydWUsIHNob3dfb25seV9tYXRjaGVzLCBpbnNpZGUsIGFwcGVuZCwgc2hvd19vbmx5X21hdGNoZXNfY2hpbGRyZW4pO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0sIHRoaXMpLCBpbnNpZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGEgPSAkLmV4dGVuZCh7fSwgYSk7XG5cdFx0XHRcdFx0aWYoIWEuZGF0YSkgeyBhLmRhdGEgPSB7fTsgfVxuXHRcdFx0XHRcdGEuZGF0YS5zdHIgPSBzdHI7XG5cdFx0XHRcdFx0aWYoaW5zaWRlKSB7XG5cdFx0XHRcdFx0XHRhLmRhdGEuaW5zaWRlID0gaW5zaWRlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGhpcy5fZGF0YS5zZWFyY2gubGFzdFJlcXVlc3QpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmxhc3RSZXF1ZXN0LmFib3J0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmxhc3RSZXF1ZXN0ID0gJC5hamF4KGEpXG5cdFx0XHRcdFx0XHQuZmFpbCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnYWpheCcsICdwbHVnaW4nIDogJ3NlYXJjaCcsICdpZCcgOiAnc2VhcmNoXzAxJywgJ3JlYXNvbicgOiAnQ291bGQgbm90IGxvYWQgc2VhcmNoIHBhcmVudHMnLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeShhKSB9O1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0XHRcdC5kb25lKCQucHJveHkoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmQpIHsgZCA9IGQuZDsgfVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9sb2FkX25vZGVzKCEkLmlzQXJyYXkoZCkgPyBbXSA6ICQudmFrYXRhLmFycmF5X3VuaXF1ZShkKSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2VhcmNoKHN0ciwgdHJ1ZSwgc2hvd19vbmx5X21hdGNoZXMsIGluc2lkZSwgYXBwZW5kLCBzaG93X29ubHlfbWF0Y2hlc19jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLl9kYXRhLnNlYXJjaC5sYXN0UmVxdWVzdDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoIWFwcGVuZCkge1xuXHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5zdHIgPSBzdHI7XG5cdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmRvbSA9ICQoKTtcblx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gucmVzID0gW107XG5cdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLm9wbiA9IFtdO1xuXHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5zb20gPSBzaG93X29ubHlfbWF0Y2hlcztcblx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guc21jID0gc2hvd19vbmx5X21hdGNoZXNfY2hpbGRyZW47XG5cdFx0XHR9XG5cblx0XHRcdGYgPSBuZXcgJC52YWthdGEuc2VhcmNoKHN0ciwgdHJ1ZSwgeyBjYXNlU2Vuc2l0aXZlIDogcy5jYXNlX3NlbnNpdGl2ZSwgZnV6enkgOiBzLmZ1enp5IH0pO1xuXHRcdFx0JC5lYWNoKG1baW5zaWRlID8gaW5zaWRlIDogJC5qc3RyZWUucm9vdF0uY2hpbGRyZW5fZCwgZnVuY3Rpb24gKGlpLCBpKSB7XG5cdFx0XHRcdHZhciB2ID0gbVtpXTtcblx0XHRcdFx0aWYodi50ZXh0ICYmICF2LnN0YXRlLmhpZGRlbiAmJiAoIXMuc2VhcmNoX2xlYXZlc19vbmx5IHx8ICh2LnN0YXRlLmxvYWRlZCAmJiB2LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkpICYmICggKHMuc2VhcmNoX2NhbGxiYWNrICYmIHMuc2VhcmNoX2NhbGxiYWNrLmNhbGwodGhpcywgc3RyLCB2KSkgfHwgKCFzLnNlYXJjaF9jYWxsYmFjayAmJiBmLnNlYXJjaCh2LnRleHQpLmlzTWF0Y2gpICkgKSB7XG5cdFx0XHRcdFx0ci5wdXNoKGkpO1xuXHRcdFx0XHRcdHAgPSBwLmNvbmNhdCh2LnBhcmVudHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGlmKHIubGVuZ3RoKSB7XG5cdFx0XHRcdHAgPSAkLnZha2F0YS5hcnJheV91bmlxdWUocCk7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IHAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYocFtpXSAhPT0gJC5qc3RyZWUucm9vdCAmJiBtW3BbaV1dICYmIHRoaXMub3Blbl9ub2RlKHBbaV0sIG51bGwsIDApID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5vcG4ucHVzaChwW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIWFwcGVuZCkge1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmRvbSA9ICQodGhpcy5lbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICsgJC5tYXAociwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIFwiMDEyMzQ1Njc4OVwiLmluZGV4T2YodlswXSkgIT09IC0xID8gJ1xcXFwzJyArIHZbMF0gKyAnICcgKyB2LnN1YnN0cigxKS5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpIDogdi5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpOyB9KS5qb2luKCcsICMnKSkpO1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnJlcyA9IHI7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guZG9tID0gdGhpcy5fZGF0YS5zZWFyY2guZG9tLmFkZCgkKHRoaXMuZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yQWxsKCcjJyArICQubWFwKHIsIGZ1bmN0aW9uICh2KSB7IHJldHVybiBcIjAxMjM0NTY3ODlcIi5pbmRleE9mKHZbMF0pICE9PSAtMSA/ICdcXFxcMycgKyB2WzBdICsgJyAnICsgdi5zdWJzdHIoMSkucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSA6IHYucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKTsgfSkuam9pbignLCAjJykpKSk7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gucmVzID0gJC52YWthdGEuYXJyYXlfdW5pcXVlKHRoaXMuX2RhdGEuc2VhcmNoLnJlcy5jb25jYXQocikpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmRvbS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLmFkZENsYXNzKCdqc3RyZWUtc2VhcmNoJyk7XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCBhZnRlciBzZWFyY2ggaXMgY29tcGxldGVcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2VhcmNoLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IG5vZGVzIGEgalF1ZXJ5IGNvbGxlY3Rpb24gb2YgbWF0Y2hpbmcgbm9kZXNcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgdGhlIHNlYXJjaCBzdHJpbmdcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHJlcyBhIGNvbGxlY3Rpb24gb2Ygb2JqZWN0cyByZXByZXNlaW5nIHRoZSBtYXRjaGluZyBub2Rlc1xuXHRcdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzZWFyY2gnLCB7IG5vZGVzIDogdGhpcy5fZGF0YS5zZWFyY2guZG9tLCBzdHIgOiBzdHIsIHJlcyA6IHRoaXMuX2RhdGEuc2VhcmNoLnJlcywgc2hvd19vbmx5X21hdGNoZXMgOiBzaG93X29ubHlfbWF0Y2hlcyB9KTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHVzZWQgdG8gY2xlYXIgdGhlIGxhc3Qgc2VhcmNoIChyZW1vdmVzIGNsYXNzZXMgYW5kIHNob3dzIGFsbCBub2RlcyBpZiBmaWx0ZXJpbmcgaXMgb24pXG5cdFx0ICogQG5hbWUgY2xlYXJfc2VhcmNoKClcblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqIEB0cmlnZ2VyIGNsZWFyX3NlYXJjaC5qc3RyZWVcblx0XHQgKi9cblx0XHR0aGlzLmNsZWFyX3NlYXJjaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3Muc2VhcmNoLmNsb3NlX29wZW5lZF9vbmNsZWFyKSB7XG5cdFx0XHRcdHRoaXMuY2xvc2Vfbm9kZSh0aGlzLl9kYXRhLnNlYXJjaC5vcG4sIDApO1xuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgYWZ0ZXIgc2VhcmNoIGlzIGNvbXBsZXRlXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGNsZWFyX3NlYXJjaC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBub2RlcyBhIGpRdWVyeSBjb2xsZWN0aW9uIG9mIG1hdGNoaW5nIG5vZGVzICh0aGUgcmVzdWx0IGZyb20gdGhlIGxhc3Qgc2VhcmNoKVxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHN0ciB0aGUgc2VhcmNoIHN0cmluZyAodGhlIGxhc3Qgc2VhcmNoIHN0cmluZylcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHJlcyBhIGNvbGxlY3Rpb24gb2Ygb2JqZWN0cyByZXByZXNlaW5nIHRoZSBtYXRjaGluZyBub2RlcyAodGhlIHJlc3VsdCBmcm9tIHRoZSBsYXN0IHNlYXJjaClcblx0XHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignY2xlYXJfc2VhcmNoJywgeyAnbm9kZXMnIDogdGhpcy5fZGF0YS5zZWFyY2guZG9tLCBzdHIgOiB0aGlzLl9kYXRhLnNlYXJjaC5zdHIsIHJlcyA6IHRoaXMuX2RhdGEuc2VhcmNoLnJlcyB9KTtcblx0XHRcdGlmKHRoaXMuX2RhdGEuc2VhcmNoLnJlcy5sZW5ndGgpIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guZG9tID0gJCh0aGlzLmVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnIycgKyAkLm1hcCh0aGlzLl9kYXRhLnNlYXJjaC5yZXMsIGZ1bmN0aW9uICh2KSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwiMDEyMzQ1Njc4OVwiLmluZGV4T2YodlswXSkgIT09IC0xID8gJ1xcXFwzJyArIHZbMF0gKyAnICcgKyB2LnN1YnN0cigxKS5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpIDogdi5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpO1xuXHRcdFx0XHR9KS5qb2luKCcsICMnKSkpO1xuXHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5kb20uY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5yZW1vdmVDbGFzcyhcImpzdHJlZS1zZWFyY2hcIik7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5zdHIgPSBcIlwiO1xuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gucmVzID0gW107XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5vcG4gPSBbXTtcblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmRvbSA9ICQoKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5yZWRyYXdfbm9kZSA9IGZ1bmN0aW9uKG9iaiwgZGVlcCwgY2FsbGJhY2ssIGZvcmNlX3JlbmRlcikge1xuXHRcdFx0b2JqID0gcGFyZW50LnJlZHJhd19ub2RlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRpZihvYmopIHtcblx0XHRcdFx0aWYoJC5pbkFycmF5KG9iai5pZCwgdGhpcy5fZGF0YS5zZWFyY2gucmVzKSAhPT0gLTEpIHtcblx0XHRcdFx0XHR2YXIgaSwgaiwgdG1wID0gbnVsbDtcblx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmKG9iai5jaGlsZE5vZGVzW2ldICYmIG9iai5jaGlsZE5vZGVzW2ldLmNsYXNzTmFtZSAmJiBvYmouY2hpbGROb2Rlc1tpXS5jbGFzc05hbWUuaW5kZXhPZihcImpzdHJlZS1hbmNob3JcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHRtcCA9IG9iai5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodG1wKSB7XG5cdFx0XHRcdFx0XHR0bXAuY2xhc3NOYW1lICs9ICcganN0cmVlLXNlYXJjaCc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH07XG5cdH07XG5cblx0Ly8gaGVscGVyc1xuXHQoZnVuY3Rpb24gKCQpIHtcblx0XHQvLyBmcm9tIGh0dHA6Ly9raXJvLm1lL3Byb2plY3RzL2Z1c2UuaHRtbFxuXHRcdCQudmFrYXRhLnNlYXJjaCA9IGZ1bmN0aW9uKHBhdHRlcm4sIHR4dCwgb3B0aW9ucykge1xuXHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdFx0XHRvcHRpb25zID0gJC5leHRlbmQoe30sICQudmFrYXRhLnNlYXJjaC5kZWZhdWx0cywgb3B0aW9ucyk7XG5cdFx0XHRpZihvcHRpb25zLmZ1enp5ICE9PSBmYWxzZSkge1xuXHRcdFx0XHRvcHRpb25zLmZ1enp5ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHBhdHRlcm4gPSBvcHRpb25zLmNhc2VTZW5zaXRpdmUgPyBwYXR0ZXJuIDogcGF0dGVybi50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0dmFyIE1BVENIX0xPQ0FUSU9OXHQ9IG9wdGlvbnMubG9jYXRpb24sXG5cdFx0XHRcdE1BVENIX0RJU1RBTkNFXHQ9IG9wdGlvbnMuZGlzdGFuY2UsXG5cdFx0XHRcdE1BVENIX1RIUkVTSE9MRFx0PSBvcHRpb25zLnRocmVzaG9sZCxcblx0XHRcdFx0cGF0dGVybkxlbiA9IHBhdHRlcm4ubGVuZ3RoLFxuXHRcdFx0XHRtYXRjaG1hc2ssIHBhdHRlcm5fYWxwaGFiZXQsIG1hdGNoX2JpdGFwU2NvcmUsIHNlYXJjaDtcblx0XHRcdGlmKHBhdHRlcm5MZW4gPiAzMikge1xuXHRcdFx0XHRvcHRpb25zLmZ1enp5ID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZihvcHRpb25zLmZ1enp5KSB7XG5cdFx0XHRcdG1hdGNobWFzayA9IDEgPDwgKHBhdHRlcm5MZW4gLSAxKTtcblx0XHRcdFx0cGF0dGVybl9hbHBoYWJldCA9IChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIG1hc2sgPSB7fSxcblx0XHRcdFx0XHRcdGkgPSAwO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBwYXR0ZXJuTGVuOyBpKyspIHtcblx0XHRcdFx0XHRcdG1hc2tbcGF0dGVybi5jaGFyQXQoaSldID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHBhdHRlcm5MZW47IGkrKykge1xuXHRcdFx0XHRcdFx0bWFza1twYXR0ZXJuLmNoYXJBdChpKV0gfD0gMSA8PCAocGF0dGVybkxlbiAtIGkgLSAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIG1hc2s7XG5cdFx0XHRcdH0oKSk7XG5cdFx0XHRcdG1hdGNoX2JpdGFwU2NvcmUgPSBmdW5jdGlvbiAoZSwgeCkge1xuXHRcdFx0XHRcdHZhciBhY2N1cmFjeSA9IGUgLyBwYXR0ZXJuTGVuLFxuXHRcdFx0XHRcdFx0cHJveGltaXR5ID0gTWF0aC5hYnMoTUFUQ0hfTE9DQVRJT04gLSB4KTtcblx0XHRcdFx0XHRpZighTUFUQ0hfRElTVEFOQ0UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBwcm94aW1pdHkgPyAxLjAgOiBhY2N1cmFjeTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGFjY3VyYWN5ICsgKHByb3hpbWl0eSAvIE1BVENIX0RJU1RBTkNFKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHNlYXJjaCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG5cdFx0XHRcdHRleHQgPSBvcHRpb25zLmNhc2VTZW5zaXRpdmUgPyB0ZXh0IDogdGV4dC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRpZihwYXR0ZXJuID09PSB0ZXh0IHx8IHRleHQuaW5kZXhPZihwYXR0ZXJuKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0aXNNYXRjaDogdHJ1ZSxcblx0XHRcdFx0XHRcdHNjb3JlOiAwXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighb3B0aW9ucy5mdXp6eSkge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRpc01hdGNoOiBmYWxzZSxcblx0XHRcdFx0XHRcdHNjb3JlOiAxXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaSwgaixcblx0XHRcdFx0XHR0ZXh0TGVuID0gdGV4dC5sZW5ndGgsXG5cdFx0XHRcdFx0c2NvcmVUaHJlc2hvbGQgPSBNQVRDSF9USFJFU0hPTEQsXG5cdFx0XHRcdFx0YmVzdExvYyA9IHRleHQuaW5kZXhPZihwYXR0ZXJuLCBNQVRDSF9MT0NBVElPTiksXG5cdFx0XHRcdFx0YmluTWluLCBiaW5NaWQsXG5cdFx0XHRcdFx0YmluTWF4ID0gcGF0dGVybkxlbiArIHRleHRMZW4sXG5cdFx0XHRcdFx0bGFzdFJkLCBzdGFydCwgZmluaXNoLCByZCwgY2hhck1hdGNoLFxuXHRcdFx0XHRcdHNjb3JlID0gMSxcblx0XHRcdFx0XHRsb2NhdGlvbnMgPSBbXTtcblx0XHRcdFx0aWYgKGJlc3RMb2MgIT09IC0xKSB7XG5cdFx0XHRcdFx0c2NvcmVUaHJlc2hvbGQgPSBNYXRoLm1pbihtYXRjaF9iaXRhcFNjb3JlKDAsIGJlc3RMb2MpLCBzY29yZVRocmVzaG9sZCk7XG5cdFx0XHRcdFx0YmVzdExvYyA9IHRleHQubGFzdEluZGV4T2YocGF0dGVybiwgTUFUQ0hfTE9DQVRJT04gKyBwYXR0ZXJuTGVuKTtcblx0XHRcdFx0XHRpZiAoYmVzdExvYyAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdHNjb3JlVGhyZXNob2xkID0gTWF0aC5taW4obWF0Y2hfYml0YXBTY29yZSgwLCBiZXN0TG9jKSwgc2NvcmVUaHJlc2hvbGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRiZXN0TG9jID0gLTE7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBwYXR0ZXJuTGVuOyBpKyspIHtcblx0XHRcdFx0XHRiaW5NaW4gPSAwO1xuXHRcdFx0XHRcdGJpbk1pZCA9IGJpbk1heDtcblx0XHRcdFx0XHR3aGlsZSAoYmluTWluIDwgYmluTWlkKSB7XG5cdFx0XHRcdFx0XHRpZiAobWF0Y2hfYml0YXBTY29yZShpLCBNQVRDSF9MT0NBVElPTiArIGJpbk1pZCkgPD0gc2NvcmVUaHJlc2hvbGQpIHtcblx0XHRcdFx0XHRcdFx0YmluTWluID0gYmluTWlkO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0YmluTWF4ID0gYmluTWlkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YmluTWlkID0gTWF0aC5mbG9vcigoYmluTWF4IC0gYmluTWluKSAvIDIgKyBiaW5NaW4pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRiaW5NYXggPSBiaW5NaWQ7XG5cdFx0XHRcdFx0c3RhcnQgPSBNYXRoLm1heCgxLCBNQVRDSF9MT0NBVElPTiAtIGJpbk1pZCArIDEpO1xuXHRcdFx0XHRcdGZpbmlzaCA9IE1hdGgubWluKE1BVENIX0xPQ0FUSU9OICsgYmluTWlkLCB0ZXh0TGVuKSArIHBhdHRlcm5MZW47XG5cdFx0XHRcdFx0cmQgPSBuZXcgQXJyYXkoZmluaXNoICsgMik7XG5cdFx0XHRcdFx0cmRbZmluaXNoICsgMV0gPSAoMSA8PCBpKSAtIDE7XG5cdFx0XHRcdFx0Zm9yIChqID0gZmluaXNoOyBqID49IHN0YXJ0OyBqLS0pIHtcblx0XHRcdFx0XHRcdGNoYXJNYXRjaCA9IHBhdHRlcm5fYWxwaGFiZXRbdGV4dC5jaGFyQXQoaiAtIDEpXTtcblx0XHRcdFx0XHRcdGlmIChpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHJkW2pdID0gKChyZFtqICsgMV0gPDwgMSkgfCAxKSAmIGNoYXJNYXRjaDtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJkW2pdID0gKChyZFtqICsgMV0gPDwgMSkgfCAxKSAmIGNoYXJNYXRjaCB8ICgoKGxhc3RSZFtqICsgMV0gfCBsYXN0UmRbal0pIDw8IDEpIHwgMSkgfCBsYXN0UmRbaiArIDFdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHJkW2pdICYgbWF0Y2htYXNrKSB7XG5cdFx0XHRcdFx0XHRcdHNjb3JlID0gbWF0Y2hfYml0YXBTY29yZShpLCBqIC0gMSk7XG5cdFx0XHRcdFx0XHRcdGlmIChzY29yZSA8PSBzY29yZVRocmVzaG9sZCkge1xuXHRcdFx0XHRcdFx0XHRcdHNjb3JlVGhyZXNob2xkID0gc2NvcmU7XG5cdFx0XHRcdFx0XHRcdFx0YmVzdExvYyA9IGogLSAxO1xuXHRcdFx0XHRcdFx0XHRcdGxvY2F0aW9ucy5wdXNoKGJlc3RMb2MpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChiZXN0TG9jID4gTUFUQ0hfTE9DQVRJT04pIHtcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0ID0gTWF0aC5tYXgoMSwgMiAqIE1BVENIX0xPQ0FUSU9OIC0gYmVzdExvYyk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobWF0Y2hfYml0YXBTY29yZShpICsgMSwgTUFUQ0hfTE9DQVRJT04pID4gc2NvcmVUaHJlc2hvbGQpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsYXN0UmQgPSByZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGlzTWF0Y2g6IGJlc3RMb2MgPj0gMCxcblx0XHRcdFx0XHRzY29yZTogc2NvcmVcblx0XHRcdFx0fTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gdHh0ID09PSB0cnVlID8geyAnc2VhcmNoJyA6IHNlYXJjaCB9IDogc2VhcmNoKHR4dCk7XG5cdFx0fTtcblx0XHQkLnZha2F0YS5zZWFyY2guZGVmYXVsdHMgPSB7XG5cdFx0XHRsb2NhdGlvbiA6IDAsXG5cdFx0XHRkaXN0YW5jZSA6IDEwMCxcblx0XHRcdHRocmVzaG9sZCA6IDAuNixcblx0XHRcdGZ1enp5IDogZmFsc2UsXG5cdFx0XHRjYXNlU2Vuc2l0aXZlIDogZmFsc2Vcblx0XHR9O1xuXHR9KCQpKTtcblxuXHQvLyBpbmNsdWRlIHRoZSBzZWFyY2ggcGx1Z2luIGJ5IGRlZmF1bHRcblx0Ly8gJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2lucy5wdXNoKFwic2VhcmNoXCIpO1xuXG5cbi8qKlxuICogIyMjIFNvcnQgcGx1Z2luXG4gKlxuICogQXV0b21hdGljYWxseSBzb3J0cyBhbGwgc2libGluZ3MgaW4gdGhlIHRyZWUgYWNjb3JkaW5nIHRvIGEgc29ydGluZyBmdW5jdGlvbi5cbiAqL1xuXG5cdC8qKlxuXHQgKiB0aGUgc2V0dGluZ3MgZnVuY3Rpb24gdXNlZCB0byBzb3J0IHRoZSBub2Rlcy5cblx0ICogSXQgaXMgZXhlY3V0ZWQgaW4gdGhlIHRyZWUncyBjb250ZXh0LCBhY2NlcHRzIHR3byBub2RlcyBhcyBhcmd1bWVudHMgYW5kIHNob3VsZCByZXR1cm4gYDFgIG9yIGAtMWAuXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNvcnRcblx0ICogQHBsdWdpbiBzb3J0XG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy5zb3J0ID0gZnVuY3Rpb24gKGEsIGIpIHtcblx0XHQvL3JldHVybiB0aGlzLmdldF90eXBlKGEpID09PSB0aGlzLmdldF90eXBlKGIpID8gKHRoaXMuZ2V0X3RleHQoYSkgPiB0aGlzLmdldF90ZXh0KGIpID8gMSA6IC0xKSA6IHRoaXMuZ2V0X3R5cGUoYSkgPj0gdGhpcy5nZXRfdHlwZShiKTtcblx0XHRyZXR1cm4gdGhpcy5nZXRfdGV4dChhKSA+IHRoaXMuZ2V0X3RleHQoYikgPyAxIDogLTE7XG5cdH07XG5cdCQuanN0cmVlLnBsdWdpbnMuc29ydCA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYXJlbnQuYmluZC5jYWxsKHRoaXMpO1xuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5vbihcIm1vZGVsLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNvcnQoZGF0YS5wYXJlbnQsIHRydWUpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJyZW5hbWVfbm9kZS5qc3RyZWUgY3JlYXRlX25vZGUuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdHRoaXMuc29ydChkYXRhLnBhcmVudCB8fCBkYXRhLm5vZGUucGFyZW50LCBmYWxzZSk7XG5cdFx0XHRcdFx0XHR0aGlzLnJlZHJhd19ub2RlKGRhdGEucGFyZW50IHx8IGRhdGEubm9kZS5wYXJlbnQsIHRydWUpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJtb3ZlX25vZGUuanN0cmVlIGNvcHlfbm9kZS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zb3J0KGRhdGEucGFyZW50LCBmYWxzZSk7XG5cdFx0XHRcdFx0XHR0aGlzLnJlZHJhd19ub2RlKGRhdGEucGFyZW50LCB0cnVlKTtcblx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiB1c2VkIHRvIHNvcnQgYSBub2RlJ3MgY2hpbGRyZW5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIHNvcnQob2JqIFssIGRlZXBdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IGRlZXAgaWYgc2V0IHRvIGB0cnVlYCBub2RlcyBhcmUgc29ydGVkIHJlY3Vyc2l2ZWx5LlxuXHRcdCAqIEBwbHVnaW4gc29ydFxuXHRcdCAqIEB0cmlnZ2VyIHNlYXJjaC5qc3RyZWVcblx0XHQgKi9cblx0XHR0aGlzLnNvcnQgPSBmdW5jdGlvbiAob2JqLCBkZWVwKSB7XG5cdFx0XHR2YXIgaSwgajtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKG9iaiAmJiBvYmouY2hpbGRyZW4gJiYgb2JqLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRvYmouY2hpbGRyZW4uc29ydCgkLnByb3h5KHRoaXMuc2V0dGluZ3Muc29ydCwgdGhpcykpO1xuXHRcdFx0XHRpZihkZWVwKSB7XG5cdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNvcnQob2JqLmNoaWxkcmVuX2RbaV0sIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXG5cdC8vIGluY2x1ZGUgdGhlIHNvcnQgcGx1Z2luIGJ5IGRlZmF1bHRcblx0Ly8gJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2lucy5wdXNoKFwic29ydFwiKTtcblxuLyoqXG4gKiAjIyMgU3RhdGUgcGx1Z2luXG4gKlxuICogU2F2ZXMgdGhlIHN0YXRlIG9mIHRoZSB0cmVlIChzZWxlY3RlZCBub2Rlcywgb3BlbmVkIG5vZGVzKSBvbiB0aGUgdXNlcidzIGNvbXB1dGVyIHVzaW5nIGF2YWlsYWJsZSBvcHRpb25zIChsb2NhbFN0b3JhZ2UsIGNvb2tpZXMsIGV0YylcbiAqL1xuXG5cdHZhciB0byA9IGZhbHNlO1xuXHQvKipcblx0ICogc3RvcmVzIGFsbCBkZWZhdWx0cyBmb3IgdGhlIHN0YXRlIHBsdWdpblxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zdGF0ZVxuXHQgKiBAcGx1Z2luIHN0YXRlXG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy5zdGF0ZSA9IHtcblx0XHQvKipcblx0XHQgKiBBIHN0cmluZyBmb3IgdGhlIGtleSB0byB1c2Ugd2hlbiBzYXZpbmcgdGhlIGN1cnJlbnQgdHJlZSAoY2hhbmdlIGlmIHVzaW5nIG11bHRpcGxlIHRyZWVzIGluIHlvdXIgcHJvamVjdCkuIERlZmF1bHRzIHRvIGBqc3RyZWVgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnN0YXRlLmtleVxuXHRcdCAqIEBwbHVnaW4gc3RhdGVcblx0XHQgKi9cblx0XHRrZXlcdFx0OiAnanN0cmVlJyxcblx0XHQvKipcblx0XHQgKiBBIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGV2ZW50cyB0aGF0IHRyaWdnZXIgYSBzdGF0ZSBzYXZlLiBEZWZhdWx0cyB0byBgY2hhbmdlZC5qc3RyZWUgb3Blbl9ub2RlLmpzdHJlZSBjbG9zZV9ub2RlLmpzdHJlZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc3RhdGUuZXZlbnRzXG5cdFx0ICogQHBsdWdpbiBzdGF0ZVxuXHRcdCAqL1xuXHRcdGV2ZW50c1x0OiAnY2hhbmdlZC5qc3RyZWUgb3Blbl9ub2RlLmpzdHJlZSBjbG9zZV9ub2RlLmpzdHJlZSBjaGVja19ub2RlLmpzdHJlZSB1bmNoZWNrX25vZGUuanN0cmVlJyxcblx0XHQvKipcblx0XHQgKiBUaW1lIGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgc3RhdGUgd2lsbCBleHBpcmUuIERlZmF1bHRzIHRvICdmYWxzZScgbWVhbmluZyAtIG5vIGV4cGlyZS5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zdGF0ZS50dGxcblx0XHQgKiBAcGx1Z2luIHN0YXRlXG5cdFx0ICovXG5cdFx0dHRsXHRcdDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgcHJpb3IgdG8gcmVzdG9yaW5nIHN0YXRlIHdpdGggb25lIGFyZ3VtZW50IC0gdGhlIHN0YXRlIG9iamVjdC4gQ2FuIGJlIHVzZWQgdG8gY2xlYXIgdW53YW50ZWQgcGFydHMgb2YgdGhlIHN0YXRlLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnN0YXRlLmZpbHRlclxuXHRcdCAqIEBwbHVnaW4gc3RhdGVcblx0XHQgKi9cblx0XHRmaWx0ZXJcdDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogU2hvdWxkIGxvYWRlZCBub2RlcyBiZSByZXN0b3JlZCAoc2V0dGluZyB0aGlzIHRvIHRydWUgbWVhbnMgdGhhdCBpdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSB3aG9sZSB0cmVlIHdpbGwgYmUgbG9hZGVkIGZvciBzb21lIHVzZXJzIC0gdXNlIHdpdGggY2F1dGlvbikuIERlZmF1bHRzIHRvIGBmYWxzZWBcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zdGF0ZS5wcmVzZXJ2ZV9sb2FkZWRcblx0XHQgKiBAcGx1Z2luIHN0YXRlXG5cdFx0ICovXG5cdFx0cHJlc2VydmVfbG9hZGVkIDogZmFsc2Vcblx0fTtcblx0JC5qc3RyZWUucGx1Z2lucy5zdGF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYXJlbnQuYmluZC5jYWxsKHRoaXMpO1xuXHRcdFx0dmFyIGJpbmQgPSAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50Lm9uKHRoaXMuc2V0dGluZ3Muc3RhdGUuZXZlbnRzLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZih0bykgeyBjbGVhclRpbWVvdXQodG8pOyB9XG5cdFx0XHRcdFx0dG8gPSBzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24gKCkgeyB0aGlzLnNhdmVfc3RhdGUoKTsgfSwgdGhpcyksIDEwMCk7XG5cdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIHRoZSBzdGF0ZSBwbHVnaW4gaXMgZmluaXNoZWQgcmVzdG9yaW5nIHRoZSBzdGF0ZSAoYW5kIGltbWVkaWF0ZWx5IGFmdGVyIHJlYWR5IGlmIHRoZXJlIGlzIG5vIHN0YXRlIHRvIHJlc3RvcmUpLlxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgc3RhdGVfcmVhZHkuanN0cmVlXG5cdFx0XHRcdCAqIEBwbHVnaW4gc3RhdGVcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignc3RhdGVfcmVhZHknKTtcblx0XHRcdH0sIHRoaXMpO1xuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5vbihcInJlYWR5LmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQub25lKFwicmVzdG9yZV9zdGF0ZS5qc3RyZWVcIiwgYmluZCk7XG5cdFx0XHRcdFx0XHRpZighdGhpcy5yZXN0b3JlX3N0YXRlKCkpIHsgYmluZCgpOyB9XG5cdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogc2F2ZSB0aGUgc3RhdGVcblx0XHQgKiBAbmFtZSBzYXZlX3N0YXRlKClcblx0XHQgKiBAcGx1Z2luIHN0YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5zYXZlX3N0YXRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHRtID0gdGhpcy5nZXRfc3RhdGUoKTtcblx0XHRcdGlmICghdGhpcy5zZXR0aW5ncy5zdGF0ZS5wcmVzZXJ2ZV9sb2FkZWQpIHtcblx0XHRcdFx0ZGVsZXRlIHRtLmNvcmUubG9hZGVkO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHN0ID0geyAnc3RhdGUnIDogdG0sICd0dGwnIDogdGhpcy5zZXR0aW5ncy5zdGF0ZS50dGwsICdzZWMnIDogKyhuZXcgRGF0ZSgpKSB9O1xuXHRcdFx0JC52YWthdGEuc3RvcmFnZS5zZXQodGhpcy5zZXR0aW5ncy5zdGF0ZS5rZXksIEpTT04uc3RyaW5naWZ5KHN0KSk7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiByZXN0b3JlIHRoZSBzdGF0ZSBmcm9tIHRoZSB1c2VyJ3MgY29tcHV0ZXJcblx0XHQgKiBAbmFtZSByZXN0b3JlX3N0YXRlKClcblx0XHQgKiBAcGx1Z2luIHN0YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5yZXN0b3JlX3N0YXRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGsgPSAkLnZha2F0YS5zdG9yYWdlLmdldCh0aGlzLnNldHRpbmdzLnN0YXRlLmtleSk7XG5cdFx0XHRpZighIWspIHsgdHJ5IHsgayA9IEpTT04ucGFyc2Uoayk7IH0gY2F0Y2goZXgpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblx0XHRcdGlmKCEhayAmJiBrLnR0bCAmJiBrLnNlYyAmJiArKG5ldyBEYXRlKCkpIC0gay5zZWMgPiBrLnR0bCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKCEhayAmJiBrLnN0YXRlKSB7IGsgPSBrLnN0YXRlOyB9XG5cdFx0XHRpZighIWsgJiYgJC5pc0Z1bmN0aW9uKHRoaXMuc2V0dGluZ3Muc3RhdGUuZmlsdGVyKSkgeyBrID0gdGhpcy5zZXR0aW5ncy5zdGF0ZS5maWx0ZXIuY2FsbCh0aGlzLCBrKTsgfVxuXHRcdFx0aWYoISFrKSB7XG5cdFx0XHRcdGlmICghdGhpcy5zZXR0aW5ncy5zdGF0ZS5wcmVzZXJ2ZV9sb2FkZWQpIHtcblx0XHRcdFx0XHRkZWxldGUgay5jb3JlLmxvYWRlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmVsZW1lbnQub25lKFwic2V0X3N0YXRlLmpzdHJlZVwiLCBmdW5jdGlvbiAoZSwgZGF0YSkgeyBkYXRhLmluc3RhbmNlLnRyaWdnZXIoJ3Jlc3RvcmVfc3RhdGUnLCB7ICdzdGF0ZScgOiAkLmV4dGVuZCh0cnVlLCB7fSwgaykgfSk7IH0pO1xuXHRcdFx0XHR0aGlzLnNldF9zdGF0ZShrKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBjbGVhciB0aGUgc3RhdGUgb24gdGhlIHVzZXIncyBjb21wdXRlclxuXHRcdCAqIEBuYW1lIGNsZWFyX3N0YXRlKClcblx0XHQgKiBAcGx1Z2luIHN0YXRlXG5cdFx0ICovXG5cdFx0dGhpcy5jbGVhcl9zdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAkLnZha2F0YS5zdG9yYWdlLmRlbCh0aGlzLnNldHRpbmdzLnN0YXRlLmtleSk7XG5cdFx0fTtcblx0fTtcblxuXHQoZnVuY3Rpb24gKCQsIHVuZGVmaW5lZCkge1xuXHRcdCQudmFrYXRhLnN0b3JhZ2UgPSB7XG5cdFx0XHQvLyBzaW1wbHkgc3BlY2lmeWluZyB0aGUgZnVuY3Rpb25zIGluIEZGIHRocm93cyBhbiBlcnJvclxuXHRcdFx0c2V0IDogZnVuY3Rpb24gKGtleSwgdmFsKSB7IHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWwpOyB9LFxuXHRcdFx0Z2V0IDogZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7IH0sXG5cdFx0XHRkZWwgOiBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTsgfVxuXHRcdH07XG5cdH0oJCkpO1xuXG5cdC8vIGluY2x1ZGUgdGhlIHN0YXRlIHBsdWdpbiBieSBkZWZhdWx0XG5cdC8vICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnMucHVzaChcInN0YXRlXCIpO1xuXG4vKipcbiAqICMjIyBUeXBlcyBwbHVnaW5cbiAqXG4gKiBNYWtlcyBpdCBwb3NzaWJsZSB0byBhZGQgcHJlZGVmaW5lZCB0eXBlcyBmb3IgZ3JvdXBzIG9mIG5vZGVzLCB3aGljaCBtYWtlIGl0IHBvc3NpYmxlIHRvIGVhc2lseSBjb250cm9sIG5lc3RpbmcgcnVsZXMgYW5kIGljb24gZm9yIGVhY2ggZ3JvdXAuXG4gKi9cblxuXHQvKipcblx0ICogQW4gb2JqZWN0IHN0b3JpbmcgYWxsIHR5cGVzIGFzIGtleSB2YWx1ZSBwYWlycywgd2hlcmUgdGhlIGtleSBpcyB0aGUgdHlwZSBuYW1lIGFuZCB0aGUgdmFsdWUgaXMgYW4gb2JqZWN0IHRoYXQgY291bGQgY29udGFpbiBmb2xsb3dpbmcga2V5cyAoYWxsIG9wdGlvbmFsKS5cblx0ICpcblx0ICogKiBgbWF4X2NoaWxkcmVuYCB0aGUgbWF4aW11bSBudW1iZXIgb2YgaW1tZWRpYXRlIGNoaWxkcmVuIHRoaXMgbm9kZSB0eXBlIGNhbiBoYXZlLiBEbyBub3Qgc3BlY2lmeSBvciBzZXQgdG8gYC0xYCBmb3IgdW5saW1pdGVkLlxuXHQgKiAqIGBtYXhfZGVwdGhgIHRoZSBtYXhpbXVtIG51bWJlciBvZiBuZXN0aW5nIHRoaXMgbm9kZSB0eXBlIGNhbiBoYXZlLiBBIHZhbHVlIG9mIGAxYCB3b3VsZCBtZWFuIHRoYXQgdGhlIG5vZGUgY2FuIGhhdmUgY2hpbGRyZW4sIGJ1dCBubyBncmFuZGNoaWxkcmVuLiBEbyBub3Qgc3BlY2lmeSBvciBzZXQgdG8gYC0xYCBmb3IgdW5saW1pdGVkLlxuXHQgKiAqIGB2YWxpZF9jaGlsZHJlbmAgYW4gYXJyYXkgb2Ygbm9kZSB0eXBlIHN0cmluZ3MsIHRoYXQgbm9kZXMgb2YgdGhpcyB0eXBlIGNhbiBoYXZlIGFzIGNoaWxkcmVuLiBEbyBub3Qgc3BlY2lmeSBvciBzZXQgdG8gYC0xYCBmb3Igbm8gbGltaXRzLlxuXHQgKiAqIGBpY29uYCBhIHN0cmluZyAtIGNhbiBiZSBhIHBhdGggdG8gYW4gaWNvbiBvciBhIGNsYXNzTmFtZSwgaWYgdXNpbmcgYW4gaW1hZ2UgdGhhdCBpcyBpbiB0aGUgY3VycmVudCBkaXJlY3RvcnkgdXNlIGEgYC4vYCBwcmVmaXgsIG90aGVyd2lzZSBpdCB3aWxsIGJlIGRldGVjdGVkIGFzIGEgY2xhc3MuIE9taXQgdG8gdXNlIHRoZSBkZWZhdWx0IGljb24gZnJvbSB5b3VyIHRoZW1lLlxuXHQgKiAqIGBsaV9hdHRyYCBhbiBvYmplY3Qgb2YgdmFsdWVzIHdoaWNoIHdpbGwgYmUgdXNlZCB0byBhZGQgSFRNTCBhdHRyaWJ1dGVzIG9uIHRoZSByZXN1bHRpbmcgTEkgRE9NIG5vZGUgKG1lcmdlZCB3aXRoIHRoZSBub2RlJ3Mgb3duIGRhdGEpXG5cdCAqICogYGFfYXR0cmAgYW4gb2JqZWN0IG9mIHZhbHVlcyB3aGljaCB3aWxsIGJlIHVzZWQgdG8gYWRkIEhUTUwgYXR0cmlidXRlcyBvbiB0aGUgcmVzdWx0aW5nIEEgRE9NIG5vZGUgKG1lcmdlZCB3aXRoIHRoZSBub2RlJ3Mgb3duIGRhdGEpXG5cdCAqXG5cdCAqIFRoZXJlIGFyZSB0d28gcHJlZGVmaW5lZCB0eXBlczpcblx0ICpcblx0ICogKiBgI2AgcmVwcmVzZW50cyB0aGUgcm9vdCBvZiB0aGUgdHJlZSwgZm9yIGV4YW1wbGUgYG1heF9jaGlsZHJlbmAgd291bGQgY29udHJvbCB0aGUgbWF4aW11bSBudW1iZXIgb2Ygcm9vdCBub2Rlcy5cblx0ICogKiBgZGVmYXVsdGAgcmVwcmVzZW50cyB0aGUgZGVmYXVsdCBub2RlIC0gYW55IHNldHRpbmdzIGhlcmUgd2lsbCBiZSBhcHBsaWVkIHRvIGFsbCBub2RlcyB0aGF0IGRvIG5vdCBoYXZlIGEgdHlwZSBzcGVjaWZpZWQuXG5cdCAqXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnR5cGVzXG5cdCAqIEBwbHVnaW4gdHlwZXNcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLnR5cGVzID0ge1xuXHRcdCdkZWZhdWx0JyA6IHt9XG5cdH07XG5cdCQuanN0cmVlLmRlZmF1bHRzLnR5cGVzWyQuanN0cmVlLnJvb3RdID0ge307XG5cblx0JC5qc3RyZWUucGx1Z2lucy50eXBlcyA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcblx0XHRcdHZhciBpLCBqO1xuXHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLnR5cGVzICYmIG9wdGlvbnMudHlwZXNbJ2RlZmF1bHQnXSkge1xuXHRcdFx0XHRmb3IoaSBpbiBvcHRpb25zLnR5cGVzKSB7XG5cdFx0XHRcdFx0aWYoaSAhPT0gXCJkZWZhdWx0XCIgJiYgaSAhPT0gJC5qc3RyZWUucm9vdCAmJiBvcHRpb25zLnR5cGVzLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRmb3IoaiBpbiBvcHRpb25zLnR5cGVzWydkZWZhdWx0J10pIHtcblx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy50eXBlc1snZGVmYXVsdCddLmhhc093blByb3BlcnR5KGopICYmIG9wdGlvbnMudHlwZXNbaV1bal0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMudHlwZXNbaV1bal0gPSBvcHRpb25zLnR5cGVzWydkZWZhdWx0J11bal07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHBhcmVudC5pbml0LmNhbGwodGhpcywgZWwsIG9wdGlvbnMpO1xuXHRcdFx0dGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XS50eXBlID0gJC5qc3RyZWUucm9vdDtcblx0XHR9O1xuXHRcdHRoaXMucmVmcmVzaCA9IGZ1bmN0aW9uIChza2lwX2xvYWRpbmcsIGZvcmdldF9zdGF0ZSkge1xuXHRcdFx0cGFyZW50LnJlZnJlc2guY2FsbCh0aGlzLCBza2lwX2xvYWRpbmcsIGZvcmdldF9zdGF0ZSk7XG5cdFx0XHR0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdLnR5cGUgPSAkLmpzdHJlZS5yb290O1xuXHRcdH07XG5cdFx0dGhpcy5iaW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5vbignbW9kZWwuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0dmFyIG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRcdFx0XHRkcGMgPSBkYXRhLm5vZGVzLFxuXHRcdFx0XHRcdFx0XHR0ID0gdGhpcy5zZXR0aW5ncy50eXBlcyxcblx0XHRcdFx0XHRcdFx0aSwgaiwgYyA9ICdkZWZhdWx0Jywgaztcblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRwYy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0YyA9ICdkZWZhdWx0Jztcblx0XHRcdFx0XHRcdFx0aWYobVtkcGNbaV1dLm9yaWdpbmFsICYmIG1bZHBjW2ldXS5vcmlnaW5hbC50eXBlICYmIHRbbVtkcGNbaV1dLm9yaWdpbmFsLnR5cGVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0YyA9IG1bZHBjW2ldXS5vcmlnaW5hbC50eXBlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKG1bZHBjW2ldXS5kYXRhICYmIG1bZHBjW2ldXS5kYXRhLmpzdHJlZSAmJiBtW2RwY1tpXV0uZGF0YS5qc3RyZWUudHlwZSAmJiB0W21bZHBjW2ldXS5kYXRhLmpzdHJlZS50eXBlXSkge1xuXHRcdFx0XHRcdFx0XHRcdGMgPSBtW2RwY1tpXV0uZGF0YS5qc3RyZWUudHlwZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRtW2RwY1tpXV0udHlwZSA9IGM7XG5cdFx0XHRcdFx0XHRcdGlmKG1bZHBjW2ldXS5pY29uID09PSB0cnVlICYmIHRbY10uaWNvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0bVtkcGNbaV1dLmljb24gPSB0W2NdLmljb247XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYodFtjXS5saV9hdHRyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRbY10ubGlfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGsgaW4gdFtjXS5saV9hdHRyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAodFtjXS5saV9hdHRyLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrID09PSAnaWQnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAobVtkcGNbaV1dLmxpX2F0dHJba10gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1bZHBjW2ldXS5saV9hdHRyW2tdID0gdFtjXS5saV9hdHRyW2tdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGsgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtW2RwY1tpXV0ubGlfYXR0clsnY2xhc3MnXSA9IHRbY10ubGlfYXR0clsnY2xhc3MnXSArICcgJyArIG1bZHBjW2ldXS5saV9hdHRyWydjbGFzcyddO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKHRbY10uYV9hdHRyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRbY10uYV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAoayBpbiB0W2NdLmFfYXR0cikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHRbY10uYV9hdHRyLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChrID09PSAnaWQnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAobVtkcGNbaV1dLmFfYXR0cltrXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bVtkcGNbaV1dLmFfYXR0cltrXSA9IHRbY10uYV9hdHRyW2tdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGsgPT09ICdocmVmJyAmJiBtW2RwY1tpXV0uYV9hdHRyW2tdID09PSAnIycpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtW2RwY1tpXV0uYV9hdHRyWydocmVmJ10gPSB0W2NdLmFfYXR0clsnaHJlZiddO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGsgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtW2RwY1tpXV0uYV9hdHRyWydjbGFzcyddID0gdFtjXS5hX2F0dHJbJ2NsYXNzJ10gKyAnICcgKyBtW2RwY1tpXV0uYV9hdHRyWydjbGFzcyddO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtWyQuanN0cmVlLnJvb3RdLnR5cGUgPSAkLmpzdHJlZS5yb290O1xuXHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdHBhcmVudC5iaW5kLmNhbGwodGhpcyk7XG5cdFx0fTtcblx0XHR0aGlzLmdldF9qc29uID0gZnVuY3Rpb24gKG9iaiwgb3B0aW9ucywgZmxhdCkge1xuXHRcdFx0dmFyIGksIGosXG5cdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRvcHQgPSBvcHRpb25zID8gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMsIHtub19pZDpmYWxzZX0pIDoge30sXG5cdFx0XHRcdHRtcCA9IHBhcmVudC5nZXRfanNvbi5jYWxsKHRoaXMsIG9iaiwgb3B0LCBmbGF0KTtcblx0XHRcdGlmKHRtcCA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZigkLmlzQXJyYXkodG1wKSkge1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0dG1wW2ldLnR5cGUgPSB0bXBbaV0uaWQgJiYgbVt0bXBbaV0uaWRdICYmIG1bdG1wW2ldLmlkXS50eXBlID8gbVt0bXBbaV0uaWRdLnR5cGUgOiBcImRlZmF1bHRcIjtcblx0XHRcdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMubm9faWQpIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSB0bXBbaV0uaWQ7XG5cdFx0XHRcdFx0XHRpZih0bXBbaV0ubGlfYXR0ciAmJiB0bXBbaV0ubGlfYXR0ci5pZCkge1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgdG1wW2ldLmxpX2F0dHIuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih0bXBbaV0uYV9hdHRyICYmIHRtcFtpXS5hX2F0dHIuaWQpIHtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIHRtcFtpXS5hX2F0dHIuaWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dG1wLnR5cGUgPSB0bXAuaWQgJiYgbVt0bXAuaWRdICYmIG1bdG1wLmlkXS50eXBlID8gbVt0bXAuaWRdLnR5cGUgOiBcImRlZmF1bHRcIjtcblx0XHRcdFx0aWYob3B0aW9ucyAmJiBvcHRpb25zLm5vX2lkKSB7XG5cdFx0XHRcdFx0dG1wID0gdGhpcy5fZGVsZXRlX2lkcyh0bXApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdG1wO1xuXHRcdH07XG5cdFx0dGhpcy5fZGVsZXRlX2lkcyA9IGZ1bmN0aW9uICh0bXApIHtcblx0XHRcdGlmKCQuaXNBcnJheSh0bXApKSB7XG5cdFx0XHRcdGZvcih2YXIgaSA9IDAsIGogPSB0bXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0dG1wW2ldID0gdGhpcy5fZGVsZXRlX2lkcyh0bXBbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0bXA7XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgdG1wLmlkO1xuXHRcdFx0aWYodG1wLmxpX2F0dHIgJiYgdG1wLmxpX2F0dHIuaWQpIHtcblx0XHRcdFx0ZGVsZXRlIHRtcC5saV9hdHRyLmlkO1xuXHRcdFx0fVxuXHRcdFx0aWYodG1wLmFfYXR0ciAmJiB0bXAuYV9hdHRyLmlkKSB7XG5cdFx0XHRcdGRlbGV0ZSB0bXAuYV9hdHRyLmlkO1xuXHRcdFx0fVxuXHRcdFx0aWYodG1wLmNoaWxkcmVuICYmICQuaXNBcnJheSh0bXAuY2hpbGRyZW4pKSB7XG5cdFx0XHRcdHRtcC5jaGlsZHJlbiA9IHRoaXMuX2RlbGV0ZV9pZHModG1wLmNoaWxkcmVuKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0bXA7XG5cdFx0fTtcblx0XHR0aGlzLmNoZWNrID0gZnVuY3Rpb24gKGNoaywgb2JqLCBwYXIsIHBvcywgbW9yZSkge1xuXHRcdFx0aWYocGFyZW50LmNoZWNrLmNhbGwodGhpcywgY2hrLCBvYmosIHBhciwgcG9zLCBtb3JlKSA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRvYmogPSBvYmogJiYgb2JqLmlkID8gb2JqIDogdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cGFyID0gcGFyICYmIHBhci5pZCA/IHBhciA6IHRoaXMuZ2V0X25vZGUocGFyKTtcblx0XHRcdHZhciBtID0gb2JqICYmIG9iai5pZCA/IChtb3JlICYmIG1vcmUub3JpZ2luID8gbW9yZS5vcmlnaW4gOiAkLmpzdHJlZS5yZWZlcmVuY2Uob2JqLmlkKSkgOiBudWxsLCB0bXAsIGQsIGksIGo7XG5cdFx0XHRtID0gbSAmJiBtLl9tb2RlbCAmJiBtLl9tb2RlbC5kYXRhID8gbS5fbW9kZWwuZGF0YSA6IG51bGw7XG5cdFx0XHRzd2l0Y2goY2hrKSB7XG5cdFx0XHRcdGNhc2UgXCJjcmVhdGVfbm9kZVwiOlxuXHRcdFx0XHRjYXNlIFwibW92ZV9ub2RlXCI6XG5cdFx0XHRcdGNhc2UgXCJjb3B5X25vZGVcIjpcblx0XHRcdFx0XHRpZihjaGsgIT09ICdtb3ZlX25vZGUnIHx8ICQuaW5BcnJheShvYmouaWQsIHBhci5jaGlsZHJlbikgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ydWxlcyhwYXIpO1xuXHRcdFx0XHRcdFx0aWYodG1wLm1heF9jaGlsZHJlbiAhPT0gdW5kZWZpbmVkICYmIHRtcC5tYXhfY2hpbGRyZW4gIT09IC0xICYmIHRtcC5tYXhfY2hpbGRyZW4gPT09IHBhci5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICd0eXBlcycsICdpZCcgOiAndHlwZXNfMDEnLCAncmVhc29uJyA6ICdtYXhfY2hpbGRyZW4gcHJldmVudHMgZnVuY3Rpb246ICcgKyBjaGssICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodG1wLnZhbGlkX2NoaWxkcmVuICE9PSB1bmRlZmluZWQgJiYgdG1wLnZhbGlkX2NoaWxkcmVuICE9PSAtMSAmJiAkLmluQXJyYXkoKG9iai50eXBlIHx8ICdkZWZhdWx0JyksIHRtcC52YWxpZF9jaGlsZHJlbikgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAndHlwZXMnLCAnaWQnIDogJ3R5cGVzXzAyJywgJ3JlYXNvbicgOiAndmFsaWRfY2hpbGRyZW4gcHJldmVudHMgZnVuY3Rpb246ICcgKyBjaGssICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYobSAmJiBvYmouY2hpbGRyZW5fZCAmJiBvYmoucGFyZW50cykge1xuXHRcdFx0XHRcdFx0XHRkID0gMDtcblx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZCA9IE1hdGgubWF4KGQsIG1bb2JqLmNoaWxkcmVuX2RbaV1dLnBhcmVudHMubGVuZ3RoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkID0gZCAtIG9iai5wYXJlbnRzLmxlbmd0aCArIDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihkIDw9IDAgfHwgZCA9PT0gdW5kZWZpbmVkKSB7IGQgPSAxOyB9XG5cdFx0XHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0XHRcdGlmKHRtcC5tYXhfZGVwdGggIT09IHVuZGVmaW5lZCAmJiB0bXAubWF4X2RlcHRoICE9PSAtMSAmJiB0bXAubWF4X2RlcHRoIDwgZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAndHlwZXMnLCAnaWQnIDogJ3R5cGVzXzAzJywgJ3JlYXNvbicgOiAnbWF4X2RlcHRoIHByZXZlbnRzIGZ1bmN0aW9uOiAnICsgY2hrLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHBhciA9IHRoaXMuZ2V0X25vZGUocGFyLnBhcmVudCk7XG5cdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X3J1bGVzKHBhcik7XG5cdFx0XHRcdFx0XHRcdGQrKztcblx0XHRcdFx0XHRcdH0gd2hpbGUocGFyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHVzZWQgdG8gcmV0cmlldmUgdGhlIHR5cGUgc2V0dGluZ3Mgb2JqZWN0IGZvciBhIG5vZGVcblx0XHQgKiBAbmFtZSBnZXRfcnVsZXMob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBmaW5kIHRoZSBydWxlcyBmb3Jcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdFx0ICogQHBsdWdpbiB0eXBlc1xuXHRcdCAqL1xuXHRcdHRoaXMuZ2V0X3J1bGVzID0gZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciB0bXAgPSB0aGlzLmdldF90eXBlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZih0bXAubWF4X2RlcHRoID09PSB1bmRlZmluZWQpIHsgdG1wLm1heF9kZXB0aCA9IC0xOyB9XG5cdFx0XHRpZih0bXAubWF4X2NoaWxkcmVuID09PSB1bmRlZmluZWQpIHsgdG1wLm1heF9jaGlsZHJlbiA9IC0xOyB9XG5cdFx0XHRpZih0bXAudmFsaWRfY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkgeyB0bXAudmFsaWRfY2hpbGRyZW4gPSAtMTsgfVxuXHRcdFx0cmV0dXJuIHRtcDtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHVzZWQgdG8gcmV0cmlldmUgdGhlIHR5cGUgc3RyaW5nIG9yIHNldHRpbmdzIG9iamVjdCBmb3IgYSBub2RlXG5cdFx0ICogQG5hbWUgZ2V0X3R5cGUob2JqIFssIHJ1bGVzXSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gZmluZCB0aGUgcnVsZXMgZm9yXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBydWxlcyBpZiBzZXQgdG8gYHRydWVgIGluc3RlYWQgb2YgYSBzdHJpbmcgdGhlIHNldHRpbmdzIG9iamVjdCB3aWxsIGJlIHJldHVybmVkXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfE9iamVjdH1cblx0XHQgKiBAcGx1Z2luIHR5cGVzXG5cdFx0ICovXG5cdFx0dGhpcy5nZXRfdHlwZSA9IGZ1bmN0aW9uIChvYmosIHJ1bGVzKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gKCFvYmopID8gZmFsc2UgOiAoIHJ1bGVzID8gJC5leHRlbmQoeyAndHlwZScgOiBvYmoudHlwZSB9LCB0aGlzLnNldHRpbmdzLnR5cGVzW29iai50eXBlXSkgOiBvYmoudHlwZSk7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiB1c2VkIHRvIGNoYW5nZSBhIG5vZGUncyB0eXBlXG5cdFx0ICogQG5hbWUgc2V0X3R5cGUob2JqLCB0eXBlKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBjaGFuZ2Vcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSB0aGUgbmV3IHR5cGVcblx0XHQgKiBAcGx1Z2luIHR5cGVzXG5cdFx0ICovXG5cdFx0dGhpcy5zZXRfdHlwZSA9IGZ1bmN0aW9uIChvYmosIHR5cGUpIHtcblx0XHRcdHZhciBtID0gdGhpcy5fbW9kZWwuZGF0YSwgdCwgdDEsIHQyLCBvbGRfdHlwZSwgb2xkX2ljb24sIGssIGQsIGE7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRfdHlwZShvYmpbdDFdLCB0eXBlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHQgPSB0aGlzLnNldHRpbmdzLnR5cGVzO1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIXRbdHlwZV0gfHwgIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGQgPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZiAoZCAmJiBkLmxlbmd0aCkge1xuXHRcdFx0XHRhID0gZC5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKTtcblx0XHRcdH1cblx0XHRcdG9sZF90eXBlID0gb2JqLnR5cGU7XG5cdFx0XHRvbGRfaWNvbiA9IHRoaXMuZ2V0X2ljb24ob2JqKTtcblx0XHRcdG9iai50eXBlID0gdHlwZTtcblx0XHRcdGlmKG9sZF9pY29uID09PSB0cnVlIHx8ICF0W29sZF90eXBlXSB8fCAodFtvbGRfdHlwZV0uaWNvbiAhPT0gdW5kZWZpbmVkICYmIG9sZF9pY29uID09PSB0W29sZF90eXBlXS5pY29uKSkge1xuXHRcdFx0XHR0aGlzLnNldF9pY29uKG9iaiwgdFt0eXBlXS5pY29uICE9PSB1bmRlZmluZWQgPyB0W3R5cGVdLmljb24gOiB0cnVlKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcmVtb3ZlIG9sZCB0eXBlIHByb3BzXG5cdFx0XHRpZih0W29sZF90eXBlXSAmJiB0W29sZF90eXBlXS5saV9hdHRyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRbb2xkX3R5cGVdLmxpX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoayBpbiB0W29sZF90eXBlXS5saV9hdHRyKSB7XG5cdFx0XHRcdFx0aWYgKHRbb2xkX3R5cGVdLmxpX2F0dHIuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0XHRcdGlmIChrID09PSAnaWQnKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoayA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0XHRtW29iai5pZF0ubGlfYXR0clsnY2xhc3MnXSA9IChtW29iai5pZF0ubGlfYXR0clsnY2xhc3MnXSB8fCAnJykucmVwbGFjZSh0W29sZF90eXBlXS5saV9hdHRyW2tdLCAnJyk7XG5cdFx0XHRcdFx0XHRcdGlmIChkKSB7IGQucmVtb3ZlQ2xhc3ModFtvbGRfdHlwZV0ubGlfYXR0cltrXSk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKG1bb2JqLmlkXS5saV9hdHRyW2tdID09PSB0W29sZF90eXBlXS5saV9hdHRyW2tdKSB7XG5cdFx0XHRcdFx0XHRcdG1bb2JqLmlkXS5saV9hdHRyW2tdID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0aWYgKGQpIHsgZC5yZW1vdmVBdHRyKGspOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZih0W29sZF90eXBlXSAmJiB0W29sZF90eXBlXS5hX2F0dHIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdFtvbGRfdHlwZV0uYV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGsgaW4gdFtvbGRfdHlwZV0uYV9hdHRyKSB7XG5cdFx0XHRcdFx0aWYgKHRbb2xkX3R5cGVdLmFfYXR0ci5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRcdFx0aWYgKGsgPT09ICdpZCcpIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChrID09PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRcdG1bb2JqLmlkXS5hX2F0dHJbJ2NsYXNzJ10gPSAobVtvYmouaWRdLmFfYXR0clsnY2xhc3MnXSB8fCAnJykucmVwbGFjZSh0W29sZF90eXBlXS5hX2F0dHJba10sICcnKTtcblx0XHRcdFx0XHRcdFx0aWYgKGEpIHsgYS5yZW1vdmVDbGFzcyh0W29sZF90eXBlXS5hX2F0dHJba10pOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChtW29iai5pZF0uYV9hdHRyW2tdID09PSB0W29sZF90eXBlXS5hX2F0dHJba10pIHtcblx0XHRcdFx0XHRcdFx0aWYgKGsgPT09ICdocmVmJykge1xuXHRcdFx0XHRcdFx0XHRcdG1bb2JqLmlkXS5hX2F0dHJba10gPSAnIyc7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGEpIHsgYS5hdHRyKCdocmVmJywgJyMnKTsgfVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBtW29iai5pZF0uYV9hdHRyW2tdO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChhKSB7IGEucmVtb3ZlQXR0cihrKTsgfVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGFkZCBuZXcgcHJvcHNcblx0XHRcdGlmKHRbdHlwZV0ubGlfYXR0ciAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0W3R5cGVdLmxpX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoayBpbiB0W3R5cGVdLmxpX2F0dHIpIHtcblx0XHRcdFx0XHRpZiAodFt0eXBlXS5saV9hdHRyLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHRcdFx0XHRpZiAoayA9PT0gJ2lkJykge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKG1bb2JqLmlkXS5saV9hdHRyW2tdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0bVtvYmouaWRdLmxpX2F0dHJba10gPSB0W3R5cGVdLmxpX2F0dHJba107XG5cdFx0XHRcdFx0XHRcdGlmIChkKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGsgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGQuYWRkQ2xhc3ModFt0eXBlXS5saV9hdHRyW2tdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkLmF0dHIoaywgdFt0eXBlXS5saV9hdHRyW2tdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKGsgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdFx0bVtvYmouaWRdLmxpX2F0dHJbJ2NsYXNzJ10gPSB0W3R5cGVdLmxpX2F0dHJba10gKyAnICcgKyBtW29iai5pZF0ubGlfYXR0clsnY2xhc3MnXTtcblx0XHRcdFx0XHRcdFx0aWYgKGQpIHsgZC5hZGRDbGFzcyh0W3R5cGVdLmxpX2F0dHJba10pOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZih0W3R5cGVdLmFfYXR0ciAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0W3R5cGVdLmFfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChrIGluIHRbdHlwZV0uYV9hdHRyKSB7XG5cdFx0XHRcdFx0aWYgKHRbdHlwZV0uYV9hdHRyLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHRcdFx0XHRpZiAoayA9PT0gJ2lkJykge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKG1bb2JqLmlkXS5hX2F0dHJba10gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRtW29iai5pZF0uYV9hdHRyW2tdID0gdFt0eXBlXS5hX2F0dHJba107XG5cdFx0XHRcdFx0XHRcdGlmIChhKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGsgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGEuYWRkQ2xhc3ModFt0eXBlXS5hX2F0dHJba10pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGEuYXR0cihrLCB0W3R5cGVdLmFfYXR0cltrXSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChrID09PSAnaHJlZicgJiYgbVtvYmouaWRdLmFfYXR0cltrXSA9PT0gJyMnKSB7XG5cdFx0XHRcdFx0XHRcdG1bb2JqLmlkXS5hX2F0dHJbJ2hyZWYnXSA9IHRbdHlwZV0uYV9hdHRyWydocmVmJ107XG5cdFx0XHRcdFx0XHRcdGlmIChhKSB7IGEuYXR0cignaHJlZicsIHRbdHlwZV0uYV9hdHRyWydocmVmJ10pOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChrID09PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRcdG1bb2JqLmlkXS5hX2F0dHJbJ2NsYXNzJ10gPSB0W3R5cGVdLmFfYXR0clsnY2xhc3MnXSArICcgJyArIG1bb2JqLmlkXS5hX2F0dHJbJ2NsYXNzJ107XG5cdFx0XHRcdFx0XHRcdGlmIChhKSB7IGEuYWRkQ2xhc3ModFt0eXBlXS5hX2F0dHJba10pOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cdH07XG5cdC8vIGluY2x1ZGUgdGhlIHR5cGVzIHBsdWdpbiBieSBkZWZhdWx0XG5cdC8vICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnMucHVzaChcInR5cGVzXCIpO1xuXG5cbi8qKlxuICogIyMjIFVuaXF1ZSBwbHVnaW5cbiAqXG4gKiBFbmZvcmNlcyB0aGF0IG5vIG5vZGVzIHdpdGggdGhlIHNhbWUgbmFtZSBjYW4gY29leGlzdCBhcyBzaWJsaW5ncy5cbiAqL1xuXG5cdC8qKlxuXHQgKiBzdG9yZXMgYWxsIGRlZmF1bHRzIGZvciB0aGUgdW5pcXVlIHBsdWdpblxuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy51bmlxdWVcblx0ICogQHBsdWdpbiB1bmlxdWVcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLnVuaXF1ZSA9IHtcblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgdGhlIGNvbXBhcmlzb24gc2hvdWxkIGJlIGNhc2Ugc2Vuc2l0aXZlLiBEZWZhdWx0IGlzIGBmYWxzZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMudW5pcXVlLmNhc2Vfc2Vuc2l0aXZlXG5cdFx0ICogQHBsdWdpbiB1bmlxdWVcblx0XHQgKi9cblx0XHRjYXNlX3NlbnNpdGl2ZSA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIEluZGljYXRlcyBpZiB3aGl0ZSBzcGFjZSBzaG91bGQgYmUgdHJpbW1lZCBiZWZvcmUgdGhlIGNvbXBhcmlzb24uIERlZmF1bHQgaXMgYGZhbHNlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy51bmlxdWUudHJpbV93aGl0ZXNwYWNlXG5cdFx0ICogQHBsdWdpbiB1bmlxdWVcblx0XHQgKi9cblx0XHR0cmltX3doaXRlc3BhY2UgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBBIGNhbGxiYWNrIGV4ZWN1dGVkIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlIHdoZW4gYSBuZXcgbm9kZSBpcyBjcmVhdGVkIGFuZCB0aGUgbmFtZSBpcyBhbHJlYWR5IHRha2VuLCB0aGUgdHdvIGFyZ3VtZW50cyBhcmUgdGhlIGNvbmZsaWN0aW5nIG5hbWUgYW5kIHRoZSBjb3VudGVyLiBUaGUgZGVmYXVsdCB3aWxsIHByb2R1Y2UgcmVzdWx0cyBsaWtlIGBOZXcgbm9kZSAoMilgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnVuaXF1ZS5kdXBsaWNhdGVcblx0XHQgKiBAcGx1Z2luIHVuaXF1ZVxuXHRcdCAqL1xuXHRcdGR1cGxpY2F0ZSA6IGZ1bmN0aW9uIChuYW1lLCBjb3VudGVyKSB7XG5cdFx0XHRyZXR1cm4gbmFtZSArICcgKCcgKyBjb3VudGVyICsgJyknO1xuXHRcdH1cblx0fTtcblxuXHQkLmpzdHJlZS5wbHVnaW5zLnVuaXF1ZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmNoZWNrID0gZnVuY3Rpb24gKGNoaywgb2JqLCBwYXIsIHBvcywgbW9yZSkge1xuXHRcdFx0aWYocGFyZW50LmNoZWNrLmNhbGwodGhpcywgY2hrLCBvYmosIHBhciwgcG9zLCBtb3JlKSA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRvYmogPSBvYmogJiYgb2JqLmlkID8gb2JqIDogdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cGFyID0gcGFyICYmIHBhci5pZCA/IHBhciA6IHRoaXMuZ2V0X25vZGUocGFyKTtcblx0XHRcdGlmKCFwYXIgfHwgIXBhci5jaGlsZHJlbikgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0dmFyIG4gPSBjaGsgPT09IFwicmVuYW1lX25vZGVcIiA/IHBvcyA6IG9iai50ZXh0LFxuXHRcdFx0XHRjID0gW10sXG5cdFx0XHRcdHMgPSB0aGlzLnNldHRpbmdzLnVuaXF1ZS5jYXNlX3NlbnNpdGl2ZSxcblx0XHRcdFx0dyA9IHRoaXMuc2V0dGluZ3MudW5pcXVlLnRyaW1fd2hpdGVzcGFjZSxcblx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsIGksIGosIHQ7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBwYXIuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdHQgPSBtW3Bhci5jaGlsZHJlbltpXV0udGV4dDtcblx0XHRcdFx0aWYgKCFzKSB7XG5cdFx0XHRcdFx0dCA9IHQudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodykge1xuXHRcdFx0XHRcdHQgPSB0LnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Yy5wdXNoKHQpO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXMpIHsgbiA9IG4udG9Mb3dlckNhc2UoKTsgfVxuXHRcdFx0aWYgKHcpIHsgbiA9IG4ucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTsgfVxuXHRcdFx0c3dpdGNoKGNoaykge1xuXHRcdFx0XHRjYXNlIFwiZGVsZXRlX25vZGVcIjpcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0Y2FzZSBcInJlbmFtZV9ub2RlXCI6XG5cdFx0XHRcdFx0dCA9IG9iai50ZXh0IHx8ICcnO1xuXHRcdFx0XHRcdGlmICghcykge1xuXHRcdFx0XHRcdFx0dCA9IHQudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHcpIHtcblx0XHRcdFx0XHRcdHQgPSB0LnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGkgPSAoJC5pbkFycmF5KG4sIGMpID09PSAtMSB8fCAob2JqLnRleHQgJiYgdCA9PT0gbikpO1xuXHRcdFx0XHRcdGlmKCFpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ3VuaXF1ZScsICdpZCcgOiAndW5pcXVlXzAxJywgJ3JlYXNvbicgOiAnQ2hpbGQgd2l0aCBuYW1lICcgKyBuICsgJyBhbHJlYWR5IGV4aXN0cy4gUHJldmVudGluZzogJyArIGNoaywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0Y2FzZSBcImNyZWF0ZV9ub2RlXCI6XG5cdFx0XHRcdFx0aSA9ICgkLmluQXJyYXkobiwgYykgPT09IC0xKTtcblx0XHRcdFx0XHRpZighaSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICd1bmlxdWUnLCAnaWQnIDogJ3VuaXF1ZV8wNCcsICdyZWFzb24nIDogJ0NoaWxkIHdpdGggbmFtZSAnICsgbiArICcgYWxyZWFkeSBleGlzdHMuIFByZXZlbnRpbmc6ICcgKyBjaGssICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdGNhc2UgXCJjb3B5X25vZGVcIjpcblx0XHRcdFx0XHRpID0gKCQuaW5BcnJheShuLCBjKSA9PT0gLTEpO1xuXHRcdFx0XHRcdGlmKCFpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ3VuaXF1ZScsICdpZCcgOiAndW5pcXVlXzAyJywgJ3JlYXNvbicgOiAnQ2hpbGQgd2l0aCBuYW1lICcgKyBuICsgJyBhbHJlYWR5IGV4aXN0cy4gUHJldmVudGluZzogJyArIGNoaywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0Y2FzZSBcIm1vdmVfbm9kZVwiOlxuXHRcdFx0XHRcdGkgPSAoIChvYmoucGFyZW50ID09PSBwYXIuaWQgJiYgKCFtb3JlIHx8ICFtb3JlLmlzX211bHRpKSkgfHwgJC5pbkFycmF5KG4sIGMpID09PSAtMSk7XG5cdFx0XHRcdFx0aWYoIWkpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAndW5pcXVlJywgJ2lkJyA6ICd1bmlxdWVfMDMnLCAncmVhc29uJyA6ICdDaGlsZCB3aXRoIG5hbWUgJyArIG4gKyAnIGFscmVhZHkgZXhpc3RzLiBQcmV2ZW50aW5nOiAnICsgY2hrLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fTtcblx0XHR0aGlzLmNyZWF0ZV9ub2RlID0gZnVuY3Rpb24gKHBhciwgbm9kZSwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkKSB7XG5cdFx0XHRpZighbm9kZSB8fCBub2RlLnRleHQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRpZihwYXIgPT09IG51bGwpIHtcblx0XHRcdFx0XHRwYXIgPSAkLmpzdHJlZS5yb290O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBhciA9IHRoaXMuZ2V0X25vZGUocGFyKTtcblx0XHRcdFx0aWYoIXBhcikge1xuXHRcdFx0XHRcdHJldHVybiBwYXJlbnQuY3JlYXRlX25vZGUuY2FsbCh0aGlzLCBwYXIsIG5vZGUsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cG9zID0gcG9zID09PSB1bmRlZmluZWQgPyBcImxhc3RcIiA6IHBvcztcblx0XHRcdFx0aWYoIXBvcy50b1N0cmluZygpLm1hdGNoKC9eKGJlZm9yZXxhZnRlcikkLykgJiYgIWlzX2xvYWRlZCAmJiAhdGhpcy5pc19sb2FkZWQocGFyKSkge1xuXHRcdFx0XHRcdHJldHVybiBwYXJlbnQuY3JlYXRlX25vZGUuY2FsbCh0aGlzLCBwYXIsIG5vZGUsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIW5vZGUpIHsgbm9kZSA9IHt9OyB9XG5cdFx0XHRcdHZhciB0bXAsIG4sIGRwYywgaSwgaiwgbSA9IHRoaXMuX21vZGVsLmRhdGEsIHMgPSB0aGlzLnNldHRpbmdzLnVuaXF1ZS5jYXNlX3NlbnNpdGl2ZSwgdyA9IHRoaXMuc2V0dGluZ3MudW5pcXVlLnRyaW1fd2hpdGVzcGFjZSwgY2IgPSB0aGlzLnNldHRpbmdzLnVuaXF1ZS5kdXBsaWNhdGUsIHQ7XG5cdFx0XHRcdG4gPSB0bXAgPSB0aGlzLmdldF9zdHJpbmcoJ05ldyBub2RlJyk7XG5cdFx0XHRcdGRwYyA9IFtdO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwYXIuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0dCA9IG1bcGFyLmNoaWxkcmVuW2ldXS50ZXh0O1xuXHRcdFx0XHRcdGlmICghcykge1xuXHRcdFx0XHRcdFx0dCA9IHQudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHcpIHtcblx0XHRcdFx0XHRcdHQgPSB0LnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRwYy5wdXNoKHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGkgPSAxO1xuXHRcdFx0XHR0ID0gbjtcblx0XHRcdFx0aWYgKCFzKSB7XG5cdFx0XHRcdFx0dCA9IHQudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodykge1xuXHRcdFx0XHRcdHQgPSB0LnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0d2hpbGUoJC5pbkFycmF5KHQsIGRwYykgIT09IC0xKSB7XG5cdFx0XHRcdFx0biA9IGNiLmNhbGwodGhpcywgdG1wLCAoKytpKSkudG9TdHJpbmcoKTtcblx0XHRcdFx0XHR0ID0gbjtcblx0XHRcdFx0XHRpZiAoIXMpIHtcblx0XHRcdFx0XHRcdHQgPSB0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh3KSB7XG5cdFx0XHRcdFx0XHR0ID0gdC5yZXBsYWNlKC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZywgJycpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRub2RlLnRleHQgPSBuO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhcmVudC5jcmVhdGVfbm9kZS5jYWxsKHRoaXMsIHBhciwgbm9kZSwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkKTtcblx0XHR9O1xuXHR9O1xuXG5cdC8vIGluY2x1ZGUgdGhlIHVuaXF1ZSBwbHVnaW4gYnkgZGVmYXVsdFxuXHQvLyAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zLnB1c2goXCJ1bmlxdWVcIik7XG5cblxuLyoqXG4gKiAjIyMgV2hvbGVyb3cgcGx1Z2luXG4gKlxuICogTWFrZXMgZWFjaCBub2RlIGFwcGVhciBibG9jayBsZXZlbC4gTWFraW5nIHNlbGVjdGlvbiBlYXNpZXIuIE1heSBjYXVzZSBzbG93IGRvd24gZm9yIGxhcmdlIHRyZWVzIGluIG9sZCBicm93c2Vycy5cbiAqL1xuXG5cdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcblx0ZGl2LnNldEF0dHJpYnV0ZSgndW5zZWxlY3RhYmxlJywnb24nKTtcblx0ZGl2LnNldEF0dHJpYnV0ZSgncm9sZScsJ3ByZXNlbnRhdGlvbicpO1xuXHRkaXYuY2xhc3NOYW1lID0gJ2pzdHJlZS13aG9sZXJvdyc7XG5cdGRpdi5pbm5lckhUTUwgPSAnJiMxNjA7Jztcblx0JC5qc3RyZWUucGx1Z2lucy53aG9sZXJvdyA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYXJlbnQuYmluZC5jYWxsKHRoaXMpO1xuXG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0Lm9uKCdyZWFkeS5qc3RyZWUgc2V0X3N0YXRlLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5oaWRlX2RvdHMoKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiaW5pdC5qc3RyZWUgbG9hZGluZy5qc3RyZWUgcmVhZHkuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Ly9kaXYuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fZGF0YS5jb3JlLmxpX2hlaWdodCArICdweCc7XG5cdFx0XHRcdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5hZGRDbGFzcygnanN0cmVlLXdob2xlcm93LXVsJyk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImRlc2VsZWN0X2FsbC5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtd2hvbGVyb3ctY2xpY2tlZCcpLnJlbW92ZUNsYXNzKCdqc3RyZWUtd2hvbGVyb3ctY2xpY2tlZCcpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJjaGFuZ2VkLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS13aG9sZXJvdy1jbGlja2VkJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS13aG9sZXJvdy1jbGlja2VkJyk7XG5cdFx0XHRcdFx0XHR2YXIgdG1wID0gZmFsc2UsIGksIGo7XG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkYXRhLnNlbGVjdGVkLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKGRhdGEuc2VsZWN0ZWRbaV0sIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbignLmpzdHJlZS13aG9sZXJvdycpLmFkZENsYXNzKCdqc3RyZWUtd2hvbGVyb3ctY2xpY2tlZCcpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcIm9wZW5fbm9kZS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5nZXRfbm9kZShkYXRhLm5vZGUsIHRydWUpLmZpbmQoJy5qc3RyZWUtY2xpY2tlZCcpLnBhcmVudCgpLmNoaWxkcmVuKCcuanN0cmVlLXdob2xlcm93JykuYWRkQ2xhc3MoJ2pzdHJlZS13aG9sZXJvdy1jbGlja2VkJyk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImhvdmVyX25vZGUuanN0cmVlIGRlaG92ZXJfbm9kZS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0aWYoZS50eXBlID09PSBcImhvdmVyX25vZGVcIiAmJiB0aGlzLmlzX2Rpc2FibGVkKGRhdGEubm9kZSkpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0XHR0aGlzLmdldF9ub2RlKGRhdGEubm9kZSwgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtd2hvbGVyb3cnKVtlLnR5cGUgPT09IFwiaG92ZXJfbm9kZVwiP1wiYWRkQ2xhc3NcIjpcInJlbW92ZUNsYXNzXCJdKCdqc3RyZWUtd2hvbGVyb3ctaG92ZXJlZCcpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJjb250ZXh0bWVudS5qc3RyZWVcIiwgXCIuanN0cmVlLXdob2xlcm93XCIsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9kYXRhLmNvbnRleHRtZW51KSB7XG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0dmFyIHRtcCA9ICQuRXZlbnQoJ2NvbnRleHRtZW51JywgeyBtZXRhS2V5IDogZS5tZXRhS2V5LCBjdHJsS2V5IDogZS5jdHJsS2V5LCBhbHRLZXkgOiBlLmFsdEtleSwgc2hpZnRLZXkgOiBlLnNoaWZ0S2V5LCBwYWdlWCA6IGUucGFnZVgsIHBhZ2VZIDogZS5wYWdlWSB9KTtcblx0XHRcdFx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoXCIuanN0cmVlLW5vZGVcIikuY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5maXJzdCgpLnRyaWdnZXIodG1wKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0LyohXG5cdFx0XHRcdC5vbihcIm1vdXNlZG93bi5qc3RyZWUgdG91Y2hzdGFydC5qc3RyZWVcIiwgXCIuanN0cmVlLXdob2xlcm93XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZihlLnRhcmdldCA9PT0gZS5jdXJyZW50VGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBhID0gJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoXCIuanN0cmVlLW5vZGVcIikuY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKTtcblx0XHRcdFx0XHRcdFx0ZS50YXJnZXQgPSBhWzBdO1xuXHRcdFx0XHRcdFx0XHRhLnRyaWdnZXIoZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0Ki9cblx0XHRcdFx0Lm9uKFwiY2xpY2suanN0cmVlXCIsIFwiLmpzdHJlZS13aG9sZXJvd1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSAkLkV2ZW50KCdjbGljaycsIHsgbWV0YUtleSA6IGUubWV0YUtleSwgY3RybEtleSA6IGUuY3RybEtleSwgYWx0S2V5IDogZS5hbHRLZXksIHNoaWZ0S2V5IDogZS5zaGlmdEtleSB9KTtcblx0XHRcdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KFwiLmpzdHJlZS1ub2RlXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikuZmlyc3QoKS50cmlnZ2VyKHRtcCkuZm9jdXMoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQub24oXCJkYmxjbGljay5qc3RyZWVcIiwgXCIuanN0cmVlLXdob2xlcm93XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0dmFyIHRtcCA9ICQuRXZlbnQoJ2RibGNsaWNrJywgeyBtZXRhS2V5IDogZS5tZXRhS2V5LCBjdHJsS2V5IDogZS5jdHJsS2V5LCBhbHRLZXkgOiBlLmFsdEtleSwgc2hpZnRLZXkgOiBlLnNoaWZ0S2V5IH0pO1xuXHRcdFx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoXCIuanN0cmVlLW5vZGVcIikuY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5maXJzdCgpLnRyaWdnZXIodG1wKS5mb2N1cygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdC5vbihcImNsaWNrLmpzdHJlZVwiLCBcIi5qc3RyZWUtbGVhZiA+IC5qc3RyZWUtb2NsXCIsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHR2YXIgdG1wID0gJC5FdmVudCgnY2xpY2snLCB7IG1ldGFLZXkgOiBlLm1ldGFLZXksIGN0cmxLZXkgOiBlLmN0cmxLZXksIGFsdEtleSA6IGUuYWx0S2V5LCBzaGlmdEtleSA6IGUuc2hpZnRLZXkgfSk7XG5cdFx0XHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdChcIi5qc3RyZWUtbm9kZVwiKS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLmZpcnN0KCkudHJpZ2dlcih0bXApLmZvY3VzKCk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcIm1vdXNlb3Zlci5qc3RyZWVcIiwgXCIuanN0cmVlLXdob2xlcm93LCAuanN0cmVlLWljb25cIiwgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdGlmKCF0aGlzLmlzX2Rpc2FibGVkKGUuY3VycmVudFRhcmdldCkpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5ob3Zlcl9ub2RlKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcIm1vdXNlbGVhdmUuanN0cmVlXCIsIFwiLmpzdHJlZS1ub2RlXCIsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuZGVob3Zlcl9ub2RlKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdH07XG5cdFx0dGhpcy50ZWFyZG93biA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3Mud2hvbGVyb3cpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoXCIuanN0cmVlLXdob2xlcm93XCIpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdFx0cGFyZW50LnRlYXJkb3duLmNhbGwodGhpcyk7XG5cdFx0fTtcblx0XHR0aGlzLnJlZHJhd19ub2RlID0gZnVuY3Rpb24ob2JqLCBkZWVwLCBjYWxsYmFjaywgZm9yY2VfcmVuZGVyKSB7XG5cdFx0XHRvYmogPSBwYXJlbnQucmVkcmF3X25vZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdGlmKG9iaikge1xuXHRcdFx0XHR2YXIgdG1wID0gZGl2LmNsb25lTm9kZSh0cnVlKTtcblx0XHRcdFx0Ly90bXAuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fZGF0YS5jb3JlLmxpX2hlaWdodCArICdweCc7XG5cdFx0XHRcdGlmKCQuaW5BcnJheShvYmouaWQsIHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCkgIT09IC0xKSB7IHRtcC5jbGFzc05hbWUgKz0gJyBqc3RyZWUtd2hvbGVyb3ctY2xpY2tlZCc7IH1cblx0XHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgJiYgdGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgPT09IG9iai5pZCkgeyB0bXAuY2xhc3NOYW1lICs9ICcganN0cmVlLXdob2xlcm93LWhvdmVyZWQnOyB9XG5cdFx0XHRcdG9iai5pbnNlcnRCZWZvcmUodG1wLCBvYmouY2hpbGROb2Rlc1swXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH07XG5cdH07XG5cdC8vIGluY2x1ZGUgdGhlIHdob2xlcm93IHBsdWdpbiBieSBkZWZhdWx0XG5cdC8vICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnMucHVzaChcIndob2xlcm93XCIpO1xuXHRpZih3aW5kb3cuY3VzdG9tRWxlbWVudHMgJiYgT2JqZWN0ICYmIE9iamVjdC5jcmVhdGUpIHtcblx0XHR2YXIgcHJvdG8gPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSk7XG5cdFx0cHJvdG8uY3JlYXRlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGMgPSB7IGNvcmUgOiB7fSwgcGx1Z2lucyA6IFtdIH0sIGk7XG5cdFx0XHRmb3IoaSBpbiAkLmpzdHJlZS5wbHVnaW5zKSB7XG5cdFx0XHRcdGlmKCQuanN0cmVlLnBsdWdpbnMuaGFzT3duUHJvcGVydHkoaSkgJiYgdGhpcy5hdHRyaWJ1dGVzW2ldKSB7XG5cdFx0XHRcdFx0Yy5wbHVnaW5zLnB1c2goaSk7XG5cdFx0XHRcdFx0aWYodGhpcy5nZXRBdHRyaWJ1dGUoaSkgJiYgSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZShpKSkpIHtcblx0XHRcdFx0XHRcdGNbaV0gPSBKU09OLnBhcnNlKHRoaXMuZ2V0QXR0cmlidXRlKGkpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZvcihpIGluICQuanN0cmVlLmRlZmF1bHRzLmNvcmUpIHtcblx0XHRcdFx0aWYoJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5oYXNPd25Qcm9wZXJ0eShpKSAmJiB0aGlzLmF0dHJpYnV0ZXNbaV0pIHtcblx0XHRcdFx0XHRjLmNvcmVbaV0gPSBKU09OLnBhcnNlKHRoaXMuZ2V0QXR0cmlidXRlKGkpKSB8fCB0aGlzLmdldEF0dHJpYnV0ZShpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JCh0aGlzKS5qc3RyZWUoYyk7XG5cdFx0fTtcblx0XHQvLyBwcm90by5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAobmFtZSwgcHJldmlvdXMsIHZhbHVlKSB7IH07XG5cdFx0dHJ5IHtcblx0XHRcdHdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ2YWthdGEtanN0cmVlXCIsIGZ1bmN0aW9uKCkge30sIHsgcHJvdG90eXBlOiBwcm90byB9KTtcblx0XHR9IGNhdGNoIChpZ25vcmUpIHsgfVxuXHR9XG5cbn0pKTsiXSwic291cmNlUm9vdCI6IiJ9