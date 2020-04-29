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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Csection class=\"page\"\u003E\u003Cdiv class=\"row no-gutters\"\u003E\u003Cdiv class=\"col-md-10\"\u003E\u003Ch2\u003EQuickstart\u003C\u002Fh2\u003E\u003Cp\u003EThe \u003Ca href=\"\u002Fstochss\u002Fmodels\"\u003EFile Browser\u003C\u002Fa\u003E is where you'll find all of your StochSS models and workflows, Jupyter notebooks, \u003Ca href=\"http:\u002F\u002Fsbml.org\u002FMain_Page\"\u003ESBML\u003C\u002Fa\u003E models, and uploaded files. Head to the Examples folder and open the Michaelis Menten project folder. The \u003Ca href=\"https:\u002F\u002Fen.wikipedia.org\u002Fwiki\u002FMichaelis%E2%80%93Menten_kinetics\"\u003EMichaelis Menten\u003C\u002Fa\u003E model is a classic model in biochemistry involving the combination of a substrate with an enzyme. The result of the reaction is a product and an enzyme-substrate compound. Once you're in the project folder you'll see a file ending in .mdl, which indicates that it represents a StochSS model. Go ahead and double-click the file to open the model in the model editor.\u003C\u002Fp\u003E\u003Cbr\u003E\u003Cimg class=\"quickstart screenshot\" width=\"80%\" src=\"static\u002Ffile-browser-michaelis-menten-selected.png\"\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Ch4\u003EModels\u003C\u002Fh4\u003E\u003Cp\u003EThe StochSS model editor allows you to easily edit the attributes of your models. The model editor supports a variety of attributes and systems, some of which you may not be familiar with. If you're wondering what something is, look for a blue \"i\" next to the attribute name. Hovering over these icons will bring up an explanation.\u003C\u002Fp\u003E\u003Cp class=\"text-info mx-auto\" style=\"display: block; width: 690px\"\u003E[What is a little task we can get them to do? Add a reaction? Change the value of something?]\u003C\u002Fp\u003E\u003Cp class=\"text-info mx-auto\" style=\"display: block; width: 400px\"\u003E[Screenshot of the task we have them do]\u003C\u002Fp\u003E\u003Cimg src=\"\"\u003E\u003Cp\u003ESometimes you might not want to schedule a full simulation of your model but would like to see a sample of what a timeseries might look like. At the bottom of the page you'll see a button labelled \"Run Preview.\" This function allows you to run a 5-second simulation and see some quick results without having to leave the model editor.\u003C\u002Fp\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Ch4\u003EWorkflows\u003C\u002Fh4\u003E\u003Cp\u003EA StochSS Workflow is a way to interrogate, simulate, and interact with your StochSS models. When you're ready to do a full simulation, save your model and then click the \"New Workflow\" button. This will take you to the workflow selection page. Choose the \"Ensemble Simulation\" workflow. You can choose from a variety of algorithms like ODE and discrete stochastic \u003Cspan class=\"text-info\"\u003E[clean up this sentance]\u003C\u002Fspan\u003E. Since we're using the Stochastic Simulation Service, let's use the SSA algorithm (Stochastic Simulation Algorithm). In the Stochastic Settings section, change the trajectories to 5 so we can compare the results of several stochastic simulations.\u003C\u002Fp\u003E\u003Cbr\u003E\u003Cimg class=\"quickstart screenshot\" width=\"80%\" src=\"static\u002Fmichaelis-menten-workflow-ensemble.png\"\u003E\u003Cbr\u003E\u003Cp\u003EGo ahead and save your workflow and then head back to the File Browser. If you open up the Michaelis Menten project folder you'll see your new workflow file ending in .wkfl. Open up your workflow again to get back to the workflow manager. Check your settings one more time and then click \"Start Workflow\" when you're ready.\u003C\u002Fp\u003E\u003Cp\u003EAt this point the Workflow Status section will expand. Notice the \"running\" status. After a few seconds the container will refresh and the status will be \"complete.\"\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";;return pug_html;};
module.exports = template;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3BhZ2VzL3F1aWNrc3RhcnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RlbXBsYXRlcy9wYWdlcy9xdWlja3N0YXJ0LnB1ZyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUSxvQkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBaUIsNEJBQTRCO0FBQzdDO0FBQ0E7QUFDQSwwQkFBa0IsMkJBQTJCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHVCQUF1QjtBQUN2Qzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN2SkE7QUFBQTtBQUFBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLHNDQUFRO0FBQy9CO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGtGQUFtQzs7QUFFekI7O0FBRWpDO0FBQ0E7QUFDQSxDQUFDOztBQUVELHdEQUFROzs7Ozs7Ozs7Ozs7QUNYUixVQUFVLG1CQUFPLENBQUMsdUZBQTZDOztBQUUvRCwyQkFBMkIsa0NBQWtDLGFBQWEsd3FEQUF3cUQsZ01BQWdNLGlnRUFBaWdFO0FBQ243SCwwQiIsImZpbGUiOiJzdG9jaHNzLXF1aWNrc3RhcnQuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdHJldHVybiByZXN1bHQ7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4gXHQvLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbiBcdC8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG4gXHR2YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuIFx0XHRcInF1aWNrc3RhcnRcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL2NsaWVudC9wYWdlcy9xdWlja3N0YXJ0LmpzXCIsXCJjb21tb25cIl0pO1xuIFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiByZWFkeVxuIFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4iLCIvLyB2aWV3c1xudmFyIFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi9iYXNlJyk7XG4vLyB0ZW1wbGF0ZXNcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9wYWdlcy9xdWlja3N0YXJ0LnB1ZycpO1xuXG5pbXBvcnQgaW5pdFBhZ2UgZnJvbSAnLi9wYWdlLmpzJztcblxubGV0IHF1aWNrU3RhcnQgPSBQYWdlVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogdGVtcGxhdGVcbn0pO1xuXG5pbml0UGFnZShxdWlja1N0YXJ0KTtcbiIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwO3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NzZWN0aW9uIGNsYXNzPVxcXCJwYWdlXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJyb3cgbm8tZ3V0dGVyc1xcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY29sLW1kLTEwXFxcIlxcdTAwM0VcXHUwMDNDaDJcXHUwMDNFUXVpY2tzdGFydFxcdTAwM0NcXHUwMDJGaDJcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFVGhlIFxcdTAwM0NhIGhyZWY9XFxcIlxcdTAwMkZzdG9jaHNzXFx1MDAyRm1vZGVsc1xcXCJcXHUwMDNFRmlsZSBCcm93c2VyXFx1MDAzQ1xcdTAwMkZhXFx1MDAzRSBpcyB3aGVyZSB5b3UnbGwgZmluZCBhbGwgb2YgeW91ciBTdG9jaFNTIG1vZGVscyBhbmQgd29ya2Zsb3dzLCBKdXB5dGVyIG5vdGVib29rcywgXFx1MDAzQ2EgaHJlZj1cXFwiaHR0cDpcXHUwMDJGXFx1MDAyRnNibWwub3JnXFx1MDAyRk1haW5fUGFnZVxcXCJcXHUwMDNFU0JNTFxcdTAwM0NcXHUwMDJGYVxcdTAwM0UgbW9kZWxzLCBhbmQgdXBsb2FkZWQgZmlsZXMuIEhlYWQgdG8gdGhlIEV4YW1wbGVzIGZvbGRlciBhbmQgb3BlbiB0aGUgTWljaGFlbGlzIE1lbnRlbiBwcm9qZWN0IGZvbGRlci4gVGhlIFxcdTAwM0NhIGhyZWY9XFxcImh0dHBzOlxcdTAwMkZcXHUwMDJGZW4ud2lraXBlZGlhLm9yZ1xcdTAwMkZ3aWtpXFx1MDAyRk1pY2hhZWxpcyVFMiU4MCU5M01lbnRlbl9raW5ldGljc1xcXCJcXHUwMDNFTWljaGFlbGlzIE1lbnRlblxcdTAwM0NcXHUwMDJGYVxcdTAwM0UgbW9kZWwgaXMgYSBjbGFzc2ljIG1vZGVsIGluIGJpb2NoZW1pc3RyeSBpbnZvbHZpbmcgdGhlIGNvbWJpbmF0aW9uIG9mIGEgc3Vic3RyYXRlIHdpdGggYW4gZW56eW1lLiBUaGUgcmVzdWx0IG9mIHRoZSByZWFjdGlvbiBpcyBhIHByb2R1Y3QgYW5kIGFuIGVuenltZS1zdWJzdHJhdGUgY29tcG91bmQuIE9uY2UgeW91J3JlIGluIHRoZSBwcm9qZWN0IGZvbGRlciB5b3UnbGwgc2VlIGEgZmlsZSBlbmRpbmcgaW4gLm1kbCwgd2hpY2ggaW5kaWNhdGVzIHRoYXQgaXQgcmVwcmVzZW50cyBhIFN0b2NoU1MgbW9kZWwuIEdvIGFoZWFkIGFuZCBkb3VibGUtY2xpY2sgdGhlIGZpbGUgdG8gb3BlbiB0aGUgbW9kZWwgaW4gdGhlIG1vZGVsIGVkaXRvci5cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ2JyXFx1MDAzRVxcdTAwM0NpbWcgY2xhc3M9XFxcInF1aWNrc3RhcnQgc2NyZWVuc2hvdFxcXCIgd2lkdGg9XFxcIjgwJVxcXCIgc3JjPVxcXCJzdGF0aWNcXHUwMDJGZmlsZS1icm93c2VyLW1pY2hhZWxpcy1tZW50ZW4tc2VsZWN0ZWQucG5nXFxcIlxcdTAwM0VcXHUwMDNDYnJcXHUwMDNFXFx1MDAzQ2JyXFx1MDAzRVxcdTAwM0NoNFxcdTAwM0VNb2RlbHNcXHUwMDNDXFx1MDAyRmg0XFx1MDAzRVxcdTAwM0NwXFx1MDAzRVRoZSBTdG9jaFNTIG1vZGVsIGVkaXRvciBhbGxvd3MgeW91IHRvIGVhc2lseSBlZGl0IHRoZSBhdHRyaWJ1dGVzIG9mIHlvdXIgbW9kZWxzLiBUaGUgbW9kZWwgZWRpdG9yIHN1cHBvcnRzIGEgdmFyaWV0eSBvZiBhdHRyaWJ1dGVzIGFuZCBzeXN0ZW1zLCBzb21lIG9mIHdoaWNoIHlvdSBtYXkgbm90IGJlIGZhbWlsaWFyIHdpdGguIElmIHlvdSdyZSB3b25kZXJpbmcgd2hhdCBzb21ldGhpbmcgaXMsIGxvb2sgZm9yIGEgYmx1ZSBcXFwiaVxcXCIgbmV4dCB0byB0aGUgYXR0cmlidXRlIG5hbWUuIEhvdmVyaW5nIG92ZXIgdGhlc2UgaWNvbnMgd2lsbCBicmluZyB1cCBhbiBleHBsYW5hdGlvbi5cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ3AgY2xhc3M9XFxcInRleHQtaW5mbyBteC1hdXRvXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogYmxvY2s7IHdpZHRoOiA2OTBweFxcXCJcXHUwMDNFW1doYXQgaXMgYSBsaXR0bGUgdGFzayB3ZSBjYW4gZ2V0IHRoZW0gdG8gZG8/IEFkZCBhIHJlYWN0aW9uPyBDaGFuZ2UgdGhlIHZhbHVlIG9mIHNvbWV0aGluZz9dXFx1MDAzQ1xcdTAwMkZwXFx1MDAzRVxcdTAwM0NwIGNsYXNzPVxcXCJ0ZXh0LWluZm8gbXgtYXV0b1xcXCIgc3R5bGU9XFxcImRpc3BsYXk6IGJsb2NrOyB3aWR0aDogNDAwcHhcXFwiXFx1MDAzRVtTY3JlZW5zaG90IG9mIHRoZSB0YXNrIHdlIGhhdmUgdGhlbSBkb11cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ2ltZyBzcmM9XFxcIlxcXCJcXHUwMDNFXFx1MDAzQ3BcXHUwMDNFU29tZXRpbWVzIHlvdSBtaWdodCBub3Qgd2FudCB0byBzY2hlZHVsZSBhIGZ1bGwgc2ltdWxhdGlvbiBvZiB5b3VyIG1vZGVsIGJ1dCB3b3VsZCBsaWtlIHRvIHNlZSBhIHNhbXBsZSBvZiB3aGF0IGEgdGltZXNlcmllcyBtaWdodCBsb29rIGxpa2UuIEF0IHRoZSBib3R0b20gb2YgdGhlIHBhZ2UgeW91J2xsIHNlZSBhIGJ1dHRvbiBsYWJlbGxlZCBcXFwiUnVuIFByZXZpZXcuXFxcIiBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gcnVuIGEgNS1zZWNvbmQgc2ltdWxhdGlvbiBhbmQgc2VlIHNvbWUgcXVpY2sgcmVzdWx0cyB3aXRob3V0IGhhdmluZyB0byBsZWF2ZSB0aGUgbW9kZWwgZWRpdG9yLlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDYnJcXHUwMDNFXFx1MDAzQ2JyXFx1MDAzRVxcdTAwM0NoNFxcdTAwM0VXb3JrZmxvd3NcXHUwMDNDXFx1MDAyRmg0XFx1MDAzRVxcdTAwM0NwXFx1MDAzRUEgU3RvY2hTUyBXb3JrZmxvdyBpcyBhIHdheSB0byBpbnRlcnJvZ2F0ZSwgc2ltdWxhdGUsIGFuZCBpbnRlcmFjdCB3aXRoIHlvdXIgU3RvY2hTUyBtb2RlbHMuIFdoZW4geW91J3JlIHJlYWR5IHRvIGRvIGEgZnVsbCBzaW11bGF0aW9uLCBzYXZlIHlvdXIgbW9kZWwgYW5kIHRoZW4gY2xpY2sgdGhlIFxcXCJOZXcgV29ya2Zsb3dcXFwiIGJ1dHRvbi4gVGhpcyB3aWxsIHRha2UgeW91IHRvIHRoZSB3b3JrZmxvdyBzZWxlY3Rpb24gcGFnZS4gQ2hvb3NlIHRoZSBcXFwiRW5zZW1ibGUgU2ltdWxhdGlvblxcXCIgd29ya2Zsb3cuIFlvdSBjYW4gY2hvb3NlIGZyb20gYSB2YXJpZXR5IG9mIGFsZ29yaXRobXMgbGlrZSBPREUgYW5kIGRpc2NyZXRlIHN0b2NoYXN0aWMgXFx1MDAzQ3NwYW4gY2xhc3M9XFxcInRleHQtaW5mb1xcXCJcXHUwMDNFW2NsZWFuIHVwIHRoaXMgc2VudGFuY2VdXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRS4gU2luY2Ugd2UncmUgdXNpbmcgdGhlIFN0b2NoYXN0aWMgU2ltdWxhdGlvbiBTZXJ2aWNlLCBsZXQncyB1c2UgdGhlIFNTQSBhbGdvcml0aG0gKFN0b2NoYXN0aWMgU2ltdWxhdGlvbiBBbGdvcml0aG0pLiBJbiB0aGUgU3RvY2hhc3RpYyBTZXR0aW5ncyBzZWN0aW9uLCBjaGFuZ2UgdGhlIHRyYWplY3RvcmllcyB0byA1IHNvIHdlIGNhbiBjb21wYXJlIHRoZSByZXN1bHRzIG9mIHNldmVyYWwgc3RvY2hhc3RpYyBzaW11bGF0aW9ucy5cXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ2JyXFx1MDAzRVxcdTAwM0NpbWcgY2xhc3M9XFxcInF1aWNrc3RhcnQgc2NyZWVuc2hvdFxcXCIgd2lkdGg9XFxcIjgwJVxcXCIgc3JjPVxcXCJzdGF0aWNcXHUwMDJGbWljaGFlbGlzLW1lbnRlbi13b3JrZmxvdy1lbnNlbWJsZS5wbmdcXFwiXFx1MDAzRVxcdTAwM0NiclxcdTAwM0VcXHUwMDNDcFxcdTAwM0VHbyBhaGVhZCBhbmQgc2F2ZSB5b3VyIHdvcmtmbG93IGFuZCB0aGVuIGhlYWQgYmFjayB0byB0aGUgRmlsZSBCcm93c2VyLiBJZiB5b3Ugb3BlbiB1cCB0aGUgTWljaGFlbGlzIE1lbnRlbiBwcm9qZWN0IGZvbGRlciB5b3UnbGwgc2VlIHlvdXIgbmV3IHdvcmtmbG93IGZpbGUgZW5kaW5nIGluIC53a2ZsLiBPcGVuIHVwIHlvdXIgd29ya2Zsb3cgYWdhaW4gdG8gZ2V0IGJhY2sgdG8gdGhlIHdvcmtmbG93IG1hbmFnZXIuIENoZWNrIHlvdXIgc2V0dGluZ3Mgb25lIG1vcmUgdGltZSBhbmQgdGhlbiBjbGljayBcXFwiU3RhcnQgV29ya2Zsb3dcXFwiIHdoZW4geW91J3JlIHJlYWR5LlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDcFxcdTAwM0VBdCB0aGlzIHBvaW50IHRoZSBXb3JrZmxvdyBTdGF0dXMgc2VjdGlvbiB3aWxsIGV4cGFuZC4gTm90aWNlIHRoZSBcXFwicnVubmluZ1xcXCIgc3RhdHVzLiBBZnRlciBhIGZldyBzZWNvbmRzIHRoZSBjb250YWluZXIgd2lsbCByZWZyZXNoIGFuZCB0aGUgc3RhdHVzIHdpbGwgYmUgXFxcImNvbXBsZXRlLlxcXCJcXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZzZWN0aW9uXFx1MDAzRVwiOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7Il0sInNvdXJjZVJvb3QiOiIifQ==