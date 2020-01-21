//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/viewSpecies.pug');

module.exports = View.extend({
  template: template,
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.switchingValWithLabel = this.model.isSwitchTol ? 
      "Switching Tolerance: " + this.model.switchingVal :
      "Minimum Value For Switching: " + this.model.switchingVal
  },
});