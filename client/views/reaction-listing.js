var tests = require('./tests');
var katex = require('katex');
//views
var View = require('ampersand-view');
var InputView = require('./input');
//templates
var template = require('../templates/includes/reactionListing.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.name' : {
      type: 'value',
      hook: 'input-name-container'
    },
    // 'model.annotation' : {
    //   type: function (el, value, previousValue) {
    //     katex.render(this.model.annotation, this.queryByHook('summary'), {
    //       displayMode: true,
    //       output: 'mathml'
    //     });
    //   },
    //   hook: 'summary',
    // },
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select'
    }
  },
  events: {
    'click [data-hook=select]'  : 'selectReaction',
    'click [data-hook=remove]'  : 'removeReaction'
  },
  update: function () {
  },
  updateValid: function () {
  },
  selectReaction: function (e) {
    this.model.collection.trigger("select", this.model);
  },
  removeReaction: function (e) {
    this.collection.removeReaction(this.model);
    this.parent.collection.trigger("change");
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
          value: this.model.name,
        });
      },
    },
  },
});