var _ = require('underscore');
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var MeshSelectView = require('./mesh');
var Mesh = require('../models/mesh');
var FileUpload = require('blueimp-file-upload');

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
        "click .meshUploadButton" : "handleMeshUploadButton"
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
            add : _.bind(this.handleSubdomainsDataAdd, this),
            done : _.bind(this.handleSubdomainsUploadFinish, this)
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
            this.uploaderState.subdomainsFileData.submit();
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

        var newName;
        var i = 0;
        
        var nameUnique = true;
        do
        {
            nameUnique = true;
            
            newName = baseName + i;
            
            for(var ii in this.data.meshes)
            {
                if(this.data.meshes[ii])
                {
                    if(this.data.meshes[ii].name == newName)
                    {
                        nameUnique = false;
                        break;
                    }
                }
            }

            i = i + 1;
        } while(!nameUnique);

        nameBox.val(newName);

        this.uploaderState.meshFileData = data;

        $( this.el ).find( "#meshUploadButton" ).prop('disabled', false);
    },
    handleSubdomainsDataAdd : function(event, data)
    {
        if(this.uploaderState.subdomainFileData)
        {
            delete this.uploaderState.subdomainsFileData;
            delete this.uploaderState.subdomainsSubmitted;
            delete this.uploaderState.subdomainsFileId;
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

    handleSubdomainsUploadFinish : function(event, data)
    {
        this.uploaderState.subdomainsFileId = data.result[0].id;
        
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

            if(this.uploaderState.subdomainsSubmitted && this.uploaderState.subdomainsFileId)
            {
                data['subdomainsFileId'] = this.uploaderState.subdomainsFileId;
            }

            if(!this.uploaderState.subdomainsSubmitted || (this.uploaderState.meshFileId && this.uploaderState.subdomainsFileId))
            {
                $.ajax( { type : 'POST',
                          url: '/modeleditor/mesheditor',
                          data: { reqType : 'addMeshWrapper',
                                  data : JSON.stringify( data ) },
                          success : _.bind(this.handleMeshWrapperCreated, this) });
            }
        }
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
