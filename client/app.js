/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
let xhr = require('xhr');
let $ = require('jquery');
let path = require('path');
//support files
let modals = require('./modals');

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

let changeCollapseButtonText = (view, e) => {
  let source = e.target.dataset.hook;
  let isBtn = $(view.queryByHook(source)).attr("class").includes("btn");
  let collapseContainer = $(view.queryByHook(source).dataset.target);
  if(isBtn && !collapseContainer.attr("class").includes("collapsing")) {
    let collapseBtn = $(view.queryByHook(source));
    let text = collapseBtn.text();
    text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
  }
};

let registerRenderSubview = (parent, view, hook) => {
  parent.registerSubview(view);
  parent.renderSubview(view, parent.queryByHook(hook));
};

let getXHR = (endpoint, {
  always = function (err, response, body) {}, success = function (err, response, body) {},
  error = function (err, response, body) {}}={}) => {
  xhr({uri: endpoint, json: true}, function (err, response, body) {
    if(response.statusCode < 400) {
      success(err, response, body);
    }else if(response.statusCode < 500) {
      error(err, response, body);
    }else{
      console.log("Critical Error Detected");
    }
    always(err, response, body);
  });
};

let postXHR = (endpoint, data, {
  always = function (err, response, body) {}, success = function (err, response, body) {},
  error = function (err, response, body) {}}={}, isJSON) => {
  xhr({uri: endpoint, json: isJSON !== undefined ? isJSON : true, method: "post", body: data}, function (err, response, body) {
    if(response.statusCode < 400) {
      success(err, response, body);
    }else if(response.statusCode < 500) {
      error(err, response, body);
    }else{
      console.log("Critical Error Detected");
    }
    always(err, response, body);
  });
};

let getBrowser = () => {
  BrowserDetect.init();
  return {"name":BrowserDetect.browser,"version":BrowserDetect.version};
}

let validateName = (input, {rename=false, saveAs=true}={}) {
  var error = "";
  if(input.endsWith('/')) {
    error = 'forward';
  }
  var invalidChars = "`~!@#$%^&*=+[{]}\"|:;'<,>?\\";
  if(rename || !saveAs) {
    invalidChars += "/";
  }
  for(var i = 0; i < input.length; i++) {
    if(invalidChars.includes(input.charAt(i))) {
      error = error === "" || error === "special" ? "special" : "both";
    }
  }
  return error;
}

let newWorkflow = (parent, mdlPath, isSpatial, type) => {
  if(document.querySelector('#newWorkflowModal')) {
    document.querySelector('#newWorkflowModal').remove()
  }
  let self = parent;
  let ext = isSpatial ? /.smdl/g : /.mdl/g
  let typeCode = type === "Ensemble Simulation" ? "_ES" : "_PS";
  let name = mdlPath.split('/').pop().replace(ext, typeCode)
  let modal = $(modals.newWorkflowHtml(name, type)).modal();
  let okBtn = document.querySelector('#newWorkflowModal .ok-model-btn');
  let input = document.querySelector('#newWorkflowModal #workflowNameInput');
  okBtn.disabled = false;
  input.addEventListener("keyup", function (event) {
    if(event.keyCode === 13){
      event.preventDefault();
      okBtn.click();
    }
  });
  input.addEventListener("input", function (e) {
    let endErrMsg = document.querySelector('#newWorkflowModal #workflowNameInputEndCharError')
    let charErrMsg = document.querySelector('#newWorkflowModal #workflowNameInputSpecCharError')
    let error = validateName(input.value)
    okBtn.disabled = error !== "" || input.value.trim() === ""
    charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
    endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
  });
  okBtn.addEventListener('click', function (e) {
    modal.modal("hide");
    let wkflFile = input.value.trim() + ".wkfl";
    if(mdlPath.includes(".proj") && !mdlPath.includes(".wkgp")){
      var wkflPath = path.join(path.dirname(mdlPath), "WorkflowGroup1.wkgp", wkflFile);
    }else{
      var wkflPath = path.join(path.dirname(mdlPath), wkflFile);
    }
    let queryString = "?path=" + wkflPath + "&model=" + mdlPath + "&type=" + type;
    let endpoint = path.join(getApiPath(), "workflow/new") + queryString;
    getXHR(endpoint, {
      success: function (err, response, body) {
        window.location.href = path.join(getBasePath(), "stochss/workflow/edit") + "?path=" + body.path;
      }
    });
  });
}

tooltipSetup = () => {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="tooltip"]').on('click ', function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
     });
  });
}

documentSetup = () => {
  tooltipSetup();
  $(document).on('shown.bs.modal', function (e) {
    $('[autofocus]', e.target).focus();
  });
  $(document).on('hide.bs.modal', '.modal', function (e) {
    e.target.remove();
  });
}

copyToClipboard = (text, success, error) => {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", text);
  }
  else {
    navigator.clipboard.writeText(text).then(success, error)
  }
}

module.exports = {
    routePrefix: routePrefix,
    getApiPath: getApiPath,
    getBasePath: getBasePath,
    getBrowser: getBrowser,
    registerRenderSubview: registerRenderSubview,
    changeCollapseButtonText: changeCollapseButtonText,
    newWorkflow: newWorkflow,
    getXHR: getXHR,
    postXHR: postXHR,
    tooltipSetup: tooltipSetup,
    documentSetup: documentSetup,
    copyToClipboard: copyToClipboard
};


