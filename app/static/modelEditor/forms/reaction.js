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
    template : "<tr data-hook='row'>\
    <td><center><input type='radio' name='reaction' data-hook='radio'></center></td>\
    <td><center><span data-hook='name'></span></center></td> \
    <td><center><span data-hook='latex'></span></center></td> \
    <td><center><button class='btn' data-hook='remove'>x</button></center></td>\
  </tr>",
    props : {
        valid : 'boolean',
        message : 'string'
    },
    updateValid : function()
    {
        this.valid = (!this.nameBox || this.nameBox.valid) && !this.notValid;
        this.message = '';

        if(!this.valid)
            this.message = "Invalid reaction, please fix";
    },
    update : function(obj)
    {
        this.updateValid();

        if(this.parent && this.parent.update)
            this.parent.update();

        if(this.parent && this.parent.parent && this.parent.parent.update)
            this.parent.parent.update();
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
                var name = (stoichSpecie.specie) ? stoichSpecie.specie.name : 'X';

                if(stoichSpecie.stoichiometry > 1)
                    latexString += stoichSpecie.stoichiometry + name;
                else
                    latexString += name;
                
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
                var name = (stoichSpecie.specie) ? stoichSpecie.specie.name : 'X';

                if(stoichSpecie.stoichiometry > 1)
                    latexString += stoichSpecie.stoichiometry + name;
                else
                    latexString += name;
                
                if(i < numProducts - 1)
                    latexString += ' + ';
            }
        }

        latexString = latexString.replace(/_/g, '\\_');
        katex.render(latexString, this.queryByHook('latex'));
    },
    //Start the removal process... Eventually events will cause this.remove to get called. We don't have to do it explicitly though
    removeModel: function()
    {
        if(confirm('Are you sure you want to delete reaction ' + this.model.name + '?'))
            this.model.collection.remove(this.model);        
    },
    // These two functions are a little weird. The first calls the parent select function
    //  But by design the parent is a paginatedCollectionView
    //  Which calls select on the model selected... So calling selectMe gets select called too
    selectMe : function()
    {
        this.parent.parent.select(this.model);
    },
    select : function()
    {
        $( this.el ).find( "[data-hook='radio']" ).prop('checked', true);
    },
    derived: {
        "invalid": {
            deps : ['model.valid', 'valid'],
            fn : function() { return !(this.model.valid && this.valid); }
        }
    },
    bindings: {
        "invalid" : {
            type : 'booleanClass',
            hook : 'row',
            name: 'invalidRow'
        }
    },
    events: {
        "click [data-hook='remove']" : "removeModel",
        "click [data-hook='radio']" : "selectMe"
    },
    remove: function()
    {
        this.stopListening();

        View.prototype.remove.apply(this, arguments);
    },
    initialize: function()
    {
        View.prototype.render.apply(this, arguments);

        this.updateValid();
    },
    render: function()
    {
        this.baseModel = this.model.collection.parent;

        View.prototype.render.apply(this, arguments);

        this.listenTo(this.model, 'change', _.bind(this.update, this));
        this.listenTo(this.model, 'change', _.bind(this.redrawLatex, this));
        this.listenTo(this.model.reactants, 'add remove change', _.bind(this.redrawLatex, this));
        this.listenToAndRun(this.model.products, 'add remove change', _.bind(this.redrawLatex, this));

        this.nameBox = this.renderSubview(
            new ModifyingInputView({
                //template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'name',
                value: this.model.name,
                parent : this,
                required: false,
                placeholder: 'Name',
                model : this.model,
                tests: [].concat(Tests.naming(this.model.collection, this.model))
            }), this.el.querySelector("[data-hook='name']"));
        
        this.updateValid();
        return this;
    }
});
