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
  }
]

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
    'data': treeData
  },
  'types' : {
    'folder' : {
    },
    'model' : {
    }
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
      console.log(o.type);
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
