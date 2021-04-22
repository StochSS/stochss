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

//models
let Model = require('./model');
let Settings = require('./settings');
let State = require('ampersand-state');

module.exports = State.extend({
  children: {
    model: Model,
    settings: Settings
  },
  session: {
    directory: 'string',
    logs: 'string',
    startTime: 'string',
    status: 'string'
  },
  derived: {
    elementID: {
      deps: ["collection"],
      fn: function () {
        if(this.collection) {
          return this.collection.parent.elementID + "J" + (this.collection.indexOf(this) + 1);
        }
        return "J-";
      }
    },
    name: {
      deps: ["directory"],
      fn: function () {
        return this.directory.split("/").pop();
      }
    },
    fmtStartTime: {
      deps: ["startTime"],
      fn: function () {
        let date = new Date(this.startTime);
        let months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        var stamp = months[date.getMonth()] + " ";
        stamp += date.getDate() + ", ";
        stamp += date.getFullYear() + "  ";
        let hours = date.getHours();
        let ampm = hours >= 12 ? 'PM' : 'AM'; // get AM or PM based on hours
        hours = hours%12; // format hours to 12 hour time format
        hours = hours ? hours : 12; // replace 0 with 12
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes; // format minutes to always have two chars
        let timeZone = date.toString().split('(').pop().split(')').shift(); // get the timezone from the date
        if(timeZone.includes(" ")){
          tzparts = timeZone.split(" ");
          tzparts = tzparts.map(function (element) {
            return element.charAt(0);
          })
          timeZone = tzparts.join("");
        }
        // timeZone = timeZone.replace('(', '').replace(')', '') // remove the '()' from the timezone
        return  stamp + hours + ":" + minutes + " " + ampm + " " + timeZone;
      }
    }
  }
});