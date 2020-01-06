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
    'change [data-hook=specie-mode]' : 'setSpeciesMode',
  },
  initialize: function () {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    var optionDict = {"continuous":"Concentration", "discrete":"Population", "dynamic":"Hybrid Concentration/Population"}
    var modeSelectView = new SelectView({
      label: '',
      name: 'mode',
      required: true,
      idAttributes: 'cid',
      options: ['Concentration','Population','Hybrid Concentration/Population'],
      value: optionDict[this.model.mode],
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
  setSpeciesMode: function (e) {
    var value = e.target.selectedOptions.item(0).text
    var modeDict = {"Concentration":"continuous","Population":"discrete","Hybrid Concentration/Population":"dynamic"}
    this.model.mode = modeDict[value]
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