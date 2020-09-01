var $ = require('jquery');
//views
var View = require('ampersand-view');
var ModelViewer = require('./model-viewer');
//templates
var template = require('../templates/includes/modelsViewer.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-models]' : 'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(this.collection, ModelViewer, this.queryByHook('model-container'))
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse-models')).text();
    text === '+' ? $(this.queryByHook('collapse-models')).text('-') : $(this.queryByHook('collapse-models')).text('+');
  }
})