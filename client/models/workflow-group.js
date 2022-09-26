/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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

let path = require('path');
//Support Files
let app = require('../app.js');
//collections
let Workflows = require('./workflows');
//models
let Model = require('./model');
let Metadata = require('./metadata');
let State = require('ampersand-state');

module.exports = State.extend({
  children: {
    model: Model,
    metadata: Metadata
  },
  collections: {
    workflows: Workflows
  },
  session: {
    name: 'string'
  },
  derived: {
    elementID: {
      deps: ["collection"],
      fn: function () {
        let identifier = !this.model || Boolean(this.model.name) ? "WG" : "AW"
        if(this.collection) {
          return this.collection.parent.elementID + identifier + (this.collection.indexOf(this) + 1)
        }
        return identifier + "-"
      }
    },
    open: {
      deps: ["model"],
      fn: function () {
        if(this.model.directory){
          let queryStr = "?path=" + this.model.directory;
          return path.join(app.getBasePath(), "stochss/models/edit") + queryStr;
        }
        return null
      }
    },
    type: {
      deps: ["model"],
      fn: function () {
        if(this.model.is_spatial) {
          return "Spatial";
        }
        return "Well-Mixed";
      }
    }
  }
});