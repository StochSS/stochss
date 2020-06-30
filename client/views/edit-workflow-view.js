var path = require('path');
//support files
var app = require('../app');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/editWorkflowView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-workflow-open]' : 'handleOpenWorkflowClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
  },
  handleOpenWorkflowClick: function (e) {
    let endpoint = path.join(app.getBasePath(), "stochss/workflow/edit")+"?path="+this.model.path+"&type=none";
    window.location.href = endpoint
  }
});