/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
    valid: 'boolean'
  },
  initialize: function (attrs, options){
    Model.prototype.initialize.apply(this, arguments);
  },
  validateModel: function () {
    if(this.species.length <= 0) return false;
    if(this.reactions.length <= 0 && this.eventsCollection.length <= 0 && this.rules.length <= 0) return false
    if(this.modelSettings.validate() === false) return false;
    return true;
  },
  updateValid: function () {
    this.valid = this.validateModel()
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
