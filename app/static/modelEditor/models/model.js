var _ = require('underscore');
var AmpersandModel = require('ampersand-model');
var SpecieCollection = require('./specie-collection');
var ReactionCollection = require('./reaction-collection');
var ParameterCollection = require('./parameter-collection');

var Model = AmpersandModel.extend({
    props: {
        name: 'string',
        units: 'string',
        type : 'string',
        isSpatial: 'boolean',
        species: 'object',//SpecieCollection,
        reactions: 'object',//ReactionCollection,
        parameters: 'object'//ParameterCollection
    },
    initialize: function(attrs, options) {
        this.parse(attrs);

        AmpersandModel.prototype.initialize.apply(this, arguments);

        // Every time the type of one of the reactions changes, update the type here
        this.listenTo(this.reactions, 'add remove change:type', _.bind(this.computeType, this));

        this.listenTo(this.reactions, 'add remove change', _.bind(this.saveModel, this));
        this.listenTo(this.species, 'add remove change', _.bind(this.saveModel, this));
        this.listenTo(this.parameters, 'add remove change', _.bind(this.saveModel, this));
        this.on('change:name change:units change:type change:isSpatial', _.bind(this.saveModel, this));
        // this will run if the name changes
    },
    computeType: function() {
        var massAction = true;

        var massAction = this.reactions.every( function(reaction) {
            if(reaction.type == 'massaction')
            {
                return true;
            } else {
                return false;
            }
        });
        
        if(massAction)
        {
            this.type = 'massaction';
        } else {
            this.type = 'custom';
        }
    },
    saveModel: _.debounce(
        function()
        {
            if(this.collection && this.collection.url)
                this.save();
        }
        , 500),
    parse: function(attr)
    {
        var speciesByName = {};

        if(!attr)
            return

        this.id = attr.id;

        var species = attr.species;
        var parameters = attr.parameters;
        var reactions = attr.reactions;

        if(!this.species || this.species == attr.species)
        {
            this.species = new SpecieCollection();
            this.species.parent = this;
        }

        if(!this.parameters || this.parameters == attr.parameters)
        {
            this.parameters = new ParameterCollection();
            this.parameters.parent = this;
        }
        
        if(!this.reactions || this.reactions == attr.reactions)
        {
            this.reactions = new ReactionCollection();
            this.reactions.parent = this;
        }

        if(species && this.species.length == 0)
        {
            for(var i = 0; i < species.length; i++)
            {
                speciesByName[species[i].name] = this.species.addSpecie(species[i].name, species[i].initialCondition);
            }
        }

        var parametersByName = {};
        
        if(parameters && this.parameters.length == 0)
        {
            for(var i = 0; i < parameters.length; i++)
            {
                parametersByName[parameters[i].name] = this.parameters.addParameter(parameters[i].name, parameters[i].value);
            }
        }

        if(reactions && this.reactions.length == 0)
        {
            for(var i = 0; i < reactions.length; i++)
            {
                var reaction = reactions[i];
                
                var reactants = reaction.reactants.map(function(reactant) { return [speciesByName[reactant.specie], reactant.stoichiometry ] });
                
                var products = reaction.products.map(function(product) { return [speciesByName[product.specie], product.stoichiometry ] });
                
                if(reaction.type == 'massaction')
                {
                    this.reactions.addMassActionReaction(reaction.name, parametersByName[reaction.rate], reactants, products);
                } else {
                    this.reactions.addCustomReaction(reaction.name, reaction.rate, reactants, products);
                }
            }
        }
        else
        {
            if(typeof(this.reactions) == 'undefined')
            {
                this.reactions = new ReactionCollection();
                this.reactions.parent = this;
            }        
        }

        if(parameters)
            delete attr.parameters;

        if(species)
            delete attr.species;

        if(reactions)
            delete attr.reactions;

        return attr;
    },
    toJSON: function()
    {
        var obj = { name : this.name,
                    units : this.units,
                    type : this.type,
                    isSpatial : this.isSpatial };

        if( this.id )
            obj.id = this.id;

        obj.species = this.species.map(function(specie) { return { name : specie.name, initialCondition : specie.initialCondition } });

        obj.parameters = this.parameters.map(function(parameter) { return { name : parameter.name, value : parameter.value } });

        obj.reactions = [];

        
        for(var i = 0; i < this.reactions.models.length; i++)
        {
            var reactionIn = this.reactions.models[i];
            var reactionOut = {};

            reactionOut.name = reactionIn.name;

            reactionOut.reactants = reactionIn.reactants.map(function(stoichSpecie) { return { specie : stoichSpecie.specie.name, stoichiometry : stoichSpecie.stoichiometry }; });
            reactionOut.products = reactionIn.products.map(function(stoichSpecie) { return { specie : stoichSpecie.specie.name, stoichiometry : stoichSpecie.stoichiometry } });

            reactionOut.type = reactionIn.type;
            if(reactionOut.type == 'massaction')
            {
                reactionOut.rate = reactionIn.rate.name;
            } else {
                reactionOut.rate = reactionIn.equation;
            }

            obj.reactions.push(reactionOut);
        }

        return obj;
    }
});

Model.buildFromJSON = function(json, model)
{

    return model;
};

module.exports = Model;
