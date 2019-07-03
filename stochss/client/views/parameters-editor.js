var app = require('ampersand-app');
var $ = require('jquery');
// Views
var View = require('ampersand-view');
var EditParameterView = require('./edit-parameter');

var template = require('../templates/includes/parametersEditor.pug');

module.exports = View.extend({
  template: template,
  bindings: {
  },
  events: {
    'click [data-hook=add-parameter]' : 'addParameter',
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, EditParameterView, this.queryByHook('parameter-list'));
  },
  addParameter: function () {
    var defaultName = 'k' + this.collection.length;
    this.collection.add({
      name: defaultName,
      value: 0
    });
    this.render();
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  }
});
