//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    endSim: 'number',
    timeStep: 'number',
    volume: 'number',
    algorithm: 'string',
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments)
  },
})