/*global app, me, $*/
var $ = require('jquery');
var _ = require('underscore');
var logger = require('andlog');
var config = require('clientconfig');

//var Router = require('./router');
//var ConvertModelView = require('./convertToSpatial/model');
var View = require('ampersand-view');
var AmpersandModel = require('ampersand-model');
var AmpersandCollection = require('ampersand-rest-collection');
var ModelEditorView = require('./forms/model');
var ModelSelectView = require('./select/model-collection');
var Model = require('./models/model');
var domReady = require('domready');
var Mesh = require('./models/mesh');
var MeshCollection = require('./models/mesh-collection');
var MeshSelectView = require('./forms/mesh-collection');
var URL = require('url-parse');

var PrimaryView = View.extend({
    props : {
        selected : 'object'
    },
    bindings : {
        modelNameText : {
            type : 'text',
            hook : 'modelName'
        },
        selected : [
            {
                type : 'toggle',
                selector : '.reqModel'
            }
        ]
    },
    derived : {
        modelNameText : {
            deps : ['selected.name'],
            fn : function() {
                if(this.selected) {
                    return '(current: ' + this.selected.name + ')';
                }
                else
                {
                    return '';
                }
            }
        }
    },
    initialize: function(attr, options)
    {
        View.prototype.initialize.call(this, attr, options);

        this.meshCollection = attr.meshCollection;

        $( "[data-hook='exportToPublic']" ).click(_.bind(this.exportModel, this));
        $( "[data-hook='exportToZip']" ).click(_.bind(this.exportModelAsZip, this));

        $( '[data-hook="duplicateLink"]' ).click( _.bind( function() {
            this.modelEditor.duplicateModel();
        }, this ) );
        $( '[data-hook="convertToPopulationLink"]' ).click( _.bind( function() {
            this.modelEditor.convertToPopulation();
        }, this ) );
        $( '[data-hook="convertToSpatialLink"]' ).click( _.bind( function() {
            this.modelEditor.convertToSpatial();
        }, this ) );
    },
    remove : function()
    {
        $( '[data-hook="duplicateLink"]' ).off( 'click' );
        $( '[data-hook="convertToPopulationLink"]' ).off( 'click' );
        $( '[data-hook="convertToSpatialLink"]' ).off( 'click' );

        PrimaryView.prototype.remove.apply(this, arguments);
    },
    selectModel: function()
    {
        if(this.modelSelector.selected)
        {
            if(this.modelEditor)
            {
                this.modelEditor.remove()
                this.stopListening(this.lastSelected);
                
                delete this.modelEditor;
            }
            
            this.modelEditor = new ModelEditorView( {
                el : $( '<div>' ).appendTo( this.queryByHook('editor') )[0],
                model : this.modelSelector.selected,
                meshCollection : this.meshCollection,
                parent : this
            } );
            
            this.listenTo(this.modelSelector.selected, 'remove', _.bind(this.modelDeleted, this));
            this.registerSubview(this.modelEditor);
            this.modelEditor.render();

            if($( this.el ).find('.selectAccordion .accordion-body').hasClass('in'))
            {
                $( this.el ).find('.selectAccordion a').first()[0].click();
            }

            if(!$( this.el ).find('.speciesAccordion .accordion-body').first().hasClass('in'))
                $( this.el ).find('.speciesAccordion').find('a').first()[0].click();
            if(!$( this.el ).find('.parametersAccordion .accordion-body').first().hasClass('in'))
                $( this.el ).find('.parametersAccordion').find('a').first()[0].click();
            if(!$( this.el ).find('.mesh3dAccordion .accordion-body').first().hasClass('in'))
                $( this.el ).find('.mesh3dAccordion').find('a').first()[0].click();
            if(!$( this.el ).find('.initialConditionsAccordion .accordion-body').first().hasClass('in'))
                $( this.el ).find('.initialConditionsAccordion').find('a').first()[0].click();
            if(!$( this.el ).find('.reactionsAccordion .accordion-body').first().hasClass('in'))
                $( this.el ).find('.reactionsAccordion').find('a').first()[0].click();

            // Need to remember this so we can clean up event handlers
            this.selected = this.modelSelector.selected;
        }
    },
    exportModel : function()
    {
        var saveMessageDom = $( this.queryByHook('saveMessage') );

        saveMessageDom.removeClass( "alert-success alert-error" );
        saveMessageDom.text( "Duplicating model..." );

        var models = $.ajax( { type : 'GET',
                               url : '/publicModels/names',
                               async : false,
                               dataType : 'JSON' } ).responseJSON;

        var names = models.map( function(model) { return model.name; } );

        model = new Model(this.modelSelector.selected.toJSON());

        var tmpName = model.name;
        while(_.contains(names, tmpName))
        {
            tmpName = model.name + '_' + Math.random().toString(36).substr(2, 3);
        }

        model.name = tmpName;
        model.is_public = true;
        model.id = undefined;

        model.setupMesh(this.meshCollection);

        publicModelCollection.add(model);

        saveMessageDom.text( "Saving model..." );

        model.save(undefined, {
            success : _.bind(this.modelSaved, this),
            error : _.bind(this.modelNotSaved, this)
        });
    },
    modelSaved: function() {
        var saveMessageDom = $( this.queryByHook('saveMessage') );

        saveMessageDom.removeClass( "alert-error" );
        saveMessageDom.addClass( "alert-success" );
        saveMessageDom.text( "Saved model to public library" );

        window.location = '/publicLibrary';
    },
    modelNotSaved: function()
    {
        var saveMessageDom = $( this.queryByHook('saveMessage') );

        saveMessageDom.removeClass( "alert-success" );
        saveMessageDom.addClass( "alert-error" );
        saveMessageDom.text( "Error! Model not saved to public library!" );
    },
    modelDeleted: function()
    {
        if(this.modelEditor)
        {
            this.modelEditor.remove()
            this.stopListening(this.modelSelector.selected);
            
            delete this.modelEditor;
        }
    },
    exportModelAsZip: function()
    {
        $.ajax( { type : 'GET',
                  url : '/modeleditor',
                  data : { reqType : 'exportToZip', id : this.modelSelector.selected.id },
                  dataType : 'json',
                  success : _.bind(this.forwardToFile)
                } )
    },
    exportModelAsXML: function()
    {
        $.ajax( { type : 'GET',
                  url : '/modeleditor',
                  data : { reqType : 'exportToXML', id : this.modelSelector.selected.id },
                  dataType : 'json',
                  success : _.bind(this.forwardToFile)
                } )
    },
    forwardToFile: function(data)
    {
        window.location = data.url;
    },
    render: function()
    {
        //View.prototype.render.apply(this, arguments);

        $( this.queryByHook('modelSelect') ).empty();

        var url = new URL(document.URL, true);

        var model;
        if(url.query.select)
        {
            model = this.collection.get(parseInt(url.query.select), "id");
        }

        this.modelSelector = this.renderSubview(
            new ModelSelectView( {
                collection : this.collection,
                meshCollection : this.meshCollection,
                selected : model
            } ), this.queryByHook('modelSelect')
        );

        this.selectModel();
        this.modelSelector.on('change:selected', _.bind(this.selectModel, this));

        return this;
    }
});

