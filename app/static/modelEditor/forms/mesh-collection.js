var _ = require('underscore');
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var MeshSelectView = require('./mesh');
var Mesh = require('../models/mesh');
var FileUpload = require('blueimp-file-upload');
var _s = require('underscore.string');

var Tests = require('../forms/tests.js');

var updateMsg = function(el, data)
{
    el.text( data.msg );
};

var AddNewMeshForm = AmpersandView.extend({
    template : $( '.meshCollectionAddTemplate' ).text(),
    initialize: function(attr, options) {
        AmpersandView.prototype.initialize.apply(this, arguments);

        this.collection = options.collection;
    },
    events: {
        "click #meshUploadButton" : "handleMeshUploadButton"
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.uploaderState = {};
        
        $( this.el ).find('#meshDataUpload').fileupload({
            url: '/FileServer/large/meshFiles',
            dataType: 'json',
            replaceFileInput : false,
            add : _.bind(this.handleMeshDataAdd, this),
            done : _.bind(this.handleMeshUploadFinish, this)
        });
        
        $( this.el ).find('#subdomainDataUpload').fileupload({
            url: '/FileServer/large/subdomainFiles',
            dataType: 'json',
            replaceFileInput : false,
            add : _.bind(this.handleSubdomainsDataAdd, this)//,
            //done : _.bind(this.handleSubdomainsUploadFinish, this)
        });
    },
    handleMeshUploadButton : function(event)
    {
        if(this.uploaderState.meshFileData)
        {
            this.uploaderState.meshFileData.submit();
            this.uploaderState.meshSubmitted = true;
            
            updateMsg( $( this.el ).find('#meshDataUploadStatus'),
                       { status : true,
                         msg : 'Uploading mesh...' } );
        }
        
        if(this.uploaderState.subdomainsFileData)
        {
            this.uploaderState.reader = new FileReader();

            this.uploaderState.reader.onload = _.bind(this.handleSubdomainsUploadFinish, this);
            
            this.uploaderState.reader.readAsText(this.uploaderState.subdomainsFileData.files[0]);
            //this.uploaderState.subdomainsFileData.submit();
            this.uploaderState.subdomainsSubmitted = true;
            
            updateMsg( $( this.el ).find('#subdomainDataUploadStatus'),
                       { status : true,
                         msg : 'Uploading subdomain...' } );
        }
        
        this.uploaderState.name = $( this.el ).find( '.uploadMeshDiv' ).find( '.name' ).val();
        this.uploaderState.description = $( this.el ).find( '.uploadMeshDiv' ).find( '.descriptionText' ).val();
    },
    handleMeshDataAdd : function(event, data)
    {
        if(this.uploaderState.meshFileData)
        {
            delete this.uploaderState.meshFileData;
            delete this.uploaderState.meshSubmitted;
            delete this.uploaderState.meshFileId;
        }

        var textArray = data.files[0].name.split('.');

        var ext = textArray[textArray.length - 1];

        if(ext.toLowerCase() != 'xml')
        {
            updateMsg( $( this.el ).find( '#meshDataUploadStatus' ),
                       { status : false,
                         msg : 'Mesh file must be a .xml' });
            
            return;
        }

        $( event.target ).prop('title', data.files[0].name);

        var nameBox = $( '.uploadMeshDiv' ).find('.name');

        var baseName;

        if(nameBox.val().trim() == '')
        {
            baseName = data.files[0].name.split('.')[0];
        }
        else
        {
            baseName = nameBox.val().trim();
        }

        nameBox.val(baseName);

        this.uploaderState.meshFileData = data;

        $( this.el ).find( "#meshUploadButton" ).prop('disabled', false);
    },
    handleSubdomainsDataAdd : function(event, data)
    {
        if(this.uploaderState.subdomainFileData)
        {
            delete this.uploaderState.subdomainsFileData;
            delete this.uploaderState.subdomainsSubmitted;
            delete this.uploaderState.subdomains;
            delete this.uploaderState.uniqueSubdomains;
        }

        var textArray = data.files[0].name.split('.');

        var ext = textArray[textArray.length - 1];

        if(ext.toLowerCase() != 'txt')
        {
            updateMsg( $( this.el ).find( '#subdomainDataUploadStatus' ),
                       { status : false,
                         msg : 'Subdomain file must be a .txt' } );
            
            return;
        }

        this.uploaderState.subdomainsFileData = data;
    },
    handleMeshUploadFinish : function(event, data)
    {
        this.uploaderState.meshFileId = data.result[0].id;

        updateMsg( $( this.el ).find( '#meshDataUploadStatus' ),
                   { status : true,
                     msg : 'Mesh uploaded' } );
        
        this.createMeshWrapper();
    },

    handleSubdomainsUploadFinish : function(event)
    {
        // _s is the underscore string library. Weird variable name I apologize
        var lines = event.target.result.split('\n');

        var subdomains = [];
        for(var i = 0; i < lines.length; i++)
        {
            var data = lines[i].split(',');

            if(data.length == 2)
                subdomains.push([parseInt(data[0]), parseInt(data[1])]);
        }

        this.uploaderState.subdomains = _.sortBy(subdomains, function(element) { return element[0]; });
        this.uploaderState.uniqueSubdomains = _.unique(subdomains);

        updateMsg( $( this.el ).find( '#subdomainDataUploadStatus' ),
                   { status : true,
                     msg : 'Subdomains uploaded' } );
        
        this.createMeshWrapper();
    },

    createMeshWrapper : function()
    {
        var data = {};
        
        if(this.uploaderState.meshSubmitted && this.uploaderState.meshFileId)
        {
            data['meshFileId'] = this.uploaderState.meshFileId;
            data['name'] = this.uploaderState.name;
            data['description'] = this.uploaderState.description;
            
            if(this.uploaderState.subdomainsSubmitted && this.uploaderState.subdomains)
            {
                data['subdomains'] = this.uploaderState.subdomains;
                data['uniqueSubdomains'] = this.uploaderState.uniqueSubdomains;
            }
            else
            {
                data['subdomains'] = [];
                data['uniqueSubdomains'] = [1];
            }
            
            data['undeletable'] = false;
            
            if(!this.uploaderState.subdomainsSubmitted || (this.uploaderState.meshFileId && this.uploaderState.subdomains))
            {
                var mesh = new Mesh(data);
                
                mesh.processMesh(_.bind(this.handleMeshWrapperCreated, this));

                this.uploaderState.mesh = mesh;
            }
        }
    },

    handleMeshWrapperCreated : function()
    {
        this.collection.add(this.uploaderState.mesh);

        this.uploaderState.mesh.save();

        this.uploaderState = {};
    }
});

var MeshCollectionSelectView = AmpersandView.extend({
    template: $( '.meshCollectionTemplate' ).text(),
    props: {
        selected : 'object'
    },
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.selected = this.model.mesh;

        if(typeof(this.selected) == 'undefined')
        {
            this.selected = this.collection.at(0);
        }
    },
    selectModel: function(model)
    {
        this.selected = model;

        this.model.mesh = this.selected;

        $( this.el ).find( '.description' ).text( this.selected.description );
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, MeshSelectView, this.el.querySelector('[data-hook=meshTable]'));

        // Select the currently selected model
        var inputs = $( this.el ).find('input');
        for(var i = 0; i < inputs.length; i++)
        {
            if(this.selected == this.collection.models[i])
            {
                $( inputs.get(i) ).prop('checked', true);
            }
        }

        this.selectModel( this.selected );

        //this.fields.forEach( function(field) { $( field.el ).find('input').val(''); } );
        this.addForm = new AddNewMeshForm(
            {
                el : this.el.querySelector('[data-hook=addMeshForm]')
            },
            {
                collection : this.collection
            }
        );

        this.addForm.render();
        
        return this;
    }
});

module.exports = MeshCollectionSelectView
