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
/******/ 		"editor": 0
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
/******/ 	deferredModules.push(["./client/pages/model-editor.js","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/pages/model-editor.js":
/*!**************************************!*\
  !*** ./client/pages/model-editor.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page.js */ "./client/pages/page.js");
var app = __webpack_require__(/*! ../app */ "./client/app.js");
var _ = __webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var PageView = __webpack_require__(/*! ../pages/base */ "./client/pages/base.js");
var MeshEditorView = __webpack_require__(/*! ../views/mesh-editor */ "./client/views/mesh-editor.js");
var SpeciesEditorView = __webpack_require__(/*! ../views/species-editor */ "./client/views/species-editor.js");
var InitialConditionsEditorView = __webpack_require__(/*! ../views/initial-conditions-editor */ "./client/views/initial-conditions-editor.js");
var ParametersEditorView = __webpack_require__(/*! ../views/parameters-editor */ "./client/views/parameters-editor.js");
var ReactionsEditorView = __webpack_require__(/*! ../views/reactions-editor */ "./client/views/reactions-editor.js");
var EventsEditorView = __webpack_require__(/*! ../views/events-editor */ "./client/views/events-editor.js");
var RulesEditorView = __webpack_require__(/*! ../views/rules-editor */ "./client/views/rules-editor.js");
var SBMLComponentView = __webpack_require__(/*! ../views/sbml-component-editor */ "./client/views/sbml-component-editor.js");
var ModelSettingsView = __webpack_require__(/*! ../views/model-settings */ "./client/views/model-settings.js");
var ModelStateButtonsView = __webpack_require__(/*! ../views/model-state-buttons */ "./client/views/model-state-buttons.js");
//models
var Model = __webpack_require__(/*! ../models/model */ "./client/models/model.js");
//templates
var template = __webpack_require__(/*! ../templates/pages/modelEditor.pug */ "./client/templates/pages/modelEditor.pug");



let operationInfoModalHtml = () => {
  let editModelMessage = `
    <p><b>Species</b>: A species refers to a pool of entities that are considered 
      indistinguishable from each other for the purposes of the model and may participate 
      in reactions.</p>
    <p><b>Parameter</b>: A Parameter is used to define a symbol associated with 
      a value; this symbol can then be used in mathematical formulas in a model.</p>
    <p><b>Reaction</b>: A reaction in SBML represents any kind of process that can change 
      the quantity of one or more species in a model.  At least one species is required to 
      add a reaction and at least one parameter is required to add a mass action reaction.</p>
    <p><b>Event</b>: Events describe the time and form of instantaneous, discontinuous state 
      changes in the model.  An Event object defines when the event can occur, the variables 
      that are affected by it, how the variables are affected, and the event’s relationship 
      to other events.  At least one species or parameter is required to add an event.</p>
    <p><b>Rule</b>: Rules provide additional ways to define the values of variables 
      in a model, their relationships, and the dynamical behaviors of those variables.  The 
      rule type Assignment Rule is used to express equations that set the values of variables.  
      The rule type Rate Rule is used to express equations that determine the rates of change 
      of variables.  At least one species or parameter is required to add a rule.</p>
    <p><b>Preview</b>: A preview of the model shows the results of the first five seconds of a 
      single trajectory of the model simulation.  At least one species and one reaction, event, 
      or rule is required to run a preview.</p>
    <p><b>Workflow</b>: A workflow allows you to run a full model with multiple trajectories with 
      settings the will help refine the simulation.  At least one species and one reaction, event, 
      or rule is required to create a new workflow.</p>
  `;

  return `
    <div id="operationInfoModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Model Editor Help </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${editModelMessage} </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  ` 
}

let ModelEditor = PageView.extend({
  template: template,
  events: {
    'click [data-hook=edit-model-help]' : function () {
      let modal = $(operationInfoModalHtml()).modal();
    },
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    var self = this;
    var directory = document.URL.split('/models/edit').pop();
    var modelFile = directory.split('/').pop();
    var name = decodeURI(modelFile.split('.')[0]);
    var isSpatial = modelFile.split('.').pop().startsWith('s');
    this.model = new Model({
      name: name,
      directory: directory,
      is_spatial: isSpatial,
      isPreview: true,
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews();
        if(!self.model.is_spatial){
          self.queryByHook('mesh-editor-container').style.display = "none";
          self.queryByHook('initial-conditions-editor-container').style.display = "none";
        }
        if(!self.model.functionDefinitions.length) {
          self.queryByHook('sbml-component-container').style.display = "none";
        }
      }
    });
    this.model.reactions.on("change", function (reactions) {
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
    this.model.eventsCollection.on("add change remove", function (){
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
    this.model.rules.on("add change remove", function() {
      this.updateSpeciesInUse();
      this.updateParametersInUse();
    }, this);
  },
  update: function () {
  },
  updateValid: function () {
  },
  updateSpeciesInUse: function () {
    var species = this.model.species;
    var reactions = this.model.reactions;
    var events = this.model.eventsCollection;
    var rules = this.model.rules;
    species.forEach(function (specie) { specie.inUse = false; });
    var updateInUseForReaction = function (stoichSpecie) {
      _.where(species.models, { compID: stoichSpecie.specie.compID })
       .forEach(function (specie) {
          specie.inUse = true;
        });
    }
    var updateInUseForOther = function (specie) {
      _.where(species.models, { compID: specie.compID })
       .forEach(function (specie) {
         specie.inUse = true;
       });
    }
    reactions.forEach(function (reaction) {
      reaction.products.forEach(updateInUseForReaction);
      reaction.reactants.forEach(updateInUseForReaction);
    });
    events.forEach(function (event) {
      event.eventAssignments.forEach(function (assignment) {
        updateInUseForOther(assignment.variable)
      });
    });
    rules.forEach(function (rule) {
      updateInUseForOther(rule.variable);
    });
  },
  updateParametersInUse: function () {
    var parameters = this.model.parameters;
    var reactions = this.model.reactions;
    var events = this.model.eventsCollection;
    var rules = this.model.rules;
    parameters.forEach(function (param) { param.inUse = false; });
    var updateInUse = function (param) {
      _.where(parameters.models, { compID: param.compID })
       .forEach(function (param) {
         param.inUse = true;
       });
    }
    reactions.forEach(function (reaction) {
      updateInUse(reaction.rate);
    });
    events.forEach(function (event) {
      event.eventAssignments.forEach(function (assignment) {
        updateInUse(assignment.variable)
      });
    });
    rules.forEach(function (rule) {
      updateInUse(rule.variable);
    });
  },
  renderSubviews: function () {
    var meshEditor = new MeshEditorView({
      model: this.model.meshSettings
    });
    var speciesEditor = new SpeciesEditorView({
      collection: this.model.species
    });
    var initialConditionsEditor = new InitialConditionsEditorView({
      collection: this.model.initialConditions
    });
    var parametersEditor = new ParametersEditorView({
      collection: this.model.parameters
    });
    var reactionsEditor = new ReactionsEditorView({
      collection: this.model.reactions
    });
    this.renderEventsView();
    this.renderRulesView();
    var sbmlComponentView = new SBMLComponentView({
      functionDefinitions: this.model.functionDefinitions,
    });
    var modelSettings = new ModelSettingsView({
      parent: this,
      model: this.model.modelSettings,
    });
    var modelStateButtons = new ModelStateButtonsView({
      model: this.model
    });
    this.registerRenderSubview(meshEditor, 'mesh-editor-container');
    this.registerRenderSubview(speciesEditor, 'species-editor-container');
    this.registerRenderSubview(initialConditionsEditor, 'initial-conditions-editor-container');
    this.registerRenderSubview(parametersEditor, 'parameters-editor-container');
    this.registerRenderSubview(reactionsEditor, 'reactions-editor-container');
    this.registerRenderSubview(sbmlComponentView, 'sbml-component-container');
    this.registerRenderSubview(modelSettings, 'model-settings-container');
    this.registerRenderSubview(modelStateButtons, 'model-state-buttons-container');
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  renderEventsView: function () {
    if(this.eventsEditor){
      this.eventsEditor.remove();
    }
    this.eventsEditor = new EventsEditorView({
      collection: this.model.eventsCollection
    });
    this.registerRenderSubview(this.eventsEditor, 'events-editor-container');
  },
  renderRulesView: function () {
    if(this.rulesEditor){
      this.rulesEditor.remove();
    }
    this.rulesEditor = new RulesEditorView({
      collection: this.model.rules
    });
    this.registerRenderSubview(this.rulesEditor, 'rules-editor-container');
  },
  subviews: {
  },
});

Object(_page_js__WEBPACK_IMPORTED_MODULE_0__["default"])(ModelEditor);


/***/ }),

/***/ "./client/reaction-types.js":
/*!**********************************!*\
  !*** ./client/reaction-types.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  creation: {
    reactants: [],
    products: [ { ratio: 1 } ],
    label: '\\emptyset \\rightarrow A',
  },
  destruction: {
    reactants: [ { ratio: 1 } ],
    products: [],
    label: 'A \\rightarrow \\emptyset'
  },
  change: {
    reactants: [ { ratio: 1 } ],
    products: [ { ratio: 1 } ],
    label: 'A \\rightarrow B'
  },
  dimerization: {
    reactants: [ { ratio: 2 } ],
    products: [ { ratio: 1 } ],
    label: '2A \\rightarrow B'
  },
  merge: {
    reactants: [ { ratio: 1 }, { ratio: 1 } ],
    products: [ { ratio: 1 } ],
    label: 'A + B \\rightarrow C'
  },
  split: {
    reactants: [ { ratio: 1 } ],
    products: [ { ratio: 1 }, { ratio: 1 } ],
    label: 'A \\rightarrow B + C'
  },
  four: {
    reactants: [ { ratio: 1 }, { ratio: 1 } ],
    products: [ { ratio: 1 }, { ratio: 1 } ],
    label: 'A + B \\rightarrow C + D'
  },
  'custom-massaction': {
    reactants: [ { ratio: 1 } ],
    products: [ { ratio: 1 } ],
    label: 'Custom mass action'
  },
  'custom-propensity': {
    reactants: [ { ratio: 1 } ],
    products: [ { ratio: 1 } ],
    label: 'Custom propensity'
  }
}


/***/ }),

/***/ "./client/templates/includes/editAdvancedSpecie.pug":
/*!**********************************************************!*\
  !*** ./client/templates/includes/editAdvancedSpecie.pug ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"specie-name\"\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"specie-mode\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv class=\"switching\"\u003E\u003Cinput" + (" type=\"radio\""+pug.attr("name", this.model.name + "-switch-method", true, true)+" data-hook=\"switching-tol\"") + "\u003E Switching Tolerance\u003C\u002Fdiv\u003E\u003Cdiv class=\"switching\"\u003E\u003Cinput" + (" type=\"radio\""+pug.attr("name", this.model.name + "-switch-method", true, true)+" data-hook=\"switching-min\"") + "\u003E Minimum Value for Switching (number of molecules)\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"switching-tolerance\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"switching-threshold\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editCustomStoichSpecie.pug":
/*!**************************************************************!*\
  !*** ./client/templates/includes/editCustomStoichSpecie.pug ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv\u003E\u003Clabel class=\"select\"\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm\" data-hook=\"increment\"\u003E+\u003C\u002Fbutton\u003E\u003Cspan class=\"custom\" data-hook=\"ratio\"\u003E\u003C\u002Fspan\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm\" data-hook=\"decrement\"\u003E-\u003C\u002Fbutton\u003E\u003Cselect data-hook=\"select-stoich-specie\"\u003E\u003Cspan class=\"message message-below message-error\" data-hook=\"message-container\"\u003E\u003Cp data-hook=\"message-text\"\u003E\u003C\u002Fp\u003E\u003C\u002Fspan\u003E\u003C\u002Fselect\u003E\u003Cbutton class=\"btn btn-outline-secondary custom btn-sm\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editEventAssignment.pug":
/*!***********************************************************!*\
  !*** ./client/templates/includes/editEventAssignment.pug ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"event-assignment-variable\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"event-assignment-Expression\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editFunctionDefinition.pug":
/*!**************************************************************!*\
  !*** ./client/templates/includes/editFunctionDefinition.pug ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = this.model.signature) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Cth\u003E\u003Cdiv" + (" class=\"tooltip-icon-large\""+" data-hook=\"annotation-tooltip\" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.model.annotation || "Click 'Add' to add an annotation", true, true)) + "\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"file-alt\" class=\"svg-inline--fa fa-file-alt fa-w-12\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 384 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm\" data-hook=\"edit-annotation-btn\"\u003EEdit\u003C\u002Fbutton\u003E\u003C\u002Fth\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editInitialCondition.pug":
/*!************************************************************!*\
  !*** ./client/templates/includes/editInitialCondition.pug ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"initial-condition-type\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"initial-condition-species\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"initial-condition-details\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editPlaceDetails.pug":
/*!********************************************************!*\
  !*** ./client/templates/includes/editPlaceDetails.pug ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ECount\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EX\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EY\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EZ\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"count-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"x-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"y-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"z-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editReactionVar.pug":
/*!*******************************************************!*\
  !*** ./client/templates/includes/editReactionVar.pug ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"input-name-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"input-value-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv" + (" class=\"tooltip-icon-large\""+" data-hook=\"annotation-tooltip\" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.model.annotation || "Click 'Add' to add an annotation", true, true)) + "\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"file-alt\" class=\"svg-inline--fa fa-file-alt fa-w-12\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 384 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm box-shadow\" data-hook=\"edit-annotation-btn\"\u003EEdit\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary box-shadow\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editRule.pug":
/*!************************************************!*\
  !*** ./client/templates/includes/editRule.pug ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"rule-name\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"rule-type\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"rule-variable\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"rule-expression\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv" + (" class=\"tooltip-icon-large\""+" data-hook=\"annotation-tooltip\" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.model.annotation || "Click 'Add' to add an annotation", true, true)) + "\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"file-alt\" class=\"svg-inline--fa fa-file-alt fa-w-12\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 384 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm box-shadow\" data-hook=\"edit-annotation-btn\"\u003EEdit\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary box-shadow\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editScatterDetails.pug":
/*!**********************************************************!*\
  !*** ./client/templates/includes/editScatterDetails.pug ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ECount\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ESubdomain\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"count-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"subdomain-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editSpatialSpecie.pug":
/*!*********************************************************!*\
  !*** ./client/templates/includes/editSpatialSpecie.pug ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"input-name-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"input-diffusion-coeff-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv class=\"row\" data-hook=\"subdomains\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editStoichSpecie.pug":
/*!********************************************************!*\
  !*** ./client/templates/includes/editStoichSpecie.pug ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv\u003E\u003Clabel class=\"select\"\u003E\u003Cspan data-hook=\"ratio\"\u003E\u003C\u002Fspan\u003E\u003Cselect data-hook=\"select-stoich-specie\"\u003E\u003Cspan class=\"message message-below message-error\" data-hook=\"message-container\"\u003E\u003Cp data-hook=\"message-text\"\u003E\u003C\u002Fp\u003E\u003C\u002Fspan\u003E\u003C\u002Fselect\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/eventAssignmentsEditor.pug":
/*!**************************************************************!*\
  !*** ./client/templates/includes/eventAssignmentsEditor.pug ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EVariable\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.parent.tooltips.variable, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EExpression\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.parent.tooltips.assignmentExpression, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"event-assignments-container\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cbutton class=\"btn btn-outline-primary box-shadow\" data-hook=\"add-event-assignment\" type=\"button\"\u003EAdd Assignment\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/eventDetails.pug":
/*!****************************************************!*\
  !*** ./client/templates/includes/eventDetails.pug ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv data-hook=\"event-details\"\u003E\u003Cdiv\u003E\u003Cspan for=\"event-trigger-expression\"\u003ETrigger Expression:\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.tooltips.triggerExpression, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fspan\u003E\u003Cdiv class=\"col-md-8 inline\" id=\"event-trigger-expression\" data-hook=\"event-trigger-expression\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch6 class=\"inline\"\u003EAdvanced\u003C\u002Fh6\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#advanced-events\" data-hook=\"advanced-event-button\"\u003E+\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" id=\"advanced-events\"\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-6\"\u003E\u003Cspan for=\"event-trigger-expression\"\u003EDelay:\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.tooltips.delay, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fspan\u003E\u003Cdiv class=\"col-md-9 inline\" id=\"event-delay\" data-hook=\"event-delay\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6\"\u003E\u003Cspan for=\"event-trigger-expression\"\u003EPrioirty:\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.tooltips.priority, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fspan\u003E\u003Cdiv class=\"col-md-8 inline\" data-hook=\"event-priority\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-6 verticle-space\"\u003E\u003Cspan class=\"checkbox\" for=\"initial-value\"\u003EInitial Value:\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.tooltips.initialValue, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fspan\u003E\u003Cinput type=\"checkbox\" id=\"initial-value\" data-hook=\"event-trigger-init-value\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6 verticle-space\"\u003E\u003Cspan class=\"checkbox\" for=\"persistent\"\u003EPersistent:\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.tooltips.persistent, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fspan\u003E\u003Cinput type=\"checkbox\" id=\"persistent\" data-hook=\"event-trigger-persistent\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-12 verticle-space\"\u003E\u003Cspan class=\"checkbox\" for=\"use-values-from-trigger-time\"\u003EUse Values From:\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.tooltips.useValuesFromTriggerTime, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fspan\u003E\u003Cdiv class=\"horizontal-space inline\"\u003E\u003Cinput type=\"radio\" name=\"use-values-from\" data-hook=\"trigger-time\" data-name=\"trigger\"\u003E Trigger Time\u003C\u002Fdiv\u003E\u003Cdiv class=\"horizontal-space inline\"\u003E\u003Cinput type=\"radio\" name=\"use-values-from\" data-hook=\"assignment-time\" data-name=\"assignment\"\u003E Assignment Time\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Ch5 class=\"inline\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAssignments\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.tooltips.assignments, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fh5\u003E\u003Cdiv data-hook=\"event-assignments\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/eventListings.pug":
/*!*****************************************************!*\
  !*** ./client/templates/includes/eventListings.pug ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" data-hook=\"select\" name=\"event-select\"\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"event-name-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv" + (" class=\"tooltip-icon-large\""+" data-hook=\"annotation-tooltip\" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.model.annotation || "Click 'Add' to add an annotation", true, true)) + "\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"file-alt\" class=\"svg-inline--fa fa-file-alt fa-w-12\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 384 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm box-shadow\" data-hook=\"edit-annotation-btn\"\u003EEdit\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary box-shadow\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/eventsEditor.pug":
/*!****************************************************!*\
  !*** ./client/templates/includes/eventsEditor.pug ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"events\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EEvents\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#events-container\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"events-container\" data-hook=\"events\"\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-6 container-part\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EEdit\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"event-listing-container\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6 container-part\" data-hook=\"event-details-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-primary box-shadow\" data-hook=\"add-event\" type=\"button\"\u003EAdd Event\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/initialConditionsEditor.pug":
/*!***************************************************************!*\
  !*** ./client/templates/includes/initialConditionsEditor.pug ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"initial-conditions\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EInitial Conditions\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#initial-condition\" data-hook=\"initial-condition-button\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"initial-condition\" data-hook=\"initial-conditions\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EType\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ESpecies\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EDetails\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"initial-conditions-collection\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cdiv class=\"dropdown\"\u003E\u003Cbutton class=\"btn btn-outline-primary dropdown-toggle\" id=\"addInitialConditionBtn\" data-hook=\"add-initial-condition\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" type=\"button\"\u003EAdd Initial Condition \u003Cspan class=\"caret\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Cul class=\"dropdown-menu\" aria-labelledby=\"addInitialConditionBtn\"\u003E\u003Cli class=\"dropdown-item\" data-hook=\"scatter\"\u003EScatter\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"place\"\u003EPlace\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"distribute-uniformly\"\u003EDistribute Uniformly per Voxel\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/meshEditor.pug":
/*!**************************************************!*\
  !*** ./client/templates/includes/meshEditor.pug ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"mesh-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EMesh Editor\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-mesh\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-mesh\"\u003E\u003Ctable class=\"table\"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"num-subdomains-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/modelSettings.pug":
/*!*****************************************************!*\
  !*** ./client/templates/includes/modelSettings.pug ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"preview-settings\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EPreview Settings\u003C\u002Fh3\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.previewSettings, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-preview-settings\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-preview-settings\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ESimulation Time\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ETime Units\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.timeUnits, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EVolume\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.volume, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"preview-time\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"time-units\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"volume\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/modelStateButtons.pug":
/*!*********************************************************!*\
  !*** ./client/templates/includes/modelStateButtons.pug ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"mdl-edit-btn\"\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"save\"\u003ESave\u003C\u002Fbutton\u003E\u003Cdiv class=\"mdl-edit-btn saving-status\" data-hook=\"saving-mdl\"\u003E\u003Cdiv class=\"spinner-grow\"\u003E\u003C\u002Fdiv\u003E\u003Cspan\u003ESaving...\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-edit-btn saved-status\" data-hook=\"saved-mdl\"\u003E\u003Cspan\u003ESaved\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"run\"\u003ERun Preview\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary box-shadow\" data-hook=\"start-workflow\"\u003ENew Workflow\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/parametersEditor.pug":
/*!********************************************************!*\
  !*** ./client/templates/includes/parametersEditor.pug ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"parameters-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EParameters\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-parameters\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-parameters\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EExpression\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.expression, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ERemove\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.remove, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"parameter-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cbutton class=\"btn btn-outline-primary box-shadow\" data-hook=\"add-parameter\" type=\"button\"\u003EAdd Parameter\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/reactantProduct.pug":
/*!*******************************************************!*\
  !*** ./client/templates/includes/reactantProduct.pug ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv data-hook=\"reaction-details\"\u003E\u003Ch5 data-hook=\"field-title\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003E" + (pug.escape(null == (pug_interp = this.fieldTitle) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv class=\"tooltip-icon\" data-hook=\"field-title-tooltip\" data-html=\"true\" data-toggle=\"tooltip\" title=\"\"\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fh5\u003E\u003Cdiv data-hook=\"reactants-editor\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" data-hook=\"collapse\"\u003E\u003Cdiv class=\"row\" data-hook=\"add-specie-container\"\u003E\u003Cdiv data-hook=\"select-specie\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm\" data-hook=\"add-selected-specie\"\u003Eadd\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/reactionDetails.pug":
/*!*******************************************************!*\
  !*** ./client/templates/includes/reactionDetails.pug ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"row\" data-hook=\"reaction-details\"\u003E\u003Cdiv class=\"reaction-summary\"\u003ESummary: \u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"summary-container\" id=\"reaction-summary\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-12\" data-hook=\"select-reaction-type\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-12 verticle-space\"\u003E\u003Cspan for=\"event-trigger-expression\" data-hook=\"rate-parameter-label\"\u003E\u003C\u002Fspan\u003E\u003Cdiv class=\"tooltip-icon\" data-html=\"true\" data-hook=\"rate-parameter-tooltip\" data-toggle=\"tooltip\" title=\"\"\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\" id=\"select-rate-parameter\" data-hook=\"select-rate-parameter\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-12 collapse\" data-hook=\"subdomains-editor\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6\" data-hook=\"reactants-editor\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6\" data-hook=\"products-editor\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" data-hook=\"conflicting-modes-message\"\u003E\u003Cp class=\"text-warning\"\u003E\u003Cb\u003EWarning\u003C\u002Fb\u003E: This reaction containes Stoich Species with modes of 'Concentration' and 'Population' or 'Hybrid Concentration\u002FPopulation' and will fire stochastically.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/reactionListing.pug":
/*!*******************************************************!*\
  !*** ./client/templates/includes/reactionListing.pug ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" data-hook=\"select\" name=\"reaction-select\"\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"input-name-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"summary\" style=\"width: auto !important\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv" + (" class=\"tooltip-icon-large\""+" data-hook=\"annotation-tooltip\" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.model.annotation || "Click 'Add' to add an annotation", true, true)) + "\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"file-alt\" class=\"svg-inline--fa fa-file-alt fa-w-12\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 384 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm box-shadow\" data-hook=\"edit-annotation-btn\"\u003EEdit\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary box-shadow\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/reactionSubdomain.pug":
/*!*********************************************************!*\
  !*** ./client/templates/includes/reactionSubdomain.pug ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"col-md-4 reaction-subdomain\"\u003E\u003Clabel" + (pug.attr("for", this.model.name, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003Cinput" + (" type=\"checkbox\""+pug.attr("id", this.model.name, true, true)+" data-hook=\"subdomain\"") + "\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/reactionSubdomains.pug":
/*!**********************************************************!*\
  !*** ./client/templates/includes/reactionSubdomains.pug ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"reaction-details-subdomain\"\u003E\u003Clabel\u003ESubdomains the reaction can occur in: \u003C\u002Flabel\u003E\u003Cdiv class=\"row\" data-hook=\"reaction-subdomains\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/reactionsEditor.pug":
/*!*******************************************************!*\
  !*** ./client/templates/includes/reactionsEditor.pug ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"reactions-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EReactions\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.reaction, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-reaction\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fh3\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-reaction\"\u003E\u003Cp\u003EDefine reactions. Select from the given reaction templates, or use the custom types. \nUsing templated reaction types will help eliminate errors. \nFor non-linear reactions, use the custom propensity type. \u003C\u002Fp\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-7 container-part\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EEdit\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ESummary\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"reaction-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-5 container-part\" data-hook=\"reaction-details-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"dropdown\"\u003E\u003Cbutton class=\"btn btn-outline-primary dropdown-toggle box-shadow\" id=\"addReactionBtn\" data-hook=\"add-reaction-full\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" type=\"button\"\u003EAdd Reaction \u003Cspan class=\"caret\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Cul class=\"dropdown-menu\" aria-labelledby=\"addReactionBtn\"\u003E\u003Cli class=\"dropdown-item\" data-hook=\"creation\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"destruction\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"change\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"dimerization\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"merge\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"split\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"four\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-divider\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"custom-massaction\"\u003ECustom mass action\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"custom-propensity\"\u003ECustom propensity\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"dropdown\"\u003E\u003Cbutton class=\"btn btn-outline-primary dropdown-toggle box-shadow\" id=\"addReactionBtn\" data-hook=\"add-reaction-partial\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" type=\"button\"\u003EAdd Reaction \u003Cspan class=\"caret\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Cul class=\"dropdown-menu\" aria-labelledby=\"addReactionBtn\"\u003E\u003Cli class=\"dropdown-item\" data-hook=\"custom-propensity\"\u003ECustom propensity\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/ruleEditor.pug":
/*!**************************************************!*\
  !*** ./client/templates/includes/ruleEditor.pug ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"rules-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ERules\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-rules\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-rules\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EType\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.type, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EVariable\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.variable, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EExpression\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.expression, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"rule-list-container\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cdiv class=\"dropdown\"\u003E\u003Cbutton class=\"btn btn-outline-primary dropdown-toggle box-shadow\" id=\"addRuleBtn\" data-hook=\"add-rule\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" type=\"button\"\u003EAdd Rule \u003Cspan class=\"caret\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Cul class=\"dropdown-menu\" aria-labelledby=\"addRuleBtn\"\u003E\u003Cli class=\"dropdown-item\" data-hook=\"rate-rule\" data-name=\"Rate Rule\"\u003ERate Rule\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"assignment-rule\" data-name=\"Assignment Rule\"\u003EAssignment Rule\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/sbmlComponentEditor.pug":
/*!***********************************************************!*\
  !*** ./client/templates/includes/sbmlComponentEditor.pug ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"sbml-components\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ESBML Components\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-sbml-component\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-sbml-component\"\u003E\u003Cdiv\u003E\u003Ch5 class=\"inline\"\u003EFunction Definitions\u003C\u002Fh5\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-function-definitions\" data-hook=\"collapse-function-definitions\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-function-definitions\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003ESignature\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"function-definition-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/spatialSpeciesEditor.pug":
/*!************************************************************!*\
  !*** ./client/templates/includes/spatialSpeciesEditor.pug ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"species-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ESpecies Editor\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-species\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-species\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EName\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EDiffusion Coefficient\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003EActive in Subdomains\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"specie-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cbutton class=\"btn btn-outline-primary\" data-hook=\"add-species\" type=\"button\"\u003EAdd Species\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/speciesEditor.pug":
/*!*****************************************************!*\
  !*** ./client/templates/includes/speciesEditor.pug ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"species-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ESpecies\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-species\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-species\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EInitial Condition\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.initialValue, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ERemove\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.remove, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"specie-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\" colspan=\"3\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESpecies Mode\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.speciesMode, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"species-mode\" data-hook=\"all-continuous\" data-name=\"continuous\"\u003E Concentration\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"species-mode\" data-hook=\"all-discrete\" data-name=\"discrete\"\u003E Population\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"species-mode\" data-hook=\"advanced\" data-name=\"dynamic\"\u003E Hybrid Concentration\u002FPopulation\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cdiv class=\"collapse\" data-hook=\"advanced-species\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EName\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EMode\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.mode, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\" colspan=\"2\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESwitching Settings (Hybrid Only)\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.switchValue, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"edit-species-mode\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-primary box-shadow\" data-hook=\"add-species\" type=\"button\"\u003EAdd Species\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/subdomain.pug":
/*!*************************************************!*\
  !*** ./client/templates/includes/subdomain.pug ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv style=\"border: false\"\u003E\u003Clabel" + (pug.attr("for", this.model.name, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003Cinput" + (" type=\"checkbox\""+pug.attr("id", this.model.name, true, true)+" data-hook=\"subdomain\"") + "\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/pages/modelEditor.pug":
/*!************************************************!*\
  !*** ./client/templates/pages/modelEditor.pug ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Csection class=\"page\"\u003E\u003Cdiv\u003E\u003Ch2 class=\"inline\"\u003EModel Editor\u003C\u002Fh2\u003E\u003Cbutton class=\"big-tip btn information-btn help\" data-hook=\"edit-model-help\"\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"far\" data-icon=\"question-circle\" class=\"svg-inline--fa fa-question-circle fa-w-16\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 512 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv\u003E\u003Ch5\u003E" + (pug.escape(null == (pug_interp = this.model.name) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"mesh-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"species-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"initial-conditions-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"parameters-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"reactions-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"events-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"rules-editor-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"sbml-component-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"model-settings-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" data-hook=\"model-timeout-message\"\u003E\u003Cp class=\"text-warning\"\u003EThe model took longer than 5 seconds to run and timed out!\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"errors\" data-hook=\"model-run-error-container\"\u003E\u003Cp class=\"text-danger\" data-hook=\"model-run-error-message\"\u003E\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"model-run-container\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"spinner-border\" data-hook=\"plot-loader\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"model-state-buttons-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/views/edit-advanced-specie.js":
/*!**********************************************!*\
  !*** ./client/views/edit-advanced-specie.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editAdvancedSpecie.pug */ "./client/templates/includes/editAdvancedSpecie.pug");

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=switching-tol]' : 'setSwitchingType',
    'change [data-hook=switching-min]' : 'setSwitchingType',
    'change [data-hook=specie-mode]' : 'setSpeciesMode',
  },
  initialize: function () {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var optionDict = {"continuous":"Concentration", "discrete":"Population", "dynamic":"Hybrid Concentration/Population"}
    var modeSelectView = new SelectView({
      label: '',
      name: 'mode',
      required: true,
      idAttributes: 'cid',
      options: ['Concentration','Population','Hybrid Concentration/Population'],
      value: optionDict[this.model.mode],
    });
    this.registerRenderSubview(modeSelectView, "specie-mode")
    if(this.model.isSwitchTol){
      $(this.queryByHook('switching-tol')).prop('checked', true);
    }else{
      $(this.queryByHook('switching-min')).prop('checked', true);
    }
    this.toggleSwitchingSettings();
  },
  update: function () {
  },
  updateValid: function () {
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  setSpeciesMode: function (e) {
    var value = e.target.selectedOptions.item(0).text
    var modeDict = {"Concentration":"continuous","Population":"discrete","Hybrid Concentration/Population":"dynamic"}
    this.model.mode = modeDict[value]
    this.model.collection.trigger('update-species', this.model.compID, this.model, false);
    this.toggleSwitchingSettings();
  },
  setSwitchingType: function (e) {
    this.model.isSwitchTol = $(this.queryByHook('switching-tol')).is(":checked");
    this.toggleSwitchingSettingsInput();
  },
  toggleSwitchingSettingsInput: function () {
    if(this.model.isSwitchTol){
      $(this.queryByHook('switching-threshold')).find('input').prop('disabled', true);
      $(this.queryByHook('switching-tolerance')).find('input').prop('disabled', false);
    }else{
      $(this.queryByHook('switching-tolerance')).find('input').prop('disabled', true);
      $(this.queryByHook('switching-threshold')).find('input').prop('disabled', false);
    }
  },
  toggleSwitchingSettings: function () {
    if(this.model.mode === "dynamic"){
      $(this.queryByHook('switching-tol')).prop('disabled', false);
      $(this.queryByHook('switching-min')).prop('disabled', false);
      this.toggleSwitchingSettingsInput();
    }else{
      $(this.queryByHook('switching-tol')).prop('disabled', true);
      $(this.queryByHook('switching-min')).prop('disabled', true);
      $(this.queryByHook('switching-threshold')).find('input').prop('disabled', true);
      $(this.queryByHook('switching-tolerance')).find('input').prop('disabled', true);
    }
  },
  subviews: {
    inputSwitchTol: {
      hook: 'switching-tolerance',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'switching-tolerance',
          label: '',
          tests: tests.valueTests,
          modelKey: 'switchTol',
          valueType: 'number',
          value: this.model.switchTol,
        });
      },
    },
    inputSwitchMin: {
      hook: 'switching-threshold',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'switching-threshold',
          label: '',
          tests: tests.valueTests,
          modelKey: 'switchMin',
          valueType: 'number',
          value: this.model.switchMin,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/edit-custom-stoich-specie.js":
/*!***************************************************!*\
  !*** ./client/views/edit-custom-stoich-specie.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editCustomStoichSpecie.pug */ "./client/templates/includes/editCustomStoichSpecie.pug");

module.exports = SelectView.extend({
  // SelectView expects a string template, so pre-render it
  template: template(),
  bindings: {
    'model.ratio' : {
      hook: 'ratio'
    }
  },
  events: {
    'change select' : 'selectChangeHandler',
    'click [data-hook=increment]' : 'handleIncrement',
    'click [data-hook=decrement]' : 'handleDecrement',
    'click [data-hook=remove]' : 'deleteSpecie'
  },
  initialize: function (args) {
    var self = this;
    SelectView.prototype.initialize.apply(this, arguments);
    this.value = this.model.specie || null;
    this.isReactants = this.parent.parent.isReactants;
    this.reactionType = this.parent.parent.reactionType;
    this.stoichSpecies = this.parent.parent.collection;
    this.stoichSpecies.on('add', function () {
      self.toggleIncrementButton();
    });
    this.stoichSpecies.on('remove', function () {
      self.toggleIncrementButton();
    });
  },
  render: function () {
    SelectView.prototype.render.apply(this);
    this.toggleIncrementButton();
    this.toggleDecrementButton();
  },
  selectChangeHandler: function (e) {
    var species = this.getSpeciesCollection();
    var reactions = this.getReactionsCollection();
    var specie = species.filter(function (m) {
      return m.name === e.target.selectedOptions.item(0).text;
    })[0];
    this.model.specie = specie;
    this.value = specie;
    reactions.trigger("change");
    this.model.collection.parent.trigger('change-reaction')
  },
  getSpeciesCollection: function () {
    return this.model.collection.parent.collection.parent.species;
  },
  getReactionsCollection: function () {
    return this.model.collection.parent.collection;
  },
  handleIncrement: function () {
    if(this.validateRatioIncrement()){
      this.model.ratio++;
      this.toggleIncrementButton();
      this.parent.parent.toggleAddSpecieButton();
      this.model.collection.parent.trigger('change-reaction')
    }
    this.toggleDecrementButton();
  },
  validateRatioIncrement: function () {
    if(this.stoichSpecies.length < 2 && this.model.ratio < 2)
      return true;
    if(this.reactionType !== 'custom-massaction')
      return true;
    if(!this.isReactants)
      return true;
    return false;
  },
  toggleIncrementButton: function () {
    if(!this.validateRatioIncrement()){
      $(this.queryByHook('increment')).prop('disabled', true);
    }else{
      $(this.queryByHook('increment')).prop('disabled', false);
    }
  },
  toggleDecrementButton: function () {
    if(this.model.ratio <= 1)
      $(this.queryByHook('decrement')).prop('disabled', true);
    else
      $(this.queryByHook('decrement')).prop('disabled', false);
  },
  handleDecrement: function () {
    this.model.ratio--;
    this.model.collection.parent.trigger('change-reaction')
    this.toggleDecrementButton();
    if(this.validateRatioIncrement()){
      this.toggleIncrementButton();
      this.parent.parent.toggleAddSpecieButton();
    }
  },
  deleteSpecie: function () {
    this.model.collection.parent.trigger('change-reaction')
    this.collection.removeStoichSpecie(this.model);
    this.parent.parent.toggleAddSpecieButton();
  },
});

/***/ }),

/***/ "./client/views/edit-event-assignment.js":
/*!***********************************************!*\
  !*** ./client/views/edit-event-assignment.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editEventAssignment.pug */ "./client/templates/includes/editEventAssignment.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=remove]' : 'removeAssignment',
    'change [data-hook=event-assignment-variable]' : 'selectAssignmentVariable',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var options = this.getOptions();
    var variableSelectView = new SelectView({
      label: '',
      name: 'variable',
      required: true,
      idAttributes: 'cid',
      options: options,
      value: this.model.variable.name,
    });
    this.registerRenderSubview(variableSelectView, 'event-assignment-variable');
    var inputField = this.queryByHook('event-assignment-Expression').children[0].children[1];
    $(inputField).attr("placeholder", "---No Expression Entered---");
  },
  update: function () {
  },
  updateValid: function () {
  },
  removeAssignment: function () {
    this.remove();
    this.collection.removeEventAssignment(this.model)
  },
  getOptions: function () {
    var species = this.model.collection.parent.collection.parent.species;
    var parameters = this.model.collection.parent.collection.parent.parameters;
    var speciesNames = species.map(function (specie) { return specie.name });
    var parameterNames = parameters.map(function (parameter) { return parameter.name });
    return speciesNames.concat(parameterNames);
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  selectAssignmentVariable: function (e) {
    var species = this.model.collection.parent.collection.parent.species;
    var parameters = this.model.collection.parent.collection.parent.parameters;
    var val = e.target.selectedOptions.item(0).text;
    var eventVar = species.filter(function (specie) {
      if(specie.name === val) {
        return specie;
      }
    });
    if(!eventVar.length) {
      eventVar = parameters.filter(function (parameter) {
        if(parameter.name === val) {
          return parameter;
        }
      });
    }
    this.model.variable = eventVar[0];
    this.model.collection.parent.collection.trigger('change');
  },
  subviews: {
    inputAssignmentExpression: {
      hook: 'event-assignment-Expression',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'event-assignment-expression',
          label: '',
          tests: '',
          modelKey: 'expression',
          valueType: 'string',
          value: this.model.expression,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/edit-function-definition.js":
/*!**************************************************!*\
  !*** ./client/views/edit-function-definition.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editFunctionDefinition.pug */ "./client/templates/includes/editFunctionDefinition.pug");

let functionDefinitionAnnotationModalHtml = (functionDefinitionName, annotation) => {
  return `
    <div id="functionDefinitionAnnotationModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Annotation for ${functionDefinitionName}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <span for="functionDefinitionAnnotationInput">Annotation: </span>
            <input type="text" id="functionDefinitionAnnotationInput" name="functionDefinitionAnnotationInput" size="30" autofocus value="${annotation}">
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

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=remove]' : 'removeFunctionDefinition',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#functionDefinitionAnnotationModal')) {
      document.querySelector('#functionDefinitionAnnotationModal').remove();
    }
    let modal = $(functionDefinitionAnnotationModalHtml(name, annotation)).modal();
    let okBtn = document.querySelector('#functionDefinitionAnnotationModal .ok-model-btn');
    let input = document.querySelector('#functionDefinitionAnnotationModal #functionDefinitionAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value;
      self.parent.renderEdirFunctionDefinitionView();
      modal.modal('hide');
    });
  },
  removeFunctionDefinition: function () {
    this.model.collection.remove(this.model);
  },
});

/***/ }),

/***/ "./client/views/edit-initial-condition.js":
/*!************************************************!*\
  !*** ./client/views/edit-initial-condition.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
var ScatterDetails = __webpack_require__(/*! ./edit-scatter-details */ "./client/views/edit-scatter-details.js");
var PlaceDetails = __webpack_require__(/*! ./edit-place-details */ "./client/views/edit-place-details.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editInitialCondition.pug */ "./client/templates/includes/editInitialCondition.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=remove]' : 'removeInitialCondition',
    'change [data-hook=initial-condition-type]' : 'selectInitialConditionType',
    'change [data-hook=initial-condition-species]' : 'selectInitialConditionSpecies',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var self = this;
    var options = ['Scatter', 'Place', 'Distribute Uniformly per Voxel'];
    var typeSelectView = new SelectView({
      label: '',
      name: 'type',
      required: true,
      idAttributes: 'cid',
      options: options,
      value: self.model.type,
    });
    var speciesSelectView = new SelectView({
      label: '',
      name: 'specie',
      required: true,
      idAttribute: 'cid',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.model.collection.parent.species,
      // For new reactions (with no rate.name) just use the first parameter in the Parameters collection
      // Else fetch the right Parameter from Parameters based on existing rate
      value: this.model.specie.name ? this.getSpecieFromSpecies(this.model.specie.name) : this.model.collection.parent.species.at(0),
    });
    this.renderDetailsView();
    this.registerRenderSubview(typeSelectView, 'initial-condition-type');
    this.registerRenderSubview(speciesSelectView, 'initial-condition-species');
  },
  update: function () {
  },
  updateValid: function () {
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  renderDetailsView: function () {
    if(this.detailsView) {
      this.detailsView.remove();
    }
    var InitialConditionDetails = this.model.type === 'Place' ? PlaceDetails : ScatterDetails
    this.detailsView = new InitialConditionDetails({
      collection: this.collection,
      model: this.model,
    });
    this.registerRenderSubview(this.detailsView, 'initial-condition-details');
  },
  getSpecieFromSpecies: function (name) {
    var species = this.model.collection.parent.species.filter(function (specie) {
      return specie.name === name;
    })[0];
    return species;
  },
  removeInitialCondition: function () {
    this.collection.removeInitialCondition(this.model);
  },
  selectInitialConditionType: function (e) {
    var currentType = this.model.type;
    var newType = e.target.selectedOptions.item(0).text;
    this.model.type = newType;
    if(currentType === "Place" || newType === "Place"){
      this.renderDetailsView();
    }
  },
  selectInitialConditionSpecies: function (e) {
    var name = e.target.selectedOptions.item(0).text;
    var specie = this.getSpecieFromSpecies(name);
    this.model.specie = specie || this.model.specie;
  },
});

/***/ }),

/***/ "./client/views/edit-parameter.js":
/*!****************************************!*\
  !*** ./client/views/edit-parameter.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editReactionVar.pug */ "./client/templates/includes/editReactionVar.pug");

let parameterAnnotationModalHtml = (parameterName, annotation) => {
  return `
    <div id="parameterAnnotationModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Annotation for ${parameterName}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <span for="parameterAnnotationInput">Annotation: </span>
            <input type="text" id="parameterAnnotationInput" name="parameterAnnotationInput" size="30" autofocus value="${annotation}">
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

module.exports = View.extend({
  template: template,
  bindings: {
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    },
  },
  events: {
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeParameter',
    'change [data-hook=input-name-container]' : 'setParameterName',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add')
    }
  },
  update: function () {
  },
  updateValid: function () {
  },
  removeParameter: function () {
    this.remove();
    this.collection.removeParameter(this.model);
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#parameterAnnotationModal')) {
      document.querySelector('#parameterAnnotationModal').remove();
    }
    let modal = $(parameterAnnotationModalHtml(name, annotation)).modal();
    let okBtn = document.querySelector('#parameterAnnotationModal .ok-model-btn');
    let input = document.querySelector('#parameterAnnotationModal #parameterAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value;
      self.parent.renderEditParameter();
      modal.modal('hide');
    });
  },
  setParameterName: function (e) {
    this.model.name = e.target.value;
    this.model.collection.trigger('update-parameters', this.model.compID, this.model);
    this.model.collection.trigger('remove')
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: '',
          tests: tests.nameTests,
          modelKey: '',
          valueType: 'string',
          value: this.model.name,
        });
      },
    },
    inputValue: {
      hook: 'input-value-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'expression',
          label: '',
          tests: '',
          modelKey: 'expression',
          valueType: 'string',
          value: this.model.expression,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/edit-place-details.js":
/*!********************************************!*\
  !*** ./client/views/edit-place-details.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editPlaceDetails.pug */ "./client/templates/includes/editPlaceDetails.pug");

module.exports = View.extend({
  template: template,
  bindings: {
    'model.count': {
      type: 'value',
      hook: 'count-container',
    },
    'model.x': {
      type: 'value',
      hook: 'x-container',
    },
    'model.y': {
      type: 'value',
      hook: 'y-container',
    },
    'model.z': {
      type: 'value',
      hook: 'z-container',
    },
  },
  events: {
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  update: function () {
  },
  updateValid: function () {
  },
  subviews: {
    inputCount: {
      hook: 'count-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'count',
          label: '',
          tests: tests.valueTests,
          modelKey: 'count',
          valueType: 'number',
          value: this.model.count,
        });
      },
    },
    inputX: {
      hook: 'x-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          requires: true,
          name: 'X',
          label: '',
          tests: tests.valueTests,
          modelKey: 'x',
          valueType: 'number',
          value: this.model.x,
        });
      },
    },
    inputY: {
      hook: 'y-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'Y',
          label: '',
          tests: tests.valueTests,
          modelKey: 'y',
          valueType: 'number',
          value: this.model.y,
        });
      },
    },
    inputZ: {
      hook: 'z-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'Z',
          label: '',
          tests: tests.valueTests,
          modelKey: 'z',
          valueType: 'number',
          value: this.model.y,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/edit-rule.js":
/*!***********************************!*\
  !*** ./client/views/edit-rule.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editRule.pug */ "./client/templates/includes/editRule.pug");

let ruleAnnotationModalHtml = (ruleName, annotation) => {
  return `
    <div id="ruleAnnotationModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Annotation for ${ruleName}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <span for="ruleAnnotationInput">Annotation: </span>
            <input type="text" id="ruleAnnotationInput" name="ruleAnnotationInput" size="30" autofocus value="${annotation}">
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

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=rule-type]' : 'selectRuleType',
    'change [data-hook=rule-variable]' : 'selectRuleVariable',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeRule',
  },
  initiailize: function (attrs, options) {
    View.prototype.initiailize.apply(this, arguments);
  },
  render: function () {
    this.renderWithTemplate();
    var inputField = this.queryByHook('rule-expression').children[0].children[1];
    $(inputField).attr("placeholder", "---No Expression Entered---");
    var varOptions = this.getOptions();
    var typeOptions = ['Rate Rule', 'Assignment Rule']
    var typeSelectView = new SelectView({
      label: '',
      name: 'type',
      required: true,
      idAttributes: 'cid',
      options: typeOptions,
      value: this.model.type,
    });
    var variableSelectView = new SelectView({
      label: '',
      name: 'variable',
      required: true,
      idAttributes: 'cid',
      options: varOptions,
      value: this.model.variable.name,
    });
    this.registerRenderSubview(typeSelectView, "rule-type");
    this.registerRenderSubview(variableSelectView, 'rule-variable');
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add')
    }
  },
  update: function (e) {
  },
  updateValid: function () {
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#ruleAnnotationModal')) {
      document.querySelector('#ruleAnnotationModal').remove();
    }
    let modal = $(ruleAnnotationModalHtml(name, annotation)).modal();
    let okBtn = document.querySelector('#ruleAnnotationModal .ok-model-btn');
    let input = document.querySelector('#ruleAnnotationModal #ruleAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value;
      self.parent.renderRules();
      modal.modal('hide');
    });
  },
  getOptions: function () {
    var species = this.model.collection.parent.species;
    var parameters = this.model.collection.parent.parameters;
    var speciesNames = species.map(function (specie) { return specie.name });
    var parameterNames = parameters.map(function (parameter) { return parameter.name });
    return speciesNames.concat(parameterNames);
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  selectRuleType: function (e) {
    var type = e.target.selectedOptions.item(0).text;
    this.model.type = type;
  },
  selectRuleVariable: function (e) {
    var species = this.model.collection.parent.species;
    var parameters = this.model.collection.parent.parameters;
    var val = e.target.selectedOptions.item(0).text;
    var ruleVar = species.filter(function (specie) {
      if(specie.name === val) {
        return specie;
      }
    });
    if(!ruleVar.length) {
      ruleVar = parameters.filter(function (parameter) {
        if(parameter.name === val) {
          return parameter;
        }
      });
    }
    this.model.variable = ruleVar[0];
  },
  removeRule: function () {
    this.model.collection.removeRule(this.model);
  },
  subviews: {
    inputName: {
      hook: 'rule-name',
      prepareView: function (el) {
        return new InputView ({
          parent: this,
          required: true,
          name: 'rule-name',
          label: '',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name,
        });
      },
    },
    inputRule: {
      hook: 'rule-expression',
      prepareView: function (el) {
        return new InputView ({
          parent: this,
          required: false,
          name: 'rule-expression',
          label: '',
          tests: '',
          modelKey: 'expression',
          valueType: 'string',
          value: this.model.expression,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/edit-scatter-details.js":
/*!**********************************************!*\
  !*** ./client/views/edit-scatter-details.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editScatterDetails.pug */ "./client/templates/includes/editScatterDetails.pug");

module.exports = View.extend({
  template: template,
  bindings: {
    'model.count': {
      type: 'value',
      hook: 'count-container',
    },
  },
  events: {
    'change [data-hook=subdomain-container]' : 'selectInitialConditionSubdomain',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var subdomainSelectView = new SelectView({
      label: '',
      name: 'subdomain',
      required: true,
      idAttribute: 'cid',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.model.collection.parent.meshSettings.uniqueSubdomains,
      value: this.model.subdomain ? this.getSubdomainFromSubdomains(this.model.subdomain) : this.model.collection.parent.meshSettings.uniqueSubdomains.at(0)
    });
    this.registerRenderSubview(subdomainSelectView, 'subdomain-container');
  },
  update: function () {
  },
  updateValid: function () {
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  selectInitialConditionSubdomain: function (e) {
    var name = e.target.selectedOptions.item(0).text;
    var subdomain = this.getSubdomainFromSubdomains(name);
    this.model.subdomain = subdomain.name || this.model.subdomain;
  },
  getSubdomainFromSubdomains: function (name) {
    var subdomain = this.model.collection.parent.meshSettings.uniqueSubdomains.models.filter(function (subdomain) {
      return subdomain.name === name;
    })[0];
    return subdomain;
  },
  subviews: {
    inputCount: {
      hook: 'count-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'count',
          label: '',
          tests: tests.valueTests,
          modelKey: 'count',
          valueType: 'number',
          value: this.model.count,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/edit-spatial-specie.js":
/*!*********************************************!*\
  !*** ./client/views/edit-spatial-specie.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var _ = __webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var SubdomainsView = __webpack_require__(/*! ./subdomain */ "./client/views/subdomain.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editSpatialSpecie.pug */ "./client/templates/includes/editSpatialSpecie.pug");

module.exports = View.extend({
  template: template,
  bindings: {
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    },
  },
  events: {
    'click [data-hook=remove]' : 'removeSpecie',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.baseModel = this.model.collection.parent;
    this.baseModel.on('mesh-update', this.updateDefaultSubdomains, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderSubdomains();
  },
  update: function () {
  },
  updateValid: function () {
  },
  removeSpecie: function () {
    this.remove();
    this.collection.removeSpecie(this.model);
  },
  updateDefaultSubdomains: function () {
    this.model.subdomains = this.baseModel.meshSettings.uniqueSubdomains.map(function (model) {return model.name; });
    this.renderSubdomains();
  },
  renderSubdomains: function () {
    if(this.subdomainsView)
      this.subdomainsView.remove();
    var subdomains = this.baseModel.meshSettings.uniqueSubdomains;
    this.subdomainsView = this.renderCollection(
      subdomains,
      SubdomainsView,
      this.queryByHook('subdomains')
    );
  },
  updateSubdomains: function (element) {
    if(element.name == 'subdomain') {
      var subdomain = element.value.model;
      var checked = element.value.checked;
      if(checked)
        this.model.subdomains = _.union(this.model.subdomains, [subdomain.name]);
      else
        this.model.subdomains = _.difference(this.model.subdomains, [subdomain.name]);
    }
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: '',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name,
        });
      },
    },
    inputValue: {
      hook: 'input-diffusion-coeff-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'diffusion coeff',
          label: '',
          tests: tests.valueTests,
          modelKey: 'diffusionCoeff',
          valueType: 'number',
          value: this.model.diffusionCoeff,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/edit-specie.js":
/*!*************************************!*\
  !*** ./client/views/edit-specie.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editReactionVar.pug */ "./client/templates/includes/editReactionVar.pug");

let speciesAnnotationModalHtml = (speciesName, annotation) => {
  return `
    <div id="speciesAnnotationModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Annotation for ${speciesName}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <span for="speciesAnnotationInput">Annotation: </span>
            <input type="text" id="speciesAnnotationInput" name="speciesAnnotationInput" size="30" autofocus value="${annotation}">
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

module.exports = View.extend({
  template: template,
  bindings: {
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    },
  },
  events: {
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeSpecie',
    'change [data-hook=input-name-container]' : 'setSpeciesName',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add')
    }
  },
  update: function () {
  },
  updateValid: function (e) {
  },
  removeSpecie: function () {
    this.remove();
    this.collection.removeSpecie(this.model);
  },
  setSpeciesName: function (e) {
    this.model.name = e.target.value;
    this.model.collection.trigger('update-species', this.model.compID, this.model, true);
    this.model.collection.trigger('remove');
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#speciesAnnotationModal')) {
      document.querySelector('#speciesAnnotationModal').remove();
    }
    let modal = $(speciesAnnotationModalHtml(name, annotation)).modal();
    let okBtn = document.querySelector('#speciesAnnotationModal .ok-model-btn');
    let input = document.querySelector('#speciesAnnotationModal #speciesAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value;
      self.parent.renderEditSpeciesView();
      modal.modal('hide');
    });
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: '',
          tests: tests.nameTests,
          modelKey: '',
          valueType: 'string',
          value: this.model.name,
        });
      },
    },
    inputValue: {
      hook: 'input-value-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'value',
          label: '',
          tests: tests.valueTests,
          modelKey: 'value',
          valueType: 'number',
          value: this.model.value,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/edit-stoich-specie.js":
/*!********************************************!*\
  !*** ./client/views/edit-stoich-specie.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/editStoichSpecie.pug */ "./client/templates/includes/editStoichSpecie.pug");

module.exports = SelectView.extend({
  // SelectView expects a string template, so pre-render it
  template: template(),
  bindings: {
    'model.ratio' : {
      hook: 'ratio'
    }
  },
  events: {
    'change select' : 'selectChangeHandler'
  },
  initialize: function () {
    SelectView.prototype.initialize.apply(this, arguments);
    this.value = this.model.specie || null;
  },
  render: function() {
    SelectView.prototype.render.apply(this, arguments);
  },
  update: function () {
  },
  selectChangeHandler: function (e) {
    var species = this.getSpeciesCollection();
    var reactions = this.getReactionsCollection();
    var specie = species.filter(function (m) {
      return m.name === e.target.selectedOptions.item(0).text;
    })[0];
    this.model.specie = specie;
    this.value = specie;
    reactions.trigger("change");
    this.model.collection.parent.trigger('change-reaction')
  },
  getReactionsCollection: function () {
    return this.model.collection.parent.collection;
  },
  getSpeciesCollection: function () {
    return this.model.collection.parent.collection.parent.species;
  },
});

/***/ }),

/***/ "./client/views/event-assignments-editor.js":
/*!**************************************************!*\
  !*** ./client/views/event-assignments-editor.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var EditEventAssignment = __webpack_require__(/*! ./edit-event-assignment */ "./client/views/edit-event-assignment.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/eventAssignmentsEditor.pug */ "./client/templates/includes/eventAssignmentsEditor.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-event-assignment]' : 'addAssignment',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(
      this.collection,
      EditEventAssignment,
      this.queryByHook('event-assignments-container')
    );
  },
  update: function () {
  },
  updateValid: function () {
  },
  addAssignment: function () {
    this.collection.addEventAssignment();
  },
})

/***/ }),

/***/ "./client/views/event-details.js":
/*!***************************************!*\
  !*** ./client/views/event-details.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var EventAssignment = __webpack_require__(/*! ./event-assignments-editor */ "./client/views/event-assignments-editor.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/eventDetails.pug */ "./client/templates/includes/eventDetails.pug");

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
  },
  events: {
    'change [data-hook=event-trigger-init-value]' : 'setTriggerInitialValue',
    'change [data-hook=event-trigger-persistent]' : 'setTriggerPersistent',
    'change [data-hook=trigger-time]' : 'setUseValuesFromTriggerTime',
    'change [data-hook=assignment-time]' : 'setUseValuesFromTriggerTime',
    'click [data-hook=advanced-event-button]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderEventAssignments();
    var triggerExpressionField = this.queryByHook('event-trigger-expression').children[0].children[1];
    $(triggerExpressionField).attr("placeholder", "---No Expression Entered---");
    var delayField = this.queryByHook('event-delay').children[0].children[1];
    $(delayField).attr("placeholder", "---No Expression Entered---");
    if(this.model.useValuesFromTriggerTime){
      $(this.queryByHook('trigger-time')).prop('checked', true)
    }else{
      $(this.queryByHook('assignment-time')).prop('checked', true)
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
  renderEventAssignments: function () {
    if(this.eventAssignmentsView){
      this.eventAssignmentsView.remove()
    }
    this.eventAssignmentsView = new EventAssignment({
      collection: this.model.eventAssignments,
    });
    this.registerRenderSubview(this.eventAssignmentsView, 'event-assignments');
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  setTriggerInitialValue: function (e) {
    this.model.initialValue = e.target.checked;
  },
  setTriggerPersistent: function (e) {
    this.model.persistent = e.target.checked;
  },
  setUseValuesFromTriggerTime: function (e) {
    this.model.useValuesFromTriggerTime = e.target.dataset.name === "trigger";
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('advanced-event-button')).text();
    text === '+' ? $(this.queryByHook('advanced-event-button')).text('-') : $(this.queryByHook('advanced-event-button')).text('+');
  },
  subviews: {
    inputDelay: {
      hook: 'event-delay',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: false,
          name: 'delay',
          label: '',
          tests: '',
          modelKey: 'delay',
          valueType: 'string',
          value: this.model.delay,
        });
      },
    },
    inputPriority: {
      hook: 'event-priority',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'priority',
          label: '',
          tests: '',
          modelKey: 'priority',
          valueType: 'string',
          value: this.model.priority,
        });
      },
    },
    inputTriggerExpression: {
      hook: 'event-trigger-expression',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'trigger-expression',
          label: '',
          tests: '',
          modelKey: 'triggerExpression',
          valueType: 'string',
          value: this.model.triggerExpression,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/event-listings.js":
/*!****************************************!*\
  !*** ./client/views/event-listings.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/eventListings.pug */ "./client/templates/includes/eventListings.pug");

let eventAnnotationModalHtml = (eventName, annotation) => {
  return `
    <div id="eventAnnotationModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Annotation for ${eventName}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <span for="eventAnnotationInput">Annotation: </span>
            <input type="text" id="eventAnnotationInput" name="eventAnnotationInput" size="30" autofocus value="${annotation}">
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

module.exports = View.extend({
  template: template,
  bindings: {
    'model.name' : {
      type: 'value',
      hook: 'input-name-container'
    },
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select'
    }
  },
  events: {
    'click [data-hook=select]'  : 'selectEvent',
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=remove]' : 'removeEvent',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add')
    }
  },
  update: function () {
  },
  updateValid: function () {
  },
  selectEvent: function (e) {
    this.model.collection.trigger("select", this.model);
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#eventAnnotationModal')) {
      document.querySelector('#eventAnnotationModal').remove();
    }
    let modal = $(eventAnnotationModalHtml(name, annotation)).modal();
    let okBtn = document.querySelector('#eventAnnotationModal .ok-model-btn');
    let input = document.querySelector('#eventAnnotationModal #eventAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value;
      self.parent.renderEventListingsView();
      modal.modal('hide');
    });
  },
  removeEvent: function () {
    this.remove();
    this.collection.removeEvent(this.model);
  },
  subviews: {
    inputName: {
      hook: 'event-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: '',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/events-editor.js":
/*!***************************************!*\
  !*** ./client/views/events-editor.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ViewSwitcher = __webpack_require__(/*! ampersand-view-switcher */ "./node_modules/ampersand-view-switcher/ampersand-view-switcher.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var EventListings = __webpack_require__(/*! ./event-listings */ "./client/views/event-listings.js");
var EventDetails = __webpack_require__(/*! ./event-details */ "./client/views/event-details.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/eventsEditor.pug */ "./client/templates/includes/eventsEditor.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-event]' : 'addEvent',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = {"name":"Names for species, parameters, reactions, events, and rules must be unique.",
                     "annotation":"An optional note about an event.",
                     "triggerExpression":"The trigger expression can be any mathematical expression "+
                                "which evaluates to a boolean value in a python environment "+
                                "(i.e. t==50).  This expression is evaluable within the model "+
                                "namespace, and any variable (Species, Parameters, etc.) can be "+
                                "referenced in the expression.  Time is represented with the lower "+
                                "case variable 't'. An event will begin execution of assignments "+
                                "(or delay, if any) once this expression changes from 'False' to 'True.'",
                     "delay":"contains math expression evaluable within model namespace. This "+
                                "expression designates a delay between the trigger of an event and "+
                                "the execution of its assignments.",
                     "priority":"Contains a math expression evaluable within model namespace.  This "+
                                "expression designates execution order for events which are executed "+
                                "simultaneously.",
                     "initialValue":"If true, the trigger expression will be evaluated as 'True' at "+
                                "start of simulation.  This can be useful for some models, since an "+
                                "event is only executed when the trigger expression state changes "+
                                "from 'False' to 'True'.",
                     "persistent":"If persistent, an event assignment will always be executed when "+
                                "the event's trigger expression evaluates to true.  If not persistent, "+
                                "the event assignment will not be executed if the trigger expression "+
                                "evaluates to false between the time the event is triggered and the "+
                                "time the assignment is executed.",
                     "useValuesFromTriggerTime":"If set to true, assignment execution will be based "+
                                "off of the model state at trigger time. If false (default), the "+
                                "assignment will be made using values at assignment time.",
                     "assignments":"An Event Assignment describes a change to be performed to the "+
                                "current model simulation.  This assignment can either be fired "+
                                "at the time its associated trigger changes from false to true, or "+
                                "after a specified delay, depending on the Event configuration. An "+
                                "event may contain one or more assignments.",
                     "variable":"The target Species or Parameter to be modified by the event.",
                     "assignmentExpression":"Can be any mathematical statement which resolves to "+
                                "an integer or float value.  This value will be assigned to the "+
                                "assignment's target variable upon event execution."
                    }
    this.collection.on("select", function (event) {
      this.setSelectedEvent(event);
      this.setDetailsView(event);
    }, this);
    this.collection.on("remove", function (event) {
      // Select the last event by default
      // But only if there are other events other than the one we're removing
      if (event.detailsView)
        event.detailsView.remove();
      this.collection.removeEvent(event);
      if (this.collection.length) {
        var selected = this.collection.at(this.collection.length-1);
        this.collection.trigger("select", selected);
      }
    }, this);
    this.collection.parent.species.on('add remove', this.toggleAddEventButton, this);
    this.collection.parent.parameters.on('add remove', this.toggleAddEventButton, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderEventListingsView();
    this.detailsContainer = this.queryByHook('event-details-container');
    this.detailsViewSwitcher = new ViewSwitcher({
      el: this.detailsContainer,
    });
    if (this.collection.length) {
      this.setSelectedEvent(this.collection.at(0));
      this.collection.trigger("select", this.selectedEvent);
    }
    this.toggleAddEventButton()
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderEventListingsView: function () {
    if(this.eventListingsView){
      this.eventListingsView.remove();
    }
    this.eventListingsView = this.renderCollection(
      this.collection,
      EventListings,
      this.queryByHook('event-listing-container')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  toggleAddEventButton: function () {
    this.collection.map(function (event) {
      if(event.detailsView && event.selected){
        event.detailsView.renderEventAssignments();
      }
    })
    var numSpecies = this.collection.parent.species.length;
    var numParameters = this.collection.parent.parameters.length;
    var disabled = numSpecies <= 0 && numParameters <= 0
    $(this.queryByHook('add-event')).prop('disabled', disabled);
  },
  setSelectedEvent: function (event) {
    this.collection.each(function (m) { m.selected = false; });
    event.selected = true;
    this.selectedEvent = event;
  },
  setDetailsView: function (event) {
    event.detailsView = event.detailsView || this.newDetailsView(event);
    this.detailsViewSwitcher.set(event.detailsView);
  },
  addEvent: function () {
    var event = this.collection.addEvent();
    event.detailsView = this.newDetailsView(event);
    this.collection.trigger("select", event);
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  newDetailsView: function (event) {
    var detailsView = new EventDetails({ model: event });
    detailsView.parent = this;
    return detailsView
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
})

/***/ }),

/***/ "./client/views/initial-conditions-editor.js":
/*!***************************************************!*\
  !*** ./client/views/initial-conditions-editor.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var EditInitialCondition = __webpack_require__(/*! ./edit-initial-condition */ "./client/views/edit-initial-condition.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/initialConditionsEditor.pug */ "./client/templates/includes/initialConditionsEditor.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=scatter]' : 'addInitialCondition',
    'click [data-hook=place]' : 'addInitialCondition',
    'click [data-hook=distribute-uniformly]' : 'addInitialCondition',
    'click [data-hook=collapse]' : 'cangeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(
      this.collection,
      EditInitialCondition,
      this.queryByHook('initial-conditions-collection')
    );
  },
  update: function () {
  },
  updateValid: function () {
  },
  addInitialCondition: function (e) {
    var initialConditionType = e.target.textContent;
    this.collection.addInitialCondition(initialConditionType);
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/mesh-editor.js":
/*!*************************************!*\
  !*** ./client/views/mesh-editor.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var app = __webpack_require__(/*! ampersand-app */ "./node_modules/ampersand-app/ampersand-app.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/meshEditor.pug */ "./client/templates/includes/meshEditor.pug");

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=num-subdomains-container]' : 'updateSubdomains',
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  update: function (e) {
  },
  updateValid: function () {
  },
  updateSubdomains: function () {
    this.model.parent.trigger('mesh-update');
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  },
  subviews: {
    inputSubdomains: {
      hook: 'num-subdomains-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'numSubdomains',
          label: 'Number of Subdomains',
          test: tests.valueTests,
          modelKey: 'count',
          valueType: 'number',
          value: this.model.count,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/model-settings.js":
/*!****************************************!*\
  !*** ./client/views/model-settings.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/modelSettings.pug */ "./client/templates/includes/modelSettings.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  bindings: {
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = {"previewSettings":"Preview Settings are applied to the model and are used for the model preview and all workflows.",
                     "previewTime":"End time of simulation.",
                     "timeUnits":"Save point increment for recording data.",
                     "volume":"The volume of the system matters when converting to from population "+
                                 "to concentration form. This will also set a parameter 'vol' for use "+
                                 "in custom (i.e. non-mass-action) propensity functions."
                    }
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  update: function () {
  },
  updateValid: function () {
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  },
  subviews: {
    inputSimEnd: {
      hook: 'preview-time',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'end-sim',
          label: '0 to ',
          tests: tests.valueTests,
          modelKey: 'endSim',
          valueType: 'number',
          value: this.model.endSim
        });
      },
    },
    inputTimeUnit: {
      hook: 'time-units',
      prepareView: function (el) {
        return new InputView ({
          parent: this,
          required: true,
          name: 'time-units',
          label: '',
          tests: tests.valueTests,
          modelKey: 'timeStep',
          valueType: 'number',
          value: this.model.timeStep
        });
      },
    },
    inputVolume: {
      hook: 'volume',
      prepareView: function (el) {
        return new InputView ({
          parent: this,
          required: true,
          name: 'volume',
          label: '',
          tests: tests.valueTests,
          modelKey: 'volume',
          valueType: 'number',
          value: this.model.volume,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/model-state-buttons.js":
/*!*********************************************!*\
  !*** ./client/views/model-state-buttons.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var app = __webpack_require__(/*! ../app */ "./client/app.js");
var xhr = __webpack_require__(/*! xhr */ "./node_modules/xhr/index.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
var Plotly = __webpack_require__(/*! ../lib/plotly */ "./client/lib/plotly.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/modelStateButtons.pug */ "./client/templates/includes/modelStateButtons.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=run]'  : 'clickRunHandler',
    'click [data-hook=start-workflow]' : 'clickStartWorkflowHandler',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.model.species.on('add remove', this.togglePreviewWorkflowBtn, this);
    this.model.reactions.on('add remove', this.togglePreviewWorkflowBtn, this);
    this.model.eventsCollection.on('add remove', this.togglePreviewWorkflowBtn, this);
    this.model.rules.on('add remove', this.togglePreviewWorkflowBtn, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.togglePreviewWorkflowBtn();
  },
  clickSaveHandler: function (e) {
    this.saveModel(this.saved.bind(this));
  },
  clickRunHandler: function (e) {
    $(this.parent.queryByHook('model-run-error-container')).collapse('hide');
    var el = this.parent.queryByHook('model-run-container');
    Plotly.purge(el)
    this.saveModel(this.runModel.bind(this));
  },
  clickStartWorkflowHandler: function (e) {
    window.location.href = path.join(app.getBasePath(), "stochss/workflow/selection", this.model.directory);
  },
  togglePreviewWorkflowBtn: function () {
    var numSpecies = this.model.species.length;
    var numReactions = this.model.reactions.length
    var numEvents = this.model.eventsCollection.length
    var numRules = this.model.rules.length
    $(this.queryByHook('run')).prop('disabled', (!numSpecies || (!numReactions && !numEvents && !numRules)))
    $(this.queryByHook('start-workflow')).prop('disabled', (!numSpecies || (!numReactions && !numEvents && !numRules)))
  },
  saveModel: function (cb) {
    var numEvents = this.model.eventsCollection.length;
    var numRules = this.model.rules.length;
    var defaultMode = this.model.defaultMode;
    if(!numEvents && !numRules && defaultMode === "continuous"){
      this.model.modelSettings.algorithm = "ODE";
    }else if(!numEvents && !numRules && defaultMode === "discrete"){
      this.model.modelSettings.algorithm = "SSA";
    }else{
      this.model.modelSettings.algorithm = "Hybrid-Tau-Leaping";
    }
    this.saving();
    // this.model is a ModelVersion, the parent of the collection is Model
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
    var saving = this.queryByHook('saving-mdl');
    var saved = this.queryByHook('saved-mdl');
    saved.style.display = "none";
    saving.style.display = "inline-block";
  },
  saved: function () {
    var saving = this.queryByHook('saving-mdl');
    var saved = this.queryByHook('saved-mdl');
    saving.style.display = "none";
    saved.style.display = "inline-block";
  },
  runModel: function () {
    this.saved();
    this.running();
    var el = this.parent.queryByHook('model-run-container')
    var model = this.model
    var endpoint = path.join(app.getApiPath(), '/models/run/', 'start', 'none', model.directory);
    var self = this;
    xhr({ uri: endpoint }, function (err, response, body) {
      self.outfile = body.split('->').pop()
      self.getResults(body)
    });
  },
  running: function () {
    var plot = this.parent.queryByHook('model-run-container');
    var spinner = this.parent.queryByHook('plot-loader');
    var errors = this.parent.queryByHook('model-run-error-container');
    plot.style.display = "none";
    spinner.style.display = "block";
    errors.style.display = "none";
  },
  ran: function (noErrors) {
    var plot = this.parent.queryByHook('model-run-container');
    var spinner = this.parent.queryByHook('plot-loader');
    var errors = this.parent.queryByHook('model-run-error-container');
    if(noErrors){
      plot.style.display = "block";
    }else{
      errors.style.display = "block"
    }
    spinner.style.display = "none";
  },
  getResults: function (data) {
    var self = this;
    var model = this.model;
    setTimeout(function () {
      endpoint = path.join(app.getApiPath(), '/models/run/', 'read', self.outfile, model.directory);
      xhr({ uri: endpoint }, function (err, response, body) {
        if(!body.startsWith('running')){
          var data = JSON.parse(body);
          if(data.timeout){
            $(self.parent.queryByHook('model-timeout-message')).collapse('show');
          }
          if(data.results){
            self.plotResults(data.results);
          }else{
            self.ran(false);
            $(self.parent.queryByHook('model-run-error-message')).text(data.errors);
          }
        }else{
          self.getResults(body);
        }
      });
    }, 2000);
  },
  plotResults: function (data) {
    // TODO abstract this into an event probably
    var title = this.model.name + " Model Preview"
    this.ran(true)
    el = this.parent.queryByHook('model-run-container');
    time = data.time
    y_labels = Object.keys(data).filter(function (key) {
      return key !== 'data' && key !== 'time'
    });
    traces = y_labels.map(function (specie) {
      return {
        x: time,
        y: data[specie],
        mode: 'lines',
        name: specie
      }
    });
    layout = { 
      showlegend: true,
      legend: {
        x: 1,
        y: 0.9
      },
      margin: { 
        t: 0 
      } 
    }
    config = {
      responsive: true,
    }
    Plotly.newPlot(el, traces, layout, config);
    window.scrollTo(0, document.body.scrollHeight)
  },
});


/***/ }),

/***/ "./client/views/parameters-editor.js":
/*!*******************************************!*\
  !*** ./client/views/parameters-editor.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var EditParameterView = __webpack_require__(/*! ./edit-parameter */ "./client/views/edit-parameter.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/parametersEditor.pug */ "./client/templates/includes/parametersEditor.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-parameter]' : 'addParameter',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    var self = this;
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = {"name":"Names for species, parameters, reactions, events, and rules must be unique.",
                     "expression":"A parameter value or a mathematical expression calculating the parameter value.",
                     "annotation":"An optional note about a parameter.",
                     "remove":"A parameter may only be removed if it is not used in any reaction, event assignment, or rule."
                    }
    this.collection.on('update-parameters', function (compID, parameter) {
      self.collection.parent.reactions.map(function (reaction) {
        if(reaction.rate && reaction.rate.compID === compID){
          reaction.rate = parameter;
        }
      });
      self.collection.parent.eventsCollection.map(function (event) {
        event.eventAssignments.map(function (assignment) {
          if(assignment.variable.compID === compID) {
            assignment.variable = parameter;
          }
        })
        if(event.selected)
          event.detailsView.renderEventAssignments();
      });
      self.collection.parent.rules.map(function (rule) {
        if(rule.variable.compID === compID) {
          rule.variable = parameter;
        }
      });
      self.parent.renderRulesView();
    });
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderEditParameter();
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderEditParameter: function () {
    if(this.editParameterView){
      this.editParameterView.remove();
    }
    this.editParameterView = this.renderCollection(
      this.collection,
      EditParameterView,
      this.queryByHook('parameter-list')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  addParameter: function () {
    this.collection.addParameter();
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/reactant-product.js":
/*!******************************************!*\
  !*** ./client/views/reactant-product.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//models
var StoichSpecie = __webpack_require__(/*! ../models/stoich-specie */ "./client/models/stoich-specie.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
var EditStoichSpecieView = __webpack_require__(/*! ./edit-stoich-specie */ "./client/views/edit-stoich-specie.js");
var EditCustomStoichSpecieView = __webpack_require__(/*! ./edit-custom-stoich-specie */ "./client/views/edit-custom-stoich-specie.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/reactantProduct.pug */ "./client/templates/includes/reactantProduct.pug");

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=select-specie]' : 'selectSpecie',
    'click [data-hook=add-selected-specie]' : 'addSelectedSpecie'
  },
  initialize: function (args) {
    View.prototype.initialize.apply(this, arguments);
    this.collection = args.collection;
    this.species = args.species;
    this.reactionType = args.reactionType;
    this.isReactants = args.isReactants
    this.unselectedText = 'Pick a species';
    this.fieldTitle = args.fieldTitle;
  },
  render: function () {
    var self = this;
    View.prototype.render.apply(this, arguments);
    var args = {
      viewOptions: {
        name: 'stoich-specie',
        label: '',
        required: true,
        textAttribute: 'name',
        eagerValidate: true,
        // Set idAttribute to name. Models may not be saved yet so id is unreliable (so is cid).
        // Use name since it *should be* unique.
        idAttribute: 'name',
        options: self.species
      }
    };
    var type = self.reactionType;
    var StoichSpeciesView = (type.startsWith('custom')) ? EditCustomStoichSpecieView : EditStoichSpecieView
    self.renderCollection(
        self.collection,
        StoichSpeciesView,
        self.queryByHook('reactants-editor'),
        args
    );
    if(this.reactionType.startsWith('custom')) {
      $(this.queryByHook('collapse')).collapse()
    }
    this.toggleAddSpecieButton();
    if(this.fieldTitle === "Reactants"){
      $(this.queryByHook('field-title-tooltip')).prop('title', this.parent.parent.tooltips.reactant)
    }else{
      $(this.queryByHook('field-title-tooltip')).prop('title', this.parent.parent.tooltips.product)
    }
  },
  selectSpecie: function (e) {
    if(this.unselectedText === e.target.selectedOptions.item(0).text){
      this.hasSelectedSpecie = false;
    }else{
      this.hasSelectedSpecie = true;
      this.specieName = e.target.selectedOptions.item(0).text;
    }
    this.toggleAddSpecieButton();
  },
  addSelectedSpecie: function () {
    var specieName = this.specieName ? this.specieName : 'Pick a species';
    if(this.validateAddSpecie()) {
      this.collection.addStoichSpecie(specieName);
      this.toggleAddSpecieButton();
      this.collection.parent.trigger('change-reaction')
    }
  },
  toggleAddSpecieButton: function () {
    if(!this.validateAddSpecie())
      $(this.queryByHook('add-selected-specie')).prop('disabled', true);
    else
      $(this.queryByHook('add-selected-specie')).prop('disabled', false);
  },
  validateAddSpecie: function () {
    if(this.hasSelectedSpecie){
      if(!this.collection.length)  return true;
      if(this.collection.length < 2 && this.collection.at(0).ratio < 2)
        return true;
      if(this.reactionType !== 'custom-massaction')
        return true;
      if(!this.isReactants)
        return true;
      return false;
    }
    return false;
  },
  subviews: {
    selectSpecies: {
      hook: 'select-specie',
      prepareView: function (el) {
        return new SelectView({
          name: 'stoich-specie',
          label: '',
          required: false,
          textAttribute: 'name',
          eagerValidate: false,
          // Set idAttribute to name. Models may not be saved yet so id is unreliable (so is cid).
          // Use name since it *should be* unique.
          idAttribute: 'name',
          options: this.species,
          unselectedText: this.unselectedText,
        });
      }
    }
  },
});

/***/ }),

/***/ "./client/views/reaction-details.js":
/*!******************************************!*\
  !*** ./client/views/reaction-details.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var katex = __webpack_require__(/*! katex */ "./node_modules/katex/dist/katex.js");
//config
var ReactionTypes = __webpack_require__(/*! ../reaction-types */ "./client/reaction-types.js");
//models
var StoichSpecie = __webpack_require__(/*! ../models/stoich-specie */ "./client/models/stoich-specie.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var SelectView = __webpack_require__(/*! ampersand-select-view */ "./node_modules/ampersand-select-view/ampersand-select-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
var ReactionSubdomainsView = __webpack_require__(/*! ./reaction-subdomains */ "./client/views/reaction-subdomains.js");
var ReactantProductView = __webpack_require__(/*! ./reactant-product */ "./client/views/reactant-product.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/reactionDetails.pug */ "./client/templates/includes/reactionDetails.pug");

module.exports = View.extend({
  template: template,
  bindings: {
    'model.propensity': {
      type: 'value',
      hook: 'select-rate-parameter'
    },
    'model.summary' : {
      type: function (el, value, previousValue) {
        katex.render(this.model.summary, this.queryByHook('summary-container'), {
          displayMode: true,
          output: 'html'
        });
      },
      hook: 'summary-container',
    },
    'model.hasConflict': {
      type: function (el, value, previousValue) {
        this.model.hasConflict ? 
          $(this.queryByHook('conflicting-modes-message')).collapse('show') : 
          $(this.queryByHook('conflicting-modes-message')).collapse('hide')
      },
      hook: 'conflicting-modes-message',
    },
  },
  events: {
    'change [data-hook=select-rate-parameter]' : 'selectRateParam',
    'change [data-hook=select-reaction-type]'  : 'selectReactionType',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    var self = this; 
    this.model.on("change:reaction_type", function (model) {
      self.updateStoichSpeciesForReactionType(model.reactionType);
    });
    this.model.collection.parent.parameters.on('add remove', this.updateReactionTypeOptions, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var options = [];
    if(this.model.collection.parent.parameters.length <= 0){
      options = ["Custom propensity"];
    }
    else{
      options = this.getReactionTypeLabels();
    }
    var self = this;
    var reactionTypeSelectView = new SelectView({
      label: 'Reaction Type:',
      name: 'reaction-type',
      required: true,
      idAttribute: 'cid',
      options: options,
      value: ReactionTypes[self.model.reactionType].label,
    });
    var rateParameterView = new SelectView({
      label: '',
      name: 'rate',
      required: true,
      idAttribute: 'cid',
      textAttribute: 'name',
      eagerValidate: true,
      options: this.model.collection.parent.parameters,
      // For new reactions (with no rate.name) just use the first parameter in the Parameters collection
      // Else fetch the right Parameter from Parameters based on existing rate
      value: this.model.rate.name ? this.getRateFromParameters(this.model.rate.name) : this.model.collection.parent.parameters.at(0),
    });
    var propensityView = new InputView({
      parent: this,
      required: true,
      name: 'rate',
      label: '',
      tests:'',
      modelKey:'propensity',
      valueType: 'string',
      value: this.model.propensity
    });
    var subdomainsView = new ReactionSubdomainsView({
      parent: this,
      isReaction: true,
    })
    var reactantsView = new ReactantProductView({
      collection: this.model.reactants,
      species: this.model.collection.parent.species,
      reactionType: this.model.reactionType,
      fieldTitle: 'Reactants',
      isReactants: true
    });
    var productsView = new ReactantProductView({
      collection: this.model.products,
      species: this.model.collection.parent.species,
      reactionType: this.model.reactionType,
      fieldTitle: 'Products',
      isReactants: false
    });
    this.registerRenderSubview(reactionTypeSelectView, 'select-reaction-type');
    this.renderReactionTypes();
    if(this.model.reactionType === 'custom-propensity'){
      this.registerRenderSubview(propensityView, 'select-rate-parameter')
      var inputField = this.queryByHook('select-rate-parameter').children[0].children[1];
      $(inputField).attr("placeholder", "---No Expression Entered---");
      $(this.queryByHook('rate-parameter-label')).text('Propensity:')
      $(this.queryByHook('rate-parameter-tooltip')).prop('title', this.parent.tooltips.propensity);
    }else{
      this.registerRenderSubview(rateParameterView, 'select-rate-parameter');
      $(this.queryByHook('rate-parameter-label')).text('Rate Parameter:')
      $(this.queryByHook('rate-parameter-tooltip')).prop('title', this.parent.tooltips.rate);
    }
    this.registerRenderSubview(subdomainsView, 'subdomains-editor');
    this.registerRenderSubview(reactantsView, 'reactants-editor');
    this.registerRenderSubview(productsView, 'products-editor');
    this.totalRatio = this.getTotalReactantRatio();
    if(this.parent.collection.parent.is_spatial)
      $(this.queryByHook('subdomains-editor')).collapse();
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
  updateReactionTypeOptions: function () {
    this.render();
  },
  selectRateParam: function (e) {
    if(this.model.reactionType !== 'custom-propensity') {
      var val = e.target.selectedOptions.item(0).text;
      var param = this.getRateFromParameters(val);
      this.model.rate = param || this.model.rate;
      this.model.collection.trigger("change");
    }
  },
  getRateFromParameters: function (name) {
    // Seems like model.rate is not actually part of the Parameters collection
    // Get the Parameter from Parameters that matches model.rate
    // TODO this is some garbagio, get model.rate into Parameters collection...?
    if (!name)  { name = this.model.rate.name } 
    var rate = this.model.collection.parent.parameters.filter(function (param) {
      return param.name === name;
    })[0];
    return rate 
  },
  selectReactionType: function (e) {
    var label = e.target.selectedOptions.item(0).value;
    var type = _.findKey(ReactionTypes, function (o) { return o.label === label; });
    this.model.reactionType = type;
    this.model.summary = label
    this.updateStoichSpeciesForReactionType(type);
    this.model.collection.trigger("change");
    this.model.trigger('change-reaction')
    this.render();
  },
  updateStoichSpeciesForReactionType: function (type) {
    var args = this.parent.getStoichArgsForReactionType(type);
    var newReactants = this.getArrayOfDefaultStoichSpecies(args.reactants);
    var newProducts = this.getArrayOfDefaultStoichSpecies(args.products);
    this.model.reactants.reset(newReactants);
    this.model.products.reset(newProducts);
    if(type !== 'custom-propensity')
      this.model.rate = this.model.collection.getDefaultRate();
  },
  getArrayOfDefaultStoichSpecies: function (arr) {
    return arr.map(function (params) {
      var stoichSpecie = new StoichSpecie(params);
      stoichSpecie.specie = this.parent.getDefaultSpecie();
      return stoichSpecie;
    }, this);
  },
  getReactionTypeLabels: function () {
    return _.map(ReactionTypes, function (val, key) { return val.label; })
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  getTotalReactantRatio: function () {
    return this.model.reactants.length;
  },
  updateSubdomains: function (element) {
    var subdomain = element.value.model;
    var checked = element.value.checked;

    if(checked)
      this.model.subdomains = _.union(this.model.subdomains, [subdomain.name]);
    else
      this.model.subdomains = _.difference(this.model.subdomains, [subdomain.name]);
  },
  renderReactionTypes: function () {
    var options = {
      displayMode: true,
      output: 'html'
    }
    katex.render(ReactionTypes['creation'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['0'], options);
    katex.render(ReactionTypes['destruction'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['1'], options);
    katex.render(ReactionTypes['change'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['2'], options);
    katex.render(ReactionTypes['dimerization'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['3'], options);
    katex.render(ReactionTypes['merge'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['4'], options);
    katex.render(ReactionTypes['split'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['5'], options);
    katex.render(ReactionTypes['four'].label, this.queryByHook('select-reaction-type').firstChild.children[1]['6'], options);
  },
});

/***/ }),

/***/ "./client/views/reaction-listing.js":
/*!******************************************!*\
  !*** ./client/views/reaction-listing.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
var katex = __webpack_require__(/*! katex */ "./node_modules/katex/dist/katex.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var InputView = __webpack_require__(/*! ./input */ "./client/views/input.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/reactionListing.pug */ "./client/templates/includes/reactionListing.pug");

let reactionAnnotationModalHtml = (reactionName, annotation) => {
  return `
    <div id="reactionAnnotationModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Annotation for ${reactionName}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <span for="reactionAnnotationInput">Annotation: </span>
            <input type="text" id="reactionAnnotationInput" name="reactionAnnotationInput" size="30" autofocus value="${annotation}">
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

module.exports = View.extend({
  template: template,
  bindings: {
    'model.name' : {
      type: 'value',
      hook: 'input-name-container'
    },
    'model.summary' : {
      type: function (el, value, previousValue) {
        katex.render(this.model.summary, this.queryByHook('summary'), {
          displayMode: true,
          output: 'html',
          maxSize: 5,
        });
      },
      hook: 'summary',
    },
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select'
    }
  },
  events: {
    'click [data-hook=edit-annotation-btn]' : 'editAnnotation',
    'click [data-hook=select]'  : 'selectReaction',
    'click [data-hook=remove]'  : 'removeReaction'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    if(!this.model.annotation){
      $(this.queryByHook('edit-annotation-btn')).text('Add')
    }
  },
  update: function () {
  },
  updateValid: function () {
  },
  selectReaction: function (e) {
    this.model.collection.trigger("select", this.model);
  },
  removeReaction: function (e) {
    this.collection.removeReaction(this.model);
    this.parent.collection.trigger("change");
  },
  editAnnotation: function () {
    var self = this;
    var name = this.model.name;
    var annotation = this.model.annotation;
    if(document.querySelector('#reactionAnnotationModal')) {
      document.querySelector('#reactionAnnotationModal').remove();
    }
    let modal = $(reactionAnnotationModalHtml(name, annotation)).modal();
    let okBtn = document.querySelector('#reactionAnnotationModal .ok-model-btn');
    let input = document.querySelector('#reactionAnnotationModal #reactionAnnotationInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      self.model.annotation = input.value;
      self.parent.renderReactionListingView();
      modal.modal('hide');
    });
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: '',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name,
        });
      },
    },
  },
});

/***/ }),

/***/ "./client/views/reaction-subdomains.js":
/*!*********************************************!*\
  !*** ./client/views/reaction-subdomains.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var SubdomainsView = __webpack_require__(/*! ./subdomain */ "./client/views/subdomain.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/reactionSubdomains.pug */ "./client/templates/includes/reactionSubdomains.pug");

module.exports = View.extend({
  template: template,
  initialize: function (args) {
    View.prototype.initialize.apply(this, arguments);
    this.isReaction = args.isReaction;
    this.baseModel = this.parent.parent.collection.parent;
    this.baseModel.on('mesh-update', this.updateDefaultSubdomains, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderSubdomains();
  },
  updateDefaultSubdomains: function () {
    this.parent.model.subdomains = this.baseModel.meshSettings.uniqueSubdomains.map(function (model) {return model.name; });
    this.renderSubdomains();
  },
  renderSubdomains: function () {
    this.baseModel = this.parent.model.collection.parent;
    if(this.subdomainsView)
      this.subdomainsView.remove();
    var subdomains = this.baseModel.meshSettings.uniqueSubdomains;
    this.subdomainsView = this.renderCollection(
      subdomains,
      SubdomainsView,
      this.queryByHook('reaction-subdomains')
    );
  },
  updateSubdomains: function (element) {
    this.parent.updateSubdomains(element);
  },
});

/***/ }),

/***/ "./client/views/reactions-editor.js":
/*!******************************************!*\
  !*** ./client/views/reactions-editor.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ViewSwitcher = __webpack_require__(/*! ampersand-view-switcher */ "./node_modules/ampersand-view-switcher/ampersand-view-switcher.js");
var katex = __webpack_require__(/*! katex */ "./node_modules/katex/dist/katex.js");
var _ = __webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//config
var ReactionTypes = __webpack_require__(/*! ../reaction-types */ "./client/reaction-types.js");
//models
var StoichSpeciesCollection = __webpack_require__(/*! ../models/stoich-species */ "./client/models/stoich-species.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var ReactionListingView = __webpack_require__(/*! ./reaction-listing */ "./client/views/reaction-listing.js");
var ReactionDetailsView = __webpack_require__(/*! ./reaction-details */ "./client/views/reaction-details.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/reactionsEditor.pug */ "./client/templates/includes/reactionsEditor.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=creation]'               : 'handleAddReactionClick',
    'click [data-hook=destruction]'            : 'handleAddReactionClick',
    'click [data-hook=change]'                 : 'handleAddReactionClick',
    'click [data-hook=dimerization]'           : 'handleAddReactionClick',
    'click [data-hook=merge]'                  : 'handleAddReactionClick',
    'click [data-hook=split]'                  : 'handleAddReactionClick',
    'click [data-hook=four]'                   : 'handleAddReactionClick',
    'click [data-hook=custom-massaction]'      : 'handleAddReactionClick',
    'click [data-hook=custom-propensity]'      : 'handleAddReactionClick',
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = {"name":"Names for species, parameters, reactions, events, and rules must be unique.",
                     "annotation":"An optional note about the reaction.",
                     "rate":"The rate of the mass-action reaction.",
                     "propensity":"The custom propensity expression for the reaction.",
                     "reactant":"The reactants that are consumed in the reaction, with stoichiometry.",
                     "product":"The species that are created by the reaction event, with stoichiometry.",
                     "reaction":"For a species that is NOT consumed in the reaction but is part of a mass" +
                                "action reaction, add it as both a reactant and a product.\n" +
                                "Mass-action reactions must also have a rate term added. Note that the input" +
                                "rate represents the mass-action constant rate independent of volume."
                    }
    this.collection.on("select", function (reaction) {
      this.setSelectedReaction(reaction);
      this.setDetailsView(reaction);
    }, this);
    this.collection.on("remove", function (reaction) {
      // Select the last reaction by default
      // But only if there are other reactions other than the one we're removing
      if (reaction.detailsView)
        reaction.detailsView.remove();
      this.collection.removeReaction(reaction);
      if (this.collection.length) {
        var selected = this.collection.at(this.collection.length-1);
        this.collection.trigger("select", selected);
      }
    }, this);
    this.collection.parent.species.on('add remove', this.toggleAddReactionButton, this);
    this.collection.parent.parameters.on('add remove', this.toggleReactionTypes, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderReactionListingView();
    this.detailsContainer = this.queryByHook('reaction-details-container');
    this.detailsViewSwitcher = new ViewSwitcher({
      el: this.detailsContainer,
    });
    if (this.collection.length) {
      this.setSelectedReaction(this.collection.at(0));
      this.collection.trigger("select", this.selectedReaction);
    }
    this.collection.trigger("change");
    this.toggleAddReactionButton();
    if(this.collection.parent.parameters.length > 0){
       $(this.queryByHook('add-reaction-partial')).prop('hidden', true);
    }
    else{
      $(this.queryByHook('add-reaction-full')).prop('hidden', true);
    }
    this.renderReactionTypes();
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderReactionListingView: function () {
    if(this.reactionListingView){
      this.reactionListingView.remove();
    }
    this.reactionListingView = this.renderCollection(
      this.collection,
      ReactionListingView,
      this.queryByHook('reaction-list')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  toggleAddReactionButton: function () {
    $(this.queryByHook('add-reaction-full')).prop('disabled', (this.collection.parent.species.length <= 0));
    $(this.queryByHook('add-reaction-partial')).prop('disabled', (this.collection.parent.species.length <= 0));
  },
  toggleReactionTypes: function (e, prev, curr) {
    if(curr && curr.add && this.collection.parent.parameters.length === 1){
      $(this.queryByHook('add-reaction-full')).prop('hidden', false);
      $(this.queryByHook('add-reaction-partial')).prop('hidden', true);
    }else if(curr && !curr.add && this.collection.parent.parameters.length === 0){
      $(this.queryByHook('add-reaction-full')).prop('hidden', true);
      $(this.queryByHook('add-reaction-partial')).prop('hidden', false);
    }
  },
  setSelectedReaction: function (reaction) {
    this.collection.each(function (m) { m.selected = false; });
    reaction.selected = true;
    this.selectedReaction = reaction;
  },
  setDetailsView: function (reaction) {
    reaction.detailsView = reaction.detailsView || this.newDetailsView(reaction);
    this.detailsViewSwitcher.set(reaction.detailsView);
  },
  handleAddReactionClick: function (e) {
    var reactionType = e.delegateTarget.dataset.hook;
    var stoichArgs = this.getStoichArgsForReactionType(reactionType);
    var subdomains = this.parent.model.meshSettings.uniqueSubdomains.map(function (model) {return model.name})
    var reaction = this.collection.addReaction(reactionType, stoichArgs, subdomains);
    reaction.detailsView = this.newDetailsView(reaction);
    this.collection.trigger("select", reaction);
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  getStoichArgsForReactionType: function(type) {
    var args = ReactionTypes[type];
    return args;
  },
  newDetailsView: function (reaction) {
    var detailsView = new ReactionDetailsView({ model: reaction });
    detailsView.parent = this;
    return detailsView
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  },
  getDefaultSpecie: function () {
    var value = this.collection.parent.species.models[0];
    return value;
  },
  getAnnotation: function (type) {
    return ReactionTypes[type].label
  },
  renderReactionTypes: function () {
    var options = {
      displayMode: false,
      output: 'html',
    }
    katex.render(ReactionTypes['creation'].label, this.queryByHook('creation'), options);
    katex.render(ReactionTypes['destruction'].label, this.queryByHook('destruction'), options);
    katex.render(ReactionTypes['change'].label, this.queryByHook('change'), options);
    katex.render(ReactionTypes['dimerization'].label, this.queryByHook('dimerization'), options);
    katex.render(ReactionTypes['merge'].label, this.queryByHook('merge'), options);
    katex.render(ReactionTypes['split'].label, this.queryByHook('split'), options);
    katex.render(ReactionTypes['four'].label, this.queryByHook('four'), options);
  }
});

/***/ }),

/***/ "./client/views/rules-editor.js":
/*!**************************************!*\
  !*** ./client/views/rules-editor.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var RuleView = __webpack_require__(/*! ./edit-rule */ "./client/views/edit-rule.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/ruleEditor.pug */ "./client/templates/includes/ruleEditor.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=rate-rule]' : 'addRule',
    'click [data-hook=assignment-rule]' : 'addRule',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (args) {
    View.prototype.initialize.apply(this, arguments);
    this.collection.parent.species.on('add remove', this.toggleAddRuleButton, this);
    this.collection.parent.parameters.on('add remove', this.toggleAddRuleButton, this);
    this.tooltips = {"name":"Names for species, parameters, reactions, events, and rules must be unique.",
                     "type":"Assignment Rules: An assignment rule describes a change to a Species or "+
                            "Parameter as a function whose left-hand side is a scalar (i.e. x = f(V), "+
                            "where V is a vector of symbols, not including x).<br>  Rate Rules: A rate "+
                            "rule describes a change to a Species or Parameter as a function whose "+
                            "left-hand side is a rate of change (i.e. dx/dt = f(W), where W is a vector "+
                            "of symbols which may include x).",
                     "variable":"Target variable to be modified by the Rule's formula.",
                     "expression":"A Python evaluable mathematical expression representing the "+
                            "right hand side of a rule function.<br>  For Assignment Rules, this "+
                            "represents the right hand side of a scalar equation.<br>  For Rate Rules, "+
                            "this represents the right hand side of a rate-of-change equation.",
                     "annotation":"An optional note about a rule."
                    }
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderRules();
    this.toggleAddRuleButton()
  },
  update: function () {
  },
  updateValid: function () {
  },
  renderRules: function () {
    if(this.rulesView) {
      this.rulesView.remove();
    }
    this.rulesView = this.renderCollection(
      this.collection,
      RuleView,
      this.queryByHook('rule-list-container')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  toggleAddRuleButton: function () {
    this.renderRules();
    var numSpecies = this.collection.parent.species.length;
    var numParameters = this.collection.parent.parameters.length;
    var disabled = numSpecies <= 0 && numParameters <= 0
    $(this.queryByHook('add-rule')).prop('disabled', disabled);
  },
  addRule: function (e) {
    var type = e.target.dataset.name
    this.collection.addRule(type);
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/sbml-component-editor.js":
/*!***********************************************!*\
  !*** ./client/views/sbml-component-editor.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var EditFunctionDefinition = __webpack_require__(/*! ./edit-function-definition */ "./client/views/edit-function-definition.js");
//templates
var template = __webpack_require__(/*! ../templates/includes/sbmlComponentEditor.pug */ "./client/templates/includes/sbmlComponentEditor.pug");

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : function () {
      this.changeCollapseButtonText('collapse');
    },
    'click [data-hook=collapse-function-definitions]' : function () {
      this.changeCollapseButtonText('collapse-function-definitions');
    },
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = {"annotation":"An optional note about the Function Definition."}
    this.functionDefinitions = attrs.functionDefinitions;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderEdirFunctionDefinitionView();
  },
  renderEdirFunctionDefinitionView: function () {
    if(this.editFunctionDefinitionView){
      this.editFunctionDefinitionView.remove();
    }
    this.editFunctionDefinitionView = this.renderCollection(
      this.functionDefinitions,
      EditFunctionDefinition,
      this.queryByHook('function-definition-list')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  changeCollapseButtonText: function (hook) {
    var text = $(this.queryByHook(hook)).text();
    text === '+' ? $(this.queryByHook(hook)).text('-') : $(this.queryByHook(hook)).text('+');
  },
});

/***/ }),

/***/ "./client/views/species-editor.js":
/*!****************************************!*\
  !*** ./client/views/species-editor.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
var EditNonspatialSpecieView = __webpack_require__(/*! ./edit-specie */ "./client/views/edit-specie.js");
var EditSpatialSpecieView = __webpack_require__(/*! ./edit-spatial-specie */ "./client/views/edit-spatial-specie.js");
var EditAdvancedSpecie = __webpack_require__(/*! ./edit-advanced-specie */ "./client/views/edit-advanced-specie.js");
//templates
var nonspatialSpecieTemplate = __webpack_require__(/*! ../templates/includes/speciesEditor.pug */ "./client/templates/includes/speciesEditor.pug");
var spatialSpecieTemplate = __webpack_require__(/*! ../templates/includes/spatialSpeciesEditor.pug */ "./client/templates/includes/spatialSpeciesEditor.pug");

let renderDefaultModeModalHtml = () => {
  let concentrationDesciption = `Species will only be represented deterministically.`;
  let populationDescription = `Species will only be represented stochastically.`;
  let hybridDescription = `Allows a species to be represented deterministically and/or stochastically.  
                            This allow you to customize the mode of individual species and set the switching 
                            tolerance or minimum value for switching."`;

  return `
    <div id="defaultModeModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title">Default Species Mode (required)</h5>
            <button type="button" class="close close-modal" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <p>
                The default mode is used to set the mode of all species added to the model.  
                The mode of a species is used to determine how it will be represented in a Hybrid simulation.
              </p>
              <p>Select one of the following: </p>
            </div>
            <div class="default-mode">
              <button type="button" class="btn btn-primary concentration-btn box-shadow">Concentration</button>
              <p style="margin-top: 5px;">${concentrationDesciption}</p>
            </div>
            <div class="default-mode">
              <button type="button" class="btn btn-primary population-btn box-shadow">Population</button>
              <p style="margin-top: 5px;">${populationDescription}</p>
            </div>
            <div class="default-mode">
              <button type="button" class="btn btn-primary hybrid-btn box-shadow">Hybrid Concentration/Population</button>
              <p style="margin-top: 5px;">${hybridDescription}</p>
            </div>
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
  `
}

module.exports = View.extend({
  events: {
    'change [data-hook=all-continuous]' : 'getDefaultSpeciesMode',
    'change [data-hook=all-discrete]' : 'getDefaultSpeciesMode',
    'change [data-hook=advanced]' : 'getDefaultSpeciesMode',
    'click [data-hook=add-species]' : 'handleAddSpeciesClick',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    var self = this;
    View.prototype.initialize.apply(this, arguments);
    this.baseModel = this.collection.parent;
    this.tooltips = {"name":"Names for species, parameters, reactions, events, and rules must be unique.",
                     "initialValue":"Initial population of a species.",
                     "annotation":"An optional note about the species.",
                     "remove":"A species may only be removed if it is not a part of any reaction, event assignment, or rule.",
                     "speciesMode":"Concentration - Species will only be represented as deterministic.<br>" + 
                            "Population - Species will only be represented as stochastic.<br>" + 
                            "Hybrid Concentration/Population - Allows a species to be represented " + 
                            "as either deterministic or stochastic. This allow you to customize the "+
                            "mode of individual species and set the switching tolerance or minimum "+
                            "value for switching.",
                     "mode":"Concentration - Species will only be represented as deterministic.<br>" + 
                            "Population - Species will only be represented as stochastic.<br>" + 
                            "Hybrid Concentration/Population - Allows a species to be represented " + 
                            "deterministically and/or stochastically.",
                     "switchValue":"Switching Tolerance - Tolerance level for considering a dynamic species "+
                            "deterministically, value is compared to an estimated sd/mean population of a "+
                            "species after a given time step. This value will be used if a switch_min is not "+
                            "provided.<br>Minimum Value For Switching - Minimum population value at which "+
                            "species will be represented as Concentration."
                    }
    this.collection.on('update-species', function (compID, specie, isNameUpdate) {
      self.collection.parent.reactions.map(function (reaction) {
        reaction.reactants.map(function (reactant) {
          if(reactant.specie.compID === compID) {
            reactant.specie = specie;
          }
        });
        reaction.products.map(function (product) {
          if(product.specie.compID === compID) {
            product.specie = specie;
          }
        });
        if(isNameUpdate) {
          reaction.buildSummary();
        }else{
          reaction.checkModes();
        }
      });
      self.collection.parent.eventsCollection.map(function (event) {
        event.eventAssignments.map(function (assignment) {
          if(assignment.variable.compID === compID) {
            assignment.variable = specie;
          }
        })
        if(isNameUpdate && event.selected) {
          event.detailsView.renderEventAssignments();
        }
      });
      self.collection.parent.rules.map(function (rule) {
        if(rule.variable.compID === compID) {
          rule.variable = specie;
        }
      });
      if(isNameUpdate) {
        self.renderSpeciesAdvancedView();
        self.parent.renderRulesView();
      }
    });
  },
  render: function () {
    this.template = this.parent.model.is_spatial ? spatialSpecieTemplate : nonspatialSpecieTemplate;
    View.prototype.render.apply(this, arguments);
    var defaultMode = this.collection.parent.defaultMode;
    if(defaultMode === ""){
      this.getInitialDefaultSpeciesMode();
    }else{
      var dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced'}
      $(this.queryByHook(dataHooks[this.collection.parent.defaultMode])).prop('checked', true)
      if(defaultMode === "dynamic"){
        $(this.queryByHook('advanced-species')).collapse('show');
      }
    }
    this.renderEditSpeciesView();
    this.renderSpeciesAdvancedView();
  },
  update: function () {
  },
  updateValid: function (e) {
  },
  getInitialDefaultSpeciesMode: function () {
    var self = this;
    if(document.querySelector('#defaultModeModal')) {
      document.querySelector('#defaultModeModal').remove()
    }
    let modal = $(renderDefaultModeModalHtml()).modal();
    let continuous = document.querySelector('#defaultModeModal .concentration-btn');
    let discrete = document.querySelector('#defaultModeModal .population-btn');
    let dynamic = document.querySelector('#defaultModeModal .hybrid-btn');
    continuous.addEventListener('click', function (e) {
      self.setInitialDefaultMode(modal, "continuous");
    });
    discrete.addEventListener('click', function (e) {
      self.setInitialDefaultMode(modal, "discrete");
    });
    dynamic.addEventListener('click', function (e) {
      self.setInitialDefaultMode(modal, "dynamic");
    });
  },
  setInitialDefaultMode: function (modal, mode) {
    var dataHooks = {'continuous':'all-continuous', 'discrete':'all-discrete', 'dynamic':'advanced'}
    modal.modal('hide')
    $(this.queryByHook(dataHooks[mode])).prop('checked', true)
    this.setAllSpeciesModes(mode)
  },
  getDefaultSpeciesMode: function (e) {
    var self = this;
    this.setAllSpeciesModes(e.target.dataset.name, function () {
      self.collection.trigger('update-species', specie.compID, specie, false)
    });
  },
  setAllSpeciesModes: function (defaultMode) {
    this.collection.parent.defaultMode = defaultMode;
    this.collection.map(function (specie) { 
      specie.mode = defaultMode
    });
    if(defaultMode === "dynamic"){
      this.renderSpeciesAdvancedView()
      $(this.queryByHook('advanced-species')).collapse('show');
    }
    else{
      $(this.queryByHook('advanced-species')).collapse('hide');
    }
  },
  renderEditSpeciesView: function () {
    if(this.editSpeciesView){
      this.editSpeciesView.remove();
    }
    var editSpecieView = !this.collection.parent.is_spatial ? EditNonspatialSpecieView : EditSpatialSpecieView;
    this.editSpeciesView = this.renderCollection(
      this.collection,
      editSpecieView,
      this.queryByHook('specie-list')
    );
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  renderSpeciesAdvancedView: function () {
    if(this.speciesAdvancedView) {
      this.speciesAdvancedView.remove()
    }
    this.speciesAdvancedView = this.renderCollection(this.collection, EditAdvancedSpecie, this.queryByHook('edit-species-mode'));
  },
  handleAddSpeciesClick: function (e) {
    var self = this;
    var defaultMode = this.collection.parent.defaultMode;
    if(defaultMode === ""){
      this.getInitialDefaultSpeciesMode();
    }else{
      this.addSpecies();
    }
  },
  addSpecies: function () {
    var subdomains = this.baseModel.meshSettings.uniqueSubdomains.map(function (model) {return model.name; });
    this.collection.addSpecie(subdomains);
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
          $('[data-toggle="tooltip"]').tooltip("hide");

       });
    });
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});

/***/ }),

/***/ "./client/views/subdomain.js":
/*!***********************************!*\
  !*** ./client/views/subdomain.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js");
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//views
var View = __webpack_require__(/*! ampersand-view */ "./node_modules/ampersand-view/ampersand-view.js");
//templates
var specieSubdomainTemplate = __webpack_require__(/*! ../templates/includes/subdomain.pug */ "./client/templates/includes/subdomain.pug");
var reactionSubdomainTemplate = __webpack_require__(/*! ../templates/includes/reactionSubdomain.pug */ "./client/templates/includes/reactionSubdomain.pug");

module.exports = View.extend({
  template: specieSubdomainTemplate,
  events: {
    'change [data-hook=subdomains]' : 'updateSubdomain',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    if(!this.parent.isReaction)
      var checked = _.contains(this.parent.model.subdomains, this.model.name);
    else{
      this.template = reactionSubdomainTemplate;
      var checked = _.contains(this.parent.parent.model.subdomains, this.model.name);
    }
    View.prototype.render.apply(this, arguments);
    $(this.queryByHook('subdomain')).prop('checked', checked);
  },
  updateSubdomain: function (e) {
    this.parent.updateSubdomains({name: 'subdomain', value: {model: this.model, checked: e.target.checked}})
  },
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL21vZGVsLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvcmVhY3Rpb24tdHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0QWR2YW5jZWRTcGVjaWUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdEN1c3RvbVN0b2ljaFNwZWNpZS5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0RXZlbnRBc3NpZ25tZW50LnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRGdW5jdGlvbkRlZmluaXRpb24ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdEluaXRpYWxDb25kaXRpb24ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFBsYWNlRGV0YWlscy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0UmVhY3Rpb25WYXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFJ1bGUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFNjYXR0ZXJEZXRhaWxzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRTcGF0aWFsU3BlY2llLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRTdG9pY2hTcGVjaWUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRBc3NpZ25tZW50c0VkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudERldGFpbHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRMaXN0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudHNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvaW5pdGlhbENvbmRpdGlvbnNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvbWVzaEVkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFNldHRpbmdzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL21vZGVsU3RhdGVCdXR0b25zLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3RhbnRQcm9kdWN0LnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uRGV0YWlscy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9yZWFjdGlvbkxpc3RpbmcucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25TdWJkb21haW4ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25TdWJkb21haW5zLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uc0VkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ydWxlRWRpdG9yLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3NibWxDb21wb25lbnRFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BhdGlhbFNwZWNpZXNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BlY2llc0VkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9zdWJkb21haW4ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvcGFnZXMvbW9kZWxFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LWFkdmFuY2VkLXNwZWNpZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZWRpdC1jdXN0b20tc3RvaWNoLXNwZWNpZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZWRpdC1ldmVudC1hc3NpZ25tZW50LmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LWZ1bmN0aW9uLWRlZmluaXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtaW5pdGlhbC1jb25kaXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtcGFyYW1ldGVyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LXBsYWNlLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtcnVsZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZWRpdC1zY2F0dGVyLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtc3BhdGlhbC1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtc3BlY2llLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LXN0b2ljaC1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50LWFzc2lnbm1lbnRzLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZXZlbnQtZGV0YWlscy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZXZlbnQtbGlzdGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50cy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2luaXRpYWwtY29uZGl0aW9ucy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL21lc2gtZWRpdG9yLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9tb2RlbC1zZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvbW9kZWwtc3RhdGUtYnV0dG9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvcGFyYW1ldGVycy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0YW50LXByb2R1Y3QuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9uLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9uLWxpc3RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9uLXN1YmRvbWFpbnMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9ucy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3J1bGVzLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvc2JtbC1jb21wb25lbnQtZWRpdG9yLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zcGVjaWVzLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvc3ViZG9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFw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QVcsbUJBQU8sQ0FBQyx1RUFBZ0I7QUFDbkM7QUFDQSw4QkFBOEIsbUJBQU8sQ0FBQyxzRkFBcUM7QUFDM0UsZ0NBQWdDLG1CQUFPLENBQUMsc0dBQTZDOztBQUVyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLGtDQUFrQywyQkFBMkIsOENBQThDO0FBQzNHLEdBQUc7QUFDSCxDQUFDLEUiLCJmaWxlIjoic3RvY2hzcy1lZGl0b3IuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbiBcdC8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcImVkaXRvclwiOiAwXG4gXHR9O1xuXG4gXHR2YXIgZGVmZXJyZWRNb2R1bGVzID0gW107XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdHZhciBqc29ucEFycmF5ID0gd2luZG93W1wid2VicGFja0pzb25wXCJdID0gd2luZG93W1wid2VicGFja0pzb25wXCJdIHx8IFtdO1xuIFx0dmFyIG9sZEpzb25wRnVuY3Rpb24gPSBqc29ucEFycmF5LnB1c2guYmluZChqc29ucEFycmF5KTtcbiBcdGpzb25wQXJyYXkucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrO1xuIFx0anNvbnBBcnJheSA9IGpzb25wQXJyYXkuc2xpY2UoKTtcbiBcdGZvcih2YXIgaSA9IDA7IGkgPCBqc29ucEFycmF5Lmxlbmd0aDsgaSsrKSB3ZWJwYWNrSnNvbnBDYWxsYmFjayhqc29ucEFycmF5W2ldKTtcbiBcdHZhciBwYXJlbnRKc29ucEZ1bmN0aW9uID0gb2xkSnNvbnBGdW5jdGlvbjtcblxuXG4gXHQvLyBhZGQgZW50cnkgbW9kdWxlIHRvIGRlZmVycmVkIGxpc3RcbiBcdGRlZmVycmVkTW9kdWxlcy5wdXNoKFtcIi4vY2xpZW50L3BhZ2VzL21vZGVsLWVkaXRvci5qc1wiLFwiY29tbW9uXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwidmFyIGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi4vcGFnZXMvYmFzZScpO1xudmFyIE1lc2hFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvbWVzaC1lZGl0b3InKTtcbnZhciBTcGVjaWVzRWRpdG9yVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3NwZWNpZXMtZWRpdG9yJyk7XG52YXIgSW5pdGlhbENvbmRpdGlvbnNFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvaW5pdGlhbC1jb25kaXRpb25zLWVkaXRvcicpO1xudmFyIFBhcmFtZXRlcnNFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvcGFyYW1ldGVycy1lZGl0b3InKTtcbnZhciBSZWFjdGlvbnNFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvcmVhY3Rpb25zLWVkaXRvcicpO1xudmFyIEV2ZW50c0VkaXRvclZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9ldmVudHMtZWRpdG9yJyk7XG52YXIgUnVsZXNFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvcnVsZXMtZWRpdG9yJyk7XG52YXIgU0JNTENvbXBvbmVudFZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9zYm1sLWNvbXBvbmVudC1lZGl0b3InKTtcbnZhciBNb2RlbFNldHRpbmdzVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL21vZGVsLXNldHRpbmdzJyk7XG52YXIgTW9kZWxTdGF0ZUJ1dHRvbnNWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvbW9kZWwtc3RhdGUtYnV0dG9ucycpO1xuLy9tb2RlbHNcbnZhciBNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9tb2RlbCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9wYWdlcy9tb2RlbEVkaXRvci5wdWcnKTtcblxuaW1wb3J0IGluaXRQYWdlIGZyb20gJy4vcGFnZS5qcyc7XG5cbmxldCBvcGVyYXRpb25JbmZvTW9kYWxIdG1sID0gKCkgPT4ge1xuICBsZXQgZWRpdE1vZGVsTWVzc2FnZSA9IGBcbiAgICA8cD48Yj5TcGVjaWVzPC9iPjogQSBzcGVjaWVzIHJlZmVycyB0byBhIHBvb2wgb2YgZW50aXRpZXMgdGhhdCBhcmUgY29uc2lkZXJlZCBcbiAgICAgIGluZGlzdGluZ3Vpc2hhYmxlIGZyb20gZWFjaCBvdGhlciBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoZSBtb2RlbCBhbmQgbWF5IHBhcnRpY2lwYXRlIFxuICAgICAgaW4gcmVhY3Rpb25zLjwvcD5cbiAgICA8cD48Yj5QYXJhbWV0ZXI8L2I+OiBBIFBhcmFtZXRlciBpcyB1c2VkIHRvIGRlZmluZSBhIHN5bWJvbCBhc3NvY2lhdGVkIHdpdGggXG4gICAgICBhIHZhbHVlOyB0aGlzIHN5bWJvbCBjYW4gdGhlbiBiZSB1c2VkIGluIG1hdGhlbWF0aWNhbCBmb3JtdWxhcyBpbiBhIG1vZGVsLjwvcD5cbiAgICA8cD48Yj5SZWFjdGlvbjwvYj46IEEgcmVhY3Rpb24gaW4gU0JNTCByZXByZXNlbnRzIGFueSBraW5kIG9mIHByb2Nlc3MgdGhhdCBjYW4gY2hhbmdlIFxuICAgICAgdGhlIHF1YW50aXR5IG9mIG9uZSBvciBtb3JlIHNwZWNpZXMgaW4gYSBtb2RlbC4gIEF0IGxlYXN0IG9uZSBzcGVjaWVzIGlzIHJlcXVpcmVkIHRvIFxuICAgICAgYWRkIGEgcmVhY3Rpb24gYW5kIGF0IGxlYXN0IG9uZSBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQgdG8gYWRkIGEgbWFzcyBhY3Rpb24gcmVhY3Rpb24uPC9wPlxuICAgIDxwPjxiPkV2ZW50PC9iPjogRXZlbnRzIGRlc2NyaWJlIHRoZSB0aW1lIGFuZCBmb3JtIG9mIGluc3RhbnRhbmVvdXMsIGRpc2NvbnRpbnVvdXMgc3RhdGUgXG4gICAgICBjaGFuZ2VzIGluIHRoZSBtb2RlbC4gIEFuIEV2ZW50IG9iamVjdCBkZWZpbmVzIHdoZW4gdGhlIGV2ZW50IGNhbiBvY2N1ciwgdGhlIHZhcmlhYmxlcyBcbiAgICAgIHRoYXQgYXJlIGFmZmVjdGVkIGJ5IGl0LCBob3cgdGhlIHZhcmlhYmxlcyBhcmUgYWZmZWN0ZWQsIGFuZCB0aGUgZXZlbnTigJlzIHJlbGF0aW9uc2hpcCBcbiAgICAgIHRvIG90aGVyIGV2ZW50cy4gIEF0IGxlYXN0IG9uZSBzcGVjaWVzIG9yIHBhcmFtZXRlciBpcyByZXF1aXJlZCB0byBhZGQgYW4gZXZlbnQuPC9wPlxuICAgIDxwPjxiPlJ1bGU8L2I+OiBSdWxlcyBwcm92aWRlIGFkZGl0aW9uYWwgd2F5cyB0byBkZWZpbmUgdGhlIHZhbHVlcyBvZiB2YXJpYWJsZXMgXG4gICAgICBpbiBhIG1vZGVsLCB0aGVpciByZWxhdGlvbnNoaXBzLCBhbmQgdGhlIGR5bmFtaWNhbCBiZWhhdmlvcnMgb2YgdGhvc2UgdmFyaWFibGVzLiAgVGhlIFxuICAgICAgcnVsZSB0eXBlIEFzc2lnbm1lbnQgUnVsZSBpcyB1c2VkIHRvIGV4cHJlc3MgZXF1YXRpb25zIHRoYXQgc2V0IHRoZSB2YWx1ZXMgb2YgdmFyaWFibGVzLiAgXG4gICAgICBUaGUgcnVsZSB0eXBlIFJhdGUgUnVsZSBpcyB1c2VkIHRvIGV4cHJlc3MgZXF1YXRpb25zIHRoYXQgZGV0ZXJtaW5lIHRoZSByYXRlcyBvZiBjaGFuZ2UgXG4gICAgICBvZiB2YXJpYWJsZXMuICBBdCBsZWFzdCBvbmUgc3BlY2llcyBvciBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQgdG8gYWRkIGEgcnVsZS48L3A+XG4gICAgPHA+PGI+UHJldmlldzwvYj46IEEgcHJldmlldyBvZiB0aGUgbW9kZWwgc2hvd3MgdGhlIHJlc3VsdHMgb2YgdGhlIGZpcnN0IGZpdmUgc2Vjb25kcyBvZiBhIFxuICAgICAgc2luZ2xlIHRyYWplY3Rvcnkgb2YgdGhlIG1vZGVsIHNpbXVsYXRpb24uICBBdCBsZWFzdCBvbmUgc3BlY2llcyBhbmQgb25lIHJlYWN0aW9uLCBldmVudCwgXG4gICAgICBvciBydWxlIGlzIHJlcXVpcmVkIHRvIHJ1biBhIHByZXZpZXcuPC9wPlxuICAgIDxwPjxiPldvcmtmbG93PC9iPjogQSB3b3JrZmxvdyBhbGxvd3MgeW91IHRvIHJ1biBhIGZ1bGwgbW9kZWwgd2l0aCBtdWx0aXBsZSB0cmFqZWN0b3JpZXMgd2l0aCBcbiAgICAgIHNldHRpbmdzIHRoZSB3aWxsIGhlbHAgcmVmaW5lIHRoZSBzaW11bGF0aW9uLiAgQXQgbGVhc3Qgb25lIHNwZWNpZXMgYW5kIG9uZSByZWFjdGlvbiwgZXZlbnQsIFxuICAgICAgb3IgcnVsZSBpcyByZXF1aXJlZCB0byBjcmVhdGUgYSBuZXcgd29ya2Zsb3cuPC9wPlxuICBgO1xuXG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cIm9wZXJhdGlvbkluZm9Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj4gTW9kZWwgRWRpdG9yIEhlbHAgPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxwPiAke2VkaXRNb2RlbE1lc3NhZ2V9IDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgIFxufVxuXG5sZXQgTW9kZWxFZGl0b3IgPSBQYWdlVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtbW9kZWwtaGVscF0nIDogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IG1vZGFsID0gJChvcGVyYXRpb25JbmZvTW9kYWxIdG1sKCkpLm1vZGFsKCk7XG4gICAgfSxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgUGFnZVZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpcmVjdG9yeSA9IGRvY3VtZW50LlVSTC5zcGxpdCgnL21vZGVscy9lZGl0JykucG9wKCk7XG4gICAgdmFyIG1vZGVsRmlsZSA9IGRpcmVjdG9yeS5zcGxpdCgnLycpLnBvcCgpO1xuICAgIHZhciBuYW1lID0gZGVjb2RlVVJJKG1vZGVsRmlsZS5zcGxpdCgnLicpWzBdKTtcbiAgICB2YXIgaXNTcGF0aWFsID0gbW9kZWxGaWxlLnNwbGl0KCcuJykucG9wKCkuc3RhcnRzV2l0aCgncycpO1xuICAgIHRoaXMubW9kZWwgPSBuZXcgTW9kZWwoe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGRpcmVjdG9yeTogZGlyZWN0b3J5LFxuICAgICAgaXNfc3BhdGlhbDogaXNTcGF0aWFsLFxuICAgICAgaXNQcmV2aWV3OiB0cnVlLFxuICAgIH0pO1xuICAgIHRoaXMubW9kZWwuZmV0Y2goe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICBzZWxmLnJlbmRlclN1YnZpZXdzKCk7XG4gICAgICAgIGlmKCFzZWxmLm1vZGVsLmlzX3NwYXRpYWwpe1xuICAgICAgICAgIHNlbGYucXVlcnlCeUhvb2soJ21lc2gtZWRpdG9yLWNvbnRhaW5lcicpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICBzZWxmLnF1ZXJ5QnlIb29rKCdpbml0aWFsLWNvbmRpdGlvbnMtZWRpdG9yLWNvbnRhaW5lcicpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZighc2VsZi5tb2RlbC5mdW5jdGlvbkRlZmluaXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgIHNlbGYucXVlcnlCeUhvb2soJ3NibWwtY29tcG9uZW50LWNvbnRhaW5lcicpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMubW9kZWwucmVhY3Rpb25zLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChyZWFjdGlvbnMpIHtcbiAgICAgIHRoaXMudXBkYXRlU3BlY2llc0luVXNlKCk7XG4gICAgICB0aGlzLnVwZGF0ZVBhcmFtZXRlcnNJblVzZSgpO1xuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvbi5vbihcImFkZCBjaGFuZ2UgcmVtb3ZlXCIsIGZ1bmN0aW9uICgpe1xuICAgICAgdGhpcy51cGRhdGVTcGVjaWVzSW5Vc2UoKTtcbiAgICAgIHRoaXMudXBkYXRlUGFyYW1ldGVyc0luVXNlKCk7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5tb2RlbC5ydWxlcy5vbihcImFkZCBjaGFuZ2UgcmVtb3ZlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy51cGRhdGVTcGVjaWVzSW5Vc2UoKTtcbiAgICAgIHRoaXMudXBkYXRlUGFyYW1ldGVyc0luVXNlKCk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVTcGVjaWVzSW5Vc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMubW9kZWwuc3BlY2llcztcbiAgICB2YXIgcmVhY3Rpb25zID0gdGhpcy5tb2RlbC5yZWFjdGlvbnM7XG4gICAgdmFyIGV2ZW50cyA9IHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvbjtcbiAgICB2YXIgcnVsZXMgPSB0aGlzLm1vZGVsLnJ1bGVzO1xuICAgIHNwZWNpZXMuZm9yRWFjaChmdW5jdGlvbiAoc3BlY2llKSB7IHNwZWNpZS5pblVzZSA9IGZhbHNlOyB9KTtcbiAgICB2YXIgdXBkYXRlSW5Vc2VGb3JSZWFjdGlvbiA9IGZ1bmN0aW9uIChzdG9pY2hTcGVjaWUpIHtcbiAgICAgIF8ud2hlcmUoc3BlY2llcy5tb2RlbHMsIHsgY29tcElEOiBzdG9pY2hTcGVjaWUuc3BlY2llLmNvbXBJRCB9KVxuICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChzcGVjaWUpIHtcbiAgICAgICAgICBzcGVjaWUuaW5Vc2UgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdmFyIHVwZGF0ZUluVXNlRm9yT3RoZXIgPSBmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICBfLndoZXJlKHNwZWNpZXMubW9kZWxzLCB7IGNvbXBJRDogc3BlY2llLmNvbXBJRCB9KVxuICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChzcGVjaWUpIHtcbiAgICAgICAgIHNwZWNpZS5pblVzZSA9IHRydWU7XG4gICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgcmVhY3Rpb24ucHJvZHVjdHMuZm9yRWFjaCh1cGRhdGVJblVzZUZvclJlYWN0aW9uKTtcbiAgICAgIHJlYWN0aW9uLnJlYWN0YW50cy5mb3JFYWNoKHVwZGF0ZUluVXNlRm9yUmVhY3Rpb24pO1xuICAgIH0pO1xuICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQuZXZlbnRBc3NpZ25tZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChhc3NpZ25tZW50KSB7XG4gICAgICAgIHVwZGF0ZUluVXNlRm9yT3RoZXIoYXNzaWdubWVudC52YXJpYWJsZSlcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIHVwZGF0ZUluVXNlRm9yT3RoZXIocnVsZS52YXJpYWJsZSk7XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZVBhcmFtZXRlcnNJblVzZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5wYXJhbWV0ZXJzO1xuICAgIHZhciByZWFjdGlvbnMgPSB0aGlzLm1vZGVsLnJlYWN0aW9ucztcbiAgICB2YXIgZXZlbnRzID0gdGhpcy5tb2RlbC5ldmVudHNDb2xsZWN0aW9uO1xuICAgIHZhciBydWxlcyA9IHRoaXMubW9kZWwucnVsZXM7XG4gICAgcGFyYW1ldGVycy5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhbSkgeyBwYXJhbS5pblVzZSA9IGZhbHNlOyB9KTtcbiAgICB2YXIgdXBkYXRlSW5Vc2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIF8ud2hlcmUocGFyYW1ldGVycy5tb2RlbHMsIHsgY29tcElEOiBwYXJhbS5jb21wSUQgfSlcbiAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgIHBhcmFtLmluVXNlID0gdHJ1ZTtcbiAgICAgICB9KTtcbiAgICB9XG4gICAgcmVhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB1cGRhdGVJblVzZShyZWFjdGlvbi5yYXRlKTtcbiAgICB9KTtcbiAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LmV2ZW50QXNzaWdubWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXNzaWdubWVudCkge1xuICAgICAgICB1cGRhdGVJblVzZShhc3NpZ25tZW50LnZhcmlhYmxlKVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcnVsZXMuZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgdXBkYXRlSW5Vc2UocnVsZS52YXJpYWJsZSk7XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlclN1YnZpZXdzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lc2hFZGl0b3IgPSBuZXcgTWVzaEVkaXRvclZpZXcoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWwubWVzaFNldHRpbmdzXG4gICAgfSk7XG4gICAgdmFyIHNwZWNpZXNFZGl0b3IgPSBuZXcgU3BlY2llc0VkaXRvclZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5zcGVjaWVzXG4gICAgfSk7XG4gICAgdmFyIGluaXRpYWxDb25kaXRpb25zRWRpdG9yID0gbmV3IEluaXRpYWxDb25kaXRpb25zRWRpdG9yVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLmluaXRpYWxDb25kaXRpb25zXG4gICAgfSk7XG4gICAgdmFyIHBhcmFtZXRlcnNFZGl0b3IgPSBuZXcgUGFyYW1ldGVyc0VkaXRvclZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5wYXJhbWV0ZXJzXG4gICAgfSk7XG4gICAgdmFyIHJlYWN0aW9uc0VkaXRvciA9IG5ldyBSZWFjdGlvbnNFZGl0b3JWaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucmVhY3Rpb25zXG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJFdmVudHNWaWV3KCk7XG4gICAgdGhpcy5yZW5kZXJSdWxlc1ZpZXcoKTtcbiAgICB2YXIgc2JtbENvbXBvbmVudFZpZXcgPSBuZXcgU0JNTENvbXBvbmVudFZpZXcoe1xuICAgICAgZnVuY3Rpb25EZWZpbml0aW9uczogdGhpcy5tb2RlbC5mdW5jdGlvbkRlZmluaXRpb25zLFxuICAgIH0pO1xuICAgIHZhciBtb2RlbFNldHRpbmdzID0gbmV3IE1vZGVsU2V0dGluZ3NWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLm1vZGVsU2V0dGluZ3MsXG4gICAgfSk7XG4gICAgdmFyIG1vZGVsU3RhdGVCdXR0b25zID0gbmV3IE1vZGVsU3RhdGVCdXR0b25zVmlldyh7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KG1lc2hFZGl0b3IsICdtZXNoLWVkaXRvci1jb250YWluZXInKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzcGVjaWVzRWRpdG9yLCAnc3BlY2llcy1lZGl0b3ItY29udGFpbmVyJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoaW5pdGlhbENvbmRpdGlvbnNFZGl0b3IsICdpbml0aWFsLWNvbmRpdGlvbnMtZWRpdG9yLWNvbnRhaW5lcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHBhcmFtZXRlcnNFZGl0b3IsICdwYXJhbWV0ZXJzLWVkaXRvci1jb250YWluZXInKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhyZWFjdGlvbnNFZGl0b3IsICdyZWFjdGlvbnMtZWRpdG9yLWNvbnRhaW5lcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHNibWxDb21wb25lbnRWaWV3LCAnc2JtbC1jb21wb25lbnQtY29udGFpbmVyJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcobW9kZWxTZXR0aW5ncywgJ21vZGVsLXNldHRpbmdzLWNvbnRhaW5lcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KG1vZGVsU3RhdGVCdXR0b25zLCAnbW9kZWwtc3RhdGUtYnV0dG9ucy1jb250YWluZXInKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgcmVuZGVyRXZlbnRzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuZXZlbnRzRWRpdG9yKXtcbiAgICAgIHRoaXMuZXZlbnRzRWRpdG9yLnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmV2ZW50c0VkaXRvciA9IG5ldyBFdmVudHNFZGl0b3JWaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvblxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuZXZlbnRzRWRpdG9yLCAnZXZlbnRzLWVkaXRvci1jb250YWluZXInKTtcbiAgfSxcbiAgcmVuZGVyUnVsZXNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5ydWxlc0VkaXRvcil7XG4gICAgICB0aGlzLnJ1bGVzRWRpdG9yLnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLnJ1bGVzRWRpdG9yID0gbmV3IFJ1bGVzRWRpdG9yVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnJ1bGVzXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5ydWxlc0VkaXRvciwgJ3J1bGVzLWVkaXRvci1jb250YWluZXInKTtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgfSxcbn0pO1xuXG5pbml0UGFnZShNb2RlbEVkaXRvcik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRpb246IHtcbiAgICByZWFjdGFudHM6IFtdLFxuICAgIHByb2R1Y3RzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIGxhYmVsOiAnXFxcXGVtcHR5c2V0IFxcXFxyaWdodGFycm93IEEnLFxuICB9LFxuICBkZXN0cnVjdGlvbjoge1xuICAgIHJlYWN0YW50czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBwcm9kdWN0czogW10sXG4gICAgbGFiZWw6ICdBIFxcXFxyaWdodGFycm93IFxcXFxlbXB0eXNldCdcbiAgfSxcbiAgY2hhbmdlOiB7XG4gICAgcmVhY3RhbnRzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIHByb2R1Y3RzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIGxhYmVsOiAnQSBcXFxccmlnaHRhcnJvdyBCJ1xuICB9LFxuICBkaW1lcml6YXRpb246IHtcbiAgICByZWFjdGFudHM6IFsgeyByYXRpbzogMiB9IF0sXG4gICAgcHJvZHVjdHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgbGFiZWw6ICcyQSBcXFxccmlnaHRhcnJvdyBCJ1xuICB9LFxuICBtZXJnZToge1xuICAgIHJlYWN0YW50czogWyB7IHJhdGlvOiAxIH0sIHsgcmF0aW86IDEgfSBdLFxuICAgIHByb2R1Y3RzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIGxhYmVsOiAnQSArIEIgXFxcXHJpZ2h0YXJyb3cgQydcbiAgfSxcbiAgc3BsaXQ6IHtcbiAgICByZWFjdGFudHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgcHJvZHVjdHM6IFsgeyByYXRpbzogMSB9LCB7IHJhdGlvOiAxIH0gXSxcbiAgICBsYWJlbDogJ0EgXFxcXHJpZ2h0YXJyb3cgQiArIEMnXG4gIH0sXG4gIGZvdXI6IHtcbiAgICByZWFjdGFudHM6IFsgeyByYXRpbzogMSB9LCB7IHJhdGlvOiAxIH0gXSxcbiAgICBwcm9kdWN0czogWyB7IHJhdGlvOiAxIH0sIHsgcmF0aW86IDEgfSBdLFxuICAgIGxhYmVsOiAnQSArIEIgXFxcXHJpZ2h0YXJyb3cgQyArIEQnXG4gIH0sXG4gICdjdXN0b20tbWFzc2FjdGlvbic6IHtcbiAgICByZWFjdGFudHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgcHJvZHVjdHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgbGFiZWw6ICdDdXN0b20gbWFzcyBhY3Rpb24nXG4gIH0sXG4gICdjdXN0b20tcHJvcGVuc2l0eSc6IHtcbiAgICByZWFjdGFudHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgcHJvZHVjdHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgbGFiZWw6ICdDdXN0b20gcHJvcGVuc2l0eSdcbiAgfVxufVxuIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZCBjbGFzcz1cXFwibmFtZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInNwZWNpZS1uYW1lXFxcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInNwZWNpZS1tb2RlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJzd2l0Y2hpbmdcXFwiXFx1MDAzRVxcdTAwM0NpbnB1dFwiICsgKFwiIHR5cGU9XFxcInJhZGlvXFxcIlwiK3B1Zy5hdHRyKFwibmFtZVwiLCB0aGlzLm1vZGVsLm5hbWUgKyBcIi1zd2l0Y2gtbWV0aG9kXCIsIHRydWUsIHRydWUpK1wiIGRhdGEtaG9vaz1cXFwic3dpdGNoaW5nLXRvbFxcXCJcIikgKyBcIlxcdTAwM0UgU3dpdGNoaW5nIFRvbGVyYW5jZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInN3aXRjaGluZ1xcXCJcXHUwMDNFXFx1MDAzQ2lucHV0XCIgKyAoXCIgdHlwZT1cXFwicmFkaW9cXFwiXCIrcHVnLmF0dHIoXCJuYW1lXCIsIHRoaXMubW9kZWwubmFtZSArIFwiLXN3aXRjaC1tZXRob2RcIiwgdHJ1ZSwgdHJ1ZSkrXCIgZGF0YS1ob29rPVxcXCJzd2l0Y2hpbmctbWluXFxcIlwiKSArIFwiXFx1MDAzRSBNaW5pbXVtIFZhbHVlIGZvciBTd2l0Y2hpbmcgKG51bWJlciBvZiBtb2xlY3VsZXMpXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN3aXRjaGluZy10b2xlcmFuY2VcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzd2l0Y2hpbmctdGhyZXNob2xkXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NsYWJlbCBjbGFzcz1cXFwic2VsZWN0XFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJ0bi1zbVxcXCIgZGF0YS1ob29rPVxcXCJpbmNyZW1lbnRcXFwiXFx1MDAzRStcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY3VzdG9tXFxcIiBkYXRhLWhvb2s9XFxcInJhdGlvXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBidG4tc21cXFwiIGRhdGEtaG9vaz1cXFwiZGVjcmVtZW50XFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ3NlbGVjdCBkYXRhLWhvb2s9XFxcInNlbGVjdC1zdG9pY2gtc3BlY2llXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwibWVzc2FnZSBtZXNzYWdlLWJlbG93IG1lc3NhZ2UtZXJyb3JcXFwiIGRhdGEtaG9vaz1cXFwibWVzc2FnZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NwIGRhdGEtaG9vaz1cXFwibWVzc2FnZS10ZXh0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NcXHUwMDJGc2VsZWN0XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgY3VzdG9tIGJ0bi1zbVxcXCIgZGF0YS1ob29rPVxcXCJyZW1vdmVcXFwiXFx1MDAzRVhcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmxhYmVsXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiZXZlbnQtYXNzaWdubWVudC12YXJpYWJsZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImV2ZW50LWFzc2lnbm1lbnQtRXhwcmVzc2lvblxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeVxcXCIgZGF0YS1ob29rPVxcXCJyZW1vdmVcXFwiXFx1MDAzRVhcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwuc2lnbmF0dXJlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RoXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uLWxhcmdlXFxcIlwiK1wiIGRhdGEtaG9vaz1cXFwiYW5ub3RhdGlvbi10b29sdGlwXFxcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5tb2RlbC5hbm5vdGF0aW9uIHx8IFwiQ2xpY2sgJ0FkZCcgdG8gYWRkIGFuIGFubm90YXRpb25cIiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJmaWxlLWFsdFxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWZpbGUtYWx0IGZhLXctMTJcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzg0IDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjI0IDEzNlYwSDI0QzEwLjcgMCAwIDEwLjcgMCAyNHY0NjRjMCAxMy4zIDEwLjcgMjQgMjQgMjRoMzM2YzEzLjMgMCAyNC0xMC43IDI0LTI0VjE2MEgyNDhjLTEzLjIgMC0yNC0xMC44LTI0LTI0em02NCAyMzZjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNjRjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNzJ2OGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ6bTk2LTExNC4xdjYuMUgyNTZWMGg2LjFjNi40IDAgMTIuNSAyLjUgMTcgN2w5Ny45IDk4YzQuNSA0LjUgNyAxMC42IDcgMTYuOXpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJ0bi1zbVxcXCIgZGF0YS1ob29rPVxcXCJlZGl0LWFubm90YXRpb24tYnRuXFxcIlxcdTAwM0VFZGl0XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeVxcXCIgZGF0YS1ob29rPVxcXCJyZW1vdmVcXFwiXFx1MDAzRVhcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJpbml0aWFsLWNvbmRpdGlvbi10eXBlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiaW5pdGlhbC1jb25kaXRpb24tc3BlY2llc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImluaXRpYWwtY29uZGl0aW9uLWRldGFpbHNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFQ291bnRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVpcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiY291bnQtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieC1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ5LWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInotY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZCBjbGFzcz1cXFwibmFtZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImlucHV0LW5hbWUtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiaW5wdXQtdmFsdWUtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvbi1sYXJnZVxcXCJcIitcIiBkYXRhLWhvb2s9XFxcImFubm90YXRpb24tdG9vbHRpcFxcXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMubW9kZWwuYW5ub3RhdGlvbiB8fCBcIkNsaWNrICdBZGQnIHRvIGFkZCBhbiBhbm5vdGF0aW9uXCIsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiZmlsZS1hbHRcXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1maWxlLWFsdCBmYS13LTEyXFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDM4NCA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIyNCAxMzZWMEgyNEMxMC43IDAgMCAxMC43IDAgMjR2NDY0YzAgMTMuMyAxMC43IDI0IDI0IDI0aDMzNmMxMy4zIDAgMjQtMTAuNyAyNC0yNFYxNjBIMjQ4Yy0xMy4yIDAtMjQtMTAuOC0yNC0yNHptNjQgMjM2YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTY0YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTcydjhjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEyem05Ni0xMTQuMXY2LjFIMjU2VjBoNi4xYzYuNCAwIDEyLjUgMi41IDE3IDdsOTcuOSA5OGM0LjUgNC41IDcgMTAuNiA3IDE2Ljl6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBidG4tc20gYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJlZGl0LWFubm90YXRpb24tYnRuXFxcIlxcdTAwM0VFZGl0XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcInJlbW92ZVxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGQgY2xhc3M9XFxcIm5hbWVcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJydWxlLW5hbWVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJydWxlLXR5cGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJydWxlLXZhcmlhYmxlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicnVsZS1leHByZXNzaW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvbi1sYXJnZVxcXCJcIitcIiBkYXRhLWhvb2s9XFxcImFubm90YXRpb24tdG9vbHRpcFxcXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMubW9kZWwuYW5ub3RhdGlvbiB8fCBcIkNsaWNrICdBZGQnIHRvIGFkZCBhbiBhbm5vdGF0aW9uXCIsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiZmlsZS1hbHRcXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1maWxlLWFsdCBmYS13LTEyXFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDM4NCA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIyNCAxMzZWMEgyNEMxMC43IDAgMCAxMC43IDAgMjR2NDY0YzAgMTMuMyAxMC43IDI0IDI0IDI0aDMzNmMxMy4zIDAgMjQtMTAuNyAyNC0yNFYxNjBIMjQ4Yy0xMy4yIDAtMjQtMTAuOC0yNC0yNHptNjQgMjM2YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTY0YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTcydjhjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEyem05Ni0xMTQuMXY2LjFIMjU2VjBoNi4xYzYuNCAwIDEyLjUgMi41IDE3IDdsOTcuOSA5OGM0LjUgNC41IDcgMTAuNiA3IDE2Ljl6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBidG4tc20gYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJlZGl0LWFubm90YXRpb24tYnRuXFxcIlxcdTAwM0VFZGl0XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcInJlbW92ZVxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUNvdW50XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU3ViZG9tYWluXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImNvdW50LWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN1YmRvbWFpbi1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkIGNsYXNzPVxcXCJuYW1lXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiaW5wdXQtbmFtZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJpbnB1dC1kaWZmdXNpb24tY29lZmYtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiIGRhdGEtaG9vaz1cXFwic3ViZG9tYWluc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeVxcXCIgZGF0YS1ob29rPVxcXCJyZW1vdmVcXFwiXFx1MDAzRVhcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NsYWJlbCBjbGFzcz1cXFwic2VsZWN0XFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBkYXRhLWhvb2s9XFxcInJhdGlvXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ3NlbGVjdCBkYXRhLWhvb2s9XFxcInNlbGVjdC1zdG9pY2gtc3BlY2llXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwibWVzc2FnZSBtZXNzYWdlLWJlbG93IG1lc3NhZ2UtZXJyb3JcXFwiIGRhdGEtaG9vaz1cXFwibWVzc2FnZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NwIGRhdGEtaG9vaz1cXFwibWVzc2FnZS10ZXh0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NcXHUwMDJGc2VsZWN0XFx1MDAzRVxcdTAwM0NcXHUwMDJGbGFiZWxcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VWYXJpYWJsZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnBhcmVudC5wYXJlbnQudG9vbHRpcHMudmFyaWFibGUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VFeHByZXNzaW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMucGFyZW50LnBhcmVudC50b29sdGlwcy5hc3NpZ25tZW50RXhwcmVzc2lvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFUmVtb3ZlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwiZXZlbnQtYXNzaWdubWVudHMtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJhZGQtZXZlbnQtYXNzaWdubWVudFxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIlxcdTAwM0VBZGQgQXNzaWdubWVudFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImV2ZW50LWRldGFpbHNcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gZm9yPVxcXCJldmVudC10cmlnZ2VyLWV4cHJlc3Npb25cXFwiXFx1MDAzRVRyaWdnZXIgRXhwcmVzc2lvbjpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMudHJpZ2dlckV4cHJlc3Npb24sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtOCBpbmxpbmVcXFwiIGlkPVxcXCJldmVudC10cmlnZ2VyLWV4cHJlc3Npb25cXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtdHJpZ2dlci1leHByZXNzaW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBZHZhbmNlZFxcdTAwM0NcXHUwMDJGaDZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjYWR2YW5jZWQtZXZlbnRzXFxcIiBkYXRhLWhvb2s9XFxcImFkdmFuY2VkLWV2ZW50LWJ1dHRvblxcXCJcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiYWR2YW5jZWQtZXZlbnRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02XFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBmb3I9XFxcImV2ZW50LXRyaWdnZXItZXhwcmVzc2lvblxcXCJcXHUwMDNFRGVsYXk6XFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMucGFyZW50LnRvb2x0aXBzLmRlbGF5LCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTkgaW5saW5lXFxcIiBpZD1cXFwiZXZlbnQtZGVsYXlcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtZGVsYXlcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02XFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBmb3I9XFxcImV2ZW50LXRyaWdnZXItZXhwcmVzc2lvblxcXCJcXHUwMDNFUHJpb2lydHk6XFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMucGFyZW50LnRvb2x0aXBzLnByaW9yaXR5LCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTggaW5saW5lXFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50LXByaW9yaXR5XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IHZlcnRpY2xlLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2hlY2tib3hcXFwiIGZvcj1cXFwiaW5pdGlhbC12YWx1ZVxcXCJcXHUwMDNFSW5pdGlhbCBWYWx1ZTpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMuaW5pdGlhbFZhbHVlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBpZD1cXFwiaW5pdGlhbC12YWx1ZVxcXCIgZGF0YS1ob29rPVxcXCJldmVudC10cmlnZ2VyLWluaXQtdmFsdWVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IHZlcnRpY2xlLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2hlY2tib3hcXFwiIGZvcj1cXFwicGVyc2lzdGVudFxcXCJcXHUwMDNFUGVyc2lzdGVudDpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMucGVyc2lzdGVudCwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgaWQ9XFxcInBlcnNpc3RlbnRcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtdHJpZ2dlci1wZXJzaXN0ZW50XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC0xMiB2ZXJ0aWNsZS1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNoZWNrYm94XFxcIiBmb3I9XFxcInVzZS12YWx1ZXMtZnJvbS10cmlnZ2VyLXRpbWVcXFwiXFx1MDAzRVVzZSBWYWx1ZXMgRnJvbTpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMudXNlVmFsdWVzRnJvbVRyaWdnZXJUaW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaG9yaXpvbnRhbC1zcGFjZSBpbmxpbmVcXFwiXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwidXNlLXZhbHVlcy1mcm9tXFxcIiBkYXRhLWhvb2s9XFxcInRyaWdnZXItdGltZVxcXCIgZGF0YS1uYW1lPVxcXCJ0cmlnZ2VyXFxcIlxcdTAwM0UgVHJpZ2dlciBUaW1lXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaG9yaXpvbnRhbC1zcGFjZSBpbmxpbmVcXFwiXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwidXNlLXZhbHVlcy1mcm9tXFxcIiBkYXRhLWhvb2s9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgZGF0YS1uYW1lPVxcXCJhc3NpZ25tZW50XFxcIlxcdTAwM0UgQXNzaWdubWVudCBUaW1lXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBc3NpZ25tZW50c1xcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnBhcmVudC50b29sdGlwcy5hc3NpZ25tZW50cywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiZXZlbnQtYXNzaWdubWVudHNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0XFxcIiBuYW1lPVxcXCJldmVudC1zZWxlY3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkIGNsYXNzPVxcXCJuYW1lXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiZXZlbnQtbmFtZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uLWxhcmdlXFxcIlwiK1wiIGRhdGEtaG9vaz1cXFwiYW5ub3RhdGlvbi10b29sdGlwXFxcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5tb2RlbC5hbm5vdGF0aW9uIHx8IFwiQ2xpY2sgJ0FkZCcgdG8gYWRkIGFuIGFubm90YXRpb25cIiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJmaWxlLWFsdFxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWZpbGUtYWx0IGZhLXctMTJcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzg0IDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjI0IDEzNlYwSDI0QzEwLjcgMCAwIDEwLjcgMCAyNHY0NjRjMCAxMy4zIDEwLjcgMjQgMjQgMjRoMzM2YzEzLjMgMCAyNC0xMC43IDI0LTI0VjE2MEgyNDhjLTEzLjIgMC0yNC0xMC44LTI0LTI0em02NCAyMzZjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNjRjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNzJ2OGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ6bTk2LTExNC4xdjYuMUgyNTZWMGg2LjFjNi40IDAgMTIuNSAyLjUgMTcgN2w5Ny45IDk4YzQuNSA0LjUgNyAxMC42IDcgMTYuOXpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJ0bi1zbSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtYW5ub3RhdGlvbi1idG5cXFwiXFx1MDAzRUVkaXRcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJldmVudHNcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUV2ZW50c1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjZXZlbnRzLWNvbnRhaW5lclxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJldmVudHMtY29udGFpbmVyXFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNiBjb250YWluZXItcGFydFxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRWRpdFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMubmFtZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFubm90YXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbm5vdGF0aW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJldmVudC1saXN0aW5nLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IGNvbnRhaW5lci1wYXJ0XFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50LWRldGFpbHMtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcImFkZC1ldmVudFxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIlxcdTAwM0VBZGQgRXZlbnRcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwiaW5pdGlhbC1jb25kaXRpb25zXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VJbml0aWFsIENvbmRpdGlvbnNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2luaXRpYWwtY29uZGl0aW9uXFxcIiBkYXRhLWhvb2s9XFxcImluaXRpYWwtY29uZGl0aW9uLWJ1dHRvblxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJpbml0aWFsLWNvbmRpdGlvblxcXCIgZGF0YS1ob29rPVxcXCJpbml0aWFsLWNvbmRpdGlvbnNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVR5cGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTcGVjaWVzXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRGV0YWlsc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcImluaXRpYWwtY29uZGl0aW9ucy1jb2xsZWN0aW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiZHJvcGRvd25cXFwiXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGRyb3Bkb3duLXRvZ2dsZVxcXCIgaWQ9XFxcImFkZEluaXRpYWxDb25kaXRpb25CdG5cXFwiIGRhdGEtaG9vaz1cXFwiYWRkLWluaXRpYWwtY29uZGl0aW9uXFxcIiBkYXRhLXRvZ2dsZT1cXFwiZHJvcGRvd25cXFwiIGFyaWEtaGFzcG9wdXA9XFxcInRydWVcXFwiIGFyaWEtZXhwYW5kZWQ9XFxcImZhbHNlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBJbml0aWFsIENvbmRpdGlvbiBcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2FyZXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDdWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnVcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwiYWRkSW5pdGlhbENvbmRpdGlvbkJ0blxcXCJcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcInNjYXR0ZXJcXFwiXFx1MDAzRVNjYXR0ZXJcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJwbGFjZVxcXCJcXHUwMDNFUGxhY2VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJkaXN0cmlidXRlLXVuaWZvcm1seVxcXCJcXHUwMDNFRGlzdHJpYnV0ZSBVbmlmb3JtbHkgcGVyIFZveGVsXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDXFx1MDAyRnVsXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJtZXNoLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTWVzaCBFZGl0b3JcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLW1lc2hcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtbWVzaFxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm51bS1zdWJkb21haW5zLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicHJldmlldy1zZXR0aW5nc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUHJldmlldyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMucHJldmlld1NldHRpbmdzLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1wcmV2aWV3LXNldHRpbmdzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXByZXZpZXctc2V0dGluZ3NcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVNpbXVsYXRpb24gVGltZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VUaW1lIFVuaXRzXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMudGltZVVuaXRzLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFVm9sdW1lXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMudm9sdW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicHJldmlldy10aW1lXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGltZS11bml0c1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInZvbHVtZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcIm1kbC1lZGl0LWJ0blxcXCJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwic2F2ZVxcXCJcXHUwMDNFU2F2ZVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcIm1kbC1lZGl0LWJ0biBzYXZpbmctc3RhdHVzXFxcIiBkYXRhLWhvb2s9XFxcInNhdmluZy1tZGxcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInNwaW5uZXItZ3Jvd1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFU2F2aW5nLi4uXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcIm1kbC1lZGl0LWJ0biBzYXZlZC1zdGF0dXNcXFwiIGRhdGEtaG9vaz1cXFwic2F2ZWQtbWRsXFxcIlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VTYXZlZFxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJydW5cXFwiXFx1MDAzRVJ1biBQcmV2aWV3XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwic3RhcnQtd29ya2Zsb3dcXFwiXFx1MDAzRU5ldyBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJwYXJhbWV0ZXJzLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGFyYW1ldGVyc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcGFyYW1ldGVyc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1wYXJhbWV0ZXJzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm5hbWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VFeHByZXNzaW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuZXhwcmVzc2lvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFIFxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBbm5vdGF0aW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuYW5ub3RhdGlvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJlbW92ZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwicGFyYW1ldGVyLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcImFkZC1wYXJhbWV0ZXJcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFBhcmFtZXRlclxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJlYWN0aW9uLWRldGFpbHNcXFwiXFx1MDAzRVxcdTAwM0NoNSBkYXRhLWhvb2s9XFxcImZpZWxkLXRpdGxlXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5maWVsZFRpdGxlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCIgZGF0YS1ob29rPVxcXCJmaWVsZC10aXRsZS10b29sdGlwXFxcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIiB0aXRsZT1cXFwiXFxcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJyZWFjdGFudHMtZWRpdG9yXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIiBkYXRhLWhvb2s9XFxcImFkZC1zcGVjaWUtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic2VsZWN0LXNwZWNpZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBidG4tc21cXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXNlbGVjdGVkLXNwZWNpZVxcXCJcXHUwMDNFYWRkXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiIGRhdGEtaG9vaz1cXFwicmVhY3Rpb24tZGV0YWlsc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicmVhY3Rpb24tc3VtbWFyeVxcXCJcXHUwMDNFU3VtbWFyeTogXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN1bW1hcnktY29udGFpbmVyXFxcIiBpZD1cXFwicmVhY3Rpb24tc3VtbWFyeVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEyXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1yZWFjdGlvbi10eXBlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtMTIgdmVydGljbGUtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGZvcj1cXFwiZXZlbnQtdHJpZ2dlci1leHByZXNzaW9uXFxcIiBkYXRhLWhvb2s9XFxcInJhdGUtcGFyYW1ldGVyLWxhYmVsXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtaG9vaz1cXFwicmF0ZS1wYXJhbWV0ZXItdG9vbHRpcFxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiIHRpdGxlPVxcXCJcXFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZSBob3Jpem9udGFsLXNwYWNlXFxcIiBpZD1cXFwic2VsZWN0LXJhdGUtcGFyYW1ldGVyXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdC1yYXRlLXBhcmFtZXRlclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEyIGNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcInN1YmRvbWFpbnMtZWRpdG9yXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNlxcXCIgZGF0YS1ob29rPVxcXCJyZWFjdGFudHMtZWRpdG9yXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNlxcXCIgZGF0YS1ob29rPVxcXCJwcm9kdWN0cy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImNvbmZsaWN0aW5nLW1vZGVzLW1lc3NhZ2VcXFwiXFx1MDAzRVxcdTAwM0NwIGNsYXNzPVxcXCJ0ZXh0LXdhcm5pbmdcXFwiXFx1MDAzRVxcdTAwM0NiXFx1MDAzRVdhcm5pbmdcXHUwMDNDXFx1MDAyRmJcXHUwMDNFOiBUaGlzIHJlYWN0aW9uIGNvbnRhaW5lcyBTdG9pY2ggU3BlY2llcyB3aXRoIG1vZGVzIG9mICdDb25jZW50cmF0aW9uJyBhbmQgJ1BvcHVsYXRpb24nIG9yICdIeWJyaWQgQ29uY2VudHJhdGlvblxcdTAwMkZQb3B1bGF0aW9uJyBhbmQgd2lsbCBmaXJlIHN0b2NoYXN0aWNhbGx5LlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBkYXRhLWhvb2s9XFxcInNlbGVjdFxcXCIgbmFtZT1cXFwicmVhY3Rpb24tc2VsZWN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZCBjbGFzcz1cXFwibmFtZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImlucHV0LW5hbWUtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3VtbWFyeVxcXCIgc3R5bGU9XFxcIndpZHRoOiBhdXRvICFpbXBvcnRhbnRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uLWxhcmdlXFxcIlwiK1wiIGRhdGEtaG9vaz1cXFwiYW5ub3RhdGlvbi10b29sdGlwXFxcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5tb2RlbC5hbm5vdGF0aW9uIHx8IFwiQ2xpY2sgJ0FkZCcgdG8gYWRkIGFuIGFubm90YXRpb25cIiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJmaWxlLWFsdFxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWZpbGUtYWx0IGZhLXctMTJcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzg0IDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjI0IDEzNlYwSDI0QzEwLjcgMCAwIDEwLjcgMCAyNHY0NjRjMCAxMy4zIDEwLjcgMjQgMjQgMjRoMzM2YzEzLjMgMCAyNC0xMC43IDI0LTI0VjE2MEgyNDhjLTEzLjIgMC0yNC0xMC44LTI0LTI0em02NCAyMzZjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNjRjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNzJ2OGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ6bTk2LTExNC4xdjYuMUgyNTZWMGg2LjFjNi40IDAgMTIuNSAyLjUgMTcgN2w5Ny45IDk4YzQuNSA0LjUgNyAxMC42IDcgMTYuOXpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJ0bi1zbSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtYW5ub3RhdGlvbi1idG5cXFwiXFx1MDAzRUVkaXRcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTQgcmVhY3Rpb24tc3ViZG9tYWluXFxcIlxcdTAwM0VcXHUwMDNDbGFiZWxcIiArIChwdWcuYXR0cihcImZvclwiLCB0aGlzLm1vZGVsLm5hbWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmxhYmVsXFx1MDAzRVxcdTAwM0NpbnB1dFwiICsgKFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIlwiK3B1Zy5hdHRyKFwiaWRcIiwgdGhpcy5tb2RlbC5uYW1lLCB0cnVlLCB0cnVlKStcIiBkYXRhLWhvb2s9XFxcInN1YmRvbWFpblxcXCJcIikgKyBcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcInJlYWN0aW9uLWRldGFpbHMtc3ViZG9tYWluXFxcIlxcdTAwM0VcXHUwMDNDbGFiZWxcXHUwMDNFU3ViZG9tYWlucyB0aGUgcmVhY3Rpb24gY2FuIG9jY3VyIGluOiBcXHUwMDNDXFx1MDAyRmxhYmVsXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCIgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1zdWJkb21haW5zXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicmVhY3Rpb25zLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFIFxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VSZWFjdGlvbnNcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5yZWFjdGlvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVhY3Rpb25cXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1yZWFjdGlvblxcXCJcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFRGVmaW5lIHJlYWN0aW9ucy4gU2VsZWN0IGZyb20gdGhlIGdpdmVuIHJlYWN0aW9uIHRlbXBsYXRlcywgb3IgdXNlIHRoZSBjdXN0b20gdHlwZXMuIFxcblVzaW5nIHRlbXBsYXRlZCByZWFjdGlvbiB0eXBlcyB3aWxsIGhlbHAgZWxpbWluYXRlIGVycm9ycy4gXFxuRm9yIG5vbi1saW5lYXIgcmVhY3Rpb25zLCB1c2UgdGhlIGN1c3RvbSBwcm9wZW5zaXR5IHR5cGUuIFxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC03IGNvbnRhaW5lci1wYXJ0XFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VFZGl0XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5uYW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdW1tYXJ5XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFubm90YXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbm5vdGF0aW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTUgY29udGFpbmVyLXBhcnRcXFwiIGRhdGEtaG9vaz1cXFwicmVhY3Rpb24tZGV0YWlscy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImRyb3Bkb3duXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBkcm9wZG93bi10b2dnbGUgYm94LXNoYWRvd1xcXCIgaWQ9XFxcImFkZFJlYWN0aW9uQnRuXFxcIiBkYXRhLWhvb2s9XFxcImFkZC1yZWFjdGlvbi1mdWxsXFxcIiBkYXRhLXRvZ2dsZT1cXFwiZHJvcGRvd25cXFwiIGFyaWEtaGFzcG9wdXA9XFxcInRydWVcXFwiIGFyaWEtZXhwYW5kZWQ9XFxcImZhbHNlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBSZWFjdGlvbiBcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2FyZXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDdWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnVcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwiYWRkUmVhY3Rpb25CdG5cXFwiXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJjcmVhdGlvblxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwiZGVzdHJ1Y3Rpb25cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcImNoYW5nZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwiZGltZXJpemF0aW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJtZXJnZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwic3BsaXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcImZvdXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1kaXZpZGVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJjdXN0b20tbWFzc2FjdGlvblxcXCJcXHUwMDNFQ3VzdG9tIG1hc3MgYWN0aW9uXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwiY3VzdG9tLXByb3BlbnNpdHlcXFwiXFx1MDAzRUN1c3RvbSBwcm9wZW5zaXR5XFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDXFx1MDAyRnVsXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImRyb3Bkb3duXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBkcm9wZG93bi10b2dnbGUgYm94LXNoYWRvd1xcXCIgaWQ9XFxcImFkZFJlYWN0aW9uQnRuXFxcIiBkYXRhLWhvb2s9XFxcImFkZC1yZWFjdGlvbi1wYXJ0aWFsXFxcIiBkYXRhLXRvZ2dsZT1cXFwiZHJvcGRvd25cXFwiIGFyaWEtaGFzcG9wdXA9XFxcInRydWVcXFwiIGFyaWEtZXhwYW5kZWQ9XFxcImZhbHNlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBSZWFjdGlvbiBcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2FyZXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDdWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnVcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwiYWRkUmVhY3Rpb25CdG5cXFwiXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJjdXN0b20tcHJvcGVuc2l0eVxcXCJcXHUwMDNFQ3VzdG9tIHByb3BlbnNpdHlcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NcXHUwMDJGdWxcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJ1bGVzLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUnVsZXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJ1bGVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJ1bGVzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm5hbWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFVHlwZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnR5cGUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VWYXJpYWJsZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnZhcmlhYmxlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXhwcmVzc2lvblxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLmV4cHJlc3Npb24sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBbm5vdGF0aW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuYW5ub3RhdGlvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFUmVtb3ZlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwicnVsZS1saXN0LWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImRyb3Bkb3duXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBkcm9wZG93bi10b2dnbGUgYm94LXNoYWRvd1xcXCIgaWQ9XFxcImFkZFJ1bGVCdG5cXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXJ1bGVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJkcm9wZG93blxcXCIgYXJpYS1oYXNwb3B1cD1cXFwidHJ1ZVxcXCIgYXJpYS1leHBhbmRlZD1cXFwiZmFsc2VcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFJ1bGUgXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNhcmV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ3VsIGNsYXNzPVxcXCJkcm9wZG93bi1tZW51XFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcImFkZFJ1bGVCdG5cXFwiXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJyYXRlLXJ1bGVcXFwiIGRhdGEtbmFtZT1cXFwiUmF0ZSBSdWxlXFxcIlxcdTAwM0VSYXRlIFJ1bGVcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJhc3NpZ25tZW50LXJ1bGVcXFwiIGRhdGEtbmFtZT1cXFwiQXNzaWdubWVudCBSdWxlXFxcIlxcdTAwM0VBc3NpZ25tZW50IFJ1bGVcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NcXHUwMDJGdWxcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNibWwtY29tcG9uZW50c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU0JNTCBDb21wb25lbnRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zYm1sLWNvbXBvbmVudFxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1zYm1sLWNvbXBvbmVudFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRnVuY3Rpb24gRGVmaW5pdGlvbnNcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTaWduYXR1cmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFubm90YXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbm5vdGF0aW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJmdW5jdGlvbi1kZWZpbml0aW9uLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic3BlY2llcy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNwZWNpZXMgRWRpdG9yXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zcGVjaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNwZWNpZXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VEaWZmdXNpb24gQ29lZmZpY2llbnRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VBY3RpdmUgaW4gU3ViZG9tYWluc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcInNwZWNpZS1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnlcXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXNwZWNpZXNcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFNwZWNpZXNcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic3BlY2llcy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNwZWNpZXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXNwZWNpZXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2Utc3BlY2llc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5uYW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFSW5pdGlhbCBDb25kaXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5pbml0aWFsVmFsdWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBbm5vdGF0aW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuYW5ub3RhdGlvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJlbW92ZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwic3BlY2llLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIiBjb2xzcGFuPVxcXCIzXFxcIlxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNwZWNpZXMgTW9kZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnNwZWNpZXNNb2RlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNwZWNpZXMtbW9kZVxcXCIgZGF0YS1ob29rPVxcXCJhbGwtY29udGludW91c1xcXCIgZGF0YS1uYW1lPVxcXCJjb250aW51b3VzXFxcIlxcdTAwM0UgQ29uY2VudHJhdGlvblxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic3BlY2llcy1tb2RlXFxcIiBkYXRhLWhvb2s9XFxcImFsbC1kaXNjcmV0ZVxcXCIgZGF0YS1uYW1lPVxcXCJkaXNjcmV0ZVxcXCJcXHUwMDNFIFBvcHVsYXRpb25cXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNwZWNpZXMtbW9kZVxcXCIgZGF0YS1ob29rPVxcXCJhZHZhbmNlZFxcXCIgZGF0YS1uYW1lPVxcXCJkeW5hbWljXFxcIlxcdTAwM0UgSHlicmlkIENvbmNlbnRyYXRpb25cXHUwMDJGUG9wdWxhdGlvblxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiYWR2YW5jZWQtc3BlY2llc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTW9kZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm1vZGUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiIGNvbHNwYW49XFxcIjJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTd2l0Y2hpbmcgU2V0dGluZ3MgKEh5YnJpZCBPbmx5KVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnN3aXRjaFZhbHVlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJlZGl0LXNwZWNpZXMtbW9kZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXNwZWNpZXNcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFNwZWNpZXNcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgc3R5bGU9XFxcImJvcmRlcjogZmFsc2VcXFwiXFx1MDAzRVxcdTAwM0NsYWJlbFwiICsgKHB1Zy5hdHRyKFwiZm9yXCIsIHRoaXMubW9kZWwubmFtZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGbGFiZWxcXHUwMDNFXFx1MDAzQ2lucHV0XCIgKyAoXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiXCIrcHVnLmF0dHIoXCJpZFwiLCB0aGlzLm1vZGVsLm5hbWUsIHRydWUsIHRydWUpK1wiIGRhdGEtaG9vaz1cXFwic3ViZG9tYWluXFxcIlwiKSArIFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NlY3Rpb24gY2xhc3M9XFxcInBhZ2VcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gyIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU1vZGVsIEVkaXRvclxcdTAwM0NcXHUwMDJGaDJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYmlnLXRpcCBidG4gaW5mb3JtYXRpb24tYnRuIGhlbHBcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1tb2RlbC1oZWxwXFxcIlxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFyXFxcIiBkYXRhLWljb249XFxcInF1ZXN0aW9uLWNpcmNsZVxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLXF1ZXN0aW9uLWNpcmNsZSBmYS13LTE2XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDUxMiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTI1NiA4QzExOS4wNDMgOCA4IDExOS4wODMgOCAyNTZjMCAxMzYuOTk3IDExMS4wNDMgMjQ4IDI0OCAyNDhzMjQ4LTExMS4wMDMgMjQ4LTI0OEM1MDQgMTE5LjA4MyAzOTIuOTU3IDggMjU2IDh6bTAgNDQ4Yy0xMTAuNTMyIDAtMjAwLTg5LjQzMS0yMDAtMjAwIDAtMTEwLjQ5NSA4OS40NzItMjAwIDIwMC0yMDAgMTEwLjQ5MSAwIDIwMCA4OS40NzEgMjAwIDIwMCAwIDExMC41My04OS40MzEgMjAwLTIwMCAyMDB6bTEwNy4yNDQtMjU1LjJjMCA2Ny4wNTItNzIuNDIxIDY4LjA4NC03Mi40MjEgOTIuODYzVjMwMGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyaC00NS42NDdjLTYuNjI3IDAtMTItNS4zNzMtMTItMTJ2LTguNjU5YzAtMzUuNzQ1IDI3LjEtNTAuMDM0IDQ3LjU3OS02MS41MTYgMTcuNTYxLTkuODQ1IDI4LjMyNC0xNi41NDEgMjguMzI0LTI5LjU3OSAwLTE3LjI0Ni0yMS45OTktMjguNjkzLTM5Ljc4NC0yOC42OTMtMjMuMTg5IDAtMzMuODk0IDEwLjk3Ny00OC45NDIgMjkuOTY5LTQuMDU3IDUuMTItMTEuNDYgNi4wNzEtMTYuNjY2IDIuMTI0bC0yNy44MjQtMjEuMDk4Yy01LjEwNy0zLjg3Mi02LjI1MS0xMS4wNjYtMi42NDQtMTYuMzYzQzE4NC44NDYgMTMxLjQ5MSAyMTQuOTQgMTEyIDI2MS43OTQgMTEyYzQ5LjA3MSAwIDEwMS40NSAzOC4zMDQgMTAxLjQ1IDg4Ljh6TTI5OCAzNjhjMCAyMy4xNTktMTguODQxIDQyLTQyIDQycy00Mi0xOC44NDEtNDItNDIgMTguODQxLTQyIDQyLTQyIDQyIDE4Ljg0MSA0MiA0MnpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNVxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibWVzaC1lZGl0b3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3BlY2llcy1lZGl0b3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiaW5pdGlhbC1jb25kaXRpb25zLWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJwYXJhbWV0ZXJzLWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJyZWFjdGlvbnMtZWRpdG9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImV2ZW50cy1lZGl0b3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicnVsZXMtZWRpdG9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInNibWwtY29tcG9uZW50LWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1vZGVsLXNldHRpbmdzLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwibW9kZWwtdGltZW91dC1tZXNzYWdlXFxcIlxcdTAwM0VcXHUwMDNDcCBjbGFzcz1cXFwidGV4dC13YXJuaW5nXFxcIlxcdTAwM0VUaGUgbW9kZWwgdG9vayBsb25nZXIgdGhhbiA1IHNlY29uZHMgdG8gcnVuIGFuZCB0aW1lZCBvdXQhXFx1MDAzQ1xcdTAwMkZwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImVycm9yc1xcXCIgZGF0YS1ob29rPVxcXCJtb2RlbC1ydW4tZXJyb3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDcCBjbGFzcz1cXFwidGV4dC1kYW5nZXJcXFwiIGRhdGEtaG9vaz1cXFwibW9kZWwtcnVuLWVycm9yLW1lc3NhZ2VcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibW9kZWwtcnVuLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwic3Bpbm5lci1ib3JkZXJcXFwiIGRhdGEtaG9vaz1cXFwicGxvdC1sb2FkZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1zdGF0ZS1idXR0b25zLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWN0aW9uXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0QWR2YW5jZWRTcGVjaWUucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zd2l0Y2hpbmctdG9sXScgOiAnc2V0U3dpdGNoaW5nVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXN3aXRjaGluZy1taW5dJyA6ICdzZXRTd2l0Y2hpbmdUeXBlJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3BlY2llLW1vZGVdJyA6ICdzZXRTcGVjaWVzTW9kZScsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBvcHRpb25EaWN0ID0ge1wiY29udGludW91c1wiOlwiQ29uY2VudHJhdGlvblwiLCBcImRpc2NyZXRlXCI6XCJQb3B1bGF0aW9uXCIsIFwiZHluYW1pY1wiOlwiSHlicmlkIENvbmNlbnRyYXRpb24vUG9wdWxhdGlvblwifVxuICAgIHZhciBtb2RlU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdtb2RlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGVzOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IFsnQ29uY2VudHJhdGlvbicsJ1BvcHVsYXRpb24nLCdIeWJyaWQgQ29uY2VudHJhdGlvbi9Qb3B1bGF0aW9uJ10sXG4gICAgICB2YWx1ZTogb3B0aW9uRGljdFt0aGlzLm1vZGVsLm1vZGVdLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KG1vZGVTZWxlY3RWaWV3LCBcInNwZWNpZS1tb2RlXCIpXG4gICAgaWYodGhpcy5tb2RlbC5pc1N3aXRjaFRvbCl7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10b2wnKSkucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgIH1lbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctbWluJykpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICB9XG4gICAgdGhpcy50b2dnbGVTd2l0Y2hpbmdTZXR0aW5ncygpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2V0U3BlY2llc01vZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbHVlID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dFxuICAgIHZhciBtb2RlRGljdCA9IHtcIkNvbmNlbnRyYXRpb25cIjpcImNvbnRpbnVvdXNcIixcIlBvcHVsYXRpb25cIjpcImRpc2NyZXRlXCIsXCJIeWJyaWQgQ29uY2VudHJhdGlvbi9Qb3B1bGF0aW9uXCI6XCJkeW5hbWljXCJ9XG4gICAgdGhpcy5tb2RlbC5tb2RlID0gbW9kZURpY3RbdmFsdWVdXG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoJ3VwZGF0ZS1zcGVjaWVzJywgdGhpcy5tb2RlbC5jb21wSUQsIHRoaXMubW9kZWwsIGZhbHNlKTtcbiAgICB0aGlzLnRvZ2dsZVN3aXRjaGluZ1NldHRpbmdzKCk7XG4gIH0sXG4gIHNldFN3aXRjaGluZ1R5cGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5tb2RlbC5pc1N3aXRjaFRvbCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLXRvbCcpKS5pcyhcIjpjaGVja2VkXCIpO1xuICAgIHRoaXMudG9nZ2xlU3dpdGNoaW5nU2V0dGluZ3NJbnB1dCgpO1xuICB9LFxuICB0b2dnbGVTd2l0Y2hpbmdTZXR0aW5nc0lucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5tb2RlbC5pc1N3aXRjaFRvbCl7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10aHJlc2hvbGQnKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdG9sZXJhbmNlJykpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10b2xlcmFuY2UnKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdGhyZXNob2xkJykpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfVxuICB9LFxuICB0b2dnbGVTd2l0Y2hpbmdTZXR0aW5nczogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMubW9kZWwubW9kZSA9PT0gXCJkeW5hbWljXCIpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdG9sJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctbWluJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgdGhpcy50b2dnbGVTd2l0Y2hpbmdTZXR0aW5nc0lucHV0KCk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10b2wnKSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLW1pbicpKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdGhyZXNob2xkJykpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLXRvbGVyYW5jZScpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfVxuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0U3dpdGNoVG9sOiB7XG4gICAgICBob29rOiAnc3dpdGNoaW5nLXRvbGVyYW5jZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3N3aXRjaGluZy10b2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3N3aXRjaFRvbCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5zd2l0Y2hUb2wsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0U3dpdGNoTWluOiB7XG4gICAgICBob29rOiAnc3dpdGNoaW5nLXRocmVzaG9sZCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3N3aXRjaGluZy10aHJlc2hvbGQnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3N3aXRjaE1pbicsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5zd2l0Y2hNaW4sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRDdXN0b21TdG9pY2hTcGVjaWUucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0Vmlldy5leHRlbmQoe1xuICAvLyBTZWxlY3RWaWV3IGV4cGVjdHMgYSBzdHJpbmcgdGVtcGxhdGUsIHNvIHByZS1yZW5kZXIgaXRcbiAgdGVtcGxhdGU6IHRlbXBsYXRlKCksXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLnJhdGlvJyA6IHtcbiAgICAgIGhvb2s6ICdyYXRpbydcbiAgICB9XG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2Ugc2VsZWN0JyA6ICdzZWxlY3RDaGFuZ2VIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1pbmNyZW1lbnRdJyA6ICdoYW5kbGVJbmNyZW1lbnQnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWRlY3JlbWVudF0nIDogJ2hhbmRsZURlY3JlbWVudCcsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAnZGVsZXRlU3BlY2llJ1xuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXJncykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBTZWxlY3RWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMubW9kZWwuc3BlY2llIHx8IG51bGw7XG4gICAgdGhpcy5pc1JlYWN0YW50cyA9IHRoaXMucGFyZW50LnBhcmVudC5pc1JlYWN0YW50cztcbiAgICB0aGlzLnJlYWN0aW9uVHlwZSA9IHRoaXMucGFyZW50LnBhcmVudC5yZWFjdGlvblR5cGU7XG4gICAgdGhpcy5zdG9pY2hTcGVjaWVzID0gdGhpcy5wYXJlbnQucGFyZW50LmNvbGxlY3Rpb247XG4gICAgdGhpcy5zdG9pY2hTcGVjaWVzLm9uKCdhZGQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnRvZ2dsZUluY3JlbWVudEJ1dHRvbigpO1xuICAgIH0pO1xuICAgIHRoaXMuc3RvaWNoU3BlY2llcy5vbigncmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi50b2dnbGVJbmNyZW1lbnRCdXR0b24oKTtcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgU2VsZWN0Vmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMpO1xuICAgIHRoaXMudG9nZ2xlSW5jcmVtZW50QnV0dG9uKCk7XG4gICAgdGhpcy50b2dnbGVEZWNyZW1lbnRCdXR0b24oKTtcbiAgfSxcbiAgc2VsZWN0Q2hhbmdlSGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMuZ2V0U3BlY2llc0NvbGxlY3Rpb24oKTtcbiAgICB2YXIgcmVhY3Rpb25zID0gdGhpcy5nZXRSZWFjdGlvbnNDb2xsZWN0aW9uKCk7XG4gICAgdmFyIHNwZWNpZSA9IHNwZWNpZXMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICByZXR1cm4gbS5uYW1lID09PSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIH0pWzBdO1xuICAgIHRoaXMubW9kZWwuc3BlY2llID0gc3BlY2llO1xuICAgIHRoaXMudmFsdWUgPSBzcGVjaWU7XG4gICAgcmVhY3Rpb25zLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC50cmlnZ2VyKCdjaGFuZ2UtcmVhY3Rpb24nKVxuICB9LFxuICBnZXRTcGVjaWVzQ29sbGVjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXM7XG4gIH0sXG4gIGdldFJlYWN0aW9uc0NvbGxlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uO1xuICB9LFxuICBoYW5kbGVJbmNyZW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLnZhbGlkYXRlUmF0aW9JbmNyZW1lbnQoKSl7XG4gICAgICB0aGlzLm1vZGVsLnJhdGlvKys7XG4gICAgICB0aGlzLnRvZ2dsZUluY3JlbWVudEJ1dHRvbigpO1xuICAgICAgdGhpcy5wYXJlbnQucGFyZW50LnRvZ2dsZUFkZFNwZWNpZUJ1dHRvbigpO1xuICAgICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC50cmlnZ2VyKCdjaGFuZ2UtcmVhY3Rpb24nKVxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZURlY3JlbWVudEJ1dHRvbigpO1xuICB9LFxuICB2YWxpZGF0ZVJhdGlvSW5jcmVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5zdG9pY2hTcGVjaWVzLmxlbmd0aCA8IDIgJiYgdGhpcy5tb2RlbC5yYXRpbyA8IDIpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBpZih0aGlzLnJlYWN0aW9uVHlwZSAhPT0gJ2N1c3RvbS1tYXNzYWN0aW9uJylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGlmKCF0aGlzLmlzUmVhY3RhbnRzKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICB0b2dnbGVJbmNyZW1lbnRCdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICBpZighdGhpcy52YWxpZGF0ZVJhdGlvSW5jcmVtZW50KCkpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdpbmNyZW1lbnQnKSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9ZWxzZXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnaW5jcmVtZW50JykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIH1cbiAgfSxcbiAgdG9nZ2xlRGVjcmVtZW50QnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5tb2RlbC5yYXRpbyA8PSAxKVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdkZWNyZW1lbnQnKSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICBlbHNlXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2RlY3JlbWVudCcpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgfSxcbiAgaGFuZGxlRGVjcmVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5yYXRpby0tO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgICB0aGlzLnRvZ2dsZURlY3JlbWVudEJ1dHRvbigpO1xuICAgIGlmKHRoaXMudmFsaWRhdGVSYXRpb0luY3JlbWVudCgpKXtcbiAgICAgIHRoaXMudG9nZ2xlSW5jcmVtZW50QnV0dG9uKCk7XG4gICAgICB0aGlzLnBhcmVudC5wYXJlbnQudG9nZ2xlQWRkU3BlY2llQnV0dG9uKCk7XG4gICAgfVxuICB9LFxuICBkZWxldGVTcGVjaWU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnRyaWdnZXIoJ2NoYW5nZS1yZWFjdGlvbicpXG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVN0b2ljaFNwZWNpZSh0aGlzLm1vZGVsKTtcbiAgICB0aGlzLnBhcmVudC5wYXJlbnQudG9nZ2xlQWRkU3BlY2llQnV0dG9uKCk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRFdmVudEFzc2lnbm1lbnQucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ3JlbW92ZUFzc2lnbm1lbnQnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1ldmVudC1hc3NpZ25tZW50LXZhcmlhYmxlXScgOiAnc2VsZWN0QXNzaWdubWVudFZhcmlhYmxlJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHZhciB2YXJpYWJsZVNlbGVjdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAndmFyaWFibGUnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZXM6ICdjaWQnLFxuICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnZhcmlhYmxlLm5hbWUsXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodmFyaWFibGVTZWxlY3RWaWV3LCAnZXZlbnQtYXNzaWdubWVudC12YXJpYWJsZScpO1xuICAgIHZhciBpbnB1dEZpZWxkID0gdGhpcy5xdWVyeUJ5SG9vaygnZXZlbnQtYXNzaWdubWVudC1FeHByZXNzaW9uJykuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMV07XG4gICAgJChpbnB1dEZpZWxkKS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgXCItLS1ObyBFeHByZXNzaW9uIEVudGVyZWQtLS1cIik7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW1vdmVBc3NpZ25tZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlRXZlbnRBc3NpZ25tZW50KHRoaXMubW9kZWwpXG4gIH0sXG4gIGdldE9wdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcztcbiAgICB2YXIgcGFyYW1ldGVycyA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycztcbiAgICB2YXIgc3BlY2llc05hbWVzID0gc3BlY2llcy5tYXAoZnVuY3Rpb24gKHNwZWNpZSkgeyByZXR1cm4gc3BlY2llLm5hbWUgfSk7XG4gICAgdmFyIHBhcmFtZXRlck5hbWVzID0gcGFyYW1ldGVycy5tYXAoZnVuY3Rpb24gKHBhcmFtZXRlcikgeyByZXR1cm4gcGFyYW1ldGVyLm5hbWUgfSk7XG4gICAgcmV0dXJuIHNwZWNpZXNOYW1lcy5jb25jYXQocGFyYW1ldGVyTmFtZXMpO1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBzZWxlY3RBc3NpZ25tZW50VmFyaWFibGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXM7XG4gICAgdmFyIHBhcmFtZXRlcnMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnM7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIGV2ZW50VmFyID0gc3BlY2llcy5maWx0ZXIoZnVuY3Rpb24gKHNwZWNpZSkge1xuICAgICAgaWYoc3BlY2llLm5hbWUgPT09IHZhbCkge1xuICAgICAgICByZXR1cm4gc3BlY2llO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKCFldmVudFZhci5sZW5ndGgpIHtcbiAgICAgIGV2ZW50VmFyID0gcGFyYW1ldGVycy5maWx0ZXIoZnVuY3Rpb24gKHBhcmFtZXRlcikge1xuICAgICAgICBpZihwYXJhbWV0ZXIubmFtZSA9PT0gdmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmFtZXRlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMubW9kZWwudmFyaWFibGUgPSBldmVudFZhclswXTtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24udHJpZ2dlcignY2hhbmdlJyk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXRBc3NpZ25tZW50RXhwcmVzc2lvbjoge1xuICAgICAgaG9vazogJ2V2ZW50LWFzc2lnbm1lbnQtRXhwcmVzc2lvbicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2V2ZW50LWFzc2lnbm1lbnQtZXhwcmVzc2lvbicsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ2V4cHJlc3Npb24nLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZXhwcmVzc2lvbixcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0RnVuY3Rpb25EZWZpbml0aW9uLnB1ZycpO1xuXG5sZXQgZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbk1vZGFsSHRtbCA9IChmdW5jdGlvbkRlZmluaXRpb25OYW1lLCBhbm5vdGF0aW9uKSA9PiB7XG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cImZ1bmN0aW9uRGVmaW5pdGlvbkFubm90YXRpb25Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+QW5ub3RhdGlvbiBmb3IgJHtmdW5jdGlvbkRlZmluaXRpb25OYW1lfTwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8c3BhbiBmb3I9XCJmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uSW5wdXRcIj5Bbm5vdGF0aW9uOiA8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImZ1bmN0aW9uRGVmaW5pdGlvbkFubm90YXRpb25JbnB1dFwiIG5hbWU9XCJmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uSW5wdXRcIiBzaXplPVwiMzBcIiBhdXRvZm9jdXMgdmFsdWU9XCIke2Fubm90YXRpb259XCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgb2stbW9kZWwtYnRuXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAncmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LWFubm90YXRpb24tYnRuXScgOiAnZWRpdEFubm90YXRpb24nLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICBlZGl0QW5ub3RhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbmFtZSA9IHRoaXMubW9kZWwubmFtZTtcbiAgICB2YXIgYW5ub3RhdGlvbiA9IHRoaXMubW9kZWwuYW5ub3RhdGlvbjtcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbk1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uTW9kYWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgbGV0IG1vZGFsID0gJChmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uTW9kYWxIdG1sKG5hbWUsIGFubm90YXRpb24pKS5tb2RhbCgpO1xuICAgIGxldCBva0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uTW9kYWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uTW9kYWwgI2Z1bmN0aW9uRGVmaW5pdGlvbkFubm90YXRpb25JbnB1dCcpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT09IDEzKXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb2tCdG4uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBva0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLm1vZGVsLmFubm90YXRpb24gPSBpbnB1dC52YWx1ZTtcbiAgICAgIHNlbGYucGFyZW50LnJlbmRlckVkaXJGdW5jdGlvbkRlZmluaXRpb25WaWV3KCk7XG4gICAgICBtb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgIH0pO1xuICB9LFxuICByZW1vdmVGdW5jdGlvbkRlZmluaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucmVtb3ZlKHRoaXMubW9kZWwpO1xuICB9LFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbnZhciBTY2F0dGVyRGV0YWlscyA9IHJlcXVpcmUoJy4vZWRpdC1zY2F0dGVyLWRldGFpbHMnKTtcbnZhciBQbGFjZURldGFpbHMgPSByZXF1aXJlKCcuL2VkaXQtcGxhY2UtZGV0YWlscycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0SW5pdGlhbENvbmRpdGlvbi5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAncmVtb3ZlSW5pdGlhbENvbmRpdGlvbicsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWluaXRpYWwtY29uZGl0aW9uLXR5cGVdJyA6ICdzZWxlY3RJbml0aWFsQ29uZGl0aW9uVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWluaXRpYWwtY29uZGl0aW9uLXNwZWNpZXNdJyA6ICdzZWxlY3RJbml0aWFsQ29uZGl0aW9uU3BlY2llcycsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvcHRpb25zID0gWydTY2F0dGVyJywgJ1BsYWNlJywgJ0Rpc3RyaWJ1dGUgVW5pZm9ybWx5IHBlciBWb3hlbCddO1xuICAgIHZhciB0eXBlU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICd0eXBlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGVzOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICB2YWx1ZTogc2VsZi5tb2RlbC50eXBlLFxuICAgIH0pO1xuICAgIHZhciBzcGVjaWVzU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdzcGVjaWUnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICB0ZXh0QXR0cmlidXRlOiAnbmFtZScsXG4gICAgICBlYWdlclZhbGlkYXRlOiB0cnVlLFxuICAgICAgb3B0aW9uczogdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLFxuICAgICAgLy8gRm9yIG5ldyByZWFjdGlvbnMgKHdpdGggbm8gcmF0ZS5uYW1lKSBqdXN0IHVzZSB0aGUgZmlyc3QgcGFyYW1ldGVyIGluIHRoZSBQYXJhbWV0ZXJzIGNvbGxlY3Rpb25cbiAgICAgIC8vIEVsc2UgZmV0Y2ggdGhlIHJpZ2h0IFBhcmFtZXRlciBmcm9tIFBhcmFtZXRlcnMgYmFzZWQgb24gZXhpc3RpbmcgcmF0ZVxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwuc3BlY2llLm5hbWUgPyB0aGlzLmdldFNwZWNpZUZyb21TcGVjaWVzKHRoaXMubW9kZWwuc3BlY2llLm5hbWUpIDogdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLmF0KDApLFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyRGV0YWlsc1ZpZXcoKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0eXBlU2VsZWN0VmlldywgJ2luaXRpYWwtY29uZGl0aW9uLXR5cGUnKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzcGVjaWVzU2VsZWN0VmlldywgJ2luaXRpYWwtY29uZGl0aW9uLXNwZWNpZXMnKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIHJlbmRlckRldGFpbHNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5kZXRhaWxzVmlldykge1xuICAgICAgdGhpcy5kZXRhaWxzVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdmFyIEluaXRpYWxDb25kaXRpb25EZXRhaWxzID0gdGhpcy5tb2RlbC50eXBlID09PSAnUGxhY2UnID8gUGxhY2VEZXRhaWxzIDogU2NhdHRlckRldGFpbHNcbiAgICB0aGlzLmRldGFpbHNWaWV3ID0gbmV3IEluaXRpYWxDb25kaXRpb25EZXRhaWxzKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMuY29sbGVjdGlvbixcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuZGV0YWlsc1ZpZXcsICdpbml0aWFsLWNvbmRpdGlvbi1kZXRhaWxzJyk7XG4gIH0sXG4gIGdldFNwZWNpZUZyb21TcGVjaWVzOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLmZpbHRlcihmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICByZXR1cm4gc3BlY2llLm5hbWUgPT09IG5hbWU7XG4gICAgfSlbMF07XG4gICAgcmV0dXJuIHNwZWNpZXM7XG4gIH0sXG4gIHJlbW92ZUluaXRpYWxDb25kaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlSW5pdGlhbENvbmRpdGlvbih0aGlzLm1vZGVsKTtcbiAgfSxcbiAgc2VsZWN0SW5pdGlhbENvbmRpdGlvblR5cGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGN1cnJlbnRUeXBlID0gdGhpcy5tb2RlbC50eXBlO1xuICAgIHZhciBuZXdUeXBlID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB0aGlzLm1vZGVsLnR5cGUgPSBuZXdUeXBlO1xuICAgIGlmKGN1cnJlbnRUeXBlID09PSBcIlBsYWNlXCIgfHwgbmV3VHlwZSA9PT0gXCJQbGFjZVwiKXtcbiAgICAgIHRoaXMucmVuZGVyRGV0YWlsc1ZpZXcoKTtcbiAgICB9XG4gIH0sXG4gIHNlbGVjdEluaXRpYWxDb25kaXRpb25TcGVjaWVzOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBuYW1lID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB2YXIgc3BlY2llID0gdGhpcy5nZXRTcGVjaWVGcm9tU3BlY2llcyhuYW1lKTtcbiAgICB0aGlzLm1vZGVsLnNwZWNpZSA9IHNwZWNpZSB8fCB0aGlzLm1vZGVsLnNwZWNpZTtcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0UmVhY3Rpb25WYXIucHVnJyk7XG5cbmxldCBwYXJhbWV0ZXJBbm5vdGF0aW9uTW9kYWxIdG1sID0gKHBhcmFtZXRlck5hbWUsIGFubm90YXRpb24pID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwicGFyYW1ldGVyQW5ub3RhdGlvbk1vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5Bbm5vdGF0aW9uIGZvciAke3BhcmFtZXRlck5hbWV9PC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxzcGFuIGZvcj1cInBhcmFtZXRlckFubm90YXRpb25JbnB1dFwiPkFubm90YXRpb246IDwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicGFyYW1ldGVyQW5ub3RhdGlvbklucHV0XCIgbmFtZT1cInBhcmFtZXRlckFubm90YXRpb25JbnB1dFwiIHNpemU9XCIzMFwiIGF1dG9mb2N1cyB2YWx1ZT1cIiR7YW5ub3RhdGlvbn1cIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBvay1tb2RlbC1idG5cIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5pblVzZSc6IHtcbiAgICAgIGhvb2s6ICdyZW1vdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2Rpc2FibGVkJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LWFubm90YXRpb24tYnRuXScgOiAnZWRpdEFubm90YXRpb24nLFxuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ3JlbW92ZVBhcmFtZXRlcicsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWlucHV0LW5hbWUtY29udGFpbmVyXScgOiAnc2V0UGFyYW1ldGVyTmFtZScsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgJChkb2N1bWVudCkub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJ1thdXRvZm9jdXNdJywgZS50YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgaWYoIXRoaXMubW9kZWwuYW5ub3RhdGlvbil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2VkaXQtYW5ub3RhdGlvbi1idG4nKSkudGV4dCgnQWRkJylcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW1vdmVQYXJhbWV0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmVQYXJhbWV0ZXIodGhpcy5tb2RlbCk7XG4gIH0sXG4gIGVkaXRBbm5vdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBuYW1lID0gdGhpcy5tb2RlbC5uYW1lO1xuICAgIHZhciBhbm5vdGF0aW9uID0gdGhpcy5tb2RlbC5hbm5vdGF0aW9uO1xuICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYXJhbWV0ZXJBbm5vdGF0aW9uTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhcmFtZXRlckFubm90YXRpb25Nb2RhbCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKHBhcmFtZXRlckFubm90YXRpb25Nb2RhbEh0bWwobmFtZSwgYW5ub3RhdGlvbikpLm1vZGFsKCk7XG4gICAgbGV0IG9rQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhcmFtZXRlckFubm90YXRpb25Nb2RhbCAub2stbW9kZWwtYnRuJyk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhcmFtZXRlckFubm90YXRpb25Nb2RhbCAjcGFyYW1ldGVyQW5ub3RhdGlvbklucHV0Jyk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PT0gMTMpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBva0J0bi5jbGljaygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9rQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYubW9kZWwuYW5ub3RhdGlvbiA9IGlucHV0LnZhbHVlO1xuICAgICAgc2VsZi5wYXJlbnQucmVuZGVyRWRpdFBhcmFtZXRlcigpO1xuICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICB9KTtcbiAgfSxcbiAgc2V0UGFyYW1ldGVyTmFtZTogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm1vZGVsLm5hbWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24udHJpZ2dlcigndXBkYXRlLXBhcmFtZXRlcnMnLCB0aGlzLm1vZGVsLmNvbXBJRCwgdGhpcy5tb2RlbCk7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoJ3JlbW92ZScpXG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXROYW1lOiB7XG4gICAgICBob29rOiAnaW5wdXQtbmFtZS1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLm5hbWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFZhbHVlOiB7XG4gICAgICBob29rOiAnaW5wdXQtdmFsdWUtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnZXhwcmVzc2lvbicsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ2V4cHJlc3Npb24nLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZXhwcmVzc2lvbixcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0UGxhY2VEZXRhaWxzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5jb3VudCc6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBob29rOiAnY291bnQtY29udGFpbmVyJyxcbiAgICB9LFxuICAgICdtb2RlbC54Jzoge1xuICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgIGhvb2s6ICd4LWNvbnRhaW5lcicsXG4gICAgfSxcbiAgICAnbW9kZWwueSc6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBob29rOiAneS1jb250YWluZXInLFxuICAgIH0sXG4gICAgJ21vZGVsLnonOiB7XG4gICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgaG9vazogJ3otY29udGFpbmVyJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXRDb3VudDoge1xuICAgICAgaG9vazogJ2NvdW50LWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2NvdW50JyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdjb3VudCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5jb3VudCxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRYOiB7XG4gICAgICBob29rOiAneC1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVzOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdYJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICd4JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLngsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0WToge1xuICAgICAgaG9vazogJ3ktY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnWScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAneScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC55LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFo6IHtcbiAgICAgIGhvb2s6ICd6LWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ1onLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3onLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwueSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRSdWxlLnB1ZycpO1xuXG5sZXQgcnVsZUFubm90YXRpb25Nb2RhbEh0bWwgPSAocnVsZU5hbWUsIGFubm90YXRpb24pID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwicnVsZUFubm90YXRpb25Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+QW5ub3RhdGlvbiBmb3IgJHtydWxlTmFtZX08L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgPHNwYW4gZm9yPVwicnVsZUFubm90YXRpb25JbnB1dFwiPkFubm90YXRpb246IDwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicnVsZUFubm90YXRpb25JbnB1dFwiIG5hbWU9XCJydWxlQW5ub3RhdGlvbklucHV0XCIgc2l6ZT1cIjMwXCIgYXV0b2ZvY3VzIHZhbHVlPVwiJHthbm5vdGF0aW9ufVwiPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IG9rLW1vZGVsLWJ0blwiPk9LPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1ydWxlLXR5cGVdJyA6ICdzZWxlY3RSdWxlVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXJ1bGUtdmFyaWFibGVdJyA6ICdzZWxlY3RSdWxlVmFyaWFibGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtYW5ub3RhdGlvbi1idG5dJyA6ICdlZGl0QW5ub3RhdGlvbicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAncmVtb3ZlUnVsZScsXG4gIH0sXG4gIGluaXRpYWlsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFpbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIHZhciBpbnB1dEZpZWxkID0gdGhpcy5xdWVyeUJ5SG9vaygncnVsZS1leHByZXNzaW9uJykuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMV07XG4gICAgJChpbnB1dEZpZWxkKS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgXCItLS1ObyBFeHByZXNzaW9uIEVudGVyZWQtLS1cIik7XG4gICAgdmFyIHZhck9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICB2YXIgdHlwZU9wdGlvbnMgPSBbJ1JhdGUgUnVsZScsICdBc3NpZ25tZW50IFJ1bGUnXVxuICAgIHZhciB0eXBlU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICd0eXBlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGVzOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IHR5cGVPcHRpb25zLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwudHlwZSxcbiAgICB9KTtcbiAgICB2YXIgdmFyaWFibGVTZWxlY3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGVzOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IHZhck9wdGlvbnMsXG4gICAgICB2YWx1ZTogdGhpcy5tb2RlbC52YXJpYWJsZS5uYW1lLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHR5cGVTZWxlY3RWaWV3LCBcInJ1bGUtdHlwZVwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh2YXJpYWJsZVNlbGVjdFZpZXcsICdydWxlLXZhcmlhYmxlJyk7XG4gICAgJChkb2N1bWVudCkub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJ1thdXRvZm9jdXNdJywgZS50YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgaWYoIXRoaXMubW9kZWwuYW5ub3RhdGlvbil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2VkaXQtYW5ub3RhdGlvbi1idG4nKSkudGV4dCgnQWRkJylcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgZWRpdEFubm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLm1vZGVsLm5hbWU7XG4gICAgdmFyIGFubm90YXRpb24gPSB0aGlzLm1vZGVsLmFubm90YXRpb247XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3J1bGVBbm5vdGF0aW9uTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3J1bGVBbm5vdGF0aW9uTW9kYWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgbGV0IG1vZGFsID0gJChydWxlQW5ub3RhdGlvbk1vZGFsSHRtbChuYW1lLCBhbm5vdGF0aW9uKSkubW9kYWwoKTtcbiAgICBsZXQgb2tCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcnVsZUFubm90YXRpb25Nb2RhbCAub2stbW9kZWwtYnRuJyk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3J1bGVBbm5vdGF0aW9uTW9kYWwgI3J1bGVBbm5vdGF0aW9uSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5tb2RlbC5hbm5vdGF0aW9uID0gaW5wdXQudmFsdWU7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJSdWxlcygpO1xuICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0T3B0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzO1xuICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzO1xuICAgIHZhciBzcGVjaWVzTmFtZXMgPSBzcGVjaWVzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7IHJldHVybiBzcGVjaWUubmFtZSB9KTtcbiAgICB2YXIgcGFyYW1ldGVyTmFtZXMgPSBwYXJhbWV0ZXJzLm1hcChmdW5jdGlvbiAocGFyYW1ldGVyKSB7IHJldHVybiBwYXJhbWV0ZXIubmFtZSB9KTtcbiAgICByZXR1cm4gc3BlY2llc05hbWVzLmNvbmNhdChwYXJhbWV0ZXJOYW1lcyk7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIHNlbGVjdFJ1bGVUeXBlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0eXBlID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB0aGlzLm1vZGVsLnR5cGUgPSB0eXBlO1xuICB9LFxuICBzZWxlY3RSdWxlVmFyaWFibGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXM7XG4gICAgdmFyIHBhcmFtZXRlcnMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnM7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHJ1bGVWYXIgPSBzcGVjaWVzLmZpbHRlcihmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICBpZihzcGVjaWUubmFtZSA9PT0gdmFsKSB7XG4gICAgICAgIHJldHVybiBzcGVjaWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoIXJ1bGVWYXIubGVuZ3RoKSB7XG4gICAgICBydWxlVmFyID0gcGFyYW1ldGVycy5maWx0ZXIoZnVuY3Rpb24gKHBhcmFtZXRlcikge1xuICAgICAgICBpZihwYXJhbWV0ZXIubmFtZSA9PT0gdmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmFtZXRlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMubW9kZWwudmFyaWFibGUgPSBydWxlVmFyWzBdO1xuICB9LFxuICByZW1vdmVSdWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnJlbW92ZVJ1bGUodGhpcy5tb2RlbCk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXROYW1lOiB7XG4gICAgICBob29rOiAncnVsZS1uYW1lJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcgKHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3J1bGUtbmFtZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy5uYW1lVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICduYW1lJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLm5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0UnVsZToge1xuICAgICAgaG9vazogJ3J1bGUtZXhwcmVzc2lvbicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3ICh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAncnVsZS1leHByZXNzaW9uJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6ICcnLFxuICAgICAgICAgIG1vZGVsS2V5OiAnZXhwcmVzc2lvbicsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5leHByZXNzaW9uLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0U2NhdHRlckRldGFpbHMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmNvdW50Jzoge1xuICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgIGhvb2s6ICdjb3VudC1jb250YWluZXInLFxuICAgIH0sXG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zdWJkb21haW4tY29udGFpbmVyXScgOiAnc2VsZWN0SW5pdGlhbENvbmRpdGlvblN1YmRvbWFpbicsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHN1YmRvbWFpblNlbGVjdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnc3ViZG9tYWluJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgdGV4dEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgZWFnZXJWYWxpZGF0ZTogdHJ1ZSxcbiAgICAgIG9wdGlvbnM6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMsXG4gICAgICB2YWx1ZTogdGhpcy5tb2RlbC5zdWJkb21haW4gPyB0aGlzLmdldFN1YmRvbWFpbkZyb21TdWJkb21haW5zKHRoaXMubW9kZWwuc3ViZG9tYWluKSA6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMuYXQoMClcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzdWJkb21haW5TZWxlY3RWaWV3LCAnc3ViZG9tYWluLWNvbnRhaW5lcicpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2VsZWN0SW5pdGlhbENvbmRpdGlvblN1YmRvbWFpbjogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgbmFtZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHN1YmRvbWFpbiA9IHRoaXMuZ2V0U3ViZG9tYWluRnJvbVN1YmRvbWFpbnMobmFtZSk7XG4gICAgdGhpcy5tb2RlbC5zdWJkb21haW4gPSBzdWJkb21haW4ubmFtZSB8fCB0aGlzLm1vZGVsLnN1YmRvbWFpbjtcbiAgfSxcbiAgZ2V0U3ViZG9tYWluRnJvbVN1YmRvbWFpbnM6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHN1YmRvbWFpbiA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMubW9kZWxzLmZpbHRlcihmdW5jdGlvbiAoc3ViZG9tYWluKSB7XG4gICAgICByZXR1cm4gc3ViZG9tYWluLm5hbWUgPT09IG5hbWU7XG4gICAgfSlbMF07XG4gICAgcmV0dXJuIHN1YmRvbWFpbjtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dENvdW50OiB7XG4gICAgICBob29rOiAnY291bnQtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnY291bnQnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ2NvdW50JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmNvdW50LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTdWJkb21haW5zVmlldyA9IHJlcXVpcmUoJy4vc3ViZG9tYWluJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRTcGF0aWFsU3BlY2llLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5pblVzZSc6IHtcbiAgICAgIGhvb2s6ICdyZW1vdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2Rpc2FibGVkJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZW1vdmVdJyA6ICdyZW1vdmVTcGVjaWUnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5iYXNlTW9kZWwgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgIHRoaXMuYmFzZU1vZGVsLm9uKCdtZXNoLXVwZGF0ZScsIHRoaXMudXBkYXRlRGVmYXVsdFN1YmRvbWFpbnMsIHRoaXMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlclN1YmRvbWFpbnMoKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlbW92ZVNwZWNpZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVNwZWNpZSh0aGlzLm1vZGVsKTtcbiAgfSxcbiAgdXBkYXRlRGVmYXVsdFN1YmRvbWFpbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLnN1YmRvbWFpbnMgPSB0aGlzLmJhc2VNb2RlbC5tZXNoU2V0dGluZ3MudW5pcXVlU3ViZG9tYWlucy5tYXAoZnVuY3Rpb24gKG1vZGVsKSB7cmV0dXJuIG1vZGVsLm5hbWU7IH0pO1xuICAgIHRoaXMucmVuZGVyU3ViZG9tYWlucygpO1xuICB9LFxuICByZW5kZXJTdWJkb21haW5zOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5zdWJkb21haW5zVmlldylcbiAgICAgIHRoaXMuc3ViZG9tYWluc1ZpZXcucmVtb3ZlKCk7XG4gICAgdmFyIHN1YmRvbWFpbnMgPSB0aGlzLmJhc2VNb2RlbC5tZXNoU2V0dGluZ3MudW5pcXVlU3ViZG9tYWlucztcbiAgICB0aGlzLnN1YmRvbWFpbnNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgc3ViZG9tYWlucyxcbiAgICAgIFN1YmRvbWFpbnNWaWV3LFxuICAgICAgdGhpcy5xdWVyeUJ5SG9vaygnc3ViZG9tYWlucycpXG4gICAgKTtcbiAgfSxcbiAgdXBkYXRlU3ViZG9tYWluczogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICBpZihlbGVtZW50Lm5hbWUgPT0gJ3N1YmRvbWFpbicpIHtcbiAgICAgIHZhciBzdWJkb21haW4gPSBlbGVtZW50LnZhbHVlLm1vZGVsO1xuICAgICAgdmFyIGNoZWNrZWQgPSBlbGVtZW50LnZhbHVlLmNoZWNrZWQ7XG4gICAgICBpZihjaGVja2VkKVxuICAgICAgICB0aGlzLm1vZGVsLnN1YmRvbWFpbnMgPSBfLnVuaW9uKHRoaXMubW9kZWwuc3ViZG9tYWlucywgW3N1YmRvbWFpbi5uYW1lXSk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMubW9kZWwuc3ViZG9tYWlucyA9IF8uZGlmZmVyZW5jZSh0aGlzLm1vZGVsLnN1YmRvbWFpbnMsIFtzdWJkb21haW4ubmFtZV0pO1xuICAgIH1cbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dE5hbWU6IHtcbiAgICAgIGhvb2s6ICdpbnB1dC1uYW1lLWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMubmFtZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnbmFtZScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFZhbHVlOiB7XG4gICAgICBob29rOiAnaW5wdXQtZGlmZnVzaW9uLWNvZWZmLWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2RpZmZ1c2lvbiBjb2VmZicsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnZGlmZnVzaW9uQ29lZmYnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZGlmZnVzaW9uQ29lZmYsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRSZWFjdGlvblZhci5wdWcnKTtcblxubGV0IHNwZWNpZXNBbm5vdGF0aW9uTW9kYWxIdG1sID0gKHNwZWNpZXNOYW1lLCBhbm5vdGF0aW9uKSA9PiB7XG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cInNwZWNpZXNBbm5vdGF0aW9uTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkFubm90YXRpb24gZm9yICR7c3BlY2llc05hbWV9PC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxzcGFuIGZvcj1cInNwZWNpZXNBbm5vdGF0aW9uSW5wdXRcIj5Bbm5vdGF0aW9uOiA8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInNwZWNpZXNBbm5vdGF0aW9uSW5wdXRcIiBuYW1lPVwic3BlY2llc0Fubm90YXRpb25JbnB1dFwiIHNpemU9XCIzMFwiIGF1dG9mb2N1cyB2YWx1ZT1cIiR7YW5ub3RhdGlvbn1cIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBvay1tb2RlbC1idG5cIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5pblVzZSc6IHtcbiAgICAgIGhvb2s6ICdyZW1vdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2Rpc2FibGVkJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LWFubm90YXRpb24tYnRuXScgOiAnZWRpdEFubm90YXRpb24nLFxuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ3JlbW92ZVNwZWNpZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWlucHV0LW5hbWUtY29udGFpbmVyXScgOiAnc2V0U3BlY2llc05hbWUnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKCdbYXV0b2ZvY3VzXScsIGUudGFyZ2V0KS5mb2N1cygpO1xuICAgIH0pO1xuICAgIGlmKCF0aGlzLm1vZGVsLmFubm90YXRpb24pe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdlZGl0LWFubm90YXRpb24tYnRuJykpLnRleHQoJ0FkZCcpXG4gICAgfVxuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIHJlbW92ZVNwZWNpZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVNwZWNpZSh0aGlzLm1vZGVsKTtcbiAgfSxcbiAgc2V0U3BlY2llc05hbWU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5tb2RlbC5uYW1lID0gZS50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoJ3VwZGF0ZS1zcGVjaWVzJywgdGhpcy5tb2RlbC5jb21wSUQsIHRoaXMubW9kZWwsIHRydWUpO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi50cmlnZ2VyKCdyZW1vdmUnKTtcbiAgfSxcbiAgZWRpdEFubm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLm1vZGVsLm5hbWU7XG4gICAgdmFyIGFubm90YXRpb24gPSB0aGlzLm1vZGVsLmFubm90YXRpb247XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NwZWNpZXNBbm5vdGF0aW9uTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NwZWNpZXNBbm5vdGF0aW9uTW9kYWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgbGV0IG1vZGFsID0gJChzcGVjaWVzQW5ub3RhdGlvbk1vZGFsSHRtbChuYW1lLCBhbm5vdGF0aW9uKSkubW9kYWwoKTtcbiAgICBsZXQgb2tCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3BlY2llc0Fubm90YXRpb25Nb2RhbCAub2stbW9kZWwtYnRuJyk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NwZWNpZXNBbm5vdGF0aW9uTW9kYWwgI3NwZWNpZXNBbm5vdGF0aW9uSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5tb2RlbC5hbm5vdGF0aW9uID0gaW5wdXQudmFsdWU7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJFZGl0U3BlY2llc1ZpZXcoKTtcbiAgICAgIG1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgfSk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXROYW1lOiB7XG4gICAgICBob29rOiAnaW5wdXQtbmFtZS1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLm5hbWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFZhbHVlOiB7XG4gICAgICBob29rOiAnaW5wdXQtdmFsdWUtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAndmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3ZhbHVlJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0U3RvaWNoU3BlY2llLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdFZpZXcuZXh0ZW5kKHtcbiAgLy8gU2VsZWN0VmlldyBleHBlY3RzIGEgc3RyaW5nIHRlbXBsYXRlLCBzbyBwcmUtcmVuZGVyIGl0XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSgpLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5yYXRpbycgOiB7XG4gICAgICBob29rOiAncmF0aW8nXG4gICAgfVxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIHNlbGVjdCcgOiAnc2VsZWN0Q2hhbmdlSGFuZGxlcidcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIFNlbGVjdFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5tb2RlbC5zcGVjaWUgfHwgbnVsbDtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBTZWxlY3RWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHNlbGVjdENoYW5nZUhhbmRsZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLmdldFNwZWNpZXNDb2xsZWN0aW9uKCk7XG4gICAgdmFyIHJlYWN0aW9ucyA9IHRoaXMuZ2V0UmVhY3Rpb25zQ29sbGVjdGlvbigpO1xuICAgIHZhciBzcGVjaWUgPSBzcGVjaWVzLmZpbHRlcihmdW5jdGlvbiAobSkge1xuICAgICAgcmV0dXJuIG0ubmFtZSA9PT0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB9KVswXTtcbiAgICB0aGlzLm1vZGVsLnNwZWNpZSA9IHNwZWNpZTtcbiAgICB0aGlzLnZhbHVlID0gc3BlY2llO1xuICAgIHJlYWN0aW9ucy50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgfSxcbiAgZ2V0UmVhY3Rpb25zQ29sbGVjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb247XG4gIH0sXG4gIGdldFNwZWNpZXNDb2xsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcztcbiAgfSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBFZGl0RXZlbnRBc3NpZ25tZW50ID0gcmVxdWlyZSgnLi9lZGl0LWV2ZW50LWFzc2lnbm1lbnQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRBc3NpZ25tZW50c0VkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9YWRkLWV2ZW50LWFzc2lnbm1lbnRdJyA6ICdhZGRBc3NpZ25tZW50JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICBFZGl0RXZlbnRBc3NpZ25tZW50LFxuICAgICAgdGhpcy5xdWVyeUJ5SG9vaygnZXZlbnQtYXNzaWdubWVudHMtY29udGFpbmVyJylcbiAgICApO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgYWRkQXNzaWdubWVudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5hZGRFdmVudEFzc2lnbm1lbnQoKTtcbiAgfSxcbn0pIiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgRXZlbnRBc3NpZ25tZW50ID0gcmVxdWlyZSgnLi9ldmVudC1hc3NpZ25tZW50cy1lZGl0b3InKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnREZXRhaWxzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5pbml0aWFsVmFsdWUnOiB7XG4gICAgICBob29rOiAnZXZlbnQtdHJpZ2dlci1pbml0LXZhbHVlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjaGVja2VkJyxcbiAgICB9LFxuICAgICdtb2RlbC5wZXJzaXN0ZW50Jzoge1xuICAgICAgaG9vazogJ2V2ZW50LXRyaWdnZXItcGVyc2lzdGVudCcsXG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY2hlY2tlZCcsXG4gICAgfSxcbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWV2ZW50LXRyaWdnZXItaW5pdC12YWx1ZV0nIDogJ3NldFRyaWdnZXJJbml0aWFsVmFsdWUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1ldmVudC10cmlnZ2VyLXBlcnNpc3RlbnRdJyA6ICdzZXRUcmlnZ2VyUGVyc2lzdGVudCcsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXRyaWdnZXItdGltZV0nIDogJ3NldFVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWFzc2lnbm1lbnQtdGltZV0nIDogJ3NldFVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZScsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9YWR2YW5jZWQtZXZlbnQtYnV0dG9uXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckV2ZW50QXNzaWdubWVudHMoKTtcbiAgICB2YXIgdHJpZ2dlckV4cHJlc3Npb25GaWVsZCA9IHRoaXMucXVlcnlCeUhvb2soJ2V2ZW50LXRyaWdnZXItZXhwcmVzc2lvbicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdO1xuICAgICQodHJpZ2dlckV4cHJlc3Npb25GaWVsZCkuYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiLS0tTm8gRXhwcmVzc2lvbiBFbnRlcmVkLS0tXCIpO1xuICAgIHZhciBkZWxheUZpZWxkID0gdGhpcy5xdWVyeUJ5SG9vaygnZXZlbnQtZGVsYXknKS5jaGlsZHJlblswXS5jaGlsZHJlblsxXTtcbiAgICAkKGRlbGF5RmllbGQpLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBcIi0tLU5vIEV4cHJlc3Npb24gRW50ZXJlZC0tLVwiKTtcbiAgICBpZih0aGlzLm1vZGVsLnVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZSl7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3RyaWdnZXItdGltZScpKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcbiAgICB9ZWxzZXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYXNzaWdubWVudC10aW1lJykpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuICAgIH1cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlbmRlckV2ZW50QXNzaWdubWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLmV2ZW50QXNzaWdubWVudHNWaWV3KXtcbiAgICAgIHRoaXMuZXZlbnRBc3NpZ25tZW50c1ZpZXcucmVtb3ZlKClcbiAgICB9XG4gICAgdGhpcy5ldmVudEFzc2lnbm1lbnRzVmlldyA9IG5ldyBFdmVudEFzc2lnbm1lbnQoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5ldmVudEFzc2lnbm1lbnRzLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuZXZlbnRBc3NpZ25tZW50c1ZpZXcsICdldmVudC1hc3NpZ25tZW50cycpO1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBzZXRUcmlnZ2VySW5pdGlhbFZhbHVlOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubW9kZWwuaW5pdGlhbFZhbHVlID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgfSxcbiAgc2V0VHJpZ2dlclBlcnNpc3RlbnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5tb2RlbC5wZXJzaXN0ZW50ID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgfSxcbiAgc2V0VXNlVmFsdWVzRnJvbVRyaWdnZXJUaW1lOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubW9kZWwudXNlVmFsdWVzRnJvbVRyaWdnZXJUaW1lID0gZS50YXJnZXQuZGF0YXNldC5uYW1lID09PSBcInRyaWdnZXJcIjtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZHZhbmNlZC1ldmVudC1idXR0b24nKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtZXZlbnQtYnV0dG9uJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtZXZlbnQtYnV0dG9uJykpLnRleHQoJysnKTtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dERlbGF5OiB7XG4gICAgICBob29rOiAnZXZlbnQtZGVsYXknLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAnZGVsYXknLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6ICdkZWxheScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5kZWxheSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRQcmlvcml0eToge1xuICAgICAgaG9vazogJ2V2ZW50LXByaW9yaXR5JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncHJpb3JpdHknLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwcmlvcml0eScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wcmlvcml0eSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRUcmlnZ2VyRXhwcmVzc2lvbjoge1xuICAgICAgaG9vazogJ2V2ZW50LXRyaWdnZXItZXhwcmVzc2lvbicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3RyaWdnZXItZXhwcmVzc2lvbicsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ3RyaWdnZXJFeHByZXNzaW9uJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnRyaWdnZXJFeHByZXNzaW9uLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudExpc3RpbmdzLnB1ZycpO1xuXG5sZXQgZXZlbnRBbm5vdGF0aW9uTW9kYWxIdG1sID0gKGV2ZW50TmFtZSwgYW5ub3RhdGlvbikgPT4ge1xuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJldmVudEFubm90YXRpb25Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+QW5ub3RhdGlvbiBmb3IgJHtldmVudE5hbWV9PC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxzcGFuIGZvcj1cImV2ZW50QW5ub3RhdGlvbklucHV0XCI+QW5ub3RhdGlvbjogPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJldmVudEFubm90YXRpb25JbnB1dFwiIG5hbWU9XCJldmVudEFubm90YXRpb25JbnB1dFwiIHNpemU9XCIzMFwiIGF1dG9mb2N1cyB2YWx1ZT1cIiR7YW5ub3RhdGlvbn1cIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBvay1tb2RlbC1idG5cIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5uYW1lJyA6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBob29rOiAnaW5wdXQtbmFtZS1jb250YWluZXInXG4gICAgfSxcbiAgICAnbW9kZWwuc2VsZWN0ZWQnIDoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICBlbC5jaGVja2VkID0gdmFsdWU7XG4gICAgICB9LFxuICAgICAgaG9vazogJ3NlbGVjdCdcbiAgICB9XG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXNlbGVjdF0nICA6ICdzZWxlY3RFdmVudCcsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZWRpdC1hbm5vdGF0aW9uLWJ0bl0nIDogJ2VkaXRBbm5vdGF0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZW1vdmVdJyA6ICdyZW1vdmVFdmVudCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgJChkb2N1bWVudCkub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJ1thdXRvZm9jdXNdJywgZS50YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgaWYoIXRoaXMubW9kZWwuYW5ub3RhdGlvbil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2VkaXQtYW5ub3RhdGlvbi1idG4nKSkudGV4dCgnQWRkJylcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBzZWxlY3RFdmVudDogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24udHJpZ2dlcihcInNlbGVjdFwiLCB0aGlzLm1vZGVsKTtcbiAgfSxcbiAgZWRpdEFubm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLm1vZGVsLm5hbWU7XG4gICAgdmFyIGFubm90YXRpb24gPSB0aGlzLm1vZGVsLmFubm90YXRpb247XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2V2ZW50QW5ub3RhdGlvbk1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNldmVudEFubm90YXRpb25Nb2RhbCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKGV2ZW50QW5ub3RhdGlvbk1vZGFsSHRtbChuYW1lLCBhbm5vdGF0aW9uKSkubW9kYWwoKTtcbiAgICBsZXQgb2tCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZXZlbnRBbm5vdGF0aW9uTW9kYWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNldmVudEFubm90YXRpb25Nb2RhbCAjZXZlbnRBbm5vdGF0aW9uSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5tb2RlbC5hbm5vdGF0aW9uID0gaW5wdXQudmFsdWU7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJFdmVudExpc3RpbmdzVmlldygpO1xuICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICB9KTtcbiAgfSxcbiAgcmVtb3ZlRXZlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmVFdmVudCh0aGlzLm1vZGVsKTtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dE5hbWU6IHtcbiAgICAgIGhvb2s6ICdldmVudC1uYW1lLWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMubmFtZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnbmFtZScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciBWaWV3U3dpdGNoZXIgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldy1zd2l0Y2hlcicpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBFdmVudExpc3RpbmdzID0gcmVxdWlyZSgnLi9ldmVudC1saXN0aW5ncycpO1xudmFyIEV2ZW50RGV0YWlscyA9IHJlcXVpcmUoJy4vZXZlbnQtZGV0YWlscycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudHNFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWFkZC1ldmVudF0nIDogJ2FkZEV2ZW50JyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0ge1wibmFtZVwiOlwiTmFtZXMgZm9yIHNwZWNpZXMsIHBhcmFtZXRlcnMsIHJlYWN0aW9ucywgZXZlbnRzLCBhbmQgcnVsZXMgbXVzdCBiZSB1bmlxdWUuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImFubm90YXRpb25cIjpcIkFuIG9wdGlvbmFsIG5vdGUgYWJvdXQgYW4gZXZlbnQuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInRyaWdnZXJFeHByZXNzaW9uXCI6XCJUaGUgdHJpZ2dlciBleHByZXNzaW9uIGNhbiBiZSBhbnkgbWF0aGVtYXRpY2FsIGV4cHJlc3Npb24gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwid2hpY2ggZXZhbHVhdGVzIHRvIGEgYm9vbGVhbiB2YWx1ZSBpbiBhIHB5dGhvbiBlbnZpcm9ubWVudCBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIoaS5lLiB0PT01MCkuICBUaGlzIGV4cHJlc3Npb24gaXMgZXZhbHVhYmxlIHdpdGhpbiB0aGUgbW9kZWwgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZXNwYWNlLCBhbmQgYW55IHZhcmlhYmxlIChTcGVjaWVzLCBQYXJhbWV0ZXJzLCBldGMuKSBjYW4gYmUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlZCBpbiB0aGUgZXhwcmVzc2lvbi4gIFRpbWUgaXMgcmVwcmVzZW50ZWQgd2l0aCB0aGUgbG93ZXIgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FzZSB2YXJpYWJsZSAndCcuIEFuIGV2ZW50IHdpbGwgYmVnaW4gZXhlY3V0aW9uIG9mIGFzc2lnbm1lbnRzIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIihvciBkZWxheSwgaWYgYW55KSBvbmNlIHRoaXMgZXhwcmVzc2lvbiBjaGFuZ2VzIGZyb20gJ0ZhbHNlJyB0byAnVHJ1ZS4nXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImRlbGF5XCI6XCJjb250YWlucyBtYXRoIGV4cHJlc3Npb24gZXZhbHVhYmxlIHdpdGhpbiBtb2RlbCBuYW1lc3BhY2UuIFRoaXMgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXhwcmVzc2lvbiBkZXNpZ25hdGVzIGEgZGVsYXkgYmV0d2VlbiB0aGUgdHJpZ2dlciBvZiBhbiBldmVudCBhbmQgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGhlIGV4ZWN1dGlvbiBvZiBpdHMgYXNzaWdubWVudHMuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInByaW9yaXR5XCI6XCJDb250YWlucyBhIG1hdGggZXhwcmVzc2lvbiBldmFsdWFibGUgd2l0aGluIG1vZGVsIG5hbWVzcGFjZS4gIFRoaXMgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXhwcmVzc2lvbiBkZXNpZ25hdGVzIGV4ZWN1dGlvbiBvcmRlciBmb3IgZXZlbnRzIHdoaWNoIGFyZSBleGVjdXRlZCBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaW11bHRhbmVvdXNseS5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwiaW5pdGlhbFZhbHVlXCI6XCJJZiB0cnVlLCB0aGUgdHJpZ2dlciBleHByZXNzaW9uIHdpbGwgYmUgZXZhbHVhdGVkIGFzICdUcnVlJyBhdCBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGFydCBvZiBzaW11bGF0aW9uLiAgVGhpcyBjYW4gYmUgdXNlZnVsIGZvciBzb21lIG1vZGVscywgc2luY2UgYW4gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXZlbnQgaXMgb25seSBleGVjdXRlZCB3aGVuIHRoZSB0cmlnZ2VyIGV4cHJlc3Npb24gc3RhdGUgY2hhbmdlcyBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmcm9tICdGYWxzZScgdG8gJ1RydWUnLlwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJwZXJzaXN0ZW50XCI6XCJJZiBwZXJzaXN0ZW50LCBhbiBldmVudCBhc3NpZ25tZW50IHdpbGwgYWx3YXlzIGJlIGV4ZWN1dGVkIHdoZW4gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGhlIGV2ZW50J3MgdHJpZ2dlciBleHByZXNzaW9uIGV2YWx1YXRlcyB0byB0cnVlLiAgSWYgbm90IHBlcnNpc3RlbnQsIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRoZSBldmVudCBhc3NpZ25tZW50IHdpbGwgbm90IGJlIGV4ZWN1dGVkIGlmIHRoZSB0cmlnZ2VyIGV4cHJlc3Npb24gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXZhbHVhdGVzIHRvIGZhbHNlIGJldHdlZW4gdGhlIHRpbWUgdGhlIGV2ZW50IGlzIHRyaWdnZXJlZCBhbmQgdGhlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRpbWUgdGhlIGFzc2lnbm1lbnQgaXMgZXhlY3V0ZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZVwiOlwiSWYgc2V0IHRvIHRydWUsIGFzc2lnbm1lbnQgZXhlY3V0aW9uIHdpbGwgYmUgYmFzZWQgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib2ZmIG9mIHRoZSBtb2RlbCBzdGF0ZSBhdCB0cmlnZ2VyIHRpbWUuIElmIGZhbHNlIChkZWZhdWx0KSwgdGhlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFzc2lnbm1lbnQgd2lsbCBiZSBtYWRlIHVzaW5nIHZhbHVlcyBhdCBhc3NpZ25tZW50IHRpbWUuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImFzc2lnbm1lbnRzXCI6XCJBbiBFdmVudCBBc3NpZ25tZW50IGRlc2NyaWJlcyBhIGNoYW5nZSB0byBiZSBwZXJmb3JtZWQgdG8gdGhlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImN1cnJlbnQgbW9kZWwgc2ltdWxhdGlvbi4gIFRoaXMgYXNzaWdubWVudCBjYW4gZWl0aGVyIGJlIGZpcmVkIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImF0IHRoZSB0aW1lIGl0cyBhc3NvY2lhdGVkIHRyaWdnZXIgY2hhbmdlcyBmcm9tIGZhbHNlIHRvIHRydWUsIG9yIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFmdGVyIGEgc3BlY2lmaWVkIGRlbGF5LCBkZXBlbmRpbmcgb24gdGhlIEV2ZW50IGNvbmZpZ3VyYXRpb24uIEFuIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImV2ZW50IG1heSBjb250YWluIG9uZSBvciBtb3JlIGFzc2lnbm1lbnRzLlwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZVwiOlwiVGhlIHRhcmdldCBTcGVjaWVzIG9yIFBhcmFtZXRlciB0byBiZSBtb2RpZmllZCBieSB0aGUgZXZlbnQuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImFzc2lnbm1lbnRFeHByZXNzaW9uXCI6XCJDYW4gYmUgYW55IG1hdGhlbWF0aWNhbCBzdGF0ZW1lbnQgd2hpY2ggcmVzb2x2ZXMgdG8gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYW4gaW50ZWdlciBvciBmbG9hdCB2YWx1ZS4gIFRoaXMgdmFsdWUgd2lsbCBiZSBhc3NpZ25lZCB0byB0aGUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXNzaWdubWVudCdzIHRhcmdldCB2YXJpYWJsZSB1cG9uIGV2ZW50IGV4ZWN1dGlvbi5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKFwic2VsZWN0XCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdGhpcy5zZXRTZWxlY3RlZEV2ZW50KGV2ZW50KTtcbiAgICAgIHRoaXMuc2V0RGV0YWlsc1ZpZXcoZXZlbnQpO1xuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5vbihcInJlbW92ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIC8vIFNlbGVjdCB0aGUgbGFzdCBldmVudCBieSBkZWZhdWx0XG4gICAgICAvLyBCdXQgb25seSBpZiB0aGVyZSBhcmUgb3RoZXIgZXZlbnRzIG90aGVyIHRoYW4gdGhlIG9uZSB3ZSdyZSByZW1vdmluZ1xuICAgICAgaWYgKGV2ZW50LmRldGFpbHNWaWV3KVxuICAgICAgICBldmVudC5kZXRhaWxzVmlldy5yZW1vdmUoKTtcbiAgICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmVFdmVudChldmVudCk7XG4gICAgICBpZiAodGhpcy5jb2xsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLmNvbGxlY3Rpb24uYXQodGhpcy5jb2xsZWN0aW9uLmxlbmd0aC0xKTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJzZWxlY3RcIiwgc2VsZWN0ZWQpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcy5vbignYWRkIHJlbW92ZScsIHRoaXMudG9nZ2xlQWRkRXZlbnRCdXR0b24sIHRoaXMpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5vbignYWRkIHJlbW92ZScsIHRoaXMudG9nZ2xlQWRkRXZlbnRCdXR0b24sIHRoaXMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckV2ZW50TGlzdGluZ3NWaWV3KCk7XG4gICAgdGhpcy5kZXRhaWxzQ29udGFpbmVyID0gdGhpcy5xdWVyeUJ5SG9vaygnZXZlbnQtZGV0YWlscy1jb250YWluZXInKTtcbiAgICB0aGlzLmRldGFpbHNWaWV3U3dpdGNoZXIgPSBuZXcgVmlld1N3aXRjaGVyKHtcbiAgICAgIGVsOiB0aGlzLmRldGFpbHNDb250YWluZXIsXG4gICAgfSk7XG4gICAgaWYgKHRoaXMuY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWRFdmVudCh0aGlzLmNvbGxlY3Rpb24uYXQoMCkpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3RlZEV2ZW50KTtcbiAgICB9XG4gICAgdGhpcy50b2dnbGVBZGRFdmVudEJ1dHRvbigpXG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXJFdmVudExpc3RpbmdzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuZXZlbnRMaXN0aW5nc1ZpZXcpe1xuICAgICAgdGhpcy5ldmVudExpc3RpbmdzVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5ldmVudExpc3RpbmdzVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgIEV2ZW50TGlzdGluZ3MsXG4gICAgICB0aGlzLnF1ZXJ5QnlIb29rKCdldmVudC1saXN0aW5nLWNvbnRhaW5lcicpXG4gICAgKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHRvZ2dsZUFkZEV2ZW50QnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLm1hcChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmKGV2ZW50LmRldGFpbHNWaWV3ICYmIGV2ZW50LnNlbGVjdGVkKXtcbiAgICAgICAgZXZlbnQuZGV0YWlsc1ZpZXcucmVuZGVyRXZlbnRBc3NpZ25tZW50cygpO1xuICAgICAgfVxuICAgIH0pXG4gICAgdmFyIG51bVNwZWNpZXMgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXMubGVuZ3RoO1xuICAgIHZhciBudW1QYXJhbWV0ZXJzID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLmxlbmd0aDtcbiAgICB2YXIgZGlzYWJsZWQgPSBudW1TcGVjaWVzIDw9IDAgJiYgbnVtUGFyYW1ldGVycyA8PSAwXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtZXZlbnQnKSkucHJvcCgnZGlzYWJsZWQnLCBkaXNhYmxlZCk7XG4gIH0sXG4gIHNldFNlbGVjdGVkRXZlbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChtKSB7IG0uc2VsZWN0ZWQgPSBmYWxzZTsgfSk7XG4gICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuc2VsZWN0ZWRFdmVudCA9IGV2ZW50O1xuICB9LFxuICBzZXREZXRhaWxzVmlldzogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQuZGV0YWlsc1ZpZXcgPSBldmVudC5kZXRhaWxzVmlldyB8fCB0aGlzLm5ld0RldGFpbHNWaWV3KGV2ZW50KTtcbiAgICB0aGlzLmRldGFpbHNWaWV3U3dpdGNoZXIuc2V0KGV2ZW50LmRldGFpbHNWaWV3KTtcbiAgfSxcbiAgYWRkRXZlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnQgPSB0aGlzLmNvbGxlY3Rpb24uYWRkRXZlbnQoKTtcbiAgICBldmVudC5kZXRhaWxzVmlldyA9IHRoaXMubmV3RGV0YWlsc1ZpZXcoZXZlbnQpO1xuICAgIHRoaXMuY29sbGVjdGlvbi50cmlnZ2VyKFwic2VsZWN0XCIsIGV2ZW50KTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgbmV3RGV0YWlsc1ZpZXc6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBkZXRhaWxzVmlldyA9IG5ldyBFdmVudERldGFpbHMoeyBtb2RlbDogZXZlbnQgfSk7XG4gICAgZGV0YWlsc1ZpZXcucGFyZW50ID0gdGhpcztcbiAgICByZXR1cm4gZGV0YWlsc1ZpZXdcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pIiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBFZGl0SW5pdGlhbENvbmRpdGlvbiA9IHJlcXVpcmUoJy4vZWRpdC1pbml0aWFsLWNvbmRpdGlvbicpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9pbml0aWFsQ29uZGl0aW9uc0VkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9c2NhdHRlcl0nIDogJ2FkZEluaXRpYWxDb25kaXRpb24nLFxuICAgICdjbGljayBbZGF0YS1ob29rPXBsYWNlXScgOiAnYWRkSW5pdGlhbENvbmRpdGlvbicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZGlzdHJpYnV0ZS11bmlmb3JtbHldJyA6ICdhZGRJbml0aWFsQ29uZGl0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICBFZGl0SW5pdGlhbENvbmRpdGlvbixcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ2luaXRpYWwtY29uZGl0aW9ucy1jb2xsZWN0aW9uJylcbiAgICApO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgYWRkSW5pdGlhbENvbmRpdGlvbjogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgaW5pdGlhbENvbmRpdGlvblR5cGUgPSBlLnRhcmdldC50ZXh0Q29udGVudDtcbiAgICB0aGlzLmNvbGxlY3Rpb24uYWRkSW5pdGlhbENvbmRpdGlvbihpbml0aWFsQ29uZGl0aW9uVHlwZSk7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciBhcHAgPSByZXF1aXJlKCdhbXBlcnNhbmQtYXBwJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvbWVzaEVkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPW51bS1zdWJkb21haW5zLWNvbnRhaW5lcl0nIDogJ3VwZGF0ZVN1YmRvbWFpbnMnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0J1xuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVN1YmRvbWFpbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLnBhcmVudC50cmlnZ2VyKCdtZXNoLXVwZGF0ZScpO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpXG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXRTdWJkb21haW5zOiB7XG4gICAgICBob29rOiAnbnVtLXN1YmRvbWFpbnMtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnbnVtU3ViZG9tYWlucycsXG4gICAgICAgICAgbGFiZWw6ICdOdW1iZXIgb2YgU3ViZG9tYWlucycsXG4gICAgICAgICAgdGVzdDogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ2NvdW50JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmNvdW50LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFNldHRpbmdzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0ge1wicHJldmlld1NldHRpbmdzXCI6XCJQcmV2aWV3IFNldHRpbmdzIGFyZSBhcHBsaWVkIHRvIHRoZSBtb2RlbCBhbmQgYXJlIHVzZWQgZm9yIHRoZSBtb2RlbCBwcmV2aWV3IGFuZCBhbGwgd29ya2Zsb3dzLlwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJwcmV2aWV3VGltZVwiOlwiRW5kIHRpbWUgb2Ygc2ltdWxhdGlvbi5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwidGltZVVuaXRzXCI6XCJTYXZlIHBvaW50IGluY3JlbWVudCBmb3IgcmVjb3JkaW5nIGRhdGEuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInZvbHVtZVwiOlwiVGhlIHZvbHVtZSBvZiB0aGUgc3lzdGVtIG1hdHRlcnMgd2hlbiBjb252ZXJ0aW5nIHRvIGZyb20gcG9wdWxhdGlvbiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidG8gY29uY2VudHJhdGlvbiBmb3JtLiBUaGlzIHdpbGwgYWxzbyBzZXQgYSBwYXJhbWV0ZXIgJ3ZvbCcgZm9yIHVzZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4gY3VzdG9tIChpLmUuIG5vbi1tYXNzLWFjdGlvbikgcHJvcGVuc2l0eSBmdW5jdGlvbnMuXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJylcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFNpbUVuZDoge1xuICAgICAgaG9vazogJ3ByZXZpZXctdGltZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2VuZC1zaW0nLFxuICAgICAgICAgIGxhYmVsOiAnMCB0byAnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnZW5kU2ltJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmVuZFNpbVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFRpbWVVbml0OiB7XG4gICAgICBob29rOiAndGltZS11bml0cycsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3ICh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICd0aW1lLXVuaXRzJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICd0aW1lU3RlcCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC50aW1lU3RlcFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFZvbHVtZToge1xuICAgICAgaG9vazogJ3ZvbHVtZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3ICh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICd2b2x1bWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3ZvbHVtZScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC52b2x1bWUsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyIGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xudmFyIHhociA9IHJlcXVpcmUoJ3hocicpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgUGxvdGx5ID0gcmVxdWlyZSgnLi4vbGliL3Bsb3RseScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxTdGF0ZUJ1dHRvbnMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXNhdmVdJyA6ICdjbGlja1NhdmVIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1ydW5dJyAgOiAnY2xpY2tSdW5IYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1zdGFydC13b3JrZmxvd10nIDogJ2NsaWNrU3RhcnRXb3JrZmxvd0hhbmRsZXInLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5tb2RlbC5zcGVjaWVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVQcmV2aWV3V29ya2Zsb3dCdG4sIHRoaXMpO1xuICAgIHRoaXMubW9kZWwucmVhY3Rpb25zLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVQcmV2aWV3V29ya2Zsb3dCdG4sIHRoaXMpO1xuICAgIHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvbi5vbignYWRkIHJlbW92ZScsIHRoaXMudG9nZ2xlUHJldmlld1dvcmtmbG93QnRuLCB0aGlzKTtcbiAgICB0aGlzLm1vZGVsLnJ1bGVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVQcmV2aWV3V29ya2Zsb3dCdG4sIHRoaXMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvZ2dsZVByZXZpZXdXb3JrZmxvd0J0bigpO1xuICB9LFxuICBjbGlja1NhdmVIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc2F2ZU1vZGVsKHRoaXMuc2F2ZWQuYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNsaWNrUnVuSGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAkKHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tZXJyb3ItY29udGFpbmVyJykpLmNvbGxhcHNlKCdoaWRlJyk7XG4gICAgdmFyIGVsID0gdGhpcy5wYXJlbnQucXVlcnlCeUhvb2soJ21vZGVsLXJ1bi1jb250YWluZXInKTtcbiAgICBQbG90bHkucHVyZ2UoZWwpXG4gICAgdGhpcy5zYXZlTW9kZWwodGhpcy5ydW5Nb2RlbC5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY2xpY2tTdGFydFdvcmtmbG93SGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJzdG9jaHNzL3dvcmtmbG93L3NlbGVjdGlvblwiLCB0aGlzLm1vZGVsLmRpcmVjdG9yeSk7XG4gIH0sXG4gIHRvZ2dsZVByZXZpZXdXb3JrZmxvd0J0bjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBudW1TcGVjaWVzID0gdGhpcy5tb2RlbC5zcGVjaWVzLmxlbmd0aDtcbiAgICB2YXIgbnVtUmVhY3Rpb25zID0gdGhpcy5tb2RlbC5yZWFjdGlvbnMubGVuZ3RoXG4gICAgdmFyIG51bUV2ZW50cyA9IHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvbi5sZW5ndGhcbiAgICB2YXIgbnVtUnVsZXMgPSB0aGlzLm1vZGVsLnJ1bGVzLmxlbmd0aFxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygncnVuJykpLnByb3AoJ2Rpc2FibGVkJywgKCFudW1TcGVjaWVzIHx8ICghbnVtUmVhY3Rpb25zICYmICFudW1FdmVudHMgJiYgIW51bVJ1bGVzKSkpXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzdGFydC13b3JrZmxvdycpKS5wcm9wKCdkaXNhYmxlZCcsICghbnVtU3BlY2llcyB8fCAoIW51bVJlYWN0aW9ucyAmJiAhbnVtRXZlbnRzICYmICFudW1SdWxlcykpKVxuICB9LFxuICBzYXZlTW9kZWw6IGZ1bmN0aW9uIChjYikge1xuICAgIHZhciBudW1FdmVudHMgPSB0aGlzLm1vZGVsLmV2ZW50c0NvbGxlY3Rpb24ubGVuZ3RoO1xuICAgIHZhciBudW1SdWxlcyA9IHRoaXMubW9kZWwucnVsZXMubGVuZ3RoO1xuICAgIHZhciBkZWZhdWx0TW9kZSA9IHRoaXMubW9kZWwuZGVmYXVsdE1vZGU7XG4gICAgaWYoIW51bUV2ZW50cyAmJiAhbnVtUnVsZXMgJiYgZGVmYXVsdE1vZGUgPT09IFwiY29udGludW91c1wiKXtcbiAgICAgIHRoaXMubW9kZWwubW9kZWxTZXR0aW5ncy5hbGdvcml0aG0gPSBcIk9ERVwiO1xuICAgIH1lbHNlIGlmKCFudW1FdmVudHMgJiYgIW51bVJ1bGVzICYmIGRlZmF1bHRNb2RlID09PSBcImRpc2NyZXRlXCIpe1xuICAgICAgdGhpcy5tb2RlbC5tb2RlbFNldHRpbmdzLmFsZ29yaXRobSA9IFwiU1NBXCI7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLm1vZGVsLm1vZGVsU2V0dGluZ3MuYWxnb3JpdGhtID0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIjtcbiAgICB9XG4gICAgdGhpcy5zYXZpbmcoKTtcbiAgICAvLyB0aGlzLm1vZGVsIGlzIGEgTW9kZWxWZXJzaW9uLCB0aGUgcGFyZW50IG9mIHRoZSBjb2xsZWN0aW9uIGlzIE1vZGVsXG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbDtcbiAgICBpZiAoY2IpIHtcbiAgICAgIG1vZGVsLnNhdmUobW9kZWwuYXR0cmlidXRlcywge1xuICAgICAgICBzdWNjZXNzOiBjYixcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc2F2aW5nIG1vZGVsOlwiLCBtb2RlbCk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlc3BvbnNlOlwiLCByZXNwb25zZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kZWwuc2F2ZU1vZGVsKCk7XG4gICAgfVxuICB9LFxuICBzYXZpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2F2aW5nID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2aW5nLW1kbCcpO1xuICAgIHZhciBzYXZlZCA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmVkLW1kbCcpO1xuICAgIHNhdmVkLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBzYXZpbmcuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG4gIH0sXG4gIHNhdmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNhdmluZyA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmluZy1tZGwnKTtcbiAgICB2YXIgc2F2ZWQgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzYXZlZC1tZGwnKTtcbiAgICBzYXZpbmcuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNhdmVkLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuICB9LFxuICBydW5Nb2RlbDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2F2ZWQoKTtcbiAgICB0aGlzLnJ1bm5pbmcoKTtcbiAgICB2YXIgZWwgPSB0aGlzLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtcnVuLWNvbnRhaW5lcicpXG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbFxuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCAnL21vZGVscy9ydW4vJywgJ3N0YXJ0JywgJ25vbmUnLCBtb2RlbC5kaXJlY3RvcnkpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB4aHIoeyB1cmk6IGVuZHBvaW50IH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICBzZWxmLm91dGZpbGUgPSBib2R5LnNwbGl0KCctPicpLnBvcCgpXG4gICAgICBzZWxmLmdldFJlc3VsdHMoYm9keSlcbiAgICB9KTtcbiAgfSxcbiAgcnVubmluZzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwbG90ID0gdGhpcy5wYXJlbnQucXVlcnlCeUhvb2soJ21vZGVsLXJ1bi1jb250YWluZXInKTtcbiAgICB2YXIgc3Bpbm5lciA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdwbG90LWxvYWRlcicpO1xuICAgIHZhciBlcnJvcnMgPSB0aGlzLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtcnVuLWVycm9yLWNvbnRhaW5lcicpO1xuICAgIHBsb3Quc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNwaW5uZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBlcnJvcnMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9LFxuICByYW46IGZ1bmN0aW9uIChub0Vycm9ycykge1xuICAgIHZhciBwbG90ID0gdGhpcy5wYXJlbnQucXVlcnlCeUhvb2soJ21vZGVsLXJ1bi1jb250YWluZXInKTtcbiAgICB2YXIgc3Bpbm5lciA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdwbG90LWxvYWRlcicpO1xuICAgIHZhciBlcnJvcnMgPSB0aGlzLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtcnVuLWVycm9yLWNvbnRhaW5lcicpO1xuICAgIGlmKG5vRXJyb3JzKXtcbiAgICAgIHBsb3Quc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9ZWxzZXtcbiAgICAgIGVycm9ycy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgfVxuICAgIHNwaW5uZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9LFxuICBnZXRSZXN1bHRzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgJy9tb2RlbHMvcnVuLycsICdyZWFkJywgc2VsZi5vdXRmaWxlLCBtb2RlbC5kaXJlY3RvcnkpO1xuICAgICAgeGhyKHsgdXJpOiBlbmRwb2ludCB9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICBpZighYm9keS5zdGFydHNXaXRoKCdydW5uaW5nJykpe1xuICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICBpZihkYXRhLnRpbWVvdXQpe1xuICAgICAgICAgICAgJChzZWxmLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtdGltZW91dC1tZXNzYWdlJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGRhdGEucmVzdWx0cyl7XG4gICAgICAgICAgICBzZWxmLnBsb3RSZXN1bHRzKGRhdGEucmVzdWx0cyk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBzZWxmLnJhbihmYWxzZSk7XG4gICAgICAgICAgICAkKHNlbGYucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tZXJyb3ItbWVzc2FnZScpKS50ZXh0KGRhdGEuZXJyb3JzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIHNlbGYuZ2V0UmVzdWx0cyhib2R5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwgMjAwMCk7XG4gIH0sXG4gIHBsb3RSZXN1bHRzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vIFRPRE8gYWJzdHJhY3QgdGhpcyBpbnRvIGFuIGV2ZW50IHByb2JhYmx5XG4gICAgdmFyIHRpdGxlID0gdGhpcy5tb2RlbC5uYW1lICsgXCIgTW9kZWwgUHJldmlld1wiXG4gICAgdGhpcy5yYW4odHJ1ZSlcbiAgICBlbCA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tY29udGFpbmVyJyk7XG4gICAgdGltZSA9IGRhdGEudGltZVxuICAgIHlfbGFiZWxzID0gT2JqZWN0LmtleXMoZGF0YSkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBrZXkgIT09ICdkYXRhJyAmJiBrZXkgIT09ICd0aW1lJ1xuICAgIH0pO1xuICAgIHRyYWNlcyA9IHlfbGFiZWxzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiB0aW1lLFxuICAgICAgICB5OiBkYXRhW3NwZWNpZV0sXG4gICAgICAgIG1vZGU6ICdsaW5lcycsXG4gICAgICAgIG5hbWU6IHNwZWNpZVxuICAgICAgfVxuICAgIH0pO1xuICAgIGxheW91dCA9IHsgXG4gICAgICBzaG93bGVnZW5kOiB0cnVlLFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIHg6IDEsXG4gICAgICAgIHk6IDAuOVxuICAgICAgfSxcbiAgICAgIG1hcmdpbjogeyBcbiAgICAgICAgdDogMCBcbiAgICAgIH0gXG4gICAgfVxuICAgIGNvbmZpZyA9IHtcbiAgICAgIHJlc3BvbnNpdmU6IHRydWUsXG4gICAgfVxuICAgIFBsb3RseS5uZXdQbG90KGVsLCB0cmFjZXMsIGxheW91dCwgY29uZmlnKTtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQpXG4gIH0sXG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgRWRpdFBhcmFtZXRlclZpZXcgPSByZXF1aXJlKCcuL2VkaXQtcGFyYW1ldGVyJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWFkZC1wYXJhbWV0ZXJdJyA6ICdhZGRQYXJhbWV0ZXInLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0ge1wibmFtZVwiOlwiTmFtZXMgZm9yIHNwZWNpZXMsIHBhcmFtZXRlcnMsIHJlYWN0aW9ucywgZXZlbnRzLCBhbmQgcnVsZXMgbXVzdCBiZSB1bmlxdWUuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImV4cHJlc3Npb25cIjpcIkEgcGFyYW1ldGVyIHZhbHVlIG9yIGEgbWF0aGVtYXRpY2FsIGV4cHJlc3Npb24gY2FsY3VsYXRpbmcgdGhlIHBhcmFtZXRlciB2YWx1ZS5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwiYW5ub3RhdGlvblwiOlwiQW4gb3B0aW9uYWwgbm90ZSBhYm91dCBhIHBhcmFtZXRlci5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwicmVtb3ZlXCI6XCJBIHBhcmFtZXRlciBtYXkgb25seSBiZSByZW1vdmVkIGlmIGl0IGlzIG5vdCB1c2VkIGluIGFueSByZWFjdGlvbiwgZXZlbnQgYXNzaWdubWVudCwgb3IgcnVsZS5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKCd1cGRhdGUtcGFyYW1ldGVycycsIGZ1bmN0aW9uIChjb21wSUQsIHBhcmFtZXRlcikge1xuICAgICAgc2VsZi5jb2xsZWN0aW9uLnBhcmVudC5yZWFjdGlvbnMubWFwKGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgICBpZihyZWFjdGlvbi5yYXRlICYmIHJlYWN0aW9uLnJhdGUuY29tcElEID09PSBjb21wSUQpe1xuICAgICAgICAgIHJlYWN0aW9uLnJhdGUgPSBwYXJhbWV0ZXI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5jb2xsZWN0aW9uLnBhcmVudC5ldmVudHNDb2xsZWN0aW9uLm1hcChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuZXZlbnRBc3NpZ25tZW50cy5tYXAoZnVuY3Rpb24gKGFzc2lnbm1lbnQpIHtcbiAgICAgICAgICBpZihhc3NpZ25tZW50LnZhcmlhYmxlLmNvbXBJRCA9PT0gY29tcElEKSB7XG4gICAgICAgICAgICBhc3NpZ25tZW50LnZhcmlhYmxlID0gcGFyYW1ldGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYoZXZlbnQuc2VsZWN0ZWQpXG4gICAgICAgICAgZXZlbnQuZGV0YWlsc1ZpZXcucmVuZGVyRXZlbnRBc3NpZ25tZW50cygpO1xuICAgICAgfSk7XG4gICAgICBzZWxmLmNvbGxlY3Rpb24ucGFyZW50LnJ1bGVzLm1hcChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICBpZihydWxlLnZhcmlhYmxlLmNvbXBJRCA9PT0gY29tcElEKSB7XG4gICAgICAgICAgcnVsZS52YXJpYWJsZSA9IHBhcmFtZXRlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJSdWxlc1ZpZXcoKTtcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJFZGl0UGFyYW1ldGVyKCk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXJFZGl0UGFyYW1ldGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5lZGl0UGFyYW1ldGVyVmlldyl7XG4gICAgICB0aGlzLmVkaXRQYXJhbWV0ZXJWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmVkaXRQYXJhbWV0ZXJWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgRWRpdFBhcmFtZXRlclZpZXcsXG4gICAgICB0aGlzLnF1ZXJ5QnlIb29rKCdwYXJhbWV0ZXItbGlzdCcpXG4gICAgKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGFkZFBhcmFtZXRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5hZGRQYXJhbWV0ZXIoKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL21vZGVsc1xudmFyIFN0b2ljaFNwZWNpZSA9IHJlcXVpcmUoJy4uL21vZGVscy9zdG9pY2gtc3BlY2llJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xudmFyIEVkaXRTdG9pY2hTcGVjaWVWaWV3ID0gcmVxdWlyZSgnLi9lZGl0LXN0b2ljaC1zcGVjaWUnKTtcbnZhciBFZGl0Q3VzdG9tU3RvaWNoU3BlY2llVmlldyA9IHJlcXVpcmUoJy4vZWRpdC1jdXN0b20tc3RvaWNoLXNwZWNpZScpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9yZWFjdGFudFByb2R1Y3QucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3Qtc3BlY2llXScgOiAnc2VsZWN0U3BlY2llJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1hZGQtc2VsZWN0ZWQtc3BlY2llXScgOiAnYWRkU2VsZWN0ZWRTcGVjaWUnXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IGFyZ3MuY29sbGVjdGlvbjtcbiAgICB0aGlzLnNwZWNpZXMgPSBhcmdzLnNwZWNpZXM7XG4gICAgdGhpcy5yZWFjdGlvblR5cGUgPSBhcmdzLnJlYWN0aW9uVHlwZTtcbiAgICB0aGlzLmlzUmVhY3RhbnRzID0gYXJncy5pc1JlYWN0YW50c1xuICAgIHRoaXMudW5zZWxlY3RlZFRleHQgPSAnUGljayBhIHNwZWNpZXMnO1xuICAgIHRoaXMuZmllbGRUaXRsZSA9IGFyZ3MuZmllbGRUaXRsZTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBhcmdzID0ge1xuICAgICAgdmlld09wdGlvbnM6IHtcbiAgICAgICAgbmFtZTogJ3N0b2ljaC1zcGVjaWUnLFxuICAgICAgICBsYWJlbDogJycsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB0ZXh0QXR0cmlidXRlOiAnbmFtZScsXG4gICAgICAgIGVhZ2VyVmFsaWRhdGU6IHRydWUsXG4gICAgICAgIC8vIFNldCBpZEF0dHJpYnV0ZSB0byBuYW1lLiBNb2RlbHMgbWF5IG5vdCBiZSBzYXZlZCB5ZXQgc28gaWQgaXMgdW5yZWxpYWJsZSAoc28gaXMgY2lkKS5cbiAgICAgICAgLy8gVXNlIG5hbWUgc2luY2UgaXQgKnNob3VsZCBiZSogdW5pcXVlLlxuICAgICAgICBpZEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgICBvcHRpb25zOiBzZWxmLnNwZWNpZXNcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciB0eXBlID0gc2VsZi5yZWFjdGlvblR5cGU7XG4gICAgdmFyIFN0b2ljaFNwZWNpZXNWaWV3ID0gKHR5cGUuc3RhcnRzV2l0aCgnY3VzdG9tJykpID8gRWRpdEN1c3RvbVN0b2ljaFNwZWNpZVZpZXcgOiBFZGl0U3RvaWNoU3BlY2llVmlld1xuICAgIHNlbGYucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgICAgc2VsZi5jb2xsZWN0aW9uLFxuICAgICAgICBTdG9pY2hTcGVjaWVzVmlldyxcbiAgICAgICAgc2VsZi5xdWVyeUJ5SG9vaygncmVhY3RhbnRzLWVkaXRvcicpLFxuICAgICAgICBhcmdzXG4gICAgKTtcbiAgICBpZih0aGlzLnJlYWN0aW9uVHlwZS5zdGFydHNXaXRoKCdjdXN0b20nKSkge1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS5jb2xsYXBzZSgpXG4gICAgfVxuICAgIHRoaXMudG9nZ2xlQWRkU3BlY2llQnV0dG9uKCk7XG4gICAgaWYodGhpcy5maWVsZFRpdGxlID09PSBcIlJlYWN0YW50c1wiKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnZmllbGQtdGl0bGUtdG9vbHRpcCcpKS5wcm9wKCd0aXRsZScsIHRoaXMucGFyZW50LnBhcmVudC50b29sdGlwcy5yZWFjdGFudClcbiAgICB9ZWxzZXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnZmllbGQtdGl0bGUtdG9vbHRpcCcpKS5wcm9wKCd0aXRsZScsIHRoaXMucGFyZW50LnBhcmVudC50b29sdGlwcy5wcm9kdWN0KVxuICAgIH1cbiAgfSxcbiAgc2VsZWN0U3BlY2llOiBmdW5jdGlvbiAoZSkge1xuICAgIGlmKHRoaXMudW5zZWxlY3RlZFRleHQgPT09IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQpe1xuICAgICAgdGhpcy5oYXNTZWxlY3RlZFNwZWNpZSA9IGZhbHNlO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5oYXNTZWxlY3RlZFNwZWNpZSA9IHRydWU7XG4gICAgICB0aGlzLnNwZWNpZU5hbWUgPSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUFkZFNwZWNpZUJ1dHRvbigpO1xuICB9LFxuICBhZGRTZWxlY3RlZFNwZWNpZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzcGVjaWVOYW1lID0gdGhpcy5zcGVjaWVOYW1lID8gdGhpcy5zcGVjaWVOYW1lIDogJ1BpY2sgYSBzcGVjaWVzJztcbiAgICBpZih0aGlzLnZhbGlkYXRlQWRkU3BlY2llKCkpIHtcbiAgICAgIHRoaXMuY29sbGVjdGlvbi5hZGRTdG9pY2hTcGVjaWUoc3BlY2llTmFtZSk7XG4gICAgICB0aGlzLnRvZ2dsZUFkZFNwZWNpZUJ1dHRvbigpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC50cmlnZ2VyKCdjaGFuZ2UtcmVhY3Rpb24nKVxuICAgIH1cbiAgfSxcbiAgdG9nZ2xlQWRkU3BlY2llQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXRoaXMudmFsaWRhdGVBZGRTcGVjaWUoKSlcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWRkLXNlbGVjdGVkLXNwZWNpZScpKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIGVsc2VcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWRkLXNlbGVjdGVkLXNwZWNpZScpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgfSxcbiAgdmFsaWRhdGVBZGRTcGVjaWU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLmhhc1NlbGVjdGVkU3BlY2llKXtcbiAgICAgIGlmKCF0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoKSAgcmV0dXJuIHRydWU7XG4gICAgICBpZih0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoIDwgMiAmJiB0aGlzLmNvbGxlY3Rpb24uYXQoMCkucmF0aW8gPCAyKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmKHRoaXMucmVhY3Rpb25UeXBlICE9PSAnY3VzdG9tLW1hc3NhY3Rpb24nKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmKCF0aGlzLmlzUmVhY3RhbnRzKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIHNlbGVjdFNwZWNpZXM6IHtcbiAgICAgIGhvb2s6ICdzZWxlY3Qtc3BlY2llJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgICAgICBuYW1lOiAnc3RvaWNoLXNwZWNpZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICB0ZXh0QXR0cmlidXRlOiAnbmFtZScsXG4gICAgICAgICAgZWFnZXJWYWxpZGF0ZTogZmFsc2UsXG4gICAgICAgICAgLy8gU2V0IGlkQXR0cmlidXRlIHRvIG5hbWUuIE1vZGVscyBtYXkgbm90IGJlIHNhdmVkIHlldCBzbyBpZCBpcyB1bnJlbGlhYmxlIChzbyBpcyBjaWQpLlxuICAgICAgICAgIC8vIFVzZSBuYW1lIHNpbmNlIGl0ICpzaG91bGQgYmUqIHVuaXF1ZS5cbiAgICAgICAgICBpZEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgICAgIG9wdGlvbnM6IHRoaXMuc3BlY2llcyxcbiAgICAgICAgICB1bnNlbGVjdGVkVGV4dDogdGhpcy51bnNlbGVjdGVkVGV4dCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxufSk7IiwidmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIGthdGV4ID0gcmVxdWlyZSgna2F0ZXgnKTtcbi8vY29uZmlnXG52YXIgUmVhY3Rpb25UeXBlcyA9IHJlcXVpcmUoJy4uL3JlYWN0aW9uLXR5cGVzJyk7XG4vL21vZGVsc1xudmFyIFN0b2ljaFNwZWNpZSA9IHJlcXVpcmUoJy4uL21vZGVscy9zdG9pY2gtc3BlY2llJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBSZWFjdGlvblN1YmRvbWFpbnNWaWV3ID0gcmVxdWlyZSgnLi9yZWFjdGlvbi1zdWJkb21haW5zJyk7XG52YXIgUmVhY3RhbnRQcm9kdWN0VmlldyA9IHJlcXVpcmUoJy4vcmVhY3RhbnQtcHJvZHVjdCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9yZWFjdGlvbkRldGFpbHMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLnByb3BlbnNpdHknOiB7XG4gICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgaG9vazogJ3NlbGVjdC1yYXRlLXBhcmFtZXRlcidcbiAgICB9LFxuICAgICdtb2RlbC5zdW1tYXJ5JyA6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUsIHByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAga2F0ZXgucmVuZGVyKHRoaXMubW9kZWwuc3VtbWFyeSwgdGhpcy5xdWVyeUJ5SG9vaygnc3VtbWFyeS1jb250YWluZXInKSwge1xuICAgICAgICAgIGRpc3BsYXlNb2RlOiB0cnVlLFxuICAgICAgICAgIG91dHB1dDogJ2h0bWwnXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGhvb2s6ICdzdW1tYXJ5LWNvbnRhaW5lcicsXG4gICAgfSxcbiAgICAnbW9kZWwuaGFzQ29uZmxpY3QnOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlLCBwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgIHRoaXMubW9kZWwuaGFzQ29uZmxpY3QgPyBcbiAgICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbmZsaWN0aW5nLW1vZGVzLW1lc3NhZ2UnKSkuY29sbGFwc2UoJ3Nob3cnKSA6IFxuICAgICAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY29uZmxpY3RpbmctbW9kZXMtbWVzc2FnZScpKS5jb2xsYXBzZSgnaGlkZScpXG4gICAgICB9LFxuICAgICAgaG9vazogJ2NvbmZsaWN0aW5nLW1vZGVzLW1lc3NhZ2UnLFxuICAgIH0sXG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtcmF0ZS1wYXJhbWV0ZXJdJyA6ICdzZWxlY3RSYXRlUGFyYW0nLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zZWxlY3QtcmVhY3Rpb24tdHlwZV0nICA6ICdzZWxlY3RSZWFjdGlvblR5cGUnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzOyBcbiAgICB0aGlzLm1vZGVsLm9uKFwiY2hhbmdlOnJlYWN0aW9uX3R5cGVcIiwgZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICBzZWxmLnVwZGF0ZVN0b2ljaFNwZWNpZXNGb3JSZWFjdGlvblR5cGUobW9kZWwucmVhY3Rpb25UeXBlKTtcbiAgICB9KTtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnMub24oJ2FkZCByZW1vdmUnLCB0aGlzLnVwZGF0ZVJlYWN0aW9uVHlwZU9wdGlvbnMsIHRoaXMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgb3B0aW9ucyA9IFtdO1xuICAgIGlmKHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPD0gMCl7XG4gICAgICBvcHRpb25zID0gW1wiQ3VzdG9tIHByb3BlbnNpdHlcIl07XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBvcHRpb25zID0gdGhpcy5nZXRSZWFjdGlvblR5cGVMYWJlbHMoKTtcbiAgICB9XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZWFjdGlvblR5cGVTZWxlY3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICdSZWFjdGlvbiBUeXBlOicsXG4gICAgICBuYW1lOiAncmVhY3Rpb24tdHlwZScsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICB2YWx1ZTogUmVhY3Rpb25UeXBlc1tzZWxmLm1vZGVsLnJlYWN0aW9uVHlwZV0ubGFiZWwsXG4gICAgfSk7XG4gICAgdmFyIHJhdGVQYXJhbWV0ZXJWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3JhdGUnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICB0ZXh0QXR0cmlidXRlOiAnbmFtZScsXG4gICAgICBlYWdlclZhbGlkYXRlOiB0cnVlLFxuICAgICAgb3B0aW9uczogdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLFxuICAgICAgLy8gRm9yIG5ldyByZWFjdGlvbnMgKHdpdGggbm8gcmF0ZS5uYW1lKSBqdXN0IHVzZSB0aGUgZmlyc3QgcGFyYW1ldGVyIGluIHRoZSBQYXJhbWV0ZXJzIGNvbGxlY3Rpb25cbiAgICAgIC8vIEVsc2UgZmV0Y2ggdGhlIHJpZ2h0IFBhcmFtZXRlciBmcm9tIFBhcmFtZXRlcnMgYmFzZWQgb24gZXhpc3RpbmcgcmF0ZVxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwucmF0ZS5uYW1lID8gdGhpcy5nZXRSYXRlRnJvbVBhcmFtZXRlcnModGhpcy5tb2RlbC5yYXRlLm5hbWUpIDogdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLmF0KDApLFxuICAgIH0pO1xuICAgIHZhciBwcm9wZW5zaXR5VmlldyA9IG5ldyBJbnB1dFZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBuYW1lOiAncmF0ZScsXG4gICAgICBsYWJlbDogJycsXG4gICAgICB0ZXN0czonJyxcbiAgICAgIG1vZGVsS2V5Oidwcm9wZW5zaXR5JyxcbiAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wcm9wZW5zaXR5XG4gICAgfSk7XG4gICAgdmFyIHN1YmRvbWFpbnNWaWV3ID0gbmV3IFJlYWN0aW9uU3ViZG9tYWluc1ZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgaXNSZWFjdGlvbjogdHJ1ZSxcbiAgICB9KVxuICAgIHZhciByZWFjdGFudHNWaWV3ID0gbmV3IFJlYWN0YW50UHJvZHVjdFZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5yZWFjdGFudHMsXG4gICAgICBzcGVjaWVzOiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXMsXG4gICAgICByZWFjdGlvblR5cGU6IHRoaXMubW9kZWwucmVhY3Rpb25UeXBlLFxuICAgICAgZmllbGRUaXRsZTogJ1JlYWN0YW50cycsXG4gICAgICBpc1JlYWN0YW50czogdHJ1ZVxuICAgIH0pO1xuICAgIHZhciBwcm9kdWN0c1ZpZXcgPSBuZXcgUmVhY3RhbnRQcm9kdWN0Vmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnByb2R1Y3RzLFxuICAgICAgc3BlY2llczogdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLFxuICAgICAgcmVhY3Rpb25UeXBlOiB0aGlzLm1vZGVsLnJlYWN0aW9uVHlwZSxcbiAgICAgIGZpZWxkVGl0bGU6ICdQcm9kdWN0cycsXG4gICAgICBpc1JlYWN0YW50czogZmFsc2VcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhyZWFjdGlvblR5cGVTZWxlY3RWaWV3LCAnc2VsZWN0LXJlYWN0aW9uLXR5cGUnKTtcbiAgICB0aGlzLnJlbmRlclJlYWN0aW9uVHlwZXMoKTtcbiAgICBpZih0aGlzLm1vZGVsLnJlYWN0aW9uVHlwZSA9PT0gJ2N1c3RvbS1wcm9wZW5zaXR5Jyl7XG4gICAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhwcm9wZW5zaXR5VmlldywgJ3NlbGVjdC1yYXRlLXBhcmFtZXRlcicpXG4gICAgICB2YXIgaW5wdXRGaWVsZCA9IHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1yYXRlLXBhcmFtZXRlcicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdO1xuICAgICAgJChpbnB1dEZpZWxkKS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgXCItLS1ObyBFeHByZXNzaW9uIEVudGVyZWQtLS1cIik7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3JhdGUtcGFyYW1ldGVyLWxhYmVsJykpLnRleHQoJ1Byb3BlbnNpdHk6JylcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygncmF0ZS1wYXJhbWV0ZXItdG9vbHRpcCcpKS5wcm9wKCd0aXRsZScsIHRoaXMucGFyZW50LnRvb2x0aXBzLnByb3BlbnNpdHkpO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocmF0ZVBhcmFtZXRlclZpZXcsICdzZWxlY3QtcmF0ZS1wYXJhbWV0ZXInKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygncmF0ZS1wYXJhbWV0ZXItbGFiZWwnKSkudGV4dCgnUmF0ZSBQYXJhbWV0ZXI6JylcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygncmF0ZS1wYXJhbWV0ZXItdG9vbHRpcCcpKS5wcm9wKCd0aXRsZScsIHRoaXMucGFyZW50LnRvb2x0aXBzLnJhdGUpO1xuICAgIH1cbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzdWJkb21haW5zVmlldywgJ3N1YmRvbWFpbnMtZWRpdG9yJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocmVhY3RhbnRzVmlldywgJ3JlYWN0YW50cy1lZGl0b3InKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhwcm9kdWN0c1ZpZXcsICdwcm9kdWN0cy1lZGl0b3InKTtcbiAgICB0aGlzLnRvdGFsUmF0aW8gPSB0aGlzLmdldFRvdGFsUmVhY3RhbnRSYXRpbygpO1xuICAgIGlmKHRoaXMucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LmlzX3NwYXRpYWwpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N1YmRvbWFpbnMtZWRpdG9yJykpLmNvbGxhcHNlKCk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuXG4gICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVSZWFjdGlvblR5cGVPcHRpb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfSxcbiAgc2VsZWN0UmF0ZVBhcmFtOiBmdW5jdGlvbiAoZSkge1xuICAgIGlmKHRoaXMubW9kZWwucmVhY3Rpb25UeXBlICE9PSAnY3VzdG9tLXByb3BlbnNpdHknKSB7XG4gICAgICB2YXIgdmFsID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICAgIHZhciBwYXJhbSA9IHRoaXMuZ2V0UmF0ZUZyb21QYXJhbWV0ZXJzKHZhbCk7XG4gICAgICB0aGlzLm1vZGVsLnJhdGUgPSBwYXJhbSB8fCB0aGlzLm1vZGVsLnJhdGU7XG4gICAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24udHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICB9XG4gIH0sXG4gIGdldFJhdGVGcm9tUGFyYW1ldGVyczogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAvLyBTZWVtcyBsaWtlIG1vZGVsLnJhdGUgaXMgbm90IGFjdHVhbGx5IHBhcnQgb2YgdGhlIFBhcmFtZXRlcnMgY29sbGVjdGlvblxuICAgIC8vIEdldCB0aGUgUGFyYW1ldGVyIGZyb20gUGFyYW1ldGVycyB0aGF0IG1hdGNoZXMgbW9kZWwucmF0ZVxuICAgIC8vIFRPRE8gdGhpcyBpcyBzb21lIGdhcmJhZ2lvLCBnZXQgbW9kZWwucmF0ZSBpbnRvIFBhcmFtZXRlcnMgY29sbGVjdGlvbi4uLj9cbiAgICBpZiAoIW5hbWUpICB7IG5hbWUgPSB0aGlzLm1vZGVsLnJhdGUubmFtZSB9IFxuICAgIHZhciByYXRlID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLmZpbHRlcihmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHJldHVybiBwYXJhbS5uYW1lID09PSBuYW1lO1xuICAgIH0pWzBdO1xuICAgIHJldHVybiByYXRlIFxuICB9LFxuICBzZWxlY3RSZWFjdGlvblR5cGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGxhYmVsID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudmFsdWU7XG4gICAgdmFyIHR5cGUgPSBfLmZpbmRLZXkoUmVhY3Rpb25UeXBlcywgZnVuY3Rpb24gKG8pIHsgcmV0dXJuIG8ubGFiZWwgPT09IGxhYmVsOyB9KTtcbiAgICB0aGlzLm1vZGVsLnJlYWN0aW9uVHlwZSA9IHR5cGU7XG4gICAgdGhpcy5tb2RlbC5zdW1tYXJ5ID0gbGFiZWxcbiAgICB0aGlzLnVwZGF0ZVN0b2ljaFNwZWNpZXNGb3JSZWFjdGlvblR5cGUodHlwZSk7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgdGhpcy5tb2RlbC50cmlnZ2VyKCdjaGFuZ2UtcmVhY3Rpb24nKVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH0sXG4gIHVwZGF0ZVN0b2ljaFNwZWNpZXNGb3JSZWFjdGlvblR5cGU6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIGFyZ3MgPSB0aGlzLnBhcmVudC5nZXRTdG9pY2hBcmdzRm9yUmVhY3Rpb25UeXBlKHR5cGUpO1xuICAgIHZhciBuZXdSZWFjdGFudHMgPSB0aGlzLmdldEFycmF5T2ZEZWZhdWx0U3RvaWNoU3BlY2llcyhhcmdzLnJlYWN0YW50cyk7XG4gICAgdmFyIG5ld1Byb2R1Y3RzID0gdGhpcy5nZXRBcnJheU9mRGVmYXVsdFN0b2ljaFNwZWNpZXMoYXJncy5wcm9kdWN0cyk7XG4gICAgdGhpcy5tb2RlbC5yZWFjdGFudHMucmVzZXQobmV3UmVhY3RhbnRzKTtcbiAgICB0aGlzLm1vZGVsLnByb2R1Y3RzLnJlc2V0KG5ld1Byb2R1Y3RzKTtcbiAgICBpZih0eXBlICE9PSAnY3VzdG9tLXByb3BlbnNpdHknKVxuICAgICAgdGhpcy5tb2RlbC5yYXRlID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLmdldERlZmF1bHRSYXRlKCk7XG4gIH0sXG4gIGdldEFycmF5T2ZEZWZhdWx0U3RvaWNoU3BlY2llczogZnVuY3Rpb24gKGFycikge1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHZhciBzdG9pY2hTcGVjaWUgPSBuZXcgU3RvaWNoU3BlY2llKHBhcmFtcyk7XG4gICAgICBzdG9pY2hTcGVjaWUuc3BlY2llID0gdGhpcy5wYXJlbnQuZ2V0RGVmYXVsdFNwZWNpZSgpO1xuICAgICAgcmV0dXJuIHN0b2ljaFNwZWNpZTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgZ2V0UmVhY3Rpb25UeXBlTGFiZWxzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF8ubWFwKFJlYWN0aW9uVHlwZXMsIGZ1bmN0aW9uICh2YWwsIGtleSkgeyByZXR1cm4gdmFsLmxhYmVsOyB9KVxuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBnZXRUb3RhbFJlYWN0YW50UmF0aW86IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5yZWFjdGFudHMubGVuZ3RoO1xuICB9LFxuICB1cGRhdGVTdWJkb21haW5zOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHZhciBzdWJkb21haW4gPSBlbGVtZW50LnZhbHVlLm1vZGVsO1xuICAgIHZhciBjaGVja2VkID0gZWxlbWVudC52YWx1ZS5jaGVja2VkO1xuXG4gICAgaWYoY2hlY2tlZClcbiAgICAgIHRoaXMubW9kZWwuc3ViZG9tYWlucyA9IF8udW5pb24odGhpcy5tb2RlbC5zdWJkb21haW5zLCBbc3ViZG9tYWluLm5hbWVdKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLm1vZGVsLnN1YmRvbWFpbnMgPSBfLmRpZmZlcmVuY2UodGhpcy5tb2RlbC5zdWJkb21haW5zLCBbc3ViZG9tYWluLm5hbWVdKTtcbiAgfSxcbiAgcmVuZGVyUmVhY3Rpb25UeXBlczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgZGlzcGxheU1vZGU6IHRydWUsXG4gICAgICBvdXRwdXQ6ICdodG1sJ1xuICAgIH1cbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snY3JlYXRpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LXJlYWN0aW9uLXR5cGUnKS5maXJzdENoaWxkLmNoaWxkcmVuWzFdWycwJ10sIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydkZXN0cnVjdGlvbiddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtcmVhY3Rpb24tdHlwZScpLmZpcnN0Q2hpbGQuY2hpbGRyZW5bMV1bJzEnXSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2NoYW5nZSddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtcmVhY3Rpb24tdHlwZScpLmZpcnN0Q2hpbGQuY2hpbGRyZW5bMV1bJzInXSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2RpbWVyaXphdGlvbiddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtcmVhY3Rpb24tdHlwZScpLmZpcnN0Q2hpbGQuY2hpbGRyZW5bMV1bJzMnXSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ21lcmdlJ10ubGFiZWwsIHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1yZWFjdGlvbi10eXBlJykuZmlyc3RDaGlsZC5jaGlsZHJlblsxXVsnNCddLCBvcHRpb25zKTtcbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snc3BsaXQnXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LXJlYWN0aW9uLXR5cGUnKS5maXJzdENoaWxkLmNoaWxkcmVuWzFdWyc1J10sIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydmb3VyJ10ubGFiZWwsIHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1yZWFjdGlvbi10eXBlJykuZmlyc3RDaGlsZC5jaGlsZHJlblsxXVsnNiddLCBvcHRpb25zKTtcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIga2F0ZXggPSByZXF1aXJlKCdrYXRleCcpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25MaXN0aW5nLnB1ZycpO1xuXG5sZXQgcmVhY3Rpb25Bbm5vdGF0aW9uTW9kYWxIdG1sID0gKHJlYWN0aW9uTmFtZSwgYW5ub3RhdGlvbikgPT4ge1xuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJyZWFjdGlvbkFubm90YXRpb25Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+QW5ub3RhdGlvbiBmb3IgJHtyZWFjdGlvbk5hbWV9PC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxzcGFuIGZvcj1cInJlYWN0aW9uQW5ub3RhdGlvbklucHV0XCI+QW5ub3RhdGlvbjogPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJyZWFjdGlvbkFubm90YXRpb25JbnB1dFwiIG5hbWU9XCJyZWFjdGlvbkFubm90YXRpb25JbnB1dFwiIHNpemU9XCIzMFwiIGF1dG9mb2N1cyB2YWx1ZT1cIiR7YW5ub3RhdGlvbn1cIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBvay1tb2RlbC1idG5cIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5uYW1lJyA6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBob29rOiAnaW5wdXQtbmFtZS1jb250YWluZXInXG4gICAgfSxcbiAgICAnbW9kZWwuc3VtbWFyeScgOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlLCBwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgIGthdGV4LnJlbmRlcih0aGlzLm1vZGVsLnN1bW1hcnksIHRoaXMucXVlcnlCeUhvb2soJ3N1bW1hcnknKSwge1xuICAgICAgICAgIGRpc3BsYXlNb2RlOiB0cnVlLFxuICAgICAgICAgIG91dHB1dDogJ2h0bWwnLFxuICAgICAgICAgIG1heFNpemU6IDUsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGhvb2s6ICdzdW1tYXJ5JyxcbiAgICB9LFxuICAgICdtb2RlbC5zZWxlY3RlZCcgOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlLCBwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgIGVsLmNoZWNrZWQgPSB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBob29rOiAnc2VsZWN0J1xuICAgIH1cbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZWRpdC1hbm5vdGF0aW9uLWJ0bl0nIDogJ2VkaXRBbm5vdGF0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1zZWxlY3RdJyAgOiAnc2VsZWN0UmVhY3Rpb24nLFxuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nICA6ICdyZW1vdmVSZWFjdGlvbidcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAkKGRvY3VtZW50KS5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJCgnW2F1dG9mb2N1c10nLCBlLnRhcmdldCkuZm9jdXMoKTtcbiAgICB9KTtcbiAgICBpZighdGhpcy5tb2RlbC5hbm5vdGF0aW9uKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnZWRpdC1hbm5vdGF0aW9uLWJ0bicpKS50ZXh0KCdBZGQnKVxuICAgIH1cbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHNlbGVjdFJlYWN0aW9uOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi50cmlnZ2VyKFwic2VsZWN0XCIsIHRoaXMubW9kZWwpO1xuICB9LFxuICByZW1vdmVSZWFjdGlvbjogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlUmVhY3Rpb24odGhpcy5tb2RlbCk7XG4gICAgdGhpcy5wYXJlbnQuY29sbGVjdGlvbi50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICB9LFxuICBlZGl0QW5ub3RhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbmFtZSA9IHRoaXMubW9kZWwubmFtZTtcbiAgICB2YXIgYW5ub3RhdGlvbiA9IHRoaXMubW9kZWwuYW5ub3RhdGlvbjtcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVhY3Rpb25Bbm5vdGF0aW9uTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JlYWN0aW9uQW5ub3RhdGlvbk1vZGFsJykucmVtb3ZlKCk7XG4gICAgfVxuICAgIGxldCBtb2RhbCA9ICQocmVhY3Rpb25Bbm5vdGF0aW9uTW9kYWxIdG1sKG5hbWUsIGFubm90YXRpb24pKS5tb2RhbCgpO1xuICAgIGxldCBva0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZWFjdGlvbkFubm90YXRpb25Nb2RhbCAub2stbW9kZWwtYnRuJyk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JlYWN0aW9uQW5ub3RhdGlvbk1vZGFsICNyZWFjdGlvbkFubm90YXRpb25JbnB1dCcpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT09IDEzKXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb2tCdG4uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBva0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLm1vZGVsLmFubm90YXRpb24gPSBpbnB1dC52YWx1ZTtcbiAgICAgIHNlbGYucGFyZW50LnJlbmRlclJlYWN0aW9uTGlzdGluZ1ZpZXcoKTtcbiAgICAgIG1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgfSk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXROYW1lOiB7XG4gICAgICBob29rOiAnaW5wdXQtbmFtZS1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLm5hbWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ25hbWUnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwubmFtZSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgU3ViZG9tYWluc1ZpZXcgPSByZXF1aXJlKCcuL3N1YmRvbWFpbicpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9yZWFjdGlvblN1YmRvbWFpbnMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaXNSZWFjdGlvbiA9IGFyZ3MuaXNSZWFjdGlvbjtcbiAgICB0aGlzLmJhc2VNb2RlbCA9IHRoaXMucGFyZW50LnBhcmVudC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICB0aGlzLmJhc2VNb2RlbC5vbignbWVzaC11cGRhdGUnLCB0aGlzLnVwZGF0ZURlZmF1bHRTdWJkb21haW5zLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJTdWJkb21haW5zKCk7XG4gIH0sXG4gIHVwZGF0ZURlZmF1bHRTdWJkb21haW5zOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wYXJlbnQubW9kZWwuc3ViZG9tYWlucyA9IHRoaXMuYmFzZU1vZGVsLm1lc2hTZXR0aW5ncy51bmlxdWVTdWJkb21haW5zLm1hcChmdW5jdGlvbiAobW9kZWwpIHtyZXR1cm4gbW9kZWwubmFtZTsgfSk7XG4gICAgdGhpcy5yZW5kZXJTdWJkb21haW5zKCk7XG4gIH0sXG4gIHJlbmRlclN1YmRvbWFpbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmJhc2VNb2RlbCA9IHRoaXMucGFyZW50Lm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgIGlmKHRoaXMuc3ViZG9tYWluc1ZpZXcpXG4gICAgICB0aGlzLnN1YmRvbWFpbnNWaWV3LnJlbW92ZSgpO1xuICAgIHZhciBzdWJkb21haW5zID0gdGhpcy5iYXNlTW9kZWwubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnM7XG4gICAgdGhpcy5zdWJkb21haW5zVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHN1YmRvbWFpbnMsXG4gICAgICBTdWJkb21haW5zVmlldyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ3JlYWN0aW9uLXN1YmRvbWFpbnMnKVxuICAgICk7XG4gIH0sXG4gIHVwZGF0ZVN1YmRvbWFpbnM6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdGhpcy5wYXJlbnQudXBkYXRlU3ViZG9tYWlucyhlbGVtZW50KTtcbiAgfSxcbn0pOyIsInZhciBWaWV3U3dpdGNoZXIgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldy1zd2l0Y2hlcicpO1xudmFyIGthdGV4ID0gcmVxdWlyZSgna2F0ZXgnKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vY29uZmlnXG52YXIgUmVhY3Rpb25UeXBlcyA9IHJlcXVpcmUoJy4uL3JlYWN0aW9uLXR5cGVzJyk7XG4vL21vZGVsc1xudmFyIFN0b2ljaFNwZWNpZXNDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL3N0b2ljaC1zcGVjaWVzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgUmVhY3Rpb25MaXN0aW5nVmlldyA9IHJlcXVpcmUoJy4vcmVhY3Rpb24tbGlzdGluZycpO1xudmFyIFJlYWN0aW9uRGV0YWlsc1ZpZXcgPSByZXF1aXJlKCcuL3JlYWN0aW9uLWRldGFpbHMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zRWRpdG9yLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jcmVhdGlvbl0nICAgICAgICAgICAgICAgOiAnaGFuZGxlQWRkUmVhY3Rpb25DbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZGVzdHJ1Y3Rpb25dJyAgICAgICAgICAgIDogJ2hhbmRsZUFkZFJlYWN0aW9uQ2xpY2snLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNoYW5nZV0nICAgICAgICAgICAgICAgICA6ICdoYW5kbGVBZGRSZWFjdGlvbkNsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1kaW1lcml6YXRpb25dJyAgICAgICAgICAgOiAnaGFuZGxlQWRkUmVhY3Rpb25DbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9bWVyZ2VdJyAgICAgICAgICAgICAgICAgIDogJ2hhbmRsZUFkZFJlYWN0aW9uQ2xpY2snLFxuICAgICdjbGljayBbZGF0YS1ob29rPXNwbGl0XScgICAgICAgICAgICAgICAgICA6ICdoYW5kbGVBZGRSZWFjdGlvbkNsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1mb3VyXScgICAgICAgICAgICAgICAgICAgOiAnaGFuZGxlQWRkUmVhY3Rpb25DbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y3VzdG9tLW1hc3NhY3Rpb25dJyAgICAgIDogJ2hhbmRsZUFkZFJlYWN0aW9uQ2xpY2snLFxuICAgICdjbGljayBbZGF0YS1ob29rPWN1c3RvbS1wcm9wZW5zaXR5XScgICAgICA6ICdoYW5kbGVBZGRSZWFjdGlvbkNsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCdcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudG9vbHRpcHMgPSB7XCJuYW1lXCI6XCJOYW1lcyBmb3Igc3BlY2llcywgcGFyYW1ldGVycywgcmVhY3Rpb25zLCBldmVudHMsIGFuZCBydWxlcyBtdXN0IGJlIHVuaXF1ZS5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwiYW5ub3RhdGlvblwiOlwiQW4gb3B0aW9uYWwgbm90ZSBhYm91dCB0aGUgcmVhY3Rpb24uXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInJhdGVcIjpcIlRoZSByYXRlIG9mIHRoZSBtYXNzLWFjdGlvbiByZWFjdGlvbi5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwicHJvcGVuc2l0eVwiOlwiVGhlIGN1c3RvbSBwcm9wZW5zaXR5IGV4cHJlc3Npb24gZm9yIHRoZSByZWFjdGlvbi5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwicmVhY3RhbnRcIjpcIlRoZSByZWFjdGFudHMgdGhhdCBhcmUgY29uc3VtZWQgaW4gdGhlIHJlYWN0aW9uLCB3aXRoIHN0b2ljaGlvbWV0cnkuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInByb2R1Y3RcIjpcIlRoZSBzcGVjaWVzIHRoYXQgYXJlIGNyZWF0ZWQgYnkgdGhlIHJlYWN0aW9uIGV2ZW50LCB3aXRoIHN0b2ljaGlvbWV0cnkuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcInJlYWN0aW9uXCI6XCJGb3IgYSBzcGVjaWVzIHRoYXQgaXMgTk9UIGNvbnN1bWVkIGluIHRoZSByZWFjdGlvbiBidXQgaXMgcGFydCBvZiBhIG1hc3NcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWN0aW9uIHJlYWN0aW9uLCBhZGQgaXQgYXMgYm90aCBhIHJlYWN0YW50IGFuZCBhIHByb2R1Y3QuXFxuXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk1hc3MtYWN0aW9uIHJlYWN0aW9ucyBtdXN0IGFsc28gaGF2ZSBhIHJhdGUgdGVybSBhZGRlZC4gTm90ZSB0aGF0IHRoZSBpbnB1dFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyYXRlIHJlcHJlc2VudHMgdGhlIG1hc3MtYWN0aW9uIGNvbnN0YW50IHJhdGUgaW5kZXBlbmRlbnQgb2Ygdm9sdW1lLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICB0aGlzLmNvbGxlY3Rpb24ub24oXCJzZWxlY3RcIiwgZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB0aGlzLnNldFNlbGVjdGVkUmVhY3Rpb24ocmVhY3Rpb24pO1xuICAgICAgdGhpcy5zZXREZXRhaWxzVmlldyhyZWFjdGlvbik7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKFwicmVtb3ZlXCIsIGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgLy8gU2VsZWN0IHRoZSBsYXN0IHJlYWN0aW9uIGJ5IGRlZmF1bHRcbiAgICAgIC8vIEJ1dCBvbmx5IGlmIHRoZXJlIGFyZSBvdGhlciByZWFjdGlvbnMgb3RoZXIgdGhhbiB0aGUgb25lIHdlJ3JlIHJlbW92aW5nXG4gICAgICBpZiAocmVhY3Rpb24uZGV0YWlsc1ZpZXcpXG4gICAgICAgIHJlYWN0aW9uLmRldGFpbHNWaWV3LnJlbW92ZSgpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVJlYWN0aW9uKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZCA9IHRoaXMuY29sbGVjdGlvbi5hdCh0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoLTEpO1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24udHJpZ2dlcihcInNlbGVjdFwiLCBzZWxlY3RlZCk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVBZGRSZWFjdGlvbkJ1dHRvbiwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVSZWFjdGlvblR5cGVzLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJSZWFjdGlvbkxpc3RpbmdWaWV3KCk7XG4gICAgdGhpcy5kZXRhaWxzQ29udGFpbmVyID0gdGhpcy5xdWVyeUJ5SG9vaygncmVhY3Rpb24tZGV0YWlscy1jb250YWluZXInKTtcbiAgICB0aGlzLmRldGFpbHNWaWV3U3dpdGNoZXIgPSBuZXcgVmlld1N3aXRjaGVyKHtcbiAgICAgIGVsOiB0aGlzLmRldGFpbHNDb250YWluZXIsXG4gICAgfSk7XG4gICAgaWYgKHRoaXMuY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWRSZWFjdGlvbih0aGlzLmNvbGxlY3Rpb24uYXQoMCkpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3RlZFJlYWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgdGhpcy50b2dnbGVBZGRSZWFjdGlvbkJ1dHRvbigpO1xuICAgIGlmKHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPiAwKXtcbiAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1yZWFjdGlvbi1wYXJ0aWFsJykpLnByb3AoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tZnVsbCcpKS5wcm9wKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJSZWFjdGlvblR5cGVzKCk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXJSZWFjdGlvbkxpc3RpbmdWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5yZWFjdGlvbkxpc3RpbmdWaWV3KXtcbiAgICAgIHRoaXMucmVhY3Rpb25MaXN0aW5nVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5yZWFjdGlvbkxpc3RpbmdWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgUmVhY3Rpb25MaXN0aW5nVmlldyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ3JlYWN0aW9uLWxpc3QnKVxuICAgICk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICB0b2dnbGVBZGRSZWFjdGlvbkJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWRkLXJlYWN0aW9uLWZ1bGwnKSkucHJvcCgnZGlzYWJsZWQnLCAodGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLmxlbmd0aCA8PSAwKSk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tcGFydGlhbCcpKS5wcm9wKCdkaXNhYmxlZCcsICh0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXMubGVuZ3RoIDw9IDApKTtcbiAgfSxcbiAgdG9nZ2xlUmVhY3Rpb25UeXBlczogZnVuY3Rpb24gKGUsIHByZXYsIGN1cnIpIHtcbiAgICBpZihjdXJyICYmIGN1cnIuYWRkICYmIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPT09IDEpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tZnVsbCcpKS5wcm9wKCdoaWRkZW4nLCBmYWxzZSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1yZWFjdGlvbi1wYXJ0aWFsJykpLnByb3AoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1lbHNlIGlmKGN1cnIgJiYgIWN1cnIuYWRkICYmIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPT09IDApe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tZnVsbCcpKS5wcm9wKCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWRkLXJlYWN0aW9uLXBhcnRpYWwnKSkucHJvcCgnaGlkZGVuJywgZmFsc2UpO1xuICAgIH1cbiAgfSxcbiAgc2V0U2VsZWN0ZWRSZWFjdGlvbjogZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG0pIHsgbS5zZWxlY3RlZCA9IGZhbHNlOyB9KTtcbiAgICByZWFjdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3RlZFJlYWN0aW9uID0gcmVhY3Rpb247XG4gIH0sXG4gIHNldERldGFpbHNWaWV3OiBmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICByZWFjdGlvbi5kZXRhaWxzVmlldyA9IHJlYWN0aW9uLmRldGFpbHNWaWV3IHx8IHRoaXMubmV3RGV0YWlsc1ZpZXcocmVhY3Rpb24pO1xuICAgIHRoaXMuZGV0YWlsc1ZpZXdTd2l0Y2hlci5zZXQocmVhY3Rpb24uZGV0YWlsc1ZpZXcpO1xuICB9LFxuICBoYW5kbGVBZGRSZWFjdGlvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciByZWFjdGlvblR5cGUgPSBlLmRlbGVnYXRlVGFyZ2V0LmRhdGFzZXQuaG9vaztcbiAgICB2YXIgc3RvaWNoQXJncyA9IHRoaXMuZ2V0U3RvaWNoQXJnc0ZvclJlYWN0aW9uVHlwZShyZWFjdGlvblR5cGUpO1xuICAgIHZhciBzdWJkb21haW5zID0gdGhpcy5wYXJlbnQubW9kZWwubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMubWFwKGZ1bmN0aW9uIChtb2RlbCkge3JldHVybiBtb2RlbC5uYW1lfSlcbiAgICB2YXIgcmVhY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb24uYWRkUmVhY3Rpb24ocmVhY3Rpb25UeXBlLCBzdG9pY2hBcmdzLCBzdWJkb21haW5zKTtcbiAgICByZWFjdGlvbi5kZXRhaWxzVmlldyA9IHRoaXMubmV3RGV0YWlsc1ZpZXcocmVhY3Rpb24pO1xuICAgIHRoaXMuY29sbGVjdGlvbi50cmlnZ2VyKFwic2VsZWN0XCIsIHJlYWN0aW9uKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0U3RvaWNoQXJnc0ZvclJlYWN0aW9uVHlwZTogZnVuY3Rpb24odHlwZSkge1xuICAgIHZhciBhcmdzID0gUmVhY3Rpb25UeXBlc1t0eXBlXTtcbiAgICByZXR1cm4gYXJncztcbiAgfSxcbiAgbmV3RGV0YWlsc1ZpZXc6IGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgIHZhciBkZXRhaWxzVmlldyA9IG5ldyBSZWFjdGlvbkRldGFpbHNWaWV3KHsgbW9kZWw6IHJlYWN0aW9uIH0pO1xuICAgIGRldGFpbHNWaWV3LnBhcmVudCA9IHRoaXM7XG4gICAgcmV0dXJuIGRldGFpbHNWaWV3XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJylcbiAgfSxcbiAgZ2V0RGVmYXVsdFNwZWNpZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcy5tb2RlbHNbMF07XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICBnZXRBbm5vdGF0aW9uOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiBSZWFjdGlvblR5cGVzW3R5cGVdLmxhYmVsXG4gIH0sXG4gIHJlbmRlclJlYWN0aW9uVHlwZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGRpc3BsYXlNb2RlOiBmYWxzZSxcbiAgICAgIG91dHB1dDogJ2h0bWwnLFxuICAgIH1cbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snY3JlYXRpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnY3JlYXRpb24nKSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2Rlc3RydWN0aW9uJ10ubGFiZWwsIHRoaXMucXVlcnlCeUhvb2soJ2Rlc3RydWN0aW9uJyksIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydjaGFuZ2UnXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnY2hhbmdlJyksIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydkaW1lcml6YXRpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnZGltZXJpemF0aW9uJyksIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydtZXJnZSddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdtZXJnZScpLCBvcHRpb25zKTtcbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snc3BsaXQnXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc3BsaXQnKSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2ZvdXInXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnZm91cicpLCBvcHRpb25zKTtcbiAgfVxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBSdWxlVmlldyA9IHJlcXVpcmUoJy4vZWRpdC1ydWxlJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3J1bGVFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXJhdGUtcnVsZV0nIDogJ2FkZFJ1bGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWFzc2lnbm1lbnQtcnVsZV0nIDogJ2FkZFJ1bGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVBZGRSdWxlQnV0dG9uLCB0aGlzKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnMub24oJ2FkZCByZW1vdmUnLCB0aGlzLnRvZ2dsZUFkZFJ1bGVCdXR0b24sIHRoaXMpO1xuICAgIHRoaXMudG9vbHRpcHMgPSB7XCJuYW1lXCI6XCJOYW1lcyBmb3Igc3BlY2llcywgcGFyYW1ldGVycywgcmVhY3Rpb25zLCBldmVudHMsIGFuZCBydWxlcyBtdXN0IGJlIHVuaXF1ZS5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOlwiQXNzaWdubWVudCBSdWxlczogQW4gYXNzaWdubWVudCBydWxlIGRlc2NyaWJlcyBhIGNoYW5nZSB0byBhIFNwZWNpZXMgb3IgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJQYXJhbWV0ZXIgYXMgYSBmdW5jdGlvbiB3aG9zZSBsZWZ0LWhhbmQgc2lkZSBpcyBhIHNjYWxhciAoaS5lLiB4ID0gZihWKSwgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aGVyZSBWIGlzIGEgdmVjdG9yIG9mIHN5bWJvbHMsIG5vdCBpbmNsdWRpbmcgeCkuPGJyPiAgUmF0ZSBSdWxlczogQSByYXRlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicnVsZSBkZXNjcmliZXMgYSBjaGFuZ2UgdG8gYSBTcGVjaWVzIG9yIFBhcmFtZXRlciBhcyBhIGZ1bmN0aW9uIHdob3NlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGVmdC1oYW5kIHNpZGUgaXMgYSByYXRlIG9mIGNoYW5nZSAoaS5lLiBkeC9kdCA9IGYoVyksIHdoZXJlIFcgaXMgYSB2ZWN0b3IgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvZiBzeW1ib2xzIHdoaWNoIG1heSBpbmNsdWRlIHgpLlwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZVwiOlwiVGFyZ2V0IHZhcmlhYmxlIHRvIGJlIG1vZGlmaWVkIGJ5IHRoZSBSdWxlJ3MgZm9ybXVsYS5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwiZXhwcmVzc2lvblwiOlwiQSBQeXRob24gZXZhbHVhYmxlIG1hdGhlbWF0aWNhbCBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyaWdodCBoYW5kIHNpZGUgb2YgYSBydWxlIGZ1bmN0aW9uLjxicj4gIEZvciBBc3NpZ25tZW50IFJ1bGVzLCB0aGlzIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVwcmVzZW50cyB0aGUgcmlnaHQgaGFuZCBzaWRlIG9mIGEgc2NhbGFyIGVxdWF0aW9uLjxicj4gIEZvciBSYXRlIFJ1bGVzLCBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRoaXMgcmVwcmVzZW50cyB0aGUgcmlnaHQgaGFuZCBzaWRlIG9mIGEgcmF0ZS1vZi1jaGFuZ2UgZXF1YXRpb24uXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImFubm90YXRpb25cIjpcIkFuIG9wdGlvbmFsIG5vdGUgYWJvdXQgYSBydWxlLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJSdWxlcygpO1xuICAgIHRoaXMudG9nZ2xlQWRkUnVsZUJ1dHRvbigpXG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXJSdWxlczogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMucnVsZXNWaWV3KSB7XG4gICAgICB0aGlzLnJ1bGVzVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5ydWxlc1ZpZXcgPSB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICBSdWxlVmlldyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ3J1bGUtbGlzdC1jb250YWluZXInKVxuICAgICk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICB0b2dnbGVBZGRSdWxlQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJSdWxlcygpO1xuICAgIHZhciBudW1TcGVjaWVzID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLmxlbmd0aDtcbiAgICB2YXIgbnVtUGFyYW1ldGVycyA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGg7XG4gICAgdmFyIGRpc2FibGVkID0gbnVtU3BlY2llcyA8PSAwICYmIG51bVBhcmFtZXRlcnMgPD0gMFxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWRkLXJ1bGUnKSkucHJvcCgnZGlzYWJsZWQnLCBkaXNhYmxlZCk7XG4gIH0sXG4gIGFkZFJ1bGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHR5cGUgPSBlLnRhcmdldC5kYXRhc2V0Lm5hbWVcbiAgICB0aGlzLmNvbGxlY3Rpb24uYWRkUnVsZSh0eXBlKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgRWRpdEZ1bmN0aW9uRGVmaW5pdGlvbiA9IHJlcXVpcmUoJy4vZWRpdC1mdW5jdGlvbi1kZWZpbml0aW9uJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3NibWxDb21wb25lbnRFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCgnY29sbGFwc2UnKTtcbiAgICB9LFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXScgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCgnY29sbGFwc2UtZnVuY3Rpb24tZGVmaW5pdGlvbnMnKTtcbiAgICB9LFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50b29sdGlwcyA9IHtcImFubm90YXRpb25cIjpcIkFuIG9wdGlvbmFsIG5vdGUgYWJvdXQgdGhlIEZ1bmN0aW9uIERlZmluaXRpb24uXCJ9XG4gICAgdGhpcy5mdW5jdGlvbkRlZmluaXRpb25zID0gYXR0cnMuZnVuY3Rpb25EZWZpbml0aW9ucztcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJFZGlyRnVuY3Rpb25EZWZpbml0aW9uVmlldygpO1xuICB9LFxuICByZW5kZXJFZGlyRnVuY3Rpb25EZWZpbml0aW9uVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuZWRpdEZ1bmN0aW9uRGVmaW5pdGlvblZpZXcpe1xuICAgICAgdGhpcy5lZGl0RnVuY3Rpb25EZWZpbml0aW9uVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5lZGl0RnVuY3Rpb25EZWZpbml0aW9uVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHRoaXMuZnVuY3Rpb25EZWZpbml0aW9ucyxcbiAgICAgIEVkaXRGdW5jdGlvbkRlZmluaXRpb24sXG4gICAgICB0aGlzLnF1ZXJ5QnlIb29rKCdmdW5jdGlvbi1kZWZpbml0aW9uLWxpc3QnKVxuICAgICk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChob29rKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soaG9vaykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soaG9vaykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vayhob29rKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBFZGl0Tm9uc3BhdGlhbFNwZWNpZVZpZXcgPSByZXF1aXJlKCcuL2VkaXQtc3BlY2llJyk7XG52YXIgRWRpdFNwYXRpYWxTcGVjaWVWaWV3ID0gcmVxdWlyZSgnLi9lZGl0LXNwYXRpYWwtc3BlY2llJyk7XG52YXIgRWRpdEFkdmFuY2VkU3BlY2llID0gcmVxdWlyZSgnLi9lZGl0LWFkdmFuY2VkLXNwZWNpZScpO1xuLy90ZW1wbGF0ZXNcbnZhciBub25zcGF0aWFsU3BlY2llVGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BlY2llc0VkaXRvci5wdWcnKTtcbnZhciBzcGF0aWFsU3BlY2llVGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BhdGlhbFNwZWNpZXNFZGl0b3IucHVnJyk7XG5cbmxldCByZW5kZXJEZWZhdWx0TW9kZU1vZGFsSHRtbCA9ICgpID0+IHtcbiAgbGV0IGNvbmNlbnRyYXRpb25EZXNjaXB0aW9uID0gYFNwZWNpZXMgd2lsbCBvbmx5IGJlIHJlcHJlc2VudGVkIGRldGVybWluaXN0aWNhbGx5LmA7XG4gIGxldCBwb3B1bGF0aW9uRGVzY3JpcHRpb24gPSBgU3BlY2llcyB3aWxsIG9ubHkgYmUgcmVwcmVzZW50ZWQgc3RvY2hhc3RpY2FsbHkuYDtcbiAgbGV0IGh5YnJpZERlc2NyaXB0aW9uID0gYEFsbG93cyBhIHNwZWNpZXMgdG8gYmUgcmVwcmVzZW50ZWQgZGV0ZXJtaW5pc3RpY2FsbHkgYW5kL29yIHN0b2NoYXN0aWNhbGx5LiAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhpcyBhbGxvdyB5b3UgdG8gY3VzdG9taXplIHRoZSBtb2RlIG9mIGluZGl2aWR1YWwgc3BlY2llcyBhbmQgc2V0IHRoZSBzd2l0Y2hpbmcgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9sZXJhbmNlIG9yIG1pbmltdW0gdmFsdWUgZm9yIHN3aXRjaGluZy5cImA7XG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwiZGVmYXVsdE1vZGVNb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5EZWZhdWx0IFNwZWNpZXMgTW9kZSAocmVxdWlyZWQpPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2UgY2xvc2UtbW9kYWxcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgIFRoZSBkZWZhdWx0IG1vZGUgaXMgdXNlZCB0byBzZXQgdGhlIG1vZGUgb2YgYWxsIHNwZWNpZXMgYWRkZWQgdG8gdGhlIG1vZGVsLiAgXG4gICAgICAgICAgICAgICAgVGhlIG1vZGUgb2YgYSBzcGVjaWVzIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGhvdyBpdCB3aWxsIGJlIHJlcHJlc2VudGVkIGluIGEgSHlicmlkIHNpbXVsYXRpb24uXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPHA+U2VsZWN0IG9uZSBvZiB0aGUgZm9sbG93aW5nOiA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZWZhdWx0LW1vZGVcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgY29uY2VudHJhdGlvbi1idG4gYm94LXNoYWRvd1wiPkNvbmNlbnRyYXRpb248L2J1dHRvbj5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9XCJtYXJnaW4tdG9wOiA1cHg7XCI+JHtjb25jZW50cmF0aW9uRGVzY2lwdGlvbn08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZWZhdWx0LW1vZGVcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgcG9wdWxhdGlvbi1idG4gYm94LXNoYWRvd1wiPlBvcHVsYXRpb248L2J1dHRvbj5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9XCJtYXJnaW4tdG9wOiA1cHg7XCI+JHtwb3B1bGF0aW9uRGVzY3JpcHRpb259PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVmYXVsdC1tb2RlXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGh5YnJpZC1idG4gYm94LXNoYWRvd1wiPkh5YnJpZCBDb25jZW50cmF0aW9uL1BvcHVsYXRpb248L2J1dHRvbj5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9XCJtYXJnaW4tdG9wOiA1cHg7XCI+JHtoeWJyaWREZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1hbGwtY29udGludW91c10nIDogJ2dldERlZmF1bHRTcGVjaWVzTW9kZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWFsbC1kaXNjcmV0ZV0nIDogJ2dldERlZmF1bHRTcGVjaWVzTW9kZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWFkdmFuY2VkXScgOiAnZ2V0RGVmYXVsdFNwZWNpZXNNb2RlJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1hZGQtc3BlY2llc10nIDogJ2hhbmRsZUFkZFNwZWNpZXNDbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuYmFzZU1vZGVsID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICB0aGlzLnRvb2x0aXBzID0ge1wibmFtZVwiOlwiTmFtZXMgZm9yIHNwZWNpZXMsIHBhcmFtZXRlcnMsIHJlYWN0aW9ucywgZXZlbnRzLCBhbmQgcnVsZXMgbXVzdCBiZSB1bmlxdWUuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcImluaXRpYWxWYWx1ZVwiOlwiSW5pdGlhbCBwb3B1bGF0aW9uIG9mIGEgc3BlY2llcy5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwiYW5ub3RhdGlvblwiOlwiQW4gb3B0aW9uYWwgbm90ZSBhYm91dCB0aGUgc3BlY2llcy5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwicmVtb3ZlXCI6XCJBIHNwZWNpZXMgbWF5IG9ubHkgYmUgcmVtb3ZlZCBpZiBpdCBpcyBub3QgYSBwYXJ0IG9mIGFueSByZWFjdGlvbiwgZXZlbnQgYXNzaWdubWVudCwgb3IgcnVsZS5cIixcbiAgICAgICAgICAgICAgICAgICAgIFwic3BlY2llc01vZGVcIjpcIkNvbmNlbnRyYXRpb24gLSBTcGVjaWVzIHdpbGwgb25seSBiZSByZXByZXNlbnRlZCBhcyBkZXRlcm1pbmlzdGljLjxicj5cIiArIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiUG9wdWxhdGlvbiAtIFNwZWNpZXMgd2lsbCBvbmx5IGJlIHJlcHJlc2VudGVkIGFzIHN0b2NoYXN0aWMuPGJyPlwiICsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJIeWJyaWQgQ29uY2VudHJhdGlvbi9Qb3B1bGF0aW9uIC0gQWxsb3dzIGEgc3BlY2llcyB0byBiZSByZXByZXNlbnRlZCBcIiArIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXMgZWl0aGVyIGRldGVybWluaXN0aWMgb3Igc3RvY2hhc3RpYy4gVGhpcyBhbGxvdyB5b3UgdG8gY3VzdG9taXplIHRoZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1vZGUgb2YgaW5kaXZpZHVhbCBzcGVjaWVzIGFuZCBzZXQgdGhlIHN3aXRjaGluZyB0b2xlcmFuY2Ugb3IgbWluaW11bSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlIGZvciBzd2l0Y2hpbmcuXCIsXG4gICAgICAgICAgICAgICAgICAgICBcIm1vZGVcIjpcIkNvbmNlbnRyYXRpb24gLSBTcGVjaWVzIHdpbGwgb25seSBiZSByZXByZXNlbnRlZCBhcyBkZXRlcm1pbmlzdGljLjxicj5cIiArIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiUG9wdWxhdGlvbiAtIFNwZWNpZXMgd2lsbCBvbmx5IGJlIHJlcHJlc2VudGVkIGFzIHN0b2NoYXN0aWMuPGJyPlwiICsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJIeWJyaWQgQ29uY2VudHJhdGlvbi9Qb3B1bGF0aW9uIC0gQWxsb3dzIGEgc3BlY2llcyB0byBiZSByZXByZXNlbnRlZCBcIiArIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGV0ZXJtaW5pc3RpY2FsbHkgYW5kL29yIHN0b2NoYXN0aWNhbGx5LlwiLFxuICAgICAgICAgICAgICAgICAgICAgXCJzd2l0Y2hWYWx1ZVwiOlwiU3dpdGNoaW5nIFRvbGVyYW5jZSAtIFRvbGVyYW5jZSBsZXZlbCBmb3IgY29uc2lkZXJpbmcgYSBkeW5hbWljIHNwZWNpZXMgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXRlcm1pbmlzdGljYWxseSwgdmFsdWUgaXMgY29tcGFyZWQgdG8gYW4gZXN0aW1hdGVkIHNkL21lYW4gcG9wdWxhdGlvbiBvZiBhIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3BlY2llcyBhZnRlciBhIGdpdmVuIHRpbWUgc3RlcC4gVGhpcyB2YWx1ZSB3aWxsIGJlIHVzZWQgaWYgYSBzd2l0Y2hfbWluIGlzIG5vdCBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb3ZpZGVkLjxicj5NaW5pbXVtIFZhbHVlIEZvciBTd2l0Y2hpbmcgLSBNaW5pbXVtIHBvcHVsYXRpb24gdmFsdWUgYXQgd2hpY2ggXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzcGVjaWVzIHdpbGwgYmUgcmVwcmVzZW50ZWQgYXMgQ29uY2VudHJhdGlvbi5cIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKCd1cGRhdGUtc3BlY2llcycsIGZ1bmN0aW9uIChjb21wSUQsIHNwZWNpZSwgaXNOYW1lVXBkYXRlKSB7XG4gICAgICBzZWxmLmNvbGxlY3Rpb24ucGFyZW50LnJlYWN0aW9ucy5tYXAoZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICAgIHJlYWN0aW9uLnJlYWN0YW50cy5tYXAoZnVuY3Rpb24gKHJlYWN0YW50KSB7XG4gICAgICAgICAgaWYocmVhY3RhbnQuc3BlY2llLmNvbXBJRCA9PT0gY29tcElEKSB7XG4gICAgICAgICAgICByZWFjdGFudC5zcGVjaWUgPSBzcGVjaWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmVhY3Rpb24ucHJvZHVjdHMubWFwKGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgICAgICAgaWYocHJvZHVjdC5zcGVjaWUuY29tcElEID09PSBjb21wSUQpIHtcbiAgICAgICAgICAgIHByb2R1Y3Quc3BlY2llID0gc3BlY2llO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmKGlzTmFtZVVwZGF0ZSkge1xuICAgICAgICAgIHJlYWN0aW9uLmJ1aWxkU3VtbWFyeSgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICByZWFjdGlvbi5jaGVja01vZGVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5jb2xsZWN0aW9uLnBhcmVudC5ldmVudHNDb2xsZWN0aW9uLm1hcChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuZXZlbnRBc3NpZ25tZW50cy5tYXAoZnVuY3Rpb24gKGFzc2lnbm1lbnQpIHtcbiAgICAgICAgICBpZihhc3NpZ25tZW50LnZhcmlhYmxlLmNvbXBJRCA9PT0gY29tcElEKSB7XG4gICAgICAgICAgICBhc3NpZ25tZW50LnZhcmlhYmxlID0gc3BlY2llO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYoaXNOYW1lVXBkYXRlICYmIGV2ZW50LnNlbGVjdGVkKSB7XG4gICAgICAgICAgZXZlbnQuZGV0YWlsc1ZpZXcucmVuZGVyRXZlbnRBc3NpZ25tZW50cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGYuY29sbGVjdGlvbi5wYXJlbnQucnVsZXMubWFwKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgIGlmKHJ1bGUudmFyaWFibGUuY29tcElEID09PSBjb21wSUQpIHtcbiAgICAgICAgICBydWxlLnZhcmlhYmxlID0gc3BlY2llO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmKGlzTmFtZVVwZGF0ZSkge1xuICAgICAgICBzZWxmLnJlbmRlclNwZWNpZXNBZHZhbmNlZFZpZXcoKTtcbiAgICAgICAgc2VsZi5wYXJlbnQucmVuZGVyUnVsZXNWaWV3KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLnBhcmVudC5tb2RlbC5pc19zcGF0aWFsID8gc3BhdGlhbFNwZWNpZVRlbXBsYXRlIDogbm9uc3BhdGlhbFNwZWNpZVRlbXBsYXRlO1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBkZWZhdWx0TW9kZSA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuZGVmYXVsdE1vZGU7XG4gICAgaWYoZGVmYXVsdE1vZGUgPT09IFwiXCIpe1xuICAgICAgdGhpcy5nZXRJbml0aWFsRGVmYXVsdFNwZWNpZXNNb2RlKCk7XG4gICAgfWVsc2V7XG4gICAgICB2YXIgZGF0YUhvb2tzID0geydjb250aW51b3VzJzonYWxsLWNvbnRpbnVvdXMnLCAnZGlzY3JldGUnOidhbGwtZGlzY3JldGUnLCAnZHluYW1pYyc6J2FkdmFuY2VkJ31cbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vayhkYXRhSG9va3NbdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5kZWZhdWx0TW9kZV0pKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcbiAgICAgIGlmKGRlZmF1bHRNb2RlID09PSBcImR5bmFtaWNcIil7XG4gICAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtc3BlY2llcycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlbmRlckVkaXRTcGVjaWVzVmlldygpO1xuICAgIHRoaXMucmVuZGVyU3BlY2llc0FkdmFuY2VkVmlldygpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIGdldEluaXRpYWxEZWZhdWx0U3BlY2llc01vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZmF1bHRNb2RlTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZmF1bHRNb2RlTW9kYWwnKS5yZW1vdmUoKVxuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKHJlbmRlckRlZmF1bHRNb2RlTW9kYWxIdG1sKCkpLm1vZGFsKCk7XG4gICAgbGV0IGNvbnRpbnVvdXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVmYXVsdE1vZGVNb2RhbCAuY29uY2VudHJhdGlvbi1idG4nKTtcbiAgICBsZXQgZGlzY3JldGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVmYXVsdE1vZGVNb2RhbCAucG9wdWxhdGlvbi1idG4nKTtcbiAgICBsZXQgZHluYW1pYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWZhdWx0TW9kZU1vZGFsIC5oeWJyaWQtYnRuJyk7XG4gICAgY29udGludW91cy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLnNldEluaXRpYWxEZWZhdWx0TW9kZShtb2RhbCwgXCJjb250aW51b3VzXCIpO1xuICAgIH0pO1xuICAgIGRpc2NyZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYuc2V0SW5pdGlhbERlZmF1bHRNb2RlKG1vZGFsLCBcImRpc2NyZXRlXCIpO1xuICAgIH0pO1xuICAgIGR5bmFtaWMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5zZXRJbml0aWFsRGVmYXVsdE1vZGUobW9kYWwsIFwiZHluYW1pY1wiKTtcbiAgICB9KTtcbiAgfSxcbiAgc2V0SW5pdGlhbERlZmF1bHRNb2RlOiBmdW5jdGlvbiAobW9kYWwsIG1vZGUpIHtcbiAgICB2YXIgZGF0YUhvb2tzID0geydjb250aW51b3VzJzonYWxsLWNvbnRpbnVvdXMnLCAnZGlzY3JldGUnOidhbGwtZGlzY3JldGUnLCAnZHluYW1pYyc6J2FkdmFuY2VkJ31cbiAgICBtb2RhbC5tb2RhbCgnaGlkZScpXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKGRhdGFIb29rc1ttb2RlXSkpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuICAgIHRoaXMuc2V0QWxsU3BlY2llc01vZGVzKG1vZGUpXG4gIH0sXG4gIGdldERlZmF1bHRTcGVjaWVzTW9kZTogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5zZXRBbGxTcGVjaWVzTW9kZXMoZS50YXJnZXQuZGF0YXNldC5uYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmNvbGxlY3Rpb24udHJpZ2dlcigndXBkYXRlLXNwZWNpZXMnLCBzcGVjaWUuY29tcElELCBzcGVjaWUsIGZhbHNlKVxuICAgIH0pO1xuICB9LFxuICBzZXRBbGxTcGVjaWVzTW9kZXM6IGZ1bmN0aW9uIChkZWZhdWx0TW9kZSkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuZGVmYXVsdE1vZGUgPSBkZWZhdWx0TW9kZTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ubWFwKGZ1bmN0aW9uIChzcGVjaWUpIHsgXG4gICAgICBzcGVjaWUubW9kZSA9IGRlZmF1bHRNb2RlXG4gICAgfSk7XG4gICAgaWYoZGVmYXVsdE1vZGUgPT09IFwiZHluYW1pY1wiKXtcbiAgICAgIHRoaXMucmVuZGVyU3BlY2llc0FkdmFuY2VkVmlldygpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkdmFuY2VkLXNwZWNpZXMnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtc3BlY2llcycpKS5jb2xsYXBzZSgnaGlkZScpO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyRWRpdFNwZWNpZXNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5lZGl0U3BlY2llc1ZpZXcpe1xuICAgICAgdGhpcy5lZGl0U3BlY2llc1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHZhciBlZGl0U3BlY2llVmlldyA9ICF0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmlzX3NwYXRpYWwgPyBFZGl0Tm9uc3BhdGlhbFNwZWNpZVZpZXcgOiBFZGl0U3BhdGlhbFNwZWNpZVZpZXc7XG4gICAgdGhpcy5lZGl0U3BlY2llc1ZpZXcgPSB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICBlZGl0U3BlY2llVmlldyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ3NwZWNpZS1saXN0JylcbiAgICApO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU3BlY2llc0FkdmFuY2VkVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuc3BlY2llc0FkdmFuY2VkVmlldykge1xuICAgICAgdGhpcy5zcGVjaWVzQWR2YW5jZWRWaWV3LnJlbW92ZSgpXG4gICAgfVxuICAgIHRoaXMuc3BlY2llc0FkdmFuY2VkVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIEVkaXRBZHZhbmNlZFNwZWNpZSwgdGhpcy5xdWVyeUJ5SG9vaygnZWRpdC1zcGVjaWVzLW1vZGUnKSk7XG4gIH0sXG4gIGhhbmRsZUFkZFNwZWNpZXNDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRlZmF1bHRNb2RlID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5kZWZhdWx0TW9kZTtcbiAgICBpZihkZWZhdWx0TW9kZSA9PT0gXCJcIil7XG4gICAgICB0aGlzLmdldEluaXRpYWxEZWZhdWx0U3BlY2llc01vZGUoKTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuYWRkU3BlY2llcygpO1xuICAgIH1cbiAgfSxcbiAgYWRkU3BlY2llczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdWJkb21haW5zID0gdGhpcy5iYXNlTW9kZWwubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMubWFwKGZ1bmN0aW9uIChtb2RlbCkge3JldHVybiBtb2RlbC5uYW1lOyB9KTtcbiAgICB0aGlzLmNvbGxlY3Rpb24uYWRkU3BlY2llKHN1YmRvbWFpbnMpO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcblxuICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHNwZWNpZVN1YmRvbWFpblRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3N1YmRvbWFpbi5wdWcnKTtcbnZhciByZWFjdGlvblN1YmRvbWFpblRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uU3ViZG9tYWluLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHNwZWNpZVN1YmRvbWFpblRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3ViZG9tYWluc10nIDogJ3VwZGF0ZVN1YmRvbWFpbicsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXRoaXMucGFyZW50LmlzUmVhY3Rpb24pXG4gICAgICB2YXIgY2hlY2tlZCA9IF8uY29udGFpbnModGhpcy5wYXJlbnQubW9kZWwuc3ViZG9tYWlucywgdGhpcy5tb2RlbC5uYW1lKTtcbiAgICBlbHNle1xuICAgICAgdGhpcy50ZW1wbGF0ZSA9IHJlYWN0aW9uU3ViZG9tYWluVGVtcGxhdGU7XG4gICAgICB2YXIgY2hlY2tlZCA9IF8uY29udGFpbnModGhpcy5wYXJlbnQucGFyZW50Lm1vZGVsLnN1YmRvbWFpbnMsIHRoaXMubW9kZWwubmFtZSk7XG4gICAgfVxuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3ViZG9tYWluJykpLnByb3AoJ2NoZWNrZWQnLCBjaGVja2VkKTtcbiAgfSxcbiAgdXBkYXRlU3ViZG9tYWluOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMucGFyZW50LnVwZGF0ZVN1YmRvbWFpbnMoe25hbWU6ICdzdWJkb21haW4nLCB2YWx1ZToge21vZGVsOiB0aGlzLm1vZGVsLCBjaGVja2VkOiBlLnRhcmdldC5jaGVja2VkfX0pXG4gIH0sXG59KTsiXSwic291cmNlUm9vdCI6IiJ9