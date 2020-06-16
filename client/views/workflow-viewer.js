var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/workflowViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-workflow]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-workflow')).text();
    text === '+' ? $(this.queryByHook('collapse-workflow')).text('-') : $(this.queryByHook('collapse-workflow')).text('+');
  }
})