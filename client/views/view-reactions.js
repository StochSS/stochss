var katex = require('katex');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/viewReactions.pug');

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    katex.render(this.model.summary, this.queryByHook('summary'), {
      displayMode: true,
      output: 'mathml'
    });
  },
});