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
      for: 'edit',
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"row\" data-hook=\"reaction-details\"\u003E\u003Cdiv class=\"reaction-summary\"\u003ESummary: \u003C\u002Fdiv\u003E\u003Cdiv data-hook=\"summary-container\" id=\"reaction-summary\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-12\" data-hook=\"select-reaction-type\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-12 verticle-space\"\u003E\u003Cspan for=\"select-rate-parameter\" data-hook=\"rate-parameter-label\"\u003E\u003C\u002Fspan\u003E\u003Cdiv class=\"tooltip-icon\" data-html=\"true\" data-hook=\"rate-parameter-tooltip\" data-toggle=\"tooltip\" title=\"\"\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"inline horizontal-space\" id=\"select-rate-parameter\" data-hook=\"select-rate-parameter\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-12 collapse\" data-hook=\"subdomains-editor\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6\" data-hook=\"reactants-editor\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-6\" data-hook=\"products-editor\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse\" data-hook=\"conflicting-modes-message\"\u003E\u003Cp class=\"text-warning\"\u003E\u003Cb\u003EWarning\u003C\u002Fb\u003E: This reaction containes Stoich Species with modes of 'Concentration' and 'Population' or 'Hybrid Concentration\u002FPopulation' and will fire stochastically.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"card card-body\" id=\"reactions-editor\"\u003E\u003Cdiv\u003E\u003Ch3 class=\"inline\"\u003E \u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EReactions\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-outline-collapse\" data-toggle=\"collapse\" data-target=\"#collapse-reaction\" data-hook=\"collapse\"\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fh3\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"collapse show\" id=\"collapse-reaction\"\u003E\u003Cp\u003EDefine reactions. Select from the given reaction templates, or use the custom types.  Using templated reaction types will help eliminate errors. \nFor non-linear reactions, use the custom propensity type.\u003C\u002Fp\u003E\u003Cp\u003EFor a species that is NOT consumed in the reaction but is part of a massaction reaction, add it as both a reactant and a product.  Mass-action reactions \nmust also have a rate term added. Note that the inputrate represents the mass-action constant rate independent of volume.\u003C\u002Fp\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-md-7 container-part\"\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth scope=\"col\"\u003EEdit\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EName\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.name, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ESummary\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003E\u003Cdiv\u003E\u003Cdiv class=\"inline\"\u003EAnnotation\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"tooltip-icon\""+" data-html=\"true\" data-toggle=\"tooltip\""+pug.attr("title", this.tooltips.annotation, true, true)) + "\u003E\u003Csup\u003E\u003Csvg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"info\" class=\"svg-inline--fa fa-info fa-w-6\" role=\"img\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 192 512\"\u003E\u003Cpath fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fsup\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fth\u003E\u003Cth scope=\"col\"\u003ERemove\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody data-hook=\"reaction-list\"\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-md-5 container-part\" data-hook=\"reaction-details-container\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"dropdown\"\u003E\u003Cbutton class=\"btn btn-outline-primary dropdown-toggle box-shadow\" id=\"addReactionBtn\" data-hook=\"add-reaction-full\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" type=\"button\"\u003EAdd Reaction \u003Cspan class=\"caret\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Cul class=\"dropdown-menu\" aria-labelledby=\"addReactionBtn\"\u003E\u003Cli class=\"dropdown-item\" data-hook=\"creation\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"destruction\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"change\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"dimerization\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"merge\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"split\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"four\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-divider\"\u003E\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"custom-massaction\"\u003ECustom mass action\u003C\u002Fli\u003E\u003Cli class=\"dropdown-item\" data-hook=\"custom-propensity\"\u003ECustom propensity\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"dropdown\"\u003E\u003Cbutton class=\"btn btn-outline-primary dropdown-toggle box-shadow\" id=\"addReactionBtn\" data-hook=\"add-reaction-partial\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" type=\"button\"\u003EAdd Reaction \u003Cspan class=\"caret\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Cul class=\"dropdown-menu\" aria-labelledby=\"addReactionBtn\"\u003E\u003Cli class=\"dropdown-item\" data-hook=\"custom-propensity\"\u003ECustom propensity\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
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
    $(this.parent.queryByHook('model-timeout-message')).collapse('hide');
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
    xhr({ uri: endpoint, json: true}, function (err, response, body) {
      self.outfile = body.Outfile
      self.getResults()
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
  getResults: function () {
    var self = this;
    var model = this.model;
    setTimeout(function () {
      endpoint = path.join(app.getApiPath(), '/models/run/', 'read', self.outfile, model.directory);
      xhr({ uri: endpoint, json: true}, function (err, response, body) {
        var data = body.Results;
        if(response.statusCode >= 400){
          self.ran(false);
          $(self.parent.queryByHook('model-run-error-message')).text(data.errors);
        }
        else if(!body.Running){
          if(data.timeout){
            $(self.parent.queryByHook('model-timeout-message')).collapse('show');
          }
          self.plotResults(data.results);
        }else{
          self.getResults();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL21vZGVsLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvcmVhY3Rpb24tdHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0QWR2YW5jZWRTcGVjaWUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdEN1c3RvbVN0b2ljaFNwZWNpZS5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0RXZlbnRBc3NpZ25tZW50LnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRGdW5jdGlvbkRlZmluaXRpb24ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdEluaXRpYWxDb25kaXRpb24ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFBsYWNlRGV0YWlscy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0UmVhY3Rpb25WYXIucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFJ1bGUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZWRpdFNjYXR0ZXJEZXRhaWxzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRTcGF0aWFsU3BlY2llLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRTdG9pY2hTcGVjaWUucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRBc3NpZ25tZW50c0VkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudERldGFpbHMucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRMaXN0aW5ncy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudHNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvaW5pdGlhbENvbmRpdGlvbnNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvbWVzaEVkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFNldHRpbmdzLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL21vZGVsU3RhdGVCdXR0b25zLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3RhbnRQcm9kdWN0LnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uRGV0YWlscy5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9yZWFjdGlvbkxpc3RpbmcucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25TdWJkb21haW4ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25TdWJkb21haW5zLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uc0VkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9ydWxlRWRpdG9yLnB1ZyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdGVtcGxhdGVzL2luY2x1ZGVzL3NibWxDb21wb25lbnRFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BhdGlhbFNwZWNpZXNFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvaW5jbHVkZXMvc3BlY2llc0VkaXRvci5wdWciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9pbmNsdWRlcy9zdWJkb21haW4ucHVnIiwid2VicGFjazovLy8uL2NsaWVudC90ZW1wbGF0ZXMvcGFnZXMvbW9kZWxFZGl0b3IucHVnIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LWFkdmFuY2VkLXNwZWNpZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZWRpdC1jdXN0b20tc3RvaWNoLXNwZWNpZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZWRpdC1ldmVudC1hc3NpZ25tZW50LmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LWZ1bmN0aW9uLWRlZmluaXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtaW5pdGlhbC1jb25kaXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtcGFyYW1ldGVyLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LXBsYWNlLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtcnVsZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZWRpdC1zY2F0dGVyLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtc3BhdGlhbC1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2VkaXQtc3BlY2llLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9lZGl0LXN0b2ljaC1zcGVjaWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50LWFzc2lnbm1lbnRzLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZXZlbnQtZGV0YWlscy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvZXZlbnQtbGlzdGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2V2ZW50cy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL2luaXRpYWwtY29uZGl0aW9ucy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL21lc2gtZWRpdG9yLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9tb2RlbC1zZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvbW9kZWwtc3RhdGUtYnV0dG9ucy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3MvcGFyYW1ldGVycy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0YW50LXByb2R1Y3QuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9uLWRldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9uLWxpc3RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9uLXN1YmRvbWFpbnMuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3JlYWN0aW9ucy1lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ZpZXdzL3J1bGVzLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvc2JtbC1jb21wb25lbnQtZWRpdG9yLmpzIiwid2VicGFjazovLy8uL2NsaWVudC92aWV3cy9zcGVjaWVzLWVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvdmlld3Mvc3ViZG9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFw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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVE7QUFDUixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsOEI7QUFDakI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0Esc0RBQXNELDBCQUEwQixFQUFFO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EscURBQXFELGtCQUFrQixFQUFFO0FBQ3pFLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMsRTs7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b3IuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbiBcdC8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcImVkaXRvclwiOiAwXG4gXHR9O1xuXG4gXHR2YXIgZGVmZXJyZWRNb2R1bGVzID0gW107XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdHZhciBqc29ucEFycmF5ID0gd2luZG93W1wid2VicGFja0pzb25wXCJdID0gd2luZG93W1wid2VicGFja0pzb25wXCJdIHx8IFtdO1xuIFx0dmFyIG9sZEpzb25wRnVuY3Rpb24gPSBqc29ucEFycmF5LnB1c2guYmluZChqc29ucEFycmF5KTtcbiBcdGpzb25wQXJyYXkucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrO1xuIFx0anNvbnBBcnJheSA9IGpzb25wQXJyYXkuc2xpY2UoKTtcbiBcdGZvcih2YXIgaSA9IDA7IGkgPCBqc29ucEFycmF5Lmxlbmd0aDsgaSsrKSB3ZWJwYWNrSnNvbnBDYWxsYmFjayhqc29ucEFycmF5W2ldKTtcbiBcdHZhciBwYXJlbnRKc29ucEZ1bmN0aW9uID0gb2xkSnNvbnBGdW5jdGlvbjtcblxuXG4gXHQvLyBhZGQgZW50cnkgbW9kdWxlIHRvIGRlZmVycmVkIGxpc3RcbiBcdGRlZmVycmVkTW9kdWxlcy5wdXNoKFtcIi4vY2xpZW50L3BhZ2VzL21vZGVsLWVkaXRvci5qc1wiLFwiY29tbW9uXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwidmFyIGFwcCA9IHJlcXVpcmUoJy4uL2FwcCcpO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi4vcGFnZXMvYmFzZScpO1xudmFyIE1lc2hFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvbWVzaC1lZGl0b3InKTtcbnZhciBTcGVjaWVzRWRpdG9yVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3NwZWNpZXMtZWRpdG9yJyk7XG52YXIgSW5pdGlhbENvbmRpdGlvbnNFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvaW5pdGlhbC1jb25kaXRpb25zLWVkaXRvcicpO1xudmFyIFBhcmFtZXRlcnNFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvcGFyYW1ldGVycy1lZGl0b3InKTtcbnZhciBSZWFjdGlvbnNFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvcmVhY3Rpb25zLWVkaXRvcicpO1xudmFyIEV2ZW50c0VkaXRvclZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9ldmVudHMtZWRpdG9yJyk7XG52YXIgUnVsZXNFZGl0b3JWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvcnVsZXMtZWRpdG9yJyk7XG52YXIgU0JNTENvbXBvbmVudFZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9zYm1sLWNvbXBvbmVudC1lZGl0b3InKTtcbnZhciBNb2RlbFNldHRpbmdzVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL21vZGVsLXNldHRpbmdzJyk7XG52YXIgTW9kZWxTdGF0ZUJ1dHRvbnNWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvbW9kZWwtc3RhdGUtYnV0dG9ucycpO1xuLy9tb2RlbHNcbnZhciBNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9tb2RlbCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9wYWdlcy9tb2RlbEVkaXRvci5wdWcnKTtcblxuaW1wb3J0IGluaXRQYWdlIGZyb20gJy4vcGFnZS5qcyc7XG5cbmxldCBvcGVyYXRpb25JbmZvTW9kYWxIdG1sID0gKCkgPT4ge1xuICBsZXQgZWRpdE1vZGVsTWVzc2FnZSA9IGBcbiAgICA8cD48Yj5TcGVjaWVzPC9iPjogQSBzcGVjaWVzIHJlZmVycyB0byBhIHBvb2wgb2YgZW50aXRpZXMgdGhhdCBhcmUgY29uc2lkZXJlZCBcbiAgICAgIGluZGlzdGluZ3Vpc2hhYmxlIGZyb20gZWFjaCBvdGhlciBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoZSBtb2RlbCBhbmQgbWF5IHBhcnRpY2lwYXRlIFxuICAgICAgaW4gcmVhY3Rpb25zLjwvcD5cbiAgICA8cD48Yj5QYXJhbWV0ZXI8L2I+OiBBIFBhcmFtZXRlciBpcyB1c2VkIHRvIGRlZmluZSBhIHN5bWJvbCBhc3NvY2lhdGVkIHdpdGggXG4gICAgICBhIHZhbHVlOyB0aGlzIHN5bWJvbCBjYW4gdGhlbiBiZSB1c2VkIGluIG1hdGhlbWF0aWNhbCBmb3JtdWxhcyBpbiBhIG1vZGVsLjwvcD5cbiAgICA8cD48Yj5SZWFjdGlvbjwvYj46IEEgcmVhY3Rpb24gaW4gU0JNTCByZXByZXNlbnRzIGFueSBraW5kIG9mIHByb2Nlc3MgdGhhdCBjYW4gY2hhbmdlIFxuICAgICAgdGhlIHF1YW50aXR5IG9mIG9uZSBvciBtb3JlIHNwZWNpZXMgaW4gYSBtb2RlbC4gIEF0IGxlYXN0IG9uZSBzcGVjaWVzIGlzIHJlcXVpcmVkIHRvIFxuICAgICAgYWRkIGEgcmVhY3Rpb24gYW5kIGF0IGxlYXN0IG9uZSBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQgdG8gYWRkIGEgbWFzcyBhY3Rpb24gcmVhY3Rpb24uPC9wPlxuICAgIDxwPjxiPkV2ZW50PC9iPjogRXZlbnRzIGRlc2NyaWJlIHRoZSB0aW1lIGFuZCBmb3JtIG9mIGluc3RhbnRhbmVvdXMsIGRpc2NvbnRpbnVvdXMgc3RhdGUgXG4gICAgICBjaGFuZ2VzIGluIHRoZSBtb2RlbC4gIEFuIEV2ZW50IG9iamVjdCBkZWZpbmVzIHdoZW4gdGhlIGV2ZW50IGNhbiBvY2N1ciwgdGhlIHZhcmlhYmxlcyBcbiAgICAgIHRoYXQgYXJlIGFmZmVjdGVkIGJ5IGl0LCBob3cgdGhlIHZhcmlhYmxlcyBhcmUgYWZmZWN0ZWQsIGFuZCB0aGUgZXZlbnTigJlzIHJlbGF0aW9uc2hpcCBcbiAgICAgIHRvIG90aGVyIGV2ZW50cy4gIEF0IGxlYXN0IG9uZSBzcGVjaWVzIG9yIHBhcmFtZXRlciBpcyByZXF1aXJlZCB0byBhZGQgYW4gZXZlbnQuPC9wPlxuICAgIDxwPjxiPlJ1bGU8L2I+OiBSdWxlcyBwcm92aWRlIGFkZGl0aW9uYWwgd2F5cyB0byBkZWZpbmUgdGhlIHZhbHVlcyBvZiB2YXJpYWJsZXMgXG4gICAgICBpbiBhIG1vZGVsLCB0aGVpciByZWxhdGlvbnNoaXBzLCBhbmQgdGhlIGR5bmFtaWNhbCBiZWhhdmlvcnMgb2YgdGhvc2UgdmFyaWFibGVzLiAgVGhlIFxuICAgICAgcnVsZSB0eXBlIEFzc2lnbm1lbnQgUnVsZSBpcyB1c2VkIHRvIGV4cHJlc3MgZXF1YXRpb25zIHRoYXQgc2V0IHRoZSB2YWx1ZXMgb2YgdmFyaWFibGVzLiAgXG4gICAgICBUaGUgcnVsZSB0eXBlIFJhdGUgUnVsZSBpcyB1c2VkIHRvIGV4cHJlc3MgZXF1YXRpb25zIHRoYXQgZGV0ZXJtaW5lIHRoZSByYXRlcyBvZiBjaGFuZ2UgXG4gICAgICBvZiB2YXJpYWJsZXMuICBBdCBsZWFzdCBvbmUgc3BlY2llcyBvciBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQgdG8gYWRkIGEgcnVsZS48L3A+XG4gICAgPHA+PGI+UHJldmlldzwvYj46IEEgcHJldmlldyBvZiB0aGUgbW9kZWwgc2hvd3MgdGhlIHJlc3VsdHMgb2YgdGhlIGZpcnN0IGZpdmUgc2Vjb25kcyBvZiBhIFxuICAgICAgc2luZ2xlIHRyYWplY3Rvcnkgb2YgdGhlIG1vZGVsIHNpbXVsYXRpb24uICBBdCBsZWFzdCBvbmUgc3BlY2llcyBhbmQgb25lIHJlYWN0aW9uLCBldmVudCwgXG4gICAgICBvciBydWxlIGlzIHJlcXVpcmVkIHRvIHJ1biBhIHByZXZpZXcuPC9wPlxuICAgIDxwPjxiPldvcmtmbG93PC9iPjogQSB3b3JrZmxvdyBhbGxvd3MgeW91IHRvIHJ1biBhIGZ1bGwgbW9kZWwgd2l0aCBtdWx0aXBsZSB0cmFqZWN0b3JpZXMgd2l0aCBcbiAgICAgIHNldHRpbmdzIHRoZSB3aWxsIGhlbHAgcmVmaW5lIHRoZSBzaW11bGF0aW9uLiAgQXQgbGVhc3Qgb25lIHNwZWNpZXMgYW5kIG9uZSByZWFjdGlvbiwgZXZlbnQsIFxuICAgICAgb3IgcnVsZSBpcyByZXF1aXJlZCB0byBjcmVhdGUgYSBuZXcgd29ya2Zsb3cuPC9wPlxuICBgO1xuXG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cIm9wZXJhdGlvbkluZm9Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBpbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj4gTW9kZWwgRWRpdG9yIEhlbHAgPC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxwPiAke2VkaXRNb2RlbE1lc3NhZ2V9IDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgIFxufVxuXG5sZXQgTW9kZWxFZGl0b3IgPSBQYWdlVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtbW9kZWwtaGVscF0nIDogZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IG1vZGFsID0gJChvcGVyYXRpb25JbmZvTW9kYWxIdG1sKCkpLm1vZGFsKCk7XG4gICAgfSxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgUGFnZVZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpcmVjdG9yeSA9IGRvY3VtZW50LlVSTC5zcGxpdCgnL21vZGVscy9lZGl0JykucG9wKCk7XG4gICAgdmFyIG1vZGVsRmlsZSA9IGRpcmVjdG9yeS5zcGxpdCgnLycpLnBvcCgpO1xuICAgIHZhciBuYW1lID0gZGVjb2RlVVJJKG1vZGVsRmlsZS5zcGxpdCgnLicpWzBdKTtcbiAgICB2YXIgaXNTcGF0aWFsID0gbW9kZWxGaWxlLnNwbGl0KCcuJykucG9wKCkuc3RhcnRzV2l0aCgncycpO1xuICAgIHRoaXMubW9kZWwgPSBuZXcgTW9kZWwoe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGRpcmVjdG9yeTogZGlyZWN0b3J5LFxuICAgICAgaXNfc3BhdGlhbDogaXNTcGF0aWFsLFxuICAgICAgaXNQcmV2aWV3OiB0cnVlLFxuICAgICAgZm9yOiAnZWRpdCcsXG4gICAgfSk7XG4gICAgdGhpcy5tb2RlbC5mZXRjaCh7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobW9kZWwsIHJlc3BvbnNlLCBvcHRpb25zKSB7XG4gICAgICAgIHNlbGYucmVuZGVyU3Vidmlld3MoKTtcbiAgICAgICAgaWYoIXNlbGYubW9kZWwuaXNfc3BhdGlhbCl7XG4gICAgICAgICAgc2VsZi5xdWVyeUJ5SG9vaygnbWVzaC1lZGl0b3ItY29udGFpbmVyJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgIHNlbGYucXVlcnlCeUhvb2soJ2luaXRpYWwtY29uZGl0aW9ucy1lZGl0b3ItY29udGFpbmVyJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFzZWxmLm1vZGVsLmZ1bmN0aW9uRGVmaW5pdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgc2VsZi5xdWVyeUJ5SG9vaygnc2JtbC1jb21wb25lbnQtY29udGFpbmVyJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5tb2RlbC5yZWFjdGlvbnMub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKHJlYWN0aW9ucykge1xuICAgICAgdGhpcy51cGRhdGVTcGVjaWVzSW5Vc2UoKTtcbiAgICAgIHRoaXMudXBkYXRlUGFyYW1ldGVyc0luVXNlKCk7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5tb2RlbC5ldmVudHNDb2xsZWN0aW9uLm9uKFwiYWRkIGNoYW5nZSByZW1vdmVcIiwgZnVuY3Rpb24gKCl7XG4gICAgICB0aGlzLnVwZGF0ZVNwZWNpZXNJblVzZSgpO1xuICAgICAgdGhpcy51cGRhdGVQYXJhbWV0ZXJzSW5Vc2UoKTtcbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLm1vZGVsLnJ1bGVzLm9uKFwiYWRkIGNoYW5nZSByZW1vdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnVwZGF0ZVNwZWNpZXNJblVzZSgpO1xuICAgICAgdGhpcy51cGRhdGVQYXJhbWV0ZXJzSW5Vc2UoKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVNwZWNpZXNJblVzZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5tb2RlbC5zcGVjaWVzO1xuICAgIHZhciByZWFjdGlvbnMgPSB0aGlzLm1vZGVsLnJlYWN0aW9ucztcbiAgICB2YXIgZXZlbnRzID0gdGhpcy5tb2RlbC5ldmVudHNDb2xsZWN0aW9uO1xuICAgIHZhciBydWxlcyA9IHRoaXMubW9kZWwucnVsZXM7XG4gICAgc3BlY2llcy5mb3JFYWNoKGZ1bmN0aW9uIChzcGVjaWUpIHsgc3BlY2llLmluVXNlID0gZmFsc2U7IH0pO1xuICAgIHZhciB1cGRhdGVJblVzZUZvclJlYWN0aW9uID0gZnVuY3Rpb24gKHN0b2ljaFNwZWNpZSkge1xuICAgICAgXy53aGVyZShzcGVjaWVzLm1vZGVscywgeyBjb21wSUQ6IHN0b2ljaFNwZWNpZS5zcGVjaWUuY29tcElEIH0pXG4gICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHNwZWNpZSkge1xuICAgICAgICAgIHNwZWNpZS5pblVzZSA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgdXBkYXRlSW5Vc2VGb3JPdGhlciA9IGZ1bmN0aW9uIChzcGVjaWUpIHtcbiAgICAgIF8ud2hlcmUoc3BlY2llcy5tb2RlbHMsIHsgY29tcElEOiBzcGVjaWUuY29tcElEIH0pXG4gICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHNwZWNpZSkge1xuICAgICAgICAgc3BlY2llLmluVXNlID0gdHJ1ZTtcbiAgICAgICB9KTtcbiAgICB9XG4gICAgcmVhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICByZWFjdGlvbi5wcm9kdWN0cy5mb3JFYWNoKHVwZGF0ZUluVXNlRm9yUmVhY3Rpb24pO1xuICAgICAgcmVhY3Rpb24ucmVhY3RhbnRzLmZvckVhY2godXBkYXRlSW5Vc2VGb3JSZWFjdGlvbik7XG4gICAgfSk7XG4gICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBldmVudC5ldmVudEFzc2lnbm1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGFzc2lnbm1lbnQpIHtcbiAgICAgICAgdXBkYXRlSW5Vc2VGb3JPdGhlcihhc3NpZ25tZW50LnZhcmlhYmxlKVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcnVsZXMuZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgdXBkYXRlSW5Vc2VGb3JPdGhlcihydWxlLnZhcmlhYmxlKTtcbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlUGFyYW1ldGVyc0luVXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhcmFtZXRlcnMgPSB0aGlzLm1vZGVsLnBhcmFtZXRlcnM7XG4gICAgdmFyIHJlYWN0aW9ucyA9IHRoaXMubW9kZWwucmVhY3Rpb25zO1xuICAgIHZhciBldmVudHMgPSB0aGlzLm1vZGVsLmV2ZW50c0NvbGxlY3Rpb247XG4gICAgdmFyIHJ1bGVzID0gdGhpcy5tb2RlbC5ydWxlcztcbiAgICBwYXJhbWV0ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtKSB7IHBhcmFtLmluVXNlID0gZmFsc2U7IH0pO1xuICAgIHZhciB1cGRhdGVJblVzZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgXy53aGVyZShwYXJhbWV0ZXJzLm1vZGVscywgeyBjb21wSUQ6IHBhcmFtLmNvbXBJRCB9KVxuICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICAgcGFyYW0uaW5Vc2UgPSB0cnVlO1xuICAgICAgIH0pO1xuICAgIH1cbiAgICByZWFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICAgIHVwZGF0ZUluVXNlKHJlYWN0aW9uLnJhdGUpO1xuICAgIH0pO1xuICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQuZXZlbnRBc3NpZ25tZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChhc3NpZ25tZW50KSB7XG4gICAgICAgIHVwZGF0ZUluVXNlKGFzc2lnbm1lbnQudmFyaWFibGUpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICB1cGRhdGVJblVzZShydWxlLnZhcmlhYmxlKTtcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWVzaEVkaXRvciA9IG5ldyBNZXNoRWRpdG9yVmlldyh7XG4gICAgICBtb2RlbDogdGhpcy5tb2RlbC5tZXNoU2V0dGluZ3NcbiAgICB9KTtcbiAgICB2YXIgc3BlY2llc0VkaXRvciA9IG5ldyBTcGVjaWVzRWRpdG9yVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnNwZWNpZXNcbiAgICB9KTtcbiAgICB2YXIgaW5pdGlhbENvbmRpdGlvbnNFZGl0b3IgPSBuZXcgSW5pdGlhbENvbmRpdGlvbnNFZGl0b3JWaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwuaW5pdGlhbENvbmRpdGlvbnNcbiAgICB9KTtcbiAgICB2YXIgcGFyYW1ldGVyc0VkaXRvciA9IG5ldyBQYXJhbWV0ZXJzRWRpdG9yVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiB0aGlzLm1vZGVsLnBhcmFtZXRlcnNcbiAgICB9KTtcbiAgICB2YXIgcmVhY3Rpb25zRWRpdG9yID0gbmV3IFJlYWN0aW9uc0VkaXRvclZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5yZWFjdGlvbnNcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlckV2ZW50c1ZpZXcoKTtcbiAgICB0aGlzLnJlbmRlclJ1bGVzVmlldygpO1xuICAgIHZhciBzYm1sQ29tcG9uZW50VmlldyA9IG5ldyBTQk1MQ29tcG9uZW50Vmlldyh7XG4gICAgICBmdW5jdGlvbkRlZmluaXRpb25zOiB0aGlzLm1vZGVsLmZ1bmN0aW9uRGVmaW5pdGlvbnMsXG4gICAgfSk7XG4gICAgdmFyIG1vZGVsU2V0dGluZ3MgPSBuZXcgTW9kZWxTZXR0aW5nc1ZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgbW9kZWw6IHRoaXMubW9kZWwubW9kZWxTZXR0aW5ncyxcbiAgICB9KTtcbiAgICB2YXIgbW9kZWxTdGF0ZUJ1dHRvbnMgPSBuZXcgTW9kZWxTdGF0ZUJ1dHRvbnNWaWV3KHtcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcobWVzaEVkaXRvciwgJ21lc2gtZWRpdG9yLWNvbnRhaW5lcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHNwZWNpZXNFZGl0b3IsICdzcGVjaWVzLWVkaXRvci1jb250YWluZXInKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhpbml0aWFsQ29uZGl0aW9uc0VkaXRvciwgJ2luaXRpYWwtY29uZGl0aW9ucy1lZGl0b3ItY29udGFpbmVyJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocGFyYW1ldGVyc0VkaXRvciwgJ3BhcmFtZXRlcnMtZWRpdG9yLWNvbnRhaW5lcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJlYWN0aW9uc0VkaXRvciwgJ3JlYWN0aW9ucy1lZGl0b3ItY29udGFpbmVyJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc2JtbENvbXBvbmVudFZpZXcsICdzYm1sLWNvbXBvbmVudC1jb250YWluZXInKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyhtb2RlbFNldHRpbmdzLCAnbW9kZWwtc2V0dGluZ3MtY29udGFpbmVyJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcobW9kZWxTdGF0ZUJ1dHRvbnMsICdtb2RlbC1zdGF0ZS1idXR0b25zLWNvbnRhaW5lcicpO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcblxuICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICByZW5kZXJFdmVudHNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5ldmVudHNFZGl0b3Ipe1xuICAgICAgdGhpcy5ldmVudHNFZGl0b3IucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMuZXZlbnRzRWRpdG9yID0gbmV3IEV2ZW50c0VkaXRvclZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5ldmVudHNDb2xsZWN0aW9uXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodGhpcy5ldmVudHNFZGl0b3IsICdldmVudHMtZWRpdG9yLWNvbnRhaW5lcicpO1xuICB9LFxuICByZW5kZXJSdWxlc1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLnJ1bGVzRWRpdG9yKXtcbiAgICAgIHRoaXMucnVsZXNFZGl0b3IucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMucnVsZXNFZGl0b3IgPSBuZXcgUnVsZXNFZGl0b3JWaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucnVsZXNcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0aGlzLnJ1bGVzRWRpdG9yLCAncnVsZXMtZWRpdG9yLWNvbnRhaW5lcicpO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICB9LFxufSk7XG5cbmluaXRQYWdlKE1vZGVsRWRpdG9yKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGlvbjoge1xuICAgIHJlYWN0YW50czogW10sXG4gICAgcHJvZHVjdHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgbGFiZWw6ICdcXFxcZW1wdHlzZXQgXFxcXHJpZ2h0YXJyb3cgQScsXG4gIH0sXG4gIGRlc3RydWN0aW9uOiB7XG4gICAgcmVhY3RhbnRzOiBbIHsgcmF0aW86IDEgfSBdLFxuICAgIHByb2R1Y3RzOiBbXSxcbiAgICBsYWJlbDogJ0EgXFxcXHJpZ2h0YXJyb3cgXFxcXGVtcHR5c2V0J1xuICB9LFxuICBjaGFuZ2U6IHtcbiAgICByZWFjdGFudHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgcHJvZHVjdHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgbGFiZWw6ICdBIFxcXFxyaWdodGFycm93IEInXG4gIH0sXG4gIGRpbWVyaXphdGlvbjoge1xuICAgIHJlYWN0YW50czogWyB7IHJhdGlvOiAyIH0gXSxcbiAgICBwcm9kdWN0czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBsYWJlbDogJzJBIFxcXFxyaWdodGFycm93IEInXG4gIH0sXG4gIG1lcmdlOiB7XG4gICAgcmVhY3RhbnRzOiBbIHsgcmF0aW86IDEgfSwgeyByYXRpbzogMSB9IF0sXG4gICAgcHJvZHVjdHM6IFsgeyByYXRpbzogMSB9IF0sXG4gICAgbGFiZWw6ICdBICsgQiBcXFxccmlnaHRhcnJvdyBDJ1xuICB9LFxuICBzcGxpdDoge1xuICAgIHJlYWN0YW50czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBwcm9kdWN0czogWyB7IHJhdGlvOiAxIH0sIHsgcmF0aW86IDEgfSBdLFxuICAgIGxhYmVsOiAnQSBcXFxccmlnaHRhcnJvdyBCICsgQydcbiAgfSxcbiAgZm91cjoge1xuICAgIHJlYWN0YW50czogWyB7IHJhdGlvOiAxIH0sIHsgcmF0aW86IDEgfSBdLFxuICAgIHByb2R1Y3RzOiBbIHsgcmF0aW86IDEgfSwgeyByYXRpbzogMSB9IF0sXG4gICAgbGFiZWw6ICdBICsgQiBcXFxccmlnaHRhcnJvdyBDICsgRCdcbiAgfSxcbiAgJ2N1c3RvbS1tYXNzYWN0aW9uJzoge1xuICAgIHJlYWN0YW50czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBwcm9kdWN0czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBsYWJlbDogJ0N1c3RvbSBtYXNzIGFjdGlvbidcbiAgfSxcbiAgJ2N1c3RvbS1wcm9wZW5zaXR5Jzoge1xuICAgIHJlYWN0YW50czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBwcm9kdWN0czogWyB7IHJhdGlvOiAxIH0gXSxcbiAgICBsYWJlbDogJ0N1c3RvbSBwcm9wZW5zaXR5J1xuICB9XG59XG4iLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkIGNsYXNzPVxcXCJuYW1lXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3BlY2llLW5hbWVcXFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRoaXMubW9kZWwubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3BlY2llLW1vZGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInN3aXRjaGluZ1xcXCJcXHUwMDNFXFx1MDAzQ2lucHV0XCIgKyAoXCIgdHlwZT1cXFwicmFkaW9cXFwiXCIrcHVnLmF0dHIoXCJuYW1lXCIsIHRoaXMubW9kZWwubmFtZSArIFwiLXN3aXRjaC1tZXRob2RcIiwgdHJ1ZSwgdHJ1ZSkrXCIgZGF0YS1ob29rPVxcXCJzd2l0Y2hpbmctdG9sXFxcIlwiKSArIFwiXFx1MDAzRSBTd2l0Y2hpbmcgVG9sZXJhbmNlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwic3dpdGNoaW5nXFxcIlxcdTAwM0VcXHUwMDNDaW5wdXRcIiArIChcIiB0eXBlPVxcXCJyYWRpb1xcXCJcIitwdWcuYXR0cihcIm5hbWVcIiwgdGhpcy5tb2RlbC5uYW1lICsgXCItc3dpdGNoLW1ldGhvZFwiLCB0cnVlLCB0cnVlKStcIiBkYXRhLWhvb2s9XFxcInN3aXRjaGluZy1taW5cXFwiXCIpICsgXCJcXHUwMDNFIE1pbmltdW0gVmFsdWUgZm9yIFN3aXRjaGluZyAobnVtYmVyIG9mIG1vbGVjdWxlcylcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3dpdGNoaW5nLXRvbGVyYW5jZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInN3aXRjaGluZy10aHJlc2hvbGRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2xhYmVsIGNsYXNzPVxcXCJzZWxlY3RcXFwiXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYnRuLXNtXFxcIiBkYXRhLWhvb2s9XFxcImluY3JlbWVudFxcXCJcXHUwMDNFK1xcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJjdXN0b21cXFwiIGRhdGEtaG9vaz1cXFwicmF0aW9cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJ0bi1zbVxcXCIgZGF0YS1ob29rPVxcXCJkZWNyZW1lbnRcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDc2VsZWN0IGRhdGEtaG9vaz1cXFwic2VsZWN0LXN0b2ljaC1zcGVjaWVcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJtZXNzYWdlIG1lc3NhZ2UtYmVsb3cgbWVzc2FnZS1lcnJvclxcXCIgZGF0YS1ob29rPVxcXCJtZXNzYWdlLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ3AgZGF0YS1ob29rPVxcXCJtZXNzYWdlLXRleHRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWxlY3RcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBjdXN0b20gYnRuLXNtXFxcIiBkYXRhLWhvb2s9XFxcInJlbW92ZVxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGFiZWxcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJldmVudC1hc3NpZ25tZW50LXZhcmlhYmxlXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiZXZlbnQtYXNzaWdubWVudC1FeHByZXNzaW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJlbW92ZVxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5zaWduYXR1cmUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGhcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb24tbGFyZ2VcXFwiXCIrXCIgZGF0YS1ob29rPVxcXCJhbm5vdGF0aW9uLXRvb2x0aXBcXFwiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLm1vZGVsLmFubm90YXRpb24gfHwgXCJDbGljayAnQWRkJyB0byBhZGQgYW4gYW5ub3RhdGlvblwiLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImZpbGUtYWx0XFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtZmlsZS1hbHQgZmEtdy0xMlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAzODQgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMjQgMTM2VjBIMjRDMTAuNyAwIDAgMTAuNyAwIDI0djQ2NGMwIDEzLjMgMTAuNyAyNCAyNCAyNGgzMzZjMTMuMyAwIDI0LTEwLjcgMjQtMjRWMTYwSDI0OGMtMTMuMiAwLTI0LTEwLjgtMjQtMjR6bTY0IDIzNmMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ2OHptMC02NGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ2OHptMC03MnY4YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnptOTYtMTE0LjF2Ni4xSDI1NlYwaDYuMWM2LjQgMCAxMi41IDIuNSAxNyA3bDk3LjkgOThjNC41IDQuNSA3IDEwLjYgNyAxNi45elxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYnRuLXNtXFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtYW5ub3RhdGlvbi1idG5cXFwiXFx1MDAzRUVkaXRcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJlbW92ZVxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImluaXRpYWwtY29uZGl0aW9uLXR5cGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJpbml0aWFsLWNvbmRpdGlvbi1zcGVjaWVzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiaW5pdGlhbC1jb25kaXRpb24tZGV0YWlsc1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXNlY29uZGFyeVxcXCIgZGF0YS1ob29rPVxcXCJyZW1vdmVcXFwiXFx1MDAzRVhcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VDb3VudFxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVhcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VZXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFWlxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJjb3VudC1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ4LWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInktY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiei1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkIGNsYXNzPVxcXCJuYW1lXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiaW5wdXQtbmFtZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJpbnB1dC12YWx1ZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uLWxhcmdlXFxcIlwiK1wiIGRhdGEtaG9vaz1cXFwiYW5ub3RhdGlvbi10b29sdGlwXFxcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5tb2RlbC5hbm5vdGF0aW9uIHx8IFwiQ2xpY2sgJ0FkZCcgdG8gYWRkIGFuIGFubm90YXRpb25cIiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJmaWxlLWFsdFxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWZpbGUtYWx0IGZhLXctMTJcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzg0IDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjI0IDEzNlYwSDI0QzEwLjcgMCAwIDEwLjcgMCAyNHY0NjRjMCAxMy4zIDEwLjcgMjQgMjQgMjRoMzM2YzEzLjMgMCAyNC0xMC43IDI0LTI0VjE2MEgyNDhjLTEzLjIgMC0yNC0xMC44LTI0LTI0em02NCAyMzZjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNjRjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNzJ2OGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ6bTk2LTExNC4xdjYuMUgyNTZWMGg2LjFjNi40IDAgMTIuNSAyLjUgMTcgN2w5Ny45IDk4YzQuNSA0LjUgNyAxMC42IDcgMTYuOXpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJ0bi1zbSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtYW5ub3RhdGlvbi1idG5cXFwiXFx1MDAzRUVkaXRcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZCBjbGFzcz1cXFwibmFtZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJ1bGUtbmFtZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJ1bGUtdHlwZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJ1bGUtdmFyaWFibGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJydWxlLWV4cHJlc3Npb25cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uLWxhcmdlXFxcIlwiK1wiIGRhdGEtaG9vaz1cXFwiYW5ub3RhdGlvbi10b29sdGlwXFxcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5tb2RlbC5hbm5vdGF0aW9uIHx8IFwiQ2xpY2sgJ0FkZCcgdG8gYWRkIGFuIGFubm90YXRpb25cIiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJmaWxlLWFsdFxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWZpbGUtYWx0IGZhLXctMTJcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzg0IDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjI0IDEzNlYwSDI0QzEwLjcgMCAwIDEwLjcgMCAyNHY0NjRjMCAxMy4zIDEwLjcgMjQgMjQgMjRoMzM2YzEzLjMgMCAyNC0xMC43IDI0LTI0VjE2MEgyNDhjLTEzLjIgMC0yNC0xMC44LTI0LTI0em02NCAyMzZjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNjRjMCA2LjYtNS40IDEyLTEyIDEySDEwOGMtNi42IDAtMTItNS40LTEyLTEydi04YzAtNi42IDUuNC0xMiAxMi0xMmgxNjhjNi42IDAgMTIgNS40IDEyIDEydjh6bTAtNzJ2OGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ6bTk2LTExNC4xdjYuMUgyNTZWMGg2LjFjNi40IDAgMTIuNSAyLjUgMTcgN2w5Ny45IDk4YzQuNSA0LjUgNyAxMC42IDcgMTYuOXpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJ0bi1zbSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcImVkaXQtYW5ub3RhdGlvbi1idG5cXFwiXFx1MDAzRUVkaXRcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwicmVtb3ZlXFxcIlxcdTAwM0VYXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFQ291bnRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdWJkb21haW5cXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiY291bnQtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3ViZG9tYWluLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGQgY2xhc3M9XFxcIm5hbWVcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJpbnB1dC1uYW1lLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImlucHV0LWRpZmZ1c2lvbi1jb2VmZi1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCIgZGF0YS1ob29rPVxcXCJzdWJkb21haW5zXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5XFxcIiBkYXRhLWhvb2s9XFxcInJlbW92ZVxcXCJcXHUwMDNFWFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2xhYmVsIGNsYXNzPVxcXCJzZWxlY3RcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGRhdGEtaG9vaz1cXFwicmF0aW9cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDc2VsZWN0IGRhdGEtaG9vaz1cXFwic2VsZWN0LXN0b2ljaC1zcGVjaWVcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJtZXNzYWdlIG1lc3NhZ2UtYmVsb3cgbWVzc2FnZS1lcnJvclxcXCIgZGF0YS1ob29rPVxcXCJtZXNzYWdlLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ3AgZGF0YS1ob29rPVxcXCJtZXNzYWdlLXRleHRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWxlY3RcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsYWJlbFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVZhcmlhYmxlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMucGFyZW50LnBhcmVudC50b29sdGlwcy52YXJpYWJsZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQucGFyZW50LnRvb2x0aXBzLmFzc2lnbm1lbnRFeHByZXNzaW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJldmVudC1hc3NpZ25tZW50cy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcImFkZC1ldmVudC1hc3NpZ25tZW50XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBBc3NpZ25tZW50XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiZXZlbnQtZGV0YWlsc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDc3BhbiBmb3I9XFxcImV2ZW50LXRyaWdnZXItZXhwcmVzc2lvblxcXCJcXHUwMDNFVHJpZ2dlciBFeHByZXNzaW9uOlxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnBhcmVudC50b29sdGlwcy50cmlnZ2VyRXhwcmVzc2lvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC04IGlubGluZVxcXCIgaWQ9XFxcImV2ZW50LXRyaWdnZXItZXhwcmVzc2lvblxcXCIgZGF0YS1ob29rPVxcXCJldmVudC10cmlnZ2VyLWV4cHJlc3Npb25cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2g2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFkdmFuY2VkXFx1MDAzQ1xcdTAwMkZoNlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNhZHZhbmNlZC1ldmVudHNcXFwiIGRhdGEtaG9vaz1cXFwiYWR2YW5jZWQtZXZlbnQtYnV0dG9uXFxcIlxcdTAwM0UrXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGlkPVxcXCJhZHZhbmNlZC1ldmVudHNcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTZcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGZvcj1cXFwiZXZlbnQtdHJpZ2dlci1leHByZXNzaW9uXFxcIlxcdTAwM0VEZWxheTpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMuZGVsYXksIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtOSBpbmxpbmVcXFwiIGlkPVxcXCJldmVudC1kZWxheVxcXCIgZGF0YS1ob29rPVxcXCJldmVudC1kZWxheVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTZcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGZvcj1cXFwiZXZlbnQtdHJpZ2dlci1leHByZXNzaW9uXFxcIlxcdTAwM0VQcmlvaXJ0eTpcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy5wYXJlbnQudG9vbHRpcHMucHJpb3JpdHksIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtOCBpbmxpbmVcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtcHJpb3JpdHlcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTYgdmVydGljbGUtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJjaGVja2JveFxcXCIgZm9yPVxcXCJpbml0aWFsLXZhbHVlXFxcIlxcdTAwM0VJbml0aWFsIFZhbHVlOlxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnBhcmVudC50b29sdGlwcy5pbml0aWFsVmFsdWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGlkPVxcXCJpbml0aWFsLXZhbHVlXFxcIiBkYXRhLWhvb2s9XFxcImV2ZW50LXRyaWdnZXItaW5pdC12YWx1ZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTYgdmVydGljbGUtc3BhY2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJjaGVja2JveFxcXCIgZm9yPVxcXCJwZXJzaXN0ZW50XFxcIlxcdTAwM0VQZXJzaXN0ZW50OlxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnBhcmVudC50b29sdGlwcy5wZXJzaXN0ZW50LCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBpZD1cXFwicGVyc2lzdGVudFxcXCIgZGF0YS1ob29rPVxcXCJldmVudC10cmlnZ2VyLXBlcnNpc3RlbnRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEyIHZlcnRpY2xlLXNwYWNlXFxcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2hlY2tib3hcXFwiIGZvcj1cXFwidXNlLXZhbHVlcy1mcm9tLXRyaWdnZXItdGltZVxcXCJcXHUwMDNFVXNlIFZhbHVlcyBGcm9tOlxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnBhcmVudC50b29sdGlwcy51c2VWYWx1ZXNGcm9tVHJpZ2dlclRpbWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJob3Jpem9udGFsLXNwYWNlIGlubGluZVxcXCJcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJ1c2UtdmFsdWVzLWZyb21cXFwiIGRhdGEtaG9vaz1cXFwidHJpZ2dlci10aW1lXFxcIiBkYXRhLW5hbWU9XFxcInRyaWdnZXJcXFwiXFx1MDAzRSBUcmlnZ2VyIFRpbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJob3Jpem9udGFsLXNwYWNlIGlubGluZVxcXCJcXHUwMDNFXFx1MDAzQ2lucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJ1c2UtdmFsdWVzLWZyb21cXFwiIGRhdGEtaG9vaz1cXFwiYXNzaWdubWVudC10aW1lXFxcIiBkYXRhLW5hbWU9XFxcImFzc2lnbm1lbnRcXFwiXFx1MDAzRSBBc3NpZ25tZW50IFRpbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFzc2lnbm1lbnRzXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMucGFyZW50LnRvb2x0aXBzLmFzc2lnbm1lbnRzLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJldmVudC1hc3NpZ25tZW50c1xcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgZGF0YS1ob29rPVxcXCJzZWxlY3RcXFwiIG5hbWU9XFxcImV2ZW50LXNlbGVjdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGQgY2xhc3M9XFxcIm5hbWVcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJldmVudC1uYW1lLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb24tbGFyZ2VcXFwiXCIrXCIgZGF0YS1ob29rPVxcXCJhbm5vdGF0aW9uLXRvb2x0aXBcXFwiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLm1vZGVsLmFubm90YXRpb24gfHwgXCJDbGljayAnQWRkJyB0byBhZGQgYW4gYW5ub3RhdGlvblwiLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImZpbGUtYWx0XFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtZmlsZS1hbHQgZmEtdy0xMlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAzODQgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMjQgMTM2VjBIMjRDMTAuNyAwIDAgMTAuNyAwIDI0djQ2NGMwIDEzLjMgMTAuNyAyNCAyNCAyNGgzMzZjMTMuMyAwIDI0LTEwLjcgMjQtMjRWMTYwSDI0OGMtMTMuMiAwLTI0LTEwLjgtMjQtMjR6bTY0IDIzNmMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ2OHptMC02NGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ2OHptMC03MnY4YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnptOTYtMTE0LjF2Ni4xSDI1NlYwaDYuMWM2LjQgMCAxMi41IDIuNSAxNyA3bDk3LjkgOThjNC41IDQuNSA3IDEwLjYgNyAxNi45elxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYnRuLXNtIGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1hbm5vdGF0aW9uLWJ0blxcXCJcXHUwMDNFRWRpdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJyZW1vdmVcXFwiXFx1MDAzRVhcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcImV2ZW50c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXZlbnRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNldmVudHMtY29udGFpbmVyXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImV2ZW50cy1jb250YWluZXJcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnRzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02IGNvbnRhaW5lci1wYXJ0XFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VFZGl0XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5uYW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFQW5ub3RhdGlvblxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLmFubm90YXRpb24sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcImV2ZW50LWxpc3RpbmctY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTYgY29udGFpbmVyLXBhcnRcXFwiIGRhdGEtaG9vaz1cXFwiZXZlbnQtZGV0YWlscy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwiYWRkLWV2ZW50XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBFdmVudFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJpbml0aWFsLWNvbmRpdGlvbnNcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUluaXRpYWwgQ29uZGl0aW9uc1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjaW5pdGlhbC1jb25kaXRpb25cXFwiIGRhdGEtaG9vaz1cXFwiaW5pdGlhbC1jb25kaXRpb24tYnV0dG9uXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImluaXRpYWwtY29uZGl0aW9uXFxcIiBkYXRhLWhvb2s9XFxcImluaXRpYWwtY29uZGl0aW9uc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFVHlwZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVNwZWNpZXNcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VEZXRhaWxzXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFUmVtb3ZlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwiaW5pdGlhbC1jb25kaXRpb25zLWNvbGxlY3Rpb25cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJkcm9wZG93blxcXCJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnkgZHJvcGRvd24tdG9nZ2xlXFxcIiBpZD1cXFwiYWRkSW5pdGlhbENvbmRpdGlvbkJ0blxcXCIgZGF0YS1ob29rPVxcXCJhZGQtaW5pdGlhbC1jb25kaXRpb25cXFwiIGRhdGEtdG9nZ2xlPVxcXCJkcm9wZG93blxcXCIgYXJpYS1oYXNwb3B1cD1cXFwidHJ1ZVxcXCIgYXJpYS1leHBhbmRlZD1cXFwiZmFsc2VcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIEluaXRpYWwgQ29uZGl0aW9uIFxcdTAwM0NzcGFuIGNsYXNzPVxcXCJjYXJldFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0N1bCBjbGFzcz1cXFwiZHJvcGRvd24tbWVudVxcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJhZGRJbml0aWFsQ29uZGl0aW9uQnRuXFxcIlxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwic2NhdHRlclxcXCJcXHUwMDNFU2NhdHRlclxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcInBsYWNlXFxcIlxcdTAwM0VQbGFjZVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcImRpc3RyaWJ1dGUtdW5pZm9ybWx5XFxcIlxcdTAwM0VEaXN0cmlidXRlIFVuaWZvcm1seSBwZXIgVm94ZWxcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NcXHUwMDJGdWxcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcIm1lc2gtZWRpdG9yXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VNZXNoIEVkaXRvclxcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLWNvbGxhcHNlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIjY29sbGFwc2UtbWVzaFxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1tZXNoXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibnVtLXN1YmRvbWFpbnMtY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJwcmV2aWV3LXNldHRpbmdzXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQcmV2aWV3IFNldHRpbmdzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5wcmV2aWV3U2V0dGluZ3MsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXByZXZpZXctc2V0dGluZ3NcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtcHJldmlldy1zZXR0aW5nc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFU2ltdWxhdGlvbiBUaW1lXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVRpbWUgVW5pdHNcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy50aW1lVW5pdHMsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VWb2x1bWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy52b2x1bWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keVxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJwcmV2aWV3LXRpbWVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJ0aW1lLXVuaXRzXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwidm9sdW1lXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJzYXZlXFxcIlxcdTAwM0VTYXZlXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuIHNhdmluZy1zdGF0dXNcXFwiIGRhdGEtaG9vaz1cXFwic2F2aW5nLW1kbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwic3Bpbm5lci1ncm93XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VTYXZpbmcuLi5cXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWRsLWVkaXQtYnRuIHNhdmVkLXN0YXR1c1xcXCIgZGF0YS1ob29rPVxcXCJzYXZlZC1tZGxcXFwiXFx1MDAzRVxcdTAwM0NzcGFuXFx1MDAzRVNhdmVkXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBib3gtc2hhZG93XFxcIiBkYXRhLWhvb2s9XFxcInJ1blxcXCJcXHUwMDNFUnVuIFByZXZpZXdcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJzdGFydC13b3JrZmxvd1xcXCJcXHUwMDNFTmV3IFdvcmtmbG93XFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInBhcmFtZXRlcnMtZWRpdG9yXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VQYXJhbWV0ZXJzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1wYXJhbWV0ZXJzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXBhcmFtZXRlcnNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VOYW1lXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMubmFtZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUV4cHJlc3Npb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5leHByZXNzaW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFubm90YXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbm5vdGF0aW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUmVtb3ZlXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMucmVtb3ZlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJwYXJhbWV0ZXItbGlzdFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXBhcmFtZXRlclxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIlxcdTAwM0VBZGQgUGFyYW1ldGVyXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicmVhY3Rpb24tZGV0YWlsc1xcXCJcXHUwMDNFXFx1MDAzQ2g1IGRhdGEtaG9vaz1cXFwiZmllbGQtdGl0bGVcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLmZpZWxkVGl0bGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIiBkYXRhLWhvb2s9XFxcImZpZWxkLXRpdGxlLXRvb2x0aXBcXFwiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiIHRpdGxlPVxcXCJcXFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGaDVcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInJlYWN0YW50cy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXNwZWNpZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzZWxlY3Qtc3BlY2llXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IGJ0bi1zbVxcXCIgZGF0YS1ob29rPVxcXCJhZGQtc2VsZWN0ZWQtc3BlY2llXFxcIlxcdTAwM0VhZGRcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcInJvd1xcXCIgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1kZXRhaWxzXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyZWFjdGlvbi1zdW1tYXJ5XFxcIlxcdTAwM0VTdW1tYXJ5OiBcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3VtbWFyeS1jb250YWluZXJcXFwiIGlkPVxcXCJyZWFjdGlvbi1zdW1tYXJ5XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtMTJcXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LXJlYWN0aW9uLXR5cGVcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC0xMiB2ZXJ0aWNsZS1zcGFjZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW4gZm9yPVxcXCJzZWxlY3QtcmF0ZS1wYXJhbWV0ZXJcXFwiIGRhdGEtaG9vaz1cXFwicmF0ZS1wYXJhbWV0ZXItbGFiZWxcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS1ob29rPVxcXCJyYXRlLXBhcmFtZXRlci10b29sdGlwXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCIgdGl0bGU9XFxcIlxcXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lIGhvcml6b250YWwtc3BhY2VcXFwiIGlkPVxcXCJzZWxlY3QtcmF0ZS1wYXJhbWV0ZXJcXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0LXJhdGUtcGFyYW1ldGVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtMTIgY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwic3ViZG9tYWlucy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02XFxcIiBkYXRhLWhvb2s9XFxcInJlYWN0YW50cy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC02XFxcIiBkYXRhLWhvb2s9XFxcInByb2R1Y3RzLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiY29uZmxpY3RpbmctbW9kZXMtbWVzc2FnZVxcXCJcXHUwMDNFXFx1MDAzQ3AgY2xhc3M9XFxcInRleHQtd2FybmluZ1xcXCJcXHUwMDNFXFx1MDAzQ2JcXHUwMDNFV2FybmluZ1xcdTAwM0NcXHUwMDJGYlxcdTAwM0U6IFRoaXMgcmVhY3Rpb24gY29udGFpbmVzIFN0b2ljaCBTcGVjaWVzIHdpdGggbW9kZXMgb2YgJ0NvbmNlbnRyYXRpb24nIGFuZCAnUG9wdWxhdGlvbicgb3IgJ0h5YnJpZCBDb25jZW50cmF0aW9uXFx1MDAyRlBvcHVsYXRpb24nIGFuZCB3aWxsIGZpcmUgc3RvY2hhc3RpY2FsbHkuXFx1MDAzQ1xcdTAwMkZwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIGRhdGEtaG9vaz1cXFwic2VsZWN0XFxcIiBuYW1lPVxcXCJyZWFjdGlvbi1zZWxlY3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkIGNsYXNzPVxcXCJuYW1lXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiaW5wdXQtbmFtZS1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJzdW1tYXJ5XFxcIiBzdHlsZT1cXFwid2lkdGg6IGF1dG8gIWltcG9ydGFudFxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0ZFxcdTAwM0VcXHUwMDNDdGRcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb24tbGFyZ2VcXFwiXCIrXCIgZGF0YS1ob29rPVxcXCJhbm5vdGF0aW9uLXRvb2x0aXBcXFwiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLm1vZGVsLmFubm90YXRpb24gfHwgXCJDbGljayAnQWRkJyB0byBhZGQgYW4gYW5ub3RhdGlvblwiLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImZpbGUtYWx0XFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtZmlsZS1hbHQgZmEtdy0xMlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAzODQgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMjQgMTM2VjBIMjRDMTAuNyAwIDAgMTAuNyAwIDI0djQ2NGMwIDEzLjMgMTAuNyAyNCAyNCAyNGgzMzZjMTMuMyAwIDI0LTEwLjcgMjQtMjRWMTYwSDI0OGMtMTMuMiAwLTI0LTEwLjgtMjQtMjR6bTY0IDIzNmMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ2OHptMC02NGMwIDYuNi01LjQgMTItMTIgMTJIMTA4Yy02LjYgMC0xMi01LjQtMTItMTJ2LThjMC02LjYgNS40LTEyIDEyLTEyaDE2OGM2LjYgMCAxMiA1LjQgMTIgMTJ2OHptMC03MnY4YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnptOTYtMTE0LjF2Ni4xSDI1NlYwaDYuMWM2LjQgMCAxMi41IDIuNSAxNyA3bDk3LjkgOThjNC41IDQuNSA3IDEwLjYgNyAxNi45elxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYnRuLXNtIGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1hbm5vdGF0aW9uLWJ0blxcXCJcXHUwMDNFRWRpdFxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1zZWNvbmRhcnkgYm94LXNoYWRvd1xcXCIgZGF0YS1ob29rPVxcXCJyZW1vdmVcXFwiXFx1MDAzRVhcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2wtbWQtNCByZWFjdGlvbi1zdWJkb21haW5cXFwiXFx1MDAzRVxcdTAwM0NsYWJlbFwiICsgKHB1Zy5hdHRyKFwiZm9yXCIsIHRoaXMubW9kZWwubmFtZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGbGFiZWxcXHUwMDNFXFx1MDAzQ2lucHV0XCIgKyAoXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiXCIrcHVnLmF0dHIoXCJpZFwiLCB0aGlzLm1vZGVsLm5hbWUsIHRydWUsIHRydWUpK1wiIGRhdGEtaG9vaz1cXFwic3ViZG9tYWluXFxcIlwiKSArIFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwicmVhY3Rpb24tZGV0YWlscy1zdWJkb21haW5cXFwiXFx1MDAzRVxcdTAwM0NsYWJlbFxcdTAwM0VTdWJkb21haW5zIHRoZSByZWFjdGlvbiBjYW4gb2NjdXIgaW46IFxcdTAwM0NcXHUwMDJGbGFiZWxcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicm93XFxcIiBkYXRhLWhvb2s9XFxcInJlYWN0aW9uLXN1YmRvbWFpbnNcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2FyZCBjYXJkLWJvZHlcXFwiIGlkPVxcXCJyZWFjdGlvbnMtZWRpdG9yXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoMyBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlYWN0aW9uc1xcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJlYWN0aW9uXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2UtcmVhY3Rpb25cXFwiXFx1MDAzRVxcdTAwM0NwXFx1MDAzRURlZmluZSByZWFjdGlvbnMuIFNlbGVjdCBmcm9tIHRoZSBnaXZlbiByZWFjdGlvbiB0ZW1wbGF0ZXMsIG9yIHVzZSB0aGUgY3VzdG9tIHR5cGVzLiAgVXNpbmcgdGVtcGxhdGVkIHJlYWN0aW9uIHR5cGVzIHdpbGwgaGVscCBlbGltaW5hdGUgZXJyb3JzLiBcXG5Gb3Igbm9uLWxpbmVhciByZWFjdGlvbnMsIHVzZSB0aGUgY3VzdG9tIHByb3BlbnNpdHkgdHlwZS5cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFRm9yIGEgc3BlY2llcyB0aGF0IGlzIE5PVCBjb25zdW1lZCBpbiB0aGUgcmVhY3Rpb24gYnV0IGlzIHBhcnQgb2YgYSBtYXNzYWN0aW9uIHJlYWN0aW9uLCBhZGQgaXQgYXMgYm90aCBhIHJlYWN0YW50IGFuZCBhIHByb2R1Y3QuICBNYXNzLWFjdGlvbiByZWFjdGlvbnMgXFxubXVzdCBhbHNvIGhhdmUgYSByYXRlIHRlcm0gYWRkZWQuIE5vdGUgdGhhdCB0aGUgaW5wdXRyYXRlIHJlcHJlc2VudHMgdGhlIG1hc3MtYWN0aW9uIGNvbnN0YW50IHJhdGUgaW5kZXBlbmRlbnQgb2Ygdm9sdW1lLlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3dcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbC1tZC03IGNvbnRhaW5lci1wYXJ0XFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VFZGl0XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5uYW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTdW1tYXJ5XFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFubm90YXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbm5vdGF0aW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJyZWFjdGlvbi1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTUgY29udGFpbmVyLXBhcnRcXFwiIGRhdGEtaG9vaz1cXFwicmVhY3Rpb24tZGV0YWlscy1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImRyb3Bkb3duXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBkcm9wZG93bi10b2dnbGUgYm94LXNoYWRvd1xcXCIgaWQ9XFxcImFkZFJlYWN0aW9uQnRuXFxcIiBkYXRhLWhvb2s9XFxcImFkZC1yZWFjdGlvbi1mdWxsXFxcIiBkYXRhLXRvZ2dsZT1cXFwiZHJvcGRvd25cXFwiIGFyaWEtaGFzcG9wdXA9XFxcInRydWVcXFwiIGFyaWEtZXhwYW5kZWQ9XFxcImZhbHNlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBSZWFjdGlvbiBcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2FyZXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDdWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnVcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwiYWRkUmVhY3Rpb25CdG5cXFwiXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJjcmVhdGlvblxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwiZGVzdHJ1Y3Rpb25cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcImNoYW5nZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwiZGltZXJpemF0aW9uXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJtZXJnZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwic3BsaXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1pdGVtXFxcIiBkYXRhLWhvb2s9XFxcImZvdXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXFx1MDAzQ2xpIGNsYXNzPVxcXCJkcm9wZG93bi1kaXZpZGVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJjdXN0b20tbWFzc2FjdGlvblxcXCJcXHUwMDNFQ3VzdG9tIG1hc3MgYWN0aW9uXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDbGkgY2xhc3M9XFxcImRyb3Bkb3duLWl0ZW1cXFwiIGRhdGEtaG9vaz1cXFwiY3VzdG9tLXByb3BlbnNpdHlcXFwiXFx1MDAzRUN1c3RvbSBwcm9wZW5zaXR5XFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcXHUwMDNDXFx1MDAyRnVsXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImRyb3Bkb3duXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBkcm9wZG93bi10b2dnbGUgYm94LXNoYWRvd1xcXCIgaWQ9XFxcImFkZFJlYWN0aW9uQnRuXFxcIiBkYXRhLWhvb2s9XFxcImFkZC1yZWFjdGlvbi1wYXJ0aWFsXFxcIiBkYXRhLXRvZ2dsZT1cXFwiZHJvcGRvd25cXFwiIGFyaWEtaGFzcG9wdXA9XFxcInRydWVcXFwiIGFyaWEtZXhwYW5kZWQ9XFxcImZhbHNlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiXFx1MDAzRUFkZCBSZWFjdGlvbiBcXHUwMDNDc3BhbiBjbGFzcz1cXFwiY2FyZXRcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDdWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnVcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwiYWRkUmVhY3Rpb25CdG5cXFwiXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJjdXN0b20tcHJvcGVuc2l0eVxcXCJcXHUwMDNFQ3VzdG9tIHByb3BlbnNpdHlcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NcXHUwMDJGdWxcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInJ1bGVzLWVkaXRvclxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFUnVsZXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXJ1bGVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXJ1bGVzXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm5hbWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFVHlwZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnR5cGUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VWYXJpYWJsZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnZhcmlhYmxlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRXhwcmVzc2lvblxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLmV4cHJlc3Npb24sIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBbm5vdGF0aW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuYW5ub3RhdGlvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFUmVtb3ZlXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwicnVsZS1saXN0LWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImRyb3Bkb3duXFxcIlxcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBkcm9wZG93bi10b2dnbGUgYm94LXNoYWRvd1xcXCIgaWQ9XFxcImFkZFJ1bGVCdG5cXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXJ1bGVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJkcm9wZG93blxcXCIgYXJpYS1oYXNwb3B1cD1cXFwidHJ1ZVxcXCIgYXJpYS1leHBhbmRlZD1cXFwiZmFsc2VcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFJ1bGUgXFx1MDAzQ3NwYW4gY2xhc3M9XFxcImNhcmV0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ3VsIGNsYXNzPVxcXCJkcm9wZG93bi1tZW51XFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcImFkZFJ1bGVCdG5cXFwiXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJyYXRlLXJ1bGVcXFwiIGRhdGEtbmFtZT1cXFwiUmF0ZSBSdWxlXFxcIlxcdTAwM0VSYXRlIFJ1bGVcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NsaSBjbGFzcz1cXFwiZHJvcGRvd24taXRlbVxcXCIgZGF0YS1ob29rPVxcXCJhc3NpZ25tZW50LXJ1bGVcXFwiIGRhdGEtbmFtZT1cXFwiQXNzaWdubWVudCBSdWxlXFxcIlxcdTAwM0VBc3NpZ25tZW50IFJ1bGVcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVxcdTAwM0NcXHUwMDJGdWxcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTsiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjYXJkIGNhcmQtYm9keVxcXCIgaWQ9XFxcInNibWwtY29tcG9uZW50c1xcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDMgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFU0JNTCBDb21wb25lbnRzXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zYm1sLWNvbXBvbmVudFxcXCIgZGF0YS1ob29rPVxcXCJjb2xsYXBzZVxcXCJcXHUwMDNFLVxcdTAwM0NcXHUwMDJGYnV0dG9uXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImNvbGxhcHNlIHNob3dcXFwiIGlkPVxcXCJjb2xsYXBzZS1zYm1sLWNvbXBvbmVudFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDaDUgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFRnVuY3Rpb24gRGVmaW5pdGlvbnNcXHUwMDNDXFx1MDAyRmg1XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLWZ1bmN0aW9uLWRlZmluaXRpb25zXFxcIlxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VTaWduYXR1cmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRUFubm90YXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5hbm5vdGF0aW9uLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VSZW1vdmVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJmdW5jdGlvbi1kZWZpbml0aW9uLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic3BlY2llcy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNwZWNpZXMgRWRpdG9yXFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcXHUwMDNDYnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLW91dGxpbmUtY29sbGFwc2VcXFwiIGRhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCIgZGF0YS10YXJnZXQ9XFxcIiNjb2xsYXBzZS1zcGVjaWVzXFxcIiBkYXRhLWhvb2s9XFxcImNvbGxhcHNlXFxcIlxcdTAwM0UtXFx1MDAzQ1xcdTAwMkZidXR0b25cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2Ugc2hvd1xcXCIgaWQ9XFxcImNvbGxhcHNlLXNwZWNpZXNcXFwiXFx1MDAzRVxcdTAwM0N0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiXFx1MDAzRVxcdTAwM0N0aGVhZFxcdTAwM0VcXHUwMDNDdHJcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VEaWZmdXNpb24gQ29lZmZpY2llbnRcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VBY3RpdmUgaW4gU3ViZG9tYWluc1xcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoZWFkXFx1MDAzRVxcdTAwM0N0Ym9keSBkYXRhLWhvb2s9XFxcInNwZWNpZS1saXN0XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnlcXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXNwZWNpZXNcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFNwZWNpZXNcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgY2xhc3M9XFxcImNhcmQgY2FyZC1ib2R5XFxcIiBpZD1cXFwic3BlY2llcy1lZGl0b3JcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gzIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNwZWNpZXNcXHUwMDNDXFx1MDAyRmgzXFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1jb2xsYXBzZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiI2NvbGxhcHNlLXNwZWNpZXNcXFwiIGRhdGEtaG9vaz1cXFwiY29sbGFwc2VcXFwiXFx1MDAzRS1cXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjb2xsYXBzZSBzaG93XFxcIiBpZD1cXFwiY29sbGFwc2Utc3BlY2llc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU5hbWVcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5uYW1lLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFSW5pdGlhbCBDb25kaXRpb25cXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XCIgKyAoXCIgY2xhc3M9XFxcInRvb2x0aXAtaWNvblxcXCJcIitcIiBkYXRhLWh0bWw9XFxcInRydWVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJ0b29sdGlwXFxcIlwiK3B1Zy5hdHRyKFwidGl0bGVcIiwgdGhpcy50b29sdGlwcy5pbml0aWFsVmFsdWUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VBbm5vdGF0aW9uXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdlwiICsgKFwiIGNsYXNzPVxcXCJ0b29sdGlwLWljb25cXFwiXCIrXCIgZGF0YS1odG1sPVxcXCJ0cnVlXFxcIiBkYXRhLXRvZ2dsZT1cXFwidG9vbHRpcFxcXCJcIitwdWcuYXR0cihcInRpdGxlXCIsIHRoaXMudG9vbHRpcHMuYW5ub3RhdGlvbiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVJlbW92ZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnJlbW92ZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ3N1cFxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFzXFxcIiBkYXRhLWljb249XFxcImluZm9cXFwiIGNsYXNzPVxcXCJzdmctaW5saW5lLS1mYSBmYS1pbmZvIGZhLXctNlxcXCIgcm9sZT1cXFwiaW1nXFxcIiB4bWxucz1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnd3dy53My5vcmdcXHUwMDJGMjAwMFxcdTAwMkZzdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAxOTIgNTEyXFxcIlxcdTAwM0VcXHUwMDNDcGF0aCBmaWxsPVxcXCJjdXJyZW50Q29sb3JcXFwiIGQ9XFxcIk0yMCA0MjQuMjI5aDIwVjI3OS43NzFIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwVjIxMmMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMGgxMTJjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjB2MjEyLjIyOWgyMGMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMFY0OTJjMCAxMS4wNDYtOC45NTQgMjAtMjAgMjBIMjBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwdi00Ny43NzFjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB6TTk2IDBDNTYuMjM1IDAgMjQgMzIuMjM1IDI0IDcyczMyLjIzNSA3MiA3MiA3MiA3Mi0zMi4yMzUgNzItNzJTMTM1Ljc2NCAwIDk2IDB6XFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRnBhdGhcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdmdcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzdXBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnRyXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhlYWRcXHUwMDNFXFx1MDAzQ3Rib2R5IGRhdGEtaG9vaz1cXFwic3BlY2llLWxpc3RcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGJvZHlcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0YWJsZVxcdTAwM0VcXHUwMDNDdGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIlxcdTAwM0VcXHUwMDNDdGhlYWRcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0aCBzY29wZT1cXFwiY29sXFxcIiBjb2xzcGFuPVxcXCIzXFxcIlxcdTAwM0UgXFx1MDAzQ2RpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRVNwZWNpZXMgTW9kZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnNwZWNpZXNNb2RlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHlcXHUwMDNFXFx1MDAzQ3RyXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNwZWNpZXMtbW9kZVxcXCIgZGF0YS1ob29rPVxcXCJhbGwtY29udGludW91c1xcXCIgZGF0YS1uYW1lPVxcXCJjb250aW51b3VzXFxcIlxcdTAwM0UgQ29uY2VudHJhdGlvblxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ3RkXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwic3BlY2llcy1tb2RlXFxcIiBkYXRhLWhvb2s9XFxcImFsbC1kaXNjcmV0ZVxcXCIgZGF0YS1uYW1lPVxcXCJkaXNjcmV0ZVxcXCJcXHUwMDNFIFBvcHVsYXRpb25cXHUwMDNDXFx1MDAyRnRkXFx1MDAzRVxcdTAwM0N0ZFxcdTAwM0VcXHUwMDNDaW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIG5hbWU9XFxcInNwZWNpZXMtbW9kZVxcXCIgZGF0YS1ob29rPVxcXCJhZHZhbmNlZFxcXCIgZGF0YS1uYW1lPVxcXCJkeW5hbWljXFxcIlxcdTAwM0UgSHlicmlkIENvbmNlbnRyYXRpb25cXHUwMDJGUG9wdWxhdGlvblxcdTAwM0NcXHUwMDJGdGRcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0clxcdTAwM0VcXHUwMDNDXFx1MDAyRnRib2R5XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGFibGVcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwiYWR2YW5jZWQtc3BlY2llc1xcXCJcXHUwMDNFXFx1MDAzQ3RhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCJcXHUwMDNFXFx1MDAzQ3RoZWFkXFx1MDAzRVxcdTAwM0N0clxcdTAwM0VcXHUwMDNDdGggc2NvcGU9XFxcImNvbFxcXCJcXHUwMDNFTmFtZVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiXFx1MDAzRSBcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImlubGluZVxcXCJcXHUwMDNFTW9kZVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLm1vZGUsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NzdXBcXHUwMDNFXFx1MDAzQ3N2ZyBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCIgZGF0YS1wcmVmaXg9XFxcImZhc1xcXCIgZGF0YS1pY29uPVxcXCJpbmZvXFxcIiBjbGFzcz1cXFwic3ZnLWlubGluZS0tZmEgZmEtaW5mbyBmYS13LTZcXFwiIHJvbGU9XFxcImltZ1xcXCIgeG1sbnM9XFxcImh0dHA6XFx1MDAyRlxcdTAwMkZ3d3cudzMub3JnXFx1MDAyRjIwMDBcXHUwMDJGc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTkyIDUxMlxcXCJcXHUwMDNFXFx1MDAzQ3BhdGggZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBkPVxcXCJNMjAgNDI0LjIyOWgyMFYyNzkuNzcxSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMFYyMTJjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjBoMTEyYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxMi4yMjloMjBjMTEuMDQ2IDAgMjAgOC45NTQgMjAgMjBWNDkyYzAgMTEuMDQ2LTguOTU0IDIwLTIwIDIwSDIwYy0xMS4wNDYgMC0yMC04Ljk1NC0yMC0yMHYtNDcuNzcxYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwek05NiAwQzU2LjIzNSAwIDI0IDMyLjIzNSAyNCA3MnMzMi4yMzUgNzIgNzIgNzIgNzItMzIuMjM1IDcyLTcyUzEzNS43NjQgMCA5NiAwelxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZwYXRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3ZnXFx1MDAzRVxcdTAwM0NcXHUwMDJGc3VwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGdGhcXHUwMDNFXFx1MDAzQ3RoIHNjb3BlPVxcXCJjb2xcXFwiIGNvbHNwYW49XFxcIjJcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiaW5saW5lXFxcIlxcdTAwM0VTd2l0Y2hpbmcgU2V0dGluZ3MgKEh5YnJpZCBPbmx5KVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXZcIiArIChcIiBjbGFzcz1cXFwidG9vbHRpcC1pY29uXFxcIlwiK1wiIGRhdGEtaHRtbD1cXFwidHJ1ZVxcXCIgZGF0YS10b2dnbGU9XFxcInRvb2x0aXBcXFwiXCIrcHVnLmF0dHIoXCJ0aXRsZVwiLCB0aGlzLnRvb2x0aXBzLnN3aXRjaFZhbHVlLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDc3VwXFx1MDAzRVxcdTAwM0NzdmcgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiIGZvY3VzYWJsZT1cXFwiZmFsc2VcXFwiIGRhdGEtcHJlZml4PVxcXCJmYXNcXFwiIGRhdGEtaWNvbj1cXFwiaW5mb1xcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLWluZm8gZmEtdy02XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE5MiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTIwIDQyNC4yMjloMjBWMjc5Ljc3MUgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjEyYzAtMTEuMDQ2IDguOTU0LTIwIDIwLTIwaDExMmMxMS4wNDYgMCAyMCA4Ljk1NCAyMCAyMHYyMTIuMjI5aDIwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwVjQ5MmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjB2LTQ3Ljc3MWMwLTExLjA0NiA4Ljk1NC0yMCAyMC0yMHpNOTYgMEM1Ni4yMzUgMCAyNCAzMi4yMzUgMjQgNzJzMzIuMjM1IDcyIDcyIDcyIDcyLTMyLjIzNSA3Mi03MlMxMzUuNzY0IDAgOTYgMHpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRnN1cFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRnRoXFx1MDAzRVxcdTAwM0NcXHUwMDJGdHJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0aGVhZFxcdTAwM0VcXHUwMDNDdGJvZHkgZGF0YS1ob29rPVxcXCJlZGl0LXNwZWNpZXMtbW9kZVxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZ0Ym9keVxcdTAwM0VcXHUwMDNDXFx1MDAyRnRhYmxlXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NidXR0b24gY2xhc3M9XFxcImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGJveC1zaGFkb3dcXFwiIGRhdGEtaG9vaz1cXFwiYWRkLXNwZWNpZXNcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCJcXHUwMDNFQWRkIFNwZWNpZXNcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlOyIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXYgc3R5bGU9XFxcImJvcmRlcjogZmFsc2VcXFwiXFx1MDAzRVxcdTAwM0NsYWJlbFwiICsgKHB1Zy5hdHRyKFwiZm9yXCIsIHRoaXMubW9kZWwubmFtZSwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGhpcy5tb2RlbC5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGbGFiZWxcXHUwMDNFXFx1MDAzQ2lucHV0XCIgKyAoXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiXCIrcHVnLmF0dHIoXCJpZFwiLCB0aGlzLm1vZGVsLm5hbWUsIHRydWUsIHRydWUpK1wiIGRhdGEtaG9vaz1cXFwic3ViZG9tYWluXFxcIlwiKSArIFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ3NlY3Rpb24gY2xhc3M9XFxcInBhZ2VcXFwiXFx1MDAzRVxcdTAwM0NkaXZcXHUwMDNFXFx1MDAzQ2gyIGNsYXNzPVxcXCJpbmxpbmVcXFwiXFx1MDAzRU1vZGVsIEVkaXRvclxcdTAwM0NcXHUwMDJGaDJcXHUwMDNFXFx1MDAzQ2J1dHRvbiBjbGFzcz1cXFwiYmlnLXRpcCBidG4gaW5mb3JtYXRpb24tYnRuIGhlbHBcXFwiIGRhdGEtaG9vaz1cXFwiZWRpdC1tb2RlbC1oZWxwXFxcIlxcdTAwM0VcXHUwMDNDc3ZnIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBmb2N1c2FibGU9XFxcImZhbHNlXFxcIiBkYXRhLXByZWZpeD1cXFwiZmFyXFxcIiBkYXRhLWljb249XFxcInF1ZXN0aW9uLWNpcmNsZVxcXCIgY2xhc3M9XFxcInN2Zy1pbmxpbmUtLWZhIGZhLXF1ZXN0aW9uLWNpcmNsZSBmYS13LTE2XFxcIiByb2xlPVxcXCJpbWdcXFwiIHhtbG5zPVxcXCJodHRwOlxcdTAwMkZcXHUwMDJGd3d3LnczLm9yZ1xcdTAwMkYyMDAwXFx1MDAyRnN2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDUxMiA1MTJcXFwiXFx1MDAzRVxcdTAwM0NwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTI1NiA4QzExOS4wNDMgOCA4IDExOS4wODMgOCAyNTZjMCAxMzYuOTk3IDExMS4wNDMgMjQ4IDI0OCAyNDhzMjQ4LTExMS4wMDMgMjQ4LTI0OEM1MDQgMTE5LjA4MyAzOTIuOTU3IDggMjU2IDh6bTAgNDQ4Yy0xMTAuNTMyIDAtMjAwLTg5LjQzMS0yMDAtMjAwIDAtMTEwLjQ5NSA4OS40NzItMjAwIDIwMC0yMDAgMTEwLjQ5MSAwIDIwMCA4OS40NzEgMjAwIDIwMCAwIDExMC41My04OS40MzEgMjAwLTIwMCAyMDB6bTEwNy4yNDQtMjU1LjJjMCA2Ny4wNTItNzIuNDIxIDY4LjA4NC03Mi40MjEgOTIuODYzVjMwMGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyaC00NS42NDdjLTYuNjI3IDAtMTItNS4zNzMtMTItMTJ2LTguNjU5YzAtMzUuNzQ1IDI3LjEtNTAuMDM0IDQ3LjU3OS02MS41MTYgMTcuNTYxLTkuODQ1IDI4LjMyNC0xNi41NDEgMjguMzI0LTI5LjU3OSAwLTE3LjI0Ni0yMS45OTktMjguNjkzLTM5Ljc4NC0yOC42OTMtMjMuMTg5IDAtMzMuODk0IDEwLjk3Ny00OC45NDIgMjkuOTY5LTQuMDU3IDUuMTItMTEuNDYgNi4wNzEtMTYuNjY2IDIuMTI0bC0yNy44MjQtMjEuMDk4Yy01LjEwNy0zLjg3Mi02LjI1MS0xMS4wNjYtMi42NDQtMTYuMzYzQzE4NC44NDYgMTMxLjQ5MSAyMTQuOTQgMTEyIDI2MS43OTQgMTEyYzQ5LjA3MSAwIDEwMS40NSAzOC4zMDQgMTAxLjQ1IDg4Ljh6TTI5OCAzNjhjMCAyMy4xNTktMTguODQxIDQyLTQyIDQycy00Mi0xOC44NDEtNDItNDIgMTguODQxLTQyIDQyLTQyIDQyIDE4Ljg0MSA0MiA0MnpcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcGF0aFxcdTAwM0VcXHUwMDNDXFx1MDAyRnN2Z1xcdTAwM0VcXHUwMDNDXFx1MDAyRmJ1dHRvblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2XFx1MDAzRVxcdTAwM0NoNVxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aGlzLm1vZGVsLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZoNVxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibWVzaC1lZGl0b3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwic3BlY2llcy1lZGl0b3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwiaW5pdGlhbC1jb25kaXRpb25zLWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJwYXJhbWV0ZXJzLWVkaXRvci1jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJyZWFjdGlvbnMtZWRpdG9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcImV2ZW50cy1lZGl0b3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwicnVsZXMtZWRpdG9yLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcInNibWwtY29tcG9uZW50LWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBkYXRhLWhvb2s9XFxcIm1vZGVsLXNldHRpbmdzLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sbGFwc2VcXFwiIGRhdGEtaG9vaz1cXFwibW9kZWwtdGltZW91dC1tZXNzYWdlXFxcIlxcdTAwM0VcXHUwMDNDcCBjbGFzcz1cXFwidGV4dC13YXJuaW5nXFxcIlxcdTAwM0VUaGUgbW9kZWwgdG9vayBsb25nZXIgdGhhbiA1IHNlY29uZHMgdG8gcnVuIGFuZCB0aW1lZCBvdXQhXFx1MDAzQ1xcdTAwMkZwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImVycm9yc1xcXCIgZGF0YS1ob29rPVxcXCJtb2RlbC1ydW4tZXJyb3ItY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDcCBjbGFzcz1cXFwidGV4dC1kYW5nZXJcXFwiIGRhdGEtaG9vaz1cXFwibW9kZWwtcnVuLWVycm9yLW1lc3NhZ2VcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGRhdGEtaG9vaz1cXFwibW9kZWwtcnVuLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwic3Bpbm5lci1ib3JkZXJcXFwiIGRhdGEtaG9vaz1cXFwicGxvdC1sb2FkZXJcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgZGF0YS1ob29rPVxcXCJtb2RlbC1zdGF0ZS1idXR0b25zLWNvbnRhaW5lclxcXCJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWN0aW9uXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7IiwidmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0QWR2YW5jZWRTcGVjaWUucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zd2l0Y2hpbmctdG9sXScgOiAnc2V0U3dpdGNoaW5nVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXN3aXRjaGluZy1taW5dJyA6ICdzZXRTd2l0Y2hpbmdUeXBlJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3BlY2llLW1vZGVdJyA6ICdzZXRTcGVjaWVzTW9kZScsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBvcHRpb25EaWN0ID0ge1wiY29udGludW91c1wiOlwiQ29uY2VudHJhdGlvblwiLCBcImRpc2NyZXRlXCI6XCJQb3B1bGF0aW9uXCIsIFwiZHluYW1pY1wiOlwiSHlicmlkIENvbmNlbnRyYXRpb24vUG9wdWxhdGlvblwifVxuICAgIHZhciBtb2RlU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdtb2RlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGVzOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IFsnQ29uY2VudHJhdGlvbicsJ1BvcHVsYXRpb24nLCdIeWJyaWQgQ29uY2VudHJhdGlvbi9Qb3B1bGF0aW9uJ10sXG4gICAgICB2YWx1ZTogb3B0aW9uRGljdFt0aGlzLm1vZGVsLm1vZGVdLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KG1vZGVTZWxlY3RWaWV3LCBcInNwZWNpZS1tb2RlXCIpXG4gICAgaWYodGhpcy5tb2RlbC5pc1N3aXRjaFRvbCl7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10b2wnKSkucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgIH1lbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctbWluJykpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICB9XG4gICAgdGhpcy50b2dnbGVTd2l0Y2hpbmdTZXR0aW5ncygpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2V0U3BlY2llc01vZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHZhbHVlID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dFxuICAgIHZhciBtb2RlRGljdCA9IHtcIkNvbmNlbnRyYXRpb25cIjpcImNvbnRpbnVvdXNcIixcIlBvcHVsYXRpb25cIjpcImRpc2NyZXRlXCIsXCJIeWJyaWQgQ29uY2VudHJhdGlvbi9Qb3B1bGF0aW9uXCI6XCJkeW5hbWljXCJ9XG4gICAgdGhpcy5tb2RlbC5tb2RlID0gbW9kZURpY3RbdmFsdWVdXG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoJ3VwZGF0ZS1zcGVjaWVzJywgdGhpcy5tb2RlbC5jb21wSUQsIHRoaXMubW9kZWwsIGZhbHNlKTtcbiAgICB0aGlzLnRvZ2dsZVN3aXRjaGluZ1NldHRpbmdzKCk7XG4gIH0sXG4gIHNldFN3aXRjaGluZ1R5cGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5tb2RlbC5pc1N3aXRjaFRvbCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLXRvbCcpKS5pcyhcIjpjaGVja2VkXCIpO1xuICAgIHRoaXMudG9nZ2xlU3dpdGNoaW5nU2V0dGluZ3NJbnB1dCgpO1xuICB9LFxuICB0b2dnbGVTd2l0Y2hpbmdTZXR0aW5nc0lucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5tb2RlbC5pc1N3aXRjaFRvbCl7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10aHJlc2hvbGQnKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdG9sZXJhbmNlJykpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10b2xlcmFuY2UnKSkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdGhyZXNob2xkJykpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfVxuICB9LFxuICB0b2dnbGVTd2l0Y2hpbmdTZXR0aW5nczogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMubW9kZWwubW9kZSA9PT0gXCJkeW5hbWljXCIpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdG9sJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctbWluJykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgdGhpcy50b2dnbGVTd2l0Y2hpbmdTZXR0aW5nc0lucHV0KCk7XG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N3aXRjaGluZy10b2wnKSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLW1pbicpKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzd2l0Y2hpbmctdGhyZXNob2xkJykpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3dpdGNoaW5nLXRvbGVyYW5jZScpKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfVxuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0U3dpdGNoVG9sOiB7XG4gICAgICBob29rOiAnc3dpdGNoaW5nLXRvbGVyYW5jZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3N3aXRjaGluZy10b2xlcmFuY2UnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3N3aXRjaFRvbCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5zd2l0Y2hUb2wsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0U3dpdGNoTWluOiB7XG4gICAgICBob29rOiAnc3dpdGNoaW5nLXRocmVzaG9sZCcsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3N3aXRjaGluZy10aHJlc2hvbGQnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3N3aXRjaE1pbicsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5zd2l0Y2hNaW4sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRDdXN0b21TdG9pY2hTcGVjaWUucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0Vmlldy5leHRlbmQoe1xuICAvLyBTZWxlY3RWaWV3IGV4cGVjdHMgYSBzdHJpbmcgdGVtcGxhdGUsIHNvIHByZS1yZW5kZXIgaXRcbiAgdGVtcGxhdGU6IHRlbXBsYXRlKCksXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLnJhdGlvJyA6IHtcbiAgICAgIGhvb2s6ICdyYXRpbydcbiAgICB9XG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2Ugc2VsZWN0JyA6ICdzZWxlY3RDaGFuZ2VIYW5kbGVyJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1pbmNyZW1lbnRdJyA6ICdoYW5kbGVJbmNyZW1lbnQnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWRlY3JlbWVudF0nIDogJ2hhbmRsZURlY3JlbWVudCcsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAnZGVsZXRlU3BlY2llJ1xuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXJncykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBTZWxlY3RWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMubW9kZWwuc3BlY2llIHx8IG51bGw7XG4gICAgdGhpcy5pc1JlYWN0YW50cyA9IHRoaXMucGFyZW50LnBhcmVudC5pc1JlYWN0YW50cztcbiAgICB0aGlzLnJlYWN0aW9uVHlwZSA9IHRoaXMucGFyZW50LnBhcmVudC5yZWFjdGlvblR5cGU7XG4gICAgdGhpcy5zdG9pY2hTcGVjaWVzID0gdGhpcy5wYXJlbnQucGFyZW50LmNvbGxlY3Rpb247XG4gICAgdGhpcy5zdG9pY2hTcGVjaWVzLm9uKCdhZGQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnRvZ2dsZUluY3JlbWVudEJ1dHRvbigpO1xuICAgIH0pO1xuICAgIHRoaXMuc3RvaWNoU3BlY2llcy5vbigncmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi50b2dnbGVJbmNyZW1lbnRCdXR0b24oKTtcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgU2VsZWN0Vmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMpO1xuICAgIHRoaXMudG9nZ2xlSW5jcmVtZW50QnV0dG9uKCk7XG4gICAgdGhpcy50b2dnbGVEZWNyZW1lbnRCdXR0b24oKTtcbiAgfSxcbiAgc2VsZWN0Q2hhbmdlSGFuZGxlcjogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMuZ2V0U3BlY2llc0NvbGxlY3Rpb24oKTtcbiAgICB2YXIgcmVhY3Rpb25zID0gdGhpcy5nZXRSZWFjdGlvbnNDb2xsZWN0aW9uKCk7XG4gICAgdmFyIHNwZWNpZSA9IHNwZWNpZXMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICByZXR1cm4gbS5uYW1lID09PSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0O1xuICAgIH0pWzBdO1xuICAgIHRoaXMubW9kZWwuc3BlY2llID0gc3BlY2llO1xuICAgIHRoaXMudmFsdWUgPSBzcGVjaWU7XG4gICAgcmVhY3Rpb25zLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC50cmlnZ2VyKCdjaGFuZ2UtcmVhY3Rpb24nKVxuICB9LFxuICBnZXRTcGVjaWVzQ29sbGVjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXM7XG4gIH0sXG4gIGdldFJlYWN0aW9uc0NvbGxlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uO1xuICB9LFxuICBoYW5kbGVJbmNyZW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLnZhbGlkYXRlUmF0aW9JbmNyZW1lbnQoKSl7XG4gICAgICB0aGlzLm1vZGVsLnJhdGlvKys7XG4gICAgICB0aGlzLnRvZ2dsZUluY3JlbWVudEJ1dHRvbigpO1xuICAgICAgdGhpcy5wYXJlbnQucGFyZW50LnRvZ2dsZUFkZFNwZWNpZUJ1dHRvbigpO1xuICAgICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC50cmlnZ2VyKCdjaGFuZ2UtcmVhY3Rpb24nKVxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZURlY3JlbWVudEJ1dHRvbigpO1xuICB9LFxuICB2YWxpZGF0ZVJhdGlvSW5jcmVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5zdG9pY2hTcGVjaWVzLmxlbmd0aCA8IDIgJiYgdGhpcy5tb2RlbC5yYXRpbyA8IDIpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBpZih0aGlzLnJlYWN0aW9uVHlwZSAhPT0gJ2N1c3RvbS1tYXNzYWN0aW9uJylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGlmKCF0aGlzLmlzUmVhY3RhbnRzKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICB0b2dnbGVJbmNyZW1lbnRCdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICBpZighdGhpcy52YWxpZGF0ZVJhdGlvSW5jcmVtZW50KCkpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdpbmNyZW1lbnQnKSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9ZWxzZXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnaW5jcmVtZW50JykpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIH1cbiAgfSxcbiAgdG9nZ2xlRGVjcmVtZW50QnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5tb2RlbC5yYXRpbyA8PSAxKVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdkZWNyZW1lbnQnKSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICBlbHNlXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2RlY3JlbWVudCcpKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgfSxcbiAgaGFuZGxlRGVjcmVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5yYXRpby0tO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgICB0aGlzLnRvZ2dsZURlY3JlbWVudEJ1dHRvbigpO1xuICAgIGlmKHRoaXMudmFsaWRhdGVSYXRpb0luY3JlbWVudCgpKXtcbiAgICAgIHRoaXMudG9nZ2xlSW5jcmVtZW50QnV0dG9uKCk7XG4gICAgICB0aGlzLnBhcmVudC5wYXJlbnQudG9nZ2xlQWRkU3BlY2llQnV0dG9uKCk7XG4gICAgfVxuICB9LFxuICBkZWxldGVTcGVjaWU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnRyaWdnZXIoJ2NoYW5nZS1yZWFjdGlvbicpXG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVN0b2ljaFNwZWNpZSh0aGlzLm1vZGVsKTtcbiAgICB0aGlzLnBhcmVudC5wYXJlbnQudG9nZ2xlQWRkU3BlY2llQnV0dG9uKCk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRFdmVudEFzc2lnbm1lbnQucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ3JlbW92ZUFzc2lnbm1lbnQnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1ldmVudC1hc3NpZ25tZW50LXZhcmlhYmxlXScgOiAnc2VsZWN0QXNzaWdubWVudFZhcmlhYmxlJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHZhciB2YXJpYWJsZVNlbGVjdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAndmFyaWFibGUnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZXM6ICdjaWQnLFxuICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnZhcmlhYmxlLm5hbWUsXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcodmFyaWFibGVTZWxlY3RWaWV3LCAnZXZlbnQtYXNzaWdubWVudC12YXJpYWJsZScpO1xuICAgIHZhciBpbnB1dEZpZWxkID0gdGhpcy5xdWVyeUJ5SG9vaygnZXZlbnQtYXNzaWdubWVudC1FeHByZXNzaW9uJykuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMV07XG4gICAgJChpbnB1dEZpZWxkKS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgXCItLS1ObyBFeHByZXNzaW9uIEVudGVyZWQtLS1cIik7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW1vdmVBc3NpZ25tZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlRXZlbnRBc3NpZ25tZW50KHRoaXMubW9kZWwpXG4gIH0sXG4gIGdldE9wdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3BlY2llcyA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcztcbiAgICB2YXIgcGFyYW1ldGVycyA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycztcbiAgICB2YXIgc3BlY2llc05hbWVzID0gc3BlY2llcy5tYXAoZnVuY3Rpb24gKHNwZWNpZSkgeyByZXR1cm4gc3BlY2llLm5hbWUgfSk7XG4gICAgdmFyIHBhcmFtZXRlck5hbWVzID0gcGFyYW1ldGVycy5tYXAoZnVuY3Rpb24gKHBhcmFtZXRlcikgeyByZXR1cm4gcGFyYW1ldGVyLm5hbWUgfSk7XG4gICAgcmV0dXJuIHNwZWNpZXNOYW1lcy5jb25jYXQocGFyYW1ldGVyTmFtZXMpO1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBzZWxlY3RBc3NpZ25tZW50VmFyaWFibGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXM7XG4gICAgdmFyIHBhcmFtZXRlcnMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnM7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIGV2ZW50VmFyID0gc3BlY2llcy5maWx0ZXIoZnVuY3Rpb24gKHNwZWNpZSkge1xuICAgICAgaWYoc3BlY2llLm5hbWUgPT09IHZhbCkge1xuICAgICAgICByZXR1cm4gc3BlY2llO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKCFldmVudFZhci5sZW5ndGgpIHtcbiAgICAgIGV2ZW50VmFyID0gcGFyYW1ldGVycy5maWx0ZXIoZnVuY3Rpb24gKHBhcmFtZXRlcikge1xuICAgICAgICBpZihwYXJhbWV0ZXIubmFtZSA9PT0gdmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmFtZXRlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMubW9kZWwudmFyaWFibGUgPSBldmVudFZhclswXTtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24udHJpZ2dlcignY2hhbmdlJyk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXRBc3NpZ25tZW50RXhwcmVzc2lvbjoge1xuICAgICAgaG9vazogJ2V2ZW50LWFzc2lnbm1lbnQtRXhwcmVzc2lvbicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2V2ZW50LWFzc2lnbm1lbnQtZXhwcmVzc2lvbicsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ2V4cHJlc3Npb24nLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZXhwcmVzc2lvbixcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0RnVuY3Rpb25EZWZpbml0aW9uLnB1ZycpO1xuXG5sZXQgZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbk1vZGFsSHRtbCA9IChmdW5jdGlvbkRlZmluaXRpb25OYW1lLCBhbm5vdGF0aW9uKSA9PiB7XG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cImZ1bmN0aW9uRGVmaW5pdGlvbkFubm90YXRpb25Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+QW5ub3RhdGlvbiBmb3IgJHtmdW5jdGlvbkRlZmluaXRpb25OYW1lfTwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8c3BhbiBmb3I9XCJmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uSW5wdXRcIj5Bbm5vdGF0aW9uOiA8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImZ1bmN0aW9uRGVmaW5pdGlvbkFubm90YXRpb25JbnB1dFwiIG5hbWU9XCJmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uSW5wdXRcIiBzaXplPVwiMzBcIiBhdXRvZm9jdXMgdmFsdWU9XCIke2Fubm90YXRpb259XCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgb2stbW9kZWwtYnRuXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAncmVtb3ZlRnVuY3Rpb25EZWZpbml0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LWFubm90YXRpb24tYnRuXScgOiAnZWRpdEFubm90YXRpb24nLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICBlZGl0QW5ub3RhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbmFtZSA9IHRoaXMubW9kZWwubmFtZTtcbiAgICB2YXIgYW5ub3RhdGlvbiA9IHRoaXMubW9kZWwuYW5ub3RhdGlvbjtcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZnVuY3Rpb25EZWZpbml0aW9uQW5ub3RhdGlvbk1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uTW9kYWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgbGV0IG1vZGFsID0gJChmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uTW9kYWxIdG1sKG5hbWUsIGFubm90YXRpb24pKS5tb2RhbCgpO1xuICAgIGxldCBva0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uTW9kYWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmdW5jdGlvbkRlZmluaXRpb25Bbm5vdGF0aW9uTW9kYWwgI2Z1bmN0aW9uRGVmaW5pdGlvbkFubm90YXRpb25JbnB1dCcpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT09IDEzKXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb2tCdG4uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBva0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLm1vZGVsLmFubm90YXRpb24gPSBpbnB1dC52YWx1ZTtcbiAgICAgIHNlbGYucGFyZW50LnJlbmRlckVkaXJGdW5jdGlvbkRlZmluaXRpb25WaWV3KCk7XG4gICAgICBtb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgIH0pO1xuICB9LFxuICByZW1vdmVGdW5jdGlvbkRlZmluaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucmVtb3ZlKHRoaXMubW9kZWwpO1xuICB9LFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbnZhciBTY2F0dGVyRGV0YWlscyA9IHJlcXVpcmUoJy4vZWRpdC1zY2F0dGVyLWRldGFpbHMnKTtcbnZhciBQbGFjZURldGFpbHMgPSByZXF1aXJlKCcuL2VkaXQtcGxhY2UtZGV0YWlscycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0SW5pdGlhbENvbmRpdGlvbi5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAncmVtb3ZlSW5pdGlhbENvbmRpdGlvbicsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWluaXRpYWwtY29uZGl0aW9uLXR5cGVdJyA6ICdzZWxlY3RJbml0aWFsQ29uZGl0aW9uVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWluaXRpYWwtY29uZGl0aW9uLXNwZWNpZXNdJyA6ICdzZWxlY3RJbml0aWFsQ29uZGl0aW9uU3BlY2llcycsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvcHRpb25zID0gWydTY2F0dGVyJywgJ1BsYWNlJywgJ0Rpc3RyaWJ1dGUgVW5pZm9ybWx5IHBlciBWb3hlbCddO1xuICAgIHZhciB0eXBlU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICd0eXBlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGVzOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICB2YWx1ZTogc2VsZi5tb2RlbC50eXBlLFxuICAgIH0pO1xuICAgIHZhciBzcGVjaWVzU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdzcGVjaWUnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICB0ZXh0QXR0cmlidXRlOiAnbmFtZScsXG4gICAgICBlYWdlclZhbGlkYXRlOiB0cnVlLFxuICAgICAgb3B0aW9uczogdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLFxuICAgICAgLy8gRm9yIG5ldyByZWFjdGlvbnMgKHdpdGggbm8gcmF0ZS5uYW1lKSBqdXN0IHVzZSB0aGUgZmlyc3QgcGFyYW1ldGVyIGluIHRoZSBQYXJhbWV0ZXJzIGNvbGxlY3Rpb25cbiAgICAgIC8vIEVsc2UgZmV0Y2ggdGhlIHJpZ2h0IFBhcmFtZXRlciBmcm9tIFBhcmFtZXRlcnMgYmFzZWQgb24gZXhpc3RpbmcgcmF0ZVxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwuc3BlY2llLm5hbWUgPyB0aGlzLmdldFNwZWNpZUZyb21TcGVjaWVzKHRoaXMubW9kZWwuc3BlY2llLm5hbWUpIDogdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLmF0KDApLFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyRGV0YWlsc1ZpZXcoKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh0eXBlU2VsZWN0VmlldywgJ2luaXRpYWwtY29uZGl0aW9uLXR5cGUnKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzcGVjaWVzU2VsZWN0VmlldywgJ2luaXRpYWwtY29uZGl0aW9uLXNwZWNpZXMnKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIHJlbmRlckRldGFpbHNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5kZXRhaWxzVmlldykge1xuICAgICAgdGhpcy5kZXRhaWxzVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdmFyIEluaXRpYWxDb25kaXRpb25EZXRhaWxzID0gdGhpcy5tb2RlbC50eXBlID09PSAnUGxhY2UnID8gUGxhY2VEZXRhaWxzIDogU2NhdHRlckRldGFpbHNcbiAgICB0aGlzLmRldGFpbHNWaWV3ID0gbmV3IEluaXRpYWxDb25kaXRpb25EZXRhaWxzKHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMuY29sbGVjdGlvbixcbiAgICAgIG1vZGVsOiB0aGlzLm1vZGVsLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuZGV0YWlsc1ZpZXcsICdpbml0aWFsLWNvbmRpdGlvbi1kZXRhaWxzJyk7XG4gIH0sXG4gIGdldFNwZWNpZUZyb21TcGVjaWVzOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLmZpbHRlcihmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICByZXR1cm4gc3BlY2llLm5hbWUgPT09IG5hbWU7XG4gICAgfSlbMF07XG4gICAgcmV0dXJuIHNwZWNpZXM7XG4gIH0sXG4gIHJlbW92ZUluaXRpYWxDb25kaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucmVtb3ZlSW5pdGlhbENvbmRpdGlvbih0aGlzLm1vZGVsKTtcbiAgfSxcbiAgc2VsZWN0SW5pdGlhbENvbmRpdGlvblR5cGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGN1cnJlbnRUeXBlID0gdGhpcy5tb2RlbC50eXBlO1xuICAgIHZhciBuZXdUeXBlID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB0aGlzLm1vZGVsLnR5cGUgPSBuZXdUeXBlO1xuICAgIGlmKGN1cnJlbnRUeXBlID09PSBcIlBsYWNlXCIgfHwgbmV3VHlwZSA9PT0gXCJQbGFjZVwiKXtcbiAgICAgIHRoaXMucmVuZGVyRGV0YWlsc1ZpZXcoKTtcbiAgICB9XG4gIH0sXG4gIHNlbGVjdEluaXRpYWxDb25kaXRpb25TcGVjaWVzOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBuYW1lID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB2YXIgc3BlY2llID0gdGhpcy5nZXRTcGVjaWVGcm9tU3BlY2llcyhuYW1lKTtcbiAgICB0aGlzLm1vZGVsLnNwZWNpZSA9IHNwZWNpZSB8fCB0aGlzLm1vZGVsLnNwZWNpZTtcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0UmVhY3Rpb25WYXIucHVnJyk7XG5cbmxldCBwYXJhbWV0ZXJBbm5vdGF0aW9uTW9kYWxIdG1sID0gKHBhcmFtZXRlck5hbWUsIGFubm90YXRpb24pID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwicGFyYW1ldGVyQW5ub3RhdGlvbk1vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5Bbm5vdGF0aW9uIGZvciAke3BhcmFtZXRlck5hbWV9PC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxzcGFuIGZvcj1cInBhcmFtZXRlckFubm90YXRpb25JbnB1dFwiPkFubm90YXRpb246IDwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicGFyYW1ldGVyQW5ub3RhdGlvbklucHV0XCIgbmFtZT1cInBhcmFtZXRlckFubm90YXRpb25JbnB1dFwiIHNpemU9XCIzMFwiIGF1dG9mb2N1cyB2YWx1ZT1cIiR7YW5ub3RhdGlvbn1cIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBvay1tb2RlbC1idG5cIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5pblVzZSc6IHtcbiAgICAgIGhvb2s6ICdyZW1vdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2Rpc2FibGVkJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LWFubm90YXRpb24tYnRuXScgOiAnZWRpdEFubm90YXRpb24nLFxuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ3JlbW92ZVBhcmFtZXRlcicsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWlucHV0LW5hbWUtY29udGFpbmVyXScgOiAnc2V0UGFyYW1ldGVyTmFtZScsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgJChkb2N1bWVudCkub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJ1thdXRvZm9jdXNdJywgZS50YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgaWYoIXRoaXMubW9kZWwuYW5ub3RhdGlvbil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2VkaXQtYW5ub3RhdGlvbi1idG4nKSkudGV4dCgnQWRkJylcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW1vdmVQYXJhbWV0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmVQYXJhbWV0ZXIodGhpcy5tb2RlbCk7XG4gIH0sXG4gIGVkaXRBbm5vdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBuYW1lID0gdGhpcy5tb2RlbC5uYW1lO1xuICAgIHZhciBhbm5vdGF0aW9uID0gdGhpcy5tb2RlbC5hbm5vdGF0aW9uO1xuICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYXJhbWV0ZXJBbm5vdGF0aW9uTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhcmFtZXRlckFubm90YXRpb25Nb2RhbCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKHBhcmFtZXRlckFubm90YXRpb25Nb2RhbEh0bWwobmFtZSwgYW5ub3RhdGlvbikpLm1vZGFsKCk7XG4gICAgbGV0IG9rQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhcmFtZXRlckFubm90YXRpb25Nb2RhbCAub2stbW9kZWwtYnRuJyk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhcmFtZXRlckFubm90YXRpb25Nb2RhbCAjcGFyYW1ldGVyQW5ub3RhdGlvbklucHV0Jyk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYoZXZlbnQua2V5Q29kZSA9PT0gMTMpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBva0J0bi5jbGljaygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9rQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYubW9kZWwuYW5ub3RhdGlvbiA9IGlucHV0LnZhbHVlO1xuICAgICAgc2VsZi5wYXJlbnQucmVuZGVyRWRpdFBhcmFtZXRlcigpO1xuICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICB9KTtcbiAgfSxcbiAgc2V0UGFyYW1ldGVyTmFtZTogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm1vZGVsLm5hbWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24udHJpZ2dlcigndXBkYXRlLXBhcmFtZXRlcnMnLCB0aGlzLm1vZGVsLmNvbXBJRCwgdGhpcy5tb2RlbCk7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoJ3JlbW92ZScpXG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXROYW1lOiB7XG4gICAgICBob29rOiAnaW5wdXQtbmFtZS1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLm5hbWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFZhbHVlOiB7XG4gICAgICBob29rOiAnaW5wdXQtdmFsdWUtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnZXhwcmVzc2lvbicsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ2V4cHJlc3Npb24nLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZXhwcmVzc2lvbixcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0UGxhY2VEZXRhaWxzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5jb3VudCc6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBob29rOiAnY291bnQtY29udGFpbmVyJyxcbiAgICB9LFxuICAgICdtb2RlbC54Jzoge1xuICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgIGhvb2s6ICd4LWNvbnRhaW5lcicsXG4gICAgfSxcbiAgICAnbW9kZWwueSc6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBob29rOiAneS1jb250YWluZXInLFxuICAgIH0sXG4gICAgJ21vZGVsLnonOiB7XG4gICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgaG9vazogJ3otY29udGFpbmVyJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXRDb3VudDoge1xuICAgICAgaG9vazogJ2NvdW50LWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2NvdW50JyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdjb3VudCcsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5jb3VudCxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRYOiB7XG4gICAgICBob29rOiAneC1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVzOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdYJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICd4JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLngsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0WToge1xuICAgICAgaG9vazogJ3ktY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnWScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAneScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC55LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFo6IHtcbiAgICAgIGhvb2s6ICd6LWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ1onLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3onLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwueSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTZWxlY3RWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXNlbGVjdC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRSdWxlLnB1ZycpO1xuXG5sZXQgcnVsZUFubm90YXRpb25Nb2RhbEh0bWwgPSAocnVsZU5hbWUsIGFubm90YXRpb24pID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwicnVsZUFubm90YXRpb25Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+QW5ub3RhdGlvbiBmb3IgJHtydWxlTmFtZX08L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgPHNwYW4gZm9yPVwicnVsZUFubm90YXRpb25JbnB1dFwiPkFubm90YXRpb246IDwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicnVsZUFubm90YXRpb25JbnB1dFwiIG5hbWU9XCJydWxlQW5ub3RhdGlvbklucHV0XCIgc2l6ZT1cIjMwXCIgYXV0b2ZvY3VzIHZhbHVlPVwiJHthbm5vdGF0aW9ufVwiPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IG9rLW1vZGVsLWJ0blwiPk9LPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1ydWxlLXR5cGVdJyA6ICdzZWxlY3RSdWxlVHlwZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXJ1bGUtdmFyaWFibGVdJyA6ICdzZWxlY3RSdWxlVmFyaWFibGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtYW5ub3RhdGlvbi1idG5dJyA6ICdlZGl0QW5ub3RhdGlvbicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cmVtb3ZlXScgOiAncmVtb3ZlUnVsZScsXG4gIH0sXG4gIGluaXRpYWlsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFpbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIHZhciBpbnB1dEZpZWxkID0gdGhpcy5xdWVyeUJ5SG9vaygncnVsZS1leHByZXNzaW9uJykuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMV07XG4gICAgJChpbnB1dEZpZWxkKS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgXCItLS1ObyBFeHByZXNzaW9uIEVudGVyZWQtLS1cIik7XG4gICAgdmFyIHZhck9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICB2YXIgdHlwZU9wdGlvbnMgPSBbJ1JhdGUgUnVsZScsICdBc3NpZ25tZW50IFJ1bGUnXVxuICAgIHZhciB0eXBlU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICd0eXBlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGVzOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IHR5cGVPcHRpb25zLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwudHlwZSxcbiAgICB9KTtcbiAgICB2YXIgdmFyaWFibGVTZWxlY3RWaWV3ID0gbmV3IFNlbGVjdFZpZXcoe1xuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGVzOiAnY2lkJyxcbiAgICAgIG9wdGlvbnM6IHZhck9wdGlvbnMsXG4gICAgICB2YWx1ZTogdGhpcy5tb2RlbC52YXJpYWJsZS5uYW1lLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHR5cGVTZWxlY3RWaWV3LCBcInJ1bGUtdHlwZVwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3Vidmlldyh2YXJpYWJsZVNlbGVjdFZpZXcsICdydWxlLXZhcmlhYmxlJyk7XG4gICAgJChkb2N1bWVudCkub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJ1thdXRvZm9jdXNdJywgZS50YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgaWYoIXRoaXMubW9kZWwuYW5ub3RhdGlvbil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2VkaXQtYW5ub3RhdGlvbi1idG4nKSkudGV4dCgnQWRkJylcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgZWRpdEFubm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLm1vZGVsLm5hbWU7XG4gICAgdmFyIGFubm90YXRpb24gPSB0aGlzLm1vZGVsLmFubm90YXRpb247XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3J1bGVBbm5vdGF0aW9uTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3J1bGVBbm5vdGF0aW9uTW9kYWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgbGV0IG1vZGFsID0gJChydWxlQW5ub3RhdGlvbk1vZGFsSHRtbChuYW1lLCBhbm5vdGF0aW9uKSkubW9kYWwoKTtcbiAgICBsZXQgb2tCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcnVsZUFubm90YXRpb25Nb2RhbCAub2stbW9kZWwtYnRuJyk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3J1bGVBbm5vdGF0aW9uTW9kYWwgI3J1bGVBbm5vdGF0aW9uSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5tb2RlbC5hbm5vdGF0aW9uID0gaW5wdXQudmFsdWU7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJSdWxlcygpO1xuICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0T3B0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzcGVjaWVzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzO1xuICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzO1xuICAgIHZhciBzcGVjaWVzTmFtZXMgPSBzcGVjaWVzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7IHJldHVybiBzcGVjaWUubmFtZSB9KTtcbiAgICB2YXIgcGFyYW1ldGVyTmFtZXMgPSBwYXJhbWV0ZXJzLm1hcChmdW5jdGlvbiAocGFyYW1ldGVyKSB7IHJldHVybiBwYXJhbWV0ZXIubmFtZSB9KTtcbiAgICByZXR1cm4gc3BlY2llc05hbWVzLmNvbmNhdChwYXJhbWV0ZXJOYW1lcyk7XG4gIH0sXG4gIHJlZ2lzdGVyUmVuZGVyU3VidmlldzogZnVuY3Rpb24gKHZpZXcsIGhvb2spIHtcbiAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcbiAgICB0aGlzLnJlbmRlclN1YnZpZXcodmlldywgdGhpcy5xdWVyeUJ5SG9vayhob29rKSk7XG4gIH0sXG4gIHNlbGVjdFJ1bGVUeXBlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0eXBlID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB0aGlzLm1vZGVsLnR5cGUgPSB0eXBlO1xuICB9LFxuICBzZWxlY3RSdWxlVmFyaWFibGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXM7XG4gICAgdmFyIHBhcmFtZXRlcnMgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnM7XG4gICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHJ1bGVWYXIgPSBzcGVjaWVzLmZpbHRlcihmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICBpZihzcGVjaWUubmFtZSA9PT0gdmFsKSB7XG4gICAgICAgIHJldHVybiBzcGVjaWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoIXJ1bGVWYXIubGVuZ3RoKSB7XG4gICAgICBydWxlVmFyID0gcGFyYW1ldGVycy5maWx0ZXIoZnVuY3Rpb24gKHBhcmFtZXRlcikge1xuICAgICAgICBpZihwYXJhbWV0ZXIubmFtZSA9PT0gdmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcmFtZXRlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMubW9kZWwudmFyaWFibGUgPSBydWxlVmFyWzBdO1xuICB9LFxuICByZW1vdmVSdWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnJlbW92ZVJ1bGUodGhpcy5tb2RlbCk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXROYW1lOiB7XG4gICAgICBob29rOiAncnVsZS1uYW1lJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcgKHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3J1bGUtbmFtZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy5uYW1lVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICduYW1lJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLm5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0UnVsZToge1xuICAgICAgaG9vazogJ3J1bGUtZXhwcmVzc2lvbicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3ICh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAncnVsZS1leHByZXNzaW9uJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6ICcnLFxuICAgICAgICAgIG1vZGVsS2V5OiAnZXhwcmVzc2lvbicsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5leHByZXNzaW9uLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0U2NhdHRlckRldGFpbHMucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmNvdW50Jzoge1xuICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgIGhvb2s6ICdjb3VudC1jb250YWluZXInLFxuICAgIH0sXG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1zdWJkb21haW4tY29udGFpbmVyXScgOiAnc2VsZWN0SW5pdGlhbENvbmRpdGlvblN1YmRvbWFpbicsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHN1YmRvbWFpblNlbGVjdFZpZXcgPSBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICBsYWJlbDogJycsXG4gICAgICBuYW1lOiAnc3ViZG9tYWluJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgdGV4dEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgZWFnZXJWYWxpZGF0ZTogdHJ1ZSxcbiAgICAgIG9wdGlvbnM6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMsXG4gICAgICB2YWx1ZTogdGhpcy5tb2RlbC5zdWJkb21haW4gPyB0aGlzLmdldFN1YmRvbWFpbkZyb21TdWJkb21haW5zKHRoaXMubW9kZWwuc3ViZG9tYWluKSA6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMuYXQoMClcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyU3VidmlldyhzdWJkb21haW5TZWxlY3RWaWV3LCAnc3ViZG9tYWluLWNvbnRhaW5lcicpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgc2VsZWN0SW5pdGlhbENvbmRpdGlvblN1YmRvbWFpbjogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgbmFtZSA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgdmFyIHN1YmRvbWFpbiA9IHRoaXMuZ2V0U3ViZG9tYWluRnJvbVN1YmRvbWFpbnMobmFtZSk7XG4gICAgdGhpcy5tb2RlbC5zdWJkb21haW4gPSBzdWJkb21haW4ubmFtZSB8fCB0aGlzLm1vZGVsLnN1YmRvbWFpbjtcbiAgfSxcbiAgZ2V0U3ViZG9tYWluRnJvbVN1YmRvbWFpbnM6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHN1YmRvbWFpbiA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMubW9kZWxzLmZpbHRlcihmdW5jdGlvbiAoc3ViZG9tYWluKSB7XG4gICAgICByZXR1cm4gc3ViZG9tYWluLm5hbWUgPT09IG5hbWU7XG4gICAgfSlbMF07XG4gICAgcmV0dXJuIHN1YmRvbWFpbjtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dENvdW50OiB7XG4gICAgICBob29rOiAnY291bnQtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnY291bnQnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ2NvdW50JyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLmNvdW50LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIElucHV0VmlldyA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBTdWJkb21haW5zVmlldyA9IHJlcXVpcmUoJy4vc3ViZG9tYWluJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRTcGF0aWFsU3BlY2llLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5pblVzZSc6IHtcbiAgICAgIGhvb2s6ICdyZW1vdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2Rpc2FibGVkJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZW1vdmVdJyA6ICdyZW1vdmVTcGVjaWUnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5iYXNlTW9kZWwgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgIHRoaXMuYmFzZU1vZGVsLm9uKCdtZXNoLXVwZGF0ZScsIHRoaXMudXBkYXRlRGVmYXVsdFN1YmRvbWFpbnMsIHRoaXMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlclN1YmRvbWFpbnMoKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlbW92ZVNwZWNpZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVNwZWNpZSh0aGlzLm1vZGVsKTtcbiAgfSxcbiAgdXBkYXRlRGVmYXVsdFN1YmRvbWFpbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLnN1YmRvbWFpbnMgPSB0aGlzLmJhc2VNb2RlbC5tZXNoU2V0dGluZ3MudW5pcXVlU3ViZG9tYWlucy5tYXAoZnVuY3Rpb24gKG1vZGVsKSB7cmV0dXJuIG1vZGVsLm5hbWU7IH0pO1xuICAgIHRoaXMucmVuZGVyU3ViZG9tYWlucygpO1xuICB9LFxuICByZW5kZXJTdWJkb21haW5zOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5zdWJkb21haW5zVmlldylcbiAgICAgIHRoaXMuc3ViZG9tYWluc1ZpZXcucmVtb3ZlKCk7XG4gICAgdmFyIHN1YmRvbWFpbnMgPSB0aGlzLmJhc2VNb2RlbC5tZXNoU2V0dGluZ3MudW5pcXVlU3ViZG9tYWlucztcbiAgICB0aGlzLnN1YmRvbWFpbnNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgc3ViZG9tYWlucyxcbiAgICAgIFN1YmRvbWFpbnNWaWV3LFxuICAgICAgdGhpcy5xdWVyeUJ5SG9vaygnc3ViZG9tYWlucycpXG4gICAgKTtcbiAgfSxcbiAgdXBkYXRlU3ViZG9tYWluczogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICBpZihlbGVtZW50Lm5hbWUgPT0gJ3N1YmRvbWFpbicpIHtcbiAgICAgIHZhciBzdWJkb21haW4gPSBlbGVtZW50LnZhbHVlLm1vZGVsO1xuICAgICAgdmFyIGNoZWNrZWQgPSBlbGVtZW50LnZhbHVlLmNoZWNrZWQ7XG4gICAgICBpZihjaGVja2VkKVxuICAgICAgICB0aGlzLm1vZGVsLnN1YmRvbWFpbnMgPSBfLnVuaW9uKHRoaXMubW9kZWwuc3ViZG9tYWlucywgW3N1YmRvbWFpbi5uYW1lXSk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMubW9kZWwuc3ViZG9tYWlucyA9IF8uZGlmZmVyZW5jZSh0aGlzLm1vZGVsLnN1YmRvbWFpbnMsIFtzdWJkb21haW4ubmFtZV0pO1xuICAgIH1cbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dE5hbWU6IHtcbiAgICAgIGhvb2s6ICdpbnB1dC1uYW1lLWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMubmFtZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnbmFtZScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFZhbHVlOiB7XG4gICAgICBob29rOiAnaW5wdXQtZGlmZnVzaW9uLWNvZWZmLWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ2RpZmZ1c2lvbiBjb2VmZicsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnZGlmZnVzaW9uQ29lZmYnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZGlmZnVzaW9uQ29lZmYsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2VkaXRSZWFjdGlvblZhci5wdWcnKTtcblxubGV0IHNwZWNpZXNBbm5vdGF0aW9uTW9kYWxIdG1sID0gKHNwZWNpZXNOYW1lLCBhbm5vdGF0aW9uKSA9PiB7XG4gIHJldHVybiBgXG4gICAgPGRpdiBpZD1cInNwZWNpZXNBbm5vdGF0aW9uTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkFubm90YXRpb24gZm9yICR7c3BlY2llc05hbWV9PC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxzcGFuIGZvcj1cInNwZWNpZXNBbm5vdGF0aW9uSW5wdXRcIj5Bbm5vdGF0aW9uOiA8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInNwZWNpZXNBbm5vdGF0aW9uSW5wdXRcIiBuYW1lPVwic3BlY2llc0Fubm90YXRpb25JbnB1dFwiIHNpemU9XCIzMFwiIGF1dG9mb2N1cyB2YWx1ZT1cIiR7YW5ub3RhdGlvbn1cIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBvay1tb2RlbC1idG5cIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5pblVzZSc6IHtcbiAgICAgIGhvb2s6ICdyZW1vdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ2Rpc2FibGVkJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1lZGl0LWFubm90YXRpb24tYnRuXScgOiAnZWRpdEFubm90YXRpb24nLFxuICAgICdjbGljayBbZGF0YS1ob29rPXJlbW92ZV0nIDogJ3JlbW92ZVNwZWNpZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWlucHV0LW5hbWUtY29udGFpbmVyXScgOiAnc2V0U3BlY2llc05hbWUnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKCdbYXV0b2ZvY3VzXScsIGUudGFyZ2V0KS5mb2N1cygpO1xuICAgIH0pO1xuICAgIGlmKCF0aGlzLm1vZGVsLmFubm90YXRpb24pe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdlZGl0LWFubm90YXRpb24tYnRuJykpLnRleHQoJ0FkZCcpXG4gICAgfVxuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIHJlbW92ZVNwZWNpZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVNwZWNpZSh0aGlzLm1vZGVsKTtcbiAgfSxcbiAgc2V0U3BlY2llc05hbWU6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5tb2RlbC5uYW1lID0gZS50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoJ3VwZGF0ZS1zcGVjaWVzJywgdGhpcy5tb2RlbC5jb21wSUQsIHRoaXMubW9kZWwsIHRydWUpO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi50cmlnZ2VyKCdyZW1vdmUnKTtcbiAgfSxcbiAgZWRpdEFubm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLm1vZGVsLm5hbWU7XG4gICAgdmFyIGFubm90YXRpb24gPSB0aGlzLm1vZGVsLmFubm90YXRpb247XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NwZWNpZXNBbm5vdGF0aW9uTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NwZWNpZXNBbm5vdGF0aW9uTW9kYWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgbGV0IG1vZGFsID0gJChzcGVjaWVzQW5ub3RhdGlvbk1vZGFsSHRtbChuYW1lLCBhbm5vdGF0aW9uKSkubW9kYWwoKTtcbiAgICBsZXQgb2tCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3BlY2llc0Fubm90YXRpb25Nb2RhbCAub2stbW9kZWwtYnRuJyk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NwZWNpZXNBbm5vdGF0aW9uTW9kYWwgI3NwZWNpZXNBbm5vdGF0aW9uSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5tb2RlbC5hbm5vdGF0aW9uID0gaW5wdXQudmFsdWU7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJFZGl0U3BlY2llc1ZpZXcoKTtcbiAgICAgIG1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgfSk7XG4gIH0sXG4gIHN1YnZpZXdzOiB7XG4gICAgaW5wdXROYW1lOiB7XG4gICAgICBob29rOiAnaW5wdXQtbmFtZS1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLm5hbWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJycsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBpbnB1dFZhbHVlOiB7XG4gICAgICBob29rOiAnaW5wdXQtdmFsdWUtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAndmFsdWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3ZhbHVlJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgU2VsZWN0VmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1zZWxlY3QtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9lZGl0U3RvaWNoU3BlY2llLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdFZpZXcuZXh0ZW5kKHtcbiAgLy8gU2VsZWN0VmlldyBleHBlY3RzIGEgc3RyaW5nIHRlbXBsYXRlLCBzbyBwcmUtcmVuZGVyIGl0XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSgpLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5yYXRpbycgOiB7XG4gICAgICBob29rOiAncmF0aW8nXG4gICAgfVxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIHNlbGVjdCcgOiAnc2VsZWN0Q2hhbmdlSGFuZGxlcidcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIFNlbGVjdFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5tb2RlbC5zcGVjaWUgfHwgbnVsbDtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBTZWxlY3RWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHNlbGVjdENoYW5nZUhhbmRsZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNwZWNpZXMgPSB0aGlzLmdldFNwZWNpZXNDb2xsZWN0aW9uKCk7XG4gICAgdmFyIHJlYWN0aW9ucyA9IHRoaXMuZ2V0UmVhY3Rpb25zQ29sbGVjdGlvbigpO1xuICAgIHZhciBzcGVjaWUgPSBzcGVjaWVzLmZpbHRlcihmdW5jdGlvbiAobSkge1xuICAgICAgcmV0dXJuIG0ubmFtZSA9PT0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB9KVswXTtcbiAgICB0aGlzLm1vZGVsLnNwZWNpZSA9IHNwZWNpZTtcbiAgICB0aGlzLnZhbHVlID0gc3BlY2llO1xuICAgIHJlYWN0aW9ucy50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgfSxcbiAgZ2V0UmVhY3Rpb25zQ29sbGVjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb247XG4gIH0sXG4gIGdldFNwZWNpZXNDb2xsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcztcbiAgfSxcbn0pOyIsIi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBFZGl0RXZlbnRBc3NpZ25tZW50ID0gcmVxdWlyZSgnLi9lZGl0LWV2ZW50LWFzc2lnbm1lbnQnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnRBc3NpZ25tZW50c0VkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9YWRkLWV2ZW50LWFzc2lnbm1lbnRdJyA6ICdhZGRBc3NpZ25tZW50JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICBFZGl0RXZlbnRBc3NpZ25tZW50LFxuICAgICAgdGhpcy5xdWVyeUJ5SG9vaygnZXZlbnQtYXNzaWdubWVudHMtY29udGFpbmVyJylcbiAgICApO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgYWRkQXNzaWdubWVudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5hZGRFdmVudEFzc2lnbm1lbnQoKTtcbiAgfSxcbn0pIiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgRXZlbnRBc3NpZ25tZW50ID0gcmVxdWlyZSgnLi9ldmVudC1hc3NpZ25tZW50cy1lZGl0b3InKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvZXZlbnREZXRhaWxzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5pbml0aWFsVmFsdWUnOiB7XG4gICAgICBob29rOiAnZXZlbnQtdHJpZ2dlci1pbml0LXZhbHVlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjaGVja2VkJyxcbiAgICB9LFxuICAgICdtb2RlbC5wZXJzaXN0ZW50Jzoge1xuICAgICAgaG9vazogJ2V2ZW50LXRyaWdnZXItcGVyc2lzdGVudCcsXG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY2hlY2tlZCcsXG4gICAgfSxcbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWV2ZW50LXRyaWdnZXItaW5pdC12YWx1ZV0nIDogJ3NldFRyaWdnZXJJbml0aWFsVmFsdWUnLFxuICAgICdjaGFuZ2UgW2RhdGEtaG9vaz1ldmVudC10cmlnZ2VyLXBlcnNpc3RlbnRdJyA6ICdzZXRUcmlnZ2VyUGVyc2lzdGVudCcsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPXRyaWdnZXItdGltZV0nIDogJ3NldFVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZScsXG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWFzc2lnbm1lbnQtdGltZV0nIDogJ3NldFVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZScsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9YWR2YW5jZWQtZXZlbnQtYnV0dG9uXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckV2ZW50QXNzaWdubWVudHMoKTtcbiAgICB2YXIgdHJpZ2dlckV4cHJlc3Npb25GaWVsZCA9IHRoaXMucXVlcnlCeUhvb2soJ2V2ZW50LXRyaWdnZXItZXhwcmVzc2lvbicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdO1xuICAgICQodHJpZ2dlckV4cHJlc3Npb25GaWVsZCkuYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiLS0tTm8gRXhwcmVzc2lvbiBFbnRlcmVkLS0tXCIpO1xuICAgIHZhciBkZWxheUZpZWxkID0gdGhpcy5xdWVyeUJ5SG9vaygnZXZlbnQtZGVsYXknKS5jaGlsZHJlblswXS5jaGlsZHJlblsxXTtcbiAgICAkKGRlbGF5RmllbGQpLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBcIi0tLU5vIEV4cHJlc3Npb24gRW50ZXJlZC0tLVwiKTtcbiAgICBpZih0aGlzLm1vZGVsLnVzZVZhbHVlc0Zyb21UcmlnZ2VyVGltZSl7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3RyaWdnZXItdGltZScpKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcbiAgICB9ZWxzZXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYXNzaWdubWVudC10aW1lJykpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuICAgIH1cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlbmRlckV2ZW50QXNzaWdubWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICBpZih0aGlzLmV2ZW50QXNzaWdubWVudHNWaWV3KXtcbiAgICAgIHRoaXMuZXZlbnRBc3NpZ25tZW50c1ZpZXcucmVtb3ZlKClcbiAgICB9XG4gICAgdGhpcy5ldmVudEFzc2lnbm1lbnRzVmlldyA9IG5ldyBFdmVudEFzc2lnbm1lbnQoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5ldmVudEFzc2lnbm1lbnRzLFxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHRoaXMuZXZlbnRBc3NpZ25tZW50c1ZpZXcsICdldmVudC1hc3NpZ25tZW50cycpO1xuICB9LFxuICByZWdpc3RlclJlbmRlclN1YnZpZXc6IGZ1bmN0aW9uICh2aWV3LCBob29rKSB7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcodmlldyk7XG4gICAgdGhpcy5yZW5kZXJTdWJ2aWV3KHZpZXcsIHRoaXMucXVlcnlCeUhvb2soaG9vaykpO1xuICB9LFxuICBzZXRUcmlnZ2VySW5pdGlhbFZhbHVlOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubW9kZWwuaW5pdGlhbFZhbHVlID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgfSxcbiAgc2V0VHJpZ2dlclBlcnNpc3RlbnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5tb2RlbC5wZXJzaXN0ZW50ID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgfSxcbiAgc2V0VXNlVmFsdWVzRnJvbVRyaWdnZXJUaW1lOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubW9kZWwudXNlVmFsdWVzRnJvbVRyaWdnZXJUaW1lID0gZS50YXJnZXQuZGF0YXNldC5uYW1lID09PSBcInRyaWdnZXJcIjtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZHZhbmNlZC1ldmVudC1idXR0b24nKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtZXZlbnQtYnV0dG9uJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtZXZlbnQtYnV0dG9uJykpLnRleHQoJysnKTtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dERlbGF5OiB7XG4gICAgICBob29rOiAnZXZlbnQtZGVsYXknLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiAnZGVsYXknLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6ICdkZWxheScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5kZWxheSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRQcmlvcml0eToge1xuICAgICAgaG9vazogJ2V2ZW50LXByaW9yaXR5JyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAncHJpb3JpdHknLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogJycsXG4gICAgICAgICAgbW9kZWxLZXk6ICdwcmlvcml0eScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5wcmlvcml0eSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgaW5wdXRUcmlnZ2VyRXhwcmVzc2lvbjoge1xuICAgICAgaG9vazogJ2V2ZW50LXRyaWdnZXItZXhwcmVzc2lvbicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3RyaWdnZXItZXhwcmVzc2lvbicsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiAnJyxcbiAgICAgICAgICBtb2RlbEtleTogJ3RyaWdnZXJFeHByZXNzaW9uJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnRyaWdnZXJFeHByZXNzaW9uLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciB0ZXN0cyA9IHJlcXVpcmUoJy4vdGVzdHMnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9ldmVudExpc3RpbmdzLnB1ZycpO1xuXG5sZXQgZXZlbnRBbm5vdGF0aW9uTW9kYWxIdG1sID0gKGV2ZW50TmFtZSwgYW5ub3RhdGlvbikgPT4ge1xuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJldmVudEFubm90YXRpb25Nb2RhbFwiIGNsYXNzPVwibW9kYWxcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+QW5ub3RhdGlvbiBmb3IgJHtldmVudE5hbWV9PC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgIDxzcGFuIGZvcj1cImV2ZW50QW5ub3RhdGlvbklucHV0XCI+QW5ub3RhdGlvbjogPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJldmVudEFubm90YXRpb25JbnB1dFwiIG5hbWU9XCJldmVudEFubm90YXRpb25JbnB1dFwiIHNpemU9XCIzMFwiIGF1dG9mb2N1cyB2YWx1ZT1cIiR7YW5ub3RhdGlvbn1cIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBvay1tb2RlbC1idG5cIj5PSzwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5uYW1lJyA6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBob29rOiAnaW5wdXQtbmFtZS1jb250YWluZXInXG4gICAgfSxcbiAgICAnbW9kZWwuc2VsZWN0ZWQnIDoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICBlbC5jaGVja2VkID0gdmFsdWU7XG4gICAgICB9LFxuICAgICAgaG9vazogJ3NlbGVjdCdcbiAgICB9XG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXNlbGVjdF0nICA6ICdzZWxlY3RFdmVudCcsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZWRpdC1hbm5vdGF0aW9uLWJ0bl0nIDogJ2VkaXRBbm5vdGF0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZW1vdmVdJyA6ICdyZW1vdmVFdmVudCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgJChkb2N1bWVudCkub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJ1thdXRvZm9jdXNdJywgZS50YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgaWYoIXRoaXMubW9kZWwuYW5ub3RhdGlvbil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2VkaXQtYW5ub3RhdGlvbi1idG4nKSkudGV4dCgnQWRkJylcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBzZWxlY3RFdmVudDogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24udHJpZ2dlcihcInNlbGVjdFwiLCB0aGlzLm1vZGVsKTtcbiAgfSxcbiAgZWRpdEFubm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLm1vZGVsLm5hbWU7XG4gICAgdmFyIGFubm90YXRpb24gPSB0aGlzLm1vZGVsLmFubm90YXRpb247XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2V2ZW50QW5ub3RhdGlvbk1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNldmVudEFubm90YXRpb25Nb2RhbCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKGV2ZW50QW5ub3RhdGlvbk1vZGFsSHRtbChuYW1lLCBhbm5vdGF0aW9uKSkubW9kYWwoKTtcbiAgICBsZXQgb2tCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZXZlbnRBbm5vdGF0aW9uTW9kYWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNldmVudEFubm90YXRpb25Nb2RhbCAjZXZlbnRBbm5vdGF0aW9uSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5tb2RlbC5hbm5vdGF0aW9uID0gaW5wdXQudmFsdWU7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJFdmVudExpc3RpbmdzVmlldygpO1xuICAgICAgbW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICB9KTtcbiAgfSxcbiAgcmVtb3ZlRXZlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICAgIHRoaXMuY29sbGVjdGlvbi5yZW1vdmVFdmVudCh0aGlzLm1vZGVsKTtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dE5hbWU6IHtcbiAgICAgIGhvb2s6ICdldmVudC1uYW1lLWNvbnRhaW5lcicsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5wdXRWaWV3KHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMubmFtZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnbmFtZScsXG4gICAgICAgICAgdmFsdWVUeXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tb2RlbC5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyIsInZhciBWaWV3U3dpdGNoZXIgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldy1zd2l0Y2hlcicpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vc3VwcG9ydCBmaWxlc1xudmFyIFRvb2x0aXBzID0gcmVxdWlyZShcIi4uL3Rvb2x0aXBzXCIpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIEV2ZW50TGlzdGluZ3MgPSByZXF1aXJlKCcuL2V2ZW50LWxpc3RpbmdzJyk7XG52YXIgRXZlbnREZXRhaWxzID0gcmVxdWlyZSgnLi9ldmVudC1kZXRhaWxzJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2V2ZW50c0VkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9YWRkLWV2ZW50XScgOiAnYWRkRXZlbnQnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5ldmVudHNFZGl0b3JcbiAgICB0aGlzLmNvbGxlY3Rpb24ub24oXCJzZWxlY3RcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB0aGlzLnNldFNlbGVjdGVkRXZlbnQoZXZlbnQpO1xuICAgICAgdGhpcy5zZXREZXRhaWxzVmlldyhldmVudCk7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKFwicmVtb3ZlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgLy8gU2VsZWN0IHRoZSBsYXN0IGV2ZW50IGJ5IGRlZmF1bHRcbiAgICAgIC8vIEJ1dCBvbmx5IGlmIHRoZXJlIGFyZSBvdGhlciBldmVudHMgb3RoZXIgdGhhbiB0aGUgb25lIHdlJ3JlIHJlbW92aW5nXG4gICAgICBpZiAoZXZlbnQuZGV0YWlsc1ZpZXcpXG4gICAgICAgIGV2ZW50LmRldGFpbHNWaWV3LnJlbW92ZSgpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZUV2ZW50KGV2ZW50KTtcbiAgICAgIGlmICh0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZCA9IHRoaXMuY29sbGVjdGlvbi5hdCh0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoLTEpO1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24udHJpZ2dlcihcInNlbGVjdFwiLCBzZWxlY3RlZCk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVBZGRFdmVudEJ1dHRvbiwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVBZGRFdmVudEJ1dHRvbiwgdGhpcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyRXZlbnRMaXN0aW5nc1ZpZXcoKTtcbiAgICB0aGlzLmRldGFpbHNDb250YWluZXIgPSB0aGlzLnF1ZXJ5QnlIb29rKCdldmVudC1kZXRhaWxzLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuZGV0YWlsc1ZpZXdTd2l0Y2hlciA9IG5ldyBWaWV3U3dpdGNoZXIoe1xuICAgICAgZWw6IHRoaXMuZGV0YWlsc0NvbnRhaW5lcixcbiAgICB9KTtcbiAgICBpZiAodGhpcy5jb2xsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRTZWxlY3RlZEV2ZW50KHRoaXMuY29sbGVjdGlvbi5hdCgwKSk7XG4gICAgICB0aGlzLmNvbGxlY3Rpb24udHJpZ2dlcihcInNlbGVjdFwiLCB0aGlzLnNlbGVjdGVkRXZlbnQpO1xuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUFkZEV2ZW50QnV0dG9uKClcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlbmRlckV2ZW50TGlzdGluZ3NWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5ldmVudExpc3RpbmdzVmlldyl7XG4gICAgICB0aGlzLmV2ZW50TGlzdGluZ3NWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmV2ZW50TGlzdGluZ3NWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgRXZlbnRMaXN0aW5ncyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ2V2ZW50LWxpc3RpbmctY29udGFpbmVyJylcbiAgICApO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgdG9nZ2xlQWRkRXZlbnRCdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24ubWFwKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYoZXZlbnQuZGV0YWlsc1ZpZXcgJiYgZXZlbnQuc2VsZWN0ZWQpe1xuICAgICAgICBldmVudC5kZXRhaWxzVmlldy5yZW5kZXJFdmVudEFzc2lnbm1lbnRzKCk7XG4gICAgICB9XG4gICAgfSlcbiAgICB2YXIgbnVtU3BlY2llcyA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcy5sZW5ndGg7XG4gICAgdmFyIG51bVBhcmFtZXRlcnMgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnMubGVuZ3RoO1xuICAgIHZhciBkaXNhYmxlZCA9IG51bVNwZWNpZXMgPD0gMCAmJiBudW1QYXJhbWV0ZXJzIDw9IDBcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1ldmVudCcpKS5wcm9wKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcbiAgfSxcbiAgc2V0U2VsZWN0ZWRFdmVudDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG0pIHsgbS5zZWxlY3RlZCA9IGZhbHNlOyB9KTtcbiAgICBldmVudC5zZWxlY3RlZCA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3RlZEV2ZW50ID0gZXZlbnQ7XG4gIH0sXG4gIHNldERldGFpbHNWaWV3OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5kZXRhaWxzVmlldyA9IGV2ZW50LmRldGFpbHNWaWV3IHx8IHRoaXMubmV3RGV0YWlsc1ZpZXcoZXZlbnQpO1xuICAgIHRoaXMuZGV0YWlsc1ZpZXdTd2l0Y2hlci5zZXQoZXZlbnQuZGV0YWlsc1ZpZXcpO1xuICB9LFxuICBhZGRFdmVudDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBldmVudCA9IHRoaXMuY29sbGVjdGlvbi5hZGRFdmVudCgpO1xuICAgIGV2ZW50LmRldGFpbHNWaWV3ID0gdGhpcy5uZXdEZXRhaWxzVmlldyhldmVudCk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJzZWxlY3RcIiwgZXZlbnQpO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcblxuICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBuZXdEZXRhaWxzVmlldzogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGRldGFpbHNWaWV3ID0gbmV3IEV2ZW50RGV0YWlscyh7IG1vZGVsOiBldmVudCB9KTtcbiAgICBkZXRhaWxzVmlldy5wYXJlbnQgPSB0aGlzO1xuICAgIHJldHVybiBkZXRhaWxzVmlld1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSkiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIEVkaXRJbml0aWFsQ29uZGl0aW9uID0gcmVxdWlyZSgnLi9lZGl0LWluaXRpYWwtY29uZGl0aW9uJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL2luaXRpYWxDb25kaXRpb25zRWRpdG9yLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1zY2F0dGVyXScgOiAnYWRkSW5pdGlhbENvbmRpdGlvbicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9cGxhY2VdJyA6ICdhZGRJbml0aWFsQ29uZGl0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1kaXN0cmlidXRlLXVuaWZvcm1seV0nIDogJ2FkZEluaXRpYWxDb25kaXRpb24nLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2FuZ2VDb2xsYXBzZUJ1dHRvblRleHQnLFxuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgIEVkaXRJbml0aWFsQ29uZGl0aW9uLFxuICAgICAgdGhpcy5xdWVyeUJ5SG9vaygnaW5pdGlhbC1jb25kaXRpb25zLWNvbGxlY3Rpb24nKVxuICAgICk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBhZGRJbml0aWFsQ29uZGl0aW9uOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBpbml0aWFsQ29uZGl0aW9uVHlwZSA9IGUudGFyZ2V0LnRleHRDb250ZW50O1xuICAgIHRoaXMuY29sbGVjdGlvbi5hZGRJbml0aWFsQ29uZGl0aW9uKGluaXRpYWxDb25kaXRpb25UeXBlKTtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyIGFwcCA9IHJlcXVpcmUoJ2FtcGVyc2FuZC1hcHAnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgSW5wdXRWaWV3ID0gcmVxdWlyZSgnLi9pbnB1dCcpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9tZXNoRWRpdG9yLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9bnVtLXN1YmRvbWFpbnMtY29udGFpbmVyXScgOiAndXBkYXRlU3ViZG9tYWlucycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6ICdjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQnXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlU3ViZG9tYWluczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwucGFyZW50LnRyaWdnZXIoJ21lc2gtdXBkYXRlJyk7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJylcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBpbnB1dFN1YmRvbWFpbnM6IHtcbiAgICAgIGhvb2s6ICdudW0tc3ViZG9tYWlucy1jb250YWluZXInLFxuICAgICAgcHJlcGFyZVZpZXc6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gbmV3IElucHV0Vmlldyh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG5hbWU6ICdudW1TdWJkb21haW5zJyxcbiAgICAgICAgICBsYWJlbDogJ051bWJlciBvZiBTdWJkb21haW5zJyxcbiAgICAgICAgICB0ZXN0OiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAnY291bnQnLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuY291bnQsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vc3VwcG9ydCBmaWxlc1xudmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cycpO1xudmFyIFRvb2x0aXBzID0gcmVxdWlyZSgnLi4vdG9vbHRpcHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL21vZGVsU2V0dGluZ3MucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5tb2RlbFNldHRpbmdzXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0OiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciB0ZXh0ID0gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCk7XG4gICAgdGV4dCA9PT0gJysnID8gJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCctJykgOiAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJysnKVxuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0U2ltRW5kOiB7XG4gICAgICBob29rOiAncHJldmlldy10aW1lJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnZW5kLXNpbScsXG4gICAgICAgICAgbGFiZWw6ICcwIHRvICcsXG4gICAgICAgICAgdGVzdHM6IHRlc3RzLnZhbHVlVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICdlbmRTaW0nLFxuICAgICAgICAgIHZhbHVlVHlwZTogJ251bWJlcicsXG4gICAgICAgICAgdmFsdWU6IHRoaXMubW9kZWwuZW5kU2ltXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0VGltZVVuaXQ6IHtcbiAgICAgIGhvb2s6ICd0aW1lLXVuaXRzJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcgKHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3RpbWUtdW5pdHMnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICB0ZXN0czogdGVzdHMudmFsdWVUZXN0cyxcbiAgICAgICAgICBtb2RlbEtleTogJ3RpbWVTdGVwJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnRpbWVTdGVwXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGlucHV0Vm9sdW1lOiB7XG4gICAgICBob29rOiAndm9sdW1lJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcgKHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbmFtZTogJ3ZvbHVtZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy52YWx1ZVRlc3RzLFxuICAgICAgICAgIG1vZGVsS2V5OiAndm9sdW1lJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnZvbHVtZSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTsiLCJ2YXIgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG52YXIgeGhyID0gcmVxdWlyZSgneGhyJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBQbG90bHkgPSByZXF1aXJlKCcuLi9saWIvcGxvdGx5Jyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xuLy90ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9tb2RlbFN0YXRlQnV0dG9ucy5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9c2F2ZV0nIDogJ2NsaWNrU2F2ZUhhbmRsZXInLFxuICAgICdjbGljayBbZGF0YS1ob29rPXJ1bl0nICA6ICdjbGlja1J1bkhhbmRsZXInLFxuICAgICdjbGljayBbZGF0YS1ob29rPXN0YXJ0LXdvcmtmbG93XScgOiAnY2xpY2tTdGFydFdvcmtmbG93SGFuZGxlcicsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLm1vZGVsLnNwZWNpZXMub24oJ2FkZCByZW1vdmUnLCB0aGlzLnRvZ2dsZVByZXZpZXdXb3JrZmxvd0J0biwgdGhpcyk7XG4gICAgdGhpcy5tb2RlbC5yZWFjdGlvbnMub24oJ2FkZCByZW1vdmUnLCB0aGlzLnRvZ2dsZVByZXZpZXdXb3JrZmxvd0J0biwgdGhpcyk7XG4gICAgdGhpcy5tb2RlbC5ldmVudHNDb2xsZWN0aW9uLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVQcmV2aWV3V29ya2Zsb3dCdG4sIHRoaXMpO1xuICAgIHRoaXMubW9kZWwucnVsZXMub24oJ2FkZCByZW1vdmUnLCB0aGlzLnRvZ2dsZVByZXZpZXdXb3JrZmxvd0J0biwgdGhpcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudG9nZ2xlUHJldmlld1dvcmtmbG93QnRuKCk7XG4gIH0sXG4gIGNsaWNrU2F2ZUhhbmRsZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5zYXZlTW9kZWwodGhpcy5zYXZlZC5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY2xpY2tSdW5IYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgICQodGhpcy5wYXJlbnQucXVlcnlCeUhvb2soJ21vZGVsLXJ1bi1lcnJvci1jb250YWluZXInKSkuY29sbGFwc2UoJ2hpZGUnKTtcbiAgICAkKHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC10aW1lb3V0LW1lc3NhZ2UnKSkuY29sbGFwc2UoJ2hpZGUnKTtcbiAgICB2YXIgZWwgPSB0aGlzLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtcnVuLWNvbnRhaW5lcicpO1xuICAgIFBsb3RseS5wdXJnZShlbClcbiAgICB0aGlzLnNhdmVNb2RlbCh0aGlzLnJ1bk1vZGVsLmJpbmQodGhpcykpO1xuICB9LFxuICBjbGlja1N0YXJ0V29ya2Zsb3dIYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aC5qb2luKGFwcC5nZXRCYXNlUGF0aCgpLCBcInN0b2Noc3Mvd29ya2Zsb3cvc2VsZWN0aW9uXCIsIHRoaXMubW9kZWwuZGlyZWN0b3J5KTtcbiAgfSxcbiAgdG9nZ2xlUHJldmlld1dvcmtmbG93QnRuOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG51bVNwZWNpZXMgPSB0aGlzLm1vZGVsLnNwZWNpZXMubGVuZ3RoO1xuICAgIHZhciBudW1SZWFjdGlvbnMgPSB0aGlzLm1vZGVsLnJlYWN0aW9ucy5sZW5ndGhcbiAgICB2YXIgbnVtRXZlbnRzID0gdGhpcy5tb2RlbC5ldmVudHNDb2xsZWN0aW9uLmxlbmd0aFxuICAgIHZhciBudW1SdWxlcyA9IHRoaXMubW9kZWwucnVsZXMubGVuZ3RoXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdydW4nKSkucHJvcCgnZGlzYWJsZWQnLCAoIW51bVNwZWNpZXMgfHwgKCFudW1SZWFjdGlvbnMgJiYgIW51bUV2ZW50cyAmJiAhbnVtUnVsZXMpKSlcbiAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N0YXJ0LXdvcmtmbG93JykpLnByb3AoJ2Rpc2FibGVkJywgKCFudW1TcGVjaWVzIHx8ICghbnVtUmVhY3Rpb25zICYmICFudW1FdmVudHMgJiYgIW51bVJ1bGVzKSkpXG4gIH0sXG4gIHNhdmVNb2RlbDogZnVuY3Rpb24gKGNiKSB7XG4gICAgdmFyIG51bUV2ZW50cyA9IHRoaXMubW9kZWwuZXZlbnRzQ29sbGVjdGlvbi5sZW5ndGg7XG4gICAgdmFyIG51bVJ1bGVzID0gdGhpcy5tb2RlbC5ydWxlcy5sZW5ndGg7XG4gICAgdmFyIGRlZmF1bHRNb2RlID0gdGhpcy5tb2RlbC5kZWZhdWx0TW9kZTtcbiAgICBpZighbnVtRXZlbnRzICYmICFudW1SdWxlcyAmJiBkZWZhdWx0TW9kZSA9PT0gXCJjb250aW51b3VzXCIpe1xuICAgICAgdGhpcy5tb2RlbC5tb2RlbFNldHRpbmdzLmFsZ29yaXRobSA9IFwiT0RFXCI7XG4gICAgfWVsc2UgaWYoIW51bUV2ZW50cyAmJiAhbnVtUnVsZXMgJiYgZGVmYXVsdE1vZGUgPT09IFwiZGlzY3JldGVcIil7XG4gICAgICB0aGlzLm1vZGVsLm1vZGVsU2V0dGluZ3MuYWxnb3JpdGhtID0gXCJTU0FcIjtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMubW9kZWwubW9kZWxTZXR0aW5ncy5hbGdvcml0aG0gPSBcIkh5YnJpZC1UYXUtTGVhcGluZ1wiO1xuICAgIH1cbiAgICB0aGlzLnNhdmluZygpO1xuICAgIC8vIHRoaXMubW9kZWwgaXMgYSBNb2RlbFZlcnNpb24sIHRoZSBwYXJlbnQgb2YgdGhlIGNvbGxlY3Rpb24gaXMgTW9kZWxcbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgIGlmIChjYikge1xuICAgICAgbW9kZWwuc2F2ZShtb2RlbC5hdHRyaWJ1dGVzLCB7XG4gICAgICAgIHN1Y2Nlc3M6IGNiLFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzYXZpbmcgbW9kZWw6XCIsIG1vZGVsKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUmVzcG9uc2U6XCIsIHJlc3BvbnNlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2RlbC5zYXZlTW9kZWwoKTtcbiAgICB9XG4gIH0sXG4gIHNhdmluZzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzYXZpbmcgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzYXZpbmctbWRsJyk7XG4gICAgdmFyIHNhdmVkID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2ZWQtbWRsJyk7XG4gICAgc2F2ZWQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHNhdmluZy5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgfSxcbiAgc2F2ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2F2aW5nID0gdGhpcy5xdWVyeUJ5SG9vaygnc2F2aW5nLW1kbCcpO1xuICAgIHZhciBzYXZlZCA9IHRoaXMucXVlcnlCeUhvb2soJ3NhdmVkLW1kbCcpO1xuICAgIHNhdmluZy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgc2F2ZWQuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG4gIH0sXG4gIHJ1bk1vZGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zYXZlZCgpO1xuICAgIHRoaXMucnVubmluZygpO1xuICAgIHZhciBlbCA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tY29udGFpbmVyJylcbiAgICB2YXIgbW9kZWwgPSB0aGlzLm1vZGVsXG4gICAgdmFyIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksICcvbW9kZWxzL3J1bi8nLCAnc3RhcnQnLCAnbm9uZScsIG1vZGVsLmRpcmVjdG9yeSk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHhocih7IHVyaTogZW5kcG9pbnQsIGpzb246IHRydWV9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgc2VsZi5vdXRmaWxlID0gYm9keS5PdXRmaWxlXG4gICAgICBzZWxmLmdldFJlc3VsdHMoKVxuICAgIH0pO1xuICB9LFxuICBydW5uaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBsb3QgPSB0aGlzLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtcnVuLWNvbnRhaW5lcicpO1xuICAgIHZhciBzcGlubmVyID0gdGhpcy5wYXJlbnQucXVlcnlCeUhvb2soJ3Bsb3QtbG9hZGVyJyk7XG4gICAgdmFyIGVycm9ycyA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tZXJyb3ItY29udGFpbmVyJyk7XG4gICAgcGxvdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgc3Bpbm5lci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGVycm9ycy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH0sXG4gIHJhbjogZnVuY3Rpb24gKG5vRXJyb3JzKSB7XG4gICAgdmFyIHBsb3QgPSB0aGlzLnBhcmVudC5xdWVyeUJ5SG9vaygnbW9kZWwtcnVuLWNvbnRhaW5lcicpO1xuICAgIHZhciBzcGlubmVyID0gdGhpcy5wYXJlbnQucXVlcnlCeUhvb2soJ3Bsb3QtbG9hZGVyJyk7XG4gICAgdmFyIGVycm9ycyA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tZXJyb3ItY29udGFpbmVyJyk7XG4gICAgaWYobm9FcnJvcnMpe1xuICAgICAgcGxvdC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH1lbHNle1xuICAgICAgZXJyb3JzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbiAgICB9XG4gICAgc3Bpbm5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH0sXG4gIGdldFJlc3VsdHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG1vZGVsID0gdGhpcy5tb2RlbDtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGVuZHBvaW50ID0gcGF0aC5qb2luKGFwcC5nZXRBcGlQYXRoKCksICcvbW9kZWxzL3J1bi8nLCAncmVhZCcsIHNlbGYub3V0ZmlsZSwgbW9kZWwuZGlyZWN0b3J5KTtcbiAgICAgIHhocih7IHVyaTogZW5kcG9pbnQsIGpzb246IHRydWV9LCBmdW5jdGlvbiAoZXJyLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICB2YXIgZGF0YSA9IGJvZHkuUmVzdWx0cztcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSA0MDApe1xuICAgICAgICAgIHNlbGYucmFuKGZhbHNlKTtcbiAgICAgICAgICAkKHNlbGYucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tZXJyb3ItbWVzc2FnZScpKS50ZXh0KGRhdGEuZXJyb3JzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKCFib2R5LlJ1bm5pbmcpe1xuICAgICAgICAgIGlmKGRhdGEudGltZW91dCl7XG4gICAgICAgICAgICAkKHNlbGYucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC10aW1lb3V0LW1lc3NhZ2UnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5wbG90UmVzdWx0cyhkYXRhLnJlc3VsdHMpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBzZWxmLmdldFJlc3VsdHMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwgMjAwMCk7XG4gIH0sXG4gIHBsb3RSZXN1bHRzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vIFRPRE8gYWJzdHJhY3QgdGhpcyBpbnRvIGFuIGV2ZW50IHByb2JhYmx5XG4gICAgdmFyIHRpdGxlID0gdGhpcy5tb2RlbC5uYW1lICsgXCIgTW9kZWwgUHJldmlld1wiXG4gICAgdGhpcy5yYW4odHJ1ZSlcbiAgICBlbCA9IHRoaXMucGFyZW50LnF1ZXJ5QnlIb29rKCdtb2RlbC1ydW4tY29udGFpbmVyJyk7XG4gICAgdGltZSA9IGRhdGEudGltZVxuICAgIHlfbGFiZWxzID0gT2JqZWN0LmtleXMoZGF0YSkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBrZXkgIT09ICdkYXRhJyAmJiBrZXkgIT09ICd0aW1lJ1xuICAgIH0pO1xuICAgIHRyYWNlcyA9IHlfbGFiZWxzLm1hcChmdW5jdGlvbiAoc3BlY2llKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiB0aW1lLFxuICAgICAgICB5OiBkYXRhW3NwZWNpZV0sXG4gICAgICAgIG1vZGU6ICdsaW5lcycsXG4gICAgICAgIG5hbWU6IHNwZWNpZVxuICAgICAgfVxuICAgIH0pO1xuICAgIGxheW91dCA9IHsgXG4gICAgICBzaG93bGVnZW5kOiB0cnVlLFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIHg6IDEsXG4gICAgICAgIHk6IDAuOVxuICAgICAgfSxcbiAgICAgIG1hcmdpbjogeyBcbiAgICAgICAgdDogMCBcbiAgICAgIH0gXG4gICAgfVxuICAgIGNvbmZpZyA9IHtcbiAgICAgIHJlc3BvbnNpdmU6IHRydWUsXG4gICAgfVxuICAgIFBsb3RseS5uZXdQbG90KGVsLCB0cmFjZXMsIGxheW91dCwgY29uZmlnKTtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQpXG4gIH0sXG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoJy4uL3Rvb2x0aXBzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgRWRpdFBhcmFtZXRlclZpZXcgPSByZXF1aXJlKCcuL2VkaXQtcGFyYW1ldGVyJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3BhcmFtZXRlcnNFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWFkZC1wYXJhbWV0ZXJdJyA6ICdhZGRQYXJhbWV0ZXInLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMucGFyYW1ldGVyc0VkaXRvclxuICAgIHRoaXMuY29sbGVjdGlvbi5vbigndXBkYXRlLXBhcmFtZXRlcnMnLCBmdW5jdGlvbiAoY29tcElELCBwYXJhbWV0ZXIpIHtcbiAgICAgIHNlbGYuY29sbGVjdGlvbi5wYXJlbnQucmVhY3Rpb25zLm1hcChmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICAgICAgaWYocmVhY3Rpb24ucmF0ZSAmJiByZWFjdGlvbi5yYXRlLmNvbXBJRCA9PT0gY29tcElEKXtcbiAgICAgICAgICByZWFjdGlvbi5yYXRlID0gcGFyYW1ldGVyO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGYuY29sbGVjdGlvbi5wYXJlbnQuZXZlbnRzQ29sbGVjdGlvbi5tYXAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LmV2ZW50QXNzaWdubWVudHMubWFwKGZ1bmN0aW9uIChhc3NpZ25tZW50KSB7XG4gICAgICAgICAgaWYoYXNzaWdubWVudC52YXJpYWJsZS5jb21wSUQgPT09IGNvbXBJRCkge1xuICAgICAgICAgICAgYXNzaWdubWVudC52YXJpYWJsZSA9IHBhcmFtZXRlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKGV2ZW50LnNlbGVjdGVkKVxuICAgICAgICAgIGV2ZW50LmRldGFpbHNWaWV3LnJlbmRlckV2ZW50QXNzaWdubWVudHMoKTtcbiAgICAgIH0pO1xuICAgICAgc2VsZi5jb2xsZWN0aW9uLnBhcmVudC5ydWxlcy5tYXAoZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgaWYocnVsZS52YXJpYWJsZS5jb21wSUQgPT09IGNvbXBJRCkge1xuICAgICAgICAgIHJ1bGUudmFyaWFibGUgPSBwYXJhbWV0ZXI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5wYXJlbnQucmVuZGVyUnVsZXNWaWV3KCk7XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyRWRpdFBhcmFtZXRlcigpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgcmVuZGVyRWRpdFBhcmFtZXRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuZWRpdFBhcmFtZXRlclZpZXcpe1xuICAgICAgdGhpcy5lZGl0UGFyYW1ldGVyVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5lZGl0UGFyYW1ldGVyVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgIEVkaXRQYXJhbWV0ZXJWaWV3LFxuICAgICAgdGhpcy5xdWVyeUJ5SG9vaygncGFyYW1ldGVyLWxpc3QnKVxuICAgICk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBhZGRQYXJhbWV0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24uYWRkUGFyYW1ldGVyKCk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuXG4gICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy9tb2RlbHNcbnZhciBTdG9pY2hTcGVjaWUgPSByZXF1aXJlKCcuLi9tb2RlbHMvc3RvaWNoLXNwZWNpZScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbnZhciBFZGl0U3RvaWNoU3BlY2llVmlldyA9IHJlcXVpcmUoJy4vZWRpdC1zdG9pY2gtc3BlY2llJyk7XG52YXIgRWRpdEN1c3RvbVN0b2ljaFNwZWNpZVZpZXcgPSByZXF1aXJlKCcuL2VkaXQtY3VzdG9tLXN0b2ljaC1zcGVjaWUnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3RhbnRQcm9kdWN0LnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LXNwZWNpZV0nIDogJ3NlbGVjdFNwZWNpZScsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9YWRkLXNlbGVjdGVkLXNwZWNpZV0nIDogJ2FkZFNlbGVjdGVkU3BlY2llJ1xuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXJncykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBhcmdzLmNvbGxlY3Rpb247XG4gICAgdGhpcy5zcGVjaWVzID0gYXJncy5zcGVjaWVzO1xuICAgIHRoaXMucmVhY3Rpb25UeXBlID0gYXJncy5yZWFjdGlvblR5cGU7XG4gICAgdGhpcy5pc1JlYWN0YW50cyA9IGFyZ3MuaXNSZWFjdGFudHNcbiAgICB0aGlzLnVuc2VsZWN0ZWRUZXh0ID0gJ1BpY2sgYSBzcGVjaWVzJztcbiAgICB0aGlzLmZpZWxkVGl0bGUgPSBhcmdzLmZpZWxkVGl0bGU7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgYXJncyA9IHtcbiAgICAgIHZpZXdPcHRpb25zOiB7XG4gICAgICAgIG5hbWU6ICdzdG9pY2gtc3BlY2llJyxcbiAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdGV4dEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgICBlYWdlclZhbGlkYXRlOiB0cnVlLFxuICAgICAgICAvLyBTZXQgaWRBdHRyaWJ1dGUgdG8gbmFtZS4gTW9kZWxzIG1heSBub3QgYmUgc2F2ZWQgeWV0IHNvIGlkIGlzIHVucmVsaWFibGUgKHNvIGlzIGNpZCkuXG4gICAgICAgIC8vIFVzZSBuYW1lIHNpbmNlIGl0ICpzaG91bGQgYmUqIHVuaXF1ZS5cbiAgICAgICAgaWRBdHRyaWJ1dGU6ICduYW1lJyxcbiAgICAgICAgb3B0aW9uczogc2VsZi5zcGVjaWVzXG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgdHlwZSA9IHNlbGYucmVhY3Rpb25UeXBlO1xuICAgIHZhciBTdG9pY2hTcGVjaWVzVmlldyA9ICh0eXBlLnN0YXJ0c1dpdGgoJ2N1c3RvbScpKSA/IEVkaXRDdXN0b21TdG9pY2hTcGVjaWVWaWV3IDogRWRpdFN0b2ljaFNwZWNpZVZpZXdcbiAgICBzZWxmLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICAgIHNlbGYuY29sbGVjdGlvbixcbiAgICAgICAgU3RvaWNoU3BlY2llc1ZpZXcsXG4gICAgICAgIHNlbGYucXVlcnlCeUhvb2soJ3JlYWN0YW50cy1lZGl0b3InKSxcbiAgICAgICAgYXJnc1xuICAgICk7XG4gICAgaWYodGhpcy5yZWFjdGlvblR5cGUuc3RhcnRzV2l0aCgnY3VzdG9tJykpIHtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkuY29sbGFwc2UoKVxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUFkZFNwZWNpZUJ1dHRvbigpO1xuICAgIGlmKHRoaXMuZmllbGRUaXRsZSA9PT0gXCJSZWFjdGFudHNcIil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2ZpZWxkLXRpdGxlLXRvb2x0aXAnKSkucHJvcCgndGl0bGUnLCB0aGlzLnBhcmVudC5wYXJlbnQudG9vbHRpcHMucmVhY3RhbnQpXG4gICAgfWVsc2V7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2ZpZWxkLXRpdGxlLXRvb2x0aXAnKSkucHJvcCgndGl0bGUnLCB0aGlzLnBhcmVudC5wYXJlbnQudG9vbHRpcHMucHJvZHVjdClcbiAgICB9XG4gIH0sXG4gIHNlbGVjdFNwZWNpZTogZnVuY3Rpb24gKGUpIHtcbiAgICBpZih0aGlzLnVuc2VsZWN0ZWRUZXh0ID09PSBlLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMuaXRlbSgwKS50ZXh0KXtcbiAgICAgIHRoaXMuaGFzU2VsZWN0ZWRTcGVjaWUgPSBmYWxzZTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuaGFzU2VsZWN0ZWRTcGVjaWUgPSB0cnVlO1xuICAgICAgdGhpcy5zcGVjaWVOYW1lID0gZS50YXJnZXQuc2VsZWN0ZWRPcHRpb25zLml0ZW0oMCkudGV4dDtcbiAgICB9XG4gICAgdGhpcy50b2dnbGVBZGRTcGVjaWVCdXR0b24oKTtcbiAgfSxcbiAgYWRkU2VsZWN0ZWRTcGVjaWU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3BlY2llTmFtZSA9IHRoaXMuc3BlY2llTmFtZSA/IHRoaXMuc3BlY2llTmFtZSA6ICdQaWNrIGEgc3BlY2llcyc7XG4gICAgaWYodGhpcy52YWxpZGF0ZUFkZFNwZWNpZSgpKSB7XG4gICAgICB0aGlzLmNvbGxlY3Rpb24uYWRkU3RvaWNoU3BlY2llKHNwZWNpZU5hbWUpO1xuICAgICAgdGhpcy50b2dnbGVBZGRTcGVjaWVCdXR0b24oKTtcbiAgICAgIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgICB9XG4gIH0sXG4gIHRvZ2dsZUFkZFNwZWNpZUJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmKCF0aGlzLnZhbGlkYXRlQWRkU3BlY2llKCkpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1zZWxlY3RlZC1zcGVjaWUnKSkucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICBlbHNlXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1zZWxlY3RlZC1zcGVjaWUnKSkucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gIH0sXG4gIHZhbGlkYXRlQWRkU3BlY2llOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5oYXNTZWxlY3RlZFNwZWNpZSl7XG4gICAgICBpZighdGhpcy5jb2xsZWN0aW9uLmxlbmd0aCkgIHJldHVybiB0cnVlO1xuICAgICAgaWYodGhpcy5jb2xsZWN0aW9uLmxlbmd0aCA8IDIgJiYgdGhpcy5jb2xsZWN0aW9uLmF0KDApLnJhdGlvIDwgMilcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBpZih0aGlzLnJlYWN0aW9uVHlwZSAhPT0gJ2N1c3RvbS1tYXNzYWN0aW9uJylcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBpZighdGhpcy5pc1JlYWN0YW50cylcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgc3Vidmlld3M6IHtcbiAgICBzZWxlY3RTcGVjaWVzOiB7XG4gICAgICBob29rOiAnc2VsZWN0LXNwZWNpZScsXG4gICAgICBwcmVwYXJlVmlldzogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2VsZWN0Vmlldyh7XG4gICAgICAgICAgbmFtZTogJ3N0b2ljaC1zcGVjaWUnLFxuICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgdGV4dEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgICAgIGVhZ2VyVmFsaWRhdGU6IGZhbHNlLFxuICAgICAgICAgIC8vIFNldCBpZEF0dHJpYnV0ZSB0byBuYW1lLiBNb2RlbHMgbWF5IG5vdCBiZSBzYXZlZCB5ZXQgc28gaWQgaXMgdW5yZWxpYWJsZSAoc28gaXMgY2lkKS5cbiAgICAgICAgICAvLyBVc2UgbmFtZSBzaW5jZSBpdCAqc2hvdWxkIGJlKiB1bmlxdWUuXG4gICAgICAgICAgaWRBdHRyaWJ1dGU6ICduYW1lJyxcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLnNwZWNpZXMsXG4gICAgICAgICAgdW5zZWxlY3RlZFRleHQ6IHRoaXMudW5zZWxlY3RlZFRleHQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbn0pOyIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBrYXRleCA9IHJlcXVpcmUoJ2thdGV4Jyk7XG4vL2NvbmZpZ1xudmFyIFJlYWN0aW9uVHlwZXMgPSByZXF1aXJlKCcuLi9yZWFjdGlvbi10eXBlcycpO1xuLy9tb2RlbHNcbnZhciBTdG9pY2hTcGVjaWUgPSByZXF1aXJlKCcuLi9tb2RlbHMvc3RvaWNoLXNwZWNpZScpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFNlbGVjdFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtc2VsZWN0LXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgUmVhY3Rpb25TdWJkb21haW5zVmlldyA9IHJlcXVpcmUoJy4vcmVhY3Rpb24tc3ViZG9tYWlucycpO1xudmFyIFJlYWN0YW50UHJvZHVjdFZpZXcgPSByZXF1aXJlKCcuL3JlYWN0YW50LXByb2R1Y3QnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25EZXRhaWxzLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5wcm9wZW5zaXR5Jzoge1xuICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgIGhvb2s6ICdzZWxlY3QtcmF0ZS1wYXJhbWV0ZXInXG4gICAgfSxcbiAgICAnbW9kZWwuc3VtbWFyeScgOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlLCBwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgIGthdGV4LnJlbmRlcih0aGlzLm1vZGVsLnN1bW1hcnksIHRoaXMucXVlcnlCeUhvb2soJ3N1bW1hcnktY29udGFpbmVyJyksIHtcbiAgICAgICAgICBkaXNwbGF5TW9kZTogdHJ1ZSxcbiAgICAgICAgICBvdXRwdXQ6ICdodG1sJ1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBob29rOiAnc3VtbWFyeS1jb250YWluZXInLFxuICAgIH0sXG4gICAgJ21vZGVsLmhhc0NvbmZsaWN0Jzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICB0aGlzLm1vZGVsLmhhc0NvbmZsaWN0ID8gXG4gICAgICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb25mbGljdGluZy1tb2Rlcy1tZXNzYWdlJykpLmNvbGxhcHNlKCdzaG93JykgOiBcbiAgICAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbmZsaWN0aW5nLW1vZGVzLW1lc3NhZ2UnKSkuY29sbGFwc2UoJ2hpZGUnKVxuICAgICAgfSxcbiAgICAgIGhvb2s6ICdjb25mbGljdGluZy1tb2Rlcy1tZXNzYWdlJyxcbiAgICB9LFxuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LXJhdGUtcGFyYW1ldGVyXScgOiAnc2VsZWN0UmF0ZVBhcmFtJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c2VsZWN0LXJlYWN0aW9uLXR5cGVdJyAgOiAnc2VsZWN0UmVhY3Rpb25UeXBlJyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBzZWxmID0gdGhpczsgXG4gICAgdGhpcy5tb2RlbC5vbihcImNoYW5nZTpyZWFjdGlvbl90eXBlXCIsIGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgc2VsZi51cGRhdGVTdG9pY2hTcGVjaWVzRm9yUmVhY3Rpb25UeXBlKG1vZGVsLnJlYWN0aW9uVHlwZSk7XG4gICAgfSk7XG4gICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy51cGRhdGVSZWFjdGlvblR5cGVPcHRpb25zLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIG9wdGlvbnMgPSBbXTtcbiAgICBpZih0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnMubGVuZ3RoIDw9IDApe1xuICAgICAgb3B0aW9ucyA9IFtcIkN1c3RvbSBwcm9wZW5zaXR5XCJdO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0UmVhY3Rpb25UeXBlTGFiZWxzKCk7XG4gICAgfVxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmVhY3Rpb25UeXBlU2VsZWN0VmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnUmVhY3Rpb24gVHlwZTonLFxuICAgICAgbmFtZTogJ3JlYWN0aW9uLXR5cGUnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBpZEF0dHJpYnV0ZTogJ2NpZCcsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgdmFsdWU6IFJlYWN0aW9uVHlwZXNbc2VsZi5tb2RlbC5yZWFjdGlvblR5cGVdLmxhYmVsLFxuICAgIH0pO1xuICAgIHZhciByYXRlUGFyYW1ldGVyVmlldyA9IG5ldyBTZWxlY3RWaWV3KHtcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG5hbWU6ICdyYXRlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgaWRBdHRyaWJ1dGU6ICdjaWQnLFxuICAgICAgdGV4dEF0dHJpYnV0ZTogJ25hbWUnLFxuICAgICAgZWFnZXJWYWxpZGF0ZTogdHJ1ZSxcbiAgICAgIG9wdGlvbnM6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycyxcbiAgICAgIC8vIEZvciBuZXcgcmVhY3Rpb25zICh3aXRoIG5vIHJhdGUubmFtZSkganVzdCB1c2UgdGhlIGZpcnN0IHBhcmFtZXRlciBpbiB0aGUgUGFyYW1ldGVycyBjb2xsZWN0aW9uXG4gICAgICAvLyBFbHNlIGZldGNoIHRoZSByaWdodCBQYXJhbWV0ZXIgZnJvbSBQYXJhbWV0ZXJzIGJhc2VkIG9uIGV4aXN0aW5nIHJhdGVcbiAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLnJhdGUubmFtZSA/IHRoaXMuZ2V0UmF0ZUZyb21QYXJhbWV0ZXJzKHRoaXMubW9kZWwucmF0ZS5uYW1lKSA6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5hdCgwKSxcbiAgICB9KTtcbiAgICB2YXIgcHJvcGVuc2l0eVZpZXcgPSBuZXcgSW5wdXRWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgbmFtZTogJ3JhdGUnLFxuICAgICAgbGFiZWw6ICcnLFxuICAgICAgdGVzdHM6JycsXG4gICAgICBtb2RlbEtleToncHJvcGVuc2l0eScsXG4gICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgdmFsdWU6IHRoaXMubW9kZWwucHJvcGVuc2l0eVxuICAgIH0pO1xuICAgIHZhciBzdWJkb21haW5zVmlldyA9IG5ldyBSZWFjdGlvblN1YmRvbWFpbnNWaWV3KHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIGlzUmVhY3Rpb246IHRydWUsXG4gICAgfSlcbiAgICB2YXIgcmVhY3RhbnRzVmlldyA9IG5ldyBSZWFjdGFudFByb2R1Y3RWaWV3KHtcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMubW9kZWwucmVhY3RhbnRzLFxuICAgICAgc3BlY2llczogdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLFxuICAgICAgcmVhY3Rpb25UeXBlOiB0aGlzLm1vZGVsLnJlYWN0aW9uVHlwZSxcbiAgICAgIGZpZWxkVGl0bGU6ICdSZWFjdGFudHMnLFxuICAgICAgaXNSZWFjdGFudHM6IHRydWVcbiAgICB9KTtcbiAgICB2YXIgcHJvZHVjdHNWaWV3ID0gbmV3IFJlYWN0YW50UHJvZHVjdFZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogdGhpcy5tb2RlbC5wcm9kdWN0cyxcbiAgICAgIHNwZWNpZXM6IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcyxcbiAgICAgIHJlYWN0aW9uVHlwZTogdGhpcy5tb2RlbC5yZWFjdGlvblR5cGUsXG4gICAgICBmaWVsZFRpdGxlOiAnUHJvZHVjdHMnLFxuICAgICAgaXNSZWFjdGFudHM6IGZhbHNlXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocmVhY3Rpb25UeXBlU2VsZWN0VmlldywgJ3NlbGVjdC1yZWFjdGlvbi10eXBlJyk7XG4gICAgdGhpcy5yZW5kZXJSZWFjdGlvblR5cGVzKCk7XG4gICAgaWYodGhpcy5tb2RlbC5yZWFjdGlvblR5cGUgPT09ICdjdXN0b20tcHJvcGVuc2l0eScpe1xuICAgICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocHJvcGVuc2l0eVZpZXcsICdzZWxlY3QtcmF0ZS1wYXJhbWV0ZXInKVxuICAgICAgdmFyIGlucHV0RmllbGQgPSB0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtcmF0ZS1wYXJhbWV0ZXInKS5jaGlsZHJlblswXS5jaGlsZHJlblsxXTtcbiAgICAgICQoaW5wdXRGaWVsZCkuYXR0cihcInBsYWNlaG9sZGVyXCIsIFwiLS0tTm8gRXhwcmVzc2lvbiBFbnRlcmVkLS0tXCIpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdyYXRlLXBhcmFtZXRlci1sYWJlbCcpKS50ZXh0KCdQcm9wZW5zaXR5OicpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3JhdGUtcGFyYW1ldGVyLXRvb2x0aXAnKSkucHJvcCgndGl0bGUnLCB0aGlzLnBhcmVudC50b29sdGlwcy5wcm9wZW5zaXR5KTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJhdGVQYXJhbWV0ZXJWaWV3LCAnc2VsZWN0LXJhdGUtcGFyYW1ldGVyJyk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3JhdGUtcGFyYW1ldGVyLWxhYmVsJykpLnRleHQoJ1JhdGUgUGFyYW1ldGVyOicpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3JhdGUtcGFyYW1ldGVyLXRvb2x0aXAnKSkucHJvcCgndGl0bGUnLCB0aGlzLnBhcmVudC50b29sdGlwcy5yYXRlKTtcbiAgICB9XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcoc3ViZG9tYWluc1ZpZXcsICdzdWJkb21haW5zLWVkaXRvcicpO1xuICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJTdWJ2aWV3KHJlYWN0YW50c1ZpZXcsICdyZWFjdGFudHMtZWRpdG9yJyk7XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlclN1YnZpZXcocHJvZHVjdHNWaWV3LCAncHJvZHVjdHMtZWRpdG9yJyk7XG4gICAgdGhpcy50b3RhbFJhdGlvID0gdGhpcy5nZXRUb3RhbFJlYWN0YW50UmF0aW8oKTtcbiAgICBpZih0aGlzLnBhcmVudC5jb2xsZWN0aW9uLnBhcmVudC5pc19zcGF0aWFsKVxuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzdWJkb21haW5zLWVkaXRvcicpKS5jb2xsYXBzZSgpO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcblxuICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlUmVhY3Rpb25UeXBlT3B0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH0sXG4gIHNlbGVjdFJhdGVQYXJhbTogZnVuY3Rpb24gKGUpIHtcbiAgICBpZih0aGlzLm1vZGVsLnJlYWN0aW9uVHlwZSAhPT0gJ2N1c3RvbS1wcm9wZW5zaXR5Jykge1xuICAgICAgdmFyIHZhbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnRleHQ7XG4gICAgICB2YXIgcGFyYW0gPSB0aGlzLmdldFJhdGVGcm9tUGFyYW1ldGVycyh2YWwpO1xuICAgICAgdGhpcy5tb2RlbC5yYXRlID0gcGFyYW0gfHwgdGhpcy5tb2RlbC5yYXRlO1xuICAgICAgdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgfVxuICB9LFxuICBnZXRSYXRlRnJvbVBhcmFtZXRlcnM6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgLy8gU2VlbXMgbGlrZSBtb2RlbC5yYXRlIGlzIG5vdCBhY3R1YWxseSBwYXJ0IG9mIHRoZSBQYXJhbWV0ZXJzIGNvbGxlY3Rpb25cbiAgICAvLyBHZXQgdGhlIFBhcmFtZXRlciBmcm9tIFBhcmFtZXRlcnMgdGhhdCBtYXRjaGVzIG1vZGVsLnJhdGVcbiAgICAvLyBUT0RPIHRoaXMgaXMgc29tZSBnYXJiYWdpbywgZ2V0IG1vZGVsLnJhdGUgaW50byBQYXJhbWV0ZXJzIGNvbGxlY3Rpb24uLi4/XG4gICAgaWYgKCFuYW1lKSAgeyBuYW1lID0gdGhpcy5tb2RlbC5yYXRlLm5hbWUgfSBcbiAgICB2YXIgcmF0ZSA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5maWx0ZXIoZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICByZXR1cm4gcGFyYW0ubmFtZSA9PT0gbmFtZTtcbiAgICB9KVswXTtcbiAgICByZXR1cm4gcmF0ZSBcbiAgfSxcbiAgc2VsZWN0UmVhY3Rpb25UeXBlOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBsYWJlbCA9IGUudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucy5pdGVtKDApLnZhbHVlO1xuICAgIHZhciB0eXBlID0gXy5maW5kS2V5KFJlYWN0aW9uVHlwZXMsIGZ1bmN0aW9uIChvKSB7IHJldHVybiBvLmxhYmVsID09PSBsYWJlbDsgfSk7XG4gICAgdGhpcy5tb2RlbC5yZWFjdGlvblR5cGUgPSB0eXBlO1xuICAgIHRoaXMubW9kZWwuc3VtbWFyeSA9IGxhYmVsXG4gICAgdGhpcy51cGRhdGVTdG9pY2hTcGVjaWVzRm9yUmVhY3Rpb25UeXBlKHR5cGUpO1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgIHRoaXMubW9kZWwudHJpZ2dlcignY2hhbmdlLXJlYWN0aW9uJylcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9LFxuICB1cGRhdGVTdG9pY2hTcGVjaWVzRm9yUmVhY3Rpb25UeXBlOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciBhcmdzID0gdGhpcy5wYXJlbnQuZ2V0U3RvaWNoQXJnc0ZvclJlYWN0aW9uVHlwZSh0eXBlKTtcbiAgICB2YXIgbmV3UmVhY3RhbnRzID0gdGhpcy5nZXRBcnJheU9mRGVmYXVsdFN0b2ljaFNwZWNpZXMoYXJncy5yZWFjdGFudHMpO1xuICAgIHZhciBuZXdQcm9kdWN0cyA9IHRoaXMuZ2V0QXJyYXlPZkRlZmF1bHRTdG9pY2hTcGVjaWVzKGFyZ3MucHJvZHVjdHMpO1xuICAgIHRoaXMubW9kZWwucmVhY3RhbnRzLnJlc2V0KG5ld1JlYWN0YW50cyk7XG4gICAgdGhpcy5tb2RlbC5wcm9kdWN0cy5yZXNldChuZXdQcm9kdWN0cyk7XG4gICAgaWYodHlwZSAhPT0gJ2N1c3RvbS1wcm9wZW5zaXR5JylcbiAgICAgIHRoaXMubW9kZWwucmF0ZSA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5nZXREZWZhdWx0UmF0ZSgpO1xuICB9LFxuICBnZXRBcnJheU9mRGVmYXVsdFN0b2ljaFNwZWNpZXM6IGZ1bmN0aW9uIChhcnIpIHtcbiAgICByZXR1cm4gYXJyLm1hcChmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICB2YXIgc3RvaWNoU3BlY2llID0gbmV3IFN0b2ljaFNwZWNpZShwYXJhbXMpO1xuICAgICAgc3RvaWNoU3BlY2llLnNwZWNpZSA9IHRoaXMucGFyZW50LmdldERlZmF1bHRTcGVjaWUoKTtcbiAgICAgIHJldHVybiBzdG9pY2hTcGVjaWU7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIGdldFJlYWN0aW9uVHlwZUxhYmVsczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfLm1hcChSZWFjdGlvblR5cGVzLCBmdW5jdGlvbiAodmFsLCBrZXkpIHsgcmV0dXJuIHZhbC5sYWJlbDsgfSlcbiAgfSxcbiAgcmVnaXN0ZXJSZW5kZXJTdWJ2aWV3OiBmdW5jdGlvbiAodmlldywgaG9vaykge1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHZpZXcpO1xuICAgIHRoaXMucmVuZGVyU3Vidmlldyh2aWV3LCB0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKTtcbiAgfSxcbiAgZ2V0VG90YWxSZWFjdGFudFJhdGlvOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwucmVhY3RhbnRzLmxlbmd0aDtcbiAgfSxcbiAgdXBkYXRlU3ViZG9tYWluczogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgc3ViZG9tYWluID0gZWxlbWVudC52YWx1ZS5tb2RlbDtcbiAgICB2YXIgY2hlY2tlZCA9IGVsZW1lbnQudmFsdWUuY2hlY2tlZDtcblxuICAgIGlmKGNoZWNrZWQpXG4gICAgICB0aGlzLm1vZGVsLnN1YmRvbWFpbnMgPSBfLnVuaW9uKHRoaXMubW9kZWwuc3ViZG9tYWlucywgW3N1YmRvbWFpbi5uYW1lXSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5tb2RlbC5zdWJkb21haW5zID0gXy5kaWZmZXJlbmNlKHRoaXMubW9kZWwuc3ViZG9tYWlucywgW3N1YmRvbWFpbi5uYW1lXSk7XG4gIH0sXG4gIHJlbmRlclJlYWN0aW9uVHlwZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGRpc3BsYXlNb2RlOiB0cnVlLFxuICAgICAgb3V0cHV0OiAnaHRtbCdcbiAgICB9XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2NyZWF0aW9uJ10ubGFiZWwsIHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1yZWFjdGlvbi10eXBlJykuZmlyc3RDaGlsZC5jaGlsZHJlblsxXVsnMCddLCBvcHRpb25zKTtcbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snZGVzdHJ1Y3Rpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LXJlYWN0aW9uLXR5cGUnKS5maXJzdENoaWxkLmNoaWxkcmVuWzFdWycxJ10sIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydjaGFuZ2UnXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LXJlYWN0aW9uLXR5cGUnKS5maXJzdENoaWxkLmNoaWxkcmVuWzFdWycyJ10sIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydkaW1lcml6YXRpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc2VsZWN0LXJlYWN0aW9uLXR5cGUnKS5maXJzdENoaWxkLmNoaWxkcmVuWzFdWyczJ10sIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydtZXJnZSddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtcmVhY3Rpb24tdHlwZScpLmZpcnN0Q2hpbGQuY2hpbGRyZW5bMV1bJzQnXSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ3NwbGl0J10ubGFiZWwsIHRoaXMucXVlcnlCeUhvb2soJ3NlbGVjdC1yZWFjdGlvbi10eXBlJykuZmlyc3RDaGlsZC5jaGlsZHJlblsxXVsnNSddLCBvcHRpb25zKTtcbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snZm91ciddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdzZWxlY3QtcmVhY3Rpb24tdHlwZScpLmZpcnN0Q2hpbGQuY2hpbGRyZW5bMV1bJzYnXSwgb3B0aW9ucyk7XG4gIH0sXG59KTsiLCJ2YXIgdGVzdHMgPSByZXF1aXJlKCcuL3Rlc3RzJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIGthdGV4ID0gcmVxdWlyZSgna2F0ZXgnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBJbnB1dFZpZXcgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uTGlzdGluZy5wdWcnKTtcblxubGV0IHJlYWN0aW9uQW5ub3RhdGlvbk1vZGFsSHRtbCA9IChyZWFjdGlvbk5hbWUsIGFubm90YXRpb24pID0+IHtcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGlkPVwicmVhY3Rpb25Bbm5vdGF0aW9uTW9kYWxcIiBjbGFzcz1cIm1vZGFsXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkFubm90YXRpb24gZm9yICR7cmVhY3Rpb25OYW1lfTwvaDU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICA8c3BhbiBmb3I9XCJyZWFjdGlvbkFubm90YXRpb25JbnB1dFwiPkFubm90YXRpb246IDwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwicmVhY3Rpb25Bbm5vdGF0aW9uSW5wdXRcIiBuYW1lPVwicmVhY3Rpb25Bbm5vdGF0aW9uSW5wdXRcIiBzaXplPVwiMzBcIiBhdXRvZm9jdXMgdmFsdWU9XCIke2Fubm90YXRpb259XCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgb2stbW9kZWwtYnRuXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubmFtZScgOiB7XG4gICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgaG9vazogJ2lucHV0LW5hbWUtY29udGFpbmVyJ1xuICAgIH0sXG4gICAgJ21vZGVsLnN1bW1hcnknIDoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICBrYXRleC5yZW5kZXIodGhpcy5tb2RlbC5zdW1tYXJ5LCB0aGlzLnF1ZXJ5QnlIb29rKCdzdW1tYXJ5JyksIHtcbiAgICAgICAgICBkaXNwbGF5TW9kZTogdHJ1ZSxcbiAgICAgICAgICBvdXRwdXQ6ICdodG1sJyxcbiAgICAgICAgICBtYXhTaXplOiA1LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBob29rOiAnc3VtbWFyeScsXG4gICAgfSxcbiAgICAnbW9kZWwuc2VsZWN0ZWQnIDoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSwgcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICBlbC5jaGVja2VkID0gdmFsdWU7XG4gICAgICB9LFxuICAgICAgaG9vazogJ3NlbGVjdCdcbiAgICB9XG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPWVkaXQtYW5ub3RhdGlvbi1idG5dJyA6ICdlZGl0QW5ub3RhdGlvbicsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9c2VsZWN0XScgIDogJ3NlbGVjdFJlYWN0aW9uJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1yZW1vdmVdJyAgOiAncmVtb3ZlUmVhY3Rpb24nXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgJChkb2N1bWVudCkub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoJ1thdXRvZm9jdXNdJywgZS50YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgaWYoIXRoaXMubW9kZWwuYW5ub3RhdGlvbil7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2VkaXQtYW5ub3RhdGlvbi1idG4nKSkudGV4dCgnQWRkJylcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICBzZWxlY3RSZWFjdGlvbjogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24udHJpZ2dlcihcInNlbGVjdFwiLCB0aGlzLm1vZGVsKTtcbiAgfSxcbiAgcmVtb3ZlUmVhY3Rpb246IGZ1bmN0aW9uIChlKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVJlYWN0aW9uKHRoaXMubW9kZWwpO1xuICAgIHRoaXMucGFyZW50LmNvbGxlY3Rpb24udHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgfSxcbiAgZWRpdEFubm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLm1vZGVsLm5hbWU7XG4gICAgdmFyIGFubm90YXRpb24gPSB0aGlzLm1vZGVsLmFubm90YXRpb247XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JlYWN0aW9uQW5ub3RhdGlvbk1vZGFsJykpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZWFjdGlvbkFubm90YXRpb25Nb2RhbCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKHJlYWN0aW9uQW5ub3RhdGlvbk1vZGFsSHRtbChuYW1lLCBhbm5vdGF0aW9uKSkubW9kYWwoKTtcbiAgICBsZXQgb2tCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVhY3Rpb25Bbm5vdGF0aW9uTW9kYWwgLm9rLW1vZGVsLWJ0bicpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZWFjdGlvbkFubm90YXRpb25Nb2RhbCAjcmVhY3Rpb25Bbm5vdGF0aW9uSW5wdXQnKTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9rQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgb2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5tb2RlbC5hbm5vdGF0aW9uID0gaW5wdXQudmFsdWU7XG4gICAgICBzZWxmLnBhcmVudC5yZW5kZXJSZWFjdGlvbkxpc3RpbmdWaWV3KCk7XG4gICAgICBtb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgIH0pO1xuICB9LFxuICBzdWJ2aWV3czoge1xuICAgIGlucHV0TmFtZToge1xuICAgICAgaG9vazogJ2lucHV0LW5hbWUtY29udGFpbmVyJyxcbiAgICAgIHByZXBhcmVWaWV3OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnB1dFZpZXcoe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgIHRlc3RzOiB0ZXN0cy5uYW1lVGVzdHMsXG4gICAgICAgICAgbW9kZWxLZXk6ICduYW1lJyxcbiAgICAgICAgICB2YWx1ZVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1vZGVsLm5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7IiwiLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIFN1YmRvbWFpbnNWaWV3ID0gcmVxdWlyZSgnLi9zdWJkb21haW4nKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25TdWJkb21haW5zLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXJncykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmlzUmVhY3Rpb24gPSBhcmdzLmlzUmVhY3Rpb247XG4gICAgdGhpcy5iYXNlTW9kZWwgPSB0aGlzLnBhcmVudC5wYXJlbnQuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgdGhpcy5iYXNlTW9kZWwub24oJ21lc2gtdXBkYXRlJywgdGhpcy51cGRhdGVEZWZhdWx0U3ViZG9tYWlucywgdGhpcyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucmVuZGVyU3ViZG9tYWlucygpO1xuICB9LFxuICB1cGRhdGVEZWZhdWx0U3ViZG9tYWluczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGFyZW50Lm1vZGVsLnN1YmRvbWFpbnMgPSB0aGlzLmJhc2VNb2RlbC5tZXNoU2V0dGluZ3MudW5pcXVlU3ViZG9tYWlucy5tYXAoZnVuY3Rpb24gKG1vZGVsKSB7cmV0dXJuIG1vZGVsLm5hbWU7IH0pO1xuICAgIHRoaXMucmVuZGVyU3ViZG9tYWlucygpO1xuICB9LFxuICByZW5kZXJTdWJkb21haW5zOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5iYXNlTW9kZWwgPSB0aGlzLnBhcmVudC5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICBpZih0aGlzLnN1YmRvbWFpbnNWaWV3KVxuICAgICAgdGhpcy5zdWJkb21haW5zVmlldy5yZW1vdmUoKTtcbiAgICB2YXIgc3ViZG9tYWlucyA9IHRoaXMuYmFzZU1vZGVsLm1lc2hTZXR0aW5ncy51bmlxdWVTdWJkb21haW5zO1xuICAgIHRoaXMuc3ViZG9tYWluc1ZpZXcgPSB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICBzdWJkb21haW5zLFxuICAgICAgU3ViZG9tYWluc1ZpZXcsXG4gICAgICB0aGlzLnF1ZXJ5QnlIb29rKCdyZWFjdGlvbi1zdWJkb21haW5zJylcbiAgICApO1xuICB9LFxuICB1cGRhdGVTdWJkb21haW5zOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHRoaXMucGFyZW50LnVwZGF0ZVN1YmRvbWFpbnMoZWxlbWVudCk7XG4gIH0sXG59KTsiLCJ2YXIgVmlld1N3aXRjaGVyID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXctc3dpdGNoZXInKTtcbnZhciBrYXRleCA9IHJlcXVpcmUoJ2thdGV4Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3N1cHBvcnQgZmlsZXNcbnZhciBSZWFjdGlvblR5cGVzID0gcmVxdWlyZSgnLi4vcmVhY3Rpb24tdHlwZXMnKTtcbnZhciBUb29sdGlwcyA9IHJlcXVpcmUoJy4uL3Rvb2x0aXBzJyk7XG4vL21vZGVsc1xudmFyIFN0b2ljaFNwZWNpZXNDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL3N0b2ljaC1zcGVjaWVzJyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgUmVhY3Rpb25MaXN0aW5nVmlldyA9IHJlcXVpcmUoJy4vcmVhY3Rpb24tbGlzdGluZycpO1xudmFyIFJlYWN0aW9uRGV0YWlsc1ZpZXcgPSByZXF1aXJlKCcuL3JlYWN0aW9uLWRldGFpbHMnKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvcmVhY3Rpb25zRWRpdG9yLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jcmVhdGlvbl0nICAgICAgICAgICAgICAgOiAnaGFuZGxlQWRkUmVhY3Rpb25DbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9ZGVzdHJ1Y3Rpb25dJyAgICAgICAgICAgIDogJ2hhbmRsZUFkZFJlYWN0aW9uQ2xpY2snLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNoYW5nZV0nICAgICAgICAgICAgICAgICA6ICdoYW5kbGVBZGRSZWFjdGlvbkNsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1kaW1lcml6YXRpb25dJyAgICAgICAgICAgOiAnaGFuZGxlQWRkUmVhY3Rpb25DbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9bWVyZ2VdJyAgICAgICAgICAgICAgICAgIDogJ2hhbmRsZUFkZFJlYWN0aW9uQ2xpY2snLFxuICAgICdjbGljayBbZGF0YS1ob29rPXNwbGl0XScgICAgICAgICAgICAgICAgICA6ICdoYW5kbGVBZGRSZWFjdGlvbkNsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1mb3VyXScgICAgICAgICAgICAgICAgICAgOiAnaGFuZGxlQWRkUmVhY3Rpb25DbGljaycsXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y3VzdG9tLW1hc3NhY3Rpb25dJyAgICAgIDogJ2hhbmRsZUFkZFJlYWN0aW9uQ2xpY2snLFxuICAgICdjbGljayBbZGF0YS1ob29rPWN1c3RvbS1wcm9wZW5zaXR5XScgICAgICA6ICdoYW5kbGVBZGRSZWFjdGlvbkNsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCdcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XG4gICAgVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5yZWFjdGlvbnNFZGl0b3JcbiAgICB0aGlzLmNvbGxlY3Rpb24ub24oXCJzZWxlY3RcIiwgZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB0aGlzLnNldFNlbGVjdGVkUmVhY3Rpb24ocmVhY3Rpb24pO1xuICAgICAgdGhpcy5zZXREZXRhaWxzVmlldyhyZWFjdGlvbik7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKFwicmVtb3ZlXCIsIGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgLy8gU2VsZWN0IHRoZSBsYXN0IHJlYWN0aW9uIGJ5IGRlZmF1bHRcbiAgICAgIC8vIEJ1dCBvbmx5IGlmIHRoZXJlIGFyZSBvdGhlciByZWFjdGlvbnMgb3RoZXIgdGhhbiB0aGUgb25lIHdlJ3JlIHJlbW92aW5nXG4gICAgICBpZiAocmVhY3Rpb24uZGV0YWlsc1ZpZXcpXG4gICAgICAgIHJlYWN0aW9uLmRldGFpbHNWaWV3LnJlbW92ZSgpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnJlbW92ZVJlYWN0aW9uKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZCA9IHRoaXMuY29sbGVjdGlvbi5hdCh0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoLTEpO1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24udHJpZ2dlcihcInNlbGVjdFwiLCBzZWxlY3RlZCk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVBZGRSZWFjdGlvbkJ1dHRvbiwgdGhpcyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVSZWFjdGlvblR5cGVzLCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5yZW5kZXJSZWFjdGlvbkxpc3RpbmdWaWV3KCk7XG4gICAgdGhpcy5kZXRhaWxzQ29udGFpbmVyID0gdGhpcy5xdWVyeUJ5SG9vaygncmVhY3Rpb24tZGV0YWlscy1jb250YWluZXInKTtcbiAgICB0aGlzLmRldGFpbHNWaWV3U3dpdGNoZXIgPSBuZXcgVmlld1N3aXRjaGVyKHtcbiAgICAgIGVsOiB0aGlzLmRldGFpbHNDb250YWluZXIsXG4gICAgfSk7XG4gICAgaWYgKHRoaXMuY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWRSZWFjdGlvbih0aGlzLmNvbGxlY3Rpb24uYXQoMCkpO1xuICAgICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJzZWxlY3RcIiwgdGhpcy5zZWxlY3RlZFJlYWN0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5jb2xsZWN0aW9uLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG4gICAgdGhpcy50b2dnbGVBZGRSZWFjdGlvbkJ1dHRvbigpO1xuICAgIGlmKHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPiAwKXtcbiAgICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1yZWFjdGlvbi1wYXJ0aWFsJykpLnByb3AoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tZnVsbCcpKS5wcm9wKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJSZWFjdGlvblR5cGVzKCk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICB1cGRhdGVWYWxpZDogZnVuY3Rpb24gKCkge1xuICB9LFxuICByZW5kZXJSZWFjdGlvbkxpc3RpbmdWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5yZWFjdGlvbkxpc3RpbmdWaWV3KXtcbiAgICAgIHRoaXMucmVhY3Rpb25MaXN0aW5nVmlldy5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5yZWFjdGlvbkxpc3RpbmdWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgUmVhY3Rpb25MaXN0aW5nVmlldyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ3JlYWN0aW9uLWxpc3QnKVxuICAgICk7XG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICB0b2dnbGVBZGRSZWFjdGlvbkJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWRkLXJlYWN0aW9uLWZ1bGwnKSkucHJvcCgnZGlzYWJsZWQnLCAodGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLmxlbmd0aCA8PSAwKSk7XG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tcGFydGlhbCcpKS5wcm9wKCdkaXNhYmxlZCcsICh0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXMubGVuZ3RoIDw9IDApKTtcbiAgfSxcbiAgdG9nZ2xlUmVhY3Rpb25UeXBlczogZnVuY3Rpb24gKGUsIHByZXYsIGN1cnIpIHtcbiAgICBpZihjdXJyICYmIGN1cnIuYWRkICYmIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPT09IDEpe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tZnVsbCcpKS5wcm9wKCdoaWRkZW4nLCBmYWxzZSk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkZC1yZWFjdGlvbi1wYXJ0aWFsJykpLnByb3AoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1lbHNlIGlmKGN1cnIgJiYgIWN1cnIuYWRkICYmIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQucGFyYW1ldGVycy5sZW5ndGggPT09IDApe1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcmVhY3Rpb24tZnVsbCcpKS5wcm9wKCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWRkLXJlYWN0aW9uLXBhcnRpYWwnKSkucHJvcCgnaGlkZGVuJywgZmFsc2UpO1xuICAgIH1cbiAgfSxcbiAgc2V0U2VsZWN0ZWRSZWFjdGlvbjogZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG0pIHsgbS5zZWxlY3RlZCA9IGZhbHNlOyB9KTtcbiAgICByZWFjdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3RlZFJlYWN0aW9uID0gcmVhY3Rpb247XG4gIH0sXG4gIHNldERldGFpbHNWaWV3OiBmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICByZWFjdGlvbi5kZXRhaWxzVmlldyA9IHJlYWN0aW9uLmRldGFpbHNWaWV3IHx8IHRoaXMubmV3RGV0YWlsc1ZpZXcocmVhY3Rpb24pO1xuICAgIHRoaXMuZGV0YWlsc1ZpZXdTd2l0Y2hlci5zZXQocmVhY3Rpb24uZGV0YWlsc1ZpZXcpO1xuICB9LFxuICBoYW5kbGVBZGRSZWFjdGlvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgIHZhciByZWFjdGlvblR5cGUgPSBlLmRlbGVnYXRlVGFyZ2V0LmRhdGFzZXQuaG9vaztcbiAgICB2YXIgc3RvaWNoQXJncyA9IHRoaXMuZ2V0U3RvaWNoQXJnc0ZvclJlYWN0aW9uVHlwZShyZWFjdGlvblR5cGUpO1xuICAgIHZhciBzdWJkb21haW5zID0gdGhpcy5wYXJlbnQubW9kZWwubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMubWFwKGZ1bmN0aW9uIChtb2RlbCkge3JldHVybiBtb2RlbC5uYW1lfSlcbiAgICB2YXIgcmVhY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb24uYWRkUmVhY3Rpb24ocmVhY3Rpb25UeXBlLCBzdG9pY2hBcmdzLCBzdWJkb21haW5zKTtcbiAgICByZWFjdGlvbi5kZXRhaWxzVmlldyA9IHRoaXMubmV3RGV0YWlsc1ZpZXcocmVhY3Rpb24pO1xuICAgIHRoaXMuY29sbGVjdGlvbi50cmlnZ2VyKFwic2VsZWN0XCIsIHJlYWN0aW9uKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG5cbiAgICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0U3RvaWNoQXJnc0ZvclJlYWN0aW9uVHlwZTogZnVuY3Rpb24odHlwZSkge1xuICAgIHZhciBhcmdzID0gUmVhY3Rpb25UeXBlc1t0eXBlXTtcbiAgICByZXR1cm4gYXJncztcbiAgfSxcbiAgbmV3RGV0YWlsc1ZpZXc6IGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgIHZhciBkZXRhaWxzVmlldyA9IG5ldyBSZWFjdGlvbkRldGFpbHNWaWV3KHsgbW9kZWw6IHJlYWN0aW9uIH0pO1xuICAgIGRldGFpbHNWaWV3LnBhcmVudCA9IHRoaXM7XG4gICAgcmV0dXJuIGRldGFpbHNWaWV3XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJylcbiAgfSxcbiAgZ2V0RGVmYXVsdFNwZWNpZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuc3BlY2llcy5tb2RlbHNbMF07XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICBnZXRBbm5vdGF0aW9uOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiBSZWFjdGlvblR5cGVzW3R5cGVdLmxhYmVsXG4gIH0sXG4gIHJlbmRlclJlYWN0aW9uVHlwZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGRpc3BsYXlNb2RlOiBmYWxzZSxcbiAgICAgIG91dHB1dDogJ2h0bWwnLFxuICAgIH1cbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snY3JlYXRpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnY3JlYXRpb24nKSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2Rlc3RydWN0aW9uJ10ubGFiZWwsIHRoaXMucXVlcnlCeUhvb2soJ2Rlc3RydWN0aW9uJyksIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydjaGFuZ2UnXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnY2hhbmdlJyksIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydkaW1lcml6YXRpb24nXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnZGltZXJpemF0aW9uJyksIG9wdGlvbnMpO1xuICAgIGthdGV4LnJlbmRlcihSZWFjdGlvblR5cGVzWydtZXJnZSddLmxhYmVsLCB0aGlzLnF1ZXJ5QnlIb29rKCdtZXJnZScpLCBvcHRpb25zKTtcbiAgICBrYXRleC5yZW5kZXIoUmVhY3Rpb25UeXBlc1snc3BsaXQnXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnc3BsaXQnKSwgb3B0aW9ucyk7XG4gICAga2F0ZXgucmVuZGVyKFJlYWN0aW9uVHlwZXNbJ2ZvdXInXS5sYWJlbCwgdGhpcy5xdWVyeUJ5SG9vaygnZm91cicpLCBvcHRpb25zKTtcbiAgfVxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vc3VwcG9ydCBmaWxlc1xudmFyIFRvb2x0aXBzID0gcmVxdWlyZSgnLi4vdG9vbHRpcHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBSdWxlVmlldyA9IHJlcXVpcmUoJy4vZWRpdC1ydWxlJyk7XG4vL3RlbXBsYXRlc1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3J1bGVFZGl0b3IucHVnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gIGV2ZW50czoge1xuICAgICdjbGljayBbZGF0YS1ob29rPXJhdGUtcnVsZV0nIDogJ2FkZFJ1bGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWFzc2lnbm1lbnQtcnVsZV0nIDogJ2FkZFJ1bGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWNvbGxhcHNlXScgOiAnY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0JyxcbiAgfSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5zcGVjaWVzLm9uKCdhZGQgcmVtb3ZlJywgdGhpcy50b2dnbGVBZGRSdWxlQnV0dG9uLCB0aGlzKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnBhcmFtZXRlcnMub24oJ2FkZCByZW1vdmUnLCB0aGlzLnRvZ2dsZUFkZFJ1bGVCdXR0b24sIHRoaXMpO1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5ydWxlc0VkaXRvclxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlclJ1bGVzKCk7XG4gICAgdGhpcy50b2dnbGVBZGRSdWxlQnV0dG9uKClcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHVwZGF0ZVZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIHJlbmRlclJ1bGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5ydWxlc1ZpZXcpIHtcbiAgICAgIHRoaXMucnVsZXNWaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLnJ1bGVzVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbihcbiAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgIFJ1bGVWaWV3LFxuICAgICAgdGhpcy5xdWVyeUJ5SG9vaygncnVsZS1saXN0LWNvbnRhaW5lcicpXG4gICAgKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIHRvZ2dsZUFkZFJ1bGVCdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlclJ1bGVzKCk7XG4gICAgdmFyIG51bVNwZWNpZXMgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnNwZWNpZXMubGVuZ3RoO1xuICAgIHZhciBudW1QYXJhbWV0ZXJzID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5wYXJhbWV0ZXJzLmxlbmd0aDtcbiAgICB2YXIgZGlzYWJsZWQgPSBudW1TcGVjaWVzIDw9IDAgJiYgbnVtUGFyYW1ldGVycyA8PSAwXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdhZGQtcnVsZScpKS5wcm9wKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcbiAgfSxcbiAgYWRkUnVsZTogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgdHlwZSA9IGUudGFyZ2V0LmRhdGFzZXQubmFtZVxuICAgIHRoaXMuY29sbGVjdGlvbi5hZGRSdWxlKHR5cGUpO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcblxuICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHRleHQgPSAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoKTtcbiAgICB0ZXh0ID09PSAnKycgPyAkKHRoaXMucXVlcnlCeUhvb2soJ2NvbGxhcHNlJykpLnRleHQoJy0nKSA6ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnKycpO1xuICB9LFxufSk7IiwidmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vc3VwcG9ydCBmaWxlc1xudmFyIFRvb2x0aXBzID0gcmVxdWlyZSgnLi4vdG9vbHRpcHMnKTtcbi8vdmlld3NcbnZhciBWaWV3ID0gcmVxdWlyZSgnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBFZGl0RnVuY3Rpb25EZWZpbml0aW9uID0gcmVxdWlyZSgnLi9lZGl0LWZ1bmN0aW9uLWRlZmluaXRpb24nKTtcbi8vdGVtcGxhdGVzXG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvaW5jbHVkZXMvc2JtbENvbXBvbmVudEVkaXRvci5wdWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2VdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KCdjb2xsYXBzZScpO1xuICAgIH0sXG4gICAgJ2NsaWNrIFtkYXRhLWhvb2s9Y29sbGFwc2UtZnVuY3Rpb24tZGVmaW5pdGlvbnNdJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2hhbmdlQ29sbGFwc2VCdXR0b25UZXh0KCdjb2xsYXBzZS1mdW5jdGlvbi1kZWZpbml0aW9ucycpO1xuICAgIH0sXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRvb2x0aXBzID0gVG9vbHRpcHMuc2JtbENvbXBvbmVudHNFZGl0b3JcbiAgICB0aGlzLmZ1bmN0aW9uRGVmaW5pdGlvbnMgPSBhdHRycy5mdW5jdGlvbkRlZmluaXRpb25zO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBWaWV3LnByb3RvdHlwZS5yZW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnJlbmRlckVkaXJGdW5jdGlvbkRlZmluaXRpb25WaWV3KCk7XG4gIH0sXG4gIHJlbmRlckVkaXJGdW5jdGlvbkRlZmluaXRpb25WaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5lZGl0RnVuY3Rpb25EZWZpbml0aW9uVmlldyl7XG4gICAgICB0aGlzLmVkaXRGdW5jdGlvbkRlZmluaXRpb25WaWV3LnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmVkaXRGdW5jdGlvbkRlZmluaXRpb25WaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKFxuICAgICAgdGhpcy5mdW5jdGlvbkRlZmluaXRpb25zLFxuICAgICAgRWRpdEZ1bmN0aW9uRGVmaW5pdGlvbixcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ2Z1bmN0aW9uLWRlZmluaXRpb24tbGlzdCcpXG4gICAgKTtcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoXCJoaWRlXCIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGNoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dDogZnVuY3Rpb24gKGhvb2spIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vayhob29rKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vayhob29rKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKGhvb2spKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuLy9zdXBwb3J0IGZpbGVzXG52YXIgVG9vbHRpcHMgPSByZXF1aXJlKCcuLi90b29sdGlwcycpO1xuLy92aWV3c1xudmFyIFZpZXcgPSByZXF1aXJlKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIEVkaXROb25zcGF0aWFsU3BlY2llVmlldyA9IHJlcXVpcmUoJy4vZWRpdC1zcGVjaWUnKTtcbnZhciBFZGl0U3BhdGlhbFNwZWNpZVZpZXcgPSByZXF1aXJlKCcuL2VkaXQtc3BhdGlhbC1zcGVjaWUnKTtcbnZhciBFZGl0QWR2YW5jZWRTcGVjaWUgPSByZXF1aXJlKCcuL2VkaXQtYWR2YW5jZWQtc3BlY2llJyk7XG4vL3RlbXBsYXRlc1xudmFyIG5vbnNwYXRpYWxTcGVjaWVUZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zcGVjaWVzRWRpdG9yLnB1ZycpO1xudmFyIHNwYXRpYWxTcGVjaWVUZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9pbmNsdWRlcy9zcGF0aWFsU3BlY2llc0VkaXRvci5wdWcnKTtcblxubGV0IHJlbmRlckRlZmF1bHRNb2RlTW9kYWxIdG1sID0gKCkgPT4ge1xuICBsZXQgY29uY2VudHJhdGlvbkRlc2NpcHRpb24gPSBgU3BlY2llcyB3aWxsIG9ubHkgYmUgcmVwcmVzZW50ZWQgZGV0ZXJtaW5pc3RpY2FsbHkuYDtcbiAgbGV0IHBvcHVsYXRpb25EZXNjcmlwdGlvbiA9IGBTcGVjaWVzIHdpbGwgb25seSBiZSByZXByZXNlbnRlZCBzdG9jaGFzdGljYWxseS5gO1xuICBsZXQgaHlicmlkRGVzY3JpcHRpb24gPSBgQWxsb3dzIGEgc3BlY2llcyB0byBiZSByZXByZXNlbnRlZCBkZXRlcm1pbmlzdGljYWxseSBhbmQvb3Igc3RvY2hhc3RpY2FsbHkuICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGlzIGFsbG93IHlvdSB0byBjdXN0b21pemUgdGhlIG1vZGUgb2YgaW5kaXZpZHVhbCBzcGVjaWVzIGFuZCBzZXQgdGhlIHN3aXRjaGluZyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2xlcmFuY2Ugb3IgbWluaW11bSB2YWx1ZSBmb3Igc3dpdGNoaW5nLlwiYDtcblxuICByZXR1cm4gYFxuICAgIDxkaXYgaWQ9XCJkZWZhdWx0TW9kZU1vZGFsXCIgY2xhc3M9XCJtb2RhbFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50IGluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkRlZmF1bHQgU3BlY2llcyBNb2RlIChyZXF1aXJlZCk8L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZSBjbG9zZS1tb2RhbFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgVGhlIGRlZmF1bHQgbW9kZSBpcyB1c2VkIHRvIHNldCB0aGUgbW9kZSBvZiBhbGwgc3BlY2llcyBhZGRlZCB0byB0aGUgbW9kZWwuICBcbiAgICAgICAgICAgICAgICBUaGUgbW9kZSBvZiBhIHNwZWNpZXMgaXMgdXNlZCB0byBkZXRlcm1pbmUgaG93IGl0IHdpbGwgYmUgcmVwcmVzZW50ZWQgaW4gYSBIeWJyaWQgc2ltdWxhdGlvbi5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8cD5TZWxlY3Qgb25lIG9mIHRoZSBmb2xsb3dpbmc6IDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlZmF1bHQtbW9kZVwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBjb25jZW50cmF0aW9uLWJ0biBib3gtc2hhZG93XCI+Q29uY2VudHJhdGlvbjwvYnV0dG9uPlxuICAgICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbi10b3A6IDVweDtcIj4ke2NvbmNlbnRyYXRpb25EZXNjaXB0aW9ufTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlZmF1bHQtbW9kZVwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBwb3B1bGF0aW9uLWJ0biBib3gtc2hhZG93XCI+UG9wdWxhdGlvbjwvYnV0dG9uPlxuICAgICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbi10b3A6IDVweDtcIj4ke3BvcHVsYXRpb25EZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZWZhdWx0LW1vZGVcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgaHlicmlkLWJ0biBib3gtc2hhZG93XCI+SHlicmlkIENvbmNlbnRyYXRpb24vUG9wdWxhdGlvbjwvYnV0dG9uPlxuICAgICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbi10b3A6IDVweDtcIj4ke2h5YnJpZERlc2NyaXB0aW9ufTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2NoYW5nZSBbZGF0YS1ob29rPWFsbC1jb250aW51b3VzXScgOiAnZ2V0RGVmYXVsdFNwZWNpZXNNb2RlJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9YWxsLWRpc2NyZXRlXScgOiAnZ2V0RGVmYXVsdFNwZWNpZXNNb2RlJyxcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9YWR2YW5jZWRdJyA6ICdnZXREZWZhdWx0U3BlY2llc01vZGUnLFxuICAgICdjbGljayBbZGF0YS1ob29rPWFkZC1zcGVjaWVzXScgOiAnaGFuZGxlQWRkU3BlY2llc0NsaWNrJyxcbiAgICAnY2xpY2sgW2RhdGEtaG9vaz1jb2xsYXBzZV0nIDogJ2NoYW5nZUNvbGxhcHNlQnV0dG9uVGV4dCcsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5iYXNlTW9kZWwgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgIHRoaXMudG9vbHRpcHMgPSBUb29sdGlwcy5zcGVjaWVzRWRpdG9yXG4gICAgdGhpcy5jb2xsZWN0aW9uLm9uKCd1cGRhdGUtc3BlY2llcycsIGZ1bmN0aW9uIChjb21wSUQsIHNwZWNpZSwgaXNOYW1lVXBkYXRlKSB7XG4gICAgICBzZWxmLmNvbGxlY3Rpb24ucGFyZW50LnJlYWN0aW9ucy5tYXAoZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICAgIHJlYWN0aW9uLnJlYWN0YW50cy5tYXAoZnVuY3Rpb24gKHJlYWN0YW50KSB7XG4gICAgICAgICAgaWYocmVhY3RhbnQuc3BlY2llLmNvbXBJRCA9PT0gY29tcElEKSB7XG4gICAgICAgICAgICByZWFjdGFudC5zcGVjaWUgPSBzcGVjaWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmVhY3Rpb24ucHJvZHVjdHMubWFwKGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgICAgICAgaWYocHJvZHVjdC5zcGVjaWUuY29tcElEID09PSBjb21wSUQpIHtcbiAgICAgICAgICAgIHByb2R1Y3Quc3BlY2llID0gc3BlY2llO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmKGlzTmFtZVVwZGF0ZSkge1xuICAgICAgICAgIHJlYWN0aW9uLmJ1aWxkU3VtbWFyeSgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICByZWFjdGlvbi5jaGVja01vZGVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZi5jb2xsZWN0aW9uLnBhcmVudC5ldmVudHNDb2xsZWN0aW9uLm1hcChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuZXZlbnRBc3NpZ25tZW50cy5tYXAoZnVuY3Rpb24gKGFzc2lnbm1lbnQpIHtcbiAgICAgICAgICBpZihhc3NpZ25tZW50LnZhcmlhYmxlLmNvbXBJRCA9PT0gY29tcElEKSB7XG4gICAgICAgICAgICBhc3NpZ25tZW50LnZhcmlhYmxlID0gc3BlY2llO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYoaXNOYW1lVXBkYXRlICYmIGV2ZW50LnNlbGVjdGVkKSB7XG4gICAgICAgICAgZXZlbnQuZGV0YWlsc1ZpZXcucmVuZGVyRXZlbnRBc3NpZ25tZW50cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGYuY29sbGVjdGlvbi5wYXJlbnQucnVsZXMubWFwKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgIGlmKHJ1bGUudmFyaWFibGUuY29tcElEID09PSBjb21wSUQpIHtcbiAgICAgICAgICBydWxlLnZhcmlhYmxlID0gc3BlY2llO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmKGlzTmFtZVVwZGF0ZSkge1xuICAgICAgICBzZWxmLnJlbmRlclNwZWNpZXNBZHZhbmNlZFZpZXcoKTtcbiAgICAgICAgc2VsZi5wYXJlbnQucmVuZGVyUnVsZXNWaWV3KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLnBhcmVudC5tb2RlbC5pc19zcGF0aWFsID8gc3BhdGlhbFNwZWNpZVRlbXBsYXRlIDogbm9uc3BhdGlhbFNwZWNpZVRlbXBsYXRlO1xuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBkZWZhdWx0TW9kZSA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuZGVmYXVsdE1vZGU7XG4gICAgaWYoZGVmYXVsdE1vZGUgPT09IFwiXCIpe1xuICAgICAgdGhpcy5nZXRJbml0aWFsRGVmYXVsdFNwZWNpZXNNb2RlKCk7XG4gICAgfWVsc2V7XG4gICAgICB2YXIgZGF0YUhvb2tzID0geydjb250aW51b3VzJzonYWxsLWNvbnRpbnVvdXMnLCAnZGlzY3JldGUnOidhbGwtZGlzY3JldGUnLCAnZHluYW1pYyc6J2FkdmFuY2VkJ31cbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vayhkYXRhSG9va3NbdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5kZWZhdWx0TW9kZV0pKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcbiAgICAgIGlmKGRlZmF1bHRNb2RlID09PSBcImR5bmFtaWNcIil7XG4gICAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtc3BlY2llcycpKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlbmRlckVkaXRTcGVjaWVzVmlldygpO1xuICAgIHRoaXMucmVuZGVyU3BlY2llc0FkdmFuY2VkVmlldygpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgdXBkYXRlVmFsaWQ6IGZ1bmN0aW9uIChlKSB7XG4gIH0sXG4gIGdldEluaXRpYWxEZWZhdWx0U3BlY2llc01vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZmF1bHRNb2RlTW9kYWwnKSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlZmF1bHRNb2RlTW9kYWwnKS5yZW1vdmUoKVxuICAgIH1cbiAgICBsZXQgbW9kYWwgPSAkKHJlbmRlckRlZmF1bHRNb2RlTW9kYWxIdG1sKCkpLm1vZGFsKCk7XG4gICAgbGV0IGNvbnRpbnVvdXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVmYXVsdE1vZGVNb2RhbCAuY29uY2VudHJhdGlvbi1idG4nKTtcbiAgICBsZXQgZGlzY3JldGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVmYXVsdE1vZGVNb2RhbCAucG9wdWxhdGlvbi1idG4nKTtcbiAgICBsZXQgZHluYW1pYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWZhdWx0TW9kZU1vZGFsIC5oeWJyaWQtYnRuJyk7XG4gICAgY29udGludW91cy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLnNldEluaXRpYWxEZWZhdWx0TW9kZShtb2RhbCwgXCJjb250aW51b3VzXCIpO1xuICAgIH0pO1xuICAgIGRpc2NyZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGYuc2V0SW5pdGlhbERlZmF1bHRNb2RlKG1vZGFsLCBcImRpc2NyZXRlXCIpO1xuICAgIH0pO1xuICAgIGR5bmFtaWMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5zZXRJbml0aWFsRGVmYXVsdE1vZGUobW9kYWwsIFwiZHluYW1pY1wiKTtcbiAgICB9KTtcbiAgfSxcbiAgc2V0SW5pdGlhbERlZmF1bHRNb2RlOiBmdW5jdGlvbiAobW9kYWwsIG1vZGUpIHtcbiAgICB2YXIgZGF0YUhvb2tzID0geydjb250aW51b3VzJzonYWxsLWNvbnRpbnVvdXMnLCAnZGlzY3JldGUnOidhbGwtZGlzY3JldGUnLCAnZHluYW1pYyc6J2FkdmFuY2VkJ31cbiAgICBtb2RhbC5tb2RhbCgnaGlkZScpXG4gICAgJCh0aGlzLnF1ZXJ5QnlIb29rKGRhdGFIb29rc1ttb2RlXSkpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuICAgIHRoaXMuc2V0QWxsU3BlY2llc01vZGVzKG1vZGUpXG4gIH0sXG4gIGdldERlZmF1bHRTcGVjaWVzTW9kZTogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5zZXRBbGxTcGVjaWVzTW9kZXMoZS50YXJnZXQuZGF0YXNldC5uYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmNvbGxlY3Rpb24udHJpZ2dlcigndXBkYXRlLXNwZWNpZXMnLCBzcGVjaWUuY29tcElELCBzcGVjaWUsIGZhbHNlKVxuICAgIH0pO1xuICB9LFxuICBzZXRBbGxTcGVjaWVzTW9kZXM6IGZ1bmN0aW9uIChkZWZhdWx0TW9kZSkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuZGVmYXVsdE1vZGUgPSBkZWZhdWx0TW9kZTtcbiAgICB0aGlzLmNvbGxlY3Rpb24ubWFwKGZ1bmN0aW9uIChzcGVjaWUpIHsgXG4gICAgICBzcGVjaWUubW9kZSA9IGRlZmF1bHRNb2RlXG4gICAgfSk7XG4gICAgaWYoZGVmYXVsdE1vZGUgPT09IFwiZHluYW1pY1wiKXtcbiAgICAgIHRoaXMucmVuZGVyU3BlY2llc0FkdmFuY2VkVmlldygpXG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ2FkdmFuY2VkLXNwZWNpZXMnKSkuY29sbGFwc2UoJ3Nob3cnKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICQodGhpcy5xdWVyeUJ5SG9vaygnYWR2YW5jZWQtc3BlY2llcycpKS5jb2xsYXBzZSgnaGlkZScpO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyRWRpdFNwZWNpZXNWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYodGhpcy5lZGl0U3BlY2llc1ZpZXcpe1xuICAgICAgdGhpcy5lZGl0U3BlY2llc1ZpZXcucmVtb3ZlKCk7XG4gICAgfVxuICAgIHZhciBlZGl0U3BlY2llVmlldyA9ICF0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmlzX3NwYXRpYWwgPyBFZGl0Tm9uc3BhdGlhbFNwZWNpZVZpZXcgOiBFZGl0U3BhdGlhbFNwZWNpZVZpZXc7XG4gICAgdGhpcy5lZGl0U3BlY2llc1ZpZXcgPSB0aGlzLnJlbmRlckNvbGxlY3Rpb24oXG4gICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICBlZGl0U3BlY2llVmlldyxcbiAgICAgIHRoaXMucXVlcnlCeUhvb2soJ3NwZWNpZS1saXN0JylcbiAgICApO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcChcImhpZGVcIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU3BlY2llc0FkdmFuY2VkVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGlmKHRoaXMuc3BlY2llc0FkdmFuY2VkVmlldykge1xuICAgICAgdGhpcy5zcGVjaWVzQWR2YW5jZWRWaWV3LnJlbW92ZSgpXG4gICAgfVxuICAgIHRoaXMuc3BlY2llc0FkdmFuY2VkVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbGxlY3Rpb24sIEVkaXRBZHZhbmNlZFNwZWNpZSwgdGhpcy5xdWVyeUJ5SG9vaygnZWRpdC1zcGVjaWVzLW1vZGUnKSk7XG4gIH0sXG4gIGhhbmRsZUFkZFNwZWNpZXNDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRlZmF1bHRNb2RlID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5kZWZhdWx0TW9kZTtcbiAgICBpZihkZWZhdWx0TW9kZSA9PT0gXCJcIil7XG4gICAgICB0aGlzLmdldEluaXRpYWxEZWZhdWx0U3BlY2llc01vZGUoKTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuYWRkU3BlY2llcygpO1xuICAgIH1cbiAgfSxcbiAgYWRkU3BlY2llczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdWJkb21haW5zID0gdGhpcy5iYXNlTW9kZWwubWVzaFNldHRpbmdzLnVuaXF1ZVN1YmRvbWFpbnMubWFwKGZ1bmN0aW9uIChtb2RlbCkge3JldHVybiBtb2RlbC5uYW1lOyB9KTtcbiAgICB0aGlzLmNvbGxlY3Rpb24uYWRkU3BlY2llKHN1YmRvbWFpbnMpO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG4gICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKFwiaGlkZVwiKTtcblxuICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjaGFuZ2VDb2xsYXBzZUJ1dHRvblRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGV4dCA9ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgpO1xuICAgIHRleHQgPT09ICcrJyA/ICQodGhpcy5xdWVyeUJ5SG9vaygnY29sbGFwc2UnKSkudGV4dCgnLScpIDogJCh0aGlzLnF1ZXJ5QnlIb29rKCdjb2xsYXBzZScpKS50ZXh0KCcrJyk7XG4gIH0sXG59KTsiLCJ2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG4vL3ZpZXdzXG52YXIgVmlldyA9IHJlcXVpcmUoJ2FtcGVyc2FuZC12aWV3Jyk7XG4vL3RlbXBsYXRlc1xudmFyIHNwZWNpZVN1YmRvbWFpblRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3N1YmRvbWFpbi5wdWcnKTtcbnZhciByZWFjdGlvblN1YmRvbWFpblRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2luY2x1ZGVzL3JlYWN0aW9uU3ViZG9tYWluLnB1ZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHNwZWNpZVN1YmRvbWFpblRlbXBsYXRlLFxuICBldmVudHM6IHtcbiAgICAnY2hhbmdlIFtkYXRhLWhvb2s9c3ViZG9tYWluc10nIDogJ3VwZGF0ZVN1YmRvbWFpbicsXG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuICAgIFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXRoaXMucGFyZW50LmlzUmVhY3Rpb24pXG4gICAgICB2YXIgY2hlY2tlZCA9IF8uY29udGFpbnModGhpcy5wYXJlbnQubW9kZWwuc3ViZG9tYWlucywgdGhpcy5tb2RlbC5uYW1lKTtcbiAgICBlbHNle1xuICAgICAgdGhpcy50ZW1wbGF0ZSA9IHJlYWN0aW9uU3ViZG9tYWluVGVtcGxhdGU7XG4gICAgICB2YXIgY2hlY2tlZCA9IF8uY29udGFpbnModGhpcy5wYXJlbnQucGFyZW50Lm1vZGVsLnN1YmRvbWFpbnMsIHRoaXMubW9kZWwubmFtZSk7XG4gICAgfVxuICAgIFZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICQodGhpcy5xdWVyeUJ5SG9vaygnc3ViZG9tYWluJykpLnByb3AoJ2NoZWNrZWQnLCBjaGVja2VkKTtcbiAgfSxcbiAgdXBkYXRlU3ViZG9tYWluOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMucGFyZW50LnVwZGF0ZVN1YmRvbWFpbnMoe25hbWU6ICdzdWJkb21haW4nLCB2YWx1ZToge21vZGVsOiB0aGlzLm1vZGVsLCBjaGVja2VkOiBlLnRhcmdldC5jaGVja2VkfX0pXG4gIH0sXG59KTsiXSwic291cmNlUm9vdCI6IiJ9