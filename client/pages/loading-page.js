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
    let path = urlParams.get("path");
    let action = urlParams.get("action");
    if(action === "open") {
      this.uploadFileFromLink(path);
    }else if(action === "update-workflow") {
      console.log("TODO: Launch workflow upadte api request")
    }else if(action === "update-project") {
      console.log("TODO: Launch project upadte api request")
    }
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
    $(document.querySelector("div[data-hook=side-navbar]")).css("display", "none");
    $(document.querySelector("main[data-hook=page-main]")).removeClass().addClass("col-md-12 body");
    $(this.queryByHook("loading-spinner")).css("display", "block");
  },
  getUploadResponse: function () {
    let self = this;
    setTimeout(function () {
      let queryStr = "?path=" + self.responsePath + "&cmd=read";
      let endpoint = path.join(app.getApiPath(), 'file/upload-from-link') + queryStr;
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode >= 400 || Object.keys(body).includes("reason")) {
          let model = $(modals.projectExportErrorHtml(body.reason, body.message)).modal();
        }else if(body.done) {
          if(body.file_path.endsWith(".proj")){
            self.openStochSSFile("stochss/project/manager", body.file_path);
          }else if(body.file_path.endsWith(".mdl")){
            self.openStochSSFile("stochss/models/edit", body.file_path);
          }else if(body.file_path.endsWith(".ipynb")){
            self.openNotebookFile(body.file_path);
          }
        }else{
          self.getUploadResponse();
        }
      })
    }, 1000);
  },
  openNotebookFile: function (path) {
    window.open(path.join(app.getBasePath(), "notebooks", path));
    window.history.back();
  },
  openStochSSFile: function (identifier, path) {
    window.location.href = path.join(app.getBasePath(), identifier) + "?path=" + path;
  },
  uploadFileFromLink: function (path) {
    $(this.queryByHook("loading-header")).text("Uploading file: " + path.split('/').pop());
    let message = `If the file is a Project, Workflow, Model, Domain, or Notebook it will be opened when the upload has completed.`
    $(this.queryByHook("loading-message")).text(message)
    let self = this;
    let queryStr = "?path=" + path;
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
