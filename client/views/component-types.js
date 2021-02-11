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

let $ = require("jquery");
//views
var View = require('ampersand-view');
//templates
var specTypeTemplate = require('../templates/includes/speciesTypeTemplate.pug');
var reacTypeTemplate = require('../templates/includes/reactionTypeTemplate.pug');

module.exports = View.extend({
  events: {
    'change [data-hook=species-types]' : 'updateTypes'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    this.template = this.parent.modelType === "species" ? specTypeTemplate : reacTypeTemplate;
    View.prototype.render.apply(this, arguments);
    $(this.queryByHook("species-types")).prop("checked", this.parent.model.types.includes(this.model.typeID))
  },
  updateTypes: function (e) {
    let typeID = Number(e.target.dataset.target);
    if(e.target.checked) {
      this.parent.model.types.push(typeID);
    }else{
      let index = this.parent.model.types.indexOf(typeID);
      this.parent.model.types.splice(index, 1);
    }
  }
});