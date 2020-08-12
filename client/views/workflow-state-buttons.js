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
  },
  clickSaveHandler: function (e) {
    this.saving();
    var self = this;
    var model = this.model
    var optType = this.parent.parent.urlPathParam.endsWith(".mdl") ? "sn" : "se";
    this.saveModel(function () {
      let query = JSON.stringify({"type":self.type,
                                  "optType":optType,
                                  "mdlPath":model.directory,
                                  "wkflPath":self.parent.parent.wkflPath,
                                  "settings":self.parent.settings
                                })
      var endpoint = path.join(app.getApiPath(), 'workflow/save-workflow') + "?data=" + query;
      xhr({uri: endpoint}, function (err, response, body) {
        self.saved();
        if(self.parent.parent.urlPathParam.endsWith('.mdl')){
          self.parent.parent.reloadWkfl(); 
        }
      });
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
