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
    <br /> \
    <div> \
        <h5>Mesh Description:</h5> \
        <pre data-hook="description"> \
        </pre> \
    </div> \
</div>',
    bindings: {
        'model.name' : {
            type : 'text',
            hook: 'name'
        },
        'model.description' : {
            type : 'text',
            hook: 'description'
        }
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
    }
});
