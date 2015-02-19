var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ModifyingInputView = require('./modifying-input-view');
var ModifyingNumberInputView = require('./modifying-number-input-view');
var SubdomainFormView = require('./subdomain');

var Tests = require('./tests');
module.exports = View.extend({
    removeSpecies: function()
    {
        this.model.collection.remove(this.model);
    },
    props : {
        valid : 'boolean',
        message : 'string'
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
    initialize : function()
    {
        View.prototype.initialize.apply(this, arguments);
        
        this.baseModel = this.model.collection.parent;
    },
    // This will get called by the SubdomainFormView children when a subdomain gets selected/deselected
    updateValid : function()
    {
        var valid = true;
        var message = '';

        for(var i = 0; i < this._subviews.length; i++)
        {
            if(typeof(this._subviews[i].valid) != "undefined")
            {
                valid = valid && this._subviews[i].valid;
                message = "Invalid species, please fix";
            }

            if(!valid)
                break;
        }

        this.valid = valid;
        this.message = message;
    },
    update : function(obj)
    {
        if(obj.name == "subdomains")
        {
            var subdomain = obj.value.model;
            var checked = obj.value.checked;
            // If we're already in the right state do nothing
            if(checked)
            {
                this.model.subdomains = _.union(this.model.subdomains, [subdomain.name]);
            }
            else
            {
                this.model.subdomains = _.difference(this.model.subdomains, [subdomain.name]);
            }
        }

        if(this.parent && this.parent.update)
            this.parent.update();

        if(this.parent && this.parent.parent && this.parent.parent.update)
            this.parent.parent.update();
    },
    updateSelected : function()
    {
        // We do two things in here: #1 make sure all members of this.model.subdomains are valid subdomains and #2 check the checkboxes in the collection that are selected
        var validSubdomains = this.baseModel.mesh.uniqueSubdomains.map( function(model) { return model.name; } );

        this.model.subdomains = _.intersection(this.model.subdomains, validSubdomains)

        // Select the currently selected model
        var inputs = $( this.queryByHook('subdomains') ).find('input');
        for(var i = 0; i < inputs.length; i++)
        {
            if(_.contains(this.model.subdomains, this.baseModel.mesh.uniqueSubdomains.models[i].name))
            {
                $( inputs.get(i) ).prop('checked', true);
            }
        }
    },
    renderSubdomains: function()
    {
        if(this.subdomainsView)
        {
            this.subdomainsView.remove();
        }

        this.subdomainsView = this.renderCollection(this.baseModel.mesh.uniqueSubdomains, SubdomainFormView, this.queryByHook('subdomains'));

        this.updateSelected();
    },
    render: function()
    {
        if(this.baseModel.isSpatial)
        {
            this.template = "<tr><td data-hook='name'></td><td data-hook='diffusion'></td><td><center><div data-hook='subdomains'></div></center></td><td><button class='btn' data-hook='delete'>x</button></td></tr>";
        }
        else
        {
            this.template = "<tr><td data-hook='name'></td><td data-hook='initialCondition'></td><td><button class='btn' data-hook='delete'>x</button></td></tr>";
        }

        View.prototype.render.apply(this, arguments);

        this.renderSubview(
            new ModifyingInputView({
                //template: '<div><div data-hook="label"></div><div><input type="text"></div><div data-hook="message-container"><div data-hook="message-text"></div></div></div>',
                label: '',
                name: 'name',
                value: this.model.name,
                required: false,
                placeholder: 'Name',
                model : this.model,
                parent : this,
                tests: [].concat(Tests.naming(this.model.collection, this.model))
            }), this.el.querySelector("[data-hook='name']"));

        if(this.baseModel.isSpatial)
        {
            this.renderSubview(
                new ModifyingNumberInputView({
                    //template: '<span><span data-hook="label"></span><div><input></div><div data-hook="message-container"><span data-hook="message-text"></span></div></span>',
                    label: '',
                    name: 'diffusion',
                    value: this.model.diffusion,
                    required: false,
                    placeholder: 'Diffusion Constant',
                    model : this.model,
                    parent : this,
                    tests: [].concat(Tests.isNumber(), Tests.positive())
                }), this.el.querySelector("[data-hook='diffusion']"));

            this.renderSubdomains();

            this.listenToAndRun(this.baseModel, 'change:mesh', _.bind(this.renderSubdomains, this));
        }
        else
        {
            this.renderSubview(
                new ModifyingNumberInputView({
                    //template: '<div><span data-hook="label"></span><div><input></div><div data-hook="message-container"><div data-hook="message-text"></div></div></div>',
                    label: '',
                    name: 'initialCondition',
                    value: this.model.initialCondition,
                    required: false,
                    placeholder: 'Initial Condition',
                    model : this.model,
                    parent : this,
                    tests: [].concat(Tests.nonzero(), Tests.units(this.model.collection.parent))
                }), this.el.querySelector("[data-hook='initialCondition']"));
        }

        return this;
    }
});
