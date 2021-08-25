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

let $ = require('jquery');
let path = require('path');
let jstree = require('jstree');
//support files
let app = require('../app');
let modals = require('../modals');
//config
let FileConfig = require('../file-config')
let ProjectConfig = require('../project-config');
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/jstreeView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=fb-new-directory]' : 'handleCreateDirectoryClick',
    'click [data-hook=fb-new-project]' : 'handleCreateProjectClick',
    'click [data-hook=fb-new-model]' : 'handleCreateModelClick',
    'click [data-hook=fb-new-domain]' : 'handleCreateDomain',
    'click [data-hook=fb-import-model]' : 'handleImportModelClick',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.config = attrs.configKey === "file" ? FileConfig : ProjectConfig;
    this.root = Boolean(attrs.root) ? attrs.root : "none";
    this.nodeForContextMenu = null;
    this.jstreeIsLoaded = false;
    this.ajaxData = {
      "url" : (node) => {
        if(node.parent === null){
          var queryStr = "?path=" + this.root;
          if(this.root !== "none") {
            queryStr += "&isRoot=True";
          }
          return path.join(app.getApiPath(), "file/browser-list") + queryStr;
        }
        var queryStr = "?path=" + node.original._path;
        return path.join(app.getApiPath(), "file/browser-list") + queryStr;
      },
      "dataType" : "json",
      "data" : (node) => {
        return { 'id' : node.id}
      }
    }
    this.treeSettings = {
      'plugins': ['types', 'wholerow', 'changed', 'contextmenu', 'dnd'],
      'core': {
        'multiple': false,
        'animation': 0,
        'check_callback': (op, node, par, pos, more) => {
          if(op === "rename_node" && this.validateName(pos, {rename: true}) !== ""){
            let err = $("#renameSpecialCharError");
            err.css("display", "block");
            setTimeout(() => {
              err.css("display", "none");
            }, 5000)
            return false
          }
          if(op === 'move_node' && more && more.core) {
            this.config.move(this, par, node);
          }else if(op === "move_node") {
            return this.config.validateMove(this, node, more, pos);
          }
        },
        'themes': {'stripes': true, 'variant': 'large'},
        'data': this.ajaxData
      },
      'types': this.config.types
    }
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.config.setup(this);
    window.addEventListener('pageshow', function (e) {
      let navType = window.performance.navigation.type;
      if(navType === 2){
        window.location.reload();
      }
    });
    this.setupJstree(() => {
      setTimeout(() => {
        this.refreshInitialJSTree();
      }, 3000);
    });
  },
  addInputKeyupEvent: function (input, okBtn) {
    input.addEventListener("keyup", (event) => {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
  },
  addInputValidateEvent: function (input, okBtn, modalID, inputID, {inProject = false}={}) {
    input.addEventListener("input", (e) => {
      let endErrMsg = document.querySelector(`${modalID} ${inputID}EndCharError`);
      let charErrMsg = document.querySelector(`${modalID} ${inputID}SpecCharError`);
      let error = this.validateName(input.value, {saveAs: !inProject});
      okBtn.disabled = error !== "" || input.value.trim() === "";
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none";
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none";
    });
  },
  addModel: function (dirname, file) {
    let queryStr = "?path=" + path.join(dirname, file);
    let existEP = path.join(app.getApiPath(), "model/exists") + queryStr;
    app.getXHR(existEP, {
      always: (err, response, body) => {
        if(body.exists) {
          if(document.querySelector("#errorModal")) {
            document.querySelector("#errorModal").remove();
          }
          let title = "Model Already Exists";
          let message = "A model already exists with that name";
          let errorModel = $(modals.errorHtml(title, message)).modal();
        }else{
          let endpoint = path.join(app.getBasePath(), "stochss/models/edit") + queryStr;
          window.location.href = endpoint;
        }
      }
    });
  },
  addProjectModel: function (dirname, file) {
    let queryStr = "?path=" + dirname + "&mdlFile=" + file;
    let newMdlEP = path.join(app.getApiPath(), "project/new-model") + queryStr;
    app.getXHR(newMdlEP, {
      success: (err, response, body) => {
        let endpoint = path.join(app.getBasePath(), "stochss/models/edit") + "?path=" + body.path;
        window.location.href = endpoint;
      },
      error: (err, response, body) => {
        if(document.querySelector("#errorModal")) {
          document.querySelector("#errorModal").remove();
        }
        let title = "Model Already Exists";
        let message = "A model already exists with that name";
        let errorModel = $(modals.errorHtml(title, message)).modal();
      }
    });
  },
  createDirectory: function (node, dirname) {
    if(document.querySelector('#newDirectoryModal')) {
      document.querySelector('#newDirectoryModal').remove();
    }
    let modal = $(modals.createDirectoryHtml()).modal('show');
    let okBtn = document.querySelector('#newDirectoryModal .ok-model-btn');
    let input = document.querySelector('#newDirectoryModal #directoryNameInput');
    this.addInputKeyupEvent(input, okBtn);
    this.addInputValidateEvent(input, okBtn, "#newDirectoryModal", "#directoryNameInput");
    okBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      let queryStr = "?path=" + path.join(dirname, input.value.trim());
      let endpoint = path.join(app.getApiPath(), "directory/create") + queryStr;
      app.getXHR(endpoint, {
        success: (err, response, body) => {
          this.refreshJSTree(node)
        },
        error: (err, response, body) => {
          if(document.querySelector("#errorModal")) {
            document.querySelector("#errorModal").remove();
          }
          body = JSON.parse(body);
          let errorModal = $(modals.errorHtml(body.Reason, body.Message)).modal();
        }
      });
    });
  },
  createModel: function (node, dirname, isSpatial, inProject) {
    if(document.querySelector('#newModelModal')) {
      document.querySelector('#newModelModal').remove();
    }
    let modal = $(modals.createModelHtml(isSpatial)).modal();
    let okBtn = document.querySelector('#newModelModal .ok-model-btn');
    let input = document.querySelector('#newModelModal #modelNameInput');
    this.addInputKeyupEvent(input, okBtn);
    this.addInputValidateEvent(input, okBtn, "#newModelModal", "#modelNameInput", {inProject: inProject});
    okBtn.addEventListener('click', (e) => {
      modal.modal('hide');
      let file = `${input.value.trim()}.${isSpatial ? "smdl" : "mdl"}`;
      if(inProject) {
        this.addProjectModel(dirname, file);
      }else{
        this.addModel(dirname, file);
      }
    });
  },
  createProject: function (node, dirname) {
    if(document.querySelector("#newProjectModal")) {
      document.querySelector("#newProjectModal").remove();
    }
    let modal = $(modals.createProjectHtml()).modal();
    let okBtn = document.querySelector('#newProjectModal .ok-model-btn');
    let input = document.querySelector('#newProjectModal #projectNameInput');
    this.addInputKeyupEvent(input, okBtn);
    this.addInputValidateEvent(input, okBtn, "#newProjectModal", "#projectNameInput");
    okBtn.addEventListener("click", function (e) {
      modal.modal('hide');
      let queryStr = "?path=" + path.join(dirname, `${input.value.trim()}.proj`);
      let endpoint = path.join(app.getApiPath(), "project/new-project") + queryStr;
      app.getXHR(endpoint, {
        success: (err, response, body) => {
          let queryStr = "?path=" + body.path;
          let endpoint = path.join(app.getBasePath(), 'stochss/project/manager') + queryStr;
          window.location.href = endpoint;
        },
        error: (err, response, body) => {
          if(document.querySelector("#errorModal")) {
            document.querySelector("#errorModal").remove();
          }
          let errorModel = $(modals.errorHtml(body.Reason, body.Message)).modal();
        }
      });
    });
  },
  handleCreateDirectoryClick: function (e) {
    let dirname = this.root === "none" ? "" : this.root;
    this.createDirectory(null, dirname);
  },
  handleImportModelClick: function () {
    this.importModel(null);
  },
  handleCreateModelClick: function (e) {
    let dirname = this.root === "none" ? "" : this.root;
    let inProject = this.root !== "none";
    let isSpatial = e.target.dataset.type === "spatial";
    this.createModel(null, dirname, isSpatial, inProject);
  },
  handleCreateProjectClick: function (e) {
    let dirname = this.root === "none" ? "" : this.root;
    this.createProject(null, dirname);
  },
  handleCreateDomain: function (e) {
    let dirname = this.root === "none" ? "/" : this.root;
    let queryStr = "?domainPath=" + dirname + "&new";
    window.location.href = path.join(app.getBasePath(), "stochss/domain/edit") + queryStr;
  },
  importModel: function (node) {
    if(document.querySelector('#importModelModal')){
      document.querySelector('#importModelModal').remove();
    }
    let mdlListEP = path.join(app.getApiPath(), 'project/add-existing-model') + "?path=" + this.root;
    app.getXHR(mdlListEP, {
      always: (err, response, body) => {
        let modal = $(modals.importModelHtml(body.files)).modal();
        let okBtn = document.querySelector('#importModelModal .ok-model-btn');
        let select = document.querySelector('#importModelModal #modelFileSelect');
        let location = document.querySelector('#importModelModal #modelPathSelect');
        select.addEventListener("change", (e) => {
          okBtn.disabled = e.target.value && body.paths[e.target.value].length >= 2;
          if(body.paths[e.target.value].length >= 2) {
            var locations = body.paths[e.target.value].map((path) => {
              return `<option>${path}</option>`;
            });
            locations.unshift(`<option value="">Select a location</option>`);
            locations = locations.join(" ");
            $("#modelPathSelect").find('option').remove().end().append(locations);
            $("#location-container").css("display", "block");
          }else{
            $("#location-container").css("display", "none");
            $("#modelPathSelect").find('option').remove().end();
          }
        });
        location.addEventListener("change", (e) => {
          okBtn.disabled = !Boolean(e.target.value);
        });
        okBtn.addEventListener("click", (e) => {
          modal.modal('hide');
          let mdlPath = body.paths[select.value].length < 2 ? body.paths[select.value][0] : location.value;
          let queryStr = "?path=" + this.root + "&mdlPath=" + mdlPath;
          let endpoint = path.join(app.getApiPath(), 'project/add-existing-model') + queryStr;
          app.postXHR(endpoint, null, {
            success: (err, response, body) => {
              if(document.querySelector("#successModal")) {
                document.querySelector("#successModal").remove();
              }
              let successModal = $(modals.successHtml(body.message)).modal();
              this.config.updateParent(this, "model");
              this.refreshJSTree(null);
            },
            error: function (err, response, body) {
              if(document.querySelector("#errorModal")) {
                document.querySelector("#errorModal").remove();
              }
              let errorModal = $(modals.errorHtml(body.Reason, body.Message)).modal();
            }
          });
        });
      }
    });
  },
  refreshInitialJSTree: function () {
    let count = $('#files-jstree').jstree()._model.data['#'].children.length;
    if(count == 0) {
      this.refreshJSTree(null);
      setTimeout(() => {
        this.refreshInitialJSTree();
      }, 3000);
    }
  },
  refreshJSTree: function (par) {
    if(par === null || par.type === 'root'){
      this.jstreeIsLoaded = false
      $('#files-jstree').jstree().deselect_all(true)
      $('#files-jstree').jstree().refresh();
    }else{
      $('#files-jstree').jstree().refresh_node(par);
    }
  },
  setupJstree: function (cb) {
    $.jstree.defaults.contextmenu.items = (o, cb) => {
      let nodeType = o.original.type;
      let zipTypes = this.config.contextZipTypes;
      let asZip = zipTypes.includes(nodeType);
      let optionsButton = $(this.queryByHook("options-for-node"));
      if(!this.nodeForContextMenu) {
        optionsButton.prop('disabled', false);
      }
      optionsButton.text("Actions for " + o.original.text);
      this.nodeForContextMenu = o;
    }

    $(document).ready(() => {
      $(document).on('shown.bs.modal', (e) => {
        $('[autofocus]', e.target).focus();
      });
      $(document).on('dnd_start.vakata', (data, element, helper, event) => {
        $('#files-jstree').jstree().load_all();
      });
      $('#files-jstree').jstree(this.treeSettings).bind("loaded.jstree", (event, data) => {
        this.jstreeIsLoaded = true;
      }).bind("refresh.jstree", (event, data) => {
        this.jstreeIsLoaded = true;
      });
      $('#files-jstree').on('click.jstree', (e) => {
        let parent = e.target.parentElement;
        let _node = parent.children[parent.children.length - 1];
        let node = $('#files-jstree').jstree().get_node(_node);
        if(_node.nodeName === "A" && $('#files-jstree').jstree().is_loaded(node) && node.type === "folder"){
          this.refreshJSTree(node);
        }
        let optionsButton = $(this.queryByHook("options-for-node"));
        if(this.nodeForContextMenu === null){
          optionsButton.prop('disabled', false);
        }
        optionsButton.text("Actions for " + node.original.text);
        this.nodeForContextMenu = node;
      });
      $('#files-jstree').on('dblclick.jstree', (e) => {
        this.config.doubleClick(this, e);
      });
    });
  },
  validateName: function (input, {rename = false, saveAs = true}={}) {
    var error = ""
    if(input.endsWith('/')) {
      error = 'forward'
    }
    var invalidChars = "`~!@#$%^&*=+[{]}\"|:;'<,>?\\"
    if(rename || !saveAs) {
      invalidChars += "/"
    }
    for(var i = 0; i < input.length; i++) {
      if(invalidChars.includes(input.charAt(i))) {
        error = error === "" || error === "special" ? "special" : "both"
      }
    }
    return error
  }
});