ModelCollection = AmpersandCollection.extend( {
    url: "/models",
    model: Model
});

PublicModelCollection = AmpersandCollection.extend( {
    url: "/publicModels",
    model: Model
});

MeshCollection = AmpersandCollection.extend( {
    url: "/meshes",
    model: Mesh
});

var publicModelCollection = new PublicModelCollection();
var modelCollection = new ModelCollection();
var meshCollection = new MeshCollection();

var modelDownloaded = false; var meshDownloaded = false; var publicModelDownloaded = false;

modelCollection.fetch({
    success : function(modelCollection, response, options)
    {
        modelDownloaded = true;
        if(meshDownloaded && publicModelDownloaded)
        {
            module.exports.blastoff();
        }
    }
});

meshCollection.fetch({
    success : function(meshCollection, response, options)
    {
        meshDownloaded = true;
        if(modelDownloaded && publicModelDownloaded)
        {
            module.exports.blastoff();
        }
    }
});

publicModelCollection.fetch({
    success : function(publicModelCollection, response, options)
    {
        publicModelDownloaded = true;
        if(meshDownloaded && modelDownloaded)
        {
            module.exports.blastoff();
        }
    }
});

module.exports = {
    blastoff: function () {
        var self = window.app = this;

        var div = $( '.modelEditor' )[0];

        if(!div)
            div = document.body;

        domReady(function () {
            for(var i = 0; i < modelCollection.models.length; i++)
            {
                modelCollection.models[i].setupMesh(meshCollection);
                modelCollection.models[i].saveState = 'saved';
            }

            var modelSelectView = new PrimaryView( { el: div, collection : modelCollection, meshCollection : meshCollection } );

            modelSelectView.render();
            //var meshSelectView = new MeshSelectView( { el: div, collection : meshCollection } );

            //meshSelectView.render();
        });
    }
};

