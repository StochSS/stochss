/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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
let app = require('../app');
let tests = require('./tests');
let Tooltips = require('../tooltips');
//views
let View = require('ampersand-view');
let InputView = require('./input');
//templates
let template = require('../templates/includes/simulationSettings.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=select-ode]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-ssa]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-tau-leaping]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-hybrid-tau]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-automatic]' : 'handleSelectSimulationAlgorithmClick',
    'click [data-hook=collapse]' :  'changeCollapseButtonText'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.tooltips = Tooltips.simulationSettings;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(!this.model.isAutomatic){
      $(this.queryByHook('select-ode')).prop('checked', Boolean(this.model.algorithm === "ODE"));
      $(this.queryByHook('select-ssa')).prop('checked', Boolean(this.model.algorithm === "SSA")); 
      $(this.queryByHook('select-tau-leaping')).prop('checked', Boolean(this.model.algorithm === "Tau-Leaping"));
      $(this.queryByHook('select-hybrid-tau')).prop('checked', Boolean(this.model.algorithm === "Hybrid-Tau-Leaping"));
    }else{
      $(this.queryByHook('settings-container')).collapse('hide');
      $(this.queryByHook('select-automatic')).prop('checked', this.model.isAutomatic);
    }
    this.disableInputFieldByAlgorithm();
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $('[data-toggle="tooltip"]').click(function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
      });
    });
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  disableInputFieldByAlgorithm: function () {
    let isAutomatic = this.model.isAutomatic
    let isODE = this.model.algorithm === "ODE";
    let isSSA = this.model.algorithm === "SSA";
    let isLeaping = this.model.algorithm === "Tau-Leaping";
    let isHybrid = this.model.algorithm === "Hybrid-Tau-Leaping";
    $(this.queryByHook("relative-tolerance")).find('input').prop('disabled', !(isODE || isHybrid || isAutomatic));
    $(this.queryByHook("absolute-tolerance")).find('input').prop('disabled', !(isODE || isHybrid || isAutomatic));
    $(this.queryByHook("trajectories")).find('input').prop('disabled', !(isSSA || isLeaping || isHybrid || isAutomatic));
    $(this.queryByHook("seed")).find('input').prop('disabled', !(isSSA || isLeaping || isHybrid || isAutomatic));
    $(this.queryByHook("tau-tolerance")).find('input').prop('disabled', !(isHybrid || isLeaping || isAutomatic));
  },
  handleSelectSimulationAlgorithmClick: function (e) {
    let value = e.target.dataset.name;
    if(value === "Automatic"){
      this.model.isAutomatic = true;
      $(this.queryByHook('settings-container')).collapse('hide');
    }else{
      this.model.isAutomatic = false;
      this.model.algorithm = value;
      $(this.queryByHook('settings-container')).collapse('show');
      if(value === "ODE"){
        $(this.queryByHook("trajectories")).find("input").val("1");
      }else{
        $(this.queryByHook("trajectories")).find("input").val(this.model.realizations);
      }
      this.disableInputFieldByAlgorithm();
    }
  },
  update: function (e) {},
  updateValid: function () {},
  subviews: {
    inputRelativeTolerance: {
      hook: 'relative-tolerance',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'relative-tolerance',
          tests: tests.valueTests,
          modelKey: 'relativeTol',
          valueType: 'number',
          value: this.model.relativeTol
        });
      }
    },
    inputAbsoluteTolerance: {
      hook: 'absolute-tolerance',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'absolute-tolerance',
          tests: tests.valueTests,
          modelKey: 'absoluteTol',
          valueType: 'number',
          value: this.model.absoluteTol
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
          value: this.model.algorithm === "ODE" ? 1 : this.model.realizations
        });
      }
    },
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
    inputTauTolerance: {
      hook: 'tau-tolerance',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'Tau-Tolerance',
          label: '',
          tests: tests.valueTests,
          modelKey: 'tauTol',
          valueType: 'number',
          value: this.model.tauTol
        });
      }
    }
  }
});