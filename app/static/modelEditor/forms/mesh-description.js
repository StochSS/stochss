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
        <table cellpadding="5" width="100%"> \
        <tr> \
        <td data-hook="descriptionContainer" width="33%" valign="top"> \
            <h5>Description:</h5> \
            <pre data-hook="description"> \
            </pre> \
        </td> \
        <td valign="top"> \
            <h5>Volumes:</h5> \
            <table class="table"> \
                <tr> \
                    <th>Subdomain</th> \
                    <th>Volume</th> \
                </tr> \
                <tbody data-hook="volume"> \
                </tbody> \
            </table> \
        </td> \
        <td valign="top"> \
            <h5>Bounds:</h5> \
            <table class="table"> \
                <tr> \
                    <th>Axis</th> \
                    <th>Min</th> \
                    <th>Max</th> \
                </tr> \
                <tbody> \
                    <tr><td>x-axis</td><td data-hook="minx"></td><td data-hook="maxx"></td></tr> \
                    <tr><td>y-axis</td><td data-hook="miny"></td><td data-hook="maxy"></td></tr> \
                    <tr><td>z-axis</td><td data-hook="minz"></td><td data-hook="maxz"></td></tr> \
                </tbody> \
            </table> \
        </td> \
        </tr> \
        </table> \
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

            $( '<tr><td>' + subdomain + '</td><td>' + this.model.volumes[subdomain].toExponential(4) + '</td></tr>' ).appendTo( tbody );
        }

        $( this.queryByHook( 'minx' ) ).text( this.model.boundingBox[0][0].toExponential(4) );
        $( this.queryByHook( 'miny' ) ).text( this.model.boundingBox[1][0].toExponential(4) );
        $( this.queryByHook( 'minz' ) ).text( this.model.boundingBox[2][0].toExponential(4) );
        $( this.queryByHook( 'maxx' ) ).text( this.model.boundingBox[0][1].toExponential(4) );
        $( this.queryByHook( 'maxy' ) ).text( this.model.boundingBox[1][1].toExponential(4) );
        $( this.queryByHook( 'maxz' ) ).text( this.model.boundingBox[2][1].toExponential(4) );
    }
});
