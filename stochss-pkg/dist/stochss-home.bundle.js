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
     id="defs6">
       <clipPath id="clipPath20" clipPathUnits="userSpaceOnUse">
         <path
           id="path18"
           d="m 326.688,704.762 c -23.477,0 -42.5,-19.032 -42.5,-42.5 0,-23.481 19.023,-42.5 42.5,-42.5 23.464,0 42.488,19.019 42.488,42.5 0,23.468 -19.024,42.5 -42.488,42.5 z" />
       </clipPath>
       <linearGradient
         id="linearGradient32"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.45,684.72)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop22" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop24" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop26" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop28" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop30" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath42" clipPathUnits="userSpaceOnUse">
         <path
           id="path40"
           d="m 871.012,709.27 c -25.985,0 -47.059,-21.059 -47.059,-47.059 0,-25.981 21.074,-47.063 47.059,-47.063 25.988,0 47.062,21.082 47.062,47.063 0,26 -21.074,47.059 -47.062,47.059 z" />
       </clipPath>
       <linearGradient
         id="linearGradient54"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.55,677.1)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop44" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop46" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop48" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop50" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop52" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath64" clipPathUnits="userSpaceOnUse">
         <path
           id="path62"
           d="m 1415.35,713.789 c -28.51,0 -51.62,-23.109 -51.62,-51.617 0,-28.512 23.11,-51.621 51.62,-51.621 28.5,0 51.62,23.109 51.62,51.621 0,28.508 -23.12,51.617 -51.62,51.617 z" />
       </clipPath>
       <linearGradient
         id="linearGradient76"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.66,669.49)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop66" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop68" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop70" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop72" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop74" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath86" clipPathUnits="userSpaceOnUse">
         <path
           id="path84"
           d="m 1959.67,718.309 c -31.02,0 -56.17,-25.161 -56.17,-56.188 0,-31.019 25.15,-56.18 56.17,-56.18 31.04,0 56.2,25.161 56.2,56.18 0,31.027 -25.16,56.188 -56.2,56.188 z" />
       </clipPath>
       <linearGradient
         id="linearGradient98"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.76,661.87)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop88" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop90" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop92" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop94" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop96" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath108" clipPathUnits="userSpaceOnUse">
         <path
           id="path106"
           d="m 2504.01,719.199 c -31.5,0 -57.13,-25.617 -57.13,-57.121 0,-31.508 25.63,-57.137 57.13,-57.137 31.5,0 57.13,25.629 57.13,57.137 0,31.504 -25.63,57.121 -57.13,57.121 z" />
       </clipPath>
       <linearGradient
         id="linearGradient120"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.87,654.26)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop110" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop112" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop114" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop116" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop118" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath130" clipPathUnits="userSpaceOnUse">
         <path
           id="path128"
           d="m 3048.35,727.332 c -36.08,0 -65.31,-29.242 -65.31,-65.301 0,-36.07 29.23,-65.312 65.31,-65.312 36.06,0 65.3,29.242 65.3,65.312 0,36.059 -29.24,65.301 -65.3,65.301 z" />
       </clipPath>
       <linearGradient
         id="linearGradient142"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1941.98,646.64)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop132" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop134" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop136" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop138" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop140" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath152" clipPathUnits="userSpaceOnUse">
         <path
           id="path150"
           d="m 3592.68,728.238 c -36.54,0 -66.26,-29.726 -66.26,-66.258 0,-36.539 29.72,-66.25 66.26,-66.25 36.53,0 66.25,29.711 66.25,66.25 0,36.532 -29.72,66.258 -66.25,66.258 z" />
       </clipPath>
       <linearGradient
         id="linearGradient164"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.08,639.03)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop154" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop156" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop158" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop160" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop162" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath174" clipPathUnits="userSpaceOnUse">
         <path
           id="path172"
           d="m 4137.01,736.359 c -41.1,0 -74.43,-33.32 -74.43,-74.418 0,-41.101 33.33,-74.429 74.43,-74.429 41.1,0 74.42,33.328 74.42,74.429 0,41.098 -33.32,74.418 -74.42,74.418 z" />
       </clipPath>
       <linearGradient
         id="linearGradient186"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.19,631.42)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop176" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop178" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop180" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop182" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop184" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath196" clipPathUnits="userSpaceOnUse">
         <path
           id="path194"
           d="m 4681.34,740.871 c -43.62,0 -78.99,-35.359 -78.99,-78.98 0,-43.621 35.37,-78.981 78.99,-78.981 43.63,0 78.99,35.36 78.99,78.981 0,43.621 -35.36,78.98 -78.99,78.98 z" />
       </clipPath>
       <linearGradient
         id="linearGradient208"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.29,623.8)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop198" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop200" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop202" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop204" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop206" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath218" clipPathUnits="userSpaceOnUse">
         <path
           id="path216"
           d="m 5225.67,745.391 c -46.13,0 -83.54,-37.411 -83.54,-83.551 0,-46.141 37.41,-83.539 83.54,-83.539 46.15,0 83.56,37.398 83.56,83.539 0,46.14 -37.41,83.551 -83.56,83.551 z" />
       </clipPath>
       <linearGradient
         id="linearGradient230"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.4,616.18)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop220" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop222" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop224" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop226" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop228" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath240" clipPathUnits="userSpaceOnUse">
         <path
           id="path238"
           d="m 5770.01,749.91 c -48.67,0 -88.11,-39.461 -88.11,-88.121 0,-48.648 39.44,-88.098 88.11,-88.098 48.66,0 88.1,39.45 88.1,88.098 0,48.66 -39.44,88.121 -88.1,88.121 z" />
       </clipPath>
       <linearGradient
         id="linearGradient252"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.5,608.57)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop242" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop244" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop246" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop248" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop250" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath262" clipPathUnits="userSpaceOnUse">
         <path
           id="path260"
           d="m 6314.34,754.422 c -51.18,0 -92.67,-41.492 -92.67,-92.672 0,-51.18 41.49,-92.672 92.67,-92.672 51.17,0 92.67,41.492 92.67,92.672 0,51.18 -41.5,92.672 -92.67,92.672 z" />
       </clipPath>
       <linearGradient
         id="linearGradient274"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.61,600.96)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop264" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop266" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop268" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop270" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop272" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath284" clipPathUnits="userSpaceOnUse">
         <path
           id="path282"
           d="m 6858.68,758.93 c -53.7,0 -97.24,-43.52 -97.24,-97.231 0,-53.699 43.54,-97.219 97.24,-97.219 53.69,0 97.23,43.52 97.23,97.219 0,53.711 -43.54,97.231 -97.23,97.231 z" />
       </clipPath>
       <linearGradient
         id="linearGradient296"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.72,593.34)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop286" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop288" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop290" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop292" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop294" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath306" clipPathUnits="userSpaceOnUse">
         <path
           id="path304"
           d="m 7403,763.449 c -56.22,0 -101.78,-45.57 -101.78,-101.789 0,-56.23 45.56,-101.789 101.78,-101.789 56.23,0 101.79,45.559 101.79,101.789 0,56.219 -45.56,101.789 -101.79,101.789 z" />
       </clipPath>
       <linearGradient
         id="linearGradient318"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.82,585.73)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop308" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop310" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop312" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop314" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop316" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath328" clipPathUnits="userSpaceOnUse">
         <path
           id="path326"
           d="m 7947.34,767.961 c -58.74,0 -106.36,-47.609 -106.36,-106.352 0,-58.73 47.62,-106.347 106.36,-106.347 58.74,0 106.35,47.617 106.35,106.347 0,58.743 -47.61,106.352 -106.35,106.352 z" />
       </clipPath>
       <linearGradient
         id="linearGradient340"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1942.93,578.11)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop330" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop332" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop334" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop336" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop338" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath350" clipPathUnits="userSpaceOnUse">
         <path
           id="path348"
           d="m 8491.67,772.48 c -61.25,0 -110.91,-49.66 -110.91,-110.91 0,-61.261 49.66,-110.922 110.91,-110.922 61.26,0 110.91,49.661 110.91,110.922 0,61.25 -49.65,110.91 -110.91,110.91 z" />
       </clipPath>
       <linearGradient
         id="linearGradient362"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1943.03,570.5)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop352" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop354" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop356" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop358" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop360" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath372" clipPathUnits="userSpaceOnUse">
         <path
           id="path370"
           d="m 9036,776.988 c -63.77,0 -115.47,-51.699 -115.47,-115.468 0,-63.782 51.7,-115.481 115.47,-115.481 63.77,0 115.47,51.699 115.47,115.481 0,63.769 -51.7,115.468 -115.47,115.468 z" />
       </clipPath>
       <linearGradient
         id="linearGradient384"
         spreadMethod="pad"
         gradientTransform="matrix(7837.42,108.991,108.991,-7837.42,1943.14,562.88)"
         gradientUnits="userSpaceOnUse"
         y2="0"
         x2="1"
         y1="0"
         x1="0">
           <stop id="stop374" offset="0" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop376" offset="0.00198009" stop-opacity="1" stop-color="#00adef"/>
           <stop id="stop378" offset="0.44344" stop-opacity="1" stop-color="#8d198f"/>
           <stop id="stop380" offset="0.99856" stop-opacity="1" stop-color="#340e3d"/>
           <stop id="stop382" offset="1" stop-opacity="1" stop-color="#340e3d"/>
       </linearGradient>
       <clipPath id="clipPath394" clipPathUnits="userSpaceOnUse">
         <path
           id="path392"
           d="M 0,0 H 9538 V 2615.77 H 0 Z" />
       </clipPath></defs><g
     transform="matrix(1.3333333,0,0,-1.3333333,0,348.77333)"
     id="g10"><g
       transform="scale(0.1)"
       id="g12"><g
         id="g14"><g
           clip-path="url(/stochss#clipPath20)"
           id="g16"><path
             id="path34"
             style="fill:url(/stochss#linearGradient32);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 326.688,704.762 c -23.477,0 -42.5,-19.032 -42.5,-42.5 0,-23.481 19.023,-42.5 42.5,-42.5 23.464,0 42.488,19.019 42.488,42.5 0,23.468 -19.024,42.5 -42.488,42.5" /></g></g><g
         id="g36"><g
           clip-path="url(/stochss#clipPath42)"
           id="g38"><path
             id="path56"
             style="fill:url(/stochss#linearGradient54);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 871.012,709.27 c -25.985,0 -47.059,-21.059 -47.059,-47.059 0,-25.981 21.074,-47.063 47.059,-47.063 25.988,0 47.062,21.082 47.062,47.063 0,26 -21.074,47.059 -47.062,47.059" /></g></g><g
         id="g58"><g
           clip-path="url(/stochss#clipPath64)"
           id="g60"><path
             id="path78"
             style="fill:url(/stochss#linearGradient76);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 1415.35,713.789 c -28.51,0 -51.62,-23.109 -51.62,-51.617 0,-28.512 23.11,-51.621 51.62,-51.621 28.5,0 51.62,23.109 51.62,51.621 0,28.508 -23.12,51.617 -51.62,51.617" /></g></g><g
         id="g80"><g
           clip-path="url(/stochss#clipPath86)"
           id="g82"><path
             id="path100"
             style="fill:url(/stochss#linearGradient98);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 1959.67,718.309 c -31.02,0 -56.17,-25.161 -56.17,-56.188 0,-31.019 25.15,-56.18 56.17,-56.18 31.04,0 56.2,25.161 56.2,56.18 0,31.027 -25.16,56.188 -56.2,56.188" /></g></g><g
         id="g102"><g
           clip-path="url(/stochss#clipPath108)"
           id="g104"><path
             id="path122"
             style="fill:url(/stochss#linearGradient120);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 2504.01,719.199 c -31.5,0 -57.13,-25.617 -57.13,-57.121 0,-31.508 25.63,-57.137 57.13,-57.137 31.5,0 57.13,25.629 57.13,57.137 0,31.504 -25.63,57.121 -57.13,57.121" /></g></g><g
         id="g124"><g
           clip-path="url(/stochss#clipPath130)"
           id="g126"><path
             id="path144"
             style="fill:url(/stochss#linearGradient142);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 3048.35,727.332 c -36.08,0 -65.31,-29.242 -65.31,-65.301 0,-36.07 29.23,-65.312 65.31,-65.312 36.06,0 65.3,29.242 65.3,65.312 0,36.059 -29.24,65.301 -65.3,65.301" /></g></g><g
         id="g146"><g
           clip-path="url(/stochss#clipPath152)"
           id="g148"><path
             id="path166"
             style="fill:url(/stochss#linearGradient164);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 3592.68,728.238 c -36.54,0 -66.26,-29.726 -66.26,-66.258 0,-36.539 29.72,-66.25 66.26,-66.25 36.53,0 66.25,29.711 66.25,66.25 0,36.532 -29.72,66.258 -66.25,66.258" /></g></g><g
         id="g168"><g
           clip-path="url(/stochss#clipPath174)"
           id="g170"><path
             id="path188"
             style="fill:url(/stochss#linearGradient186);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 4137.01,736.359 c -41.1,0 -74.43,-33.32 -74.43,-74.418 0,-41.101 33.33,-74.429 74.43,-74.429 41.1,0 74.42,33.328 74.42,74.429 0,41.098 -33.32,74.418 -74.42,74.418" /></g></g><g
         id="g190"><g
           clip-path="url(/stochss#clipPath196)"
           id="g192"><path
             id="path210"
             style="fill:url(/stochss#linearGradient208);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 4681.34,740.871 c -43.62,0 -78.99,-35.359 -78.99,-78.98 0,-43.621 35.37,-78.981 78.99,-78.981 43.63,0 78.99,35.36 78.99,78.981 0,43.621 -35.36,78.98 -78.99,78.98" /></g></g><g
         id="g212"><g
           clip-path="url(/stochss#clipPath218)"
           id="g214"><path
             id="path232"
             style="fill:url(/stochss#linearGradient230);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 5225.67,745.391 c -46.13,0 -83.54,-37.411 -83.54,-83.551 0,-46.141 37.41,-83.539 83.54,-83.539 46.15,0 83.56,37.398 83.56,83.539 0,46.14 -37.41,83.551 -83.56,83.551" /></g></g><g
         id="g234"><g
           clip-path="url(/stochss#clipPath240)"
           id="g236"><path
             id="path254"
             style="fill:url(/stochss#linearGradient252);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 5770.01,749.91 c -48.67,0 -88.11,-39.461 -88.11,-88.121 0,-48.648 39.44,-88.098 88.11,-88.098 48.66,0 88.1,39.45 88.1,88.098 0,48.66 -39.44,88.121 -88.1,88.121" /></g></g><g
         id="g256"><g
           clip-path="url(/stochss#clipPath262)"
           id="g258"><path
             id="path276"
             style="fill:url(/stochss#linearGradient274);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 6314.34,754.422 c -51.18,0 -92.67,-41.492 -92.67,-92.672 0,-51.18 41.49,-92.672 92.67,-92.672 51.17,0 92.67,41.492 92.67,92.672 0,51.18 -41.5,92.672 -92.67,92.672" /></g></g><g
         id="g278"><g
           clip-path="url(/stochss#clipPath284)"
           id="g280"><path
             id="path298"
             style="fill:url(/stochss#linearGradient296);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 6858.68,758.93 c -53.7,0 -97.24,-43.52 -97.24,-97.231 0,-53.699 43.54,-97.219 97.24,-97.219 53.69,0 97.23,43.52 97.23,97.219 0,53.711 -43.54,97.231 -97.23,97.231" /></g></g><g
         id="g300"><g
           clip-path="url(/stochss#clipPath306)"
           id="g302"><path
             id="path320"
             style="fill:url(/stochss#linearGradient318);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 7403,763.449 c -56.22,0 -101.78,-45.57 -101.78,-101.789 0,-56.23 45.56,-101.789 101.78,-101.789 56.23,0 101.79,45.559 101.79,101.789 0,56.219 -45.56,101.789 -101.79,101.789" /></g></g><g
         id="g322"><g
           clip-path="url(/stochss#clipPath328)"
           id="g324"><path
             id="path342"
             style="fill:url(/stochss#linearGradient340);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 7947.34,767.961 c -58.74,0 -106.36,-47.609 -106.36,-106.352 0,-58.73 47.62,-106.347 106.36,-106.347 58.74,0 106.35,47.617 106.35,106.347 0,58.743 -47.61,106.352 -106.35,106.352" /></g></g><g
         id="g344"><g
           clip-path="url(/stochss#clipPath350)"
           id="g346"><path
             id="path364"
             style="fill:url(/stochss#linearGradient362);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 8491.67,772.48 c -61.25,0 -110.91,-49.66 -110.91,-110.91 0,-61.261 49.66,-110.922 110.91,-110.922 61.26,0 110.91,49.661 110.91,110.922 0,61.25 -49.65,110.91 -110.91,110.91" /></g></g><g
         id="g366"><g
           clip-path="url(/stochss#clipPath372)"
           id="g368"><path
             id="path386"
             style="fill:url(/stochss#linearGradient384);fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 9036,776.988 c -63.77,0 -115.47,-51.699 -115.47,-115.468 0,-63.782 51.7,-115.481 115.47,-115.481 63.77,0 115.47,51.699 115.47,115.481 0,63.769 -51.7,115.468 -115.47,115.468" /></g></g><g
         id="g388"><g
           clip-path="url(/stochss#clipPath394)"
           id="g390"><path
             id="path396"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 3254.09,1008.72 c -308.9,0 -521.57,129.97 -535.08,406.79 0,10.13 8.44,18.57 18.57,18.57 h 231.25 c 10.12,0 18.56,-8.44 20.25,-18.57 16.88,-129.97 77.65,-214.36 270.07,-214.36 153.6,0 238,45.56 238,156.97 0,266.69 -754.51,55.7 -754.51,524.95 0,221.11 172.17,359.52 474.31,359.52 275.14,0 465.87,-106.34 503,-356.15 0,-10.13 -6.75,-18.56 -16.88,-18.56 h -231.25 c -11.8,0 -20.25,6.74 -21.94,18.56 -15.19,104.66 -101.27,162.04 -243.06,162.04 -121.53,0 -209.3,-42.19 -209.3,-140.1 0,-251.5 757.88,-47.25 757.88,-514.81 0,-249.82 -192.42,-384.85 -501.31,-384.85" /><path
             id="path398"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 4363.03,1071.18 c 0,-10.13 -8.44,-21.95 -16.88,-25.33 -48.95,-15.19 -102.96,-27 -155.28,-27 -146.86,0 -286.96,74.27 -286.96,271.75 l 1.69,435.49 h -94.52 c -10.13,0 -18.57,8.44 -18.57,18.56 v 141.79 c 0,10.13 8.44,18.58 18.57,18.58 h 92.83 l -1.69,199.16 c 0,10.13 8.44,18.57 18.58,18.57 h 219.42 c 10.13,0 18.58,-8.44 18.58,-18.57 l -1.69,-199.16 h 189.04 c 10.13,0 18.56,-8.45 18.56,-18.58 v -141.79 c 0,-10.12 -8.43,-18.56 -18.56,-18.56 h -190.73 l 1.69,-428.73 c 0,-74.27 37.13,-97.9 92.83,-97.9 38.83,0 69.21,6.75 94.52,13.5 10.13,1.68 18.57,-5.06 18.57,-13.5 v -128.28" /><path
             id="path400"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 4839.03,1182.57 c 124.9,0 183.98,86.09 183.98,285.27 0,195.8 -60.77,290.32 -185.67,290.32 -128.28,-1.69 -187.36,-96.21 -187.36,-292.01 0,-195.8 62.46,-283.58 189.05,-283.58 z m 0,-168.79 c -283.57,0 -447.3,177.24 -447.3,454.06 0,276.81 163.73,459.12 447.3,459.12 283.57,0 443.93,-177.24 443.93,-454.05 0,-276.83 -160.36,-459.13 -443.93,-459.13" /><path
             id="path402"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 5785.93,1013.78 c -278.5,0 -443.92,177.24 -443.92,454.06 0,276.81 165.42,459.12 448.99,459.12 222.81,0 366.28,-124.91 388.23,-312.28 1.68,-10.12 -6.76,-18.56 -16.89,-18.56 h -197.48 c -10.14,0 -20.26,6.76 -21.94,18.56 -18.58,94.53 -81.03,141.79 -151.92,141.79 -128.29,-1.69 -189.05,-94.52 -189.05,-286.94 0,-199.18 62.45,-285.27 189.05,-286.96 84.4,-1.68 148.54,57.4 160.35,168.8 1.69,10.13 10.13,18.57 20.26,18.57 h 202.55 c 10.12,0 18.56,-8.44 16.88,-18.57 -20.26,-195.8 -178.92,-337.59 -405.11,-337.59" /><path
             id="path404"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 6709.22,1739.59 c -82.71,0 -172.17,-65.82 -197.48,-190.74 l 6.74,-494.56 c 0,-10.12 -8.43,-18.56 -18.56,-18.56 h -216.06 c -10.12,0 -18.57,8.44 -18.57,18.56 l 8.45,573.9 -8.45,570.52 c 0,10.12 8.45,18.57 18.57,18.57 h 216.06 c 10.13,0 18.56,-8.45 18.56,-18.57 l -5.07,-391.6 c 59.09,79.33 148.55,118.16 263.33,118.16 195.8,0 315.64,-116.48 310.57,-371.35 l -1.69,-185.67 6.76,-313.96 c 0,-10.12 -8.44,-18.56 -18.57,-18.56 H 6851 c -10.12,0 -18.56,8.44 -18.56,18.56 l 6.75,310.59 -1.69,219.42 c -1.68,104.66 -59.08,155.29 -128.28,155.29" /><path
             id="path406"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none;"
             d="m 7691.58,1008.72 c -308.9,0 -521.57,129.97 -535.08,406.79 0,10.13 8.44,18.57 18.57,18.57 h 231.25 c 10.12,0 18.56,-8.44 20.25,-18.57 16.88,-129.97 77.65,-214.36 270.07,-214.36 153.6,0 238,45.56 238,156.97 0,266.69 -754.51,55.7 -754.51,524.95 0,221.11 172.17,359.52 474.31,359.52 275.14,0 465.87,-106.34 503,-356.15 0,-10.13 -6.75,-18.56 -16.88,-18.56 h -231.25 c -11.8,0 -20.25,6.74 -21.94,18.56 -15.19,104.66 -101.27,162.04 -243.06,162.04 -121.53,0 -209.3,-42.19 -209.3,-140.1 0,-251.5 757.88,-47.25 757.88,-514.81 0,-249.82 -192.42,-384.85 -501.31,-384.85" /><path
             id="path408"
             style="fill:#231f20;fill-opacity:1;fill-rule:nonzero;stroke:none;"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2dyYXBoaWNzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC9wYWdlcy9ob21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRLG9CQUFvQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBLDBCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUJBQXVCO0FBQ3ZDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCxlQUFlLGtCQUFrQixZQUFZO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsZUFBZSxrQkFBa0IsWUFBWTtBQUNyRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELGVBQWUsa0JBQWtCLFlBQVk7QUFDckc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCxlQUFlLGtCQUFrQixZQUFZO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsZUFBZSxrQkFBa0IsWUFBWTtBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELGVBQWUsa0JBQWtCLFlBQVk7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxlQUFlLGtCQUFrQixZQUFZO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsZUFBZSxrQkFBa0IsWUFBWTtBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELGVBQWUsa0JBQWtCLFlBQVk7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxlQUFlLGtCQUFrQixZQUFZO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsZUFBZSxrQkFBa0IsWUFBWTtBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELGVBQWUsa0JBQWtCLFlBQVk7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxlQUFlLGtCQUFrQixZQUFZO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsZUFBZSxrQkFBa0IsWUFBWTtBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELGVBQWUsa0JBQWtCLFlBQVk7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxlQUFlLGtCQUFrQixZQUFZO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsZUFBZSxrQkFBa0IsWUFBWTtBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGVBQWUsa0JBQWtCLFlBQVk7QUFDOUU7QUFDQTtBQUNBLGlDQUFpQyxlQUFlLGtCQUFrQixZQUFZO0FBQzlFO0FBQ0E7QUFDQSxpQ0FBaUMsZUFBZSxrQkFBa0IsWUFBWTtBQUM5RTtBQUNBO0FBQ0EsaUNBQWlDLGVBQWUsa0JBQWtCLFlBQVk7QUFDOUU7QUFDQTtBQUNBLGlDQUFpQyxlQUFlLGtCQUFrQixZQUFZO0FBQzlFO0FBQ0E7QUFDQSxpQ0FBaUMsZUFBZSxrQkFBa0IsWUFBWTtBQUM5RTtBQUNBO0FBQ0EsaUNBQWlDLGVBQWUsa0JBQWtCLFlBQVk7QUFDOUU7QUFDQTs7Ozs7Ozs7Ozs7OztBQzllQTtBQUFBO0FBQUEsUUFBUSxtQkFBTyxDQUFDLG9EQUFRO0FBQ3hCLGVBQWUsbUJBQU8sQ0FBQyxzQ0FBUTtBQUMvQixlQUFlLG1CQUFPLENBQUMsc0VBQTZCO0FBQ3BELGVBQWUsbUJBQU8sQ0FBQyx5Q0FBYTs7QUFFSDs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVELHdEQUFRIiwiZmlsZSI6InN0b2Noc3MtaG9tZS5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbiBcdGZ1bmN0aW9uIHdlYnBhY2tKc29ucENhbGxiYWNrKGRhdGEpIHtcbiBcdFx0dmFyIGNodW5rSWRzID0gZGF0YVswXTtcbiBcdFx0dmFyIG1vcmVNb2R1bGVzID0gZGF0YVsxXTtcbiBcdFx0dmFyIGV4ZWN1dGVNb2R1bGVzID0gZGF0YVsyXTtcblxuIFx0XHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcbiBcdFx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG4gXHRcdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIHJlc29sdmVzID0gW107XG4gXHRcdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuIFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuIFx0XHRcdFx0cmVzb2x2ZXMucHVzaChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0pO1xuIFx0XHRcdH1cbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuIFx0XHR9XG4gXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYocGFyZW50SnNvbnBGdW5jdGlvbikgcGFyZW50SnNvbnBGdW5jdGlvbihkYXRhKTtcblxuIFx0XHR3aGlsZShyZXNvbHZlcy5sZW5ndGgpIHtcbiBcdFx0XHRyZXNvbHZlcy5zaGlmdCgpKCk7XG4gXHRcdH1cblxuIFx0XHQvLyBhZGQgZW50cnkgbW9kdWxlcyBmcm9tIGxvYWRlZCBjaHVuayB0byBkZWZlcnJlZCBsaXN0XG4gXHRcdGRlZmVycmVkTW9kdWxlcy5wdXNoLmFwcGx5KGRlZmVycmVkTW9kdWxlcywgZXhlY3V0ZU1vZHVsZXMgfHwgW10pO1xuXG4gXHRcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gYWxsIGNodW5rcyByZWFkeVxuIFx0XHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiBcdH07XG4gXHRmdW5jdGlvbiBjaGVja0RlZmVycmVkTW9kdWxlcygpIHtcbiBcdFx0dmFyIHJlc3VsdDtcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlZmVycmVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBkZWZlcnJlZE1vZHVsZSA9IGRlZmVycmVkTW9kdWxlc1tpXTtcbiBcdFx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcbiBcdFx0XHRmb3IodmFyIGogPSAxOyBqIDwgZGVmZXJyZWRNb2R1bGUubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBkZXBJZCA9IGRlZmVycmVkTW9kdWxlW2pdO1xuIFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2RlcElkXSAhPT0gMCkgZnVsZmlsbGVkID0gZmFsc2U7XG4gXHRcdFx0fVxuIFx0XHRcdGlmKGZ1bGZpbGxlZCkge1xuIFx0XHRcdFx0ZGVmZXJyZWRNb2R1bGVzLnNwbGljZShpLS0sIDEpO1xuIFx0XHRcdFx0cmVzdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBkZWZlcnJlZE1vZHVsZVswXSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0cmV0dXJuIHJlc3VsdDtcbiBcdH1cblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3NcbiBcdC8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuIFx0Ly8gUHJvbWlzZSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdFwiaG9tZVwiOiAwXG4gXHR9O1xuXG4gXHR2YXIgZGVmZXJyZWRNb2R1bGVzID0gW107XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdHZhciBqc29ucEFycmF5ID0gd2luZG93W1wid2VicGFja0pzb25wXCJdID0gd2luZG93W1wid2VicGFja0pzb25wXCJdIHx8IFtdO1xuIFx0dmFyIG9sZEpzb25wRnVuY3Rpb24gPSBqc29ucEFycmF5LnB1c2guYmluZChqc29ucEFycmF5KTtcbiBcdGpzb25wQXJyYXkucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrO1xuIFx0anNvbnBBcnJheSA9IGpzb25wQXJyYXkuc2xpY2UoKTtcbiBcdGZvcih2YXIgaSA9IDA7IGkgPCBqc29ucEFycmF5Lmxlbmd0aDsgaSsrKSB3ZWJwYWNrSnNvbnBDYWxsYmFjayhqc29ucEFycmF5W2ldKTtcbiBcdHZhciBwYXJlbnRKc29ucEZ1bmN0aW9uID0gb2xkSnNvbnBGdW5jdGlvbjtcblxuXG4gXHQvLyBhZGQgZW50cnkgbW9kdWxlIHRvIGRlZmVycmVkIGxpc3RcbiBcdGRlZmVycmVkTW9kdWxlcy5wdXNoKFtcIi4vY2xpZW50L3BhZ2VzL2hvbWUuanNcIixcImNvbW1vblwiXSk7XG4gXHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIHJlYWR5XG4gXHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBsb2dvOlxuYDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxuPHN2Z1xuICAgeG1sbnM6ZGM9XCJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xL1wiXG4gICB4bWxuczpjYz1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zI1wiXG4gICB4bWxuczpyZGY9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjXCJcbiAgIHhtbG5zOnN2Zz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgdmlld0JveD1cIjAgMCAxMjcxLjc3MzMgMzQ4Ljc3MzMyXCJcbiAgIGhlaWdodD1cIjM0OC43NzMzMlwiXG4gICB3aWR0aD1cIjEyNzEuNzczM1wiXG4gICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiXG4gICBpZD1cInN2ZzJcIlxuICAgdmVyc2lvbj1cIjEuMVwiPjxtZXRhZGF0YVxuICAgICBpZD1cIm1ldGFkYXRhOFwiPjxyZGY6UkRGPjxjYzpXb3JrXG4gICAgICAgICByZGY6YWJvdXQ9XCJcIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZVxuICAgICAgICAgICByZGY6cmVzb3VyY2U9XCJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZVwiIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzXG4gICAgIGlkPVwiZGVmczZcIj5cbiAgICAgICA8Y2xpcFBhdGggaWQ9XCJjbGlwUGF0aDIwXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGgxOFwiXG4gICAgICAgICAgIGQ9XCJtIDMyNi42ODgsNzA0Ljc2MiBjIC0yMy40NzcsMCAtNDIuNSwtMTkuMDMyIC00Mi41LC00Mi41IDAsLTIzLjQ4MSAxOS4wMjMsLTQyLjUgNDIuNSwtNDIuNSAyMy40NjQsMCA0Mi40ODgsMTkuMDE5IDQyLjQ4OCw0Mi41IDAsMjMuNDY4IC0xOS4wMjQsNDIuNSAtNDIuNDg4LDQyLjUgelwiIC8+XG4gICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICA8bGluZWFyR3JhZGllbnRcbiAgICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQzMlwiXG4gICAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0MS40NSw2ODQuNzIpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjJcIiBvZmZzZXQ9XCIwXCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMDBhZGVmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AyNFwiIG9mZnNldD1cIjAuMDAxOTgwMDlcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI2XCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjhcIiBvZmZzZXQ9XCIwLjk5ODU2XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMzQwZTNkXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AzMFwiIG9mZnNldD1cIjFcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgPC9saW5lYXJHcmFkaWVudD5cbiAgICAgICA8Y2xpcFBhdGggaWQ9XCJjbGlwUGF0aDQyXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGg0MFwiXG4gICAgICAgICAgIGQ9XCJtIDg3MS4wMTIsNzA5LjI3IGMgLTI1Ljk4NSwwIC00Ny4wNTksLTIxLjA1OSAtNDcuMDU5LC00Ny4wNTkgMCwtMjUuOTgxIDIxLjA3NCwtNDcuMDYzIDQ3LjA1OSwtNDcuMDYzIDI1Ljk4OCwwIDQ3LjA2MiwyMS4wODIgNDcuMDYyLDQ3LjA2MyAwLDI2IC0yMS4wNzQsNDcuMDU5IC00Ny4wNjIsNDcuMDU5IHpcIiAvPlxuICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgPGxpbmVhckdyYWRpZW50XG4gICAgICAgICBpZD1cImxpbmVhckdyYWRpZW50NTRcIlxuICAgICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDEuNTUsNjc3LjEpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wNDRcIiBvZmZzZXQ9XCIwXCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMDBhZGVmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3A0NlwiIG9mZnNldD1cIjAuMDAxOTgwMDlcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDQ4XCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wNTBcIiBvZmZzZXQ9XCIwLjk5ODU2XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMzQwZTNkXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3A1MlwiIG9mZnNldD1cIjFcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgPC9saW5lYXJHcmFkaWVudD5cbiAgICAgICA8Y2xpcFBhdGggaWQ9XCJjbGlwUGF0aDY0XCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGg2MlwiXG4gICAgICAgICAgIGQ9XCJtIDE0MTUuMzUsNzEzLjc4OSBjIC0yOC41MSwwIC01MS42MiwtMjMuMTA5IC01MS42MiwtNTEuNjE3IDAsLTI4LjUxMiAyMy4xMSwtNTEuNjIxIDUxLjYyLC01MS42MjEgMjguNSwwIDUxLjYyLDIzLjEwOSA1MS42Miw1MS42MjEgMCwyOC41MDggLTIzLjEyLDUxLjYxNyAtNTEuNjIsNTEuNjE3IHpcIiAvPlxuICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgPGxpbmVhckdyYWRpZW50XG4gICAgICAgICBpZD1cImxpbmVhckdyYWRpZW50NzZcIlxuICAgICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDEuNjYsNjY5LjQ5KVwiXG4gICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgeTI9XCIwXCJcbiAgICAgICAgIHgyPVwiMVwiXG4gICAgICAgICB5MT1cIjBcIlxuICAgICAgICAgeDE9XCIwXCI+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDY2XCIgb2Zmc2V0PVwiMFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wNjhcIiBvZmZzZXQ9XCIwLjAwMTk4MDA5XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMDBhZGVmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3A3MFwiIG9mZnNldD1cIjAuNDQzNDRcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiM4ZDE5OGZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDcyXCIgb2Zmc2V0PVwiMC45OTg1NlwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wNzRcIiBvZmZzZXQ9XCIxXCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMzQwZTNkXCIvPlxuICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gICAgICAgPGNsaXBQYXRoIGlkPVwiY2xpcFBhdGg4NlwiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgaWQ9XCJwYXRoODRcIlxuICAgICAgICAgICBkPVwibSAxOTU5LjY3LDcxOC4zMDkgYyAtMzEuMDIsMCAtNTYuMTcsLTI1LjE2MSAtNTYuMTcsLTU2LjE4OCAwLC0zMS4wMTkgMjUuMTUsLTU2LjE4IDU2LjE3LC01Ni4xOCAzMS4wNCwwIDU2LjIsMjUuMTYxIDU2LjIsNTYuMTggMCwzMS4wMjcgLTI1LjE2LDU2LjE4OCAtNTYuMiw1Ni4xODggelwiIC8+XG4gICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICA8bGluZWFyR3JhZGllbnRcbiAgICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQ5OFwiXG4gICAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0MS43Niw2NjEuODcpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wODhcIiBvZmZzZXQ9XCIwXCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMDBhZGVmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3A5MFwiIG9mZnNldD1cIjAuMDAxOTgwMDlcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDkyXCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wOTRcIiBvZmZzZXQ9XCIwLjk5ODU2XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMzQwZTNkXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3A5NlwiIG9mZnNldD1cIjFcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgPC9saW5lYXJHcmFkaWVudD5cbiAgICAgICA8Y2xpcFBhdGggaWQ9XCJjbGlwUGF0aDEwOFwiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgaWQ9XCJwYXRoMTA2XCJcbiAgICAgICAgICAgZD1cIm0gMjUwNC4wMSw3MTkuMTk5IGMgLTMxLjUsMCAtNTcuMTMsLTI1LjYxNyAtNTcuMTMsLTU3LjEyMSAwLC0zMS41MDggMjUuNjMsLTU3LjEzNyA1Ny4xMywtNTcuMTM3IDMxLjUsMCA1Ny4xMywyNS42MjkgNTcuMTMsNTcuMTM3IDAsMzEuNTA0IC0yNS42Myw1Ny4xMjEgLTU3LjEzLDU3LjEyMSB6XCIgLz5cbiAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgIDxsaW5lYXJHcmFkaWVudFxuICAgICAgICAgaWQ9XCJsaW5lYXJHcmFkaWVudDEyMFwiXG4gICAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0MS44Nyw2NTQuMjYpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTEwXCIgb2Zmc2V0PVwiMFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTEyXCIgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTE0XCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTE2XCIgb2Zmc2V0PVwiMC45OTg1NlwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTE4XCIgb2Zmc2V0PVwiMVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICA8L2xpbmVhckdyYWRpZW50PlxuICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXBQYXRoMTMwXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGgxMjhcIlxuICAgICAgICAgICBkPVwibSAzMDQ4LjM1LDcyNy4zMzIgYyAtMzYuMDgsMCAtNjUuMzEsLTI5LjI0MiAtNjUuMzEsLTY1LjMwMSAwLC0zNi4wNyAyOS4yMywtNjUuMzEyIDY1LjMxLC02NS4zMTIgMzYuMDYsMCA2NS4zLDI5LjI0MiA2NS4zLDY1LjMxMiAwLDM2LjA1OSAtMjkuMjQsNjUuMzAxIC02NS4zLDY1LjMwMSB6XCIgLz5cbiAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgIDxsaW5lYXJHcmFkaWVudFxuICAgICAgICAgaWQ9XCJsaW5lYXJHcmFkaWVudDE0MlwiXG4gICAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0MS45OCw2NDYuNjQpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTMyXCIgb2Zmc2V0PVwiMFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTM0XCIgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTM2XCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTM4XCIgb2Zmc2V0PVwiMC45OTg1NlwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMTQwXCIgb2Zmc2V0PVwiMVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICA8L2xpbmVhckdyYWRpZW50PlxuICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXBQYXRoMTUyXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGgxNTBcIlxuICAgICAgICAgICBkPVwibSAzNTkyLjY4LDcyOC4yMzggYyAtMzYuNTQsMCAtNjYuMjYsLTI5LjcyNiAtNjYuMjYsLTY2LjI1OCAwLC0zNi41MzkgMjkuNzIsLTY2LjI1IDY2LjI2LC02Ni4yNSAzNi41MywwIDY2LjI1LDI5LjcxMSA2Ni4yNSw2Ni4yNSAwLDM2LjUzMiAtMjkuNzIsNjYuMjU4IC02Ni4yNSw2Ni4yNTggelwiIC8+XG4gICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICA8bGluZWFyR3JhZGllbnRcbiAgICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQxNjRcIlxuICAgICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuMDgsNjM5LjAzKVwiXG4gICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgeTI9XCIwXCJcbiAgICAgICAgIHgyPVwiMVwiXG4gICAgICAgICB5MT1cIjBcIlxuICAgICAgICAgeDE9XCIwXCI+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDE1NFwiIG9mZnNldD1cIjBcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDE1NlwiIG9mZnNldD1cIjAuMDAxOTgwMDlcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDE1OFwiIG9mZnNldD1cIjAuNDQzNDRcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiM4ZDE5OGZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDE2MFwiIG9mZnNldD1cIjAuOTk4NTZcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDE2MlwiIG9mZnNldD1cIjFcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgPC9saW5lYXJHcmFkaWVudD5cbiAgICAgICA8Y2xpcFBhdGggaWQ9XCJjbGlwUGF0aDE3NFwiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgaWQ9XCJwYXRoMTcyXCJcbiAgICAgICAgICAgZD1cIm0gNDEzNy4wMSw3MzYuMzU5IGMgLTQxLjEsMCAtNzQuNDMsLTMzLjMyIC03NC40MywtNzQuNDE4IDAsLTQxLjEwMSAzMy4zMywtNzQuNDI5IDc0LjQzLC03NC40MjkgNDEuMSwwIDc0LjQyLDMzLjMyOCA3NC40Miw3NC40MjkgMCw0MS4wOTggLTMzLjMyLDc0LjQxOCAtNzQuNDIsNzQuNDE4IHpcIiAvPlxuICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgPGxpbmVhckdyYWRpZW50XG4gICAgICAgICBpZD1cImxpbmVhckdyYWRpZW50MTg2XCJcbiAgICAgICAgIHNwcmVhZE1ldGhvZD1cInBhZFwiXG4gICAgICAgICBncmFkaWVudFRyYW5zZm9ybT1cIm1hdHJpeCg3ODM3LjQyLDEwOC45OTEsMTA4Ljk5MSwtNzgzNy40MiwxOTQyLjE5LDYzMS40MilcIlxuICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICAgIHkyPVwiMFwiXG4gICAgICAgICB4Mj1cIjFcIlxuICAgICAgICAgeTE9XCIwXCJcbiAgICAgICAgIHgxPVwiMFwiPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AxNzZcIiBvZmZzZXQ9XCIwXCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMDBhZGVmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AxNzhcIiBvZmZzZXQ9XCIwLjAwMTk4MDA5XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMDBhZGVmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AxODBcIiBvZmZzZXQ9XCIwLjQ0MzQ0XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjOGQxOThmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AxODJcIiBvZmZzZXQ9XCIwLjk5ODU2XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMzQwZTNkXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AxODRcIiBvZmZzZXQ9XCIxXCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMzQwZTNkXCIvPlxuICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gICAgICAgPGNsaXBQYXRoIGlkPVwiY2xpcFBhdGgxOTZcIiBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj5cbiAgICAgICAgIDxwYXRoXG4gICAgICAgICAgIGlkPVwicGF0aDE5NFwiXG4gICAgICAgICAgIGQ9XCJtIDQ2ODEuMzQsNzQwLjg3MSBjIC00My42MiwwIC03OC45OSwtMzUuMzU5IC03OC45OSwtNzguOTggMCwtNDMuNjIxIDM1LjM3LC03OC45ODEgNzguOTksLTc4Ljk4MSA0My42MywwIDc4Ljk5LDM1LjM2IDc4Ljk5LDc4Ljk4MSAwLDQzLjYyMSAtMzUuMzYsNzguOTggLTc4Ljk5LDc4Ljk4IHpcIiAvPlxuICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgPGxpbmVhckdyYWRpZW50XG4gICAgICAgICBpZD1cImxpbmVhckdyYWRpZW50MjA4XCJcbiAgICAgICAgIHNwcmVhZE1ldGhvZD1cInBhZFwiXG4gICAgICAgICBncmFkaWVudFRyYW5zZm9ybT1cIm1hdHJpeCg3ODM3LjQyLDEwOC45OTEsMTA4Ljk5MSwtNzgzNy40MiwxOTQyLjI5LDYyMy44KVwiXG4gICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgeTI9XCIwXCJcbiAgICAgICAgIHgyPVwiMVwiXG4gICAgICAgICB5MT1cIjBcIlxuICAgICAgICAgeDE9XCIwXCI+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDE5OFwiIG9mZnNldD1cIjBcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDIwMFwiIG9mZnNldD1cIjAuMDAxOTgwMDlcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDIwMlwiIG9mZnNldD1cIjAuNDQzNDRcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiM4ZDE5OGZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDIwNFwiIG9mZnNldD1cIjAuOTk4NTZcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDIwNlwiIG9mZnNldD1cIjFcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgPC9saW5lYXJHcmFkaWVudD5cbiAgICAgICA8Y2xpcFBhdGggaWQ9XCJjbGlwUGF0aDIxOFwiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgaWQ9XCJwYXRoMjE2XCJcbiAgICAgICAgICAgZD1cIm0gNTIyNS42Nyw3NDUuMzkxIGMgLTQ2LjEzLDAgLTgzLjU0LC0zNy40MTEgLTgzLjU0LC04My41NTEgMCwtNDYuMTQxIDM3LjQxLC04My41MzkgODMuNTQsLTgzLjUzOSA0Ni4xNSwwIDgzLjU2LDM3LjM5OCA4My41Niw4My41MzkgMCw0Ni4xNCAtMzcuNDEsODMuNTUxIC04My41Niw4My41NTEgelwiIC8+XG4gICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICA8bGluZWFyR3JhZGllbnRcbiAgICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQyMzBcIlxuICAgICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuNCw2MTYuMTgpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjIwXCIgb2Zmc2V0PVwiMFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjIyXCIgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjI0XCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjI2XCIgb2Zmc2V0PVwiMC45OTg1NlwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjI4XCIgb2Zmc2V0PVwiMVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICA8L2xpbmVhckdyYWRpZW50PlxuICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXBQYXRoMjQwXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGgyMzhcIlxuICAgICAgICAgICBkPVwibSA1NzcwLjAxLDc0OS45MSBjIC00OC42NywwIC04OC4xMSwtMzkuNDYxIC04OC4xMSwtODguMTIxIDAsLTQ4LjY0OCAzOS40NCwtODguMDk4IDg4LjExLC04OC4wOTggNDguNjYsMCA4OC4xLDM5LjQ1IDg4LjEsODguMDk4IDAsNDguNjYgLTM5LjQ0LDg4LjEyMSAtODguMSw4OC4xMjEgelwiIC8+XG4gICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICA8bGluZWFyR3JhZGllbnRcbiAgICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQyNTJcIlxuICAgICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuNSw2MDguNTcpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjQyXCIgb2Zmc2V0PVwiMFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjQ0XCIgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjQ2XCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjQ4XCIgb2Zmc2V0PVwiMC45OTg1NlwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMjUwXCIgb2Zmc2V0PVwiMVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICA8L2xpbmVhckdyYWRpZW50PlxuICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXBQYXRoMjYyXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGgyNjBcIlxuICAgICAgICAgICBkPVwibSA2MzE0LjM0LDc1NC40MjIgYyAtNTEuMTgsMCAtOTIuNjcsLTQxLjQ5MiAtOTIuNjcsLTkyLjY3MiAwLC01MS4xOCA0MS40OSwtOTIuNjcyIDkyLjY3LC05Mi42NzIgNTEuMTcsMCA5Mi42Nyw0MS40OTIgOTIuNjcsOTIuNjcyIDAsNTEuMTggLTQxLjUsOTIuNjcyIC05Mi42Nyw5Mi42NzIgelwiIC8+XG4gICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICA8bGluZWFyR3JhZGllbnRcbiAgICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQyNzRcIlxuICAgICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuNjEsNjAwLjk2KVwiXG4gICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgeTI9XCIwXCJcbiAgICAgICAgIHgyPVwiMVwiXG4gICAgICAgICB5MT1cIjBcIlxuICAgICAgICAgeDE9XCIwXCI+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI2NFwiIG9mZnNldD1cIjBcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI2NlwiIG9mZnNldD1cIjAuMDAxOTgwMDlcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI2OFwiIG9mZnNldD1cIjAuNDQzNDRcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiM4ZDE5OGZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI3MFwiIG9mZnNldD1cIjAuOTk4NTZcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI3MlwiIG9mZnNldD1cIjFcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgPC9saW5lYXJHcmFkaWVudD5cbiAgICAgICA8Y2xpcFBhdGggaWQ9XCJjbGlwUGF0aDI4NFwiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgaWQ9XCJwYXRoMjgyXCJcbiAgICAgICAgICAgZD1cIm0gNjg1OC42OCw3NTguOTMgYyAtNTMuNywwIC05Ny4yNCwtNDMuNTIgLTk3LjI0LC05Ny4yMzEgMCwtNTMuNjk5IDQzLjU0LC05Ny4yMTkgOTcuMjQsLTk3LjIxOSA1My42OSwwIDk3LjIzLDQzLjUyIDk3LjIzLDk3LjIxOSAwLDUzLjcxMSAtNDMuNTQsOTcuMjMxIC05Ny4yMyw5Ny4yMzEgelwiIC8+XG4gICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICA8bGluZWFyR3JhZGllbnRcbiAgICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQyOTZcIlxuICAgICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDIuNzIsNTkzLjM0KVwiXG4gICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgeTI9XCIwXCJcbiAgICAgICAgIHgyPVwiMVwiXG4gICAgICAgICB5MT1cIjBcIlxuICAgICAgICAgeDE9XCIwXCI+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI4NlwiIG9mZnNldD1cIjBcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI4OFwiIG9mZnNldD1cIjAuMDAxOTgwMDlcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMwMGFkZWZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI5MFwiIG9mZnNldD1cIjAuNDQzNDRcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiM4ZDE5OGZcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI5MlwiIG9mZnNldD1cIjAuOTk4NTZcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgICAgIDxzdG9wIGlkPVwic3RvcDI5NFwiIG9mZnNldD1cIjFcIiBzdG9wLW9wYWNpdHk9XCIxXCIgc3RvcC1jb2xvcj1cIiMzNDBlM2RcIi8+XG4gICAgICAgPC9saW5lYXJHcmFkaWVudD5cbiAgICAgICA8Y2xpcFBhdGggaWQ9XCJjbGlwUGF0aDMwNlwiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgaWQ9XCJwYXRoMzA0XCJcbiAgICAgICAgICAgZD1cIm0gNzQwMyw3NjMuNDQ5IGMgLTU2LjIyLDAgLTEwMS43OCwtNDUuNTcgLTEwMS43OCwtMTAxLjc4OSAwLC01Ni4yMyA0NS41NiwtMTAxLjc4OSAxMDEuNzgsLTEwMS43ODkgNTYuMjMsMCAxMDEuNzksNDUuNTU5IDEwMS43OSwxMDEuNzg5IDAsNTYuMjE5IC00NS41NiwxMDEuNzg5IC0xMDEuNzksMTAxLjc4OSB6XCIgLz5cbiAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgIDxsaW5lYXJHcmFkaWVudFxuICAgICAgICAgaWQ9XCJsaW5lYXJHcmFkaWVudDMxOFwiXG4gICAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0Mi44Miw1ODUuNzMpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzA4XCIgb2Zmc2V0PVwiMFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzEwXCIgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzEyXCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzE0XCIgb2Zmc2V0PVwiMC45OTg1NlwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzE2XCIgb2Zmc2V0PVwiMVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICA8L2xpbmVhckdyYWRpZW50PlxuICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXBQYXRoMzI4XCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGgzMjZcIlxuICAgICAgICAgICBkPVwibSA3OTQ3LjM0LDc2Ny45NjEgYyAtNTguNzQsMCAtMTA2LjM2LC00Ny42MDkgLTEwNi4zNiwtMTA2LjM1MiAwLC01OC43MyA0Ny42MiwtMTA2LjM0NyAxMDYuMzYsLTEwNi4zNDcgNTguNzQsMCAxMDYuMzUsNDcuNjE3IDEwNi4zNSwxMDYuMzQ3IDAsNTguNzQzIC00Ny42MSwxMDYuMzUyIC0xMDYuMzUsMTA2LjM1MiB6XCIgLz5cbiAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgIDxsaW5lYXJHcmFkaWVudFxuICAgICAgICAgaWQ9XCJsaW5lYXJHcmFkaWVudDM0MFwiXG4gICAgICAgICBzcHJlYWRNZXRob2Q9XCJwYWRcIlxuICAgICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09XCJtYXRyaXgoNzgzNy40MiwxMDguOTkxLDEwOC45OTEsLTc4MzcuNDIsMTk0Mi45Myw1NzguMTEpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzMwXCIgb2Zmc2V0PVwiMFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzMyXCIgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzM0XCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzM2XCIgb2Zmc2V0PVwiMC45OTg1NlwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzM4XCIgb2Zmc2V0PVwiMVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICA8L2xpbmVhckdyYWRpZW50PlxuICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXBQYXRoMzUwXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGgzNDhcIlxuICAgICAgICAgICBkPVwibSA4NDkxLjY3LDc3Mi40OCBjIC02MS4yNSwwIC0xMTAuOTEsLTQ5LjY2IC0xMTAuOTEsLTExMC45MSAwLC02MS4yNjEgNDkuNjYsLTExMC45MjIgMTEwLjkxLC0xMTAuOTIyIDYxLjI2LDAgMTEwLjkxLDQ5LjY2MSAxMTAuOTEsMTEwLjkyMiAwLDYxLjI1IC00OS42NSwxMTAuOTEgLTExMC45MSwxMTAuOTEgelwiIC8+XG4gICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICA8bGluZWFyR3JhZGllbnRcbiAgICAgICAgIGlkPVwibGluZWFyR3JhZGllbnQzNjJcIlxuICAgICAgICAgc3ByZWFkTWV0aG9kPVwicGFkXCJcbiAgICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPVwibWF0cml4KDc4MzcuNDIsMTA4Ljk5MSwxMDguOTkxLC03ODM3LjQyLDE5NDMuMDMsNTcwLjUpXCJcbiAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICB5Mj1cIjBcIlxuICAgICAgICAgeDI9XCIxXCJcbiAgICAgICAgIHkxPVwiMFwiXG4gICAgICAgICB4MT1cIjBcIj5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzUyXCIgb2Zmc2V0PVwiMFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzU0XCIgb2Zmc2V0PVwiMC4wMDE5ODAwOVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzAwYWRlZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzU2XCIgb2Zmc2V0PVwiMC40NDM0NFwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzhkMTk4ZlwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzU4XCIgb2Zmc2V0PVwiMC45OTg1NlwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICAgICAgPHN0b3AgaWQ9XCJzdG9wMzYwXCIgb2Zmc2V0PVwiMVwiIHN0b3Atb3BhY2l0eT1cIjFcIiBzdG9wLWNvbG9yPVwiIzM0MGUzZFwiLz5cbiAgICAgICA8L2xpbmVhckdyYWRpZW50PlxuICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXBQYXRoMzcyXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICA8cGF0aFxuICAgICAgICAgICBpZD1cInBhdGgzNzBcIlxuICAgICAgICAgICBkPVwibSA5MDM2LDc3Ni45ODggYyAtNjMuNzcsMCAtMTE1LjQ3LC01MS42OTkgLTExNS40NywtMTE1LjQ2OCAwLC02My43ODIgNTEuNywtMTE1LjQ4MSAxMTUuNDcsLTExNS40ODEgNjMuNzcsMCAxMTUuNDcsNTEuNjk5IDExNS40NywxMTUuNDgxIDAsNjMuNzY5IC01MS43LDExNS40NjggLTExNS40NywxMTUuNDY4IHpcIiAvPlxuICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgPGxpbmVhckdyYWRpZW50XG4gICAgICAgICBpZD1cImxpbmVhckdyYWRpZW50Mzg0XCJcbiAgICAgICAgIHNwcmVhZE1ldGhvZD1cInBhZFwiXG4gICAgICAgICBncmFkaWVudFRyYW5zZm9ybT1cIm1hdHJpeCg3ODM3LjQyLDEwOC45OTEsMTA4Ljk5MSwtNzgzNy40MiwxOTQzLjE0LDU2Mi44OClcIlxuICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICAgIHkyPVwiMFwiXG4gICAgICAgICB4Mj1cIjFcIlxuICAgICAgICAgeTE9XCIwXCJcbiAgICAgICAgIHgxPVwiMFwiPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AzNzRcIiBvZmZzZXQ9XCIwXCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMDBhZGVmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AzNzZcIiBvZmZzZXQ9XCIwLjAwMTk4MDA5XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMDBhZGVmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AzNzhcIiBvZmZzZXQ9XCIwLjQ0MzQ0XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjOGQxOThmXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AzODBcIiBvZmZzZXQ9XCIwLjk5ODU2XCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMzQwZTNkXCIvPlxuICAgICAgICAgICA8c3RvcCBpZD1cInN0b3AzODJcIiBvZmZzZXQ9XCIxXCIgc3RvcC1vcGFjaXR5PVwiMVwiIHN0b3AtY29sb3I9XCIjMzQwZTNkXCIvPlxuICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gICAgICAgPGNsaXBQYXRoIGlkPVwiY2xpcFBhdGgzOTRcIiBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj5cbiAgICAgICAgIDxwYXRoXG4gICAgICAgICAgIGlkPVwicGF0aDM5MlwiXG4gICAgICAgICAgIGQ9XCJNIDAsMCBIIDk1MzggViAyNjE1Ljc3IEggMCBaXCIgLz5cbiAgICAgICA8L2NsaXBQYXRoPjwvZGVmcz48Z1xuICAgICB0cmFuc2Zvcm09XCJtYXRyaXgoMS4zMzMzMzMzLDAsMCwtMS4zMzMzMzMzLDAsMzQ4Ljc3MzMzKVwiXG4gICAgIGlkPVwiZzEwXCI+PGdcbiAgICAgICB0cmFuc2Zvcm09XCJzY2FsZSgwLjEpXCJcbiAgICAgICBpZD1cImcxMlwiPjxnXG4gICAgICAgICBpZD1cImcxNFwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgvc3RvY2hzcyNjbGlwUGF0aDIwKVwiXG4gICAgICAgICAgIGlkPVwiZzE2XCI+PHBhdGhcbiAgICAgICAgICAgICBpZD1cInBhdGgzNFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgvc3RvY2hzcyNsaW5lYXJHcmFkaWVudDMyKTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDMyNi42ODgsNzA0Ljc2MiBjIC0yMy40NzcsMCAtNDIuNSwtMTkuMDMyIC00Mi41LC00Mi41IDAsLTIzLjQ4MSAxOS4wMjMsLTQyLjUgNDIuNSwtNDIuNSAyMy40NjQsMCA0Mi40ODgsMTkuMDE5IDQyLjQ4OCw0Mi41IDAsMjMuNDY4IC0xOS4wMjQsNDIuNSAtNDIuNDg4LDQyLjVcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzM2XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoNDIpXCJcbiAgICAgICAgICAgaWQ9XCJnMzhcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDU2XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKC9zdG9jaHNzI2xpbmVhckdyYWRpZW50NTQpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO1wiXG4gICAgICAgICAgICAgZD1cIm0gODcxLjAxMiw3MDkuMjcgYyAtMjUuOTg1LDAgLTQ3LjA1OSwtMjEuMDU5IC00Ny4wNTksLTQ3LjA1OSAwLC0yNS45ODEgMjEuMDc0LC00Ny4wNjMgNDcuMDU5LC00Ny4wNjMgMjUuOTg4LDAgNDcuMDYyLDIxLjA4MiA0Ny4wNjIsNDcuMDYzIDAsMjYgLTIxLjA3NCw0Ny4wNTkgLTQ3LjA2Miw0Ny4wNTlcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzU4XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoNjQpXCJcbiAgICAgICAgICAgaWQ9XCJnNjBcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDc4XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKC9zdG9jaHNzI2xpbmVhckdyYWRpZW50NzYpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO1wiXG4gICAgICAgICAgICAgZD1cIm0gMTQxNS4zNSw3MTMuNzg5IGMgLTI4LjUxLDAgLTUxLjYyLC0yMy4xMDkgLTUxLjYyLC01MS42MTcgMCwtMjguNTEyIDIzLjExLC01MS42MjEgNTEuNjIsLTUxLjYyMSAyOC41LDAgNTEuNjIsMjMuMTA5IDUxLjYyLDUxLjYyMSAwLDI4LjUwOCAtMjMuMTIsNTEuNjE3IC01MS42Miw1MS42MTdcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzgwXCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoODYpXCJcbiAgICAgICAgICAgaWQ9XCJnODJcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDEwMFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgvc3RvY2hzcyNsaW5lYXJHcmFkaWVudDk4KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDE5NTkuNjcsNzE4LjMwOSBjIC0zMS4wMiwwIC01Ni4xNywtMjUuMTYxIC01Ni4xNywtNTYuMTg4IDAsLTMxLjAxOSAyNS4xNSwtNTYuMTggNTYuMTcsLTU2LjE4IDMxLjA0LDAgNTYuMiwyNS4xNjEgNTYuMiw1Ni4xOCAwLDMxLjAyNyAtMjUuMTYsNTYuMTg4IC01Ni4yLDU2LjE4OFwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMTAyXCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoMTA4KVwiXG4gICAgICAgICAgIGlkPVwiZzEwNFwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMTIyXCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKC9zdG9jaHNzI2xpbmVhckdyYWRpZW50MTIwKTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDI1MDQuMDEsNzE5LjE5OSBjIC0zMS41LDAgLTU3LjEzLC0yNS42MTcgLTU3LjEzLC01Ny4xMjEgMCwtMzEuNTA4IDI1LjYzLC01Ny4xMzcgNTcuMTMsLTU3LjEzNyAzMS41LDAgNTcuMTMsMjUuNjI5IDU3LjEzLDU3LjEzNyAwLDMxLjUwNCAtMjUuNjMsNTcuMTIxIC01Ny4xMyw1Ny4xMjFcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzEyNFwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgvc3RvY2hzcyNjbGlwUGF0aDEzMClcIlxuICAgICAgICAgICBpZD1cImcxMjZcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDE0NFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgvc3RvY2hzcyNsaW5lYXJHcmFkaWVudDE0Mik7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7XCJcbiAgICAgICAgICAgICBkPVwibSAzMDQ4LjM1LDcyNy4zMzIgYyAtMzYuMDgsMCAtNjUuMzEsLTI5LjI0MiAtNjUuMzEsLTY1LjMwMSAwLC0zNi4wNyAyOS4yMywtNjUuMzEyIDY1LjMxLC02NS4zMTIgMzYuMDYsMCA2NS4zLDI5LjI0MiA2NS4zLDY1LjMxMiAwLDM2LjA1OSAtMjkuMjQsNjUuMzAxIC02NS4zLDY1LjMwMVwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMTQ2XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoMTUyKVwiXG4gICAgICAgICAgIGlkPVwiZzE0OFwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMTY2XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKC9zdG9jaHNzI2xpbmVhckdyYWRpZW50MTY0KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDM1OTIuNjgsNzI4LjIzOCBjIC0zNi41NCwwIC02Ni4yNiwtMjkuNzI2IC02Ni4yNiwtNjYuMjU4IDAsLTM2LjUzOSAyOS43MiwtNjYuMjUgNjYuMjYsLTY2LjI1IDM2LjUzLDAgNjYuMjUsMjkuNzExIDY2LjI1LDY2LjI1IDAsMzYuNTMyIC0yOS43Miw2Ni4yNTggLTY2LjI1LDY2LjI1OFwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMTY4XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoMTc0KVwiXG4gICAgICAgICAgIGlkPVwiZzE3MFwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMTg4XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKC9zdG9jaHNzI2xpbmVhckdyYWRpZW50MTg2KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDQxMzcuMDEsNzM2LjM1OSBjIC00MS4xLDAgLTc0LjQzLC0zMy4zMiAtNzQuNDMsLTc0LjQxOCAwLC00MS4xMDEgMzMuMzMsLTc0LjQyOSA3NC40MywtNzQuNDI5IDQxLjEsMCA3NC40MiwzMy4zMjggNzQuNDIsNzQuNDI5IDAsNDEuMDk4IC0zMy4zMiw3NC40MTggLTc0LjQyLDc0LjQxOFwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMTkwXCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoMTk2KVwiXG4gICAgICAgICAgIGlkPVwiZzE5MlwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMjEwXCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKC9zdG9jaHNzI2xpbmVhckdyYWRpZW50MjA4KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDQ2ODEuMzQsNzQwLjg3MSBjIC00My42MiwwIC03OC45OSwtMzUuMzU5IC03OC45OSwtNzguOTggMCwtNDMuNjIxIDM1LjM3LC03OC45ODEgNzguOTksLTc4Ljk4MSA0My42MywwIDc4Ljk5LDM1LjM2IDc4Ljk5LDc4Ljk4MSAwLDQzLjYyMSAtMzUuMzYsNzguOTggLTc4Ljk5LDc4Ljk4XCIgLz48L2c+PC9nPjxnXG4gICAgICAgICBpZD1cImcyMTJcIj48Z1xuICAgICAgICAgICBjbGlwLXBhdGg9XCJ1cmwoL3N0b2Noc3MjY2xpcFBhdGgyMTgpXCJcbiAgICAgICAgICAgaWQ9XCJnMjE0XCI+PHBhdGhcbiAgICAgICAgICAgICBpZD1cInBhdGgyMzJcIlxuICAgICAgICAgICAgIHN0eWxlPVwiZmlsbDp1cmwoL3N0b2Noc3MjbGluZWFyR3JhZGllbnQyMzApO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO1wiXG4gICAgICAgICAgICAgZD1cIm0gNTIyNS42Nyw3NDUuMzkxIGMgLTQ2LjEzLDAgLTgzLjU0LC0zNy40MTEgLTgzLjU0LC04My41NTEgMCwtNDYuMTQxIDM3LjQxLC04My41MzkgODMuNTQsLTgzLjUzOSA0Ni4xNSwwIDgzLjU2LDM3LjM5OCA4My41Niw4My41MzkgMCw0Ni4xNCAtMzcuNDEsODMuNTUxIC04My41Niw4My41NTFcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzIzNFwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgvc3RvY2hzcyNjbGlwUGF0aDI0MClcIlxuICAgICAgICAgICBpZD1cImcyMzZcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDI1NFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgvc3RvY2hzcyNsaW5lYXJHcmFkaWVudDI1Mik7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7XCJcbiAgICAgICAgICAgICBkPVwibSA1NzcwLjAxLDc0OS45MSBjIC00OC42NywwIC04OC4xMSwtMzkuNDYxIC04OC4xMSwtODguMTIxIDAsLTQ4LjY0OCAzOS40NCwtODguMDk4IDg4LjExLC04OC4wOTggNDguNjYsMCA4OC4xLDM5LjQ1IDg4LjEsODguMDk4IDAsNDguNjYgLTM5LjQ0LDg4LjEyMSAtODguMSw4OC4xMjFcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzI1NlwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgvc3RvY2hzcyNjbGlwUGF0aDI2MilcIlxuICAgICAgICAgICBpZD1cImcyNThcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDI3NlwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgvc3RvY2hzcyNsaW5lYXJHcmFkaWVudDI3NCk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7XCJcbiAgICAgICAgICAgICBkPVwibSA2MzE0LjM0LDc1NC40MjIgYyAtNTEuMTgsMCAtOTIuNjcsLTQxLjQ5MiAtOTIuNjcsLTkyLjY3MiAwLC01MS4xOCA0MS40OSwtOTIuNjcyIDkyLjY3LC05Mi42NzIgNTEuMTcsMCA5Mi42Nyw0MS40OTIgOTIuNjcsOTIuNjcyIDAsNTEuMTggLTQxLjUsOTIuNjcyIC05Mi42Nyw5Mi42NzJcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzI3OFwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgvc3RvY2hzcyNjbGlwUGF0aDI4NClcIlxuICAgICAgICAgICBpZD1cImcyODBcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDI5OFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgvc3RvY2hzcyNsaW5lYXJHcmFkaWVudDI5Nik7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7XCJcbiAgICAgICAgICAgICBkPVwibSA2ODU4LjY4LDc1OC45MyBjIC01My43LDAgLTk3LjI0LC00My41MiAtOTcuMjQsLTk3LjIzMSAwLC01My42OTkgNDMuNTQsLTk3LjIxOSA5Ny4yNCwtOTcuMjE5IDUzLjY5LDAgOTcuMjMsNDMuNTIgOTcuMjMsOTcuMjE5IDAsNTMuNzExIC00My41NCw5Ny4yMzEgLTk3LjIzLDk3LjIzMVwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMzAwXCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoMzA2KVwiXG4gICAgICAgICAgIGlkPVwiZzMwMlwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMzIwXCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKC9zdG9jaHNzI2xpbmVhckdyYWRpZW50MzE4KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDc0MDMsNzYzLjQ0OSBjIC01Ni4yMiwwIC0xMDEuNzgsLTQ1LjU3IC0xMDEuNzgsLTEwMS43ODkgMCwtNTYuMjMgNDUuNTYsLTEwMS43ODkgMTAxLjc4LC0xMDEuNzg5IDU2LjIzLDAgMTAxLjc5LDQ1LjU1OSAxMDEuNzksMTAxLjc4OSAwLDU2LjIxOSAtNDUuNTYsMTAxLjc4OSAtMTAxLjc5LDEwMS43ODlcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzMyMlwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgvc3RvY2hzcyNjbGlwUGF0aDMyOClcIlxuICAgICAgICAgICBpZD1cImczMjRcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDM0MlwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOnVybCgvc3RvY2hzcyNsaW5lYXJHcmFkaWVudDM0MCk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7XCJcbiAgICAgICAgICAgICBkPVwibSA3OTQ3LjM0LDc2Ny45NjEgYyAtNTguNzQsMCAtMTA2LjM2LC00Ny42MDkgLTEwNi4zNiwtMTA2LjM1MiAwLC01OC43MyA0Ny42MiwtMTA2LjM0NyAxMDYuMzYsLTEwNi4zNDcgNTguNzQsMCAxMDYuMzUsNDcuNjE3IDEwNi4zNSwxMDYuMzQ3IDAsNTguNzQzIC00Ny42MSwxMDYuMzUyIC0xMDYuMzUsMTA2LjM1MlwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMzQ0XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoMzUwKVwiXG4gICAgICAgICAgIGlkPVwiZzM0NlwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMzY0XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKC9zdG9jaHNzI2xpbmVhckdyYWRpZW50MzYyKTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDg0OTEuNjcsNzcyLjQ4IGMgLTYxLjI1LDAgLTExMC45MSwtNDkuNjYgLTExMC45MSwtMTEwLjkxIDAsLTYxLjI2MSA0OS42NiwtMTEwLjkyMiAxMTAuOTEsLTExMC45MjIgNjEuMjYsMCAxMTAuOTEsNDkuNjYxIDExMC45MSwxMTAuOTIyIDAsNjEuMjUgLTQ5LjY1LDExMC45MSAtMTEwLjkxLDExMC45MVwiIC8+PC9nPjwvZz48Z1xuICAgICAgICAgaWQ9XCJnMzY2XCI+PGdcbiAgICAgICAgICAgY2xpcC1wYXRoPVwidXJsKC9zdG9jaHNzI2NsaXBQYXRoMzcyKVwiXG4gICAgICAgICAgIGlkPVwiZzM2OFwiPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoMzg2XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6dXJsKC9zdG9jaHNzI2xpbmVhckdyYWRpZW50Mzg0KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDkwMzYsNzc2Ljk4OCBjIC02My43NywwIC0xMTUuNDcsLTUxLjY5OSAtMTE1LjQ3LC0xMTUuNDY4IDAsLTYzLjc4MiA1MS43LC0xMTUuNDgxIDExNS40NywtMTE1LjQ4MSA2My43NywwIDExNS40Nyw1MS42OTkgMTE1LjQ3LDExNS40ODEgMCw2My43NjkgLTUxLjcsMTE1LjQ2OCAtMTE1LjQ3LDExNS40NjhcIiAvPjwvZz48L2c+PGdcbiAgICAgICAgIGlkPVwiZzM4OFwiPjxnXG4gICAgICAgICAgIGNsaXAtcGF0aD1cInVybCgvc3RvY2hzcyNjbGlwUGF0aDM5NClcIlxuICAgICAgICAgICBpZD1cImczOTBcIj48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDM5NlwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOiMyMzFmMjA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7XCJcbiAgICAgICAgICAgICBkPVwibSAzMjU0LjA5LDEwMDguNzIgYyAtMzA4LjksMCAtNTIxLjU3LDEyOS45NyAtNTM1LjA4LDQwNi43OSAwLDEwLjEzIDguNDQsMTguNTcgMTguNTcsMTguNTcgaCAyMzEuMjUgYyAxMC4xMiwwIDE4LjU2LC04LjQ0IDIwLjI1LC0xOC41NyAxNi44OCwtMTI5Ljk3IDc3LjY1LC0yMTQuMzYgMjcwLjA3LC0yMTQuMzYgMTUzLjYsMCAyMzgsNDUuNTYgMjM4LDE1Ni45NyAwLDI2Ni42OSAtNzU0LjUxLDU1LjcgLTc1NC41MSw1MjQuOTUgMCwyMjEuMTEgMTcyLjE3LDM1OS41MiA0NzQuMzEsMzU5LjUyIDI3NS4xNCwwIDQ2NS44NywtMTA2LjM0IDUwMywtMzU2LjE1IDAsLTEwLjEzIC02Ljc1LC0xOC41NiAtMTYuODgsLTE4LjU2IGggLTIzMS4yNSBjIC0xMS44LDAgLTIwLjI1LDYuNzQgLTIxLjk0LDE4LjU2IC0xNS4xOSwxMDQuNjYgLTEwMS4yNywxNjIuMDQgLTI0My4wNiwxNjIuMDQgLTEyMS41MywwIC0yMDkuMywtNDIuMTkgLTIwOS4zLC0xNDAuMSAwLC0yNTEuNSA3NTcuODgsLTQ3LjI1IDc1Ny44OCwtNTE0LjgxIDAsLTI0OS44MiAtMTkyLjQyLC0zODQuODUgLTUwMS4zMSwtMzg0Ljg1XCIgLz48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDM5OFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOiMyMzFmMjA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7XCJcbiAgICAgICAgICAgICBkPVwibSA0MzYzLjAzLDEwNzEuMTggYyAwLC0xMC4xMyAtOC40NCwtMjEuOTUgLTE2Ljg4LC0yNS4zMyAtNDguOTUsLTE1LjE5IC0xMDIuOTYsLTI3IC0xNTUuMjgsLTI3IC0xNDYuODYsMCAtMjg2Ljk2LDc0LjI3IC0yODYuOTYsMjcxLjc1IGwgMS42OSw0MzUuNDkgaCAtOTQuNTIgYyAtMTAuMTMsMCAtMTguNTcsOC40NCAtMTguNTcsMTguNTYgdiAxNDEuNzkgYyAwLDEwLjEzIDguNDQsMTguNTggMTguNTcsMTguNTggaCA5Mi44MyBsIC0xLjY5LDE5OS4xNiBjIDAsMTAuMTMgOC40NCwxOC41NyAxOC41OCwxOC41NyBoIDIxOS40MiBjIDEwLjEzLDAgMTguNTgsLTguNDQgMTguNTgsLTE4LjU3IGwgLTEuNjksLTE5OS4xNiBoIDE4OS4wNCBjIDEwLjEzLDAgMTguNTYsLTguNDUgMTguNTYsLTE4LjU4IHYgLTE0MS43OSBjIDAsLTEwLjEyIC04LjQzLC0xOC41NiAtMTguNTYsLTE4LjU2IGggLTE5MC43MyBsIDEuNjksLTQyOC43MyBjIDAsLTc0LjI3IDM3LjEzLC05Ny45IDkyLjgzLC05Ny45IDM4LjgzLDAgNjkuMjEsNi43NSA5NC41MiwxMy41IDEwLjEzLDEuNjggMTguNTcsLTUuMDYgMTguNTcsLTEzLjUgdiAtMTI4LjI4XCIgLz48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDQwMFwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOiMyMzFmMjA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7XCJcbiAgICAgICAgICAgICBkPVwibSA0ODM5LjAzLDExODIuNTcgYyAxMjQuOSwwIDE4My45OCw4Ni4wOSAxODMuOTgsMjg1LjI3IDAsMTk1LjggLTYwLjc3LDI5MC4zMiAtMTg1LjY3LDI5MC4zMiAtMTI4LjI4LC0xLjY5IC0xODcuMzYsLTk2LjIxIC0xODcuMzYsLTI5Mi4wMSAwLC0xOTUuOCA2Mi40NiwtMjgzLjU4IDE4OS4wNSwtMjgzLjU4IHogbSAwLC0xNjguNzkgYyAtMjgzLjU3LDAgLTQ0Ny4zLDE3Ny4yNCAtNDQ3LjMsNDU0LjA2IDAsMjc2LjgxIDE2My43Myw0NTkuMTIgNDQ3LjMsNDU5LjEyIDI4My41NywwIDQ0My45MywtMTc3LjI0IDQ0My45MywtNDU0LjA1IDAsLTI3Ni44MyAtMTYwLjM2LC00NTkuMTMgLTQ0My45MywtNDU5LjEzXCIgLz48cGF0aFxuICAgICAgICAgICAgIGlkPVwicGF0aDQwMlwiXG4gICAgICAgICAgICAgc3R5bGU9XCJmaWxsOiMyMzFmMjA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7XCJcbiAgICAgICAgICAgICBkPVwibSA1Nzg1LjkzLDEwMTMuNzggYyAtMjc4LjUsMCAtNDQzLjkyLDE3Ny4yNCAtNDQzLjkyLDQ1NC4wNiAwLDI3Ni44MSAxNjUuNDIsNDU5LjEyIDQ0OC45OSw0NTkuMTIgMjIyLjgxLDAgMzY2LjI4LC0xMjQuOTEgMzg4LjIzLC0zMTIuMjggMS42OCwtMTAuMTIgLTYuNzYsLTE4LjU2IC0xNi44OSwtMTguNTYgaCAtMTk3LjQ4IGMgLTEwLjE0LDAgLTIwLjI2LDYuNzYgLTIxLjk0LDE4LjU2IC0xOC41OCw5NC41MyAtODEuMDMsMTQxLjc5IC0xNTEuOTIsMTQxLjc5IC0xMjguMjksLTEuNjkgLTE4OS4wNSwtOTQuNTIgLTE4OS4wNSwtMjg2Ljk0IDAsLTE5OS4xOCA2Mi40NSwtMjg1LjI3IDE4OS4wNSwtMjg2Ljk2IDg0LjQsLTEuNjggMTQ4LjU0LDU3LjQgMTYwLjM1LDE2OC44IDEuNjksMTAuMTMgMTAuMTMsMTguNTcgMjAuMjYsMTguNTcgaCAyMDIuNTUgYyAxMC4xMiwwIDE4LjU2LC04LjQ0IDE2Ljg4LC0xOC41NyAtMjAuMjYsLTE5NS44IC0xNzguOTIsLTMzNy41OSAtNDA1LjExLC0zMzcuNTlcIiAvPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoNDA0XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6IzIzMWYyMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDY3MDkuMjIsMTczOS41OSBjIC04Mi43MSwwIC0xNzIuMTcsLTY1LjgyIC0xOTcuNDgsLTE5MC43NCBsIDYuNzQsLTQ5NC41NiBjIDAsLTEwLjEyIC04LjQzLC0xOC41NiAtMTguNTYsLTE4LjU2IGggLTIxNi4wNiBjIC0xMC4xMiwwIC0xOC41Nyw4LjQ0IC0xOC41NywxOC41NiBsIDguNDUsNTczLjkgLTguNDUsNTcwLjUyIGMgMCwxMC4xMiA4LjQ1LDE4LjU3IDE4LjU3LDE4LjU3IGggMjE2LjA2IGMgMTAuMTMsMCAxOC41NiwtOC40NSAxOC41NiwtMTguNTcgbCAtNS4wNywtMzkxLjYgYyA1OS4wOSw3OS4zMyAxNDguNTUsMTE4LjE2IDI2My4zMywxMTguMTYgMTk1LjgsMCAzMTUuNjQsLTExNi40OCAzMTAuNTcsLTM3MS4zNSBsIC0xLjY5LC0xODUuNjcgNi43NiwtMzEzLjk2IGMgMCwtMTAuMTIgLTguNDQsLTE4LjU2IC0xOC41NywtMTguNTYgSCA2ODUxIGMgLTEwLjEyLDAgLTE4LjU2LDguNDQgLTE4LjU2LDE4LjU2IGwgNi43NSwzMTAuNTkgLTEuNjksMjE5LjQyIGMgLTEuNjgsMTA0LjY2IC01OS4wOCwxNTUuMjkgLTEyOC4yOCwxNTUuMjlcIiAvPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoNDA2XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6IzIzMWYyMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDc2OTEuNTgsMTAwOC43MiBjIC0zMDguOSwwIC01MjEuNTcsMTI5Ljk3IC01MzUuMDgsNDA2Ljc5IDAsMTAuMTMgOC40NCwxOC41NyAxOC41NywxOC41NyBoIDIzMS4yNSBjIDEwLjEyLDAgMTguNTYsLTguNDQgMjAuMjUsLTE4LjU3IDE2Ljg4LC0xMjkuOTcgNzcuNjUsLTIxNC4zNiAyNzAuMDcsLTIxNC4zNiAxNTMuNiwwIDIzOCw0NS41NiAyMzgsMTU2Ljk3IDAsMjY2LjY5IC03NTQuNTEsNTUuNyAtNzU0LjUxLDUyNC45NSAwLDIyMS4xMSAxNzIuMTcsMzU5LjUyIDQ3NC4zMSwzNTkuNTIgMjc1LjE0LDAgNDY1Ljg3LC0xMDYuMzQgNTAzLC0zNTYuMTUgMCwtMTAuMTMgLTYuNzUsLTE4LjU2IC0xNi44OCwtMTguNTYgaCAtMjMxLjI1IGMgLTExLjgsMCAtMjAuMjUsNi43NCAtMjEuOTQsMTguNTYgLTE1LjE5LDEwNC42NiAtMTAxLjI3LDE2Mi4wNCAtMjQzLjA2LDE2Mi4wNCAtMTIxLjUzLDAgLTIwOS4zLC00Mi4xOSAtMjA5LjMsLTE0MC4xIDAsLTI1MS41IDc1Ny44OCwtNDcuMjUgNzU3Ljg4LC01MTQuODEgMCwtMjQ5LjgyIC0xOTIuNDIsLTM4NC44NSAtNTAxLjMxLC0zODQuODVcIiAvPjxwYXRoXG4gICAgICAgICAgICAgaWQ9XCJwYXRoNDA4XCJcbiAgICAgICAgICAgICBzdHlsZT1cImZpbGw6IzIzMWYyMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtcIlxuICAgICAgICAgICAgIGQ9XCJtIDg3NjguNDUsMTAwOC43MiBjIC0zMDguODksMCAtNTIxLjU3LDEyOS45NyAtNTM1LjA3LDQwNi43OSAwLDEwLjEzIDguNDMsMTguNTcgMTguNTYsMTguNTcgaCAyMzEuMjUgYyAxMC4xMywwIDE4LjU2LC04LjQ0IDIwLjI1LC0xOC41NyAxNi44OSwtMTI5Ljk3IDc3LjY1LC0yMTQuMzYgMjcwLjA3LC0yMTQuMzYgMTUzLjYxLDAgMjM4LDQ1LjU2IDIzOCwxNTYuOTcgMCwyNjYuNjkgLTc1NC41LDU1LjcgLTc1NC41LDUyNC45NSAwLDIyMS4xMSAxNzIuMTcsMzU5LjUyIDQ3NC4zMSwzNTkuNTIgMjc1LjEzLDAgNDY1Ljg2LC0xMDYuMzQgNTAyLjk5LC0zNTYuMTUgMCwtMTAuMTMgLTYuNzQsLTE4LjU2IC0xNi44NywtMTguNTYgaCAtMjMxLjI1IGMgLTExLjgxLDAgLTIwLjI2LDYuNzQgLTIxLjk1LDE4LjU2IC0xNS4xOCwxMDQuNjYgLTEwMS4yNiwxNjIuMDQgLTI0My4wNSwxNjIuMDQgLTEyMS41MywwIC0yMDkuMzEsLTQyLjE5IC0yMDkuMzEsLTE0MC4xIDAsLTI1MS41IDc1Ny44OCwtNDcuMjUgNzU3Ljg4LC01MTQuODEgMCwtMjQ5LjgyIC0xOTIuNDIsLTM4NC44NSAtNTAxLjMxLC0zODQuODVcIiAvPjwvZz48L2c+PC9nPjwvZz48L3N2Zz5gXG59XG4iLCJsZXQgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xubGV0IFBhZ2VWaWV3ID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5sZXQgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcGFnZXMvaG9tZS5wdWcnKTtcbmxldCBncmFwaGljcyA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzJyk7XG5cbmltcG9ydCBpbml0UGFnZSBmcm9tICcuL3BhZ2UuanMnO1xuXG5sZXQgSG9tZVBhZ2UgPSBQYWdlVmlldy5leHRlbmQoe1xuICAgIHBhZ2VUaXRsZTogJ1N0b2NoU1MgfCBIb21lJyxcbiAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBQYWdlVmlldy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAkKHRoaXMucXVlcnlCeUhvb2soJ3N0b2Noc3MtbG9nbycpKS5odG1sKGdyYXBoaWNzWydsb2dvJ10pXG4gICAgfVxufSk7XG5cbmluaXRQYWdlKEhvbWVQYWdlKVxuIl0sInNvdXJjZVJvb3QiOiIifQ==