//support files
var app = require('../app');
var modals = require('../modals');
//views
var PageView = require('./base');
var ProjectViewer = require('../views/project-viewer');
var FileBrowser = require('../views/file-browser-view');
//models
var Project = require('../models/project');
//templates
var template = require('../templates/pages/projectManager.pug');

import initPage from './page.js'

let ProjectManager = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    let self = this
    this.url = decodeURI(document.URL)
    let urlParams = new URLSearchParams(window.location.search)
    this.projectPath = urlParams.get('path')
    this.projectName = this.projectPath.split('/').pop().split('.')[0]
    this.model = new Project({
      directory: self.projectPath
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews()
      }
    });
  },
  renderSubviews: function () {
    this.renderProjectViewer();
    this.renderProjectFileBrowser();
  },
  renderProjectViewer: function () {
    if(this.projectViewer) {
      this.projectViewer.remove()
    }
    this.projectViewer = new ProjectViewer({
      model: this.model,
      name: this.projectName
    });
    this.registerRenderSubview(this.projectViewer, "project-viewer")
  },
  renderProjectFileBrowser: function () {
    let self = this
    if(this.projectFileBrowser) {
      this.projectFileBrowser.remove()
    }
    this.projectFileBrowser = new FileBrowser({
      root: self.projectPath
    })
    this.registerRenderSubview(this.projectFileBrowser, "file-browser")
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  }
});

initPage(ProjectManager)