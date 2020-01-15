var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates

module.exports = View.extend({
  events: {
    'click [data-hook=advanced-settings-button]' : 'changeAdvancedCollapseButtonText',
    'click [data-hook=collapse]' : 'changeSettingsCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
  },
  changeSettingsCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
  changeAdvancedCollapseButtonText: function () {
    var text = $(this.queryByHook('advanced-settings-button')).text();
    text === '+' ? $(this.queryByHook('advanced-settings-button')).text('-') : $(this.queryByHook('advanced-settings-button')).text('+');
  },
});