//support files
var app = require('../app');
var modals = require('../modals');
//views
var PageView = require('./base');
//models
//templates
var template = require('../templates/pages/projectManager.pug')

import initPage from './page.js'

let ProjectManager = PageView.extend({
  template: template,
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    this.url = decodeURI(document.URL)
    let urlParams = new URLSearchParams(window.location.search)
    let projectPath = urlParams.get('path')
    console.log(projectPath)
    this.projectName = projectPath.split('/').pop().split('.')[0]
    console.log(this.projectName)
  }
});

initPage(ProjectManager)