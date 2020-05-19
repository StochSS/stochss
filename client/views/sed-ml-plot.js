var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/sedMLPlot.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-sedml-plot]' : 'changeCollapseButtonText'
  },
  initialize: function(attrs, options) {
    View.prototype.initialize.apply(this, arguments)
    console.log(this.model)
  },
  render: function(attrs, options) {
    View.prototype.render.apply(this, arguments)
  },
  update: function() {
  },
  updateValid: function() {
  },
  changeCollapseButtonText: function (e) {
    var source = e.target.dataset.hook
    console.log(source)
    var text = $(this.queryByHook(source)).text();
    text === '+' ? $(this.queryByHook(source)).text('-') : $(this.queryByHook(source)).text('+');
  }
});