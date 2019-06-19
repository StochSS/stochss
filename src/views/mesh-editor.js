var app = require('ampersand-app');
var tests = require('./tests');
var $ = require('jquery');
//Views
var View = require('ampersand-view');
var InputView = require('./input');

var template = require('../templates/includes/meshEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=num-subdomains-container]' : 'updateSubdomains',
    'click [data-hook=collapse]' : 'changeCollapseButtonText'
  },
  update: function (e) {
  },
  subviews: {
    inputSubdomains: {
      hook: 'num-subdomains-container',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'numSubdomains',
          label: 'Number of Subdomains',
          test: tests.valueTests,
          modelKey: 'numSubdomains',
          valueType: 'number',
          value: this.model.numSubdomains
        });
      }
    }
  },
  updateSubdomains: function () {
    app.trigger('mesh-update');
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  }
});