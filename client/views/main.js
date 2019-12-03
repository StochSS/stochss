var _ = require('underscore');
var $ = require('jquery');
//var setFavicon = require('favicon-setter');
var app = require('ampersand-app');
var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var localLinks = require('local-links');
var domify = require('domify');
var path = require('path');

var headTemplate = require('!pug-loader!../templates/head.pug');
var bodyTemplate = require('!pug-loader!../templates/body.pug');

var config = app.config;

let operationInfoModalHtml = (infoMessageKey) => {
  let fileSystemMessage = `
    <b>Expand a directory</b>: Click on the arrow next to the directory or double click on the directory.<br>
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

module.exports = View.extend({
  template: bodyTemplate,
  autoRender: true,
  initialize: function () {
      this.listenTo(app, 'page', this.handleNewPage);
  },
  events: {
    'click [data-hook=file-system-information-main]' : function () {
      let modal = $(operationInfoModalHtml('File System')).modal();
    },
    'click [data-hook=create-model-information-main]' : function () {
      let modal = $(operationInfoModalHtml('Create A Model')).modal();
    },
    'click [data-hook=edit-model-information-main]' : function () {
      let modal = $(operationInfoModalHtml('Edit A Model')).modal();
    },
    'click [data-hook=create-job-information-main]' : function () {
      let modal = $(operationInfoModalHtml('Create A Job')).modal();
    },
    'click [data-hook=edit-job-information-main]' : function () {
      let modal = $(operationInfoModalHtml('Edit A Job')).modal();
    },
    'click [data-hook=notebook-information-main]' : function () {
      let modal = $(operationInfoModalHtml('Jupyter Notebooks')).modal();
    },
    'click [data-hook=jupyter-hub-information-main]' : function () {
      let modal = $(operationInfoModalHtml('Jupyter Hub')).modal();
    },
    //'click a[href]': 'handleLinkClick'
  },
  render: function () {

    document.head.appendChild(domify(headTemplate()));

    this.renderWithTemplate(this);
    
    this.pageContainer = this.queryByHook('page-container');

    this.pageSwitcher = new ViewSwitcher({
      el: this.pageContainer,
      show: function (newView, oldView) {
        document.title = _.result(newView, 'pageTitle') || 'StochSS';
        document.scrollTop = 0;
        
        app.currentPage = newView;
      }
    });

    return this;
  },
  
  handleNewPage: function (view) {
    this.pageSwitcher.set(view);
    //this.updateActiveNav();
  },

  handleLinkClick: function (e) {
    var localPath = localLinks.pathname(e);

    if (localPath) {
      e.preventDefault();
      this.navigate(localPath);
    }
  },

  navigate: function (page) {
    window.location = url;
  }
});
