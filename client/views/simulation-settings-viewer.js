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

var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/simulationSettingsViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeSettingsCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.algorithm = this.model.algorithm === "Hybrid-Tau-Leaping" ?
      "Algorithm: Hybrid ODE/SSA" : "Algorithm: " + this.model.algorithm
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var algorithm = this.model.algorithm
    if(!this.model.isAutomatic && (algorithm === "ODE" || algorithm === "Hybrid-Tau-Leaping")){
      $(this.queryByHook('deterministic')).collapse('show')
    }
    if(!this.model.isAutomatic && (algorithm === "SSA" || algorithm === "Tau-Leaping" || algorithm === "Hybrid-Tau-Leaping")){
      $(this.queryByHook('stochastic')).collapse('show')
      if(algorithm === "SSA"){
        $(this.queryByHook('SSA')).collapse('show')
      }else{
        $(this.queryByHook('Tau')).collapse('show')
      }
    }
  },
  changeSettingsCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});