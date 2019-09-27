let jstree = require('jstree');
let path = require('path');
let xhr = require('xhr');
let PageView = require('./base');
let template = require('../templates/pages/modelBrowser.pug');
let $ = require('jquery');
//let bootstrap = require('bootstrap');

import initPage from './page.js';

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
      "icon": "jstree-icon jstree-folder"
    },
    'spatial' : {
      "icon": "jstree-icon jstree-file"
    },
    'nonspatial' : {
      "icon": "jstree-icon jstree-file"
    },
    'job' : {
      "icon": "jstree-icon jstree-file"
    },
    'notebook' : {
      "icon": "jstree-icon jstree-file"
    },
    'mesh' : {
      "icon": "jstree-icon jstree-file"
    },
    'other' : {
      "icon": "jstree-icon jstree-file"
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
            <button type="button" class="btn btn-primary ok-model-btn">OK</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
}

let FileBrowser = PageView.extend({
  pageTitle: 'StochSS | File Browser',
  template: template,
  events: {
    'click [data-hook=refresh-jstree]' : 'refreshJSTree',
    'click [data-hook=new-model]' : 'newModel',
    'click [data-hook=new-spatial-model]' : 'newSpatialModel',
  },
  render: function () {
    this.renderWithTemplate();
    this.setupJstree()
  },
  refreshJSTree: function () {
    window.location.reload()
  },
  newModel: function (e) {
    let isSpatial = e.srcElement.dataset.modeltype === "spatial"
    let modal = $(renderCreateModalHtml(isSpatial)).modal();
    let okBtn = document.querySelector('#newModalModel .ok-model-btn');
    let input = document.querySelector('#newModalModel #modelNameInput');
    let modelName;
    okBtn.addEventListener('click', (e) => {
      if (Boolean(input.value)) {
        var modelName = ""
        if (isSpatial){
          modelName = input.value + '.smdl';
        }else{
          modelName = input.value + '.mdl';  
        }
        let modelPath = path.join("/hub/stochss/models/edit/", modelName)
        window.location.href = modelPath;
      }
    })
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
                "separator_after" : false,
                "action" : function (data) {

                }
              },
              "nonspatial" : { 
                "label" : "Non-Spatial",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  let modal = $(renderCreateModalHtml(false)).modal();
                  let okBtn = document.querySelector('#newModalModel .ok-model-btn');
                  let input = document.querySelector('#newModalModel #modelNameInput');
                  let modelName;
                  okBtn.addEventListener('click', (e) => {
                    if (Boolean(input.value)) {
                      let modelName = input.value + '.mdl';
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
          "Edit" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : true,
            "_class" : "font-weight-bolder",
            "label" : "Edit",
            "action" : function (data) {
              window.location.href = path.join("/hub/stochss/models/edit", o.original._path);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Duplicate",
            "action" : function (data) {

            }
          },
          "Convert to Non Spatial" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Convert to Non Spatial",
            "action" : function (data) {

            }
          },
          "Convert to Notebook" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Convert to Notebook",
            "action" : function (data) {

            }
          },
          "Start Job" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Start Job",
            "action" : function (data) {

            }
          }
        }
      }
      else if (o.type === 'nonspatial') {
         return {
          "Edit" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Edit",
            "action" : function (data) {
              window.location.href = path.join("/hub/stochss/models/edit", o.original._path);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Duplicate",
            "action" : function (data) {

            }
          },
          "Convert to Spatial" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Convert to Spatial",
            "action" : function (data) {
              
            }
          },
          "Convert to Notebook" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Convert to Notebook",
            "action" : function (data) {

            }
          },
          "Start Job" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Start Job",
            "action" : function (data) {

            }
          }
        }
      }
      else if (o.type === 'job') {
        return {
          "View Results" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "View Results",
            "action" : function (data) {
              
            }
          },
          "Stop Job" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Stop Job",
            "action" : function (data) {

            }
          },
          "Start/Restart Job" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Start/Restart Job",
            "action" : function (data) {

            }
          },
          "Model" : {
            "separator_before" : false,
            "separator_after" : false,
            "label" : "Model",
            "_disabled" : false,
            "submenu" : {
              "Edit" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : true,
                "label" : " Edit",
                "action" : function (data) {

                }
              },
              "Duplicate" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : true,
                "label" : "Duplicate",
                "action" : function (data) {

                }
              }
            }
          }
        }
      }
      else if (o.type === 'notebook') {
        return {
          "Open Notebook" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Open Notebook",
            "action" : function (data) {
              var filePath = o.original._path
              var endpoint = path.join('/stochss/api/user/');
              xhr(
                { uri: endpoint },
                function (err, response, body) {
                  var notebookPath = path.join("/user/", body, "/notebooks/", filePath)
                  window.location.href = notebookPath
                },
              );
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Duplicate",
            "action" : function (data) {

            }
          }
        }
      }
    }
    $('#models-jstree').jstree(treeSettings)
    $('#models-jstree').on('dblclick.jstree', function(e, data) {
      var file = e.target.text
      var node = $('#models-jstree').jstree().get_node(e.target)
      var _path = node.original._path;
      if(file.endsWith('.mdl') || file.endsWith('.smdl')){
        window.location.href = path.join("/hub/stochss/models/edit", _path);
      }else if(file.endsWith('.ipynb')){
        var endpoint = path.join('/stochss/api/user/');
        xhr(
          { uri: endpoint },
          function (err, response, body) {
            var notebookPath = path.join("/user/", body, "/notebooks/", _path)
            window.open(notebookPath, '_blank')
          },
        );
      }else if(node.type === "folder" && $('#models-jstree').jstree().is_open(node) && $('#models-jstree').jstree().is_loaded(node)){
        $('#models-jstree').jstree().refresh_node(node)
      }
    });
  }
});

initPage(FileBrowser);
