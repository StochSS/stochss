var _ = require('underscore');
var State = require('ampersand-state');
var Specie = require('./specie');

module.exports = State.extend({
  props: {
    id: 'number',
    ratio : 'number',
  },
  children: {
    specie: Specie
  }
});

