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

var _ = require('underscore');
var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates
var specieSubdomainTemplate = require('../templates/includes/subdomain.pug');
var reactionSubdomainTemplate = require('../templates/includes/reactionSubdomain.pug');

module.exports = View.extend({
  template: specieSubdomainTemplate,
  events: {
    'change [data-hook=subdomains]' : 'updateSubdomain',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    if(!this.parent.isReaction)
      var checked = _.contains(this.parent.model.subdomains, this.model.name);
    else{
      this.template = reactionSubdomainTemplate;
      var checked = _.contains(this.parent.parent.model.subdomains, this.model.name);
    }
    View.prototype.render.apply(this, arguments);
    $(this.queryByHook('subdomain')).prop('checked', checked);
  },
  updateSubdomain: function (e) {
    this.parent.updateSubdomains({name: 'subdomain', value: {model: this.model, checked: e.target.checked}})
  },
});