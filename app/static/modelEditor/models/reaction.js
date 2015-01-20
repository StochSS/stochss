var _ = require('underscore');
var State = require('ampersand-state');
var StoichSpecie = require('./stoich-specie');
var StoichSpecieCollection = require('./stoich-specie-collection');
var Parameter = require('./parameter');

var Reaction = State.extend({
    props: {
        name : 'string',
        equation : 'string',
        type : 'string',
        rate : 'object'
    },
    collections: {
        reactants: StoichSpecieCollection,
        products: StoichSpecieCollection
    },
    triggerReaction: function() {
        this.collection.parent.parameters.trigger('reaction-rate-change');
    },
    triggerChange: function()
    {
        this.trigger('change');
    },
    initialize : function(attrs, options)
    {
        State.prototype.initialize.apply(this, arguments);

        this.on('add remove change:rate', _.bind(this.triggerReaction, this) );
        //this.triggerReaction();

        for(var i = 0; i < options.reactants.length; i++)
        {
            this.reactants.addStoichSpecie(options.reactants[i][0], options.reactants[i][1]);
        }

        for(var i = 0; i < options.products.length; i++)
        {
            this.products.addStoichSpecie(options.products[i][0], options.products[i][1]);
        }

        this.listenTo(this.reactants, 'add remove change', this.triggerChange);
        this.listenTo(this.products, 'add remove change', this.triggerChange);
    }
});

module.exports = Reaction;
