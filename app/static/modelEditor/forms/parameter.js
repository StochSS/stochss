var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ModifyingInputView = require('./modifying-input-view')
var ModifyingNumberInputView = require('./modifying-number-input-view')

var Tests = require('./tests');
module.exports = View.extend({
    template: "<tr><td data-hook='name'></td><td data-hook='value'></td><td><button class='btn' data-hook='delete'>x</button></td></tr>",
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    update: function()
    {
    },
    removeParameter: function()
    {
        this.model.collection.remove(this.model);
    },
    events: {
        'click [data-hook="delete"]': 'removeParameter'
    },
    bindings: {
        'model.inUse' : {
            type: 'booleanAttribute',
            hook: 'delete',
            name: 'disabled'
        }
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.renderSubview(
            new ModifyingInputView({
                label: '',
                name: 'name',
                value: this.model.name,
                required: false,
                placeholder: 'Name',
                model : this.model,
                tests: [].concat(Tests.naming(this.model.collection, this.model))
            }), this.el.querySelector("[data-hook='name']"));

        this.renderSubview(
            new ModifyingInputView({
                label: '',
                name: 'value',
                value: this.model.value,
                required: false,
                placeholder: 'Value',
                model : this.model,
                tests: []
            }), this.el.querySelector("[data-hook='value']"));
        
        //Hide all the labels!
        $( this.el ).find('[data-hook="label"]').hide();

        return this;
    }
});
