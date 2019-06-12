var View = require('ampersand-view');
var AmpersandInputView = require('ampersand-input-view');
var tests = require('./tests');
var InputView = require('./input');

var template = require('../templates/includes/editReactionVar.pug');

// Base view for species and parameters
module.exports = View.extend({
  template: template,
  bindings: {
    'model.inUse' : {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled'
    }
  },
  events: {
    'click [data-hook=remove]' : 'removeReactionVar',
  },
  update: function (e) {
  },
  removeReactionVar: function (e) {
    this.remove();
    this.model.collection.remove(this.model);
  },
  subviews: {
    inputName: {
      hook: 'input-name-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'name',
          label: '',
          tests: tests.nameTests,
          modelKey: 'name',
          valueType: 'string',
          value: this.model.name
        });
      },
    },
    inputValue: {
      hook: 'input-value-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'val',
          label: '',
          tests: tests.valueTests,
          modelKey: 'value',
          valueType: 'number',
          value: this.model.value
        });
      }
    }
  }
});