var tests = require('./tests');
var _ = require('underscore');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SubdomainsView = require('./subdomain');
//templates
var template = require('../templatesV2/includes/editSpatialSpecie.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.inUse': {
      hook: 'remove',
      type: 'booleanAttribute',
      name: 'disabled',
    },
  },
  events: {
    'click [data-hook=remove]' : 'removeSpecie',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.baseModel = this.model.collection.parent;
    this.baseModel.on('mesh-update', this.renderSubdomains, this);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.renderSubdomains();
  },
  update: function () {
  },
  updateValid: function () {
  },
  removeSpecie: function () {
    this.remove();
    this.collection.removeSpecie(this.model);
  },
  renderSubdomains: function () {
    if(this.subdomainsView)
      this.subdomainsView.remove();
    var subdomains = this.baseModel.meshSettings.uniqueSubdomains;
    this.subdomainsView = this.renderCollection(
      subdomains,
      SubdomainsView,
      this.queryByHook('subdomains')
    );
  },
  updateSubdomains: function (element) {
    if(element.name == 'subdomain') {
      var subdomain = element.value.model;
      var checked = element.value.checked;
      if(checked)
        this.model.subdomains = _.union(this.model.subdomains, [subdomain.name]);
      else
        this.model.subdomains = _.difference(this.model.subdomains, [subdomain.name]);
    }
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
    inputValue: {
      hook: 'input-diffusion-coeff-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'diffusion coeff',
          label: '',
          tests: tests.valueTests,
          modelKey: 'diffusionCoeff',
          valueType: 'number',
          value: this.model.diffusionCoeff,
        });
      },
    },
  },
});