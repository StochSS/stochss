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
    if(this.label) {
      this.template = [
        '<label>',
            '<span data-hook="label"></span>',
            '<input class="form-input labeled">',
            '<div data-hook="message-container" class="message message-below message-error text-danger">',
                '<p data-hook="message-text"></p>',
            '</div>',
        '</label>'
      ].join('')
    }else{
      this.template = [
        '<label>',
            '<input class="form-input">',
            '<div data-hook="message-container" class="message message-below message-error text-danger">',
                '<p data-hook="message-text"></p>',
            '</div>',
        '</label>'
      ].join('')
    }
    AmpersandInputView.prototype.render.apply(this, arguments);
  },
  changeInputHandler: function (e) {
    if(this.modelKey){
      var value = this.valueType === 'number' ? Number(e.target.value.trim()) : e.target.value.trim();
      this.parent.model[this.modelKey] = value;
    }
  },
});