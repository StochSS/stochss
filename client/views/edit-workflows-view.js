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
    'click [data-hook=project-workflow-group-new-workflow]' : 'handleNewWorkflowClick'
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
        let mdlPath = models.filter(function (model) {
          return model.name === select.value;
        })[0].directory;
        let projectPath = self.parent.parent.parent.projectPath;
        if(mdlPath.includes(".wkgp")) {
          var parentPath = path.dirname(mdlPath)
        }else {
          var parentPath = path.join(projectPath, self.parent.model.name)+".wkgp"
        }
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
  }
});