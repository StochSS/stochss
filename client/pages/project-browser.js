let $ = require('jquery');
let path = require('path');
let xhr = require('xhr');
//support files
let app = require('../app');
let modals = require('../modals');
//models
let Project = require('../models/project');
//collections
let Collection = require('ampersand-collection');
//views
var PageView = require('./base');
let EditProjectView = require('../views/edit-project');
//templates
var template = require('../templates/pages/projectBrowser.pug');

import initPage from './page.js';

let projectBrowser = PageView.extend({
  template: template,
  events: {
    'click [data-hook=new-project-btn]' : 'handleNewProjectClick'
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    let self = this
    let endpoint = path.join(app.getApiPath(), "project/load-browser")
    xhr({uri:endpoint, json:true}, function (err, response, body) {
      if(response.statusCode < 400) {
        self.projects = body.projects
        self.renderProjectsView()
      }
    });
  },
  render: function (attrs, options) {
    PageView.prototype.render.apply(this, arguments)
  },
  renderProjectsView: function () {
    if(this.projectsView) {
      this.projectsView.remove()
    }
    let projects = new Collection(this.projects, {model: Project, comparator: 'parentDir'})
    this.projectsView = this.renderCollection(projects, EditProjectView, this.queryByHook("projects-view-container"))
  },
  handleNewProjectClick: function (e) {
    let self = this
    if(document.querySelector("#newProjectModal")) {
      document.querySelector("#newProjectModal").remove()
    }
    let modal = $(modals.newProjectModalHtml()).modal()
    let input = document.querySelector("#newProjectModal #projectNameInput")
    input.focus()
    let okBtn = document.querySelector("#newProjectModal .ok-model-btn")
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        modal.modal('hide')
        let projectPath = input.value.trim() + ".proj"
        let endpoint = path.join(app.getApiPath(), "project/new-project")+"?path="+projectPath
        xhr({uri:endpoint, json:true}, function (err, response, body) {
          if(response.statusCode < 400) {
            window.location.href = path.join(app.getBasePath(), "stochss/project/manager")+"?path="+body.path
          }else{
            let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(body.Reason, body.Message)).modal()
          }
        })
      }
    });
  }
});

initPage(projectBrowser);