var _ = require('underscore');
//models
var State = require('ampersand-state');
var Specie = require('./specie');

module.exports = State.extend({
  props: {
    ratio: 'number',
  },
  children: {
    specie: Specie,
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
});