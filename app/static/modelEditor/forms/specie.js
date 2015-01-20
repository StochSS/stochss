var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ModifyingInputView = require('./modifying-input-view')
var ModifyingNumberInputView = require('./modifying-number-input-view')

var Tests = require('./tests');
module.exports = View.extend({
    template: "<tr><td><button data-hook='delete'>x</button></td><td data-hook='name'></td><td data-hook='initialCondition'></td></tr>",
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    update: function()
    {
    },
    removeSpecies: function()
    {
        this.model.collection.remove(this.model);
    },
    events: {
        'click [data-hook="delete"]': 'removeSpecies'
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
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: 'Name',
                name: 'name',
                value: this.model.name,
                required: false,
                placeholder: 'Name',
                model : this.model,
                tests: [].concat(Tests.naming(this.model.collection, this.model))
            }), this.el.querySelector("[data-hook='name']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: 'Initial Condition',
                name: 'initialCondition',
                value: this.model.initialCondition,
                required: false,
                placeholder: 'Initial Condition',
                model : this.model,
                tests: [].concat(Tests.nonzero(), Tests.units(this.model.collection.parent))
            }), this.el.querySelector("[data-hook='initialCondition']"));

        //Hide all the labels!
        $( this.el ).find('[data-hook="label"]').hide();

        return this;
    }
});
