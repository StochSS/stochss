//models
var Subdomain = require('./subdomain');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Subdomain,
  addSubdomain: function (name) {
    this.add({name: name});
  },
  removeSubdomains: function (subdomain) {
    this.remove(subdomain);
  },
});