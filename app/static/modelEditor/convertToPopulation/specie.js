var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');


module.exports = View.extend({
    template: "<tr><td data-hook='name'></td><td data-hook='initialCondition'></td></tr>",
    bindings: {
        'model.name' : {
            type: 'text',
            hook: 'name'
        }
    },
    volumeChange: function()
    {
        $( this.queryByHook('initialCondition') ).text(Math.round(this.model.initialCondition * this.baseView.volume));
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.baseView = this.parent.parent.parent;

        this.listenToAndRun(this.baseView, 'change:volume', this.volumeChange);

        return this;
    }
});
