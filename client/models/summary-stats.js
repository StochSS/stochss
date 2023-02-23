/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
let _ = require('underscore');
//models
let SummaryStat = require('./summary-stat');
//collections
let Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: SummaryStat,
  addSummaryStat: function ({name=null}={}) {
    if(name === null) {
      name = this.getDefaultName();
    }
    let summaryStat = new SummaryStat({
      formula: '',
      name: name
    });
    summaryStat.setArgs("");
    this.add(summaryStat);
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'obs' + i;
    var names = this.map((summaryStat) => { return summaryStat.name; });
    while(_.contains(names, name)) {
      i += 1;
      name = 'obs' + i;
    }
    return name;
  },
  removeSummaryStat: function (summaryStat) {
    this.remove(summaryStat);
  }
});
