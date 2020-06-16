var path = require('path');
//Support Files
var app = require('../app.js');
//Collections
var ModelsCollection = require('./models');
var ExperimentsCollection = require('./experiments');
//Models
var Model = require('ampersand-model');

module.exports = Model.extend({
  url: function () {
    return path.join(app.getApiPath(), "project/load-project")+"?path="+this.directory;
  },
  collections: {
    models: ModelsCollection,
    experiments: ExperimentsCollection
  },
  session: {
    directory: 'string'
  }
})