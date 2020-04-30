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
/******/ 		"workflowEditor": 0
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
/******/ 	deferredModules.push(["./client/pages/workflow-manager.js","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/pages/workflow-manager.js":
/*!******************************************!*\
  !*** ./client/pages/workflow-manager.js ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page.js */ "./client/pages/page.js");
var _ = __webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var tests = __webpack_require__(/*! ../views/tests */ "./client/views/tests.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
var xhr = __webpack_require__(/*! xhr */ "./node_modules/xhr/index.js");
var app = __webpack_require__(/*! ../app */ "./client/app.js");
//views
var PageView = __webpack_require__(/*! ./base */ "./client/pages/base.js");
var WorkflowEditorView = __webpack_require__(/*! ../views/workflow-editor */ "./client/views/workflow-editor.js");
var WorkflowStatusView = __webpack_require__(/*! ../views/workflow-status */ "./client/views/workflow-status.js");
var WorkflowResultsView = __webpack_require__(/*! ../views/workflow-results */ "./client/views/workflow-results.js");
var ModelViewer = __webpack_require__(/*! ../views/model-viewer */ "./client/views/model-viewer.js");
var InfoView = __webpack_require__(/*! ../views/workflow-info */ "./client/views/workflow-info.js");
var InputView = __webpack_require__(/*! ../views/input */ "./client/views/input.js");
//models
var Model = __webpack_require__(/*! ../models/model */ "./client/models/model.js")
//templates
var template = __webpack_require__(/*! ../templates/pages/workflowManager.pug */ "./client/templates/pages/workflowManager.pug");



let operationInfoModalHtml = () => {
  let editWorkflowMessage = `
    <p><b>Workflow Name/Path</b>: You may edit the name/path of the workflow as long as the workflow has not been saved.  
    Workflow Names always end with a time stamp.</p>
    <p><b>Model Path</b>: If you move or rename the model make sure to update this path.</p>
    <p><b>Settings</b>: This is where you can customize the settings for your workflow.
    If you need to edit other part of you model click on the edit model button.  
    The settings are only available for workflows that have not been run.</p>
    <p><b>Status</b>: This section displays the status and start time of the Workflow.  If the workflow hasn't been sarted this section is closed.</p>
    <p><b>Results</b>: You may change the title, x-axis label, and y-axis label by clicking on the edit plot button then enter the name in the correct field.</p>
    <p><b>Info</b>: This section displays any warnings and/or error that are logged by the running workflow.</p>
    <p><b>Model</b>: This section lets you view the model that was used when you ran the workflow.</p>
  `;

  return `
    <div id="operationInfoModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Workflow Manager Help </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${editWorkflowMessage} </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  ` 
}

let modelNotFoundHtml = (title, message) => {
  return `
    <div id="modelNotFoundModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> ${title} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${message} </p>
            <p> Please correct the model path and press enter to reset the workflow. </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
}

let WorkflowManager = PageView.extend({
  template: template,
  events: {
    'change [data-hook=workflow-name]' : 'setWorkflowName',
    'change [data-hook=model-path]' : 'updateWkflModel',
    'click [data-hook=edit-workflow-help]' : function () {
      let modal = $(operationInfoModalHtml()).modal();
    },
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    $(document).on('hidden.bs.modal', function (e) {
      if(e.target.id === "modelNotFoundModal")
        $(self.queryByHook("model-path")).find('input').focus();
    });
    this.url = decodeURI(document.URL)
    var typeAndPath = this.url.split('/workflow/edit/').pop()
    var stamp = this.getCurrentDate();
    var endpoint = path.join(app.getApiPath(), "workflow/load-workflow", stamp, typeAndPath)
    xhr({uri: endpoint, json: true}, function (err, resp, body) {
      if(resp.statusCode < 400) {
        self.type = body.type
        self.titleType = body.titleType
        self.modelDirectory = body.mdlPath
        self.wkflDirectory = body.wkflDir
        self.workflowDate = body.timeStamp
        self.workflowName = body.wkflName
        self.status = body.status
        self.startTime = body.startTime
        self.wkflParPath = body.wkflParPath
        self.wkflPath = path.join(self.wkflParPath, self.wkflDirectory)
        console.log(self.status, self.startTime)
        self.buildWkflModel(body)
        self.renderSubviews();
      }
    });
  },
  buildWkflModel: function (data) {
    let model = data.model
    this.model = new Model(model)
    this.model.name = this.modelDirectory.split('/').pop().split('.')[0]
    this.model.directory = this.modelDirectory
    this.model.is_spatial = this.modelDirectory.endsWith(".smdl")
    this.model.isPreview = false
    this.model.for = "wkfl"
    if(!model)
      this.wkflModelNotFound(data.error)
  },
  wkflModelNotFound: function (error) {
    let modal = $(modelNotFoundHtml(error.Reason, error.Message)).modal()
  },
  update: function () {
  },
  updateValid: function () {
  },
  getCurrentDate: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month < 10){
      month = "0" + month
    }
    var day = date.getDate();
    if(day < 10){
      day = "0" + day
    }
    var hours = date.getHours();
    if(hours < 10){
      hours = "0" + hours
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
      minutes = "0" + minutes
    }
    var seconds = date.getSeconds();
    if(seconds < 10){
      seconds = "0" + seconds
    }
    return "_" + month + day + year + "_" + hours + minutes + seconds;
  },
  renderSubviews: function () {
    $(this.queryByHook("page-title")).text('Workflow: '+this.titleType)
    this.renderWkflNameInputView();
    this.renderMdlPathInputView();
    this.renderWorkflowEditor();
    this.renderWorkflowStatusView();
    this.renderResultsView();
    this.renderInfoView();
    this.renderModelViewer();
    if(this.status === 'running'){
      this.getWorkflowStatus();
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    return this.renderSubview(view, this.queryByHook(hook));
  },
  renderWkflNameInputView: function () {
    let inputName = new InputView({
      parent: this,
      required: true,
      name: 'name',
      label: 'Workflow Name: ',
      tests: '',
      modelKey: null,
      valueType: 'string',
      value: this.workflowName,
    });
    this.registerRenderSubview(inputName, 'workflow-name');
    if(this.status !== "new") {
      $(this.queryByHook('workflow-name')).find('input').prop('disabled', true);
    }
  },
  renderMdlPathInputView: function () {
    let modelPathInput = new InputView({
      parent: this,
      required: true,
      name: 'name',
      label: 'Model Path: ',
      tests: "",
      modelKey: 'directory',
      valueType: 'string',
      value: this.model.directory,
    });
    this.registerRenderSubview(modelPathInput, "model-path");
    if(this.status !== "new" && this.status !== "ready") {
      $(this.queryByHook('model-path')).find('input').prop('disabled', true);
    }
  },
  renderWorkflowEditor: function () {
    if(this.workflowEditorView){
      this.workflowEditorView.remove()
    }
    this.workflowEditor = new WorkflowEditorView({
      model: this.model,
      type: this.type,
      status: this.status,
    });
    this.workflowEditorView = this.registerRenderSubview(this.workflowEditor, 'workflow-editor-container');
  },
  renderWorkflowStatusView: function () {
    if(this.workflowStatusView){
      this.workflowStatusView.remove();
    }
    var statusView = new WorkflowStatusView({
      startTime: this.startTime,
      status: this.status,
    });
    this.workflowStatusView = this.registerRenderSubview(statusView, 'workflow-status-container');
  },
  renderResultsView: function () {
    if(this.workflowResultsView){
      this.workflowResultsView.remove();
    }
    var resultsView = new WorkflowResultsView({
      trajectories: this.model.simulationSettings.realizations,
      status: this.status,
      species: this.model.species,
      type: this.type,
      speciesOfInterest: this.model.parameterSweepSettings.speciesOfInterest.name
    });
    this.workflowResultsView = this.registerRenderSubview(resultsView, 'workflow-results-container');
  },
  renderInfoView: function () {
    if(this.infoView){
      this.infoView.remove();
    }
    this.infoView = new InfoView({
      status: this.status,
      logsPath: path.join(this.wkflPath, "logs.txt")
    });
    this.registerRenderSubview(this.infoView, 'workflow-info-container')
  },
  renderModelViewer: function (){
    if(this.modelViewer){
      this.modelViewer.remove();
    }
    this.modelViewer = new ModelViewer({
      model: this.model,
      status: this.status,
      type: this.type
    });
    this.registerRenderSubview(this.modelViewer, 'model-viewer-container')
  },
  getWorkflowStatus: function () {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "/workflow/workflow-status", this.wkflPath);
    xhr({uri: endpoint}, function (err, response, body) {
      if(self.status !== body )
        self.status = body;
      if(self.status === 'running')
        setTimeout(_.bind(self.getWorkflowStatus, self), 1000);
      else{
        self.renderWorkflowStatusView()
        self.renderInfoView();
      }
      if(self.status === 'complete') {
        self.renderResultsView();
        self.renderModelViewer();
      }
    });
  },
  setWorkflowName: function(e) {
    var newWorkflowName = e.target.value.trim();
    if(newWorkflowName.endsWith(this.workflowDate)){
      this.workflowName = newWorkflowName
    }else{
      this.workflowName = newWorkflowName + this.workflowDate
      e.target.value = this.workflowName
    }
    this.wkflDirectory = this.workflowName + ".wkfl"
    this.wkflPath = path.join(this.wkflParPath, this.wkflDirectory)
    console.log(this.wkflPath)
  },
  updateWkflModel: function (e) {
    let self = this;
    this.model.fetch({
      json: true,
      success: function (model, response, options) {
        self.renderWorkflowEditor()
      },
      error: function (model, response, options) {
        self.wkflModelNotFound(response.body)
      }
    });
  },
  reloadWkfl: function () {
    let self = this;
    if(self.status === 'new')
      window.location.href = self.url.replace(self.modelDirectory.split('/').pop(), self.wkflDirectory)
    else
      window.location.reload()
  },
});

Object(_page_js__WEBPACK_IMPORTED_MODULE_0__["default"])(WorkflowManager);


/***/ }),

/***/ "./client/templates/includes/eventAssignmentsViewer.pug":
/*!**************************************************************!*\
  !*** ./client/templates/includes/eventAssignmentsViewer.pug ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EVariable\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EExpression\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"view-event-assignments-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/eventsViewer.pug":
/*!****************************************************!*\
  !*** ./client/templates/includes/eventsViewer.pug ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"events-viewer\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EEvents\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-model-events-viewer\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row collapse show\" id=\"collapse-model-events-viewer\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EName\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EDelay\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EPriority\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ETriggger\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EAssignments\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EUse Values From\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"view-events-container\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/gillespyResults.pug":
/*!*******************************************************!*\
  !*** ./client/templates/includes/gillespyResults.pug ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"card card-body\"\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Trajectories\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-trajectories\" data-hook=\"collapse-trajectories\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-trajectories\"\u003E\u003Cdiv data-hook=\"trajectories\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"download-results-csv\"\u003EDownload Results as .csv\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/gillespyResultsEnsemble.pug":
/*!***************************************************************!*\
  !*** ./client/templates/includes/gillespyResultsEnsemble.pug ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results-ensemble\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"card card-body\"\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Standard Deviation Range\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-stddevrange\" data-hook=\"collapse-stddevrange\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-stddevrange\"\u003E\u003Cdiv data-hook=\"stddevran\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddevran\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddevran\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddevran\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"card card-body\"\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Trajectories\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-trajectories\" data-hook=\"collapse-trajectories\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-trajectories\"\u003E\u003Cdiv data-hook=\"trajectories\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"plot\"\u003EPlot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"plot-multiple\" disabled\u003EMultiple Plots\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"card card-body\"\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Standard Deviation\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-stddev\" data-hook=\"collapse-stddev\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-stddev\"\u003E\u003Cdiv data-hook=\"stddev\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddev\" data-hook=\"plot\"\u003EPlot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddev\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddev\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"card card-body\"\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Trajectory Mean\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-trajmean\" data-hook=\"collapse-trajmean\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-trajmean\"\u003E\u003Cdiv data-hook=\"avg\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"avg\" data-hook=\"plot\"\u003EPlot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"avg\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"avg\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"download-results-csv\"\u003EDownload Results as .csv\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/modelSettingsViewer.pug":
/*!***********************************************************!*\
  !*** ./client/templates/includes/modelSettingsViewer.pug ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"model-settings-viewer\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EModel Settings\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-model-settings-viewer\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row collapse show\" id=\"collapse-model-settings-viewer\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EEnd Simulation\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ETime Steps\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EVolume\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.endSim) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.timeStep) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.volume) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/modelViewer.pug":
/*!***************************************************!*\
  !*** ./client/templates/includes/modelViewer.pug ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"model-viewer\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EModel\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-model\" data-hook=\"collapse-model\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-model\"\u003E\u003Cdiv\u003E\u003Ch5\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"species-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"parameters-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"reactions-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"events-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"rules-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"model-settings-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"parameter-sweep-settings-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"simulation-settings-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/parameterSweepResults.pug":
/*!*************************************************************!*\
  !*** ./client/templates/includes/parameterSweepResults.pug ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"species-of-interest\"\u003ESpecies of Interest:\u003C\u002Fspan\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.species, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline\" id=\"species-of-interest\" data-hook=\"specie-of-interest-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"feature-extractor\"\u003EFeature Extraction: \u003C\u002Fspan\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.mapper, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline\" id=\"feature-extractor\" data-hook=\"feature-extraction-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"ensemble-aggragator\"\u003EEnsemble Aggragator: \u003C\u002Fspan\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.reducer, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline\" id=\"ensemble-aggragator\" data-hook=\"ensemble-aggragator-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"card card-body\"\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EParameter Sweep\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-psweep\" data-hook=\"collapse-psweep\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-psweep\"\u003E\u003Cdiv data-hook=\"psweep\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"psweep\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"psweep\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"psweep\" data-hook=\"download-json\" disabled\u003EDownload JSON \u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"download-results-csv\"\u003EDownload Results as .csv\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/parameterSweepSettings.pug":
/*!**************************************************************!*\
  !*** ./client/templates/includes/parameterSweepSettings.pug ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"parameter-sweep-settings\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EParameter Sweep Settings\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-psweep-settings\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-psweep-settings\"\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-6 verticle-space\"\u003E\u003Cspan class=\"inline\"\u003ESweep Type:\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.sweepType, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fspan\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cinput type=\"radio\" name=\"sweepType\" data-hook=\"one-parameter\" data-name=\"1D\" checked\u003E One Parameter\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cinput type=\"radio\" name=\"sweepType\" data-hook=\"two-parameter\" data-name=\"2D\" disabled\u003E Two Parameters\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6 verticle-space\"\u003E\u003Cspan class=\"inline\" for=\"species-of-interest\"\u003ESpecies of Interest:\u003C\u002Fspan\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.species, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline\" id=\"species-of-interest\" data-hook=\"specie-of-interest-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Ch5\u003EConfigure Variable(s)\u003C\u002Fh5\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESweep Variable\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.variable, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ECurrent Value\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.value, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EMinimum Value\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.min, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EMaximum Value\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.max, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESteps\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.steps, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"sweep-variable-one-select\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"current-value-one-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"minimum-value-one-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"maximum-value-one-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"step-one-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr class=\"collapse\" data-hook=\"parameter-two-row\"\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"sweep-variable-two-select\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"current-value-two-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"minimum-value-two-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"maximum-value-two-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"step-two-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/parameterSweepSettingsViewer.pug":
/*!********************************************************************!*\
  !*** ./client/templates/includes/parameterSweepSettingsViewer.pug ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"parameter-sweep-settings-viewer\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EParameter Sweep Settings\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-psweep-settings-viewer\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-psweep-settings-viewer\"\u003E\u003Cdiv style=\"margin-bottom: 0.75rem;\" data-hook=\"sweep-type-viewer\"\u003E\u003C\u002Fdiv\u003E\u003Ch5 class=\"inline\"\u003ESweep Variables\u003C\u002Fh5\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EVariable\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ECurrent Value\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EMinimum Value\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EMaximum Value\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ESteps\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.parameterOne.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd data-hook=\"p1-current-value-viewer\"\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.p1Min) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.p1Max) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.p1Steps) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr class=\"collapse\" data-hook=\"p2-variable-viewer\"\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.parameterTwo.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd data-hook=\"p2-current-value-viewer\"\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.p2Min) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.p2Max) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.p2Steps) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/parametersViewer.pug":
/*!********************************************************!*\
  !*** ./client/templates/includes/parametersViewer.pug ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"parameters-viewer\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EParameters\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-parameters\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-parameters\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003EName\u003C\u002Fth\u003E\u003Cth class=\"col-md-9-view\" scope=\"col\"\u003EExpression\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"parameter-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/reactionsViewer.pug":
/*!*******************************************************!*\
  !*** ./client/templates/includes/reactionsViewer.pug ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"reactions-viewer\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EReactions\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-reactions\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-reactions\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003EName\u003C\u002Fth\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003ESummary\u003C\u002Fth\u003E\u003Cth class=\"col-md-6-view\" scope=\"col\"\u003ERate\u002FPropensity\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"reaction-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/rulesViewer.pug":
/*!***************************************************!*\
  !*** ./client/templates/includes/rulesViewer.pug ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"rules-viewer\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ERules\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-rules\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-rules\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003EName\u003C\u002Fth\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003EType\u003C\u002Fth\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003EVariable\u003C\u002Fth\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003EExpression\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"rules-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/simulationSettings.pug":
/*!**********************************************************!*\
  !*** ./client/templates/includes/simulationSettings.pug ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"simulation-settings\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ESimulation Settings\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-settings\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-settings\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\" colspan=\"5\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESimulation Algorithm\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.algorithm, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-ode\" data-name=\"ODE\"\u003E ODE\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.ode, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-ssa\" data-name=\"SSA\"\u003E SSA\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.ssa, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-tau-leaping\" data-name=\"Tau-Leaping\"\u003E Tau Leaping\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.tauLeaping, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-hybrid-tau\" data-name=\"Hybrid-Tau-Leaping\"\u003E Hybrid ODE\u002FSSA\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.hybrid, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput class=\"inline\" type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-automatic\" data-name=\"Automatic\"\u003E Choose for me\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.chooseForMe, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-5\"\u003E\u003Ch5 class=\"inline\"\u003EDeterministic Settings\u003C\u002Fh5\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ERelative Tolerance\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.rtol, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAbsolute Tolerance\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.atol, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"relative-tolerance\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"absolute-tolerance\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-7\"\u003E\u003Ch5 class=\"inline\"\u003EStochastic Settings\u003C\u002Fh5\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ETrajectories\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.realizations, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESeed\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.seed, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ETau Tolerance\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.ttol, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"trajectories\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"seed\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"tau-tolerance\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/simulationSettingsViewer.pug":
/*!****************************************************************!*\
  !*** ./client/templates/includes/simulationSettingsViewer.pug ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"settings-viewer\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ESimulation Settings\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-settings-viewer\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row collapse show\" id=\"collapse-settings-viewer\"\u003E\u003Cdiv class=\"col-md-12\" style=\"margin-bottom: 0.75rem;\"\u003E" + (pug.escape(null == (pug_interp = this.algorithm) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6 collapse\" data-hook=\"deterministic\"\u003E\u003Ch5 class=\"inline\"\u003EDeterministic Settings\u003C\u002Fh5\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ERelative Tolerance\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EAbsolute Tolerance\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.relativeTol) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.absoluteTol) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6 collapse\" data-hook=\"stochastic\"\u003E\u003Ch5 class=\"inline\"\u003EStochastic Settings\u003C\u002Fh5\u003E\u003Cdiv class=\"collapse\" data-hook=\"SSA\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ENumber of Trajectories\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ESeed\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.realizations) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.seed) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" data-hook=\"Tau\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ENumber of Trajectories\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ESeed\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ETau Tolerance\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.realizations) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.seed) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.tauTol) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/speciesViewer.pug":
/*!*****************************************************!*\
  !*** ./client/templates/includes/speciesViewer.pug ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"species-viewer\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ESpecies\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-species\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-species\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003EName\u003C\u002Fth\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003EInitial Condition\u003C\u002Fth\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003EMode\u003C\u002Fth\u003E\u003Cth class=\"col-md-3-view\" scope=\"col\"\u003ESwitch Tolerance\u002FMinimum Value for Switching\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"specie-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/viewEventAssignments.pug":
/*!************************************************************!*\
  !*** ./client/templates/includes/viewEventAssignments.pug ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.variable.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.expression) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/viewEvents.pug":
/*!**************************************************!*\
  !*** ./client/templates/includes/viewEvents.pug ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.delay) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.priority) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv\u003E" + (pug.escape(null == (pug_interp = "Expression: " + this.model.triggerExpression) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Cspan class=\"checkbox\" for=\"initial-value\"\u003EInitial Value: \u003C\u002Fspan\u003E\u003Cinput type=\"checkbox\" id=\"initial-value\" data-hook=\"event-trigger-init-value\" disabled\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Cspan class=\"checkbox\" for=\"persistent\"\u003EPersistent: \u003C\u002Fspan\u003E\u003Cinput type=\"checkbox\" id=\"persistent\" data-hook=\"event-trigger-persistent\" disabled\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"assignment-viewer\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E \u003Cdiv\u003E\u003Cspan class=\"inline horizontal-space\" for=\"trigger-time\"\u003ETrggier Time\u003C\u002Fspan\u003E\u003Cinput type=\"radio\" id=\"trigger-time\" name=\"use-values-from\" data-hook=\"trigger-time\" disabled\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Cspan class=\"inline horizontal-space\" for=\"assignment-time\"\u003EAssignment Time\u003C\u002Fspan\u003E\u003Cinput type=\"radio\" id=\"assignment-time\" name=\"use-values-from\" data-hook=\"assignment-time\" disabled\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/viewParameters.pug":
/*!******************************************************!*\
  !*** ./client/templates/includes/viewParameters.pug ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.expression) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/viewReactions.pug":
/*!*****************************************************!*\
  !*** ./client/templates/includes/viewReactions.pug ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"summary\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.rate) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/viewRules.pug":
/*!*************************************************!*\
  !*** ./client/templates/includes/viewRules.pug ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.type) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.variable.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.expression) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/viewSpecies.pug":
/*!***************************************************!*\
  !*** ./client/templates/includes/viewSpecies.pug ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.value) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.mode) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.switchingValWithLabel) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/workflowEditor.pug":
/*!******************************************************!*\
  !*** ./client/templates/includes/workflowEditor.pug ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ESettings\u003C\u002Fh3\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" data-hook=\"workflow-editor-container\"\u003E\u003Cdiv data-hook=\"model-name-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" data-hook=\"param-sweep-settings-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"sim-settings-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-state-buttons-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/workflowInfo.pug":
/*!****************************************************!*\
  !*** ./client/templates/includes/workflowInfo.pug ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-info-view\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EInfo\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-info\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-info\" data-hook=\"workflow-info\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"workflow-statistics\"\u003E\u003Ch5 class=\"inline\"\u003EStatistics\u003C\u002Fh5\u003E\u003Cdiv data-hook=\"list-of-notes\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" data-hook=\"workflow-warnings\"\u003E\u003Ch5 class=\"inline\"\u003EWarnings\u003C\u002Fh5\u003E\u003Cdiv data-hook=\"list-of-warnings\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" data-hook=\"workflow-errors\"\u003E\u003Ch5 class=\"inline\"\u003EErrors\u003C\u002Fh5\u003E\u003Cdiv data-hook=\"list-of-errors\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/workflowStateButtons.pug":
/*!************************************************************!*\
  !*** ./client/templates/includes/workflowStateButtons.pug ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"mdl-edit-btn\"\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"save\"\u003ESave\u003C\u002Fbutton\u003E\u003Cdiv class=\"mdl-edit-btn saving-status\" data-hook=\"saving-workflow\"\u003E\u003Cdiv class=\"spinner-grow\"\u003E\u003C\u002Fdiv\u003E\u003Cspan\u003ESaving...\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-edit-btn saved-status\" data-hook=\"saved-workflow\"\u003E\u003Cspan\u003ESaved\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-edit-btn save-error-status\" data-hook=\"save-error\"\u003E\u003Cspan\u003EError Saving Model\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"start-workflow\"\u003EStart Workflow\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"edit-model\"\u003EEdit Model\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/workflowStatus.pug":
/*!******************************************************!*\
  !*** ./client/templates/includes/workflowStatus.pug ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-status\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EStatus\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-status\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-status\" data-hook=\"workflow-status\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EDate\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EStatus\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.startTime) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.status) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cdiv style=\"display: none;\"\u003E\u003Cbutton class=\"btn btn-outline-primary box-shadow\" data-hook=\"stop-workflow\" type=\"button\" disabled\u003EStop Workflow\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-outline-primary box-shadow\" data-hook=\"restart-workflow\" type=\"button\" disabled\u003ERestart Workflow\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/pages/workflowManager.pug":
/*!****************************************************!*\
  !*** ./client/templates/pages/workflowManager.pug ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Csection class=\"page\"\u003E\u003Cdiv\u003E\u003Ch2 class=\"inline\" data-hook=\"page-title\"\u003E" + (pug.escape(null == (pug_interp = "Workflow: "+this.titleType) ? "" : pug_interp)) + "\u003C\u002Fh2\u003E\u003Cbutton class=\"big-tip btn information-btn help\" data-hook=\"edit-workflow-help\"\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"far\" data-icon=\"question-circle\" class=\"svg-inline--fa fa-question-circle fa-w-16\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 512 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-name\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"model-path\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-status-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-results-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-info-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"model-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"computational-resources-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/views/event-assignments-viewer.js":
/*!**************************************************!*\
  !*** ./client/views/event-assignments-viewer.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var ViewAssignments = __webpack_require__(/*! ./view-event-assignments */ "./client/views/view-event-assignments.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/eventAssignmentsViewer.pug */ "./client/templates/includes/eventAssignmentsViewer.pug");

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ViewAssignments, 'view-event-assignments-list');
  },
});

/***/ }),

/***/ "./client/views/events-viewer.js":
/*!***************************************!*\
  !*** ./client/views/events-viewer.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var ViewEvent = __webpack_require__(/*! ./view-events */ "./client/views/view-events.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/eventsViewer.pug */ "./client/templates/includes/eventsViewer.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeSettingsCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ViewEvent, this.queryByHook('view-events-container'))
  },
  changeSettingsCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/model-settings-viewer.js":
/*!***********************************************!*\
  !*** ./client/views/model-settings-viewer.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/modelSettingsViewer.pug */ "./client/templates/includes/modelSettingsViewer.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeSettingsCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  changeSettingsCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/model-viewer.js":
/*!**************************************!*\
  !*** ./client/views/model-viewer.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var SpeciesViewer = __webpack_require__(/*! ./species-viewer */ "./client/views/species-viewer.js");
var ParametersViewer = __webpack_require__(/*! ./parameters-viewer */ "./client/views/parameters-viewer.js");
var ReactionsViewer = __webpack_require__(/*! ./reactions-viewer */ "./client/views/reactions-viewer.js");
var EventsViewer = __webpack_require__(/*! ./events-viewer */ "./client/views/events-viewer.js");
var RulesViewer = __webpack_require__(/*! ./rules-viewer */ "./client/views/rules-viewer.js");
var ModelSettingsViewer = __webpack_require__(/*! ./model-settings-viewer */ "./client/views/model-settings-viewer.js");
var SimulationSettingsViewer = __webpack_require__(/*! ./simulation-settings-viewer */ "./client/views/simulation-settings-viewer.js");
var ParameterSweepSettingsViewer = __webpack_require__(/*! ./parameter-sweep-settings-viewer */ "./client/views/parameter-sweep-settings-viewer.js");
//models
var Model = __webpack_require__(/*! ../models/model */ "./client/models/model.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/modelViewer.pug */ "./client/templates/includes/modelViewer.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-model]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.status = attrs.status;
    this.wkflType = attrs.type;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var speciesViewer = new SpeciesViewer({
      collection: this.model.species,
    });
    var parametersViewer = new ParametersViewer({
      collection: this.model.parameters,
    });
    var reactionsViewer = new ReactionsViewer({
      collection: this.model.reactions,
    });
    var eventsViewer = new EventsViewer({
      collection: this.model.eventsCollection,
    });
    var rulesViewer = new RulesViewer({
      collection: this.model.rules,
    });
    this.renderSimulationSettingsView();
    var modelSettingsViewer = new ModelSettingsViewer({
      model: this.model.modelSettings,
    });
    var psweepSettingsViewer = new ParameterSweepSettingsViewer({
      model: this.model.parameterSweepSettings,
    });
    this.registerRenderSubview(speciesViewer, "species-viewer-container");
    this.registerRenderSubview(parametersViewer, "parameters-viewer-container");
    this.registerRenderSubview(reactionsViewer, "reactions-viewer-container");
    this.registerRenderSubview(eventsViewer, "events-viewer-container");
    this.registerRenderSubview(rulesViewer, "rules-viewer-container");
    this.registerRenderSubview(modelSettingsViewer, "model-settings-viewer-container");
    if(this.wkflType === 'parameterSweep') {
      this.registerRenderSubview(psweepSettingsViewer, 'parameter-sweep-settings-viewer-container')
    }
    if(this.status === 'complete'){
      this.enableCollapseButton();
    }
  },
  renderSimulationSettingsView: function () {
    if(this.simulationSettingsView){
      this.simulationSettingsView.remove();
    }
    this.simulationSettingsView = new SimulationSettingsViewer({
      model: this.model.simulationSettings,
    });
    this.registerRenderSubview(this.simulationSettingsView, "simulation-settings-viewer-container");
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-model')).text();
    text === '+' ? $(this.queryByHook('collapse-model')).text('-') : $(this.queryByHook('collapse-model')).text('+');
  },
  enableCollapseButton: function () {
    $(this.queryByHook('collapse-model')).prop('disabled', false);
  },
});

/***/ }),

/***/ "./client/views/parameter-sweep-settings-viewer.js":
/*!*********************************************************!*\
  !*** ./client/views/parameter-sweep-settings-viewer.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/parameterSweepSettingsViewer.pug */ "./client/templates/includes/parameterSweepSettingsViewer.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeSettingsCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var sweepType = "Sweep Type: "
    var p1CurrentVal = eval(this.model.parameterOne.expression)
    $(this.queryByHook('p1-current-value-viewer')).text(p1CurrentVal)
    if(this.model.is1D) {
      sweepType += "One Parameter"
    }else{
      sweepType += "Two Parameters"
      var p2CurrentVal = eval(this.model.parameterTwo.expression)
      $(this.queryByHook('p2-current-value-viewer')).text(p2CurrentVal)
      $(this.queryByHook('p2-variable-viewer')).collapse('show')
    }
    $(this.queryByHook('sweep-type-viewer')).text(sweepType)
  },
  changeSettingsCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
}); 

/***/ }),

/***/ "./client/views/parameter-sweep-settings.js":
/*!**************************************************!*\
  !*** ./client/views/parameter-sweep-settings.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//support files
var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/parameterSweepSettings.pug */ "./client/templates/includes/parameterSweepSettings.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' :  'changeCollapseButtonText',
    'change [data-hook=one-parameter]' : 'updateParamSweepType',
    'change [data-hook=two-parameter]' : 'updateParamSweepType',
    'change [data-hook=sweep-variable-one-select]' : 'selectSweepVarOne',
    'change [data-hook=sweep-variable-two-select]' : 'selectSweepVarTwo',
    'change [data-hook=specie-of-interest-list]' : 'selectSpeciesOfInterest'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.parameterSweepSettings
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var parameters = this.model.parent.parameters;
    var species = this.model.parent.species;
    var paramNames = parameters.map(function (parameter) { return parameter.name});
    var speciesNames = species.map(function (specie) { return specie.name});
    var speciesOfInterestView = new SelectView({
      label: '',
      name: 'species-of-interest',
      required: true,
      idAttribute: 'cid',
      options: speciesNames,
      value: this.model.speciesOfInterest.name
    });
    var parameterOneView = new SelectView({
      label: '',
      name: 'sweep-variable-one',
      required: true,
      idAttribute: 'cid',
      options: paramNames,
      value: this.model.parameterOne.name
    });
    var parameterTwoView = new SelectView({
      label: '',
      name: 'sweep-variable-two',
      required: true,
      idAttribute: 'cid',
      options: paramNames,
      value: this.model.parameterTwo.name
    });
    if(this.model.parent.parameters.length > 1){
      $(this.queryByHook('two-parameter')).prop('disabled', false)
      $(this.queryByHook('one-parameter')).prop('checked', this.model.is1D)
      $(this.queryByHook('two-parameter')).prop('checked', !this.model.is1D)
      $(this.queryByHook('current-value-two-input')).text(eval(this.model.parameterTwo.expression))
      this.toggleParamTwo();
      this.registerRenderSubview(parameterTwoView, 'sweep-variable-two-select');
    }
    $(this.queryByHook('current-value-one-input')).text(eval(this.model.parameterOne.expression))
    this.registerRenderSubview(speciesOfInterestView, 'specie-of-interest-list');
    this.registerRenderSubview(parameterOneView, 'sweep-variable-one-select');
  },
  update: function () {
  },
  updateValid: function () {
  },
  updateParamSweepType: function (e) {
    var type = e.target.dataset.name
    this.model.is1D = type === '1D'
    this.toggleParamTwo()
  },
  toggleParamTwo: function () {
    if(!this.model.is1D){
      $(this.queryByHook('parameter-two-row')).collapse('show');
    }else{
      $(this.queryByHook('parameter-two-row')).collapse('hide');
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  selectSweepVarOne: function (e) {
    var val = e.target.selectedOptions.item(0).text;
    var parameter = this.getParameter(val);
    this.model.parameterOne = parameter
    var currentValue = eval(parameter.expression)
    this.model.p1Min = currentValue * 0.5;
    this.model.p1Max = currentValue * 1.5;
    $(this.queryByHook('current-value-one-input')).text(currentValue);
    $(this.queryByHook('minimum-value-one-input')).find('input').val(this.model.p1Min)
    $(this.queryByHook('maximum-value-one-input')).find('input').val(this.model.p1Max)
  },
  selectSweepVarTwo: function (e) {
    var val = e.target.selectedOptions.item(0).text;
    var parameter = this.getParameter(val);
    this.model.parameterTwo = parameter
    var currentValue = eval(parameter.expression)
    this.model.p2Min = currentValue * 0.5;
    this.model.p2Max = currentValue * 1.5;
    $(this.queryByHook('current-value-two-input')).text(currentValue);
    $(this.queryByHook('minimum-value-two-input')).find('input').val(this.model.p2Min)
    $(this.queryByHook('maximum-value-two-input')).find('input').val(this.model.p2Max)
  },
  selectSpeciesOfInterest: function (e) {
    var val = e.target.selectedOptions.item(0).text;
    var species = this.getSpecies(val);
    this.model.speciesOfInterest = species
  },
  getSpecies: function (name) {
    var species = this.model.parent.species.filter(function (specie) {
      if(specie.name === name) return specie
    })[0];
    return species;
  },
  getParameter: function (val) {
    var parameter = this.model.parent.parameters.filter(function (parameter) {
      if(parameter.name === val) return parameter;
    })[0];
    return parameter;
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  },
  subviews: {
    param1MinValueInput: {
      hook: 'minimum-value-one-input',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'param-1-min-value',
          label: '',
          tests: tests.valueTests,
          modelKey: 'p1Min',
          valueType: 'number',
          value: this.model.p1Min
        });
      }
    },
    param1MaxValueInput: {
      hook: 'maximum-value-one-input',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'param-1-max-value',
          label: '',
          tests: tests.valueTests,
          modelKey: 'p1Max',
          valueType: 'number',
          value: this.model.p1Max
        });
      }
    },
    param1StepValueInput: {
      hook: 'step-one-input',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'param-1-step-value',
          label: '',
          tests: tests.valueTests,
          modelKey: 'p1Steps',
          valueType: 'number',
          value: this.model.p1Steps
        });
      }
    },
    param2MinValueInput: {
      hook: 'minimum-value-two-input',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'param-2-min-value',
          label: '',
          tests: tests.valueTests,
          modelKey: 'p2Min',
          valueType: 'number',
          value: this.model.p2Min
        });
      }
    },
    param2MaxValueInput: {
      hook: 'maximum-value-two-input',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'param-2-max-value',
          label: '',
          tests: tests.valueTests,
          modelKey: 'p2Max',
          valueType: 'number',
          value: this.model.p2Max
        });
      }
    },
    param2StepValueInput: {
      hook: 'step-two-input',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'param-2-step-value',
          label: '',
          tests: tests.valueTests,
          modelKey: 'p2Steps',
          valueType: 'number',
          value: this.model.p2Steps
        });
      }
    },
  }
});

/***/ }),

/***/ "./client/views/parameters-viewer.js":
/*!*******************************************!*\
  !*** ./client/views/parameters-viewer.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var ViewParameter = __webpack_require__(/*! ./view-parameter */ "./client/views/view-parameter.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/parametersViewer.pug */ "./client/templates/includes/parametersViewer.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ViewParameter, this.queryByHook('parameter-list'))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/reactions-viewer.js":
/*!******************************************!*\
  !*** ./client/views/reactions-viewer.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var ViewReactions = __webpack_require__(/*! ./view-reactions */ "./client/views/view-reactions.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/reactionsViewer.pug */ "./client/templates/includes/reactionsViewer.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ViewReactions, this.queryByHook('reaction-list'))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/rules-viewer.js":
/*!**************************************!*\
  !*** ./client/views/rules-viewer.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var ViewRules = __webpack_require__(/*! ./view-rules */ "./client/views/view-rules.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/rulesViewer.pug */ "./client/templates/includes/rulesViewer.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ViewRules, this.queryByHook('rules-list'))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/simulation-settings-viewer.js":
/*!****************************************************!*\
  !*** ./client/views/simulation-settings-viewer.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/simulationSettingsViewer.pug */ "./client/templates/includes/simulationSettingsViewer.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeSettingsCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.algorithm = this.model.algorithm === "Hybrid-Tau-Leaping" ?
      "Algorithm: Hybrid ODE/SSA" : "Algorithm: " + this.model.algorithm
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var algorithm = this.model.algorithm
    if(algorithm === "ODE" || algorithm === "Hybrid-Tau-Leaping"){
      $(this.queryByHook('deterministic')).collapse('show')
    }
    if(algorithm === "SSA" || algorithm === "Tau-Leaping" || algorithm === "Hybrid-Tau-Leaping"){
      $(this.queryByHook('stochastic')).collapse('show')
      if(algorithm === "SSA"){
        $(this.queryByHook('SSA')).collapse('show')
      }else{
        $(this.queryByHook('Tau')).collapse('show')
      }
    }
  },
  changeSettingsCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/simulation-settings.js":
/*!*********************************************!*\
  !*** ./client/views/simulation-settings.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//support files
var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/simulationSettings.pug */ "./client/templates/includes/simulationSettings.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' :  'changeCollapseButtonText',
    'change [data-hook=select-ode]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-ssa]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-tau-leaping]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-hybrid-tau]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-automatic]' : 'handleSelectSimulationAlgorithmClick',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.model = attrs.model;
    this.tooltips = Tooltips.simulationSettings
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(!this.model.isAutomatic){
      $(this.queryByHook('select-ode')).prop('checked', Boolean(this.model.algorithm === "ODE"));
      $(this.queryByHook('select-ssa')).prop('checked', Boolean(this.model.algorithm === "SSA")); 
      $(this.queryByHook('select-tau-leaping')).prop('checked', Boolean(this.model.algorithm === "Tau-Leaping"));
      $(this.queryByHook('select-hybrid-tau')).prop('checked', Boolean(this.model.algorithm === "Hybrid-Tau-Leaping"));
    }else{
      $(this.queryByHook('select-automatic')).prop('checked', this.model.isAutomatic);
      this.model.letUsChooseForYou();
    }
    this.disableInputFieldByAlgorithm();
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  update: function (e) {
  },
  updateValid: function () {
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  },
  handleSelectSimulationAlgorithmClick: function (e) {
    var value = e.target.dataset.name;
    this.setSimulationAlgorithm(value)
  },
  setSimulationAlgorithm: function (value) {
    this.model.isAutomatic = Boolean(value === 'Automatic')
    if(!this.model.isAutomatic){
      this.model.algorithm = value;
    }else{
      this.model.letUsChooseForYou();
    }
    this.disableInputFieldByAlgorithm();
  },
  disableInputFieldByAlgorithm: function () {
    var isAutomatic = this.model.isAutomatic
    var isODE = this.model.algorithm === "ODE";
    var isSSA = this.model.algorithm === "SSA";
    var isLeaping = this.model.algorithm === "Tau-Leaping";
    var isHybrid = this.model.algorithm === "Hybrid-Tau-Leaping";
    $(this.queryByHook("relative-tolerance")).find('input').prop('disabled', !(isODE || isHybrid || isAutomatic));
    $(this.queryByHook("absolute-tolerance")).find('input').prop('disabled', !(isODE || isHybrid || isAutomatic));
    $(this.queryByHook("trajectories")).find('input').prop('disabled', !(isSSA || isLeaping || isHybrid || isAutomatic));
    $(this.queryByHook("seed")).find('input').prop('disabled', !(isSSA || isLeaping || isHybrid || isAutomatic));
    $(this.queryByHook("tau-tolerance")).find('input').prop('disabled', !(isHybrid || isLeaping || isAutomatic));
  },
  subviews: {
    inputRelativeTolerance: {
      hook: 'relative-tolerance',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'relative-tolerance',
          label: '',
          tests: tests.valueTests,
          modelKey: 'relativeTol',
          valueType: 'number',
          value: this.model.relativeTol
        });
      },
    },
    inputAbsoluteTolerance: {
      hook: 'absolute-tolerance',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'absolute-tolerance',
          label: '',
          tests: tests.valueTests,
          modelKey: 'absoluteTol',
          valueType: 'number',
          value: this.model.absoluteTol
        });
      }
    },
    inputRealizations: {
      hook: 'trajectories',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'realizations',
          label: '',
          tests: tests.valueTests,
          modelKey: 'realizations',
          valueType: 'number',
          value: this.model.parent.isPreview ? 1 : this.model.realizations
        });
      },
    },
    inputSeed: {
      hook: 'seed',
      prepareView: function () {
        return new InputView({
          parent: this,
          required: true,
          name: 'seed',
          label: '',
          tests: '',
          modelKey: 'seed',
          valueType: 'number',
          value: this.model.seed
        });
      },
    },
    inputTauTolerance: {
      hook: 'tau-tolerance',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'Tau-Tolerance',
          label: '',
          tests: tests.valueTests,
          modelKey: 'tauTol',
          valueType: 'number',
          value: this.model.tauTol
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/species-viewer.js":
/*!****************************************!*\
  !*** ./client/views/species-viewer.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var ViewSpecie = __webpack_require__(/*! ./view-specie */ "./client/views/view-specie.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/speciesViewer.pug */ "./client/templates/includes/speciesViewer.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ViewSpecie, this.queryByHook('specie-list'))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/view-event-assignments.js":
/*!************************************************!*\
  !*** ./client/views/view-event-assignments.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/viewEventAssignments.pug */ "./client/templates/includes/viewEventAssignments.pug");

module.exports = View.extend({
  template: template,
});

/***/ }),

/***/ "./client/views/view-events.js":
/*!*************************************!*\
  !*** ./client/views/view-events.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var AssignmentsViewer = __webpack_require__(/*! ./event-assignments-viewer */ "./client/views/event-assignments-viewer.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/viewEvents.pug */ "./client/templates/includes/viewEvents.pug");

module.exports = View.extend({
  template: template,
  bindings: {
    'model.initialValue': {
      hook: 'event-trigger-init-value',
      type: 'booleanAttribute',
      name: 'checked',
    },
    'model.persistent': {
      hook: 'event-trigger-persistent',
      type: 'booleanAttribute',
      name: 'checked',
    },
    'model.useValuesFromTriggerTime': {
      hook: 'use-values-from-trigger-time',
      type: 'booleanAttribute',
      name: 'checked',
    },
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.delay = this.model.delay === "" ? "None" : this.model.delay
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var assignmentsViewer = new AssignmentsViewer({
      collection: this.model.eventAssignments
    });
    this.registerRenderSubview(assignmentsViewer, 'assignment-viewer');
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
});

/***/ }),

/***/ "./client/views/view-parameter.js":
/*!****************************************!*\
  !*** ./client/views/view-parameter.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/viewParameters.pug */ "./client/templates/includes/viewParameters.pug");

module.exports = View.extend({
  template: template,
});

/***/ }),

/***/ "./client/views/view-reactions.js":
/*!****************************************!*\
  !*** ./client/views/view-reactions.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var katex = __webpack_require__(/*! katex */ "./node_modules/katex/dist/katex.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/viewReactions.pug */ "./client/templates/includes/viewReactions.pug");

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.rate = this.model.reactionType === "custom-propensity" ?
      this.model.propensity : this.model.rate.name
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    katex.render(this.model.summary, this.queryByHook('summary'), {
      displayMode: true,
      output: 'mathml'
    });
  },
});

/***/ }),

/***/ "./client/views/view-rules.js":
/*!************************************!*\
  !*** ./client/views/view-rules.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/viewRules.pug */ "./client/templates/includes/viewRules.pug");

module.exports = View.extend({
  template: template,
});

/***/ }),

/***/ "./client/views/view-specie.js":
/*!*************************************!*\
  !*** ./client/views/view-specie.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/viewSpecies.pug */ "./client/templates/includes/viewSpecies.pug");

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.switchingValWithLabel = this.model.isSwitchTol ? 
      "Switching Tolerance: " + this.model.switchTol :
      "Minimum Value For Switching: " + this.model.switchMin
  },
});

/***/ }),

/***/ "./client/views/workflow-editor.js":
/*!*****************************************!*\
  !*** ./client/views/workflow-editor.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var SimSettingsView = __webpack_require__(/*! ./simulation-settings */ "./client/views/simulation-settings.js");
var ParamSweepSettingsView = __webpack_require__(/*! ./parameter-sweep-settings */ "./client/views/parameter-sweep-settings.js");
var WorkflowStateButtonsView = __webpack_require__(/*! ./workflow-state-buttons */ "./client/views/workflow-state-buttons.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/workflowEditor.pug */ "./client/templates/includes/workflowEditor.pug");

module.exports = View.extend({
  template: template,
  events: {
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.type = attrs.type;
    this.status = attrs.status;
  },
  update: function (e) {
  },
  updateValid: function (e) {
  },
  render: function() {
    View.prototype.render.apply(this, arguments);
    if(this.status === "new" || this.status === "ready"){
      this.renderSimulationSettingView()
      if(this.type === "parameterSweep"){
        this.validatePsweep()
        this.renderParameterSweepSettingsView()
      }
      this.renderWorkflowStateButtons()
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  renderSimulationSettingView: function () {
    let simulationSettingsView = new SimSettingsView({
      parent: this,
      model: this.model.simulationSettings,
    });
    this.registerRenderSubview(simulationSettingsView, 'sim-settings-container');
  },
  renderParameterSweepSettingsView: function () {
    let parameterSweepSettingsView = new ParamSweepSettingsView({
      parent: this,
      model: this.model.parameterSweepSettings,
    });
    this.registerRenderSubview(parameterSweepSettingsView, 'param-sweep-settings-container');
  },
  renderWorkflowStateButtons: function () {
    let workflowStateButtons = new WorkflowStateButtonsView({
      model: this.model,
      type: this.type,
    });
    this.registerRenderSubview(workflowStateButtons, 'workflow-state-buttons-container');
  },
  validatePsweep: function () {
    let species = this.model.species;
    var valid = this.validatePsweepChild(species, this.model.parameterSweepSettings.speciesOfInterest)
    if(!valid) // if true update species of interest
      this.model.parameterSweepSettings.speciesOfInterest = species.at(0)
    var parameters = this.model.parameters;
    var valid = this.validatePsweepChild(parameters, this.model.parameterSweepSettings.parameterOne)
    if(!valid) { // if true update parameter one
      let param = parameters.at(0)
      this.model.parameterSweepSettings.parameterOne = param
      let val = eval(param.expression)
      this.model.parameterSweepSettings.p1Min = val * 0.5
      this.model.parameterSweepSettings.p1Max = val * 1.5
    }
    if(parameters.at(1)){ // is there more than one parameter
      var valid = this.validatePsweepChild(parameters, this.model.parameterSweepSettings.parameterTwo)
      if(!valid){ // if true update parameter 2
        let param = parameters.at(1)
        this.model.parameterSweepSettings.parameterTwo = param
        let val = eval(param.expression)
        this.model.parameterSweepSettings.p2Min = val * 0.5
        this.model.parameterSweepSettings.p2Max = val * 1.5
      }
    }
  },
  validatePsweepChild: function (collection, child) {
    if(!child.compID) // if true child is not set
      return false
    let exists = Boolean(collection.filter(function (model) {
      if(child.compID === model.compID)
        return model
    }).length) // if true child exits within the model
    return exists
  },
  collapseContainer: function () {
    $(this.queryByHook("workflow-editor-container")).collapse();
  },
});

/***/ }),

/***/ "./client/views/workflow-info.js":
/*!***************************************!*\
  !*** ./client/views/workflow-info.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
var xhr = __webpack_require__(/*! xhr */ "./node_modules/xhr/index.js");
var app = __webpack_require__(/*! ../app */ "./client/app.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//tempates
var template = __webpack_require__(/*! ../templates/includes/workflowInfo.pug */ "./client/templates/includes/workflowInfo.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.status = attrs.status;
    this.logsPath = attrs.logsPath;
    var self = this
    this.listOfWarnings = [];
    this.listOfErrors = [];
    this.listOfNotes = [];
    if(this.status === 'complete' || this.status === 'error'){
      var endpoint = path.join(app.getApiPath(), "/workflow/workflow-logs", this.logsPath)
      xhr({uri: endpoint}, function (err, response, body) {
        if(response.statusCode < 400){
          var logs = body.split("\n")
          logs.forEach(self.parseLogs, self)
          self.expandLogContainers();
        }else{
          body = JSON.parse(body)
        }
      });
    }
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.status === 'complete'){
      this.enableCollapseButton()
    }else if(this.status === 'error'){
      this.expandInfoContainer()
    }
  },
  parseLogs: function (log) {
    var message = log.split('root - ').pop()
    if(message.startsWith("WARNING")){
      this.listOfWarnings.push(message.split("WARNING").pop())
    }else if(message.startsWith("ERROR")){
      this.listOfErrors.push(message.split("ERROR").pop())
    }else if(message.startsWith("CRITICAL")){
      this.listOfErrors.push(message.split("CRITICAL").pop())
    }else{
      this.listOfNotes.push(message)
    }
  },
  enableCollapseButton: function () {
    $(this.queryByHook('collapse')).prop('disabled', false);
  },
  expandInfoContainer: function () {
    this.enableCollapseButton();
    $(this.queryByHook('workflow-info')).collapse('show');
    this.changeCollapseButtonText("collapse")
  },
  expandLogContainers: function () {
    if(this.listOfWarnings.length) {
      $(this.queryByHook('workflow-warnings')).collapse('show');
      var listOfWarnings = "<p>" + this.listOfWarnings.join('<br>') + "</p>";
      $(this.queryByHook('list-of-warnings')).html(listOfWarnings);
    }
    if(this.listOfErrors.length) {
      $(this.queryByHook('workflow-errors')).collapse('show');
      var listOfErrors = "<p>" + this.listOfErrors.join('<br>') + "</p>";
      $(this.queryByHook('list-of-errors')).html(listOfErrors);
    }
    if(this.listOfNotes.length) {
      $(this.queryByHook('workflow-statistics')).collapse('show');
      var listOfNotes = "<p>" + this.listOfNotes.join('<br>') + "</p>";
      $(this.queryByHook('list-of-notes')).html(listOfNotes);
    }
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook("collapse")).text();
    text === '+' ? $(this.queryByHook("collapse")).text('-') : $(this.queryByHook("collapse")).text('+');
  },
});


/***/ }),

/***/ "./client/views/workflow-results.js":
/*!******************************************!*\
  !*** ./client/views/workflow-results.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
var xhr = __webpack_require__(/*! xhr */ "./node_modules/xhr/index.js");
//support files
var Plotly = __webpack_require__(/*! ../lib/plotly */ "./client/lib/plotly.js");
var app = __webpack_require__(/*! ../app */ "./client/app.js");
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
//templates
var gillespyResultsTemplate = __webpack_require__(/*! ../templates/includes/gillespyResults.pug */ "./client/templates/includes/gillespyResults.pug");
var gillespyResultsEnsembleTemplate = __webpack_require__(/*! ../templates/includes/gillespyResultsEnsemble.pug */ "./client/templates/includes/gillespyResultsEnsemble.pug");
var parameterSweepResultsTemplate = __webpack_require__(/*! ../templates/includes/parameterSweepResults.pug */ "./client/templates/includes/parameterSweepResults.pug");

module.exports = View.extend({
  events: {
    'click [data-hook=collapse-stddevrange]' : function () {
      this.changeCollapseButtonText("collapse-stddevrange");
    },
    'click [data-hook=collapse-trajectories]' : function () {
      this.changeCollapseButtonText("collapse-trajectories");
    },
    'click [data-hook=collapse-stddev]' : function () {
      this.changeCollapseButtonText("collapse-stddev");
    },
    'click [data-hook=collapse-trajmean]' : function () {
      this.changeCollapseButtonText("collapse-trajmean");
    },
    'click [data-hook=collapse-psweep]' : function () {
       this.changeCollapseButtonText("collapse-psweep");
     },
    'click [data-hook=collapse]' : function () {
      this.changeCollapseButtonText("collapse");
    },
    'change [data-hook=title]' : 'setTitle',
    'change [data-hook=xaxis]' : 'setXAxis',
    'change [data-hook=yaxis]' : 'setYAxis',
    'change [data-hook=specie-of-interest-list]' : 'getPlotForSpecies',
    'change [data-hook=feature-extraction-list]' : 'getPlotForFeatureExtractor',
    'change [data-hook=ensemble-aggragator-list]' : 'getPlotForEnsembleAggragator',
    'click [data-hook=plot]' : function (e) {
      var type = e.target.id
      if(this.plots[type]) {
        $(this.queryByHook("edit-plot-args")).collapse("show");
      }else{
        this.getPlot(type);
        e.target.innerText = "Edit Plot"
      }
    },
    'click [data-hook=download-png-custom]' : function (e) {
      var type = e.target.id;
      this.clickDownloadPNGButton(type)
    },
    'click [data-hook=download-json]' : function (e) {
      var type = e.target.id;
      this.exportToJsonFile(this.plots[type], type)
    },
    'click [data-hook=download-results-csv]' : 'handlerDownloadResultsCsvClick',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.parameterSweepResults
    this.trajectories = attrs.trajectories;
    this.status = attrs.status;
    this.species = attrs.species;
    this.type = attrs.type;
    this.speciesOfInterest = attrs.speciesOfInterest;
    this.featureExtractor = "final";
    this.ensembleAggragator = "avg";
    this.plots = {}
    this.plotArgs = {}
  },
  render: function () {
    if(this.type === "parameterSweep"){
      this.template = parameterSweepResultsTemplate
    }else{
      this.template = this.trajectories > 1 ? gillespyResultsEnsembleTemplate : gillespyResultsTemplate
    }
    View.prototype.render.apply(this, arguments);
    if(this.status === 'complete'){
      this.expandContainer()
    }
    var speciesNames = this.species.map(function (specie) { return specie.name});
    var featureExtractors = ["Minimum of population", "Maximum of population", "Average of population", "Variance of population", "Population at last time point"]
    var ensembleAggragators = ["Minimum of ensemble", "Maximum of ensemble", "Average of ensemble", "Variance of ensemble"]
    var speciesOfInterestView = new SelectView({
      label: '',
      name: 'species-of-interest',
      required: true,
      idAttribute: 'cid',
      options: speciesNames,
      value: this.speciesOfInterest
    });
    var featureExtractorView = new SelectView({
      label: '',
      name: 'feature-extractor',
      requires: true,
      idAttribute: 'cid',
      options: featureExtractors,
      value: "Population at last time point"
    });
    var ensembleAggragatorView = new SelectView({
      label: '',
      name: 'ensemble-aggragator',
      requires: true,
      idAttribute: 'cid',
      options: ensembleAggragators,
      value: "Average of ensemble"
    });
    if(this.type === "parameterSweep"){
      this.registerRenderSubview(speciesOfInterestView, 'specie-of-interest-list');
      this.registerRenderSubview(featureExtractorView, 'feature-extraction-list');
      this.registerRenderSubview(ensembleAggragatorView, 'ensemble-aggragator-list');
      if(this.trajectories <= 1){
        $(this.queryByHook('ensemble-aggragator-list')).find('select').prop('disabled', true);
      }
    }
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  update: function () {
  },
  updateValid: function () {
  },
  changeCollapseButtonText: function (source) {
    var text = $(this.queryByHook(source)).text();
    text === '+' ? $(this.queryByHook(source)).text('-') : $(this.queryByHook(source)).text('+');
  },
  setTitle: function (e) {
    this.plotArgs['title'] = e.target.value
    for (var type in this.plots) {
      var fig = this.plots[type]
      fig.layout.title.text = e.target.value
      this.plotFigure(fig, type)
    }
  },
  setYAxis: function (e) {
    this.plotArgs['yaxis'] = e.target.value
    for (var type in this.plots) {
      var fig = this.plots[type]
      fig.layout.yaxis.title.text = e.target.value
      this.plotFigure(fig, type)
    }
  },
  setXAxis: function (e) {
    this.plotArgs['xaxis'] = e.target.value
    for (var type in this.plots) {
      var fig = this.plots[type]
      fig.layout.xaxis.title.text = e.target.value
      this.plotFigure(fig, type)
    }
  },
  getPlot: function (type) {
    var self = this;
    var el = this.queryByHook(type)
    Plotly.purge(el)
    var data = {}
    if(type === 'psweep'){
      let key = this.getPsweepKey()
      data['plt_key'] = key;
    }else{
      data['plt_key'] = type;
    }
    if(Object.keys(this.plotArgs).length){
      data['plt_data'] = this.plotArgs
    }else{
      data['plt_data'] = "None"
    }
    var endpoint = path.join(app.getApiPath(), "/workflow/plot-results", this.parent.wkflPath, '?data=' + JSON.stringify(data));
    xhr({url: endpoint, json: true}, function (err, response, body){
      if(response.statusCode >= 400){
        $(self.queryByHook(type)).html(body.Message)
      }else{
        self.plots[type] = body
        self.plotFigure(body, type);
      }
    });
  },
  plotFigure: function (figure, type) {
    var self = this;
    var hook = type;
    var el = this.queryByHook(hook)
    Plotly.newPlot(el, figure)
    this.queryAll("#" + type).forEach(function (el) {
      if(el.disabled){
        el.disabled = false;
      }
    });
  },
  clickDownloadPNGButton: function (type) {
    var pngButton = $('div[data-hook*='+type+'] a[data-title*="Download plot as a png"]')[0]
    pngButton.click()
  },
  exportToJsonFile: function (jsonData, plotType) {
    let dataStr = JSON.stringify(jsonData);
    let dataURI = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = plotType + '-plot.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  handlerDownloadResultsCsvClick: function (e) {
    let path = this.parent.wkflPath
    this.getExportData(path)
  },
  getExportData: function (wkflPath) {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "file/download-zip/resultscsv", wkflPath)
    console.log(endpoint)
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        self.exportToZipFile(body.Path)
      }
    });
  },
  exportToZipFile: function (resultsPath) {
    var endpoint = path.join("files", resultsPath);
    // console.log(endpoint)
    // console.log("http://127.0.0.1:8888/edit/Examples/Michaelis_Menten/Michaelis_Menten_04172020_121031.wkfl/results/results_csv_04172020_121031.zip")
    window.location.href = endpoint
  },
  expandContainer: function () {
    $(this.queryByHook('workflow-results')).collapse('show');
    $(this.queryByHook('collapse')).prop('disabled', false);
    this.changeCollapseButtonText("collapse")
    if(this.type === "parameterSweep"){
      this.getPlot("psweep")
    }else{
      this.trajectories > 1 ? this.getPlot("stddevran") : this.getPlot("trajectories")
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  getPlotForSpecies: function (e) {
    this.speciesOfInterest = e.target.selectedOptions.item(0).text;
    this.getPlot('psweep')
  },
  getPlotForFeatureExtractor: function (e) {
    var featureExtractors = {"Minimum of population":"min", 
                             "Maximum of population":"max", 
                             "Average of population":"avg", 
                             "Variance of population":"var", 
                             "Population at last time point":"final"}
    var value = e.target.selectedOptions.item(0).text;
    this.featureExtractor = featureExtractors[value]
    this.getPlot('psweep')
  },
  getPlotForEnsembleAggragator: function (e) {
    var ensembleAggragators = {"Minimum of ensemble":"min", 
                               "Maximum of ensemble":"max", 
                               "Average of ensemble":"avg", 
                               "Variance of ensemble":"var"}
    var value = e.target.selectedOptions.item(0).text;
    this.ensembleAggragator = ensembleAggragators[value]
    this.getPlot('psweep')
  },
  getPsweepKey: function () {
    let key = this.speciesOfInterest + "-" + this.featureExtractor
    if(this.trajectories > 1){
      key += ("-" + this.ensembleAggragator)
    }
    return key
  },
  subviews: {
    inputTitle: {
      hook: 'title',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'title',
          label: '',
          tests: '',
          modelKey: null,
          valueType: 'string',
          value: this.plotArgs.title || "",
        });
      },
    },
    inputXAxis: {
      hook: 'xaxis',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'xaxis',
          label: '',
          tests: '',
          modelKey: null,
          valueType: 'string',
          value: this.plotArgs.xaxis || "",
        });
      },
    },
    inputYAxis: {
      hook: 'yaxis',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'yaxis',
          label: '',
          tests: '',
          modelKey: null,
          valueType: 'string',
          value: this.plotArgs.yaxis || "",
        });
      },
    },
  },
});


/***/ }),

/***/ "./client/views/workflow-state-buttons.js":
/*!************************************************!*\
  !*** ./client/views/workflow-state-buttons.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

let app = __webpack_require__(/*! ../app */ "./client/app.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var xhr = __webpack_require__(/*! xhr */ "./node_modules/xhr/index.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/workflowStateButtons.pug */ "./client/templates/includes/workflowStateButtons.pug");

let modelSaveErrorHtml = (title, error) => {
  return `
    <div id="modelSaveErrorModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> ${title} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${error} </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
}

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=start-workflow]'  : 'clickStartWorkflowHandler',
    'click [data-hook=edit-model]' : 'clickEditModelHandler',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.type = attrs.type
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  clickSaveHandler: function (e) {
    this.saving();
    var self = this;
    var model = this.model
    var optType = document.URL.endsWith(".mdl") ? "sn" : "se";
    this.saveModel(function () {
      let query = JSON.stringify({"type":self.type,"optType":optType,"mdlPath":model.directory,"wkflPath":self.parent.parent.wkflPath})
      var endpoint = path.join(app.getApiPath(), 'workflow/save-workflow') + "?data=" + query;
      xhr({uri: endpoint}, function (err, response, body) {
        self.saved();
        if(document.URL.endsWith('.mdl')){
          self.parent.parent.reloadWkfl(); 
        }
      });
    });
  },
  clickStartWorkflowHandler: function (e) {
    this.saveModel(this.runWorkflow.bind(this));
  },
  clickEditModelHandler: function (e) {
    var self = this
    this.saveModel(function () {
      window.location.href = path.join(app.getBasePath(), "stochss/models/edit", self.model.directory);
    });
  },
  saveModel: function (cb) {
    // this.model is a ModelVersion, the parent of the collection is Model
    let self = this
    if(this.model.simulationSettings.isAutomatic){
      this.model.simulationSettings.letUsChooseForYou();
    }
    var model = this.model;
    if (cb) {
      model.save(model.attributes, {
        success: cb,
        error: function (model, response, options) {
          console.error("Error saving model:", model);
          console.error("Response:", response);
          self.saveError()
          let title = response.body.Reason
          let error = response.body.Message
          var saveErrorModal = $(modelSaveErrorHtml(title, error)).modal()
        },
      });
    } else {
      model.saveModel();
    }
  },
  saving: function () {
    var saving = this.queryByHook('saving-workflow');
    var saved = this.queryByHook('saved-workflow');
    var saveError = this.queryByHook('save-error');
    saved.style.display = "none";
    saveError.style.display = "none";
    saving.style.display = "inline-block";
  },
  saved: function () {
    var saving = this.queryByHook('saving-workflow');
    var saved = this.queryByHook('saved-workflow');
    saving.style.display = "none";
    saved.style.display = "inline-block";
  },
  saveError: function () {
    var saving = this.queryByHook('saving-workflow');
    var saveError = this.queryByHook('save-error');
    saving.style.display = "none";
    saveError.style.display = "inline-block";
  },
  runWorkflow: function () {
    var self = this;
    var model = this.model;
    var optType = document.URL.endsWith(".mdl") ? "rn" : "re";
    var query = {"type":this.type,"optType":"s"+optType,"mdlPath":model.directory,"wkflPath":self.parent.parent.wkflPath}
    let initQuery = JSON.stringify(query)
    var initEndpoint = path.join(app.getApiPath(), '/workflow/save-workflow') + "?data=" + initQuery;
    query.optType = optType
    let runQuery = JSON.stringify(query)
    var runEndpoint = path.join(app.getApiPath(), '/workflow/run-workflow') + "?data=" + runQuery;
    this.saving()
    console.log(initQuery, runQuery, typeof query)
    xhr({uri: initEndpoint}, function (err, response, body) {
      if(response.statusCode < 400){
        self.saved()
        xhr({uri: runEndpoint}, function (err, response, body) {
          self.parent.parent.reloadWkfl();
        })
      }else{
        self.saveError()
      }
    });
  },
});


