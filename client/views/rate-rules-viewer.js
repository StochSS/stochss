var $ = require('jquery');
//views
var View = require('ampersand-view');
var ViewRateRules = require('./view-rate-rules');
//templates
var template = require('../templates/includes/RateRulesViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ViewRateRules, this.queryByHook('rate-rules-list'))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});