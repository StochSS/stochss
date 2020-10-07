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
//support file
let app = require('../app');
let modals = require('../modals');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/workflowStateButtons.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=start-workflow]'  : 'clickStartWorkflowHandler',
    'click [data-hook=edit-model]' : 'clickEditModelHandler',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.type = attrs.type
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    $(this.queryByHook("save")).prop('disabled', this.parent.parent.modelLoadError)
    $(this.queryByHook("start-workflow")).prop('disabled', this.parent.parent.modelLoadError)
    $(this.queryByHook("edit-model")).prop('disabled', this.parent.parent.modelLoadError)
  },
  clickSaveHandler: function (e, cb) {
    this.saving();
    var self = this;
    var model = this.model
    var optType = this.parent.parent.urlPathParam.endsWith(".mdl") ? "sn" : "se";
    this.saveModel(function () {
      self.saveWorkflow(model, optType, cb)
    });
  },
  saveWorkflow: function (model, optType, cb) {
    let self = this
    let query = JSON.stringify({"type":self.type,
                                  "optType":optType,
                                  "mdlPath":model.directory,
                                  "wkflPath":self.parent.parent.wkflPath,
                                  "settings":self.parent.settings
                                })
    var endpoint = path.join(app.getApiPath(), 'workflow/save-workflow') + "?data=" + query;
    xhr({uri: endpoint}, function (err, response, body) {
      self.saved();
      if(cb){
        cb()
      }else if(self.parent.parent.urlPathParam.endsWith('.mdl')){
        self.parent.parent.reloadWkfl();
      }
    });
  },
  clickStartWorkflowHandler: function (e) {
    this.saveModel(this.runWorkflow.bind(this));
  },
  clickEditModelHandler: function (e) {
    var self = this
    this.saveModel(function () {
      window.location.href = path.join(app.getBasePath(), "stochss/models/edit")+"?path="+self.model.directory;
    });
  },
  saveModel: function (cb) {
    // this.model is a ModelVersion, the parent of the collection is Model
    let self = this
    if(this.parent.settings.simulationSettings.isAutomatic){
      this.parent.settings.simulationSettings.letUsChooseForYou(this.model);
    }
    var model = this.model;
    if (cb) {
      model.save(model.attributes, {
        success: cb,
        error: function (model, response, options) {
          console.error("Error saving model:", model);
          console.error("Response:", response);
          self.saveError()
          let title = response.body.Reason
          let error = response.body.Message
          var saveErrorModal = $(modals.modelSaveErrorHtml(title, error)).modal()
        },
      });
    } else {
      model.saveModel();
    }
  },
  saving: function () {
    var saving = this.queryByHook('saving-workflow');
    var saved = this.queryByHook('saved-workflow');
    var saveError = this.queryByHook('save-error');
    saved.style.display = "none";
    saveError.style.display = "none";
    saving.style.display = "inline-block";
  },
  saved: function () {
    var saving = this.queryByHook('saving-workflow');
    var saved = this.queryByHook('saved-workflow');
    saving.style.display = "none";
    saved.style.display = "inline-block";
  },
  saveError: function () {
    var saving = this.queryByHook('saving-workflow');
    var saveError = this.queryByHook('save-error');
    saving.style.display = "none";
    saveError.style.display = "inline-block";
  },
  runWorkflow: function () {
    var self = this;
    var model = this.model;
    var optType = this.parent.parent.urlPathParam.endsWith(".mdl") ? "rn" : "re";
    var query = {"type":this.type,
                 "optType":"s"+optType,
                 "mdlPath":model.directory,
                 "wkflPath":self.parent.parent.wkflPath,
                 "settings":self.parent.settings
               }
    let initQuery = JSON.stringify(query)
    var initEndpoint = path.join(app.getApiPath(), '/workflow/save-workflow') + "?data=" + initQuery;
    query.optType = optType
    let runQuery = JSON.stringify(query)
    var runEndpoint = path.join(app.getApiPath(), '/workflow/run-workflow') + "?data=" + runQuery;
    this.saving()
    xhr({uri: initEndpoint}, function (err, response, body) {
      if(response.statusCode < 400){
        self.saved()
        xhr({uri: runEndpoint}, function (err, response, body) {
          self.parent.parent.reloadWkfl();
        })
      }else{
        self.saveError()
      }
    });
  },
});
