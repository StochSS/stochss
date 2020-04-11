let jstree = require('jstree');
let path = require('path');
let xhr = require('xhr');
let PageView = require('./base');
let template = require('../templates/pages/fileBrowser.pug');
let $ = require('jquery');
let _ = require('underscore');
let app = require('../app');
//let bootstrap = require('bootstrap');

import initPage from './page.js';

let ajaxData = {
  "url" : function (node) {
    if(node.parent === null){
      return "stochss/models/browser-list/"
    }
    return "stochss/models/browser-list" + node.original._path
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
        var endpoint = path.join(app.getApiPath(), "/file/move", oldPath, '<--MoveTo-->', newDir, file)
        xhr({uri: endpoint}, function(err, response, body) {
          if(response.statusCode < 400) {
            node.original._path = path.join(newDir, file)
          }else{
            body = JSON.parse(body)
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

let operationInfoModalHtml = () => {
  let fileBrowserHelpMessage = `
    <p><b>Open/Edit a File</b>: Double-click on a file or right-click on a file and click Open/Edit.  
    <b>Note</b>: Some files will open in a new tab so you may want to turn off the pop-up blocker.</p>
    <p><b>Open Directory</b>: Click on the arrow next to the directory or double-click on the directory.</p>
    <p><b>Create a Directory/Model</b>: Right-click on a directory, click New Directory/New Model, and enter the name of directory/model or path.  
    For models you will need to click on the type of model you wish to create before entering the name or path.</p>
    <p><b>Create a Workflow</b>: Right-click on a model and click New Workflow, this takes you to the workflow selection page.  
    From the workflow selection page, click on one of the listed workflows.</p>
    <p><b>Convert a File</b>: Right-click on a Model/SBML, click Convert, and click on the desired Convert to option.  
    Model files can be converted to Spatial Models, Notebooks, or SBML files.  
    Spatial Models and SBML file can be converted to Models.  
    <b>Note</b>: Notebooks will open in a new tab so you may want to turn off the pop-up blocker.</p>
    <p><b>Move File or Directory</b>: Click and drag the file or directory to the new location.  
    You can only move an item to a directory if there isn't a file or directory with the same name in that location.</p>
    <p><b>Download a Model/Notebook/SBML File</b>: Right-click on the file and click download.</p>
    <p><b>Rename File/Directory</b>: Right-click on a file/directory, click rename, and enter the new name.</p>
    <p><b>Duplicate/Delete A File/Directory</b>: Right-click on the file/directory and click Duplicate/Delete.</p>
  `;
  
  return `
    <div id="operationInfoModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Help </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${fileBrowserHelpMessage} </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  ` 
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
            <button type="button" class="btn btn-primary ok-model-btn box-shadow">OK</button>
            <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
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
            <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
}

let deleteFileHtml = (fileType) => {
  return `
    <div id="deleteFileModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Permanently delete this ${fileType}? </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary yes-modal-btn box-shadow">Yes</button>
            <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">No</button>
          </div>
        </div>
      </div>
    </div>
  `
}

let uploadFileHtml = (type) => {
  return `
    <div id="uploadFileModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Upload a ${type} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="verticle-space">
              <span class="inline" for="datafile">Please specify a file to import: </span>
              <input id="fileForUpload" type="file" id="datafile" name="datafile" size="30" required>
            </div>
            <div class="verticle-space">
              <span class="inline" for="fileNameInput">New file name (optional): </span>
              <input type="text" id="fileNameInput" name="fileNameInput" size="30">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary box-shadow upload-modal-btn" disabled>Upload</button>
            <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `
}

let duplicateWorkflowHtml = (wkflFile, mdlPath) => {
  return `
    <div id="duplicateWorkflowModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> Model for ${wkflFile} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> The model for <b>${wkflFile}</b> is located here: <b>${mdlPath}</b> </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
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
    'click [data-hook=options-for-node]' : 'showContextMenuForNode',
    'click [data-hook=new-directory]' : 'handleCreateDirectoryClick',
    'click [data-hook=new-model]' : 'handleCreateModelClick',
    'click [data-hook=upload-file-btn]' : 'handleUploadFileClick',
    'click [data-hook=file-browser-help]' : function () {
      let modal = $(operationInfoModalHtml()).modal();
    },
  },
  render: function () {
    var self = this;
    this.nodeForContextMenu = "";
    this.renderWithTemplate();
    window.addEventListener('pageshow', function (e) {
      var navType = window.performance.navigation.type
      if(navType === 2){
        window.location.reload()
      }
    });
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
  selectNode: function (node, fileName) {
    let self = this
    if(!$('#models-jstree').jstree().is_loaded(node) && $('#models-jstree').jstree().is_loading(node)) {
      setTimeout(_.bind(self.selectNode, self, node, fileName), 1000);
    }else{
      node = $('#models-jstree').jstree().get_node(node)
      var child = ""
      for(var i = 0; i < node.children.length; i++) {
        var child = $('#models-jstree').jstree().get_node(node.children[i])
        if(child.original.text === fileName) {
          $('#models-jstree').jstree().select_node(node.children[i])
          break
        }
      }
    }
  },
  handleUploadFileClick: function (e) {
    let file = this.queryByHook('file-for-upload').files[0]
    let req = new XMLHttpRequest();
    let formData = new FormData()
    let endpoint = path.join(app.getApiPath(), 'file/upload');
    var fileinfo = {"type":"","name":""}
    if(file.name.endsWith('.ipynb')){
      fileinfo.type = "Notebook"
    }
    formData.append("datafile", file)
    formData.append("fileinfo", JSON.stringify(fileinfo))
    req.open("POST", endpoint)
    req.onload = function (e) {
      if(req.status < 400) {
        console.log(req.response)
      }
    }
    req.send(formData)
  },
  uploadFile: function (o, type) {
    var self = this
    if(document.querySelector('#uploadFileModal')) {
      document.querySelector('#uploadFileModal').remove()
    }
    let modal = $(uploadFileHtml(type)).modal();
    let uploadBtn = document.querySelector('#uploadFileModal .upload-modal-btn');
    let fileInput = document.querySelector('#uploadFileModal #fileForUpload');
    let input = document.querySelector('#uploadFileModal #fileNameInput');
    fileInput.addEventListener('change', function (e) {
      if(fileInput.files.length){
        uploadBtn.disabled = false
      }else{
        uploadBtn.disabled = true
      }
    })
    uploadBtn.addEventListener('click', function (e) {
      let file = fileInput.files[0]
      var fileinfo = {"type":type,"name":"","path":"/"}
      if(o && o.original){
        fileinfo.path = o.original._path
      }
      if(Boolean(input.value)){
        fileinfo.name = input.value
      }
      let formData = new FormData()
      formData.append("datafile", file)
      formData.append("fileinfo", JSON.stringify(fileinfo))
      let endpoint = path.join(app.getApiPath(), 'file/upload');
      let req = new XMLHttpRequest();
      req.open("POST", endpoint)
      req.onload = function (e) {
        var resp = JSON.parse(req.response)
        if(req.status < 400) {
          if(o){
            var node = $('#models-jstree').jstree().get_node(o.parent);
            if(node.type === "root" || node.type === "#"){
              $('#models-jstree').jstree().refresh();
            }else{
              $('#models-jstree').jstree().refresh_node(node);
            }
          }else{
            $('#models-jstree').jstree().refresh();
          }
        }
      }
      req.send(formData)
      modal.modal('hide')
    })
  },
  deleteFile: function (o) {
    var fileType = o.type
    if(fileType === "nonspatial")
      fileType = "model";
    else if(fileType === "spatial")
      fileType = "spatial model"
    else if(fileType === "sbml-model")
      fileType = "sbml model"
    var self = this
    if(document.querySelector('#deleteFileModal')) {
      document.querySelector('#deleteFileModal').remove()
    }
    let modal = $(deleteFileHtml(fileType)).modal();
    let yesBtn = document.querySelector('#deleteFileModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      var endpoint = path.join(app.getApiPath(), "/file/delete", o.original._path)
      xhr({uri: endpoint}, function(err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(o.parent);
          if(node.type === "root"){
            $('#models-jstree').jstree().refresh();
          }else{
            $('#models-jstree').jstree().refresh_node(node);
          }
        }else{
          body = JSON.parse(body)
        }
      })
      modal.modal('hide')
    });
  },
  duplicateFileOrDirectory: function(o, type) {
    var self = this;
    var parentID = o.parent;
    if(type === "directory"){
      var identifier = "directory/duplicate"
    }else if(type === "workflow"){
      let timeStamp = this.getTimeStamp()
      var identifier = path.join("workflow/duplicate", type, timeStamp)
    }else if(type === "wkfl_model"){
      var identifier = path.join("workflow/duplicate", type, "None")
    }else{
      var identifier = "model/duplicate"
    }
    var endpoint = path.join(app.getApiPath(), identifier, o.original._path)
    xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(parentID);
          if(node.type === "root"){
            $('#models-jstree').jstree().refresh()
          }else{          
            $('#models-jstree').jstree().refresh_node(node);
          }
          if(type === "workflow"){
            let modal = $(duplicateWorkflowHtml(body.File, body.mdlPath)).modal()
          }
          self.selectNode(node, body.File)
        }
      }
    );
  },
  getTimeStamp: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month < 10){
      month = "0" + month
    }
    var day = date.getDate();
    if(day < 10){
      day = "0" + day
    }
    var hours = date.getHours();
    if(hours < 10){
      hours = "0" + hours
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
      minutes = "0" + minutes
    }
    var seconds = date.getSeconds();
    if(seconds < 10){
      seconds = "0" + seconds
    }
    return "_" + month + day + year + "_" + hours + minutes + seconds;
  },
  toSpatial: function (o) {
    var self = this;
    var parentID = o.parent;
    var endpoint = path.join(app.getApiPath(), "/model/to-spatial", o.original._path);
    xhr({uri: endpoint, json: true}, 
      function (err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(parentID);
          if(node.type === "root"){
            $('#models-jstree').jstree().refresh()
          }else{          
            $('#models-jstree').jstree().refresh_node(node);
          }
          self.selectNode(node, body.File)
        }
      }
    );
  },
  toModel: function (o, from) {
    var self = this;
    var parentID = o.parent;
    if(from === "Spatial"){
      var endpoint = path.join(app.getApiPath(), "/spatial/to-model", o.original._path);
    }else{
      var endpoint = path.join(app.getApiPath(), "sbml/to-model", o.original._path);
    }
    xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(parentID);
          if(node.type === "root"){
            $('#models-jstree').jstree().refresh()
          }else{          
            $('#models-jstree').jstree().refresh_node(node);
          }
          self.selectNode(node, body.File)
          if(from === "SBML" && body.errors.length > 0){
            var title = ""
            var msg = body.message
            var errors = body.errors
            let modal = $(sbmlToModelHtml(msg, errors)).modal();
          }
        }
      }
    );
  },
  toNotebook: function (o) {
    let self = this
    var endpoint = path.join(app.getApiPath(), "/models/to-notebook", o.original._path)
    xhr({ uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400){
        var node = $('#models-jstree').jstree().get_node(o.parent)
        if(node.type === 'root'){
          $('#models-jstree').jstree().refresh();
        }else{
          $('#models-jstree').jstree().refresh_node(node);
        }
        var notebookPath = path.join(app.getBasePath(), "notebooks", body.FilePath)
        self.selectNode(node, body.File)
        window.open(notebookPath, '_blank')
      }
    });
  },
  toSBML: function (o) {
    var self = this;
    var parentID = o.parent;
    var endpoint = path.join(app.getApiPath(), "model/to-sbml", o.original._path);
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh()
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
        self.selectNode(node, body.File)
      }
    });
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
        var endpoint = path.join(app.getApiPath(), "/file/rename", o.original._path, "<--change-->", node.text)
        xhr({uri: endpoint, json: true}, function (err, response, body){
          if(response.statusCode < 400) {
            if(body.changed) {
              nameWarning.text(body.message)
              nameWarning.collapse('show');
              window.scrollTo(0,0)
              setTimeout(_.bind(self.hideNameWarning, self), 10000);
            }
            node.original._path = body._path
          }
          if(text.split('.').pop() != node.text.split('.').pop()){
            if(parent.type === "root"){
              $('#models-jstree').jstree().refresh()
            }else{          
              $('#models-jstree').jstree().refresh_node(parent);
            }
          }
        })
      }
      extensionWarning.collapse('hide');
      nameWarning.collapse('hide');
    });
  },
  hideNameWarning: function () {
    $(this.queryByHook('rename-warning')).collapse('hide')
  },
  getJsonFileForExport: function (o) {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "json-data", o.original._path);
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        self.exportToJsonFile(body, o.original.text);
      }
    });
  },
  getFileForExport: function (o) {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "file/download", o.original._path);
    xhr({uri: endpoint}, function (err, response, body) {
      if(response.statusCode < 400){
        self.exportToFile(body, o.original.text);
      }else{
        body = JSON.parse(body)
      }
    });
  },
  getZipFileForExport: function (o) {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "file/download-zip/generate", o.original._path);
    xhr({uri: endpoint,json:true}, function (err, response, body) {
      if(response.statusCode < 400) {
        var node = $('#models-jstree').jstree().get_node(o.parent);
        if(node.type === "root"){
          $('#models-jstree').jstree().refresh();
        }else{
          $('#models-jstree').jstree().refresh_node(node);
        }
        self.exportToZipFile(body.Path)
      }
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
  exportToZipFile: function (o) {
    var targetPath = o
    if(o.original){
      targetPath = o.original._path
    }
    var endpoint = path.join(app.getBasePath(), "/files", targetPath);
    window.location.href = endpoint
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
        var parentPath = "/"
        if(o && o.original){
          parentPath = o.original._path
        }
        if(isModel) {
          let modelName = input.value + '.mdl';
          var modelPath = path.join(app.getBasePath(), app.routePrefix, 'models/edit', parentPath, modelName);
          window.location.href = modelPath;
        }else{
          let dirName = input.value;
          let endpoint = path.join(app.getApiPath(), "/directory/create", parentPath, dirName);
          xhr({uri:endpoint}, function (err, response, body) {
            if(response.statusCode < 400){
              if(o){//directory was created with context menu option
                var node = $('#models-jstree').jstree().get_node(o);
                if(node.type === "root"){
                  $('#models-jstree').jstree().refresh()
                }else{          
                  $('#models-jstree').jstree().refresh_node(node);
                }
              }else{//directory was created with create directory button
                $('#models-jstree').jstree().refresh()
              }
            }else{//new directory not created no need to refresh
              body = JSON.parse(body)
            }
          });
          modal.modal('hide')
        }
      }
    });
  },
  handleCreateDirectoryClick: function (e) {
    this.newModelOrDirectory(undefined, false, false);
  },
  handleCreateModelClick: function (e) {
    let isSpatial = false
    this.newModelOrDirectory(undefined, true, isSpatial);
  },
  showContextMenuForNode: function (e) {
    $('#models-jstree').jstree().show_contextmenu(this.nodeForContextMenu)
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
          "New_Directory" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "New Directory",
            "action" : function (data) {
              self.newModelOrDirectory(o, false, false);
            }
          },
          "New_model" : {
            "label" : "New Model",
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
          "Upload" : {
            "label" : "Upload File",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "submenu" : {
              "Model" : {
                "label" : "StochSS Model",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  self.uploadFile(o, "model")
                }
              },
              "SBML" : {
                "label" : "SBML Model",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  self.uploadFile(o, "sbml")
                }
              },
              "File" : {
                "label" : "File",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  self.uploadFile(o, "file")
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
          "New_Directory" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "New Directory",
            "action" : function (data) {
              self.newModelOrDirectory(o, false, false);
            }
          },
          "New_model" : {
            "label" : "New Model",
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
          "Upload" : {
            "label" : "Upload File",
            "_disabled" : false,
            "separator_before" : false,
            "separator_after" : false,
            "submenu" : {
              "Model" : {
                "label" : "StochSS Model",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  self.uploadFile(o, "model")
                }
              },
              "SBML" : {
                "label" : "SBML Model",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  self.uploadFile(o, "sbml")
                }
              },
              "File" : {
                "label" : "File",
                "_disabled" : false,
                "separator_before" : false,
                "separator_after" : false,
                "action" : function (data) {
                  self.uploadFile(o, "file")
                }
              }
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download as .zip",
            "action" : function (data) {
              self.getZipFileForExport(o);
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
              self.duplicateFileOrDirectory(o, "directory")
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
            "_disabled" : true,
            "_class" : "font-weight-bolder",
            "label" : "Edit",
            "action" : function (data) {
              window.location.href = path.join(app.getBasePath(), "stochss/models/edit", o.original._path);
            }
          },
          "Convert" : {
            "label" : "Convert",
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "submenu" : {
              "Convert to Model" : {
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
            }
          },
          "New Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "New Workflow",
            "action" : function (data) {
              window.location.href = path.join(app.getBasePath(), "stochss/workflow/selection", o.original._path);
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
              self.duplicateFileOrDirectory(o, "model")
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
              window.location.href = path.join(app.getBasePath(), "stochss/models/edit", o.original._path);
            }
          },
          "Convert" : {
            "label" : "Convert",
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "submenu" : {
              "Convert to Spatial" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : true,
                "label" : "To Spatial Model",
                "action" : function (data) {
                  self.toSpatial(o)
                }
              },
              "Convert to Notebook" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : false,
                "label" : "To Notebook",
                "action" : function (data) {
                  self.toNotebook(o)
                }
              },
              "Convert to SBML" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : false,
                "label" : "To SBML Model",
                "action" : function (data) {
                  self.toSBML(o)
                }
              },
            }
          },
          "New Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "New Workflow",
            "action" : function (data) {
              window.location.href = path.join(app.getBasePath(), "stochss/workflow/selection", o.original._path);
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download",
            "action" : function (data) {
              self.getJsonFileForExport(o);
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
              self.duplicateFileOrDirectory(o, "model")
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
          "Open" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Open",
            "action" : function (data) {
              window.location.href = path.join(app.getBasePath(), "stochss/workflow/edit/none", o.original._path);
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
          "Stop Workflow" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : true,
            "label" : "Stop Workflow",
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
              "Extract" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : false,
                "label" : "Extract",
                "action" : function (data) {
                  self.duplicateFileOrDirectory(o, "wkfl_model")
                }
              }
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download as .zip",
            "action" : function (data) {
              self.getZipFileForExport(o);
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
            "label" : "Duplicate as new",
            "action" : function (data) {
              self.duplicateFileOrDirectory(o, "workflow")
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
          "Open" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Open",
            "action" : function (data) {
              window.open(path.join(app.getBasePath(), "notebooks", o.original._path));
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download",
            "action" : function (data) {
              self.getJsonFileForExport(o);
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
              self.duplicateFileOrDirectory(o, "file")
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
          "Open" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Open File",
            "action" : function (data) {
              var filePath = o.original._path
              window.open(path.join(app.getBasePath(), "edit", filePath), '_blank')
            }
          },
          "Convert" : {
            "label" : "Convert",
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "submenu" : {
              "Convert to Model" : {
                "separator_before" : false,
                "separator_after" : false,
                "_disabled" : false,
                "label" : "To Model",
                "action" : function (data) {
                  self.toModel(o, "SBML");
                }
              },
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download",
            "action" : function (data) {
              self.getFileForExport(o);
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
              self.duplicateFileOrDirectory(o, "file")
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
          "Open" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "Open",
            "action" : function (data) {
              var openPath = path.join(app.getBasePath(), "edit", o.original._path);
              window.open(openPath, "_blank");
            }
          },
          "Download" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Download as .zip",
            "action" : function (data) {
              if(o.original.text.endsWith('.zip')){
                self.exportToZipFile(o);
              }else{
                self.getZipFileForExport(o)
              }
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
              self.duplicateFileOrDirectory(o, "file")
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
      }else{
        let optionsButton = $(self.queryByHook("options-for-node"))
        if(!self.nodeForContextMenu){
          optionsButton.prop('disabled', false)
        }
        optionsButton.text("Options for " + node.original.text)
        self.nodeForContextMenu = node;
      }
    });
    $('#models-jstree').on('dblclick.jstree', function(e) {
      var file = e.target.text
      var node = $('#models-jstree').jstree().get_node(e.target)
      var _path = node.original._path;
      if(file.endsWith('.mdl') || file.endsWith('.smdl')){
        window.location.href = path.join(app.getBasePath(), "stochss/models/edit", _path);
      }else if(file.endsWith('.ipynb')){
        var notebookPath = path.join(app.getBasePath(), "notebooks", _path)
        window.open(notebookPath, '_blank')
      }else if(file.endsWith('.sbml')){
        var openPath = path.join(app.getBasePath(), "edit", _path)
        window.open(openPath, '_blank')
      }else if(file.endsWith('.wkfl')){
        window.location.href = path.join(app.getBasePath(), "stochss/workflow/edit/none", _path);
      }else if(node.type === "folder" && $('#models-jstree').jstree().is_open(node) && $('#models-jstree').jstree().is_loaded(node)){
        $('#models-jstree').jstree().refresh_node(node)
      }else if(node.type === "other"){
        var openPath = path.join(app.getBasePath(), "edit", _path);
        window.open(openPath, "_blank");
      }
    });
  }
});

initPage(FileBrowser);
