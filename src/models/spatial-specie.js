var State = require('ampersand-state');
var InitialCondition = require('./initial-condition')

module.exports = State.extend({
  props: {
    diffusionCoeff: 'number'
  },
  children: {
    initialCondition: InitialCondition
  }
})