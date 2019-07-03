var State = require('ampersand-state');
var SpatialSpecie = require('./spatial-specie');
var NonspatialSpecie = require('./non-spatial-specie');

module.exports = State.extend({
  props: {
    id: 'number',
    name: 'string',
  },
  children: {
    spatialSpecies: SpatialSpecie,
    nonspatialSpecies: NonspatialSpecie
  },
  session: {
    inUse: {
      type: 'boolean',
      default: false
    }
  }
});