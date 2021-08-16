/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

let jstree = require('jstree');
let path = require('path');
let $ = require('jquery');
let _ = require('underscore');
//support files
let app = require('../app');
let modals = require('../modals');
//models
let Model = require('../models/model');
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
    'click [data-hook=new-domain]' : 'handleCreateDomain',
    'click [data-hook=upload-file-btn]' : 'handleUploadFileClick',
    'click [data-hook=file-browser-help]' : function () {
      let modal = $(modals.operationInfoModalHtml('file-browser')).modal();
    },
    'click [data-hook=empty-trash]' : 'emptyTrash'
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
          if(op === "rename_node" && self.validateName(pos, true) !== ""){
            document.querySelector("#renameSpecialCharError").style.display = "block"
            setTimeout(function () {
              document.querySelector("#renameSpecialCharError").style.display = "none"
            }, 5000)
            return false
          }
          if(op === 'move_node' && node && node.type && node.type === "workflow" && node.original && node.original._status && node.original._status === "running"){
            return false
          }
          if(op === 'move_node' && more && more.ref && more.ref.type && !(more.ref.type == 'folder' || more.ref.type == 'root')){
            return false
          }
          if(op === 'move_node' && more && more.ref && more.ref.original && path.dirname(more.ref.original._path).split("/").includes("trash")){
            return false
          }
          if(op === 'move_node' && more && more.ref && more.ref.type && more.ref.type === 'folder' && more.ref.text !== "trash"){
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
            app.getXHR(endpoint, {
              success: function (err, response, body) {
                node.original._path = path.join(newDir, file);
                if(node.type === "folder") {
                  $('#models-jstree').jstree().refresh_node(node);
                }else if(newDir.endsWith("trash")) {
                  $(self.queryByHook('empty-trash')).prop('disabled', false);
                  $('#models-jstree').jstree().refresh_node(par);
                }else if(oldPath.split("/").includes("trash")) {
                  $('#models-jstree').jstree().refresh_node(par);
                }
              },
              error: function (err, response, body) {
                body = JSON.parse(body);
                $('#models-jstree').jstree().refresh();
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
        'domain' : {"icon": "jstree-icon jstree-file"},
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
    $(document).on('hide.bs.modal', '.modal', function (e) {
      e.target.remove()
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
    if(this.browser == undefined) {
      this.browser = app.getBrowser();
    }
    if(this.isSafariV14Plus == undefined){
      this.isSafariV14Plus = (this.browser.name === "Safari" && this.browser.version >= 14)
    }
    let modal = $(modals.uploadFileHtml(type, this.isSafariV14Plus)).modal();
    let uploadBtn = document.querySelector('#uploadFileModal .upload-modal-btn');
    let fileInput = document.querySelector('#uploadFileModal #fileForUpload');
    let input = document.querySelector('#uploadFileModal #fileNameInput');
    let fileCharErrMsg = document.querySelector('#uploadFileModal #fileSpecCharError')
    let nameEndErrMsg = document.querySelector('#uploadFileModal #fileNameInputEndCharError')
    let nameCharErrMsg = document.querySelector('#uploadFileModal #fileNameInputSpecCharError')
    let nameUsageMsg = document.querySelector('#uploadFileModal #fileNameUsageMessage')
    fileInput.addEventListener('change', function (e) {
      let fileErr = !fileInput.files.length ? "" : self.validateName(fileInput.files[0].name)
      let nameErr = self.validateName(input.value)
      if(!fileInput.files.length) {
        uploadBtn.disabled = true
        fileCharErrMsg.style.display = 'none'
      }else if(fileErr === "" || (Boolean(input.value) && nameErr === "")){
        uploadBtn.disabled = false
        fileCharErrMsg.style.display = 'none'
      }else{
        uploadBtn.disabled = true
        fileCharErrMsg.style.display = 'block'
      }
    })
    input.addEventListener("input", function (e) {
      let fileErr = !fileInput.files.length ? "" : self.validateName(fileInput.files[0].name)
      let nameErr = self.validateName(input.value)
      if(!fileInput.files.length) {
        uploadBtn.disabled = true
        fileCharErrMsg.style.display = 'none'
      }else if(fileErr === "" || (Boolean(input.value) && nameErr === "")){
        uploadBtn.disabled = false
        fileCharErrMsg.style.display = 'none'
      }else{
        uploadBtn.disabled = true
        fileCharErrMsg.style.display = 'block'
      }
      nameCharErrMsg.style.display = nameErr === "both" || nameErr === "special" ? "block" : "none"
      nameEndErrMsg.style.display = nameErr === "both" || nameErr === "forward" ? "block" : "none"
      nameUsageMsg.style.display = nameErr !== "" ? "block" : "none"
    });
    uploadBtn.addEventListener('click', function (e) {
      let file = fileInput.files[0]
      var fileinfo = {"type":type,"name":"","path":"/"}
      if(o && o.original){
        fileinfo.path = o.original._path
      }
      if(Boolean(input.value) && self.validateName(input.value) === ""){
        fileinfo.name = input.value.trim()
      }
      let formData = new FormData()
      formData.append("datafile", file)
      formData.append("fileinfo", JSON.stringify(fileinfo))
      let endpoint = path.join(app.getApiPath(), 'file/upload');
      app.postXHR(endpoint, formData, {
        success: function (err, response, body) {
          body = JSON.parse(body);
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
          if(body.errors.length > 0){
            let errorModal = $(modals.uploadFileErrorsHtml(file.name, type, body.message, body.errors)).modal();
          }
        },
        error: function (err, response, body) {
          body = JSON.parse(body);
          let zipErrorModal = $(modals.projectExportErrorHtml(resp.Reason, resp.Message)).modal();
        }
      }, false);
      modal.modal('hide')
    });
  },
  deleteFile: function (o) {
    var fileType = o.type
    if(fileType === "nonspatial")
      fileType = "model";
    else if(fileType === "spatial")
      fileType = "spatial model"
    else if(fileType === "sbml-model")
      fileType = "sbml model"
    else if(fileType === "other")
      fileType = "file"
    var self = this
    if(document.querySelector('#deleteFileModal')) {
      document.querySelector('#deleteFileModal').remove()
    }
    let modal = $(modals.deleteFileHtml(fileType)).modal();
    let yesBtn = document.querySelector('#deleteFileModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      var endpoint = path.join(app.getApiPath(), "file/delete")+"?path="+o.original._path
      app.getXHR(endpoint, {
        success: function (err, response, body) {
          var node = $('#models-jstree').jstree().get_node(o.parent);
          if(node.type === "root"){
            self.refreshJSTree();
            let actionsBtn = $(self.queryByHook("options-for-node"));
            if(actionsBtn.text().endsWith(o.text)) {
              actionsBtn.text("Actions");
              actionsBtn.prop("disabled", true);
              self.nodeForContextMenu = "";
            }
          }else{
            $('#models-jstree').jstree().refresh_node(node);
          }
        },
        error: function (err, response, body) {
          body = JSON.parse(body);
        }
      });
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
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          self.refreshJSTree();
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
        if(type === "workflow"){
          var message = ""
          if(body.error){
            message = body.error;
          }else{
            message = "The model for <b>"+body.File+"</b> is located here: <b>"+body.mdlPath+"</b>";
          }
          let modal = $(modals.duplicateWorkflowHtml(body.File, message)).modal();
        }
        self.selectNode(node, body.File);
      }
    });
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
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          self.refreshJSTree();
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
        self.selectNode(node, body.File);
      }
    });
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
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          self.refreshJSTree();
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
        self.selectNode(node, body.File);
        if(from === "SBML" && body.errors.length > 0){
          var title = "";
          var msg = body.message;
          var errors = body.errors;
          let modal = $(modals.sbmlToModelHtml(msg, errors)).modal();
        }
      }
    });
  },
  toNotebook: function (o, type) {
    let self = this
    var endpoint = ""
    if(type === "model"){
      endpoint = path.join(app.getApiPath(), "model/to-notebook")+"?path="+o.original._path
    }else{
      endpoint = path.join(app.getApiPath(), "workflow/notebook")+"?type=none&path="+o.original._path
    }
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(o.parent);
        if(node.type === 'root'){
          self.refreshJSTree();
        }else{
          $('#models-jstree').jstree().refresh_node(node);
        }
        var notebookPath = path.join(app.getBasePath(), "notebooks", body.FilePath);
        self.selectNode(node, body.File);
        window.open(notebookPath);
      }
    });
  },
  toSBML: function (o) {
    var self = this;
    var parentID = o.parent;
    var endpoint = path.join(app.getApiPath(), "model/to-sbml")+"?path="+o.original._path;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        var node = $('#models-jstree').jstree().get_node(parentID);
        if(node.type === "root"){
          self.refreshJSTree();
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
        self.selectNode(node, body.File);
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
        app.getXHR(endpoint, {
          always: function (err, response, body) {
            if(parent.type === "root"){
              self.refreshJSTree();
            }else{          
              $('#models-jstree').jstree().refresh_node(parent);
            }
          },
          success: function (err, response, body) {
            if(body.changed) {
              nameWarning.text(body.message);
              nameWarning.collapse('show');
              window.scrollTo(0,0);
              setTimeout(_.bind(self.hideNameWarning, self), 10000);
            }
            node.original._path = body._path;
          }
        });
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
    }else if(nodeType === "domain") {
      var dataType = "json"
      var identifier = "spatial-model/load-domain"
    }else if(asZip) {
      var dataType = "zip"
      var identifier = "file/download-zip"
    }else{
      var dataType = "json"
      var identifier = "file/json-data"
    }
    if(nodeType === "domain") {
      var queryStr = "?domain_path=" + o.original._path
    }else{
      var queryStr = "?path="+o.original._path
      if(dataType === "json"){
        queryStr = queryStr.concat("&for=None")
      }else if(dataType === "zip"){
        queryStr = queryStr.concat("&action=generate")
      }
    }
    var endpoint = path.join(app.getApiPath(), identifier)+queryStr
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        if(dataType === "json") {
          let data = nodeType === "domain" ? body.domain : body;
          self.exportToJsonFile(data, o.original.text);
        }else if(dataType === "zip") {
          var node = $('#models-jstree').jstree().get_node(o.parent);
          if(node.type === "root"){
            self.refreshJSTree();
          }else{
            $('#models-jstree').jstree().refresh_node(node);
          }
          self.exportToZipFile(body.Path);
        }else{
          self.exportToFile(body, o.original.text);
        }
      },
      error: function (err, response, body) {
        if(dataType === "plain-text") {
          body = JSON.parse(body);
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
    window.open(endpoint)
  },
  validateName: function (input, rename = false) {
    var error = ""
    if(input.endsWith('/')) {
      error = 'forward'
    }
    var invalidChars = "`~!@#$%^&*=+[{]}\"|:;'<,>?\\"
    if(rename) {
      invalidChars += "/"
    }
    for(var i = 0; i < input.length; i++) {
      if(invalidChars.includes(input.charAt(i))) {
        error = error === "" || error === "special" ? "special" : "both"
      }
    }
    return error
  },
  newProjectOrWorkflowGroup: function (o, isProject) {
    var self = this
    if(document.querySelector("#newProjectModal")) {
      document.querySelector("#newProjectModal").remove()
    }
    var modal = $(modals.newProjectModalHtml()).modal();
    var okBtn = document.querySelector('#newProjectModal .ok-model-btn');
    var input = document.querySelector('#newProjectModal #projectNameInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newProjectModal #projectNameInputEndCharError')
      var charErrMsg = document.querySelector('#newProjectModal #projectNameInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== "" || input.value.trim() === ""
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        modal.modal('hide')
        var parentPath = ""
        if(o && o.original && o.original.type !== "root") {
          parentPath = o.original._path
        }
        var projectName = input.value.trim() + ".proj"
        var projectPath = path.join(parentPath, projectName)
        var endpoint = path.join(app.getApiPath(), "project/new-project")+"?path="+projectPath
        app.getXHR(endpoint, {
          success: function (err, response, body) {
            let queryStr = "?path=" + body.path;
            let endpoint = path.join(app.getBasePath(), 'stochss/project/manager') + queryStr;
            window.location.href = endpoint;
          },
          error: function (err, response, body) {
            let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(body.Reason, body.Message)).modal();
          }
        });
      }
    });
  },
  newWorkflow: function (o, type) {
    let self = this;
    let model = new Model({
      directory: o.original._path
    });
    app.getXHR(model.url(), {
      success: function (err, response, body) {
        model.set(body);
        model.updateValid();
        if(model.valid){
          app.newWorkflow(self, o.original._path, o.type === "spatial", type);
        }else{
          let title = "Model Errors Detected";
          let endpoint = path.join(app.getBasePath(), "stochss/models/edit") + '?path=' + model.directory;
          let message = 'Errors were detected in you model <a href="' + endpoint + '">click here to fix your model<a/>';
          $(modals.modelErrorHtml(title, message)).modal();
        }
      }
    });
  },
  addExistingModel: function (o) {
    var self = this
    if(document.querySelector('#newProjectModelModal')){
      document.querySelector('#newProjectModelModal').remove()
    }
    let mdlListEP = path.join(app.getApiPath(), 'project/add-existing-model') + "?path="+o.original._path
    app.getXHR(mdlListEP, {
      always: function (err, response, body) {
        let modal = $(modals.newProjectModelHtml(body.files)).modal();
        let okBtn = document.querySelector('#newProjectModelModal .ok-model-btn');
        let select = document.querySelector('#newProjectModelModal #modelFileInput');
        let location = document.querySelector('#newProjectModelModal #modelPathInput');
        select.addEventListener("change", function (e) {
          okBtn.disabled = e.target.value && body.paths[e.target.value].length >= 2;
          if(body.paths[e.target.value].length >= 2) {
            var locations = body.paths[e.target.value].map(function (path) {
              return `<option>${path}</option>`;
            });
            locations.unshift(`<option value="">Select a location</option>`);
            locations = locations.join(" ");
            $("#modelPathInput").find('option').remove().end().append(locations);
            $("#location-container").css("display", "block");
          }else{
            $("#location-container").css("display", "none");
            $("#modelPathInput").find('option').remove().end();
          }
        });
        location.addEventListener("change", function (e) {
          okBtn.disabled = !Boolean(e.target.value);
        });
        okBtn.addEventListener("click", function (e) {
          let mdlPath = body.paths[select.value].length < 2 ? body.paths[select.value][0] : location.value;
          let queryString = "?path="+o.original._path+"&mdlPath="+mdlPath;
          let endpoint = path.join(app.getApiPath(), 'project/add-existing-model') + queryString;
          app.postXHR(endpoint, null, {
            success: function (err, response, body) {
              let successModal = $(modals.newProjectModelSuccessHtml(body.message)).modal();
            },
            error: function (err, response, body) {
              let errorModal = $(modals.newProjectModelErrorHtml(body.Reason, body.Message)).modal();
            }
          });
          modal.modal('hide');
        });
      }
    });
  },
  addModel: function (parentPath, modelName, message) {
    var endpoint = path.join(app.getBasePath(), "stochss/models/edit")
    if(parentPath.endsWith(".proj")) {
      let queryString = "?path=" + parentPath + "&mdlFile=" + modelName
      let newMdlEP = path.join(app.getApiPath(), "project/new-model") + queryString
      app.getXHR(newMdlEP, {
        success: function (err, response, body) {
          endpoint += "?path="+body.path;
          window.location.href = endpoint;
        },
        error: function (err, response, body) {
          let title = "Model Already Exists";
          let message = "A model already exists with that name";
          let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(title, message)).modal();
        }
      });
    }else{
      let modelPath = path.join(parentPath, modelName)
      let queryString = "?path="+modelPath+"&message="+message;
      endpoint += queryString
      let existEP = path.join(app.getApiPath(), "model/exists")+queryString
      app.getXHR(existEP, {
        always: function (err, response, body) {
          if(body.exists) {
            let title = "Model Already Exists";
            let message = "A model already exists with that name";
            let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(title, message)).modal();
          }else{
            window.location.href = endpoint;
          }
        }
      });
    }
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
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newModalModel #modelNameInputEndCharError')
      var charErrMsg = document.querySelector('#newModalModel #modelNameInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== "" || input.value.trim() === ""
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
    });
    okBtn.addEventListener('click', function (e) {
      if (Boolean(input.value)) {
        modal.modal('hide')
        var parentPath = ""
        if(o && o.original && o.original.type !== "root"){
          parentPath = o.original._path
        }
        if(isModel) {
          let ext = isSpatial ? ".smdl" : ".mdl"
          let modelName = o && o.type === "project" ? input.value.trim().split("/").pop() + ext : input.value.trim() + ext;
          let message = modelName !== input.value.trim() + ext? 
                "Warning: Models are saved directly in StochSS Projects and cannot be saved to the "+input.value.trim().split("/")[0]+" directory in the project.<br><p>Do you wish to save your model directly in your project?</p>" : ""
          if(message){
            let warningModal = $(modals.newProjectModelWarningHtml(message)).modal()
            let yesBtn = document.querySelector('#newProjectModelWarningModal .yes-modal-btn');
            yesBtn.addEventListener('click', function (e) {
              warningModal.modal('hide')
              self.addModel(parentPath, modelName, message);
            });
          }else{
            self.addModel(parentPath, modelName, message);
          }
        }else{
          let dirName = input.value.trim();
          let endpoint = path.join(app.getApiPath(), "directory/create")+"?path="+path.join(parentPath, dirName);
          app.getXHR(endpoint, {
            success: function (err, response, body) {
              if(o){//directory was created with context menu option
                var node = $('#models-jstree').jstree().get_node(o);
                if(node.type === "root"){
                  self.refreshJSTree();
                }else{          
                  $('#models-jstree').jstree().refresh_node(node);
                }
              }else{//directory was created with create directory button
                self.refreshJSTree();
              }
            },
            error: function (err, response, body) {
              body = JSON.parse(body);
              let errorModal = $(modals.newDirectoryErrorHtml(body.Reason, body.Message)).modal();
            }
          });
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
    let isSpatial = e.target.dataset.type === "spatial"
    this.newModelOrDirectory(undefined, true, isSpatial);
  },
  handleCreateDomain: function (e) {
    let queryStr = "?domainPath=/&new"
    window.location.href = path.join(app.getBasePath(), "stochss/domain/edit") + queryStr
  },
  showContextMenuForNode: function (e) {
    $('#models-jstree').jstree().show_contextmenu(this.nodeForContextMenu)
  },
  editWorkflowModel: function (o) {
    let endpoint = path.join(app.getApiPath(), "workflow/edit-model")+"?path="+o.original._path
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        if(body.error){
          let title = o.text + " Not Found";
          let message = body.error;
          let modal = $(modals.duplicateWorkflowHtml(title, message)).modal();
        }else{
          window.location.href = path.join(app.routePrefix, "models/edit")+"?path="+body.file;
        }
      }
    });
  },
  extractAll: function (o) {
    let self = this;
    let queryStr = "?path=" + o.original._path;
    let endpoint = path.join(app.getApiPath(), "file/unzip") + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        let node = $('#models-jstree').jstree().get_node(o.parent);
        if(node.type === "root"){
          self.refreshJSTree();
        }else{          
          $('#models-jstree').jstree().refresh_node(node);
        }
      },
      error: function (err, response, body) {
        let modal = $(modals.newProjectModelErrorHtml(body.Reason, body.message)).modal();
      }
    });
  },
  moveToTrash: function (o) {
    if(document.querySelector('#moveToTrashConfirmModal')) {
      document.querySelector('#moveToTrashConfirmModal').remove();
    }
    let self = this;
    let modal = $(modals.moveToTrashConfirmHtml("model")).modal();
    let yesBtn = document.querySelector('#moveToTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      let queryStr = "?srcPath=" + o.original._path + "&dstPath=" + path.join("trash", o.text)
      let endpoint = path.join(app.getApiPath(), "file/move") + queryStr
      app.getXHR(endpoint, {
        always: function (err, response, body) {
          $(self.queryByHook('empty-trash')).prop('disabled', false);
          $('#models-jstree').jstree().refresh();
        }
      });
    });
  },
  emptyTrash: function (e) {
    if(document.querySelector("#emptyTrashConfirmModal")) {
      document.querySelector("#emptyTrashConfirmModal").remove()
    }
    let self = this;
    let modal = $(modals.emptyTrashConfirmHtml()).modal();
    let yesBtn = document.querySelector('#emptyTrashConfirmModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      let endpoint = path.join(app.getApiPath(), "file/empty-trash") + "?path=trash";
      app.getXHR(endpoint, {
        success: function (err, response, body) {
          self.refreshJSTree();
          $(self.queryByHook('empty-trash')).prop('disabled', true);
        }
      });
    });
  },
  publishNotebookPresentation: function (o) {
    let queryStr = "?path=" + o.original._path;
    let endpoint = path.join(app.getApiPath(), "notebook/presentation") + queryStr;
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        let title = body.message;
        let linkHeaders = "Shareable Presentation";
        let links = body.links;
        $(modals.presentationLinks(title, linkHeaders, links)).modal();
        let copyBtn = document.querySelector('#presentationLinksModal #copy-to-clipboard');
        copyBtn.addEventListener('click', function (e) {
          let onFulfilled = (value) => {
            $("#copy-link-success").css("display", "inline-block");
          } 
          let onReject = (reason) => {
            let msg = $("#copy-link-failed");
            msg.html(reason);
            msg.css("display", "inline-block");
          }
          app.copyToClipboard(links.presentation, onFulfilled, onReject);
        });
      },
      error: function (err, response, body) {
        $(modals.newProjectModelErrorHtml(body.Reason, body.Message)).modal();
      }
    });
  },
  setupJstree: function () {
    var self = this;
    $.jstree.defaults.contextmenu.items = (o, cb) => {
      let optionsButton = $(self.queryByHook("options-for-node"))
      if(!self.nodeForContextMenu){
        optionsButton.prop('disabled', false)
      }
      optionsButton.text("Actions for " + o.original.text)
      self.nodeForContextMenu = o;
      let nodeType = o.original.type
      let zipTypes = ["workflow", "folder", "other", "project", "workflow-group"]
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
        "MoveToTrash" : {
          "label" : "Move To Trash",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.moveToTrash(o);
          }
        }
      }
      let delete_node = {
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
              "label" : "Spatial (beta)",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.newModelOrDirectory(o, true, true);
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
        "New Domain" : {
          "label" : "New Domain (beta)",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            let queryStr = "?domainPath=" + o.original._path + "&new"
            window.location.href = path.join(app.getBasePath(), "stochss/domain/edit") + queryStr
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
      let newWorkflow = {
        "ensembleSimulation" : {
          "label" : "Ensemble Simulation",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.newWorkflow(o, "Ensemble Simulation")
          }
        },
        "parameterSweep" : {
          "label" : "Parameter Sweep",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.newWorkflow(o, "Parameter Sweep")
          }
        },
        "jupyterNotebook" : {
          "label" : "Jupyter Notebook",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            window.location.href = path.join(app.getBasePath(), "stochss/workflow/selection")+"?path="+o.original._path;
          }
        }
      }
      let model = {
        "Edit" : {
          "label" : "Edit",
          "_disabled" : false,
          "_class" : "font-weight-bolder",
          "separator_before" : false,
          "separator_after" : true,
          "action" : function (data) {
            window.location.href = path.join(app.getBasePath(), "stochss/models/edit")+"?path="+o.original._path;
          }
        },
        "New Workflow" : {
          "label" : "New Workflow",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "submenu" : o.type === "nonspatial" ? newWorkflow : {"jupyterNotebook":newWorkflow.jupyterNotebook}
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
              "label" : "Convert to Model",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.toModel(o, "Spatial");
              }
            },
            "Convert to Notebook" : {
              "label" : "Convert to Notebook",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.toNotebook(o, "model")
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
              "_disabled" : false,
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
            }else if(nodeType === "domain") {
              let queryStr = "?domainPath=" + o.original._path
              window.location.href = path.join(app.getBasePath(), "stochss/domain/edit") + queryStr
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
        }
      }
      // specific to workflows
      let workflow = {
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
              "_disabled" : (!o.original._newFormat && o.original._status !== "ready"),
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.editWorkflowModel(o)
              }
            },
            "Extract" : {
              "label" : "Extract",
              "_disabled" : (o.original._newFormat && !o.original._hasJobs),
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
      //Specific to zip archives
      let extractAll = {
        "extractAll" : {
          "label" : "Extract All",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.extractAll(o);
          }
        }
      }
      let notebook = {
        "publish" : {
          "label" : "Publish",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.publishNotebookPresentation(o);
          }
        }
      }
      if (o.type === 'root'){
        return folder
      }
      if (o.text === "trash") {
        return {"Refresh": folder.Refresh}
      }
      if (o.original._path.split("/")[0] === "trash") {
        return delete_node
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
      if (o.text.endsWith(".zip")) {
        return $.extend(open, extractAll, common)
      }
      if (o.type === 'notebook') {
        if(app.getBasePath() === "/") {
          return $.extend(open, common)
        }
        return $.extend(open, notebook, common)
      }
      if (o.type === 'other') {
        return $.extend(open, common)
      }
      if (o.type === 'sbml-model') {
        return $.extend(open, sbml, common)
      }
      if (o.type === "domain") {
        return $.extend(open, common)
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
      if(!(_path.split("/")[0] === "trash")) {
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
        }else if(file.endsWith('.domn')) {
          let queryStr = "?domainPath=" + _path
          window.location.href = path.join(app.getBasePath(), "stochss/domain/edit") + queryStr
        }else if(node.type === "folder" && $('#models-jstree').jstree().is_open(node) && $('#models-jstree').jstree().is_loaded(node)){
          $('#models-jstree').jstree().refresh_node(node)
        }else if(node.type === "other"){
          var openPath = path.join(app.getBasePath(), "view", _path);
          window.open(openPath, "_blank");
        }
      }
    });
  }
});

initPage(FileBrowser);
