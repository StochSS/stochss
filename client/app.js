/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//var config = require('./config.js')(process.env.NODE_ENV);
let path = require('path');

let routePrefix = 'stochss';
let apiPrefix =  path.join(routePrefix, 'api');
let getBasePath = () => {
  try {
    let base = document.querySelector('base')
    let href = base.getAttribute('href')
    return href
  } catch (error) {
    return '/'
  }
};
let getApiPath = () => path.join(getBasePath(), apiPrefix);

var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "Other";
    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
  },
  searchString: function (data) {
    var dataString = navigator.userAgent;
    for (var i = 0; i < data.length; i++) {
      this.versionSearchString = data[i].subString;

      if (dataString.indexOf(data[i].subString) !== -1) {
        return data[i].identity;
      }
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index === -1) {
      return;
    }

    var rv = dataString.indexOf("rv:");
    if (this.versionSearchString === "Trident" && rv !== -1) {
      return parseFloat(dataString.substring(rv + 3));
    }else if(this.versionSearchString === "Safari"){
      let versionSearchString = "Version";
      let versionIndex = dataString.indexOf("Version")
      return parseFloat(dataString.substring(versionIndex + versionSearchString.length + 1, index - 1));
    }else{
      return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    }
  },

  dataBrowser: [
    {subString: "Edge", identity: "MS Edge"},
    {subString: "MSIE", identity: "Explorer"},
    {subString: "Trident", identity: "Explorer"},
    {subString: "Firefox", identity: "Firefox"},
    {subString: "Opera", identity: "Opera"},  
    {subString: "OPR", identity: "Opera"},  
    {subString: "Chrome", identity: "Chrome"}, 
    {subString: "Safari", identity: "Safari"}       
  ]
};

let getBrowser = () => {
  BrowserDetect.init();
  return {"name":BrowserDetect.browser,"version":BrowserDetect.version};
}

module.exports = {
    routePrefix: routePrefix,
    getApiPath: getApiPath,
    getBasePath: getBasePath,
    getBrowser: getBrowser
};
