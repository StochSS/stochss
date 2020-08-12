let $ = require('jquery');
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
    this.renderEditModelview()
  },
  renderEditModelview: function () {
    if(this.editModelView) {
      this.editModelView.remove()
    }
    this.editModelView = this.renderCollection(this.collection, EditModelView, this.queryByHook("project-models-list"))
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  }
});