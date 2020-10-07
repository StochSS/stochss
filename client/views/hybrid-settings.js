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

var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
var SelectView = require('ampersand-select-view');
//templates
var template = require('../templates/includes/hybridSettings.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.seed': {
      type: 'value',
      hook: 'seed-container'
    },
    'model.tauTol': {
      type: 'value',
      hook: 'tau-tolerance-container'
    },
    'model.switchTol': {
      type: 'value',
      hook: 'switching-tolerance-container'
    },
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this);
  },
  update: function () {
  },
  updateValid: function () {
  },
  subviews: {
    inputSeed: {
      hook: 'seed-container',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'seed',
          label: 'Seed the random number generator (set to -1 for a random seed): ',
          tests: '',
          modelKey: 'seed',
          valueType: 'number',
          value: this.model.seed
        });
      },
    },
    inputTauTolerance: {
      hook: 'tau-tolerance-container',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'Tau-Tolerance',
          label: 'Set the tau-tolerance (valid value must be between 0.0 and 1.0): ',
          tests: tests.valueTests,
          modelKey: 'tauTol',
          valueType: 'number',
          value: this.model.tauTol
        });
      },
    },
    inputSwitchingTolerance: {
      hook: 'switching-tolerance-container',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'Switching Tolerance',
          label: 'Set the switching tolerance (valid values must be between 0.0 and 1.0): ',
          tests: tests.valueTests,
          modelKey: 'switchTol',
          valueType: 'number',
          value: this.model.switchTol
        });
      },
    },
  },
});