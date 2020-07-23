//views
var View = require('ampersand-view');
var EditExperimentView = require('./edit-experiment-view');
//templates
var template = require('../templates/includes/editExperimentsView.pug');

module.exports = View.extend({
  template: template,
  events: {},
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, EditExperimentView, this.queryByHook("project-experiments-list"))
  }
});