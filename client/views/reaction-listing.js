var app = require('ampersand-app');
var View = require('ampersand-view');
var _ = require('underscore');

var template = require('../templates/includes/reactionListing.pug');

module.exports = View.extend({
  template: template,
  bindings: {
    'model.name' : {
      type: 'value',
      hook: 'name'
    },
    'model.summary' : {
      type: function (el, value, previousValue) {
        el.innerHTML = value;
      },
      hook: 'summary',
    },
    'model.selected' : {
      type: function (el, value, previousValue) {
        el.checked = value;
      },
      hook: 'select'
    }
  },
  events: {
    'click [data-hook=select]'  : 'selectReaction',
    'click [data-hook=remove]'  : 'removeReaction'
  },
  selectReaction: function (e) {
    this.model.collection.trigger("select", this.model);
  },
  removeReaction: function (e) {
    this.model.collection.remove(this.model);
    this.parent.collection.trigger("change");
  }

});
