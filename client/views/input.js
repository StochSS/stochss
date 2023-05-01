/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
let $ = require('jquery');
let AmpersandInputView = require('ampersand-input-view');

module.exports = AmpersandInputView.extend({
  props: {
    name: 'string',
    label: 'string',
    modelKey: 'string',
    valueType: 'string',
    disabled: 'boolean',
    changeTests: 'object'
  },
  events: {
    'change input' : 'runChangeTests',
    'input input' : 'changeInputHandler'
  },
  initialize: function (attrs, options) {
    AmpersandInputView.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    let disabled = this.disabled ? "disabled" : "";
    if(this.label) {
      this.template = [
        '<label>',
            '<span data-hook="label"></span>',
            `<input class="form-input labeled" ${disabled}>`,
            '<div data-hook="message-container" class="message message-below message-error text-danger">',
                '<p data-hook="message-text"></p>',
            '</div>',
        '</label>'
      ].join('')
    }else{
      this.template = [
        '<label>',
            `<input class="form-input" ${disabled}>`,
            '<div data-hook="message-container" class="message message-below message-error text-danger">',
                '<p data-hook="message-text"></p>',
            '</div>',
        '</label>'
      ].join('')
    }
    AmpersandInputView.prototype.render.apply(this, arguments);
    this.shouldValidate = this.required || this.tests.length > 0
  },
  changeInputHandler: function (e) {
    if(this.modelKey){
      if(this.valueType !== 'number' || (this.valueType === 'number' && e.target.value.trim() === "")) {
        var value = e.target.value.trim();
      }else{
        var value = Number(e.target.value.trim())
      }
      this.parent.model[this.modelKey] = value;
      this.parent.updateValid()
    }
  },
  runChangeTests: function (e) {
    if(this.changeTests === undefined) { return }
    let text = e.target.value;
    let messages = [];
    this.changeTests.forEach((test) => {
      let message = test(text);
      if(message) {
        messages.push(message);
      }
    });
    if(messages.length > 0){
      let html = messages.join("<br>");
      $(this.queryByHook("message-text")).html(html);
      $(this.queryByHook("message-container")).css("display", "block");
    }else{
      $(this.queryByHook("message-container")).css("display", "none");
    }
  }
});