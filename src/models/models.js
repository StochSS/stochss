var RestCollection = require('ampersand-rest-collection');
var Model = require('./model');
var path = require('path');
var config = require('../config.js')(process.env.NODE_ENV);

module.exports = RestCollection.extend({
  model: Model,
  url: function () { return path.resolve(config.apiUrl, 'models') }
});
