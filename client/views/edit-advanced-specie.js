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
      options: ['continuous','discrete','dynamic'],
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
          valueType: 'string',
          value: this.model.switchingVal,
        });
      },
    },
  },
});