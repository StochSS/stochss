var _ = require('underscore');
var AmpCollection = require('ampersand-collection');
var StoichSpecie = require('./stoich-specie');

module.exports = AmpCollection.extend({
    model: StoichSpecie,
    initialize: function()
    {
        AmpCollection.prototype.initialize.apply(this, arguments);

        this.on('add remove', _.bind(this.triggerChange, this));
    },
    triggerChange: function()
    {
        this.baseModel = this.parent.collection.parent;

        this.baseModel.species.trigger('stoich-specie-change');
    },
    addStoichSpecie: function(specie, stoichiometry)
    {
        var stoichSpecie = new StoichSpecie({ specie : specie,
                                              stoichiometry : stoichiometry });
        
        // The Specie must be fully constructed before it is passed to add otherwise
        // Any formviews looking at this might not render things correctly
        stoichSpecie = this.add(stoichSpecie);

        //var baseModel = this.parent.collection.parent;

        // See HACK ALERT in ./reaction-collection:addCustomReaction
        //baseModel.species.trigger('stoich-specie-change');
    }
});
