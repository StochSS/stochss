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

//collections
let Collection = require('ampersand-collection');
//models
let Creator = require('./creator');

module.exports = Collection.extend({
  model: Creator,
  indexes: ["elementID"],
  addCreator: function (creatorInfo) {
  	let elementID = "C" + (this.length + 1);
  	let creator = new Creator({
  	  fname: creatorInfo.fname,
  	  lname: creatorInfo.lname,
  	  email: creatorInfo.email,
  	  organization: creatorInfo.organization,
  	  elementID: elementID
  	});
  	this.add(creator);
  	return creator;
  }
});
