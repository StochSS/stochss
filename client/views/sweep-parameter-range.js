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

let $ = require('jquery');
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/includes/sweepParameterRange.pug');

module.exports = View.extend({
  template: template,
  events: function () {
    let events = {};
    events['change [data-hook=' + this.model.elementID + '-slider'] = 'setParameterRangeValue';
    events['input [data-hook=' + this.model.elementID + '-slider'] = 'viewParameterRangeValue';
    return events;
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    let self = this;
    this.parameter = this.parent.model.model.parameters.filter(function (param) {
      return param.compID === self.model.paramID
    })[0];
    this.parent.tsPlotData.parameters[this.model.name] = this.parameter.expression;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
  },
  setParameterRangeValue: function (e) {
    let value = this.model.range[e.target.value];
    this.parent.tsPlotData.parameters[this.model.name] = value;
    let data = this.parent.getPlot("ts-psweep");
    console.log(data)
  },
  viewParameterRangeValue: function (e) {
    let value = this.model.range[e.target.value];
    $(this.queryByHook(this.model.elementID + "-current-value")).html(value);
  }
});
