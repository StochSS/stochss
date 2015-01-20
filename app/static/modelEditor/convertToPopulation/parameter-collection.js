var $ = require('jquery');
var View = require('ampersand-view');
var ParameterView = require('./parameter');

var ParameterCollectionFormView = View.extend({
    template: "<div><div>Parameters editor<div><table data-hook='parametersTable'></table></div>",
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, ParameterView, this.el.querySelector('[data-hook=parametersTable]'));
        
        return this;
    }
});

module.exports = ParameterCollectionFormView