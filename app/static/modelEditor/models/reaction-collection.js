var _ = require('underscore');
var Collection = require('./collection');
var Reaction = require('./reaction');

module.exports = Collection.extend({
    model: Reaction,
    initialize: function()
    {
        Collection.prototype.initialize.apply(this, arguments);

        this.on('add remove', _.bind(this.triggerChange, this));
    },
    triggerChange: function()
    {
        this.baseModel = this.parent;

        this.baseModel.parameters.trigger('reaction-rate-change');
        this.baseModel.species.trigger('stoich-specie-change');
        this.trigger('change');
    },
    addMassActionReaction: function(name, type, rate, reactants, products, subdomains) {
        var unique = this.models.every(function(model) { return model["name"] != name });
        
        // If the new Species name is not unique, return false
        if(!unique)
            return undefined;

        var reaction = this.add({ name : name, equation : '', type : type, rate : rate, subdomains : subdomains }, { reactants : reactants, products : products });

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
