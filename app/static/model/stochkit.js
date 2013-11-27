var stochkit = stochkit || {}
stochkit.PrettyPrint = {}

var XML = function(el)
{
    return $($.parseXML(el)).children();
}

stochkit.Model = Backbone.Model.extend( {
    //Expects attributes to have a type varibleo
    initialize: function(attributes) {
        if(typeof this.dom === 'undefined')
        {
            this.dom = XML( '<Model />' );

            if(!_.has(attributes, 'type') || (attributes.type.toLowerCase() != 'population' && attributes.type.toLowerCase() != 'concentration')) {
                throw "stochkit.Model must be initialized with type == 'population' or 'concentration', I.E. stochkit.Model({ type : 'population' })"
            }
            
            this.desc = XML( '<Description />' ).appendTo(this.dom);
            this.NumberOfReactions = XML( '<NumberOfReactions />' ).appendTo(this.dom);
            this.NumberOfSpecies = XML( '<NumberOfSpecies />' ).appendTo(this.dom);
            this.ParametersList = XML( '<ParametersList />' ).appendTo(this.dom);
            this.SpeciesList = XML( '<SpeciesList />' ).appendTo(this.dom);
            this.ReactionsList = XML( '<ReactionsList />' ).appendTo(this.dom);
        }
    },

    updateCounts : function()
    {
        this.NumberOfReactions.text( this.ReactionsList.children().length );
        this.NumberOfSpecies.text( this.SpeciesList.children().length );
    },

    fromModel : function(other)
    {
        var id = undefined;

        if(_.has(this, 'id'))
        {
            id = this.id;
        }

        var string = other.toJSON();

        this.attributes = this.parse(string);

        delete this.id;
        delete this.attributes.id;

        if(id != undefined)
        {
            this.id = id;
            this.attributes.id = id;
        }
    },

    fromXML : function(string)
    {
        this.dom = XML(string);

        this.desc = this.dom.find('Description');
        this.NumberOfReactions = this.dom.find('NumberOfReactions');
        this.NumberOfSpecies = this.dom.find('NumberOfSpecies');
        this.ParametersList = this.dom.find('ParametersList');
        this.SpeciesList = this.dom.find('SpeciesList');
        this.ReactionsList = this.dom.find('ReactionsList');
    },

    toXML : function()
    {
        var serializer = new XMLSerializer();

        return serializer.serializeToString(this.dom[0]);
    },

    toJSON : function()
    {
        var ret = _.extend({ "model" : this.toXML() }, this.attributes);

        return ret;
    },

    parse : function(data, options)
    {
        this.fromXML(data.model);

        delete data.model;

        return data;
    },

    setDescription: function(name)
    {
        this.desc.text(name);

        this.trigger('change', 'description');
    },

    addSpecies: function(name, initial_population) {
        if(this.type == 'population')
        {
            if(initial_population % 1 != 0)
                throw 'Initial population of species ' + name + ' is not an integer -- ' + initial_population;
        }

        this.SpeciesList.append(
            XML( '<Species />' )
                .append( XML( '<Id />' ).text(name) )
                .append( XML( '<InitialPopulation />' ).text(initial_population) )
        );

        this.updateCounts();

        this.trigger('change', 'species');
    },

    addParameter: function(name, value) {
        this.ParametersList.append(
            XML( '<Parameter />' )
                .append( XML( '<Id />' ).text(name) )
                .append( XML( '<Expression />' ).text(value) )
        );

        this.trigger('change', 'parameters');
    },

    addReaction: function(name, reactants, products, prop, mass_action) {
        var reaction = XML( '<Reaction />' )
            .append( XML( '<Id />' ).text(name) );

        if(mass_action) {
            reaction.append( XML( '<Rate />' ).text(prop) )
                .append( XML( '<Type />').text('mass-action') );
        } else {
            reaction.append( XML( '<PropensityFunction />' ).text(prop) )
                .append( XML( '<Type />' ).text('customized') );
        }

        var reactantsXml = XML( '<Reactants />' );
        for(var i in reactants)
        {
            //_.map( reactants, function(reactant, stoichiometry) { return
            reactantsXml.append( XML( '<SpeciesReference />' ).attr( 'id', reactants[i][0] ).attr( 'stoichiometry', reactants[i][1] ));//);
        }

        var productsXml = XML( '<Products />' );
        for(var i in products)
        {
            //_.map( reactants, function(reactant, stoichiometry) { return
            productsXml.append( XML( '<SpeciesReference />' ).attr( 'id', products[i][0] ).attr( 'stoichiometry', products[i][1] ));//);
        }

        reaction.append(reactantsXml)
            .append(productsXml);

        this.ReactionsList.append(reaction);

        this.updateCounts();

        this.trigger('change', 'reactions');
    },

    getReaction: function(name) {
        var reaction = this.ReactionsList.children().has('Id:contains(' +  name + ')');

        var name = reaction.find('Id').text();
        var reactants = _.map(reaction.find('Reactants').children(), function(x) {
            return [$(x).attr('id'), Number($(x).attr('stoichiometry'))];
        });

        var products = _.map(reaction.find('Products').children(), function(x) {
            return [$(x).attr('id'), Number($(x).attr('stoichiometry'))];
        });
        var type = reaction.find('Type').text();

        if(type == 'mass-action') {
            var mass_action = true;
            var prop = reaction.find('Rate').text();
        }
        else
        {
            var prop = reaction.find('PropensityFunction').text();
            var mass_action = false;
        }   

        return {name : name, reactants : reactants, products : products, prop : prop , mass_action : mass_action};
    },

    setReaction: function(name, reactants, products, prop, mass_action) {
        this.removeReaction(name);
        this.addReaction(name, reactants, products, prop, mass_action);
    },

    setParameter: function(name, value) {
        this.removeParameter(name);
        this.addParameter(name, value);
    },

    setSpecies: function(name, initial_population) {
        this.removeSpecies(name);
        this.addSpecies(name, initial_population);
    },
    
    removeSpecies: function(name) {
        var species = this.SpeciesList.children().has( 'Id:contains(' + name + ')' );

        if(species.length == 0)
        {
            throw 'Species ' + name + ' does not exist';
        }

        species.remove();

        this.updateCounts();

        this.trigger('change', 'species');
    },

    removeParameter: function(name) {
        var parameter = this.ParametersList.children().has( 'Id:contains(' + name + ')' );

        if(parameter.length == 0)
        {
            throw 'Parameter ' + name + ' does not exist';
        }

        parameter.remove();

        this.trigger('change', 'parameters');
    },

    removeReaction: function(name) {
        var reaction = this.ReactionsList.children().has( 'Id:contains(' + name + ')' );

        if(reaction.length == 0)
        {
            throw 'Reaction ' + name + ' does not exist';
        }

        reaction.remove();

        this.updateCounts();

        this.trigger('change', 'reactions');
    },
});

