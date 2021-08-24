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
//config
let FileConfig = require('../file-config')
let ProjectConfig = require('../project-config');
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/jstreeView.pug');

module.exports = View.extend({
  template: template,
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
          if(op === "rename_node" && this.validateName(pos, true) !== ""){
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
            return this.config.validateMove(this, node, more);
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
        }else{
          let optionsButton = $(this.queryByHook("options-for-node"));
          if(this.nodeForContextMenu === null){
            optionsButton.prop('disabled', false);
          }
          optionsButton.text("Actions for " + node.original.text);
          this.nodeForContextMenu = node;
        }
      });
      $('#files-jstree').on('dblclick.jstree', (e) => {
        this.config.doubleClick(this, e);
      });
    });
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
  }
});