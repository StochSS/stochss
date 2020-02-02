let jstree = require('jstree');
let path = require('path');
let xhr = require('xhr');
let PageView = require('./base');
let template = require('../templates/pages/fileBrowser.pug');
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
  },
}

let treeSettings = {
  'plugins': [
    'types',
    'wholerow',
    'changed',
    'contextmenu',
    'dnd',
  ],
  'core': {
    'multiple' : false,
    'animation': 0,
    'check_callback': function (op, node, par, pos, more) {
      if(op === 'move_node' && more && more.ref && more.ref.type && !(more.ref.type == 'folder' || more.ref.type == 'root')){
        return false
      }
      if(op === 'move_node' && more && more.ref && more.ref.type && more.ref.type === 'folder'){
        if(!more.ref.state.loaded){
          return false
        }
        var exists = false
        var BreakException = {}
        try{
          more.ref.children.forEach(function (child) {
            var child_node = $('#models-jstree').jstree().get_node(child)
            exists = child_node.text === node.text
            if(exists){
              throw BreakException;
            }
          })
        }catch{
          return false;
        }
      }
      if(op === 'move_node' && more && (pos != 0 || more.pos !== "i") && !more.core){
        return false
      }
      if(op === 'move_node' && more && more.core) {
        var newDir = par.original._path
        var file = node.original._path.split('/').pop()
        var oldPath = node.original._path
        var endpoint = path.join("/stochss/api/file/move", oldPath, '<--MoveTo-->', newDir, file)
        xhr({uri: endpoint}, function(err, response, body) {
          if(body.startsWith("Success!")) {
            node.original._path = path.join(newDir, file)
            if(par.type === 'root'){
              $('#models-jstree').jstree().refresh()
            }else{
              $('#models-jstree').jstree().refresh_node(par);
            }
          }
        });
      }
      return true
    },
    'themes': {
      'stripes': true,
      'variant': 'large'
    },
    'data': ajaxData,
  },
  'types' : {
    'root' : {
      "icon": "jstree-icon jstree-folder"
    },
    'folder' : {
      "icon": "jstree-icon jstree-folder"
    },
    'spatial' : {
      "icon": "jstree-icon jstree-file"
    },
    'nonspatial' : {
      "icon": "jstree-icon jstree-file"
    },
    'workflow' : {
      "icon": "jstree-icon jstree-file"
    },
    'notebook' : {
      "icon": "jstree-icon jstree-file"
    },
    'mesh' : {
      "icon": "jstree-icon jstree-file"
    },
    'sbml-model' : {
      "icon": "jstree-icon jstree-file"
    },
    'other' : {
      "icon": "jstree-icon jstree-file"
    },
  },  
}



