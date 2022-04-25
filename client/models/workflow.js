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
let Jobs = require('./jobs');
//models
let Job = require('./job');
let Model = require('ampersand-model');
let Settings = require('./settings');

module.exports = Model.extend({
  url: function () {
    return path.join(app.getApiPath(), "workflow/load-workflow") + "?path=" + this.directory;
  },
  props: {
    model: 'string'
  },
  children: {
    settings: Settings,
    activeJob: Job
  },
  collections: {
    jobs: Jobs
  },
  session: {
    annotation: 'string',
    directory: 'string',
    name: 'string',
    status: 'string',
    type: 'string',
    newFormat: 'boolean'
  },
  derived: {
    elementID: {
      deps: ["collection"],
      fn: function () {
        if(this.collection) {
          return this.collection.parent.elementID + "W" + (this.collection.indexOf(this) + 1)
        }
        return "W-"
      }
    },
    open: {
      deps: ["directory", "type"],
      fn: function () {
        if(this.type === "Notebook") {
          return path.join(app.getBasePath(), "notebooks", this.directory)
        }
        let queryStr = "?path=" + this.directory + "&type=none"
        return path.join(app.getBasePath(), "stochss/workflow/edit") + queryStr
      }
    }
  }
});
