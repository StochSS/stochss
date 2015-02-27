var _ = require('underscore');
var State = require('ampersand-state');

module.exports = State.extend({
    props: {
        type : 'string',
        specie : 'object',
        count : 'number',
        subdomain : 'number',
        X : {
            type : 'number',
            default : function() { return 0.0; }
        },
        Y :  {
            type : 'number',
            default : function() { return 0.0; }
        },
        Z :  {
            type : 'number',
            default : function() { return 0.0; }
        }
    },
    derived : {
        valid : {
            deps : ['subdomain'],
            fn : function()
            {
                this.baseModel = this.collection.parent;

                for(var i = 0; i < this.baseModel.mesh.uniqueSubdomains.models.length; i++)
                    if(this.subdomain == this.baseModel.mesh.uniqueSubdomains.models[i].name)
                        return true;

                return false;
            },
            cache : false
        }
    }
});

