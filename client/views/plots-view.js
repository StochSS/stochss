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
var path = require('path');
var xhr = require('xhr');
//support files
var Plotly = require('../lib/plotly');
var app = require('../app');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/plotsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-plot]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
    this.path = attrs.path ? attrs.path : this.parent.model.path
    this.heading = attrs.heading ? attrs.heading + " - " + this.model.key : this.model.key
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.getPlot()
  },
  getPlot: function () {
    var self = this;
    var plotArgs = {"title":this.model.title,"xaxis":this.model.xaxis,"yaxis":this.model.yaxis}
    var data = {"plt_key":this.model.key, "plt_data":plotArgs}
    var endpoint = path.join(app.getApiPath(), 'workflow/plot-results')+"?path="+this.path+"&data="+JSON.stringify(data);
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode >= 400) {
        $(self.queryByHook(self.model.key+self.model.stamp)).html(body.Message)
      }else{
        self.plotFigure(body)
      }
    });
  },
  plotFigure: function (figure) {
    var self = this;
    var el = this.queryByHook(this.model.key+this.model.stamp);
    Plotly.newPlot(el, figure);
  },
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
  }
})