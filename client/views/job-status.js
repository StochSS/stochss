var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/jobStatus.pug');


module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.startTime = attrs.startTime;
    this.status = attrs.status;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.status !== 'ready' && this.status !== 'new'){
      this.expandContainer()
    }
  },
  expandContainer: function () {
    $(this.queryByHook('job-status')).collapse('show');
    $(this.queryByHook('collapse')).prop('disabled', false);
  },
});