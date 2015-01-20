var AmpCollection = require('ampersand-collection');
var Reaction = require('./reaction');

module.exports = AmpCollection.extend({
    model: Reaction,
    addMassActionReaction: function(name, rate, reactants, products) {

        var unique = this.models.every(function(model) { return model["name"] != name });
        
        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;
        
        var reaction = this.add({ name : name, equation : '', type : 'massaction', rate : rate }, { reactants : reactants, products : products });

        //Look at the HACK ALERT in addCustomReaction
        //this.parent.species.trigger('stoich-specie-change');
        
        return reaction;
    },
    addCustomReaction: function(name, equation, reactants, products) {
        var unique = this.models.every(function(model) { return model["name"] != name });
        
        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;
        
        var reaction = this.add({ name : name, equation : equation, type : 'custom', rate : undefined }, { reactants : reactants, products : products });

        //HACK ALERT:
        // After the reaction is added, send a stoich-specie-change event to make sure the inUse variables are up to date
        // inUse requires that species know about all stoich-species in the app
        // This requires the stoich-species to actually be in the reaction reactants/products
        // But they send their update events on creation, not after being added
        // So we have to send another event. If this makes any sense.
        //this.parent.species.trigger('stoich-specie-change');
        
        return reaction;
    }
});
