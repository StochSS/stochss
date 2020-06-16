//support files
var app = require('../app');
var modals = require('../modals');
//views
var PageView = require('./base');
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
    this.model.fetch({
      success: function (model, response, options) {
        console.log(model)
      }
    });
  }
});

initPage(ProjectManager)