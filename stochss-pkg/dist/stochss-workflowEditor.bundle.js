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
    var types = {"gillespy":"Ensemble Simulation","parameterSweep":"Parameter Sweep"}
    this.titleType = types[this.type]
    this.directory = url.split('/workflow/edit/' + this.type).pop();
    if(this.directory.endsWith('.mdl')){
      var modelFile = this.directory.split('/').pop();
      var name = modelFile.split('.')[0];
      this.modelDirectory = this.directory;
      this.workflowDate = this.getCurrentDate();
      this.workflowName = name + this.workflowDate;
      this.status = 'new';
    }else{
      var endpoint = path.join(app.getApiPath(), "/workflow/workflow-info", this.directory, "/info.json");
      xhr({uri: endpoint, json: true}, function (err, response, body){
        if(response.statusCode < 400) {
          self.modelDirectory = body.model.split('/home/jovyan').pop();
          self.type = body.type;
          self.titleType = types[self.type]
          self.startTime = body.start_time;
          var workflowDir = self.directory.split('/').pop();
          self.workflowName = workflowDir.split('.')[0];
          var statusEndpoint = path.join(app.getApiPath(), "/workflow/workflow-status", self.directory);
          xhr({uri: statusEndpoint}, function (err, response, body) {
            self.status = body;
            if(self.status === 'complete' || self.status === 'error'){
              self.modelDirectory = path.join(self.directory, self.modelDirectory.split('/').pop());
            }
            self.renderSubviews();
          });
        }
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
    $(this.queryByHook("page-title")).text('Workflow: '+this.titleType)
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
    this.registerRenderSubview(inputName, 'workflow-name');
    this.renderWorkflowEditor();
    this.renderWorkflowStatusView();
    this.updateTrajectories();
    this.renderModelViewer();
    this.renderInfoView();
    if(this.status !== 'new'){
      this.disableWorkflowNameInput();
    }
    if(this.status !== 'new' && this.status !== 'ready'){
      this.workflowEditor.collapseContainer();
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
  disableWorkflowNameInput: function() {
    $(this.queryByHook("workflow-name")).find('input').prop('disabled', true);
  },
  renderWorkflowEditor: function () {
    if(this.workflowEditorView){
      this.workflowEditorView.remove()
    }
    this.workflowEditor = new WorkflowEditorView({
      directory: this.modelDirectory,
      type: this.type,
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
  getWorkflowInfo: function (cb) {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "/workflow/workflow-info", this.directory, "/info.json");
    xhr({uri: endpoint, json: true}, function (err, response, body){
      self.startTime = body.start_time;
      cb();
    });
  },
  getWorkflowStatus: function () {
    var self = this;
    var statusEndpoint = path.join(app.getApiPath(), "/workflow/workflow-status", this.directory);
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"species-of-interest\"\u003ESpecies of Interest:\u003C\u002Fspan\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.species, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline\" id=\"species-of-interest\" data-hook=\"specie-of-interest-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"feature-extractor\"\u003EFeature Extraction: \u003C\u002Fspan\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.species, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline\" id=\"feature-extractor\" data-hook=\"feature-extraction-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"ensemble-aggragator\"\u003EEnsemble Aggragator: \u003C\u002Fspan\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.species, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline\" id=\"ensemble-aggragator\" data-hook=\"ensemble-aggragator-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"card card-body\"\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EParameter Sweep\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-psweep\" data-hook=\"collapse-psweep\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-psweep\"\u003E\u003Cdiv data-hook=\"psweep\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"psweep\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"psweep\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"psweep\" data-hook=\"download-json\" disabled\u003EDownload JSON \u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"download-results-csv\"\u003EDownload Results as .csv\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Csection class=\"page\"\u003E\u003Cdiv\u003E\u003Ch2 class=\"inline\" data-hook=\"page-title\"\u003E" + (pug.escape(null == (pug_interp = "Workflow: "+this.titleType) ? "" : pug_interp)) + "\u003C\u002Fh2\u003E\u003Cbutton class=\"big-tip btn information-btn help\" data-hook=\"edit-workflow-help\"\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"far\" data-icon=\"question-circle\" class=\"svg-inline--fa fa-question-circle fa-w-16\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 512 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-name\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-status-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-results-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-info-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"model-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"computational-resources-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";;return pug_html;};
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
      is_spatial: isSpatial,
      isPreview: false,
      for: "wkfl"
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

let modelNotFoundHtml = (title, message) => {
  return `
    <div id="duplicateWorkflowModal" class="modal" tabindex="-1" role="dialog">
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

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=model-name-container]' : 'updateWorkflowEditor',
  },
  initialize: function (attrs, options) {
    var self = this;
    $(document).on('hidden.bs.modal', function (e) {
      $(self.queryByHook("model-name-container")).find('input').focus();
    });
    View.prototype.initialize.apply(this, arguments);
    this.type = attrs.type;
    this.settingsViews = {};
    var directory = attrs.directory
    var modelFile = directory.split('/').pop();
    var name = modelFile.split('.')[0];
    var isSpatial = modelFile.split('.').pop().startsWith('s');
    this.model = new Model({
      name: name,
      directory: directory,
      is_spatial: isSpatial,
      isPreview: false,
      for: "wkfl",
    });
    this.model.fetch({
      json: true,
      success: function (model, response, options) {
        self.renderSubviews();
      },
      error: function (model, response, options) {
        self.modelNotFound(response.body)
      }
    });
  },
  update: function (e) {
  },
  updateValid: function (e) {
  },
  updateWorkflowEditor: function (e) {
    let self = this;
    this.model.fetch({
      json: true,
      success: function (model, response, options) {
        self.renderSubviews();
      },
      error: function (model, response, options) {
        self.modelNotFound(response.body)
      }
    });
  },
  renderSubviews: function() {
    this.renderModelPathInputView(false)
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
    this.registerRenderSubview(this.settingsViews['gillespy'], 'sim-settings-container');
    if(this.type === "parameterSweep"){
      var species = this.model.species;
      var parameters = this.model.parameters;
      var parameterOne = this.model.parameterSweepSettings.parameterOne
      var parameterTwo = this.model.parameterSweepSettings.parameterTwo
      var speciesOfInterest = this.model.parameterSweepSettings.speciesOfInterest
      var p1Exists = parameters.filter(function (param) { if(parameterOne.compID && parameterOne.compID === param.compID) return param}).length
      var p2Exists = parameters.filter(function (param) { if(parameterTwo.compID && parameterTwo.compID === param.compID) return param}).length
      var speciesOfInterestExists = species.filter(function (specie) { if(speciesOfInterest.compID && speciesOfInterest.compID === specie.compID) return species}).length
      if(!parameterOne.name || !p1Exists){
        this.model.parameterSweepSettings.parameterOne = parameters.at(0)
        var val = eval(this.model.parameterSweepSettings.parameterOne.expression)
        this.model.parameterSweepSettings.p1Min = val * 0.5
        this.model.parameterSweepSettings.p1Max = val * 1.5
      }
      if(parameters.at(1) && (!parameterTwo.name || !p2Exists)) {
        this.model.parameterSweepSettings.parameterTwo = parameters.at(1)
        var val = eval(this.model.parameterSweepSettings.parameterTwo.expression)
        this.model.parameterSweepSettings.p2Min = val * 0.5
        this.model.parameterSweepSettings.p2Max = val * 1.5
      }
      if(!this.model.parameterSweepSettings.speciesOfInterest.name || !speciesOfInterestExists){
        this.model.parameterSweepSettings.speciesOfInterest = species.at(0)
      }
      this.registerRenderSubview(this.settingsViews['parameterSweep'], 'param-sweep-settings-container');
    }
    this.registerRenderSubview(workflowStateButtons, 'workflow-state-buttons-container');
    this.parent.trajectories = this.model.simulationSettings.realizations
    this.parent.species = this.model.species
    this.parent.speciesOfInterest = this.model.parameterSweepSettings.speciesOfInterest
  },
  modelNotFound: function (error) {
    let title = error.Reason
    let message = error.Message
    console.log(title, message)
    let modal = $(modelNotFoundHtml(title, message)).modal()
    this.renderModelPathInputView(true)
    $(this.queryByHook("model-name-container")).find('input').prop('autofocus', true)
  },
  renderModelPathInputView: function (mdlNotFound) {
    if(this.modelPathInput){
      this.modelPathInput.remove()
    }
    this.modelPathInput = new InputView({
      parent: this,
      required: true,
      name: 'name',
      label: 'Model Path: ',
      tests: "",
      modelKey: 'directory',
      valueType: 'string',
      value: this.model.directory,
    });
    this.registerRenderSubview(this.modelPathInput, "model-name-container");
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
    var endpoint = path.join(app.getApiPath(), "/workflow/plot-results", this.parent.directory, '?data=' + JSON.stringify(data));
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
    let path = this.parent.directory
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
      var endpoint = path.join(app.getApiPath(), 'workflow/save-workflow/', wkflType, optType, model.directory, "<--GillesPy2Workflow-->", workflow);
      xhr({uri: endpoint}, function (err, response, body) {
        self.saved();
        if(document.URL.endsWith('.mdl')){
          setTimeout(function () {
            var dirname = window.location.pathname.split('/')
            dirname.pop()
            dirname = dirname.join('/')
            window.location.href = path.join(dirname, self.parent.parent.workflowName + '.wkfl')
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
    var model = this.model;
    var wkflType = this.parent.parent.type;
    var optType = document.URL.endsWith(".mdl") ? "rn" : "re";
    var workflow = document.URL.endsWith(".mdl") ? this.parent.parent.workflowName : this.parent.parent.directory
    var endpoint = path.join(app.getApiPath(), '/workflow/run-workflow/', wkflType, optType, model.directory, "<--GillesPy2Workflow-->", workflow);
    var self = this;
    xhr({ uri: endpoint },function (err, response, body) {
      self.parent.collapseContainer();
      if(document.URL.endsWith('.mdl')){
        setTimeout(function () {
          let pathname = window.location.pathname.split('/');
          pathname.pop()
          pathname = pathname.join('/')
          workflowpath = path.join(pathname, self.parent.parent.workflowName + '.wkfl')
          window.location.href = workflowpath;
        }, 3000);        
      }else{
        self.parent.parent.updateWorkflowStatus();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL3dvcmtmbG93LW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudEFzc2lnbm1lbnRzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50c1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9naWxsZXNweVJlc3VsdHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZ2lsbGVzcHlSZXN1bHRzRW5zZW1ibGUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxTZXR0aW5nc1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFJlc3VsdHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFNldHRpbmdzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3J1bGVzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3NpbXVsYXRpb25TZXR0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BlY2llc1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRBc3NpZ25tZW50cy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdQYXJhbWV0ZXJzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdSZWFjdGlvbnMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1J1bGVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdTcGVjaWVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93RWRpdG9yLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93SW5mby5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXRlQnV0dG9ucy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXR1cy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9wYWdlcy93b3JrZmxvd01hbmFnZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9ldmVudC1hc3NpZ25tZW50cy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50cy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL21vZGVsLXNldHRpbmdzLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvbW9kZWwtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3Mtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3BhcmFtZXRlcnMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9yZWFjdGlvbnMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9ydWxlcy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3NpbXVsYXRpb24tc2V0dGluZ3Mtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zaW11bGF0aW9uLXNldHRpbmdzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zcGVjaWVzLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ldmVudC1hc3NpZ25tZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3ZpZXctcGFyYW1ldGVyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy92aWV3LXJlYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ydWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3dvcmtmbG93LWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctaW5mby5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctcmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctc3RhdGUtYnV0dG9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRLG9CQUFvQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBLDBCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hE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QUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELG9CQUFvQjtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVE7QUFDUixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVMsMEJBQTBCO0FBQ25DO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdB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N0lELFFBQVEsbUJBQU8sQ0FBQyxvREFBUTtBQUN4QjtBQUNBLFdBQVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkM7QUFDQSxlQUFlLG1CQUFPLENBQUMsZ0dBQTBDOzs7QUFHakU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDLHFCQUFxQjtBQUNyQiwrQkFBK0I7QUFDL0I7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRSIsImZpbGUiOiJzdG9jaHNzLXdvcmtmbG93RWRpdG9yLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0ZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soZGF0YSkge1xuIFx0XHR2YXIgY2h1bmtJZHMgPSBkYXRhWzBdO1xuIFx0XHR2YXIgbW9yZU1vZHVsZXMgPSBkYXRhWzFdO1xuIFx0XHR2YXIgZXhlY3V0ZU1vZHVsZXMgPSBkYXRhWzJdO1xuXG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG4gXHRcdFx0fVxuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGRhdGEpO1xuXG4gXHRcdHdoaWxlKHJlc29sdmVzLmxlbmd0aCkge1xuIFx0XHRcdHJlc29sdmVzLnNoaWZ0KCkoKTtcbiBcdFx0fVxuXG4gXHRcdC8vIGFkZCBlbnRyeSBtb2R1bGVzIGZyb20gbG9hZGVkIGNodW5rIHRvIGRlZmVycmVkIGxpc3RcbiBcdFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2guYXBwbHkoZGVmZXJyZWRNb2R1bGVzLCBleGVjdXRlTW9kdWxlcyB8fCBbXSk7XG5cbiBcdFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiBhbGwgY2h1bmtzIHJlYWR5XG4gXHRcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIFx0fTtcbiBcdGZ1bmN0aW9uIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCkge1xuIFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGRlZmVycmVkTW9kdWxlID0gZGVmZXJyZWRNb2R1bGVzW2ldO1xuIFx0XHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuIFx0XHRcdGZvcih2YXIgaiA9IDE7IGogPCBkZWZlcnJlZE1vZHVsZS5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGRlcElkID0gZGVmZXJyZWRNb2R1bGVbal07XG4gXHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbZGVwSWRdICE9PSAwKSBmdWxmaWxsZWQgPSBmYWxzZTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYoZnVsZmlsbGVkKSB7XG4gXHRcdFx0XHRkZWZlcnJlZE1vZHVsZXMuc3BsaWNlKGktLSwgMSk7XG4gXHRcdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGRlZmVycmVkTW9kdWxlWzBdKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4gXHQvLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0XCJ3b3JrZmxvd0VkaXRvclwiOiAwXG4gXHR9O1xuXG4gXHR2YXIgZGVmZXJyZWRNb2R1bGVzID0gW107XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdHZhciBqc29ucEFycmF5ID0gd2luZG93W1wid2VicGFja0pzb25wXCJdID0gd2luZG93W1wid2VicGFja0pzb25wXCJdIHx8IFtdO1xuIFx0dmFyIG9sZEpzb25wRnVuY3Rpb24gPSBqc29ucEFycmF5LnB1c2guYmluZChqc29ucEFycmF5KTtcbiBcdGpzb25wQXJyYXkucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrO1xuIFx0anNvbnBBcnJheSA9IGpzb25wQXJyYXkuc2xpY2UoKTtcbiBcdGZvcih2YXIgaSA9IDA7IGkgPCBqc29ucEFycmF5Lmxlbmd0aDsgaSsrKSB3ZWJwYWNrSnNvbnBDYWxsYmFjayhqc29ucEFycmF5W2ldKTtcbiBcdHZhciBwYXJlbnRKc29ucEZ1bmN0aW9uID0gb2xkSnNvbnBGdW5jdGlvbjtcblxuXG4gXHQvLyBhZGQgZW50cnkgbW9kdWxlIHRvIGRlZmVycmVkIGxpc3RcbiBcdGRlZmVycmVkTW9kdWxlcy5wdXNoKFtcIi4vY2xpZW50L3BhZ2VzL3dvcmtmbG93LW1hbmFnZXIuanNcIixcImNvbW1vblwiXSk7XG4gXHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIHJlYWR5XG4gXHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3Rlc3RzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcbi8vdmlld3NcbnZhciBQYWdlVmlldyA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyIFdvcmtmbG93RWRpdG9yVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3dvcmtmbG93LWVkaXRvcicpO1xudmFyIFdvcmtmbG93U3RhdHVzVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3dvcmtmbG93LXN0YXR1cycpO1xudmFyIFdvcmtmbG93UmVzdWx0c1ZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy93b3JrZmxvdy1yZXN1bHRzJyk7XG52YXIgTW9kZWxWaWV3ZXIgPSByZXF1aXJlKCcuLi92aWV3cy9tb2RlbC12aWV3ZXInKTtcbnZhciBJbmZvVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3dvcmtmbG93LWluZm8nKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9wYWdlcy93b3JrZmxvd01hbmFnZXIucHVnJyk7XG5cbmltcG9ydCBpbml0UGFnZSBmcm9tICcuL3BhZ2UuanMnO1xuXG5sZXQgb3BlcmF0aW9uSW5mb01vZGFsSHRtbCA9ICgpID0+IHtcbiAgbGV0IGVkaXRXb3JrZmxvd01lc3NhZ2UgPSBgXG4gICAgPHA+PGI+V29ya2Zsb3cgTmFtZS9QYXRoPC9iPjogWW91IG1heSBlZGl0IHRoZSBuYW1lL3BhdGggb2YgdGhlIHdvcmtmbG93IGFzIGxvbmcgYXMgdGhlIHdvcmtmbG93IGhhcyBub3QgYmVlbiBzYXZlZC4gIFxuICAgIFdvcmtmbG93IE5hbWVzIGFsd2F5cyBlbmQgd2l0aCBhIHRpbWUgc3RhbXAuPC9wPlxuICAgIDxwPjxiPk1vZGVsIFBhdGg8L2I+OiBJZiB5b3UgbW92ZSBvciByZW5hbWUgdGhlIG1vZGVsIG1ha2Ugc3VyZSB0byB1cGRhdGUgdGhpcyBwYXRoLjwvcD5cbiAgICA8cD48Yj5TZXR0aW5nczwvYj46IFRoaXMgaXMgd2hlcmUgeW91IGNhbiBjdXN0b21pemUgdGhlIHNldHRpbmdzIGZvciB5b3VyIHdvcmtmbG93LlxuICAgIElmIHlvdSBuZWVkIHRvIGVkaXQgb3RoZXIgcGFydCBvZiB5b3UgbW9kZWwgY2xpY2sgb24gdGhlIGVkaXQgbW9kZWwgYnV0dG9uLiAgXG4gICAgVGhlIHNldHRpbmdzIGFyZSBvbmx5IGF2YWlsYWJsZSBmb3Igd29ya2Zsb3dzIHRoYXQgaGF2ZSBub3QgYmVlbiBydW4uPC9wPlxuICAgIDxwPjxiPlN0YXR1czwvYj46IFRoaXMgc2VjdGlvbiBkaXNwbGF5cyB0aGUgc3RhdHVzIGFuZCBzdGFydCB0aW1lIG9mIHRoZSBXb3JrZmxvdy4gIElmIHRoZSB3b3JrZmxvdyBoYXNuJ3QgYmVlbiBzYXJ0ZWQgdGhpcyBzZWN0aW9uIGlzIGNsb3NlZC48L3A+XG4gICAgPHA+PGI+UmVzdWx0czwvYj46IFlvdSBtYXkgY2hhbmdlIHRoZSB0aXRsZSwgeC1heGlzIGxhYmVsLCBhbmQgeS1heGlzIGxhYmVsIGJ5IGNsaWNraW5nIG9uIHRoZSBlZGl0IHBsb3QgYnV0dG9uIHRoZW4gZW50ZXIgdGhlIG5hbWUgaW4gdGhlIGNvcnJlY3QgZmllbGQuPC9wPlxuICAgIDxwPjxiPkluZm88L2I+OiBUaGlzIHNlY3Rpb24gZGlzcGxheXMgYW55IHdhcm5pbmdzIGFuZC9vciBlcnJvciB0aGF0IGFyZSBsb2dnZWQgYnkgdGhlIHJ1bm5pbmcgd29ya2Zsb3cuPC9wPlxuICAgIDxwPjxiPk1vZGVsPC9iPjogVGhpcyBzZWN0aW9uIGxldHMgeW91IHZpZXcgdGhlIG1vZGVsIHRoYXQgd2FzIHVzZWQgd2hlbiB5b3UgcmFuIHRoZSB3b3JrZmxvdy48L3A+XG4gIGA7XG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwib3BlcmF0aW9uSW5mb01vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50IGluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPiBXb3JrZmxvdyBNYW5hZ2VyIEhlbHAgPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxwPiAke2VkaXRXb3JrZmxvd01lc3NhZ2V9IDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgIFxufVxuXG5sZXQgV29ya2Zsb3dNYW5hZ2VyID0gUGFnZVZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9d29ya2Zsb3ctbmFtZV0nIDogJ3NldFdvcmtmbG93TmFtZScsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZWRpdC13b3JrZmxvdy1oZWxwXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgbW9kYWwgPSAkKG9wZXJhdGlvbkluZm9Nb2RhbEh0bWwoKSkubW9kYWwoKTtcbiAgICB9LFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBQYWdlVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgdXJsID0gZGVjb2RlVVJJKGRvY3VtZW50LlVSTClcbiAgICB0aGlzLnR5cGUgPSB1cmwuc3BsaXQoJy93b3JrZmxvdy9lZGl0LycpLnBvcCgpLnNwbGl0KCcvJylbMF07XG4gICAgdmFyIHR5cGVzID0ge1wiZ2lsbGVzcHlcIjpcIkVuc2VtYmxlIFNpbXVsYXRpb25cIixcInBhcmFtZXRlclN3ZWVwXCI6XCJQYXJhbWV0ZXIgU3dlZXBcIn1cbiAgICB0aGlzLnRpdGxlVHlwZSA9IHR5cGVzW3RoaXMudHlwZV1cbiAgICB0aGlzLmRpcmVjdG9yeSA9IHVybC5zcGxpdCgnL3dvcmtmbG93L2VkaXQvJyArIHRoaXMudHlwZSkucG9wKCk7XG4gICAgaWYodGhpcy5kaXJlY3RvcnkuZW5kc1dpdGgoJy5tZGwnKSl7XG4gICAgICB2YXIgbW9kZWxGaWxlID0gdGhpcy5kaXJlY3Rvcnkuc3BsaXQoJy8nKS5wb3AoKTtcbiAgICAgIHZhciBuYW1lID0gbW9kZWxGaWxlLnNwbGl0KCcuJylbMF07XG4gICAgICB0aGlzLm1vZGVsRGlyZWN0b3J5ID0gdGhpcy5kaXJlY3Rvcnk7XG4gICAgICB0aGlzLndvcmtmbG93RGF0ZSA9IHRoaXMuZ2V0Q3VycmVudERhdGUoKTtcbiAgICAgIHRoaXMud29ya2Zsb3dOYW1lID0gbmFtZSArIHRoaXMud29ya2Zsb3dEYXRlO1xuICAgICAgdGhpcy5zdGF0dXMgPSAnbmV3JztcbiAgICB9ZWxzZXtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi93b3JrZmxvdy93b3JrZmxvdy1pbmZvXCIsIHRoaXMuZGlyZWN0b3J5LCBcIi9pbmZvLmpzb25cIik7XG4gICAgICB4aHIoe3VyaTogZW5kcG9pbnQsIGpzb246IHRydWV9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSl7XG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1c0NvZGUgPCA0MDApIHtcbiAgICAgICAgICBzZWxmLm1vZGVsRGlyZWN0b3J5ID0gYm9keS5tb2RlbC5zcGxpdCgnL2hvbWUvam92eWFuJykucG9wKCk7XG4gICAgICAgICAgc2VsZi50eXBlID0gYm9keS50eXBlO1xuICAgICAgICAgIHNlbGYudGl0bGVUeXBlID0gdHlwZXNbc2VsZi50eXBlXVxuICAgICAgICAgIHNlbGYuc3RhcnRUaW1lID0gYm9keS5zdGFydF90aW1lO1xuICAgICAgICAgIHZhciB3b3JrZmxvd0RpciA9IHNlbGYuZGlyZWN0b3J5LnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgICAgc2VsZi53b3JrZmxvd05hbWUgPSB3b3JrZmxvd0Rpci5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIHZhciBzdGF0dXNFbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi93b3JrZmxvdy93b3JrZmxvdy1zdGF0dXNcIiwgc2VsZi5kaXJlY3RvcnkpO1xuICAgICAgICAgIHhocih7dXJpOiBzdGF0dXNFbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgICAgICBzZWxmLnN0YXR1cyA9IGJvZHk7XG4gICAgICAgICAgICBpZihzZWxmLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJyB8fCBzZWxmLnN0YXR1cyA9PT0gJ2Vycm9yJyl7XG4gICAgICAgICAgICAgIHNlbGYubW9kZWxEaXJlY3RvcnkgPSBwYXRoLmpvaW4oc2VsZi5kaXJlY3RvcnksIHNlbGYubW9kZWxEaXJlY3Rvcnkuc3BsaXQoJy8nKS5wb3AoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnJlbmRlclN1YnZpZXdzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgUGFnZVZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKHRoaXMubW9kZWxEaXJlY3Rvcnkpe1xuICAgICAgdGhpcy5yZW5kZXJTdWJ2aWV3cygpXG4gICAgfVxuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJwYWdlLXRpdGxlXCIpKS50ZXh0KCdXb3JrZmxvdzogJyt0aGlzLnRpdGxlVHlwZSlcbiAgICB2YXIgaW5wdXROYW1lID0gbmV3IElucHV0Vmlldyh7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgIGxhYmVsOiAnV29ya2Zsb3cgTmFtZTogJyxcbiAgICAgIHRlc3RzOiAnJyxcbiAgICAgIG1vZGVsS2V5OiBudWxsLFxuICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgIHZhbHVlOiB0aGlzLndvcmtmbG93TmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhpbnB1dE5hbWUsICd3b3JrZmxvdy1uYW1lJyk7XG4gICAgdGhpcy5yZW5kZXJXb3JrZmxvd0VkaXRvcigpO1xuICAgIHRoaXMucmVuZGVyV29ya2Zsb3dTdGF0dXNWaWV3KCk7XG4gICAgdGhpcy51cGRhdGVUcmFqZWN0b3JpZXMoKTtcbiAgICB0aGlzLnJlbmRlck1vZGVsVmlld2VyKCk7XG4gICAgdGhpcy5yZW5kZXJJbmZvVmlldygpO1xuICAgIGlmKHRoaXMuc3RhdHVzICE9PSAnbmV3Jyl7XG4gICAgICB0aGlzLmRpc2FibGVXb3JrZmxvd05hbWVJbnB1dCgpO1xuICAgIH1cbiAgICBpZih0aGlzLnN0YXR1cyAhPT0gJ25ldycgJiYgdGhpcy5zdGF0dXMgIT09ICdyZWFkeScpe1xuICAgICAgdGhpcy53b3JrZmxvd0VkaXRvci5jb2xsYXBzZUNvbnRhaW5lcigpO1xuICAgIH1cbiAgICBpZih0aGlzLnN0YXR1cyA9PT0gJ3J1bm5pbmcnKXtcbiAgICAgIHRoaXMuZ2V0V29ya2Zsb3dTdGF0dXMoKTtcbiAgICB9XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBzZXRXb3JrZmxvd05hbWU6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgbmV3V29ya2Zsb3dOYW1lID0gZS50YXJnZXQudmFsdWU7XG4gICAgaWYobmV3V29ya2Zsb3dOYW1lLmVuZHNXaXRoKHRoaXMud29ya2Zsb3dEYXRlKSl7XG4gICAgICB0aGlzLndvcmtmbG93TmFtZSA9IG5ld1dvcmtmbG93TmFtZVxuICAgIH1lbHNle1xuICAgICAgdGhpcy53b3JrZmxvd05hbWUgPSBuZXdXb3JrZmxvd05hbWUgKyB0aGlzLndvcmtmbG93RGF0ZVxuICAgICAgZS50YXJnZXQudmFsdWUgPSB0aGlzLndvcmtmbG93TmFtZVxuICAgIH1cbiAgfSxcbiAgZ2V0Q3VycmVudERhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgdmFyIG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICBpZihtb250aCA8IDEwKXtcbiAgICAgIG1vbnRoID0gXCIwXCIgKyBtb250aFxuICAgIH1cbiAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgaWYoZGF5IDwgMTApe1xuICAgICAgZGF5ID0gXCIwXCIgKyBkYXlcbiAgICB9XG4gICAgdmFyIGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xuICAgIGlmKGhvdXJzIDwgMTApe1xuICAgICAgaG91cnMgPSBcIjBcIiArIGhvdXJzXG4gICAgfVxuICAgIHZhciBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgaWYobWludXRlcyA8IDEwKXtcbiAgICAgIG1pbnV0ZXMgPSBcIjBcIiArIG1pbnV0ZXNcbiAgICB9XG4gICAgdmFyIHNlY29uZHMgPSBkYXRlLmdldFNlY29uZHMoKTtcbiAgICBpZihzZWNvbmRzIDwgMTApe1xuICAgICAgc2Vjb25kcyA9IFwiMFwiICsgc2Vjb25kc1xuICAgIH1cbiAgICByZXR1cm4gXCJfXCIgKyBtb250aCArIGRheSArIHllYXIgKyBcIl9cIiArIGhvdXJzICsgbWludXRlcyArIHNlY29uZHM7XG4gIH0sXG4gIGRpc2FibGVXb3JrZmxvd05hbWVJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwid29ya2Zsb3ctbmFtZVwiKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICB9LFxuICByZW5kZXJXb3JrZmxvd0VkaXRvcjogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMud29ya2Zsb3dFZGl0b3JWaWV3KXtcbiAgICAgIHRoaXMud29ya2Zsb3dFZGl0b3JWaWV3LnJlbW92ZSgpXG4gICAgfVxuICAgIHRoaXMud29ya2Zsb3dFZGl0b3IgPSBuZXcgV29ya2Zsb3dFZGl0b3JWaWV3KHtcbiAgICAgIGRpcmVjdG9yeTogdGhpcy5tb2RlbERpcmVjdG9yeSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICB9KTtcbiAgICB0aGlzLndvcmtmbG93RWRpdG9yVmlldyA9IHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMud29ya2Zsb3dFZGl0b3IsICd3b3JrZmxvdy1lZGl0b3ItY29udGFpbmVyJyk7XG4gIH0sXG4gIHJlbmRlcldvcmtmbG93U3RhdHVzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMud29ya2Zsb3dTdGF0dXNWaWV3KXtcbiAgICAgIHRoaXMud29ya2Zsb3dTdGF0dXNWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB2YXIgc3RhdHVzVmlldyA9IG5ldyBXb3JrZmxvd1N0YXR1c1ZpZXcoe1xuICAgICAgc3RhcnRUaW1lOiB0aGlzLnN0YXJ0VGltZSxcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgfSk7XG4gICAgdGhpcy53b3JrZmxvd1N0YXR1c1ZpZXcgPSB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzdGF0dXNWaWV3LCAnd29ya2Zsb3ctc3RhdHVzLWNvbnRhaW5lcicpO1xuICB9LFxuICBnZXRXb3JrZmxvd0luZm86IGZ1bmN0aW9uIChjYikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvd29ya2Zsb3cvd29ya2Zsb3ctaW5mb1wiLCB0aGlzLmRpcmVjdG9yeSwgXCIvaW5mby5qc29uXCIpO1xuICAgIHhocih7dXJpOiBlbmRwb2ludCwganNvbjogdHJ1ZX0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KXtcbiAgICAgIHNlbGYuc3RhcnRUaW1lID0gYm9keS5zdGFydF90aW1lO1xuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0V29ya2Zsb3dTdGF0dXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHN0YXR1c0VuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiL3dvcmtmbG93L3dvcmtmbG93LXN0YXR1c1wiLCB0aGlzLmRpcmVjdG9yeSk7XG4gICAgeGhyKHt1cmk6IHN0YXR1c0VuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgIGlmKHNlbGYuc3RhdHVzICE9PSBib2R5ICl7XG4gICAgICAgIHNlbGYuc3RhdHVzID0gYm9keTtcbiAgICAgICAgc2VsZi5yZW5kZXJXb3JrZmxvd1N0YXR1c1ZpZXcoKTtcbiAgICAgIH1cbiAgICAgIGlmKHNlbGYuc3RhdHVzICE9PSAnZXJyb3InICYmIHNlbGYuc3RhdHVzICE9PSAnY29tcGxldGUnKXtcbiAgICAgICAgc2V0VGltZW91dChfLmJpbmQoc2VsZi5nZXRXb3JrZmxvd1N0YXR1cywgc2VsZiksIDEwMDApO1xuICAgICAgfWVsc2UgaWYoc2VsZi5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgc2VsZi5yZW5kZXJSZXN1bHRzVmlldygpO1xuICAgICAgICBzZWxmLnJlbmRlck1vZGVsVmlld2VyKCk7XG4gICAgICAgIHNlbGYucmVuZGVySW5mb1ZpZXcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlV29ya2Zsb3dTdGF0dXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7ICBcbiAgICAgIHNlbGYuZ2V0V29ya2Zsb3dJbmZvKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5nZXRXb3JrZmxvd1N0YXR1cygpO1xuICAgICAgfSk7XG4gICAgfSwgMzAwMCk7XG4gIH0sXG4gIHJlbmRlclJlc3VsdHNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy53b3JrZmxvd1Jlc3VsdHNWaWV3KXtcbiAgICAgIHRoaXMud29ya2Zsb3dSZXN1bHRzVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdHNWaWV3ID0gbmV3IFdvcmtmbG93UmVzdWx0c1ZpZXcoe1xuICAgICAgdHJhamVjdG9yaWVzOiB0aGlzLnRyYWplY3RvcmllcyxcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBzcGVjaWVzOiB0aGlzLnNwZWNpZXMsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBzcGVjaWVzT2ZJbnRlcmVzdDogdGhpcy5zcGVjaWVzT2ZJbnRlcmVzdC5uYW1lXG4gICAgfSk7XG4gICAgdGhpcy53b3JrZmxvd1Jlc3VsdHNWaWV3ID0gdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocmVzdWx0c1ZpZXcsICd3b3JrZmxvdy1yZXN1bHRzLWNvbnRhaW5lcicpO1xuICB9LFxuICByZW5kZXJNb2RlbFZpZXdlcjogZnVuY3Rpb24gKCl7XG4gICAgaWYodGhpcy5tb2RlbFZpZXdlcil7XG4gICAgICB0aGlzLm1vZGVsVmlld2VyLnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLm1vZGVsVmlld2VyID0gbmV3IE1vZGVsVmlld2VyKHtcbiAgICAgIGRpcmVjdG9yeTogdGhpcy5tb2RlbERpcmVjdG9yeSxcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICB0eXBlOiB0aGlzLnR5cGVcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0aGlzLm1vZGVsVmlld2VyLCAnbW9kZWwtdmlld2VyLWNvbnRhaW5lcicpXG4gIH0sXG4gIHJlbmRlckluZm9WaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5pbmZvVmlldyl7XG4gICAgICB0aGlzLmluZm9WaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmluZm9WaWV3ID0gbmV3IEluZm9WaWV3KHtcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBsb2dzUGF0aDogcGF0aC5qb2luKHRoaXMuZGlyZWN0b3J5LCBcImxvZ3MudHh0XCIpXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5pbmZvVmlldywgJ3dvcmtmbG93LWluZm8tY29udGFpbmVyJylcbiAgfSxcbiAgdXBkYXRlVHJhamVjdG9yaWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgaWYodGhpcy50cmFqZWN0b3JpZXMgPT09IHVuZGVmaW5lZCl7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi51cGRhdGVUcmFqZWN0b3JpZXMoKVxuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICB0aGlzLnRyYWplY3RvcmllcyA9IHRoaXMud29ya2Zsb3dFZGl0b3JWaWV3Lm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncy5hbGdvcml0aG0gIT09IFwiT0RFXCIgPyB0aGlzLnRyYWplY3RvcmllcyA6IDFcbiAgICAgIHRoaXMucmVuZGVyUmVzdWx0c1ZpZXcoKVxuICAgIH1cbiAgfSxcbn0pO1xuXG5pbml0UGFnZShXb3JrZmxvd01hbmFnZXIpO1xuIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVmFyaWFibGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VFeHByZXNzaW9uXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwidmlldy1ldmVudC1hc3NpZ25tZW50cy1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcImV2ZW50cy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUV2ZW50c1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtbW9kZWwtZXZlbnRzLXZpZXdlclxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvdyBjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtbW9kZWwtZXZlbnRzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRURlbGF5XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFUHJpb3JpdHlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUcmlnZ2dlclxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUFzc2lnbm1lbnRzXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVXNlIFZhbHVlcyBGcm9tXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwidmlldy1ldmVudHMtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LXJlc3VsdHNcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlc3VsdHNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctcmVzdWx0c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1wbG90LWFyZ3NcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVRpdGxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWC1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWS1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInRpdGxlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieGF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ5YXhpc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBUcmFqZWN0b3JpZXNcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidHJhamVjdG9yaWVzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJwbG90XFxcIlxcdTAwM0VFZGl0IFBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcmVzdWx0cy1jc3ZcXFwiXFx1MDAzRURvd25sb2FkIFJlc3VsdHMgYXMgLmNzdlxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1yZXN1bHRzLWVuc2VtYmxlXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VSZXN1bHRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIiBkaXNhYmxlZFxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXJlc3VsdHNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtcGxvdC1hcmdzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUaXRsZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVgtYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVktYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0aXRsZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInhheGlzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieWF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBsb3QgU3RhbmRhcmQgRGV2aWF0aW9uIFJhbmdlXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zdGRkZXZyYW5nZVxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZS1zdGRkZXZyYW5nZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1zdGRkZXZyYW5nZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN0ZGRldnJhblxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJzdGRkZXZyYW5cXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFRWRpdCBQbG90XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJzdGRkZXZyYW5cXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcG5nLWN1c3RvbVxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgUE5HXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJzdGRkZXZyYW5cXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtanNvblxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgSlNPTlxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQbG90IFRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXRyYWplY3Rvcmllc1xcXCJcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidHJhamVjdG9yaWVzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJwbG90XFxcIlxcdTAwM0VQbG90XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwicGxvdC1tdWx0aXBsZVxcXCIgZGlzYWJsZWRcXHUwMDNFTXVsdGlwbGUgUGxvdHNcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBsb3QgU3RhbmRhcmQgRGV2aWF0aW9uXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zdGRkZXZcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2Utc3RkZGV2XFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1zdGRkZXZcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdGRkZXZcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwic3RkZGV2XFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRVBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldlxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldlxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBsb3QgVHJhamVjdG9yeSBNZWFuXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS10cmFqbWVhblxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZS10cmFqbWVhblxcXCJcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2UtdHJham1lYW5cXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJhdmdcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwiYXZnXFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRVBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcImF2Z1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcImF2Z1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcmVzdWx0cy1jc3ZcXFwiXFx1MDAzRURvd25sb2FkIFJlc3VsdHMgYXMgLmNzdlxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJtb2RlbC1zZXR0aW5ncy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU1vZGVsIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1tb2RlbC1zZXR0aW5ncy12aWV3ZXJcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3cgY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLW1vZGVsLXNldHRpbmdzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRW5kIFNpbXVsYXRpb25cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUaW1lIFN0ZXBzXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVm9sdW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5lbmRTaW0pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC50aW1lU3RlcCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnZvbHVtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJtb2RlbC12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU1vZGVsXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1tb2RlbFxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZS1tb2RlbFxcXCIgZGlzYWJsZWRcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2UtbW9kZWxcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1XFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzcGVjaWVzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJwYXJhbWV0ZXJzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJyZWFjdGlvbnMtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImV2ZW50cy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicnVsZXMtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1vZGVsLXNldHRpbmdzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJwYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3Mtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInNpbXVsYXRpb24tc2V0dGluZ3Mtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LXJlc3VsdHNcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlc3VsdHNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXJlc3VsdHNcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctcmVzdWx0c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1wbG90LWFyZ3NcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVRpdGxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWC1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWS1heGlzIExhYmVsXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInRpdGxlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieGF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ5YXhpc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiaW5saW5lXFxcIiBmb3I9XFxcInNwZWNpZXMtb2YtaW50ZXJlc3RcXFwiXFx1MDAzRVNwZWNpZXMgb2YgSW50ZXJlc3Q6XFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnNwZWNpZXMsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCIgaWQ9XFxcInNwZWNpZXMtb2YtaW50ZXJlc3RcXFwiIGRhdGEtaG9vaz1cXFwic3BlY2llLW9mLWludGVyZXN0LWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiaW5saW5lXFxcIiBmb3I9XFxcImZlYXR1cmUtZXh0cmFjdG9yXFxcIlxcdTAwM0VGZWF0dXJlIEV4dHJhY3Rpb246IFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5zcGVjaWVzLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiIGlkPVxcXCJmZWF0dXJlLWV4dHJhY3RvclxcXCIgZGF0YS1ob29rPVxcXCJmZWF0dXJlLWV4dHJhY3Rpb24tbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lIGhvcml6b250YWwtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmVcXFwiIGZvcj1cXFwiZW5zZW1ibGUtYWdncmFnYXRvclxcXCJcXHUwMDNFRW5zZW1ibGUgQWdncmFnYXRvcjogXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnNwZWNpZXMsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCIgaWQ9XFxcImVuc2VtYmxlLWFnZ3JhZ2F0b3JcXFwiIGRhdGEtaG9vaz1cXFwiZW5zZW1ibGUtYWdncmFnYXRvci1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGFyYW1ldGVyIFN3ZWVwXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1wc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtcHN3ZWVwXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXBzd2VlcFxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInBzd2VlcFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJwc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFRWRpdCBQbG90XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJwc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcG5nLWN1c3RvbVxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgUE5HXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJwc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtanNvblxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgSlNPTiBcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1yZXN1bHRzLWNzdlxcXCJcXHUwMDNFRG93bmxvYWQgUmVzdWx0cyBhcyAuY3N2XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInBhcmFtZXRlci1zd2VlcC1zZXR0aW5nc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGFyYW1ldGVyIFN3ZWVwIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1wc3dlZXAtc2V0dGluZ3NcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtcHN3ZWVwLXNldHRpbmdzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IHZlcnRpY2xlLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTd2VlcCBUeXBlOlxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnN3ZWVwVHlwZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInN3ZWVwVHlwZVxcXCIgZGF0YS1ob29rPVxcXCJvbmUtcGFyYW1ldGVyXFxcIiBkYXRhLW5hbWU9XFxcIjFEXFxcIiBjaGVja2VkXFx1MDAzRSBPbmUgUGFyYW1ldGVyXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lIGhvcml6b250YWwtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic3dlZXBUeXBlXFxcIiBkYXRhLWhvb2s9XFxcInR3by1wYXJhbWV0ZXJcXFwiIGRhdGEtbmFtZT1cXFwiMkRcXFwiIGRpc2FibGVkXFx1MDAzRSBUd28gUGFyYW1ldGVyc1xcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IHZlcnRpY2xlLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiaW5saW5lXFxcIiBmb3I9XFxcInNwZWNpZXMtb2YtaW50ZXJlc3RcXFwiXFx1MDAzRVNwZWNpZXMgb2YgSW50ZXJlc3Q6XFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnNwZWNpZXMsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCIgaWQ9XFxcInNwZWNpZXMtb2YtaW50ZXJlc3RcXFwiIGRhdGEtaG9vaz1cXFwic3BlY2llLW9mLWludGVyZXN0LWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NoNVxcdTAwM0VDb25maWd1cmUgVmFyaWFibGUocylcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTd2VlcCBWYXJpYWJsZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnZhcmlhYmxlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFQ3VycmVudCBWYWx1ZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnZhbHVlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTWluaW11bSBWYWx1ZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm1pbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU1heGltdW0gVmFsdWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5tYXgsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTdGVwc1xcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnN0ZXBzLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3dlZXAtdmFyaWFibGUtb25lLXNlbGVjdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImN1cnJlbnQtdmFsdWUtb25lLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibWluaW11bS12YWx1ZS1vbmUtaW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtYXhpbXVtLXZhbHVlLW9uZS1pbnB1dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN0ZXAtb25lLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ3RyIGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJwYXJhbWV0ZXItdHdvLXJvd1xcXCJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzd2VlcC12YXJpYWJsZS10d28tc2VsZWN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiY3VycmVudC12YWx1ZS10d28taW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtaW5pbXVtLXZhbHVlLXR3by1pbnB1dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1heGltdW0tdmFsdWUtdHdvLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3RlcC10d28taW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInBhcmFtZXRlci1zd2VlcC1zZXR0aW5ncy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBhcmFtZXRlciBTd2VlcCBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcHN3ZWVwLXNldHRpbmdzLXZpZXdlclxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1wc3dlZXAtc2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2IHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAwLjc1cmVtO1xcXCIgZGF0YS1ob29rPVxcXCJzd2VlcC10eXBlLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN3ZWVwIFZhcmlhYmxlc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVmFyaWFibGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VDdXJyZW50IFZhbHVlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTWluaW11bSBWYWx1ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1heGltdW0gVmFsdWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdGVwc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucGFyYW1ldGVyT25lLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGQgZGF0YS1ob29rPVxcXCJwMS1jdXJyZW50LXZhbHVlLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wMU1pbikgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnAxTWF4KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucDFTdGVwcykgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ3RyIGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJwMi12YXJpYWJsZS12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnBhcmFtZXRlclR3by5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkIGRhdGEtaG9vaz1cXFwicDItY3VycmVudC12YWx1ZS12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucDJNaW4pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wMk1heCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnAyU3RlcHMpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicGFyYW1ldGVycy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBhcmFtZXRlcnNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXBhcmFtZXRlcnNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtcGFyYW1ldGVyc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTktdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRXhwcmVzc2lvblxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcInBhcmFtZXRlci1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJlYWN0aW9ucy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlYWN0aW9uc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVhY3Rpb25zXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJlYWN0aW9uc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3VtbWFyeVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtNi12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSYXRlXFx1MDAyRlByb3BlbnNpdHlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJ1bGVzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUnVsZXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJ1bGVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJ1bGVzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUeXBlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVZhcmlhYmxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJydWxlcy1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNpbXVsYXRpb24tc2V0dGluZ3NcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNpbXVsYXRpb24gU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXNldHRpbmdzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNldHRpbmdzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIiBjb2xzcGFuPVxcXCI1XFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU2ltdWxhdGlvbiBBbGdvcml0aG1cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbGdvcml0aG0sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic2ltQWxnb3JpdGhtXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1vZGVcXFwiIGRhdGEtbmFtZT1cXFwiT0RFXFxcIlxcdTAwM0UgT0RFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMub2RlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNpbUFsZ29yaXRobVxcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3Qtc3NhXFxcIiBkYXRhLW5hbWU9XFxcIlNTQVxcXCJcXHUwMDNFIFNTQVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnNzYSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LXRhdS1sZWFwaW5nXFxcIiBkYXRhLW5hbWU9XFxcIlRhdS1MZWFwaW5nXFxcIlxcdTAwM0UgVGF1IExlYXBpbmdcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy50YXVMZWFwaW5nLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNpbUFsZ29yaXRobVxcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3QtaHlicmlkLXRhdVxcXCIgZGF0YS1uYW1lPVxcXCJIeWJyaWQtVGF1LUxlYXBpbmdcXFwiXFx1MDAzRSBIeWJyaWQgT0RFXFx1MDAyRlNTQVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLmh5YnJpZCwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IGNsYXNzPVxcXCJpbmxpbmVcXFwiIHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LWF1dG9tYXRpY1xcXCIgZGF0YS1uYW1lPVxcXCJBdXRvbWF0aWNcXFwiXFx1MDAzRSBDaG9vc2UgZm9yIG1lXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuY2hvb3NlRm9yTWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNVxcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRURldGVybWluaXN0aWMgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUmVsYXRpdmUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMucnRvbCwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFIFxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBYnNvbHV0ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hdG9sLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVsYXRpdmUtdG9sZXJhbmNlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiYWJzb2x1dGUtdG9sZXJhbmNlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC03XFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RvY2hhc3RpYyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJlYWxpemF0aW9ucywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNlZWRcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5zZWVkLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFVGF1IFRvbGVyYW5jZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnR0b2wsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzZWVkXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGF1LXRvbGVyYW5jZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTaW11bGF0aW9uIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zZXR0aW5ncy12aWV3ZXJcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3cgY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNldHRpbmdzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEyXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMC43NXJlbTtcXFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuYWxnb3JpdGhtKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IGNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImRldGVybWluaXN0aWNcXFwiXFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VEZXRlcm1pbmlzdGljIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZWxhdGl2ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VBYnNvbHV0ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnJlbGF0aXZlVG9sKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuYWJzb2x1dGVUb2wpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNiBjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJzdG9jaGFzdGljXFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RvY2hhc3RpYyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiU1NBXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOdW1iZXIgb2YgVHJhamVjdG9yaWVzXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU2VlZFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucmVhbGl6YXRpb25zKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuc2VlZCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcIlRhdVxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTnVtYmVyIG9mIFRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVNlZWRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUYXUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5yZWFsaXphdGlvbnMpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5zZWVkKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudGF1VG9sKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNwZWNpZXMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTcGVjaWVzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zcGVjaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNwZWNpZXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUluaXRpYWwgQ29uZGl0aW9uXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1vZGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3dpdGNoIFRvbGVyYW5jZVxcdTAwMkZNaW5pbXVtIFZhbHVlIGZvciBTd2l0Y2hpbmdcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJzcGVjaWUtbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnZhcmlhYmxlLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5leHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuZGVsYXkpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wcmlvcml0eSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IFwiRXhwcmVzc2lvbjogXCIgKyB0aGlzLm1vZGVsLnRyaWdnZXJFeHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNoZWNrYm94XFxcIiBmb3I9XFxcImluaXRpYWwtdmFsdWVcXFwiXFx1MDAzRUluaXRpYWwgVmFsdWU6IFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGlkPVxcXCJpbml0aWFsLXZhbHVlXFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50LXRyaWdnZXItaW5pdC12YWx1ZVxcXCIgZGlzYWJsZWRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2hlY2tib3hcXFwiIGZvcj1cXFwicGVyc2lzdGVudFxcXCJcXHUwMDNFUGVyc2lzdGVudDogXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgaWQ9XFxcInBlcnNpc3RlbnRcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtdHJpZ2dlci1wZXJzaXN0ZW50XFxcIiBkaXNhYmxlZFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiYXNzaWdubWVudC12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCIgZm9yPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiXFx1MDAzRVRyZ2dpZXIgVGltZVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIGlkPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiIG5hbWU9XFxcInVzZS12YWx1ZXMtZnJvbVxcXCIgZGF0YS1ob29rPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiIGRpc2FibGVkXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIiBmb3I9XFxcImFzc2lnbm1lbnQtdGltZVxcXCJcXHUwMDNFQXNzaWdubWVudCBUaW1lXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgaWQ9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgbmFtZT1cXFwidXNlLXZhbHVlcy1mcm9tXFxcIiBkYXRhLWhvb2s9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgZGlzYWJsZWRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5leHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdW1tYXJ5XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnJhdGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC50eXBlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudmFyaWFibGUubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLmV4cHJlc3Npb24pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC52YWx1ZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm1vZGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5zd2l0Y2hpbmdWYWxXaXRoTGFiZWwpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1uYW1lLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgZGF0YS1ob29rPVxcXCJwYXJhbS1zd2VlcC1zZXR0aW5ncy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzaW0tc2V0dGluZ3MtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctc3RhdGUtYnV0dG9ucy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1pbmZvLXZpZXdcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUluZm9cXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLWluZm9cXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLWluZm9cXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctaW5mb1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctc3RhdGlzdGljc1xcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN0YXRpc3RpY3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJsaXN0LW9mLW5vdGVzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy13YXJuaW5nc1xcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVdhcm5pbmdzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibGlzdC1vZi13YXJuaW5nc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctZXJyb3JzXFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXJyb3JzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibGlzdC1vZi1lcnJvcnNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJzYXZlXFxcIlxcdTAwM0VTYXZlXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuIHNhdmluZy1zdGF0dXNcXFwiIGRhdGEtaG9vaz1cXFwic2F2aW5nLXdvcmtmbG93XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJzcGlubmVyLWdyb3dcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NzcGFuXFx1MDAzRVNhdmluZy4uLlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZGwtZWRpdC1idG4gc2F2ZWQtc3RhdHVzXFxcIiBkYXRhLWhvb2s9XFxcInNhdmVkLXdvcmtmbG93XFxcIlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VTYXZlZFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZGwtZWRpdC1idG4gc2F2ZS1lcnJvci1zdGF0dXNcXFwiIGRhdGEtaG9vaz1cXFwic2F2ZS1lcnJvclxcXCJcXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFRXJyb3IgU2F2aW5nIE1vZGVsXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcInN0YXJ0LXdvcmtmbG93XFxcIlxcdTAwM0VTdGFydCBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtbW9kZWxcXFwiXFx1MDAzRUVkaXQgTW9kZWxcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwid29ya2Zsb3ctc3RhdHVzXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTdGF0dXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCIgZGlzYWJsZWRcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2Utc3RhdHVzXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXN0YXR1c1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRGF0ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVN0YXR1c1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuc3RhcnRUaW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuc3RhdHVzKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTtcXFwiXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwic3RvcC13b3JrZmxvd1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBkaXNhYmxlZFxcdTAwM0VTdG9wIFdvcmtmbG93XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJyZXN0YXJ0LXdvcmtmbG93XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIGRpc2FibGVkXFx1MDAzRVJlc3RhcnQgV29ya2Zsb3dcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzZWN0aW9uIGNsYXNzPVxcXCJwYWdlXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMiBjbGFzcz1cXFwiaW5saW5lXFxcIiBkYXRhLWhvb2s9XFxcInBhZ2UtdGl0bGVcXFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IFwiV29ya2Zsb3c6IFwiK3RoaXMudGl0bGVUeXBlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGaDJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYmlnLXRpcCBidG4gaW5mb3JtYXRpb24tYnRuIGhlbHBcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC13b3JrZmxvdy1oZWxwXFxcIlxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFyXFxcIiBkYXRhLWljb249XFxcInF1ZXN0aW9uLWNpcmNsZVxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLXF1ZXN0aW9uLWNpcmNsZSBmYS13LTE2XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDUxMiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTI1NiA4QzExOS4wNDMgOCA4IDExOS4wODMgOCAyNTZjMCAxMzYuOTk3IDExMS4wNDMgMjQ4IDI0OCAyNDhzMjQ4LTExMS4wMDMgMjQ4LTI0OEM1MDQgMTE5LjA4MyAzOTIuOTU3IDggMjU2IDh6bTAgNDQ4Yy0xMTAuNTMyIDAtMjAwLTg5LjQzMS0yMDAtMjAwIDAtMTEwLjQ5NSA4OS40NzItMjAwIDIwMC0yMDAgMTEwLjQ5MSAwIDIwMCA4OS40NzEgMjAwIDIwMCAwIDExMC41My04OS40MzEgMjAwLTIwMCAyMDB6bTEwNy4yNDQtMjU1LjJjMCA2Ny4wNTItNzIuNDIxIDY4LjA4NC03Mi40MjEgOTIuODYzVjMwMGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyaC00NS42NDdjLTYuNjI3IDAtMTItNS4zNzMtMTItMTJ2LTguNjU5YzAtMzUuNzQ1IDI3LjEtNTAuMDM0IDQ3LjU3OS02MS41MTYgMTcuNTYxLTkuODQ1IDI4LjMyNC0xNi41NDEgMjguMzI0LTI5LjU3OSAwLTE3LjI0Ni0yMS45OTktMjguNjkzLTM5Ljc4NC0yOC42OTMtMjMuMTg5IDAtMzMuODk0IDEwLjk3Ny00OC45NDIgMjkuOTY5LTQuMDU3IDUuMTItMTEuNDYgNi4wNzEtMTYuNjY2IDIuMTI0bC0yNy44MjQtMjEuMDk4Yy01LjEwNy0zLjg3Mi02LjI1MS0xMS4wNjYtMi42NDQtMTYuMzYzQzE4NC44NDYgMTMxLjQ5MSAyMTQuOTQgMTEyIDI2MS43OTQgMTEyYzQ5LjA3MSAwIDEwMS40NSAzOC4zMDQgMTAxLjQ1IDg4Ljh6TTI5OCAzNjhjMCAyMy4xNTktMTguODQxIDQyLTQyIDQycy00Mi0xOC44NDEtNDItNDIgMTguODQxLTQyIDQyLTQyIDQyIDE4Ljg0MSA0MiA0MnpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctbmFtZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1zdGF0dXMtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctcmVzdWx0cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1pbmZvLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1vZGVsLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJjb21wdXRhdGlvbmFsLXJlc291cmNlcy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc2VjdGlvblxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3QXNzaWdubWVudHMgPSByZXF1aXJlKCcuL3ZpZXctZXZlbnQtYXNzaWdubWVudHMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRBc3NpZ25tZW50c1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3QXNzaWdubWVudHMsICd2aWV3LWV2ZW50LWFzc2lnbm1lbnRzLWxpc3QnKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgVmlld0V2ZW50ID0gcmVxdWlyZSgnLi92aWV3LWV2ZW50cycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudHNWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdFdmVudCwgdGhpcy5xdWVyeUJ5SG9vaygndmlldy1ldmVudHMtY29udGFpbmVyJykpXG4gIH0sXG4gIGNoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxTZXR0aW5nc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIGNoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFNwZWNpZXNWaWV3ZXIgPSByZXF1aXJlKCcuL3NwZWNpZXMtdmlld2VyJyk7XG52YXIgUGFyYW1ldGVyc1ZpZXdlciA9IHJlcXVpcmUoJy4vcGFyYW1ldGVycy12aWV3ZXInKTtcbnZhciBSZWFjdGlvbnNWaWV3ZXIgPSByZXF1aXJlKCcuL3JlYWN0aW9ucy12aWV3ZXInKTtcbnZhciBFdmVudHNWaWV3ZXIgPSByZXF1aXJlKCcuL2V2ZW50cy12aWV3ZXInKTtcbnZhciBSdWxlc1ZpZXdlciA9IHJlcXVpcmUoJy4vcnVsZXMtdmlld2VyJyk7XG52YXIgTW9kZWxTZXR0aW5nc1ZpZXdlciA9IHJlcXVpcmUoJy4vbW9kZWwtc2V0dGluZ3Mtdmlld2VyJyk7XG52YXIgU2ltdWxhdGlvblNldHRpbmdzVmlld2VyID0gcmVxdWlyZSgnLi9zaW11bGF0aW9uLXNldHRpbmdzLXZpZXdlcicpO1xudmFyIFBhcmFtZXRlclN3ZWVwU2V0dGluZ3NWaWV3ZXIgPSByZXF1aXJlKCcuL3BhcmFtZXRlci1zd2VlcC1zZXR0aW5ncy12aWV3ZXInKTtcbi8vbW9kZWxzXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvbW9kZWwnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLW1vZGVsXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc3RhdHVzID0gYXR0cnMuc3RhdHVzO1xuICAgIHRoaXMud2tmbFR5cGUgPSBhdHRycy50eXBlO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlyZWN0b3J5ID0gYXR0cnMuZGlyZWN0b3J5XG4gICAgdmFyIG1vZGVsRmlsZSA9IGRpcmVjdG9yeS5zcGxpdCgnLycpLnBvcCgpO1xuICAgIHZhciBuYW1lID0gbW9kZWxGaWxlLnNwbGl0KCcuJylbMF07XG4gICAgdmFyIGlzU3BhdGlhbCA9IG1vZGVsRmlsZS5zcGxpdCgnLicpLnBvcCgpLnN0YXJ0c1dpdGgoJ3MnKTtcbiAgICB0aGlzLm1vZGVsID0gbmV3IE1vZGVsKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBkaXJlY3Rvcnk6IGRpcmVjdG9yeSxcbiAgICAgIGlzX3NwYXRpYWw6IGlzU3BhdGlhbCxcbiAgICAgIGlzUHJldmlldzogZmFsc2UsXG4gICAgICBmb3I6IFwid2tmbFwiXG4gICAgfSk7XG4gICAgdGhpcy5tb2RlbC5mZXRjaCh7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobW9kZWwsIHJlc3BvbnNlLCBvcHRpb25zKSB7XG4gICAgICAgIHNlbGYucmVuZGVyU3Vidmlld3MoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3BlY2llc1ZpZXdlciA9IG5ldyBTcGVjaWVzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuc3BlY2llcyxcbiAgICB9KTtcbiAgICB2YXIgcGFyYW1ldGVyc1ZpZXdlciA9IG5ldyBQYXJhbWV0ZXJzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucGFyYW1ldGVycyxcbiAgICB9KTtcbiAgICB2YXIgcmVhY3Rpb25zVmlld2VyID0gbmV3IFJlYWN0aW9uc1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnJlYWN0aW9ucyxcbiAgICB9KTtcbiAgICB2YXIgZXZlbnRzVmlld2VyID0gbmV3IEV2ZW50c1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLmV2ZW50c0NvbGxlY3Rpb24sXG4gICAgfSk7XG4gICAgdmFyIHJ1bGVzVmlld2VyID0gbmV3IFJ1bGVzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucnVsZXMsXG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJTaW11bGF0aW9uU2V0dGluZ3NWaWV3KCk7XG4gICAgdmFyIG1vZGVsU2V0dGluZ3NWaWV3ZXIgPSBuZXcgTW9kZWxTZXR0aW5nc1ZpZXdlcih7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbC5tb2RlbFNldHRpbmdzLFxuICAgIH0pO1xuICAgIHZhciBwc3dlZXBTZXR0aW5nc1ZpZXdlciA9IG5ldyBQYXJhbWV0ZXJTd2VlcFNldHRpbmdzVmlld2VyKHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MsXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3BlY2llc1ZpZXdlciwgXCJzcGVjaWVzLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocGFyYW1ldGVyc1ZpZXdlciwgXCJwYXJhbWV0ZXJzLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocmVhY3Rpb25zVmlld2VyLCBcInJlYWN0aW9ucy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGV2ZW50c1ZpZXdlciwgXCJldmVudHMtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhydWxlc1ZpZXdlciwgXCJydWxlcy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KG1vZGVsU2V0dGluZ3NWaWV3ZXIsIFwibW9kZWwtc2V0dGluZ3Mtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICBpZih0aGlzLndrZmxUeXBlID09PSAncGFyYW1ldGVyU3dlZXAnKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhwc3dlZXBTZXR0aW5nc1ZpZXdlciwgJ3BhcmFtZXRlci1zd2VlcC1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyJylcbiAgICB9XG4gICAgaWYodGhpcy5zdGF0dXMgPT09ICdjb21wbGV0ZScpe1xuICAgICAgdGhpcy5lbmFibGVDb2xsYXBzZUJ1dHRvbigpO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyU2ltdWxhdGlvblNldHRpbmdzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuc2ltdWxhdGlvblNldHRpbmdzVmlldyl7XG4gICAgICB0aGlzLnNpbXVsYXRpb25TZXR0aW5nc1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMuc2ltdWxhdGlvblNldHRpbmdzVmlldyA9IG5ldyBTaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwuc2ltdWxhdGlvblNldHRpbmdzLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuc2ltdWxhdGlvblNldHRpbmdzVmlldywgXCJzaW11bGF0aW9uLXNldHRpbmdzLXZpZXdlci1jb250YWluZXJcIik7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZS1tb2RlbCcpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZS1tb2RlbCcpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlLW1vZGVsJykpLnRleHQoJysnKTtcbiAgfSxcbiAgZW5hYmxlQ29sbGFwc2VCdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlLW1vZGVsJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyU3dlZXBTZXR0aW5nc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHN3ZWVwVHlwZSA9IFwiU3dlZXAgVHlwZTogXCJcbiAgICB2YXIgcDFDdXJyZW50VmFsID0gZXZhbCh0aGlzLm1vZGVsLnBhcmFtZXRlck9uZS5leHByZXNzaW9uKVxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygncDEtY3VycmVudC12YWx1ZS12aWV3ZXInKSkudGV4dChwMUN1cnJlbnRWYWwpXG4gICAgaWYodGhpcy5tb2RlbC5pczFEKSB7XG4gICAgICBzd2VlcFR5cGUgKz0gXCJPbmUgUGFyYW1ldGVyXCJcbiAgICB9ZWxzZXtcbiAgICAgIHN3ZWVwVHlwZSArPSBcIlR3byBQYXJhbWV0ZXJzXCJcbiAgICAgIHZhciBwMkN1cnJlbnRWYWwgPSBldmFsKHRoaXMubW9kZWwucGFyYW1ldGVyVHdvLmV4cHJlc3Npb24pXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3AyLWN1cnJlbnQtdmFsdWUtdmlld2VyJykpLnRleHQocDJDdXJyZW50VmFsKVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdwMi12YXJpYWJsZS12aWV3ZXInKSkuY29sbGFwc2UoJ3Nob3cnKVxuICAgIH1cbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3ZWVwLXR5cGUtdmlld2VyJykpLnRleHQoc3dlZXBUeXBlKVxuICB9LFxuICBjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyAiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy9zdXBwb3J0IGZpbGVzXG52YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG52YXIgVG9vbHRpcHMgPSByZXF1aXJlKCcuLi90b29sdGlwcycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlclN3ZWVwU2V0dGluZ3MucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAgJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPW9uZS1wYXJhbWV0ZXJdJyA6ICd1cGRhdGVQYXJhbVN3ZWVwVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXR3by1wYXJhbWV0ZXJdJyA6ICd1cGRhdGVQYXJhbVN3ZWVwVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXN3ZWVwLXZhcmlhYmxlLW9uZS1zZWxlY3RdJyA6ICdzZWxlY3RTd2VlcFZhck9uZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXN3ZWVwLXZhcmlhYmxlLXR3by1zZWxlY3RdJyA6ICdzZWxlY3RTd2VlcFZhclR3bycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNwZWNpZS1vZi1pbnRlcmVzdC1saXN0XScgOiAnc2VsZWN0U3BlY2llc09mSW50ZXJlc3QnXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMucGFyYW1ldGVyU3dlZXBTZXR0aW5nc1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgcGFyYW1ldGVycyA9IHRoaXMubW9kZWwucGFyZW50LnBhcmFtZXRlcnM7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLnBhcmVudC5zcGVjaWVzO1xuICAgIHZhciBwYXJhbU5hbWVzID0gcGFyYW1ldGVycy5tYXAoZnVuY3Rpb24gKHBhcmFtZXRlcikgeyByZXR1cm4gcGFyYW1ldGVyLm5hbWV9KTtcbiAgICB2YXIgc3BlY2llc05hbWVzID0gc3BlY2llcy5tYXAoZnVuY3Rpb24gKHNwZWNpZSkgeyByZXR1cm4gc3BlY2llLm5hbWV9KTtcbiAgICB2YXIgc3BlY2llc09mSW50ZXJlc3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3NwZWNpZXMtb2YtaW50ZXJlc3QnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBzcGVjaWVzTmFtZXMsXG4gICAgICB2YWx1ZTogdGhpcy5tb2RlbC5zcGVjaWVzT2ZJbnRlcmVzdC5uYW1lXG4gICAgfSk7XG4gICAgdmFyIHBhcmFtZXRlck9uZVZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnc3dlZXAtdmFyaWFibGUtb25lJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgb3B0aW9uczogcGFyYW1OYW1lcyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnBhcmFtZXRlck9uZS5uYW1lXG4gICAgfSk7XG4gICAgdmFyIHBhcmFtZXRlclR3b1ZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnc3dlZXAtdmFyaWFibGUtdHdvJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgb3B0aW9uczogcGFyYW1OYW1lcyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnBhcmFtZXRlclR3by5uYW1lXG4gICAgfSk7XG4gICAgaWYodGhpcy5tb2RlbC5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPiAxKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygndHdvLXBhcmFtZXRlcicpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdvbmUtcGFyYW1ldGVyJykpLnByb3AoJ2NoZWNrZWQnLCB0aGlzLm1vZGVsLmlzMUQpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3R3by1wYXJhbWV0ZXInKSkucHJvcCgnY2hlY2tlZCcsICF0aGlzLm1vZGVsLmlzMUQpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2N1cnJlbnQtdmFsdWUtdHdvLWlucHV0JykpLnRleHQoZXZhbCh0aGlzLm1vZGVsLnBhcmFtZXRlclR3by5leHByZXNzaW9uKSlcbiAgICAgIHRoaXMudG9nZ2xlUGFyYW1Ud28oKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHBhcmFtZXRlclR3b1ZpZXcsICdzd2VlcC12YXJpYWJsZS10d28tc2VsZWN0Jyk7XG4gICAgfVxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY3VycmVudC12YWx1ZS1vbmUtaW5wdXQnKSkudGV4dChldmFsKHRoaXMubW9kZWwucGFyYW1ldGVyT25lLmV4cHJlc3Npb24pKVxuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHNwZWNpZXNPZkludGVyZXN0VmlldywgJ3NwZWNpZS1vZi1pbnRlcmVzdC1saXN0Jyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocGFyYW1ldGVyT25lVmlldywgJ3N3ZWVwLXZhcmlhYmxlLW9uZS1zZWxlY3QnKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVBhcmFtU3dlZXBUeXBlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0eXBlID0gZS50YXJnZXQuZGF0YXNldC5uYW1lXG4gICAgdGhpcy5tb2RlbC5pczFEID0gdHlwZSA9PT0gJzFEJ1xuICAgIHRoaXMudG9nZ2xlUGFyYW1Ud28oKVxuICB9LFxuICB0b2dnbGVQYXJhbVR3bzogZnVuY3Rpb24gKCkge1xuICAgIGlmKCF0aGlzLm1vZGVsLmlzMUQpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdwYXJhbWV0ZXItdHdvLXJvdycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgIH1lbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdwYXJhbWV0ZXItdHdvLXJvdycpKS5jb2xsYXBzZSgnaGlkZScpO1xuICAgIH1cbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2VsZWN0U3dlZXBWYXJPbmU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHBhcmFtZXRlciA9IHRoaXMuZ2V0UGFyYW1ldGVyKHZhbCk7XG4gICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJPbmUgPSBwYXJhbWV0ZXJcbiAgICB2YXIgY3VycmVudFZhbHVlID0gZXZhbChwYXJhbWV0ZXIuZXhwcmVzc2lvbilcbiAgICB0aGlzLm1vZGVsLnAxTWluID0gY3VycmVudFZhbHVlICogMC41O1xuICAgIHRoaXMubW9kZWwucDFNYXggPSBjdXJyZW50VmFsdWUgKiAxLjU7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjdXJyZW50LXZhbHVlLW9uZS1pbnB1dCcpKS50ZXh0KGN1cnJlbnRWYWx1ZSk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdtaW5pbXVtLXZhbHVlLW9uZS1pbnB1dCcpKS5maW5kKCdpbnB1dCcpLnZhbCh0aGlzLm1vZGVsLnAxTWluKVxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnbWF4aW11bS12YWx1ZS1vbmUtaW5wdXQnKSkuZmluZCgnaW5wdXQnKS52YWwodGhpcy5tb2RlbC5wMU1heClcbiAgfSxcbiAgc2VsZWN0U3dlZXBWYXJUd286IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHBhcmFtZXRlciA9IHRoaXMuZ2V0UGFyYW1ldGVyKHZhbCk7XG4gICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJUd28gPSBwYXJhbWV0ZXJcbiAgICB2YXIgY3VycmVudFZhbHVlID0gZXZhbChwYXJhbWV0ZXIuZXhwcmVzc2lvbilcbiAgICB0aGlzLm1vZGVsLnAyTWluID0gY3VycmVudFZhbHVlICogMC41O1xuICAgIHRoaXMubW9kZWwucDJNYXggPSBjdXJyZW50VmFsdWUgKiAxLjU7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjdXJyZW50LXZhbHVlLXR3by1pbnB1dCcpKS50ZXh0KGN1cnJlbnRWYWx1ZSk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdtaW5pbXVtLXZhbHVlLXR3by1pbnB1dCcpKS5maW5kKCdpbnB1dCcpLnZhbCh0aGlzLm1vZGVsLnAyTWluKVxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnbWF4aW11bS12YWx1ZS10d28taW5wdXQnKSkuZmluZCgnaW5wdXQnKS52YWwodGhpcy5tb2RlbC5wMk1heClcbiAgfSxcbiAgc2VsZWN0U3BlY2llc09mSW50ZXJlc3Q6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLmdldFNwZWNpZXModmFsKTtcbiAgICB0aGlzLm1vZGVsLnNwZWNpZXNPZkludGVyZXN0ID0gc3BlY2llc1xuICB9LFxuICBnZXRTcGVjaWVzOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5tb2RlbC5wYXJlbnQuc3BlY2llcy5maWx0ZXIoZnVuY3Rpb24gKHNwZWNpZSkge1xuICAgICAgaWYoc3BlY2llLm5hbWUgPT09IG5hbWUpIHJldHVybiBzcGVjaWVcbiAgICB9KVswXTtcbiAgICByZXR1cm4gc3BlY2llcztcbiAgfSxcbiAgZ2V0UGFyYW1ldGVyOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdmFyIHBhcmFtZXRlciA9IHRoaXMubW9kZWwucGFyZW50LnBhcmFtZXRlcnMuZmlsdGVyKGZ1bmN0aW9uIChwYXJhbWV0ZXIpIHtcbiAgICAgIGlmKHBhcmFtZXRlci5uYW1lID09PSB2YWwpIHJldHVybiBwYXJhbWV0ZXI7XG4gICAgfSlbMF07XG4gICAgcmV0dXJuIHBhcmFtZXRlcjtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKVxuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIHBhcmFtMU1pblZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdtaW5pbXVtLXZhbHVlLW9uZS1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTEtbWluLXZhbHVlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwMU1pbicsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMU1pblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMU1heFZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdtYXhpbXVtLXZhbHVlLW9uZS1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTEtbWF4LXZhbHVlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwMU1heCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMU1heFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMVN0ZXBWYWx1ZUlucHV0OiB7XG4gICAgICBob29rOiAnc3RlcC1vbmUtaW5wdXQnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdwYXJhbS0xLXN0ZXAtdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AxU3RlcHMnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwucDFTdGVwc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMk1pblZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdtaW5pbXVtLXZhbHVlLXR3by1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTItbWluLXZhbHVlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwMk1pbicsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMk1pblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMk1heFZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdtYXhpbXVtLXZhbHVlLXR3by1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTItbWF4LXZhbHVlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwMk1heCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMk1heFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMlN0ZXBWYWx1ZUlucHV0OiB7XG4gICAgICBob29rOiAnc3RlcC10d28taW5wdXQnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdwYXJhbS0yLXN0ZXAtdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AyU3RlcHMnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwucDJTdGVwc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9XG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdQYXJhbWV0ZXIgPSByZXF1aXJlKCcuL3ZpZXctcGFyYW1ldGVyJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3UGFyYW1ldGVyLCB0aGlzLnF1ZXJ5QnlIb29rKCdwYXJhbWV0ZXItbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdSZWFjdGlvbnMgPSByZXF1aXJlKCcuL3ZpZXctcmVhY3Rpb25zJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdSZWFjdGlvbnMsIHRoaXMucXVlcnlCeUhvb2soJ3JlYWN0aW9uLWxpc3QnKSlcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3UnVsZXMgPSByZXF1aXJlKCcuL3ZpZXctcnVsZXMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcnVsZXNWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3UnVsZXMsIHRoaXMucXVlcnlCeUhvb2soJ3J1bGVzLWxpc3QnKSlcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvc2ltdWxhdGlvblNldHRpbmdzVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuYWxnb3JpdGhtID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCIgP1xuICAgICAgXCJBbGdvcml0aG06IEh5YnJpZCBPREUvU1NBXCIgOiBcIkFsZ29yaXRobTogXCIgKyB0aGlzLm1vZGVsLmFsZ29yaXRobVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgYWxnb3JpdGhtID0gdGhpcy5tb2RlbC5hbGdvcml0aG1cbiAgICBpZihhbGdvcml0aG0gPT09IFwiT0RFXCIgfHwgYWxnb3JpdGhtID09PSBcIkh5YnJpZC1UYXUtTGVhcGluZ1wiKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnZGV0ZXJtaW5pc3RpYycpKS5jb2xsYXBzZSgnc2hvdycpXG4gICAgfVxuICAgIGlmKGFsZ29yaXRobSA9PT0gXCJTU0FcIiB8fCBhbGdvcml0aG0gPT09IFwiVGF1LUxlYXBpbmdcIiB8fCBhbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCIpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzdG9jaGFzdGljJykpLmNvbGxhcHNlKCdzaG93JylcbiAgICAgIGlmKGFsZ29yaXRobSA9PT0gXCJTU0FcIil7XG4gICAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnU1NBJykpLmNvbGxhcHNlKCdzaG93JylcbiAgICAgIH1lbHNle1xuICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ1RhdScpKS5jb2xsYXBzZSgnc2hvdycpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoJy4uL3Rvb2x0aXBzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3MucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAgJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNlbGVjdC1vZGVdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3Qtc3NhXScgOiAnaGFuZGxlU2VsZWN0U2ltdWxhdGlvbkFsZ29yaXRobUNsaWNrJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LXRhdS1sZWFwaW5nXScgOiAnaGFuZGxlU2VsZWN0U2ltdWxhdGlvbkFsZ29yaXRobUNsaWNrJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LWh5YnJpZC10YXVdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtYXV0b21hdGljXScgOiAnaGFuZGxlU2VsZWN0U2ltdWxhdGlvbkFsZ29yaXRobUNsaWNrJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMubW9kZWwgPSBhdHRycy5tb2RlbDtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMuc2ltdWxhdGlvblNldHRpbmdzXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKCF0aGlzLm1vZGVsLmlzQXV0b21hdGljKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LW9kZScpKS5wcm9wKCdjaGVja2VkJywgQm9vbGVhbih0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJPREVcIikpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3Qtc3NhJykpLnByb3AoJ2NoZWNrZWQnLCBCb29sZWFuKHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIlNTQVwiKSk7IFxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtdGF1LWxlYXBpbmcnKSkucHJvcCgnY2hlY2tlZCcsIEJvb2xlYW4odGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiVGF1LUxlYXBpbmdcIikpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtaHlicmlkLXRhdScpKS5wcm9wKCdjaGVja2VkJywgQm9vbGVhbih0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIikpO1xuICAgIH1lbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtYXV0b21hdGljJykpLnByb3AoJ2NoZWNrZWQnLCB0aGlzLm1vZGVsLmlzQXV0b21hdGljKTtcbiAgICAgIHRoaXMubW9kZWwubGV0VXNDaG9vc2VGb3JZb3UoKTtcbiAgICB9XG4gICAgdGhpcy5kaXNhYmxlSW5wdXRGaWVsZEJ5QWxnb3JpdGhtKCk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuXG4gICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKVxuICB9LFxuICBoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbHVlID0gZS50YXJnZXQuZGF0YXNldC5uYW1lO1xuICAgIHRoaXMuc2V0U2ltdWxhdGlvbkFsZ29yaXRobSh2YWx1ZSlcbiAgfSxcbiAgc2V0U2ltdWxhdGlvbkFsZ29yaXRobTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5tb2RlbC5pc0F1dG9tYXRpYyA9IEJvb2xlYW4odmFsdWUgPT09ICdBdXRvbWF0aWMnKVxuICAgIGlmKCF0aGlzLm1vZGVsLmlzQXV0b21hdGljKXtcbiAgICAgIHRoaXMubW9kZWwuYWxnb3JpdGhtID0gdmFsdWU7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLm1vZGVsLmxldFVzQ2hvb3NlRm9yWW91KCk7XG4gICAgfVxuICAgIHRoaXMuZGlzYWJsZUlucHV0RmllbGRCeUFsZ29yaXRobSgpO1xuICB9LFxuICBkaXNhYmxlSW5wdXRGaWVsZEJ5QWxnb3JpdGhtOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlzQXV0b21hdGljID0gdGhpcy5tb2RlbC5pc0F1dG9tYXRpY1xuICAgIHZhciBpc09ERSA9IHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIk9ERVwiO1xuICAgIHZhciBpc1NTQSA9IHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIlNTQVwiO1xuICAgIHZhciBpc0xlYXBpbmcgPSB0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJUYXUtTGVhcGluZ1wiO1xuICAgIHZhciBpc0h5YnJpZCA9IHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIkh5YnJpZC1UYXUtTGVhcGluZ1wiO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcInJlbGF0aXZlLXRvbGVyYW5jZVwiKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsICEoaXNPREUgfHwgaXNIeWJyaWQgfHwgaXNBdXRvbWF0aWMpKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJhYnNvbHV0ZS10b2xlcmFuY2VcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzT0RFIHx8IGlzSHlicmlkIHx8IGlzQXV0b21hdGljKSk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwidHJhamVjdG9yaWVzXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgIShpc1NTQSB8fCBpc0xlYXBpbmcgfHwgaXNIeWJyaWQgfHwgaXNBdXRvbWF0aWMpKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJzZWVkXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgIShpc1NTQSB8fCBpc0xlYXBpbmcgfHwgaXNIeWJyaWQgfHwgaXNBdXRvbWF0aWMpKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJ0YXUtdG9sZXJhbmNlXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgIShpc0h5YnJpZCB8fCBpc0xlYXBpbmcgfHwgaXNBdXRvbWF0aWMpKTtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFJlbGF0aXZlVG9sZXJhbmNlOiB7XG4gICAgICBob29rOiAncmVsYXRpdmUtdG9sZXJhbmNlJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncmVsYXRpdmUtdG9sZXJhbmNlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdyZWxhdGl2ZVRvbCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5yZWxhdGl2ZVRvbFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dEFic29sdXRlVG9sZXJhbmNlOiB7XG4gICAgICBob29rOiAnYWJzb2x1dGUtdG9sZXJhbmNlJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnYWJzb2x1dGUtdG9sZXJhbmNlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdhYnNvbHV0ZVRvbCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5hYnNvbHV0ZVRvbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGlucHV0UmVhbGl6YXRpb25zOiB7XG4gICAgICBob29rOiAndHJhamVjdG9yaWVzJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncmVhbGl6YXRpb25zJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdyZWFsaXphdGlvbnMnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwucGFyZW50LmlzUHJldmlldyA/IDEgOiB0aGlzLm1vZGVsLnJlYWxpemF0aW9uc1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFNlZWQ6IHtcbiAgICAgIGhvb2s6ICdzZWVkJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3NlZWQnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6ICdzZWVkJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnNlZWRcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRUYXVUb2xlcmFuY2U6IHtcbiAgICAgIGhvb2s6ICd0YXUtdG9sZXJhbmNlJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3ICh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdUYXUtVG9sZXJhbmNlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICd0YXVUb2wnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwudGF1VG9sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3U3BlY2llID0gcmVxdWlyZSgnLi92aWV3LXNwZWNpZScpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zcGVjaWVzVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbiwgVmlld1NwZWNpZSwgdGhpcy5xdWVyeUJ5SG9vaygnc3BlY2llLWxpc3QnKSlcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRBc3NpZ25tZW50cy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBBc3NpZ25tZW50c1ZpZXdlciA9IHJlcXVpcmUoJy4vZXZlbnQtYXNzaWdubWVudHMtdmlld2VyJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdFdmVudHMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmluaXRpYWxWYWx1ZSc6IHtcbiAgICAgIGhvb2s6ICdldmVudC10cmlnZ2VyLWluaXQtdmFsdWUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2NoZWNrZWQnLFxuICAgIH0sXG4gICAgJ21vZGVsLnBlcnNpc3RlbnQnOiB7XG4gICAgICBob29rOiAnZXZlbnQtdHJpZ2dlci1wZXJzaXN0ZW50JyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjaGVja2VkJyxcbiAgICB9LFxuICAgICdtb2RlbC51c2VWYWx1ZXNGcm9tVHJpZ2dlclRpbWUnOiB7XG4gICAgICBob29rOiAndXNlLXZhbHVlcy1mcm9tLXRyaWdnZXItdGltZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY2hlY2tlZCcsXG4gICAgfSxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuZGVsYXkgPSB0aGlzLm1vZGVsLmRlbGF5ID09PSBcIlwiID8gXCJOb25lXCIgOiB0aGlzLm1vZGVsLmRlbGF5XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBhc3NpZ25tZW50c1ZpZXdlciA9IG5ldyBBc3NpZ25tZW50c1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLmV2ZW50QXNzaWdubWVudHNcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhhc3NpZ25tZW50c1ZpZXdlciwgJ2Fzc2lnbm1lbnQtdmlld2VyJyk7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdQYXJhbWV0ZXJzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxufSk7IiwidmFyIGthdGV4ID0gcmVxdWlyZSgna2F0ZXgnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1JlYWN0aW9ucy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmF0ZSA9IHRoaXMubW9kZWwucmVhY3Rpb25UeXBlID09PSBcImN1c3RvbS1wcm9wZW5zaXR5XCIgP1xuICAgICAgdGhpcy5tb2RlbC5wcm9wZW5zaXR5IDogdGhpcy5tb2RlbC5yYXRlLm5hbWVcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAga2F0ZXgucmVuZGVyKHRoaXMubW9kZWwuc3VtbWFyeSwgdGhpcy5xdWVyeUJ5SG9vaygnc3VtbWFyeScpLCB7XG4gICAgICBkaXNwbGF5TW9kZTogdHJ1ZSxcbiAgICAgIG91dHB1dDogJ21hdGhtbCdcbiAgICB9KTtcbiAgfSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1J1bGVzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3U3BlY2llcy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc3dpdGNoaW5nVmFsV2l0aExhYmVsID0gdGhpcy5tb2RlbC5pc1N3aXRjaFRvbCA/IFxuICAgICAgXCJTd2l0Y2hpbmcgVG9sZXJhbmNlOiBcIiArIHRoaXMubW9kZWwuc3dpdGNoVG9sIDpcbiAgICAgIFwiTWluaW11bSBWYWx1ZSBGb3IgU3dpdGNoaW5nOiBcIiArIHRoaXMubW9kZWwuc3dpdGNoTWluXG4gIH0sXG59KTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgdGVzdHMgPSByZXF1aXJlKCcuLi92aWV3cy90ZXN0cycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTaW1TZXR0aW5nc1ZpZXcgPSByZXF1aXJlKCcuL3NpbXVsYXRpb24tc2V0dGluZ3MnKTtcbnZhciBQYXJhbVN3ZWVwU2V0dGluZ3NWaWV3ID0gcmVxdWlyZSgnLi9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3MnKTtcbnZhciBXb3JrZmxvd1N0YXRlQnV0dG9uc1ZpZXcgPSByZXF1aXJlKCcuL3dvcmtmbG93LXN0YXRlLWJ1dHRvbnMnKTtcbi8vbW9kZWxzXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvbW9kZWwnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvd29ya2Zsb3dFZGl0b3IucHVnJyk7XG5cbmxldCBtb2RlbE5vdEZvdW5kSHRtbCA9ICh0aXRsZSwgbWVzc2FnZSkgPT4ge1xuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJkdXBsaWNhdGVXb3JrZmxvd01vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50IGluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPiAke3RpdGxlfSA8L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgPHA+ICR7bWVzc2FnZX0gPC9wPlxuICAgICAgICAgICAgPHA+IFBsZWFzZSBjb3JyZWN0IHRoZSBtb2RlbCBwYXRoIGFuZCBwcmVzcyBlbnRlciB0byByZXNldCB0aGUgd29ya2Zsb3cuIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJveC1zaGFkb3dcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPW1vZGVsLW5hbWUtY29udGFpbmVyXScgOiAndXBkYXRlV29ya2Zsb3dFZGl0b3InLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgJChkb2N1bWVudCkub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKHNlbGYucXVlcnlCeUhvb2soXCJtb2RlbC1uYW1lLWNvbnRhaW5lclwiKSkuZmluZCgnaW5wdXQnKS5mb2N1cygpO1xuICAgIH0pO1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnR5cGUgPSBhdHRycy50eXBlO1xuICAgIHRoaXMuc2V0dGluZ3NWaWV3cyA9IHt9O1xuICAgIHZhciBkaXJlY3RvcnkgPSBhdHRycy5kaXJlY3RvcnlcbiAgICB2YXIgbW9kZWxGaWxlID0gZGlyZWN0b3J5LnNwbGl0KCcvJykucG9wKCk7XG4gICAgdmFyIG5hbWUgPSBtb2RlbEZpbGUuc3BsaXQoJy4nKVswXTtcbiAgICB2YXIgaXNTcGF0aWFsID0gbW9kZWxGaWxlLnNwbGl0KCcuJykucG9wKCkuc3RhcnRzV2l0aCgncycpO1xuICAgIHRoaXMubW9kZWwgPSBuZXcgTW9kZWwoe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGRpcmVjdG9yeTogZGlyZWN0b3J5LFxuICAgICAgaXNfc3BhdGlhbDogaXNTcGF0aWFsLFxuICAgICAgaXNQcmV2aWV3OiBmYWxzZSxcbiAgICAgIGZvcjogXCJ3a2ZsXCIsXG4gICAgfSk7XG4gICAgdGhpcy5tb2RlbC5mZXRjaCh7XG4gICAgICBqc29uOiB0cnVlLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICBzZWxmLnJlbmRlclN1YnZpZXdzKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcbiAgICAgICAgc2VsZi5tb2RlbE5vdEZvdW5kKHJlc3BvbnNlLmJvZHkpXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIHVwZGF0ZVdvcmtmbG93RWRpdG9yOiBmdW5jdGlvbiAoZSkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICB0aGlzLm1vZGVsLmZldGNoKHtcbiAgICAgIGpzb246IHRydWUsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobW9kZWwsIHJlc3BvbnNlLCBvcHRpb25zKSB7XG4gICAgICAgIHNlbGYucmVuZGVyU3Vidmlld3MoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICBzZWxmLm1vZGVsTm90Rm91bmQocmVzcG9uc2UuYm9keSlcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVuZGVyTW9kZWxQYXRoSW5wdXRWaWV3KGZhbHNlKVxuICAgIC8vaW5pdGlhbGl6ZSB0aGUgc2V0dGluZ3Mgdmlld3MgYW5kIGFkZCBpdCB0byB0aGUgZGljdGlvbmFyeSBvZiBzZXR0aW5ncyB2aWV3c1xuICAgIHRoaXMuc2V0dGluZ3NWaWV3cy5naWxsZXNweSA9IG5ldyBTaW1TZXR0aW5nc1ZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgbW9kZWw6IHRoaXMubW9kZWwuc2ltdWxhdGlvblNldHRpbmdzLFxuICAgIH0pO1xuICAgIHRoaXMuc2V0dGluZ3NWaWV3cy5wYXJhbWV0ZXJTd2VlcCA9IG5ldyBQYXJhbVN3ZWVwU2V0dGluZ3NWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MsXG4gICAgfSk7XG4gICAgdmFyIHdvcmtmbG93U3RhdGVCdXR0b25zID0gbmV3IFdvcmtmbG93U3RhdGVCdXR0b25zVmlldyh7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuc2V0dGluZ3NWaWV3c1snZ2lsbGVzcHknXSwgJ3NpbS1zZXR0aW5ncy1jb250YWluZXInKTtcbiAgICBpZih0aGlzLnR5cGUgPT09IFwicGFyYW1ldGVyU3dlZXBcIil7XG4gICAgICB2YXIgc3BlY2llcyA9IHRoaXMubW9kZWwuc3BlY2llcztcbiAgICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5wYXJhbWV0ZXJzO1xuICAgICAgdmFyIHBhcmFtZXRlck9uZSA9IHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wYXJhbWV0ZXJPbmVcbiAgICAgIHZhciBwYXJhbWV0ZXJUd28gPSB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MucGFyYW1ldGVyVHdvXG4gICAgICB2YXIgc3BlY2llc09mSW50ZXJlc3QgPSB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3Muc3BlY2llc09mSW50ZXJlc3RcbiAgICAgIHZhciBwMUV4aXN0cyA9IHBhcmFtZXRlcnMuZmlsdGVyKGZ1bmN0aW9uIChwYXJhbSkgeyBpZihwYXJhbWV0ZXJPbmUuY29tcElEICYmIHBhcmFtZXRlck9uZS5jb21wSUQgPT09IHBhcmFtLmNvbXBJRCkgcmV0dXJuIHBhcmFtfSkubGVuZ3RoXG4gICAgICB2YXIgcDJFeGlzdHMgPSBwYXJhbWV0ZXJzLmZpbHRlcihmdW5jdGlvbiAocGFyYW0pIHsgaWYocGFyYW1ldGVyVHdvLmNvbXBJRCAmJiBwYXJhbWV0ZXJUd28uY29tcElEID09PSBwYXJhbS5jb21wSUQpIHJldHVybiBwYXJhbX0pLmxlbmd0aFxuICAgICAgdmFyIHNwZWNpZXNPZkludGVyZXN0RXhpc3RzID0gc3BlY2llcy5maWx0ZXIoZnVuY3Rpb24gKHNwZWNpZSkgeyBpZihzcGVjaWVzT2ZJbnRlcmVzdC5jb21wSUQgJiYgc3BlY2llc09mSW50ZXJlc3QuY29tcElEID09PSBzcGVjaWUuY29tcElEKSByZXR1cm4gc3BlY2llc30pLmxlbmd0aFxuICAgICAgaWYoIXBhcmFtZXRlck9uZS5uYW1lIHx8ICFwMUV4aXN0cyl7XG4gICAgICAgIHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wYXJhbWV0ZXJPbmUgPSBwYXJhbWV0ZXJzLmF0KDApXG4gICAgICAgIHZhciB2YWwgPSBldmFsKHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wYXJhbWV0ZXJPbmUuZXhwcmVzc2lvbilcbiAgICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnAxTWluID0gdmFsICogMC41XG4gICAgICAgIHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wMU1heCA9IHZhbCAqIDEuNVxuICAgICAgfVxuICAgICAgaWYocGFyYW1ldGVycy5hdCgxKSAmJiAoIXBhcmFtZXRlclR3by5uYW1lIHx8ICFwMkV4aXN0cykpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnBhcmFtZXRlclR3byA9IHBhcmFtZXRlcnMuYXQoMSlcbiAgICAgICAgdmFyIHZhbCA9IGV2YWwodGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnBhcmFtZXRlclR3by5leHByZXNzaW9uKVxuICAgICAgICB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MucDJNaW4gPSB2YWwgKiAwLjVcbiAgICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnAyTWF4ID0gdmFsICogMS41XG4gICAgICB9XG4gICAgICBpZighdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnNwZWNpZXNPZkludGVyZXN0Lm5hbWUgfHwgIXNwZWNpZXNPZkludGVyZXN0RXhpc3RzKXtcbiAgICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnNwZWNpZXNPZkludGVyZXN0ID0gc3BlY2llcy5hdCgwKVxuICAgICAgfVxuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5zZXR0aW5nc1ZpZXdzWydwYXJhbWV0ZXJTd2VlcCddLCAncGFyYW0tc3dlZXAtc2V0dGluZ3MtY29udGFpbmVyJyk7XG4gICAgfVxuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHdvcmtmbG93U3RhdGVCdXR0b25zLCAnd29ya2Zsb3ctc3RhdGUtYnV0dG9ucy1jb250YWluZXInKTtcbiAgICB0aGlzLnBhcmVudC50cmFqZWN0b3JpZXMgPSB0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncy5yZWFsaXphdGlvbnNcbiAgICB0aGlzLnBhcmVudC5zcGVjaWVzID0gdGhpcy5tb2RlbC5zcGVjaWVzXG4gICAgdGhpcy5wYXJlbnQuc3BlY2llc09mSW50ZXJlc3QgPSB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3Muc3BlY2llc09mSW50ZXJlc3RcbiAgfSxcbiAgbW9kZWxOb3RGb3VuZDogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgbGV0IHRpdGxlID0gZXJyb3IuUmVhc29uXG4gICAgbGV0IG1lc3NhZ2UgPSBlcnJvci5NZXNzYWdlXG4gICAgY29uc29sZS5sb2codGl0bGUsIG1lc3NhZ2UpXG4gICAgbGV0IG1vZGFsID0gJChtb2RlbE5vdEZvdW5kSHRtbCh0aXRsZSwgbWVzc2FnZSkpLm1vZGFsKClcbiAgICB0aGlzLnJlbmRlck1vZGVsUGF0aElucHV0Vmlldyh0cnVlKVxuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcIm1vZGVsLW5hbWUtY29udGFpbmVyXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2F1dG9mb2N1cycsIHRydWUpXG4gIH0sXG4gIHJlbmRlck1vZGVsUGF0aElucHV0VmlldzogZnVuY3Rpb24gKG1kbE5vdEZvdW5kKSB7XG4gICAgaWYodGhpcy5tb2RlbFBhdGhJbnB1dCl7XG4gICAgICB0aGlzLm1vZGVsUGF0aElucHV0LnJlbW92ZSgpXG4gICAgfVxuICAgIHRoaXMubW9kZWxQYXRoSW5wdXQgPSBuZXcgSW5wdXRWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgbGFiZWw6ICdNb2RlbCBQYXRoOiAnLFxuICAgICAgdGVzdHM6IFwiXCIsXG4gICAgICBtb2RlbEtleTogJ2RpcmVjdG9yeScsXG4gICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZGlyZWN0b3J5LFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMubW9kZWxQYXRoSW5wdXQsIFwibW9kZWwtbmFtZS1jb250YWluZXJcIik7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIGNvbGxhcHNlQ29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwid29ya2Zsb3ctZWRpdG9yLWNvbnRhaW5lclwiKSkuY29sbGFwc2UoKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd0luZm8ucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc3RhdHVzID0gYXR0cnMuc3RhdHVzO1xuICAgIHRoaXMubG9nc1BhdGggPSBhdHRycy5sb2dzUGF0aDtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB0aGlzLmxpc3RPZldhcm5pbmdzID0gW107XG4gICAgdGhpcy5saXN0T2ZFcnJvcnMgPSBbXTtcbiAgICB0aGlzLmxpc3RPZk5vdGVzID0gW107XG4gICAgaWYodGhpcy5zdGF0dXMgPT09ICdjb21wbGV0ZScgfHwgdGhpcy5zdGF0dXMgPT09ICdlcnJvcicpe1xuICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiL3dvcmtmbG93L3dvcmtmbG93LWxvZ3NcIiwgdGhpcy5sb2dzUGF0aClcbiAgICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1c0NvZGUgPCA0MDApe1xuICAgICAgICAgIHZhciBsb2dzID0gYm9keS5zcGxpdChcIlxcblwiKVxuICAgICAgICAgIGxvZ3MuZm9yRWFjaChzZWxmLnBhcnNlTG9ncywgc2VsZilcbiAgICAgICAgICBzZWxmLmV4cGFuZExvZ0NvbnRhaW5lcnMoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZih0aGlzLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJyl7XG4gICAgICB0aGlzLmVuYWJsZUNvbGxhcHNlQnV0dG9uKClcbiAgICB9ZWxzZSBpZih0aGlzLnN0YXR1cyA9PT0gJ2Vycm9yJyl7XG4gICAgICB0aGlzLmV4cGFuZEluZm9Db250YWluZXIoKVxuICAgIH1cbiAgfSxcbiAgcGFyc2VMb2dzOiBmdW5jdGlvbiAobG9nKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBsb2cuc3BsaXQoJ3Jvb3QgLSAnKS5wb3AoKVxuICAgIGlmKG1lc3NhZ2Uuc3RhcnRzV2l0aChcIldBUk5JTkdcIikpe1xuICAgICAgdGhpcy5saXN0T2ZXYXJuaW5ncy5wdXNoKG1lc3NhZ2Uuc3BsaXQoXCJXQVJOSU5HXCIpLnBvcCgpKVxuICAgIH1lbHNlIGlmKG1lc3NhZ2Uuc3RhcnRzV2l0aChcIkVSUk9SXCIpKXtcbiAgICAgIHRoaXMubGlzdE9mRXJyb3JzLnB1c2gobWVzc2FnZS5zcGxpdChcIkVSUk9SXCIpLnBvcCgpKVxuICAgIH1lbHNlIGlmKG1lc3NhZ2Uuc3RhcnRzV2l0aChcIkNSSVRJQ0FMXCIpKXtcbiAgICAgIHRoaXMubGlzdE9mRXJyb3JzLnB1c2gobWVzc2FnZS5zcGxpdChcIkNSSVRJQ0FMXCIpLnBvcCgpKVxuICAgIH1lbHNle1xuICAgICAgdGhpcy5saXN0T2ZOb3Rlcy5wdXNoKG1lc3NhZ2UpXG4gICAgfVxuICB9LFxuICBlbmFibGVDb2xsYXBzZUJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gIH0sXG4gIGV4cGFuZEluZm9Db250YWluZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZUNvbGxhcHNlQnV0dG9uKCk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1pbmZvJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZVwiKVxuICB9LFxuICBleHBhbmRMb2dDb250YWluZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5saXN0T2ZXYXJuaW5ncy5sZW5ndGgpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctd2FybmluZ3MnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAgIHZhciBsaXN0T2ZXYXJuaW5ncyA9IFwiPHA+XCIgKyB0aGlzLmxpc3RPZldhcm5pbmdzLmpvaW4oJzxicj4nKSArIFwiPC9wPlwiO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdsaXN0LW9mLXdhcm5pbmdzJykpLmh0bWwobGlzdE9mV2FybmluZ3MpO1xuICAgIH1cbiAgICBpZih0aGlzLmxpc3RPZkVycm9ycy5sZW5ndGgpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctZXJyb3JzJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgICB2YXIgbGlzdE9mRXJyb3JzID0gXCI8cD5cIiArIHRoaXMubGlzdE9mRXJyb3JzLmpvaW4oJzxicj4nKSArIFwiPC9wPlwiO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdsaXN0LW9mLWVycm9ycycpKS5odG1sKGxpc3RPZkVycm9ycyk7XG4gICAgfVxuICAgIGlmKHRoaXMubGlzdE9mTm90ZXMubGVuZ3RoKSB7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3dvcmtmbG93LXN0YXRpc3RpY3MnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAgIHZhciBsaXN0T2ZOb3RlcyA9IFwiPHA+XCIgKyB0aGlzLmxpc3RPZk5vdGVzLmpvaW4oJzxicj4nKSArIFwiPC9wPlwiO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdsaXN0LW9mLW5vdGVzJykpLmh0bWwobGlzdE9mTm90ZXMpO1xuICAgIH1cbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soXCJjb2xsYXBzZVwiKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vayhcImNvbGxhcHNlXCIpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soXCJjb2xsYXBzZVwiKSkudGV4dCgnKycpO1xuICB9LFxufSk7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgeGhyID0gcmVxdWlyZSgneGhyJyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciBQbG90bHkgPSByZXF1aXJlKCcuLi9saWIvcGxvdGx5Jyk7XG52YXIgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG52YXIgVG9vbHRpcHMgPSByZXF1aXJlKCcuLi90b29sdGlwcycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIGdpbGxlc3B5UmVzdWx0c1RlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2dpbGxlc3B5UmVzdWx0cy5wdWcnKTtcbnZhciBnaWxsZXNweVJlc3VsdHNFbnNlbWJsZVRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2dpbGxlc3B5UmVzdWx0c0Vuc2VtYmxlLnB1ZycpO1xudmFyIHBhcmFtZXRlclN3ZWVwUmVzdWx0c1RlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlclN3ZWVwUmVzdWx0cy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLXN0ZGRldnJhbmdlXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXN0ZGRldnJhbmdlXCIpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2UtdHJhamVjdG9yaWVzXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXRyYWplY3Rvcmllc1wiKTtcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLXN0ZGRldl0nIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZS1zdGRkZXZcIik7XG4gICAgfSxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZS10cmFqbWVhbl0nIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZS10cmFqbWVhblwiKTtcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLXBzd2VlcF0nIDogZnVuY3Rpb24gKCkge1xuICAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2UtcHN3ZWVwXCIpO1xuICAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlXCIpO1xuICAgIH0sXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXRpdGxlXScgOiAnc2V0VGl0bGUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz14YXhpc10nIDogJ3NldFhBeGlzJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9eWF4aXNdJyA6ICdzZXRZQXhpcycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNwZWNpZS1vZi1pbnRlcmVzdC1saXN0XScgOiAnZ2V0UGxvdEZvclNwZWNpZXMnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1mZWF0dXJlLWV4dHJhY3Rpb24tbGlzdF0nIDogJ2dldFBsb3RGb3JGZWF0dXJlRXh0cmFjdG9yJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9ZW5zZW1ibGUtYWdncmFnYXRvci1saXN0XScgOiAnZ2V0UGxvdEZvckVuc2VtYmxlQWdncmFnYXRvcicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cGxvdF0nIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB0eXBlID0gZS50YXJnZXQuaWRcbiAgICAgIGlmKHRoaXMucGxvdHNbdHlwZV0pIHtcbiAgICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwiZWRpdC1wbG90LWFyZ3NcIikpLmNvbGxhcHNlKFwic2hvd1wiKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLmdldFBsb3QodHlwZSk7XG4gICAgICAgIGUudGFyZ2V0LmlubmVyVGV4dCA9IFwiRWRpdCBQbG90XCJcbiAgICAgIH1cbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWRvd25sb2FkLXBuZy1jdXN0b21dJyA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgdHlwZSA9IGUudGFyZ2V0LmlkO1xuICAgICAgdGhpcy5jbGlja0Rvd25sb2FkUE5HQnV0dG9uKHR5cGUpXG4gICAgfSxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1kb3dubG9hZC1qc29uXScgOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHR5cGUgPSBlLnRhcmdldC5pZDtcbiAgICAgIHRoaXMuZXhwb3J0VG9Kc29uRmlsZSh0aGlzLnBsb3RzW3R5cGVdLCB0eXBlKVxuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZG93bmxvYWQtcmVzdWx0cy1jc3ZdJyA6ICdoYW5kbGVyRG93bmxvYWRSZXN1bHRzQ3N2Q2xpY2snLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50b29sdGlwcyA9IFRvb2x0aXBzLnBhcmFtZXRlclN3ZWVwUmVzdWx0c1xuICAgIHRoaXMudHJhamVjdG9yaWVzID0gYXR0cnMudHJhamVjdG9yaWVzO1xuICAgIHRoaXMuc3RhdHVzID0gYXR0cnMuc3RhdHVzO1xuICAgIHRoaXMuc3BlY2llcyA9IGF0dHJzLnNwZWNpZXM7XG4gICAgdGhpcy50eXBlID0gYXR0cnMudHlwZTtcbiAgICB0aGlzLnNwZWNpZXNPZkludGVyZXN0ID0gYXR0cnMuc3BlY2llc09mSW50ZXJlc3Q7XG4gICAgdGhpcy5mZWF0dXJlRXh0cmFjdG9yID0gXCJmaW5hbFwiO1xuICAgIHRoaXMuZW5zZW1ibGVBZ2dyYWdhdG9yID0gXCJhdmdcIjtcbiAgICB0aGlzLnBsb3RzID0ge31cbiAgICB0aGlzLnBsb3RBcmdzID0ge31cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy50eXBlID09PSBcInBhcmFtZXRlclN3ZWVwXCIpe1xuICAgICAgdGhpcy50ZW1wbGF0ZSA9IHBhcmFtZXRlclN3ZWVwUmVzdWx0c1RlbXBsYXRlXG4gICAgfWVsc2V7XG4gICAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy50cmFqZWN0b3JpZXMgPiAxID8gZ2lsbGVzcHlSZXN1bHRzRW5zZW1ibGVUZW1wbGF0ZSA6IGdpbGxlc3B5UmVzdWx0c1RlbXBsYXRlXG4gICAgfVxuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKHRoaXMuc3RhdHVzID09PSAnY29tcGxldGUnKXtcbiAgICAgIHRoaXMuZXhwYW5kQ29udGFpbmVyKClcbiAgICB9XG4gICAgdmFyIHNwZWNpZXNOYW1lcyA9IHRoaXMuc3BlY2llcy5tYXAoZnVuY3Rpb24gKHNwZWNpZSkgeyByZXR1cm4gc3BlY2llLm5hbWV9KTtcbiAgICB2YXIgZmVhdHVyZUV4dHJhY3RvcnMgPSBbXCJNaW5pbXVtIG9mIHBvcHVsYXRpb25cIiwgXCJNYXhpbXVtIG9mIHBvcHVsYXRpb25cIiwgXCJBdmVyYWdlIG9mIHBvcHVsYXRpb25cIiwgXCJWYXJpYW5jZSBvZiBwb3B1bGF0aW9uXCIsIFwiUG9wdWxhdGlvbiBhdCBsYXN0IHRpbWUgcG9pbnRcIl1cbiAgICB2YXIgZW5zZW1ibGVBZ2dyYWdhdG9ycyA9IFtcIk1pbmltdW0gb2YgZW5zZW1ibGVcIiwgXCJNYXhpbXVtIG9mIGVuc2VtYmxlXCIsIFwiQXZlcmFnZSBvZiBlbnNlbWJsZVwiLCBcIlZhcmlhbmNlIG9mIGVuc2VtYmxlXCJdXG4gICAgdmFyIHNwZWNpZXNPZkludGVyZXN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdzcGVjaWVzLW9mLWludGVyZXN0JyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgb3B0aW9uczogc3BlY2llc05hbWVzLFxuICAgICAgdmFsdWU6IHRoaXMuc3BlY2llc09mSW50ZXJlc3RcbiAgICB9KTtcbiAgICB2YXIgZmVhdHVyZUV4dHJhY3RvclZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnZmVhdHVyZS1leHRyYWN0b3InLFxuICAgICAgcmVxdWlyZXM6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBmZWF0dXJlRXh0cmFjdG9ycyxcbiAgICAgIHZhbHVlOiBcIlBvcHVsYXRpb24gYXQgbGFzdCB0aW1lIHBvaW50XCJcbiAgICB9KTtcbiAgICB2YXIgZW5zZW1ibGVBZ2dyYWdhdG9yVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdlbnNlbWJsZS1hZ2dyYWdhdG9yJyxcbiAgICAgIHJlcXVpcmVzOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgb3B0aW9uczogZW5zZW1ibGVBZ2dyYWdhdG9ycyxcbiAgICAgIHZhbHVlOiBcIkF2ZXJhZ2Ugb2YgZW5zZW1ibGVcIlxuICAgIH0pO1xuICAgIGlmKHRoaXMudHlwZSA9PT0gXCJwYXJhbWV0ZXJTd2VlcFwiKXtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHNwZWNpZXNPZkludGVyZXN0VmlldywgJ3NwZWNpZS1vZi1pbnRlcmVzdC1saXN0Jyk7XG4gICAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhmZWF0dXJlRXh0cmFjdG9yVmlldywgJ2ZlYXR1cmUtZXh0cmFjdGlvbi1saXN0Jyk7XG4gICAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhlbnNlbWJsZUFnZ3JhZ2F0b3JWaWV3LCAnZW5zZW1ibGUtYWdncmFnYXRvci1saXN0Jyk7XG4gICAgICBpZih0aGlzLnRyYWplY3RvcmllcyA8PSAxKXtcbiAgICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdlbnNlbWJsZS1hZ2dyYWdhdG9yLWxpc3QnKSkuZmluZCgnc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuXG4gICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vayhzb3VyY2UpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKHNvdXJjZSkpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vayhzb3VyY2UpKS50ZXh0KCcrJyk7XG4gIH0sXG4gIHNldFRpdGxlOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMucGxvdEFyZ3NbJ3RpdGxlJ10gPSBlLnRhcmdldC52YWx1ZVxuICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5wbG90cykge1xuICAgICAgdmFyIGZpZyA9IHRoaXMucGxvdHNbdHlwZV1cbiAgICAgIGZpZy5sYXlvdXQudGl0bGUudGV4dCA9IGUudGFyZ2V0LnZhbHVlXG4gICAgICB0aGlzLnBsb3RGaWd1cmUoZmlnLCB0eXBlKVxuICAgIH1cbiAgfSxcbiAgc2V0WUF4aXM6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5wbG90QXJnc1sneWF4aXMnXSA9IGUudGFyZ2V0LnZhbHVlXG4gICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLnBsb3RzKSB7XG4gICAgICB2YXIgZmlnID0gdGhpcy5wbG90c1t0eXBlXVxuICAgICAgZmlnLmxheW91dC55YXhpcy50aXRsZS50ZXh0ID0gZS50YXJnZXQudmFsdWVcbiAgICAgIHRoaXMucGxvdEZpZ3VyZShmaWcsIHR5cGUpXG4gICAgfVxuICB9LFxuICBzZXRYQXhpczogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLnBsb3RBcmdzWyd4YXhpcyddID0gZS50YXJnZXQudmFsdWVcbiAgICBmb3IgKHZhciB0eXBlIGluIHRoaXMucGxvdHMpIHtcbiAgICAgIHZhciBmaWcgPSB0aGlzLnBsb3RzW3R5cGVdXG4gICAgICBmaWcubGF5b3V0LnhheGlzLnRpdGxlLnRleHQgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgdGhpcy5wbG90RmlndXJlKGZpZywgdHlwZSlcbiAgICB9XG4gIH0sXG4gIGdldFBsb3Q6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlbCA9IHRoaXMucXVlcnlCeUhvb2sodHlwZSlcbiAgICBQbG90bHkucHVyZ2UoZWwpXG4gICAgdmFyIGRhdGEgPSB7fVxuICAgIGlmKHR5cGUgPT09ICdwc3dlZXAnKXtcbiAgICAgIGxldCBrZXkgPSB0aGlzLmdldFBzd2VlcEtleSgpXG4gICAgICBkYXRhWydwbHRfa2V5J10gPSBrZXk7XG4gICAgfWVsc2V7XG4gICAgICBkYXRhWydwbHRfa2V5J10gPSB0eXBlO1xuICAgIH1cbiAgICBpZihPYmplY3Qua2V5cyh0aGlzLnBsb3RBcmdzKS5sZW5ndGgpe1xuICAgICAgZGF0YVsncGx0X2RhdGEnXSA9IHRoaXMucGxvdEFyZ3NcbiAgICB9ZWxzZXtcbiAgICAgIGRhdGFbJ3BsdF9kYXRhJ10gPSBcIk5vbmVcIlxuICAgIH1cbiAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvd29ya2Zsb3cvcGxvdC1yZXN1bHRzXCIsIHRoaXMucGFyZW50LmRpcmVjdG9yeSwgJz9kYXRhPScgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgeGhyKHt1cmw6IGVuZHBvaW50LCBqc29uOiB0cnVlfSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpe1xuICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSA0MDApe1xuICAgICAgICAkKHNlbGYucXVlcnlCeUhvb2sodHlwZSkpLmh0bWwoYm9keS5NZXNzYWdlKVxuICAgICAgfWVsc2V7XG4gICAgICAgIHNlbGYucGxvdHNbdHlwZV0gPSBib2R5XG4gICAgICAgIHNlbGYucGxvdEZpZ3VyZShib2R5LCB0eXBlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgcGxvdEZpZ3VyZTogZnVuY3Rpb24gKGZpZ3VyZSwgdHlwZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgaG9vayA9IHR5cGU7XG4gICAgdmFyIGVsID0gdGhpcy5xdWVyeUJ5SG9vayhob29rKVxuICAgIFBsb3RseS5uZXdQbG90KGVsLCBmaWd1cmUpXG4gICAgdGhpcy5xdWVyeUFsbChcIiNcIiArIHR5cGUpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICBpZihlbC5kaXNhYmxlZCl7XG4gICAgICAgIGVsLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGNsaWNrRG93bmxvYWRQTkdCdXR0b246IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIHBuZ0J1dHRvbiA9ICQoJ2RpdltkYXRhLWhvb2sqPScrdHlwZSsnXSBhW2RhdGEtdGl0bGUqPVwiRG93bmxvYWQgcGxvdCBhcyBhIHBuZ1wiXScpWzBdXG4gICAgcG5nQnV0dG9uLmNsaWNrKClcbiAgfSxcbiAgZXhwb3J0VG9Kc29uRmlsZTogZnVuY3Rpb24gKGpzb25EYXRhLCBwbG90VHlwZSkge1xuICAgIGxldCBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkoanNvbkRhdGEpO1xuICAgIGxldCBkYXRhVVJJID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVN0cik7XG4gICAgbGV0IGV4cG9ydEZpbGVEZWZhdWx0TmFtZSA9IHBsb3RUeXBlICsgJy1wbG90Lmpzb24nO1xuXG4gICAgbGV0IGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGRhdGFVUkkpO1xuICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBleHBvcnRGaWxlRGVmYXVsdE5hbWUpO1xuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XG4gIH0sXG4gIGhhbmRsZXJEb3dubG9hZFJlc3VsdHNDc3ZDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICBsZXQgcGF0aCA9IHRoaXMucGFyZW50LmRpcmVjdG9yeVxuICAgIHRoaXMuZ2V0RXhwb3J0RGF0YShwYXRoKVxuICB9LFxuICBnZXRFeHBvcnREYXRhOiBmdW5jdGlvbiAod2tmbFBhdGgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiZmlsZS9kb3dubG9hZC16aXAvcmVzdWx0c2NzdlwiLCB3a2ZsUGF0aClcbiAgICBjb25zb2xlLmxvZyhlbmRwb2ludClcbiAgICB4aHIoe3VyaTogZW5kcG9pbnQsIGpzb246IHRydWV9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgICAgICBzZWxmLmV4cG9ydFRvWmlwRmlsZShib2R5LlBhdGgpXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGV4cG9ydFRvWmlwRmlsZTogZnVuY3Rpb24gKHJlc3VsdHNQYXRoKSB7XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKFwiZmlsZXNcIiwgcmVzdWx0c1BhdGgpO1xuICAgIC8vIGNvbnNvbGUubG9nKGVuZHBvaW50KVxuICAgIC8vIGNvbnNvbGUubG9nKFwiaHR0cDovLzEyNy4wLjAuMTo4ODg4L2VkaXQvRXhhbXBsZXMvTWljaGFlbGlzX01lbnRlbi9NaWNoYWVsaXNfTWVudGVuXzA0MTcyMDIwXzEyMTAzMS53a2ZsL3Jlc3VsdHMvcmVzdWx0c19jc3ZfMDQxNzIwMjBfMTIxMDMxLnppcFwiKVxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gZW5kcG9pbnRcbiAgfSxcbiAgZXhwYW5kQ29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1yZXN1bHRzJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlXCIpXG4gICAgaWYodGhpcy50eXBlID09PSBcInBhcmFtZXRlclN3ZWVwXCIpe1xuICAgICAgdGhpcy5nZXRQbG90KFwicHN3ZWVwXCIpXG4gICAgfWVsc2V7XG4gICAgICB0aGlzLnRyYWplY3RvcmllcyA+IDEgPyB0aGlzLmdldFBsb3QoXCJzdGRkZXZyYW5cIikgOiB0aGlzLmdldFBsb3QoXCJ0cmFqZWN0b3JpZXNcIilcbiAgICB9XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIGdldFBsb3RGb3JTcGVjaWVzOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc3BlY2llc09mSW50ZXJlc3QgPSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIHRoaXMuZ2V0UGxvdCgncHN3ZWVwJylcbiAgfSxcbiAgZ2V0UGxvdEZvckZlYXR1cmVFeHRyYWN0b3I6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGZlYXR1cmVFeHRyYWN0b3JzID0ge1wiTWluaW11bSBvZiBwb3B1bGF0aW9uXCI6XCJtaW5cIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTWF4aW11bSBvZiBwb3B1bGF0aW9uXCI6XCJtYXhcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQXZlcmFnZSBvZiBwb3B1bGF0aW9uXCI6XCJhdmdcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFyaWFuY2Ugb2YgcG9wdWxhdGlvblwiOlwidmFyXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlBvcHVsYXRpb24gYXQgbGFzdCB0aW1lIHBvaW50XCI6XCJmaW5hbFwifVxuICAgIHZhciB2YWx1ZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5mZWF0dXJlRXh0cmFjdG9yID0gZmVhdHVyZUV4dHJhY3RvcnNbdmFsdWVdXG4gICAgdGhpcy5nZXRQbG90KCdwc3dlZXAnKVxuICB9LFxuICBnZXRQbG90Rm9yRW5zZW1ibGVBZ2dyYWdhdG9yOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JzID0ge1wiTWluaW11bSBvZiBlbnNlbWJsZVwiOlwibWluXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTWF4aW11bSBvZiBlbnNlbWJsZVwiOlwibWF4XCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQXZlcmFnZSBvZiBlbnNlbWJsZVwiOlwiYXZnXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFyaWFuY2Ugb2YgZW5zZW1ibGVcIjpcInZhclwifVxuICAgIHZhciB2YWx1ZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IgPSBlbnNlbWJsZUFnZ3JhZ2F0b3JzW3ZhbHVlXVxuICAgIHRoaXMuZ2V0UGxvdCgncHN3ZWVwJylcbiAgfSxcbiAgZ2V0UHN3ZWVwS2V5OiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGtleSA9IHRoaXMuc3BlY2llc09mSW50ZXJlc3QgKyBcIi1cIiArIHRoaXMuZmVhdHVyZUV4dHJhY3RvclxuICAgIGlmKHRoaXMudHJhamVjdG9yaWVzID4gMSl7XG4gICAgICBrZXkgKz0gKFwiLVwiICsgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IpXG4gICAgfVxuICAgIHJldHVybiBrZXlcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFRpdGxlOiB7XG4gICAgICBob29rOiAndGl0bGUnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy50aXRsZSB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFhBeGlzOiB7XG4gICAgICBob29rOiAneGF4aXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAneGF4aXMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy54YXhpcyB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFlBeGlzOiB7XG4gICAgICBob29rOiAneWF4aXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAneWF4aXMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy55YXhpcyB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIiwibGV0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXRlQnV0dG9ucy5wdWcnKTtcblxubGV0IG1vZGVsU2F2ZUVycm9ySHRtbCA9ICh0aXRsZSwgZXJyb3IpID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwibW9kZWxTYXZlRXJyb3JNb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj4gJHt0aXRsZX0gPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxwPiAke2Vycm9yfSA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBib3gtc2hhZG93XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXNhdmVdJyA6ICdjbGlja1NhdmVIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1zdGFydC13b3JrZmxvd10nICA6ICdjbGlja1N0YXJ0V29ya2Zsb3dIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LW1vZGVsXScgOiAnY2xpY2tFZGl0TW9kZWxIYW5kbGVyJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgY2xpY2tTYXZlSGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLnNhdmluZygpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsXG4gICAgdmFyIHdrZmxUeXBlID0gdGhpcy5wYXJlbnQucGFyZW50LnR5cGU7XG4gICAgdmFyIG9wdFR5cGUgPSBkb2N1bWVudC5VUkwuZW5kc1dpdGgoXCIubWRsXCIpID8gXCJzblwiIDogXCJzZVwiO1xuICAgIHZhciB3b3JrZmxvdyA9IGRvY3VtZW50LlVSTC5lbmRzV2l0aChcIi5tZGxcIikgPyB0aGlzLnBhcmVudC5wYXJlbnQud29ya2Zsb3dOYW1lIDogdGhpcy5wYXJlbnQucGFyZW50LmRpcmVjdG9yeVxuICAgIHRoaXMuc2F2ZU1vZGVsKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCAnd29ya2Zsb3cvc2F2ZS13b3JrZmxvdy8nLCB3a2ZsVHlwZSwgb3B0VHlwZSwgbW9kZWwuZGlyZWN0b3J5LCBcIjwtLUdpbGxlc1B5MldvcmtmbG93LS0+XCIsIHdvcmtmbG93KTtcbiAgICAgIHhocih7dXJpOiBlbmRwb2ludH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgIHNlbGYuc2F2ZWQoKTtcbiAgICAgICAgaWYoZG9jdW1lbnQuVVJMLmVuZHNXaXRoKCcubWRsJykpe1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRpcm5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKVxuICAgICAgICAgICAgZGlybmFtZS5wb3AoKVxuICAgICAgICAgICAgZGlybmFtZSA9IGRpcm5hbWUuam9pbignLycpXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihkaXJuYW1lLCBzZWxmLnBhcmVudC5wYXJlbnQud29ya2Zsb3dOYW1lICsgJy53a2ZsJylcbiAgICAgICAgICB9LCAzMDAwKTsgXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjbGlja1N0YXJ0V29ya2Zsb3dIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc2F2ZU1vZGVsKHRoaXMucnVuV29ya2Zsb3cuYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNsaWNrRWRpdE1vZGVsSGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB0aGlzLnNhdmVNb2RlbChmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJzdG9jaHNzL21vZGVscy9lZGl0XCIsIHNlbGYubW9kZWwuZGlyZWN0b3J5KTtcbiAgICB9KTtcbiAgfSxcbiAgc2F2ZU1vZGVsOiBmdW5jdGlvbiAoY2IpIHtcbiAgICAvLyB0aGlzLm1vZGVsIGlzIGEgTW9kZWxWZXJzaW9uLCB0aGUgcGFyZW50IG9mIHRoZSBjb2xsZWN0aW9uIGlzIE1vZGVsXG4gICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgaWYodGhpcy5tb2RlbC5zaW11bGF0aW9uU2V0dGluZ3MuaXNBdXRvbWF0aWMpe1xuICAgICAgdGhpcy5tb2RlbC5zaW11bGF0aW9uU2V0dGluZ3MubGV0VXNDaG9vc2VGb3JZb3UoKTtcbiAgICB9XG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbDtcbiAgICBpZiAoY2IpIHtcbiAgICAgIG1vZGVsLnNhdmUobW9kZWwuYXR0cmlidXRlcywge1xuICAgICAgICBzdWNjZXNzOiBjYixcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc2F2aW5nIG1vZGVsOlwiLCBtb2RlbCk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlc3BvbnNlOlwiLCByZXNwb25zZSk7XG4gICAgICAgICAgc2VsZi5zYXZlRXJyb3IoKVxuICAgICAgICAgIGxldCB0aXRsZSA9IHJlc3BvbnNlLmJvZHkuUmVhc29uXG4gICAgICAgICAgbGV0IGVycm9yID0gcmVzcG9uc2UuYm9keS5NZXNzYWdlXG4gICAgICAgICAgdmFyIHNhdmVFcnJvck1vZGFsID0gJChtb2RlbFNhdmVFcnJvckh0bWwodGl0bGUsIGVycm9yKSkubW9kYWwoKVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZGVsLnNhdmVNb2RlbCgpO1xuICAgIH1cbiAgfSxcbiAgc2F2aW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNhdmluZyA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmluZy13b3JrZmxvdycpO1xuICAgIHZhciBzYXZlZCA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmVkLXdvcmtmbG93Jyk7XG4gICAgdmFyIHNhdmVFcnJvciA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmUtZXJyb3InKTtcbiAgICBzYXZlZC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgc2F2ZUVycm9yLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBzYXZpbmcuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG4gIH0sXG4gIHNhdmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNhdmluZyA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmluZy13b3JrZmxvdycpO1xuICAgIHZhciBzYXZlZCA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmVkLXdvcmtmbG93Jyk7XG4gICAgc2F2aW5nLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBzYXZlZC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgfSxcbiAgc2F2ZUVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNhdmluZyA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmluZy13b3JrZmxvdycpO1xuICAgIHZhciBzYXZlRXJyb3IgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzYXZlLWVycm9yJyk7XG4gICAgc2F2aW5nLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBzYXZlRXJyb3Iuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG4gIH0sXG4gIHJ1bldvcmtmbG93OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbDtcbiAgICB2YXIgd2tmbFR5cGUgPSB0aGlzLnBhcmVudC5wYXJlbnQudHlwZTtcbiAgICB2YXIgb3B0VHlwZSA9IGRvY3VtZW50LlVSTC5lbmRzV2l0aChcIi5tZGxcIikgPyBcInJuXCIgOiBcInJlXCI7XG4gICAgdmFyIHdvcmtmbG93ID0gZG9jdW1lbnQuVVJMLmVuZHNXaXRoKFwiLm1kbFwiKSA/IHRoaXMucGFyZW50LnBhcmVudC53b3JrZmxvd05hbWUgOiB0aGlzLnBhcmVudC5wYXJlbnQuZGlyZWN0b3J5XG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksICcvd29ya2Zsb3cvcnVuLXdvcmtmbG93LycsIHdrZmxUeXBlLCBvcHRUeXBlLCBtb2RlbC5kaXJlY3RvcnksIFwiPC0tR2lsbGVzUHkyV29ya2Zsb3ctLT5cIiwgd29ya2Zsb3cpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB4aHIoeyB1cmk6IGVuZHBvaW50IH0sZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgIHNlbGYucGFyZW50LmNvbGxhcHNlQ29udGFpbmVyKCk7XG4gICAgICBpZihkb2N1bWVudC5VUkwuZW5kc1dpdGgoJy5tZGwnKSl7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxldCBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xuICAgICAgICAgIHBhdGhuYW1lLnBvcCgpXG4gICAgICAgICAgcGF0aG5hbWUgPSBwYXRobmFtZS5qb2luKCcvJylcbiAgICAgICAgICB3b3JrZmxvd3BhdGggPSBwYXRoLmpvaW4ocGF0aG5hbWUsIHNlbGYucGFyZW50LnBhcmVudC53b3JrZmxvd05hbWUgKyAnLndrZmwnKVxuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd29ya2Zsb3dwYXRoO1xuICAgICAgICB9LCAzMDAwKTsgICAgICAgIFxuICAgICAgfWVsc2V7XG4gICAgICAgIHNlbGYucGFyZW50LnBhcmVudC51cGRhdGVXb3JrZmxvd1N0YXR1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxufSk7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXR1cy5wdWcnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgbG9jYWxEYXRlID0gbmV3IERhdGUoYXR0cnMuc3RhcnRUaW1lKVxuICAgIHZhciBsb2NhbFN0YXJ0VGltZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZShsb2NhbERhdGUpXG4gICAgdGhpcy5zdGFydFRpbWUgPSBsb2NhbFN0YXJ0VGltZTtcbiAgICB0aGlzLnN0YXR1cyA9IGF0dHJzLnN0YXR1cztcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYodGhpcy5zdGF0dXMgIT09ICdyZWFkeScgJiYgdGhpcy5zdGF0dXMgIT09ICduZXcnKXtcbiAgICAgIHRoaXMuZXhwYW5kQ29udGFpbmVyKClcbiAgICB9XG4gIH0sXG4gIGV4cGFuZENvbnRhaW5lcjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctc3RhdHVzJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCgpXG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbiAgZ2V0Rm9ybWF0dGVkRGF0ZTogZnVuY3Rpb24gKGRhdGUpIHtcbiAgICB2YXIgbW9udGhzID0gWydKYW4uJywgJ0ZlYi4nLCAnTWFyLicsICdBcHIuJywgJ01heScsICdKdW4uJywgJ0p1bC4nLCAnQXVnLicsICdTZXB0LicsICdPY3QuJywgJ05vdi4nLCAnRGVjLiddO1xuICAgIHZhciBtb250aCA9IG1vbnRoc1tkYXRlLmdldE1vbnRoKCldOyAvLyBnZXQgdGhlIGFicml2aWF0ZWQgbW9udGhcbiAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgdmFyIGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xuICAgIHZhciBhbXBtID0gaG91cnMgPj0gMTIgPyAnUE0nIDogJ0FNJzsgLy8gZ2V0IEFNIG9yIFBNIGJhc2VkIG9uIGhvdXJzXG4gICAgaG91cnMgPSBob3VycyUxMjsgLy8gZm9ybWF0IGhvdXJzIHRvIDEyIGhvdXIgdGltZSBmb3JtYXRcbiAgICBob3VycyA9IGhvdXJzID8gaG91cnMgOiAxMjsgLy8gcmVwbGFjZSAwIHdpdGggMTJcbiAgICB2YXIgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xuICAgIG1pbnV0ZXMgPSBtaW51dGVzIDwgMTAgPyAnMCcgKyBtaW51dGVzIDogbWludXRlczsgLy8gZm9ybWF0IG1pbnV0ZXMgdG8gYWx3YXlzIGhhdmUgdHdvIGNoYXJzXG4gICAgdmFyIHRpbWVab25lID0gZGF0ZS50b1N0cmluZygpLnNwbGl0KCcgJykucG9wKCkgLy8gZ2V0IHRoZSB0aW1lem9uZSBmcm9tIHRoZSBkYXRlXG4gICAgdGltZVpvbmUgPSB0aW1lWm9uZS5yZXBsYWNlKCcoJywgJycpLnJlcGxhY2UoJyknLCAnJykgLy8gcmVtb3ZlIHRoZSAnKCknIGZyb20gdGhlIHRpbWV6b25lXG4gICAgcmV0dXJuICBtb250aCArIFwiIFwiICsgZGF5ICsgXCIsIFwiICsgeWVhciArIFwiICBcIiArIGhvdXJzICsgXCI6XCIgKyBtaW51dGVzICsgXCIgXCIgKyBhbXBtICsgXCIgXCIgKyB0aW1lWm9uZTtcbiAgfSxcbn0pOyJdLCJzb3VyY2VSb290IjoiIn0=