var path = require('path');
//views
var PageView = require('./base');
//templates
var template = require('../templates/pages/workflowSelection.pug');

import initPage from './page.js';

let workflowSelection = PageView.extend({
  template: template,
  events: {
    "click [data-hook=parameter-sweep]" : "notebookWorkflow",
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    this.modelDir = decodeURI(document.URL.split('/workflow/selection').pop());
    this.modelFile = this.modelDir.split('/').pop().split('.').shift();
  },
  notebookWorkflow: function (e) {
    var type = e.target.dataset.type;
    console.log(type);
    this.toNotebook(type);
  },
  toNotebook: function (type) {
    var endpoint = path.join("/stochss/api/workflow/notebook", type, this.modelDir)
    console.log(endpoint)
  }
});

initPage(workflowSelection);