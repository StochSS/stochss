var path = require('path');
//support files
var app = require('../app');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/editModelView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=project-model-edit]' : 'handleEditModelClick'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
  },
  handleEditModelClick: function (e) {
    window.location.href = path.join(app.getBasePath(), "stochss/models/edit")+"?path="+this.model.directory
  }
});