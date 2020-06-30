//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/editWorkflowView.pug');

module.exports = View.extend({
  template: template,
  events: {},
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
  }
});