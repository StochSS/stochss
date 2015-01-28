var _ = require('underscore');
var Model = require('ampersand-model');
var SubdomainCollection = require('./subdomain-collection');

module.exports = Model.extend({
    props: {
        name : 'string',
        description : 'string',
        meshFileId : 'number',
        subdomains : 'object',
        uniqueSubdomains : 'object',
        undeletable : 'boolean'
    },
    derived: {
        deletable : {
            deps : [ 'undeletable' ],
            fn : function ()
            {
                return !this.undeletable;
            }
        }
    },
    parse: function(attr) {
        this.uniqueSubdomains = new SubdomainCollection();

        this.id = attr.id;

        for(var i = 0; i < attr.uniqueSubdomains.length; i++)
        {
            this.uniqueSubdomains.add({ name : attr.uniqueSubdomains[i] });
        }

        delete attr.uniqueSubdomains;

        return attr;
    }
});
