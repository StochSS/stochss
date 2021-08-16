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

let $ = require('jquery');
//views
let View = require('ampersand-view');
//templates
let template = require('../templates/sweepParameterRange.pug');

module.exports = View.extend({
  template: template,
  events: function () {
    let events = {};
    events['change [data-hook=' + this.model.elementID + '-slider'] = 'setParameterRangeValue';
    events['change [data-hook=' + this.model.elementID + '-fixed'] = 'setParameterRangeFixed';
    events['input [data-hook=' + this.model.elementID + '-slider'] = 'viewParameterRangeValue';
    return events;
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    let self = this;
    this.model.fixed = false;
    this.showFixed = Boolean(attrs.showFixed) ? attrs.showFixed : false;
    let value = this.model.range[0].toString().includes('.') ? this.model.range[0] : this.model.range[0].toFixed(1)
    this.parent.tsPlotData.parameters[this.model.name] = value;
    this.parent.fixedParameters[this.model.name] = value;
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    if(!this.showFixed){
      $(this.queryByHook(this.model.elementID + "-fixed-container")).css("display", "none");
    }else{
      $(this.queryByHook(this.model.elementID + '-slider')).prop("disabled", !this.model.fixed);
    }
  },
  setParameterRangeFixed: function (e) {
    this.model.fixed = e.target.checked;
    $(this.queryByHook(this.model.elementID + '-slider')).prop("disabled", !this.model.fixed);
    this.parent.getPlot("psweep");
  },
  setParameterRangeValue: function (e) {
    var value = this.model.range[e.target.value];
    if(!value.toString().includes(".")) {
      value = value.toFixed(1)
    }
    if(this.showFixed) {
      this.parent.fixedParameters[this.model.name] = value;
      this.parent.getPlot("psweep");
    }else{
      this.parent.tsPlotData.parameters[this.model.name] = value;
      this.parent.getPlot("ts-psweep");
    }
  },
  viewParameterRangeValue: function (e) {
    let value = this.model.range[e.target.value];
    $(this.queryByHook(this.model.elementID + "-current-value")).html(value);
  }
});
