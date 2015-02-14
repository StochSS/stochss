var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var Model = require('../models/model');
var ParameterCollectionFormView = require('./parameter-collection');
var SpecieCollectionFormView = require('./specie-collection');
var ReactionCollectionFormView = require('./reaction-collection');
var MeshCollectionFormView = require('./mesh-collection');
var InitialConditionsFormView = require('./initial-condition-collection');
var ModelConvert = require('../convertToPopulation/model');
var MeshView = require('./mesh3d');

module.exports = View.extend({
    template: $( '.modelEditorTemplate' ).text(),
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    props: {
        state: 'string',
        selector: 'object'
    },
    bindings: {
        'model.name' : {
            type : 'text',
            hook : 'modelName'
        }
    },
    events : {
        "click [data-hook='convertToPopulationButton']" : "convertToPopulation"
    },
    updateSaveMessage: function()
    {
        var saveMessageDom = $( this.queryByHook('saveMessage') );

        if(this.model.saveState == 'saved')
        {
            saveMessageDom.removeClass( "alert-error" );
            saveMessageDom.addClass( "alert-success" );
            saveMessageDom.text( "Saved" );
        }
        else if(this.model.saveState == 'saving')
        {
            saveMessageDom.removeClass( "alert-success alert-error" );
            saveMessageDom.text( "Saving..." );
        }
        else if(this.model.saveState == 'failed')
        {
            saveMessageDom.removeClass( "alert-success" );
            saveMessageDom.addClass( "alert-error" );
            saveMessageDom.text( "Model Save Failed!" );
        }
        else
        {
            saveMessageDom.removeClass( "alert-success" );
            saveMessageDom.addClass( "alert-error" );
            saveMessageDom.text( this.model.saveState );
        }
    },
    duplicateModel: function()
    {
        var model = new Model(this.model.toJSON());

        var names = this.model.collection.map( function(model) { return model.name; } );

        while(1)
        {
            var tmpName = this.model.name + '_' + Math.random().toString(36).substr(2, 3);

            if(!_.contains(names, tmpName))
            {
                model.name = tmpName;
                break;
            }
        }

        model.id = undefined;

        

        model.setupMesh(this.model.mesh.collection);

        this.model.collection.add(model);

        model.save();
    },
    convertToPopulation: function()
    {
        // If we're currently showing the concentration model editor, switch to showing the convert page
        if(this.state == 'concentration')
        {
            this.state = 'converting';

            this.remove();
            this.render();
        } else if(this.state == 'converting') {
            this.modelConverter.convertToPopulation();
            // We need to rerender everything if we've decided to convert

            this.state = 'population';

            this.remove();
            this.render();
        }
    },
    cancelConvertToPopulation: function()
    {
        if(this.state == 'converting') {
            this.state = 'concentration';

            this.remove();
            this.render();
        }
    },
    convertToSpatial: function()
    {
        if(this.state == 'population')
        {
            this.state = 'spatial';
            this.model.isSpatial = true;

            this.remove();
            this.render();
        }
    },
    updateVisibility: function()
    {
        if(this.state == 'concentration')
        {
            $( this.el ).find( '[data-hook="editor"]' ).show();
            $( '[data-hook="convertToPopulationLink"]' ).show();
            $( this.el ).find( '[data-hook="convertToPopulation"]' ).hide();
            $( '[data-hook="convertToSpatialLink"]' ).hide();
            $( this.el ).find( '.spatial' ).hide();
        }
        else if(this.state == 'converting')
        {
            $( this.el ).find( '[data-hook="convertToPopulation"]' ).show();
            $( '[data-hook="convertToPopulationLink"]' ).show();
            $( this.el ).find( '[data-hook="editor"]' ).hide();
            $( '[data-hook="convertToPopulationLink"]' ).show()
            $( '[data-hook="convertToSpatialLink"]' ).hide();
            $( this.el ).find( '.spatial' ).hide();
        }
        else if(this.state == 'population')
        {
            $( this.el ).find( '[data-hook="convertToPopulation"]' ).hide();
            $( '[data-hook="convertToPopulationLink"]' ).hide();
            $( this.el ).find( '[data-hook="editor"]' ).show();
            $( '[data-hook="convertToSpatialLink"]' ).show();
            $( this.el ).find( '.spatial' ).hide();
        }
        else if(this.state == 'spatial')
        {
            $( this.el ).find( '[data-hook="convertToPopulation"]' ).hide();
            $( '[data-hook="convertToPopulationLink"]' ).hide();
            $( this.el ).find( '[data-hook="editor"]' ).show();
            $( '[data-hook="convertToSpatialLink"]' ).hide();
            $( this.el ).find( '.spatial' ).show();
        }
    },
    initialize: function(attr)
    {
        // This is weird, but the model must wait for signals that these buttons have been pressed from the model select
        // THis is because the buttons are shared
        this.listenTo(this.model, "duplicateLink", _.bind(this.duplicateModel, this));
        this.listenTo(this.model, "convertToPopulationLink", _.bind(this.convertToPopulation, this));
        this.listenTo(this.model, "convertToSpatialLink", _.bind(this.convertToSpatial, this));

        if(this.model.isSpatial)
        {
            this.state = 'spatial';
        }
        else
        {
            this.state = this.model.units;
        }

        this.meshCollection = attr.meshCollection;

        this.on('change:state', this.updateVisibility);
        this.listenTo(this.model, 'change:saveState', _.bind(this.updateSaveMessage, this));
    },
    remove: function()
    {
        if(typeof(this.subViews) != "undefined")
        {
            this.subViews.forEach( function(view) { view.remove(); delete view; } );
            this.subViews = undefined;
        }

        $( this.el ).empty();
        //View.prototype.remove.apply(this, arguments);
    },
    render: function()
    {
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
            new InitialConditionsFormView({
                parent: this,
                el: $( '<div>' ).appendTo( this.el.querySelector("[data-hook='initialConditions']") )[0],
                collection: this.model.initialConditions
            }),
            new MeshCollectionFormView({
                parent: this,
                el: $( '<div>' ).appendTo( this.el.querySelector("[data-hook='mesh']") )[0],
                model: this.model,
                collection: this.meshCollection
            }),
            new MeshView({
                parent: this,
                el: $( '<div>' ).appendTo( this.el.querySelector("[data-hook='mesh3d']") )[0],
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

        this.updateVisibility();

        // Just say the model is saved -- this is a white lie, and every model form will set this. It's an issue
        var saveMessageDom = $( this.queryByHook('saveMessage') );
        saveMessageDom.removeClass( "alert-error" );
        saveMessageDom.addClass( "alert-success" );
        saveMessageDom.text( "Saved" );

        return this;
    }
});
