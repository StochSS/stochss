var AmpersandView = require('ampersand-view');
var SubCollection = require('ampersand-subcollection');

var PaginatedCollectionView = AmpersandView.extend({
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.limit = attr.limit;
        this.viewModel = attr.viewModel;
        this.offset = 0;

        this.listenTo(this.collection, 'add remove', this.updateModelCount.bind(this))

        this.subCollection = new SubCollection(this.collection, { limit : this.limit, offset : this.offset });
        this.subCollection.parent = this.collection.parent;
    },
    select : function(model)
    {
        if(this.value == model)
            return;

        this.value = model;
        this.view = this.subCollectionViews._getViewByModel(model);

        //Search for model in current selection
        for(var i = 0; i < this.subCollection.models.length; i++)
        {
            if(model == this.subCollection.models[i])
            {
                if(this.view)
                    if(typeof(this.view.select) == 'function')
                        this.view.select();
                return;
            }
        }

        //If not in current selection look elsewhere
        var i;
        for(i = 0; i < this.collection.models.length; i++)
        {
            if(model == this.collection.models[i])
            {
                if(i == this.collection.models.length - 1)
                    this.offset = i + 1 - this.collection.models.length % this.limit;
                else
                    this.offset = i;
                this.subCollection.configure( { limit : this.limit, offset : this.offset } );
                
                if(this.view)
                    if(typeof(this.view.select) == 'function')
                        this.view.select();
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
        modelCount : 'number',
        overLimit : 'boolean'
    },
    bindings : {
        'modelCount' : [
            {
                type : 'toggle',
                selector : 'div'
            },
            {
                type : 'text',
                hook : 'total'
            }
        ],
        'overLimit' : {
            type : 'toggle',
            hook : 'nav'
        },
        'offset' : 
        {
            type : 'text',
            hook : 'position'
        }
    },
    updateModelCount: function()
    {
        this.modelCount = this.collection.models.length;

        this.overLimit = !(this.collection.models.length > this.limit);
        this.overLimit = this.collection.models.length > this.limit;
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.subCollectionViews = this.renderCollection(this.subCollection, this.viewModel, this.el.querySelector('[data-hook=table]'));
        
        if(this.collection.models.length > 0)
            this.select(this.collection.models[0]);

        this.updateModelCount();

        return this;
    }
});

module.exports = PaginatedCollectionView;
