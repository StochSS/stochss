var AmpCollection = require('ampersand-collection');
var Reaction = require('./reaction');

module.exports = AmpCollection.extend({
    model: Reaction,
    addMassActionReaction: function(name, rate, reactants, products, subdomains) {
        var unique = this.models.every(function(model) { return model["name"] != name });
        
        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;
        
        var reaction = this.add({ name : name, equation : '', type : 'massaction', rate : rate, subdomains : subdomains }, { reactants : reactants, products : products });
        
        return reaction;
    },
    addCustomReaction: function(name, equation, reactants, products, subdomains) {
        var unique = this.models.every(function(model) { return model["name"] != name });
        
        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;
        
        var reaction = this.add({ name : name, equation : equation, type : 'custom', rate : undefined, subdomains : subdomains }, { reactants : reactants, products : products });
        
        return reaction;
    }
});
