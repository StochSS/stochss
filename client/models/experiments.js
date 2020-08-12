//collections
var Collection = require('ampersand-collection');
//models
var Experiment = require('./experiment');

module.exports = Collection.extend({
  model: Experiment
});