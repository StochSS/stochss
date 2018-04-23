// specie Collection - specie-collection.js
var Collection = require('./collection');
var specie = require('./specie');

module.exports = Collection.extend({
    model: specie,
    addSpecie: function(name, initialCondition, diffusion, subdomains, skipSetUpValidation) {
        var unique = this.models.every(function(model) { return model["name"] != name });

        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;

        var specie = this.add({ name : name, initialCondition : initialCondition, diffusion : diffusion, subdomains : subdomains });
        
        if(!skipSetUpValidation)
            specie.setUpValidation();

        return specie;
    }
});