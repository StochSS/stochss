var State = require('ampersand-state');
// var PlaceSettings = require('./place-settings');
// var UniformScatterSettings = require('./uniform-scatter-settings');

module.exports = State.extend({
  props: {
    type: 'string',
    count: 'number'
  },
  children: {
    // place: PlaceSettings,
    // scatter: UniformScatterSettings,
    // uniform: UniformScatterSettings
  }
});