/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
  try {
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
  }catch(exception){
    console.log(exception);
    let response = {Reason: "Network Error", Message: exception};
    let body = {response: response, err: exception}
    error(exception, response, body);
  }
};

let postXHR = (endpoint, data, {
  always = function (err, response, body) {}, success = function (err, response, body) {},
  error = function (err, response, body) {}}={}, isJSON) => {
  try {
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
  }catch(exception){
    console.log(exception);
    let response = {Reason: "Network Error", Message: exception};
    let body = {response: response, err: exception}
    error(exception, response, body);
  }
};

let getBrowser = () => {
  BrowserDetect.init();
  return {"name":BrowserDetect.browser,"version":BrowserDetect.version};
}

let validateName = (input, {rename=false, saveAs=true}={}) => {
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
  let typeCodes = {
    "Ensemble Simulation": "_ES",
    "Spatial Ensemble Simulation": "_SES",
    "Parameter Sweep": "_PS",
    "Model Inference": "_MI"
  }
  let self = parent;
  let ext = isSpatial ? /.smdl/g : /.mdl/g
  let typeCode = typeCodes[type];
  let name = mdlPath.split('/').pop().replace(ext, typeCode)
  let modal = $(modals.createWorkflowHtml(name, type)).modal();
  let okBtn = document.querySelector('#newWorkflowModal .ok-model-btn');
  let input = document.querySelector('#newWorkflowModal #workflowNameInput');
  okBtn.disabled = false;
  input.addEventListener("keyup", (event) => {
    if(event.keyCode === 13){
      event.preventDefault();
      okBtn.click();
    }
  });
  input.addEventListener("input", (e) => {
    let endErrMsg = document.querySelector('#newWorkflowModal #workflowNameInputEndCharError')
    let charErrMsg = document.querySelector('#newWorkflowModal #workflowNameInputSpecCharError')
    let error = validateName(input.value)
    okBtn.disabled = error !== "" || input.value.trim() === ""
    charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
    endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
  });
  okBtn.addEventListener('click', (e) => {
    modal.modal("hide");
    let wkflFile = `${input.value.trim()}.wkfl`;
    if(mdlPath.includes(".proj") && !mdlPath.includes(".wkgp")){
      var wkflPath = path.join(path.dirname(mdlPath), "WorkflowGroup1.wkgp", wkflFile);
    }else{
      var wkflPath = path.join(path.dirname(mdlPath), wkflFile);
    }
    let queryString = `?path=${wkflPath}&model=${mdlPath}&type=${type}`;
    let endpoint = path.join(getApiPath(), "workflow/new") + queryString;
    getXHR(endpoint, {
      success: (err, response, body) => {
        window.location.href = `${path.join(getBasePath(), "stochss/workflow/edit")}?path=${body.path}`;
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
  fullURL = window.location.protocol + '//' + window.location.hostname + text;
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", fullURL);
  }
  else {
    navigator.clipboard.writeText(fullURL).then(success, error)
  }
}

let switchToEditTab = (view, section) => {
  let elementID = Boolean(view.model && view.model.elementID) ? view.model.elementID + "-" : "";
  if($(view.queryByHook(elementID + 'view-' + section)).hasClass('active')) {
    $(view.queryByHook(elementID + section + '-edit-tab')).tab('show');
    $(view.queryByHook(elementID + 'edit-' + section)).addClass('active');
    $(view.queryByHook(elementID + 'view-' + section)).removeClass('active');
  }
}

let maintenance = (view) => {
  getXHR("stochss/api/message", {
    always: (err, response, body) => {
      if(body.messages.length === 0) { console.log(null) }
      var html = ``;
      body.messages.forEach((data) => {
        let styles = {
          "primary": "background-color: rgba(0, 123, 255, 0.5) !important;",
          "secondary": "background-color: rgba(108, 117, 125, 0.5) !important;",
          "light": "background-color: rgba(248, 249, 250, 0.5) !important;",
          "dark": "background-color: rgba(52, 58, 64, 0.5) !important;",
          "success": "background-color: rgba(40, 167, 69, 0.5) !important;",
          "info": "background-color: rgba(23, 162, 184, 0.5) !important;",
          "warning": "background-color: rgba(255, 193, 7, 0.5) !important;",
          "danger": "background-color: rgba(220, 53, 69, 0.5) !important;"
        }
        if(data.start) {
          let s_date = new Date(data.start);
          let day = new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(s_date);
          let mon = new Intl.DateTimeFormat('en-US', {month: 'short'}).format(s_date);
          let s_day = `${day} ${mon} ${s_date.getDate()} ${s_date.getFullYear()}`;
          data.message = data.message.replace("__DATE__", s_day);

          let tz = s_date.toString().split('(').pop().split(')')[0];
          var minutes = s_date.getMinutes() < 10 ? `0${s_date.getMinutes()}` : s_date.getMinutes();
          let m_start = `${s_date.getHours()}:${minutes} ${tz}`;
          data.message = data.message.replace("__START__", m_start);
        }
        if(data.end) {
          let e_date = new Date(data.end);
          let day = new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(e_date);
          let mon = new Intl.DateTimeFormat('en-US', {month: 'short'}).format(e_date);
          let e_day = `${day} ${mon} ${e_date.getDate()} ${e_date.getFullYear()}`;
          data.message = data.message.replace("__DATE__", e_day);

          let tz = e_date.toString().split('(').pop().split(')')[0];
          var minutes = e_date.getMinutes() < 10 ? `0${e_date.getMinutes()}` : e_date.getMinutes();
          let m_end = `${e_date.getHours()}:${minutes} ${tz}`;
          data.message = data.message.replace("__END__", m_end);
        }
        if(!data.style) {
          var style = styles.warning;
        }else if(Object.keys(styles).includes(data.style)) {
          var style = styles[data.style];
        }else {
          var style = data.style;
        }
        html += `<h4 class='display-5 mt-2' style='${style}'>${data.message}</h4>`;
      });
      $(view.queryByHook('message-to-users')).html(html);
    }
  });
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
    copyToClipboard: copyToClipboard,
    switchToEditTab: switchToEditTab,
    validateName: validateName,
    maintenance: maintenance
};


