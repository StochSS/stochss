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

    ajaxConfig: function () {
        return {
            xhrFields: {
                timeout : 120000
            }
        };
    }
});

PublicModelCollection = AmpersandCollection.extend( {
    url: "/publicModels",
    comparator: util.alphaNumByName,
    model: Model,

    ajaxConfig: function () {
        return {
            xhrFields: {
                timeout : 120000
            }
        };
    }
});

MeshCollection = AmpersandCollection.extend( {
    url: "/meshes",
    comparator: util.alphaNumByName,
    model: Mesh,

    ajaxConfig: function () {
        return {
            xhrFields: {
                timeout : 120000
            }
        };
    }
});

var modelCollection = new ModelCollection();
var meshCollection = new MeshCollection();

var modelCollectionLoader = new CollectionLoader({}, { collection : modelCollection });
var meshCollectionLoader = new CollectionLoader({}, { collection : meshCollection });

var modelCollectionLoaderView = new CollectionLoaderView({
    name : 'Model Collection',
    model : modelCollectionLoader,
    el : $( '.modelLoader' )[0]
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

            // Need to remember this so we can clean up event handlers
            this.selected = this.modelSelector.selected;
        }

        this.updateModelNameText();
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
            this.selected = undefined;

            delete this.modelEditor;
        }

        this.updateModelNameText();
    },
    exportModelAsZip: function()
    {
        $.ajax( { type : 'GET',
                  url : '/modeleditor',
                  data : { reqType : 'exportToZip', id : this.modelSelector.selected.id },
                  dataType : 'json',
                  success : _.bind(this.forwardToFile, this)
                } )
    },
    exportModelAsXML: function()
    {
        $.ajax( { type : 'GET',
                  url : '/modeleditor',
                  data : { reqType : 'exportToXML', id : this.modelSelector.selected.id },
                  dataType : 'json',
                  success : _.bind(this.forwardToFile, this)
                } )
    },
    forwardToFile: function(data)
    {
        if(data.url)
        {
            window.location = data.url;
        }
        else
        {
            var saveMessageDom = $( this.queryByHook('saveMessage') );

            saveMessageDom.removeClass( "alert-success" );
            saveMessageDom.addClass( "alert-error" );
            saveMessageDom.text( data.msg );        
        }
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
        else if(url.query.model_edited)
        {
            for(var i = 0; i < this.collection.models.length; i++)
            {
                if(this.collection.at(i).name == url.query.model_edited)
                {
                    model = this.collection.at(i);
                }
            }
        }

        this.modelSelector = this.renderSubview(
            new ModelSelectView( {
                collection : this.collection,
                meshCollection : this.meshCollection,
                parent : this,
                selected : model
            } ), this.queryByHook('modelSelect')
        );

        this.selectModel();
        this.modelSelector.on('change:selected', _.bind(this.selectModel, this));

        return this;
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
    meshCollectionLoaderView.remove();
    
    var modelSelectView = new PrimaryView( { el: div, collection : modelCollection, meshCollection : meshCollection } );
    
    modelSelectView.render();
};

domReady(function () {
    modelCollectionLoaderView.render();
    meshCollectionLoaderView.render();

    var waitToLaunch = new WaitToLaunch( {}, {
        collections : [meshCollectionLoader, modelCollectionLoader],
        callback : runOnLoad
    } );
});
