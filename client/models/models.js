var app = require('ampersand-app');
var RestCollection = require('ampersand-rest-collection');
var Model = require('./model');
var path = require('path');

module.exports = RestCollection.extend({
  model: Model,
  url: function () { 
    return path.join(
      app.getApiPath(),
      'models',
      String(app.me.name)
    ) 
  }
});
