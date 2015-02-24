// specie Model - specie.js
var _ = require('underscore');
var AmpModel = require('ampersand-model');


module.exports = AmpModel.extend({
    props: {
        name: ['string'],
        initialCondition: ['number'],
        diffusion :
        {
            type : 'number',
            default : 0.0
        },
        subdomains : 
        {
            type : 'object',
            default : function() { return []; }
        },
        inUse: ['boolean']
    },
    initialize: function()
    {
        AmpModel.prototype.initialize.apply(this, arguments);
    },
    setUpValidation: function()
    {
        //Listen for messages from stoich-specie objects
        this.listenTo(this.collection, 'stoich-specie-change', _.bind(this.updateInUse, this))

        this.updateInUse();
    },
    updateInUse: function()
    {
        var model = this;
        var baseModel = this.collection.parent;
        
        var stoichSpecieDoesNotHaveModel = function(stoichSpecie) { return stoichSpecie.specie != model; }
        
        // Make sure it's *not* used everywhere, invert
        this.inUse = !baseModel.reactions.every(
            function(reaction)
            {
                return reaction.reactants.every( stoichSpecieDoesNotHaveModel ) && reaction.products.every( stoichSpecieDoesNotHaveModel );
            }
        );
    }
});