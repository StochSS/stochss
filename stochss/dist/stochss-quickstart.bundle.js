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
/******/ 		"quickstart": 0
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
/******/ 	deferredModules.push(["./client/pages/quickstart.js","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/pages/quickstart.js":
/*!************************************!*\
  !*** ./client/pages/quickstart.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page.js */ "./client/pages/page.js");
// views
var PageView = __webpack_require__(/*! ./base */ "./client/pages/base.js");
// templates
var template = __webpack_require__(/*! ../templates/pages/quickstart.pug */ "./client/templates/pages/quickstart.pug");



let quickStart = PageView.extend({
  template: template
});

Object(_page_js__WEBPACK_IMPORTED_MODULE_0__["default"])(quickStart);


/***/ }),

/***/ "./client/templates/pages/quickstart.pug":
/*!***********************************************!*\
  !*** ./client/templates/pages/quickstart.pug ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Csection class=\"page\"\u003E\u003Cdiv class=\"row no-gutters\"\u003E\u003Cdiv class=\"col-md-10\"\u003E\u003Ch2\u003EQuickstart\u003C\u002Fh2\u003E\u003Cp\u003EWelcome to the Stochastic Simulation Service! In this tutorial we'll take you through the process of creating, simulating, and analyzing a model of a biochemical system.\u003C\u002Fp\u003E\u003Cp\u003EWe start our journey on the \u003Ca href=\"\u002Fstochss\u002Fmodels\"\u003Efile browser\u003C\u002Fa\u003E. To start, let's make a new project folder where we can keep files. Right-click on the root folder and click New Directory on the list of options. Let’s name the directory Quickstart. Click on the new directory so it’s selected, click the + icon, and choose the Create Model option.\u003C\u002Fp\u003E\u003Cimg class=\"quickstart\" style=\"width: 80%\" src=\"static\u002Ffile-browser-create-model-dropdown.png\"\u003E\u003Cp\u003EFrom here you’re taken to the model editor. Since you're creating a new model you'll need to choose the default species \"mode\" for your model. StochSS supports deterministic ODE-based simulations (concentration) as well as discrete stochastic simulations (population). An exciting feature of StochSS is the ability to run \"hybrid\" simulations that utilize both deterministic and probabilistic algorithms during a simulation, thanks to the powerful \u003Ca href=\"https:\u002F\u002Fgillespy2.github.io\u002FGillesPy2\u002Fdocs\u002Fbuild\u002Fhtml\u002Findex.html\"\u003EGillesPy2\u003C\u002Fa\u003E library. If you’re unsure of which to choose, go ahead and select “Population.”\u003C\u002Fp\u003E\u003Cimg class=\"quickstart\" style=\"width: 60%;\" src=\"static\u002Fmodel-editor-select-default-species-mode.png\"\u003E\u003Cp\u003ENow we are ready to begin creating the model. StochSS supports many types of models, some of which you may not be familiar with. There are “tooltips” all over the place in StochSS providing information on various things. Keep a look out for the little blue \u003Cem\u003Ei\u003C\u002Fem\u003E icons and hover over them to get more info on an item. Anyway, now that we’re on the model editor, let’s recreate the Degradation model that’s in the Examples folder. This model contains one species, one parameter, and one reaction to represent protein decay. To start, add a new species called “protein” with an initial condition of 50, and make a parameter called “decayrate” with a value of 0.05. At this point we’re ready to create a reaction to apply the “decayrate” parameter to our “protein” species. Since we are modeling decay we’ll select the A → ∅ reaction type.\u003C\u002Fp\u003E\u003Cimg class=\"quickstart\" style=\"width: 100%;\" src=\"static\u002Fmodel-editor-reaction-editor.png\"\u003E\u003Cp\u003ENow we have a functional model of a biochemical system. Let’s run a quick preview to explore our model a bit. Click Run Preview at the bottom of the page to create a sample time series below the model editor.\u003C\u002Fp\u003E\u003Cimg class=\"quickstart\" style=\"width: 90%;\" src=\"static\u002Fmodel-editor-preview-results.png\"\u003E\u003Cbr\u003E\u003Ch3\u003EWorkflows\u003C\u002Fh3\u003E\u003Cp\u003ETo run a full simulation and explore the results more thoroughly, you’ll need to create a StochSS Workflow. Click New Workflow at the bottom of the page to head to the Workflow Selection page. From here you’ll see several different options for exploring your model, but at the moment we’re interested in the Ensemble Simulation workflow.\u003C\u002Fp\u003E\u003Cimg class=\"quickstart\" style=\"width: 90%;\" src=\"static\u002Fworkflow-editor-ensemble-simulation.png\"\u003E\u003Cp\u003EFrom here you’ll choose a simulation algorithm and set configuration for your workflow. By default StochSS will choose a simulation style for you, but for this example let’s go with SSA (Stochastic Simulation Algorithm). In the “Stochastic Settings” section set trajectories to 10. This will create an “ensemble” of 10 different stochastic time series. Click the “Start Workflow” button when you’re ready. Your results should appear momentarily.\u003C\u002Fp\u003E\u003Cimg class=\"quickstart\" style=\"width: 90%;\" src=\"static\u002Fworkflow-results-std-deviation-plot.png\"\u003E\u003Cp\u003EOnce your workflow is complete you can explore various graphs describing the simulation results, download the raw data, and download JSON files describing each graph that you can use with the \u003Ca href=\"https:\u002F\u002Fplotly.com\u002Fgraphing-libraries\u002F\"\u003EPlotly\u003C\u002Fa\u003E graphing library. You can also come back to your results later by accessing the .wkfl file in your quickstart project folder.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";;return pug_html;};
module.exports = template;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL3F1aWNrc3RhcnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9wYWdlcy9xdWlja3N0YXJ0LnB1ZyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUSxvQkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBaUIsNEJBQTRCO0FBQzdDO0FBQ0E7QUFDQSwwQkFBa0IsMkJBQTJCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHVCQUF1QjtBQUN2Qzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN2SkE7QUFBQTtBQUFBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLHNDQUFRO0FBQy9CO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGtGQUFtQzs7QUFFekI7O0FBRWpDO0FBQ0E7QUFDQSxDQUFDOztBQUVELHdEQUFROzs7Ozs7Ozs7Ozs7QUNYUixVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsK29EQUErb0QsOC9CQUE4L0IsK1ZBQStWLHloQkFBeWhCLG1sQkFBbWxCLGtsQkFBa2xCO0FBQ3B2SiwwQiIsImZpbGUiOiJzdG9jaHNzLXF1aWNrc3RhcnQuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbiBcdC8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcInF1aWNrc3RhcnRcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL2NsaWVudC9wYWdlcy9xdWlja3N0YXJ0LmpzXCIsXCJjb21tb25cIl0pO1xuIFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiByZWFkeVxuIFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4iLCIvLyB2aWV3c1xudmFyIFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi9iYXNlJyk7XG4vLyB0ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9wYWdlcy9xdWlja3N0YXJ0LnB1ZycpO1xuXG5pbXBvcnQgaW5pdFBhZ2UgZnJvbSAnLi9wYWdlLmpzJztcblxubGV0IHF1aWNrU3RhcnQgPSBQYWdlVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGVcbn0pO1xuXG5pbml0UGFnZShxdWlja1N0YXJ0KTtcbiIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzZWN0aW9uIGNsYXNzPVxcXCJwYWdlXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3cgbm8tZ3V0dGVyc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEwXFxcIlxcdTAwM0VcXHUwMDNDaDJcXHUwMDNFUXVpY2tzdGFydFxcdTAwM0NcXHUwMDJGaDJcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFV2VsY29tZSB0byB0aGUgU3RvY2hhc3RpYyBTaW11bGF0aW9uIFNlcnZpY2UhIEluIHRoaXMgdHV0b3JpYWwgd2UnbGwgdGFrZSB5b3UgdGhyb3VnaCB0aGUgcHJvY2VzcyBvZiBjcmVhdGluZywgc2ltdWxhdGluZywgYW5kIGFuYWx5emluZyBhIG1vZGVsIG9mIGEgYmlvY2hlbWljYWwgc3lzdGVtLlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDcFxcdTAwM0VXZSBzdGFydCBvdXIgam91cm5leSBvbiB0aGUgXFx1MDAzQ2EgaHJlZj1cXFwiXFx1MDAyRnN0b2Noc3NcXHUwMDJGbW9kZWxzXFxcIlxcdTAwM0VmaWxlIGJyb3dzZXJcXHUwMDNDXFx1MDAyRmFcXHUwMDNFLiBUbyBzdGFydCwgbGV0J3MgbWFrZSBhIG5ldyBwcm9qZWN0IGZvbGRlciB3aGVyZSB3ZSBjYW4ga2VlcCBmaWxlcy4gUmlnaHQtY2xpY2sgb24gdGhlIHJvb3QgZm9sZGVyIGFuZCBjbGljayBOZXcgRGlyZWN0b3J5IG9uIHRoZSBsaXN0IG9mIG9wdGlvbnMuIExldOKAmXMgbmFtZSB0aGUgZGlyZWN0b3J5IFF1aWNrc3RhcnQuIENsaWNrIG9uIHRoZSBuZXcgZGlyZWN0b3J5IHNvIGl04oCZcyBzZWxlY3RlZCwgY2xpY2sgdGhlICsgaWNvbiwgYW5kIGNob29zZSB0aGUgQ3JlYXRlIE1vZGVsIG9wdGlvbi5cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ2ltZyBjbGFzcz1cXFwicXVpY2tzdGFydFxcXCIgc3R5bGU9XFxcIndpZHRoOiA4MCVcXFwiIHNyYz1cXFwic3RhdGljXFx1MDAyRmZpbGUtYnJvd3Nlci1jcmVhdGUtbW9kZWwtZHJvcGRvd24ucG5nXFxcIlxcdTAwM0VcXHUwMDNDcFxcdTAwM0VGcm9tIGhlcmUgeW914oCZcmUgdGFrZW4gdG8gdGhlIG1vZGVsIGVkaXRvci4gU2luY2UgeW91J3JlIGNyZWF0aW5nIGEgbmV3IG1vZGVsIHlvdSdsbCBuZWVkIHRvIGNob29zZSB0aGUgZGVmYXVsdCBzcGVjaWVzIFxcXCJtb2RlXFxcIiBmb3IgeW91ciBtb2RlbC4gU3RvY2hTUyBzdXBwb3J0cyBkZXRlcm1pbmlzdGljIE9ERS1iYXNlZCBzaW11bGF0aW9ucyAoY29uY2VudHJhdGlvbikgYXMgd2VsbCBhcyBkaXNjcmV0ZSBzdG9jaGFzdGljIHNpbXVsYXRpb25zIChwb3B1bGF0aW9uKS4gQW4gZXhjaXRpbmcgZmVhdHVyZSBvZiBTdG9jaFNTIGlzIHRoZSBhYmlsaXR5IHRvIHJ1biBcXFwiaHlicmlkXFxcIiBzaW11bGF0aW9ucyB0aGF0IHV0aWxpemUgYm90aCBkZXRlcm1pbmlzdGljIGFuZCBwcm9iYWJpbGlzdGljIGFsZ29yaXRobXMgZHVyaW5nIGEgc2ltdWxhdGlvbiwgdGhhbmtzIHRvIHRoZSBwb3dlcmZ1bCBcXHUwMDNDYSBocmVmPVxcXCJodHRwczpcXHUwMDJGXFx1MDAyRmdpbGxlc3B5Mi5naXRodWIuaW9cXHUwMDJGR2lsbGVzUHkyXFx1MDAyRmRvY3NcXHUwMDJGYnVpbGRcXHUwMDJGaHRtbFxcdTAwMkZpbmRleC5odG1sXFxcIlxcdTAwM0VHaWxsZXNQeTJcXHUwMDNDXFx1MDAyRmFcXHUwMDNFIGxpYnJhcnkuIElmIHlvdeKAmXJlIHVuc3VyZSBvZiB3aGljaCB0byBjaG9vc2UsIGdvIGFoZWFkIGFuZCBzZWxlY3Qg4oCcUG9wdWxhdGlvbi7igJ1cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ2ltZyBjbGFzcz1cXFwicXVpY2tzdGFydFxcXCIgc3R5bGU9XFxcIndpZHRoOiA2MCU7XFxcIiBzcmM9XFxcInN0YXRpY1xcdTAwMkZtb2RlbC1lZGl0b3Itc2VsZWN0LWRlZmF1bHQtc3BlY2llcy1tb2RlLnBuZ1xcXCJcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFTm93IHdlIGFyZSByZWFkeSB0byBiZWdpbiBjcmVhdGluZyB0aGUgbW9kZWwuIFN0b2NoU1Mgc3VwcG9ydHMgbWFueSB0eXBlcyBvZiBtb2RlbHMsIHNvbWUgb2Ygd2hpY2ggeW91IG1heSBub3QgYmUgZmFtaWxpYXIgd2l0aC4gVGhlcmUgYXJlIOKAnHRvb2x0aXBz4oCdIGFsbCBvdmVyIHRoZSBwbGFjZSBpbiBTdG9jaFNTIHByb3ZpZGluZyBpbmZvcm1hdGlvbiBvbiB2YXJpb3VzIHRoaW5ncy4gS2VlcCBhIGxvb2sgb3V0IGZvciB0aGUgbGl0dGxlIGJsdWUgXFx1MDAzQ2VtXFx1MDAzRWlcXHUwMDNDXFx1MDAyRmVtXFx1MDAzRSBpY29ucyBhbmQgaG92ZXIgb3ZlciB0aGVtIHRvIGdldCBtb3JlIGluZm8gb24gYW4gaXRlbS4gQW55d2F5LCBub3cgdGhhdCB3ZeKAmXJlIG9uIHRoZSBtb2RlbCBlZGl0b3IsIGxldOKAmXMgcmVjcmVhdGUgdGhlIERlZ3JhZGF0aW9uIG1vZGVsIHRoYXTigJlzIGluIHRoZSBFeGFtcGxlcyBmb2xkZXIuIFRoaXMgbW9kZWwgY29udGFpbnMgb25lIHNwZWNpZXMsIG9uZSBwYXJhbWV0ZXIsIGFuZCBvbmUgcmVhY3Rpb24gdG8gcmVwcmVzZW50IHByb3RlaW4gZGVjYXkuIFRvIHN0YXJ0LCBhZGQgYSBuZXcgc3BlY2llcyBjYWxsZWQg4oCccHJvdGVpbuKAnSB3aXRoIGFuIGluaXRpYWwgY29uZGl0aW9uIG9mIDUwLCBhbmQgbWFrZSBhIHBhcmFtZXRlciBjYWxsZWQg4oCcZGVjYXlyYXRl4oCdIHdpdGggYSB2YWx1ZSBvZiAwLjA1LiBBdCB0aGlzIHBvaW50IHdl4oCZcmUgcmVhZHkgdG8gY3JlYXRlIGEgcmVhY3Rpb24gdG8gYXBwbHkgdGhlIOKAnGRlY2F5cmF0ZeKAnSBwYXJhbWV0ZXIgdG8gb3VyIOKAnHByb3RlaW7igJ0gc3BlY2llcy4gU2luY2Ugd2UgYXJlIG1vZGVsaW5nIGRlY2F5IHdl4oCZbGwgc2VsZWN0IHRoZSBBIOKGkiDiiIUgcmVhY3Rpb24gdHlwZS5cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ2ltZyBjbGFzcz1cXFwicXVpY2tzdGFydFxcXCIgc3R5bGU9XFxcIndpZHRoOiAxMDAlO1xcXCIgc3JjPVxcXCJzdGF0aWNcXHUwMDJGbW9kZWwtZWRpdG9yLXJlYWN0aW9uLWVkaXRvci5wbmdcXFwiXFx1MDAzRVxcdTAwM0NwXFx1MDAzRU5vdyB3ZSBoYXZlIGEgZnVuY3Rpb25hbCBtb2RlbCBvZiBhIGJpb2NoZW1pY2FsIHN5c3RlbS4gTGV04oCZcyBydW4gYSBxdWljayBwcmV2aWV3IHRvIGV4cGxvcmUgb3VyIG1vZGVsIGEgYml0LiBDbGljayBSdW4gUHJldmlldyBhdCB0aGUgYm90dG9tIG9mIHRoZSBwYWdlIHRvIGNyZWF0ZSBhIHNhbXBsZSB0aW1lIHNlcmllcyBiZWxvdyB0aGUgbW9kZWwgZWRpdG9yLlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDaW1nIGNsYXNzPVxcXCJxdWlja3N0YXJ0XFxcIiBzdHlsZT1cXFwid2lkdGg6IDkwJTtcXFwiIHNyYz1cXFwic3RhdGljXFx1MDAyRm1vZGVsLWVkaXRvci1wcmV2aWV3LXJlc3VsdHMucG5nXFxcIlxcdTAwM0VcXHUwMDNDYnJcXHUwMDNFXFx1MDAzQ2gzXFx1MDAzRVdvcmtmbG93c1xcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFVG8gcnVuIGEgZnVsbCBzaW11bGF0aW9uIGFuZCBleHBsb3JlIHRoZSByZXN1bHRzIG1vcmUgdGhvcm91Z2hseSwgeW914oCZbGwgbmVlZCB0byBjcmVhdGUgYSBTdG9jaFNTIFdvcmtmbG93LiBDbGljayBOZXcgV29ya2Zsb3cgYXQgdGhlIGJvdHRvbSBvZiB0aGUgcGFnZSB0byBoZWFkIHRvIHRoZSBXb3JrZmxvdyBTZWxlY3Rpb24gcGFnZS4gRnJvbSBoZXJlIHlvdeKAmWxsIHNlZSBzZXZlcmFsIGRpZmZlcmVudCBvcHRpb25zIGZvciBleHBsb3JpbmcgeW91ciBtb2RlbCwgYnV0IGF0IHRoZSBtb21lbnQgd2XigJlyZSBpbnRlcmVzdGVkIGluIHRoZSBFbnNlbWJsZSBTaW11bGF0aW9uIHdvcmtmbG93LlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDaW1nIGNsYXNzPVxcXCJxdWlja3N0YXJ0XFxcIiBzdHlsZT1cXFwid2lkdGg6IDkwJTtcXFwiIHNyYz1cXFwic3RhdGljXFx1MDAyRndvcmtmbG93LWVkaXRvci1lbnNlbWJsZS1zaW11bGF0aW9uLnBuZ1xcXCJcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFRnJvbSBoZXJlIHlvdeKAmWxsIGNob29zZSBhIHNpbXVsYXRpb24gYWxnb3JpdGhtIGFuZCBzZXQgY29uZmlndXJhdGlvbiBmb3IgeW91ciB3b3JrZmxvdy4gQnkgZGVmYXVsdCBTdG9jaFNTIHdpbGwgY2hvb3NlIGEgc2ltdWxhdGlvbiBzdHlsZSBmb3IgeW91LCBidXQgZm9yIHRoaXMgZXhhbXBsZSBsZXTigJlzIGdvIHdpdGggU1NBIChTdG9jaGFzdGljIFNpbXVsYXRpb24gQWxnb3JpdGhtKS4gSW4gdGhlIOKAnFN0b2NoYXN0aWMgU2V0dGluZ3PigJ0gc2VjdGlvbiBzZXQgdHJhamVjdG9yaWVzIHRvIDEwLiBUaGlzIHdpbGwgY3JlYXRlIGFuIOKAnGVuc2VtYmxl4oCdIG9mIDEwIGRpZmZlcmVudCBzdG9jaGFzdGljIHRpbWUgc2VyaWVzLiBDbGljayB0aGUg4oCcU3RhcnQgV29ya2Zsb3figJ0gYnV0dG9uIHdoZW4geW914oCZcmUgcmVhZHkuIFlvdXIgcmVzdWx0cyBzaG91bGQgYXBwZWFyIG1vbWVudGFyaWx5LlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDaW1nIGNsYXNzPVxcXCJxdWlja3N0YXJ0XFxcIiBzdHlsZT1cXFwid2lkdGg6IDkwJTtcXFwiIHNyYz1cXFwic3RhdGljXFx1MDAyRndvcmtmbG93LXJlc3VsdHMtc3RkLWRldmlhdGlvbi1wbG90LnBuZ1xcXCJcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFT25jZSB5b3VyIHdvcmtmbG93IGlzIGNvbXBsZXRlIHlvdSBjYW4gZXhwbG9yZSB2YXJpb3VzIGdyYXBocyBkZXNjcmliaW5nIHRoZSBzaW11bGF0aW9uIHJlc3VsdHMsIGRvd25sb2FkIHRoZSByYXcgZGF0YSwgYW5kIGRvd25sb2FkIEpTT04gZmlsZXMgZGVzY3JpYmluZyBlYWNoIGdyYXBoIHRoYXQgeW91IGNhbiB1c2Ugd2l0aCB0aGUgXFx1MDAzQ2EgaHJlZj1cXFwiaHR0cHM6XFx1MDAyRlxcdTAwMkZwbG90bHkuY29tXFx1MDAyRmdyYXBoaW5nLWxpYnJhcmllc1xcdTAwMkZcXFwiXFx1MDAzRVBsb3RseVxcdTAwM0NcXHUwMDJGYVxcdTAwM0UgZ3JhcGhpbmcgbGlicmFyeS4gWW91IGNhbiBhbHNvIGNvbWUgYmFjayB0byB5b3VyIHJlc3VsdHMgbGF0ZXIgYnkgYWNjZXNzaW5nIHRoZSAud2tmbCBmaWxlIGluIHlvdXIgcXVpY2tzdGFydCBwcm9qZWN0IGZvbGRlci5cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWN0aW9uXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7Il0sInNvdXJjZVJvb3QiOiIifQ==