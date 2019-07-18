var AmpersandInputView = require('ampersand-input-view');

module.exports = AmpersandInputView.extend({
  props: {
    name: 'string',
    label: 'string',
    modelKey: 'string',
    valueType: 'string',
  },
  events: {
    'change input' : 'changeInputHandler',
  },
  initialize: function (attrs, options) {
    AmpersandInputView.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    AmpersandInputView.prototype.render.apply(this, arguments);
  },
  changeInputHandler: function (e) {
    if(this.valid){
      var value = this.valueType === 'number' ? Number(e.target.value) : e.target.value;
      this.parent.model[this.modelKey] = value;
    }
  },
});