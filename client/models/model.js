var app = require('../app');
var path = require('path');
var xhr = require('xhr');
//models
var Model = require('ampersand-model');
var SimulationSettings = require('./simulation-settings');
var MeshSettings = require('./mesh-settings');
//collections
var Species = require('./species');
var InitialConditions = require('./initial-conditions');
var Parameters = require('./parameters');
var Reactions = require('./reactions');
var RateRules = require('./rate-rules');
var Events = require('./events');

module.exports = Model.extend({
  url: function () {
    return path.join(
      String(app.config.routePrefix),
      String(app.config.apiUrl),
      "json-data",
      String(this.directory)
    );
  },
  props: {
    is_spatial: 'boolean'
  },
  collections: {
    species: Species,
    initialConditions: InitialConditions,
    parameters: Parameters,
    reactions: Reactions,
    rateRules: RateRules,
    events: Events,
  },
  children: {
    simulationSettings: SimulationSettings,
    meshSettings: MeshSettings
  },
  session: {
    name: 'string',
    selectedReaction: 'object',
    directory: 'string',
    isPreview: 'boolean',
  },
  initialize: function (attrs, options){
    Model.prototype.initialize.apply(this, arguments);
  },
  autoSave: function () {
    //TODO: implement auto save
  },
  //called when save button is clicked
  saveModel: function () {
    this.save();
    // xhr({ 
    //   method: 'post',
    //   body: this.toJSON(),
    //   uri: this.url() },
    //   function (err, response, body) {
    //   },
    // );
  },
  // toJSON: function () {
  // },
});
