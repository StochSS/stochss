//views
var SelectView = require('ampersand-select-view');
//templates
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
    this.value = this.model.mode || 'dynamic';
  },
  render: function () {
    SelectView.prototype.render.apply(this, arguments);
  },
  selectChangeHandler: function (e) {
    var previousMode = this.model.mode
    var currentMode = e.target.selectedOptions.item(0).text;
    this.model.mode = currentMode;
    this.updateRateRules(previousMode, currentMode);
  },
  updateRateRules: function (previous, current) {
    if(current === 'continuous')
      this.parent.parent.rateRules.addRateRule(this.label.value);
    else if(previous === 'continuous')
      this.parent.parent.rateRules.removeRateRule(this.label.value);
  },
});