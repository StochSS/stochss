var $ = require('jquery');
//views
var View = require('ampersand-view');
var ExperimentView = require('./experiment-viewer');
//templates
var template = require('../templates/includes/experimentsViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-experiments]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.renderCollection(this.collection, ExperimentView, this.queryByHook('experiment-container'))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-experiments')).text();
    text === '+' ? $(this.queryByHook('collapse-experiments')).text('-') : $(this.queryByHook('collapse-experiments')).text('+');
  }
})