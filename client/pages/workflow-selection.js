var xhr = require('xhr');
var path = require('path');
//views
var PageView = require('./base');
//templates
var template = require('../templates/pages/workflowSelection.pug');

import initPage from './page.js';

let workflowSelection = PageView.extend({
  template: template,
  events: {
    "click [data-hook=oned-parameter-sweep]" : "notebookWorkflow",
    "click [data-hook=twod-parameter-sweep]" : "notebookWorkflow",
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments);
    this.modelDir = decodeURI(document.URL.split('/workflow/selection').pop());
    this.modelFile = this.modelDir.split('/').pop().split('.').shift();
  },
  notebookWorkflow: function (e) {
    var type = e.target.dataset.type;
    this.toNotebook(type);
  },
  toNotebook: function (type) {
    var endpoint = path.join("/stochss/api/workflow/notebook", type, this.modelDir)
    xhr({uri:endpoint}, function (err, response, body) {
      var _path = body.split(' ')[0].split('/home/jovyan/').pop()
      var endpoint = path.join('/stochss/api/user/');
      xhr({ uri: endpoint }, function (err, response, body) {
          var notebookPath = path.join("/user/", body, "/notebooks/", _path)
          window.open(notebookPath, '_blank')
        },
      );
    });
  },
});

initPage(workflowSelection);