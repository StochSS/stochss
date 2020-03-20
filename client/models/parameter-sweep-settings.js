//models
var State = require('ampersand-state');
var Parameter = require('./parameter');
var Species = require('./specie');

module.exports = State.extend({
  props: {
    is1D: 'boolean',
    p1Min: 'number',
    p1Max: 'number',
    p1Steps: 'number',
    p2Min: 'number',
    p2Max: 'number',
    p2Steps: 'number',
  },
  children: {
    parameterOne: Parameter,
    parameterTwo: Parameter,
    speciesOfInterest: Species
  },
  initialize: function(attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  }
});