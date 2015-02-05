var AmpersandView = require('ampersand-view');
var SubCollection = require('ampersand-subcollection');

var PaginatedCollectionView = AmpersandView.extend({
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.listenToAndRun(this.collection, 'add remove', this.updateModelCount.bind(this))

        this.limit = attr.limit;
        this.view = attr.view;
        this.offset = 0;

        this.subCollection = new SubCollection(this.collection, { limit : this.limit, offset : this.offset });
    },
    select : function(model)
    {
        if(this.value == model)
            return;

        this.value = model;

        //Search for model in current selection
        for(var i = 0; i < this.subCollection.models.length; i++)
        {
            if(model == this.subCollection.models[i])
            {
                this.subCollectionViews._getViewByModel(model).select();
                return;
            }
        }

        //If not in current selection look elsewhere
        var i;
        for(i = 0; i < this.collection.models.length; i++)
        {
            if(model == this.collection.models[i])
            {
                this.offset = i;
                this.subCollection.configure( { limit : this.limit, offset : this.offset } );
                
                this.subCollectionViews._getViewByModel(model).select();
                break;
            }
        }

        //If not found do nothing
    },
    shiftPlus : function()
    {
        if(this.offset + this.limit < this.collection.models.length)
            this.offset = this.offset + this.limit;

        this.subCollection.configure( { limit : this.limit, offset : this.offset } );
    },
    shiftMinus : function()
    {
        if(this.offset - this.limit >= 0)
            this.offset = this.offset - this.limit;
        else
            this.offset = 0;

        this.subCollection.configure( { limit : this.limit, offset : this.offset } );
    },
    events : {
        "click [data-hook='next']" : "shiftPlus",
        "click [data-hook='previous']" : "shiftMinus"
    },
    props: {
        value : 'object',
        offset : 'number',
        modelCount : 'number'
    },
    bindings : {
        'modelCount' : [
            {
                type : 'toggle',
                hook : 'table'
            },
            {
                type : 'text',
                hook : 'total'
            }
        ],
        'offset' : 
        {
            type : 'text',
            hook : 'position'
        }
    },
    updateModelCount: function()
    {
        this.modelCount = this.collection.models.length;
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.subCollectionViews = this.renderCollection(this.subCollection, this.view, this.el.querySelector('[data-hook=table]'));
        
        if(this.collection.models.length > 0)
            this.select(this.collection.models[0]);

        return this;
    }
});

module.exports = PaginatedCollectionView;
