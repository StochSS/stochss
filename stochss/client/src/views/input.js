var AmpersandInputView = require('ampersand-input-view');

module.exports = AmpersandInputView.extend({
  props: {
    name: 'string',
    label: 'string',
    modelKey: 'string',
    valueType: 'string'
  },
  events: {
    "change input" : "changeInputHandler"
  },
  changeInputHandler: function (e) {
    if (this.valid) {
      var value = this.valueType === 'number' ? Number(e.target.value) : e.target.value;
      this.parent.model[this.modelKey] = value;
    }
  }
});

