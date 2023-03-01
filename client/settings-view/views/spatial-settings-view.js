/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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

let $ = require('jquery');
//support files
let app = require('../../app');
let tests = require('../../views/tests');
let Tooltips = require('../../tooltips');
//views
let InputView = require('../../views/input');
let View = require('ampersand-view');
//templates
let template = require('../templates/spatialSettingsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=trajectories]' : 'updateViewTraj',
    'change [data-hook=seed]' : 'updateViewSeed',
    'click [data-hook=collapse-settings-view]' :  'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.simulationSettings;
    this.algorithm = this.model.isAutomatic ? "The algorithm was chosen based on your model." : this.model.algorithm;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook(this.model.elementID + '-sim-settings-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook(this.model.elementID + '-sim-settings-view-tab')).tab('show');
      $(this.queryByHook(this.model.elementID + '-edit-sim-settings')).removeClass('active');
      $(this.queryByHook(this.model.elementID + '-view-sim-settings')).addClass('active');
    }else {
      app.tooltipSetup();
    }
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  update: function (e) {},
  updateValid: function (e) {},
  updateViewSeed: function (e) {
    $(this.queryByHook("view-seed")).html(this.model.seed);
  },
  updateViewTraj: function (e) {
    $(this.queryByHook("view-realizations")).html(this.model.realizations);
  },
  subviews: {
    inputSeed: {
      hook: 'seed',
      prepareView: function () {
        return new InputView({
          parent: this,
          required: true,
          name: 'seed',
          modelKey: 'seed',
          valueType: 'number',
          value: this.model.seed
        });
      }
    },
    inputRealizations: {
      hook: 'trajectories',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'realizations',
          tests: tests.valueTests,
          modelKey: 'realizations',
          valueType: 'number',
          value: this.model.realizations
        });
      }
    }
  }
});