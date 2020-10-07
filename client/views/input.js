/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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
    this.shouldValidate = this.required || this.tests.length > 0
  },
  changeInputHandler: function (e) {
    if(this.modelKey){
      var value = this.valueType === 'number' ? Number(e.target.value.trim()) : e.target.value.trim();
      this.parent.model[this.modelKey] = value;
    }
  },
});