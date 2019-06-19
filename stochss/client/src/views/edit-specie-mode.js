var SelectView = require('ampersand-select-view');

var template = require('../templates/includes/editSpecieMode.pug');

module.exports = SelectView.extend({
  template: template(),
  bindings: {
    'model.name': {
      type: 'value',
      hook: 'label'
    },
  },
  events: {
    'change select' : 'selectChangeHandler'
  },
  initialize: function () {
    SelectView.prototype.initialize.apply(this, arguments);
    this.label = this.model.name;
    this.value = this.model.nonspatialSpecies.mode || 'dynamic';
  },
  selectChangeHandler: function (e) {
    var mode = e.target.selectedOptions.item(0).text;
    this.model.nonspatialSpecies.mode = mode;
  }
});