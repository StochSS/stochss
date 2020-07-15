//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    key: 'string',
    title: 'string',
    xaxis: 'string',
    yaxis: 'string',
    stamp: 'number',
    species: 'object'
  }
});