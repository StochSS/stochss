var app = require('../app');
var path = require('path');
var xhr = require('xhr');
//models
var Model = require('ampersand-model');
var ModelSettings = require('./model-settings');
var MeshSettings = require('./mesh-settings');
//collections
var Species = require('./species');
var InitialConditions = require('./initial-conditions');
var Parameters = require('./parameters');
var Reactions = require('./reactions');
var Rules = require('./rules');
var Events = require('./events');
var FunctionDefinitions = require('./function-definitions');

module.exports = Model.extend({
  url: function () {
    return path.join(app.getApiPath(), "file/json-data")+"?for="+this.for+"&path="+this.directory;
  },
  props: {
    is_spatial: 'boolean',
    defaultID: 'number',
    defaultMode: 'string',
    annotation: 'string'
  },
  collections: {
    species: Species,
    initialConditions: InitialConditions,
    parameters: Parameters,
    reactions: Reactions,
    rules: Rules,
    eventsCollection: Events,
    functionDefinitions: FunctionDefinitions
  },
  children: {
    modelSettings: ModelSettings,
    meshSettings: MeshSettings
  },
  session: {
    name: 'string',
    selectedReaction: 'object',
    directory: 'string',
    isPreview: 'boolean',
    for: 'string',
  },
  initialize: function (attrs, options){
    Model.prototype.initialize.apply(this, arguments);
  },
  getDefaultID: function () {
    var id = this.defaultID;
    this.defaultID += 1;
    return id;
  },
  autoSave: function () {
    //TODO: implement auto save
  },
  //called when save button is clicked
  saveModel: function () {
    var self = this;
    this.species.map(function (specie) {
      self.species.trigger('update-species', specie.compID, specie, false, false);
    });
    this.parameters.map(function (parameter) {
      self.parameters.trigger('update-parameters', parameter.compID, parameter);
    });
    this.save();
  },
});
