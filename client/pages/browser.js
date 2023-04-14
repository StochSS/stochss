/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
//collections
let Collection = require('ampersand-collection'); // form presentation browser
//model
let Project = require('../models/project'); // from project browser
let Presentation = require('../models/presentation'); // form presentation browser
//views
let PageView = require('./base');
let EditProjectView = require('../views/edit-project'); // from project browser
let PresentationView = require('../views/presentation-view'); // form presentation browser
let JSTreeView = require('../views/jstree-view');
//templates
let template = require('../templates/pages/browser.pug');

import initPage from './page.js';

let FileBrowser = PageView.extend({
  pageTitle: 'StochSS | File Browser',
  template: template,
  events: {
    'click [data-hook=file-browser-help]' : function () {
      let modal = $(modals.operationInfoModalHtml('file-browser')).modal();
    },
    'click [data-hook=collapse-projects]' : 'changeCollapseButtonText',
    'click [data-hook=new-project-btn]' : 'handleNewProjectClick',
    'click [data-hook=collapse-presentations]' : 'changeCollapseButtonText',
    'click [data-hook=collapse-files]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments)
    window.addEventListener('pageshow', (e) => {
      let navType = window.performance.navigation.type;
      if(navType === 2){
        window.location.reload();
      }
    });
    app.documentSetup();
    this.getProjects();
    if(app.getBasePath() === "/") {
      $("#presentations").css("display", "none");
    }else{
      this.getPresentations();
    }
    this.renderJSTreeView();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  getPresentations: function () {
    let endpoint = path.join(app.getApiPath(), "file/presentations");
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        this.renderPresentationView(body.presentations);
      }
    });
  },
  getProjects: function () {
    let endpoint = path.join(app.getApiPath(), "project/load-browser");
    app.getXHR(endpoint, {
      success: (err, response, body) => {
        this.renderProjectsView(body.projects);
      }
    });
  },
  handleNewProjectClick: function (e) {
    if(document.querySelector("#newProjectModal")) {
      document.querySelector("#newProjectModal").remove();
    }
    let modal = $(modals.createProjectHtml()).modal();
    let input = document.querySelector("#newProjectModal #projectNameInput");
    let okBtn = document.querySelector("#newProjectModal .ok-model-btn");
    input.focus();
    input.addEventListener("keyup", (event) => {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    input.addEventListener("input", (e) => {
      let endErrMsg = document.querySelector('#newProjectModal #projectNameInputEndCharError');
      let charErrMsg = document.querySelector('#newProjectModal #projectNameInputSpecCharError');
      let error = app.validateName(input.value);
      okBtn.disabled = error !== "";
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none";
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none";
    });
    okBtn.addEventListener("click", (e) => {
      modal.modal('hide');
      let queryStr = `?path=${input.value.trim()}.proj`;
      let endpoint = path.join(app.getApiPath(), "project/new-project") + queryStr;
      app.getXHR(endpoint, {
        success: (err, response, body) => {
          let queryStr = `?path=${body.path}`;
          window.location.href = path.join(app.getBasePath(), "stochss/project-manager") + queryStr;
        },
        error: (err, response, body) => {
          if(document.querySelector("#errorModal")) {
            document.querySelector("#errorModal").remove();
          }
          let errorModal = $(modals.errorHtml(body.Reason, body.Message)).modal();
        }
      });
    });
  },
  renderJSTreeView: function () {
    if(this.jstreeView) {
      this.jstreeView.remove();
    }
    this.jstreeView = new JSTreeView({
      configKey: "file"
    });
    app.registerRenderSubview(this, this.jstreeView, "jstree-view-container");
  },
  renderPresentationView: function (presentations) {
    if(this.presentationsView) {
      this.presentationsView.remove();
    }
    let options = {model: Presentation};
    let presentCollection = new Collection(presentations, options);
    this.presentationsView = this.renderCollection(
      presentCollection,
      PresentationView,
      this.queryByHook("presentation-list")
    );
    let href = window.location.href;
    if(href.includes("#file-browser-section")) {
      location.href = "stochss/browser#file-browser-section";
    }
  },
  renderProjectsView: function (projects) {
    if(this.projectsView) {
      this.projectsView.remove();
    }
    let options = {model: Project, comparator: 'parentDir'};
    let projectCollection = new Collection(projects, options);
    this.projectsView = this.renderCollection(
      projectCollection,
      EditProjectView,
      this.queryByHook("projects-view-container")
    );
    let href = window.location.href;
    if(href.includes("#file-browser-section")) {
      location.href = "stochss/browser#file-browser-section";
    }else if(href.includes("#presentation-browser-section")) {
      location.href = "stochss/browser#presentation-browser-section";
    }
  },
  update: function (target) {
    if(target === "Projects") {
      this.getProjects();
    }else if(target === "Files") {
      this.jstreeView.refreshJSTree(null);
    }else if(target === "Presentations") {
      this.getPresentations();
    }
  }
});

initPage(FileBrowser);
