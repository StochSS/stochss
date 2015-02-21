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
        var valid = true;
        var message = '';
        
        for(var i = 0; i < this._subviews.length; i++)
        {
            if(typeof(this._subviews[i].valid) != "undefined")
            {
                valid = valid && this._subviews[i].valid;
                message = "Invalid parameter, please fix";
            }
            
            if(!valid)
                break;
        }
        
        this.valid = valid;
        this.message = message;
        
        if(this.parent && this.parent.update)
            this.parent.update();
        
        if(this.parent && this.parent.parent && this.parent.parent.update)
            this.parent.parent.update();
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
                parent : this,
                model : this.model,
                tests: [].concat(Tests.naming(this.model.collection, this.model), Tests.naming(this.model.collection.parent.species, this.model, "between species and parameters"))
            }), this.el.querySelector("[data-hook='name']"));

        this.renderSubview(
            new ModifyingInputView({
                label: '',
                name: 'value',
                value: this.model.value,
                required: false,
                placeholder: 'Value',
                parent : this,
                model : this.model,
                tests: []
            }), this.el.querySelector("[data-hook='value']"));
        
        //Hide all the labels!
        $( this.el ).find('[data-hook="label"]').hide();

        return this;
    }
});