/***/ }),

/***/ "./client/views/workflow-status.js":
/*!*****************************************!*\
  !*** ./client/views/workflow-status.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/workflowStatus.pug */ "./client/templates/includes/workflowStatus.pug");


module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    var localDate = new Date(attrs.startTime)
    var localStartTime = this.getFormattedDate(localDate)
    this.startTime = localStartTime;
    this.status = attrs.status;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.status !== 'ready' && this.status !== 'new'){
      this.expandContainer()
    }
  },
  expandContainer: function () {
    $(this.queryByHook('workflow-status')).collapse('show');
    $(this.queryByHook('collapse')).prop('disabled', false);
    this.changeCollapseButtonText()
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
  getFormattedDate: function (date) {
    var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
    var month = months[date.getMonth()]; // get the abriviated month
    var year = date.getFullYear();
    var day = date.getDate();
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM'; // get AM or PM based on hours
    hours = hours%12; // format hours to 12 hour time format
    hours = hours ? hours : 12; // replace 0 with 12
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes; // format minutes to always have two chars
    var timeZone = date.toString().split(' ').pop() // get the timezone from the date
    timeZone = timeZone.replace('(', '').replace(')', '') // remove the '()' from the timezone
    return  month + " " + day + ", " + year + "  " + hours + ":" + minutes + " " + ampm + " " + timeZone;
  },
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL3dvcmtmbG93LW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudEFzc2lnbm1lbnRzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50c1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9naWxsZXNweVJlc3VsdHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZ2lsbGVzcHlSZXN1bHRzRW5zZW1ibGUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxTZXR0aW5nc1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFJlc3VsdHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFNldHRpbmdzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3J1bGVzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3NpbXVsYXRpb25TZXR0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BlY2llc1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRBc3NpZ25tZW50cy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdQYXJhbWV0ZXJzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdSZWFjdGlvbnMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1J1bGVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdTcGVjaWVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93RWRpdG9yLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93SW5mby5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXRlQnV0dG9ucy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXR1cy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9wYWdlcy93b3JrZmxvd01hbmFnZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9ldmVudC1hc3NpZ25tZW50cy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50cy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL21vZGVsLXNldHRpbmdzLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvbW9kZWwtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3Mtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3BhcmFtZXRlcnMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9yZWFjdGlvbnMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9ydWxlcy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3NpbXVsYXRpb24tc2V0dGluZ3Mtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zaW11bGF0aW9uLXNldHRpbmdzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zcGVjaWVzLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ldmVudC1hc3NpZ25tZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3ZpZXctcGFyYW1ldGVyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy92aWV3LXJlYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ydWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3dvcmtmbG93LWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctaW5mby5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctcmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctc3RhdGUtYnV0dG9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRLG9CQUFvQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBLDBCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUJBQXVCO0FBQ3ZDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3ZKQTtBQUFBO0FBQUEsUUFBUSxtQkFBTyxDQUFDLDJEQUFZO0FBQzVCLFFBQVEsbUJBQU8sQ0FBQyxvREFBUTtBQUN4QixZQUFZLG1CQUFPLENBQUMsK0NBQWdCO0FBQ3BDLFdBQVcsbUJBQU8sQ0FBQyxxREFBTTtBQUN6QixVQUFVLG1CQUFPLENBQUMsd0NBQUs7QUFDdkIsVUFBVSxtQkFBTyxDQUFDLCtCQUFRO0FBQzFCO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLHNDQUFRO0FBQy9CLHlCQUF5QixtQkFBTyxDQUFDLG1FQUEwQjtBQUMzRCx5QkFBeUIsbUJBQU8sQ0FBQyxtRUFBMEI7QUFDM0QsMEJBQTBCLG1CQUFPLENBQUMscUVBQTJCO0FBQzdELGtCQUFrQixtQkFBTyxDQUFDLDZEQUF1QjtBQUNqRCxlQUFlLG1CQUFPLENBQUMsK0RBQXdCO0FBQy9DLGdCQUFnQixtQkFBTyxDQUFDLCtDQUFnQjtBQUN4QztBQUNBLFlBQVksbUJBQU8sQ0FBQyxpREFBaUI7QUFDckM7QUFDQSxlQUFlLG1CQUFPLENBQUMsNEZBQXdDOztBQUU5Qjs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLE1BQU07QUFDN0M7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFFBQVE7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsMEJBQTBCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsU0FBUyxjQUFjO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVELHdEQUFROzs7Ozs7Ozs7Ozs7QUM3VFIsVUFBVSxtQkFBTyxDQUFDLHVGQUE2Qzs7QUFFL0QsMkJBQTJCLGtDQUFrQyxhQUFhLGdXQUFnVztBQUMxYSwwQjs7Ozs7Ozs7Ozs7QUNIQSxVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsMC9CQUEwL0I7QUFDcGtDLDBCOzs7Ozs7Ozs7OztBQ0hBLFVBQVUsbUJBQU8sQ0FBQyx1RkFBNkM7O0FBRS9ELDJCQUEyQixrQ0FBa0MsYUFBYSxzdUVBQXN1RTtBQUNoekUsMEI7Ozs7Ozs7Ozs7O0FDSEEsVUFBVSxtQkFBTyxDQUFDLHVGQUE2Qzs7QUFFL0QsMkJBQTJCLGtDQUFrQyxhQUFhLHM5SkFBczlKO0FBQ2hpSywwQjs7Ozs7Ozs7Ozs7QUNIQSxVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsK3JDQUErckM7QUFDendDLDBCOzs7Ozs7Ozs7OztBQ0hBLFVBQVUsbUJBQU8sQ0FBQyx1RkFBNkM7O0FBRS9ELDJCQUEyQixrQ0FBa0MsYUFBYSxtdENBQW10QztBQUM3eEMsMEI7Ozs7Ozs7Ozs7O0FDSEEsVUFBVSxtQkFBTyxDQUFDLHVGQUE2Qzs7QUFFL0QsMkJBQTJCLGtDQUFrQyxhQUFhLGtnTEFBa2dMO0FBQzVrTCwwQjs7Ozs7Ozs7Ozs7QUNIQSxVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsMGxTQUEwbFM7QUFDcHFTLDBCOzs7Ozs7Ozs7OztBQ0hBLFVBQVUsbUJBQU8sQ0FBQyx1RkFBNkM7O0FBRS9ELDJCQUEyQixrQ0FBa0MsYUFBYSwyZkFBMmYsc3lEQUFzeUQ7QUFDMzJFLDBCOzs7Ozs7Ozs7OztBQ0hBLFVBQVUsbUJBQU8sQ0FBQyx1RkFBNkM7O0FBRS9ELDJCQUEyQixrQ0FBa0MsYUFBYSxnekJBQWd6QjtBQUMxM0IsMEI7Ozs7Ozs7Ozs7O0FDSEEsVUFBVSxtQkFBTyxDQUFDLHVGQUE2Qzs7QUFFL0QsMkJBQTJCLGtDQUFrQyxhQUFhLG80QkFBbzRCO0FBQzk4QiwwQjs7Ozs7Ozs7Ozs7QUNIQSxVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsbzdCQUFvN0I7QUFDOS9CLDBCOzs7Ozs7Ozs7OztBQ0hBLFVBQVUsbUJBQU8sQ0FBQyx1RkFBNkM7O0FBRS9ELDJCQUEyQixrQ0FBa0MsYUFBYSxnNllBQWc2WTtBQUMxK1ksMEI7Ozs7Ozs7Ozs7O0FDSEEsVUFBVSxtQkFBTyxDQUFDLHVGQUE2Qzs7QUFFL0QsMkJBQTJCLGtDQUFrQyxhQUFhLGdmQUFnZixzN0VBQXM3RTtBQUNoL0YsMEI7Ozs7Ozs7Ozs7O0FDSEEsVUFBVSxtQkFBTyxDQUFDLHVGQUE2Qzs7QUFFL0QsMkJBQTJCLGtDQUFrQyxhQUFhLDYrQkFBNitCO0FBQ3ZqQywwQjs7Ozs7Ozs7Ozs7QUNIQSxVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsMlNBQTJTO0FBQ3JYLDBCOzs7Ozs7Ozs7OztBQ0hBLFVBQVUsbUJBQU8sQ0FBQyx1RkFBNkM7O0FBRS9ELDJCQUEyQixrQ0FBa0MsYUFBYSx5cERBQXlwRDtBQUNudUQsMEI7Ozs7Ozs7Ozs7O0FDSEEsVUFBVSxtQkFBTyxDQUFDLHVGQUE2Qzs7QUFFL0QsMkJBQTJCLGtDQUFrQyxhQUFhLGtTQUFrUztBQUM1VywwQjs7Ozs7Ozs7Ozs7QUNIQSxVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsa1hBQWtYO0FBQzViLDBCOzs7Ozs7Ozs7OztBQ0hBLFVBQVUsbUJBQU8sQ0FBQyx1RkFBNkM7O0FBRS9ELDJCQUEyQixrQ0FBa0MsYUFBYSwyZ0JBQTJnQjtBQUNybEIsMEI7Ozs7Ozs7Ozs7O0FDSEEsVUFBVSxtQkFBTyxDQUFDLHVGQUE2Qzs7QUFFL0QsMkJBQTJCLGtDQUFrQyxhQUFhLHdnQkFBd2dCO0FBQ2xsQiwwQjs7Ozs7Ozs7Ozs7QUNIQSxVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsNm5CQUE2bkI7QUFDdnNCLDBCOzs7Ozs7Ozs7OztBQ0hBLFVBQVUsbUJBQU8sQ0FBQyx1RkFBNkM7O0FBRS9ELDJCQUEyQixrQ0FBa0MsYUFBYSxvbENBQW9sQztBQUM5cEMsMEI7Ozs7Ozs7Ozs7O0FDSEEsVUFBVSxtQkFBTyxDQUFDLHVGQUE2Qzs7QUFFL0QsMkJBQTJCLGtDQUFrQyxhQUFhLHM2QkFBczZCO0FBQ2gvQiwwQjs7Ozs7Ozs7Ozs7QUNIQSxVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsbStCQUFtK0Isa1lBQWtZO0FBQy82QywwQjs7Ozs7Ozs7Ozs7QUNIQSxVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsK2hFQUEraEU7QUFDem1FLDBCOzs7Ozs7Ozs7OztBQ0hBO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLHVFQUFnQjtBQUNuQyxzQkFBc0IsbUJBQU8sQ0FBQywwRUFBMEI7QUFDeEQ7QUFDQSxlQUFlLG1CQUFPLENBQUMsZ0hBQWtEOztBQUV6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFOzs7Ozs7Ozs7OztBQ2ZELFFBQVEsbUJBQU8sQ0FBQyxvREFBUTtBQUN4QjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkMsZ0JBQWdCLG1CQUFPLENBQUMsb0RBQWU7QUFDdkM7QUFDQSxlQUFlLG1CQUFPLENBQUMsNEZBQXdDOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFOzs7Ozs7Ozs7OztBQ3ZCRCxRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEI7QUFDQSxXQUFXLG1CQUFPLENBQUMsdUVBQWdCO0FBQ25DO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLDBHQUErQzs7QUFFdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDLEU7Ozs7Ozs7Ozs7O0FDckJELFdBQVcsbUJBQU8sQ0FBQyxxREFBTTtBQUN6QixRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEI7QUFDQSxXQUFXLG1CQUFPLENBQUMsdUVBQWdCO0FBQ25DLG9CQUFvQixtQkFBTyxDQUFDLDBEQUFrQjtBQUM5Qyx1QkFBdUIsbUJBQU8sQ0FBQyxnRUFBcUI7QUFDcEQsc0JBQXNCLG1CQUFPLENBQUMsOERBQW9CO0FBQ2xELG1CQUFtQixtQkFBTyxDQUFDLHdEQUFpQjtBQUM1QyxrQkFBa0IsbUJBQU8sQ0FBQyxzREFBZ0I7QUFDMUMsMEJBQTBCLG1CQUFPLENBQUMsd0VBQXlCO0FBQzNELCtCQUErQixtQkFBTyxDQUFDLGtGQUE4QjtBQUNyRSxtQ0FBbUMsbUJBQU8sQ0FBQyw0RkFBbUM7QUFDOUU7QUFDQSxZQUFZLG1CQUFPLENBQUMsaURBQWlCO0FBQ3JDO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLDBGQUF1Qzs7QUFFOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDLEU7Ozs7Ozs7Ozs7O0FDcEZELFFBQVEsbUJBQU8sQ0FBQyxvREFBUTtBQUN4QjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkM7QUFDQSxlQUFlLG1CQUFPLENBQUMsNEhBQXdEOztBQUUvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFOzs7Ozs7Ozs7OztBQ2pDRCxRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEI7QUFDQSxZQUFZLG1CQUFPLENBQUMsd0NBQVM7QUFDN0IsZUFBZSxtQkFBTyxDQUFDLHlDQUFhO0FBQ3BDO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLHVFQUFnQjtBQUNuQyxnQkFBZ0IsbUJBQU8sQ0FBQyx3Q0FBUztBQUNqQyxpQkFBaUIsbUJBQU8sQ0FBQyw0RkFBdUI7QUFDaEQ7QUFDQSxlQUFlLG1CQUFPLENBQUMsZ0hBQWtEOztBQUV6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBELHVCQUF1QjtBQUNqRixzREFBc0Qsb0JBQW9CO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDLEU7Ozs7Ozs7Ozs7O0FDOU5ELFFBQVEsbUJBQU8sQ0FBQyxvREFBUTtBQUN4QjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkMsb0JBQW9CLG1CQUFPLENBQUMsMERBQWtCO0FBQzlDO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLG9HQUE0Qzs7QUFFbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRTs7Ozs7Ozs7Ozs7QUN2QkQsUUFBUSxtQkFBTyxDQUFDLG9EQUFRO0FBQ3hCO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLHVFQUFnQjtBQUNuQyxvQkFBb0IsbUJBQU8sQ0FBQywwREFBa0I7QUFDOUM7QUFDQSxlQUFlLG1CQUFPLENBQUMsa0dBQTJDOztBQUVsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFOzs7Ozs7Ozs7OztBQ3ZCRCxRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEI7QUFDQSxXQUFXLG1CQUFPLENBQUMsdUVBQWdCO0FBQ25DLGdCQUFnQixtQkFBTyxDQUFDLGtEQUFjO0FBQ3RDO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLDBGQUF1Qzs7QUFFOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRTs7Ozs7Ozs7Ozs7QUN2QkQsUUFBUSxtQkFBTyxDQUFDLG9EQUFRO0FBQ3hCO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLHVFQUFnQjtBQUNuQztBQUNBLGVBQWUsbUJBQU8sQ0FBQyxvSEFBb0Q7O0FBRTNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFOzs7Ozs7Ozs7OztBQ25DRCxRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEI7QUFDQSxZQUFZLG1CQUFPLENBQUMsd0NBQVM7QUFDN0IsZUFBZSxtQkFBTyxDQUFDLHlDQUFhO0FBQ3BDO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLHVFQUFnQjtBQUNuQyxnQkFBZ0IsbUJBQU8sQ0FBQyx3Q0FBUztBQUNqQztBQUNBLGVBQWUsbUJBQU8sQ0FBQyx3R0FBOEM7O0FBRXJFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlHO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVE7QUFDUixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUMsRTs7Ozs7Ozs7Ozs7QUMzSkQsUUFBUSxtQkFBTyxDQUFDLG9E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S0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFRO0FBQ1IsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTLDBCQUEwQjtBQUNuQztBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHlDQUF5QztBQUN6Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLDBCQUEwQjtBQUNuQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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RDtBQUNyRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFIiwiZmlsZSI6InN0b2Noc3Mtd29ya2Zsb3dFZGl0b3IuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbiBcdC8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcIndvcmtmbG93RWRpdG9yXCI6IDBcbiBcdH07XG5cbiBcdHZhciBkZWZlcnJlZE1vZHVsZXMgPSBbXTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0dmFyIGpzb25wQXJyYXkgPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gfHwgW107XG4gXHR2YXIgb2xkSnNvbnBGdW5jdGlvbiA9IGpzb25wQXJyYXkucHVzaC5iaW5kKGpzb25wQXJyYXkpO1xuIFx0anNvbnBBcnJheS5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2s7XG4gXHRqc29ucEFycmF5ID0ganNvbnBBcnJheS5zbGljZSgpO1xuIFx0Zm9yKHZhciBpID0gMDsgaSA8IGpzb25wQXJyYXkubGVuZ3RoOyBpKyspIHdlYnBhY2tKc29ucENhbGxiYWNrKGpzb25wQXJyYXlbaV0pO1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSBvbGRKc29ucEZ1bmN0aW9uO1xuXG5cbiBcdC8vIGFkZCBlbnRyeSBtb2R1bGUgdG8gZGVmZXJyZWQgbGlzdFxuIFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2goW1wiLi9jbGllbnQvcGFnZXMvd29ya2Zsb3ctbWFuYWdlci5qc1wiLFwiY29tbW9uXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwidmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHRlc3RzID0gcmVxdWlyZSgnLi4vdmlld3MvdGVzdHMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIHhociA9IHJlcXVpcmUoJ3hocicpO1xudmFyIGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuLy92aWV3c1xudmFyIFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi9iYXNlJyk7XG52YXIgV29ya2Zsb3dFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3Mvd29ya2Zsb3ctZWRpdG9yJyk7XG52YXIgV29ya2Zsb3dTdGF0dXNWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3Mvd29ya2Zsb3ctc3RhdHVzJyk7XG52YXIgV29ya2Zsb3dSZXN1bHRzVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3dvcmtmbG93LXJlc3VsdHMnKTtcbnZhciBNb2RlbFZpZXdlciA9IHJlcXVpcmUoJy4uL3ZpZXdzL21vZGVsLXZpZXdlcicpO1xudmFyIEluZm9WaWV3ID0gcmVxdWlyZSgnLi4vdmlld3Mvd29ya2Zsb3ctaW5mbycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL2lucHV0Jyk7XG4vL21vZGVsc1xudmFyIE1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL21vZGVsJylcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcGFnZXMvd29ya2Zsb3dNYW5hZ2VyLnB1ZycpO1xuXG5pbXBvcnQgaW5pdFBhZ2UgZnJvbSAnLi9wYWdlLmpzJztcblxubGV0IG9wZXJhdGlvbkluZm9Nb2RhbEh0bWwgPSAoKSA9PiB7XG4gIGxldCBlZGl0V29ya2Zsb3dNZXNzYWdlID0gYFxuICAgIDxwPjxiPldvcmtmbG93IE5hbWUvUGF0aDwvYj46IFlvdSBtYXkgZWRpdCB0aGUgbmFtZS9wYXRoIG9mIHRoZSB3b3JrZmxvdyBhcyBsb25nIGFzIHRoZSB3b3JrZmxvdyBoYXMgbm90IGJlZW4gc2F2ZWQuICBcbiAgICBXb3JrZmxvdyBOYW1lcyBhbHdheXMgZW5kIHdpdGggYSB0aW1lIHN0YW1wLjwvcD5cbiAgICA8cD48Yj5Nb2RlbCBQYXRoPC9iPjogSWYgeW91IG1vdmUgb3IgcmVuYW1lIHRoZSBtb2RlbCBtYWtlIHN1cmUgdG8gdXBkYXRlIHRoaXMgcGF0aC48L3A+XG4gICAgPHA+PGI+U2V0dGluZ3M8L2I+OiBUaGlzIGlzIHdoZXJlIHlvdSBjYW4gY3VzdG9taXplIHRoZSBzZXR0aW5ncyBmb3IgeW91ciB3b3JrZmxvdy5cbiAgICBJZiB5b3UgbmVlZCB0byBlZGl0IG90aGVyIHBhcnQgb2YgeW91IG1vZGVsIGNsaWNrIG9uIHRoZSBlZGl0IG1vZGVsIGJ1dHRvbi4gIFxuICAgIFRoZSBzZXR0aW5ncyBhcmUgb25seSBhdmFpbGFibGUgZm9yIHdvcmtmbG93cyB0aGF0IGhhdmUgbm90IGJlZW4gcnVuLjwvcD5cbiAgICA8cD48Yj5TdGF0dXM8L2I+OiBUaGlzIHNlY3Rpb24gZGlzcGxheXMgdGhlIHN0YXR1cyBhbmQgc3RhcnQgdGltZSBvZiB0aGUgV29ya2Zsb3cuICBJZiB0aGUgd29ya2Zsb3cgaGFzbid0IGJlZW4gc2FydGVkIHRoaXMgc2VjdGlvbiBpcyBjbG9zZWQuPC9wPlxuICAgIDxwPjxiPlJlc3VsdHM8L2I+OiBZb3UgbWF5IGNoYW5nZSB0aGUgdGl0bGUsIHgtYXhpcyBsYWJlbCwgYW5kIHktYXhpcyBsYWJlbCBieSBjbGlja2luZyBvbiB0aGUgZWRpdCBwbG90IGJ1dHRvbiB0aGVuIGVudGVyIHRoZSBuYW1lIGluIHRoZSBjb3JyZWN0IGZpZWxkLjwvcD5cbiAgICA8cD48Yj5JbmZvPC9iPjogVGhpcyBzZWN0aW9uIGRpc3BsYXlzIGFueSB3YXJuaW5ncyBhbmQvb3IgZXJyb3IgdGhhdCBhcmUgbG9nZ2VkIGJ5IHRoZSBydW5uaW5nIHdvcmtmbG93LjwvcD5cbiAgICA8cD48Yj5Nb2RlbDwvYj46IFRoaXMgc2VjdGlvbiBsZXRzIHlvdSB2aWV3IHRoZSBtb2RlbCB0aGF0IHdhcyB1c2VkIHdoZW4geW91IHJhbiB0aGUgd29ya2Zsb3cuPC9wPlxuICBgO1xuXG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cIm9wZXJhdGlvbkluZm9Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj4gV29ya2Zsb3cgTWFuYWdlciBIZWxwIDwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8cD4gJHtlZGl0V29ya2Zsb3dNZXNzYWdlfSA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCBcbn1cblxubGV0IG1vZGVsTm90Rm91bmRIdG1sID0gKHRpdGxlLCBtZXNzYWdlKSA9PiB7XG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cIm1vZGVsTm90Rm91bmRNb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj4gJHt0aXRsZX0gPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxwPiAke21lc3NhZ2V9IDwvcD5cbiAgICAgICAgICAgIDxwPiBQbGVhc2UgY29ycmVjdCB0aGUgbW9kZWwgcGF0aCBhbmQgcHJlc3MgZW50ZXIgdG8gcmVzZXQgdGhlIHdvcmtmbG93LiA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBib3gtc2hhZG93XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbmxldCBXb3JrZmxvd01hbmFnZXIgPSBQYWdlVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz13b3JrZmxvdy1uYW1lXScgOiAnc2V0V29ya2Zsb3dOYW1lJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9bW9kZWwtcGF0aF0nIDogJ3VwZGF0ZVdrZmxNb2RlbCcsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZWRpdC13b3JrZmxvdy1oZWxwXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgbW9kYWwgPSAkKG9wZXJhdGlvbkluZm9Nb2RhbEh0bWwoKSkubW9kYWwoKTtcbiAgICB9LFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBQYWdlVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAkKGRvY3VtZW50KS5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmKGUudGFyZ2V0LmlkID09PSBcIm1vZGVsTm90Rm91bmRNb2RhbFwiKVxuICAgICAgICAkKHNlbGYucXVlcnlCeUhvb2soXCJtb2RlbC1wYXRoXCIpKS5maW5kKCdpbnB1dCcpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgdGhpcy51cmwgPSBkZWNvZGVVUkkoZG9jdW1lbnQuVVJMKVxuICAgIHZhciB0eXBlQW5kUGF0aCA9IHRoaXMudXJsLnNwbGl0KCcvd29ya2Zsb3cvZWRpdC8nKS5wb3AoKVxuICAgIHZhciBzdGFtcCA9IHRoaXMuZ2V0Q3VycmVudERhdGUoKTtcbiAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCJ3b3JrZmxvdy9sb2FkLXdvcmtmbG93XCIsIHN0YW1wLCB0eXBlQW5kUGF0aClcbiAgICB4aHIoe3VyaTogZW5kcG9pbnQsIGpzb246IHRydWV9LCBmdW5jdGlvbiAoZXJyLCByZXNwLCBib2R5KSB7XG4gICAgICBpZihyZXNwLnN0YXR1c0NvZGUgPCA0MDApIHtcbiAgICAgICAgc2VsZi50eXBlID0gYm9keS50eXBlXG4gICAgICAgIHNlbGYudGl0bGVUeXBlID0gYm9keS50aXRsZVR5cGVcbiAgICAgICAgc2VsZi5tb2RlbERpcmVjdG9yeSA9IGJvZHkubWRsUGF0aFxuICAgICAgICBzZWxmLndrZmxEaXJlY3RvcnkgPSBib2R5LndrZmxEaXJcbiAgICAgICAgc2VsZi53b3JrZmxvd0RhdGUgPSBib2R5LnRpbWVTdGFtcFxuICAgICAgICBzZWxmLndvcmtmbG93TmFtZSA9IGJvZHkud2tmbE5hbWVcbiAgICAgICAgc2VsZi5zdGF0dXMgPSBib2R5LnN0YXR1c1xuICAgICAgICBzZWxmLnN0YXJ0VGltZSA9IGJvZHkuc3RhcnRUaW1lXG4gICAgICAgIHNlbGYud2tmbFBhclBhdGggPSBib2R5LndrZmxQYXJQYXRoXG4gICAgICAgIHNlbGYud2tmbFBhdGggPSBwYXRoLmpvaW4oc2VsZi53a2ZsUGFyUGF0aCwgc2VsZi53a2ZsRGlyZWN0b3J5KVxuICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnN0YXR1cywgc2VsZi5zdGFydFRpbWUpXG4gICAgICAgIHNlbGYuYnVpbGRXa2ZsTW9kZWwoYm9keSlcbiAgICAgICAgc2VsZi5yZW5kZXJTdWJ2aWV3cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBidWlsZFdrZmxNb2RlbDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBsZXQgbW9kZWwgPSBkYXRhLm1vZGVsXG4gICAgdGhpcy5tb2RlbCA9IG5ldyBNb2RlbChtb2RlbClcbiAgICB0aGlzLm1vZGVsLm5hbWUgPSB0aGlzLm1vZGVsRGlyZWN0b3J5LnNwbGl0KCcvJykucG9wKCkuc3BsaXQoJy4nKVswXVxuICAgIHRoaXMubW9kZWwuZGlyZWN0b3J5ID0gdGhpcy5tb2RlbERpcmVjdG9yeVxuICAgIHRoaXMubW9kZWwuaXNfc3BhdGlhbCA9IHRoaXMubW9kZWxEaXJlY3RvcnkuZW5kc1dpdGgoXCIuc21kbFwiKVxuICAgIHRoaXMubW9kZWwuaXNQcmV2aWV3ID0gZmFsc2VcbiAgICB0aGlzLm1vZGVsLmZvciA9IFwid2tmbFwiXG4gICAgaWYoIW1vZGVsKVxuICAgICAgdGhpcy53a2ZsTW9kZWxOb3RGb3VuZChkYXRhLmVycm9yKVxuICB9LFxuICB3a2ZsTW9kZWxOb3RGb3VuZDogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgbGV0IG1vZGFsID0gJChtb2RlbE5vdEZvdW5kSHRtbChlcnJvci5SZWFzb24sIGVycm9yLk1lc3NhZ2UpKS5tb2RhbCgpXG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBnZXRDdXJyZW50RGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICB2YXIgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xuICAgIGlmKG1vbnRoIDwgMTApe1xuICAgICAgbW9udGggPSBcIjBcIiArIG1vbnRoXG4gICAgfVxuICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKTtcbiAgICBpZihkYXkgPCAxMCl7XG4gICAgICBkYXkgPSBcIjBcIiArIGRheVxuICAgIH1cbiAgICB2YXIgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgaWYoaG91cnMgPCAxMCl7XG4gICAgICBob3VycyA9IFwiMFwiICsgaG91cnNcbiAgICB9XG4gICAgdmFyIG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcbiAgICBpZihtaW51dGVzIDwgMTApe1xuICAgICAgbWludXRlcyA9IFwiMFwiICsgbWludXRlc1xuICAgIH1cbiAgICB2YXIgc2Vjb25kcyA9IGRhdGUuZ2V0U2Vjb25kcygpO1xuICAgIGlmKHNlY29uZHMgPCAxMCl7XG4gICAgICBzZWNvbmRzID0gXCIwXCIgKyBzZWNvbmRzXG4gICAgfVxuICAgIHJldHVybiBcIl9cIiArIG1vbnRoICsgZGF5ICsgeWVhciArIFwiX1wiICsgaG91cnMgKyBtaW51dGVzICsgc2Vjb25kcztcbiAgfSxcbiAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJwYWdlLXRpdGxlXCIpKS50ZXh0KCdXb3JrZmxvdzogJyt0aGlzLnRpdGxlVHlwZSlcbiAgICB0aGlzLnJlbmRlcldrZmxOYW1lSW5wdXRWaWV3KCk7XG4gICAgdGhpcy5yZW5kZXJNZGxQYXRoSW5wdXRWaWV3KCk7XG4gICAgdGhpcy5yZW5kZXJXb3JrZmxvd0VkaXRvcigpO1xuICAgIHRoaXMucmVuZGVyV29ya2Zsb3dTdGF0dXNWaWV3KCk7XG4gICAgdGhpcy5yZW5kZXJSZXN1bHRzVmlldygpO1xuICAgIHRoaXMucmVuZGVySW5mb1ZpZXcoKTtcbiAgICB0aGlzLnJlbmRlck1vZGVsVmlld2VyKCk7XG4gICAgaWYodGhpcy5zdGF0dXMgPT09ICdydW5uaW5nJyl7XG4gICAgICB0aGlzLmdldFdvcmtmbG93U3RhdHVzKCk7XG4gICAgfVxuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgcmVuZGVyV2tmbE5hbWVJbnB1dFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgaW5wdXROYW1lID0gbmV3IElucHV0Vmlldyh7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgIGxhYmVsOiAnV29ya2Zsb3cgTmFtZTogJyxcbiAgICAgIHRlc3RzOiAnJyxcbiAgICAgIG1vZGVsS2V5OiBudWxsLFxuICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgIHZhbHVlOiB0aGlzLndvcmtmbG93TmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhpbnB1dE5hbWUsICd3b3JrZmxvdy1uYW1lJyk7XG4gICAgaWYodGhpcy5zdGF0dXMgIT09IFwibmV3XCIpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctbmFtZScpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfVxuICB9LFxuICByZW5kZXJNZGxQYXRoSW5wdXRWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG1vZGVsUGF0aElucHV0ID0gbmV3IElucHV0Vmlldyh7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgIGxhYmVsOiAnTW9kZWwgUGF0aDogJyxcbiAgICAgIHRlc3RzOiBcIlwiLFxuICAgICAgbW9kZWxLZXk6ICdkaXJlY3RvcnknLFxuICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmRpcmVjdG9yeSxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhtb2RlbFBhdGhJbnB1dCwgXCJtb2RlbC1wYXRoXCIpO1xuICAgIGlmKHRoaXMuc3RhdHVzICE9PSBcIm5ld1wiICYmIHRoaXMuc3RhdHVzICE9PSBcInJlYWR5XCIpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnbW9kZWwtcGF0aCcpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfVxuICB9LFxuICByZW5kZXJXb3JrZmxvd0VkaXRvcjogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMud29ya2Zsb3dFZGl0b3JWaWV3KXtcbiAgICAgIHRoaXMud29ya2Zsb3dFZGl0b3JWaWV3LnJlbW92ZSgpXG4gICAgfVxuICAgIHRoaXMud29ya2Zsb3dFZGl0b3IgPSBuZXcgV29ya2Zsb3dFZGl0b3JWaWV3KHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICB9KTtcbiAgICB0aGlzLndvcmtmbG93RWRpdG9yVmlldyA9IHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMud29ya2Zsb3dFZGl0b3IsICd3b3JrZmxvdy1lZGl0b3ItY29udGFpbmVyJyk7XG4gIH0sXG4gIHJlbmRlcldvcmtmbG93U3RhdHVzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMud29ya2Zsb3dTdGF0dXNWaWV3KXtcbiAgICAgIHRoaXMud29ya2Zsb3dTdGF0dXNWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB2YXIgc3RhdHVzVmlldyA9IG5ldyBXb3JrZmxvd1N0YXR1c1ZpZXcoe1xuICAgICAgc3RhcnRUaW1lOiB0aGlzLnN0YXJ0VGltZSxcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgfSk7XG4gICAgdGhpcy53b3JrZmxvd1N0YXR1c1ZpZXcgPSB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzdGF0dXNWaWV3LCAnd29ya2Zsb3ctc3RhdHVzLWNvbnRhaW5lcicpO1xuICB9LFxuICByZW5kZXJSZXN1bHRzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMud29ya2Zsb3dSZXN1bHRzVmlldyl7XG4gICAgICB0aGlzLndvcmtmbG93UmVzdWx0c1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHZhciByZXN1bHRzVmlldyA9IG5ldyBXb3JrZmxvd1Jlc3VsdHNWaWV3KHtcbiAgICAgIHRyYWplY3RvcmllczogdGhpcy5tb2RlbC5zaW11bGF0aW9uU2V0dGluZ3MucmVhbGl6YXRpb25zLFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHNwZWNpZXM6IHRoaXMubW9kZWwuc3BlY2llcyxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIHNwZWNpZXNPZkludGVyZXN0OiB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3Muc3BlY2llc09mSW50ZXJlc3QubmFtZVxuICAgIH0pO1xuICAgIHRoaXMud29ya2Zsb3dSZXN1bHRzVmlldyA9IHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJlc3VsdHNWaWV3LCAnd29ya2Zsb3ctcmVzdWx0cy1jb250YWluZXInKTtcbiAgfSxcbiAgcmVuZGVySW5mb1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLmluZm9WaWV3KXtcbiAgICAgIHRoaXMuaW5mb1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMuaW5mb1ZpZXcgPSBuZXcgSW5mb1ZpZXcoe1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIGxvZ3NQYXRoOiBwYXRoLmpvaW4odGhpcy53a2ZsUGF0aCwgXCJsb2dzLnR4dFwiKVxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuaW5mb1ZpZXcsICd3b3JrZmxvdy1pbmZvLWNvbnRhaW5lcicpXG4gIH0sXG4gIHJlbmRlck1vZGVsVmlld2VyOiBmdW5jdGlvbiAoKXtcbiAgICBpZih0aGlzLm1vZGVsVmlld2VyKXtcbiAgICAgIHRoaXMubW9kZWxWaWV3ZXIucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMubW9kZWxWaWV3ZXIgPSBuZXcgTW9kZWxWaWV3ZXIoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwsXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgdHlwZTogdGhpcy50eXBlXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5tb2RlbFZpZXdlciwgJ21vZGVsLXZpZXdlci1jb250YWluZXInKVxuICB9LFxuICBnZXRXb3JrZmxvd1N0YXR1czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvd29ya2Zsb3cvd29ya2Zsb3ctc3RhdHVzXCIsIHRoaXMud2tmbFBhdGgpO1xuICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICBpZihzZWxmLnN0YXR1cyAhPT0gYm9keSApXG4gICAgICAgIHNlbGYuc3RhdHVzID0gYm9keTtcbiAgICAgIGlmKHNlbGYuc3RhdHVzID09PSAncnVubmluZycpXG4gICAgICAgIHNldFRpbWVvdXQoXy5iaW5kKHNlbGYuZ2V0V29ya2Zsb3dTdGF0dXMsIHNlbGYpLCAxMDAwKTtcbiAgICAgIGVsc2V7XG4gICAgICAgIHNlbGYucmVuZGVyV29ya2Zsb3dTdGF0dXNWaWV3KClcbiAgICAgICAgc2VsZi5yZW5kZXJJbmZvVmlldygpO1xuICAgICAgfVxuICAgICAgaWYoc2VsZi5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgc2VsZi5yZW5kZXJSZXN1bHRzVmlldygpO1xuICAgICAgICBzZWxmLnJlbmRlck1vZGVsVmlld2VyKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHNldFdvcmtmbG93TmFtZTogZnVuY3Rpb24oZSkge1xuICAgIHZhciBuZXdXb3JrZmxvd05hbWUgPSBlLnRhcmdldC52YWx1ZS50cmltKCk7XG4gICAgaWYobmV3V29ya2Zsb3dOYW1lLmVuZHNXaXRoKHRoaXMud29ya2Zsb3dEYXRlKSl7XG4gICAgICB0aGlzLndvcmtmbG93TmFtZSA9IG5ld1dvcmtmbG93TmFtZVxuICAgIH1lbHNle1xuICAgICAgdGhpcy53b3JrZmxvd05hbWUgPSBuZXdXb3JrZmxvd05hbWUgKyB0aGlzLndvcmtmbG93RGF0ZVxuICAgICAgZS50YXJnZXQudmFsdWUgPSB0aGlzLndvcmtmbG93TmFtZVxuICAgIH1cbiAgICB0aGlzLndrZmxEaXJlY3RvcnkgPSB0aGlzLndvcmtmbG93TmFtZSArIFwiLndrZmxcIlxuICAgIHRoaXMud2tmbFBhdGggPSBwYXRoLmpvaW4odGhpcy53a2ZsUGFyUGF0aCwgdGhpcy53a2ZsRGlyZWN0b3J5KVxuICAgIGNvbnNvbGUubG9nKHRoaXMud2tmbFBhdGgpXG4gIH0sXG4gIHVwZGF0ZVdrZmxNb2RlbDogZnVuY3Rpb24gKGUpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5tb2RlbC5mZXRjaCh7XG4gICAgICBqc29uOiB0cnVlLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICBzZWxmLnJlbmRlcldvcmtmbG93RWRpdG9yKClcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICBzZWxmLndrZmxNb2RlbE5vdEZvdW5kKHJlc3BvbnNlLmJvZHkpXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHJlbG9hZFdrZmw6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgaWYoc2VsZi5zdGF0dXMgPT09ICduZXcnKVxuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBzZWxmLnVybC5yZXBsYWNlKHNlbGYubW9kZWxEaXJlY3Rvcnkuc3BsaXQoJy8nKS5wb3AoKSwgc2VsZi53a2ZsRGlyZWN0b3J5KVxuICAgIGVsc2VcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICB9LFxufSk7XG5cbmluaXRQYWdlKFdvcmtmbG93TWFuYWdlcik7XG4iLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VWYXJpYWJsZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJ2aWV3LWV2ZW50LWFzc2lnbm1lbnRzLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwiZXZlbnRzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXZlbnRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1tb2RlbC1ldmVudHMtdmlld2VyXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93IGNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1tb2RlbC1ldmVudHMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRGVsYXlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VQcmlvcml0eVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVRyaWdnZ2VyXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFQXNzaWdubWVudHNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VVc2UgVmFsdWVzIEZyb21cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJ2aWV3LWV2ZW50cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwid29ya2Zsb3ctcmVzdWx0c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUmVzdWx0c1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVzdWx0c1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCIgZGlzYWJsZWRcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2UtcmVzdWx0c1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1yZXN1bHRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJlZGl0LXBsb3QtYXJnc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVGl0bGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VYLWF4aXMgTGFiZWxcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VZLWF4aXMgTGFiZWxcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGl0bGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ4YXhpc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInlheGlzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQbG90IFRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXRyYWplY3Rvcmllc1xcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwidHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRUVkaXQgUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwidHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLXBuZy1jdXN0b21cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIFBOR1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwidHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT05cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1yZXN1bHRzLWNzdlxcXCJcXHUwMDNFRG93bmxvYWQgUmVzdWx0cyBhcyAuY3N2XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LXJlc3VsdHMtZW5zZW1ibGVcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlc3VsdHNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctcmVzdWx0c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1wbG90LWFyZ3NcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVRpdGxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWC1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWS1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInRpdGxlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieGF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ5YXhpc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBTdGFuZGFyZCBEZXZpYXRpb24gUmFuZ2VcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXN0ZGRldnJhbmdlXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXN0ZGRldnJhbmdlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXN0ZGRldnJhbmdlXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3RkZGV2cmFuXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldnJhblxcXCIgZGF0YS1ob29rPVxcXCJwbG90XFxcIlxcdTAwM0VFZGl0IFBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldnJhblxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldnJhblxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBsb3QgVHJhamVjdG9yaWVzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwidHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRVBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJwbG90LW11bHRpcGxlXFxcIiBkaXNhYmxlZFxcdTAwM0VNdWx0aXBsZSBQbG90c1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwidHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLXBuZy1jdXN0b21cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIFBOR1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwidHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT05cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBTdGFuZGFyZCBEZXZpYXRpb25cXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXN0ZGRldlxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZS1zdGRkZXZcXFwiXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXN0ZGRldlxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN0ZGRldlxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJzdGRkZXZcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwic3RkZGV2XFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLXBuZy1jdXN0b21cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIFBOR1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwic3RkZGV2XFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT05cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBUcmFqZWN0b3J5IE1lYW5cXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXRyYWptZWFuXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXRyYWptZWFuXFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS10cmFqbWVhblxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImF2Z1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJhdmdcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwiYXZnXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLXBuZy1jdXN0b21cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIFBOR1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwiYXZnXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT05cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1yZXN1bHRzLWNzdlxcXCJcXHUwMDNFRG93bmxvYWQgUmVzdWx0cyBhcyAuY3N2XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIm1vZGVsLXNldHRpbmdzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTW9kZWwgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLW1vZGVsLXNldHRpbmdzLXZpZXdlclxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvdyBjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtbW9kZWwtc2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VFbmQgU2ltdWxhdGlvblxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVRpbWUgU3RlcHNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VWb2x1bWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLmVuZFNpbSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnRpbWVTdGVwKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudm9sdW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIm1vZGVsLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTW9kZWxcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLW1vZGVsXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLW1vZGVsXFxcIiBkaXNhYmxlZFxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1tb2RlbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDVcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInNwZWNpZXMtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInBhcmFtZXRlcnMtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJlYWN0aW9ucy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiZXZlbnRzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJydWxlcy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibW9kZWwtc2V0dGluZ3Mtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInBhcmFtZXRlci1zd2VlcC1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic2ltdWxhdGlvbi1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwid29ya2Zsb3ctcmVzdWx0c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUmVzdWx0c1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVzdWx0c1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCIgZGlzYWJsZWRcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2UtcmVzdWx0c1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1yZXN1bHRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJlZGl0LXBsb3QtYXJnc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVGl0bGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VYLWF4aXMgTGFiZWxcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VZLWF4aXMgTGFiZWxcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGl0bGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ4YXhpc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInlheGlzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lIGhvcml6b250YWwtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmVcXFwiIGZvcj1cXFwic3BlY2llcy1vZi1pbnRlcmVzdFxcXCJcXHUwMDNFU3BlY2llcyBvZiBJbnRlcmVzdDpcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuc3BlY2llcywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIiBpZD1cXFwic3BlY2llcy1vZi1pbnRlcmVzdFxcXCIgZGF0YS1ob29rPVxcXCJzcGVjaWUtb2YtaW50ZXJlc3QtbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lIGhvcml6b250YWwtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmVcXFwiIGZvcj1cXFwiZmVhdHVyZS1leHRyYWN0b3JcXFwiXFx1MDAzRUZlYXR1cmUgRXh0cmFjdGlvbjogXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm1hcHBlciwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIiBpZD1cXFwiZmVhdHVyZS1leHRyYWN0b3JcXFwiIGRhdGEtaG9vaz1cXFwiZmVhdHVyZS1leHRyYWN0aW9uLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiaW5saW5lXFxcIiBmb3I9XFxcImVuc2VtYmxlLWFnZ3JhZ2F0b3JcXFwiXFx1MDAzRUVuc2VtYmxlIEFnZ3JhZ2F0b3I6IFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5yZWR1Y2VyLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiIGlkPVxcXCJlbnNlbWJsZS1hZ2dyYWdhdG9yXFxcIiBkYXRhLWhvb2s9XFxcImVuc2VtYmxlLWFnZ3JhZ2F0b3ItbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBhcmFtZXRlciBTd2VlcFxcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcHN3ZWVwXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXBzd2VlcFxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1wc3dlZXBcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJwc3dlZXBcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwicHN3ZWVwXFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRUVkaXQgUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwicHN3ZWVwXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLXBuZy1jdXN0b21cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIFBOR1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwicHN3ZWVwXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT04gXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcmVzdWx0cy1jc3ZcXFwiXFx1MDAzRURvd25sb2FkIFJlc3VsdHMgYXMgLmNzdlxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJwYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3NcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBhcmFtZXRlciBTd2VlcCBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcHN3ZWVwLXNldHRpbmdzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXBzd2VlcC1zZXR0aW5nc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNiB2ZXJ0aWNsZS1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3dlZXAgVHlwZTpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5zd2VlcFR5cGUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzd2VlcFR5cGVcXFwiIGRhdGEtaG9vaz1cXFwib25lLXBhcmFtZXRlclxcXCIgZGF0YS1uYW1lPVxcXCIxRFxcXCIgY2hlY2tlZFxcdTAwM0UgT25lIFBhcmFtZXRlclxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInN3ZWVwVHlwZVxcXCIgZGF0YS1ob29rPVxcXCJ0d28tcGFyYW1ldGVyXFxcIiBkYXRhLW5hbWU9XFxcIjJEXFxcIiBkaXNhYmxlZFxcdTAwM0UgVHdvIFBhcmFtZXRlcnNcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNiB2ZXJ0aWNsZS1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZVxcXCIgZm9yPVxcXCJzcGVjaWVzLW9mLWludGVyZXN0XFxcIlxcdTAwM0VTcGVjaWVzIG9mIEludGVyZXN0OlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5zcGVjaWVzLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiIGlkPVxcXCJzcGVjaWVzLW9mLWludGVyZXN0XFxcIiBkYXRhLWhvb2s9XFxcInNwZWNpZS1vZi1pbnRlcmVzdC1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDaDVcXHUwMDNFQ29uZmlndXJlIFZhcmlhYmxlKHMpXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3dlZXAgVmFyaWFibGVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy52YXJpYWJsZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUN1cnJlbnQgVmFsdWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy52YWx1ZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU1pbmltdW0gVmFsdWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5taW4sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VNYXhpbXVtIFZhbHVlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMubWF4LCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RlcHNcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5zdGVwcywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN3ZWVwLXZhcmlhYmxlLW9uZS1zZWxlY3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJjdXJyZW50LXZhbHVlLW9uZS1pbnB1dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1pbmltdW0tdmFsdWUtb25lLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibWF4aW11bS12YWx1ZS1vbmUtaW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdGVwLW9uZS1pbnB1dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0N0ciBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwicGFyYW1ldGVyLXR3by1yb3dcXFwiXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3dlZXAtdmFyaWFibGUtdHdvLXNlbGVjdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImN1cnJlbnQtdmFsdWUtdHdvLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibWluaW11bS12YWx1ZS10d28taW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtYXhpbXVtLXZhbHVlLXR3by1pbnB1dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN0ZXAtdHdvLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJwYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQYXJhbWV0ZXIgU3dlZXAgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXBzd2VlcC1zZXR0aW5ncy12aWV3ZXJcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtcHN3ZWVwLXNldHRpbmdzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMC43NXJlbTtcXFwiIGRhdGEtaG9vaz1cXFwic3dlZXAtdHlwZS12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTd2VlcCBWYXJpYWJsZXNcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVZhcmlhYmxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFQ3VycmVudCBWYWx1ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1pbmltdW0gVmFsdWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VNYXhpbXVtIFZhbHVlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3RlcHNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnBhcmFtZXRlck9uZS5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkIGRhdGEtaG9vaz1cXFwicDEtY3VycmVudC12YWx1ZS12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucDFNaW4pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wMU1heCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnAxU3RlcHMpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0N0ciBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwicDItdmFyaWFibGUtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wYXJhbWV0ZXJUd28ubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZCBkYXRhLWhvb2s9XFxcInAyLWN1cnJlbnQtdmFsdWUtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnAyTWluKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucDJNYXgpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wMlN0ZXBzKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInBhcmFtZXRlcnMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQYXJhbWV0ZXJzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1wYXJhbWV0ZXJzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXBhcmFtZXRlcnNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC05LXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJwYXJhbWV0ZXItbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJyZWFjdGlvbnMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VSZWFjdGlvbnNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJlYWN0aW9uc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1yZWFjdGlvbnNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVN1bW1hcnlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTYtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFUmF0ZVxcdTAwMkZQcm9wZW5zaXR5XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwicmVhY3Rpb24tbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJydWxlcy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJ1bGVzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1ydWxlc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1ydWxlc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVHlwZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VWYXJpYWJsZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VFeHByZXNzaW9uXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwicnVsZXMtbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJzaW11bGF0aW9uLXNldHRpbmdzXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTaW11bGF0aW9uIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zZXR0aW5nc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1zZXR0aW5nc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCIgY29sc3Bhbj1cXFwiNVxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNpbXVsYXRpb24gQWxnb3JpdGhtXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuYWxnb3JpdGhtLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNpbUFsZ29yaXRobVxcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3Qtb2RlXFxcIiBkYXRhLW5hbWU9XFxcIk9ERVxcXCJcXHUwMDNFIE9ERVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm9kZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LXNzYVxcXCIgZGF0YS1uYW1lPVxcXCJTU0FcXFwiXFx1MDAzRSBTU0FcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5zc2EsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic2ltQWxnb3JpdGhtXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC10YXUtbGVhcGluZ1xcXCIgZGF0YS1uYW1lPVxcXCJUYXUtTGVhcGluZ1xcXCJcXHUwMDNFIFRhdSBMZWFwaW5nXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMudGF1TGVhcGluZywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LWh5YnJpZC10YXVcXFwiIGRhdGEtbmFtZT1cXFwiSHlicmlkLVRhdS1MZWFwaW5nXFxcIlxcdTAwM0UgSHlicmlkIE9ERVxcdTAwMkZTU0FcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5oeWJyaWQsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCBjbGFzcz1cXFwiaW5saW5lXFxcIiB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic2ltQWxnb3JpdGhtXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1hdXRvbWF0aWNcXFwiIGRhdGEtbmFtZT1cXFwiQXV0b21hdGljXFxcIlxcdTAwM0UgQ2hvb3NlIGZvciBtZVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLmNob29zZUZvck1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTVcXFwiXFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VEZXRlcm1pbmlzdGljIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlbGF0aXZlIFRvbGVyYW5jZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJ0b2wsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFQWJzb2x1dGUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuYXRvbCwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJlbGF0aXZlLXRvbGVyYW5jZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImFic29sdXRlLXRvbGVyYW5jZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtN1xcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN0b2NoYXN0aWMgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VUcmFqZWN0b3JpZXNcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5yZWFsaXphdGlvbnMsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTZWVkXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuc2VlZCwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVRhdSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy50dG9sLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidHJhamVjdG9yaWVzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic2VlZFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInRhdS10b2xlcmFuY2VcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNldHRpbmdzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU2ltdWxhdGlvbiBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2Utc2V0dGluZ3Mtdmlld2VyXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93IGNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1zZXR0aW5ncy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC0xMlxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDAuNzVyZW07XFxcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLmFsZ29yaXRobSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNiBjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJkZXRlcm1pbmlzdGljXFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRGV0ZXJtaW5pc3RpYyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFUmVsYXRpdmUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFQWJzb2x1dGUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5yZWxhdGl2ZVRvbCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLmFic29sdXRlVG9sKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTYgY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwic3RvY2hhc3RpY1xcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN0b2NoYXN0aWMgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcIlNTQVxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTnVtYmVyIG9mIFRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVNlZWRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnJlYWxpemF0aW9ucykgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnNlZWQpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJUYXVcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU51bWJlciBvZiBUcmFqZWN0b3JpZXNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTZWVkXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVGF1IFRvbGVyYW5jZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucmVhbGl6YXRpb25zKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuc2VlZCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnRhdVRvbCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJzcGVjaWVzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3BlY2llc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2Utc3BlY2llc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1zcGVjaWVzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VJbml0aWFsIENvbmRpdGlvblxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VNb2RlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVN3aXRjaCBUb2xlcmFuY2VcXHUwMDJGTWluaW11bSBWYWx1ZSBmb3IgU3dpdGNoaW5nXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwic3BlY2llLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC52YXJpYWJsZS5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuZXhwcmVzc2lvbikgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLmRlbGF5KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucHJpb3JpdHkpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBcIkV4cHJlc3Npb246IFwiICsgdGhpcy5tb2RlbC50cmlnZ2VyRXhwcmVzc2lvbikgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJjaGVja2JveFxcXCIgZm9yPVxcXCJpbml0aWFsLXZhbHVlXFxcIlxcdTAwM0VJbml0aWFsIFZhbHVlOiBcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBpZD1cXFwiaW5pdGlhbC12YWx1ZVxcXCIgZGF0YS1ob29rPVxcXCJldmVudC10cmlnZ2VyLWluaXQtdmFsdWVcXFwiIGRpc2FibGVkXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNoZWNrYm94XFxcIiBmb3I9XFxcInBlcnNpc3RlbnRcXFwiXFx1MDAzRVBlcnNpc3RlbnQ6IFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGlkPVxcXCJwZXJzaXN0ZW50XFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50LXRyaWdnZXItcGVyc2lzdGVudFxcXCIgZGlzYWJsZWRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImFzc2lnbm1lbnQtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiaW5saW5lIGhvcml6b250YWwtc3BhY2VcXFwiIGZvcj1cXFwidHJpZ2dlci10aW1lXFxcIlxcdTAwM0VUcmdnaWVyIFRpbWVcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBpZD1cXFwidHJpZ2dlci10aW1lXFxcIiBuYW1lPVxcXCJ1c2UtdmFsdWVzLWZyb21cXFwiIGRhdGEtaG9vaz1cXFwidHJpZ2dlci10aW1lXFxcIiBkaXNhYmxlZFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCIgZm9yPVxcXCJhc3NpZ25tZW50LXRpbWVcXFwiXFx1MDAzRUFzc2lnbm1lbnQgVGltZVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIGlkPVxcXCJhc3NpZ25tZW50LXRpbWVcXFwiIG5hbWU9XFxcInVzZS12YWx1ZXMtZnJvbVxcXCIgZGF0YS1ob29rPVxcXCJhc3NpZ25tZW50LXRpbWVcXFwiIGRpc2FibGVkXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuZXhwcmVzc2lvbikgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3VtbWFyeVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5yYXRlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudHlwZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnZhcmlhYmxlLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5leHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudmFsdWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5tb2RlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuc3dpdGNoaW5nVmFsV2l0aExhYmVsKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwid29ya2Zsb3ctZWRpdG9yXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1lZGl0b3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibW9kZWwtbmFtZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGRhdGEtaG9vaz1cXFwicGFyYW0tc3dlZXAtc2V0dGluZ3MtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic2ltLXNldHRpbmdzLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXN0YXRlLWJ1dHRvbnMtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwid29ya2Zsb3ctaW5mby12aWV3XFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VJbmZvXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1pbmZvXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIiBkaXNhYmxlZFxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1pbmZvXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWluZm9cXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXN0YXRpc3RpY3NcXFwiXFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTdGF0aXN0aWNzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibGlzdC1vZi1ub3Rlc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctd2FybmluZ3NcXFwiXFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VXYXJuaW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImxpc3Qtb2Ytd2FybmluZ3NcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWVycm9yc1xcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUVycm9yc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImxpc3Qtb2YtZXJyb3JzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcIm1kbC1lZGl0LWJ0blxcXCJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwic2F2ZVxcXCJcXHUwMDNFU2F2ZVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcIm1kbC1lZGl0LWJ0biBzYXZpbmctc3RhdHVzXFxcIiBkYXRhLWhvb2s9XFxcInNhdmluZy13b3JrZmxvd1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwic3Bpbm5lci1ncm93XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VTYXZpbmcuLi5cXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuIHNhdmVkLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJzYXZlZC13b3JrZmxvd1xcXCJcXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFU2F2ZWRcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuIHNhdmUtZXJyb3Itc3RhdHVzXFxcIiBkYXRhLWhvb2s9XFxcInNhdmUtZXJyb3JcXFwiXFx1MDAzRVxcdTAwM0NzcGFuXFx1MDAzRUVycm9yIFNhdmluZyBNb2RlbFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJzdGFydC13b3JrZmxvd1xcXCJcXHUwMDNFU3RhcnQgV29ya2Zsb3dcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJlZGl0LW1vZGVsXFxcIlxcdTAwM0VFZGl0IE1vZGVsXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LXN0YXR1c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RhdHVzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zdGF0dXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1zdGF0dXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRURhdGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdGF0dXNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnN0YXJ0VGltZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnN0YXR1cykgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NkaXYgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmU7XFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcInN0b3Atd29ya2Zsb3dcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgZGlzYWJsZWRcXHUwMDNFU3RvcCBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwicmVzdGFydC13b3JrZmxvd1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBkaXNhYmxlZFxcdTAwM0VSZXN0YXJ0IFdvcmtmbG93XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDc2VjdGlvbiBjbGFzcz1cXFwicGFnZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDIgY2xhc3M9XFxcImlubGluZVxcXCIgZGF0YS1ob29rPVxcXCJwYWdlLXRpdGxlXFxcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBcIldvcmtmbG93OiBcIit0aGlzLnRpdGxlVHlwZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmgyXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJpZy10aXAgYnRuIGluZm9ybWF0aW9uLWJ0biBoZWxwXFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtd29ya2Zsb3ctaGVscFxcXCJcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhclxcXCIgZGF0YS1pY29uPVxcXCJxdWVzdGlvbi1jaXJjbGVcXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1xdWVzdGlvbi1jaXJjbGUgZmEtdy0xNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCA1MTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yNTYgOEMxMTkuMDQzIDggOCAxMTkuMDgzIDggMjU2YzAgMTM2Ljk5NyAxMTEuMDQzIDI0OCAyNDggMjQ4czI0OC0xMTEuMDAzIDI0OC0yNDhDNTA0IDExOS4wODMgMzkyLjk1NyA4IDI1NiA4em0wIDQ0OGMtMTEwLjUzMiAwLTIwMC04OS40MzEtMjAwLTIwMCAwLTExMC40OTUgODkuNDcyLTIwMCAyMDAtMjAwIDExMC40OTEgMCAyMDAgODkuNDcxIDIwMCAyMDAgMCAxMTAuNTMtODkuNDMxIDIwMC0yMDAgMjAwem0xMDcuMjQ0LTI1NS4yYzAgNjcuMDUyLTcyLjQyMSA2OC4wODQtNzIuNDIxIDkyLjg2M1YzMDBjMCA2LjYyNy01LjM3MyAxMi0xMiAxMmgtNDUuNjQ3Yy02LjYyNyAwLTEyLTUuMzczLTEyLTEydi04LjY1OWMwLTM1Ljc0NSAyNy4xLTUwLjAzNCA0Ny41NzktNjEuNTE2IDE3LjU2MS05Ljg0NSAyOC4zMjQtMTYuNTQxIDI4LjMyNC0yOS41NzkgMC0xNy4yNDYtMjEuOTk5LTI4LjY5My0zOS43ODQtMjguNjkzLTIzLjE4OSAwLTMzLjg5NCAxMC45NzctNDguOTQyIDI5Ljk2OS00LjA1NyA1LjEyLTExLjQ2IDYuMDcxLTE2LjY2NiAyLjEyNGwtMjcuODI0LTIxLjA5OGMtNS4xMDctMy44NzItNi4yNTEtMTEuMDY2LTIuNjQ0LTE2LjM2M0MxODQuODQ2IDEzMS40OTEgMjE0Ljk0IDExMiAyNjEuNzk0IDExMmM0OS4wNzEgMCAxMDEuNDUgMzguMzA0IDEwMS40NSA4OC44ek0yOTggMzY4YzAgMjMuMTU5LTE4Ljg0MSA0Mi00MiA0MnMtNDItMTguODQxLTQyLTQyIDE4Ljg0MS00MiA0Mi00MiA0MiAxOC44NDEgNDIgNDJ6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LW5hbWVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1wYXRoXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctZWRpdG9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXN0YXR1cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1yZXN1bHRzLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWluZm8tY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibW9kZWwtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImNvbXB1dGF0aW9uYWwtcmVzb3VyY2VzLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWN0aW9uXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdBc3NpZ25tZW50cyA9IHJlcXVpcmUoJy4vdmlldy1ldmVudC1hc3NpZ25tZW50cycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudEFzc2lnbm1lbnRzVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdBc3NpZ25tZW50cywgJ3ZpZXctZXZlbnQtYXNzaWdubWVudHMtbGlzdCcpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3RXZlbnQgPSByZXF1aXJlKCcuL3ZpZXctZXZlbnRzJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50c1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbiwgVmlld0V2ZW50LCB0aGlzLnF1ZXJ5QnlIb29rKCd2aWV3LWV2ZW50cy1jb250YWluZXInKSlcbiAgfSxcbiAgY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFNldHRpbmdzVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgU3BlY2llc1ZpZXdlciA9IHJlcXVpcmUoJy4vc3BlY2llcy12aWV3ZXInKTtcbnZhciBQYXJhbWV0ZXJzVmlld2VyID0gcmVxdWlyZSgnLi9wYXJhbWV0ZXJzLXZpZXdlcicpO1xudmFyIFJlYWN0aW9uc1ZpZXdlciA9IHJlcXVpcmUoJy4vcmVhY3Rpb25zLXZpZXdlcicpO1xudmFyIEV2ZW50c1ZpZXdlciA9IHJlcXVpcmUoJy4vZXZlbnRzLXZpZXdlcicpO1xudmFyIFJ1bGVzVmlld2VyID0gcmVxdWlyZSgnLi9ydWxlcy12aWV3ZXInKTtcbnZhciBNb2RlbFNldHRpbmdzVmlld2VyID0gcmVxdWlyZSgnLi9tb2RlbC1zZXR0aW5ncy12aWV3ZXInKTtcbnZhciBTaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIgPSByZXF1aXJlKCcuL3NpbXVsYXRpb24tc2V0dGluZ3Mtdmlld2VyJyk7XG52YXIgUGFyYW1ldGVyU3dlZXBTZXR0aW5nc1ZpZXdlciA9IHJlcXVpcmUoJy4vcGFyYW1ldGVyLXN3ZWVwLXNldHRpbmdzLXZpZXdlcicpO1xuLy9tb2RlbHNcbnZhciBNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9tb2RlbCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2UtbW9kZWxdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gICAgdGhpcy53a2ZsVHlwZSA9IGF0dHJzLnR5cGU7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBzcGVjaWVzVmlld2VyID0gbmV3IFNwZWNpZXNWaWV3ZXIoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5zcGVjaWVzLFxuICAgIH0pO1xuICAgIHZhciBwYXJhbWV0ZXJzVmlld2VyID0gbmV3IFBhcmFtZXRlcnNWaWV3ZXIoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5wYXJhbWV0ZXJzLFxuICAgIH0pO1xuICAgIHZhciByZWFjdGlvbnNWaWV3ZXIgPSBuZXcgUmVhY3Rpb25zVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucmVhY3Rpb25zLFxuICAgIH0pO1xuICAgIHZhciBldmVudHNWaWV3ZXIgPSBuZXcgRXZlbnRzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvbixcbiAgICB9KTtcbiAgICB2YXIgcnVsZXNWaWV3ZXIgPSBuZXcgUnVsZXNWaWV3ZXIoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5ydWxlcyxcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlclNpbXVsYXRpb25TZXR0aW5nc1ZpZXcoKTtcbiAgICB2YXIgbW9kZWxTZXR0aW5nc1ZpZXdlciA9IG5ldyBNb2RlbFNldHRpbmdzVmlld2VyKHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLm1vZGVsU2V0dGluZ3MsXG4gICAgfSk7XG4gICAgdmFyIHBzd2VlcFNldHRpbmdzVmlld2VyID0gbmV3IFBhcmFtZXRlclN3ZWVwU2V0dGluZ3NWaWV3ZXIoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncyxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzcGVjaWVzVmlld2VyLCBcInNwZWNpZXMtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhwYXJhbWV0ZXJzVmlld2VyLCBcInBhcmFtZXRlcnMtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhyZWFjdGlvbnNWaWV3ZXIsIFwicmVhY3Rpb25zLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoZXZlbnRzVmlld2VyLCBcImV2ZW50cy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJ1bGVzVmlld2VyLCBcInJ1bGVzLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcobW9kZWxTZXR0aW5nc1ZpZXdlciwgXCJtb2RlbC1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIGlmKHRoaXMud2tmbFR5cGUgPT09ICdwYXJhbWV0ZXJTd2VlcCcpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHBzd2VlcFNldHRpbmdzVmlld2VyLCAncGFyYW1ldGVyLXN3ZWVwLXNldHRpbmdzLXZpZXdlci1jb250YWluZXInKVxuICAgIH1cbiAgICBpZih0aGlzLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJyl7XG4gICAgICB0aGlzLmVuYWJsZUNvbGxhcHNlQnV0dG9uKCk7XG4gICAgfVxuICB9LFxuICByZW5kZXJTaW11bGF0aW9uU2V0dGluZ3NWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5zaW11bGF0aW9uU2V0dGluZ3NWaWV3KXtcbiAgICAgIHRoaXMuc2ltdWxhdGlvblNldHRpbmdzVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5zaW11bGF0aW9uU2V0dGluZ3NWaWV3ID0gbmV3IFNpbXVsYXRpb25TZXR0aW5nc1ZpZXdlcih7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbC5zaW11bGF0aW9uU2V0dGluZ3MsXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5zaW11bGF0aW9uU2V0dGluZ3NWaWV3LCBcInNpbXVsYXRpb24tc2V0dGluZ3Mtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlLW1vZGVsJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlLW1vZGVsJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UtbW9kZWwnKSkudGV4dCgnKycpO1xuICB9LFxuICBlbmFibGVDb2xsYXBzZUJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UtbW9kZWwnKSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFNldHRpbmdzVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgc3dlZXBUeXBlID0gXCJTd2VlcCBUeXBlOiBcIlxuICAgIHZhciBwMUN1cnJlbnRWYWwgPSBldmFsKHRoaXMubW9kZWwucGFyYW1ldGVyT25lLmV4cHJlc3Npb24pXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdwMS1jdXJyZW50LXZhbHVlLXZpZXdlcicpKS50ZXh0KHAxQ3VycmVudFZhbClcbiAgICBpZih0aGlzLm1vZGVsLmlzMUQpIHtcbiAgICAgIHN3ZWVwVHlwZSArPSBcIk9uZSBQYXJhbWV0ZXJcIlxuICAgIH1lbHNle1xuICAgICAgc3dlZXBUeXBlICs9IFwiVHdvIFBhcmFtZXRlcnNcIlxuICAgICAgdmFyIHAyQ3VycmVudFZhbCA9IGV2YWwodGhpcy5tb2RlbC5wYXJhbWV0ZXJUd28uZXhwcmVzc2lvbilcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygncDItY3VycmVudC12YWx1ZS12aWV3ZXInKSkudGV4dChwMkN1cnJlbnRWYWwpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3AyLXZhcmlhYmxlLXZpZXdlcicpKS5jb2xsYXBzZSgnc2hvdycpXG4gICAgfVxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dlZXAtdHlwZS12aWV3ZXInKSkudGV4dChzd2VlcFR5cGUpXG4gIH0sXG4gIGNoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7ICIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoJy4uL3Rvb2x0aXBzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9b25lLXBhcmFtZXRlcl0nIDogJ3VwZGF0ZVBhcmFtU3dlZXBUeXBlJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9dHdvLXBhcmFtZXRlcl0nIDogJ3VwZGF0ZVBhcmFtU3dlZXBUeXBlJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3dlZXAtdmFyaWFibGUtb25lLXNlbGVjdF0nIDogJ3NlbGVjdFN3ZWVwVmFyT25lJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3dlZXAtdmFyaWFibGUtdHdvLXNlbGVjdF0nIDogJ3NlbGVjdFN3ZWVwVmFyVHdvJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3BlY2llLW9mLWludGVyZXN0LWxpc3RdJyA6ICdzZWxlY3RTcGVjaWVzT2ZJbnRlcmVzdCdcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5wYXJlbnQucGFyYW1ldGVycztcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMubW9kZWwucGFyZW50LnNwZWNpZXM7XG4gICAgdmFyIHBhcmFtTmFtZXMgPSBwYXJhbWV0ZXJzLm1hcChmdW5jdGlvbiAocGFyYW1ldGVyKSB7IHJldHVybiBwYXJhbWV0ZXIubmFtZX0pO1xuICAgIHZhciBzcGVjaWVzTmFtZXMgPSBzcGVjaWVzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7IHJldHVybiBzcGVjaWUubmFtZX0pO1xuICAgIHZhciBzcGVjaWVzT2ZJbnRlcmVzdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnc3BlY2llcy1vZi1pbnRlcmVzdCcsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IHNwZWNpZXNOYW1lcyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnNwZWNpZXNPZkludGVyZXN0Lm5hbWVcbiAgICB9KTtcbiAgICB2YXIgcGFyYW1ldGVyT25lVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdzd2VlcC12YXJpYWJsZS1vbmUnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBwYXJhbU5hbWVzLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwucGFyYW1ldGVyT25lLm5hbWVcbiAgICB9KTtcbiAgICB2YXIgcGFyYW1ldGVyVHdvVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdzd2VlcC12YXJpYWJsZS10d28nLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBwYXJhbU5hbWVzLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwucGFyYW1ldGVyVHdvLm5hbWVcbiAgICB9KTtcbiAgICBpZih0aGlzLm1vZGVsLnBhcmVudC5wYXJhbWV0ZXJzLmxlbmd0aCA+IDEpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd0d28tcGFyYW1ldGVyJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ29uZS1wYXJhbWV0ZXInKSkucHJvcCgnY2hlY2tlZCcsIHRoaXMubW9kZWwuaXMxRClcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygndHdvLXBhcmFtZXRlcicpKS5wcm9wKCdjaGVja2VkJywgIXRoaXMubW9kZWwuaXMxRClcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY3VycmVudC12YWx1ZS10d28taW5wdXQnKSkudGV4dChldmFsKHRoaXMubW9kZWwucGFyYW1ldGVyVHdvLmV4cHJlc3Npb24pKVxuICAgICAgdGhpcy50b2dnbGVQYXJhbVR3bygpO1xuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocGFyYW1ldGVyVHdvVmlldywgJ3N3ZWVwLXZhcmlhYmxlLXR3by1zZWxlY3QnKTtcbiAgICB9XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjdXJyZW50LXZhbHVlLW9uZS1pbnB1dCcpKS50ZXh0KGV2YWwodGhpcy5tb2RlbC5wYXJhbWV0ZXJPbmUuZXhwcmVzc2lvbikpXG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3BlY2llc09mSW50ZXJlc3RWaWV3LCAnc3BlY2llLW9mLWludGVyZXN0LWxpc3QnKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhwYXJhbWV0ZXJPbmVWaWV3LCAnc3dlZXAtdmFyaWFibGUtb25lLXNlbGVjdCcpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlUGFyYW1Td2VlcFR5cGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHR5cGUgPSBlLnRhcmdldC5kYXRhc2V0Lm5hbWVcbiAgICB0aGlzLm1vZGVsLmlzMUQgPSB0eXBlID09PSAnMUQnXG4gICAgdGhpcy50b2dnbGVQYXJhbVR3bygpXG4gIH0sXG4gIHRvZ2dsZVBhcmFtVHdvOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXRoaXMubW9kZWwuaXMxRCl7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3BhcmFtZXRlci10d28tcm93JykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3BhcmFtZXRlci10d28tcm93JykpLmNvbGxhcHNlKCdoaWRlJyk7XG4gICAgfVxuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBzZWxlY3RTd2VlcFZhck9uZTogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdmFsID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB2YXIgcGFyYW1ldGVyID0gdGhpcy5nZXRQYXJhbWV0ZXIodmFsKTtcbiAgICB0aGlzLm1vZGVsLnBhcmFtZXRlck9uZSA9IHBhcmFtZXRlclxuICAgIHZhciBjdXJyZW50VmFsdWUgPSBldmFsKHBhcmFtZXRlci5leHByZXNzaW9uKVxuICAgIHRoaXMubW9kZWwucDFNaW4gPSBjdXJyZW50VmFsdWUgKiAwLjU7XG4gICAgdGhpcy5tb2RlbC5wMU1heCA9IGN1cnJlbnRWYWx1ZSAqIDEuNTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2N1cnJlbnQtdmFsdWUtb25lLWlucHV0JykpLnRleHQoY3VycmVudFZhbHVlKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ21pbmltdW0tdmFsdWUtb25lLWlucHV0JykpLmZpbmQoJ2lucHV0JykudmFsKHRoaXMubW9kZWwucDFNaW4pXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdtYXhpbXVtLXZhbHVlLW9uZS1pbnB1dCcpKS5maW5kKCdpbnB1dCcpLnZhbCh0aGlzLm1vZGVsLnAxTWF4KVxuICB9LFxuICBzZWxlY3RTd2VlcFZhclR3bzogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdmFsID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB2YXIgcGFyYW1ldGVyID0gdGhpcy5nZXRQYXJhbWV0ZXIodmFsKTtcbiAgICB0aGlzLm1vZGVsLnBhcmFtZXRlclR3byA9IHBhcmFtZXRlclxuICAgIHZhciBjdXJyZW50VmFsdWUgPSBldmFsKHBhcmFtZXRlci5leHByZXNzaW9uKVxuICAgIHRoaXMubW9kZWwucDJNaW4gPSBjdXJyZW50VmFsdWUgKiAwLjU7XG4gICAgdGhpcy5tb2RlbC5wMk1heCA9IGN1cnJlbnRWYWx1ZSAqIDEuNTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2N1cnJlbnQtdmFsdWUtdHdvLWlucHV0JykpLnRleHQoY3VycmVudFZhbHVlKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ21pbmltdW0tdmFsdWUtdHdvLWlucHV0JykpLmZpbmQoJ2lucHV0JykudmFsKHRoaXMubW9kZWwucDJNaW4pXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdtYXhpbXVtLXZhbHVlLXR3by1pbnB1dCcpKS5maW5kKCdpbnB1dCcpLnZhbCh0aGlzLm1vZGVsLnAyTWF4KVxuICB9LFxuICBzZWxlY3RTcGVjaWVzT2ZJbnRlcmVzdDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdmFsID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMuZ2V0U3BlY2llcyh2YWwpO1xuICAgIHRoaXMubW9kZWwuc3BlY2llc09mSW50ZXJlc3QgPSBzcGVjaWVzXG4gIH0sXG4gIGdldFNwZWNpZXM6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLnBhcmVudC5zcGVjaWVzLmZpbHRlcihmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICBpZihzcGVjaWUubmFtZSA9PT0gbmFtZSkgcmV0dXJuIHNwZWNpZVxuICAgIH0pWzBdO1xuICAgIHJldHVybiBzcGVjaWVzO1xuICB9LFxuICBnZXRQYXJhbWV0ZXI6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB2YXIgcGFyYW1ldGVyID0gdGhpcy5tb2RlbC5wYXJlbnQucGFyYW1ldGVycy5maWx0ZXIoZnVuY3Rpb24gKHBhcmFtZXRlcikge1xuICAgICAgaWYocGFyYW1ldGVyLm5hbWUgPT09IHZhbCkgcmV0dXJuIHBhcmFtZXRlcjtcbiAgICB9KVswXTtcbiAgICByZXR1cm4gcGFyYW1ldGVyO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpXG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgcGFyYW0xTWluVmFsdWVJbnB1dDoge1xuICAgICAgaG9vazogJ21pbmltdW0tdmFsdWUtb25lLWlucHV0JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncGFyYW0tMS1taW4tdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AxTWluJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnAxTWluXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0xTWF4VmFsdWVJbnB1dDoge1xuICAgICAgaG9vazogJ21heGltdW0tdmFsdWUtb25lLWlucHV0JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncGFyYW0tMS1tYXgtdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AxTWF4JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnAxTWF4XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0xU3RlcFZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdzdGVwLW9uZS1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTEtc3RlcC12YWx1ZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAncDFTdGVwcycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMVN0ZXBzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0yTWluVmFsdWVJbnB1dDoge1xuICAgICAgaG9vazogJ21pbmltdW0tdmFsdWUtdHdvLWlucHV0JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncGFyYW0tMi1taW4tdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AyTWluJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnAyTWluXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0yTWF4VmFsdWVJbnB1dDoge1xuICAgICAgaG9vazogJ21heGltdW0tdmFsdWUtdHdvLWlucHV0JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncGFyYW0tMi1tYXgtdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AyTWF4JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnAyTWF4XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0yU3RlcFZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdzdGVwLXR3by1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTItc3RlcC12YWx1ZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAncDJTdGVwcycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMlN0ZXBzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gIH1cbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgVmlld1BhcmFtZXRlciA9IHJlcXVpcmUoJy4vdmlldy1wYXJhbWV0ZXInKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdQYXJhbWV0ZXIsIHRoaXMucXVlcnlCeUhvb2soJ3BhcmFtZXRlci1saXN0JykpXG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgVmlld1JlYWN0aW9ucyA9IHJlcXVpcmUoJy4vdmlldy1yZWFjdGlvbnMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbiwgVmlld1JlYWN0aW9ucywgdGhpcy5xdWVyeUJ5SG9vaygncmVhY3Rpb24tbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdSdWxlcyA9IHJlcXVpcmUoJy4vdmlldy1ydWxlcycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ydWxlc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdSdWxlcywgdGhpcy5xdWVyeUJ5SG9vaygncnVsZXMtbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5hbGdvcml0aG0gPSB0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIiA/XG4gICAgICBcIkFsZ29yaXRobTogSHlicmlkIE9ERS9TU0FcIiA6IFwiQWxnb3JpdGhtOiBcIiArIHRoaXMubW9kZWwuYWxnb3JpdGhtXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBhbGdvcml0aG0gPSB0aGlzLm1vZGVsLmFsZ29yaXRobVxuICAgIGlmKGFsZ29yaXRobSA9PT0gXCJPREVcIiB8fCBhbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCIpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdkZXRlcm1pbmlzdGljJykpLmNvbGxhcHNlKCdzaG93JylcbiAgICB9XG4gICAgaWYoYWxnb3JpdGhtID09PSBcIlNTQVwiIHx8IGFsZ29yaXRobSA9PT0gXCJUYXUtTGVhcGluZ1wiIHx8IGFsZ29yaXRobSA9PT0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N0b2NoYXN0aWMnKSkuY29sbGFwc2UoJ3Nob3cnKVxuICAgICAgaWYoYWxnb3JpdGhtID09PSBcIlNTQVwiKXtcbiAgICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdTU0EnKSkuY29sbGFwc2UoJ3Nob3cnKVxuICAgICAgfWVsc2V7XG4gICAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnVGF1JykpLmNvbGxhcHNlKCdzaG93JylcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGNoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vc3VwcG9ydCBmaWxlc1xudmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xudmFyIFRvb2x0aXBzID0gcmVxdWlyZSgnLi4vdG9vbHRpcHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3NpbXVsYXRpb25TZXR0aW5ncy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LW9kZV0nIDogJ2hhbmRsZVNlbGVjdFNpbXVsYXRpb25BbGdvcml0aG1DbGljaycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNlbGVjdC1zc2FdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtdGF1LWxlYXBpbmddJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtaHlicmlkLXRhdV0nIDogJ2hhbmRsZVNlbGVjdFNpbXVsYXRpb25BbGdvcml0aG1DbGljaycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNlbGVjdC1hdXRvbWF0aWNdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5tb2RlbCA9IGF0dHJzLm1vZGVsO1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5zaW11bGF0aW9uU2V0dGluZ3NcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYoIXRoaXMubW9kZWwuaXNBdXRvbWF0aWMpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3Qtb2RlJykpLnByb3AoJ2NoZWNrZWQnLCBCb29sZWFuKHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIk9ERVwiKSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1zc2EnKSkucHJvcCgnY2hlY2tlZCcsIEJvb2xlYW4odGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiU1NBXCIpKTsgXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC10YXUtbGVhcGluZycpKS5wcm9wKCdjaGVja2VkJywgQm9vbGVhbih0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJUYXUtTGVhcGluZ1wiKSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1oeWJyaWQtdGF1JykpLnByb3AoJ2NoZWNrZWQnLCBCb29sZWFuKHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIkh5YnJpZC1UYXUtTGVhcGluZ1wiKSk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1hdXRvbWF0aWMnKSkucHJvcCgnY2hlY2tlZCcsIHRoaXMubW9kZWwuaXNBdXRvbWF0aWMpO1xuICAgICAgdGhpcy5tb2RlbC5sZXRVc0Nob29zZUZvcllvdSgpO1xuICAgIH1cbiAgICB0aGlzLmRpc2FibGVJbnB1dEZpZWxkQnlBbGdvcml0aG0oKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoZSkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpXG4gIH0sXG4gIGhhbmRsZVNlbGVjdFNpbXVsYXRpb25BbGdvcml0aG1DbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdmFsdWUgPSBlLnRhcmdldC5kYXRhc2V0Lm5hbWU7XG4gICAgdGhpcy5zZXRTaW11bGF0aW9uQWxnb3JpdGhtKHZhbHVlKVxuICB9LFxuICBzZXRTaW11bGF0aW9uQWxnb3JpdGhtOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLm1vZGVsLmlzQXV0b21hdGljID0gQm9vbGVhbih2YWx1ZSA9PT0gJ0F1dG9tYXRpYycpXG4gICAgaWYoIXRoaXMubW9kZWwuaXNBdXRvbWF0aWMpe1xuICAgICAgdGhpcy5tb2RlbC5hbGdvcml0aG0gPSB2YWx1ZTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMubW9kZWwubGV0VXNDaG9vc2VGb3JZb3UoKTtcbiAgICB9XG4gICAgdGhpcy5kaXNhYmxlSW5wdXRGaWVsZEJ5QWxnb3JpdGhtKCk7XG4gIH0sXG4gIGRpc2FibGVJbnB1dEZpZWxkQnlBbGdvcml0aG06IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXNBdXRvbWF0aWMgPSB0aGlzLm1vZGVsLmlzQXV0b21hdGljXG4gICAgdmFyIGlzT0RFID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiT0RFXCI7XG4gICAgdmFyIGlzU1NBID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiU1NBXCI7XG4gICAgdmFyIGlzTGVhcGluZyA9IHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIlRhdS1MZWFwaW5nXCI7XG4gICAgdmFyIGlzSHlicmlkID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCI7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwicmVsYXRpdmUtdG9sZXJhbmNlXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgIShpc09ERSB8fCBpc0h5YnJpZCB8fCBpc0F1dG9tYXRpYykpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcImFic29sdXRlLXRvbGVyYW5jZVwiKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsICEoaXNPREUgfHwgaXNIeWJyaWQgfHwgaXNBdXRvbWF0aWMpKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJ0cmFqZWN0b3JpZXNcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzU1NBIHx8IGlzTGVhcGluZyB8fCBpc0h5YnJpZCB8fCBpc0F1dG9tYXRpYykpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcInNlZWRcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzU1NBIHx8IGlzTGVhcGluZyB8fCBpc0h5YnJpZCB8fCBpc0F1dG9tYXRpYykpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcInRhdS10b2xlcmFuY2VcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzSHlicmlkIHx8IGlzTGVhcGluZyB8fCBpc0F1dG9tYXRpYykpO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0UmVsYXRpdmVUb2xlcmFuY2U6IHtcbiAgICAgIGhvb2s6ICdyZWxhdGl2ZS10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdyZWxhdGl2ZS10b2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3JlbGF0aXZlVG9sJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnJlbGF0aXZlVG9sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0QWJzb2x1dGVUb2xlcmFuY2U6IHtcbiAgICAgIGhvb2s6ICdhYnNvbHV0ZS10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdhYnNvbHV0ZS10b2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ2Fic29sdXRlVG9sJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmFic29sdXRlVG9sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5wdXRSZWFsaXphdGlvbnM6IHtcbiAgICAgIGhvb2s6ICd0cmFqZWN0b3JpZXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdyZWFsaXphdGlvbnMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3JlYWxpemF0aW9ucycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wYXJlbnQuaXNQcmV2aWV3ID8gMSA6IHRoaXMubW9kZWwucmVhbGl6YXRpb25zXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0U2VlZDoge1xuICAgICAgaG9vazogJ3NlZWQnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnc2VlZCcsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ3NlZWQnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuc2VlZFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFRhdVRvbGVyYW5jZToge1xuICAgICAgaG9vazogJ3RhdS10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcgKHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ1RhdS1Ub2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3RhdVRvbCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC50YXVUb2xcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdTcGVjaWUgPSByZXF1aXJlKCcuL3ZpZXctc3BlY2llJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3NwZWNpZXNWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3U3BlY2llLCB0aGlzLnF1ZXJ5QnlIb29rKCdzcGVjaWUtbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdFdmVudEFzc2lnbm1lbnRzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIEFzc2lnbm1lbnRzVmlld2VyID0gcmVxdWlyZSgnLi9ldmVudC1hc3NpZ25tZW50cy12aWV3ZXInKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld0V2ZW50cy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaW5pdGlhbFZhbHVlJzoge1xuICAgICAgaG9vazogJ2V2ZW50LXRyaWdnZXItaW5pdC12YWx1ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY2hlY2tlZCcsXG4gICAgfSxcbiAgICAnbW9kZWwucGVyc2lzdGVudCc6IHtcbiAgICAgIGhvb2s6ICdldmVudC10cmlnZ2VyLXBlcnNpc3RlbnQnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2NoZWNrZWQnLFxuICAgIH0sXG4gICAgJ21vZGVsLnVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZSc6IHtcbiAgICAgIGhvb2s6ICd1c2UtdmFsdWVzLWZyb20tdHJpZ2dlci10aW1lJyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjaGVja2VkJyxcbiAgICB9LFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5kZWxheSA9IHRoaXMubW9kZWwuZGVsYXkgPT09IFwiXCIgPyBcIk5vbmVcIiA6IHRoaXMubW9kZWwuZGVsYXlcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIGFzc2lnbm1lbnRzVmlld2VyID0gbmV3IEFzc2lnbm1lbnRzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuZXZlbnRBc3NpZ25tZW50c1xuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGFzc2lnbm1lbnRzVmlld2VyLCAnYXNzaWdubWVudC12aWV3ZXInKTtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1BhcmFtZXRlcnMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG59KTsiLCJ2YXIga2F0ZXggPSByZXF1aXJlKCdrYXRleCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3UmVhY3Rpb25zLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yYXRlID0gdGhpcy5tb2RlbC5yZWFjdGlvblR5cGUgPT09IFwiY3VzdG9tLXByb3BlbnNpdHlcIiA/XG4gICAgICB0aGlzLm1vZGVsLnByb3BlbnNpdHkgOiB0aGlzLm1vZGVsLnJhdGUubmFtZVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBrYXRleC5yZW5kZXIodGhpcy5tb2RlbC5zdW1tYXJ5LCB0aGlzLnF1ZXJ5QnlIb29rKCdzdW1tYXJ5JyksIHtcbiAgICAgIGRpc3BsYXlNb2RlOiB0cnVlLFxuICAgICAgb3V0cHV0OiAnbWF0aG1sJ1xuICAgIH0pO1xuICB9LFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3UnVsZXMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdTcGVjaWVzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5zd2l0Y2hpbmdWYWxXaXRoTGFiZWwgPSB0aGlzLm1vZGVsLmlzU3dpdGNoVG9sID8gXG4gICAgICBcIlN3aXRjaGluZyBUb2xlcmFuY2U6IFwiICsgdGhpcy5tb2RlbC5zd2l0Y2hUb2wgOlxuICAgICAgXCJNaW5pbXVtIFZhbHVlIEZvciBTd2l0Y2hpbmc6IFwiICsgdGhpcy5tb2RlbC5zd2l0Y2hNaW5cbiAgfSxcbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgU2ltU2V0dGluZ3NWaWV3ID0gcmVxdWlyZSgnLi9zaW11bGF0aW9uLXNldHRpbmdzJyk7XG52YXIgUGFyYW1Td2VlcFNldHRpbmdzVmlldyA9IHJlcXVpcmUoJy4vcGFyYW1ldGVyLXN3ZWVwLXNldHRpbmdzJyk7XG52YXIgV29ya2Zsb3dTdGF0ZUJ1dHRvbnNWaWV3ID0gcmVxdWlyZSgnLi93b3JrZmxvdy1zdGF0ZS1idXR0b25zJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93RWRpdG9yLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudHlwZSA9IGF0dHJzLnR5cGU7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYodGhpcy5zdGF0dXMgPT09IFwibmV3XCIgfHwgdGhpcy5zdGF0dXMgPT09IFwicmVhZHlcIil7XG4gICAgICB0aGlzLnJlbmRlclNpbXVsYXRpb25TZXR0aW5nVmlldygpXG4gICAgICBpZih0aGlzLnR5cGUgPT09IFwicGFyYW1ldGVyU3dlZXBcIil7XG4gICAgICAgIHRoaXMudmFsaWRhdGVQc3dlZXAoKVxuICAgICAgICB0aGlzLnJlbmRlclBhcmFtZXRlclN3ZWVwU2V0dGluZ3NWaWV3KClcbiAgICAgIH1cbiAgICAgIHRoaXMucmVuZGVyV29ya2Zsb3dTdGF0ZUJ1dHRvbnMoKVxuICAgIH1cbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgcmVuZGVyU2ltdWxhdGlvblNldHRpbmdWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNpbXVsYXRpb25TZXR0aW5nc1ZpZXcgPSBuZXcgU2ltU2V0dGluZ3NWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncyxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzaW11bGF0aW9uU2V0dGluZ3NWaWV3LCAnc2ltLXNldHRpbmdzLWNvbnRhaW5lcicpO1xuICB9LFxuICByZW5kZXJQYXJhbWV0ZXJTd2VlcFNldHRpbmdzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGxldCBwYXJhbWV0ZXJTd2VlcFNldHRpbmdzVmlldyA9IG5ldyBQYXJhbVN3ZWVwU2V0dGluZ3NWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MsXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocGFyYW1ldGVyU3dlZXBTZXR0aW5nc1ZpZXcsICdwYXJhbS1zd2VlcC1zZXR0aW5ncy1jb250YWluZXInKTtcbiAgfSxcbiAgcmVuZGVyV29ya2Zsb3dTdGF0ZUJ1dHRvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgd29ya2Zsb3dTdGF0ZUJ1dHRvbnMgPSBuZXcgV29ya2Zsb3dTdGF0ZUJ1dHRvbnNWaWV3KHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHdvcmtmbG93U3RhdGVCdXR0b25zLCAnd29ya2Zsb3ctc3RhdGUtYnV0dG9ucy1jb250YWluZXInKTtcbiAgfSxcbiAgdmFsaWRhdGVQc3dlZXA6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc3BlY2llcyA9IHRoaXMubW9kZWwuc3BlY2llcztcbiAgICB2YXIgdmFsaWQgPSB0aGlzLnZhbGlkYXRlUHN3ZWVwQ2hpbGQoc3BlY2llcywgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnNwZWNpZXNPZkludGVyZXN0KVxuICAgIGlmKCF2YWxpZCkgLy8gaWYgdHJ1ZSB1cGRhdGUgc3BlY2llcyBvZiBpbnRlcmVzdFxuICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnNwZWNpZXNPZkludGVyZXN0ID0gc3BlY2llcy5hdCgwKVxuICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5wYXJhbWV0ZXJzO1xuICAgIHZhciB2YWxpZCA9IHRoaXMudmFsaWRhdGVQc3dlZXBDaGlsZChwYXJhbWV0ZXJzLCB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MucGFyYW1ldGVyT25lKVxuICAgIGlmKCF2YWxpZCkgeyAvLyBpZiB0cnVlIHVwZGF0ZSBwYXJhbWV0ZXIgb25lXG4gICAgICBsZXQgcGFyYW0gPSBwYXJhbWV0ZXJzLmF0KDApXG4gICAgICB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MucGFyYW1ldGVyT25lID0gcGFyYW1cbiAgICAgIGxldCB2YWwgPSBldmFsKHBhcmFtLmV4cHJlc3Npb24pXG4gICAgICB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MucDFNaW4gPSB2YWwgKiAwLjVcbiAgICAgIHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wMU1heCA9IHZhbCAqIDEuNVxuICAgIH1cbiAgICBpZihwYXJhbWV0ZXJzLmF0KDEpKXsgLy8gaXMgdGhlcmUgbW9yZSB0aGFuIG9uZSBwYXJhbWV0ZXJcbiAgICAgIHZhciB2YWxpZCA9IHRoaXMudmFsaWRhdGVQc3dlZXBDaGlsZChwYXJhbWV0ZXJzLCB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MucGFyYW1ldGVyVHdvKVxuICAgICAgaWYoIXZhbGlkKXsgLy8gaWYgdHJ1ZSB1cGRhdGUgcGFyYW1ldGVyIDJcbiAgICAgICAgbGV0IHBhcmFtID0gcGFyYW1ldGVycy5hdCgxKVxuICAgICAgICB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MucGFyYW1ldGVyVHdvID0gcGFyYW1cbiAgICAgICAgbGV0IHZhbCA9IGV2YWwocGFyYW0uZXhwcmVzc2lvbilcbiAgICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnAyTWluID0gdmFsICogMC41XG4gICAgICAgIHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wMk1heCA9IHZhbCAqIDEuNVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdmFsaWRhdGVQc3dlZXBDaGlsZDogZnVuY3Rpb24gKGNvbGxlY3Rpb24sIGNoaWxkKSB7XG4gICAgaWYoIWNoaWxkLmNvbXBJRCkgLy8gaWYgdHJ1ZSBjaGlsZCBpcyBub3Qgc2V0XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBsZXQgZXhpc3RzID0gQm9vbGVhbihjb2xsZWN0aW9uLmZpbHRlcihmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgIGlmKGNoaWxkLmNvbXBJRCA9PT0gbW9kZWwuY29tcElEKVxuICAgICAgICByZXR1cm4gbW9kZWxcbiAgICB9KS5sZW5ndGgpIC8vIGlmIHRydWUgY2hpbGQgZXhpdHMgd2l0aGluIHRoZSBtb2RlbFxuICAgIHJldHVybiBleGlzdHNcbiAgfSxcbiAgY29sbGFwc2VDb250YWluZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJ3b3JrZmxvdy1lZGl0b3ItY29udGFpbmVyXCIpKS5jb2xsYXBzZSgpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIHhociA9IHJlcXVpcmUoJ3hocicpO1xudmFyIGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93SW5mby5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gICAgdGhpcy5sb2dzUGF0aCA9IGF0dHJzLmxvZ3NQYXRoO1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHRoaXMubGlzdE9mV2FybmluZ3MgPSBbXTtcbiAgICB0aGlzLmxpc3RPZkVycm9ycyA9IFtdO1xuICAgIHRoaXMubGlzdE9mTm90ZXMgPSBbXTtcbiAgICBpZih0aGlzLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJyB8fCB0aGlzLnN0YXR1cyA9PT0gJ2Vycm9yJyl7XG4gICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvd29ya2Zsb3cvd29ya2Zsb3ctbG9nc1wiLCB0aGlzLmxvZ3NQYXRoKVxuICAgICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCl7XG4gICAgICAgICAgdmFyIGxvZ3MgPSBib2R5LnNwbGl0KFwiXFxuXCIpXG4gICAgICAgICAgbG9ncy5mb3JFYWNoKHNlbGYucGFyc2VMb2dzLCBzZWxmKVxuICAgICAgICAgIHNlbGYuZXhwYW5kTG9nQ29udGFpbmVycygpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBib2R5ID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKHRoaXMuc3RhdHVzID09PSAnY29tcGxldGUnKXtcbiAgICAgIHRoaXMuZW5hYmxlQ29sbGFwc2VCdXR0b24oKVxuICAgIH1lbHNlIGlmKHRoaXMuc3RhdHVzID09PSAnZXJyb3InKXtcbiAgICAgIHRoaXMuZXhwYW5kSW5mb0NvbnRhaW5lcigpXG4gICAgfVxuICB9LFxuICBwYXJzZUxvZ3M6IGZ1bmN0aW9uIChsb2cpIHtcbiAgICB2YXIgbWVzc2FnZSA9IGxvZy5zcGxpdCgncm9vdCAtICcpLnBvcCgpXG4gICAgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiV0FSTklOR1wiKSl7XG4gICAgICB0aGlzLmxpc3RPZldhcm5pbmdzLnB1c2gobWVzc2FnZS5zcGxpdChcIldBUk5JTkdcIikucG9wKCkpXG4gICAgfWVsc2UgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiRVJST1JcIikpe1xuICAgICAgdGhpcy5saXN0T2ZFcnJvcnMucHVzaChtZXNzYWdlLnNwbGl0KFwiRVJST1JcIikucG9wKCkpXG4gICAgfWVsc2UgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiQ1JJVElDQUxcIikpe1xuICAgICAgdGhpcy5saXN0T2ZFcnJvcnMucHVzaChtZXNzYWdlLnNwbGl0KFwiQ1JJVElDQUxcIikucG9wKCkpXG4gICAgfWVsc2V7XG4gICAgICB0aGlzLmxpc3RPZk5vdGVzLnB1c2gobWVzc2FnZSlcbiAgICB9XG4gIH0sXG4gIGVuYWJsZUNvbGxhcHNlQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgfSxcbiAgZXhwYW5kSW5mb0NvbnRhaW5lcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlQ29sbGFwc2VCdXR0b24oKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3dvcmtmbG93LWluZm8nKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlXCIpXG4gIH0sXG4gIGV4cGFuZExvZ0NvbnRhaW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLmxpc3RPZldhcm5pbmdzLmxlbmd0aCkge1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy13YXJuaW5ncycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgdmFyIGxpc3RPZldhcm5pbmdzID0gXCI8cD5cIiArIHRoaXMubGlzdE9mV2FybmluZ3Muam9pbignPGJyPicpICsgXCI8L3A+XCI7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2xpc3Qtb2Ytd2FybmluZ3MnKSkuaHRtbChsaXN0T2ZXYXJuaW5ncyk7XG4gICAgfVxuICAgIGlmKHRoaXMubGlzdE9mRXJyb3JzLmxlbmd0aCkge1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1lcnJvcnMnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAgIHZhciBsaXN0T2ZFcnJvcnMgPSBcIjxwPlwiICsgdGhpcy5saXN0T2ZFcnJvcnMuam9pbignPGJyPicpICsgXCI8L3A+XCI7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2xpc3Qtb2YtZXJyb3JzJykpLmh0bWwobGlzdE9mRXJyb3JzKTtcbiAgICB9XG4gICAgaWYodGhpcy5saXN0T2ZOb3Rlcy5sZW5ndGgpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctc3RhdGlzdGljcycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgdmFyIGxpc3RPZk5vdGVzID0gXCI8cD5cIiArIHRoaXMubGlzdE9mTm90ZXMuam9pbignPGJyPicpICsgXCI8L3A+XCI7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2xpc3Qtb2Ytbm90ZXMnKSkuaHRtbChsaXN0T2ZOb3Rlcyk7XG4gICAgfVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vayhcImNvbGxhcHNlXCIpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKFwiY29sbGFwc2VcIikpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vayhcImNvbGxhcHNlXCIpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbi8vc3VwcG9ydCBmaWxlc1xudmFyIFBsb3RseSA9IHJlcXVpcmUoJy4uL2xpYi9wbG90bHknKTtcbnZhciBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoJy4uL3Rvb2x0aXBzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgZ2lsbGVzcHlSZXN1bHRzVGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZ2lsbGVzcHlSZXN1bHRzLnB1ZycpO1xudmFyIGdpbGxlc3B5UmVzdWx0c0Vuc2VtYmxlVGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZ2lsbGVzcHlSZXN1bHRzRW5zZW1ibGUucHVnJyk7XG52YXIgcGFyYW1ldGVyU3dlZXBSZXN1bHRzVGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyU3dlZXBSZXN1bHRzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2Utc3RkZGV2cmFuZ2VdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2Utc3RkZGV2cmFuZ2VcIik7XG4gICAgfSxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZS10cmFqZWN0b3JpZXNdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXCIpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2Utc3RkZGV2XScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXN0ZGRldlwiKTtcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLXRyYWptZWFuXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXRyYWptZWFuXCIpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2UtcHN3ZWVwXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZS1wc3dlZXBcIik7XG4gICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2VcIik7XG4gICAgfSxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9dGl0bGVdJyA6ICdzZXRUaXRsZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXhheGlzXScgOiAnc2V0WEF4aXMnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz15YXhpc10nIDogJ3NldFlBeGlzJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3BlY2llLW9mLWludGVyZXN0LWxpc3RdJyA6ICdnZXRQbG90Rm9yU3BlY2llcycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWZlYXR1cmUtZXh0cmFjdGlvbi1saXN0XScgOiAnZ2V0UGxvdEZvckZlYXR1cmVFeHRyYWN0b3InLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1lbnNlbWJsZS1hZ2dyYWdhdG9yLWxpc3RdJyA6ICdnZXRQbG90Rm9yRW5zZW1ibGVBZ2dyYWdhdG9yJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1wbG90XScgOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHR5cGUgPSBlLnRhcmdldC5pZFxuICAgICAgaWYodGhpcy5wbG90c1t0eXBlXSkge1xuICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJlZGl0LXBsb3QtYXJnc1wiKSkuY29sbGFwc2UoXCJzaG93XCIpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMuZ2V0UGxvdCh0eXBlKTtcbiAgICAgICAgZS50YXJnZXQuaW5uZXJUZXh0ID0gXCJFZGl0IFBsb3RcIlxuICAgICAgfVxuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZG93bmxvYWQtcG5nLWN1c3RvbV0nIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB0eXBlID0gZS50YXJnZXQuaWQ7XG4gICAgICB0aGlzLmNsaWNrRG93bmxvYWRQTkdCdXR0b24odHlwZSlcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWRvd25sb2FkLWpzb25dJyA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgdHlwZSA9IGUudGFyZ2V0LmlkO1xuICAgICAgdGhpcy5leHBvcnRUb0pzb25GaWxlKHRoaXMucGxvdHNbdHlwZV0sIHR5cGUpXG4gICAgfSxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1kb3dubG9hZC1yZXN1bHRzLWNzdl0nIDogJ2hhbmRsZXJEb3dubG9hZFJlc3VsdHNDc3ZDbGljaycsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMucGFyYW1ldGVyU3dlZXBSZXN1bHRzXG4gICAgdGhpcy50cmFqZWN0b3JpZXMgPSBhdHRycy50cmFqZWN0b3JpZXM7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gICAgdGhpcy5zcGVjaWVzID0gYXR0cnMuc3BlY2llcztcbiAgICB0aGlzLnR5cGUgPSBhdHRycy50eXBlO1xuICAgIHRoaXMuc3BlY2llc09mSW50ZXJlc3QgPSBhdHRycy5zcGVjaWVzT2ZJbnRlcmVzdDtcbiAgICB0aGlzLmZlYXR1cmVFeHRyYWN0b3IgPSBcImZpbmFsXCI7XG4gICAgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IgPSBcImF2Z1wiO1xuICAgIHRoaXMucGxvdHMgPSB7fVxuICAgIHRoaXMucGxvdEFyZ3MgPSB7fVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLnR5cGUgPT09IFwicGFyYW1ldGVyU3dlZXBcIil7XG4gICAgICB0aGlzLnRlbXBsYXRlID0gcGFyYW1ldGVyU3dlZXBSZXN1bHRzVGVtcGxhdGVcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLnRyYWplY3RvcmllcyA+IDEgPyBnaWxsZXNweVJlc3VsdHNFbnNlbWJsZVRlbXBsYXRlIDogZ2lsbGVzcHlSZXN1bHRzVGVtcGxhdGVcbiAgICB9XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYodGhpcy5zdGF0dXMgPT09ICdjb21wbGV0ZScpe1xuICAgICAgdGhpcy5leHBhbmRDb250YWluZXIoKVxuICAgIH1cbiAgICB2YXIgc3BlY2llc05hbWVzID0gdGhpcy5zcGVjaWVzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7IHJldHVybiBzcGVjaWUubmFtZX0pO1xuICAgIHZhciBmZWF0dXJlRXh0cmFjdG9ycyA9IFtcIk1pbmltdW0gb2YgcG9wdWxhdGlvblwiLCBcIk1heGltdW0gb2YgcG9wdWxhdGlvblwiLCBcIkF2ZXJhZ2Ugb2YgcG9wdWxhdGlvblwiLCBcIlZhcmlhbmNlIG9mIHBvcHVsYXRpb25cIiwgXCJQb3B1bGF0aW9uIGF0IGxhc3QgdGltZSBwb2ludFwiXVxuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JzID0gW1wiTWluaW11bSBvZiBlbnNlbWJsZVwiLCBcIk1heGltdW0gb2YgZW5zZW1ibGVcIiwgXCJBdmVyYWdlIG9mIGVuc2VtYmxlXCIsIFwiVmFyaWFuY2Ugb2YgZW5zZW1ibGVcIl1cbiAgICB2YXIgc3BlY2llc09mSW50ZXJlc3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3NwZWNpZXMtb2YtaW50ZXJlc3QnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBzcGVjaWVzTmFtZXMsXG4gICAgICB2YWx1ZTogdGhpcy5zcGVjaWVzT2ZJbnRlcmVzdFxuICAgIH0pO1xuICAgIHZhciBmZWF0dXJlRXh0cmFjdG9yVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdmZWF0dXJlLWV4dHJhY3RvcicsXG4gICAgICByZXF1aXJlczogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IGZlYXR1cmVFeHRyYWN0b3JzLFxuICAgICAgdmFsdWU6IFwiUG9wdWxhdGlvbiBhdCBsYXN0IHRpbWUgcG9pbnRcIlxuICAgIH0pO1xuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ2Vuc2VtYmxlLWFnZ3JhZ2F0b3InLFxuICAgICAgcmVxdWlyZXM6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBlbnNlbWJsZUFnZ3JhZ2F0b3JzLFxuICAgICAgdmFsdWU6IFwiQXZlcmFnZSBvZiBlbnNlbWJsZVwiXG4gICAgfSk7XG4gICAgaWYodGhpcy50eXBlID09PSBcInBhcmFtZXRlclN3ZWVwXCIpe1xuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3BlY2llc09mSW50ZXJlc3RWaWV3LCAnc3BlY2llLW9mLWludGVyZXN0LWxpc3QnKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGZlYXR1cmVFeHRyYWN0b3JWaWV3LCAnZmVhdHVyZS1leHRyYWN0aW9uLWxpc3QnKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGVuc2VtYmxlQWdncmFnYXRvclZpZXcsICdlbnNlbWJsZS1hZ2dyYWdhdG9yLWxpc3QnKTtcbiAgICAgIGlmKHRoaXMudHJhamVjdG9yaWVzIDw9IDEpe1xuICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2Vuc2VtYmxlLWFnZ3JhZ2F0b3ItbGlzdCcpKS5maW5kKCdzZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKHNvdXJjZSkpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soc291cmNlKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKHNvdXJjZSkpLnRleHQoJysnKTtcbiAgfSxcbiAgc2V0VGl0bGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5wbG90QXJnc1sndGl0bGUnXSA9IGUudGFyZ2V0LnZhbHVlXG4gICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLnBsb3RzKSB7XG4gICAgICB2YXIgZmlnID0gdGhpcy5wbG90c1t0eXBlXVxuICAgICAgZmlnLmxheW91dC50aXRsZS50ZXh0ID0gZS50YXJnZXQudmFsdWVcbiAgICAgIHRoaXMucGxvdEZpZ3VyZShmaWcsIHR5cGUpXG4gICAgfVxuICB9LFxuICBzZXRZQXhpczogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLnBsb3RBcmdzWyd5YXhpcyddID0gZS50YXJnZXQudmFsdWVcbiAgICBmb3IgKHZhciB0eXBlIGluIHRoaXMucGxvdHMpIHtcbiAgICAgIHZhciBmaWcgPSB0aGlzLnBsb3RzW3R5cGVdXG4gICAgICBmaWcubGF5b3V0LnlheGlzLnRpdGxlLnRleHQgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgdGhpcy5wbG90RmlndXJlKGZpZywgdHlwZSlcbiAgICB9XG4gIH0sXG4gIHNldFhBeGlzOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMucGxvdEFyZ3NbJ3hheGlzJ10gPSBlLnRhcmdldC52YWx1ZVxuICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5wbG90cykge1xuICAgICAgdmFyIGZpZyA9IHRoaXMucGxvdHNbdHlwZV1cbiAgICAgIGZpZy5sYXlvdXQueGF4aXMudGl0bGUudGV4dCA9IGUudGFyZ2V0LnZhbHVlXG4gICAgICB0aGlzLnBsb3RGaWd1cmUoZmlnLCB0eXBlKVxuICAgIH1cbiAgfSxcbiAgZ2V0UGxvdDogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVsID0gdGhpcy5xdWVyeUJ5SG9vayh0eXBlKVxuICAgIFBsb3RseS5wdXJnZShlbClcbiAgICB2YXIgZGF0YSA9IHt9XG4gICAgaWYodHlwZSA9PT0gJ3Bzd2VlcCcpe1xuICAgICAgbGV0IGtleSA9IHRoaXMuZ2V0UHN3ZWVwS2V5KClcbiAgICAgIGRhdGFbJ3BsdF9rZXknXSA9IGtleTtcbiAgICB9ZWxzZXtcbiAgICAgIGRhdGFbJ3BsdF9rZXknXSA9IHR5cGU7XG4gICAgfVxuICAgIGlmKE9iamVjdC5rZXlzKHRoaXMucGxvdEFyZ3MpLmxlbmd0aCl7XG4gICAgICBkYXRhWydwbHRfZGF0YSddID0gdGhpcy5wbG90QXJnc1xuICAgIH1lbHNle1xuICAgICAgZGF0YVsncGx0X2RhdGEnXSA9IFwiTm9uZVwiXG4gICAgfVxuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi93b3JrZmxvdy9wbG90LXJlc3VsdHNcIiwgdGhpcy5wYXJlbnQud2tmbFBhdGgsICc/ZGF0YT0nICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIHhocih7dXJsOiBlbmRwb2ludCwganNvbjogdHJ1ZX0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KXtcbiAgICAgIGlmKHJlc3BvbnNlLnN0YXR1c0NvZGUgPj0gNDAwKXtcbiAgICAgICAgJChzZWxmLnF1ZXJ5QnlIb29rKHR5cGUpKS5odG1sKGJvZHkuTWVzc2FnZSlcbiAgICAgIH1lbHNle1xuICAgICAgICBzZWxmLnBsb3RzW3R5cGVdID0gYm9keVxuICAgICAgICBzZWxmLnBsb3RGaWd1cmUoYm9keSwgdHlwZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHBsb3RGaWd1cmU6IGZ1bmN0aW9uIChmaWd1cmUsIHR5cGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGhvb2sgPSB0eXBlO1xuICAgIHZhciBlbCA9IHRoaXMucXVlcnlCeUhvb2soaG9vaylcbiAgICBQbG90bHkubmV3UGxvdChlbCwgZmlndXJlKVxuICAgIHRoaXMucXVlcnlBbGwoXCIjXCIgKyB0eXBlKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgaWYoZWwuZGlzYWJsZWQpe1xuICAgICAgICBlbC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBjbGlja0Rvd25sb2FkUE5HQnV0dG9uOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciBwbmdCdXR0b24gPSAkKCdkaXZbZGF0YS1ob29rKj0nK3R5cGUrJ10gYVtkYXRhLXRpdGxlKj1cIkRvd25sb2FkIHBsb3QgYXMgYSBwbmdcIl0nKVswXVxuICAgIHBuZ0J1dHRvbi5jbGljaygpXG4gIH0sXG4gIGV4cG9ydFRvSnNvbkZpbGU6IGZ1bmN0aW9uIChqc29uRGF0YSwgcGxvdFR5cGUpIHtcbiAgICBsZXQgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KGpzb25EYXRhKTtcbiAgICBsZXQgZGF0YVVSSSA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFTdHIpO1xuICAgIGxldCBleHBvcnRGaWxlRGVmYXVsdE5hbWUgPSBwbG90VHlwZSArICctcGxvdC5qc29uJztcblxuICAgIGxldCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVVJJKTtcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZXhwb3J0RmlsZURlZmF1bHROYW1lKTtcbiAgICBsaW5rRWxlbWVudC5jbGljaygpO1xuICB9LFxuICBoYW5kbGVyRG93bmxvYWRSZXN1bHRzQ3N2Q2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgbGV0IHBhdGggPSB0aGlzLnBhcmVudC53a2ZsUGF0aFxuICAgIHRoaXMuZ2V0RXhwb3J0RGF0YShwYXRoKVxuICB9LFxuICBnZXRFeHBvcnREYXRhOiBmdW5jdGlvbiAod2tmbFBhdGgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiZmlsZS9kb3dubG9hZC16aXAvcmVzdWx0c2NzdlwiLCB3a2ZsUGF0aClcbiAgICBjb25zb2xlLmxvZyhlbmRwb2ludClcbiAgICB4aHIoe3VyaTogZW5kcG9pbnQsIGpzb246IHRydWV9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgICAgICBzZWxmLmV4cG9ydFRvWmlwRmlsZShib2R5LlBhdGgpXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGV4cG9ydFRvWmlwRmlsZTogZnVuY3Rpb24gKHJlc3VsdHNQYXRoKSB7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwiZmlsZXNcIiwgcmVzdWx0c1BhdGgpO1xuICAgIC8vIGNvbnNvbGUubG9nKGVuZHBvaW50KVxuICAgIC8vIGNvbnNvbGUubG9nKFwiaHR0cDovLzEyNy4wLjAuMTo4ODg4L2VkaXQvRXhhbXBsZXMvTWljaGFlbGlzX01lbnRlbi9NaWNoYWVsaXNfTWVudGVuXzA0MTcyMDIwXzEyMTAzMS53a2ZsL3Jlc3VsdHMvcmVzdWx0c19jc3ZfMDQxNzIwMjBfMTIxMDMxLnppcFwiKVxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gZW5kcG9pbnRcbiAgfSxcbiAgZXhwYW5kQ29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1yZXN1bHRzJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlXCIpXG4gICAgaWYodGhpcy50eXBlID09PSBcInBhcmFtZXRlclN3ZWVwXCIpe1xuICAgICAgdGhpcy5nZXRQbG90KFwicHN3ZWVwXCIpXG4gICAgfWVsc2V7XG4gICAgICB0aGlzLnRyYWplY3RvcmllcyA+IDEgPyB0aGlzLmdldFBsb3QoXCJzdGRkZXZyYW5cIikgOiB0aGlzLmdldFBsb3QoXCJ0cmFqZWN0b3JpZXNcIilcbiAgICB9XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIGdldFBsb3RGb3JTcGVjaWVzOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc3BlY2llc09mSW50ZXJlc3QgPSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIHRoaXMuZ2V0UGxvdCgncHN3ZWVwJylcbiAgfSxcbiAgZ2V0UGxvdEZvckZlYXR1cmVFeHRyYWN0b3I6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGZlYXR1cmVFeHRyYWN0b3JzID0ge1wiTWluaW11bSBvZiBwb3B1bGF0aW9uXCI6XCJtaW5cIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTWF4aW11bSBvZiBwb3B1bGF0aW9uXCI6XCJtYXhcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQXZlcmFnZSBvZiBwb3B1bGF0aW9uXCI6XCJhdmdcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFyaWFuY2Ugb2YgcG9wdWxhdGlvblwiOlwidmFyXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlBvcHVsYXRpb24gYXQgbGFzdCB0aW1lIHBvaW50XCI6XCJmaW5hbFwifVxuICAgIHZhciB2YWx1ZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5mZWF0dXJlRXh0cmFjdG9yID0gZmVhdHVyZUV4dHJhY3RvcnNbdmFsdWVdXG4gICAgdGhpcy5nZXRQbG90KCdwc3dlZXAnKVxuICB9LFxuICBnZXRQbG90Rm9yRW5zZW1ibGVBZ2dyYWdhdG9yOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JzID0ge1wiTWluaW11bSBvZiBlbnNlbWJsZVwiOlwibWluXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTWF4aW11bSBvZiBlbnNlbWJsZVwiOlwibWF4XCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQXZlcmFnZSBvZiBlbnNlbWJsZVwiOlwiYXZnXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFyaWFuY2Ugb2YgZW5zZW1ibGVcIjpcInZhclwifVxuICAgIHZhciB2YWx1ZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IgPSBlbnNlbWJsZUFnZ3JhZ2F0b3JzW3ZhbHVlXVxuICAgIHRoaXMuZ2V0UGxvdCgncHN3ZWVwJylcbiAgfSxcbiAgZ2V0UHN3ZWVwS2V5OiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGtleSA9IHRoaXMuc3BlY2llc09mSW50ZXJlc3QgKyBcIi1cIiArIHRoaXMuZmVhdHVyZUV4dHJhY3RvclxuICAgIGlmKHRoaXMudHJhamVjdG9yaWVzID4gMSl7XG4gICAgICBrZXkgKz0gKFwiLVwiICsgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IpXG4gICAgfVxuICAgIHJldHVybiBrZXlcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFRpdGxlOiB7XG4gICAgICBob29rOiAndGl0bGUnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy50aXRsZSB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFhBeGlzOiB7XG4gICAgICBob29rOiAneGF4aXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAneGF4aXMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy54YXhpcyB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFlBeGlzOiB7XG4gICAgICBob29rOiAneWF4aXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAneWF4aXMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy55YXhpcyB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIiwibGV0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXRlQnV0dG9ucy5wdWcnKTtcblxubGV0IG1vZGVsU2F2ZUVycm9ySHRtbCA9ICh0aXRsZSwgZXJyb3IpID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwibW9kZWxTYXZlRXJyb3JNb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj4gJHt0aXRsZX0gPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxwPiAke2Vycm9yfSA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBib3gtc2hhZG93XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXNhdmVdJyA6ICdjbGlja1NhdmVIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1zdGFydC13b3JrZmxvd10nICA6ICdjbGlja1N0YXJ0V29ya2Zsb3dIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LW1vZGVsXScgOiAnY2xpY2tFZGl0TW9kZWxIYW5kbGVyJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudHlwZSA9IGF0dHJzLnR5cGVcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIGNsaWNrU2F2ZUhhbmRsZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5zYXZpbmcoKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbFxuICAgIHZhciBvcHRUeXBlID0gZG9jdW1lbnQuVVJMLmVuZHNXaXRoKFwiLm1kbFwiKSA/IFwic25cIiA6IFwic2VcIjtcbiAgICB0aGlzLnNhdmVNb2RlbChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgcXVlcnkgPSBKU09OLnN0cmluZ2lmeSh7XCJ0eXBlXCI6c2VsZi50eXBlLFwib3B0VHlwZVwiOm9wdFR5cGUsXCJtZGxQYXRoXCI6bW9kZWwuZGlyZWN0b3J5LFwid2tmbFBhdGhcIjpzZWxmLnBhcmVudC5wYXJlbnQud2tmbFBhdGh9KVxuICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksICd3b3JrZmxvdy9zYXZlLXdvcmtmbG93JykgKyBcIj9kYXRhPVwiICsgcXVlcnk7XG4gICAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICBzZWxmLnNhdmVkKCk7XG4gICAgICAgIGlmKGRvY3VtZW50LlVSTC5lbmRzV2l0aCgnLm1kbCcpKXtcbiAgICAgICAgICBzZWxmLnBhcmVudC5wYXJlbnQucmVsb2FkV2tmbCgpOyBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGNsaWNrU3RhcnRXb3JrZmxvd0hhbmRsZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5zYXZlTW9kZWwodGhpcy5ydW5Xb3JrZmxvdy5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY2xpY2tFZGl0TW9kZWxIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHRoaXMuc2F2ZU1vZGVsKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3MvbW9kZWxzL2VkaXRcIiwgc2VsZi5tb2RlbC5kaXJlY3RvcnkpO1xuICAgIH0pO1xuICB9LFxuICBzYXZlTW9kZWw6IGZ1bmN0aW9uIChjYikge1xuICAgIC8vIHRoaXMubW9kZWwgaXMgYSBNb2RlbFZlcnNpb24sIHRoZSBwYXJlbnQgb2YgdGhlIGNvbGxlY3Rpb24gaXMgTW9kZWxcbiAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICBpZih0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncy5pc0F1dG9tYXRpYyl7XG4gICAgICB0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncy5sZXRVc0Nob29zZUZvcllvdSgpO1xuICAgIH1cbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgIGlmIChjYikge1xuICAgICAgbW9kZWwuc2F2ZShtb2RlbC5hdHRyaWJ1dGVzLCB7XG4gICAgICAgIHN1Y2Nlc3M6IGNiLFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzYXZpbmcgbW9kZWw6XCIsIG1vZGVsKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUmVzcG9uc2U6XCIsIHJlc3BvbnNlKTtcbiAgICAgICAgICBzZWxmLnNhdmVFcnJvcigpXG4gICAgICAgICAgbGV0IHRpdGxlID0gcmVzcG9uc2UuYm9keS5SZWFzb25cbiAgICAgICAgICBsZXQgZXJyb3IgPSByZXNwb25zZS5ib2R5Lk1lc3NhZ2VcbiAgICAgICAgICB2YXIgc2F2ZUVycm9yTW9kYWwgPSAkKG1vZGVsU2F2ZUVycm9ySHRtbCh0aXRsZSwgZXJyb3IpKS5tb2RhbCgpXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kZWwuc2F2ZU1vZGVsKCk7XG4gICAgfVxuICB9LFxuICBzYXZpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2F2aW5nID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2aW5nLXdvcmtmbG93Jyk7XG4gICAgdmFyIHNhdmVkID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2ZWQtd29ya2Zsb3cnKTtcbiAgICB2YXIgc2F2ZUVycm9yID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2ZS1lcnJvcicpO1xuICAgIHNhdmVkLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBzYXZlRXJyb3Iuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNhdmluZy5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgfSxcbiAgc2F2ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2F2aW5nID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2aW5nLXdvcmtmbG93Jyk7XG4gICAgdmFyIHNhdmVkID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2ZWQtd29ya2Zsb3cnKTtcbiAgICBzYXZpbmcuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNhdmVkLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuICB9LFxuICBzYXZlRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2F2aW5nID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2aW5nLXdvcmtmbG93Jyk7XG4gICAgdmFyIHNhdmVFcnJvciA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmUtZXJyb3InKTtcbiAgICBzYXZpbmcuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNhdmVFcnJvci5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgfSxcbiAgcnVuV29ya2Zsb3c6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbDtcbiAgICB2YXIgb3B0VHlwZSA9IGRvY3VtZW50LlVSTC5lbmRzV2l0aChcIi5tZGxcIikgPyBcInJuXCIgOiBcInJlXCI7XG4gICAgdmFyIHF1ZXJ5ID0ge1widHlwZVwiOnRoaXMudHlwZSxcIm9wdFR5cGVcIjpcInNcIitvcHRUeXBlLFwibWRsUGF0aFwiOm1vZGVsLmRpcmVjdG9yeSxcIndrZmxQYXRoXCI6c2VsZi5wYXJlbnQucGFyZW50LndrZmxQYXRofVxuICAgIGxldCBpbml0UXVlcnkgPSBKU09OLnN0cmluZ2lmeShxdWVyeSlcbiAgICB2YXIgaW5pdEVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksICcvd29ya2Zsb3cvc2F2ZS13b3JrZmxvdycpICsgXCI/ZGF0YT1cIiArIGluaXRRdWVyeTtcbiAgICBxdWVyeS5vcHRUeXBlID0gb3B0VHlwZVxuICAgIGxldCBydW5RdWVyeSA9IEpTT04uc3RyaW5naWZ5KHF1ZXJ5KVxuICAgIHZhciBydW5FbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCAnL3dvcmtmbG93L3J1bi13b3JrZmxvdycpICsgXCI/ZGF0YT1cIiArIHJ1blF1ZXJ5O1xuICAgIHRoaXMuc2F2aW5nKClcbiAgICBjb25zb2xlLmxvZyhpbml0UXVlcnksIHJ1blF1ZXJ5LCB0eXBlb2YgcXVlcnkpXG4gICAgeGhyKHt1cmk6IGluaXRFbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICBpZihyZXNwb25zZS5zdGF0dXNDb2RlIDwgNDAwKXtcbiAgICAgICAgc2VsZi5zYXZlZCgpXG4gICAgICAgIHhocih7dXJpOiBydW5FbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgICAgc2VsZi5wYXJlbnQucGFyZW50LnJlbG9hZFdrZmwoKTtcbiAgICAgICAgfSlcbiAgICAgIH1lbHNle1xuICAgICAgICBzZWxmLnNhdmVFcnJvcigpXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93U3RhdHVzLnB1ZycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBsb2NhbERhdGUgPSBuZXcgRGF0ZShhdHRycy5zdGFydFRpbWUpXG4gICAgdmFyIGxvY2FsU3RhcnRUaW1lID0gdGhpcy5nZXRGb3JtYXR0ZWREYXRlKGxvY2FsRGF0ZSlcbiAgICB0aGlzLnN0YXJ0VGltZSA9IGxvY2FsU3RhcnRUaW1lO1xuICAgIHRoaXMuc3RhdHVzID0gYXR0cnMuc3RhdHVzO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZih0aGlzLnN0YXR1cyAhPT0gJ3JlYWR5JyAmJiB0aGlzLnN0YXR1cyAhPT0gJ25ldycpe1xuICAgICAgdGhpcy5leHBhbmRDb250YWluZXIoKVxuICAgIH1cbiAgfSxcbiAgZXhwYW5kQ29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1zdGF0dXMnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KClcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxuICBnZXRGb3JtYXR0ZWREYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xuICAgIHZhciBtb250aHMgPSBbJ0phbi4nLCAnRmViLicsICdNYXIuJywgJ0Fwci4nLCAnTWF5JywgJ0p1bi4nLCAnSnVsLicsICdBdWcuJywgJ1NlcHQuJywgJ09jdC4nLCAnTm92LicsICdEZWMuJ107XG4gICAgdmFyIG1vbnRoID0gbW9udGhzW2RhdGUuZ2V0TW9udGgoKV07IC8vIGdldCB0aGUgYWJyaXZpYXRlZCBtb250aFxuICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKTtcbiAgICB2YXIgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgdmFyIGFtcG0gPSBob3VycyA+PSAxMiA/ICdQTScgOiAnQU0nOyAvLyBnZXQgQU0gb3IgUE0gYmFzZWQgb24gaG91cnNcbiAgICBob3VycyA9IGhvdXJzJTEyOyAvLyBmb3JtYXQgaG91cnMgdG8gMTIgaG91ciB0aW1lIGZvcm1hdFxuICAgIGhvdXJzID0gaG91cnMgPyBob3VycyA6IDEyOyAvLyByZXBsYWNlIDAgd2l0aCAxMlxuICAgIHZhciBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgbWludXRlcyA9IG1pbnV0ZXMgPCAxMCA/ICcwJyArIG1pbnV0ZXMgOiBtaW51dGVzOyAvLyBmb3JtYXQgbWludXRlcyB0byBhbHdheXMgaGF2ZSB0d28gY2hhcnNcbiAgICB2YXIgdGltZVpvbmUgPSBkYXRlLnRvU3RyaW5nKCkuc3BsaXQoJyAnKS5wb3AoKSAvLyBnZXQgdGhlIHRpbWV6b25lIGZyb20gdGhlIGRhdGVcbiAgICB0aW1lWm9uZSA9IHRpbWVab25lLnJlcGxhY2UoJygnLCAnJykucmVwbGFjZSgnKScsICcnKSAvLyByZW1vdmUgdGhlICcoKScgZnJvbSB0aGUgdGltZXpvbmVcbiAgICByZXR1cm4gIG1vbnRoICsgXCIgXCIgKyBkYXkgKyBcIiwgXCIgKyB5ZWFyICsgXCIgIFwiICsgaG91cnMgKyBcIjpcIiArIG1pbnV0ZXMgKyBcIiBcIiArIGFtcG0gKyBcIiBcIiArIHRpbWVab25lO1xuICB9LFxufSk7Il0sInNvdXJjZVJvb3QiOiIifQ==