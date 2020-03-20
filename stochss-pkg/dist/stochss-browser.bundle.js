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
let _ = __webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js");
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
          if(response.statusCode < 400) {
            node.original._path = path.join(newDir, file)
          }else{
            body = JSON.parse(body)
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
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(o.parent);
          if(node.type === "root"){
            $('#models-jstree').jstree().refresh();
          }else{
            $('#models-jstree').jstree().refresh_node(node);
          }
        }else{
          body = JSON.parse(body)
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
    xhr({uri: endpoint}, function (err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(parentID);
          if(node.type === "root"){
            $('#models-jstree').jstree().refresh()
          }else{          
            $('#models-jstree').jstree().refresh_node(node);
          }
        }else{
          body = JSON.parse(body)
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
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(parentID);
          if(node.type === "root"){
            $('#models-jstree').jstree().refresh()
          }else{          
            $('#models-jstree').jstree().refresh_node(node);
          }
        }else{
          body = JSON.parse(body)
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
    xhr({uri: endpoint}, function (err, response, body) {
        if(response.statusCode < 400) {
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
        }else{
          body = JSON.parse(body)
        }
      }
    );
  },
  toNotebook: function (o) {
    var endpoint = path.join(app.getApiPath(), "/models/to-notebook", o.original._path)
    xhr({ uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400){
        var node = $('#models-jstree').jstree().get_node(o.parent)
        if(node.type === 'root'){
          $('#models-jstree').jstree().refresh();
        }else{
          $('#models-jstree').jstree().refresh_node(node);
        }
        var notebookPath = path.join(app.getBasePath(), "notebooks", body.File)
        window.open(notebookPath, '_blank')
      }
    });
  },
  toSBML: function (o) {
    var self = this;
    var parentID = o.parent;
    var endpoint = path.join(app.getApiPath(), "model/to-sbml", o.original._path);
    xhr({uri: endpoint},
      function (err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(parentID);
          if(node.type === "root"){
            $('#models-jstree').jstree().refresh()
          }else{          
            $('#models-jstree').jstree().refresh_node(node);
          }
        }else{
          body = JSON.parse(body)
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
        xhr({uri: endpoint, json: true}, function (err, response, body){
          if(response.statusCode < 400) {
            if(body.changed) {
              nameWarning.text(body.message)
              nameWarning.collapse('show');
              window.scrollTo(0,0)
              setTimeout(_.bind(self.hideNameWarning, self), 10000);
            }
            node.original._path = body._path
          }else{
            if(parent.type === "root"){
              $('#models-jstree').jstree().refresh()
            }else{          
              $('#models-jstree').jstree().refresh_node(parent);
            }
          }
        })
      }
      extensionWarning.collapse('hide');
      nameWarning.collapse('hide');
    });
  },
  hideNameWarning: function () {
    $(this.queryByHook('rename-warning')).collapse('hide')
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
      if(response.statusCode < 400){
        self.exportToFile(body, o.original.text);
      }else{
        body = JSON.parse(body)
      }
    });
  },
  getZipFileForExport: function (o) {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "file/download-zip/generate", o.original._path);
    xhr({uri: endpoint,json:true}, function (err, response, body) {
      if(response.statusCode < 400) {
        var node = $('#models-jstree').jstree().get_node(o.parent);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh();
        }else{
          $('#models-jstree').jstree().refresh_node(node);
        }
        self.exportToZipFile(body.Path)
      }
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
                  self.toNotebook(o)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL2ZpbGUtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL3BhZ2VzL2ZpbGVCcm93c2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanN0cmVlL2Rpc3QvanN0cmVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRLG9CQUFvQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBLDBCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7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QUFlLGFBQWE7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLO0FBQ2I7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlO0FBQ2YsOEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGU7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWU7QUFDZiw4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLDJEQUEyRDtBQUNqRztBQUNBLElBQUk7QUFD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LDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxPQUFPO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsNEJBQTRCLEVBQUU7QUFDdkcsd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLE9BQU87QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsT0FBTztBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FB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O0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxPQUFPO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLGtFQUFrRSxRQUFRO0FBQzFFO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLHlDQUF5Qyx1SEFBdUg7QUFDaEs7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MscUZBQXFGO0FBQ3ZIO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxxQ0FBcUMscUZBQXFGO0FBQzFIO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxrQ0FBa0MscUZBQXFGO0FBQ3ZIO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCw2Q0FBNkM7QUFDekcsdUVBQXVFLDZDQUE2QztBQUNwSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksVUFBVSxnQkFBZ0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0VBQXdFO0FBQ3hFO0FBQ0EsOERBQThELEdBQUcsbUJBQW1CO0FBQ3BGLEdBQUcsaUJBQWlCO0FBQ3BCOztBQUVBLENBQUMsRyIsImZpbGUiOiJzdG9jaHNzLWJyb3dzZXIuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbiBcdC8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcImJyb3dzZXJcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL2NsaWVudC9wYWdlcy9maWxlLWJyb3dzZXIuanNcIixcImNvbW1vblwiXSk7XG4gXHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIHJlYWR5XG4gXHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiIsImxldCBqc3RyZWUgPSByZXF1aXJlKCdqc3RyZWUnKTtcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xubGV0IHhociA9IHJlcXVpcmUoJ3hocicpO1xubGV0IFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcGFnZXMvZmlsZUJyb3dzZXIucHVnJyk7XG5sZXQgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xubGV0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5sZXQgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG4vL2xldCBib290c3RyYXAgPSByZXF1aXJlKCdib290c3RyYXAnKTtcblxuaW1wb3J0IGluaXRQYWdlIGZyb20gJy4vcGFnZS5qcyc7XG5cbmxldCBhamF4RGF0YSA9IHtcbiAgXCJ1cmxcIiA6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYobm9kZS5wYXJlbnQgPT09IG51bGwpe1xuICAgICAgcmV0dXJuIFwic3RvY2hzcy9tb2RlbHMvYnJvd3Nlci1saXN0L1wiXG4gICAgfVxuICAgIHJldHVybiBcInN0b2Noc3MvbW9kZWxzL2Jyb3dzZXItbGlzdFwiICsgbm9kZS5vcmlnaW5hbC5fcGF0aFxuICB9LFxuICBcImRhdGFUeXBlXCIgOiBcImpzb25cIixcbiAgXCJkYXRhXCIgOiBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJldHVybiB7ICdpZCcgOiBub2RlLmlkfVxuICB9LFxufVxuXG5sZXQgdHJlZVNldHRpbmdzID0ge1xuICAncGx1Z2lucyc6IFtcbiAgICAndHlwZXMnLFxuICAgICd3aG9sZXJvdycsXG4gICAgJ2NoYW5nZWQnLFxuICAgICdjb250ZXh0bWVudScsXG4gICAgJ2RuZCcsXG4gIF0sXG4gICdjb3JlJzoge1xuICAgICdtdWx0aXBsZScgOiBmYWxzZSxcbiAgICAnYW5pbWF0aW9uJzogMCxcbiAgICAnY2hlY2tfY2FsbGJhY2snOiBmdW5jdGlvbiAob3AsIG5vZGUsIHBhciwgcG9zLCBtb3JlKSB7XG4gICAgICBpZihvcCA9PT0gJ21vdmVfbm9kZScgJiYgbW9yZSAmJiBtb3JlLnJlZiAmJiBtb3JlLnJlZi50eXBlICYmICEobW9yZS5yZWYudHlwZSA9PSAnZm9sZGVyJyB8fCBtb3JlLnJlZi50eXBlID09ICdyb290Jykpe1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmKG9wID09PSAnbW92ZV9ub2RlJyAmJiBtb3JlICYmIG1vcmUucmVmICYmIG1vcmUucmVmLnR5cGUgJiYgbW9yZS5yZWYudHlwZSA9PT0gJ2ZvbGRlcicpe1xuICAgICAgICBpZighbW9yZS5yZWYuc3RhdGUubG9hZGVkKXtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXhpc3RzID0gZmFsc2VcbiAgICAgICAgdmFyIEJyZWFrRXhjZXB0aW9uID0ge31cbiAgICAgICAgdHJ5e1xuICAgICAgICAgIG1vcmUucmVmLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRfbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUoY2hpbGQpXG4gICAgICAgICAgICBleGlzdHMgPSBjaGlsZF9ub2RlLnRleHQgPT09IG5vZGUudGV4dFxuICAgICAgICAgICAgaWYoZXhpc3RzKXtcbiAgICAgICAgICAgICAgdGhyb3cgQnJlYWtFeGNlcHRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfWNhdGNoe1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYob3AgPT09ICdtb3ZlX25vZGUnICYmIG1vcmUgJiYgKHBvcyAhPSAwIHx8IG1vcmUucG9zICE9PSBcImlcIikgJiYgIW1vcmUuY29yZSl7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgaWYob3AgPT09ICdtb3ZlX25vZGUnICYmIG1vcmUgJiYgbW9yZS5jb3JlKSB7XG4gICAgICAgIHZhciBuZXdEaXIgPSBwYXIub3JpZ2luYWwuX3BhdGhcbiAgICAgICAgdmFyIGZpbGUgPSBub2RlLm9yaWdpbmFsLl9wYXRoLnNwbGl0KCcvJykucG9wKClcbiAgICAgICAgdmFyIG9sZFBhdGggPSBub2RlLm9yaWdpbmFsLl9wYXRoXG4gICAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi9maWxlL21vdmVcIiwgb2xkUGF0aCwgJzwtLU1vdmVUby0tPicsIG5ld0RpciwgZmlsZSlcbiAgICAgICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24oZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1c0NvZGUgPCA0MDApIHtcbiAgICAgICAgICAgIG5vZGUub3JpZ2luYWwuX3BhdGggPSBwYXRoLmpvaW4obmV3RGlyLCBmaWxlKVxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgICAgIGlmKHBhci50eXBlID09PSAncm9vdCcpe1xuICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKHBhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSxcbiAgICAndGhlbWVzJzoge1xuICAgICAgJ3N0cmlwZXMnOiB0cnVlLFxuICAgICAgJ3ZhcmlhbnQnOiAnbGFyZ2UnXG4gICAgfSxcbiAgICAnZGF0YSc6IGFqYXhEYXRhLFxuICB9LFxuICAndHlwZXMnIDoge1xuICAgICdyb290JyA6IHtcbiAgICAgIFwiaWNvblwiOiBcImpzdHJlZS1pY29uIGpzdHJlZS1mb2xkZXJcIlxuICAgIH0sXG4gICAgJ2ZvbGRlcicgOiB7XG4gICAgICBcImljb25cIjogXCJqc3RyZWUtaWNvbiBqc3RyZWUtZm9sZGVyXCJcbiAgICB9LFxuICAgICdzcGF0aWFsJyA6IHtcbiAgICAgIFwiaWNvblwiOiBcImpzdHJlZS1pY29uIGpzdHJlZS1maWxlXCJcbiAgICB9LFxuICAgICdub25zcGF0aWFsJyA6IHtcbiAgICAgIFwiaWNvblwiOiBcImpzdHJlZS1pY29uIGpzdHJlZS1maWxlXCJcbiAgICB9LFxuICAgICd3b3JrZmxvdycgOiB7XG4gICAgICBcImljb25cIjogXCJqc3RyZWUtaWNvbiBqc3RyZWUtZmlsZVwiXG4gICAgfSxcbiAgICAnbm90ZWJvb2snIDoge1xuICAgICAgXCJpY29uXCI6IFwianN0cmVlLWljb24ganN0cmVlLWZpbGVcIlxuICAgIH0sXG4gICAgJ21lc2gnIDoge1xuICAgICAgXCJpY29uXCI6IFwianN0cmVlLWljb24ganN0cmVlLWZpbGVcIlxuICAgIH0sXG4gICAgJ3NibWwtbW9kZWwnIDoge1xuICAgICAgXCJpY29uXCI6IFwianN0cmVlLWljb24ganN0cmVlLWZpbGVcIlxuICAgIH0sXG4gICAgJ290aGVyJyA6IHtcbiAgICAgIFwiaWNvblwiOiBcImpzdHJlZS1pY29uIGpzdHJlZS1maWxlXCJcbiAgICB9LFxuICB9LCAgXG59XG5cbmxldCBvcGVyYXRpb25JbmZvTW9kYWxIdG1sID0gKCkgPT4ge1xuICBsZXQgZmlsZUJyb3dzZXJIZWxwTWVzc2FnZSA9IGBcbiAgICA8cD48Yj5PcGVuL0VkaXQgYSBGaWxlPC9iPjogRG91YmxlLWNsaWNrIG9uIGEgZmlsZSBvciByaWdodC1jbGljayBvbiBhIGZpbGUgYW5kIGNsaWNrIE9wZW4vRWRpdC4gIFxuICAgIDxiPk5vdGU8L2I+OiBTb21lIGZpbGVzIHdpbGwgb3BlbiBpbiBhIG5ldyB0YWIgc28geW91IG1heSB3YW50IHRvIHR1cm4gb2ZmIHRoZSBwb3AtdXAgYmxvY2tlci48L3A+XG4gICAgPHA+PGI+T3BlbiBEaXJlY3Rvcnk8L2I+OiBDbGljayBvbiB0aGUgYXJyb3cgbmV4dCB0byB0aGUgZGlyZWN0b3J5IG9yIGRvdWJsZS1jbGljayBvbiB0aGUgZGlyZWN0b3J5LjwvcD5cbiAgICA8cD48Yj5DcmVhdGUgYSBEaXJlY3RvcnkvTW9kZWw8L2I+OiBSaWdodC1jbGljayBvbiBhIGRpcmVjdG9yeSwgY2xpY2sgTmV3IERpcmVjdG9yeS9OZXcgTW9kZWwsIGFuZCBlbnRlciB0aGUgbmFtZSBvZiBkaXJlY3RvcnkvbW9kZWwgb3IgcGF0aC4gIFxuICAgIEZvciBtb2RlbHMgeW91IHdpbGwgbmVlZCB0byBjbGljayBvbiB0aGUgdHlwZSBvZiBtb2RlbCB5b3Ugd2lzaCB0byBjcmVhdGUgYmVmb3JlIGVudGVyaW5nIHRoZSBuYW1lIG9yIHBhdGguPC9wPlxuICAgIDxwPjxiPkNyZWF0ZSBhIFdvcmtmbG93PC9iPjogUmlnaHQtY2xpY2sgb24gYSBtb2RlbCBhbmQgY2xpY2sgTmV3IFdvcmtmbG93LCB0aGlzIHRha2VzIHlvdSB0byB0aGUgd29ya2Zsb3cgc2VsZWN0aW9uIHBhZ2UuICBcbiAgICBGcm9tIHRoZSB3b3JrZmxvdyBzZWxlY3Rpb24gcGFnZSwgY2xpY2sgb24gb25lIG9mIHRoZSBsaXN0ZWQgd29ya2Zsb3dzLjwvcD5cbiAgICA8cD48Yj5Db252ZXJ0IGEgRmlsZTwvYj46IFJpZ2h0LWNsaWNrIG9uIGEgTW9kZWwvU0JNTCwgY2xpY2sgQ29udmVydCwgYW5kIGNsaWNrIG9uIHRoZSBkZXNpcmVkIENvbnZlcnQgdG8gb3B0aW9uLiAgXG4gICAgTW9kZWwgZmlsZXMgY2FuIGJlIGNvbnZlcnRlZCB0byBTcGF0aWFsIE1vZGVscywgTm90ZWJvb2tzLCBvciBTQk1MIGZpbGVzLiAgXG4gICAgU3BhdGlhbCBNb2RlbHMgYW5kIFNCTUwgZmlsZSBjYW4gYmUgY29udmVydGVkIHRvIE1vZGVscy4gIFxuICAgIDxiPk5vdGU8L2I+OiBOb3RlYm9va3Mgd2lsbCBvcGVuIGluIGEgbmV3IHRhYiBzbyB5b3UgbWF5IHdhbnQgdG8gdHVybiBvZmYgdGhlIHBvcC11cCBibG9ja2VyLjwvcD5cbiAgICA8cD48Yj5Nb3ZlIEZpbGUgb3IgRGlyZWN0b3J5PC9iPjogQ2xpY2sgYW5kIGRyYWcgdGhlIGZpbGUgb3IgZGlyZWN0b3J5IHRvIHRoZSBuZXcgbG9jYXRpb24uICBcbiAgICBZb3UgY2FuIG9ubHkgbW92ZSBhbiBpdGVtIHRvIGEgZGlyZWN0b3J5IGlmIHRoZXJlIGlzbid0IGEgZmlsZSBvciBkaXJlY3Rvcnkgd2l0aCB0aGUgc2FtZSBuYW1lIGluIHRoYXQgbG9jYXRpb24uPC9wPlxuICAgIDxwPjxiPkRvd25sb2FkIGEgTW9kZWwvTm90ZWJvb2svU0JNTCBGaWxlPC9iPjogUmlnaHQtY2xpY2sgb24gdGhlIGZpbGUgYW5kIGNsaWNrIGRvd25sb2FkLjwvcD5cbiAgICA8cD48Yj5SZW5hbWUgRmlsZS9EaXJlY3Rvcnk8L2I+OiBSaWdodC1jbGljayBvbiBhIGZpbGUvZGlyZWN0b3J5LCBjbGljayByZW5hbWUsIGFuZCBlbnRlciB0aGUgbmV3IG5hbWUuPC9wPlxuICAgIDxwPjxiPkR1cGxpY2F0ZS9EZWxldGUgQSBGaWxlL0RpcmVjdG9yeTwvYj46IFJpZ2h0LWNsaWNrIG9uIHRoZSBmaWxlL2RpcmVjdG9yeSBhbmQgY2xpY2sgRHVwbGljYXRlL0RlbGV0ZS48L3A+XG4gIGA7XG4gIFxuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJvcGVyYXRpb25JbmZvTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQgaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+IEhlbHAgPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxwPiAke2ZpbGVCcm93c2VySGVscE1lc3NhZ2V9IDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgIFxufVxuXG4vLyBVc2luZyBhIGJvb3RzdHJhcCBtb2RhbCB0byBpbnB1dCBtb2RlbCBuYW1lcyBmb3Igbm93XG5sZXQgcmVuZGVyQ3JlYXRlTW9kYWxIdG1sID0gKGlzTW9kZWwsIGlzU3BhdGlhbCkgPT4ge1xuICB2YXIgdGl0bGVUZXh0ID0gJ0RpcmVjdG9yeSc7XG4gIGlmKGlzTW9kZWwpe1xuICAgIHRpdGxlVGV4dCA9IGlzU3BhdGlhbCA/ICdTcGF0aWFsIE1vZGVsJyA6ICdOb24tU3BhdGlhbCBNb2RlbCc7XG4gIH1cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwibmV3TW9kYWxNb2RlbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+TmV3ICR7dGl0bGVUZXh0fTwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibW9kZWxOYW1lSW5wdXRcIj5OYW1lOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cIm1vZGVsTmFtZUlucHV0XCIgbmFtZT1cIm1vZGVsTmFtZUlucHV0XCIgc2l6ZT1cIjMwXCIgYXV0b2ZvY3VzPlxuXHQgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IG9rLW1vZGVsLWJ0blwiPk9LPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbmxldCBzYm1sVG9Nb2RlbEh0bWwgPSAodGl0bGUsIGVycm9ycykgPT4ge1xuICBmb3IodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYoZXJyb3JzW2ldLnN0YXJ0c1dpdGgoXCJTQk1MIEVycm9yXCIpIHx8IGVycm9yc1tpXS5zdGFydHNXaXRoKFwiRXJyb3JcIikpe1xuICAgICAgZXJyb3JzW2ldID0gXCI8Yj5FcnJvcjwvYj46IFwiICsgZXJyb3JzW2ldXG4gICAgfWVsc2V7XG4gICAgICBlcnJvcnNbaV0gPSBcIjxiPldhcm5pbmc8L2I+OiBcIiArIGVycm9yc1tpXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cInNibWxUb01vZGVsTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQgaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+ICR7dGl0bGV9IDwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8cD4gJHtlcnJvcnMuam9pbihcIjxicj5cIil9IDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbmxldCBkZWxldGVGaWxlSHRtbCA9IChmaWxlVHlwZSkgPT4ge1xuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJkZWxldGVGaWxlTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQgaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+IFBlcm1hbmVudGx5IGRlbGV0ZSB0aGlzICR7ZmlsZVR5cGV9PyA8L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSB5ZXMtbW9kYWwtYnRuXCI+WWVzPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5ObzwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbmxldCBGaWxlQnJvd3NlciA9IFBhZ2VWaWV3LmV4dGVuZCh7XG4gIHBhZ2VUaXRsZTogJ1N0b2NoU1MgfCBGaWxlIEJyb3dzZXInLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXJlZnJlc2gtanN0cmVlXScgOiAncmVmcmVzaEpTVHJlZScsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZmlsZS1icm93c2VyLWhlbHBdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBtb2RhbCA9ICQob3BlcmF0aW9uSW5mb01vZGFsSHRtbCgpKS5tb2RhbCgpO1xuICAgIH0sXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIHRoaXMuc2V0dXBKc3RyZWUoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYucmVmcmVzaEluaXRpYWxKU1RyZWUoKTtcbiAgICB9LCAzMDAwKTtcbiAgfSxcbiAgcmVmcmVzaEpTVHJlZTogZnVuY3Rpb24gKCkge1xuICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpXG4gIH0sXG4gIHJlZnJlc2hJbml0aWFsSlNUcmVlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjb3VudCA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuX21vZGVsLmRhdGFbJyMnXS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgaWYoY291bnQgPT0gMCkge1xuICAgICAgc2VsZi5yZWZyZXNoSlNUcmVlKCk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5yZWZyZXNoSW5pdGlhbEpTVHJlZSgpO1xuICAgICAgfSwgMzAwMCk7XG4gICAgfVxuICB9LFxuICBkZWxldGVGaWxlOiBmdW5jdGlvbiAobykge1xuICAgIHZhciBmaWxlVHlwZSA9IG8udHlwZVxuICAgIGlmKGZpbGVUeXBlID09PSBcIm5vbnNwYXRpYWxcIilcbiAgICAgIGZpbGVUeXBlID0gXCJtb2RlbFwiO1xuICAgIGVsc2UgaWYoZmlsZVR5cGUgPT09IFwic3BhdGlhbFwiKVxuICAgICAgZmlsZVR5cGUgPSBcInNwYXRpYWwgbW9kZWxcIlxuICAgIGVsc2UgaWYoZmlsZVR5cGUgPT09IFwic2JtbC1tb2RlbFwiKVxuICAgICAgZmlsZVR5cGUgPSBcInNibWwgbW9kZWxcIlxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWxldGVGaWxlTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbGV0ZUZpbGVNb2RhbCcpLnJlbW92ZSgpXG4gICAgfVxuICAgIGxldCBtb2RhbCA9ICQoZGVsZXRlRmlsZUh0bWwoZmlsZVR5cGUpKS5tb2RhbCgpO1xuICAgIGxldCB5ZXNCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVsZXRlRmlsZU1vZGFsIC55ZXMtbW9kYWwtYnRuJyk7XG4gICAgeWVzQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi9maWxlL2RlbGV0ZVwiLCBvLm9yaWdpbmFsLl9wYXRoKVxuICAgICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24oZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICBpZihyZXNwb25zZS5zdGF0dXNDb2RlIDwgNDAwKSB7XG4gICAgICAgICAgdmFyIG5vZGUgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKG8ucGFyZW50KTtcbiAgICAgICAgICBpZihub2RlLnR5cGUgPT09IFwicm9vdFwiKXtcbiAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoX25vZGUobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBib2R5ID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKVxuICAgIH0pO1xuICB9LFxuICBkdXBsaWNhdGVGaWxlT3JEaXJlY3Rvcnk6IGZ1bmN0aW9uKG8sIGlzRGlyZWN0b3J5KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBwYXJlbnRJRCA9IG8ucGFyZW50O1xuICAgIGlmKGlzRGlyZWN0b3J5KXtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcImRpcmVjdG9yeS9kdXBsaWNhdGVcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgfWVsc2V7XG4gICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCJtb2RlbC9kdXBsaWNhdGVcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgfVxuICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1c0NvZGUgPCA0MDApIHtcbiAgICAgICAgICB2YXIgbm9kZSA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUocGFyZW50SUQpO1xuICAgICAgICAgIGlmKG5vZGUudHlwZSA9PT0gXCJyb290XCIpe1xuICAgICAgICAgICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5yZWZyZXNoKClcbiAgICAgICAgICB9ZWxzZXsgICAgICAgICAgXG4gICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGJvZHkgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9LFxuICB0b1NwYXRpYWw6IGZ1bmN0aW9uIChvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBwYXJlbnRJRCA9IG8ucGFyZW50O1xuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi9tb2RlbC90by1zcGF0aWFsXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIHhocih7dXJpOiBlbmRwb2ludH0sIFxuICAgICAgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShwYXJlbnRJRCk7XG4gICAgICAgICAgaWYobm9kZS50eXBlID09PSBcInJvb3RcIil7XG4gICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICAgIH1lbHNleyAgICAgICAgICBcbiAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH0sXG4gIHRvTW9kZWw6IGZ1bmN0aW9uIChvLCBmcm9tKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBwYXJlbnRJRCA9IG8ucGFyZW50O1xuICAgIGlmKGZyb20gPT09IFwiU3BhdGlhbFwiKXtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi9zcGF0aWFsL3RvLW1vZGVsXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIH1lbHNle1xuICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwic2JtbC90by1tb2RlbFwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICB9XG4gICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShwYXJlbnRJRCk7XG4gICAgICAgICAgaWYobm9kZS50eXBlID09PSBcInJvb3RcIil7XG4gICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICAgIH1lbHNleyAgICAgICAgICBcbiAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihmcm9tID09PSBcIlNCTUxcIil7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBcIlwiXG4gICAgICAgICAgICB2YXIgcmVzcCA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgICAgIHZhciBtc2cgPSByZXNwLm1lc3NhZ2VcbiAgICAgICAgICAgIHZhciBlcnJvcnMgPSByZXNwLmVycm9yc1xuICAgICAgICAgICAgbGV0IG1vZGFsID0gJChzYm1sVG9Nb2RlbEh0bWwobXNnLCBlcnJvcnMpKS5tb2RhbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH0sXG4gIHRvTm90ZWJvb2s6IGZ1bmN0aW9uIChvKSB7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiL21vZGVscy90by1ub3RlYm9va1wiLCBvLm9yaWdpbmFsLl9wYXRoKVxuICAgIHhocih7IHVyaTogZW5kcG9pbnQsIGpzb246IHRydWV9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCl7XG4gICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShvLnBhcmVudClcbiAgICAgICAgaWYobm9kZS50eXBlID09PSAncm9vdCcpe1xuICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm90ZWJvb2tQYXRoID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcIm5vdGVib29rc1wiLCBib2R5LkZpbGUpXG4gICAgICAgIHdpbmRvdy5vcGVuKG5vdGVib29rUGF0aCwgJ19ibGFuaycpXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHRvU0JNTDogZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHBhcmVudElEID0gby5wYXJlbnQ7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwibW9kZWwvdG8tc2JtbFwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICB4aHIoe3VyaTogZW5kcG9pbnR9LFxuICAgICAgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShwYXJlbnRJRCk7XG4gICAgICAgICAgaWYobm9kZS50eXBlID09PSBcInJvb3RcIil7XG4gICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICAgIH1lbHNleyAgICAgICAgICBcbiAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH0sXG4gIHJlbmFtZU5vZGU6IGZ1bmN0aW9uIChvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIHRleHQgPSBvLnRleHQ7XG4gICAgdmFyIHBhcmVudCA9ICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkuZ2V0X25vZGUoby5wYXJlbnQpXG4gICAgdmFyIGV4dGVuc2lvbldhcm5pbmcgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2V4dGVuc2lvbi13YXJuaW5nJykpO1xuICAgIHZhciBuYW1lV2FybmluZyA9ICQodGhpcy5xdWVyeUJ5SG9vaygncmVuYW1lLXdhcm5pbmcnKSk7XG4gICAgZXh0ZW5zaW9uV2FybmluZy5jb2xsYXBzZSgnc2hvdycpXG4gICAgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5lZGl0KG8sIG51bGwsIGZ1bmN0aW9uKG5vZGUsIHN0YXR1cykge1xuICAgICAgaWYodGV4dCAhPSBub2RlLnRleHQpe1xuICAgICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvZmlsZS9yZW5hbWVcIiwgby5vcmlnaW5hbC5fcGF0aCwgXCI8LS1jaGFuZ2UtLT5cIiwgbm9kZS50ZXh0KVxuICAgICAgICB4aHIoe3VyaTogZW5kcG9pbnQsIGpzb246IHRydWV9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSl7XG4gICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgICAgICAgICAgaWYoYm9keS5jaGFuZ2VkKSB7XG4gICAgICAgICAgICAgIG5hbWVXYXJuaW5nLnRleHQoYm9keS5tZXNzYWdlKVxuICAgICAgICAgICAgICBuYW1lV2FybmluZy5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKVxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KF8uYmluZChzZWxmLmhpZGVOYW1lV2FybmluZywgc2VsZiksIDEwMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUub3JpZ2luYWwuX3BhdGggPSBib2R5Ll9wYXRoXG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZihwYXJlbnQudHlwZSA9PT0gXCJyb290XCIpe1xuICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2goKVxuICAgICAgICAgICAgfWVsc2V7ICAgICAgICAgIFxuICAgICAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShwYXJlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGV4dGVuc2lvbldhcm5pbmcuY29sbGFwc2UoJ2hpZGUnKTtcbiAgICAgIG5hbWVXYXJuaW5nLmNvbGxhcHNlKCdoaWRlJyk7XG4gICAgfSk7XG4gIH0sXG4gIGhpZGVOYW1lV2FybmluZzogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygncmVuYW1lLXdhcm5pbmcnKSkuY29sbGFwc2UoJ2hpZGUnKVxuICB9LFxuICBnZXRKc29uRmlsZUZvckV4cG9ydDogZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwianNvbi1kYXRhXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICB2YXIgcmVzcCA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICBzZWxmLmV4cG9ydFRvSnNvbkZpbGUocmVzcCwgby5vcmlnaW5hbC50ZXh0KTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0RmlsZUZvckV4cG9ydDogZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiZmlsZS9kb3dubG9hZFwiLCBvLm9yaWdpbmFsLl9wYXRoKTtcbiAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCl7XG4gICAgICAgIHNlbGYuZXhwb3J0VG9GaWxlKGJvZHksIG8ub3JpZ2luYWwudGV4dCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgZ2V0WmlwRmlsZUZvckV4cG9ydDogZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiZmlsZS9kb3dubG9hZC16aXAvZ2VuZXJhdGVcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgeGhyKHt1cmk6IGVuZHBvaW50LGpzb246dHJ1ZX0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICBpZihyZXNwb25zZS5zdGF0dXNDb2RlIDwgNDAwKSB7XG4gICAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShvLnBhcmVudCk7XG4gICAgICAgIGlmKG5vZGUudHlwZSA9PT0gXCJyb290XCIpe1xuICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmV4cG9ydFRvWmlwRmlsZShib2R5LlBhdGgpXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGV4cG9ydFRvSnNvbkZpbGU6IGZ1bmN0aW9uIChmaWxlRGF0YSwgZmlsZU5hbWUpIHtcbiAgICBsZXQgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KGZpbGVEYXRhKTtcbiAgICBsZXQgZGF0YVVSSSA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFTdHIpO1xuICAgIGxldCBleHBvcnRGaWxlRGVmYXVsdE5hbWUgPSBmaWxlTmFtZVxuXG4gICAgbGV0IGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGRhdGFVUkkpO1xuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBleHBvcnRGaWxlRGVmYXVsdE5hbWUpO1xuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XG4gIH0sXG4gIGV4cG9ydFRvRmlsZTogZnVuY3Rpb24gKGZpbGVEYXRhLCBmaWxlTmFtZSkge1xuICAgIGxldCBkYXRhVVJJID0gJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQoZmlsZURhdGEpO1xuXG4gICAgbGV0IGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGRhdGFVUkkpO1xuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlTmFtZSk7XG4gICAgbGlua0VsZW1lbnQuY2xpY2soKTtcbiAgfSxcbiAgZXhwb3J0VG9aaXBGaWxlOiBmdW5jdGlvbiAobykge1xuICAgIHZhciB0YXJnZXRQYXRoID0gb1xuICAgIGlmKG8ub3JpZ2luYWwpe1xuICAgICAgdGFyZ2V0UGF0aCA9IG8ub3JpZ2luYWwuX3BhdGhcbiAgICB9XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcIi9maWxlc1wiLCB0YXJnZXRQYXRoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGVuZHBvaW50XG4gIH0sXG4gIG5ld01vZGVsT3JEaXJlY3Rvcnk6IGZ1bmN0aW9uIChvLCBpc01vZGVsLCBpc1NwYXRpYWwpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3TW9kYWxNb2RlbCcpKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3TW9kYWxNb2RlbCcpLnJlbW92ZSgpXG4gICAgfVxuICAgIGxldCBtb2RhbCA9ICQocmVuZGVyQ3JlYXRlTW9kYWxIdG1sKGlzTW9kZWwsIGlzU3BhdGlhbCkpLm1vZGFsKCk7XG4gICAgbGV0IG9rQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ld01vZGFsTW9kZWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXdNb2RhbE1vZGVsICNtb2RlbE5hbWVJbnB1dCcpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT09IDEzKXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb2tCdG4uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsZXQgbW9kZWxOYW1lO1xuICAgIG9rQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChCb29sZWFuKGlucHV0LnZhbHVlKSkge1xuICAgICAgICBpZihpc01vZGVsKSB7XG4gICAgICAgICAgbGV0IG1vZGVsTmFtZSA9IGlucHV0LnZhbHVlICsgJy5tZGwnO1xuICAgICAgICAgIHZhciBwYXJlbnRQYXRoID0gby5vcmlnaW5hbC5fcGF0aFxuICAgICAgICAgIHZhciBtb2RlbFBhdGggPSBwYXRoLmpvaW4oYXBwLmdldEJhc2VQYXRoKCksIGFwcC5yb3V0ZVByZWZpeCwgJ21vZGVscy9lZGl0JywgcGFyZW50UGF0aCwgbW9kZWxOYW1lKTtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IG1vZGVsUGF0aDtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgbGV0IGRpck5hbWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICB2YXIgcGFyZW50UGF0aCA9IG8ub3JpZ2luYWwuX3BhdGg7XG4gICAgICAgICAgbGV0IGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiL2RpcmVjdG9yeS9jcmVhdGVcIiwgcGFyZW50UGF0aCwgZGlyTmFtZSk7XG4gICAgICAgICAgeGhyKHt1cmk6ZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKG8pO1xuICAgICAgICAgICAgaWYobm9kZS50eXBlID09PSBcInJvb3RcIil7XG4gICAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpXG4gICAgICAgICAgICB9ZWxzZXsgICAgICAgICAgXG4gICAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG1vZGFsLm1vZGFsKCdoaWRlJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBzZXR1cEpzdHJlZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAkLmpzdHJlZS5kZWZhdWx0cy5jb250ZXh0bWVudS5pdGVtcyA9IChvLCBjYikgPT4ge1xuICAgICAgaWYgKG8udHlwZSA9PT0gJ3Jvb3QnKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBcIlJlZnJlc2hcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiUmVmcmVzaFwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIiA6IFwiZm9udC13ZWlnaHQtYm9sZFwiLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJOZXdfRGlyZWN0b3J5XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJOZXcgRGlyZWN0b3J5XCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5uZXdNb2RlbE9yRGlyZWN0b3J5KG8sIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIk5ld19tb2RlbFwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJOZXcgTW9kZWxcIixcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInN1Ym1lbnVcIiA6IHtcbiAgICAgICAgICAgICAgXCJzcGF0aWFsXCIgOiB7XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJTcGF0aWFsXCIsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwibm9uc3BhdGlhbFwiIDogeyBcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIk5vbi1TcGF0aWFsXCIsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgc2VsZi5uZXdNb2RlbE9yRGlyZWN0b3J5KG8sIHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoby50eXBlID09PSAgJ2ZvbGRlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBcIlJlZnJlc2hcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiUmVmcmVzaFwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIiA6IFwiZm9udC13ZWlnaHQtYm9sZFwiLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICQoJyNtb2RlbHMtanN0cmVlJykuanN0cmVlKCkucmVmcmVzaF9ub2RlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJOZXdfRGlyZWN0b3J5XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJOZXcgRGlyZWN0b3J5XCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5uZXdNb2RlbE9yRGlyZWN0b3J5KG8sIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIk5ld19tb2RlbFwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJOZXcgTW9kZWxcIixcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInN1Ym1lbnVcIiA6IHtcbiAgICAgICAgICAgICAgXCJzcGF0aWFsXCIgOiB7XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJTcGF0aWFsXCIsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwibm9uc3BhdGlhbFwiIDogeyBcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIk5vbi1TcGF0aWFsXCIsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgc2VsZi5uZXdNb2RlbE9yRGlyZWN0b3J5KG8sIHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRvd25sb2FkXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEb3dubG9hZCBhcyAuemlwXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5nZXRaaXBGaWxlRm9yRXhwb3J0KG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJSZW5hbWVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlbmFtZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYucmVuYW1lTm9kZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRHVwbGljYXRlXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEdXBsaWNhdGVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmR1cGxpY2F0ZUZpbGVPckRpcmVjdG9yeShvLCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEZWxldGVcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRGVsZXRlXCIsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZGVsZXRlRmlsZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChvLnR5cGUgPT09ICdzcGF0aWFsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiRWRpdFwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICBcIl9jbGFzc1wiIDogXCJmb250LXdlaWdodC1ib2xkZXJcIixcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRWRpdFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3MvbW9kZWxzL2VkaXRcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkNvbnZlcnRcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiQ29udmVydFwiLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic3VibWVudVwiIDoge1xuICAgICAgICAgICAgICBcIkNvbnZlcnQgdG8gTW9kZWxcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJDb252ZXJ0IHRvIE5vbiBTcGF0aWFsXCIsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLnRvTW9kZWwobywgXCJTcGF0aWFsXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJDb252ZXJ0IHRvIE5vdGVib29rXCIgOiB7XG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJDb252ZXJ0IHRvIE5vdGVib29rXCIsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJOZXcgV29ya2Zsb3dcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk5ldyBXb3JrZmxvd1wiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3Mvd29ya2Zsb3cvc2VsZWN0aW9uXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJSZW5hbWVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlbmFtZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYucmVuYW1lTm9kZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRHVwbGljYXRlXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEdXBsaWNhdGVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmR1cGxpY2F0ZUZpbGVPckRpcmVjdG9yeShvLCBmYWxzZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRGVsZXRlXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRlbGV0ZVwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnbm9uc3BhdGlhbCcpIHtcbiAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgXCJFZGl0XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IHRydWUsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9jbGFzc1wiIDogXCJmb250LXdlaWdodC1ib2xkZXJcIixcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRWRpdFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3MvbW9kZWxzL2VkaXRcIiwgby5vcmlnaW5hbC5fcGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkNvbnZlcnRcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiQ29udmVydFwiLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic3VibWVudVwiIDoge1xuICAgICAgICAgICAgICBcIkNvbnZlcnQgdG8gU3BhdGlhbFwiIDoge1xuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIlRvIFNwYXRpYWwgTW9kZWxcIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYudG9TcGF0aWFsKG8pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIkNvbnZlcnQgdG8gTm90ZWJvb2tcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJUbyBOb3RlYm9va1wiLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgc2VsZi50b05vdGVib29rKG8pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIkNvbnZlcnQgdG8gU0JNTFwiIDoge1xuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIlRvIFNCTUwgTW9kZWxcIixcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYudG9TQk1MKG8pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJOZXcgV29ya2Zsb3dcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk5ldyBXb3JrZmxvd1wiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3Mvd29ya2Zsb3cvc2VsZWN0aW9uXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEb3dubG9hZFwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRG93bmxvYWRcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmdldEpzb25GaWxlRm9yRXhwb3J0KG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJSZW5hbWVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlbmFtZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYucmVuYW1lTm9kZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRHVwbGljYXRlXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEdXBsaWNhdGVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmR1cGxpY2F0ZUZpbGVPckRpcmVjdG9yeShvLCBmYWxzZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRGVsZXRlXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRlbGV0ZVwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcblx0ICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoby50eXBlID09PSAnd29ya2Zsb3cnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgXCJPcGVuXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IHRydWUsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9jbGFzc1wiIDogXCJmb250LXdlaWdodC1ib2xkZXJcIixcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiT3BlblwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3Mvd29ya2Zsb3cvZWRpdC9ub25lXCIsIG8ub3JpZ2luYWwuX3BhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJTdGFydC9SZXN0YXJ0IFdvcmtmbG93XCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlN0YXJ0L1Jlc3RhcnQgV29ya2Zsb3dcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIlN0b3AgV29ya2Zsb3dcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogdHJ1ZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiU3RvcCBXb3JrZmxvd1wiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiTW9kZWxcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk1vZGVsXCIsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInN1Ym1lbnVcIiA6IHtcbiAgICAgICAgICAgICAgXCJFZGl0XCIgOiB7XG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCIgRWRpdFwiLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIkR1cGxpY2F0ZVwiIDoge1xuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRG93bmxvYWRcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRvd25sb2FkIGFzIC56aXBcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmdldFppcEZpbGVGb3JFeHBvcnQobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIlJlbmFtZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiUmVuYW1lXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5yZW5hbWVOb2RlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEZWxldGVcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRGVsZXRlXCIsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZGVsZXRlRmlsZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChvLnR5cGUgPT09ICdub3RlYm9vaycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBcIk9wZW5cIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogdHJ1ZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2NsYXNzXCIgOiBcImZvbnQtd2VpZ2h0LWJvbGRlclwiLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJPcGVuXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgd2luZG93Lm9wZW4ocGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcIm5vdGVib29rc1wiLCBvLm9yaWdpbmFsLl9wYXRoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRvd25sb2FkXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEb3dubG9hZFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZ2V0SnNvbkZpbGVGb3JFeHBvcnQobyk7XG4gICAgICBcdCAgICB9XG4gICAgICBcdCAgfSxcbiAgICAgICAgICBcIlJlbmFtZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiUmVuYW1lXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5yZW5hbWVOb2RlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEdXBsaWNhdGVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkR1cGxpY2F0ZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZHVwbGljYXRlRmlsZU9yRGlyZWN0b3J5KG8sIGZhbHNlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJEZWxldGVcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRGVsZXRlXCIsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZGVsZXRlRmlsZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChvLnR5cGUgPT09ICdzYm1sLW1vZGVsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiT3BlblwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIiA6IFwiZm9udC13ZWlnaHQtYm9sZGVyXCIsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIk9wZW4gRmlsZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHZhciBmaWxlUGF0aCA9IG8ub3JpZ2luYWwuX3BhdGhcbiAgICAgICAgICAgICAgd2luZG93Lm9wZW4ocGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcImxhYi90cmVlXCIsIGZpbGVQYXRoKSwgJ19ibGFuaycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkNvbnZlcnRcIiA6IHtcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiQ29udmVydFwiLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic3VibWVudVwiIDoge1xuICAgICAgICAgICAgICBcIkNvbnZlcnQgdG8gTW9kZWxcIiA6IHtcbiAgICAgICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJUbyBNb2RlbFwiLFxuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgc2VsZi50b01vZGVsKG8sIFwiU0JNTFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRvd25sb2FkXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEb3dubG9hZFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYuZ2V0RmlsZUZvckV4cG9ydChvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiUmVuYW1lXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJSZW5hbWVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLnJlbmFtZU5vZGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkR1cGxpY2F0ZVwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiRHVwbGljYXRlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kdXBsaWNhdGVGaWxlT3JEaXJlY3RvcnkobywgZmFsc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRlbGV0ZVwiIDoge1xuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEZWxldGVcIixcbiAgICAgICAgICAgIFwiX2Rpc2FibGVkXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgc2VsZi5kZWxldGVGaWxlKG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIFwiT3BlblwiIDoge1xuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiB0cnVlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IHRydWUsXG4gICAgICAgICAgICBcIl9jbGFzc1wiIDogXCJmb250LXdlaWdodC1ib2xkZXJcIixcbiAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiT3BlblwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIkRvd25sb2FkXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEb3dubG9hZCBhcyAuemlwXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgaWYoby5vcmlnaW5hbC50ZXh0LmVuZHNXaXRoKCcuemlwJykpe1xuICAgICAgICAgICAgICAgIHNlbGYuZXhwb3J0VG9aaXBGaWxlKG8pO1xuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzZWxmLmdldFppcEZpbGVGb3JFeHBvcnQobylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJSZW5hbWVcIiA6IHtcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2JlZm9yZVwiIDogZmFsc2UsXG4gICAgICAgICAgICBcInNlcGFyYXRvcl9hZnRlclwiIDogZmFsc2UsXG4gICAgICAgICAgICBcIl9kaXNhYmxlZFwiIDogZmFsc2UsXG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIlJlbmFtZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIiA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHNlbGYucmVuYW1lTm9kZShvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRHVwbGljYXRlXCIgOiB7XG4gICAgICAgICAgICBcInNlcGFyYXRvcl9iZWZvcmVcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYWZ0ZXJcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJEdXBsaWNhdGVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmR1cGxpY2F0ZUZpbGVPckRpcmVjdG9yeShvLCBmYWxzZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRGVsZXRlXCIgOiB7XG4gICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRlbGV0ZVwiLFxuICAgICAgICAgICAgXCJfZGlzYWJsZWRcIiA6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZXBhcmF0b3JfYmVmb3JlXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VwYXJhdG9yX2FmdGVyXCIgOiBmYWxzZSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCIgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICBzZWxmLmRlbGV0ZUZpbGUobyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAkKGRvY3VtZW50KS5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJCgnW2F1dG9mb2N1c10nLCBlLnRhcmdldCkuZm9jdXMoKTtcbiAgICB9KTtcbiAgICAkKGRvY3VtZW50KS5vbignZG5kX3N0YXJ0LnZha2F0YScsIGZ1bmN0aW9uIChkYXRhLCBlbGVtZW50LCBoZWxwZXIsIGV2ZW50KSB7XG4gICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmxvYWRfYWxsKClcbiAgICB9KTtcbiAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSh0cmVlU2V0dGluZ3MpXG4gICAgJCgnI21vZGVscy1qc3RyZWUnKS5vbignY2xpY2suanN0cmVlJywgZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIHBhcmVudCA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnRcbiAgICAgIHZhciBfbm9kZSA9IHBhcmVudC5jaGlsZHJlbltwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMV1cbiAgICAgIHZhciBub2RlID0gJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5nZXRfbm9kZShfbm9kZSlcbiAgICAgIGlmKF9ub2RlLm5vZGVOYW1lID09PSBcIkFcIiAmJiAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmlzX2xvYWRlZChub2RlKSAmJiBub2RlLnR5cGUgPT09IFwiZm9sZGVyXCIpe1xuICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKVxuICAgICAgfVxuICAgIH0pO1xuICAgICQoJyNtb2RlbHMtanN0cmVlJykub24oJ2RibGNsaWNrLmpzdHJlZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBmaWxlID0gZS50YXJnZXQudGV4dFxuICAgICAgdmFyIG5vZGUgPSAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmdldF9ub2RlKGUudGFyZ2V0KVxuICAgICAgdmFyIF9wYXRoID0gbm9kZS5vcmlnaW5hbC5fcGF0aDtcbiAgICAgIGlmKGZpbGUuZW5kc1dpdGgoJy5tZGwnKSB8fCBmaWxlLmVuZHNXaXRoKCcuc21kbCcpKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoLmpvaW4oYXBwLmdldEJhc2VQYXRoKCksIFwic3RvY2hzcy9tb2RlbHMvZWRpdFwiLCBfcGF0aCk7XG4gICAgICB9ZWxzZSBpZihmaWxlLmVuZHNXaXRoKCcuaXB5bmInKSl7XG4gICAgICAgIHZhciBub3RlYm9va1BhdGggPSBwYXRoLmpvaW4oYXBwLmdldEJhc2VQYXRoKCksIFwibm90ZWJvb2tzXCIsIF9wYXRoKVxuICAgICAgICB3aW5kb3cub3Blbihub3RlYm9va1BhdGgsICdfYmxhbmsnKVxuICAgICAgfWVsc2UgaWYoZmlsZS5lbmRzV2l0aCgnLnNibWwnKSl7XG4gICAgICAgIHZhciBvcGVuUGF0aCA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJsYWIvdHJlZVwiLCBfcGF0aClcbiAgICAgICAgd2luZG93Lm9wZW4ob3BlblBhdGgsICdfYmxhbmsnKVxuICAgICAgfWVsc2UgaWYoZmlsZS5lbmRzV2l0aCgnLndrZmwnKSl7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3Mvd29ya2Zsb3cvZWRpdC9ub25lXCIsIF9wYXRoKTtcbiAgICAgIH1lbHNlIGlmKG5vZGUudHlwZSA9PT0gXCJmb2xkZXJcIiAmJiAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLmlzX29wZW4obm9kZSkgJiYgJCgnI21vZGVscy1qc3RyZWUnKS5qc3RyZWUoKS5pc19sb2FkZWQobm9kZSkpe1xuICAgICAgICAkKCcjbW9kZWxzLWpzdHJlZScpLmpzdHJlZSgpLnJlZnJlc2hfbm9kZShub2RlKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcblxuaW5pdFBhZ2UoRmlsZUJyb3dzZXIpO1xuIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NlY3Rpb24gY2xhc3M9XFxcInBhZ2VcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gyIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUZpbGUgQnJvd3NlclxcdTAwM0NcXHUwMDJGaDJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYmlnLXRpcCBidG4gaW5mb3JtYXRpb24tYnRuIGhlbHBcXFwiIGRhdGEtaG9vaz1cXFwiZmlsZS1icm93c2VyLWhlbHBcXFwiXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXJcXFwiIGRhdGEtaWNvbj1cXFwicXVlc3Rpb24tY2lyY2xlXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtcXVlc3Rpb24tY2lyY2xlIGZhLXctMTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgNTEyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjU2IDhDMTE5LjA0MyA4IDggMTE5LjA4MyA4IDI1NmMwIDEzNi45OTcgMTExLjA0MyAyNDggMjQ4IDI0OHMyNDgtMTExLjAwMyAyNDgtMjQ4QzUwNCAxMTkuMDgzIDM5Mi45NTcgOCAyNTYgOHptMCA0NDhjLTExMC41MzIgMC0yMDAtODkuNDMxLTIwMC0yMDAgMC0xMTAuNDk1IDg5LjQ3Mi0yMDAgMjAwLTIwMCAxMTAuNDkxIDAgMjAwIDg5LjQ3MSAyMDAgMjAwIDAgMTEwLjUzLTg5LjQzMSAyMDAtMjAwIDIwMHptMTA3LjI0NC0yNTUuMmMwIDY3LjA1Mi03Mi40MjEgNjguMDg0LTcyLjQyMSA5Mi44NjNWMzAwYzAgNi42MjctNS4zNzMgMTItMTIgMTJoLTQ1LjY0N2MtNi42MjcgMC0xMi01LjM3My0xMi0xMnYtOC42NTljMC0zNS43NDUgMjcuMS01MC4wMzQgNDcuNTc5LTYxLjUxNiAxNy41NjEtOS44NDUgMjguMzI0LTE2LjU0MSAyOC4zMjQtMjkuNTc5IDAtMTcuMjQ2LTIxLjk5OS0yOC42OTMtMzkuNzg0LTI4LjY5My0yMy4xODkgMC0zMy44OTQgMTAuOTc3LTQ4Ljk0MiAyOS45NjktNC4wNTcgNS4xMi0xMS40NiA2LjA3MS0xNi42NjYgMi4xMjRsLTI3LjgyNC0yMS4wOThjLTUuMTA3LTMuODcyLTYuMjUxLTExLjA2Ni0yLjY0NC0xNi4zNjNDMTg0Ljg0NiAxMzEuNDkxIDIxNC45NCAxMTIgMjYxLjc5NCAxMTJjNDkuMDcxIDAgMTAxLjQ1IDM4LjMwNCAxMDEuNDUgODguOHpNMjk4IDM2OGMwIDIzLjE1OS0xOC44NDEgNDItNDIgNDJzLTQyLTE4Ljg0MS00Mi00MiAxOC44NDEtNDIgNDItNDIgNDIgMTguODQxIDQyIDQyelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImFsZXJ0LXdhcm5pbmcgY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiZXh0ZW5zaW9uLXdhcm5pbmdcXFwiXFx1MDAzRVlvdSBzaG91bGQgYXZvaWQgY2hhbmdpbmcgdGhlIGZpbGUgZXh0ZW5zaW9uIHVubGVzcyB5b3Uga25vdyB3aGF0IHlvdSBhcmUgZG9pbmchXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiYWxlcnQtd2FybmluZyBjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJyZW5hbWUtd2FybmluZ1xcXCJcXHUwMDNFTUVTU0FHRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgaWQ9XFxcIm1vZGVscy1qc3RyZWVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgZGF0YS1ob29rPVxcXCJyZWZyZXNoLWpzdHJlZVxcXCJcXHUwMDNFUmVmcmVzaFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGc2VjdGlvblxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsIi8qZ2xvYmFscyBqUXVlcnksIGRlZmluZSwgbW9kdWxlLCBleHBvcnRzLCByZXF1aXJlLCB3aW5kb3csIGRvY3VtZW50LCBwb3N0TWVzc2FnZSAqL1xuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuXHR9XG5cdGVsc2UgaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGZhY3RvcnkoalF1ZXJ5KTtcblx0fVxufShmdW5jdGlvbiAoJCwgdW5kZWZpbmVkKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuLyohXG4gKiBqc1RyZWUgMy4zLjhcbiAqIGh0dHA6Ly9qc3RyZWUuY29tL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNCBJdmFuIEJvemhhbm92IChodHRwOi8vdmFrYXRhLmNvbSlcbiAqXG4gKiBMaWNlbnNlZCBzYW1lIGFzIGpxdWVyeSAtIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIExpY2Vuc2VcbiAqICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuLyohXG4gKiBpZiB1c2luZyBqc2xpbnQgcGxlYXNlIGFsbG93IGZvciB0aGUgalF1ZXJ5IGdsb2JhbCBhbmQgdXNlIGZvbGxvd2luZyBvcHRpb25zOlxuICoganNsaW50OiBsb29wZnVuYzogdHJ1ZSwgYnJvd3NlcjogdHJ1ZSwgYXNzOiB0cnVlLCBiaXR3aXNlOiB0cnVlLCBjb250aW51ZTogdHJ1ZSwgbm9tZW46IHRydWUsIHBsdXNwbHVzOiB0cnVlLCByZWdleHA6IHRydWUsIHVucGFyYW06IHRydWUsIHRvZG86IHRydWUsIHdoaXRlOiB0cnVlXG4gKi9cbi8qanNoaW50IC1XMDgzICovXG5cblx0Ly8gcHJldmVudCBhbm90aGVyIGxvYWQ/IG1heWJlIHRoZXJlIGlzIGEgYmV0dGVyIHdheT9cblx0aWYoJC5qc3RyZWUpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvKipcblx0ICogIyMjIGpzVHJlZSBjb3JlIGZ1bmN0aW9uYWxpdHlcblx0ICovXG5cblx0Ly8gaW50ZXJuYWwgdmFyaWFibGVzXG5cdHZhciBpbnN0YW5jZV9jb3VudGVyID0gMCxcblx0XHRjY3Bfbm9kZSA9IGZhbHNlLFxuXHRcdGNjcF9tb2RlID0gZmFsc2UsXG5cdFx0Y2NwX2luc3QgPSBmYWxzZSxcblx0XHR0aGVtZXNfbG9hZGVkID0gW10sXG5cdFx0c3JjID0gJCgnc2NyaXB0Omxhc3QnKS5hdHRyKCdzcmMnKSxcblx0XHRkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDsgLy8gbG9jYWwgdmFyaWFibGUgaXMgYWx3YXlzIGZhc3RlciB0byBhY2Nlc3MgdGhlbiBhIGdsb2JhbFxuXG5cdC8qKlxuXHQgKiBob2xkcyBhbGwganN0cmVlIHJlbGF0ZWQgZnVuY3Rpb25zIGFuZCB2YXJpYWJsZXMsIGluY2x1ZGluZyB0aGUgYWN0dWFsIGNsYXNzIGFuZCBtZXRob2RzIHRvIGNyZWF0ZSwgYWNjZXNzIGFuZCBtYW5pcHVsYXRlIGluc3RhbmNlcy5cblx0ICogQG5hbWUgJC5qc3RyZWVcblx0ICovXG5cdCQuanN0cmVlID0ge1xuXHRcdC8qKlxuXHRcdCAqIHNwZWNpZmllcyB0aGUganN0cmVlIHZlcnNpb24gaW4gdXNlXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUudmVyc2lvblxuXHRcdCAqL1xuXHRcdHZlcnNpb24gOiAnMy4zLjgnLFxuXHRcdC8qKlxuXHRcdCAqIGhvbGRzIGFsbCB0aGUgZGVmYXVsdCBvcHRpb25zIHVzZWQgd2hlbiBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHNcblx0XHQgKi9cblx0XHRkZWZhdWx0cyA6IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogY29uZmlndXJlIHdoaWNoIHBsdWdpbnMgd2lsbCBiZSBhY3RpdmUgb24gYW4gaW5zdGFuY2UuIFNob3VsZCBiZSBhbiBhcnJheSBvZiBzdHJpbmdzLCB3aGVyZSBlYWNoIGVsZW1lbnQgaXMgYSBwbHVnaW4gbmFtZS4gVGhlIGRlZmF1bHQgaXMgYFtdYFxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2luc1xuXHRcdFx0ICovXG5cdFx0XHRwbHVnaW5zIDogW11cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHN0b3JlcyBhbGwgbG9hZGVkIGpzdHJlZSBwbHVnaW5zICh1c2VkIGludGVybmFsbHkpXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUucGx1Z2luc1xuXHRcdCAqL1xuXHRcdHBsdWdpbnMgOiB7fSxcblx0XHRwYXRoIDogc3JjICYmIHNyYy5pbmRleE9mKCcvJykgIT09IC0xID8gc3JjLnJlcGxhY2UoL1xcL1teXFwvXSskLywnJykgOiAnJyxcblx0XHRpZHJlZ2V4IDogL1tcXFxcOiYhXnwoKVxcW1xcXTw+QConK34jXCI7Liw9XFwtIFxcLyR7fSU/YF0vZyxcblx0XHRyb290IDogJyMnXG5cdH07XG5cdFxuXHQvKipcblx0ICogY3JlYXRlcyBhIGpzdHJlZSBpbnN0YW5jZVxuXHQgKiBAbmFtZSAkLmpzdHJlZS5jcmVhdGUoZWwgWywgb3B0aW9uc10pXG5cdCAqIEBwYXJhbSB7RE9NRWxlbWVudHxqUXVlcnl8U3RyaW5nfSBlbCB0aGUgZWxlbWVudCB0byBjcmVhdGUgdGhlIGluc3RhbmNlIG9uLCBjYW4gYmUgalF1ZXJ5IGV4dGVuZGVkIG9yIGEgc2VsZWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgb3B0aW9ucyBmb3IgdGhpcyBpbnN0YW5jZSAoZXh0ZW5kcyBgJC5qc3RyZWUuZGVmYXVsdHNgKVxuXHQgKiBAcmV0dXJuIHtqc1RyZWV9IHRoZSBuZXcgaW5zdGFuY2Vcblx0ICovXG5cdCQuanN0cmVlLmNyZWF0ZSA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuXHRcdHZhciB0bXAgPSBuZXcgJC5qc3RyZWUuY29yZSgrK2luc3RhbmNlX2NvdW50ZXIpLFxuXHRcdFx0b3B0ID0gb3B0aW9ucztcblx0XHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sICQuanN0cmVlLmRlZmF1bHRzLCBvcHRpb25zKTtcblx0XHRpZihvcHQgJiYgb3B0LnBsdWdpbnMpIHtcblx0XHRcdG9wdGlvbnMucGx1Z2lucyA9IG9wdC5wbHVnaW5zO1xuXHRcdH1cblx0XHQkLmVhY2gob3B0aW9ucy5wbHVnaW5zLCBmdW5jdGlvbiAoaSwgaykge1xuXHRcdFx0aWYoaSAhPT0gJ2NvcmUnKSB7XG5cdFx0XHRcdHRtcCA9IHRtcC5wbHVnaW4oaywgb3B0aW9uc1trXSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JChlbCkuZGF0YSgnanN0cmVlJywgdG1wKTtcblx0XHR0bXAuaW5pdChlbCwgb3B0aW9ucyk7XG5cdFx0cmV0dXJuIHRtcDtcblx0fTtcblx0LyoqXG5cdCAqIHJlbW92ZSBhbGwgdHJhY2VzIG9mIGpzdHJlZSBmcm9tIHRoZSBET00gYW5kIGRlc3Ryb3kgYWxsIGluc3RhbmNlc1xuXHQgKiBAbmFtZSAkLmpzdHJlZS5kZXN0cm95KClcblx0ICovXG5cdCQuanN0cmVlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG5cdFx0JCgnLmpzdHJlZTpqc3RyZWUnKS5qc3RyZWUoJ2Rlc3Ryb3knKTtcblx0XHQkKGRvY3VtZW50KS5vZmYoJy5qc3RyZWUnKTtcblx0fTtcblx0LyoqXG5cdCAqIHRoZSBqc3RyZWUgY2xhc3MgY29uc3RydWN0b3IsIHVzZWQgb25seSBpbnRlcm5hbGx5XG5cdCAqIEBwcml2YXRlXG5cdCAqIEBuYW1lICQuanN0cmVlLmNvcmUoaWQpXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBpZCB0aGlzIGluc3RhbmNlJ3MgaW5kZXhcblx0ICovXG5cdCQuanN0cmVlLmNvcmUgPSBmdW5jdGlvbiAoaWQpIHtcblx0XHR0aGlzLl9pZCA9IGlkO1xuXHRcdHRoaXMuX2NudCA9IDA7XG5cdFx0dGhpcy5fd3JrID0gbnVsbDtcblx0XHR0aGlzLl9kYXRhID0ge1xuXHRcdFx0Y29yZSA6IHtcblx0XHRcdFx0dGhlbWVzIDoge1xuXHRcdFx0XHRcdG5hbWUgOiBmYWxzZSxcblx0XHRcdFx0XHRkb3RzIDogZmFsc2UsXG5cdFx0XHRcdFx0aWNvbnMgOiBmYWxzZSxcblx0XHRcdFx0XHRlbGxpcHNpcyA6IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNlbGVjdGVkIDogW10sXG5cdFx0XHRcdGxhc3RfZXJyb3IgOiB7fSxcblx0XHRcdFx0d29ya2luZyA6IGZhbHNlLFxuXHRcdFx0XHR3b3JrZXJfcXVldWUgOiBbXSxcblx0XHRcdFx0Zm9jdXNlZCA6IG51bGxcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXHQvKipcblx0ICogZ2V0IGEgcmVmZXJlbmNlIHRvIGFuIGV4aXN0aW5nIGluc3RhbmNlXG5cdCAqXG5cdCAqIF9fRXhhbXBsZXNfX1xuXHQgKlxuXHQgKlx0Ly8gcHJvdmlkZWQgYSBjb250YWluZXIgd2l0aCBhbiBJRCBvZiBcInRyZWVcIiwgYW5kIGEgbmVzdGVkIG5vZGUgd2l0aCBhbiBJRCBvZiBcImJyYW5jaFwiXG5cdCAqXHQvLyBhbGwgb2YgdGhlcmUgd2lsbCByZXR1cm4gdGhlIHNhbWUgaW5zdGFuY2Vcblx0ICpcdCQuanN0cmVlLnJlZmVyZW5jZSgndHJlZScpO1xuXHQgKlx0JC5qc3RyZWUucmVmZXJlbmNlKCcjdHJlZScpO1xuXHQgKlx0JC5qc3RyZWUucmVmZXJlbmNlKCQoJyN0cmVlJykpO1xuXHQgKlx0JC5qc3RyZWUucmVmZXJlbmNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlEKCd0cmVlJykpO1xuXHQgKlx0JC5qc3RyZWUucmVmZXJlbmNlKCdicmFuY2gnKTtcblx0ICpcdCQuanN0cmVlLnJlZmVyZW5jZSgnI2JyYW5jaCcpO1xuXHQgKlx0JC5qc3RyZWUucmVmZXJlbmNlKCQoJyNicmFuY2gnKSk7XG5cdCAqXHQkLmpzdHJlZS5yZWZlcmVuY2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SUQoJ2JyYW5jaCcpKTtcblx0ICpcblx0ICogQG5hbWUgJC5qc3RyZWUucmVmZXJlbmNlKG5lZWRsZSlcblx0ICogQHBhcmFtIHtET01FbGVtZW50fGpRdWVyeXxTdHJpbmd9IG5lZWRsZVxuXHQgKiBAcmV0dXJuIHtqc1RyZWV8bnVsbH0gdGhlIGluc3RhbmNlIG9yIGBudWxsYCBpZiBub3QgZm91bmRcblx0ICovXG5cdCQuanN0cmVlLnJlZmVyZW5jZSA9IGZ1bmN0aW9uIChuZWVkbGUpIHtcblx0XHR2YXIgdG1wID0gbnVsbCxcblx0XHRcdG9iaiA9IG51bGw7XG5cdFx0aWYobmVlZGxlICYmIG5lZWRsZS5pZCAmJiAoIW5lZWRsZS50YWdOYW1lIHx8ICFuZWVkbGUubm9kZVR5cGUpKSB7IG5lZWRsZSA9IG5lZWRsZS5pZDsgfVxuXG5cdFx0aWYoIW9iaiB8fCAhb2JqLmxlbmd0aCkge1xuXHRcdFx0dHJ5IHsgb2JqID0gJChuZWVkbGUpOyB9IGNhdGNoIChpZ25vcmUpIHsgfVxuXHRcdH1cblx0XHRpZighb2JqIHx8ICFvYmoubGVuZ3RoKSB7XG5cdFx0XHR0cnkgeyBvYmogPSAkKCcjJyArIG5lZWRsZS5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpKTsgfSBjYXRjaCAoaWdub3JlKSB7IH1cblx0XHR9XG5cdFx0aWYob2JqICYmIG9iai5sZW5ndGggJiYgKG9iaiA9IG9iai5jbG9zZXN0KCcuanN0cmVlJykpLmxlbmd0aCAmJiAob2JqID0gb2JqLmRhdGEoJ2pzdHJlZScpKSkge1xuXHRcdFx0dG1wID0gb2JqO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdCQoJy5qc3RyZWUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIGluc3QgPSAkKHRoaXMpLmRhdGEoJ2pzdHJlZScpO1xuXHRcdFx0XHRpZihpbnN0ICYmIGluc3QuX21vZGVsLmRhdGFbbmVlZGxlXSkge1xuXHRcdFx0XHRcdHRtcCA9IGluc3Q7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRtcDtcblx0fTtcblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBpbnN0YW5jZSwgZ2V0IGFuIGluc3RhbmNlIG9yIGludm9rZSBhIGNvbW1hbmQgb24gYSBpbnN0YW5jZS5cblx0ICpcblx0ICogSWYgdGhlcmUgaXMgbm8gaW5zdGFuY2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IG5vZGUgYSBuZXcgb25lIGlzIGNyZWF0ZWQgYW5kIGBhcmdgIGlzIHVzZWQgdG8gZXh0ZW5kIGAkLmpzdHJlZS5kZWZhdWx0c2AgZm9yIHRoaXMgbmV3IGluc3RhbmNlLiBUaGVyZSB3b3VsZCBiZSBubyByZXR1cm4gdmFsdWUgKGNoYWluaW5nIGlzIG5vdCBicm9rZW4pLlxuXHQgKlxuXHQgKiBJZiB0aGVyZSBpcyBhbiBleGlzdGluZyBpbnN0YW5jZSBhbmQgYGFyZ2AgaXMgYSBzdHJpbmcgdGhlIGNvbW1hbmQgc3BlY2lmaWVkIGJ5IGBhcmdgIGlzIGV4ZWN1dGVkIG9uIHRoZSBpbnN0YW5jZSwgd2l0aCBhbnkgYWRkaXRpb25hbCBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbi4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYSB2YWx1ZSBpdCB3aWxsIGJlIHJldHVybmVkIChjaGFpbmluZyBjb3VsZCBicmVhayBkZXBlbmRpbmcgb24gZnVuY3Rpb24pLlxuXHQgKlxuXHQgKiBJZiB0aGVyZSBpcyBhbiBleGlzdGluZyBpbnN0YW5jZSBhbmQgYGFyZ2AgaXMgbm90IGEgc3RyaW5nIHRoZSBpbnN0YW5jZSBpdHNlbGYgaXMgcmV0dXJuZWQgKHNpbWlsYXIgdG8gYCQuanN0cmVlLnJlZmVyZW5jZWApLlxuXHQgKlxuXHQgKiBJbiBhbnkgb3RoZXIgY2FzZSAtIG5vdGhpbmcgaXMgcmV0dXJuZWQgYW5kIGNoYWluaW5nIGlzIG5vdCBicm9rZW4uXG5cdCAqXG5cdCAqIF9fRXhhbXBsZXNfX1xuXHQgKlxuXHQgKlx0JCgnI3RyZWUxJykuanN0cmVlKCk7IC8vIGNyZWF0ZXMgYW4gaW5zdGFuY2Vcblx0ICpcdCQoJyN0cmVlMicpLmpzdHJlZSh7IHBsdWdpbnMgOiBbXSB9KTsgLy8gY3JlYXRlIGFuIGluc3RhbmNlIHdpdGggc29tZSBvcHRpb25zXG5cdCAqXHQkKCcjdHJlZTEnKS5qc3RyZWUoJ29wZW5fbm9kZScsICcjYnJhbmNoXzEnKTsgLy8gY2FsbCBhIG1ldGhvZCBvbiBhbiBleGlzdGluZyBpbnN0YW5jZSwgcGFzc2luZyBhZGRpdGlvbmFsIGFyZ3VtZW50c1xuXHQgKlx0JCgnI3RyZWUyJykuanN0cmVlKCk7IC8vIGdldCBhbiBleGlzdGluZyBpbnN0YW5jZSAob3IgY3JlYXRlIGFuIGluc3RhbmNlKVxuXHQgKlx0JCgnI3RyZWUyJykuanN0cmVlKHRydWUpOyAvLyBnZXQgYW4gZXhpc3RpbmcgaW5zdGFuY2UgKHdpbGwgbm90IGNyZWF0ZSBuZXcgaW5zdGFuY2UpXG5cdCAqXHQkKCcjYnJhbmNoXzEnKS5qc3RyZWUoKS5zZWxlY3Rfbm9kZSgnI2JyYW5jaF8xJyk7IC8vIGdldCBhbiBpbnN0YW5jZSAodXNpbmcgYSBuZXN0ZWQgZWxlbWVudCBhbmQgY2FsbCBhIG1ldGhvZClcblx0ICpcblx0ICogQG5hbWUgJCgpLmpzdHJlZShbYXJnXSlcblx0ICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBhcmdcblx0ICogQHJldHVybiB7TWl4ZWR9XG5cdCAqL1xuXHQkLmZuLmpzdHJlZSA9IGZ1bmN0aW9uIChhcmcpIHtcblx0XHQvLyBjaGVjayBmb3Igc3RyaW5nIGFyZ3VtZW50XG5cdFx0dmFyIGlzX21ldGhvZFx0PSAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycpLFxuXHRcdFx0YXJnc1x0XHQ9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG5cdFx0XHRyZXN1bHRcdFx0PSBudWxsO1xuXHRcdGlmKGFyZyA9PT0gdHJ1ZSAmJiAhdGhpcy5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0dGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vIGdldCB0aGUgaW5zdGFuY2UgKGlmIHRoZXJlIGlzIG9uZSkgYW5kIG1ldGhvZCAoaWYgaXQgZXhpc3RzKVxuXHRcdFx0dmFyIGluc3RhbmNlID0gJC5qc3RyZWUucmVmZXJlbmNlKHRoaXMpLFxuXHRcdFx0XHRtZXRob2QgPSBpc19tZXRob2QgJiYgaW5zdGFuY2UgPyBpbnN0YW5jZVthcmddIDogbnVsbDtcblx0XHRcdC8vIGlmIGNhbGxpbmcgYSBtZXRob2QsIGFuZCBtZXRob2QgaXMgYXZhaWxhYmxlIC0gZXhlY3V0ZSBvbiB0aGUgaW5zdGFuY2Vcblx0XHRcdHJlc3VsdCA9IGlzX21ldGhvZCAmJiBtZXRob2QgP1xuXHRcdFx0XHRtZXRob2QuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpIDpcblx0XHRcdFx0bnVsbDtcblx0XHRcdC8vIGlmIHRoZXJlIGlzIG5vIGluc3RhbmNlIGFuZCBubyBtZXRob2QgaXMgYmVpbmcgY2FsbGVkIC0gY3JlYXRlIG9uZVxuXHRcdFx0aWYoIWluc3RhbmNlICYmICFpc19tZXRob2QgJiYgKGFyZyA9PT0gdW5kZWZpbmVkIHx8ICQuaXNQbGFpbk9iamVjdChhcmcpKSkge1xuXHRcdFx0XHQkLmpzdHJlZS5jcmVhdGUodGhpcywgYXJnKTtcblx0XHRcdH1cblx0XHRcdC8vIGlmIHRoZXJlIGlzIGFuIGluc3RhbmNlIGFuZCBubyBtZXRob2QgaXMgY2FsbGVkIC0gcmV0dXJuIHRoZSBpbnN0YW5jZVxuXHRcdFx0aWYoIChpbnN0YW5jZSAmJiAhaXNfbWV0aG9kKSB8fCBhcmcgPT09IHRydWUgKSB7XG5cdFx0XHRcdHJlc3VsdCA9IGluc3RhbmNlIHx8IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0Ly8gaWYgdGhlcmUgd2FzIGEgbWV0aG9kIGNhbGwgd2hpY2ggcmV0dXJuZWQgYSByZXN1bHQgLSBicmVhayBhbmQgcmV0dXJuIHRoZSB2YWx1ZVxuXHRcdFx0aWYocmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQvLyBpZiB0aGVyZSB3YXMgYSBtZXRob2QgY2FsbCB3aXRoIGEgdmFsaWQgcmV0dXJuIHZhbHVlIC0gcmV0dXJuIHRoYXQsIG90aGVyd2lzZSBjb250aW51ZSB0aGUgY2hhaW5cblx0XHRyZXR1cm4gcmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkID9cblx0XHRcdHJlc3VsdCA6IHRoaXM7XG5cdH07XG5cdC8qKlxuXHQgKiB1c2VkIHRvIGZpbmQgZWxlbWVudHMgY29udGFpbmluZyBhbiBpbnN0YW5jZVxuXHQgKlxuXHQgKiBfX0V4YW1wbGVzX19cblx0ICpcblx0ICpcdCQoJ2Rpdjpqc3RyZWUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0ICpcdFx0JCh0aGlzKS5qc3RyZWUoJ2Rlc3Ryb3knKTtcblx0ICpcdH0pO1xuXHQgKlxuXHQgKiBAbmFtZSAkKCc6anN0cmVlJylcblx0ICogQHJldHVybiB7alF1ZXJ5fVxuXHQgKi9cblx0JC5leHByLnBzZXVkb3MuanN0cmVlID0gJC5leHByLmNyZWF0ZVBzZXVkbyhmdW5jdGlvbihzZWFyY2gpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oYSkge1xuXHRcdFx0cmV0dXJuICQoYSkuaGFzQ2xhc3MoJ2pzdHJlZScpICYmXG5cdFx0XHRcdCQoYSkuZGF0YSgnanN0cmVlJykgIT09IHVuZGVmaW5lZDtcblx0XHR9O1xuXHR9KTtcblxuXHQvKipcblx0ICogc3RvcmVzIGFsbCBkZWZhdWx0cyBmb3IgdGhlIGNvcmVcblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZVxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMuY29yZSA9IHtcblx0XHQvKipcblx0XHQgKiBkYXRhIGNvbmZpZ3VyYXRpb25cblx0XHQgKlxuXHRcdCAqIElmIGxlZnQgYXMgYGZhbHNlYCB0aGUgSFRNTCBpbnNpZGUgdGhlIGpzdHJlZSBjb250YWluZXIgZWxlbWVudCBpcyB1c2VkIHRvIHBvcHVsYXRlIHRoZSB0cmVlICh0aGF0IHNob3VsZCBiZSBhbiB1bm9yZGVyZWQgbGlzdCB3aXRoIGxpc3QgaXRlbXMpLlxuXHRcdCAqXG5cdFx0ICogWW91IGNhbiBhbHNvIHBhc3MgaW4gYSBIVE1MIHN0cmluZyBvciBhIEpTT04gYXJyYXkgaGVyZS5cblx0XHQgKlxuXHRcdCAqIEl0IGlzIHBvc3NpYmxlIHRvIHBhc3MgaW4gYSBzdGFuZGFyZCBqUXVlcnktbGlrZSBBSkFYIGNvbmZpZyBhbmQganN0cmVlIHdpbGwgYXV0b21hdGljYWxseSBkZXRlcm1pbmUgaWYgdGhlIHJlc3BvbnNlIGlzIEpTT04gb3IgSFRNTCBhbmQgdXNlIHRoYXQgdG8gcG9wdWxhdGUgdGhlIHRyZWUuXG5cdFx0ICogSW4gYWRkaXRpb24gdG8gdGhlIHN0YW5kYXJkIGpRdWVyeSBhamF4IG9wdGlvbnMgaGVyZSB5b3UgY2FuIHN1cHB5IGZ1bmN0aW9ucyBmb3IgYGRhdGFgIGFuZCBgdXJsYCwgdGhlIGZ1bmN0aW9ucyB3aWxsIGJlIHJ1biBpbiB0aGUgY3VycmVudCBpbnN0YW5jZSdzIHNjb3BlIGFuZCBhIHBhcmFtIHdpbGwgYmUgcGFzc2VkIGluZGljYXRpbmcgd2hpY2ggbm9kZSBpcyBiZWluZyBsb2FkZWQsIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhvc2UgZnVuY3Rpb25zIHdpbGwgYmUgdXNlZC5cblx0XHQgKlxuXHRcdCAqIFRoZSBsYXN0IG9wdGlvbiBpcyB0byBzcGVjaWZ5IGEgZnVuY3Rpb24sIHRoYXQgZnVuY3Rpb24gd2lsbCByZWNlaXZlIHRoZSBub2RlIGJlaW5nIGxvYWRlZCBhcyBhcmd1bWVudCBhbmQgYSBzZWNvbmQgcGFyYW0gd2hpY2ggaXMgYSBmdW5jdGlvbiB3aGljaCBzaG91bGQgYmUgY2FsbGVkIHdpdGggdGhlIHJlc3VsdC5cblx0XHQgKlxuXHRcdCAqIF9fRXhhbXBsZXNfX1xuXHRcdCAqXG5cdFx0ICpcdC8vIEFKQVhcblx0XHQgKlx0JCgnI3RyZWUnKS5qc3RyZWUoe1xuXHRcdCAqXHRcdCdjb3JlJyA6IHtcblx0XHQgKlx0XHRcdCdkYXRhJyA6IHtcblx0XHQgKlx0XHRcdFx0J3VybCcgOiAnL2dldC9jaGlsZHJlbi8nLFxuXHRcdCAqXHRcdFx0XHQnZGF0YScgOiBmdW5jdGlvbiAobm9kZSkge1xuXHRcdCAqXHRcdFx0XHRcdHJldHVybiB7ICdpZCcgOiBub2RlLmlkIH07XG5cdFx0ICpcdFx0XHRcdH1cblx0XHQgKlx0XHRcdH1cblx0XHQgKlx0XHR9KTtcblx0XHQgKlxuXHRcdCAqXHQvLyBkaXJlY3QgZGF0YVxuXHRcdCAqXHQkKCcjdHJlZScpLmpzdHJlZSh7XG5cdFx0ICpcdFx0J2NvcmUnIDoge1xuXHRcdCAqXHRcdFx0J2RhdGEnIDogW1xuXHRcdCAqXHRcdFx0XHQnU2ltcGxlIHJvb3Qgbm9kZScsXG5cdFx0ICpcdFx0XHRcdHtcblx0XHQgKlx0XHRcdFx0XHQnaWQnIDogJ25vZGVfMicsXG5cdFx0ICpcdFx0XHRcdFx0J3RleHQnIDogJ1Jvb3Qgbm9kZSB3aXRoIG9wdGlvbnMnLFxuXHRcdCAqXHRcdFx0XHRcdCdzdGF0ZScgOiB7ICdvcGVuZWQnIDogdHJ1ZSwgJ3NlbGVjdGVkJyA6IHRydWUgfSxcblx0XHQgKlx0XHRcdFx0XHQnY2hpbGRyZW4nIDogWyB7ICd0ZXh0JyA6ICdDaGlsZCAxJyB9LCAnQ2hpbGQgMiddXG5cdFx0ICpcdFx0XHRcdH1cblx0XHQgKlx0XHRcdF1cblx0XHQgKlx0XHR9XG5cdFx0ICpcdH0pO1xuXHRcdCAqXG5cdFx0ICpcdC8vIGZ1bmN0aW9uXG5cdFx0ICpcdCQoJyN0cmVlJykuanN0cmVlKHtcblx0XHQgKlx0XHQnY29yZScgOiB7XG5cdFx0ICpcdFx0XHQnZGF0YScgOiBmdW5jdGlvbiAob2JqLCBjYWxsYmFjaykge1xuXHRcdCAqXHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIFsnUm9vdCAxJywgJ1Jvb3QgMiddKTtcblx0XHQgKlx0XHRcdH1cblx0XHQgKlx0XHR9KTtcblx0XHQgKlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUuZGF0YVxuXHRcdCAqL1xuXHRcdGRhdGFcdFx0XHQ6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIGNvbmZpZ3VyZSB0aGUgdmFyaW91cyBzdHJpbmdzIHVzZWQgdGhyb3VnaG91dCB0aGUgdHJlZVxuXHRcdCAqXG5cdFx0ICogWW91IGNhbiB1c2UgYW4gb2JqZWN0IHdoZXJlIHRoZSBrZXkgaXMgdGhlIHN0cmluZyB5b3UgbmVlZCB0byByZXBsYWNlIGFuZCB0aGUgdmFsdWUgaXMgeW91ciByZXBsYWNlbWVudC5cblx0XHQgKiBBbm90aGVyIG9wdGlvbiBpcyB0byBzcGVjaWZ5IGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2l0aCBhbiBhcmd1bWVudCBvZiB0aGUgbmVlZGVkIHN0cmluZyBhbmQgc2hvdWxkIHJldHVybiB0aGUgcmVwbGFjZW1lbnQuXG5cdFx0ICogSWYgbGVmdCBhcyBgZmFsc2VgIG5vIHJlcGxhY2VtZW50IGlzIG1hZGUuXG5cdFx0ICpcblx0XHQgKiBfX0V4YW1wbGVzX19cblx0XHQgKlxuXHRcdCAqXHQkKCcjdHJlZScpLmpzdHJlZSh7XG5cdFx0ICpcdFx0J2NvcmUnIDoge1xuXHRcdCAqXHRcdFx0J3N0cmluZ3MnIDoge1xuXHRcdCAqXHRcdFx0XHQnTG9hZGluZyAuLi4nIDogJ1BsZWFzZSB3YWl0IC4uLidcblx0XHQgKlx0XHRcdH1cblx0XHQgKlx0XHR9XG5cdFx0ICpcdH0pO1xuXHRcdCAqXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5zdHJpbmdzXG5cdFx0ICovXG5cdFx0c3RyaW5nc1x0XHRcdDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogZGV0ZXJtaW5lcyB3aGF0IGhhcHBlbnMgd2hlbiBhIHVzZXIgdHJpZXMgdG8gbW9kaWZ5IHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHRyZWVcblx0XHQgKiBJZiBsZWZ0IGFzIGBmYWxzZWAgYWxsIG9wZXJhdGlvbnMgbGlrZSBjcmVhdGUsIHJlbmFtZSwgZGVsZXRlLCBtb3ZlIG9yIGNvcHkgYXJlIHByZXZlbnRlZC5cblx0XHQgKiBZb3UgY2FuIHNldCB0aGlzIHRvIGB0cnVlYCB0byBhbGxvdyBhbGwgaW50ZXJhY3Rpb25zIG9yIHVzZSBhIGZ1bmN0aW9uIHRvIGhhdmUgYmV0dGVyIGNvbnRyb2wuXG5cdFx0ICpcblx0XHQgKiBfX0V4YW1wbGVzX19cblx0XHQgKlxuXHRcdCAqXHQkKCcjdHJlZScpLmpzdHJlZSh7XG5cdFx0ICpcdFx0J2NvcmUnIDoge1xuXHRcdCAqXHRcdFx0J2NoZWNrX2NhbGxiYWNrJyA6IGZ1bmN0aW9uIChvcGVyYXRpb24sIG5vZGUsIG5vZGVfcGFyZW50LCBub2RlX3Bvc2l0aW9uLCBtb3JlKSB7XG5cdFx0ICpcdFx0XHRcdC8vIG9wZXJhdGlvbiBjYW4gYmUgJ2NyZWF0ZV9ub2RlJywgJ3JlbmFtZV9ub2RlJywgJ2RlbGV0ZV9ub2RlJywgJ21vdmVfbm9kZScsICdjb3B5X25vZGUnIG9yICdlZGl0J1xuXHRcdCAqXHRcdFx0XHQvLyBpbiBjYXNlIG9mICdyZW5hbWVfbm9kZScgbm9kZV9wb3NpdGlvbiBpcyBmaWxsZWQgd2l0aCB0aGUgbmV3IG5vZGUgbmFtZVxuXHRcdCAqXHRcdFx0XHRyZXR1cm4gb3BlcmF0aW9uID09PSAncmVuYW1lX25vZGUnID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdCAqXHRcdFx0fVxuXHRcdCAqXHRcdH1cblx0XHQgKlx0fSk7XG5cdFx0ICpcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmNoZWNrX2NhbGxiYWNrXG5cdFx0ICovXG5cdFx0Y2hlY2tfY2FsbGJhY2tcdDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogYSBjYWxsYmFjayBjYWxsZWQgd2l0aCBhIHNpbmdsZSBvYmplY3QgcGFyYW1ldGVyIGluIHRoZSBpbnN0YW5jZSdzIHNjb3BlIHdoZW4gc29tZXRoaW5nIGdvZXMgd3JvbmcgKG9wZXJhdGlvbiBwcmV2ZW50ZWQsIGFqYXggZmFpbGVkLCBldGMpXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5lcnJvclxuXHRcdCAqL1xuXHRcdGVycm9yXHRcdFx0OiAkLm5vb3AsXG5cdFx0LyoqXG5cdFx0ICogdGhlIG9wZW4gLyBjbG9zZSBhbmltYXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIC0gc2V0IHRoaXMgdG8gYGZhbHNlYCB0byBkaXNhYmxlIHRoZSBhbmltYXRpb24gKGRlZmF1bHQgaXMgYDIwMGApXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5hbmltYXRpb25cblx0XHQgKi9cblx0XHRhbmltYXRpb25cdFx0OiAyMDAsXG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgbXVsdGlwbGUgbm9kZXMgY2FuIGJlIHNlbGVjdGVkXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5tdWx0aXBsZVxuXHRcdCAqL1xuXHRcdG11bHRpcGxlXHRcdDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiB0aGVtZSBjb25maWd1cmF0aW9uIG9iamVjdFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzXG5cdFx0ICovXG5cdFx0dGhlbWVzXHRcdFx0OiB7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRoZSBuYW1lIG9mIHRoZSB0aGVtZSB0byB1c2UgKGlmIGxlZnQgYXMgYGZhbHNlYCB0aGUgZGVmYXVsdCB0aGVtZSBpcyB1c2VkKVxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXMubmFtZVxuXHRcdFx0ICovXG5cdFx0XHRuYW1lXHRcdFx0OiBmYWxzZSxcblx0XHRcdC8qKlxuXHRcdFx0ICogdGhlIFVSTCBvZiB0aGUgdGhlbWUncyBDU1MgZmlsZSwgbGVhdmUgdGhpcyBhcyBgZmFsc2VgIGlmIHlvdSBoYXZlIG1hbnVhbGx5IGluY2x1ZGVkIHRoZSB0aGVtZSBDU1MgKHJlY29tbWVuZGVkKS4gWW91IGNhbiBzZXQgdGhpcyB0byBgdHJ1ZWAgdG9vIHdoaWNoIHdpbGwgdHJ5IHRvIGF1dG9sb2FkIHRoZSB0aGVtZS5cblx0XHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUudGhlbWVzLnVybFxuXHRcdFx0ICovXG5cdFx0XHR1cmxcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHQvKipcblx0XHRcdCAqIHRoZSBsb2NhdGlvbiBvZiBhbGwganN0cmVlIHRoZW1lcyAtIG9ubHkgdXNlZCBpZiBgdXJsYCBpcyBzZXQgdG8gYHRydWVgXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lcy5kaXJcblx0XHRcdCAqL1xuXHRcdFx0ZGlyXHRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBjb25uZWN0aW5nIGRvdHMgYXJlIHNob3duXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lcy5kb3RzXG5cdFx0XHQgKi9cblx0XHRcdGRvdHNcdFx0XHQ6IHRydWUsXG5cdFx0XHQvKipcblx0XHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIG5vZGUgaWNvbnMgYXJlIHNob3duXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lcy5pY29uc1xuXHRcdFx0ICovXG5cdFx0XHRpY29uc1x0XHRcdDogdHJ1ZSxcblx0XHRcdC8qKlxuXHRcdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgbm9kZSBlbGxpcHNpcyBzaG91bGQgYmUgc2hvd24gLSB0aGlzIG9ubHkgd29ya3Mgd2l0aCBhIGZpeGVkIHdpdGggb24gdGhlIGNvbnRhaW5lclxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXMuZWxsaXBzaXNcblx0XHRcdCAqL1xuXHRcdFx0ZWxsaXBzaXNcdFx0OiBmYWxzZSxcblx0XHRcdC8qKlxuXHRcdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIHRyZWUgYmFja2dyb3VuZCBpcyBzdHJpcGVkXG5cdFx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLnRoZW1lcy5zdHJpcGVzXG5cdFx0XHQgKi9cblx0XHRcdHN0cmlwZXNcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBhIHN0cmluZyAob3IgYm9vbGVhbiBgZmFsc2VgKSBzcGVjaWZ5aW5nIHRoZSB0aGVtZSB2YXJpYW50IHRvIHVzZSAoaWYgdGhlIHRoZW1lIHN1cHBvcnRzIHZhcmlhbnRzKVxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXMudmFyaWFudFxuXHRcdFx0ICovXG5cdFx0XHR2YXJpYW50XHRcdFx0OiBmYWxzZSxcblx0XHRcdC8qKlxuXHRcdFx0ICogYSBib29sZWFuIHNwZWNpZnlpbmcgaWYgYSByZXBvbnNpdmUgdmVyc2lvbiBvZiB0aGUgdGhlbWUgc2hvdWxkIGtpY2sgaW4gb24gc21hbGxlciBzY3JlZW5zIChpZiB0aGUgdGhlbWUgc3VwcG9ydHMgaXQpLiBEZWZhdWx0cyB0byBgZmFsc2VgLlxuXHRcdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS50aGVtZXMucmVzcG9uc2l2ZVxuXHRcdFx0ICovXG5cdFx0XHRyZXNwb25zaXZlXHRcdDogZmFsc2Vcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGlmIGxlZnQgYXMgYHRydWVgIGFsbCBwYXJlbnRzIG9mIGFsbCBzZWxlY3RlZCBub2RlcyB3aWxsIGJlIG9wZW5lZCBvbmNlIHRoZSB0cmVlIGxvYWRzIChzbyB0aGF0IGFsbCBzZWxlY3RlZCBub2RlcyBhcmUgdmlzaWJsZSB0byB0aGUgdXNlcilcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmV4cGFuZF9zZWxlY3RlZF9vbmxvYWRcblx0XHQgKi9cblx0XHRleHBhbmRfc2VsZWN0ZWRfb25sb2FkIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBpZiBsZWZ0IGFzIGB0cnVlYCB3ZWIgd29ya2VycyB3aWxsIGJlIHVzZWQgdG8gcGFyc2UgaW5jb21pbmcgSlNPTiBkYXRhIHdoZXJlIHBvc3NpYmxlLCBzbyB0aGF0IHRoZSBVSSB3aWxsIG5vdCBiZSBibG9ja2VkIGJ5IGxhcmdlIHJlcXVlc3RzLiBXb3JrZXJzIGFyZSBob3dldmVyIGFib3V0IDMwJSBzbG93ZXIuIERlZmF1bHRzIHRvIGB0cnVlYFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUud29ya2VyXG5cdFx0ICovXG5cdFx0d29ya2VyIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBGb3JjZSBub2RlIHRleHQgdG8gcGxhaW4gdGV4dCAoYW5kIGVzY2FwZSBIVE1MKS4gRGVmYXVsdHMgdG8gYGZhbHNlYFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUuZm9yY2VfdGV4dFxuXHRcdCAqL1xuXHRcdGZvcmNlX3RleHQgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBTaG91bGQgdGhlIG5vZGUgYmUgdG9nZ2xlZCBpZiB0aGUgdGV4dCBpcyBkb3VibGUgY2xpY2tlZC4gRGVmYXVsdHMgdG8gYHRydWVgXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5kYmxjbGlja190b2dnbGVcblx0XHQgKi9cblx0XHRkYmxjbGlja190b2dnbGUgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIFNob3VsZCB0aGUgbG9hZGVkIG5vZGVzIGJlIHBhcnQgb2YgdGhlIHN0YXRlLiBEZWZhdWx0cyB0byBgZmFsc2VgXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5sb2FkZWRfc3RhdGVcblx0XHQgKi9cblx0XHRsb2FkZWRfc3RhdGUgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBTaG91bGQgdGhlIGxhc3QgYWN0aXZlIG5vZGUgYmUgZm9jdXNlZCB3aGVuIHRoZSB0cmVlIGNvbnRhaW5lciBpcyBibHVycmVkIGFuZCB0aGUgZm9jdXNlZCBhZ2Fpbi4gVGhpcyBoZWxwcyB3b3JraW5nIHdpdGggc2NyZWVuIHJlYWRlcnMuIERlZmF1bHRzIHRvIGB0cnVlYFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNvcmUucmVzdG9yZV9mb2N1c1xuXHRcdCAqL1xuXHRcdHJlc3RvcmVfZm9jdXMgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIERlZmF1bHQga2V5Ym9hcmQgc2hvcnRjdXRzIChhbiBvYmplY3Qgd2hlcmUgZWFjaCBrZXkgaXMgdGhlIGJ1dHRvbiBuYW1lIG9yIGNvbWJvIC0gbGlrZSAnZW50ZXInLCAnY3RybC1zcGFjZScsICdwJywgZXRjIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUpXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29yZS5rZXlib2FyZFxuXHRcdCAqL1xuXHRcdGtleWJvYXJkIDoge1xuXHRcdFx0J2N0cmwtc3BhY2UnOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyBhcmlhIGRlZmluZXMgc3BhY2Ugb25seSB3aXRoIEN0cmxcblx0XHRcdFx0ZS50eXBlID0gXCJjbGlja1wiO1xuXHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkudHJpZ2dlcihlKTtcblx0XHRcdH0sXG5cdFx0XHQnZW50ZXInOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyBlbnRlclxuXHRcdFx0XHRlLnR5cGUgPSBcImNsaWNrXCI7XG5cdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS50cmlnZ2VyKGUpO1xuXHRcdFx0fSxcblx0XHRcdCdsZWZ0JzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gbGVmdFxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGlmKHRoaXMuaXNfb3BlbihlLmN1cnJlbnRUYXJnZXQpKSB7XG5cdFx0XHRcdFx0dGhpcy5jbG9zZV9ub2RlKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIG8gPSB0aGlzLmdldF9wYXJlbnQoZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0XHRpZihvICYmIG8uaWQgIT09ICQuanN0cmVlLnJvb3QpIHsgdGhpcy5nZXRfbm9kZShvLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpOyB9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQndXAnOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyB1cFxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBvID0gdGhpcy5nZXRfcHJldl9kb20oZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0aWYobyAmJiBvLmxlbmd0aCkgeyBvLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7IH1cblx0XHRcdH0sXG5cdFx0XHQncmlnaHQnOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyByaWdodFxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGlmKHRoaXMuaXNfY2xvc2VkKGUuY3VycmVudFRhcmdldCkpIHtcblx0XHRcdFx0XHR0aGlzLm9wZW5fbm9kZShlLmN1cnJlbnRUYXJnZXQsIGZ1bmN0aW9uIChvKSB7IHRoaXMuZ2V0X25vZGUobywgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTsgfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5pc19vcGVuKGUuY3VycmVudFRhcmdldCkpIHtcblx0XHRcdFx0XHR2YXIgbyA9IHRoaXMuZ2V0X25vZGUoZS5jdXJyZW50VGFyZ2V0LCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1jaGlsZHJlbicpWzBdO1xuXHRcdFx0XHRcdGlmKG8pIHsgJCh0aGlzLl9maXJzdENoaWxkKG8pKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpOyB9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQnZG93bic6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdC8vIGRvd25cblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgbyA9IHRoaXMuZ2V0X25leHRfZG9tKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRcdGlmKG8gJiYgby5sZW5ndGgpIHsgby5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpOyB9XG5cdFx0XHR9LFxuXHRcdFx0JyonOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyBhcmlhIGRlZmluZXMgKiBvbiBudW1wYWQgYXMgb3Blbl9hbGwgLSBub3QgdmVyeSBjb21tb25cblx0XHRcdFx0dGhpcy5vcGVuX2FsbCgpO1xuXHRcdFx0fSxcblx0XHRcdCdob21lJzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gaG9tZVxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBvID0gdGhpcy5fZmlyc3RDaGlsZCh0aGlzLmdldF9jb250YWluZXJfdWwoKVswXSk7XG5cdFx0XHRcdGlmKG8pIHsgJChvKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5maWx0ZXIoJzp2aXNpYmxlJykuZm9jdXMoKTsgfVxuXHRcdFx0fSxcblx0XHRcdCdlbmQnOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHQvLyBlbmRcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS1hbmNob3InKS5maWx0ZXIoJzp2aXNpYmxlJykubGFzdCgpLmZvY3VzKCk7XG5cdFx0XHR9LFxuXHRcdFx0J2YyJzogZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Ly8gZjIgLSBzYWZlIHRvIGluY2x1ZGUgLSBpZiBjaGVja19jYWxsYmFjayBpcyBmYWxzZSBpdCB3aWxsIGZhaWxcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR0aGlzLmVkaXQoZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdCQuanN0cmVlLmNvcmUucHJvdG90eXBlID0ge1xuXHRcdC8qKlxuXHRcdCAqIHVzZWQgdG8gZGVjb3JhdGUgYW4gaW5zdGFuY2Ugd2l0aCBhIHBsdWdpbi4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgcGx1Z2luKGRlY28gWywgb3B0c10pXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBkZWNvIHRoZSBwbHVnaW4gdG8gZGVjb3JhdGUgd2l0aFxuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gb3B0cyBvcHRpb25zIGZvciB0aGUgcGx1Z2luXG5cdFx0ICogQHJldHVybiB7anNUcmVlfVxuXHRcdCAqL1xuXHRcdHBsdWdpbiA6IGZ1bmN0aW9uIChkZWNvLCBvcHRzKSB7XG5cdFx0XHR2YXIgQ2hpbGQgPSAkLmpzdHJlZS5wbHVnaW5zW2RlY29dO1xuXHRcdFx0aWYoQ2hpbGQpIHtcblx0XHRcdFx0dGhpcy5fZGF0YVtkZWNvXSA9IHt9O1xuXHRcdFx0XHRDaGlsZC5wcm90b3R5cGUgPSB0aGlzO1xuXHRcdFx0XHRyZXR1cm4gbmV3IENoaWxkKG9wdHMsIHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBpbml0aWFsaXplIHRoZSBpbnN0YW5jZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgaW5pdChlbCwgb3B0b25zKVxuXHRcdCAqIEBwYXJhbSB7RE9NRWxlbWVudHxqUXVlcnl8U3RyaW5nfSBlbCB0aGUgZWxlbWVudCB3ZSBhcmUgdHJhbnNmb3JtaW5nXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgb3B0aW9ucyBmb3IgdGhpcyBpbnN0YW5jZVxuXHRcdCAqIEB0cmlnZ2VyIGluaXQuanN0cmVlLCBsb2FkaW5nLmpzdHJlZSwgbG9hZGVkLmpzdHJlZSwgcmVhZHkuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGluaXQgOiBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcblx0XHRcdHRoaXMuX21vZGVsID0ge1xuXHRcdFx0XHRkYXRhIDoge30sXG5cdFx0XHRcdGNoYW5nZWQgOiBbXSxcblx0XHRcdFx0Zm9yY2VfZnVsbF9yZWRyYXcgOiBmYWxzZSxcblx0XHRcdFx0cmVkcmF3X3RpbWVvdXQgOiBmYWxzZSxcblx0XHRcdFx0ZGVmYXVsdF9zdGF0ZSA6IHtcblx0XHRcdFx0XHRsb2FkZWQgOiB0cnVlLFxuXHRcdFx0XHRcdG9wZW5lZCA6IGZhbHNlLFxuXHRcdFx0XHRcdHNlbGVjdGVkIDogZmFsc2UsXG5cdFx0XHRcdFx0ZGlzYWJsZWQgOiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XSA9IHtcblx0XHRcdFx0aWQgOiAkLmpzdHJlZS5yb290LFxuXHRcdFx0XHRwYXJlbnQgOiBudWxsLFxuXHRcdFx0XHRwYXJlbnRzIDogW10sXG5cdFx0XHRcdGNoaWxkcmVuIDogW10sXG5cdFx0XHRcdGNoaWxkcmVuX2QgOiBbXSxcblx0XHRcdFx0c3RhdGUgOiB7IGxvYWRlZCA6IGZhbHNlIH1cblx0XHRcdH07XG5cblx0XHRcdHRoaXMuZWxlbWVudCA9ICQoZWwpLmFkZENsYXNzKCdqc3RyZWUganN0cmVlLScgKyB0aGlzLl9pZCk7XG5cdFx0XHR0aGlzLnNldHRpbmdzID0gb3B0aW9ucztcblxuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnJlYWR5ID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUubG9hZGVkID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUucnRsID0gKHRoaXMuZWxlbWVudC5jc3MoXCJkaXJlY3Rpb25cIikgPT09IFwicnRsXCIpO1xuXHRcdFx0dGhpcy5lbGVtZW50W3RoaXMuX2RhdGEuY29yZS5ydGwgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJ10oXCJqc3RyZWUtcnRsXCIpO1xuXHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ3JvbGUnLCd0cmVlJyk7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNvcmUubXVsdGlwbGUpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJywgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRpZighdGhpcy5lbGVtZW50LmF0dHIoJ3RhYmluZGV4JykpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ3RhYmluZGV4JywnMCcpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmJpbmQoKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIGFmdGVyIGFsbCBldmVudHMgYXJlIGJvdW5kXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGluaXQuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcihcImluaXRcIik7XG5cblx0XHRcdHRoaXMuX2RhdGEuY29yZS5vcmlnaW5hbF9jb250YWluZXJfaHRtbCA9IHRoaXMuZWxlbWVudC5maW5kKFwiID4gdWwgPiBsaVwiKS5jbG9uZSh0cnVlKTtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5vcmlnaW5hbF9jb250YWluZXJfaHRtbFxuXHRcdFx0XHQuZmluZChcImxpXCIpLmFkZEJhY2soKVxuXHRcdFx0XHQuY29udGVudHMoKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVR5cGUgPT09IDMgJiYgKCF0aGlzLm5vZGVWYWx1ZSB8fCAvXlxccyskLy50ZXN0KHRoaXMubm9kZVZhbHVlKSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5yZW1vdmUoKTtcblx0XHRcdHRoaXMuZWxlbWVudC5odG1sKFwiPFwiK1widWwgY2xhc3M9J2pzdHJlZS1jb250YWluZXItdWwganN0cmVlLWNoaWxkcmVuJyByb2xlPSdncm91cCc+PFwiK1wibGkgaWQ9J2pcIit0aGlzLl9pZCtcIl9sb2FkaW5nJyBjbGFzcz0nanN0cmVlLWluaXRpYWwtbm9kZSBqc3RyZWUtbG9hZGluZyBqc3RyZWUtbGVhZiBqc3RyZWUtbGFzdCcgcm9sZT0ndHJlZS1pdGVtJz48aSBjbGFzcz0nanN0cmVlLWljb24ganN0cmVlLW9jbCc+PC9pPjxcIitcImEgY2xhc3M9J2pzdHJlZS1hbmNob3InIGhyZWY9JyMnPjxpIGNsYXNzPSdqc3RyZWUtaWNvbiBqc3RyZWUtdGhlbWVpY29uLWhpZGRlbic+PC9pPlwiICsgdGhpcy5nZXRfc3RyaW5nKFwiTG9hZGluZyAuLi5cIikgKyBcIjwvYT48L2xpPjwvdWw+XCIpO1xuXHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsJ2onICsgdGhpcy5faWQgKyAnX2xvYWRpbmcnKTtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5saV9oZWlnaHQgPSB0aGlzLmdldF9jb250YWluZXJfdWwoKS5jaGlsZHJlbihcImxpXCIpLmZpcnN0KCkub3V0ZXJIZWlnaHQoKSB8fCAyNDtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5ub2RlID0gdGhpcy5fY3JlYXRlX3Byb3RvdHlwZV9ub2RlKCk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCBhZnRlciB0aGUgbG9hZGluZyB0ZXh0IGlzIHNob3duIGFuZCBiZWZvcmUgbG9hZGluZyBzdGFydHNcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgbG9hZGluZy5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKFwibG9hZGluZ1wiKTtcblx0XHRcdHRoaXMubG9hZF9ub2RlKCQuanN0cmVlLnJvb3QpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZGVzdHJveSBhbiBpbnN0YW5jZVxuXHRcdCAqIEBuYW1lIGRlc3Ryb3koKVxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGtlZXBfaHRtbCBpZiBub3Qgc2V0IHRvIGB0cnVlYCB0aGUgY29udGFpbmVyIHdpbGwgYmUgZW1wdGllZCwgb3RoZXJ3aXNlIHRoZSBjdXJyZW50IERPTSBlbGVtZW50cyB3aWxsIGJlIGtlcHQgaW50YWN0XG5cdFx0ICovXG5cdFx0ZGVzdHJveSA6IGZ1bmN0aW9uIChrZWVwX2h0bWwpIHtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIGJlZm9yZSB0aGUgdHJlZSBpcyBkZXN0cm95ZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgZGVzdHJveS5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKFwiZGVzdHJveVwiKTtcblx0XHRcdGlmKHRoaXMuX3dyaykge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKHRoaXMuX3dyayk7XG5cdFx0XHRcdFx0dGhpcy5fd3JrID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaCAoaWdub3JlKSB7IH1cblx0XHRcdH1cblx0XHRcdGlmKCFrZWVwX2h0bWwpIHsgdGhpcy5lbGVtZW50LmVtcHR5KCk7IH1cblx0XHRcdHRoaXMudGVhcmRvd24oKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZSBhIHByb3RvdHlwZSBub2RlXG5cdFx0ICogQG5hbWUgX2NyZWF0ZV9wcm90b3R5cGVfbm9kZSgpXG5cdFx0ICogQHJldHVybiB7RE9NRWxlbWVudH1cblx0XHQgKi9cblx0XHRfY3JlYXRlX3Byb3RvdHlwZV9ub2RlIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnTEknKSwgX3RlbXAxLCBfdGVtcDI7XG5cdFx0XHRfbm9kZS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndHJlZWl0ZW0nKTtcblx0XHRcdF90ZW1wMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0knKTtcblx0XHRcdF90ZW1wMS5jbGFzc05hbWUgPSAnanN0cmVlLWljb24ganN0cmVlLW9jbCc7XG5cdFx0XHRfdGVtcDEuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuXHRcdFx0X25vZGUuYXBwZW5kQ2hpbGQoX3RlbXAxKTtcblx0XHRcdF90ZW1wMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0EnKTtcblx0XHRcdF90ZW1wMS5jbGFzc05hbWUgPSAnanN0cmVlLWFuY2hvcic7XG5cdFx0XHRfdGVtcDEuc2V0QXR0cmlidXRlKCdocmVmJywnIycpO1xuXHRcdFx0X3RlbXAxLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCctMScpO1xuXHRcdFx0X3RlbXAyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnSScpO1xuXHRcdFx0X3RlbXAyLmNsYXNzTmFtZSA9ICdqc3RyZWUtaWNvbiBqc3RyZWUtdGhlbWVpY29uJztcblx0XHRcdF90ZW1wMi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7XG5cdFx0XHRfdGVtcDEuYXBwZW5kQ2hpbGQoX3RlbXAyKTtcblx0XHRcdF9ub2RlLmFwcGVuZENoaWxkKF90ZW1wMSk7XG5cdFx0XHRfdGVtcDEgPSBfdGVtcDIgPSBudWxsO1xuXG5cdFx0XHRyZXR1cm4gX25vZGU7XG5cdFx0fSxcblx0XHRfa2JldmVudF90b19mdW5jIDogZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciBrZXlzID0ge1xuXHRcdFx0XHQ4OiBcIkJhY2tzcGFjZVwiLCA5OiBcIlRhYlwiLCAxMzogXCJFbnRlclwiLCAxOTogXCJQYXVzZVwiLCAyNzogXCJFc2NcIixcblx0XHRcdFx0MzI6IFwiU3BhY2VcIiwgMzM6IFwiUGFnZVVwXCIsIDM0OiBcIlBhZ2VEb3duXCIsIDM1OiBcIkVuZFwiLCAzNjogXCJIb21lXCIsXG5cdFx0XHRcdDM3OiBcIkxlZnRcIiwgMzg6IFwiVXBcIiwgMzk6IFwiUmlnaHRcIiwgNDA6IFwiRG93blwiLCA0NDogXCJQcmludFwiLCA0NTogXCJJbnNlcnRcIixcblx0XHRcdFx0NDY6IFwiRGVsZXRlXCIsIDk2OiBcIk51bXBhZDBcIiwgOTc6IFwiTnVtcGFkMVwiLCA5ODogXCJOdW1wYWQyXCIsIDk5IDogXCJOdW1wYWQzXCIsXG5cdFx0XHRcdDEwMDogXCJOdW1wYWQ0XCIsIDEwMTogXCJOdW1wYWQ1XCIsIDEwMjogXCJOdW1wYWQ2XCIsIDEwMzogXCJOdW1wYWQ3XCIsXG5cdFx0XHRcdDEwNDogXCJOdW1wYWQ4XCIsIDEwNTogXCJOdW1wYWQ5XCIsICctMTMnOiBcIk51bXBhZEVudGVyXCIsIDExMjogXCJGMVwiLFxuXHRcdFx0XHQxMTM6IFwiRjJcIiwgMTE0OiBcIkYzXCIsIDExNTogXCJGNFwiLCAxMTY6IFwiRjVcIiwgMTE3OiBcIkY2XCIsIDExODogXCJGN1wiLFxuXHRcdFx0XHQxMTk6IFwiRjhcIiwgMTIwOiBcIkY5XCIsIDEyMTogXCJGMTBcIiwgMTIyOiBcIkYxMVwiLCAxMjM6IFwiRjEyXCIsIDE0NDogXCJOdW1sb2NrXCIsXG5cdFx0XHRcdDE0NTogXCJTY3JvbGxsb2NrXCIsIDE2OiAnU2hpZnQnLCAxNzogJ0N0cmwnLCAxODogJ0FsdCcsXG5cdFx0XHRcdDQ4OiAnMCcsICA0OTogJzEnLCAgNTA6ICcyJywgIDUxOiAnMycsICA1MjogJzQnLCA1MzogICc1Jyxcblx0XHRcdFx0NTQ6ICc2JywgIDU1OiAnNycsICA1NjogJzgnLCAgNTc6ICc5JywgIDU5OiAnOycsICA2MTogJz0nLCA2NTogICdhJyxcblx0XHRcdFx0NjY6ICdiJywgIDY3OiAnYycsICA2ODogJ2QnLCAgNjk6ICdlJywgIDcwOiAnZicsICA3MTogJ2cnLCA3MjogICdoJyxcblx0XHRcdFx0NzM6ICdpJywgIDc0OiAnaicsICA3NTogJ2snLCAgNzY6ICdsJywgIDc3OiAnbScsICA3ODogJ24nLCA3OTogICdvJyxcblx0XHRcdFx0ODA6ICdwJywgIDgxOiAncScsICA4MjogJ3InLCAgODM6ICdzJywgIDg0OiAndCcsICA4NTogJ3UnLCA4NjogICd2Jyxcblx0XHRcdFx0ODc6ICd3JywgIDg4OiAneCcsICA4OTogJ3knLCAgOTA6ICd6JywgMTA3OiAnKycsIDEwOTogJy0nLCAxMTA6ICcuJyxcblx0XHRcdFx0MTg2OiAnOycsIDE4NzogJz0nLCAxODg6ICcsJywgMTg5OiAnLScsIDE5MDogJy4nLCAxOTE6ICcvJywgMTkyOiAnYCcsXG5cdFx0XHRcdDIxOTogJ1snLCAyMjA6ICdcXFxcJywyMjE6ICddJywgMjIyOiBcIidcIiwgMTExOiAnLycsIDEwNjogJyonLCAxNzM6ICctJ1xuXHRcdFx0fTtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXHRcdFx0aWYgKGUuY3RybEtleSkgeyBwYXJ0cy5wdXNoKCdjdHJsJyk7IH1cblx0XHRcdGlmIChlLmFsdEtleSkgeyBwYXJ0cy5wdXNoKCdhbHQnKTsgfVxuXHRcdFx0aWYgKGUuc2hpZnRLZXkpIHsgcGFydHMucHVzaCgnc2hpZnQnKTsgfVxuXHRcdFx0cGFydHMucHVzaChrZXlzW2Uud2hpY2hdIHx8IGUud2hpY2gpO1xuXHRcdFx0cGFydHMgPSBwYXJ0cy5zb3J0KCkuam9pbignLScpLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdHZhciBrYiA9IHRoaXMuc2V0dGluZ3MuY29yZS5rZXlib2FyZCwgaSwgdG1wO1xuXHRcdFx0Zm9yIChpIGluIGtiKSB7XG5cdFx0XHRcdGlmIChrYi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdHRtcCA9IGk7XG5cdFx0XHRcdFx0aWYgKHRtcCAhPT0gJy0nICYmIHRtcCAhPT0gJysnKSB7XG5cdFx0XHRcdFx0XHR0bXAgPSB0bXAucmVwbGFjZSgnLS0nLCAnLU1JTlVTJykucmVwbGFjZSgnKy0nLCAnLU1JTlVTJykucmVwbGFjZSgnKysnLCAnLVBMVVMnKS5yZXBsYWNlKCctKycsICctUExVUycpO1xuXHRcdFx0XHRcdFx0dG1wID0gdG1wLnNwbGl0KC8tfFxcKy8pLnNvcnQoKS5qb2luKCctJykucmVwbGFjZSgnTUlOVVMnLCAnLScpLnJlcGxhY2UoJ1BMVVMnLCAnKycpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0bXAgPT09IHBhcnRzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4ga2JbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHBhcnQgb2YgdGhlIGRlc3Ryb3lpbmcgb2YgYW4gaW5zdGFuY2UuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIHRlYXJkb3duKClcblx0XHQgKi9cblx0XHR0ZWFyZG93biA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMudW5iaW5kKCk7XG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdqc3RyZWUnKVxuXHRcdFx0XHQucmVtb3ZlRGF0YSgnanN0cmVlJylcblx0XHRcdFx0LmZpbmQoXCJbY2xhc3NePSdqc3RyZWUnXVwiKVxuXHRcdFx0XHRcdC5hZGRCYWNrKClcblx0XHRcdFx0XHQuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuY2xhc3NOYW1lLnJlcGxhY2UoL2pzdHJlZVteIF0qfCQvaWcsJycpOyB9KTtcblx0XHRcdHRoaXMuZWxlbWVudCA9IG51bGw7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBiaW5kIGFsbCBldmVudHMuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIGJpbmQoKVxuXHRcdCAqL1xuXHRcdGJpbmQgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgd29yZCA9ICcnLFxuXHRcdFx0XHR0b3V0ID0gbnVsbCxcblx0XHRcdFx0d2FzX2NsaWNrID0gMDtcblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQub24oXCJkYmxjbGljay5qc3RyZWVcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKGUudGFyZ2V0LnRhZ05hbWUgJiYgZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdFx0XHRcdGlmKGRvY3VtZW50LnNlbGVjdGlvbiAmJiBkb2N1bWVudC5zZWxlY3Rpb24uZW1wdHkpIHtcblx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQuc2VsZWN0aW9uLmVtcHR5KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0aWYod2luZG93LmdldFNlbGVjdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbC5jb2xsYXBzZSgpO1xuXHRcdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGlnbm9yZSkgeyB9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQub24oXCJtb3VzZWRvd24uanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKGUudGFyZ2V0ID09PSB0aGlzLmVsZW1lbnRbMF0pIHtcblx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IGxvc2luZyBmb2N1cyB3aGVuIGNsaWNraW5nIHNjcm9sbCBhcnJvd3MgKEZGLCBDaHJvbWUpXG5cdFx0XHRcdFx0XHRcdHdhc19jbGljayA9ICsobmV3IERhdGUoKSk7IC8vIGllIGRvZXMgbm90IGFsbG93IHRvIHByZXZlbnQgbG9zaW5nIGZvY3VzXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcIm1vdXNlZG93bi5qc3RyZWVcIiwgXCIuanN0cmVlLW9jbFwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IGFueSBub2RlIGluc2lkZSBmcm9tIGxvc2luZyBmb2N1cyB3aGVuIGNsaWNraW5nIHRoZSBvcGVuL2Nsb3NlIGljb25cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQub24oXCJjbGljay5qc3RyZWVcIiwgXCIuanN0cmVlLW9jbFwiLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRvZ2dsZV9ub2RlKGUudGFyZ2V0KTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiZGJsY2xpY2suanN0cmVlXCIsIFwiLmpzdHJlZS1hbmNob3JcIiwgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYoZS50YXJnZXQudGFnTmFtZSAmJiBlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIikgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0XHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jb3JlLmRibGNsaWNrX3RvZ2dsZSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnRvZ2dsZV9ub2RlKGUudGFyZ2V0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiY2xpY2suanN0cmVlXCIsIFwiLmpzdHJlZS1hbmNob3JcIiwgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0aWYoZS5jdXJyZW50VGFyZ2V0ICE9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7ICQoZS5jdXJyZW50VGFyZ2V0KS5mb2N1cygpOyB9XG5cdFx0XHRcdFx0XHR0aGlzLmFjdGl2YXRlX25vZGUoZS5jdXJyZW50VGFyZ2V0LCBlKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKCdrZXlkb3duLmpzdHJlZScsICcuanN0cmVlLWFuY2hvcicsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKGUudGFyZ2V0LnRhZ05hbWUgJiYgZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS5ydGwpIHtcblx0XHRcdFx0XHRcdFx0aWYoZS53aGljaCA9PT0gMzcpIHsgZS53aGljaCA9IDM5OyB9XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYoZS53aGljaCA9PT0gMzkpIHsgZS53aGljaCA9IDM3OyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2YXIgZiA9IHRoaXMuX2tiZXZlbnRfdG9fZnVuYyhlKTtcblx0XHRcdFx0XHRcdGlmIChmKSB7XG5cdFx0XHRcdFx0XHRcdHZhciByID0gZi5jYWxsKHRoaXMsIGUpO1xuXHRcdFx0XHRcdFx0XHRpZiAociA9PT0gZmFsc2UgfHwgciA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImxvYWRfbm9kZS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0aWYoZGF0YS5zdGF0dXMpIHtcblx0XHRcdFx0XHRcdFx0aWYoZGF0YS5ub2RlLmlkID09PSAkLmpzdHJlZS5yb290ICYmICF0aGlzLl9kYXRhLmNvcmUubG9hZGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxvYWRlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5fZmlyc3RDaGlsZCh0aGlzLmdldF9jb250YWluZXJfdWwoKVswXSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLHRoaXMuX2ZpcnN0Q2hpbGQodGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0pLmlkKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0XHRcdFx0ICogdHJpZ2dlcmVkIGFmdGVyIHRoZSByb290IG5vZGUgaXMgbG9hZGVkIGZvciB0aGUgZmlyc3QgdGltZVxuXHRcdFx0XHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdFx0XHRcdCAqIEBuYW1lIGxvYWRlZC5qc3RyZWVcblx0XHRcdFx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoXCJsb2FkZWRcIik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoIXRoaXMuX2RhdGEuY29yZS5yZWFkeSkge1xuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMuZWxlbWVudCAmJiAhdGhpcy5nZXRfY29udGFpbmVyX3VsKCkuZmluZCgnLmpzdHJlZS1sb2FkaW5nJykubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5yZWFkeSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0aGlzLnNldHRpbmdzLmNvcmUuZXhwYW5kX3NlbGVjdGVkX29ubG9hZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHRtcCA9IFtdLCBpLCBqO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSB0bXAuY29uY2F0KHRoaXMuX21vZGVsLmRhdGFbdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkW2ldXS5wYXJlbnRzKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9ICQudmFrYXRhLmFycmF5X3VuaXF1ZSh0bXApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLm9wZW5fbm9kZSh0bXBbaV0sIGZhbHNlLCAwKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdyZWFkeScsICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAqIHRyaWdnZXJlZCBhZnRlciBhbGwgbm9kZXMgYXJlIGZpbmlzaGVkIGxvYWRpbmdcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAqIEBuYW1lIHJlYWR5LmpzdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy50cmlnZ2VyKFwicmVhZHlcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSwgdGhpcyksIDApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC8vIHF1aWNrIHNlYXJjaGluZyB3aGVuIHRoZSB0cmVlIGlzIGZvY3VzZWRcblx0XHRcdFx0Lm9uKCdrZXlwcmVzcy5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZihlLnRhcmdldC50YWdOYW1lICYmIGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiKSB7IHJldHVybiB0cnVlOyB9XG5cdFx0XHRcdFx0XHRpZih0b3V0KSB7IGNsZWFyVGltZW91dCh0b3V0KTsgfVxuXHRcdFx0XHRcdFx0dG91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHR3b3JkID0gJyc7XG5cdFx0XHRcdFx0XHR9LCA1MDApO1xuXG5cdFx0XHRcdFx0XHR2YXIgY2hyID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdFx0XHRjb2wgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS1hbmNob3InKS5maWx0ZXIoJzp2aXNpYmxlJyksXG5cdFx0XHRcdFx0XHRcdGluZCA9IGNvbC5pbmRleChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB8fCAwLFxuXHRcdFx0XHRcdFx0XHRlbmQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHdvcmQgKz0gY2hyO1xuXG5cdFx0XHRcdFx0XHQvLyBtYXRjaCBmb3Igd2hvbGUgd29yZCBmcm9tIGN1cnJlbnQgbm9kZSBkb3duIChpbmNsdWRpbmcgdGhlIGN1cnJlbnQgbm9kZSlcblx0XHRcdFx0XHRcdGlmKHdvcmQubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRjb2wuc2xpY2UoaW5kKS5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdFx0XHRpZigkKHYpLnRleHQoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yod29yZCkgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdCQodikuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGVuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdFx0XHRcdGlmKGVuZCkgeyByZXR1cm47IH1cblxuXHRcdFx0XHRcdFx0XHQvLyBtYXRjaCBmb3Igd2hvbGUgd29yZCBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHRyZWVcblx0XHRcdFx0XHRcdFx0Y29sLnNsaWNlKDAsIGluZCkuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYoJCh2KS50ZXh0KCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHdvcmQpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKHYpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHRcdFx0XHRpZihlbmQpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvLyBsaXN0IG5vZGVzIHRoYXQgc3RhcnQgd2l0aCB0aGF0IGxldHRlciAob25seSBpZiB3b3JkIGNvbnNpc3RzIG9mIGEgc2luZ2xlIGNoYXIpXG5cdFx0XHRcdFx0XHRpZihuZXcgUmVnRXhwKCdeJyArIGNoci5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKSArICcrJCcpLnRlc3Qod29yZCkpIHtcblx0XHRcdFx0XHRcdFx0Ly8gc2VhcmNoIGZvciB0aGUgbmV4dCBub2RlIHN0YXJ0aW5nIHdpdGggdGhhdCBsZXR0ZXJcblx0XHRcdFx0XHRcdFx0Y29sLnNsaWNlKGluZCArIDEpLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0XHRcdGlmKCQodikudGV4dCgpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSBjaHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdCQodikuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGVuZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdFx0XHRcdGlmKGVuZCkgeyByZXR1cm47IH1cblxuXHRcdFx0XHRcdFx0XHQvLyBzZWFyY2ggZnJvbSB0aGUgYmVnaW5uaW5nXG5cdFx0XHRcdFx0XHRcdGNvbC5zbGljZSgwLCBpbmQgKyAxKS5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0XHRcdFx0XHRpZigkKHYpLnRleHQoKS50b0xvd2VyQ2FzZSgpLmNoYXJBdCgwKSA9PT0gY2hyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQkKHYpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHRcdFx0XHRpZihlbmQpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC8vIFRIRU1FIFJFTEFURURcblx0XHRcdFx0Lm9uKFwiaW5pdC5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2YXIgcyA9IHRoaXMuc2V0dGluZ3MuY29yZS50aGVtZXM7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmRvdHNcdFx0XHQ9IHMuZG90cztcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuc3RyaXBlc1x0XHQ9IHMuc3RyaXBlcztcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuaWNvbnNcdFx0PSBzLmljb25zO1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5lbGxpcHNpc1x0XHQ9IHMuZWxsaXBzaXM7XG5cdFx0XHRcdFx0XHR0aGlzLnNldF90aGVtZShzLm5hbWUgfHwgXCJkZWZhdWx0XCIsIHMudXJsKTtcblx0XHRcdFx0XHRcdHRoaXMuc2V0X3RoZW1lX3ZhcmlhbnQocy52YXJpYW50KTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwibG9hZGluZy5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR0aGlzWyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmRvdHMgPyBcInNob3dfZG90c1wiIDogXCJoaWRlX2RvdHNcIiBdKCk7XG5cdFx0XHRcdFx0XHR0aGlzWyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmljb25zID8gXCJzaG93X2ljb25zXCIgOiBcImhpZGVfaWNvbnNcIiBdKCk7XG5cdFx0XHRcdFx0XHR0aGlzWyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnN0cmlwZXMgPyBcInNob3dfc3RyaXBlc1wiIDogXCJoaWRlX3N0cmlwZXNcIiBdKCk7XG5cdFx0XHRcdFx0XHR0aGlzWyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmVsbGlwc2lzID8gXCJzaG93X2VsbGlwc2lzXCIgOiBcImhpZGVfZWxsaXBzaXNcIiBdKCk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbignYmx1ci5qc3RyZWUnLCAnLmpzdHJlZS1hbmNob3InLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCA9IG51bGw7XG5cdFx0XHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkuZmlsdGVyKCcuanN0cmVlLWhvdmVyZWQnKS50cmlnZ2VyKCdtb3VzZWxlYXZlJyk7XG5cdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuYXR0cigndGFiaW5kZXgnLCAnMCcpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oJ2ZvY3VzLmpzdHJlZScsICcuanN0cmVlLWFuY2hvcicsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSB0aGlzLmdldF9ub2RlKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLmlkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkID0gdG1wLmlkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtaG92ZXJlZCcpLm5vdChlLmN1cnJlbnRUYXJnZXQpLnRyaWdnZXIoJ21vdXNlbGVhdmUnKTtcblx0XHRcdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS50cmlnZ2VyKCdtb3VzZWVudGVyJyk7XG5cdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKCdmb2N1cy5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGlmKCsobmV3IERhdGUoKSkgLSB3YXNfY2xpY2sgPiA1MDAgJiYgIXRoaXMuX2RhdGEuY29yZS5mb2N1c2VkICYmIHRoaXMuc2V0dGluZ3MuY29yZS5yZXN0b3JlX2ZvY3VzKSB7XG5cdFx0XHRcdFx0XHRcdHdhc19jbGljayA9IDA7XG5cdFx0XHRcdFx0XHRcdHZhciBhY3QgPSB0aGlzLmdldF9ub2RlKHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdGlmKGFjdCkge1xuXHRcdFx0XHRcdFx0XHRcdGFjdC5maW5kKCc+IC5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oJ21vdXNlZW50ZXIuanN0cmVlJywgJy5qc3RyZWUtYW5jaG9yJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5ob3Zlcl9ub2RlKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbignbW91c2VsZWF2ZS5qc3RyZWUnLCAnLmpzdHJlZS1hbmNob3InLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmRlaG92ZXJfbm9kZShlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHBhcnQgb2YgdGhlIGRlc3Ryb3lpbmcgb2YgYW4gaW5zdGFuY2UuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIHVuYmluZCgpXG5cdFx0ICovXG5cdFx0dW5iaW5kIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5lbGVtZW50Lm9mZignLmpzdHJlZScpO1xuXHRcdFx0JChkb2N1bWVudCkub2ZmKCcuanN0cmVlLScgKyB0aGlzLl9pZCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiB0cmlnZ2VyIGFuIGV2ZW50LiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSB0cmlnZ2VyKGV2IFssIGRhdGFdKVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gZXYgdGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHRyaWdnZXJcblx0XHQgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgYWRkaXRpb25hbCBkYXRhIHRvIHBhc3Mgd2l0aCB0aGUgZXZlbnRcblx0XHQgKi9cblx0XHR0cmlnZ2VyIDogZnVuY3Rpb24gKGV2LCBkYXRhKSB7XG5cdFx0XHRpZighZGF0YSkge1xuXHRcdFx0XHRkYXRhID0ge307XG5cdFx0XHR9XG5cdFx0XHRkYXRhLmluc3RhbmNlID0gdGhpcztcblx0XHRcdHRoaXMuZWxlbWVudC50cmlnZ2VySGFuZGxlcihldi5yZXBsYWNlKCcuanN0cmVlJywnJykgKyAnLmpzdHJlZScsIGRhdGEpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmV0dXJucyB0aGUgalF1ZXJ5IGV4dGVuZGVkIGluc3RhbmNlIGNvbnRhaW5lclxuXHRcdCAqIEBuYW1lIGdldF9jb250YWluZXIoKVxuXHRcdCAqIEByZXR1cm4ge2pRdWVyeX1cblx0XHQgKi9cblx0XHRnZXRfY29udGFpbmVyIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWxlbWVudDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHJldHVybnMgdGhlIGpRdWVyeSBleHRlbmRlZCBtYWluIFVMIG5vZGUgaW5zaWRlIHRoZSBpbnN0YW5jZSBjb250YWluZXIuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIGdldF9jb250YWluZXJfdWwoKVxuXHRcdCAqIEByZXR1cm4ge2pRdWVyeX1cblx0XHQgKi9cblx0XHRnZXRfY29udGFpbmVyX3VsIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWxlbWVudC5jaGlsZHJlbihcIi5qc3RyZWUtY2hpbGRyZW5cIikuZmlyc3QoKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldHMgc3RyaW5nIHJlcGxhY2VtZW50cyAobG9jYWxpemF0aW9uKS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgZ2V0X3N0cmluZyhrZXkpXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBrZXlcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0Z2V0X3N0cmluZyA6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHZhciBhID0gdGhpcy5zZXR0aW5ncy5jb3JlLnN0cmluZ3M7XG5cdFx0XHRpZigkLmlzRnVuY3Rpb24oYSkpIHsgcmV0dXJuIGEuY2FsbCh0aGlzLCBrZXkpOyB9XG5cdFx0XHRpZihhICYmIGFba2V5XSkgeyByZXR1cm4gYVtrZXldOyB9XG5cdFx0XHRyZXR1cm4ga2V5O1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0cyB0aGUgZmlyc3QgY2hpbGQgb2YgYSBET00gbm9kZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX2ZpcnN0Q2hpbGQoZG9tKVxuXHRcdCAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IGRvbVxuXHRcdCAqIEByZXR1cm4ge0RPTUVsZW1lbnR9XG5cdFx0ICovXG5cdFx0X2ZpcnN0Q2hpbGQgOiBmdW5jdGlvbiAoZG9tKSB7XG5cdFx0XHRkb20gPSBkb20gPyBkb20uZmlyc3RDaGlsZCA6IG51bGw7XG5cdFx0XHR3aGlsZShkb20gIT09IG51bGwgJiYgZG9tLm5vZGVUeXBlICE9PSAxKSB7XG5cdFx0XHRcdGRvbSA9IGRvbS5uZXh0U2libGluZztcblx0XHRcdH1cblx0XHRcdHJldHVybiBkb207XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXRzIHRoZSBuZXh0IHNpYmxpbmcgb2YgYSBET00gbm9kZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX25leHRTaWJsaW5nKGRvbSlcblx0XHQgKiBAcGFyYW0gIHtET01FbGVtZW50fSBkb21cblx0XHQgKiBAcmV0dXJuIHtET01FbGVtZW50fVxuXHRcdCAqL1xuXHRcdF9uZXh0U2libGluZyA6IGZ1bmN0aW9uIChkb20pIHtcblx0XHRcdGRvbSA9IGRvbSA/IGRvbS5uZXh0U2libGluZyA6IG51bGw7XG5cdFx0XHR3aGlsZShkb20gIT09IG51bGwgJiYgZG9tLm5vZGVUeXBlICE9PSAxKSB7XG5cdFx0XHRcdGRvbSA9IGRvbS5uZXh0U2libGluZztcblx0XHRcdH1cblx0XHRcdHJldHVybiBkb207XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXRzIHRoZSBwcmV2aW91cyBzaWJsaW5nIG9mIGEgRE9NIG5vZGUuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9wcmV2aW91c1NpYmxpbmcoZG9tKVxuXHRcdCAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IGRvbVxuXHRcdCAqIEByZXR1cm4ge0RPTUVsZW1lbnR9XG5cdFx0ICovXG5cdFx0X3ByZXZpb3VzU2libGluZyA6IGZ1bmN0aW9uIChkb20pIHtcblx0XHRcdGRvbSA9IGRvbSA/IGRvbS5wcmV2aW91c1NpYmxpbmcgOiBudWxsO1xuXHRcdFx0d2hpbGUoZG9tICE9PSBudWxsICYmIGRvbS5ub2RlVHlwZSAhPT0gMSkge1xuXHRcdFx0XHRkb20gPSBkb20ucHJldmlvdXNTaWJsaW5nO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRvbTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCB0aGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiBhIG5vZGUgKG9yIHRoZSBhY3R1YWwgalF1ZXJ5IGV4dGVuZGVkIERPTSBub2RlKSBieSB1c2luZyBhbnkgaW5wdXQgKGNoaWxkIERPTSBlbGVtZW50LCBJRCBzdHJpbmcsIHNlbGVjdG9yLCBldGMpXG5cdFx0ICogQG5hbWUgZ2V0X25vZGUob2JqIFssIGFzX2RvbV0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGFzX2RvbVxuXHRcdCAqIEByZXR1cm4ge09iamVjdHxqUXVlcnl9XG5cdFx0ICovXG5cdFx0Z2V0X25vZGUgOiBmdW5jdGlvbiAob2JqLCBhc19kb20pIHtcblx0XHRcdGlmKG9iaiAmJiBvYmouaWQpIHtcblx0XHRcdFx0b2JqID0gb2JqLmlkO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG9iaiBpbnN0YW5jZW9mICQgJiYgb2JqLmxlbmd0aCAmJiBvYmpbMF0uaWQpIHtcblx0XHRcdFx0b2JqID0gb2JqWzBdLmlkO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGRvbTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbb2JqXSkge1xuXHRcdFx0XHRcdG9iaiA9IHRoaXMuX21vZGVsLmRhdGFbb2JqXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIgJiYgdGhpcy5fbW9kZWwuZGF0YVtvYmoucmVwbGFjZSgvXiMvLCAnJyldKSB7XG5cdFx0XHRcdFx0b2JqID0gdGhpcy5fbW9kZWwuZGF0YVtvYmoucmVwbGFjZSgvXiMvLCAnJyldO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIiAmJiAoZG9tID0gJCgnIycgKyBvYmoucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSwgdGhpcy5lbGVtZW50KSkubGVuZ3RoICYmIHRoaXMuX21vZGVsLmRhdGFbZG9tLmNsb3Nlc3QoJy5qc3RyZWUtbm9kZScpLmF0dHIoJ2lkJyldKSB7XG5cdFx0XHRcdFx0b2JqID0gdGhpcy5fbW9kZWwuZGF0YVtkb20uY2xvc2VzdCgnLmpzdHJlZS1ub2RlJykuYXR0cignaWQnKV07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigoZG9tID0gdGhpcy5lbGVtZW50LmZpbmQob2JqKSkubGVuZ3RoICYmIHRoaXMuX21vZGVsLmRhdGFbZG9tLmNsb3Nlc3QoJy5qc3RyZWUtbm9kZScpLmF0dHIoJ2lkJyldKSB7XG5cdFx0XHRcdFx0b2JqID0gdGhpcy5fbW9kZWwuZGF0YVtkb20uY2xvc2VzdCgnLmpzdHJlZS1ub2RlJykuYXR0cignaWQnKV07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigoZG9tID0gdGhpcy5lbGVtZW50LmZpbmQob2JqKSkubGVuZ3RoICYmIGRvbS5oYXNDbGFzcygnanN0cmVlJykpIHtcblx0XHRcdFx0XHRvYmogPSB0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKGFzX2RvbSkge1xuXHRcdFx0XHRcdG9iaiA9IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCA/IHRoaXMuZWxlbWVudCA6ICQoJyMnICsgb2JqLmlkLnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJyksIHRoaXMuZWxlbWVudCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG9iajtcblx0XHRcdH0gY2F0Y2ggKGV4KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IHRoZSBwYXRoIHRvIGEgbm9kZSwgZWl0aGVyIGNvbnNpc3Rpbmcgb2Ygbm9kZSB0ZXh0cywgb3Igb2Ygbm9kZSBJRHMsIG9wdGlvbmFsbHkgZ2x1ZWQgdG9nZXRoZXIgKG90aGVyd2lzZSBhbiBhcnJheSlcblx0XHQgKiBAbmFtZSBnZXRfcGF0aChvYmogWywgZ2x1ZSwgaWRzXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBnbHVlIGlmIHlvdSB3YW50IHRoZSBwYXRoIGFzIGEgc3RyaW5nIC0gcGFzcyB0aGUgZ2x1ZSBoZXJlIChmb3IgZXhhbXBsZSAnLycpLCBpZiBhIGZhbHN5IHZhbHVlIGlzIHN1cHBsaWVkIGhlcmUsIGFuIGFycmF5IGlzIHJldHVybmVkXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gaWRzIGlmIHNldCB0byB0cnVlIGJ1aWxkIHRoZSBwYXRoIHVzaW5nIElELCBvdGhlcndpc2Ugbm9kZSB0ZXh0IGlzIHVzZWRcblx0XHQgKiBAcmV0dXJuIHttaXhlZH1cblx0XHQgKi9cblx0XHRnZXRfcGF0aCA6IGZ1bmN0aW9uIChvYmosIGdsdWUsIGlkcykge1xuXHRcdFx0b2JqID0gb2JqLnBhcmVudHMgPyBvYmogOiB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCB8fCAhb2JqLnBhcmVudHMpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGksIGosIHAgPSBbXTtcblx0XHRcdHAucHVzaChpZHMgPyBvYmouaWQgOiBvYmoudGV4dCk7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBvYmoucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0cC5wdXNoKGlkcyA/IG9iai5wYXJlbnRzW2ldIDogdGhpcy5nZXRfdGV4dChvYmoucGFyZW50c1tpXSkpO1xuXHRcdFx0fVxuXHRcdFx0cCA9IHAucmV2ZXJzZSgpLnNsaWNlKDEpO1xuXHRcdFx0cmV0dXJuIGdsdWUgPyBwLmpvaW4oZ2x1ZSkgOiBwO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IHRoZSBuZXh0IHZpc2libGUgbm9kZSB0aGF0IGlzIGJlbG93IHRoZSBgb2JqYCBub2RlLiBJZiBgc3RyaWN0YCBpcyBzZXQgdG8gYHRydWVgIG9ubHkgc2libGluZyBub2RlcyBhcmUgcmV0dXJuZWQuXG5cdFx0ICogQG5hbWUgZ2V0X25leHRfZG9tKG9iaiBbLCBzdHJpY3RdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBzdHJpY3Rcblx0XHQgKiBAcmV0dXJuIHtqUXVlcnl9XG5cdFx0ICovXG5cdFx0Z2V0X25leHRfZG9tIDogZnVuY3Rpb24gKG9iaiwgc3RyaWN0KSB7XG5cdFx0XHR2YXIgdG1wO1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYob2JqWzBdID09PSB0aGlzLmVsZW1lbnRbMF0pIHtcblx0XHRcdFx0dG1wID0gdGhpcy5fZmlyc3RDaGlsZCh0aGlzLmdldF9jb250YWluZXJfdWwoKVswXSk7XG5cdFx0XHRcdHdoaWxlICh0bXAgJiYgdG1wLm9mZnNldEhlaWdodCA9PT0gMCkge1xuXHRcdFx0XHRcdHRtcCA9IHRoaXMuX25leHRTaWJsaW5nKHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRtcCA/ICQodG1wKSA6IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoIW9iaiB8fCAhb2JqLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZihzdHJpY3QpIHtcblx0XHRcdFx0dG1wID0gb2JqWzBdO1xuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0dG1wID0gdGhpcy5fbmV4dFNpYmxpbmcodG1wKTtcblx0XHRcdFx0fSB3aGlsZSAodG1wICYmIHRtcC5vZmZzZXRIZWlnaHQgPT09IDApO1xuXHRcdFx0XHRyZXR1cm4gdG1wID8gJCh0bXApIDogZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZihvYmouaGFzQ2xhc3MoXCJqc3RyZWUtb3BlblwiKSkge1xuXHRcdFx0XHR0bXAgPSB0aGlzLl9maXJzdENoaWxkKG9iai5jaGlsZHJlbignLmpzdHJlZS1jaGlsZHJlbicpWzBdKTtcblx0XHRcdFx0d2hpbGUgKHRtcCAmJiB0bXAub2Zmc2V0SGVpZ2h0ID09PSAwKSB7XG5cdFx0XHRcdFx0dG1wID0gdGhpcy5fbmV4dFNpYmxpbmcodG1wKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZih0bXAgIT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCh0bXApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBvYmpbMF07XG5cdFx0XHRkbyB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuX25leHRTaWJsaW5nKHRtcCk7XG5cdFx0XHR9IHdoaWxlICh0bXAgJiYgdG1wLm9mZnNldEhlaWdodCA9PT0gMCk7XG5cdFx0XHRpZih0bXAgIT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuICQodG1wKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvYmoucGFyZW50c1VudGlsKFwiLmpzdHJlZVwiLFwiLmpzdHJlZS1ub2RlXCIpLm5leHRBbGwoXCIuanN0cmVlLW5vZGU6dmlzaWJsZVwiKS5maXJzdCgpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IHRoZSBwcmV2aW91cyB2aXNpYmxlIG5vZGUgdGhhdCBpcyBhYm92ZSB0aGUgYG9iamAgbm9kZS4gSWYgYHN0cmljdGAgaXMgc2V0IHRvIGB0cnVlYCBvbmx5IHNpYmxpbmcgbm9kZXMgYXJlIHJldHVybmVkLlxuXHRcdCAqIEBuYW1lIGdldF9wcmV2X2RvbShvYmogWywgc3RyaWN0XSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gc3RyaWN0XG5cdFx0ICogQHJldHVybiB7alF1ZXJ5fVxuXHRcdCAqL1xuXHRcdGdldF9wcmV2X2RvbSA6IGZ1bmN0aW9uIChvYmosIHN0cmljdCkge1xuXHRcdFx0dmFyIHRtcDtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKG9ialswXSA9PT0gdGhpcy5lbGVtZW50WzBdKSB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdLmxhc3RDaGlsZDtcblx0XHRcdFx0d2hpbGUgKHRtcCAmJiB0bXAub2Zmc2V0SGVpZ2h0ID09PSAwKSB7XG5cdFx0XHRcdFx0dG1wID0gdGhpcy5fcHJldmlvdXNTaWJsaW5nKHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRtcCA/ICQodG1wKSA6IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoIW9iaiB8fCAhb2JqLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZihzdHJpY3QpIHtcblx0XHRcdFx0dG1wID0gb2JqWzBdO1xuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0dG1wID0gdGhpcy5fcHJldmlvdXNTaWJsaW5nKHRtcCk7XG5cdFx0XHRcdH0gd2hpbGUgKHRtcCAmJiB0bXAub2Zmc2V0SGVpZ2h0ID09PSAwKTtcblx0XHRcdFx0cmV0dXJuIHRtcCA/ICQodG1wKSA6IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dG1wID0gb2JqWzBdO1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHR0bXAgPSB0aGlzLl9wcmV2aW91c1NpYmxpbmcodG1wKTtcblx0XHRcdH0gd2hpbGUgKHRtcCAmJiB0bXAub2Zmc2V0SGVpZ2h0ID09PSAwKTtcblx0XHRcdGlmKHRtcCAhPT0gbnVsbCkge1xuXHRcdFx0XHRvYmogPSAkKHRtcCk7XG5cdFx0XHRcdHdoaWxlKG9iai5oYXNDbGFzcyhcImpzdHJlZS1vcGVuXCIpKSB7XG5cdFx0XHRcdFx0b2JqID0gb2JqLmNoaWxkcmVuKFwiLmpzdHJlZS1jaGlsZHJlblwiKS5maXJzdCgpLmNoaWxkcmVuKFwiLmpzdHJlZS1ub2RlOnZpc2libGU6bGFzdFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0fVxuXHRcdFx0dG1wID0gb2JqWzBdLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcblx0XHRcdHJldHVybiB0bXAgJiYgdG1wLmNsYXNzTmFtZSAmJiB0bXAuY2xhc3NOYW1lLmluZGV4T2YoJ2pzdHJlZS1ub2RlJykgIT09IC0xID8gJCh0bXApIDogZmFsc2U7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgdGhlIHBhcmVudCBJRCBvZiBhIG5vZGVcblx0XHQgKiBAbmFtZSBnZXRfcGFyZW50KG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdGdldF9wYXJlbnQgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqLnBhcmVudDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCBhIGpRdWVyeSBjb2xsZWN0aW9uIG9mIGFsbCB0aGUgY2hpbGRyZW4gb2YgYSBub2RlIChub2RlIG11c3QgYmUgcmVuZGVyZWQpLCByZXR1cm5zIGZhbHNlIG9uIGVycm9yXG5cdFx0ICogQG5hbWUgZ2V0X2NoaWxkcmVuX2RvbShvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge2pRdWVyeX1cblx0XHQgKi9cblx0XHRnZXRfY2hpbGRyZW5fZG9tIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYob2JqWzBdID09PSB0aGlzLmVsZW1lbnRbMF0pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmNoaWxkcmVuKFwiLmpzdHJlZS1ub2RlXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYoIW9iaiB8fCAhb2JqLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqLmNoaWxkcmVuKFwiLmpzdHJlZS1jaGlsZHJlblwiKS5jaGlsZHJlbihcIi5qc3RyZWUtbm9kZVwiKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrcyBpZiBhIG5vZGUgaGFzIGNoaWxkcmVuXG5cdFx0ICogQG5hbWUgaXNfcGFyZW50KG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRpc19wYXJlbnQgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqICYmIChvYmouc3RhdGUubG9hZGVkID09PSBmYWxzZSB8fCBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVja3MgaWYgYSBub2RlIGlzIGxvYWRlZCAoaXRzIGNoaWxkcmVuIGFyZSBhdmFpbGFibGUpXG5cdFx0ICogQG5hbWUgaXNfbG9hZGVkKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRpc19sb2FkZWQgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqICYmIG9iai5zdGF0ZS5sb2FkZWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVjayBpZiBhIG5vZGUgaXMgY3VycmVudGx5IGxvYWRpbmcgKGZldGNoaW5nIGNoaWxkcmVuKVxuXHRcdCAqIEBuYW1lIGlzX2xvYWRpbmcob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGlzX2xvYWRpbmcgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqICYmIG9iai5zdGF0ZSAmJiBvYmouc3RhdGUubG9hZGluZztcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrIGlmIGEgbm9kZSBpcyBvcGVuZWRcblx0XHQgKiBAbmFtZSBpc19vcGVuKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRpc19vcGVuIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuIG9iaiAmJiBvYmouc3RhdGUub3BlbmVkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2sgaWYgYSBub2RlIGlzIGluIGEgY2xvc2VkIHN0YXRlXG5cdFx0ICogQG5hbWUgaXNfY2xvc2VkKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRpc19jbG9zZWQgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqICYmIHRoaXMuaXNfcGFyZW50KG9iaikgJiYgIW9iai5zdGF0ZS5vcGVuZWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVjayBpZiBhIG5vZGUgaGFzIG5vIGNoaWxkcmVuXG5cdFx0ICogQG5hbWUgaXNfbGVhZihvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXNfbGVhZiA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdHJldHVybiAhdGhpcy5pc19wYXJlbnQob2JqKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGxvYWRzIGEgbm9kZSAoZmV0Y2hlcyBpdHMgY2hpbGRyZW4gdXNpbmcgdGhlIGBjb3JlLmRhdGFgIHNldHRpbmcpLiBNdWx0aXBsZSBub2RlcyBjYW4gYmUgcGFzc2VkIHRvIGJ5IHVzaW5nIGFuIGFycmF5LlxuXHRcdCAqIEBuYW1lIGxvYWRfbm9kZShvYmogWywgY2FsbGJhY2tdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcGFyYW0gIHtmdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbmNlIGxvYWRpbmcgaXMgY29tcGxldGUsIHRoZSBmdW5jdGlvbiBpcyBleGVjdXRlZCBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSBhbmQgcmVjZWl2ZXMgdHdvIGFyZ3VtZW50cyAtIHRoZSBub2RlIGFuZCBhIGJvb2xlYW4gc3RhdHVzXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKiBAdHJpZ2dlciBsb2FkX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0bG9hZF9ub2RlIDogZnVuY3Rpb24gKG9iaiwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBrLCBsLCBpLCBqLCBjO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0dGhpcy5fbG9hZF9ub2RlcyhvYmouc2xpY2UoKSwgY2FsbGJhY2spO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmopIHtcblx0XHRcdFx0aWYoY2FsbGJhY2spIHsgY2FsbGJhY2suY2FsbCh0aGlzLCBvYmosIGZhbHNlKTsgfVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZihvYmouc3RhdGUubG9hZGluZykgeyB9IC8vIHRoZSBub2RlIGlzIGFscmVhZHkgbG9hZGluZyAtIGp1c3Qgd2FpdCBmb3IgaXQgdG8gbG9hZCBhbmQgaW52b2tlIGNhbGxiYWNrPyBidXQgaWYgY2FsbGVkIGltcGxpY2l0bHkgaXQgc2hvdWxkIGJlIGxvYWRlZCBhZ2Fpbj9cblx0XHRcdGlmKG9iai5zdGF0ZS5sb2FkZWQpIHtcblx0XHRcdFx0b2JqLnN0YXRlLmxvYWRlZCA9IGZhbHNlO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmoucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW29iai5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kID0gJC52YWthdGEuYXJyYXlfZmlsdGVyKHRoaXMuX21vZGVsLmRhdGFbb2JqLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QsIGZ1bmN0aW9uICh2KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJC5pbkFycmF5KHYsIG9iai5jaGlsZHJlbl9kKSA9PT0gLTE7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gb2JqLmNoaWxkcmVuX2QubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVtvYmouY2hpbGRyZW5fZFtrXV0uc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdGMgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkZWxldGUgdGhpcy5fbW9kZWwuZGF0YVtvYmouY2hpbGRyZW5fZFtrXV07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGMpIHtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgPSAkLnZha2F0YS5hcnJheV9maWx0ZXIodGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCBmdW5jdGlvbiAodikge1xuXHRcdFx0XHRcdFx0cmV0dXJuICQuaW5BcnJheSh2LCBvYmouY2hpbGRyZW5fZCkgPT09IC0xO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG9iai5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0XHRvYmouY2hpbGRyZW5fZCA9IFtdO1xuXHRcdFx0XHRpZihjKSB7XG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdsb2FkX25vZGUnLCAnbm9kZScgOiBvYmosICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG9iai5zdGF0ZS5mYWlsZWQgPSBmYWxzZTtcblx0XHRcdG9iai5zdGF0ZS5sb2FkaW5nID0gdHJ1ZTtcblx0XHRcdHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKS5hZGRDbGFzcyhcImpzdHJlZS1sb2FkaW5nXCIpLmF0dHIoJ2FyaWEtYnVzeScsdHJ1ZSk7XG5cdFx0XHR0aGlzLl9sb2FkX25vZGUob2JqLCAkLnByb3h5KGZ1bmN0aW9uIChzdGF0dXMpIHtcblx0XHRcdFx0b2JqID0gdGhpcy5fbW9kZWwuZGF0YVtvYmouaWRdO1xuXHRcdFx0XHRvYmouc3RhdGUubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHRvYmouc3RhdGUubG9hZGVkID0gc3RhdHVzO1xuXHRcdFx0XHRvYmouc3RhdGUuZmFpbGVkID0gIW9iai5zdGF0ZS5sb2FkZWQ7XG5cdFx0XHRcdHZhciBkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSksIGkgPSAwLCBqID0gMCwgbSA9IHRoaXMuX21vZGVsLmRhdGEsIGhhc19jaGlsZHJlbiA9IGZhbHNlO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYobVtvYmouY2hpbGRyZW5baV1dICYmICFtW29iai5jaGlsZHJlbltpXV0uc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdFx0XHRoYXNfY2hpbGRyZW4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG9iai5zdGF0ZS5sb2FkZWQgJiYgZG9tICYmIGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1jbG9zZWQganN0cmVlLW9wZW4ganN0cmVlLWxlYWYnKTtcblx0XHRcdFx0XHRpZiAoIWhhc19jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0ZG9tLmFkZENsYXNzKCdqc3RyZWUtbGVhZicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChvYmouaWQgIT09ICcjJykge1xuXHRcdFx0XHRcdFx0XHRkb20uYWRkQ2xhc3Mob2JqLnN0YXRlLm9wZW5lZCA/ICdqc3RyZWUtb3BlbicgOiAnanN0cmVlLWNsb3NlZCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtbG9hZGluZ1wiKS5hdHRyKCdhcmlhLWJ1c3knLGZhbHNlKTtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCBhZnRlciBhIG5vZGUgaXMgbG9hZGVkXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBsb2FkX25vZGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBub2RlIHRoYXQgd2FzIGxvYWRpbmdcblx0XHRcdFx0ICogQHBhcmFtIHtCb29sZWFufSBzdGF0dXMgd2FzIHRoZSBub2RlIGxvYWRlZCBzdWNjZXNzZnVsbHlcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignbG9hZF9ub2RlJywgeyBcIm5vZGVcIiA6IG9iaiwgXCJzdGF0dXNcIiA6IHN0YXR1cyB9KTtcblx0XHRcdFx0aWYoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIG9iaiwgc3RhdHVzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBsb2FkIGFuIGFycmF5IG9mIG5vZGVzICh3aWxsIGFsc28gbG9hZCB1bmF2YWlsYWJsZSBub2RlcyBhcyBzb29uIGFzIHRoZXkgYXBwZWFyIGluIHRoZSBzdHJ1Y3R1cmUpLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBfbG9hZF9ub2Rlcyhub2RlcyBbLCBjYWxsYmFja10pXG5cdFx0ICogQHBhcmFtICB7YXJyYXl9IG5vZGVzXG5cdFx0ICogQHBhcmFtICB7ZnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb25jZSBsb2FkaW5nIGlzIGNvbXBsZXRlLCB0aGUgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUgYW5kIHJlY2VpdmVzIG9uZSBhcmd1bWVudCAtIHRoZSBhcnJheSBwYXNzZWQgdG8gX2xvYWRfbm9kZXNcblx0XHQgKi9cblx0XHRfbG9hZF9ub2RlcyA6IGZ1bmN0aW9uIChub2RlcywgY2FsbGJhY2ssIGlzX2NhbGxiYWNrLCBmb3JjZV9yZWxvYWQpIHtcblx0XHRcdHZhciByID0gdHJ1ZSxcblx0XHRcdFx0YyA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fbG9hZF9ub2Rlcyhub2RlcywgY2FsbGJhY2ssIHRydWUpOyB9LFxuXHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSwgaSwgaiwgdG1wID0gW107XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBub2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYobVtub2Rlc1tpXV0gJiYgKCAoIW1bbm9kZXNbaV1dLnN0YXRlLmxvYWRlZCAmJiAhbVtub2Rlc1tpXV0uc3RhdGUuZmFpbGVkKSB8fCAoIWlzX2NhbGxiYWNrICYmIGZvcmNlX3JlbG9hZCkgKSkge1xuXHRcdFx0XHRcdGlmKCF0aGlzLmlzX2xvYWRpbmcobm9kZXNbaV0pKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRfbm9kZShub2Rlc1tpXSwgYyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHIgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYocikge1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBub2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZihtW25vZGVzW2ldXSAmJiBtW25vZGVzW2ldXS5zdGF0ZS5sb2FkZWQpIHtcblx0XHRcdFx0XHRcdHRtcC5wdXNoKG5vZGVzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoY2FsbGJhY2sgJiYgIWNhbGxiYWNrLmRvbmUpIHtcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIHRtcCk7XG5cdFx0XHRcdFx0Y2FsbGJhY2suZG9uZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGxvYWRzIGFsbCB1bmxvYWRlZCBub2Rlc1xuXHRcdCAqIEBuYW1lIGxvYWRfYWxsKFtvYmosIGNhbGxiYWNrXSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGUgdG8gbG9hZCByZWN1cnNpdmVseSwgb21pdCB0byBsb2FkIGFsbCBub2RlcyBpbiB0aGUgdHJlZVxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb25jZSBsb2FkaW5nIGFsbCB0aGUgbm9kZXMgaXMgY29tcGxldGUsXG5cdFx0ICogQHRyaWdnZXIgbG9hZF9hbGwuanN0cmVlXG5cdFx0ICovXG5cdFx0bG9hZF9hbGwgOiBmdW5jdGlvbiAob2JqLCBjYWxsYmFjaykge1xuXHRcdFx0aWYoIW9iaikgeyBvYmogPSAkLmpzdHJlZS5yb290OyB9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIHRvX2xvYWQgPSBbXSxcblx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdGMgPSBtW29iai5pZF0uY2hpbGRyZW5fZCxcblx0XHRcdFx0aSwgajtcblx0XHRcdGlmKG9iai5zdGF0ZSAmJiAhb2JqLnN0YXRlLmxvYWRlZCkge1xuXHRcdFx0XHR0b19sb2FkLnB1c2gob2JqLmlkKTtcblx0XHRcdH1cblx0XHRcdGZvcihpID0gMCwgaiA9IGMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKG1bY1tpXV0gJiYgbVtjW2ldXS5zdGF0ZSAmJiAhbVtjW2ldXS5zdGF0ZS5sb2FkZWQpIHtcblx0XHRcdFx0XHR0b19sb2FkLnB1c2goY1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKHRvX2xvYWQubGVuZ3RoKSB7XG5cdFx0XHRcdHRoaXMuX2xvYWRfbm9kZXModG9fbG9hZCwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHRoaXMubG9hZF9hbGwob2JqLCBjYWxsYmFjayk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgYWZ0ZXIgYSBsb2FkX2FsbCBjYWxsIGNvbXBsZXRlc1xuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgbG9hZF9hbGwuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSByZWN1cnNpdmVseSBsb2FkZWQgbm9kZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0aWYoY2FsbGJhY2spIHsgY2FsbGJhY2suY2FsbCh0aGlzLCBvYmopOyB9XG5cdFx0XHRcdHRoaXMudHJpZ2dlcignbG9hZF9hbGwnLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogaGFuZGxlcyB0aGUgYWN0dWFsIGxvYWRpbmcgb2YgYSBub2RlLiBVc2VkIG9ubHkgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9sb2FkX25vZGUob2JqIFssIGNhbGxiYWNrXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHBhcmFtICB7ZnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb25jZSBsb2FkaW5nIGlzIGNvbXBsZXRlLCB0aGUgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUgYW5kIHJlY2VpdmVzIG9uZSBhcmd1bWVudCAtIGEgYm9vbGVhbiBzdGF0dXNcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdF9sb2FkX25vZGUgOiBmdW5jdGlvbiAob2JqLCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIHMgPSB0aGlzLnNldHRpbmdzLmNvcmUuZGF0YSwgdDtcblx0XHRcdHZhciBub3RUZXh0T3JDb21tZW50Tm9kZSA9IGZ1bmN0aW9uIG5vdFRleHRPckNvbW1lbnROb2RlICgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVR5cGUgIT09IDMgJiYgdGhpcy5ub2RlVHlwZSAhPT0gODtcblx0XHRcdH07XG5cdFx0XHQvLyB1c2Ugb3JpZ2luYWwgSFRNTFxuXHRcdFx0aWYoIXMpIHtcblx0XHRcdFx0aWYob2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2FwcGVuZF9odG1sX2RhdGEob2JqLCB0aGlzLl9kYXRhLmNvcmUub3JpZ2luYWxfY29udGFpbmVyX2h0bWwuY2xvbmUodHJ1ZSksIGZ1bmN0aW9uIChzdGF0dXMpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgc3RhdHVzKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgb2JqLmlkID09PSAkLmpzdHJlZS5yb290ID8gdGhpcy5fYXBwZW5kX2h0bWxfZGF0YShvYmosIHRoaXMuX2RhdGEuY29yZS5vcmlnaW5hbF9jb250YWluZXJfaHRtbC5jbG9uZSh0cnVlKSkgOiBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRpZigkLmlzRnVuY3Rpb24ocykpIHtcblx0XHRcdFx0cmV0dXJuIHMuY2FsbCh0aGlzLCBvYmosICQucHJveHkoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRpZihkID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpc1t0eXBlb2YgZCA9PT0gJ3N0cmluZycgPyAnX2FwcGVuZF9odG1sX2RhdGEnIDogJ19hcHBlbmRfanNvbl9kYXRhJ10ob2JqLCB0eXBlb2YgZCA9PT0gJ3N0cmluZycgPyAkKCQucGFyc2VIVE1MKGQpKS5maWx0ZXIobm90VGV4dE9yQ29tbWVudE5vZGUpIDogZCwgZnVuY3Rpb24gKHN0YXR1cykge1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIHN0YXR1cyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gcmV0dXJuIGQgPT09IGZhbHNlID8gY2FsbGJhY2suY2FsbCh0aGlzLCBmYWxzZSkgOiBjYWxsYmFjay5jYWxsKHRoaXMsIHRoaXNbdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gJ19hcHBlbmRfaHRtbF9kYXRhJyA6ICdfYXBwZW5kX2pzb25fZGF0YSddKG9iaiwgdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gJChkKSA6IGQpKTtcblx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0fVxuXHRcdFx0aWYodHlwZW9mIHMgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGlmKHMudXJsKSB7XG5cdFx0XHRcdFx0cyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzKTtcblx0XHRcdFx0XHRpZigkLmlzRnVuY3Rpb24ocy51cmwpKSB7XG5cdFx0XHRcdFx0XHRzLnVybCA9IHMudXJsLmNhbGwodGhpcywgb2JqKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoJC5pc0Z1bmN0aW9uKHMuZGF0YSkpIHtcblx0XHRcdFx0XHRcdHMuZGF0YSA9IHMuZGF0YS5jYWxsKHRoaXMsIG9iaik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiAkLmFqYXgocylcblx0XHRcdFx0XHRcdC5kb25lKCQucHJveHkoZnVuY3Rpb24gKGQsdCx4KSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHR5cGUgPSB4LmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcblx0XHRcdFx0XHRcdFx0XHRpZigodHlwZSAmJiB0eXBlLmluZGV4T2YoJ2pzb24nKSAhPT0gLTEpIHx8IHR5cGVvZiBkID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fYXBwZW5kX2pzb25fZGF0YShvYmosIGQsIGZ1bmN0aW9uIChzdGF0dXMpIHsgY2FsbGJhY2suY2FsbCh0aGlzLCBzdGF0dXMpOyB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdC8vcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgdGhpcy5fYXBwZW5kX2pzb25fZGF0YShvYmosIGQpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYoKHR5cGUgJiYgdHlwZS5pbmRleE9mKCdodG1sJykgIT09IC0xKSB8fCB0eXBlb2YgZCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2FwcGVuZF9odG1sX2RhdGEob2JqLCAkKCQucGFyc2VIVE1MKGQpKS5maWx0ZXIobm90VGV4dE9yQ29tbWVudE5vZGUpLCBmdW5jdGlvbiAoc3RhdHVzKSB7IGNhbGxiYWNrLmNhbGwodGhpcywgc3RhdHVzKTsgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyByZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCB0aGlzLl9hcHBlbmRfaHRtbF9kYXRhKG9iaiwgJChkKSkpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdhamF4JywgJ3BsdWdpbicgOiAnY29yZScsICdpZCcgOiAnY29yZV8wNCcsICdyZWFzb24nIDogJ0NvdWxkIG5vdCBsb2FkIG5vZGUnLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdpZCcgOiBvYmouaWQsICd4aHInIDogeCB9KSB9O1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHRcdFx0LmZhaWwoJC5wcm94eShmdW5jdGlvbiAoZikge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2FqYXgnLCAncGx1Z2luJyA6ICdjb3JlJywgJ2lkJyA6ICdjb3JlXzA0JywgJ3JlYXNvbicgOiAnQ291bGQgbm90IGxvYWQgbm9kZScsICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2lkJyA6IG9iai5pZCwgJ3hocicgOiBmIH0pIH07XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCQuaXNBcnJheShzKSkge1xuXHRcdFx0XHRcdHQgPSAkLmV4dGVuZCh0cnVlLCBbXSwgcyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoJC5pc1BsYWluT2JqZWN0KHMpKSB7XG5cdFx0XHRcdFx0dCA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0ID0gcztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fYXBwZW5kX2pzb25fZGF0YShvYmosIHQsIGZ1bmN0aW9uIChzdGF0dXMpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgc3RhdHVzKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdub2RhdGEnLCAncGx1Z2luJyA6ICdjb3JlJywgJ2lkJyA6ICdjb3JlXzA1JywgJ3JlYXNvbicgOiAnQ291bGQgbm90IGxvYWQgbm9kZScsICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2lkJyA6IG9iai5pZCB9KSB9O1xuXHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9yZXR1cm4gY2FsbGJhY2suY2FsbCh0aGlzLCAob2JqLmlkID09PSAkLmpzdHJlZS5yb290ID8gdGhpcy5fYXBwZW5kX2pzb25fZGF0YShvYmosIHQpIDogZmFsc2UpICk7XG5cdFx0XHR9XG5cdFx0XHRpZih0eXBlb2YgcyA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0aWYob2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2FwcGVuZF9odG1sX2RhdGEob2JqLCAkKCQucGFyc2VIVE1MKHMpKS5maWx0ZXIobm90VGV4dE9yQ29tbWVudE5vZGUpLCBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIHN0YXR1cyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnbm9kYXRhJywgJ3BsdWdpbicgOiAnY29yZScsICdpZCcgOiAnY29yZV8wNicsICdyZWFzb24nIDogJ0NvdWxkIG5vdCBsb2FkIG5vZGUnLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdpZCcgOiBvYmouaWQgfSkgfTtcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgKG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCA/IHRoaXMuX2FwcGVuZF9odG1sX2RhdGEob2JqLCAkKHMpKSA6IGZhbHNlKSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpcywgZmFsc2UpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogYWRkcyBhIG5vZGUgdG8gdGhlIGxpc3Qgb2Ygbm9kZXMgdG8gcmVkcmF3LiBVc2VkIG9ubHkgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9ub2RlX2NoYW5nZWQob2JqIFssIGNhbGxiYWNrXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICovXG5cdFx0X25vZGVfY2hhbmdlZCA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcbiAgICAgIGlmIChvYmogJiYgJC5pbkFycmF5KG9iai5pZCwgdGhpcy5fbW9kZWwuY2hhbmdlZCkgPT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuX21vZGVsLmNoYW5nZWQucHVzaChvYmouaWQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogYXBwZW5kcyBIVE1MIGNvbnRlbnQgdG8gdGhlIHRyZWUuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9hcHBlbmRfaHRtbF9kYXRhKG9iaiwgZGF0YSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGFwcGVuZCB0b1xuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gZGF0YSB0aGUgSFRNTCBzdHJpbmcgdG8gcGFyc2UgYW5kIGFwcGVuZFxuXHRcdCAqIEB0cmlnZ2VyIG1vZGVsLmpzdHJlZSwgY2hhbmdlZC5qc3RyZWVcblx0XHQgKi9cblx0XHRfYXBwZW5kX2h0bWxfZGF0YSA6IGZ1bmN0aW9uIChkb20sIGRhdGEsIGNiKSB7XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKGRvbSk7XG5cdFx0XHRkb20uY2hpbGRyZW4gPSBbXTtcblx0XHRcdGRvbS5jaGlsZHJlbl9kID0gW107XG5cdFx0XHR2YXIgZGF0ID0gZGF0YS5pcygndWwnKSA/IGRhdGEuY2hpbGRyZW4oKSA6IGRhdGEsXG5cdFx0XHRcdHBhciA9IGRvbS5pZCxcblx0XHRcdFx0Y2hkID0gW10sXG5cdFx0XHRcdGRwYyA9IFtdLFxuXHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0cCA9IG1bcGFyXSxcblx0XHRcdFx0cyA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5sZW5ndGgsXG5cdFx0XHRcdHRtcCwgaSwgajtcblx0XHRcdGRhdC5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0dG1wID0gdGhpcy5fcGFyc2VfbW9kZWxfZnJvbV9odG1sKCQodiksIHBhciwgcC5wYXJlbnRzLmNvbmNhdCgpKTtcblx0XHRcdFx0aWYodG1wKSB7XG5cdFx0XHRcdFx0Y2hkLnB1c2godG1wKTtcblx0XHRcdFx0XHRkcGMucHVzaCh0bXApO1xuXHRcdFx0XHRcdGlmKG1bdG1wXS5jaGlsZHJlbl9kLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0ZHBjID0gZHBjLmNvbmNhdChtW3RtcF0uY2hpbGRyZW5fZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRwLmNoaWxkcmVuID0gY2hkO1xuXHRcdFx0cC5jaGlsZHJlbl9kID0gZHBjO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRtW3AucGFyZW50c1tpXV0uY2hpbGRyZW5fZCA9IG1bcC5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kLmNvbmNhdChkcGMpO1xuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBuZXcgZGF0YSBpcyBpbnNlcnRlZCB0byB0aGUgdHJlZSBtb2RlbFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBtb2RlbC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIGFuIGFycmF5IG9mIG5vZGUgSURzXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyZW50IHRoZSBwYXJlbnQgSUQgb2YgdGhlIG5vZGVzXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignbW9kZWwnLCB7IFwibm9kZXNcIiA6IGRwYywgJ3BhcmVudCcgOiBwYXIgfSk7XG5cdFx0XHRpZihwYXIgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0dGhpcy5fbm9kZV9jaGFuZ2VkKHBhcik7XG5cdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkuY2hpbGRyZW4oJy5qc3RyZWUtaW5pdGlhbC1ub2RlJykucmVtb3ZlKCk7XG5cdFx0XHRcdHRoaXMucmVkcmF3KHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmxlbmd0aCAhPT0gcykge1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ21vZGVsJywgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCB9KTtcblx0XHRcdH1cblx0XHRcdGNiLmNhbGwodGhpcywgdHJ1ZSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBhcHBlbmRzIEpTT04gY29udGVudCB0byB0aGUgdHJlZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX2FwcGVuZF9qc29uX2RhdGEob2JqLCBkYXRhKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGUgdG8gYXBwZW5kIHRvXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBkYXRhIHRoZSBKU09OIG9iamVjdCB0byBwYXJzZSBhbmQgYXBwZW5kXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gZm9yY2VfcHJvY2Vzc2luZyBpbnRlcm5hbCBwYXJhbSAtIGRvIG5vdCBzZXRcblx0XHQgKiBAdHJpZ2dlciBtb2RlbC5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICovXG5cdFx0X2FwcGVuZF9qc29uX2RhdGEgOiBmdW5jdGlvbiAoZG9tLCBkYXRhLCBjYiwgZm9yY2VfcHJvY2Vzc2luZykge1xuXHRcdFx0aWYodGhpcy5lbGVtZW50ID09PSBudWxsKSB7IHJldHVybjsgfVxuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShkb20pO1xuXHRcdFx0ZG9tLmNoaWxkcmVuID0gW107XG5cdFx0XHRkb20uY2hpbGRyZW5fZCA9IFtdO1xuXHRcdFx0Ly8gKiUkQCEhIVxuXHRcdFx0aWYoZGF0YS5kKSB7XG5cdFx0XHRcdGRhdGEgPSBkYXRhLmQ7XG5cdFx0XHRcdGlmKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0ZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKCEkLmlzQXJyYXkoZGF0YSkpIHsgZGF0YSA9IFtkYXRhXTsgfVxuXHRcdFx0dmFyIHcgPSBudWxsLFxuXHRcdFx0XHRhcmdzID0ge1xuXHRcdFx0XHRcdCdkZidcdDogdGhpcy5fbW9kZWwuZGVmYXVsdF9zdGF0ZSxcblx0XHRcdFx0XHQnZGF0J1x0OiBkYXRhLFxuXHRcdFx0XHRcdCdwYXInXHQ6IGRvbS5pZCxcblx0XHRcdFx0XHQnbSdcdFx0OiB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRcdCd0X2lkJ1x0OiB0aGlzLl9pZCxcblx0XHRcdFx0XHQndF9jbnQnXHQ6IHRoaXMuX2NudCxcblx0XHRcdFx0XHQnc2VsJ1x0OiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWRcblx0XHRcdFx0fSxcblx0XHRcdFx0aW5zdCA9IHRoaXMsXG5cdFx0XHRcdGZ1bmMgPSBmdW5jdGlvbiAoZGF0YSwgdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0aWYoZGF0YS5kYXRhKSB7IGRhdGEgPSBkYXRhLmRhdGE7IH1cblx0XHRcdFx0XHR2YXIgZGF0ID0gZGF0YS5kYXQsXG5cdFx0XHRcdFx0XHRwYXIgPSBkYXRhLnBhcixcblx0XHRcdFx0XHRcdGNoZCA9IFtdLFxuXHRcdFx0XHRcdFx0ZHBjID0gW10sXG5cdFx0XHRcdFx0XHRhZGQgPSBbXSxcblx0XHRcdFx0XHRcdGRmID0gZGF0YS5kZixcblx0XHRcdFx0XHRcdHRfaWQgPSBkYXRhLnRfaWQsXG5cdFx0XHRcdFx0XHR0X2NudCA9IGRhdGEudF9jbnQsXG5cdFx0XHRcdFx0XHRtID0gZGF0YS5tLFxuXHRcdFx0XHRcdFx0cCA9IG1bcGFyXSxcblx0XHRcdFx0XHRcdHNlbCA9IGRhdGEuc2VsLFxuXHRcdFx0XHRcdFx0dG1wLCBpLCBqLCByc2x0LFxuXHRcdFx0XHRcdFx0cGFyc2VfZmxhdCA9IGZ1bmN0aW9uIChkLCBwLCBwcykge1xuXHRcdFx0XHRcdFx0XHRpZighcHMpIHsgcHMgPSBbXTsgfVxuXHRcdFx0XHRcdFx0XHRlbHNlIHsgcHMgPSBwcy5jb25jYXQoKTsgfVxuXHRcdFx0XHRcdFx0XHRpZihwKSB7IHBzLnVuc2hpZnQocCk7IH1cblx0XHRcdFx0XHRcdFx0dmFyIHRpZCA9IGQuaWQudG9TdHJpbmcoKSxcblx0XHRcdFx0XHRcdFx0XHRpLCBqLCBjLCBlLFxuXHRcdFx0XHRcdFx0XHRcdHRtcCA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdGlkXHRcdFx0OiB0aWQsXG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXh0XHRcdDogZC50ZXh0IHx8ICcnLFxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvblx0XHQ6IGQuaWNvbiAhPT0gdW5kZWZpbmVkID8gZC5pY29uIDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudFx0XHQ6IHAsXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXJlbnRzXHRcdDogcHMsXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGlsZHJlblx0OiBkLmNoaWxkcmVuIHx8IFtdLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZFx0OiBkLmNoaWxkcmVuX2QgfHwgW10sXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhXHRcdDogZC5kYXRhLFxuXHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVcdFx0OiB7IH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRsaV9hdHRyXHRcdDogeyBpZCA6IGZhbHNlIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRhX2F0dHJcdFx0OiB7IGhyZWYgOiAnIycgfSxcblx0XHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsXHQ6IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0Zm9yKGkgaW4gZGYpIHtcblx0XHRcdFx0XHRcdFx0XHRpZihkZi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZGZbaV07XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5kYXRhICYmIGQuZGF0YS5qc3RyZWUgJiYgZC5kYXRhLmpzdHJlZS5pY29uKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmljb24gPSBkLmRhdGEuanN0cmVlLmljb247XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYodG1wLmljb24gPT09IHVuZGVmaW5lZCB8fCB0bXAuaWNvbiA9PT0gbnVsbCB8fCB0bXAuaWNvbiA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5pY29uID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5kYXRhID0gZC5kYXRhO1xuXHRcdFx0XHRcdFx0XHRcdGlmKGQuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZvcihpIGluIGQuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoZC5kYXRhLmpzdHJlZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGQuZGF0YS5qc3RyZWVbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5zdGF0ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgaW4gZC5zdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoZC5zdGF0ZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkLnN0YXRlW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIHR5cGVvZiBkLmxpX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChpIGluIGQubGlfYXR0cikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoZC5saV9hdHRyLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5saV9hdHRyW2ldID0gZC5saV9hdHRyW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZighdG1wLmxpX2F0dHIuaWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAubGlfYXR0ci5pZCA9IHRpZDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIHR5cGVvZiBkLmFfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgaW4gZC5hX2F0dHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGQuYV9hdHRyLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5hX2F0dHJbaV0gPSBkLmFfYXR0cltpXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmNoaWxkcmVuICYmIGQuY2hpbGRyZW4gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuc3RhdGUubG9hZGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuID0gW107XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSBbXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRtW3RtcC5pZF0gPSB0bXA7XG5cdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRjID0gcGFyc2VfZmxhdChtW3RtcC5jaGlsZHJlbltpXV0sIHRtcC5pZCwgcHMpO1xuXHRcdFx0XHRcdFx0XHRcdGUgPSBtW2NdO1xuXHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbl9kLnB1c2goYyk7XG5cdFx0XHRcdFx0XHRcdFx0aWYoZS5jaGlsZHJlbl9kLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSB0bXAuY2hpbGRyZW5fZC5jb25jYXQoZS5jaGlsZHJlbl9kKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGQuZGF0YTtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIGQuY2hpbGRyZW47XG5cdFx0XHRcdFx0XHRcdG1bdG1wLmlkXS5vcmlnaW5hbCA9IGQ7XG5cdFx0XHRcdFx0XHRcdGlmKHRtcC5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHRcdFx0XHRcdGFkZC5wdXNoKHRtcC5pZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRtcC5pZDtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRwYXJzZV9uZXN0ID0gZnVuY3Rpb24gKGQsIHAsIHBzKSB7XG5cdFx0XHRcdFx0XHRcdGlmKCFwcykgeyBwcyA9IFtdOyB9XG5cdFx0XHRcdFx0XHRcdGVsc2UgeyBwcyA9IHBzLmNvbmNhdCgpOyB9XG5cdFx0XHRcdFx0XHRcdGlmKHApIHsgcHMudW5zaGlmdChwKTsgfVxuXHRcdFx0XHRcdFx0XHR2YXIgdGlkID0gZmFsc2UsIGksIGosIGMsIGUsIHRtcDtcblx0XHRcdFx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdFx0XHRcdHRpZCA9ICdqJyArIHRfaWQgKyAnXycgKyAoKyt0X2NudCk7XG5cdFx0XHRcdFx0XHRcdH0gd2hpbGUobVt0aWRdKTtcblxuXHRcdFx0XHRcdFx0XHR0bXAgPSB7XG5cdFx0XHRcdFx0XHRcdFx0aWRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdHRleHRcdFx0OiB0eXBlb2YgZCA9PT0gJ3N0cmluZycgPyBkIDogJycsXG5cdFx0XHRcdFx0XHRcdFx0aWNvblx0XHQ6IHR5cGVvZiBkID09PSAnb2JqZWN0JyAmJiBkLmljb24gIT09IHVuZGVmaW5lZCA/IGQuaWNvbiA6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50XHRcdDogcCxcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnRzXHRcdDogcHMsXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5cdDogW10sXG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5fZFx0OiBbXSxcblx0XHRcdFx0XHRcdFx0XHRkYXRhXHRcdDogbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRzdGF0ZVx0XHQ6IHsgfSxcblx0XHRcdFx0XHRcdFx0XHRsaV9hdHRyXHRcdDogeyBpZCA6IGZhbHNlIH0sXG5cdFx0XHRcdFx0XHRcdFx0YV9hdHRyXHRcdDogeyBocmVmIDogJyMnIH0sXG5cdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxcdDogZmFsc2Vcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0Zm9yKGkgaW4gZGYpIHtcblx0XHRcdFx0XHRcdFx0XHRpZihkZi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZGZbaV07XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5pZCkgeyB0bXAuaWQgPSBkLmlkLnRvU3RyaW5nKCk7IH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLnRleHQpIHsgdG1wLnRleHQgPSBkLnRleHQ7IH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmRhdGEgJiYgZC5kYXRhLmpzdHJlZSAmJiBkLmRhdGEuanN0cmVlLmljb24pIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuaWNvbiA9IGQuZGF0YS5qc3RyZWUuaWNvbjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZih0bXAuaWNvbiA9PT0gdW5kZWZpbmVkIHx8IHRtcC5pY29uID09PSBudWxsIHx8IHRtcC5pY29uID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmljb24gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5kYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmRhdGEgPSBkLmRhdGE7XG5cdFx0XHRcdFx0XHRcdFx0aWYoZC5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgaW4gZC5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihkLmRhdGEuanN0cmVlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZC5kYXRhLmpzdHJlZVtpXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihkICYmIHR5cGVvZiBkLnN0YXRlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAoaSBpbiBkLnN0YXRlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkLnN0YXRlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGQuc3RhdGVbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgdHlwZW9mIGQubGlfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgaW4gZC5saV9hdHRyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkLmxpX2F0dHIuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmxpX2F0dHJbaV0gPSBkLmxpX2F0dHJbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKHRtcC5saV9hdHRyLmlkICYmICF0bXAuaWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuaWQgPSB0bXAubGlfYXR0ci5pZC50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKCF0bXAuaWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuaWQgPSB0aWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoIXRtcC5saV9hdHRyLmlkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmxpX2F0dHIuaWQgPSB0bXAuaWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5hX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChpIGluIGQuYV9hdHRyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihkLmFfYXR0ci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuYV9hdHRyW2ldID0gZC5hX2F0dHJbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGQgJiYgZC5jaGlsZHJlbiAmJiBkLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGQuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjID0gcGFyc2VfbmVzdChkLmNoaWxkcmVuW2ldLCB0bXAuaWQsIHBzKTtcblx0XHRcdFx0XHRcdFx0XHRcdGUgPSBtW2NdO1xuXHRcdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuLnB1c2goYyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihlLmNoaWxkcmVuX2QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gdG1wLmNoaWxkcmVuX2QuY29uY2F0KGUuY2hpbGRyZW5fZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gdG1wLmNoaWxkcmVuX2QuY29uY2F0KHRtcC5jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmNoaWxkcmVuICYmIGQuY2hpbGRyZW4gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAuc3RhdGUubG9hZGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuID0gW107XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSBbXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkZWxldGUgZC5kYXRhO1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgZC5jaGlsZHJlbjtcblx0XHRcdFx0XHRcdFx0dG1wLm9yaWdpbmFsID0gZDtcblx0XHRcdFx0XHRcdFx0bVt0bXAuaWRdID0gdG1wO1xuXHRcdFx0XHRcdFx0XHRpZih0bXAuc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRhZGQucHVzaCh0bXAuaWQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0bXAuaWQ7XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0aWYoZGF0Lmxlbmd0aCAmJiBkYXRbMF0uaWQgIT09IHVuZGVmaW5lZCAmJiBkYXRbMF0ucGFyZW50ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdC8vIEZsYXQgSlNPTiBzdXBwb3J0IChmb3IgZWFzeSBpbXBvcnQgZnJvbSBEQik6XG5cdFx0XHRcdFx0XHQvLyAxKSBjb252ZXJ0IHRvIG9iamVjdCAoZm9yZWFjaClcblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRhdC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aWYoIWRhdFtpXS5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0XHRcdGRhdFtpXS5jaGlsZHJlbiA9IFtdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKCFkYXRbaV0uc3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRbaV0uc3RhdGUgPSB7fTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRtW2RhdFtpXS5pZC50b1N0cmluZygpXSA9IGRhdFtpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vIDIpIHBvcHVsYXRlIGNoaWxkcmVuIChmb3JlYWNoKVxuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZGF0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRpZiAoIW1bZGF0W2ldLnBhcmVudC50b1N0cmluZygpXSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgaW5zdCAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aW5zdC5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAncGFyc2UnLCAncGx1Z2luJyA6ICdjb3JlJywgJ2lkJyA6ICdjb3JlXzA3JywgJ3JlYXNvbicgOiAnTm9kZSB3aXRoIGludmFsaWQgcGFyZW50JywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnaWQnIDogZGF0W2ldLmlkLnRvU3RyaW5nKCksICdwYXJlbnQnIDogZGF0W2ldLnBhcmVudC50b1N0cmluZygpIH0pIH07XG5cdFx0XHRcdFx0XHRcdFx0XHRpbnN0LnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbChpbnN0LCBpbnN0Ll9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0bVtkYXRbaV0ucGFyZW50LnRvU3RyaW5nKCldLmNoaWxkcmVuLnB1c2goZGF0W2ldLmlkLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHRcdFx0XHQvLyBwb3B1bGF0ZSBwYXJlbnQuY2hpbGRyZW5fZFxuXHRcdFx0XHRcdFx0XHRwLmNoaWxkcmVuX2QucHVzaChkYXRbaV0uaWQudG9TdHJpbmcoKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvLyAzKSBub3JtYWxpemUgJiYgcG9wdWxhdGUgcGFyZW50cyBhbmQgY2hpbGRyZW5fZCB3aXRoIHJlY3Vyc2lvblxuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0dG1wID0gcGFyc2VfZmxhdChtW3AuY2hpbGRyZW5baV1dLCBwYXIsIHAucGFyZW50cy5jb25jYXQoKSk7XG5cdFx0XHRcdFx0XHRcdGRwYy5wdXNoKHRtcCk7XG5cdFx0XHRcdFx0XHRcdGlmKG1bdG1wXS5jaGlsZHJlbl9kLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdGRwYyA9IGRwYy5jb25jYXQobVt0bXBdLmNoaWxkcmVuX2QpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLnBhcmVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdG1bcC5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kID0gbVtwLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QuY29uY2F0KGRwYyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvLyA/KSB0aHJlZV9zdGF0ZSBzZWxlY3Rpb24gLSBwLnN0YXRlLnNlbGVjdGVkICYmIHQgLSAoaWYgdGhyZWVfc3RhdGUgZm9yZWFjaChkYXQgPT4gY2gpIC0+IGZvcmVhY2gocGFyZW50cykgaWYocGFyZW50LnNlbGVjdGVkKSBjaGlsZC5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRyc2x0ID0ge1xuXHRcdFx0XHRcdFx0XHQnY250JyA6IHRfY250LFxuXHRcdFx0XHRcdFx0XHQnbW9kJyA6IG0sXG5cdFx0XHRcdFx0XHRcdCdzZWwnIDogc2VsLFxuXHRcdFx0XHRcdFx0XHQncGFyJyA6IHBhcixcblx0XHRcdFx0XHRcdFx0J2RwYycgOiBkcGMsXG5cdFx0XHRcdFx0XHRcdCdhZGQnIDogYWRkXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRhdC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0dG1wID0gcGFyc2VfbmVzdChkYXRbaV0sIHBhciwgcC5wYXJlbnRzLmNvbmNhdCgpKTtcblx0XHRcdFx0XHRcdFx0aWYodG1wKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2hkLnB1c2godG1wKTtcblx0XHRcdFx0XHRcdFx0XHRkcGMucHVzaCh0bXApO1xuXHRcdFx0XHRcdFx0XHRcdGlmKG1bdG1wXS5jaGlsZHJlbl9kLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZHBjID0gZHBjLmNvbmNhdChtW3RtcF0uY2hpbGRyZW5fZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRwLmNoaWxkcmVuID0gY2hkO1xuXHRcdFx0XHRcdFx0cC5jaGlsZHJlbl9kID0gZHBjO1xuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRtW3AucGFyZW50c1tpXV0uY2hpbGRyZW5fZCA9IG1bcC5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kLmNvbmNhdChkcGMpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cnNsdCA9IHtcblx0XHRcdFx0XHRcdFx0J2NudCcgOiB0X2NudCxcblx0XHRcdFx0XHRcdFx0J21vZCcgOiBtLFxuXHRcdFx0XHRcdFx0XHQnc2VsJyA6IHNlbCxcblx0XHRcdFx0XHRcdFx0J3BhcicgOiBwYXIsXG5cdFx0XHRcdFx0XHRcdCdkcGMnIDogZHBjLFxuXHRcdFx0XHRcdFx0XHQnYWRkJyA6IGFkZFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdy5kb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdHBvc3RNZXNzYWdlKHJzbHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiByc2x0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0cnNsdCA9IGZ1bmN0aW9uIChyc2x0LCB3b3JrZXIpIHtcblx0XHRcdFx0XHRpZih0aGlzLmVsZW1lbnQgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0dGhpcy5fY250ID0gcnNsdC5jbnQ7XG5cdFx0XHRcdFx0dmFyIGksIG0gPSB0aGlzLl9tb2RlbC5kYXRhO1xuXHRcdFx0XHRcdGZvciAoaSBpbiBtKSB7XG5cdFx0XHRcdFx0XHRpZiAobS5oYXNPd25Qcm9wZXJ0eShpKSAmJiBtW2ldLnN0YXRlICYmIG1baV0uc3RhdGUubG9hZGluZyAmJiByc2x0Lm1vZFtpXSkge1xuXHRcdFx0XHRcdFx0XHRyc2x0Lm1vZFtpXS5zdGF0ZS5sb2FkaW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YSA9IHJzbHQubW9kOyAvLyBicmVha3MgdGhlIHJlZmVyZW5jZSBpbiBsb2FkX25vZGUgLSBjYXJlZnVsXG5cblx0XHRcdFx0XHRpZih3b3JrZXIpIHtcblx0XHRcdFx0XHRcdHZhciBqLCBhID0gcnNsdC5hZGQsIHIgPSByc2x0LnNlbCwgcyA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5zbGljZSgpO1xuXHRcdFx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGE7XG5cdFx0XHRcdFx0XHQvLyBpZiBzZWxlY3Rpb24gd2FzIGNoYW5nZWQgd2hpbGUgY2FsY3VsYXRpbmcgaW4gd29ya2VyXG5cdFx0XHRcdFx0XHRpZihyLmxlbmd0aCAhPT0gcy5sZW5ndGggfHwgJC52YWthdGEuYXJyYXlfdW5pcXVlKHIuY29uY2F0KHMpKS5sZW5ndGggIT09IHIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGRlc2VsZWN0IG5vZGVzIHRoYXQgYXJlIG5vIGxvbmdlciBzZWxlY3RlZFxuXHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSByLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGlmKCQuaW5BcnJheShyW2ldLCBhKSA9PT0gLTEgJiYgJC5pbkFycmF5KHJbaV0sIHMpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bVtyW2ldXS5zdGF0ZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQvLyBzZWxlY3Qgbm9kZXMgdGhhdCB3ZXJlIHNlbGVjdGVkIGluIHRoZSBtZWFuIHRpbWVcblx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZigkLmluQXJyYXkoc1tpXSwgcikgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRtW3NbaV1dLnN0YXRlLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYocnNsdC5hZGQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuY29uY2F0KHJzbHQuYWRkKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ21vZGVsJywgeyBcIm5vZGVzXCIgOiByc2x0LmRwYywgJ3BhcmVudCcgOiByc2x0LnBhciB9KTtcblxuXHRcdFx0XHRcdGlmKHJzbHQucGFyICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9ub2RlX2NoYW5nZWQocnNsdC5wYXIpO1xuXHRcdFx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyB0aGlzLmdldF9jb250YWluZXJfdWwoKS5jaGlsZHJlbignLmpzdHJlZS1pbml0aWFsLW5vZGUnKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdHRoaXMucmVkcmF3KHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihyc2x0LmFkZC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgJ2FjdGlvbicgOiAnbW9kZWwnLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYi5jYWxsKHRoaXMsIHRydWUpO1xuXHRcdFx0XHR9O1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jb3JlLndvcmtlciAmJiB3aW5kb3cuQmxvYiAmJiB3aW5kb3cuVVJMICYmIHdpbmRvdy5Xb3JrZXIpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpZih0aGlzLl93cmsgPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3dyayA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKFxuXHRcdFx0XHRcdFx0XHRuZXcgd2luZG93LkJsb2IoXG5cdFx0XHRcdFx0XHRcdFx0WydzZWxmLm9ubWVzc2FnZSA9ICcgKyBmdW5jLnRvU3RyaW5nKCldLFxuXHRcdFx0XHRcdFx0XHRcdHt0eXBlOlwidGV4dC9qYXZhc2NyaXB0XCJ9XG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKCF0aGlzLl9kYXRhLmNvcmUud29ya2luZyB8fCBmb3JjZV9wcm9jZXNzaW5nKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUud29ya2luZyA9IHRydWU7XG5cdFx0XHRcdFx0XHR3ID0gbmV3IHdpbmRvdy5Xb3JrZXIodGhpcy5fd3JrKTtcblx0XHRcdFx0XHRcdHcub25tZXNzYWdlID0gJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRyc2x0LmNhbGwodGhpcywgZS5kYXRhLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0dHJ5IHsgdy50ZXJtaW5hdGUoKTsgdyA9IG51bGw7IH0gY2F0Y2goaWdub3JlKSB7IH1cblx0XHRcdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLndvcmtlcl9xdWV1ZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9hcHBlbmRfanNvbl9kYXRhLmFwcGx5KHRoaXMsIHRoaXMuX2RhdGEuY29yZS53b3JrZXJfcXVldWUuc2hpZnQoKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLndvcmtpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgdGhpcyk7XG5cdFx0XHRcdFx0XHRpZighYXJncy5wYXIpIHtcblx0XHRcdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLndvcmtlcl9xdWV1ZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9hcHBlbmRfanNvbl9kYXRhLmFwcGx5KHRoaXMsIHRoaXMuX2RhdGEuY29yZS53b3JrZXJfcXVldWUuc2hpZnQoKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLndvcmtpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHcucG9zdE1lc3NhZ2UoYXJncyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLndvcmtlcl9xdWV1ZS5wdXNoKFtkb20sIGRhdGEsIGNiLCB0cnVlXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoKGUpIHtcblx0XHRcdFx0XHRyc2x0LmNhbGwodGhpcywgZnVuYyhhcmdzKSwgZmFsc2UpO1xuXHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS53b3JrZXJfcXVldWUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9hcHBlbmRfanNvbl9kYXRhLmFwcGx5KHRoaXMsIHRoaXMuX2RhdGEuY29yZS53b3JrZXJfcXVldWUuc2hpZnQoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLndvcmtpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyc2x0LmNhbGwodGhpcywgZnVuYyhhcmdzKSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcGFyc2VzIGEgbm9kZSBmcm9tIGEgalF1ZXJ5IG9iamVjdCBhbmQgYXBwZW5kcyB0aGVtIHRvIHRoZSBpbiBtZW1vcnkgdHJlZSBtb2RlbC4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX3BhcnNlX21vZGVsX2Zyb21faHRtbChkIFssIHAsIHBzXSlcblx0XHQgKiBAcGFyYW0gIHtqUXVlcnl9IGQgdGhlIGpRdWVyeSBvYmplY3QgdG8gcGFyc2Vcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IHAgdGhlIHBhcmVudCBJRFxuXHRcdCAqIEBwYXJhbSAge0FycmF5fSBwcyBsaXN0IG9mIGFsbCBwYXJlbnRzXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSB0aGUgSUQgb2YgdGhlIG9iamVjdCBhZGRlZCB0byB0aGUgbW9kZWxcblx0XHQgKi9cblx0XHRfcGFyc2VfbW9kZWxfZnJvbV9odG1sIDogZnVuY3Rpb24gKGQsIHAsIHBzKSB7XG5cdFx0XHRpZighcHMpIHsgcHMgPSBbXTsgfVxuXHRcdFx0ZWxzZSB7IHBzID0gW10uY29uY2F0KHBzKTsgfVxuXHRcdFx0aWYocCkgeyBwcy51bnNoaWZ0KHApOyB9XG5cdFx0XHR2YXIgYywgZSwgbSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdGRhdGEgPSB7XG5cdFx0XHRcdFx0aWRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRcdHRleHRcdFx0OiBmYWxzZSxcblx0XHRcdFx0XHRpY29uXHRcdDogdHJ1ZSxcblx0XHRcdFx0XHRwYXJlbnRcdFx0OiBwLFxuXHRcdFx0XHRcdHBhcmVudHNcdFx0OiBwcyxcblx0XHRcdFx0XHRjaGlsZHJlblx0OiBbXSxcblx0XHRcdFx0XHRjaGlsZHJlbl9kXHQ6IFtdLFxuXHRcdFx0XHRcdGRhdGFcdFx0OiBudWxsLFxuXHRcdFx0XHRcdHN0YXRlXHRcdDogeyB9LFxuXHRcdFx0XHRcdGxpX2F0dHJcdFx0OiB7IGlkIDogZmFsc2UgfSxcblx0XHRcdFx0XHRhX2F0dHJcdFx0OiB7IGhyZWYgOiAnIycgfSxcblx0XHRcdFx0XHRvcmlnaW5hbFx0OiBmYWxzZVxuXHRcdFx0XHR9LCBpLCB0bXAsIHRpZDtcblx0XHRcdGZvcihpIGluIHRoaXMuX21vZGVsLmRlZmF1bHRfc3RhdGUpIHtcblx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGVmYXVsdF9zdGF0ZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdGRhdGEuc3RhdGVbaV0gPSB0aGlzLl9tb2RlbC5kZWZhdWx0X3N0YXRlW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSAkLnZha2F0YS5hdHRyaWJ1dGVzKGQsIHRydWUpO1xuXHRcdFx0JC5lYWNoKHRtcCwgZnVuY3Rpb24gKGksIHYpIHtcblx0XHRcdFx0diA9ICQudHJpbSh2KTtcblx0XHRcdFx0aWYoIXYubGVuZ3RoKSB7IHJldHVybiB0cnVlOyB9XG5cdFx0XHRcdGRhdGEubGlfYXR0cltpXSA9IHY7XG5cdFx0XHRcdGlmKGkgPT09ICdpZCcpIHtcblx0XHRcdFx0XHRkYXRhLmlkID0gdi50b1N0cmluZygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHRtcCA9IGQuY2hpbGRyZW4oJ2EnKS5maXJzdCgpO1xuXHRcdFx0aWYodG1wLmxlbmd0aCkge1xuXHRcdFx0XHR0bXAgPSAkLnZha2F0YS5hdHRyaWJ1dGVzKHRtcCwgdHJ1ZSk7XG5cdFx0XHRcdCQuZWFjaCh0bXAsIGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0diA9ICQudHJpbSh2KTtcblx0XHRcdFx0XHRpZih2Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0ZGF0YS5hX2F0dHJbaV0gPSB2O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBkLmNoaWxkcmVuKFwiYVwiKS5maXJzdCgpLmxlbmd0aCA/IGQuY2hpbGRyZW4oXCJhXCIpLmZpcnN0KCkuY2xvbmUoKSA6IGQuY2xvbmUoKTtcblx0XHRcdHRtcC5jaGlsZHJlbihcImlucywgaSwgdWxcIikucmVtb3ZlKCk7XG5cdFx0XHR0bXAgPSB0bXAuaHRtbCgpO1xuXHRcdFx0dG1wID0gJCgnPGRpdiAvPicpLmh0bWwodG1wKTtcblx0XHRcdGRhdGEudGV4dCA9IHRoaXMuc2V0dGluZ3MuY29yZS5mb3JjZV90ZXh0ID8gdG1wLnRleHQoKSA6IHRtcC5odG1sKCk7XG5cdFx0XHR0bXAgPSBkLmRhdGEoKTtcblx0XHRcdGRhdGEuZGF0YSA9IHRtcCA/ICQuZXh0ZW5kKHRydWUsIHt9LCB0bXApIDogbnVsbDtcblx0XHRcdGRhdGEuc3RhdGUub3BlbmVkID0gZC5oYXNDbGFzcygnanN0cmVlLW9wZW4nKTtcblx0XHRcdGRhdGEuc3RhdGUuc2VsZWN0ZWQgPSBkLmNoaWxkcmVuKCdhJykuaGFzQ2xhc3MoJ2pzdHJlZS1jbGlja2VkJyk7XG5cdFx0XHRkYXRhLnN0YXRlLmRpc2FibGVkID0gZC5jaGlsZHJlbignYScpLmhhc0NsYXNzKCdqc3RyZWUtZGlzYWJsZWQnKTtcblx0XHRcdGlmKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdGZvcihpIGluIGRhdGEuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRpZihkYXRhLmRhdGEuanN0cmVlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRkYXRhLnN0YXRlW2ldID0gZGF0YS5kYXRhLmpzdHJlZVtpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRtcCA9IGQuY2hpbGRyZW4oXCJhXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS10aGVtZWljb25cIik7XG5cdFx0XHRpZih0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdGRhdGEuaWNvbiA9IHRtcC5oYXNDbGFzcygnanN0cmVlLXRoZW1laWNvbi1oaWRkZW4nKSA/IGZhbHNlIDogdG1wLmF0dHIoJ3JlbCcpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZGF0YS5zdGF0ZS5pY29uICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0ZGF0YS5pY29uID0gZGF0YS5zdGF0ZS5pY29uO1xuXHRcdFx0fVxuXHRcdFx0aWYoZGF0YS5pY29uID09PSB1bmRlZmluZWQgfHwgZGF0YS5pY29uID09PSBudWxsIHx8IGRhdGEuaWNvbiA9PT0gXCJcIikge1xuXHRcdFx0XHRkYXRhLmljb24gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0dG1wID0gZC5jaGlsZHJlbihcInVsXCIpLmNoaWxkcmVuKFwibGlcIik7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdHRpZCA9ICdqJyArIHRoaXMuX2lkICsgJ18nICsgKCsrdGhpcy5fY250KTtcblx0XHRcdH0gd2hpbGUobVt0aWRdKTtcblx0XHRcdGRhdGEuaWQgPSBkYXRhLmxpX2F0dHIuaWQgPyBkYXRhLmxpX2F0dHIuaWQudG9TdHJpbmcoKSA6IHRpZDtcblx0XHRcdGlmKHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0dG1wLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdGMgPSB0aGlzLl9wYXJzZV9tb2RlbF9mcm9tX2h0bWwoJCh2KSwgZGF0YS5pZCwgcHMpO1xuXHRcdFx0XHRcdGUgPSB0aGlzLl9tb2RlbC5kYXRhW2NdO1xuXHRcdFx0XHRcdGRhdGEuY2hpbGRyZW4ucHVzaChjKTtcblx0XHRcdFx0XHRpZihlLmNoaWxkcmVuX2QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRkYXRhLmNoaWxkcmVuX2QgPSBkYXRhLmNoaWxkcmVuX2QuY29uY2F0KGUuY2hpbGRyZW5fZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdGRhdGEuY2hpbGRyZW5fZCA9IGRhdGEuY2hpbGRyZW5fZC5jb25jYXQoZGF0YS5jaGlsZHJlbik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYoZC5oYXNDbGFzcygnanN0cmVlLWNsb3NlZCcpKSB7XG5cdFx0XHRcdFx0ZGF0YS5zdGF0ZS5sb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoZGF0YS5saV9hdHRyWydjbGFzcyddKSB7XG5cdFx0XHRcdGRhdGEubGlfYXR0clsnY2xhc3MnXSA9IGRhdGEubGlfYXR0clsnY2xhc3MnXS5yZXBsYWNlKCdqc3RyZWUtY2xvc2VkJywnJykucmVwbGFjZSgnanN0cmVlLW9wZW4nLCcnKTtcblx0XHRcdH1cblx0XHRcdGlmKGRhdGEuYV9hdHRyWydjbGFzcyddKSB7XG5cdFx0XHRcdGRhdGEuYV9hdHRyWydjbGFzcyddID0gZGF0YS5hX2F0dHJbJ2NsYXNzJ10ucmVwbGFjZSgnanN0cmVlLWNsaWNrZWQnLCcnKS5yZXBsYWNlKCdqc3RyZWUtZGlzYWJsZWQnLCcnKTtcblx0XHRcdH1cblx0XHRcdG1bZGF0YS5pZF0gPSBkYXRhO1xuXHRcdFx0aWYoZGF0YS5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQucHVzaChkYXRhLmlkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkYXRhLmlkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcGFyc2VzIGEgbm9kZSBmcm9tIGEgSlNPTiBvYmplY3QgKHVzZWQgd2hlbiBkZWFsaW5nIHdpdGggZmxhdCBkYXRhLCB3aGljaCBoYXMgbm8gbmVzdGluZyBvZiBjaGlsZHJlbiwgYnV0IGhhcyBpZCBhbmQgcGFyZW50IHByb3BlcnRpZXMpIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBpbiBtZW1vcnkgdHJlZSBtb2RlbC4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX3BhcnNlX21vZGVsX2Zyb21fZmxhdF9qc29uKGQgWywgcCwgcHNdKVxuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gZCB0aGUgSlNPTiBvYmplY3QgdG8gcGFyc2Vcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IHAgdGhlIHBhcmVudCBJRFxuXHRcdCAqIEBwYXJhbSAge0FycmF5fSBwcyBsaXN0IG9mIGFsbCBwYXJlbnRzXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSB0aGUgSUQgb2YgdGhlIG9iamVjdCBhZGRlZCB0byB0aGUgbW9kZWxcblx0XHQgKi9cblx0XHRfcGFyc2VfbW9kZWxfZnJvbV9mbGF0X2pzb24gOiBmdW5jdGlvbiAoZCwgcCwgcHMpIHtcblx0XHRcdGlmKCFwcykgeyBwcyA9IFtdOyB9XG5cdFx0XHRlbHNlIHsgcHMgPSBwcy5jb25jYXQoKTsgfVxuXHRcdFx0aWYocCkgeyBwcy51bnNoaWZ0KHApOyB9XG5cdFx0XHR2YXIgdGlkID0gZC5pZC50b1N0cmluZygpLFxuXHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0ZGYgPSB0aGlzLl9tb2RlbC5kZWZhdWx0X3N0YXRlLFxuXHRcdFx0XHRpLCBqLCBjLCBlLFxuXHRcdFx0XHR0bXAgPSB7XG5cdFx0XHRcdFx0aWRcdFx0XHQ6IHRpZCxcblx0XHRcdFx0XHR0ZXh0XHRcdDogZC50ZXh0IHx8ICcnLFxuXHRcdFx0XHRcdGljb25cdFx0OiBkLmljb24gIT09IHVuZGVmaW5lZCA/IGQuaWNvbiA6IHRydWUsXG5cdFx0XHRcdFx0cGFyZW50XHRcdDogcCxcblx0XHRcdFx0XHRwYXJlbnRzXHRcdDogcHMsXG5cdFx0XHRcdFx0Y2hpbGRyZW5cdDogZC5jaGlsZHJlbiB8fCBbXSxcblx0XHRcdFx0XHRjaGlsZHJlbl9kXHQ6IGQuY2hpbGRyZW5fZCB8fCBbXSxcblx0XHRcdFx0XHRkYXRhXHRcdDogZC5kYXRhLFxuXHRcdFx0XHRcdHN0YXRlXHRcdDogeyB9LFxuXHRcdFx0XHRcdGxpX2F0dHJcdFx0OiB7IGlkIDogZmFsc2UgfSxcblx0XHRcdFx0XHRhX2F0dHJcdFx0OiB7IGhyZWYgOiAnIycgfSxcblx0XHRcdFx0XHRvcmlnaW5hbFx0OiBmYWxzZVxuXHRcdFx0XHR9O1xuXHRcdFx0Zm9yKGkgaW4gZGYpIHtcblx0XHRcdFx0aWYoZGYuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkZltpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiBkLmRhdGEgJiYgZC5kYXRhLmpzdHJlZSAmJiBkLmRhdGEuanN0cmVlLmljb24pIHtcblx0XHRcdFx0dG1wLmljb24gPSBkLmRhdGEuanN0cmVlLmljb247XG5cdFx0XHR9XG5cdFx0XHRpZih0bXAuaWNvbiA9PT0gdW5kZWZpbmVkIHx8IHRtcC5pY29uID09PSBudWxsIHx8IHRtcC5pY29uID09PSBcIlwiKSB7XG5cdFx0XHRcdHRtcC5pY29uID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgZC5kYXRhKSB7XG5cdFx0XHRcdHRtcC5kYXRhID0gZC5kYXRhO1xuXHRcdFx0XHRpZihkLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0Zm9yKGkgaW4gZC5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdFx0aWYoZC5kYXRhLmpzdHJlZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkLmRhdGEuanN0cmVlW2ldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5zdGF0ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChpIGluIGQuc3RhdGUpIHtcblx0XHRcdFx0XHRpZihkLnN0YXRlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHR0bXAuc3RhdGVbaV0gPSBkLnN0YXRlW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiB0eXBlb2YgZC5saV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGkgaW4gZC5saV9hdHRyKSB7XG5cdFx0XHRcdFx0aWYoZC5saV9hdHRyLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHR0bXAubGlfYXR0cltpXSA9IGQubGlfYXR0cltpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKCF0bXAubGlfYXR0ci5pZCkge1xuXHRcdFx0XHR0bXAubGlfYXR0ci5pZCA9IHRpZDtcblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgdHlwZW9mIGQuYV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGkgaW4gZC5hX2F0dHIpIHtcblx0XHRcdFx0XHRpZihkLmFfYXR0ci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0dG1wLmFfYXR0cltpXSA9IGQuYV9hdHRyW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiBkLmNoaWxkcmVuICYmIGQuY2hpbGRyZW4gPT09IHRydWUpIHtcblx0XHRcdFx0dG1wLnN0YXRlLmxvYWRlZCA9IGZhbHNlO1xuXHRcdFx0XHR0bXAuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSBbXTtcblx0XHRcdH1cblx0XHRcdG1bdG1wLmlkXSA9IHRtcDtcblx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0YyA9IHRoaXMuX3BhcnNlX21vZGVsX2Zyb21fZmxhdF9qc29uKG1bdG1wLmNoaWxkcmVuW2ldXSwgdG1wLmlkLCBwcyk7XG5cdFx0XHRcdGUgPSBtW2NdO1xuXHRcdFx0XHR0bXAuY2hpbGRyZW5fZC5wdXNoKGMpO1xuXHRcdFx0XHRpZihlLmNoaWxkcmVuX2QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSB0bXAuY2hpbGRyZW5fZC5jb25jYXQoZS5jaGlsZHJlbl9kKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZGVsZXRlIGQuZGF0YTtcblx0XHRcdGRlbGV0ZSBkLmNoaWxkcmVuO1xuXHRcdFx0bVt0bXAuaWRdLm9yaWdpbmFsID0gZDtcblx0XHRcdGlmKHRtcC5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQucHVzaCh0bXAuaWQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRtcC5pZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHBhcnNlcyBhIG5vZGUgZnJvbSBhIEpTT04gb2JqZWN0IGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBpbiBtZW1vcnkgdHJlZSBtb2RlbC4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgX3BhcnNlX21vZGVsX2Zyb21fanNvbihkIFssIHAsIHBzXSlcblx0XHQgKiBAcGFyYW0gIHtPYmplY3R9IGQgdGhlIEpTT04gb2JqZWN0IHRvIHBhcnNlXG5cdFx0ICogQHBhcmFtICB7U3RyaW5nfSBwIHRoZSBwYXJlbnQgSURcblx0XHQgKiBAcGFyYW0gIHtBcnJheX0gcHMgbGlzdCBvZiBhbGwgcGFyZW50c1xuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gdGhlIElEIG9mIHRoZSBvYmplY3QgYWRkZWQgdG8gdGhlIG1vZGVsXG5cdFx0ICovXG5cdFx0X3BhcnNlX21vZGVsX2Zyb21fanNvbiA6IGZ1bmN0aW9uIChkLCBwLCBwcykge1xuXHRcdFx0aWYoIXBzKSB7IHBzID0gW107IH1cblx0XHRcdGVsc2UgeyBwcyA9IHBzLmNvbmNhdCgpOyB9XG5cdFx0XHRpZihwKSB7IHBzLnVuc2hpZnQocCk7IH1cblx0XHRcdHZhciB0aWQgPSBmYWxzZSwgaSwgaiwgYywgZSwgbSA9IHRoaXMuX21vZGVsLmRhdGEsIGRmID0gdGhpcy5fbW9kZWwuZGVmYXVsdF9zdGF0ZSwgdG1wO1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHR0aWQgPSAnaicgKyB0aGlzLl9pZCArICdfJyArICgrK3RoaXMuX2NudCk7XG5cdFx0XHR9IHdoaWxlKG1bdGlkXSk7XG5cblx0XHRcdHRtcCA9IHtcblx0XHRcdFx0aWRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHR0ZXh0XHRcdDogdHlwZW9mIGQgPT09ICdzdHJpbmcnID8gZCA6ICcnLFxuXHRcdFx0XHRpY29uXHRcdDogdHlwZW9mIGQgPT09ICdvYmplY3QnICYmIGQuaWNvbiAhPT0gdW5kZWZpbmVkID8gZC5pY29uIDogdHJ1ZSxcblx0XHRcdFx0cGFyZW50XHRcdDogcCxcblx0XHRcdFx0cGFyZW50c1x0XHQ6IHBzLFxuXHRcdFx0XHRjaGlsZHJlblx0OiBbXSxcblx0XHRcdFx0Y2hpbGRyZW5fZFx0OiBbXSxcblx0XHRcdFx0ZGF0YVx0XHQ6IG51bGwsXG5cdFx0XHRcdHN0YXRlXHRcdDogeyB9LFxuXHRcdFx0XHRsaV9hdHRyXHRcdDogeyBpZCA6IGZhbHNlIH0sXG5cdFx0XHRcdGFfYXR0clx0XHQ6IHsgaHJlZiA6ICcjJyB9LFxuXHRcdFx0XHRvcmlnaW5hbFx0OiBmYWxzZVxuXHRcdFx0fTtcblx0XHRcdGZvcihpIGluIGRmKSB7XG5cdFx0XHRcdGlmKGRmLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gZGZbaV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgZC5pZCkgeyB0bXAuaWQgPSBkLmlkLnRvU3RyaW5nKCk7IH1cblx0XHRcdGlmKGQgJiYgZC50ZXh0KSB7IHRtcC50ZXh0ID0gZC50ZXh0OyB9XG5cdFx0XHRpZihkICYmIGQuZGF0YSAmJiBkLmRhdGEuanN0cmVlICYmIGQuZGF0YS5qc3RyZWUuaWNvbikge1xuXHRcdFx0XHR0bXAuaWNvbiA9IGQuZGF0YS5qc3RyZWUuaWNvbjtcblx0XHRcdH1cblx0XHRcdGlmKHRtcC5pY29uID09PSB1bmRlZmluZWQgfHwgdG1wLmljb24gPT09IG51bGwgfHwgdG1wLmljb24gPT09IFwiXCIpIHtcblx0XHRcdFx0dG1wLmljb24gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYoZCAmJiBkLmRhdGEpIHtcblx0XHRcdFx0dG1wLmRhdGEgPSBkLmRhdGE7XG5cdFx0XHRcdGlmKGQuZGF0YS5qc3RyZWUpIHtcblx0XHRcdFx0XHRmb3IoaSBpbiBkLmRhdGEuanN0cmVlKSB7XG5cdFx0XHRcdFx0XHRpZihkLmRhdGEuanN0cmVlLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGQuZGF0YS5qc3RyZWVbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIHR5cGVvZiBkLnN0YXRlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGkgaW4gZC5zdGF0ZSkge1xuXHRcdFx0XHRcdGlmKGQuc3RhdGUuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdHRtcC5zdGF0ZVtpXSA9IGQuc3RhdGVbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIHR5cGVvZiBkLmxpX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoaSBpbiBkLmxpX2F0dHIpIHtcblx0XHRcdFx0XHRpZihkLmxpX2F0dHIuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdHRtcC5saV9hdHRyW2ldID0gZC5saV9hdHRyW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYodG1wLmxpX2F0dHIuaWQgJiYgIXRtcC5pZCkge1xuXHRcdFx0XHR0bXAuaWQgPSB0bXAubGlfYXR0ci5pZC50b1N0cmluZygpO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXRtcC5pZCkge1xuXHRcdFx0XHR0bXAuaWQgPSB0aWQ7XG5cdFx0XHR9XG5cdFx0XHRpZighdG1wLmxpX2F0dHIuaWQpIHtcblx0XHRcdFx0dG1wLmxpX2F0dHIuaWQgPSB0bXAuaWQ7XG5cdFx0XHR9XG5cdFx0XHRpZihkICYmIHR5cGVvZiBkLmFfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChpIGluIGQuYV9hdHRyKSB7XG5cdFx0XHRcdFx0aWYoZC5hX2F0dHIuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdHRtcC5hX2F0dHJbaV0gPSBkLmFfYXR0cltpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgZC5jaGlsZHJlbiAmJiBkLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGMgPSB0aGlzLl9wYXJzZV9tb2RlbF9mcm9tX2pzb24oZC5jaGlsZHJlbltpXSwgdG1wLmlkLCBwcyk7XG5cdFx0XHRcdFx0ZSA9IG1bY107XG5cdFx0XHRcdFx0dG1wLmNoaWxkcmVuLnB1c2goYyk7XG5cdFx0XHRcdFx0aWYoZS5jaGlsZHJlbl9kLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSB0bXAuY2hpbGRyZW5fZC5jb25jYXQoZS5jaGlsZHJlbl9kKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dG1wLmNoaWxkcmVuX2QgPSB0bXAuY2hpbGRyZW4uY29uY2F0KHRtcC5jaGlsZHJlbl9kKTtcblx0XHRcdH1cblx0XHRcdGlmKGQgJiYgZC5jaGlsZHJlbiAmJiBkLmNoaWxkcmVuID09PSB0cnVlKSB7XG5cdFx0XHRcdHRtcC5zdGF0ZS5sb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0dG1wLmNoaWxkcmVuID0gW107XG5cdFx0XHRcdHRtcC5jaGlsZHJlbl9kID0gW107XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgZC5kYXRhO1xuXHRcdFx0ZGVsZXRlIGQuY2hpbGRyZW47XG5cdFx0XHR0bXAub3JpZ2luYWwgPSBkO1xuXHRcdFx0bVt0bXAuaWRdID0gdG1wO1xuXHRcdFx0aWYodG1wLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5wdXNoKHRtcC5pZCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdG1wLmlkO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmVkcmF3cyBhbGwgbm9kZXMgdGhhdCBuZWVkIHRvIGJlIHJlZHJhd24uIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF9yZWRyYXcoKVxuXHRcdCAqIEB0cmlnZ2VyIHJlZHJhdy5qc3RyZWVcblx0XHQgKi9cblx0XHRfcmVkcmF3IDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIG5vZGVzID0gdGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcgPyB0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdLmNoaWxkcmVuLmNvbmNhdChbXSkgOiB0aGlzLl9tb2RlbC5jaGFuZ2VkLmNvbmNhdChbXSksXG5cdFx0XHRcdGYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdVTCcpLCB0bXAsIGksIGosIGZlID0gdGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQ7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBub2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0dG1wID0gdGhpcy5yZWRyYXdfbm9kZShub2Rlc1tpXSwgdHJ1ZSwgdGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcpO1xuXHRcdFx0XHRpZih0bXAgJiYgdGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcpIHtcblx0XHRcdFx0XHRmLmFwcGVuZENoaWxkKHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3KSB7XG5cdFx0XHRcdGYuY2xhc3NOYW1lID0gdGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0uY2xhc3NOYW1lO1xuXHRcdFx0XHRmLnNldEF0dHJpYnV0ZSgncm9sZScsJ2dyb3VwJyk7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5lbXB0eSgpLmFwcGVuZChmKTtcblx0XHRcdFx0Ly90aGlzLmdldF9jb250YWluZXJfdWwoKVswXS5hcHBlbmRDaGlsZChmKTtcblx0XHRcdH1cblx0XHRcdGlmKGZlICE9PSBudWxsICYmIHRoaXMuc2V0dGluZ3MuY29yZS5yZXN0b3JlX2ZvY3VzKSB7XG5cdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUoZmUsIHRydWUpO1xuXHRcdFx0XHRpZih0bXAgJiYgdG1wLmxlbmd0aCAmJiB0bXAuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJylbMF0gIT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcblx0XHRcdFx0XHR0bXAuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3ID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9tb2RlbC5jaGFuZ2VkID0gW107XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCBhZnRlciBub2RlcyBhcmUgcmVkcmF3blxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSByZWRyYXcuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge2FycmF5fSBub2RlcyB0aGUgcmVkcmF3biBub2Rlc1xuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3JlZHJhdycsIHsgXCJub2Rlc1wiIDogbm9kZXMgfSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZWRyYXdzIGFsbCBub2RlcyB0aGF0IG5lZWQgdG8gYmUgcmVkcmF3biBvciBvcHRpb25hbGx5IC0gdGhlIHdob2xlIHRyZWVcblx0XHQgKiBAbmFtZSByZWRyYXcoW2Z1bGxdKVxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gZnVsbCBpZiBzZXQgdG8gYHRydWVgIGFsbCBub2RlcyBhcmUgcmVkcmF3bi5cblx0XHQgKi9cblx0XHRyZWRyYXcgOiBmdW5jdGlvbiAoZnVsbCkge1xuXHRcdFx0aWYoZnVsbCkge1xuXHRcdFx0XHR0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHQvL2lmKHRoaXMuX21vZGVsLnJlZHJhd190aW1lb3V0KSB7XG5cdFx0XHQvL1x0Y2xlYXJUaW1lb3V0KHRoaXMuX21vZGVsLnJlZHJhd190aW1lb3V0KTtcblx0XHRcdC8vfVxuXHRcdFx0Ly90aGlzLl9tb2RlbC5yZWRyYXdfdGltZW91dCA9IHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLl9yZWRyYXcsIHRoaXMpLDApO1xuXHRcdFx0dGhpcy5fcmVkcmF3KCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiByZWRyYXdzIGEgc2luZ2xlIG5vZGUncyBjaGlsZHJlbi4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgZHJhd19jaGlsZHJlbihub2RlKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG5vZGUgdGhlIG5vZGUgd2hvc2UgY2hpbGRyZW4gd2lsbCBiZSByZWRyYXduXG5cdFx0ICovXG5cdFx0ZHJhd19jaGlsZHJlbiA6IGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0XHR2YXIgb2JqID0gdGhpcy5nZXRfbm9kZShub2RlKSxcblx0XHRcdFx0aSA9IGZhbHNlLFxuXHRcdFx0XHRqID0gZmFsc2UsXG5cdFx0XHRcdGsgPSBmYWxzZSxcblx0XHRcdFx0ZCA9IGRvY3VtZW50O1xuXHRcdFx0aWYoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gdGhpcy5yZWRyYXcodHJ1ZSk7IH1cblx0XHRcdG5vZGUgPSB0aGlzLmdldF9ub2RlKG5vZGUsIHRydWUpO1xuXHRcdFx0aWYoIW5vZGUgfHwgIW5vZGUubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfSAvLyBUT0RPOiBxdWljayB0b2dnbGVcblxuXHRcdFx0bm9kZS5jaGlsZHJlbignLmpzdHJlZS1jaGlsZHJlbicpLnJlbW92ZSgpO1xuXHRcdFx0bm9kZSA9IG5vZGVbMF07XG5cdFx0XHRpZihvYmouY2hpbGRyZW4ubGVuZ3RoICYmIG9iai5zdGF0ZS5sb2FkZWQpIHtcblx0XHRcdFx0ayA9IGQuY3JlYXRlRWxlbWVudCgnVUwnKTtcblx0XHRcdFx0ay5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZ3JvdXAnKTtcblx0XHRcdFx0ay5jbGFzc05hbWUgPSAnanN0cmVlLWNoaWxkcmVuJztcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGsuYXBwZW5kQ2hpbGQodGhpcy5yZWRyYXdfbm9kZShvYmouY2hpbGRyZW5baV0sIHRydWUsIHRydWUpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKGspO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmVkcmF3cyBhIHNpbmdsZSBub2RlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSByZWRyYXdfbm9kZShub2RlLCBkZWVwLCBpc19jYWxsYmFjaywgZm9yY2VfcmVuZGVyKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG5vZGUgdGhlIG5vZGUgdG8gcmVkcmF3XG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBkZWVwIHNob3VsZCBjaGlsZCBub2RlcyBiZSByZWRyYXduIHRvb1xuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNfY2FsbGJhY2sgaXMgdGhpcyBhIHJlY3Vyc2lvbiBjYWxsXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBmb3JjZV9yZW5kZXIgc2hvdWxkIGNoaWxkcmVuIG9mIGNsb3NlZCBwYXJlbnRzIGJlIGRyYXduIGFueXdheVxuXHRcdCAqL1xuXHRcdHJlZHJhd19ub2RlIDogZnVuY3Rpb24gKG5vZGUsIGRlZXAsIGlzX2NhbGxiYWNrLCBmb3JjZV9yZW5kZXIpIHtcblx0XHRcdHZhciBvYmogPSB0aGlzLmdldF9ub2RlKG5vZGUpLFxuXHRcdFx0XHRwYXIgPSBmYWxzZSxcblx0XHRcdFx0aW5kID0gZmFsc2UsXG5cdFx0XHRcdG9sZCA9IGZhbHNlLFxuXHRcdFx0XHRpID0gZmFsc2UsXG5cdFx0XHRcdGogPSBmYWxzZSxcblx0XHRcdFx0ayA9IGZhbHNlLFxuXHRcdFx0XHRjID0gJycsXG5cdFx0XHRcdGQgPSBkb2N1bWVudCxcblx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdGYgPSBmYWxzZSxcblx0XHRcdFx0cyA9IGZhbHNlLFxuXHRcdFx0XHR0bXAgPSBudWxsLFxuXHRcdFx0XHR0ID0gMCxcblx0XHRcdFx0bCA9IDAsXG5cdFx0XHRcdGhhc19jaGlsZHJlbiA9IGZhbHNlLFxuXHRcdFx0XHRsYXN0X3NpYmxpbmcgPSBmYWxzZTtcblx0XHRcdGlmKCFvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZihvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgIHJldHVybiB0aGlzLnJlZHJhdyh0cnVlKTsgfVxuXHRcdFx0ZGVlcCA9IGRlZXAgfHwgb2JqLmNoaWxkcmVuLmxlbmd0aCA9PT0gMDtcblx0XHRcdG5vZGUgPSAhZG9jdW1lbnQucXVlcnlTZWxlY3RvciA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9iai5pZCkgOiB0aGlzLmVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignIycgKyAoXCIwMTIzNDU2Nzg5XCIuaW5kZXhPZihvYmouaWRbMF0pICE9PSAtMSA/ICdcXFxcMycgKyBvYmouaWRbMF0gKyAnICcgKyBvYmouaWQuc3Vic3RyKDEpLnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJykgOiBvYmouaWQucmVwbGFjZSgkLmpzdHJlZS5pZHJlZ2V4LCdcXFxcJCYnKSkgKTsgLy8sIHRoaXMuZWxlbWVudCk7XG5cdFx0XHRpZighbm9kZSkge1xuXHRcdFx0XHRkZWVwID0gdHJ1ZTtcblx0XHRcdFx0Ly9ub2RlID0gZC5jcmVhdGVFbGVtZW50KCdMSScpO1xuXHRcdFx0XHRpZighaXNfY2FsbGJhY2spIHtcblx0XHRcdFx0XHRwYXIgPSBvYmoucGFyZW50ICE9PSAkLmpzdHJlZS5yb290ID8gJCgnIycgKyBvYmoucGFyZW50LnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJyksIHRoaXMuZWxlbWVudClbMF0gOiBudWxsO1xuXHRcdFx0XHRcdGlmKHBhciAhPT0gbnVsbCAmJiAoIXBhciB8fCAhbVtvYmoucGFyZW50XS5zdGF0ZS5vcGVuZWQpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGluZCA9ICQuaW5BcnJheShvYmouaWQsIHBhciA9PT0gbnVsbCA/IG1bJC5qc3RyZWUucm9vdF0uY2hpbGRyZW4gOiBtW29iai5wYXJlbnRdLmNoaWxkcmVuKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG5vZGUgPSAkKG5vZGUpO1xuXHRcdFx0XHRpZighaXNfY2FsbGJhY2spIHtcblx0XHRcdFx0XHRwYXIgPSBub2RlLnBhcmVudCgpLnBhcmVudCgpWzBdO1xuXHRcdFx0XHRcdGlmKHBhciA9PT0gdGhpcy5lbGVtZW50WzBdKSB7XG5cdFx0XHRcdFx0XHRwYXIgPSBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpbmQgPSBub2RlLmluZGV4KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gbVtvYmouaWRdLmRhdGEgPSBub2RlLmRhdGEoKTsgLy8gdXNlIG9ubHkgbm9kZSdzIGRhdGEsIG5vIG5lZWQgdG8gdG91Y2gganF1ZXJ5IHN0b3JhZ2Vcblx0XHRcdFx0aWYoIWRlZXAgJiYgb2JqLmNoaWxkcmVuLmxlbmd0aCAmJiAhbm9kZS5jaGlsZHJlbignLmpzdHJlZS1jaGlsZHJlbicpLmxlbmd0aCkge1xuXHRcdFx0XHRcdGRlZXAgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCFkZWVwKSB7XG5cdFx0XHRcdFx0b2xkID0gbm9kZS5jaGlsZHJlbignLmpzdHJlZS1jaGlsZHJlbicpWzBdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGYgPSBub2RlLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpWzBdID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdFx0XHRub2RlLnJlbW92ZSgpO1xuXHRcdFx0XHQvL25vZGUgPSBkLmNyZWF0ZUVsZW1lbnQoJ0xJJyk7XG5cdFx0XHRcdC8vbm9kZSA9IG5vZGVbMF07XG5cdFx0XHR9XG5cdFx0XHRub2RlID0gdGhpcy5fZGF0YS5jb3JlLm5vZGUuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0Ly8gbm9kZSBpcyBET00sIGRlZXAgaXMgYm9vbGVhblxuXG5cdFx0XHRjID0gJ2pzdHJlZS1ub2RlICc7XG5cdFx0XHRmb3IoaSBpbiBvYmoubGlfYXR0cikge1xuXHRcdFx0XHRpZihvYmoubGlfYXR0ci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdGlmKGkgPT09ICdpZCcpIHsgY29udGludWU7IH1cblx0XHRcdFx0XHRpZihpICE9PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZShpLCBvYmoubGlfYXR0cltpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0YyArPSBvYmoubGlfYXR0cltpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKCFvYmouYV9hdHRyLmlkKSB7XG5cdFx0XHRcdG9iai5hX2F0dHIuaWQgPSBvYmouaWQgKyAnX2FuY2hvcic7XG5cdFx0XHR9XG5cdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICEhb2JqLnN0YXRlLnNlbGVjdGVkKTtcblx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdhcmlhLWxldmVsJywgb2JqLnBhcmVudHMubGVuZ3RoKTtcblx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCBvYmouYV9hdHRyLmlkKTtcblx0XHRcdGlmKG9iai5zdGF0ZS5kaXNhYmxlZCkge1xuXHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKCFtW29iai5jaGlsZHJlbltpXV0uc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdFx0aGFzX2NoaWxkcmVuID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYob2JqLnBhcmVudCAhPT0gbnVsbCAmJiBtW29iai5wYXJlbnRdICYmICFvYmouc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdGkgPSAkLmluQXJyYXkob2JqLmlkLCBtW29iai5wYXJlbnRdLmNoaWxkcmVuKTtcblx0XHRcdFx0bGFzdF9zaWJsaW5nID0gb2JqLmlkO1xuXHRcdFx0XHRpZihpICE9PSAtMSkge1xuXHRcdFx0XHRcdGkrKztcblx0XHRcdFx0XHRmb3IoaiA9IG1bb2JqLnBhcmVudF0uY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZighbVttW29iai5wYXJlbnRdLmNoaWxkcmVuW2ldXS5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0XHRcdFx0bGFzdF9zaWJsaW5nID0gbVtvYmoucGFyZW50XS5jaGlsZHJlbltpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKGxhc3Rfc2libGluZyAhPT0gb2JqLmlkKSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZihvYmouc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdGMgKz0gJyBqc3RyZWUtaGlkZGVuJztcblx0XHRcdH1cblx0XHRcdGlmIChvYmouc3RhdGUubG9hZGluZykge1xuXHRcdFx0XHRjICs9ICcganN0cmVlLWxvYWRpbmcnO1xuXHRcdFx0fVxuXHRcdFx0aWYob2JqLnN0YXRlLmxvYWRlZCAmJiAhaGFzX2NoaWxkcmVuKSB7XG5cdFx0XHRcdGMgKz0gJyBqc3RyZWUtbGVhZic7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YyArPSBvYmouc3RhdGUub3BlbmVkICYmIG9iai5zdGF0ZS5sb2FkZWQgPyAnIGpzdHJlZS1vcGVuJyA6ICcganN0cmVlLWNsb3NlZCc7XG5cdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgKG9iai5zdGF0ZS5vcGVuZWQgJiYgb2JqLnN0YXRlLmxvYWRlZCkgKTtcblx0XHRcdH1cblx0XHRcdGlmKGxhc3Rfc2libGluZyA9PT0gb2JqLmlkKSB7XG5cdFx0XHRcdGMgKz0gJyBqc3RyZWUtbGFzdCc7XG5cdFx0XHR9XG5cdFx0XHRub2RlLmlkID0gb2JqLmlkO1xuXHRcdFx0bm9kZS5jbGFzc05hbWUgPSBjO1xuXHRcdFx0YyA9ICggb2JqLnN0YXRlLnNlbGVjdGVkID8gJyBqc3RyZWUtY2xpY2tlZCcgOiAnJykgKyAoIG9iai5zdGF0ZS5kaXNhYmxlZCA/ICcganN0cmVlLWRpc2FibGVkJyA6ICcnKTtcblx0XHRcdGZvcihqIGluIG9iai5hX2F0dHIpIHtcblx0XHRcdFx0aWYob2JqLmFfYXR0ci5oYXNPd25Qcm9wZXJ0eShqKSkge1xuXHRcdFx0XHRcdGlmKGogPT09ICdocmVmJyAmJiBvYmouYV9hdHRyW2pdID09PSAnIycpIHsgY29udGludWU7IH1cblx0XHRcdFx0XHRpZihqICE9PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uc2V0QXR0cmlidXRlKGosIG9iai5hX2F0dHJbal0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGMgKz0gJyAnICsgb2JqLmFfYXR0cltqXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGMubGVuZ3RoKSB7XG5cdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5jbGFzc05hbWUgPSAnanN0cmVlLWFuY2hvciAnICsgYztcblx0XHRcdH1cblx0XHRcdGlmKChvYmouaWNvbiAmJiBvYmouaWNvbiAhPT0gdHJ1ZSkgfHwgb2JqLmljb24gPT09IGZhbHNlKSB7XG5cdFx0XHRcdGlmKG9iai5pY29uID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLmNsYXNzTmFtZSArPSAnIGpzdHJlZS10aGVtZWljb24taGlkZGVuJztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKG9iai5pY29uLmluZGV4T2YoJy8nKSA9PT0gLTEgJiYgb2JqLmljb24uaW5kZXhPZignLicpID09PSAtMSkge1xuXHRcdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLmNsYXNzTmFtZSArPSAnICcgKyBvYmouaWNvbiArICcganN0cmVlLXRoZW1laWNvbi1jdXN0b20nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCInK29iai5pY29uKydcIiknO1xuXHRcdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICdjZW50ZXIgY2VudGVyJztcblx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdhdXRvJztcblx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jbGFzc05hbWUgKz0gJyBqc3RyZWUtdGhlbWVpY29uLWN1c3RvbSc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jb3JlLmZvcmNlX3RleHQpIHtcblx0XHRcdFx0bm9kZS5jaGlsZE5vZGVzWzFdLmFwcGVuZENoaWxkKGQuY3JlYXRlVGV4dE5vZGUob2JqLnRleHQpKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbMV0uaW5uZXJIVE1MICs9IG9iai50ZXh0O1xuXHRcdFx0fVxuXG5cblx0XHRcdGlmKGRlZXAgJiYgb2JqLmNoaWxkcmVuLmxlbmd0aCAmJiAob2JqLnN0YXRlLm9wZW5lZCB8fCBmb3JjZV9yZW5kZXIpICYmIG9iai5zdGF0ZS5sb2FkZWQpIHtcblx0XHRcdFx0ayA9IGQuY3JlYXRlRWxlbWVudCgnVUwnKTtcblx0XHRcdFx0ay5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZ3JvdXAnKTtcblx0XHRcdFx0ay5jbGFzc05hbWUgPSAnanN0cmVlLWNoaWxkcmVuJztcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGsuYXBwZW5kQ2hpbGQodGhpcy5yZWRyYXdfbm9kZShvYmouY2hpbGRyZW5baV0sIGRlZXAsIHRydWUpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKGspO1xuXHRcdFx0fVxuXHRcdFx0aWYob2xkKSB7XG5cdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQob2xkKTtcblx0XHRcdH1cblx0XHRcdGlmKCFpc19jYWxsYmFjaykge1xuXHRcdFx0XHQvLyBhcHBlbmQgYmFjayB1c2luZyBwYXIgLyBpbmRcblx0XHRcdFx0aWYoIXBhcikge1xuXHRcdFx0XHRcdHBhciA9IHRoaXMuZWxlbWVudFswXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwYXIuY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZihwYXIuY2hpbGROb2Rlc1tpXSAmJiBwYXIuY2hpbGROb2Rlc1tpXS5jbGFzc05hbWUgJiYgcGFyLmNoaWxkTm9kZXNbaV0uY2xhc3NOYW1lLmluZGV4T2YoJ2pzdHJlZS1jaGlsZHJlbicpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0dG1wID0gcGFyLmNoaWxkTm9kZXNbaV07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIXRtcCkge1xuXHRcdFx0XHRcdHRtcCA9IGQuY3JlYXRlRWxlbWVudCgnVUwnKTtcblx0XHRcdFx0XHR0bXAuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2dyb3VwJyk7XG5cdFx0XHRcdFx0dG1wLmNsYXNzTmFtZSA9ICdqc3RyZWUtY2hpbGRyZW4nO1xuXHRcdFx0XHRcdHBhci5hcHBlbmRDaGlsZCh0bXApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBhciA9IHRtcDtcblxuXHRcdFx0XHRpZihpbmQgPCBwYXIuY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRwYXIuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhci5jaGlsZE5vZGVzW2luZF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHBhci5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihmKSB7XG5cdFx0XHRcdFx0dCA9IHRoaXMuZWxlbWVudFswXS5zY3JvbGxUb3A7XG5cdFx0XHRcdFx0bCA9IHRoaXMuZWxlbWVudFswXS5zY3JvbGxMZWZ0O1xuXHRcdFx0XHRcdG5vZGUuY2hpbGROb2Rlc1sxXS5mb2N1cygpO1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudFswXS5zY3JvbGxUb3AgPSB0O1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudFswXS5zY3JvbGxMZWZ0ID0gbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYob2JqLnN0YXRlLm9wZW5lZCAmJiAhb2JqLnN0YXRlLmxvYWRlZCkge1xuXHRcdFx0XHRvYmouc3RhdGUub3BlbmVkID0gZmFsc2U7XG5cdFx0XHRcdHNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGhpcy5vcGVuX25vZGUob2JqLmlkLCBmYWxzZSwgMCk7XG5cdFx0XHRcdH0sIHRoaXMpLCAwKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogb3BlbnMgYSBub2RlLCByZXZlYWxpbmcgaXRzIGNoaWxkcmVuLiBJZiB0aGUgbm9kZSBpcyBub3QgbG9hZGVkIGl0IHdpbGwgYmUgbG9hZGVkIGFuZCBvcGVuZWQgb25jZSByZWFkeS5cblx0XHQgKiBAbmFtZSBvcGVuX25vZGUob2JqIFssIGNhbGxiYWNrLCBhbmltYXRpb25dKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBvcGVuXG5cdFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBleGVjdXRlIG9uY2UgdGhlIG5vZGUgaXMgb3BlbmVkXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IGFuaW1hdGlvbiB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyB3aGVuIG9wZW5pbmcgdGhlIG5vZGUgKG92ZXJyaWRlcyB0aGUgYGNvcmUuYW5pbWF0aW9uYCBzZXR0aW5nKS4gVXNlIGBmYWxzZWAgZm9yIG5vIGFuaW1hdGlvbi5cblx0XHQgKiBAdHJpZ2dlciBvcGVuX25vZGUuanN0cmVlLCBhZnRlcl9vcGVuLmpzdHJlZSwgYmVmb3JlX29wZW4uanN0cmVlXG5cdFx0ICovXG5cdFx0b3Blbl9ub2RlIDogZnVuY3Rpb24gKG9iaiwgY2FsbGJhY2ssIGFuaW1hdGlvbikge1xuXHRcdFx0dmFyIHQxLCB0MiwgZCwgdDtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLm9wZW5fbm9kZShvYmpbdDFdLCBjYWxsYmFjaywgYW5pbWF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGFuaW1hdGlvbiA9IGFuaW1hdGlvbiA9PT0gdW5kZWZpbmVkID8gdGhpcy5zZXR0aW5ncy5jb3JlLmFuaW1hdGlvbiA6IGFuaW1hdGlvbjtcblx0XHRcdGlmKCF0aGlzLmlzX2Nsb3NlZChvYmopKSB7XG5cdFx0XHRcdGlmKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBvYmosIGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZighdGhpcy5pc19sb2FkZWQob2JqKSkge1xuXHRcdFx0XHRpZih0aGlzLmlzX2xvYWRpbmcob2JqKSkge1xuXHRcdFx0XHRcdHJldHVybiBzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5vcGVuX25vZGUob2JqLCBjYWxsYmFjaywgYW5pbWF0aW9uKTtcblx0XHRcdFx0XHR9LCB0aGlzKSwgNTAwKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmxvYWRfbm9kZShvYmosIGZ1bmN0aW9uIChvLCBvaykge1xuXHRcdFx0XHRcdHJldHVybiBvayA/IHRoaXMub3Blbl9ub2RlKG8sIGNhbGxiYWNrLCBhbmltYXRpb24pIDogKGNhbGxiYWNrID8gY2FsbGJhY2suY2FsbCh0aGlzLCBvLCBmYWxzZSkgOiBmYWxzZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGQgPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRcdHQgPSB0aGlzO1xuXHRcdFx0XHRpZihkLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlmKGFuaW1hdGlvbiAmJiBkLmNoaWxkcmVuKFwiLmpzdHJlZS1jaGlsZHJlblwiKS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGQuY2hpbGRyZW4oXCIuanN0cmVlLWNoaWxkcmVuXCIpLnN0b3AodHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKG9iai5jaGlsZHJlbi5sZW5ndGggJiYgIXRoaXMuX2ZpcnN0Q2hpbGQoZC5jaGlsZHJlbignLmpzdHJlZS1jaGlsZHJlbicpWzBdKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5kcmF3X2NoaWxkcmVuKG9iaik7XG5cdFx0XHRcdFx0XHQvL2QgPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKCFhbmltYXRpb24pIHtcblx0XHRcdFx0XHRcdHRoaXMudHJpZ2dlcignYmVmb3JlX29wZW4nLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0XHRcdFx0ZFswXS5jbGFzc05hbWUgPSBkWzBdLmNsYXNzTmFtZS5yZXBsYWNlKCdqc3RyZWUtY2xvc2VkJywgJ2pzdHJlZS1vcGVuJyk7XG5cdFx0XHRcdFx0XHRkWzBdLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdiZWZvcmVfb3BlbicsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHRcdFx0XHRkXG5cdFx0XHRcdFx0XHRcdC5jaGlsZHJlbihcIi5qc3RyZWUtY2hpbGRyZW5cIikuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKS5lbmQoKVxuXHRcdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtY2xvc2VkXCIpLmFkZENsYXNzKFwianN0cmVlLW9wZW5cIikuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwgdHJ1ZSlcblx0XHRcdFx0XHRcdFx0LmNoaWxkcmVuKFwiLmpzdHJlZS1jaGlsZHJlblwiKS5zdG9wKHRydWUsIHRydWUpXG5cdFx0XHRcdFx0XHRcdFx0LnNsaWRlRG93bihhbmltYXRpb24sIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAodC5lbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHQudHJpZ2dlcihcImFmdGVyX29wZW5cIiwgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0b2JqLnN0YXRlLm9wZW5lZCA9IHRydWU7XG5cdFx0XHRcdGlmKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzLCBvYmosIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCFkLmxlbmd0aCkge1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyBhYm91dCB0byBiZSBvcGVuZWQgKGlmIHRoZSBub2RlIGlzIHN1cHBvc2VkIHRvIGJlIGluIHRoZSBET00sIGl0IHdpbGwgYmUsIGJ1dCBpdCB3b24ndCBiZSB2aXNpYmxlIHlldClcblx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHQgKiBAbmFtZSBiZWZvcmVfb3Blbi5qc3RyZWVcblx0XHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgb3BlbmVkIG5vZGVcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2JlZm9yZV9vcGVuJywgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIG9wZW5lZCAoaWYgdGhlcmUgaXMgYW4gYW5pbWF0aW9uIGl0IHdpbGwgbm90IGJlIGNvbXBsZXRlZCB5ZXQpXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBvcGVuX25vZGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBvcGVuZWQgbm9kZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdvcGVuX25vZGUnLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0XHRpZighYW5pbWF0aW9uIHx8ICFkLmxlbmd0aCkge1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyBvcGVuZWQgYW5kIHRoZSBhbmltYXRpb24gaXMgY29tcGxldGVcblx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHQgKiBAbmFtZSBhZnRlcl9vcGVuLmpzdHJlZVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBvcGVuZWQgbm9kZVxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcihcImFmdGVyX29wZW5cIiwgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIG9wZW5zIGV2ZXJ5IHBhcmVudCBvZiBhIG5vZGUgKG5vZGUgc2hvdWxkIGJlIGxvYWRlZClcblx0XHQgKiBAbmFtZSBfb3Blbl90byhvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIHJldmVhbFxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0X29wZW5fdG8gOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgaSwgaiwgcCA9IG9iai5wYXJlbnRzO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5sZW5ndGg7IGkgPCBqOyBpKz0xKSB7XG5cdFx0XHRcdGlmKGkgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHR0aGlzLm9wZW5fbm9kZShwW2ldLCBmYWxzZSwgMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiAkKCcjJyArIG9iai5pZC5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpLCB0aGlzLmVsZW1lbnQpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2xvc2VzIGEgbm9kZSwgaGlkaW5nIGl0cyBjaGlsZHJlblxuXHRcdCAqIEBuYW1lIGNsb3NlX25vZGUob2JqIFssIGFuaW1hdGlvbl0pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGNsb3NlXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IGFuaW1hdGlvbiB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyB3aGVuIGNsb3NpbmcgdGhlIG5vZGUgKG92ZXJyaWRlcyB0aGUgYGNvcmUuYW5pbWF0aW9uYCBzZXR0aW5nKS4gVXNlIGBmYWxzZWAgZm9yIG5vIGFuaW1hdGlvbi5cblx0XHQgKiBAdHJpZ2dlciBjbG9zZV9ub2RlLmpzdHJlZSwgYWZ0ZXJfY2xvc2UuanN0cmVlXG5cdFx0ICovXG5cdFx0Y2xvc2Vfbm9kZSA6IGZ1bmN0aW9uIChvYmosIGFuaW1hdGlvbikge1xuXHRcdFx0dmFyIHQxLCB0MiwgdCwgZDtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmNsb3NlX25vZGUob2JqW3QxXSwgYW5pbWF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuaXNfY2xvc2VkKG9iaikpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0YW5pbWF0aW9uID0gYW5pbWF0aW9uID09PSB1bmRlZmluZWQgPyB0aGlzLnNldHRpbmdzLmNvcmUuYW5pbWF0aW9uIDogYW5pbWF0aW9uO1xuXHRcdFx0dCA9IHRoaXM7XG5cdFx0XHRkID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXG5cdFx0XHRvYmouc3RhdGUub3BlbmVkID0gZmFsc2U7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyBjbG9zZWQgKGlmIHRoZXJlIGlzIGFuIGFuaW1hdGlvbiBpdCB3aWxsIG5vdCBiZSBjb21wbGV0ZSB5ZXQpXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGNsb3NlX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgY2xvc2VkIG5vZGVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjbG9zZV9ub2RlJyx7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0aWYoIWQubGVuZ3RoKSB7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgY2xvc2VkIGFuZCB0aGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBhZnRlcl9jbG9zZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIGNsb3NlZCBub2RlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoXCJhZnRlcl9jbG9zZVwiLCB7IFwibm9kZVwiIDogb2JqIH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmKCFhbmltYXRpb24pIHtcblx0XHRcdFx0XHRkWzBdLmNsYXNzTmFtZSA9IGRbMF0uY2xhc3NOYW1lLnJlcGxhY2UoJ2pzdHJlZS1vcGVuJywgJ2pzdHJlZS1jbG9zZWQnKTtcblx0XHRcdFx0XHRkLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsIGZhbHNlKS5jaGlsZHJlbignLmpzdHJlZS1jaGlsZHJlbicpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcihcImFmdGVyX2Nsb3NlXCIsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZFxuXHRcdFx0XHRcdFx0LmNoaWxkcmVuKFwiLmpzdHJlZS1jaGlsZHJlblwiKS5hdHRyKFwic3R5bGVcIixcImRpc3BsYXk6YmxvY2sgIWltcG9ydGFudFwiKS5lbmQoKVxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFwianN0cmVlLW9wZW5cIikuYWRkQ2xhc3MoXCJqc3RyZWUtY2xvc2VkXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsIGZhbHNlKVxuXHRcdFx0XHRcdFx0LmNoaWxkcmVuKFwiLmpzdHJlZS1jaGlsZHJlblwiKS5zdG9wKHRydWUsIHRydWUpLnNsaWRlVXAoYW5pbWF0aW9uLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHRcdFx0XHRcdGQuY2hpbGRyZW4oJy5qc3RyZWUtY2hpbGRyZW4nKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0aWYgKHQuZWxlbWVudCkge1xuXHRcdFx0XHRcdFx0XHRcdHQudHJpZ2dlcihcImFmdGVyX2Nsb3NlXCIsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiB0b2dnbGVzIGEgbm9kZSAtIGNsb3NpbmcgaXQgaWYgaXQgaXMgb3Blbiwgb3BlbmluZyBpdCBpZiBpdCBpcyBjbG9zZWRcblx0XHQgKiBAbmFtZSB0b2dnbGVfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIHRvZ2dsZVxuXHRcdCAqL1xuXHRcdHRvZ2dsZV9ub2RlIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0dmFyIHQxLCB0Mjtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZV9ub2RlKG9ialt0MV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5pc19jbG9zZWQob2JqKSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5vcGVuX25vZGUob2JqKTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuaXNfb3BlbihvYmopKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNsb3NlX25vZGUob2JqKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIG9wZW5zIGFsbCBub2RlcyB3aXRoaW4gYSBub2RlIChvciB0aGUgdHJlZSksIHJldmVhbGluZyB0aGVpciBjaGlsZHJlbi4gSWYgdGhlIG5vZGUgaXMgbm90IGxvYWRlZCBpdCB3aWxsIGJlIGxvYWRlZCBhbmQgb3BlbmVkIG9uY2UgcmVhZHkuXG5cdFx0ICogQG5hbWUgb3Blbl9hbGwoW29iaiwgYW5pbWF0aW9uLCBvcmlnaW5hbF9vYmpdKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBvcGVuIHJlY3Vyc2l2ZWx5LCBvbWl0IHRvIG9wZW4gYWxsIG5vZGVzIGluIHRoZSB0cmVlXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IGFuaW1hdGlvbiB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyB3aGVuIG9wZW5pbmcgdGhlIG5vZGVzLCB0aGUgZGVmYXVsdCBpcyBubyBhbmltYXRpb25cblx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gcmVmZXJlbmNlIHRvIHRoZSBub2RlIHRoYXQgc3RhcnRlZCB0aGUgcHJvY2VzcyAoaW50ZXJuYWwgdXNlKVxuXHRcdCAqIEB0cmlnZ2VyIG9wZW5fYWxsLmpzdHJlZVxuXHRcdCAqL1xuXHRcdG9wZW5fYWxsIDogZnVuY3Rpb24gKG9iaiwgYW5pbWF0aW9uLCBvcmlnaW5hbF9vYmopIHtcblx0XHRcdGlmKCFvYmopIHsgb2JqID0gJC5qc3RyZWUucm9vdDsgfVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciBkb20gPSBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QgPyB0aGlzLmdldF9jb250YWluZXJfdWwoKSA6IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKSwgaSwgaiwgX3RoaXM7XG5cdFx0XHRpZighZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZih0aGlzLmlzX2Nsb3NlZCh0aGlzLl9tb2RlbC5kYXRhW29iai5jaGlsZHJlbl9kW2ldXSkpIHtcblx0XHRcdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbb2JqLmNoaWxkcmVuX2RbaV1dLnN0YXRlLm9wZW5lZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLnRyaWdnZXIoJ29wZW5fYWxsJywgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHRcdH1cblx0XHRcdG9yaWdpbmFsX29iaiA9IG9yaWdpbmFsX29iaiB8fCBkb207XG5cdFx0XHRfdGhpcyA9IHRoaXM7XG5cdFx0XHRkb20gPSB0aGlzLmlzX2Nsb3NlZChvYmopID8gZG9tLmZpbmQoJy5qc3RyZWUtY2xvc2VkJykuYWRkQmFjaygpIDogZG9tLmZpbmQoJy5qc3RyZWUtY2xvc2VkJyk7XG5cdFx0XHRkb20uZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdF90aGlzLm9wZW5fbm9kZShcblx0XHRcdFx0XHR0aGlzLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKG5vZGUsIHN0YXR1cykgeyBpZihzdGF0dXMgJiYgdGhpcy5pc19wYXJlbnQobm9kZSkpIHsgdGhpcy5vcGVuX2FsbChub2RlLCBhbmltYXRpb24sIG9yaWdpbmFsX29iaik7IH0gfSxcblx0XHRcdFx0XHRhbmltYXRpb24gfHwgMFxuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0XHRpZihvcmlnaW5hbF9vYmouZmluZCgnLmpzdHJlZS1jbG9zZWQnKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIGBvcGVuX2FsbGAgY2FsbCBjb21wbGV0ZXNcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIG9wZW5fYWxsLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgb3BlbmVkIG5vZGVcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignb3Blbl9hbGwnLCB7IFwibm9kZVwiIDogdGhpcy5nZXRfbm9kZShvcmlnaW5hbF9vYmopIH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2xvc2VzIGFsbCBub2RlcyB3aXRoaW4gYSBub2RlIChvciB0aGUgdHJlZSksIHJldmVhbGluZyB0aGVpciBjaGlsZHJlblxuXHRcdCAqIEBuYW1lIGNsb3NlX2FsbChbb2JqLCBhbmltYXRpb25dKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBjbG9zZSByZWN1cnNpdmVseSwgb21pdCB0byBjbG9zZSBhbGwgbm9kZXMgaW4gdGhlIHRyZWVcblx0XHQgKiBAcGFyYW0ge051bWJlcn0gYW5pbWF0aW9uIHRoZSBhbmltYXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIHdoZW4gY2xvc2luZyB0aGUgbm9kZXMsIHRoZSBkZWZhdWx0IGlzIG5vIGFuaW1hdGlvblxuXHRcdCAqIEB0cmlnZ2VyIGNsb3NlX2FsbC5qc3RyZWVcblx0XHQgKi9cblx0XHRjbG9zZV9hbGwgOiBmdW5jdGlvbiAob2JqLCBhbmltYXRpb24pIHtcblx0XHRcdGlmKCFvYmopIHsgb2JqID0gJC5qc3RyZWUucm9vdDsgfVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciBkb20gPSBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QgPyB0aGlzLmdldF9jb250YWluZXJfdWwoKSA6IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKSxcblx0XHRcdFx0X3RoaXMgPSB0aGlzLCBpLCBqO1xuXHRcdFx0aWYoZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRkb20gPSB0aGlzLmlzX29wZW4ob2JqKSA/IGRvbS5maW5kKCcuanN0cmVlLW9wZW4nKS5hZGRCYWNrKCkgOiBkb20uZmluZCgnLmpzdHJlZS1vcGVuJyk7XG5cdFx0XHRcdCQoZG9tLmdldCgpLnJldmVyc2UoKSkuZWFjaChmdW5jdGlvbiAoKSB7IF90aGlzLmNsb3NlX25vZGUodGhpcywgYW5pbWF0aW9uIHx8IDApOyB9KTtcblx0XHRcdH1cblx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW29iai5jaGlsZHJlbl9kW2ldXS5zdGF0ZS5vcGVuZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gYGNsb3NlX2FsbGAgY2FsbCBjb21wbGV0ZXNcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY2xvc2VfYWxsLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIGNsb3NlZCBub2RlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignY2xvc2VfYWxsJywgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrcyBpZiBhIG5vZGUgaXMgZGlzYWJsZWQgKG5vdCBzZWxlY3RhYmxlKVxuXHRcdCAqIEBuYW1lIGlzX2Rpc2FibGVkKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRpc19kaXNhYmxlZCA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiBvYmogJiYgb2JqLnN0YXRlICYmIG9iai5zdGF0ZS5kaXNhYmxlZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGVuYWJsZXMgYSBub2RlIC0gc28gdGhhdCBpdCBjYW4gYmUgc2VsZWN0ZWRcblx0XHQgKiBAbmFtZSBlbmFibGVfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGVuYWJsZVxuXHRcdCAqIEB0cmlnZ2VyIGVuYWJsZV9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGVuYWJsZV9ub2RlIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0dmFyIHQxLCB0Mjtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmVuYWJsZV9ub2RlKG9ialt0MV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0b2JqLnN0YXRlLmRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHR0aGlzLmdldF9ub2RlKG9iaix0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5yZW1vdmVDbGFzcygnanN0cmVlLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBlbmFibGVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGVuYWJsZV9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIGVuYWJsZWQgbm9kZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2VuYWJsZV9ub2RlJywgeyAnbm9kZScgOiBvYmogfSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBkaXNhYmxlcyBhIG5vZGUgLSBzbyB0aGF0IGl0IGNhbiBub3QgYmUgc2VsZWN0ZWRcblx0XHQgKiBAbmFtZSBkaXNhYmxlX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBkaXNhYmxlXG5cdFx0ICogQHRyaWdnZXIgZGlzYWJsZV9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGRpc2FibGVfbm9kZSA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdHZhciB0MSwgdDI7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5kaXNhYmxlX25vZGUob2JqW3QxXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRvYmouc3RhdGUuZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy5nZXRfbm9kZShvYmosdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3MoJ2pzdHJlZS1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBkaXNhYmxlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBkaXNhYmxlX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgZGlzYWJsZWQgbm9kZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2Rpc2FibGVfbm9kZScsIHsgJ25vZGUnIDogb2JqIH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZGV0ZXJtaW5lcyBpZiBhIG5vZGUgaXMgaGlkZGVuXG5cdFx0ICogQG5hbWUgaXNfaGlkZGVuKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKi9cblx0XHRpc19oaWRkZW4gOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRyZXR1cm4gb2JqLnN0YXRlLmhpZGRlbiA9PT0gdHJ1ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGhpZGVzIGEgbm9kZSAtIGl0IGlzIHN0aWxsIGluIHRoZSBzdHJ1Y3R1cmUgYnV0IHdpbGwgbm90IGJlIHZpc2libGVcblx0XHQgKiBAbmFtZSBoaWRlX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBoaWRlXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBza2lwX3JlZHJhdyBpbnRlcm5hbCBwYXJhbWV0ZXIgY29udHJvbGxpbmcgaWYgcmVkcmF3IGlzIGNhbGxlZFxuXHRcdCAqIEB0cmlnZ2VyIGhpZGVfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRoaWRlX25vZGUgOiBmdW5jdGlvbiAob2JqLCBza2lwX3JlZHJhdykge1xuXHRcdFx0dmFyIHQxLCB0Mjtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmhpZGVfbm9kZShvYmpbdDFdLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXNraXBfcmVkcmF3KSB7XG5cdFx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKCFvYmouc3RhdGUuaGlkZGVuKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5oaWRkZW4gPSB0cnVlO1xuXHRcdFx0XHR0aGlzLl9ub2RlX2NoYW5nZWQob2JqLnBhcmVudCk7XG5cdFx0XHRcdGlmKCFza2lwX3JlZHJhdykge1xuXHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgaGlkZGVuXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBoaWRlX25vZGUuanN0cmVlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBoaWRkZW4gbm9kZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdoaWRlX25vZGUnLCB7ICdub2RlJyA6IG9iaiB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHNob3dzIGEgbm9kZVxuXHRcdCAqIEBuYW1lIHNob3dfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIHNob3dcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHNraXBfcmVkcmF3IGludGVybmFsIHBhcmFtZXRlciBjb250cm9sbGluZyBpZiByZWRyYXcgaXMgY2FsbGVkXG5cdFx0ICogQHRyaWdnZXIgc2hvd19ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHNob3dfbm9kZSA6IGZ1bmN0aW9uIChvYmosIHNraXBfcmVkcmF3KSB7XG5cdFx0XHR2YXIgdDEsIHQyO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuc2hvd19ub2RlKG9ialt0MV0sIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghc2tpcF9yZWRyYXcpIHtcblx0XHRcdFx0XHR0aGlzLnJlZHJhdygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYob2JqLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRvYmouc3RhdGUuaGlkZGVuID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuX25vZGVfY2hhbmdlZChvYmoucGFyZW50KTtcblx0XHRcdFx0aWYoIXNraXBfcmVkcmF3KSB7XG5cdFx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBzaG93blxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgc2hvd19ub2RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgc2hvd24gbm9kZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdzaG93X25vZGUnLCB7ICdub2RlJyA6IG9iaiB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGhpZGVzIGFsbCBub2Rlc1xuXHRcdCAqIEBuYW1lIGhpZGVfYWxsKClcblx0XHQgKiBAdHJpZ2dlciBoaWRlX2FsbC5qc3RyZWVcblx0XHQgKi9cblx0XHRoaWRlX2FsbCA6IGZ1bmN0aW9uIChza2lwX3JlZHJhdykge1xuXHRcdFx0dmFyIGksIG0gPSB0aGlzLl9tb2RlbC5kYXRhLCBpZHMgPSBbXTtcblx0XHRcdGZvcihpIGluIG0pIHtcblx0XHRcdFx0aWYobS5oYXNPd25Qcm9wZXJ0eShpKSAmJiBpICE9PSAkLmpzdHJlZS5yb290ICYmICFtW2ldLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRcdG1baV0uc3RhdGUuaGlkZGVuID0gdHJ1ZTtcblx0XHRcdFx0XHRpZHMucHVzaChpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcgPSB0cnVlO1xuXHRcdFx0aWYoIXNraXBfcmVkcmF3KSB7XG5cdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFsbCBub2RlcyBhcmUgaGlkZGVuXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGhpZGVfYWxsLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgdGhlIElEcyBvZiBhbGwgaGlkZGVuIG5vZGVzXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignaGlkZV9hbGwnLCB7ICdub2RlcycgOiBpZHMgfSk7XG5cdFx0XHRyZXR1cm4gaWRzO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc2hvd3MgYWxsIG5vZGVzXG5cdFx0ICogQG5hbWUgc2hvd19hbGwoKVxuXHRcdCAqIEB0cmlnZ2VyIHNob3dfYWxsLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHNob3dfYWxsIDogZnVuY3Rpb24gKHNraXBfcmVkcmF3KSB7XG5cdFx0XHR2YXIgaSwgbSA9IHRoaXMuX21vZGVsLmRhdGEsIGlkcyA9IFtdO1xuXHRcdFx0Zm9yKGkgaW4gbSkge1xuXHRcdFx0XHRpZihtLmhhc093blByb3BlcnR5KGkpICYmIGkgIT09ICQuanN0cmVlLnJvb3QgJiYgbVtpXS5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0XHRtW2ldLnN0YXRlLmhpZGRlbiA9IGZhbHNlO1xuXHRcdFx0XHRcdGlkcy5wdXNoKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9tb2RlbC5mb3JjZV9mdWxsX3JlZHJhdyA9IHRydWU7XG5cdFx0XHRpZighc2tpcF9yZWRyYXcpIHtcblx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYWxsIG5vZGVzIGFyZSBzaG93blxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzaG93X2FsbC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIHRoZSBJRHMgb2YgYWxsIHNob3duIG5vZGVzXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2hvd19hbGwnLCB7ICdub2RlcycgOiBpZHMgfSk7XG5cdFx0XHRyZXR1cm4gaWRzO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2FsbGVkIHdoZW4gYSBub2RlIGlzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAbmFtZSBhY3RpdmF0ZV9ub2RlKG9iaiwgZSlcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gZSB0aGUgcmVsYXRlZCBldmVudFxuXHRcdCAqIEB0cmlnZ2VyIGFjdGl2YXRlX25vZGUuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGFjdGl2YXRlX25vZGUgOiBmdW5jdGlvbiAob2JqLCBlKSB7XG5cdFx0XHRpZih0aGlzLmlzX2Rpc2FibGVkKG9iaikpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoIWUgfHwgdHlwZW9mIGUgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGUgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZW5zdXJlIGxhc3RfY2xpY2tlZCBpcyBzdGlsbCBpbiB0aGUgRE9NLCBtYWtlIGl0IGZyZXNoIChtYXliZSBpdCB3YXMgbW92ZWQ/KSBhbmQgbWFrZSBzdXJlIGl0IGlzIHN0aWxsIHNlbGVjdGVkLCBpZiBub3QgLSBtYWtlIGxhc3RfY2xpY2tlZCB0aGUgbGFzdCBzZWxlY3RlZCBub2RlXG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkID0gdGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZCAmJiB0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkLmlkICE9PSB1bmRlZmluZWQgPyB0aGlzLmdldF9ub2RlKHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQuaWQpIDogbnVsbDtcblx0XHRcdGlmKHRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQgJiYgIXRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQuc3RhdGUuc2VsZWN0ZWQpIHsgdGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZCA9IG51bGw7IH1cblx0XHRcdGlmKCF0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkICYmIHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5sZW5ndGgpIHsgdGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZCA9IHRoaXMuZ2V0X25vZGUodGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkW3RoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5sZW5ndGggLSAxXSk7IH1cblxuXHRcdFx0aWYoIXRoaXMuc2V0dGluZ3MuY29yZS5tdWx0aXBsZSB8fCAoIWUubWV0YUtleSAmJiAhZS5jdHJsS2V5ICYmICFlLnNoaWZ0S2V5KSB8fCAoZS5zaGlmdEtleSAmJiAoIXRoaXMuX2RhdGEuY29yZS5sYXN0X2NsaWNrZWQgfHwgIXRoaXMuZ2V0X3BhcmVudChvYmopIHx8IHRoaXMuZ2V0X3BhcmVudChvYmopICE9PSB0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkLnBhcmVudCApICkpIHtcblx0XHRcdFx0aWYoIXRoaXMuc2V0dGluZ3MuY29yZS5tdWx0aXBsZSAmJiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5KSAmJiB0aGlzLmlzX3NlbGVjdGVkKG9iaikpIHtcblx0XHRcdFx0XHR0aGlzLmRlc2VsZWN0X25vZGUob2JqLCBmYWxzZSwgZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5kZXNlbGVjdF9hbGwodHJ1ZSk7XG5cdFx0XHRcdFx0dGhpcy5zZWxlY3Rfbm9kZShvYmosIGZhbHNlLCBmYWxzZSwgZSk7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZCA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmKGUuc2hpZnRLZXkpIHtcblx0XHRcdFx0XHR2YXIgbyA9IHRoaXMuZ2V0X25vZGUob2JqKS5pZCxcblx0XHRcdFx0XHRcdGwgPSB0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkLmlkLFxuXHRcdFx0XHRcdFx0cCA9IHRoaXMuZ2V0X25vZGUodGhpcy5fZGF0YS5jb3JlLmxhc3RfY2xpY2tlZC5wYXJlbnQpLmNoaWxkcmVuLFxuXHRcdFx0XHRcdFx0YyA9IGZhbHNlLFxuXHRcdFx0XHRcdFx0aSwgajtcblx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBwLmxlbmd0aDsgaSA8IGo7IGkgKz0gMSkge1xuXHRcdFx0XHRcdFx0Ly8gc2VwYXJhdGUgSUZzIHdvcmsgd2hlbSBvIGFuZCBsIGFyZSB0aGUgc2FtZVxuXHRcdFx0XHRcdFx0aWYocFtpXSA9PT0gbykge1xuXHRcdFx0XHRcdFx0XHRjID0gIWM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihwW2ldID09PSBsKSB7XG5cdFx0XHRcdFx0XHRcdGMgPSAhYztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKCF0aGlzLmlzX2Rpc2FibGVkKHBbaV0pICYmIChjIHx8IHBbaV0gPT09IG8gfHwgcFtpXSA9PT0gbCkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF0aGlzLmlzX2hpZGRlbihwW2ldKSkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2VsZWN0X25vZGUocFtpXSwgdHJ1ZSwgZmFsc2UsIGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5kZXNlbGVjdF9ub2RlKHBbaV0sIHRydWUsIGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ3NlbGVjdF9ub2RlJywgJ25vZGUnIDogdGhpcy5nZXRfbm9kZShvYmopLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAnZXZlbnQnIDogZSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpZighdGhpcy5pc19zZWxlY3RlZChvYmopKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNlbGVjdF9ub2RlKG9iaiwgZmFsc2UsIGZhbHNlLCBlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLmRlc2VsZWN0X25vZGUob2JqLCBmYWxzZSwgZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgY2xpY2tlZCBvciBpbnRlcmNhdGVkIHdpdGggYnkgdGhlIHVzZXJcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgYWN0aXZhdGVfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgdGhlIG9vcmlnaW5hbCBldmVudCAoaWYgYW55KSB3aGljaCB0cmlnZ2VyZWQgdGhlIGNhbGwgKG1heSBiZSBhbiBlbXB0eSBvYmplY3QpXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignYWN0aXZhdGVfbm9kZScsIHsgJ25vZGUnIDogdGhpcy5nZXRfbm9kZShvYmopLCAnZXZlbnQnIDogZSB9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGFwcGxpZXMgdGhlIGhvdmVyIHN0YXRlIG9uIGEgbm9kZSwgY2FsbGVkIHdoZW4gYSBub2RlIGlzIGhvdmVyZWQgYnkgdGhlIHVzZXIuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIGhvdmVyX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9ialxuXHRcdCAqIEB0cmlnZ2VyIGhvdmVyX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0aG92ZXJfbm9kZSA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKCFvYmogfHwgIW9iai5sZW5ndGggfHwgb2JqLmNoaWxkcmVuKCcuanN0cmVlLWhvdmVyZWQnKS5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG8gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS1ob3ZlcmVkJyksIHQgPSB0aGlzLmVsZW1lbnQ7XG5cdFx0XHRpZihvICYmIG8ubGVuZ3RoKSB7IHRoaXMuZGVob3Zlcl9ub2RlKG8pOyB9XG5cblx0XHRcdG9iai5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcygnanN0cmVlLWhvdmVyZWQnKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBob3ZlcmVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGhvdmVyX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2hvdmVyX25vZGUnLCB7ICdub2RlJyA6IHRoaXMuZ2V0X25vZGUob2JqKSB9KTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0LmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsIG9ialswXS5pZCk7IH0sIDApO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmVtb3ZlcyB0aGUgaG92ZXIgc3RhdGUgZnJvbSBhIG5vZGVjYWxsZWQgd2hlbiBhIG5vZGUgaXMgbm8gbG9uZ2VyIGhvdmVyZWQgYnkgdGhlIHVzZXIuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIGRlaG92ZXJfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqXG5cdFx0ICogQHRyaWdnZXIgZGVob3Zlcl9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGRlaG92ZXJfbm9kZSA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKCFvYmogfHwgIW9iai5sZW5ndGggfHwgIW9iai5jaGlsZHJlbignLmpzdHJlZS1ob3ZlcmVkJykubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdG9iai5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5yZW1vdmVDbGFzcygnanN0cmVlLWhvdmVyZWQnKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBubyBsb25nZXIgaG92ZXJlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBkZWhvdmVyX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2RlaG92ZXJfbm9kZScsIHsgJ25vZGUnIDogdGhpcy5nZXRfbm9kZShvYmopIH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc2VsZWN0IGEgbm9kZVxuXHRcdCAqIEBuYW1lIHNlbGVjdF9ub2RlKG9iaiBbLCBzdXByZXNzX2V2ZW50LCBwcmV2ZW50X29wZW5dKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiBhbiBhcnJheSBjYW4gYmUgdXNlZCB0byBzZWxlY3QgbXVsdGlwbGUgbm9kZXNcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHN1cHJlc3NfZXZlbnQgaWYgc2V0IHRvIGB0cnVlYCB0aGUgYGNoYW5nZWQuanN0cmVlYCBldmVudCB3b24ndCBiZSB0cmlnZ2VyZWRcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHByZXZlbnRfb3BlbiBpZiBzZXQgdG8gYHRydWVgIHBhcmVudHMgb2YgdGhlIHNlbGVjdGVkIG5vZGUgd29uJ3QgYmUgb3BlbmVkXG5cdFx0ICogQHRyaWdnZXIgc2VsZWN0X25vZGUuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHNlbGVjdF9ub2RlIDogZnVuY3Rpb24gKG9iaiwgc3VwcmVzc19ldmVudCwgcHJldmVudF9vcGVuLCBlKSB7XG5cdFx0XHR2YXIgZG9tLCB0MSwgdDIsIHRoO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuc2VsZWN0X25vZGUob2JqW3QxXSwgc3VwcmVzc19ldmVudCwgcHJldmVudF9vcGVuLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKCFvYmouc3RhdGUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0b2JqLnN0YXRlLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLnB1c2gob2JqLmlkKTtcblx0XHRcdFx0aWYoIXByZXZlbnRfb3Blbikge1xuXHRcdFx0XHRcdGRvbSA9IHRoaXMuX29wZW5fdG8ob2JqKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihkb20gJiYgZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdGRvbS5hdHRyKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3MoJ2pzdHJlZS1jbGlja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgc2VsZWN0ZWRcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIHNlbGVjdF9ub2RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBldmVudCAoaWYgYW55KSB0aGF0IHRyaWdnZXJlZCB0aGlzIHNlbGVjdF9ub2RlXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3NlbGVjdF9ub2RlJywgeyAnbm9kZScgOiBvYmosICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICdldmVudCcgOiBlIH0pO1xuXHRcdFx0XHRpZighc3VwcmVzc19ldmVudCkge1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIHNlbGVjdGlvbiBjaGFuZ2VzXG5cdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0ICogQG5hbWUgY2hhbmdlZC5qc3RyZWVcblx0XHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gdGhlIGFjdGlvbiB0aGF0IGNhdXNlZCB0aGUgc2VsZWN0aW9uIHRvIGNoYW5nZVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgZXZlbnQgKGlmIGFueSkgdGhhdCB0cmlnZ2VyZWQgdGhpcyBjaGFuZ2VkIGV2ZW50XG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdzZWxlY3Rfbm9kZScsICdub2RlJyA6IG9iaiwgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJ2V2ZW50JyA6IGUgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGRlc2VsZWN0IGEgbm9kZVxuXHRcdCAqIEBuYW1lIGRlc2VsZWN0X25vZGUob2JqIFssIHN1cHJlc3NfZXZlbnRdKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiBhbiBhcnJheSBjYW4gYmUgdXNlZCB0byBkZXNlbGVjdCBtdWx0aXBsZSBub2Rlc1xuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc3VwcmVzc19ldmVudCBpZiBzZXQgdG8gYHRydWVgIHRoZSBgY2hhbmdlZC5qc3RyZWVgIGV2ZW50IHdvbid0IGJlIHRyaWdnZXJlZFxuXHRcdCAqIEB0cmlnZ2VyIGRlc2VsZWN0X25vZGUuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGRlc2VsZWN0X25vZGUgOiBmdW5jdGlvbiAob2JqLCBzdXByZXNzX2V2ZW50LCBlKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBkb207XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5kZXNlbGVjdF9ub2RlKG9ialt0MV0sIHN1cHJlc3NfZXZlbnQsIGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYob2JqLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgPSAkLnZha2F0YS5hcnJheV9yZW1vdmVfaXRlbSh0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsIG9iai5pZCk7XG5cdFx0XHRcdGlmKGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRkb20uYXR0cignYXJpYS1zZWxlY3RlZCcsIGZhbHNlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5yZW1vdmVDbGFzcygnanN0cmVlLWNsaWNrZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSBpcyBkZXNlbGVjdGVkXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBkZXNlbGVjdF9ub2RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBldmVudCAoaWYgYW55KSB0aGF0IHRyaWdnZXJlZCB0aGlzIGRlc2VsZWN0X25vZGVcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignZGVzZWxlY3Rfbm9kZScsIHsgJ25vZGUnIDogb2JqLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAnZXZlbnQnIDogZSB9KTtcblx0XHRcdFx0aWYoIXN1cHJlc3NfZXZlbnQpIHtcblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ2Rlc2VsZWN0X25vZGUnLCAnbm9kZScgOiBvYmosICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICdldmVudCcgOiBlIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzZWxlY3QgYWxsIG5vZGVzIGluIHRoZSB0cmVlXG5cdFx0ICogQG5hbWUgc2VsZWN0X2FsbChbc3VwcmVzc19ldmVudF0pXG5cdFx0ICogQHBhcmFtIHtCb29sZWFufSBzdXByZXNzX2V2ZW50IGlmIHNldCB0byBgdHJ1ZWAgdGhlIGBjaGFuZ2VkLmpzdHJlZWAgZXZlbnQgd29uJ3QgYmUgdHJpZ2dlcmVkXG5cdFx0ICogQHRyaWdnZXIgc2VsZWN0X2FsbC5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICovXG5cdFx0c2VsZWN0X2FsbCA6IGZ1bmN0aW9uIChzdXByZXNzX2V2ZW50KSB7XG5cdFx0XHR2YXIgdG1wID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmNvbmNhdChbXSksIGksIGo7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgPSB0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdLmNoaWxkcmVuX2QuY29uY2F0KCk7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkW2ldXSkge1xuXHRcdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkW2ldXS5zdGF0ZS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMucmVkcmF3KHRydWUpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbGwgbm9kZXMgYXJlIHNlbGVjdGVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNlbGVjdF9hbGwuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzZWxlY3RfYWxsJywgeyAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkIH0pO1xuXHRcdFx0aWYoIXN1cHJlc3NfZXZlbnQpIHtcblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdzZWxlY3RfYWxsJywgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJ29sZF9zZWxlY3Rpb24nIDogdG1wIH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZGVzZWxlY3QgYWxsIHNlbGVjdGVkIG5vZGVzXG5cdFx0ICogQG5hbWUgZGVzZWxlY3RfYWxsKFtzdXByZXNzX2V2ZW50XSlcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHN1cHJlc3NfZXZlbnQgaWYgc2V0IHRvIGB0cnVlYCB0aGUgYGNoYW5nZWQuanN0cmVlYCBldmVudCB3b24ndCBiZSB0cmlnZ2VyZWRcblx0XHQgKiBAdHJpZ2dlciBkZXNlbGVjdF9hbGwuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqL1xuXHRcdGRlc2VsZWN0X2FsbCA6IGZ1bmN0aW9uIChzdXByZXNzX2V2ZW50KSB7XG5cdFx0XHR2YXIgdG1wID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmNvbmNhdChbXSksIGksIGo7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkW2ldXSkge1xuXHRcdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkW2ldXS5zdGF0ZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgPSBbXTtcblx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLWNsaWNrZWQnKS5yZW1vdmVDbGFzcygnanN0cmVlLWNsaWNrZWQnKS5wYXJlbnQoKS5hdHRyKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbGwgbm9kZXMgYXJlIGRlc2VsZWN0ZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgZGVzZWxlY3RfYWxsLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIHByZXZpb3VzIHNlbGVjdGlvblxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignZGVzZWxlY3RfYWxsJywgeyAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAnbm9kZScgOiB0bXAgfSk7XG5cdFx0XHRpZighc3VwcmVzc19ldmVudCkge1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7ICdhY3Rpb24nIDogJ2Rlc2VsZWN0X2FsbCcsICdzZWxlY3RlZCcgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQsICdvbGRfc2VsZWN0aW9uJyA6IHRtcCB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNoZWNrcyBpZiBhIG5vZGUgaXMgc2VsZWN0ZWRcblx0XHQgKiBAbmFtZSBpc19zZWxlY3RlZChvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGlzX3NlbGVjdGVkIDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9iai5zdGF0ZS5zZWxlY3RlZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCBhbiBhcnJheSBvZiBhbGwgc2VsZWN0ZWQgbm9kZXNcblx0XHQgKiBAbmFtZSBnZXRfc2VsZWN0ZWQoW2Z1bGxdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgZnVsbCBpZiBzZXQgdG8gYHRydWVgIHRoZSByZXR1cm5lZCBhcnJheSB3aWxsIGNvbnNpc3Qgb2YgdGhlIGZ1bGwgbm9kZSBvYmplY3RzLCBvdGhlcndpc2UgLSBvbmx5IElEcyB3aWxsIGJlIHJldHVybmVkXG5cdFx0ICogQHJldHVybiB7QXJyYXl9XG5cdFx0ICovXG5cdFx0Z2V0X3NlbGVjdGVkIDogZnVuY3Rpb24gKGZ1bGwpIHtcblx0XHRcdHJldHVybiBmdWxsID8gJC5tYXAodGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCAkLnByb3h5KGZ1bmN0aW9uIChpKSB7IHJldHVybiB0aGlzLmdldF9ub2RlKGkpOyB9LCB0aGlzKSkgOiB0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQuc2xpY2UoKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGdldCBhbiBhcnJheSBvZiBhbGwgdG9wIGxldmVsIHNlbGVjdGVkIG5vZGVzIChpZ25vcmluZyBjaGlsZHJlbiBvZiBzZWxlY3RlZCBub2Rlcylcblx0XHQgKiBAbmFtZSBnZXRfdG9wX3NlbGVjdGVkKFtmdWxsXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gIGZ1bGwgaWYgc2V0IHRvIGB0cnVlYCB0aGUgcmV0dXJuZWQgYXJyYXkgd2lsbCBjb25zaXN0IG9mIHRoZSBmdWxsIG5vZGUgb2JqZWN0cywgb3RoZXJ3aXNlIC0gb25seSBJRHMgd2lsbCBiZSByZXR1cm5lZFxuXHRcdCAqIEByZXR1cm4ge0FycmF5fVxuXHRcdCAqL1xuXHRcdGdldF90b3Bfc2VsZWN0ZWQgOiBmdW5jdGlvbiAoZnVsbCkge1xuXHRcdFx0dmFyIHRtcCA9IHRoaXMuZ2V0X3NlbGVjdGVkKHRydWUpLFxuXHRcdFx0XHRvYmogPSB7fSwgaSwgaiwgaywgbDtcblx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0b2JqW3RtcFtpXS5pZF0gPSB0bXBbaV07XG5cdFx0XHR9XG5cdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGZvcihrID0gMCwgbCA9IHRtcFtpXS5jaGlsZHJlbl9kLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdGlmKG9ialt0bXBbaV0uY2hpbGRyZW5fZFtrXV0pIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSBvYmpbdG1wW2ldLmNoaWxkcmVuX2Rba11dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dG1wID0gW107XG5cdFx0XHRmb3IoaSBpbiBvYmopIHtcblx0XHRcdFx0aWYob2JqLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0dG1wLnB1c2goaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmdWxsID8gJC5tYXAodG1wLCAkLnByb3h5KGZ1bmN0aW9uIChpKSB7IHJldHVybiB0aGlzLmdldF9ub2RlKGkpOyB9LCB0aGlzKSkgOiB0bXA7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgYW4gYXJyYXkgb2YgYWxsIGJvdHRvbSBsZXZlbCBzZWxlY3RlZCBub2RlcyAoaWdub3Jpbmcgc2VsZWN0ZWQgcGFyZW50cylcblx0XHQgKiBAbmFtZSBnZXRfYm90dG9tX3NlbGVjdGVkKFtmdWxsXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gIGZ1bGwgaWYgc2V0IHRvIGB0cnVlYCB0aGUgcmV0dXJuZWQgYXJyYXkgd2lsbCBjb25zaXN0IG9mIHRoZSBmdWxsIG5vZGUgb2JqZWN0cywgb3RoZXJ3aXNlIC0gb25seSBJRHMgd2lsbCBiZSByZXR1cm5lZFxuXHRcdCAqIEByZXR1cm4ge0FycmF5fVxuXHRcdCAqL1xuXHRcdGdldF9ib3R0b21fc2VsZWN0ZWQgOiBmdW5jdGlvbiAoZnVsbCkge1xuXHRcdFx0dmFyIHRtcCA9IHRoaXMuZ2V0X3NlbGVjdGVkKHRydWUpLFxuXHRcdFx0XHRvYmogPSBbXSwgaSwgajtcblx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYoIXRtcFtpXS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRvYmoucHVzaCh0bXBbaV0uaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnVsbCA/ICQubWFwKG9iaiwgJC5wcm94eShmdW5jdGlvbiAoaSkgeyByZXR1cm4gdGhpcy5nZXRfbm9kZShpKTsgfSwgdGhpcykpIDogb2JqO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdHJlZSBzbyB0aGF0IGl0IGNhbiBiZSByZXN0b3JlZCBsYXRlciB3aXRoIGBzZXRfc3RhdGUoc3RhdGUpYC4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBuYW1lIGdldF9zdGF0ZSgpXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0Z2V0X3N0YXRlIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHN0YXRlXHQ9IHtcblx0XHRcdFx0J2NvcmUnIDoge1xuXHRcdFx0XHRcdCdvcGVuJyA6IFtdLFxuXHRcdFx0XHRcdCdsb2FkZWQnIDogW10sXG5cdFx0XHRcdFx0J3Njcm9sbCcgOiB7XG5cdFx0XHRcdFx0XHQnbGVmdCcgOiB0aGlzLmVsZW1lbnQuc2Nyb2xsTGVmdCgpLFxuXHRcdFx0XHRcdFx0J3RvcCcgOiB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wKClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdC8qIVxuXHRcdFx0XHRcdCd0aGVtZXMnIDoge1xuXHRcdFx0XHRcdFx0J25hbWUnIDogdGhpcy5nZXRfdGhlbWUoKSxcblx0XHRcdFx0XHRcdCdpY29ucycgOiB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmljb25zLFxuXHRcdFx0XHRcdFx0J2RvdHMnIDogdGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5kb3RzXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQqL1xuXHRcdFx0XHRcdCdzZWxlY3RlZCcgOiBbXVxuXHRcdFx0XHR9XG5cdFx0XHR9LCBpO1xuXHRcdFx0Zm9yKGkgaW4gdGhpcy5fbW9kZWwuZGF0YSkge1xuXHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0aWYoaSAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVtpXS5zdGF0ZS5sb2FkZWQgJiYgdGhpcy5zZXR0aW5ncy5jb3JlLmxvYWRlZF9zdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRzdGF0ZS5jb3JlLmxvYWRlZC5wdXNoKGkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVtpXS5zdGF0ZS5vcGVuZWQpIHtcblx0XHRcdFx0XHRcdFx0c3RhdGUuY29yZS5vcGVuLnB1c2goaSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih0aGlzLl9tb2RlbC5kYXRhW2ldLnN0YXRlLnNlbGVjdGVkKSB7XG5cdFx0XHRcdFx0XHRcdHN0YXRlLmNvcmUuc2VsZWN0ZWQucHVzaChpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHNldHMgdGhlIHN0YXRlIG9mIHRoZSB0cmVlLiBVc2VkIGludGVybmFsbHkuXG5cdFx0ICogQG5hbWUgc2V0X3N0YXRlKHN0YXRlIFssIGNhbGxiYWNrXSlcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSB0aGUgc3RhdGUgdG8gcmVzdG9yZS4gS2VlcCBpbiBtaW5kIHRoaXMgb2JqZWN0IGlzIHBhc3NlZCBieSByZWZlcmVuY2UgYW5kIGpzdHJlZSB3aWxsIG1vZGlmeSBpdC5cblx0XHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBhbiBvcHRpb25hbCBmdW5jdGlvbiB0byBleGVjdXRlIG9uY2UgdGhlIHN0YXRlIGlzIHJlc3RvcmVkLlxuXHRcdCAqIEB0cmlnZ2VyIHNldF9zdGF0ZS5qc3RyZWVcblx0XHQgKi9cblx0XHRzZXRfc3RhdGUgOiBmdW5jdGlvbiAoc3RhdGUsIGNhbGxiYWNrKSB7XG5cdFx0XHRpZihzdGF0ZSkge1xuXHRcdFx0XHRpZihzdGF0ZS5jb3JlICYmIHN0YXRlLmNvcmUuc2VsZWN0ZWQgJiYgc3RhdGUuY29yZS5pbml0aWFsX3NlbGVjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0c3RhdGUuY29yZS5pbml0aWFsX3NlbGVjdGlvbiA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5jb25jYXQoW10pLnNvcnQoKS5qb2luKCcsJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoc3RhdGUuY29yZSkge1xuXHRcdFx0XHRcdHZhciByZXMsIG4sIHQsIF90aGlzLCBpO1xuXHRcdFx0XHRcdGlmKHN0YXRlLmNvcmUubG9hZGVkKSB7XG5cdFx0XHRcdFx0XHRpZighdGhpcy5zZXR0aW5ncy5jb3JlLmxvYWRlZF9zdGF0ZSB8fCAhJC5pc0FycmF5KHN0YXRlLmNvcmUubG9hZGVkKSB8fCAhc3RhdGUuY29yZS5sb2FkZWQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBzdGF0ZS5jb3JlLmxvYWRlZDtcblx0XHRcdFx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9sb2FkX25vZGVzKHN0YXRlLmNvcmUubG9hZGVkLCBmdW5jdGlvbiAobm9kZXMpIHtcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgc3RhdGUuY29yZS5sb2FkZWQ7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHN0YXRlLmNvcmUub3Blbikge1xuXHRcdFx0XHRcdFx0aWYoISQuaXNBcnJheShzdGF0ZS5jb3JlLm9wZW4pIHx8ICFzdGF0ZS5jb3JlLm9wZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBzdGF0ZS5jb3JlLm9wZW47XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0X3N0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fbG9hZF9ub2RlcyhzdGF0ZS5jb3JlLm9wZW4sIGZ1bmN0aW9uIChub2Rlcykge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMub3Blbl9ub2RlKG5vZGVzLCBmYWxzZSwgMCk7XG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHN0YXRlLmNvcmUub3Blbjtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNldF9zdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoc3RhdGUuY29yZS5zY3JvbGwpIHtcblx0XHRcdFx0XHRcdGlmKHN0YXRlLmNvcmUuc2Nyb2xsICYmIHN0YXRlLmNvcmUuc2Nyb2xsLmxlZnQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuc2Nyb2xsTGVmdChzdGF0ZS5jb3JlLnNjcm9sbC5sZWZ0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHN0YXRlLmNvcmUuc2Nyb2xsICYmIHN0YXRlLmNvcmUuc2Nyb2xsLnRvcCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5zY3JvbGxUb3Aoc3RhdGUuY29yZS5zY3JvbGwudG9wKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGRlbGV0ZSBzdGF0ZS5jb3JlLnNjcm9sbDtcblx0XHRcdFx0XHRcdHRoaXMuc2V0X3N0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHN0YXRlLmNvcmUuc2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdF90aGlzID0gdGhpcztcblx0XHRcdFx0XHRcdGlmIChzdGF0ZS5jb3JlLmluaXRpYWxfc2VsZWN0aW9uID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0XHRcdFx0c3RhdGUuY29yZS5pbml0aWFsX3NlbGVjdGlvbiA9PT0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmNvbmNhdChbXSkuc29ydCgpLmpvaW4oJywnKVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuZGVzZWxlY3RfYWxsKCk7XG5cdFx0XHRcdFx0XHRcdCQuZWFjaChzdGF0ZS5jb3JlLnNlbGVjdGVkLCBmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRcdFx0XHRcdF90aGlzLnNlbGVjdF9ub2RlKHYsIGZhbHNlLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRkZWxldGUgc3RhdGUuY29yZS5pbml0aWFsX3NlbGVjdGlvbjtcblx0XHRcdFx0XHRcdGRlbGV0ZSBzdGF0ZS5jb3JlLnNlbGVjdGVkO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Zm9yKGkgaW4gc3RhdGUpIHtcblx0XHRcdFx0XHRcdGlmKHN0YXRlLmhhc093blByb3BlcnR5KGkpICYmIGkgIT09IFwiY29yZVwiICYmICQuaW5BcnJheShpLCB0aGlzLnNldHRpbmdzLnBsdWdpbnMpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgc3RhdGVbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKCQuaXNFbXB0eU9iamVjdChzdGF0ZS5jb3JlKSkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHN0YXRlLmNvcmU7XG5cdFx0XHRcdFx0XHR0aGlzLnNldF9zdGF0ZShzdGF0ZSwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZigkLmlzRW1wdHlPYmplY3Qoc3RhdGUpKSB7XG5cdFx0XHRcdFx0c3RhdGUgPSBudWxsO1xuXHRcdFx0XHRcdGlmKGNhbGxiYWNrKSB7IGNhbGxiYWNrLmNhbGwodGhpcyk7IH1cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIGBzZXRfc3RhdGVgIGNhbGwgY29tcGxldGVzXG5cdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0ICogQG5hbWUgc2V0X3N0YXRlLmpzdHJlZVxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdHRoaXMudHJpZ2dlcignc2V0X3N0YXRlJyk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmVmcmVzaGVzIHRoZSB0cmVlIC0gYWxsIG5vZGVzIGFyZSByZWxvYWRlZCB3aXRoIGNhbGxzIHRvIGBsb2FkX25vZGVgLlxuXHRcdCAqIEBuYW1lIHJlZnJlc2goKVxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc2tpcF9sb2FkaW5nIGFuIG9wdGlvbiB0byBza2lwIHNob3dpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yXG5cdFx0ICogQHBhcmFtIHtNaXhlZH0gZm9yZ2V0X3N0YXRlIGlmIHNldCB0byBgdHJ1ZWAgc3RhdGUgd2lsbCBub3QgYmUgcmVhcHBsaWVkLCBpZiBzZXQgdG8gYSBmdW5jdGlvbiAocmVjZWl2aW5nIHRoZSBjdXJyZW50IHN0YXRlIGFzIGFyZ3VtZW50KSB0aGUgcmVzdWx0IG9mIHRoYXQgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIGFzIHN0YXRlXG5cdFx0ICogQHRyaWdnZXIgcmVmcmVzaC5qc3RyZWVcblx0XHQgKi9cblx0XHRyZWZyZXNoIDogZnVuY3Rpb24gKHNraXBfbG9hZGluZywgZm9yZ2V0X3N0YXRlKSB7XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUuc3RhdGUgPSBmb3JnZXRfc3RhdGUgPT09IHRydWUgPyB7fSA6IHRoaXMuZ2V0X3N0YXRlKCk7XG5cdFx0XHRpZihmb3JnZXRfc3RhdGUgJiYgJC5pc0Z1bmN0aW9uKGZvcmdldF9zdGF0ZSkpIHsgdGhpcy5fZGF0YS5jb3JlLnN0YXRlID0gZm9yZ2V0X3N0YXRlLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLnN0YXRlKTsgfVxuXHRcdFx0dGhpcy5fY250ID0gMDtcblx0XHRcdHRoaXMuX21vZGVsLmRhdGEgPSB7fTtcblx0XHRcdHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF0gPSB7XG5cdFx0XHRcdGlkIDogJC5qc3RyZWUucm9vdCxcblx0XHRcdFx0cGFyZW50IDogbnVsbCxcblx0XHRcdFx0cGFyZW50cyA6IFtdLFxuXHRcdFx0XHRjaGlsZHJlbiA6IFtdLFxuXHRcdFx0XHRjaGlsZHJlbl9kIDogW10sXG5cdFx0XHRcdHN0YXRlIDogeyBsb2FkZWQgOiBmYWxzZSB9XG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkID0gW107XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9jbGlja2VkID0gbnVsbDtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkID0gbnVsbDtcblxuXHRcdFx0dmFyIGMgPSB0aGlzLmdldF9jb250YWluZXJfdWwoKVswXS5jbGFzc05hbWU7XG5cdFx0XHRpZighc2tpcF9sb2FkaW5nKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5odG1sKFwiPFwiK1widWwgY2xhc3M9J1wiK2MrXCInIHJvbGU9J2dyb3VwJz48XCIrXCJsaSBjbGFzcz0nanN0cmVlLWluaXRpYWwtbm9kZSBqc3RyZWUtbG9hZGluZyBqc3RyZWUtbGVhZiBqc3RyZWUtbGFzdCcgcm9sZT0ndHJlZWl0ZW0nIGlkPSdqXCIrdGhpcy5faWQrXCJfbG9hZGluZyc+PGkgY2xhc3M9J2pzdHJlZS1pY29uIGpzdHJlZS1vY2wnPjwvaT48XCIrXCJhIGNsYXNzPSdqc3RyZWUtYW5jaG9yJyBocmVmPScjJz48aSBjbGFzcz0nanN0cmVlLWljb24ganN0cmVlLXRoZW1laWNvbi1oaWRkZW4nPjwvaT5cIiArIHRoaXMuZ2V0X3N0cmluZyhcIkxvYWRpbmcgLi4uXCIpICsgXCI8L2E+PC9saT48L3VsPlwiKTtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsJ2onK3RoaXMuX2lkKydfbG9hZGluZycpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5sb2FkX25vZGUoJC5qc3RyZWUucm9vdCwgZnVuY3Rpb24gKG8sIHMpIHtcblx0XHRcdFx0aWYocykge1xuXHRcdFx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdLmNsYXNzTmFtZSA9IGM7XG5cdFx0XHRcdFx0aWYodGhpcy5fZmlyc3RDaGlsZCh0aGlzLmdldF9jb250YWluZXJfdWwoKVswXSkpIHtcblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLHRoaXMuX2ZpcnN0Q2hpbGQodGhpcy5nZXRfY29udGFpbmVyX3VsKClbMF0pLmlkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX2RhdGEuY29yZS5zdGF0ZSksIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBgcmVmcmVzaGAgY2FsbCBjb21wbGV0ZXNcblx0XHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdFx0ICogQG5hbWUgcmVmcmVzaC5qc3RyZWVcblx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0dGhpcy50cmlnZ2VyKCdyZWZyZXNoJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLnN0YXRlID0gbnVsbDtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmVmcmVzaGVzIGEgbm9kZSBpbiB0aGUgdHJlZSAocmVsb2FkIGl0cyBjaGlsZHJlbikgYWxsIG9wZW5lZCBub2RlcyBpbnNpZGUgdGhhdCBub2RlIGFyZSByZWxvYWRlZCB3aXRoIGNhbGxzIHRvIGBsb2FkX25vZGVgLlxuXHRcdCAqIEBuYW1lIHJlZnJlc2hfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqIEB0cmlnZ2VyIHJlZnJlc2hfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRyZWZyZXNoX25vZGUgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciBvcGVuZWQgPSBbXSwgdG9fbG9hZCA9IFtdLCBzID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmNvbmNhdChbXSk7XG5cdFx0XHR0b19sb2FkLnB1c2gob2JqLmlkKTtcblx0XHRcdGlmKG9iai5zdGF0ZS5vcGVuZWQgPT09IHRydWUpIHsgb3BlbmVkLnB1c2gob2JqLmlkKTsgfVxuXHRcdFx0dGhpcy5nZXRfbm9kZShvYmosIHRydWUpLmZpbmQoJy5qc3RyZWUtb3BlbicpLmVhY2goZnVuY3Rpb24oKSB7IHRvX2xvYWQucHVzaCh0aGlzLmlkKTsgb3BlbmVkLnB1c2godGhpcy5pZCk7IH0pO1xuXHRcdFx0dGhpcy5fbG9hZF9ub2Rlcyh0b19sb2FkLCAkLnByb3h5KGZ1bmN0aW9uIChub2Rlcykge1xuXHRcdFx0XHR0aGlzLm9wZW5fbm9kZShvcGVuZWQsIGZhbHNlLCAwKTtcblx0XHRcdFx0dGhpcy5zZWxlY3Rfbm9kZShzKTtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyByZWZyZXNoZWRcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIHJlZnJlc2hfbm9kZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgLSB0aGUgcmVmcmVzaGVkIG5vZGVcblx0XHRcdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgLSBhbiBhcnJheSBvZiB0aGUgSURzIG9mIHRoZSBub2RlcyB0aGF0IHdlcmUgcmVsb2FkZWRcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcigncmVmcmVzaF9ub2RlJywgeyAnbm9kZScgOiBvYmosICdub2RlcycgOiBub2RlcyB9KTtcblx0XHRcdH0sIHRoaXMpLCBmYWxzZSwgdHJ1ZSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBzZXQgKGNoYW5nZSkgdGhlIElEIG9mIGEgbm9kZVxuXHRcdCAqIEBuYW1lIHNldF9pZChvYmosIGlkKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGVcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGlkIHRoZSBuZXcgSURcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqIEB0cmlnZ2VyIHNldF9pZC5qc3RyZWVcblx0XHQgKi9cblx0XHRzZXRfaWQgOiBmdW5jdGlvbiAob2JqLCBpZCkge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR2YXIgaSwgaiwgbSA9IHRoaXMuX21vZGVsLmRhdGEsIG9sZCA9IG9iai5pZDtcblx0XHRcdGlkID0gaWQudG9TdHJpbmcoKTtcblx0XHRcdC8vIHVwZGF0ZSBwYXJlbnRzIChyZXBsYWNlIGN1cnJlbnQgSUQgd2l0aCBuZXcgb25lIGluIGNoaWxkcmVuIGFuZCBjaGlsZHJlbl9kKVxuXHRcdFx0bVtvYmoucGFyZW50XS5jaGlsZHJlblskLmluQXJyYXkob2JqLmlkLCBtW29iai5wYXJlbnRdLmNoaWxkcmVuKV0gPSBpZDtcblx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRtW29iai5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kWyQuaW5BcnJheShvYmouaWQsIG1bb2JqLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QpXSA9IGlkO1xuXHRcdFx0fVxuXHRcdFx0Ly8gdXBkYXRlIGNoaWxkcmVuIChyZXBsYWNlIGN1cnJlbnQgSUQgd2l0aCBuZXcgb25lIGluIHBhcmVudCBhbmQgcGFyZW50cylcblx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0bVtvYmouY2hpbGRyZW5baV1dLnBhcmVudCA9IGlkO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGkgPSAwLCBqID0gb2JqLmNoaWxkcmVuX2QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdG1bb2JqLmNoaWxkcmVuX2RbaV1dLnBhcmVudHNbJC5pbkFycmF5KG9iai5pZCwgbVtvYmouY2hpbGRyZW5fZFtpXV0ucGFyZW50cyldID0gaWQ7XG5cdFx0XHR9XG5cdFx0XHRpID0gJC5pbkFycmF5KG9iai5pZCwgdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkKTtcblx0XHRcdGlmKGkgIT09IC0xKSB7IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZFtpXSA9IGlkOyB9XG5cdFx0XHQvLyB1cGRhdGUgbW9kZWwgYW5kIG9iaiBpdHNlbGYgKG9iai5pZCwgdGhpcy5fbW9kZWwuZGF0YVtLRVldKVxuXHRcdFx0aSA9IHRoaXMuZ2V0X25vZGUob2JqLmlkLCB0cnVlKTtcblx0XHRcdGlmKGkpIHtcblx0XHRcdFx0aS5hdHRyKCdpZCcsIGlkKTsgLy8uY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYXR0cignaWQnLCBpZCArICdfYW5jaG9yJykuZW5kKCkuYXR0cignYXJpYS1sYWJlbGxlZGJ5JywgaWQgKyAnX2FuY2hvcicpO1xuXHRcdFx0XHRpZih0aGlzLmVsZW1lbnQuYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50JykgPT09IG9iai5pZCkge1xuXHRcdFx0XHRcdHRoaXMuZWxlbWVudC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBpZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGRlbGV0ZSBtW29iai5pZF07XG5cdFx0XHRvYmouaWQgPSBpZDtcblx0XHRcdG9iai5saV9hdHRyLmlkID0gaWQ7XG5cdFx0XHRtW2lkXSA9IG9iajtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlkIHZhbHVlIGlzIGNoYW5nZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2V0X2lkLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBvbGQgdGhlIG9sZCBpZFxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3NldF9pZCcseyBcIm5vZGVcIiA6IG9iaiwgXCJuZXdcIiA6IG9iai5pZCwgXCJvbGRcIiA6IG9sZCB9KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0IHRoZSB0ZXh0IHZhbHVlIG9mIGEgbm9kZVxuXHRcdCAqIEBuYW1lIGdldF90ZXh0KG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdGdldF90ZXh0IDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cmV0dXJuICghb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgPyBmYWxzZSA6IG9iai50ZXh0O1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc2V0IHRoZSB0ZXh0IHZhbHVlIG9mIGEgbm9kZS4gVXNlZCBpbnRlcm5hbGx5LCBwbGVhc2UgdXNlIGByZW5hbWVfbm9kZShvYmosIHZhbClgLlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgc2V0X3RleHQob2JqLCB2YWwpXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZSwgeW91IGNhbiBwYXNzIGFuIGFycmF5IHRvIHNldCB0aGUgdGV4dCBvbiBtdWx0aXBsZSBub2Rlc1xuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gdmFsIHRoZSBuZXcgdGV4dCB2YWx1ZVxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICogQHRyaWdnZXIgc2V0X3RleHQuanN0cmVlXG5cdFx0ICovXG5cdFx0c2V0X3RleHQgOiBmdW5jdGlvbiAob2JqLCB2YWwpIHtcblx0XHRcdHZhciB0MSwgdDI7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRfdGV4dChvYmpbdDFdLCB2YWwpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRvYmoudGV4dCA9IHZhbDtcblx0XHRcdGlmKHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKS5sZW5ndGgpIHtcblx0XHRcdFx0dGhpcy5yZWRyYXdfbm9kZShvYmouaWQpO1xuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgdGV4dCB2YWx1ZSBpcyBjaGFuZ2VkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNldF90ZXh0LmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG9ialxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRleHQgdGhlIG5ldyB2YWx1ZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3NldF90ZXh0Jyx7IFwib2JqXCIgOiBvYmosIFwidGV4dFwiIDogdmFsIH0pO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXRzIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiBhIG5vZGUgKG9yIHRoZSB3aG9sZSB0cmVlKVxuXHRcdCAqIEBuYW1lIGdldF9qc29uKFtvYmosIG9wdGlvbnNdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBvcHRpb25zLm5vX3N0YXRlIGRvIG5vdCByZXR1cm4gc3RhdGUgaW5mb3JtYXRpb25cblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBvcHRpb25zLm5vX2lkIGRvIG5vdCByZXR1cm4gSURcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBvcHRpb25zLm5vX2NoaWxkcmVuIGRvIG5vdCBpbmNsdWRlIGNoaWxkcmVuXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gb3B0aW9ucy5ub19kYXRhIGRvIG5vdCBpbmNsdWRlIG5vZGUgZGF0YVxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IG9wdGlvbnMubm9fbGlfYXR0ciBkbyBub3QgaW5jbHVkZSBMSSBhdHRyaWJ1dGVzXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gb3B0aW9ucy5ub19hX2F0dHIgZG8gbm90IGluY2x1ZGUgQSBhdHRyaWJ1dGVzXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gb3B0aW9ucy5mbGF0IHJldHVybiBmbGF0IEpTT04gaW5zdGVhZCBvZiBuZXN0ZWRcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0Z2V0X2pzb24gOiBmdW5jdGlvbiAob2JqLCBvcHRpb25zLCBmbGF0KSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaiB8fCAkLmpzdHJlZS5yb290KTtcblx0XHRcdGlmKCFvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMuZmxhdCAmJiAhZmxhdCkgeyBmbGF0ID0gW107IH1cblx0XHRcdHZhciB0bXAgPSB7XG5cdFx0XHRcdCdpZCcgOiBvYmouaWQsXG5cdFx0XHRcdCd0ZXh0JyA6IG9iai50ZXh0LFxuXHRcdFx0XHQnaWNvbicgOiB0aGlzLmdldF9pY29uKG9iaiksXG5cdFx0XHRcdCdsaV9hdHRyJyA6ICQuZXh0ZW5kKHRydWUsIHt9LCBvYmoubGlfYXR0ciksXG5cdFx0XHRcdCdhX2F0dHInIDogJC5leHRlbmQodHJ1ZSwge30sIG9iai5hX2F0dHIpLFxuXHRcdFx0XHQnc3RhdGUnIDoge30sXG5cdFx0XHRcdCdkYXRhJyA6IG9wdGlvbnMgJiYgb3B0aW9ucy5ub19kYXRhID8gZmFsc2UgOiAkLmV4dGVuZCh0cnVlLCAkLmlzQXJyYXkob2JqLmRhdGEpP1tdOnt9LCBvYmouZGF0YSlcblx0XHRcdFx0Ly8oIHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKS5sZW5ndGggPyB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSkuZGF0YSgpIDogb2JqLmRhdGEgKSxcblx0XHRcdH0sIGksIGo7XG5cdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMuZmxhdCkge1xuXHRcdFx0XHR0bXAucGFyZW50ID0gb2JqLnBhcmVudDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0bXAuY2hpbGRyZW4gPSBbXTtcblx0XHRcdH1cblx0XHRcdGlmKCFvcHRpb25zIHx8ICFvcHRpb25zLm5vX3N0YXRlKSB7XG5cdFx0XHRcdGZvcihpIGluIG9iai5zdGF0ZSkge1xuXHRcdFx0XHRcdGlmKG9iai5zdGF0ZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0dG1wLnN0YXRlW2ldID0gb2JqLnN0YXRlW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVsZXRlIHRtcC5zdGF0ZTtcblx0XHRcdH1cblx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5ub19saV9hdHRyKSB7XG5cdFx0XHRcdGRlbGV0ZSB0bXAubGlfYXR0cjtcblx0XHRcdH1cblx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5ub19hX2F0dHIpIHtcblx0XHRcdFx0ZGVsZXRlIHRtcC5hX2F0dHI7XG5cdFx0XHR9XG5cdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMubm9faWQpIHtcblx0XHRcdFx0ZGVsZXRlIHRtcC5pZDtcblx0XHRcdFx0aWYodG1wLmxpX2F0dHIgJiYgdG1wLmxpX2F0dHIuaWQpIHtcblx0XHRcdFx0XHRkZWxldGUgdG1wLmxpX2F0dHIuaWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYodG1wLmFfYXR0ciAmJiB0bXAuYV9hdHRyLmlkKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHRtcC5hX2F0dHIuaWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5mbGF0ICYmIG9iai5pZCAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRmbGF0LnB1c2godG1wKTtcblx0XHRcdH1cblx0XHRcdGlmKCFvcHRpb25zIHx8ICFvcHRpb25zLm5vX2NoaWxkcmVuKSB7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMuZmxhdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5nZXRfanNvbihvYmouY2hpbGRyZW5baV0sIG9wdGlvbnMsIGZsYXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRtcC5jaGlsZHJlbi5wdXNoKHRoaXMuZ2V0X2pzb24ob2JqLmNoaWxkcmVuW2ldLCBvcHRpb25zKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb3B0aW9ucyAmJiBvcHRpb25zLmZsYXQgPyBmbGF0IDogKG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCA/IHRtcC5jaGlsZHJlbiA6IHRtcCk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjcmVhdGUgYSBuZXcgbm9kZSAoZG8gbm90IGNvbmZ1c2Ugd2l0aCBsb2FkX25vZGUpXG5cdFx0ICogQG5hbWUgY3JlYXRlX25vZGUoW3Bhciwgbm9kZSwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gICBwYXIgICAgICAgdGhlIHBhcmVudCBub2RlICh0byBjcmVhdGUgYSByb290IG5vZGUgdXNlIGVpdGhlciBcIiNcIiAoc3RyaW5nKSBvciBgbnVsbGApXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICAgbm9kZSAgICAgIHRoZSBkYXRhIGZvciB0aGUgbmV3IG5vZGUgKGEgdmFsaWQgSlNPTiBvYmplY3QsIG9yIGEgc2ltcGxlIHN0cmluZyB3aXRoIHRoZSBuYW1lKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgIHBvcyAgICAgICB0aGUgaW5kZXggYXQgd2hpY2ggdG8gaW5zZXJ0IHRoZSBub2RlLCBcImZpcnN0XCIgYW5kIFwibGFzdFwiIGFyZSBhbHNvIHN1cHBvcnRlZCwgZGVmYXVsdCBpcyBcImxhc3RcIlxuXHRcdCAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbmNlIHRoZSBub2RlIGlzIGNyZWF0ZWRcblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBpc19sb2FkZWQgaW50ZXJuYWwgYXJndW1lbnQgaW5kaWNhdGluZyBpZiB0aGUgcGFyZW50IG5vZGUgd2FzIHN1Y2Nlc2Z1bGx5IGxvYWRlZFxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICB0aGUgSUQgb2YgdGhlIG5ld2x5IGNyZWF0ZSBub2RlXG5cdFx0ICogQHRyaWdnZXIgbW9kZWwuanN0cmVlLCBjcmVhdGVfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRjcmVhdGVfbm9kZSA6IGZ1bmN0aW9uIChwYXIsIG5vZGUsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCkge1xuXHRcdFx0aWYocGFyID09PSBudWxsKSB7IHBhciA9ICQuanN0cmVlLnJvb3Q7IH1cblx0XHRcdHBhciA9IHRoaXMuZ2V0X25vZGUocGFyKTtcblx0XHRcdGlmKCFwYXIpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRwb3MgPSBwb3MgPT09IHVuZGVmaW5lZCA/IFwibGFzdFwiIDogcG9zO1xuXHRcdFx0aWYoIXBvcy50b1N0cmluZygpLm1hdGNoKC9eKGJlZm9yZXxhZnRlcikkLykgJiYgIWlzX2xvYWRlZCAmJiAhdGhpcy5pc19sb2FkZWQocGFyKSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX25vZGUocGFyLCBmdW5jdGlvbiAoKSB7IHRoaXMuY3JlYXRlX25vZGUocGFyLCBub2RlLCBwb3MsIGNhbGxiYWNrLCB0cnVlKTsgfSk7XG5cdFx0XHR9XG5cdFx0XHRpZighbm9kZSkgeyBub2RlID0geyBcInRleHRcIiA6IHRoaXMuZ2V0X3N0cmluZygnTmV3IG5vZGUnKSB9OyB9XG5cdFx0XHRpZih0eXBlb2Ygbm9kZSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRub2RlID0geyBcInRleHRcIiA6IG5vZGUgfTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vZGUgPSAkLmV4dGVuZCh0cnVlLCB7fSwgbm9kZSk7XG5cdFx0XHR9XG5cdFx0XHRpZihub2RlLnRleHQgPT09IHVuZGVmaW5lZCkgeyBub2RlLnRleHQgPSB0aGlzLmdldF9zdHJpbmcoJ05ldyBub2RlJyk7IH1cblx0XHRcdHZhciB0bXAsIGRwYywgaSwgajtcblxuXHRcdFx0aWYocGFyLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdGlmKHBvcyA9PT0gXCJiZWZvcmVcIikgeyBwb3MgPSBcImZpcnN0XCI7IH1cblx0XHRcdFx0aWYocG9zID09PSBcImFmdGVyXCIpIHsgcG9zID0gXCJsYXN0XCI7IH1cblx0XHRcdH1cblx0XHRcdHN3aXRjaChwb3MpIHtcblx0XHRcdFx0Y2FzZSBcImJlZm9yZVwiOlxuXHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUocGFyLnBhcmVudCk7XG5cdFx0XHRcdFx0cG9zID0gJC5pbkFycmF5KHBhci5pZCwgdG1wLmNoaWxkcmVuKTtcblx0XHRcdFx0XHRwYXIgPSB0bXA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJhZnRlclwiIDpcblx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKHBhci5wYXJlbnQpO1xuXHRcdFx0XHRcdHBvcyA9ICQuaW5BcnJheShwYXIuaWQsIHRtcC5jaGlsZHJlbikgKyAxO1xuXHRcdFx0XHRcdHBhciA9IHRtcDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImluc2lkZVwiOlxuXHRcdFx0XHRjYXNlIFwiZmlyc3RcIjpcblx0XHRcdFx0XHRwb3MgPSAwO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwibGFzdFwiOlxuXHRcdFx0XHRcdHBvcyA9IHBhci5jaGlsZHJlbi5sZW5ndGg7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0aWYoIXBvcykgeyBwb3MgPSAwOyB9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZihwb3MgPiBwYXIuY2hpbGRyZW4ubGVuZ3RoKSB7IHBvcyA9IHBhci5jaGlsZHJlbi5sZW5ndGg7IH1cblx0XHRcdGlmKCFub2RlLmlkKSB7IG5vZGUuaWQgPSB0cnVlOyB9XG5cdFx0XHRpZighdGhpcy5jaGVjayhcImNyZWF0ZV9ub2RlXCIsIG5vZGUsIHBhciwgcG9zKSkge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKG5vZGUuaWQgPT09IHRydWUpIHsgZGVsZXRlIG5vZGUuaWQ7IH1cblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJzZV9tb2RlbF9mcm9tX2pzb24obm9kZSwgcGFyLmlkLCBwYXIucGFyZW50cy5jb25jYXQoKSk7XG5cdFx0XHRpZighbm9kZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUobm9kZSk7XG5cdFx0XHRkcGMgPSBbXTtcblx0XHRcdGRwYy5wdXNoKG5vZGUpO1xuXHRcdFx0ZHBjID0gZHBjLmNvbmNhdCh0bXAuY2hpbGRyZW5fZCk7XG5cdFx0XHR0aGlzLnRyaWdnZXIoJ21vZGVsJywgeyBcIm5vZGVzXCIgOiBkcGMsIFwicGFyZW50XCIgOiBwYXIuaWQgfSk7XG5cblx0XHRcdHBhci5jaGlsZHJlbl9kID0gcGFyLmNoaWxkcmVuX2QuY29uY2F0KGRwYyk7XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBwYXIucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0dGhpcy5fbW9kZWwuZGF0YVtwYXIucGFyZW50c1tpXV0uY2hpbGRyZW5fZCA9IHRoaXMuX21vZGVsLmRhdGFbcGFyLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QuY29uY2F0KGRwYyk7XG5cdFx0XHR9XG5cdFx0XHRub2RlID0gdG1wO1xuXHRcdFx0dG1wID0gW107XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBwYXIuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdHRtcFtpID49IHBvcyA/IGkrMSA6IGldID0gcGFyLmNoaWxkcmVuW2ldO1xuXHRcdFx0fVxuXHRcdFx0dG1wW3Bvc10gPSBub2RlLmlkO1xuXHRcdFx0cGFyLmNoaWxkcmVuID0gdG1wO1xuXG5cdFx0XHR0aGlzLnJlZHJhd19ub2RlKHBhciwgdHJ1ZSk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyBjcmVhdGVkXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGNyZWF0ZV9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnQgdGhlIHBhcmVudCdzIElEXG5cdFx0XHQgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gdGhlIHBvc2l0aW9uIG9mIHRoZSBuZXcgbm9kZSBhbW9uZyB0aGUgcGFyZW50J3MgY2hpbGRyZW5cblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjcmVhdGVfbm9kZScsIHsgXCJub2RlXCIgOiB0aGlzLmdldF9ub2RlKG5vZGUpLCBcInBhcmVudFwiIDogcGFyLmlkLCBcInBvc2l0aW9uXCIgOiBwb3MgfSk7XG5cdFx0XHRpZihjYWxsYmFjaykgeyBjYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuZ2V0X25vZGUobm9kZSkpOyB9XG5cdFx0XHRyZXR1cm4gbm9kZS5pZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHNldCB0aGUgdGV4dCB2YWx1ZSBvZiBhIG5vZGVcblx0XHQgKiBAbmFtZSByZW5hbWVfbm9kZShvYmosIHZhbClcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlLCB5b3UgY2FuIHBhc3MgYW4gYXJyYXkgdG8gcmVuYW1lIG11bHRpcGxlIG5vZGVzIHRvIHRoZSBzYW1lIG5hbWVcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IHZhbCB0aGUgbmV3IHRleHQgdmFsdWVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqIEB0cmlnZ2VyIHJlbmFtZV9ub2RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHJlbmFtZV9ub2RlIDogZnVuY3Rpb24gKG9iaiwgdmFsKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBvbGQ7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5yZW5hbWVfbm9kZShvYmpbdDFdLCB2YWwpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRvbGQgPSBvYmoudGV4dDtcblx0XHRcdGlmKCF0aGlzLmNoZWNrKFwicmVuYW1lX25vZGVcIiwgb2JqLCB0aGlzLmdldF9wYXJlbnQob2JqKSwgdmFsKSkge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcik7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc2V0X3RleHQob2JqLCB2YWwpOyAvLyAuYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSBub2RlIGlzIHJlbmFtZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgcmVuYW1lX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRleHQgdGhlIG5ldyB2YWx1ZVxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IG9sZCB0aGUgb2xkIHZhbHVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcigncmVuYW1lX25vZGUnLCB7IFwibm9kZVwiIDogb2JqLCBcInRleHRcIiA6IHZhbCwgXCJvbGRcIiA6IG9sZCB9KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogcmVtb3ZlIGEgbm9kZVxuXHRcdCAqIEBuYW1lIGRlbGV0ZV9ub2RlKG9iailcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlLCB5b3UgY2FuIHBhc3MgYW4gYXJyYXkgdG8gZGVsZXRlIG11bHRpcGxlIG5vZGVzXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKiBAdHJpZ2dlciBkZWxldGVfbm9kZS5qc3RyZWUsIGNoYW5nZWQuanN0cmVlXG5cdFx0ICovXG5cdFx0ZGVsZXRlX25vZGUgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgdDEsIHQyLCBwYXIsIHBvcywgdG1wLCBpLCBqLCBrLCBsLCBjLCB0b3AsIGxmdDtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmRlbGV0ZV9ub2RlKG9ialt0MV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRwYXIgPSB0aGlzLmdldF9ub2RlKG9iai5wYXJlbnQpO1xuXHRcdFx0cG9zID0gJC5pbkFycmF5KG9iai5pZCwgcGFyLmNoaWxkcmVuKTtcblx0XHRcdGMgPSBmYWxzZTtcblx0XHRcdGlmKCF0aGlzLmNoZWNrKFwiZGVsZXRlX25vZGVcIiwgb2JqLCBwYXIsIHBvcykpIHtcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZihwb3MgIT09IC0xKSB7XG5cdFx0XHRcdHBhci5jaGlsZHJlbiA9ICQudmFrYXRhLmFycmF5X3JlbW92ZShwYXIuY2hpbGRyZW4sIHBvcyk7XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBvYmouY2hpbGRyZW5fZC5jb25jYXQoW10pO1xuXHRcdFx0dG1wLnB1c2gob2JqLmlkKTtcblx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW29iai5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kID0gJC52YWthdGEuYXJyYXlfZmlsdGVyKHRoaXMuX21vZGVsLmRhdGFbb2JqLnBhcmVudHNbaV1dLmNoaWxkcmVuX2QsIGZ1bmN0aW9uICh2KSB7XG5cdFx0XHRcdFx0cmV0dXJuICQuaW5BcnJheSh2LCB0bXApID09PSAtMTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoayA9IDAsIGwgPSB0bXAubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbdG1wW2tdXS5zdGF0ZS5zZWxlY3RlZCkge1xuXHRcdFx0XHRcdGMgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoYykge1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuc2VsZWN0ZWQgPSAkLnZha2F0YS5hcnJheV9maWx0ZXIodGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLCBmdW5jdGlvbiAodikge1xuXHRcdFx0XHRcdHJldHVybiAkLmluQXJyYXkodiwgdG1wKSA9PT0gLTE7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhIG5vZGUgaXMgZGVsZXRlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBkZWxldGVfbm9kZS5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyZW50IHRoZSBwYXJlbnQncyBJRFxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2RlbGV0ZV9ub2RlJywgeyBcIm5vZGVcIiA6IG9iaiwgXCJwYXJlbnRcIiA6IHBhci5pZCB9KTtcblx0XHRcdGlmKGMpIHtcblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyAnYWN0aW9uJyA6ICdkZWxldGVfbm9kZScsICdub2RlJyA6IG9iaiwgJ3NlbGVjdGVkJyA6IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZCwgJ3BhcmVudCcgOiBwYXIuaWQgfSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoayA9IDAsIGwgPSB0bXAubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLl9tb2RlbC5kYXRhW3RtcFtrXV07XG5cdFx0XHR9XG5cdFx0XHRpZigkLmluQXJyYXkodGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQsIHRtcCkgIT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkID0gbnVsbDtcblx0XHRcdFx0dG9wID0gdGhpcy5lbGVtZW50WzBdLnNjcm9sbFRvcDtcblx0XHRcdFx0bGZ0ID0gdGhpcy5lbGVtZW50WzBdLnNjcm9sbExlZnQ7XG5cdFx0XHRcdGlmKHBhci5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdLmNoaWxkcmVuWzBdKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmdldF9ub2RlKHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF0uY2hpbGRyZW5bMF0sIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmZvY3VzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuZ2V0X25vZGUocGFyLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuZWxlbWVudFswXS5zY3JvbGxUb3AgID0gdG9wO1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRbMF0uc2Nyb2xsTGVmdCA9IGxmdDtcblx0XHRcdH1cblx0XHRcdHRoaXMucmVkcmF3X25vZGUocGFyLCB0cnVlKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY2hlY2sgaWYgYW4gb3BlcmF0aW9uIGlzIHByZW1pdHRlZCBvbiB0aGUgdHJlZS4gVXNlZCBpbnRlcm5hbGx5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgY2hlY2soY2hrLCBvYmosIHBhciwgcG9zKVxuXHRcdCAqIEBwYXJhbSAge1N0cmluZ30gY2hrIHRoZSBvcGVyYXRpb24gdG8gY2hlY2ssIGNhbiBiZSBcImNyZWF0ZV9ub2RlXCIsIFwicmVuYW1lX25vZGVcIiwgXCJkZWxldGVfbm9kZVwiLCBcImNvcHlfbm9kZVwiIG9yIFwibW92ZV9ub2RlXCJcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IHBhciB0aGUgcGFyZW50XG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IHBvcyB0aGUgcG9zaXRpb24gdG8gaW5zZXJ0IGF0LCBvciBpZiBcInJlbmFtZV9ub2RlXCIgLSB0aGUgbmV3IG5hbWVcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gbW9yZSBzb21lIHZhcmlvdXMgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiwgZm9yIGV4YW1wbGUgaWYgYSBcIm1vdmVfbm9kZVwiIG9wZXJhdGlvbnMgaXMgdHJpZ2dlcmVkIGJ5IERORCB0aGlzIHdpbGwgYmUgdGhlIGhvdmVyZWQgbm9kZVxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Y2hlY2sgOiBmdW5jdGlvbiAoY2hrLCBvYmosIHBhciwgcG9zLCBtb3JlKSB7XG5cdFx0XHRvYmogPSBvYmogJiYgb2JqLmlkID8gb2JqIDogdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0cGFyID0gcGFyICYmIHBhci5pZCA/IHBhciA6IHRoaXMuZ2V0X25vZGUocGFyKTtcblx0XHRcdHZhciB0bXAgPSBjaGsubWF0Y2goL15tb3ZlX25vZGV8Y29weV9ub2RlfGNyZWF0ZV9ub2RlJC9pKSA/IHBhciA6IG9iaixcblx0XHRcdFx0Y2hjID0gdGhpcy5zZXR0aW5ncy5jb3JlLmNoZWNrX2NhbGxiYWNrO1xuXHRcdFx0aWYoY2hrID09PSBcIm1vdmVfbm9kZVwiIHx8IGNoayA9PT0gXCJjb3B5X25vZGVcIikge1xuXHRcdFx0XHRpZigoIW1vcmUgfHwgIW1vcmUuaXNfbXVsdGkpICYmIChjaGsgPT09IFwibW92ZV9ub2RlXCIgJiYgJC5pbkFycmF5KG9iai5pZCwgcGFyLmNoaWxkcmVuKSA9PT0gcG9zKSkge1xuXHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAnY29yZScsICdpZCcgOiAnY29yZV8wOCcsICdyZWFzb24nIDogJ01vdmluZyBub2RlIHRvIGl0cyBjdXJyZW50IHBvc2l0aW9uJywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZigoIW1vcmUgfHwgIW1vcmUuaXNfbXVsdGkpICYmIChvYmouaWQgPT09IHBhci5pZCB8fCAoY2hrID09PSBcIm1vdmVfbm9kZVwiICYmICQuaW5BcnJheShvYmouaWQsIHBhci5jaGlsZHJlbikgPT09IHBvcykgfHwgJC5pbkFycmF5KHBhci5pZCwgb2JqLmNoaWxkcmVuX2QpICE9PSAtMSkpIHtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ2NvcmUnLCAnaWQnIDogJ2NvcmVfMDEnLCAncmVhc29uJyA6ICdNb3ZpbmcgcGFyZW50IGluc2lkZSBjaGlsZCcsICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKHRtcCAmJiB0bXAuZGF0YSkgeyB0bXAgPSB0bXAuZGF0YTsgfVxuXHRcdFx0aWYodG1wICYmIHRtcC5mdW5jdGlvbnMgJiYgKHRtcC5mdW5jdGlvbnNbY2hrXSA9PT0gZmFsc2UgfHwgdG1wLmZ1bmN0aW9uc1tjaGtdID09PSB0cnVlKSkge1xuXHRcdFx0XHRpZih0bXAuZnVuY3Rpb25zW2Noa10gPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICdjb3JlJywgJ2lkJyA6ICdjb3JlXzAyJywgJ3JlYXNvbicgOiAnTm9kZSBkYXRhIHByZXZlbnRzIGZ1bmN0aW9uOiAnICsgY2hrLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRtcC5mdW5jdGlvbnNbY2hrXTtcblx0XHRcdH1cblx0XHRcdGlmKGNoYyA9PT0gZmFsc2UgfHwgKCQuaXNGdW5jdGlvbihjaGMpICYmIGNoYy5jYWxsKHRoaXMsIGNoaywgb2JqLCBwYXIsIHBvcywgbW9yZSkgPT09IGZhbHNlKSB8fCAoY2hjICYmIGNoY1tjaGtdID09PSBmYWxzZSkpIHtcblx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICdjb3JlJywgJ2lkJyA6ICdjb3JlXzAzJywgJ3JlYXNvbicgOiAnVXNlciBjb25maWcgZm9yIGNvcmUuY2hlY2tfY2FsbGJhY2sgcHJldmVudHMgZnVuY3Rpb246ICcgKyBjaGssICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgdGhlIGxhc3QgZXJyb3Jcblx0XHQgKiBAbmFtZSBsYXN0X2Vycm9yKClcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0bGFzdF9lcnJvciA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvcjtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIG1vdmUgYSBub2RlIHRvIGEgbmV3IHBhcmVudFxuXHRcdCAqIEBuYW1lIG1vdmVfbm9kZShvYmosIHBhciBbLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWRdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogdGhlIG5vZGUgdG8gbW92ZSwgcGFzcyBhbiBhcnJheSB0byBtb3ZlIG11bHRpcGxlIG5vZGVzXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IHBhciB0aGUgbmV3IHBhcmVudFxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBwb3MgdGhlIHBvc2l0aW9uIHRvIGluc2VydCBhdCAoYmVzaWRlcyBpbnRlZ2VyIHZhbHVlcywgXCJmaXJzdFwiIGFuZCBcImxhc3RcIiBhcmUgc3VwcG9ydGVkLCBhcyB3ZWxsIGFzIFwiYmVmb3JlXCIgYW5kIFwiYWZ0ZXJcIiksIGRlZmF1bHRzIHRvIGludGVnZXIgYDBgXG5cdFx0ICogQHBhcmFtICB7ZnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCBvbmNlIHRoZSBtb3ZlIGlzIGNvbXBsZXRlZCwgcmVjZWl2ZXMgMyBhcmd1bWVudHMgLSB0aGUgbm9kZSwgdGhlIG5ldyBwYXJlbnQgYW5kIHRoZSBwb3NpdGlvblxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IGlzX2xvYWRlZCBpbnRlcm5hbCBwYXJhbWV0ZXIgaW5kaWNhdGluZyBpZiB0aGUgcGFyZW50IG5vZGUgaGFzIGJlZW4gbG9hZGVkXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gc2tpcF9yZWRyYXcgaW50ZXJuYWwgcGFyYW1ldGVyIGluZGljYXRpbmcgaWYgdGhlIHRyZWUgc2hvdWxkIGJlIHJlZHJhd25cblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBpbnN0YW5jZSBpbnRlcm5hbCBwYXJhbWV0ZXIgaW5kaWNhdGluZyBpZiB0aGUgbm9kZSBjb21lcyBmcm9tIGFub3RoZXIgaW5zdGFuY2Vcblx0XHQgKiBAdHJpZ2dlciBtb3ZlX25vZGUuanN0cmVlXG5cdFx0ICovXG5cdFx0bW92ZV9ub2RlIDogZnVuY3Rpb24gKG9iaiwgcGFyLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQsIHNraXBfcmVkcmF3LCBvcmlnaW4pIHtcblx0XHRcdHZhciB0MSwgdDIsIG9sZF9wYXIsIG9sZF9wb3MsIG5ld19wYXIsIG9sZF9pbnMsIGlzX211bHRpLCBkcGMsIHRtcCwgaSwgaiwgaywgbCwgcDtcblxuXHRcdFx0cGFyID0gdGhpcy5nZXRfbm9kZShwYXIpO1xuXHRcdFx0cG9zID0gcG9zID09PSB1bmRlZmluZWQgPyAwIDogcG9zO1xuXHRcdFx0aWYoIXBhcikgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKCFwb3MudG9TdHJpbmcoKS5tYXRjaCgvXihiZWZvcmV8YWZ0ZXIpJC8pICYmICFpc19sb2FkZWQgJiYgIXRoaXMuaXNfbG9hZGVkKHBhcikpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubG9hZF9ub2RlKHBhciwgZnVuY3Rpb24gKCkgeyB0aGlzLm1vdmVfbm9kZShvYmosIHBhciwgcG9zLCBjYWxsYmFjaywgdHJ1ZSwgZmFsc2UsIG9yaWdpbik7IH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRpZihvYmoubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0b2JqID0gb2JqWzBdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdC8vb2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0XHRpZigodG1wID0gdGhpcy5tb3ZlX25vZGUob2JqW3QxXSwgcGFyLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQsIGZhbHNlLCBvcmlnaW4pKSkge1xuXHRcdFx0XHRcdFx0XHRwYXIgPSB0bXA7XG5cdFx0XHRcdFx0XHRcdHBvcyA9IFwiYWZ0ZXJcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0b2JqID0gb2JqICYmIG9iai5pZCA/IG9iaiA6IHRoaXMuZ2V0X25vZGUob2JqKTtcblxuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHRcdG9sZF9wYXIgPSAob2JqLnBhcmVudCB8fCAkLmpzdHJlZS5yb290KS50b1N0cmluZygpO1xuXHRcdFx0bmV3X3BhciA9ICghcG9zLnRvU3RyaW5nKCkubWF0Y2goL14oYmVmb3JlfGFmdGVyKSQvKSB8fCBwYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpID8gcGFyIDogdGhpcy5nZXRfbm9kZShwYXIucGFyZW50KTtcblx0XHRcdG9sZF9pbnMgPSBvcmlnaW4gPyBvcmlnaW4gOiAodGhpcy5fbW9kZWwuZGF0YVtvYmouaWRdID8gdGhpcyA6ICQuanN0cmVlLnJlZmVyZW5jZShvYmouaWQpKTtcblx0XHRcdGlzX211bHRpID0gIW9sZF9pbnMgfHwgIW9sZF9pbnMuX2lkIHx8ICh0aGlzLl9pZCAhPT0gb2xkX2lucy5faWQpO1xuXHRcdFx0b2xkX3BvcyA9IG9sZF9pbnMgJiYgb2xkX2lucy5faWQgJiYgb2xkX3BhciAmJiBvbGRfaW5zLl9tb2RlbC5kYXRhW29sZF9wYXJdICYmIG9sZF9pbnMuX21vZGVsLmRhdGFbb2xkX3Bhcl0uY2hpbGRyZW4gPyAkLmluQXJyYXkob2JqLmlkLCBvbGRfaW5zLl9tb2RlbC5kYXRhW29sZF9wYXJdLmNoaWxkcmVuKSA6IC0xO1xuXHRcdFx0aWYob2xkX2lucyAmJiBvbGRfaW5zLl9pZCkge1xuXHRcdFx0XHRvYmogPSBvbGRfaW5zLl9tb2RlbC5kYXRhW29iai5pZF07XG5cdFx0XHR9XG5cblx0XHRcdGlmKGlzX211bHRpKSB7XG5cdFx0XHRcdGlmKCh0bXAgPSB0aGlzLmNvcHlfbm9kZShvYmosIHBhciwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkLCBmYWxzZSwgb3JpZ2luKSkpIHtcblx0XHRcdFx0XHRpZihvbGRfaW5zKSB7IG9sZF9pbnMuZGVsZXRlX25vZGUob2JqKTsgfVxuXHRcdFx0XHRcdHJldHVybiB0bXA7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0Ly92YXIgbSA9IHRoaXMuX21vZGVsLmRhdGE7XG5cdFx0XHRpZihwYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0aWYocG9zID09PSBcImJlZm9yZVwiKSB7IHBvcyA9IFwiZmlyc3RcIjsgfVxuXHRcdFx0XHRpZihwb3MgPT09IFwiYWZ0ZXJcIikgeyBwb3MgPSBcImxhc3RcIjsgfVxuXHRcdFx0fVxuXHRcdFx0c3dpdGNoKHBvcykge1xuXHRcdFx0XHRjYXNlIFwiYmVmb3JlXCI6XG5cdFx0XHRcdFx0cG9zID0gJC5pbkFycmF5KHBhci5pZCwgbmV3X3Bhci5jaGlsZHJlbik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJhZnRlclwiIDpcblx0XHRcdFx0XHRwb3MgPSAkLmluQXJyYXkocGFyLmlkLCBuZXdfcGFyLmNoaWxkcmVuKSArIDE7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJpbnNpZGVcIjpcblx0XHRcdFx0Y2FzZSBcImZpcnN0XCI6XG5cdFx0XHRcdFx0cG9zID0gMDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImxhc3RcIjpcblx0XHRcdFx0XHRwb3MgPSBuZXdfcGFyLmNoaWxkcmVuLmxlbmd0aDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRpZighcG9zKSB7IHBvcyA9IDA7IH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmKHBvcyA+IG5ld19wYXIuY2hpbGRyZW4ubGVuZ3RoKSB7IHBvcyA9IG5ld19wYXIuY2hpbGRyZW4ubGVuZ3RoOyB9XG5cdFx0XHRpZighdGhpcy5jaGVjayhcIm1vdmVfbm9kZVwiLCBvYmosIG5ld19wYXIsIHBvcywgeyAnY29yZScgOiB0cnVlLCAnb3JpZ2luJyA6IG9yaWdpbiwgJ2lzX211bHRpJyA6IChvbGRfaW5zICYmIG9sZF9pbnMuX2lkICYmIG9sZF9pbnMuX2lkICE9PSB0aGlzLl9pZCksICdpc19mb3JlaWduJyA6ICghb2xkX2lucyB8fCAhb2xkX2lucy5faWQpIH0pKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYob2JqLnBhcmVudCA9PT0gbmV3X3Bhci5pZCkge1xuXHRcdFx0XHRkcGMgPSBuZXdfcGFyLmNoaWxkcmVuLmNvbmNhdCgpO1xuXHRcdFx0XHR0bXAgPSAkLmluQXJyYXkob2JqLmlkLCBkcGMpO1xuXHRcdFx0XHRpZih0bXAgIT09IC0xKSB7XG5cdFx0XHRcdFx0ZHBjID0gJC52YWthdGEuYXJyYXlfcmVtb3ZlKGRwYywgdG1wKTtcblx0XHRcdFx0XHRpZihwb3MgPiB0bXApIHsgcG9zLS07IH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0bXAgPSBbXTtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZHBjLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdHRtcFtpID49IHBvcyA/IGkrMSA6IGldID0gZHBjW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRtcFtwb3NdID0gb2JqLmlkO1xuXHRcdFx0XHRuZXdfcGFyLmNoaWxkcmVuID0gdG1wO1xuXHRcdFx0XHR0aGlzLl9ub2RlX2NoYW5nZWQobmV3X3Bhci5pZCk7XG5cdFx0XHRcdHRoaXMucmVkcmF3KG5ld19wYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIGNsZWFuIG9sZCBwYXJlbnQgYW5kIHVwXG5cdFx0XHRcdHRtcCA9IG9iai5jaGlsZHJlbl9kLmNvbmNhdCgpO1xuXHRcdFx0XHR0bXAucHVzaChvYmouaWQpO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmoucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRkcGMgPSBbXTtcblx0XHRcdFx0XHRwID0gb2xkX2lucy5fbW9kZWwuZGF0YVtvYmoucGFyZW50c1tpXV0uY2hpbGRyZW5fZDtcblx0XHRcdFx0XHRmb3IoayA9IDAsIGwgPSBwLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdFx0aWYoJC5pbkFycmF5KHBba10sIHRtcCkgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGRwYy5wdXNoKHBba10pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvbGRfaW5zLl9tb2RlbC5kYXRhW29iai5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kID0gZHBjO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG9sZF9pbnMuX21vZGVsLmRhdGFbb2xkX3Bhcl0uY2hpbGRyZW4gPSAkLnZha2F0YS5hcnJheV9yZW1vdmVfaXRlbShvbGRfaW5zLl9tb2RlbC5kYXRhW29sZF9wYXJdLmNoaWxkcmVuLCBvYmouaWQpO1xuXG5cdFx0XHRcdC8vIGluc2VydCBpbnRvIG5ldyBwYXJlbnQgYW5kIHVwXG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG5ld19wYXIucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW25ld19wYXIucGFyZW50c1tpXV0uY2hpbGRyZW5fZCA9IHRoaXMuX21vZGVsLmRhdGFbbmV3X3Bhci5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kLmNvbmNhdCh0bXApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRwYyA9IFtdO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBuZXdfcGFyLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGRwY1tpID49IHBvcyA/IGkrMSA6IGldID0gbmV3X3Bhci5jaGlsZHJlbltpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkcGNbcG9zXSA9IG9iai5pZDtcblx0XHRcdFx0bmV3X3Bhci5jaGlsZHJlbiA9IGRwYztcblx0XHRcdFx0bmV3X3Bhci5jaGlsZHJlbl9kLnB1c2gob2JqLmlkKTtcblx0XHRcdFx0bmV3X3Bhci5jaGlsZHJlbl9kID0gbmV3X3Bhci5jaGlsZHJlbl9kLmNvbmNhdChvYmouY2hpbGRyZW5fZCk7XG5cblx0XHRcdFx0Ly8gdXBkYXRlIG9iamVjdFxuXHRcdFx0XHRvYmoucGFyZW50ID0gbmV3X3Bhci5pZDtcblx0XHRcdFx0dG1wID0gbmV3X3Bhci5wYXJlbnRzLmNvbmNhdCgpO1xuXHRcdFx0XHR0bXAudW5zaGlmdChuZXdfcGFyLmlkKTtcblx0XHRcdFx0cCA9IG9iai5wYXJlbnRzLmxlbmd0aDtcblx0XHRcdFx0b2JqLnBhcmVudHMgPSB0bXA7XG5cblx0XHRcdFx0Ly8gdXBkYXRlIG9iamVjdCBjaGlsZHJlblxuXHRcdFx0XHR0bXAgPSB0bXAuY29uY2F0KCk7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbb2JqLmNoaWxkcmVuX2RbaV1dLnBhcmVudHMgPSB0aGlzLl9tb2RlbC5kYXRhW29iai5jaGlsZHJlbl9kW2ldXS5wYXJlbnRzLnNsaWNlKDAscCotMSk7XG5cdFx0XHRcdFx0QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5fbW9kZWwuZGF0YVtvYmouY2hpbGRyZW5fZFtpXV0ucGFyZW50cywgdG1wKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKG9sZF9wYXIgPT09ICQuanN0cmVlLnJvb3QgfHwgbmV3X3Bhci5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdHRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighdGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcpIHtcblx0XHRcdFx0XHR0aGlzLl9ub2RlX2NoYW5nZWQob2xkX3Bhcik7XG5cdFx0XHRcdFx0dGhpcy5fbm9kZV9jaGFuZ2VkKG5ld19wYXIuaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCFza2lwX3JlZHJhdykge1xuXHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKGNhbGxiYWNrKSB7IGNhbGxiYWNrLmNhbGwodGhpcywgb2JqLCBuZXdfcGFyLCBwb3MpOyB9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyBtb3ZlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBtb3ZlX25vZGUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcmVudCB0aGUgcGFyZW50J3MgSURcblx0XHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiB0aGUgcG9zaXRpb24gb2YgdGhlIG5vZGUgYW1vbmcgdGhlIHBhcmVudCdzIGNoaWxkcmVuXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gb2xkX3BhcmVudCB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtOdW1iZXJ9IG9sZF9wb3NpdGlvbiB0aGUgb2xkIHBvc2l0aW9uIG9mIHRoZSBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IGlzX211bHRpIGRvIHRoZSBub2RlIGFuZCBuZXcgcGFyZW50IGJlbG9uZyB0byBkaWZmZXJlbnQgaW5zdGFuY2VzXG5cdFx0XHQgKiBAcGFyYW0ge2pzVHJlZX0gb2xkX2luc3RhbmNlIHRoZSBpbnN0YW5jZSB0aGUgbm9kZSBjYW1lIGZyb21cblx0XHRcdCAqIEBwYXJhbSB7anNUcmVlfSBuZXdfaW5zdGFuY2UgdGhlIGluc3RhbmNlIG9mIHRoZSBuZXcgcGFyZW50XG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignbW92ZV9ub2RlJywgeyBcIm5vZGVcIiA6IG9iaiwgXCJwYXJlbnRcIiA6IG5ld19wYXIuaWQsIFwicG9zaXRpb25cIiA6IHBvcywgXCJvbGRfcGFyZW50XCIgOiBvbGRfcGFyLCBcIm9sZF9wb3NpdGlvblwiIDogb2xkX3BvcywgJ2lzX211bHRpJyA6IChvbGRfaW5zICYmIG9sZF9pbnMuX2lkICYmIG9sZF9pbnMuX2lkICE9PSB0aGlzLl9pZCksICdpc19mb3JlaWduJyA6ICghb2xkX2lucyB8fCAhb2xkX2lucy5faWQpLCAnb2xkX2luc3RhbmNlJyA6IG9sZF9pbnMsICduZXdfaW5zdGFuY2UnIDogdGhpcyB9KTtcblx0XHRcdHJldHVybiBvYmouaWQ7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjb3B5IGEgbm9kZSB0byBhIG5ldyBwYXJlbnRcblx0XHQgKiBAbmFtZSBjb3B5X25vZGUob2JqLCBwYXIgWywgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGNvcHksIHBhc3MgYW4gYXJyYXkgdG8gY29weSBtdWx0aXBsZSBub2Rlc1xuXHRcdCAqIEBwYXJhbSAge21peGVkfSBwYXIgdGhlIG5ldyBwYXJlbnRcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gcG9zIHRoZSBwb3NpdGlvbiB0byBpbnNlcnQgYXQgKGJlc2lkZXMgaW50ZWdlciB2YWx1ZXMsIFwiZmlyc3RcIiBhbmQgXCJsYXN0XCIgYXJlIHN1cHBvcnRlZCwgYXMgd2VsbCBhcyBcImJlZm9yZVwiIGFuZCBcImFmdGVyXCIpLCBkZWZhdWx0cyB0byBpbnRlZ2VyIGAwYFxuXHRcdCAqIEBwYXJhbSAge2Z1bmN0aW9ufSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgb25jZSB0aGUgbW92ZSBpcyBjb21wbGV0ZWQsIHJlY2VpdmVzIDMgYXJndW1lbnRzIC0gdGhlIG5vZGUsIHRoZSBuZXcgcGFyZW50IGFuZCB0aGUgcG9zaXRpb25cblx0XHQgKiBAcGFyYW0gIHtCb29sZWFufSBpc19sb2FkZWQgaW50ZXJuYWwgcGFyYW1ldGVyIGluZGljYXRpbmcgaWYgdGhlIHBhcmVudCBub2RlIGhhcyBiZWVuIGxvYWRlZFxuXHRcdCAqIEBwYXJhbSAge0Jvb2xlYW59IHNraXBfcmVkcmF3IGludGVybmFsIHBhcmFtZXRlciBpbmRpY2F0aW5nIGlmIHRoZSB0cmVlIHNob3VsZCBiZSByZWRyYXduXG5cdFx0ICogQHBhcmFtICB7Qm9vbGVhbn0gaW5zdGFuY2UgaW50ZXJuYWwgcGFyYW1ldGVyIGluZGljYXRpbmcgaWYgdGhlIG5vZGUgY29tZXMgZnJvbSBhbm90aGVyIGluc3RhbmNlXG5cdFx0ICogQHRyaWdnZXIgbW9kZWwuanN0cmVlIGNvcHlfbm9kZS5qc3RyZWVcblx0XHQgKi9cblx0XHRjb3B5X25vZGUgOiBmdW5jdGlvbiAob2JqLCBwYXIsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCwgc2tpcF9yZWRyYXcsIG9yaWdpbikge1xuXHRcdFx0dmFyIHQxLCB0MiwgZHBjLCB0bXAsIGksIGosIG5vZGUsIG9sZF9wYXIsIG5ld19wYXIsIG9sZF9pbnMsIGlzX211bHRpO1xuXG5cdFx0XHRwYXIgPSB0aGlzLmdldF9ub2RlKHBhcik7XG5cdFx0XHRwb3MgPSBwb3MgPT09IHVuZGVmaW5lZCA/IDAgOiBwb3M7XG5cdFx0XHRpZighcGFyKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYoIXBvcy50b1N0cmluZygpLm1hdGNoKC9eKGJlZm9yZXxhZnRlcikkLykgJiYgIWlzX2xvYWRlZCAmJiAhdGhpcy5pc19sb2FkZWQocGFyKSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX25vZGUocGFyLCBmdW5jdGlvbiAoKSB7IHRoaXMuY29weV9ub2RlKG9iaiwgcGFyLCBwb3MsIGNhbGxiYWNrLCB0cnVlLCBmYWxzZSwgb3JpZ2luKTsgfSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdGlmKG9iai5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRvYmogPSBvYmpbMF07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Ly9vYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHRcdGlmKCh0bXAgPSB0aGlzLmNvcHlfbm9kZShvYmpbdDFdLCBwYXIsIHBvcywgY2FsbGJhY2ssIGlzX2xvYWRlZCwgdHJ1ZSwgb3JpZ2luKSkpIHtcblx0XHRcdFx0XHRcdFx0cGFyID0gdG1wO1xuXHRcdFx0XHRcdFx0XHRwb3MgPSBcImFmdGVyXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMucmVkcmF3KCk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG9iaiA9IG9iaiAmJiBvYmouaWQgPyBvYmogOiB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdFx0b2xkX3BhciA9IChvYmoucGFyZW50IHx8ICQuanN0cmVlLnJvb3QpLnRvU3RyaW5nKCk7XG5cdFx0XHRuZXdfcGFyID0gKCFwb3MudG9TdHJpbmcoKS5tYXRjaCgvXihiZWZvcmV8YWZ0ZXIpJC8pIHx8IHBhci5pZCA9PT0gJC5qc3RyZWUucm9vdCkgPyBwYXIgOiB0aGlzLmdldF9ub2RlKHBhci5wYXJlbnQpO1xuXHRcdFx0b2xkX2lucyA9IG9yaWdpbiA/IG9yaWdpbiA6ICh0aGlzLl9tb2RlbC5kYXRhW29iai5pZF0gPyB0aGlzIDogJC5qc3RyZWUucmVmZXJlbmNlKG9iai5pZCkpO1xuXHRcdFx0aXNfbXVsdGkgPSAhb2xkX2lucyB8fCAhb2xkX2lucy5faWQgfHwgKHRoaXMuX2lkICE9PSBvbGRfaW5zLl9pZCk7XG5cblx0XHRcdGlmKG9sZF9pbnMgJiYgb2xkX2lucy5faWQpIHtcblx0XHRcdFx0b2JqID0gb2xkX2lucy5fbW9kZWwuZGF0YVtvYmouaWRdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZihwYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0aWYocG9zID09PSBcImJlZm9yZVwiKSB7IHBvcyA9IFwiZmlyc3RcIjsgfVxuXHRcdFx0XHRpZihwb3MgPT09IFwiYWZ0ZXJcIikgeyBwb3MgPSBcImxhc3RcIjsgfVxuXHRcdFx0fVxuXHRcdFx0c3dpdGNoKHBvcykge1xuXHRcdFx0XHRjYXNlIFwiYmVmb3JlXCI6XG5cdFx0XHRcdFx0cG9zID0gJC5pbkFycmF5KHBhci5pZCwgbmV3X3Bhci5jaGlsZHJlbik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJhZnRlclwiIDpcblx0XHRcdFx0XHRwb3MgPSAkLmluQXJyYXkocGFyLmlkLCBuZXdfcGFyLmNoaWxkcmVuKSArIDE7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJpbnNpZGVcIjpcblx0XHRcdFx0Y2FzZSBcImZpcnN0XCI6XG5cdFx0XHRcdFx0cG9zID0gMDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImxhc3RcIjpcblx0XHRcdFx0XHRwb3MgPSBuZXdfcGFyLmNoaWxkcmVuLmxlbmd0aDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRpZighcG9zKSB7IHBvcyA9IDA7IH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmKHBvcyA+IG5ld19wYXIuY2hpbGRyZW4ubGVuZ3RoKSB7IHBvcyA9IG5ld19wYXIuY2hpbGRyZW4ubGVuZ3RoOyB9XG5cdFx0XHRpZighdGhpcy5jaGVjayhcImNvcHlfbm9kZVwiLCBvYmosIG5ld19wYXIsIHBvcywgeyAnY29yZScgOiB0cnVlLCAnb3JpZ2luJyA6IG9yaWdpbiwgJ2lzX211bHRpJyA6IChvbGRfaW5zICYmIG9sZF9pbnMuX2lkICYmIG9sZF9pbnMuX2lkICE9PSB0aGlzLl9pZCksICdpc19mb3JlaWduJyA6ICghb2xkX2lucyB8fCAhb2xkX2lucy5faWQpIH0pKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0bm9kZSA9IG9sZF9pbnMgPyBvbGRfaW5zLmdldF9qc29uKG9iaiwgeyBub19pZCA6IHRydWUsIG5vX2RhdGEgOiB0cnVlLCBub19zdGF0ZSA6IHRydWUgfSkgOiBvYmo7XG5cdFx0XHRpZighbm9kZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKG5vZGUuaWQgPT09IHRydWUpIHsgZGVsZXRlIG5vZGUuaWQ7IH1cblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJzZV9tb2RlbF9mcm9tX2pzb24obm9kZSwgbmV3X3Bhci5pZCwgbmV3X3Bhci5wYXJlbnRzLmNvbmNhdCgpKTtcblx0XHRcdGlmKCFub2RlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShub2RlKTtcblx0XHRcdGlmKG9iaiAmJiBvYmouc3RhdGUgJiYgb2JqLnN0YXRlLmxvYWRlZCA9PT0gZmFsc2UpIHsgdG1wLnN0YXRlLmxvYWRlZCA9IGZhbHNlOyB9XG5cdFx0XHRkcGMgPSBbXTtcblx0XHRcdGRwYy5wdXNoKG5vZGUpO1xuXHRcdFx0ZHBjID0gZHBjLmNvbmNhdCh0bXAuY2hpbGRyZW5fZCk7XG5cdFx0XHR0aGlzLnRyaWdnZXIoJ21vZGVsJywgeyBcIm5vZGVzXCIgOiBkcGMsIFwicGFyZW50XCIgOiBuZXdfcGFyLmlkIH0pO1xuXG5cdFx0XHQvLyBpbnNlcnQgaW50byBuZXcgcGFyZW50IGFuZCB1cFxuXHRcdFx0Zm9yKGkgPSAwLCBqID0gbmV3X3Bhci5wYXJlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW25ld19wYXIucGFyZW50c1tpXV0uY2hpbGRyZW5fZCA9IHRoaXMuX21vZGVsLmRhdGFbbmV3X3Bhci5wYXJlbnRzW2ldXS5jaGlsZHJlbl9kLmNvbmNhdChkcGMpO1xuXHRcdFx0fVxuXHRcdFx0ZHBjID0gW107XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBuZXdfcGFyLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRkcGNbaSA+PSBwb3MgPyBpKzEgOiBpXSA9IG5ld19wYXIuY2hpbGRyZW5baV07XG5cdFx0XHR9XG5cdFx0XHRkcGNbcG9zXSA9IHRtcC5pZDtcblx0XHRcdG5ld19wYXIuY2hpbGRyZW4gPSBkcGM7XG5cdFx0XHRuZXdfcGFyLmNoaWxkcmVuX2QucHVzaCh0bXAuaWQpO1xuXHRcdFx0bmV3X3Bhci5jaGlsZHJlbl9kID0gbmV3X3Bhci5jaGlsZHJlbl9kLmNvbmNhdCh0bXAuY2hpbGRyZW5fZCk7XG5cblx0XHRcdGlmKG5ld19wYXIuaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0dGhpcy5fbW9kZWwuZm9yY2VfZnVsbF9yZWRyYXcgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXRoaXMuX21vZGVsLmZvcmNlX2Z1bGxfcmVkcmF3KSB7XG5cdFx0XHRcdHRoaXMuX25vZGVfY2hhbmdlZChuZXdfcGFyLmlkKTtcblx0XHRcdH1cblx0XHRcdGlmKCFza2lwX3JlZHJhdykge1xuXHRcdFx0XHR0aGlzLnJlZHJhdyhuZXdfcGFyLmlkID09PSAkLmpzdHJlZS5yb290KTtcblx0XHRcdH1cblx0XHRcdGlmKGNhbGxiYWNrKSB7IGNhbGxiYWNrLmNhbGwodGhpcywgdG1wLCBuZXdfcGFyLCBwb3MpOyB9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGEgbm9kZSBpcyBjb3BpZWRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY29weV9ub2RlLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGUgdGhlIGNvcGllZCBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gb3JpZ2luYWwgdGhlIG9yaWdpbmFsIG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnQgdGhlIHBhcmVudCdzIElEXG5cdFx0XHQgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gdGhlIHBvc2l0aW9uIG9mIHRoZSBub2RlIGFtb25nIHRoZSBwYXJlbnQncyBjaGlsZHJlblxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IG9sZF9wYXJlbnQgdGhlIG9sZCBwYXJlbnQgb2YgdGhlIG5vZGVcblx0XHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBvbGRfcG9zaXRpb24gdGhlIHBvc2l0aW9uIG9mIHRoZSBvcmlnaW5hbCBub2RlXG5cdFx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IGlzX211bHRpIGRvIHRoZSBub2RlIGFuZCBuZXcgcGFyZW50IGJlbG9uZyB0byBkaWZmZXJlbnQgaW5zdGFuY2VzXG5cdFx0XHQgKiBAcGFyYW0ge2pzVHJlZX0gb2xkX2luc3RhbmNlIHRoZSBpbnN0YW5jZSB0aGUgbm9kZSBjYW1lIGZyb21cblx0XHRcdCAqIEBwYXJhbSB7anNUcmVlfSBuZXdfaW5zdGFuY2UgdGhlIGluc3RhbmNlIG9mIHRoZSBuZXcgcGFyZW50XG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignY29weV9ub2RlJywgeyBcIm5vZGVcIiA6IHRtcCwgXCJvcmlnaW5hbFwiIDogb2JqLCBcInBhcmVudFwiIDogbmV3X3Bhci5pZCwgXCJwb3NpdGlvblwiIDogcG9zLCBcIm9sZF9wYXJlbnRcIiA6IG9sZF9wYXIsIFwib2xkX3Bvc2l0aW9uXCIgOiBvbGRfaW5zICYmIG9sZF9pbnMuX2lkICYmIG9sZF9wYXIgJiYgb2xkX2lucy5fbW9kZWwuZGF0YVtvbGRfcGFyXSAmJiBvbGRfaW5zLl9tb2RlbC5kYXRhW29sZF9wYXJdLmNoaWxkcmVuID8gJC5pbkFycmF5KG9iai5pZCwgb2xkX2lucy5fbW9kZWwuZGF0YVtvbGRfcGFyXS5jaGlsZHJlbikgOiAtMSwnaXNfbXVsdGknIDogKG9sZF9pbnMgJiYgb2xkX2lucy5faWQgJiYgb2xkX2lucy5faWQgIT09IHRoaXMuX2lkKSwgJ2lzX2ZvcmVpZ24nIDogKCFvbGRfaW5zIHx8ICFvbGRfaW5zLl9pZCksICdvbGRfaW5zdGFuY2UnIDogb2xkX2lucywgJ25ld19pbnN0YW5jZScgOiB0aGlzIH0pO1xuXHRcdFx0cmV0dXJuIHRtcC5pZDtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGN1dCBhIG5vZGUgKGEgbGF0ZXIgY2FsbCB0byBgcGFzdGUob2JqKWAgd291bGQgbW92ZSB0aGUgbm9kZSlcblx0XHQgKiBAbmFtZSBjdXQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmogbXVsdGlwbGUgb2JqZWN0cyBjYW4gYmUgcGFzc2VkIHVzaW5nIGFuIGFycmF5XG5cdFx0ICogQHRyaWdnZXIgY3V0LmpzdHJlZVxuXHRcdCAqL1xuXHRcdGN1dCA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdGlmKCFvYmopIHsgb2JqID0gdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkLmNvbmNhdCgpOyB9XG5cdFx0XHRpZighJC5pc0FycmF5KG9iaikpIHsgb2JqID0gW29ial07IH1cblx0XHRcdGlmKCFvYmoubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIHRtcCA9IFtdLCBvLCB0MSwgdDI7XG5cdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0byA9IHRoaXMuZ2V0X25vZGUob2JqW3QxXSk7XG5cdFx0XHRcdGlmKG8gJiYgby5pZCAmJiBvLmlkICE9PSAkLmpzdHJlZS5yb290KSB7IHRtcC5wdXNoKG8pOyB9XG5cdFx0XHR9XG5cdFx0XHRpZighdG1wLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGNjcF9ub2RlID0gdG1wO1xuXHRcdFx0Y2NwX2luc3QgPSB0aGlzO1xuXHRcdFx0Y2NwX21vZGUgPSAnbW92ZV9ub2RlJztcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gbm9kZXMgYXJlIGFkZGVkIHRvIHRoZSBidWZmZXIgZm9yIG1vdmluZ1xuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjdXQuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignY3V0JywgeyBcIm5vZGVcIiA6IG9iaiB9KTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNvcHkgYSBub2RlIChhIGxhdGVyIGNhbGwgdG8gYHBhc3RlKG9iailgIHdvdWxkIGNvcHkgdGhlIG5vZGUpXG5cdFx0ICogQG5hbWUgY29weShvYmopXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiBtdWx0aXBsZSBvYmplY3RzIGNhbiBiZSBwYXNzZWQgdXNpbmcgYW4gYXJyYXlcblx0XHQgKiBAdHJpZ2dlciBjb3B5LmpzdHJlZVxuXHRcdCAqL1xuXHRcdGNvcHkgOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRpZighb2JqKSB7IG9iaiA9IHRoaXMuX2RhdGEuY29yZS5zZWxlY3RlZC5jb25jYXQoKTsgfVxuXHRcdFx0aWYoISQuaXNBcnJheShvYmopKSB7IG9iaiA9IFtvYmpdOyB9XG5cdFx0XHRpZighb2JqLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciB0bXAgPSBbXSwgbywgdDEsIHQyO1xuXHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdG8gPSB0aGlzLmdldF9ub2RlKG9ialt0MV0pO1xuXHRcdFx0XHRpZihvICYmIG8uaWQgJiYgby5pZCAhPT0gJC5qc3RyZWUucm9vdCkgeyB0bXAucHVzaChvKTsgfVxuXHRcdFx0fVxuXHRcdFx0aWYoIXRtcC5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRjY3Bfbm9kZSA9IHRtcDtcblx0XHRcdGNjcF9pbnN0ID0gdGhpcztcblx0XHRcdGNjcF9tb2RlID0gJ2NvcHlfbm9kZSc7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIG5vZGVzIGFyZSBhZGRlZCB0byB0aGUgYnVmZmVyIGZvciBjb3B5aW5nXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGNvcHkuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignY29weScsIHsgXCJub2RlXCIgOiBvYmogfSk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgdGhlIGN1cnJlbnQgYnVmZmVyIChhbnkgbm9kZXMgdGhhdCBhcmUgd2FpdGluZyBmb3IgYSBwYXN0ZSBvcGVyYXRpb24pXG5cdFx0ICogQG5hbWUgZ2V0X2J1ZmZlcigpXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBhbiBvYmplY3QgY29uc2lzdGluZyBvZiBgbW9kZWAgKFwiY29weV9ub2RlXCIgb3IgXCJtb3ZlX25vZGVcIiksIGBub2RlYCAoYW4gYXJyYXkgb2Ygb2JqZWN0cykgYW5kIGBpbnN0YCAodGhlIGluc3RhbmNlKVxuXHRcdCAqL1xuXHRcdGdldF9idWZmZXIgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4geyAnbW9kZScgOiBjY3BfbW9kZSwgJ25vZGUnIDogY2NwX25vZGUsICdpbnN0JyA6IGNjcF9pbnN0IH07XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBjaGVjayBpZiB0aGVyZSBpcyBzb21ldGhpbmcgaW4gdGhlIGJ1ZmZlciB0byBwYXN0ZVxuXHRcdCAqIEBuYW1lIGNhbl9wYXN0ZSgpXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRjYW5fcGFzdGUgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2NwX21vZGUgIT09IGZhbHNlICYmIGNjcF9ub2RlICE9PSBmYWxzZTsgLy8gJiYgY2NwX2luc3QuX21vZGVsLmRhdGFbY2NwX25vZGVdO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogY29weSBvciBtb3ZlIHRoZSBwcmV2aW91c2x5IGN1dCBvciBjb3BpZWQgbm9kZXMgdG8gYSBuZXcgcGFyZW50XG5cdFx0ICogQG5hbWUgcGFzdGUob2JqIFssIHBvc10pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbmV3IHBhcmVudFxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBwb3MgdGhlIHBvc2l0aW9uIHRvIGluc2VydCBhdCAoYmVzaWRlcyBpbnRlZ2VyLCBcImZpcnN0XCIgYW5kIFwibGFzdFwiIGFyZSBzdXBwb3J0ZWQpLCBkZWZhdWx0cyB0byBpbnRlZ2VyIGAwYFxuXHRcdCAqIEB0cmlnZ2VyIHBhc3RlLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHBhc3RlIDogZnVuY3Rpb24gKG9iaiwgcG9zKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8ICFjY3BfbW9kZSB8fCAhY2NwX21vZGUubWF0Y2goL14oY29weV9ub2RlfG1vdmVfbm9kZSkkLykgfHwgIWNjcF9ub2RlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYodGhpc1tjY3BfbW9kZV0oY2NwX25vZGUsIG9iaiwgcG9zLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBjY3BfaW5zdCkpIHtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIHBhc3RlIGlzIGludm9rZWRcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIHBhc3RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcGFyZW50IHRoZSBJRCBvZiB0aGUgcmVjZWl2aW5nIG5vZGVcblx0XHRcdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZSB0aGUgbm9kZXMgaW4gdGhlIGJ1ZmZlclxuXHRcdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gbW9kZSB0aGUgcGVyZm9ybWVkIG9wZXJhdGlvbiAtIFwiY29weV9ub2RlXCIgb3IgXCJtb3ZlX25vZGVcIlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdwYXN0ZScsIHsgXCJwYXJlbnRcIiA6IG9iai5pZCwgXCJub2RlXCIgOiBjY3Bfbm9kZSwgXCJtb2RlXCIgOiBjY3BfbW9kZSB9KTtcblx0XHRcdH1cblx0XHRcdGNjcF9ub2RlID0gZmFsc2U7XG5cdFx0XHRjY3BfbW9kZSA9IGZhbHNlO1xuXHRcdFx0Y2NwX2luc3QgPSBmYWxzZTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGNsZWFyIHRoZSBidWZmZXIgb2YgcHJldmlvdXNseSBjb3BpZWQgb3IgY3V0IG5vZGVzXG5cdFx0ICogQG5hbWUgY2xlYXJfYnVmZmVyKClcblx0XHQgKiBAdHJpZ2dlciBjbGVhcl9idWZmZXIuanN0cmVlXG5cdFx0ICovXG5cdFx0Y2xlYXJfYnVmZmVyIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0Y2NwX25vZGUgPSBmYWxzZTtcblx0XHRcdGNjcF9tb2RlID0gZmFsc2U7XG5cdFx0XHRjY3BfaW5zdCA9IGZhbHNlO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiB0aGUgY29weSAvIGN1dCBidWZmZXIgaXMgY2xlYXJlZFxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBjbGVhcl9idWZmZXIuanN0cmVlXG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignY2xlYXJfYnVmZmVyJyk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBwdXQgYSBub2RlIGluIGVkaXQgbW9kZSAoaW5wdXQgZmllbGQgdG8gcmVuYW1lIHRoZSBub2RlKVxuXHRcdCAqIEBuYW1lIGVkaXQob2JqIFssIGRlZmF1bHRfdGV4dCwgY2FsbGJhY2tdKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IGRlZmF1bHRfdGV4dCB0aGUgdGV4dCB0byBwb3B1bGF0ZSB0aGUgaW5wdXQgd2l0aCAoaWYgb21pdHRlZCBvciBzZXQgdG8gYSBub24tc3RyaW5nIHZhbHVlIHRoZSBub2RlJ3MgdGV4dCB2YWx1ZSBpcyB1c2VkKVxuXHRcdCAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbmNlIHRoZSB0ZXh0IGJveCBpcyBibHVycmVkLCBpdCBpcyBjYWxsZWQgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUgYW5kIHJlY2VpdmVzIHRoZSBub2RlLCBhIHN0YXR1cyBwYXJhbWV0ZXIgKHRydWUgaWYgdGhlIHJlbmFtZSBpcyBzdWNjZXNzZnVsLCBmYWxzZSBvdGhlcndpc2UpIGFuZCBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgdXNlciBjYW5jZWxsZWQgdGhlIGVkaXQuIFlvdSBjYW4gYWNjZXNzIHRoZSBub2RlJ3MgdGl0bGUgdXNpbmcgLnRleHRcblx0XHQgKi9cblx0XHRlZGl0IDogZnVuY3Rpb24gKG9iaiwgZGVmYXVsdF90ZXh0LCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIHJ0bCwgdywgYSwgcywgdCwgaDEsIGgyLCBmbiwgdG1wLCBjYW5jZWwgPSBmYWxzZTtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmopIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZighdGhpcy5jaGVjayhcImVkaXRcIiwgb2JqLCB0aGlzLmdldF9wYXJlbnQob2JqKSkpIHtcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy5jb3JlLmVycm9yLmNhbGwodGhpcywgdGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBvYmo7XG5cdFx0XHRkZWZhdWx0X3RleHQgPSB0eXBlb2YgZGVmYXVsdF90ZXh0ID09PSAnc3RyaW5nJyA/IGRlZmF1bHRfdGV4dCA6IG9iai50ZXh0O1xuXHRcdFx0dGhpcy5zZXRfdGV4dChvYmosIFwiXCIpO1xuXHRcdFx0b2JqID0gdGhpcy5fb3Blbl90byhvYmopO1xuXHRcdFx0dG1wLnRleHQgPSBkZWZhdWx0X3RleHQ7XG5cblx0XHRcdHJ0bCA9IHRoaXMuX2RhdGEuY29yZS5ydGw7XG5cdFx0XHR3ICA9IHRoaXMuZWxlbWVudC53aWR0aCgpO1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLmZvY3VzZWQgPSB0bXAuaWQ7XG5cdFx0XHRhICA9IG9iai5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5mb2N1cygpO1xuXHRcdFx0cyAgPSAkKCc8c3Bhbj4nKTtcblx0XHRcdC8qIVxuXHRcdFx0b2kgPSBvYmouY2hpbGRyZW4oXCJpOnZpc2libGVcIiksXG5cdFx0XHRhaSA9IGEuY2hpbGRyZW4oXCJpOnZpc2libGVcIiksXG5cdFx0XHR3MSA9IG9pLndpZHRoKCkgKiBvaS5sZW5ndGgsXG5cdFx0XHR3MiA9IGFpLndpZHRoKCkgKiBhaS5sZW5ndGgsXG5cdFx0XHQqL1xuXHRcdFx0dCAgPSBkZWZhdWx0X3RleHQ7XG5cdFx0XHRoMSA9ICQoXCI8XCIrXCJkaXYgLz5cIiwgeyBjc3MgOiB7IFwicG9zaXRpb25cIiA6IFwiYWJzb2x1dGVcIiwgXCJ0b3BcIiA6IFwiLTIwMHB4XCIsIFwibGVmdFwiIDogKHJ0bCA/IFwiMHB4XCIgOiBcIi0xMDAwcHhcIiksIFwidmlzaWJpbGl0eVwiIDogXCJoaWRkZW5cIiB9IH0pLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuXHRcdFx0aDIgPSAkKFwiPFwiK1wiaW5wdXQgLz5cIiwge1xuXHRcdFx0XHRcdFx0XCJ2YWx1ZVwiIDogdCxcblx0XHRcdFx0XHRcdFwiY2xhc3NcIiA6IFwianN0cmVlLXJlbmFtZS1pbnB1dFwiLFxuXHRcdFx0XHRcdFx0Ly8gXCJzaXplXCIgOiB0Lmxlbmd0aCxcblx0XHRcdFx0XHRcdFwiY3NzXCIgOiB7XG5cdFx0XHRcdFx0XHRcdFwicGFkZGluZ1wiIDogXCIwXCIsXG5cdFx0XHRcdFx0XHRcdFwiYm9yZGVyXCIgOiBcIjFweCBzb2xpZCBzaWx2ZXJcIixcblx0XHRcdFx0XHRcdFx0XCJib3gtc2l6aW5nXCIgOiBcImJvcmRlci1ib3hcIixcblx0XHRcdFx0XHRcdFx0XCJkaXNwbGF5XCIgOiBcImlubGluZS1ibG9ja1wiLFxuXHRcdFx0XHRcdFx0XHRcImhlaWdodFwiIDogKHRoaXMuX2RhdGEuY29yZS5saV9oZWlnaHQpICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0XHRcImxpbmVIZWlnaHRcIiA6ICh0aGlzLl9kYXRhLmNvcmUubGlfaGVpZ2h0KSArIFwicHhcIixcblx0XHRcdFx0XHRcdFx0XCJ3aWR0aFwiIDogXCIxNTBweFwiIC8vIHdpbGwgYmUgc2V0IGEgYml0IGZ1cnRoZXIgZG93blxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwiYmx1clwiIDogJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdHZhciBpID0gcy5jaGlsZHJlbihcIi5qc3RyZWUtcmVuYW1lLWlucHV0XCIpLFxuXHRcdFx0XHRcdFx0XHRcdHYgPSBpLnZhbCgpLFxuXHRcdFx0XHRcdFx0XHRcdGYgPSB0aGlzLnNldHRpbmdzLmNvcmUuZm9yY2VfdGV4dCxcblx0XHRcdFx0XHRcdFx0XHRudjtcblx0XHRcdFx0XHRcdFx0aWYodiA9PT0gXCJcIikgeyB2ID0gdDsgfVxuXHRcdFx0XHRcdFx0XHRoMS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0cy5yZXBsYWNlV2l0aChhKTtcblx0XHRcdFx0XHRcdFx0cy5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0dCA9IGYgPyB0IDogJCgnPGRpdj48L2Rpdj4nKS5hcHBlbmQoJC5wYXJzZUhUTUwodCkpLmh0bWwoKTtcblx0XHRcdFx0XHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNldF90ZXh0KG9iaiwgdCk7XG5cdFx0XHRcdFx0XHRcdG52ID0gISF0aGlzLnJlbmFtZV9ub2RlKG9iaiwgZiA/ICQoJzxkaXY+PC9kaXY+JykudGV4dCh2KS50ZXh0KCkgOiAkKCc8ZGl2PjwvZGl2PicpLmFwcGVuZCgkLnBhcnNlSFRNTCh2KSkuaHRtbCgpKTtcblx0XHRcdFx0XHRcdFx0aWYoIW52KSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zZXRfdGV4dChvYmosIHQpOyAvLyBtb3ZlIHRoaXMgdXA/IGFuZCBmaXggIzQ4M1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5mb2N1c2VkID0gdG1wLmlkO1xuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBub2RlID0gdGhpcy5nZXRfbm9kZSh0bXAuaWQsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKG5vZGUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCA9IHRtcC5pZDtcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGUuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sIHRoaXMpLCAwKTtcblx0XHRcdFx0XHRcdFx0aWYoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIHRtcCwgbnYsIGNhbmNlbCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aDIgPSBudWxsO1xuXHRcdFx0XHRcdFx0fSwgdGhpcyksXG5cdFx0XHRcdFx0XHRcImtleWRvd25cIiA6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBrZXkgPSBlLndoaWNoO1xuXHRcdFx0XHRcdFx0XHRpZihrZXkgPT09IDI3KSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FuY2VsID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihrZXkgPT09IDI3IHx8IGtleSA9PT0gMTMgfHwga2V5ID09PSAzNyB8fCBrZXkgPT09IDM4IHx8IGtleSA9PT0gMzkgfHwga2V5ID09PSA0MCB8fCBrZXkgPT09IDMyKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZihrZXkgPT09IDI3IHx8IGtleSA9PT0gMTMpIHtcblx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5ibHVyKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcImNsaWNrXCIgOiBmdW5jdGlvbiAoZSkgeyBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpOyB9LFxuXHRcdFx0XHRcdFx0XCJtb3VzZWRvd25cIiA6IGZ1bmN0aW9uIChlKSB7IGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7IH0sXG5cdFx0XHRcdFx0XHRcImtleXVwXCIgOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRoMi53aWR0aChNYXRoLm1pbihoMS50ZXh0KFwicFdcIiArIHRoaXMudmFsdWUpLndpZHRoKCksdykpO1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwia2V5cHJlc3NcIiA6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRcdFx0aWYoZS53aGljaCA9PT0gMTMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdGZuID0ge1xuXHRcdFx0XHRcdFx0Zm9udEZhbWlseVx0XHQ6IGEuY3NzKCdmb250RmFtaWx5JylcdFx0fHwgJycsXG5cdFx0XHRcdFx0XHRmb250U2l6ZVx0XHQ6IGEuY3NzKCdmb250U2l6ZScpXHRcdFx0fHwgJycsXG5cdFx0XHRcdFx0XHRmb250V2VpZ2h0XHRcdDogYS5jc3MoJ2ZvbnRXZWlnaHQnKVx0XHR8fCAnJyxcblx0XHRcdFx0XHRcdGZvbnRTdHlsZVx0XHQ6IGEuY3NzKCdmb250U3R5bGUnKVx0XHR8fCAnJyxcblx0XHRcdFx0XHRcdGZvbnRTdHJldGNoXHRcdDogYS5jc3MoJ2ZvbnRTdHJldGNoJylcdFx0fHwgJycsXG5cdFx0XHRcdFx0XHRmb250VmFyaWFudFx0XHQ6IGEuY3NzKCdmb250VmFyaWFudCcpXHRcdHx8ICcnLFxuXHRcdFx0XHRcdFx0bGV0dGVyU3BhY2luZ1x0OiBhLmNzcygnbGV0dGVyU3BhY2luZycpXHR8fCAnJyxcblx0XHRcdFx0XHRcdHdvcmRTcGFjaW5nXHRcdDogYS5jc3MoJ3dvcmRTcGFjaW5nJylcdFx0fHwgJydcblx0XHRcdFx0fTtcblx0XHRcdHMuYXR0cignY2xhc3MnLCBhLmF0dHIoJ2NsYXNzJykpLmFwcGVuZChhLmNvbnRlbnRzKCkuY2xvbmUoKSkuYXBwZW5kKGgyKTtcblx0XHRcdGEucmVwbGFjZVdpdGgocyk7XG5cdFx0XHRoMS5jc3MoZm4pO1xuXHRcdFx0aDIuY3NzKGZuKS53aWR0aChNYXRoLm1pbihoMS50ZXh0KFwicFdcIiArIGgyWzBdLnZhbHVlKS53aWR0aCgpLHcpKVswXS5zZWxlY3QoKTtcblx0XHRcdCQoZG9jdW1lbnQpLm9uZSgnbW91c2Vkb3duLmpzdHJlZSB0b3VjaHN0YXJ0LmpzdHJlZSBkbmRfc3RhcnQudmFrYXRhJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKGgyICYmIGUudGFyZ2V0ICE9PSBoMikge1xuXHRcdFx0XHRcdCQoaDIpLmJsdXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICogY2hhbmdlcyB0aGUgdGhlbWVcblx0XHQgKiBAbmFtZSBzZXRfdGhlbWUodGhlbWVfbmFtZSBbLCB0aGVtZV91cmxdKVxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0aGVtZV9uYW1lIHRoZSBuYW1lIG9mIHRoZSBuZXcgdGhlbWUgdG8gYXBwbHlcblx0XHQgKiBAcGFyYW0ge21peGVkfSB0aGVtZV91cmwgIHRoZSBsb2NhdGlvbiBvZiB0aGUgQ1NTIGZpbGUgZm9yIHRoaXMgdGhlbWUuIE9taXQgb3Igc2V0IHRvIGBmYWxzZWAgaWYgeW91IG1hbnVhbGx5IGluY2x1ZGVkIHRoZSBmaWxlLiBTZXQgdG8gYHRydWVgIHRvIGF1dG9sb2FkIGZyb20gdGhlIGBjb3JlLnRoZW1lcy5kaXJgIGRpcmVjdG9yeS5cblx0XHQgKiBAdHJpZ2dlciBzZXRfdGhlbWUuanN0cmVlXG5cdFx0ICovXG5cdFx0c2V0X3RoZW1lIDogZnVuY3Rpb24gKHRoZW1lX25hbWUsIHRoZW1lX3VybCkge1xuXHRcdFx0aWYoIXRoZW1lX25hbWUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRpZih0aGVtZV91cmwgPT09IHRydWUpIHtcblx0XHRcdFx0dmFyIGRpciA9IHRoaXMuc2V0dGluZ3MuY29yZS50aGVtZXMuZGlyO1xuXHRcdFx0XHRpZighZGlyKSB7IGRpciA9ICQuanN0cmVlLnBhdGggKyAnL3RoZW1lcyc7IH1cblx0XHRcdFx0dGhlbWVfdXJsID0gZGlyICsgJy8nICsgdGhlbWVfbmFtZSArICcvc3R5bGUuY3NzJztcblx0XHRcdH1cblx0XHRcdGlmKHRoZW1lX3VybCAmJiAkLmluQXJyYXkodGhlbWVfdXJsLCB0aGVtZXNfbG9hZGVkKSA9PT0gLTEpIHtcblx0XHRcdFx0JCgnaGVhZCcpLmFwcGVuZCgnPCcrJ2xpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCInICsgdGhlbWVfdXJsICsgJ1wiIHR5cGU9XCJ0ZXh0L2Nzc1wiIC8+Jyk7XG5cdFx0XHRcdHRoZW1lc19sb2FkZWQucHVzaCh0aGVtZV91cmwpO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5uYW1lKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnanN0cmVlLScgKyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLm5hbWUpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5uYW1lID0gdGhlbWVfbmFtZTtcblx0XHRcdHRoaXMuZWxlbWVudC5hZGRDbGFzcygnanN0cmVlLScgKyB0aGVtZV9uYW1lKTtcblx0XHRcdHRoaXMuZWxlbWVudFt0aGlzLnNldHRpbmdzLmNvcmUudGhlbWVzLnJlc3BvbnNpdmUgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJyBdKCdqc3RyZWUtJyArIHRoZW1lX25hbWUgKyAnLXJlc3BvbnNpdmUnKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYSB0aGVtZSBpcyBzZXRcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2V0X3RoZW1lLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRoZW1lIHRoZSBuZXcgdGhlbWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzZXRfdGhlbWUnLCB7ICd0aGVtZScgOiB0aGVtZV9uYW1lIH0pO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogZ2V0cyB0aGUgbmFtZSBvZiB0aGUgY3VycmVudGx5IGFwcGxpZWQgdGhlbWUgbmFtZVxuXHRcdCAqIEBuYW1lIGdldF90aGVtZSgpXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdGdldF90aGVtZSA6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2RhdGEuY29yZS50aGVtZXMubmFtZTsgfSxcblx0XHQvKipcblx0XHQgKiBjaGFuZ2VzIHRoZSB0aGVtZSB2YXJpYW50IChpZiB0aGUgdGhlbWUgaGFzIHZhcmlhbnRzKVxuXHRcdCAqIEBuYW1lIHNldF90aGVtZV92YXJpYW50KHZhcmlhbnRfbmFtZSlcblx0XHQgKiBAcGFyYW0ge1N0cmluZ3xCb29sZWFufSB2YXJpYW50X25hbWUgdGhlIHZhcmlhbnQgdG8gYXBwbHkgKGlmIGBmYWxzZWAgaXMgdXNlZCB0aGUgY3VycmVudCB2YXJpYW50IGlzIHJlbW92ZWQpXG5cdFx0ICovXG5cdFx0c2V0X3RoZW1lX3ZhcmlhbnQgOiBmdW5jdGlvbiAodmFyaWFudF9uYW1lKSB7XG5cdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnZhcmlhbnQpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdqc3RyZWUtJyArIHRoaXMuX2RhdGEuY29yZS50aGVtZXMubmFtZSArICctJyArIHRoaXMuX2RhdGEuY29yZS50aGVtZXMudmFyaWFudCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnZhcmlhbnQgPSB2YXJpYW50X25hbWU7XG5cdFx0XHRpZih2YXJpYW50X25hbWUpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmFkZENsYXNzKCdqc3RyZWUtJyArIHRoaXMuX2RhdGEuY29yZS50aGVtZXMubmFtZSArICctJyArIHRoaXMuX2RhdGEuY29yZS50aGVtZXMudmFyaWFudCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXRzIHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50bHkgYXBwbGllZCB0aGVtZSB2YXJpYW50XG5cdFx0ICogQG5hbWUgZ2V0X3RoZW1lKClcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0Z2V0X3RoZW1lX3ZhcmlhbnQgOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLnZhcmlhbnQ7IH0sXG5cdFx0LyoqXG5cdFx0ICogc2hvd3MgYSBzdHJpcGVkIGJhY2tncm91bmQgb24gdGhlIGNvbnRhaW5lciAoaWYgdGhlIHRoZW1lIHN1cHBvcnRzIGl0KVxuXHRcdCAqIEBuYW1lIHNob3dfc3RyaXBlcygpXG5cdFx0ICovXG5cdFx0c2hvd19zdHJpcGVzIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5zdHJpcGVzID0gdHJ1ZTtcblx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmFkZENsYXNzKFwianN0cmVlLXN0cmlwZWRcIik7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIHN0cmlwZXMgYXJlIHNob3duXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNob3dfc3RyaXBlcy5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzaG93X3N0cmlwZXMnKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGhpZGVzIHRoZSBzdHJpcGVkIGJhY2tncm91bmQgb24gdGhlIGNvbnRhaW5lclxuXHRcdCAqIEBuYW1lIGhpZGVfc3RyaXBlcygpXG5cdFx0ICovXG5cdFx0aGlkZV9zdHJpcGVzIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5zdHJpcGVzID0gZmFsc2U7XG5cdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5yZW1vdmVDbGFzcyhcImpzdHJlZS1zdHJpcGVkXCIpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBzdHJpcGVzIGFyZSBoaWRkZW5cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgaGlkZV9zdHJpcGVzLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2hpZGVfc3RyaXBlcycpO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogdG9nZ2xlcyB0aGUgc3RyaXBlZCBiYWNrZ3JvdW5kIG9uIHRoZSBjb250YWluZXJcblx0XHQgKiBAbmFtZSB0b2dnbGVfc3RyaXBlcygpXG5cdFx0ICovXG5cdFx0dG9nZ2xlX3N0cmlwZXMgOiBmdW5jdGlvbiAoKSB7IGlmKHRoaXMuX2RhdGEuY29yZS50aGVtZXMuc3RyaXBlcykgeyB0aGlzLmhpZGVfc3RyaXBlcygpOyB9IGVsc2UgeyB0aGlzLnNob3dfc3RyaXBlcygpOyB9IH0sXG5cdFx0LyoqXG5cdFx0ICogc2hvd3MgdGhlIGNvbm5lY3RpbmcgZG90cyAoaWYgdGhlIHRoZW1lIHN1cHBvcnRzIGl0KVxuXHRcdCAqIEBuYW1lIHNob3dfZG90cygpXG5cdFx0ICovXG5cdFx0c2hvd19kb3RzIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5kb3RzID0gdHJ1ZTtcblx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLnJlbW92ZUNsYXNzKFwianN0cmVlLW5vLWRvdHNcIik7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGRvdHMgYXJlIHNob3duXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNob3dfZG90cy5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzaG93X2RvdHMnKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGhpZGVzIHRoZSBjb25uZWN0aW5nIGRvdHNcblx0XHQgKiBAbmFtZSBoaWRlX2RvdHMoKVxuXHRcdCAqL1xuXHRcdGhpZGVfZG90cyA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZG90cyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkuYWRkQ2xhc3MoXCJqc3RyZWUtbm8tZG90c1wiKTtcblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gZG90cyBhcmUgaGlkZGVuXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGhpZGVfZG90cy5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdoaWRlX2RvdHMnKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHRvZ2dsZXMgdGhlIGNvbm5lY3RpbmcgZG90c1xuXHRcdCAqIEBuYW1lIHRvZ2dsZV9kb3RzKClcblx0XHQgKi9cblx0XHR0b2dnbGVfZG90cyA6IGZ1bmN0aW9uICgpIHsgaWYodGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5kb3RzKSB7IHRoaXMuaGlkZV9kb3RzKCk7IH0gZWxzZSB7IHRoaXMuc2hvd19kb3RzKCk7IH0gfSxcblx0XHQvKipcblx0XHQgKiBzaG93IHRoZSBub2RlIGljb25zXG5cdFx0ICogQG5hbWUgc2hvd19pY29ucygpXG5cdFx0ICovXG5cdFx0c2hvd19pY29ucyA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuaWNvbnMgPSB0cnVlO1xuXHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtbm8taWNvbnNcIik7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGljb25zIGFyZSBzaG93blxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzaG93X2ljb25zLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3Nob3dfaWNvbnMnKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGhpZGUgdGhlIG5vZGUgaWNvbnNcblx0XHQgKiBAbmFtZSBoaWRlX2ljb25zKClcblx0XHQgKi9cblx0XHRoaWRlX2ljb25zIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5pY29ucyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkuYWRkQ2xhc3MoXCJqc3RyZWUtbm8taWNvbnNcIik7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGljb25zIGFyZSBoaWRkZW5cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgaGlkZV9pY29ucy5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdoaWRlX2ljb25zJyk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiB0b2dnbGUgdGhlIG5vZGUgaWNvbnNcblx0XHQgKiBAbmFtZSB0b2dnbGVfaWNvbnMoKVxuXHRcdCAqL1xuXHRcdHRvZ2dsZV9pY29ucyA6IGZ1bmN0aW9uICgpIHsgaWYodGhpcy5fZGF0YS5jb3JlLnRoZW1lcy5pY29ucykgeyB0aGlzLmhpZGVfaWNvbnMoKTsgfSBlbHNlIHsgdGhpcy5zaG93X2ljb25zKCk7IH0gfSxcblx0XHQvKipcblx0XHQgKiBzaG93IHRoZSBub2RlIGVsbGlwc2lzXG5cdFx0ICogQG5hbWUgc2hvd19pY29ucygpXG5cdFx0ICovXG5cdFx0c2hvd19lbGxpcHNpcyA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZWxsaXBzaXMgPSB0cnVlO1xuXHRcdFx0dGhpcy5nZXRfY29udGFpbmVyX3VsKCkuYWRkQ2xhc3MoXCJqc3RyZWUtZWxsaXBzaXNcIik7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGVsbGlzaXMgaXMgc2hvd25cblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgc2hvd19lbGxpcHNpcy5qc3RyZWVcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdzaG93X2VsbGlwc2lzJyk7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBoaWRlIHRoZSBub2RlIGVsbGlwc2lzXG5cdFx0ICogQG5hbWUgaGlkZV9lbGxpcHNpcygpXG5cdFx0ICovXG5cdFx0aGlkZV9lbGxpcHNpcyA6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX2RhdGEuY29yZS50aGVtZXMuZWxsaXBzaXMgPSBmYWxzZTtcblx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLnJlbW92ZUNsYXNzKFwianN0cmVlLWVsbGlwc2lzXCIpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBlbGxpc2lzIGlzIGhpZGRlblxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBoaWRlX2VsbGlwc2lzLmpzdHJlZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2hpZGVfZWxsaXBzaXMnKTtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIHRvZ2dsZSB0aGUgbm9kZSBlbGxpcHNpc1xuXHRcdCAqIEBuYW1lIHRvZ2dsZV9pY29ucygpXG5cdFx0ICovXG5cdFx0dG9nZ2xlX2VsbGlwc2lzIDogZnVuY3Rpb24gKCkgeyBpZih0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmVsbGlwc2lzKSB7IHRoaXMuaGlkZV9lbGxpcHNpcygpOyB9IGVsc2UgeyB0aGlzLnNob3dfZWxsaXBzaXMoKTsgfSB9LFxuXHRcdC8qKlxuXHRcdCAqIHNldCB0aGUgbm9kZSBpY29uIGZvciBhIG5vZGVcblx0XHQgKiBAbmFtZSBzZXRfaWNvbihvYmosIGljb24pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IGljb24gdGhlIG5ldyBpY29uIC0gY2FuIGJlIGEgcGF0aCB0byBhbiBpY29uIG9yIGEgY2xhc3NOYW1lLCBpZiB1c2luZyBhbiBpbWFnZSB0aGF0IGlzIGluIHRoZSBjdXJyZW50IGRpcmVjdG9yeSB1c2UgYSBgLi9gIHByZWZpeCwgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgZGV0ZWN0ZWQgYXMgYSBjbGFzc1xuXHRcdCAqL1xuXHRcdHNldF9pY29uIDogZnVuY3Rpb24gKG9iaiwgaWNvbikge1xuXHRcdFx0dmFyIHQxLCB0MiwgZG9tLCBvbGQ7XG5cdFx0XHRpZigkLmlzQXJyYXkob2JqKSkge1xuXHRcdFx0XHRvYmogPSBvYmouc2xpY2UoKTtcblx0XHRcdFx0Zm9yKHQxID0gMCwgdDIgPSBvYmoubGVuZ3RoOyB0MSA8IHQyOyB0MSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRfaWNvbihvYmpbdDFdLCBpY29uKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0b2xkID0gb2JqLmljb247XG5cdFx0XHRvYmouaWNvbiA9IGljb24gPT09IHRydWUgfHwgaWNvbiA9PT0gbnVsbCB8fCBpY29uID09PSB1bmRlZmluZWQgfHwgaWNvbiA9PT0gJycgPyB0cnVlIDogaWNvbjtcblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS10aGVtZWljb25cIik7XG5cdFx0XHRpZihpY29uID09PSBmYWxzZSkge1xuXHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3MoJ2pzdHJlZS10aGVtZWljb24tY3VzdG9tICcgKyBvbGQpLmNzcyhcImJhY2tncm91bmRcIixcIlwiKS5yZW1vdmVBdHRyKFwicmVsXCIpO1xuXHRcdFx0XHR0aGlzLmhpZGVfaWNvbihvYmopO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZihpY29uID09PSB0cnVlIHx8IGljb24gPT09IG51bGwgfHwgaWNvbiA9PT0gdW5kZWZpbmVkIHx8IGljb24gPT09ICcnKSB7XG5cdFx0XHRcdGRvbS5yZW1vdmVDbGFzcygnanN0cmVlLXRoZW1laWNvbi1jdXN0b20gJyArIG9sZCkuY3NzKFwiYmFja2dyb3VuZFwiLFwiXCIpLnJlbW92ZUF0dHIoXCJyZWxcIik7XG5cdFx0XHRcdGlmKG9sZCA9PT0gZmFsc2UpIHsgdGhpcy5zaG93X2ljb24ob2JqKTsgfVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZihpY29uLmluZGV4T2YoXCIvXCIpID09PSAtMSAmJiBpY29uLmluZGV4T2YoXCIuXCIpID09PSAtMSkge1xuXHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3Mob2xkKS5jc3MoXCJiYWNrZ3JvdW5kXCIsXCJcIik7XG5cdFx0XHRcdGRvbS5hZGRDbGFzcyhpY29uICsgJyBqc3RyZWUtdGhlbWVpY29uLWN1c3RvbScpLmF0dHIoXCJyZWxcIixpY29uKTtcblx0XHRcdFx0aWYob2xkID09PSBmYWxzZSkgeyB0aGlzLnNob3dfaWNvbihvYmopOyB9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKG9sZCkuY3NzKFwiYmFja2dyb3VuZFwiLFwiXCIpO1xuXHRcdFx0XHRkb20uYWRkQ2xhc3MoJ2pzdHJlZS10aGVtZWljb24tY3VzdG9tJykuY3NzKFwiYmFja2dyb3VuZFwiLCBcInVybCgnXCIgKyBpY29uICsgXCInKSBjZW50ZXIgY2VudGVyIG5vLXJlcGVhdFwiKS5hdHRyKFwicmVsXCIsaWNvbik7XG5cdFx0XHRcdGlmKG9sZCA9PT0gZmFsc2UpIHsgdGhpcy5zaG93X2ljb24ob2JqKTsgfVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBnZXQgdGhlIG5vZGUgaWNvbiBmb3IgYSBub2RlXG5cdFx0ICogQG5hbWUgZ2V0X2ljb24ob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9ialxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cblx0XHQgKi9cblx0XHRnZXRfaWNvbiA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiAoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpID8gZmFsc2UgOiBvYmouaWNvbjtcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIGhpZGUgdGhlIGljb24gb24gYW4gaW5kaXZpZHVhbCBub2RlXG5cdFx0ICogQG5hbWUgaGlkZV9pY29uKG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmpcblx0XHQgKi9cblx0XHRoaWRlX2ljb24gOiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgdDEsIHQyO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuaGlkZV9pY29uKG9ialt0MV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmogPT09ICQuanN0cmVlLnJvb3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRvYmouaWNvbiA9IGZhbHNlO1xuXHRcdFx0dGhpcy5nZXRfbm9kZShvYmosIHRydWUpLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikuY2hpbGRyZW4oXCIuanN0cmVlLXRoZW1laWNvblwiKS5hZGRDbGFzcygnanN0cmVlLXRoZW1laWNvbi1oaWRkZW4nKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogc2hvdyB0aGUgaWNvbiBvbiBhbiBpbmRpdmlkdWFsIG5vZGVcblx0XHQgKiBAbmFtZSBzaG93X2ljb24ob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9ialxuXHRcdCAqL1xuXHRcdHNob3dfaWNvbiA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdHZhciB0MSwgdDIsIGRvbTtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLnNob3dfaWNvbihvYmpbdDFdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0b2JqLmljb24gPSBkb20ubGVuZ3RoID8gZG9tLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikuY2hpbGRyZW4oXCIuanN0cmVlLXRoZW1laWNvblwiKS5hdHRyKCdyZWwnKSA6IHRydWU7XG5cdFx0XHRpZighb2JqLmljb24pIHsgb2JqLmljb24gPSB0cnVlOyB9XG5cdFx0XHRkb20uY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5jaGlsZHJlbihcIi5qc3RyZWUtdGhlbWVpY29uXCIpLnJlbW92ZUNsYXNzKCdqc3RyZWUtdGhlbWVpY29uLWhpZGRlbicpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIGhlbHBlcnNcblx0JC52YWthdGEgPSB7fTtcblx0Ly8gY29sbGVjdCBhdHRyaWJ1dGVzXG5cdCQudmFrYXRhLmF0dHJpYnV0ZXMgPSBmdW5jdGlvbihub2RlLCB3aXRoX3ZhbHVlcykge1xuXHRcdG5vZGUgPSAkKG5vZGUpWzBdO1xuXHRcdHZhciBhdHRyID0gd2l0aF92YWx1ZXMgPyB7fSA6IFtdO1xuXHRcdGlmKG5vZGUgJiYgbm9kZS5hdHRyaWJ1dGVzKSB7XG5cdFx0XHQkLmVhY2gobm9kZS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSwgdikge1xuXHRcdFx0XHRpZigkLmluQXJyYXkodi5uYW1lLnRvTG93ZXJDYXNlKCksWydzdHlsZScsJ2NvbnRlbnRlZGl0YWJsZScsJ2hhc2ZvY3VzJywndGFiaW5kZXgnXSkgIT09IC0xKSB7IHJldHVybjsgfVxuXHRcdFx0XHRpZih2LnZhbHVlICE9PSBudWxsICYmICQudHJpbSh2LnZhbHVlKSAhPT0gJycpIHtcblx0XHRcdFx0XHRpZih3aXRoX3ZhbHVlcykgeyBhdHRyW3YubmFtZV0gPSB2LnZhbHVlOyB9XG5cdFx0XHRcdFx0ZWxzZSB7IGF0dHIucHVzaCh2Lm5hbWUpOyB9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gYXR0cjtcblx0fTtcblx0JC52YWthdGEuYXJyYXlfdW5pcXVlID0gZnVuY3Rpb24oYXJyYXkpIHtcblx0XHR2YXIgYSA9IFtdLCBpLCBqLCBsLCBvID0ge307XG5cdFx0Zm9yKGkgPSAwLCBsID0gYXJyYXkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRpZihvW2FycmF5W2ldXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGEucHVzaChhcnJheVtpXSk7XG5cdFx0XHRcdG9bYXJyYXlbaV1dID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGE7XG5cdH07XG5cdC8vIHJlbW92ZSBpdGVtIGZyb20gYXJyYXlcblx0JC52YWthdGEuYXJyYXlfcmVtb3ZlID0gZnVuY3Rpb24oYXJyYXksIGZyb20pIHtcblx0XHRhcnJheS5zcGxpY2UoZnJvbSwgMSk7XG5cdFx0cmV0dXJuIGFycmF5O1xuXHRcdC8vdmFyIHJlc3QgPSBhcnJheS5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IGFycmF5Lmxlbmd0aCk7XG5cdFx0Ly9hcnJheS5sZW5ndGggPSBmcm9tIDwgMCA/IGFycmF5Lmxlbmd0aCArIGZyb20gOiBmcm9tO1xuXHRcdC8vYXJyYXkucHVzaC5hcHBseShhcnJheSwgcmVzdCk7XG5cdFx0Ly9yZXR1cm4gYXJyYXk7XG5cdH07XG5cdC8vIHJlbW92ZSBpdGVtIGZyb20gYXJyYXlcblx0JC52YWthdGEuYXJyYXlfcmVtb3ZlX2l0ZW0gPSBmdW5jdGlvbihhcnJheSwgaXRlbSkge1xuXHRcdHZhciB0bXAgPSAkLmluQXJyYXkoaXRlbSwgYXJyYXkpO1xuXHRcdHJldHVybiB0bXAgIT09IC0xID8gJC52YWthdGEuYXJyYXlfcmVtb3ZlKGFycmF5LCB0bXApIDogYXJyYXk7XG5cdH07XG5cdCQudmFrYXRhLmFycmF5X2ZpbHRlciA9IGZ1bmN0aW9uKGMsYSxiLGQsZSkge1xuXHRcdGlmIChjLmZpbHRlcikge1xuXHRcdFx0cmV0dXJuIGMuZmlsdGVyKGEsIGIpO1xuXHRcdH1cblx0XHRkPVtdO1xuXHRcdGZvciAoZSBpbiBjKSB7XG5cdFx0XHRpZiAofn5lKycnPT09ZSsnJyAmJiBlPj0wICYmIGEuY2FsbChiLGNbZV0sK2UsYykpIHtcblx0XHRcdFx0ZC5wdXNoKGNbZV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZDtcblx0fTtcblxuXG4vKipcbiAqICMjIyBDaGFuZ2VkIHBsdWdpblxuICpcbiAqIFRoaXMgcGx1Z2luIGFkZHMgbW9yZSBpbmZvcm1hdGlvbiB0byB0aGUgYGNoYW5nZWQuanN0cmVlYCBldmVudC4gVGhlIG5ldyBkYXRhIGlzIGNvbnRhaW5lZCBpbiB0aGUgYGNoYW5nZWRgIGV2ZW50IGRhdGEgcHJvcGVydHksIGFuZCBjb250YWlucyBhIGxpc3RzIG9mIGBzZWxlY3RlZGAgYW5kIGBkZXNlbGVjdGVkYCBub2Rlcy5cbiAqL1xuXG5cdCQuanN0cmVlLnBsdWdpbnMuY2hhbmdlZCA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR2YXIgbGFzdCA9IFtdO1xuXHRcdHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uIChldiwgZGF0YSkge1xuXHRcdFx0dmFyIGksIGo7XG5cdFx0XHRpZighZGF0YSkge1xuXHRcdFx0XHRkYXRhID0ge307XG5cdFx0XHR9XG5cdFx0XHRpZihldi5yZXBsYWNlKCcuanN0cmVlJywnJykgPT09ICdjaGFuZ2VkJykge1xuXHRcdFx0XHRkYXRhLmNoYW5nZWQgPSB7IHNlbGVjdGVkIDogW10sIGRlc2VsZWN0ZWQgOiBbXSB9O1xuXHRcdFx0XHR2YXIgdG1wID0ge307XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IGxhc3QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0dG1wW2xhc3RbaV1dID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkYXRhLnNlbGVjdGVkLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKCF0bXBbZGF0YS5zZWxlY3RlZFtpXV0pIHtcblx0XHRcdFx0XHRcdGRhdGEuY2hhbmdlZC5zZWxlY3RlZC5wdXNoKGRhdGEuc2VsZWN0ZWRbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRtcFtkYXRhLnNlbGVjdGVkW2ldXSA9IDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IGxhc3QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0aWYodG1wW2xhc3RbaV1dID09PSAxKSB7XG5cdFx0XHRcdFx0XHRkYXRhLmNoYW5nZWQuZGVzZWxlY3RlZC5wdXNoKGxhc3RbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRsYXN0ID0gZGF0YS5zZWxlY3RlZC5zbGljZSgpO1xuXHRcdFx0fVxuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBzZWxlY3Rpb24gY2hhbmdlcyAodGhlIFwiY2hhbmdlZFwiIHBsdWdpbiBlbmhhbmNlcyB0aGUgb3JpZ2luYWwgZXZlbnQgd2l0aCBtb3JlIGRhdGEpXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIGNoYW5nZWQuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiB0aGUgYWN0aW9uIHRoYXQgY2F1c2VkIHRoZSBzZWxlY3Rpb24gdG8gY2hhbmdlXG5cdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBjaGFuZ2VkIGFuIG9iamVjdCBjb250YWluaW5nIHR3byBwcm9wZXJ0aWVzIGBzZWxlY3RlZGAgYW5kIGBkZXNlbGVjdGVkYCAtIGJvdGggYXJyYXlzIG9mIG5vZGUgSURzLCB3aGljaCB3ZXJlIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQgc2luY2UgdGhlIGxhc3QgY2hhbmdlZCBldmVudFxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBldmVudCAoaWYgYW55KSB0aGF0IHRyaWdnZXJlZCB0aGlzIGNoYW5nZWQgZXZlbnRcblx0XHRcdCAqIEBwbHVnaW4gY2hhbmdlZFxuXHRcdFx0ICovXG5cdFx0XHRwYXJlbnQudHJpZ2dlci5jYWxsKHRoaXMsIGV2LCBkYXRhKTtcblx0XHR9O1xuXHRcdHRoaXMucmVmcmVzaCA9IGZ1bmN0aW9uIChza2lwX2xvYWRpbmcsIGZvcmdldF9zdGF0ZSkge1xuXHRcdFx0bGFzdCA9IFtdO1xuXHRcdFx0cmV0dXJuIHBhcmVudC5yZWZyZXNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fTtcblx0fTtcblxuLyoqXG4gKiAjIyMgQ2hlY2tib3ggcGx1Z2luXG4gKlxuICogVGhpcyBwbHVnaW4gcmVuZGVycyBjaGVja2JveCBpY29ucyBpbiBmcm9udCBvZiBlYWNoIG5vZGUsIG1ha2luZyBtdWx0aXBsZSBzZWxlY3Rpb24gbXVjaCBlYXNpZXIuXG4gKiBJdCBhbHNvIHN1cHBvcnRzIHRyaS1zdGF0ZSBiZWhhdmlvciwgbWVhbmluZyB0aGF0IGlmIGEgbm9kZSBoYXMgYSBmZXcgb2YgaXRzIGNoaWxkcmVuIGNoZWNrZWQgaXQgd2lsbCBiZSByZW5kZXJlZCBhcyB1bmRldGVybWluZWQsIGFuZCBzdGF0ZSB3aWxsIGJlIHByb3BhZ2F0ZWQgdXAuXG4gKi9cblxuXHR2YXIgX2kgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdJJyk7XG5cdF9pLmNsYXNzTmFtZSA9ICdqc3RyZWUtaWNvbiBqc3RyZWUtY2hlY2tib3gnO1xuXHRfaS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7XG5cdC8qKlxuXHQgKiBzdG9yZXMgYWxsIGRlZmF1bHRzIGZvciB0aGUgY2hlY2tib3ggcGx1Z2luXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94XG5cdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94ID0ge1xuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGNoZWNrYm94ZXMgc2hvdWxkIGJlIHZpc2libGUgKGNhbiBiZSBjaGFuZ2VkIGF0IGEgbGF0ZXIgdGltZSB1c2luZyBgc2hvd19jaGVja2JveGVzKClgIGFuZCBgaGlkZV9jaGVja2JveGVzYCkuIERlZmF1bHRzIHRvIGB0cnVlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveC52aXNpYmxlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHZpc2libGVcdFx0XHRcdDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBjaGVja2JveGVzIHNob3VsZCBjYXNjYWRlIGRvd24gYW5kIGhhdmUgYW4gdW5kZXRlcm1pbmVkIHN0YXRlLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY2hlY2tib3gudGhyZWVfc3RhdGVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhyZWVfc3RhdGVcdFx0XHQ6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgY2xpY2tpbmcgYW55d2hlcmUgb24gdGhlIG5vZGUgc2hvdWxkIGFjdCBhcyBjbGlja2luZyBvbiB0aGUgY2hlY2tib3guIERlZmF1bHRzIHRvIGB0cnVlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveC53aG9sZV9ub2RlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHdob2xlX25vZGVcdFx0XHQ6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIHNlbGVjdGVkIHN0eWxlIG9mIGEgbm9kZSBzaG91bGQgYmUga2VwdCwgb3IgcmVtb3ZlZC4gRGVmYXVsdHMgdG8gYHRydWVgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94LmtlZXBfc2VsZWN0ZWRfc3R5bGVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0a2VlcF9zZWxlY3RlZF9zdHlsZVx0OiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIFRoaXMgc2V0dGluZyBjb250cm9scyBob3cgY2FzY2FkaW5nIGFuZCB1bmRldGVybWluZWQgbm9kZXMgYXJlIGFwcGxpZWQuXG5cdFx0ICogSWYgJ3VwJyBpcyBpbiB0aGUgc3RyaW5nIC0gY2FzY2FkaW5nIHVwIGlzIGVuYWJsZWQsIGlmICdkb3duJyBpcyBpbiB0aGUgc3RyaW5nIC0gY2FzY2FkaW5nIGRvd24gaXMgZW5hYmxlZCwgaWYgJ3VuZGV0ZXJtaW5lZCcgaXMgaW4gdGhlIHN0cmluZyAtIHVuZGV0ZXJtaW5lZCBub2RlcyB3aWxsIGJlIHVzZWQuXG5cdFx0ICogSWYgYHRocmVlX3N0YXRlYCBpcyBzZXQgdG8gYHRydWVgIHRoaXMgc2V0dGluZyBpcyBhdXRvbWF0aWNhbGx5IHNldCB0byAndXArZG93bit1bmRldGVybWluZWQnLiBEZWZhdWx0cyB0byAnJy5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveC5jYXNjYWRlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdGNhc2NhZGVcdFx0XHRcdDogJycsXG5cdFx0LyoqXG5cdFx0ICogVGhpcyBzZXR0aW5nIGNvbnRyb2xzIGlmIGNoZWNrYm94IGFyZSBib3VuZCB0byB0aGUgZ2VuZXJhbCB0cmVlIHNlbGVjdGlvbiBvciB0byBhbiBpbnRlcm5hbCBhcnJheSBtYWludGFpbmVkIGJ5IHRoZSBjaGVja2JveCBwbHVnaW4uIERlZmF1bHRzIHRvIGB0cnVlYCwgb25seSBzZXQgdG8gYGZhbHNlYCBpZiB5b3Uga25vdyBleGFjdGx5IHdoYXQgeW91IGFyZSBkb2luZy5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jaGVja2JveC50aWVfc2VsZWN0aW9uXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRpZV9zZWxlY3Rpb25cdFx0OiB0cnVlLFxuXG5cdFx0LyoqXG5cdFx0ICogVGhpcyBzZXR0aW5nIGNvbnRyb2xzIGlmIGNhc2NhZGluZyBkb3duIGFmZmVjdHMgZGlzYWJsZWQgY2hlY2tib3hlc1xuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94LmNhc2NhZGVfdG9fZGlzYWJsZWRcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0Y2FzY2FkZV90b19kaXNhYmxlZCA6IHRydWUsXG5cblx0XHQvKipcblx0XHQgKiBUaGlzIHNldHRpbmcgY29udHJvbHMgaWYgY2FzY2FkaW5nIGRvd24gYWZmZWN0cyBoaWRkZW4gY2hlY2tib3hlc1xuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94LmNhc2NhZGVfdG9faGlkZGVuXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdGNhc2NhZGVfdG9faGlkZGVuIDogdHJ1ZVxuXHR9O1xuXHQkLmpzdHJlZS5wbHVnaW5zLmNoZWNrYm94ID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuYmluZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHBhcmVudC5iaW5kLmNhbGwodGhpcyk7XG5cdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnV0byA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aHJlZV9zdGF0ZSkge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUgPSAndXArZG93bit1bmRldGVybWluZWQnO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5vbihcImluaXQuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC52aXNpYmxlID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC52aXNpYmxlO1xuXHRcdFx0XHRcdFx0aWYoIXRoaXMuc2V0dGluZ3MuY2hlY2tib3gua2VlcF9zZWxlY3RlZF9zdHlsZSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoJ2pzdHJlZS1jaGVja2JveC1uby1jbGlja2VkJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50LmFkZENsYXNzKCdqc3RyZWUtY2hlY2tib3gtc2VsZWN0aW9uJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImxvYWRpbmcuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dGhpc1sgdGhpcy5fZGF0YS5jaGVja2JveC52aXNpYmxlID8gJ3Nob3dfY2hlY2tib3hlcycgOiAnaGlkZV9jaGVja2JveGVzJyBdKCk7XG5cdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLmluZGV4T2YoJ3VuZGV0ZXJtaW5lZCcpICE9PSAtMSkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0XHQub24oJ2NoYW5nZWQuanN0cmVlIHVuY2hlY2tfbm9kZS5qc3RyZWUgY2hlY2tfbm9kZS5qc3RyZWUgdW5jaGVja19hbGwuanN0cmVlIGNoZWNrX2FsbC5qc3RyZWUgbW92ZV9ub2RlLmpzdHJlZSBjb3B5X25vZGUuanN0cmVlIHJlZHJhdy5qc3RyZWUgb3Blbl9ub2RlLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHQvLyBvbmx5IGlmIHVuZGV0ZXJtaW5lZCBpcyBpbiBzZXR0aW5nXG5cdFx0XHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuY2hlY2tib3gudXRvKSB7IGNsZWFyVGltZW91dCh0aGlzLl9kYXRhLmNoZWNrYm94LnV0byk7IH1cblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC51dG8gPSBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5fdW5kZXRlcm1pbmVkLCB0aGlzKSwgNTApO1xuXHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0XHQub24oJ21vZGVsLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdHZhciBtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0XHRcdFx0cCA9IG1bZGF0YS5wYXJlbnRdLFxuXHRcdFx0XHRcdFx0XHRkcGMgPSBkYXRhLm5vZGVzLFxuXHRcdFx0XHRcdFx0XHRpLCBqO1xuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZHBjLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRtW2RwY1tpXV0uc3RhdGUuY2hlY2tlZCA9IG1bZHBjW2ldXS5zdGF0ZS5jaGVja2VkIHx8IChtW2RwY1tpXV0ub3JpZ2luYWwgJiYgbVtkcGNbaV1dLm9yaWdpbmFsLnN0YXRlICYmIG1bZHBjW2ldXS5vcmlnaW5hbC5zdGF0ZS5jaGVja2VkKTtcblx0XHRcdFx0XHRcdFx0aWYobVtkcGNbaV1dLnN0YXRlLmNoZWNrZWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLnB1c2goZHBjW2ldKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZS5pbmRleE9mKCd1cCcpICE9PSAtMSB8fCB0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUuaW5kZXhPZignZG93bicpICE9PSAtMSkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0XHQub24oJ21vZGVsLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRcdFx0XHRcdHAgPSBtW2RhdGEucGFyZW50XSxcblx0XHRcdFx0XHRcdFx0XHRkcGMgPSBkYXRhLm5vZGVzLFxuXHRcdFx0XHRcdFx0XHRcdGNoZCA9IFtdLFxuXHRcdFx0XHRcdFx0XHRcdGMsIGksIGosIGssIGwsIHRtcCwgcyA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZSwgdCA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbjtcblxuXHRcdFx0XHRcdFx0XHRpZihzLmluZGV4T2YoJ2Rvd24nKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBhcHBseSBkb3duXG5cdFx0XHRcdFx0XHRcdFx0aWYocC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZHBjLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRtW2RwY1tpXV0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkID0gdGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZC5jb25jYXQoZHBjKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBkcGMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKG1bZHBjW2ldXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcihrID0gMCwgbCA9IG1bZHBjW2ldXS5jaGlsZHJlbl9kLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bVttW2RwY1tpXV0uY2hpbGRyZW5fZFtrXV0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkID0gdGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZC5jb25jYXQobVtkcGNbaV1dLmNoaWxkcmVuX2QpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYocy5pbmRleE9mKCd1cCcpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIGFwcGx5IHVwXG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoIW1bcC5jaGlsZHJlbl9kW2ldXS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hkLnB1c2gobVtwLmNoaWxkcmVuX2RbaV1dLnBhcmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGNoZCA9ICQudmFrYXRhLmFycmF5X3VuaXF1ZShjaGQpO1xuXHRcdFx0XHRcdFx0XHRcdGZvcihrID0gMCwgbCA9IGNoZC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdHAgPSBtW2NoZFtrXV07XG5cdFx0XHRcdFx0XHRcdFx0XHR3aGlsZShwICYmIHAuaWQgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YyA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IHAuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YyArPSBtW3AuY2hpbGRyZW5baV1dLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGMgPT09IGopIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLnB1c2gocC5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShwLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcyggdCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0cCA9IHRoaXMuZ2V0X25vZGUocC5wYXJlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQgPSAkLnZha2F0YS5hcnJheV91bmlxdWUodGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCk7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0XHQub24odGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uID8gJ3NlbGVjdF9ub2RlLmpzdHJlZScgOiAnY2hlY2tfbm9kZS5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdFx0XHRcdFx0XHRvYmogPSBkYXRhLm5vZGUsXG5cdFx0XHRcdFx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0cGFyID0gdGhpcy5nZXRfbm9kZShvYmoucGFyZW50KSxcblx0XHRcdFx0XHRcdFx0XHRpLCBqLCBjLCB0bXAsIHMgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUsIHQgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24sXG5cdFx0XHRcdFx0XHRcdFx0c2VsID0ge30sIGN1ciA9IHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQ7XG5cblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMCwgaiA9IGN1ci5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRzZWxbY3VyW2ldXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBhcHBseSBkb3duXG5cdFx0XHRcdFx0XHRcdGlmKHMuaW5kZXhPZignZG93bicpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdC8vdGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCA9ICQudmFrYXRhLmFycmF5X3VuaXF1ZSh0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLmNvbmNhdChvYmouY2hpbGRyZW5fZCkpO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBzZWxlY3RlZElkcyA9IHRoaXMuX2Nhc2NhZGVfbmV3X2NoZWNrZWRfc3RhdGUob2JqLmlkLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgdGVtcCA9IG9iai5jaGlsZHJlbl9kLmNvbmNhdChvYmouaWQpO1xuXHRcdFx0XHRcdFx0XHRcdGZvciAoaSA9IDAsIGogPSB0ZW1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHNlbGVjdGVkSWRzLmluZGV4T2YodGVtcFtpXSkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxbdGVtcFtpXV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBzZWxbdGVtcFtpXV07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8gYXBwbHkgdXBcblx0XHRcdFx0XHRcdFx0aWYocy5pbmRleE9mKCd1cCcpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlKHBhciAmJiBwYXIuaWQgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGMgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcGFyLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjICs9IG1bcGFyLmNoaWxkcmVuW2ldXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGlmKGMgPT09IGopIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cGFyLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsW3Bhci5pZF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL3RoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQucHVzaChwYXIuaWQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKHBhciwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcyh0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRwYXIgPSB0aGlzLmdldF9ub2RlKHBhci5wYXJlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGN1ciA9IFtdO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgaW4gc2VsKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNlbC5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y3VyLnB1c2goaSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQgPSBjdXI7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0XHQub24odGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uID8gJ2Rlc2VsZWN0X2FsbC5qc3RyZWUnIDogJ3VuY2hlY2tfYWxsLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIG9iaiA9IHRoaXMuZ2V0X25vZGUoJC5qc3RyZWUucm9vdCksXG5cdFx0XHRcdFx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0aSwgaiwgdG1wO1xuXHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHR0bXAgPSBtW29iai5jaGlsZHJlbl9kW2ldXTtcblx0XHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLm9yaWdpbmFsICYmIHRtcC5vcmlnaW5hbC5zdGF0ZSAmJiB0bXAub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0XHQub24odGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uID8gJ2Rlc2VsZWN0X25vZGUuanN0cmVlJyA6ICd1bmNoZWNrX25vZGUuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0b2JqID0gZGF0YS5ub2RlLFxuXHRcdFx0XHRcdFx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKSxcblx0XHRcdFx0XHRcdFx0XHRpLCBqLCB0bXAsIHMgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUsIHQgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24sXG5cdFx0XHRcdFx0XHRcdFx0Y3VyID0gdGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCwgc2VsID0ge30sXG5cdFx0XHRcdFx0XHRcdFx0c3RpbGxTZWxlY3RlZElkcyA9IFtdLFxuXHRcdFx0XHRcdFx0XHRcdGFsbElkcyA9IG9iai5jaGlsZHJlbl9kLmNvbmNhdChvYmouaWQpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIGFwcGx5IGRvd25cblx0XHRcdFx0XHRcdFx0aWYocy5pbmRleE9mKCdkb3duJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHNlbGVjdGVkSWRzID0gdGhpcy5fY2FzY2FkZV9uZXdfY2hlY2tlZF9zdGF0ZShvYmouaWQsIGZhbHNlKTtcblxuXHRcdFx0XHRcdFx0XHRcdGN1ciA9ICQudmFrYXRhLmFycmF5X2ZpbHRlcihjdXIsIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYWxsSWRzLmluZGV4T2YoaWQpID09PSAtMSB8fCBzZWxlY3RlZElkcy5pbmRleE9mKGlkKSA+IC0xO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8gb25seSBhcHBseSB1cCBpZiBjYXNjYWRlIHVwIGlzIGVuYWJsZWQgYW5kIGlmIHRoaXMgbm9kZSBpcyBub3Qgc2VsZWN0ZWRcblx0XHRcdFx0XHRcdFx0Ly8gKGlmIGFsbCBjaGlsZCBub2RlcyBhcmUgZGlzYWJsZWQgYW5kIGNhc2NhZGVfdG9fZGlzYWJsZWQgPT09IGZhbHNlIHRoZW4gdGhpcyBub2RlIHdpbGwgdGlsbCBiZSBzZWxlY3RlZCkuXG5cdFx0XHRcdFx0XHRcdGlmKHMuaW5kZXhPZigndXAnKSAhPT0gLTEgJiYgY3VyLmluZGV4T2Yob2JqLmlkKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmoucGFyZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuX21vZGVsLmRhdGFbb2JqLnBhcmVudHNbaV1dO1xuXHRcdFx0XHRcdFx0XHRcdFx0dG1wLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLm9yaWdpbmFsICYmIHRtcC5vcmlnaW5hbC5zdGF0ZSAmJiB0bXAub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUob2JqLnBhcmVudHNbaV0sIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykucmVtb3ZlQ2xhc3ModCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRjdXIgPSAkLnZha2F0YS5hcnJheV9maWx0ZXIoY3VyLCBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9iai5wYXJlbnRzLmluZGV4T2YoaWQpID09PSAtMTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQgPSBjdXI7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUuaW5kZXhPZigndXAnKSAhPT0gLTEpIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdFx0Lm9uKCdkZWxldGVfbm9kZS5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGFwcGx5IHVwICh3aG9sZSBoYW5kbGVyKVxuXHRcdFx0XHRcdFx0XHR2YXIgcCA9IHRoaXMuZ2V0X25vZGUoZGF0YS5wYXJlbnQpLFxuXHRcdFx0XHRcdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRcdFx0XHRcdGksIGosIGMsIHRtcCwgdCA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbjtcblx0XHRcdFx0XHRcdFx0d2hpbGUocCAmJiBwLmlkICE9PSAkLmpzdHJlZS5yb290ICYmICFwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0YyA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGMgKz0gbVtwLmNoaWxkcmVuW2ldXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYoaiA+IDAgJiYgYyA9PT0gaikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLnB1c2gocC5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKHAsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5hZGRDbGFzcyh0ID8gJ2pzdHJlZS1jbGlja2VkJyA6ICdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRwID0gdGhpcy5nZXRfbm9kZShwLnBhcmVudCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHRcdC5vbignbW92ZV9ub2RlLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0Ly8gYXBwbHkgdXAgKHdob2xlIGhhbmRsZXIpXG5cdFx0XHRcdFx0XHRcdHZhciBpc19tdWx0aSA9IGRhdGEuaXNfbXVsdGksXG5cdFx0XHRcdFx0XHRcdFx0b2xkX3BhciA9IGRhdGEub2xkX3BhcmVudCxcblx0XHRcdFx0XHRcdFx0XHRuZXdfcGFyID0gdGhpcy5nZXRfbm9kZShkYXRhLnBhcmVudCksXG5cdFx0XHRcdFx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0cCwgYywgaSwgaiwgdG1wLCB0ID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uO1xuXHRcdFx0XHRcdFx0XHRpZighaXNfbXVsdGkpIHtcblx0XHRcdFx0XHRcdFx0XHRwID0gdGhpcy5nZXRfbm9kZShvbGRfcGFyKTtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZShwICYmIHAuaWQgIT09ICQuanN0cmVlLnJvb3QgJiYgIXAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdGMgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YyArPSBtW3AuY2hpbGRyZW5baV1dLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYoaiA+IDAgJiYgYyA9PT0gaikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZC5wdXNoKHAuaWQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKHAsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSkuY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3ModCA/ICdqc3RyZWUtY2xpY2tlZCcgOiAnanN0cmVlLWNoZWNrZWQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0cCA9IHRoaXMuZ2V0X25vZGUocC5wYXJlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwID0gbmV3X3Bhcjtcblx0XHRcdFx0XHRcdFx0d2hpbGUocCAmJiBwLmlkICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHRcdFx0YyA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGMgKz0gbVtwLmNoaWxkcmVuW2ldXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYoYyA9PT0gaikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYoIXAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cC5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQucHVzaChwLmlkKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShwLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodG1wICYmIHRtcC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAuYXR0cignYXJpYS1zZWxlY3RlZCcsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihwLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHAuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YVsgdCA/ICdjb3JlJyA6ICdjaGVja2JveCcgXS5zZWxlY3RlZCA9ICQudmFrYXRhLmFycmF5X3JlbW92ZV9pdGVtKHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQsIHAuaWQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSB0aGlzLmdldF9ub2RlKHAsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZih0bXAgJiYgdG1wLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRtcC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLnJlbW92ZUNsYXNzKHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cCA9IHRoaXMuZ2V0X25vZGUocC5wYXJlbnQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBnZXQgYW4gYXJyYXkgb2YgYWxsIG5vZGVzIHdob3NlIHN0YXRlIGlzIFwidW5kZXRlcm1pbmVkXCJcblx0XHQgKiBAbmFtZSBnZXRfdW5kZXRlcm1pbmVkKFtmdWxsXSlcblx0XHQgKiBAcGFyYW0gIHtib29sZWFufSBmdWxsOiBpZiBzZXQgdG8gYHRydWVgIHRoZSByZXR1cm5lZCBhcnJheSB3aWxsIGNvbnNpc3Qgb2YgdGhlIGZ1bGwgbm9kZSBvYmplY3RzLCBvdGhlcndpc2UgLSBvbmx5IElEcyB3aWxsIGJlIHJldHVybmVkXG5cdFx0ICogQHJldHVybiB7QXJyYXl9XG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuZ2V0X3VuZGV0ZXJtaW5lZCA9IGZ1bmN0aW9uIChmdWxsKSB7XG5cdFx0XHRpZiAodGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLmluZGV4T2YoJ3VuZGV0ZXJtaW5lZCcpID09PSAtMSkge1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cdFx0XHR2YXIgaSwgaiwgaywgbCwgbyA9IHt9LCBtID0gdGhpcy5fbW9kZWwuZGF0YSwgdCA9IHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbiwgcyA9IHRoaXMuX2RhdGFbIHQgPyAnY29yZScgOiAnY2hlY2tib3gnIF0uc2VsZWN0ZWQsIHAgPSBbXSwgdHQgPSB0aGlzLCByID0gW107XG5cdFx0XHRmb3IoaSA9IDAsIGogPSBzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZihtW3NbaV1dICYmIG1bc1tpXV0ucGFyZW50cykge1xuXHRcdFx0XHRcdGZvcihrID0gMCwgbCA9IG1bc1tpXV0ucGFyZW50cy5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRcdGlmKG9bbVtzW2ldXS5wYXJlbnRzW2tdXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYobVtzW2ldXS5wYXJlbnRzW2tdICE9PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdFx0XHRcdG9bbVtzW2ldXS5wYXJlbnRzW2tdXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdHAucHVzaChtW3NbaV1dLnBhcmVudHNba10pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gYXR0ZW1wdCBmb3Igc2VydmVyIHNpZGUgdW5kZXRlcm1pbmVkIHN0YXRlXG5cdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS1jbG9zZWQnKS5ub3QoJzpoYXMoLmpzdHJlZS1jaGlsZHJlbiknKVxuXHRcdFx0XHQuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHRtcCA9IHR0LmdldF9ub2RlKHRoaXMpLCB0bXAyO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKCF0bXApIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYoIXRtcC5zdGF0ZS5sb2FkZWQpIHtcblx0XHRcdFx0XHRcdGlmKHRtcC5vcmlnaW5hbCAmJiB0bXAub3JpZ2luYWwuc3RhdGUgJiYgdG1wLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCAmJiB0bXAub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdGlmKG9bdG1wLmlkXSA9PT0gdW5kZWZpbmVkICYmIHRtcC5pZCAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0XHRcdG9bdG1wLmlkXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0cC5wdXNoKHRtcC5pZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gdG1wLnBhcmVudHMubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYob1t0bXAucGFyZW50c1trXV0gPT09IHVuZGVmaW5lZCAmJiB0bXAucGFyZW50c1trXSAhPT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0b1t0bXAucGFyZW50c1trXV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0cC5wdXNoKHRtcC5wYXJlbnRzW2tdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSB0bXAuY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0dG1wMiA9IG1bdG1wLmNoaWxkcmVuX2RbaV1dO1xuXHRcdFx0XHRcdFx0XHRpZighdG1wMi5zdGF0ZS5sb2FkZWQgJiYgdG1wMi5vcmlnaW5hbCAmJiB0bXAyLm9yaWdpbmFsLnN0YXRlICYmIHRtcDIub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkICYmIHRtcDIub3JpZ2luYWwuc3RhdGUudW5kZXRlcm1pbmVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYob1t0bXAyLmlkXSA9PT0gdW5kZWZpbmVkICYmIHRtcDIuaWQgIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG9bdG1wMi5pZF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0cC5wdXNoKHRtcDIuaWQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRmb3IoayA9IDAsIGwgPSB0bXAyLnBhcmVudHMubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihvW3RtcDIucGFyZW50c1trXV0gPT09IHVuZGVmaW5lZCAmJiB0bXAyLnBhcmVudHNba10gIT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0b1t0bXAyLnBhcmVudHNba11dID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cC5wdXNoKHRtcDIucGFyZW50c1trXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdGZvciAoaSA9IDAsIGogPSBwLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZighbVtwW2ldXS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSkge1xuXHRcdFx0XHRcdHIucHVzaChmdWxsID8gbVtwW2ldXSA6IHBbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcjtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHNldCB0aGUgdW5kZXRlcm1pbmVkIHN0YXRlIHdoZXJlIGFuZCBpZiBuZWNlc3NhcnkuIFVzZWQgaW50ZXJuYWxseS5cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBuYW1lIF91bmRldGVybWluZWQoKVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLl91bmRldGVybWluZWQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZih0aGlzLmVsZW1lbnQgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cdFx0XHR2YXIgcCA9IHRoaXMuZ2V0X3VuZGV0ZXJtaW5lZChmYWxzZSksIGksIGosIHM7XG5cblx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLXVuZGV0ZXJtaW5lZCcpLnJlbW92ZUNsYXNzKCdqc3RyZWUtdW5kZXRlcm1pbmVkJyk7XG5cdFx0XHRmb3IgKGkgPSAwLCBqID0gcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0cyA9IHRoaXMuZ2V0X25vZGUocFtpXSwgdHJ1ZSk7XG5cdFx0XHRcdGlmKHMgJiYgcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRzLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmNoaWxkcmVuKCcuanN0cmVlLWNoZWNrYm94JykuYWRkQ2xhc3MoJ2pzdHJlZS11bmRldGVybWluZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0dGhpcy5yZWRyYXdfbm9kZSA9IGZ1bmN0aW9uKG9iaiwgZGVlcCwgaXNfY2FsbGJhY2ssIGZvcmNlX3JlbmRlcikge1xuXHRcdFx0b2JqID0gcGFyZW50LnJlZHJhd19ub2RlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRpZihvYmopIHtcblx0XHRcdFx0dmFyIGksIGosIHRtcCA9IG51bGwsIGljb24gPSBudWxsO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZihvYmouY2hpbGROb2Rlc1tpXSAmJiBvYmouY2hpbGROb2Rlc1tpXS5jbGFzc05hbWUgJiYgb2JqLmNoaWxkTm9kZXNbaV0uY2xhc3NOYW1lLmluZGV4T2YoXCJqc3RyZWUtYW5jaG9yXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0dG1wID0gb2JqLmNoaWxkTm9kZXNbaV07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYodG1wKSB7XG5cdFx0XHRcdFx0aWYoIXRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbiAmJiB0aGlzLl9tb2RlbC5kYXRhW29iai5pZF0uc3RhdGUuY2hlY2tlZCkgeyB0bXAuY2xhc3NOYW1lICs9ICcganN0cmVlLWNoZWNrZWQnOyB9XG5cdFx0XHRcdFx0aWNvbiA9IF9pLmNsb25lTm9kZShmYWxzZSk7XG5cdFx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVtvYmouaWRdLnN0YXRlLmNoZWNrYm94X2Rpc2FibGVkKSB7IGljb24uY2xhc3NOYW1lICs9ICcganN0cmVlLWNoZWNrYm94LWRpc2FibGVkJzsgfVxuXHRcdFx0XHRcdHRtcC5pbnNlcnRCZWZvcmUoaWNvbiwgdG1wLmNoaWxkTm9kZXNbMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZighaXNfY2FsbGJhY2sgJiYgdGhpcy5zZXR0aW5ncy5jaGVja2JveC5jYXNjYWRlLmluZGV4T2YoJ3VuZGV0ZXJtaW5lZCcpICE9PSAtMSkge1xuXHRcdFx0XHRpZih0aGlzLl9kYXRhLmNoZWNrYm94LnV0bykgeyBjbGVhclRpbWVvdXQodGhpcy5fZGF0YS5jaGVja2JveC51dG8pOyB9XG5cdFx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3gudXRvID0gc2V0VGltZW91dCgkLnByb3h5KHRoaXMuX3VuZGV0ZXJtaW5lZCwgdGhpcyksIDUwKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBzaG93IHRoZSBub2RlIGNoZWNrYm94IGljb25zXG5cdFx0ICogQG5hbWUgc2hvd19jaGVja2JveGVzKClcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5zaG93X2NoZWNrYm94ZXMgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX2RhdGEuY29yZS50aGVtZXMuY2hlY2tib3hlcyA9IHRydWU7IHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLnJlbW92ZUNsYXNzKFwianN0cmVlLW5vLWNoZWNrYm94ZXNcIik7IH07XG5cdFx0LyoqXG5cdFx0ICogaGlkZSB0aGUgbm9kZSBjaGVja2JveCBpY29uc1xuXHRcdCAqIEBuYW1lIGhpZGVfY2hlY2tib3hlcygpXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuaGlkZV9jaGVja2JveGVzID0gZnVuY3Rpb24gKCkgeyB0aGlzLl9kYXRhLmNvcmUudGhlbWVzLmNoZWNrYm94ZXMgPSBmYWxzZTsgdGhpcy5nZXRfY29udGFpbmVyX3VsKCkuYWRkQ2xhc3MoXCJqc3RyZWUtbm8tY2hlY2tib3hlc1wiKTsgfTtcblx0XHQvKipcblx0XHQgKiB0b2dnbGUgdGhlIG5vZGUgaWNvbnNcblx0XHQgKiBAbmFtZSB0b2dnbGVfY2hlY2tib3hlcygpXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMudG9nZ2xlX2NoZWNrYm94ZXMgPSBmdW5jdGlvbiAoKSB7IGlmKHRoaXMuX2RhdGEuY29yZS50aGVtZXMuY2hlY2tib3hlcykgeyB0aGlzLmhpZGVfY2hlY2tib3hlcygpOyB9IGVsc2UgeyB0aGlzLnNob3dfY2hlY2tib3hlcygpOyB9IH07XG5cdFx0LyoqXG5cdFx0ICogY2hlY2tzIGlmIGEgbm9kZSBpcyBpbiBhbiB1bmRldGVybWluZWQgc3RhdGVcblx0XHQgKiBAbmFtZSBpc191bmRldGVybWluZWQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSBvYmpcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdHRoaXMuaXNfdW5kZXRlcm1pbmVkID0gZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0dmFyIHMgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LmNhc2NhZGUsIGksIGosIHQgPSB0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24sIGQgPSB0aGlzLl9kYXRhWyB0ID8gJ2NvcmUnIDogJ2NoZWNrYm94JyBdLnNlbGVjdGVkLCBtID0gdGhpcy5fbW9kZWwuZGF0YTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLnN0YXRlWyB0ID8gJ3NlbGVjdGVkJyA6ICdjaGVja2VkJyBdID09PSB0cnVlIHx8IHMuaW5kZXhPZigndW5kZXRlcm1pbmVkJykgPT09IC0xIHx8IChzLmluZGV4T2YoJ2Rvd24nKSA9PT0gLTEgJiYgcy5pbmRleE9mKCd1cCcpID09PSAtMSkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYoIW9iai5zdGF0ZS5sb2FkZWQgJiYgb2JqLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZHJlbl9kLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZigkLmluQXJyYXkob2JqLmNoaWxkcmVuX2RbaV0sIGQpICE9PSAtMSB8fCAoIW1bb2JqLmNoaWxkcmVuX2RbaV1dLnN0YXRlLmxvYWRlZCAmJiBtW29iai5jaGlsZHJlbl9kW2ldXS5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIGRpc2FibGUgYSBub2RlJ3MgY2hlY2tib3hcblx0XHQgKiBAbmFtZSBkaXNhYmxlX2NoZWNrYm94KG9iailcblx0XHQgKiBAcGFyYW0ge21peGVkfSBvYmogYW4gYXJyYXkgY2FuIGJlIHVzZWQgdG9vXG5cdFx0ICogQHRyaWdnZXIgZGlzYWJsZV9jaGVja2JveC5qc3RyZWVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5kaXNhYmxlX2NoZWNrYm94ID0gZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0dmFyIHQxLCB0MiwgZG9tO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZV9jaGVja2JveChvYmpbdDFdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKCFvYmouc3RhdGUuY2hlY2tib3hfZGlzYWJsZWQpIHtcblx0XHRcdFx0b2JqLnN0YXRlLmNoZWNrYm94X2Rpc2FibGVkID0gdHJ1ZTtcblx0XHRcdFx0aWYoZG9tICYmIGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRkb20uY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuY2hpbGRyZW4oJy5qc3RyZWUtY2hlY2tib3gnKS5hZGRDbGFzcygnanN0cmVlLWNoZWNrYm94LWRpc2FibGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUncyBjaGVja2JveCBpcyBkaXNhYmxlZFxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgZGlzYWJsZV9jaGVja2JveC5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdkaXNhYmxlX2NoZWNrYm94JywgeyAnbm9kZScgOiBvYmogfSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBlbmFibGUgYSBub2RlJ3MgY2hlY2tib3hcblx0XHQgKiBAbmFtZSBlbmFibGVfY2hlY2tib3gob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiBhbiBhcnJheSBjYW4gYmUgdXNlZCB0b29cblx0XHQgKiBAdHJpZ2dlciBlbmFibGVfY2hlY2tib3guanN0cmVlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuZW5hYmxlX2NoZWNrYm94ID0gZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0dmFyIHQxLCB0MiwgZG9tO1xuXHRcdFx0aWYoJC5pc0FycmF5KG9iaikpIHtcblx0XHRcdFx0b2JqID0gb2JqLnNsaWNlKCk7XG5cdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gb2JqLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdHRoaXMuZW5hYmxlX2NoZWNrYm94KG9ialt0MV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYoIW9iaiB8fCBvYmouaWQgPT09ICQuanN0cmVlLnJvb3QpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZG9tID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpO1xuXHRcdFx0aWYob2JqLnN0YXRlLmNoZWNrYm94X2Rpc2FibGVkKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5jaGVja2JveF9kaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihkb20gJiYgZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdGRvbS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKS5jaGlsZHJlbignLmpzdHJlZS1jaGVja2JveCcpLnJlbW92ZUNsYXNzKCdqc3RyZWUtY2hlY2tib3gtZGlzYWJsZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gYW4gbm9kZSdzIGNoZWNrYm94IGlzIGVuYWJsZWRcblx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdCAqIEBuYW1lIGVuYWJsZV9jaGVja2JveC5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdlbmFibGVfY2hlY2tib3gnLCB7ICdub2RlJyA6IG9iaiB9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhpcy5hY3RpdmF0ZV9ub2RlID0gZnVuY3Rpb24gKG9iaiwgZSkge1xuXHRcdFx0aWYoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2pzdHJlZS1jaGVja2JveC1kaXNhYmxlZCcpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbiAmJiAodGhpcy5zZXR0aW5ncy5jaGVja2JveC53aG9sZV9ub2RlIHx8ICQoZS50YXJnZXQpLmhhc0NsYXNzKCdqc3RyZWUtY2hlY2tib3gnKSkpIHtcblx0XHRcdFx0ZS5jdHJsS2V5ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbiB8fCAoIXRoaXMuc2V0dGluZ3MuY2hlY2tib3gud2hvbGVfbm9kZSAmJiAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2pzdHJlZS1jaGVja2JveCcpKSkge1xuXHRcdFx0XHRyZXR1cm4gcGFyZW50LmFjdGl2YXRlX25vZGUuY2FsbCh0aGlzLCBvYmosIGUpO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5pc19kaXNhYmxlZChvYmopKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKHRoaXMuaXNfY2hlY2tlZChvYmopKSB7XG5cdFx0XHRcdHRoaXMudW5jaGVja19ub2RlKG9iaiwgZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dGhpcy5jaGVja19ub2RlKG9iaiwgZSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2FjdGl2YXRlX25vZGUnLCB7ICdub2RlJyA6IHRoaXMuZ2V0X25vZGUob2JqKSB9KTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQ2FzY2FkZXMgY2hlY2tlZCBzdGF0ZSB0byBhIG5vZGUgYW5kIGFsbCBpdHMgZGVzY2VuZGFudHMuIFRoaXMgZnVuY3Rpb24gZG9lcyBOT1QgYWZmZWN0IGhpZGRlbiBhbmQgZGlzYWJsZWQgbm9kZXMgKG9yIHRoZWlyIGRlc2NlbmRhbnRzKS5cblx0XHQgKiBIb3dldmVyIGlmIHRoZXNlIHVuYWZmZWN0ZWQgbm9kZXMgYXJlIGFscmVhZHkgc2VsZWN0ZWQgdGhlaXIgaWRzIHdpbGwgYmUgaW5jbHVkZWQgaW4gdGhlIHJldHVybmVkIGFycmF5LlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGlkIHRoZSBub2RlIElEXG5cdFx0ICogQHBhcmFtIHtib29sfSBjaGVja2VkU3RhdGUgc2hvdWxkIHRoZSBub2RlcyBiZSBjaGVja2VkIG9yIG5vdFxuXHRcdCAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgYWxsIG5vZGUgaWQncyAoaW4gdGhpcyB0cmVlIGJyYW5jaCkgdGhhdCBhcmUgY2hlY2tlZC5cblx0XHQgKi9cblx0XHR0aGlzLl9jYXNjYWRlX25ld19jaGVja2VkX3N0YXRlID0gZnVuY3Rpb24gKGlkLCBjaGVja2VkU3RhdGUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciB0ID0gdGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uO1xuXHRcdFx0dmFyIG5vZGUgPSB0aGlzLl9tb2RlbC5kYXRhW2lkXTtcblx0XHRcdHZhciBzZWxlY3RlZE5vZGVJZHMgPSBbXTtcblx0XHRcdHZhciBzZWxlY3RlZENoaWxkcmVuSWRzID0gW10sIGksIGosIHNlbGVjdGVkQ2hpbGRJZHM7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0KHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZV90b19kaXNhYmxlZCB8fCAhbm9kZS5zdGF0ZS5kaXNhYmxlZCkgJiZcblx0XHRcdFx0KHRoaXMuc2V0dGluZ3MuY2hlY2tib3guY2FzY2FkZV90b19oaWRkZW4gfHwgIW5vZGUuc3RhdGUuaGlkZGVuKVxuXHRcdFx0KSB7XG5cdFx0XHRcdC8vRmlyc3QgdHJ5IGFuZCBjaGVjay91bmNoZWNrIHRoZSBjaGlsZHJlblxuXHRcdFx0XHRpZiAobm9kZS5jaGlsZHJlbikge1xuXHRcdFx0XHRcdGZvciAoaSA9IDAsIGogPSBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIGNoaWxkSWQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWRDaGlsZElkcyA9IHNlbGYuX2Nhc2NhZGVfbmV3X2NoZWNrZWRfc3RhdGUoY2hpbGRJZCwgY2hlY2tlZFN0YXRlKTtcblx0XHRcdFx0XHRcdHNlbGVjdGVkTm9kZUlkcyA9IHNlbGVjdGVkTm9kZUlkcy5jb25jYXQoc2VsZWN0ZWRDaGlsZElkcyk7XG5cdFx0XHRcdFx0XHRpZiAoc2VsZWN0ZWRDaGlsZElkcy5pbmRleE9mKGNoaWxkSWQpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0c2VsZWN0ZWRDaGlsZHJlbklkcy5wdXNoKGNoaWxkSWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBkb20gPSBzZWxmLmdldF9ub2RlKG5vZGUsIHRydWUpO1xuXG5cdFx0XHRcdC8vQSBub2RlJ3Mgc3RhdGUgaXMgdW5kZXRlcm1pbmVkIGlmIHNvbWUgYnV0IG5vdCBhbGwgb2YgaXQncyBjaGlsZHJlbiBhcmUgY2hlY2tlZC9zZWxlY3RlZCAuXG5cdFx0XHRcdHZhciB1bmRldGVybWluZWQgPSBzZWxlY3RlZENoaWxkcmVuSWRzLmxlbmd0aCA+IDAgJiYgc2VsZWN0ZWRDaGlsZHJlbklkcy5sZW5ndGggPCBub2RlLmNoaWxkcmVuLmxlbmd0aDtcblxuXHRcdFx0XHRpZihub2RlLm9yaWdpbmFsICYmIG5vZGUub3JpZ2luYWwuc3RhdGUgJiYgbm9kZS5vcmlnaW5hbC5zdGF0ZS51bmRldGVybWluZWQpIHtcblx0XHRcdFx0XHRub2RlLm9yaWdpbmFsLnN0YXRlLnVuZGV0ZXJtaW5lZCA9IHVuZGV0ZXJtaW5lZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vSWYgYSBub2RlIGlzIHVuZGV0ZXJtaW5lZCB0aGVuIHJlbW92ZSBzZWxlY3RlZCBjbGFzc1xuXHRcdFx0XHRpZiAodW5kZXRlcm1pbmVkKSB7XG5cdFx0XHRcdFx0bm9kZS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IGZhbHNlO1xuXHRcdFx0XHRcdGRvbS5hdHRyKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLnJlbW92ZUNsYXNzKHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9PdGhlcndpc2UsIGlmIHRoZSBjaGVja2VkU3RhdGUgPT09IHRydWUgKGkuZS4gdGhlIG5vZGUgaXMgYmVpbmcgY2hlY2tlZCBub3cpIGFuZCBhbGwgb2YgdGhlIG5vZGUncyBjaGlsZHJlbiBhcmUgY2hlY2tlZCAoaWYgaXQgaGFzIGFueSBjaGlsZHJlbiksXG5cdFx0XHRcdC8vY2hlY2sgdGhlIG5vZGUgYW5kIHN0eWxlIGl0IGNvcnJlY3RseS5cblx0XHRcdFx0ZWxzZSBpZiAoY2hlY2tlZFN0YXRlICYmIHNlbGVjdGVkQ2hpbGRyZW5JZHMubGVuZ3RoID09PSBub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRcdG5vZGUuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0gPSBjaGVja2VkU3RhdGU7XG5cdFx0XHRcdFx0c2VsZWN0ZWROb2RlSWRzLnB1c2gobm9kZS5pZCk7XG5cblx0XHRcdFx0XHRkb20uYXR0cignYXJpYS1zZWxlY3RlZCcsIHRydWUpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmFkZENsYXNzKHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0bm9kZS5zdGF0ZVsgdCA/ICdzZWxlY3RlZCcgOiAnY2hlY2tlZCcgXSA9IGZhbHNlO1xuXHRcdFx0XHRcdGRvbS5hdHRyKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLnJlbW92ZUNsYXNzKHQgPyAnanN0cmVlLWNsaWNrZWQnIDogJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZWxlY3RlZENoaWxkSWRzID0gdGhpcy5nZXRfY2hlY2tlZF9kZXNjZW5kYW50cyhpZCk7XG5cblx0XHRcdFx0aWYgKG5vZGUuc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF0pIHtcblx0XHRcdFx0XHRzZWxlY3RlZENoaWxkSWRzLnB1c2gobm9kZS5pZCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzZWxlY3RlZE5vZGVJZHMgPSBzZWxlY3RlZE5vZGVJZHMuY29uY2F0KHNlbGVjdGVkQ2hpbGRJZHMpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc2VsZWN0ZWROb2RlSWRzO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBHZXRzIGlkcyBvZiBub2RlcyBzZWxlY3RlZCBpbiBicmFuY2ggKG9mIHRyZWUpIHNwZWNpZmllZCBieSBpZCAoZG9lcyBub3QgaW5jbHVkZSB0aGUgbm9kZSBzcGVjaWZpZWQgYnkgaWQpXG5cdFx0ICogQG5hbWUgZ2V0X2NoZWNrZWRfZGVzY2VuZGFudHMob2JqKVxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBpZCB0aGUgbm9kZSBJRFxuXHRcdCAqIEByZXR1cm4ge0FycmF5fSBhcnJheSBvZiBJRHNcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5nZXRfY2hlY2tlZF9kZXNjZW5kYW50cyA9IGZ1bmN0aW9uIChpZCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIHQgPSBzZWxmLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb247XG5cdFx0XHR2YXIgbm9kZSA9IHNlbGYuX21vZGVsLmRhdGFbaWRdO1xuXG5cdFx0XHRyZXR1cm4gJC52YWthdGEuYXJyYXlfZmlsdGVyKG5vZGUuY2hpbGRyZW5fZCwgZnVuY3Rpb24oX2lkKSB7XG5cdFx0XHRcdHJldHVybiBzZWxmLl9tb2RlbC5kYXRhW19pZF0uc3RhdGVbIHQgPyAnc2VsZWN0ZWQnIDogJ2NoZWNrZWQnIF07XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogY2hlY2sgYSBub2RlIChvbmx5IGlmIHRpZV9zZWxlY3Rpb24gaW4gY2hlY2tib3ggc2V0dGluZ3MgaXMgZmFsc2UsIG90aGVyd2lzZSBzZWxlY3Rfbm9kZSB3aWxsIGJlIGNhbGxlZCBpbnRlcm5hbGx5KVxuXHRcdCAqIEBuYW1lIGNoZWNrX25vZGUob2JqKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiBhbiBhcnJheSBjYW4gYmUgdXNlZCB0byBjaGVjayBtdWx0aXBsZSBub2Rlc1xuXHRcdCAqIEB0cmlnZ2VyIGNoZWNrX25vZGUuanN0cmVlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMuY2hlY2tfbm9kZSA9IGZ1bmN0aW9uIChvYmosIGUpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikgeyByZXR1cm4gdGhpcy5zZWxlY3Rfbm9kZShvYmosIGZhbHNlLCB0cnVlLCBlKTsgfVxuXHRcdFx0dmFyIGRvbSwgdDEsIHQyLCB0aDtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLmNoZWNrX25vZGUob2JqW3QxXSwgZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqIHx8IG9iai5pZCA9PT0gJC5qc3RyZWUucm9vdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG9iaiwgdHJ1ZSk7XG5cdFx0XHRpZighb2JqLnN0YXRlLmNoZWNrZWQpIHtcblx0XHRcdFx0b2JqLnN0YXRlLmNoZWNrZWQgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLnB1c2gob2JqLmlkKTtcblx0XHRcdFx0aWYoZG9tICYmIGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRkb20uY2hpbGRyZW4oJy5qc3RyZWUtYW5jaG9yJykuYWRkQ2xhc3MoJ2pzdHJlZS1jaGVja2VkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIGFuIG5vZGUgaXMgY2hlY2tlZCAob25seSBpZiB0aWVfc2VsZWN0aW9uIGluIGNoZWNrYm94IHNldHRpbmdzIGlzIGZhbHNlKVxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgY2hlY2tfbm9kZS5qc3RyZWVcblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IG5vZGVcblx0XHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgZXZlbnQgKGlmIGFueSkgdGhhdCB0cmlnZ2VyZWQgdGhpcyBjaGVja19ub2RlXG5cdFx0XHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHRcdFx0ICovXG5cdFx0XHRcdHRoaXMudHJpZ2dlcignY2hlY2tfbm9kZScsIHsgJ25vZGUnIDogb2JqLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCwgJ2V2ZW50JyA6IGUgfSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiB1bmNoZWNrIGEgbm9kZSAob25seSBpZiB0aWVfc2VsZWN0aW9uIGluIGNoZWNrYm94IHNldHRpbmdzIGlzIGZhbHNlLCBvdGhlcndpc2UgZGVzZWxlY3Rfbm9kZSB3aWxsIGJlIGNhbGxlZCBpbnRlcm5hbGx5KVxuXHRcdCAqIEBuYW1lIHVuY2hlY2tfbm9kZShvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIGFuIGFycmF5IGNhbiBiZSB1c2VkIHRvIHVuY2hlY2sgbXVsdGlwbGUgbm9kZXNcblx0XHQgKiBAdHJpZ2dlciB1bmNoZWNrX25vZGUuanN0cmVlXG5cdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdCAqL1xuXHRcdHRoaXMudW5jaGVja19ub2RlID0gZnVuY3Rpb24gKG9iaiwgZSkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7IHJldHVybiB0aGlzLmRlc2VsZWN0X25vZGUob2JqLCBmYWxzZSwgZSk7IH1cblx0XHRcdHZhciB0MSwgdDIsIGRvbTtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLnVuY2hlY2tfbm9kZShvYmpbdDFdLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKG9iai5zdGF0ZS5jaGVja2VkKSB7XG5cdFx0XHRcdG9iai5zdGF0ZS5jaGVja2VkID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQgPSAkLnZha2F0YS5hcnJheV9yZW1vdmVfaXRlbSh0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLCBvYmouaWQpO1xuXHRcdFx0XHRpZihkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZG9tLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLnJlbW92ZUNsYXNzKCdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbiBub2RlIGlzIHVuY2hlY2tlZCAob25seSBpZiB0aWVfc2VsZWN0aW9uIGluIGNoZWNrYm94IHNldHRpbmdzIGlzIGZhbHNlKVxuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQG5hbWUgdW5jaGVja19ub2RlLmpzdHJlZVxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuXHRcdFx0XHQgKiBAcGFyYW0ge0FycmF5fSBzZWxlY3RlZCB0aGUgY3VycmVudCBzZWxlY3Rpb25cblx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBldmVudCAoaWYgYW55KSB0aGF0IHRyaWdnZXJlZCB0aGlzIHVuY2hlY2tfbm9kZVxuXHRcdFx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3VuY2hlY2tfbm9kZScsIHsgJ25vZGUnIDogb2JqLCAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCwgJ2V2ZW50JyA6IGUgfSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0XHQvKipcblx0XHQgKiBjaGVja3MgYWxsIG5vZGVzIGluIHRoZSB0cmVlIChvbmx5IGlmIHRpZV9zZWxlY3Rpb24gaW4gY2hlY2tib3ggc2V0dGluZ3MgaXMgZmFsc2UsIG90aGVyd2lzZSBzZWxlY3RfYWxsIHdpbGwgYmUgY2FsbGVkIGludGVybmFsbHkpXG5cdFx0ICogQG5hbWUgY2hlY2tfYWxsKClcblx0XHQgKiBAdHJpZ2dlciBjaGVja19hbGwuanN0cmVlLCBjaGFuZ2VkLmpzdHJlZVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmNoZWNrX2FsbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikgeyByZXR1cm4gdGhpcy5zZWxlY3RfYWxsKCk7IH1cblx0XHRcdHZhciB0bXAgPSB0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkLmNvbmNhdChbXSksIGksIGo7XG5cdFx0XHR0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkID0gdGhpcy5fbW9kZWwuZGF0YVskLmpzdHJlZS5yb290XS5jaGlsZHJlbl9kLmNvbmNhdCgpO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVt0aGlzLl9kYXRhLmNoZWNrYm94LnNlbGVjdGVkW2ldXSkge1xuXHRcdFx0XHRcdHRoaXMuX21vZGVsLmRhdGFbdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZFtpXV0uc3RhdGUuY2hlY2tlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMucmVkcmF3KHRydWUpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbGwgbm9kZXMgYXJlIGNoZWNrZWQgKG9ubHkgaWYgdGllX3NlbGVjdGlvbiBpbiBjaGVja2JveCBzZXR0aW5ncyBpcyBmYWxzZSlcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY2hlY2tfYWxsLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gc2VsZWN0ZWQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG5cdFx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignY2hlY2tfYWxsJywgeyAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCB9KTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHVuY2hlY2sgYWxsIGNoZWNrZWQgbm9kZXMgKG9ubHkgaWYgdGllX3NlbGVjdGlvbiBpbiBjaGVja2JveCBzZXR0aW5ncyBpcyBmYWxzZSwgb3RoZXJ3aXNlIGRlc2VsZWN0X2FsbCB3aWxsIGJlIGNhbGxlZCBpbnRlcm5hbGx5KVxuXHRcdCAqIEBuYW1lIHVuY2hlY2tfYWxsKClcblx0XHQgKiBAdHJpZ2dlciB1bmNoZWNrX2FsbC5qc3RyZWVcblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy51bmNoZWNrX2FsbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikgeyByZXR1cm4gdGhpcy5kZXNlbGVjdF9hbGwoKTsgfVxuXHRcdFx0dmFyIHRtcCA9IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQuY29uY2F0KFtdKSwgaSwgajtcblx0XHRcdGZvcihpID0gMCwgaiA9IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdGlmKHRoaXMuX21vZGVsLmRhdGFbdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZFtpXV0pIHtcblx0XHRcdFx0XHR0aGlzLl9tb2RlbC5kYXRhW3RoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWRbaV1dLnN0YXRlLmNoZWNrZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCA9IFtdO1xuXHRcdFx0dGhpcy5lbGVtZW50LmZpbmQoJy5qc3RyZWUtY2hlY2tlZCcpLnJlbW92ZUNsYXNzKCdqc3RyZWUtY2hlY2tlZCcpO1xuXHRcdFx0LyoqXG5cdFx0XHQgKiB0cmlnZ2VyZWQgd2hlbiBhbGwgbm9kZXMgYXJlIHVuY2hlY2tlZCAob25seSBpZiB0aWVfc2VsZWN0aW9uIGluIGNoZWNrYm94IHNldHRpbmdzIGlzIGZhbHNlKVxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSB1bmNoZWNrX2FsbC5qc3RyZWVcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBub2RlIHRoZSBwcmV2aW91cyBzZWxlY3Rpb25cblx0XHRcdCAqIEBwYXJhbSB7QXJyYXl9IHNlbGVjdGVkIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuXHRcdFx0ICogQHBsdWdpbiBjaGVja2JveFxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3VuY2hlY2tfYWxsJywgeyAnc2VsZWN0ZWQnIDogdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCwgJ25vZGUnIDogdG1wIH0pO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogY2hlY2tzIGlmIGEgbm9kZSBpcyBjaGVja2VkIChpZiB0aWVfc2VsZWN0aW9uIGlzIG9uIGluIHRoZSBzZXR0aW5ncyB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSBzYW1lIGFzIGlzX3NlbGVjdGVkKVxuXHRcdCAqIEBuYW1lIGlzX2NoZWNrZWQob2JqKVxuXHRcdCAqIEBwYXJhbSAge21peGVkfSAgb2JqXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5pc19jaGVja2VkID0gZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7IHJldHVybiB0aGlzLmlzX3NlbGVjdGVkKG9iaik7IH1cblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0cmV0dXJuIG9iai5zdGF0ZS5jaGVja2VkO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogZ2V0IGFuIGFycmF5IG9mIGFsbCBjaGVja2VkIG5vZGVzIChpZiB0aWVfc2VsZWN0aW9uIGlzIG9uIGluIHRoZSBzZXR0aW5ncyB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSBzYW1lIGFzIGdldF9zZWxlY3RlZClcblx0XHQgKiBAbmFtZSBnZXRfY2hlY2tlZChbZnVsbF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9ICBmdWxsIGlmIHNldCB0byBgdHJ1ZWAgdGhlIHJldHVybmVkIGFycmF5IHdpbGwgY29uc2lzdCBvZiB0aGUgZnVsbCBub2RlIG9iamVjdHMsIG90aGVyd2lzZSAtIG9ubHkgSURzIHdpbGwgYmUgcmV0dXJuZWRcblx0XHQgKiBAcmV0dXJuIHtBcnJheX1cblx0XHQgKiBAcGx1Z2luIGNoZWNrYm94XG5cdFx0ICovXG5cdFx0dGhpcy5nZXRfY2hlY2tlZCA9IGZ1bmN0aW9uIChmdWxsKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHsgcmV0dXJuIHRoaXMuZ2V0X3NlbGVjdGVkKGZ1bGwpOyB9XG5cdFx0XHRyZXR1cm4gZnVsbCA/ICQubWFwKHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQsICQucHJveHkoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIHRoaXMuZ2V0X25vZGUoaSk7IH0sIHRoaXMpKSA6IHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQuc2xpY2UoKTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIGdldCBhbiBhcnJheSBvZiBhbGwgdG9wIGxldmVsIGNoZWNrZWQgbm9kZXMgKGlnbm9yaW5nIGNoaWxkcmVuIG9mIGNoZWNrZWQgbm9kZXMpIChpZiB0aWVfc2VsZWN0aW9uIGlzIG9uIGluIHRoZSBzZXR0aW5ncyB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSBzYW1lIGFzIGdldF90b3Bfc2VsZWN0ZWQpXG5cdFx0ICogQG5hbWUgZ2V0X3RvcF9jaGVja2VkKFtmdWxsXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gIGZ1bGwgaWYgc2V0IHRvIGB0cnVlYCB0aGUgcmV0dXJuZWQgYXJyYXkgd2lsbCBjb25zaXN0IG9mIHRoZSBmdWxsIG5vZGUgb2JqZWN0cywgb3RoZXJ3aXNlIC0gb25seSBJRHMgd2lsbCBiZSByZXR1cm5lZFxuXHRcdCAqIEByZXR1cm4ge0FycmF5fVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmdldF90b3BfY2hlY2tlZCA9IGZ1bmN0aW9uIChmdWxsKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHsgcmV0dXJuIHRoaXMuZ2V0X3RvcF9zZWxlY3RlZChmdWxsKTsgfVxuXHRcdFx0dmFyIHRtcCA9IHRoaXMuZ2V0X2NoZWNrZWQodHJ1ZSksXG5cdFx0XHRcdG9iaiA9IHt9LCBpLCBqLCBrLCBsO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRvYmpbdG1wW2ldLmlkXSA9IHRtcFtpXTtcblx0XHRcdH1cblx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0Zm9yKGsgPSAwLCBsID0gdG1wW2ldLmNoaWxkcmVuX2QubGVuZ3RoOyBrIDwgbDsgaysrKSB7XG5cdFx0XHRcdFx0aWYob2JqW3RtcFtpXS5jaGlsZHJlbl9kW2tdXSkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIG9ialt0bXBbaV0uY2hpbGRyZW5fZFtrXV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0bXAgPSBbXTtcblx0XHRcdGZvcihpIGluIG9iaikge1xuXHRcdFx0XHRpZihvYmouaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHR0bXAucHVzaChpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZ1bGwgPyAkLm1hcCh0bXAsICQucHJveHkoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIHRoaXMuZ2V0X25vZGUoaSk7IH0sIHRoaXMpKSA6IHRtcDtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIGdldCBhbiBhcnJheSBvZiBhbGwgYm90dG9tIGxldmVsIGNoZWNrZWQgbm9kZXMgKGlnbm9yaW5nIHNlbGVjdGVkIHBhcmVudHMpIChpZiB0aWVfc2VsZWN0aW9uIGlzIG9uIGluIHRoZSBzZXR0aW5ncyB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSBzYW1lIGFzIGdldF9ib3R0b21fc2VsZWN0ZWQpXG5cdFx0ICogQG5hbWUgZ2V0X2JvdHRvbV9jaGVja2VkKFtmdWxsXSlcblx0XHQgKiBAcGFyYW0gIHttaXhlZH0gIGZ1bGwgaWYgc2V0IHRvIGB0cnVlYCB0aGUgcmV0dXJuZWQgYXJyYXkgd2lsbCBjb25zaXN0IG9mIHRoZSBmdWxsIG5vZGUgb2JqZWN0cywgb3RoZXJ3aXNlIC0gb25seSBJRHMgd2lsbCBiZSByZXR1cm5lZFxuXHRcdCAqIEByZXR1cm4ge0FycmF5fVxuXHRcdCAqIEBwbHVnaW4gY2hlY2tib3hcblx0XHQgKi9cblx0XHR0aGlzLmdldF9ib3R0b21fY2hlY2tlZCA9IGZ1bmN0aW9uIChmdWxsKSB7XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHsgcmV0dXJuIHRoaXMuZ2V0X2JvdHRvbV9zZWxlY3RlZChmdWxsKTsgfVxuXHRcdFx0dmFyIHRtcCA9IHRoaXMuZ2V0X2NoZWNrZWQodHJ1ZSksXG5cdFx0XHRcdG9iaiA9IFtdLCBpLCBqO1xuXHRcdFx0Zm9yKGkgPSAwLCBqID0gdG1wLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRpZighdG1wW2ldLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRcdG9iai5wdXNoKHRtcFtpXS5pZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmdWxsID8gJC5tYXAob2JqLCAkLnByb3h5KGZ1bmN0aW9uIChpKSB7IHJldHVybiB0aGlzLmdldF9ub2RlKGkpOyB9LCB0aGlzKSkgOiBvYmo7XG5cdFx0fTtcblx0XHR0aGlzLmxvYWRfbm9kZSA9IGZ1bmN0aW9uIChvYmosIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgaywgbCwgaSwgaiwgYywgdG1wO1xuXHRcdFx0aWYoISQuaXNBcnJheShvYmopICYmICF0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHtcblx0XHRcdFx0dG1wID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0XHRpZih0bXAgJiYgdG1wLnN0YXRlLmxvYWRlZCkge1xuXHRcdFx0XHRcdGZvcihrID0gMCwgbCA9IHRtcC5jaGlsZHJlbl9kLmxlbmd0aDsgayA8IGw7IGsrKykge1xuXHRcdFx0XHRcdFx0aWYodGhpcy5fbW9kZWwuZGF0YVt0bXAuY2hpbGRyZW5fZFtrXV0uc3RhdGUuY2hlY2tlZCkge1xuXHRcdFx0XHRcdFx0XHRjID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZCA9ICQudmFrYXRhLmFycmF5X3JlbW92ZV9pdGVtKHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQsIHRtcC5jaGlsZHJlbl9kW2tdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBwYXJlbnQubG9hZF9ub2RlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fTtcblx0XHR0aGlzLmdldF9zdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBzdGF0ZSA9IHBhcmVudC5nZXRfc3RhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY2hlY2tib3gudGllX3NlbGVjdGlvbikgeyByZXR1cm4gc3RhdGU7IH1cblx0XHRcdHN0YXRlLmNoZWNrYm94ID0gdGhpcy5fZGF0YS5jaGVja2JveC5zZWxlY3RlZC5zbGljZSgpO1xuXHRcdFx0cmV0dXJuIHN0YXRlO1xuXHRcdH07XG5cdFx0dGhpcy5zZXRfc3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUsIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgcmVzID0gcGFyZW50LnNldF9zdGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0aWYocmVzICYmIHN0YXRlLmNoZWNrYm94KSB7XG5cdFx0XHRcdGlmKCF0aGlzLnNldHRpbmdzLmNoZWNrYm94LnRpZV9zZWxlY3Rpb24pIHtcblx0XHRcdFx0XHR0aGlzLnVuY2hlY2tfYWxsKCk7XG5cdFx0XHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdFx0XHQkLmVhY2goc3RhdGUuY2hlY2tib3gsIGZ1bmN0aW9uIChpLCB2KSB7XG5cdFx0XHRcdFx0XHRfdGhpcy5jaGVja19ub2RlKHYpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRlbGV0ZSBzdGF0ZS5jaGVja2JveDtcblx0XHRcdFx0dGhpcy5zZXRfc3RhdGUoc3RhdGUsIGNhbGxiYWNrKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlcztcblx0XHR9O1xuXHRcdHRoaXMucmVmcmVzaCA9IGZ1bmN0aW9uIChza2lwX2xvYWRpbmcsIGZvcmdldF9zdGF0ZSkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5jaGVja2JveC50aWVfc2VsZWN0aW9uKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuY2hlY2tib3guc2VsZWN0ZWQgPSBbXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwYXJlbnQucmVmcmVzaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH07XG5cdH07XG5cblx0Ly8gaW5jbHVkZSB0aGUgY2hlY2tib3ggcGx1Z2luIGJ5IGRlZmF1bHRcblx0Ly8gJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2lucy5wdXNoKFwiY2hlY2tib3hcIik7XG5cblxuLyoqXG4gKiAjIyMgQ29uZGl0aW9uYWxzZWxlY3QgcGx1Z2luXG4gKlxuICogVGhpcyBwbHVnaW4gYWxsb3dzIGRlZmluaW5nIGEgY2FsbGJhY2sgdG8gYWxsb3cgb3IgZGVueSBub2RlIHNlbGVjdGlvbiBieSB1c2VyIGlucHV0IChhY3RpdmF0ZSBub2RlIG1ldGhvZCkuXG4gKi9cblxuXHQvKipcblx0ICogYSBjYWxsYmFjayAoZnVuY3Rpb24pIHdoaWNoIGlzIGludm9rZWQgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUgYW5kIHJlY2VpdmVzIHR3byBhcmd1bWVudHMgLSB0aGUgbm9kZSBhbmQgdGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZSBgYWN0aXZhdGVfbm9kZWAgY2FsbC4gUmV0dXJuaW5nIGZhbHNlIHByZXZlbnRzIHdvcmtpbmcgd2l0aCB0aGUgbm9kZSwgcmV0dXJuaW5nIHRydWUgYWxsb3dzIGludm9raW5nIGFjdGl2YXRlX25vZGUuIERlZmF1bHRzIHRvIHJldHVybmluZyBgdHJ1ZWAuXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmNoZWNrYm94LnZpc2libGVcblx0ICogQHBsdWdpbiBjaGVja2JveFxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMuY29uZGl0aW9uYWxzZWxlY3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9O1xuXHQkLmpzdHJlZS5wbHVnaW5zLmNvbmRpdGlvbmFsc2VsZWN0ID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdC8vIG93biBmdW5jdGlvblxuXHRcdHRoaXMuYWN0aXZhdGVfbm9kZSA9IGZ1bmN0aW9uIChvYmosIGUpIHtcblx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY29uZGl0aW9uYWxzZWxlY3QuY2FsbCh0aGlzLCB0aGlzLmdldF9ub2RlKG9iaiksIGUpKSB7XG5cdFx0XHRcdHJldHVybiBwYXJlbnQuYWN0aXZhdGVfbm9kZS5jYWxsKHRoaXMsIG9iaiwgZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fTtcblxuXG4vKipcbiAqICMjIyBDb250ZXh0bWVudSBwbHVnaW5cbiAqXG4gKiBTaG93cyBhIGNvbnRleHQgbWVudSB3aGVuIGEgbm9kZSBpcyByaWdodC1jbGlja2VkLlxuICovXG5cblx0LyoqXG5cdCAqIHN0b3JlcyBhbGwgZGVmYXVsdHMgZm9yIHRoZSBjb250ZXh0bWVudSBwbHVnaW5cblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29udGV4dG1lbnVcblx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMuY29udGV4dG1lbnUgPSB7XG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIG5vZGUgc2hvdWxkIGJlIHNlbGVjdGVkIHdoZW4gdGhlIGNvbnRleHQgbWVudSBpcyBpbnZva2VkIG9uIGl0LiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuY29udGV4dG1lbnUuc2VsZWN0X25vZGVcblx0XHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdFx0ICovXG5cdFx0c2VsZWN0X25vZGUgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBtZW51IHNob3VsZCBiZSBzaG93biBhbGlnbmVkIHdpdGggdGhlIG5vZGUuIERlZmF1bHRzIHRvIGB0cnVlYCwgb3RoZXJ3aXNlIHRoZSBtb3VzZSBjb29yZGluYXRlcyBhcmUgdXNlZC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb250ZXh0bWVudS5zaG93X2F0X25vZGVcblx0XHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdFx0ICovXG5cdFx0c2hvd19hdF9ub2RlIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBhbiBvYmplY3Qgb2YgYWN0aW9ucywgb3IgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYSBub2RlIGFuZCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGFuZCBjYWxscyB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gd2l0aCBhbiBvYmplY3Qgb2YgYWN0aW9ucyBhdmFpbGFibGUgZm9yIHRoYXQgbm9kZSAoeW91IGNhbiBhbHNvIHJldHVybiB0aGUgaXRlbXMgdG9vKS5cblx0XHQgKlxuXHRcdCAqIEVhY2ggYWN0aW9uIGNvbnNpc3RzIG9mIGEga2V5IChhIHVuaXF1ZSBuYW1lKSBhbmQgYSB2YWx1ZSB3aGljaCBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXMgKG9ubHkgbGFiZWwgYW5kIGFjdGlvbiBhcmUgcmVxdWlyZWQpLiBPbmNlIGEgbWVudSBpdGVtIGlzIGFjdGl2YXRlZCB0aGUgYGFjdGlvbmAgZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIHdpdGggYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBrZXlzOiBpdGVtIC0gdGhlIGNvbnRleHRtZW51IGl0ZW0gZGVmaW5pdGlvbiBhcyBzZWVuIGJlbG93LCByZWZlcmVuY2UgLSB0aGUgRE9NIG5vZGUgdGhhdCB3YXMgdXNlZCAodGhlIHRyZWUgbm9kZSksIGVsZW1lbnQgLSB0aGUgY29udGV4dG1lbnUgRE9NIGVsZW1lbnQsIHBvc2l0aW9uIC0gYW4gb2JqZWN0IHdpdGggeC95IHByb3BlcnRpZXMgaW5kaWNhdGluZyB0aGUgcG9zaXRpb24gb2YgdGhlIG1lbnUuXG5cdFx0ICpcblx0XHQgKiAqIGBzZXBhcmF0b3JfYmVmb3JlYCAtIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZXJlIHNob3VsZCBiZSBhIHNlcGFyYXRvciBiZWZvcmUgdGhpcyBpdGVtXG5cdFx0ICogKiBgc2VwYXJhdG9yX2FmdGVyYCAtIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZXJlIHNob3VsZCBiZSBhIHNlcGFyYXRvciBhZnRlciB0aGlzIGl0ZW1cblx0XHQgKiAqIGBfZGlzYWJsZWRgIC0gYSBib29sZWFuIGluZGljYXRpbmcgaWYgdGhpcyBhY3Rpb24gc2hvdWxkIGJlIGRpc2FibGVkXG5cdFx0ICogKiBgbGFiZWxgIC0gYSBzdHJpbmcgLSB0aGUgbmFtZSBvZiB0aGUgYWN0aW9uIChjb3VsZCBiZSBhIGZ1bmN0aW9uIHJldHVybmluZyBhIHN0cmluZylcblx0XHQgKiAqIGB0aXRsZWAgLSBhIHN0cmluZyAtIGFuIG9wdGlvbmFsIHRvb2x0aXAgZm9yIHRoZSBpdGVtXG5cdFx0ICogKiBgYWN0aW9uYCAtIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgaWYgdGhpcyBpdGVtIGlzIGNob3NlbiwgdGhlIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBcblx0XHQgKiAqIGBpY29uYCAtIGEgc3RyaW5nLCBjYW4gYmUgYSBwYXRoIHRvIGFuIGljb24gb3IgYSBjbGFzc05hbWUsIGlmIHVzaW5nIGFuIGltYWdlIHRoYXQgaXMgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5IHVzZSBhIGAuL2AgcHJlZml4LCBvdGhlcndpc2UgaXQgd2lsbCBiZSBkZXRlY3RlZCBhcyBhIGNsYXNzXG5cdFx0ICogKiBgc2hvcnRjdXRgIC0ga2V5Q29kZSB3aGljaCB3aWxsIHRyaWdnZXIgdGhlIGFjdGlvbiBpZiB0aGUgbWVudSBpcyBvcGVuIChmb3IgZXhhbXBsZSBgMTEzYCBmb3IgcmVuYW1lLCB3aGljaCBlcXVhbHMgRjIpXG5cdFx0ICogKiBgc2hvcnRjdXRfbGFiZWxgIC0gc2hvcnRjdXQgbGFiZWwgKGxpa2UgZm9yIGV4YW1wbGUgYEYyYCBmb3IgcmVuYW1lKVxuXHRcdCAqICogYHN1Ym1lbnVgIC0gYW4gb2JqZWN0IHdpdGggdGhlIHNhbWUgc3RydWN0dXJlIGFzICQuanN0cmVlLmRlZmF1bHRzLmNvbnRleHRtZW51Lml0ZW1zIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBhIHN1Ym1lbnUgLSBlYWNoIGtleSB3aWxsIGJlIHJlbmRlcmVkIGFzIGEgc2VwYXJhdGUgb3B0aW9uIGluIGEgc3VibWVudSB0aGF0IHdpbGwgYXBwZWFyIG9uY2UgdGhlIGN1cnJlbnQgaXRlbSBpcyBob3ZlcmVkXG5cdFx0ICpcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5jb250ZXh0bWVudS5pdGVtc1xuXHRcdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0XHQgKi9cblx0XHRpdGVtcyA6IGZ1bmN0aW9uIChvLCBjYikgeyAvLyBDb3VsZCBiZSBhbiBvYmplY3QgZGlyZWN0bHlcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFwiY3JlYXRlXCIgOiB7XG5cdFx0XHRcdFx0XCJzZXBhcmF0b3JfYmVmb3JlXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XCJzZXBhcmF0b3JfYWZ0ZXJcIlx0OiB0cnVlLFxuXHRcdFx0XHRcdFwiX2Rpc2FibGVkXCJcdFx0XHQ6IGZhbHNlLCAvLyh0aGlzLmNoZWNrKFwiY3JlYXRlX25vZGVcIiwgZGF0YS5yZWZlcmVuY2UsIHt9LCBcImxhc3RcIikpLFxuXHRcdFx0XHRcdFwibGFiZWxcIlx0XHRcdFx0OiBcIkNyZWF0ZVwiLFxuXHRcdFx0XHRcdFwiYWN0aW9uXCJcdFx0XHQ6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHR2YXIgaW5zdCA9ICQuanN0cmVlLnJlZmVyZW5jZShkYXRhLnJlZmVyZW5jZSksXG5cdFx0XHRcdFx0XHRcdG9iaiA9IGluc3QuZ2V0X25vZGUoZGF0YS5yZWZlcmVuY2UpO1xuXHRcdFx0XHRcdFx0aW5zdC5jcmVhdGVfbm9kZShvYmosIHt9LCBcImxhc3RcIiwgZnVuY3Rpb24gKG5ld19ub2RlKSB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0aW5zdC5lZGl0KG5ld19ub2RlKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHtcblx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgaW5zdC5lZGl0KG5ld19ub2RlKTsgfSwwKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcInJlbmFtZVwiIDoge1xuXHRcdFx0XHRcdFwic2VwYXJhdG9yX2JlZm9yZVwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFwic2VwYXJhdG9yX2FmdGVyXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XCJfZGlzYWJsZWRcIlx0XHRcdDogZmFsc2UsIC8vKHRoaXMuY2hlY2soXCJyZW5hbWVfbm9kZVwiLCBkYXRhLnJlZmVyZW5jZSwgdGhpcy5nZXRfcGFyZW50KGRhdGEucmVmZXJlbmNlKSwgXCJcIikpLFxuXHRcdFx0XHRcdFwibGFiZWxcIlx0XHRcdFx0OiBcIlJlbmFtZVwiLFxuXHRcdFx0XHRcdC8qIVxuXHRcdFx0XHRcdFwic2hvcnRjdXRcIlx0XHRcdDogMTEzLFxuXHRcdFx0XHRcdFwic2hvcnRjdXRfbGFiZWxcIlx0OiAnRjInLFxuXHRcdFx0XHRcdFwiaWNvblwiXHRcdFx0XHQ6IFwiZ2x5cGhpY29uIGdseXBoaWNvbi1sZWFmXCIsXG5cdFx0XHRcdFx0Ki9cblx0XHRcdFx0XHRcImFjdGlvblwiXHRcdFx0OiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dmFyIGluc3QgPSAkLmpzdHJlZS5yZWZlcmVuY2UoZGF0YS5yZWZlcmVuY2UpLFxuXHRcdFx0XHRcdFx0XHRvYmogPSBpbnN0LmdldF9ub2RlKGRhdGEucmVmZXJlbmNlKTtcblx0XHRcdFx0XHRcdGluc3QuZWRpdChvYmopO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0XCJyZW1vdmVcIiA6IHtcblx0XHRcdFx0XHRcInNlcGFyYXRvcl9iZWZvcmVcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcImljb25cIlx0XHRcdFx0OiBmYWxzZSxcblx0XHRcdFx0XHRcInNlcGFyYXRvcl9hZnRlclwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFwiX2Rpc2FibGVkXCJcdFx0XHQ6IGZhbHNlLCAvLyh0aGlzLmNoZWNrKFwiZGVsZXRlX25vZGVcIiwgZGF0YS5yZWZlcmVuY2UsIHRoaXMuZ2V0X3BhcmVudChkYXRhLnJlZmVyZW5jZSksIFwiXCIpKSxcblx0XHRcdFx0XHRcImxhYmVsXCJcdFx0XHRcdDogXCJEZWxldGVcIixcblx0XHRcdFx0XHRcImFjdGlvblwiXHRcdFx0OiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0dmFyIGluc3QgPSAkLmpzdHJlZS5yZWZlcmVuY2UoZGF0YS5yZWZlcmVuY2UpLFxuXHRcdFx0XHRcdFx0XHRvYmogPSBpbnN0LmdldF9ub2RlKGRhdGEucmVmZXJlbmNlKTtcblx0XHRcdFx0XHRcdGlmKGluc3QuaXNfc2VsZWN0ZWQob2JqKSkge1xuXHRcdFx0XHRcdFx0XHRpbnN0LmRlbGV0ZV9ub2RlKGluc3QuZ2V0X3NlbGVjdGVkKCkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGluc3QuZGVsZXRlX25vZGUob2JqKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwiY2NwXCIgOiB7XG5cdFx0XHRcdFx0XCJzZXBhcmF0b3JfYmVmb3JlXCJcdDogdHJ1ZSxcblx0XHRcdFx0XHRcImljb25cIlx0XHRcdFx0OiBmYWxzZSxcblx0XHRcdFx0XHRcInNlcGFyYXRvcl9hZnRlclwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFwibGFiZWxcIlx0XHRcdFx0OiBcIkVkaXRcIixcblx0XHRcdFx0XHRcImFjdGlvblwiXHRcdFx0OiBmYWxzZSxcblx0XHRcdFx0XHRcInN1Ym1lbnVcIiA6IHtcblx0XHRcdFx0XHRcdFwiY3V0XCIgOiB7XG5cdFx0XHRcdFx0XHRcdFwic2VwYXJhdG9yX2JlZm9yZVwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcInNlcGFyYXRvcl9hZnRlclwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcImxhYmVsXCJcdFx0XHRcdDogXCJDdXRcIixcblx0XHRcdFx0XHRcdFx0XCJhY3Rpb25cIlx0XHRcdDogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5zdCA9ICQuanN0cmVlLnJlZmVyZW5jZShkYXRhLnJlZmVyZW5jZSksXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmogPSBpbnN0LmdldF9ub2RlKGRhdGEucmVmZXJlbmNlKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbnN0LmlzX3NlbGVjdGVkKG9iaikpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGluc3QuY3V0KGluc3QuZ2V0X3RvcF9zZWxlY3RlZCgpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpbnN0LmN1dChvYmopO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFwiY29weVwiIDoge1xuXHRcdFx0XHRcdFx0XHRcInNlcGFyYXRvcl9iZWZvcmVcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XCJpY29uXCJcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFwic2VwYXJhdG9yX2FmdGVyXCJcdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFwibGFiZWxcIlx0XHRcdFx0OiBcIkNvcHlcIixcblx0XHRcdFx0XHRcdFx0XCJhY3Rpb25cIlx0XHRcdDogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5zdCA9ICQuanN0cmVlLnJlZmVyZW5jZShkYXRhLnJlZmVyZW5jZSksXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmogPSBpbnN0LmdldF9ub2RlKGRhdGEucmVmZXJlbmNlKTtcblx0XHRcdFx0XHRcdFx0XHRpZihpbnN0LmlzX3NlbGVjdGVkKG9iaikpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGluc3QuY29weShpbnN0LmdldF90b3Bfc2VsZWN0ZWQoKSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0aW5zdC5jb3B5KG9iaik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJwYXN0ZVwiIDoge1xuXHRcdFx0XHRcdFx0XHRcInNlcGFyYXRvcl9iZWZvcmVcIlx0OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XCJpY29uXCJcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFwiX2Rpc2FibGVkXCJcdFx0XHQ6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuICEkLmpzdHJlZS5yZWZlcmVuY2UoZGF0YS5yZWZlcmVuY2UpLmNhbl9wYXN0ZSgpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcInNlcGFyYXRvcl9hZnRlclwiXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcImxhYmVsXCJcdFx0XHRcdDogXCJQYXN0ZVwiLFxuXHRcdFx0XHRcdFx0XHRcImFjdGlvblwiXHRcdFx0OiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbnN0ID0gJC5qc3RyZWUucmVmZXJlbmNlKGRhdGEucmVmZXJlbmNlKSxcblx0XHRcdFx0XHRcdFx0XHRcdG9iaiA9IGluc3QuZ2V0X25vZGUoZGF0YS5yZWZlcmVuY2UpO1xuXHRcdFx0XHRcdFx0XHRcdGluc3QucGFzdGUob2JqKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG5cblx0JC5qc3RyZWUucGx1Z2lucy5jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYXJlbnQuYmluZC5jYWxsKHRoaXMpO1xuXG5cdFx0XHR2YXIgbGFzdF90cyA9IDAsIGN0byA9IG51bGwsIGV4LCBleTtcblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQub24oXCJpbml0LmpzdHJlZSBsb2FkaW5nLmpzdHJlZSByZWFkeS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmdldF9jb250YWluZXJfdWwoKS5hZGRDbGFzcygnanN0cmVlLWNvbnRleHRtZW51Jyk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImNvbnRleHRtZW51LmpzdHJlZVwiLCBcIi5qc3RyZWUtYW5jaG9yXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdGlmIChlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbnB1dCcpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0bGFzdF90cyA9IGUuY3RybEtleSA/ICtuZXcgRGF0ZSgpIDogMDtcblx0XHRcdFx0XHRcdGlmKGRhdGEgfHwgY3RvKSB7XG5cdFx0XHRcdFx0XHRcdGxhc3RfdHMgPSAoK25ldyBEYXRlKCkpICsgMTAwMDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihjdG8pIHtcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KGN0byk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZighdGhpcy5pc19sb2FkaW5nKGUuY3VycmVudFRhcmdldCkpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5zaG93X2NvbnRleHRtZW51KGUuY3VycmVudFRhcmdldCwgZS5wYWdlWCwgZS5wYWdlWSwgZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImNsaWNrLmpzdHJlZVwiLCBcIi5qc3RyZWUtYW5jaG9yXCIsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuY29udGV4dG1lbnUudmlzaWJsZSAmJiAoIWxhc3RfdHMgfHwgKCtuZXcgRGF0ZSgpKSAtIGxhc3RfdHMgPiAyNTApKSB7IC8vIHdvcmsgYXJvdW5kIHNhZmFyaSAmIG1hY09TIGN0cmwrY2xpY2tcblx0XHRcdFx0XHRcdFx0JC52YWthdGEuY29udGV4dC5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRsYXN0X3RzID0gMDtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwidG91Y2hzdGFydC5qc3RyZWVcIiwgXCIuanN0cmVlLWFuY2hvclwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYoIWUub3JpZ2luYWxFdmVudCB8fCAhZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzIHx8ICFlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZXggPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcblx0XHRcdFx0XHRcdGV5ID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XG5cdFx0XHRcdFx0XHRjdG8gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLnRyaWdnZXIoJ2NvbnRleHRtZW51JywgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9LCA3NTApO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdC5vbigndG91Y2htb3ZlLnZha2F0YS5qc3RyZWUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYoY3RvICYmIGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMgJiYgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdICYmIChNYXRoLmFicyhleCAtIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYKSA+IDEwIHx8IE1hdGguYWJzKGV5IC0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpID4gMTApKSB7XG5cdFx0XHRcdFx0XHRcdGNsZWFyVGltZW91dChjdG8pO1xuXHRcdFx0XHRcdFx0XHQkLnZha2F0YS5jb250ZXh0LmhpZGUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ3RvdWNoZW5kLnZha2F0YS5qc3RyZWUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYoY3RvKSB7XG5cdFx0XHRcdFx0XHRcdGNsZWFyVGltZW91dChjdG8pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHQvKiFcblx0XHRcdGlmKCEoJ29uY29udGV4dG1lbnUnIGluIGRvY3VtZW50LmJvZHkpICYmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5ib2R5KSkge1xuXHRcdFx0XHR2YXIgZWwgPSBudWxsLCB0bSA9IG51bGw7XG5cdFx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHRcdC5vbihcInRvdWNoc3RhcnRcIiwgXCIuanN0cmVlLWFuY2hvclwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZWwgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdFx0XHRcdFx0XHR0bSA9ICtuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdFx0JChkb2N1bWVudCkub25lKFwidG91Y2hlbmRcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZS50YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUub3JpZ2luYWxFdmVudC50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93LnBhZ2VYT2Zmc2V0LCBlLm9yaWdpbmFsRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvdy5wYWdlWU9mZnNldCk7XG5cdFx0XHRcdFx0XHRcdGUuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHR0bSA9ICgoKyhuZXcgRGF0ZSgpKSkgLSB0bSk7XG5cdFx0XHRcdFx0XHRcdGlmKGUudGFyZ2V0ID09PSBlbCAmJiB0bSA+IDYwMCAmJiB0bSA8IDEwMDApIHtcblx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0JChlbCkudHJpZ2dlcignY29udGV4dG1lbnUnLCBlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbCA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHRtID0gbnVsbDtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Ki9cblx0XHRcdCQoZG9jdW1lbnQpLm9uKFwiY29udGV4dF9oaWRlLnZha2F0YS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHR0aGlzLl9kYXRhLmNvbnRleHRtZW51LnZpc2libGUgPSBmYWxzZTtcblx0XHRcdFx0JChkYXRhLnJlZmVyZW5jZSkucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1jb250ZXh0Jyk7XG5cdFx0XHR9LCB0aGlzKSk7XG5cdFx0fTtcblx0XHR0aGlzLnRlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYodGhpcy5fZGF0YS5jb250ZXh0bWVudS52aXNpYmxlKSB7XG5cdFx0XHRcdCQudmFrYXRhLmNvbnRleHQuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0cGFyZW50LnRlYXJkb3duLmNhbGwodGhpcyk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIHByZXBhcmUgYW5kIHNob3cgdGhlIGNvbnRleHQgbWVudSBmb3IgYSBub2RlXG5cdFx0ICogQG5hbWUgc2hvd19jb250ZXh0bWVudShvYmogWywgeCwgeV0pXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHggdGhlIHgtY29vcmRpbmF0ZSByZWxhdGl2ZSB0byB0aGUgZG9jdW1lbnQgdG8gc2hvdyB0aGUgbWVudSBhdFxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSB5IHRoZSB5LWNvb3JkaW5hdGUgcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50IHRvIHNob3cgdGhlIG1lbnUgYXRcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gZSB0aGUgZXZlbnQgaWYgYXZhaWxhYmxlIHRoYXQgdHJpZ2dlcmVkIHRoZSBjb250ZXh0bWVudVxuXHRcdCAqIEBwbHVnaW4gY29udGV4dG1lbnVcblx0XHQgKiBAdHJpZ2dlciBzaG93X2NvbnRleHRtZW51LmpzdHJlZVxuXHRcdCAqL1xuXHRcdHRoaXMuc2hvd19jb250ZXh0bWVudSA9IGZ1bmN0aW9uIChvYmosIHgsIHksIGUpIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdGlmKCFvYmogfHwgb2JqLmlkID09PSAkLmpzdHJlZS5yb290KSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIHMgPSB0aGlzLnNldHRpbmdzLmNvbnRleHRtZW51LFxuXHRcdFx0XHRkID0gdGhpcy5nZXRfbm9kZShvYmosIHRydWUpLFxuXHRcdFx0XHRhID0gZC5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLFxuXHRcdFx0XHRvID0gZmFsc2UsXG5cdFx0XHRcdGkgPSBmYWxzZTtcblx0XHRcdGlmKHMuc2hvd19hdF9ub2RlIHx8IHggPT09IHVuZGVmaW5lZCB8fCB5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0byA9IGEub2Zmc2V0KCk7XG5cdFx0XHRcdHggPSBvLmxlZnQ7XG5cdFx0XHRcdHkgPSBvLnRvcCArIHRoaXMuX2RhdGEuY29yZS5saV9oZWlnaHQ7XG5cdFx0XHR9XG5cdFx0XHRpZih0aGlzLnNldHRpbmdzLmNvbnRleHRtZW51LnNlbGVjdF9ub2RlICYmICF0aGlzLmlzX3NlbGVjdGVkKG9iaikpIHtcblx0XHRcdFx0dGhpcy5hY3RpdmF0ZV9ub2RlKG9iaiwgZSk7XG5cdFx0XHR9XG5cblx0XHRcdGkgPSBzLml0ZW1zO1xuXHRcdFx0aWYoJC5pc0Z1bmN0aW9uKGkpKSB7XG5cdFx0XHRcdGkgPSBpLmNhbGwodGhpcywgb2JqLCAkLnByb3h5KGZ1bmN0aW9uIChpKSB7XG5cdFx0XHRcdFx0dGhpcy5fc2hvd19jb250ZXh0bWVudShvYmosIHgsIHksIGkpO1xuXHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHR9XG5cdFx0XHRpZigkLmlzUGxhaW5PYmplY3QoaSkpIHtcblx0XHRcdFx0dGhpcy5fc2hvd19jb250ZXh0bWVudShvYmosIHgsIHksIGkpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogc2hvdyB0aGUgcHJlcGFyZWQgY29udGV4dCBtZW51IGZvciBhIG5vZGVcblx0XHQgKiBAbmFtZSBfc2hvd19jb250ZXh0bWVudShvYmosIHgsIHksIGkpXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHggdGhlIHgtY29vcmRpbmF0ZSByZWxhdGl2ZSB0byB0aGUgZG9jdW1lbnQgdG8gc2hvdyB0aGUgbWVudSBhdFxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSB5IHRoZSB5LWNvb3JkaW5hdGUgcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50IHRvIHNob3cgdGhlIG1lbnUgYXRcblx0XHQgKiBAcGFyYW0ge051bWJlcn0gaSB0aGUgb2JqZWN0IG9mIGl0ZW1zIHRvIHNob3dcblx0XHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdFx0ICogQHRyaWdnZXIgc2hvd19jb250ZXh0bWVudS5qc3RyZWVcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdHRoaXMuX3Nob3dfY29udGV4dG1lbnUgPSBmdW5jdGlvbiAob2JqLCB4LCB5LCBpKSB7XG5cdFx0XHR2YXIgZCA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKSxcblx0XHRcdFx0YSA9IGQuY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKTtcblx0XHRcdCQoZG9jdW1lbnQpLm9uZShcImNvbnRleHRfc2hvdy52YWthdGEuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0dmFyIGNscyA9ICdqc3RyZWUtY29udGV4dG1lbnUganN0cmVlLScgKyB0aGlzLmdldF90aGVtZSgpICsgJy1jb250ZXh0bWVudSc7XG5cdFx0XHRcdCQoZGF0YS5lbGVtZW50KS5hZGRDbGFzcyhjbHMpO1xuXHRcdFx0XHRhLmFkZENsYXNzKCdqc3RyZWUtY29udGV4dCcpO1xuXHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0dGhpcy5fZGF0YS5jb250ZXh0bWVudS52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdCQudmFrYXRhLmNvbnRleHQuc2hvdyhhLCB7ICd4JyA6IHgsICd5JyA6IHkgfSwgaSk7XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCB3aGVuIHRoZSBjb250ZXh0bWVudSBpcyBzaG93biBmb3IgYSBub2RlXG5cdFx0XHQgKiBAZXZlbnRcblx0XHRcdCAqIEBuYW1lIHNob3dfY29udGV4dG1lbnUuanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gbm9kZSB0aGUgbm9kZVxuXHRcdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHggdGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgbWVudSByZWxhdGl2ZSB0byB0aGUgZG9jdW1lbnRcblx0XHRcdCAqIEBwYXJhbSB7TnVtYmVyfSB5IHRoZSB5LWNvb3JkaW5hdGUgb2YgdGhlIG1lbnUgcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50XG5cdFx0XHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdFx0XHQgKi9cblx0XHRcdHRoaXMudHJpZ2dlcignc2hvd19jb250ZXh0bWVudScsIHsgXCJub2RlXCIgOiBvYmosIFwieFwiIDogeCwgXCJ5XCIgOiB5IH0pO1xuXHRcdH07XG5cdH07XG5cblx0Ly8gY29udGV4dG1lbnUgaGVscGVyXG5cdChmdW5jdGlvbiAoJCkge1xuXHRcdHZhciByaWdodF90b19sZWZ0ID0gZmFsc2UsXG5cdFx0XHR2YWthdGFfY29udGV4dCA9IHtcblx0XHRcdFx0ZWxlbWVudFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRyZWZlcmVuY2VcdDogZmFsc2UsXG5cdFx0XHRcdHBvc2l0aW9uX3hcdDogMCxcblx0XHRcdFx0cG9zaXRpb25feVx0OiAwLFxuXHRcdFx0XHRpdGVtc1x0XHQ6IFtdLFxuXHRcdFx0XHRodG1sXHRcdDogXCJcIixcblx0XHRcdFx0aXNfdmlzaWJsZVx0OiBmYWxzZVxuXHRcdFx0fTtcblxuXHRcdCQudmFrYXRhLmNvbnRleHQgPSB7XG5cdFx0XHRzZXR0aW5ncyA6IHtcblx0XHRcdFx0aGlkZV9vbm1vdXNlbGVhdmVcdDogMCxcblx0XHRcdFx0aWNvbnNcdFx0XHRcdDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdF90cmlnZ2VyIDogZnVuY3Rpb24gKGV2ZW50X25hbWUpIHtcblx0XHRcdFx0JChkb2N1bWVudCkudHJpZ2dlckhhbmRsZXIoXCJjb250ZXh0X1wiICsgZXZlbnRfbmFtZSArIFwiLnZha2F0YVwiLCB7XG5cdFx0XHRcdFx0XCJyZWZlcmVuY2VcIlx0OiB2YWthdGFfY29udGV4dC5yZWZlcmVuY2UsXG5cdFx0XHRcdFx0XCJlbGVtZW50XCJcdDogdmFrYXRhX2NvbnRleHQuZWxlbWVudCxcblx0XHRcdFx0XHRcInBvc2l0aW9uXCJcdDoge1xuXHRcdFx0XHRcdFx0XCJ4XCIgOiB2YWthdGFfY29udGV4dC5wb3NpdGlvbl94LFxuXHRcdFx0XHRcdFx0XCJ5XCIgOiB2YWthdGFfY29udGV4dC5wb3NpdGlvbl95XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHRfZXhlY3V0ZSA6IGZ1bmN0aW9uIChpKSB7XG5cdFx0XHRcdGkgPSB2YWthdGFfY29udGV4dC5pdGVtc1tpXTtcblx0XHRcdFx0cmV0dXJuIGkgJiYgKCFpLl9kaXNhYmxlZCB8fCAoJC5pc0Z1bmN0aW9uKGkuX2Rpc2FibGVkKSAmJiAhaS5fZGlzYWJsZWQoeyBcIml0ZW1cIiA6IGksIFwicmVmZXJlbmNlXCIgOiB2YWthdGFfY29udGV4dC5yZWZlcmVuY2UsIFwiZWxlbWVudFwiIDogdmFrYXRhX2NvbnRleHQuZWxlbWVudCB9KSkpICYmIGkuYWN0aW9uID8gaS5hY3Rpb24uY2FsbChudWxsLCB7XG5cdFx0XHRcdFx0XHRcdFwiaXRlbVwiXHRcdDogaSxcblx0XHRcdFx0XHRcdFx0XCJyZWZlcmVuY2VcIlx0OiB2YWthdGFfY29udGV4dC5yZWZlcmVuY2UsXG5cdFx0XHRcdFx0XHRcdFwiZWxlbWVudFwiXHQ6IHZha2F0YV9jb250ZXh0LmVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdFwicG9zaXRpb25cIlx0OiB7XG5cdFx0XHRcdFx0XHRcdFx0XCJ4XCIgOiB2YWthdGFfY29udGV4dC5wb3NpdGlvbl94LFxuXHRcdFx0XHRcdFx0XHRcdFwieVwiIDogdmFrYXRhX2NvbnRleHQucG9zaXRpb25feVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KSA6IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdF9wYXJzZSA6IGZ1bmN0aW9uIChvLCBpc19jYWxsYmFjaykge1xuXHRcdFx0XHRpZighbykgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdFx0aWYoIWlzX2NhbGxiYWNrKSB7XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuaHRtbFx0XHQ9IFwiXCI7XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuaXRlbXNcdD0gW107XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHN0ciA9IFwiXCIsXG5cdFx0XHRcdFx0c2VwID0gZmFsc2UsXG5cdFx0XHRcdFx0dG1wO1xuXG5cdFx0XHRcdGlmKGlzX2NhbGxiYWNrKSB7IHN0ciArPSBcIjxcIitcInVsPlwiOyB9XG5cdFx0XHRcdCQuZWFjaChvLCBmdW5jdGlvbiAoaSwgdmFsKSB7XG5cdFx0XHRcdFx0aWYoIXZhbCkgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0Lml0ZW1zLnB1c2godmFsKTtcblx0XHRcdFx0XHRpZighc2VwICYmIHZhbC5zZXBhcmF0b3JfYmVmb3JlKSB7XG5cdFx0XHRcdFx0XHRzdHIgKz0gXCI8XCIrXCJsaSBjbGFzcz0ndmFrYXRhLWNvbnRleHQtc2VwYXJhdG9yJz48XCIrXCJhIGhyZWY9JyMnIFwiICsgKCQudmFrYXRhLmNvbnRleHQuc2V0dGluZ3MuaWNvbnMgPyAnJyA6ICdzdHlsZT1cIm1hcmdpbi1sZWZ0OjBweDtcIicpICsgXCI+JiMxNjA7PFwiK1wiL2E+PFwiK1wiL2xpPlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzZXAgPSBmYWxzZTtcblx0XHRcdFx0XHRzdHIgKz0gXCI8XCIrXCJsaSBjbGFzcz0nXCIgKyAodmFsLl9jbGFzcyB8fCBcIlwiKSArICh2YWwuX2Rpc2FibGVkID09PSB0cnVlIHx8ICgkLmlzRnVuY3Rpb24odmFsLl9kaXNhYmxlZCkgJiYgdmFsLl9kaXNhYmxlZCh7IFwiaXRlbVwiIDogdmFsLCBcInJlZmVyZW5jZVwiIDogdmFrYXRhX2NvbnRleHQucmVmZXJlbmNlLCBcImVsZW1lbnRcIiA6IHZha2F0YV9jb250ZXh0LmVsZW1lbnQgfSkpID8gXCIgdmFrYXRhLWNvbnRleHRtZW51LWRpc2FibGVkIFwiIDogXCJcIikgKyBcIicgXCIrKHZhbC5zaG9ydGN1dD9cIiBkYXRhLXNob3J0Y3V0PSdcIit2YWwuc2hvcnRjdXQrXCInIFwiOicnKStcIj5cIjtcblx0XHRcdFx0XHRzdHIgKz0gXCI8XCIrXCJhIGhyZWY9JyMnIHJlbD0nXCIgKyAodmFrYXRhX2NvbnRleHQuaXRlbXMubGVuZ3RoIC0gMSkgKyBcIicgXCIgKyAodmFsLnRpdGxlID8gXCJ0aXRsZT0nXCIgKyB2YWwudGl0bGUgKyBcIidcIiA6IFwiXCIpICsgXCI+XCI7XG5cdFx0XHRcdFx0aWYoJC52YWthdGEuY29udGV4dC5zZXR0aW5ncy5pY29ucykge1xuXHRcdFx0XHRcdFx0c3RyICs9IFwiPFwiK1wiaSBcIjtcblx0XHRcdFx0XHRcdGlmKHZhbC5pY29uKSB7XG5cdFx0XHRcdFx0XHRcdGlmKHZhbC5pY29uLmluZGV4T2YoXCIvXCIpICE9PSAtMSB8fCB2YWwuaWNvbi5pbmRleE9mKFwiLlwiKSAhPT0gLTEpIHsgc3RyICs9IFwiIHN0eWxlPSdiYWNrZ3JvdW5kOnVybChcXFwiXCIgKyB2YWwuaWNvbiArIFwiXFxcIikgY2VudGVyIGNlbnRlciBuby1yZXBlYXQnIFwiOyB9XG5cdFx0XHRcdFx0XHRcdGVsc2UgeyBzdHIgKz0gXCIgY2xhc3M9J1wiICsgdmFsLmljb24gKyBcIicgXCI7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHN0ciArPSBcIj48XCIrXCIvaT48XCIrXCJzcGFuIGNsYXNzPSd2YWthdGEtY29udGV4dG1lbnUtc2VwJz4mIzE2MDs8XCIrXCIvc3Bhbj5cIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyICs9ICgkLmlzRnVuY3Rpb24odmFsLmxhYmVsKSA/IHZhbC5sYWJlbCh7IFwiaXRlbVwiIDogaSwgXCJyZWZlcmVuY2VcIiA6IHZha2F0YV9jb250ZXh0LnJlZmVyZW5jZSwgXCJlbGVtZW50XCIgOiB2YWthdGFfY29udGV4dC5lbGVtZW50IH0pIDogdmFsLmxhYmVsKSArICh2YWwuc2hvcnRjdXQ/JyA8c3BhbiBjbGFzcz1cInZha2F0YS1jb250ZXh0bWVudS1zaG9ydGN1dCB2YWthdGEtY29udGV4dG1lbnUtc2hvcnRjdXQtJyt2YWwuc2hvcnRjdXQrJ1wiPicrICh2YWwuc2hvcnRjdXRfbGFiZWwgfHwgJycpICsnPC9zcGFuPic6JycpICsgXCI8XCIrXCIvYT5cIjtcblx0XHRcdFx0XHRpZih2YWwuc3VibWVudSkge1xuXHRcdFx0XHRcdFx0dG1wID0gJC52YWthdGEuY29udGV4dC5fcGFyc2UodmFsLnN1Ym1lbnUsIHRydWUpO1xuXHRcdFx0XHRcdFx0aWYodG1wKSB7IHN0ciArPSB0bXA7IH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyICs9IFwiPFwiK1wiL2xpPlwiO1xuXHRcdFx0XHRcdGlmKHZhbC5zZXBhcmF0b3JfYWZ0ZXIpIHtcblx0XHRcdFx0XHRcdHN0ciArPSBcIjxcIitcImxpIGNsYXNzPSd2YWthdGEtY29udGV4dC1zZXBhcmF0b3InPjxcIitcImEgaHJlZj0nIycgXCIgKyAoJC52YWthdGEuY29udGV4dC5zZXR0aW5ncy5pY29ucyA/ICcnIDogJ3N0eWxlPVwibWFyZ2luLWxlZnQ6MHB4O1wiJykgKyBcIj4mIzE2MDs8XCIrXCIvYT48XCIrXCIvbGk+XCI7XG5cdFx0XHRcdFx0XHRzZXAgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHN0ciAgPSBzdHIucmVwbGFjZSgvPGxpIGNsYXNzXFw9J3Zha2F0YS1jb250ZXh0LXNlcGFyYXRvcidcXD48XFwvbGlcXD4kLyxcIlwiKTtcblx0XHRcdFx0aWYoaXNfY2FsbGJhY2spIHsgc3RyICs9IFwiPC91bD5cIjsgfVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIG9uIHRoZSBkb2N1bWVudCB3aGVuIHRoZSBjb250ZXh0bWVudSBpcyBwYXJzZWQgKEhUTUwgaXMgYnVpbHQpXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdFx0XHRcdCAqIEBuYW1lIGNvbnRleHRfcGFyc2UudmFrYXRhXG5cdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSByZWZlcmVuY2UgdGhlIGVsZW1lbnQgdGhhdCB3YXMgcmlnaHQgY2xpY2tlZFxuXHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gZWxlbWVudCB0aGUgRE9NIGVsZW1lbnQgb2YgdGhlIG1lbnUgaXRzZWxmXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiB0aGUgeCAmIHkgY29vcmRpbmF0ZXMgb2YgdGhlIG1lbnVcblx0XHRcdFx0ICovXG5cdFx0XHRcdGlmKCFpc19jYWxsYmFjaykgeyB2YWthdGFfY29udGV4dC5odG1sID0gc3RyOyAkLnZha2F0YS5jb250ZXh0Ll90cmlnZ2VyKFwicGFyc2VcIik7IH1cblx0XHRcdFx0cmV0dXJuIHN0ci5sZW5ndGggPiAxMCA/IHN0ciA6IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdF9zaG93X3N1Ym1lbnUgOiBmdW5jdGlvbiAobykge1xuXHRcdFx0XHRvID0gJChvKTtcblx0XHRcdFx0aWYoIW8ubGVuZ3RoIHx8ICFvLmNoaWxkcmVuKFwidWxcIikubGVuZ3RoKSB7IHJldHVybjsgfVxuXHRcdFx0XHR2YXIgZSA9IG8uY2hpbGRyZW4oXCJ1bFwiKSxcblx0XHRcdFx0XHR4bCA9IG8ub2Zmc2V0KCkubGVmdCxcblx0XHRcdFx0XHR4ID0geGwgKyBvLm91dGVyV2lkdGgoKSxcblx0XHRcdFx0XHR5ID0gby5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0dyA9IGUud2lkdGgoKSxcblx0XHRcdFx0XHRoID0gZS5oZWlnaHQoKSxcblx0XHRcdFx0XHRkdyA9ICQod2luZG93KS53aWR0aCgpICsgJCh3aW5kb3cpLnNjcm9sbExlZnQoKSxcblx0XHRcdFx0XHRkaCA9ICQod2luZG93KS5oZWlnaHQoKSArICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHRcdFx0Ly8g0LzQvtC20LUg0LTQsCDRgdC1INGB0L/QtdGB0YLQuCDQtSDQtdC00L3QsCDQv9GA0L7QstC10YDQutCwIC0g0LTQsNC70Lgg0L3Rj9C80LAg0L3Rj9C60L7QuSDQvtGCINC60LvQsNGB0L7QstC10YLQtSDQstC10YfQtSDQvdCw0LPQvtGA0LVcblx0XHRcdFx0aWYocmlnaHRfdG9fbGVmdCkge1xuXHRcdFx0XHRcdG9beCAtICh3ICsgMTAgKyBvLm91dGVyV2lkdGgoKSkgPCAwID8gXCJhZGRDbGFzc1wiIDogXCJyZW1vdmVDbGFzc1wiXShcInZha2F0YS1jb250ZXh0LWxlZnRcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0b1t4ICsgdyA+IGR3ICAmJiB4bCA+IGR3IC0geCA/IFwiYWRkQ2xhc3NcIiA6IFwicmVtb3ZlQ2xhc3NcIl0oXCJ2YWthdGEtY29udGV4dC1yaWdodFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZih5ICsgaCArIDEwID4gZGgpIHtcblx0XHRcdFx0XHRlLmNzcyhcImJvdHRvbVwiLFwiLTFweFwiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vaWYgZG9lcyBub3QgZml0IC0gc3RpY2sgaXQgdG8gdGhlIHNpZGVcblx0XHRcdFx0aWYgKG8uaGFzQ2xhc3MoJ3Zha2F0YS1jb250ZXh0LXJpZ2h0JykpIHtcblx0XHRcdFx0XHRpZiAoeGwgPCB3KSB7XG5cdFx0XHRcdFx0XHRlLmNzcyhcIm1hcmdpbi1yaWdodFwiLCB4bCAtIHcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoZHcgLSB4IDwgdykge1xuXHRcdFx0XHRcdFx0ZS5jc3MoXCJtYXJnaW4tbGVmdFwiLCBkdyAtIHggLSB3KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlLnNob3coKTtcblx0XHRcdH0sXG5cdFx0XHRzaG93IDogZnVuY3Rpb24gKHJlZmVyZW5jZSwgcG9zaXRpb24sIGRhdGEpIHtcblx0XHRcdFx0dmFyIG8sIGUsIHgsIHksIHcsIGgsIGR3LCBkaCwgY29uZCA9IHRydWU7XG5cdFx0XHRcdGlmKHZha2F0YV9jb250ZXh0LmVsZW1lbnQgJiYgdmFrYXRhX2NvbnRleHQuZWxlbWVudC5sZW5ndGgpIHtcblx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50LndpZHRoKCcnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzd2l0Y2goY29uZCkge1xuXHRcdFx0XHRcdGNhc2UgKCFwb3NpdGlvbiAmJiAhcmVmZXJlbmNlKTpcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRjYXNlICghIXBvc2l0aW9uICYmICEhcmVmZXJlbmNlKTpcblx0XHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LnJlZmVyZW5jZVx0PSByZWZlcmVuY2U7XG5cdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5wb3NpdGlvbl94XHQ9IHBvc2l0aW9uLng7XG5cdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5wb3NpdGlvbl95XHQ9IHBvc2l0aW9uLnk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICghcG9zaXRpb24gJiYgISFyZWZlcmVuY2UpOlxuXHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQucmVmZXJlbmNlXHQ9IHJlZmVyZW5jZTtcblx0XHRcdFx0XHRcdG8gPSByZWZlcmVuY2Uub2Zmc2V0KCk7XG5cdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5wb3NpdGlvbl94XHQ9IG8ubGVmdCArIHJlZmVyZW5jZS5vdXRlckhlaWdodCgpO1xuXHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQucG9zaXRpb25feVx0PSBvLnRvcDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgKCEhcG9zaXRpb24gJiYgIXJlZmVyZW5jZSk6XG5cdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5wb3NpdGlvbl94XHQ9IHBvc2l0aW9uLng7XG5cdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5wb3NpdGlvbl95XHQ9IHBvc2l0aW9uLnk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighIXJlZmVyZW5jZSAmJiAhZGF0YSAmJiAkKHJlZmVyZW5jZSkuZGF0YSgndmFrYXRhX2NvbnRleHRtZW51JykpIHtcblx0XHRcdFx0XHRkYXRhID0gJChyZWZlcmVuY2UpLmRhdGEoJ3Zha2F0YV9jb250ZXh0bWVudScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCQudmFrYXRhLmNvbnRleHQuX3BhcnNlKGRhdGEpKSB7XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC5odG1sKHZha2F0YV9jb250ZXh0Lmh0bWwpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHZha2F0YV9jb250ZXh0Lml0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnQuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5cdFx0XHRcdFx0ZSA9IHZha2F0YV9jb250ZXh0LmVsZW1lbnQ7XG5cdFx0XHRcdFx0eCA9IHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3g7XG5cdFx0XHRcdFx0eSA9IHZha2F0YV9jb250ZXh0LnBvc2l0aW9uX3k7XG5cdFx0XHRcdFx0dyA9IGUud2lkdGgoKTtcblx0XHRcdFx0XHRoID0gZS5oZWlnaHQoKTtcblx0XHRcdFx0XHRkdyA9ICQod2luZG93KS53aWR0aCgpICsgJCh3aW5kb3cpLnNjcm9sbExlZnQoKTtcblx0XHRcdFx0XHRkaCA9ICQod2luZG93KS5oZWlnaHQoKSArICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHRcdFx0XHRpZihyaWdodF90b19sZWZ0KSB7XG5cdFx0XHRcdFx0XHR4IC09IChlLm91dGVyV2lkdGgoKSAtICQocmVmZXJlbmNlKS5vdXRlcldpZHRoKCkpO1xuXHRcdFx0XHRcdFx0aWYoeCA8ICQod2luZG93KS5zY3JvbGxMZWZ0KCkgKyAyMCkge1xuXHRcdFx0XHRcdFx0XHR4ID0gJCh3aW5kb3cpLnNjcm9sbExlZnQoKSArIDIwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih4ICsgdyArIDIwID4gZHcpIHtcblx0XHRcdFx0XHRcdHggPSBkdyAtICh3ICsgMjApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih5ICsgaCArIDIwID4gZGgpIHtcblx0XHRcdFx0XHRcdHkgPSBkaCAtIChoICsgMjApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmVsZW1lbnRcblx0XHRcdFx0XHRcdC5jc3MoeyBcImxlZnRcIiA6IHgsIFwidG9wXCIgOiB5IH0pXG5cdFx0XHRcdFx0XHQuc2hvdygpXG5cdFx0XHRcdFx0XHQuZmluZCgnYScpLmZpcnN0KCkuZm9jdXMoKS5wYXJlbnQoKS5hZGRDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpO1xuXHRcdFx0XHRcdHZha2F0YV9jb250ZXh0LmlzX3Zpc2libGUgPSB0cnVlO1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIHRyaWdnZXJlZCBvbiB0aGUgZG9jdW1lbnQgd2hlbiB0aGUgY29udGV4dG1lbnUgaXMgc2hvd25cblx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHQgKiBAcGx1Z2luIGNvbnRleHRtZW51XG5cdFx0XHRcdFx0ICogQG5hbWUgY29udGV4dF9zaG93LnZha2F0YVxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSByZWZlcmVuY2UgdGhlIGVsZW1lbnQgdGhhdCB3YXMgcmlnaHQgY2xpY2tlZFxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7alF1ZXJ5fSBlbGVtZW50IHRoZSBET00gZWxlbWVudCBvZiB0aGUgbWVudSBpdHNlbGZcblx0XHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gdGhlIHggJiB5IGNvb3JkaW5hdGVzIG9mIHRoZSBtZW51XG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0JC52YWthdGEuY29udGV4dC5fdHJpZ2dlcihcInNob3dcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRoaWRlIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZih2YWthdGFfY29udGV4dC5pc192aXNpYmxlKSB7XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC5oaWRlKCkuZmluZChcInVsXCIpLmhpZGUoKS5lbmQoKS5maW5kKCc6Zm9jdXMnKS5ibHVyKCkuZW5kKCkuZGV0YWNoKCk7XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuaXNfdmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIHRyaWdnZXJlZCBvbiB0aGUgZG9jdW1lbnQgd2hlbiB0aGUgY29udGV4dG1lbnUgaXMgaGlkZGVuXG5cdFx0XHRcdFx0ICogQGV2ZW50XG5cdFx0XHRcdFx0ICogQHBsdWdpbiBjb250ZXh0bWVudVxuXHRcdFx0XHRcdCAqIEBuYW1lIGNvbnRleHRfaGlkZS52YWthdGFcblx0XHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gcmVmZXJlbmNlIHRoZSBlbGVtZW50IHRoYXQgd2FzIHJpZ2h0IGNsaWNrZWRcblx0XHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gZWxlbWVudCB0aGUgRE9NIGVsZW1lbnQgb2YgdGhlIG1lbnUgaXRzZWxmXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IHBvc2l0aW9uIHRoZSB4ICYgeSBjb29yZGluYXRlcyBvZiB0aGUgbWVudVxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdCQudmFrYXRhLmNvbnRleHQuX3RyaWdnZXIoXCJoaWRlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQkKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJpZ2h0X3RvX2xlZnQgPSAkKGRvY3VtZW50LmJvZHkpLmNzcyhcImRpcmVjdGlvblwiKSA9PT0gXCJydGxcIjtcblx0XHRcdHZhciB0byA9IGZhbHNlO1xuXG5cdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50ID0gJChcIjx1bCBjbGFzcz0ndmFrYXRhLWNvbnRleHQnPjwvdWw+XCIpO1xuXHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudFxuXHRcdFx0XHQub24oXCJtb3VzZWVudGVyXCIsIFwibGlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFx0aWYoJC5jb250YWlucyh0aGlzLCBlLnJlbGF0ZWRUYXJnZXQpKSB7XG5cdFx0XHRcdFx0XHQvLyDQv9GA0LXQvNCw0YXQvdCw0YLQviDQt9Cw0YDQsNC00LggZGVsZWdhdGUgbW91c2VsZWF2ZSDQv9C+LdC00L7Qu9GDXG5cdFx0XHRcdFx0XHQvLyAkKHRoaXMpLmZpbmQoXCIudmFrYXRhLWNvbnRleHQtaG92ZXJcIikucmVtb3ZlQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZih0bykgeyBjbGVhclRpbWVvdXQodG8pOyB9XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKFwiLnZha2F0YS1jb250ZXh0LWhvdmVyXCIpLnJlbW92ZUNsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIikuZW5kKCk7XG5cblx0XHRcdFx0XHQkKHRoaXMpXG5cdFx0XHRcdFx0XHQuc2libGluZ3MoKS5maW5kKFwidWxcIikuaGlkZSgpLmVuZCgpLmVuZCgpXG5cdFx0XHRcdFx0XHQucGFyZW50c1VudGlsKFwiLnZha2F0YS1jb250ZXh0XCIsIFwibGlcIikuYWRkQmFjaygpLmFkZENsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIik7XG5cdFx0XHRcdFx0JC52YWthdGEuY29udGV4dC5fc2hvd19zdWJtZW51KHRoaXMpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQvLyDRgtC10YHRgtC+0LLQviAtINC00LDQu9C4INC90LUg0L3QsNGC0L7QstCw0YDQstCwP1xuXHRcdFx0XHQub24oXCJtb3VzZWxlYXZlXCIsIFwibGlcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpZigkLmNvbnRhaW5zKHRoaXMsIGUucmVsYXRlZFRhcmdldCkpIHsgcmV0dXJuOyB9XG5cdFx0XHRcdFx0JCh0aGlzKS5maW5kKFwiLnZha2F0YS1jb250ZXh0LWhvdmVyXCIpLmFkZEJhY2soKS5yZW1vdmVDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5maW5kKFwiLnZha2F0YS1jb250ZXh0LWhvdmVyXCIpLnJlbW92ZUNsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIik7XG5cdFx0XHRcdFx0aWYoJC52YWthdGEuY29udGV4dC5zZXR0aW5ncy5oaWRlX29ubW91c2VsZWF2ZSkge1xuXHRcdFx0XHRcdFx0dG8gPSBzZXRUaW1lb3V0KFxuXHRcdFx0XHRcdFx0XHQoZnVuY3Rpb24gKHQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkgeyAkLnZha2F0YS5jb250ZXh0LmhpZGUoKTsgfTtcblx0XHRcdFx0XHRcdFx0fSh0aGlzKSksICQudmFrYXRhLmNvbnRleHQuc2V0dGluZ3MuaGlkZV9vbm1vdXNlbGVhdmUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKFwiY2xpY2tcIiwgXCJhXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQvL30pXG5cdFx0XHRcdC8vLm9uKFwibW91c2V1cFwiLCBcImFcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRpZighJCh0aGlzKS5ibHVyKCkucGFyZW50KCkuaGFzQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1kaXNhYmxlZFwiKSAmJiAkLnZha2F0YS5jb250ZXh0Ll9leGVjdXRlKCQodGhpcykuYXR0cihcInJlbFwiKSkgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHQkLnZha2F0YS5jb250ZXh0LmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbigna2V5ZG93bicsICdhJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdHZhciBvID0gbnVsbDtcblx0XHRcdFx0XHRcdHN3aXRjaChlLndoaWNoKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgMTM6XG5cdFx0XHRcdFx0XHRcdGNhc2UgMzI6XG5cdFx0XHRcdFx0XHRcdFx0ZS50eXBlID0gXCJjbGlja1wiO1xuXHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkudHJpZ2dlcihlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAzNzpcblx0XHRcdFx0XHRcdFx0XHRpZih2YWthdGFfY29udGV4dC5pc192aXNpYmxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoXCIudmFrYXRhLWNvbnRleHQtaG92ZXJcIikubGFzdCgpLmNsb3Nlc3QoXCJsaVwiKS5maXJzdCgpLmZpbmQoXCJ1bFwiKS5oaWRlKCkuZmluZChcIi52YWthdGEtY29udGV4dC1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpLmVuZCgpLmVuZCgpLmNoaWxkcmVuKCdhJykuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHRcdFx0XHRcdGlmKHZha2F0YV9jb250ZXh0LmlzX3Zpc2libGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG8gPSB2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoXCJ1bDp2aXNpYmxlXCIpLmFkZEJhY2soKS5sYXN0KCkuY2hpbGRyZW4oXCIudmFrYXRhLWNvbnRleHQtaG92ZXJcIikucmVtb3ZlQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKS5wcmV2QWxsKFwibGk6bm90KC52YWthdGEtY29udGV4dC1zZXBhcmF0b3IpXCIpLmZpcnN0KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZighby5sZW5ndGgpIHsgbyA9IHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZChcInVsOnZpc2libGVcIikuYWRkQmFjaygpLmxhc3QoKS5jaGlsZHJlbihcImxpOm5vdCgudmFrYXRhLWNvbnRleHQtc2VwYXJhdG9yKVwiKS5sYXN0KCk7IH1cblx0XHRcdFx0XHRcdFx0XHRcdG8uYWRkQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKS5jaGlsZHJlbignYScpLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAzOTpcblx0XHRcdFx0XHRcdFx0XHRpZih2YWthdGFfY29udGV4dC5pc192aXNpYmxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoXCIudmFrYXRhLWNvbnRleHQtaG92ZXJcIikubGFzdCgpLmNoaWxkcmVuKFwidWxcIikuc2hvdygpLmNoaWxkcmVuKFwibGk6bm90KC52YWthdGEtY29udGV4dC1zZXBhcmF0b3IpXCIpLnJlbW92ZUNsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIikuZmlyc3QoKS5hZGRDbGFzcyhcInZha2F0YS1jb250ZXh0LWhvdmVyXCIpLmNoaWxkcmVuKCdhJykuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdFx0XHRcdGlmKHZha2F0YV9jb250ZXh0LmlzX3Zpc2libGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG8gPSB2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoXCJ1bDp2aXNpYmxlXCIpLmFkZEJhY2soKS5sYXN0KCkuY2hpbGRyZW4oXCIudmFrYXRhLWNvbnRleHQtaG92ZXJcIikucmVtb3ZlQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1ob3ZlclwiKS5uZXh0QWxsKFwibGk6bm90KC52YWthdGEtY29udGV4dC1zZXBhcmF0b3IpXCIpLmZpcnN0KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZighby5sZW5ndGgpIHsgbyA9IHZha2F0YV9jb250ZXh0LmVsZW1lbnQuZmluZChcInVsOnZpc2libGVcIikuYWRkQmFjaygpLmxhc3QoKS5jaGlsZHJlbihcImxpOm5vdCgudmFrYXRhLWNvbnRleHQtc2VwYXJhdG9yKVwiKS5maXJzdCgpOyB9XG5cdFx0XHRcdFx0XHRcdFx0XHRvLmFkZENsYXNzKFwidmFrYXRhLWNvbnRleHQtaG92ZXJcIikuY2hpbGRyZW4oJ2EnKS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0XHRcdFx0JC52YWthdGEuY29udGV4dC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coZS53aGljaCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0dmFyIGEgPSB2YWthdGFfY29udGV4dC5lbGVtZW50LmZpbmQoJy52YWthdGEtY29udGV4dG1lbnUtc2hvcnRjdXQtJyArIGUud2hpY2gpLnBhcmVudCgpO1xuXHRcdFx0XHRcdGlmKGEucGFyZW50KCkubm90KCcudmFrYXRhLWNvbnRleHQtZGlzYWJsZWQnKSkge1xuXHRcdFx0XHRcdFx0YS5jbGljaygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdCQoZG9jdW1lbnQpXG5cdFx0XHRcdC5vbihcIm1vdXNlZG93bi52YWthdGEuanN0cmVlXCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0aWYodmFrYXRhX2NvbnRleHQuaXNfdmlzaWJsZSAmJiB2YWthdGFfY29udGV4dC5lbGVtZW50WzBdICE9PSBlLnRhcmdldCAgJiYgISQuY29udGFpbnModmFrYXRhX2NvbnRleHQuZWxlbWVudFswXSwgZS50YXJnZXQpKSB7XG5cdFx0XHRcdFx0XHQkLnZha2F0YS5jb250ZXh0LmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbihcImNvbnRleHRfc2hvdy52YWthdGEuanN0cmVlXCIsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKFwibGk6aGFzKHVsKVwiKS5jaGlsZHJlbihcImFcIikuYWRkQ2xhc3MoXCJ2YWthdGEtY29udGV4dC1wYXJlbnRcIik7XG5cdFx0XHRcdFx0aWYocmlnaHRfdG9fbGVmdCkge1xuXHRcdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC5hZGRDbGFzcyhcInZha2F0YS1jb250ZXh0LXJ0bFwiKS5jc3MoXCJkaXJlY3Rpb25cIiwgXCJydGxcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGFsc28gYXBwbHkgYSBSVEwgY2xhc3M/XG5cdFx0XHRcdFx0dmFrYXRhX2NvbnRleHQuZWxlbWVudC5maW5kKFwidWxcIikuaGlkZSgpLmVuZCgpO1xuXHRcdFx0XHR9KTtcblx0XHR9KTtcblx0fSgkKSk7XG5cdC8vICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnMucHVzaChcImNvbnRleHRtZW51XCIpO1xuXG5cbi8qKlxuICogIyMjIERyYWcnbidkcm9wIHBsdWdpblxuICpcbiAqIEVuYWJsZXMgZHJhZ2dpbmcgYW5kIGRyb3BwaW5nIG9mIG5vZGVzIGluIHRoZSB0cmVlLCByZXN1bHRpbmcgaW4gYSBtb3ZlIG9yIGNvcHkgb3BlcmF0aW9ucy5cbiAqL1xuXG5cdC8qKlxuXHQgKiBzdG9yZXMgYWxsIGRlZmF1bHRzIGZvciB0aGUgZHJhZyduJ2Ryb3AgcGx1Z2luXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZFxuXHQgKiBAcGx1Z2luIGRuZFxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMuZG5kID0ge1xuXHRcdC8qKlxuXHRcdCAqIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGEgY29weSBzaG91bGQgYmUgcG9zc2libGUgd2hpbGUgZHJhZ2dpbmcgKGJ5IHByZXNzaW50IHRoZSBtZXRhIGtleSBvciBDdHJsKS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC5jb3B5XG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHRjb3B5IDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBhIG51bWJlciBpbmRpY2F0aW5nIGhvdyBsb25nIGEgbm9kZSBzaG91bGQgcmVtYWluIGhvdmVyZWQgd2hpbGUgZHJhZ2dpbmcgdG8gYmUgb3BlbmVkLiBEZWZhdWx0cyB0byBgNTAwYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQub3Blbl90aW1lb3V0XG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHRvcGVuX3RpbWVvdXQgOiA1MDAsXG5cdFx0LyoqXG5cdFx0ICogYSBmdW5jdGlvbiBpbnZva2VkIGVhY2ggdGltZSBhIG5vZGUgaXMgYWJvdXQgdG8gYmUgZHJhZ2dlZCwgaW52b2tlZCBpbiB0aGUgdHJlZSdzIHNjb3BlIGFuZCByZWNlaXZlcyB0aGUgbm9kZXMgYWJvdXQgdG8gYmUgZHJhZ2dlZCBhcyBhbiBhcmd1bWVudCAoYXJyYXkpIGFuZCB0aGUgZXZlbnQgdGhhdCBzdGFydGVkIHRoZSBkcmFnIC0gcmV0dXJuIGBmYWxzZWAgdG8gcHJldmVudCBkcmFnZ2luZ1xuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC5pc19kcmFnZ2FibGVcblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdGlzX2RyYWdnYWJsZSA6IHRydWUsXG5cdFx0LyoqXG5cdFx0ICogYSBib29sZWFuIGluZGljYXRpbmcgaWYgY2hlY2tzIHNob3VsZCBjb25zdGFudGx5IGJlIG1hZGUgd2hpbGUgdGhlIHVzZXIgaXMgZHJhZ2dpbmcgdGhlIG5vZGUgKGFzIG9wcG9zZWQgdG8gY2hlY2tpbmcgb25seSBvbiBkcm9wKSwgZGVmYXVsdCBpcyBgdHJ1ZWBcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQuY2hlY2tfd2hpbGVfZHJhZ2dpbmdcblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdGNoZWNrX3doaWxlX2RyYWdnaW5nIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBub2RlcyBmcm9tIHRoaXMgdHJlZSBzaG91bGQgb25seSBiZSBjb3BpZWQgd2l0aCBkbmQgKGFzIG9wcG9zZWQgdG8gbW92ZWQpLCBkZWZhdWx0IGlzIGBmYWxzZWBcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQuYWx3YXlzX2NvcHlcblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdGFsd2F5c19jb3B5IDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogd2hlbiBkcm9wcGluZyBhIG5vZGUgXCJpbnNpZGVcIiwgdGhpcyBzZXR0aW5nIGluZGljYXRlcyB0aGUgcG9zaXRpb24gdGhlIG5vZGUgc2hvdWxkIGdvIHRvIC0gaXQgY2FuIGJlIGFuIGludGVnZXIgb3IgYSBzdHJpbmc6IFwiZmlyc3RcIiAoc2FtZSBhcyAwKSBvciBcImxhc3RcIiwgZGVmYXVsdCBpcyBgMGBcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQuaW5zaWRlX3Bvc1xuXHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0ICovXG5cdFx0aW5zaWRlX3BvcyA6IDAsXG5cdFx0LyoqXG5cdFx0ICogd2hlbiBzdGFydGluZyB0aGUgZHJhZyBvbiBhIG5vZGUgdGhhdCBpcyBzZWxlY3RlZCB0aGlzIHNldHRpbmcgY29udHJvbHMgaWYgYWxsIHNlbGVjdGVkIG5vZGVzIGFyZSBkcmFnZ2VkIG9yIG9ubHkgdGhlIHNpbmdsZSBub2RlLCBkZWZhdWx0IGlzIGB0cnVlYCwgd2hpY2ggbWVhbnMgYWxsIHNlbGVjdGVkIG5vZGVzIGFyZSBkcmFnZ2VkIHdoZW4gdGhlIGRyYWcgaXMgc3RhcnRlZCBvbiBhIHNlbGVjdGVkIG5vZGVcblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQuZHJhZ19zZWxlY3Rpb25cblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdGRyYWdfc2VsZWN0aW9uIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBjb250cm9scyB3aGV0aGVyIGRuZCB3b3JrcyBvbiB0b3VjaCBkZXZpY2VzLiBJZiBsZWZ0IGFzIGJvb2xlYW4gdHJ1ZSBkbmQgd2lsbCB3b3JrIHRoZSBzYW1lIGFzIGluIGRlc2t0b3AgYnJvd3NlcnMsIHdoaWNoIGluIHNvbWUgY2FzZXMgbWF5IGltcGFpciBzY3JvbGxpbmcuIElmIHNldCB0byBib29sZWFuIGZhbHNlIGRuZCB3aWxsIG5vdCB3b3JrIG9uIHRvdWNoIGRldmljZXMuIFRoZXJlIGlzIGEgc3BlY2lhbCB0aGlyZCBvcHRpb24gLSBzdHJpbmcgXCJzZWxlY3RlZFwiIHdoaWNoIG1lYW5zIG9ubHkgc2VsZWN0ZWQgbm9kZXMgY2FuIGJlIGRyYWdnZWQgb24gdG91Y2ggZGV2aWNlcy5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5kbmQudG91Y2hcblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdHRvdWNoIDogdHJ1ZSxcblx0XHQvKipcblx0XHQgKiBjb250cm9scyB3aGV0aGVyIGl0ZW1zIGNhbiBiZSBkcm9wcGVkIGFueXdoZXJlIG9uIHRoZSBub2RlLCBub3QganVzdCBvbiB0aGUgYW5jaG9yLCBieSBkZWZhdWx0IG9ubHkgdGhlIG5vZGUgYW5jaG9yIGlzIGEgdmFsaWQgZHJvcCB0YXJnZXQuIFdvcmtzIGJlc3Qgd2l0aCB0aGUgd2hvbGVyb3cgcGx1Z2luLiBJZiBlbmFibGVkIG9uIG1vYmlsZSBkZXBlbmRpbmcgb24gdGhlIGludGVyZmFjZSBpdCBtaWdodCBiZSBoYXJkIGZvciB0aGUgdXNlciB0byBjYW5jZWwgdGhlIGRyb3AsIHNpbmNlIHRoZSB3aG9sZSB0cmVlIGNvbnRhaW5lciB3aWxsIGJlIGEgdmFsaWQgZHJvcCB0YXJnZXQuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLmxhcmdlX2Ryb3BfdGFyZ2V0XG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHRsYXJnZV9kcm9wX3RhcmdldCA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIGNvbnRyb2xzIHdoZXRoZXIgYSBkcmFnIGNhbiBiZSBpbml0aWF0ZWQgZnJvbSBhbnkgcGFydCBvZiB0aGUgbm9kZSBhbmQgbm90IGp1c3QgdGhlIHRleHQvaWNvbiBwYXJ0LCB3b3JrcyBiZXN0IHdpdGggdGhlIHdob2xlcm93IHBsdWdpbi4gS2VlcCBpbiBtaW5kIGl0IGNhbiBjYXVzZSBwcm9ibGVtcyB3aXRoIHRyZWUgc2Nyb2xsaW5nIG9uIG1vYmlsZSBkZXBlbmRpbmcgb24gdGhlIGludGVyZmFjZSAtIGluIHRoYXQgY2FzZSBzZXQgdGhlIHRvdWNoIG9wdGlvbiB0byBcInNlbGVjdGVkXCIuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuZG5kLmxhcmdlX2RyYWdfdGFyZ2V0XG5cdFx0ICogQHBsdWdpbiBkbmRcblx0XHQgKi9cblx0XHRsYXJnZV9kcmFnX3RhcmdldCA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIGNvbnRyb2xzIHdoZXRoZXIgdXNlIEhUTUw1IGRuZCBhcGkgaW5zdGVhZCBvZiBjbGFzc2ljYWwuIFRoYXQgd2lsbCBhbGxvdyBiZXR0ZXIgaW50ZWdyYXRpb24gb2YgZG5kIGV2ZW50cyB3aXRoIG90aGVyIEhUTUw1IGNvbnRyb2xzLlxuXHRcdCAqIEByZWZlcmVuY2UgaHR0cDovL2Nhbml1c2UuY29tLyNmZWF0PWRyYWduZHJvcFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLmRuZC51c2VfaHRtbDVcblx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdCAqL1xuXHRcdHVzZV9odG1sNTogZmFsc2Vcblx0fTtcblx0dmFyIGRyZywgZWxtO1xuXHQvLyBUT0RPOiBub3cgY2hlY2sgd29ya3MgYnkgY2hlY2tpbmcgZm9yIGVhY2ggbm9kZSBpbmRpdmlkdWFsbHksIGhvdyBhYm91dCBtYXhfY2hpbGRyZW4sIHVuaXF1ZSwgZXRjP1xuXHQkLmpzdHJlZS5wbHVnaW5zLmRuZCA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcblx0XHRcdHBhcmVudC5pbml0LmNhbGwodGhpcywgZWwsIG9wdGlvbnMpO1xuXHRcdFx0dGhpcy5zZXR0aW5ncy5kbmQudXNlX2h0bWw1ID0gdGhpcy5zZXR0aW5ncy5kbmQudXNlX2h0bWw1ICYmICgnZHJhZ2dhYmxlJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykpO1xuXHRcdH07XG5cdFx0dGhpcy5iaW5kID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFyZW50LmJpbmQuY2FsbCh0aGlzKTtcblxuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5vbih0aGlzLnNldHRpbmdzLmRuZC51c2VfaHRtbDUgPyAnZHJhZ3N0YXJ0LmpzdHJlZScgOiAnbW91c2Vkb3duLmpzdHJlZSB0b3VjaHN0YXJ0LmpzdHJlZScsIHRoaXMuc2V0dGluZ3MuZG5kLmxhcmdlX2RyYWdfdGFyZ2V0ID8gJy5qc3RyZWUtbm9kZScgOiAnLmpzdHJlZS1hbmNob3InLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRpZih0aGlzLnNldHRpbmdzLmRuZC5sYXJnZV9kcmFnX3RhcmdldCAmJiAkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanN0cmVlLW5vZGUnKVswXSAhPT0gZS5jdXJyZW50VGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoZS50eXBlID09PSBcInRvdWNoc3RhcnRcIiAmJiAoIXRoaXMuc2V0dGluZ3MuZG5kLnRvdWNoIHx8ICh0aGlzLnNldHRpbmdzLmRuZC50b3VjaCA9PT0gJ3NlbGVjdGVkJyAmJiAhJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJy5qc3RyZWUtbm9kZScpLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpLmhhc0NsYXNzKCdqc3RyZWUtY2xpY2tlZCcpKSkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2YXIgb2JqID0gdGhpcy5nZXRfbm9kZShlLnRhcmdldCksXG5cdFx0XHRcdFx0XHRcdG1sdCA9IHRoaXMuaXNfc2VsZWN0ZWQob2JqKSAmJiB0aGlzLnNldHRpbmdzLmRuZC5kcmFnX3NlbGVjdGlvbiA/IHRoaXMuZ2V0X3RvcF9zZWxlY3RlZCgpLmxlbmd0aCA6IDEsXG5cdFx0XHRcdFx0XHRcdHR4dCA9IChtbHQgPiAxID8gbWx0ICsgJyAnICsgdGhpcy5nZXRfc3RyaW5nKCdub2RlcycpIDogdGhpcy5nZXRfdGV4dChlLmN1cnJlbnRUYXJnZXQpKTtcblx0XHRcdFx0XHRcdGlmKHRoaXMuc2V0dGluZ3MuY29yZS5mb3JjZV90ZXh0KSB7XG5cdFx0XHRcdFx0XHRcdHR4dCA9ICQudmFrYXRhLmh0bWwuZXNjYXBlKHR4dCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihvYmogJiYgb2JqLmlkICYmIG9iai5pZCAhPT0gJC5qc3RyZWUucm9vdCAmJiAoZS53aGljaCA9PT0gMSB8fCBlLnR5cGUgPT09IFwidG91Y2hzdGFydFwiIHx8IGUudHlwZSA9PT0gXCJkcmFnc3RhcnRcIikgJiZcblx0XHRcdFx0XHRcdFx0KHRoaXMuc2V0dGluZ3MuZG5kLmlzX2RyYWdnYWJsZSA9PT0gdHJ1ZSB8fCAoJC5pc0Z1bmN0aW9uKHRoaXMuc2V0dGluZ3MuZG5kLmlzX2RyYWdnYWJsZSkgJiYgdGhpcy5zZXR0aW5ncy5kbmQuaXNfZHJhZ2dhYmxlLmNhbGwodGhpcywgKG1sdCA+IDEgPyB0aGlzLmdldF90b3Bfc2VsZWN0ZWQodHJ1ZSkgOiBbb2JqXSksIGUpKSlcblx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRkcmcgPSB7ICdqc3RyZWUnIDogdHJ1ZSwgJ29yaWdpbicgOiB0aGlzLCAnb2JqJyA6IHRoaXMuZ2V0X25vZGUob2JqLHRydWUpLCAnbm9kZXMnIDogbWx0ID4gMSA/IHRoaXMuZ2V0X3RvcF9zZWxlY3RlZCgpIDogW29iai5pZF0gfTtcblx0XHRcdFx0XHRcdFx0ZWxtID0gZS5jdXJyZW50VGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5zZXR0aW5ncy5kbmQudXNlX2h0bWw1KSB7XG5cdFx0XHRcdFx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKCdzdGFydCcsIGUsIHsgJ2hlbHBlcic6ICQoKSwgJ2VsZW1lbnQnOiBlbG0sICdkYXRhJzogZHJnIH0pO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC50cmlnZ2VyKCdtb3VzZWRvd24uanN0cmVlJyk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuICQudmFrYXRhLmRuZC5zdGFydChlLCBkcmcsICc8ZGl2IGlkPVwianN0cmVlLWRuZFwiIGNsYXNzPVwianN0cmVlLScgKyB0aGlzLmdldF90aGVtZSgpICsgJyBqc3RyZWUtJyArIHRoaXMuZ2V0X3RoZW1lKCkgKyAnLScgKyB0aGlzLmdldF90aGVtZV92YXJpYW50KCkgKyAnICcgKyAoIHRoaXMuc2V0dGluZ3MuY29yZS50aGVtZXMucmVzcG9uc2l2ZSA/ICcganN0cmVlLWRuZC1yZXNwb25zaXZlJyA6ICcnICkgKyAnXCI+PGkgY2xhc3M9XCJqc3RyZWUtaWNvbiBqc3RyZWUtZXJcIj48L2k+JyArIHR4dCArICc8aW5zIGNsYXNzPVwianN0cmVlLWNvcHlcIiBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIj4rPC9pbnM+PC9kaXY+Jyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRpZiAodGhpcy5zZXR0aW5ncy5kbmQudXNlX2h0bWw1KSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHRcdC5vbignZHJhZ292ZXIuanN0cmVlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoJ21vdmUnLCBlLCB7ICdoZWxwZXInOiAkKCksICdlbGVtZW50JzogZWxtLCAnZGF0YSc6IGRyZyB9KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQvLy5vbignZHJhZ2VudGVyLmpzdHJlZScsIHRoaXMuc2V0dGluZ3MuZG5kLmxhcmdlX2Ryb3BfdGFyZ2V0ID8gJy5qc3RyZWUtbm9kZScgOiAnLmpzdHJlZS1hbmNob3InLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0Ly9cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdC8vXHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcignbW92ZScsIGUsIHsgJ2hlbHBlcic6ICQoKSwgJ2VsZW1lbnQnOiBlbG0sICdkYXRhJzogZHJnIH0pO1xuXHRcdFx0XHRcdC8vXHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHQvL1x0fSwgdGhpcykpXG5cdFx0XHRcdFx0Lm9uKCdkcm9wLmpzdHJlZScsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoJ3N0b3AnLCBlLCB7ICdoZWxwZXInOiAkKCksICdlbGVtZW50JzogZWxtLCAnZGF0YSc6IGRyZyB9KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dGhpcy5yZWRyYXdfbm9kZSA9IGZ1bmN0aW9uKG9iaiwgZGVlcCwgY2FsbGJhY2ssIGZvcmNlX3JlbmRlcikge1xuXHRcdFx0b2JqID0gcGFyZW50LnJlZHJhd19ub2RlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRpZiAob2JqICYmIHRoaXMuc2V0dGluZ3MuZG5kLnVzZV9odG1sNSkge1xuXHRcdFx0XHRpZiAodGhpcy5zZXR0aW5ncy5kbmQubGFyZ2VfZHJhZ190YXJnZXQpIHtcblx0XHRcdFx0XHRvYmouc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgaSwgaiwgdG1wID0gbnVsbDtcblx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmKG9iai5jaGlsZE5vZGVzW2ldICYmIG9iai5jaGlsZE5vZGVzW2ldLmNsYXNzTmFtZSAmJiBvYmouY2hpbGROb2Rlc1tpXS5jbGFzc05hbWUuaW5kZXhPZihcImpzdHJlZS1hbmNob3JcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHRtcCA9IG9iai5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodG1wKSB7XG5cdFx0XHRcdFx0XHR0bXAuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fTtcblx0fTtcblxuXHQkKGZ1bmN0aW9uKCkge1xuXHRcdC8vIGJpbmQgb25seSBvbmNlIGZvciBhbGwgaW5zdGFuY2VzXG5cdFx0dmFyIGxhc3RtdiA9IGZhbHNlLFxuXHRcdFx0bGFzdGVyID0gZmFsc2UsXG5cdFx0XHRsYXN0ZXYgPSBmYWxzZSxcblx0XHRcdG9wZW50byA9IGZhbHNlLFxuXHRcdFx0bWFya2VyID0gJCgnPGRpdiBpZD1cImpzdHJlZS1tYXJrZXJcIj4mIzE2MDs8L2Rpdj4nKS5oaWRlKCk7IC8vLmFwcGVuZFRvKCdib2R5Jyk7XG5cblx0XHQkKGRvY3VtZW50KVxuXHRcdFx0Lm9uKCdkcmFnb3Zlci52YWthdGEuanN0cmVlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKGVsbSkge1xuXHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcignbW92ZScsIGUsIHsgJ2hlbHBlcic6ICQoKSwgJ2VsZW1lbnQnOiBlbG0sICdkYXRhJzogZHJnIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdkcm9wLnZha2F0YS5qc3RyZWUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRpZiAoZWxtKSB7XG5cdFx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKCdzdG9wJywgZSwgeyAnaGVscGVyJzogJCgpLCAnZWxlbWVudCc6IGVsbSwgJ2RhdGEnOiBkcmcgfSk7XG5cdFx0XHRcdFx0ZWxtID0gbnVsbDtcblx0XHRcdFx0XHRkcmcgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdkbmRfc3RhcnQudmFrYXRhLmpzdHJlZScsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdGxhc3RtdiA9IGZhbHNlO1xuXHRcdFx0XHRsYXN0ZXYgPSBmYWxzZTtcblx0XHRcdFx0aWYoIWRhdGEgfHwgIWRhdGEuZGF0YSB8fCAhZGF0YS5kYXRhLmpzdHJlZSkgeyByZXR1cm47IH1cblx0XHRcdFx0bWFya2VyLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpOyAvLy5zaG93KCk7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdkbmRfbW92ZS52YWthdGEuanN0cmVlJywgZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0dmFyIGlzRGlmZmVyZW50Tm9kZSA9IGRhdGEuZXZlbnQudGFyZ2V0ICE9PSBsYXN0ZXYudGFyZ2V0O1xuXHRcdFx0XHRpZihvcGVudG8pIHtcblx0XHRcdFx0XHRpZiAoIWRhdGEuZXZlbnQgfHwgZGF0YS5ldmVudC50eXBlICE9PSAnZHJhZ292ZXInIHx8IGlzRGlmZmVyZW50Tm9kZSkge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KG9wZW50byk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCFkYXRhIHx8ICFkYXRhLmRhdGEgfHwgIWRhdGEuZGF0YS5qc3RyZWUpIHsgcmV0dXJuOyB9XG5cblx0XHRcdFx0Ly8gaWYgd2UgYXJlIGhvdmVyaW5nIHRoZSBtYXJrZXIgaW1hZ2UgZG8gbm90aGluZyAoY2FuIGhhcHBlbiBvbiBcImluc2lkZVwiIGRyYWdzKVxuXHRcdFx0XHRpZihkYXRhLmV2ZW50LnRhcmdldC5pZCAmJiBkYXRhLmV2ZW50LnRhcmdldC5pZCA9PT0gJ2pzdHJlZS1tYXJrZXInKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxhc3RldiA9IGRhdGEuZXZlbnQ7XG5cblx0XHRcdFx0dmFyIGlucyA9ICQuanN0cmVlLnJlZmVyZW5jZShkYXRhLmV2ZW50LnRhcmdldCksXG5cdFx0XHRcdFx0cmVmID0gZmFsc2UsXG5cdFx0XHRcdFx0b2ZmID0gZmFsc2UsXG5cdFx0XHRcdFx0cmVsID0gZmFsc2UsXG5cdFx0XHRcdFx0dG1wLCBsLCB0LCBoLCBwLCBpLCBvLCBvaywgdDEsIHQyLCBvcCwgcHMsIHByLCBpcCwgdG0sIGlzX2NvcHksIHBuO1xuXHRcdFx0XHQvLyBpZiB3ZSBhcmUgb3ZlciBhbiBpbnN0YW5jZVxuXHRcdFx0XHRpZihpbnMgJiYgaW5zLl9kYXRhICYmIGlucy5fZGF0YS5kbmQpIHtcblx0XHRcdFx0XHRtYXJrZXIuYXR0cignY2xhc3MnLCAnanN0cmVlLScgKyBpbnMuZ2V0X3RoZW1lKCkgKyAoIGlucy5zZXR0aW5ncy5jb3JlLnRoZW1lcy5yZXNwb25zaXZlID8gJyBqc3RyZWUtZG5kLXJlc3BvbnNpdmUnIDogJycgKSk7XG5cdFx0XHRcdFx0aXNfY29weSA9IGRhdGEuZGF0YS5vcmlnaW4gJiYgKGRhdGEuZGF0YS5vcmlnaW4uc2V0dGluZ3MuZG5kLmFsd2F5c19jb3B5IHx8IChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5jb3B5ICYmIChkYXRhLmV2ZW50Lm1ldGFLZXkgfHwgZGF0YS5ldmVudC5jdHJsS2V5KSkpO1xuXHRcdFx0XHRcdGRhdGEuaGVscGVyXG5cdFx0XHRcdFx0XHQuY2hpbGRyZW4oKS5hdHRyKCdjbGFzcycsICdqc3RyZWUtJyArIGlucy5nZXRfdGhlbWUoKSArICcganN0cmVlLScgKyBpbnMuZ2V0X3RoZW1lKCkgKyAnLScgKyBpbnMuZ2V0X3RoZW1lX3ZhcmlhbnQoKSArICcgJyArICggaW5zLnNldHRpbmdzLmNvcmUudGhlbWVzLnJlc3BvbnNpdmUgPyAnIGpzdHJlZS1kbmQtcmVzcG9uc2l2ZScgOiAnJyApKVxuXHRcdFx0XHRcdFx0LmZpbmQoJy5qc3RyZWUtY29weScpLmZpcnN0KClbIGlzX2NvcHkgPyAnc2hvdycgOiAnaGlkZScgXSgpO1xuXG5cdFx0XHRcdFx0Ly8gaWYgYXJlIGhvdmVyaW5nIHRoZSBjb250YWluZXIgaXRzZWxmIGFkZCBhIG5ldyByb290IG5vZGVcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGRhdGEuZXZlbnQpO1xuXHRcdFx0XHRcdGlmKCAoZGF0YS5ldmVudC50YXJnZXQgPT09IGlucy5lbGVtZW50WzBdIHx8IGRhdGEuZXZlbnQudGFyZ2V0ID09PSBpbnMuZ2V0X2NvbnRhaW5lcl91bCgpWzBdKSAmJiBpbnMuZ2V0X2NvbnRhaW5lcl91bCgpLmNoaWxkcmVuKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRvayA9IHRydWU7XG5cdFx0XHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IGRhdGEuZGF0YS5ub2Rlcy5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHRcdFx0b2sgPSBvayAmJiBpbnMuY2hlY2soIChkYXRhLmRhdGEub3JpZ2luICYmIChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5hbHdheXNfY29weSB8fCAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuY29weSAmJiAoZGF0YS5ldmVudC5tZXRhS2V5IHx8IGRhdGEuZXZlbnQuY3RybEtleSkpICkgPyBcImNvcHlfbm9kZVwiIDogXCJtb3ZlX25vZGVcIiksIChkYXRhLmRhdGEub3JpZ2luICYmIGRhdGEuZGF0YS5vcmlnaW4gIT09IGlucyA/IGRhdGEuZGF0YS5vcmlnaW4uZ2V0X25vZGUoZGF0YS5kYXRhLm5vZGVzW3QxXSkgOiBkYXRhLmRhdGEubm9kZXNbdDFdKSwgJC5qc3RyZWUucm9vdCwgJ2xhc3QnLCB7ICdkbmQnIDogdHJ1ZSwgJ3JlZicgOiBpbnMuZ2V0X25vZGUoJC5qc3RyZWUucm9vdCksICdwb3MnIDogJ2knLCAnb3JpZ2luJyA6IGRhdGEuZGF0YS5vcmlnaW4sICdpc19tdWx0aScgOiAoZGF0YS5kYXRhLm9yaWdpbiAmJiBkYXRhLmRhdGEub3JpZ2luICE9PSBpbnMpLCAnaXNfZm9yZWlnbicgOiAoIWRhdGEuZGF0YS5vcmlnaW4pIH0pO1xuXHRcdFx0XHRcdFx0XHRpZighb2spIHsgYnJlYWs7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKG9rKSB7XG5cdFx0XHRcdFx0XHRcdGxhc3RtdiA9IHsgJ2lucycgOiBpbnMsICdwYXInIDogJC5qc3RyZWUucm9vdCwgJ3BvcycgOiAnbGFzdCcgfTtcblx0XHRcdFx0XHRcdFx0bWFya2VyLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0ZGF0YS5oZWxwZXIuZmluZCgnLmpzdHJlZS1pY29uJykuZmlyc3QoKS5yZW1vdmVDbGFzcygnanN0cmVlLWVyJykuYWRkQ2xhc3MoJ2pzdHJlZS1vaycpO1xuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50ICYmIGRhdGEuZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIpIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBpc19jb3B5ID8gJ2NvcHknIDogJ21vdmUnO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBpZiB3ZSBhcmUgaG92ZXJpbmcgYSB0cmVlIG5vZGVcblx0XHRcdFx0XHRcdHJlZiA9IGlucy5zZXR0aW5ncy5kbmQubGFyZ2VfZHJvcF90YXJnZXQgPyAkKGRhdGEuZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcuanN0cmVlLW5vZGUnKS5jaGlsZHJlbignLmpzdHJlZS1hbmNob3InKSA6ICQoZGF0YS5ldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5qc3RyZWUtYW5jaG9yJyk7XG5cdFx0XHRcdFx0XHRpZihyZWYgJiYgcmVmLmxlbmd0aCAmJiByZWYucGFyZW50KCkuaXMoJy5qc3RyZWUtY2xvc2VkLCAuanN0cmVlLW9wZW4sIC5qc3RyZWUtbGVhZicpKSB7XG5cdFx0XHRcdFx0XHRcdG9mZiA9IHJlZi5vZmZzZXQoKTtcblx0XHRcdFx0XHRcdFx0cmVsID0gKGRhdGEuZXZlbnQucGFnZVkgIT09IHVuZGVmaW5lZCA/IGRhdGEuZXZlbnQucGFnZVkgOiBkYXRhLmV2ZW50Lm9yaWdpbmFsRXZlbnQucGFnZVkpIC0gb2ZmLnRvcDtcblx0XHRcdFx0XHRcdFx0aCA9IHJlZi5vdXRlckhlaWdodCgpO1xuXHRcdFx0XHRcdFx0XHRpZihyZWwgPCBoIC8gMykge1xuXHRcdFx0XHRcdFx0XHRcdG8gPSBbJ2InLCAnaScsICdhJ107XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSBpZihyZWwgPiBoIC0gaCAvIDMpIHtcblx0XHRcdFx0XHRcdFx0XHRvID0gWydhJywgJ2knLCAnYiddO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG8gPSByZWwgPiBoIC8gMiA/IFsnaScsICdhJywgJ2InXSA6IFsnaScsICdiJywgJ2EnXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQkLmVhY2gobywgZnVuY3Rpb24gKGosIHYpIHtcblx0XHRcdFx0XHRcdFx0XHRzd2l0Y2godikge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSAnYic6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGwgPSBvZmYubGVmdCAtIDY7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHQgPSBvZmYudG9wO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwID0gaW5zLmdldF9wYXJlbnQocmVmKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aSA9IHJlZi5wYXJlbnQoKS5pbmRleCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2knOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpcCA9IGlucy5zZXR0aW5ncy5kbmQuaW5zaWRlX3Bvcztcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG0gPSBpbnMuZ2V0X25vZGUocmVmLnBhcmVudCgpKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bCA9IG9mZi5sZWZ0IC0gMjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dCA9IG9mZi50b3AgKyBoIC8gMiArIDE7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHAgPSB0bS5pZDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aSA9IGlwID09PSAnZmlyc3QnID8gMCA6IChpcCA9PT0gJ2xhc3QnID8gdG0uY2hpbGRyZW4ubGVuZ3RoIDogTWF0aC5taW4oaXAsIHRtLmNoaWxkcmVuLmxlbmd0aCkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2EnOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsID0gb2ZmLmxlZnQgLSA2O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0ID0gb2ZmLnRvcCArIGg7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHAgPSBpbnMuZ2V0X3BhcmVudChyZWYpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpID0gcmVmLnBhcmVudCgpLmluZGV4KCkgKyAxO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0b2sgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdGZvcih0MSA9IDAsIHQyID0gZGF0YS5kYXRhLm5vZGVzLmxlbmd0aDsgdDEgPCB0MjsgdDErKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0b3AgPSBkYXRhLmRhdGEub3JpZ2luICYmIChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5hbHdheXNfY29weSB8fCAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuY29weSAmJiAoZGF0YS5ldmVudC5tZXRhS2V5IHx8IGRhdGEuZXZlbnQuY3RybEtleSkpKSA/IFwiY29weV9ub2RlXCIgOiBcIm1vdmVfbm9kZVwiO1xuXHRcdFx0XHRcdFx0XHRcdFx0cHMgPSBpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYob3AgPT09IFwibW92ZV9ub2RlXCIgJiYgdiA9PT0gJ2EnICYmIChkYXRhLmRhdGEub3JpZ2luICYmIGRhdGEuZGF0YS5vcmlnaW4gPT09IGlucykgJiYgcCA9PT0gaW5zLmdldF9wYXJlbnQoZGF0YS5kYXRhLm5vZGVzW3QxXSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cHIgPSBpbnMuZ2V0X25vZGUocCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHBzID4gJC5pbkFycmF5KGRhdGEuZGF0YS5ub2Rlc1t0MV0sIHByLmNoaWxkcmVuKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBzIC09IDE7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdG9rID0gb2sgJiYgKCAoaW5zICYmIGlucy5zZXR0aW5ncyAmJiBpbnMuc2V0dGluZ3MuZG5kICYmIGlucy5zZXR0aW5ncy5kbmQuY2hlY2tfd2hpbGVfZHJhZ2dpbmcgPT09IGZhbHNlKSB8fCBpbnMuY2hlY2sob3AsIChkYXRhLmRhdGEub3JpZ2luICYmIGRhdGEuZGF0YS5vcmlnaW4gIT09IGlucyA/IGRhdGEuZGF0YS5vcmlnaW4uZ2V0X25vZGUoZGF0YS5kYXRhLm5vZGVzW3QxXSkgOiBkYXRhLmRhdGEubm9kZXNbdDFdKSwgcCwgcHMsIHsgJ2RuZCcgOiB0cnVlLCAncmVmJyA6IGlucy5nZXRfbm9kZShyZWYucGFyZW50KCkpLCAncG9zJyA6IHYsICdvcmlnaW4nIDogZGF0YS5kYXRhLm9yaWdpbiwgJ2lzX211bHRpJyA6IChkYXRhLmRhdGEub3JpZ2luICYmIGRhdGEuZGF0YS5vcmlnaW4gIT09IGlucyksICdpc19mb3JlaWduJyA6ICghZGF0YS5kYXRhLm9yaWdpbikgfSkgKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKCFvaykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihpbnMgJiYgaW5zLmxhc3RfZXJyb3IpIHsgbGFzdGVyID0gaW5zLmxhc3RfZXJyb3IoKTsgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYodiA9PT0gJ2knICYmIHJlZi5wYXJlbnQoKS5pcygnLmpzdHJlZS1jbG9zZWQnKSAmJiBpbnMuc2V0dGluZ3MuZG5kLm9wZW5fdGltZW91dCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFkYXRhLmV2ZW50IHx8IGRhdGEuZXZlbnQudHlwZSAhPT0gJ2RyYWdvdmVyJyB8fCBpc0RpZmZlcmVudE5vZGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9wZW50bykgeyBjbGVhclRpbWVvdXQob3BlbnRvKTsgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVudG8gPSBzZXRUaW1lb3V0KChmdW5jdGlvbiAoeCwgeikgeyByZXR1cm4gZnVuY3Rpb24gKCkgeyB4Lm9wZW5fbm9kZSh6KTsgfTsgfShpbnMsIHJlZikpLCBpbnMuc2V0dGluZ3MuZG5kLm9wZW5fdGltZW91dCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmKG9rKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwbiA9IGlucy5nZXRfbm9kZShwLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghcG4uaGFzQ2xhc3MoJy5qc3RyZWUtZG5kLXBhcmVudCcpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCQoJy5qc3RyZWUtZG5kLXBhcmVudCcpLnJlbW92ZUNsYXNzKCdqc3RyZWUtZG5kLXBhcmVudCcpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwbi5hZGRDbGFzcygnanN0cmVlLWRuZC1wYXJlbnQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGxhc3RtdiA9IHsgJ2lucycgOiBpbnMsICdwYXInIDogcCwgJ3BvcycgOiB2ID09PSAnaScgJiYgaXAgPT09ICdsYXN0JyAmJiBpID09PSAwICYmICFpbnMuaXNfbG9hZGVkKHRtKSA/ICdsYXN0JyA6IGkgfTtcblx0XHRcdFx0XHRcdFx0XHRcdG1hcmtlci5jc3MoeyAnbGVmdCcgOiBsICsgJ3B4JywgJ3RvcCcgOiB0ICsgJ3B4JyB9KS5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmhlbHBlci5maW5kKCcuanN0cmVlLWljb24nKS5maXJzdCgpLnJlbW92ZUNsYXNzKCdqc3RyZWUtZXInKS5hZGRDbGFzcygnanN0cmVlLW9rJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50ICYmIGRhdGEuZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gaXNfY29weSA/ICdjb3B5JyA6ICdtb3ZlJztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGxhc3RlciA9IHt9O1xuXHRcdFx0XHRcdFx0XHRcdFx0byA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0aWYobyA9PT0gdHJ1ZSkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0JCgnLmpzdHJlZS1kbmQtcGFyZW50JykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1kbmQtcGFyZW50Jyk7XG5cdFx0XHRcdGxhc3RtdiA9IGZhbHNlO1xuXHRcdFx0XHRkYXRhLmhlbHBlci5maW5kKCcuanN0cmVlLWljb24nKS5yZW1vdmVDbGFzcygnanN0cmVlLW9rJykuYWRkQ2xhc3MoJ2pzdHJlZS1lcicpO1xuXHRcdFx0XHRpZiAoZGF0YS5ldmVudC5vcmlnaW5hbEV2ZW50ICYmIGRhdGEuZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIpIHtcblx0XHRcdFx0XHQvL2RhdGEuZXZlbnQub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdub25lJztcblx0XHRcdFx0fVxuXHRcdFx0XHRtYXJrZXIuaGlkZSgpO1xuXHRcdFx0fSlcblx0XHRcdC5vbignZG5kX3Njcm9sbC52YWthdGEuanN0cmVlJywgZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0aWYoIWRhdGEgfHwgIWRhdGEuZGF0YSB8fCAhZGF0YS5kYXRhLmpzdHJlZSkgeyByZXR1cm47IH1cblx0XHRcdFx0bWFya2VyLmhpZGUoKTtcblx0XHRcdFx0bGFzdG12ID0gZmFsc2U7XG5cdFx0XHRcdGxhc3RldiA9IGZhbHNlO1xuXHRcdFx0XHRkYXRhLmhlbHBlci5maW5kKCcuanN0cmVlLWljb24nKS5maXJzdCgpLnJlbW92ZUNsYXNzKCdqc3RyZWUtb2snKS5hZGRDbGFzcygnanN0cmVlLWVyJyk7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdkbmRfc3RvcC52YWthdGEuanN0cmVlJywgZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0JCgnLmpzdHJlZS1kbmQtcGFyZW50JykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS1kbmQtcGFyZW50Jyk7XG5cdFx0XHRcdGlmKG9wZW50bykgeyBjbGVhclRpbWVvdXQob3BlbnRvKTsgfVxuXHRcdFx0XHRpZighZGF0YSB8fCAhZGF0YS5kYXRhIHx8ICFkYXRhLmRhdGEuanN0cmVlKSB7IHJldHVybjsgfVxuXHRcdFx0XHRtYXJrZXIuaGlkZSgpLmRldGFjaCgpO1xuXHRcdFx0XHR2YXIgaSwgaiwgbm9kZXMgPSBbXTtcblx0XHRcdFx0aWYobGFzdG12KSB7XG5cdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZGF0YS5kYXRhLm5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0bm9kZXNbaV0gPSBkYXRhLmRhdGEub3JpZ2luID8gZGF0YS5kYXRhLm9yaWdpbi5nZXRfbm9kZShkYXRhLmRhdGEubm9kZXNbaV0pIDogZGF0YS5kYXRhLm5vZGVzW2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsYXN0bXYuaW5zWyBkYXRhLmRhdGEub3JpZ2luICYmIChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5hbHdheXNfY29weSB8fCAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuY29weSAmJiAoZGF0YS5ldmVudC5tZXRhS2V5IHx8IGRhdGEuZXZlbnQuY3RybEtleSkpKSA/ICdjb3B5X25vZGUnIDogJ21vdmVfbm9kZScgXShub2RlcywgbGFzdG12LnBhciwgbGFzdG12LnBvcywgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZGF0YS5kYXRhLm9yaWdpbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aSA9ICQoZGF0YS5ldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5qc3RyZWUnKTtcblx0XHRcdFx0XHRpZihpLmxlbmd0aCAmJiBsYXN0ZXIgJiYgbGFzdGVyLmVycm9yICYmIGxhc3Rlci5lcnJvciA9PT0gJ2NoZWNrJykge1xuXHRcdFx0XHRcdFx0aSA9IGkuanN0cmVlKHRydWUpO1xuXHRcdFx0XHRcdFx0aWYoaSkge1xuXHRcdFx0XHRcdFx0XHRpLnNldHRpbmdzLmNvcmUuZXJyb3IuY2FsbCh0aGlzLCBsYXN0ZXIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRsYXN0ZXYgPSBmYWxzZTtcblx0XHRcdFx0bGFzdG12ID0gZmFsc2U7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdrZXl1cC5qc3RyZWUga2V5ZG93bi5qc3RyZWUnLCBmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRkYXRhID0gJC52YWthdGEuZG5kLl9nZXQoKTtcblx0XHRcdFx0aWYoZGF0YSAmJiBkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmpzdHJlZSkge1xuXHRcdFx0XHRcdGlmIChlLnR5cGUgPT09IFwia2V5dXBcIiAmJiBlLndoaWNoID09PSAyNykge1xuXHRcdFx0XHRcdFx0aWYgKG9wZW50bykgeyBjbGVhclRpbWVvdXQob3BlbnRvKTsgfVxuXHRcdFx0XHRcdFx0bGFzdG12ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRsYXN0ZXIgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGxhc3RldiA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0b3BlbnRvID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRtYXJrZXIuaGlkZSgpLmRldGFjaCgpO1xuXHRcdFx0XHRcdFx0JC52YWthdGEuZG5kLl9jbGVhbigpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkYXRhLmhlbHBlci5maW5kKCcuanN0cmVlLWNvcHknKS5maXJzdCgpWyBkYXRhLmRhdGEub3JpZ2luICYmIChkYXRhLmRhdGEub3JpZ2luLnNldHRpbmdzLmRuZC5hbHdheXNfY29weSB8fCAoZGF0YS5kYXRhLm9yaWdpbi5zZXR0aW5ncy5kbmQuY29weSAmJiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkpKSA/ICdzaG93JyA6ICdoaWRlJyBdKCk7XG5cdFx0XHRcdFx0XHRpZihsYXN0ZXYpIHtcblx0XHRcdFx0XHRcdFx0bGFzdGV2Lm1ldGFLZXkgPSBlLm1ldGFLZXk7XG5cdFx0XHRcdFx0XHRcdGxhc3Rldi5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuXHRcdFx0XHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoJ21vdmUnLCBsYXN0ZXYpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdH0pO1xuXG5cdC8vIGhlbHBlcnNcblx0KGZ1bmN0aW9uICgkKSB7XG5cdFx0JC52YWthdGEuaHRtbCA9IHtcblx0XHRcdGRpdiA6ICQoJzxkaXYgLz4nKSxcblx0XHRcdGVzY2FwZSA6IGZ1bmN0aW9uIChzdHIpIHtcblx0XHRcdFx0cmV0dXJuICQudmFrYXRhLmh0bWwuZGl2LnRleHQoc3RyKS5odG1sKCk7XG5cdFx0XHR9LFxuXHRcdFx0c3RyaXAgOiBmdW5jdGlvbiAoc3RyKSB7XG5cdFx0XHRcdHJldHVybiAkLnZha2F0YS5odG1sLmRpdi5lbXB0eSgpLmFwcGVuZCgkLnBhcnNlSFRNTChzdHIpKS50ZXh0KCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHQvLyBwcml2YXRlIHZhcmlhYmxlXG5cdFx0dmFyIHZha2F0YV9kbmQgPSB7XG5cdFx0XHRlbGVtZW50XHQ6IGZhbHNlLFxuXHRcdFx0dGFyZ2V0XHQ6IGZhbHNlLFxuXHRcdFx0aXNfZG93blx0OiBmYWxzZSxcblx0XHRcdGlzX2RyYWdcdDogZmFsc2UsXG5cdFx0XHRoZWxwZXJcdDogZmFsc2UsXG5cdFx0XHRoZWxwZXJfdzogMCxcblx0XHRcdGRhdGFcdDogZmFsc2UsXG5cdFx0XHRpbml0X3hcdDogMCxcblx0XHRcdGluaXRfeVx0OiAwLFxuXHRcdFx0c2Nyb2xsX2w6IDAsXG5cdFx0XHRzY3JvbGxfdDogMCxcblx0XHRcdHNjcm9sbF9lOiBmYWxzZSxcblx0XHRcdHNjcm9sbF9pOiBmYWxzZSxcblx0XHRcdGlzX3RvdWNoOiBmYWxzZVxuXHRcdH07XG5cdFx0JC52YWthdGEuZG5kID0ge1xuXHRcdFx0c2V0dGluZ3MgOiB7XG5cdFx0XHRcdHNjcm9sbF9zcGVlZFx0XHQ6IDEwLFxuXHRcdFx0XHRzY3JvbGxfcHJveGltaXR5XHQ6IDIwLFxuXHRcdFx0XHRoZWxwZXJfbGVmdFx0XHRcdDogNSxcblx0XHRcdFx0aGVscGVyX3RvcFx0XHRcdDogMTAsXG5cdFx0XHRcdHRocmVzaG9sZFx0XHRcdDogNSxcblx0XHRcdFx0dGhyZXNob2xkX3RvdWNoXHRcdDogMTBcblx0XHRcdH0sXG5cdFx0XHRfdHJpZ2dlciA6IGZ1bmN0aW9uIChldmVudF9uYW1lLCBlLCBkYXRhKSB7XG5cdFx0XHRcdGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRkYXRhID0gJC52YWthdGEuZG5kLl9nZXQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkYXRhLmV2ZW50ID0gZTtcblx0XHRcdFx0JChkb2N1bWVudCkudHJpZ2dlckhhbmRsZXIoXCJkbmRfXCIgKyBldmVudF9uYW1lICsgXCIudmFrYXRhXCIsIGRhdGEpO1xuXHRcdFx0fSxcblx0XHRcdF9nZXQgOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XCJkYXRhXCJcdFx0OiB2YWthdGFfZG5kLmRhdGEsXG5cdFx0XHRcdFx0XCJlbGVtZW50XCJcdDogdmFrYXRhX2RuZC5lbGVtZW50LFxuXHRcdFx0XHRcdFwiaGVscGVyXCJcdDogdmFrYXRhX2RuZC5oZWxwZXJcblx0XHRcdFx0fTtcblx0XHRcdH0sXG5cdFx0XHRfY2xlYW4gOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmKHZha2F0YV9kbmQuaGVscGVyKSB7IHZha2F0YV9kbmQuaGVscGVyLnJlbW92ZSgpOyB9XG5cdFx0XHRcdGlmKHZha2F0YV9kbmQuc2Nyb2xsX2kpIHsgY2xlYXJJbnRlcnZhbCh2YWthdGFfZG5kLnNjcm9sbF9pKTsgdmFrYXRhX2RuZC5zY3JvbGxfaSA9IGZhbHNlOyB9XG5cdFx0XHRcdHZha2F0YV9kbmQgPSB7XG5cdFx0XHRcdFx0ZWxlbWVudFx0OiBmYWxzZSxcblx0XHRcdFx0XHR0YXJnZXRcdDogZmFsc2UsXG5cdFx0XHRcdFx0aXNfZG93blx0OiBmYWxzZSxcblx0XHRcdFx0XHRpc19kcmFnXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdGhlbHBlclx0OiBmYWxzZSxcblx0XHRcdFx0XHRoZWxwZXJfdzogMCxcblx0XHRcdFx0XHRkYXRhXHQ6IGZhbHNlLFxuXHRcdFx0XHRcdGluaXRfeFx0OiAwLFxuXHRcdFx0XHRcdGluaXRfeVx0OiAwLFxuXHRcdFx0XHRcdHNjcm9sbF9sOiAwLFxuXHRcdFx0XHRcdHNjcm9sbF90OiAwLFxuXHRcdFx0XHRcdHNjcm9sbF9lOiBmYWxzZSxcblx0XHRcdFx0XHRzY3JvbGxfaTogZmFsc2UsXG5cdFx0XHRcdFx0aXNfdG91Y2g6IGZhbHNlXG5cdFx0XHRcdH07XG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9mZihcIm1vdXNlbW92ZS52YWthdGEuanN0cmVlIHRvdWNobW92ZS52YWthdGEuanN0cmVlXCIsICQudmFrYXRhLmRuZC5kcmFnKTtcblx0XHRcdFx0JChkb2N1bWVudCkub2ZmKFwibW91c2V1cC52YWthdGEuanN0cmVlIHRvdWNoZW5kLnZha2F0YS5qc3RyZWVcIiwgJC52YWthdGEuZG5kLnN0b3ApO1xuXHRcdFx0fSxcblx0XHRcdF9zY3JvbGwgOiBmdW5jdGlvbiAoaW5pdF9vbmx5KSB7XG5cdFx0XHRcdGlmKCF2YWthdGFfZG5kLnNjcm9sbF9lIHx8ICghdmFrYXRhX2RuZC5zY3JvbGxfbCAmJiAhdmFrYXRhX2RuZC5zY3JvbGxfdCkpIHtcblx0XHRcdFx0XHRpZih2YWthdGFfZG5kLnNjcm9sbF9pKSB7IGNsZWFySW50ZXJ2YWwodmFrYXRhX2RuZC5zY3JvbGxfaSk7IHZha2F0YV9kbmQuc2Nyb2xsX2kgPSBmYWxzZTsgfVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighdmFrYXRhX2RuZC5zY3JvbGxfaSkge1xuXHRcdFx0XHRcdHZha2F0YV9kbmQuc2Nyb2xsX2kgPSBzZXRJbnRlcnZhbCgkLnZha2F0YS5kbmQuX3Njcm9sbCwgMTAwKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaW5pdF9vbmx5ID09PSB0cnVlKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0XHRcdHZhciBpID0gdmFrYXRhX2RuZC5zY3JvbGxfZS5zY3JvbGxUb3AoKSxcblx0XHRcdFx0XHRqID0gdmFrYXRhX2RuZC5zY3JvbGxfZS5zY3JvbGxMZWZ0KCk7XG5cdFx0XHRcdHZha2F0YV9kbmQuc2Nyb2xsX2Uuc2Nyb2xsVG9wKGkgKyB2YWthdGFfZG5kLnNjcm9sbF90ICogJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9zcGVlZCk7XG5cdFx0XHRcdHZha2F0YV9kbmQuc2Nyb2xsX2Uuc2Nyb2xsTGVmdChqICsgdmFrYXRhX2RuZC5zY3JvbGxfbCAqICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfc3BlZWQpO1xuXHRcdFx0XHRpZihpICE9PSB2YWthdGFfZG5kLnNjcm9sbF9lLnNjcm9sbFRvcCgpIHx8IGogIT09IHZha2F0YV9kbmQuc2Nyb2xsX2Uuc2Nyb2xsTGVmdCgpKSB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogdHJpZ2dlcmVkIG9uIHRoZSBkb2N1bWVudCB3aGVuIGEgZHJhZyBjYXVzZXMgYW4gZWxlbWVudCB0byBzY3JvbGxcblx0XHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0XHQgKiBAcGx1Z2luIGRuZFxuXHRcdFx0XHRcdCAqIEBuYW1lIGRuZF9zY3JvbGwudmFrYXRhXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtNaXhlZH0gZGF0YSBhbnkgZGF0YSBzdXBwbGllZCB3aXRoIHRoZSBjYWxsIHRvICQudmFrYXRhLmRuZC5zdGFydFxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7RE9NfSBlbGVtZW50IHRoZSBET00gZWxlbWVudCBiZWluZyBkcmFnZ2VkXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IGhlbHBlciB0aGUgaGVscGVyIHNob3duIG5leHQgdG8gdGhlIG1vdXNlXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IGV2ZW50IHRoZSBlbGVtZW50IHRoYXQgaXMgc2Nyb2xsaW5nXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0JC52YWthdGEuZG5kLl90cmlnZ2VyKFwic2Nyb2xsXCIsIHZha2F0YV9kbmQuc2Nyb2xsX2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c3RhcnQgOiBmdW5jdGlvbiAoZSwgZGF0YSwgaHRtbCkge1xuXHRcdFx0XHRpZihlLnR5cGUgPT09IFwidG91Y2hzdGFydFwiICYmIGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMgJiYgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKSB7XG5cdFx0XHRcdFx0ZS5wYWdlWCA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcblx0XHRcdFx0XHRlLnBhZ2VZID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xuXHRcdFx0XHRcdGUudGFyZ2V0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3cucGFnZVhPZmZzZXQsIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvdy5wYWdlWU9mZnNldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYodmFrYXRhX2RuZC5pc19kcmFnKSB7ICQudmFrYXRhLmRuZC5zdG9wKHt9KTsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGUuY3VycmVudFRhcmdldC51bnNlbGVjdGFibGUgPSBcIm9uXCI7XG5cdFx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0Lm9uc2VsZWN0c3RhcnQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlOyB9O1xuXHRcdFx0XHRcdGlmKGUuY3VycmVudFRhcmdldC5zdHlsZSkge1xuXHRcdFx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0LnN0eWxlLnRvdWNoQWN0aW9uID0gXCJub25lXCI7XG5cdFx0XHRcdFx0XHRlLmN1cnJlbnRUYXJnZXQuc3R5bGUubXNUb3VjaEFjdGlvbiA9IFwibm9uZVwiO1xuXHRcdFx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0LnN0eWxlLk1velVzZXJTZWxlY3QgPSBcIm5vbmVcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2goaWdub3JlKSB7IH1cblx0XHRcdFx0dmFrYXRhX2RuZC5pbml0X3hcdD0gZS5wYWdlWDtcblx0XHRcdFx0dmFrYXRhX2RuZC5pbml0X3lcdD0gZS5wYWdlWTtcblx0XHRcdFx0dmFrYXRhX2RuZC5kYXRhXHRcdD0gZGF0YTtcblx0XHRcdFx0dmFrYXRhX2RuZC5pc19kb3duXHQ9IHRydWU7XG5cdFx0XHRcdHZha2F0YV9kbmQuZWxlbWVudFx0PSBlLmN1cnJlbnRUYXJnZXQ7XG5cdFx0XHRcdHZha2F0YV9kbmQudGFyZ2V0XHQ9IGUudGFyZ2V0O1xuXHRcdFx0XHR2YWthdGFfZG5kLmlzX3RvdWNoXHQ9IGUudHlwZSA9PT0gXCJ0b3VjaHN0YXJ0XCI7XG5cdFx0XHRcdGlmKGh0bWwgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0dmFrYXRhX2RuZC5oZWxwZXIgPSAkKFwiPGRpdiBpZD0ndmFrYXRhLWRuZCc+PC9kaXY+XCIpLmh0bWwoaHRtbCkuY3NzKHtcblx0XHRcdFx0XHRcdFwiZGlzcGxheVwiXHRcdDogXCJibG9ja1wiLFxuXHRcdFx0XHRcdFx0XCJtYXJnaW5cIlx0XHQ6IFwiMFwiLFxuXHRcdFx0XHRcdFx0XCJwYWRkaW5nXCJcdFx0OiBcIjBcIixcblx0XHRcdFx0XHRcdFwicG9zaXRpb25cIlx0XHQ6IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHRcdFwidG9wXCJcdFx0XHQ6IFwiLTIwMDBweFwiLFxuXHRcdFx0XHRcdFx0XCJsaW5lSGVpZ2h0XCJcdDogXCIxNnB4XCIsXG5cdFx0XHRcdFx0XHRcInpJbmRleFwiXHRcdDogXCIxMDAwMFwiXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JChkb2N1bWVudCkub24oXCJtb3VzZW1vdmUudmFrYXRhLmpzdHJlZSB0b3VjaG1vdmUudmFrYXRhLmpzdHJlZVwiLCAkLnZha2F0YS5kbmQuZHJhZyk7XG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9uKFwibW91c2V1cC52YWthdGEuanN0cmVlIHRvdWNoZW5kLnZha2F0YS5qc3RyZWVcIiwgJC52YWthdGEuZG5kLnN0b3ApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0ZHJhZyA6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGlmKGUudHlwZSA9PT0gXCJ0b3VjaG1vdmVcIiAmJiBlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSkge1xuXHRcdFx0XHRcdGUucGFnZVggPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG5cdFx0XHRcdFx0ZS5wYWdlWSA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcblx0XHRcdFx0XHRlLnRhcmdldCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYIC0gd2luZG93LnBhZ2VYT2Zmc2V0LCBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCF2YWthdGFfZG5kLmlzX2Rvd24pIHsgcmV0dXJuOyB9XG5cdFx0XHRcdGlmKCF2YWthdGFfZG5kLmlzX2RyYWcpIHtcblx0XHRcdFx0XHRpZihcblx0XHRcdFx0XHRcdE1hdGguYWJzKGUucGFnZVggLSB2YWthdGFfZG5kLmluaXRfeCkgPiAodmFrYXRhX2RuZC5pc190b3VjaCA/ICQudmFrYXRhLmRuZC5zZXR0aW5ncy50aHJlc2hvbGRfdG91Y2ggOiAkLnZha2F0YS5kbmQuc2V0dGluZ3MudGhyZXNob2xkKSB8fFxuXHRcdFx0XHRcdFx0TWF0aC5hYnMoZS5wYWdlWSAtIHZha2F0YV9kbmQuaW5pdF95KSA+ICh2YWthdGFfZG5kLmlzX3RvdWNoID8gJC52YWthdGEuZG5kLnNldHRpbmdzLnRocmVzaG9sZF90b3VjaCA6ICQudmFrYXRhLmRuZC5zZXR0aW5ncy50aHJlc2hvbGQpXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRpZih2YWthdGFfZG5kLmhlbHBlcikge1xuXHRcdFx0XHRcdFx0XHR2YWthdGFfZG5kLmhlbHBlci5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblx0XHRcdFx0XHRcdFx0dmFrYXRhX2RuZC5oZWxwZXJfdyA9IHZha2F0YV9kbmQuaGVscGVyLm91dGVyV2lkdGgoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZha2F0YV9kbmQuaXNfZHJhZyA9IHRydWU7XG5cdFx0XHRcdFx0XHQkKHZha2F0YV9kbmQudGFyZ2V0KS5vbmUoJ2NsaWNrLnZha2F0YScsIGZhbHNlKTtcblx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0ICogdHJpZ2dlcmVkIG9uIHRoZSBkb2N1bWVudCB3aGVuIGEgZHJhZyBzdGFydHNcblx0XHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdFx0ICogQHBsdWdpbiBkbmRcblx0XHRcdFx0XHRcdCAqIEBuYW1lIGRuZF9zdGFydC52YWthdGFcblx0XHRcdFx0XHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGRhdGEgYW55IGRhdGEgc3VwcGxpZWQgd2l0aCB0aGUgY2FsbCB0byAkLnZha2F0YS5kbmQuc3RhcnRcblx0XHRcdFx0XHRcdCAqIEBwYXJhbSB7RE9NfSBlbGVtZW50IHRoZSBET00gZWxlbWVudCBiZWluZyBkcmFnZ2VkXG5cdFx0XHRcdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gaGVscGVyIHRoZSBoZWxwZXIgc2hvd24gbmV4dCB0byB0aGUgbW91c2Vcblx0XHRcdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgZXZlbnQgdGhhdCBjYXVzZWQgdGhlIHN0YXJ0IChwcm9iYWJseSBtb3VzZW1vdmUpXG5cdFx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcihcInN0YXJ0XCIsIGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHsgcmV0dXJuOyB9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgZCAgPSBmYWxzZSwgdyAgPSBmYWxzZSxcblx0XHRcdFx0XHRkaCA9IGZhbHNlLCB3aCA9IGZhbHNlLFxuXHRcdFx0XHRcdGR3ID0gZmFsc2UsIHd3ID0gZmFsc2UsXG5cdFx0XHRcdFx0ZHQgPSBmYWxzZSwgZGwgPSBmYWxzZSxcblx0XHRcdFx0XHRodCA9IGZhbHNlLCBobCA9IGZhbHNlO1xuXG5cdFx0XHRcdHZha2F0YV9kbmQuc2Nyb2xsX3QgPSAwO1xuXHRcdFx0XHR2YWthdGFfZG5kLnNjcm9sbF9sID0gMDtcblx0XHRcdFx0dmFrYXRhX2RuZC5zY3JvbGxfZSA9IGZhbHNlO1xuXHRcdFx0XHQkKCQoZS50YXJnZXQpLnBhcmVudHNVbnRpbChcImJvZHlcIikuYWRkQmFjaygpLmdldCgpLnJldmVyc2UoKSlcblx0XHRcdFx0XHQuZmlsdGVyKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHJldHVyblx0KC9eYXV0b3xzY3JvbGwkLykudGVzdCgkKHRoaXMpLmNzcyhcIm92ZXJmbG93XCIpKSAmJlxuXHRcdFx0XHRcdFx0XHRcdCh0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMub2Zmc2V0SGVpZ2h0IHx8IHRoaXMuc2Nyb2xsV2lkdGggPiB0aGlzLm9mZnNldFdpZHRoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciB0ID0gJCh0aGlzKSwgbyA9IHQub2Zmc2V0KCk7XG5cdFx0XHRcdFx0XHRpZih0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMub2Zmc2V0SGVpZ2h0KSB7XG5cdFx0XHRcdFx0XHRcdGlmKG8udG9wICsgdC5oZWlnaHQoKSAtIGUucGFnZVkgPCAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3Byb3hpbWl0eSlcdHsgdmFrYXRhX2RuZC5zY3JvbGxfdCA9IDE7IH1cblx0XHRcdFx0XHRcdFx0aWYoZS5wYWdlWSAtIG8udG9wIDwgJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9wcm94aW1pdHkpXHRcdFx0XHR7IHZha2F0YV9kbmQuc2Nyb2xsX3QgPSAtMTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodGhpcy5zY3JvbGxXaWR0aCA+IHRoaXMub2Zmc2V0V2lkdGgpIHtcblx0XHRcdFx0XHRcdFx0aWYoby5sZWZ0ICsgdC53aWR0aCgpIC0gZS5wYWdlWCA8ICQudmFrYXRhLmRuZC5zZXR0aW5ncy5zY3JvbGxfcHJveGltaXR5KVx0eyB2YWthdGFfZG5kLnNjcm9sbF9sID0gMTsgfVxuXHRcdFx0XHRcdFx0XHRpZihlLnBhZ2VYIC0gby5sZWZ0IDwgJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9wcm94aW1pdHkpXHRcdFx0XHR7IHZha2F0YV9kbmQuc2Nyb2xsX2wgPSAtMTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodmFrYXRhX2RuZC5zY3JvbGxfdCB8fCB2YWthdGFfZG5kLnNjcm9sbF9sKSB7XG5cdFx0XHRcdFx0XHRcdHZha2F0YV9kbmQuc2Nyb2xsX2UgPSAkKHRoaXMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYoIXZha2F0YV9kbmQuc2Nyb2xsX2UpIHtcblx0XHRcdFx0XHRkICA9ICQoZG9jdW1lbnQpOyB3ID0gJCh3aW5kb3cpO1xuXHRcdFx0XHRcdGRoID0gZC5oZWlnaHQoKTsgd2ggPSB3LmhlaWdodCgpO1xuXHRcdFx0XHRcdGR3ID0gZC53aWR0aCgpOyB3dyA9IHcud2lkdGgoKTtcblx0XHRcdFx0XHRkdCA9IGQuc2Nyb2xsVG9wKCk7IGRsID0gZC5zY3JvbGxMZWZ0KCk7XG5cdFx0XHRcdFx0aWYoZGggPiB3aCAmJiBlLnBhZ2VZIC0gZHQgPCAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3Byb3hpbWl0eSlcdFx0eyB2YWthdGFfZG5kLnNjcm9sbF90ID0gLTE7ICB9XG5cdFx0XHRcdFx0aWYoZGggPiB3aCAmJiB3aCAtIChlLnBhZ2VZIC0gZHQpIDwgJC52YWthdGEuZG5kLnNldHRpbmdzLnNjcm9sbF9wcm94aW1pdHkpXHR7IHZha2F0YV9kbmQuc2Nyb2xsX3QgPSAxOyB9XG5cdFx0XHRcdFx0aWYoZHcgPiB3dyAmJiBlLnBhZ2VYIC0gZGwgPCAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3Byb3hpbWl0eSlcdFx0eyB2YWthdGFfZG5kLnNjcm9sbF9sID0gLTE7IH1cblx0XHRcdFx0XHRpZihkdyA+IHd3ICYmIHd3IC0gKGUucGFnZVggLSBkbCkgPCAkLnZha2F0YS5kbmQuc2V0dGluZ3Muc2Nyb2xsX3Byb3hpbWl0eSlcdHsgdmFrYXRhX2RuZC5zY3JvbGxfbCA9IDE7IH1cblx0XHRcdFx0XHRpZih2YWthdGFfZG5kLnNjcm9sbF90IHx8IHZha2F0YV9kbmQuc2Nyb2xsX2wpIHtcblx0XHRcdFx0XHRcdHZha2F0YV9kbmQuc2Nyb2xsX2UgPSBkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZih2YWthdGFfZG5kLnNjcm9sbF9lKSB7ICQudmFrYXRhLmRuZC5fc2Nyb2xsKHRydWUpOyB9XG5cblx0XHRcdFx0aWYodmFrYXRhX2RuZC5oZWxwZXIpIHtcblx0XHRcdFx0XHRodCA9IHBhcnNlSW50KGUucGFnZVkgKyAkLnZha2F0YS5kbmQuc2V0dGluZ3MuaGVscGVyX3RvcCwgMTApO1xuXHRcdFx0XHRcdGhsID0gcGFyc2VJbnQoZS5wYWdlWCArICQudmFrYXRhLmRuZC5zZXR0aW5ncy5oZWxwZXJfbGVmdCwgMTApO1xuXHRcdFx0XHRcdGlmKGRoICYmIGh0ICsgMjUgPiBkaCkgeyBodCA9IGRoIC0gNTA7IH1cblx0XHRcdFx0XHRpZihkdyAmJiBobCArIHZha2F0YV9kbmQuaGVscGVyX3cgPiBkdykgeyBobCA9IGR3IC0gKHZha2F0YV9kbmQuaGVscGVyX3cgKyAyKTsgfVxuXHRcdFx0XHRcdHZha2F0YV9kbmQuaGVscGVyLmNzcyh7XG5cdFx0XHRcdFx0XHRsZWZ0XHQ6IGhsICsgXCJweFwiLFxuXHRcdFx0XHRcdFx0dG9wXHRcdDogaHQgKyBcInB4XCJcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIG9uIHRoZSBkb2N1bWVudCB3aGVuIGEgZHJhZyBpcyBpbiBwcm9ncmVzc1xuXHRcdFx0XHQgKiBAZXZlbnRcblx0XHRcdFx0ICogQHBsdWdpbiBkbmRcblx0XHRcdFx0ICogQG5hbWUgZG5kX21vdmUudmFrYXRhXG5cdFx0XHRcdCAqIEBwYXJhbSB7TWl4ZWR9IGRhdGEgYW55IGRhdGEgc3VwcGxpZWQgd2l0aCB0aGUgY2FsbCB0byAkLnZha2F0YS5kbmQuc3RhcnRcblx0XHRcdFx0ICogQHBhcmFtIHtET019IGVsZW1lbnQgdGhlIERPTSBlbGVtZW50IGJlaW5nIGRyYWdnZWRcblx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IGhlbHBlciB0aGUgaGVscGVyIHNob3duIG5leHQgdG8gdGhlIG1vdXNlXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCB0aGUgZXZlbnQgdGhhdCBjYXVzZWQgdGhpcyB0byB0cmlnZ2VyIChtb3N0IGxpa2VseSBtb3VzZW1vdmUpXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHQkLnZha2F0YS5kbmQuX3RyaWdnZXIoXCJtb3ZlXCIsIGUpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0c3RvcCA6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGlmKGUudHlwZSA9PT0gXCJ0b3VjaGVuZFwiICYmIGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMgJiYgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKSB7XG5cdFx0XHRcdFx0ZS5wYWdlWCA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcblx0XHRcdFx0XHRlLnBhZ2VZID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xuXHRcdFx0XHRcdGUudGFyZ2V0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSB3aW5kb3cucGFnZVhPZmZzZXQsIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWSAtIHdpbmRvdy5wYWdlWU9mZnNldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYodmFrYXRhX2RuZC5pc19kcmFnKSB7XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogdHJpZ2dlcmVkIG9uIHRoZSBkb2N1bWVudCB3aGVuIGEgZHJhZyBzdG9wcyAodGhlIGRyYWdnZWQgZWxlbWVudCBpcyBkcm9wcGVkKVxuXHRcdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHRcdCAqIEBwbHVnaW4gZG5kXG5cdFx0XHRcdFx0ICogQG5hbWUgZG5kX3N0b3AudmFrYXRhXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtNaXhlZH0gZGF0YSBhbnkgZGF0YSBzdXBwbGllZCB3aXRoIHRoZSBjYWxsIHRvICQudmFrYXRhLmRuZC5zdGFydFxuXHRcdFx0XHRcdCAqIEBwYXJhbSB7RE9NfSBlbGVtZW50IHRoZSBET00gZWxlbWVudCBiZWluZyBkcmFnZ2VkXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IGhlbHBlciB0aGUgaGVscGVyIHNob3duIG5leHQgdG8gdGhlIG1vdXNlXG5cdFx0XHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IHRoZSBldmVudCB0aGF0IGNhdXNlZCB0aGUgc3RvcFxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGlmIChlLnRhcmdldCAhPT0gdmFrYXRhX2RuZC50YXJnZXQpIHtcblx0XHRcdFx0XHRcdCQodmFrYXRhX2RuZC50YXJnZXQpLm9mZignY2xpY2sudmFrYXRhJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQudmFrYXRhLmRuZC5fdHJpZ2dlcihcInN0b3BcIiwgZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYoZS50eXBlID09PSBcInRvdWNoZW5kXCIgJiYgZS50YXJnZXQgPT09IHZha2F0YV9kbmQudGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHR2YXIgdG8gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgJChlLnRhcmdldCkuY2xpY2soKTsgfSwgMTAwKTtcblx0XHRcdFx0XHRcdCQoZS50YXJnZXQpLm9uZSgnY2xpY2snLCBmdW5jdGlvbigpIHsgaWYodG8pIHsgY2xlYXJUaW1lb3V0KHRvKTsgfSB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0JC52YWthdGEuZG5kLl9jbGVhbigpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSgkKSk7XG5cblx0Ly8gaW5jbHVkZSB0aGUgZG5kIHBsdWdpbiBieSBkZWZhdWx0XG5cdC8vICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnMucHVzaChcImRuZFwiKTtcblxuXG4vKipcbiAqICMjIyBNYXNzbG9hZCBwbHVnaW5cbiAqXG4gKiBBZGRzIG1hc3Nsb2FkIGZ1bmN0aW9uYWxpdHkgdG8ganNUcmVlLCBzbyB0aGF0IG11bHRpcGxlIG5vZGVzIGNhbiBiZSBsb2FkZWQgaW4gYSBzaW5nbGUgcmVxdWVzdCAob25seSB1c2VmdWwgd2l0aCBsYXp5IGxvYWRpbmcpLlxuICovXG5cblx0LyoqXG5cdCAqIG1hc3Nsb2FkIGNvbmZpZ3VyYXRpb25cblx0ICpcblx0ICogSXQgaXMgcG9zc2libGUgdG8gc2V0IHRoaXMgdG8gYSBzdGFuZGFyZCBqUXVlcnktbGlrZSBBSkFYIGNvbmZpZy5cblx0ICogSW4gYWRkaXRpb24gdG8gdGhlIHN0YW5kYXJkIGpRdWVyeSBhamF4IG9wdGlvbnMgaGVyZSB5b3UgY2FuIHN1cHBseSBmdW5jdGlvbnMgZm9yIGBkYXRhYCBhbmQgYHVybGAsIHRoZSBmdW5jdGlvbnMgd2lsbCBiZSBydW4gaW4gdGhlIGN1cnJlbnQgaW5zdGFuY2UncyBzY29wZSBhbmQgYSBwYXJhbSB3aWxsIGJlIHBhc3NlZCBpbmRpY2F0aW5nIHdoaWNoIG5vZGUgSURzIG5lZWQgdG8gYmUgbG9hZGVkLCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRob3NlIGZ1bmN0aW9ucyB3aWxsIGJlIHVzZWQuXG5cdCAqXG5cdCAqIFlvdSBjYW4gYWxzbyBzZXQgdGhpcyB0byBhIGZ1bmN0aW9uLCB0aGF0IGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSB0aGUgbm9kZSBJRHMgYmVpbmcgbG9hZGVkIGFzIGFyZ3VtZW50IGFuZCBhIHNlY29uZCBwYXJhbSB3aGljaCBpcyBhIGZ1bmN0aW9uIChjYWxsYmFjaykgd2hpY2ggc2hvdWxkIGJlIGNhbGxlZCB3aXRoIHRoZSByZXN1bHQuXG5cdCAqXG5cdCAqIEJvdGggdGhlIEFKQVggYW5kIHRoZSBmdW5jdGlvbiBhcHByb2FjaCByZWx5IG9uIHRoZSBzYW1lIHJldHVybiB2YWx1ZSAtIGFuIG9iamVjdCB3aGVyZSB0aGUga2V5cyBhcmUgdGhlIG5vZGUgSURzLCBhbmQgdGhlIHZhbHVlIGlzIHRoZSBjaGlsZHJlbiBvZiB0aGF0IG5vZGUgYXMgYW4gYXJyYXkuXG5cdCAqXG5cdCAqXHR7XG5cdCAqXHRcdFwiaWQxXCIgOiBbeyBcInRleHRcIiA6IFwiQ2hpbGQgb2YgSUQxXCIsIFwiaWRcIiA6IFwiYzFcIiB9LCB7IFwidGV4dFwiIDogXCJBbm90aGVyIGNoaWxkIG9mIElEMVwiLCBcImlkXCIgOiBcImMyXCIgfV0sXG5cdCAqXHRcdFwiaWQyXCIgOiBbeyBcInRleHRcIiA6IFwiQ2hpbGQgb2YgSUQyXCIsIFwiaWRcIiA6IFwiYzNcIiB9XVxuXHQgKlx0fVxuXHQgKiBcblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMubWFzc2xvYWRcblx0ICogQHBsdWdpbiBtYXNzbG9hZFxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMubWFzc2xvYWQgPSBudWxsO1xuXHQkLmpzdHJlZS5wbHVnaW5zLm1hc3Nsb2FkID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuXHRcdFx0dGhpcy5fZGF0YS5tYXNzbG9hZCA9IHt9O1xuXHRcdFx0cGFyZW50LmluaXQuY2FsbCh0aGlzLCBlbCwgb3B0aW9ucyk7XG5cdFx0fTtcblx0XHR0aGlzLl9sb2FkX25vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCBjYWxsYmFjaywgaXNfY2FsbGJhY2ssIGZvcmNlX3JlbG9hZCkge1xuXHRcdFx0dmFyIHMgPSB0aGlzLnNldHRpbmdzLm1hc3Nsb2FkLFxuXHRcdFx0XHRub2Rlc1N0cmluZyA9IEpTT04uc3RyaW5naWZ5KG5vZGVzKSxcblx0XHRcdFx0dG9Mb2FkID0gW10sXG5cdFx0XHRcdG0gPSB0aGlzLl9tb2RlbC5kYXRhLFxuXHRcdFx0XHRpLCBqLCBkb207XG5cdFx0XHRpZiAoIWlzX2NhbGxiYWNrKSB7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IG5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdGlmKCFtW25vZGVzW2ldXSB8fCAoICghbVtub2Rlc1tpXV0uc3RhdGUubG9hZGVkICYmICFtW25vZGVzW2ldXS5zdGF0ZS5mYWlsZWQpIHx8IGZvcmNlX3JlbG9hZCkgKSB7XG5cdFx0XHRcdFx0XHR0b0xvYWQucHVzaChub2Rlc1tpXSk7XG5cdFx0XHRcdFx0XHRkb20gPSB0aGlzLmdldF9ub2RlKG5vZGVzW2ldLCB0cnVlKTtcblx0XHRcdFx0XHRcdGlmIChkb20gJiYgZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRkb20uYWRkQ2xhc3MoXCJqc3RyZWUtbG9hZGluZ1wiKS5hdHRyKCdhcmlhLWJ1c3knLHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9kYXRhLm1hc3Nsb2FkID0ge307XG5cdFx0XHRcdGlmICh0b0xvYWQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYoJC5pc0Z1bmN0aW9uKHMpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcy5jYWxsKHRoaXMsIHRvTG9hZCwgJC5wcm94eShmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgaSwgajtcblx0XHRcdFx0XHRcdFx0aWYoZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdGZvcihpIGluIGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGRhdGEuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5tYXNzbG9hZFtpXSA9IGRhdGFbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IG5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUobm9kZXNbaV0sIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkb20gJiYgZG9tLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKFwianN0cmVlLWxvYWRpbmdcIikuYXR0cignYXJpYS1idXN5JyxmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHBhcmVudC5fbG9hZF9ub2Rlcy5jYWxsKHRoaXMsIG5vZGVzLCBjYWxsYmFjaywgaXNfY2FsbGJhY2ssIGZvcmNlX3JlbG9hZCk7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHR5cGVvZiBzID09PSAnb2JqZWN0JyAmJiBzICYmIHMudXJsKSB7XG5cdFx0XHRcdFx0XHRzID0gJC5leHRlbmQodHJ1ZSwge30sIHMpO1xuXHRcdFx0XHRcdFx0aWYoJC5pc0Z1bmN0aW9uKHMudXJsKSkge1xuXHRcdFx0XHRcdFx0XHRzLnVybCA9IHMudXJsLmNhbGwodGhpcywgdG9Mb2FkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKCQuaXNGdW5jdGlvbihzLmRhdGEpKSB7XG5cdFx0XHRcdFx0XHRcdHMuZGF0YSA9IHMuZGF0YS5jYWxsKHRoaXMsIHRvTG9hZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gJC5hamF4KHMpXG5cdFx0XHRcdFx0XHRcdC5kb25lKCQucHJveHkoZnVuY3Rpb24gKGRhdGEsdCx4KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgaSwgajtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGRhdGEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgaW4gZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKGRhdGEuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEubWFzc2xvYWRbaV0gPSBkYXRhW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gbm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUobm9kZXNbaV0sIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZG9tICYmIGRvbS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkb20ucmVtb3ZlQ2xhc3MoXCJqc3RyZWUtbG9hZGluZ1wiKS5hdHRyKCdhcmlhLWJ1c3knLGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyZW50Ll9sb2FkX25vZGVzLmNhbGwodGhpcywgbm9kZXMsIGNhbGxiYWNrLCBpc19jYWxsYmFjaywgZm9yY2VfcmVsb2FkKTtcblx0XHRcdFx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0XHRcdFx0LmZhaWwoJC5wcm94eShmdW5jdGlvbiAoZikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cGFyZW50Ll9sb2FkX25vZGVzLmNhbGwodGhpcywgbm9kZXMsIGNhbGxiYWNrLCBpc19jYWxsYmFjaywgZm9yY2VfcmVsb2FkKTtcblx0XHRcdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcGFyZW50Ll9sb2FkX25vZGVzLmNhbGwodGhpcywgbm9kZXMsIGNhbGxiYWNrLCBpc19jYWxsYmFjaywgZm9yY2VfcmVsb2FkKTtcblx0XHR9O1xuXHRcdHRoaXMuX2xvYWRfbm9kZSA9IGZ1bmN0aW9uIChvYmosIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgZGF0YSA9IHRoaXMuX2RhdGEubWFzc2xvYWRbb2JqLmlkXSxcblx0XHRcdFx0cnNsdCA9IG51bGwsIGRvbTtcblx0XHRcdGlmKGRhdGEpIHtcblx0XHRcdFx0cnNsdCA9IHRoaXNbdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnID8gJ19hcHBlbmRfaHRtbF9kYXRhJyA6ICdfYXBwZW5kX2pzb25fZGF0YSddKFxuXHRcdFx0XHRcdG9iaixcblx0XHRcdFx0XHR0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgPyAkKCQucGFyc2VIVE1MKGRhdGEpKS5maWx0ZXIoZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5ub2RlVHlwZSAhPT0gMzsgfSkgOiBkYXRhLFxuXHRcdFx0XHRcdGZ1bmN0aW9uIChzdGF0dXMpIHsgY2FsbGJhY2suY2FsbCh0aGlzLCBzdGF0dXMpOyB9XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGRvbSA9IHRoaXMuZ2V0X25vZGUob2JqLmlkLCB0cnVlKTtcblx0XHRcdFx0aWYgKGRvbSAmJiBkb20ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKFwianN0cmVlLWxvYWRpbmdcIikuYXR0cignYXJpYS1idXN5JyxmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGVsZXRlIHRoaXMuX2RhdGEubWFzc2xvYWRbb2JqLmlkXTtcblx0XHRcdFx0cmV0dXJuIHJzbHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcGFyZW50Ll9sb2FkX25vZGUuY2FsbCh0aGlzLCBvYmosIGNhbGxiYWNrKTtcblx0XHR9O1xuXHR9O1xuXG4vKipcbiAqICMjIyBTZWFyY2ggcGx1Z2luXG4gKlxuICogQWRkcyBzZWFyY2ggZnVuY3Rpb25hbGl0eSB0byBqc1RyZWUuXG4gKi9cblxuXHQvKipcblx0ICogc3RvcmVzIGFsbCBkZWZhdWx0cyBmb3IgdGhlIHNlYXJjaCBwbHVnaW5cblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoXG5cdCAqIEBwbHVnaW4gc2VhcmNoXG5cdCAqL1xuXHQkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2ggPSB7XG5cdFx0LyoqXG5cdFx0ICogYSBqUXVlcnktbGlrZSBBSkFYIGNvbmZpZywgd2hpY2gganN0cmVlIHVzZXMgaWYgYSBzZXJ2ZXIgc2hvdWxkIGJlIHF1ZXJpZWQgZm9yIHJlc3VsdHMuXG5cdFx0ICpcblx0XHQgKiBBIGBzdHJgICh3aGljaCBpcyB0aGUgc2VhcmNoIHN0cmluZykgcGFyYW1ldGVyIHdpbGwgYmUgYWRkZWQgd2l0aCB0aGUgcmVxdWVzdCwgYW4gb3B0aW9uYWwgYGluc2lkZWAgcGFyYW1ldGVyIHdpbGwgYmUgYWRkZWQgaWYgdGhlIHNlYXJjaCBpcyBsaW1pdGVkIHRvIGEgbm9kZSBpZC4gVGhlIGV4cGVjdGVkIHJlc3VsdCBpcyBhIEpTT04gYXJyYXkgd2l0aCBub2RlcyB0aGF0IG5lZWQgdG8gYmUgb3BlbmVkIHNvIHRoYXQgbWF0Y2hpbmcgbm9kZXMgd2lsbCBiZSByZXZlYWxlZC5cblx0XHQgKiBMZWF2ZSB0aGlzIHNldHRpbmcgYXMgYGZhbHNlYCB0byBub3QgcXVlcnkgdGhlIHNlcnZlci4gWW91IGNhbiBhbHNvIHNldCB0aGlzIHRvIGEgZnVuY3Rpb24sIHdoaWNoIHdpbGwgYmUgaW52b2tlZCBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSBhbmQgcmVjZWl2ZSAzIHBhcmFtZXRlcnMgLSB0aGUgc2VhcmNoIHN0cmluZywgdGhlIGNhbGxiYWNrIHRvIGNhbGwgd2l0aCB0aGUgYXJyYXkgb2Ygbm9kZXMgdG8gbG9hZCwgYW5kIHRoZSBvcHRpb25hbCBub2RlIElEIHRvIGxpbWl0IHRoZSBzZWFyY2ggdG9cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2guYWpheFxuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICovXG5cdFx0YWpheCA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIEluZGljYXRlcyBpZiB0aGUgc2VhcmNoIHNob3VsZCBiZSBmdXp6eSBvciBub3QgKHNob3VsZCBgY2huZDNgIG1hdGNoIGBjaGlsZCBub2RlIDNgKS4gRGVmYXVsdCBpcyBgZmFsc2VgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaC5mdXp6eVxuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICovXG5cdFx0ZnV6enkgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgdGhlIHNlYXJjaCBzaG91bGQgYmUgY2FzZSBzZW5zaXRpdmUuIERlZmF1bHQgaXMgYGZhbHNlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2guY2FzZV9zZW5zaXRpdmVcblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqL1xuXHRcdGNhc2Vfc2Vuc2l0aXZlIDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIHRoZSB0cmVlIHNob3VsZCBiZSBmaWx0ZXJlZCAoYnkgZGVmYXVsdCkgdG8gc2hvdyBvbmx5IG1hdGNoaW5nIG5vZGVzIChrZWVwIGluIG1pbmQgdGhpcyBjYW4gYmUgYSBoZWF2eSBvbiBsYXJnZSB0cmVlcyBpbiBvbGQgYnJvd3NlcnMpLlxuXHRcdCAqIFRoaXMgc2V0dGluZyBjYW4gYmUgY2hhbmdlZCBhdCBydW50aW1lIHdoZW4gY2FsbGluZyB0aGUgc2VhcmNoIG1ldGhvZC4gRGVmYXVsdCBpcyBgZmFsc2VgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaC5zaG93X29ubHlfbWF0Y2hlc1xuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICovXG5cdFx0c2hvd19vbmx5X21hdGNoZXMgOiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgaWYgdGhlIGNoaWxkcmVuIG9mIG1hdGNoZWQgZWxlbWVudCBhcmUgc2hvd24gKHdoZW4gc2hvd19vbmx5X21hdGNoZXMgaXMgdHJ1ZSlcblx0XHQgKiBUaGlzIHNldHRpbmcgY2FuIGJlIGNoYW5nZWQgYXQgcnVudGltZSB3aGVuIGNhbGxpbmcgdGhlIHNlYXJjaCBtZXRob2QuIERlZmF1bHQgaXMgYGZhbHNlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zZWFyY2guc2hvd19vbmx5X21hdGNoZXNfY2hpbGRyZW5cblx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdCAqL1xuXHRcdHNob3dfb25seV9tYXRjaGVzX2NoaWxkcmVuIDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIGFsbCBub2RlcyBvcGVuZWQgdG8gcmV2ZWFsIHRoZSBzZWFyY2ggcmVzdWx0LCBzaG91bGQgYmUgY2xvc2VkIHdoZW4gdGhlIHNlYXJjaCBpcyBjbGVhcmVkIG9yIGEgbmV3IHNlYXJjaCBpcyBwZXJmb3JtZWQuIERlZmF1bHQgaXMgYHRydWVgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnNlYXJjaC5jbG9zZV9vcGVuZWRfb25jbGVhclxuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICovXG5cdFx0Y2xvc2Vfb3BlbmVkX29uY2xlYXIgOiB0cnVlLFxuXHRcdC8qKlxuXHRcdCAqIEluZGljYXRlcyBpZiBvbmx5IGxlYWYgbm9kZXMgc2hvdWxkIGJlIGluY2x1ZGVkIGluIHNlYXJjaCByZXN1bHRzLiBEZWZhdWx0IGlzIGBmYWxzZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoLnNlYXJjaF9sZWF2ZXNfb25seVxuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICovXG5cdFx0c2VhcmNoX2xlYXZlc19vbmx5IDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogSWYgc2V0IHRvIGEgZnVuY3Rpb24gaXQgd2lsIGJlIGNhbGxlZCBpbiB0aGUgaW5zdGFuY2UncyBzY29wZSB3aXRoIHR3byBhcmd1bWVudHMgLSBzZWFyY2ggc3RyaW5nIGFuZCBub2RlICh3aGVyZSBub2RlIHdpbGwgYmUgZXZlcnkgbm9kZSBpbiB0aGUgc3RydWN0dXJlLCBzbyB1c2Ugd2l0aCBjYXV0aW9uKS5cblx0XHQgKiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyBhIHRydXRoeSB2YWx1ZSB0aGUgbm9kZSB3aWxsIGJlIGNvbnNpZGVyZWQgYSBtYXRjaCAoaXQgbWlnaHQgbm90IGJlIGRpc3BsYXllZCBpZiBzZWFyY2hfb25seV9sZWF2ZXMgaXMgc2V0IHRvIHRydWUgYW5kIHRoZSBub2RlIGlzIG5vdCBhIGxlYWYpLiBEZWZhdWx0IGlzIGBmYWxzZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc2VhcmNoLnNlYXJjaF9jYWxsYmFja1xuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICovXG5cdFx0c2VhcmNoX2NhbGxiYWNrIDogZmFsc2Vcblx0fTtcblxuXHQkLmpzdHJlZS5wbHVnaW5zLnNlYXJjaCA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR0aGlzLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYXJlbnQuYmluZC5jYWxsKHRoaXMpO1xuXG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5zdHIgPSBcIlwiO1xuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guZG9tID0gJCgpO1xuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gucmVzID0gW107XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5vcG4gPSBbXTtcblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnNvbSA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guc21jID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5oZG4gPSBbXTtcblxuXHRcdFx0dGhpcy5lbGVtZW50XG5cdFx0XHRcdC5vbihcInNlYXJjaC5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0aWYodGhpcy5fZGF0YS5zZWFyY2guc29tICYmIGRhdGEucmVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbSA9IHRoaXMuX21vZGVsLmRhdGEsIGksIGosIHAgPSBbXSwgaywgbDtcblx0XHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZGF0YS5yZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYobVtkYXRhLnJlc1tpXV0gJiYgIW1bZGF0YS5yZXNbaV1dLnN0YXRlLmhpZGRlbikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cC5wdXNoKGRhdGEucmVzW2ldKTtcblx0XHRcdFx0XHRcdFx0XHRcdHAgPSBwLmNvbmNhdChtW2RhdGEucmVzW2ldXS5wYXJlbnRzKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHRoaXMuX2RhdGEuc2VhcmNoLnNtYykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGsgPSAwLCBsID0gbVtkYXRhLnJlc1tpXV0uY2hpbGRyZW5fZC5sZW5ndGg7IGsgPCBsOyBrKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAobVttW2RhdGEucmVzW2ldXS5jaGlsZHJlbl9kW2tdXSAmJiAhbVttW2RhdGEucmVzW2ldXS5jaGlsZHJlbl9kW2tdXS5zdGF0ZS5oaWRkZW4pIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHAucHVzaChtW2RhdGEucmVzW2ldXS5jaGlsZHJlbl9kW2tdKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cCA9ICQudmFrYXRhLmFycmF5X3JlbW92ZV9pdGVtKCQudmFrYXRhLmFycmF5X3VuaXF1ZShwKSwgJC5qc3RyZWUucm9vdCk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmhkbiA9IHRoaXMuaGlkZV9hbGwodHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2hvd19ub2RlKHAsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnJlZHJhdyh0cnVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiY2xlYXJfc2VhcmNoLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRpZih0aGlzLl9kYXRhLnNlYXJjaC5zb20gJiYgZGF0YS5yZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2hvd19ub2RlKHRoaXMuX2RhdGEuc2VhcmNoLmhkbiwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMucmVkcmF3KHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHVzZWQgdG8gc2VhcmNoIHRoZSB0cmVlIG5vZGVzIGZvciBhIGdpdmVuIHN0cmluZ1xuXHRcdCAqIEBuYW1lIHNlYXJjaChzdHIgWywgc2tpcF9hc3luY10pXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHN0ciB0aGUgc2VhcmNoIHN0cmluZ1xuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gc2tpcF9hc3luYyBpZiBzZXQgdG8gdHJ1ZSBzZXJ2ZXIgd2lsbCBub3QgYmUgcXVlcmllZCBldmVuIGlmIGNvbmZpZ3VyZWRcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHNob3dfb25seV9tYXRjaGVzIGlmIHNldCB0byB0cnVlIG9ubHkgbWF0Y2hpbmcgbm9kZXMgd2lsbCBiZSBzaG93biAoa2VlcCBpbiBtaW5kIHRoaXMgY2FuIGJlIHZlcnkgc2xvdyBvbiBsYXJnZSB0cmVlcyBvciBvbGQgYnJvd3NlcnMpXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gaW5zaWRlIGFuIG9wdGlvbmFsIG5vZGUgdG8gd2hvc2UgY2hpbGRyZW4gdG8gbGltaXQgdGhlIHNlYXJjaFxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gYXBwZW5kIGlmIHNldCB0byB0cnVlIHRoZSByZXN1bHRzIG9mIHRoaXMgc2VhcmNoIGFyZSBhcHBlbmRlZCB0byB0aGUgcHJldmlvdXMgc2VhcmNoXG5cdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHQgKiBAdHJpZ2dlciBzZWFyY2guanN0cmVlXG5cdFx0ICovXG5cdFx0dGhpcy5zZWFyY2ggPSBmdW5jdGlvbiAoc3RyLCBza2lwX2FzeW5jLCBzaG93X29ubHlfbWF0Y2hlcywgaW5zaWRlLCBhcHBlbmQsIHNob3dfb25seV9tYXRjaGVzX2NoaWxkcmVuKSB7XG5cdFx0XHRpZihzdHIgPT09IGZhbHNlIHx8ICQudHJpbShzdHIudG9TdHJpbmcoKSkgPT09IFwiXCIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY2xlYXJfc2VhcmNoKCk7XG5cdFx0XHR9XG5cdFx0XHRpbnNpZGUgPSB0aGlzLmdldF9ub2RlKGluc2lkZSk7XG5cdFx0XHRpbnNpZGUgPSBpbnNpZGUgJiYgaW5zaWRlLmlkID8gaW5zaWRlLmlkIDogbnVsbDtcblx0XHRcdHN0ciA9IHN0ci50b1N0cmluZygpO1xuXHRcdFx0dmFyIHMgPSB0aGlzLnNldHRpbmdzLnNlYXJjaCxcblx0XHRcdFx0YSA9IHMuYWpheCA/IHMuYWpheCA6IGZhbHNlLFxuXHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSxcblx0XHRcdFx0ZiA9IG51bGwsXG5cdFx0XHRcdHIgPSBbXSxcblx0XHRcdFx0cCA9IFtdLCBpLCBqO1xuXHRcdFx0aWYodGhpcy5fZGF0YS5zZWFyY2gucmVzLmxlbmd0aCAmJiAhYXBwZW5kKSB7XG5cdFx0XHRcdHRoaXMuY2xlYXJfc2VhcmNoKCk7XG5cdFx0XHR9XG5cdFx0XHRpZihzaG93X29ubHlfbWF0Y2hlcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHNob3dfb25seV9tYXRjaGVzID0gcy5zaG93X29ubHlfbWF0Y2hlcztcblx0XHRcdH1cblx0XHRcdGlmKHNob3dfb25seV9tYXRjaGVzX2NoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0c2hvd19vbmx5X21hdGNoZXNfY2hpbGRyZW4gPSBzLnNob3dfb25seV9tYXRjaGVzX2NoaWxkcmVuO1xuXHRcdFx0fVxuXHRcdFx0aWYoIXNraXBfYXN5bmMgJiYgYSAhPT0gZmFsc2UpIHtcblx0XHRcdFx0aWYoJC5pc0Z1bmN0aW9uKGEpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGEuY2FsbCh0aGlzLCBzdHIsICQucHJveHkoZnVuY3Rpb24gKGQpIHtcblx0XHRcdFx0XHRcdFx0aWYoZCAmJiBkLmQpIHsgZCA9IGQuZDsgfVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9sb2FkX25vZGVzKCEkLmlzQXJyYXkoZCkgPyBbXSA6ICQudmFrYXRhLmFycmF5X3VuaXF1ZShkKSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2VhcmNoKHN0ciwgdHJ1ZSwgc2hvd19vbmx5X21hdGNoZXMsIGluc2lkZSwgYXBwZW5kLCBzaG93X29ubHlfbWF0Y2hlc19jaGlsZHJlbik7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSwgdGhpcyksIGluc2lkZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0YSA9ICQuZXh0ZW5kKHt9LCBhKTtcblx0XHRcdFx0XHRpZighYS5kYXRhKSB7IGEuZGF0YSA9IHt9OyB9XG5cdFx0XHRcdFx0YS5kYXRhLnN0ciA9IHN0cjtcblx0XHRcdFx0XHRpZihpbnNpZGUpIHtcblx0XHRcdFx0XHRcdGEuZGF0YS5pbnNpZGUgPSBpbnNpZGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLl9kYXRhLnNlYXJjaC5sYXN0UmVxdWVzdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gubGFzdFJlcXVlc3QuYWJvcnQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gubGFzdFJlcXVlc3QgPSAkLmFqYXgoYSlcblx0XHRcdFx0XHRcdC5mYWlsKCQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdhamF4JywgJ3BsdWdpbicgOiAnc2VhcmNoJywgJ2lkJyA6ICdzZWFyY2hfMDEnLCAncmVhc29uJyA6ICdDb3VsZCBub3QgbG9hZCBzZWFyY2ggcGFyZW50cycsICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KGEpIH07XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuY29yZS5lcnJvci5jYWxsKHRoaXMsIHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yKTtcblx0XHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHRcdFx0LmRvbmUoJC5wcm94eShmdW5jdGlvbiAoZCkge1xuXHRcdFx0XHRcdFx0XHRpZihkICYmIGQuZCkgeyBkID0gZC5kOyB9XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2xvYWRfbm9kZXMoISQuaXNBcnJheShkKSA/IFtdIDogJC52YWthdGEuYXJyYXlfdW5pcXVlKGQpLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zZWFyY2goc3RyLCB0cnVlLCBzaG93X29ubHlfbWF0Y2hlcywgaW5zaWRlLCBhcHBlbmQsIHNob3dfb25seV9tYXRjaGVzX2NoaWxkcmVuKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2RhdGEuc2VhcmNoLmxhc3RSZXF1ZXN0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZighYXBwZW5kKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnN0ciA9IHN0cjtcblx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guZG9tID0gJCgpO1xuXHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5yZXMgPSBbXTtcblx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gub3BuID0gW107XG5cdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnNvbSA9IHNob3dfb25seV9tYXRjaGVzO1xuXHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5zbWMgPSBzaG93X29ubHlfbWF0Y2hlc19jaGlsZHJlbjtcblx0XHRcdH1cblxuXHRcdFx0ZiA9IG5ldyAkLnZha2F0YS5zZWFyY2goc3RyLCB0cnVlLCB7IGNhc2VTZW5zaXRpdmUgOiBzLmNhc2Vfc2Vuc2l0aXZlLCBmdXp6eSA6IHMuZnV6enkgfSk7XG5cdFx0XHQkLmVhY2gobVtpbnNpZGUgPyBpbnNpZGUgOiAkLmpzdHJlZS5yb290XS5jaGlsZHJlbl9kLCBmdW5jdGlvbiAoaWksIGkpIHtcblx0XHRcdFx0dmFyIHYgPSBtW2ldO1xuXHRcdFx0XHRpZih2LnRleHQgJiYgIXYuc3RhdGUuaGlkZGVuICYmICghcy5zZWFyY2hfbGVhdmVzX29ubHkgfHwgKHYuc3RhdGUubG9hZGVkICYmIHYuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSkgJiYgKCAocy5zZWFyY2hfY2FsbGJhY2sgJiYgcy5zZWFyY2hfY2FsbGJhY2suY2FsbCh0aGlzLCBzdHIsIHYpKSB8fCAoIXMuc2VhcmNoX2NhbGxiYWNrICYmIGYuc2VhcmNoKHYudGV4dCkuaXNNYXRjaCkgKSApIHtcblx0XHRcdFx0XHRyLnB1c2goaSk7XG5cdFx0XHRcdFx0cCA9IHAuY29uY2F0KHYucGFyZW50cyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYoci5sZW5ndGgpIHtcblx0XHRcdFx0cCA9ICQudmFrYXRhLmFycmF5X3VuaXF1ZShwKTtcblx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRpZihwW2ldICE9PSAkLmpzdHJlZS5yb290ICYmIG1bcFtpXV0gJiYgdGhpcy5vcGVuX25vZGUocFtpXSwgbnVsbCwgMCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLm9wbi5wdXNoKHBbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZighYXBwZW5kKSB7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guZG9tID0gJCh0aGlzLmVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnIycgKyAkLm1hcChyLCBmdW5jdGlvbiAodikgeyByZXR1cm4gXCIwMTIzNDU2Nzg5XCIuaW5kZXhPZih2WzBdKSAhPT0gLTEgPyAnXFxcXDMnICsgdlswXSArICcgJyArIHYuc3Vic3RyKDEpLnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJykgOiB2LnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJyk7IH0pLmpvaW4oJywgIycpKSk7XG5cdFx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2gucmVzID0gcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5kb20gPSB0aGlzLl9kYXRhLnNlYXJjaC5kb20uYWRkKCQodGhpcy5lbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICsgJC5tYXAociwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIFwiMDEyMzQ1Njc4OVwiLmluZGV4T2YodlswXSkgIT09IC0xID8gJ1xcXFwzJyArIHZbMF0gKyAnICcgKyB2LnN1YnN0cigxKS5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpIDogdi5yZXBsYWNlKCQuanN0cmVlLmlkcmVnZXgsJ1xcXFwkJicpOyB9KS5qb2luKCcsICMnKSkpKTtcblx0XHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5yZXMgPSAkLnZha2F0YS5hcnJheV91bmlxdWUodGhpcy5fZGF0YS5zZWFyY2gucmVzLmNvbmNhdChyKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guZG9tLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikuYWRkQ2xhc3MoJ2pzdHJlZS1zZWFyY2gnKTtcblx0XHRcdH1cblx0XHRcdC8qKlxuXHRcdFx0ICogdHJpZ2dlcmVkIGFmdGVyIHNlYXJjaCBpcyBjb21wbGV0ZVxuXHRcdFx0ICogQGV2ZW50XG5cdFx0XHQgKiBAbmFtZSBzZWFyY2guanN0cmVlXG5cdFx0XHQgKiBAcGFyYW0ge2pRdWVyeX0gbm9kZXMgYSBqUXVlcnkgY29sbGVjdGlvbiBvZiBtYXRjaGluZyBub2Rlc1xuXHRcdFx0ICogQHBhcmFtIHtTdHJpbmd9IHN0ciB0aGUgc2VhcmNoIHN0cmluZ1xuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gcmVzIGEgY29sbGVjdGlvbiBvZiBvYmplY3RzIHJlcHJlc2VpbmcgdGhlIG1hdGNoaW5nIG5vZGVzXG5cdFx0XHQgKiBAcGx1Z2luIHNlYXJjaFxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3NlYXJjaCcsIHsgbm9kZXMgOiB0aGlzLl9kYXRhLnNlYXJjaC5kb20sIHN0ciA6IHN0ciwgcmVzIDogdGhpcy5fZGF0YS5zZWFyY2gucmVzLCBzaG93X29ubHlfbWF0Y2hlcyA6IHNob3dfb25seV9tYXRjaGVzIH0pO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogdXNlZCB0byBjbGVhciB0aGUgbGFzdCBzZWFyY2ggKHJlbW92ZXMgY2xhc3NlcyBhbmQgc2hvd3MgYWxsIG5vZGVzIGlmIGZpbHRlcmluZyBpcyBvbilcblx0XHQgKiBAbmFtZSBjbGVhcl9zZWFyY2goKVxuXHRcdCAqIEBwbHVnaW4gc2VhcmNoXG5cdFx0ICogQHRyaWdnZXIgY2xlYXJfc2VhcmNoLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHRoaXMuY2xlYXJfc2VhcmNoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy5zZWFyY2guY2xvc2Vfb3BlbmVkX29uY2xlYXIpIHtcblx0XHRcdFx0dGhpcy5jbG9zZV9ub2RlKHRoaXMuX2RhdGEuc2VhcmNoLm9wbiwgMCk7XG5cdFx0XHR9XG5cdFx0XHQvKipcblx0XHRcdCAqIHRyaWdnZXJlZCBhZnRlciBzZWFyY2ggaXMgY29tcGxldGVcblx0XHRcdCAqIEBldmVudFxuXHRcdFx0ICogQG5hbWUgY2xlYXJfc2VhcmNoLmpzdHJlZVxuXHRcdFx0ICogQHBhcmFtIHtqUXVlcnl9IG5vZGVzIGEgalF1ZXJ5IGNvbGxlY3Rpb24gb2YgbWF0Y2hpbmcgbm9kZXMgKHRoZSByZXN1bHQgZnJvbSB0aGUgbGFzdCBzZWFyY2gpXG5cdFx0XHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyIHRoZSBzZWFyY2ggc3RyaW5nICh0aGUgbGFzdCBzZWFyY2ggc3RyaW5nKVxuXHRcdFx0ICogQHBhcmFtIHtBcnJheX0gcmVzIGEgY29sbGVjdGlvbiBvZiBvYmplY3RzIHJlcHJlc2VpbmcgdGhlIG1hdGNoaW5nIG5vZGVzICh0aGUgcmVzdWx0IGZyb20gdGhlIGxhc3Qgc2VhcmNoKVxuXHRcdFx0ICogQHBsdWdpbiBzZWFyY2hcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjbGVhcl9zZWFyY2gnLCB7ICdub2RlcycgOiB0aGlzLl9kYXRhLnNlYXJjaC5kb20sIHN0ciA6IHRoaXMuX2RhdGEuc2VhcmNoLnN0ciwgcmVzIDogdGhpcy5fZGF0YS5zZWFyY2gucmVzIH0pO1xuXHRcdFx0aWYodGhpcy5fZGF0YS5zZWFyY2gucmVzLmxlbmd0aCkge1xuXHRcdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5kb20gPSAkKHRoaXMuZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yQWxsKCcjJyArICQubWFwKHRoaXMuX2RhdGEuc2VhcmNoLnJlcywgZnVuY3Rpb24gKHYpIHtcblx0XHRcdFx0XHRyZXR1cm4gXCIwMTIzNDU2Nzg5XCIuaW5kZXhPZih2WzBdKSAhPT0gLTEgPyAnXFxcXDMnICsgdlswXSArICcgJyArIHYuc3Vic3RyKDEpLnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJykgOiB2LnJlcGxhY2UoJC5qc3RyZWUuaWRyZWdleCwnXFxcXCQmJyk7XG5cdFx0XHRcdH0pLmpvaW4oJywgIycpKSk7XG5cdFx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLmRvbS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLnJlbW92ZUNsYXNzKFwianN0cmVlLXNlYXJjaFwiKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLnN0ciA9IFwiXCI7XG5cdFx0XHR0aGlzLl9kYXRhLnNlYXJjaC5yZXMgPSBbXTtcblx0XHRcdHRoaXMuX2RhdGEuc2VhcmNoLm9wbiA9IFtdO1xuXHRcdFx0dGhpcy5fZGF0YS5zZWFyY2guZG9tID0gJCgpO1xuXHRcdH07XG5cblx0XHR0aGlzLnJlZHJhd19ub2RlID0gZnVuY3Rpb24ob2JqLCBkZWVwLCBjYWxsYmFjaywgZm9yY2VfcmVuZGVyKSB7XG5cdFx0XHRvYmogPSBwYXJlbnQucmVkcmF3X25vZGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdGlmKG9iaikge1xuXHRcdFx0XHRpZigkLmluQXJyYXkob2JqLmlkLCB0aGlzLl9kYXRhLnNlYXJjaC5yZXMpICE9PSAtMSkge1xuXHRcdFx0XHRcdHZhciBpLCBqLCB0bXAgPSBudWxsO1xuXHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IG9iai5jaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYob2JqLmNoaWxkTm9kZXNbaV0gJiYgb2JqLmNoaWxkTm9kZXNbaV0uY2xhc3NOYW1lICYmIG9iai5jaGlsZE5vZGVzW2ldLmNsYXNzTmFtZS5pbmRleE9mKFwianN0cmVlLWFuY2hvclwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0dG1wID0gb2JqLmNoaWxkTm9kZXNbaV07XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZih0bXApIHtcblx0XHRcdFx0XHRcdHRtcC5jbGFzc05hbWUgKz0gJyBqc3RyZWUtc2VhcmNoJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fTtcblx0fTtcblxuXHQvLyBoZWxwZXJzXG5cdChmdW5jdGlvbiAoJCkge1xuXHRcdC8vIGZyb20gaHR0cDovL2tpcm8ubWUvcHJvamVjdHMvZnVzZS5odG1sXG5cdFx0JC52YWthdGEuc2VhcmNoID0gZnVuY3Rpb24ocGF0dGVybiwgdHh0LCBvcHRpb25zKSB7XG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0XHRcdG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJC52YWthdGEuc2VhcmNoLmRlZmF1bHRzLCBvcHRpb25zKTtcblx0XHRcdGlmKG9wdGlvbnMuZnV6enkgIT09IGZhbHNlKSB7XG5cdFx0XHRcdG9wdGlvbnMuZnV6enkgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cGF0dGVybiA9IG9wdGlvbnMuY2FzZVNlbnNpdGl2ZSA/IHBhdHRlcm4gOiBwYXR0ZXJuLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR2YXIgTUFUQ0hfTE9DQVRJT05cdD0gb3B0aW9ucy5sb2NhdGlvbixcblx0XHRcdFx0TUFUQ0hfRElTVEFOQ0VcdD0gb3B0aW9ucy5kaXN0YW5jZSxcblx0XHRcdFx0TUFUQ0hfVEhSRVNIT0xEXHQ9IG9wdGlvbnMudGhyZXNob2xkLFxuXHRcdFx0XHRwYXR0ZXJuTGVuID0gcGF0dGVybi5sZW5ndGgsXG5cdFx0XHRcdG1hdGNobWFzaywgcGF0dGVybl9hbHBoYWJldCwgbWF0Y2hfYml0YXBTY29yZSwgc2VhcmNoO1xuXHRcdFx0aWYocGF0dGVybkxlbiA+IDMyKSB7XG5cdFx0XHRcdG9wdGlvbnMuZnV6enkgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmKG9wdGlvbnMuZnV6enkpIHtcblx0XHRcdFx0bWF0Y2htYXNrID0gMSA8PCAocGF0dGVybkxlbiAtIDEpO1xuXHRcdFx0XHRwYXR0ZXJuX2FscGhhYmV0ID0gKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgbWFzayA9IHt9LFxuXHRcdFx0XHRcdFx0aSA9IDA7XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHBhdHRlcm5MZW47IGkrKykge1xuXHRcdFx0XHRcdFx0bWFza1twYXR0ZXJuLmNoYXJBdChpKV0gPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgcGF0dGVybkxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0XHRtYXNrW3BhdHRlcm4uY2hhckF0KGkpXSB8PSAxIDw8IChwYXR0ZXJuTGVuIC0gaSAtIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gbWFzaztcblx0XHRcdFx0fSgpKTtcblx0XHRcdFx0bWF0Y2hfYml0YXBTY29yZSA9IGZ1bmN0aW9uIChlLCB4KSB7XG5cdFx0XHRcdFx0dmFyIGFjY3VyYWN5ID0gZSAvIHBhdHRlcm5MZW4sXG5cdFx0XHRcdFx0XHRwcm94aW1pdHkgPSBNYXRoLmFicyhNQVRDSF9MT0NBVElPTiAtIHgpO1xuXHRcdFx0XHRcdGlmKCFNQVRDSF9ESVNUQU5DRSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHByb3hpbWl0eSA/IDEuMCA6IGFjY3VyYWN5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gYWNjdXJhY3kgKyAocHJveGltaXR5IC8gTUFUQ0hfRElTVEFOQ0UpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0c2VhcmNoID0gZnVuY3Rpb24gKHRleHQpIHtcblx0XHRcdFx0dGV4dCA9IG9wdGlvbnMuY2FzZVNlbnNpdGl2ZSA/IHRleHQgOiB0ZXh0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGlmKHBhdHRlcm4gPT09IHRleHQgfHwgdGV4dC5pbmRleE9mKHBhdHRlcm4pICE9PSAtMSkge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRpc01hdGNoOiB0cnVlLFxuXHRcdFx0XHRcdFx0c2NvcmU6IDBcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKCFvcHRpb25zLmZ1enp5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdGlzTWF0Y2g6IGZhbHNlLFxuXHRcdFx0XHRcdFx0c2NvcmU6IDFcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBpLCBqLFxuXHRcdFx0XHRcdHRleHRMZW4gPSB0ZXh0Lmxlbmd0aCxcblx0XHRcdFx0XHRzY29yZVRocmVzaG9sZCA9IE1BVENIX1RIUkVTSE9MRCxcblx0XHRcdFx0XHRiZXN0TG9jID0gdGV4dC5pbmRleE9mKHBhdHRlcm4sIE1BVENIX0xPQ0FUSU9OKSxcblx0XHRcdFx0XHRiaW5NaW4sIGJpbk1pZCxcblx0XHRcdFx0XHRiaW5NYXggPSBwYXR0ZXJuTGVuICsgdGV4dExlbixcblx0XHRcdFx0XHRsYXN0UmQsIHN0YXJ0LCBmaW5pc2gsIHJkLCBjaGFyTWF0Y2gsXG5cdFx0XHRcdFx0c2NvcmUgPSAxLFxuXHRcdFx0XHRcdGxvY2F0aW9ucyA9IFtdO1xuXHRcdFx0XHRpZiAoYmVzdExvYyAhPT0gLTEpIHtcblx0XHRcdFx0XHRzY29yZVRocmVzaG9sZCA9IE1hdGgubWluKG1hdGNoX2JpdGFwU2NvcmUoMCwgYmVzdExvYyksIHNjb3JlVGhyZXNob2xkKTtcblx0XHRcdFx0XHRiZXN0TG9jID0gdGV4dC5sYXN0SW5kZXhPZihwYXR0ZXJuLCBNQVRDSF9MT0NBVElPTiArIHBhdHRlcm5MZW4pO1xuXHRcdFx0XHRcdGlmIChiZXN0TG9jICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0c2NvcmVUaHJlc2hvbGQgPSBNYXRoLm1pbihtYXRjaF9iaXRhcFNjb3JlKDAsIGJlc3RMb2MpLCBzY29yZVRocmVzaG9sZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGJlc3RMb2MgPSAtMTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHBhdHRlcm5MZW47IGkrKykge1xuXHRcdFx0XHRcdGJpbk1pbiA9IDA7XG5cdFx0XHRcdFx0YmluTWlkID0gYmluTWF4O1xuXHRcdFx0XHRcdHdoaWxlIChiaW5NaW4gPCBiaW5NaWQpIHtcblx0XHRcdFx0XHRcdGlmIChtYXRjaF9iaXRhcFNjb3JlKGksIE1BVENIX0xPQ0FUSU9OICsgYmluTWlkKSA8PSBzY29yZVRocmVzaG9sZCkge1xuXHRcdFx0XHRcdFx0XHRiaW5NaW4gPSBiaW5NaWQ7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRiaW5NYXggPSBiaW5NaWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRiaW5NaWQgPSBNYXRoLmZsb29yKChiaW5NYXggLSBiaW5NaW4pIC8gMiArIGJpbk1pbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJpbk1heCA9IGJpbk1pZDtcblx0XHRcdFx0XHRzdGFydCA9IE1hdGgubWF4KDEsIE1BVENIX0xPQ0FUSU9OIC0gYmluTWlkICsgMSk7XG5cdFx0XHRcdFx0ZmluaXNoID0gTWF0aC5taW4oTUFUQ0hfTE9DQVRJT04gKyBiaW5NaWQsIHRleHRMZW4pICsgcGF0dGVybkxlbjtcblx0XHRcdFx0XHRyZCA9IG5ldyBBcnJheShmaW5pc2ggKyAyKTtcblx0XHRcdFx0XHRyZFtmaW5pc2ggKyAxXSA9ICgxIDw8IGkpIC0gMTtcblx0XHRcdFx0XHRmb3IgKGogPSBmaW5pc2g7IGogPj0gc3RhcnQ7IGotLSkge1xuXHRcdFx0XHRcdFx0Y2hhck1hdGNoID0gcGF0dGVybl9hbHBoYWJldFt0ZXh0LmNoYXJBdChqIC0gMSldO1xuXHRcdFx0XHRcdFx0aWYgKGkgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0cmRbal0gPSAoKHJkW2ogKyAxXSA8PCAxKSB8IDEpICYgY2hhck1hdGNoO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmRbal0gPSAoKHJkW2ogKyAxXSA8PCAxKSB8IDEpICYgY2hhck1hdGNoIHwgKCgobGFzdFJkW2ogKyAxXSB8IGxhc3RSZFtqXSkgPDwgMSkgfCAxKSB8IGxhc3RSZFtqICsgMV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAocmRbal0gJiBtYXRjaG1hc2spIHtcblx0XHRcdFx0XHRcdFx0c2NvcmUgPSBtYXRjaF9iaXRhcFNjb3JlKGksIGogLSAxKTtcblx0XHRcdFx0XHRcdFx0aWYgKHNjb3JlIDw9IHNjb3JlVGhyZXNob2xkKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcmVUaHJlc2hvbGQgPSBzY29yZTtcblx0XHRcdFx0XHRcdFx0XHRiZXN0TG9jID0gaiAtIDE7XG5cdFx0XHRcdFx0XHRcdFx0bG9jYXRpb25zLnB1c2goYmVzdExvYyk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGJlc3RMb2MgPiBNQVRDSF9MT0NBVElPTikge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhcnQgPSBNYXRoLm1heCgxLCAyICogTUFUQ0hfTE9DQVRJT04gLSBiZXN0TG9jKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChtYXRjaF9iaXRhcFNjb3JlKGkgKyAxLCBNQVRDSF9MT0NBVElPTikgPiBzY29yZVRocmVzaG9sZCkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGxhc3RSZCA9IHJkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0aXNNYXRjaDogYmVzdExvYyA+PSAwLFxuXHRcdFx0XHRcdHNjb3JlOiBzY29yZVxuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiB0eHQgPT09IHRydWUgPyB7ICdzZWFyY2gnIDogc2VhcmNoIH0gOiBzZWFyY2godHh0KTtcblx0XHR9O1xuXHRcdCQudmFrYXRhLnNlYXJjaC5kZWZhdWx0cyA9IHtcblx0XHRcdGxvY2F0aW9uIDogMCxcblx0XHRcdGRpc3RhbmNlIDogMTAwLFxuXHRcdFx0dGhyZXNob2xkIDogMC42LFxuXHRcdFx0ZnV6enkgOiBmYWxzZSxcblx0XHRcdGNhc2VTZW5zaXRpdmUgOiBmYWxzZVxuXHRcdH07XG5cdH0oJCkpO1xuXG5cdC8vIGluY2x1ZGUgdGhlIHNlYXJjaCBwbHVnaW4gYnkgZGVmYXVsdFxuXHQvLyAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zLnB1c2goXCJzZWFyY2hcIik7XG5cblxuLyoqXG4gKiAjIyMgU29ydCBwbHVnaW5cbiAqXG4gKiBBdXRvbWF0aWNhbGx5IHNvcnRzIGFsbCBzaWJsaW5ncyBpbiB0aGUgdHJlZSBhY2NvcmRpbmcgdG8gYSBzb3J0aW5nIGZ1bmN0aW9uLlxuICovXG5cblx0LyoqXG5cdCAqIHRoZSBzZXR0aW5ncyBmdW5jdGlvbiB1c2VkIHRvIHNvcnQgdGhlIG5vZGVzLlxuXHQgKiBJdCBpcyBleGVjdXRlZCBpbiB0aGUgdHJlZSdzIGNvbnRleHQsIGFjY2VwdHMgdHdvIG5vZGVzIGFzIGFyZ3VtZW50cyBhbmQgc2hvdWxkIHJldHVybiBgMWAgb3IgYC0xYC5cblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc29ydFxuXHQgKiBAcGx1Z2luIHNvcnRcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLnNvcnQgPSBmdW5jdGlvbiAoYSwgYikge1xuXHRcdC8vcmV0dXJuIHRoaXMuZ2V0X3R5cGUoYSkgPT09IHRoaXMuZ2V0X3R5cGUoYikgPyAodGhpcy5nZXRfdGV4dChhKSA+IHRoaXMuZ2V0X3RleHQoYikgPyAxIDogLTEpIDogdGhpcy5nZXRfdHlwZShhKSA+PSB0aGlzLmdldF90eXBlKGIpO1xuXHRcdHJldHVybiB0aGlzLmdldF90ZXh0KGEpID4gdGhpcy5nZXRfdGV4dChiKSA/IDEgOiAtMTtcblx0fTtcblx0JC5qc3RyZWUucGx1Z2lucy5zb3J0ID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuYmluZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHBhcmVudC5iaW5kLmNhbGwodGhpcyk7XG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0Lm9uKFwibW9kZWwuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdHRoaXMuc29ydChkYXRhLnBhcmVudCwgdHJ1ZSk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcInJlbmFtZV9ub2RlLmpzdHJlZSBjcmVhdGVfbm9kZS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zb3J0KGRhdGEucGFyZW50IHx8IGRhdGEubm9kZS5wYXJlbnQsIGZhbHNlKTtcblx0XHRcdFx0XHRcdHRoaXMucmVkcmF3X25vZGUoZGF0YS5wYXJlbnQgfHwgZGF0YS5ub2RlLnBhcmVudCwgdHJ1ZSk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcIm1vdmVfbm9kZS5qc3RyZWUgY29weV9ub2RlLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNvcnQoZGF0YS5wYXJlbnQsIGZhbHNlKTtcblx0XHRcdFx0XHRcdHRoaXMucmVkcmF3X25vZGUoZGF0YS5wYXJlbnQsIHRydWUpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHVzZWQgdG8gc29ydCBhIG5vZGUncyBjaGlsZHJlblxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG5hbWUgc29ydChvYmogWywgZGVlcF0pXG5cdFx0ICogQHBhcmFtICB7bWl4ZWR9IG9iaiB0aGUgbm9kZVxuXHRcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVlcCBpZiBzZXQgdG8gYHRydWVgIG5vZGVzIGFyZSBzb3J0ZWQgcmVjdXJzaXZlbHkuXG5cdFx0ICogQHBsdWdpbiBzb3J0XG5cdFx0ICogQHRyaWdnZXIgc2VhcmNoLmpzdHJlZVxuXHRcdCAqL1xuXHRcdHRoaXMuc29ydCA9IGZ1bmN0aW9uIChvYmosIGRlZXApIHtcblx0XHRcdHZhciBpLCBqO1xuXHRcdFx0b2JqID0gdGhpcy5nZXRfbm9kZShvYmopO1xuXHRcdFx0aWYob2JqICYmIG9iai5jaGlsZHJlbiAmJiBvYmouY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdG9iai5jaGlsZHJlbi5zb3J0KCQucHJveHkodGhpcy5zZXR0aW5ncy5zb3J0LCB0aGlzKSk7XG5cdFx0XHRcdGlmKGRlZXApIHtcblx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdHRoaXMuc29ydChvYmouY2hpbGRyZW5fZFtpXSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH07XG5cblx0Ly8gaW5jbHVkZSB0aGUgc29ydCBwbHVnaW4gYnkgZGVmYXVsdFxuXHQvLyAkLmpzdHJlZS5kZWZhdWx0cy5wbHVnaW5zLnB1c2goXCJzb3J0XCIpO1xuXG4vKipcbiAqICMjIyBTdGF0ZSBwbHVnaW5cbiAqXG4gKiBTYXZlcyB0aGUgc3RhdGUgb2YgdGhlIHRyZWUgKHNlbGVjdGVkIG5vZGVzLCBvcGVuZWQgbm9kZXMpIG9uIHRoZSB1c2VyJ3MgY29tcHV0ZXIgdXNpbmcgYXZhaWxhYmxlIG9wdGlvbnMgKGxvY2FsU3RvcmFnZSwgY29va2llcywgZXRjKVxuICovXG5cblx0dmFyIHRvID0gZmFsc2U7XG5cdC8qKlxuXHQgKiBzdG9yZXMgYWxsIGRlZmF1bHRzIGZvciB0aGUgc3RhdGUgcGx1Z2luXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnN0YXRlXG5cdCAqIEBwbHVnaW4gc3RhdGVcblx0ICovXG5cdCQuanN0cmVlLmRlZmF1bHRzLnN0YXRlID0ge1xuXHRcdC8qKlxuXHRcdCAqIEEgc3RyaW5nIGZvciB0aGUga2V5IHRvIHVzZSB3aGVuIHNhdmluZyB0aGUgY3VycmVudCB0cmVlIChjaGFuZ2UgaWYgdXNpbmcgbXVsdGlwbGUgdHJlZXMgaW4geW91ciBwcm9qZWN0KS4gRGVmYXVsdHMgdG8gYGpzdHJlZWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc3RhdGUua2V5XG5cdFx0ICogQHBsdWdpbiBzdGF0ZVxuXHRcdCAqL1xuXHRcdGtleVx0XHQ6ICdqc3RyZWUnLFxuXHRcdC8qKlxuXHRcdCAqIEEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgZXZlbnRzIHRoYXQgdHJpZ2dlciBhIHN0YXRlIHNhdmUuIERlZmF1bHRzIHRvIGBjaGFuZ2VkLmpzdHJlZSBvcGVuX25vZGUuanN0cmVlIGNsb3NlX25vZGUuanN0cmVlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy5zdGF0ZS5ldmVudHNcblx0XHQgKiBAcGx1Z2luIHN0YXRlXG5cdFx0ICovXG5cdFx0ZXZlbnRzXHQ6ICdjaGFuZ2VkLmpzdHJlZSBvcGVuX25vZGUuanN0cmVlIGNsb3NlX25vZGUuanN0cmVlIGNoZWNrX25vZGUuanN0cmVlIHVuY2hlY2tfbm9kZS5qc3RyZWUnLFxuXHRcdC8qKlxuXHRcdCAqIFRpbWUgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSBzdGF0ZSB3aWxsIGV4cGlyZS4gRGVmYXVsdHMgdG8gJ2ZhbHNlJyBtZWFuaW5nIC0gbm8gZXhwaXJlLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnN0YXRlLnR0bFxuXHRcdCAqIEBwbHVnaW4gc3RhdGVcblx0XHQgKi9cblx0XHR0dGxcdFx0OiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBwcmlvciB0byByZXN0b3Jpbmcgc3RhdGUgd2l0aCBvbmUgYXJndW1lbnQgLSB0aGUgc3RhdGUgb2JqZWN0LiBDYW4gYmUgdXNlZCB0byBjbGVhciB1bndhbnRlZCBwYXJ0cyBvZiB0aGUgc3RhdGUuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMuc3RhdGUuZmlsdGVyXG5cdFx0ICogQHBsdWdpbiBzdGF0ZVxuXHRcdCAqL1xuXHRcdGZpbHRlclx0OiBmYWxzZSxcblx0XHQvKipcblx0XHQgKiBTaG91bGQgbG9hZGVkIG5vZGVzIGJlIHJlc3RvcmVkIChzZXR0aW5nIHRoaXMgdG8gdHJ1ZSBtZWFucyB0aGF0IGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIHdob2xlIHRyZWUgd2lsbCBiZSBsb2FkZWQgZm9yIHNvbWUgdXNlcnMgLSB1c2Ugd2l0aCBjYXV0aW9uKS4gRGVmYXVsdHMgdG8gYGZhbHNlYFxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnN0YXRlLnByZXNlcnZlX2xvYWRlZFxuXHRcdCAqIEBwbHVnaW4gc3RhdGVcblx0XHQgKi9cblx0XHRwcmVzZXJ2ZV9sb2FkZWQgOiBmYWxzZVxuXHR9O1xuXHQkLmpzdHJlZS5wbHVnaW5zLnN0YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuYmluZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHBhcmVudC5iaW5kLmNhbGwodGhpcyk7XG5cdFx0XHR2YXIgYmluZCA9ICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQub24odGhpcy5zZXR0aW5ncy5zdGF0ZS5ldmVudHMsICQucHJveHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKHRvKSB7IGNsZWFyVGltZW91dCh0byk7IH1cblx0XHRcdFx0XHR0byA9IHNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbiAoKSB7IHRoaXMuc2F2ZV9zdGF0ZSgpOyB9LCB0aGlzKSwgMTAwKTtcblx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogdHJpZ2dlcmVkIHdoZW4gdGhlIHN0YXRlIHBsdWdpbiBpcyBmaW5pc2hlZCByZXN0b3JpbmcgdGhlIHN0YXRlIChhbmQgaW1tZWRpYXRlbHkgYWZ0ZXIgcmVhZHkgaWYgdGhlcmUgaXMgbm8gc3RhdGUgdG8gcmVzdG9yZSkuXG5cdFx0XHRcdCAqIEBldmVudFxuXHRcdFx0XHQgKiBAbmFtZSBzdGF0ZV9yZWFkeS5qc3RyZWVcblx0XHRcdFx0ICogQHBsdWdpbiBzdGF0ZVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdzdGF0ZV9yZWFkeScpO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0Lm9uKFwicmVhZHkuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5vbmUoXCJyZXN0b3JlX3N0YXRlLmpzdHJlZVwiLCBiaW5kKTtcblx0XHRcdFx0XHRcdGlmKCF0aGlzLnJlc3RvcmVfc3RhdGUoKSkgeyBiaW5kKCk7IH1cblx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0fTtcblx0XHQvKipcblx0XHQgKiBzYXZlIHRoZSBzdGF0ZVxuXHRcdCAqIEBuYW1lIHNhdmVfc3RhdGUoKVxuXHRcdCAqIEBwbHVnaW4gc3RhdGVcblx0XHQgKi9cblx0XHR0aGlzLnNhdmVfc3RhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgdG0gPSB0aGlzLmdldF9zdGF0ZSgpO1xuXHRcdFx0aWYgKCF0aGlzLnNldHRpbmdzLnN0YXRlLnByZXNlcnZlX2xvYWRlZCkge1xuXHRcdFx0XHRkZWxldGUgdG0uY29yZS5sb2FkZWQ7XG5cdFx0XHR9XG5cdFx0XHR2YXIgc3QgPSB7ICdzdGF0ZScgOiB0bSwgJ3R0bCcgOiB0aGlzLnNldHRpbmdzLnN0YXRlLnR0bCwgJ3NlYycgOiArKG5ldyBEYXRlKCkpIH07XG5cdFx0XHQkLnZha2F0YS5zdG9yYWdlLnNldCh0aGlzLnNldHRpbmdzLnN0YXRlLmtleSwgSlNPTi5zdHJpbmdpZnkoc3QpKTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHJlc3RvcmUgdGhlIHN0YXRlIGZyb20gdGhlIHVzZXIncyBjb21wdXRlclxuXHRcdCAqIEBuYW1lIHJlc3RvcmVfc3RhdGUoKVxuXHRcdCAqIEBwbHVnaW4gc3RhdGVcblx0XHQgKi9cblx0XHR0aGlzLnJlc3RvcmVfc3RhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgayA9ICQudmFrYXRhLnN0b3JhZ2UuZ2V0KHRoaXMuc2V0dGluZ3Muc3RhdGUua2V5KTtcblx0XHRcdGlmKCEhaykgeyB0cnkgeyBrID0gSlNPTi5wYXJzZShrKTsgfSBjYXRjaChleCkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXHRcdFx0aWYoISFrICYmIGsudHRsICYmIGsuc2VjICYmICsobmV3IERhdGUoKSkgLSBrLnNlYyA+IGsudHRsKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYoISFrICYmIGsuc3RhdGUpIHsgayA9IGsuc3RhdGU7IH1cblx0XHRcdGlmKCEhayAmJiAkLmlzRnVuY3Rpb24odGhpcy5zZXR0aW5ncy5zdGF0ZS5maWx0ZXIpKSB7IGsgPSB0aGlzLnNldHRpbmdzLnN0YXRlLmZpbHRlci5jYWxsKHRoaXMsIGspOyB9XG5cdFx0XHRpZighIWspIHtcblx0XHRcdFx0aWYgKCF0aGlzLnNldHRpbmdzLnN0YXRlLnByZXNlcnZlX2xvYWRlZCkge1xuXHRcdFx0XHRcdGRlbGV0ZSBrLmNvcmUubG9hZGVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuZWxlbWVudC5vbmUoXCJzZXRfc3RhdGUuanN0cmVlXCIsIGZ1bmN0aW9uIChlLCBkYXRhKSB7IGRhdGEuaW5zdGFuY2UudHJpZ2dlcigncmVzdG9yZV9zdGF0ZScsIHsgJ3N0YXRlJyA6ICQuZXh0ZW5kKHRydWUsIHt9LCBrKSB9KTsgfSk7XG5cdFx0XHRcdHRoaXMuc2V0X3N0YXRlKGspO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIGNsZWFyIHRoZSBzdGF0ZSBvbiB0aGUgdXNlcidzIGNvbXB1dGVyXG5cdFx0ICogQG5hbWUgY2xlYXJfc3RhdGUoKVxuXHRcdCAqIEBwbHVnaW4gc3RhdGVcblx0XHQgKi9cblx0XHR0aGlzLmNsZWFyX3N0YXRlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuICQudmFrYXRhLnN0b3JhZ2UuZGVsKHRoaXMuc2V0dGluZ3Muc3RhdGUua2V5KTtcblx0XHR9O1xuXHR9O1xuXG5cdChmdW5jdGlvbiAoJCwgdW5kZWZpbmVkKSB7XG5cdFx0JC52YWthdGEuc3RvcmFnZSA9IHtcblx0XHRcdC8vIHNpbXBseSBzcGVjaWZ5aW5nIHRoZSBmdW5jdGlvbnMgaW4gRkYgdGhyb3dzIGFuIGVycm9yXG5cdFx0XHRzZXQgOiBmdW5jdGlvbiAoa2V5LCB2YWwpIHsgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbCk7IH0sXG5cdFx0XHRnZXQgOiBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTsgfSxcblx0XHRcdGRlbCA6IGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpOyB9XG5cdFx0fTtcblx0fSgkKSk7XG5cblx0Ly8gaW5jbHVkZSB0aGUgc3RhdGUgcGx1Z2luIGJ5IGRlZmF1bHRcblx0Ly8gJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2lucy5wdXNoKFwic3RhdGVcIik7XG5cbi8qKlxuICogIyMjIFR5cGVzIHBsdWdpblxuICpcbiAqIE1ha2VzIGl0IHBvc3NpYmxlIHRvIGFkZCBwcmVkZWZpbmVkIHR5cGVzIGZvciBncm91cHMgb2Ygbm9kZXMsIHdoaWNoIG1ha2UgaXQgcG9zc2libGUgdG8gZWFzaWx5IGNvbnRyb2wgbmVzdGluZyBydWxlcyBhbmQgaWNvbiBmb3IgZWFjaCBncm91cC5cbiAqL1xuXG5cdC8qKlxuXHQgKiBBbiBvYmplY3Qgc3RvcmluZyBhbGwgdHlwZXMgYXMga2V5IHZhbHVlIHBhaXJzLCB3aGVyZSB0aGUga2V5IGlzIHRoZSB0eXBlIG5hbWUgYW5kIHRoZSB2YWx1ZSBpcyBhbiBvYmplY3QgdGhhdCBjb3VsZCBjb250YWluIGZvbGxvd2luZyBrZXlzIChhbGwgb3B0aW9uYWwpLlxuXHQgKlxuXHQgKiAqIGBtYXhfY2hpbGRyZW5gIHRoZSBtYXhpbXVtIG51bWJlciBvZiBpbW1lZGlhdGUgY2hpbGRyZW4gdGhpcyBub2RlIHR5cGUgY2FuIGhhdmUuIERvIG5vdCBzcGVjaWZ5IG9yIHNldCB0byBgLTFgIGZvciB1bmxpbWl0ZWQuXG5cdCAqICogYG1heF9kZXB0aGAgdGhlIG1heGltdW0gbnVtYmVyIG9mIG5lc3RpbmcgdGhpcyBub2RlIHR5cGUgY2FuIGhhdmUuIEEgdmFsdWUgb2YgYDFgIHdvdWxkIG1lYW4gdGhhdCB0aGUgbm9kZSBjYW4gaGF2ZSBjaGlsZHJlbiwgYnV0IG5vIGdyYW5kY2hpbGRyZW4uIERvIG5vdCBzcGVjaWZ5IG9yIHNldCB0byBgLTFgIGZvciB1bmxpbWl0ZWQuXG5cdCAqICogYHZhbGlkX2NoaWxkcmVuYCBhbiBhcnJheSBvZiBub2RlIHR5cGUgc3RyaW5ncywgdGhhdCBub2RlcyBvZiB0aGlzIHR5cGUgY2FuIGhhdmUgYXMgY2hpbGRyZW4uIERvIG5vdCBzcGVjaWZ5IG9yIHNldCB0byBgLTFgIGZvciBubyBsaW1pdHMuXG5cdCAqICogYGljb25gIGEgc3RyaW5nIC0gY2FuIGJlIGEgcGF0aCB0byBhbiBpY29uIG9yIGEgY2xhc3NOYW1lLCBpZiB1c2luZyBhbiBpbWFnZSB0aGF0IGlzIGluIHRoZSBjdXJyZW50IGRpcmVjdG9yeSB1c2UgYSBgLi9gIHByZWZpeCwgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgZGV0ZWN0ZWQgYXMgYSBjbGFzcy4gT21pdCB0byB1c2UgdGhlIGRlZmF1bHQgaWNvbiBmcm9tIHlvdXIgdGhlbWUuXG5cdCAqICogYGxpX2F0dHJgIGFuIG9iamVjdCBvZiB2YWx1ZXMgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGFkZCBIVE1MIGF0dHJpYnV0ZXMgb24gdGhlIHJlc3VsdGluZyBMSSBET00gbm9kZSAobWVyZ2VkIHdpdGggdGhlIG5vZGUncyBvd24gZGF0YSlcblx0ICogKiBgYV9hdHRyYCBhbiBvYmplY3Qgb2YgdmFsdWVzIHdoaWNoIHdpbGwgYmUgdXNlZCB0byBhZGQgSFRNTCBhdHRyaWJ1dGVzIG9uIHRoZSByZXN1bHRpbmcgQSBET00gbm9kZSAobWVyZ2VkIHdpdGggdGhlIG5vZGUncyBvd24gZGF0YSlcblx0ICpcblx0ICogVGhlcmUgYXJlIHR3byBwcmVkZWZpbmVkIHR5cGVzOlxuXHQgKlxuXHQgKiAqIGAjYCByZXByZXNlbnRzIHRoZSByb290IG9mIHRoZSB0cmVlLCBmb3IgZXhhbXBsZSBgbWF4X2NoaWxkcmVuYCB3b3VsZCBjb250cm9sIHRoZSBtYXhpbXVtIG51bWJlciBvZiByb290IG5vZGVzLlxuXHQgKiAqIGBkZWZhdWx0YCByZXByZXNlbnRzIHRoZSBkZWZhdWx0IG5vZGUgLSBhbnkgc2V0dGluZ3MgaGVyZSB3aWxsIGJlIGFwcGxpZWQgdG8gYWxsIG5vZGVzIHRoYXQgZG8gbm90IGhhdmUgYSB0eXBlIHNwZWNpZmllZC5cblx0ICpcblx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMudHlwZXNcblx0ICogQHBsdWdpbiB0eXBlc1xuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMudHlwZXMgPSB7XG5cdFx0J2RlZmF1bHQnIDoge31cblx0fTtcblx0JC5qc3RyZWUuZGVmYXVsdHMudHlwZXNbJC5qc3RyZWUucm9vdF0gPSB7fTtcblxuXHQkLmpzdHJlZS5wbHVnaW5zLnR5cGVzID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuXHRcdFx0dmFyIGksIGo7XG5cdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMudHlwZXMgJiYgb3B0aW9ucy50eXBlc1snZGVmYXVsdCddKSB7XG5cdFx0XHRcdGZvcihpIGluIG9wdGlvbnMudHlwZXMpIHtcblx0XHRcdFx0XHRpZihpICE9PSBcImRlZmF1bHRcIiAmJiBpICE9PSAkLmpzdHJlZS5yb290ICYmIG9wdGlvbnMudHlwZXMuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRcdGZvcihqIGluIG9wdGlvbnMudHlwZXNbJ2RlZmF1bHQnXSkge1xuXHRcdFx0XHRcdFx0XHRpZihvcHRpb25zLnR5cGVzWydkZWZhdWx0J10uaGFzT3duUHJvcGVydHkoaikgJiYgb3B0aW9ucy50eXBlc1tpXVtqXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy50eXBlc1tpXVtqXSA9IG9wdGlvbnMudHlwZXNbJ2RlZmF1bHQnXVtqXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cGFyZW50LmluaXQuY2FsbCh0aGlzLCBlbCwgb3B0aW9ucyk7XG5cdFx0XHR0aGlzLl9tb2RlbC5kYXRhWyQuanN0cmVlLnJvb3RdLnR5cGUgPSAkLmpzdHJlZS5yb290O1xuXHRcdH07XG5cdFx0dGhpcy5yZWZyZXNoID0gZnVuY3Rpb24gKHNraXBfbG9hZGluZywgZm9yZ2V0X3N0YXRlKSB7XG5cdFx0XHRwYXJlbnQucmVmcmVzaC5jYWxsKHRoaXMsIHNraXBfbG9hZGluZywgZm9yZ2V0X3N0YXRlKTtcblx0XHRcdHRoaXMuX21vZGVsLmRhdGFbJC5qc3RyZWUucm9vdF0udHlwZSA9ICQuanN0cmVlLnJvb3Q7XG5cdFx0fTtcblx0XHR0aGlzLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnRcblx0XHRcdFx0Lm9uKCdtb2RlbC5qc3RyZWUnLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHR2YXIgbSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdFx0XHRcdGRwYyA9IGRhdGEubm9kZXMsXG5cdFx0XHRcdFx0XHRcdHQgPSB0aGlzLnNldHRpbmdzLnR5cGVzLFxuXHRcdFx0XHRcdFx0XHRpLCBqLCBjID0gJ2RlZmF1bHQnLCBrO1xuXHRcdFx0XHRcdFx0Zm9yKGkgPSAwLCBqID0gZHBjLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRjID0gJ2RlZmF1bHQnO1xuXHRcdFx0XHRcdFx0XHRpZihtW2RwY1tpXV0ub3JpZ2luYWwgJiYgbVtkcGNbaV1dLm9yaWdpbmFsLnR5cGUgJiYgdFttW2RwY1tpXV0ub3JpZ2luYWwudHlwZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRjID0gbVtkcGNbaV1dLm9yaWdpbmFsLnR5cGU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYobVtkcGNbaV1dLmRhdGEgJiYgbVtkcGNbaV1dLmRhdGEuanN0cmVlICYmIG1bZHBjW2ldXS5kYXRhLmpzdHJlZS50eXBlICYmIHRbbVtkcGNbaV1dLmRhdGEuanN0cmVlLnR5cGVdKSB7XG5cdFx0XHRcdFx0XHRcdFx0YyA9IG1bZHBjW2ldXS5kYXRhLmpzdHJlZS50eXBlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdG1bZHBjW2ldXS50eXBlID0gYztcblx0XHRcdFx0XHRcdFx0aWYobVtkcGNbaV1dLmljb24gPT09IHRydWUgJiYgdFtjXS5pY29uICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRtW2RwY1tpXV0uaWNvbiA9IHRbY10uaWNvbjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZih0W2NdLmxpX2F0dHIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdFtjXS5saV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0XHRcdGZvciAoayBpbiB0W2NdLmxpX2F0dHIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh0W2NdLmxpX2F0dHIuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGsgPT09ICdpZCcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChtW2RwY1tpXV0ubGlfYXR0cltrXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bVtkcGNbaV1dLmxpX2F0dHJba10gPSB0W2NdLmxpX2F0dHJba107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoayA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1bZHBjW2ldXS5saV9hdHRyWydjbGFzcyddID0gdFtjXS5saV9hdHRyWydjbGFzcyddICsgJyAnICsgbVtkcGNbaV1dLmxpX2F0dHJbJ2NsYXNzJ107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYodFtjXS5hX2F0dHIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdFtjXS5hX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChrIGluIHRbY10uYV9hdHRyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAodFtjXS5hX2F0dHIuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGsgPT09ICdpZCcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChtW2RwY1tpXV0uYV9hdHRyW2tdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtW2RwY1tpXV0uYV9hdHRyW2tdID0gdFtjXS5hX2F0dHJba107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoayA9PT0gJ2hyZWYnICYmIG1bZHBjW2ldXS5hX2F0dHJba10gPT09ICcjJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1bZHBjW2ldXS5hX2F0dHJbJ2hyZWYnXSA9IHRbY10uYV9hdHRyWydocmVmJ107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoayA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1bZHBjW2ldXS5hX2F0dHJbJ2NsYXNzJ10gPSB0W2NdLmFfYXR0clsnY2xhc3MnXSArICcgJyArIG1bZHBjW2ldXS5hX2F0dHJbJ2NsYXNzJ107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1bJC5qc3RyZWUucm9vdF0udHlwZSA9ICQuanN0cmVlLnJvb3Q7XG5cdFx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0cGFyZW50LmJpbmQuY2FsbCh0aGlzKTtcblx0XHR9O1xuXHRcdHRoaXMuZ2V0X2pzb24gPSBmdW5jdGlvbiAob2JqLCBvcHRpb25zLCBmbGF0KSB7XG5cdFx0XHR2YXIgaSwgaixcblx0XHRcdFx0bSA9IHRoaXMuX21vZGVsLmRhdGEsXG5cdFx0XHRcdG9wdCA9IG9wdGlvbnMgPyAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucywge25vX2lkOmZhbHNlfSkgOiB7fSxcblx0XHRcdFx0dG1wID0gcGFyZW50LmdldF9qc29uLmNhbGwodGhpcywgb2JqLCBvcHQsIGZsYXQpO1xuXHRcdFx0aWYodG1wID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdGlmKCQuaXNBcnJheSh0bXApKSB7XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IHRtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHR0bXBbaV0udHlwZSA9IHRtcFtpXS5pZCAmJiBtW3RtcFtpXS5pZF0gJiYgbVt0bXBbaV0uaWRdLnR5cGUgPyBtW3RtcFtpXS5pZF0udHlwZSA6IFwiZGVmYXVsdFwiO1xuXHRcdFx0XHRcdGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5ub19pZCkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHRtcFtpXS5pZDtcblx0XHRcdFx0XHRcdGlmKHRtcFtpXS5saV9hdHRyICYmIHRtcFtpXS5saV9hdHRyLmlkKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSB0bXBbaV0ubGlfYXR0ci5pZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHRtcFtpXS5hX2F0dHIgJiYgdG1wW2ldLmFfYXR0ci5pZCkge1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgdG1wW2ldLmFfYXR0ci5pZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0bXAudHlwZSA9IHRtcC5pZCAmJiBtW3RtcC5pZF0gJiYgbVt0bXAuaWRdLnR5cGUgPyBtW3RtcC5pZF0udHlwZSA6IFwiZGVmYXVsdFwiO1xuXHRcdFx0XHRpZihvcHRpb25zICYmIG9wdGlvbnMubm9faWQpIHtcblx0XHRcdFx0XHR0bXAgPSB0aGlzLl9kZWxldGVfaWRzKHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0bXA7XG5cdFx0fTtcblx0XHR0aGlzLl9kZWxldGVfaWRzID0gZnVuY3Rpb24gKHRtcCkge1xuXHRcdFx0aWYoJC5pc0FycmF5KHRtcCkpIHtcblx0XHRcdFx0Zm9yKHZhciBpID0gMCwgaiA9IHRtcC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHR0bXBbaV0gPSB0aGlzLl9kZWxldGVfaWRzKHRtcFtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRtcDtcblx0XHRcdH1cblx0XHRcdGRlbGV0ZSB0bXAuaWQ7XG5cdFx0XHRpZih0bXAubGlfYXR0ciAmJiB0bXAubGlfYXR0ci5pZCkge1xuXHRcdFx0XHRkZWxldGUgdG1wLmxpX2F0dHIuaWQ7XG5cdFx0XHR9XG5cdFx0XHRpZih0bXAuYV9hdHRyICYmIHRtcC5hX2F0dHIuaWQpIHtcblx0XHRcdFx0ZGVsZXRlIHRtcC5hX2F0dHIuaWQ7XG5cdFx0XHR9XG5cdFx0XHRpZih0bXAuY2hpbGRyZW4gJiYgJC5pc0FycmF5KHRtcC5jaGlsZHJlbikpIHtcblx0XHRcdFx0dG1wLmNoaWxkcmVuID0gdGhpcy5fZGVsZXRlX2lkcyh0bXAuY2hpbGRyZW4pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRtcDtcblx0XHR9O1xuXHRcdHRoaXMuY2hlY2sgPSBmdW5jdGlvbiAoY2hrLCBvYmosIHBhciwgcG9zLCBtb3JlKSB7XG5cdFx0XHRpZihwYXJlbnQuY2hlY2suY2FsbCh0aGlzLCBjaGssIG9iaiwgcGFyLCBwb3MsIG1vcmUpID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdG9iaiA9IG9iaiAmJiBvYmouaWQgPyBvYmogOiB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRwYXIgPSBwYXIgJiYgcGFyLmlkID8gcGFyIDogdGhpcy5nZXRfbm9kZShwYXIpO1xuXHRcdFx0dmFyIG0gPSBvYmogJiYgb2JqLmlkID8gKG1vcmUgJiYgbW9yZS5vcmlnaW4gPyBtb3JlLm9yaWdpbiA6ICQuanN0cmVlLnJlZmVyZW5jZShvYmouaWQpKSA6IG51bGwsIHRtcCwgZCwgaSwgajtcblx0XHRcdG0gPSBtICYmIG0uX21vZGVsICYmIG0uX21vZGVsLmRhdGEgPyBtLl9tb2RlbC5kYXRhIDogbnVsbDtcblx0XHRcdHN3aXRjaChjaGspIHtcblx0XHRcdFx0Y2FzZSBcImNyZWF0ZV9ub2RlXCI6XG5cdFx0XHRcdGNhc2UgXCJtb3ZlX25vZGVcIjpcblx0XHRcdFx0Y2FzZSBcImNvcHlfbm9kZVwiOlxuXHRcdFx0XHRcdGlmKGNoayAhPT0gJ21vdmVfbm9kZScgfHwgJC5pbkFycmF5KG9iai5pZCwgcGFyLmNoaWxkcmVuKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X3J1bGVzKHBhcik7XG5cdFx0XHRcdFx0XHRpZih0bXAubWF4X2NoaWxkcmVuICE9PSB1bmRlZmluZWQgJiYgdG1wLm1heF9jaGlsZHJlbiAhPT0gLTEgJiYgdG1wLm1heF9jaGlsZHJlbiA9PT0gcGFyLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ3R5cGVzJywgJ2lkJyA6ICd0eXBlc18wMScsICdyZWFzb24nIDogJ21heF9jaGlsZHJlbiBwcmV2ZW50cyBmdW5jdGlvbjogJyArIGNoaywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih0bXAudmFsaWRfY2hpbGRyZW4gIT09IHVuZGVmaW5lZCAmJiB0bXAudmFsaWRfY2hpbGRyZW4gIT09IC0xICYmICQuaW5BcnJheSgob2JqLnR5cGUgfHwgJ2RlZmF1bHQnKSwgdG1wLnZhbGlkX2NoaWxkcmVuKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICd0eXBlcycsICdpZCcgOiAndHlwZXNfMDInLCAncmVhc29uJyA6ICd2YWxpZF9jaGlsZHJlbiBwcmV2ZW50cyBmdW5jdGlvbjogJyArIGNoaywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihtICYmIG9iai5jaGlsZHJlbl9kICYmIG9iai5wYXJlbnRzKSB7XG5cdFx0XHRcdFx0XHRcdGQgPSAwO1xuXHRcdFx0XHRcdFx0XHRmb3IoaSA9IDAsIGogPSBvYmouY2hpbGRyZW5fZC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRkID0gTWF0aC5tYXgoZCwgbVtvYmouY2hpbGRyZW5fZFtpXV0ucGFyZW50cy5sZW5ndGgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGQgPSBkIC0gb2JqLnBhcmVudHMubGVuZ3RoICsgMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKGQgPD0gMCB8fCBkID09PSB1bmRlZmluZWQpIHsgZCA9IDE7IH1cblx0XHRcdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRcdFx0aWYodG1wLm1heF9kZXB0aCAhPT0gdW5kZWZpbmVkICYmIHRtcC5tYXhfZGVwdGggIT09IC0xICYmIHRtcC5tYXhfZGVwdGggPCBkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICd0eXBlcycsICdpZCcgOiAndHlwZXNfMDMnLCAncmVhc29uJyA6ICdtYXhfZGVwdGggcHJldmVudHMgZnVuY3Rpb246ICcgKyBjaGssICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cGFyID0gdGhpcy5nZXRfbm9kZShwYXIucGFyZW50KTtcblx0XHRcdFx0XHRcdFx0dG1wID0gdGhpcy5nZXRfcnVsZXMocGFyKTtcblx0XHRcdFx0XHRcdFx0ZCsrO1xuXHRcdFx0XHRcdFx0fSB3aGlsZShwYXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogdXNlZCB0byByZXRyaWV2ZSB0aGUgdHlwZSBzZXR0aW5ncyBvYmplY3QgZm9yIGEgbm9kZVxuXHRcdCAqIEBuYW1lIGdldF9ydWxlcyhvYmopXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGZpbmQgdGhlIHJ1bGVzIGZvclxuXHRcdCAqIEByZXR1cm4ge09iamVjdH1cblx0XHQgKiBAcGx1Z2luIHR5cGVzXG5cdFx0ICovXG5cdFx0dGhpcy5nZXRfcnVsZXMgPSBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIHRtcCA9IHRoaXMuZ2V0X3R5cGUob2JqLCB0cnVlKTtcblx0XHRcdGlmKHRtcC5tYXhfZGVwdGggPT09IHVuZGVmaW5lZCkgeyB0bXAubWF4X2RlcHRoID0gLTE7IH1cblx0XHRcdGlmKHRtcC5tYXhfY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkgeyB0bXAubWF4X2NoaWxkcmVuID0gLTE7IH1cblx0XHRcdGlmKHRtcC52YWxpZF9jaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7IHRtcC52YWxpZF9jaGlsZHJlbiA9IC0xOyB9XG5cdFx0XHRyZXR1cm4gdG1wO1xuXHRcdH07XG5cdFx0LyoqXG5cdFx0ICogdXNlZCB0byByZXRyaWV2ZSB0aGUgdHlwZSBzdHJpbmcgb3Igc2V0dGluZ3Mgb2JqZWN0IGZvciBhIG5vZGVcblx0XHQgKiBAbmFtZSBnZXRfdHlwZShvYmogWywgcnVsZXNdKVxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IG9iaiB0aGUgbm9kZSB0byBmaW5kIHRoZSBydWxlcyBmb3Jcblx0XHQgKiBAcGFyYW0ge0Jvb2xlYW59IHJ1bGVzIGlmIHNldCB0byBgdHJ1ZWAgaW5zdGVhZCBvZiBhIHN0cmluZyB0aGUgc2V0dGluZ3Mgb2JqZWN0IHdpbGwgYmUgcmV0dXJuZWRcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd8T2JqZWN0fVxuXHRcdCAqIEBwbHVnaW4gdHlwZXNcblx0XHQgKi9cblx0XHR0aGlzLmdldF90eXBlID0gZnVuY3Rpb24gKG9iaiwgcnVsZXMpIHtcblx0XHRcdG9iaiA9IHRoaXMuZ2V0X25vZGUob2JqKTtcblx0XHRcdHJldHVybiAoIW9iaikgPyBmYWxzZSA6ICggcnVsZXMgPyAkLmV4dGVuZCh7ICd0eXBlJyA6IG9iai50eXBlIH0sIHRoaXMuc2V0dGluZ3MudHlwZXNbb2JqLnR5cGVdKSA6IG9iai50eXBlKTtcblx0XHR9O1xuXHRcdC8qKlxuXHRcdCAqIHVzZWQgdG8gY2hhbmdlIGEgbm9kZSdzIHR5cGVcblx0XHQgKiBAbmFtZSBzZXRfdHlwZShvYmosIHR5cGUpXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gb2JqIHRoZSBub2RlIHRvIGNoYW5nZVxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIHRoZSBuZXcgdHlwZVxuXHRcdCAqIEBwbHVnaW4gdHlwZXNcblx0XHQgKi9cblx0XHR0aGlzLnNldF90eXBlID0gZnVuY3Rpb24gKG9iaiwgdHlwZSkge1xuXHRcdFx0dmFyIG0gPSB0aGlzLl9tb2RlbC5kYXRhLCB0LCB0MSwgdDIsIG9sZF90eXBlLCBvbGRfaWNvbiwgaywgZCwgYTtcblx0XHRcdGlmKCQuaXNBcnJheShvYmopKSB7XG5cdFx0XHRcdG9iaiA9IG9iai5zbGljZSgpO1xuXHRcdFx0XHRmb3IodDEgPSAwLCB0MiA9IG9iai5sZW5ndGg7IHQxIDwgdDI7IHQxKyspIHtcblx0XHRcdFx0XHR0aGlzLnNldF90eXBlKG9ialt0MV0sIHR5cGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0dCA9IHRoaXMuc2V0dGluZ3MudHlwZXM7XG5cdFx0XHRvYmogPSB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRpZighdFt0eXBlXSB8fCAhb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0ZCA9IHRoaXMuZ2V0X25vZGUob2JqLCB0cnVlKTtcblx0XHRcdGlmIChkICYmIGQubGVuZ3RoKSB7XG5cdFx0XHRcdGEgPSBkLmNoaWxkcmVuKCcuanN0cmVlLWFuY2hvcicpO1xuXHRcdFx0fVxuXHRcdFx0b2xkX3R5cGUgPSBvYmoudHlwZTtcblx0XHRcdG9sZF9pY29uID0gdGhpcy5nZXRfaWNvbihvYmopO1xuXHRcdFx0b2JqLnR5cGUgPSB0eXBlO1xuXHRcdFx0aWYob2xkX2ljb24gPT09IHRydWUgfHwgIXRbb2xkX3R5cGVdIHx8ICh0W29sZF90eXBlXS5pY29uICE9PSB1bmRlZmluZWQgJiYgb2xkX2ljb24gPT09IHRbb2xkX3R5cGVdLmljb24pKSB7XG5cdFx0XHRcdHRoaXMuc2V0X2ljb24ob2JqLCB0W3R5cGVdLmljb24gIT09IHVuZGVmaW5lZCA/IHRbdHlwZV0uaWNvbiA6IHRydWUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyByZW1vdmUgb2xkIHR5cGUgcHJvcHNcblx0XHRcdGlmKHRbb2xkX3R5cGVdICYmIHRbb2xkX3R5cGVdLmxpX2F0dHIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdFtvbGRfdHlwZV0ubGlfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChrIGluIHRbb2xkX3R5cGVdLmxpX2F0dHIpIHtcblx0XHRcdFx0XHRpZiAodFtvbGRfdHlwZV0ubGlfYXR0ci5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRcdFx0aWYgKGsgPT09ICdpZCcpIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChrID09PSAnY2xhc3MnKSB7XG5cdFx0XHRcdFx0XHRcdG1bb2JqLmlkXS5saV9hdHRyWydjbGFzcyddID0gKG1bb2JqLmlkXS5saV9hdHRyWydjbGFzcyddIHx8ICcnKS5yZXBsYWNlKHRbb2xkX3R5cGVdLmxpX2F0dHJba10sICcnKTtcblx0XHRcdFx0XHRcdFx0aWYgKGQpIHsgZC5yZW1vdmVDbGFzcyh0W29sZF90eXBlXS5saV9hdHRyW2tdKTsgfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAobVtvYmouaWRdLmxpX2F0dHJba10gPT09IHRbb2xkX3R5cGVdLmxpX2F0dHJba10pIHtcblx0XHRcdFx0XHRcdFx0bVtvYmouaWRdLmxpX2F0dHJba10gPSBudWxsO1xuXHRcdFx0XHRcdFx0XHRpZiAoZCkgeyBkLnJlbW92ZUF0dHIoayk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKHRbb2xkX3R5cGVdICYmIHRbb2xkX3R5cGVdLmFfYXR0ciAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0W29sZF90eXBlXS5hX2F0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAoayBpbiB0W29sZF90eXBlXS5hX2F0dHIpIHtcblx0XHRcdFx0XHRpZiAodFtvbGRfdHlwZV0uYV9hdHRyLmhhc093blByb3BlcnR5KGspKSB7XG5cdFx0XHRcdFx0XHRpZiAoayA9PT0gJ2lkJykge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKGsgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdFx0bVtvYmouaWRdLmFfYXR0clsnY2xhc3MnXSA9IChtW29iai5pZF0uYV9hdHRyWydjbGFzcyddIHx8ICcnKS5yZXBsYWNlKHRbb2xkX3R5cGVdLmFfYXR0cltrXSwgJycpO1xuXHRcdFx0XHRcdFx0XHRpZiAoYSkgeyBhLnJlbW92ZUNsYXNzKHRbb2xkX3R5cGVdLmFfYXR0cltrXSk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKG1bb2JqLmlkXS5hX2F0dHJba10gPT09IHRbb2xkX3R5cGVdLmFfYXR0cltrXSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoayA9PT0gJ2hyZWYnKSB7XG5cdFx0XHRcdFx0XHRcdFx0bVtvYmouaWRdLmFfYXR0cltrXSA9ICcjJztcblx0XHRcdFx0XHRcdFx0XHRpZiAoYSkgeyBhLmF0dHIoJ2hyZWYnLCAnIycpOyB9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIG1bb2JqLmlkXS5hX2F0dHJba107XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGEpIHsgYS5yZW1vdmVBdHRyKGspOyB9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gYWRkIG5ldyBwcm9wc1xuXHRcdFx0aWYodFt0eXBlXS5saV9hdHRyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRbdHlwZV0ubGlfYXR0ciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yIChrIGluIHRbdHlwZV0ubGlfYXR0cikge1xuXHRcdFx0XHRcdGlmICh0W3R5cGVdLmxpX2F0dHIuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0XHRcdGlmIChrID09PSAnaWQnKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAobVtvYmouaWRdLmxpX2F0dHJba10gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRtW29iai5pZF0ubGlfYXR0cltrXSA9IHRbdHlwZV0ubGlfYXR0cltrXTtcblx0XHRcdFx0XHRcdFx0aWYgKGQpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoayA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZC5hZGRDbGFzcyh0W3R5cGVdLmxpX2F0dHJba10pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGQuYXR0cihrLCB0W3R5cGVdLmxpX2F0dHJba10pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoayA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0XHRtW29iai5pZF0ubGlfYXR0clsnY2xhc3MnXSA9IHRbdHlwZV0ubGlfYXR0cltrXSArICcgJyArIG1bb2JqLmlkXS5saV9hdHRyWydjbGFzcyddO1xuXHRcdFx0XHRcdFx0XHRpZiAoZCkgeyBkLmFkZENsYXNzKHRbdHlwZV0ubGlfYXR0cltrXSk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKHRbdHlwZV0uYV9hdHRyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHRbdHlwZV0uYV9hdHRyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKGsgaW4gdFt0eXBlXS5hX2F0dHIpIHtcblx0XHRcdFx0XHRpZiAodFt0eXBlXS5hX2F0dHIuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0XHRcdGlmIChrID09PSAnaWQnKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAobVtvYmouaWRdLmFfYXR0cltrXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdG1bb2JqLmlkXS5hX2F0dHJba10gPSB0W3R5cGVdLmFfYXR0cltrXTtcblx0XHRcdFx0XHRcdFx0aWYgKGEpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoayA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0YS5hZGRDbGFzcyh0W3R5cGVdLmFfYXR0cltrXSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0YS5hdHRyKGssIHRbdHlwZV0uYV9hdHRyW2tdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKGsgPT09ICdocmVmJyAmJiBtW29iai5pZF0uYV9hdHRyW2tdID09PSAnIycpIHtcblx0XHRcdFx0XHRcdFx0bVtvYmouaWRdLmFfYXR0clsnaHJlZiddID0gdFt0eXBlXS5hX2F0dHJbJ2hyZWYnXTtcblx0XHRcdFx0XHRcdFx0aWYgKGEpIHsgYS5hdHRyKCdocmVmJywgdFt0eXBlXS5hX2F0dHJbJ2hyZWYnXSk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKGsgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0XHRcdFx0bVtvYmouaWRdLmFfYXR0clsnY2xhc3MnXSA9IHRbdHlwZV0uYV9hdHRyWydjbGFzcyddICsgJyAnICsgbVtvYmouaWRdLmFfYXR0clsnY2xhc3MnXTtcblx0XHRcdFx0XHRcdFx0aWYgKGEpIHsgYS5hZGRDbGFzcyh0W3R5cGVdLmFfYXR0cltrXSk7IH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fTtcblx0fTtcblx0Ly8gaW5jbHVkZSB0aGUgdHlwZXMgcGx1Z2luIGJ5IGRlZmF1bHRcblx0Ly8gJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2lucy5wdXNoKFwidHlwZXNcIik7XG5cblxuLyoqXG4gKiAjIyMgVW5pcXVlIHBsdWdpblxuICpcbiAqIEVuZm9yY2VzIHRoYXQgbm8gbm9kZXMgd2l0aCB0aGUgc2FtZSBuYW1lIGNhbiBjb2V4aXN0IGFzIHNpYmxpbmdzLlxuICovXG5cblx0LyoqXG5cdCAqIHN0b3JlcyBhbGwgZGVmYXVsdHMgZm9yIHRoZSB1bmlxdWUgcGx1Z2luXG5cdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnVuaXF1ZVxuXHQgKiBAcGx1Z2luIHVuaXF1ZVxuXHQgKi9cblx0JC5qc3RyZWUuZGVmYXVsdHMudW5pcXVlID0ge1xuXHRcdC8qKlxuXHRcdCAqIEluZGljYXRlcyBpZiB0aGUgY29tcGFyaXNvbiBzaG91bGQgYmUgY2FzZSBzZW5zaXRpdmUuIERlZmF1bHQgaXMgYGZhbHNlYC5cblx0XHQgKiBAbmFtZSAkLmpzdHJlZS5kZWZhdWx0cy51bmlxdWUuY2FzZV9zZW5zaXRpdmVcblx0XHQgKiBAcGx1Z2luIHVuaXF1ZVxuXHRcdCAqL1xuXHRcdGNhc2Vfc2Vuc2l0aXZlIDogZmFsc2UsXG5cdFx0LyoqXG5cdFx0ICogSW5kaWNhdGVzIGlmIHdoaXRlIHNwYWNlIHNob3VsZCBiZSB0cmltbWVkIGJlZm9yZSB0aGUgY29tcGFyaXNvbi4gRGVmYXVsdCBpcyBgZmFsc2VgLlxuXHRcdCAqIEBuYW1lICQuanN0cmVlLmRlZmF1bHRzLnVuaXF1ZS50cmltX3doaXRlc3BhY2Vcblx0XHQgKiBAcGx1Z2luIHVuaXF1ZVxuXHRcdCAqL1xuXHRcdHRyaW1fd2hpdGVzcGFjZSA6IGZhbHNlLFxuXHRcdC8qKlxuXHRcdCAqIEEgY2FsbGJhY2sgZXhlY3V0ZWQgaW4gdGhlIGluc3RhbmNlJ3Mgc2NvcGUgd2hlbiBhIG5ldyBub2RlIGlzIGNyZWF0ZWQgYW5kIHRoZSBuYW1lIGlzIGFscmVhZHkgdGFrZW4sIHRoZSB0d28gYXJndW1lbnRzIGFyZSB0aGUgY29uZmxpY3RpbmcgbmFtZSBhbmQgdGhlIGNvdW50ZXIuIFRoZSBkZWZhdWx0IHdpbGwgcHJvZHVjZSByZXN1bHRzIGxpa2UgYE5ldyBub2RlICgyKWAuXG5cdFx0ICogQG5hbWUgJC5qc3RyZWUuZGVmYXVsdHMudW5pcXVlLmR1cGxpY2F0ZVxuXHRcdCAqIEBwbHVnaW4gdW5pcXVlXG5cdFx0ICovXG5cdFx0ZHVwbGljYXRlIDogZnVuY3Rpb24gKG5hbWUsIGNvdW50ZXIpIHtcblx0XHRcdHJldHVybiBuYW1lICsgJyAoJyArIGNvdW50ZXIgKyAnKSc7XG5cdFx0fVxuXHR9O1xuXG5cdCQuanN0cmVlLnBsdWdpbnMudW5pcXVlID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuY2hlY2sgPSBmdW5jdGlvbiAoY2hrLCBvYmosIHBhciwgcG9zLCBtb3JlKSB7XG5cdFx0XHRpZihwYXJlbnQuY2hlY2suY2FsbCh0aGlzLCBjaGssIG9iaiwgcGFyLCBwb3MsIG1vcmUpID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdG9iaiA9IG9iaiAmJiBvYmouaWQgPyBvYmogOiB0aGlzLmdldF9ub2RlKG9iaik7XG5cdFx0XHRwYXIgPSBwYXIgJiYgcGFyLmlkID8gcGFyIDogdGhpcy5nZXRfbm9kZShwYXIpO1xuXHRcdFx0aWYoIXBhciB8fCAhcGFyLmNoaWxkcmVuKSB7IHJldHVybiB0cnVlOyB9XG5cdFx0XHR2YXIgbiA9IGNoayA9PT0gXCJyZW5hbWVfbm9kZVwiID8gcG9zIDogb2JqLnRleHQsXG5cdFx0XHRcdGMgPSBbXSxcblx0XHRcdFx0cyA9IHRoaXMuc2V0dGluZ3MudW5pcXVlLmNhc2Vfc2Vuc2l0aXZlLFxuXHRcdFx0XHR3ID0gdGhpcy5zZXR0aW5ncy51bmlxdWUudHJpbV93aGl0ZXNwYWNlLFxuXHRcdFx0XHRtID0gdGhpcy5fbW9kZWwuZGF0YSwgaSwgaiwgdDtcblx0XHRcdGZvcihpID0gMCwgaiA9IHBhci5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0dCA9IG1bcGFyLmNoaWxkcmVuW2ldXS50ZXh0O1xuXHRcdFx0XHRpZiAoIXMpIHtcblx0XHRcdFx0XHR0ID0gdC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh3KSB7XG5cdFx0XHRcdFx0dCA9IHQucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjLnB1c2godCk7XG5cdFx0XHR9XG5cdFx0XHRpZighcykgeyBuID0gbi50b0xvd2VyQ2FzZSgpOyB9XG5cdFx0XHRpZiAodykgeyBuID0gbi5yZXBsYWNlKC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZywgJycpOyB9XG5cdFx0XHRzd2l0Y2goY2hrKSB7XG5cdFx0XHRcdGNhc2UgXCJkZWxldGVfbm9kZVwiOlxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRjYXNlIFwicmVuYW1lX25vZGVcIjpcblx0XHRcdFx0XHR0ID0gb2JqLnRleHQgfHwgJyc7XG5cdFx0XHRcdFx0aWYgKCFzKSB7XG5cdFx0XHRcdFx0XHR0ID0gdC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodykge1xuXHRcdFx0XHRcdFx0dCA9IHQucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aSA9ICgkLmluQXJyYXkobiwgYykgPT09IC0xIHx8IChvYmoudGV4dCAmJiB0ID09PSBuKSk7XG5cdFx0XHRcdFx0aWYoIWkpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAndW5pcXVlJywgJ2lkJyA6ICd1bmlxdWVfMDEnLCAncmVhc29uJyA6ICdDaGlsZCB3aXRoIG5hbWUgJyArIG4gKyAnIGFscmVhZHkgZXhpc3RzLiBQcmV2ZW50aW5nOiAnICsgY2hrLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHRjYXNlIFwiY3JlYXRlX25vZGVcIjpcblx0XHRcdFx0XHRpID0gKCQuaW5BcnJheShuLCBjKSA9PT0gLTEpO1xuXHRcdFx0XHRcdGlmKCFpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9kYXRhLmNvcmUubGFzdF9lcnJvciA9IHsgJ2Vycm9yJyA6ICdjaGVjaycsICdwbHVnaW4nIDogJ3VuaXF1ZScsICdpZCcgOiAndW5pcXVlXzA0JywgJ3JlYXNvbicgOiAnQ2hpbGQgd2l0aCBuYW1lICcgKyBuICsgJyBhbHJlYWR5IGV4aXN0cy4gUHJldmVudGluZzogJyArIGNoaywgJ2RhdGEnIDogSlNPTi5zdHJpbmdpZnkoeyAnY2hrJyA6IGNoaywgJ3BvcycgOiBwb3MsICdvYmonIDogb2JqICYmIG9iai5pZCA/IG9iai5pZCA6IGZhbHNlLCAncGFyJyA6IHBhciAmJiBwYXIuaWQgPyBwYXIuaWQgOiBmYWxzZSB9KSB9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0Y2FzZSBcImNvcHlfbm9kZVwiOlxuXHRcdFx0XHRcdGkgPSAoJC5pbkFycmF5KG4sIGMpID09PSAtMSk7XG5cdFx0XHRcdFx0aWYoIWkpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2RhdGEuY29yZS5sYXN0X2Vycm9yID0geyAnZXJyb3InIDogJ2NoZWNrJywgJ3BsdWdpbicgOiAndW5pcXVlJywgJ2lkJyA6ICd1bmlxdWVfMDInLCAncmVhc29uJyA6ICdDaGlsZCB3aXRoIG5hbWUgJyArIG4gKyAnIGFscmVhZHkgZXhpc3RzLiBQcmV2ZW50aW5nOiAnICsgY2hrLCAnZGF0YScgOiBKU09OLnN0cmluZ2lmeSh7ICdjaGsnIDogY2hrLCAncG9zJyA6IHBvcywgJ29iaicgOiBvYmogJiYgb2JqLmlkID8gb2JqLmlkIDogZmFsc2UsICdwYXInIDogcGFyICYmIHBhci5pZCA/IHBhci5pZCA6IGZhbHNlIH0pIH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHRjYXNlIFwibW92ZV9ub2RlXCI6XG5cdFx0XHRcdFx0aSA9ICggKG9iai5wYXJlbnQgPT09IHBhci5pZCAmJiAoIW1vcmUgfHwgIW1vcmUuaXNfbXVsdGkpKSB8fCAkLmluQXJyYXkobiwgYykgPT09IC0xKTtcblx0XHRcdFx0XHRpZighaSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZGF0YS5jb3JlLmxhc3RfZXJyb3IgPSB7ICdlcnJvcicgOiAnY2hlY2snLCAncGx1Z2luJyA6ICd1bmlxdWUnLCAnaWQnIDogJ3VuaXF1ZV8wMycsICdyZWFzb24nIDogJ0NoaWxkIHdpdGggbmFtZSAnICsgbiArICcgYWxyZWFkeSBleGlzdHMuIFByZXZlbnRpbmc6ICcgKyBjaGssICdkYXRhJyA6IEpTT04uc3RyaW5naWZ5KHsgJ2NoaycgOiBjaGssICdwb3MnIDogcG9zLCAnb2JqJyA6IG9iaiAmJiBvYmouaWQgPyBvYmouaWQgOiBmYWxzZSwgJ3BhcicgOiBwYXIgJiYgcGFyLmlkID8gcGFyLmlkIDogZmFsc2UgfSkgfTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXHRcdHRoaXMuY3JlYXRlX25vZGUgPSBmdW5jdGlvbiAocGFyLCBub2RlLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQpIHtcblx0XHRcdGlmKCFub2RlIHx8IG5vZGUudGV4dCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGlmKHBhciA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHBhciA9ICQuanN0cmVlLnJvb3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0cGFyID0gdGhpcy5nZXRfbm9kZShwYXIpO1xuXHRcdFx0XHRpZighcGFyKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcmVudC5jcmVhdGVfbm9kZS5jYWxsKHRoaXMsIHBhciwgbm9kZSwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwb3MgPSBwb3MgPT09IHVuZGVmaW5lZCA/IFwibGFzdFwiIDogcG9zO1xuXHRcdFx0XHRpZighcG9zLnRvU3RyaW5nKCkubWF0Y2goL14oYmVmb3JlfGFmdGVyKSQvKSAmJiAhaXNfbG9hZGVkICYmICF0aGlzLmlzX2xvYWRlZChwYXIpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhcmVudC5jcmVhdGVfbm9kZS5jYWxsKHRoaXMsIHBhciwgbm9kZSwgcG9zLCBjYWxsYmFjaywgaXNfbG9hZGVkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZighbm9kZSkgeyBub2RlID0ge307IH1cblx0XHRcdFx0dmFyIHRtcCwgbiwgZHBjLCBpLCBqLCBtID0gdGhpcy5fbW9kZWwuZGF0YSwgcyA9IHRoaXMuc2V0dGluZ3MudW5pcXVlLmNhc2Vfc2Vuc2l0aXZlLCB3ID0gdGhpcy5zZXR0aW5ncy51bmlxdWUudHJpbV93aGl0ZXNwYWNlLCBjYiA9IHRoaXMuc2V0dGluZ3MudW5pcXVlLmR1cGxpY2F0ZSwgdDtcblx0XHRcdFx0biA9IHRtcCA9IHRoaXMuZ2V0X3N0cmluZygnTmV3IG5vZGUnKTtcblx0XHRcdFx0ZHBjID0gW107XG5cdFx0XHRcdGZvcihpID0gMCwgaiA9IHBhci5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHRcdFx0XHR0ID0gbVtwYXIuY2hpbGRyZW5baV1dLnRleHQ7XG5cdFx0XHRcdFx0aWYgKCFzKSB7XG5cdFx0XHRcdFx0XHR0ID0gdC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodykge1xuXHRcdFx0XHRcdFx0dCA9IHQucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZHBjLnB1c2godCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aSA9IDE7XG5cdFx0XHRcdHQgPSBuO1xuXHRcdFx0XHRpZiAoIXMpIHtcblx0XHRcdFx0XHR0ID0gdC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh3KSB7XG5cdFx0XHRcdFx0dCA9IHQucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR3aGlsZSgkLmluQXJyYXkodCwgZHBjKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRuID0gY2IuY2FsbCh0aGlzLCB0bXAsICgrK2kpKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdHQgPSBuO1xuXHRcdFx0XHRcdGlmICghcykge1xuXHRcdFx0XHRcdFx0dCA9IHQudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHcpIHtcblx0XHRcdFx0XHRcdHQgPSB0LnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdG5vZGUudGV4dCA9IG47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcGFyZW50LmNyZWF0ZV9ub2RlLmNhbGwodGhpcywgcGFyLCBub2RlLCBwb3MsIGNhbGxiYWNrLCBpc19sb2FkZWQpO1xuXHRcdH07XG5cdH07XG5cblx0Ly8gaW5jbHVkZSB0aGUgdW5pcXVlIHBsdWdpbiBieSBkZWZhdWx0XG5cdC8vICQuanN0cmVlLmRlZmF1bHRzLnBsdWdpbnMucHVzaChcInVuaXF1ZVwiKTtcblxuXG4vKipcbiAqICMjIyBXaG9sZXJvdyBwbHVnaW5cbiAqXG4gKiBNYWtlcyBlYWNoIG5vZGUgYXBwZWFyIGJsb2NrIGxldmVsLiBNYWtpbmcgc2VsZWN0aW9uIGVhc2llci4gTWF5IGNhdXNlIHNsb3cgZG93biBmb3IgbGFyZ2UgdHJlZXMgaW4gb2xkIGJyb3dzZXJzLlxuICovXG5cblx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuXHRkaXYuc2V0QXR0cmlidXRlKCd1bnNlbGVjdGFibGUnLCdvbicpO1xuXHRkaXYuc2V0QXR0cmlidXRlKCdyb2xlJywncHJlc2VudGF0aW9uJyk7XG5cdGRpdi5jbGFzc05hbWUgPSAnanN0cmVlLXdob2xlcm93Jztcblx0ZGl2LmlubmVySFRNTCA9ICcmIzE2MDsnO1xuXHQkLmpzdHJlZS5wbHVnaW5zLndob2xlcm93ID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmVudCkge1xuXHRcdHRoaXMuYmluZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHBhcmVudC5iaW5kLmNhbGwodGhpcyk7XG5cblx0XHRcdHRoaXMuZWxlbWVudFxuXHRcdFx0XHQub24oJ3JlYWR5LmpzdHJlZSBzZXRfc3RhdGUuanN0cmVlJywgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmhpZGVfZG90cygpO1xuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQub24oXCJpbml0LmpzdHJlZSBsb2FkaW5nLmpzdHJlZSByZWFkeS5qc3RyZWVcIiwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHQvL2Rpdi5zdHlsZS5oZWlnaHQgPSB0aGlzLl9kYXRhLmNvcmUubGlfaGVpZ2h0ICsgJ3B4Jztcblx0XHRcdFx0XHRcdHRoaXMuZ2V0X2NvbnRhaW5lcl91bCgpLmFkZENsYXNzKCdqc3RyZWUtd2hvbGVyb3ctdWwnKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiZGVzZWxlY3RfYWxsLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZCgnLmpzdHJlZS13aG9sZXJvdy1jbGlja2VkJykucmVtb3ZlQ2xhc3MoJ2pzdHJlZS13aG9sZXJvdy1jbGlja2VkJyk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImNoYW5nZWQuanN0cmVlXCIsICQucHJveHkoZnVuY3Rpb24gKGUsIGRhdGEpIHtcblx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKCcuanN0cmVlLXdob2xlcm93LWNsaWNrZWQnKS5yZW1vdmVDbGFzcygnanN0cmVlLXdob2xlcm93LWNsaWNrZWQnKTtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSBmYWxzZSwgaSwgajtcblx0XHRcdFx0XHRcdGZvcihpID0gMCwgaiA9IGRhdGEuc2VsZWN0ZWQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHRtcCA9IHRoaXMuZ2V0X25vZGUoZGF0YS5zZWxlY3RlZFtpXSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdGlmKHRtcCAmJiB0bXAubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG1wLmNoaWxkcmVuKCcuanN0cmVlLXdob2xlcm93JykuYWRkQ2xhc3MoJ2pzdHJlZS13aG9sZXJvdy1jbGlja2VkJyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwib3Blbl9ub2RlLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmdldF9ub2RlKGRhdGEubm9kZSwgdHJ1ZSkuZmluZCgnLmpzdHJlZS1jbGlja2VkJykucGFyZW50KCkuY2hpbGRyZW4oJy5qc3RyZWUtd2hvbGVyb3cnKS5hZGRDbGFzcygnanN0cmVlLXdob2xlcm93LWNsaWNrZWQnKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwiaG92ZXJfbm9kZS5qc3RyZWUgZGVob3Zlcl9ub2RlLmpzdHJlZVwiLCAkLnByb3h5KGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRpZihlLnR5cGUgPT09IFwiaG92ZXJfbm9kZVwiICYmIHRoaXMuaXNfZGlzYWJsZWQoZGF0YS5ub2RlKSkgeyByZXR1cm47IH1cblx0XHRcdFx0XHRcdHRoaXMuZ2V0X25vZGUoZGF0YS5ub2RlLCB0cnVlKS5jaGlsZHJlbignLmpzdHJlZS13aG9sZXJvdycpW2UudHlwZSA9PT0gXCJob3Zlcl9ub2RlXCI/XCJhZGRDbGFzc1wiOlwicmVtb3ZlQ2xhc3NcIl0oJ2pzdHJlZS13aG9sZXJvdy1ob3ZlcmVkJyk7XG5cdFx0XHRcdFx0fSwgdGhpcykpXG5cdFx0XHRcdC5vbihcImNvbnRleHRtZW51LmpzdHJlZVwiLCBcIi5qc3RyZWUtd2hvbGVyb3dcIiwgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2RhdGEuY29udGV4dG1lbnUpIHtcblx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHR2YXIgdG1wID0gJC5FdmVudCgnY29udGV4dG1lbnUnLCB7IG1ldGFLZXkgOiBlLm1ldGFLZXksIGN0cmxLZXkgOiBlLmN0cmxLZXksIGFsdEtleSA6IGUuYWx0S2V5LCBzaGlmdEtleSA6IGUuc2hpZnRLZXksIHBhZ2VYIDogZS5wYWdlWCwgcGFnZVkgOiBlLnBhZ2VZIH0pO1xuXHRcdFx0XHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdChcIi5qc3RyZWUtbm9kZVwiKS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLmZpcnN0KCkudHJpZ2dlcih0bXApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIHRoaXMpKVxuXHRcdFx0XHQvKiFcblx0XHRcdFx0Lm9uKFwibW91c2Vkb3duLmpzdHJlZSB0b3VjaHN0YXJ0LmpzdHJlZVwiLCBcIi5qc3RyZWUtd2hvbGVyb3dcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGlmKGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGEgPSAkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdChcIi5qc3RyZWUtbm9kZVwiKS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpO1xuXHRcdFx0XHRcdFx0XHRlLnRhcmdldCA9IGFbMF07XG5cdFx0XHRcdFx0XHRcdGEudHJpZ2dlcihlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQqL1xuXHRcdFx0XHQub24oXCJjbGljay5qc3RyZWVcIiwgXCIuanN0cmVlLXdob2xlcm93XCIsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0dmFyIHRtcCA9ICQuRXZlbnQoJ2NsaWNrJywgeyBtZXRhS2V5IDogZS5tZXRhS2V5LCBjdHJsS2V5IDogZS5jdHJsS2V5LCBhbHRLZXkgOiBlLmFsdEtleSwgc2hpZnRLZXkgOiBlLnNoaWZ0S2V5IH0pO1xuXHRcdFx0XHRcdFx0JChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoXCIuanN0cmVlLW5vZGVcIikuY2hpbGRyZW4oXCIuanN0cmVlLWFuY2hvclwiKS5maXJzdCgpLnRyaWdnZXIodG1wKS5mb2N1cygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdC5vbihcImRibGNsaWNrLmpzdHJlZVwiLCBcIi5qc3RyZWUtd2hvbGVyb3dcIiwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHR2YXIgdG1wID0gJC5FdmVudCgnZGJsY2xpY2snLCB7IG1ldGFLZXkgOiBlLm1ldGFLZXksIGN0cmxLZXkgOiBlLmN0cmxLZXksIGFsdEtleSA6IGUuYWx0S2V5LCBzaGlmdEtleSA6IGUuc2hpZnRLZXkgfSk7XG5cdFx0XHRcdFx0XHQkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdChcIi5qc3RyZWUtbm9kZVwiKS5jaGlsZHJlbihcIi5qc3RyZWUtYW5jaG9yXCIpLmZpcnN0KCkudHJpZ2dlcih0bXApLmZvY3VzKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKFwiY2xpY2suanN0cmVlXCIsIFwiLmpzdHJlZS1sZWFmID4gLmpzdHJlZS1vY2xcIiwgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSAkLkV2ZW50KCdjbGljaycsIHsgbWV0YUtleSA6IGUubWV0YUtleSwgY3RybEtleSA6IGUuY3RybEtleSwgYWx0S2V5IDogZS5hbHRLZXksIHNoaWZ0S2V5IDogZS5zaGlmdEtleSB9KTtcblx0XHRcdFx0XHRcdCQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KFwiLmpzdHJlZS1ub2RlXCIpLmNoaWxkcmVuKFwiLmpzdHJlZS1hbmNob3JcIikuZmlyc3QoKS50cmlnZ2VyKHRtcCkuZm9jdXMoKTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwibW91c2VvdmVyLmpzdHJlZVwiLCBcIi5qc3RyZWUtd2hvbGVyb3csIC5qc3RyZWUtaWNvblwiLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0aWYoIXRoaXMuaXNfZGlzYWJsZWQoZS5jdXJyZW50VGFyZ2V0KSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmhvdmVyX25vZGUoZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9LCB0aGlzKSlcblx0XHRcdFx0Lm9uKFwibW91c2VsZWF2ZS5qc3RyZWVcIiwgXCIuanN0cmVlLW5vZGVcIiwgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5kZWhvdmVyX25vZGUoZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdFx0XHR9LCB0aGlzKSk7XG5cdFx0fTtcblx0XHR0aGlzLnRlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYodGhpcy5zZXR0aW5ncy53aG9sZXJvdykge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQuZmluZChcIi5qc3RyZWUtd2hvbGVyb3dcIikucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0XHRwYXJlbnQudGVhcmRvd24uY2FsbCh0aGlzKTtcblx0XHR9O1xuXHRcdHRoaXMucmVkcmF3X25vZGUgPSBmdW5jdGlvbihvYmosIGRlZXAsIGNhbGxiYWNrLCBmb3JjZV9yZW5kZXIpIHtcblx0XHRcdG9iaiA9IHBhcmVudC5yZWRyYXdfbm9kZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0aWYob2JqKSB7XG5cdFx0XHRcdHZhciB0bXAgPSBkaXYuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0XHQvL3RtcC5zdHlsZS5oZWlnaHQgPSB0aGlzLl9kYXRhLmNvcmUubGlfaGVpZ2h0ICsgJ3B4Jztcblx0XHRcdFx0aWYoJC5pbkFycmF5KG9iai5pZCwgdGhpcy5fZGF0YS5jb3JlLnNlbGVjdGVkKSAhPT0gLTEpIHsgdG1wLmNsYXNzTmFtZSArPSAnIGpzdHJlZS13aG9sZXJvdy1jbGlja2VkJzsgfVxuXHRcdFx0XHRpZih0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCAmJiB0aGlzLl9kYXRhLmNvcmUuZm9jdXNlZCA9PT0gb2JqLmlkKSB7IHRtcC5jbGFzc05hbWUgKz0gJyBqc3RyZWUtd2hvbGVyb3ctaG92ZXJlZCc7IH1cblx0XHRcdFx0b2JqLmluc2VydEJlZm9yZSh0bXAsIG9iai5jaGlsZE5vZGVzWzBdKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fTtcblx0fTtcblx0Ly8gaW5jbHVkZSB0aGUgd2hvbGVyb3cgcGx1Z2luIGJ5IGRlZmF1bHRcblx0Ly8gJC5qc3RyZWUuZGVmYXVsdHMucGx1Z2lucy5wdXNoKFwid2hvbGVyb3dcIik7XG5cdGlmKHdpbmRvdy5jdXN0b21FbGVtZW50cyAmJiBPYmplY3QgJiYgT2JqZWN0LmNyZWF0ZSkge1xuXHRcdHZhciBwcm90byA9IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlKTtcblx0XHRwcm90by5jcmVhdGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgYyA9IHsgY29yZSA6IHt9LCBwbHVnaW5zIDogW10gfSwgaTtcblx0XHRcdGZvcihpIGluICQuanN0cmVlLnBsdWdpbnMpIHtcblx0XHRcdFx0aWYoJC5qc3RyZWUucGx1Z2lucy5oYXNPd25Qcm9wZXJ0eShpKSAmJiB0aGlzLmF0dHJpYnV0ZXNbaV0pIHtcblx0XHRcdFx0XHRjLnBsdWdpbnMucHVzaChpKTtcblx0XHRcdFx0XHRpZih0aGlzLmdldEF0dHJpYnV0ZShpKSAmJiBKU09OLnBhcnNlKHRoaXMuZ2V0QXR0cmlidXRlKGkpKSkge1xuXHRcdFx0XHRcdFx0Y1tpXSA9IEpTT04ucGFyc2UodGhpcy5nZXRBdHRyaWJ1dGUoaSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Zm9yKGkgaW4gJC5qc3RyZWUuZGVmYXVsdHMuY29yZSkge1xuXHRcdFx0XHRpZigkLmpzdHJlZS5kZWZhdWx0cy5jb3JlLmhhc093blByb3BlcnR5KGkpICYmIHRoaXMuYXR0cmlidXRlc1tpXSkge1xuXHRcdFx0XHRcdGMuY29yZVtpXSA9IEpTT04ucGFyc2UodGhpcy5nZXRBdHRyaWJ1dGUoaSkpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQkKHRoaXMpLmpzdHJlZShjKTtcblx0XHR9O1xuXHRcdC8vIHByb3RvLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uIChuYW1lLCBwcmV2aW91cywgdmFsdWUpIHsgfTtcblx0XHR0cnkge1xuXHRcdFx0d2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcInZha2F0YS1qc3RyZWVcIiwgZnVuY3Rpb24oKSB7fSwgeyBwcm90b3R5cGU6IHByb3RvIH0pO1xuXHRcdH0gY2F0Y2ggKGlnbm9yZSkgeyB9XG5cdH1cblxufSkpOyJdLCJzb3VyY2VSb290IjoiIn0=