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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"input-name-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"input-value-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv" + (" class=\"tooltip-icon-large\""+" data-hook=\"annotation-tooltip\" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.model.annotation || "Click 'Add' to add an annotation", true, true)) + "\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"file-alt\" class=\"svg-inline--fa fa-file-alt fa-w-12\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 384 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm\" data-hook=\"edit-annotation-btn\"\u003EEdit\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/editRule.pug":
/*!************************************************!*\
  !*** ./client/templates/includes/editRule.pug ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"rule-name\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"rule-type\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"rule-variable\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"rule-expression\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv" + (" class=\"tooltip-icon-large\""+" data-hook=\"annotation-tooltip\" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.model.annotation || "Click 'Add' to add an annotation", true, true)) + "\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"file-alt\" class=\"svg-inline--fa fa-file-alt fa-w-12\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 384 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm\" data-hook=\"edit-annotation-btn\"\u003EEdit\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EVariable\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.parent.tooltips.variable, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EExpression\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.parent.parent.tooltips.assignmentExpression, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"event-assignments-container\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cbutton class=\"btn btn-outline-primary\" data-hook=\"add-event-assignment\" type=\"button\"\u003EAdd Assignment\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" data-hook=\"select\" name=\"event-select\"\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"event-name-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv" + (" class=\"tooltip-icon-large\""+" data-hook=\"annotation-tooltip\" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.model.annotation || "Click 'Add' to add an annotation", true, true)) + "\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"file-alt\" class=\"svg-inline--fa fa-file-alt fa-w-12\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 384 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm\" data-hook=\"edit-annotation-btn\"\u003EEdit\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/eventsEditor.pug":
/*!****************************************************!*\
  !*** ./client/templates/includes/eventsEditor.pug ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"events\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EEvents\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#events-container\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"events-container\" data-hook=\"events\"\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-6 container-part\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EEdit\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"event-listing-container\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6 container-part\" data-hook=\"event-details-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-primary\" data-hook=\"add-event\" type=\"button\"\u003EAdd Event\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"mdl-edit-btn\"\u003E\u003Cbutton class=\"btn btn-primary\" data-hook=\"save\"\u003ESave\u003C\u002Fbutton\u003E\u003Cdiv class=\"mdl-edit-btn saving-status\" data-hook=\"saving-mdl\"\u003E\u003Cdiv class=\"spinner-grow\"\u003E\u003C\u002Fdiv\u003E\u003Cspan\u003ESaving...\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-edit-btn saved-status\" data-hook=\"saved-mdl\"\u003E\u003Cspan\u003ESaved\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary\" data-hook=\"run\"\u003ERun Preview\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-primary\" data-hook=\"start-workflow\"\u003ENew Workflow\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/parametersEditor.pug":
/*!********************************************************!*\
  !*** ./client/templates/includes/parametersEditor.pug ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"parameters-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003EParameters\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-parameters\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-parameters\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EExpression\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.expression, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ERemove\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.remove, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"parameter-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cbutton class=\"btn btn-outline-primary\" data-hook=\"add-parameter\" type=\"button\"\u003EAdd Parameter\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" data-hook=\"select\" name=\"reaction-select\"\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"name\"\u003E\u003Cdiv data-hook=\"input-name-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv data-hook=\"summary\" style=\"width: auto !important\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv" + (" class=\"tooltip-icon-large\""+" data-hook=\"annotation-tooltip\" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.model.annotation || "Click 'Add' to add an annotation", true, true)) + "\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"file-alt\" class=\"svg-inline--fa fa-file-alt fa-w-12\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 384 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-secondary btn-sm\" data-hook=\"edit-annotation-btn\"\u003EEdit\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cbutton class=\"btn btn-outline-secondary\" data-hook=\"remove\"\u003EX\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"reactions-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EReactions\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.reaction, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-reaction\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fh3\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-reaction\"\u003E\u003Cp\u003EDefine reactions. Select from the given reaction templates, or use the custom types. \nUsing templated reaction types will help eliminate errors. \nFor non-linear reactions, use the custom propensity type. \u003C\u002Fp\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-7 container-part\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EEdit\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ESummary\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"reaction-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-5 container-part\" data-hook=\"reaction-details-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"dropdown\"\u003E\u003Cbutton class=\"btn btn-outline-primary dropdown-toggle\" id=\"addReactionBtn\" data-hook=\"add-reaction-full\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" type=\"button\"\u003EAdd Reaction \u003Cspan class=\"caret\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Cul class=\"dropdown-menu\" aria-labelledby=\"addReactionBtn\"\u003E\u003Cli class=\"dropdown-item\" data-hook=\"creation\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"destruction\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"change\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"dimerization\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"merge\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"split\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"four\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-divider\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"custom-massaction\"\u003ECustom mass action\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"custom-propensity\"\u003ECustom propensity\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"dropdown\"\u003E\u003Cbutton class=\"btn btn-outline-primary dropdown-toggle\" id=\"addReactionBtn\" data-hook=\"add-reaction-partial\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" type=\"button\"\u003EAdd Reaction \u003Cspan class=\"caret\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Cul class=\"dropdown-menu\" aria-labelledby=\"addReactionBtn\"\u003E\u003Cli class=\"dropdown-item\" data-hook=\"custom-propensity\"\u003ECustom propensity\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./client/templates/includes/ruleEditor.pug":
/*!**************************************************!*\
  !*** ./client/templates/includes/ruleEditor.pug ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"rules-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ERules\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-rules\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-rules\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EType\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.type, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EVariable\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.variable, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EExpression\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.expression, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"rule-list-container\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cdiv class=\"dropdown\"\u003E\u003Cbutton class=\"btn btn-outline-primary dropdown-toggle\" id=\"addRuleBtn\" data-hook=\"add-rule\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" type=\"button\"\u003EAdd Rule \u003Cspan class=\"caret\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Cul class=\"dropdown-menu\" aria-labelledby=\"addRuleBtn\"\u003E\u003Cli class=\"dropdown-item\" data-hook=\"rate-rule\" data-name=\"Rate Rule\"\u003ERate Rule\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"assignment-rule\" data-name=\"Assignment Rule\"\u003EAssignment Rule\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"species-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003ESpecies\u003C\u002Fh3\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-species\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-species\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EInitial Condition\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.initialValue, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ERemove\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.remove, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"specie-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\" colspan=\"3\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESpecies Mode\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.speciesMode, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"species-mode\" data-hook=\"all-continuous\" data-name=\"continuous\"\u003E Concentration\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"species-mode\" data-hook=\"all-discrete\" data-name=\"discrete\"\u003E Population\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput type=\"radio\" name=\"species-mode\" data-hook=\"advanced\" data-name=\"dynamic\"\u003E Hybrid Concentration\u002FPopulation\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cdiv class=\"collapse\" data-hook=\"advanced-species\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EName\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EMode\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.mode, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\" colspan=\"2\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003ESwitching Settings (Hybrid Only)\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.switchValue, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"edit-species-mode\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-primary\" data-hook=\"add-species\" type=\"button\"\u003EAdd Species\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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
//support files
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
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
    this.tooltips = Tooltips.eventsEditor
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

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
//support files
var tests = __webpack_require__(/*! ./tests */ "./client/views/tests.js");
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
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
    this.tooltips = Tooltips.modelSettings
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
//support files
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
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
    this.tooltips = Tooltips.parametersEditor
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
//support files
var ReactionTypes = __webpack_require__(/*! ../reaction-types */ "./client/reaction-types.js");
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
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
    this.tooltips = Tooltips.reactionsEditor
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
//support files
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
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
    this.tooltips = Tooltips.rulesEditor
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
//support files
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
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
    this.tooltips = Tooltips.sbmlComponentsEditor
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
//support files
var Tooltips = __webpack_require__(/*! ../tooltips */ "./client/tooltips.js");
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
            <h5 class="modal-title">Default Species Mode</h5>
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
            </div>
            <div class="default-mode">
              <button type="button" class="btn btn-primary concentration-btn">Concentration</button>
              <p style="margin-top: 5px;">${concentrationDesciption}</p>
            </div>
            <div class="default-mode">
              <button type="button" class="btn btn-primary population-btn">Population</button>
              <p style="margin-top: 5px;">${populationDescription}</p>
            </div>
            <div class="default-mode">
              <button type="button" class="btn btn-primary hybrid-btn">Hybrid Concentration/Population</button>
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
    this.tooltips = Tooltips.speciesEditor
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL21vZGVsLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvcmVhY3Rpb24tdHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0QWR2YW5jZWRTcGVjaWUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdEN1c3RvbVN0b2ljaFNwZWNpZS5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0RXZlbnRBc3NpZ25tZW50LnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRGdW5jdGlvbkRlZmluaXRpb24ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdEluaXRpYWxDb25kaXRpb24ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFBsYWNlRGV0YWlscy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0UmVhY3Rpb25WYXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFJ1bGUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFNjYXR0ZXJEZXRhaWxzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRTcGF0aWFsU3BlY2llLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRTdG9pY2hTcGVjaWUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRBc3NpZ25tZW50c0VkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudERldGFpbHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRMaXN0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudHNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvaW5pdGlhbENvbmRpdGlvbnNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvbWVzaEVkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFNldHRpbmdzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL21vZGVsU3RhdGVCdXR0b25zLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3RhbnRQcm9kdWN0LnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uRGV0YWlscy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9yZWFjdGlvbkxpc3RpbmcucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25TdWJkb21haW4ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25TdWJkb21haW5zLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uc0VkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ydWxlRWRpdG9yLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3NibWxDb21wb25lbnRFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BhdGlhbFNwZWNpZXNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BlY2llc0VkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9zdWJkb21haW4ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvcGFnZXMvbW9kZWxFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LWFkdmFuY2VkLXNwZWNpZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZWRpdC1jdXN0b20tc3RvaWNoLXNwZWNpZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZWRpdC1ldmVudC1hc3NpZ25tZW50LmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LWZ1bmN0aW9uLWRlZmluaXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtaW5pdGlhbC1jb25kaXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtcGFyYW1ldGVyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LXBsYWNlLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtcnVsZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZWRpdC1zY2F0dGVyLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtc3BhdGlhbC1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtc3BlY2llLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LXN0b2ljaC1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50LWFzc2lnbm1lbnRzLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZXZlbnQtZGV0YWlscy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZXZlbnQtbGlzdGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50cy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2luaXRpYWwtY29uZGl0aW9ucy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL21lc2gtZWRpdG9yLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9tb2RlbC1zZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvbW9kZWwtc3RhdGUtYnV0dG9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvcGFyYW1ldGVycy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0YW50LXByb2R1Y3QuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9uLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9uLWxpc3RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9uLXN1YmRvbWFpbnMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9ucy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3J1bGVzLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvc2JtbC1jb21wb25lbnQtZWRpdG9yLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zcGVjaWVzLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvc3ViZG9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFw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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVE7QUFDUixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsOEI7QUFDakI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0Esc0RBQXNELDBCQUEwQixFQUFFO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EscURBQXFELGtCQUFrQixFQUFFO0FBQ3pFLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRTs7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bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0ZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soZGF0YSkge1xuIFx0XHR2YXIgY2h1bmtJZHMgPSBkYXRhWzBdO1xuIFx0XHR2YXIgbW9yZU1vZHVsZXMgPSBkYXRhWzFdO1xuIFx0XHR2YXIgZXhlY3V0ZU1vZHVsZXMgPSBkYXRhWzJdO1xuXG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG4gXHRcdFx0fVxuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGRhdGEpO1xuXG4gXHRcdHdoaWxlKHJlc29sdmVzLmxlbmd0aCkge1xuIFx0XHRcdHJlc29sdmVzLnNoaWZ0KCkoKTtcbiBcdFx0fVxuXG4gXHRcdC8vIGFkZCBlbnRyeSBtb2R1bGVzIGZyb20gbG9hZGVkIGNodW5rIHRvIGRlZmVycmVkIGxpc3RcbiBcdFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2guYXBwbHkoZGVmZXJyZWRNb2R1bGVzLCBleGVjdXRlTW9kdWxlcyB8fCBbXSk7XG5cbiBcdFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiBhbGwgY2h1bmtzIHJlYWR5XG4gXHRcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIFx0fTtcbiBcdGZ1bmN0aW9uIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCkge1xuIFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGRlZmVycmVkTW9kdWxlID0gZGVmZXJyZWRNb2R1bGVzW2ldO1xuIFx0XHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuIFx0XHRcdGZvcih2YXIgaiA9IDE7IGogPCBkZWZlcnJlZE1vZHVsZS5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGRlcElkID0gZGVmZXJyZWRNb2R1bGVbal07XG4gXHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbZGVwSWRdICE9PSAwKSBmdWxmaWxsZWQgPSBmYWxzZTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYoZnVsZmlsbGVkKSB7XG4gXHRcdFx0XHRkZWZlcnJlZE1vZHVsZXMuc3BsaWNlKGktLSwgMSk7XG4gXHRcdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGRlZmVycmVkTW9kdWxlWzBdKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4gXHQvLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0XCJlZGl0b3JcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL2NsaWVudC9wYWdlcy9tb2RlbC1lZGl0b3IuanNcIixcImNvbW1vblwiXSk7XG4gXHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIHJlYWR5XG4gXHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiIsInZhciBhcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBQYWdlVmlldyA9IHJlcXVpcmUoJy4uL3BhZ2VzL2Jhc2UnKTtcbnZhciBNZXNoRWRpdG9yVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL21lc2gtZWRpdG9yJyk7XG52YXIgU3BlY2llc0VkaXRvclZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9zcGVjaWVzLWVkaXRvcicpO1xudmFyIEluaXRpYWxDb25kaXRpb25zRWRpdG9yVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL2luaXRpYWwtY29uZGl0aW9ucy1lZGl0b3InKTtcbnZhciBQYXJhbWV0ZXJzRWRpdG9yVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3BhcmFtZXRlcnMtZWRpdG9yJyk7XG52YXIgUmVhY3Rpb25zRWRpdG9yVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3JlYWN0aW9ucy1lZGl0b3InKTtcbnZhciBFdmVudHNFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvZXZlbnRzLWVkaXRvcicpO1xudmFyIFJ1bGVzRWRpdG9yVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3J1bGVzLWVkaXRvcicpO1xudmFyIFNCTUxDb21wb25lbnRWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3Mvc2JtbC1jb21wb25lbnQtZWRpdG9yJyk7XG52YXIgTW9kZWxTZXR0aW5nc1ZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9tb2RlbC1zZXR0aW5ncycpO1xudmFyIE1vZGVsU3RhdGVCdXR0b25zVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL21vZGVsLXN0YXRlLWJ1dHRvbnMnKTtcbi8vbW9kZWxzXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvbW9kZWwnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcGFnZXMvbW9kZWxFZGl0b3IucHVnJyk7XG5cbmltcG9ydCBpbml0UGFnZSBmcm9tICcuL3BhZ2UuanMnO1xuXG5sZXQgb3BlcmF0aW9uSW5mb01vZGFsSHRtbCA9ICgpID0+IHtcbiAgbGV0IGVkaXRNb2RlbE1lc3NhZ2UgPSBgXG4gICAgPHA+PGI+U3BlY2llczwvYj46IEEgc3BlY2llcyByZWZlcnMgdG8gYSBwb29sIG9mIGVudGl0aWVzIHRoYXQgYXJlIGNvbnNpZGVyZWQgXG4gICAgICBpbmRpc3Rpbmd1aXNoYWJsZSBmcm9tIGVhY2ggb3RoZXIgZm9yIHRoZSBwdXJwb3NlcyBvZiB0aGUgbW9kZWwgYW5kIG1heSBwYXJ0aWNpcGF0ZSBcbiAgICAgIGluIHJlYWN0aW9ucy48L3A+XG4gICAgPHA+PGI+UGFyYW1ldGVyPC9iPjogQSBQYXJhbWV0ZXIgaXMgdXNlZCB0byBkZWZpbmUgYSBzeW1ib2wgYXNzb2NpYXRlZCB3aXRoIFxuICAgICAgYSB2YWx1ZTsgdGhpcyBzeW1ib2wgY2FuIHRoZW4gYmUgdXNlZCBpbiBtYXRoZW1hdGljYWwgZm9ybXVsYXMgaW4gYSBtb2RlbC48L3A+XG4gICAgPHA+PGI+UmVhY3Rpb248L2I+OiBBIHJlYWN0aW9uIGluIFNCTUwgcmVwcmVzZW50cyBhbnkga2luZCBvZiBwcm9jZXNzIHRoYXQgY2FuIGNoYW5nZSBcbiAgICAgIHRoZSBxdWFudGl0eSBvZiBvbmUgb3IgbW9yZSBzcGVjaWVzIGluIGEgbW9kZWwuICBBdCBsZWFzdCBvbmUgc3BlY2llcyBpcyByZXF1aXJlZCB0byBcbiAgICAgIGFkZCBhIHJlYWN0aW9uIGFuZCBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyIGlzIHJlcXVpcmVkIHRvIGFkZCBhIG1hc3MgYWN0aW9uIHJlYWN0aW9uLjwvcD5cbiAgICA8cD48Yj5FdmVudDwvYj46IEV2ZW50cyBkZXNjcmliZSB0aGUgdGltZSBhbmQgZm9ybSBvZiBpbnN0YW50YW5lb3VzLCBkaXNjb250aW51b3VzIHN0YXRlIFxuICAgICAgY2hhbmdlcyBpbiB0aGUgbW9kZWwuICBBbiBFdmVudCBvYmplY3QgZGVmaW5lcyB3aGVuIHRoZSBldmVudCBjYW4gb2NjdXIsIHRoZSB2YXJpYWJsZXMgXG4gICAgICB0aGF0IGFyZSBhZmZlY3RlZCBieSBpdCwgaG93IHRoZSB2YXJpYWJsZXMgYXJlIGFmZmVjdGVkLCBhbmQgdGhlIGV2ZW504oCZcyByZWxhdGlvbnNoaXAgXG4gICAgICB0byBvdGhlciBldmVudHMuICBBdCBsZWFzdCBvbmUgc3BlY2llcyBvciBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQgdG8gYWRkIGFuIGV2ZW50LjwvcD5cbiAgICA8cD48Yj5SdWxlPC9iPjogUnVsZXMgcHJvdmlkZSBhZGRpdGlvbmFsIHdheXMgdG8gZGVmaW5lIHRoZSB2YWx1ZXMgb2YgdmFyaWFibGVzIFxuICAgICAgaW4gYSBtb2RlbCwgdGhlaXIgcmVsYXRpb25zaGlwcywgYW5kIHRoZSBkeW5hbWljYWwgYmVoYXZpb3JzIG9mIHRob3NlIHZhcmlhYmxlcy4gIFRoZSBcbiAgICAgIHJ1bGUgdHlwZSBBc3NpZ25tZW50IFJ1bGUgaXMgdXNlZCB0byBleHByZXNzIGVxdWF0aW9ucyB0aGF0IHNldCB0aGUgdmFsdWVzIG9mIHZhcmlhYmxlcy4gIFxuICAgICAgVGhlIHJ1bGUgdHlwZSBSYXRlIFJ1bGUgaXMgdXNlZCB0byBleHByZXNzIGVxdWF0aW9ucyB0aGF0IGRldGVybWluZSB0aGUgcmF0ZXMgb2YgY2hhbmdlIFxuICAgICAgb2YgdmFyaWFibGVzLiAgQXQgbGVhc3Qgb25lIHNwZWNpZXMgb3IgcGFyYW1ldGVyIGlzIHJlcXVpcmVkIHRvIGFkZCBhIHJ1bGUuPC9wPlxuICAgIDxwPjxiPlByZXZpZXc8L2I+OiBBIHByZXZpZXcgb2YgdGhlIG1vZGVsIHNob3dzIHRoZSByZXN1bHRzIG9mIHRoZSBmaXJzdCBmaXZlIHNlY29uZHMgb2YgYSBcbiAgICAgIHNpbmdsZSB0cmFqZWN0b3J5IG9mIHRoZSBtb2RlbCBzaW11bGF0aW9uLiAgQXQgbGVhc3Qgb25lIHNwZWNpZXMgYW5kIG9uZSByZWFjdGlvbiwgZXZlbnQsIFxuICAgICAgb3IgcnVsZSBpcyByZXF1aXJlZCB0byBydW4gYSBwcmV2aWV3LjwvcD5cbiAgICA8cD48Yj5Xb3JrZmxvdzwvYj46IEEgd29ya2Zsb3cgYWxsb3dzIHlvdSB0byBydW4gYSBmdWxsIG1vZGVsIHdpdGggbXVsdGlwbGUgdHJhamVjdG9yaWVzIHdpdGggXG4gICAgICBzZXR0aW5ncyB0aGUgd2lsbCBoZWxwIHJlZmluZSB0aGUgc2ltdWxhdGlvbi4gIEF0IGxlYXN0IG9uZSBzcGVjaWVzIGFuZCBvbmUgcmVhY3Rpb24sIGV2ZW50LCBcbiAgICAgIG9yIHJ1bGUgaXMgcmVxdWlyZWQgdG8gY3JlYXRlIGEgbmV3IHdvcmtmbG93LjwvcD5cbiAgYDtcblxuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJvcGVyYXRpb25JbmZvTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQgaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+IE1vZGVsIEVkaXRvciBIZWxwIDwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8cD4gJHtlZGl0TW9kZWxNZXNzYWdlfSA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCBcbn1cblxubGV0IE1vZGVsRWRpdG9yID0gUGFnZVZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LW1vZGVsLWhlbHBdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBtb2RhbCA9ICQob3BlcmF0aW9uSW5mb01vZGFsSHRtbCgpKS5tb2RhbCgpO1xuICAgIH0sXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFBhZ2VWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXJlY3RvcnkgPSBkb2N1bWVudC5VUkwuc3BsaXQoJy9tb2RlbHMvZWRpdCcpLnBvcCgpO1xuICAgIHZhciBtb2RlbEZpbGUgPSBkaXJlY3Rvcnkuc3BsaXQoJy8nKS5wb3AoKTtcbiAgICB2YXIgbmFtZSA9IGRlY29kZVVSSShtb2RlbEZpbGUuc3BsaXQoJy4nKVswXSk7XG4gICAgdmFyIGlzU3BhdGlhbCA9IG1vZGVsRmlsZS5zcGxpdCgnLicpLnBvcCgpLnN0YXJ0c1dpdGgoJ3MnKTtcbiAgICB0aGlzLm1vZGVsID0gbmV3IE1vZGVsKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBkaXJlY3Rvcnk6IGRpcmVjdG9yeSxcbiAgICAgIGlzX3NwYXRpYWw6IGlzU3BhdGlhbCxcbiAgICAgIGlzUHJldmlldzogdHJ1ZSxcbiAgICB9KTtcbiAgICB0aGlzLm1vZGVsLmZldGNoKHtcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcbiAgICAgICAgc2VsZi5yZW5kZXJTdWJ2aWV3cygpO1xuICAgICAgICBpZighc2VsZi5tb2RlbC5pc19zcGF0aWFsKXtcbiAgICAgICAgICBzZWxmLnF1ZXJ5QnlIb29rKCdtZXNoLWVkaXRvci1jb250YWluZXInKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgc2VsZi5xdWVyeUJ5SG9vaygnaW5pdGlhbC1jb25kaXRpb25zLWVkaXRvci1jb250YWluZXInKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIXNlbGYubW9kZWwuZnVuY3Rpb25EZWZpbml0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICBzZWxmLnF1ZXJ5QnlIb29rKCdzYm1sLWNvbXBvbmVudC1jb250YWluZXInKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm1vZGVsLnJlYWN0aW9ucy5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAocmVhY3Rpb25zKSB7XG4gICAgICB0aGlzLnVwZGF0ZVNwZWNpZXNJblVzZSgpO1xuICAgICAgdGhpcy51cGRhdGVQYXJhbWV0ZXJzSW5Vc2UoKTtcbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLm1vZGVsLmV2ZW50c0NvbGxlY3Rpb24ub24oXCJhZGQgY2hhbmdlIHJlbW92ZVwiLCBmdW5jdGlvbiAoKXtcbiAgICAgIHRoaXMudXBkYXRlU3BlY2llc0luVXNlKCk7XG4gICAgICB0aGlzLnVwZGF0ZVBhcmFtZXRlcnNJblVzZSgpO1xuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMubW9kZWwucnVsZXMub24oXCJhZGQgY2hhbmdlIHJlbW92ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudXBkYXRlU3BlY2llc0luVXNlKCk7XG4gICAgICB0aGlzLnVwZGF0ZVBhcmFtZXRlcnNJblVzZSgpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlU3BlY2llc0luVXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLnNwZWNpZXM7XG4gICAgdmFyIHJlYWN0aW9ucyA9IHRoaXMubW9kZWwucmVhY3Rpb25zO1xuICAgIHZhciBldmVudHMgPSB0aGlzLm1vZGVsLmV2ZW50c0NvbGxlY3Rpb247XG4gICAgdmFyIHJ1bGVzID0gdGhpcy5tb2RlbC5ydWxlcztcbiAgICBzcGVjaWVzLmZvckVhY2goZnVuY3Rpb24gKHNwZWNpZSkgeyBzcGVjaWUuaW5Vc2UgPSBmYWxzZTsgfSk7XG4gICAgdmFyIHVwZGF0ZUluVXNlRm9yUmVhY3Rpb24gPSBmdW5jdGlvbiAoc3RvaWNoU3BlY2llKSB7XG4gICAgICBfLndoZXJlKHNwZWNpZXMubW9kZWxzLCB7IGNvbXBJRDogc3RvaWNoU3BlY2llLnNwZWNpZS5jb21wSUQgfSlcbiAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICAgICAgc3BlY2llLmluVXNlID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHZhciB1cGRhdGVJblVzZUZvck90aGVyID0gZnVuY3Rpb24gKHNwZWNpZSkge1xuICAgICAgXy53aGVyZShzcGVjaWVzLm1vZGVscywgeyBjb21wSUQ6IHNwZWNpZS5jb21wSUQgfSlcbiAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICAgICBzcGVjaWUuaW5Vc2UgPSB0cnVlO1xuICAgICAgIH0pO1xuICAgIH1cbiAgICByZWFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICAgIHJlYWN0aW9uLnByb2R1Y3RzLmZvckVhY2godXBkYXRlSW5Vc2VGb3JSZWFjdGlvbik7XG4gICAgICByZWFjdGlvbi5yZWFjdGFudHMuZm9yRWFjaCh1cGRhdGVJblVzZUZvclJlYWN0aW9uKTtcbiAgICB9KTtcbiAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LmV2ZW50QXNzaWdubWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXNzaWdubWVudCkge1xuICAgICAgICB1cGRhdGVJblVzZUZvck90aGVyKGFzc2lnbm1lbnQudmFyaWFibGUpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICB1cGRhdGVJblVzZUZvck90aGVyKHJ1bGUudmFyaWFibGUpO1xuICAgIH0pO1xuICB9LFxuICB1cGRhdGVQYXJhbWV0ZXJzSW5Vc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGFyYW1ldGVycyA9IHRoaXMubW9kZWwucGFyYW1ldGVycztcbiAgICB2YXIgcmVhY3Rpb25zID0gdGhpcy5tb2RlbC5yZWFjdGlvbnM7XG4gICAgdmFyIGV2ZW50cyA9IHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvbjtcbiAgICB2YXIgcnVsZXMgPSB0aGlzLm1vZGVsLnJ1bGVzO1xuICAgIHBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHsgcGFyYW0uaW5Vc2UgPSBmYWxzZTsgfSk7XG4gICAgdmFyIHVwZGF0ZUluVXNlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICBfLndoZXJlKHBhcmFtZXRlcnMubW9kZWxzLCB7IGNvbXBJRDogcGFyYW0uY29tcElEIH0pXG4gICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgICBwYXJhbS5pblVzZSA9IHRydWU7XG4gICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgdXBkYXRlSW5Vc2UocmVhY3Rpb24ucmF0ZSk7XG4gICAgfSk7XG4gICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBldmVudC5ldmVudEFzc2lnbm1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGFzc2lnbm1lbnQpIHtcbiAgICAgICAgdXBkYXRlSW5Vc2UoYXNzaWdubWVudC52YXJpYWJsZSlcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIHVwZGF0ZUluVXNlKHJ1bGUudmFyaWFibGUpO1xuICAgIH0pO1xuICB9LFxuICByZW5kZXJTdWJ2aWV3czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXNoRWRpdG9yID0gbmV3IE1lc2hFZGl0b3JWaWV3KHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLm1lc2hTZXR0aW5nc1xuICAgIH0pO1xuICAgIHZhciBzcGVjaWVzRWRpdG9yID0gbmV3IFNwZWNpZXNFZGl0b3JWaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuc3BlY2llc1xuICAgIH0pO1xuICAgIHZhciBpbml0aWFsQ29uZGl0aW9uc0VkaXRvciA9IG5ldyBJbml0aWFsQ29uZGl0aW9uc0VkaXRvclZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5pbml0aWFsQ29uZGl0aW9uc1xuICAgIH0pO1xuICAgIHZhciBwYXJhbWV0ZXJzRWRpdG9yID0gbmV3IFBhcmFtZXRlcnNFZGl0b3JWaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucGFyYW1ldGVyc1xuICAgIH0pO1xuICAgIHZhciByZWFjdGlvbnNFZGl0b3IgPSBuZXcgUmVhY3Rpb25zRWRpdG9yVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnJlYWN0aW9uc1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyRXZlbnRzVmlldygpO1xuICAgIHRoaXMucmVuZGVyUnVsZXNWaWV3KCk7XG4gICAgdmFyIHNibWxDb21wb25lbnRWaWV3ID0gbmV3IFNCTUxDb21wb25lbnRWaWV3KHtcbiAgICAgIGZ1bmN0aW9uRGVmaW5pdGlvbnM6IHRoaXMubW9kZWwuZnVuY3Rpb25EZWZpbml0aW9ucyxcbiAgICB9KTtcbiAgICB2YXIgbW9kZWxTZXR0aW5ncyA9IG5ldyBNb2RlbFNldHRpbmdzVmlldyh7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICBtb2RlbDogdGhpcy5tb2RlbC5tb2RlbFNldHRpbmdzLFxuICAgIH0pO1xuICAgIHZhciBtb2RlbFN0YXRlQnV0dG9ucyA9IG5ldyBNb2RlbFN0YXRlQnV0dG9uc1ZpZXcoe1xuICAgICAgbW9kZWw6IHRoaXMubW9kZWxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhtZXNoRWRpdG9yLCAnbWVzaC1lZGl0b3ItY29udGFpbmVyJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3BlY2llc0VkaXRvciwgJ3NwZWNpZXMtZWRpdG9yLWNvbnRhaW5lcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KGluaXRpYWxDb25kaXRpb25zRWRpdG9yLCAnaW5pdGlhbC1jb25kaXRpb25zLWVkaXRvci1jb250YWluZXInKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhwYXJhbWV0ZXJzRWRpdG9yLCAncGFyYW1ldGVycy1lZGl0b3ItY29udGFpbmVyJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocmVhY3Rpb25zRWRpdG9yLCAncmVhY3Rpb25zLWVkaXRvci1jb250YWluZXInKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzYm1sQ29tcG9uZW50VmlldywgJ3NibWwtY29tcG9uZW50LWNvbnRhaW5lcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KG1vZGVsU2V0dGluZ3MsICdtb2RlbC1zZXR0aW5ncy1jb250YWluZXInKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhtb2RlbFN0YXRlQnV0dG9ucywgJ21vZGVsLXN0YXRlLWJ1dHRvbnMtY29udGFpbmVyJyk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuXG4gICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIHJlbmRlckV2ZW50c1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLmV2ZW50c0VkaXRvcil7XG4gICAgICB0aGlzLmV2ZW50c0VkaXRvci5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5ldmVudHNFZGl0b3IgPSBuZXcgRXZlbnRzRWRpdG9yVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLmV2ZW50c0NvbGxlY3Rpb25cbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0aGlzLmV2ZW50c0VkaXRvciwgJ2V2ZW50cy1lZGl0b3ItY29udGFpbmVyJyk7XG4gIH0sXG4gIHJlbmRlclJ1bGVzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMucnVsZXNFZGl0b3Ipe1xuICAgICAgdGhpcy5ydWxlc0VkaXRvci5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5ydWxlc0VkaXRvciA9IG5ldyBSdWxlc0VkaXRvclZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5ydWxlc1xuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMucnVsZXNFZGl0b3IsICdydWxlcy1lZGl0b3ItY29udGFpbmVyJyk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gIH0sXG59KTtcblxuaW5pdFBhZ2UoTW9kZWxFZGl0b3IpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0aW9uOiB7XG4gICAgcmVhY3RhbnRzOiBbXSxcbiAgICBwcm9kdWN0czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBsYWJlbDogJ1xcXFxlbXB0eXNldCBcXFxccmlnaHRhcnJvdyBBJyxcbiAgfSxcbiAgZGVzdHJ1Y3Rpb246IHtcbiAgICByZWFjdGFudHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgcHJvZHVjdHM6IFtdLFxuICAgIGxhYmVsOiAnQSBcXFxccmlnaHRhcnJvdyBcXFxcZW1wdHlzZXQnXG4gIH0sXG4gIGNoYW5nZToge1xuICAgIHJlYWN0YW50czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBwcm9kdWN0czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBsYWJlbDogJ0EgXFxcXHJpZ2h0YXJyb3cgQidcbiAgfSxcbiAgZGltZXJpemF0aW9uOiB7XG4gICAgcmVhY3RhbnRzOiBbIHsgcmF0aW86IDIgfSBdLFxuICAgIHByb2R1Y3RzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIGxhYmVsOiAnMkEgXFxcXHJpZ2h0YXJyb3cgQidcbiAgfSxcbiAgbWVyZ2U6IHtcbiAgICByZWFjdGFudHM6IFsgeyByYXRpbzogMSB9LCB7IHJhdGlvOiAxIH0gXSxcbiAgICBwcm9kdWN0czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBsYWJlbDogJ0EgKyBCIFxcXFxyaWdodGFycm93IEMnXG4gIH0sXG4gIHNwbGl0OiB7XG4gICAgcmVhY3RhbnRzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIHByb2R1Y3RzOiBbIHsgcmF0aW86IDEgfSwgeyByYXRpbzogMSB9IF0sXG4gICAgbGFiZWw6ICdBIFxcXFxyaWdodGFycm93IEIgKyBDJ1xuICB9LFxuICBmb3VyOiB7XG4gICAgcmVhY3RhbnRzOiBbIHsgcmF0aW86IDEgfSwgeyByYXRpbzogMSB9IF0sXG4gICAgcHJvZHVjdHM6IFsgeyByYXRpbzogMSB9LCB7IHJhdGlvOiAxIH0gXSxcbiAgICBsYWJlbDogJ0EgKyBCIFxcXFxyaWdodGFycm93IEMgKyBEJ1xuICB9LFxuICAnY3VzdG9tLW1hc3NhY3Rpb24nOiB7XG4gICAgcmVhY3RhbnRzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIHByb2R1Y3RzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIGxhYmVsOiAnQ3VzdG9tIG1hc3MgYWN0aW9uJ1xuICB9LFxuICAnY3VzdG9tLXByb3BlbnNpdHknOiB7XG4gICAgcmVhY3RhbnRzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIHByb2R1Y3RzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIGxhYmVsOiAnQ3VzdG9tIHByb3BlbnNpdHknXG4gIH1cbn1cbiIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGQgY2xhc3M9XFxcIm5hbWVcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzcGVjaWUtbmFtZVxcXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzcGVjaWUtbW9kZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwic3dpdGNoaW5nXFxcIlxcdTAwM0VcXHUwMDNDaW5wdXRcIiArIChcIiB0eXBlPVxcXCJyYWRpb1xcXCJcIitwdWcuYXR0cihcIm5hbWVcIiwgdGhpcy5tb2RlbC5uYW1lICsgXCItc3dpdGNoLW1ldGhvZFwiLCB0cnVlLCB0cnVlKStcIiBkYXRhLWhvb2s9XFxcInN3aXRjaGluZy10b2xcXFwiXCIpICsgXCJcXHUwMDNFIFN3aXRjaGluZyBUb2xlcmFuY2VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJzd2l0Y2hpbmdcXFwiXFx1MDAzRVxcdTAwM0NpbnB1dFwiICsgKFwiIHR5cGU9XFxcInJhZGlvXFxcIlwiK3B1Zy5hdHRyKFwibmFtZVwiLCB0aGlzLm1vZGVsLm5hbWUgKyBcIi1zd2l0Y2gtbWV0aG9kXCIsIHRydWUsIHRydWUpK1wiIGRhdGEtaG9vaz1cXFwic3dpdGNoaW5nLW1pblxcXCJcIikgKyBcIlxcdTAwM0UgTWluaW11bSBWYWx1ZSBmb3IgU3dpdGNoaW5nIChudW1iZXIgb2YgbW9sZWN1bGVzKVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzd2l0Y2hpbmctdG9sZXJhbmNlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3dpdGNoaW5nLXRocmVzaG9sZFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDbGFiZWwgY2xhc3M9XFxcInNlbGVjdFxcXCJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBidG4tc21cXFwiIGRhdGEtaG9vaz1cXFwiaW5jcmVtZW50XFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImN1c3RvbVxcXCIgZGF0YS1ob29rPVxcXCJyYXRpb1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYnRuLXNtXFxcIiBkYXRhLWhvb2s9XFxcImRlY3JlbWVudFxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NzZWxlY3QgZGF0YS1ob29rPVxcXCJzZWxlY3Qtc3RvaWNoLXNwZWNpZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcIm1lc3NhZ2UgbWVzc2FnZS1iZWxvdyBtZXNzYWdlLWVycm9yXFxcIiBkYXRhLWhvb2s9XFxcIm1lc3NhZ2UtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDcCBkYXRhLWhvb2s9XFxcIm1lc3NhZ2UtdGV4dFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRnNlbGVjdFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGN1c3RvbSBidG4tc21cXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZsYWJlbFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImV2ZW50LWFzc2lnbm1lbnQtdmFyaWFibGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJldmVudC1hc3NpZ25tZW50LUV4cHJlc3Npb25cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLnNpZ25hdHVyZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0aFxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvbi1sYXJnZVxcXCJcIitcIiBkYXRhLWhvb2s9XFxcImFubm90YXRpb24tdG9vbHRpcFxcXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMubW9kZWwuYW5ub3RhdGlvbiB8fCBcIkNsaWNrICdBZGQnIHRvIGFkZCBhbiBhbm5vdGF0aW9uXCIsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiZmlsZS1hbHRcXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1maWxlLWFsdCBmYS13LTEyXFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDM4NCA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIyNCAxMzZWMEgyNEMxMC43IDAgMCAxMC43IDAgMjR2NDY0YzAgMTMuMyAxMC43IDI0IDI0IDI0aDMzNmMxMy4zIDAgMjQtMTAuNyAyNC0yNFYxNjBIMjQ4Yy0xMy4yIDAtMjQtMTAuOC0yNC0yNHptNjQgMjM2YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTY0YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTcydjhjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEyem05Ni0xMTQuMXY2LjFIMjU2VjBoNi4xYzYuNCAwIDEyLjUgMi41IDE3IDdsOTcuOSA5OGM0LjUgNC41IDcgMTAuNiA3IDE2Ljl6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBidG4tc21cXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1hbm5vdGF0aW9uLWJ0blxcXCJcXHUwMDNFRWRpdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiaW5pdGlhbC1jb25kaXRpb24tdHlwZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImluaXRpYWwtY29uZGl0aW9uLXNwZWNpZXNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJpbml0aWFsLWNvbmRpdGlvbi1kZXRhaWxzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJlbW92ZVxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRUNvdW50XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVlcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VaXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImNvdW50LWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIngtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwieS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ6LWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGQgY2xhc3M9XFxcIm5hbWVcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJpbnB1dC1uYW1lLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImlucHV0LXZhbHVlLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb24tbGFyZ2VcXFwiXCIrXCIgZGF0YS1ob29rPVxcXCJhbm5vdGF0aW9uLXRvb2x0aXBcXFwiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLm1vZGVsLmFubm90YXRpb24gfHwgXCJDbGljayAnQWRkJyB0byBhZGQgYW4gYW5ub3RhdGlvblwiLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImZpbGUtYWx0XFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtZmlsZS1hbHQgZmEtdy0xMlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAzODQgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMjQgMTM2VjBIMjRDMTAuNyAwIDAgMTAuNyAwIDI0djQ2NGMwIDEzLjMgMTAuNyAyNCAyNCAyNGgzMzZjMTMuMyAwIDI0LTEwLjcgMjQtMjRWMTYwSDI0OGMtMTMuMiAwLTI0LTEwLjgtMjQtMjR6bTY0IDIzNmMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ2OHptMC02NGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ2OHptMC03MnY4YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnptOTYtMTE0LjF2Ni4xSDI1NlYwaDYuMWM2LjQgMCAxMi41IDIuNSAxNyA3bDk3LjkgOThjNC41IDQuNSA3IDEwLjYgNyAxNi45elxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYnRuLXNtXFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtYW5ub3RhdGlvbi1idG5cXFwiXFx1MDAzRUVkaXRcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJlbW92ZVxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGQgY2xhc3M9XFxcIm5hbWVcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJydWxlLW5hbWVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJydWxlLXR5cGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJydWxlLXZhcmlhYmxlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicnVsZS1leHByZXNzaW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvbi1sYXJnZVxcXCJcIitcIiBkYXRhLWhvb2s9XFxcImFubm90YXRpb24tdG9vbHRpcFxcXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMubW9kZWwuYW5ub3RhdGlvbiB8fCBcIkNsaWNrICdBZGQnIHRvIGFkZCBhbiBhbm5vdGF0aW9uXCIsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiZmlsZS1hbHRcXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1maWxlLWFsdCBmYS13LTEyXFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDM4NCA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIyNCAxMzZWMEgyNEMxMC43IDAgMCAxMC43IDAgMjR2NDY0YzAgMTMuMyAxMC43IDI0IDI0IDI0aDMzNmMxMy4zIDAgMjQtMTAuNyAyNC0yNFYxNjBIMjQ4Yy0xMy4yIDAtMjQtMTAuOC0yNC0yNHptNjQgMjM2YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTY0YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTcydjhjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEyem05Ni0xMTQuMXY2LjFIMjU2VjBoNi4xYzYuNCAwIDEyLjUgMi41IDE3IDdsOTcuOSA5OGM0LjUgNC41IDcgMTAuNiA3IDE2Ljl6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBidG4tc21cXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1hbm5vdGF0aW9uLWJ0blxcXCJcXHUwMDNFRWRpdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFQ291bnRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdWJkb21haW5cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiY291bnQtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3ViZG9tYWluLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGQgY2xhc3M9XFxcIm5hbWVcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJpbnB1dC1uYW1lLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImlucHV0LWRpZmZ1c2lvbi1jb2VmZi1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCIgZGF0YS1ob29rPVxcXCJzdWJkb21haW5zXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJlbW92ZVxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2xhYmVsIGNsYXNzPVxcXCJzZWxlY3RcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGRhdGEtaG9vaz1cXFwicmF0aW9cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDc2VsZWN0IGRhdGEtaG9vaz1cXFwic2VsZWN0LXN0b2ljaC1zcGVjaWVcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJtZXNzYWdlIG1lc3NhZ2UtYmVsb3cgbWVzc2FnZS1lcnJvclxcXCIgZGF0YS1ob29rPVxcXCJtZXNzYWdlLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ3AgZGF0YS1ob29rPVxcXCJtZXNzYWdlLXRleHRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWxlY3RcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsYWJlbFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVZhcmlhYmxlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMucGFyZW50LnBhcmVudC50b29sdGlwcy52YXJpYWJsZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQucGFyZW50LnRvb2x0aXBzLmFzc2lnbm1lbnRFeHByZXNzaW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJldmVudC1hc3NpZ25tZW50cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeVxcXCIgZGF0YS1ob29rPVxcXCJhZGQtZXZlbnQtYXNzaWdubWVudFxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIlxcdTAwM0VBZGQgQXNzaWdubWVudFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImV2ZW50LWRldGFpbHNcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3NwYW4gZm9yPVxcXCJldmVudC10cmlnZ2VyLWV4cHJlc3Npb25cXFwiXFx1MDAzRVRyaWdnZXIgRXhwcmVzc2lvbjpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMudHJpZ2dlckV4cHJlc3Npb24sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtOCBpbmxpbmVcXFwiIGlkPVxcXCJldmVudC10cmlnZ2VyLWV4cHJlc3Npb25cXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtdHJpZ2dlci1leHByZXNzaW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBZHZhbmNlZFxcdTAwM0NcXHUwMDJGaDZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjYWR2YW5jZWQtZXZlbnRzXFxcIiBkYXRhLWhvb2s9XFxcImFkdmFuY2VkLWV2ZW50LWJ1dHRvblxcXCJcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBpZD1cXFwiYWR2YW5jZWQtZXZlbnRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02XFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBmb3I9XFxcImV2ZW50LXRyaWdnZXItZXhwcmVzc2lvblxcXCJcXHUwMDNFRGVsYXk6XFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMucGFyZW50LnRvb2x0aXBzLmRlbGF5LCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTkgaW5saW5lXFxcIiBpZD1cXFwiZXZlbnQtZGVsYXlcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtZGVsYXlcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02XFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBmb3I9XFxcImV2ZW50LXRyaWdnZXItZXhwcmVzc2lvblxcXCJcXHUwMDNFUHJpb2lydHk6XFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMucGFyZW50LnRvb2x0aXBzLnByaW9yaXR5LCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTggaW5saW5lXFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50LXByaW9yaXR5XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IHZlcnRpY2xlLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2hlY2tib3hcXFwiIGZvcj1cXFwiaW5pdGlhbC12YWx1ZVxcXCJcXHUwMDNFSW5pdGlhbCBWYWx1ZTpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMuaW5pdGlhbFZhbHVlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBpZD1cXFwiaW5pdGlhbC12YWx1ZVxcXCIgZGF0YS1ob29rPVxcXCJldmVudC10cmlnZ2VyLWluaXQtdmFsdWVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IHZlcnRpY2xlLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2hlY2tib3hcXFwiIGZvcj1cXFwicGVyc2lzdGVudFxcXCJcXHUwMDNFUGVyc2lzdGVudDpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMucGVyc2lzdGVudCwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgaWQ9XFxcInBlcnNpc3RlbnRcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtdHJpZ2dlci1wZXJzaXN0ZW50XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC0xMiB2ZXJ0aWNsZS1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNoZWNrYm94XFxcIiBmb3I9XFxcInVzZS12YWx1ZXMtZnJvbS10cmlnZ2VyLXRpbWVcXFwiXFx1MDAzRVVzZSBWYWx1ZXMgRnJvbTpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMudXNlVmFsdWVzRnJvbVRyaWdnZXJUaW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaG9yaXpvbnRhbC1zcGFjZSBpbmxpbmVcXFwiXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwidXNlLXZhbHVlcy1mcm9tXFxcIiBkYXRhLWhvb2s9XFxcInRyaWdnZXItdGltZVxcXCIgZGF0YS1uYW1lPVxcXCJ0cmlnZ2VyXFxcIlxcdTAwM0UgVHJpZ2dlciBUaW1lXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaG9yaXpvbnRhbC1zcGFjZSBpbmxpbmVcXFwiXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwidXNlLXZhbHVlcy1mcm9tXFxcIiBkYXRhLWhvb2s9XFxcImFzc2lnbm1lbnQtdGltZVxcXCIgZGF0YS1uYW1lPVxcXCJhc3NpZ25tZW50XFxcIlxcdTAwM0UgQXNzaWdubWVudCBUaW1lXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2g1IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBc3NpZ25tZW50c1xcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnBhcmVudC50b29sdGlwcy5hc3NpZ25tZW50cywgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiZXZlbnQtYXNzaWdubWVudHNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0XFxcIiBuYW1lPVxcXCJldmVudC1zZWxlY3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkIGNsYXNzPVxcXCJuYW1lXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiZXZlbnQtbmFtZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uLWxhcmdlXFxcIlwiK1wiIGRhdGEtaG9vaz1cXFwiYW5ub3RhdGlvbi10b29sdGlwXFxcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5tb2RlbC5hbm5vdGF0aW9uIHx8IFwiQ2xpY2sgJ0FkZCcgdG8gYWRkIGFuIGFubm90YXRpb25cIiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJmaWxlLWFsdFxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWZpbGUtYWx0IGZhLXctMTJcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzg0IDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjI0IDEzNlYwSDI0QzEwLjcgMCAwIDEwLjcgMCAyNHY0NjRjMCAxMy4zIDEwLjcgMjQgMjQgMjRoMzM2YzEzLjMgMCAyNC0xMC43IDI0LTI0VjE2MEgyNDhjLTEzLjIgMC0yNC0xMC44LTI0LTI0em02NCAyMzZjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNjRjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNzJ2OGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ6bTk2LTExNC4xdjYuMUgyNTZWMGg2LjFjNi40IDAgMTIuNSAyLjUgMTcgN2w5Ny45IDk4YzQuNSA0LjUgNyAxMC42IDcgMTYuOXpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJ0bi1zbVxcXCIgZGF0YS1ob29rPVxcXCJlZGl0LWFubm90YXRpb24tYnRuXFxcIlxcdTAwM0VFZGl0XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeVxcXCIgZGF0YS1ob29rPVxcXCJyZW1vdmVcXFwiXFx1MDAzRVhcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcImV2ZW50c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXZlbnRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNldmVudHMtY29udGFpbmVyXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImV2ZW50cy1jb250YWluZXJcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IGNvbnRhaW5lci1wYXJ0XFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VFZGl0XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5uYW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFQW5ub3RhdGlvblxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLmFubm90YXRpb24sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcImV2ZW50LWxpc3RpbmctY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTYgY29udGFpbmVyLXBhcnRcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtZGV0YWlscy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcImFkZC1ldmVudFxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIlxcdTAwM0VBZGQgRXZlbnRcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwiaW5pdGlhbC1jb25kaXRpb25zXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VJbml0aWFsIENvbmRpdGlvbnNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2luaXRpYWwtY29uZGl0aW9uXFxcIiBkYXRhLWhvb2s9XFxcImluaXRpYWwtY29uZGl0aW9uLWJ1dHRvblxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJpbml0aWFsLWNvbmRpdGlvblxcXCIgZGF0YS1ob29rPVxcXCJpbml0aWFsLWNvbmRpdGlvbnNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVR5cGVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTcGVjaWVzXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFRGV0YWlsc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcImluaXRpYWwtY29uZGl0aW9ucy1jb2xsZWN0aW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiZHJvcGRvd25cXFwiXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGRyb3Bkb3duLXRvZ2dsZVxcXCIgaWQ9XFxcImFkZEluaXRpYWxDb25kaXRpb25CdG5cXFwiIGRhdGEtaG9vaz1cXFwiYWRkLWluaXRpYWwtY29uZGl0aW9uXFxcIiBkYXRhLXRvZ2dsZT1cXFwiZHJvcGRvd25cXFwiIGFyaWEtaGFzcG9wdXA9XFxcInRydWVcXFwiIGFyaWEtZXhwYW5kZWQ9XFxcImZhbHNlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBJbml0aWFsIENvbmRpdGlvbiBcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2FyZXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDdWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnVcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwiYWRkSW5pdGlhbENvbmRpdGlvbkJ0blxcXCJcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcInNjYXR0ZXJcXFwiXFx1MDAzRVNjYXR0ZXJcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJwbGFjZVxcXCJcXHUwMDNFUGxhY2VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJkaXN0cmlidXRlLXVuaWZvcm1seVxcXCJcXHUwMDNFRGlzdHJpYnV0ZSBVbmlmb3JtbHkgcGVyIFZveGVsXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDXFx1MDAyRnVsXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJtZXNoLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTWVzaCBFZGl0b3JcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLW1lc2hcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtbWVzaFxcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3Rib2R5XFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm51bS1zdWJkb21haW5zLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicHJldmlldy1zZXR0aW5nc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUHJldmlldyBTZXR0aW5nc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMucHJldmlld1NldHRpbmdzLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1wcmV2aWV3LXNldHRpbmdzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXByZXZpZXctc2V0dGluZ3NcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVNpbXVsYXRpb24gVGltZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VUaW1lIFVuaXRzXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMudGltZVVuaXRzLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFVm9sdW1lXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMudm9sdW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicHJldmlldy10aW1lXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidGltZS11bml0c1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInZvbHVtZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcIm1kbC1lZGl0LWJ0blxcXCJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInNhdmVcXFwiXFx1MDAzRVNhdmVcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZGwtZWRpdC1idG4gc2F2aW5nLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJzYXZpbmctbWRsXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJzcGlubmVyLWdyb3dcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NzcGFuXFx1MDAzRVNhdmluZy4uLlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZGwtZWRpdC1idG4gc2F2ZWQtc3RhdHVzXFxcIiBkYXRhLWhvb2s9XFxcInNhdmVkLW1kbFxcXCJcXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFU2F2ZWRcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJ1blxcXCJcXHUwMDNFUnVuIFByZXZpZXdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGRhdGEtaG9vaz1cXFwic3RhcnQtd29ya2Zsb3dcXFwiXFx1MDAzRU5ldyBXb3JrZmxvd1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJwYXJhbWV0ZXJzLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUGFyYW1ldGVyc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcGFyYW1ldGVyc1xcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1wYXJhbWV0ZXJzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm5hbWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VFeHByZXNzaW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuZXhwcmVzc2lvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFIFxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBbm5vdGF0aW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuYW5ub3RhdGlvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJlbW92ZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwicGFyYW1ldGVyLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeVxcXCIgZGF0YS1ob29rPVxcXCJhZGQtcGFyYW1ldGVyXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBQYXJhbWV0ZXJcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1kZXRhaWxzXFxcIlxcdTAwM0VcXHUwMDNDaDUgZGF0YS1ob29rPVxcXCJmaWVsZC10aXRsZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMuZmllbGRUaXRsZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiIGRhdGEtaG9vaz1cXFwiZmllbGQtdGl0bGUtdG9vbHRpcFxcXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCIgdGl0bGU9XFxcIlxcXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVhY3RhbnRzLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCIgZGF0YS1ob29rPVxcXCJhZGQtc3BlY2llLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInNlbGVjdC1zcGVjaWVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYnRuLXNtXFxcIiBkYXRhLWhvb2s9XFxcImFkZC1zZWxlY3RlZC1zcGVjaWVcXFwiXFx1MDAzRWFkZFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIiBkYXRhLWhvb2s9XFxcInJlYWN0aW9uLWRldGFpbHNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJlYWN0aW9uLXN1bW1hcnlcXFwiXFx1MDAzRVN1bW1hcnk6IFxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdW1tYXJ5LWNvbnRhaW5lclxcXCIgaWQ9XFxcInJlYWN0aW9uLXN1bW1hcnlcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC0xMlxcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3QtcmVhY3Rpb24tdHlwZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEyIHZlcnRpY2xlLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBmb3I9XFxcImV2ZW50LXRyaWdnZXItZXhwcmVzc2lvblxcXCIgZGF0YS1ob29rPVxcXCJyYXRlLXBhcmFtZXRlci1sYWJlbFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLWhvb2s9XFxcInJhdGUtcGFyYW1ldGVyLXRvb2x0aXBcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIiB0aXRsZT1cXFwiXFxcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmUgaG9yaXpvbnRhbC1zcGFjZVxcXCIgaWQ9XFxcInNlbGVjdC1yYXRlLXBhcmFtZXRlclxcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3QtcmF0ZS1wYXJhbWV0ZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC0xMiBjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJzdWJkb21haW5zLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTZcXFwiIGRhdGEtaG9vaz1cXFwicmVhY3RhbnRzLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTZcXFwiIGRhdGEtaG9vaz1cXFwicHJvZHVjdHMtZWRpdG9yXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS1ob29rPVxcXCJjb25mbGljdGluZy1tb2Rlcy1tZXNzYWdlXFxcIlxcdTAwM0VcXHUwMDNDcCBjbGFzcz1cXFwidGV4dC13YXJuaW5nXFxcIlxcdTAwM0VcXHUwMDNDYlxcdTAwM0VXYXJuaW5nXFx1MDAzQ1xcdTAwMkZiXFx1MDAzRTogVGhpcyByZWFjdGlvbiBjb250YWluZXMgU3RvaWNoIFNwZWNpZXMgd2l0aCBtb2RlcyBvZiAnQ29uY2VudHJhdGlvbicgYW5kICdQb3B1bGF0aW9uJyBvciAnSHlicmlkIENvbmNlbnRyYXRpb25cXHUwMDJGUG9wdWxhdGlvbicgYW5kIHdpbGwgZmlyZSBzdG9jaGFzdGljYWxseS5cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3RcXFwiIG5hbWU9XFxcInJlYWN0aW9uLXNlbGVjdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGQgY2xhc3M9XFxcIm5hbWVcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJpbnB1dC1uYW1lLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN1bW1hcnlcXFwiIHN0eWxlPVxcXCJ3aWR0aDogYXV0byAhaW1wb3J0YW50XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvbi1sYXJnZVxcXCJcIitcIiBkYXRhLWhvb2s9XFxcImFubm90YXRpb24tdG9vbHRpcFxcXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMubW9kZWwuYW5ub3RhdGlvbiB8fCBcIkNsaWNrICdBZGQnIHRvIGFkZCBhbiBhbm5vdGF0aW9uXCIsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiZmlsZS1hbHRcXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1maWxlLWFsdCBmYS13LTEyXFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDM4NCA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIyNCAxMzZWMEgyNEMxMC43IDAgMCAxMC43IDAgMjR2NDY0YzAgMTMuMyAxMC43IDI0IDI0IDI0aDMzNmMxMy4zIDAgMjQtMTAuNyAyNC0yNFYxNjBIMjQ4Yy0xMy4yIDAtMjQtMTAuOC0yNC0yNHptNjQgMjM2YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTY0YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnY4em0wLTcydjhjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEyem05Ni0xMTQuMXY2LjFIMjU2VjBoNi4xYzYuNCAwIDEyLjUgMi41IDE3IDdsOTcuOSA5OGM0LjUgNC41IDcgMTAuNiA3IDE2Ljl6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBidG4tc21cXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1hbm5vdGF0aW9uLWJ0blxcXCJcXHUwMDNFRWRpdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnlcXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTQgcmVhY3Rpb24tc3ViZG9tYWluXFxcIlxcdTAwM0VcXHUwMDNDbGFiZWxcIiArIChwdWcuYXR0cihcImZvclwiLCB0aGlzLm1vZGVsLm5hbWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmxhYmVsXFx1MDAzRVxcdTAwM0NpbnB1dFwiICsgKFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIlwiK3B1Zy5hdHRyKFwiaWRcIiwgdGhpcy5tb2RlbC5uYW1lLCB0cnVlLCB0cnVlKStcIiBkYXRhLWhvb2s9XFxcInN1YmRvbWFpblxcXCJcIikgKyBcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcInJlYWN0aW9uLWRldGFpbHMtc3ViZG9tYWluXFxcIlxcdTAwM0VcXHUwMDNDbGFiZWxcXHUwMDNFU3ViZG9tYWlucyB0aGUgcmVhY3Rpb24gY2FuIG9jY3VyIGluOiBcXHUwMDNDXFx1MDAyRmxhYmVsXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCIgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1zdWJkb21haW5zXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicmVhY3Rpb25zLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFIFxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VSZWFjdGlvbnNcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5yZWFjdGlvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcmVhY3Rpb25cXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1yZWFjdGlvblxcXCJcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFRGVmaW5lIHJlYWN0aW9ucy4gU2VsZWN0IGZyb20gdGhlIGdpdmVuIHJlYWN0aW9uIHRlbXBsYXRlcywgb3IgdXNlIHRoZSBjdXN0b20gdHlwZXMuIFxcblVzaW5nIHRlbXBsYXRlZCByZWFjdGlvbiB0eXBlcyB3aWxsIGhlbHAgZWxpbWluYXRlIGVycm9ycy4gXFxuRm9yIG5vbi1saW5lYXIgcmVhY3Rpb25zLCB1c2UgdGhlIGN1c3RvbSBwcm9wZW5zaXR5IHR5cGUuIFxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC03IGNvbnRhaW5lci1wYXJ0XFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VFZGl0XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5uYW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdW1tYXJ5XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFubm90YXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbm5vdGF0aW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTUgY29udGFpbmVyLXBhcnRcXFwiIGRhdGEtaG9vaz1cXFwicmVhY3Rpb24tZGV0YWlscy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImRyb3Bkb3duXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBkcm9wZG93bi10b2dnbGVcXFwiIGlkPVxcXCJhZGRSZWFjdGlvbkJ0blxcXCIgZGF0YS1ob29rPVxcXCJhZGQtcmVhY3Rpb24tZnVsbFxcXCIgZGF0YS10b2dnbGU9XFxcImRyb3Bkb3duXFxcIiBhcmlhLWhhc3BvcHVwPVxcXCJ0cnVlXFxcIiBhcmlhLWV4cGFuZGVkPVxcXCJmYWxzZVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIlxcdTAwM0VBZGQgUmVhY3Rpb24gXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNhcmV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ3VsIGNsYXNzPVxcXCJkcm9wZG93bi1tZW51XFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcImFkZFJlYWN0aW9uQnRuXFxcIlxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwiY3JlYXRpb25cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcImRlc3RydWN0aW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJjaGFuZ2VcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcImRpbWVyaXphdGlvblxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwibWVyZ2VcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcInNwbGl0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJmb3VyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24tZGl2aWRlclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwiY3VzdG9tLW1hc3NhY3Rpb25cXFwiXFx1MDAzRUN1c3RvbSBtYXNzIGFjdGlvblxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcImN1c3RvbS1wcm9wZW5zaXR5XFxcIlxcdTAwM0VDdXN0b20gcHJvcGVuc2l0eVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ1bFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJkcm9wZG93blxcXCJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnkgZHJvcGRvd24tdG9nZ2xlXFxcIiBpZD1cXFwiYWRkUmVhY3Rpb25CdG5cXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXJlYWN0aW9uLXBhcnRpYWxcXFwiIGRhdGEtdG9nZ2xlPVxcXCJkcm9wZG93blxcXCIgYXJpYS1oYXNwb3B1cD1cXFwidHJ1ZVxcXCIgYXJpYS1leHBhbmRlZD1cXFwiZmFsc2VcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFJlYWN0aW9uIFxcdTAwM0NzcGFuIGNsYXNzPVxcXCJjYXJldFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0N1bCBjbGFzcz1cXFwiZHJvcGRvd24tbWVudVxcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJhZGRSZWFjdGlvbkJ0blxcXCJcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcImN1c3RvbS1wcm9wZW5zaXR5XFxcIlxcdTAwM0VDdXN0b20gcHJvcGVuc2l0eVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ1bFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwicnVsZXMtZWRpdG9yXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VSdWxlc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtcnVsZXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtcnVsZXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMubmFtZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFIFxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VUeXBlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMudHlwZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVZhcmlhYmxlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMudmFyaWFibGUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VFeHByZXNzaW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuZXhwcmVzc2lvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFubm90YXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbm5vdGF0aW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJydWxlLWxpc3QtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiZHJvcGRvd25cXFwiXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGRyb3Bkb3duLXRvZ2dsZVxcXCIgaWQ9XFxcImFkZFJ1bGVCdG5cXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXJ1bGVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJkcm9wZG93blxcXCIgYXJpYS1oYXNwb3B1cD1cXFwidHJ1ZVxcXCIgYXJpYS1leHBhbmRlZD1cXFwiZmFsc2VcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFJ1bGUgXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNhcmV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ3VsIGNsYXNzPVxcXCJkcm9wZG93bi1tZW51XFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcImFkZFJ1bGVCdG5cXFwiXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJyYXRlLXJ1bGVcXFwiIGRhdGEtbmFtZT1cXFwiUmF0ZSBSdWxlXFxcIlxcdTAwM0VSYXRlIFJ1bGVcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJhc3NpZ25tZW50LXJ1bGVcXFwiIGRhdGEtbmFtZT1cXFwiQXNzaWdubWVudCBSdWxlXFxcIlxcdTAwM0VBc3NpZ25tZW50IFJ1bGVcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NcXHUwMDJGdWxcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNibWwtY29tcG9uZW50c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU0JNTCBDb21wb25lbnRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zYm1sLWNvbXBvbmVudFxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1zYm1sLWNvbXBvbmVudFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRnVuY3Rpb24gRGVmaW5pdGlvbnNcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTaWduYXR1cmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFubm90YXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbm5vdGF0aW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJmdW5jdGlvbi1kZWZpbml0aW9uLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic3BlY2llcy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNwZWNpZXMgRWRpdG9yXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zcGVjaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNwZWNpZXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VEaWZmdXNpb24gQ29lZmZpY2llbnRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VBY3RpdmUgaW4gU3ViZG9tYWluc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcInNwZWNpZS1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnlcXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXNwZWNpZXNcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFNwZWNpZXNcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic3BlY2llcy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNwZWNpZXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXNwZWNpZXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2Utc3BlY2llc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5uYW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFSW5pdGlhbCBDb25kaXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5pbml0aWFsVmFsdWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBbm5vdGF0aW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuYW5ub3RhdGlvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJlbW92ZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwic3BlY2llLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIiBjb2xzcGFuPVxcXCIzXFxcIlxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNwZWNpZXMgTW9kZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnNwZWNpZXNNb2RlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNwZWNpZXMtbW9kZVxcXCIgZGF0YS1ob29rPVxcXCJhbGwtY29udGludW91c1xcXCIgZGF0YS1uYW1lPVxcXCJjb250aW51b3VzXFxcIlxcdTAwM0UgQ29uY2VudHJhdGlvblxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic3BlY2llcy1tb2RlXFxcIiBkYXRhLWhvb2s9XFxcImFsbC1kaXNjcmV0ZVxcXCIgZGF0YS1uYW1lPVxcXCJkaXNjcmV0ZVxcXCJcXHUwMDNFIFBvcHVsYXRpb25cXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNwZWNpZXMtbW9kZVxcXCIgZGF0YS1ob29rPVxcXCJhZHZhbmNlZFxcXCIgZGF0YS1uYW1lPVxcXCJkeW5hbWljXFxcIlxcdTAwM0UgSHlicmlkIENvbmNlbnRyYXRpb25cXHUwMDJGUG9wdWxhdGlvblxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiYWR2YW5jZWQtc3BlY2llc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTW9kZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm1vZGUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiIGNvbHNwYW49XFxcIjJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTd2l0Y2hpbmcgU2V0dGluZ3MgKEh5YnJpZCBPbmx5KVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnN3aXRjaFZhbHVlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJlZGl0LXNwZWNpZXMtbW9kZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5XFxcIiBkYXRhLWhvb2s9XFxcImFkZC1zcGVjaWVzXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBTcGVjaWVzXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IHN0eWxlPVxcXCJib3JkZXI6IGZhbHNlXFxcIlxcdTAwM0VcXHUwMDNDbGFiZWxcIiArIChwdWcuYXR0cihcImZvclwiLCB0aGlzLm1vZGVsLm5hbWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmxhYmVsXFx1MDAzRVxcdTAwM0NpbnB1dFwiICsgKFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIlwiK3B1Zy5hdHRyKFwiaWRcIiwgdGhpcy5tb2RlbC5uYW1lLCB0cnVlLCB0cnVlKStcIiBkYXRhLWhvb2s9XFxcInN1YmRvbWFpblxcXCJcIikgKyBcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzZWN0aW9uIGNsYXNzPVxcXCJwYWdlXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VNb2RlbCBFZGl0b3JcXHUwMDNDXFx1MDAyRmgyXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJpZy10aXAgYnRuIGluZm9ybWF0aW9uLWJ0biBoZWxwXFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtbW9kZWwtaGVscFxcXCJcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhclxcXCIgZGF0YS1pY29uPVxcXCJxdWVzdGlvbi1jaXJjbGVcXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1xdWVzdGlvbi1jaXJjbGUgZmEtdy0xNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCA1MTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yNTYgOEMxMTkuMDQzIDggOCAxMTkuMDgzIDggMjU2YzAgMTM2Ljk5NyAxMTEuMDQzIDI0OCAyNDggMjQ4czI0OC0xMTEuMDAzIDI0OC0yNDhDNTA0IDExOS4wODMgMzkyLjk1NyA4IDI1NiA4em0wIDQ0OGMtMTEwLjUzMiAwLTIwMC04OS40MzEtMjAwLTIwMCAwLTExMC40OTUgODkuNDcyLTIwMCAyMDAtMjAwIDExMC40OTEgMCAyMDAgODkuNDcxIDIwMCAyMDAgMCAxMTAuNTMtODkuNDMxIDIwMC0yMDAgMjAwem0xMDcuMjQ0LTI1NS4yYzAgNjcuMDUyLTcyLjQyMSA2OC4wODQtNzIuNDIxIDkyLjg2M1YzMDBjMCA2LjYyNy01LjM3MyAxMi0xMiAxMmgtNDUuNjQ3Yy02LjYyNyAwLTEyLTUuMzczLTEyLTEydi04LjY1OWMwLTM1Ljc0NSAyNy4xLTUwLjAzNCA0Ny41NzktNjEuNTE2IDE3LjU2MS05Ljg0NSAyOC4zMjQtMTYuNTQxIDI4LjMyNC0yOS41NzkgMC0xNy4yNDYtMjEuOTk5LTI4LjY5My0zOS43ODQtMjguNjkzLTIzLjE4OSAwLTMzLjg5NCAxMC45NzctNDguOTQyIDI5Ljk2OS00LjA1NyA1LjEyLTExLjQ2IDYuMDcxLTE2LjY2NiAyLjEyNGwtMjcuODI0LTIxLjA5OGMtNS4xMDctMy44NzItNi4yNTEtMTEuMDY2LTIuNjQ0LTE2LjM2M0MxODQuODQ2IDEzMS40OTEgMjE0Ljk0IDExMiAyNjEuNzk0IDExMmM0OS4wNzEgMCAxMDEuNDUgMzguMzA0IDEwMS40NSA4OC44ek0yOTggMzY4YzAgMjMuMTU5LTE4Ljg0MSA0Mi00MiA0MnMtNDItMTguODQxLTQyLTQyIDE4Ljg0MS00MiA0Mi00MiA0MiAxOC44NDEgNDIgNDJ6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDVcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1lc2gtZWRpdG9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInNwZWNpZXMtZWRpdG9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImluaXRpYWwtY29uZGl0aW9ucy1lZGl0b3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicGFyYW1ldGVycy1lZGl0b3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVhY3Rpb25zLWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJldmVudHMtZWRpdG9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJ1bGVzLWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzYm1sLWNvbXBvbmVudC1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1zZXR0aW5ncy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcIm1vZGVsLXRpbWVvdXQtbWVzc2FnZVxcXCJcXHUwMDNFXFx1MDAzQ3AgY2xhc3M9XFxcInRleHQtd2FybmluZ1xcXCJcXHUwMDNFVGhlIG1vZGVsIHRvb2sgbG9uZ2VyIHRoYW4gNSBzZWNvbmRzIHRvIHJ1biBhbmQgdGltZWQgb3V0IVxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJlcnJvcnNcXFwiIGRhdGEtaG9vaz1cXFwibW9kZWwtcnVuLWVycm9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ3AgY2xhc3M9XFxcInRleHQtZGFuZ2VyXFxcIiBkYXRhLWhvb2s9XFxcIm1vZGVsLXJ1bi1lcnJvci1tZXNzYWdlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1vZGVsLXJ1bi1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInNwaW5uZXItYm9yZGVyXFxcIiBkYXRhLWhvb2s9XFxcInBsb3QtbG9hZGVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibW9kZWwtc3RhdGUtYnV0dG9ucy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc2VjdGlvblxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdEFkdmFuY2VkU3BlY2llLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3dpdGNoaW5nLXRvbF0nIDogJ3NldFN3aXRjaGluZ1R5cGUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zd2l0Y2hpbmctbWluXScgOiAnc2V0U3dpdGNoaW5nVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXNwZWNpZS1tb2RlXScgOiAnc2V0U3BlY2llc01vZGUnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgb3B0aW9uRGljdCA9IHtcImNvbnRpbnVvdXNcIjpcIkNvbmNlbnRyYXRpb25cIiwgXCJkaXNjcmV0ZVwiOlwiUG9wdWxhdGlvblwiLCBcImR5bmFtaWNcIjpcIkh5YnJpZCBDb25jZW50cmF0aW9uL1BvcHVsYXRpb25cIn1cbiAgICB2YXIgbW9kZVNlbGVjdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnbW9kZScsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlczogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBbJ0NvbmNlbnRyYXRpb24nLCdQb3B1bGF0aW9uJywnSHlicmlkIENvbmNlbnRyYXRpb24vUG9wdWxhdGlvbiddLFxuICAgICAgdmFsdWU6IG9wdGlvbkRpY3RbdGhpcy5tb2RlbC5tb2RlXSxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhtb2RlU2VsZWN0VmlldywgXCJzcGVjaWUtbW9kZVwiKVxuICAgIGlmKHRoaXMubW9kZWwuaXNTd2l0Y2hUb2wpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdG9sJykpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICB9ZWxzZXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLW1pbicpKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMudG9nZ2xlU3dpdGNoaW5nU2V0dGluZ3MoKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIHNldFNwZWNpZXNNb2RlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB2YWx1ZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHRcbiAgICB2YXIgbW9kZURpY3QgPSB7XCJDb25jZW50cmF0aW9uXCI6XCJjb250aW51b3VzXCIsXCJQb3B1bGF0aW9uXCI6XCJkaXNjcmV0ZVwiLFwiSHlicmlkIENvbmNlbnRyYXRpb24vUG9wdWxhdGlvblwiOlwiZHluYW1pY1wifVxuICAgIHRoaXMubW9kZWwubW9kZSA9IG1vZGVEaWN0W3ZhbHVlXVxuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi50cmlnZ2VyKCd1cGRhdGUtc3BlY2llcycsIHRoaXMubW9kZWwuY29tcElELCB0aGlzLm1vZGVsLCBmYWxzZSk7XG4gICAgdGhpcy50b2dnbGVTd2l0Y2hpbmdTZXR0aW5ncygpO1xuICB9LFxuICBzZXRTd2l0Y2hpbmdUeXBlOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubW9kZWwuaXNTd2l0Y2hUb2wgPSAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10b2wnKSkuaXMoXCI6Y2hlY2tlZFwiKTtcbiAgICB0aGlzLnRvZ2dsZVN3aXRjaGluZ1NldHRpbmdzSW5wdXQoKTtcbiAgfSxcbiAgdG9nZ2xlU3dpdGNoaW5nU2V0dGluZ3NJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMubW9kZWwuaXNTd2l0Y2hUb2wpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdGhyZXNob2xkJykpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLXRvbGVyYW5jZScpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIH1lbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdG9sZXJhbmNlJykpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLXRocmVzaG9sZCcpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIH1cbiAgfSxcbiAgdG9nZ2xlU3dpdGNoaW5nU2V0dGluZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLm1vZGVsLm1vZGUgPT09IFwiZHluYW1pY1wiKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLXRvbCcpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLW1pbicpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgIHRoaXMudG9nZ2xlU3dpdGNoaW5nU2V0dGluZ3NJbnB1dCgpO1xuICAgIH1lbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdG9sJykpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy1taW4nKSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLXRocmVzaG9sZCcpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10b2xlcmFuY2UnKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIH1cbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFN3aXRjaFRvbDoge1xuICAgICAgaG9vazogJ3N3aXRjaGluZy10b2xlcmFuY2UnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdzd2l0Y2hpbmctdG9sZXJhbmNlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdzd2l0Y2hUb2wnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuc3dpdGNoVG9sLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFN3aXRjaE1pbjoge1xuICAgICAgaG9vazogJ3N3aXRjaGluZy10aHJlc2hvbGQnLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdzd2l0Y2hpbmctdGhyZXNob2xkJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdzd2l0Y2hNaW4nLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuc3dpdGNoTWluLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0Q3VzdG9tU3RvaWNoU3BlY2llLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdFZpZXcuZXh0ZW5kKHtcbiAgLy8gU2VsZWN0VmlldyBleHBlY3RzIGEgc3RyaW5nIHRlbXBsYXRlLCBzbyBwcmUtcmVuZGVyIGl0XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSgpLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5yYXRpbycgOiB7XG4gICAgICBob29rOiAncmF0aW8nXG4gICAgfVxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIHNlbGVjdCcgOiAnc2VsZWN0Q2hhbmdlSGFuZGxlcicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9aW5jcmVtZW50XScgOiAnaGFuZGxlSW5jcmVtZW50JyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1kZWNyZW1lbnRdJyA6ICdoYW5kbGVEZWNyZW1lbnQnLFxuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ2RlbGV0ZVNwZWNpZSdcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgU2VsZWN0Vmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLm1vZGVsLnNwZWNpZSB8fCBudWxsO1xuICAgIHRoaXMuaXNSZWFjdGFudHMgPSB0aGlzLnBhcmVudC5wYXJlbnQuaXNSZWFjdGFudHM7XG4gICAgdGhpcy5yZWFjdGlvblR5cGUgPSB0aGlzLnBhcmVudC5wYXJlbnQucmVhY3Rpb25UeXBlO1xuICAgIHRoaXMuc3RvaWNoU3BlY2llcyA9IHRoaXMucGFyZW50LnBhcmVudC5jb2xsZWN0aW9uO1xuICAgIHRoaXMuc3RvaWNoU3BlY2llcy5vbignYWRkJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi50b2dnbGVJbmNyZW1lbnRCdXR0b24oKTtcbiAgICB9KTtcbiAgICB0aGlzLnN0b2ljaFNwZWNpZXMub24oJ3JlbW92ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYudG9nZ2xlSW5jcmVtZW50QnV0dG9uKCk7XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFNlbGVjdFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzKTtcbiAgICB0aGlzLnRvZ2dsZUluY3JlbWVudEJ1dHRvbigpO1xuICAgIHRoaXMudG9nZ2xlRGVjcmVtZW50QnV0dG9uKCk7XG4gIH0sXG4gIHNlbGVjdENoYW5nZUhhbmRsZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLmdldFNwZWNpZXNDb2xsZWN0aW9uKCk7XG4gICAgdmFyIHJlYWN0aW9ucyA9IHRoaXMuZ2V0UmVhY3Rpb25zQ29sbGVjdGlvbigpO1xuICAgIHZhciBzcGVjaWUgPSBzcGVjaWVzLmZpbHRlcihmdW5jdGlvbiAobSkge1xuICAgICAgcmV0dXJuIG0ubmFtZSA9PT0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB9KVswXTtcbiAgICB0aGlzLm1vZGVsLnNwZWNpZSA9IHNwZWNpZTtcbiAgICB0aGlzLnZhbHVlID0gc3BlY2llO1xuICAgIHJlYWN0aW9ucy50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgfSxcbiAgZ2V0U3BlY2llc0NvbGxlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzO1xuICB9LFxuICBnZXRSZWFjdGlvbnNDb2xsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuY29sbGVjdGlvbjtcbiAgfSxcbiAgaGFuZGxlSW5jcmVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy52YWxpZGF0ZVJhdGlvSW5jcmVtZW50KCkpe1xuICAgICAgdGhpcy5tb2RlbC5yYXRpbysrO1xuICAgICAgdGhpcy50b2dnbGVJbmNyZW1lbnRCdXR0b24oKTtcbiAgICAgIHRoaXMucGFyZW50LnBhcmVudC50b2dnbGVBZGRTcGVjaWVCdXR0b24oKTtcbiAgICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgICB9XG4gICAgdGhpcy50b2dnbGVEZWNyZW1lbnRCdXR0b24oKTtcbiAgfSxcbiAgdmFsaWRhdGVSYXRpb0luY3JlbWVudDogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuc3RvaWNoU3BlY2llcy5sZW5ndGggPCAyICYmIHRoaXMubW9kZWwucmF0aW8gPCAyKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgaWYodGhpcy5yZWFjdGlvblR5cGUgIT09ICdjdXN0b20tbWFzc2FjdGlvbicpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBpZighdGhpcy5pc1JlYWN0YW50cylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgdG9nZ2xlSW5jcmVtZW50QnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXRoaXMudmFsaWRhdGVSYXRpb0luY3JlbWVudCgpKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnaW5jcmVtZW50JykpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2luY3JlbWVudCcpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB9XG4gIH0sXG4gIHRvZ2dsZURlY3JlbWVudEJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMubW9kZWwucmF0aW8gPD0gMSlcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnZGVjcmVtZW50JykpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgZWxzZVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdkZWNyZW1lbnQnKSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gIH0sXG4gIGhhbmRsZURlY3JlbWVudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwucmF0aW8tLTtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnRyaWdnZXIoJ2NoYW5nZS1yZWFjdGlvbicpXG4gICAgdGhpcy50b2dnbGVEZWNyZW1lbnRCdXR0b24oKTtcbiAgICBpZih0aGlzLnZhbGlkYXRlUmF0aW9JbmNyZW1lbnQoKSl7XG4gICAgICB0aGlzLnRvZ2dsZUluY3JlbWVudEJ1dHRvbigpO1xuICAgICAgdGhpcy5wYXJlbnQucGFyZW50LnRvZ2dsZUFkZFNwZWNpZUJ1dHRvbigpO1xuICAgIH1cbiAgfSxcbiAgZGVsZXRlU3BlY2llOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC50cmlnZ2VyKCdjaGFuZ2UtcmVhY3Rpb24nKVxuICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmVTdG9pY2hTcGVjaWUodGhpcy5tb2RlbCk7XG4gICAgdGhpcy5wYXJlbnQucGFyZW50LnRvZ2dsZUFkZFNwZWNpZUJ1dHRvbigpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0RXZlbnRBc3NpZ25tZW50LnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZW1vdmVdJyA6ICdyZW1vdmVBc3NpZ25tZW50JyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9ZXZlbnQtYXNzaWdubWVudC12YXJpYWJsZV0nIDogJ3NlbGVjdEFzc2lnbm1lbnRWYXJpYWJsZScsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICB2YXIgdmFyaWFibGVTZWxlY3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGVzOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICB2YWx1ZTogdGhpcy5tb2RlbC52YXJpYWJsZS5uYW1lLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHZhcmlhYmxlU2VsZWN0VmlldywgJ2V2ZW50LWFzc2lnbm1lbnQtdmFyaWFibGUnKTtcbiAgICB2YXIgaW5wdXRGaWVsZCA9IHRoaXMucXVlcnlCeUhvb2soJ2V2ZW50LWFzc2lnbm1lbnQtRXhwcmVzc2lvbicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdO1xuICAgICQoaW5wdXRGaWVsZCkuYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiLS0tTm8gRXhwcmVzc2lvbiBFbnRlcmVkLS0tXCIpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVtb3ZlQXNzaWdubWVudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZUV2ZW50QXNzaWdubWVudCh0aGlzLm1vZGVsKVxuICB9LFxuICBnZXRPcHRpb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXM7XG4gICAgdmFyIHBhcmFtZXRlcnMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnM7XG4gICAgdmFyIHNwZWNpZXNOYW1lcyA9IHNwZWNpZXMubWFwKGZ1bmN0aW9uIChzcGVjaWUpIHsgcmV0dXJuIHNwZWNpZS5uYW1lIH0pO1xuICAgIHZhciBwYXJhbWV0ZXJOYW1lcyA9IHBhcmFtZXRlcnMubWFwKGZ1bmN0aW9uIChwYXJhbWV0ZXIpIHsgcmV0dXJuIHBhcmFtZXRlci5uYW1lIH0pO1xuICAgIHJldHVybiBzcGVjaWVzTmFtZXMuY29uY2F0KHBhcmFtZXRlck5hbWVzKTtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2VsZWN0QXNzaWdubWVudFZhcmlhYmxlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzO1xuICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzO1xuICAgIHZhciB2YWwgPSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIHZhciBldmVudFZhciA9IHNwZWNpZXMuZmlsdGVyKGZ1bmN0aW9uIChzcGVjaWUpIHtcbiAgICAgIGlmKHNwZWNpZS5uYW1lID09PSB2YWwpIHtcbiAgICAgICAgcmV0dXJuIHNwZWNpZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZighZXZlbnRWYXIubGVuZ3RoKSB7XG4gICAgICBldmVudFZhciA9IHBhcmFtZXRlcnMuZmlsdGVyKGZ1bmN0aW9uIChwYXJhbWV0ZXIpIHtcbiAgICAgICAgaWYocGFyYW1ldGVyLm5hbWUgPT09IHZhbCkge1xuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLm1vZGVsLnZhcmlhYmxlID0gZXZlbnRWYXJbMF07XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uLnRyaWdnZXIoJ2NoYW5nZScpO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0QXNzaWdubWVudEV4cHJlc3Npb246IHtcbiAgICAgIGhvb2s6ICdldmVudC1hc3NpZ25tZW50LUV4cHJlc3Npb24nLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdldmVudC1hc3NpZ25tZW50LWV4cHJlc3Npb24nLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6ICdleHByZXNzaW9uJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmV4cHJlc3Npb24sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdEZ1bmN0aW9uRGVmaW5pdGlvbi5wdWcnKTtcblxubGV0IGZ1bmN0aW9uRGVmaW5pdGlvbkFubm90YXRpb25Nb2RhbEh0bWwgPSAoZnVuY3Rpb25EZWZpbml0aW9uTmFtZSwgYW5ub3RhdGlvbikgPT4ge1xuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkFubm90YXRpb24gZm9yICR7ZnVuY3Rpb25EZWZpbml0aW9uTmFtZX08L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgPHNwYW4gZm9yPVwiZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbklucHV0XCI+QW5ub3RhdGlvbjogPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uSW5wdXRcIiBuYW1lPVwiZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbklucHV0XCIgc2l6ZT1cIjMwXCIgYXV0b2ZvY3VzIHZhbHVlPVwiJHthbm5vdGF0aW9ufVwiPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IG9rLW1vZGVsLWJ0blwiPk9LPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ3JlbW92ZUZ1bmN0aW9uRGVmaW5pdGlvbicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZWRpdC1hbm5vdGF0aW9uLWJ0bl0nIDogJ2VkaXRBbm5vdGF0aW9uJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgZWRpdEFubm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLm1vZGVsLm5hbWU7XG4gICAgdmFyIGFubm90YXRpb24gPSB0aGlzLm1vZGVsLmFubm90YXRpb247XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Z1bmN0aW9uRGVmaW5pdGlvbkFubm90YXRpb25Nb2RhbCcpKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbk1vZGFsJykucmVtb3ZlKCk7XG4gICAgfVxuICAgIGxldCBtb2RhbCA9ICQoZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbk1vZGFsSHRtbChuYW1lLCBhbm5vdGF0aW9uKSkubW9kYWwoKTtcbiAgICBsZXQgb2tCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbk1vZGFsIC5vay1tb2RlbC1idG4nKTtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbk1vZGFsICNmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5tb2RlbC5hbm5vdGF0aW9uID0gaW5wdXQudmFsdWU7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJFZGlyRnVuY3Rpb25EZWZpbml0aW9uVmlldygpO1xuICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICB9KTtcbiAgfSxcbiAgcmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnJlbW92ZSh0aGlzLm1vZGVsKTtcbiAgfSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG52YXIgU2NhdHRlckRldGFpbHMgPSByZXF1aXJlKCcuL2VkaXQtc2NhdHRlci1kZXRhaWxzJyk7XG52YXIgUGxhY2VEZXRhaWxzID0gcmVxdWlyZSgnLi9lZGl0LXBsYWNlLWRldGFpbHMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdEluaXRpYWxDb25kaXRpb24ucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ3JlbW92ZUluaXRpYWxDb25kaXRpb24nLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1pbml0aWFsLWNvbmRpdGlvbi10eXBlXScgOiAnc2VsZWN0SW5pdGlhbENvbmRpdGlvblR5cGUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1pbml0aWFsLWNvbmRpdGlvbi1zcGVjaWVzXScgOiAnc2VsZWN0SW5pdGlhbENvbmRpdGlvblNwZWNpZXMnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgb3B0aW9ucyA9IFsnU2NhdHRlcicsICdQbGFjZScsICdEaXN0cmlidXRlIFVuaWZvcm1seSBwZXIgVm94ZWwnXTtcbiAgICB2YXIgdHlwZVNlbGVjdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAndHlwZScsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlczogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgdmFsdWU6IHNlbGYubW9kZWwudHlwZSxcbiAgICB9KTtcbiAgICB2YXIgc3BlY2llc1NlbGVjdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnc3BlY2llJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgdGV4dEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgZWFnZXJWYWxpZGF0ZTogdHJ1ZSxcbiAgICAgIG9wdGlvbnM6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcyxcbiAgICAgIC8vIEZvciBuZXcgcmVhY3Rpb25zICh3aXRoIG5vIHJhdGUubmFtZSkganVzdCB1c2UgdGhlIGZpcnN0IHBhcmFtZXRlciBpbiB0aGUgUGFyYW1ldGVycyBjb2xsZWN0aW9uXG4gICAgICAvLyBFbHNlIGZldGNoIHRoZSByaWdodCBQYXJhbWV0ZXIgZnJvbSBQYXJhbWV0ZXJzIGJhc2VkIG9uIGV4aXN0aW5nIHJhdGVcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnNwZWNpZS5uYW1lID8gdGhpcy5nZXRTcGVjaWVGcm9tU3BlY2llcyh0aGlzLm1vZGVsLnNwZWNpZS5uYW1lKSA6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcy5hdCgwKSxcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlckRldGFpbHNWaWV3KCk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodHlwZVNlbGVjdFZpZXcsICdpbml0aWFsLWNvbmRpdGlvbi10eXBlJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3BlY2llc1NlbGVjdFZpZXcsICdpbml0aWFsLWNvbmRpdGlvbi1zcGVjaWVzJyk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICByZW5kZXJEZXRhaWxzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuZGV0YWlsc1ZpZXcpIHtcbiAgICAgIHRoaXMuZGV0YWlsc1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHZhciBJbml0aWFsQ29uZGl0aW9uRGV0YWlscyA9IHRoaXMubW9kZWwudHlwZSA9PT0gJ1BsYWNlJyA/IFBsYWNlRGV0YWlscyA6IFNjYXR0ZXJEZXRhaWxzXG4gICAgdGhpcy5kZXRhaWxzVmlldyA9IG5ldyBJbml0aWFsQ29uZGl0aW9uRGV0YWlscyh7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICBtb2RlbDogdGhpcy5tb2RlbCxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0aGlzLmRldGFpbHNWaWV3LCAnaW5pdGlhbC1jb25kaXRpb24tZGV0YWlscycpO1xuICB9LFxuICBnZXRTcGVjaWVGcm9tU3BlY2llczogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcy5maWx0ZXIoZnVuY3Rpb24gKHNwZWNpZSkge1xuICAgICAgcmV0dXJuIHNwZWNpZS5uYW1lID09PSBuYW1lO1xuICAgIH0pWzBdO1xuICAgIHJldHVybiBzcGVjaWVzO1xuICB9LFxuICByZW1vdmVJbml0aWFsQ29uZGl0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZUluaXRpYWxDb25kaXRpb24odGhpcy5tb2RlbCk7XG4gIH0sXG4gIHNlbGVjdEluaXRpYWxDb25kaXRpb25UeXBlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBjdXJyZW50VHlwZSA9IHRoaXMubW9kZWwudHlwZTtcbiAgICB2YXIgbmV3VHlwZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5tb2RlbC50eXBlID0gbmV3VHlwZTtcbiAgICBpZihjdXJyZW50VHlwZSA9PT0gXCJQbGFjZVwiIHx8IG5ld1R5cGUgPT09IFwiUGxhY2VcIil7XG4gICAgICB0aGlzLnJlbmRlckRldGFpbHNWaWV3KCk7XG4gICAgfVxuICB9LFxuICBzZWxlY3RJbml0aWFsQ29uZGl0aW9uU3BlY2llczogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgbmFtZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHNwZWNpZSA9IHRoaXMuZ2V0U3BlY2llRnJvbVNwZWNpZXMobmFtZSk7XG4gICAgdGhpcy5tb2RlbC5zcGVjaWUgPSBzcGVjaWUgfHwgdGhpcy5tb2RlbC5zcGVjaWU7XG4gIH0sXG59KTsiLCJ2YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFJlYWN0aW9uVmFyLnB1ZycpO1xuXG5sZXQgcGFyYW1ldGVyQW5ub3RhdGlvbk1vZGFsSHRtbCA9IChwYXJhbWV0ZXJOYW1lLCBhbm5vdGF0aW9uKSA9PiB7XG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cInBhcmFtZXRlckFubm90YXRpb25Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+QW5ub3RhdGlvbiBmb3IgJHtwYXJhbWV0ZXJOYW1lfTwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8c3BhbiBmb3I9XCJwYXJhbWV0ZXJBbm5vdGF0aW9uSW5wdXRcIj5Bbm5vdGF0aW9uOiA8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInBhcmFtZXRlckFubm90YXRpb25JbnB1dFwiIG5hbWU9XCJwYXJhbWV0ZXJBbm5vdGF0aW9uSW5wdXRcIiBzaXplPVwiMzBcIiBhdXRvZm9jdXMgdmFsdWU9XCIke2Fubm90YXRpb259XCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgb2stbW9kZWwtYnRuXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaW5Vc2UnOiB7XG4gICAgICBob29rOiAncmVtb3ZlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdkaXNhYmxlZCcsXG4gICAgfSxcbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZWRpdC1hbm5vdGF0aW9uLWJ0bl0nIDogJ2VkaXRBbm5vdGF0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZW1vdmVdJyA6ICdyZW1vdmVQYXJhbWV0ZXInLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1pbnB1dC1uYW1lLWNvbnRhaW5lcl0nIDogJ3NldFBhcmFtZXRlck5hbWUnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKCdbYXV0b2ZvY3VzXScsIGUudGFyZ2V0KS5mb2N1cygpO1xuICAgIH0pO1xuICAgIGlmKCF0aGlzLm1vZGVsLmFubm90YXRpb24pe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdlZGl0LWFubm90YXRpb24tYnRuJykpLnRleHQoJ0FkZCcpXG4gICAgfVxuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVtb3ZlUGFyYW1ldGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlUGFyYW1ldGVyKHRoaXMubW9kZWwpO1xuICB9LFxuICBlZGl0QW5ub3RhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbmFtZSA9IHRoaXMubW9kZWwubmFtZTtcbiAgICB2YXIgYW5ub3RhdGlvbiA9IHRoaXMubW9kZWwuYW5ub3RhdGlvbjtcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFyYW1ldGVyQW5ub3RhdGlvbk1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYXJhbWV0ZXJBbm5vdGF0aW9uTW9kYWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgbGV0IG1vZGFsID0gJChwYXJhbWV0ZXJBbm5vdGF0aW9uTW9kYWxIdG1sKG5hbWUsIGFubm90YXRpb24pKS5tb2RhbCgpO1xuICAgIGxldCBva0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYXJhbWV0ZXJBbm5vdGF0aW9uTW9kYWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYXJhbWV0ZXJBbm5vdGF0aW9uTW9kYWwgI3BhcmFtZXRlckFubm90YXRpb25JbnB1dCcpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT09IDEzKXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb2tCdG4uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBva0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLm1vZGVsLmFubm90YXRpb24gPSBpbnB1dC52YWx1ZTtcbiAgICAgIHNlbGYucGFyZW50LnJlbmRlckVkaXRQYXJhbWV0ZXIoKTtcbiAgICAgIG1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgfSk7XG4gIH0sXG4gIHNldFBhcmFtZXRlck5hbWU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5tb2RlbC5uYW1lID0gZS50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoJ3VwZGF0ZS1wYXJhbWV0ZXJzJywgdGhpcy5tb2RlbC5jb21wSUQsIHRoaXMubW9kZWwpO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi50cmlnZ2VyKCdyZW1vdmUnKVxuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0TmFtZToge1xuICAgICAgaG9vazogJ2lucHV0LW5hbWUtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy5uYW1lVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICcnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwubmFtZSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRWYWx1ZToge1xuICAgICAgaG9vazogJ2lucHV0LXZhbHVlLWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2V4cHJlc3Npb24nLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6ICdleHByZXNzaW9uJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmV4cHJlc3Npb24sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFBsYWNlRGV0YWlscy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuY291bnQnOiB7XG4gICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgaG9vazogJ2NvdW50LWNvbnRhaW5lcicsXG4gICAgfSxcbiAgICAnbW9kZWwueCc6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBob29rOiAneC1jb250YWluZXInLFxuICAgIH0sXG4gICAgJ21vZGVsLnknOiB7XG4gICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgaG9vazogJ3ktY29udGFpbmVyJyxcbiAgICB9LFxuICAgICdtb2RlbC56Jzoge1xuICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgIGhvb2s6ICd6LWNvbnRhaW5lcicsXG4gICAgfSxcbiAgfSxcbiAgZXZlbnRzOiB7XG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0Q291bnQ6IHtcbiAgICAgIGhvb2s6ICdjb3VudC1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdjb3VudCcsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnY291bnQnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuY291bnQsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0WDoge1xuICAgICAgaG9vazogJ3gtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlczogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnWCcsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAneCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC54LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFk6IHtcbiAgICAgIGhvb2s6ICd5LWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ1knLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3knLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwueSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRaOiB7XG4gICAgICBob29rOiAnei1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdaJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICd6JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0UnVsZS5wdWcnKTtcblxubGV0IHJ1bGVBbm5vdGF0aW9uTW9kYWxIdG1sID0gKHJ1bGVOYW1lLCBhbm5vdGF0aW9uKSA9PiB7XG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cInJ1bGVBbm5vdGF0aW9uTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkFubm90YXRpb24gZm9yICR7cnVsZU5hbWV9PC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxzcGFuIGZvcj1cInJ1bGVBbm5vdGF0aW9uSW5wdXRcIj5Bbm5vdGF0aW9uOiA8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInJ1bGVBbm5vdGF0aW9uSW5wdXRcIiBuYW1lPVwicnVsZUFubm90YXRpb25JbnB1dFwiIHNpemU9XCIzMFwiIGF1dG9mb2N1cyB2YWx1ZT1cIiR7YW5ub3RhdGlvbn1cIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBvay1tb2RlbC1idG5cIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9cnVsZS10eXBlXScgOiAnc2VsZWN0UnVsZVR5cGUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1ydWxlLXZhcmlhYmxlXScgOiAnc2VsZWN0UnVsZVZhcmlhYmxlJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LWFubm90YXRpb24tYnRuXScgOiAnZWRpdEFubm90YXRpb24nLFxuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ3JlbW92ZVJ1bGUnLFxuICB9LFxuICBpbml0aWFpbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhaWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB2YXIgaW5wdXRGaWVsZCA9IHRoaXMucXVlcnlCeUhvb2soJ3J1bGUtZXhwcmVzc2lvbicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdO1xuICAgICQoaW5wdXRGaWVsZCkuYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiLS0tTm8gRXhwcmVzc2lvbiBFbnRlcmVkLS0tXCIpO1xuICAgIHZhciB2YXJPcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgdmFyIHR5cGVPcHRpb25zID0gWydSYXRlIFJ1bGUnLCAnQXNzaWdubWVudCBSdWxlJ11cbiAgICB2YXIgdHlwZVNlbGVjdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAndHlwZScsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlczogJ2NpZCcsXG4gICAgICBvcHRpb25zOiB0eXBlT3B0aW9ucyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnR5cGUsXG4gICAgfSk7XG4gICAgdmFyIHZhcmlhYmxlU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICd2YXJpYWJsZScsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlczogJ2NpZCcsXG4gICAgICBvcHRpb25zOiB2YXJPcHRpb25zLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwudmFyaWFibGUubmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0eXBlU2VsZWN0VmlldywgXCJydWxlLXR5cGVcIik7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodmFyaWFibGVTZWxlY3RWaWV3LCAncnVsZS12YXJpYWJsZScpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKCdbYXV0b2ZvY3VzXScsIGUudGFyZ2V0KS5mb2N1cygpO1xuICAgIH0pO1xuICAgIGlmKCF0aGlzLm1vZGVsLmFubm90YXRpb24pe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdlZGl0LWFubm90YXRpb24tYnRuJykpLnRleHQoJ0FkZCcpXG4gICAgfVxuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIGVkaXRBbm5vdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBuYW1lID0gdGhpcy5tb2RlbC5uYW1lO1xuICAgIHZhciBhbm5vdGF0aW9uID0gdGhpcy5tb2RlbC5hbm5vdGF0aW9uO1xuICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNydWxlQW5ub3RhdGlvbk1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNydWxlQW5ub3RhdGlvbk1vZGFsJykucmVtb3ZlKCk7XG4gICAgfVxuICAgIGxldCBtb2RhbCA9ICQocnVsZUFubm90YXRpb25Nb2RhbEh0bWwobmFtZSwgYW5ub3RhdGlvbikpLm1vZGFsKCk7XG4gICAgbGV0IG9rQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3J1bGVBbm5vdGF0aW9uTW9kYWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNydWxlQW5ub3RhdGlvbk1vZGFsICNydWxlQW5ub3RhdGlvbklucHV0Jyk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PT0gMTMpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBva0J0bi5jbGljaygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9rQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYubW9kZWwuYW5ub3RhdGlvbiA9IGlucHV0LnZhbHVlO1xuICAgICAgc2VsZi5wYXJlbnQucmVuZGVyUnVsZXMoKTtcbiAgICAgIG1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgfSk7XG4gIH0sXG4gIGdldE9wdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcztcbiAgICB2YXIgcGFyYW1ldGVycyA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycztcbiAgICB2YXIgc3BlY2llc05hbWVzID0gc3BlY2llcy5tYXAoZnVuY3Rpb24gKHNwZWNpZSkgeyByZXR1cm4gc3BlY2llLm5hbWUgfSk7XG4gICAgdmFyIHBhcmFtZXRlck5hbWVzID0gcGFyYW1ldGVycy5tYXAoZnVuY3Rpb24gKHBhcmFtZXRlcikgeyByZXR1cm4gcGFyYW1ldGVyLm5hbWUgfSk7XG4gICAgcmV0dXJuIHNwZWNpZXNOYW1lcy5jb25jYXQocGFyYW1ldGVyTmFtZXMpO1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBzZWxlY3RSdWxlVHlwZTogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdHlwZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdGhpcy5tb2RlbC50eXBlID0gdHlwZTtcbiAgfSxcbiAgc2VsZWN0UnVsZVZhcmlhYmxlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzO1xuICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzO1xuICAgIHZhciB2YWwgPSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIHZhciBydWxlVmFyID0gc3BlY2llcy5maWx0ZXIoZnVuY3Rpb24gKHNwZWNpZSkge1xuICAgICAgaWYoc3BlY2llLm5hbWUgPT09IHZhbCkge1xuICAgICAgICByZXR1cm4gc3BlY2llO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKCFydWxlVmFyLmxlbmd0aCkge1xuICAgICAgcnVsZVZhciA9IHBhcmFtZXRlcnMuZmlsdGVyKGZ1bmN0aW9uIChwYXJhbWV0ZXIpIHtcbiAgICAgICAgaWYocGFyYW1ldGVyLm5hbWUgPT09IHZhbCkge1xuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLm1vZGVsLnZhcmlhYmxlID0gcnVsZVZhclswXTtcbiAgfSxcbiAgcmVtb3ZlUnVsZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5yZW1vdmVSdWxlKHRoaXMubW9kZWwpO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0TmFtZToge1xuICAgICAgaG9vazogJ3J1bGUtbmFtZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3ICh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdydWxlLW5hbWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMubmFtZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnbmFtZScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFJ1bGU6IHtcbiAgICAgIGhvb2s6ICdydWxlLWV4cHJlc3Npb24nLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0VmlldyAoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgbmFtZTogJ3J1bGUtZXhwcmVzc2lvbicsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ2V4cHJlc3Npb24nLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZXhwcmVzc2lvbixcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFNjYXR0ZXJEZXRhaWxzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5jb3VudCc6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBob29rOiAnY291bnQtY29udGFpbmVyJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3ViZG9tYWluLWNvbnRhaW5lcl0nIDogJ3NlbGVjdEluaXRpYWxDb25kaXRpb25TdWJkb21haW4nLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBzdWJkb21haW5TZWxlY3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3N1YmRvbWFpbicsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGlkQXR0cmlidXRlOiAnY2lkJyxcbiAgICAgIHRleHRBdHRyaWJ1dGU6ICduYW1lJyxcbiAgICAgIGVhZ2VyVmFsaWRhdGU6IHRydWUsXG4gICAgICBvcHRpb25zOiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50Lm1lc2hTZXR0aW5ncy51bmlxdWVTdWJkb21haW5zLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwuc3ViZG9tYWluID8gdGhpcy5nZXRTdWJkb21haW5Gcm9tU3ViZG9tYWlucyh0aGlzLm1vZGVsLnN1YmRvbWFpbikgOiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50Lm1lc2hTZXR0aW5ncy51bmlxdWVTdWJkb21haW5zLmF0KDApXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3ViZG9tYWluU2VsZWN0VmlldywgJ3N1YmRvbWFpbi1jb250YWluZXInKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIHNlbGVjdEluaXRpYWxDb25kaXRpb25TdWJkb21haW46IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIG5hbWUgPSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIHZhciBzdWJkb21haW4gPSB0aGlzLmdldFN1YmRvbWFpbkZyb21TdWJkb21haW5zKG5hbWUpO1xuICAgIHRoaXMubW9kZWwuc3ViZG9tYWluID0gc3ViZG9tYWluLm5hbWUgfHwgdGhpcy5tb2RlbC5zdWJkb21haW47XG4gIH0sXG4gIGdldFN1YmRvbWFpbkZyb21TdWJkb21haW5zOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzdWJkb21haW4gPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50Lm1lc2hTZXR0aW5ncy51bmlxdWVTdWJkb21haW5zLm1vZGVscy5maWx0ZXIoZnVuY3Rpb24gKHN1YmRvbWFpbikge1xuICAgICAgcmV0dXJuIHN1YmRvbWFpbi5uYW1lID09PSBuYW1lO1xuICAgIH0pWzBdO1xuICAgIHJldHVybiBzdWJkb21haW47XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXRDb3VudDoge1xuICAgICAgaG9vazogJ2NvdW50LWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2NvdW50JyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdjb3VudCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5jb3VudCxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgU3ViZG9tYWluc1ZpZXcgPSByZXF1aXJlKCcuL3N1YmRvbWFpbicpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0U3BhdGlhbFNwZWNpZS5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaW5Vc2UnOiB7XG4gICAgICBob29rOiAncmVtb3ZlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdkaXNhYmxlZCcsXG4gICAgfSxcbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAncmVtb3ZlU3BlY2llJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuYmFzZU1vZGVsID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICB0aGlzLmJhc2VNb2RlbC5vbignbWVzaC11cGRhdGUnLCB0aGlzLnVwZGF0ZURlZmF1bHRTdWJkb21haW5zLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJTdWJkb21haW5zKCk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW1vdmVTcGVjaWU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmVTcGVjaWUodGhpcy5tb2RlbCk7XG4gIH0sXG4gIHVwZGF0ZURlZmF1bHRTdWJkb21haW5zOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5zdWJkb21haW5zID0gdGhpcy5iYXNlTW9kZWwubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMubWFwKGZ1bmN0aW9uIChtb2RlbCkge3JldHVybiBtb2RlbC5uYW1lOyB9KTtcbiAgICB0aGlzLnJlbmRlclN1YmRvbWFpbnMoKTtcbiAgfSxcbiAgcmVuZGVyU3ViZG9tYWluczogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuc3ViZG9tYWluc1ZpZXcpXG4gICAgICB0aGlzLnN1YmRvbWFpbnNWaWV3LnJlbW92ZSgpO1xuICAgIHZhciBzdWJkb21haW5zID0gdGhpcy5iYXNlTW9kZWwubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnM7XG4gICAgdGhpcy5zdWJkb21haW5zVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHN1YmRvbWFpbnMsXG4gICAgICBTdWJkb21haW5zVmlldyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ3N1YmRvbWFpbnMnKVxuICAgICk7XG4gIH0sXG4gIHVwZGF0ZVN1YmRvbWFpbnM6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgaWYoZWxlbWVudC5uYW1lID09ICdzdWJkb21haW4nKSB7XG4gICAgICB2YXIgc3ViZG9tYWluID0gZWxlbWVudC52YWx1ZS5tb2RlbDtcbiAgICAgIHZhciBjaGVja2VkID0gZWxlbWVudC52YWx1ZS5jaGVja2VkO1xuICAgICAgaWYoY2hlY2tlZClcbiAgICAgICAgdGhpcy5tb2RlbC5zdWJkb21haW5zID0gXy51bmlvbih0aGlzLm1vZGVsLnN1YmRvbWFpbnMsIFtzdWJkb21haW4ubmFtZV0pO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLm1vZGVsLnN1YmRvbWFpbnMgPSBfLmRpZmZlcmVuY2UodGhpcy5tb2RlbC5zdWJkb21haW5zLCBbc3ViZG9tYWluLm5hbWVdKTtcbiAgICB9XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXROYW1lOiB7XG4gICAgICBob29rOiAnaW5wdXQtbmFtZS1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLm5hbWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ25hbWUnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwubmFtZSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRWYWx1ZToge1xuICAgICAgaG9vazogJ2lucHV0LWRpZmZ1c2lvbi1jb2VmZi1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdkaWZmdXNpb24gY29lZmYnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ2RpZmZ1c2lvbkNvZWZmJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmRpZmZ1c2lvbkNvZWZmLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0UmVhY3Rpb25WYXIucHVnJyk7XG5cbmxldCBzcGVjaWVzQW5ub3RhdGlvbk1vZGFsSHRtbCA9IChzcGVjaWVzTmFtZSwgYW5ub3RhdGlvbikgPT4ge1xuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJzcGVjaWVzQW5ub3RhdGlvbk1vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5Bbm5vdGF0aW9uIGZvciAke3NwZWNpZXNOYW1lfTwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8c3BhbiBmb3I9XCJzcGVjaWVzQW5ub3RhdGlvbklucHV0XCI+QW5ub3RhdGlvbjogPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJzcGVjaWVzQW5ub3RhdGlvbklucHV0XCIgbmFtZT1cInNwZWNpZXNBbm5vdGF0aW9uSW5wdXRcIiBzaXplPVwiMzBcIiBhdXRvZm9jdXMgdmFsdWU9XCIke2Fubm90YXRpb259XCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgb2stbW9kZWwtYnRuXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaW5Vc2UnOiB7XG4gICAgICBob29rOiAncmVtb3ZlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdkaXNhYmxlZCcsXG4gICAgfSxcbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZWRpdC1hbm5vdGF0aW9uLWJ0bl0nIDogJ2VkaXRBbm5vdGF0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZW1vdmVdJyA6ICdyZW1vdmVTcGVjaWUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1pbnB1dC1uYW1lLWNvbnRhaW5lcl0nIDogJ3NldFNwZWNpZXNOYW1lJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAkKGRvY3VtZW50KS5vbignc2hvd24uYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJCgnW2F1dG9mb2N1c10nLCBlLnRhcmdldCkuZm9jdXMoKTtcbiAgICB9KTtcbiAgICBpZighdGhpcy5tb2RlbC5hbm5vdGF0aW9uKXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnZWRpdC1hbm5vdGF0aW9uLWJ0bicpKS50ZXh0KCdBZGQnKVxuICAgIH1cbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoZSkge1xuICB9LFxuICByZW1vdmVTcGVjaWU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmVTcGVjaWUodGhpcy5tb2RlbCk7XG4gIH0sXG4gIHNldFNwZWNpZXNOYW1lOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubW9kZWwubmFtZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi50cmlnZ2VyKCd1cGRhdGUtc3BlY2llcycsIHRoaXMubW9kZWwuY29tcElELCB0aGlzLm1vZGVsLCB0cnVlKTtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24udHJpZ2dlcigncmVtb3ZlJyk7XG4gIH0sXG4gIGVkaXRBbm5vdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBuYW1lID0gdGhpcy5tb2RlbC5uYW1lO1xuICAgIHZhciBhbm5vdGF0aW9uID0gdGhpcy5tb2RlbC5hbm5vdGF0aW9uO1xuICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcGVjaWVzQW5ub3RhdGlvbk1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcGVjaWVzQW5ub3RhdGlvbk1vZGFsJykucmVtb3ZlKCk7XG4gICAgfVxuICAgIGxldCBtb2RhbCA9ICQoc3BlY2llc0Fubm90YXRpb25Nb2RhbEh0bWwobmFtZSwgYW5ub3RhdGlvbikpLm1vZGFsKCk7XG4gICAgbGV0IG9rQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NwZWNpZXNBbm5vdGF0aW9uTW9kYWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzcGVjaWVzQW5ub3RhdGlvbk1vZGFsICNzcGVjaWVzQW5ub3RhdGlvbklucHV0Jyk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PT0gMTMpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBva0J0bi5jbGljaygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9rQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYubW9kZWwuYW5ub3RhdGlvbiA9IGlucHV0LnZhbHVlO1xuICAgICAgc2VsZi5wYXJlbnQucmVuZGVyRWRpdFNwZWNpZXNWaWV3KCk7XG4gICAgICBtb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgIH0pO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0TmFtZToge1xuICAgICAgaG9vazogJ2lucHV0LW5hbWUtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy5uYW1lVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICcnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwubmFtZSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRWYWx1ZToge1xuICAgICAgaG9vazogJ2lucHV0LXZhbHVlLWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICd2YWx1ZScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC52YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFN0b2ljaFNwZWNpZS5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RWaWV3LmV4dGVuZCh7XG4gIC8vIFNlbGVjdFZpZXcgZXhwZWN0cyBhIHN0cmluZyB0ZW1wbGF0ZSwgc28gcHJlLXJlbmRlciBpdFxuICB0ZW1wbGF0ZTogdGVtcGxhdGUoKSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwucmF0aW8nIDoge1xuICAgICAgaG9vazogJ3JhdGlvJ1xuICAgIH1cbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBzZWxlY3QnIDogJ3NlbGVjdENoYW5nZUhhbmRsZXInXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICBTZWxlY3RWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMubW9kZWwuc3BlY2llIHx8IG51bGw7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgU2VsZWN0Vmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICBzZWxlY3RDaGFuZ2VIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5nZXRTcGVjaWVzQ29sbGVjdGlvbigpO1xuICAgIHZhciByZWFjdGlvbnMgPSB0aGlzLmdldFJlYWN0aW9uc0NvbGxlY3Rpb24oKTtcbiAgICB2YXIgc3BlY2llID0gc3BlY2llcy5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcbiAgICAgIHJldHVybiBtLm5hbWUgPT09IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgfSlbMF07XG4gICAgdGhpcy5tb2RlbC5zcGVjaWUgPSBzcGVjaWU7XG4gICAgdGhpcy52YWx1ZSA9IHNwZWNpZTtcbiAgICByZWFjdGlvbnMudHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnRyaWdnZXIoJ2NoYW5nZS1yZWFjdGlvbicpXG4gIH0sXG4gIGdldFJlYWN0aW9uc0NvbGxlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uO1xuICB9LFxuICBnZXRTcGVjaWVzQ29sbGVjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXM7XG4gIH0sXG59KTsiLCIvL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgRWRpdEV2ZW50QXNzaWdubWVudCA9IHJlcXVpcmUoJy4vZWRpdC1ldmVudC1hc3NpZ25tZW50Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50QXNzaWdubWVudHNFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWFkZC1ldmVudC1hc3NpZ25tZW50XScgOiAnYWRkQXNzaWdubWVudCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgRWRpdEV2ZW50QXNzaWdubWVudCxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ2V2ZW50LWFzc2lnbm1lbnRzLWNvbnRhaW5lcicpXG4gICAgKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIGFkZEFzc2lnbm1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24uYWRkRXZlbnRBc3NpZ25tZW50KCk7XG4gIH0sXG59KSIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xudmFyIEV2ZW50QXNzaWdubWVudCA9IHJlcXVpcmUoJy4vZXZlbnQtYXNzaWdubWVudHMtZWRpdG9yJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50RGV0YWlscy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaW5pdGlhbFZhbHVlJzoge1xuICAgICAgaG9vazogJ2V2ZW50LXRyaWdnZXItaW5pdC12YWx1ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY2hlY2tlZCcsXG4gICAgfSxcbiAgICAnbW9kZWwucGVyc2lzdGVudCc6IHtcbiAgICAgIGhvb2s6ICdldmVudC10cmlnZ2VyLXBlcnNpc3RlbnQnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2NoZWNrZWQnLFxuICAgIH0sXG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1ldmVudC10cmlnZ2VyLWluaXQtdmFsdWVdJyA6ICdzZXRUcmlnZ2VySW5pdGlhbFZhbHVlJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9ZXZlbnQtdHJpZ2dlci1wZXJzaXN0ZW50XScgOiAnc2V0VHJpZ2dlclBlcnNpc3RlbnQnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz10cmlnZ2VyLXRpbWVdJyA6ICdzZXRVc2VWYWx1ZXNGcm9tVHJpZ2dlclRpbWUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1hc3NpZ25tZW50LXRpbWVdJyA6ICdzZXRVc2VWYWx1ZXNGcm9tVHJpZ2dlclRpbWUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWFkdmFuY2VkLWV2ZW50LWJ1dHRvbl0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJFdmVudEFzc2lnbm1lbnRzKCk7XG4gICAgdmFyIHRyaWdnZXJFeHByZXNzaW9uRmllbGQgPSB0aGlzLnF1ZXJ5QnlIb29rKCdldmVudC10cmlnZ2VyLWV4cHJlc3Npb24nKS5jaGlsZHJlblswXS5jaGlsZHJlblsxXTtcbiAgICAkKHRyaWdnZXJFeHByZXNzaW9uRmllbGQpLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBcIi0tLU5vIEV4cHJlc3Npb24gRW50ZXJlZC0tLVwiKTtcbiAgICB2YXIgZGVsYXlGaWVsZCA9IHRoaXMucXVlcnlCeUhvb2soJ2V2ZW50LWRlbGF5JykuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMV07XG4gICAgJChkZWxheUZpZWxkKS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgXCItLS1ObyBFeHByZXNzaW9uIEVudGVyZWQtLS1cIik7XG4gICAgaWYodGhpcy5tb2RlbC51c2VWYWx1ZXNGcm9tVHJpZ2dlclRpbWUpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCd0cmlnZ2VyLXRpbWUnKSkucHJvcCgnY2hlY2tlZCcsIHRydWUpXG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2Fzc2lnbm1lbnQtdGltZScpKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcbiAgICB9XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuXG4gICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXJFdmVudEFzc2lnbm1lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5ldmVudEFzc2lnbm1lbnRzVmlldyl7XG4gICAgICB0aGlzLmV2ZW50QXNzaWdubWVudHNWaWV3LnJlbW92ZSgpXG4gICAgfVxuICAgIHRoaXMuZXZlbnRBc3NpZ25tZW50c1ZpZXcgPSBuZXcgRXZlbnRBc3NpZ25tZW50KHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuZXZlbnRBc3NpZ25tZW50cyxcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0aGlzLmV2ZW50QXNzaWdubWVudHNWaWV3LCAnZXZlbnQtYXNzaWdubWVudHMnKTtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2V0VHJpZ2dlckluaXRpYWxWYWx1ZTogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm1vZGVsLmluaXRpYWxWYWx1ZSA9IGUudGFyZ2V0LmNoZWNrZWQ7XG4gIH0sXG4gIHNldFRyaWdnZXJQZXJzaXN0ZW50OiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubW9kZWwucGVyc2lzdGVudCA9IGUudGFyZ2V0LmNoZWNrZWQ7XG4gIH0sXG4gIHNldFVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZTogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm1vZGVsLnVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZSA9IGUudGFyZ2V0LmRhdGFzZXQubmFtZSA9PT0gXCJ0cmlnZ2VyXCI7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtZXZlbnQtYnV0dG9uJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2FkdmFuY2VkLWV2ZW50LWJ1dHRvbicpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2FkdmFuY2VkLWV2ZW50LWJ1dHRvbicpKS50ZXh0KCcrJyk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXREZWxheToge1xuICAgICAgaG9vazogJ2V2ZW50LWRlbGF5JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgbmFtZTogJ2RlbGF5JyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6ICcnLFxuICAgICAgICAgIG1vZGVsS2V5OiAnZGVsYXknLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZGVsYXksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0UHJpb3JpdHk6IHtcbiAgICAgIGhvb2s6ICdldmVudC1wcmlvcml0eScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3ByaW9yaXR5JyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6ICcnLFxuICAgICAgICAgIG1vZGVsS2V5OiAncHJpb3JpdHknLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwucHJpb3JpdHksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0VHJpZ2dlckV4cHJlc3Npb246IHtcbiAgICAgIGhvb2s6ICdldmVudC10cmlnZ2VyLWV4cHJlc3Npb24nLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICd0cmlnZ2VyLWV4cHJlc3Npb24nLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6ICd0cmlnZ2VyRXhwcmVzc2lvbicsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC50cmlnZ2VyRXhwcmVzc2lvbixcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRMaXN0aW5ncy5wdWcnKTtcblxubGV0IGV2ZW50QW5ub3RhdGlvbk1vZGFsSHRtbCA9IChldmVudE5hbWUsIGFubm90YXRpb24pID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwiZXZlbnRBbm5vdGF0aW9uTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkFubm90YXRpb24gZm9yICR7ZXZlbnROYW1lfTwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8c3BhbiBmb3I9XCJldmVudEFubm90YXRpb25JbnB1dFwiPkFubm90YXRpb246IDwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZXZlbnRBbm5vdGF0aW9uSW5wdXRcIiBuYW1lPVwiZXZlbnRBbm5vdGF0aW9uSW5wdXRcIiBzaXplPVwiMzBcIiBhdXRvZm9jdXMgdmFsdWU9XCIke2Fubm90YXRpb259XCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgb2stbW9kZWwtYnRuXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubmFtZScgOiB7XG4gICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgaG9vazogJ2lucHV0LW5hbWUtY29udGFpbmVyJ1xuICAgIH0sXG4gICAgJ21vZGVsLnNlbGVjdGVkJyA6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUsIHByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9IHZhbHVlO1xuICAgICAgfSxcbiAgICAgIGhvb2s6ICdzZWxlY3QnXG4gICAgfVxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1zZWxlY3RdJyAgOiAnc2VsZWN0RXZlbnQnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtYW5ub3RhdGlvbi1idG5dJyA6ICdlZGl0QW5ub3RhdGlvbicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAncmVtb3ZlRXZlbnQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKCdbYXV0b2ZvY3VzXScsIGUudGFyZ2V0KS5mb2N1cygpO1xuICAgIH0pO1xuICAgIGlmKCF0aGlzLm1vZGVsLmFubm90YXRpb24pe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdlZGl0LWFubm90YXRpb24tYnRuJykpLnRleHQoJ0FkZCcpXG4gICAgfVxuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgc2VsZWN0RXZlbnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoXCJzZWxlY3RcIiwgdGhpcy5tb2RlbCk7XG4gIH0sXG4gIGVkaXRBbm5vdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBuYW1lID0gdGhpcy5tb2RlbC5uYW1lO1xuICAgIHZhciBhbm5vdGF0aW9uID0gdGhpcy5tb2RlbC5hbm5vdGF0aW9uO1xuICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNldmVudEFubm90YXRpb25Nb2RhbCcpKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZXZlbnRBbm5vdGF0aW9uTW9kYWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgbGV0IG1vZGFsID0gJChldmVudEFubm90YXRpb25Nb2RhbEh0bWwobmFtZSwgYW5ub3RhdGlvbikpLm1vZGFsKCk7XG4gICAgbGV0IG9rQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2V2ZW50QW5ub3RhdGlvbk1vZGFsIC5vay1tb2RlbC1idG4nKTtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZXZlbnRBbm5vdGF0aW9uTW9kYWwgI2V2ZW50QW5ub3RhdGlvbklucHV0Jyk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PT0gMTMpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBva0J0bi5jbGljaygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9rQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYubW9kZWwuYW5ub3RhdGlvbiA9IGlucHV0LnZhbHVlO1xuICAgICAgc2VsZi5wYXJlbnQucmVuZGVyRXZlbnRMaXN0aW5nc1ZpZXcoKTtcbiAgICAgIG1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgfSk7XG4gIH0sXG4gIHJlbW92ZUV2ZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlRXZlbnQodGhpcy5tb2RlbCk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXROYW1lOiB7XG4gICAgICBob29rOiAnZXZlbnQtbmFtZS1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLm5hbWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ25hbWUnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwubmFtZSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgVmlld1N3aXRjaGVyID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXctc3dpdGNoZXInKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoXCIuLi90b29sdGlwc1wiKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBFdmVudExpc3RpbmdzID0gcmVxdWlyZSgnLi9ldmVudC1saXN0aW5ncycpO1xudmFyIEV2ZW50RGV0YWlscyA9IHJlcXVpcmUoJy4vZXZlbnQtZGV0YWlscycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudHNFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWFkZC1ldmVudF0nIDogJ2FkZEV2ZW50JyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMuZXZlbnRzRWRpdG9yXG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKFwic2VsZWN0XCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdGhpcy5zZXRTZWxlY3RlZEV2ZW50KGV2ZW50KTtcbiAgICAgIHRoaXMuc2V0RGV0YWlsc1ZpZXcoZXZlbnQpO1xuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5vbihcInJlbW92ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIC8vIFNlbGVjdCB0aGUgbGFzdCBldmVudCBieSBkZWZhdWx0XG4gICAgICAvLyBCdXQgb25seSBpZiB0aGVyZSBhcmUgb3RoZXIgZXZlbnRzIG90aGVyIHRoYW4gdGhlIG9uZSB3ZSdyZSByZW1vdmluZ1xuICAgICAgaWYgKGV2ZW50LmRldGFpbHNWaWV3KVxuICAgICAgICBldmVudC5kZXRhaWxzVmlldy5yZW1vdmUoKTtcbiAgICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmVFdmVudChldmVudCk7XG4gICAgICBpZiAodGhpcy5jb2xsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLmNvbGxlY3Rpb24uYXQodGhpcy5jb2xsZWN0aW9uLmxlbmd0aC0xKTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJzZWxlY3RcIiwgc2VsZWN0ZWQpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcy5vbignYWRkIHJlbW92ZScsIHRoaXMudG9nZ2xlQWRkRXZlbnRCdXR0b24sIHRoaXMpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5vbignYWRkIHJlbW92ZScsIHRoaXMudG9nZ2xlQWRkRXZlbnRCdXR0b24sIHRoaXMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckV2ZW50TGlzdGluZ3NWaWV3KCk7XG4gICAgdGhpcy5kZXRhaWxzQ29udGFpbmVyID0gdGhpcy5xdWVyeUJ5SG9vaygnZXZlbnQtZGV0YWlscy1jb250YWluZXInKTtcbiAgICB0aGlzLmRldGFpbHNWaWV3U3dpdGNoZXIgPSBuZXcgVmlld1N3aXRjaGVyKHtcbiAgICAgIGVsOiB0aGlzLmRldGFpbHNDb250YWluZXIsXG4gICAgfSk7XG4gICAgaWYgKHRoaXMuY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWRFdmVudCh0aGlzLmNvbGxlY3Rpb24uYXQoMCkpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3RlZEV2ZW50KTtcbiAgICB9XG4gICAgdGhpcy50b2dnbGVBZGRFdmVudEJ1dHRvbigpXG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXJFdmVudExpc3RpbmdzVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuZXZlbnRMaXN0aW5nc1ZpZXcpe1xuICAgICAgdGhpcy5ldmVudExpc3RpbmdzVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5ldmVudExpc3RpbmdzVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgIEV2ZW50TGlzdGluZ3MsXG4gICAgICB0aGlzLnF1ZXJ5QnlIb29rKCdldmVudC1saXN0aW5nLWNvbnRhaW5lcicpXG4gICAgKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHRvZ2dsZUFkZEV2ZW50QnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLm1hcChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmKGV2ZW50LmRldGFpbHNWaWV3ICYmIGV2ZW50LnNlbGVjdGVkKXtcbiAgICAgICAgZXZlbnQuZGV0YWlsc1ZpZXcucmVuZGVyRXZlbnRBc3NpZ25tZW50cygpO1xuICAgICAgfVxuICAgIH0pXG4gICAgdmFyIG51bVNwZWNpZXMgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXMubGVuZ3RoO1xuICAgIHZhciBudW1QYXJhbWV0ZXJzID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLmxlbmd0aDtcbiAgICB2YXIgZGlzYWJsZWQgPSBudW1TcGVjaWVzIDw9IDAgJiYgbnVtUGFyYW1ldGVycyA8PSAwXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtZXZlbnQnKSkucHJvcCgnZGlzYWJsZWQnLCBkaXNhYmxlZCk7XG4gIH0sXG4gIHNldFNlbGVjdGVkRXZlbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChtKSB7IG0uc2VsZWN0ZWQgPSBmYWxzZTsgfSk7XG4gICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuc2VsZWN0ZWRFdmVudCA9IGV2ZW50O1xuICB9LFxuICBzZXREZXRhaWxzVmlldzogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQuZGV0YWlsc1ZpZXcgPSBldmVudC5kZXRhaWxzVmlldyB8fCB0aGlzLm5ld0RldGFpbHNWaWV3KGV2ZW50KTtcbiAgICB0aGlzLmRldGFpbHNWaWV3U3dpdGNoZXIuc2V0KGV2ZW50LmRldGFpbHNWaWV3KTtcbiAgfSxcbiAgYWRkRXZlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnQgPSB0aGlzLmNvbGxlY3Rpb24uYWRkRXZlbnQoKTtcbiAgICBldmVudC5kZXRhaWxzVmlldyA9IHRoaXMubmV3RGV0YWlsc1ZpZXcoZXZlbnQpO1xuICAgIHRoaXMuY29sbGVjdGlvbi50cmlnZ2VyKFwic2VsZWN0XCIsIGV2ZW50KTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgbmV3RGV0YWlsc1ZpZXc6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBkZXRhaWxzVmlldyA9IG5ldyBFdmVudERldGFpbHMoeyBtb2RlbDogZXZlbnQgfSk7XG4gICAgZGV0YWlsc1ZpZXcucGFyZW50ID0gdGhpcztcbiAgICByZXR1cm4gZGV0YWlsc1ZpZXdcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pIiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBFZGl0SW5pdGlhbENvbmRpdGlvbiA9IHJlcXVpcmUoJy4vZWRpdC1pbml0aWFsLWNvbmRpdGlvbicpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9pbml0aWFsQ29uZGl0aW9uc0VkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9c2NhdHRlcl0nIDogJ2FkZEluaXRpYWxDb25kaXRpb24nLFxuICAgICdjbGljayBbZGF0YS1ob29rPXBsYWNlXScgOiAnYWRkSW5pdGlhbENvbmRpdGlvbicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZGlzdHJpYnV0ZS11bmlmb3JtbHldJyA6ICdhZGRJbml0aWFsQ29uZGl0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICBFZGl0SW5pdGlhbENvbmRpdGlvbixcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ2luaXRpYWwtY29uZGl0aW9ucy1jb2xsZWN0aW9uJylcbiAgICApO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgYWRkSW5pdGlhbENvbmRpdGlvbjogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgaW5pdGlhbENvbmRpdGlvblR5cGUgPSBlLnRhcmdldC50ZXh0Q29udGVudDtcbiAgICB0aGlzLmNvbGxlY3Rpb24uYWRkSW5pdGlhbENvbmRpdGlvbihpbml0aWFsQ29uZGl0aW9uVHlwZSk7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKTtcbiAgfSxcbn0pOyIsInZhciBhcHAgPSByZXF1aXJlKCdhbXBlcnNhbmQtYXBwJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvbWVzaEVkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPW51bS1zdWJkb21haW5zLWNvbnRhaW5lcl0nIDogJ3VwZGF0ZVN1YmRvbWFpbnMnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0J1xuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVN1YmRvbWFpbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLnBhcmVudC50cmlnZ2VyKCdtZXNoLXVwZGF0ZScpO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpXG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXRTdWJkb21haW5zOiB7XG4gICAgICBob29rOiAnbnVtLXN1YmRvbWFpbnMtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnbnVtU3ViZG9tYWlucycsXG4gICAgICAgICAgbGFiZWw6ICdOdW1iZXIgb2YgU3ViZG9tYWlucycsXG4gICAgICAgICAgdGVzdDogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ2NvdW50JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmNvdW50LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoJy4uL3Rvb2x0aXBzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFNldHRpbmdzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMubW9kZWxTZXR0aW5nc1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJylcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFNpbUVuZDoge1xuICAgICAgaG9vazogJ3ByZXZpZXctdGltZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2VuZC1zaW0nLFxuICAgICAgICAgIGxhYmVsOiAnMCB0byAnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnZW5kU2ltJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmVuZFNpbVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFRpbWVVbml0OiB7XG4gICAgICBob29rOiAndGltZS11bml0cycsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3ICh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICd0aW1lLXVuaXRzJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICd0aW1lU3RlcCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC50aW1lU3RlcFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFZvbHVtZToge1xuICAgICAgaG9vazogJ3ZvbHVtZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3ICh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICd2b2x1bWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3ZvbHVtZScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC52b2x1bWUsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyIGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xudmFyIHhociA9IHJlcXVpcmUoJ3hocicpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgUGxvdGx5ID0gcmVxdWlyZSgnLi4vbGliL3Bsb3RseScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvbW9kZWxTdGF0ZUJ1dHRvbnMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXNhdmVdJyA6ICdjbGlja1NhdmVIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1ydW5dJyAgOiAnY2xpY2tSdW5IYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1zdGFydC13b3JrZmxvd10nIDogJ2NsaWNrU3RhcnRXb3JrZmxvd0hhbmRsZXInLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5tb2RlbC5zcGVjaWVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVQcmV2aWV3V29ya2Zsb3dCdG4sIHRoaXMpO1xuICAgIHRoaXMubW9kZWwucmVhY3Rpb25zLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVQcmV2aWV3V29ya2Zsb3dCdG4sIHRoaXMpO1xuICAgIHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvbi5vbignYWRkIHJlbW92ZScsIHRoaXMudG9nZ2xlUHJldmlld1dvcmtmbG93QnRuLCB0aGlzKTtcbiAgICB0aGlzLm1vZGVsLnJ1bGVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVQcmV2aWV3V29ya2Zsb3dCdG4sIHRoaXMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvZ2dsZVByZXZpZXdXb3JrZmxvd0J0bigpO1xuICB9LFxuICBjbGlja1NhdmVIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc2F2ZU1vZGVsKHRoaXMuc2F2ZWQuYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNsaWNrUnVuSGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAkKHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tZXJyb3ItY29udGFpbmVyJykpLmNvbGxhcHNlKCdoaWRlJyk7XG4gICAgdmFyIGVsID0gdGhpcy5wYXJlbnQucXVlcnlCeUhvb2soJ21vZGVsLXJ1bi1jb250YWluZXInKTtcbiAgICBQbG90bHkucHVyZ2UoZWwpXG4gICAgdGhpcy5zYXZlTW9kZWwodGhpcy5ydW5Nb2RlbC5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY2xpY2tTdGFydFdvcmtmbG93SGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGguam9pbihhcHAuZ2V0QmFzZVBhdGgoKSwgXCJzdG9jaHNzL3dvcmtmbG93L3NlbGVjdGlvblwiLCB0aGlzLm1vZGVsLmRpcmVjdG9yeSk7XG4gIH0sXG4gIHRvZ2dsZVByZXZpZXdXb3JrZmxvd0J0bjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBudW1TcGVjaWVzID0gdGhpcy5tb2RlbC5zcGVjaWVzLmxlbmd0aDtcbiAgICB2YXIgbnVtUmVhY3Rpb25zID0gdGhpcy5tb2RlbC5yZWFjdGlvbnMubGVuZ3RoXG4gICAgdmFyIG51bUV2ZW50cyA9IHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvbi5sZW5ndGhcbiAgICB2YXIgbnVtUnVsZXMgPSB0aGlzLm1vZGVsLnJ1bGVzLmxlbmd0aFxuICAgICQodGhpcy5xdWVyeUJ5SG9vaygncnVuJykpLnByb3AoJ2Rpc2FibGVkJywgKCFudW1TcGVjaWVzIHx8ICghbnVtUmVhY3Rpb25zICYmICFudW1FdmVudHMgJiYgIW51bVJ1bGVzKSkpXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzdGFydC13b3JrZmxvdycpKS5wcm9wKCdkaXNhYmxlZCcsICghbnVtU3BlY2llcyB8fCAoIW51bVJlYWN0aW9ucyAmJiAhbnVtRXZlbnRzICYmICFudW1SdWxlcykpKVxuICB9LFxuICBzYXZlTW9kZWw6IGZ1bmN0aW9uIChjYikge1xuICAgIHZhciBudW1FdmVudHMgPSB0aGlzLm1vZGVsLmV2ZW50c0NvbGxlY3Rpb24ubGVuZ3RoO1xuICAgIHZhciBudW1SdWxlcyA9IHRoaXMubW9kZWwucnVsZXMubGVuZ3RoO1xuICAgIHZhciBkZWZhdWx0TW9kZSA9IHRoaXMubW9kZWwuZGVmYXVsdE1vZGU7XG4gICAgaWYoIW51bUV2ZW50cyAmJiAhbnVtUnVsZXMgJiYgZGVmYXVsdE1vZGUgPT09IFwiY29udGludW91c1wiKXtcbiAgICAgIHRoaXMubW9kZWwubW9kZWxTZXR0aW5ncy5hbGdvcml0aG0gPSBcIk9ERVwiO1xuICAgIH1lbHNlIGlmKCFudW1FdmVudHMgJiYgIW51bVJ1bGVzICYmIGRlZmF1bHRNb2RlID09PSBcImRpc2NyZXRlXCIpe1xuICAgICAgdGhpcy5tb2RlbC5tb2RlbFNldHRpbmdzLmFsZ29yaXRobSA9IFwiU1NBXCI7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLm1vZGVsLm1vZGVsU2V0dGluZ3MuYWxnb3JpdGhtID0gXCJIeWJyaWQtVGF1LUxlYXBpbmdcIjtcbiAgICB9XG4gICAgdGhpcy5zYXZpbmcoKTtcbiAgICAvLyB0aGlzLm1vZGVsIGlzIGEgTW9kZWxWZXJzaW9uLCB0aGUgcGFyZW50IG9mIHRoZSBjb2xsZWN0aW9uIGlzIE1vZGVsXG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbDtcbiAgICBpZiAoY2IpIHtcbiAgICAgIG1vZGVsLnNhdmUobW9kZWwuYXR0cmlidXRlcywge1xuICAgICAgICBzdWNjZXNzOiBjYixcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc2F2aW5nIG1vZGVsOlwiLCBtb2RlbCk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlc3BvbnNlOlwiLCByZXNwb25zZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kZWwuc2F2ZU1vZGVsKCk7XG4gICAgfVxuICB9LFxuICBzYXZpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2F2aW5nID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2aW5nLW1kbCcpO1xuICAgIHZhciBzYXZlZCA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmVkLW1kbCcpO1xuICAgIHNhdmVkLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBzYXZpbmcuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG4gIH0sXG4gIHNhdmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNhdmluZyA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmluZy1tZGwnKTtcbiAgICB2YXIgc2F2ZWQgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzYXZlZC1tZGwnKTtcbiAgICBzYXZpbmcuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNhdmVkLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuICB9LFxuICBydW5Nb2RlbDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2F2ZWQoKTtcbiAgICB0aGlzLnJ1bm5pbmcoKTtcbiAgICB2YXIgZWwgPSB0aGlzLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtcnVuLWNvbnRhaW5lcicpXG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbFxuICAgIHZhciBlbmRwb2ludCA9IHBhdGguam9pbihhcHAuZ2V0QXBpUGF0aCgpLCAnL21vZGVscy9ydW4vJywgJ3N0YXJ0JywgJ25vbmUnLCBtb2RlbC5kaXJlY3RvcnkpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB4aHIoeyB1cmk6IGVuZHBvaW50IH0sIGZ1bmN0aW9uIChlcnIsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICBzZWxmLm91dGZpbGUgPSBib2R5LnNwbGl0KCctPicpLnBvcCgpXG4gICAgICBzZWxmLmdldFJlc3VsdHMoYm9keSlcbiAgICB9KTtcbiAgfSxcbiAgcnVubmluZzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwbG90ID0gdGhpcy5wYXJlbnQucXVlcnlCeUhvb2soJ21vZGVsLXJ1bi1jb250YWluZXInKTtcbiAgICB2YXIgc3Bpbm5lciA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdwbG90LWxvYWRlcicpO1xuICAgIHZhciBlcnJvcnMgPSB0aGlzLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtcnVuLWVycm9yLWNvbnRhaW5lcicpO1xuICAgIHBsb3Quc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNwaW5uZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBlcnJvcnMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9LFxuICByYW46IGZ1bmN0aW9uIChub0Vycm9ycykge1xuICAgIHZhciBwbG90ID0gdGhpcy5wYXJlbnQucXVlcnlCeUhvb2soJ21vZGVsLXJ1bi1jb250YWluZXInKTtcbiAgICB2YXIgc3Bpbm5lciA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdwbG90LWxvYWRlcicpO1xuICAgIHZhciBlcnJvcnMgPSB0aGlzLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtcnVuLWVycm9yLWNvbnRhaW5lcicpO1xuICAgIGlmKG5vRXJyb3JzKXtcbiAgICAgIHBsb3Quc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9ZWxzZXtcbiAgICAgIGVycm9ycy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgfVxuICAgIHNwaW5uZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9LFxuICBnZXRSZXN1bHRzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZW5kcG9pbnQgPSBwYXRoLmpvaW4oYXBwLmdldEFwaVBhdGgoKSwgJy9tb2RlbHMvcnVuLycsICdyZWFkJywgc2VsZi5vdXRmaWxlLCBtb2RlbC5kaXJlY3RvcnkpO1xuICAgICAgeGhyKHsgdXJpOiBlbmRwb2ludCB9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICBpZighYm9keS5zdGFydHNXaXRoKCdydW5uaW5nJykpe1xuICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICBpZihkYXRhLnRpbWVvdXQpe1xuICAgICAgICAgICAgJChzZWxmLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtdGltZW91dC1tZXNzYWdlJykpLmNvbGxhcHNlKCdzaG93Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGRhdGEucmVzdWx0cyl7XG4gICAgICAgICAgICBzZWxmLnBsb3RSZXN1bHRzKGRhdGEucmVzdWx0cyk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBzZWxmLnJhbihmYWxzZSk7XG4gICAgICAgICAgICAkKHNlbGYucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tZXJyb3ItbWVzc2FnZScpKS50ZXh0KGRhdGEuZXJyb3JzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIHNlbGYuZ2V0UmVzdWx0cyhib2R5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwgMjAwMCk7XG4gIH0sXG4gIHBsb3RSZXN1bHRzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vIFRPRE8gYWJzdHJhY3QgdGhpcyBpbnRvIGFuIGV2ZW50IHByb2JhYmx5XG4gICAgdmFyIHRpdGxlID0gdGhpcy5tb2RlbC5uYW1lICsgXCIgTW9kZWwgUHJldmlld1wiXG4gICAgdGhpcy5yYW4odHJ1ZSlcbiAgICBlbCA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tY29udGFpbmVyJyk7XG4gICAgdGltZSA9IGRhdGEudGltZVxuICAgIHlfbGFiZWxzID0gT2JqZWN0LmtleXMoZGF0YSkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBrZXkgIT09ICdkYXRhJyAmJiBrZXkgIT09ICd0aW1lJ1xuICAgIH0pO1xuICAgIHRyYWNlcyA9IHlfbGFiZWxzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiB0aW1lLFxuICAgICAgICB5OiBkYXRhW3NwZWNpZV0sXG4gICAgICAgIG1vZGU6ICdsaW5lcycsXG4gICAgICAgIG5hbWU6IHNwZWNpZVxuICAgICAgfVxuICAgIH0pO1xuICAgIGxheW91dCA9IHsgXG4gICAgICBzaG93bGVnZW5kOiB0cnVlLFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIHg6IDEsXG4gICAgICAgIHk6IDAuOVxuICAgICAgfSxcbiAgICAgIG1hcmdpbjogeyBcbiAgICAgICAgdDogMCBcbiAgICAgIH0gXG4gICAgfVxuICAgIGNvbmZpZyA9IHtcbiAgICAgIHJlc3BvbnNpdmU6IHRydWUsXG4gICAgfVxuICAgIFBsb3RseS5uZXdQbG90KGVsLCB0cmFjZXMsIGxheW91dCwgY29uZmlnKTtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQpXG4gIH0sXG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoJy4uL3Rvb2x0aXBzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgRWRpdFBhcmFtZXRlclZpZXcgPSByZXF1aXJlKCcuL2VkaXQtcGFyYW1ldGVyJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWFkZC1wYXJhbWV0ZXJdJyA6ICdhZGRQYXJhbWV0ZXInLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMucGFyYW1ldGVyc0VkaXRvclxuICAgIHRoaXMuY29sbGVjdGlvbi5vbigndXBkYXRlLXBhcmFtZXRlcnMnLCBmdW5jdGlvbiAoY29tcElELCBwYXJhbWV0ZXIpIHtcbiAgICAgIHNlbGYuY29sbGVjdGlvbi5wYXJlbnQucmVhY3Rpb25zLm1hcChmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICAgICAgaWYocmVhY3Rpb24ucmF0ZSAmJiByZWFjdGlvbi5yYXRlLmNvbXBJRCA9PT0gY29tcElEKXtcbiAgICAgICAgICByZWFjdGlvbi5yYXRlID0gcGFyYW1ldGVyO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGYuY29sbGVjdGlvbi5wYXJlbnQuZXZlbnRzQ29sbGVjdGlvbi5tYXAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LmV2ZW50QXNzaWdubWVudHMubWFwKGZ1bmN0aW9uIChhc3NpZ25tZW50KSB7XG4gICAgICAgICAgaWYoYXNzaWdubWVudC52YXJpYWJsZS5jb21wSUQgPT09IGNvbXBJRCkge1xuICAgICAgICAgICAgYXNzaWdubWVudC52YXJpYWJsZSA9IHBhcmFtZXRlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKGV2ZW50LnNlbGVjdGVkKVxuICAgICAgICAgIGV2ZW50LmRldGFpbHNWaWV3LnJlbmRlckV2ZW50QXNzaWdubWVudHMoKTtcbiAgICAgIH0pO1xuICAgICAgc2VsZi5jb2xsZWN0aW9uLnBhcmVudC5ydWxlcy5tYXAoZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgaWYocnVsZS52YXJpYWJsZS5jb21wSUQgPT09IGNvbXBJRCkge1xuICAgICAgICAgIHJ1bGUudmFyaWFibGUgPSBwYXJhbWV0ZXI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5wYXJlbnQucmVuZGVyUnVsZXNWaWV3KCk7XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyRWRpdFBhcmFtZXRlcigpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVuZGVyRWRpdFBhcmFtZXRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuZWRpdFBhcmFtZXRlclZpZXcpe1xuICAgICAgdGhpcy5lZGl0UGFyYW1ldGVyVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5lZGl0UGFyYW1ldGVyVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgIEVkaXRQYXJhbWV0ZXJWaWV3LFxuICAgICAgdGhpcy5xdWVyeUJ5SG9vaygncGFyYW1ldGVyLWxpc3QnKVxuICAgICk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBhZGRQYXJhbWV0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24uYWRkUGFyYW1ldGVyKCk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuXG4gICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy9tb2RlbHNcbnZhciBTdG9pY2hTcGVjaWUgPSByZXF1aXJlKCcuLi9tb2RlbHMvc3RvaWNoLXNwZWNpZScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbnZhciBFZGl0U3RvaWNoU3BlY2llVmlldyA9IHJlcXVpcmUoJy4vZWRpdC1zdG9pY2gtc3BlY2llJyk7XG52YXIgRWRpdEN1c3RvbVN0b2ljaFNwZWNpZVZpZXcgPSByZXF1aXJlKCcuL2VkaXQtY3VzdG9tLXN0b2ljaC1zcGVjaWUnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3RhbnRQcm9kdWN0LnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LXNwZWNpZV0nIDogJ3NlbGVjdFNwZWNpZScsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9YWRkLXNlbGVjdGVkLXNwZWNpZV0nIDogJ2FkZFNlbGVjdGVkU3BlY2llJ1xuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXJncykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBhcmdzLmNvbGxlY3Rpb247XG4gICAgdGhpcy5zcGVjaWVzID0gYXJncy5zcGVjaWVzO1xuICAgIHRoaXMucmVhY3Rpb25UeXBlID0gYXJncy5yZWFjdGlvblR5cGU7XG4gICAgdGhpcy5pc1JlYWN0YW50cyA9IGFyZ3MuaXNSZWFjdGFudHNcbiAgICB0aGlzLnVuc2VsZWN0ZWRUZXh0ID0gJ1BpY2sgYSBzcGVjaWVzJztcbiAgICB0aGlzLmZpZWxkVGl0bGUgPSBhcmdzLmZpZWxkVGl0bGU7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgYXJncyA9IHtcbiAgICAgIHZpZXdPcHRpb25zOiB7XG4gICAgICAgIG5hbWU6ICdzdG9pY2gtc3BlY2llJyxcbiAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdGV4dEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgICBlYWdlclZhbGlkYXRlOiB0cnVlLFxuICAgICAgICAvLyBTZXQgaWRBdHRyaWJ1dGUgdG8gbmFtZS4gTW9kZWxzIG1heSBub3QgYmUgc2F2ZWQgeWV0IHNvIGlkIGlzIHVucmVsaWFibGUgKHNvIGlzIGNpZCkuXG4gICAgICAgIC8vIFVzZSBuYW1lIHNpbmNlIGl0ICpzaG91bGQgYmUqIHVuaXF1ZS5cbiAgICAgICAgaWRBdHRyaWJ1dGU6ICduYW1lJyxcbiAgICAgICAgb3B0aW9uczogc2VsZi5zcGVjaWVzXG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgdHlwZSA9IHNlbGYucmVhY3Rpb25UeXBlO1xuICAgIHZhciBTdG9pY2hTcGVjaWVzVmlldyA9ICh0eXBlLnN0YXJ0c1dpdGgoJ2N1c3RvbScpKSA/IEVkaXRDdXN0b21TdG9pY2hTcGVjaWVWaWV3IDogRWRpdFN0b2ljaFNwZWNpZVZpZXdcbiAgICBzZWxmLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICAgIHNlbGYuY29sbGVjdGlvbixcbiAgICAgICAgU3RvaWNoU3BlY2llc1ZpZXcsXG4gICAgICAgIHNlbGYucXVlcnlCeUhvb2soJ3JlYWN0YW50cy1lZGl0b3InKSxcbiAgICAgICAgYXJnc1xuICAgICk7XG4gICAgaWYodGhpcy5yZWFjdGlvblR5cGUuc3RhcnRzV2l0aCgnY3VzdG9tJykpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkuY29sbGFwc2UoKVxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUFkZFNwZWNpZUJ1dHRvbigpO1xuICAgIGlmKHRoaXMuZmllbGRUaXRsZSA9PT0gXCJSZWFjdGFudHNcIil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2ZpZWxkLXRpdGxlLXRvb2x0aXAnKSkucHJvcCgndGl0bGUnLCB0aGlzLnBhcmVudC5wYXJlbnQudG9vbHRpcHMucmVhY3RhbnQpXG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2ZpZWxkLXRpdGxlLXRvb2x0aXAnKSkucHJvcCgndGl0bGUnLCB0aGlzLnBhcmVudC5wYXJlbnQudG9vbHRpcHMucHJvZHVjdClcbiAgICB9XG4gIH0sXG4gIHNlbGVjdFNwZWNpZTogZnVuY3Rpb24gKGUpIHtcbiAgICBpZih0aGlzLnVuc2VsZWN0ZWRUZXh0ID09PSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0KXtcbiAgICAgIHRoaXMuaGFzU2VsZWN0ZWRTcGVjaWUgPSBmYWxzZTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuaGFzU2VsZWN0ZWRTcGVjaWUgPSB0cnVlO1xuICAgICAgdGhpcy5zcGVjaWVOYW1lID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB9XG4gICAgdGhpcy50b2dnbGVBZGRTcGVjaWVCdXR0b24oKTtcbiAgfSxcbiAgYWRkU2VsZWN0ZWRTcGVjaWU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3BlY2llTmFtZSA9IHRoaXMuc3BlY2llTmFtZSA/IHRoaXMuc3BlY2llTmFtZSA6ICdQaWNrIGEgc3BlY2llcyc7XG4gICAgaWYodGhpcy52YWxpZGF0ZUFkZFNwZWNpZSgpKSB7XG4gICAgICB0aGlzLmNvbGxlY3Rpb24uYWRkU3RvaWNoU3BlY2llKHNwZWNpZU5hbWUpO1xuICAgICAgdGhpcy50b2dnbGVBZGRTcGVjaWVCdXR0b24oKTtcbiAgICAgIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgICB9XG4gIH0sXG4gIHRvZ2dsZUFkZFNwZWNpZUJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmKCF0aGlzLnZhbGlkYXRlQWRkU3BlY2llKCkpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1zZWxlY3RlZC1zcGVjaWUnKSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICBlbHNlXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1zZWxlY3RlZC1zcGVjaWUnKSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gIH0sXG4gIHZhbGlkYXRlQWRkU3BlY2llOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5oYXNTZWxlY3RlZFNwZWNpZSl7XG4gICAgICBpZighdGhpcy5jb2xsZWN0aW9uLmxlbmd0aCkgIHJldHVybiB0cnVlO1xuICAgICAgaWYodGhpcy5jb2xsZWN0aW9uLmxlbmd0aCA8IDIgJiYgdGhpcy5jb2xsZWN0aW9uLmF0KDApLnJhdGlvIDwgMilcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBpZih0aGlzLnJlYWN0aW9uVHlwZSAhPT0gJ2N1c3RvbS1tYXNzYWN0aW9uJylcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBpZighdGhpcy5pc1JlYWN0YW50cylcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBzZWxlY3RTcGVjaWVzOiB7XG4gICAgICBob29rOiAnc2VsZWN0LXNwZWNpZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICAgICAgbmFtZTogJ3N0b2ljaC1zcGVjaWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgdGV4dEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgICAgIGVhZ2VyVmFsaWRhdGU6IGZhbHNlLFxuICAgICAgICAgIC8vIFNldCBpZEF0dHJpYnV0ZSB0byBuYW1lLiBNb2RlbHMgbWF5IG5vdCBiZSBzYXZlZCB5ZXQgc28gaWQgaXMgdW5yZWxpYWJsZSAoc28gaXMgY2lkKS5cbiAgICAgICAgICAvLyBVc2UgbmFtZSBzaW5jZSBpdCAqc2hvdWxkIGJlKiB1bmlxdWUuXG4gICAgICAgICAgaWRBdHRyaWJ1dGU6ICduYW1lJyxcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLnNwZWNpZXMsXG4gICAgICAgICAgdW5zZWxlY3RlZFRleHQ6IHRoaXMudW5zZWxlY3RlZFRleHQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBrYXRleCA9IHJlcXVpcmUoJ2thdGV4Jyk7XG4vL2NvbmZpZ1xudmFyIFJlYWN0aW9uVHlwZXMgPSByZXF1aXJlKCcuLi9yZWFjdGlvbi10eXBlcycpO1xuLy9tb2RlbHNcbnZhciBTdG9pY2hTcGVjaWUgPSByZXF1aXJlKCcuLi9tb2RlbHMvc3RvaWNoLXNwZWNpZScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgUmVhY3Rpb25TdWJkb21haW5zVmlldyA9IHJlcXVpcmUoJy4vcmVhY3Rpb24tc3ViZG9tYWlucycpO1xudmFyIFJlYWN0YW50UHJvZHVjdFZpZXcgPSByZXF1aXJlKCcuL3JlYWN0YW50LXByb2R1Y3QnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25EZXRhaWxzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5wcm9wZW5zaXR5Jzoge1xuICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgIGhvb2s6ICdzZWxlY3QtcmF0ZS1wYXJhbWV0ZXInXG4gICAgfSxcbiAgICAnbW9kZWwuc3VtbWFyeScgOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlLCBwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgIGthdGV4LnJlbmRlcih0aGlzLm1vZGVsLnN1bW1hcnksIHRoaXMucXVlcnlCeUhvb2soJ3N1bW1hcnktY29udGFpbmVyJyksIHtcbiAgICAgICAgICBkaXNwbGF5TW9kZTogdHJ1ZSxcbiAgICAgICAgICBvdXRwdXQ6ICdodG1sJ1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBob29rOiAnc3VtbWFyeS1jb250YWluZXInLFxuICAgIH0sXG4gICAgJ21vZGVsLmhhc0NvbmZsaWN0Jzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICB0aGlzLm1vZGVsLmhhc0NvbmZsaWN0ID8gXG4gICAgICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb25mbGljdGluZy1tb2Rlcy1tZXNzYWdlJykpLmNvbGxhcHNlKCdzaG93JykgOiBcbiAgICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbmZsaWN0aW5nLW1vZGVzLW1lc3NhZ2UnKSkuY29sbGFwc2UoJ2hpZGUnKVxuICAgICAgfSxcbiAgICAgIGhvb2s6ICdjb25mbGljdGluZy1tb2Rlcy1tZXNzYWdlJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LXJhdGUtcGFyYW1ldGVyXScgOiAnc2VsZWN0UmF0ZVBhcmFtJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LXJlYWN0aW9uLXR5cGVdJyAgOiAnc2VsZWN0UmVhY3Rpb25UeXBlJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBzZWxmID0gdGhpczsgXG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpyZWFjdGlvbl90eXBlXCIsIGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgc2VsZi51cGRhdGVTdG9pY2hTcGVjaWVzRm9yUmVhY3Rpb25UeXBlKG1vZGVsLnJlYWN0aW9uVHlwZSk7XG4gICAgfSk7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy51cGRhdGVSZWFjdGlvblR5cGVPcHRpb25zLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIG9wdGlvbnMgPSBbXTtcbiAgICBpZih0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnMubGVuZ3RoIDw9IDApe1xuICAgICAgb3B0aW9ucyA9IFtcIkN1c3RvbSBwcm9wZW5zaXR5XCJdO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0UmVhY3Rpb25UeXBlTGFiZWxzKCk7XG4gICAgfVxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmVhY3Rpb25UeXBlU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnUmVhY3Rpb24gVHlwZTonLFxuICAgICAgbmFtZTogJ3JlYWN0aW9uLXR5cGUnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgdmFsdWU6IFJlYWN0aW9uVHlwZXNbc2VsZi5tb2RlbC5yZWFjdGlvblR5cGVdLmxhYmVsLFxuICAgIH0pO1xuICAgIHZhciByYXRlUGFyYW1ldGVyVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdyYXRlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgdGV4dEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgZWFnZXJWYWxpZGF0ZTogdHJ1ZSxcbiAgICAgIG9wdGlvbnM6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycyxcbiAgICAgIC8vIEZvciBuZXcgcmVhY3Rpb25zICh3aXRoIG5vIHJhdGUubmFtZSkganVzdCB1c2UgdGhlIGZpcnN0IHBhcmFtZXRlciBpbiB0aGUgUGFyYW1ldGVycyBjb2xsZWN0aW9uXG4gICAgICAvLyBFbHNlIGZldGNoIHRoZSByaWdodCBQYXJhbWV0ZXIgZnJvbSBQYXJhbWV0ZXJzIGJhc2VkIG9uIGV4aXN0aW5nIHJhdGVcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnJhdGUubmFtZSA/IHRoaXMuZ2V0UmF0ZUZyb21QYXJhbWV0ZXJzKHRoaXMubW9kZWwucmF0ZS5uYW1lKSA6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5hdCgwKSxcbiAgICB9KTtcbiAgICB2YXIgcHJvcGVuc2l0eVZpZXcgPSBuZXcgSW5wdXRWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgbmFtZTogJ3JhdGUnLFxuICAgICAgbGFiZWw6ICcnLFxuICAgICAgdGVzdHM6JycsXG4gICAgICBtb2RlbEtleToncHJvcGVuc2l0eScsXG4gICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwucHJvcGVuc2l0eVxuICAgIH0pO1xuICAgIHZhciBzdWJkb21haW5zVmlldyA9IG5ldyBSZWFjdGlvblN1YmRvbWFpbnNWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIGlzUmVhY3Rpb246IHRydWUsXG4gICAgfSlcbiAgICB2YXIgcmVhY3RhbnRzVmlldyA9IG5ldyBSZWFjdGFudFByb2R1Y3RWaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucmVhY3RhbnRzLFxuICAgICAgc3BlY2llczogdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLFxuICAgICAgcmVhY3Rpb25UeXBlOiB0aGlzLm1vZGVsLnJlYWN0aW9uVHlwZSxcbiAgICAgIGZpZWxkVGl0bGU6ICdSZWFjdGFudHMnLFxuICAgICAgaXNSZWFjdGFudHM6IHRydWVcbiAgICB9KTtcbiAgICB2YXIgcHJvZHVjdHNWaWV3ID0gbmV3IFJlYWN0YW50UHJvZHVjdFZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5wcm9kdWN0cyxcbiAgICAgIHNwZWNpZXM6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcyxcbiAgICAgIHJlYWN0aW9uVHlwZTogdGhpcy5tb2RlbC5yZWFjdGlvblR5cGUsXG4gICAgICBmaWVsZFRpdGxlOiAnUHJvZHVjdHMnLFxuICAgICAgaXNSZWFjdGFudHM6IGZhbHNlXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocmVhY3Rpb25UeXBlU2VsZWN0VmlldywgJ3NlbGVjdC1yZWFjdGlvbi10eXBlJyk7XG4gICAgdGhpcy5yZW5kZXJSZWFjdGlvblR5cGVzKCk7XG4gICAgaWYodGhpcy5tb2RlbC5yZWFjdGlvblR5cGUgPT09ICdjdXN0b20tcHJvcGVuc2l0eScpe1xuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocHJvcGVuc2l0eVZpZXcsICdzZWxlY3QtcmF0ZS1wYXJhbWV0ZXInKVxuICAgICAgdmFyIGlucHV0RmllbGQgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtcmF0ZS1wYXJhbWV0ZXInKS5jaGlsZHJlblswXS5jaGlsZHJlblsxXTtcbiAgICAgICQoaW5wdXRGaWVsZCkuYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiLS0tTm8gRXhwcmVzc2lvbiBFbnRlcmVkLS0tXCIpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdyYXRlLXBhcmFtZXRlci1sYWJlbCcpKS50ZXh0KCdQcm9wZW5zaXR5OicpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3JhdGUtcGFyYW1ldGVyLXRvb2x0aXAnKSkucHJvcCgndGl0bGUnLCB0aGlzLnBhcmVudC50b29sdGlwcy5wcm9wZW5zaXR5KTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJhdGVQYXJhbWV0ZXJWaWV3LCAnc2VsZWN0LXJhdGUtcGFyYW1ldGVyJyk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3JhdGUtcGFyYW1ldGVyLWxhYmVsJykpLnRleHQoJ1JhdGUgUGFyYW1ldGVyOicpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3JhdGUtcGFyYW1ldGVyLXRvb2x0aXAnKSkucHJvcCgndGl0bGUnLCB0aGlzLnBhcmVudC50b29sdGlwcy5yYXRlKTtcbiAgICB9XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3ViZG9tYWluc1ZpZXcsICdzdWJkb21haW5zLWVkaXRvcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJlYWN0YW50c1ZpZXcsICdyZWFjdGFudHMtZWRpdG9yJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocHJvZHVjdHNWaWV3LCAncHJvZHVjdHMtZWRpdG9yJyk7XG4gICAgdGhpcy50b3RhbFJhdGlvID0gdGhpcy5nZXRUb3RhbFJlYWN0YW50UmF0aW8oKTtcbiAgICBpZih0aGlzLnBhcmVudC5jb2xsZWN0aW9uLnBhcmVudC5pc19zcGF0aWFsKVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzdWJkb21haW5zLWVkaXRvcicpKS5jb2xsYXBzZSgpO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcblxuICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlUmVhY3Rpb25UeXBlT3B0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH0sXG4gIHNlbGVjdFJhdGVQYXJhbTogZnVuY3Rpb24gKGUpIHtcbiAgICBpZih0aGlzLm1vZGVsLnJlYWN0aW9uVHlwZSAhPT0gJ2N1c3RvbS1wcm9wZW5zaXR5Jykge1xuICAgICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgICB2YXIgcGFyYW0gPSB0aGlzLmdldFJhdGVGcm9tUGFyYW1ldGVycyh2YWwpO1xuICAgICAgdGhpcy5tb2RlbC5yYXRlID0gcGFyYW0gfHwgdGhpcy5tb2RlbC5yYXRlO1xuICAgICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgfVxuICB9LFxuICBnZXRSYXRlRnJvbVBhcmFtZXRlcnM6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgLy8gU2VlbXMgbGlrZSBtb2RlbC5yYXRlIGlzIG5vdCBhY3R1YWxseSBwYXJ0IG9mIHRoZSBQYXJhbWV0ZXJzIGNvbGxlY3Rpb25cbiAgICAvLyBHZXQgdGhlIFBhcmFtZXRlciBmcm9tIFBhcmFtZXRlcnMgdGhhdCBtYXRjaGVzIG1vZGVsLnJhdGVcbiAgICAvLyBUT0RPIHRoaXMgaXMgc29tZSBnYXJiYWdpbywgZ2V0IG1vZGVsLnJhdGUgaW50byBQYXJhbWV0ZXJzIGNvbGxlY3Rpb24uLi4/XG4gICAgaWYgKCFuYW1lKSAgeyBuYW1lID0gdGhpcy5tb2RlbC5yYXRlLm5hbWUgfSBcbiAgICB2YXIgcmF0ZSA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5maWx0ZXIoZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICByZXR1cm4gcGFyYW0ubmFtZSA9PT0gbmFtZTtcbiAgICB9KVswXTtcbiAgICByZXR1cm4gcmF0ZSBcbiAgfSxcbiAgc2VsZWN0UmVhY3Rpb25UeXBlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBsYWJlbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnZhbHVlO1xuICAgIHZhciB0eXBlID0gXy5maW5kS2V5KFJlYWN0aW9uVHlwZXMsIGZ1bmN0aW9uIChvKSB7IHJldHVybiBvLmxhYmVsID09PSBsYWJlbDsgfSk7XG4gICAgdGhpcy5tb2RlbC5yZWFjdGlvblR5cGUgPSB0eXBlO1xuICAgIHRoaXMubW9kZWwuc3VtbWFyeSA9IGxhYmVsXG4gICAgdGhpcy51cGRhdGVTdG9pY2hTcGVjaWVzRm9yUmVhY3Rpb25UeXBlKHR5cGUpO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgIHRoaXMubW9kZWwudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9LFxuICB1cGRhdGVTdG9pY2hTcGVjaWVzRm9yUmVhY3Rpb25UeXBlOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciBhcmdzID0gdGhpcy5wYXJlbnQuZ2V0U3RvaWNoQXJnc0ZvclJlYWN0aW9uVHlwZSh0eXBlKTtcbiAgICB2YXIgbmV3UmVhY3RhbnRzID0gdGhpcy5nZXRBcnJheU9mRGVmYXVsdFN0b2ljaFNwZWNpZXMoYXJncy5yZWFjdGFudHMpO1xuICAgIHZhciBuZXdQcm9kdWN0cyA9IHRoaXMuZ2V0QXJyYXlPZkRlZmF1bHRTdG9pY2hTcGVjaWVzKGFyZ3MucHJvZHVjdHMpO1xuICAgIHRoaXMubW9kZWwucmVhY3RhbnRzLnJlc2V0KG5ld1JlYWN0YW50cyk7XG4gICAgdGhpcy5tb2RlbC5wcm9kdWN0cy5yZXNldChuZXdQcm9kdWN0cyk7XG4gICAgaWYodHlwZSAhPT0gJ2N1c3RvbS1wcm9wZW5zaXR5JylcbiAgICAgIHRoaXMubW9kZWwucmF0ZSA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5nZXREZWZhdWx0UmF0ZSgpO1xuICB9LFxuICBnZXRBcnJheU9mRGVmYXVsdFN0b2ljaFNwZWNpZXM6IGZ1bmN0aW9uIChhcnIpIHtcbiAgICByZXR1cm4gYXJyLm1hcChmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICB2YXIgc3RvaWNoU3BlY2llID0gbmV3IFN0b2ljaFNwZWNpZShwYXJhbXMpO1xuICAgICAgc3RvaWNoU3BlY2llLnNwZWNpZSA9IHRoaXMucGFyZW50LmdldERlZmF1bHRTcGVjaWUoKTtcbiAgICAgIHJldHVybiBzdG9pY2hTcGVjaWU7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIGdldFJlYWN0aW9uVHlwZUxhYmVsczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfLm1hcChSZWFjdGlvblR5cGVzLCBmdW5jdGlvbiAodmFsLCBrZXkpIHsgcmV0dXJuIHZhbC5sYWJlbDsgfSlcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgZ2V0VG90YWxSZWFjdGFudFJhdGlvOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwucmVhY3RhbnRzLmxlbmd0aDtcbiAgfSxcbiAgdXBkYXRlU3ViZG9tYWluczogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgc3ViZG9tYWluID0gZWxlbWVudC52YWx1ZS5tb2RlbDtcbiAgICB2YXIgY2hlY2tlZCA9IGVsZW1lbnQudmFsdWUuY2hlY2tlZDtcblxuICAgIGlmKGNoZWNrZWQpXG4gICAgICB0aGlzLm1vZGVsLnN1YmRvbWFpbnMgPSBfLnVuaW9uKHRoaXMubW9kZWwuc3ViZG9tYWlucywgW3N1YmRvbWFpbi5uYW1lXSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5tb2RlbC5zdWJkb21haW5zID0gXy5kaWZmZXJlbmNlKHRoaXMubW9kZWwuc3ViZG9tYWlucywgW3N1YmRvbWFpbi5uYW1lXSk7XG4gIH0sXG4gIHJlbmRlclJlYWN0aW9uVHlwZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGRpc3BsYXlNb2RlOiB0cnVlLFxuICAgICAgb3V0cHV0OiAnaHRtbCdcbiAgICB9XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2NyZWF0aW9uJ10ubGFiZWwsIHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1yZWFjdGlvbi10eXBlJykuZmlyc3RDaGlsZC5jaGlsZHJlblsxXVsnMCddLCBvcHRpb25zKTtcbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snZGVzdHJ1Y3Rpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LXJlYWN0aW9uLXR5cGUnKS5maXJzdENoaWxkLmNoaWxkcmVuWzFdWycxJ10sIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydjaGFuZ2UnXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LXJlYWN0aW9uLXR5cGUnKS5maXJzdENoaWxkLmNoaWxkcmVuWzFdWycyJ10sIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydkaW1lcml6YXRpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LXJlYWN0aW9uLXR5cGUnKS5maXJzdENoaWxkLmNoaWxkcmVuWzFdWyczJ10sIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydtZXJnZSddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtcmVhY3Rpb24tdHlwZScpLmZpcnN0Q2hpbGQuY2hpbGRyZW5bMV1bJzQnXSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ3NwbGl0J10ubGFiZWwsIHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1yZWFjdGlvbi10eXBlJykuZmlyc3RDaGlsZC5jaGlsZHJlblsxXVsnNSddLCBvcHRpb25zKTtcbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snZm91ciddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtcmVhY3Rpb24tdHlwZScpLmZpcnN0Q2hpbGQuY2hpbGRyZW5bMV1bJzYnXSwgb3B0aW9ucyk7XG4gIH0sXG59KTsiLCJ2YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIGthdGV4ID0gcmVxdWlyZSgna2F0ZXgnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uTGlzdGluZy5wdWcnKTtcblxubGV0IHJlYWN0aW9uQW5ub3RhdGlvbk1vZGFsSHRtbCA9IChyZWFjdGlvbk5hbWUsIGFubm90YXRpb24pID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwicmVhY3Rpb25Bbm5vdGF0aW9uTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkFubm90YXRpb24gZm9yICR7cmVhY3Rpb25OYW1lfTwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8c3BhbiBmb3I9XCJyZWFjdGlvbkFubm90YXRpb25JbnB1dFwiPkFubm90YXRpb246IDwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicmVhY3Rpb25Bbm5vdGF0aW9uSW5wdXRcIiBuYW1lPVwicmVhY3Rpb25Bbm5vdGF0aW9uSW5wdXRcIiBzaXplPVwiMzBcIiBhdXRvZm9jdXMgdmFsdWU9XCIke2Fubm90YXRpb259XCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgb2stbW9kZWwtYnRuXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubmFtZScgOiB7XG4gICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgaG9vazogJ2lucHV0LW5hbWUtY29udGFpbmVyJ1xuICAgIH0sXG4gICAgJ21vZGVsLnN1bW1hcnknIDoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICBrYXRleC5yZW5kZXIodGhpcy5tb2RlbC5zdW1tYXJ5LCB0aGlzLnF1ZXJ5QnlIb29rKCdzdW1tYXJ5JyksIHtcbiAgICAgICAgICBkaXNwbGF5TW9kZTogdHJ1ZSxcbiAgICAgICAgICBvdXRwdXQ6ICdodG1sJyxcbiAgICAgICAgICBtYXhTaXplOiA1LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBob29rOiAnc3VtbWFyeScsXG4gICAgfSxcbiAgICAnbW9kZWwuc2VsZWN0ZWQnIDoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICBlbC5jaGVja2VkID0gdmFsdWU7XG4gICAgICB9LFxuICAgICAgaG9vazogJ3NlbGVjdCdcbiAgICB9XG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtYW5ub3RhdGlvbi1idG5dJyA6ICdlZGl0QW5ub3RhdGlvbicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9c2VsZWN0XScgIDogJ3NlbGVjdFJlYWN0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZW1vdmVdJyAgOiAncmVtb3ZlUmVhY3Rpb24nXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgJChkb2N1bWVudCkub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJ1thdXRvZm9jdXNdJywgZS50YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgaWYoIXRoaXMubW9kZWwuYW5ub3RhdGlvbil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2VkaXQtYW5ub3RhdGlvbi1idG4nKSkudGV4dCgnQWRkJylcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBzZWxlY3RSZWFjdGlvbjogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24udHJpZ2dlcihcInNlbGVjdFwiLCB0aGlzLm1vZGVsKTtcbiAgfSxcbiAgcmVtb3ZlUmVhY3Rpb246IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVJlYWN0aW9uKHRoaXMubW9kZWwpO1xuICAgIHRoaXMucGFyZW50LmNvbGxlY3Rpb24udHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgfSxcbiAgZWRpdEFubm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLm1vZGVsLm5hbWU7XG4gICAgdmFyIGFubm90YXRpb24gPSB0aGlzLm1vZGVsLmFubm90YXRpb247XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JlYWN0aW9uQW5ub3RhdGlvbk1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZWFjdGlvbkFubm90YXRpb25Nb2RhbCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKHJlYWN0aW9uQW5ub3RhdGlvbk1vZGFsSHRtbChuYW1lLCBhbm5vdGF0aW9uKSkubW9kYWwoKTtcbiAgICBsZXQgb2tCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVhY3Rpb25Bbm5vdGF0aW9uTW9kYWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZWFjdGlvbkFubm90YXRpb25Nb2RhbCAjcmVhY3Rpb25Bbm5vdGF0aW9uSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5tb2RlbC5hbm5vdGF0aW9uID0gaW5wdXQudmFsdWU7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJSZWFjdGlvbkxpc3RpbmdWaWV3KCk7XG4gICAgICBtb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgIH0pO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0TmFtZToge1xuICAgICAgaG9vazogJ2lucHV0LW5hbWUtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy5uYW1lVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICduYW1lJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLm5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFN1YmRvbWFpbnNWaWV3ID0gcmVxdWlyZSgnLi9zdWJkb21haW4nKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25TdWJkb21haW5zLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXJncykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmlzUmVhY3Rpb24gPSBhcmdzLmlzUmVhY3Rpb247XG4gICAgdGhpcy5iYXNlTW9kZWwgPSB0aGlzLnBhcmVudC5wYXJlbnQuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgdGhpcy5iYXNlTW9kZWwub24oJ21lc2gtdXBkYXRlJywgdGhpcy51cGRhdGVEZWZhdWx0U3ViZG9tYWlucywgdGhpcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyU3ViZG9tYWlucygpO1xuICB9LFxuICB1cGRhdGVEZWZhdWx0U3ViZG9tYWluczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGFyZW50Lm1vZGVsLnN1YmRvbWFpbnMgPSB0aGlzLmJhc2VNb2RlbC5tZXNoU2V0dGluZ3MudW5pcXVlU3ViZG9tYWlucy5tYXAoZnVuY3Rpb24gKG1vZGVsKSB7cmV0dXJuIG1vZGVsLm5hbWU7IH0pO1xuICAgIHRoaXMucmVuZGVyU3ViZG9tYWlucygpO1xuICB9LFxuICByZW5kZXJTdWJkb21haW5zOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5iYXNlTW9kZWwgPSB0aGlzLnBhcmVudC5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICBpZih0aGlzLnN1YmRvbWFpbnNWaWV3KVxuICAgICAgdGhpcy5zdWJkb21haW5zVmlldy5yZW1vdmUoKTtcbiAgICB2YXIgc3ViZG9tYWlucyA9IHRoaXMuYmFzZU1vZGVsLm1lc2hTZXR0aW5ncy51bmlxdWVTdWJkb21haW5zO1xuICAgIHRoaXMuc3ViZG9tYWluc1ZpZXcgPSB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICBzdWJkb21haW5zLFxuICAgICAgU3ViZG9tYWluc1ZpZXcsXG4gICAgICB0aGlzLnF1ZXJ5QnlIb29rKCdyZWFjdGlvbi1zdWJkb21haW5zJylcbiAgICApO1xuICB9LFxuICB1cGRhdGVTdWJkb21haW5zOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHRoaXMucGFyZW50LnVwZGF0ZVN1YmRvbWFpbnMoZWxlbWVudCk7XG4gIH0sXG59KTsiLCJ2YXIgVmlld1N3aXRjaGVyID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXctc3dpdGNoZXInKTtcbnZhciBrYXRleCA9IHJlcXVpcmUoJ2thdGV4Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciBSZWFjdGlvblR5cGVzID0gcmVxdWlyZSgnLi4vcmVhY3Rpb24tdHlwZXMnKTtcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoJy4uL3Rvb2x0aXBzJyk7XG4vL21vZGVsc1xudmFyIFN0b2ljaFNwZWNpZXNDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL3N0b2ljaC1zcGVjaWVzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgUmVhY3Rpb25MaXN0aW5nVmlldyA9IHJlcXVpcmUoJy4vcmVhY3Rpb24tbGlzdGluZycpO1xudmFyIFJlYWN0aW9uRGV0YWlsc1ZpZXcgPSByZXF1aXJlKCcuL3JlYWN0aW9uLWRldGFpbHMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zRWRpdG9yLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jcmVhdGlvbl0nICAgICAgICAgICAgICAgOiAnaGFuZGxlQWRkUmVhY3Rpb25DbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZGVzdHJ1Y3Rpb25dJyAgICAgICAgICAgIDogJ2hhbmRsZUFkZFJlYWN0aW9uQ2xpY2snLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNoYW5nZV0nICAgICAgICAgICAgICAgICA6ICdoYW5kbGVBZGRSZWFjdGlvbkNsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1kaW1lcml6YXRpb25dJyAgICAgICAgICAgOiAnaGFuZGxlQWRkUmVhY3Rpb25DbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9bWVyZ2VdJyAgICAgICAgICAgICAgICAgIDogJ2hhbmRsZUFkZFJlYWN0aW9uQ2xpY2snLFxuICAgICdjbGljayBbZGF0YS1ob29rPXNwbGl0XScgICAgICAgICAgICAgICAgICA6ICdoYW5kbGVBZGRSZWFjdGlvbkNsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1mb3VyXScgICAgICAgICAgICAgICAgICAgOiAnaGFuZGxlQWRkUmVhY3Rpb25DbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y3VzdG9tLW1hc3NhY3Rpb25dJyAgICAgIDogJ2hhbmRsZUFkZFJlYWN0aW9uQ2xpY2snLFxuICAgICdjbGljayBbZGF0YS1ob29rPWN1c3RvbS1wcm9wZW5zaXR5XScgICAgICA6ICdoYW5kbGVBZGRSZWFjdGlvbkNsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCdcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5yZWFjdGlvbnNFZGl0b3JcbiAgICB0aGlzLmNvbGxlY3Rpb24ub24oXCJzZWxlY3RcIiwgZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB0aGlzLnNldFNlbGVjdGVkUmVhY3Rpb24ocmVhY3Rpb24pO1xuICAgICAgdGhpcy5zZXREZXRhaWxzVmlldyhyZWFjdGlvbik7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKFwicmVtb3ZlXCIsIGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgLy8gU2VsZWN0IHRoZSBsYXN0IHJlYWN0aW9uIGJ5IGRlZmF1bHRcbiAgICAgIC8vIEJ1dCBvbmx5IGlmIHRoZXJlIGFyZSBvdGhlciByZWFjdGlvbnMgb3RoZXIgdGhhbiB0aGUgb25lIHdlJ3JlIHJlbW92aW5nXG4gICAgICBpZiAocmVhY3Rpb24uZGV0YWlsc1ZpZXcpXG4gICAgICAgIHJlYWN0aW9uLmRldGFpbHNWaWV3LnJlbW92ZSgpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVJlYWN0aW9uKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZCA9IHRoaXMuY29sbGVjdGlvbi5hdCh0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoLTEpO1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24udHJpZ2dlcihcInNlbGVjdFwiLCBzZWxlY3RlZCk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVBZGRSZWFjdGlvbkJ1dHRvbiwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVSZWFjdGlvblR5cGVzLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJSZWFjdGlvbkxpc3RpbmdWaWV3KCk7XG4gICAgdGhpcy5kZXRhaWxzQ29udGFpbmVyID0gdGhpcy5xdWVyeUJ5SG9vaygncmVhY3Rpb24tZGV0YWlscy1jb250YWluZXInKTtcbiAgICB0aGlzLmRldGFpbHNWaWV3U3dpdGNoZXIgPSBuZXcgVmlld1N3aXRjaGVyKHtcbiAgICAgIGVsOiB0aGlzLmRldGFpbHNDb250YWluZXIsXG4gICAgfSk7XG4gICAgaWYgKHRoaXMuY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWRSZWFjdGlvbih0aGlzLmNvbGxlY3Rpb24uYXQoMCkpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3RlZFJlYWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgdGhpcy50b2dnbGVBZGRSZWFjdGlvbkJ1dHRvbigpO1xuICAgIGlmKHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPiAwKXtcbiAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1yZWFjdGlvbi1wYXJ0aWFsJykpLnByb3AoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tZnVsbCcpKS5wcm9wKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJSZWFjdGlvblR5cGVzKCk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXJSZWFjdGlvbkxpc3RpbmdWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5yZWFjdGlvbkxpc3RpbmdWaWV3KXtcbiAgICAgIHRoaXMucmVhY3Rpb25MaXN0aW5nVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5yZWFjdGlvbkxpc3RpbmdWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgUmVhY3Rpb25MaXN0aW5nVmlldyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ3JlYWN0aW9uLWxpc3QnKVxuICAgICk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICB0b2dnbGVBZGRSZWFjdGlvbkJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWRkLXJlYWN0aW9uLWZ1bGwnKSkucHJvcCgnZGlzYWJsZWQnLCAodGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLmxlbmd0aCA8PSAwKSk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tcGFydGlhbCcpKS5wcm9wKCdkaXNhYmxlZCcsICh0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXMubGVuZ3RoIDw9IDApKTtcbiAgfSxcbiAgdG9nZ2xlUmVhY3Rpb25UeXBlczogZnVuY3Rpb24gKGUsIHByZXYsIGN1cnIpIHtcbiAgICBpZihjdXJyICYmIGN1cnIuYWRkICYmIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPT09IDEpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tZnVsbCcpKS5wcm9wKCdoaWRkZW4nLCBmYWxzZSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1yZWFjdGlvbi1wYXJ0aWFsJykpLnByb3AoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1lbHNlIGlmKGN1cnIgJiYgIWN1cnIuYWRkICYmIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPT09IDApe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tZnVsbCcpKS5wcm9wKCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWRkLXJlYWN0aW9uLXBhcnRpYWwnKSkucHJvcCgnaGlkZGVuJywgZmFsc2UpO1xuICAgIH1cbiAgfSxcbiAgc2V0U2VsZWN0ZWRSZWFjdGlvbjogZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG0pIHsgbS5zZWxlY3RlZCA9IGZhbHNlOyB9KTtcbiAgICByZWFjdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3RlZFJlYWN0aW9uID0gcmVhY3Rpb247XG4gIH0sXG4gIHNldERldGFpbHNWaWV3OiBmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICByZWFjdGlvbi5kZXRhaWxzVmlldyA9IHJlYWN0aW9uLmRldGFpbHNWaWV3IHx8IHRoaXMubmV3RGV0YWlsc1ZpZXcocmVhY3Rpb24pO1xuICAgIHRoaXMuZGV0YWlsc1ZpZXdTd2l0Y2hlci5zZXQocmVhY3Rpb24uZGV0YWlsc1ZpZXcpO1xuICB9LFxuICBoYW5kbGVBZGRSZWFjdGlvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciByZWFjdGlvblR5cGUgPSBlLmRlbGVnYXRlVGFyZ2V0LmRhdGFzZXQuaG9vaztcbiAgICB2YXIgc3RvaWNoQXJncyA9IHRoaXMuZ2V0U3RvaWNoQXJnc0ZvclJlYWN0aW9uVHlwZShyZWFjdGlvblR5cGUpO1xuICAgIHZhciBzdWJkb21haW5zID0gdGhpcy5wYXJlbnQubW9kZWwubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMubWFwKGZ1bmN0aW9uIChtb2RlbCkge3JldHVybiBtb2RlbC5uYW1lfSlcbiAgICB2YXIgcmVhY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb24uYWRkUmVhY3Rpb24ocmVhY3Rpb25UeXBlLCBzdG9pY2hBcmdzLCBzdWJkb21haW5zKTtcbiAgICByZWFjdGlvbi5kZXRhaWxzVmlldyA9IHRoaXMubmV3RGV0YWlsc1ZpZXcocmVhY3Rpb24pO1xuICAgIHRoaXMuY29sbGVjdGlvbi50cmlnZ2VyKFwic2VsZWN0XCIsIHJlYWN0aW9uKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0U3RvaWNoQXJnc0ZvclJlYWN0aW9uVHlwZTogZnVuY3Rpb24odHlwZSkge1xuICAgIHZhciBhcmdzID0gUmVhY3Rpb25UeXBlc1t0eXBlXTtcbiAgICByZXR1cm4gYXJncztcbiAgfSxcbiAgbmV3RGV0YWlsc1ZpZXc6IGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgIHZhciBkZXRhaWxzVmlldyA9IG5ldyBSZWFjdGlvbkRldGFpbHNWaWV3KHsgbW9kZWw6IHJlYWN0aW9uIH0pO1xuICAgIGRldGFpbHNWaWV3LnBhcmVudCA9IHRoaXM7XG4gICAgcmV0dXJuIGRldGFpbHNWaWV3XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJylcbiAgfSxcbiAgZ2V0RGVmYXVsdFNwZWNpZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcy5tb2RlbHNbMF07XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICBnZXRBbm5vdGF0aW9uOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiBSZWFjdGlvblR5cGVzW3R5cGVdLmxhYmVsXG4gIH0sXG4gIHJlbmRlclJlYWN0aW9uVHlwZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGRpc3BsYXlNb2RlOiBmYWxzZSxcbiAgICAgIG91dHB1dDogJ2h0bWwnLFxuICAgIH1cbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snY3JlYXRpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnY3JlYXRpb24nKSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2Rlc3RydWN0aW9uJ10ubGFiZWwsIHRoaXMucXVlcnlCeUhvb2soJ2Rlc3RydWN0aW9uJyksIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydjaGFuZ2UnXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnY2hhbmdlJyksIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydkaW1lcml6YXRpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnZGltZXJpemF0aW9uJyksIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydtZXJnZSddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdtZXJnZScpLCBvcHRpb25zKTtcbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snc3BsaXQnXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc3BsaXQnKSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2ZvdXInXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnZm91cicpLCBvcHRpb25zKTtcbiAgfVxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vc3VwcG9ydCBmaWxlc1xudmFyIFRvb2x0aXBzID0gcmVxdWlyZSgnLi4vdG9vbHRpcHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBSdWxlVmlldyA9IHJlcXVpcmUoJy4vZWRpdC1ydWxlJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3J1bGVFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXJhdGUtcnVsZV0nIDogJ2FkZFJ1bGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWFzc2lnbm1lbnQtcnVsZV0nIDogJ2FkZFJ1bGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVBZGRSdWxlQnV0dG9uLCB0aGlzKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnMub24oJ2FkZCByZW1vdmUnLCB0aGlzLnRvZ2dsZUFkZFJ1bGVCdXR0b24sIHRoaXMpO1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5ydWxlc0VkaXRvclxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlclJ1bGVzKCk7XG4gICAgdGhpcy50b2dnbGVBZGRSdWxlQnV0dG9uKClcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlbmRlclJ1bGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5ydWxlc1ZpZXcpIHtcbiAgICAgIHRoaXMucnVsZXNWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLnJ1bGVzVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgIFJ1bGVWaWV3LFxuICAgICAgdGhpcy5xdWVyeUJ5SG9vaygncnVsZS1saXN0LWNvbnRhaW5lcicpXG4gICAgKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHRvZ2dsZUFkZFJ1bGVCdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlclJ1bGVzKCk7XG4gICAgdmFyIG51bVNwZWNpZXMgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXMubGVuZ3RoO1xuICAgIHZhciBudW1QYXJhbWV0ZXJzID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLmxlbmd0aDtcbiAgICB2YXIgZGlzYWJsZWQgPSBudW1TcGVjaWVzIDw9IDAgJiYgbnVtUGFyYW1ldGVycyA8PSAwXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcnVsZScpKS5wcm9wKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcbiAgfSxcbiAgYWRkUnVsZTogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdHlwZSA9IGUudGFyZ2V0LmRhdGFzZXQubmFtZVxuICAgIHRoaXMuY29sbGVjdGlvbi5hZGRSdWxlKHR5cGUpO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcblxuICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vc3VwcG9ydCBmaWxlc1xudmFyIFRvb2x0aXBzID0gcmVxdWlyZSgnLi4vdG9vbHRpcHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBFZGl0RnVuY3Rpb25EZWZpbml0aW9uID0gcmVxdWlyZSgnLi9lZGl0LWZ1bmN0aW9uLWRlZmluaXRpb24nKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvc2JtbENvbXBvbmVudEVkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KCdjb2xsYXBzZScpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2UtZnVuY3Rpb24tZGVmaW5pdGlvbnNdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KCdjb2xsYXBzZS1mdW5jdGlvbi1kZWZpbml0aW9ucycpO1xuICAgIH0sXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMuc2JtbENvbXBvbmVudHNFZGl0b3JcbiAgICB0aGlzLmZ1bmN0aW9uRGVmaW5pdGlvbnMgPSBhdHRycy5mdW5jdGlvbkRlZmluaXRpb25zO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckVkaXJGdW5jdGlvbkRlZmluaXRpb25WaWV3KCk7XG4gIH0sXG4gIHJlbmRlckVkaXJGdW5jdGlvbkRlZmluaXRpb25WaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5lZGl0RnVuY3Rpb25EZWZpbml0aW9uVmlldyl7XG4gICAgICB0aGlzLmVkaXRGdW5jdGlvbkRlZmluaXRpb25WaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmVkaXRGdW5jdGlvbkRlZmluaXRpb25WaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgdGhpcy5mdW5jdGlvbkRlZmluaXRpb25zLFxuICAgICAgRWRpdEZ1bmN0aW9uRGVmaW5pdGlvbixcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ2Z1bmN0aW9uLWRlZmluaXRpb24tbGlzdCcpXG4gICAgKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGhvb2spIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vayhob29rKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vayhob29rKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy9zdXBwb3J0IGZpbGVzXG52YXIgVG9vbHRpcHMgPSByZXF1aXJlKCcuLi90b29sdGlwcycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIEVkaXROb25zcGF0aWFsU3BlY2llVmlldyA9IHJlcXVpcmUoJy4vZWRpdC1zcGVjaWUnKTtcbnZhciBFZGl0U3BhdGlhbFNwZWNpZVZpZXcgPSByZXF1aXJlKCcuL2VkaXQtc3BhdGlhbC1zcGVjaWUnKTtcbnZhciBFZGl0QWR2YW5jZWRTcGVjaWUgPSByZXF1aXJlKCcuL2VkaXQtYWR2YW5jZWQtc3BlY2llJyk7XG4vL3RlbXBsYXRlc1xudmFyIG5vbnNwYXRpYWxTcGVjaWVUZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zcGVjaWVzRWRpdG9yLnB1ZycpO1xudmFyIHNwYXRpYWxTcGVjaWVUZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zcGF0aWFsU3BlY2llc0VkaXRvci5wdWcnKTtcblxubGV0IHJlbmRlckRlZmF1bHRNb2RlTW9kYWxIdG1sID0gKCkgPT4ge1xuICBsZXQgY29uY2VudHJhdGlvbkRlc2NpcHRpb24gPSBgU3BlY2llcyB3aWxsIG9ubHkgYmUgcmVwcmVzZW50ZWQgZGV0ZXJtaW5pc3RpY2FsbHkuYDtcbiAgbGV0IHBvcHVsYXRpb25EZXNjcmlwdGlvbiA9IGBTcGVjaWVzIHdpbGwgb25seSBiZSByZXByZXNlbnRlZCBzdG9jaGFzdGljYWxseS5gO1xuICBsZXQgaHlicmlkRGVzY3JpcHRpb24gPSBgQWxsb3dzIGEgc3BlY2llcyB0byBiZSByZXByZXNlbnRlZCBkZXRlcm1pbmlzdGljYWxseSBhbmQvb3Igc3RvY2hhc3RpY2FsbHkuICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGlzIGFsbG93IHlvdSB0byBjdXN0b21pemUgdGhlIG1vZGUgb2YgaW5kaXZpZHVhbCBzcGVjaWVzIGFuZCBzZXQgdGhlIHN3aXRjaGluZyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2xlcmFuY2Ugb3IgbWluaW11bSB2YWx1ZSBmb3Igc3dpdGNoaW5nLlwiYDtcblxuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJkZWZhdWx0TW9kZU1vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50IGluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkRlZmF1bHQgU3BlY2llcyBNb2RlPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2UgY2xvc2UtbW9kYWxcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgIFRoZSBkZWZhdWx0IG1vZGUgaXMgdXNlZCB0byBzZXQgdGhlIG1vZGUgb2YgYWxsIHNwZWNpZXMgYWRkZWQgdG8gdGhlIG1vZGVsLiAgXG4gICAgICAgICAgICAgICAgVGhlIG1vZGUgb2YgYSBzcGVjaWVzIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGhvdyBpdCB3aWxsIGJlIHJlcHJlc2VudGVkIGluIGEgSHlicmlkIHNpbXVsYXRpb24uXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlZmF1bHQtbW9kZVwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBjb25jZW50cmF0aW9uLWJ0blwiPkNvbmNlbnRyYXRpb248L2J1dHRvbj5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9XCJtYXJnaW4tdG9wOiA1cHg7XCI+JHtjb25jZW50cmF0aW9uRGVzY2lwdGlvbn08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZWZhdWx0LW1vZGVcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgcG9wdWxhdGlvbi1idG5cIj5Qb3B1bGF0aW9uPC9idXR0b24+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPVwibWFyZ2luLXRvcDogNXB4O1wiPiR7cG9wdWxhdGlvbkRlc2NyaXB0aW9ufTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlZmF1bHQtbW9kZVwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBoeWJyaWQtYnRuXCI+SHlicmlkIENvbmNlbnRyYXRpb24vUG9wdWxhdGlvbjwvYnV0dG9uPlxuICAgICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbi10b3A6IDVweDtcIj4ke2h5YnJpZERlc2NyaXB0aW9ufTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWFsbC1jb250aW51b3VzXScgOiAnZ2V0RGVmYXVsdFNwZWNpZXNNb2RlJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9YWxsLWRpc2NyZXRlXScgOiAnZ2V0RGVmYXVsdFNwZWNpZXNNb2RlJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9YWR2YW5jZWRdJyA6ICdnZXREZWZhdWx0U3BlY2llc01vZGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWFkZC1zcGVjaWVzXScgOiAnaGFuZGxlQWRkU3BlY2llc0NsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5iYXNlTW9kZWwgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5zcGVjaWVzRWRpdG9yXG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKCd1cGRhdGUtc3BlY2llcycsIGZ1bmN0aW9uIChjb21wSUQsIHNwZWNpZSwgaXNOYW1lVXBkYXRlKSB7XG4gICAgICBzZWxmLmNvbGxlY3Rpb24ucGFyZW50LnJlYWN0aW9ucy5tYXAoZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICAgIHJlYWN0aW9uLnJlYWN0YW50cy5tYXAoZnVuY3Rpb24gKHJlYWN0YW50KSB7XG4gICAgICAgICAgaWYocmVhY3RhbnQuc3BlY2llLmNvbXBJRCA9PT0gY29tcElEKSB7XG4gICAgICAgICAgICByZWFjdGFudC5zcGVjaWUgPSBzcGVjaWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmVhY3Rpb24ucHJvZHVjdHMubWFwKGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgICAgICAgaWYocHJvZHVjdC5zcGVjaWUuY29tcElEID09PSBjb21wSUQpIHtcbiAgICAgICAgICAgIHByb2R1Y3Quc3BlY2llID0gc3BlY2llO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmKGlzTmFtZVVwZGF0ZSkge1xuICAgICAgICAgIHJlYWN0aW9uLmJ1aWxkU3VtbWFyeSgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICByZWFjdGlvbi5jaGVja01vZGVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5jb2xsZWN0aW9uLnBhcmVudC5ldmVudHNDb2xsZWN0aW9uLm1hcChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuZXZlbnRBc3NpZ25tZW50cy5tYXAoZnVuY3Rpb24gKGFzc2lnbm1lbnQpIHtcbiAgICAgICAgICBpZihhc3NpZ25tZW50LnZhcmlhYmxlLmNvbXBJRCA9PT0gY29tcElEKSB7XG4gICAgICAgICAgICBhc3NpZ25tZW50LnZhcmlhYmxlID0gc3BlY2llO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYoaXNOYW1lVXBkYXRlICYmIGV2ZW50LnNlbGVjdGVkKSB7XG4gICAgICAgICAgZXZlbnQuZGV0YWlsc1ZpZXcucmVuZGVyRXZlbnRBc3NpZ25tZW50cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGYuY29sbGVjdGlvbi5wYXJlbnQucnVsZXMubWFwKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgIGlmKHJ1bGUudmFyaWFibGUuY29tcElEID09PSBjb21wSUQpIHtcbiAgICAgICAgICBydWxlLnZhcmlhYmxlID0gc3BlY2llO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmKGlzTmFtZVVwZGF0ZSkge1xuICAgICAgICBzZWxmLnJlbmRlclNwZWNpZXNBZHZhbmNlZFZpZXcoKTtcbiAgICAgICAgc2VsZi5wYXJlbnQucmVuZGVyUnVsZXNWaWV3KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLnBhcmVudC5tb2RlbC5pc19zcGF0aWFsID8gc3BhdGlhbFNwZWNpZVRlbXBsYXRlIDogbm9uc3BhdGlhbFNwZWNpZVRlbXBsYXRlO1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBkZWZhdWx0TW9kZSA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuZGVmYXVsdE1vZGU7XG4gICAgaWYoZGVmYXVsdE1vZGUgPT09IFwiXCIpe1xuICAgICAgdGhpcy5nZXRJbml0aWFsRGVmYXVsdFNwZWNpZXNNb2RlKCk7XG4gICAgfWVsc2V7XG4gICAgICB2YXIgZGF0YUhvb2tzID0geydjb250aW51b3VzJzonYWxsLWNvbnRpbnVvdXMnLCAnZGlzY3JldGUnOidhbGwtZGlzY3JldGUnLCAnZHluYW1pYyc6J2FkdmFuY2VkJ31cbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vayhkYXRhSG9va3NbdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5kZWZhdWx0TW9kZV0pKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcbiAgICAgIGlmKGRlZmF1bHRNb2RlID09PSBcImR5bmFtaWNcIil7XG4gICAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtc3BlY2llcycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlbmRlckVkaXRTcGVjaWVzVmlldygpO1xuICAgIHRoaXMucmVuZGVyU3BlY2llc0FkdmFuY2VkVmlldygpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIGdldEluaXRpYWxEZWZhdWx0U3BlY2llc01vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZmF1bHRNb2RlTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZmF1bHRNb2RlTW9kYWwnKS5yZW1vdmUoKVxuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKHJlbmRlckRlZmF1bHRNb2RlTW9kYWxIdG1sKCkpLm1vZGFsKCk7XG4gICAgbGV0IGNvbnRpbnVvdXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVmYXVsdE1vZGVNb2RhbCAuY29uY2VudHJhdGlvbi1idG4nKTtcbiAgICBsZXQgZGlzY3JldGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVmYXVsdE1vZGVNb2RhbCAucG9wdWxhdGlvbi1idG4nKTtcbiAgICBsZXQgZHluYW1pYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWZhdWx0TW9kZU1vZGFsIC5oeWJyaWQtYnRuJyk7XG4gICAgY29udGludW91cy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLnNldEluaXRpYWxEZWZhdWx0TW9kZShtb2RhbCwgXCJjb250aW51b3VzXCIpO1xuICAgIH0pO1xuICAgIGRpc2NyZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYuc2V0SW5pdGlhbERlZmF1bHRNb2RlKG1vZGFsLCBcImRpc2NyZXRlXCIpO1xuICAgIH0pO1xuICAgIGR5bmFtaWMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5zZXRJbml0aWFsRGVmYXVsdE1vZGUobW9kYWwsIFwiZHluYW1pY1wiKTtcbiAgICB9KTtcbiAgfSxcbiAgc2V0SW5pdGlhbERlZmF1bHRNb2RlOiBmdW5jdGlvbiAobW9kYWwsIG1vZGUpIHtcbiAgICB2YXIgZGF0YUhvb2tzID0geydjb250aW51b3VzJzonYWxsLWNvbnRpbnVvdXMnLCAnZGlzY3JldGUnOidhbGwtZGlzY3JldGUnLCAnZHluYW1pYyc6J2FkdmFuY2VkJ31cbiAgICBtb2RhbC5tb2RhbCgnaGlkZScpXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKGRhdGFIb29rc1ttb2RlXSkpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuICAgIHRoaXMuc2V0QWxsU3BlY2llc01vZGVzKG1vZGUpXG4gIH0sXG4gIGdldERlZmF1bHRTcGVjaWVzTW9kZTogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5zZXRBbGxTcGVjaWVzTW9kZXMoZS50YXJnZXQuZGF0YXNldC5uYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmNvbGxlY3Rpb24udHJpZ2dlcigndXBkYXRlLXNwZWNpZXMnLCBzcGVjaWUuY29tcElELCBzcGVjaWUsIGZhbHNlKVxuICAgIH0pO1xuICB9LFxuICBzZXRBbGxTcGVjaWVzTW9kZXM6IGZ1bmN0aW9uIChkZWZhdWx0TW9kZSkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuZGVmYXVsdE1vZGUgPSBkZWZhdWx0TW9kZTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ubWFwKGZ1bmN0aW9uIChzcGVjaWUpIHsgXG4gICAgICBzcGVjaWUubW9kZSA9IGRlZmF1bHRNb2RlXG4gICAgfSk7XG4gICAgaWYoZGVmYXVsdE1vZGUgPT09IFwiZHluYW1pY1wiKXtcbiAgICAgIHRoaXMucmVuZGVyU3BlY2llc0FkdmFuY2VkVmlldygpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkdmFuY2VkLXNwZWNpZXMnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtc3BlY2llcycpKS5jb2xsYXBzZSgnaGlkZScpO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyRWRpdFNwZWNpZXNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5lZGl0U3BlY2llc1ZpZXcpe1xuICAgICAgdGhpcy5lZGl0U3BlY2llc1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHZhciBlZGl0U3BlY2llVmlldyA9ICF0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmlzX3NwYXRpYWwgPyBFZGl0Tm9uc3BhdGlhbFNwZWNpZVZpZXcgOiBFZGl0U3BhdGlhbFNwZWNpZVZpZXc7XG4gICAgdGhpcy5lZGl0U3BlY2llc1ZpZXcgPSB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICBlZGl0U3BlY2llVmlldyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ3NwZWNpZS1saXN0JylcbiAgICApO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU3BlY2llc0FkdmFuY2VkVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuc3BlY2llc0FkdmFuY2VkVmlldykge1xuICAgICAgdGhpcy5zcGVjaWVzQWR2YW5jZWRWaWV3LnJlbW92ZSgpXG4gICAgfVxuICAgIHRoaXMuc3BlY2llc0FkdmFuY2VkVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIEVkaXRBZHZhbmNlZFNwZWNpZSwgdGhpcy5xdWVyeUJ5SG9vaygnZWRpdC1zcGVjaWVzLW1vZGUnKSk7XG4gIH0sXG4gIGhhbmRsZUFkZFNwZWNpZXNDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRlZmF1bHRNb2RlID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5kZWZhdWx0TW9kZTtcbiAgICBpZihkZWZhdWx0TW9kZSA9PT0gXCJcIil7XG4gICAgICB0aGlzLmdldEluaXRpYWxEZWZhdWx0U3BlY2llc01vZGUoKTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuYWRkU3BlY2llcygpO1xuICAgIH1cbiAgfSxcbiAgYWRkU3BlY2llczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdWJkb21haW5zID0gdGhpcy5iYXNlTW9kZWwubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMubWFwKGZ1bmN0aW9uIChtb2RlbCkge3JldHVybiBtb2RlbC5uYW1lOyB9KTtcbiAgICB0aGlzLmNvbGxlY3Rpb24uYWRkU3BlY2llKHN1YmRvbWFpbnMpO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcblxuICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHNwZWNpZVN1YmRvbWFpblRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3N1YmRvbWFpbi5wdWcnKTtcbnZhciByZWFjdGlvblN1YmRvbWFpblRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uU3ViZG9tYWluLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHNwZWNpZVN1YmRvbWFpblRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3ViZG9tYWluc10nIDogJ3VwZGF0ZVN1YmRvbWFpbicsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXRoaXMucGFyZW50LmlzUmVhY3Rpb24pXG4gICAgICB2YXIgY2hlY2tlZCA9IF8uY29udGFpbnModGhpcy5wYXJlbnQubW9kZWwuc3ViZG9tYWlucywgdGhpcy5tb2RlbC5uYW1lKTtcbiAgICBlbHNle1xuICAgICAgdGhpcy50ZW1wbGF0ZSA9IHJlYWN0aW9uU3ViZG9tYWluVGVtcGxhdGU7XG4gICAgICB2YXIgY2hlY2tlZCA9IF8uY29udGFpbnModGhpcy5wYXJlbnQucGFyZW50Lm1vZGVsLnN1YmRvbWFpbnMsIHRoaXMubW9kZWwubmFtZSk7XG4gICAgfVxuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3ViZG9tYWluJykpLnByb3AoJ2NoZWNrZWQnLCBjaGVja2VkKTtcbiAgfSxcbiAgdXBkYXRlU3ViZG9tYWluOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMucGFyZW50LnVwZGF0ZVN1YmRvbWFpbnMoe25hbWU6ICdzdWJkb21haW4nLCB2YWx1ZToge21vZGVsOiB0aGlzLm1vZGVsLCBjaGVja2VkOiBlLnRhcmdldC5jaGVja2VkfX0pXG4gIH0sXG59KTsiXSwic291cmNlUm9vdCI6IiJ9