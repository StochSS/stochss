var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var CheckboxView = require('ampersand-checkbox-view');

var Tests = require('./tests');
module.exports = View.extend({
    template: "<span data-hook='checkbox'></span>",
    update: function(element)
    {
        this.parent.update({ name : 'subdomains', value : { model : this.model, checked : element.value }} );
    },
    initialize : function(attr)
    {
        View.prototype.initialize.apply(this, arguments);

        this.specie = attr.specie;
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        var checked = _.contains(this.parent.model.subdomains, this.model.name);

        this.renderSubview(
            new CheckboxView({
                name: 'checkbox',
                template: '<span><span data-hook="label"></span> <input type="checkbox"><span data-hook="message-container"><span data-hook="message-text"></span></span></span>&nbsp;',
                label: String(this.model.name),
                value: checked,
                required: false,
                parent: this
            }), this.queryByHook('checkbox'));

        return this;
    }
});
