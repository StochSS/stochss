var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var Tests = require('./tests');

module.exports = View.extend({
    template: '<div> \
    <div> \
        <h5>Mesh Name:</h5> \
        <div data-hook="name"> \
        </div> \
    </div> \
    <div> \
        <br /> \
        <div data-hook="descriptionContainer" class="span5"> \
            <h5>Description:</h5> \
            <pre data-hook="description"> \
            </pre> \
        </div> \
        <div class="span5"> \
            <h5>Volumes:</h5> \
            <table class="table"> \
                <tr> \
                    <th>Subdomain</th> \
                    <th>Volume</th> \
                </tr> \
                <tbody data-hook="volume"> \
                </tbody> \
            </table> \
        </div> \
    </div> \
</div>',
    bindings: {
        'model.name' : {
            type : 'text',
            hook: 'name'
        }, 
	'model.description' : [{
            type : 'text',
            hook: 'description'
        },
        {
	    type : 'toggle',
	    hook: 'descriptionContainer'
	}]
    },
    initialize: function(opts)
    {
	View.prototype.initialize.apply(this, arguments);

	this.baseModel = opts.baseModel;
	this.model = opts.model;

	this.listenToAndRun(this.baseModel, 'change:mesh', this.changeModel);
    },
    changeModel: function()
    {
	this.model = this.baseModel.mesh;

        this.render();
    },
    render: function()
    {
	View.prototype.render.apply(this, arguments);
        
        var tbody = $( this.queryByHook( 'volume' ) );

        var sortedSubdomains = _.keys(this.model.volumes);

        for(var i = 0; i < sortedSubdomains.length; i++)
        {
            var subdomain = sortedSubdomains[i];

            $( '<tr><td>' + subdomain + '</td><td>' + this.model.volumes[subdomain] + '</td></tr>' ).appendTo( tbody );
        }
    }
});