// Using a bootstrap modal to input model names for now
let renderCreateModalHtml = (isModel, isSpatial) => {
  var titleText = 'Directory';
  if(isModel){
    titleText = isSpatial ? 'Spatial Model' : 'Non-Spatial Model';
  }
  return `
    <div id="newModalModel" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New ${titleText}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label for="modelNameInput">Name:</label>
            <input type="text" id="modelNameInput" name="modelNameInput" size="30" autofocus>
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

let sbmlToModelHtml = (title, errors) => {
  for(var i = 0; i < errors.length; i++) {
    if(errors[i].startsWith("SBML Error") || errors[i].startsWith("Error")){
      errors[i] = "<b>Error</b>: " + errors[i]
    }else{
      errors[i] = "<b>Warning</b>: " + errors[i]
    }
  }

  return `
    <div id="sbmlToModelModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> ${title} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${errors.join("<br>")} </p>
          </div>
          <div class="modal-footer">
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
  },
  render: function () {
    var self = this;
    this.renderWithTemplate();
    this.setupJstree();
    setTimeout(function () {
      self.refreshInitialJSTree();
    }, 3000);
  },
  refreshJSTree: function () {
    $('#models-jstree').jstree().refresh()
  },
  refreshInitialJSTree: function () {
    var self = this;
    var count = $('#models-jstree').jstree()._model.data['#'].children.length;
    if(count == 0) {
      self.refreshJSTree();
      setTimeout(function () {
        self.refreshInitialJSTree();
      }, 3000);
    }
  },
  deleteFile: function (o) {
    var fileType = o.type
    if(fileType === "nonspatial")
      fileType = "model";
    else if(fileType === "spatial")
      fileType = "spatial model"
    var answer = confirm("Click 'ok' to confirm that you wish to delete this " + fileType)
    if(answer){
      var endpoint = path.join("/stochss/api/file/delete", o.original._path)
      xhr({uri: endpoint}, function(err, response, body) {
        var node = $('#models-jstree').jstree().get_node(o.parent);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh();
        }else{
          $('#models-jstree').jstree().refresh_node(node);
        }
      })
    }
  },
  duplicateFileOrDirectory: function(o, isDirectory) {
    var self = this;
    var parentID = o.parent;
    if(isDirectory){
      var endpoint = path.join("/stochss/api/directory/duplicate", o.original._path);
    }else{
      var endpoint = path.join("/stochss/api/model/duplicate", o.original._path);
    }
    xhr({uri: endpoint}, 
      function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh()
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
      }
    );
  },
  toSpatial: function (o) {
    var self = this;
    var parentID = o.parent;
    var endpoint = path.join("/stochss/api/model/to-spatial", o.original._path);
    xhr({uri: endpoint}, 
      function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh()
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
      }
    );
  },
  toModel: function (o, from) {
    var self = this;
    var parentID = o.parent;
    if(from === "Spatial"){
      var endpoint = path.join("/stochss/api/spatial/to-model", o.original._path);
    }else{
      var endpoint = path.join("/stochss/api/sbml/to-model", o.original._path);
    }
    xhr({uri: endpoint}, 
      function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh()
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
        if(from === "SBML"){
          var title = ""
          var resp = JSON.parse(body)
          var msg = resp.message
          var errors = resp.errors
          let modal = $(sbmlToModelHtml(msg, errors)).modal();
        }
      }
    );
  },
  toSBML: function (o) {
    var self = this;
    var parentID = o.parent;
    var endpoint = path.join("/stochss/api/model/to-sbml", o.original._path);
    xhr({uri: endpoint},
      function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh()
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
      }
    );
  },
  renameNode: function (o) {
    var self = this
    var text = o.text;
    var parent = $('#models-jstree').jstree().get_node(o.parent)
    var extensionWarning = $(this.queryByHook('extension-warning'));
    var nameWarning = $(this.queryByHook('rename-warning'));
    extensionWarning.collapse('show')
    $('#models-jstree').jstree().edit(o, null, function(node, status) {
      if(text != node.text){
        var endpoint = path.join("/stochss/api/file/rename", o.original._path, "<--change-->", node.text)
        xhr({uri: endpoint}, function (err, response, body){
          var resp = JSON.parse(body)
          if(!resp.message.startsWith('Success!')) {
            nameWarning.html(resp.message)
            nameWarning.collapse('show');
          }
          node.original._path = resp._path
          if(parent.type === "root"){
            $('#models-jstree').jstree().refresh()
          }else{          
            $('#models-jstree').jstree().refresh_node(node);
          }
        })
      }
      extensionWarning.collapse('hide');
      nameWarning.collapse('hide');
    });
  },
  getJsonFileForExport: function (o) {
    var self = this;
    var endpoint = path.join("/stochss/api/json-data", o.original._path);
    xhr({uri: endpoint}, function (err, response, body) {
      var resp = JSON.parse(body);
      self.exportToJsonFile(resp, o.original.text);
    });
  },
  getFileForExport: function (o) {
    var self = this;
    var endpoint = path.join("/stochss/api/file/download", o.original._path);
    xhr({uri: endpoint}, function (err, response, body) {
      self.exportToFile(body, o.original.text);
    });
  },
  exportToJsonFile: function (fileData, fileName) {
    let dataStr = JSON.stringify(fileData);
    let dataURI = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = fileName

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  exportToFile: function (fileData, fileName) {
    let dataURI = 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData);

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  },
  newModelOrDirectory: function (o, isModel, isSpatial) {
    var self = this
    if(document.querySelector('#newModalModel')) {
      document.querySelector('#newModalModel').remove()
    }
    let modal = $(renderCreateModalHtml(isModel, isSpatial)).modal();
    let okBtn = document.querySelector('#newModalModel .ok-model-btn');
    let input = document.querySelector('#newModalModel #modelNameInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    let modelName;
    okBtn.addEventListener('click', function (e) {
      if (Boolean(input.value)) {
        if(isModel) {
          let modelName = input.value + '.mdl';
          var parentPath = o.original._path
          var modelPath = path.join("/hub/stochss/models/edit", parentPath, modelName);
          window.location.href = modelPath;
        }else{
          let dirName = input.value;
          var parentPath = o.original._path;
          let endpoint = path.join("/stochss/api/directory/create", parentPath, dirName);
          xhr({uri:endpoint}, function (err, response, body) {
            var node = $('#models-jstree').jstree().get_node(o);
            if(node.type === "root"){
              $('#models-jstree').jstree().refresh()
            }else{          
              $('#models-jstree').jstree().refresh_node(node);
            }
          });
          modal.modal('hide')
        }
      }
    });
  },
  setupJstree: function () {
    var self = this;
    $.jstree.defaults.contextmenu.items = (o, cb) => {
      if (o.type === 'root'){
        return {
          "Refresh" : {
            "label" : "Refresh",
            "_disabled" : false,
            "_class" : "font-weight-bold",
            "separator_before" : false,
            "separator_after" : true,
            "action" : function (data) {
              $('#models-jstree').jstree().refresh();
            }
          },
          "Create_Directory" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Create Directory",
            "action" : function (data) {
              self.newModelOrDirectory(o, false, false);
            }
          },
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
                  self.newModelOrDirectory(o, true, false);
                }
              } 
            }
          },
        }
      }
      else if (o.type ===  'folder') {
        return {
          "Refresh" : {
            "label" : "Refresh",
            "_disabled" : false,
            "_class" : "font-weight-bold",
            "separator_before" : false,
            "separator_after" : true,
            "action" : function (data) {
              $('#models-jstree').jstree().refresh_node(o);
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, true)
            }
          },
          "Create_Directory" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Create Directory",
            "action" : function (data) {
              self.newModelOrDirectory(o, false, false);
            }
          },
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
                  self.newModelOrDirectory(o, true, false);
                }
              } 
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
      else if (o.type === 'spatial') {
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
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Convert to Non Spatial" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Convert to Non Spatial",
            "action" : function (data) {
              self.toModel(o, "Spatial");
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
          "New Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "New Workflow",
            "action" : function (data) {
              window.location.href = path.join("/hub/stochss/workflow/selection", o.original._path);
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
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
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Convert to Spatial" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Convert to Spatial",
            "action" : function (data) {
              self.toSpatial(o)
            }
          },
          "Convert to Notebook" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Convert to Notebook",
            "action" : function (data) {
              var endpoint = path.join("/stochss/api/models/to-notebook", o.original._path)
              xhr({ uri: endpoint },
                    function (err, response, body) {
                var node = $('#models-jstree').jstree().get_node(o.parent)
                if(node.type === 'root'){
                  $('#models-jstree').jstree().refresh();
                }else{
                  $('#models-jstree').jstree().refresh_node(node);
                }
                var _path = body.split(' ')[0].split('/home/jovyan/').pop()
                var endpoint = path.join('/stochss/api/user/');
                xhr(
                  { uri: endpoint },
                  function (err, response, body) {
                    var notebookPath = path.join("/user/", body, "/notebooks/", _path)
                    window.open(notebookPath, '_blank')
                  },
                );
              });
            }
          },
          "Convert to SBML" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Convert to SBML",
            "action" : function (data) {
              self.toSBML(o)
            }
          },
          "New Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "New Workflow",
            "action" : function (data) {
              window.location.href = path.join("/hub/stochss/workflow/selection", o.original._path);
            }
          },
          "Export" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Export",
            "action" : function (data) {
              self.getJsonFileForExport(o);
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
	      }
      }
      else if (o.type === 'workflow') {
        return {
          "View Workflow" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "View Workflow",
            "action" : function (data) {
              window.location.href = path.join("/hub/stochss/workflow/edit/none", o.original._path);
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Stop Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Stop Workflow",
            "action" : function (data) {

            }
          },
          "Start/Restart Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Start/Restart Workflow",
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
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
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
                  window.open(notebookPath, '_blank')
                },
              );
            }
          },
          "Export" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Export",
            "action" : function (data) {
              self.getJsonFileForExport(o);
      	    }
      	  },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
      else if (o.type === 'sbml-model') {
        return {
          "Open File" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Open File",
            "action" : function (data) {
              var filePath = o.original._path
              var endpoint = path.join('/stochss/api/user/');
              xhr({ uri: endpoint }, function (err, response, body) {
                var openPath = path.join("/user/", body, "/edit/", filePath)
                window.open(openPath, '_blank')
              });
            }
          },
          "Export File" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Export File",
            "action" : function (data) {
              self.getFileForExport(o);
            }
          },
          "Convert to Model" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Convert to Model",
            "action" : function (data) {
              self.toModel(o, "SBML");
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
      else {
        return {
          "Open File" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : true,
            "_class" : "font-weight-bolder",
            "label" : "Open File",
            "action" : function (data) {
            }
          },
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, false)
            }
          },
          "Delete" : {
            "label" : "Delete",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "action" : function (data) {
              self.deleteFile(o);
            }
          },
        }
      }
    }
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    $(document).on('dnd_start.vakata', function (data, element, helper, event) {
      $('#models-jstree').jstree().load_all()
    });
    $('#models-jstree').jstree(treeSettings)
    $('#models-jstree').on('click.jstree', function(e) {
      var parent = e.target.parentElement
      var _node = parent.children[parent.children.length - 1]
      var node = $('#models-jstree').jstree().get_node(_node)
      if(_node.nodeName === "A" && $('#models-jstree').jstree().is_loaded(node) && node.type === "folder"){
        $('#models-jstree').jstree().refresh_node(node)
      }
    });
    $('#models-jstree').on('dblclick.jstree', function(e) {
      var file = e.target.text
      var node = $('#models-jstree').jstree().get_node(e.target)
      console.log(node)
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
      }else if(file.endsWith('.sbml')){
        var endpoint = path.join('/stochss/api/user/');
        xhr({ uri: endpoint }, function (err, response, body) {
          var openPath = path.join("/user/", body, "/edit/", _path)
          window.open(openPath, '_blank')
        });
      }else if(file.endsWith('.wkfl')){
        window.location.href = path.join("/hub/stochss/workflow/edit/none", _path);
      }else if(node.type === "folder" && $('#models-jstree').jstree().is_open(node) && $('#models-jstree').jstree().is_loaded(node)){
        $('#models-jstree').jstree().refresh_node(node)
      }
    });
  }
});

initPage(FileBrowser);
