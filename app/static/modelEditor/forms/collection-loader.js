var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');

module.exports = View.extend({
    template : "<div> \
    <span data-hook='status'></span>: \
    <span data-hook='name'></span> \
    <!--<span data-hook='progress'></span>%--> \
</div>",
    props : {
        name : 'string',
    },
    derived : {
        "status" : {
            deps : ['model.attempts', 'model.loaded', 'model.failed'],
            fn : function() {
                if(this.model.loaded)
                    return "Loaded";

                if(this.model.failed)
                    return "Failed after " + this.model.attempts + " attempts";

                if(this.model.attempts == 1)
                    return "Loading";

                return "Loading (attempt " + this.model.attempts + ")";
            }
        }
    },
    bindings : {
        'name' : {
            type : 'text',
            hook : 'name'
        },
        'status' : {
            type : 'text',
            hook : 'status'
        },
        'model.progress' : {
            type : 'text',
            hook : 'progress'
        }
    },
    initialize: function()
    {
        View.prototype.initialize.apply(this, arguments);
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);
    }
});
