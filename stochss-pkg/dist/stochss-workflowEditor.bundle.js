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
//views
var PageView = __webpack_require__(/*! ./base */ "./client/pages/base.js");
var WorkflowEditorView = __webpack_require__(/*! ../views/workflow-editor */ "./client/views/workflow-editor.js");
var WorkflowStatusView = __webpack_require__(/*! ../views/workflow-status */ "./client/views/workflow-status.js");
var WorkflowResultsView = __webpack_require__(/*! ../views/workflow-results */ "./client/views/workflow-results.js");
var ModelViewer = __webpack_require__(/*! ../views/model-viewer */ "./client/views/model-viewer.js");
var InfoView = __webpack_require__(/*! ../views/workflow-info */ "./client/views/workflow-info.js");
var InputView = __webpack_require__(/*! ../views/input */ "./client/views/input.js");
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

let WorkflowManager = PageView.extend({
  template: template,
  events: {
    'change [data-hook=workflow-name]' : 'setWorkflowName',
    'click [data-hook=edit-workflow-help]' : function () {
      let modal = $(operationInfoModalHtml()).modal();
    },
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    var url = decodeURI(document.URL)
    this.type = url.split('/workflow/edit/').pop().split('/')[0];
    this.directory = url.split('/workflow/edit/' + this.type).pop();
    if(this.directory.endsWith('.mdl')){
      var modelFile = this.directory.split('/').pop();
      var name = modelFile.split('.')[0];
      this.modelDirectory = this.directory;
      this.workflowDate = this.getCurrentDate();
      this.workflowName = name + this.workflowDate;
      this.status = 'new';
    }else{
      var endpoint = path.join("stochss/api/workflow/workflow-info", this.directory, "/info.json");
      xhr({uri: endpoint}, function (err, response, body){
        var resp = JSON.parse(body)
        self.modelDirectory = resp.model.split('/home/jovyan').pop();
        self.type = resp.type;
        self.startTime = resp.start_time;
        var workflowDir = self.directory.split('/').pop();
        self.workflowName = workflowDir.split('.')[0];
        var statusEndpoint = path.join("stochss/api/workflow/workflow-status", self.directory);
        xhr({uri: statusEndpoint}, function (err, response, body) {
          self.status = body;
          if(self.status === 'complete' || self.status === 'error'){
            self.modelDirectory = path.join(self.directory, self.modelDirectory.split('/').pop());
          }
          self.renderSubviews();
        });
      });
    }
  },
  render: function () {
    PageView.prototype.render.apply(this, arguments);
    if(this.modelDirectory){
      this.renderSubviews()
    }
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderSubviews: function () {
    var workflowEditor = new WorkflowEditorView({
      directory: this.modelDirectory,
      type: this.type,
    });
    var inputName = new InputView({
      parent: this,
      required: true,
      name: 'name',
      label: 'Workflow Name: ',
      tests: '',
      modelKey: null,
      valueType: 'string',
      value: this.workflowName,
    });
    this.workflowEditorView = this.registerRenderSubview(workflowEditor, 'workflow-editor-container');
    this.registerRenderSubview(inputName, 'workflow-name');
    this.renderWorkflowStatusView();
    this.updateTrajectories();
    this.renderModelViewer();
    this.renderInfoView();
    if(this.status !== 'new'){
      this.disableWorkflowNameInput();
    }
    if(this.status !== 'new' && this.status !== 'ready'){
      workflowEditor.collapseContainer();
    }
    if(this.status === 'running'){
      this.getWorkflowStatus();
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    return this.renderSubview(view, this.queryByHook(hook));
  },
  setWorkflowName: function(e) {
    var newWorkflowName = e.target.value;
    if(newWorkflowName.endsWith(this.workflowDate)){
      this.workflowName = newWorkflowName
    }else{
      this.workflowName = newWorkflowName + this.workflowDate
      e.target.value = this.workflowName
    }
  },
  getCurrentDate: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return "_" + month + day + year + "_" + hours + minutes + seconds;
  },
  disableWorkflowNameInput: function() {
    $(this.queryByHook("workflow-name")).find('input').prop('disabled', true);
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
  getWorkflowInfo: function (cb) {
    var self = this;
    var endpoint = path.join("stochss/api/workflow/workflow-info", this.directory, "/info.json");
    xhr({uri: endpoint}, function (err, response, body){
      self.startTime = JSON.parse(body).start_time;
      cb();
    });
  },
  getWorkflowStatus: function () {
    var self = this;
    var statusEndpoint = path.join("stochss/api/workflow/workflow-status", this.directory);
    xhr({uri: statusEndpoint}, function (err, response, body) {
      if(self.status !== body ){
        self.status = body;
        self.renderWorkflowStatusView();
      }
      if(self.status !== 'error' && self.status !== 'complete'){
        setTimeout(_.bind(self.getWorkflowStatus, self), 1000);
      }else if(self.status === 'complete') {
        self.renderResultsView();
        self.renderModelViewer();
        self.renderInfoView();
      }
    });
  },
  updateWorkflowStatus: function () {
    var self = this;
    setTimeout(function () {  
      self.getWorkflowInfo(function () {
        self.getWorkflowStatus();
      });
    }, 3000);
  },
  renderResultsView: function () {
    if(this.workflowResultsView){
      this.workflowResultsView.remove();
    }
    var resultsView = new WorkflowResultsView({
      trajectories: this.trajectories,
      status: this.status,
      species: this.species,
      type: this.type,
      speciesOfInterest: this.speciesOfInterest.name
    });
    this.workflowResultsView = this.registerRenderSubview(resultsView, 'workflow-results-container');
  },
  renderModelViewer: function (){
    if(this.modelViewer){
      this.modelViewer.remove();
    }
    this.modelViewer = new ModelViewer({
      directory: this.modelDirectory,
      status: this.status,
      type: this.type
    });
    this.registerRenderSubview(this.modelViewer, 'model-viewer-container')
  },
  renderInfoView: function () {
    if(this.infoView){
      this.infoView.remove();
    }
    this.infoView = new InfoView({
      status: this.status,
      logsPath: path.join(this.directory, "logs.txt")
    });
    this.registerRenderSubview(this.infoView, 'workflow-info-container')
  },
  updateTrajectories: function () {
    var self = this
    if(this.trajectories === undefined){
      setTimeout(function () {
        self.updateTrajectories()
      }, 1000);
    }
    else{
      this.trajectories = this.workflowEditorView.model.simulationSettings.algorithm !== "ODE" ? this.trajectories : 1
      this.renderResultsView()
    }
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Trajectories\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-trajectories\" data-hook=\"collapse-trajectories\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-trajectories\"\u003E\u003Cdiv data-hook=\"trajectories\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" id=\"trajectories\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"trajectories\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"trajectories\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/gillespyResultsEnsemble.pug":
/*!***************************************************************!*\
  !*** ./client/templates/includes/gillespyResultsEnsemble.pug ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results-ensemble\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Standard Deviation Range\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-stddevrange\" data-hook=\"collapse-stddevrange\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-stddevrange\"\u003E\u003Cdiv data-hook=\"stddevran\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" id=\"stddevran\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"stddevran\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"stddevran\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Trajectories\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-trajectories\" data-hook=\"collapse-trajectories\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-trajectories\"\u003E\u003Cdiv data-hook=\"trajectories\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" id=\"trajectories\" data-hook=\"plot\"\u003EPlot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" data-hook=\"plot-multiple\" disabled\u003EMultiple Plots\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"trajectories\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"trajectories\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Standard Deviation\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-stddev\" data-hook=\"collapse-stddev\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-stddev\"\u003E\u003Cdiv data-hook=\"stddev\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" id=\"stddev\" data-hook=\"plot\"\u003EPlot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"stddev\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"stddev\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Trajectory Mean\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-trajmean\" data-hook=\"collapse-trajmean\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-trajmean\"\u003E\u003Cdiv data-hook=\"avg\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" id=\"avg\" data-hook=\"plot\"\u003EPlot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"avg\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"avg\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"species-of-interest\"\u003ESpecies of Interest:\u003C\u002Fspan\u003E\u003Cdiv class=\"inline\" id=\"species-of-interest\" data-hook=\"specie-of-interest-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"feature-extractor\"\u003EFeature Extraction: \u003C\u002Fspan\u003E\u003Cdiv class=\"inline\" id=\"feature-extractor\" data-hook=\"feature-extraction-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"ensemble-aggragator\"\u003EEnsemble Aggragator: \u003C\u002Fspan\u003E\u003Cdiv class=\"inline\" id=\"ensemble-aggragator\" data-hook=\"ensemble-aggragator-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EParameter Sweep\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-psweep\" data-hook=\"collapse-psweep\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-psweep\"\u003E\u003Cdiv data-hook=\"psweep\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" id=\"psweep\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"psweep\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" id=\"psweep\" data-hook=\"download-json\" disabled\u003EDownload JSON \u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/parameterSweepSettings.pug":
/*!**************************************************************!*\
  !*** ./client/templates/includes/parameterSweepSettings.pug ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"parameter-sweep-settings\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EParameter Sweep Settings\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-psweep-settings\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-psweep-settings\"\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-6 verticle-space\"\u003E\u003Cspan class=\"inline\"\u003ESweep Type:\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.sweepType, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fspan\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cinput type=\"radio\" name=\"sweepType\" data-hook=\"one-parameter\" data-name=\"1D\" checked\u003E One Parameter\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cinput type=\"radio\" name=\"sweepType\" data-hook=\"two-parameter\" data-name=\"2D\" disabled\u003E Two Parameters\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6 verticle-space\"\u003E\u003Cspan class=\"inline\" for=\"species-of-interest\"\u003ESpecies of Interest:\u003C\u002Fspan\u003E\u003Cdiv class=\"inline\" id=\"species-of-interest\" data-hook=\"specie-of-interest-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Ch5\u003EConfigure Variable(s)\u003C\u002Fh5\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ESweep Variable\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ECurrent Value\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EMinimum Value\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EMaximum Value\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ESteps\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"sweep-variable-one-select\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"current-value-one-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"minimum-value-one-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"maximum-value-one-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"step-one-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr class=\"collapse\" data-hook=\"parameter-two-row\"\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"sweep-variable-two-select\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"current-value-two-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"minimum-value-two-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"maximum-value-two-input\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"step-two-input\"\u003E \u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"simulation-settings\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ESimulation Settings\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-settings\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-settings\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\" colspan=\"5\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESimulation Algorithm\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.algorithm, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-ode\" data-name=\"ODE\"\u003E ODE\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-ssa\" data-name=\"SSA\"\u003E SSA\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-tau-leaping\" data-name=\"Tau-Leaping\"\u003E Tau Leaping\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-hybrid-tau\" data-name=\"Hybrid-Tau-Leaping\"\u003E Hybrid ODE\u002FSSA\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput class=\"inline\" type=\"radio\" name=\"simAlgorithm\" data-hook=\"select-automatic\" data-name=\"Automatic\"\u003E Choose for me\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.chooseForMe, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-5\"\u003E\u003Ch5 class=\"inline\"\u003EDeterministic Settings\u003C\u002Fh5\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ERelative Tolerance\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.rtol, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAbsolute Tolerance\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.atol, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"relative-tolerance\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"absolute-tolerance\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-7\"\u003E\u003Ch5 class=\"inline\"\u003EStochastic Settings\u003C\u002Fh5\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ETrajectories\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.realizations, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESeed\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.seed, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ETau Tolerance\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.ttol, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"trajectories\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"seed\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"tau-tolerance\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-info-view\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EInfo\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-info\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-info\" data-hook=\"workflow-info\"\u003E\u003Cdiv class=\"collapse\"\u003E\u003Ch5 class=\"inline\"\u003EStatistics\u003C\u002Fh5\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" data-hook=\"workflow-warnings\"\u003E\u003Ch5 class=\"inline\"\u003EWarnings\u003C\u002Fh5\u003E\u003Cdiv data-hook=\"list-of-warnings\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" data-hook=\"workflow-errors\"\u003E\u003Ch5 class=\"inline\"\u003EErrors\u003C\u002Fh5\u003E\u003Cdiv data-hook=\"list-of-errors\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/workflowStateButtons.pug":
/*!************************************************************!*\
  !*** ./client/templates/includes/workflowStateButtons.pug ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"mdl-edit-btn\"\u003E\u003Cbutton class=\"btn btn-primary\" data-hook=\"save\"\u003ESave\u003C\u002Fbutton\u003E\u003Cdiv class=\"mdl-edit-btn saving-status\" data-hook=\"saving-workflow\"\u003E\u003Cdiv class=\"spinner-grow\"\u003E\u003C\u002Fdiv\u003E\u003Cspan\u003ESaving...\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-edit-btn saved-status\" data-hook=\"saved-workflow\"\u003E\u003Cspan\u003ESaved\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" data-hook=\"start-workflow\"\u003EStart Workflow\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" data-hook=\"edit-model\"\u003EEdit Model\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/workflowStatus.pug":
/*!******************************************************!*\
  !*** ./client/templates/includes/workflowStatus.pug ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-status\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EStatus\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-status\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-status\" data-hook=\"workflow-status\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EDate\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EStatus\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.startTime) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.status) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cbutton class=\"btn btn-outline-primary\" data-hook=\"stop-workflow\" type=\"button\" disabled\u003EStop Workflow\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-outline-primary\" data-hook=\"restart-workflow\" type=\"button\" disabled\u003ERestart Workflow\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/pages/workflowManager.pug":
/*!****************************************************!*\
  !*** ./client/templates/pages/workflowManager.pug ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Csection class=\"page col-md-10\"\u003E\u003Cdiv class=\"row\"\u003E\u003Ch2\u003EWorkflow Manager\u003C\u002Fh2\u003E\u003Cbutton class=\"btn information-btn help\" data-hook=\"edit-workflow-help\"\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"far\" data-icon=\"question-circle\" class=\"svg-inline--fa fa-question-circle fa-w-16\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 512 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E \u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-name\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-status-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-results-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-info-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"model-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"computational-resources-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";;return pug_html;};
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
    var self = this;
    var directory = attrs.directory
    var modelFile = directory.split('/').pop();
    var name = modelFile.split('.')[0];
    var isSpatial = modelFile.split('.').pop().startsWith('s');
    this.model = new Model({
      name: name,
      directory: directory,
      is_spatial: isSpatial
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews();
      }
    });
  },
  renderSubviews: function () {
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
var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
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
    this.tooltips = {"sweepType":""}
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
var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
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
    this.tooltips = {"rtol":"Relative tolerance for ode solutions, controls a relative "+
                            "accuracy (number of correct digits).  The solver keeps the "+
                            "local error estimates less than atol + rtol * abs(y).  Value "+
                            "must be greater than 0.0.",
                     "atol":"Absolute tolerance for ode solutions, if a component of y is "+
                            "approximately below atol, the error only needs to fall within "+
                            "the same atol threshold, and the number of correct digits is "+
                            "not guaranteed.  The solver keeps the local error estimates "+
                            "less than atol + rtol * abs(y).  Value must be greater than 0.0.",
                     "ttol":"A relative error tolerance value governing tau-leaping tau "+
                            "selections.  Based on Cao, Y.; Gillespie, D. T.; Petzold, L. R. "+
                            "(2006). 'Efficient step size selection for the tau-leaping "+
                            "simulation method' (PDF). The Journal of Chemical Physics. 124 "+
                            "(4): 044109. Bibcode:2006JChPh.124d4109C. doi:10.1063/1.2159468. "+
                            "PMID 16460151  Value must be between 0.0 and 1.0.",
                     "seed":"The seed for the simulation.  Set to -1 for a random seed.",
                     "realizations":"The number of times to sample the chemical "+
                            "master equation. Each trajectory will be returned at the end "+
                            "of the simulation.",
                     "algorithm":"The solver by which to simulate the model.",
                     "chooseForMe":"Hybrid will be chosen based on Event, Rules, and other "+
                            "SBML model components or if the model is represented as "+
                            "Concentration.  Tau Leaping will be chosen if the Tau Tolerance "+
                            "is changed to a value other than 0.03.  SSA will be chosen if "+
                            "the model is represented as Population."
                    }
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
var tests = __webpack_require__(/*! ../views/tests */ "./client/views/tests.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var SimSettingsView = __webpack_require__(/*! ./simulation-settings */ "./client/views/simulation-settings.js");
var ParamSweepSettingsView = __webpack_require__(/*! ./parameter-sweep-settings */ "./client/views/parameter-sweep-settings.js");
var WorkflowStateButtonsView = __webpack_require__(/*! ./workflow-state-buttons */ "./client/views/workflow-state-buttons.js");
//models
var Model = __webpack_require__(/*! ../models/model */ "./client/models/model.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/workflowEditor.pug */ "./client/templates/includes/workflowEditor.pug");

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.type = attrs.type;
    this.settingsViews = {};
    var self = this;
    var directory = attrs.directory
    var modelFile = directory.split('/').pop();
    var name = modelFile.split('.')[0];
    var isSpatial = modelFile.split('.').pop().startsWith('s');
    this.model = new Model({
      name: name,
      directory: directory,
      is_spatial: isSpatial,
      isPreview: false,
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews();
      }
    });
  },
  update: function (e) {
  },
  updateValid: function (e) {
  },
  renderSubviews: function() {
    var inputName = new InputView({
      parent: this,
      required: true,
      name: 'name',
      label: 'Model Path: ',
      tests: tests.nameTests,
      modelKey: 'directory',
      valueType: 'string',
      value: this.model.directory,
    });
    //initialize the settings views and add it to the dictionary of settings views
    this.settingsViews.gillespy = new SimSettingsView({
      parent: this,
      model: this.model.simulationSettings,
    });
    this.settingsViews.parameterSweep = new ParamSweepSettingsView({
      parent: this,
      model: this.model.parameterSweepSettings,
    });
    var workflowStateButtons = new WorkflowStateButtonsView({
      model: this.model
    });
    this.registerRenderSubview(inputName, "model-name-container");
    this.registerRenderSubview(this.settingsViews['gillespy'], 'sim-settings-container');
    if(this.type === "parameterSweep"){
      this.registerRenderSubview(this.settingsViews['parameterSweep'], 'param-sweep-settings-container');
    }
    this.registerRenderSubview(workflowStateButtons, 'workflow-state-buttons-container');
    this.parent.trajectories = this.model.simulationSettings.realizations
    this.parent.species = this.model.species
    this.parent.speciesOfInterest = this.model.parameterSweepSettings.speciesOfInterest
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
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
    var endpoint = path.join("stochss/api/workflow/workflow-logs", this.logsPath)
    xhr({uri: endpoint}, function (err, response, body) {
      if(body){
        var logs = body.split("\n")
        logs.forEach(self.parseLogs, self)
        self.expandLogContainers();
      }
    });
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
var Plotly = __webpack_require__(/*! ../lib/plotly */ "./client/lib/plotly.js");
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
    'click [data-hook=collapse-trajmean]' : function () {
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
    }
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
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
    var endpoint = path.join("stochss/api/workflow/plot-results", this.parent.directory, '?data=' + JSON.stringify(data));
    xhr({url: endpoint}, function (err, response, body){
      if(body.startsWith("ERROR!")){
        $(self.queryByHook(type)).html(body)
      }else{
        var fig = JSON.parse(body)
        self.plots[type] = fig
        self.plotFigure(fig, type);
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

var app = __webpack_require__(/*! ampersand-app */ "./node_modules/ampersand-app/ampersand-app.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var xhr = __webpack_require__(/*! xhr */ "./node_modules/xhr/index.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/workflowStateButtons.pug */ "./client/templates/includes/workflowStateButtons.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=start-workflow]'  : 'clickStartWorkflowHandler',
    'click [data-hook=edit-model]' : 'clickEditModelHandler',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  clickSaveHandler: function (e) {
    this.saving();
    var self = this;
    var model = this.model
    var wkflType = this.parent.parent.type;
    var optType = document.URL.endsWith(".mdl") ? "sn" : "se";
    var workflow = document.URL.endsWith(".mdl") ? this.parent.parent.workflowName : this.parent.parent.directory
    this.saveModel(function () {
      var endpoint = path.join('stochss/api/workflow/save-workflow/', wkflType, optType, model.directory, "<--GillesPy2Workflow-->", workflow);
      xhr({uri: endpoint}, function (err, response, body) {
        self.saved();
        if(document.URL.endsWith('.mdl')){
          setTimeout(function () {
            //var dirname = path.dirname(document.URL).split('hub')
            //dirname.shift()
            //dirname = dirname.join('hub')
            window.location.href = path.join(self.parent.parent.workflowName + '.wkfl')
          }, 3000); 
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
      window.location.href = path.join("stochss/models/edit", self.model.directory);
    });
  },
  saveModel: function (cb) {
    // this.model is a ModelVersion, the parent of the collection is Model
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
        },
      });
    } else {
      model.saveModel();
    }
  },
  saving: function () {
    var saving = this.queryByHook('saving-workflow');
    var saved = this.queryByHook('saved-workflow');
    saved.style.display = "none";
    saving.style.display = "inline-block";
  },
  saved: function () {
    var saving = this.queryByHook('saving-workflow');
    var saved = this.queryByHook('saved-workflow');
    saving.style.display = "none";
    saved.style.display = "inline-block";
  },
  runWorkflow: function () {
    var model = this.model;
    var wkflType = this.parent.parent.type;
    var optType = document.URL.endsWith(".mdl") ? "rn" : "re";
    var workflow = document.URL.endsWith(".mdl") ? this.parent.parent.workflowName : this.parent.parent.directory
    var endpoint = path.join('stochss/api/workflow/run-workflow/', wkflType, optType, model.directory, "<--GillesPy2Workflow-->", workflow);
    var self = this;
    xhr({ uri: endpoint },function (err, response, body) {
      self.parent.collapseContainer();
      self.parent.parent.updateWorkflowStatus();
      if(document.URL.endsWith('.mdl')){
        setTimeout(function () {
          //var dirname = path.dirname(document.URL).split('hub')
          //dirname.shift()
          //dirname = dirname.join('hub')
          window.location.href = path.join(self.parent.parent.workflowName + '.wkfl')
        }, 3000);        
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
<<<<<<< HEAD
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL3dvcmtmbG93LW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudEFzc2lnbm1lbnRzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50c1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9naWxsZXNweVJlc3VsdHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZ2lsbGVzcHlSZXN1bHRzRW5zZW1ibGUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxTZXR0aW5nc1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFJlc3VsdHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFNldHRpbmdzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3J1bGVzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3NpbXVsYXRpb25TZXR0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BlY2llc1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRBc3NpZ25tZW50cy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdQYXJhbWV0ZXJzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdSZWFjdGlvbnMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1J1bGVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdTcGVjaWVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93RWRpdG9yLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93SW5mby5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXRlQnV0dG9ucy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXR1cy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9wYWdlcy93b3JrZmxvd01hbmFnZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9ldmVudC1hc3NpZ25tZW50cy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50cy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL21vZGVsLXNldHRpbmdzLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvbW9kZWwtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3Mtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3BhcmFtZXRlcnMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9yZWFjdGlvbnMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9ydWxlcy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3NpbXVsYXRpb24tc2V0dGluZ3Mtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zaW11bGF0aW9uLXNldHRpbmdzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zcGVjaWVzLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ldmVudC1hc3NpZ25tZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3ZpZXctcGFyYW1ldGVyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy92aWV3LXJlYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ydWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3dvcmtmbG93LWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctaW5mby5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctcmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctc3RhdGUtYnV0dG9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRLG9CQUFvQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBLDBCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUJBQXVCO0FBQ3ZDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3ZKQTtBQUFBO0FBQUEsUUFBUSxtQkFBTyxDQUFDLDJEQUFZO0FBQzVCLFFBQVEsbUJBQU8sQ0FBQyxvREFBUTtBQUN4QixZQUFZLG1CQUFPLENBQUMsK0NBQWdCO0FBQ3BDLFdBQVcsbUJBQU8sQ0FBQyxxREFBTTtBQUN6QixVQUFVLG1CQUFPLENBQUMsd0NBQUs7QUFDdkI7QUFDQSxlQUFlLG1CQUFPLENBQUMsc0NBQVE7QUFDL0IseUJBQXlCLG1CQUFPLENBQUMsbUVBQTBCO0FBQzNELHlCQUF5QixtQkFBTyxDQUFDLG1FQUEwQjtBQUMzRCwwQkFBMEIsbUJBQU8sQ0FBQyxxRUFBMkI7QUFDN0Qsa0JBQWtCLG1CQUFPLENBQUMsNkRBQXVCO0FBQ2pELGVBQWUsbUJBQU8sQ0FBQywrREFBd0I7QUFDL0MsZ0JBQWdCLG1CQUFPLENBQUMsK0NBQWdCO0FBQ3hDO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLDRGQUF3Qzs7QUFFOUI7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixvQkFBb0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxXQUFXLGNBQWM7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG9CQUFvQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWM7QUFDdkI7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0EsNEI7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7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c0RBQXNELG9CQUFvQjtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQyxFOzs7Ozs7Ozs7OztBQzVORCxRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEI7QUFDQSxXQUFXLG1CQUFPLENBQUMsdUVBQWdCO0FBQ25DLG9CQUFvQixtQkFBTyxDQUFDLDBEQUFrQjtBQUM5QztBQUNBLGVBQWUsbUJBQU8sQ0FBQyxvR0FBNEM7O0FBRW5FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDLEU7Ozs7Ozs7Ozs7O0FDdkJELFFBQVEsbUJBQU8sQ0FBQyxvREFBUTtBQUN4QjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkMsb0JBQW9CLG1CQUFPLENBQUMsMERBQWtCO0FBQzlDO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGtHQUEyQzs7QUFFbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRTs7Ozs7Ozs7Ozs7QUN2QkQsUUFBUSxtQkFBTyxDQUFDLG9EQUFRO0FBQ3hCO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLHVFQUFnQjtBQUNuQyxnQkFBZ0IsbUJBQU8sQ0FBQyxrREFBYztBQUN0QztBQUNBLGVBQWUsbUJBQU8sQ0FBQywwRkFBdUM7O0FBRTlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDLEU7Ozs7Ozs7Ozs7O0FDdkJELFFBQVEsbUJBQU8sQ0FBQyxvREFBUTtBQUN4QjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkM7QUFDQSxlQUFlLG1CQUFPLENBQUMsb0hBQW9EOztBQUUzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRTs7Ozs7Ozs7Ozs7QUNuQ0QsUUFBUSxtQkFBTyxDQUFDLG9EQUFRO0FBQ3hCLFlBQVksbUJBQU8sQ0FBQyx3Q0FBUztBQUM3QjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkMsZ0JBQWdCLG1CQUFPLENBQUMsd0NBQVM7QUFDakM7QUFDQSxlQUFlLG1CQUFPLENBQUMsd0dBQThDOztBQUVyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRCxrQkFBa0I7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUc7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUTtBQUNSLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQyxFOzs7Ozs7Ozs7OztBQ2xMRCxRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEI7QUFDQSxXQUFXLG1CQUFPLENBQUMsdUVBQWdCO0FBQ25DLGlCQUFpQixtQkFBTyxDQUFDLG9EQUFlO0FBQ3hDO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLDhGQUF5Qzs7QUFFaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRTs7Ozs7Ozs7Ozs7QUN2QkQ7QUFDQSxXQUFXLG1CQUFPLENBQUMsdUVBQWdCO0FBQ25DO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLDRHQUFnRDs7QUFFdkU7QUFDQTtBQUNBLENBQUMsRTs7Ozs7Ozs7Ozs7QUNQRDtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkMsd0JBQXdCLG1CQUFPLENBQUMsOEVBQTRCO0FBQzVEO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLHdGQUFzQzs7QUFFN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFOzs7Ozs7Ozs7OztBQ3hDRDtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkM7QUFDQSxlQUFlLG1CQUFPLENBQUMsZ0dBQTBDOztBQUVqRTtBQUNBO0FBQ0EsQ0FBQyxFOzs7Ozs7Ozs7OztBQ1BELFlBQVksbUJBQU8sQ0FBQyxpREFBTztBQUMzQjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkM7QUFDQSxlQUFlLG1CQUFPLENBQUMsOEZBQXlDOztBQUVoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQyxFOzs7Ozs7Ozs7OztBQ3BCRDtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkM7QUFDQSxlQUFlLG1CQUFPLENBQUMsc0ZBQXFDOztBQUU1RDtBQUNBO0FBQ0EsQ0FBQyxFOzs7Ozs7Ozs7OztBQ1BEO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLHVFQUFnQjtBQUNuQztBQUNBLGVBQWUsbUJBQU8sQ0FBQywwRkFBdUM7O0FBRTlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRTs7Ozs7Ozs7Ozs7QUNiRCxRQUFRLG1CQUFPLENBQUMsMkRBQVk7QUFDNUIsUUFBUSxtQkFBTyxDQUFDLG9EQUFRO0FBQ3hCLFlBQVksbUJBQU8sQ0FBQywrQ0FBZ0I7QUFDcEM7QUFDQSxXQUFXLG1CQUFPLENBQUMsdUVBQWdCO0FBQ25DLGdCQUFnQixtQkFBTyxDQUFDLHdDQUFTO0FBQ2pDLHNCQUFzQixtQkFBTyxDQUFDLG9FQUF1QjtBQUNyRCw2QkFBNkIsbUJBQU8sQ0FBQyw4RUFBNEI7QUFDakUsK0JBQStCLG1CQUFPLENBQUMsMEVBQTBCO0FBQ2pFO0FBQ0EsWUFBWSxtQkFBTyxDQUFDLGlEQUFpQjtBQUNyQztBQUNBLGVBQWUsbUJBQU8sQ0FBQyxnR0FBMEM7O0FBRWpFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFOzs7Ozs7Ozs7OztBQ2pGRCxRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEIsV0FBVyxtQkFBTyxDQUFDLHFEQUFNO0FBQ3pCLFVBQVUsbUJBQU8sQ0FBQyx3Q0FBSztBQUN2QjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkM7QUFDQSxlQUFlLG1CQUFPLENBQUMsNEZBQXdDOztBQUUvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxjQUFjO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRTs7Ozs7Ozs7Ozs7QUN2RUQsUUFBUSxtQkFBTyxDQUFDLG9EQUFRO0FBQ3hCLFdBQVcsbUJBQU8sQ0FBQyxxREFBTTtBQUN6QixVQUFVLG1CQUFPLENBQUMsd0NBQUs7QUFDdkIsYUFBYSxtQkFBTyxDQUFDLDZDQUFlO0FBQ3BDO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLHVFQUFnQjtBQUNuQyxnQkFBZ0IsbUJBQU8sQ0FBQyx3Q0FBUztBQUNqQyxpQkFBaUIsbUJBQU8sQ0FBQyw0RkFBdUI7QUFDaEQ7QUFDQSw4QkFBOEIsbUJBQU8sQ0FBQyxrR0FBMkM7QUFDakYsc0NBQXNDLG1CQUFPLENBQUMsa0hBQW1EO0FBQ2pHLG9DQUFvQyxtQkFBTyxDQUFDLDhHQUFpRDs7QUFFN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELG9CQUFvQjtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTLGNBQWM7QUFDdkI7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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ekMscUJBQXFCO0FBQ3JCLCtCQUErQjtBQUMvQjtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFIiwiZmlsZSI6InN0b2Noc3Mtd29ya2Zsb3dFZGl0b3IuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbiBcdC8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcIndvcmtmbG93RWRpdG9yXCI6IDBcbiBcdH07XG5cbiBcdHZhciBkZWZlcnJlZE1vZHVsZXMgPSBbXTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0dmFyIGpzb25wQXJyYXkgPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gfHwgW107XG4gXHR2YXIgb2xkSnNvbnBGdW5jdGlvbiA9IGpzb25wQXJyYXkucHVzaC5iaW5kKGpzb25wQXJyYXkpO1xuIFx0anNvbnBBcnJheS5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2s7XG4gXHRqc29ucEFycmF5ID0ganNvbnBBcnJheS5zbGljZSgpO1xuIFx0Zm9yKHZhciBpID0gMDsgaSA8IGpzb25wQXJyYXkubGVuZ3RoOyBpKyspIHdlYnBhY2tKc29ucENhbGxiYWNrKGpzb25wQXJyYXlbaV0pO1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSBvbGRKc29ucEZ1bmN0aW9uO1xuXG5cbiBcdC8vIGFkZCBlbnRyeSBtb2R1bGUgdG8gZGVmZXJyZWQgbGlzdFxuIFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2goW1wiLi9jbGllbnQvcGFnZXMvd29ya2Zsb3ctbWFuYWdlci5qc1wiLFwiY29tbW9uXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwidmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHRlc3RzID0gcmVxdWlyZSgnLi4vdmlld3MvdGVzdHMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIHhociA9IHJlcXVpcmUoJ3hocicpO1xuLy92aWV3c1xudmFyIFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi9iYXNlJyk7XG52YXIgV29ya2Zsb3dFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3Mvd29ya2Zsb3ctZWRpdG9yJyk7XG52YXIgV29ya2Zsb3dTdGF0dXNWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3Mvd29ya2Zsb3ctc3RhdHVzJyk7XG52YXIgV29ya2Zsb3dSZXN1bHRzVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3dvcmtmbG93LXJlc3VsdHMnKTtcbnZhciBNb2RlbFZpZXdlciA9IHJlcXVpcmUoJy4uL3ZpZXdzL21vZGVsLXZpZXdlcicpO1xudmFyIEluZm9WaWV3ID0gcmVxdWlyZSgnLi4vdmlld3Mvd29ya2Zsb3ctaW5mbycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL2lucHV0Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3BhZ2VzL3dvcmtmbG93TWFuYWdlci5wdWcnKTtcblxuaW1wb3J0IGluaXRQYWdlIGZyb20gJy4vcGFnZS5qcyc7XG5cbmxldCBvcGVyYXRpb25JbmZvTW9kYWxIdG1sID0gKCkgPT4ge1xuICBsZXQgZWRpdFdvcmtmbG93TWVzc2FnZSA9IGBcbiAgICA8cD48Yj5Xb3JrZmxvdyBOYW1lL1BhdGg8L2I+OiBZb3UgbWF5IGVkaXQgdGhlIG5hbWUvcGF0aCBvZiB0aGUgd29ya2Zsb3cgYXMgbG9uZyBhcyB0aGUgd29ya2Zsb3cgaGFzIG5vdCBiZWVuIHNhdmVkLiAgXG4gICAgV29ya2Zsb3cgTmFtZXMgYWx3YXlzIGVuZCB3aXRoIGEgdGltZSBzdGFtcC48L3A+XG4gICAgPHA+PGI+TW9kZWwgUGF0aDwvYj46IElmIHlvdSBtb3ZlIG9yIHJlbmFtZSB0aGUgbW9kZWwgbWFrZSBzdXJlIHRvIHVwZGF0ZSB0aGlzIHBhdGguPC9wPlxuICAgIDxwPjxiPlNldHRpbmdzPC9iPjogVGhpcyBpcyB3aGVyZSB5b3UgY2FuIGN1c3RvbWl6ZSB0aGUgc2V0dGluZ3MgZm9yIHlvdXIgd29ya2Zsb3cuXG4gICAgSWYgeW91IG5lZWQgdG8gZWRpdCBvdGhlciBwYXJ0IG9mIHlvdSBtb2RlbCBjbGljayBvbiB0aGUgZWRpdCBtb2RlbCBidXR0b24uICBcbiAgICBUaGUgc2V0dGluZ3MgYXJlIG9ubHkgYXZhaWxhYmxlIGZvciB3b3JrZmxvd3MgdGhhdCBoYXZlIG5vdCBiZWVuIHJ1bi48L3A+XG4gICAgPHA+PGI+U3RhdHVzPC9iPjogVGhpcyBzZWN0aW9uIGRpc3BsYXlzIHRoZSBzdGF0dXMgYW5kIHN0YXJ0IHRpbWUgb2YgdGhlIFdvcmtmbG93LiAgSWYgdGhlIHdvcmtmbG93IGhhc24ndCBiZWVuIHNhcnRlZCB0aGlzIHNlY3Rpb24gaXMgY2xvc2VkLjwvcD5cbiAgICA8cD48Yj5SZXN1bHRzPC9iPjogWW91IG1heSBjaGFuZ2UgdGhlIHRpdGxlLCB4LWF4aXMgbGFiZWwsIGFuZCB5LWF4aXMgbGFiZWwgYnkgY2xpY2tpbmcgb24gdGhlIGVkaXQgcGxvdCBidXR0b24gdGhlbiBlbnRlciB0aGUgbmFtZSBpbiB0aGUgY29ycmVjdCBmaWVsZC48L3A+XG4gICAgPHA+PGI+SW5mbzwvYj46IFRoaXMgc2VjdGlvbiBkaXNwbGF5cyBhbnkgd2FybmluZ3MgYW5kL29yIGVycm9yIHRoYXQgYXJlIGxvZ2dlZCBieSB0aGUgcnVubmluZyB3b3JrZmxvdy48L3A+XG4gICAgPHA+PGI+TW9kZWw8L2I+OiBUaGlzIHNlY3Rpb24gbGV0cyB5b3UgdmlldyB0aGUgbW9kZWwgdGhhdCB3YXMgdXNlZCB3aGVuIHlvdSByYW4gdGhlIHdvcmtmbG93LjwvcD5cbiAgYDtcblxuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJvcGVyYXRpb25JbmZvTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQgaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+IFdvcmtmbG93IE1hbmFnZXIgSGVscCA8L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgPHA+ICR7ZWRpdFdvcmtmbG93TWVzc2FnZX0gPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAgXG59XG5cbmxldCBXb3JrZmxvd01hbmFnZXIgPSBQYWdlVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz13b3JrZmxvdy1uYW1lXScgOiAnc2V0V29ya2Zsb3dOYW1lJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LXdvcmtmbG93LWhlbHBdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBtb2RhbCA9ICQob3BlcmF0aW9uSW5mb01vZGFsSHRtbCgpKS5tb2RhbCgpO1xuICAgIH0sXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFBhZ2VWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciB1cmwgPSBkZWNvZGVVUkkoZG9jdW1lbnQuVVJMKVxuICAgIHRoaXMudHlwZSA9IHVybC5zcGxpdCgnL3dvcmtmbG93L2VkaXQvJykucG9wKCkuc3BsaXQoJy8nKVswXTtcbiAgICB0aGlzLmRpcmVjdG9yeSA9IHVybC5zcGxpdCgnL3dvcmtmbG93L2VkaXQvJyArIHRoaXMudHlwZSkucG9wKCk7XG4gICAgaWYodGhpcy5kaXJlY3RvcnkuZW5kc1dpdGgoJy5tZGwnKSl7XG4gICAgICB2YXIgbW9kZWxGaWxlID0gdGhpcy5kaXJlY3Rvcnkuc3BsaXQoJy8nKS5wb3AoKTtcbiAgICAgIHZhciBuYW1lID0gbW9kZWxGaWxlLnNwbGl0KCcuJylbMF07XG4gICAgICB0aGlzLm1vZGVsRGlyZWN0b3J5ID0gdGhpcy5kaXJlY3Rvcnk7XG4gICAgICB0aGlzLndvcmtmbG93RGF0ZSA9IHRoaXMuZ2V0Q3VycmVudERhdGUoKTtcbiAgICAgIHRoaXMud29ya2Zsb3dOYW1lID0gbmFtZSArIHRoaXMud29ya2Zsb3dEYXRlO1xuICAgICAgdGhpcy5zdGF0dXMgPSAnbmV3JztcbiAgICB9ZWxzZXtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihcIi9zdG9jaHNzL2FwaS93b3JrZmxvdy93b3JrZmxvdy1pbmZvXCIsIHRoaXMuZGlyZWN0b3J5LCBcIi9pbmZvLmpzb25cIik7XG4gICAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSl7XG4gICAgICAgIHZhciByZXNwID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICBzZWxmLm1vZGVsRGlyZWN0b3J5ID0gcmVzcC5tb2RlbC5zcGxpdCgnL2hvbWUvam92eWFuJykucG9wKCk7XG4gICAgICAgIHNlbGYudHlwZSA9IHJlc3AudHlwZTtcbiAgICAgICAgc2VsZi5zdGFydFRpbWUgPSByZXNwLnN0YXJ0X3RpbWU7XG4gICAgICAgIHZhciB3b3JrZmxvd0RpciA9IHNlbGYuZGlyZWN0b3J5LnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgIHNlbGYud29ya2Zsb3dOYW1lID0gd29ya2Zsb3dEaXIuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgdmFyIHN0YXR1c0VuZHBvaW50ID0gcGF0aC5qb2luKFwiL3N0b2Noc3MvYXBpL3dvcmtmbG93L3dvcmtmbG93LXN0YXR1c1wiLCBzZWxmLmRpcmVjdG9yeSk7XG4gICAgICAgIHhocih7dXJpOiBzdGF0dXNFbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgICAgc2VsZi5zdGF0dXMgPSBib2R5O1xuICAgICAgICAgIGlmKHNlbGYuc3RhdHVzID09PSAnY29tcGxldGUnIHx8IHNlbGYuc3RhdHVzID09PSAnZXJyb3InKXtcbiAgICAgICAgICAgIHNlbGYubW9kZWxEaXJlY3RvcnkgPSBwYXRoLmpvaW4oc2VsZi5kaXJlY3RvcnksIHNlbGYubW9kZWxEaXJlY3Rvcnkuc3BsaXQoJy8nKS5wb3AoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYucmVuZGVyU3Vidmlld3MoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFBhZ2VWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZih0aGlzLm1vZGVsRGlyZWN0b3J5KXtcbiAgICAgIHRoaXMucmVuZGVyU3Vidmlld3MoKVxuICAgIH1cbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlbmRlclN1YnZpZXdzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHdvcmtmbG93RWRpdG9yID0gbmV3IFdvcmtmbG93RWRpdG9yVmlldyh7XG4gICAgICBkaXJlY3Rvcnk6IHRoaXMubW9kZWxEaXJlY3RvcnksXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgfSk7XG4gICAgdmFyIGlucHV0TmFtZSA9IG5ldyBJbnB1dFZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgICBsYWJlbDogJ1dvcmtmbG93IE5hbWU6ICcsXG4gICAgICB0ZXN0czogJycsXG4gICAgICBtb2RlbEtleTogbnVsbCxcbiAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICB2YWx1ZTogdGhpcy53b3JrZmxvd05hbWUsXG4gICAgfSk7XG4gICAgdGhpcy53b3JrZmxvd0VkaXRvclZpZXcgPSB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh3b3JrZmxvd0VkaXRvciwgJ3dvcmtmbG93LWVkaXRvci1jb250YWluZXInKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhpbnB1dE5hbWUsICd3b3JrZmxvdy1uYW1lJyk7XG4gICAgdGhpcy5yZW5kZXJXb3JrZmxvd1N0YXR1c1ZpZXcoKTtcbiAgICB0aGlzLnVwZGF0ZVRyYWplY3RvcmllcygpO1xuICAgIHRoaXMucmVuZGVyTW9kZWxWaWV3ZXIoKTtcbiAgICB0aGlzLnJlbmRlckluZm9WaWV3KCk7XG4gICAgaWYodGhpcy5zdGF0dXMgIT09ICduZXcnKXtcbiAgICAgIHRoaXMuZGlzYWJsZVdvcmtmbG93TmFtZUlucHV0KCk7XG4gICAgfVxuICAgIGlmKHRoaXMuc3RhdHVzICE9PSAnbmV3JyAmJiB0aGlzLnN0YXR1cyAhPT0gJ3JlYWR5Jyl7XG4gICAgICB3b3JrZmxvd0VkaXRvci5jb2xsYXBzZUNvbnRhaW5lcigpO1xuICAgIH1cbiAgICBpZih0aGlzLnN0YXR1cyA9PT0gJ3J1bm5pbmcnKXtcbiAgICAgIHRoaXMuZ2V0V29ya2Zsb3dTdGF0dXMoKTtcbiAgICB9XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBzZXRXb3JrZmxvd05hbWU6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgbmV3V29ya2Zsb3dOYW1lID0gZS50YXJnZXQudmFsdWU7XG4gICAgaWYobmV3V29ya2Zsb3dOYW1lLmVuZHNXaXRoKHRoaXMud29ya2Zsb3dEYXRlKSl7XG4gICAgICB0aGlzLndvcmtmbG93TmFtZSA9IG5ld1dvcmtmbG93TmFtZVxuICAgIH1lbHNle1xuICAgICAgdGhpcy53b3JrZmxvd05hbWUgPSBuZXdXb3JrZmxvd05hbWUgKyB0aGlzLndvcmtmbG93RGF0ZVxuICAgICAgZS50YXJnZXQudmFsdWUgPSB0aGlzLndvcmtmbG93TmFtZVxuICAgIH1cbiAgfSxcbiAgZ2V0Q3VycmVudERhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgdmFyIG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgdmFyIGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xuICAgIHZhciBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSBkYXRlLmdldFNlY29uZHMoKTtcbiAgICByZXR1cm4gXCJfXCIgKyBtb250aCArIGRheSArIHllYXIgKyBcIl9cIiArIGhvdXJzICsgbWludXRlcyArIHNlY29uZHM7XG4gIH0sXG4gIGRpc2FibGVXb3JrZmxvd05hbWVJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwid29ya2Zsb3ctbmFtZVwiKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICB9LFxuICByZW5kZXJXb3JrZmxvd1N0YXR1c1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLndvcmtmbG93U3RhdHVzVmlldyl7XG4gICAgICB0aGlzLndvcmtmbG93U3RhdHVzVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdmFyIHN0YXR1c1ZpZXcgPSBuZXcgV29ya2Zsb3dTdGF0dXNWaWV3KHtcbiAgICAgIHN0YXJ0VGltZTogdGhpcy5zdGFydFRpbWUsXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgIH0pO1xuICAgIHRoaXMud29ya2Zsb3dTdGF0dXNWaWV3ID0gdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3RhdHVzVmlldywgJ3dvcmtmbG93LXN0YXR1cy1jb250YWluZXInKTtcbiAgfSxcbiAgZ2V0V29ya2Zsb3dJbmZvOiBmdW5jdGlvbiAoY2IpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwiL3N0b2Noc3MvYXBpL3dvcmtmbG93L3dvcmtmbG93LWluZm9cIiwgdGhpcy5kaXJlY3RvcnksIFwiL2luZm8uanNvblwiKTtcbiAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSl7XG4gICAgICBzZWxmLnN0YXJ0VGltZSA9IEpTT04ucGFyc2UoYm9keSkuc3RhcnRfdGltZTtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG4gIH0sXG4gIGdldFdvcmtmbG93U3RhdHVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzdGF0dXNFbmRwb2ludCA9IHBhdGguam9pbihcIi9zdG9jaHNzL2FwaS93b3JrZmxvdy93b3JrZmxvdy1zdGF0dXNcIiwgdGhpcy5kaXJlY3RvcnkpO1xuICAgIHhocih7dXJpOiBzdGF0dXNFbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICBpZihzZWxmLnN0YXR1cyAhPT0gYm9keSApe1xuICAgICAgICBzZWxmLnN0YXR1cyA9IGJvZHk7XG4gICAgICAgIHNlbGYucmVuZGVyV29ya2Zsb3dTdGF0dXNWaWV3KCk7XG4gICAgICB9XG4gICAgICBpZihzZWxmLnN0YXR1cyAhPT0gJ2Vycm9yJyAmJiBzZWxmLnN0YXR1cyAhPT0gJ2NvbXBsZXRlJyl7XG4gICAgICAgIHNldFRpbWVvdXQoXy5iaW5kKHNlbGYuZ2V0V29ya2Zsb3dTdGF0dXMsIHNlbGYpLCAxMDAwKTtcbiAgICAgIH1lbHNlIGlmKHNlbGYuc3RhdHVzID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgIHNlbGYucmVuZGVyUmVzdWx0c1ZpZXcoKTtcbiAgICAgICAgc2VsZi5yZW5kZXJNb2RlbFZpZXdlcigpO1xuICAgICAgICBzZWxmLnJlbmRlckluZm9WaWV3KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZVdvcmtmbG93U3RhdHVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyAgXG4gICAgICBzZWxmLmdldFdvcmtmbG93SW5mbyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuZ2V0V29ya2Zsb3dTdGF0dXMoKTtcbiAgICAgIH0pO1xuICAgIH0sIDMwMDApO1xuICB9LFxuICByZW5kZXJSZXN1bHRzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMud29ya2Zsb3dSZXN1bHRzVmlldyl7XG4gICAgICB0aGlzLndvcmtmbG93UmVzdWx0c1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHZhciByZXN1bHRzVmlldyA9IG5ldyBXb3JrZmxvd1Jlc3VsdHNWaWV3KHtcbiAgICAgIHRyYWplY3RvcmllczogdGhpcy50cmFqZWN0b3JpZXMsXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc3BlY2llczogdGhpcy5zcGVjaWVzLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgc3BlY2llc09mSW50ZXJlc3Q6IHRoaXMuc3BlY2llc09mSW50ZXJlc3QubmFtZVxuICAgIH0pO1xuICAgIHRoaXMud29ya2Zsb3dSZXN1bHRzVmlldyA9IHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJlc3VsdHNWaWV3LCAnd29ya2Zsb3ctcmVzdWx0cy1jb250YWluZXInKTtcbiAgfSxcbiAgcmVuZGVyTW9kZWxWaWV3ZXI6IGZ1bmN0aW9uICgpe1xuICAgIGlmKHRoaXMubW9kZWxWaWV3ZXIpe1xuICAgICAgdGhpcy5tb2RlbFZpZXdlci5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5tb2RlbFZpZXdlciA9IG5ldyBNb2RlbFZpZXdlcih7XG4gICAgICBkaXJlY3Rvcnk6IHRoaXMubW9kZWxEaXJlY3RvcnksXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgdHlwZTogdGhpcy50eXBlXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5tb2RlbFZpZXdlciwgJ21vZGVsLXZpZXdlci1jb250YWluZXInKVxuICB9LFxuICByZW5kZXJJbmZvVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuaW5mb1ZpZXcpe1xuICAgICAgdGhpcy5pbmZvVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5pbmZvVmlldyA9IG5ldyBJbmZvVmlldyh7XG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgbG9nc1BhdGg6IHBhdGguam9pbih0aGlzLmRpcmVjdG9yeSwgXCJsb2dzLnR4dFwiKVxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuaW5mb1ZpZXcsICd3b3JrZmxvdy1pbmZvLWNvbnRhaW5lcicpXG4gIH0sXG4gIHVwZGF0ZVRyYWplY3RvcmllczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmKHRoaXMudHJhamVjdG9yaWVzID09PSB1bmRlZmluZWQpe1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudXBkYXRlVHJhamVjdG9yaWVzKClcbiAgICAgIH0sIDEwMDApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgdGhpcy50cmFqZWN0b3JpZXMgPSB0aGlzLndvcmtmbG93RWRpdG9yVmlldy5tb2RlbC5zaW11bGF0aW9uU2V0dGluZ3MuYWxnb3JpdGhtICE9PSBcIk9ERVwiID8gdGhpcy50cmFqZWN0b3JpZXMgOiAxXG4gICAgICB0aGlzLnJlbmRlclJlc3VsdHNWaWV3KClcbiAgICB9XG4gIH0sXG59KTtcblxuaW5pdFBhZ2UoV29ya2Zsb3dNYW5hZ2VyKTtcbiIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVZhcmlhYmxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRXhwcmVzc2lvblxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcInZpZXctZXZlbnQtYXNzaWdubWVudHMtbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJldmVudHMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VFdmVudHNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLW1vZGVsLWV2ZW50cy12aWV3ZXJcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3cgY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLW1vZGVsLWV2ZW50cy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VEZWxheVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVByaW9yaXR5XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVHJpZ2dnZXJcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VBc3NpZ25tZW50c1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVVzZSBWYWx1ZXMgRnJvbVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcInZpZXctZXZlbnRzLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1yZXN1bHRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VSZXN1bHRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIiBkaXNhYmxlZFxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXJlc3VsdHNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtcGxvdC1hcmdzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUaXRsZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVgtYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVktYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0aXRsZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInhheGlzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieWF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBUcmFqZWN0b3JpZXNcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidHJhamVjdG9yaWVzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFRWRpdCBQbG90XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwidHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLXBuZy1jdXN0b21cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIFBOR1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LXJlc3VsdHMtZW5zZW1ibGVcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlc3VsdHNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctcmVzdWx0c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1wbG90LWFyZ3NcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVRpdGxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWC1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWS1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInRpdGxlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieGF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ5YXhpc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQbG90IFN0YW5kYXJkIERldmlhdGlvbiBSYW5nZVxcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2Utc3RkZGV2cmFuZ2VcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2Utc3RkZGV2cmFuZ2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2Utc3RkZGV2cmFuZ2VcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdGRkZXZyYW5cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInN0ZGRldnJhblxcXCIgZGF0YS1ob29rPVxcXCJwbG90XFxcIlxcdTAwM0VFZGl0IFBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJzdGRkZXZyYW5cXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcG5nLWN1c3RvbVxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgUE5HXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwic3RkZGV2cmFuXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT05cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQbG90IFRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXRyYWplY3Rvcmllc1xcXCJcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidHJhamVjdG9yaWVzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgZGF0YS1ob29rPVxcXCJwbG90LW11bHRpcGxlXFxcIiBkaXNhYmxlZFxcdTAwM0VNdWx0aXBsZSBQbG90c1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtanNvblxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgSlNPTlxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBsb3QgU3RhbmRhcmQgRGV2aWF0aW9uXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zdGRkZXZcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2Utc3RkZGV2XFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1zdGRkZXZcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdGRkZXZcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInN0ZGRldlxcXCIgZGF0YS1ob29rPVxcXCJwbG90XFxcIlxcdTAwM0VQbG90XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwic3RkZGV2XFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLXBuZy1jdXN0b21cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIFBOR1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInN0ZGRldlxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBUcmFqZWN0b3J5IE1lYW5cXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXRyYWptZWFuXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXRyYWptZWFuXFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS10cmFqbWVhblxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImF2Z1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwiYXZnXFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRVBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJhdmdcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcG5nLWN1c3RvbVxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgUE5HXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwiYXZnXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT05cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwibW9kZWwtc2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VNb2RlbCBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtbW9kZWwtc2V0dGluZ3Mtdmlld2VyXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93IGNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1tb2RlbC1zZXR0aW5ncy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUVuZCBTaW11bGF0aW9uXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVGltZSBTdGVwc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVZvbHVtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuZW5kU2ltKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudGltZVN0ZXApID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC52b2x1bWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwibW9kZWwtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VNb2RlbFxcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtbW9kZWxcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtbW9kZWxcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLW1vZGVsXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNVxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3BlY2llcy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicGFyYW1ldGVycy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVhY3Rpb25zLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJldmVudHMtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJ1bGVzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicGFyYW1ldGVyLXN3ZWVwLXNldHRpbmdzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzaW11bGF0aW9uLXNldHRpbmdzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1yZXN1bHRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VSZXN1bHRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIiBkaXNhYmxlZFxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXJlc3VsdHNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtcGxvdC1hcmdzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUaXRsZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVgtYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVktYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0aXRsZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInhheGlzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieWF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZVxcXCIgZm9yPVxcXCJzcGVjaWVzLW9mLWludGVyZXN0XFxcIlxcdTAwM0VTcGVjaWVzIG9mIEludGVyZXN0OlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiIGlkPVxcXCJzcGVjaWVzLW9mLWludGVyZXN0XFxcIiBkYXRhLWhvb2s9XFxcInNwZWNpZS1vZi1pbnRlcmVzdC1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZVxcXCIgZm9yPVxcXCJmZWF0dXJlLWV4dHJhY3RvclxcXCJcXHUwMDNFRmVhdHVyZSBFeHRyYWN0aW9uOiBcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIiBpZD1cXFwiZmVhdHVyZS1leHRyYWN0b3JcXFwiIGRhdGEtaG9vaz1cXFwiZmVhdHVyZS1leHRyYWN0aW9uLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiaW5saW5lXFxcIiBmb3I9XFxcImVuc2VtYmxlLWFnZ3JhZ2F0b3JcXFwiXFx1MDAzRUVuc2VtYmxlIEFnZ3JhZ2F0b3I6IFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiIGlkPVxcXCJlbnNlbWJsZS1hZ2dyYWdhdG9yXFxcIiBkYXRhLWhvb2s9XFxcImVuc2VtYmxlLWFnZ3JhZ2F0b3ItbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGFyYW1ldGVyIFN3ZWVwXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1wc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtcHN3ZWVwXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXBzd2VlcFxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInBzd2VlcFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwicHN3ZWVwXFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRUVkaXQgUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInBzd2VlcFxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJwc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtanNvblxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgSlNPTiBcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicGFyYW1ldGVyLXN3ZWVwLXNldHRpbmdzXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQYXJhbWV0ZXIgU3dlZXAgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXBzd2VlcC1zZXR0aW5nc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1wc3dlZXAtc2V0dGluZ3NcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTYgdmVydGljbGUtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN3ZWVwIFR5cGU6XFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuc3dlZXBUeXBlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lIGhvcml6b250YWwtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic3dlZXBUeXBlXFxcIiBkYXRhLWhvb2s9XFxcIm9uZS1wYXJhbWV0ZXJcXFwiIGRhdGEtbmFtZT1cXFwiMURcXFwiIGNoZWNrZWRcXHUwMDNFIE9uZSBQYXJhbWV0ZXJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzd2VlcFR5cGVcXFwiIGRhdGEtaG9vaz1cXFwidHdvLXBhcmFtZXRlclxcXCIgZGF0YS1uYW1lPVxcXCIyRFxcXCIgZGlzYWJsZWRcXHUwMDNFIFR3byBQYXJhbWV0ZXJzXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTYgdmVydGljbGUtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmVcXFwiIGZvcj1cXFwic3BlY2llcy1vZi1pbnRlcmVzdFxcXCJcXHUwMDNFU3BlY2llcyBvZiBJbnRlcmVzdDpcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIiBpZD1cXFwic3BlY2llcy1vZi1pbnRlcmVzdFxcXCIgZGF0YS1ob29rPVxcXCJzcGVjaWUtb2YtaW50ZXJlc3QtbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2g1XFx1MDAzRUNvbmZpZ3VyZSBWYXJpYWJsZShzKVxcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3dlZXAgVmFyaWFibGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VDdXJyZW50IFZhbHVlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTWluaW11bSBWYWx1ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1heGltdW0gVmFsdWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdGVwc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzd2VlcC12YXJpYWJsZS1vbmUtc2VsZWN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiY3VycmVudC12YWx1ZS1vbmUtaW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtaW5pbXVtLXZhbHVlLW9uZS1pbnB1dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1heGltdW0tdmFsdWUtb25lLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3RlcC1vbmUtaW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDdHIgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcInBhcmFtZXRlci10d28tcm93XFxcIlxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN3ZWVwLXZhcmlhYmxlLXR3by1zZWxlY3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJjdXJyZW50LXZhbHVlLXR3by1pbnB1dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1pbmltdW0tdmFsdWUtdHdvLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibWF4aW11bS12YWx1ZS10d28taW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdGVwLXR3by1pbnB1dFxcXCJcXHUwMDNFIFxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInBhcmFtZXRlci1zd2VlcC1zZXR0aW5ncy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBhcmFtZXRlciBTd2VlcCBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcHN3ZWVwLXNldHRpbmdzLXZpZXdlclxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1wc3dlZXAtc2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2IHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAwLjc1cmVtO1xcXCIgZGF0YS1ob29rPVxcXCJzd2VlcC10eXBlLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN3ZWVwIFZhcmlhYmxlc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVmFyaWFibGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VDdXJyZW50IFZhbHVlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTWluaW11bSBWYWx1ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1heGltdW0gVmFsdWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdGVwc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucGFyYW1ldGVyT25lLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGQgZGF0YS1ob29rPVxcXCJwMS1jdXJyZW50LXZhbHVlLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wMU1pbikgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnAxTWF4KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucDFTdGVwcykgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ3RyIGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJwMi12YXJpYWJsZS12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnBhcmFtZXRlclR3by5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkIGRhdGEtaG9vaz1cXFwicDItY3VycmVudC12YWx1ZS12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucDJNaW4pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wMk1heCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnAyU3RlcHMpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicGFyYW1ldGVycy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBhcmFtZXRlcnNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXBhcmFtZXRlcnNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtcGFyYW1ldGVyc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTktdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRXhwcmVzc2lvblxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcInBhcmFtZXRlci1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJlYWN0aW9ucy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlYWN0aW9uc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVhY3Rpb25zXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJlYWN0aW9uc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3VtbWFyeVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtNi12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSYXRlXFx1MDAyRlByb3BlbnNpdHlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJ1bGVzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUnVsZXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJ1bGVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJ1bGVzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUeXBlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVZhcmlhYmxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJydWxlcy1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNpbXVsYXRpb24tc2V0dGluZ3NcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNpbXVsYXRpb24gU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXNldHRpbmdzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNldHRpbmdzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIiBjb2xzcGFuPVxcXCI1XFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU2ltdWxhdGlvbiBBbGdvcml0aG1cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbGdvcml0aG0sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic2ltQWxnb3JpdGhtXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1vZGVcXFwiIGRhdGEtbmFtZT1cXFwiT0RFXFxcIlxcdTAwM0UgT0RFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LXNzYVxcXCIgZGF0YS1uYW1lPVxcXCJTU0FcXFwiXFx1MDAzRSBTU0FcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNpbUFsZ29yaXRobVxcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3QtdGF1LWxlYXBpbmdcXFwiIGRhdGEtbmFtZT1cXFwiVGF1LUxlYXBpbmdcXFwiXFx1MDAzRSBUYXUgTGVhcGluZ1xcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic2ltQWxnb3JpdGhtXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1oeWJyaWQtdGF1XFxcIiBkYXRhLW5hbWU9XFxcIkh5YnJpZC1UYXUtTGVhcGluZ1xcXCJcXHUwMDNFIEh5YnJpZCBPREVcXHUwMDJGU1NBXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IGNsYXNzPVxcXCJpbmxpbmVcXFwiIHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LWF1dG9tYXRpY1xcXCIgZGF0YS1uYW1lPVxcXCJBdXRvbWF0aWNcXFwiXFx1MDAzRSBDaG9vc2UgZm9yIG1lXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuY2hvb3NlRm9yTWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNVxcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRURldGVybWluaXN0aWMgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUmVsYXRpdmUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMucnRvbCwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFIFxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBYnNvbHV0ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hdG9sLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVsYXRpdmUtdG9sZXJhbmNlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiYWJzb2x1dGUtdG9sZXJhbmNlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC03XFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RvY2hhc3RpYyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJlYWxpemF0aW9ucywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNlZWRcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5zZWVkLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFVGF1IFRvbGVyYW5jZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnR0b2wsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzZWVkXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGF1LXRvbGVyYW5jZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTaW11bGF0aW9uIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zZXR0aW5ncy12aWV3ZXJcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3cgY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNldHRpbmdzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEyXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMC43NXJlbTtcXFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuYWxnb3JpdGhtKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IGNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImRldGVybWluaXN0aWNcXFwiXFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VEZXRlcm1pbmlzdGljIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZWxhdGl2ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VBYnNvbHV0ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnJlbGF0aXZlVG9sKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuYWJzb2x1dGVUb2wpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNiBjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJzdG9jaGFzdGljXFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RvY2hhc3RpYyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiU1NBXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOdW1iZXIgb2YgVHJhamVjdG9yaWVzXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU2VlZFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucmVhbGl6YXRpb25zKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuc2VlZCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcIlRhdVxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTnVtYmVyIG9mIFRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVNlZWRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUYXUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5yZWFsaXphdGlvbnMpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5zZWVkKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudGF1VG9sKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNwZWNpZXMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTcGVjaWVzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zcGVjaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNwZWNpZXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUluaXRpYWwgQ29uZGl0aW9uXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1vZGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3dpdGNoIFRvbGVyYW5jZVxcdTAwMkZNaW5pbXVtIFZhbHVlIGZvciBTd2l0Y2hpbmdcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJzcGVjaWUtbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnZhcmlhYmxlLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5leHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuZGVsYXkpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wcmlvcml0eSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IFwiRXhwcmVzc2lvbjogXCIgKyB0aGlzLm1vZGVsLnRyaWdnZXJFeHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNoZWNrYm94XFxcIiBmb3I9XFxcImluaXRpYWwtdmFsdWVcXFwiXFx1MDAzRUluaXRpYWwgVmFsdWU6IFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGlkPVxcXCJpbml0aWFsLXZhbHVlXFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50LXRyaWdnZXItaW5pdC12YWx1ZVxcXCIgZGlzYWJsZWRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2hlY2tib3hcXFwiIGZvcj1cXFwicGVyc2lzdGVudFxcXCJcXHUwMDNFUGVyc2lzdGVudDogXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgaWQ9XFxcInBlcnNpc3RlbnRcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtdHJpZ2dlci1wZXJzaXN0ZW50XFxcIiBkaXNhYmxlZFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiYXNzaWdubWVudC12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCIgZm9yPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiXFx1MDAzRVRyZ2dpZXIgVGltZVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIGlkPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiIG5hbWU9XFxcInVzZS12YWx1ZXMtZnJvbVxcXCIgZGF0YS1ob29rPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiIGRpc2FibGVkXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIiBmb3I9XFxcImFzc2lnbm1lbnQtdGltZVxcXCJcXHUwMDNFQXNzaWdubWVudCBUaW1lXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgaWQ9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgbmFtZT1cXFwidXNlLXZhbHVlcy1mcm9tXFxcIiBkYXRhLWhvb2s9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgZGlzYWJsZWRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5leHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdW1tYXJ5XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnJhdGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC50eXBlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudmFyaWFibGUubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLmV4cHJlc3Npb24pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC52YWx1ZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm1vZGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5zd2l0Y2hpbmdWYWxXaXRoTGFiZWwpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1uYW1lLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgZGF0YS1ob29rPVxcXCJwYXJhbS1zd2VlcC1zZXR0aW5ncy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzaW0tc2V0dGluZ3MtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctc3RhdGUtYnV0dG9ucy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1pbmZvLXZpZXdcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUluZm9cXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLWluZm9cXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLWluZm9cXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctaW5mb1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTdGF0aXN0aWNzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy13YXJuaW5nc1xcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVdhcm5pbmdzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibGlzdC1vZi13YXJuaW5nc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctZXJyb3JzXFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXJyb3JzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibGlzdC1vZi1lcnJvcnNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGRhdGEtaG9vaz1cXFwic2F2ZVxcXCJcXHUwMDNFU2F2ZVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcIm1kbC1lZGl0LWJ0biBzYXZpbmctc3RhdHVzXFxcIiBkYXRhLWhvb2s9XFxcInNhdmluZy13b3JrZmxvd1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwic3Bpbm5lci1ncm93XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VTYXZpbmcuLi5cXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuIHNhdmVkLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJzYXZlZC13b3JrZmxvd1xcXCJcXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFU2F2ZWRcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInN0YXJ0LXdvcmtmbG93XFxcIlxcdTAwM0VTdGFydCBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgZGF0YS1ob29rPVxcXCJlZGl0LW1vZGVsXFxcIlxcdTAwM0VFZGl0IE1vZGVsXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LXN0YXR1c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RhdHVzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zdGF0dXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1zdGF0dXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRURhdGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdGF0dXNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnN0YXJ0VGltZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnN0YXR1cykgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInN0b3Atd29ya2Zsb3dcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgZGlzYWJsZWRcXHUwMDNFU3RvcCBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJlc3RhcnQtd29ya2Zsb3dcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgZGlzYWJsZWRcXHUwMDNFUmVzdGFydCBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NlY3Rpb24gY2xhc3M9XFxcInBhZ2UgY29sLW1kLTEwXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NoMlxcdTAwM0VXb3JrZmxvdyBNYW5hZ2VyXFx1MDAzQ1xcdTAwMkZoMlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gaW5mb3JtYXRpb24tYnRuIGhlbHBcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC13b3JrZmxvdy1oZWxwXFxcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXJcXFwiIGRhdGEtaWNvbj1cXFwicXVlc3Rpb24tY2lyY2xlXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtcXVlc3Rpb24tY2lyY2xlIGZhLXctMTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgNTEyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjU2IDhDMTE5LjA0MyA4IDggMTE5LjA4MyA4IDI1NmMwIDEzNi45OTcgMTExLjA0MyAyNDggMjQ4IDI0OHMyNDgtMTExLjAwMyAyNDgtMjQ4QzUwNCAxMTkuMDgzIDM5Mi45NTcgOCAyNTYgOHptMCA0NDhjLTExMC41MzIgMC0yMDAtODkuNDMxLTIwMC0yMDAgMC0xMTAuNDk1IDg5LjQ3Mi0yMDAgMjAwLTIwMCAxMTAuNDkxIDAgMjAwIDg5LjQ3MSAyMDAgMjAwIDAgMTEwLjUzLTg5LjQzMSAyMDAtMjAwIDIwMHptMTA3LjI0NC0yNTUuMmMwIDY3LjA1Mi03Mi40MjEgNjguMDg0LTcyLjQyMSA5Mi44NjNWMzAwYzAgNi42MjctNS4zNzMgMTItMTIgMTJoLTQ1LjY0N2MtNi42MjcgMC0xMi01LjM3My0xMi0xMnYtOC42NTljMC0zNS43NDUgMjcuMS01MC4wMzQgNDcuNTc5LTYxLjUxNiAxNy41NjEtOS44NDUgMjguMzI0LTE2LjU0MSAyOC4zMjQtMjkuNTc5IDAtMTcuMjQ2LTIxLjk5OS0yOC42OTMtMzkuNzg0LTI4LjY5My0yMy4xODkgMC0zMy44OTQgMTAuOTc3LTQ4Ljk0MiAyOS45NjktNC4wNTcgNS4xMi0xMS40NiA2LjA3MS0xNi42NjYgMi4xMjRsLTI3LjgyNC0yMS4wOThjLTUuMTA3LTMuODcyLTYuMjUxLTExLjA2Ni0yLjY0NC0xNi4zNjNDMTg0Ljg0NiAxMzEuNDkxIDIxNC45NCAxMTIgMjYxLjc5NCAxMTJjNDkuMDcxIDAgMTAxLjQ1IDM4LjMwNCAxMDEuNDUgODguOHpNMjk4IDM2OGMwIDIzLjE1OS0xOC44NDEgNDItNDIgNDJzLTQyLTE4Ljg0MS00Mi00MiAxOC44NDEtNDIgNDItNDIgNDIgMTguODQxIDQyIDQyelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRSBcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctbmFtZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1zdGF0dXMtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctcmVzdWx0cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1pbmZvLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1vZGVsLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJjb21wdXRhdGlvbmFsLXJlc291cmNlcy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc2VjdGlvblxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3QXNzaWdubWVudHMgPSByZXF1aXJlKCcuL3ZpZXctZXZlbnQtYXNzaWdubWVudHMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRBc3NpZ25tZW50c1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3QXNzaWdubWVudHMsICd2aWV3LWV2ZW50LWFzc2lnbm1lbnRzLWxpc3QnKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgVmlld0V2ZW50ID0gcmVxdWlyZSgnLi92aWV3LWV2ZW50cycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudHNWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdFdmVudCwgdGhpcy5xdWVyeUJ5SG9vaygndmlldy1ldmVudHMtY29udGFpbmVyJykpXG4gIH0sXG4gIGNoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxTZXR0aW5nc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIGNoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFNwZWNpZXNWaWV3ZXIgPSByZXF1aXJlKCcuL3NwZWNpZXMtdmlld2VyJyk7XG52YXIgUGFyYW1ldGVyc1ZpZXdlciA9IHJlcXVpcmUoJy4vcGFyYW1ldGVycy12aWV3ZXInKTtcbnZhciBSZWFjdGlvbnNWaWV3ZXIgPSByZXF1aXJlKCcuL3JlYWN0aW9ucy12aWV3ZXInKTtcbnZhciBFdmVudHNWaWV3ZXIgPSByZXF1aXJlKCcuL2V2ZW50cy12aWV3ZXInKTtcbnZhciBSdWxlc1ZpZXdlciA9IHJlcXVpcmUoJy4vcnVsZXMtdmlld2VyJyk7XG52YXIgTW9kZWxTZXR0aW5nc1ZpZXdlciA9IHJlcXVpcmUoJy4vbW9kZWwtc2V0dGluZ3Mtdmlld2VyJyk7XG52YXIgU2ltdWxhdGlvblNldHRpbmdzVmlld2VyID0gcmVxdWlyZSgnLi9zaW11bGF0aW9uLXNldHRpbmdzLXZpZXdlcicpO1xudmFyIFBhcmFtZXRlclN3ZWVwU2V0dGluZ3NWaWV3ZXIgPSByZXF1aXJlKCcuL3BhcmFtZXRlci1zd2VlcC1zZXR0aW5ncy12aWV3ZXInKTtcbi8vbW9kZWxzXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvbW9kZWwnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLW1vZGVsXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc3RhdHVzID0gYXR0cnMuc3RhdHVzO1xuICAgIHRoaXMud2tmbFR5cGUgPSBhdHRycy50eXBlO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlyZWN0b3J5ID0gYXR0cnMuZGlyZWN0b3J5XG4gICAgdmFyIG1vZGVsRmlsZSA9IGRpcmVjdG9yeS5zcGxpdCgnLycpLnBvcCgpO1xuICAgIHZhciBuYW1lID0gbW9kZWxGaWxlLnNwbGl0KCcuJylbMF07XG4gICAgdmFyIGlzU3BhdGlhbCA9IG1vZGVsRmlsZS5zcGxpdCgnLicpLnBvcCgpLnN0YXJ0c1dpdGgoJ3MnKTtcbiAgICB0aGlzLm1vZGVsID0gbmV3IE1vZGVsKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBkaXJlY3Rvcnk6IGRpcmVjdG9yeSxcbiAgICAgIGlzX3NwYXRpYWw6IGlzU3BhdGlhbFxuICAgIH0pO1xuICAgIHRoaXMubW9kZWwuZmV0Y2goe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICBzZWxmLnJlbmRlclN1YnZpZXdzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlclN1YnZpZXdzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNwZWNpZXNWaWV3ZXIgPSBuZXcgU3BlY2llc1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnNwZWNpZXMsXG4gICAgfSk7XG4gICAgdmFyIHBhcmFtZXRlcnNWaWV3ZXIgPSBuZXcgUGFyYW1ldGVyc1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnBhcmFtZXRlcnMsXG4gICAgfSk7XG4gICAgdmFyIHJlYWN0aW9uc1ZpZXdlciA9IG5ldyBSZWFjdGlvbnNWaWV3ZXIoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5yZWFjdGlvbnMsXG4gICAgfSk7XG4gICAgdmFyIGV2ZW50c1ZpZXdlciA9IG5ldyBFdmVudHNWaWV3ZXIoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5ldmVudHNDb2xsZWN0aW9uLFxuICAgIH0pO1xuICAgIHZhciBydWxlc1ZpZXdlciA9IG5ldyBSdWxlc1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnJ1bGVzLFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyU2ltdWxhdGlvblNldHRpbmdzVmlldygpO1xuICAgIHZhciBtb2RlbFNldHRpbmdzVmlld2VyID0gbmV3IE1vZGVsU2V0dGluZ3NWaWV3ZXIoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwubW9kZWxTZXR0aW5ncyxcbiAgICB9KTtcbiAgICB2YXIgcHN3ZWVwU2V0dGluZ3NWaWV3ZXIgPSBuZXcgUGFyYW1ldGVyU3dlZXBTZXR0aW5nc1ZpZXdlcih7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHNwZWNpZXNWaWV3ZXIsIFwic3BlY2llcy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHBhcmFtZXRlcnNWaWV3ZXIsIFwicGFyYW1ldGVycy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJlYWN0aW9uc1ZpZXdlciwgXCJyZWFjdGlvbnMtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhldmVudHNWaWV3ZXIsIFwiZXZlbnRzLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocnVsZXNWaWV3ZXIsIFwicnVsZXMtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhtb2RlbFNldHRpbmdzVmlld2VyLCBcIm1vZGVsLXNldHRpbmdzLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgaWYodGhpcy53a2ZsVHlwZSA9PT0gJ3BhcmFtZXRlclN3ZWVwJykge1xuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocHN3ZWVwU2V0dGluZ3NWaWV3ZXIsICdwYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3Mtdmlld2VyLWNvbnRhaW5lcicpXG4gICAgfVxuICAgIGlmKHRoaXMuc3RhdHVzID09PSAnY29tcGxldGUnKXtcbiAgICAgIHRoaXMuZW5hYmxlQ29sbGFwc2VCdXR0b24oKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlclNpbXVsYXRpb25TZXR0aW5nc1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLnNpbXVsYXRpb25TZXR0aW5nc1ZpZXcpe1xuICAgICAgdGhpcy5zaW11bGF0aW9uU2V0dGluZ3NWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLnNpbXVsYXRpb25TZXR0aW5nc1ZpZXcgPSBuZXcgU2ltdWxhdGlvblNldHRpbmdzVmlld2VyKHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncyxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0aGlzLnNpbXVsYXRpb25TZXR0aW5nc1ZpZXcsIFwic2ltdWxhdGlvbi1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXCIpO1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UtbW9kZWwnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UtbW9kZWwnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZS1tb2RlbCcpKS50ZXh0KCcrJyk7XG4gIH0sXG4gIGVuYWJsZUNvbGxhcHNlQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZS1tb2RlbCcpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlclN3ZWVwU2V0dGluZ3NWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBzd2VlcFR5cGUgPSBcIlN3ZWVwIFR5cGU6IFwiXG4gICAgdmFyIHAxQ3VycmVudFZhbCA9IGV2YWwodGhpcy5tb2RlbC5wYXJhbWV0ZXJPbmUuZXhwcmVzc2lvbilcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3AxLWN1cnJlbnQtdmFsdWUtdmlld2VyJykpLnRleHQocDFDdXJyZW50VmFsKVxuICAgIGlmKHRoaXMubW9kZWwuaXMxRCkge1xuICAgICAgc3dlZXBUeXBlICs9IFwiT25lIFBhcmFtZXRlclwiXG4gICAgfWVsc2V7XG4gICAgICBzd2VlcFR5cGUgKz0gXCJUd28gUGFyYW1ldGVyc1wiXG4gICAgICB2YXIgcDJDdXJyZW50VmFsID0gZXZhbCh0aGlzLm1vZGVsLnBhcmFtZXRlclR3by5leHByZXNzaW9uKVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdwMi1jdXJyZW50LXZhbHVlLXZpZXdlcicpKS50ZXh0KHAyQ3VycmVudFZhbClcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygncDItdmFyaWFibGUtdmlld2VyJykpLmNvbGxhcHNlKCdzaG93JylcbiAgICB9XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2VlcC10eXBlLXZpZXdlcicpKS50ZXh0KHN3ZWVwVHlwZSlcbiAgfSxcbiAgY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsgIiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1vbmUtcGFyYW1ldGVyXScgOiAndXBkYXRlUGFyYW1Td2VlcFR5cGUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz10d28tcGFyYW1ldGVyXScgOiAndXBkYXRlUGFyYW1Td2VlcFR5cGUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zd2VlcC12YXJpYWJsZS1vbmUtc2VsZWN0XScgOiAnc2VsZWN0U3dlZXBWYXJPbmUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zd2VlcC12YXJpYWJsZS10d28tc2VsZWN0XScgOiAnc2VsZWN0U3dlZXBWYXJUd28nLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zcGVjaWUtb2YtaW50ZXJlc3QtbGlzdF0nIDogJ3NlbGVjdFNwZWNpZXNPZkludGVyZXN0J1xuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50b29sdGlwcyA9IHtcInN3ZWVwVHlwZVwiOlwiXCJ9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5wYXJlbnQucGFyYW1ldGVycztcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMubW9kZWwucGFyZW50LnNwZWNpZXM7XG4gICAgdmFyIHBhcmFtTmFtZXMgPSBwYXJhbWV0ZXJzLm1hcChmdW5jdGlvbiAocGFyYW1ldGVyKSB7IHJldHVybiBwYXJhbWV0ZXIubmFtZX0pO1xuICAgIHZhciBzcGVjaWVzTmFtZXMgPSBzcGVjaWVzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7IHJldHVybiBzcGVjaWUubmFtZX0pO1xuICAgIHZhciBzcGVjaWVzT2ZJbnRlcmVzdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnc3BlY2llcy1vZi1pbnRlcmVzdCcsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IHNwZWNpZXNOYW1lcyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnNwZWNpZXNPZkludGVyZXN0Lm5hbWVcbiAgICB9KTtcbiAgICB2YXIgcGFyYW1ldGVyT25lVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdzd2VlcC12YXJpYWJsZS1vbmUnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBwYXJhbU5hbWVzLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwucGFyYW1ldGVyT25lLm5hbWVcbiAgICB9KTtcbiAgICB2YXIgcGFyYW1ldGVyVHdvVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdzd2VlcC12YXJpYWJsZS10d28nLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBwYXJhbU5hbWVzLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwucGFyYW1ldGVyVHdvLm5hbWVcbiAgICB9KTtcbiAgICBpZih0aGlzLm1vZGVsLnBhcmVudC5wYXJhbWV0ZXJzLmxlbmd0aCA+IDEpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd0d28tcGFyYW1ldGVyJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ29uZS1wYXJhbWV0ZXInKSkucHJvcCgnY2hlY2tlZCcsIHRoaXMubW9kZWwuaXMxRClcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygndHdvLXBhcmFtZXRlcicpKS5wcm9wKCdjaGVja2VkJywgIXRoaXMubW9kZWwuaXMxRClcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY3VycmVudC12YWx1ZS10d28taW5wdXQnKSkudGV4dChldmFsKHRoaXMubW9kZWwucGFyYW1ldGVyVHdvLmV4cHJlc3Npb24pKVxuICAgICAgdGhpcy50b2dnbGVQYXJhbVR3bygpO1xuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocGFyYW1ldGVyVHdvVmlldywgJ3N3ZWVwLXZhcmlhYmxlLXR3by1zZWxlY3QnKTtcbiAgICB9XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjdXJyZW50LXZhbHVlLW9uZS1pbnB1dCcpKS50ZXh0KGV2YWwodGhpcy5tb2RlbC5wYXJhbWV0ZXJPbmUuZXhwcmVzc2lvbikpXG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3BlY2llc09mSW50ZXJlc3RWaWV3LCAnc3BlY2llLW9mLWludGVyZXN0LWxpc3QnKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhwYXJhbWV0ZXJPbmVWaWV3LCAnc3dlZXAtdmFyaWFibGUtb25lLXNlbGVjdCcpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlUGFyYW1Td2VlcFR5cGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHR5cGUgPSBlLnRhcmdldC5kYXRhc2V0Lm5hbWVcbiAgICB0aGlzLm1vZGVsLmlzMUQgPSB0eXBlID09PSAnMUQnXG4gICAgdGhpcy50b2dnbGVQYXJhbVR3bygpXG4gIH0sXG4gIHRvZ2dsZVBhcmFtVHdvOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXRoaXMubW9kZWwuaXMxRCl7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3BhcmFtZXRlci10d28tcm93JykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3BhcmFtZXRlci10d28tcm93JykpLmNvbGxhcHNlKCdoaWRlJyk7XG4gICAgfVxuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBzZWxlY3RTd2VlcFZhck9uZTogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdmFsID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB2YXIgcGFyYW1ldGVyID0gdGhpcy5nZXRQYXJhbWV0ZXIodmFsKTtcbiAgICB0aGlzLm1vZGVsLnBhcmFtZXRlck9uZSA9IHBhcmFtZXRlclxuICAgIHZhciBjdXJyZW50VmFsdWUgPSBldmFsKHBhcmFtZXRlci5leHByZXNzaW9uKVxuICAgIHRoaXMubW9kZWwucDFNaW4gPSBjdXJyZW50VmFsdWUgKiAwLjU7XG4gICAgdGhpcy5tb2RlbC5wMU1heCA9IGN1cnJlbnRWYWx1ZSAqIDEuNTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2N1cnJlbnQtdmFsdWUtb25lLWlucHV0JykpLnRleHQoY3VycmVudFZhbHVlKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ21pbmltdW0tdmFsdWUtb25lLWlucHV0JykpLmZpbmQoJ2lucHV0JykudmFsKHRoaXMubW9kZWwucDFNaW4pXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdtYXhpbXVtLXZhbHVlLW9uZS1pbnB1dCcpKS5maW5kKCdpbnB1dCcpLnZhbCh0aGlzLm1vZGVsLnAxTWF4KVxuICB9LFxuICBzZWxlY3RTd2VlcFZhclR3bzogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdmFsID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB2YXIgcGFyYW1ldGVyID0gdGhpcy5nZXRQYXJhbWV0ZXIodmFsKTtcbiAgICB0aGlzLm1vZGVsLnBhcmFtZXRlclR3byA9IHBhcmFtZXRlclxuICAgIHZhciBjdXJyZW50VmFsdWUgPSBldmFsKHBhcmFtZXRlci5leHByZXNzaW9uKVxuICAgIHRoaXMubW9kZWwucDJNaW4gPSBjdXJyZW50VmFsdWUgKiAwLjU7XG4gICAgdGhpcy5tb2RlbC5wMk1heCA9IGN1cnJlbnRWYWx1ZSAqIDEuNTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2N1cnJlbnQtdmFsdWUtdHdvLWlucHV0JykpLnRleHQoY3VycmVudFZhbHVlKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ21pbmltdW0tdmFsdWUtdHdvLWlucHV0JykpLmZpbmQoJ2lucHV0JykudmFsKHRoaXMubW9kZWwucDJNaW4pXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdtYXhpbXVtLXZhbHVlLXR3by1pbnB1dCcpKS5maW5kKCdpbnB1dCcpLnZhbCh0aGlzLm1vZGVsLnAyTWF4KVxuICB9LFxuICBzZWxlY3RTcGVjaWVzT2ZJbnRlcmVzdDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdmFsID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMuZ2V0U3BlY2llcyh2YWwpO1xuICAgIHRoaXMubW9kZWwuc3BlY2llc09mSW50ZXJlc3QgPSBzcGVjaWVzXG4gIH0sXG4gIGdldFNwZWNpZXM6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLnBhcmVudC5zcGVjaWVzLmZpbHRlcihmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICBpZihzcGVjaWUubmFtZSA9PT0gbmFtZSkgcmV0dXJuIHNwZWNpZVxuICAgIH0pWzBdO1xuICAgIHJldHVybiBzcGVjaWVzO1xuICB9LFxuICBnZXRQYXJhbWV0ZXI6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB2YXIgcGFyYW1ldGVyID0gdGhpcy5tb2RlbC5wYXJlbnQucGFyYW1ldGVycy5maWx0ZXIoZnVuY3Rpb24gKHBhcmFtZXRlcikge1xuICAgICAgaWYocGFyYW1ldGVyLm5hbWUgPT09IHZhbCkgcmV0dXJuIHBhcmFtZXRlcjtcbiAgICB9KVswXTtcbiAgICByZXR1cm4gcGFyYW1ldGVyO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpXG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgcGFyYW0xTWluVmFsdWVJbnB1dDoge1xuICAgICAgaG9vazogJ21pbmltdW0tdmFsdWUtb25lLWlucHV0JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncGFyYW0tMS1taW4tdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AxTWluJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnAxTWluXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0xTWF4VmFsdWVJbnB1dDoge1xuICAgICAgaG9vazogJ21heGltdW0tdmFsdWUtb25lLWlucHV0JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncGFyYW0tMS1tYXgtdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AxTWF4JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnAxTWF4XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0xU3RlcFZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdzdGVwLW9uZS1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTEtc3RlcC12YWx1ZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAncDFTdGVwcycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMVN0ZXBzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0yTWluVmFsdWVJbnB1dDoge1xuICAgICAgaG9vazogJ21pbmltdW0tdmFsdWUtdHdvLWlucHV0JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncGFyYW0tMi1taW4tdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AyTWluJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnAyTWluXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0yTWF4VmFsdWVJbnB1dDoge1xuICAgICAgaG9vazogJ21heGltdW0tdmFsdWUtdHdvLWlucHV0JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncGFyYW0tMi1tYXgtdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AyTWF4JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnAyTWF4XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyYW0yU3RlcFZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdzdGVwLXR3by1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTItc3RlcC12YWx1ZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAncDJTdGVwcycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMlN0ZXBzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gIH1cbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgVmlld1BhcmFtZXRlciA9IHJlcXVpcmUoJy4vdmlldy1wYXJhbWV0ZXInKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdQYXJhbWV0ZXIsIHRoaXMucXVlcnlCeUhvb2soJ3BhcmFtZXRlci1saXN0JykpXG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgVmlld1JlYWN0aW9ucyA9IHJlcXVpcmUoJy4vdmlldy1yZWFjdGlvbnMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbiwgVmlld1JlYWN0aW9ucywgdGhpcy5xdWVyeUJ5SG9vaygncmVhY3Rpb24tbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdSdWxlcyA9IHJlcXVpcmUoJy4vdmlldy1ydWxlcycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ydWxlc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdSdWxlcywgdGhpcy5xdWVyeUJ5SG9vaygncnVsZXMtbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5hbGdvcml0aG0gPSB0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIiA/XG4gICAgICBcIkFsZ29yaXRobTogSHlicmlkIE9ERS9TU0FcIiA6IFwiQWxnb3JpdGhtOiBcIiArIHRoaXMubW9kZWwuYWxnb3JpdGhtXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBhbGdvcml0aG0gPSB0aGlzLm1vZGVsLmFsZ29yaXRobVxuICAgIGlmKGFsZ29yaXRobSA9PT0gXCJPREVcIiB8fCBhbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCIpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdkZXRlcm1pbmlzdGljJykpLmNvbGxhcHNlKCdzaG93JylcbiAgICB9XG4gICAgaWYoYWxnb3JpdGhtID09PSBcIlNTQVwiIHx8IGFsZ29yaXRobSA9PT0gXCJUYXUtTGVhcGluZ1wiIHx8IGFsZ29yaXRobSA9PT0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N0b2NoYXN0aWMnKSkuY29sbGFwc2UoJ3Nob3cnKVxuICAgICAgaWYoYWxnb3JpdGhtID09PSBcIlNTQVwiKXtcbiAgICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdTU0EnKSkuY29sbGFwc2UoJ3Nob3cnKVxuICAgICAgfWVsc2V7XG4gICAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnVGF1JykpLmNvbGxhcHNlKCdzaG93JylcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGNoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3NpbXVsYXRpb25TZXR0aW5ncy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LW9kZV0nIDogJ2hhbmRsZVNlbGVjdFNpbXVsYXRpb25BbGdvcml0aG1DbGljaycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNlbGVjdC1zc2FdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtdGF1LWxlYXBpbmddJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtaHlicmlkLXRhdV0nIDogJ2hhbmRsZVNlbGVjdFNpbXVsYXRpb25BbGdvcml0aG1DbGljaycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNlbGVjdC1hdXRvbWF0aWNdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5tb2RlbCA9IGF0dHJzLm1vZGVsO1xuICAgIHRoaXMudG9vbHRpcHMgPSB7XCJydG9sXCI6XCJSZWxhdGl2ZSB0b2xlcmFuY2UgZm9yIG9kZSBzb2x1dGlvbnMsIGNvbnRyb2xzIGEgcmVsYXRpdmUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhY2N1cmFjeSAobnVtYmVyIG9mIGNvcnJlY3QgZGlnaXRzKS4gIFRoZSBzb2x2ZXIga2VlcHMgdGhlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibG9jYWwgZXJyb3IgZXN0aW1hdGVzIGxlc3MgdGhhbiBhdG9sICsgcnRvbCAqIGFicyh5KS4gIFZhbHVlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibXVzdCBiZSBncmVhdGVyIHRoYW4gMC4wLlwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJhdG9sXCI6XCJBYnNvbHV0ZSB0b2xlcmFuY2UgZm9yIG9kZSBzb2x1dGlvbnMsIGlmIGEgY29tcG9uZW50IG9mIHkgaXMgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcHByb3hpbWF0ZWx5IGJlbG93IGF0b2wsIHRoZSBlcnJvciBvbmx5IG5lZWRzIHRvIGZhbGwgd2l0aGluIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGhlIHNhbWUgYXRvbCB0aHJlc2hvbGQsIGFuZCB0aGUgbnVtYmVyIG9mIGNvcnJlY3QgZGlnaXRzIGlzIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm90IGd1YXJhbnRlZWQuICBUaGUgc29sdmVyIGtlZXBzIHRoZSBsb2NhbCBlcnJvciBlc3RpbWF0ZXMgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsZXNzIHRoYW4gYXRvbCArIHJ0b2wgKiBhYnMoeSkuICBWYWx1ZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwLjAuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInR0b2xcIjpcIkEgcmVsYXRpdmUgZXJyb3IgdG9sZXJhbmNlIHZhbHVlIGdvdmVybmluZyB0YXUtbGVhcGluZyB0YXUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zLiAgQmFzZWQgb24gQ2FvLCBZLjsgR2lsbGVzcGllLCBELiBULjsgUGV0em9sZCwgTC4gUi4gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIoMjAwNikuICdFZmZpY2llbnQgc3RlcCBzaXplIHNlbGVjdGlvbiBmb3IgdGhlIHRhdS1sZWFwaW5nIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2ltdWxhdGlvbiBtZXRob2QnIChQREYpLiBUaGUgSm91cm5hbCBvZiBDaGVtaWNhbCBQaHlzaWNzLiAxMjQgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIoNCk6IDA0NDEwOS4gQmliY29kZToyMDA2SkNoUGguMTI0ZDQxMDlDLiBkb2k6MTAuMTA2My8xLjIxNTk0NjguIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiUE1JRCAxNjQ2MDE1MSAgVmFsdWUgbXVzdCBiZSBiZXR3ZWVuIDAuMCBhbmQgMS4wLlwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJzZWVkXCI6XCJUaGUgc2VlZCBmb3IgdGhlIHNpbXVsYXRpb24uICBTZXQgdG8gLTEgZm9yIGEgcmFuZG9tIHNlZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInJlYWxpemF0aW9uc1wiOlwiVGhlIG51bWJlciBvZiB0aW1lcyB0byBzYW1wbGUgdGhlIGNoZW1pY2FsIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWFzdGVyIGVxdWF0aW9uLiBFYWNoIHRyYWplY3Rvcnkgd2lsbCBiZSByZXR1cm5lZCBhdCB0aGUgZW5kIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib2YgdGhlIHNpbXVsYXRpb24uXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImFsZ29yaXRobVwiOlwiVGhlIHNvbHZlciBieSB3aGljaCB0byBzaW11bGF0ZSB0aGUgbW9kZWwuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImNob29zZUZvck1lXCI6XCJIeWJyaWQgd2lsbCBiZSBjaG9zZW4gYmFzZWQgb24gRXZlbnQsIFJ1bGVzLCBhbmQgb3RoZXIgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTQk1MIG1vZGVsIGNvbXBvbmVudHMgb3IgaWYgdGhlIG1vZGVsIGlzIHJlcHJlc2VudGVkIGFzIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29uY2VudHJhdGlvbi4gIFRhdSBMZWFwaW5nIHdpbGwgYmUgY2hvc2VuIGlmIHRoZSBUYXUgVG9sZXJhbmNlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXMgY2hhbmdlZCB0byBhIHZhbHVlIG90aGVyIHRoYW4gMC4wMy4gIFNTQSB3aWxsIGJlIGNob3NlbiBpZiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRoZSBtb2RlbCBpcyByZXByZXNlbnRlZCBhcyBQb3B1bGF0aW9uLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYoIXRoaXMubW9kZWwuaXNBdXRvbWF0aWMpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3Qtb2RlJykpLnByb3AoJ2NoZWNrZWQnLCBCb29sZWFuKHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIk9ERVwiKSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1zc2EnKSkucHJvcCgnY2hlY2tlZCcsIEJvb2xlYW4odGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiU1NBXCIpKTsgXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC10YXUtbGVhcGluZycpKS5wcm9wKCdjaGVja2VkJywgQm9vbGVhbih0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJUYXUtTGVhcGluZ1wiKSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1oeWJyaWQtdGF1JykpLnByb3AoJ2NoZWNrZWQnLCBCb29sZWFuKHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIkh5YnJpZC1UYXUtTGVhcGluZ1wiKSk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1hdXRvbWF0aWMnKSkucHJvcCgnY2hlY2tlZCcsIHRoaXMubW9kZWwuaXNBdXRvbWF0aWMpO1xuICAgICAgdGhpcy5tb2RlbC5sZXRVc0Nob29zZUZvcllvdSgpO1xuICAgIH1cbiAgICB0aGlzLmRpc2FibGVJbnB1dEZpZWxkQnlBbGdvcml0aG0oKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoZSkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpXG4gIH0sXG4gIGhhbmRsZVNlbGVjdFNpbXVsYXRpb25BbGdvcml0aG1DbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdmFsdWUgPSBlLnRhcmdldC5kYXRhc2V0Lm5hbWU7XG4gICAgdGhpcy5zZXRTaW11bGF0aW9uQWxnb3JpdGhtKHZhbHVlKVxuICB9LFxuICBzZXRTaW11bGF0aW9uQWxnb3JpdGhtOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLm1vZGVsLmlzQXV0b21hdGljID0gQm9vbGVhbih2YWx1ZSA9PT0gJ0F1dG9tYXRpYycpXG4gICAgaWYoIXRoaXMubW9kZWwuaXNBdXRvbWF0aWMpe1xuICAgICAgdGhpcy5tb2RlbC5hbGdvcml0aG0gPSB2YWx1ZTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMubW9kZWwubGV0VXNDaG9vc2VGb3JZb3UoKTtcbiAgICB9XG4gICAgdGhpcy5kaXNhYmxlSW5wdXRGaWVsZEJ5QWxnb3JpdGhtKCk7XG4gIH0sXG4gIGRpc2FibGVJbnB1dEZpZWxkQnlBbGdvcml0aG06IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXNBdXRvbWF0aWMgPSB0aGlzLm1vZGVsLmlzQXV0b21hdGljXG4gICAgdmFyIGlzT0RFID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiT0RFXCI7XG4gICAgdmFyIGlzU1NBID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiU1NBXCI7XG4gICAgdmFyIGlzTGVhcGluZyA9IHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIlRhdS1MZWFwaW5nXCI7XG4gICAgdmFyIGlzSHlicmlkID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCI7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwicmVsYXRpdmUtdG9sZXJhbmNlXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgIShpc09ERSB8fCBpc0h5YnJpZCB8fCBpc0F1dG9tYXRpYykpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcImFic29sdXRlLXRvbGVyYW5jZVwiKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsICEoaXNPREUgfHwgaXNIeWJyaWQgfHwgaXNBdXRvbWF0aWMpKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJ0cmFqZWN0b3JpZXNcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzU1NBIHx8IGlzTGVhcGluZyB8fCBpc0h5YnJpZCB8fCBpc0F1dG9tYXRpYykpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcInNlZWRcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzU1NBIHx8IGlzTGVhcGluZyB8fCBpc0h5YnJpZCB8fCBpc0F1dG9tYXRpYykpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcInRhdS10b2xlcmFuY2VcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzSHlicmlkIHx8IGlzTGVhcGluZyB8fCBpc0F1dG9tYXRpYykpO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0UmVsYXRpdmVUb2xlcmFuY2U6IHtcbiAgICAgIGhvb2s6ICdyZWxhdGl2ZS10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdyZWxhdGl2ZS10b2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3JlbGF0aXZlVG9sJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnJlbGF0aXZlVG9sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0QWJzb2x1dGVUb2xlcmFuY2U6IHtcbiAgICAgIGhvb2s6ICdhYnNvbHV0ZS10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdhYnNvbHV0ZS10b2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ2Fic29sdXRlVG9sJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmFic29sdXRlVG9sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5wdXRSZWFsaXphdGlvbnM6IHtcbiAgICAgIGhvb2s6ICd0cmFqZWN0b3JpZXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdyZWFsaXphdGlvbnMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3JlYWxpemF0aW9ucycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wYXJlbnQuaXNQcmV2aWV3ID8gMSA6IHRoaXMubW9kZWwucmVhbGl6YXRpb25zXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0U2VlZDoge1xuICAgICAgaG9vazogJ3NlZWQnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnc2VlZCcsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ3NlZWQnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuc2VlZFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFRhdVRvbGVyYW5jZToge1xuICAgICAgaG9vazogJ3RhdS10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcgKHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ1RhdS1Ub2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3RhdVRvbCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC50YXVUb2xcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdTcGVjaWUgPSByZXF1aXJlKCcuL3ZpZXctc3BlY2llJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3NwZWNpZXNWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3U3BlY2llLCB0aGlzLnF1ZXJ5QnlIb29rKCdzcGVjaWUtbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdFdmVudEFzc2lnbm1lbnRzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIEFzc2lnbm1lbnRzVmlld2VyID0gcmVxdWlyZSgnLi9ldmVudC1hc3NpZ25tZW50cy12aWV3ZXInKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld0V2ZW50cy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaW5pdGlhbFZhbHVlJzoge1xuICAgICAgaG9vazogJ2V2ZW50LXRyaWdnZXItaW5pdC12YWx1ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY2hlY2tlZCcsXG4gICAgfSxcbiAgICAnbW9kZWwucGVyc2lzdGVudCc6IHtcbiAgICAgIGhvb2s6ICdldmVudC10cmlnZ2VyLXBlcnNpc3RlbnQnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2NoZWNrZWQnLFxuICAgIH0sXG4gICAgJ21vZGVsLnVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZSc6IHtcbiAgICAgIGhvb2s6ICd1c2UtdmFsdWVzLWZyb20tdHJpZ2dlci10aW1lJyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjaGVja2VkJyxcbiAgICB9LFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5kZWxheSA9IHRoaXMubW9kZWwuZGVsYXkgPT09IFwiXCIgPyBcIk5vbmVcIiA6IHRoaXMubW9kZWwuZGVsYXlcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIGFzc2lnbm1lbnRzVmlld2VyID0gbmV3IEFzc2lnbm1lbnRzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuZXZlbnRBc3NpZ25tZW50c1xuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGFzc2lnbm1lbnRzVmlld2VyLCAnYXNzaWdubWVudC12aWV3ZXInKTtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1BhcmFtZXRlcnMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG59KTsiLCJ2YXIga2F0ZXggPSByZXF1aXJlKCdrYXRleCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3UmVhY3Rpb25zLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yYXRlID0gdGhpcy5tb2RlbC5yZWFjdGlvblR5cGUgPT09IFwiY3VzdG9tLXByb3BlbnNpdHlcIiA/XG4gICAgICB0aGlzLm1vZGVsLnByb3BlbnNpdHkgOiB0aGlzLm1vZGVsLnJhdGUubmFtZVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBrYXRleC5yZW5kZXIodGhpcy5tb2RlbC5zdW1tYXJ5LCB0aGlzLnF1ZXJ5QnlIb29rKCdzdW1tYXJ5JyksIHtcbiAgICAgIGRpc3BsYXlNb2RlOiB0cnVlLFxuICAgICAgb3V0cHV0OiAnbWF0aG1sJ1xuICAgIH0pO1xuICB9LFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3UnVsZXMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdTcGVjaWVzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5zd2l0Y2hpbmdWYWxXaXRoTGFiZWwgPSB0aGlzLm1vZGVsLmlzU3dpdGNoVG9sID8gXG4gICAgICBcIlN3aXRjaGluZyBUb2xlcmFuY2U6IFwiICsgdGhpcy5tb2RlbC5zd2l0Y2hUb2wgOlxuICAgICAgXCJNaW5pbXVtIFZhbHVlIEZvciBTd2l0Y2hpbmc6IFwiICsgdGhpcy5tb2RlbC5zd2l0Y2hNaW5cbiAgfSxcbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3Rlc3RzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xudmFyIFNpbVNldHRpbmdzVmlldyA9IHJlcXVpcmUoJy4vc2ltdWxhdGlvbi1zZXR0aW5ncycpO1xudmFyIFBhcmFtU3dlZXBTZXR0aW5nc1ZpZXcgPSByZXF1aXJlKCcuL3BhcmFtZXRlci1zd2VlcC1zZXR0aW5ncycpO1xudmFyIFdvcmtmbG93U3RhdGVCdXR0b25zVmlldyA9IHJlcXVpcmUoJy4vd29ya2Zsb3ctc3RhdGUtYnV0dG9ucycpO1xuLy9tb2RlbHNcbnZhciBNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9tb2RlbCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd0VkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudHlwZSA9IGF0dHJzLnR5cGU7XG4gICAgdGhpcy5zZXR0aW5nc1ZpZXdzID0ge307XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXJlY3RvcnkgPSBhdHRycy5kaXJlY3RvcnlcbiAgICB2YXIgbW9kZWxGaWxlID0gZGlyZWN0b3J5LnNwbGl0KCcvJykucG9wKCk7XG4gICAgdmFyIG5hbWUgPSBtb2RlbEZpbGUuc3BsaXQoJy4nKVswXTtcbiAgICB2YXIgaXNTcGF0aWFsID0gbW9kZWxGaWxlLnNwbGl0KCcuJykucG9wKCkuc3RhcnRzV2l0aCgncycpO1xuICAgIHRoaXMubW9kZWwgPSBuZXcgTW9kZWwoe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGRpcmVjdG9yeTogZGlyZWN0b3J5LFxuICAgICAgaXNfc3BhdGlhbDogaXNTcGF0aWFsLFxuICAgICAgaXNQcmV2aWV3OiBmYWxzZSxcbiAgICB9KTtcbiAgICB0aGlzLm1vZGVsLmZldGNoKHtcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcbiAgICAgICAgc2VsZi5yZW5kZXJTdWJ2aWV3cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoZSkge1xuICB9LFxuICByZW5kZXJTdWJ2aWV3czogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlucHV0TmFtZSA9IG5ldyBJbnB1dFZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgICBsYWJlbDogJ01vZGVsIFBhdGg6ICcsXG4gICAgICB0ZXN0czogdGVzdHMubmFtZVRlc3RzLFxuICAgICAgbW9kZWxLZXk6ICdkaXJlY3RvcnknLFxuICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmRpcmVjdG9yeSxcbiAgICB9KTtcbiAgICAvL2luaXRpYWxpemUgdGhlIHNldHRpbmdzIHZpZXdzIGFuZCBhZGQgaXQgdG8gdGhlIGRpY3Rpb25hcnkgb2Ygc2V0dGluZ3Mgdmlld3NcbiAgICB0aGlzLnNldHRpbmdzVmlld3MuZ2lsbGVzcHkgPSBuZXcgU2ltU2V0dGluZ3NWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncyxcbiAgICB9KTtcbiAgICB0aGlzLnNldHRpbmdzVmlld3MucGFyYW1ldGVyU3dlZXAgPSBuZXcgUGFyYW1Td2VlcFNldHRpbmdzVmlldyh7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICBtb2RlbDogdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLFxuICAgIH0pO1xuICAgIHZhciB3b3JrZmxvd1N0YXRlQnV0dG9ucyA9IG5ldyBXb3JrZmxvd1N0YXRlQnV0dG9uc1ZpZXcoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhpbnB1dE5hbWUsIFwibW9kZWwtbmFtZS1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5zZXR0aW5nc1ZpZXdzWydnaWxsZXNweSddLCAnc2ltLXNldHRpbmdzLWNvbnRhaW5lcicpO1xuICAgIGlmKHRoaXMudHlwZSA9PT0gXCJwYXJhbWV0ZXJTd2VlcFwiKXtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuc2V0dGluZ3NWaWV3c1sncGFyYW1ldGVyU3dlZXAnXSwgJ3BhcmFtLXN3ZWVwLXNldHRpbmdzLWNvbnRhaW5lcicpO1xuICAgIH1cbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh3b3JrZmxvd1N0YXRlQnV0dG9ucywgJ3dvcmtmbG93LXN0YXRlLWJ1dHRvbnMtY29udGFpbmVyJyk7XG4gICAgdGhpcy5wYXJlbnQudHJhamVjdG9yaWVzID0gdGhpcy5tb2RlbC5zaW11bGF0aW9uU2V0dGluZ3MucmVhbGl6YXRpb25zXG4gICAgdGhpcy5wYXJlbnQuc3BlY2llcyA9IHRoaXMubW9kZWwuc3BlY2llc1xuICAgIHRoaXMucGFyZW50LnNwZWNpZXNPZkludGVyZXN0ID0gdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnNwZWNpZXNPZkludGVyZXN0XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIGNvbGxhcHNlQ29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwid29ya2Zsb3ctZWRpdG9yLWNvbnRhaW5lclwiKSkuY29sbGFwc2UoKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd0luZm8ucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc3RhdHVzID0gYXR0cnMuc3RhdHVzO1xuICAgIHRoaXMubG9nc1BhdGggPSBhdHRycy5sb2dzUGF0aDtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB0aGlzLmxpc3RPZldhcm5pbmdzID0gW107XG4gICAgdGhpcy5saXN0T2ZFcnJvcnMgPSBbXTtcbiAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oXCIvc3RvY2hzcy9hcGkvd29ya2Zsb3cvd29ya2Zsb3ctbG9nc1wiLCB0aGlzLmxvZ3NQYXRoKVxuICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICBpZihib2R5KXtcbiAgICAgICAgdmFyIGxvZ3MgPSBib2R5LnNwbGl0KFwiXFxuXCIpXG4gICAgICAgIGxvZ3MuZm9yRWFjaChzZWxmLnBhcnNlTG9ncywgc2VsZilcbiAgICAgICAgc2VsZi5leHBhbmRMb2dDb250YWluZXJzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKHRoaXMuc3RhdHVzID09PSAnY29tcGxldGUnKXtcbiAgICAgIHRoaXMuZW5hYmxlQ29sbGFwc2VCdXR0b24oKVxuICAgIH1lbHNlIGlmKHRoaXMuc3RhdHVzID09PSAnZXJyb3InKXtcbiAgICAgIHRoaXMuZXhwYW5kSW5mb0NvbnRhaW5lcigpXG4gICAgfVxuICB9LFxuICBwYXJzZUxvZ3M6IGZ1bmN0aW9uIChsb2cpIHtcbiAgICB2YXIgbWVzc2FnZSA9IGxvZy5zcGxpdCgncm9vdCAtICcpLnBvcCgpXG4gICAgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiV0FSTklOR1wiKSl7XG4gICAgICB0aGlzLmxpc3RPZldhcm5pbmdzLnB1c2gobWVzc2FnZS5zcGxpdChcIldBUk5JTkdcIikucG9wKCkpXG4gICAgfWVsc2UgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiRVJST1JcIikpe1xuICAgICAgdGhpcy5saXN0T2ZFcnJvcnMucHVzaChtZXNzYWdlLnNwbGl0KFwiRVJST1JcIikucG9wKCkpXG4gICAgfWVsc2UgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiQ1JJVElDQUxcIikpe1xuICAgICAgdGhpcy5saXN0T2ZFcnJvcnMucHVzaChtZXNzYWdlLnNwbGl0KFwiQ1JJVElDQUxcIikucG9wKCkpXG4gICAgfVxuICB9LFxuICBlbmFibGVDb2xsYXBzZUJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gIH0sXG4gIGV4cGFuZEluZm9Db250YWluZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZUNvbGxhcHNlQnV0dG9uKCk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1pbmZvJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZVwiKVxuICB9LFxuICBleHBhbmRMb2dDb250YWluZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5saXN0T2ZXYXJuaW5ncy5sZW5ndGgpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctd2FybmluZ3MnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAgIHZhciBsaXN0T2ZXYXJuaW5ncyA9IFwiPHA+XCIgKyB0aGlzLmxpc3RPZldhcm5pbmdzLmpvaW4oJzxicj4nKSArIFwiPC9wPlwiO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdsaXN0LW9mLXdhcm5pbmdzJykpLmh0bWwobGlzdE9mV2FybmluZ3MpO1xuICAgIH1cbiAgICBpZih0aGlzLmxpc3RPZkVycm9ycy5sZW5ndGgpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctZXJyb3JzJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgICB2YXIgbGlzdE9mRXJyb3JzID0gXCI8cD5cIiArIHRoaXMubGlzdE9mRXJyb3JzLmpvaW4oJzxicj4nKSArIFwiPC9wPlwiO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdsaXN0LW9mLWVycm9ycycpKS5odG1sKGxpc3RPZkVycm9ycyk7XG4gICAgfVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vayhcImNvbGxhcHNlXCIpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKFwiY29sbGFwc2VcIikpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vayhcImNvbGxhcHNlXCIpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgeGhyID0gcmVxdWlyZSgneGhyJyk7XG52YXIgUGxvdGx5ID0gcmVxdWlyZSgnLi4vbGliL3Bsb3RseScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIGdpbGxlc3B5UmVzdWx0c1RlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2dpbGxlc3B5UmVzdWx0cy5wdWcnKTtcbnZhciBnaWxsZXNweVJlc3VsdHNFbnNlbWJsZVRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2dpbGxlc3B5UmVzdWx0c0Vuc2VtYmxlLnB1ZycpO1xudmFyIHBhcmFtZXRlclN3ZWVwUmVzdWx0c1RlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlclN3ZWVwUmVzdWx0cy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLXN0ZGRldnJhbmdlXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXN0ZGRldnJhbmdlXCIpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2UtdHJhamVjdG9yaWVzXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXRyYWplY3Rvcmllc1wiKTtcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLXN0ZGRldl0nIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZS1zdGRkZXZcIik7XG4gICAgfSxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZS10cmFqbWVhbl0nIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZS10cmFqbWVhblwiKTtcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLXRyYWptZWFuXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZS1wc3dlZXBcIik7XG4gICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2VcIik7XG4gICAgfSxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9dGl0bGVdJyA6ICdzZXRUaXRsZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXhheGlzXScgOiAnc2V0WEF4aXMnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz15YXhpc10nIDogJ3NldFlBeGlzJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3BlY2llLW9mLWludGVyZXN0LWxpc3RdJyA6ICdnZXRQbG90Rm9yU3BlY2llcycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWZlYXR1cmUtZXh0cmFjdGlvbi1saXN0XScgOiAnZ2V0UGxvdEZvckZlYXR1cmVFeHRyYWN0b3InLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1lbnNlbWJsZS1hZ2dyYWdhdG9yLWxpc3RdJyA6ICdnZXRQbG90Rm9yRW5zZW1ibGVBZ2dyYWdhdG9yJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1wbG90XScgOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHR5cGUgPSBlLnRhcmdldC5pZFxuICAgICAgaWYodGhpcy5wbG90c1t0eXBlXSkge1xuICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJlZGl0LXBsb3QtYXJnc1wiKSkuY29sbGFwc2UoXCJzaG93XCIpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMuZ2V0UGxvdCh0eXBlKTtcbiAgICAgICAgZS50YXJnZXQuaW5uZXJUZXh0ID0gXCJFZGl0IFBsb3RcIlxuICAgICAgfVxuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZG93bmxvYWQtcG5nLWN1c3RvbV0nIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB0eXBlID0gZS50YXJnZXQuaWQ7XG4gICAgICB0aGlzLmNsaWNrRG93bmxvYWRQTkdCdXR0b24odHlwZSlcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWRvd25sb2FkLWpzb25dJyA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgdHlwZSA9IGUudGFyZ2V0LmlkO1xuICAgICAgdGhpcy5leHBvcnRUb0pzb25GaWxlKHRoaXMucGxvdHNbdHlwZV0sIHR5cGUpXG4gICAgfVxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50cmFqZWN0b3JpZXMgPSBhdHRycy50cmFqZWN0b3JpZXM7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gICAgdGhpcy5zcGVjaWVzID0gYXR0cnMuc3BlY2llcztcbiAgICB0aGlzLnR5cGUgPSBhdHRycy50eXBlO1xuICAgIHRoaXMuc3BlY2llc09mSW50ZXJlc3QgPSBhdHRycy5zcGVjaWVzT2ZJbnRlcmVzdDtcbiAgICB0aGlzLmZlYXR1cmVFeHRyYWN0b3IgPSBcImZpbmFsXCI7XG4gICAgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IgPSBcImF2Z1wiO1xuICAgIHRoaXMucGxvdHMgPSB7fVxuICAgIHRoaXMucGxvdEFyZ3MgPSB7fVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLnR5cGUgPT09IFwicGFyYW1ldGVyU3dlZXBcIil7XG4gICAgICB0aGlzLnRlbXBsYXRlID0gcGFyYW1ldGVyU3dlZXBSZXN1bHRzVGVtcGxhdGVcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLnRyYWplY3RvcmllcyA+IDEgPyBnaWxsZXNweVJlc3VsdHNFbnNlbWJsZVRlbXBsYXRlIDogZ2lsbGVzcHlSZXN1bHRzVGVtcGxhdGVcbiAgICB9XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYodGhpcy5zdGF0dXMgPT09ICdjb21wbGV0ZScpe1xuICAgICAgdGhpcy5leHBhbmRDb250YWluZXIoKVxuICAgIH1cbiAgICB2YXIgc3BlY2llc05hbWVzID0gdGhpcy5zcGVjaWVzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7IHJldHVybiBzcGVjaWUubmFtZX0pO1xuICAgIHZhciBmZWF0dXJlRXh0cmFjdG9ycyA9IFtcIk1pbmltdW0gb2YgcG9wdWxhdGlvblwiLCBcIk1heGltdW0gb2YgcG9wdWxhdGlvblwiLCBcIkF2ZXJhZ2Ugb2YgcG9wdWxhdGlvblwiLCBcIlZhcmlhbmNlIG9mIHBvcHVsYXRpb25cIiwgXCJQb3B1bGF0aW9uIGF0IGxhc3QgdGltZSBwb2ludFwiXVxuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JzID0gW1wiTWluaW11bSBvZiBlbnNlbWJsZVwiLCBcIk1heGltdW0gb2YgZW5zZW1ibGVcIiwgXCJBdmVyYWdlIG9mIGVuc2VtYmxlXCIsIFwiVmFyaWFuY2Ugb2YgZW5zZW1ibGVcIl1cbiAgICB2YXIgc3BlY2llc09mSW50ZXJlc3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3NwZWNpZXMtb2YtaW50ZXJlc3QnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBzcGVjaWVzTmFtZXMsXG4gICAgICB2YWx1ZTogdGhpcy5zcGVjaWVzT2ZJbnRlcmVzdFxuICAgIH0pO1xuICAgIHZhciBmZWF0dXJlRXh0cmFjdG9yVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdmZWF0dXJlLWV4dHJhY3RvcicsXG4gICAgICByZXF1aXJlczogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IGZlYXR1cmVFeHRyYWN0b3JzLFxuICAgICAgdmFsdWU6IFwiUG9wdWxhdGlvbiBhdCBsYXN0IHRpbWUgcG9pbnRcIlxuICAgIH0pO1xuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ2Vuc2VtYmxlLWFnZ3JhZ2F0b3InLFxuICAgICAgcmVxdWlyZXM6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBlbnNlbWJsZUFnZ3JhZ2F0b3JzLFxuICAgICAgdmFsdWU6IFwiQXZlcmFnZSBvZiBlbnNlbWJsZVwiXG4gICAgfSk7XG4gICAgaWYodGhpcy50eXBlID09PSBcInBhcmFtZXRlclN3ZWVwXCIpe1xuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3BlY2llc09mSW50ZXJlc3RWaWV3LCAnc3BlY2llLW9mLWludGVyZXN0LWxpc3QnKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGZlYXR1cmVFeHRyYWN0b3JWaWV3LCAnZmVhdHVyZS1leHRyYWN0aW9uLWxpc3QnKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGVuc2VtYmxlQWdncmFnYXRvclZpZXcsICdlbnNlbWJsZS1hZ2dyYWdhdG9yLWxpc3QnKTtcbiAgICAgIGlmKHRoaXMudHJhamVjdG9yaWVzIDw9IDEpe1xuICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2Vuc2VtYmxlLWFnZ3JhZ2F0b3ItbGlzdCcpKS5maW5kKCdzZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKHNvdXJjZSkpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soc291cmNlKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKHNvdXJjZSkpLnRleHQoJysnKTtcbiAgfSxcbiAgc2V0VGl0bGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5wbG90QXJnc1sndGl0bGUnXSA9IGUudGFyZ2V0LnZhbHVlXG4gICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLnBsb3RzKSB7XG4gICAgICB2YXIgZmlnID0gdGhpcy5wbG90c1t0eXBlXVxuICAgICAgZmlnLmxheW91dC50aXRsZS50ZXh0ID0gZS50YXJnZXQudmFsdWVcbiAgICAgIHRoaXMucGxvdEZpZ3VyZShmaWcsIHR5cGUpXG4gICAgfVxuICB9LFxuICBzZXRZQXhpczogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLnBsb3RBcmdzWyd5YXhpcyddID0gZS50YXJnZXQudmFsdWVcbiAgICBmb3IgKHZhciB0eXBlIGluIHRoaXMucGxvdHMpIHtcbiAgICAgIHZhciBmaWcgPSB0aGlzLnBsb3RzW3R5cGVdXG4gICAgICBmaWcubGF5b3V0LnlheGlzLnRpdGxlLnRleHQgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgdGhpcy5wbG90RmlndXJlKGZpZywgdHlwZSlcbiAgICB9XG4gIH0sXG4gIHNldFhBeGlzOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMucGxvdEFyZ3NbJ3hheGlzJ10gPSBlLnRhcmdldC52YWx1ZVxuICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5wbG90cykge1xuICAgICAgdmFyIGZpZyA9IHRoaXMucGxvdHNbdHlwZV1cbiAgICAgIGZpZy5sYXlvdXQueGF4aXMudGl0bGUudGV4dCA9IGUudGFyZ2V0LnZhbHVlXG4gICAgICB0aGlzLnBsb3RGaWd1cmUoZmlnLCB0eXBlKVxuICAgIH1cbiAgfSxcbiAgZ2V0UGxvdDogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVsID0gdGhpcy5xdWVyeUJ5SG9vayh0eXBlKVxuICAgIFBsb3RseS5wdXJnZShlbClcbiAgICB2YXIgZGF0YSA9IHt9XG4gICAgaWYodHlwZSA9PT0gJ3Bzd2VlcCcpe1xuICAgICAgbGV0IGtleSA9IHRoaXMuZ2V0UHN3ZWVwS2V5KClcbiAgICAgIGRhdGFbJ3BsdF9rZXknXSA9IGtleTtcbiAgICB9ZWxzZXtcbiAgICAgIGRhdGFbJ3BsdF9rZXknXSA9IHR5cGU7XG4gICAgfVxuICAgIGlmKE9iamVjdC5rZXlzKHRoaXMucGxvdEFyZ3MpLmxlbmd0aCl7XG4gICAgICBkYXRhWydwbHRfZGF0YSddID0gdGhpcy5wbG90QXJnc1xuICAgIH1lbHNle1xuICAgICAgZGF0YVsncGx0X2RhdGEnXSA9IFwiTm9uZVwiXG4gICAgfVxuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihcIi9zdG9jaHNzL2FwaS93b3JrZmxvdy9wbG90LXJlc3VsdHNcIiwgdGhpcy5wYXJlbnQuZGlyZWN0b3J5LCAnP2RhdGE9JyArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB4aHIoe3VybDogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSl7XG4gICAgICBpZihib2R5LnN0YXJ0c1dpdGgoXCJFUlJPUiFcIikpe1xuICAgICAgICAkKHNlbGYucXVlcnlCeUhvb2sodHlwZSkpLmh0bWwoYm9keSlcbiAgICAgIH1lbHNle1xuICAgICAgICB2YXIgZmlnID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICBzZWxmLnBsb3RzW3R5cGVdID0gZmlnXG4gICAgICAgIHNlbGYucGxvdEZpZ3VyZShmaWcsIHR5cGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBwbG90RmlndXJlOiBmdW5jdGlvbiAoZmlndXJlLCB0eXBlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBob29rID0gdHlwZTtcbiAgICB2YXIgZWwgPSB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spXG4gICAgUGxvdGx5Lm5ld1Bsb3QoZWwsIGZpZ3VyZSlcbiAgICB0aGlzLnF1ZXJ5QWxsKFwiI1wiICsgdHlwZSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIGlmKGVsLmRpc2FibGVkKXtcbiAgICAgICAgZWwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgY2xpY2tEb3dubG9hZFBOR0J1dHRvbjogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgcG5nQnV0dG9uID0gJCgnZGl2W2RhdGEtaG9vayo9Jyt0eXBlKyddIGFbZGF0YS10aXRsZSo9XCJEb3dubG9hZCBwbG90IGFzIGEgcG5nXCJdJylbMF1cbiAgICBwbmdCdXR0b24uY2xpY2soKVxuICB9LFxuICBleHBvcnRUb0pzb25GaWxlOiBmdW5jdGlvbiAoanNvbkRhdGEsIHBsb3RUeXBlKSB7XG4gICAgbGV0IGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSk7XG4gICAgbGV0IGRhdGFVUkkgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhU3RyKTtcbiAgICBsZXQgZXhwb3J0RmlsZURlZmF1bHROYW1lID0gcGxvdFR5cGUgKyAnLXBsb3QuanNvbic7XG5cbiAgICBsZXQgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVVSSSk7XG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGV4cG9ydEZpbGVEZWZhdWx0TmFtZSk7XG4gICAgbGlua0VsZW1lbnQuY2xpY2soKTtcbiAgfSxcbiAgZXhwYW5kQ29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1yZXN1bHRzJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlXCIpXG4gICAgaWYodGhpcy50eXBlID09PSBcInBhcmFtZXRlclN3ZWVwXCIpe1xuICAgICAgdGhpcy5nZXRQbG90KFwicHN3ZWVwXCIpXG4gICAgfWVsc2V7XG4gICAgICB0aGlzLnRyYWplY3RvcmllcyA+IDEgPyB0aGlzLmdldFBsb3QoXCJzdGRkZXZyYW5cIikgOiB0aGlzLmdldFBsb3QoXCJ0cmFqZWN0b3JpZXNcIilcbiAgICB9XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIGdldFBsb3RGb3JTcGVjaWVzOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc3BlY2llc09mSW50ZXJlc3QgPSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIHRoaXMuZ2V0UGxvdCgncHN3ZWVwJylcbiAgfSxcbiAgZ2V0UGxvdEZvckZlYXR1cmVFeHRyYWN0b3I6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGZlYXR1cmVFeHRyYWN0b3JzID0ge1wiTWluaW11bSBvZiBwb3B1bGF0aW9uXCI6XCJtaW5cIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTWF4aW11bSBvZiBwb3B1bGF0aW9uXCI6XCJtYXhcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQXZlcmFnZSBvZiBwb3B1bGF0aW9uXCI6XCJhdmdcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFyaWFuY2Ugb2YgcG9wdWxhdGlvblwiOlwidmFyXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlBvcHVsYXRpb24gYXQgbGFzdCB0aW1lIHBvaW50XCI6XCJmaW5hbFwifVxuICAgIHZhciB2YWx1ZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5mZWF0dXJlRXh0cmFjdG9yID0gZmVhdHVyZUV4dHJhY3RvcnNbdmFsdWVdXG4gICAgdGhpcy5nZXRQbG90KCdwc3dlZXAnKVxuICB9LFxuICBnZXRQbG90Rm9yRW5zZW1ibGVBZ2dyYWdhdG9yOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JzID0ge1wiTWluaW11bSBvZiBlbnNlbWJsZVwiOlwibWluXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTWF4aW11bSBvZiBlbnNlbWJsZVwiOlwibWF4XCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQXZlcmFnZSBvZiBlbnNlbWJsZVwiOlwiYXZnXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFyaWFuY2Ugb2YgZW5zZW1ibGVcIjpcInZhclwifVxuICAgIHZhciB2YWx1ZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IgPSBlbnNlbWJsZUFnZ3JhZ2F0b3JzW3ZhbHVlXVxuICAgIHRoaXMuZ2V0UGxvdCgncHN3ZWVwJylcbiAgfSxcbiAgZ2V0UHN3ZWVwS2V5OiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGtleSA9IHRoaXMuc3BlY2llc09mSW50ZXJlc3QgKyBcIi1cIiArIHRoaXMuZmVhdHVyZUV4dHJhY3RvclxuICAgIGlmKHRoaXMudHJhamVjdG9yaWVzID4gMSl7XG4gICAgICBrZXkgKz0gKFwiLVwiICsgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IpXG4gICAgfVxuICAgIHJldHVybiBrZXlcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFRpdGxlOiB7XG4gICAgICBob29rOiAndGl0bGUnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy50aXRsZSB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFhBeGlzOiB7XG4gICAgICBob29rOiAneGF4aXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAneGF4aXMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy54YXhpcyB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFlBeGlzOiB7XG4gICAgICBob29rOiAneWF4aXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAneWF4aXMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy55YXhpcyB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIiwidmFyIGFwcCA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1hcHAnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgeGhyID0gcmVxdWlyZSgneGhyJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvd29ya2Zsb3dTdGF0ZUJ1dHRvbnMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXNhdmVdJyA6ICdjbGlja1NhdmVIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1zdGFydC13b3JrZmxvd10nICA6ICdjbGlja1N0YXJ0V29ya2Zsb3dIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LW1vZGVsXScgOiAnY2xpY2tFZGl0TW9kZWxIYW5kbGVyJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgY2xpY2tTYXZlSGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLnNhdmluZygpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsXG4gICAgdmFyIHdrZmxUeXBlID0gdGhpcy5wYXJlbnQucGFyZW50LnR5cGU7XG4gICAgdmFyIG9wdFR5cGUgPSBkb2N1bWVudC5VUkwuZW5kc1dpdGgoXCIubWRsXCIpID8gXCJzblwiIDogXCJzZVwiO1xuICAgIHZhciB3b3JrZmxvdyA9IGRvY3VtZW50LlVSTC5lbmRzV2l0aChcIi5tZGxcIikgPyB0aGlzLnBhcmVudC5wYXJlbnQud29ya2Zsb3dOYW1lIDogdGhpcy5wYXJlbnQucGFyZW50LmRpcmVjdG9yeVxuICAgIHRoaXMuc2F2ZU1vZGVsKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbignL3N0b2Noc3MvYXBpL3dvcmtmbG93L3NhdmUtd29ya2Zsb3cvJywgd2tmbFR5cGUsIG9wdFR5cGUsIG1vZGVsLmRpcmVjdG9yeSwgXCI8LS1HaWxsZXNQeTJXb3JrZmxvdy0tPlwiLCB3b3JrZmxvdyk7XG4gICAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICBzZWxmLnNhdmVkKCk7XG4gICAgICAgIGlmKGRvY3VtZW50LlVSTC5lbmRzV2l0aCgnLm1kbCcpKXtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGRvY3VtZW50LlVSTCkuc3BsaXQoJ2h1YicpXG4gICAgICAgICAgICBkaXJuYW1lLnNoaWZ0KClcbiAgICAgICAgICAgIGRpcm5hbWUgPSBkaXJuYW1lLmpvaW4oJ2h1YicpXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihkaXJuYW1lLCBzZWxmLnBhcmVudC5wYXJlbnQud29ya2Zsb3dOYW1lICsgJy53a2ZsJylcbiAgICAgICAgICB9LCAzMDAwKTsgXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjbGlja1N0YXJ0V29ya2Zsb3dIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc2F2ZU1vZGVsKHRoaXMucnVuV29ya2Zsb3cuYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNsaWNrRWRpdE1vZGVsSGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB0aGlzLnNhdmVNb2RlbChmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihcIi9odWIvc3RvY2hzcy9tb2RlbHMvZWRpdFwiLCBzZWxmLm1vZGVsLmRpcmVjdG9yeSk7XG4gICAgfSk7XG4gIH0sXG4gIHNhdmVNb2RlbDogZnVuY3Rpb24gKGNiKSB7XG4gICAgLy8gdGhpcy5tb2RlbCBpcyBhIE1vZGVsVmVyc2lvbiwgdGhlIHBhcmVudCBvZiB0aGUgY29sbGVjdGlvbiBpcyBNb2RlbFxuICAgIGlmKHRoaXMubW9kZWwuc2ltdWxhdGlvblNldHRpbmdzLmlzQXV0b21hdGljKXtcbiAgICAgIHRoaXMubW9kZWwuc2ltdWxhdGlvblNldHRpbmdzLmxldFVzQ2hvb3NlRm9yWW91KCk7XG4gICAgfVxuICAgIHZhciBtb2RlbCA9IHRoaXMubW9kZWw7XG4gICAgaWYgKGNiKSB7XG4gICAgICBtb2RlbC5zYXZlKG1vZGVsLmF0dHJpYnV0ZXMsIHtcbiAgICAgICAgc3VjY2VzczogY2IsXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiAobW9kZWwsIHJlc3BvbnNlLCBvcHRpb25zKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNhdmluZyBtb2RlbDpcIiwgbW9kZWwpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSZXNwb25zZTpcIiwgcmVzcG9uc2UpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZGVsLnNhdmVNb2RlbCgpO1xuICAgIH1cbiAgfSxcbiAgc2F2aW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNhdmluZyA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmluZy13b3JrZmxvdycpO1xuICAgIHZhciBzYXZlZCA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmVkLXdvcmtmbG93Jyk7XG4gICAgc2F2ZWQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNhdmluZy5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgfSxcbiAgc2F2ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2F2aW5nID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2aW5nLXdvcmtmbG93Jyk7XG4gICAgdmFyIHNhdmVkID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2ZWQtd29ya2Zsb3cnKTtcbiAgICBzYXZpbmcuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNhdmVkLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuICB9LFxuICBydW5Xb3JrZmxvdzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCA9IHRoaXMubW9kZWw7XG4gICAgdmFyIHdrZmxUeXBlID0gdGhpcy5wYXJlbnQucGFyZW50LnR5cGU7XG4gICAgdmFyIG9wdFR5cGUgPSBkb2N1bWVudC5VUkwuZW5kc1dpdGgoXCIubWRsXCIpID8gXCJyblwiIDogXCJyZVwiO1xuICAgIHZhciB3b3JrZmxvdyA9IGRvY3VtZW50LlVSTC5lbmRzV2l0aChcIi5tZGxcIikgPyB0aGlzLnBhcmVudC5wYXJlbnQud29ya2Zsb3dOYW1lIDogdGhpcy5wYXJlbnQucGFyZW50LmRpcmVjdG9yeVxuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbignL3N0b2Noc3MvYXBpL3dvcmtmbG93L3J1bi13b3JrZmxvdy8nLCB3a2ZsVHlwZSwgb3B0VHlwZSwgbW9kZWwuZGlyZWN0b3J5LCBcIjwtLUdpbGxlc1B5MldvcmtmbG93LS0+XCIsIHdvcmtmbG93KTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgeGhyKHsgdXJpOiBlbmRwb2ludCB9LGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICBzZWxmLnBhcmVudC5jb2xsYXBzZUNvbnRhaW5lcigpO1xuICAgICAgc2VsZi5wYXJlbnQucGFyZW50LnVwZGF0ZVdvcmtmbG93U3RhdHVzKCk7XG4gICAgICBpZihkb2N1bWVudC5VUkwuZW5kc1dpdGgoJy5tZGwnKSl7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGRvY3VtZW50LlVSTCkuc3BsaXQoJ2h1YicpXG4gICAgICAgICAgZGlybmFtZS5zaGlmdCgpXG4gICAgICAgICAgZGlybmFtZSA9IGRpcm5hbWUuam9pbignaHViJylcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihkaXJuYW1lLCBzZWxmLnBhcmVudC5wYXJlbnQud29ya2Zsb3dOYW1lICsgJy53a2ZsJylcbiAgICAgICAgfSwgMzAwMCk7ICAgICAgICBcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93U3RhdHVzLnB1ZycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBsb2NhbERhdGUgPSBuZXcgRGF0ZShhdHRycy5zdGFydFRpbWUpXG4gICAgdmFyIGxvY2FsU3RhcnRUaW1lID0gdGhpcy5nZXRGb3JtYXR0ZWREYXRlKGxvY2FsRGF0ZSlcbiAgICB0aGlzLnN0YXJ0VGltZSA9IGxvY2FsU3RhcnRUaW1lO1xuICAgIHRoaXMuc3RhdHVzID0gYXR0cnMuc3RhdHVzO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZih0aGlzLnN0YXR1cyAhPT0gJ3JlYWR5JyAmJiB0aGlzLnN0YXR1cyAhPT0gJ25ldycpe1xuICAgICAgdGhpcy5leHBhbmRDb250YWluZXIoKVxuICAgIH1cbiAgfSxcbiAgZXhwYW5kQ29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1zdGF0dXMnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KClcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxuICBnZXRGb3JtYXR0ZWREYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xuICAgIHZhciBtb250aHMgPSBbJ0phbi4nLCAnRmViLicsICdNYXIuJywgJ0Fwci4nLCAnTWF5JywgJ0p1bi4nLCAnSnVsLicsICdBdWcuJywgJ1NlcHQuJywgJ09jdC4nLCAnTm92LicsICdEZWMuJ107XG4gICAgdmFyIG1vbnRoID0gbW9udGhzW2RhdGUuZ2V0TW9udGgoKV07IC8vIGdldCB0aGUgYWJyaXZpYXRlZCBtb250aFxuICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKTtcbiAgICB2YXIgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgdmFyIGFtcG0gPSBob3VycyA+PSAxMiA/ICdQTScgOiAnQU0nOyAvLyBnZXQgQU0gb3IgUE0gYmFzZWQgb24gaG91cnNcbiAgICBob3VycyA9IGhvdXJzJTEyOyAvLyBmb3JtYXQgaG91cnMgdG8gMTIgaG91ciB0aW1lIGZvcm1hdFxuICAgIGhvdXJzID0gaG91cnMgPyBob3VycyA6IDEyOyAvLyByZXBsYWNlIDAgd2l0aCAxMlxuICAgIHZhciBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgbWludXRlcyA9IG1pbnV0ZXMgPCAxMCA/ICcwJyArIG1pbnV0ZXMgOiBtaW51dGVzOyAvLyBmb3JtYXQgbWludXRlcyB0byBhbHdheXMgaGF2ZSB0d28gY2hhcnNcbiAgICB2YXIgdGltZVpvbmUgPSBkYXRlLnRvU3RyaW5nKCkuc3BsaXQoJyAnKS5wb3AoKSAvLyBnZXQgdGhlIHRpbWV6b25lIGZyb20gdGhlIGRhdGVcbiAgICB0aW1lWm9uZSA9IHRpbWVab25lLnJlcGxhY2UoJygnLCAnJykucmVwbGFjZSgnKScsICcnKSAvLyByZW1vdmUgdGhlICcoKScgZnJvbSB0aGUgdGltZXpvbmVcbiAgICByZXR1cm4gIG1vbnRoICsgXCIgXCIgKyBkYXkgKyBcIiwgXCIgKyB5ZWFyICsgXCIgIFwiICsgaG91cnMgKyBcIjpcIiArIG1pbnV0ZXMgKyBcIiBcIiArIGFtcG0gKyBcIiBcIiArIHRpbWVab25lO1xuICB9LFxufSk7Il0sInNvdXJjZVJvb3QiOiIifQ==
=======
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL3dvcmtmbG93LW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudEFzc2lnbm1lbnRzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50c1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFNldHRpbmdzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL21vZGVsVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3J1bGVzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3NpbXVsYXRpb25TZXR0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BlY2llc1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRBc3NpZ25tZW50cy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdQYXJhbWV0ZXJzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdSZWFjdGlvbnMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1J1bGVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdTcGVjaWVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93RWRpdG9yLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93SW5mby5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1Jlc3VsdHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvd29ya2Zsb3dSZXN1bHRzRW5zZW1ibGUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvd29ya2Zsb3dTdGF0ZUJ1dHRvbnMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvd29ya2Zsb3dTdGF0dXMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvcGFnZXMvd29ya2Zsb3dNYW5hZ2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZXZlbnQtYXNzaWdubWVudHMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9ldmVudHMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9tb2RlbC1zZXR0aW5ncy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL21vZGVsLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvcGFyYW1ldGVycy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9ucy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3J1bGVzLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvc2ltdWxhdGlvbi1zZXR0aW5ncy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3NpbXVsYXRpb24tc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3NwZWNpZXMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy92aWV3LWV2ZW50LWFzc2lnbm1lbnRzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy92aWV3LWV2ZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1wYXJhbWV0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3ZpZXctcmVhY3Rpb25zLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy92aWV3LXJ1bGVzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy92aWV3LXNwZWNpZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctZWRpdG9yLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy93b3JrZmxvdy1pbmZvLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy93b3JrZmxvdy1yZXN1bHRzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy93b3JrZmxvdy1zdGF0ZS1idXR0b25zLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy93b3JrZmxvdy1zdGF0dXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQVEsb0JBQW9CO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNB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QUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFRO0FBQ1IsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDLEU7Ozs7Ozs7Ozs7O0FDbExELFFBQVEsbUJB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O0FBQ0E7QUFDQTtBQUNBLFNBQVMsZ0JBQWdCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFE7QUFDVDtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7O0FDdkdELFFBQVEsbUJBQU8sQ0FBQyxvREFBUTtBQUN4QjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkM7QUFDQSxlQUFlLG1CQUFPLENBQUMsZ0dBQTBDOzs7QUFHakU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDLHFCQUFxQjtBQUNyQiwrQkFBK0I7QUFDL0I7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRSIsImZpbGUiOiJzdG9jaHNzLXdvcmtmbG93RWRpdG9yLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0ZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soZGF0YSkge1xuIFx0XHR2YXIgY2h1bmtJZHMgPSBkYXRhWzBdO1xuIFx0XHR2YXIgbW9yZU1vZHVsZXMgPSBkYXRhWzFdO1xuIFx0XHR2YXIgZXhlY3V0ZU1vZHVsZXMgPSBkYXRhWzJdO1xuXG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG4gXHRcdFx0fVxuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGRhdGEpO1xuXG4gXHRcdHdoaWxlKHJlc29sdmVzLmxlbmd0aCkge1xuIFx0XHRcdHJlc29sdmVzLnNoaWZ0KCkoKTtcbiBcdFx0fVxuXG4gXHRcdC8vIGFkZCBlbnRyeSBtb2R1bGVzIGZyb20gbG9hZGVkIGNodW5rIHRvIGRlZmVycmVkIGxpc3RcbiBcdFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2guYXBwbHkoZGVmZXJyZWRNb2R1bGVzLCBleGVjdXRlTW9kdWxlcyB8fCBbXSk7XG5cbiBcdFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiBhbGwgY2h1bmtzIHJlYWR5XG4gXHRcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIFx0fTtcbiBcdGZ1bmN0aW9uIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCkge1xuIFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGRlZmVycmVkTW9kdWxlID0gZGVmZXJyZWRNb2R1bGVzW2ldO1xuIFx0XHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuIFx0XHRcdGZvcih2YXIgaiA9IDE7IGogPCBkZWZlcnJlZE1vZHVsZS5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGRlcElkID0gZGVmZXJyZWRNb2R1bGVbal07XG4gXHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbZGVwSWRdICE9PSAwKSBmdWxmaWxsZWQgPSBmYWxzZTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYoZnVsZmlsbGVkKSB7XG4gXHRcdFx0XHRkZWZlcnJlZE1vZHVsZXMuc3BsaWNlKGktLSwgMSk7XG4gXHRcdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGRlZmVycmVkTW9kdWxlWzBdKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4gXHQvLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0XCJ3b3JrZmxvd0VkaXRvclwiOiAwXG4gXHR9O1xuXG4gXHR2YXIgZGVmZXJyZWRNb2R1bGVzID0gW107XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdHZhciBqc29ucEFycmF5ID0gd2luZG93W1wid2VicGFja0pzb25wXCJdID0gd2luZG93W1wid2VicGFja0pzb25wXCJdIHx8IFtdO1xuIFx0dmFyIG9sZEpzb25wRnVuY3Rpb24gPSBqc29ucEFycmF5LnB1c2guYmluZChqc29ucEFycmF5KTtcbiBcdGpzb25wQXJyYXkucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrO1xuIFx0anNvbnBBcnJheSA9IGpzb25wQXJyYXkuc2xpY2UoKTtcbiBcdGZvcih2YXIgaSA9IDA7IGkgPCBqc29ucEFycmF5Lmxlbmd0aDsgaSsrKSB3ZWJwYWNrSnNvbnBDYWxsYmFjayhqc29ucEFycmF5W2ldKTtcbiBcdHZhciBwYXJlbnRKc29ucEZ1bmN0aW9uID0gb2xkSnNvbnBGdW5jdGlvbjtcblxuXG4gXHQvLyBhZGQgZW50cnkgbW9kdWxlIHRvIGRlZmVycmVkIGxpc3RcbiBcdGRlZmVycmVkTW9kdWxlcy5wdXNoKFtcIi4vY2xpZW50L3BhZ2VzL3dvcmtmbG93LW1hbmFnZXIuanNcIixcImNvbW1vblwiXSk7XG4gXHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIHJlYWR5XG4gXHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3Rlc3RzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbi8vdmlld3NcbnZhciBQYWdlVmlldyA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyIFdvcmtmbG93RWRpdG9yVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3dvcmtmbG93LWVkaXRvcicpO1xudmFyIFdvcmtmbG93U3RhdHVzVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3dvcmtmbG93LXN0YXR1cycpO1xudmFyIFdvcmtmbG93UmVzdWx0c1ZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy93b3JrZmxvdy1yZXN1bHRzJyk7XG52YXIgTW9kZWxWaWV3ZXIgPSByZXF1aXJlKCcuLi92aWV3cy9tb2RlbC12aWV3ZXInKTtcbnZhciBJbmZvVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3dvcmtmbG93LWluZm8nKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9wYWdlcy93b3JrZmxvd01hbmFnZXIucHVnJyk7XG5cbmltcG9ydCBpbml0UGFnZSBmcm9tICcuL3BhZ2UuanMnO1xuXG5sZXQgb3BlcmF0aW9uSW5mb01vZGFsSHRtbCA9ICgpID0+IHtcbiAgbGV0IGVkaXRXb3JrZmxvd01lc3NhZ2UgPSBgXG4gICAgPHA+PGI+V29ya2Zsb3cgTmFtZS9QYXRoPC9iPjogWW91IG1heSBlZGl0IHRoZSBuYW1lL3BhdGggb2YgdGhlIHdvcmtmbG93IGFzIGxvbmcgYXMgdGhlIHdvcmtmbG93IGhhcyBub3QgYmVlbiBzYXZlZC4gIFxuICAgIFdvcmtmbG93IE5hbWVzIGFsd2F5cyBlbmQgd2l0aCBhIHRpbWUgc3RhbXAuPC9wPlxuICAgIDxwPjxiPk1vZGVsIFBhdGg8L2I+OiBJZiB5b3UgbW92ZSBvciByZW5hbWUgdGhlIG1vZGVsIG1ha2Ugc3VyZSB0byB1cGRhdGUgdGhpcyBwYXRoLjwvcD5cbiAgICA8cD48Yj5TZXR0aW5nczwvYj46IFRoaXMgaXMgd2hlcmUgeW91IGNhbiBjdXN0b21pemUgdGhlIHNldHRpbmdzIGZvciB5b3VyIHdvcmtmbG93LlxuICAgIElmIHlvdSBuZWVkIHRvIGVkaXQgb3RoZXIgcGFydCBvZiB5b3UgbW9kZWwgY2xpY2sgb24gdGhlIGVkaXQgbW9kZWwgYnV0dG9uLiAgXG4gICAgVGhlIHNldHRpbmdzIGFyZSBvbmx5IGF2YWlsYWJsZSBmb3Igd29ya2Zsb3dzIHRoYXQgaGF2ZSBub3QgYmVlbiBydW4uPC9wPlxuICAgIDxwPjxiPlN0YXR1czwvYj46IFRoaXMgc2VjdGlvbiBkaXNwbGF5cyB0aGUgc3RhdHVzIGFuZCBzdGFydCB0aW1lIG9mIHRoZSBXb3JrZmxvdy4gIElmIHRoZSB3b3JrZmxvdyBoYXNuJ3QgYmVlbiBzYXJ0ZWQgdGhpcyBzZWN0aW9uIGlzIGNsb3NlZC48L3A+XG4gICAgPHA+PGI+UmVzdWx0czwvYj46IFlvdSBtYXkgY2hhbmdlIHRoZSB0aXRsZSwgeC1heGlzIGxhYmVsLCBhbmQgeS1heGlzIGxhYmVsIGJ5IGNsaWNraW5nIG9uIHRoZSBlZGl0IHBsb3QgYnV0dG9uIHRoZW4gZW50ZXIgdGhlIG5hbWUgaW4gdGhlIGNvcnJlY3QgZmllbGQuPC9wPlxuICAgIDxwPjxiPkluZm88L2I+OiBUaGlzIHNlY3Rpb24gZGlzcGxheXMgYW55IHdhcm5pbmdzIGFuZC9vciBlcnJvciB0aGF0IGFyZSBsb2dnZWQgYnkgdGhlIHJ1bm5pbmcgd29ya2Zsb3cuPC9wPlxuICAgIDxwPjxiPk1vZGVsPC9iPjogVGhpcyBzZWN0aW9uIGxldHMgeW91IHZpZXcgdGhlIG1vZGVsIHRoYXQgd2FzIHVzZWQgd2hlbiB5b3UgcmFuIHRoZSB3b3JrZmxvdy48L3A+XG4gIGA7XG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwib3BlcmF0aW9uSW5mb01vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50IGluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPiBXb3JrZmxvdyBNYW5hZ2VyIEhlbHAgPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxwPiAke2VkaXRXb3JrZmxvd01lc3NhZ2V9IDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgIFxufVxuXG5sZXQgV29ya2Zsb3dNYW5hZ2VyID0gUGFnZVZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9d29ya2Zsb3ctbmFtZV0nIDogJ3NldFdvcmtmbG93TmFtZScsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZWRpdC13b3JrZmxvdy1oZWxwXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgbW9kYWwgPSAkKG9wZXJhdGlvbkluZm9Nb2RhbEh0bWwoKSkubW9kYWwoKTtcbiAgICB9LFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBQYWdlVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgdXJsID0gZGVjb2RlVVJJKGRvY3VtZW50LlVSTClcbiAgICB0aGlzLnR5cGUgPSB1cmwuc3BsaXQoJy93b3JrZmxvdy9lZGl0LycpLnBvcCgpLnNwbGl0KCcvJylbMF07XG4gICAgdGhpcy5kaXJlY3RvcnkgPSB1cmwuc3BsaXQoJy93b3JrZmxvdy9lZGl0LycgKyB0aGlzLnR5cGUpLnBvcCgpO1xuICAgIGlmKHRoaXMuZGlyZWN0b3J5LmVuZHNXaXRoKCcubWRsJykpe1xuICAgICAgdmFyIG1vZGVsRmlsZSA9IHRoaXMuZGlyZWN0b3J5LnNwbGl0KCcvJykucG9wKCk7XG4gICAgICB2YXIgbmFtZSA9IG1vZGVsRmlsZS5zcGxpdCgnLicpWzBdO1xuICAgICAgdGhpcy5tb2RlbERpcmVjdG9yeSA9IHRoaXMuZGlyZWN0b3J5O1xuICAgICAgdGhpcy53b3JrZmxvd0RhdGUgPSB0aGlzLmdldEN1cnJlbnREYXRlKCk7XG4gICAgICB0aGlzLndvcmtmbG93TmFtZSA9IG5hbWUgKyB0aGlzLndvcmtmbG93RGF0ZTtcbiAgICAgIHRoaXMuc3RhdHVzID0gJ25ldyc7XG4gICAgfWVsc2V7XG4gICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oXCJzdG9jaHNzL2FwaS93b3JrZmxvdy93b3JrZmxvdy1pbmZvXCIsIHRoaXMuZGlyZWN0b3J5LCBcIi9pbmZvLmpzb25cIik7XG4gICAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSl7XG4gICAgICAgIHZhciByZXNwID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICBzZWxmLm1vZGVsRGlyZWN0b3J5ID0gcmVzcC5tb2RlbC5zcGxpdCgnL2hvbWUvam92eWFuJykucG9wKCk7XG4gICAgICAgIHNlbGYudHlwZSA9IHJlc3AudHlwZTtcbiAgICAgICAgc2VsZi5zdGFydFRpbWUgPSByZXNwLnN0YXJ0X3RpbWU7XG4gICAgICAgIHZhciB3b3JrZmxvd0RpciA9IHNlbGYuZGlyZWN0b3J5LnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgIHNlbGYud29ya2Zsb3dOYW1lID0gd29ya2Zsb3dEaXIuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgdmFyIHN0YXR1c0VuZHBvaW50ID0gcGF0aC5qb2luKFwic3RvY2hzcy9hcGkvd29ya2Zsb3cvd29ya2Zsb3ctc3RhdHVzXCIsIHNlbGYuZGlyZWN0b3J5KTtcbiAgICAgICAgeGhyKHt1cmk6IHN0YXR1c0VuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgICBzZWxmLnN0YXR1cyA9IGJvZHk7XG4gICAgICAgICAgaWYoc2VsZi5zdGF0dXMgPT09ICdjb21wbGV0ZScgfHwgc2VsZi5zdGF0dXMgPT09ICdlcnJvcicpe1xuICAgICAgICAgICAgc2VsZi5tb2RlbERpcmVjdG9yeSA9IHBhdGguam9pbihzZWxmLmRpcmVjdG9yeSwgc2VsZi5tb2RlbERpcmVjdG9yeS5zcGxpdCgnLycpLnBvcCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5yZW5kZXJTdWJ2aWV3cygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgUGFnZVZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKHRoaXMubW9kZWxEaXJlY3Rvcnkpe1xuICAgICAgdGhpcy5yZW5kZXJTdWJ2aWV3cygpXG4gICAgfVxuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgd29ya2Zsb3dFZGl0b3IgPSBuZXcgV29ya2Zsb3dFZGl0b3JWaWV3KHtcbiAgICAgIGRpcmVjdG9yeTogdGhpcy5tb2RlbERpcmVjdG9yeSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICB9KTtcbiAgICB2YXIgaW5wdXROYW1lID0gbmV3IElucHV0Vmlldyh7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgIGxhYmVsOiAnV29ya2Zsb3cgTmFtZTogJyxcbiAgICAgIHRlc3RzOiAnJyxcbiAgICAgIG1vZGVsS2V5OiBudWxsLFxuICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgIHZhbHVlOiB0aGlzLndvcmtmbG93TmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLndvcmtmbG93RWRpdG9yVmlldyA9IHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHdvcmtmbG93RWRpdG9yLCAnd29ya2Zsb3ctZWRpdG9yLWNvbnRhaW5lcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGlucHV0TmFtZSwgJ3dvcmtmbG93LW5hbWUnKTtcbiAgICB0aGlzLnJlbmRlcldvcmtmbG93U3RhdHVzVmlldygpO1xuICAgIHRoaXMudXBkYXRlVHJhamVjdG9yaWVzKCk7XG4gICAgdGhpcy5yZW5kZXJNb2RlbFZpZXdlcigpO1xuICAgIHRoaXMucmVuZGVySW5mb1ZpZXcoKTtcbiAgICBpZih0aGlzLnN0YXR1cyAhPT0gJ25ldycpe1xuICAgICAgdGhpcy5kaXNhYmxlV29ya2Zsb3dOYW1lSW5wdXQoKTtcbiAgICB9XG4gICAgaWYodGhpcy5zdGF0dXMgIT09ICduZXcnICYmIHRoaXMuc3RhdHVzICE9PSAncmVhZHknKXtcbiAgICAgIHdvcmtmbG93RWRpdG9yLmNvbGxhcHNlQ29udGFpbmVyKCk7XG4gICAgfVxuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2V0V29ya2Zsb3dOYW1lOiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIG5ld1dvcmtmbG93TmFtZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIGlmKG5ld1dvcmtmbG93TmFtZS5lbmRzV2l0aCh0aGlzLndvcmtmbG93RGF0ZSkpe1xuICAgICAgdGhpcy53b3JrZmxvd05hbWUgPSBuZXdXb3JrZmxvd05hbWVcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMud29ya2Zsb3dOYW1lID0gbmV3V29ya2Zsb3dOYW1lICsgdGhpcy53b3JrZmxvd0RhdGVcbiAgICAgIGUudGFyZ2V0LnZhbHVlID0gdGhpcy53b3JrZmxvd05hbWVcbiAgICB9XG4gIH0sXG4gIGdldEN1cnJlbnREYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHZhciBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcbiAgICB2YXIgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xuICAgIHZhciBzZWNvbmRzID0gZGF0ZS5nZXRTZWNvbmRzKCk7XG4gICAgcmV0dXJuIFwiX1wiICsgbW9udGggKyBkYXkgKyB5ZWFyICsgXCJfXCIgKyBob3VycyArIG1pbnV0ZXMgKyBzZWNvbmRzO1xuICB9LFxuICBkaXNhYmxlV29ya2Zsb3dOYW1lSW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcIndvcmtmbG93LW5hbWVcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgfSxcbiAgcmVuZGVyV29ya2Zsb3dTdGF0dXNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy53b3JrZmxvd1N0YXR1c1ZpZXcpe1xuICAgICAgdGhpcy53b3JrZmxvd1N0YXR1c1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHZhciBzdGF0dXNWaWV3ID0gbmV3IFdvcmtmbG93U3RhdHVzVmlldyh7XG4gICAgICBzdGFydFRpbWU6IHRoaXMuc3RhcnRUaW1lLFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICB9KTtcbiAgICB0aGlzLndvcmtmbG93U3RhdHVzVmlldyA9IHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHN0YXR1c1ZpZXcsICd3b3JrZmxvdy1zdGF0dXMtY29udGFpbmVyJyk7XG4gIH0sXG4gIGdldFdvcmtmbG93SW5mbzogZnVuY3Rpb24gKGNiKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihcInN0b2Noc3MvYXBpL3dvcmtmbG93L3dvcmtmbG93LWluZm9cIiwgdGhpcy5kaXJlY3RvcnksIFwiL2luZm8uanNvblwiKTtcbiAgICB4aHIoe3VyaTogZW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSl7XG4gICAgICBzZWxmLnN0YXJ0VGltZSA9IEpTT04ucGFyc2UoYm9keSkuc3RhcnRfdGltZTtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG4gIH0sXG4gIGdldFdvcmtmbG93U3RhdHVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzdGF0dXNFbmRwb2ludCA9IHBhdGguam9pbihcInN0b2Noc3MvYXBpL3dvcmtmbG93L3dvcmtmbG93LXN0YXR1c1wiLCB0aGlzLmRpcmVjdG9yeSk7XG4gICAgeGhyKHt1cmk6IHN0YXR1c0VuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgIGlmKHNlbGYuc3RhdHVzICE9PSBib2R5ICl7XG4gICAgICAgIHNlbGYuc3RhdHVzID0gYm9keTtcbiAgICAgICAgc2VsZi5yZW5kZXJXb3JrZmxvd1N0YXR1c1ZpZXcoKTtcbiAgICAgIH1cbiAgICAgIGlmKHNlbGYuc3RhdHVzICE9PSAnZXJyb3InICYmIHNlbGYuc3RhdHVzICE9PSAnY29tcGxldGUnKXtcbiAgICAgICAgc2V0VGltZW91dChfLmJpbmQoc2VsZi5nZXRXb3JrZmxvd1N0YXR1cywgc2VsZiksIDEwMDApO1xuICAgICAgfWVsc2UgaWYoc2VsZi5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgc2VsZi5yZW5kZXJSZXN1bHRzVmlldygpO1xuICAgICAgICBzZWxmLnJlbmRlck1vZGVsVmlld2VyKCk7XG4gICAgICAgIHNlbGYucmVuZGVySW5mb1ZpZXcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlV29ya2Zsb3dTdGF0dXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7ICBcbiAgICAgIHNlbGYuZ2V0V29ya2Zsb3dJbmZvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5nZXRXb3JrZmxvd1N0YXR1cygpO1xuICAgICAgfSk7XG4gICAgfSwgMzAwMCk7XG4gIH0sXG4gIHJlbmRlclJlc3VsdHNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy53b3JrZmxvd1Jlc3VsdHNWaWV3KXtcbiAgICAgIHRoaXMud29ya2Zsb3dSZXN1bHRzVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdHNWaWV3ID0gbmV3IFdvcmtmbG93UmVzdWx0c1ZpZXcoe1xuICAgICAgdHJhamVjdG9yaWVzOiB0aGlzLnRyYWplY3RvcmllcyxcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXNcbiAgICB9KTtcbiAgICB0aGlzLndvcmtmbG93UmVzdWx0c1ZpZXcgPSB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhyZXN1bHRzVmlldywgJ3dvcmtmbG93LXJlc3VsdHMtY29udGFpbmVyJyk7XG4gIH0sXG4gIHJlbmRlck1vZGVsVmlld2VyOiBmdW5jdGlvbiAoKXtcbiAgICBpZih0aGlzLm1vZGVsVmlld2VyKXtcbiAgICAgIHRoaXMubW9kZWxWaWV3ZXIucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMubW9kZWxWaWV3ZXIgPSBuZXcgTW9kZWxWaWV3ZXIoe1xuICAgICAgZGlyZWN0b3J5OiB0aGlzLm1vZGVsRGlyZWN0b3J5LFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1c1xuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMubW9kZWxWaWV3ZXIsICdtb2RlbC12aWV3ZXItY29udGFpbmVyJylcbiAgfSxcbiAgcmVuZGVySW5mb1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLmluZm9WaWV3KXtcbiAgICAgIHRoaXMuaW5mb1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMuaW5mb1ZpZXcgPSBuZXcgSW5mb1ZpZXcoe1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIGxvZ3NQYXRoOiBwYXRoLmpvaW4odGhpcy5kaXJlY3RvcnksIFwibG9ncy50eHRcIilcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0aGlzLmluZm9WaWV3LCAnd29ya2Zsb3ctaW5mby1jb250YWluZXInKVxuICB9LFxuICB1cGRhdGVUcmFqZWN0b3JpZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZih0aGlzLnRyYWplY3RvcmllcyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnVwZGF0ZVRyYWplY3RvcmllcygpXG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHRoaXMudHJhamVjdG9yaWVzID0gdGhpcy53b3JrZmxvd0VkaXRvclZpZXcubW9kZWwuc2ltdWxhdGlvblNldHRpbmdzLmFsZ29yaXRobSAhPT0gXCJPREVcIiA/IHRoaXMudHJhamVjdG9yaWVzIDogMVxuICAgICAgdGhpcy5yZW5kZXJSZXN1bHRzVmlldygpXG4gICAgfVxuICB9LFxufSk7XG5cbmluaXRQYWdlKFdvcmtmbG93TWFuYWdlcik7XG4iLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VWYXJpYWJsZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJ2aWV3LWV2ZW50LWFzc2lnbm1lbnRzLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwiZXZlbnRzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXZlbnRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1ldmVudHMtdmlld2VyXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93IGNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1tb2RlbC1ldmVudHMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRGVsYXlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VQcmlvcml0eVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVRyaWdnZ2VyXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFQXNzaWdubWVudHNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VVc2UgVmFsdWVzIEZyb21cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJ2aWV3LWV2ZW50cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwibW9kZWwtc2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VNb2RlbCBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtbW9kZWwtc2V0dGluZ3Mtdmlld2VyXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93IGNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1tb2RlbC1zZXR0aW5ncy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUVuZCBTaW11bGF0aW9uXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVGltZSBTdGVwc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVZvbHVtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuZW5kU2ltKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudGltZVN0ZXApID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC52b2x1bWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwibW9kZWwtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VNb2RlbFxcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtbW9kZWxcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtbW9kZWxcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLW1vZGVsXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNVxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3BlY2llcy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicGFyYW1ldGVycy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVhY3Rpb25zLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJldmVudHMtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJ1bGVzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic2ltdWxhdGlvbi1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicGFyYW1ldGVycy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBhcmFtZXRlcnNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXBhcmFtZXRlcnNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtcGFyYW1ldGVyc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTktdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRXhwcmVzc2lvblxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcInBhcmFtZXRlci1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJlYWN0aW9ucy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlYWN0aW9uc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVhY3Rpb25zXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJlYWN0aW9uc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3VtbWFyeVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtNi12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSYXRlXFx1MDAyRlByb3BlbnNpdHlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJ1bGVzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUnVsZXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJ1bGVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJ1bGVzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUeXBlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVZhcmlhYmxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJydWxlcy1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNpbXVsYXRpb24tc2V0dGluZ3NcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNpbXVsYXRpb24gU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXNldHRpbmdzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNldHRpbmdzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIiBjb2xzcGFuPVxcXCI1XFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU2ltdWxhdGlvbiBBbGdvcml0aG1cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbGdvcml0aG0sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic2ltQWxnb3JpdGhtXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1vZGVcXFwiIGRhdGEtbmFtZT1cXFwiT0RFXFxcIlxcdTAwM0UgT0RFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LXNzYVxcXCIgZGF0YS1uYW1lPVxcXCJTU0FcXFwiXFx1MDAzRSBTU0FcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNpbUFsZ29yaXRobVxcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3QtdGF1LWxlYXBpbmdcXFwiIGRhdGEtbmFtZT1cXFwiVGF1LUxlYXBpbmdcXFwiXFx1MDAzRSBUYXUgTGVhcGluZ1xcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic2ltQWxnb3JpdGhtXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1oeWJyaWQtdGF1XFxcIiBkYXRhLW5hbWU9XFxcIkh5YnJpZC1UYXUtTGVhcGluZ1xcXCJcXHUwMDNFIEh5YnJpZCBPREVcXHUwMDJGU1NBXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IGNsYXNzPVxcXCJpbmxpbmVcXFwiIHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LWF1dG9tYXRpY1xcXCIgZGF0YS1uYW1lPVxcXCJBdXRvbWF0aWNcXFwiXFx1MDAzRSBDaG9vc2UgZm9yIG1lXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuY2hvb3NlRm9yTWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNVxcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRURldGVybWluaXN0aWMgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUmVsYXRpdmUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMucnRvbCwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFIFxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBYnNvbHV0ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hdG9sLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVsYXRpdmUtdG9sZXJhbmNlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiYWJzb2x1dGUtdG9sZXJhbmNlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC03XFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RvY2hhc3RpYyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJlYWxpemF0aW9ucywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNlZWRcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5zZWVkLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFVGF1IFRvbGVyYW5jZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnR0b2wsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzZWVkXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGF1LXRvbGVyYW5jZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTaW11bGF0aW9uIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zZXR0aW5ncy12aWV3ZXJcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3cgY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNldHRpbmdzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEyXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMC43NXJlbTtcXFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuYWxnb3JpdGhtKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IGNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImRldGVybWluaXN0aWNcXFwiXFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VEZXRlcm1pbmlzdGljIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZWxhdGl2ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VBYnNvbHV0ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnJlbGF0aXZlVG9sKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuYWJzb2x1dGVUb2wpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNiBjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJzdG9jaGFzdGljXFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RvY2hhc3RpYyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiU1NBXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOdW1iZXIgb2YgVHJhamVjdG9yaWVzXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU2VlZFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucmVhbGl6YXRpb25zKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuc2VlZCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcIlRhdVxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTnVtYmVyIG9mIFRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVNlZWRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUYXUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5yZWFsaXphdGlvbnMpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5zZWVkKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudGF1VG9sKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNwZWNpZXMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTcGVjaWVzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zcGVjaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNwZWNpZXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUluaXRpYWwgQ29uZGl0aW9uXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1vZGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3dpdGNoIFRvbGVyYW5jZVxcdTAwMkZNaW5pbXVtIFZhbHVlIGZvciBTd2l0Y2hpbmdcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJzcGVjaWUtbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnZhcmlhYmxlLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5leHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuZGVsYXkpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wcmlvcml0eSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IFwiRXhwcmVzc2lvbjogXCIgKyB0aGlzLm1vZGVsLnRyaWdnZXJFeHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNoZWNrYm94XFxcIiBmb3I9XFxcImluaXRpYWwtdmFsdWVcXFwiXFx1MDAzRUluaXRpYWwgVmFsdWU6IFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGlkPVxcXCJpbml0aWFsLXZhbHVlXFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50LXRyaWdnZXItaW5pdC12YWx1ZVxcXCIgZGlzYWJsZWRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2hlY2tib3hcXFwiIGZvcj1cXFwicGVyc2lzdGVudFxcXCJcXHUwMDNFUGVyc2lzdGVudDogXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgaWQ9XFxcInBlcnNpc3RlbnRcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtdHJpZ2dlci1wZXJzaXN0ZW50XFxcIiBkaXNhYmxlZFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiYXNzaWdubWVudC12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCIgZm9yPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiXFx1MDAzRVRyZ2dpZXIgVGltZVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIGlkPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiIG5hbWU9XFxcInVzZS12YWx1ZXMtZnJvbVxcXCIgZGF0YS1ob29rPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiIGRpc2FibGVkXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIiBmb3I9XFxcImFzc2lnbm1lbnQtdGltZVxcXCJcXHUwMDNFQXNzaWdubWVudCBUaW1lXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgaWQ9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgbmFtZT1cXFwidXNlLXZhbHVlcy1mcm9tXFxcIiBkYXRhLWhvb2s9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgZGlzYWJsZWRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5leHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdW1tYXJ5XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnJhdGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC50eXBlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudmFyaWFibGUubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLmV4cHJlc3Npb24pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC52YWx1ZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm1vZGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5zd2l0Y2hpbmdWYWxXaXRoTGFiZWwpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1uYW1lLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInNpbS1zZXR0aW5ncy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1zdGF0ZS1idXR0b25zLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LWluZm8tdmlld1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFSW5mb1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtaW5mb1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCIgZGlzYWJsZWRcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2UtaW5mb1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1pbmZvXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN0YXRpc3RpY3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXdhcm5pbmdzXFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFV2FybmluZ3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJsaXN0LW9mLXdhcm5pbmdzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1lcnJvcnNcXFwiXFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VFcnJvcnNcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJsaXN0LW9mLWVycm9yc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LXJlc3VsdHNcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlc3VsdHNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctcmVzdWx0c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1wbG90LWFyZ3NcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVRpdGxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWC1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWS1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInRpdGxlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieGF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ5YXhpc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQbG90IFRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXRyYWplY3Rvcmllc1xcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJwbG90XFxcIlxcdTAwM0VFZGl0IFBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcG5nLWN1c3RvbVxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgUE5HXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwidHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT05cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwid29ya2Zsb3ctcmVzdWx0c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUmVzdWx0c1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVzdWx0c1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCIgZGlzYWJsZWRcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2UtcmVzdWx0c1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1yZXN1bHRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJlZGl0LXBsb3QtYXJnc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVGl0bGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VYLWF4aXMgTGFiZWxcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VZLWF4aXMgTGFiZWxcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGl0bGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ4YXhpc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInlheGlzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBsb3QgU3RhbmRhcmQgRGV2aWF0aW9uIFJhbmdlXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zdGRkZXZyYW5nZVxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZS1zdGRkZXZyYW5nZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1zdGRkZXZyYW5nZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN0ZGRldnJhblxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwic3RkZGV2cmFuXFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRUVkaXQgUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInN0ZGRldnJhblxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJzdGRkZXZyYW5cXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtanNvblxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgSlNPTlxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBsb3QgVHJhamVjdG9yaWVzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJwbG90XFxcIlxcdTAwM0VQbG90XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInBsb3QtbXVsdGlwbGVcXFwiIGRpc2FibGVkXFx1MDAzRU11bHRpcGxlIFBsb3RzXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwidHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLXBuZy1jdXN0b21cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIFBOR1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBTdGFuZGFyZCBEZXZpYXRpb25cXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXN0ZGRldlxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZS1zdGRkZXZcXFwiXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXN0ZGRldlxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN0ZGRldlxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwic3RkZGV2XFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRVBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJzdGRkZXZcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcG5nLWN1c3RvbVxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgUE5HXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBpZD1cXFwic3RkZGV2XFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT05cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQbG90IFRyYWplY3RvcnkgTWVhblxcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtdHJham1lYW5cXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtdHJham1lYW5cXFwiXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXRyYWptZWFuXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiYXZnXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJhdmdcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgaWQ9XFxcImF2Z1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGlkPVxcXCJhdmdcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtanNvblxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgSlNPTlxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGRhdGEtaG9vaz1cXFwic2F2ZVxcXCJcXHUwMDNFU2F2ZVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcIm1kbC1lZGl0LWJ0biBzYXZpbmctc3RhdHVzXFxcIiBkYXRhLWhvb2s9XFxcInNhdmluZy13b3JrZmxvd1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwic3Bpbm5lci1ncm93XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VTYXZpbmcuLi5cXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuIHNhdmVkLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJzYXZlZC13b3JrZmxvd1xcXCJcXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFU2F2ZWRcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInN0YXJ0LXdvcmtmbG93XFxcIlxcdTAwM0VTdGFydCBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgZGF0YS1ob29rPVxcXCJlZGl0LW1vZGVsXFxcIlxcdTAwM0VFZGl0IE1vZGVsXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LXN0YXR1c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RhdHVzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zdGF0dXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1zdGF0dXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRURhdGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdGF0dXNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnN0YXJ0VGltZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnN0YXR1cykgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInN0b3Atd29ya2Zsb3dcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgZGlzYWJsZWRcXHUwMDNFU3RvcCBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJlc3RhcnQtd29ya2Zsb3dcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgZGlzYWJsZWRcXHUwMDNFUmVzdGFydCBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NlY3Rpb24gY2xhc3M9XFxcInBhZ2UgY29sLW1kLTEwXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NoMlxcdTAwM0VXb3JrZmxvdyBNYW5hZ2VyXFx1MDAzQ1xcdTAwMkZoMlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gaW5mb3JtYXRpb24tYnRuIGhlbHBcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC13b3JrZmxvdy1oZWxwXFxcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXJcXFwiIGRhdGEtaWNvbj1cXFwicXVlc3Rpb24tY2lyY2xlXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtcXVlc3Rpb24tY2lyY2xlIGZhLXctMTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgNTEyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjU2IDhDMTE5LjA0MyA4IDggMTE5LjA4MyA4IDI1NmMwIDEzNi45OTcgMTExLjA0MyAyNDggMjQ4IDI0OHMyNDgtMTExLjAwMyAyNDgtMjQ4QzUwNCAxMTkuMDgzIDM5Mi45NTcgOCAyNTYgOHptMCA0NDhjLTExMC41MzIgMC0yMDAtODkuNDMxLTIwMC0yMDAgMC0xMTAuNDk1IDg5LjQ3Mi0yMDAgMjAwLTIwMCAxMTAuNDkxIDAgMjAwIDg5LjQ3MSAyMDAgMjAwIDAgMTEwLjUzLTg5LjQzMSAyMDAtMjAwIDIwMHptMTA3LjI0NC0yNTUuMmMwIDY3LjA1Mi03Mi40MjEgNjguMDg0LTcyLjQyMSA5Mi44NjNWMzAwYzAgNi42MjctNS4zNzMgMTItMTIgMTJoLTQ1LjY0N2MtNi42MjcgMC0xMi01LjM3My0xMi0xMnYtOC42NTljMC0zNS43NDUgMjcuMS01MC4wMzQgNDcuNTc5LTYxLjUxNiAxNy41NjEtOS44NDUgMjguMzI0LTE2LjU0MSAyOC4zMjQtMjkuNTc5IDAtMTcuMjQ2LTIxLjk5OS0yOC42OTMtMzkuNzg0LTI4LjY5My0yMy4xODkgMC0zMy44OTQgMTAuOTc3LTQ4Ljk0MiAyOS45NjktNC4wNTcgNS4xMi0xMS40NiA2LjA3MS0xNi42NjYgMi4xMjRsLTI3LjgyNC0yMS4wOThjLTUuMTA3LTMuODcyLTYuMjUxLTExLjA2Ni0yLjY0NC0xNi4zNjNDMTg0Ljg0NiAxMzEuNDkxIDIxNC45NCAxMTIgMjYxLjc5NCAxMTJjNDkuMDcxIDAgMTAxLjQ1IDM4LjMwNCAxMDEuNDUgODguOHpNMjk4IDM2OGMwIDIzLjE1OS0xOC44NDEgNDItNDIgNDJzLTQyLTE4Ljg0MS00Mi00MiAxOC44NDEtNDIgNDItNDIgNDIgMTguODQxIDQyIDQyelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRSBcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctbmFtZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1zdGF0dXMtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctcmVzdWx0cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1pbmZvLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1vZGVsLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJjb21wdXRhdGlvbmFsLXJlc291cmNlcy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc2VjdGlvblxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3QXNzaWdubWVudHMgPSByZXF1aXJlKCcuL3ZpZXctZXZlbnQtYXNzaWdubWVudHMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRBc3NpZ25tZW50c1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3QXNzaWdubWVudHMsICd2aWV3LWV2ZW50LWFzc2lnbm1lbnRzLWxpc3QnKTtcbiAgfSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3RXZlbnQgPSByZXF1aXJlKCcuL3ZpZXctZXZlbnRzJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50c1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbiwgVmlld0V2ZW50LCB0aGlzLnF1ZXJ5QnlIb29rKCd2aWV3LWV2ZW50cy1jb250YWluZXInKSlcbiAgfSxcbiAgY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL21vZGVsU2V0dGluZ3NWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICBjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBTcGVjaWVzVmlld2VyID0gcmVxdWlyZSgnLi9zcGVjaWVzLXZpZXdlcicpO1xudmFyIFBhcmFtZXRlcnNWaWV3ZXIgPSByZXF1aXJlKCcuL3BhcmFtZXRlcnMtdmlld2VyJyk7XG52YXIgUmVhY3Rpb25zVmlld2VyID0gcmVxdWlyZSgnLi9yZWFjdGlvbnMtdmlld2VyJyk7XG52YXIgRXZlbnRzVmlld2VyID0gcmVxdWlyZSgnLi9ldmVudHMtdmlld2VyJyk7XG52YXIgUnVsZXNWaWV3ZXIgPSByZXF1aXJlKCcuL3J1bGVzLXZpZXdlcicpO1xudmFyIE1vZGVsU2V0dGluZ3NWaWV3ZXIgPSByZXF1aXJlKCcuL21vZGVsLXNldHRpbmdzLXZpZXdlcicpO1xudmFyIFNpbXVsYXRpb25TZXR0aW5nc1ZpZXdlciA9IHJlcXVpcmUoJy4vc2ltdWxhdGlvbi1zZXR0aW5ncy12aWV3ZXInKTtcbi8vbW9kZWxzXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvbW9kZWwnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLW1vZGVsXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc3RhdHVzID0gYXR0cnMuc3RhdHVzO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlyZWN0b3J5ID0gYXR0cnMuZGlyZWN0b3J5XG4gICAgdmFyIG1vZGVsRmlsZSA9IGRpcmVjdG9yeS5zcGxpdCgnLycpLnBvcCgpO1xuICAgIHZhciBuYW1lID0gbW9kZWxGaWxlLnNwbGl0KCcuJylbMF07XG4gICAgdmFyIGlzU3BhdGlhbCA9IG1vZGVsRmlsZS5zcGxpdCgnLicpLnBvcCgpLnN0YXJ0c1dpdGgoJ3MnKTtcbiAgICB0aGlzLm1vZGVsID0gbmV3IE1vZGVsKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBkaXJlY3Rvcnk6IGRpcmVjdG9yeSxcbiAgICAgIGlzX3NwYXRpYWw6IGlzU3BhdGlhbFxuICAgIH0pO1xuICAgIHRoaXMubW9kZWwuZmV0Y2goe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICBzZWxmLnJlbmRlclN1YnZpZXdzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlclN1YnZpZXdzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNwZWNpZXNWaWV3ZXIgPSBuZXcgU3BlY2llc1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnNwZWNpZXMsXG4gICAgfSk7XG4gICAgdmFyIHBhcmFtZXRlcnNWaWV3ZXIgPSBuZXcgUGFyYW1ldGVyc1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnBhcmFtZXRlcnMsXG4gICAgfSk7XG4gICAgdmFyIHJlYWN0aW9uc1ZpZXdlciA9IG5ldyBSZWFjdGlvbnNWaWV3ZXIoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5yZWFjdGlvbnMsXG4gICAgfSk7XG4gICAgdmFyIGV2ZW50c1ZpZXdlciA9IG5ldyBFdmVudHNWaWV3ZXIoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5ldmVudHNDb2xsZWN0aW9uLFxuICAgIH0pO1xuICAgIHZhciBydWxlc1ZpZXdlciA9IG5ldyBSdWxlc1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnJ1bGVzLFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyU2ltdWxhdGlvblNldHRpbmdzVmlldygpO1xuICAgIHZhciBtb2RlbFNldHRpbmdzVmlld2VyID0gbmV3IE1vZGVsU2V0dGluZ3NWaWV3ZXIoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwubW9kZWxTZXR0aW5ncyxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzcGVjaWVzVmlld2VyLCBcInNwZWNpZXMtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhwYXJhbWV0ZXJzVmlld2VyLCBcInBhcmFtZXRlcnMtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhyZWFjdGlvbnNWaWV3ZXIsIFwicmVhY3Rpb25zLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoZXZlbnRzVmlld2VyLCBcImV2ZW50cy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJ1bGVzVmlld2VyLCBcInJ1bGVzLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcobW9kZWxTZXR0aW5nc1ZpZXdlciwgXCJtb2RlbC1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIGlmKHRoaXMuc3RhdHVzID09PSAnY29tcGxldGUnKXtcbiAgICAgIHRoaXMuZW5hYmxlQ29sbGFwc2VCdXR0b24oKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlclNpbXVsYXRpb25TZXR0aW5nc1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLnNpbXVsYXRpb25TZXR0aW5nc1ZpZXcpe1xuICAgICAgdGhpcy5zaW11bGF0aW9uU2V0dGluZ3NWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLnNpbXVsYXRpb25TZXR0aW5nc1ZpZXcgPSBuZXcgU2ltdWxhdGlvblNldHRpbmdzVmlld2VyKHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncyxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0aGlzLnNpbXVsYXRpb25TZXR0aW5nc1ZpZXcsIFwic2ltdWxhdGlvbi1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXCIpO1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UtbW9kZWwnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UtbW9kZWwnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZS1tb2RlbCcpKS50ZXh0KCcrJyk7XG4gIH0sXG4gIGVuYWJsZUNvbGxhcHNlQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZS1tb2RlbCcpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgVmlld1BhcmFtZXRlciA9IHJlcXVpcmUoJy4vdmlldy1wYXJhbWV0ZXInKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdQYXJhbWV0ZXIsIHRoaXMucXVlcnlCeUhvb2soJ3BhcmFtZXRlci1saXN0JykpXG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgVmlld1JlYWN0aW9ucyA9IHJlcXVpcmUoJy4vdmlldy1yZWFjdGlvbnMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbiwgVmlld1JlYWN0aW9ucywgdGhpcy5xdWVyeUJ5SG9vaygncmVhY3Rpb24tbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdSdWxlcyA9IHJlcXVpcmUoJy4vdmlldy1ydWxlcycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ydWxlc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdSdWxlcywgdGhpcy5xdWVyeUJ5SG9vaygncnVsZXMtbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5hbGdvcml0aG0gPSB0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIiA/XG4gICAgICBcIkFsZ29yaXRobTogSHlicmlkIE9ERS9TU0FcIiA6IFwiQWxnb3JpdGhtOiBcIiArIHRoaXMubW9kZWwuYWxnb3JpdGhtXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBhbGdvcml0aG0gPSB0aGlzLm1vZGVsLmFsZ29yaXRobVxuICAgIGlmKGFsZ29yaXRobSA9PT0gXCJPREVcIiB8fCBhbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCIpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdkZXRlcm1pbmlzdGljJykpLmNvbGxhcHNlKCdzaG93JylcbiAgICB9XG4gICAgaWYoYWxnb3JpdGhtID09PSBcIlNTQVwiIHx8IGFsZ29yaXRobSA9PT0gXCJUYXUtTGVhcGluZ1wiIHx8IGFsZ29yaXRobSA9PT0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N0b2NoYXN0aWMnKSkuY29sbGFwc2UoJ3Nob3cnKVxuICAgICAgaWYoYWxnb3JpdGhtID09PSBcIlNTQVwiKXtcbiAgICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdTU0EnKSkuY29sbGFwc2UoJ3Nob3cnKVxuICAgICAgfWVsc2V7XG4gICAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnVGF1JykpLmNvbGxhcHNlKCdzaG93JylcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGNoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3NpbXVsYXRpb25TZXR0aW5ncy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LW9kZV0nIDogJ2hhbmRsZVNlbGVjdFNpbXVsYXRpb25BbGdvcml0aG1DbGljaycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNlbGVjdC1zc2FdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtdGF1LWxlYXBpbmddJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtaHlicmlkLXRhdV0nIDogJ2hhbmRsZVNlbGVjdFNpbXVsYXRpb25BbGdvcml0aG1DbGljaycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNlbGVjdC1hdXRvbWF0aWNdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5tb2RlbCA9IGF0dHJzLm1vZGVsO1xuICAgIHRoaXMudG9vbHRpcHMgPSB7XCJydG9sXCI6XCJSZWxhdGl2ZSB0b2xlcmFuY2UgZm9yIG9kZSBzb2x1dGlvbnMsIGNvbnRyb2xzIGEgcmVsYXRpdmUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhY2N1cmFjeSAobnVtYmVyIG9mIGNvcnJlY3QgZGlnaXRzKS4gIFRoZSBzb2x2ZXIga2VlcHMgdGhlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibG9jYWwgZXJyb3IgZXN0aW1hdGVzIGxlc3MgdGhhbiBhdG9sICsgcnRvbCAqIGFicyh5KS4gIFZhbHVlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibXVzdCBiZSBncmVhdGVyIHRoYW4gMC4wLlwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJhdG9sXCI6XCJBYnNvbHV0ZSB0b2xlcmFuY2UgZm9yIG9kZSBzb2x1dGlvbnMsIGlmIGEgY29tcG9uZW50IG9mIHkgaXMgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcHByb3hpbWF0ZWx5IGJlbG93IGF0b2wsIHRoZSBlcnJvciBvbmx5IG5lZWRzIHRvIGZhbGwgd2l0aGluIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGhlIHNhbWUgYXRvbCB0aHJlc2hvbGQsIGFuZCB0aGUgbnVtYmVyIG9mIGNvcnJlY3QgZGlnaXRzIGlzIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm90IGd1YXJhbnRlZWQuICBUaGUgc29sdmVyIGtlZXBzIHRoZSBsb2NhbCBlcnJvciBlc3RpbWF0ZXMgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsZXNzIHRoYW4gYXRvbCArIHJ0b2wgKiBhYnMoeSkuICBWYWx1ZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwLjAuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInR0b2xcIjpcIkEgcmVsYXRpdmUgZXJyb3IgdG9sZXJhbmNlIHZhbHVlIGdvdmVybmluZyB0YXUtbGVhcGluZyB0YXUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zLiAgQmFzZWQgb24gQ2FvLCBZLjsgR2lsbGVzcGllLCBELiBULjsgUGV0em9sZCwgTC4gUi4gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIoMjAwNikuICdFZmZpY2llbnQgc3RlcCBzaXplIHNlbGVjdGlvbiBmb3IgdGhlIHRhdS1sZWFwaW5nIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2ltdWxhdGlvbiBtZXRob2QnIChQREYpLiBUaGUgSm91cm5hbCBvZiBDaGVtaWNhbCBQaHlzaWNzLiAxMjQgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIoNCk6IDA0NDEwOS4gQmliY29kZToyMDA2SkNoUGguMTI0ZDQxMDlDLiBkb2k6MTAuMTA2My8xLjIxNTk0NjguIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiUE1JRCAxNjQ2MDE1MSAgVmFsdWUgbXVzdCBiZSBiZXR3ZWVuIDAuMCBhbmQgMS4wLlwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJzZWVkXCI6XCJUaGUgc2VlZCBmb3IgdGhlIHNpbXVsYXRpb24uICBTZXQgdG8gLTEgZm9yIGEgcmFuZG9tIHNlZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInJlYWxpemF0aW9uc1wiOlwiVGhlIG51bWJlciBvZiB0aW1lcyB0byBzYW1wbGUgdGhlIGNoZW1pY2FsIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWFzdGVyIGVxdWF0aW9uLiBFYWNoIHRyYWplY3Rvcnkgd2lsbCBiZSByZXR1cm5lZCBhdCB0aGUgZW5kIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib2YgdGhlIHNpbXVsYXRpb24uXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImFsZ29yaXRobVwiOlwiVGhlIHNvbHZlciBieSB3aGljaCB0byBzaW11bGF0ZSB0aGUgbW9kZWwuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImNob29zZUZvck1lXCI6XCJIeWJyaWQgd2lsbCBiZSBjaG9zZW4gYmFzZWQgb24gRXZlbnQsIFJ1bGVzLCBhbmQgb3RoZXIgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTQk1MIG1vZGVsIGNvbXBvbmVudHMgb3IgaWYgdGhlIG1vZGVsIGlzIHJlcHJlc2VudGVkIGFzIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29uY2VudHJhdGlvbi4gIFRhdSBMZWFwaW5nIHdpbGwgYmUgY2hvc2VuIGlmIHRoZSBUYXUgVG9sZXJhbmNlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXMgY2hhbmdlZCB0byBhIHZhbHVlIG90aGVyIHRoYW4gMC4wMy4gIFNTQSB3aWxsIGJlIGNob3NlbiBpZiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRoZSBtb2RlbCBpcyByZXByZXNlbnRlZCBhcyBQb3B1bGF0aW9uLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYoIXRoaXMubW9kZWwuaXNBdXRvbWF0aWMpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3Qtb2RlJykpLnByb3AoJ2NoZWNrZWQnLCBCb29sZWFuKHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIk9ERVwiKSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1zc2EnKSkucHJvcCgnY2hlY2tlZCcsIEJvb2xlYW4odGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiU1NBXCIpKTsgXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC10YXUtbGVhcGluZycpKS5wcm9wKCdjaGVja2VkJywgQm9vbGVhbih0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJUYXUtTGVhcGluZ1wiKSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1oeWJyaWQtdGF1JykpLnByb3AoJ2NoZWNrZWQnLCBCb29sZWFuKHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIkh5YnJpZC1UYXUtTGVhcGluZ1wiKSk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1hdXRvbWF0aWMnKSkucHJvcCgnY2hlY2tlZCcsIHRoaXMubW9kZWwuaXNBdXRvbWF0aWMpO1xuICAgICAgdGhpcy5tb2RlbC5sZXRVc0Nob29zZUZvcllvdSgpO1xuICAgIH1cbiAgICB0aGlzLmRpc2FibGVJbnB1dEZpZWxkQnlBbGdvcml0aG0oKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoZSkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpXG4gIH0sXG4gIGhhbmRsZVNlbGVjdFNpbXVsYXRpb25BbGdvcml0aG1DbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdmFsdWUgPSBlLnRhcmdldC5kYXRhc2V0Lm5hbWU7XG4gICAgdGhpcy5zZXRTaW11bGF0aW9uQWxnb3JpdGhtKHZhbHVlKVxuICB9LFxuICBzZXRTaW11bGF0aW9uQWxnb3JpdGhtOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLm1vZGVsLmlzQXV0b21hdGljID0gQm9vbGVhbih2YWx1ZSA9PT0gJ0F1dG9tYXRpYycpXG4gICAgaWYoIXRoaXMubW9kZWwuaXNBdXRvbWF0aWMpe1xuICAgICAgdGhpcy5tb2RlbC5hbGdvcml0aG0gPSB2YWx1ZTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMubW9kZWwubGV0VXNDaG9vc2VGb3JZb3UoKTtcbiAgICB9XG4gICAgdGhpcy5kaXNhYmxlSW5wdXRGaWVsZEJ5QWxnb3JpdGhtKCk7XG4gIH0sXG4gIGRpc2FibGVJbnB1dEZpZWxkQnlBbGdvcml0aG06IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXNBdXRvbWF0aWMgPSB0aGlzLm1vZGVsLmlzQXV0b21hdGljXG4gICAgdmFyIGlzT0RFID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiT0RFXCI7XG4gICAgdmFyIGlzU1NBID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiU1NBXCI7XG4gICAgdmFyIGlzTGVhcGluZyA9IHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIlRhdS1MZWFwaW5nXCI7XG4gICAgdmFyIGlzSHlicmlkID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCI7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwicmVsYXRpdmUtdG9sZXJhbmNlXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgIShpc09ERSB8fCBpc0h5YnJpZCB8fCBpc0F1dG9tYXRpYykpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcImFic29sdXRlLXRvbGVyYW5jZVwiKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsICEoaXNPREUgfHwgaXNIeWJyaWQgfHwgaXNBdXRvbWF0aWMpKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJ0cmFqZWN0b3JpZXNcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzU1NBIHx8IGlzTGVhcGluZyB8fCBpc0h5YnJpZCB8fCBpc0F1dG9tYXRpYykpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcInNlZWRcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzU1NBIHx8IGlzTGVhcGluZyB8fCBpc0h5YnJpZCB8fCBpc0F1dG9tYXRpYykpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcInRhdS10b2xlcmFuY2VcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzSHlicmlkIHx8IGlzTGVhcGluZyB8fCBpc0F1dG9tYXRpYykpO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0UmVsYXRpdmVUb2xlcmFuY2U6IHtcbiAgICAgIGhvb2s6ICdyZWxhdGl2ZS10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdyZWxhdGl2ZS10b2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3JlbGF0aXZlVG9sJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnJlbGF0aXZlVG9sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0QWJzb2x1dGVUb2xlcmFuY2U6IHtcbiAgICAgIGhvb2s6ICdhYnNvbHV0ZS10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdhYnNvbHV0ZS10b2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ2Fic29sdXRlVG9sJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmFic29sdXRlVG9sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5wdXRSZWFsaXphdGlvbnM6IHtcbiAgICAgIGhvb2s6ICd0cmFqZWN0b3JpZXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdyZWFsaXphdGlvbnMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3JlYWxpemF0aW9ucycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wYXJlbnQuaXNQcmV2aWV3ID8gMSA6IHRoaXMubW9kZWwucmVhbGl6YXRpb25zXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0U2VlZDoge1xuICAgICAgaG9vazogJ3NlZWQnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnc2VlZCcsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ3NlZWQnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuc2VlZFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFRhdVRvbGVyYW5jZToge1xuICAgICAgaG9vazogJ3RhdS10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcgKHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ1RhdS1Ub2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3RhdVRvbCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC50YXVUb2xcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdTcGVjaWUgPSByZXF1aXJlKCcuL3ZpZXctc3BlY2llJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3NwZWNpZXNWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3U3BlY2llLCB0aGlzLnF1ZXJ5QnlIb29rKCdzcGVjaWUtbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdFdmVudEFzc2lnbm1lbnRzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIEFzc2lnbm1lbnRzVmlld2VyID0gcmVxdWlyZSgnLi9ldmVudC1hc3NpZ25tZW50cy12aWV3ZXInKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld0V2ZW50cy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaW5pdGlhbFZhbHVlJzoge1xuICAgICAgaG9vazogJ2V2ZW50LXRyaWdnZXItaW5pdC12YWx1ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY2hlY2tlZCcsXG4gICAgfSxcbiAgICAnbW9kZWwucGVyc2lzdGVudCc6IHtcbiAgICAgIGhvb2s6ICdldmVudC10cmlnZ2VyLXBlcnNpc3RlbnQnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2NoZWNrZWQnLFxuICAgIH0sXG4gICAgJ21vZGVsLnVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZSc6IHtcbiAgICAgIGhvb2s6ICd1c2UtdmFsdWVzLWZyb20tdHJpZ2dlci10aW1lJyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjaGVja2VkJyxcbiAgICB9LFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5kZWxheSA9IHRoaXMubW9kZWwuZGVsYXkgPT09IFwiXCIgPyBcIk5vbmVcIiA6IHRoaXMubW9kZWwuZGVsYXlcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIGFzc2lnbm1lbnRzVmlld2VyID0gbmV3IEFzc2lnbm1lbnRzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuZXZlbnRBc3NpZ25tZW50c1xuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGFzc2lnbm1lbnRzVmlld2VyLCAnYXNzaWdubWVudC12aWV3ZXInKTtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1BhcmFtZXRlcnMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG59KTsiLCJ2YXIga2F0ZXggPSByZXF1aXJlKCdrYXRleCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3UmVhY3Rpb25zLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yYXRlID0gdGhpcy5tb2RlbC5yZWFjdGlvblR5cGUgPT09IFwiY3VzdG9tLXByb3BlbnNpdHlcIiA/XG4gICAgICB0aGlzLm1vZGVsLnByb3BlbnNpdHkgOiB0aGlzLm1vZGVsLnJhdGUubmFtZVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBrYXRleC5yZW5kZXIodGhpcy5tb2RlbC5zdW1tYXJ5LCB0aGlzLnF1ZXJ5QnlIb29rKCdzdW1tYXJ5JyksIHtcbiAgICAgIGRpc3BsYXlNb2RlOiB0cnVlLFxuICAgICAgb3V0cHV0OiAnbWF0aG1sJ1xuICAgIH0pO1xuICB9LFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3UnVsZXMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdTcGVjaWVzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5zd2l0Y2hpbmdWYWxXaXRoTGFiZWwgPSB0aGlzLm1vZGVsLmlzU3dpdGNoVG9sID8gXG4gICAgICBcIlN3aXRjaGluZyBUb2xlcmFuY2U6IFwiICsgdGhpcy5tb2RlbC5zd2l0Y2hUb2wgOlxuICAgICAgXCJNaW5pbXVtIFZhbHVlIEZvciBTd2l0Y2hpbmc6IFwiICsgdGhpcy5tb2RlbC5zd2l0Y2hNaW5cbiAgfSxcbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3Rlc3RzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xudmFyIFNpbVNldHRpbmdzVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3NpbXVsYXRpb24tc2V0dGluZ3MnKTtcbnZhciBXb3JrZmxvd1N0YXRlQnV0dG9uc1ZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy93b3JrZmxvdy1zdGF0ZS1idXR0b25zJyk7XG4vL21vZGVsc1xudmFyIE1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL21vZGVsJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93RWRpdG9yLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50eXBlID0gYXR0cnMudHlwZTtcbiAgICB0aGlzLnNldHRpbmdzVmlld3MgPSB7fTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpcmVjdG9yeSA9IGF0dHJzLmRpcmVjdG9yeVxuICAgIHZhciBtb2RlbEZpbGUgPSBkaXJlY3Rvcnkuc3BsaXQoJy8nKS5wb3AoKTtcbiAgICB2YXIgbmFtZSA9IG1vZGVsRmlsZS5zcGxpdCgnLicpWzBdO1xuICAgIHZhciBpc1NwYXRpYWwgPSBtb2RlbEZpbGUuc3BsaXQoJy4nKS5wb3AoKS5zdGFydHNXaXRoKCdzJyk7XG4gICAgdGhpcy5tb2RlbCA9IG5ldyBNb2RlbCh7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgZGlyZWN0b3J5OiBkaXJlY3RvcnksXG4gICAgICBpc19zcGF0aWFsOiBpc1NwYXRpYWwsXG4gICAgICBpc1ByZXZpZXc6IGZhbHNlLFxuICAgIH0pO1xuICAgIHRoaXMubW9kZWwuZmV0Y2goe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICBzZWxmLnJlbmRlclN1YnZpZXdzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIHJlbmRlclN1YnZpZXdzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5wdXROYW1lID0gbmV3IElucHV0Vmlldyh7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgIGxhYmVsOiAnTW9kZWwgUGF0aDogJyxcbiAgICAgIHRlc3RzOiB0ZXN0cy5uYW1lVGVzdHMsXG4gICAgICBtb2RlbEtleTogJ2RpcmVjdG9yeScsXG4gICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZGlyZWN0b3J5LFxuICAgIH0pO1xuICAgIC8vaW5pdGlhbGl6ZSB0aGUgc2V0dGluZ3Mgdmlld3MgYW5kIGFkZCBpdCB0byB0aGUgZGljdGlvbmFyeSBvZiBzZXR0aW5ncyB2aWV3c1xuICAgIHRoaXMuc2V0dGluZ3NWaWV3cy5naWxsZXNweSA9IG5ldyBTaW1TZXR0aW5nc1ZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgbW9kZWw6IHRoaXMubW9kZWwuc2ltdWxhdGlvblNldHRpbmdzLFxuICAgIH0pO1xuICAgIHZhciB3b3JrZmxvd1N0YXRlQnV0dG9ucyA9IG5ldyBXb3JrZmxvd1N0YXRlQnV0dG9uc1ZpZXcoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhpbnB1dE5hbWUsIFwibW9kZWwtbmFtZS1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5zZXR0aW5nc1ZpZXdzW3RoaXMudHlwZV0sICdzaW0tc2V0dGluZ3MtY29udGFpbmVyJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcod29ya2Zsb3dTdGF0ZUJ1dHRvbnMsICd3b3JrZmxvdy1zdGF0ZS1idXR0b25zLWNvbnRhaW5lcicpO1xuICAgIHRoaXMucGFyZW50LnRyYWplY3RvcmllcyA9IHRoaXMubW9kZWwuc2ltdWxhdGlvblNldHRpbmdzLnJlYWxpemF0aW9uc1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBjb2xsYXBzZUNvbnRhaW5lcjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcIndvcmtmbG93LWVkaXRvci1jb250YWluZXJcIikpLmNvbGxhcHNlKCk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgeGhyID0gcmVxdWlyZSgneGhyJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvd29ya2Zsb3dJbmZvLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnN0YXR1cyA9IGF0dHJzLnN0YXR1cztcbiAgICB0aGlzLmxvZ3NQYXRoID0gYXR0cnMubG9nc1BhdGg7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdGhpcy5saXN0T2ZXYXJuaW5ncyA9IFtdO1xuICAgIHRoaXMubGlzdE9mRXJyb3JzID0gW107XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwic3RvY2hzcy9hcGkvd29ya2Zsb3cvd29ya2Zsb3ctbG9nc1wiLCB0aGlzLmxvZ3NQYXRoKVxuICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICBpZihib2R5KXtcbiAgICAgICAgdmFyIGxvZ3MgPSBib2R5LnNwbGl0KFwiXFxuXCIpXG4gICAgICAgIGxvZ3MuZm9yRWFjaChzZWxmLnBhcnNlTG9ncywgc2VsZilcbiAgICAgICAgc2VsZi5leHBhbmRMb2dDb250YWluZXJzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKHRoaXMuc3RhdHVzID09PSAnY29tcGxldGUnKXtcbiAgICAgIHRoaXMuZW5hYmxlQ29sbGFwc2VCdXR0b24oKVxuICAgIH1lbHNlIGlmKHRoaXMuc3RhdHVzID09PSAnZXJyb3InKXtcbiAgICAgIHRoaXMuZXhwYW5kSW5mb0NvbnRhaW5lcigpXG4gICAgfVxuICB9LFxuICBwYXJzZUxvZ3M6IGZ1bmN0aW9uIChsb2cpIHtcbiAgICB2YXIgbWVzc2FnZSA9IGxvZy5zcGxpdCgncm9vdCAtICcpLnBvcCgpXG4gICAgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiV0FSTklOR1wiKSl7XG4gICAgICB0aGlzLmxpc3RPZldhcm5pbmdzLnB1c2gobWVzc2FnZS5zcGxpdChcIldBUk5JTkdcIikucG9wKCkpXG4gICAgfWVsc2UgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiRVJST1JcIikpe1xuICAgICAgdGhpcy5saXN0T2ZFcnJvcnMucHVzaChtZXNzYWdlLnNwbGl0KFwiRVJST1JcIikucG9wKCkpXG4gICAgfWVsc2UgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiQ1JJVElDQUxcIikpe1xuICAgICAgdGhpcy5saXN0T2ZFcnJvcnMucHVzaChtZXNzYWdlLnNwbGl0KFwiQ1JJVElDQUxcIikucG9wKCkpXG4gICAgfVxuICB9LFxuICBlbmFibGVDb2xsYXBzZUJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gIH0sXG4gIGV4cGFuZEluZm9Db250YWluZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZUNvbGxhcHNlQnV0dG9uKCk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1pbmZvJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZVwiKVxuICB9LFxuICBleHBhbmRMb2dDb250YWluZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5saXN0T2ZXYXJuaW5ncy5sZW5ndGgpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctd2FybmluZ3MnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAgIHZhciBsaXN0T2ZXYXJuaW5ncyA9IFwiPHA+XCIgKyB0aGlzLmxpc3RPZldhcm5pbmdzLmpvaW4oJzxicj4nKSArIFwiPC9wPlwiO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdsaXN0LW9mLXdhcm5pbmdzJykpLmh0bWwobGlzdE9mV2FybmluZ3MpO1xuICAgIH1cbiAgICBpZih0aGlzLmxpc3RPZkVycm9ycy5sZW5ndGgpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctZXJyb3JzJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgICB2YXIgbGlzdE9mRXJyb3JzID0gXCI8cD5cIiArIHRoaXMubGlzdE9mRXJyb3JzLmpvaW4oJzxicj4nKSArIFwiPC9wPlwiO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdsaXN0LW9mLWVycm9ycycpKS5odG1sKGxpc3RPZkVycm9ycyk7XG4gICAgfVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vayhcImNvbGxhcHNlXCIpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKFwiY29sbGFwc2VcIikpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vayhcImNvbGxhcHNlXCIpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciBQbG90bHkgPSByZXF1aXJlKCcuLi9saWIvcGxvdGx5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciByZXN1bHRzVGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvd29ya2Zsb3dSZXN1bHRzLnB1ZycpO1xudmFyIHJlc3VsdHNFbnNlbWJsZVRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93UmVzdWx0c0Vuc2VtYmxlLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2Utc3RkZGV2cmFuZ2VdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2Utc3RkZGV2cmFuZ2VcIik7XG4gICAgfSxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZS10cmFqZWN0b3JpZXNdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXCIpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2Utc3RkZGV2XScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXN0ZGRldlwiKTtcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLXRyYWptZWFuXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXRyYWptZWFuXCIpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2VcIik7XG4gICAgfSxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9dGl0bGVdJyA6ICdzZXRUaXRsZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXhheGlzXScgOiAnc2V0WEF4aXMnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz15YXhpc10nIDogJ3NldFlBeGlzJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1wbG90XScgOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHR5cGUgPSBlLnRhcmdldC5pZFxuICAgICAgaWYodGhpcy5wbG90c1t0eXBlXSkge1xuICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJlZGl0LXBsb3QtYXJnc1wiKSkuY29sbGFwc2UoXCJzaG93XCIpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMuZ2V0UGxvdCh0eXBlKTtcbiAgICAgICAgZS50YXJnZXQuaW5uZXJUZXh0ID0gXCJFZGl0IFBsb3RcIlxuICAgICAgfVxuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZG93bmxvYWQtcG5nLWN1c3RvbV0nIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB0eXBlID0gZS50YXJnZXQuaWQ7XG4gICAgICB0aGlzLmNsaWNrRG93bmxvYWRQTkdCdXR0b24odHlwZSlcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWRvd25sb2FkLWpzb25dJyA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgdHlwZSA9IGUudGFyZ2V0LmlkO1xuICAgICAgdGhpcy5leHBvcnRUb0pzb25GaWxlKHRoaXMucGxvdHNbdHlwZV0sIHR5cGUpXG4gICAgfVxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50cmFqZWN0b3JpZXMgPSBhdHRycy50cmFqZWN0b3JpZXM7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gICAgdGhpcy5wbG90cyA9IHt9XG4gICAgdGhpcy5wbG90QXJncyA9IHt9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMudHJhamVjdG9yaWVzID4gMSl7XG4gICAgICB0aGlzLnRlbXBsYXRlID0gcmVzdWx0c0Vuc2VtYmxlVGVtcGxhdGVcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMudGVtcGxhdGUgPSByZXN1bHRzVGVtcGxhdGVcbiAgICB9XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYodGhpcy5zdGF0dXMgPT09ICdjb21wbGV0ZScpe1xuICAgICAgdGhpcy5leHBhbmRDb250YWluZXIoKVxuICAgIH1cbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKHNvdXJjZSkpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soc291cmNlKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKHNvdXJjZSkpLnRleHQoJysnKTtcbiAgfSxcbiAgc2V0VGl0bGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5wbG90QXJnc1sndGl0bGUnXSA9IGUudGFyZ2V0LnZhbHVlXG4gICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLnBsb3RzKSB7XG4gICAgICB2YXIgZmlnID0gdGhpcy5wbG90c1t0eXBlXVxuICAgICAgZmlnLmxheW91dC50aXRsZS50ZXh0ID0gZS50YXJnZXQudmFsdWVcbiAgICAgIHRoaXMucGxvdEZpZ3VyZShmaWcsIHR5cGUpXG4gICAgfVxuICB9LFxuICBzZXRZQXhpczogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLnBsb3RBcmdzWyd5YXhpcyddID0gZS50YXJnZXQudmFsdWVcbiAgICBmb3IgKHZhciB0eXBlIGluIHRoaXMucGxvdHMpIHtcbiAgICAgIHZhciBmaWcgPSB0aGlzLnBsb3RzW3R5cGVdXG4gICAgICBmaWcubGF5b3V0LnlheGlzLnRpdGxlLnRleHQgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgdGhpcy5wbG90RmlndXJlKGZpZywgdHlwZSlcbiAgICB9XG4gIH0sXG4gIHNldFhBeGlzOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMucGxvdEFyZ3NbJ3hheGlzJ10gPSBlLnRhcmdldC52YWx1ZVxuICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5wbG90cykge1xuICAgICAgdmFyIGZpZyA9IHRoaXMucGxvdHNbdHlwZV1cbiAgICAgIGZpZy5sYXlvdXQueGF4aXMudGl0bGUudGV4dCA9IGUudGFyZ2V0LnZhbHVlXG4gICAgICB0aGlzLnBsb3RGaWd1cmUoZmlnLCB0eXBlKVxuICAgIH1cbiAgfSxcbiAgZ2V0UGxvdDogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVsID0gdGhpcy5xdWVyeUJ5SG9vayh0eXBlKVxuICAgIFBsb3RseS5wdXJnZShlbClcbiAgICB2YXIgZGF0YSA9IHtcInBsdF90eXBlXCI6IHR5cGV9XG4gICAgaWYoT2JqZWN0LmtleXModGhpcy5wbG90QXJncykubGVuZ3RoKXtcbiAgICAgIGRhdGFbJ3BsdF9kYXRhJ10gPSB0aGlzLnBsb3RBcmdzXG4gICAgfWVsc2V7XG4gICAgICBkYXRhWydwbHRfZGF0YSddID0gXCJOb25lXCJcbiAgICB9XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwic3RvY2hzcy9hcGkvd29ya2Zsb3cvcGxvdC1yZXN1bHRzXCIsIHRoaXMucGFyZW50LmRpcmVjdG9yeSwgJz9kYXRhPScgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgeGhyKHt1cmw6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpe1xuICAgICAgaWYoYm9keS5zdGFydHNXaXRoKFwiRVJST1IhXCIpKXtcbiAgICAgICAgJChzZWxmLnF1ZXJ5QnlIb29rKHR5cGUpKS5odG1sKGJvZHkpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgdmFyIGZpZyA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgc2VsZi5wbG90c1t0eXBlXSA9IGZpZ1xuICAgICAgICBzZWxmLnBsb3RGaWd1cmUoZmlnLCB0eXBlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgcGxvdEZpZ3VyZTogZnVuY3Rpb24gKGZpZ3VyZSwgdHlwZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgaG9vayA9IHR5cGU7XG4gICAgdmFyIGVsID0gdGhpcy5xdWVyeUJ5SG9vayhob29rKVxuICAgIFBsb3RseS5uZXdQbG90KGVsLCBmaWd1cmUpXG4gICAgdGhpcy5xdWVyeUFsbChcIiNcIiArIHR5cGUpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICBpZihlbC5kaXNhYmxlZCl7XG4gICAgICAgIGVsLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGNsaWNrRG93bmxvYWRQTkdCdXR0b246IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIHBuZ0J1dHRvbiA9ICQoJ2RpdltkYXRhLWhvb2sqPScrdHlwZSsnXSBhW2RhdGEtdGl0bGUqPVwiRG93bmxvYWQgcGxvdCBhcyBhIHBuZ1wiXScpWzBdXG4gICAgcG5nQnV0dG9uLmNsaWNrKClcbiAgfSxcbiAgZXhwb3J0VG9Kc29uRmlsZTogZnVuY3Rpb24gKGpzb25EYXRhLCBwbG90VHlwZSkge1xuICAgIGxldCBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkoanNvbkRhdGEpO1xuICAgIGxldCBkYXRhVVJJID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVN0cik7XG4gICAgbGV0IGV4cG9ydEZpbGVEZWZhdWx0TmFtZSA9IHBsb3RUeXBlICsgJy1wbG90Lmpzb24nO1xuXG4gICAgbGV0IGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGRhdGFVUkkpO1xuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBleHBvcnRGaWxlRGVmYXVsdE5hbWUpO1xuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XG4gIH0sXG4gIGV4cGFuZENvbnRhaW5lcjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctcmVzdWx0cycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZVwiKVxuICAgIHRoaXMudHJhamVjdG9yaWVzID4gMSA/IHRoaXMuZ2V0UGxvdChcInN0ZGRldnJhblwiKSA6IHRoaXMuZ2V0UGxvdChcInRyYWplY3Rvcmllc1wiKVxuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0VGl0bGU6IHtcbiAgICAgIGhvb2s6ICd0aXRsZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIG5hbWU6ICd0aXRsZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogbnVsbCxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLnBsb3RBcmdzLnRpdGxlIHx8IFwiXCIsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0WEF4aXM6IHtcbiAgICAgIGhvb2s6ICd4YXhpcycsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIG5hbWU6ICd4YXhpcycsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogbnVsbCxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLnBsb3RBcmdzLnhheGlzIHx8IFwiXCIsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0WUF4aXM6IHtcbiAgICAgIGhvb2s6ICd5YXhpcycsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIG5hbWU6ICd5YXhpcycsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogbnVsbCxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLnBsb3RBcmdzLnlheGlzIHx8IFwiXCIsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCJ2YXIgYXBwID0gcmVxdWlyZSgnYW1wZXJzYW5kLWFwcCcpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXRlQnV0dG9ucy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9c2F2ZV0nIDogJ2NsaWNrU2F2ZUhhbmRsZXInLFxuICAgICdjbGljayBbZGF0YS1ob29rPXN0YXJ0LXdvcmtmbG93XScgIDogJ2NsaWNrU3RhcnRXb3JrZmxvd0hhbmRsZXInLFxuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtbW9kZWxdJyA6ICdjbGlja0VkaXRNb2RlbEhhbmRsZXInLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICBjbGlja1NhdmVIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc2F2aW5nKCk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBtb2RlbCA9IHRoaXMubW9kZWxcbiAgICB2YXIgd2tmbFR5cGUgPSB0aGlzLnBhcmVudC5wYXJlbnQudHlwZTtcbiAgICB2YXIgb3B0VHlwZSA9IGRvY3VtZW50LlVSTC5lbmRzV2l0aChcIi5tZGxcIikgPyBcInNuXCIgOiBcInNlXCI7XG4gICAgdmFyIHdvcmtmbG93ID0gZG9jdW1lbnQuVVJMLmVuZHNXaXRoKFwiLm1kbFwiKSA/IHRoaXMucGFyZW50LnBhcmVudC53b3JrZmxvd05hbWUgOiB0aGlzLnBhcmVudC5wYXJlbnQuZGlyZWN0b3J5XG4gICAgdGhpcy5zYXZlTW9kZWwoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKCdzdG9jaHNzL2FwaS93b3JrZmxvdy9zYXZlLXdvcmtmbG93LycsIHdrZmxUeXBlLCBvcHRUeXBlLCBtb2RlbC5kaXJlY3RvcnksIFwiPC0tR2lsbGVzUHkyV29ya2Zsb3ctLT5cIiwgd29ya2Zsb3cpO1xuICAgICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgc2VsZi5zYXZlZCgpO1xuICAgICAgICBpZihkb2N1bWVudC5VUkwuZW5kc1dpdGgoJy5tZGwnKSl7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL3ZhciBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGRvY3VtZW50LlVSTCkuc3BsaXQoJ2h1YicpXG4gICAgICAgICAgICAvL2Rpcm5hbWUuc2hpZnQoKVxuICAgICAgICAgICAgLy9kaXJuYW1lID0gZGlybmFtZS5qb2luKCdodWInKVxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoLmpvaW4oc2VsZi5wYXJlbnQucGFyZW50LndvcmtmbG93TmFtZSArICcud2tmbCcpXG4gICAgICAgICAgfSwgMzAwMCk7IFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgY2xpY2tTdGFydFdvcmtmbG93SGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLnNhdmVNb2RlbCh0aGlzLnJ1bldvcmtmbG93LmJpbmQodGhpcykpO1xuICB9LFxuICBjbGlja0VkaXRNb2RlbEhhbmRsZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdGhpcy5zYXZlTW9kZWwoZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoLmpvaW4oXCJzdG9jaHNzL21vZGVscy9lZGl0XCIsIHNlbGYubW9kZWwuZGlyZWN0b3J5KTtcbiAgICB9KTtcbiAgfSxcbiAgc2F2ZU1vZGVsOiBmdW5jdGlvbiAoY2IpIHtcbiAgICAvLyB0aGlzLm1vZGVsIGlzIGEgTW9kZWxWZXJzaW9uLCB0aGUgcGFyZW50IG9mIHRoZSBjb2xsZWN0aW9uIGlzIE1vZGVsXG4gICAgaWYodGhpcy5tb2RlbC5zaW11bGF0aW9uU2V0dGluZ3MuaXNBdXRvbWF0aWMpe1xuICAgICAgdGhpcy5tb2RlbC5zaW11bGF0aW9uU2V0dGluZ3MubGV0VXNDaG9vc2VGb3JZb3UoKTtcbiAgICB9XG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbDtcbiAgICBpZiAoY2IpIHtcbiAgICAgIG1vZGVsLnNhdmUobW9kZWwuYXR0cmlidXRlcywge1xuICAgICAgICBzdWNjZXNzOiBjYixcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc2F2aW5nIG1vZGVsOlwiLCBtb2RlbCk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlc3BvbnNlOlwiLCByZXNwb25zZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kZWwuc2F2ZU1vZGVsKCk7XG4gICAgfVxuICB9LFxuICBzYXZpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2F2aW5nID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2aW5nLXdvcmtmbG93Jyk7XG4gICAgdmFyIHNhdmVkID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2ZWQtd29ya2Zsb3cnKTtcbiAgICBzYXZlZC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgc2F2aW5nLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuICB9LFxuICBzYXZlZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzYXZpbmcgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzYXZpbmctd29ya2Zsb3cnKTtcbiAgICB2YXIgc2F2ZWQgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzYXZlZC13b3JrZmxvdycpO1xuICAgIHNhdmluZy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgc2F2ZWQuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG4gIH0sXG4gIHJ1bldvcmtmbG93OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbDtcbiAgICB2YXIgd2tmbFR5cGUgPSB0aGlzLnBhcmVudC5wYXJlbnQudHlwZTtcbiAgICB2YXIgb3B0VHlwZSA9IGRvY3VtZW50LlVSTC5lbmRzV2l0aChcIi5tZGxcIikgPyBcInJuXCIgOiBcInJlXCI7XG4gICAgdmFyIHdvcmtmbG93ID0gZG9jdW1lbnQuVVJMLmVuZHNXaXRoKFwiLm1kbFwiKSA/IHRoaXMucGFyZW50LnBhcmVudC53b3JrZmxvd05hbWUgOiB0aGlzLnBhcmVudC5wYXJlbnQuZGlyZWN0b3J5XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKCdzdG9jaHNzL2FwaS93b3JrZmxvdy9ydW4td29ya2Zsb3cvJywgd2tmbFR5cGUsIG9wdFR5cGUsIG1vZGVsLmRpcmVjdG9yeSwgXCI8LS1HaWxsZXNQeTJXb3JrZmxvdy0tPlwiLCB3b3JrZmxvdyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHhocih7IHVyaTogZW5kcG9pbnQgfSxmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgc2VsZi5wYXJlbnQuY29sbGFwc2VDb250YWluZXIoKTtcbiAgICAgIHNlbGYucGFyZW50LnBhcmVudC51cGRhdGVXb3JrZmxvd1N0YXR1cygpO1xuICAgICAgaWYoZG9jdW1lbnQuVVJMLmVuZHNXaXRoKCcubWRsJykpe1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvL3ZhciBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGRvY3VtZW50LlVSTCkuc3BsaXQoJ2h1YicpXG4gICAgICAgICAgLy9kaXJuYW1lLnNoaWZ0KClcbiAgICAgICAgICAvL2Rpcm5hbWUgPSBkaXJuYW1lLmpvaW4oJ2h1YicpXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoLmpvaW4oc2VsZi5wYXJlbnQucGFyZW50LndvcmtmbG93TmFtZSArICcud2tmbCcpXG4gICAgICAgIH0sIDMwMDApOyAgICAgICAgXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93U3RhdHVzLnB1ZycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBsb2NhbERhdGUgPSBuZXcgRGF0ZShhdHRycy5zdGFydFRpbWUpXG4gICAgdmFyIGxvY2FsU3RhcnRUaW1lID0gdGhpcy5nZXRGb3JtYXR0ZWREYXRlKGxvY2FsRGF0ZSlcbiAgICB0aGlzLnN0YXJ0VGltZSA9IGxvY2FsU3RhcnRUaW1lO1xuICAgIHRoaXMuc3RhdHVzID0gYXR0cnMuc3RhdHVzO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZih0aGlzLnN0YXR1cyAhPT0gJ3JlYWR5JyAmJiB0aGlzLnN0YXR1cyAhPT0gJ25ldycpe1xuICAgICAgdGhpcy5leHBhbmRDb250YWluZXIoKVxuICAgIH1cbiAgfSxcbiAgZXhwYW5kQ29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1zdGF0dXMnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KClcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxuICBnZXRGb3JtYXR0ZWREYXRlOiBmdW5jdGlvbiAoZGF0ZSkge1xuICAgIHZhciBtb250aHMgPSBbJ0phbi4nLCAnRmViLicsICdNYXIuJywgJ0Fwci4nLCAnTWF5JywgJ0p1bi4nLCAnSnVsLicsICdBdWcuJywgJ1NlcHQuJywgJ09jdC4nLCAnTm92LicsICdEZWMuJ107XG4gICAgdmFyIG1vbnRoID0gbW9udGhzW2RhdGUuZ2V0TW9udGgoKV07IC8vIGdldCB0aGUgYWJyaXZpYXRlZCBtb250aFxuICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKTtcbiAgICB2YXIgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgdmFyIGFtcG0gPSBob3VycyA+PSAxMiA/ICdQTScgOiAnQU0nOyAvLyBnZXQgQU0gb3IgUE0gYmFzZWQgb24gaG91cnNcbiAgICBob3VycyA9IGhvdXJzJTEyOyAvLyBmb3JtYXQgaG91cnMgdG8gMTIgaG91ciB0aW1lIGZvcm1hdFxuICAgIGhvdXJzID0gaG91cnMgPyBob3VycyA6IDEyOyAvLyByZXBsYWNlIDAgd2l0aCAxMlxuICAgIHZhciBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgbWludXRlcyA9IG1pbnV0ZXMgPCAxMCA/ICcwJyArIG1pbnV0ZXMgOiBtaW51dGVzOyAvLyBmb3JtYXQgbWludXRlcyB0byBhbHdheXMgaGF2ZSB0d28gY2hhcnNcbiAgICB2YXIgdGltZVpvbmUgPSBkYXRlLnRvU3RyaW5nKCkuc3BsaXQoJyAnKS5wb3AoKSAvLyBnZXQgdGhlIHRpbWV6b25lIGZyb20gdGhlIGRhdGVcbiAgICB0aW1lWm9uZSA9IHRpbWVab25lLnJlcGxhY2UoJygnLCAnJykucmVwbGFjZSgnKScsICcnKSAvLyByZW1vdmUgdGhlICcoKScgZnJvbSB0aGUgdGltZXpvbmVcbiAgICByZXR1cm4gIG1vbnRoICsgXCIgXCIgKyBkYXkgKyBcIiwgXCIgKyB5ZWFyICsgXCIgIFwiICsgaG91cnMgKyBcIjpcIiArIG1pbnV0ZXMgKyBcIiBcIiArIGFtcG0gKyBcIiBcIiArIHRpbWVab25lO1xuICB9LFxufSk7Il0sInNvdXJjZVJvb3QiOiIifQ==
>>>>>>> 11be801a93c6dea339a57f84acd362041d779487
