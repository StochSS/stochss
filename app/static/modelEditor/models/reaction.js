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
        rate : 'object',
        subdomains :
        {
            type : 'object',
            default : function() { return []; }
        }
    },
    derived: {
        valid : {
            deps : ['type', 'rate', 'reactants', 'products'],
            fn : function() {
                if(this.type != 'custom' && !this.rate)
                {
                    return false;
                }

                var reactants;
                var products;
                if(this.type == 'creation')
                {
                    reactants = 0;
                    products = 1;
                }
                else if(this.type == 'destruction')
                {
                    reactants = 1;
                    products = 0;
                }
                if(this.type == 'change')
                {
                    reactants = 1;
                    products = 1;
                }
                if(this.type == 'merge')
                {
                    reactants = 2;
                    products = 1;
                }
                if(this.type == 'dimerization')
                {
                    reactants = 1;
                    products = 1;
                }
                if(this.type == 'split')
                {
                    reactants = 1;
                    products = 2;
                }
                if(this.type == 'four')
                {
                    reactants = 2;
                    products = 2;
                }

                for(var i = 0; i < reactants; i++)
                {
                    if(!this.reactants.at(i))
                        return false;

                    if(!this.reactants.at(i).specie)
                        return false;
                }

                for(var i = 0; i < products; i++)
                {
                    if(!this.products.at(i))
                        return false;
                    
                    if(!this.products.at(i).specie)
                        return false;
                }

                return true;
            }
        }
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
        this.trigger('change:reactants');
        this.trigger('change:products');
        this.collection.parent.species.trigger('stoich-specie-change');
        this.trigger('change');
    },
    initialize : function(attrs, options)
    {
        this.reactants = new StoichSpecieCollection(undefined, { parent : this });
        this.products = new StoichSpecieCollection(undefined, { parent : this });

        State.prototype.initialize.apply(this, arguments);

        //add remove 
        this.on('change:rate', _.bind(this.triggerReaction, this) );
        //this.on('add remove', _.bind(this.triggerChange, this));
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
