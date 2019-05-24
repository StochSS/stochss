var app = require('ampersand-app');
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
  }
});
