var app = require('ampersand-app');
var $ = require('jquery');
var _ = require('underscore');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var AmpersandInputView = require('ampersand-input-view');
var InputView = require('./input');
var SubdomainsView = require('./subdomains');

var template = require('../templates/includes/editSpacialSpecie.pug');

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
    'change [data-hook=input-diffusion-coeff-container]' : 'setDiffusionCoeff'
  },
  initialize: function () {
    this.baseModel = this.model.collection.parent;
    app.on('mesh-update', this.renderSubdomains, this);
  },
  render: function () {
    this.renderWithTemplate();
    this.renderSubdomains();
  },
  update: function () {
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
      hook: 'input-diffusion-coeff-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'val',
          label: '',
          tests: tests.valueTests,
          modelKey: '',
          valueType: 'number',
          value: this.model.spatialSpecies.diffusionCoeff
        });
      }
    }
  },
  setDiffusionCoeff: function (e) {
    this.model.spatialSpecies.diffusionCoeff = parseFloat(e.target.value);
  },
  renderSubdomains: function () {
    if(this.subdomainsView){
      this.subdomainsView.remove();
    }
    var subdomains = this.baseModel.meshSettings.uniqueSubdomains;
    this.subdomainsView = this.renderCollection(
      subdomains,
      SubdomainsView,
      this.queryByHook('subdomains')
    );
  },
  updateSubdomains: function (element) {
    if(element.name == 'subdomain'){
      var subdomain = element.value.model;
      var checked = element.value.checked;

      if(checked){
        this.model.spatialSpecies.subdomains = _.union(this.model.spatialSpecies.subdomains, [subdomain.name]);
      }else{
        this.model.spatialSpecies.subdomains = _.difference(this.model.spatialSpecies.subdomains, [subdomain.name]);
      }
    }
  }
});