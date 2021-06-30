/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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

module.exports = {
  nameTests: [
    function (text) {
      if (/^[0-9]+/.test(text)) {
        return "Field cannot start with a number. Start with letter or underscore." 
      }
    },
    function (text) {
      if (!/^[a-zA-Z0-9_]+$/.test(text)) {
        return "Invalid characters. Please only use letters, numbers, or underscores."
      }
    },
    // function (text) {
    //   if(this.parent.model && this.parent.model.collection){
    //     var isDuplicate = this.parent.model.collection.some(function (m) { return m.name === text && this.parent.model !== m;
    //     }, this);
    //     if (isDuplicate) {
    //       return "No duplicate entries."
    //     }
    //   }
    // },
  ],
  valueTests: [
    function (value) {
      if (isNaN(Number(value))) {
        return "Must be a number."
      }
    },
    function (value) {
      if (Number(value) < 0) {
        return "Must be non-negative."
      }
    },
  ],
}