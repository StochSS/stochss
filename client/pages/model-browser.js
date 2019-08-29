let jstree = require('jstree');
let PageView = require('./base');
let template = require('../templates/pages/modelBrowser.pug');
let $ = require('jquery');

import initPage from './page.js';

let treeData = [
  {
    'text' : 'My Models',
    'type' : 'folder',
    'state' : {
      'opened' : true,
      'selected' : false
    },
    'children' : [
      {
        'text' : 'MySpatialModel.smdl',
        'type' : 'spatial',
      },
      {
        'text' : 'MyNonspatialModel.nsmdl',
        'type' : 'nonspatial'
      },
      {
        'text' : 'MyJob.job',
        'type' : 'job'
      }
    ]
  },
]

let ajaxData = {
  "url" : function (node) {
    if(node.parent === null){
      return "/stochss/models/browser-list/"
    }
    return "/stochss/models/browser-list" + node.original._path
  },
  "dataType" : "json",
  "data" : function (node) {
    return { 'id' : node.id}
  }
}

let treeSettings = {
  'plugins': [
    'types',
    'wholerow',
    'changed',
    'contextmenu'
  ],
  'core': {
    'animation': 0,
    'themes': {
      'stripes': true,
      'variant': 'large'
    },
    'data': ajaxData,
  },
  'types' : {
    'folder' : {
    },
    'spatial' : {
    },
    'nonspatial' : {
    },
    'job' : {
    },
    'notebook' : {
    },
    'mesh' : {
    },
  }

}

let ModelBrowser = PageView.extend({
  pageTitle: 'StochSS | Model Browser',
  template: template,
  render: function () {
    this.renderWithTemplate();
    this.setupJstree()
  },
  setupJstree: function () {
    $.jstree.defaults.contextmenu.items = (o, cb) => {
      if (o.type ===  'folder') {
        return {
          "create_model" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Create Model",
            "action" : function (data) {
              
            }
          }
        }
      }
      else if (o.type === 'spatial') {
        return {
          "convert" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Convert to Non-Spatial",
            "action" : function (data) {
              
            }
          }
        }
      }
      else if (o.type === 'nonspatial') {
         return {
          "convert" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Convert to Spatial",
            "action" : function (data) {
              // var endpoint = path.join("/models/edit", o.original._path);
              // var self = this;
              // xhr(
              //   { uri: endpoint },
              //   function (err, response, body) {
              //     self.plotResults(JSON.parse(body));
              //   },
              // );
            }
          }
        }
      }
      else if (o.type === 'job') {
        return {
          "kill" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Kill",
            "action" : function (data) {
              
            }
          }
        }
      }
    }
    $('#models-jstree').jstree(treeSettings)
  }
});

initPage(ModelBrowser);
