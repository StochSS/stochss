var path = require('path');
var $ = require('jquery');
//views
var View = require('ampersand-view');
var SpeciesViewer = require('./species-viewer');
var ParametersViewer = require('./parameters-viewer');
var ReactionsViewer = require('./reactions-viewer');
var RulesViewer = require('./rules-viewer');
var SimulationSettingsViewer = require('./simulation-settings-viewer');
//models
var Model = require('../models/model');
//templates
var template = require('../templates/includes/modelViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-model]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.status = attrs.status;
    var self = this;
    var directory = attrs.directory
    var modelFile = directory.split('/').pop();
    var name = modelFile.split('.')[0];
    var isSpatial = modelFile.split('.').pop().startsWith('s');
    this.model = new Model({
      name: name,
      directory: directory,
      is_spatial: isSpatial
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews();
      }
    });
  },
  renderSubviews: function () {
    var speciesViewer = new SpeciesViewer({
      collection: this.model.species,
    });
    var parametersViewer = new ParametersViewer({
      collection: this.model.parameters,
    });
    var reactionsViewer = new ReactionsViewer({
      collection: this.model.reactions,
    });
    var rulesViewer = new RulesViewer({
      collection: this.model.rules,
    });
    this.renderSimulationSettingsView();
    this.registerRenderSubview(speciesViewer, "species-viewer-container");
    this.registerRenderSubview(parametersViewer, "parameters-viewer-container");
    this.registerRenderSubview(reactionsViewer, "reactions-viewer-container");
    this.registerRenderSubview(rulesViewer, "rules-viewer-container");
    if(this.status === 'complete'){
      this.enableCollapseButton();
    }
  },
  renderSimulationSettingsView: function () {
    if(this.simulationSettingsView){
      this.simulationSettingsView.remove();
    }
    this.simulationSettingsView = new SimulationSettingsViewer({
      model: this.model.simulationSettings,
    });
    this.registerRenderSubview(this.simulationSettingsView, "simulation-settings-viewer-container");
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-model')).text();
    text === '+' ? $(this.queryByHook('collapse-model')).text('-') : $(this.queryByHook('collapse-model')).text('+');
  },
  enableCollapseButton: function () {
    $(this.queryByHook('collapse-model')).prop('disabled', false);
  },
});