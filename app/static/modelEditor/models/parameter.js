// parameter Model - parameter.js
var _ = require('underscore');
var AmpModel = require('ampersand-model');
module.exports = AmpModel.extend({
    props: {
        name: ['string'],
        value: ['string'],
        inUse: ['boolean']
    },
    initialize: function()
    {
        AmpModel.prototype.initialize.apply(this, arguments);
    },
    setUpValidation: function()
    {
        //Listen for messages from reaction objects
        this.listenTo(this.collection, 'reaction-rate-change', _.bind(this.updateInUse, this))
        
        this.updateInUse();
    },
    remove: function()
    {
        this.stopListening();

        AmpModel.prototype.remove.apply(this, arguments);
    },
    updateInUse: function()
    {
        var model = this;
        var baseModel = this.collection.parent;
        
        // Make sure it's *not* used everywhere, invert
        this.inUse = !baseModel.reactions.every(
            function(reaction)
            {
                return reaction.type == 'custom' || reaction.rate != model;
            }
        );
    }
});