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

let $ = require('jquery');
let path = require('path');
//support files
let app = require('../app');
let modals = require('../modals');
//models
let Model = require('../models/model');
let Domain = require('../models/domain');
//views
let DomainView = require('../domain-view/domain-view');
let PageView = require('../pages/base');
//templates
let template = require('../templates/pages/domainEditor.pug');

import initPage from './page.js';

let DomainEditor = PageView.extend({
  template: template,
  events: {
    'click [data-hook=save-to-model]' : 'handleSaveToModel',
    'click [data-hook=save-to-file]' : 'handleSaveToFile',
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search)
    let modelPath = urlParams.has("path") ? urlParams.get("path") : null;
    let domainPath = urlParams.has("domainPath") ? urlParams.get("domainPath") : null;
    let newDomain = urlParams.has("new") ? true : false;
    this.queryStr = modelPath ? `?path=${modelPath}` : "?"
    if(newDomain) {
      if(modelPath) {
        this.queryStr += "&"
      }
      this.queryStr += "new=True"
    }else if(domainPath && domainPath !== "viewing") {
      if(modelPath) {
        this.queryStr += "&"
      }
      this.queryStr += "domain_path=" + domainPath
    }
    let endpoint = path.join(app.getApiPath(), "spatial-model/load-domain") + this.queryStr
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        this.domain = new Domain(body.domain);
        this.domain.directory = domainPath
        this.domain.dirname = newDomain && !modelPath ? domainPath : null
        this.model = this.buildModel(body.model, modelPath);
        this.renderSubviews();
      }
    });
  },
  buildModel: function (modelData, modelPath) {
    if(!modelPath) {
      return null;
    }
    let model = new Model(modelData);
    model.for = "domain";
    model.isPreview = false;
    model.directory = modelPath;
    return model;
  },
  completeAction: function (action) {
    $(this.queryByHook("sd-in-progress")).css("display", "none");
    $(this.queryByHook("sd-action-complete")).text(action);
    $(this.queryByHook("sd-complete")).css("display", "inline-block");
    setTimeout(() => {
      $(this.queryByHook("sd-complete")).css("display", "none");
    }, 5000);
  },
  errorAction: function (action) {
    $(this.queryByHook("sd-in-progress")).css("display", "none");
    $(this.queryByHook("sd-action-error")).text(action);
    $(this.queryByHook("sd-error")).css("display", "block");
  },
  getBreadcrumbData: function () {
    let data = {"project":null, "model":null};
    var projEP = "stochss/project/manager?path="
    var mdlEP = "stochss/models/edit?path="
    if(this.model) {
      data.model = {"name":this.model.name, "href":mdlEP + this.model.directory};
      let dirname = path.dirname(this.model.directory);
      if(dirname.includes(".wkgp")) {
        dirname = path.dirname(dirname);
      }
      if(dirname.endsWith(".proj")) {
        let name = dirname.split("/").pop().split(".proj")[0];
        data.project = {"name":name, "href":projEP + dirname};
      }
      return data;
    }
    if(this.domain.directory.includes(".proj")) {
      let pathEls = this.domain.directory.split("/");
      let proj = pathEls.filter(function (val) {
        return val.endsWith(".proj");
      }).pop();
      let index = pathEls.indexOf(proj) + 1;
      let count = pathEls.length - index;
      pathEls.splice(index, count);
      let projPath = pathEls.join("/");
      data.project = {"name":proj.split(".proj")[0], "href":projEP + projPath};
    }
    return data
  },
  handleSaveToModel: function () {
    if(this.model) {
      this.startAction("Saving domain to model ...");
      this.model.domain = this.domain;
      this.model.saveModel(() => {
        this.completeAction("Domain saved to model");
      });
      window.location.replace(this.getBreadcrumbData().model.href);
    }
  },
  handleSaveToFile: function () {
    this.startAction("Saving the domain to file (.domn) ...")
    if(this.domain.directory && !this.domain.dirname) {
      this.saveDomain()
    }else{
      if(document.querySelector('#newDomainModal')) {
        document.querySelector('#newDomainModal').remove()
      }
      let modal = $(modals.createDomainHtml()).modal();
      let okBtn = document.querySelector('#newDomainModal .ok-model-btn');
      let input = document.querySelector('#newDomainModal #domainNameInput');
      input.addEventListener("keyup", (event) => {
        if(event.keyCode === 13){
          event.preventDefault();
          okBtn.click();
        }
      });
      input.addEventListener("input", (e) => {
        let endErrMsg = document.querySelector('#newDomainModal #domainNameInputEndCharError')
        let charErrMsg = document.querySelector('#newDomainModal #domainNameInputSpecCharError')
        let error = app.validateName(input.value)
        okBtn.disabled = error !== "" || input.value.trim() === ""
        charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
        endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
      });
      okBtn.addEventListener('click', (e) => {
        if (Boolean(input.value)) {
          modal.modal('hide')
          let name = input.value.trim()
          this.saveDomain({name: name});
        }
      });
    }
  },
  renderDomainView: function () {
    if(this.doaminView) {
      this.domainView.remove();
    }
    this.domainView = new DomainView({
      model: this.domain,
      queryStr: this.queryStr
    });
    app.registerRenderSubview(this, this.domainView, "domain-view-container");
  },
  renderSubviews: function () {
    let breadData = this.getBreadcrumbData();
    if(breadData.model && breadData.project) {
      $(this.queryByHook("two-parent-breadcrumb-links")).css("display", "block");
      let projBC = $(this.queryByHook("grandparent-breadcrumb"));
      projBC.text(breadData.project.name);
      projBC.prop("href", breadData.project.href);
      $(this.queryByHook("return-to-project")).prop("href", breadData.project.href);
      let mdlBC = $(this.queryByHook("parent-two-breadcrumb"));
      mdlBC.text(breadData.model.name);
      mdlBC.prop("href", breadData.model.href);
      $(this.queryByHook("return-to-model")).prop("href", breadData.model.href);
    }else if(breadData.model || breadData.project) {
      $(this.queryByHook("one-parent-breadcrumb-links")).css("display", "block");
      let breadcrumb = $(this.queryByHook("parent-one-breadcrumb"));
      if(breadData.project) {
        breadcrumb.text(breadData.project.name)
        breadcrumb.prop("href", breadData.project.href);
        $(this.queryByHook("return-to-project")).prop("href", breadData.project.href);
        $(this.queryByHook("return-to-model")).css("display", "none");
      }else {
        breadcrumb.text(breadData.model.name)
        breadcrumb.prop("href", breadData.model.href);
        $(this.queryByHook("return-to-project")).css("display", "none");
        $(this.queryByHook("return-to-model")).prop("href", breadData.model.href);
      }
    }else{
      $(this.queryByHook("return-to-model")).css("display", "none");
      $(this.queryByHook("return-to-project")).css("display", "none");
    }
    this.renderDomainView();
    app.documentSetup();
    if(!this.model) {
      $(this.queryByHook("save-to-model")).addClass("disabled")
    }
  },
  saveDomain: function ({name=null}={}) {
    let domain = this.domain.toJSON();
    if(name) {
      let file = `${name}.domn`;
      var dirname = this.model ? path.dirname(this.model.directory) : this.domain.dirname;
      var domainPath = dirname === "/" ? file : path.join(dirname, file);
    }else{
      var domainPath = this.domain.directory;
    }
    let endpoint = path.join(app.getApiPath(), "file/json-data") + `?path=${domainPath}`;
    app.postXHR(endpoint, domain, {
      success: (err, response, body) => {
        this.completeAction("Domain save to file (.domn)");
      },
      error: (err, response, body) => {
        this.errorAction(body.Message);
      }
    });
  },
  startAction: function (action) {
    $(this.queryByHook("sd-complete")).css("display", "none");
    $(this.queryByHook("sd-error")).css("display", "none");
    $(this.queryByHook("sd-action-in-progress")).text(action);
    $(this.queryByHook("sd-in-progress")).css("display", "inline-block");
  }
});

initPage(DomainEditor);
