var AmpCollection = require('ampersand-collection');
var InitialCondition = require('./initial-condition');

module.exports = AmpCollection.extend({
    model: InitialCondition,
    addScatterInitialCondition: function(specie, count, subdomain) {
        return this.add({ specie : specie, type : 'scatter', subdomain : subdomain, count : count });
    },
    addPlaceInitialCondition: function(specie, count, X, Y, Z) {
        return this.add({ specie : specie, type : 'place', count : count, X : X, Y : Y, Z : Z });
    },
    addDistributeUniformlyInitialCondition: function(specie, count, subdomain) {
        return this.add({ specie : specie, type : 'distributeUniformly', subdomain : subdomain, count : count });
    }
});
