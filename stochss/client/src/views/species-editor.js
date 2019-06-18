var app = require('ampersand-app');
// Views
var View = require('ampersand-view');
var EditSpecieView = require('./edit-specie');

var template = require('../templates/includes/speciesEditor.pug');

module.exports = View.extend({
  template: template,
  bindings: {
  },
  events: {
    'click [data-hook=add-species]' : 'addSpecies',
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, EditSpecieView, this.queryByHook('specie-list'));
  },
  addSpecies: function () {
    var defaultName = 'S' + (this.collection.length + 1);
    this.collection.add({
      name: defaultName,
      value: 0
    });
  }
});
