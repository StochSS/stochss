var app = require('ampersand-app');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var SimTypeSettingsView = require('./sim-type-settings');
var InputView = require('./input');

var template = require('../templates/includes/runModel.pug');

module.exports = View.extend({
	template: template,
	render: function () {
	  this.renderWithTemplate();
	},
	subviews: {
	  simTypeSettings: {
	  	hook: 'sim-type-settings-container',
	  	prepareView: function (el) { 
          return new SimTypeSettingsView();
	  	},
	  },
	  inputSimEnd: {
	  	hook: 'end-sim-container',
	  	prepareView: function (el) {
	  	  return new InputView({
	  	  	parent: this,
	  	  	required: true,
	  	  	name: 'end-sim',
	  	  	label: '0 to ',
	  	  	tests: tests.valueTests,
	  	  	modelKey: 'end-sim',
	  	  	valueType: 'number',
	  	  	value: '100'
	  	  });
	  	},
	  },
	  inputTimeUnit: {
	  	hook: 'time-units-container',
	  	prepareView: function (el) {
	  	  return new InputView ({
	  	  	parent: this,
	  	  	required: true,
	  	  	name: 'time-units',
	  	  	label: 'store state every ',
	  	  	tests: tests.valueTests,
	  	  	modelKey: 'time-units',
	  	  	valueTypes: 'number',
	  	  	value: '1.0'
	  	  });
	  	}
	  }
	}
});