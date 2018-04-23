var _ = require('underscore');
var State = require('ampersand-state');

module.exports /*CollectionLoader*/ = State.extend({
    props: {
        attempts : {
            type : 'Number',
            default : 0
        },
        loaded : {
            type : 'Boolean',
            default : false
        },
        failed : {
            type : 'Boolean',
            default : false
        },
        progress : {
            type : 'number',
            default : 0.0
        }
    },
    derived: {
        errors : {
            deps : ['type'],
            fn : function() {
                return Math.max(0, this.attempts - 1);
            }
        }
    },
    downloadModels : function() {
        this.attempts += 1

        this.collection.fetch({
            success : _.bind(this.downloadSuccess, this),
            error : _.bind(this.downloadError, this)
        });
    },
    downloadSuccess : function(modelCollection, response, options)
    {
        this.loaded = true;
    },
    downloadError : function(modelCollection, response, options)
    {
        if(this.attempts < this.maxAttempts)
        {
            this.downloadModels();
        }
        else
        {
            this.failed = true;
        }
    },
    updateProgress: function(e)
    {
        this.progress = 100.0 * e.totalDownloaded / e.totalSize;
    },
    initialize : function(attrs, options)
    {
        if(typeof(options.maxAttempts) != 'undefined')
        {
            this.maxAttempts = options.maxAttempts;
        } else {
            this.maxAttempts = 3;
        }

        if(typeof(options.collection) == 'undefined')
        {
            throw "(CollectionLoader) options.collection must be an already initialized collection object"
        }

        State.prototype.initialize.apply(this, arguments);

        this.collection = options.collection;

        this.listenTo(this.collection, 'progress', _.bind(this.updateProgress, this));

        this.downloadModels();
    }
});
