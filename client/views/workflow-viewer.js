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
//collection
var Collection = require('ampersand-collection');
//models
var Plot = require('../models/plots');
//views
var View = require('ampersand-view');
var PlotsView = require('./plots-view');
//templates
var template = require('../templates/includes/workflowViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-workflow]' : 'renderPlots'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
  },
  renderPlots: function (e) {
    this.changeCollapseButtonText(e)
    if(this.plotsView) {
      return
    }
    var outputs = new Collection(this.model.outputs, {model: Plot})
    this.plotsView = this.renderCollection(outputs, PlotsView, this.queryByHook("workflow-plots"))
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