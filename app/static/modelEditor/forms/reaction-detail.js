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
        var s1 = this.baseModel.species.at(0);
        var s2 = this.baseModel.species.at(1);

        if(obj.name == 'type')
        {
            this.model.type = obj.value;

            // Make sure we have a rate
            if(this.model.type != 'custom')
            {
                if(this.model.rate == null)
                {
                    this.model.rate = this.rateSelect.value;
                }
            }

            if(obj.value != 'custom' && obj.value != 'massaction')
            {
                var reactants;
                var products;

                if(obj.value == 'creation')
                {
                    reactants = 0;
                    products = 1;
                }
                else if(obj.value == 'destruction')
                {
                    reactants = 1;
                    products = 0;
                }
                if(obj.value == 'change')
                {
                    reactants = 1;
                    products = 1;
                }
                if(obj.value == 'dimerization')
                {
                    reactants = 1;
                    products = 1;
                }
                if(obj.value == 'split')
                {
                    reactants = 1;
                    products = 2;
                }
                if(obj.value == 'four')
                {
                    reactants = 2;
                    products = 2;
                }

                while(this.model.reactants.length > reactants)
                    this.model.reactants.remove(this.model.reactants.at(0));

                while(this.model.products.length > products)
                    this.model.products.remove(this.model.products.at(0));

                while(this.model.reactants.length < reactants)
                    this.model.reactants.addStoichSpecie(s1, 1);

                while(this.model.products.length < products)
                    this.model.products.addStoichSpecie(s2, 1);

                if(obj.value == 'dimerization')
                {
                    this.model.reactants.at(0).stoichiometry = 2;
                }
            }
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
    initialize: function(attr)
    {
        View.prototype.initialize.apply(this, arguments);

        this.model = attr.model;

        this.collection = this.model.collection.parent.mesh.uniqueSubdomains;
    },
    renderSubdomains: function()
    {
        if(this.subdomainsView)
        {
            this.subdomainsView.remove();
        }

        this.subdomainsView = this.renderCollection(this.baseModel.mesh.uniqueSubdomains, SubdomainFormView, this.el.querySelector('[data-hook="subdomains"]') );

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
    bindings: {
        'massAction' : {
            type : 'toggle',
            hook : 'parameter'
        },
        'showCustom' : {
            type : 'toggle',
            hook : 'custom'
        }
    },
    derived: {
        massAction :
        {
            deps : ['model.type'],
            fn : function() { return this.model.type != 'custom'; }
        },
        showCustom :
        {
            deps : ['model.type'],
            fn : function() { return this.model.type == 'custom'; }
        }
    },
    render: function()
    {
        this.baseModel = this.model.collection.parent;

        if(this.baseModel.isSpatial)
        {
            this.template = "<div> \
<div data-hook='latex' style='font-size: 35px;'></div> \
<div data-hook='typeSelect'></div> \
<div data-hook='parameter'></div> \
<div data-hook='custom'></div> \
<div>Subdomains reaction can occur in:</div> \
<div data-hook='subdomains'></div> \
  <table width='100%' data-hook='advanced'>\
    <tr> \
      <td><h4>Reactants</h4><div data-hook='reactants'></div></td>\
      <td><h4>Products</h4><div data-hook='products'></div></td>\
    </tr>\
  </table>\
</div>";
        }
        else
        {
            this.template = "<div>\
<div data-hook='latex'></div> \
<div data-hook='typeSelect'></div> \
<div data-hook='parameter'></div> \
<div data-hook='custom'></div> \
  <table width='100%' data-hook='advanced'>\
    <tr> \
      <td><h4>Reactants</h4><div data-hook='reactants'></div></td>\
      <td><h4>Products</h4><div data-hook='products'></div></td>\
    </tr>\
  </table>\
</div>";
        }

        View.prototype.render.apply(this, arguments);

        this.listenTo(this.model, 'change', _.bind(this.redrawLatex, this));
        this.listenTo(this.model.reactants, 'add remove change', _.bind(this.redrawLatex, this));
        this.listenToAndRun(this.model.products, 'add remove change', _.bind(this.redrawLatex, this));
        var options = [];
        var emptyDiv = $( '<div>' );
        katex.render('\\emptyset \\rightarrow A', emptyDiv[0]);
        options.push(['creation', emptyDiv.html()]);
        katex.render('A \\rightarrow \\emptyset', emptyDiv[0]);
        options.push(['destruction', emptyDiv.html()]);
        katex.render('A \\rightarrow B', emptyDiv[0]);
        options.push(['change', emptyDiv.html()]);
        katex.render('A + A \\rightarrow B', emptyDiv[0]);
        options.push(['dimerization', emptyDiv.html()]);
        katex.render('A \\rightarrow B + C', emptyDiv[0]);
        options.push(['split', emptyDiv.html()]);
        katex.render('A + B \\rightarrow C + D', emptyDiv[0]);
        options.push(['four', emptyDiv.html()]);
        options.push(['massaction', 'Mass action, custom stoichiometry']);
        options.push(['custom', 'Custom propensity, custom stoichiometry']);

        this.renderSubview(
            new SelectView({
                //template: '<span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: 'Reaction Type: ',
                name: 'type',
                value: this.model.type,
                options: options,
                required: true,
            }), this.el.querySelector("[data-hook='typeSelect']"));

        var selected = this.model.rate;
        if(selected == null)
            selected = this.baseModel.parameters.at(0);

        this.rateSelect = this.renderSubview(
            new SelectView({
                //template: '<span><select></select><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: 'Rate parameter: ',
                name: 'parameter',
                value: selected,
                options: this.baseModel.parameters,
                required: false,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            }), this.el.querySelector("[data-hook='parameter']"));

        this.renderSubview(
            new ModifyingInputView({
                //template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: 'Custom rate equation: ',
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
