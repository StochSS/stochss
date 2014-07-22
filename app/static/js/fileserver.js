var fileserver = fileserver || {}

// Our basic file object has a number of parameters
fileserver.File = Backbone.Model.extend({
    // Default attributes for the todo item.
    defaults: function() {
        return {
            path: undefined,
            owner: undefined,
            perm: undefined,
            data : undefined
        };
    }
});

// Initializing one of these gets you access to the full models
fileserver.FileList = Backbone.Collection.extend( {
    url: "/FileServer/backbone/",
    model: fileserver.File,
    
    initialize : function(models, options) {
        if(typeof options.key == 'undefined')
            throw "fileserver.FileList demands 'key' be defined in it's input argument ( like FileList( { key : 'somekey' } ) )"

        this.url = this.url + options.key;
    }
});
