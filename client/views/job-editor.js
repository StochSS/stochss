var _ = require('underscore');
var $ = require('jquery');
var tests = require('../views/tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
<<<<<<< Updated upstream:client/views/job-editor.js
var SimSettingsView = require('../views/simulation-settings');
var JobStateButtonsView = require('../views/job-state-buttons');
=======
var SimSettingsView = require('./simulation-settings');
var ParamSweepSettingsView = require('./parameter-sweep-settings');
var WorkflowStateButtonsView = require('./workflow-state-buttons');
>>>>>>> Stashed changes:client/views/workflow-editor.js
//models
var Model = require('../models/model');
//templates
var template = require('../templates/includes/jobEditor.pug');

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    var self = this;
    var directory = attrs.directory
    var modelFile = directory.split('/').pop();
    var name = modelFile.split('.')[0];
    var isSpatial = modelFile.split('.').pop().startsWith('s');
    this.model = new Model({
      name: name,
      directory: directory,
      is_spatial: isSpatial,
      isPreview: false,
    });
    this.model.fetch({
      success: function (model, response, options) {
        self.renderSubviews();
      }
    });
  },
  update: function (e) {
  },
  updateValid: function (e) {
  },
  renderSubviews: function() {
    var inputName = new InputView({
      parent: this,
      required: true,
      name: 'name',
      label: 'Model Path: ',
      tests: tests.nameTests,
      modelKey: 'directory',
      valueType: 'string',
      value: this.model.directory,
    });
    var simSettings = new SimSettingsView({
      parent: this,
      model: this.model.simulationSettings,
      species: this.model.species
    });
<<<<<<< Updated upstream:client/views/job-editor.js
    var jobStateButtons = new JobStateButtonsView({
      model: this.model
    });
    this.registerRenderSubview(inputName, "model-name-container");
    this.registerRenderSubview(simSettings, 'sim-settings-container');
    this.registerRenderSubview(jobStateButtons, 'job-state-buttons-container');
    $(this.queryByHook("model-name-container")).find('input').width(1350)
    this.parent.trajectories = this.model.simulationSettings.stochasticSettings.realizations
=======
    this.settingsViews.parameterSweep = new ParamSweepSettingsView({
      parent: this,
      model: this.model.parameterSweepSettings,
    });
    var workflowStateButtons = new WorkflowStateButtonsView({
      model: this.model
    });
    this.registerRenderSubview(inputName, "model-name-container");
    this.registerRenderSubview(this.settingsViews['gillespy'], 'sim-settings-container');
    this.registerRenderSubview(this.settingsViews['parameterSweep'], 'param-sweep-settings-container');
    this.registerRenderSubview(workflowStateButtons, 'workflow-state-buttons-container');
    this.parent.trajectories = this.model.simulationSettings.realizations
>>>>>>> Stashed changes:client/views/workflow-editor.js
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  collapseContainer: function () {
    $(this.queryByHook("job-editor-container")).collapse();
  },
});