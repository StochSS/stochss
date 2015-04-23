var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ModifyingInputView = require('./modifying-input-view');
var ModifyingNumberInputView = require('./modifying-number-input-view');
var SelectView = require('ampersand-select-view');
var ModifyingSelectView = require('./modifying-select-view');
var SubdomainFormView = require('./subdomain');

var Tests = require('./tests');
module.exports = View.extend({
    template : "<tr data-hook='row'> \
  <td valign='top'> \
    <button class='btn' data-hook='delete'>x</button> \
  </td> \
  <td data-hook='typeSelect' valign='top'></td> \
  <td data-hook='specie' valign='top'></td> \
  <td data-hook='details' valign='top'> \
    <table> \
      <tr> \
        <td>Count:</td><td><div data-hook='count'></div></td> \
      </tr> \
      <tbody data-hook='xyz'> \
        <tr><td>X:</td><td><div data-hook='X'></div></td></tr> \
        <tr><td>Y:</td><td><div data-hook='Y'></div></td></tr> \
        <tr><td>Z:</td><td><div data-hook='Z'></div></td></tr> \
      </tbody> \
      <tbody data-hook='subdomainTbody'> \
        <tr><td>Subdomain</td><td><div data-hook='subdomain'></div></td></tr> \
      </tbody> \
    </table> \
  </td> \
</tr>",
    props : {
        valid : 'boolean',
        message : 'string'
    },
    updateValid : function()
    {
        var valid = true;
        var message = '';

        try
        {
            for(var i = 0; i < this._subviews.length; i++)
            {
                if(typeof(this._subviews[i].valid) != "undefined")
                {
                    valid = valid && this._subviews[i].valid;
                    message = "Invalid initial condition, please fix";
                }
                
                if(!valid)
                    break;
            }
        } catch(err) {
        }

        this.valid = valid;
        this.message = message;
    },
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    update: function(obj)
    {
        if(obj.name == 'type')
        {
            this.model.type = obj.value;
        } else if(obj.name == 'specie') {
            this.model.specie = obj.value;
        } else if(obj.name == 'subdomain') {
            if(typeof(obj.value) != 'undefined' && obj.value.length > 0)
                this.model.subdomain = Number(obj.value);
        }
        
        this.updateValid();

        if(this.parent && this.parent.update)
            this.parent.update();
    },
    removeThis: function()
    {
        this.model.collection.remove(this.model);
    },
    events: {
        'click [data-hook="delete"]': 'removeThis'
    },
    derived: {
        subdomainOrXYZ : {
            deps : ['model.type'],
            fn : function() {
                if(this.model.type == 'scatter' || this.model.type == 'distribute')
                {
                    return 'subdomain';
                }
                else
                {
                    return 'xyz';
                }
            }
        },
        invalid : {
            deps : ['valid'],
            fn : function() {
                return !this.valid;
            }
        }
    },
    bindings: {
        'subdomainOrXYZ' : {
            type: 'switch',
            cases : {
                'subdomain' : '[data-hook="subdomainTbody"]',
                'xyz' : '[data-hook="xyz"]',
            }
        },
        'invalid' : {
            type : 'booleanClass',
            name : 'invalidRow',
            hook : 'row'
        }
    },
    initialize : function()
    {
        View.prototype.initialize.apply(this, arguments);

        this.updateValid();
    },
    renderSubdomainSelector: function()
    {
        if(this.subdomainSelector)
        {
            this.subdomainSelector.remove();
        }

        var validSubdomains = this.baseModel.mesh.uniqueSubdomains.map( function(model) { return [String(model.name), String(model.name)]; } );

        this.subdomainSelector = this.renderSubview(
            new SelectView({
                template: '<div><select></select><div data-hook="message-container"><div class="message" data-hook="message-text"></div></div></div>',
                label: '',
                name: 'subdomain',
                value: String(this.model.subdomain),
                options: validSubdomains,
                unselectedText: 'Select subdomain',
                parent : this,
                required: true
            }), this.el.querySelector('[data-hook="subdomain"]'));

        this.update(this.subdomainSelector);
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.baseModel = this.collection.parent;

        this.renderSubview(
            new SelectView({
                template: '<div><select></select><div data-hook="message-container"><div class="message" data-hook="message-text"></div></div></div>',
                label: '',
                name: 'type',
                parent : this,
                value: this.model.type,
                options: [['scatter', 'Scatter'], ['place', 'Place'], ['distribute', 'Distribute Uniformly']],
                required: true,
            }), this.el.querySelector("[data-hook='typeSelect']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                //template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'count',
                value: this.model.count,
                required: false,
                parent : this,
                placeholder: 'Count',
                model : this.model,
                tests: [].concat(Tests.positive(), Tests.integer())
            }), this.el.querySelector("[data-hook='count']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                //template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'X',
                value: this.model.X,
                required: false,
                parent : this,
                placeholder: 'X',
                model : this.model,
                tests: [].concat(Tests.isNumber())
            }), this.el.querySelector("[data-hook='X']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                //template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'Y',
                value: this.model.Y,
                parent : this,
                required: false,
                placeholder: 'Y',
                model : this.model,
                tests: [].concat(Tests.isNumber())
            }), this.el.querySelector("[data-hook='Y']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                //template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'Z',
                value: this.model.Z,
                parent : this,
                required: false,
                placeholder: 'Z',
                model : this.model,
                tests: [].concat(Tests.isNumber())
            }), this.el.querySelector("[data-hook='Z']"));

        this.renderSubview(
            new ModifyingSelectView({
                template: '<div><select></select><div data-hook="message-container"><div class="message" data-hook="message-text"></div></div></div>',
                label: '',
                name: 'specie',
                value: this.model.specie,
                options: this.baseModel.species,
                unselectedText : 'Pick species',
                parent : this,
                required: true,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            }), this.el.querySelector("[data-hook='specie']"));

        this.listenToAndRun(this.baseModel, 'change:mesh', _.bind(this.renderSubdomainSelector, this));

        this.updateValid();
        return this;
    }
});
