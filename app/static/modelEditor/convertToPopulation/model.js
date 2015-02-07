var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ReactionView = require('./reaction');
var ParameterCollectionView = require('./parameter-collection');
var SpecieCollectionView = require('./specie-collection');
var ReactionCollectionView = require('./reaction-collection');
var InputView = require('ampersand-input-view');
var Tests = require('../forms/tests');

module.exports = View.extend({
    template: $( ".convertToPopulationTemplate" ).text(),
    props: {
        volume : 'Number'
    },
    initialize: function()
    {
        View.prototype.initialize.apply(this, arguments);

        this.volume = 1.0;
    },
    events : {
        "click [data-hook=finishConvertButton]" : "clickConvertToPopulation"
    },
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    bindings: {
        'model.type' : {
            type : 'text',
            hook: 'type'
        }
    },
    clickConvertToPopulation : function()
    {
        $( '[data-hook=convertToPopulationLink]' ).trigger('click');
    },
    update: function(element)
    {
        if(element.name == 'volume')
        {
            if(element.valid)
                this.volume = Number(element.value);
        }
    },
    convertToPopulation : function()
    {
        var species = this.model.species.models;
        for(var i = 0; i < species.length; i++)
        {
            species[i].initialCondition = Math.floor(this.volume * species[i].initialCondition);
        }

        var reactions = this.model.reactions.models;
        for(var i = 0; i < reactions.length; i++)
        {
            if(reactions[i].type == 'massaction')
            {
                var factor = ReactionView.computeConversionFactor(reactions[i], this.volume);
                if(factor && factor.length > 0)
                {
                    var tmpName = reactions[i].rate.name + '_';
                    var j = 0;

                    var modelNames

                    while(_.findWhere(reactions, { name : tmpName + j } ))
                    {
                        j += 1;
                    }

                    var newParam = this.model.parameters.addParameter(tmpName + j, reactions[i].rate.value + factor );
                    reactions[i].rate = newParam;
                }
            }
        }

        this.model.units = 'population';
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        var model = this.model;

        this.subViews = [
            new SpecieCollectionView({
                el: this.el.querySelector("[data-hook='specie']"),
                collection: model.species
            }),
            new ParameterCollectionView({
                el: this.el.querySelector("[data-hook='parameter']"),
                collection: model.parameters
            }),
            new ReactionCollectionView({
                el: this.el.querySelector("[data-hook='reaction']"),
                collection: model.reactions
            }),
            new InputView({
                el: this.el.querySelector("[data-hook='volume']"),
                label: 'Volume',
                name: 'volume',
                value: this.volume,
                required: true,
                placeholder: 'Volume',
                tests: [].concat(Tests.nonzero())
            })
        ];

        this.subViews.forEach(_.bind(
            function(view)
            {
                this.registerSubview(view);
                view.render();
            }
        , this));

        $(this.el).find('input').prop('autocomplete', 'off');

        return this;
    }
});
