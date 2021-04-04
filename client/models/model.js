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
var Domain = require('./domain');
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
    annotation: 'string',
    volume: 'any'
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
    domain: Domain
  },
  session: {
    name: 'string',
    selectedReaction: 'object',
    directory: 'string',
    isPreview: 'boolean',
    for: 'string',
    valid: 'boolean',
    error: 'object'
  },
  derived: {
    elementID: {
      deps: ["collection"],
      fn: function () {
        if(this.collection) {
          return "M" + (this.collection.indexOf(this) + 1);
        }
        return "M-";
      }
    },
    open: {
      deps: ["directory"],
      fn: function () {
        let queryStr = "?path=" + this.directory;
        return path.join(app.getBasePath(), "stochss/models/edit") + queryStr;
      }
    }
  },
  initialize: function (attrs, options){
    Model.prototype.initialize.apply(this, arguments);
    this.species.on('add change remove', this.updateValid, this);
    this.parameters.on('add change remove', this.updateValid, this);
    this.reactions.on('add change remove', this.updateValid, this);
    this.eventsCollection.on('add change remove', this.updateValid, this);
    this.rules.on('add change remove', this.updateValid, this);
  },
  validateModel: function () {
    if(!this.species.validateCollection()) return false;
    if(!this.parameters.validateCollection()) return false;
    if(!this.reactions.validateCollection()) return false;
    if(!this.eventsCollection.validateCollection()) return false;
    if(!this.rules.validateCollection()) return false;
    if(this.reactions.length <= 0 && this.eventsCollection.length <= 0 && this.rules.length <= 0) {
      this.error = {"type":"process"}
      return false;
    }
    if(!this.volume === "" || isNaN(this.volume)) {
      this.error = {"type":"volume"}
      return false
    };
    if(this.domain.validateModel() === false) {
      this.error = {"type":"domain"}
      return false
    };
    if(this.modelSettings.validate() === false) {
      this.error = {"type":"timespan"}
      return false
    };
    return true;
  },
  updateValid: function () {
    this.error = {}
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
  saveModel: function (cb=null) {
    var self = this;
    this.species.map(function (specie) {
      self.species.trigger('update-species', specie.compID, specie, false, false);
    });
    this.parameters.map(function (parameter) {
      self.parameters.trigger('update-parameters', parameter.compID, parameter);
    });
    if(cb) {
      this.save({success: cb});
    }else{
      this.save()
    }
  },
});
