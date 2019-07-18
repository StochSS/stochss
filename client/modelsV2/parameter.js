var _ = require('underscore');
//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    name: 'string',
    value: 'number',
  },
  session: {
    inUse: {
      type: 'boolean',
      default: false,
    },
  },
  initialize: function () {
    State.prototype.initialize.apply(this, arguments);
  },
  setInUseListener: function () {
    this.listenTo(this.collection, 'reaction-rate-change', _.bind(updateInUse, this));
  },
  updateInUse: function () {
    var model = this;
    var baseModel = this.collection.parent;

    this.inUse = !baseModel.reactions.every(
      function (reaction) {
        return reaction.reactionType === 'custom-propensity' || reaction.rate != model;
      });
  }
})