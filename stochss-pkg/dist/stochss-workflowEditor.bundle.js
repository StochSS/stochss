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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Trajectories\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-trajectories\" data-hook=\"collapse-trajectories\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-trajectories\"\u003E\u003Cdiv data-hook=\"trajectories\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/gillespyResultsEnsemble.pug":
/*!***************************************************************!*\
  !*** ./client/templates/includes/gillespyResultsEnsemble.pug ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results-ensemble\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Standard Deviation Range\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-stddevrange\" data-hook=\"collapse-stddevrange\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-stddevrange\"\u003E\u003Cdiv data-hook=\"stddevran\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddevran\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddevran\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddevran\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Trajectories\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-trajectories\" data-hook=\"collapse-trajectories\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-trajectories\"\u003E\u003Cdiv data-hook=\"trajectories\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"plot\"\u003EPlot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"plot-multiple\" disabled\u003EMultiple Plots\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"trajectories\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Standard Deviation\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-stddev\" data-hook=\"collapse-stddev\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-stddev\"\u003E\u003Cdiv data-hook=\"stddev\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddev\" data-hook=\"plot\"\u003EPlot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddev\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"stddev\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EPlot Trajectory Mean\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-trajmean\" data-hook=\"collapse-trajmean\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-trajmean\"\u003E\u003Cdiv data-hook=\"avg\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"avg\" data-hook=\"plot\"\u003EPlot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"avg\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"avg\" data-hook=\"download-json\" disabled\u003EDownload JSON\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-results\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EResults\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-results\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-results\" data-hook=\"workflow-results\"\u003E\u003Cdiv class=\"collapse\" data-hook=\"edit-plot-args\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ETitle\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX-axis Label\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY-axis Label\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"title\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"xaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"yaxis\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"species-of-interest\"\u003ESpecies of Interest:\u003C\u002Fspan\u003E\u003Cdiv class=\"inline\" id=\"species-of-interest\" data-hook=\"specie-of-interest-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"feature-extractor\"\u003EFeature Extraction: \u003C\u002Fspan\u003E\u003Cdiv class=\"inline\" id=\"feature-extractor\" data-hook=\"feature-extraction-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\"\u003E\u003Cspan class=\"inline\" for=\"ensemble-aggragator\"\u003EEnsemble Aggragator: \u003C\u002Fspan\u003E\u003Cdiv class=\"inline\" id=\"ensemble-aggragator\" data-hook=\"ensemble-aggragator-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EParameter Sweep\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-psweep\" data-hook=\"collapse-psweep\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-psweep\"\u003E\u003Cdiv data-hook=\"psweep\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"psweep\" data-hook=\"plot\"\u003EEdit Plot\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"psweep\" data-hook=\"download-png-custom\" disabled\u003EDownload PNG\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" id=\"psweep\" data-hook=\"download-json\" disabled\u003EDownload JSON \u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"mdl-edit-btn\"\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"save\"\u003ESave\u003C\u002Fbutton\u003E\u003Cdiv class=\"mdl-edit-btn saving-status\" data-hook=\"saving-workflow\"\u003E\u003Cdiv class=\"spinner-grow\"\u003E\u003C\u002Fdiv\u003E\u003Cspan\u003ESaving...\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-edit-btn saved-status\" data-hook=\"saved-workflow\"\u003E\u003Cspan\u003ESaved\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"start-workflow\"\u003EStart Workflow\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"edit-model\"\u003EEdit Model\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/workflowStatus.pug":
/*!******************************************************!*\
  !*** ./client/templates/includes/workflowStatus.pug ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"workflow-status\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EStatus\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-status\" data-hook=\"collapse\" disabled\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"collapse-status\" data-hook=\"workflow-status\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EDate\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EStatus\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.startTime) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.status) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cbutton class=\"btn btn-outline-primary box-shadow\" data-hook=\"stop-workflow\" type=\"button\" disabled\u003EStop Workflow\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-outline-primary box-shadow\" data-hook=\"restart-workflow\" type=\"button\" disabled\u003ERestart Workflow\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/pages/workflowManager.pug":
/*!****************************************************!*\
  !*** ./client/templates/pages/workflowManager.pug ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Csection class=\"page\"\u003E\u003Cdiv\u003E\u003Ch2 class=\"inline\"\u003EWorkflow Manager\u003C\u002Fh2\u003E\u003Cbutton class=\"big-tip btn information-btn help\" data-hook=\"edit-workflow-help\"\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"far\" data-icon=\"question-circle\" class=\"svg-inline--fa fa-question-circle fa-w-16\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 512 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-name\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-status-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-results-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"workflow-info-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"model-viewer-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"computational-resources-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";;return pug_html;};
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
      if(parameters.at(1) && (!parameterTwo.name) || !p2Exists) {
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
var Plotly = __webpack_require__(/*! ../lib/plotly */ "./client/lib/plotly.js");
var app = __webpack_require__(/*! ../app */ "./client/app.js");
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
    var endpoint = path.join(app.getApiPath(), '/workflow/run-workflow/', wkflType, optType, model.directory, "<--GillesPy2Workflow-->", workflow);
    var self = this;
    xhr({ uri: endpoint },function (err, response, body) {
      self.parent.collapseContainer();
      self.parent.parent.updateWorkflowStatus();
      if(document.URL.endsWith('.mdl')){
        setTimeout(function () {
          let pathname = window.location.pathname.split('/');
          pathname.pop()
          pathname = pathname.join('/')
          workflowpath = path.join(pathname, self.parent.parent.workflowName + '.wkfl')
          window.location.href = workflowpath;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL3dvcmtmbG93LW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudEFzc2lnbm1lbnRzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50c1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9naWxsZXNweVJlc3VsdHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZ2lsbGVzcHlSZXN1bHRzRW5zZW1ibGUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxTZXR0aW5nc1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFJlc3VsdHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9wYXJhbWV0ZXJTd2VlcFNldHRpbmdzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3J1bGVzVmlld2VyLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3NpbXVsYXRpb25TZXR0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BlY2llc1ZpZXdlci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRBc3NpZ25tZW50cy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdQYXJhbWV0ZXJzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdSZWFjdGlvbnMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1J1bGVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdTcGVjaWVzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93RWRpdG9yLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93SW5mby5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXRlQnV0dG9ucy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXR1cy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9wYWdlcy93b3JrZmxvd01hbmFnZXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9ldmVudC1hc3NpZ25tZW50cy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50cy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL21vZGVsLXNldHRpbmdzLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvbW9kZWwtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3Mtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3BhcmFtZXRlcnMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9yZWFjdGlvbnMtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9ydWxlcy12aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3NpbXVsYXRpb24tc2V0dGluZ3Mtdmlld2VyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zaW11bGF0aW9uLXNldHRpbmdzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zcGVjaWVzLXZpZXdlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ldmVudC1hc3NpZ25tZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ldmVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3ZpZXctcGFyYW1ldGVyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy92aWV3LXJlYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1ydWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvdmlldy1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3dvcmtmbG93LWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctaW5mby5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctcmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctc3RhdGUtYnV0dG9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvd29ya2Zsb3ctc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRLG9CQUFvQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBLDBCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hE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QTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBELHVCQUF1QjtBQUNqRixzREFBc0Qsb0JBQW9CO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUywwQkFBMEI7QUFDbkM7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7OztBQ2xTRCxVQUFVLG1CQUFPLENBQUMsK0JBQVE7QUFDMUIsUUFBUSxtQkFBTyxDQUFDLG9EQUFRO0FBQ3hCLFVBQVUsbUJBQU8sQ0FBQyx3Q0FBSztBQUN2QixXQUFXLG1CQUFPLENBQUMscURBQU07QUFDekI7QUFDQSxXQUFXLG1CQUFPLENBQUMsdUVBQWdCO0FBQ25DO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLDRHQUFnRDs7QUFFdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFE7QUFDWDtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxnQkFBZ0I7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxRO0FBQ1Q7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7OztBQ3hHRCxRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEI7QUFDQSxXQUFXLG1CQUFPLENBQUMsdUVBQWdCO0FBQ25DO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGdHQUEwQzs7O0FBR2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QyxxQkFBcUI7QUFDckIsK0JBQStCO0FBQy9CO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDLEUiLCJmaWxlIjoic3RvY2hzcy13b3JrZmxvd0VkaXRvci5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbiBcdGZ1bmN0aW9uIHdlYnBhY2tKc29ucENhbGxiYWNrKGRhdGEpIHtcbiBcdFx0dmFyIGNodW5rSWRzID0gZGF0YVswXTtcbiBcdFx0dmFyIG1vcmVNb2R1bGVzID0gZGF0YVsxXTtcbiBcdFx0dmFyIGV4ZWN1dGVNb2R1bGVzID0gZGF0YVsyXTtcblxuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIHJlc29sdmVzID0gW107XG4gXHRcdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuIFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuIFx0XHRcdFx0cmVzb2x2ZXMucHVzaChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0pO1xuIFx0XHRcdH1cbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuIFx0XHR9XG4gXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYocGFyZW50SnNvbnBGdW5jdGlvbikgcGFyZW50SnNvbnBGdW5jdGlvbihkYXRhKTtcblxuIFx0XHR3aGlsZShyZXNvbHZlcy5sZW5ndGgpIHtcbiBcdFx0XHRyZXNvbHZlcy5zaGlmdCgpKCk7XG4gXHRcdH1cblxuIFx0XHQvLyBhZGQgZW50cnkgbW9kdWxlcyBmcm9tIGxvYWRlZCBjaHVuayB0byBkZWZlcnJlZCBsaXN0XG4gXHRcdGRlZmVycmVkTW9kdWxlcy5wdXNoLmFwcGx5KGRlZmVycmVkTW9kdWxlcywgZXhlY3V0ZU1vZHVsZXMgfHwgW10pO1xuXG4gXHRcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gYWxsIGNodW5rcyByZWFkeVxuIFx0XHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiBcdH07XG4gXHRmdW5jdGlvbiBjaGVja0RlZmVycmVkTW9kdWxlcygpIHtcbiBcdFx0dmFyIHJlc3VsdDtcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlZmVycmVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBkZWZlcnJlZE1vZHVsZSA9IGRlZmVycmVkTW9kdWxlc1tpXTtcbiBcdFx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcbiBcdFx0XHRmb3IodmFyIGogPSAxOyBqIDwgZGVmZXJyZWRNb2R1bGUubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBkZXBJZCA9IGRlZmVycmVkTW9kdWxlW2pdO1xuIFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2RlcElkXSAhPT0gMCkgZnVsZmlsbGVkID0gZmFsc2U7XG4gXHRcdFx0fVxuIFx0XHRcdGlmKGZ1bGZpbGxlZCkge1xuIFx0XHRcdFx0ZGVmZXJyZWRNb2R1bGVzLnNwbGljZShpLS0sIDEpO1xuIFx0XHRcdFx0cmVzdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBkZWZlcnJlZE1vZHVsZVswXSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0cmV0dXJuIHJlc3VsdDtcbiBcdH1cblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuIFx0Ly8gUHJvbWlzZSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdFwid29ya2Zsb3dFZGl0b3JcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL2NsaWVudC9wYWdlcy93b3JrZmxvdy1tYW5hZ2VyLmpzXCIsXCJjb21tb25cIl0pO1xuIFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiByZWFkeVxuIFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgdGVzdHMgPSByZXF1aXJlKCcuLi92aWV3cy90ZXN0cycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgeGhyID0gcmVxdWlyZSgneGhyJyk7XG52YXIgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG4vL3ZpZXdzXG52YXIgUGFnZVZpZXcgPSByZXF1aXJlKCcuL2Jhc2UnKTtcbnZhciBXb3JrZmxvd0VkaXRvclZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy93b3JrZmxvdy1lZGl0b3InKTtcbnZhciBXb3JrZmxvd1N0YXR1c1ZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy93b3JrZmxvdy1zdGF0dXMnKTtcbnZhciBXb3JrZmxvd1Jlc3VsdHNWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3Mvd29ya2Zsb3ctcmVzdWx0cycpO1xudmFyIE1vZGVsVmlld2VyID0gcmVxdWlyZSgnLi4vdmlld3MvbW9kZWwtdmlld2VyJyk7XG52YXIgSW5mb1ZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy93b3JrZmxvdy1pbmZvJyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvaW5wdXQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcGFnZXMvd29ya2Zsb3dNYW5hZ2VyLnB1ZycpO1xuXG5pbXBvcnQgaW5pdFBhZ2UgZnJvbSAnLi9wYWdlLmpzJztcblxubGV0IG9wZXJhdGlvbkluZm9Nb2RhbEh0bWwgPSAoKSA9PiB7XG4gIGxldCBlZGl0V29ya2Zsb3dNZXNzYWdlID0gYFxuICAgIDxwPjxiPldvcmtmbG93IE5hbWUvUGF0aDwvYj46IFlvdSBtYXkgZWRpdCB0aGUgbmFtZS9wYXRoIG9mIHRoZSB3b3JrZmxvdyBhcyBsb25nIGFzIHRoZSB3b3JrZmxvdyBoYXMgbm90IGJlZW4gc2F2ZWQuICBcbiAgICBXb3JrZmxvdyBOYW1lcyBhbHdheXMgZW5kIHdpdGggYSB0aW1lIHN0YW1wLjwvcD5cbiAgICA8cD48Yj5Nb2RlbCBQYXRoPC9iPjogSWYgeW91IG1vdmUgb3IgcmVuYW1lIHRoZSBtb2RlbCBtYWtlIHN1cmUgdG8gdXBkYXRlIHRoaXMgcGF0aC48L3A+XG4gICAgPHA+PGI+U2V0dGluZ3M8L2I+OiBUaGlzIGlzIHdoZXJlIHlvdSBjYW4gY3VzdG9taXplIHRoZSBzZXR0aW5ncyBmb3IgeW91ciB3b3JrZmxvdy5cbiAgICBJZiB5b3UgbmVlZCB0byBlZGl0IG90aGVyIHBhcnQgb2YgeW91IG1vZGVsIGNsaWNrIG9uIHRoZSBlZGl0IG1vZGVsIGJ1dHRvbi4gIFxuICAgIFRoZSBzZXR0aW5ncyBhcmUgb25seSBhdmFpbGFibGUgZm9yIHdvcmtmbG93cyB0aGF0IGhhdmUgbm90IGJlZW4gcnVuLjwvcD5cbiAgICA8cD48Yj5TdGF0dXM8L2I+OiBUaGlzIHNlY3Rpb24gZGlzcGxheXMgdGhlIHN0YXR1cyBhbmQgc3RhcnQgdGltZSBvZiB0aGUgV29ya2Zsb3cuICBJZiB0aGUgd29ya2Zsb3cgaGFzbid0IGJlZW4gc2FydGVkIHRoaXMgc2VjdGlvbiBpcyBjbG9zZWQuPC9wPlxuICAgIDxwPjxiPlJlc3VsdHM8L2I+OiBZb3UgbWF5IGNoYW5nZSB0aGUgdGl0bGUsIHgtYXhpcyBsYWJlbCwgYW5kIHktYXhpcyBsYWJlbCBieSBjbGlja2luZyBvbiB0aGUgZWRpdCBwbG90IGJ1dHRvbiB0aGVuIGVudGVyIHRoZSBuYW1lIGluIHRoZSBjb3JyZWN0IGZpZWxkLjwvcD5cbiAgICA8cD48Yj5JbmZvPC9iPjogVGhpcyBzZWN0aW9uIGRpc3BsYXlzIGFueSB3YXJuaW5ncyBhbmQvb3IgZXJyb3IgdGhhdCBhcmUgbG9nZ2VkIGJ5IHRoZSBydW5uaW5nIHdvcmtmbG93LjwvcD5cbiAgICA8cD48Yj5Nb2RlbDwvYj46IFRoaXMgc2VjdGlvbiBsZXRzIHlvdSB2aWV3IHRoZSBtb2RlbCB0aGF0IHdhcyB1c2VkIHdoZW4geW91IHJhbiB0aGUgd29ya2Zsb3cuPC9wPlxuICBgO1xuXG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cIm9wZXJhdGlvbkluZm9Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj4gV29ya2Zsb3cgTWFuYWdlciBIZWxwIDwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8cD4gJHtlZGl0V29ya2Zsb3dNZXNzYWdlfSA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCBcbn1cblxubGV0IFdvcmtmbG93TWFuYWdlciA9IFBhZ2VWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXdvcmtmbG93LW5hbWVdJyA6ICdzZXRXb3JrZmxvd05hbWUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtd29ya2Zsb3ctaGVscF0nIDogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IG1vZGFsID0gJChvcGVyYXRpb25JbmZvTW9kYWxIdG1sKCkpLm1vZGFsKCk7XG4gICAgfSxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgUGFnZVZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHVybCA9IGRlY29kZVVSSShkb2N1bWVudC5VUkwpXG4gICAgdGhpcy50eXBlID0gdXJsLnNwbGl0KCcvd29ya2Zsb3cvZWRpdC8nKS5wb3AoKS5zcGxpdCgnLycpWzBdO1xuICAgIHRoaXMuZGlyZWN0b3J5ID0gdXJsLnNwbGl0KCcvd29ya2Zsb3cvZWRpdC8nICsgdGhpcy50eXBlKS5wb3AoKTtcbiAgICBpZih0aGlzLmRpcmVjdG9yeS5lbmRzV2l0aCgnLm1kbCcpKXtcbiAgICAgIHZhciBtb2RlbEZpbGUgPSB0aGlzLmRpcmVjdG9yeS5zcGxpdCgnLycpLnBvcCgpO1xuICAgICAgdmFyIG5hbWUgPSBtb2RlbEZpbGUuc3BsaXQoJy4nKVswXTtcbiAgICAgIHRoaXMubW9kZWxEaXJlY3RvcnkgPSB0aGlzLmRpcmVjdG9yeTtcbiAgICAgIHRoaXMud29ya2Zsb3dEYXRlID0gdGhpcy5nZXRDdXJyZW50RGF0ZSgpO1xuICAgICAgdGhpcy53b3JrZmxvd05hbWUgPSBuYW1lICsgdGhpcy53b3JrZmxvd0RhdGU7XG4gICAgICB0aGlzLnN0YXR1cyA9ICduZXcnO1xuICAgIH1lbHNle1xuICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiL3dvcmtmbG93L3dvcmtmbG93LWluZm9cIiwgdGhpcy5kaXJlY3RvcnksIFwiL2luZm8uanNvblwiKTtcbiAgICAgIHhocih7dXJpOiBlbmRwb2ludCwganNvbjogdHJ1ZX0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KXtcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgICAgICAgIHNlbGYubW9kZWxEaXJlY3RvcnkgPSBib2R5Lm1vZGVsLnNwbGl0KCcvaG9tZS9qb3Z5YW4nKS5wb3AoKTtcbiAgICAgICAgICBzZWxmLnR5cGUgPSBib2R5LnR5cGU7XG4gICAgICAgICAgc2VsZi5zdGFydFRpbWUgPSBib2R5LnN0YXJ0X3RpbWU7XG4gICAgICAgICAgdmFyIHdvcmtmbG93RGlyID0gc2VsZi5kaXJlY3Rvcnkuc3BsaXQoJy8nKS5wb3AoKTtcbiAgICAgICAgICBzZWxmLndvcmtmbG93TmFtZSA9IHdvcmtmbG93RGlyLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgdmFyIHN0YXR1c0VuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksIFwiL3dvcmtmbG93L3dvcmtmbG93LXN0YXR1c1wiLCBzZWxmLmRpcmVjdG9yeSk7XG4gICAgICAgICAgeGhyKHt1cmk6IHN0YXR1c0VuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgICAgIHNlbGYuc3RhdHVzID0gYm9keTtcbiAgICAgICAgICAgIGlmKHNlbGYuc3RhdHVzID09PSAnY29tcGxldGUnIHx8IHNlbGYuc3RhdHVzID09PSAnZXJyb3InKXtcbiAgICAgICAgICAgICAgc2VsZi5tb2RlbERpcmVjdG9yeSA9IHBhdGguam9pbihzZWxmLmRpcmVjdG9yeSwgc2VsZi5tb2RlbERpcmVjdG9yeS5zcGxpdCgnLycpLnBvcCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYucmVuZGVyU3Vidmlld3MoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBQYWdlVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYodGhpcy5tb2RlbERpcmVjdG9yeSl7XG4gICAgICB0aGlzLnJlbmRlclN1YnZpZXdzKClcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXJTdWJ2aWV3czogZnVuY3Rpb24gKCkge1xuICAgIHZhciB3b3JrZmxvd0VkaXRvciA9IG5ldyBXb3JrZmxvd0VkaXRvclZpZXcoe1xuICAgICAgZGlyZWN0b3J5OiB0aGlzLm1vZGVsRGlyZWN0b3J5LFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgIH0pO1xuICAgIHZhciBpbnB1dE5hbWUgPSBuZXcgSW5wdXRWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgbGFiZWw6ICdXb3JrZmxvdyBOYW1lOiAnLFxuICAgICAgdGVzdHM6ICcnLFxuICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgdmFsdWU6IHRoaXMud29ya2Zsb3dOYW1lLFxuICAgIH0pO1xuICAgIHRoaXMud29ya2Zsb3dFZGl0b3JWaWV3ID0gdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcod29ya2Zsb3dFZGl0b3IsICd3b3JrZmxvdy1lZGl0b3ItY29udGFpbmVyJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoaW5wdXROYW1lLCAnd29ya2Zsb3ctbmFtZScpO1xuICAgIHRoaXMucmVuZGVyV29ya2Zsb3dTdGF0dXNWaWV3KCk7XG4gICAgdGhpcy51cGRhdGVUcmFqZWN0b3JpZXMoKTtcbiAgICB0aGlzLnJlbmRlck1vZGVsVmlld2VyKCk7XG4gICAgdGhpcy5yZW5kZXJJbmZvVmlldygpO1xuICAgIGlmKHRoaXMuc3RhdHVzICE9PSAnbmV3Jyl7XG4gICAgICB0aGlzLmRpc2FibGVXb3JrZmxvd05hbWVJbnB1dCgpO1xuICAgIH1cbiAgICBpZih0aGlzLnN0YXR1cyAhPT0gJ25ldycgJiYgdGhpcy5zdGF0dXMgIT09ICdyZWFkeScpe1xuICAgICAgd29ya2Zsb3dFZGl0b3IuY29sbGFwc2VDb250YWluZXIoKTtcbiAgICB9XG4gICAgaWYodGhpcy5zdGF0dXMgPT09ICdydW5uaW5nJyl7XG4gICAgICB0aGlzLmdldFdvcmtmbG93U3RhdHVzKCk7XG4gICAgfVxuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2V0V29ya2Zsb3dOYW1lOiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIG5ld1dvcmtmbG93TmFtZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIGlmKG5ld1dvcmtmbG93TmFtZS5lbmRzV2l0aCh0aGlzLndvcmtmbG93RGF0ZSkpe1xuICAgICAgdGhpcy53b3JrZmxvd05hbWUgPSBuZXdXb3JrZmxvd05hbWVcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMud29ya2Zsb3dOYW1lID0gbmV3V29ya2Zsb3dOYW1lICsgdGhpcy53b3JrZmxvd0RhdGVcbiAgICAgIGUudGFyZ2V0LnZhbHVlID0gdGhpcy53b3JrZmxvd05hbWVcbiAgICB9XG4gIH0sXG4gIGdldEN1cnJlbnREYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHZhciBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcbiAgICB2YXIgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xuICAgIHZhciBzZWNvbmRzID0gZGF0ZS5nZXRTZWNvbmRzKCk7XG4gICAgcmV0dXJuIFwiX1wiICsgbW9udGggKyBkYXkgKyB5ZWFyICsgXCJfXCIgKyBob3VycyArIG1pbnV0ZXMgKyBzZWNvbmRzO1xuICB9LFxuICBkaXNhYmxlV29ya2Zsb3dOYW1lSW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcIndvcmtmbG93LW5hbWVcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgfSxcbiAgcmVuZGVyV29ya2Zsb3dTdGF0dXNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy53b3JrZmxvd1N0YXR1c1ZpZXcpe1xuICAgICAgdGhpcy53b3JrZmxvd1N0YXR1c1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHZhciBzdGF0dXNWaWV3ID0gbmV3IFdvcmtmbG93U3RhdHVzVmlldyh7XG4gICAgICBzdGFydFRpbWU6IHRoaXMuc3RhcnRUaW1lLFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICB9KTtcbiAgICB0aGlzLndvcmtmbG93U3RhdHVzVmlldyA9IHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHN0YXR1c1ZpZXcsICd3b3JrZmxvdy1zdGF0dXMtY29udGFpbmVyJyk7XG4gIH0sXG4gIGdldFdvcmtmbG93SW5mbzogZnVuY3Rpb24gKGNiKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi93b3JrZmxvdy93b3JrZmxvdy1pbmZvXCIsIHRoaXMuZGlyZWN0b3J5LCBcIi9pbmZvLmpzb25cIik7XG4gICAgeGhyKHt1cmk6IGVuZHBvaW50LCBqc29uOiB0cnVlfSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpe1xuICAgICAgc2VsZi5zdGFydFRpbWUgPSBib2R5LnN0YXJ0X3RpbWU7XG4gICAgICBjYigpO1xuICAgIH0pO1xuICB9LFxuICBnZXRXb3JrZmxvd1N0YXR1czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgc3RhdHVzRW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvd29ya2Zsb3cvd29ya2Zsb3ctc3RhdHVzXCIsIHRoaXMuZGlyZWN0b3J5KTtcbiAgICB4aHIoe3VyaTogc3RhdHVzRW5kcG9pbnR9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgaWYoc2VsZi5zdGF0dXMgIT09IGJvZHkgKXtcbiAgICAgICAgc2VsZi5zdGF0dXMgPSBib2R5O1xuICAgICAgICBzZWxmLnJlbmRlcldvcmtmbG93U3RhdHVzVmlldygpO1xuICAgICAgfVxuICAgICAgaWYoc2VsZi5zdGF0dXMgIT09ICdlcnJvcicgJiYgc2VsZi5zdGF0dXMgIT09ICdjb21wbGV0ZScpe1xuICAgICAgICBzZXRUaW1lb3V0KF8uYmluZChzZWxmLmdldFdvcmtmbG93U3RhdHVzLCBzZWxmKSwgMTAwMCk7XG4gICAgICB9ZWxzZSBpZihzZWxmLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICBzZWxmLnJlbmRlclJlc3VsdHNWaWV3KCk7XG4gICAgICAgIHNlbGYucmVuZGVyTW9kZWxWaWV3ZXIoKTtcbiAgICAgICAgc2VsZi5yZW5kZXJJbmZvVmlldygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICB1cGRhdGVXb3JrZmxvd1N0YXR1czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgIFxuICAgICAgc2VsZi5nZXRXb3JrZmxvd0luZm8oZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLmdldFdvcmtmbG93U3RhdHVzKCk7XG4gICAgICB9KTtcbiAgICB9LCAzMDAwKTtcbiAgfSxcbiAgcmVuZGVyUmVzdWx0c1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLndvcmtmbG93UmVzdWx0c1ZpZXcpe1xuICAgICAgdGhpcy53b3JrZmxvd1Jlc3VsdHNWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0c1ZpZXcgPSBuZXcgV29ya2Zsb3dSZXN1bHRzVmlldyh7XG4gICAgICB0cmFqZWN0b3JpZXM6IHRoaXMudHJhamVjdG9yaWVzLFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHNwZWNpZXM6IHRoaXMuc3BlY2llcyxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIHNwZWNpZXNPZkludGVyZXN0OiB0aGlzLnNwZWNpZXNPZkludGVyZXN0Lm5hbWVcbiAgICB9KTtcbiAgICB0aGlzLndvcmtmbG93UmVzdWx0c1ZpZXcgPSB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhyZXN1bHRzVmlldywgJ3dvcmtmbG93LXJlc3VsdHMtY29udGFpbmVyJyk7XG4gIH0sXG4gIHJlbmRlck1vZGVsVmlld2VyOiBmdW5jdGlvbiAoKXtcbiAgICBpZih0aGlzLm1vZGVsVmlld2VyKXtcbiAgICAgIHRoaXMubW9kZWxWaWV3ZXIucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMubW9kZWxWaWV3ZXIgPSBuZXcgTW9kZWxWaWV3ZXIoe1xuICAgICAgZGlyZWN0b3J5OiB0aGlzLm1vZGVsRGlyZWN0b3J5LFxuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHR5cGU6IHRoaXMudHlwZVxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMubW9kZWxWaWV3ZXIsICdtb2RlbC12aWV3ZXItY29udGFpbmVyJylcbiAgfSxcbiAgcmVuZGVySW5mb1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLmluZm9WaWV3KXtcbiAgICAgIHRoaXMuaW5mb1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMuaW5mb1ZpZXcgPSBuZXcgSW5mb1ZpZXcoe1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIGxvZ3NQYXRoOiBwYXRoLmpvaW4odGhpcy5kaXJlY3RvcnksIFwibG9ncy50eHRcIilcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0aGlzLmluZm9WaWV3LCAnd29ya2Zsb3ctaW5mby1jb250YWluZXInKVxuICB9LFxuICB1cGRhdGVUcmFqZWN0b3JpZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZih0aGlzLnRyYWplY3RvcmllcyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnVwZGF0ZVRyYWplY3RvcmllcygpXG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHRoaXMudHJhamVjdG9yaWVzID0gdGhpcy53b3JrZmxvd0VkaXRvclZpZXcubW9kZWwuc2ltdWxhdGlvblNldHRpbmdzLmFsZ29yaXRobSAhPT0gXCJPREVcIiA/IHRoaXMudHJhamVjdG9yaWVzIDogMVxuICAgICAgdGhpcy5yZW5kZXJSZXN1bHRzVmlldygpXG4gICAgfVxuICB9LFxufSk7XG5cbmluaXRQYWdlKFdvcmtmbG93TWFuYWdlcik7XG4iLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VWYXJpYWJsZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJ2aWV3LWV2ZW50LWFzc2lnbm1lbnRzLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwiZXZlbnRzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXZlbnRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1tb2RlbC1ldmVudHMtdmlld2VyXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93IGNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1tb2RlbC1ldmVudHMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRGVsYXlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VQcmlvcml0eVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVRyaWdnZ2VyXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFQXNzaWdubWVudHNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VVc2UgVmFsdWVzIEZyb21cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJ2aWV3LWV2ZW50cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwid29ya2Zsb3ctcmVzdWx0c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUmVzdWx0c1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVzdWx0c1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCIgZGlzYWJsZWRcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiY29sbGFwc2UtcmVzdWx0c1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1yZXN1bHRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJlZGl0LXBsb3QtYXJnc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVGl0bGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VYLWF4aXMgTGFiZWxcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VZLWF4aXMgTGFiZWxcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGl0bGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ4YXhpc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInlheGlzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBsb3QgVHJhamVjdG9yaWVzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXRyYWplY3Rvcmllc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInRyYWplY3Rvcmllc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFRWRpdCBQbG90XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcG5nLWN1c3RvbVxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgUE5HXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtanNvblxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgSlNPTlxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1yZXN1bHRzLWVuc2VtYmxlXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VSZXN1bHRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIiBkaXNhYmxlZFxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXJlc3VsdHNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtcGxvdC1hcmdzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUaXRsZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVgtYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVktYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0aXRsZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInhheGlzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieWF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBTdGFuZGFyZCBEZXZpYXRpb24gUmFuZ2VcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXN0ZGRldnJhbmdlXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXN0ZGRldnJhbmdlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXN0ZGRldnJhbmdlXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3RkZGV2cmFuXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldnJhblxcXCIgZGF0YS1ob29rPVxcXCJwbG90XFxcIlxcdTAwM0VFZGl0IFBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldnJhblxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldnJhblxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBUcmFqZWN0b3JpZXNcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXRyYWplY3Rvcmllc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZS10cmFqZWN0b3JpZXNcXFwiXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXRyYWplY3Rvcmllc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInRyYWplY3Rvcmllc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcInBsb3QtbXVsdGlwbGVcXFwiIGRpc2FibGVkXFx1MDAzRU11bHRpcGxlIFBsb3RzXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcG5nLWN1c3RvbVxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgUE5HXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJ0cmFqZWN0b3JpZXNcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtanNvblxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgSlNPTlxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBsb3QgU3RhbmRhcmQgRGV2aWF0aW9uXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zdGRkZXZcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2Utc3RkZGV2XFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1zdGRkZXZcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdGRkZXZcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwic3RkZGV2XFxcIiBkYXRhLWhvb2s9XFxcInBsb3RcXFwiXFx1MDAzRVBsb3RcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldlxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1wbmctY3VzdG9tXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBQTkdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgaWQ9XFxcInN0ZGRldlxcXCIgZGF0YS1ob29rPVxcXCJkb3dubG9hZC1qc29uXFxcIiBkaXNhYmxlZFxcdTAwM0VEb3dubG9hZCBKU09OXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGxvdCBUcmFqZWN0b3J5IE1lYW5cXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXRyYWptZWFuXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLXRyYWptZWFuXFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS10cmFqbWVhblxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImF2Z1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJhdmdcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFUGxvdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwiYXZnXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLXBuZy1jdXN0b21cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIFBOR1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBpZD1cXFwiYXZnXFxcIiBkYXRhLWhvb2s9XFxcImRvd25sb2FkLWpzb25cXFwiIGRpc2FibGVkXFx1MDAzRURvd25sb2FkIEpTT05cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwibW9kZWwtc2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VNb2RlbCBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtbW9kZWwtc2V0dGluZ3Mtdmlld2VyXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93IGNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1tb2RlbC1zZXR0aW5ncy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUVuZCBTaW11bGF0aW9uXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVGltZSBTdGVwc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVZvbHVtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuZW5kU2ltKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudGltZVN0ZXApID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC52b2x1bWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwibW9kZWwtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VNb2RlbFxcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtbW9kZWxcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtbW9kZWxcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLW1vZGVsXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNVxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3BlY2llcy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicGFyYW1ldGVycy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVhY3Rpb25zLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJldmVudHMtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJ1bGVzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicGFyYW1ldGVyLXN3ZWVwLXNldHRpbmdzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzaW11bGF0aW9uLXNldHRpbmdzLXZpZXdlci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1yZXN1bHRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VSZXN1bHRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIiBkaXNhYmxlZFxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJjb2xsYXBzZS1yZXN1bHRzXFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXJlc3VsdHNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtcGxvdC1hcmdzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUaXRsZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVgtYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVktYXhpcyBMYWJlbFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0aXRsZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInhheGlzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieWF4aXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZVxcXCIgZm9yPVxcXCJzcGVjaWVzLW9mLWludGVyZXN0XFxcIlxcdTAwM0VTcGVjaWVzIG9mIEludGVyZXN0OlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiIGlkPVxcXCJzcGVjaWVzLW9mLWludGVyZXN0XFxcIiBkYXRhLWhvb2s9XFxcInNwZWNpZS1vZi1pbnRlcmVzdC1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZVxcXCIgZm9yPVxcXCJmZWF0dXJlLWV4dHJhY3RvclxcXCJcXHUwMDNFRmVhdHVyZSBFeHRyYWN0aW9uOiBcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIiBpZD1cXFwiZmVhdHVyZS1leHRyYWN0b3JcXFwiIGRhdGEtaG9vaz1cXFwiZmVhdHVyZS1leHRyYWN0aW9uLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiaW5saW5lXFxcIiBmb3I9XFxcImVuc2VtYmxlLWFnZ3JhZ2F0b3JcXFwiXFx1MDAzRUVuc2VtYmxlIEFnZ3JhZ2F0b3I6IFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiIGlkPVxcXCJlbnNlbWJsZS1hZ2dyYWdhdG9yXFxcIiBkYXRhLWhvb2s9XFxcImVuc2VtYmxlLWFnZ3JhZ2F0b3ItbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGFyYW1ldGVyIFN3ZWVwXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1wc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2UtcHN3ZWVwXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXBzd2VlcFxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInBzd2VlcFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJwc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwicGxvdFxcXCJcXHUwMDNFRWRpdCBQbG90XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJwc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtcG5nLWN1c3RvbVxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgUE5HXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGlkPVxcXCJwc3dlZXBcXFwiIGRhdGEtaG9vaz1cXFwiZG93bmxvYWQtanNvblxcXCIgZGlzYWJsZWRcXHUwMDNFRG93bmxvYWQgSlNPTiBcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicGFyYW1ldGVyLXN3ZWVwLXNldHRpbmdzXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQYXJhbWV0ZXIgU3dlZXAgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXBzd2VlcC1zZXR0aW5nc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1wc3dlZXAtc2V0dGluZ3NcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTYgdmVydGljbGUtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN3ZWVwIFR5cGU6XFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuc3dlZXBUeXBlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lIGhvcml6b250YWwtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic3dlZXBUeXBlXFxcIiBkYXRhLWhvb2s9XFxcIm9uZS1wYXJhbWV0ZXJcXFwiIGRhdGEtbmFtZT1cXFwiMURcXFwiIGNoZWNrZWRcXHUwMDNFIE9uZSBQYXJhbWV0ZXJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzd2VlcFR5cGVcXFwiIGRhdGEtaG9vaz1cXFwidHdvLXBhcmFtZXRlclxcXCIgZGF0YS1uYW1lPVxcXCIyRFxcXCIgZGlzYWJsZWRcXHUwMDNFIFR3byBQYXJhbWV0ZXJzXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTYgdmVydGljbGUtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmVcXFwiIGZvcj1cXFwic3BlY2llcy1vZi1pbnRlcmVzdFxcXCJcXHUwMDNFU3BlY2llcyBvZiBJbnRlcmVzdDpcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIiBpZD1cXFwic3BlY2llcy1vZi1pbnRlcmVzdFxcXCIgZGF0YS1ob29rPVxcXCJzcGVjaWUtb2YtaW50ZXJlc3QtbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2g1XFx1MDAzRUNvbmZpZ3VyZSBWYXJpYWJsZShzKVxcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3dlZXAgVmFyaWFibGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VDdXJyZW50IFZhbHVlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTWluaW11bSBWYWx1ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1heGltdW0gVmFsdWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdGVwc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzd2VlcC12YXJpYWJsZS1vbmUtc2VsZWN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiY3VycmVudC12YWx1ZS1vbmUtaW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtaW5pbXVtLXZhbHVlLW9uZS1pbnB1dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1heGltdW0tdmFsdWUtb25lLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3RlcC1vbmUtaW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDdHIgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcInBhcmFtZXRlci10d28tcm93XFxcIlxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN3ZWVwLXZhcmlhYmxlLXR3by1zZWxlY3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJjdXJyZW50LXZhbHVlLXR3by1pbnB1dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1pbmltdW0tdmFsdWUtdHdvLWlucHV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibWF4aW11bS12YWx1ZS10d28taW5wdXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdGVwLXR3by1pbnB1dFxcXCJcXHUwMDNFIFxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInBhcmFtZXRlci1zd2VlcC1zZXR0aW5ncy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBhcmFtZXRlciBTd2VlcCBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcHN3ZWVwLXNldHRpbmdzLXZpZXdlclxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1wc3dlZXAtc2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2IHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAwLjc1cmVtO1xcXCIgZGF0YS1ob29rPVxcXCJzd2VlcC10eXBlLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN3ZWVwIFZhcmlhYmxlc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVmFyaWFibGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VDdXJyZW50IFZhbHVlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTWluaW11bSBWYWx1ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1heGltdW0gVmFsdWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdGVwc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucGFyYW1ldGVyT25lLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGQgZGF0YS1ob29rPVxcXCJwMS1jdXJyZW50LXZhbHVlLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wMU1pbikgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnAxTWF4KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucDFTdGVwcykgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ3RyIGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJwMi12YXJpYWJsZS12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnBhcmFtZXRlclR3by5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkIGRhdGEtaG9vaz1cXFwicDItY3VycmVudC12YWx1ZS12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucDJNaW4pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wMk1heCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnAyU3RlcHMpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicGFyYW1ldGVycy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVBhcmFtZXRlcnNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXBhcmFtZXRlcnNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtcGFyYW1ldGVyc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTktdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRXhwcmVzc2lvblxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcInBhcmFtZXRlci1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJlYWN0aW9ucy12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlYWN0aW9uc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVhY3Rpb25zXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJlYWN0aW9uc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3VtbWFyeVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtNi12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSYXRlXFx1MDAyRlByb3BlbnNpdHlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJ1bGVzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUnVsZXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJ1bGVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJ1bGVzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUeXBlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVZhcmlhYmxlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJydWxlcy1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNpbXVsYXRpb24tc2V0dGluZ3NcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNpbXVsYXRpb24gU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXNldHRpbmdzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNldHRpbmdzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIiBjb2xzcGFuPVxcXCI1XFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU2ltdWxhdGlvbiBBbGdvcml0aG1cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbGdvcml0aG0sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic2ltQWxnb3JpdGhtXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1vZGVcXFwiIGRhdGEtbmFtZT1cXFwiT0RFXFxcIlxcdTAwM0UgT0RFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LXNzYVxcXCIgZGF0YS1uYW1lPVxcXCJTU0FcXFwiXFx1MDAzRSBTU0FcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNpbUFsZ29yaXRobVxcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3QtdGF1LWxlYXBpbmdcXFwiIGRhdGEtbmFtZT1cXFwiVGF1LUxlYXBpbmdcXFwiXFx1MDAzRSBUYXUgTGVhcGluZ1xcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic2ltQWxnb3JpdGhtXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1oeWJyaWQtdGF1XFxcIiBkYXRhLW5hbWU9XFxcIkh5YnJpZC1UYXUtTGVhcGluZ1xcXCJcXHUwMDNFIEh5YnJpZCBPREVcXHUwMDJGU1NBXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IGNsYXNzPVxcXCJpbmxpbmVcXFwiIHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJzaW1BbGdvcml0aG1cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LWF1dG9tYXRpY1xcXCIgZGF0YS1uYW1lPVxcXCJBdXRvbWF0aWNcXFwiXFx1MDAzRSBDaG9vc2UgZm9yIG1lXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuY2hvb3NlRm9yTWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNVxcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRURldGVybWluaXN0aWMgU2V0dGluZ3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUmVsYXRpdmUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMucnRvbCwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFIFxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBYnNvbHV0ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hdG9sLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVsYXRpdmUtdG9sZXJhbmNlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiYWJzb2x1dGUtdG9sZXJhbmNlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC03XFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RvY2hhc3RpYyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJlYWxpemF0aW9ucywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNlZWRcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5zZWVkLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFVGF1IFRvbGVyYW5jZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnR0b2wsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0cmFqZWN0b3JpZXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzZWVkXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGF1LXRvbGVyYW5jZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic2V0dGluZ3Mtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTaW11bGF0aW9uIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zZXR0aW5ncy12aWV3ZXJcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3cgY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNldHRpbmdzLXZpZXdlclxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEyXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMC43NXJlbTtcXFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuYWxnb3JpdGhtKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IGNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImRldGVybWluaXN0aWNcXFwiXFx1MDAzRVxcdTAwM0NoNSBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VEZXRlcm1pbmlzdGljIFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZWxhdGl2ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VBYnNvbHV0ZSBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnJlbGF0aXZlVG9sKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuYWJzb2x1dGVUb2wpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNiBjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJzdG9jaGFzdGljXFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RvY2hhc3RpYyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiU1NBXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOdW1iZXIgb2YgVHJhamVjdG9yaWVzXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU2VlZFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwucmVhbGl6YXRpb25zKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuc2VlZCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcIlRhdVxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTnVtYmVyIG9mIFRyYWplY3Rvcmllc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVNlZWRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VUYXUgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5yZWFsaXphdGlvbnMpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5zZWVkKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudGF1VG9sKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNwZWNpZXMtdmlld2VyXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTcGVjaWVzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zcGVjaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNwZWNpZXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIGNsYXNzPVxcXCJjb2wtbWQtMy12aWV3XFxcIiBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUluaXRpYWwgQ29uZGl0aW9uXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggY2xhc3M9XFxcImNvbC1tZC0zLXZpZXdcXFwiIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU1vZGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBjbGFzcz1cXFwiY29sLW1kLTMtdmlld1xcXCIgc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3dpdGNoIFRvbGVyYW5jZVxcdTAwMkZNaW5pbXVtIFZhbHVlIGZvciBTd2l0Y2hpbmdcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJzcGVjaWUtbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnZhcmlhYmxlLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5leHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuZGVsYXkpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5wcmlvcml0eSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IFwiRXhwcmVzc2lvbjogXCIgKyB0aGlzLm1vZGVsLnRyaWdnZXJFeHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNoZWNrYm94XFxcIiBmb3I9XFxcImluaXRpYWwtdmFsdWVcXFwiXFx1MDAzRUluaXRpYWwgVmFsdWU6IFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGlkPVxcXCJpbml0aWFsLXZhbHVlXFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50LXRyaWdnZXItaW5pdC12YWx1ZVxcXCIgZGlzYWJsZWRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2hlY2tib3hcXFwiIGZvcj1cXFwicGVyc2lzdGVudFxcXCJcXHUwMDNFUGVyc2lzdGVudDogXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgaWQ9XFxcInBlcnNpc3RlbnRcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtdHJpZ2dlci1wZXJzaXN0ZW50XFxcIiBkaXNhYmxlZFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiYXNzaWdubWVudC12aWV3ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCIgZm9yPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiXFx1MDAzRVRyZ2dpZXIgVGltZVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIGlkPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiIG5hbWU9XFxcInVzZS12YWx1ZXMtZnJvbVxcXCIgZGF0YS1ob29rPVxcXCJ0cmlnZ2VyLXRpbWVcXFwiIGRpc2FibGVkXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIiBmb3I9XFxcImFzc2lnbm1lbnQtdGltZVxcXCJcXHUwMDNFQXNzaWdubWVudCBUaW1lXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgaWQ9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgbmFtZT1cXFwidXNlLXZhbHVlcy1mcm9tXFxcIiBkYXRhLWhvb2s9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgZGlzYWJsZWRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5leHByZXNzaW9uKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdW1tYXJ5XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnJhdGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC50eXBlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwudmFyaWFibGUubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLmV4cHJlc3Npb24pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC52YWx1ZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm1vZGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5zd2l0Y2hpbmdWYWxXaXRoTGFiZWwpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1uYW1lLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgZGF0YS1ob29rPVxcXCJwYXJhbS1zd2VlcC1zZXR0aW5ncy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzaW0tc2V0dGluZ3MtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctc3RhdGUtYnV0dG9ucy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJ3b3JrZmxvdy1pbmZvLXZpZXdcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUluZm9cXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLWluZm9cXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLWluZm9cXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctaW5mb1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctc3RhdGlzdGljc1xcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVN0YXRpc3RpY3NcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJsaXN0LW9mLW5vdGVzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy13YXJuaW5nc1xcXCJcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVdhcm5pbmdzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibGlzdC1vZi13YXJuaW5nc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctZXJyb3JzXFxcIlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXJyb3JzXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibGlzdC1vZi1lcnJvcnNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJzYXZlXFxcIlxcdTAwM0VTYXZlXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuIHNhdmluZy1zdGF0dXNcXFwiIGRhdGEtaG9vaz1cXFwic2F2aW5nLXdvcmtmbG93XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJzcGlubmVyLWdyb3dcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NzcGFuXFx1MDAzRVNhdmluZy4uLlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZGwtZWRpdC1idG4gc2F2ZWQtc3RhdHVzXFxcIiBkYXRhLWhvb2s9XFxcInNhdmVkLXdvcmtmbG93XFxcIlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VTYXZlZFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJzdGFydC13b3JrZmxvd1xcXCJcXHUwMDNFU3RhcnQgV29ya2Zsb3dcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJlZGl0LW1vZGVsXFxcIlxcdTAwM0VFZGl0IE1vZGVsXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIndvcmtmbG93LXN0YXR1c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU3RhdHVzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zdGF0dXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiIGRpc2FibGVkXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgaWQ9XFxcImNvbGxhcHNlLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1zdGF0dXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRURhdGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdGF0dXNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnN0YXJ0VGltZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLnN0YXR1cykgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwic3RvcC13b3JrZmxvd1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBkaXNhYmxlZFxcdTAwM0VTdG9wIFdvcmtmbG93XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJyZXN0YXJ0LXdvcmtmbG93XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIGRpc2FibGVkXFx1MDAzRVJlc3RhcnQgV29ya2Zsb3dcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzZWN0aW9uIGNsYXNzPVxcXCJwYWdlXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VXb3JrZmxvdyBNYW5hZ2VyXFx1MDAzQ1xcdTAwMkZoMlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJiaWctdGlwIGJ0biBpbmZvcm1hdGlvbi1idG4gaGVscFxcXCIgZGF0YS1ob29rPVxcXCJlZGl0LXdvcmtmbG93LWhlbHBcXFwiXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXJcXFwiIGRhdGEtaWNvbj1cXFwicXVlc3Rpb24tY2lyY2xlXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtcXVlc3Rpb24tY2lyY2xlIGZhLXctMTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgNTEyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjU2IDhDMTE5LjA0MyA4IDggMTE5LjA4MyA4IDI1NmMwIDEzNi45OTcgMTExLjA0MyAyNDggMjQ4IDI0OHMyNDgtMTExLjAwMyAyNDgtMjQ4QzUwNCAxMTkuMDgzIDM5Mi45NTcgOCAyNTYgOHptMCA0NDhjLTExMC41MzIgMC0yMDAtODkuNDMxLTIwMC0yMDAgMC0xMTAuNDk1IDg5LjQ3Mi0yMDAgMjAwLTIwMCAxMTAuNDkxIDAgMjAwIDg5LjQ3MSAyMDAgMjAwIDAgMTEwLjUzLTg5LjQzMSAyMDAtMjAwIDIwMHptMTA3LjI0NC0yNTUuMmMwIDY3LjA1Mi03Mi40MjEgNjguMDg0LTcyLjQyMSA5Mi44NjNWMzAwYzAgNi42MjctNS4zNzMgMTItMTIgMTJoLTQ1LjY0N2MtNi42MjcgMC0xMi01LjM3My0xMi0xMnYtOC42NTljMC0zNS43NDUgMjcuMS01MC4wMzQgNDcuNTc5LTYxLjUxNiAxNy41NjEtOS44NDUgMjguMzI0LTE2LjU0MSAyOC4zMjQtMjkuNTc5IDAtMTcuMjQ2LTIxLjk5OS0yOC42OTMtMzkuNzg0LTI4LjY5My0yMy4xODkgMC0zMy44OTQgMTAuOTc3LTQ4Ljk0MiAyOS45NjktNC4wNTcgNS4xMi0xMS40NiA2LjA3MS0xNi42NjYgMi4xMjRsLTI3LjgyNC0yMS4wOThjLTUuMTA3LTMuODcyLTYuMjUxLTExLjA2Ni0yLjY0NC0xNi4zNjNDMTg0Ljg0NiAxMzEuNDkxIDIxNC45NCAxMTIgMjYxLjc5NCAxMTJjNDkuMDcxIDAgMTAxLjQ1IDM4LjMwNCAxMDEuNDUgODguOHpNMjk4IDM2OGMwIDIzLjE1OS0xOC44NDEgNDItNDIgNDJzLTQyLTE4Ljg0MS00Mi00MiAxOC44NDEtNDIgNDItNDIgNDIgMTguODQxIDQyIDQyelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1uYW1lXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwid29ya2Zsb3ctZWRpdG9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LXN0YXR1cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ3b3JrZmxvdy1yZXN1bHRzLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIndvcmtmbG93LWluZm8tY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibW9kZWwtdmlld2VyLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImNvbXB1dGF0aW9uYWwtcmVzb3VyY2VzLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWN0aW9uXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdBc3NpZ25tZW50cyA9IHJlcXVpcmUoJy4vdmlldy1ldmVudC1hc3NpZ25tZW50cycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudEFzc2lnbm1lbnRzVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdBc3NpZ25tZW50cywgJ3ZpZXctZXZlbnQtYXNzaWdubWVudHMtbGlzdCcpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3RXZlbnQgPSByZXF1aXJlKCcuL3ZpZXctZXZlbnRzJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50c1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbiwgVmlld0V2ZW50LCB0aGlzLnF1ZXJ5QnlIb29rKCd2aWV3LWV2ZW50cy1jb250YWluZXInKSlcbiAgfSxcbiAgY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFNldHRpbmdzVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgY2hhbmdlU2V0dGluZ3NDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgU3BlY2llc1ZpZXdlciA9IHJlcXVpcmUoJy4vc3BlY2llcy12aWV3ZXInKTtcbnZhciBQYXJhbWV0ZXJzVmlld2VyID0gcmVxdWlyZSgnLi9wYXJhbWV0ZXJzLXZpZXdlcicpO1xudmFyIFJlYWN0aW9uc1ZpZXdlciA9IHJlcXVpcmUoJy4vcmVhY3Rpb25zLXZpZXdlcicpO1xudmFyIEV2ZW50c1ZpZXdlciA9IHJlcXVpcmUoJy4vZXZlbnRzLXZpZXdlcicpO1xudmFyIFJ1bGVzVmlld2VyID0gcmVxdWlyZSgnLi9ydWxlcy12aWV3ZXInKTtcbnZhciBNb2RlbFNldHRpbmdzVmlld2VyID0gcmVxdWlyZSgnLi9tb2RlbC1zZXR0aW5ncy12aWV3ZXInKTtcbnZhciBTaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIgPSByZXF1aXJlKCcuL3NpbXVsYXRpb24tc2V0dGluZ3Mtdmlld2VyJyk7XG52YXIgUGFyYW1ldGVyU3dlZXBTZXR0aW5nc1ZpZXdlciA9IHJlcXVpcmUoJy4vcGFyYW1ldGVyLXN3ZWVwLXNldHRpbmdzLXZpZXdlcicpO1xuLy9tb2RlbHNcbnZhciBNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9tb2RlbCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2UtbW9kZWxdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gICAgdGhpcy53a2ZsVHlwZSA9IGF0dHJzLnR5cGU7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXJlY3RvcnkgPSBhdHRycy5kaXJlY3RvcnlcbiAgICB2YXIgbW9kZWxGaWxlID0gZGlyZWN0b3J5LnNwbGl0KCcvJykucG9wKCk7XG4gICAgdmFyIG5hbWUgPSBtb2RlbEZpbGUuc3BsaXQoJy4nKVswXTtcbiAgICB2YXIgaXNTcGF0aWFsID0gbW9kZWxGaWxlLnNwbGl0KCcuJykucG9wKCkuc3RhcnRzV2l0aCgncycpO1xuICAgIHRoaXMubW9kZWwgPSBuZXcgTW9kZWwoe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGRpcmVjdG9yeTogZGlyZWN0b3J5LFxuICAgICAgaXNfc3BhdGlhbDogaXNTcGF0aWFsXG4gICAgfSk7XG4gICAgdGhpcy5tb2RlbC5mZXRjaCh7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobW9kZWwsIHJlc3BvbnNlLCBvcHRpb25zKSB7XG4gICAgICAgIHNlbGYucmVuZGVyU3Vidmlld3MoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3BlY2llc1ZpZXdlciA9IG5ldyBTcGVjaWVzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuc3BlY2llcyxcbiAgICB9KTtcbiAgICB2YXIgcGFyYW1ldGVyc1ZpZXdlciA9IG5ldyBQYXJhbWV0ZXJzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucGFyYW1ldGVycyxcbiAgICB9KTtcbiAgICB2YXIgcmVhY3Rpb25zVmlld2VyID0gbmV3IFJlYWN0aW9uc1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnJlYWN0aW9ucyxcbiAgICB9KTtcbiAgICB2YXIgZXZlbnRzVmlld2VyID0gbmV3IEV2ZW50c1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLmV2ZW50c0NvbGxlY3Rpb24sXG4gICAgfSk7XG4gICAgdmFyIHJ1bGVzVmlld2VyID0gbmV3IFJ1bGVzVmlld2VyKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucnVsZXMsXG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJTaW11bGF0aW9uU2V0dGluZ3NWaWV3KCk7XG4gICAgdmFyIG1vZGVsU2V0dGluZ3NWaWV3ZXIgPSBuZXcgTW9kZWxTZXR0aW5nc1ZpZXdlcih7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbC5tb2RlbFNldHRpbmdzLFxuICAgIH0pO1xuICAgIHZhciBwc3dlZXBTZXR0aW5nc1ZpZXdlciA9IG5ldyBQYXJhbWV0ZXJTd2VlcFNldHRpbmdzVmlld2VyKHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MsXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3BlY2llc1ZpZXdlciwgXCJzcGVjaWVzLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocGFyYW1ldGVyc1ZpZXdlciwgXCJwYXJhbWV0ZXJzLXZpZXdlci1jb250YWluZXJcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocmVhY3Rpb25zVmlld2VyLCBcInJlYWN0aW9ucy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGV2ZW50c1ZpZXdlciwgXCJldmVudHMtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhydWxlc1ZpZXdlciwgXCJydWxlcy12aWV3ZXItY29udGFpbmVyXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KG1vZGVsU2V0dGluZ3NWaWV3ZXIsIFwibW9kZWwtc2V0dGluZ3Mtdmlld2VyLWNvbnRhaW5lclwiKTtcbiAgICBpZih0aGlzLndrZmxUeXBlID09PSAncGFyYW1ldGVyU3dlZXAnKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhwc3dlZXBTZXR0aW5nc1ZpZXdlciwgJ3BhcmFtZXRlci1zd2VlcC1zZXR0aW5ncy12aWV3ZXItY29udGFpbmVyJylcbiAgICB9XG4gICAgaWYodGhpcy5zdGF0dXMgPT09ICdjb21wbGV0ZScpe1xuICAgICAgdGhpcy5lbmFibGVDb2xsYXBzZUJ1dHRvbigpO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyU2ltdWxhdGlvblNldHRpbmdzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuc2ltdWxhdGlvblNldHRpbmdzVmlldyl7XG4gICAgICB0aGlzLnNpbXVsYXRpb25TZXR0aW5nc1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMuc2ltdWxhdGlvblNldHRpbmdzVmlldyA9IG5ldyBTaW11bGF0aW9uU2V0dGluZ3NWaWV3ZXIoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwuc2ltdWxhdGlvblNldHRpbmdzLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuc2ltdWxhdGlvblNldHRpbmdzVmlldywgXCJzaW11bGF0aW9uLXNldHRpbmdzLXZpZXdlci1jb250YWluZXJcIik7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZS1tb2RlbCcpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZS1tb2RlbCcpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlLW1vZGVsJykpLnRleHQoJysnKTtcbiAgfSxcbiAgZW5hYmxlQ29sbGFwc2VCdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlLW1vZGVsJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyU3dlZXBTZXR0aW5nc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHN3ZWVwVHlwZSA9IFwiU3dlZXAgVHlwZTogXCJcbiAgICB2YXIgcDFDdXJyZW50VmFsID0gZXZhbCh0aGlzLm1vZGVsLnBhcmFtZXRlck9uZS5leHByZXNzaW9uKVxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygncDEtY3VycmVudC12YWx1ZS12aWV3ZXInKSkudGV4dChwMUN1cnJlbnRWYWwpXG4gICAgaWYodGhpcy5tb2RlbC5pczFEKSB7XG4gICAgICBzd2VlcFR5cGUgKz0gXCJPbmUgUGFyYW1ldGVyXCJcbiAgICB9ZWxzZXtcbiAgICAgIHN3ZWVwVHlwZSArPSBcIlR3byBQYXJhbWV0ZXJzXCJcbiAgICAgIHZhciBwMkN1cnJlbnRWYWwgPSBldmFsKHRoaXMubW9kZWwucGFyYW1ldGVyVHdvLmV4cHJlc3Npb24pXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3AyLWN1cnJlbnQtdmFsdWUtdmlld2VyJykpLnRleHQocDJDdXJyZW50VmFsKVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdwMi12YXJpYWJsZS12aWV3ZXInKSkuY29sbGFwc2UoJ3Nob3cnKVxuICAgIH1cbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3ZWVwLXR5cGUtdmlld2VyJykpLnRleHQoc3dlZXBUeXBlKVxuICB9LFxuICBjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyAiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy9zdXBwb3J0IGZpbGVzXG52YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG52YXIgVG9vbHRpcHMgPSByZXF1aXJlKCcuLi90b29sdGlwcycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlclN3ZWVwU2V0dGluZ3MucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAgJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPW9uZS1wYXJhbWV0ZXJdJyA6ICd1cGRhdGVQYXJhbVN3ZWVwVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXR3by1wYXJhbWV0ZXJdJyA6ICd1cGRhdGVQYXJhbVN3ZWVwVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXN3ZWVwLXZhcmlhYmxlLW9uZS1zZWxlY3RdJyA6ICdzZWxlY3RTd2VlcFZhck9uZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXN3ZWVwLXZhcmlhYmxlLXR3by1zZWxlY3RdJyA6ICdzZWxlY3RTd2VlcFZhclR3bycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNwZWNpZS1vZi1pbnRlcmVzdC1saXN0XScgOiAnc2VsZWN0U3BlY2llc09mSW50ZXJlc3QnXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMucGFyYW1ldGVyU3dlZXBTZXR0aW5nc1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgcGFyYW1ldGVycyA9IHRoaXMubW9kZWwucGFyZW50LnBhcmFtZXRlcnM7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLnBhcmVudC5zcGVjaWVzO1xuICAgIHZhciBwYXJhbU5hbWVzID0gcGFyYW1ldGVycy5tYXAoZnVuY3Rpb24gKHBhcmFtZXRlcikgeyByZXR1cm4gcGFyYW1ldGVyLm5hbWV9KTtcbiAgICB2YXIgc3BlY2llc05hbWVzID0gc3BlY2llcy5tYXAoZnVuY3Rpb24gKHNwZWNpZSkgeyByZXR1cm4gc3BlY2llLm5hbWV9KTtcbiAgICB2YXIgc3BlY2llc09mSW50ZXJlc3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3NwZWNpZXMtb2YtaW50ZXJlc3QnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBzcGVjaWVzTmFtZXMsXG4gICAgICB2YWx1ZTogdGhpcy5tb2RlbC5zcGVjaWVzT2ZJbnRlcmVzdC5uYW1lXG4gICAgfSk7XG4gICAgdmFyIHBhcmFtZXRlck9uZVZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnc3dlZXAtdmFyaWFibGUtb25lJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgb3B0aW9uczogcGFyYW1OYW1lcyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnBhcmFtZXRlck9uZS5uYW1lXG4gICAgfSk7XG4gICAgdmFyIHBhcmFtZXRlclR3b1ZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnc3dlZXAtdmFyaWFibGUtdHdvJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgb3B0aW9uczogcGFyYW1OYW1lcyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnBhcmFtZXRlclR3by5uYW1lXG4gICAgfSk7XG4gICAgaWYodGhpcy5tb2RlbC5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPiAxKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygndHdvLXBhcmFtZXRlcicpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdvbmUtcGFyYW1ldGVyJykpLnByb3AoJ2NoZWNrZWQnLCB0aGlzLm1vZGVsLmlzMUQpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3R3by1wYXJhbWV0ZXInKSkucHJvcCgnY2hlY2tlZCcsICF0aGlzLm1vZGVsLmlzMUQpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2N1cnJlbnQtdmFsdWUtdHdvLWlucHV0JykpLnRleHQoZXZhbCh0aGlzLm1vZGVsLnBhcmFtZXRlclR3by5leHByZXNzaW9uKSlcbiAgICAgIHRoaXMudG9nZ2xlUGFyYW1Ud28oKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHBhcmFtZXRlclR3b1ZpZXcsICdzd2VlcC12YXJpYWJsZS10d28tc2VsZWN0Jyk7XG4gICAgfVxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY3VycmVudC12YWx1ZS1vbmUtaW5wdXQnKSkudGV4dChldmFsKHRoaXMubW9kZWwucGFyYW1ldGVyT25lLmV4cHJlc3Npb24pKVxuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHNwZWNpZXNPZkludGVyZXN0VmlldywgJ3NwZWNpZS1vZi1pbnRlcmVzdC1saXN0Jyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocGFyYW1ldGVyT25lVmlldywgJ3N3ZWVwLXZhcmlhYmxlLW9uZS1zZWxlY3QnKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVBhcmFtU3dlZXBUeXBlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0eXBlID0gZS50YXJnZXQuZGF0YXNldC5uYW1lXG4gICAgdGhpcy5tb2RlbC5pczFEID0gdHlwZSA9PT0gJzFEJ1xuICAgIHRoaXMudG9nZ2xlUGFyYW1Ud28oKVxuICB9LFxuICB0b2dnbGVQYXJhbVR3bzogZnVuY3Rpb24gKCkge1xuICAgIGlmKCF0aGlzLm1vZGVsLmlzMUQpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdwYXJhbWV0ZXItdHdvLXJvdycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgIH1lbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdwYXJhbWV0ZXItdHdvLXJvdycpKS5jb2xsYXBzZSgnaGlkZScpO1xuICAgIH1cbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2VsZWN0U3dlZXBWYXJPbmU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHBhcmFtZXRlciA9IHRoaXMuZ2V0UGFyYW1ldGVyKHZhbCk7XG4gICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJPbmUgPSBwYXJhbWV0ZXJcbiAgICB2YXIgY3VycmVudFZhbHVlID0gZXZhbChwYXJhbWV0ZXIuZXhwcmVzc2lvbilcbiAgICB0aGlzLm1vZGVsLnAxTWluID0gY3VycmVudFZhbHVlICogMC41O1xuICAgIHRoaXMubW9kZWwucDFNYXggPSBjdXJyZW50VmFsdWUgKiAxLjU7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjdXJyZW50LXZhbHVlLW9uZS1pbnB1dCcpKS50ZXh0KGN1cnJlbnRWYWx1ZSk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdtaW5pbXVtLXZhbHVlLW9uZS1pbnB1dCcpKS5maW5kKCdpbnB1dCcpLnZhbCh0aGlzLm1vZGVsLnAxTWluKVxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnbWF4aW11bS12YWx1ZS1vbmUtaW5wdXQnKSkuZmluZCgnaW5wdXQnKS52YWwodGhpcy5tb2RlbC5wMU1heClcbiAgfSxcbiAgc2VsZWN0U3dlZXBWYXJUd286IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHBhcmFtZXRlciA9IHRoaXMuZ2V0UGFyYW1ldGVyKHZhbCk7XG4gICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJUd28gPSBwYXJhbWV0ZXJcbiAgICB2YXIgY3VycmVudFZhbHVlID0gZXZhbChwYXJhbWV0ZXIuZXhwcmVzc2lvbilcbiAgICB0aGlzLm1vZGVsLnAyTWluID0gY3VycmVudFZhbHVlICogMC41O1xuICAgIHRoaXMubW9kZWwucDJNYXggPSBjdXJyZW50VmFsdWUgKiAxLjU7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjdXJyZW50LXZhbHVlLXR3by1pbnB1dCcpKS50ZXh0KGN1cnJlbnRWYWx1ZSk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdtaW5pbXVtLXZhbHVlLXR3by1pbnB1dCcpKS5maW5kKCdpbnB1dCcpLnZhbCh0aGlzLm1vZGVsLnAyTWluKVxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnbWF4aW11bS12YWx1ZS10d28taW5wdXQnKSkuZmluZCgnaW5wdXQnKS52YWwodGhpcy5tb2RlbC5wMk1heClcbiAgfSxcbiAgc2VsZWN0U3BlY2llc09mSW50ZXJlc3Q6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLmdldFNwZWNpZXModmFsKTtcbiAgICB0aGlzLm1vZGVsLnNwZWNpZXNPZkludGVyZXN0ID0gc3BlY2llc1xuICB9LFxuICBnZXRTcGVjaWVzOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5tb2RlbC5wYXJlbnQuc3BlY2llcy5maWx0ZXIoZnVuY3Rpb24gKHNwZWNpZSkge1xuICAgICAgaWYoc3BlY2llLm5hbWUgPT09IG5hbWUpIHJldHVybiBzcGVjaWVcbiAgICB9KVswXTtcbiAgICByZXR1cm4gc3BlY2llcztcbiAgfSxcbiAgZ2V0UGFyYW1ldGVyOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdmFyIHBhcmFtZXRlciA9IHRoaXMubW9kZWwucGFyZW50LnBhcmFtZXRlcnMuZmlsdGVyKGZ1bmN0aW9uIChwYXJhbWV0ZXIpIHtcbiAgICAgIGlmKHBhcmFtZXRlci5uYW1lID09PSB2YWwpIHJldHVybiBwYXJhbWV0ZXI7XG4gICAgfSlbMF07XG4gICAgcmV0dXJuIHBhcmFtZXRlcjtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKVxuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIHBhcmFtMU1pblZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdtaW5pbXVtLXZhbHVlLW9uZS1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTEtbWluLXZhbHVlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwMU1pbicsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMU1pblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMU1heFZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdtYXhpbXVtLXZhbHVlLW9uZS1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTEtbWF4LXZhbHVlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwMU1heCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMU1heFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMVN0ZXBWYWx1ZUlucHV0OiB7XG4gICAgICBob29rOiAnc3RlcC1vbmUtaW5wdXQnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdwYXJhbS0xLXN0ZXAtdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AxU3RlcHMnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwucDFTdGVwc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMk1pblZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdtaW5pbXVtLXZhbHVlLXR3by1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTItbWluLXZhbHVlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwMk1pbicsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMk1pblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMk1heFZhbHVlSW5wdXQ6IHtcbiAgICAgIGhvb2s6ICdtYXhpbXVtLXZhbHVlLXR3by1pbnB1dCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3BhcmFtLTItbWF4LXZhbHVlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwMk1heCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wMk1heFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcmFtMlN0ZXBWYWx1ZUlucHV0OiB7XG4gICAgICBob29rOiAnc3RlcC10d28taW5wdXQnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdwYXJhbS0yLXN0ZXAtdmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3AyU3RlcHMnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwucDJTdGVwc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICB9XG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdQYXJhbWV0ZXIgPSByZXF1aXJlKCcuL3ZpZXctcGFyYW1ldGVyJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3UGFyYW1ldGVyLCB0aGlzLnF1ZXJ5QnlIb29rKCdwYXJhbWV0ZXItbGlzdCcpKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFZpZXdSZWFjdGlvbnMgPSByZXF1aXJlKCcuL3ZpZXctcmVhY3Rpb25zJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uc1ZpZXdlci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIFZpZXdSZWFjdGlvbnMsIHRoaXMucXVlcnlCeUhvb2soJ3JlYWN0aW9uLWxpc3QnKSlcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3UnVsZXMgPSByZXF1aXJlKCcuL3ZpZXctcnVsZXMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcnVsZXNWaWV3ZXIucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb2xsZWN0aW9uLCBWaWV3UnVsZXMsIHRoaXMucXVlcnlCeUhvb2soJ3J1bGVzLWxpc3QnKSlcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvc2ltdWxhdGlvblNldHRpbmdzVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZVNldHRpbmdzQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuYWxnb3JpdGhtID0gdGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCIgP1xuICAgICAgXCJBbGdvcml0aG06IEh5YnJpZCBPREUvU1NBXCIgOiBcIkFsZ29yaXRobTogXCIgKyB0aGlzLm1vZGVsLmFsZ29yaXRobVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgYWxnb3JpdGhtID0gdGhpcy5tb2RlbC5hbGdvcml0aG1cbiAgICBpZihhbGdvcml0aG0gPT09IFwiT0RFXCIgfHwgYWxnb3JpdGhtID09PSBcIkh5YnJpZC1UYXUtTGVhcGluZ1wiKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnZGV0ZXJtaW5pc3RpYycpKS5jb2xsYXBzZSgnc2hvdycpXG4gICAgfVxuICAgIGlmKGFsZ29yaXRobSA9PT0gXCJTU0FcIiB8fCBhbGdvcml0aG0gPT09IFwiVGF1LUxlYXBpbmdcIiB8fCBhbGdvcml0aG0gPT09IFwiSHlicmlkLVRhdS1MZWFwaW5nXCIpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzdG9jaGFzdGljJykpLmNvbGxhcHNlKCdzaG93JylcbiAgICAgIGlmKGFsZ29yaXRobSA9PT0gXCJTU0FcIil7XG4gICAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnU1NBJykpLmNvbGxhcHNlKCdzaG93JylcbiAgICAgIH1lbHNle1xuICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ1RhdScpKS5jb2xsYXBzZSgnc2hvdycpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBjaGFuZ2VTZXR0aW5nc0NvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoJy4uL3Rvb2x0aXBzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zaW11bGF0aW9uU2V0dGluZ3MucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAgJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNlbGVjdC1vZGVdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3Qtc3NhXScgOiAnaGFuZGxlU2VsZWN0U2ltdWxhdGlvbkFsZ29yaXRobUNsaWNrJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LXRhdS1sZWFwaW5nXScgOiAnaGFuZGxlU2VsZWN0U2ltdWxhdGlvbkFsZ29yaXRobUNsaWNrJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LWh5YnJpZC10YXVdJyA6ICdoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2snLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtYXV0b21hdGljXScgOiAnaGFuZGxlU2VsZWN0U2ltdWxhdGlvbkFsZ29yaXRobUNsaWNrJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMubW9kZWwgPSBhdHRycy5tb2RlbDtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMuc2ltdWxhdGlvblNldHRpbmdzXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKCF0aGlzLm1vZGVsLmlzQXV0b21hdGljKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LW9kZScpKS5wcm9wKCdjaGVja2VkJywgQm9vbGVhbih0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJPREVcIikpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3Qtc3NhJykpLnByb3AoJ2NoZWNrZWQnLCBCb29sZWFuKHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIlNTQVwiKSk7IFxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtdGF1LWxlYXBpbmcnKSkucHJvcCgnY2hlY2tlZCcsIEJvb2xlYW4odGhpcy5tb2RlbC5hbGdvcml0aG0gPT09IFwiVGF1LUxlYXBpbmdcIikpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtaHlicmlkLXRhdScpKS5wcm9wKCdjaGVja2VkJywgQm9vbGVhbih0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIikpO1xuICAgIH1lbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtYXV0b21hdGljJykpLnByb3AoJ2NoZWNrZWQnLCB0aGlzLm1vZGVsLmlzQXV0b21hdGljKTtcbiAgICAgIHRoaXMubW9kZWwubGV0VXNDaG9vc2VGb3JZb3UoKTtcbiAgICB9XG4gICAgdGhpcy5kaXNhYmxlSW5wdXRGaWVsZEJ5QWxnb3JpdGhtKCk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuXG4gICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKVxuICB9LFxuICBoYW5kbGVTZWxlY3RTaW11bGF0aW9uQWxnb3JpdGhtQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbHVlID0gZS50YXJnZXQuZGF0YXNldC5uYW1lO1xuICAgIHRoaXMuc2V0U2ltdWxhdGlvbkFsZ29yaXRobSh2YWx1ZSlcbiAgfSxcbiAgc2V0U2ltdWxhdGlvbkFsZ29yaXRobTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5tb2RlbC5pc0F1dG9tYXRpYyA9IEJvb2xlYW4odmFsdWUgPT09ICdBdXRvbWF0aWMnKVxuICAgIGlmKCF0aGlzLm1vZGVsLmlzQXV0b21hdGljKXtcbiAgICAgIHRoaXMubW9kZWwuYWxnb3JpdGhtID0gdmFsdWU7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLm1vZGVsLmxldFVzQ2hvb3NlRm9yWW91KCk7XG4gICAgfVxuICAgIHRoaXMuZGlzYWJsZUlucHV0RmllbGRCeUFsZ29yaXRobSgpO1xuICB9LFxuICBkaXNhYmxlSW5wdXRGaWVsZEJ5QWxnb3JpdGhtOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlzQXV0b21hdGljID0gdGhpcy5tb2RlbC5pc0F1dG9tYXRpY1xuICAgIHZhciBpc09ERSA9IHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIk9ERVwiO1xuICAgIHZhciBpc1NTQSA9IHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIlNTQVwiO1xuICAgIHZhciBpc0xlYXBpbmcgPSB0aGlzLm1vZGVsLmFsZ29yaXRobSA9PT0gXCJUYXUtTGVhcGluZ1wiO1xuICAgIHZhciBpc0h5YnJpZCA9IHRoaXMubW9kZWwuYWxnb3JpdGhtID09PSBcIkh5YnJpZC1UYXUtTGVhcGluZ1wiO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vayhcInJlbGF0aXZlLXRvbGVyYW5jZVwiKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsICEoaXNPREUgfHwgaXNIeWJyaWQgfHwgaXNBdXRvbWF0aWMpKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJhYnNvbHV0ZS10b2xlcmFuY2VcIikpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCAhKGlzT0RFIHx8IGlzSHlicmlkIHx8IGlzQXV0b21hdGljKSk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKFwidHJhamVjdG9yaWVzXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgIShpc1NTQSB8fCBpc0xlYXBpbmcgfHwgaXNIeWJyaWQgfHwgaXNBdXRvbWF0aWMpKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJzZWVkXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgIShpc1NTQSB8fCBpc0xlYXBpbmcgfHwgaXNIeWJyaWQgfHwgaXNBdXRvbWF0aWMpKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJ0YXUtdG9sZXJhbmNlXCIpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgIShpc0h5YnJpZCB8fCBpc0xlYXBpbmcgfHwgaXNBdXRvbWF0aWMpKTtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFJlbGF0aXZlVG9sZXJhbmNlOiB7XG4gICAgICBob29rOiAncmVsYXRpdmUtdG9sZXJhbmNlJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncmVsYXRpdmUtdG9sZXJhbmNlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdyZWxhdGl2ZVRvbCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5yZWxhdGl2ZVRvbFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dEFic29sdXRlVG9sZXJhbmNlOiB7XG4gICAgICBob29rOiAnYWJzb2x1dGUtdG9sZXJhbmNlJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnYWJzb2x1dGUtdG9sZXJhbmNlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdhYnNvbHV0ZVRvbCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5hYnNvbHV0ZVRvbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGlucHV0UmVhbGl6YXRpb25zOiB7XG4gICAgICBob29rOiAndHJhamVjdG9yaWVzJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncmVhbGl6YXRpb25zJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdyZWFsaXphdGlvbnMnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwucGFyZW50LmlzUHJldmlldyA/IDEgOiB0aGlzLm1vZGVsLnJlYWxpemF0aW9uc1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFNlZWQ6IHtcbiAgICAgIGhvb2s6ICdzZWVkJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3NlZWQnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6ICdzZWVkJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnNlZWRcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRUYXVUb2xlcmFuY2U6IHtcbiAgICAgIGhvb2s6ICd0YXUtdG9sZXJhbmNlJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3ICh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdUYXUtVG9sZXJhbmNlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICd0YXVUb2wnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwudGF1VG9sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBWaWV3U3BlY2llID0gcmVxdWlyZSgnLi92aWV3LXNwZWNpZScpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zcGVjaWVzVmlld2VyLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbiwgVmlld1NwZWNpZSwgdGhpcy5xdWVyeUJ5SG9vaygnc3BlY2llLWxpc3QnKSlcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3RXZlbnRBc3NpZ25tZW50cy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBBc3NpZ25tZW50c1ZpZXdlciA9IHJlcXVpcmUoJy4vZXZlbnQtYXNzaWdubWVudHMtdmlld2VyJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdFdmVudHMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmluaXRpYWxWYWx1ZSc6IHtcbiAgICAgIGhvb2s6ICdldmVudC10cmlnZ2VyLWluaXQtdmFsdWUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2NoZWNrZWQnLFxuICAgIH0sXG4gICAgJ21vZGVsLnBlcnNpc3RlbnQnOiB7XG4gICAgICBob29rOiAnZXZlbnQtdHJpZ2dlci1wZXJzaXN0ZW50JyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjaGVja2VkJyxcbiAgICB9LFxuICAgICdtb2RlbC51c2VWYWx1ZXNGcm9tVHJpZ2dlclRpbWUnOiB7XG4gICAgICBob29rOiAndXNlLXZhbHVlcy1mcm9tLXRyaWdnZXItdGltZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY2hlY2tlZCcsXG4gICAgfSxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuZGVsYXkgPSB0aGlzLm1vZGVsLmRlbGF5ID09PSBcIlwiID8gXCJOb25lXCIgOiB0aGlzLm1vZGVsLmRlbGF5XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBhc3NpZ25tZW50c1ZpZXdlciA9IG5ldyBBc3NpZ25tZW50c1ZpZXdlcih7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLmV2ZW50QXNzaWdubWVudHNcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhhc3NpZ25tZW50c1ZpZXdlciwgJ2Fzc2lnbm1lbnQtdmlld2VyJyk7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3ZpZXdQYXJhbWV0ZXJzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxufSk7IiwidmFyIGthdGV4ID0gcmVxdWlyZSgna2F0ZXgnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1JlYWN0aW9ucy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmF0ZSA9IHRoaXMubW9kZWwucmVhY3Rpb25UeXBlID09PSBcImN1c3RvbS1wcm9wZW5zaXR5XCIgP1xuICAgICAgdGhpcy5tb2RlbC5wcm9wZW5zaXR5IDogdGhpcy5tb2RlbC5yYXRlLm5hbWVcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAga2F0ZXgucmVuZGVyKHRoaXMubW9kZWwuc3VtbWFyeSwgdGhpcy5xdWVyeUJ5SG9vaygnc3VtbWFyeScpLCB7XG4gICAgICBkaXNwbGF5TW9kZTogdHJ1ZSxcbiAgICAgIG91dHB1dDogJ21hdGhtbCdcbiAgICB9KTtcbiAgfSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvdmlld1J1bGVzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy92aWV3U3BlY2llcy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc3dpdGNoaW5nVmFsV2l0aExhYmVsID0gdGhpcy5tb2RlbC5pc1N3aXRjaFRvbCA/IFxuICAgICAgXCJTd2l0Y2hpbmcgVG9sZXJhbmNlOiBcIiArIHRoaXMubW9kZWwuc3dpdGNoVG9sIDpcbiAgICAgIFwiTWluaW11bSBWYWx1ZSBGb3IgU3dpdGNoaW5nOiBcIiArIHRoaXMubW9kZWwuc3dpdGNoTWluXG4gIH0sXG59KTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgdGVzdHMgPSByZXF1aXJlKCcuLi92aWV3cy90ZXN0cycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTaW1TZXR0aW5nc1ZpZXcgPSByZXF1aXJlKCcuL3NpbXVsYXRpb24tc2V0dGluZ3MnKTtcbnZhciBQYXJhbVN3ZWVwU2V0dGluZ3NWaWV3ID0gcmVxdWlyZSgnLi9wYXJhbWV0ZXItc3dlZXAtc2V0dGluZ3MnKTtcbnZhciBXb3JrZmxvd1N0YXRlQnV0dG9uc1ZpZXcgPSByZXF1aXJlKCcuL3dvcmtmbG93LXN0YXRlLWJ1dHRvbnMnKTtcbi8vbW9kZWxzXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvbW9kZWwnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvd29ya2Zsb3dFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnR5cGUgPSBhdHRycy50eXBlO1xuICAgIHRoaXMuc2V0dGluZ3NWaWV3cyA9IHt9O1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlyZWN0b3J5ID0gYXR0cnMuZGlyZWN0b3J5XG4gICAgdmFyIG1vZGVsRmlsZSA9IGRpcmVjdG9yeS5zcGxpdCgnLycpLnBvcCgpO1xuICAgIHZhciBuYW1lID0gbW9kZWxGaWxlLnNwbGl0KCcuJylbMF07XG4gICAgdmFyIGlzU3BhdGlhbCA9IG1vZGVsRmlsZS5zcGxpdCgnLicpLnBvcCgpLnN0YXJ0c1dpdGgoJ3MnKTtcbiAgICB0aGlzLm1vZGVsID0gbmV3IE1vZGVsKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBkaXJlY3Rvcnk6IGRpcmVjdG9yeSxcbiAgICAgIGlzX3NwYXRpYWw6IGlzU3BhdGlhbCxcbiAgICAgIGlzUHJldmlldzogZmFsc2UsXG4gICAgfSk7XG4gICAgdGhpcy5tb2RlbC5mZXRjaCh7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobW9kZWwsIHJlc3BvbnNlLCBvcHRpb25zKSB7XG4gICAgICAgIHNlbGYucmVuZGVyU3Vidmlld3MoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoZSkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKGUpIHtcbiAgfSxcbiAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnB1dE5hbWUgPSBuZXcgSW5wdXRWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgbGFiZWw6ICdNb2RlbCBQYXRoOiAnLFxuICAgICAgdGVzdHM6IHRlc3RzLm5hbWVUZXN0cyxcbiAgICAgIG1vZGVsS2V5OiAnZGlyZWN0b3J5JyxcbiAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICB2YWx1ZTogdGhpcy5tb2RlbC5kaXJlY3RvcnksXG4gICAgfSk7XG4gICAgLy9pbml0aWFsaXplIHRoZSBzZXR0aW5ncyB2aWV3cyBhbmQgYWRkIGl0IHRvIHRoZSBkaWN0aW9uYXJ5IG9mIHNldHRpbmdzIHZpZXdzXG4gICAgdGhpcy5zZXR0aW5nc1ZpZXdzLmdpbGxlc3B5ID0gbmV3IFNpbVNldHRpbmdzVmlldyh7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICBtb2RlbDogdGhpcy5tb2RlbC5zaW11bGF0aW9uU2V0dGluZ3MsXG4gICAgfSk7XG4gICAgdGhpcy5zZXR0aW5nc1ZpZXdzLnBhcmFtZXRlclN3ZWVwID0gbmV3IFBhcmFtU3dlZXBTZXR0aW5nc1ZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgbW9kZWw6IHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncyxcbiAgICB9KTtcbiAgICB2YXIgd29ya2Zsb3dTdGF0ZUJ1dHRvbnMgPSBuZXcgV29ya2Zsb3dTdGF0ZUJ1dHRvbnNWaWV3KHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoaW5wdXROYW1lLCBcIm1vZGVsLW5hbWUtY29udGFpbmVyXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuc2V0dGluZ3NWaWV3c1snZ2lsbGVzcHknXSwgJ3NpbS1zZXR0aW5ncy1jb250YWluZXInKTtcbiAgICBpZih0aGlzLnR5cGUgPT09IFwicGFyYW1ldGVyU3dlZXBcIil7XG4gICAgICB2YXIgc3BlY2llcyA9IHRoaXMubW9kZWwuc3BlY2llcztcbiAgICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5wYXJhbWV0ZXJzO1xuICAgICAgdmFyIHBhcmFtZXRlck9uZSA9IHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wYXJhbWV0ZXJPbmVcbiAgICAgIHZhciBwYXJhbWV0ZXJUd28gPSB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MucGFyYW1ldGVyVHdvXG4gICAgICB2YXIgc3BlY2llc09mSW50ZXJlc3QgPSB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3Muc3BlY2llc09mSW50ZXJlc3RcbiAgICAgIHZhciBwMUV4aXN0cyA9IHBhcmFtZXRlcnMuZmlsdGVyKGZ1bmN0aW9uIChwYXJhbSkgeyBpZihwYXJhbWV0ZXJPbmUuY29tcElEICYmIHBhcmFtZXRlck9uZS5jb21wSUQgPT09IHBhcmFtLmNvbXBJRCkgcmV0dXJuIHBhcmFtfSkubGVuZ3RoXG4gICAgICB2YXIgcDJFeGlzdHMgPSBwYXJhbWV0ZXJzLmZpbHRlcihmdW5jdGlvbiAocGFyYW0pIHsgaWYocGFyYW1ldGVyVHdvLmNvbXBJRCAmJiBwYXJhbWV0ZXJUd28uY29tcElEID09PSBwYXJhbS5jb21wSUQpIHJldHVybiBwYXJhbX0pLmxlbmd0aFxuICAgICAgdmFyIHNwZWNpZXNPZkludGVyZXN0RXhpc3RzID0gc3BlY2llcy5maWx0ZXIoZnVuY3Rpb24gKHNwZWNpZSkgeyBpZihzcGVjaWVzT2ZJbnRlcmVzdC5jb21wSUQgJiYgc3BlY2llc09mSW50ZXJlc3QuY29tcElEID09PSBzcGVjaWUuY29tcElEKSByZXR1cm4gc3BlY2llc30pLmxlbmd0aFxuICAgICAgaWYoIXBhcmFtZXRlck9uZS5uYW1lIHx8ICFwMUV4aXN0cyl7XG4gICAgICAgIHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wYXJhbWV0ZXJPbmUgPSBwYXJhbWV0ZXJzLmF0KDApXG4gICAgICAgIHZhciB2YWwgPSBldmFsKHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wYXJhbWV0ZXJPbmUuZXhwcmVzc2lvbilcbiAgICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnAxTWluID0gdmFsICogMC41XG4gICAgICAgIHRoaXMubW9kZWwucGFyYW1ldGVyU3dlZXBTZXR0aW5ncy5wMU1heCA9IHZhbCAqIDEuNVxuICAgICAgfVxuICAgICAgaWYocGFyYW1ldGVycy5hdCgxKSAmJiAoIXBhcmFtZXRlclR3by5uYW1lKSB8fCAhcDJFeGlzdHMpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnBhcmFtZXRlclR3byA9IHBhcmFtZXRlcnMuYXQoMSlcbiAgICAgICAgdmFyIHZhbCA9IGV2YWwodGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnBhcmFtZXRlclR3by5leHByZXNzaW9uKVxuICAgICAgICB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3MucDJNaW4gPSB2YWwgKiAwLjVcbiAgICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnAyTWF4ID0gdmFsICogMS41XG4gICAgICB9XG4gICAgICBpZighdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnNwZWNpZXNPZkludGVyZXN0Lm5hbWUgfHwgIXNwZWNpZXNPZkludGVyZXN0RXhpc3RzKXtcbiAgICAgICAgdGhpcy5tb2RlbC5wYXJhbWV0ZXJTd2VlcFNldHRpbmdzLnNwZWNpZXNPZkludGVyZXN0ID0gc3BlY2llcy5hdCgwKVxuICAgICAgfVxuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5zZXR0aW5nc1ZpZXdzWydwYXJhbWV0ZXJTd2VlcCddLCAncGFyYW0tc3dlZXAtc2V0dGluZ3MtY29udGFpbmVyJyk7XG4gICAgfVxuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHdvcmtmbG93U3RhdGVCdXR0b25zLCAnd29ya2Zsb3ctc3RhdGUtYnV0dG9ucy1jb250YWluZXInKTtcbiAgICB0aGlzLnBhcmVudC50cmFqZWN0b3JpZXMgPSB0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncy5yZWFsaXphdGlvbnNcbiAgICB0aGlzLnBhcmVudC5zcGVjaWVzID0gdGhpcy5tb2RlbC5zcGVjaWVzXG4gICAgdGhpcy5wYXJlbnQuc3BlY2llc09mSW50ZXJlc3QgPSB0aGlzLm1vZGVsLnBhcmFtZXRlclN3ZWVwU2V0dGluZ3Muc3BlY2llc09mSW50ZXJlc3RcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgY29sbGFwc2VDb250YWluZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJ3b3JrZmxvdy1lZGl0b3ItY29udGFpbmVyXCIpKS5jb2xsYXBzZSgpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIHhociA9IHJlcXVpcmUoJ3hocicpO1xudmFyIGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3dvcmtmbG93SW5mby5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gICAgdGhpcy5sb2dzUGF0aCA9IGF0dHJzLmxvZ3NQYXRoO1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHRoaXMubGlzdE9mV2FybmluZ3MgPSBbXTtcbiAgICB0aGlzLmxpc3RPZkVycm9ycyA9IFtdO1xuICAgIHRoaXMubGlzdE9mTm90ZXMgPSBbXTtcbiAgICBpZih0aGlzLnN0YXR1cyA9PT0gJ2NvbXBsZXRlJyB8fCB0aGlzLnN0YXR1cyA9PT0gJ2Vycm9yJyl7XG4gICAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgXCIvd29ya2Zsb3cvd29ya2Zsb3ctbG9nc1wiLCB0aGlzLmxvZ3NQYXRoKVxuICAgICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCl7XG4gICAgICAgICAgdmFyIGxvZ3MgPSBib2R5LnNwbGl0KFwiXFxuXCIpXG4gICAgICAgICAgbG9ncy5mb3JFYWNoKHNlbGYucGFyc2VMb2dzLCBzZWxmKVxuICAgICAgICAgIHNlbGYuZXhwYW5kTG9nQ29udGFpbmVycygpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBib2R5ID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKHRoaXMuc3RhdHVzID09PSAnY29tcGxldGUnKXtcbiAgICAgIHRoaXMuZW5hYmxlQ29sbGFwc2VCdXR0b24oKVxuICAgIH1lbHNlIGlmKHRoaXMuc3RhdHVzID09PSAnZXJyb3InKXtcbiAgICAgIHRoaXMuZXhwYW5kSW5mb0NvbnRhaW5lcigpXG4gICAgfVxuICB9LFxuICBwYXJzZUxvZ3M6IGZ1bmN0aW9uIChsb2cpIHtcbiAgICB2YXIgbWVzc2FnZSA9IGxvZy5zcGxpdCgncm9vdCAtICcpLnBvcCgpXG4gICAgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiV0FSTklOR1wiKSl7XG4gICAgICB0aGlzLmxpc3RPZldhcm5pbmdzLnB1c2gobWVzc2FnZS5zcGxpdChcIldBUk5JTkdcIikucG9wKCkpXG4gICAgfWVsc2UgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiRVJST1JcIikpe1xuICAgICAgdGhpcy5saXN0T2ZFcnJvcnMucHVzaChtZXNzYWdlLnNwbGl0KFwiRVJST1JcIikucG9wKCkpXG4gICAgfWVsc2UgaWYobWVzc2FnZS5zdGFydHNXaXRoKFwiQ1JJVElDQUxcIikpe1xuICAgICAgdGhpcy5saXN0T2ZFcnJvcnMucHVzaChtZXNzYWdlLnNwbGl0KFwiQ1JJVElDQUxcIikucG9wKCkpXG4gICAgfWVsc2V7XG4gICAgICB0aGlzLmxpc3RPZk5vdGVzLnB1c2gobWVzc2FnZSlcbiAgICB9XG4gIH0sXG4gIGVuYWJsZUNvbGxhcHNlQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgfSxcbiAgZXhwYW5kSW5mb0NvbnRhaW5lcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlQ29sbGFwc2VCdXR0b24oKTtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3dvcmtmbG93LWluZm8nKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlXCIpXG4gIH0sXG4gIGV4cGFuZExvZ0NvbnRhaW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLmxpc3RPZldhcm5pbmdzLmxlbmd0aCkge1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy13YXJuaW5ncycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgdmFyIGxpc3RPZldhcm5pbmdzID0gXCI8cD5cIiArIHRoaXMubGlzdE9mV2FybmluZ3Muam9pbignPGJyPicpICsgXCI8L3A+XCI7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2xpc3Qtb2Ytd2FybmluZ3MnKSkuaHRtbChsaXN0T2ZXYXJuaW5ncyk7XG4gICAgfVxuICAgIGlmKHRoaXMubGlzdE9mRXJyb3JzLmxlbmd0aCkge1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1lcnJvcnMnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAgIHZhciBsaXN0T2ZFcnJvcnMgPSBcIjxwPlwiICsgdGhpcy5saXN0T2ZFcnJvcnMuam9pbignPGJyPicpICsgXCI8L3A+XCI7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2xpc3Qtb2YtZXJyb3JzJykpLmh0bWwobGlzdE9mRXJyb3JzKTtcbiAgICB9XG4gICAgaWYodGhpcy5saXN0T2ZOb3Rlcy5sZW5ndGgpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnd29ya2Zsb3ctc3RhdGlzdGljcycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgdmFyIGxpc3RPZk5vdGVzID0gXCI8cD5cIiArIHRoaXMubGlzdE9mTm90ZXMuam9pbignPGJyPicpICsgXCI8L3A+XCI7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2xpc3Qtb2Ytbm90ZXMnKSkuaHRtbChsaXN0T2ZOb3Rlcyk7XG4gICAgfVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vayhcImNvbGxhcHNlXCIpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKFwiY29sbGFwc2VcIikpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vayhcImNvbGxhcHNlXCIpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciBQbG90bHkgPSByZXF1aXJlKCcuLi9saWIvcGxvdGx5Jyk7XG52YXIgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgZ2lsbGVzcHlSZXN1bHRzVGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZ2lsbGVzcHlSZXN1bHRzLnB1ZycpO1xudmFyIGdpbGxlc3B5UmVzdWx0c0Vuc2VtYmxlVGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZ2lsbGVzcHlSZXN1bHRzRW5zZW1ibGUucHVnJyk7XG52YXIgcGFyYW1ldGVyU3dlZXBSZXN1bHRzVGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcGFyYW1ldGVyU3dlZXBSZXN1bHRzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2Utc3RkZGV2cmFuZ2VdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2Utc3RkZGV2cmFuZ2VcIik7XG4gICAgfSxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZS10cmFqZWN0b3JpZXNdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2UtdHJhamVjdG9yaWVzXCIpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2Utc3RkZGV2XScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXN0ZGRldlwiKTtcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLXRyYWptZWFuXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlLXRyYWptZWFuXCIpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2UtcHN3ZWVwXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoXCJjb2xsYXBzZS1wc3dlZXBcIik7XG4gICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KFwiY29sbGFwc2VcIik7XG4gICAgfSxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9dGl0bGVdJyA6ICdzZXRUaXRsZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXhheGlzXScgOiAnc2V0WEF4aXMnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz15YXhpc10nIDogJ3NldFlBeGlzJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3BlY2llLW9mLWludGVyZXN0LWxpc3RdJyA6ICdnZXRQbG90Rm9yU3BlY2llcycsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWZlYXR1cmUtZXh0cmFjdGlvbi1saXN0XScgOiAnZ2V0UGxvdEZvckZlYXR1cmVFeHRyYWN0b3InLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1lbnNlbWJsZS1hZ2dyYWdhdG9yLWxpc3RdJyA6ICdnZXRQbG90Rm9yRW5zZW1ibGVBZ2dyYWdhdG9yJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1wbG90XScgOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHR5cGUgPSBlLnRhcmdldC5pZFxuICAgICAgaWYodGhpcy5wbG90c1t0eXBlXSkge1xuICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soXCJlZGl0LXBsb3QtYXJnc1wiKSkuY29sbGFwc2UoXCJzaG93XCIpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMuZ2V0UGxvdCh0eXBlKTtcbiAgICAgICAgZS50YXJnZXQuaW5uZXJUZXh0ID0gXCJFZGl0IFBsb3RcIlxuICAgICAgfVxuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZG93bmxvYWQtcG5nLWN1c3RvbV0nIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB0eXBlID0gZS50YXJnZXQuaWQ7XG4gICAgICB0aGlzLmNsaWNrRG93bmxvYWRQTkdCdXR0b24odHlwZSlcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWRvd25sb2FkLWpzb25dJyA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgdHlwZSA9IGUudGFyZ2V0LmlkO1xuICAgICAgdGhpcy5leHBvcnRUb0pzb25GaWxlKHRoaXMucGxvdHNbdHlwZV0sIHR5cGUpXG4gICAgfVxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50cmFqZWN0b3JpZXMgPSBhdHRycy50cmFqZWN0b3JpZXM7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gICAgdGhpcy5zcGVjaWVzID0gYXR0cnMuc3BlY2llcztcbiAgICB0aGlzLnR5cGUgPSBhdHRycy50eXBlO1xuICAgIHRoaXMuc3BlY2llc09mSW50ZXJlc3QgPSBhdHRycy5zcGVjaWVzT2ZJbnRlcmVzdDtcbiAgICB0aGlzLmZlYXR1cmVFeHRyYWN0b3IgPSBcImZpbmFsXCI7XG4gICAgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IgPSBcImF2Z1wiO1xuICAgIHRoaXMucGxvdHMgPSB7fVxuICAgIHRoaXMucGxvdEFyZ3MgPSB7fVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLnR5cGUgPT09IFwicGFyYW1ldGVyU3dlZXBcIil7XG4gICAgICB0aGlzLnRlbXBsYXRlID0gcGFyYW1ldGVyU3dlZXBSZXN1bHRzVGVtcGxhdGVcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLnRyYWplY3RvcmllcyA+IDEgPyBnaWxsZXNweVJlc3VsdHNFbnNlbWJsZVRlbXBsYXRlIDogZ2lsbGVzcHlSZXN1bHRzVGVtcGxhdGVcbiAgICB9XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYodGhpcy5zdGF0dXMgPT09ICdjb21wbGV0ZScpe1xuICAgICAgdGhpcy5leHBhbmRDb250YWluZXIoKVxuICAgIH1cbiAgICB2YXIgc3BlY2llc05hbWVzID0gdGhpcy5zcGVjaWVzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7IHJldHVybiBzcGVjaWUubmFtZX0pO1xuICAgIHZhciBmZWF0dXJlRXh0cmFjdG9ycyA9IFtcIk1pbmltdW0gb2YgcG9wdWxhdGlvblwiLCBcIk1heGltdW0gb2YgcG9wdWxhdGlvblwiLCBcIkF2ZXJhZ2Ugb2YgcG9wdWxhdGlvblwiLCBcIlZhcmlhbmNlIG9mIHBvcHVsYXRpb25cIiwgXCJQb3B1bGF0aW9uIGF0IGxhc3QgdGltZSBwb2ludFwiXVxuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JzID0gW1wiTWluaW11bSBvZiBlbnNlbWJsZVwiLCBcIk1heGltdW0gb2YgZW5zZW1ibGVcIiwgXCJBdmVyYWdlIG9mIGVuc2VtYmxlXCIsIFwiVmFyaWFuY2Ugb2YgZW5zZW1ibGVcIl1cbiAgICB2YXIgc3BlY2llc09mSW50ZXJlc3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3NwZWNpZXMtb2YtaW50ZXJlc3QnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBzcGVjaWVzTmFtZXMsXG4gICAgICB2YWx1ZTogdGhpcy5zcGVjaWVzT2ZJbnRlcmVzdFxuICAgIH0pO1xuICAgIHZhciBmZWF0dXJlRXh0cmFjdG9yVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdmZWF0dXJlLWV4dHJhY3RvcicsXG4gICAgICByZXF1aXJlczogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IGZlYXR1cmVFeHRyYWN0b3JzLFxuICAgICAgdmFsdWU6IFwiUG9wdWxhdGlvbiBhdCBsYXN0IHRpbWUgcG9pbnRcIlxuICAgIH0pO1xuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ2Vuc2VtYmxlLWFnZ3JhZ2F0b3InLFxuICAgICAgcmVxdWlyZXM6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBlbnNlbWJsZUFnZ3JhZ2F0b3JzLFxuICAgICAgdmFsdWU6IFwiQXZlcmFnZSBvZiBlbnNlbWJsZVwiXG4gICAgfSk7XG4gICAgaWYodGhpcy50eXBlID09PSBcInBhcmFtZXRlclN3ZWVwXCIpe1xuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3BlY2llc09mSW50ZXJlc3RWaWV3LCAnc3BlY2llLW9mLWludGVyZXN0LWxpc3QnKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGZlYXR1cmVFeHRyYWN0b3JWaWV3LCAnZmVhdHVyZS1leHRyYWN0aW9uLWxpc3QnKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGVuc2VtYmxlQWdncmFnYXRvclZpZXcsICdlbnNlbWJsZS1hZ2dyYWdhdG9yLWxpc3QnKTtcbiAgICAgIGlmKHRoaXMudHJhamVjdG9yaWVzIDw9IDEpe1xuICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2Vuc2VtYmxlLWFnZ3JhZ2F0b3ItbGlzdCcpKS5maW5kKCdzZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKHNvdXJjZSkpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soc291cmNlKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKHNvdXJjZSkpLnRleHQoJysnKTtcbiAgfSxcbiAgc2V0VGl0bGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5wbG90QXJnc1sndGl0bGUnXSA9IGUudGFyZ2V0LnZhbHVlXG4gICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLnBsb3RzKSB7XG4gICAgICB2YXIgZmlnID0gdGhpcy5wbG90c1t0eXBlXVxuICAgICAgZmlnLmxheW91dC50aXRsZS50ZXh0ID0gZS50YXJnZXQudmFsdWVcbiAgICAgIHRoaXMucGxvdEZpZ3VyZShmaWcsIHR5cGUpXG4gICAgfVxuICB9LFxuICBzZXRZQXhpczogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLnBsb3RBcmdzWyd5YXhpcyddID0gZS50YXJnZXQudmFsdWVcbiAgICBmb3IgKHZhciB0eXBlIGluIHRoaXMucGxvdHMpIHtcbiAgICAgIHZhciBmaWcgPSB0aGlzLnBsb3RzW3R5cGVdXG4gICAgICBmaWcubGF5b3V0LnlheGlzLnRpdGxlLnRleHQgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgdGhpcy5wbG90RmlndXJlKGZpZywgdHlwZSlcbiAgICB9XG4gIH0sXG4gIHNldFhBeGlzOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMucGxvdEFyZ3NbJ3hheGlzJ10gPSBlLnRhcmdldC52YWx1ZVxuICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5wbG90cykge1xuICAgICAgdmFyIGZpZyA9IHRoaXMucGxvdHNbdHlwZV1cbiAgICAgIGZpZy5sYXlvdXQueGF4aXMudGl0bGUudGV4dCA9IGUudGFyZ2V0LnZhbHVlXG4gICAgICB0aGlzLnBsb3RGaWd1cmUoZmlnLCB0eXBlKVxuICAgIH1cbiAgfSxcbiAgZ2V0UGxvdDogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVsID0gdGhpcy5xdWVyeUJ5SG9vayh0eXBlKVxuICAgIFBsb3RseS5wdXJnZShlbClcbiAgICB2YXIgZGF0YSA9IHt9XG4gICAgaWYodHlwZSA9PT0gJ3Bzd2VlcCcpe1xuICAgICAgbGV0IGtleSA9IHRoaXMuZ2V0UHN3ZWVwS2V5KClcbiAgICAgIGRhdGFbJ3BsdF9rZXknXSA9IGtleTtcbiAgICB9ZWxzZXtcbiAgICAgIGRhdGFbJ3BsdF9rZXknXSA9IHR5cGU7XG4gICAgfVxuICAgIGlmKE9iamVjdC5rZXlzKHRoaXMucGxvdEFyZ3MpLmxlbmd0aCl7XG4gICAgICBkYXRhWydwbHRfZGF0YSddID0gdGhpcy5wbG90QXJnc1xuICAgIH1lbHNle1xuICAgICAgZGF0YVsncGx0X2RhdGEnXSA9IFwiTm9uZVwiXG4gICAgfVxuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCBcIi93b3JrZmxvdy9wbG90LXJlc3VsdHNcIiwgdGhpcy5wYXJlbnQuZGlyZWN0b3J5LCAnP2RhdGE9JyArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB4aHIoe3VybDogZW5kcG9pbnQsIGpzb246IHRydWV9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSl7XG4gICAgICBpZihyZXNwb25zZS5zdGF0dXNDb2RlID49IDQwMCl7XG4gICAgICAgICQoc2VsZi5xdWVyeUJ5SG9vayh0eXBlKSkuaHRtbChib2R5Lk1lc3NhZ2UpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgc2VsZi5wbG90c1t0eXBlXSA9IGJvZHlcbiAgICAgICAgc2VsZi5wbG90RmlndXJlKGJvZHksIHR5cGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBwbG90RmlndXJlOiBmdW5jdGlvbiAoZmlndXJlLCB0eXBlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBob29rID0gdHlwZTtcbiAgICB2YXIgZWwgPSB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spXG4gICAgUGxvdGx5Lm5ld1Bsb3QoZWwsIGZpZ3VyZSlcbiAgICB0aGlzLnF1ZXJ5QWxsKFwiI1wiICsgdHlwZSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIGlmKGVsLmRpc2FibGVkKXtcbiAgICAgICAgZWwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgY2xpY2tEb3dubG9hZFBOR0J1dHRvbjogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgcG5nQnV0dG9uID0gJCgnZGl2W2RhdGEtaG9vayo9Jyt0eXBlKyddIGFbZGF0YS10aXRsZSo9XCJEb3dubG9hZCBwbG90IGFzIGEgcG5nXCJdJylbMF1cbiAgICBwbmdCdXR0b24uY2xpY2soKVxuICB9LFxuICBleHBvcnRUb0pzb25GaWxlOiBmdW5jdGlvbiAoanNvbkRhdGEsIHBsb3RUeXBlKSB7XG4gICAgbGV0IGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSk7XG4gICAgbGV0IGRhdGFVUkkgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhU3RyKTtcbiAgICBsZXQgZXhwb3J0RmlsZURlZmF1bHROYW1lID0gcGxvdFR5cGUgKyAnLXBsb3QuanNvbic7XG5cbiAgICBsZXQgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVVSSSk7XG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGV4cG9ydEZpbGVEZWZhdWx0TmFtZSk7XG4gICAgbGlua0VsZW1lbnQuY2xpY2soKTtcbiAgfSxcbiAgZXhwYW5kQ29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd3b3JrZmxvdy1yZXN1bHRzJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dChcImNvbGxhcHNlXCIpXG4gICAgaWYodGhpcy50eXBlID09PSBcInBhcmFtZXRlclN3ZWVwXCIpe1xuICAgICAgdGhpcy5nZXRQbG90KFwicHN3ZWVwXCIpXG4gICAgfWVsc2V7XG4gICAgICB0aGlzLnRyYWplY3RvcmllcyA+IDEgPyB0aGlzLmdldFBsb3QoXCJzdGRkZXZyYW5cIikgOiB0aGlzLmdldFBsb3QoXCJ0cmFqZWN0b3JpZXNcIilcbiAgICB9XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIGdldFBsb3RGb3JTcGVjaWVzOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc3BlY2llc09mSW50ZXJlc3QgPSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIHRoaXMuZ2V0UGxvdCgncHN3ZWVwJylcbiAgfSxcbiAgZ2V0UGxvdEZvckZlYXR1cmVFeHRyYWN0b3I6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGZlYXR1cmVFeHRyYWN0b3JzID0ge1wiTWluaW11bSBvZiBwb3B1bGF0aW9uXCI6XCJtaW5cIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTWF4aW11bSBvZiBwb3B1bGF0aW9uXCI6XCJtYXhcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQXZlcmFnZSBvZiBwb3B1bGF0aW9uXCI6XCJhdmdcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFyaWFuY2Ugb2YgcG9wdWxhdGlvblwiOlwidmFyXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlBvcHVsYXRpb24gYXQgbGFzdCB0aW1lIHBvaW50XCI6XCJmaW5hbFwifVxuICAgIHZhciB2YWx1ZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5mZWF0dXJlRXh0cmFjdG9yID0gZmVhdHVyZUV4dHJhY3RvcnNbdmFsdWVdXG4gICAgdGhpcy5nZXRQbG90KCdwc3dlZXAnKVxuICB9LFxuICBnZXRQbG90Rm9yRW5zZW1ibGVBZ2dyYWdhdG9yOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBlbnNlbWJsZUFnZ3JhZ2F0b3JzID0ge1wiTWluaW11bSBvZiBlbnNlbWJsZVwiOlwibWluXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTWF4aW11bSBvZiBlbnNlbWJsZVwiOlwibWF4XCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQXZlcmFnZSBvZiBlbnNlbWJsZVwiOlwiYXZnXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVmFyaWFuY2Ugb2YgZW5zZW1ibGVcIjpcInZhclwifVxuICAgIHZhciB2YWx1ZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IgPSBlbnNlbWJsZUFnZ3JhZ2F0b3JzW3ZhbHVlXVxuICAgIHRoaXMuZ2V0UGxvdCgncHN3ZWVwJylcbiAgfSxcbiAgZ2V0UHN3ZWVwS2V5OiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGtleSA9IHRoaXMuc3BlY2llc09mSW50ZXJlc3QgKyBcIi1cIiArIHRoaXMuZmVhdHVyZUV4dHJhY3RvclxuICAgIGlmKHRoaXMudHJhamVjdG9yaWVzID4gMSl7XG4gICAgICBrZXkgKz0gKFwiLVwiICsgdGhpcy5lbnNlbWJsZUFnZ3JhZ2F0b3IpXG4gICAgfVxuICAgIHJldHVybiBrZXlcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFRpdGxlOiB7XG4gICAgICBob29rOiAndGl0bGUnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy50aXRsZSB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFhBeGlzOiB7XG4gICAgICBob29rOiAneGF4aXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAneGF4aXMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy54YXhpcyB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFlBeGlzOiB7XG4gICAgICBob29rOiAneWF4aXMnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAneWF4aXMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6IG51bGwsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5wbG90QXJncy55YXhpcyB8fCBcIlwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIiwibGV0IGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB4aHIgPSByZXF1aXJlKCd4aHInKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy93b3JrZmxvd1N0YXRlQnV0dG9ucy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9c2F2ZV0nIDogJ2NsaWNrU2F2ZUhhbmRsZXInLFxuICAgICdjbGljayBbZGF0YS1ob29rPXN0YXJ0LXdvcmtmbG93XScgIDogJ2NsaWNrU3RhcnRXb3JrZmxvd0hhbmRsZXInLFxuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtbW9kZWxdJyA6ICdjbGlja0VkaXRNb2RlbEhhbmRsZXInLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICBjbGlja1NhdmVIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc2F2aW5nKCk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBtb2RlbCA9IHRoaXMubW9kZWxcbiAgICB2YXIgd2tmbFR5cGUgPSB0aGlzLnBhcmVudC5wYXJlbnQudHlwZTtcbiAgICB2YXIgb3B0VHlwZSA9IGRvY3VtZW50LlVSTC5lbmRzV2l0aChcIi5tZGxcIikgPyBcInNuXCIgOiBcInNlXCI7XG4gICAgdmFyIHdvcmtmbG93ID0gZG9jdW1lbnQuVVJMLmVuZHNXaXRoKFwiLm1kbFwiKSA/IHRoaXMucGFyZW50LnBhcmVudC53b3JrZmxvd05hbWUgOiB0aGlzLnBhcmVudC5wYXJlbnQuZGlyZWN0b3J5XG4gICAgdGhpcy5zYXZlTW9kZWwoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksICd3b3JrZmxvdy9zYXZlLXdvcmtmbG93LycsIHdrZmxUeXBlLCBvcHRUeXBlLCBtb2RlbC5kaXJlY3RvcnksIFwiPC0tR2lsbGVzUHkyV29ya2Zsb3ctLT5cIiwgd29ya2Zsb3cpO1xuICAgICAgeGhyKHt1cmk6IGVuZHBvaW50fSwgZnVuY3Rpb24gKGVyciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgc2VsZi5zYXZlZCgpO1xuICAgICAgICBpZihkb2N1bWVudC5VUkwuZW5kc1dpdGgoJy5tZGwnKSl7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGlybmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpXG4gICAgICAgICAgICBkaXJuYW1lLnBvcCgpXG4gICAgICAgICAgICBkaXJuYW1lID0gZGlybmFtZS5qb2luKCcvJylcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGRpcm5hbWUsIHNlbGYucGFyZW50LnBhcmVudC53b3JrZmxvd05hbWUgKyAnLndrZmwnKVxuICAgICAgICAgIH0sIDMwMDApOyBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGNsaWNrU3RhcnRXb3JrZmxvd0hhbmRsZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5zYXZlTW9kZWwodGhpcy5ydW5Xb3JrZmxvdy5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY2xpY2tFZGl0TW9kZWxIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHRoaXMuc2F2ZU1vZGVsKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3MvbW9kZWxzL2VkaXRcIiwgc2VsZi5tb2RlbC5kaXJlY3RvcnkpO1xuICAgIH0pO1xuICB9LFxuICBzYXZlTW9kZWw6IGZ1bmN0aW9uIChjYikge1xuICAgIC8vIHRoaXMubW9kZWwgaXMgYSBNb2RlbFZlcnNpb24sIHRoZSBwYXJlbnQgb2YgdGhlIGNvbGxlY3Rpb24gaXMgTW9kZWxcbiAgICBpZih0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncy5pc0F1dG9tYXRpYyl7XG4gICAgICB0aGlzLm1vZGVsLnNpbXVsYXRpb25TZXR0aW5ncy5sZXRVc0Nob29zZUZvcllvdSgpO1xuICAgIH1cbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgIGlmIChjYikge1xuICAgICAgbW9kZWwuc2F2ZShtb2RlbC5hdHRyaWJ1dGVzLCB7XG4gICAgICAgIHN1Y2Nlc3M6IGNiLFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzYXZpbmcgbW9kZWw6XCIsIG1vZGVsKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUmVzcG9uc2U6XCIsIHJlc3BvbnNlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2RlbC5zYXZlTW9kZWwoKTtcbiAgICB9XG4gIH0sXG4gIHNhdmluZzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzYXZpbmcgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzYXZpbmctd29ya2Zsb3cnKTtcbiAgICB2YXIgc2F2ZWQgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzYXZlZC13b3JrZmxvdycpO1xuICAgIHNhdmVkLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBzYXZpbmcuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG4gIH0sXG4gIHNhdmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNhdmluZyA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmluZy13b3JrZmxvdycpO1xuICAgIHZhciBzYXZlZCA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmVkLXdvcmtmbG93Jyk7XG4gICAgc2F2aW5nLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBzYXZlZC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgfSxcbiAgcnVuV29ya2Zsb3c6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgIHZhciB3a2ZsVHlwZSA9IHRoaXMucGFyZW50LnBhcmVudC50eXBlO1xuICAgIHZhciBvcHRUeXBlID0gZG9jdW1lbnQuVVJMLmVuZHNXaXRoKFwiLm1kbFwiKSA/IFwicm5cIiA6IFwicmVcIjtcbiAgICB2YXIgd29ya2Zsb3cgPSBkb2N1bWVudC5VUkwuZW5kc1dpdGgoXCIubWRsXCIpID8gdGhpcy5wYXJlbnQucGFyZW50LndvcmtmbG93TmFtZSA6IHRoaXMucGFyZW50LnBhcmVudC5kaXJlY3RvcnlcbiAgICB2YXIgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgJy93b3JrZmxvdy9ydW4td29ya2Zsb3cvJywgd2tmbFR5cGUsIG9wdFR5cGUsIG1vZGVsLmRpcmVjdG9yeSwgXCI8LS1HaWxsZXNQeTJXb3JrZmxvdy0tPlwiLCB3b3JrZmxvdyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHhocih7IHVyaTogZW5kcG9pbnQgfSxmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgc2VsZi5wYXJlbnQuY29sbGFwc2VDb250YWluZXIoKTtcbiAgICAgIHNlbGYucGFyZW50LnBhcmVudC51cGRhdGVXb3JrZmxvd1N0YXR1cygpO1xuICAgICAgaWYoZG9jdW1lbnQuVVJMLmVuZHNXaXRoKCcubWRsJykpe1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsZXQgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKTtcbiAgICAgICAgICBwYXRobmFtZS5wb3AoKVxuICAgICAgICAgIHBhdGhuYW1lID0gcGF0aG5hbWUuam9pbignLycpXG4gICAgICAgICAgd29ya2Zsb3dwYXRoID0gcGF0aC5qb2luKHBhdGhuYW1lLCBzZWxmLnBhcmVudC5wYXJlbnQud29ya2Zsb3dOYW1lICsgJy53a2ZsJylcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdvcmtmbG93cGF0aDtcbiAgICAgICAgfSwgMzAwMCk7ICAgICAgICBcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbn0pO1xuIiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvd29ya2Zsb3dTdGF0dXMucHVnJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIGxvY2FsRGF0ZSA9IG5ldyBEYXRlKGF0dHJzLnN0YXJ0VGltZSlcbiAgICB2YXIgbG9jYWxTdGFydFRpbWUgPSB0aGlzLmdldEZvcm1hdHRlZERhdGUobG9jYWxEYXRlKVxuICAgIHRoaXMuc3RhcnRUaW1lID0gbG9jYWxTdGFydFRpbWU7XG4gICAgdGhpcy5zdGF0dXMgPSBhdHRycy5zdGF0dXM7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmKHRoaXMuc3RhdHVzICE9PSAncmVhZHknICYmIHRoaXMuc3RhdHVzICE9PSAnbmV3Jyl7XG4gICAgICB0aGlzLmV4cGFuZENvbnRhaW5lcigpXG4gICAgfVxuICB9LFxuICBleHBhbmRDb250YWluZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3dvcmtmbG93LXN0YXR1cycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgdGhpcy5jaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQoKVxuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG4gIGdldEZvcm1hdHRlZERhdGU6IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgdmFyIG1vbnRocyA9IFsnSmFuLicsICdGZWIuJywgJ01hci4nLCAnQXByLicsICdNYXknLCAnSnVuLicsICdKdWwuJywgJ0F1Zy4nLCAnU2VwdC4nLCAnT2N0LicsICdOb3YuJywgJ0RlYy4nXTtcbiAgICB2YXIgbW9udGggPSBtb250aHNbZGF0ZS5nZXRNb250aCgpXTsgLy8gZ2V0IHRoZSBhYnJpdmlhdGVkIG1vbnRoXG4gICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcbiAgICB2YXIgYW1wbSA9IGhvdXJzID49IDEyID8gJ1BNJyA6ICdBTSc7IC8vIGdldCBBTSBvciBQTSBiYXNlZCBvbiBob3Vyc1xuICAgIGhvdXJzID0gaG91cnMlMTI7IC8vIGZvcm1hdCBob3VycyB0byAxMiBob3VyIHRpbWUgZm9ybWF0XG4gICAgaG91cnMgPSBob3VycyA/IGhvdXJzIDogMTI7IC8vIHJlcGxhY2UgMCB3aXRoIDEyXG4gICAgdmFyIG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcbiAgICBtaW51dGVzID0gbWludXRlcyA8IDEwID8gJzAnICsgbWludXRlcyA6IG1pbnV0ZXM7IC8vIGZvcm1hdCBtaW51dGVzIHRvIGFsd2F5cyBoYXZlIHR3byBjaGFyc1xuICAgIHZhciB0aW1lWm9uZSA9IGRhdGUudG9TdHJpbmcoKS5zcGxpdCgnICcpLnBvcCgpIC8vIGdldCB0aGUgdGltZXpvbmUgZnJvbSB0aGUgZGF0ZVxuICAgIHRpbWVab25lID0gdGltZVpvbmUucmVwbGFjZSgnKCcsICcnKS5yZXBsYWNlKCcpJywgJycpIC8vIHJlbW92ZSB0aGUgJygpJyBmcm9tIHRoZSB0aW1lem9uZVxuICAgIHJldHVybiAgbW9udGggKyBcIiBcIiArIGRheSArIFwiLCBcIiArIHllYXIgKyBcIiAgXCIgKyBob3VycyArIFwiOlwiICsgbWludXRlcyArIFwiIFwiICsgYW1wbSArIFwiIFwiICsgdGltZVpvbmU7XG4gIH0sXG59KTsiXSwic291cmNlUm9vdCI6IiJ9