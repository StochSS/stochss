var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates
var deterministicTemplate = require('../templates/includes/deterministicSettingsViewer.pug');
var ssaTemplate = require('../templates/includes/ssaSettingViewer.pug');
var tauTemplate = require('../templates/includes/tauSettingsViewer.pug');
var hybridTemplate = require('../templates/includes/hybridSettingsViewer.pug');

module.exports = View.extend({
  events: {
    'click [data-hook=advanced-settings-button]' : 'changeAdvancedCollapseButtonText',
    'click [data-hook=collapse]' : 'changeSettingsCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    if(!this.model.is_stochastic){
      this.template = deterministicTemplate
    }else if(this.model.stochasticSettings.algorithm === "SSA"){
      this.template = ssaTemplate
    }else if(this.model.stochasticSettings.algorithm === "Tau-Leaping"){
      this.template = tauTemplate
    }else{
      this.template = hybridTemplate
    }
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