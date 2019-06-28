var State = require('ampersand-state');
var Specie = require('./specie');

module.exports = State.extend({
  props: {
    id: 'number',
    name: 'string',
    rule: 'string'
  },
  children: {
    specie: Specie
  }
});