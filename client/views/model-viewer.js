var path = require('path');
var $ = require('jquery');
//views
var View = require('ampersand-view');
var SpeciesViewer = require('./species-viewer');
var ParametersViewer = require('./parameters-viewer');
var ReactionsViewer = require('./reactions-viewer');
var EventsViewer = require('./events-viewer');
var RulesViewer = require('./rules-viewer');
var ModelSettingsViewer = require('./model-settings-viewer');
//templates
var template = require('../templates/includes/modelViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-model]' : function (e) {
      this.changeCollapseButtonText()
    },
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    if(attrs.status) {
      this.status = attrs.status;
    }else{
      this.status = "complete"
    }
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var speciesViewer = new SpeciesViewer({
      collection: this.model.species,
    });
    var parametersViewer = new ParametersViewer({
      collection: this.model.parameters,
    });
    var reactionsViewer = new ReactionsViewer({
      collection: this.model.reactions,
    });
    var eventsViewer = new EventsViewer({
      collection: this.model.eventsCollection,
    });
    var rulesViewer = new RulesViewer({
      collection: this.model.rules,
    });
    var modelSettingsViewer = new ModelSettingsViewer({
      model: this.model.modelSettings,
    });
    this.registerRenderSubview(speciesViewer, "species-viewer-container");
    this.registerRenderSubview(parametersViewer, "parameters-viewer-container");
    this.registerRenderSubview(reactionsViewer, "reactions-viewer-container");
    this.registerRenderSubview(eventsViewer, "events-viewer-container");
    this.registerRenderSubview(rulesViewer, "rules-viewer-container");
    this.registerRenderSubview(modelSettingsViewer, "model-settings-viewer-container");
    if(this.status === 'complete'){
      this.enableCollapseButton();
    }
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  changeCollapseButtonText: function () {
    var text = $(document.querySelector('#model-viewer-header #'+this.model.name)).text();
    text === '+' ? $(document.querySelector('#model-viewer-header #'+this.model.name)).text('-') : $(document.querySelector('#model-viewer-header #'+this.model.name)).text('+');
  },
  enableCollapseButton: function () {
    $(this.queryByHook('collapse-model')).prop('disabled', false);
  },
});