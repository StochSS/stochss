var $ = require('jquery');
var tests = require('./tests');
//views
var View = require('ampersand-view');
var InputView = require('./input');
//templates
var template = require('../templates/includes/simulationSettings.pug');

module.exports = View.extend({
  template: template,
  bindings: {
  },
  events: {
    'click [data-hook=collapse]' :  'changeCollapseButtonText',
    'change [data-hook=select-ode]' : 'setSimulationAlgorith',
    'change [data-hook=select-ssa]' : 'setSimulationAlgorith',
    'change [data-hook=select-tau-leaping]' : 'setSimulationAlgorith',
    'change [data-hook=select-hybrid-tau]' : 'setSimulationAlgorith',
    'change [data-hook=select-automatic]' : 'setSimulationAlgorith',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.model = attrs.model;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    this.model.is_stochastic ?
      $(this.queryByHook('select-stochastic')).prop('checked', true) : 
      $(this.queryByHook('select-deterministic')).prop('checked', true);
  },
  update: function (e) {
  },
  updateValid: function () {
  },
  changeCollapseButtonText: function (e) {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+')
  },
  setSimulationAlgorithm: function (e) {
    var value = e.target.dataset.name;
    console.log(value)

    var defaultMode = this.model.parent.defaultMode;
    console.log(defaultMode)

    var numEvents = this.model.parent.eventsCollection.length
    var numRules = this.model.parent.rules.length
    console.log(numEvents, numRules)

    var sTol = this.model.switchTol
    var tTol = this.model.tauTol
    var aTol = this.model.absoluteTol
    var rTol = this.model.relativeTol
    console.log(tTol, sTol, rTol, aTol)

    if(value !== 'Automatic'){
      this.model.algorithm = value;
    }else if(numEvents || numRules || defaultMode !== 'discrete' || sTol !== 0.03 || rTol !== 0.03 || aTol !== 0.03){
      this.model.algorithm = "Hybrid-Tau-Leaping";
    }else if(tTol !== 0.03){
      this.model.algorithm = "Tau-Leaping";
    }else{
      this.model.algorithm = "SSA"
    }
    console.log(this.model.algorithm)
  },
  subviews: {
    inputRelativeTolerance: {
      hook: 'relative-tolerance',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'relative-tolerance',
          label: 'Valeus must be greater than 0.0: ',
          tests: tests.valueTests,
          modelKey: 'relativeTol',
          valueType: 'number',
          value: this.model.relativeTol
        });
      },
    },
    inputAbsoluteTolerance: {
      hook: 'absolute-tolerance',
      prepareView: function (el) {
        return new InputView({
          parent: this,
          required: true,
          name: 'absolute-tolerance',
          label: 'Values must be greater than 0.0: ',
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
          label: '',
          tests: tests.valueTests,
          modelKey: 'realizations',
          valueType: 'number',
          value: this.model.parent.isPreview ? 1 : this.model.realizations
        });
      },
    },
    inputSeed: {
      hook: 'seed',
      prepareView: function () {
        return new InputView({
          parent: this,
          required: true,
          name: 'seed',
          label: 'Set to -1 for a random seed: ',
          tests: '',
          modelKey: 'seed',
          valueType: 'number',
          value: this.model.seed
        });
      },
    },
    inputTauTolerance: {
      hook: 'tau-tolerance',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'Tau-Tolerance',
          label: 'Value must be between 0.0 and 1.0: ',
          tests: tests.valueTests,
          modelKey: 'tauTol',
          valueType: 'number',
          value: this.model.tauTol
        });
      },
    },
    inputSwitchingTolerance: {
      hook: 'switching-tolerance',
      prepareView: function () {
        return new InputView ({
          parent: this,
          required: true,
          name: 'Switching Tolerance',
          label: 'Values must be between 0.0 and 1.0: ',
          tests: tests.valueTests,
          modelKey: 'switchTol',
          valueType: 'number',
          value: this.model.switchTol
        });
      },
    },
  },
});