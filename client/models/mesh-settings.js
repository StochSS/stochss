//models
var State = require('ampersand-state');
var Subdomains = require('./subdomains');

module.exports = State.extend({
  props: {
    count: 'number'
  },
  derived: {
    uniqueSubdomains: {
      deps: ['count'],
      fn: function () {
        var uniqueSubdomains = new Subdomains();
        for(var i = 1; i <= this.count; i++){
          uniqueSubdomains.addSubdomain('subdomain ' + i + ':');
        }
        return uniqueSubdomains;
      },
    },
  },
  initialize: function (attrs, options) {
    State.prototype.initialize.apply(this, arguments);
  },
});