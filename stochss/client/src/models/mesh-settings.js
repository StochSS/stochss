var State = require('ampersand-state');
var Subdomains = require('./subdomains');

module.exports = State.extend({
  props: {
    numSubdomains: {
      type: 'number',
      default: 2
    }
  },
  derived: {
    uniqueSubdomains: {
      deps: ['numSubdomains'],
      fn: function () {
        var uniqueSubdomains = new Subdomains();
        for(var i = 0; i < this.numSubdomains; i++){
          uniqueSubdomains.add({ 'name' : 'subdomain: ' + (i + 1) });
        }
        return uniqueSubdomains;
      }
    }
  }
});