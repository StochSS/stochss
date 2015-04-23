/*global app, me, $*/
var $ = require('jquery');
var _ = require('underscore');
var config = require('clientconfig');

var View = require('ampersand-view');
var AmpersandModel = require('ampersand-model');
var AmpersandCollection = require('ampersand-rest-collection');
var ModelEditorView = require('./forms/model');
var ModelSelectView = require('./publicLibrary/model-collection');
var Model = require('./models/model');
var domReady = require('domready');
var Mesh = require('./models/mesh');
var MeshCollection = require('./models/mesh-collection');
var MeshSelectView = require('./forms/mesh-collection');

var PrimaryView = View.extend({
    template: "<div> \
<div data-hook='selector'></div> \
<button data-hook='copyToLibraryButton' class='btn btn-large'>Copy Model to Library</button> \
</div>",
    initialize: function(attr, options)
    {
        View.prototype.initialize.call(this, attr, options);

        this.collection = attr.collection;
        this.publicCollection = attr.publicCollection;

        this.meshCollection = attr.meshCollection;
    },
    importModel: function()
    {
        var saveMessageDom = $( this.queryByHook('saveMessage') );

        saveMessageDom.removeClass( "alert-success alert-error" );
        saveMessageDom.text( "Duplicating model..." );

        var models = $.ajax( { type : 'GET',
                               url : '/models/names',
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
        model.is_public = false;
        model.id = undefined;

        //model.setupMesh(this.meshCollection);

        this.collection.add(model);

        saveMessageDom.text( "Saving model..." );

        model.save(undefined, {
            success : _.bind(this.modelSaved, this),
            error : _.bind(this.modelNotSaved, this)
        });
    },
    modelSaved: function(model) {
        var saveMessageDom = $( this.queryByHook('saveMessage') );

        saveMessageDom.removeClass( "alert-error" );
        saveMessageDom.addClass( "alert-success" );
        saveMessageDom.text( "Saved model to local library" );
        
        window.location = '/modeleditor?select=' + String(model.id);
    },
    modelNotSaved: function()
    {
        var saveMessageDom = $( this.queryByHook('saveMessage') );

        saveMessageDom.removeClass( "alert-success" );
        saveMessageDom.addClass( "alert-error" );
        saveMessageDom.text( "Model not saved to local library!" );
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
    events: {
        "click button[data-hook='copyToLibraryButton']" : "importModel"
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.modelSelector = this.renderSubview(
            new ModelSelectView( {
                collection : this.publicCollection,
                meshCollection : this.meshCollection,
            } ), $( '<div>' ).appendTo( this.queryByHook('selector') )[0]
        );

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

        var div = $( '[data-hook="publicModelDiv"]' )[0];

        if(!div)
            div = document.body;

        domReady(function () {
            for(var i = 0; i < modelCollection.models.length; i++)
            {
                //modelCollection.models[i].setupMesh(meshCollection);
                modelCollection.models[i].saveState = 'saved';
            }

            for(var i = 0; i < publicModelCollection.models.length; i++)
            {
                //publicModelCollection.models[i].setupMesh(meshCollection);
                publicModelCollection.models[i].saveState = 'saved';
            }

            var modelSelectView = new PrimaryView( {
                el: div,
                collection : modelCollection,
                publicCollection : publicModelCollection,
                meshCollection : meshCollection
            } );

            modelSelectView.render();
        });
    }
};

