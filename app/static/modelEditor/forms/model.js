var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ParameterCollectionFormView = require('./parameter-collection');
var SpecieCollectionFormView = require('./specie-collection');
var ReactionCollectionFormView = require('./reaction-collection');
var MeshCollectionFormView = require('./mesh-collection');
var ModelConvert = require('../convertToPopulation/model');

module.exports = View.extend({
    template: $( '.modelEditorTemplate' ).text(),
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    props: {
        state: 'string',
        selector: 'object'
    },
    bindings: {
        'model.type' : {
            type : 'text',
            hook : 'type'
        }
    },
    events : {
        "click [data-hook='convertToPopulationButton']" : "convertToPopulation"
    },
    convertToPopulation: function()
    {
        // If we're currently showing the concentration model editor, switch to showing the convert page
        if(this.state == 'concentration')
        {
            this.state = 'converting';
        } else if(this.state == 'converting') {
            this.modelConverter.convertToPopulation();
            // We need to rerender everything if we've decided to convert
            this.render();

            this.state = 'population';
        }
    },
    updateVisibility: function()
    {
        if(this.state == 'concentration')
        {
            $( this.el ).find( '[data-hook="editor"], [data-hook="convertToPopulationButton"]' ).show();
            $( this.el ).find( '[data-hook="convertToPopulation"]' ).hide();
        }
        else if(this.state == 'converting')
        {
            $( this.el ).find( '[data-hook="convertToPopulation"], [data-hook="convertToPopulationButton"]' ).show();
            $( this.el ).find( '[data-hook="editor"]' ).hide()
        }
        else if(this.state == 'population')
        {
            $( this.el ).find( '[data-hook="convertToPopulation"], [data-hook="convertToPopulationButton"]' ).hide();
            $( this.el ).find( '[data-hook="editor"]' ).show()
        }
    },
    initialize: function(attr)
    {
        this.state = this.model.units;

        this.meshCollection = attr.meshCollection;
    },
    render: function()
    {
        if(typeof(this.subViews) != "undefined")
        {
            this.subViews.forEach( function(view) { view.remove(); } );
            this.subViews = undefined;
        }

        View.prototype.render.apply(this, arguments);

        if(!this.model)
            return this;

        var model = this.model;

        this.modelConverter = new ModelConvert({
            parent: this,
            el: $( '<div>' ).appendTo( this.el.querySelector("[data-hook='convertToPopulation']") )[0],
            model: this.model
        });

        this.subViews = [
            new SpecieCollectionFormView({
                parent: this,
                el: $( '<div>' ).appendTo( this.el.querySelector("[data-hook='specie']") )[0],
                collection: model.species
            }),
            new ParameterCollectionFormView({
                parent: this,
                el: $( '<div>' ).appendTo( this.el.querySelector("[data-hook='parameter']") )[0],
                collection: model.parameters
            }),
            new ReactionCollectionFormView({
                parent: this,
                el: $( '<div>' ).appendTo( this.el.querySelector("[data-hook='reaction']") )[0],
                collection: model.reactions
            }),
            new MeshCollectionFormView({
                parent: this,
                el: $( '<div>' ).appendTo( this.el.querySelector("[data-hook='mesh']") )[0],
                model: this.model,
                collection: this.meshCollection
            }),
            this.modelConverter
        ];

        this.subViews.forEach(_.bind(
            function(view)
            {
                this.registerSubview(view);
                view.render();
            }
        , this));

        this.on('change:state', this.updateVisibility);
        this.updateVisibility();

        return this;
    }
});
