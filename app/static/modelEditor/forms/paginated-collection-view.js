var AmpersandView = require('ampersand-view');
var SubCollection = require('ampersand-subcollection');
var _ = require('underscore');

var PaginatedCollectionView = AmpersandView.extend({
    updateValid : function()
    {
        var valid = true;
        var message = '';

        if(this.subCollectionViews)
        {
            for(var i = 0; i < this.subCollectionViews.views.length; i++)
            {
                if(this.subCollectionViews.views[i].updateValid)
                {
                    this.subCollectionViews.views[i].updateValid();
                }

                var model = this.subCollectionViews.views[i].model;
                var collection = model.collection

                if(typeof(collection.get(model.cid, 'cid')) == "undefined")
                    continue;

                if(typeof(this.subCollectionViews.views[i].valid) != "undefined")
                {
                    valid = valid && this.subCollectionViews.views[i].valid;
                    message = this.subCollectionViews.views[i].message;
                }
                
                if(!valid)
                    break;
            }
        }

        this.valid = valid;
        this.message = message;
    },
    update : function()
    {
        if(this.parent && this.parent.update)
            this.parent.update();
    },
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.limit = attr.limit;
        this.viewModel = attr.viewModel;
        this.offset = 0;
        //this.parent = attr.parent;

        if(typeof(attr.autoSelect) != "undefined")
            this.autoSelect = attr.autoSelect;
        else
            this.autoSelect = true;

        this.listenTo(this.collection, 'add remove', this.updateModelCount.bind(this))

        this.subCollection = new SubCollection(this.collection, { limit : this.limit, offset : this.offset });
        this.subCollection.parent = this.collection.parent;
    },
    selectIfVisible : function()
    {
        if(this.view)
            if(this.view.deSelect)
                this.view.deSelect();

        //Search for model in current selection
	if(this.subCollectionViews)
	{
            for(var i = 0; i < this.subCollection.models.length; i++)
            {
		if(this.value == this.subCollection.models[i])
		{
                    this.view = this.subCollectionViews._getViewByModel(this.value);
		    
                    if(this.view)
                    {
			if(typeof(this.view.select) == 'function')
                            this.view.select();
                    }
                    return;
		}
            }
	}
    },
    select : function(model, getFocus, force)
    {
        //if(!force)
        //    if(this.value == model)
        //        return;

        if(this.view)
            if(this.view.deSelect)
                this.view.deSelect();

        //Search for model in current selection
        for(var i = 0; i < this.subCollection.models.length; i++)
        {
            if(model == this.subCollection.models[i])
            {
                this.view = this.subCollectionViews._getViewByModel(model);

                if(this.view)
                {
                    if(typeof(this.view.select) == 'function')
                        this.view.select();

                    if(getFocus)
                    {
                        var textBox = $( this.view.el ).find( 'input[type=text]' ).filter(':visible').last();
                        if(textBox)
                            textBox.focus();
                    }
                }
          
		if(this.value != model || this.force)
                    this.value = model;

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
                    this.offset = Math.max(0, i + 1 - this.limit);
                else
                    this.offset = i;

                this.subCollection.configure( { limit : this.limit, offset : this.offset } );

                this.view = this.subCollectionViews._getViewByModel(model);

                if(this.view)
                {
                    if(typeof(this.view.select) == 'function')
                        this.view.select();

                    if(getFocus)
                    {
                        var textBox = $( this.view.el ).find( 'input[type=text]' ).filter(':visible').last();
                        if(textBox)
                            textBox.focus();
                    }
                }

		if(this.value != model || this.force)
		    this.value = model;

                break;
            }
        }

	// HACK FOR MESH-COLLECTION RENDER --> If this model isn't found anywhere, save it as the value anyway
	if(this.value != model || this.force)
	    this.value = model;
    },
    shiftPlus : function(e)
    {
        if(this.offset + this.limit < this.collection.models.length)
            this.offset = this.offset + this.limit;

        this.subCollection.configure( { limit : this.limit, offset : this.offset } );

	this.subCollection.on('add', _.bind(this.selectIfVisible, this));

	this.selectIfVisible();

        e.preventDefault();
    },
    shiftMinus : function(e)
    {
        if(this.offset - this.limit >= 0)
            this.offset = this.offset - this.limit;
        else
            this.offset = 0;

        this.subCollection.configure( { limit : this.limit, offset : this.offset } );

	this.selectIfVisible();

        e.preventDefault();
    },
    events : {
        "click [data-hook='next']" : "shiftPlus",
        "click [data-hook='previous']" : "shiftMinus"
    },
    props: {
        valid : 'boolean',
        message : 'string',
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
        },        'leftPosition' : 
        {
            type : 'text',
            hook : 'leftPosition'
        },
        'rightPosition' :
        {
            type : 'text',
            hook : 'rightPosition'
        }
    },
    derived : {
        leftPosition : {
            deps : ['offset'],
            fn : function() { return this.offset + 1; }
        },
        rightPosition : {
            deps : ['offset', 'modelCount'],
            fn : function() { return Math.min(this.modelCount, this.offset + 10); }
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

        if(this.value)
            this.select(this.value, true, true);
        else
            if(this.autoSelect)
                if(this.collection.models.length > 0)
                    this.select(this.collection.models[0]);

        this.updateModelCount();

        return this;
    }
});

module.exports = PaginatedCollectionView;
