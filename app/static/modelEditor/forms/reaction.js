var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var ModifyingInputView = require('./modifying-input-view')
var ModifyingNumberInputView = require('./modifying-number-input-view')
var StoichSpecieCollectionFormView = require('./stoich-specie-collection');
var SubdomainFormView = require('./subdomain');
var SelectView = require('ampersand-select-view');

var katex = require('katex')

var Tests = require('./tests');
module.exports = View.extend({
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    update: function(obj)
    {
        if(obj.name == 'type')
        {
            this.model.type = obj.value;
        } else if(obj.name == 'parameter') {
            this.model.rate = obj.value;
        } else if(obj.name == 'subdomains') {
            if(obj.value.checked)
            {
                this.model.subdomains = _.union(this.model.subdomains, [obj.value.model.name]);
            }
            else
            {
                this.model.subdomains = _.difference(this.model.subdomains, [obj.value.model.name]);
            }
        }
    },
    renderSubdomains: function()
    {
        if(this.subdomainsView)
        {
            this.subdomainsView.remove();
        }

        this.subdomainsView = this.renderCollection(this.baseModel.mesh.uniqueSubdomains, SubdomainFormView, this.queryByHook('subdomains') );

        this.updateSelected();
    },
    updateSelected : function()
    {
        // We do two things in here: #1 make sure all members of this.model.subdomains are valid subdomains and #2 check the checkboxes in the collection that are selected
        var validSubdomains = this.collection.each( function(model) { return model.name; } );

        this.subdomains = _.filter(this.subdomains, function(value) { return _.contains(validSubdomains, value); })

        // Select the currently selected model
        var inputs = $( this.queryByHook('subdomains') ).find('input');
        for(var i = 0; i < inputs.length; i++)
        {
            if(_.contains(this.subdomains, this.baseModel.mesh.uniqueSubdomains.models[i].name))
            {
                $( inputs.get(i) ).prop('checked', true);
            }
        }
    },
    // On any change of anything, redraw the Latex
    redrawLatex: function(obj)
    {
        var latexString = '';

        var numReactants = this.model.reactants.models.length;
        if(numReactants == 0)
        {
            latexString = '\\emptyset';
        } else {
            for(var i = 0; i < numReactants; i++)
            {
                var stoichSpecie = this.model.reactants.models[i]; 
                latexString += stoichSpecie.stoichiometry + stoichSpecie.specie.name;
                
                if(i < numReactants - 1)
                    latexString += ' + ';
            }
        }
            
        latexString += ' \\rightarrow ';

        var numProducts = this.model.products.models.length;
        if(numProducts == 0)
        {
            latexString += '\\emptyset';
        } else {
            for(var i = 0; i < numProducts; i++)
            {
                var stoichSpecie = this.model.products.models[i]; 
                latexString += stoichSpecie.stoichiometry + stoichSpecie.specie.name;
                
                if(i < numProducts - 1)
                    latexString += ' + ';
            }
        }

        katex.render(latexString, this.queryByHook('latex'));
    },
    //Start the removal process... Eventually events will cause this.remove to get called. We don't have to do it explicitly though
    removeModel: function()
    {
        this.model.collection.remove(this.model);        
    },
    toggleEdit: function()
    {
        $( this.queryByHook('advanced') ).toggle();
    },
    events: {
        "click [data-hook='remove']" : "removeModel",
        "click [data-hook='edit']" : "toggleEdit"
    },
    bindings: {
        'model.type' : {
            type: 'switch',
            cases: {
                'massaction' : '[data-hook="parameter"]',
                'custom' : '[data-hook="custom"]'
            }
        }
    },
    render: function()
    {
        this.baseModel = this.model.collection.parent;

        if(this.baseModel.isSpatial)
        {
            this.template = "<tbody>\
  <tr data-hook='basic'>\
    <td><button data-hook='remove'>x</button></td>\
    <td><span data-hook='name'></span></td> \
    <td><span data-hook='typeSelect'></span></td> \
    <td><span data-hook='parameter'></span></td> \
    <td><span data-hook='custom'></span></td> \
    <td><span data-hook='subdomains'></span></td> \
    <td><span data-hook='latex'></span></td> \
    <td><button data-hook='edit'>Edit</button></td>\
  </tr>\
  <tr> \
    <td colspan='7'> \
      <table width='100%' data-hook='advanced'>\
        <tr> \
          <td><h4>Reactants</h4><div data-hook='reactants'></div></td>\
          <td><h4>Products</h4><div data-hook='products'></div></td>\
        </tr>\
      </table>\
    </td>\
  </tr>\
</tbody>";
        }
        else
        {
            this.template = "<tbody>\
  <tr data-hook='basic'>\
    <td><button data-hook='remove'>x</button></td>\
    <td><span data-hook='name'></span></td> \
    <td><span data-hook='typeSelect'></span></td> \
    <td><span data-hook='parameter'></span></td> \
    <td><span data-hook='custom'></span></td> \
    <td><span data-hook='latex'></span></td> \
    <td><button data-hook='edit'>Edit</button></td>\
  </tr>\
  <tr> \
    <td colspan='7'> \
      <table width='100%' data-hook='advanced'>\
        <tr> \
          <td><h4>Reactants</h4><div data-hook='reactants'></div></td>\
          <td><h4>Products</h4><div data-hook='products'></div></td>\
        </tr>\
      </table>\
    </td>\
  </tr>\
</tbody>";
        }

        View.prototype.render.apply(this, arguments);

        $( this.queryByHook('advanced') ).hide();

        this.listenTo(this.model, 'change', _.bind(this.redrawLatex, this));
        this.listenTo(this.model.reactants, 'add remove change', _.bind(this.redrawLatex, this));
        this.listenToAndRun(this.model.products, 'add remove change', _.bind(this.redrawLatex, this));

        this.renderSubview(
            new ModifyingInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'name',
                value: this.model.name,
                required: false,
                placeholder: 'Name',
                model : this.model,
                tests: [].concat(Tests.naming(this.model.collection, this.model))
            }), this.el.querySelector("[data-hook='name']"));

        this.renderSubview(
            new SelectView({
                template: '<span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'type',
                value: this.model.type,
                options: [['massaction', 'Mass action'], ['custom', 'Custom']],
                required: true,
            }), this.el.querySelector("[data-hook='typeSelect']"));

        this.renderSubview(
            new SelectView({
                template: '<span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'parameter',
                value: this.model.rate,
                options: this.baseModel.parameters,
                required: false,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            }), this.el.querySelector("[data-hook='parameter']"));

        this.renderSubview(
            new ModifyingInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'equation',
                value: this.model.equation,
                required: false,
                placeholder: '',
                model : this.model,
                tests: []
            }), this.el.querySelector("[data-hook='custom']"));

        if(this.baseModel.isSpatial)
        {
            this.renderSubdomains();

            this.listenToAndRun(this.baseModel, 'change:mesh', _.bind(this.renderSubdomains, this));
        }
        
        this.listenToAndRun(this.baseModel.mesh.uniqueSubdomains, 'add remove change', this.updateSelected);

        this.renderSubview(
            new StoichSpecieCollectionFormView({
                collection: this.model.reactants
            }), this.el.querySelector("[data-hook='reactants']"));

        this.renderSubview(
            new StoichSpecieCollectionFormView({
                collection: this.model.products
            }), this.el.querySelector("[data-hook='products']"));
        
        return this;
    }
});
