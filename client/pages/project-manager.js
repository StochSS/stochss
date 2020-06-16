//support files
var app = require('../app');
var modals = require('../modals');
//views
var PageView = require('./base');
var ProjectViewer = require('../views/project-viewer');
//models
var Project = require('../models/project');
//templates
var template = require('../templates/pages/projectManager.pug');

import initPage from './page.js'

let ProjectManager = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    this.url = decodeURI(document.URL)
    let urlParams = new URLSearchParams(window.location.search)
    let projectPath = urlParams.get('path')
    this.projectName = projectPath.split('/').pop().split('.')[0]
    this.model = new Project({
      directory: projectPath
    });
    var self = this
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews()
        console.log(model)
      }
    });
  },
  renderSubviews: function () {
    this.renderProjectViewer()
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
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  }
});

initPage(ProjectManager)