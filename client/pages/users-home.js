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

let $ = require('jquery');
let path = require('path');
//support files
let app = require('../app');
let modals = require('../modals');
//views
let PageView = require('./base');
//templates
let template = require('../templates/pages/usersHome.pug');

import initPage from './page.js';

let usersHomePage = PageView.extend({
  template: template,
  events: {
    'click [data-hook=new-model-btn]' : 'handleNewModelClick',
    'click [data-hook=new-project-btn]' : 'handleNewProjectClick',
    'click [data-hook=browse-projects-btn]' : 'handleBrowseProjectsClick',
    'click [data-hook=browse-files-btn]' : 'handleBrowseFilesClick',
    'click [data-hook=quickstart-btn]' : 'handleQuickstartClick'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    let urlParams = new URLSearchParams(window.location.search)
    if(urlParams.has("open")){
      let queryString = "?path=" + urlParams.get("open") + "&action=open";
      let endpoint = path.join(app.getBasePath(), 'stochss/loading-page') + queryString;
      window.location.href = endpoint;
    }
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments);
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
    });
  },
  validateName(input) {
    var error = ""
    if(input.endsWith('/')) {
      error = 'forward'
    }
    let invalidChars = "`~!@#$%^&*=+[{]}\"|:;'<,>?\\"
    for(var i = 0; i < input.length; i++) {
      if(invalidChars.includes(input.charAt(i))) {
        error = error === "" || error === "special" ? "special" : "both"
      }
    }
    return error
  },
  handleNewModelClick: function (e) {
    let self = this
    if(document.querySelector("#newModalModel")) {
      document.querySelector("#newModalModel").remove()
    }
    let modal = $(modals.renderCreateModalHtml(true, false)).modal()
    let okBtn = document.querySelector("#newModalModel .ok-model-btn")
    let input = document.querySelector("#newModalModel #modelNameInput")
    input.focus()
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newModalModel #modelNameInputEndCharError')
      var charErrMsg = document.querySelector('#newModalModel #modelNameInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== "" || input.value.trim() === ""
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)){
        modal.modal('hide')
        let modelPath = input.value + '.mdl'
        let queryString = "?path="+modelPath
        let existEP = path.join(app.getApiPath(), "model/exists")+queryString
        app.getXHR(existEP, {
          always: function (err, response, body) {
            if(body.exists) {
              let title = "Model Already Exists";
              let message = "A model already exists with that name";
              let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(title, message)).modal();
            }else{
              let endpoint = path.join(app.getBasePath(), "stochss/models/edit")+queryString;
              self.navToPage(endpoint);
            }
          }
        });
      }
    });
  },
  handleNewProjectClick: function (e) {
    let self = this
    if(document.querySelector("#newProjectModal")) {
      document.querySelector("#newProjectModal").remove()
    }
    let modal = $(modals.newProjectModalHtml()).modal()
    let okBtn = document.querySelector("#newProjectModal .ok-model-btn")
    let input = document.querySelector("#newProjectModal #projectNameInput")
    input.focus()
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newProjectModal #projectNameInputEndCharError')
      var charErrMsg = document.querySelector('#newProjectModal #projectNameInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== "" || input.value.trim() === ""
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        modal.modal('hide')
        let projectPath = input.value + ".proj"
        let queryString = "?path="+projectPath
        let endpoint = path.join(app.getApiPath(), "project/new-project")+queryString
        app.getXHR(endpoint, {
          success: function (err, response, body) {
            let projectQS = "?path="+body.path;
            let projectEP = path.join(app.getBasePath(), "stochss/project/manager")+projectQS;
            self.navToPage(projectEP);
          },
          error: function (err, response, body) {
            let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(body.Reason, body.Message)).modal();
          }
        });
      }
    });
  },
  handleBrowseProjectsClick: function (e) {
    let endpoint = path.join(app.getBasePath(), "stochss/project/browser")
    this.navToPage(endpoint)
  },
  handleBrowseFilesClick: function (e) {
    let endpoint = path.join(app.getBasePath(), "stochss/files")
    this.navToPage(endpoint)
  },
  handleQuickstartClick: function (e) {
    let endpoint = path.join(app.getBasePath(), "stochss/quickstart")
    this.navToPage(endpoint)
  },
  navToPage: function (endpoint) {
    window.location.href = endpoint
  }
});

initPage(usersHomePage);