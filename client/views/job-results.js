var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates
var resultsEnsembleTemplate = require('../templates/includes/jobResultsEnsemble.pug');

module.exports = View.extend({
  template: resultsEnsembleTemplate,
  events: {
    'click [data-hook=collapse-stddevrange]' : function () {
      this.changeCollapseButtonText("collapse-stddevrange");
    },
    'click [data-hook=collapse-trajectories]' : function () {
      this.changeCollapseButtonText("collapse-trajectories");
    },
    'click [data-hook=collapse-stddev]' : function () {
      this.changeCollapseButtonText("collapse-stddev");
    },
    'click [data-hook=collapse-trajmean]' : function () {
      this.changeCollapseButtonText("collapse-trajmean");
    },
  },
  changeCollapseButtonText: function (source) {
    console.log(source);
    var text = $(this.queryByHook(source)).text();
    text === '+' ? $(this.queryByHook(source)).text('-') : $(this.queryByHook(source)).text('+');
  },
});