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

let State = require('ampersand-state');

module.exports = State.extend({
  session: {
    ctime: 'string',
    file: 'string',
    link: 'string',
    name: 'string',
    size: 'number',
    tag: 'string'
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
    this.formatSize();
  },
  formatSize: function () {
    let tags = ["B", "KB", "MB", "GB", "TB"];
    var size = this.size;
    var tag_index = 0;
    while(size >= 1e3) {
      size = size / 1e3;
      tag_index += 1;
    }
    this.size = Number(Number.parseFloat(size).toFixed(2));
    this.tag = tags[tag_index]
  }
});