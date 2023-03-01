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
let template = require('../templates/wellMixedSettingsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'change [data-hook=select-ode]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-ssa]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-cle]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-tau-leaping]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-hybrid-tau]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=select-automatic]' : 'handleSelectSimulationAlgorithmClick',
    'change [data-hook=relative-tolerance]' : 'updateViewRTol',
    'change [data-hook=absolute-tolerance]' : 'updateViewATol',
    'change [data-hook=trajectories]' : 'updateViewTraj',
    'change [data-hook=seed]' : 'updateViewSeed',
    'change [data-hook=tau-tolerance]' : 'updateViewTauTol',
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
      app.tooltipSetup();
    }
    this.updateViewer();
  },
  changeCollapseButtonText: function (e) {
    app.changeCollapseButtonText(this, e);
  },
  disableInputFieldByAlgorithm: function () {
    let isAutomatic = this.model.isAutomatic;
    let isODE = this.model.algorithm === "ODE";
    let isSSA = this.model.algorithm === "SSA";
    let isCLE = this.model.algorithm === "CLE";
    let isLeaping = this.model.algorithm === "Tau-Leaping";
    let isHybrid = this.model.algorithm === "Hybrid-Tau-Leaping";
    $(this.queryByHook("relative-tolerance")).find('input').prop('disabled', !(isODE || isHybrid || isAutomatic));
    $(this.queryByHook("absolute-tolerance")).find('input').prop('disabled', !(isODE || isHybrid || isAutomatic));
    $(this.queryByHook("trajectories")).find('input').prop('disabled', !(isSSA || isCLE || isLeaping || isHybrid || isAutomatic));
    $(this.queryByHook("seed")).find('input').prop('disabled', !(isSSA || isCLE || isLeaping || isHybrid || isAutomatic));
    $(this.queryByHook("tau-tolerance")).find('input').prop('disabled', !(isHybrid || isCLE || isLeaping || isAutomatic));
  },
  handleSelectSimulationAlgorithmClick: function (e) {
    let value = e.target.dataset.name;
    if(value === "Automatic"){
      this.algorithm = "The algorithm was chosen based on your model.";
      this.model.isAutomatic = true;
      $(this.queryByHook('settings-container')).collapse('hide');
    }else{
      this.algorithm = value;
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
    this.updateViewer();
  },
  update: function (e) {},
  updateViewATol: function (e) {
    $(this.queryByHook("view-a-tol")).html(this.model.absoluteTol);
  },
  updateViewRTol: function (e) {
    $(this.queryByHook("view-r-tol")).html(this.model.relativeTol);
  },
  updateViewSeed: function (e) {
    $(this.queryByHook("view-seed")).html(this.model.seed);
  },
  updateViewTauTol: function (e) {
    $(this.queryByHook("view-tau-tol")).html(this.model.tauTol);
  },
  updateViewTraj: function (e) {
    $(this.queryByHook("view-realizations")).html(this.model.realizations);
  },
  updateValid: function (e) {},
  updateViewer: function () {
    $(this.queryByHook("view-algorithm")).html(this.algorithm);
    let hideDeterministic = this.model.isAutomatic || this.model.algorithm === "SSA" || this.model.algorithm === "CLE" || this.model.algorithm === "Tau-Leaping";
    let hideStochastic = this.model.isAutomatic || this.model.algorithm === "ODE" ;
    if(hideDeterministic) {
      $(this.queryByHook("view-deterministic-settings")).css("display", "none");
    }else{
      $(this.queryByHook("view-deterministic-settings")).css("display", "block");
    }
    if(hideStochastic) {
      $(this.queryByHook("view-stochastic-settings")).css("display", "none");
    }else {
      $(this.queryByHook("view-stochastic-settings")).css("display", "block");
      if(this.model.algorithm === "SSA") {
        $(this.queryByHook("view-tau-tolerance")).css("display", "none");
      }else{
        $(this.queryByHook("view-tau-tolerance")).css("display", "block");
      }
    }
  },
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