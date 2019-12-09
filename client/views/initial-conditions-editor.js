var $ = require('jquery');
//views
var View = require('ampersand-view');
// var EditInitialCondition = require('./edit-initial-condition');
//templates
var template = require('../templates/includes/initialConditionsEditor.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=scatter]' : 'addInitialCondition',
    'click [data-hook=place]' : 'addInitialCondition',
    'click [data-hook=distribute-uniformly]' : 'addInitialCondition',
    'click [data-hook=collapse]' : 'cangeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    // this.renderCollection(
    //   this.collection,
    //   EditInitialCondition,
    //   this.queryByHook('initial-condition-collection')
    // );
  },
  update: function () {
  },
  updateValid: function () {
  },
  addInitialCondition: function (e) {
    var initialConditionType = e.target.textContent;
    this.collection.addInitialCondition(initialConditionType);
  },
  changeCollapseButtonText: function () {
    var text = $(this.queryByHook('collapse')).text();
    text === '+' ? $(this.queryByHook('collapse')).text('-') : $(this.queryByHook('collapse')).text('+');
  },
});