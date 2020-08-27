let jstree = require('jstree');
let path = require('path');
let xhr = require('xhr');
let $ = require('jquery');
let _ = require('underscore');
//support files
let app = require('../app');
let modals = require('../modals');
//views
let PageView = require('./base');
//templates
let template = require('../templates/pages/fileBrowser.pug');

import initPage from './page.js';

let FileBrowser = PageView.extend({
  pageTitle: 'StochSS | File Browser',
  template: template,
  events: {
    'click [data-hook=refresh-jstree]' : 'refreshJSTree',
    'click [data-hook=options-for-node]' : 'showContextMenuForNode',
    'click [data-hook=new-directory]' : 'handleCreateDirectoryClick',
    'click [data-hook=new-project]' : 'handleCreateProjectClick',
    'click [data-hook=new-model]' : 'handleCreateModelClick',
    'click [data-hook=upload-file-btn]' : 'handleUploadFileClick',
    'click [data-hook=file-browser-help]' : function () {
      let modal = $(modals.operationInfoModalHtml('file-browser')).modal();
    },
  },
  initialize: function (attrs, options) {
    PageView.prototype.initialize.apply(this, arguments)
    var self = this
    this.root = "none"
    this.ajaxData = {
      "url" : function (node) {
        if(node.parent === null){
          return path.join(app.getApiPath(), "file/browser-list")+"?path="+self.root
        }
        return path.join(app.getApiPath(), "file/browser-list")+"?path="+ node.original._path
      },
      "dataType" : "json",
      "data" : function (node) {
        return { 'id' : node.id}
      },
    }
    this.treeSettings = {
      'plugins': ['types', 'wholerow', 'changed', 'contextmenu', 'dnd'],
      'core': {'multiple' : false, 'animation': 0,
        'check_callback': function (op, node, par, pos, more) {
          if(op === 'move_node' && node && node.type && node.type === "workflow" && node.original && node.original._status && node.original._status === "running"){
            return false
          }
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
            var newDir = par.type !== "root" ? par.original._path : ""
            var file = node.original._path.split('/').pop()
            var oldPath = node.original._path
            let queryStr = "?srcPath="+oldPath+"&dstPath="+path.join(newDir, file)
            var endpoint = path.join(app.getApiPath(), "file/move")+queryStr
            xhr({uri: endpoint}, function(err, response, body) {
              if(response.statusCode < 400) {
                node.original._path = path.join(newDir, file)
              }else{
                body = JSON.parse(body)
                $('#models-jstree').jstree().refresh()
              }
            });
          }
          return true
        },
        'themes': {'stripes': true, 'variant': 'large'},
        'data': this.ajaxData,
      },
      'types' : {
        'root' : {"icon": "jstree-icon jstree-folder"},
        'folder' : {"icon": "jstree-icon jstree-folder"},
        'spatial' : {"icon": "jstree-icon jstree-file"},
        'nonspatial' : {"icon": "jstree-icon jstree-file"},
        'project' : {"icon": "jstree-icon jstree-file"},
        'workflow-group' : {"icon": "jstree-icon jstree-file"},
        'workflow' : {"icon": "jstree-icon jstree-file"},
        'notebook' : {"icon": "jstree-icon jstree-file"},
        'mesh' : {"icon": "jstree-icon jstree-file"},
        'sbml-model' : {"icon": "jstree-icon jstree-file"},
        'other' : {"icon": "jstree-icon jstree-file"},
      },  
    }
  },
  render: function () {
    var self = this;
    this.nodeForContextMenu = "";
    this.renderWithTemplate();
    this.jstreeIsLoaded = false
    window.addEventListener('pageshow', function (e) {
      var navType = window.performance.navigation.type
      if(navType === 2){
        window.location.reload()
      }
    });
    this.setupJstree(function () {
      setTimeout(function () {
        self.refreshInitialJSTree();
      }, 3000);
    });
  },
  refreshJSTree: function () {
    this.jstreeIsLoaded = false
    $('#models-jstree').jstree().deselect_all(true)
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
    if(!this.jstreeIsLoaded || !$('#models-jstree').jstree().is_loaded(node) && $('#models-jstree').jstree().is_loading(node)) {
      setTimeout(_.bind(self.selectNode, self, node, fileName), 1000);
    }else{
      node = $('#models-jstree').jstree().get_node(node)
      var child = ""
      for(var i = 0; i < node.children.length; i++) {
        var child = $('#models-jstree').jstree().get_node(node.children[i])
        if(child.original.text === fileName) {
          $('#models-jstree').jstree().select_node(child)
          let optionsButton = $(self.queryByHook("options-for-node"))
          if(!self.nodeForContextMenu){
            optionsButton.prop('disabled', false)
          }
          optionsButton.text("Actions for " + child.original.text)
          self.nodeForContextMenu = child;
          break
        }
      }
    }
  },
  handleUploadFileClick: function (e) {
    let type = e.target.dataset.type
    this.uploadFile(undefined, type)
  },
  uploadFile: function (o, type) {
    var self = this
    if(document.querySelector('#uploadFileModal')) {
      document.querySelector('#uploadFileModal').remove()
    }
    let modal = $(modals.uploadFileHtml(type)).modal();
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
        fileinfo.name = input.value.trim()
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
              self.refreshJSTree();
            }else{
              $('#models-jstree').jstree().refresh_node(node);
            }
          }else{
            self.refreshJSTree();
          }
          if(resp.errors.length > 0){
            let errorModal = $(modals.uploadFileErrorsHtml(file.name, type, resp.message, resp.errors)).modal();
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
    let modal = $(modals.deleteFileHtml(fileType)).modal();
    let yesBtn = document.querySelector('#deleteFileModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      var endpoint = path.join(app.getApiPath(), "file/delete")+"?path="+o.original._path
      xhr({uri: endpoint}, function(err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(o.parent);
          if(node.type === "root"){
            self.refreshJSTree();
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
    var queryStr = "?path="+o.original._path
    if(!type && o.original.type === 'folder'){
      type = "directory"
    }else if(!type && o.original.type === 'workflow'){
      type = "workflow"
    }else if(!type){
      type = "file"
    }
    if(type === "directory"){
      var identifier = "directory/duplicate"
    }else if(type === "workflow" || type === "wkfl_model"){
      var timeStamp = type === "workflow" ? this.getTimeStamp() : "None"
      var identifier = "workflow/duplicate"
      queryStr = queryStr.concat("&target="+type+"&stamp="+timeStamp)
    }else{
      var identifier = "file/duplicate"
    }
    var endpoint = path.join(app.getApiPath(), identifier)+queryStr
    xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(parentID);
          if(node.type === "root"){
            self.refreshJSTree()
          }else{          
            $('#models-jstree').jstree().refresh_node(node);
          }
          if(type === "workflow"){
            var message = ""
            if(body.error){
              message = body.error
            }else{
              message = "The model for <b>"+body.File+"</b> is located here: <b>"+body.mdlPath+"</b>"
            }
            let modal = $(modals.duplicateWorkflowHtml(body.File, message)).modal()
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
    var endpoint = path.join(app.getApiPath(), "model/to-spatial")+"?path="+o.original._path;
    xhr({uri: endpoint, json: true}, 
      function (err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(parentID);
          if(node.type === "root"){
            self.refreshJSTree()
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
      var identifier = "spatial/to-model"
    }else{
      var identifier = "sbml/to-model"
    }
    let endpoint = path.join(app.getApiPath(), identifier)+"?path="+o.original._path;
    xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          var node = $('#models-jstree').jstree().get_node(parentID);
          if(node.type === "root"){
            self.refreshJSTree()
          }else{          
            $('#models-jstree').jstree().refresh_node(node);
          }
          self.selectNode(node, body.File)
          if(from === "SBML" && body.errors.length > 0){
            var title = ""
            var msg = body.message
            var errors = body.errors
            let modal = $(modals.sbmlToModelHtml(msg, errors)).modal();
          }
        }
      }
    );
  },
  toNotebook: function (o, type) {
    let self = this
    var endpoint = ""
    if(type === "model"){
      endpoint = path.join(app.getApiPath(), "model/to-notebook")+"?path="+o.original._path
    }else{
      endpoint = path.join(app.getApiPath(), "workflow/notebook")+"?type=none&path="+o.original._path
    }
    xhr({ uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400){
        var node = $('#models-jstree').jstree().get_node(o.parent)
        if(node.type === 'root'){
          self.refreshJSTree();
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
    var endpoint = path.join(app.getApiPath(), "model/to-sbml")+"?path="+o.original._path;
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          self.refreshJSTree()
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
        var endpoint = path.join(app.getApiPath(), "file/rename")+"?path="+ o.original._path+"&name="+node.text
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
              self.refreshJSTree()
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
  getExportData: function (o, asZip) {
    var self = this;
    let nodeType = o.original.type
    let isJSON = nodeType === "sbml-model" ? false : true
    if(nodeType === "sbml-model"){
      var dataType = "plain-text"
      var identifier = "file/download"
    }else if(asZip) {
      var dataType = "zip"
      var identifier = "file/download-zip"
    }else{
      var dataType = "json"
      var identifier = "file/json-data"
    }
    var queryStr = "?path="+o.original._path
    if(dataType === "json"){
      queryStr = queryStr.concat("&for=None")
    }else if(dataType === "zip"){
      queryStr = queryStr.concat("&action=generate")
    }
    var endpoint = path.join(app.getApiPath(), identifier)+queryStr
    xhr({uri: endpoint, json: isJSON}, function (err, response, body) {
      if(response.statusCode < 400) {
        if(dataType === "json") {
          self.exportToJsonFile(body, o.original.text);
        }else if(dataType === "zip") {
          var node = $('#models-jstree').jstree().get_node(o.parent);
          if(node.type === "root"){
            self.refreshJSTree();
          }else{
            $('#models-jstree').jstree().refresh_node(node);
          }
          self.exportToZipFile(body.Path)
        }else{
          self.exportToFile(body, o.original.text);
        }
      }else{
        if(dataType === "plain-text") {
          body = JSON.parse(body)
        }
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
  newProjectOrWorkflowGroup: function (o, isProject) {
    var self = this
    if(document.querySelector("#newProjectModal")) {
      document.querySelector("#newProjectModal").remove()
    }
    if(document.querySelector("#newWorkflowGroupModal")) {
      document.querySelector("#newWorkflowGroupModal").remove()
    }
    var modal = ""
    var okBtn = ""
    var input = ""
    if(isProject) {
      modal = $(modals.newProjectModalHtml()).modal();
      okBtn = document.querySelector('#newProjectModal .ok-model-btn');
      input = document.querySelector('#newProjectModal #projectNameInput');
    }else{
      modal = $(modals.newWorkflowGroupModalHtml()).modal();
      okBtn = document.querySelector('#newWorkflowGroupModal .ok-model-btn');
      input = document.querySelector('#newWorkflowGroupModal #workflowGroupNameInput');
    }
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        var parentPath = ""
        if(o && o.original && o.original.type !== "root") {
          parentPath = o.original._path
        }
        var endpoint = ""
        if(isProject){
          var projectName = input.value.trim() + ".proj"
          var projectPath = path.join(parentPath, projectName)
          endpoint = path.join(app.getApiPath(), "project/new-project")+"?path="+projectPath
        }else{
          var workflowGroupName = input.value.trim() + ".wkgp"
          var workflowGroupPath = path.join(parentPath, workflowGroupName)
          endpoint = path.join(app.getApiPath(), "project/new-workflow-group")+"?path="+workflowGroupPath
        }
        xhr({uri: endpoint,json: true}, function (err, response, body) {
          if(response.statusCode < 400) {
            if(isProject) {
              if(o){//directory was created with context menu option
                var node = $('#models-jstree').jstree().get_node(o);
                if(node.type === "root"){
                  self.refreshJSTree()
                }else{          
                  $('#models-jstree').jstree().refresh_node(node);
                }
              }else{//directory was created with create directory button
                self.refreshJSTree()
              }
            }else{
              let successModal = $(modals.newWorkflowGroupSuccessHtml(body.message)).modal()
            }
          }else{
            let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(body.Reason, body.Message)).modal()
          }
          modal.modal('hide')
        })
      }
    })
  },
  addExistingModel: function (o) {
    var self = this
    if(document.querySelector('#newProjectModelModal')){
      document.querySelector('#newProjectModelModal').remove()
    }
    let modal = $(modals.newProjectModelHtml()).modal()
    let okBtn = document.querySelector('#newProjectModelModal .ok-model-btn')
    let input = document.querySelector('#newProjectModelModal #modelPathInput')
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        let queryString = "?path="+o.original._path+"&mdlPath="+input.value.trim()
        let endpoint = path.join(app.getApiPath(), 'project/add-existing-model') + queryString
        xhr({uri:endpoint, json:true}, function (err, response, body) {
          if(response.statusCode < 400) {
            let successModal = $(modals.newProjectModelSuccessHtml(body.message)).modal()
          }else{
            let errorModal = $(modals.newProjectModelErrorHtml(body.Reason, body.Message)).modal()
          }
        });
        modal.modal('hide')
      }
    });
  },
  newModelOrDirectory: function (o, isModel, isSpatial) {
    var self = this
    if(document.querySelector('#newModalModel')) {
      document.querySelector('#newModalModel').remove()
    }
    let modal = $(modals.renderCreateModalHtml(isModel, isSpatial)).modal();
    let okBtn = document.querySelector('#newModalModel .ok-model-btn');
    let input = document.querySelector('#newModalModel #modelNameInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    okBtn.addEventListener('click', function (e) {
      if (Boolean(input.value)) {
        var parentPath = ""
        if(o && o.original && o.original.type !== "root"){
          parentPath = o.original._path
        }
        if(isModel) {
          let modelName = o && o.type === "project" ? input.value.trim().split("/").pop() + '.mdl' : input.value.trim() + '.mdl';
          let message = modelName.split(".")[0] !== input.value.trim() ? 
                "Warning: Models are saved directly in StochSS Projects and cannot be saved to the "+input.value.trim().split("/")[0]+" directory in the project.<br><p>Your model will be saved directly in your project.</p>" : ""
          let modelPath = path.join(parentPath, modelName)
          let endpoint = path.join(app.getBasePath(), app.routePrefix, 'models/edit')+"?path="+modelPath+"&message="+message;
          if(message){
            modal.modal('hide')
            let warningModal = $(modals.newProjectModelWarningHtml(message)).modal()
            let yesBtn = document.querySelector('#newProjectModelWarningModal .yes-modal-btn');
            yesBtn.addEventListener('click', function (e) {window.location.href = endpoint;})
          }else{
            window.location.href = endpoint;
          }
        }else{
          let dirName = input.value.trim();
          let endpoint = path.join(app.getApiPath(), "directory/create")+"?path="+path.join(parentPath, dirName);
          xhr({uri:endpoint}, function (err, response, body) {
            if(response.statusCode < 400){
              if(o){//directory was created with context menu option
                var node = $('#models-jstree').jstree().get_node(o);
                if(node.type === "root"){
                  self.refreshJSTree()
                }else{          
                  $('#models-jstree').jstree().refresh_node(node);
                }
              }else{//directory was created with create directory button
                self.refreshJSTree()
              }
            }else{//new directory not created no need to refresh
              body = JSON.parse(body)
              let errorModal = $(modals.newDirectoryErrorHtml(body.Reason, body.Message)).modal()
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
  handleCreateProjectClick: function (e) {
    this.newProjectOrWorkflowGroup(undefined, true)
  },
  handleCreateModelClick: function (e) {
    let isSpatial = false
    this.newModelOrDirectory(undefined, true, isSpatial);
  },
  showContextMenuForNode: function (e) {
    $('#models-jstree').jstree().show_contextmenu(this.nodeForContextMenu)
  },
  editWorkflowModel: function (o) {
    let endpoint = path.join(app.getApiPath(), "workflow/edit-model")+"?path="+o.original._path
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode < 400) {
        if(body.error){
          let title = o.text + " Not Found"
          let message = body.error
          let modal = $(modals.duplicateWorkflowHtml(title, message)).modal()
        }else{
          window.location.href = path.join(app.routePrefix, "models/edit")+"?path="+body.file
        }
      }
    });
  },
  setupJstree: function () {
    var self = this;
    $.jstree.defaults.contextmenu.items = (o, cb) => {
      let nodeType = o.original.type
      let zipTypes = ["workflow", "folder", "other", "mesh", "project", "workflow-group"]
      let asZip = zipTypes.includes(nodeType)
      // common to all type except root
      let common = {
        "Download" : {
          "label" : asZip ? "Download as .zip" : "Download",
          "_disabled" : false,
          "separator_before" : true,
          "separator_after" : false,
          "action" : function (data) {
            if(o.original.text.endsWith('.zip')){
              self.exportToZipFile(o);
            }else{
              self.getExportData(o, asZip)
            }
          }
        },
        "Rename" : {
          "label" : "Rename",
          "_disabled" : (o.type === "workflow" && o.original._status === "running"),
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.renameNode(o);
          }
        },
        "Duplicate" : {
          "label" : (nodeType === "workflow") ? "Duplicate as new" : "Duplicate",
          "_disabled" : (nodeType === "project"),
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.duplicateFileOrDirectory(o, null)
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
        }
      }
      // common to root and folders
      let folder = {
        "Refresh" : {
          "label" : "Refresh",
          "_disabled" : false,
          "_class" : "font-weight-bold",
          "separator_before" : false,
          "separator_after" : true,
          "action" : function (data) {
            if(nodeType === "root"){
              self.refreshJSTree();
            }else{
              $('#models-jstree').jstree().refresh_node(o);
            }
          }
        },
        "New_Directory" : {
          "label" : "New Directory",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.newModelOrDirectory(o, false, false);
          }
        },
        "New Project" : {
          "label" : "New Project",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.newProjectOrWorkflowGroup(o, true)
          }
        },
        "New_model" : {
          "label" : "New Model",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "submenu" : {
            "spatial" : {
              "label" : "Spatial",
              "_disabled" : true,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                console.log("Spatial Models Coming Soon!")
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
        }
      }
      // common to both spatial and non-spatial models
      let model = {
        "Edit" : {
          "label" : "Edit",
          "_disabled" : (nodeType === "spatial") ? true : false,
          "_class" : "font-weight-bolder",
          "separator_before" : false,
          "separator_after" : true,
          "action" : function (data) {
            window.location.href = path.join(app.getBasePath(), "stochss/models/edit")+"?path="+o.original._path;
          }
        },
        "New Workflow" : {
          "label" : "New Workflow",
          "_disabled" : (nodeType === "spatial") ? true : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            window.location.href = path.join(app.getBasePath(), "stochss/workflow/selection")+"?path="+o.original._path;
          }
        }
      }
      // convert options for spatial models
      let spatialConvert = {
        "Convert" : {
          "label" : "Convert",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "submenu" : {
            "Convert to Model" : {
              "label" : "Convert to Non Spatial",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.toModel(o, "Spatial");
              }
            },
            "Convert to Notebook" : {
              "label" : "Convert to Notebook",
              "_disabled" : true,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
              }
            }
          }
        }
      }
      // convert options for non-spatial models
      let modelConvert = {
        "Convert" : {
          "label" : "Convert",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "submenu" : {
            "Convert to Spatial" : {
              "label" : "To Spatial Model",
              "_disabled" : true,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.toSpatial(o)
              }
            },
            "Convert to Notebook" : {
              "label" : "To Notebook",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.toNotebook(o, "model")
              }
            },
            "Convert to SBML" : {
              "label" : "To SBML Model",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.toSBML(o)
              }
            }
          }
        }
      }
      // For notebooks, workflows, sbml models, and other files
      let open = {
        "Open" : {
          "label" : "Open",
          "_disabled" : false,
          "_class" : "font-weight-bolder",
          "separator_before" : false,
          "separator_after" : true,
          "action" : function (data) {
            if(nodeType === "workflow"){
              window.location.href = path.join(app.getBasePath(), "stochss/workflow/edit")+"?path="+o.original._path+"&type=none";
            }else if(nodeType === "project"){
              window.location.href = path.join(app.getBasePath(), "stochss/project/manager")+"?path="+o.original._path
            }else{
              if(nodeType === "notebook") {
                var identifier = "notebooks"
              }else if(nodeType === "sbml-model") {
                var identifier = "edit"
              }else{
                var identifier = "view"
              }
              window.open(path.join(app.getBasePath(), identifier, o.original._path));
            }
          }
        }
      }
      let project = {
        "Add Model" : {
          "label" : "Add Model",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "submenu" : {
            "New Model" : folder.New_model,
            "Existing Model" : {
              "label" : "Existing Model",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.addExistingModel(o)
              }
            }
          }
        },
        "New Workflow Group" : {
          "label" : "New Workflow Group",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.newProjectOrWorkflowGroup(o, false)
          }
        }
      }
      // specific to workflows
      let workflow = {
        "Convert to Notebook" : {
          "label" : "To Notebook",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.toNotebook(o, "workflow")
          }
        },
        "Start/Restart Workflow" : {
          "label" : (o.original._status === "ready") ? "Start Workflow" : "Restart Workflow",
          "_disabled" : true,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {

          }
        },
        "Stop Workflow" : {
          "label" : "Stop Workflow",
          "_disabled" : true,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {

          }
        },
        "Model" : {
          "label" : "Model",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "submenu" : {
            "Edit" : {
              "label" : " Edit",
              "_disabled" : !(o.original._status === "ready"),
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.editWorkflowModel(o)
              }
            },
            "Extract" : {
              "label" : "Extract",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.duplicateFileOrDirectory(o, "wkfl_model")
              }
            }
          }
        }
      }
      // Specific to sbml files
      let sbml = {
        "Convert" : {
          "label" : "Convert",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "submenu" : {
            "Convert to Model" : {
              "label" : "To Model",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.toModel(o, "SBML");
              }
            }
          }
        }
      }
      if (o.type === 'root'){
        return folder
      }
      if (o.type ===  'folder') {
        return $.extend(folder, common)
      }
      if (o.type === 'spatial') {
        return $.extend(model, spatialConvert, common)
      }
      if (o.type === 'nonspatial') {
         return $.extend(model, modelConvert, common)
      }
      if (o.type === 'project'){
        return $.extend(open, project, common)
      }
      if (o.type === 'workflow') {
        return $.extend(open, workflow, common)
      }
      if (o.type === 'notebook' || o.type === "other") {
        return $.extend(open, common)
      }
      if (o.type === 'sbml-model') {
        return $.extend(open, sbml, common)
      }
    }
    $(document).on('shown.bs.modal', function (e) {
      $('[autofocus]', e.target).focus();
    });
    $(document).on('dnd_start.vakata', function (data, element, helper, event) {
      $('#models-jstree').jstree().load_all()
    });
    $('#models-jstree').jstree(this.treeSettings).bind("loaded.jstree", function (event, data) {
      self.jstreeIsLoaded = true
    }).bind("refresh.jstree", function (event, data) {
      self.jstreeIsLoaded = true
    });
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
        optionsButton.text("Actions for " + node.original.text)
        self.nodeForContextMenu = node;
      }
    });
    $('#models-jstree').on('dblclick.jstree', function(e) {
      var file = e.target.text
      var node = $('#models-jstree').jstree().get_node(e.target)
      var _path = node.original._path;
      if(file.endsWith('.mdl') || file.endsWith('.smdl')){
        window.location.href = path.join(app.getBasePath(), "stochss/models/edit")+"?path="+_path;
      }else if(file.endsWith('.ipynb')){
        var notebookPath = path.join(app.getBasePath(), "notebooks", _path)
        window.open(notebookPath, '_blank')
      }else if(file.endsWith('.sbml')){
        var openPath = path.join(app.getBasePath(), "edit", _path)
        window.open(openPath, '_blank')
      }else if(file.endsWith('.proj')){
        window.location.href = path.join(app.getBasePath(), "stochss/project/manager")+"?path="+_path;
      }else if(file.endsWith('.wkfl')){
        window.location.href = path.join(app.getBasePath(), "stochss/workflow/edit")+"?path="+_path+"&type=none";
      }else if(node.type === "folder" && $('#models-jstree').jstree().is_open(node) && $('#models-jstree').jstree().is_loaded(node)){
        $('#models-jstree').jstree().refresh_node(node)
      }else if(node.type === "other"){
        var openPath = path.join(app.getBasePath(), "view", _path);
        window.open(openPath, "_blank");
      }
    });
  }
});

initPage(FileBrowser);
