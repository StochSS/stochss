var AmpCollection = require('ampersand-collection');
var InitialCondition = require('./initial-condition');

module.exports = AmpCollection.extend({
    model: InitialCondition,
    addScatterInitialCondition: function(specie, count, subdomain) {
        return this.add({ specie : specie, type : 'scatter', subdomain : subdomain, count : count, X : 0, Y : 0, Z : 0 });
    },
    addPlaceInitialCondition: function(specie, count, X, Y, Z) {
        var subdomain = this.parent.mesh.uniqueSubdomains.at(0);

        return this.add({ specie : specie, type : 'place', count : count, subdomain : subdomain, X : X, Y : Y, Z : Z });
    },
    addDistributeUniformlyInitialCondition: function(specie, count, subdomain) {
        return this.add({ specie : specie, type : 'distribute', subdomain : subdomain, count : count, X : 0, Y : 0, Z : 0 });
    }
});
