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
      if(op === 'move_node' && more && more.ref && more.ref.type && more.ref.type != 'folder'){
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
  },  
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


let operationInfoModalHtml = (infoMessageKey) => {
  let fileSystemMessage = `
    <b>Expand a directory</b>: Click on the arrow next to the directory or double click on the directory.<br>
    <b>Refresh a Dirctory</b>:<br>
    <b>Rename A File</b>: Right click on a file and enter the new name.<br>
    <b>Move A File or Directory</b>: Click and drag the file or directory to the new location.   
    You can only move an item to a directory if there isn't a file or directory with the same name in that location.<br>
    <b>Duplicate A File</b>: Right click on a file and click Duplicate.<br>
    <b>Delete A File or Directory</b>: Right click on a file or directory and click Delete, then confirm the delete.
  `;
  let createModelMessage = `
    <b>GillesPy2 Model</b>: Right click on a directory, click create model, then click Non-Spatial.
    Enter a name for the model and click OK.<br>
    <b>Add a Species or Parameter</b>: From the Model Editor page click on the Add Species or Add Parameter buttons.<br>
    <b>Add a Reaction</b>: From the Model Editor page click on the Add Reaction button then select the type of reaction.  
    To add a reaction you must have at least one Species.<br>
    <b>Edit a Reaction</b>: Select the reaction you wish to edit, and make changes to the right or the reaction list.<br>
    <b>Species Mode</b>: Select the Hybrid Tua-Leaping algorithm in the advanced settings.<br>
    <b>Set Rate Rules</b>: Set the mode of the species to continuous, then add the rate rule to the right of the species mode.
  `;
  let editModelMessage = `
    <b>Open a Model</b>: Double click on a model or right click on a model and click Edit Model.<br>
    <b>Add a Species or Parameter</b>: From the Model Editor page click on the Add Species or Add Parameter buttons.<br>
    <b>Add a Reaction</b>: From the Model Editor page click on the Add Reaction button then select the type of reaction.  
    To add a reaction you must have at least one Species.<br>
    <b>Edit a Reaction</b>: Select the reaction you wish to edit, and make changes to the right or the reaction list.<br>
    <b>Species Mode</b>: Select the Hybrid Tua-Leaping algorithm in the advanced settings.<br>
    <b>Set Rate Rules</b>: Set the mode of the species to continuous, then add the rate rule to the right of the species mode.
  `;
  let createJobMeeage = `
    <b>Create a Job</b>: From the File Browser page right click on a model and click Create Job.  
    From the Model Editor page click on the Create Job button at the bottum of the page.<br>
    <b>Job Name</b>: On the Job Manager page you may edit the name of job as long as the job as not been saved.  
    Job Names always end with a time stamp.<br>
    <b>Model Path</b>: If you move or rename the model make sure to update this path.<br>
    <b>Job Editor</b>: This is where you can customize the settings for your job.  
    If you need to edit other part of you model click on the edit model button.  
    The Job Editor is only available for models that have not been run.<br>
    <b>Plot Results</b>: You may change the title, x-axis label, and y-axis label by entering the name in the correct field, then click plot.<br>
    <b>Model Viewer</b>: You can view the model that will be used when you run your job in the Model section.
  `;
  let editJobMessage = `
    <b>Open a Job</b>: Double click on the Job or right click on the job and click View Job.<br>
    <b>Job Name</b>: The job name may not be changed from the Job Manager page.  
    Job Names always end with a time stamp.<br>
    <b>Model Path</b>: If you move or rename the model make sure to update this path.<br>
    <b>Job Editor</b>: This is where you can customize the settings for your job.  
    If you need to edit other part of you model click on the edit model button.  
    The Job Editor is only available for models that have not been run.<br>
    <b>Plot Results</b>: You may change the title, x-axis label, and y-axis label by entering the name in the correct field, then click plot.<br>
    <b>Model Viewer</b>: You can view the model that will be used when you run your job in the Model section.
  `;
  let notebookMessage = `
    <b>Create A New Notebook</b>: Right click on a model and click Convert to Notebook, 
    or click on the Jupyter Hub link under tools, then click on the new button, and select Python 3.<br>
    <b>Open A Notebook</b>: Double click on the Notebook or right click on the Notebook and click Open Notebook.<br>
    <b>Note</b>: Notebooks will open in a new tab so you may want to turn off the pop-up blocker.
  `;
  let jhubMessage = `
    You can access Jupyter Hub by clicking on the Jupyter Hub link under tools.<br>
    <b>Open A File or Directory</b>: Click on the file or directory.<br>
    <b>File or Directory Options</b>: Check the box to the left of the file or directory and the options will show above the file browser.  
    Checking multiple boxes will display options that are common to all checked items.
    To delete a directory you must first make sure its empty.<br>
    <b>New Directory</b>: Click on the new button then select Folder.  
    To name the directory use the directory options.<br>
    <b>New File</b>: Click on the new button then select Text File.  
    To name the file click on 'untitled.txt' and enter the new name.<br>
    <b>Upload A File</b>: Click on the Upload button and select the file you wish to upload.  
    You can rename the file by clicking on the file name and entering the new name.
    You can move the file into a directory by navigating to the location before finishing the upload.  
    To finish the upload click on the Upload button to the right of the file.
  `;

  let infoMessages = {'File System': fileSystemMessage,
                      'Create A Model': createModelMessage,
                      'Edit A Model': editModelMessage,
                      'Create A Job': createJobMeeage,
                      'Edit A Job': editJobMessage,
                      'Jupyter Notebooks' : notebookMessage,
                      'Jupyter Hub': jhubMessage};

  return `
    <div id="operationInfoModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content info">
          <div class="modal-header">
            <h5 class="modal-title"> ${infoMessageKey} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p> ${infoMessages[infoMessageKey]} </p>
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
    'click [data-hook=new-model]' : 'newModel',
    'click [data-hook=new-spatial-model]' : 'newSpatialModel',
    'click [data-hook=file-system-information]' : function () {
      let modal = $(operationInfoModalHtml('File System')).modal();
    },
    'click [data-hook=create-model-information]' : function () {
      let modal = $(operationInfoModalHtml('Create A Model')).modal();
    },
    'click [data-hook=edit-model-information]' : function () {
      let modal = $(operationInfoModalHtml('Edit A Model')).modal();
    },
    'click [data-hook=create-job-information]' : function () {
      let modal = $(operationInfoModalHtml('Create A Job')).modal();
    },
    'click [data-hook=edit-job-information]' : function () {
      let modal = $(operationInfoModalHtml('Edit A Job')).modal();
    },
    'click [data-hook=notebook-information]' : function () {
      let modal = $(operationInfoModalHtml('Jupyter Notebooks')).modal();
    },
    'click [data-hook=jupyter-hub-information]' : function () {
      let modal = $(operationInfoModalHtml('Jupyter Hub')).modal();
    },
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
        $('#models-jstree').jstree().refresh_node(node);
      })
    }
  },
  duplicateFile: function(o) {
    var self = this;
    var parentID = o.parent;
    var endpoint = path.join("/stochss/api/model/duplicate", o.original._path);
    xhr({uri: endpoint}, 
      function (err, response, body) {
        if(parentID === "#"){
          $('#models-jstree').jstree().refresh()
        }else{          
          var node = $('#models-jstree').jstree().get_node(parentID);
          $('#models-jstree').jstree().refresh_node(node);
        }
      }
    );
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
            node.original._path = resp._path
            $('#models-jstree').jstree().refresh_node(parent)
          }else{
            node.original._path = resp._path
            $('#models-jstree').jstree().refresh_node(parent)
          }
        })
      }
      extensionWarning.collapse('hide');
      nameWarning.collapse('hide');
    });
  },
  setupJstree: function () {
    var self = this;
    $.jstree.defaults.contextmenu.items = (o, cb) => {
      if (o.type ===  'folder') {
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
              window.location.href = path.join("/hub/stochss/models/edit", o.original._path);
            }
          },
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFile(o)
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
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Create New Job" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Create New Job",
            "action" : function (data) {
              window.location.href = path.join("/hub/stochss/jobs/edit", o.original._path);
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
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFile(o)
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
            "_disabled" : false,
            "label" : "Convert to Notebook",
            "action" : function (data) {
              var endpoint = path.join("/stochss/api/models/to-notebook", o.original._path)
              xhr({ uri: endpoint },
                    function (err, response, body) {
                var node = $('#models-jstree').jstree().get_node(o.parent)
                $('#models-jstree').jstree().refresh_node(node);
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
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
          "Create New Job" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Create New Job",
            "action" : function (data) {
              window.location.href = path.join("/hub/stochss/jobs/edit", o.original._path);
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
      else if (o.type === 'job') {
        return {
          "View Job" : {
            "separator_before" : false,
            "separator_after" : true,
            "_disabled" : false,
            "_class" : "font-weight-bolder",
            "label" : "View Job",
            "action" : function (data) {
              window.location.href = path.join("/hub/stochss/jobs/edit", o.original._path);
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
          "Duplicate" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Duplicate",
            "action" : function (data) {
              self.duplicateFile(o)
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
          "Rename" : {
            "separator_before" : false,
            "separator_after" : false,
            "_disabled" : false,
            "label" : "Rename",
            "action" : function (data) {
              self.renameNode(o);
            }
          },
        }
      }
    }
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
      }else if(file.endsWith('.job')){
        window.location.href = path.join("/hub/stochss/jobs/edit", _path);
      }else if(node.type === "folder" && $('#models-jstree').jstree().is_open(node) && $('#models-jstree').jstree().is_loaded(node)){
        $('#models-jstree').jstree().refresh_node(node)
      }
    });
  }
});

initPage(FileBrowser);
