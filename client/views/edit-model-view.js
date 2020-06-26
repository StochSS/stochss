var $ = require('jquery');
var xhr = require('xhr');
var path = require('path');
//support files
var app = require('../app');
var modals = require('../modals');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/editModelView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-model-edit]' : 'handleEditModelClick',
    'click [data-hook=project-model-remove]' : 'handleRemoveModelClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
  },
  handleEditModelClick: function (e) {
    window.location.href = path.join(app.getBasePath(), "stochss/models/edit")+"?path="+this.model.directory
  },
  handleRemoveModelClick: function (e) {
    let self = this
    if(document.querySelector('#deleteFileModal')) {
      document.querySelector('#deleteFileModal').remove();
    }
    let modal = $(modals.deleteFileHtml("model")).modal();
    let yesBtn = document.querySelector('#deleteFileModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      let endpoint = path.join(app.getApiPath(), 'file/delete')+"?path="+self.model.directory
      xhr({uri: endpoint, json: true}, function (err, response, body) {
        if(response.statusCode < 400) {
          self.parent.parent.update("model-editor")
        }
      });
      modal.modal('hide')
    });
  }
});