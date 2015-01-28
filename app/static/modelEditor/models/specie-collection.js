// specie Collection - specie-collection.js
var AmpCollection = require('ampersand-collection');
var specie = require('./specie');

module.exports = AmpCollection.extend({
    model: specie,
    addSpecie: function(name, initialCondition, diffusion, subdomains) {
        var unique = this.models.every(function(model) { return model["name"] != name });

        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;

        return this.add({ name : name, initialCondition : initialCondition, diffusion : diffusion, subdomains : subdomains });
    }
});