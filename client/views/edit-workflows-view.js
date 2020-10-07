/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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

var $ = require('jquery');
var xhr = require('xhr');
var path = require('path');
//support files
var app = require('../app');
var modals = require('../modals');
//views
var View = require('ampersand-view');
var EditWorkflowView = require('./edit-workflow-view');
//templates
var template = require('../templates/includes/editWorkflowsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-workflow-group-new-workflow]' : 'handleNewWorkflowClick',
    'click [data-hook=project-workflow-group-add-workflow]' : 'handleAddWorkflowClick',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.renderEditWorkflowView()
  },
  renderEditWorkflowView: function () {
    if(this.editWorkflowView) {
      this.editWorkflowView.remove()
    }
    this.editWorkflowView = this.renderCollection(this.collection, EditWorkflowView, this.queryByHook("project-workflows-list"))
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  validateName(input) {
    var error = ""
    if(input.endsWith('/')) {
      error = 'forward'
    }
    let invalidChars = "`~!@#$%^&*=+[{]}\"|:;'<,>?\\"
    for(var i = 0; i < input.length; i++) {
      if(invalidChars.includes(input.charAt(i))) {
        error = error === "" || error === "special" ? "special" : "both"
      }
    }
    return error
  },
  handleNewWorkflowClick: function (e) {
    let models = this.parent.parent.parent.model.models
    if(models.length > 0) {
      let self = this
      if(document.querySelector("#newProjectWorkflowModal")) {
        document.querySelector("#newProjectWorkflowModal").remove()
      }
      let options = models.map(function (model) { return model.name });
      let modal = $(modals.newProjectWorkflowHtml("Name of the model: ", options)).modal()
      let okBtn = document.querySelector("#newProjectWorkflowModal .ok-model-btn")
      let select = document.querySelector("#newProjectWorkflowModal #select")
      okBtn.addEventListener('click', function (e) {
        let mdlFile = select.value.endsWith('.mdl') ? select.value : select.value + ".mdl"
        let mdlPath =  path.join(self.parent.parent.parent.projectPath, mdlFile)
        let parentPath = path.join(self.parent.parent.parent.projectPath, self.parent.model.name)+".wkgp"
        let queryString = "?path="+mdlPath+"&parentPath="+parentPath
        let endpoint = path.join(app.getBasePath(), 'stochss/workflow/selection')+queryString
        modal.modal('hide')
        window.location.href = endpoint
      });
    }else{
      let title = "No Models Found"
      let message = "You need to add a model before you can create a new workflow."
      let modal = $(modals.noModelsMessageHtml(title, message)).modal()
    }
  },
  handleAddWorkflowClick: function (e) {
    let self = this
    if(document.querySelector("#newProjectWorkflowModal")) {
      document.querySelector("#newProjectWorkflowModal").remove()
    }
    let modal = $(modals.addExistingWorkflowToProjectHtml()).modal()
    let okBtn = document.querySelector("#newProjectWorkflowModal .ok-model-btn")
    let input = document.querySelector("#newProjectWorkflowModal #workflowPathInput")
    input.addEventListener("keyup", function (event) {
      if(event.keyCode === 13){
        event.preventDefault();
        okBtn.click();
      }
    });
    input.addEventListener("input", function (e) {
      var endErrMsg = document.querySelector('#newProjectWorkflowModal #workflowPathInputEndCharError')
      var charErrMsg = document.querySelector('#newProjectWorkflowModal #workflowPathInputSpecCharError')
      let error = self.validateName(input.value)
      okBtn.disabled = error !== ""
      charErrMsg.style.display = error === "both" || error === "special" ? "block" : "none"
      endErrMsg.style.display = error === "both" || error === "forward" ? "block" : "none"
    });
    okBtn.addEventListener('click', function (e) {
      if(Boolean(input.value)) {
        let expPath = path.join(self.parent.parent.projectPath, self.model.name)+".wkgp"
        let queryString = "?path="+expPath+"&wkflPath="+input.value
        let endpoint = path.join(app.getApiPath(), "project/add-existing-workflow")+queryString
        xhr({uri: endpoint, json: true}, function (err, response, body) {
          if(response.statusCode < 400) {
            self.parent.parent.update("workflow-group-editor")
            let successModal = $(modals.addExistingWorkflowToProjectSuccessHtml(body.message)).modal()
          }else{
            let errorModal = $(modals.addExistingWorkflowToProjectErrorHtml(body.Reason, body.Message)).modal()
          }
        });
        modal.modal('hide')
      }
    });
  }
});