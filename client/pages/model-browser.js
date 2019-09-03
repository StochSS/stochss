let jstree = require('jstree');
let path = require('path');
let xhr = require('xhr');
let PageView = require('./base');
let template = require('../templates/pages/modelBrowser.pug');
let $ = require('jquery');
//let bootstrap = require('bootstrap');

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

// Using a bootstrap modal to input model names for now
let renderCreateModalHtml = (isSpatial) => {
  let modelTypeText = isSpatial ? 'Spatial' : 'Non-Spatial';
  return `
    <div id="newModalModel" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New ${modelTypeText} Model</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label for="modelNameInput">Name:</label>
            <input type="text" id="modelNameInput" name="modelNameInput" size="30">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary save-model-btn">Save</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
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
            "label" : "Create Model",
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "submenu" : {
              "spatial" : {
                "label" : "Spatial",
                "_disabled" : true,
                "separator_before" : false,
                "separator_after" : false
              },
              "nonspatial" : { 
                "label" : "Non-Spatial",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  let modal = $(renderCreateModalHtml(false)).modal();
                  let saveBtn = document.querySelector('#newModalModel .save-model-btn');
                  let input = document.querySelector('#newModalModel #modelNameInput');
                  let modelName;
                  saveBtn.addEventListener('click', (e) => {
                    if (Boolean(input.value)) {
                      let modelName = input.value + '.nsmdl';
                      let modelPath = path.join("/hub/stochss/models/edit", o.original._path, modelName)
                      window.location.href = modelPath;
                    }
                  })
                }
              } 
            }
          }
        }
      }
      else if (o.type === 'spatial') {
        return {
          "edit" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Edit Model",
            "action" : function (data) {
              var endpoint = path.join("/hub/stochss/models/edit", o.original._path);
              var self = this;
              xhr(
                { uri: endpoint },
                function (err, response, body) {
                  window.location.href = path.join("/hub/stochss/models/edit", o.original._path)
                },
              );
            }
          },
          "convert" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Convert to Non Spatial",
            "action" : function (data) {

            }
          }
        }
      }
      else if (o.type === 'nonspatial') {
         return {
          "edit" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Edit Model",
            "action" : function (data) {
              var endpoint = path.join("/hub/stochss/models/edit", o.original._path);
              var self = this;
              xhr(
                { uri: endpoint },
                function (err, response, body) {
                  window.location.href = path.join("/hub/stochss/models/edit", o.original._path)
                },
              );
            }
          },
          "convert" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
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
            "_disabled" : true,
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
