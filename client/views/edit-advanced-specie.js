var tests = require('./tests');
var $ = require('jquery');
//views
var View = require('ampersand-view');
var SelectView = require('ampersand-select-view');
var InputView = require('./input');
//templates
var template = require('../templates/includes/editAdvancedSpecie.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=switching-tol]' : 'setSwitchingType',
    'change [data-hook=switching-min]' : 'setSwitchingType',
  },
  initialize: function () {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var modeSelectView = new SelectView({
      label: '',
      name: 'mode',
      required: true,
      idAttributes: 'cid',
      options: ['consentration','population','dynamic'],
      value: this.model.mode,
    });
    this.registerRenderSubview(modeSelectView, "specie-mode")
    if(this.model.isSwitchTol){
      $(this.queryByHook('switching-tol')).prop('checked', true);
    }else{
      $(this.queryByHook('switching-min')).prop('checked', true);
    }
  },
  update: function () {
  },
  updateValid: function () {
  },
  registerRenderSubview: function (view, hook) {
    this.registerSubview(view);
    this.renderSubview(view, this.queryByHook(hook));
  },
  setSwitchingType: function (e) {
    this.model.isSwitchTol = $(this.queryByHook('switching-tol')).is(":checked")
  },
  subviews: {
    inputName: {
      hook: 'switching-value',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'switching-value',
          label: '',
          tests: tests.valueTests,
          modelKey: 'switchingVal',
          valueType: 'number',
          value: this.model.switchingVal,
        });
      },
    },
  },
});