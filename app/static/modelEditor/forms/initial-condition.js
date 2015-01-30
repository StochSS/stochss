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
    template : "<tr> \
  <td> \
    <button data-hook='delete'>x</button> \
  </td> \
  <td data-hook='typeSelect'></td> \
  <td data-hook='specie'></td> \
  <td data-hook='details'> \
    <table> \
      <tr> \
        <td>Count</td><td><div data-hook='count'></div></td> \
      </tr> \
      <tbody data-hook='xyz'> \
        <tr><td>X</td><td><div data-hook='X'></div></td></tr> \
        <tr><td>Y</td><td><div data-hook='Y'></div></td></tr> \
        <tr><td>Z</td><td><div data-hook='Z'></div></td></tr> \
      </tbody> \
      <tbody data-hook='subdomainTbody'> \
        <tr><td>Subdomain</td><td><div data-hook='subdomain'></div></td></tr> \
      </tbody> \
    </table> \
  </td> \
</tr>",
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
            this.model.subdomain = obj.value;
        }
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
        }
    },
    bindings: {
        'subdomainOrXYZ' : {
            type: 'switch',
            cases : {
                'subdomain' : '[data-hook="subdomainTbody"]',
                'xyz' : '[data-hook="xyz"]',
            }
        }
    },
    initialize : function()
    {
        View.prototype.initialize.apply(this, arguments);
    },
    renderSubdomainSelector: function()
    {
        if(this.subdomainSelector)
        {
            this.subdomainSelector.remove();
        }

        this.renderSubview(
            new SelectView({
                template: '<span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'subdomain',
                value: this.model.subdomain,
                options: this.baseModel.mesh.uniqueSubdomains,
                required: false,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            }), this.el.querySelector('[data-hook="subdomain"]'));
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.baseModel = this.collection.parent;

        this.renderSubview(
            new SelectView({
                template: '<span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'type',
                value: this.model.type,
                options: [['scatter', 'Scatter'], ['place', 'Place'], ['distribute', 'Distribute Uniformly']],
                required: true,
            }), this.el.querySelector("[data-hook='typeSelect']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'count',
                value: this.model.count,
                required: false,
                placeholder: 'Count',
                model : this.model,
                tests: [].concat(Tests.positive(), Tests.integer())
            }), this.el.querySelector("[data-hook='count']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'X',
                value: this.model.X,
                required: true,
                placeholder: 'X',
                model : this.model,
                tests: [].concat(Tests.isNumber())
            }), this.el.querySelector("[data-hook='X']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'Y',
                value: this.model.Y,
                required: true,
                placeholder: 'Y',
                model : this.model,
                tests: [].concat(Tests.isNumber())
            }), this.el.querySelector("[data-hook='Y']"));

        this.renderSubview(
            new ModifyingNumberInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'Z',
                value: this.model.Z,
                required: true,
                placeholder: 'Z',
                model : this.model,
                tests: [].concat(Tests.isNumber())
            }), this.el.querySelector("[data-hook='Z']"));

        this.renderSubview(
            new ModifyingSelectView({
                template: '<span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'specie',
                value: this.model.specie,
                options: this.baseModel.species,
                required: true,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            }), this.el.querySelector("[data-hook='specie']"));

        this.listenToAndRun(this.model, 'change:mesh', _.bind(this.renderSubdomainSelector, this));

        return this;
    }
});
