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

var path = require('path');
//Support Files
var app = require('../app.js');
//Models
var Model = require('ampersand-model');

module.exports = Model.extend({
  url: function () {
    return path.join(app.getApiPath(), "project/load-project")+"?path="+this.directory;
  },
  session: {
    annotation: 'string',
    directory: 'string',
    dirname: 'string',
    name: 'string'
  },
  derived: {
  	elementID: {
  	  deps: [],
  	  fn: function () {
  	  	if(this.collection) {
  	  	  return "P" + (this.collection.indexOf(this) + 1);
	  	}
	  	return "P-";
  	  }
  	},
  	location: {
  	  deps: ["dirname"],
  	  fn: function () {
  	  	if(this.dirname) {
  	  	  return "Location: " + this.dirname;
  	  	}
  	  	return "";
  	  }
  	},
  	open: {
  	  deps: ["directory"],
  	  fn: function () {
  	  	return path.join(app.getBasePath(), "stochss/project/manager")+"?path="+this.directory
  	  }
  	}
  }
});