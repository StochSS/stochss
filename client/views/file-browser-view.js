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
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/fileBrowserView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-browse-files]' : 'changeCollapseButtonText',
    'click [data-hook=refresh-jstree]' : 'refreshJSTree',
    'click [data-hook=options-for-node]' : 'showContextMenuForNode',
    'click [data-hook=new-directory]' : 'handleCreateDirectoryClick',
    'click [data-hook=browser-new-workflow-group]' : 'handleCreateWorkflowGroupClick',
    'click [data-hook=browser-new-model]' : 'handleCreateModelClick',
    'click [data-hook=browser-new-domain]' : 'handelCreateDomainClick',
    'click [data-hook=browser-existing-model]' : 'handleAddExistingModelClick',
    'click [data-hook=upload-file-btn-bf]' : 'handleUploadFileClick',
    'click [data-hook=file-browser-help]' : function () {
      let modal = $(modals.operationInfoModalHtml('file-browser')).modal();
    },
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
    var self = this
    this.root = "none"
    if(attrs && attrs.root){
      this.root = attrs.root
    }
    this.ajaxData = {
      "url" : function (node) {
        if(node.parent === null){
          var endpoint = path.join(app.getApiPath(), "file/browser-list")+"?path="+self.root
          if(self.root !== "none") {
            endpoint += "&isRoot=True"
          }
          return endpoint
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
          if(op === 'move_node' && more && more.core) {
            var newDir = par.original._path !== "/" ? par.original._path : ""
            var file = node.original._path.split('/').pop()
            var oldPath = node.original._path
            let queryStr = "?srcPath="+oldPath+"&dstPath="+path.join(newDir, file)
            var endpoint = path.join(app.getApiPath(), "file/move")+queryStr
            app.getXHR(endpoint, {
              success: function (err, response, body) {
                node.original._path = path.join(newDir, file)
                if((node.type === "nonspatial" || node.type === "spatial") && (oldPath.includes("trash") || newDir.includes("trash"))) {
                  self.updateParent("Archive");
                }else if(node.type !== "notebook" || node.original._path.includes(".wkgp") || newDir.includes(".wkgp")) {
                  self.updateParent(node.type)
                }
              },
              error: function (err, response, body) {
                body = JSON.parse(body)
                if(par.type === 'root'){
                  $('#models-jstree-view').jstree().refresh()
                }else{
                  $('#models-jstree-view').jstree().refresh_node(par);
                }
              }
            });
          }else{
            let isMove = op === 'move_node'
            let validSrc = Boolean(node && node.type && node.original && node.original.text !== "trash")
            let validDst = Boolean(more && more.ref && more.ref.type && more.ref.original)
            let validDsts = ["root", "folder"]
            let isModel = Boolean(validSrc && (node.type === "nonspatial" || node.type === "spatial"))
            let isWorkflow = Boolean(validSrc && node.type === "workflow")
            let isWkgp = Boolean(validSrc && node.type === "workflow-group")
            let isNotebook = Boolean(validSrc && node.type === "notebook")
            let isOther = Boolean(validSrc && !isModel && !isWorkflow && !isWkgp && !isNotebook)
            let trashAction = Boolean((validSrc && node.original._path.includes("trash")) || (validDst && more.ref.original.text === "trash"))
            // Check if files are being move directly into the trash and remain static with respect to the trash
            if(isMove && validDst && path.dirname(more.ref.original._path).includes("trash")) { return false }
            if(isMove && validSrc && validDst && node.original._path.includes("trash") && more.ref.original.text === 'trash') { return false }
            // Check if workflow is running
            if(isMove && isWorkflow && node.original._status && node.original._status === "running") { return false };
            // Check if model, workflow, or workflow group is moving to or from trash
            if(isMove && (isModel || isWorkflow) && !trashAction) { return false };
            if(isMove && isWkgp && !(self.parent.model.newFormat && trashAction)) { return false };
            // Check if model, workflow, or workflow group is moving from trash to the correct location
            if(isMove && validSrc && node.original._path.includes("trash")) {
              if(isWkgp && (!self.parent.model.newFormat || (validDst && more.ref.type !== "root"))) { return false };
              if(isWorkflow && validDst && more.ref.type !== "workflow-group") { return false };
              if(isModel && validDst) {
                if(!self.parent.model.newFormat && more.ref.type !== "root") { return false };
                let length = node.original.text.split(".").length;
                let modelName = node.original.text.split(".").slice(0, length - 1).join(".")
                if(self.parent.model.newFormat && (more.ref.type !== "workflow-group" || !more.ref.original.text.startsWith(modelName))) { return false };
              }
            }
            // Check if notebook or other file is moving to a valid location.
            if(isOther && validDst && !validDsts.includes(more.ref.type)) { return false };
            validDsts.push("workflow-group")
            if(isNotebook && validDst && !validDsts.includes(more.ref.type)) { return false };
            if(isMove && validDst && validDsts.includes(more.ref.type)){
              if(!more.ref.state.loaded) { return false };
              var exists = false
              var BreakException = {}
              var text = node.text
              if(!isNaN(text.split(' ').pop().split('.').join(""))){
                text = text.replace(text.split(' ').pop(), '').trim()
              }
              if(more.ref.text !== "trash"){
                try{
                  more.ref.children.forEach(function (child) {
                    var child_node = $('#models-jstree-view').jstree().get_node(child)
                    exists = child_node.text === text
                    if(exists) { throw BreakException; };
                  })
                }catch { return false; };
              }
            }
            if(isMove && more && (pos != 0 || more.pos !== "i") && !more.core) { return false }
            return true
          }
        },
        'themes': {'stripes': true, 'variant': 'large'},
        'data': self.ajaxData,
      },
      'types' : {
        'root' : {"icon": "jstree-icon jstree-folder"},
        'folder' : {"icon": "jstree-icon jstree-folder"},
        'spatial' : {"icon": "jstree-icon jstree-file"},
        'nonspatial' : {"icon": "jstree-icon jstree-file"},
        'project' : {"icon": "jstree-icon jstree-file"},
        'workflow-group' : {"icon": "jstree-icon jstree-folder"},
        'workflow' : {"icon": "jstree-icon jstree-file"},
        'notebook' : {"icon": "jstree-icon jstree-file"},
        'domain' : {"icon": "jstree-icon jstree-file"},
        'sbml-model' : {"icon": "jstree-icon jstree-file"},
        'other' : {"icon": "jstree-icon jstree-file"},
      },  
    }
    this.setupJstree()
  },
  render: function () {
    View.prototype.render.apply(this, arguments)
    var self = this;
    this.nodeForContextMenu = "";
    this.jstreeIsLoaded = false
    window.addEventListener('pageshow', function (e) {
      var navType = window.performance.navigation.type
      if(navType === 2){
        window.location.reload()
      }
    });
  },
  updateParent: function (type) {
    let models = ["nonspatial", "spatial", "sbml", "model"]
    let workflows = ["workflow", "notebook"]
    if(models.includes(type)) {
      this.parent.update("Model")
    }else if(workflows.includes(type)) {
      this.parent.update("Workflow")
    }else if(type === "workflow-group") {
      this.parent.update("WorkflowGroup")
    }else if(type === "Archive") {
      this.parent.update(type);
    }
  },
  refreshJSTree: function () {
    this.jstreeIsLoaded = false
    $('#models-jstree-view').jstree().deselect_all(true)
    $('#models-jstree-view').jstree().refresh()
  },
  refreshInitialJSTree: function () {
    var self = this;
    var count = $('#models-jstree-view').jstree()._model.data['#'].children.length;
    if(count == 0) {
      self.refreshJSTree();
      setTimeout(function () {
        self.refreshInitialJSTree();
      }, 3000);
    }
  },
  selectNode: function (node, fileName) {
    let self = this
    if(!this.jstreeIsLoaded || !$('#models-jstree-view').jstree().is_loaded(node) && $('#models-jstree-view').jstree().is_loading(node)) {
      setTimeout(_.bind(self.selectNode, self, node, fileName), 1000);
    }else{
      node = $('#models-jstree-view').jstree().get_node(node)
      var child = ""
      for(var i = 0; i < node.children.length; i++) {
        var child = $('#models-jstree-view').jstree().get_node(node.children[i])
        if(child.original.text === fileName) {
          $('#models-jstree-view').jstree().select_node(child)
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
      var fileinfo = {"type":type,"name":"","path":self.parent.model.directory}
      if(o && o.original){
        fileinfo.path = o.original._path
      }
      if(Boolean(input.value) && self.validateName(input.value) === ""){
        let name = input.value.trim()
        if(file.name.endsWith(".mdl") || (type === "model" && file.name.endsWith(".json"))){
          fileinfo.name = name.split('/').pop()
        }else if(file.name.endsWith(".sbml") || (type === "sbml" && file.name.endsWith(".xml"))){
          fileinfo.name = name.split('/').pop()
        }else{
          fileinfo.name = name
        }
      }
      let formData = new FormData()
      formData.append("datafile", file)
      formData.append("fileinfo", JSON.stringify(fileinfo))
      let endpoint = path.join(app.getApiPath(), 'file/upload');
      if(Boolean(input.value) && self.validateName(input.value) === "" && fileinfo.name !== input.value.trim()){
        let message = "Warning: Models are saved directly in StochSS Projects and cannot be saved to the "+input.value.trim().split("/")[0]+" directory in the project.<br><p>Do you wish to save your model directly in your project?</p>"
        let warningModal = $(modals.newProjectModelWarningHtml(message)).modal()
        let yesBtn = document.querySelector('#newProjectModelWarningModal .yes-modal-btn');
        yesBtn.addEventListener('click', function (e) {
          warningModal.modal('hide')
          self.openUploadRequest(endpoint, formData, file, type, o)
        })
      }else{
        self.openUploadRequest(endpoint, formData, file, type, o)
      }
      modal.modal('hide')
    })
  },
  openUploadRequest: function (endpoint, formData, file, type, o) {
    let self = this
    app.postXHR(endpoint, formData, {
      success: function (err, response, body) {
        body = JSON.parse(body);
        if(o){
          var node = $('#models-jstree-view').jstree().get_node(o.parent);
          if(node.type === "root" || node.type === "#"){
            self.refreshJSTree();
          }else{
            $('#models-jstree-view').jstree().refresh_node(node);
          }
        }else{
          self.refreshJSTree();
        }
        if(body.file.endsWith(".mdl") || body.file.endsWith(".smdl") ||body.file.endsWith(".sbml")) {
          self.updateParent("model")
        }
        if(body.errors.length > 0){
          let errorModal = $(modals.uploadFileErrorsHtml(file.name, type, body.message, body.errors)).modal();
        }
      },
      error: function (err, response, body) {
        body = JSON.parse(body);
        let zipErrorModal = $(modals.projectExportErrorHtml(body.Reason, body.Message)).modal()
      }
    }, false);
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
          var node = $('#models-jstree-view').jstree().get_node(o.parent);
          if(node.type === "root"){
            self.refreshJSTree();
          }else{
            $('#models-jstree-view').jstree().refresh_node(node);
          }
        }
      });
      modal.modal('hide')
      if(o.type !== "notebook" || o.original._path.includes(".wkgp")) {
        self.updateParent(o.type)
      }
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
        var node = $('#models-jstree-view').jstree().get_node(parentID);
        self.refreshJSTree()
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
        if(o.type !== "notebook" || o.original._path.includes(".wkgp")) {
          self.updateParent(o.type)
        }
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
        var node = $('#models-jstree-view').jstree().get_node(parentID);
        self.refreshJSTree()
        self.updateParent("spatial")
        self.selectNode(node, body.File)
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
        var node = $('#models-jstree-view').jstree().get_node(parentID);
        self.refreshJSTree()
        self.selectNode(node, body.File)
        if(from === "SBML" && body.errors.length > 0){
          var title = ""
          var msg = body.message
          var errors = body.errors
          let modal = $(modals.sbmlToModelHtml(msg, errors)).modal();
        }else{
          self.updateParent("nonspatial")
        }
      }
    });
  },
  toNotebook: function (o, type) {
    let self = this
    var endpoint = path.join(app.getApiPath(), "workflow/notebook")+"?type=none&path="+o.original._path
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        var node = $('#models-jstree-view').jstree().get_node(o.parent)
        if(node.type === 'root'){
          self.refreshJSTree();
        }else{
          $('#models-jstree-view').jstree().refresh_node(node);
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
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        var node = $('#models-jstree-view').jstree().get_node(parentID);
        self.refreshJSTree()
        self.selectNode(node, body.File)
      }
    });
  },
  renameNode: function (o) {
    var self = this
    var text = o.text;
    var parent = $('#models-jstree-view').jstree().get_node(o.parent)
    var extensionWarning = $(this.queryByHook('extension-warning'));
    var nameWarning = $(this.queryByHook('rename-warning'));
    extensionWarning.collapse('show')
    $('#models-jstree-view').jstree().edit(o, null, function(node, status) {
      if(text != node.text){
        let name = node.type === "root" ? node.text + ".proj" : node.text
        var endpoint = path.join(app.getApiPath(), "file/rename")+"?path="+ o.original._path+"&name="+name
        app.getXHR(endpoint, {
          always: function (err, response, body) {
            if(parent.type === "root"){
              self.refreshJSTree();
            }else{          
              $('#models-jstree-view').jstree().refresh_node(parent);
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
          var node = $('#models-jstree-view').jstree().get_node(o.parent);
          if(node.type === "root"){
            self.refreshJSTree();
          }else{
            $('#models-jstree-view').jstree().refresh_node(node);
          }
          self.exportToZipFile(body.Path);
        }else{
          self.exportToFile(body, o.original.text);
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
  validateName(input, rename = false) {
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
  newWorkflowGroup: function (o) {
    var self = this
    if(document.querySelector("#newWorkflowGroupModal")) {
      document.querySelector("#newWorkflowGroupModal").remove()
    }
    let modal = $(modals.newWorkflowGroupModalHtml()).modal();
    let okBtn = document.querySelector('#newWorkflowGroupModal .ok-model-btn');
    let input = document.querySelector('#newWorkflowGroupModal #workflowGroupNameInput');
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newWorkflowGroupModal #workflowGroupNameInputEndCharError')
      var charErrMsg = document.querySelector('#newWorkflowGroupModal #workflowGroupNameInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== ""
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
    });
    okBtn.addEventListener("click", function (e) {
      if(Boolean(input.value)) {
        modal.modal('hide')
        var parentPath = self.parent.model.directory
        if(o && o.original && o.original._path !== "/") {
          parentPath = o.original._path
        }
        var workflowGroupName = input.value.trim() + ".wkgp"
        var workflowGroupPath = path.join(parentPath, workflowGroupName)
        let endpoint = path.join(app.getApiPath(), "project/new-workflow-group")+"?path="+workflowGroupPath
        app.getXHR(endpoint, {
          success: function (err, response, body) {
            if(o){//directory was created with context menu option
              var node = $('#models-jstree-view').jstree().get_node(o);
              if(node.type === "root"){
                self.refreshJSTree();
              }else{          
                $('#models-jstree-view').jstree().refresh_node(node);
              }
            }else{//directory was created with create directory button
              self.refreshJSTree();
            }
            self.updateParent('workflow-group');
          },
          error: function (err, response, body) {
            let errorModel = $(modals.newProjectOrWorkflowGroupErrorHtml(body.Reason, body.Message)).modal();
          }
        });
      }
    })
  },
  handleAddExistingModelClick: function () {
    this.addExistingModel(undefined)
  },
  addExistingModel: function (o) {
    var self = this
    if(document.querySelector('#newProjectModelModal')){
      document.querySelector('#newProjectModelModal').remove()
    }
    let mdlListEP = path.join(app.getApiPath(), 'project/add-existing-model') + "?path="+self.parent.model.directory
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
          modal.modal('hide');
          let mdlPath = body.paths[select.value].length < 2 ? body.paths[select.value][0] : location.value;
          let queryString = "?path="+self.parent.model.directory+"&mdlPath="+mdlPath;
          let endpoint = path.join(app.getApiPath(), 'project/add-existing-model') + queryString;
          app.postXHR(endpoint, null, {
            success: function (err, response, body) {
              let successModal = $(modals.newProjectModelSuccessHtml(body.message)).modal();
              self.updateParent("model");
              self.refreshJSTree();
            },
            error: function (err, response, body) {
              let errorModal = $(modals.newProjectModelErrorHtml(body.Reason, body.Message)).modal();
            }
          });
        });
      }
    });
  },
  newWorkflow: function (o, type) {
    app.newWorkflow(this, o.original._path, o.type === "spatial", type);
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
        var parentPath = self.parent.model.directory
        if(o && o.original && o.original._path !== "/"){
          parentPath = o.original._path
        }
        if(isModel) {
          let ext = isSpatial ? ".smdl" : ".mdl";
          let modelName = !o || (o && o.type === "root") ? input.value.trim().split("/").pop() + ext : input.value.trim() + ext;
          let message = modelName !== input.value.trim() + ext? 
                "Warning: Models are saved directly in StochSS Projects and cannot be saved to the "+input.value.trim().split("/")[0]+" directory in the project.<br><p>Your model will be saved directly in your project.</p>" : ""
          if(message){
            let warningModal = $(modals.newProjectModelWarningHtml(message)).modal()
            let yesBtn = document.querySelector('#newProjectModelWarningModal .yes-modal-btn');
            yesBtn.addEventListener('click', function (e) {
              warningModal.modal('hide');
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
                var node = $('#models-jstree-view').jstree().get_node(o);
                if(node.type === "root"){
                  self.refreshJSTree();
                }else{          
                  $('#models-jstree-view').jstree().refresh_node(node);
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
  handleCreateWorkflowGroupClick: function (e) {
    this.newWorkflowGroup(undefined)
  },
  handleCreateModelClick: function (e) {
    let isSpatial = e.target.dataset.type === "spatial"
    this.newModelOrDirectory(undefined, true, isSpatial);
  },
  handelCreateDomainClick: function (e) {
    let queryStr = "?domainPath=" + this.parent.model.directory + "&new"
    window.location.href = path.join(app.getBasePath(), "stochss/domain/edit") + queryStr
  },
  handleExtractModelClick: function (o) {
    let self = this
    let projectParent = path.dirname(this.parent.model.directory) === '.' ? "" : path.dirname(this.parent.model.directory)
    let queryString = "?srcPath="+o.original._path+"&dstPath="+path.join(projectParent, o.original._path.split('/').pop())
    let endpoint = path.join(app.getApiPath(), "project/extract-model")+queryString
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        let successModel = $(modals.projectExportSuccessHtml("Model", body)).modal();
      },
      error: function (err, response, body) {
        body = JSON.parse(body);
        let successModel = $(modals.projectExportErrorHtml(body.Reason, body.message)).modal();
      }
    });
  },
  handleExportWorkflowClick: function (o) {
    let self = this
    let projectParent = path.dirname(this.parent.model.directory) === '.' ? "" : path.dirname(this.parent.model.directory)
    let queryString = "?srcPath="+o.original._path+"&dstPath="+path.join(projectParent, o.original._path.split('/').pop())
    let endpoint = path.join(app.getApiPath(), "project/extract-workflow")+queryString
    app.getXHR(endpoint, {
      success: function (err, response, body) {
        let successModel = $(modals.projectExportSuccessHtml("Workflow", body)).modal();
      },
      error: function (err, response, body) {
        body = JSON.parse(body);
        let successModel = $(modals.projectExportErrorHtml(body.Reason, body.message)).modal();
      }
    });
  },
  handleExportCombineClick: function (o, download) {
    let target = o.original._path
    this.parent.exportAsCombine()
  },
  showContextMenuForNode: function (e) {
    $('#models-jstree-view').jstree().show_contextmenu(this.nodeForContextMenu)
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
        let node = $('#models-jstree-view').jstree().get_node(o.parent);
        if(node.type === "root"){
          self.refreshJSTree();
        }else{          
          $('#models-jstree-view').jstree().refresh_node(node);
        }
      },
      error: function (err, response, body) {
        let modal = $(modals.newProjectModelErrorHtml(body.Reason, body.message)).modal();
      }
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
      let nodeType = o.original.type
      let zipTypes = ["workflow", "folder", "other", "root", "workflow-group"]
      let asZip = zipTypes.includes(nodeType)
      // refresh context menu option
      let refresh = {
        "Refresh" : {
          "label" : "Refresh",
          "_disabled" : false,
          "_class" : "font-weight-bold",
          "separator_before" : false,
          "separator_after" : o.text !== "trash",
          "action" : function (data) {
            if(nodeType === "root"){
              self.refreshJSTree();
            }else{
              $('#models-jstree-view').jstree().refresh_node(o);
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
      // project contect menu option
      let project = {
        "Add_Model" : {
          "label" : "Add Model",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "submenu" : {
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
      // option for uploading files
      let uploadFile = {
        "Upload": {
          "label" : o.type === "root" ? "File" : "Upload File",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : o.type !== "root",
          "action" : function (data) {
            self.uploadFile(o, "file")
          }
        }
      }
      // all upload options
      let uploadAll = {
        "Upload" : {
          "label" : "Upload File",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : true,
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
            "File" : uploadFile.Upload
          }
        }
      }
      // common to folder and root
      let commonFolder = {
        "New_Directory" : {
          "label" : "New Directory",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.newModelOrDirectory(o, false, false);
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
        "Upload": o.type === "root" ? uploadAll.Upload : uploadFile.Upload
      }
      if(o.type === "root" || o.type === "workflow-group" || o.type === "workflow")
        var downloadLabel = "as .zip"
      else if(asZip)
        var downloadLabel = "Download as .zip"
      else
        var downloadLabel = "Download"
      let download = {
        "Download" : {
          "label" : downloadLabel,
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : !(o.type === "root" || o.type === "workflow-group" || o.type === "workflow"),
          "action" : function (data) {
            if(o.original.text.endsWith('.zip')){
              self.exportToZipFile(o);
            }else{
              self.getExportData(o, asZip)
            }
          }
        }
      }
      // download options for .zip and COMBINE
      let downloadWCombine = {
        "Download" : {
          "label" : "Download",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : true,
          "submenu" : {
            "DownloadAsZip": download.Download,
            "downloadAsCombine" : {
              "label" : "as COMBINE",
              "_disabled" : true,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.handleExportCombineClick(o, true)
              }
            }
          }
        }
      }
      // menu option for creating new workflows
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
      // common to all models
      let commonModel = {
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
        "Extract" : {
          "label" : "Extract",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : false,
          "action" : function (data) {
            self.handleExtractModelClick(o);
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
      // convert options for non-spatial models
      let modelConvert = {
        "Convert" : {
          "label" : "Convert",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : true,
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
      // convert options for spatial models
      let spatialConvert = {
        "Convert" : {
          "label" : "Convert",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : true,
          "submenu" : {
            "Convert to Model" : {
              "label" : "Convert to Model",
              "_disabled" : false,
              "separator_before" : false,
              "separator_after" : false,
              "action" : function (data) {
                self.toModel(o, "Spatial");
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
        },
        "Extract" : {
          "label" : "Extract",
          "_disabled" : false,
          "separator_before" : false,
          "separator_after" : true,
          "action" : function (data) {
            self.handleExportWorkflowClick(o)
          }
        },
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
      // common to all type except root and trash
      let common = {
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
          "_disabled" : (nodeType === "project" || nodeType === "workflow-group"),
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
        return $.extend(refresh, project, commonFolder, downloadWCombine, {"Rename": common.Rename})
      }
      if (o.text === "trash"){
        return refresh
      }
      if (o.original._path.includes(".proj/trash/")) {
        return {"Delete": common.Delete}
      }
      if (o.type ===  'folder') {
        return $.extend(refresh, commonFolder, download, common)
      }
      if (o.type === 'spatial') {
        return $.extend(commonModel, spatialConvert, download, common)
      }
      if (o.type === 'nonspatial') {
         return $.extend(commonModel, modelConvert, download, common)
      }
      if (o.type === 'workflow-group') {
        return $.extend(refresh, downloadWCombine)
      }
      if (o.type === 'workflow') {
        return $.extend(open, workflow, downloadWCombine, common)
      }
      if (o.text.endsWith(".zip")) {
        return $.extend(open, extractAll, download, common)
      }
      if (o.type === 'notebook') {
        if(app.getBasePath() === "/") {
          return $.extend(open, download, common)
        }
        return $.extend(open, notebook, download, common)
      }
      if (o.type === 'other') {
        return $.extend(open, download, common)
      }
      if (o.type === 'sbml-model') {
        return $.extend(open, sbml, common)
      }
      if (o.type === "domain") {
        return $.extend(open, common)
      }
    }
    $(document).ready(function () {
      $(document).on('shown.bs.modal', function (e) {
        $('[autofocus]', e.target).focus();
      });
      $(document).on('dnd_start.vakata', function (data, element, helper, event) {
        $('#models-jstree-view').jstree().load_all()
      });
      $('#models-jstree-view').jstree(self.treeSettings).bind("loaded.jstree", function (event, data) {
        self.jstreeIsLoaded = true
      }).bind("refresh.jstree", function (event, data) {
        self.jstreeIsLoaded = true
      });
      $('#models-jstree-view').on('click.jstree', function(e) {
        var parent = e.target.parentElement
        var _node = parent.children[parent.children.length - 1]
        var node = $('#models-jstree-view').jstree().get_node(_node)
        if(_node.nodeName === "A" && $('#models-jstree-view').jstree().is_loaded(node) && node.type === "folder"){
          $('#models-jstree-view').jstree().refresh_node(node)
        }else{
          let optionsButton = $(self.queryByHook("options-for-node"))
          if(!self.nodeForContextMenu){
            optionsButton.prop('disabled', false)
          }
          optionsButton.text("Actions for " + node.original.text)
          self.nodeForContextMenu = node;
        }
      });
      $('#models-jstree-view').on('dblclick.jstree', function(e) {
        var file = e.target.text
        var node = $('#models-jstree-view').jstree().get_node(e.target)
        var _path = node.original._path;
        if(!_path.includes(".proj/trash/")){
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
          }else if(node.type === "folder" && $('#models-jstree-view').jstree().is_open(node) && $('#models-jstree-view').jstree().is_loaded(node)){
            $('#models-jstree-view').jstree().refresh_node(node)
          }else if(node.type === "other"){
            var openPath = path.join(app.getBasePath(), "view", _path);
            window.open(openPath, "_blank");
          }
        }
      });
    })
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  }
});