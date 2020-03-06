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
/******/ 		"home": 0
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
/******/ 	deferredModules.push(["./client/pages/home.js","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/graphics.js":
/*!****************************!*\
  !*** ./client/graphics.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  logo:
`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 1271.7733 348.77332"
   height="348.77332"
   width="1271.7733"
   xml:space="preserve"
   id="svg2"
   version="1.1"><metadata
     id="metadata8"><rdf:RDF><cc:Work
         rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" /></cc:Work></rdf:RDF></metadata><defs
     id="defs6"><clipPath
       id="clipPath20"
       clipPathUnits="userSpaceOnUse"><path
         id="path18"
         d="m 326.688,704.762 c -23.477,0 -42.5,-19.032 -42.5,-42.5 0,-23.481 19.023,-42.5 42.5,-42.5 23.464,0 42.488,19.019 42.488,42.5 0,23.468 -19.024,42.5 -42.488,42.5 z" /></clipPath><linearGradient
       id="linearGradient32"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.45,684.72)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop22"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop24"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop26"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop28"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop30"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath42"
       clipPathUnits="userSpaceOnUse"><path
         id="path40"
         d="m 871.012,709.27 c -25.985,0 -47.059,-21.059 -47.059,-47.059 0,-25.981 21.074,-47.063 47.059,-47.063 25.988,0 47.062,21.082 47.062,47.063 0,26 -21.074,47.059 -47.062,47.059 z" /></clipPath><linearGradient
       id="linearGradient54"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.55,677.1)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop44"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop46"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop48"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop50"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop52"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath64"
       clipPathUnits="userSpaceOnUse"><path
         id="path62"
         d="m 1415.35,713.789 c -28.51,0 -51.62,-23.109 -51.62,-51.617 0,-28.512 23.11,-51.621 51.62,-51.621 28.5,0 51.62,23.109 51.62,51.621 0,28.508 -23.12,51.617 -51.62,51.617 z" /></clipPath><linearGradient
       id="linearGradient76"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.66,669.49)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop66"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop68"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop70"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop72"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop74"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath86"
       clipPathUnits="userSpaceOnUse"><path
         id="path84"
         d="m 1959.67,718.309 c -31.02,0 -56.17,-25.161 -56.17,-56.188 0,-31.019 25.15,-56.18 56.17,-56.18 31.04,0 56.2,25.161 56.2,56.18 0,31.027 -25.16,56.188 -56.2,56.188 z" /></clipPath><linearGradient
       id="linearGradient98"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.76,661.87)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop88"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop90"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop92"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop94"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop96"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath108"
       clipPathUnits="userSpaceOnUse"><path
         id="path106"
         d="m 2504.01,719.199 c -31.5,0 -57.13,-25.617 -57.13,-57.121 0,-31.508 25.63,-57.137 57.13,-57.137 31.5,0 57.13,25.629 57.13,57.137 0,31.504 -25.63,57.121 -57.13,57.121 z" /></clipPath><linearGradient
       id="linearGradient120"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.87,654.26)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop110"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop112"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop114"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop116"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop118"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath130"
       clipPathUnits="userSpaceOnUse"><path
         id="path128"
         d="m 3048.35,727.332 c -36.08,0 -65.31,-29.242 -65.31,-65.301 0,-36.07 29.23,-65.312 65.31,-65.312 36.06,0 65.3,29.242 65.3,65.312 0,36.059 -29.24,65.301 -65.3,65.301 z" /></clipPath><linearGradient
       id="linearGradient142"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.98,646.64)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop132"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop134"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop136"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop138"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop140"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath152"
       clipPathUnits="userSpaceOnUse"><path
         id="path150"
         d="m 3592.68,728.238 c -36.54,0 -66.26,-29.726 -66.26,-66.258 0,-36.539 29.72,-66.25 66.26,-66.25 36.53,0 66.25,29.711 66.25,66.25 0,36.532 -29.72,66.258 -66.25,66.258 z" /></clipPath><linearGradient
       id="linearGradient164"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.08,639.03)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop154"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop156"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop158"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop160"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop162"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath174"
       clipPathUnits="userSpaceOnUse"><path
         id="path172"
         d="m 4137.01,736.359 c -41.1,0 -74.43,-33.32 -74.43,-74.418 0,-41.101 33.33,-74.429 74.43,-74.429 41.1,0 74.42,33.328 74.42,74.429 0,41.098 -33.32,74.418 -74.42,74.418 z" /></clipPath><linearGradient
       id="linearGradient186"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.19,631.42)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop176"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop178"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop180"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop182"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop184"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath196"
       clipPathUnits="userSpaceOnUse"><path
         id="path194"
         d="m 4681.34,740.871 c -43.62,0 -78.99,-35.359 -78.99,-78.98 0,-43.621 35.37,-78.981 78.99,-78.981 43.63,0 78.99,35.36 78.99,78.981 0,43.621 -35.36,78.98 -78.99,78.98 z" /></clipPath><linearGradient
       id="linearGradient208"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.29,623.8)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop198"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop200"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop202"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop204"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop206"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath218"
       clipPathUnits="userSpaceOnUse"><path
         id="path216"
         d="m 5225.67,745.391 c -46.13,0 -83.54,-37.411 -83.54,-83.551 0,-46.141 37.41,-83.539 83.54,-83.539 46.15,0 83.56,37.398 83.56,83.539 0,46.14 -37.41,83.551 -83.56,83.551 z" /></clipPath><linearGradient
       id="linearGradient230"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.4,616.18)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop220"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop222"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop224"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop226"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop228"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath240"
       clipPathUnits="userSpaceOnUse"><path
         id="path238"
         d="m 5770.01,749.91 c -48.67,0 -88.11,-39.461 -88.11,-88.121 0,-48.648 39.44,-88.098 88.11,-88.098 48.66,0 88.1,39.45 88.1,88.098 0,48.66 -39.44,88.121 -88.1,88.121 z" /></clipPath><linearGradient
       id="linearGradient252"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.5,608.57)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop242"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop244"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop246"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop248"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop250"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath262"
       clipPathUnits="userSpaceOnUse"><path
         id="path260"
         d="m 6314.34,754.422 c -51.18,0 -92.67,-41.492 -92.67,-92.672 0,-51.18 41.49,-92.672 92.67,-92.672 51.17,0 92.67,41.492 92.67,92.672 0,51.18 -41.5,92.672 -92.67,92.672 z" /></clipPath><linearGradient
       id="linearGradient274"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.61,600.96)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop264"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop266"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop268"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop270"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop272"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath284"
       clipPathUnits="userSpaceOnUse"><path
         id="path282"
         d="m 6858.68,758.93 c -53.7,0 -97.24,-43.52 -97.24,-97.231 0,-53.699 43.54,-97.219 97.24,-97.219 53.69,0 97.23,43.52 97.23,97.219 0,53.711 -43.54,97.231 -97.23,97.231 z" /></clipPath><linearGradient
       id="linearGradient296"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.72,593.34)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop286"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop288"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop290"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop292"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop294"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath306"
       clipPathUnits="userSpaceOnUse"><path
         id="path304"
         d="m 7403,763.449 c -56.22,0 -101.78,-45.57 -101.78,-101.789 0,-56.23 45.56,-101.789 101.78,-101.789 56.23,0 101.79,45.559 101.79,101.789 0,56.219 -45.56,101.789 -101.79,101.789 z" /></clipPath><linearGradient
       id="linearGradient318"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.82,585.73)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop308"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop310"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop312"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop314"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop316"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath328"
       clipPathUnits="userSpaceOnUse"><path
         id="path326"
         d="m 7947.34,767.961 c -58.74,0 -106.36,-47.609 -106.36,-106.352 0,-58.73 47.62,-106.347 106.36,-106.347 58.74,0 106.35,47.617 106.35,106.347 0,58.743 -47.61,106.352 -106.35,106.352 z" /></clipPath><linearGradient
       id="linearGradient340"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.93,578.11)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop330"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop332"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop334"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop336"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop338"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath350"
       clipPathUnits="userSpaceOnUse"><path
         id="path348"
         d="m 8491.67,772.48 c -61.25,0 -110.91,-49.66 -110.91,-110.91 0,-61.261 49.66,-110.922 110.91,-110.922 61.26,0 110.91,49.661 110.91,110.922 0,61.25 -49.65,110.91 -110.91,110.91 z" /></clipPath><linearGradient
       id="linearGradient362"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1943.03,570.5)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop352"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop354"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop356"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop358"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop360"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath372"
       clipPathUnits="userSpaceOnUse"><path
         id="path370"
         d="m 9036,776.988 c -63.77,0 -115.47,-51.699 -115.47,-115.468 0,-63.782 51.7,-115.481 115.47,-115.481 63.77,0 115.47,51.699 115.47,115.481 0,63.769 -51.7,115.468 -115.47,115.468 z" /></clipPath><linearGradient
       id="linearGradient384"
       spreadMethod="pad"
       gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1943.14,562.88)"
       gradientUnits="userSpaceOnUse"
       y2="0"
       x2="1"
       y1="0"
       x1="0"><stop
         id="stop374"
         offset="0"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop376"
         offset="0.00198009"
         style="stop-opacity:1;stop-color:#00adef" /><stop
         id="stop378"
         offset="0.44344"
         style="stop-opacity:1;stop-color:#8d198f" /><stop
         id="stop380"
         offset="0.99856"
         style="stop-opacity:1;stop-color:#340e3d" /><stop
         id="stop382"
         offset="1"
         style="stop-opacity:1;stop-color:#340e3d" /></linearGradient><clipPath
       id="clipPath394"
       clipPathUnits="userSpaceOnUse"><path
         id="path392"
         d="M 0,0 H 9538 V 2615.77 H 0 Z" /></clipPath></defs><g
     transform="matrix(1.3333333,0,0,-1.3333333,0,348.77333)"
     id="g10"><g
       transform="scale(0.1)"
       id="g12"><g
         id="g14"><g
           clip-path="url(#clipPath20)"
           id="g16"><path
             id="path34"
             style="fill:url(#linearGradient32);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 326.688,704.762 c -23.477,0 -42.5,-19.032 -42.5,-42.5 0,-23.481 19.023,-42.5 42.5,-42.5 23.464,0 42.488,19.019 42.488,42.5 0,23.468 -19.024,42.5 -42.488,42.5" /></g></g><g
         id="g36"><g
           clip-path="url(#clipPath42)"
           id="g38"><path
             id="path56"
             style="fill:url(#linearGradient54);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 871.012,709.27 c -25.985,0 -47.059,-21.059 -47.059,-47.059 0,-25.981 21.074,-47.063 47.059,-47.063 25.988,0 47.062,21.082 47.062,47.063 0,26 -21.074,47.059 -47.062,47.059" /></g></g><g
         id="g58"><g
           clip-path="url(#clipPath64)"
           id="g60"><path
             id="path78"
             style="fill:url(#linearGradient76);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 1415.35,713.789 c -28.51,0 -51.62,-23.109 -51.62,-51.617 0,-28.512 23.11,-51.621 51.62,-51.621 28.5,0 51.62,23.109 51.62,51.621 0,28.508 -23.12,51.617 -51.62,51.617" /></g></g><g
         id="g80"><g
           clip-path="url(#clipPath86)"
           id="g82"><path
             id="path100"
             style="fill:url(#linearGradient98);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 1959.67,718.309 c -31.02,0 -56.17,-25.161 -56.17,-56.188 0,-31.019 25.15,-56.18 56.17,-56.18 31.04,0 56.2,25.161 56.2,56.18 0,31.027 -25.16,56.188 -56.2,56.188" /></g></g><g
         id="g102"><g
           clip-path="url(#clipPath108)"
           id="g104"><path
             id="path122"
             style="fill:url(#linearGradient120);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 2504.01,719.199 c -31.5,0 -57.13,-25.617 -57.13,-57.121 0,-31.508 25.63,-57.137 57.13,-57.137 31.5,0 57.13,25.629 57.13,57.137 0,31.504 -25.63,57.121 -57.13,57.121" /></g></g><g
         id="g124"><g
           clip-path="url(#clipPath130)"
           id="g126"><path
             id="path144"
             style="fill:url(#linearGradient142);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 3048.35,727.332 c -36.08,0 -65.31,-29.242 -65.31,-65.301 0,-36.07 29.23,-65.312 65.31,-65.312 36.06,0 65.3,29.242 65.3,65.312 0,36.059 -29.24,65.301 -65.3,65.301" /></g></g><g
         id="g146"><g
           clip-path="url(#clipPath152)"
           id="g148"><path
             id="path166"
             style="fill:url(#linearGradient164);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 3592.68,728.238 c -36.54,0 -66.26,-29.726 -66.26,-66.258 0,-36.539 29.72,-66.25 66.26,-66.25 36.53,0 66.25,29.711 66.25,66.25 0,36.532 -29.72,66.258 -66.25,66.258" /></g></g><g
         id="g168"><g
           clip-path="url(#clipPath174)"
           id="g170"><path
             id="path188"
             style="fill:url(#linearGradient186);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 4137.01,736.359 c -41.1,0 -74.43,-33.32 -74.43,-74.418 0,-41.101 33.33,-74.429 74.43,-74.429 41.1,0 74.42,33.328 74.42,74.429 0,41.098 -33.32,74.418 -74.42,74.418" /></g></g><g
         id="g190"><g
           clip-path="url(#clipPath196)"
           id="g192"><path
             id="path210"
             style="fill:url(#linearGradient208);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 4681.34,740.871 c -43.62,0 -78.99,-35.359 -78.99,-78.98 0,-43.621 35.37,-78.981 78.99,-78.981 43.63,0 78.99,35.36 78.99,78.981 0,43.621 -35.36,78.98 -78.99,78.98" /></g></g><g
         id="g212"><g
           clip-path="url(#clipPath218)"
           id="g214"><path
             id="path232"
             style="fill:url(#linearGradient230);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 5225.67,745.391 c -46.13,0 -83.54,-37.411 -83.54,-83.551 0,-46.141 37.41,-83.539 83.54,-83.539 46.15,0 83.56,37.398 83.56,83.539 0,46.14 -37.41,83.551 -83.56,83.551" /></g></g><g
         id="g234"><g
           clip-path="url(#clipPath240)"
           id="g236"><path
             id="path254"
             style="fill:url(#linearGradient252);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 5770.01,749.91 c -48.67,0 -88.11,-39.461 -88.11,-88.121 0,-48.648 39.44,-88.098 88.11,-88.098 48.66,0 88.1,39.45 88.1,88.098 0,48.66 -39.44,88.121 -88.1,88.121" /></g></g><g
         id="g256"><g
           clip-path="url(#clipPath262)"
           id="g258"><path
             id="path276"
             style="fill:url(#linearGradient274);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 6314.34,754.422 c -51.18,0 -92.67,-41.492 -92.67,-92.672 0,-51.18 41.49,-92.672 92.67,-92.672 51.17,0 92.67,41.492 92.67,92.672 0,51.18 -41.5,92.672 -92.67,92.672" /></g></g><g
         id="g278"><g
           clip-path="url(#clipPath284)"
           id="g280"><path
             id="path298"
             style="fill:url(#linearGradient296);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 6858.68,758.93 c -53.7,0 -97.24,-43.52 -97.24,-97.231 0,-53.699 43.54,-97.219 97.24,-97.219 53.69,0 97.23,43.52 97.23,97.219 0,53.711 -43.54,97.231 -97.23,97.231" /></g></g><g
         id="g300"><g
           clip-path="url(#clipPath306)"
           id="g302"><path
             id="path320"
             style="fill:url(#linearGradient318);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 7403,763.449 c -56.22,0 -101.78,-45.57 -101.78,-101.789 0,-56.23 45.56,-101.789 101.78,-101.789 56.23,0 101.79,45.559 101.79,101.789 0,56.219 -45.56,101.789 -101.79,101.789" /></g></g><g
         id="g322"><g
           clip-path="url(#clipPath328)"
           id="g324"><path
             id="path342"
             style="fill:url(#linearGradient340);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 7947.34,767.961 c -58.74,0 -106.36,-47.609 -106.36,-106.352 0,-58.73 47.62,-106.347 106.36,-106.347 58.74,0 106.35,47.617 106.35,106.347 0,58.743 -47.61,106.352 -106.35,106.352" /></g></g><g
         id="g344"><g
           clip-path="url(#clipPath350)"
           id="g346"><path
             id="path364"
             style="fill:url(#linearGradient362);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 8491.67,772.48 c -61.25,0 -110.91,-49.66 -110.91,-110.91 0,-61.261 49.66,-110.922 110.91,-110.922 61.26,0 110.91,49.661 110.91,110.922 0,61.25 -49.65,110.91 -110.91,110.91" /></g></g><g
         id="g366"><g
           clip-path="url(#clipPath372)"
           id="g368"><path
             id="path386"
             style="fill:url(#linearGradient384);fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 9036,776.988 c -63.77,0 -115.47,-51.699 -115.47,-115.468 0,-63.782 51.7,-115.481 115.47,-115.481 63.77,0 115.47,51.699 115.47,115.481 0,63.769 -51.7,115.468 -115.47,115.468" /></g></g><g
         id="g388"><g
           clip-path="url(#clipPath394)"
           id="g390"><path
             id="path396"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 3254.09,1008.72 c -308.9,0 -521.57,129.97 -535.08,406.79 0,10.13 8.44,18.57 18.57,18.57 h 231.25 c 10.12,0 18.56,-8.44 20.25,-18.57 16.88,-129.97 77.65,-214.36 270.07,-214.36 153.6,0 238,45.56 238,156.97 0,266.69 -754.51,55.7 -754.51,524.95 0,221.11 172.17,359.52 474.31,359.52 275.14,0 465.87,-106.34 503,-356.15 0,-10.13 -6.75,-18.56 -16.88,-18.56 h -231.25 c -11.8,0 -20.25,6.74 -21.94,18.56 -15.19,104.66 -101.27,162.04 -243.06,162.04 -121.53,0 -209.3,-42.19 -209.3,-140.1 0,-251.5 757.88,-47.25 757.88,-514.81 0,-249.82 -192.42,-384.85 -501.31,-384.85" /><path
             id="path398"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 4363.03,1071.18 c 0,-10.13 -8.44,-21.95 -16.88,-25.33 -48.95,-15.19 -102.96,-27 -155.28,-27 -146.86,0 -286.96,74.27 -286.96,271.75 l 1.69,435.49 h -94.52 c -10.13,0 -18.57,8.44 -18.57,18.56 v 141.79 c 0,10.13 8.44,18.58 18.57,18.58 h 92.83 l -1.69,199.16 c 0,10.13 8.44,18.57 18.58,18.57 h 219.42 c 10.13,0 18.58,-8.44 18.58,-18.57 l -1.69,-199.16 h 189.04 c 10.13,0 18.56,-8.45 18.56,-18.58 v -141.79 c 0,-10.12 -8.43,-18.56 -18.56,-18.56 h -190.73 l 1.69,-428.73 c 0,-74.27 37.13,-97.9 92.83,-97.9 38.83,0 69.21,6.75 94.52,13.5 10.13,1.68 18.57,-5.06 18.57,-13.5 v -128.28" /><path
             id="path400"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 4839.03,1182.57 c 124.9,0 183.98,86.09 183.98,285.27 0,195.8 -60.77,290.32 -185.67,290.32 -128.28,-1.69 -187.36,-96.21 -187.36,-292.01 0,-195.8 62.46,-283.58 189.05,-283.58 z m 0,-168.79 c -283.57,0 -447.3,177.24 -447.3,454.06 0,276.81 163.73,459.12 447.3,459.12 283.57,0 443.93,-177.24 443.93,-454.05 0,-276.83 -160.36,-459.13 -443.93,-459.13" /><path
             id="path402"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 5785.93,1013.78 c -278.5,0 -443.92,177.24 -443.92,454.06 0,276.81 165.42,459.12 448.99,459.12 222.81,0 366.28,-124.91 388.23,-312.28 1.68,-10.12 -6.76,-18.56 -16.89,-18.56 h -197.48 c -10.14,0 -20.26,6.76 -21.94,18.56 -18.58,94.53 -81.03,141.79 -151.92,141.79 -128.29,-1.69 -189.05,-94.52 -189.05,-286.94 0,-199.18 62.45,-285.27 189.05,-286.96 84.4,-1.68 148.54,57.4 160.35,168.8 1.69,10.13 10.13,18.57 20.26,18.57 h 202.55 c 10.12,0 18.56,-8.44 16.88,-18.57 -20.26,-195.8 -178.92,-337.59 -405.11,-337.59" /><path
             id="path404"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 6709.22,1739.59 c -82.71,0 -172.17,-65.82 -197.48,-190.74 l 6.74,-494.56 c 0,-10.12 -8.43,-18.56 -18.56,-18.56 h -216.06 c -10.12,0 -18.57,8.44 -18.57,18.56 l 8.45,573.9 -8.45,570.52 c 0,10.12 8.45,18.57 18.57,18.57 h 216.06 c 10.13,0 18.56,-8.45 18.56,-18.57 l -5.07,-391.6 c 59.09,79.33 148.55,118.16 263.33,118.16 195.8,0 315.64,-116.48 310.57,-371.35 l -1.69,-185.67 6.76,-313.96 c 0,-10.12 -8.44,-18.56 -18.57,-18.56 H 6851 c -10.12,0 -18.56,8.44 -18.56,18.56 l 6.75,310.59 -1.69,219.42 c -1.68,104.66 -59.08,155.29 -128.28,155.29" /><path
             id="path406"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 7691.58,1008.72 c -308.9,0 -521.57,129.97 -535.08,406.79 0,10.13 8.44,18.57 18.57,18.57 h 231.25 c 10.12,0 18.56,-8.44 20.25,-18.57 16.88,-129.97 77.65,-214.36 270.07,-214.36 153.6,0 238,45.56 238,156.97 0,266.69 -754.51,55.7 -754.51,524.95 0,221.11 172.17,359.52 474.31,359.52 275.14,0 465.87,-106.34 503,-356.15 0,-10.13 -6.75,-18.56 -16.88,-18.56 h -231.25 c -11.8,0 -20.25,6.74 -21.94,18.56 -15.19,104.66 -101.27,162.04 -243.06,162.04 -121.53,0 -209.3,-42.19 -209.3,-140.1 0,-251.5 757.88,-47.25 757.88,-514.81 0,-249.82 -192.42,-384.85 -501.31,-384.85" /><path
             id="path408"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none"
             d="m 8768.45,1008.72 c -308.89,0 -521.57,129.97 -535.07,406.79 0,10.13 8.43,18.57 18.56,18.57 h 231.25 c 10.13,0 18.56,-8.44 20.25,-18.57 16.89,-129.97 77.65,-214.36 270.07,-214.36 153.61,0 238,45.56 238,156.97 0,266.69 -754.5,55.7 -754.5,524.95 0,221.11 172.17,359.52 474.31,359.52 275.13,0 465.86,-106.34 502.99,-356.15 0,-10.13 -6.74,-18.56 -16.87,-18.56 h -231.25 c -11.81,0 -20.26,6.74 -21.95,18.56 -15.18,104.66 -101.26,162.04 -243.05,162.04 -121.53,0 -209.31,-42.19 -209.31,-140.1 0,-251.5 757.88,-47.25 757.88,-514.81 0,-249.82 -192.42,-384.85 -501.31,-384.85" /></g></g></g></g></svg>`
}


/***/ }),

