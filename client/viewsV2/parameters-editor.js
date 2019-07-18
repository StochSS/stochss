var $ = require('jquery');
//views
var View = require('ampersand-view');
var EditParameterView = require('./edit-parameter');
//templates
var template = require('../templatesV2/includes/parametersEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=add-parameter]' : 'addParameter',
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderCollection(
      this.collection,
      EditParameterView,
      this.queryByHook('parameter-list')
    );
  },
  update: function () {
  },
  updateValid: function () {
  },
  addParameter: function () {
    this.collection.addParameter();
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});