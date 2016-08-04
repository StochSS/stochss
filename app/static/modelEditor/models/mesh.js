var _ = require('underscore');
var Model = require('ampersand-model');
var SubdomainCollection = require('./subdomain-collection');

module.exports = Model.extend({
    props: {
        name : 'string',
        description : 'string',
        meshFileId : 'number',
        threeJsMesh : 'object',
        subdomains : 'object',
        boundingBox : 'object',
        volumes : 'object',
        uniqueSubdomains : 'object',
        undeletable : { type : 'boolean', default : false },
	ghost : { type : 'boolean', default : false }
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

        var uniqueSubdomains = attr.uniqueSubdomains.sort();

        for(var i = 0; i < uniqueSubdomains.length; i++)
        {
            this.uniqueSubdomains.add({ name : uniqueSubdomains[i] });
        }

        delete attr.uniqueSubdomains;

        return attr;
    },
    downloadMesh: function(callback)
    {
        $.ajax({ type : "GET",
                 url : "meshes/threeJsMesh/" + this.meshFileId,
                 success : _.bind(_.partial(this.processMesh, callback), this),
                 dataType : 'json'});
    },
    processMesh: function(callback, data)
    {
        this.threeJsMesh = data;

        if(this.subdomains.length == 0)
        {
            for(var i = 0; i < this.threeJsMesh.vertices.length / 3; i++)
            {
                this.subdomains.push(1);
            }
        }

        callback(this);
    }
});