/***/ "./client/pages/home.js":
/*!******************************!*\
  !*** ./client/pages/home.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page.js */ "./client/pages/page.js");
let $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
let PageView = __webpack_require__(/*! ./base */ "./client/pages/base.js");
let template = __webpack_require__(/*! ../templates/pages/home.pug */ "./client/templates/pages/home.pug");
let graphics = __webpack_require__(/*! ../graphics */ "./client/graphics.js");



let HomePage = PageView.extend({
    pageTitle: 'StochSS | Home',
    template: template,
    render: function () {
      PageView.prototype.render.apply(this, arguments);
      $(this.queryByHook('stochss-logo')).html(graphics['logo'])
    }
});

Object(_page_js__WEBPACK_IMPORTED_MODULE_0__["default"])(HomePage)


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC9wYWdlcy9ob21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRLG9CQUFvQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBLDBCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUJBQXVCO0FBQ3ZDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsZUFBZSxrQkFBa0I7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxlQUFlLGtCQUFrQjtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELGVBQWUsa0JBQWtCO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsZUFBZSxrQkFBa0I7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxlQUFlLGtCQUFrQjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELGVBQWUsa0JBQWtCO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsZUFBZSxrQkFBa0I7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxlQUFlLGtCQUFrQjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELGVBQWUsa0JBQWtCO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsZUFBZSxrQkFBa0I7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxlQUFlLGtCQUFrQjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELGVBQWUsa0JBQWtCO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsZUFBZSxrQkFBa0I7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxlQUFlLGtCQUFrQjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELGVBQWUsa0JBQWtCO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsZUFBZSxrQkFBa0I7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxlQUFlLGtCQUFrQjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGVBQWUsa0JBQWtCO0FBQ2xFO0FBQ0E7QUFDQSxpQ0FBaUMsZUFBZSxrQkFBa0I7QUFDbEU7QUFDQTtBQUNBLGlDQUFpQyxlQUFlLGtCQUFrQjtBQUNsRTtBQUNBO0FBQ0EsaUNBQWlDLGVBQWUsa0JBQWtCO0FBQ2xFO0FBQ0E7QUFDQSxpQ0FBaUMsZUFBZSxrQkFBa0I7QUFDbEU7QUFDQTtBQUNBLGlDQUFpQyxlQUFlLGtCQUFrQjtBQUNsRTtBQUNBO0FBQ0EsaUNBQWlDLGVBQWUsa0JBQWtCO0FBQ2xFO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNwbUJBO0FBQUE7QUFBQSxRQUFRLG1CQUFPLENBQUMsb0RBQVE7QUFDeEIsZUFBZSxtQkFBTyxDQUFDLHNDQUFRO0FBQy9CLGVBQWUsbUJBQU8sQ0FBQyxzRUFBNkI7QUFDcEQsZUFBZSxtQkFBTyxDQUFDLHlDQUFhOztBQUVIOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQsd0RBQVEiLCJmaWxlIjoic3RvY2hzcy1ob21lLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0ZnVuY3Rpb24gd2VicGFja0pzb25wQ2FsbGJhY2soZGF0YSkge1xuIFx0XHR2YXIgY2h1bmtJZHMgPSBkYXRhWzBdO1xuIFx0XHR2YXIgbW9yZU1vZHVsZXMgPSBkYXRhWzFdO1xuIFx0XHR2YXIgZXhlY3V0ZU1vZHVsZXMgPSBkYXRhWzJdO1xuXG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXTtcbiBcdFx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG4gXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG4gXHRcdFx0fVxuIFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG4gXHRcdH1cbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZihwYXJlbnRKc29ucEZ1bmN0aW9uKSBwYXJlbnRKc29ucEZ1bmN0aW9uKGRhdGEpO1xuXG4gXHRcdHdoaWxlKHJlc29sdmVzLmxlbmd0aCkge1xuIFx0XHRcdHJlc29sdmVzLnNoaWZ0KCkoKTtcbiBcdFx0fVxuXG4gXHRcdC8vIGFkZCBlbnRyeSBtb2R1bGVzIGZyb20gbG9hZGVkIGNodW5rIHRvIGRlZmVycmVkIGxpc3RcbiBcdFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2guYXBwbHkoZGVmZXJyZWRNb2R1bGVzLCBleGVjdXRlTW9kdWxlcyB8fCBbXSk7XG5cbiBcdFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiBhbGwgY2h1bmtzIHJlYWR5XG4gXHRcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIFx0fTtcbiBcdGZ1bmN0aW9uIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCkge1xuIFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGRlZmVycmVkTW9kdWxlID0gZGVmZXJyZWRNb2R1bGVzW2ldO1xuIFx0XHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuIFx0XHRcdGZvcih2YXIgaiA9IDE7IGogPCBkZWZlcnJlZE1vZHVsZS5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGRlcElkID0gZGVmZXJyZWRNb2R1bGVbal07XG4gXHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbZGVwSWRdICE9PSAwKSBmdWxmaWxsZWQgPSBmYWxzZTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYoZnVsZmlsbGVkKSB7XG4gXHRcdFx0XHRkZWZlcnJlZE1vZHVsZXMuc3BsaWNlKGktLSwgMSk7XG4gXHRcdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGRlZmVycmVkTW9kdWxlWzBdKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4gXHQvLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0XCJob21lXCI6IDBcbiBcdH07XG5cbiBcdHZhciBkZWZlcnJlZE1vZHVsZXMgPSBbXTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0dmFyIGpzb25wQXJyYXkgPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gfHwgW107XG4gXHR2YXIgb2xkSnNvbnBGdW5jdGlvbiA9IGpzb25wQXJyYXkucHVzaC5iaW5kKGpzb25wQXJyYXkpO1xuIFx0anNvbnBBcnJheS5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2s7XG4gXHRqc29ucEFycmF5ID0ganNvbnBBcnJheS5zbGljZSgpO1xuIFx0Zm9yKHZhciBpID0gMDsgaSA8IGpzb25wQXJyYXkubGVuZ3RoOyBpKyspIHdlYnBhY2tKc29ucENhbGxiYWNrKGpzb25wQXJyYXlbaV0pO1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSBvbGRKc29ucEZ1bmN0aW9uO1xuXG5cbiBcdC8vIGFkZCBlbnRyeSBtb2R1bGUgdG8gZGVmZXJyZWQgbGlzdFxuIFx0ZGVmZXJyZWRNb2R1bGVzLnB1c2goW1wiLi9jbGllbnQvcGFnZXMvaG9tZS5qc1wiLFwiY29tbW9uXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxvZ286XG5gPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIiBzdGFuZGFsb25lPVwibm9cIj8+XG48c3ZnXG4gICB4bWxuczpkYz1cImh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvXCJcbiAgIHhtbG5zOmNjPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjXCJcbiAgIHhtbG5zOnJkZj1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyNcIlxuICAgeG1sbnM6c3ZnPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICB2aWV3Qm94PVwiMCAwIDEyNzEuNzczMyAzNDguNzczMzJcIlxuICAgaGVpZ2h0PVwiMzQ4Ljc3MzMyXCJcbiAgIHdpZHRoPVwiMTI3MS43NzMzXCJcbiAgIHhtbDpzcGFjZT1cInByZXNlcnZlXCJcbiAgIGlkPVwic3ZnMlwiXG4gICB2ZXJzaW9uPVwiMS4xXCI+PG1ldGFkYXRhXG4gICAgIGlkPVwibWV0YWRhdGE4XCI+PHJkZjpSREY+PGNjOldvcmtcbiAgICAgICAgIHJkZjphYm91dD1cIlwiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlXG4gICAgICAgICAgIHJkZjpyZXNvdXJjZT1cImh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlXCIgLz48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnNcbiAgICAgaWQ9XCJkZWZzNlwiPjxjbGlwUGF0aFxuICAgICAgIGlkPVwiY2xpcFBhdGgyMFwiXG4gICAgICAgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+PHBhdGhcbiAgICAgICAgIGlkPVwicGF0aDE4XCJcbiAgICAgICAgIGQ9XCJtIDMyNi42ODgsNzA0Ljc2MiBjIC0yMy40NzcsMCAtNDIuNSwtMTkuMDMyIC00Mi41LC00Mi41IDAsLTIzLjQ4MSAxOS4wMjMsLTQyLjUgNDIuNSwtNDIuNSAyMy40NjQsMCA0Mi40ODgsMTkuMDE5IDQyLjQ4OCw0Mi41IDAsMjMuNDY4IC0xOS4wMjQsNDIuNSAtNDIuNDg4LDQyLjUgelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50MzJcIlxuICAgICAgIHNwcmVhZE1ldGhvZD1cInBhZFwiXG4gICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0MS40NSw2ODQuNzIpXCJcbiAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgIHkyPVwiMFwiXG4gICAgICAgeDI9XCIxXCJcbiAgICAgICB5MT1cIjBcIlxuICAgICAgIHgxPVwiMFwiPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyMlwiXG4gICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMjRcIlxuICAgICAgICAgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDI2XCJcbiAgICAgICAgIG9mZnNldD1cIjAuNDQzNDRcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiM4ZDE5OGZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyOFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjk5ODU2XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMzBcIlxuICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGhcbiAgICAgICBpZD1cImNsaXBQYXRoNDJcIlxuICAgICAgIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxwYXRoXG4gICAgICAgICBpZD1cInBhdGg0MFwiXG4gICAgICAgICBkPVwibSA4NzEuMDEyLDcwOS4yNyBjIC0yNS45ODUsMCAtNDcuMDU5LC0yMS4wNTkgLTQ3LjA1OSwtNDcuMDU5IDAsLTI1Ljk4MSAyMS4wNzQsLTQ3LjA2MyA0Ny4wNTksLTQ3LjA2MyAyNS45ODgsMCA0Ny4wNjIsMjEuMDgyIDQ3LjA2Miw0Ny4wNjMgMCwyNiAtMjEuMDc0LDQ3LjA1OSAtNDcuMDYyLDQ3LjA1OSB6XCIgLz48L2NsaXBQYXRoPjxsaW5lYXJHcmFkaWVudFxuICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQ1NFwiXG4gICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICBncmFkaWVudFRyYW5zZm9ybT1cIm1hdHJpeCg3ODM3LjQyLDEwOC45OTEsMTA4Ljk5MSwtNzgzNy40MiwxOTQxLjU1LDY3Ny4xKVwiXG4gICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICB5Mj1cIjBcIlxuICAgICAgIHgyPVwiMVwiXG4gICAgICAgeTE9XCIwXCJcbiAgICAgICB4MT1cIjBcIj48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wNDRcIlxuICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDQ2XCJcbiAgICAgICAgIG9mZnNldD1cIjAuMDAxOTgwMDlcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMGFkZWZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3A0OFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjQ0MzQ0XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojOGQxOThmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wNTBcIlxuICAgICAgICAgb2Zmc2V0PVwiMC45OTg1NlwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDUyXCJcbiAgICAgICAgIG9mZnNldD1cIjFcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMzNDBlM2RcIiAvPjwvbGluZWFyR3JhZGllbnQ+PGNsaXBQYXRoXG4gICAgICAgaWQ9XCJjbGlwUGF0aDY0XCJcbiAgICAgICBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj48cGF0aFxuICAgICAgICAgaWQ9XCJwYXRoNjJcIlxuICAgICAgICAgZD1cIm0gMTQxNS4zNSw3MTMuNzg5IGMgLTI4LjUxLDAgLTUxLjYyLC0yMy4xMDkgLTUxLjYyLC01MS42MTcgMCwtMjguNTEyIDIzLjExLC01MS42MjEgNTEuNjIsLTUxLjYyMSAyOC41LDAgNTEuNjIsMjMuMTA5IDUxLjYyLDUxLjYyMSAwLDI4LjUwOCAtMjMuMTIsNTEuNjE3IC01MS42Miw1MS42MTcgelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50NzZcIlxuICAgICAgIHNwcmVhZE1ldGhvZD1cInBhZFwiXG4gICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0MS42Niw2NjkuNDkpXCJcbiAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgIHkyPVwiMFwiXG4gICAgICAgeDI9XCIxXCJcbiAgICAgICB5MT1cIjBcIlxuICAgICAgIHgxPVwiMFwiPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3A2NlwiXG4gICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wNjhcIlxuICAgICAgICAgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDcwXCJcbiAgICAgICAgIG9mZnNldD1cIjAuNDQzNDRcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiM4ZDE5OGZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3A3MlwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjk5ODU2XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wNzRcIlxuICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGhcbiAgICAgICBpZD1cImNsaXBQYXRoODZcIlxuICAgICAgIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxwYXRoXG4gICAgICAgICBpZD1cInBhdGg4NFwiXG4gICAgICAgICBkPVwibSAxOTU5LjY3LDcxOC4zMDkgYyAtMzEuMDIsMCAtNTYuMTcsLTI1LjE2MSAtNTYuMTcsLTU2LjE4OCAwLC0zMS4wMTkgMjUuMTUsLTU2LjE4IDU2LjE3LC01Ni4xOCAzMS4wNCwwIDU2LjIsMjUuMTYxIDU2LjIsNTYuMTggMCwzMS4wMjcgLTI1LjE2LDU2LjE4OCAtNTYuMiw1Ni4xODggelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50OThcIlxuICAgICAgIHNwcmVhZE1ldGhvZD1cInBhZFwiXG4gICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0MS43Niw2NjEuODcpXCJcbiAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgIHkyPVwiMFwiXG4gICAgICAgeDI9XCIxXCJcbiAgICAgICB5MT1cIjBcIlxuICAgICAgIHgxPVwiMFwiPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3A4OFwiXG4gICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wOTBcIlxuICAgICAgICAgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDkyXCJcbiAgICAgICAgIG9mZnNldD1cIjAuNDQzNDRcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiM4ZDE5OGZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3A5NFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjk5ODU2XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wOTZcIlxuICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGhcbiAgICAgICBpZD1cImNsaXBQYXRoMTA4XCJcbiAgICAgICBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj48cGF0aFxuICAgICAgICAgaWQ9XCJwYXRoMTA2XCJcbiAgICAgICAgIGQ9XCJtIDI1MDQuMDEsNzE5LjE5OSBjIC0zMS41LDAgLTU3LjEzLC0yNS42MTcgLTU3LjEzLC01Ny4xMjEgMCwtMzEuNTA4IDI1LjYzLC01Ny4xMzcgNTcuMTMsLTU3LjEzNyAzMS41LDAgNTcuMTMsMjUuNjI5IDU3LjEzLDU3LjEzNyAwLDMxLjUwNCAtMjUuNjMsNTcuMTIxIC01Ny4xMyw1Ny4xMjEgelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50MTIwXCJcbiAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDEuODcsNjU0LjI2KVwiXG4gICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICB5Mj1cIjBcIlxuICAgICAgIHgyPVwiMVwiXG4gICAgICAgeTE9XCIwXCJcbiAgICAgICB4MT1cIjBcIj48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMTEwXCJcbiAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMGFkZWZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AxMTJcIlxuICAgICAgICAgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDExNFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjQ0MzQ0XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojOGQxOThmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMTE2XCJcbiAgICAgICAgIG9mZnNldD1cIjAuOTk4NTZcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMzNDBlM2RcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AxMThcIlxuICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGhcbiAgICAgICBpZD1cImNsaXBQYXRoMTMwXCJcbiAgICAgICBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj48cGF0aFxuICAgICAgICAgaWQ9XCJwYXRoMTI4XCJcbiAgICAgICAgIGQ9XCJtIDMwNDguMzUsNzI3LjMzMiBjIC0zNi4wOCwwIC02NS4zMSwtMjkuMjQyIC02NS4zMSwtNjUuMzAxIDAsLTM2LjA3IDI5LjIzLC02NS4zMTIgNjUuMzEsLTY1LjMxMiAzNi4wNiwwIDY1LjMsMjkuMjQyIDY1LjMsNjUuMzEyIDAsMzYuMDU5IC0yOS4yNCw2NS4zMDEgLTY1LjMsNjUuMzAxIHpcIiAvPjwvY2xpcFBhdGg+PGxpbmVhckdyYWRpZW50XG4gICAgICAgaWQ9XCJsaW5lYXJHcmFkaWVudDE0MlwiXG4gICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICBncmFkaWVudFRyYW5zZm9ybT1cIm1hdHJpeCg3ODM3LjQyLDEwOC45OTEsMTA4Ljk5MSwtNzgzNy40MiwxOTQxLjk4LDY0Ni42NClcIlxuICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgeTI9XCIwXCJcbiAgICAgICB4Mj1cIjFcIlxuICAgICAgIHkxPVwiMFwiXG4gICAgICAgeDE9XCIwXCI+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDEzMlwiXG4gICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMTM0XCJcbiAgICAgICAgIG9mZnNldD1cIjAuMDAxOTgwMDlcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMGFkZWZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AxMzZcIlxuICAgICAgICAgb2Zmc2V0PVwiMC40NDM0NFwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzhkMTk4ZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDEzOFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjk5ODU2XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMTQwXCJcbiAgICAgICAgIG9mZnNldD1cIjFcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMzNDBlM2RcIiAvPjwvbGluZWFyR3JhZGllbnQ+PGNsaXBQYXRoXG4gICAgICAgaWQ9XCJjbGlwUGF0aDE1MlwiXG4gICAgICAgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+PHBhdGhcbiAgICAgICAgIGlkPVwicGF0aDE1MFwiXG4gICAgICAgICBkPVwibSAzNTkyLjY4LDcyOC4yMzggYyAtMzYuNTQsMCAtNjYuMjYsLTI5LjcyNiAtNjYuMjYsLTY2LjI1OCAwLC0zNi41MzkgMjkuNzIsLTY2LjI1IDY2LjI2LC02Ni4yNSAzNi41MywwIDY2LjI1LDI5LjcxMSA2Ni4yNSw2Ni4yNSAwLDM2LjUzMiAtMjkuNzIsNjYuMjU4IC02Ni4yNSw2Ni4yNTggelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50MTY0XCJcbiAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuMDgsNjM5LjAzKVwiXG4gICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICB5Mj1cIjBcIlxuICAgICAgIHgyPVwiMVwiXG4gICAgICAgeTE9XCIwXCJcbiAgICAgICB4MT1cIjBcIj48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMTU0XCJcbiAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMGFkZWZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AxNTZcIlxuICAgICAgICAgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDE1OFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjQ0MzQ0XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojOGQxOThmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMTYwXCJcbiAgICAgICAgIG9mZnNldD1cIjAuOTk4NTZcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMzNDBlM2RcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AxNjJcIlxuICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGhcbiAgICAgICBpZD1cImNsaXBQYXRoMTc0XCJcbiAgICAgICBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj48cGF0aFxuICAgICAgICAgaWQ9XCJwYXRoMTcyXCJcbiAgICAgICAgIGQ9XCJtIDQxMzcuMDEsNzM2LjM1OSBjIC00MS4xLDAgLTc0LjQzLC0zMy4zMiAtNzQuNDMsLTc0LjQxOCAwLC00MS4xMDEgMzMuMzMsLTc0LjQyOSA3NC40MywtNzQuNDI5IDQxLjEsMCA3NC40MiwzMy4zMjggNzQuNDIsNzQuNDI5IDAsNDEuMDk4IC0zMy4zMiw3NC40MTggLTc0LjQyLDc0LjQxOCB6XCIgLz48L2NsaXBQYXRoPjxsaW5lYXJHcmFkaWVudFxuICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQxODZcIlxuICAgICAgIHNwcmVhZE1ldGhvZD1cInBhZFwiXG4gICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0Mi4xOSw2MzEuNDIpXCJcbiAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgIHkyPVwiMFwiXG4gICAgICAgeDI9XCIxXCJcbiAgICAgICB5MT1cIjBcIlxuICAgICAgIHgxPVwiMFwiPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AxNzZcIlxuICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDE3OFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjAwMTk4MDA5XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMTgwXCJcbiAgICAgICAgIG9mZnNldD1cIjAuNDQzNDRcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiM4ZDE5OGZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AxODJcIlxuICAgICAgICAgb2Zmc2V0PVwiMC45OTg1NlwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDE4NFwiXG4gICAgICAgICBvZmZzZXQ9XCIxXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aFxuICAgICAgIGlkPVwiY2xpcFBhdGgxOTZcIlxuICAgICAgIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxwYXRoXG4gICAgICAgICBpZD1cInBhdGgxOTRcIlxuICAgICAgICAgZD1cIm0gNDY4MS4zNCw3NDAuODcxIGMgLTQzLjYyLDAgLTc4Ljk5LC0zNS4zNTkgLTc4Ljk5LC03OC45OCAwLC00My42MjEgMzUuMzcsLTc4Ljk4MSA3OC45OSwtNzguOTgxIDQzLjYzLDAgNzguOTksMzUuMzYgNzguOTksNzguOTgxIDAsNDMuNjIxIC0zNS4zNiw3OC45OCAtNzguOTksNzguOTggelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50MjA4XCJcbiAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuMjksNjIzLjgpXCJcbiAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgIHkyPVwiMFwiXG4gICAgICAgeDI9XCIxXCJcbiAgICAgICB5MT1cIjBcIlxuICAgICAgIHgxPVwiMFwiPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AxOThcIlxuICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDIwMFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjAwMTk4MDA5XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMjAyXCJcbiAgICAgICAgIG9mZnNldD1cIjAuNDQzNDRcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiM4ZDE5OGZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyMDRcIlxuICAgICAgICAgb2Zmc2V0PVwiMC45OTg1NlwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDIwNlwiXG4gICAgICAgICBvZmZzZXQ9XCIxXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aFxuICAgICAgIGlkPVwiY2xpcFBhdGgyMThcIlxuICAgICAgIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxwYXRoXG4gICAgICAgICBpZD1cInBhdGgyMTZcIlxuICAgICAgICAgZD1cIm0gNTIyNS42Nyw3NDUuMzkxIGMgLTQ2LjEzLDAgLTgzLjU0LC0zNy40MTEgLTgzLjU0LC04My41NTEgMCwtNDYuMTQxIDM3LjQxLC04My41MzkgODMuNTQsLTgzLjUzOSA0Ni4xNSwwIDgzLjU2LDM3LjM5OCA4My41Niw4My41MzkgMCw0Ni4xNCAtMzcuNDEsODMuNTUxIC04My41Niw4My41NTEgelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50MjMwXCJcbiAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuNCw2MTYuMTgpXCJcbiAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgIHkyPVwiMFwiXG4gICAgICAgeDI9XCIxXCJcbiAgICAgICB5MT1cIjBcIlxuICAgICAgIHgxPVwiMFwiPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyMjBcIlxuICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDIyMlwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjAwMTk4MDA5XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMjI0XCJcbiAgICAgICAgIG9mZnNldD1cIjAuNDQzNDRcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiM4ZDE5OGZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyMjZcIlxuICAgICAgICAgb2Zmc2V0PVwiMC45OTg1NlwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDIyOFwiXG4gICAgICAgICBvZmZzZXQ9XCIxXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aFxuICAgICAgIGlkPVwiY2xpcFBhdGgyNDBcIlxuICAgICAgIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxwYXRoXG4gICAgICAgICBpZD1cInBhdGgyMzhcIlxuICAgICAgICAgZD1cIm0gNTc3MC4wMSw3NDkuOTEgYyAtNDguNjcsMCAtODguMTEsLTM5LjQ2MSAtODguMTEsLTg4LjEyMSAwLC00OC42NDggMzkuNDQsLTg4LjA5OCA4OC4xMSwtODguMDk4IDQ4LjY2LDAgODguMSwzOS40NSA4OC4xLDg4LjA5OCAwLDQ4LjY2IC0zOS40NCw4OC4xMjEgLTg4LjEsODguMTIxIHpcIiAvPjwvY2xpcFBhdGg+PGxpbmVhckdyYWRpZW50XG4gICAgICAgaWQ9XCJsaW5lYXJHcmFkaWVudDI1MlwiXG4gICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICBncmFkaWVudFRyYW5zZm9ybT1cIm1hdHJpeCg3ODM3LjQyLDEwOC45OTEsMTA4Ljk5MSwtNzgzNy40MiwxOTQyLjUsNjA4LjU3KVwiXG4gICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICB5Mj1cIjBcIlxuICAgICAgIHgyPVwiMVwiXG4gICAgICAgeTE9XCIwXCJcbiAgICAgICB4MT1cIjBcIj48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMjQyXCJcbiAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMGFkZWZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyNDRcIlxuICAgICAgICAgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDI0NlwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjQ0MzQ0XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojOGQxOThmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMjQ4XCJcbiAgICAgICAgIG9mZnNldD1cIjAuOTk4NTZcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMzNDBlM2RcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyNTBcIlxuICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGhcbiAgICAgICBpZD1cImNsaXBQYXRoMjYyXCJcbiAgICAgICBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj48cGF0aFxuICAgICAgICAgaWQ9XCJwYXRoMjYwXCJcbiAgICAgICAgIGQ9XCJtIDYzMTQuMzQsNzU0LjQyMiBjIC01MS4xOCwwIC05Mi42NywtNDEuNDkyIC05Mi42NywtOTIuNjcyIDAsLTUxLjE4IDQxLjQ5LC05Mi42NzIgOTIuNjcsLTkyLjY3MiA1MS4xNywwIDkyLjY3LDQxLjQ5MiA5Mi42Nyw5Mi42NzIgMCw1MS4xOCAtNDEuNSw5Mi42NzIgLTkyLjY3LDkyLjY3MiB6XCIgLz48L2NsaXBQYXRoPjxsaW5lYXJHcmFkaWVudFxuICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQyNzRcIlxuICAgICAgIHNwcmVhZE1ldGhvZD1cInBhZFwiXG4gICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0Mi42MSw2MDAuOTYpXCJcbiAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgIHkyPVwiMFwiXG4gICAgICAgeDI9XCIxXCJcbiAgICAgICB5MT1cIjBcIlxuICAgICAgIHgxPVwiMFwiPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyNjRcIlxuICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDI2NlwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjAwMTk4MDA5XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMjY4XCJcbiAgICAgICAgIG9mZnNldD1cIjAuNDQzNDRcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiM4ZDE5OGZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyNzBcIlxuICAgICAgICAgb2Zmc2V0PVwiMC45OTg1NlwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDI3MlwiXG4gICAgICAgICBvZmZzZXQ9XCIxXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aFxuICAgICAgIGlkPVwiY2xpcFBhdGgyODRcIlxuICAgICAgIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxwYXRoXG4gICAgICAgICBpZD1cInBhdGgyODJcIlxuICAgICAgICAgZD1cIm0gNjg1OC42OCw3NTguOTMgYyAtNTMuNywwIC05Ny4yNCwtNDMuNTIgLTk3LjI0LC05Ny4yMzEgMCwtNTMuNjk5IDQzLjU0LC05Ny4yMTkgOTcuMjQsLTk3LjIxOSA1My42OSwwIDk3LjIzLDQzLjUyIDk3LjIzLDk3LjIxOSAwLDUzLjcxMSAtNDMuNTQsOTcuMjMxIC05Ny4yMyw5Ny4yMzEgelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50Mjk2XCJcbiAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuNzIsNTkzLjM0KVwiXG4gICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICB5Mj1cIjBcIlxuICAgICAgIHgyPVwiMVwiXG4gICAgICAgeTE9XCIwXCJcbiAgICAgICB4MT1cIjBcIj48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMjg2XCJcbiAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMGFkZWZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyODhcIlxuICAgICAgICAgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDI5MFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjQ0MzQ0XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojOGQxOThmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMjkyXCJcbiAgICAgICAgIG9mZnNldD1cIjAuOTk4NTZcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMzNDBlM2RcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AyOTRcIlxuICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGhcbiAgICAgICBpZD1cImNsaXBQYXRoMzA2XCJcbiAgICAgICBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj48cGF0aFxuICAgICAgICAgaWQ9XCJwYXRoMzA0XCJcbiAgICAgICAgIGQ9XCJtIDc0MDMsNzYzLjQ0OSBjIC01Ni4yMiwwIC0xMDEuNzgsLTQ1LjU3IC0xMDEuNzgsLTEwMS43ODkgMCwtNTYuMjMgNDUuNTYsLTEwMS43ODkgMTAxLjc4LC0xMDEuNzg5IDU2LjIzLDAgMTAxLjc5LDQ1LjU1OSAxMDEuNzksMTAxLjc4OSAwLDU2LjIxOSAtNDUuNTYsMTAxLjc4OSAtMTAxLjc5LDEwMS43ODkgelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50MzE4XCJcbiAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuODIsNTg1LjczKVwiXG4gICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICB5Mj1cIjBcIlxuICAgICAgIHgyPVwiMVwiXG4gICAgICAgeTE9XCIwXCJcbiAgICAgICB4MT1cIjBcIj48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMzA4XCJcbiAgICAgICAgIG9mZnNldD1cIjBcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMGFkZWZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AzMTBcIlxuICAgICAgICAgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDMxMlwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjQ0MzQ0XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojOGQxOThmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMzE0XCJcbiAgICAgICAgIG9mZnNldD1cIjAuOTk4NTZcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMzNDBlM2RcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AzMTZcIlxuICAgICAgICAgb2Zmc2V0PVwiMVwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGhcbiAgICAgICBpZD1cImNsaXBQYXRoMzI4XCJcbiAgICAgICBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj48cGF0aFxuICAgICAgICAgaWQ9XCJwYXRoMzI2XCJcbiAgICAgICAgIGQ9XCJtIDc5NDcuMzQsNzY3Ljk2MSBjIC01OC43NCwwIC0xMDYuMzYsLTQ3LjYwOSAtMTA2LjM2LC0xMDYuMzUyIDAsLTU4LjczIDQ3LjYyLC0xMDYuMzQ3IDEwNi4zNiwtMTA2LjM0NyA1OC43NCwwIDEwNi4zNSw0Ny42MTcgMTA2LjM1LDEwNi4zNDcgMCw1OC43NDMgLTQ3LjYxLDEwNi4zNTIgLTEwNi4zNSwxMDYuMzUyIHpcIiAvPjwvY2xpcFBhdGg+PGxpbmVhckdyYWRpZW50XG4gICAgICAgaWQ9XCJsaW5lYXJHcmFkaWVudDM0MFwiXG4gICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICBncmFkaWVudFRyYW5zZm9ybT1cIm1hdHJpeCg3ODM3LjQyLDEwOC45OTEsMTA4Ljk5MSwtNzgzNy40MiwxOTQyLjkzLDU3OC4xMSlcIlxuICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgeTI9XCIwXCJcbiAgICAgICB4Mj1cIjFcIlxuICAgICAgIHkxPVwiMFwiXG4gICAgICAgeDE9XCIwXCI+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDMzMFwiXG4gICAgICAgICBvZmZzZXQ9XCIwXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMzMyXCJcbiAgICAgICAgIG9mZnNldD1cIjAuMDAxOTgwMDlcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMGFkZWZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AzMzRcIlxuICAgICAgICAgb2Zmc2V0PVwiMC40NDM0NFwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzhkMTk4ZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDMzNlwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjk5ODU2XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMzM4XCJcbiAgICAgICAgIG9mZnNldD1cIjFcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMzNDBlM2RcIiAvPjwvbGluZWFyR3JhZGllbnQ+PGNsaXBQYXRoXG4gICAgICAgaWQ9XCJjbGlwUGF0aDM1MFwiXG4gICAgICAgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+PHBhdGhcbiAgICAgICAgIGlkPVwicGF0aDM0OFwiXG4gICAgICAgICBkPVwibSA4NDkxLjY3LDc3Mi40OCBjIC02MS4yNSwwIC0xMTAuOTEsLTQ5LjY2IC0xMTAuOTEsLTExMC45MSAwLC02MS4yNjEgNDkuNjYsLTExMC45MjIgMTEwLjkxLC0xMTAuOTIyIDYxLjI2LDAgMTEwLjkxLDQ5LjY2MSAxMTAuOTEsMTEwLjkyMiAwLDYxLjI1IC00OS42NSwxMTAuOTEgLTExMC45MSwxMTAuOTEgelwiIC8+PC9jbGlwUGF0aD48bGluZWFyR3JhZGllbnRcbiAgICAgICBpZD1cImxpbmVhckdyYWRpZW50MzYyXCJcbiAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDMuMDMsNTcwLjUpXCJcbiAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgIHkyPVwiMFwiXG4gICAgICAgeDI9XCIxXCJcbiAgICAgICB5MT1cIjBcIlxuICAgICAgIHgxPVwiMFwiPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AzNTJcIlxuICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDM1NFwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjAwMTk4MDA5XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMzU2XCJcbiAgICAgICAgIG9mZnNldD1cIjAuNDQzNDRcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiM4ZDE5OGZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AzNThcIlxuICAgICAgICAgb2Zmc2V0PVwiMC45OTg1NlwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDM2MFwiXG4gICAgICAgICBvZmZzZXQ9XCIxXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aFxuICAgICAgIGlkPVwiY2xpcFBhdGgzNzJcIlxuICAgICAgIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxwYXRoXG4gICAgICAgICBpZD1cInBhdGgzNzBcIlxuICAgICAgICAgZD1cIm0gOTAzNiw3NzYuOTg4IGMgLTYzLjc3LDAgLTExNS40NywtNTEuNjk5IC0xMTUuNDcsLTExNS40NjggMCwtNjMuNzgyIDUxLjcsLTExNS40ODEgMTE1LjQ3LC0xMTUuNDgxIDYzLjc3LDAgMTE1LjQ3LDUxLjY5OSAxMTUuNDcsMTE1LjQ4MSAwLDYzLjc2OSAtNTEuNywxMTUuNDY4IC0xMTUuNDcsMTE1LjQ2OCB6XCIgLz48L2NsaXBQYXRoPjxsaW5lYXJHcmFkaWVudFxuICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQzODRcIlxuICAgICAgIHNwcmVhZE1ldGhvZD1cInBhZFwiXG4gICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0My4xNCw1NjIuODgpXCJcbiAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgIHkyPVwiMFwiXG4gICAgICAgeDI9XCIxXCJcbiAgICAgICB5MT1cIjBcIlxuICAgICAgIHgxPVwiMFwiPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AzNzRcIlxuICAgICAgICAgb2Zmc2V0PVwiMFwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwYWRlZlwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDM3NlwiXG4gICAgICAgICBvZmZzZXQ9XCIwLjAwMTk4MDA5XCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMDBhZGVmXCIgLz48c3RvcFxuICAgICAgICAgaWQ9XCJzdG9wMzc4XCJcbiAgICAgICAgIG9mZnNldD1cIjAuNDQzNDRcIlxuICAgICAgICAgc3R5bGU9XCJzdG9wLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiM4ZDE5OGZcIiAvPjxzdG9wXG4gICAgICAgICBpZD1cInN0b3AzODBcIlxuICAgICAgICAgb2Zmc2V0PVwiMC45OTg1NlwiXG4gICAgICAgICBzdHlsZT1cInN0b3Atb3BhY2l0eToxO3N0b3AtY29sb3I6IzM0MGUzZFwiIC8+PHN0b3BcbiAgICAgICAgIGlkPVwic3RvcDM4MlwiXG4gICAgICAgICBvZmZzZXQ9XCIxXCJcbiAgICAgICAgIHN0eWxlPVwic3RvcC1vcGFjaXR5OjE7c3RvcC1jb2xvcjojMzQwZTNkXCIgLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aFxuICAgICAgIGlkPVwiY2xpcFBhdGgzOTRcIlxuICAgICAgIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPjxwYXRoXG4gICAgICAgICBpZD1cInBhdGgzOTJcIlxuICAgICAgICAgZD1cIk0gMCwwIEggOTUzOCBWIDI2MTUuNzcgSCAwIFpcIiAvPjwvY2xpcFBhdGg+PC9kZWZzPjxnXG4gICAgIHRyYW5zZm9ybT1cIm1hdHJpeCgxLjMzMzMzMzMsMCwwLC0xLjMzMzMzMzMsMCwzNDguNzczMzMpXCJcbiAgICAgaWQ9XCJnMTBcIj48Z1xuICAgICAgIHRyYW5zZm9ybT1cInNjYWxlKDAuMSlcIlxuICAgICAgIGlkPVwiZzEyXCI+PGdcbiAgICAgICAgIGlkPVwiZzE0XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKCNjbGlwUGF0aDIwKVwiXG4gICAgICAgICAgIGlkPVwiZzE2XCI+PHBhdGhcbiAgICAgICAgICAgICBpZD1cInBhdGgzNFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQzMik7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDMyNi42ODgsNzA0Ljc2MiBjIC0yMy40NzcsMCAtNDIuNSwtMTkuMDMyIC00Mi41LC00Mi41IDAsLTIzLjQ4MSAxOS4wMjMsLTQyLjUgNDIuNSwtNDIuNSAyMy40NjQsMCA0Mi40ODgsMTkuMDE5IDQyLjQ4OCw0Mi41IDAsMjMuNDY4IC0xOS4wMjQsNDIuNSAtNDIuNDg4LDQyLjVcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzM2XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKCNjbGlwUGF0aDQyKVwiXG4gICAgICAgICAgIGlkPVwiZzM4XCI+PHBhdGhcbiAgICAgICAgICAgICBpZD1cInBhdGg1NlwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQ1NCk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDg3MS4wMTIsNzA5LjI3IGMgLTI1Ljk4NSwwIC00Ny4wNTksLTIxLjA1OSAtNDcuMDU5LC00Ny4wNTkgMCwtMjUuOTgxIDIxLjA3NCwtNDcuMDYzIDQ3LjA1OSwtNDcuMDYzIDI1Ljk4OCwwIDQ3LjA2MiwyMS4wODIgNDcuMDYyLDQ3LjA2MyAwLDI2IC0yMS4wNzQsNDcuMDU5IC00Ny4wNjIsNDcuMDU5XCIgLz48L2c+PC9nPjxnXG4gICAgICAgICBpZD1cImc1OFwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgjY2xpcFBhdGg2NClcIlxuICAgICAgICAgICBpZD1cImc2MFwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoNzhcIlxuICAgICAgICAgICAgIHN0eWxlPVwiZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50NzYpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lXCJcbiAgICAgICAgICAgICBkPVwibSAxNDE1LjM1LDcxMy43ODkgYyAtMjguNTEsMCAtNTEuNjIsLTIzLjEwOSAtNTEuNjIsLTUxLjYxNyAwLC0yOC41MTIgMjMuMTEsLTUxLjYyMSA1MS42MiwtNTEuNjIxIDI4LjUsMCA1MS42MiwyMy4xMDkgNTEuNjIsNTEuNjIxIDAsMjguNTA4IC0yMy4xMiw1MS42MTcgLTUxLjYyLDUxLjYxN1wiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnODBcIj48Z1xuICAgICAgICAgICBjbGlwLXBhdGg9XCJ1cmwoI2NsaXBQYXRoODYpXCJcbiAgICAgICAgICAgaWQ9XCJnODJcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDEwMFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQ5OCk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDE5NTkuNjcsNzE4LjMwOSBjIC0zMS4wMiwwIC01Ni4xNywtMjUuMTYxIC01Ni4xNywtNTYuMTg4IDAsLTMxLjAxOSAyNS4xNSwtNTYuMTggNTYuMTcsLTU2LjE4IDMxLjA0LDAgNTYuMiwyNS4xNjEgNTYuMiw1Ni4xOCAwLDMxLjAyNyAtMjUuMTYsNTYuMTg4IC01Ni4yLDU2LjE4OFwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMTAyXCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKCNjbGlwUGF0aDEwOClcIlxuICAgICAgICAgICBpZD1cImcxMDRcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDEyMlwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQxMjApO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lXCJcbiAgICAgICAgICAgICBkPVwibSAyNTA0LjAxLDcxOS4xOTkgYyAtMzEuNSwwIC01Ny4xMywtMjUuNjE3IC01Ny4xMywtNTcuMTIxIDAsLTMxLjUwOCAyNS42MywtNTcuMTM3IDU3LjEzLC01Ny4xMzcgMzEuNSwwIDU3LjEzLDI1LjYyOSA1Ny4xMyw1Ny4xMzcgMCwzMS41MDQgLTI1LjYzLDU3LjEyMSAtNTcuMTMsNTcuMTIxXCIgLz48L2c+PC9nPjxnXG4gICAgICAgICBpZD1cImcxMjRcIj48Z1xuICAgICAgICAgICBjbGlwLXBhdGg9XCJ1cmwoI2NsaXBQYXRoMTMwKVwiXG4gICAgICAgICAgIGlkPVwiZzEyNlwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMTQ0XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDE0Mik7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDMwNDguMzUsNzI3LjMzMiBjIC0zNi4wOCwwIC02NS4zMSwtMjkuMjQyIC02NS4zMSwtNjUuMzAxIDAsLTM2LjA3IDI5LjIzLC02NS4zMTIgNjUuMzEsLTY1LjMxMiAzNi4wNiwwIDY1LjMsMjkuMjQyIDY1LjMsNjUuMzEyIDAsMzYuMDU5IC0yOS4yNCw2NS4zMDEgLTY1LjMsNjUuMzAxXCIgLz48L2c+PC9nPjxnXG4gICAgICAgICBpZD1cImcxNDZcIj48Z1xuICAgICAgICAgICBjbGlwLXBhdGg9XCJ1cmwoI2NsaXBQYXRoMTUyKVwiXG4gICAgICAgICAgIGlkPVwiZzE0OFwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMTY2XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDE2NCk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDM1OTIuNjgsNzI4LjIzOCBjIC0zNi41NCwwIC02Ni4yNiwtMjkuNzI2IC02Ni4yNiwtNjYuMjU4IDAsLTM2LjUzOSAyOS43MiwtNjYuMjUgNjYuMjYsLTY2LjI1IDM2LjUzLDAgNjYuMjUsMjkuNzExIDY2LjI1LDY2LjI1IDAsMzYuNTMyIC0yOS43Miw2Ni4yNTggLTY2LjI1LDY2LjI1OFwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMTY4XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKCNjbGlwUGF0aDE3NClcIlxuICAgICAgICAgICBpZD1cImcxNzBcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDE4OFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQxODYpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lXCJcbiAgICAgICAgICAgICBkPVwibSA0MTM3LjAxLDczNi4zNTkgYyAtNDEuMSwwIC03NC40MywtMzMuMzIgLTc0LjQzLC03NC40MTggMCwtNDEuMTAxIDMzLjMzLC03NC40MjkgNzQuNDMsLTc0LjQyOSA0MS4xLDAgNzQuNDIsMzMuMzI4IDc0LjQyLDc0LjQyOSAwLDQxLjA5OCAtMzMuMzIsNzQuNDE4IC03NC40Miw3NC40MThcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzE5MFwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgjY2xpcFBhdGgxOTYpXCJcbiAgICAgICAgICAgaWQ9XCJnMTkyXCI+PHBhdGhcbiAgICAgICAgICAgICBpZD1cInBhdGgyMTBcIlxuICAgICAgICAgICAgIHN0eWxlPVwiZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50MjA4KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZVwiXG4gICAgICAgICAgICAgZD1cIm0gNDY4MS4zNCw3NDAuODcxIGMgLTQzLjYyLDAgLTc4Ljk5LC0zNS4zNTkgLTc4Ljk5LC03OC45OCAwLC00My42MjEgMzUuMzcsLTc4Ljk4MSA3OC45OSwtNzguOTgxIDQzLjYzLDAgNzguOTksMzUuMzYgNzguOTksNzguOTgxIDAsNDMuNjIxIC0zNS4zNiw3OC45OCAtNzguOTksNzguOThcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzIxMlwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgjY2xpcFBhdGgyMTgpXCJcbiAgICAgICAgICAgaWQ9XCJnMjE0XCI+PHBhdGhcbiAgICAgICAgICAgICBpZD1cInBhdGgyMzJcIlxuICAgICAgICAgICAgIHN0eWxlPVwiZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50MjMwKTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZVwiXG4gICAgICAgICAgICAgZD1cIm0gNTIyNS42Nyw3NDUuMzkxIGMgLTQ2LjEzLDAgLTgzLjU0LC0zNy40MTEgLTgzLjU0LC04My41NTEgMCwtNDYuMTQxIDM3LjQxLC04My41MzkgODMuNTQsLTgzLjUzOSA0Ni4xNSwwIDgzLjU2LDM3LjM5OCA4My41Niw4My41MzkgMCw0Ni4xNCAtMzcuNDEsODMuNTUxIC04My41Niw4My41NTFcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzIzNFwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgjY2xpcFBhdGgyNDApXCJcbiAgICAgICAgICAgaWQ9XCJnMjM2XCI+PHBhdGhcbiAgICAgICAgICAgICBpZD1cInBhdGgyNTRcIlxuICAgICAgICAgICAgIHN0eWxlPVwiZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50MjUyKTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZVwiXG4gICAgICAgICAgICAgZD1cIm0gNTc3MC4wMSw3NDkuOTEgYyAtNDguNjcsMCAtODguMTEsLTM5LjQ2MSAtODguMTEsLTg4LjEyMSAwLC00OC42NDggMzkuNDQsLTg4LjA5OCA4OC4xMSwtODguMDk4IDQ4LjY2LDAgODguMSwzOS40NSA4OC4xLDg4LjA5OCAwLDQ4LjY2IC0zOS40NCw4OC4xMjEgLTg4LjEsODguMTIxXCIgLz48L2c+PC9nPjxnXG4gICAgICAgICBpZD1cImcyNTZcIj48Z1xuICAgICAgICAgICBjbGlwLXBhdGg9XCJ1cmwoI2NsaXBQYXRoMjYyKVwiXG4gICAgICAgICAgIGlkPVwiZzI1OFwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMjc2XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDI3NCk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDYzMTQuMzQsNzU0LjQyMiBjIC01MS4xOCwwIC05Mi42NywtNDEuNDkyIC05Mi42NywtOTIuNjcyIDAsLTUxLjE4IDQxLjQ5LC05Mi42NzIgOTIuNjcsLTkyLjY3MiA1MS4xNywwIDkyLjY3LDQxLjQ5MiA5Mi42Nyw5Mi42NzIgMCw1MS4xOCAtNDEuNSw5Mi42NzIgLTkyLjY3LDkyLjY3MlwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMjc4XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKCNjbGlwUGF0aDI4NClcIlxuICAgICAgICAgICBpZD1cImcyODBcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDI5OFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQyOTYpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lXCJcbiAgICAgICAgICAgICBkPVwibSA2ODU4LjY4LDc1OC45MyBjIC01My43LDAgLTk3LjI0LC00My41MiAtOTcuMjQsLTk3LjIzMSAwLC01My42OTkgNDMuNTQsLTk3LjIxOSA5Ny4yNCwtOTcuMjE5IDUzLjY5LDAgOTcuMjMsNDMuNTIgOTcuMjMsOTcuMjE5IDAsNTMuNzExIC00My41NCw5Ny4yMzEgLTk3LjIzLDk3LjIzMVwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMzAwXCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKCNjbGlwUGF0aDMwNilcIlxuICAgICAgICAgICBpZD1cImczMDJcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDMyMFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQzMTgpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lXCJcbiAgICAgICAgICAgICBkPVwibSA3NDAzLDc2My40NDkgYyAtNTYuMjIsMCAtMTAxLjc4LC00NS41NyAtMTAxLjc4LC0xMDEuNzg5IDAsLTU2LjIzIDQ1LjU2LC0xMDEuNzg5IDEwMS43OCwtMTAxLjc4OSA1Ni4yMywwIDEwMS43OSw0NS41NTkgMTAxLjc5LDEwMS43ODkgMCw1Ni4yMTkgLTQ1LjU2LDEwMS43ODkgLTEwMS43OSwxMDEuNzg5XCIgLz48L2c+PC9nPjxnXG4gICAgICAgICBpZD1cImczMjJcIj48Z1xuICAgICAgICAgICBjbGlwLXBhdGg9XCJ1cmwoI2NsaXBQYXRoMzI4KVwiXG4gICAgICAgICAgIGlkPVwiZzMyNFwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMzQyXCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDM0MCk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDc5NDcuMzQsNzY3Ljk2MSBjIC01OC43NCwwIC0xMDYuMzYsLTQ3LjYwOSAtMTA2LjM2LC0xMDYuMzUyIDAsLTU4LjczIDQ3LjYyLC0xMDYuMzQ3IDEwNi4zNiwtMTA2LjM0NyA1OC43NCwwIDEwNi4zNSw0Ny42MTcgMTA2LjM1LDEwNi4zNDcgMCw1OC43NDMgLTQ3LjYxLDEwNi4zNTIgLTEwNi4zNSwxMDYuMzUyXCIgLz48L2c+PC9nPjxnXG4gICAgICAgICBpZD1cImczNDRcIj48Z1xuICAgICAgICAgICBjbGlwLXBhdGg9XCJ1cmwoI2NsaXBQYXRoMzUwKVwiXG4gICAgICAgICAgIGlkPVwiZzM0NlwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMzY0XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDM2Mik7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDg0OTEuNjcsNzcyLjQ4IGMgLTYxLjI1LDAgLTExMC45MSwtNDkuNjYgLTExMC45MSwtMTEwLjkxIDAsLTYxLjI2MSA0OS42NiwtMTEwLjkyMiAxMTAuOTEsLTExMC45MjIgNjEuMjYsMCAxMTAuOTEsNDkuNjYxIDExMC45MSwxMTAuOTIyIDAsNjEuMjUgLTQ5LjY1LDExMC45MSAtMTEwLjkxLDExMC45MVwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMzY2XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKCNjbGlwUGF0aDM3MilcIlxuICAgICAgICAgICBpZD1cImczNjhcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDM4NlwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQzODQpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lXCJcbiAgICAgICAgICAgICBkPVwibSA5MDM2LDc3Ni45ODggYyAtNjMuNzcsMCAtMTE1LjQ3LC01MS42OTkgLTExNS40NywtMTE1LjQ2OCAwLC02My43ODIgNTEuNywtMTE1LjQ4MSAxMTUuNDcsLTExNS40ODEgNjMuNzcsMCAxMTUuNDcsNTEuNjk5IDExNS40NywxMTUuNDgxIDAsNjMuNzY5IC01MS43LDExNS40NjggLTExNS40NywxMTUuNDY4XCIgLz48L2c+PC9nPjxnXG4gICAgICAgICBpZD1cImczODhcIj48Z1xuICAgICAgICAgICBjbGlwLXBhdGg9XCJ1cmwoI2NsaXBQYXRoMzk0KVwiXG4gICAgICAgICAgIGlkPVwiZzM5MFwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMzk2XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6IzIzMWYyMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZVwiXG4gICAgICAgICAgICAgZD1cIm0gMzI1NC4wOSwxMDA4LjcyIGMgLTMwOC45LDAgLTUyMS41NywxMjkuOTcgLTUzNS4wOCw0MDYuNzkgMCwxMC4xMyA4LjQ0LDE4LjU3IDE4LjU3LDE4LjU3IGggMjMxLjI1IGMgMTAuMTIsMCAxOC41NiwtOC40NCAyMC4yNSwtMTguNTcgMTYuODgsLTEyOS45NyA3Ny42NSwtMjE0LjM2IDI3MC4wNywtMjE0LjM2IDE1My42LDAgMjM4LDQ1LjU2IDIzOCwxNTYuOTcgMCwyNjYuNjkgLTc1NC41MSw1NS43IC03NTQuNTEsNTI0Ljk1IDAsMjIxLjExIDE3Mi4xNywzNTkuNTIgNDc0LjMxLDM1OS41MiAyNzUuMTQsMCA0NjUuODcsLTEwNi4zNCA1MDMsLTM1Ni4xNSAwLC0xMC4xMyAtNi43NSwtMTguNTYgLTE2Ljg4LC0xOC41NiBoIC0yMzEuMjUgYyAtMTEuOCwwIC0yMC4yNSw2Ljc0IC0yMS45NCwxOC41NiAtMTUuMTksMTA0LjY2IC0xMDEuMjcsMTYyLjA0IC0yNDMuMDYsMTYyLjA0IC0xMjEuNTMsMCAtMjA5LjMsLTQyLjE5IC0yMDkuMywtMTQwLjEgMCwtMjUxLjUgNzU3Ljg4LC00Ny4yNSA3NTcuODgsLTUxNC44MSAwLC0yNDkuODIgLTE5Mi40MiwtMzg0Ljg1IC01MDEuMzEsLTM4NC44NVwiIC8+PHBhdGhcbiAgICAgICAgICAgICBpZD1cInBhdGgzOThcIlxuICAgICAgICAgICAgIHN0eWxlPVwiZmlsbDojMjMxZjIwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lXCJcbiAgICAgICAgICAgICBkPVwibSA0MzYzLjAzLDEwNzEuMTggYyAwLC0xMC4xMyAtOC40NCwtMjEuOTUgLTE2Ljg4LC0yNS4zMyAtNDguOTUsLTE1LjE5IC0xMDIuOTYsLTI3IC0xNTUuMjgsLTI3IC0xNDYuODYsMCAtMjg2Ljk2LDc0LjI3IC0yODYuOTYsMjcxLjc1IGwgMS42OSw0MzUuNDkgaCAtOTQuNTIgYyAtMTAuMTMsMCAtMTguNTcsOC40NCAtMTguNTcsMTguNTYgdiAxNDEuNzkgYyAwLDEwLjEzIDguNDQsMTguNTggMTguNTcsMTguNTggaCA5Mi44MyBsIC0xLjY5LDE5OS4xNiBjIDAsMTAuMTMgOC40NCwxOC41NyAxOC41OCwxOC41NyBoIDIxOS40MiBjIDEwLjEzLDAgMTguNTgsLTguNDQgMTguNTgsLTE4LjU3IGwgLTEuNjksLTE5OS4xNiBoIDE4OS4wNCBjIDEwLjEzLDAgMTguNTYsLTguNDUgMTguNTYsLTE4LjU4IHYgLTE0MS43OSBjIDAsLTEwLjEyIC04LjQzLC0xOC41NiAtMTguNTYsLTE4LjU2IGggLTE5MC43MyBsIDEuNjksLTQyOC43MyBjIDAsLTc0LjI3IDM3LjEzLC05Ny45IDkyLjgzLC05Ny45IDM4LjgzLDAgNjkuMjEsNi43NSA5NC41MiwxMy41IDEwLjEzLDEuNjggMTguNTcsLTUuMDYgMTguNTcsLTEzLjUgdiAtMTI4LjI4XCIgLz48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDQwMFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOiMyMzFmMjA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDQ4MzkuMDMsMTE4Mi41NyBjIDEyNC45LDAgMTgzLjk4LDg2LjA5IDE4My45OCwyODUuMjcgMCwxOTUuOCAtNjAuNzcsMjkwLjMyIC0xODUuNjcsMjkwLjMyIC0xMjguMjgsLTEuNjkgLTE4Ny4zNiwtOTYuMjEgLTE4Ny4zNiwtMjkyLjAxIDAsLTE5NS44IDYyLjQ2LC0yODMuNTggMTg5LjA1LC0yODMuNTggeiBtIDAsLTE2OC43OSBjIC0yODMuNTcsMCAtNDQ3LjMsMTc3LjI0IC00NDcuMyw0NTQuMDYgMCwyNzYuODEgMTYzLjczLDQ1OS4xMiA0NDcuMyw0NTkuMTIgMjgzLjU3LDAgNDQzLjkzLC0xNzcuMjQgNDQzLjkzLC00NTQuMDUgMCwtMjc2LjgzIC0xNjAuMzYsLTQ1OS4xMyAtNDQzLjkzLC00NTkuMTNcIiAvPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoNDAyXCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6IzIzMWYyMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZVwiXG4gICAgICAgICAgICAgZD1cIm0gNTc4NS45MywxMDEzLjc4IGMgLTI3OC41LDAgLTQ0My45MiwxNzcuMjQgLTQ0My45Miw0NTQuMDYgMCwyNzYuODEgMTY1LjQyLDQ1OS4xMiA0NDguOTksNDU5LjEyIDIyMi44MSwwIDM2Ni4yOCwtMTI0LjkxIDM4OC4yMywtMzEyLjI4IDEuNjgsLTEwLjEyIC02Ljc2LC0xOC41NiAtMTYuODksLTE4LjU2IGggLTE5Ny40OCBjIC0xMC4xNCwwIC0yMC4yNiw2Ljc2IC0yMS45NCwxOC41NiAtMTguNTgsOTQuNTMgLTgxLjAzLDE0MS43OSAtMTUxLjkyLDE0MS43OSAtMTI4LjI5LC0xLjY5IC0xODkuMDUsLTk0LjUyIC0xODkuMDUsLTI4Ni45NCAwLC0xOTkuMTggNjIuNDUsLTI4NS4yNyAxODkuMDUsLTI4Ni45NiA4NC40LC0xLjY4IDE0OC41NCw1Ny40IDE2MC4zNSwxNjguOCAxLjY5LDEwLjEzIDEwLjEzLDE4LjU3IDIwLjI2LDE4LjU3IGggMjAyLjU1IGMgMTAuMTIsMCAxOC41NiwtOC40NCAxNi44OCwtMTguNTcgLTIwLjI2LC0xOTUuOCAtMTc4LjkyLC0zMzcuNTkgLTQwNS4xMSwtMzM3LjU5XCIgLz48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDQwNFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOiMyMzFmMjA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmVcIlxuICAgICAgICAgICAgIGQ9XCJtIDY3MDkuMjIsMTczOS41OSBjIC04Mi43MSwwIC0xNzIuMTcsLTY1LjgyIC0xOTcuNDgsLTE5MC43NCBsIDYuNzQsLTQ5NC41NiBjIDAsLTEwLjEyIC04LjQzLC0xOC41NiAtMTguNTYsLTE4LjU2IGggLTIxNi4wNiBjIC0xMC4xMiwwIC0xOC41Nyw4LjQ0IC0xOC41NywxOC41NiBsIDguNDUsNTczLjkgLTguNDUsNTcwLjUyIGMgMCwxMC4xMiA4LjQ1LDE4LjU3IDE4LjU3LDE4LjU3IGggMjE2LjA2IGMgMTAuMTMsMCAxOC41NiwtOC40NSAxOC41NiwtMTguNTcgbCAtNS4wNywtMzkxLjYgYyA1OS4wOSw3OS4zMyAxNDguNTUsMTE4LjE2IDI2My4zMywxMTguMTYgMTk1LjgsMCAzMTUuNjQsLTExNi40OCAzMTAuNTcsLTM3MS4zNSBsIC0xLjY5LC0xODUuNjcgNi43NiwtMzEzLjk2IGMgMCwtMTAuMTIgLTguNDQsLTE4LjU2IC0xOC41NywtMTguNTYgSCA2ODUxIGMgLTEwLjEyLDAgLTE4LjU2LDguNDQgLTE4LjU2LDE4LjU2IGwgNi43NSwzMTAuNTkgLTEuNjksMjE5LjQyIGMgLTEuNjgsMTA0LjY2IC01OS4wOCwxNTUuMjkgLTEyOC4yOCwxNTUuMjlcIiAvPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoNDA2XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6IzIzMWYyMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZVwiXG4gICAgICAgICAgICAgZD1cIm0gNzY5MS41OCwxMDA4LjcyIGMgLTMwOC45LDAgLTUyMS41NywxMjkuOTcgLTUzNS4wOCw0MDYuNzkgMCwxMC4xMyA4LjQ0LDE4LjU3IDE4LjU3LDE4LjU3IGggMjMxLjI1IGMgMTAuMTIsMCAxOC41NiwtOC40NCAyMC4yNSwtMTguNTcgMTYuODgsLTEyOS45NyA3Ny42NSwtMjE0LjM2IDI3MC4wNywtMjE0LjM2IDE1My42LDAgMjM4LDQ1LjU2IDIzOCwxNTYuOTcgMCwyNjYuNjkgLTc1NC41MSw1NS43IC03NTQuNTEsNTI0Ljk1IDAsMjIxLjExIDE3Mi4xNywzNTkuNTIgNDc0LjMxLDM1OS41MiAyNzUuMTQsMCA0NjUuODcsLTEwNi4zNCA1MDMsLTM1Ni4xNSAwLC0xMC4xMyAtNi43NSwtMTguNTYgLTE2Ljg4LC0xOC41NiBoIC0yMzEuMjUgYyAtMTEuOCwwIC0yMC4yNSw2Ljc0IC0yMS45NCwxOC41NiAtMTUuMTksMTA0LjY2IC0xMDEuMjcsMTYyLjA0IC0yNDMuMDYsMTYyLjA0IC0xMjEuNTMsMCAtMjA5LjMsLTQyLjE5IC0yMDkuMywtMTQwLjEgMCwtMjUxLjUgNzU3Ljg4LC00Ny4yNSA3NTcuODgsLTUxNC44MSAwLC0yNDkuODIgLTE5Mi40MiwtMzg0Ljg1IC01MDEuMzEsLTM4NC44NVwiIC8+PHBhdGhcbiAgICAgICAgICAgICBpZD1cInBhdGg0MDhcIlxuICAgICAgICAgICAgIHN0eWxlPVwiZmlsbDojMjMxZjIwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lXCJcbiAgICAgICAgICAgICBkPVwibSA4NzY4LjQ1LDEwMDguNzIgYyAtMzA4Ljg5LDAgLTUyMS41NywxMjkuOTcgLTUzNS4wNyw0MDYuNzkgMCwxMC4xMyA4LjQzLDE4LjU3IDE4LjU2LDE4LjU3IGggMjMxLjI1IGMgMTAuMTMsMCAxOC41NiwtOC40NCAyMC4yNSwtMTguNTcgMTYuODksLTEyOS45NyA3Ny42NSwtMjE0LjM2IDI3MC4wNywtMjE0LjM2IDE1My42MSwwIDIzOCw0NS41NiAyMzgsMTU2Ljk3IDAsMjY2LjY5IC03NTQuNSw1NS43IC03NTQuNSw1MjQuOTUgMCwyMjEuMTEgMTcyLjE3LDM1OS41MiA0NzQuMzEsMzU5LjUyIDI3NS4xMywwIDQ2NS44NiwtMTA2LjM0IDUwMi45OSwtMzU2LjE1IDAsLTEwLjEzIC02Ljc0LC0xOC41NiAtMTYuODcsLTE4LjU2IGggLTIzMS4yNSBjIC0xMS44MSwwIC0yMC4yNiw2Ljc0IC0yMS45NSwxOC41NiAtMTUuMTgsMTA0LjY2IC0xMDEuMjYsMTYyLjA0IC0yNDMuMDUsMTYyLjA0IC0xMjEuNTMsMCAtMjA5LjMxLC00Mi4xOSAtMjA5LjMxLC0xNDAuMSAwLC0yNTEuNSA3NTcuODgsLTQ3LjI1IDc1Ny44OCwtNTE0LjgxIDAsLTI0OS44MiAtMTkyLjQyLC0zODQuODUgLTUwMS4zMSwtMzg0Ljg1XCIgLz48L2c+PC9nPjwvZz48L2c+PC9zdmc+YFxufVxuIiwibGV0ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbmxldCBQYWdlVmlldyA9IHJlcXVpcmUoJy4vYmFzZScpO1xubGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL3BhZ2VzL2hvbWUucHVnJyk7XG5sZXQgZ3JhcGhpY3MgPSByZXF1aXJlKCcuLi9ncmFwaGljcycpO1xuXG5pbXBvcnQgaW5pdFBhZ2UgZnJvbSAnLi9wYWdlLmpzJztcblxubGV0IEhvbWVQYWdlID0gUGFnZVZpZXcuZXh0ZW5kKHtcbiAgICBwYWdlVGl0bGU6ICdTdG9jaFNTIHwgSG9tZScsXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgUGFnZVZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgJCh0aGlzLnF1ZXJ5QnlIb29rKCdzdG9jaHNzLWxvZ28nKSkuaHRtbChncmFwaGljc1snbG9nbyddKVxuICAgIH1cbn0pO1xuXG5pbml0UGFnZShIb21lUGFnZSlcbiJdLCJzb3VyY2VSb290IjoiIn0=