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
    this.homeLink = path.join(app.getBasePath(), 'stochss/home');
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
    let self = this;
    $(document.querySelector("div[data-hook=side-navbar]")).css("display", "none");
    $(document.querySelector("main[data-hook=page-main]")).removeClass().addClass("col-md-12 body");
    $(this.queryByHook("loading-spinner")).css("display", "block");
    if(this.action === "open") {
      this.checkForDuplicateFile(this.filePath);
    }else if(this.action === "update-workflow") {
      this.updateWorkflowFormat(this.filePath);
    }else if(this.action === "update-project") {
      this.updateProjectFormat(this.filePath);
    }
  },
  checkForDuplicateFile: function (filePath) {
    $(this.queryByHook("loading-header")).html("Uploading file");
    $(this.queryByHook("loading-target")).css("display", "none")
    let message = `If the file is a Project, Workflow, Model, Domain, or Notebook it will be opened when the upload has completed.`;
    $(this.queryByHook("loading-message")).html(message);
    let self = this;
    let queryStr = "?path=" + filePath + "&cmd=validate";
    let endpoint = path.join(app.getApiPath(), 'file/upload-from-link') + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        if(!body.exists) {
          self.uploadFileFromLink(filePath, false);
        }else{
          let title = "File Already Exists";
          let message = "A file with that name already exists, do you wish to overwrite this file?";
          let modal = $(modals.uploadFileExistsHtml(title, message)).modal();
          let yesBtn = document.querySelector("#uploadFileExistsModal .yes-modal-btn");
          let noBtn = document.querySelector("#uploadFileExistsModal .btn-secondary")
          yesBtn.addEventListener('click', function (e) {
            self.uploadFileFromLink(filePath, true);
          });
          noBtn.addEventListener('click', function (e) {
            window.location.href = self.homeLink;
          });
        }
      }
    });
  },
  getUploadResponse: function () {
    let self = this;
    setTimeout(function () {
      let queryStr = "?path=" + self.responsePath + "&cmd=read";
      let endpoint = path.join(app.getApiPath(), 'file/upload-from-link') + queryStr;
      let errorCB = function (err, response, body) {
        if(document.querySelector("#errorModal")) {
          document.querySelector("#errorModal").remove();
        }
        $(self.queryByHook("loading-spinner")).css("display", "none");
        let modal = $(modals.errorHtml(body.reason, body.message)).modal();
        modal.on('hidden.bs.modal', function (e) {
          window.location.href = this.homeLink;
        });
      }
      app.getXHR(endpoint, {
        success: function (err, response, body) {
          if(Object.keys(body).includes("reason")) {
            errorCB(err, response, body);
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
        },
        error: errorCB
      });
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
    app.getXHR(endpoint, {
      success: function (err, response, body) {
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
  uploadFileFromLink: function (filePath, overwrite) {
    setTimeout(function () {
      $(self.queryByHook("loading-problem").css("display", "block"));
    }, 30000);
    let self = this;
    var queryStr = "?path=" + filePath;
    if(overwrite) {
      queryStr += "&overwrite=" + overwrite;
    }
    let endpoint = path.join(app.getApiPath(), 'file/upload-from-link') + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.responsePath = body.responsePath;
        self.getUploadResponse();
      }
    });
  }
});

initPage(LoadingPage);
