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
  renderPlots: function () {
    this.changeCollapseButtonText()
    if(this.plotsView) {
      return
    }
    var outputs = new Collection(this.model.outputs, {model: Plot})
    this.plotsView = this.renderCollection(outputs, PlotsView, this.queryByHook("workflow-plots"))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-workflow')).text();
    text === '+' ? $(this.queryByHook('collapse-workflow')).text('-') : $(this.queryByHook('collapse-workflow')).text('+');
  }
})