// Models
var State = require('ampersand-state');
var Specie = require('./specie');

module.exports = State.extend({
  props: {
    type: String,
    count: Number,
    subdomain: String,
    x: Number,
    y: Number,
    z: Number,
  },
  children: {
    specie: Specie,
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments)
  },
});