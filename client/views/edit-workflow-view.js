var $ = require('jquery');
var _ = require('underscore');
var xhr = require('xhr');
var path = require('path');
//support files
var app = require('../app');
var modals = require('../modals');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/editWorkflowView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-workflow-open]' : 'handleOpenWorkflowClick',
    'click [data-hook=project-workflow-remove]' : 'handleDeleteWorkflowClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(this.model.status === "running"){
      this.getStatus()
      console.log("updating status")
    }
  },
  getStatus: function () {
    var self = this;
    var endpoint = path.join(app.getApiPath(), "workflow/workflow-status")+"?path="+this.model.path;
    xhr({uri: endpoint}, function (err, response, body) {
      if(self.model.status !== body )
        self.model.status = body;
      if(self.model.status === 'running')
        setTimeout(_.bind(self.getStatus, self), 1000);
      else{
        $(self.queryByHook("project-workflow-status")).text(self.model.status)
        console.log(self.model.status)
      }
    });
  },
  handleOpenWorkflowClick: function (e) {
    let endpoint = path.join(app.getBasePath(), "stochss/workflow/edit")+"?path="+this.model.path+"&type=none";
    window.location.href = endpoint
  },
  handleDeleteWorkflowClick: function (e) {
    let self = this
    if(document.querySelector('#deleteFileModal')) {
      document.querySelector('#deleteFileModal').remove();
    }
    let modal = $(modals.deleteFileHtml("experiment")).modal();
    let yesBtn = document.querySelector('#deleteFileModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      let endpoint = path.join(app.getApiPath(), 'file/delete')+"?path="+self.model.path
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          self.parent.parent.parent.parent.update("workflows-editor")
        }
      });
      modal.modal('hide')
    });
  }
});