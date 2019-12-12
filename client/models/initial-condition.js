// Models
var State = require('ampersand-state');
var Specie = require('./specie');

module.exports = State.extend({
  props: {
    type: 'string',
    count: 'number',
    subdomain: 'string',
    x: 'number',
    y: 'number',
    z: 'number',
  },
  children: {
    specie: Specie,
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments)
  },
});