console.log("Running JS " + performance.now())

//var Router = require('./router');
//var ConvertModelView = require('./convertToSpatial/model');
var _ = require('underscore');
var domReady = require('domready');
var State = require('ampersand-state');
var AmpersandCollection = require('ampersand-rest-collection');
var Model = require('./models/model');
var Mesh = require('./models/mesh');
var util = require('./forms/util');
var PrimaryView = require('./forms/primary-view');
var CollectionLoader = require('./models/collection-loader');
var CollectionLoaderView = require('./forms/collection-loader');

console.log("Requesting models " + performance.now())

var ajaxConfig = function () {
    return {
        xhrFields: {
            timeout : 10000,
            onprogress : _.bind(function(e) {
                this.trigger('progress', { totalDownloaded : e.total, totalSize : e.totalSize });
            }, this)
        }
    };
};

ModelCollection = AmpersandCollection.extend( {
    url: "/models",
    comparator: util.alphaNumByName,
    model: Model,

    ajaxConfig : ajaxConfig
});

PublicModelCollection = AmpersandCollection.extend( {
    url: "/publicModels",
    comparator: util.alphaNumByName,
    model: Model,

    ajaxConfig : ajaxConfig
});

MeshCollection = AmpersandCollection.extend( {
    url: "/meshes",
    comparator: util.alphaNumByName,
    model: Mesh,

    ajaxConfig : ajaxConfig
});

var publicModelCollection = new PublicModelCollection();
var modelCollection = new ModelCollection();
var meshCollection = new MeshCollection();

var modelCollectionLoader = new CollectionLoader({}, { collection : modelCollection });
var publicModelCollectionLoader = new CollectionLoader({}, { collection : publicModelCollection });
var meshCollectionLoader = new CollectionLoader({}, { collection : meshCollection });

var modelCollectionLoaderView = new CollectionLoaderView({
    name : 'Model Collection',
    model : modelCollectionLoader,
    el : $( '.modelLoader' )[0]
});

var publicModelCollectionLoaderView = new CollectionLoaderView({
    name : 'Public Model Collection',
    model : publicModelCollectionLoader,
    el : $( '.publicModelLoader' )[0]
});

var meshCollectionLoaderView = new CollectionLoaderView({
    name : 'Mesh Collection',
    model : meshCollectionLoader,
    el : $( '.meshLoader' )[0]
});

var WaitToLaunch = State.extend({
    checkAndLaunch : function()
    {
        var loaded = true;

        for(var i = 0; i < this.collections.length; i++)
        {
            loaded &= this.collections[i].loaded;
        }

        if(loaded)
        {
            this.stopListening();

            this.callback();
        }
    },
    initialize : function(attrs, options)
    {
        State.prototype.initialize.apply(this, arguments);

        this.collections = options.collections;
        this.callback = options.callback;

        for(var i = 0; i < this.collections.length; i++)
        {
            this.listenTo(this.collections[i], 'change:loaded', _.bind(this.checkAndLaunch, this));
        }

        this.checkAndLaunch();
    }
});

var runOnLoad = function()
{
    var div = $( '.modelEditor' )[0];

    if(!div)
        div = document.body;

    for(var i = 0; i < modelCollection.models.length; i++)
    {
        modelCollection.models[i].setupMesh(meshCollection);
        modelCollection.models[i].saveState = 'saved';
    }

    modelCollectionLoaderView.remove();
    publicModelCollectionLoaderView.remove();
    meshCollectionLoaderView.remove();
    
    var modelSelectView = new PrimaryView( { el: div, collection : modelCollection, meshCollection : meshCollection } );
    
    modelSelectView.render();
};

domReady(function () {
    modelCollectionLoaderView.render();
    publicModelCollectionLoaderView.render();
    meshCollectionLoaderView.render();

    var waitToLaunch = new WaitToLaunch( {}, {
        collections : [meshCollectionLoader, modelCollectionLoader, publicModelCollectionLoader],
        callback : runOnLoad
    } );
});