stochkit.PrettyPrint.Reaction = function(reaction) {
    var reactants = reaction.find('Reactants').children();
    var products = reaction.find('Products').children();
    
    var expressionString = '';
    var propensityString = '';
    for(var j = 0; j < reactants.length; j++) {
        var s = reactants.eq(j).attr('stoichiometry');
        var id = reactants.eq(j).attr('id');

        if(s == '1') {
            expressionString += id;
        } else {
            expressionString += s + '*' + id;
        }

        propensityString += '*';
        if(s == '1')
        {
            propensityString += reactants.eq(j).attr('id');
        } else {
            propensityString += '(' + reactants.eq(j).attr('id') + '^' + s + ')';
        }
        
        if(j != reactants.length - 1)
        {
            expressionString += '+';
        }
    }
    
    expressionString += '=>'
    
    for(var j = 0; j < products.length; j++) {
        var s = products.eq(j).attr('stoichiometry');
        var id = products.eq(j).attr('id');

        if(s == '1') {
            expressionString += id;
        } else {
            expressionString += s + '*' + id;
        }
        
        if(j != products.length - 1)
        {
            expressionString += '+';
        }
    }

    if(products.length == 0) {
        expressionString += " null ";
    }

    var type = reaction.find('Type').text();

    if(type.toLowerCase() == 'mass-action')
    {
        propensityString = reaction.find('Rate').text() + propensityString;
    }
    else
    {
        propensityString = reaction.find('PropensityFunction').text();
    }

    var prettyReaction = {}

    prettyReaction.expression = expressionString;
    prettyReaction.propensity = propensityString;

    return prettyReaction;
};

stochkit.ModelCollection = Backbone.Collection.extend( {
    url: "/models/list",
    model: stochkit.Model
});
