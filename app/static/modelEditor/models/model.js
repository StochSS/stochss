var _ = require('underscore');
var AmpersandModel = require('ampersand-model');
var SpecieCollection = require('./specie-collection');
var ReactionCollection = require('./reaction-collection');
var ParameterCollection = require('./parameter-collection');
var InitialConditionCollection = require('./initial-condition-collection');

var Model = AmpersandModel.extend({
    props: {
        name: 'string',
        units: 'string',
        type : 'string',
        isSpatial: 'boolean',
        species: 'object',//SpecieCollection,
        reactions: 'object',//ReactionCollection,
        parameters: 'object',//ParameterCollection
        mesh: 'object',
        initialConditions : 'object',
        is_public: 'boolean',
        saveState : 'string',
        ownedByMe : 'boolean'
    },
    triggerChange : function()
    {
        this.trigger('requestSave');
    },
    initialize: function(attrs, options) {
        this.is_public = false;

        this.parse(attrs);

        AmpersandModel.prototype.initialize.apply(this, arguments);

        // Every time the type of one of the reactions changes, update the type here
        this.listenTo(this.reactions, 'add remove change:type', _.bind(this.computeType, this));
        this.computeType();

        this.listenTo(this.reactions, 'add remove change', _.bind(this.triggerChange, this));
        this.listenTo(this.species, 'add remove change', _.bind(this.triggerChange, this));
        this.listenTo(this.parameters, 'add remove change', _.bind(this.triggerChange, this));
        this.listenTo(this.initialConditions, 'add remove change', _.bind(this.triggerChange, this));
        this.on('change:name change:units change:type change:isSpatial change:mesh', _.bind(this.triggerChange, this));
        // this will run if the name changes
    },
    setupMesh: function(meshCollection) {
        if(this.meshId)
        {
            for(var i = 0; i < meshCollection.models.length; i++)
            {
                if(this.meshId == meshCollection.models[i].id)
                {
                    this.mesh = meshCollection.models[i];
                }
            }
        }

        if(!this.mesh)
        {
            this.meshId = meshCollection.models[0].id;
            this.mesh = meshCollection.models[0];
        }

        for(var i = 0; i < this.species.models.length; i++)
        {
            this.species.models[i].setUpValidation();
        }

        for(var i = 0; i < this.parameters.models.length; i++)
        {
            this.parameters.models[i].setUpValidation();
        }

        var speciesByName = {};
        var subdomainsByName = {};

        for(var i = 0; i < this.species.models.length; i++)
        {
            speciesByName[this.species.models[i].name] = this.species.models[i];
        }

        for(var i = 0; i < this.mesh.uniqueSubdomains.models.length; i++)
        {
            subdomainsByName[this.mesh.uniqueSubdomains.models[i].name] = this.mesh.uniqueSubdomains.models[i];
        }

        for(var i = 0; i < this.unprocessedInitialConditions.length; i++)
        {
            var initialCondition = this.unprocessedInitialConditions[i];
            
            this.initialConditions.add({ type : initialCondition.type,
                                         count : initialCondition.count,
                                         specie : speciesByName[initialCondition.species],
                                         X : initialCondition.x,
                                         Y : initialCondition.y,
                                         Z : initialCondition.z,
                                         subdomain : initialCondition.subdomain });
        }

        delete this.unprocessedInitialConditions;
    },
    computeType: function() {
        var massAction = true;

        var massAction = this.reactions.every( function(reaction) {
            if(reaction.type != 'custom')
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
    saveModel: function()
    {
        if(this.saveState != 'saving')
            this.saveState = 'saving';

        if(!this.reactions.every( function(reaction) { return reaction.valid; } ))
        {
            this.saveState = 'failed'
            return;
        }

        this.actuallySaveModel();
    },
    actuallySaveModel: _.debounce(
        function()
        {
            if(this.collection && this.collection.url)
            {
                if(!this.reactions.every( function(reaction) { return reaction.valid; } ))
                {
                    this.saveState = 'failed';
                    return;
                }

		if(!this.initialConditions.every( function(initialCondition) { return initialCondition.valid; } ))
		{
                    this.saveState = 'invalid';
                    return;
		}

                try
                {
                    this.save(undefined, { success : _.bind(this.modelSaved, this), error : _.bind(this.modelSaveFailed, this) } );
                }
                catch(e)
                {
                    this.modelSaveFailed();
                }
            }
        }
        , 500),
    modelSaved: function()
    {
        if(this.saveState != 'saved')
            this.saveState = 'saved';
    },
    modelSaveFailed: function()
    {
        if(this.saveState != 'failed')
            this.saveState = 'failed';
    },
    parse: function(attr)
    {
        var speciesByName = {};

        if(!attr)
            return

        this.id = attr.id;
        this.is_public = attr.is_public;
        this.ownedByMe = attr.ownedByMe;

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
        
        if(!this.initialConditions || this.initialConditions == attr.initialConditions)
        {
            this.initialConditions = new InitialConditionCollection();
            this.initialConditions.parent = this;
        }

        if(attr.spatial)
        {
            this.meshId = attr.spatial.mesh_wrapper_id;

            this.unprocessedInitialConditions = attr.spatial.initial_conditions;
        }

        if(species && this.species.length == 0)
        {
            for(var i = 0; i < species.length; i++)
            {
                speciesByName[species[i].name] = this.species.addSpecie(species[i].name, species[i].initialCondition, attr.spatial.species_diffusion_coefficients[species[i].name], attr.spatial.species_subdomain_assignments[species[i].name], true);
            }
        }

        var parametersByName = {};
        
        if(parameters && this.parameters.length == 0)
        {
            for(var i = 0; i < parameters.length; i++)
            {
                parametersByName[parameters[i].name] = this.parameters.addParameter(parameters[i].name, String(parameters[i].value), true);
            }
        }

        if(reactions && this.reactions.length == 0)
        {
            for(var i = 0; i < reactions.length; i++)
            {
                var reaction = reactions[i];
                
                var reactants = reaction.reactants.map(function(reactant) { return [speciesByName[reactant.specie], reactant.stoichiometry ] });
                
                var products = reaction.products.map(function(product) { return [speciesByName[product.specie], product.stoichiometry ] });
                
                if(reaction.type == 'custom')
                {
                    this.reactions.addCustomReaction(reaction.name, reaction.equation, reactants, products, attr.spatial.reactions_subdomain_assignments[reactions[i].name]);
                } else {
                    this.reactions.addMassActionReaction(reaction.name, reaction.type, parametersByName[reaction.rate], reactants, products, attr.spatial.reactions_subdomain_assignments[reactions[i].name]);
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
                    isSpatial : this.isSpatial,
                    is_public : this.is_public };

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
            if(reactionOut.type == 'custom')
            {
                reactionOut.equation = reactionIn.equation;
            } else {
                reactionOut.rate = reactionIn.rate.name;
            }

            obj.reactions.push(reactionOut);
        }

        obj.spatial = {};
        obj.spatial.mesh_wrapper_id = this.meshId;
        //obj.spatial.subdomains = this.mesh.uniqueSubdomainList;
        obj.spatial.species_diffusion_coefficients = {};
        obj.spatial.species_subdomain_assignments = {};
        for(var i = 0; i < this.species.models.length; i++)
        {
            obj.spatial.species_diffusion_coefficients[this.species.models[i].name] = this.species.models[i].diffusion;
            obj.spatial.species_subdomain_assignments[this.species.models[i].name] = this.species.models[i].subdomains;
        }

        obj.spatial.reactions_subdomain_assignments = {};
        for(var i = 0; i < this.reactions.models.length; i++)
        {
            obj.spatial.reactions_subdomain_assignments[this.reactions.models[i].name] = this.reactions.models[i].subdomains;
        }

        obj.spatial.initial_conditions = [];
        for(var i = 0; i < this.initialConditions.models.length; i++)
        {
            var initialCondition = this.initialConditions.models[i];

            var ic = { type : initialCondition.type,
                       count : initialCondition.count,
                       species : initialCondition.specie.name,
                       x : initialCondition.X,
                       y : initialCondition.Y,
                       z : initialCondition.Z,
                       subdomain : initialCondition.subdomain };

            obj.spatial.initial_conditions.push(ic);
        }

        return obj;
    }
});

Model.buildFromJSON = function(json, model)
{

    return model;
};

module.exports = Model;
