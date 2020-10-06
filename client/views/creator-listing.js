//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/creatorList.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=remove-creator-btn]' : 'removeCreator'
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments);
  },
  removeCreator: function (e) {
    this.model.collection.remove(this.model)
  }
});