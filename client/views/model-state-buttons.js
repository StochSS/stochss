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

var path = require('path');
var Plotly = require('../lib/plotly');
var $ = require('jquery');
let _ = require('underscore');
//support file
var app = require('../app');
var modals = require('../modals');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/modelStateButtons.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=save]' : 'clickSaveHandler',
    'click [data-hook=run]'  : 'handleSimulateClick',
    "click [data-hook=stochss-es]" : "handleSimulateClick",
    "click [data-hook=stochss-ps]" : "handleSimulateClick",
    'click [data-hook=new-workflow]' : 'handleSimulateClick',
    'click [data-hook=return-to-project-btn]' : 'clickReturnToProjectHandler',
    'click [data-hook=presentation]' : 'handlePresentationClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.validate = attrs.validate;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.model.directory.includes('.proj')) {
      this.queryByHook("return-to-project-btn").style.display = "inline-block"
    }
    if(this.model.is_spatial) {
      $(this.queryByHook("stochss-es")).addClass("disabled");
      $(this.queryByHook("stochss-ps")).addClass("disabled");
    }else if(app.getBasePath() === "/") {
      $(this.queryByHook("presentation")).css("display", "none");
    }
    if(this.validate && !this.model.valid) {
      let errorMsg = $(this.parent.queryByHook("error-detected-msg"))
      this.displayError(errorMsg)
    }
  },
  clickSaveHandler: function (e) {
    let self = this;
    this.saveModel(_.bind(self.endAction, self, "save"));
  },
  clickRunHandler: function (e) {
    if(this.model.is_spatial && $(this.queryByHook("domain-plot-viewer-container")).css("display") !== "none") {
      this.parent.closeDomainPlot()
    }
    $(this.parent.queryByHook('model-run-error-container')).collapse('hide');
    $(this.parent.queryByHook('model-timeout-message')).collapse('hide');
    var el = this.parent.queryByHook('preview-plot-container');
    Plotly.purge(el)
    $(this.parent.queryByHook('preview-plot-buttons')).css("display", "none");
    if(this.model.is_spatial) {
      this.saveModel(this.getPreviewTarget.bind(this));
    }else{
      this.saveModel(this.runModel.bind(this));
    }
  },
  clickReturnToProjectHandler: function (e) {
    let self = this
    this.saveModel(function () {
      self.endAction("save")
      var dirname = path.dirname(self.model.directory)
      if(dirname.endsWith(".wkgp")) {
        dirname = path.dirname(dirname)
      }
      var queryString = "?path="+dirname
      window.location.href = path.join(app.getBasePath(), "/stochss/project/manager")+queryString;
    })
  },
  clickNewWorkflowHandler: function (e) {
    let self = this
    this.saveModel(function () {
      self.endAction("save")
      var queryString = "?path="+self.model.directory
      if(self.model.directory.includes('.proj')) {
        let wkgp = self.model.directory.includes('.wkgp') ? self.model.name + ".wkgp" : "WorkflowGroup1.wkgp"
        let parentPath = path.join(path.dirname(self.model.directory), wkgp)
        queryString += "&parentPath="+parentPath
      }
      let endpoint = path.join(app.getBasePath(), "stochss/workflow/selection")+queryString
      window.location.href = endpoint
    })
  },
  getPreviewTarget: function () {
    this.endAction("save");
    let species = this.model.species.map(function (species) {
      return species.name
    });
    let self = this;
    let modal = $(modals.selectPreviewTargetHTML(species)).modal();
    let okBtn = document.querySelector("#previewTargetSelectModal .ok-model-btn");
    let select = document.querySelector("#previewTargetSelectModal #previewTargetSelectList");
    okBtn.addEventListener('click', function (e) {
      modal.modal('hide');
      let target = select.value;
      self.runModel(target);
    });
  },
  togglePreviewWorkflowBtn: function () {
    $(this.queryByHook('simulate-model')).prop('disabled', !this.model.valid)
    if(this.model.valid) {
      if(this.model.parameters.length <= 0) {
        $(this.queryByHook("stochss-ps")).addClass("disabled")
      }else{
        $(this.queryByHook("stochss-ps")).removeClass("disabled")
      }
      $(".disabled").click(function(event) {
        event.preventDefaults();
        event.stopPropagation();
        return false;
      });
    }
  },
  saveModel: function (cb) {
    this.startAction("save");
    // this.model is a ModelVersion, the parent of the collection is Model
    var model = this.model;
    if (cb) {
      model.saveModel(cb);
    } else {
      model.saveModel();
    }
  },
  startAction: function (action) {
    if(action === "save") {
      msg = $(this.queryByHook("saving"));
    }else{
      msg = $(this.queryByHook("publishing"));
    }
    msg.css("display", "inline-block");
    var saving = this.queryByHook('mdl-action-start');
    var saved = this.queryByHook('mdl-action-end');
    saved.style.display = "none";
    saving.style.display = "inline-block";
  },
  errorAction: function () {
    oldMsg = $(this.queryByHook("publishing")).css("display", "none");
    var saving = this.queryByHook('mdl-action-start');
    var error = this.queryByHook('mdl-action-err');
    saving.style.display = "none";
    error.style.display = "inline-block";
    setTimeout(function () {
      error.style.display = "none";
    }, 5000);
  },
  endAction: function (action) {
    if(action === "save") {
      oldMsg = $(this.queryByHook("saving"));
      msg = $(this.queryByHook("saved"));
    }else{
      oldMsg = $(this.queryByHook("publishing"));
      msg = $(this.queryByHook("published"));
    }
    oldMsg.css("display", "none");
    msg.css("display", "inline-block");
    var saving = this.queryByHook('mdl-action-start');
    var saved = this.queryByHook('mdl-action-end');
    saving.style.display = "none";
    saved.style.display = "inline-block";
    setTimeout(function () {
      saved.style.display = "none";
      msg.css("display", "none");
    }, 5000);
  },
  runModel: function (target=null) {
    if(typeof target !== "string") {
      this.endAction("save");
    }
    this.running();
    $(this.parent.queryByHook('model-run-container')).css("display", "block")
    var model = this.model
    var queryStr = "?cmd=start&outfile=none&path="+model.directory
    if(target) {
      queryStr += "&target=" + target;
    }
    var endpoint = path.join(app.getApiPath(), 'model/run')+queryStr;
    var self = this;
    app.getXHR(endpoint, {
      always: function (err, response, body) {
        self.outfile = body.Outfile;
        self.getResults();
      }
    });
  },
  running: function () {
    var plot = this.parent.queryByHook('preview-plot-container');
    var spinner = this.parent.queryByHook('plot-loader');
    var errors = this.parent.queryByHook('model-run-error-container');
    plot.style.display = "none";
    spinner.style.display = "block";
    errors.style.display = "none";
  },
  ran: function (noErrors) {
    var runContainer = $(this.parent.queryByHook("model-run-container"));
    if(runContainer.css("display") === "none") {
      runContainer.css("display", 'block');
    }
    $(this.parent.queryByHook('preview-plot-buttons')).css('display', 'inline-block')
    let plotBtn = $(this.parent.queryByHook('toggle-preview-plot'))
    if(plotBtn.text() === "Show Preview") {
      plotBtn.text("Hide Preview")
    }
    var plot = this.parent.queryByHook('preview-plot-container');
    var spinner = this.parent.queryByHook('plot-loader');
    var errors = this.parent.queryByHook('model-run-error-container');
    if(noErrors){
      plot.style.display = "block";
    }else{
      errors.style.display = "block"
    }
    spinner.style.display = "none";
  },
  getResults: function () {
    var self = this;
    var model = this.model;
    setTimeout(function () {
      let queryStr = "?cmd=read&outfile="+self.outfile+"&path="+model.directory
      endpoint = path.join(app.getApiPath(), 'model/run')+queryStr;
      let errorCB = function (err, response, body) {
        self.ran(false);
        $(self.parent.queryByHook('model-run-error-message')).text(body.Results.errors);
      }
      app.getXHR(endpoint, {
        always: function (err, response, body) {
          if(typeof body === "string") {
            body = body.replace(/NaN/g, null)
            body = JSON.parse(body)
          }
          var data = body.Results;
          if(response.statusCode >= 400 || data.errors){
            errorCB(err, response, body);
          }
          else if(!body.Running){
            if(data.timeout){
              $(self.parent.queryByHook('model-timeout-message')).collapse('show');
            }
            self.plotResults(data.results);
          }else{
            self.getResults();
          }
        },
        error: errorCB
      });
    }, 2000);
  },
  plotResults: function (data) {
    // TODO abstract this into an event probably
    var title = this.model.name + " Model Preview"
    this.ran(true)
    el = this.parent.queryByHook('preview-plot-container');
    Plotly.newPlot(el, data);
    window.scrollTo(0, document.body.scrollHeight)
  },
  displayError: function (errorMsg, e) {
    $(this.parent.queryByHook('toggle-preview-plot')).click()
    errorMsg.css('display', 'block')
    this.focusOnError(e)
  },
  handleSimulateClick: function (e) {
    var errorMsg = $(this.parent.queryByHook("error-detected-msg"))
    if(!this.model.valid) {
      this.displayError(errorMsg, e);
    }else{
      errorMsg.css('display', 'none')
      let simType = e.target.dataset.type
      if(simType === "preview") {
        this.clickRunHandler(e)
      }else if(simType === "notebook"){
        this.clickNewWorkflowHandler(e)
      }else if(!this.model.is_spatial) {
        if(simType === "ensemble") {
          app.newWorkflow(this, this.model.directory, this.model.is_spatial, "Ensemble Simulation");
        }else if(simType === "psweep") {
          app.newWorkflow(this, this.model.directory, this.model.is_spatial, "Parameter Sweep");
        }
      }
    }
  },
  handlePresentationClick: function (e) {
    var errorMsg = $(this.parent.queryByHook("error-detected-msg"));
    if(!this.model.valid) {
      this.displayError(errorMsg, e);
    }else{
      let self = this;
      this.startAction("publish")
      let queryStr = "?path=" + this.model.directory;
      let endpoint = path.join(app.getApiPath(), "model/presentation") + queryStr;
      app.getXHR(endpoint, {
        success: function (err, response, body) {
          self.endAction("publish");
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
          self.errorAction();
          $(modals.newProjectModelErrorHtml(body.Reason, body.Message)).modal();
        }
      });
    }
  },
  focusOnError: function (e) {
    if(this.model.error) {
      let self = this
      if(this.model.error.type === "species") {
        this.openSpeciesSection()
      }else if(this.model.error.type === "parameter") {
        this.openParametersSection()
      }else if(this.model.error.type === "reaction") {
        this.openReactionsSection()
      }else if(this.model.error.type === "process"){
        this.openReactionsSection(true)
      }else if(this.model.error.type === "event") {
        this.openEventsSection()
      }else if(this.model.error.type === "rule") {
        this.openRulesSection()
      }else if(this.model.error.type === "volume") {
        this.openVolumeSection()
      }else if(this.model.error.type === "timespan") {
        this.openTimespanSection()
      }else if(this.model.error.type === "domain") {
        this.openDomainSection()
      }
      setTimeout(function () {
        let inputErrors = self.parent.queryAll(".input-invalid")
        let componentErrors = self.parent.queryAll(".component-invalid")
        if(componentErrors.length > 0) {
          componentErrors[0].scrollIntoView({'block':"center"})
        }else if(inputErrors.length > 0) {
          inputErrors[0].focus()
        }
      }, 300)
    }
  },
  openSpeciesSection: function () {
    let specSection = $(this.parent.modelView.speciesView.queryByHook("species-list-container"))
    if(!specSection.hasClass("show")) {
      let specCollapseBtn = $(this.parent.modelView.speciesView.queryByHook("collapse"))
      specCollapseBtn.click()
      specCollapseBtn.html('-')
    }
    this.switchToEditTab(this.parent.modelView.speciesView, "species");
  },
  openDomainSection: function () {
    let domainSection = $(this.parent.modelView.domainViewer.queryByHook("domain-container"))
    if(!domainSection.hasClass("show")) {
      let domainCollapseBtn = $(this.parent.modelView.domainViewer.queryByHook("collapse"))
      domainCollapseBtn.click()
      domainCollapseBtn.html('-')
    }
  },
  openParametersSection: function () {
    let paramSection = $(this.parent.modelView.parametersView.queryByHook("parameters-list-container"))
    if(!paramSection.hasClass("show")) {
      let paramCollapseBtn = $(this.parent.modelView.parametersView.queryByHook("collapse"))
      paramCollapseBtn.click()
      paramCollapseBtn.html('-')
    }
    this.switchToEditTab(this.parent.modelView.parametersView, "parameters");
  },
  openReactionsSection: function (isCollection = false) {
    let error = this.model.error
    let reacSection = $(this.parent.modelView.reactionsView.queryByHook("reactions-list-container"))
    if(!reacSection.hasClass("show")) {
      let reacCollapseBtn = $(this.parent.modelView.reactionsView.queryByHook("collapse"))
      reacCollapseBtn.click()
      reacCollapseBtn.html('-')
    }
    this.switchToEditTab(this.parent.modelView.reactionsView, "reactions");
    if(!isCollection) {
      var reaction = this.model.reactions.filter(function (r) {
        return r.compID === error.id
      })[0]
      this.model.reactions.trigger("select", reaction);
    }
  },
  openEventsSection: function () {
    let error = this.model.error
    let advSection = $(this.parent.modelView.queryByHook("mv-advanced-section"))
    if(!advSection.hasClass("show")) {
      let advCollapseBtn = $(this.parent.modelView.queryByHook("collapse-mv-advanced-section"))
      advCollapseBtn.click()
      advCollapseBtn.html('-')
    }
    let evtSection = $(this.parent.modelView.eventsView.queryByHook("events"))
    if(!evtSection.hasClass("show")) {
      let evtCollapseBtn = $(this.parent.modelView.eventsView.queryByHook("collapse"))
      evtCollapseBtn.click()
      evtCollapseBtn.html('-')
    }
    this.switchToEditTab(this.parent.modelView.eventsView, "events");
    var event = this.model.eventsCollection.filter(function (e) {
      return e.compID === error.id
    })[0]
    this.model.eventsCollection.trigger("select", event);
    event.detailsView.openAdvancedSection()
  },
  openRulesSection: function () {
    let advSection = $(this.parent.modelView.queryByHook("me-advanced-section"))
    if(!advSection.hasClass("show")) {
      let advCollapseBtn = $(this.parent.modelView.queryByHook("collapse-me-advanced-section"))
      advCollapseBtn.click()
      advCollapseBtn.html('-')
    }
    let ruleSection = $(this.parent.modelView.rulesView.queryByHook("rules-list-container"))
    if(!ruleSection.hasClass("show")) {
      let ruleCollapseBtn = $(this.parent.modelView.rulesView.queryByHook("collapse"))
      ruleCollapseBtn.click()
      ruleCollapseBtn.html('-')
    }
    this.switchToEditTab(this.parent.modelView.rulesView, "rules");
  },
  openVolumeSection: function () {
    let advSection = $(this.parent.modelView.queryByHook("me-advanced-section"))
    if(!advSection.hasClass("show")) {
      let advCollapseBtn = $(this.parent.modelView.queryByHook("collapse-me-advanced-section"))
      advCollapseBtn.click()
      advCollapseBtn.html('-')
    }
    let volSection = $(this.parent.modelView.queryByHook("system-volume-section"))
    if(!volSection.hasClass("show")) {
      let volCollapseBtn = $(this.parent.modelView.queryByHook("collapse-system-volume"))
      volCollapseBtn.click()
      volCollapseBtn.html('-')
    }
    this.switchToEditTab(this.parent.modelView, "system-volume");
  },
  openTimespanSection: function () {
    let tspnSection = $(this.parent.modelSettings.queryByHook("timespan-container"))
    if(!tspnSection.hasClass("show")) {
      let tspnCollapseBtn = $(this.parent.modelSettings.queryByHook("collapse"))
      tspnCollapseBtn.click()
      tspnCollapseBtn.html('-')
    }
    this.switchToEditTab(this.parent.modelSettings, "timespan");
  },
  switchToEditTab: function (view, section) {
    let elementID = Boolean(view.model && view.model.elementID) ? view.model.elementID + "-" : "";
    if($(view.queryByHook(elementID + 'view-' + section)).hasClass('active')) {
      $(view.queryByHook(elementID + section + '-edit-tab')).tab('show');
      $(view.queryByHook(elementID + 'edit-' + section)).addClass('active');
      $(view.queryByHook(elementID + 'view-' + section)).removeClass('active');
    }
  }
});
