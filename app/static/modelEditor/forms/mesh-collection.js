var _ = require('underscore');
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var MeshSelectView = require('./mesh');
var Mesh = require('../models/mesh');
var FileUpload = require('blueimp-file-upload');
var PaginatedCollectionView = require('./paginated-collection-view');

var Tests = require('../forms/tests.js');

var updateMsg = function(el, data)
{
    el.text( data.msg );
};

var AddNewMeshForm = AmpersandView.extend({
    template : $( '.meshCollectionAddTemplate' ).text(),
    props : {
        meshFileData : 'object'
    },
    derived : {
        notValid : {
            deps : ['meshFileData'],
            fn : function() { return !Boolean(this.meshFileData); }
        }
    },
    bindings : {
        'notValid' : {
            type : 'booleanAttribute',
            hook : 'meshUploadButton',
            name : 'disabled'
        }
    },
    initialize: function(attr, options) {
        AmpersandView.prototype.initialize.apply(this, arguments);

        this.collection = options.collection;
    },
    events: {
        "click [data-hook=meshUploadButton]" : "handleMeshUploadButton",
        "click [data-hook=resetFormButton]" : "meshReset"
    },
    updateMessage: function( selector, data )
    {
        var el = $( this.el ).find( selector );
        el.html('');
        
        if(!data || !_.has(data, 'status'))
        {
            el.text('').prop('class', '').hide();
            
            return;
        }
        
        var text = data.msg;
        
        el.html(text);
        if(data.status)
            el.prop('class', 'alert alert-success');
        else
            el.prop('class', 'alert alert-error');
        
        el.show();
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

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
        if(this.meshFileData)
        {
            this.meshFileData.submit();
            this.meshSubmitted = true;
            
            this.updateMessage( $( this.el ).find('#meshDataUploadStatus'),
                       { status : true,
                         msg : 'Uploading mesh...' } );
        }
        
        if(this.subdomainsFileData)
        {
            this.reader = new FileReader();

            this.reader.onload = _.bind(this.handleSubdomainsUploadFinish, this);
            
            this.reader.readAsText(this.subdomainsFileData.files[0]);
            //this.subdomainsFileData.submit();
            this.subdomainsSubmitted = true;
            
            this.updateMessage( $( this.el ).find('#subdomainDataUploadStatus'),
                       { status : true,
                         msg : 'Uploading subdomain...' } );
        }
        
        this.name = $( this.el ).find( '.name' ).val();
        this.description = $( this.el ).find( '.descriptionText' ).val();
    },
    handleMeshDataAdd : function(event, data)
    {
        if(this.meshFileData)
        {
            this.meshFileData = null;
            delete this.meshSubmitted;
            delete this.meshFileId;
        }

        var textArray = data.files[0].name.split('.');

        var ext = textArray[textArray.length - 1];

        if(ext.toLowerCase() != 'xml')
        {
            this.updateMessage( $( this.el ).find( '#meshDataUploadStatus' ),
                       { status : false,
                         msg : 'Mesh file must be a .xml' });
            
            return;
        }

        $( event.target ).prop('title', data.files[0].name);

        var nameBox = $( this.el ).find('.name');

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

        this.meshFileData = data;
    },
    handleSubdomainsDataAdd : function(event, data)
    {
        if(this.subdomainFileData)
        {
            delete this.subdomainsFileData;
            delete this.subdomainsSubmitted;
            delete this.subdomains;
            delete this.uniqueSubdomains;
        }

        var textArray = data.files[0].name.split('.');

        var ext = textArray[textArray.length - 1];

        if(ext.toLowerCase() != 'txt')
        {
            this.updateMessage( $( this.el ).find( '#subdomainDataUploadStatus' ),
                       { status : false,
                         msg : 'Subdomain file must be a .txt' } );
            
            return;
        }

        this.subdomainsFileData = data;
    },
    handleMeshUploadFinish : function(event, data)
    {
        this.meshFileId = data.result[0].id;

        this.updateMessage( $( this.el ).find( '#meshDataUploadStatus' ),
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

        this.subdomains = _.map(_.sortBy(subdomains, function(element) { return element[0]; }), function(element) { return element[1];});
        this.uniqueSubdomains = _.unique(this.subdomains);

        this.updateMessage( $( this.el ).find( '#subdomainDataUploadStatus' ),
                   { status : true,
                     msg : 'Subdomains uploaded' } );
        
        this.createMeshWrapper();
    },
    createMeshWrapper : function()
    {
        var data = {};
        
        if(this.meshSubmitted && this.meshFileId)
        {
            data['meshFileId'] = this.meshFileId;
            data['name'] = this.name;
            data['description'] = this.description;
            
            if(this.subdomainsSubmitted && this.subdomains)
            {
                data['subdomains'] = this.subdomains;
                data['uniqueSubdomains'] = this.uniqueSubdomains;
            }
            else
            {
                data['subdomains'] = [];
                data['uniqueSubdomains'] = [1];
            }
            
            data['undeletable'] = false;
            
            if(!this.subdomainsFiledata || this.subdomains)
            {
                var mesh = new Mesh(data);

                this.mesh = mesh;
                
                this.handleMeshWrapperCreated();
            }
        }
    },
    handleMeshWrapperCreated : function()
    {
        this.collection.add(this.mesh);

        this.mesh.save();

        this.parent.selectModel(this.mesh);

        this.meshReset();
    },
    meshReset : function()
    {
        this.updateMessage( '#subdomainDataUploadStatus' );
        this.updateMessage( '#meshDataUploadStatus' );

        this.meshFileData = null;
        delete this.meshSubmitted;
        delete this.meshFileId;
        delete this.subdomainsFileData;
        delete this.subdomainsSubmitted;
        delete this.subdomains;
        delete this.uniqueSubdomains;
        
        $( "#meshForm" )[0].reset();
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
    },
    selectModel: function()
    {
        this.selected = this.selectView.value;
        
        // The jquery click here doesn't work but the Javascript one does!
        //$( this.el ).find( ".meshLibrary" ).trigger('click');
        if($( this.el ).find( "#collapseThree2" ).hasClass('in'))
            $( this.el ).find( ".meshLibrary" )[0].click();

        this.model.mesh = this.selected;

        $( this.el ).find( '.description' ).text( this.selected.description );
    },
    render: function()
    {
        var collectionTemplate = "<div> \
  <table cellpadding='0' cellspacing='0' border='0' class='table table-striped table-bordered' data-hook='table'> \
    <thead><tr><th>Delete</th><th>Select</th><th style='width: 100%'>Mesh Name</th></tr></thead> \
    <tbody data-hook='items'></tbody> \
  </table> \
  <div data-hook='nav'> \
    <button class='btn' data-hook='previous'>&lt;&lt;</button>\
    [ <span data-hook='leftPosition'></span> - <span data-hook='rightPosition'></span> ] \
    <button class='btn' data-hook='next'>&gt;&gt;</button>\
  </div> \
</div>";

        AmpersandView.prototype.render.apply(this, arguments);

        this.selectView = this.renderSubview( new PaginatedCollectionView( {
            template : collectionTemplate,
            collection : this.collection,
            viewModel : MeshSelectView,
            limit : 10
        }), this.queryByHook('meshTable'));

        this.selectView.select(this.model.mesh);
        this.listenToAndRun(this.selectView, 'change:value', _.bind(this.selectModel, this));

        //this.fields.forEach( function(field) { $( field.el ).find('input').val(''); } );
        this.addForm = new AddNewMeshForm(
            {
                el : this.el.querySelector('[data-hook=addMeshForm]'),
                parent : this
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
