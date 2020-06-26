//views
var View = require('ampersand-view');
var EditModelView = require('./edit-model-view');
//templates
var template = require('../templates/includes/editModelsView.pug');

module.exports = View.extend({
  template: template,
  events: {},
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, arguments) {
    View.prototype.render.apply(this, arguments)
    this.renderCollection(this.collection, EditModelView, this.queryByHook("project-models-list"))
  }
});