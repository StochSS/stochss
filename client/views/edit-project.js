let $ = require('jquery');
let xhr = require('xhr');
let path = require('path');
//support files
let app = require('../app');
let modals = require('../modals')
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/editProject.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=open-project-btn]' : 'handleOpenProjectClick',
    'click [data-hook=remove-project-btn]' : 'handleRemoveProjectClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.projectName = this.model.directory.split('/').pop().split('.')[0]
    this.location = this.getLocationString(this.model.directory)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
  },
  getLocationString: function (projectPath) {
    let parent = path.dirname(projectPath)
    if(parent === '.') {
      return '/'
    }
    return parent
  },
  handleOpenProjectClick: function (e) {
    window.location.href = path.join(app.getBasePath(), "stochss/project/manager")+"?path="+this.model.directory
  },
  handleRemoveProjectClick: function (e) {
    console.log("deleting the project")
    let endpoint = path.join(app.getApiPath(), "file/delete")+"?path="+this.model.directory
    var self = this
    if(document.querySelector('#deleteFileModal')) {
      document.querySelector('#deleteFileModal').remove()
    }
    let modal = $(modals.deleteFileHtml("project")).modal();
    let yesBtn = document.querySelector('#deleteFileModal .yes-modal-btn');
    yesBtn.addEventListener('click', function (e) {
      xhr({uri: endpoint}, function(err, response, body) {
        if(response.statusCode < 400) {
          self.model.collection.remove(self.model)
          console.log(body)
        }else{
          body = JSON.parse(body)
        }
      })
      modal.modal('hide')
    });
  }
});