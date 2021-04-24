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

let xhr = require('xhr');
let $ = require('jquery');
let path = require('path');
//support files
let app = require('../app');
let modals = require('../modals');
// views
var PageView = require('./base');
// templates
var template = require('../templates/pages/loadingPage.pug');

import initPage from './page.js';

let LoadingPage = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let urlParams = new URLSearchParams(window.location.search)
    this.filePath = urlParams.get("path");
    this.action = urlParams.get("action");
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
    $(document.querySelector("div[data-hook=side-navbar]")).css("display", "none");
    $(document.querySelector("main[data-hook=page-main]")).removeClass().addClass("col-md-12 body");
    $(this.queryByHook("loading-spinner")).css("display", "block");
    if(this.action === "open") {
      this.uploadFileFromLink(this.filePath);
    }else if(this.action === "update-workflow") {
      this.updateWorkflowFormat(this.filePath);
    }else if(this.action === "update-project") {
      this.updateProjectFormat(this.filePath);
    }
  },
  getUploadResponse: function () {
    let self = this;
    setTimeout(function () {
      let queryStr = "?path=" + self.responsePath + "&cmd=read";
      let endpoint = path.join(app.getApiPath(), 'file/upload-from-link') + queryStr;
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode >= 400 || Object.keys(body).includes("reason")) {
          $(this.queryByHook("loading-spinner")).css("display", "none");
          let model = $(modals.projectExportErrorHtml(body.reason, body.message)).modal();
          let close = document.querySelector("button[data-dismiss=modal]");
          close.addEventListener("click", function (e) {
            window.history.back();
          });
        }else if(body.done) {
          if(body.file_path.endsWith(".proj")){
            self.openStochSSPage("stochss/project/manager", body.file_path);
          }else if(body.file_path.endsWith(".wkfl")){
            self.openStochSSPage("stochss/workflow/edit", body.file_path);
          }else if(body.file_path.endsWith(".mdl")){
            self.openStochSSPage("stochss/models/edit", body.file_path);
          }else if(body.file_path.endsWith(".domn")){
            self.openStochSSPage("stochss/domain/edit", body.file_path);
          }else if(body.file_path.endsWith(".ipynb")){
            self.openNotebookFile(body.file_path);
          }else{
            self.openStochSSPage('stochss/files');
          }
        }else{
          self.getUploadResponse();
        }
      })
    }, 1000);
  },
  openNotebookFile: function (filePath) {
    window.open(path.join(app.getBasePath(), "notebooks", filePath));
    window.history.back();
  },
  openStochSSPage: function (identifier, filePath) {
    var endpoint = path.join(app.getBasePath(), identifier);
    if(filePath) {
      let query = identifier.includes("domain") ? "?domainPath=" : "?path=";
      endpoint += query + filePath;
    }
    window.location.href = endpoint;
  },
  updateFormat: function (filePath, message, target, identifier) {
    $(this.queryByHook("loading-header")).html("Updating Format");
    $(this.queryByHook("loading-target")).html(filePath.split('/').pop());
    $(this.queryByHook("loading-message")).html(message);
    let self = this;
    let queryStr = "?path=" + filePath;
    let endpoint = path.join(app.getApiPath(), target, "update-format") + queryStr;
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        let dst = target === "workflow" ? body : filePath;
        self.openStochSSPage(identifier, dst);
      }
    });
  },
  updateProjectFormat: function (filePath) {
    let message = `You can update the format of any project and its workflows by opening the project and clicking yes when prompted to update the format.`;
    let identifier = "stochss/project/manager"
    this.updateFormat(filePath, message, "project", identifier);
  },
  updateWorkflowFormat: function (filePath) {
    let message = `You can update the format of any workflow by opening the workflow and clicking yes when prompted to update the format.`;
    let identifier = "stochss/workflow/edit"
    this.updateFormat(filePath, message, "workflow", identifier);
  },
  uploadFileFromLink: function (filePath) {
    $(this.queryByHook("loading-header")).html("Uploading file");
    $(this.queryByHook("loading-target")).html(filePath.split('/').pop());
    let message = `If the file is a Project, Workflow, Model, Domain, or Notebook it will be opened when the upload has completed.`;
    $(this.queryByHook("loading-message")).html(message);
    let self = this;
    let queryStr = "?path=" + filePath;
    let endpoint = path.join(app.getApiPath(), 'file/upload-from-link') + queryStr;
    xhr({uri:endpoint, json:true}, function (err, response, body) {
      if(response.statusCode < 400) {
        self.responsePath = body.responsePath;
        self.getUploadResponse();
      }
    });
  }
});

initPage(LoadingPage);
