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
//models
let Project = require('../models/project');
//collections
let Collection = require('ampersand-collection');
//views
let PageView = require('./base');
let EditProjectView = require('../views/edit-project');
//templates
let template = require('../templates/pages/projectBrowser.pug');

import initPage from './page.js';

let projectBrowser = PageView.extend({
  template: template,
  events: {
    'click [data-hook=new-project-btn]' : 'handleNewProjectClick'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    let self = this;
    let endpoint = path.join(app.getApiPath(), "project/load-browser");
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        self.projects = body.projects;
        self.renderProjectsView();
      }
    });
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments)
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
    });
  },
  handleNewProjectClick: function (e) {
    let self = this;
    if(document.querySelector("#newProjectModal")) {
      document.querySelector("#newProjectModal").remove();
    }
    let modal = $(modals.newProjectModalHtml()).modal();
    let input = document.querySelector("#newProjectModal #projectNameInput");
    input.focus();
    let okBtn = document.querySelector("#newProjectModal .ok-model-btn");
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newProjectModal #projectNameInputEndCharError');
      var charErrMsg = document.querySelector('#newProjectModal #projectNameInputSpecCharError');
      let error = self.validateName(input.value);
      okBtn.disabled = error !== "";
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none";
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none";
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        modal.modal('hide');
        let projectPath = input.value.trim() + ".proj";
        let endpoint = path.join(app.getApiPath(), "project/new-project") + "?path=" + projectPath;
        app.getXHR(endpoint, {
          success: function (err, response, body) {
            window.location.href = path.join(app.getBasePath(), "stochss/project/manager")+"?path="+body.path;
          },
          error: function (err, response, body) {
            let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(body.Reason, body.Message)).modal();
          }
        });
      }
    });
  },
  renderProjectsView: function () {
    if(this.projectsView) {
      this.projectsView.remove()
    }
    let projects = new Collection(this.projects, {model: Project, comparator: 'parentDir'})
    this.projectsView = this.renderCollection(projects, EditProjectView, this.queryByHook("projects-view-container"))
  },
  validateName(input) {
    var error = "";
    if(input.endsWith('/')) {
      error = 'forward';
    }
    let invalidChars = "`~!@#$%^&*=+[{]}\"|:;'<,>?\\";
    for(var i = 0; i < input.length; i++) {
      if(invalidChars.includes(input.charAt(i))) {
        error = error === "" || error === "special" ? "special" : "both";
      }
    }
    return error;
  }
});

initPage(projectBrowser);
